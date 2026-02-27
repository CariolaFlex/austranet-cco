// ============================================================
// TIPOS BASE — austranet-cco
// Sistema de Gestión de Proyectos de Software
// ============================================================

// ---------- ENUMERACIONES ----------

export type TipoEntidad = 'cliente' | 'proveedor' | 'ambos'

export type EstadoEntidad = 'activo' | 'inactivo' | 'observado' | 'suspendido'

export type SectorEntidad =
  | 'construccion'
  | 'salud'
  | 'tecnologia'
  | 'educacion'
  | 'finanzas'
  | 'manufactura'
  | 'retail'
  | 'consultoria'
  | 'otro'

export type NivelRiesgoEntidad = 'bajo' | 'medio' | 'alto' | 'critico'

export type TipoProyecto =
  | 'nuevo_desarrollo'
  | 'mantenimiento'
  | 'migracion'
  | 'consultoria'
  | 'integracion'

export type EstadoProyecto =
  | 'borrador'
  | 'pendiente_aprobacion'
  | 'activo_en_definicion'
  | 'activo_en_desarrollo'
  | 'pausado'
  | 'completado'
  | 'cancelado'

export type MetodologiaProyecto =
  | 'cascada'
  | 'incremental'
  | 'agil_scrum'
  | 'agil_xp'
  | 'rup'
  | 'espiral'
  | 'hibrido'

export type CriticidadProyecto = 'baja' | 'media' | 'alta' | 'critica'

export type EstadoSRS =
  | 'no_iniciado'
  | 'en_adquisicion'
  | 'en_prototipado'
  | 'en_modelado'
  | 'en_especificacion'
  | 'en_validacion'
  | 'aprobado'
  | 'con_observaciones'
  | 'cancelado'   // Gate 1 No-Go → M3-GATE1

export type PrioridadRequerimiento = 'must' | 'should' | 'could' | 'wont'

export type TipoRequerimiento = 'funcional' | 'no_funcional' | 'dominio'

export type RolUsuario = 'admin' | 'gestor' | 'analista' | 'viewer'

// ---------- ENTIDADES (MÓDULO 1) ----------

export interface Stakeholder {
  id: string
  nombre: string
  cargo: string
  email: string
  telefono?: string
  rol: string // sponsor, decisor, usuario_final, ti, legal, financiero
  nivelInfluencia: 'alto' | 'medio' | 'bajo'
  nivelInteres: 'alto' | 'medio' | 'bajo'
  canalComunicacion?: string
}

export interface Entidad {
  id: string
  tipo: TipoEntidad
  razonSocial: string
  nombreComercial?: string
  rut: string
  sector: SectorEntidad
  pais: string
  ciudad?: string
  direccion?: string
  sitioWeb?: string
  estado: EstadoEntidad
  nivelRiesgo: NivelRiesgoEntidad
  stakeholders: Stakeholder[]
  tieneNDA: boolean
  fechaNDA?: Date
  notas?: string
  // Agregado en Sprint 1 — justificado en M1-04 §5: almacenar respuestas para auditoría y recálculo
  respuestasFactibilidad?: RespuestasFactibilidad
  // Agregado en Sprint 2 — checklist operativo del glosario (M1-03 §8)
  checklistGlosario?: ChecklistGlosario
  // Agregado en M2-INT — M2-07: disponibilidad del cliente para metodologías ágiles
  disponibilidadParaSprints?: boolean   // Bloqueante para agil_scrum y agil_xp
  aceptaEntregasIncrementales?: boolean // Bloqueante para incremental/ágil
  creadoEn: Date
  actualizadoEn: Date
  creadoPor: string
}

// ---------- PROYECTOS (MÓDULO 2) ----------

export interface MiembroEquipo {
  usuarioId: string
  nombre: string
  rol: string // PM, analista, arquitecto, desarrollador, QA, scrum_master, ux_designer, devops, product_owner
  rolCliente?: string // sponsor, product_owner, stakeholder
  esExterno: boolean
}

export interface RiesgoProyecto {
  id: string
  descripcion: string
  tipo: 'tecnologico' | 'personas' | 'organizacional' | 'requerimientos' | 'estimacion'
  probabilidad: 'muy_baja' | 'baja' | 'media' | 'alta' | 'muy_alta'
  impacto: 'muy_bajo' | 'bajo' | 'medio' | 'alto' | 'muy_alto'
  estrategia: 'evitar' | 'minimizar' | 'contingencia' | 'aceptar'
  mitigacion?: string
  responsable?: string
  estado: 'activo' | 'mitigado' | 'materializado' | 'cerrado'
  // v2 — M2-03 Sección 7
  origen?: 'heredado_entidad' | 'identificado_proyecto'
}

// Hito de proyecto (M2-01 §10)
export type EstadoHito = 'pendiente' | 'en_riesgo' | 'completado' | 'incumplido'

export interface Hito {
  id: string
  nombre: string
  descripcion: string
  fechaEstimada: Date
  fechaReal?: Date
  estado: EstadoHito
  entregable?: string
  responsable: string // nombre del responsable o usuarioId
}

// Presupuesto del proyecto (M2-02 §7)
export type MetodoEstimacion =
  | 'juicio_experto'
  | 'analogia'
  | 'descomposicion'
  | 'cocomo_ii'
  | 'puntos_funcion'
  | 'planning_poker'

export interface PresupuestoProyecto {
  metodoUsado: MetodoEstimacion
  estimacionMinima: number
  estimacionNominal: number
  estimacionMaxima: number
  moneda: string
  supuestos: string[]
  exclusiones: string[]
}

// M2-07: Snapshot de los 7 campos decisorios al momento de elegir la metodología
export interface InputsMetodologiaSnapshot {
  criticidad: CriticidadProyecto
  tamanoEquipo: number
  distribuidoGeograficamente: boolean
  requiereRegulacionExterna: boolean
  estabilidadRequerimientos: 'baja' | 'media' | 'alta'
  clienteDisponibleParaIteraciones: boolean
  tieneContratoFijo: boolean
}

