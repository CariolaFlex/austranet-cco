// ============================================================
// SERVICIO: Líneas Base — Módulo 4 (Sprint M4-S01)
// Colección Firestore: 'lineas_base' (top-level, con proyectoId FK)
// Principio: Una línea base es un snapshot INMUTABLE del cronograma.
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
  writeBatch,
} from 'firebase/firestore'
import { getFirestoreDb, convertTimestamps, removeUndefined } from '@/lib/firebase/firestore'
import { getCurrentUserId } from '@/lib/firebase/auth'
import type { LineaBase, TareaSnapshot, Tarea } from '@/types'

const COLECCION = 'lineas_base'

function docToLineaBase(id: string, data: Record<string, unknown>): LineaBase {
  const converted = convertTimestamps({ id, ...data }) as LineaBase
  converted.snapshotTareas = converted.snapshotTareas ?? []
  return converted
}

/** Convierte un array de Tarea[] en TareaSnapshot[] para la línea base. */
function tareasASnapshot(tareas: Tarea[]): TareaSnapshot[] {
  return tareas.map((t) => ({
    tareaId: t.id,
    wbsCode: t.wbsCode,
    nombre: t.nombre,
    fechaInicioPlaneada: t.fechaInicioPlaneada,
    fechaFinPlaneada: t.fechaFinPlaneada,
    duracionDias: t.duracionDias,
    costoPlaneado: t.costoPlaneado,
    esCritica: t.esCritica,
    holguraTotal: t.holguraTotal ?? 0,
    porcentajeAvanceCaptura: t.porcentajeAvance,
  }))
}

// -------------------------------------------------------
// SERVICIO PRINCIPAL
// -------------------------------------------------------

export const lineasBaseService = {
  /** Obtiene todas las líneas base de un proyecto, más recientes primero. */
  getByProyectoId: async (proyectoId: string): Promise<LineaBase[]> => {
    const db = getFirestoreDb()
    const q = query(
      collection(db, COLECCION),
      where('proyectoId', '==', proyectoId),
      orderBy('fechaCaptura', 'desc'),
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => docToLineaBase(d.id, d.data()))
  },

  /** Obtiene la línea base activa de un proyecto. Retorna null si no existe. */
  getActiva: async (proyectoId: string): Promise<LineaBase | null> => {
    const db = getFirestoreDb()
    const q = query(
      collection(db, COLECCION),
      where('proyectoId', '==', proyectoId),
      where('esActiva', '==', true),
    )
    const snap = await getDocs(q)
    if (snap.empty) return null
    const d = snap.docs[0]
    return docToLineaBase(d.id, d.data())
  },

  /** Obtiene una línea base por ID. Retorna null si no existe. */
  getById: async (id: string): Promise<LineaBase | null> => {
    const db = getFirestoreDb()
    const snap = await getDoc(doc(db, COLECCION, id))
    if (!snap.exists()) return null
    return docToLineaBase(snap.id, snap.data())
  },

  /**
   * Crea una nueva línea base a partir de las tareas actuales del proyecto.
   * El `snapshotTareas` se genera automáticamente desde el array `tareas`.
   */
  create: async (
    proyectoId: string,
    nombre: string,
    tareas: Tarea[],
    opciones?: { capturaAutomatica?: boolean; notas?: string },
  ): Promise<LineaBase> => {
    const db = getFirestoreDb()
    const uid = getCurrentUserId()
    const ahora = Timestamp.now()

    const docData = removeUndefined({
      proyectoId,
      nombre,
      esActiva: false,            // Se activa explícitamente con setActiva()
      fechaCaptura: ahora,
      capturaAutomatica: opciones?.capturaAutomatica ?? false,
      creadoPor: uid,
      notas: opciones?.notas,
      snapshotTareas: tareasASnapshot(tareas),
    })

    const docRef = await addDoc(collection(db, COLECCION), docData)
    const created = await lineasBaseService.getById(docRef.id)
    if (!created) throw new Error('Línea base no encontrada después de crear')
    return created
  },

  /**
   * Activa una línea base y desactiva todas las demás del mismo proyecto.
   * Usa escritura batch para atomicidad.
   */
  setActiva: async (proyectoId: string, lineaBaseId: string): Promise<void> => {
    const db = getFirestoreDb()
    const batch = writeBatch(db)
    const ahora = Timestamp.now()

    // Desactivar todas las líneas base del proyecto
    const todasLB = await lineasBaseService.getByProyectoId(proyectoId)
    for (const lb of todasLB) {
      if (lb.esActiva) {
        batch.update(doc(db, COLECCION, lb.id), { esActiva: false, actualizadoEn: ahora })
      }
    }

    // Activar la nueva
    batch.update(doc(db, COLECCION, lineaBaseId), { esActiva: true, actualizadoEn: ahora })

    await batch.commit()
  },

  /**
   * Captura una nueva línea base y la activa inmediatamente.
   * Equivale a create() + setActiva().
   */
  capturarYActivar: async (
    proyectoId: string,
    nombre: string,
    tareas: Tarea[],
    opciones?: { capturaAutomatica?: boolean; notas?: string },
  ): Promise<LineaBase> => {
    const lb = await lineasBaseService.create(proyectoId, nombre, tareas, opciones)
    await lineasBaseService.setActiva(proyectoId, lb.id)
    // Retornar con esActiva = true
    return { ...lb, esActiva: true }
  },

  /** Actualiza el nombre o notas de una línea base (los snapshots son inmutables). */
  update: async (id: string, data: { nombre?: string; notas?: string }): Promise<void> => {
    const db = getFirestoreDb()
    await updateDoc(doc(db, COLECCION, id), removeUndefined({
      ...data,
      actualizadoEn: Timestamp.now(),
    }))
  },
}
