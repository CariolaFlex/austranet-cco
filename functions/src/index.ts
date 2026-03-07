// ============================================================
// Cloud Functions — Austranet CCO
// ============================================================
// DEPLOY: requiere Firebase Blaze plan. Ver SETUP.md para instrucciones.
//
// Pasos para hacer deploy:
//   1. Verificar que el proyecto Firebase está en plan Blaze (pay-as-you-go)
//   2. Agregar sección "functions" en firebase.json:
//        "functions": { "source": "functions" }
//   3. cd functions && npm install
//   4. firebase deploy --only functions
//
// Variables de entorno necesarias (firebase functions:config:set):
//   No se requieren variables adicionales — usa Application Default Credentials.
// ============================================================

import * as admin from 'firebase-admin'
import {
  onDocumentWritten,
  type FirestoreEvent,
  type Change,
  type DocumentSnapshot,
} from 'firebase-functions/v2/firestore'
import { onSchedule } from 'firebase-functions/v2/scheduler'
import { logger } from 'firebase-functions/v2'
import type { Tarea, Proyecto, KPIsDashboard } from './types'
import {
  generarSnapshotId,
  calcularKPIsDesdeArrayTareas,
  construirSnapshotDesdeTareas,
} from './evm-helpers'

// -------------------------------------------------------
// INICIALIZACIÓN ADMIN SDK
// -------------------------------------------------------

if (admin.apps.length === 0) {
  admin.initializeApp()
}

const db = admin.firestore()

// -------------------------------------------------------
// HELPERS INTERNOS
// -------------------------------------------------------

/**
 * Convierte los Timestamps de Firestore a Date de JS.
 * Replica la lógica de src/lib/firebase/firestore.ts:convertTimestamps.
 */
function convertTimestamps(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === 'object' && '_seconds' in value && '_nanoseconds' in value) {
      result[key] = new Date(
        (value as { _seconds: number })._seconds * 1000 +
        Math.floor((value as { _nanoseconds: number })._nanoseconds / 1e6),
      )
    } else if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate: unknown }).toDate === 'function') {
      result[key] = (value as admin.firestore.Timestamp).toDate()
    } else {
      result[key] = value
    }
  }
  return result
}

function docToTarea(id: string, data: admin.firestore.DocumentData): Tarea {
  const converted = convertTimestamps(data)
  return {
    id,
    proyectoId: converted.proyectoId as string,
    estado: converted.estado as Tarea['estado'],
    porcentajeAvance: (converted.porcentajeAvance as number) ?? 0,
    costoPlaneado: (converted.costoPlaneado as number) ?? 0,
    costoReal: converted.costoReal as number | undefined,
    fechaInicioPlaneada: converted.fechaInicioPlaneada as Date,
    fechaFinPlaneada: converted.fechaFinPlaneada as Date,
  }
}

async function getTareasDeProyecto(proyectoId: string): Promise<Tarea[]> {
  const snap = await db
    .collection('tareas')
    .where('proyectoId', '==', proyectoId)
    .get()
  return snap.docs.map((d) => docToTarea(d.id, d.data()))
}

// -------------------------------------------------------
// FUNCIÓN A — onTareaWrite
// -------------------------------------------------------
//
// Trigger: cuando se escribe un documento en la colección 'tareas'.
// Propósito: recalcular kpisDashboard en proyectos/{proyectoId}
//   cuando cambia porcentajeAvance o costoReal.
//
// Campos que escribe en proyectos/{proyectoId}/kpisDashboard:
//   spi, cpi, pv, ev, ac, eac, bac, pctAvanceTareas,
//   pctAvancePonderado, semaforoGeneral, actualizadoEn

export const onTareaWrite = onDocumentWritten(
  'tareas/{tareaId}',
  async (event: FirestoreEvent<Change<DocumentSnapshot> | undefined>) => {
    const change = event.data
    if (!change) return

    const before = change.before?.data()
    const after = change.after?.data()

    // Solo procesar si cambió porcentajeAvance o costoReal
    const avanceCambio =
      (before?.porcentajeAvance ?? null) !== (after?.porcentajeAvance ?? null)
    const costoCambio = (before?.costoReal ?? null) !== (after?.costoReal ?? null)

    if (!avanceCambio && !costoCambio) {
      logger.debug('[onTareaWrite] Sin cambio relevante — skipping')
      return
    }

    // Obtener proyectoId desde el documento after (o before si fue delete)
    const proyectoId = (after?.proyectoId ?? before?.proyectoId) as string | undefined
    if (!proyectoId) {
      logger.warn('[onTareaWrite] tareaId sin proyectoId — skipping', { tareaId: event.params.tareaId })
      return
    }

    // Leer datos del proyecto (BAC)
    const proyectoDoc = await db.collection('proyectos').doc(proyectoId).get()
    if (!proyectoDoc.exists) {
      logger.warn('[onTareaWrite] Proyecto no encontrado', { proyectoId })
      return
    }
    const proyectoData = proyectoDoc.data()!
    const bac: number = proyectoData.presupuestoEstimado ?? 0

    // Leer todas las tareas del proyecto
    const tareas = await getTareasDeProyecto(proyectoId)

    // Calcular KPIs
    const kpis = calcularKPIsDesdeArrayTareas(tareas, bac)

    const kpisDashboard: KPIsDashboard = {
      ...kpis,
      actualizadoEn: new Date(),
    }

    // Guardar en el documento del proyecto (campo embebido para reads O(1))
    await db.collection('proyectos').doc(proyectoId).update({
      kpisDashboard: {
        ...kpisDashboard,
        actualizadoEn: admin.firestore.FieldValue.serverTimestamp(),
      },
    })

    logger.info('[onTareaWrite] kpisDashboard actualizado', {
      proyectoId,
      spi: kpis.spi,
      cpi: kpis.cpi,
      semaforoGeneral: kpis.semaforoGeneral,
    })
  },
)