export interface Proyecto {
  id: string
  codigo: string
  nombre: string
  descripcion: string
  tipo: TipoProyecto
  estado: EstadoProyecto
  criticidad: CriticidadProyecto
  metodologia: MetodologiaProyecto
  justificacionMetodologia?: string // requerido si criticidad = alta/critica (M2-01 §9)
  clienteId: string // referencia a Entidad
  proveedoresIds?: string[] // referencias a Entidades
  equipo: MiembroEquipo[]
  riesgos: RiesgoProyecto[]
  hitos: Hito[] // calendarización (M2-01 §10)
  presupuesto?: PresupuestoProyecto // estimación de costos (M2-02 §7)
  fechaInicio?: Date
  fechaFinEstimada?: Date
  presupuestoEstimado?: number // mantener para compatibilidad (= presupuesto.estimacionNominal)
  moneda?: string
  estadoSRS: EstadoSRS
  // M2-07: Campos decisorios para el árbol de metodología (Sprint M2-INT)
  tamanoEquipo?: number
  distribuidoGeograficamente?: boolean
  requiereRegulacionExterna?: boolean
  estabilidadRequerimientos?: 'baja' | 'media' | 'alta'
  clienteDisponibleParaIteraciones?: boolean
  tieneContratoFijo?: boolean
  // M2-07: Acuerdo de metodología
  clienteConsentioMetodologia?: boolean
  inputsMetodologiaSnapshot?: InputsMetodologiaSnapshot
  metodologiaVersion?: number
  creadoEn: Date
  actualizadoEn: Date
  creadoPor: string
}

// ---------- ALCANCE / SRS (MÓDULO 3) ----------

// ---------- ENUMERACIONES M3 (Sprint M3-FULL) ----------

/** Ciclo de vida de un Requerimiento (M3-04 §4, M3-01 §6) */
export type EstadoRequerimiento =
  | 'propuesto'      // creado pero no formalizado
  | 'en_revision'    // en proceso de formalización F5
  | 'aprobado'       // formalizado y aceptado
  | 'rechazado'      // no incluido en esta versión
  | 'diferido'       // Won't Have — registrado en Apéndice D
  | 'implementado'   // ya codificado (fase posterior al SRS)

/** 7 categorías de RNF según M3-07 (Sommerville Fig. 4.3, Cap. 4 §4.1.2) */
export type TipoRNFCategoria =
  | 'rendimiento'
  | 'seguridad'
  | 'disponibilidad'
  | 'usabilidad'
  | 'mantenibilidad'
  | 'portabilidad'
  | 'proceso'

/** Técnicas de adquisición disponibles (M3-02 §4-§8) */
export type TecnicaAdquisicion =
  | 'entrevista_abierta'
  | 'entrevista_cerrada'
  | 'entrevista_mixta'
  | 'etnografia'
  | 'taller_jad'
  | 'escenarios'
  | 'casos_uso_adquisicion'

/** Tipos de prototipo (M3-02 §9, M3-F3-01) */
export type TipoPrototipo =
  | 'wireframe_papel'
  | 'mockup_digital'
  | 'mago_de_oz'
  | 'prototipo_funcional'

/** Tipos de artefacto de modelado UML (M3-03 §4-§6) */
export type TipoArtefactoModelo =
  | 'modelo_contexto'      // obligatorio §4.3 — M3-F4-01
  | 'caso_de_uso'          // interacción §5 — M3-F4-02
  | 'bpmn'                 // proceso negocio — M3-F4-03
  | 'diagrama_actividad'   // proceso UML — M3-F4-03
  | 'diagrama_secuencia'   // flujo principal CU — M3-03 §5.2
  | 'diagrama_clase'       // estructural §3.3 — M3-03 §6
  | 'diagrama_estado'      // comportamiento — M3-03 §7
  | 'diagrama_proceso'     // genérico

/** Resultado de evaluación de un prototipo por requerimiento (M3-F3-02) */
export type ResultadoValidacionProto = 'validado' | 'ajuste_menor' | 'ajuste_mayor' | 'eliminado'

/** Tipo de observación de revisión del SRS (M3-F7-01) */
export type TipoObservacionValidacion = 'aclaracion' | 'ajuste_menor' | 'ajuste_mayor'

/** Estado de un Caso de Prueba (M3-10) */
export type EstadoCasoPrueba = 'pendiente' | 'ejecutado_ok' | 'ejecutado_fallo' | 'bloqueado'

/** Tipo de Caso de Prueba (M3-10) */
export type TipoCasoPrueba = 'aceptacion_alfa' | 'aceptacion_beta' | 'funcional' | 'no_funcional'

/** Estados del CCB del SRS (M3-09 §5 — diferente del CCB del Repositorio M2-06) */
export type EstadoSCRSRS =
  | 'propuesta'
  | 'en_analisis'
  | 'evaluada_ccb'
  | 'aprobada'
  | 'rechazada'
  | 'implementada'
  | 'diferida'

/** Estrategia de despliegue del producto (M3-F8-01) */
export type EstrategiaDespliegue = 'big_bang' | 'incremental' | 'paralelo' | 'piloto'

/** Resultado dimensional del estudio de factibilidad (M3-F1-04) */
export type ResultadoFactibilidad = 'viable' | 'viable_con_restricciones' | 'no_viable'

/** Estado del Gate 1 (M3-GATE1) */
export type EstadoGate1 = 'pendiente' | 'go' | 'nogo'

/** Rol del stakeholder en el proceso IR — M3-F1-03 (Sommerville Cap. 4 §4.5.1) */
export type RolStakeholderSRS =
  | 'cliente_sponsor'
  | 'usuario_final'
  | 'gestor_proyecto'
  | 'arquitecto'
  | 'regulador'
  | 'qa_tester'
  | 'analista_futuro'

// ---------- INTERFACES M3 ----------

