// ============================================================
// SERVICIO: Dashboard — T-05
// Colección Firestore: 'configuracion_dashboard'
// Documento por UID: preferencias personales del usuario.
// ============================================================

import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'
import { getFirestoreDb, removeUndefined } from '@/lib/firebase/firestore'
import type { ConfigDashboard } from '@/types'

const COLECCION = 'configuracion_dashboard'

export const dashboardService = {
  /** Obtiene la configuración del dashboard para un usuario */
  getConfig: async (uid: string): Promise<ConfigDashboard | null> => {
    const db = getFirestoreDb()
    const snap = await getDoc(doc(db, COLECCION, uid))
    if (!snap.exists()) return null
    const data = snap.data()
    return {
      uid,
      widgetsOcultos: data.widgetsOcultos ?? [],
      ordenPersonalizado: data.ordenPersonalizado ?? [],
      actualizadoEl:
        data.actualizadoEl?.toDate ? data.actualizadoEl.toDate() : new Date(data.actualizadoEl),
    }
  },

  /** Guarda (upsert) la configuración del dashboard */
  saveConfig: async (
    uid: string,
    config: Pick<ConfigDashboard, 'widgetsOcultos' | 'ordenPersonalizado'>
  ): Promise<void> => {
    const db = getFirestoreDb()
    await setDoc(
      doc(db, COLECCION, uid),
      removeUndefined({
        uid,
        widgetsOcultos: config.widgetsOcultos,
        ordenPersonalizado: config.ordenPersonalizado,
        actualizadoEl: Timestamp.now(),
      }),
      { merge: true }
    )
  },

  /** Resetea la configuración del dashboard (elimina preferencias personalizadas) */
  resetConfig: async (uid: string): Promise<void> => {
    const db = getFirestoreDb()
    await setDoc(doc(db, COLECCION, uid), {
      uid,
      widgetsOcultos: [],
      ordenPersonalizado: [],
      actualizadoEl: Timestamp.now(),
    })
  },
}
