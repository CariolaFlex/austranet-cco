// ============================================================
// SERVICIO: Configuración del sistema
// Colección Firestore: 'configuracion'
// Documento: 'organizacion'
// ============================================================

import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'
import { getFirestoreDb, convertTimestamps } from '@/lib/firebase/firestore'
import { getFirebaseAuth } from '@/lib/firebase/auth'

const COLECCION = 'configuracion'
const DOC_ORG = 'organizacion'

// -------------------------------------------------------
// TIPOS
// -------------------------------------------------------

export interface ConfigOrganizacion {
  nombre: string
  rut?: string
  sector?: string
  pais?: string
  ciudad?: string
  sitioWeb?: string
  actualizadoEn?: Date
  actualizadoPor?: string
}

export type ActualizarConfigOrganizacionDTO = Omit<ConfigOrganizacion, 'actualizadoEn' | 'actualizadoPor'>

// -------------------------------------------------------
// SERVICIO
// -------------------------------------------------------

export const configuracionService = {
  /** Obtiene la configuración de la organización. Retorna null si no existe. */
  getOrganizacion: async (): Promise<ConfigOrganizacion | null> => {
    const db = getFirestoreDb()
    const snap = await getDoc(doc(db, COLECCION, DOC_ORG))
    if (!snap.exists()) return null
    return convertTimestamps(snap.data()) as ConfigOrganizacion
  },

  /**
   * Guarda (upsert) la configuración de la organización.
   * Usa merge: true para no sobreescribir campos no incluidos.
   */
  updateOrganizacion: async (data: ActualizarConfigOrganizacionDTO): Promise<ConfigOrganizacion> => {
    const auth = getFirebaseAuth()
    const uid = auth.currentUser?.uid
    if (!uid) throw new Error('Usuario no autenticado')

    const db = getFirestoreDb()
    const docData = {
      ...data,
      actualizadoEn: Timestamp.now(),
      actualizadoPor: uid,
    }

    await setDoc(doc(db, COLECCION, DOC_ORG), docData, { merge: true })

    return {
      ...data,
      actualizadoEn: new Date(),
      actualizadoPor: uid,
    }
  },
}
