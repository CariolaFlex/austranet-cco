// ============================================================
// SERVICIO: Alcance / SRS — Módulo 3 (Sprint M3-FULL)
// Arquitectura Firestore (top-level collections, espejo M2-06):
//   'srs'                   — 1 doc por proyecto (proyectoId único)
//   'requerimientos'        — N por SRS (FK srsId + proyectoId)
//   'sesiones_entrevista'   — N por SRS
//   'escenarios'            — N por SRS
//   'casos_prueba'          — N por SRS + requerimientoId
//   'terminos_dominio_srs'  — N por SRS
// Fuentes: M3-01 a M3-10, M3-GATE1, M3-GATE2
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
import { getFirebaseAuth } from '@/lib/firebase/auth'
import { COLECCIONES_M3 } from '@/constants/alcance'
import type {
  SRS,
  Requerimiento,
  SesionEntrevista,
  Escenario,
  CasoPrueba,
  TerminoDominioSRS,
  EstadoSRS,
  EstadoGate1,
  EstadoSCRSRS,
  SolicitudCambioSRS,
  ObservacionValidacion,
  ItemChecklistSRS,
  Factibilidad,
  Prototipo,
  ArtefactoModelo,
  CrearSRSDTO,
  CrearRequerimientoDTO,
  CrearCasoPruebaDTO,
  CrearSesionEntrevistaDTO,
  CrearEscenarioDTO,
  CrearTerminoDominioSRSDTO,
  MetodologiaProyecto,
} from '@/types'

// -------------------------------------------------------
// HELPERS INTERNOS
// -------------------------------------------------------

function getCurrentUserId(): string {
  const auth = getFirebaseAuth()
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('Usuario no autenticado')
  return uid
}

function docToSRS(id: string, data: Record<string, unknown>): SRS {
  const converted = convertTimestamps({ id, ...data }) as SRS
  // Garantizar arrays vacíos si vienen undefined
  converted.stakeholdersSRS      = converted.stakeholdersSRS      ?? []
  converted.riesgosSRS           = converted.riesgosSRS           ?? []
  converted.prototipos           = converted.prototipos           ?? []
  converted.iteracionesBucle     = converted.iteracionesBucle     ?? []
  converted.artefactosModelo     = converted.artefactosModelo     ?? []
  converted.checklistValidacion  = converted.checklistValidacion  ?? []
  converted.observacionesValidacion = converted.observacionesValidacion ?? []
  converted.ccbSRS               = converted.ccbSRS               ?? []
  converted.solicitudesCambioSRS = converted.solicitudesCambioSRS ?? []
  converted.matrizTrazabilidad   = converted.matrizTrazabilidad   ?? []
  converted.tecnicasActivas      = converted.tecnicasActivas      ?? []
  return converted
}

function docToRequerimiento(id: string, data: Record<string, unknown>): Requerimiento {
  const converted = convertTimestamps({ id, ...data }) as Requerimiento
  converted.dependencias        = converted.dependencias        ?? []
  converted.dependenciasTecnicas = converted.dependenciasTecnicas ?? []
  converted.implicacionEnRF     = converted.implicacionEnRF     ?? []
  return converted
}

/** Genera el siguiente código correlativo en formato XX-NNN */
async function generarCodigo(coleccion: string, prefijo: string, proyectoId: string): Promise<string> {
  const db = getFirestoreDb()
  const q = query(collection(db, coleccion), where('proyectoId', '==', proyectoId))
  const snap = await getDocs(q)
  const siguiente = snap.size + 1
  return `${prefijo}-${String(siguiente).padStart(3, '0')}`
}

/** Genera código de Requerimiento: RF-001, RNF-001, RD-001 */
async function generarCodigoRequerimiento(
  srsId: string,
  tipo: 'funcional' | 'no_funcional' | 'dominio'
): Promise<string> {
  const db = getFirestoreDb()
  const prefijos = { funcional: 'RF', no_funcional: 'RNF', dominio: 'RD' }
  const prefijo = prefijos[tipo]
  const q = query(
    collection(db, COLECCIONES_M3.REQUERIMIENTOS),
    where('srsId', '==', srsId),
    where('tipo', '==', tipo)
  )
  const snap = await getDocs(q)
  const siguiente = snap.size + 1
  return `${prefijo}-${String(siguiente).padStart(3, '0')}`
}

// -------------------------------------------------------
// DERIVAR TIPO SRS DESDE METODOLOGÍA (M2-INT-03)
// -------------------------------------------------------

/**
 * Determina el tipoSRS basado en la metodología del proyecto (M2-INT-03).
 * Mismo resultado que calcularEfectosCascada().tipoSRS — evita importar
 * el módulo de metodología desde el servicio de alcance.
 */
