// ============================================================
// SERVICIO: Configuración del sistema
// Colección Firestore: 'configuracion'
// Documentos: 'organizacion' (org) + 'sistema' (T-06)
// ============================================================

import { doc, getDoc, setDoc, onSnapshot, Timestamp } from 'firebase/firestore'
import { getFirestoreDb, convertTimestamps, removeUndefined } from '@/lib/firebase/firestore'
import { getFirebaseAuth } from '@/lib/firebase/auth'
import type { ConfiguracionSistema } from '@/types'
import { CONFIG_SISTEMA_DEFAULTS } from '@/types'

const COLECCION = 'configuracion'
const DOC_ORG = 'organizacion'
const DOC_SISTEMA = 'sistema'

// -------------------------------------------------------
// TIPOS — Organización
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
  // ── ORGANIZACIÓN ──────────────────────────────────────

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

  // ── SISTEMA (T-06) ────────────────────────────────────

  /**
   * Obtiene la configuración del sistema.
   * Si no existe el documento, retorna los defaults sin crear el doc.
   */
  getSistema: async (): Promise<ConfiguracionSistema> => {
    const db = getFirestoreDb()
    const snap = await getDoc(doc(db, COLECCION, DOC_SISTEMA))
    if (!snap.exists()) return { ...CONFIG_SISTEMA_DEFAULTS, ultimaModificacion: new Date() }
    return convertTimestamps(snap.data()) as ConfiguracionSistema
  },

  /**
   * Actualiza (merge) la configuración del sistema.
   * Genera entrada de auditoría T06_CONFIGURACION_MODIFICADA.
   */
  updateSistema: async (
    campos: Partial<ConfiguracionSistema>,
    modificadoPor: string
  ): Promise<void> => {
    const db = getFirestoreDb()
    await setDoc(
      doc(db, COLECCION, DOC_SISTEMA),
      removeUndefined({
        ...campos,
        ultimaModificacion: Timestamp.now(),
        modificadoPor,
      }),
      { merge: true }
    )
    // Auditoría en background (silencioso)
    try {
      const { auditoriaService } = await import('./auditoria.service')
      const auth = getFirebaseAuth()
      const fbUser = auth.currentUser
      if (fbUser) {
        await auditoriaService.registrar({
          actor: { uid: fbUser.uid, nombre: fbUser.displayName ?? fbUser.email ?? 'Sistema', rol: 'admin' },
          accion: 'T06_CONFIGURACION_MODIFICADA',
          modulo: 'T',
          descripcion: 'Configuración del sistema actualizada',
          resultado: 'exito',
        })
      }
    } catch {
      // silencioso
    }
  },

  /**
   * Inicializa el documento de sistema con los defaults si no existe.
   * Llamar una vez al arrancar la app.
   */
  initSistema: async (): Promise<void> => {
    const db = getFirestoreDb()
    const snap = await getDoc(doc(db, COLECCION, DOC_SISTEMA))
    if (snap.exists()) return
    await setDoc(
      doc(db, COLECCION, DOC_SISTEMA),
      removeUndefined({
        ...CONFIG_SISTEMA_DEFAULTS,
        ultimaModificacion: Timestamp.now(),
      })
    )
  },

  /**
   * Suscribe a cambios del modo mantenimiento en tiempo real.
   * Solo escucha el campo sistema.modoMantenimiento.
   * Retorna la función de unsubscribe.
   */
  onModoMantenimientoChange: (callback: (activo: boolean) => void): (() => void) => {
    const db = getFirestoreDb()
    return onSnapshot(doc(db, COLECCION, DOC_SISTEMA), (snap) => {
      if (!snap.exists()) {
        callback(false)
        return
      }
      const data = snap.data()
      callback(data?.sistema?.modoMantenimiento ?? false)
    })
  },
}