/** Métricas obligatorias para cada RNF (M3-07 Fig. 4.5, M3-F5-03) */
export interface MetricasRNF {
  metricaObjetivo: string    // e.g. "< 200ms", "99.9%", "< 3 errores/hora"
  metodMedicion: string      // e.g. "JMeter con 1000 usuarios concurrentes"
  condicionCarga?: string    // contexto de la medición
  unidad?: string            // ms, %, req/seg, MB, horas, etc.
}

/**
 * Requerimiento funcional, no funcional o de dominio (M3-01 §2.2, M3-04 §4)
 * Colección Firestore: 'requerimientos' (top-level, FK srsId + proyectoId)
 */
export interface Requerimiento {
  id: string
  proyectoId: string
  srsId: string              // FK al documento SRS
  codigo: string             // RF-001 | RNF-001 | RD-001 (generado automáticamente)
  tipo: TipoRequerimiento
  prioridad: PrioridadRequerimiento
  titulo: string
  descripcion: string        // DEBE/DEBERÍA/PODRÁ — vocabulario controlado M3-04 §4.1
  criterioAceptacion?: string // DADO/CUANDO/ENTONCES — obligatorio para RF Must (M3-04 §4.1)
  fuente: string             // ID Stakeholder M1-01 (no texto libre — FK obligatorio)
  fuenteNombre?: string      // desnormalizado para display
  estado: EstadoRequerimiento
  version: number            // incrementa con cada SCR aprobada post v1.0

  // Trazabilidad (M3-F5-05, M3-09 §6)
  moduloSistema?: string     // subsistema de F4-04 que lo implementa
  casoPruebaId?: string      // FK CasoPrueba — completado en Fase 7 (M3-F7-02)
  dependencias?: string[]    // IDs de otros Requerimientos que deben implementarse antes

  // Evolución anticipada (M3-F5-06, M3-01 §4)
  esVolatil?: boolean        // true si es requerimiento volátil (cambio esperado)
  razonCambio?: string       // por qué puede cambiar (obligatorio si esVolatil = true)

  // Won't Have — todos los campos obligatorios para Won't (M3-04 §5 Apéndice D)
  justificacionWont?: string      // obligatorio si prioridad = wont
  versionObjetivo?: string        // versión futura donde se considera implementar
  dependenciasTecnicas?: string[] // qué debe existir antes para que sea implementable

  // Campos específicos RNF (M3-F5-03, M3-07)
  categoria?: TipoRNFCategoria
  metricas?: MetricasRNF          // obligatorio para todo RNF (M3-04 checklist V2)

  // Campos específicos RD — Requerimientos de Dominio (M3-F5-04, M3-08)
  normaOLeyFuente?: string        // referencia regulatoria (ej: "ISO 9001", "Ley 20.393")
  stakeholderDominio?: string     // ID stakeholder M1 que domina esta regla de negocio
  implicacionEnRF?: string[]      // IDs de RF que deben cumplir esta regla
  verificabilidadRD?: string      // cómo se verifica cumplimiento de la regla

  creadoEn: Date
  actualizadoEn: Date
  creadoPor?: string
}

/** Stakeholder clasificado para el proceso IR (M3-F1-03, M3-01 §4.3) */
export interface StakeholderSRS {
  stakeholderId: string          // REF M1-01 Stakeholder.id
  nombre: string                 // desnormalizado
  rolSRS: RolStakeholderSRS
  esObligatorioTenerRF: boolean  // true si nivelInfluencia = alto (M3-F1-03)
  disponibleParaEntrevista: boolean
  fechaDisponibilidad?: Date
}

/** Dimensión del estudio de factibilidad (M3-F1-04) */
export interface FactibilidadDimension {
  resultado: ResultadoFactibilidad
  justificacion: string
  restricciones?: string[]
}

/** Estudio de factibilidad completo — 3 dimensiones + resultado global (M3-F1-04) */
export interface Factibilidad {
  negocio: FactibilidadDimension    // ¿resuelve el problema? ¿ROI justificado?
  tecnica: FactibilidadDimension    // ¿el stack de M2-07 puede implementarlo?
  integracion: FactibilidadDimension // ¿los sistemas existentes permiten integración?
  global: ResultadoFactibilidad     // calculado: no_viable si cualquiera es no_viable
  // Campos para informe No-Go (M3-GATE1)
  motivoCancelacion?: string
  alternativasConsideradas?: string
  firmaCancelacion?: string
}

/** Riesgo del proceso IR — vinculado a M2-03 (M3-F1-05) */
export interface RiesgoSRS {
  id: string
  descripcion: string
  tipo:
    | 'stakeholder_no_disponible'
    | 'dominio_complejo'
    | 'reqs_volatiles'
    | 'alcance_indefinido'
    | 'conflicto_stakeholders'
  probabilidad: 'muy_baja' | 'baja' | 'media' | 'alta' | 'muy_alta'
  impacto: 'muy_bajo' | 'bajo' | 'medio' | 'alto' | 'muy_alto'
  mitigacion?: string
  registradoEnM203?: boolean   // si se registró también en riesgos del proyecto (M2-03)
  riesgoProyectoId?: string    // ID del RiesgoProyecto en M2-03 (si registradoEnM203 = true)
}

/**
 * Sesión de entrevista (M3-02 §4.5 — Plantilla completa)
 * Colección Firestore: 'sesiones_entrevista' (top-level, FK srsId + proyectoId)
 */
export interface SesionEntrevista {
  id: string
  srsId: string
  proyectoId: string
  entrevistaId: string             // ENT-001, ENT-002... (generado)
  fecha: Date
  entrevistadoId: string           // REF M1-01 Stakeholder.id
  entrevistadoNombre: string       // desnormalizado
  entrevistador: string
  objetivos: string
  duracionMin: number
  modalidad: 'presencial' | 'virtual' | 'hibrido'
  grabacion?: string               // URL del recording o descripción
  tipoEntrevista: 'abierta' | 'cerrada' | 'mixta'
  reqsEmergentes: string[]         // IDs de Requerimientos creados en esta sesión
  terminosGlosario: string[]       // nuevos términos identificados para M1-03
  conflictosDetectados: string     // descripción de conflictos entre stakeholders
  observaciones?: string
  proximaSesion?: Date
  creadoEn: Date
  creadoPor: string
}

