// ============================================================
// SERVICIO: APU — Módulo 5 (Sprint M5-S01)
// Colección Firestore: 'apus' (top-level, FK proyectoId)
// Estrategia de escritura: full replace de partidas[] (ADR-010)
// ============================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { getFirestoreDb, convertTimestamps, removeUndefined } from '@/lib/firebase/firestore'
import { getCurrentUserId, getFirebaseAuth } from '@/lib/firebase/auth'
import type {
  APU,
  Partida,
  Insumo,
  CrearAPUDTO,
  ActualizarAPUDTO,
  CrearPartidaDTO,
  ActualizarPartidaDTO,
  EstadoAPU,
} from '@/types'

const COLECCION = 'apus'

// -------------------------------------------------------
// HELPERS INTERNOS
// -------------------------------------------------------

function docToAPU(id: string, data: Record<string, unknown>): APU {
  const converted = convertTimestamps({ id, ...data }) as APU
  converted.partidas = converted.partidas ?? []
  return converted
}

/**
 * Recalcula los campos desnormalizados de un Insumo.
 * subtotal = cantidad × precioUnitario
 */
function calcularInsumo(insumo: Insumo): Insumo {
  return {
    ...insumo,
    subtotal: insumo.cantidad * insumo.precioUnitario,
  }
}

/**
 * Recalcula los campos desnormalizados de una Partida.
 * costoDirecto = Σ insumo.subtotal
 * precioUnitario = costoDirecto × (1 + ggPct/100) × (1 + utilidadPct/100)
 */
function calcularPartida(partida: Partida): Partida {
  const insumos = partida.insumos.map(calcularInsumo)
  const costoDirecto = insumos.reduce((sum, i) => sum + i.subtotal, 0)
  const precioUnitario = costoDirecto * (1 + partida.ggPct / 100) * (1 + partida.utilidadPct / 100)
  return { ...partida, insumos, costoDirecto, precioUnitario }
}

/**
 * Escribe el array de partidas completo en Firestore (ADR-010: full replace).
 * Todas las operaciones CRUD sobre partidas pasan por aquí.
 */
async function _overwritePartidas(apuId: string, partidas: Partida[]): Promise<void> {
  const db = getFirestoreDb()
  await updateDoc(doc(db, COLECCION, apuId), removeUndefined({
    partidas,
    actualizadoEn: Timestamp.now(),
  }))
}

/**
 * P1 — Recalcula proyecto.presupuestoEstimado como la suma de costoPlaneado
 * de todas las tareas activas (no suspendidas) del proyecto.
 * Llamado silenciosamente desde aprobar() y actualizarPartida().
 */
async function _sincronizarBAC(proyectoId: string): Promise<void> {
  try {
    const { tareasService } = await import('./tareas.service')
    const db = getFirestoreDb()
    const tareas = await tareasService.getByProyectoId(proyectoId)
    const bac = tareas
      .filter((t) => t.estado !== 'suspendida')
      .reduce((sum, t) => sum + (t.costoPlaneado ?? 0), 0)
    await updateDoc(doc(db, 'proyectos', proyectoId), {
      presupuestoEstimado: Math.round(bac * 100) / 100,
      actualizadoEn: Timestamp.now(),
    })
  } catch { /* silencioso — no bloquear la operación principal */ }
}

// -------------------------------------------------------
// SERVICIO PRINCIPAL
// -------------------------------------------------------

