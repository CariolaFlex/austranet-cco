// ============================================================
// SERVICIO: EVM (Earned Value Management) — Módulo 4 (Sprint M4-S01)
// Subcol. Firestore: 'proyectos/{proyectoId}/snapshots_evm'
// Estrategia: Snapshots semanales (≤104 docs en 2 años) por proyecto.
// ============================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore'
import { getFirestoreDb, convertTimestamps, removeUndefined } from '@/lib/firebase/firestore'
import type { SnapshotEVM, KPIsDashboard, Tarea } from '@/types'
import {
  calcularSPI,
  calcularCPI,
  calcularSV,
  calcularCV,
  calcularEAC,
  calcularETC,
  calcularTCPI,
  calcularSemaforoSPI,
  calcularSemaforoCPI,
  calcularSemaforoGeneral,
} from '@/constants/evm'

const COLECCION_PROYECTOS = 'proyectos'
const SUBCOLECCION_SNAPSHOTS = 'snapshots_evm'

// -------------------------------------------------------
// HELPERS INTERNOS
// -------------------------------------------------------

function docToSnapshot(id: string, data: Record<string, unknown>): SnapshotEVM {
  return convertTimestamps({ id, ...data }) as SnapshotEVM
}

/** Genera el ID del snapshot en formato ISO date del lunes de la semana. */
function generarSnapshotId(fecha: Date): string {
  const d = new Date(fecha)
  const diaSemana = d.getDay()           // 0 = domingo
  const diasParaLunes = diaSemana === 0 ? -6 : 1 - diaSemana
  d.setDate(d.getDate() + diasParaLunes)
  return d.toISOString().slice(0, 10)    // "2026-03-02"
}

/**
 * Calcula EV (Earned Value) acumulado a partir del array de tareas.
 * EV = Σ (costoPlaneado × porcentajeAvance / 100)
 */
function calcularEVDesdeTareas(tareas: Tarea[]): number {
  return tareas.reduce((sum, t) => sum + (t.costoPlaneado * t.porcentajeAvance) / 100, 0)
}

/**
 * Calcula AC (Actual Cost) acumulado desde tareas.
 */
function calcularACDesdeTareas(tareas: Tarea[]): number {
  return tareas.reduce((sum, t) => sum + (t.costoReal ?? 0), 0)
}

/**
 * Calcula PV (Planned Value) a una fecha dada.
 * Versión simplificada: suma costoPlaneado de tareas que debían haber iniciado antes de `fecha`.
 */
function calcularPVDesdeTareas(tareas: Tarea[], fecha: Date): number {
  return tareas
    .filter((t) => t.fechaInicioPlaneada <= fecha)
    .reduce((sum, t) => sum + t.costoPlaneado, 0)
}

// -------------------------------------------------------
// SERVICIO PRINCIPAL
// -------------------------------------------------------

