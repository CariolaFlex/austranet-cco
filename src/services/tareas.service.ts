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
import { getCurrentUserId } from '@/lib/firebase/auth'
import type { Tarea, CrearTareaDTO, ActualizarTareaDTO, EstadoTarea } from '@/types'

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
  ): Promise<void> => {
    const db = getFirestoreDb()
    const updateData: Record<string, unknown> = {
      porcentajeAvance,
      actualizadoEn: Timestamp.now(),
    }
    if (estado) updateData.estado = estado
    await updateDoc(doc(db, COLECCION, id), updateData)
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
}
