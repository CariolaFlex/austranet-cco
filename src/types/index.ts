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
  creadoEn: Date
  actualizadoEn: Date
  creadoPor: string
}

// ---------- ALCANCE / SRS (MÓDULO 3) ----------

export interface Requerimiento {
  id: string
  proyectoId: string
  codigo: string // RF-001, RNF-001, RD-001
  tipo: TipoRequerimiento
  prioridad: PrioridadRequerimiento
  titulo: string
  descripcion: string
  criterioAceptacion?: string
  fuente: string // stakeholder que lo originó
  estado: 'propuesto' | 'aprobado' | 'rechazado' | 'diferido' | 'implementado'
  version: number
  creadoEn: Date
  actualizadoEn: Date
}

export interface SRS {
  id: string
  proyectoId: string
  version: string
  estado: EstadoSRS
  requerimientos: Requerimiento[]
  fechaUltimaRevision?: Date
  aprobadoPor?: string
  fechaAprobacion?: Date
  observaciones?: string
  creadoEn: Date
  actualizadoEn: Date
}

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
  tipoAccion: 'creacion' | 'actualizacion_datos' | 'cambio_estado' | 'gestion_equipo' | 'gestion_riesgos' | 'gestion_hitos' | 'cierre' | 'cancelacion'
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
