// ============================================================
// SERVICIO: Proyectos — Módulo 2 (Sprint 3A)
// Documentación: /docs/modulo-2-proyectos/
// Colección Firestore: 'proyectos'
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
import { v4 as uuidv4 } from 'uuid'
import { getFirestoreDb, convertTimestamps } from '@/lib/firebase/firestore'
import { getFirebaseAuth } from '@/lib/firebase/auth'
import { entidadesService, calcularNivelCompletitud } from '@/services/entidades.service'
import type {
  Proyecto,
  EstadoProyecto,
  FiltrosProyecto,
  CrearProyectoDTO,
  ActualizarProyectoDTO,
  EntradaHistorialProyecto,
  NivelRiesgoEntidad,
  LeccionesAprendidas,
  CausaCancelacion,
  ProyectosStats,
} from '@/types'

const COLECCION = 'proyectos'

// -------------------------------------------------------
// HELPERS INTERNOS
// -------------------------------------------------------

function getCurrentUserId(): string {
  const auth = getFirebaseAuth()
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('Usuario no autenticado')
  return uid
}

function getCurrentUserName(): string {
  const auth = getFirebaseAuth()
  return auth.currentUser?.displayName || auth.currentUser?.email || 'Sistema'
}

async function registrarHistorial(
  proyectoId: string,
  entrada: Omit<EntradaHistorialProyecto, 'id' | 'proyectoId' | 'fechaHora'>
): Promise<void> {
  const db = getFirestoreDb()
  const historialRef = collection(db, COLECCION, proyectoId, 'historial')
  await addDoc(historialRef, {
    ...entrada,
    proyectoId,
    fechaHora: Timestamp.now(),
  })
}

function docToProyecto(id: string, data: Record<string, unknown>): Proyecto {
  const converted = convertTimestamps({ id, ...data }) as Proyecto
  // Garantizar arrays vacíos si vienen undefined de Firestore
  converted.equipo = converted.equipo ?? []
  converted.riesgos = converted.riesgos ?? []
  converted.hitos = converted.hitos ?? []
  return converted
}

// -------------------------------------------------------
// VALIDACIÓN: entidad en NIVEL ESTÁNDAR (M2-01 §9 PASO 1)
// -------------------------------------------------------

/**
 * Verifica que la entidad cliente esté en NIVEL ESTÁNDAR o COMPLETO.
 * Lanza error si no cumple, para bloquear la creación del proyecto.
 */
export async function validarEntidadEstandar(entidadId: string): Promise<void> {
  const entidad = await entidadesService.getById(entidadId)
  if (!entidad) throw new Error('La entidad cliente no existe en el sistema')
  if (entidad.estado !== 'activo') throw new Error('La entidad cliente no está activa')

  const glosarioCount = await entidadesService.glosario.getCount(entidadId)
  const nivel = calcularNivelCompletitud(entidad, glosarioCount)

  if (nivel === 'minimo') {
    throw new Error(
      `La entidad "${entidad.razonSocial}" está en NIVEL MÍNIMO de completitud. ` +
      'Para crear un proyecto necesita al menos NIVEL ESTÁNDAR: ' +
      '2+ stakeholders con influencia, evaluación de factibilidad completada y 5+ términos en glosario.'
    )
  }
}

// -------------------------------------------------------
// SERVICIO PRINCIPAL
// -------------------------------------------------------