/**
 * Escenario / Historia de Usuario (M3-02 §5, M3-01 §3.4)
 * Colección Firestore: 'escenarios' (top-level, FK srsId + proyectoId)
 */
export interface Escenario {
  id: string
  srsId: string
  proyectoId: string
  escenarioId: string            // ESC-001, ESC-002... (generado)
  titulo: string
  actorPrincipal: string         // REF M1-01 Stakeholder.id
  actorNombre: string            // desnormalizado
  situacionInicial: string
  flujoNormal: string[]          // pasos numerados
  flujoAlternativo?: string[]
  excepcionesErrores?: string[]
  requerimientosGenerados: string[] // IDs de Requerimientos originados por este escenario
  esBaseParaCasoDeUso: boolean   // si true, se convierte en modelo UML en F4
  creadoEn: Date
  creadoPor: string
}

/**
 * Prototipo de requerimientos (M3-F3-01, M3-02 §9)
 * Embebido en SRS (array SRS.prototipos)
 */
export interface Prototipo {
  id: string
  prototipoId: string                  // PRT-001, PRT-002... (generado)
  objetivo: string                     // qué RFs específicos valida
  tipo: TipoPrototipo
  requerimientosAValidar: string[]     // IDs de Requerimientos en scope (máx 15)
  urlArtifacto?: string
  fechaSesionEvaluacion?: Date
  stakeholdersParticipantes: string[]  // IDs M1-01
  resultado?: ResultadoValidacionProto
  resultadoPorRequerimiento?: Record<string, ResultadoValidacionProto> // reqId → resultado
  observaciones?: string
  creadoEn: Date
  creadoPor: string
}

/**
 * Log de iteración del bucle de retroalimentación (inmutable, append-only)
 * Embebido en SRS (array SRS.iteracionesBucle)
 * Registra retornos F3→F2, F4→F2, F7→F5 (M3-01 §5-§6)
 */
export interface IteracionBucle {
  iteracion: number
  fase: 'F3→F2' | 'F4→F2' | 'F7→F5'
  fechaRetorno: Date
  motivo: string
  reqsAfectados: string[]   // IDs de Requerimientos afectados
  registradoPor: string
}

/**
 * Artefacto de modelo UML adjunto al SRS (M3-03 §4-§7)
 * Embebido en SRS (array SRS.artefactosModelo)
 */
export interface ArtefactoModelo {
  id: string
  nombre: string
  tipo: TipoArtefactoModelo
  descripcion?: string
  url: string              // draw.io / Miro / Lucidchart / etc.
  herramienta: string
  // Modelo de Contexto específico (M3-F4-01)
  sistemasExternosIdentificados?: string[] // sincronizan con SRS.sistemasExistentes
  rnfInteroperabilidadIds?: string[]       // RNF generados automáticamente
  // Caso de Uso específico (M3-F4-02)
  actoresIdentificados?: string[]   // deben coincidir con M1-01 stakeholders
  casosDeUsoListados?: string[]     // nombres de los CU del diagrama
  casosDeUsoHuerfanos?: string[]    // CU sin RF asociados = posibles reqs faltantes
  // BPMN / Diagrama Actividad (M3-F4-03)
  procesosModelados?: string[]      // procesos del negocio modelados
  actividadesIdentificadas?: string[]
  puntosDecision?: number           // gateways/condiciones en el diagrama
  creadoEn: Date
  creadoPor: string
}

/** Subsistema identificado en el Panorama Arquitectónico (M3-F4-04) */
export interface Subsistema {
  nombre: string
  responsabilidad: string          // descripción de la responsabilidad principal
  tecnologia: string               // del stack acordado en M2-07
  rfMustsAsignados?: string[]      // IDs de RF Must Have que implementa
}

/** Panorama arquitectónico preliminar (M3-F4-04, M3-04 §5 Sección 6) */
export interface PanoramaArquitectonico {
  subsistemas: Subsistema[]
  distribucionFunciones: Record<string, string[]> // { nombreSubsistema: [rfIds] }
  restriccionesArquitectonicas: string[]           // RNF de arquitectura
}

/** Entrada de la Matriz de Trazabilidad (M3-F5-05, M3-09 §6) */
export interface EntradaTrazabilidad {
  requerimientoId: string
  codigoRF: string          // desnormalizado para display
  tituloRF: string          // desnormalizado
  stakeholderFuente: string  // ID stakeholder M1-01
  stakeholderNombre: string  // desnormalizado
  moduloSistema?: string     // subsistema de F4-04
  casoPruebaId?: string      // completado en F7-02
  casoPruebaCodigo?: string  // CP-XXX desnormalizado
  estado: 'completa' | 'parcial' | 'faltante' // cobertura de la fila
}

/** Item del checklist de calidad del SRS — 21 ítems (M3-04 §8, M3-F7-01) */
export interface ItemChecklistSRS {
  codigo: string       // S1-S8, C1-C6, V1-V5, M1-M4
  descripcion: string
  estado: 'cumplido' | 'pendiente' | 'no_aplica'
  nota?: string
}

/** Observación de la revisión conjunta del SRS (M3-F7-01, M3-05 §4) */
export interface ObservacionValidacion {
  id: string
  seccionAfectada: string          // e.g. "Sección 3 — RF-042"
  descripcion: string
  tipoObservacion: TipoObservacionValidacion
  autor: string                    // nombre del reviewer
  autorId?: string                 // ID del stakeholder/usuario
  resuelto: boolean
  resolucionTexto?: string
  fechaCreacion: Date
  fechaResolucion?: Date
}