export const evmService = {
  /**
   * Obtiene todos los snapshots EVM de un proyecto, ordenados por fecha ASC.
   * Ideal para alimentar gráficos de series temporales (Curvas S, EVM).
   */
  getSnapshotsEVM: async (proyectoId: string): Promise<SnapshotEVM[]> => {
    const db = getFirestoreDb()
    const ref = collection(db, COLECCION_PROYECTOS, proyectoId, SUBCOLECCION_SNAPSHOTS)
    const q = query(ref, orderBy('fecha', 'asc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => docToSnapshot(d.id, d.data()))
  },

  /**
   * Obtiene los últimos N snapshots EVM (ordenados DESC, los más recientes primero).
   */
  getUltimosSnapshots: async (proyectoId: string, n = 12): Promise<SnapshotEVM[]> => {
    const db = getFirestoreDb()
    const ref = collection(db, COLECCION_PROYECTOS, proyectoId, SUBCOLECCION_SNAPSHOTS)
    const q = query(ref, orderBy('fecha', 'desc'), limit(n))
    const snap = await getDocs(q)
    return snap.docs.map((d) => docToSnapshot(d.id, d.data())).reverse()
  },

  /** Obtiene el snapshot más reciente (el último guardado). */
  getSnapshotActual: async (proyectoId: string): Promise<SnapshotEVM | null> => {
    const db = getFirestoreDb()
    const ref = collection(db, COLECCION_PROYECTOS, proyectoId, SUBCOLECCION_SNAPSHOTS)
    const q = query(ref, orderBy('fecha', 'desc'), limit(1))
    const snap = await getDocs(q)
    if (snap.empty) return null
    const d = snap.docs[0]
    return docToSnapshot(d.id, d.data())
  },

  /**
   * Crea un nuevo snapshot EVM.
   * El ID del documento es la fecha del lunes de la semana actual (idempotente si se ejecuta varias veces).
   * Si el snapshot de esa semana ya existe, lo actualiza.
   */
  crearSnapshot: async (
    proyectoId: string,
    datos: {
      bac: number
      pv: number
      ev: number
      ac: number
      fecha?: Date
    },
  ): Promise<SnapshotEVM> => {
    const db = getFirestoreDb()
    const fecha = datos.fecha ?? new Date()
    const snapshotId = generarSnapshotId(fecha)

    const spi = calcularSPI(datos.ev, datos.pv)
    const cpi = calcularCPI(datos.ev, datos.ac)
    const sv = calcularSV(datos.ev, datos.pv)
    const cv = calcularCV(datos.ev, datos.ac)
    const eac = calcularEAC(datos.bac, cpi)
    const etc = calcularETC(eac, datos.ac)
    const tcpi = calcularTCPI(datos.bac, datos.ev, datos.ac)

    const semaforoSPI = calcularSemaforoSPI(spi)
    const semaforoCPI = calcularSemaforoCPI(cpi)

    const docData = removeUndefined({
      fecha: Timestamp.fromDate(fecha),
      bac: datos.bac,
      pv: datos.pv,
      ev: datos.ev,
      ac: datos.ac,
      spi,
      cpi,
      sv,
      cv,
      eac,
      etc,
      tcpi,
      semaforoSPI: semaforoSPI === 'sin_datos' ? 'rojo' : semaforoSPI,
      semaforoCPI: semaforoCPI === 'sin_datos' ? 'rojo' : semaforoCPI,
      creadoEn: Timestamp.now(),
    })

    // Upsert: si ya existe el snapshot de esta semana, actualiza; si no, crea.
    const ref = collection(db, COLECCION_PROYECTOS, proyectoId, SUBCOLECCION_SNAPSHOTS)
    const existingDoc = doc(ref, snapshotId)
    const existing = await getDoc(existingDoc)

    if (existing.exists()) {
      await updateDoc(existingDoc, { ...docData, creadoEn: existing.data().creadoEn })
    } else {
      await addDoc(collection(db, COLECCION_PROYECTOS, proyectoId, SUBCOLECCION_SNAPSHOTS), {
        ...docData,
        id: snapshotId,
      })
    }

    return docToSnapshot(snapshotId, docData)
  },

  /**
   * Calcula los KPIs actuales desde el array de tareas (sin guardar snapshot).
   * Útil para mostrar valores en tiempo real antes del próximo snapshot semanal.
   */
  calcularKPIsActuales: (
    tareas: Tarea[],
    bac: number,
    fecha: Date = new Date(),
  ): Omit<KPIsDashboard, 'actualizadoEn'> => {
    const ev = calcularEVDesdeTareas(tareas)
    const ac = calcularACDesdeTareas(tareas)
    const pv = calcularPVDesdeTareas(tareas, fecha)

    const spi = calcularSPI(ev, pv)
    const cpi = calcularCPI(ev, ac)
    const eac = calcularEAC(bac, cpi)

    const semaforoSPI = calcularSemaforoSPI(spi)
    const semaforoCPI = calcularSemaforoCPI(cpi)

    const completadas = tareas.filter((t) => t.estado === 'completada').length
    const pctAvanceTareas = tareas.length > 0 ? (completadas / tareas.length) * 100 : 0
    const pctAvancePonderado = bac > 0 ? (ev / bac) * 100 : 0

    return {
      spi,
      cpi,
      pv,
      ev,
      ac,
      eac,
      bac,
      pctAvanceTareas: Math.round(pctAvanceTareas * 10) / 10,
      pctAvancePonderado: Math.round(pctAvancePonderado * 10) / 10,
      diasRestantes: 0,       // Se calcula en el componente desde fechaFinEstimada
      desviacionDias: 0,      // Se calcula comparando con línea base
      semaforoGeneral: calcularSemaforoGeneral(semaforoSPI, semaforoCPI),
      semaforoCronograma: semaforoSPI === 'sin_datos' ? 'verde' : semaforoSPI,
      semaforoCostos: semaforoCPI === 'sin_datos' ? 'verde' : semaforoCPI,
    }
  },

  /**
   * Crea un snapshot automáticamente desde las tareas del proyecto.
   * Llama a crearSnapshot con los valores calculados.
   */
  crearSnapshotDesdeTareas: async (
    proyectoId: string,
    tareas: Tarea[],
    bac: number,
    fecha: Date = new Date(),
  ): Promise<SnapshotEVM> => {
    const ev = calcularEVDesdeTareas(tareas)
    const ac = calcularACDesdeTareas(tareas)
    const pv = calcularPVDesdeTareas(tareas, fecha)

    return evmService.crearSnapshot(proyectoId, { bac, pv, ev, ac, fecha })
  },
}