function derivarTipoSRS(metodologia: MetodologiaProyecto): SRS['tipoSRS'] {
  const mapa: Record<MetodologiaProyecto, SRS['tipoSRS']> = {
    cascada:     'completo',
    rup:         'completo',
    espiral:     'completo',
    incremental: 'incremental',
    hibrido:     'incremental',
    agil_scrum:  'epica',
    agil_xp:     'epica',
  }
  return mapa[metodologia] ?? 'completo'
}

// -------------------------------------------------------
// SERVICIO PRINCIPAL
// -------------------------------------------------------

export const alcanceService = {

  // ====================================================
  // SRS CRUD
  // ====================================================

  /**
   * Obtiene el SRS activo de un proyecto.
   * Solo debe existir un SRS por proyecto (1-a-1).
   * Retorna null si el proyecto aún no tiene SRS.
   */
  getSRSByProyecto: async (proyectoId: string): Promise<SRS | null> => {
    const db = getFirestoreDb()
    const q = query(
      collection(db, COLECCIONES_M3.SRS),
      where('proyectoId', '==', proyectoId),
      orderBy('creadoEn', 'desc')
    )
    const snap = await getDocs(q)
    if (snap.empty) return null
    const d = snap.docs[0]
    return docToSRS(d.id, d.data())
  },

  getById: async (id: string): Promise<SRS | null> => {
    const db = getFirestoreDb()
    const snap = await getDoc(doc(db, COLECCIONES_M3.SRS, id))
    if (!snap.exists()) return null
    return docToSRS(snap.id, snap.data())
  },

  /**
   * Crea el SRS inicial del proyecto.
   * M3-TRIGGER: Llamado automáticamente desde proyectos.service cuando
   *             el proyecto pasa a 'activo_en_definicion'.
   * El estado inicial es 'no_iniciado' hasta que se complete Gate 1.
   */
  crearSRSInicial: async (proyectoId: string, metodologia: MetodologiaProyecto): Promise<SRS> => {
    const db = getFirestoreDb()
    const uid = getCurrentUserId()
    const ahora = Timestamp.now()

    // Idempotente: si ya existe, retornar el existente
    const existente = await alcanceService.getSRSByProyecto(proyectoId)
    if (existente) return existente

    const tipoSRS = derivarTipoSRS(metodologia)

    const docData: Omit<SRS, 'id'> = {
      proyectoId,
      version: 'v0.1',
      estado: 'no_iniciado',
      tipoSRS,
      validacionIncremental: metodologia === 'agil_scrum' || metodologia === 'agil_xp',
      gate1Estado: 'pendiente',
      stakeholdersSRS: [],
      riesgosSRS: [],
      tecnicasActivas: [],
      prototipos: [],
      iteracionesBucle: [],
      artefactosModelo: [],
      checklistValidacion: [],
      observacionesValidacion: [],
      ccbSRS: [],
      solicitudesCambioSRS: [],
      matrizTrazabilidad: [],
      contadorCiclosValidacion: 0,
      creadoEn: ahora.toDate(),
      actualizadoEn: ahora.toDate(),
      creadoPor: uid,
    }

    const ref = await addDoc(collection(db, COLECCIONES_M3.SRS), {
      ...docData,
      creadoEn: ahora,
      actualizadoEn: ahora,
    })

    return { id: ref.id, ...docData }
  },

  /**
   * Crea un SRS desde un DTO explícito.
   * Normalemente se usa crearSRSInicial; este método es para casos excepcionales.
   */
  createSRS: async (data: CrearSRSDTO): Promise<SRS> => {
    const db = getFirestoreDb()
    const uid = getCurrentUserId()
    const ahora = Timestamp.now()

    const docData = {
      ...data,
      creadoEn: ahora,
      actualizadoEn: ahora,
      creadoPor: uid,
    }

    const ref = await addDoc(collection(db, COLECCIONES_M3.SRS), removeUndefined(docData))
    return docToSRS(ref.id, {
      ...docData,
      creadoEn: ahora.toDate(),
      actualizadoEn: ahora.toDate(),
    })
  },

  /** Actualiza campos parciales del SRS */
  updateSRS: async (id: string, data: Partial<Omit<SRS, 'id' | 'creadoEn' | 'creadoPor'>>): Promise<SRS> => {
    const db = getFirestoreDb()
    await updateDoc(doc(db, COLECCIONES_M3.SRS, id), removeUndefined({
      ...data,
      actualizadoEn: Timestamp.now(),
    }))
    const updated = await alcanceService.getById(id)
    if (!updated) throw new Error('SRS no encontrado después de actualizar')
    return updated
  },

  /**
   * Cambia el estado del SRS.
   * Los cambios de estado siguen el flujo de 8 fases (M3-01 §5):
   *   no_iniciado → en_adquisicion (post Gate 1 Go)
   *   en_adquisicion → en_prototipado → en_modelado → en_especificacion
   *   → en_validacion → aprobado (Gate 2)
   *   en_validacion → con_observaciones (si hay observaciones no resueltas)
   *   cualquier_estado → cancelado (Gate 1 No-Go)
   */
  updateEstadoSRS: async (id: string, estado: EstadoSRS): Promise<void> => {
    const db = getFirestoreDb()
    await updateDoc(doc(db, COLECCIONES_M3.SRS, id), {
      estado,
      actualizadoEn: Timestamp.now(),
    })
  },

  // ====================================================
  // GATE 1: Factibilidad (M3-GATE1, M3-F1-04)
  // ====================================================

  /**
   * Procesa el Gate 1 (Go / NoGo) basado en el estudio de factibilidad.
   *
   * Go → SRS pasa a 'en_adquisicion' + actualiza Proyecto.estadoSRS
   * NoGo → SRS pasa a 'cancelado' + requiere motivoCancelacion
   *
   * Regla: si cualquiera de las 3 dimensiones es 'no_viable' → global = no_viable → NoGo automático.
   * (M3-F1-04 §5 — "la factibilidad es la multiplicación lógica de las 3 dimensiones")
   */
  procesarGate1: async (
    srsId: string,
    decision: EstadoGate1,
    factibilidad: Factibilidad,
    decisionPor: string
  ): Promise<void> => {
    if (decision === 'pendiente') throw new Error('procesarGate1: decisión inválida "pendiente"')

    const srs = await alcanceService.getById(srsId)
    if (!srs) throw new Error('SRS no encontrado')

    // Calcular global si no viene calculado
    const global =
      factibilidad.negocio.resultado === 'no_viable' ||
      factibilidad.tecnica.resultado === 'no_viable' ||
      factibilidad.integracion.resultado === 'no_viable'
        ? 'no_viable'
        : factibilidad.negocio.resultado === 'viable_con_restricciones' ||
          factibilidad.tecnica.resultado === 'viable_con_restricciones' ||
          factibilidad.integracion.resultado === 'viable_con_restricciones'
        ? 'viable_con_restricciones'
        : 'viable'

    const factibilidadFinal: Factibilidad = { ...factibilidad, global }

    // NoGo automático si global = no_viable
    const decisionFinal: EstadoGate1 = global === 'no_viable' ? 'nogo' : decision

    const nuevoEstadoSRS: EstadoSRS =
      decisionFinal === 'go' ? 'en_adquisicion' : 'cancelado'

    const db = getFirestoreDb()
    await updateDoc(doc(db, COLECCIONES_M3.SRS, srsId), {
      factibilidad: factibilidadFinal,
      gate1Estado: decisionFinal,
      gate1FechaDecision: Timestamp.now(),
      gate1DecisionPor: decisionPor,
      estado: nuevoEstadoSRS,
      actualizadoEn: Timestamp.now(),
    })
  },

  // ====================================================
  // GATE 2: Aprobación Formal del SRS (M3-GATE2)
  // ====================================================

  /**
   * Aprueba formalmente el SRS v1.0.
   * Pre-condición: todos los ítems bloqueantes del checklist deben estar cumplidos.
   * Post-efectos (invocar desde el componente o hook):
   *   - SRS.estado → 'aprobado'
   *   - SRS.version → 'v1.0'
   *   - Proyecto.estadoSRS → 'aprobado'
   *   - Proyecto.estado → 'activo_en_desarrollo'  ← coordinado externamente con proyectosService
   */
  aprobarGate2: async (
    srsId: string,
    aprobadoPorId: string,
    aprobadoPorNombre: string
  ): Promise<void> => {
    const srs = await alcanceService.getById(srsId)
    if (!srs) throw new Error('SRS no encontrado')
    if (srs.estado !== 'en_validacion')
      throw new Error('El SRS debe estar en estado "en_validacion" para ser aprobado')

    // Verificar que los ítems bloqueantes estén cumplidos
    const bloqueantes = (srs.checklistValidacion ?? []).filter(
      (item) => item.estado !== 'cumplido' && item.estado !== 'no_aplica'
    )
    // Solo bloqueamos si hay ítems bloqueantes que no están cumplidos (checklist definido)
    if (srs.checklistValidacion && srs.checklistValidacion.length > 0 && bloqueantes.length > 0) {
      const codigos = bloqueantes.map((i) => i.codigo).join(', ')
      throw new Error(
        `No se puede aprobar el SRS. Los siguientes ítems del checklist están pendientes: ${codigos}`
      )
    }

    const db = getFirestoreDb()
    await updateDoc(doc(db, COLECCIONES_M3.SRS, srsId), {
      estado: 'aprobado' as EstadoSRS,
      version: 'v1.0',
      aprobadoPor: aprobadoPorId,
      aprobadoPorNombre,
      fechaAprobacion: Timestamp.now(),
      actualizadoEn: Timestamp.now(),
    })
  },

  // ====================================================
  // REQUERIMIENTOS CRUD (Colección 'requerimientos')
  // ====================================================

  getRequerimientos: async (srsId: string): Promise<Requerimiento[]> => {
    const db = getFirestoreDb()
    const q = query(
      collection(db, COLECCIONES_M3.REQUERIMIENTOS),
      where('srsId', '==', srsId),
      orderBy('codigo', 'asc')
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => docToRequerimiento(d.id, d.data()))
  },

  getRequerimientosByProyecto: async (proyectoId: string): Promise<Requerimiento[]> => {
    const db = getFirestoreDb()
    const q = query(
      collection(db, COLECCIONES_M3.REQUERIMIENTOS),
      where('proyectoId', '==', proyectoId),
      orderBy('codigo', 'asc')
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => docToRequerimiento(d.id, d.data()))
  },

  createRequerimiento: async (data: CrearRequerimientoDTO): Promise<Requerimiento> => {
    const db = getFirestoreDb()
    const uid = getCurrentUserId()
    const ahora = Timestamp.now()

    const codigo = await generarCodigoRequerimiento(data.srsId, data.tipo)

    const docData = {
      ...data,
      codigo,
      version: 1,
      creadoEn: ahora,
      actualizadoEn: ahora,
      creadoPor: uid,
    }

    const ref = await addDoc(collection(db, COLECCIONES_M3.REQUERIMIENTOS), removeUndefined(docData))
    return docToRequerimiento(ref.id, {
      ...docData,
      creadoEn: ahora.toDate(),
      actualizadoEn: ahora.toDate(),
    })
  },

  updateRequerimiento: async (
    id: string,
    data: Partial<Omit<Requerimiento, 'id' | 'creadoEn' | 'creadoPor' | 'codigo' | 'srsId' | 'proyectoId'>>
  ): Promise<Requerimiento> => {
    const db = getFirestoreDb()
    await updateDoc(doc(db, COLECCIONES_M3.REQUERIMIENTOS, id), removeUndefined({
      ...data,
      actualizadoEn: Timestamp.now(),
    }))
    const snap = await getDoc(doc(db, COLECCIONES_M3.REQUERIMIENTOS, id))
    if (!snap.exists()) throw new Error('Requerimiento no encontrado después de actualizar')
    return docToRequerimiento(snap.id, snap.data())
  },

  /**
   * Soft delete: cambia estado a 'rechazado'.
   * Los requerimientos NUNCA se eliminan físicamente de Firestore (trazabilidad M3-09).
   */
  deleteRequerimiento: async (id: string, motivo?: string): Promise<void> => {
    const db = getFirestoreDb()
    await updateDoc(doc(db, COLECCIONES_M3.REQUERIMIENTOS, id), {
      estado: 'rechazado',
      razonCambio: motivo ?? 'Eliminado por el analista',
      actualizadoEn: Timestamp.now(),
    })
  },

  // ====================================================
  // SESIONES DE ENTREVISTA (Colección 'sesiones_entrevista')
  // ====================================================

  getSesionesEntrevista: async (srsId: string): Promise<SesionEntrevista[]> => {
    const db = getFirestoreDb()
    const q = query(
      collection(db, COLECCIONES_M3.SESIONES_ENTREVISTA),
      where('srsId', '==', srsId),
      orderBy('fecha', 'asc')
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) =>
      convertTimestamps({ id: d.id, ...d.data() }) as SesionEntrevista
    )
  },

  createSesionEntrevista: async (data: CrearSesionEntrevistaDTO): Promise<SesionEntrevista> => {
    const db = getFirestoreDb()
    const uid = getCurrentUserId()
    const ahora = Timestamp.now()

    const entrevistaId = await generarCodigo(
      COLECCIONES_M3.SESIONES_ENTREVISTA,
      'ENT',
      data.proyectoId
    )

    const docData = {
      ...data,
      entrevistaId,
      reqsEmergentes: data.reqsEmergentes ?? [],
      terminosGlosario: data.terminosGlosario ?? [],
      conflictosDetectados: data.conflictosDetectados ?? '',
      creadoEn: ahora,
      creadoPor: uid,
    }

    const ref = await addDoc(collection(db, COLECCIONES_M3.SESIONES_ENTREVISTA), removeUndefined(docData))
    return convertTimestamps({ id: ref.id, ...docData, creadoEn: ahora.toDate() }) as SesionEntrevista
  },

  updateSesionEntrevista: async (
    id: string,
    data: Partial<Omit<SesionEntrevista, 'id' | 'creadoEn' | 'creadoPor'>>
  ): Promise<void> => {
    const db = getFirestoreDb()
    await updateDoc(doc(db, COLECCIONES_M3.SESIONES_ENTREVISTA, id), removeUndefined({ ...data }))
  },

  // ====================================================
  // ESCENARIOS (Colección 'escenarios')
  // ====================================================

  getEscenarios: async (srsId: string): Promise<Escenario[]> => {
    const db = getFirestoreDb()
    const q = query(
      collection(db, COLECCIONES_M3.ESCENARIOS),
      where('srsId', '==', srsId),
      orderBy('creadoEn', 'asc')
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) =>
      convertTimestamps({ id: d.id, ...d.data() }) as Escenario
    )
  },

  createEscenario: async (data: CrearEscenarioDTO): Promise<Escenario> => {
    const db = getFirestoreDb()
    const uid = getCurrentUserId()
    const ahora = Timestamp.now()

    const escenarioId = await generarCodigo(COLECCIONES_M3.ESCENARIOS, 'ESC', data.proyectoId)

    const docData = {
      ...data,
      escenarioId,
      flujoNormal: data.flujoNormal ?? [],
      requerimientosGenerados: data.requerimientosGenerados ?? [],
      esBaseParaCasoDeUso: data.esBaseParaCasoDeUso ?? false,
      creadoEn: ahora,
      creadoPor: uid,
    }

    const ref = await addDoc(collection(db, COLECCIONES_M3.ESCENARIOS), removeUndefined(docData))
    return convertTimestamps({ id: ref.id, ...docData, creadoEn: ahora.toDate() }) as Escenario
  },

  updateEscenario: async (
    id: string,
    data: Partial<Omit<Escenario, 'id' | 'creadoEn' | 'creadoPor'>>
  ): Promise<void> => {
    const db = getFirestoreDb()
    await updateDoc(doc(db, COLECCIONES_M3.ESCENARIOS, id), removeUndefined({ ...data }))
  },

  // ====================================================
  // CASOS DE PRUEBA (Colección 'casos_prueba')
  // ====================================================

  getCasosPrueba: async (srsId: string): Promise<CasoPrueba[]> => {
    const db = getFirestoreDb()
    const q = query(
      collection(db, COLECCIONES_M3.CASOS_PRUEBA),
      where('srsId', '==', srsId),
      orderBy('codigo', 'asc')
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) =>
      convertTimestamps({ id: d.id, ...d.data() }) as CasoPrueba
    )
  },

  createCasoPrueba: async (data: CrearCasoPruebaDTO): Promise<CasoPrueba> => {
    const db = getFirestoreDb()
    const uid = getCurrentUserId()
    const ahora = Timestamp.now()

    const codigo = await generarCodigo(COLECCIONES_M3.CASOS_PRUEBA, 'CP', data.proyectoId)

    const docData = {
      ...data,
      codigo,
      estado: 'pendiente' as CasoPrueba['estado'],
      creadoEn: ahora,
      creadoPor: uid,
    }

    const ref = await addDoc(collection(db, COLECCIONES_M3.CASOS_PRUEBA), removeUndefined(docData))
    return convertTimestamps({ id: ref.id, ...docData, creadoEn: ahora.toDate() }) as CasoPrueba
  },

  updateCasoPrueba: async (
    id: string,
    data: Partial<Omit<CasoPrueba, 'id' | 'creadoEn' | 'creadoPor'>>
  ): Promise<void> => {
    const db = getFirestoreDb()
    await updateDoc(doc(db, COLECCIONES_M3.CASOS_PRUEBA, id), removeUndefined({ ...data }))
  },

  // ====================================================
  // TÉRMINOS DE DOMINIO SRS (Colección 'terminos_dominio_srs')
  // ====================================================

  getTerminosDominio: async (srsId: string): Promise<TerminoDominioSRS[]> => {
    const db = getFirestoreDb()
    const q = query(
      collection(db, COLECCIONES_M3.TERMINOS_DOMINIO_SRS),
      where('srsId', '==', srsId),
      orderBy('termino', 'asc')
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) =>
      convertTimestamps({ id: d.id, ...d.data() }) as TerminoDominioSRS
    )
  },

  createTerminoDominio: async (data: CrearTerminoDominioSRSDTO): Promise<TerminoDominioSRS> => {
    const db = getFirestoreDb()
    const uid = getCurrentUserId()
    const ahora = Timestamp.now()

    const docData = {
      ...data,
      esRequerimientoDominio: data.esRequerimientoDominio ?? false,
      creadoEn: ahora,
      creadoPor: uid,
    }

    const ref = await addDoc(collection(db, COLECCIONES_M3.TERMINOS_DOMINIO_SRS), removeUndefined(docData))
    return convertTimestamps({ id: ref.id, ...docData, creadoEn: ahora.toDate() }) as TerminoDominioSRS
  },

  updateTerminoDominio: async (
    id: string,
    data: Partial<Omit<TerminoDominioSRS, 'id' | 'creadoEn' | 'creadoPor'>>
  ): Promise<void> => {
    const db = getFirestoreDb()
    await updateDoc(doc(db, COLECCIONES_M3.TERMINOS_DOMINIO_SRS, id), removeUndefined({ ...data }))
  },

  // ====================================================
  // PROTOTIPOS (embebidos en SRS.prototipos — M3-F3-01/F3-02)
  // ====================================================

  agregarPrototipo: async (srsId: string, prototipo: Omit<Prototipo, 'id' | 'creadoEn' | 'creadoPor'>): Promise<Prototipo> => {
    const db = getFirestoreDb()
    const uid = getCurrentUserId()
    const ahora = Timestamp.now()

    const srs = await alcanceService.getById(srsId)
    if (!srs) throw new Error('SRS no encontrado')

    const siguiente = (srs.prototipos ?? []).length + 1
    const nuevoProto: Prototipo = {
      ...prototipo,
      id: `prt-${Date.now()}`,
      prototipoId: `PRT-${String(siguiente).padStart(3, '0')}`,
      requerimientosAValidar: prototipo.requerimientosAValidar ?? [],
      stakeholdersParticipantes: prototipo.stakeholdersParticipantes ?? [],
      creadoEn: ahora.toDate(),
      creadoPor: uid,
    }

    await updateDoc(doc(db, COLECCIONES_M3.SRS, srsId), {
      prototipos: [...(srs.prototipos ?? []), nuevoProto],
      actualizadoEn: ahora,
    })

    return nuevoProto
  },

  actualizarResultadoPrototipo: async (
    srsId: string,
    prototipoId: string,
    resultado: Prototipo['resultado'],
    resultadoPorRequerimiento?: Record<string, Prototipo['resultado']>,
    observaciones?: string
  ): Promise<void> => {
    const db = getFirestoreDb()
    const srs = await alcanceService.getById(srsId)
    if (!srs) throw new Error('SRS no encontrado')

    const prototipos = (srs.prototipos ?? []).map((p) => {
      if (p.id !== prototipoId) return p
      return {
        ...p,
        resultado,
        resultadoPorRequerimiento: resultadoPorRequerimiento ?? p.resultadoPorRequerimiento,
        observaciones: observaciones ?? p.observaciones,
      }
    })

    await updateDoc(doc(db, COLECCIONES_M3.SRS, srsId), {
      prototipos,
      actualizadoEn: Timestamp.now(),
    })
  },

  // ====================================================
  // ARTEFACTOS DE MODELO (embebidos en SRS.artefactosModelo — M3-F4)
  // ====================================================

  agregarArtefactoModelo: async (srsId: string, artefacto: Omit<ArtefactoModelo, 'id' | 'creadoEn' | 'creadoPor'>): Promise<ArtefactoModelo> => {
    const db = getFirestoreDb()
    const uid = getCurrentUserId()
    const ahora = Timestamp.now()

    const srs = await alcanceService.getById(srsId)
    if (!srs) throw new Error('SRS no encontrado')

    const nuevoArtefacto: ArtefactoModelo = {
      ...artefacto,
      id: `art-${Date.now()}`,
      creadoEn: ahora.toDate(),
      creadoPor: uid,
    }

    await updateDoc(doc(db, COLECCIONES_M3.SRS, srsId), {
      artefactosModelo: [...(srs.artefactosModelo ?? []), nuevoArtefacto],
      actualizadoEn: ahora,
    })

    return nuevoArtefacto
  },

  // ====================================================
  // CHECKLIST DE VALIDACIÓN (embebido en SRS — M3-F7-01)
  // ====================================================

  /**
   * Inicializa los 21 ítems del checklist desde CHECKLIST_SRS_21_ITEMS.
   * Se llama al pasar a 'en_validacion' (M3-F7-01).
   */
  inicializarChecklist: async (srsId: string): Promise<void> => {
    const { CHECKLIST_SRS_21_ITEMS } = await import('@/constants/alcance')
    const db = getFirestoreDb()

    const items: ItemChecklistSRS[] = CHECKLIST_SRS_21_ITEMS.map((def) => ({
      codigo: def.codigo,
      descripcion: def.descripcion,
      estado: 'pendiente' as const,
    }))

    await updateDoc(doc(db, COLECCIONES_M3.SRS, srsId), {
      checklistValidacion: items,
      estado: 'en_validacion' as EstadoSRS,
      actualizadoEn: Timestamp.now(),
    })
  },

  actualizarItemChecklist: async (
    srsId: string,
    codigo: string,
    estado: ItemChecklistSRS['estado'],
    nota?: string
  ): Promise<void> => {
    const db = getFirestoreDb()
    const srs = await alcanceService.getById(srsId)
    if (!srs) throw new Error('SRS no encontrado')

    const items = (srs.checklistValidacion ?? []).map((item) =>
      item.codigo === codigo ? { ...item, estado, nota: nota ?? item.nota } : item
    )

    await updateDoc(doc(db, COLECCIONES_M3.SRS, srsId), {
      checklistValidacion: items,
      actualizadoEn: Timestamp.now(),
    })
  },

  // ====================================================
  // OBSERVACIONES DE VALIDACIÓN (embebidas en SRS — M3-F7-01)
  // ====================================================

  agregarObservacion: async (
    srsId: string,
    obs: Omit<ObservacionValidacion, 'id' | 'fechaCreacion' | 'resuelto'>
  ): Promise<ObservacionValidacion> => {
    const db = getFirestoreDb()
    const ahora = Timestamp.now()
    const srs = await alcanceService.getById(srsId)
    if (!srs) throw new Error('SRS no encontrado')

    const nueva: ObservacionValidacion = {
      ...obs,
      id: `obs-${Date.now()}`,
      resuelto: false,
      fechaCreacion: ahora.toDate(),
    }

    await updateDoc(doc(db, COLECCIONES_M3.SRS, srsId), removeUndefined({
      observacionesValidacion: [...(srs.observacionesValidacion ?? []), nueva],
      actualizadoEn: ahora,
    }))

    return nueva
  },

  resolverObservacion: async (
    srsId: string,
    obsId: string,
    resolucionTexto: string
  ): Promise<void> => {
    const db = getFirestoreDb()
    const srs = await alcanceService.getById(srsId)
    if (!srs) throw new Error('SRS no encontrado')

    const ahora = new Date()
    const observaciones = (srs.observacionesValidacion ?? []).map((obs) =>
      obs.id === obsId
        ? { ...obs, resuelto: true, resolucionTexto, fechaResolucion: ahora }
        : obs
    )

    // Si todas las observaciones están resueltas → volver a en_validacion
    const hayPendientes = observaciones.some((o) => !o.resuelto)
    const updates: Record<string, unknown> = {
      observacionesValidacion: observaciones,
      actualizadoEn: Timestamp.now(),
    }
    if (!hayPendientes && srs.estado === 'con_observaciones') {
      updates.estado = 'en_validacion' satisfies EstadoSRS
    }

    await updateDoc(doc(db, COLECCIONES_M3.SRS, srsId), removeUndefined(updates))
  },

  // ====================================================
  // SCR DEL SRS — post-aprobación (M3-09 §5)
  // ====================================================

  /**
   * Crea una Solicitud de Cambio al SRS (SCRSRS).
   * Solo disponible cuando SRS.estado === 'aprobado'.
   * Código generado: SCRSRS-001, SCRSRS-002...
   */
  crearSCRSRS: async (
    srsId: string,
    datos: Omit<SolicitudCambioSRS, 'id' | 'codigo' | 'estado' | 'creadoEn' | 'actualizadoEn' | 'creadoPor'>
  ): Promise<SolicitudCambioSRS> => {
    const uid = getCurrentUserId()
    const ahora = Timestamp.now()

    const srs = await alcanceService.getById(srsId)
    if (!srs) throw new Error('SRS no encontrado')
    if (srs.estado !== 'aprobado')
      throw new Error('Solo se pueden crear SCR al SRS cuando el estado es "aprobado"')

    const siguienteNum = (srs.solicitudesCambioSRS ?? []).length + 1
    const codigo = `SCRSRS-${String(siguienteNum).padStart(3, '0')}`

    const nueva: SolicitudCambioSRS = {
      ...datos,
      id: `scrsrs-${Date.now()}`,
      codigo,
      estado: 'propuesta' as EstadoSCRSRS,
      requerimientosAfectados: datos.requerimientosAfectados ?? [],
      creadoEn: ahora.toDate(),
      actualizadoEn: ahora.toDate(),
      creadoPor: uid,
    }

    const db = getFirestoreDb()
    await updateDoc(doc(db, COLECCIONES_M3.SRS, srsId), removeUndefined({
      solicitudesCambioSRS: [...(srs.solicitudesCambioSRS ?? []), nueva],
      actualizadoEn: ahora,
    }))

    return nueva
  },

  /**
   * Avanza una SCR del SRS al siguiente estado.
   * M3-09 §5: propuesta → en_analisis → evaluada_ccb → aprobada/rechazada/diferida → implementada
   */
  avanzarSCRSRS: async (
    srsId: string,
    scrId: string,
    datos: {
      nuevoEstado: EstadoSCRSRS
      analisisImpacto?: string
      resolucionCCB?: SolicitudCambioSRS['resolucionCCB']
      motivoCCB?: string
      miembrosPresentes?: string[]
      nuevaVersion?: string
    }
  ): Promise<void> => {
    const db = getFirestoreDb()
    const ahora = Timestamp.now()

    const srs = await alcanceService.getById(srsId)
    if (!srs) throw new Error('SRS no encontrado')

    const scrs = (srs.solicitudesCambioSRS ?? []).map((s) => {
      if (s.id !== scrId) return s
      const actualizado: SolicitudCambioSRS = {
        ...s,
        estado: datos.nuevoEstado,
        actualizadoEn: ahora.toDate(),
      }
      if (datos.analisisImpacto) actualizado.analisisImpacto = datos.analisisImpacto
      if (datos.resolucionCCB) {
        actualizado.resolucionCCB = datos.resolucionCCB
        actualizado.motivoCCB = datos.motivoCCB
        actualizado.miembrosPresentes = datos.miembrosPresentes
        actualizado.fechaEvaluacion = ahora.toDate()
      }
      if (datos.nuevaVersion) {
        actualizado.nuevaVersion = datos.nuevaVersion
        actualizado.fechaImplementacion = ahora.toDate()
      }
      return actualizado
    })

    // Si se aprueba un cambio MAYOR → versión 2.0; MENOR → v1.X
    const scrActualizado = scrs.find((s) => s.id === scrId)
    const updates: Record<string, unknown> = {
      solicitudesCambioSRS: scrs,
      actualizadoEn: ahora,
    }
    if (datos.nuevoEstado === 'implementada' && scrActualizado?.nuevaVersion) {
      updates.version = scrActualizado.nuevaVersion
    }

    await updateDoc(doc(db, COLECCIONES_M3.SRS, srsId), removeUndefined(updates))
  },

  // ====================================================
  // BUCLE DE RETROALIMENTACIÓN (M3-01 §5-§6)
  // ====================================================

  /**
   * Registra un retorno de fase (bucle de retroalimentación inmutable).
   * M3-01 §5: F3→F2, F4→F2, F7→F5
   */
  registrarIteracionBucle: async (
    srsId: string,
    fase: 'F3→F2' | 'F4→F2' | 'F7→F5',
    motivo: string,
    reqsAfectados: string[]
  ): Promise<void> => {
    const db = getFirestoreDb()
    const uid = getCurrentUserId()
    const ahora = Timestamp.now()

    const srs = await alcanceService.getById(srsId)
    if (!srs) throw new Error('SRS no encontrado')

    const siguienteIteracion = (srs.iteracionesBucle ?? []).length + 1

    const entrada = {
      iteracion: siguienteIteracion,
      fase,
      fechaRetorno: ahora.toDate(),
      motivo,
      reqsAfectados,
      registradoPor: uid,
    }

    // Determinar el estado SRS según el retorno
    const estadoRetorno: EstadoSRS =
      fase === 'F3→F2' || fase === 'F4→F2' ? 'en_adquisicion' : 'en_especificacion'

    const nuevoCiclos =
      fase === 'F7→F5' ? (srs.contadorCiclosValidacion ?? 0) + 1 : srs.contadorCiclosValidacion

    await updateDoc(doc(db, COLECCIONES_M3.SRS, srsId), {
      iteracionesBucle: [...(srs.iteracionesBucle ?? []), entrada],
      estado: estadoRetorno,
      contadorCiclosValidacion: nuevoCiclos,
      actualizadoEn: ahora,
    })
  },
}