/**
 * Caso de Prueba de Aceptación (M3-10, M3-F7-02)
 * Colección Firestore: 'casos_prueba' (top-level, FK srsId + proyectoId)
 */
export interface CasoPrueba {
  id: string
  srsId: string
  proyectoId: string
  codigo: string               // CP-001, CP-002... (generado)
  requerimientoId: string      // FK Requerimiento (RF Must Have)
  codigoRF: string             // desnormalizado
  titulo: string
  tipo: TipoCasoPrueba
  dado: string                 // DADO: precondición del sistema
  cuando: string               // CUANDO: acción del actor
  entonces: string             // ENTONCES: resultado esperado verificable
  estado: EstadoCasoPrueba
  responsable?: string
  notas?: string
  creadoEn: Date
  creadoPor: string
}

/** Miembro del CCB del SRS (M3-09 §4 — distinto del CCB del Repositorio M2-06) */
export interface MiembroCCBSRS {
  stakeholderId?: string    // REF M1-01 (para representante_cliente)
  usuarioId?: string        // para miembros internos (analista, gestor, arquitecto)
  nombre: string
  rol: 'analista_responsable' | 'gestor_proyecto' | 'representante_cliente' | 'arquitecto'
  esObligatorio: boolean    // analista + gestor siempre; cliente si cambio major
}

/**
 * Solicitud de Cambio al SRS post-aprobación (M3-09 §5)
 * DIFERENTE de SolicitudCambioRepositorio (M2-06):
 *   - SCR Repositorio: gestiona artefactos y código (M2-06 PanelCCBRepositorio)
 *   - SolicitudCambioSRS: gestiona cambios al contrato de requerimientos (M3-09)
 * Embebida en SRS (array SRS.solicitudesCambioSRS)
 */
export interface SolicitudCambioSRS {
  id: string
  codigo: string               // SCRSRS-001, SCRSRS-002... (generado)
  // Sección 1: Identificación
  titulo: string
  solicitante: string
  fechaSolicitud: Date
  urgencia: 'baja' | 'media' | 'alta' | 'critica'
  // Sección 2: Descripción
  descripcion: string
  justificacion: string
  causaRaiz:
    | 'cambio_negocio'
    | 'error_especificacion'
    | 'nuevo_requerimiento'
    | 'factor_externo'
    | 'decision_tecnica'
  // Sección 3: Requerimientos afectados
  requerimientosAfectados: string[]         // IDs de Requerimientos directamente afectados
  requerimientosImpactoIndirecto?: string[] // IDs calculados por evaluación de impacto cruzado M3-09 §5.2
  // Sección 4: Análisis de impacto
  analisisImpacto?: string
  impactoEnPresupuesto?: 'ninguno' | 'menor' | 'moderado' | 'significativo'
  impactoEnPlazo?: 'ninguno' | 'menor' | 'moderado' | 'significativo'
  tipoCambio: 'menor' | 'mayor'  // mayor → requiere representante_cliente en CCB
  // Sección 5: Decisión CCB (M3-09 §5.3 tabla de escalamiento)
  estado: EstadoSCRSRS
  resolucionCCB?: 'aprobada' | 'rechazada' | 'diferida'
  motivoCCB?: string
  miembrosPresentes?: string[]
  fechaEvaluacion?: Date
  // Sección 6: Implementación
  nuevaVersion?: string        // v1.X (cambio menor) | v2.0 (cambio mayor)
  fechaImplementacion?: Date
  implementadoPor?: string
  creadoEn: Date
  actualizadoEn: Date
  creadoPor: string
}

/** Sección individual del SRS (M3-F5-01, M3-04 §5 estructura IEEE 830) */
export interface SeccionSRS {
  contenido: string   // texto libre / markdown
  completada: boolean
  ultimaEdicion?: Date
}

/**
 * Las 8 secciones + portada del SRS (M3-04 §5 Fig. 4.7, pp. 93-94)
 * Embebido en SRS como SRS.secciones
 */
export interface SeccionesSRS {
  portada: SeccionSRS           // nombre, código, versión, fecha, estado, historial
  s1_introduccion: SeccionSRS   // propósito, alcance, glosario, referencias, visión general
  s2_descripcionGeneral: SeccionSRS // perspectiva, funciones Must, usuarios, restricciones, suposiciones
  s3_rf: SeccionSRS             // RF organizados por actor o módulo
  s4_rnf: SeccionSRS            // RNF con métricas por las 7 categorías
  s5_interfaces: SeccionSRS     // interfaces con sistemas externos de F4-01
  s6_restriccionesDiseno: SeccionSRS // panorama arquitectónico de F4-04
  s7_modelos: SeccionSRS        // índice de artefactos UML de F4
  s8_apendices: SeccionSRS      // A: Glosario, B: Stakeholders, C: Cambios, D: Diferidos
}

/** Término del glosario específico del SRS/proyecto (M3-F1-02, M3-08) */
export interface TerminoDominioSRS {
  id: string
  srsId: string
  proyectoId: string
  termino: string
  definicionOperativa: string
  fuenteRegulatoriaONorma?: string // ej: "ISO 9001", "Ley 20.393"
  esRequerimientoDominio: boolean  // si true → genera RD-XXX propuesto automáticamente
  requerimientoDominioId?: string  // RD generado (se asigna después de generar el RD)
  origen: 'importado_m1' | 'nuevo_proyecto'
  entradaGlosarioId?: string       // ID de EntradaGlosario M1-03 (si origen = importado_m1)
  creadoEn: Date
  creadoPor: string
}

/** Sistema externo a migrar (M3-F8-01) */
export interface SistemaAMigrar {
  nombre: string
  datosAMigrar: string
  formatoOrigen: string
  formatoDestino: string
  responsableTecnico: string
}

/** Plan de despliegue y migración (M3-F8-01, M3-04 §5 Sección 2.5) */
export interface PlanDespliegue {
  estrategia: EstrategiaDespliegue
  sistemasAMigrar: SistemaAMigrar[]
  esquemaMigracion: string
  fechaTargetDespliegue?: Date
  responsable?: string
}

