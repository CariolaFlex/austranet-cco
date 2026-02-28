// ============================================================
// SERVICIO: Notificaciones — T-02
// Colección Firestore: 'notificaciones'
// Patrón: write-side + read-side con onSnapshot en el hook.
// ============================================================

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  getCountFromServer,
} from 'firebase/firestore'
import { getFirestoreDb, removeUndefined } from '@/lib/firebase/firestore'
import type { NotificacionFS, EstadoNotificacion } from '@/types'

const COLECCION = 'notificaciones'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function snapToNotif(id: string, data: Record<string, any>): NotificacionFS {
  return {
    id,
    tipo: data.tipo,
    canal: data.canal,
    destinatarios: data.destinatarios ?? [],
    titulo: data.titulo,
    mensaje: data.mensaje,
    accionRequerida: data.accionRequerida ?? false,
    accionUrl: data.accionUrl,
    entidadRelacionada: data.entidadRelacionada,
    modulo: data.modulo,
    estado: data.estado,
    fechaCreacion:
      data.fechaCreacion?.toDate ? data.fechaCreacion.toDate() : new Date(data.fechaCreacion),
    prioridad: data.prioridad,
    fechaExpiracion: data.fechaExpiracion?.toDate
      ? data.fechaExpiracion.toDate()
      : data.fechaExpiracion,
    escaladaEl: data.escaladaEl?.toDate ? data.escaladaEl.toDate() : data.escaladaEl,
  }
}

export const notificacionesService = {
  /**
   * Crea una nueva notificación en Firestore.
   * Retorna el ID del documento creado.
   */
  crear: async (
    data: Omit<NotificacionFS, 'id' | 'fechaCreacion' | 'estado'>
  ): Promise<string> => {
    const db = getFirestoreDb()
    const docData = removeUndefined({
      ...data,
      estado: 'pendiente' as EstadoNotificacion,
      fechaCreacion: Timestamp.now(),
    })
    const docRef = await addDoc(collection(db, COLECCION), docData)
    return docRef.id
  },

  /**
   * Obtiene las notificaciones de un destinatario.
   * Por defecto solo las no leídas; con soloNoLeidas=false, todas.
   */
  getByDestinatario: async (
    uid: string,
    soloNoLeidas = false,
    limite = 50
  ): Promise<NotificacionFS[]> => {
    const db = getFirestoreDb()
    const constraints = [
      where('destinatarios', 'array-contains', uid),
      ...(soloNoLeidas ? [where('estado', '==', 'pendiente')] : []),
      orderBy('fechaCreacion', 'desc'),
      limit(limite),
    ]
    const snap = await getDocs(query(collection(db, COLECCION), ...constraints))
    return snap.docs.map((d) => snapToNotif(d.id, d.data() as Record<string, unknown>))
  },

  /** Marca una notificación como leída */
  marcarLeida: async (notificacionId: string): Promise<void> => {
    const db = getFirestoreDb()
    await updateDoc(doc(db, COLECCION, notificacionId), {
      estado: 'leida' as EstadoNotificacion,
    })
  },

  /** Marca todas las notificaciones pendientes de un usuario como leídas */
  marcarTodasLeidas: async (uid: string): Promise<void> => {
    const db = getFirestoreDb()
    const q = query(
      collection(db, COLECCION),
      where('destinatarios', 'array-contains', uid),
      where('estado', '==', 'pendiente')
    )
    const snap = await getDocs(q)
    const updates = snap.docs.map((d) =>
      updateDoc(doc(db, COLECCION, d.id), { estado: 'leida' as EstadoNotificacion })
    )
    await Promise.all(updates)
  },

  /** Archiva una notificación */
  archivar: async (notificacionId: string): Promise<void> => {
    const db = getFirestoreDb()
    await updateDoc(doc(db, COLECCION, notificacionId), {
      estado: 'archivada' as EstadoNotificacion,
    })
  },

  /** Obtiene el conteo de notificaciones no leídas de un usuario */
  getNoLeidasCount: async (uid: string): Promise<number> => {
    const db = getFirestoreDb()
    const q = query(
      collection(db, COLECCION),
      where('destinatarios', 'array-contains', uid),
      where('estado', '==', 'pendiente')
    )
    const snap = await getCountFromServer(q)
    return snap.data().count
  },
}
