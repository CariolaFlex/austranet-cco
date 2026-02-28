// ============================================================
// SERVICIO: Auditoría — T-03
// Colección Firestore: 'auditoria'
// REGLA CRÍTICA: write-only absolute. Nunca editar ni eliminar.
// ============================================================

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore'
import { getFirestoreDb } from '@/lib/firebase/firestore'
import type { EntradaAuditoria, AccionAuditoria } from '@/types'

const COLECCION = 'auditoria'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function snapToEntrada(id: string, data: Record<string, any>): EntradaAuditoria {
  return {
    id,
    timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp),
    actor: data.actor,
    accion: data.accion,
    modulo: data.modulo,
    entidad: data.entidad,
    descripcion: data.descripcion,
    camposModificados: data.camposModificados,
    resultado: data.resultado,
    motivoBloqueo: data.motivoBloqueo,
  }
}

export const auditoriaService = {
  /**
   * Registra una entrada de auditoría.
   * SIEMPRE envuelto en try/catch silencioso — nunca debe romper el flujo principal.
   * Usa addDoc (nunca setDoc) para garantizar append-only + serverTimestamp.
   */
  registrar: async (
    entrada: Omit<EntradaAuditoria, 'id' | 'timestamp'>
  ): Promise<void> => {
    try {
      const db = getFirestoreDb()
      // Filtrar campos undefined que Firestore rechaza
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const docData: Record<string, any> = {
        timestamp: serverTimestamp(),
        actor: entrada.actor,
        accion: entrada.accion,
        modulo: entrada.modulo,
        descripcion: entrada.descripcion,
        resultado: entrada.resultado,
      }
      if (entrada.entidad !== undefined) docData.entidad = entrada.entidad
      if (entrada.camposModificados !== undefined) docData.camposModificados = entrada.camposModificados
      if (entrada.motivoBloqueo !== undefined) docData.motivoBloqueo = entrada.motivoBloqueo

      await addDoc(collection(db, COLECCION), docData)
    } catch {
      // Silencioso — la auditoría nunca bloquea el flujo principal
    }
  },

  /** Obtiene las últimas entradas de auditoría de un módulo */
  getByModulo: async (
    modulo: EntradaAuditoria['modulo'],
    limite = 50
  ): Promise<EntradaAuditoria[]> => {
    const db = getFirestoreDb()
    const q = query(
      collection(db, COLECCION),
      where('modulo', '==', modulo),
      orderBy('timestamp', 'desc'),
      limit(limite)
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => snapToEntrada(d.id, d.data() as Record<string, unknown>))
  },

  /** Obtiene las últimas entradas de auditoría de un actor (usuario) */
  getByActor: async (uid: string, limite = 50): Promise<EntradaAuditoria[]> => {
    const db = getFirestoreDb()
    const q = query(
      collection(db, COLECCION),
      where('actor.uid', '==', uid),
      orderBy('timestamp', 'desc'),
      limit(limite)
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => snapToEntrada(d.id, d.data() as Record<string, unknown>))
  },

  /** Obtiene las últimas entradas de auditoría relacionadas con una entidad (por ID) */
  getByEntidad: async (entidadId: string, limite = 50): Promise<EntradaAuditoria[]> => {
    const db = getFirestoreDb()
    const q = query(
      collection(db, COLECCION),
      where('entidad.id', '==', entidadId),
      orderBy('timestamp', 'desc'),
      limit(limite)
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => snapToEntrada(d.id, d.data() as Record<string, unknown>))
  },

  /** Obtiene las últimas entradas de auditoría de acciones específicas */
  getByCriticidad: async (
    acciones: AccionAuditoria[],
    limite = 50
  ): Promise<EntradaAuditoria[]> => {
    const db = getFirestoreDb()
    const q = query(
      collection(db, COLECCION),
      where('accion', 'in', acciones),
      orderBy('timestamp', 'desc'),
      limit(limite)
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => snapToEntrada(d.id, d.data() as Record<string, unknown>))
  },

  /** Obtiene TODAS las entradas (para panel de admin) con filtros opcionales */
  getAll: async (
    filtros?: { modulo?: string; actorUid?: string; accion?: AccionAuditoria },
    limite = 50
  ): Promise<EntradaAuditoria[]> => {
    const db = getFirestoreDb()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const constraints: any[] = [orderBy('timestamp', 'desc'), limit(limite)]
    if (filtros?.modulo) constraints.unshift(where('modulo', '==', filtros.modulo))
    if (filtros?.actorUid) constraints.unshift(where('actor.uid', '==', filtros.actorUid))
    if (filtros?.accion) constraints.unshift(where('accion', '==', filtros.accion))

    const snap = await getDocs(query(collection(db, COLECCION), ...constraints))
    return snap.docs.map((d) => snapToEntrada(d.id, d.data() as Record<string, unknown>))
  },
}