/** Grupo de usuarios a capacitar (M3-F8-02) */
export interface GrupoCapacitacion {
  nombre: string                  // ej: "Administradores", "Usuarios finales"
  stakeholderIds: string[]        // REF M1-01
  numeroPersonas: number
  nivelTecnicoActual: 'basico' | 'intermedio' | 'avanzado'
  duracionEstimadaHoras: number
}

/** Plan de capacitación de usuarios finales (M3-F8-02) */
export interface PlanCapacitacion {
  grupos: GrupoCapacitacion[]
  modalidad: 'presencial' | 'virtual' | 'hibrido' | 'autoservicio'
  materialesRequeridos: string[]
  responsableCapacitacion?: string // REF equipo del proyecto (M2-05)
}

/** Tiempo de respuesta SLA por severidad (M3-F8-03) */
export interface TiempoRespuestaSLA {
  severidad: 'critico' | 'alto' | 'medio' | 'bajo'
  tiempoRespuesta: string    // ej: "2h", "4h", "8h", "24h"
  tiempoResolucion: string   // ej: "8h", "24h", "72h", "5 días"
}

/** Plan de SLA y soporte post-entrega (M3-F8-03, M3-07 RNF disponibilidad) */
export interface PlanSLA {
  periodoGarantia: number               // días después del go-live
  slaDisponibilidad: number             // uptime % (debe coincidir con RNF disponibilidad)
  tiemposRespuesta: TiempoRespuestaSLA[]
  responsablePostEntrega: 'proveedor' | 'cliente' | 'mixto'
  mecanismoReporte: string              // cómo reporta el cliente un incidente
  criterioFinGarantia: string           // condición de cierre formal del período de garantía
}

/** Distribución MoSCoW por porcentaje de esfuerzo (M3-F6-02, M3-04 checklist M4) */
export interface DistribucionMoSCoW {
  must: number    // % esfuerzo — meta ≥ 60%
  should: number
  could: number   // meta ≤ 20%
  wont: number
}

/**
 * SRS — Sistema de Requerimientos de Software (M3 completo)
 * Colección Firestore: 'srs' (top-level, un documento por proyecto)
 */
export interface SRS {
  id: string
  proyectoId: string
  version: string      // v0.X (pre-aprobación) | v1.0 (aprobado) | v1.X (cambio menor) | v2.0 (cambio mayor)
  estado: EstadoSRS

  // ── FASE 1: Inicio y Definición del Negocio ───────────────────────────────
  declaracionProblema?: string       // F1-01: ¿por qué existe el proyecto?
  objetivosNegocio?: string[]        // F1-01: máximo 5 objetivos verificables
  sistemasExistentes?: string[]      // F1-01: sistemas actuales que interactúan
  stakeholdersSRS?: StakeholderSRS[] // F1-03: clasificados para el proceso IR
  factibilidad?: Factibilidad        // F1-04: estudio de factibilidad 3 dimensiones
  riesgosSRS?: RiesgoSRS[]           // F1-05: riesgos del proceso IR
  gate1Estado?: EstadoGate1          // GATE 1: pendiente | go | nogo
  gate1FechaDecision?: Date
  gate1DecisionPor?: string

  // ── FASE 2: Descubrimiento y Adquisición ──────────────────────────────────
  tecnicasActivas?: TecnicaAdquisicion[] // F2-01: técnicas seleccionadas
  analisisOrganizacional?: {             // F2-04: hallazgos sociotécnicos
    estructuraDecisiones?: string
    dependenciasSistemas?: string
    resistenciasOrganizacionales?: string
    factoresPoliticos?: string
    conflictosOrganizacionales?: string
  }
  // Las SesionEntrevista y Escenario viven en colecciones separadas (FK srsId)

  // ── FASE 3: Prototipado ────────────────────────────────────────────────────
  prototipos?: Prototipo[]        // F3-01/F3-02: embebidos (< 10 usualmente)
  iteracionesBucle?: IteracionBucle[] // log inmutable de retornos F3→F2, F4→F2, F7→F5

  // ── FASE 4: Análisis y Modelado ───────────────────────────────────────────
  artefactosModelo?: ArtefactoModelo[]      // F4-01 a F4-03: adjuntos UML
  panoramaArquitectonico?: PanoramaArquitectonico // F4-04

  // ── FASE 5: Especificación SRS (8 secciones IEEE 830) ─────────────────────
  secciones?: SeccionesSRS        // F5-01: las 8 secciones + portada
  // Los Requerimientos viven en colección separada 'requerimientos' (FK srsId)

  // ── FASE 6: Planificación ──────────────────────────────────────────────────
  distribucionMoSCoW?: DistribucionMoSCoW  // F6-02: % esfuerzo por categoría

  // ── FASE 7: Validación ─────────────────────────────────────────────────────
  checklistValidacion?: ItemChecklistSRS[]   // F7-01: 21 ítems S1-S8 C1-C6 V1-V5 M1-M4
  observacionesValidacion?: ObservacionValidacion[] // F7-01: comentarios por sección
  contadorCiclosValidacion?: number          // Gate 2: si > 3 → alerta en M2-03
  // CCB del SRS (M3-F7-03) — INDEPENDIENTE del CCB del Repositorio (M2-06)
  ccbSRS?: MiembroCCBSRS[]
  solicitudesCambioSRS?: SolicitudCambioSRS[] // post-aprobación (M3-09)
  matrizTrazabilidad?: EntradaTrazabilidad[]  // F5-05 / F7-02 / F8-04
  // Los CasosPrueba viven en colección separada 'casos_prueba' (FK srsId)

  // ── GATE 2 / APROBACIÓN FORMAL ────────────────────────────────────────────
  aprobadoPor?: string             // ID stakeholder cliente que firma
  aprobadoPorNombre?: string       // desnormalizado
  fechaAprobacion?: Date