// -------------------------------------------------------
// FUNCIÓN B — scheduledEVMSnapshot
// -------------------------------------------------------
//
// Schedule: todos los lunes a las 06:00 (America/Santiago)
// Propósito: crear snapshot EVM semanal para todos los proyectos activos.
//
// Proyectos procesados: estado in ['activo_en_definicion', 'activo_en_desarrollo']
// Batch: máx. 10 proyectos simultáneos (Promise.allSettled)
// Log de resultado: proyectos procesados, fallidos.

const ESTADOS_ACTIVOS: Proyecto['estado'][] = [
  'activo_en_definicion',
  'activo_en_desarrollo',
]

async function procesarSnapshotProyecto(
  proyectoDoc: admin.firestore.QueryDocumentSnapshot,
  fecha: Date,
): Promise<void> {
  const proyectoId = proyectoDoc.id
  const proyectoData = proyectoDoc.data()
  const bac: number = proyectoData.presupuestoEstimado ?? 0

  const tareas = await getTareasDeProyecto(proyectoId)
  if (tareas.length === 0) {
    logger.info(`[scheduledEVMSnapshot] Proyecto sin tareas — skipping`, { proyectoId })
    return
  }

  const snapshotId = generarSnapshotId(fecha)
  const snapshotPayload = construirSnapshotDesdeTareas(tareas, bac, fecha)

  const snapshotRef = db
    .collection('proyectos')
    .doc(proyectoId)
    .collection('snapshots_evm')
    .doc(snapshotId)

  // Idempotente: upsert por ID (lunes ISO). Preserva creadoEn si ya existe.
  const existing = await snapshotRef.get()
  const creadoEn = existing.exists
    ? existing.data()!.creadoEn
    : admin.firestore.FieldValue.serverTimestamp()

  await snapshotRef.set({
    ...snapshotPayload,
    fecha: admin.firestore.Timestamp.fromDate(snapshotPayload.fecha),
    creadoEn,
  })

  logger.info(`[scheduledEVMSnapshot] Snapshot guardado`, {
    proyectoId,
    snapshotId,
    spi: snapshotPayload.spi,
    cpi: snapshotPayload.cpi,
  })
}

export const scheduledEVMSnapshot = onSchedule(
  {
    schedule: 'every monday 06:00',
    timeZone: 'America/Santiago',
    retryCount: 2,
  },
  async () => {
    const fecha = new Date()
    logger.info('[scheduledEVMSnapshot] Iniciando snapshot semanal EVM', {
      fecha: fecha.toISOString(),
      snapshotId: generarSnapshotId(fecha),
    })

    // Obtener todos los proyectos activos
    const proyectosSnap = await db
      .collection('proyectos')
      .where('estado', 'in', ESTADOS_ACTIVOS)
      .get()

    if (proyectosSnap.empty) {
      logger.info('[scheduledEVMSnapshot] Sin proyectos activos — terminando')
      return
    }

    const proyectos = proyectosSnap.docs
    logger.info(`[scheduledEVMSnapshot] ${proyectos.length} proyecto(s) a procesar`)

    // Procesar en batches de máx. 10 simultáneos
    const BATCH_SIZE = 10
    let procesados = 0
    let fallidos = 0

    for (let i = 0; i < proyectos.length; i += BATCH_SIZE) {
      const batch = proyectos.slice(i, i + BATCH_SIZE)

      const resultados = await Promise.allSettled(
        batch.map((doc) => procesarSnapshotProyecto(doc, fecha)),
      )

      for (const resultado of resultados) {
        if (resultado.status === 'fulfilled') {
          procesados++
        } else {
          fallidos++
          logger.error('[scheduledEVMSnapshot] Error procesando proyecto', {
            error: resultado.reason,
          })
        }
      }
    }

    logger.info('[scheduledEVMSnapshot] Snapshot semanal completado', {
      total: proyectos.length,
      procesados,
      fallidos,
    })
  },
)
