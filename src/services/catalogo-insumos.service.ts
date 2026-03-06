// ============================================================
// SERVICIO: CatálogodeInsumos — Módulo 5 (Sprint M5-S03)
// Colección Firestore: 'catalogo_insumos' (top-level)
// Propósito: repositorio global de insumos con precios de referencia.
// Soft-delete: activo = false (nunca deleteDoc).
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
import type {
  CatalogoInsumo,
  CrearCatalogoInsumoDTO,
  ActualizarCatalogoInsumoDTO,
  FiltrosCatalogoInsumo,
  CategoriaInsumo,
} from '@/types'

const COLECCION = 'catalogo_insumos'

// ── Helper interno ────────────────────────────────────────────────────────────

function docToCatalogoInsumo(id: string, data: Record<string, unknown>): CatalogoInsumo {
  const converted = convertTimestamps({ id, ...data }) as CatalogoInsumo
  return converted
}

// ── Servicio ──────────────────────────────────────────────────────────────────

export const catalogoInsumosService = {

  /**
   * Obtiene todos los insumos del catálogo, con filtros opcionales.
   * Por defecto devuelve solo los activos.
   */
  async getAll(filtros: FiltrosCatalogoInsumo = {}): Promise<CatalogoInsumo[]> {
    const db = getFirestoreDb()
    const col = collection(db, COLECCION)

    const { soloActivos = true, tipo } = filtros

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const constraints: any[] = [orderBy('descripcion', 'asc')]

    if (soloActivos) {
      constraints.unshift(where('activo', '==', true))
    }
    if (tipo) {
      constraints.unshift(where('tipo', '==', tipo))
    }

    const snap = await getDocs(query(col, ...constraints))
    let results = snap.docs.map((d) => docToCatalogoInsumo(d.id, d.data()))

    // Filtro de texto client-side (Firestore no tiene full-text search)
    const { busqueda } = filtros
    if (busqueda && busqueda.trim().length >= 2) {
      const term = busqueda.trim().toLowerCase()
      results = results.filter(
        (i) =>
          i.descripcion.toLowerCase().includes(term) ||
          i.codigo.toLowerCase().includes(term) ||
          (i.proveedor?.toLowerCase().includes(term) ?? false),
      )
    }

    return results
  },

  /**
   * Obtiene un insumo del catálogo por su ID.
   */
  async getById(id: string): Promise<CatalogoInsumo | null> {
    const db = getFirestoreDb()
    const snap = await getDoc(doc(db, COLECCION, id))
    if (!snap.exists()) return null
    return docToCatalogoInsumo(snap.id, snap.data())
  },

  /**
   * Busca insumos por texto (descripcion/codigo) y tipo opcional.
   * Shortcut de `getAll` con busqueda pre-configurada.
   */
  async buscar(texto: string, tipo?: CategoriaInsumo): Promise<CatalogoInsumo[]> {
    return this.getAll({ busqueda: texto, tipo, soloActivos: true })
  },

  /**
   * Obtiene insumos filtrados por tipo.
   */
  async getByTipo(tipo: CategoriaInsumo): Promise<CatalogoInsumo[]> {
    return this.getAll({ tipo, soloActivos: true })
  },

  /**
   * Crea un nuevo insumo en el catálogo.
   */
  async crear(dto: CrearCatalogoInsumoDTO): Promise<CatalogoInsumo> {
    const db = getFirestoreDb()
    const userId = await getCurrentUserId()
    const ahora = Timestamp.now()

    const payload = removeUndefined({
      ...dto,
      activo: dto.activo ?? true,
      creadoEn: ahora,
      actualizadoEn: ahora,
      creadoPor: userId,
    })

    const ref = await addDoc(collection(db, COLECCION), payload)
    const snap = await getDoc(ref)
    return docToCatalogoInsumo(snap.id, snap.data()!)
  },

  /**
   * Actualiza campos de un insumo del catálogo.
   */
  async actualizar(id: string, dto: ActualizarCatalogoInsumoDTO): Promise<CatalogoInsumo> {
    const db = getFirestoreDb()
    const ref = doc(db, COLECCION, id)

    const payload = removeUndefined({
      ...dto,
      actualizadoEn: Timestamp.now(),
    })

    await updateDoc(ref, payload)
    const snap = await getDoc(ref)
    return docToCatalogoInsumo(snap.id, snap.data()!)
  },

  /**
   * Soft-delete: marca el insumo como inactivo (activo = false).
   * Nunca elimina el documento de Firestore.
   */
  async desactivar(id: string): Promise<void> {
    const db = getFirestoreDb()
    await updateDoc(doc(db, COLECCION, id), {
      activo: false,
      actualizadoEn: Timestamp.now(),
    })
  },

  /**
   * Reactiva un insumo desactivado.
   */
  async reactivar(id: string): Promise<void> {
    const db = getFirestoreDb()
    await updateDoc(doc(db, COLECCION, id), {
      activo: true,
      actualizadoEn: Timestamp.now(),
    })
  },
}