  // ── FASE 8: Transición ────────────────────────────────────────────────────
  planDespliegue?: PlanDespliegue
  planCapacitacion?: PlanCapacitacion
  planSLA?: PlanSLA

  // ── CAMPOS HEREDADOS M2-INT-03 (derivados de metodología Proyecto.metodologia) ─
  tipoSRS?: 'completo' | 'incremental' | 'epica' | 'minimo'
  validacionIncremental?: boolean

  // ── METADATOS ──────────────────────────────────────────────────────────────
  fechaUltimaRevision?: Date
  observaciones?: string   // notas generales del analista
  creadoEn: Date
  actualizadoEn: Date
  creadoPor: string
}

// ── DTOs Módulo 3 ──────────────────────────────────────────────────────────

/** DTO para crear un SRS (se llama automáticamente desde proyectos.service al pasar a activo_en_definicion) */
export type CrearSRSDTO = Omit<SRS, 'id' | 'creadoEn' | 'actualizadoEn'>

/** DTO para crear un Requerimiento */
export type CrearRequerimientoDTO = Omit<Requerimiento, 'id' | 'creadoEn' | 'actualizadoEn'>

/** DTO para crear un Caso de Prueba */
export type CrearCasoPruebaDTO = Omit<CasoPrueba, 'id' | 'creadoEn'>

/** DTO para crear una Sesión de Entrevista */
export type CrearSesionEntrevistaDTO = Omit<SesionEntrevista, 'id' | 'creadoEn'>

/** DTO para crear un Escenario */
export type CrearEscenarioDTO = Omit<Escenario, 'id' | 'creadoEn'>

/** DTO para crear un Término de Dominio del SRS */
export type CrearTerminoDominioSRSDTO = Omit<TerminoDominioSRS, 'id' | 'creadoEn'>

// ---------- USUARIO DEL SISTEMA ----------

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: RolUsuario
  activo: boolean
  creadoEn: Date
}

// ---------- TIPOS AUXILIARES — MÓDULO 1 (Sprint 1) ----------

/** Respuestas al formulario de evaluación de factibilidad (M1-04 §5.1) */
export interface RespuestasFactibilidad {
  // Dimensión técnica
  t1_sistemasDocumentados: 'si' | 'parcial' | 'no'      // peso 10%
  t2_experienciaSoftware: 'si' | 'no'                    // peso 15%
  t3_infraestructura: 'si' | 'parcial' | 'no'           // peso 10%
  t4_procesosDocumentados: 'si' | 'parcial' | 'no'      // peso 5%
  // Dimensión económica
  e5_presupuesto: 'si' | 'en_proceso' | 'no'            // peso 20%
  e6_decisoresAccesibles: 'si' | 'no'                    // peso 10%
  e7_presupuestoOperacion: 'si' | 'parcial' | 'no'      // peso 5%
  // Dimensión organizacional
  o8_stakeholdersDisponibles: 'si' | 'parcial' | 'no'   // peso 10%
  o9_patrocinadorEjecutivo: 'si' | 'no'                  // peso 10%
  o10_experienciaCambio: 'si' | 'parcial' | 'no'        // peso 3%
  o11_alineacionEstrategica: 'si' | 'no' | 'desconocido' // peso 2%
}

/** Entrada del historial de cambios de una entidad */
export interface EntradaHistorial {
  id: string
  entidadId: string
  fechaHora: Date
  usuarioId: string
  usuarioNombre: string
  tipoAccion: 'creacion' | 'actualizacion_datos' | 'cambio_estado' | 'gestion_stakeholders'
  campoModificado?: string
  valorAnterior?: string
  valorNuevo?: string
  motivo?: string
}

/** Filtros para la consulta de entidades */
export interface FiltrosEntidad {
  tipo?: TipoEntidad
  estado?: EstadoEntidad
  sector?: SectorEntidad
  nivelRiesgo?: NivelRiesgoEntidad
  busqueda?: string
}

/** DTO para crear una entidad (sin campos auto-generados) */
export type CrearEntidadDTO = Omit<Entidad, 'id' | 'creadoEn' | 'actualizadoEn' | 'creadoPor'>

/** DTO para actualizar parcialmente una entidad */
export type ActualizarEntidadDTO = Partial<Omit<Entidad, 'id' | 'creadoEn' | 'creadoPor'>>

// ---------- TIPOS AUXILIARES — MÓDULO 2 (Sprint 3) ----------

/** Historial de cambios de un proyecto */
export interface EntradaHistorialProyecto {
  id: string
  proyectoId: string
  fechaHora: Date
  usuarioId: string
  usuarioNombre: string
  tipoAccion: 'creacion' | 'actualizacion_datos' | 'cambio_estado' | 'gestion_equipo' | 'gestion_riesgos' | 'gestion_hitos' | 'cierre' | 'cancelacion' | 'metodologia_acordada'
  campoModificado?: string
  valorAnterior?: string
  valorNuevo?: string
  motivo?: string
}

/** Filtros para la consulta de proyectos */
export interface FiltrosProyecto {
  estado?: EstadoProyecto
  tipo?: TipoProyecto
  clienteId?: string
  criticidad?: CriticidadProyecto
  busqueda?: string
}

/** DTO para crear un proyecto */
export type CrearProyectoDTO = Omit<Proyecto, 'id' | 'creadoEn' | 'actualizadoEn' | 'creadoPor' | 'estadoSRS'>

/** DTO para actualizar parcialmente un proyecto */
export type ActualizarProyectoDTO = Partial<Omit<Proyecto, 'id' | 'creadoEn' | 'creadoPor'>>

// ---------- GLOSARIO DE DOMINIO (MÓDULO 1 Sprint 2) ----------
// Justificado en M1-03 §7 — Plantilla operativa de entrada del glosario

