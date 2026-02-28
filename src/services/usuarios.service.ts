// ============================================================
// SERVICIO: Usuarios del Sistema
// Colección Firestore: 'usuarios'
// Gestiona la creación y lectura de perfiles de usuario.
// El ID del documento siempre coincide con el uid de Firebase Auth.
// ============================================================

import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { getFirestoreDb } from '@/lib/firebase/firestore'
import { removeUndefined } from '@/lib/firebase/firestore'
import type { Usuario, RolUsuario } from '@/types'

const COLECCION = 'usuarios'

/** Datos necesarios para crear el documento de usuario */
export interface CrearUsuarioData {
  uid: string
  nombre: string
  email: string
  empresa?: string
  cargo?: string
  rol?: RolUsuario
}

/** Convierte un snapshot de Firestore al tipo Usuario */
function docToUsuario(id: string, data: Record<string, unknown>): Usuario {
  return {
    id,
    nombre: data.nombre as string,
    email: data.email as string,
    empresa: data.empresa as string | undefined,
    cargo: data.cargo as string | undefined,
    rol: data.rol as RolUsuario,
    activo: data.activo as boolean,
    creadoEn:
      data.creadoEn instanceof Timestamp
        ? data.creadoEn.toDate()
        : (data.creadoEn as Date),
  }
}

export const usuariosService = {
  /**
   * Obtiene el documento de usuario por su uid.
   * Retorna null si no existe.
   */
  getById: async (uid: string): Promise<Usuario | null> => {
    const db = getFirestoreDb()
    const snap = await getDoc(doc(db, COLECCION, uid))
    if (!snap.exists()) return null
    return docToUsuario(snap.id, snap.data() as Record<string, unknown>)
  },

  /**
   * Crea el documento de usuario en Firestore.
   * Usa setDoc para garantizar que el ID del documento = uid de Auth.
   * Asigna rol 'tester' y activo: true por defecto (registro público).
   */
  crearDocumento: async (data: CrearUsuarioData): Promise<Usuario> => {
    const db = getFirestoreDb()
    const ahora = Timestamp.now()

    const docData = removeUndefined({
      nombre: data.nombre,
      email: data.email,
      empresa: data.empresa,
      cargo: data.cargo,
      rol: data.rol ?? 'tester',
      activo: true,
      creadoEn: ahora,
    })

    await setDoc(doc(db, COLECCION, data.uid), docData)

    return {
      id: data.uid,
      nombre: data.nombre,
      email: data.email,
      empresa: data.empresa,
      cargo: data.cargo,
      rol: data.rol ?? 'tester',
      activo: true,
      creadoEn: ahora.toDate(),
    }
  },

  /**
   * Verifica si ya existe el documento del usuario; si no, lo crea.
   * Útil para el flujo de Google Sign-In (puede llamarse múltiples veces).
   */
  verificarYCrear: async (data: CrearUsuarioData): Promise<Usuario> => {
    const existente = await usuariosService.getById(data.uid)
    if (existente) return existente
    return usuariosService.crearDocumento(data)
  },

  /**
   * Obtiene todos los usuarios del sistema (solo admin/superadmin).
   */
  getAll: async (): Promise<Usuario[]> => {
    const db = getFirestoreDb()
    const snap = await getDocs(
      query(collection(db, COLECCION), orderBy('creadoEn', 'desc'))
    )
    return snap.docs.map((d) => docToUsuario(d.id, d.data() as Record<string, unknown>))
  },

  /**
   * Actualiza el rol de un usuario.
   */
  updateRol: async (uid: string, nuevoRol: RolUsuario): Promise<void> => {
    const db = getFirestoreDb()
    await updateDoc(doc(db, COLECCION, uid), removeUndefined({ rol: nuevoRol }))
  },

  /**
   * Activa o desactiva un usuario.
   */
  toggleActivo: async (uid: string, activo: boolean): Promise<void> => {
    const db = getFirestoreDb()
    await updateDoc(doc(db, COLECCION, uid), { activo })
  },
}