export const proyectosService = {
  /**
   * Obtiene todos los proyectos con filtros opcionales.
   * Filtros de estado/tipo/criticidad se aplican en Firestore.
   * Filtro clienteId y búsqueda por texto se aplican en cliente.
   */
  getAll: async (filtros?: FiltrosProyecto): Promise<Proyecto[]> => {
    const db = getFirestoreDb()
    const constraints = []

    if (filtros?.estado) constraints.push(where('estado', '==', filtros.estado))
    if (filtros?.tipo) constraints.push(where('tipo', '==', filtros.tipo))
    if (filtros?.criticidad) constraints.push(where('criticidad', '==', filtros.criticidad))
    if (filtros?.clienteId) constraints.push(where('clienteId', '==', filtros.clienteId))
    constraints.push(orderBy('actualizadoEn', 'desc'))

    const q = query(collection(db, COLECCION), ...constraints)
    const snapshot = await getDocs(q)
    let proyectos = snapshot.docs.map((d) => docToProyecto(d.id, d.data()))

    if (filtros?.busqueda?.trim()) {
      const busq = filtros.busqueda.toLowerCase()
      proyectos = proyectos.filter(
        (p) =>
          p.nombre?.toLowerCase().includes(busq) ||
          p.codigo?.toLowerCase().includes(busq) ||
          p.descripcion?.toLowerCase().includes(busq)
      )
    }

    return proyectos
  },

  /** Obtiene un proyecto por ID. Retorna null si no existe. */
  getById: async (id: string): Promise<Proyecto | null> => {
    const db = getFirestoreDb()
    const snap = await getDoc(doc(db, COLECCION, id))
    if (!snap.exists()) return null
    return docToProyecto(snap.id, snap.data())
  },

  /** Obtiene todos los proyectos de una entidad cliente */
  getByClienteId: async (clienteId: string): Promise<Proyecto[]> => {
    return proyectosService.getAll({ clienteId })
  },

  /**
   * Crea un nuevo proyecto.
   * Valida que la entidad cliente esté en NIVEL ESTÁNDAR (M2-01 §9 PASO 1).
   * Estado inicial: 'borrador'.
   */
  create: async (data: CrearProyectoDTO, activar = false): Promise<Proyecto> => {
    const db = getFirestoreDb()
    const uid = getCurrentUserId()
    const userName = getCurrentUserName()
    const ahora = Timestamp.now()

    // Validar entidad en NIVEL ESTÁNDAR
    await validarEntidadEstandar(data.clienteId)

    // Asignar IDs a elementos de arrays que no los tengan
    const riesgosConId = (data.riesgos ?? []).map((r) => ({ ...r, id: r.id || uuidv4() }))
    const hitosConId = (data.hitos ?? []).map((h) => ({ ...h, id: h.id || uuidv4() }))
    const equipoConId = (data.equipo ?? [])

    const estado: EstadoProyecto = activar ? 'pendiente_aprobacion' : 'borrador'

    const docData = {
      ...data,
      estado,
      estadoSRS: 'no_iniciado',
      equipo: equipoConId,
      riesgos: riesgosConId,
      hitos: hitosConId,
      // Sincronizar presupuestoEstimado con el nominal del presupuesto detallado
      presupuestoEstimado: data.presupuesto?.estimacionNominal ?? data.presupuestoEstimado,
      moneda: data.presupuesto?.moneda ?? data.moneda,
      creadoEn: ahora,
      actualizadoEn: ahora,
      creadoPor: uid,
    }

    const docRef = await addDoc(collection(db, COLECCION), docData)

    await registrarHistorial(docRef.id, {
      usuarioId: uid,
      usuarioNombre: userName,
      tipoAccion: 'creacion',
      valorNuevo: `${data.nombre} (${data.codigo})`,
    })

    return docToProyecto(docRef.id, {
      ...docData,
      creadoEn: ahora.toDate(),
      actualizadoEn: ahora.toDate(),
    })
  },

  /** Actualiza un proyecto existente. Registra cambio en historial. */
  update: async (id: string, data: ActualizarProyectoDTO): Promise<Proyecto> => {
    const db = getFirestoreDb()
    const uid = getCurrentUserId()
    const userName = getCurrentUserName()
    const ahora = Timestamp.now()

    const updateData: Record<string, unknown> = {
      ...data,
      actualizadoEn: ahora,
    }

    // Asegurar IDs en arrays
    if (data.riesgos) updateData.riesgos = data.riesgos.map((r) => ({ ...r, id: r.id || uuidv4() }))
    if (data.hitos) updateData.hitos = data.hitos.map((h) => ({ ...h, id: h.id || uuidv4() }))
    if (data.presupuesto) {
      updateData.presupuestoEstimado = data.presupuesto.estimacionNominal
      updateData.moneda = data.presupuesto.moneda
    }

    await updateDoc(doc(db, COLECCION, id), updateData)

    await registrarHistorial(id, {
      usuarioId: uid,
      usuarioNombre: userName,
      tipoAccion: 'actualizacion_datos',
    })

    const updated = await proyectosService.getById(id)
    if (!updated) throw new Error('Proyecto no encontrado después de actualizar')
    return updated
  },

  /**
   * Cambia el estado del proyecto.
   * Registra la transición en el historial con motivo obligatorio.
   */
  updateEstado: async (
    id: string,
    estado: EstadoProyecto,
    motivo: string
  ): Promise<void> => {
    const db = getFirestoreDb()
    const uid = getCurrentUserId()
    const userName = getCurrentUserName()

    const actual = await proyectosService.getById(id)
    const estadoAnterior = actual?.estado

    await updateDoc(doc(db, COLECCION, id), {
      estado,
      actualizadoEn: Timestamp.now(),
    })

    await registrarHistorial(id, {
      usuarioId: uid,
      usuarioNombre: userName,
      tipoAccion: 'cambio_estado',
      campoModificado: 'estado',
      valorAnterior: estadoAnterior,
      valorNuevo: estado,
      motivo,
    })
  },

  /**
   * Soft delete: cambia estado a 'cancelado'.
   * Los proyectos NO se eliminan de Firestore.
   */
  delete: async (id: string): Promise<void> => {
    await proyectosService.updateEstado(id, 'cancelado', 'Proyecto cancelado por el usuario')
  },

  /** Obtiene el historial de cambios de un proyecto */
  getHistorial: async (proyectoId: string): Promise<EntradaHistorialProyecto[]> => {
    const db = getFirestoreDb()
    const ref = collection(db, COLECCION, proyectoId, 'historial')
    const q = query(ref, orderBy('fechaHora', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) =>
      convertTimestamps({ id: d.id, ...d.data() }) as EntradaHistorialProyecto
    )
  },

  /**
   * Cambia el estado de un riesgo dentro del proyecto (M2-03 §6).
   * Actualiza el array de riesgos en el documento y registra en historial.
   */
  updateRiesgoEstado: async (
    proyectoId: string,
    riesgoId: string,
    nuevoEstado: 'activo' | 'mitigado' | 'materializado' | 'cerrado',
    justificacion: string
  ): Promise<void> => {
    const db = getFirestoreDb()
    const uid = getCurrentUserId()
    const userName = getCurrentUserName()

    const proyecto = await proyectosService.getById(proyectoId)
    if (!proyecto) throw new Error('Proyecto no encontrado')

    const riesgoActual = proyecto.riesgos.find((r) => r.id === riesgoId)
    if (!riesgoActual) throw new Error('Riesgo no encontrado en el proyecto')

    const riesgosActualizados = proyecto.riesgos.map((r) =>
      r.id === riesgoId ? { ...r, estado: nuevoEstado } : r
    )

    await updateDoc(doc(db, COLECCION, proyectoId), {
      riesgos: riesgosActualizados,
      actualizadoEn: Timestamp.now(),
    })

    await registrarHistorial(proyectoId, {
      usuarioId: uid,
      usuarioNombre: userName,
      tipoAccion: 'gestion_riesgos',
      campoModificado: `riesgo[${riesgoId}].estado`,
      valorAnterior: riesgoActual.estado,
      valorNuevo: nuevoEstado,
      motivo: justificacion,
    })
  },

  /**
   * Cierra el proyecto como completado (M2-04 §9.1 + §9.3).
   * Registra lecciones aprendidas en historial.
   * Retroalimenta nivelRiesgo de la entidad: baja 1 nivel (M2-04 §5.2 T6).
   */
  cerrar: async (
    proyectoId: string,
    entidadId: string,
    lecciones: LeccionesAprendidas
  ): Promise<void> => {
    const db = getFirestoreDb()
    const uid = getCurrentUserId()
    const userName = getCurrentUserName()

    await updateDoc(doc(db, COLECCION, proyectoId), {
      estado: 'completado' as EstadoProyecto,
      actualizadoEn: Timestamp.now(),
    })

    await registrarHistorial(proyectoId, {
      usuarioId: uid,
      usuarioNombre: userName,
      tipoAccion: 'cierre',
      campoModificado: 'estado',
      valorAnterior: 'activo',
      valorNuevo: 'completado',
      motivo: JSON.stringify(lecciones),
    })

    // Retroalimentar M1: cierre limpio → bajar nivelRiesgo 1 nivel
    const NIVELES: NivelRiesgoEntidad[] = ['bajo', 'medio', 'alto', 'critico']
    try {
      const entidad = await entidadesService.getById(entidadId)
      if (entidad) {
        const idx = NIVELES.indexOf(entidad.nivelRiesgo)
        if (idx > 0) {
          await entidadesService.update(entidadId, { nivelRiesgo: NIVELES[idx - 1] })
        }
      }
    } catch {
      // No bloquear el cierre si falla la actualización de la entidad
    }
  },

  /**
   * Cancela el proyecto (M2-04 §9.2).
   * Causa tipificada obligatoria. Retroalimenta nivelRiesgo: sube 1 nivel (M2-04 §5.2 T7).
   */
  cancelar: async (
    proyectoId: string,
    entidadId: string,
    causa: CausaCancelacion,
    detalle: string
  ): Promise<void> => {
    const db = getFirestoreDb()
    const uid = getCurrentUserId()
    const userName = getCurrentUserName()

    await updateDoc(doc(db, COLECCION, proyectoId), {
      estado: 'cancelado' as EstadoProyecto,
      actualizadoEn: Timestamp.now(),
    })

    await registrarHistorial(proyectoId, {
      usuarioId: uid,
      usuarioNombre: userName,
      tipoAccion: 'cancelacion',
      campoModificado: 'estado',
      valorAnterior: 'activo',
      valorNuevo: 'cancelado',
      motivo: `${causa}: ${detalle}`,
    })

    // Retroalimentar M1: cancelación → subir nivelRiesgo 1 nivel
    const NIVELES: NivelRiesgoEntidad[] = ['bajo', 'medio', 'alto', 'critico']
    try {
      const entidad = await entidadesService.getById(entidadId)
      if (entidad) {
        const idx = NIVELES.indexOf(entidad.nivelRiesgo)
        if (idx < NIVELES.length - 1) {
          await entidadesService.update(entidadId, { nivelRiesgo: NIVELES[idx + 1] })
        }
      }
    } catch {
      // No bloquear la cancelación si falla la actualización de la entidad
    }
  },

  /**
   * Retorna estadísticas rápidas de proyectos para el dashboard.
   */
  getStats: async (): Promise<ProyectosStats> => {
    const db = getFirestoreDb()
    const snap = await getDocs(collection(db, COLECCION))
    const total = snap.size
    const activos = snap.docs.filter((d) =>
      ['activo_en_definicion', 'activo_en_desarrollo'].includes(d.data().estado as string)
    ).length
    return { total, activos }
  },

  // Re-exportar para uso externo
  validarEntidadEstandar,
}
