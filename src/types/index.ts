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
  creadoEn: Date
  actualizadoEn: Date
  creadoPor: string
}

// ---------- PROYECTOS (MÓDULO 2) ----------

export interface MiembroEquipo {
  usuarioId: string
  nombre: string
  rol: string // PM, analista, arquitecto, desarrollador, QA
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
  clienteId: string // referencia a Entidad
  proveedoresIds?: string[] // referencias a Entidades
  equipo: MiembroEquipo[]
  riesgos: RiesgoProyecto[]
  fechaInicio?: Date
  fechaFinEstimada?: Date
  presupuestoEstimado?: number
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
