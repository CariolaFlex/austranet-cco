// ============================================================
// SERVICIO: Tareas — Módulo 4 (Sprint M4-S01)
// Colección Firestore: 'tareas' (top-level, con proyectoId FK)
// ============================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { getFirestoreDb, convertTimestamps, removeUndefined } from '@/lib/firebase/firestore'
import { getCurrentUserId, getFirebaseAuth } from '@/lib/firebase/auth'
import type { Tarea, CrearTareaDTO, ActualizarTareaDTO, EstadoTarea, Partida } from '@/types'

const COLECCION = 'tareas'

function docToTarea(id: string, data: Record<string, unknown>): Tarea {
  const converted = convertTimestamps({ id, ...data }) as Tarea
  converted.dependencias = converted.dependencias ?? []
  converted.asignaciones = converted.asignaciones ?? []
  return converted
}

// -------------------------------------------------------
// SERVICIO PRINCIPAL
// -------------------------------------------------------

export const tareasService = {
  /** Obtiene todas las tareas de un proyecto, ordenadas por `orden`. */
  getByProyectoId: async (proyectoId: string): Promise<Tarea[]> => {
    const db = getFirestoreDb()
    const q = query(
      collection(db, COLECCION),
      where('proyectoId', '==', proyectoId),
      orderBy('orden', 'asc'),
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => docToTarea(d.id, d.data()))
  },

  /** Obtiene una tarea por ID. Retorna null si no existe. */
  getById: async (id: string): Promise<Tarea | null> => {
    const db = getFirestoreDb()
    const snap = await getDoc(doc(db, COLECCION, id))
    if (!snap.exists()) return null
    return docToTarea(snap.id, snap.data())
  },

  /** Obtiene solo las tareas críticas de un proyecto (holguraTotal === 0). */
  getCriticas: async (proyectoId: string): Promise<Tarea[]> => {
    const db = getFirestoreDb()
    const q = query(
      collection(db, COLECCION),
      where('proyectoId', '==', proyectoId),
      where('esCritica', '==', true),
      orderBy('orden', 'asc'),
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => docToTarea(d.id, d.data()))
  },

  /** Obtiene tareas filtradas por estado. */
  getByEstado: async (proyectoId: string, estado: EstadoTarea): Promise<Tarea[]> => {
    const db = getFirestoreDb()
    const q = query(
      collection(db, COLECCION),
      where('proyectoId', '==', proyectoId),
      where('estado', '==', estado),
      orderBy('orden', 'asc'),
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => docToTarea(d.id, d.data()))
  },

  /** Crea una nueva tarea. */
  create: async (data: CrearTareaDTO): Promise<Tarea> => {
    const db = getFirestoreDb()
    const uid = getCurrentUserId()
    const ahora = Timestamp.now()

    const docData = removeUndefined({
      ...data,
      dependencias: data.dependencias ?? [],
      asignaciones: data.asignaciones ?? [],
      porcentajeAvance: data.porcentajeAvance ?? 0,
      esCritica: false,             // Calculado por CPM, no provisto en creación
      costoReal: data.costoReal ?? 0,
      creadoEn: ahora,
      actualizadoEn: ahora,
      creadoPor: uid,
    })

    const docRef = await addDoc(collection(db, COLECCION), docData)
    const created = await tareasService.getById(docRef.id)
    if (!created) throw new Error('Tarea no encontrada después de crear')
    return created
  },

  /** Actualiza una tarea existente. */
  update: async (id: string, data: ActualizarTareaDTO): Promise<Tarea> => {
    const db = getFirestoreDb()
    const ahora = Timestamp.now()

    await updateDoc(doc(db, COLECCION, id), removeUndefined({
      ...data,
      actualizadoEn: ahora,
    }))

    const updated = await tareasService.getById(id)
    if (!updated) throw new Error('Tarea no encontrada después de actualizar')
    return updated
  },

  /** Actualiza el porcentaje de avance y estado de una tarea. */
  updateAvance: async (
    id: string,
    porcentajeAvance: number,
    estado?: EstadoTarea,
    proyectoId?: string,
  ): Promise<void> => {
    const db = getFirestoreDb()
    const updateData: Record<string, unknown> = {
      porcentajeAvance,
      actualizadoEn: Timestamp.now(),
    }
    if (estado) updateData.estado = estado
    await updateDoc(doc(db, COLECCION, id), updateData)

    // P3: Snapshot EVM semanal idempotente (silencioso)
    if (proyectoId) {
      try {
        const { evmService } = await import('./evm.service')
        const tareas = await tareasService.getByProyectoId(proyectoId)
        const proySnap = await getDoc(doc(db, 'proyectos', proyectoId))
        const bac = (proySnap.data()?.presupuestoEstimado as number | undefined) ?? 0
        if (bac > 0) {
          await evmService.crearSnapshotDesdeTareas(proyectoId, tareas, bac, new Date())
        }
      } catch { /* silencioso — no bloquear la actualización de avance */ }
    }
  },

  /**
   * Actualiza campos CPM cacheados (ES, EF, LS, LF, holguras, esCritica).
   * ES/EF/LS/LF son números enteros de días desde el día 0 del proyecto,
   * consistente con ResultadoNodoCPM en src/lib/cpm.ts y Tarea en types/index.ts.
   */
  updateCPMCache: async (
    id: string,
    cpm: {
      es?: number; ef?: number; ls?: number; lf?: number
      holguraTotal?: number; holguraLibre?: number; esCritica: boolean
    },
  ): Promise<void> => {
    const db = getFirestoreDb()
    await updateDoc(doc(db, COLECCION, id), removeUndefined({
      ...cpm,
      actualizadoEn: Timestamp.now(),
    }))
  },

  /**
   * Soft delete: cambia estado a 'suspendida'.
   * Las tareas NO se eliminan de Firestore.
   */
  delete: async (id: string): Promise<void> => {
    await tareasService.update(id, { estado: 'suspendida' })
  },

  /** Reordena las tareas de un proyecto actualizando el campo `orden`. */
  reordenar: async (proyectoId: string, ordenIds: string[]): Promise<void> => {
    const db = getFirestoreDb()
    const ahora = Timestamp.now()
    await Promise.all(
      ordenIds.map((id, index) =>
        updateDoc(doc(db, COLECCION, id), { orden: index, actualizadoEn: ahora })
      )
    )
    void proyectoId // FK reference; no action needed here
  },

  // ---- M5 — Vinculación APU ----

  /**
   * Vincula una tarea a una partida de un APU.
   * Guarda la referencia (apuId, apuPartidaId, cantidad) y cachea
   * `costoUnitarioAPU` = partida.precioUnitario para que EVM no necesite re-leer el APU.
   * Actualiza `costoPlaneado` = costoUnitarioAPU × cantidad.
   *
   * @param tareaId    ID de la tarea a vincular
   * @param apuId      ID del APU
   * @param partida    Objeto Partida completo (obtenido del APU en el hook del caller)
   * @param cantidad   Cantidad de la unidad de la partida para esta tarea
   */
  vincularAPU: async (
    tareaId: string,
    apuId: string,
    partida: Partida,
    cantidad: number,
    proyectoId?: string,
  ): Promise<Tarea> => {
    const costoPlaneado = partida.precioUnitario * cantidad
    const tarea = await tareasService.update(tareaId, {
      apuId,
      apuPartidaId: partida.id,
      cantidad,
      costoUnitarioAPU: partida.precioUnitario,
      costoPlaneado,
    })

    // P1: Sincronizar BAC del proyecto (silencioso)
    if (proyectoId) {
      try {
        const db = getFirestoreDb()
        const tareas = await tareasService.getByProyectoId(proyectoId)
        const bac = tareas
          .filter((t) => t.estado !== 'suspendida')
          .reduce((sum, t) => sum + (t.costoPlaneado ?? 0), 0)
        await updateDoc(doc(db, 'proyectos', proyectoId), {
          presupuestoEstimado: Math.round(bac * 100) / 100,
          actualizadoEn: Timestamp.now(),
        })
      } catch { /* silencioso */ }

      // P4: Auditoría T-03 (silencioso)
      try {
        const { auditoriaService } = await import('./auditoria.service')
        const fbUser = getFirebaseAuth().currentUser
        if (fbUser) await auditoriaService.registrar({
          actor: { uid: fbUser.uid, nombre: fbUser.displayName ?? fbUser.email ?? 'Sistema', rol: 'analista' },
          accion: 'TAREA_APU_VINCULADO',
          modulo: 'M4',
          entidad: { id: tareaId, tipo: 'Tarea' },
          descripcion: `Tarea vinculada a APU ${apuId} (partida: ${partida.id}). Costo planeado: ${costoPlaneado}`,
          resultado: 'exito',
        })
      } catch { /* silencioso */ }
    }

    return tarea
  },

  /**
   * Desvincula una tarea de su APU.
   * Limpia todos los campos APU pero preserva `costoPlaneado` (queda en su último valor
   * para no romper el cálculo EVM hasta que el usuario lo actualice manualmente).
   *
   * @param tareaId ID de la tarea a desvincular
   */
  desvincularAPU: async (tareaId: string): Promise<Tarea> => {
    const db = getFirestoreDb()
    const ahora = Timestamp.now()
    // Usar updateDoc directamente para poder escribir null/undefined en los campos FK
    // (removeUndefined los omite, pero aquí queremos borrarlos explícitamente con deleteField)
    const { deleteField } = await import('firebase/firestore')
    await updateDoc(doc(db, COLECCION, tareaId), {
      apuId: deleteField(),
      apuPartidaId: deleteField(),
      cantidad: deleteField(),
      costoUnitarioAPU: deleteField(),
      actualizadoEn: ahora,
    })
    const updated = await tareasService.getById(tareaId)
    if (!updated) throw new Error('Tarea no encontrada después de desvincular APU')
    return updated
  },
}