/** Checklist operativo del glosario (M1-03 §8) — guardado en el documento de la entidad */
export interface ChecklistGlosario {
  // §8.1 Construcción
  reviso_documentacion_interna: boolean
  reviso_normativas_sector: boolean
  entrevisto_usuario_final: boolean
  entrevisto_responsable_tecnico: boolean
  realizo_observacion_directa: boolean
  definidos_acronimos: boolean
  identificados_terminos_distintos: boolean
  capturado_vocabulario_informal: boolean
  // §8.2 Validación
  definiciones_validadas: boolean
  sin_conflictos_pendientes: boolean
  equipo_tecnico_reviso: boolean
  sin_interpretaciones_inesperadas: boolean
}

/** Entrada del glosario de dominio de una entidad (M1-03 §7) */
export interface EntradaGlosario {
  id: string
  entidadId: string
  termino: string
  definicion: string
  sinonimos?: string[]
  terminoTecnico?: string
  fuente: string        // Nombre del stakeholder o fuente que lo definió
  fechaValidacion?: Date
  contexto?: string
  advertencia?: string
  creadoEn: Date
  actualizadoEn: Date
  creadoPor: string
}

/** DTO para crear/actualizar una entrada del glosario */
export type CrearEntradaGlosarioDTO = Omit<
  EntradaGlosario,
  'id' | 'entidadId' | 'creadoEn' | 'actualizadoEn' | 'creadoPor'
>

// ---------- TIPOS SPRINT 4 — M2-04 Seguimiento, Control y Cierre ----------

/** Causa tipificada de cancelación de proyecto (M2-04 §9.2) */
export type CausaCancelacion =
  | 'decision_cliente'
  | 'inviabilidad_tecnica'
  | 'fuerza_mayor'
  | 'incumplimiento_contractual'
  | 'cambio_prioridades'

/** Lecciones aprendidas al cierre de proyecto (M2-04 §9.3) */
export interface LeccionesAprendidas {
  queExitoSaliBien: string
  queProblemasSurgieron: string
  queHariamosDistinto: string
  riesgosNoAnticipados: string
}

/** Estadísticas rápidas de proyectos para el dashboard */
export interface ProyectosStats {
  total: number
  activos: number
}

// ---------- TIPOS M2-06 — Repositorio de Configuración del Proyecto ----------

export type EstadoItemConfiguracion = 'vigente' | 'en_revision' | 'obsoleto' | 'archivado'
export type TipoItemConfiguracion = 'codigo' | 'documento' | 'dato_configuracion' | 'dependencia'
export type EstadoConfiguracionProyecto = 'borrador' | 'revision' | 'aprobado' | 'archivado'
export type EstadoSCR = 'propuesta' | 'en_analisis' | 'evaluada' | 'aprobada' | 'rechazada' | 'implementada'

export interface ItemConfiguracion {
  id: string
  nombre: string
  tipo: TipoItemConfiguracion
  version: string
  responsable: string
  estado: EstadoItemConfiguracion
  descripcion?: string
  ubicacion?: string // ruta en repositorio o URL
  fechaUltimocambio?: Date
}

export interface MiembroCCB {
  usuarioId: string
  nombre: string
  rol: 'presidente' | 'secretario' | 'vocal' | 'representante_cliente'
  esExterno: boolean
}

export interface SolicitudCambioRepositorio {
  id: string
  proyectoId: string
  configuracionId: string
  titulo: string
  descripcion: string
  justificacion: string
  itemsAfectados: string[] // IDs de ItemConfiguracion afectados
  impactoEstimado: 'bajo' | 'medio' | 'alto'
  solicitante: string
  estado: EstadoSCR
  // Etapa 1: Análisis
  analisisTecnico?: string
  fechaAnalisis?: Date
  // Etapa 2: Evaluación CCB
  resolucionCCB?: 'aprobar' | 'rechazar' | 'diferir'
  motivoCCB?: string
  fechaEvaluacion?: Date
  miembrosPresentes?: string[]
  // Etapa 3: Implementación
  versionResultante?: string
  fechaImplementacion?: Date
  creadoEn: Date
  actualizadoEn: Date
  creadoPor: string
}

export interface VersionRepositorio {
  version: string // MAJOR.MINOR.PATCH
  fecha: Date
  descripcion: string
  cambios: string[]
  aprobadoPor?: string
  scrId?: string // SCR que originó el cambio
}

export interface ConfiguracionProyecto {
  id: string
  proyectoId: string
  version: string // MAJOR.MINOR.PATCH
  estado: EstadoConfiguracionProyecto
  itemsConfiguracion: ItemConfiguracion[]
  ccbComposicion: MiembroCCB[]
  politicaEntregas: string // Derivada de metodologiaAcordada del proyecto
  cicdObligatorio: boolean  // true si metodologia = agil_xp o agil_scrum
  historialVersiones: VersionRepositorio[] // inmutable — append only
  solicitudesCambio: SolicitudCambioRepositorio[]
  creadoEn: Date
  actualizadoEn: Date
  creadoPor: string
}

// ---------- TIPOS M2-08 — Métricas GQM y KPIs de Proceso ----------

export type SemaforoMetrica = 'verde' | 'amarillo' | 'rojo' | 'sin_datos'

export interface KPICalidadProceso {
  nombre: string
  descripcion: string
  valor: number | null
  umbralVerde: { min?: number; max?: number }
  umbralAmarillo: { min?: number; max?: number }
  semaforo: SemaforoMetrica
  formula: string
  fechaCalculo: Date
}

export interface MetricaCalidadProceso {
  id: string
  proyectoId: string
  periodo: string // YYYY-MM o nombre del sprint
  kpis: {
    coherenciaEntregas: KPICalidadProceso
    participacionCliente: KPICalidadProceso
    cambiosPostAprobacion: KPICalidadProceso
    velocidadEquipo: KPICalidadProceso // solo ágil
    completitudAcuerdo: KPICalidadProceso
    tasaExitoEstimaciones: KPICalidadProceso
    tiempoPromedioEstado: KPICalidadProceso
    velocidadResolucionSCR: KPICalidadProceso
  }
  creadoEn: Date
  actualizadoEn: Date
}