export const apuService = {

  // ---- APU CRUD ----

  /** Obtiene todos los APUs de un proyecto, ordenados por nombre. */
  getByProyectoId: async (proyectoId: string): Promise<APU[]> => {
    const db = getFirestoreDb()
    const q = query(
      collection(db, COLECCION),
      where('proyectoId', '==', proyectoId),
      orderBy('nombre', 'asc'),
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => docToAPU(d.id, d.data()))
  },

  /** Obtiene un APU por ID. Retorna null si no existe. */
  getById: async (id: string): Promise<APU | null> => {
    const db = getFirestoreDb()
    const snap = await getDoc(doc(db, COLECCION, id))
    if (!snap.exists()) return null
    return docToAPU(snap.id, snap.data())
  },

  /** Obtiene APUs de un proyecto filtrados por estado. */
  getByEstado: async (proyectoId: string, estado: EstadoAPU): Promise<APU[]> => {
    const db = getFirestoreDb()
    const q = query(
      collection(db, COLECCION),
      where('proyectoId', '==', proyectoId),
      where('estado', '==', estado),
      orderBy('nombre', 'asc'),
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => docToAPU(d.id, d.data()))
  },

  /** Crea un nuevo APU para un proyecto. `version` comienza en 1. */
  create: async (data: CrearAPUDTO): Promise<APU> => {
    const db = getFirestoreDb()
    const uid = getCurrentUserId()
    const ahora = Timestamp.now()

    // Recalcular partidas iniciales si se pasan (normalmente vacío en creación)
    const partidas = (data.partidas ?? []).map(calcularPartida)

    const docData = removeUndefined({
      ...data,
      partidas,
      version: 1,
      creadoEn: ahora,
      actualizadoEn: ahora,
      creadoPor: uid,
    })

    const docRef = await addDoc(collection(db, COLECCION), docData)
    const created = await apuService.getById(docRef.id)
    if (!created) throw new Error('APU no encontrado después de crear')

    // P4: Auditoría T-03 (silencioso)
    try {
      const { auditoriaService } = await import('./auditoria.service')
      const fbUser = getFirebaseAuth().currentUser
      if (fbUser) await auditoriaService.registrar({
        actor: { uid: fbUser.uid, nombre: fbUser.displayName ?? fbUser.email ?? 'Sistema', rol: 'analista' },
        accion: 'APU_CREADO',
        modulo: 'M5',
        entidad: { id: created.id, tipo: 'APU', nombre: created.nombre },
        descripcion: `APU "${created.nombre}" creado para proyecto ${created.proyectoId}`,
        resultado: 'exito',
      })
    } catch { /* silencioso */ }

    return created
  },

  /**
   * Actualiza campos del APU (nombre, descripcion, moneda, estado).
   * No usar para modificar partidas — usar los métodos específicos de partidas.
   */
  update: async (id: string, data: ActualizarAPUDTO): Promise<APU> => {
    const db = getFirestoreDb()
    const ahora = Timestamp.now()

    // Si se pasan partidas en el DTO genérico, recalcularlas
    const payload: Record<string, unknown> = { ...data, actualizadoEn: ahora }
    if (data.partidas) {
      payload.partidas = data.partidas.map(calcularPartida)
    }

    await updateDoc(doc(db, COLECCION, id), removeUndefined(payload))

    const updated = await apuService.getById(id)
    if (!updated) throw new Error('APU no encontrado después de actualizar')
    return updated
  },

  /**
   * Aprueba el APU: cambia estado a 'aprobado' e incrementa version.
   * Precondición: estado actual debe ser 'revision'.
   */
  aprobar: async (id: string): Promise<APU> => {
    const apu = await apuService.getById(id)
    if (!apu) throw new Error(`APU ${id} no encontrado`)
    if (apu.estado !== 'revision') {
      throw new Error(`Solo se puede aprobar un APU en estado 'revision'. Estado actual: ${apu.estado}`)
    }

    const db = getFirestoreDb()
    await updateDoc(doc(db, COLECCION, id), {
      estado: 'aprobado',
      version: apu.version + 1,
      actualizadoEn: Timestamp.now(),
    })

    const updated = await apuService.getById(id)
    if (!updated) throw new Error('APU no encontrado después de aprobar')

    // P1: Sincronizar presupuestoEstimado del proyecto con el total de tareas
    await _sincronizarBAC(updated.proyectoId)

    // P4: Auditoría T-03 (silencioso)
    try {
      const { auditoriaService } = await import('./auditoria.service')
      const fbUser = getFirebaseAuth().currentUser
      if (fbUser) await auditoriaService.registrar({
        actor: { uid: fbUser.uid, nombre: fbUser.displayName ?? fbUser.email ?? 'Sistema', rol: 'analista' },
        accion: 'APU_APROBADO',
        modulo: 'M5',
        entidad: { id: updated.id, tipo: 'APU', nombre: updated.nombre },
        descripcion: `APU "${updated.nombre}" aprobado. Versión ${updated.version}`,
        resultado: 'exito',
      })
    } catch { /* silencioso */ }

    return updated
  },

  /** Elimina un APU. Solo permitido si estado = 'borrador'. */
  delete: async (id: string): Promise<void> => {
    const apu = await apuService.getById(id)
    if (!apu) throw new Error(`APU ${id} no encontrado`)
    if (apu.estado !== 'borrador') {
      throw new Error(`Solo se puede eliminar un APU en estado 'borrador'. Estado actual: ${apu.estado}`)
    }
    const db = getFirestoreDb()
    await deleteDoc(doc(db, COLECCION, id))
  },

  // ---- PARTIDAS (full-replace según ADR-010) ----

  /**
   * Agrega una nueva partida al APU.
   * Recalcula `costoDirecto` y `precioUnitario` antes de guardar.
   * Estrategia: full replace del array (ADR-010).
   */
  crearPartida: async (apuId: string, data: CrearPartidaDTO, partidasActuales: Partida[]): Promise<APU> => {
    const id = crypto.randomUUID()
    const nuevaPartida = calcularPartida({ ...data, id, costoDirecto: 0, precioUnitario: 0 })
    const nuevasPartidas = [...partidasActuales, nuevaPartida]
    await _overwritePartidas(apuId, nuevasPartidas)
    const updated = await apuService.getById(apuId)
    if (!updated) throw new Error('APU no encontrado después de crear partida')
    return updated
  },

  /**
   * Actualiza una partida existente por ID.
   * Recalcula desnormalizados. Estrategia: full replace del array (ADR-010).
   */
  actualizarPartida: async (apuId: string, partidaId: string, data: ActualizarPartidaDTO, partidasActuales: Partida[]): Promise<APU> => {
    // Guardar precioUnitario anterior para detectar si cambió (P2)
    const precioAnterior = partidasActuales.find((p) => p.id === partidaId)?.precioUnitario ?? 0

    const nuevasPartidas = partidasActuales.map((p) => {
      if (p.id !== partidaId) return p
      const merged = { ...p, ...data }
      return calcularPartida(merged)
    })
    if (nuevasPartidas.every((p) => p.id !== partidaId)) {
      throw new Error(`Partida ${partidaId} no encontrada en APU ${apuId}`)
    }
    await _overwritePartidas(apuId, nuevasPartidas)
    const updated = await apuService.getById(apuId)
    if (!updated) throw new Error('APU no encontrado después de actualizar partida')

    // P2: Si cambió precioUnitario, propagar a tareas vinculadas (silencioso)
    const partidaActualizada = updated.partidas.find((p) => p.id === partidaId)
    if (partidaActualizada && Math.abs(partidaActualizada.precioUnitario - precioAnterior) > 0.001) {
      try {
        const { tareasService } = await import('./tareas.service')
        const tareas = await tareasService.getByProyectoId(updated.proyectoId)
        const vinculadas = tareas.filter((t) => t.apuId === apuId && t.apuPartidaId === partidaId)
        if (vinculadas.length > 0) {
          await Promise.all(
            vinculadas.map((t) =>
              tareasService.update(t.id, {
                costoUnitarioAPU: partidaActualizada.precioUnitario,
                costoPlaneado: Math.round(partidaActualizada.precioUnitario * (t.cantidad ?? 1) * 100) / 100,
              })
            )
          )
        }
        // Sincronizar BAC del proyecto tras actualizar tareas
        await _sincronizarBAC(updated.proyectoId)
      } catch { /* silencioso — no bloquear la operación de partida */ }
    }

    return updated
  },

  /**
   * Elimina una partida del APU por ID.
   * Estrategia: full replace del array (ADR-010).
   */
  eliminarPartida: async (apuId: string, partidaId: string, partidasActuales: Partida[]): Promise<APU> => {
    const nuevasPartidas = partidasActuales.filter((p) => p.id !== partidaId)
    await _overwritePartidas(apuId, nuevasPartidas)
    const updated = await apuService.getById(apuId)
    if (!updated) throw new Error('APU no encontrado después de eliminar partida')
    return updated
  },

  /**
   * Reordena las partidas de un APU según el array de IDs ordenados.
   * Estrategia: full replace del array (ADR-010).
   */
  reordenarPartidas: async (apuId: string, ordenIds: string[], partidasActuales: Partida[]): Promise<APU> => {
    const mapa = new Map(partidasActuales.map((p) => [p.id, p]))
    const nuevasPartidas = ordenIds.map((id) => {
      const p = mapa.get(id)
      if (!p) throw new Error(`Partida ${id} no encontrada al reordenar APU ${apuId}`)
      return p
    })
    await _overwritePartidas(apuId, nuevasPartidas)
    const updated = await apuService.getById(apuId)
    if (!updated) throw new Error('APU no encontrado después de reordenar partidas')
    return updated
  },

  // ---- INSUMOS (operan sobre la partida, que aplica full-replace de partidas) ----

  /**
   * Agrega un insumo a una partida del APU.
   * Recalcula subtotales y desnormalizados de la partida. Full replace del array (ADR-010).
   */
  crearInsumo: async (apuId: string, partidaId: string, insumo: Omit<Insumo, 'id' | 'subtotal'>, partidasActuales: Partida[]): Promise<APU> => {
    const nuevoInsumo: Insumo = {
      ...insumo,
      id: crypto.randomUUID(),
      subtotal: insumo.cantidad * insumo.precioUnitario,
    }
    const nuevasPartidas = partidasActuales.map((p) => {
      if (p.id !== partidaId) return p
      return calcularPartida({ ...p, insumos: [...p.insumos, nuevoInsumo] })
    })
    await _overwritePartidas(apuId, nuevasPartidas)
    const updated = await apuService.getById(apuId)
    if (!updated) throw new Error('APU no encontrado después de crear insumo')
    return updated
  },

  /**
   * Actualiza un insumo dentro de una partida del APU.
   * Full replace del array (ADR-010).
   */
  actualizarInsumo: async (apuId: string, partidaId: string, insumoId: string, data: Partial<Omit<Insumo, 'id' | 'subtotal'>>, partidasActuales: Partida[]): Promise<APU> => {
    const nuevasPartidas = partidasActuales.map((p) => {
      if (p.id !== partidaId) return p
      const nuevosInsumos = p.insumos.map((i) => {
        if (i.id !== insumoId) return i
        return calcularInsumo({ ...i, ...data })
      })
      return calcularPartida({ ...p, insumos: nuevosInsumos })
    })
    await _overwritePartidas(apuId, nuevasPartidas)
    const updated = await apuService.getById(apuId)
    if (!updated) throw new Error('APU no encontrado después de actualizar insumo')
    return updated
  },

  /**
   * Elimina un insumo de una partida del APU.
   * Full replace del array (ADR-010).
   */
  eliminarInsumo: async (apuId: string, partidaId: string, insumoId: string, partidasActuales: Partida[]): Promise<APU> => {
    const nuevasPartidas = partidasActuales.map((p) => {
      if (p.id !== partidaId) return p
      return calcularPartida({ ...p, insumos: p.insumos.filter((i) => i.id !== insumoId) })
    })
    await _overwritePartidas(apuId, nuevasPartidas)
    const updated = await apuService.getById(apuId)
    if (!updated) throw new Error('APU no encontrado después de eliminar insumo')
    return updated
  },
}
