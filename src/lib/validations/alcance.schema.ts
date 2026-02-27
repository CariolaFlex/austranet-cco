// ============================================================
// SCHEMAS ZOD — Alcance / SRS (Módulo 3, Sprint M3-FULL)
// Referencia: M3-01 a M3-10, IEEE 830, Sommerville Cap. 4
// Validaciones semánticas alineadas con checklist de calidad:
//   V1 — Sin palabras de alerta sin métrica asociada
//   V2 — Vocabulario controlado (DEBE/DEBERÍA/PODRÁ)
//   S3 — RF Must Have con DADO/CUANDO/ENTONCES
//   S4 — RNF con métrica cuantitativa
// ============================================================

import { z } from 'zod'
import { PALABRAS_ALERTA_SRS, VOCABULARIO_CONTROLADO_SRS } from '@/constants/alcance'

// ──────────────────────────────────────────────────────────────
// HELPERS DE VALIDACIÓN SEMÁNTICA
// ──────────────────────────────────────────────────────────────

/** Verifica que el texto contenga al menos una palabra de vocabulario controlado (V2) */
function tieneVocabularioControlado(texto: string): boolean {
  const lower = texto.toLowerCase()
  return VOCABULARIO_CONTROLADO_SRS.some((v) => lower.includes(v.toLowerCase()))
}

/** Verifica si el texto contiene palabras de alerta sin justificación (V1) */
function contieneAlertaSinJustificacion(texto: string): boolean {
  const lower = texto.toLowerCase()
  return PALABRAS_ALERTA_SRS.some((p) => lower.includes(p.toLowerCase()))
}

// ──────────────────────────────────────────────────────────────
// SUB-SCHEMAS REUTILIZABLES
// ──────────────────────────────────────────────────────────────

export const metricasRNFSchema = z.object({
  metricaObjetivo: z
    .string()
    .min(5, 'Métrica objetivo requerida (ej: "< 200ms", "99.9%")')
    .refine(
      (v) => /[\d%<>=]/.test(v),
      { message: 'La métrica debe contener un valor cuantitativo (número, %, <, >, =)' }
    ),
  metodMedicion: z.string().min(5, 'Método de medición requerido (ej: "JMeter 500 usuarios")'),
  condicionCarga: z.string().optional(),
  unidad: z.string().optional(),
})

export const stakeholderSRSSchema = z.object({
  stakeholderId: z.string().min(1, 'Stakeholder ID requerido (debe ser un stakeholder de M1-01)'),
  nombre: z.string().min(2, 'Nombre requerido'),
  rolSRS: z.enum([
    'cliente_sponsor',
    'usuario_final',
    'gestor_proyecto',
    'arquitecto',
    'regulador',
    'qa_tester',
    'analista_futuro',
  ]),
  esObligatorioTenerRF: z.boolean(),
  disponibleParaEntrevista: z.boolean(),
  fechaDisponibilidad: z.string().optional(),
})

export const factibilidadDimensionSchema = z.object({
  resultado: z.enum(['viable', 'viable_con_restricciones', 'no_viable']),
  justificacion: z.string().min(20, 'Justificación requerida (mín. 20 caracteres)'),
  restricciones: z.array(z.string().min(5)).optional(),
})

export const factibilidadSchema = z.object({
  negocio: factibilidadDimensionSchema,
  tecnica: factibilidadDimensionSchema,
  integracion: factibilidadDimensionSchema,
  global: z.enum(['viable', 'viable_con_restricciones', 'no_viable']),
  motivoCancelacion: z.string().optional(),
  alternativasConsideradas: z.string().optional(),
  firmaCancelacion: z.string().optional(),
}).refine(
  (d) => {
    // Si alguna dimensión es no_viable, el global DEBE ser no_viable
    const hayNoViable =
      d.negocio.resultado === 'no_viable' ||
      d.tecnica.resultado === 'no_viable' ||
      d.integracion.resultado === 'no_viable'
    if (hayNoViable) return d.global === 'no_viable'
    return true
  },
  {
    message: 'Si alguna dimensión es "no_viable", el resultado global debe ser "no_viable"',
    path: ['global'],
  }
)

// ──────────────────────────────────────────────────────────────
// REQUERIMIENTO (RF / RNF / RD) — M3-F5-02/03/04
// ──────────────────────────────────────────────────────────────

export const crearRequerimientoSchema = z.object({
  proyectoId: z.string().min(1),
  srsId: z.string().min(1),
  tipo: z.enum(['funcional', 'no_funcional', 'dominio']),
  prioridad: z.enum(['must', 'should', 'could', 'wont']),
  titulo: z
    .string()
    .min(5, 'Título requerido (mín. 5 caracteres)')
    .max(120, 'Título muy largo (máx. 120 caracteres)'),
  descripcion: z
    .string()
    .min(20, 'Descripción requerida (mín. 20 caracteres)')
    .refine(tieneVocabularioControlado, {
      message: 'La descripción debe contener vocabulario controlado: DEBE, DEBERÍA, PODRÁ (M3-04 §4.1 V2)',
    }),
  criterioAceptacion: z.string().optional(),
  fuente: z.string().min(1, 'Stakeholder fuente requerido (ID de M1-01)'),
  fuenteNombre: z.string().optional(),
  estado: z.enum(['propuesto', 'en_revision', 'aprobado', 'rechazado', 'diferido', 'implementado']).default('propuesto'),

  // Trazabilidad
  moduloSistema: z.string().optional(),
  casoPruebaId: z.string().optional(),
  dependencias: z.array(z.string()).default([]),

  // Evolución
  esVolatil: z.boolean().optional(),
  razonCambio: z.string().optional(),

  // Won't Have
  justificacionWont: z.string().optional(),
  versionObjetivo: z.string().optional(),
  dependenciasTecnicas: z.array(z.string()).default([]),

  // RNF específicos
  categoria: z.enum([
    'rendimiento', 'seguridad', 'disponibilidad', 'usabilidad',
    'mantenibilidad', 'portabilidad', 'proceso',
  ]).optional(),
  metricas: metricasRNFSchema.optional(),

  // RD específicos
  normaOLeyFuente: z.string().optional(),
  stakeholderDominio: z.string().optional(),
  implicacionEnRF: z.array(z.string()).default([]),
  verificabilidadRD: z.string().optional(),

  version: z.number().default(1),
})
// Refinements cross-field
.refine(
  (d) => {
    // S3: RF Must Have necesita criterioAceptacion en DADO/CUANDO/ENTONCES
    if (d.tipo === 'funcional' && d.prioridad === 'must') {
      return !!(d.criterioAceptacion && d.criterioAceptacion.trim().length > 10)
    }
    return true
  },
  {
    message: 'Los RF Must Have necesitan criterioAceptacion en formato DADO/CUANDO/ENTONCES (M3-04 §4.1 S3)',
    path: ['criterioAceptacion'],
  }
)
.refine(
  (d) => {
    // S4: RNF necesita metricas
    if (d.tipo === 'no_funcional') {
      return !!d.metricas && !!d.categoria
    }
    return true
  },
  {
    message: 'Los RNF deben tener categoría y métricas cuantitativas (M3-04 §4.1 S4)',
    path: ['metricas'],
  }
)
.refine(
  (d) => {
    // Requerimientos volátiles deben tener razonCambio (M2 — M3-F5-06)
    if (d.esVolatil === true) return !!d.razonCambio && d.razonCambio.length > 5
    return true
  },
  {
    message: 'Los requerimientos volátiles deben documentar razonCambio (M3-F5-06)',
    path: ['razonCambio'],
  }
)
.refine(
  (d) => {
    // Won't Have: justificacionWont obligatoria (M3-04 Apéndice D S6)
    if (d.prioridad === 'wont') {
      return !!d.justificacionWont && d.justificacionWont.length > 10
    }
    return true
  },
  {
    message: "Los Won't Have deben tener justificación documentada (M3-04 Apéndice D)",
    path: ['justificacionWont'],
  }
)

export type CrearRequerimientoFormValues = z.infer<typeof crearRequerimientoSchema>

// ──────────────────────────────────────────────────────────────
// SESIÓN DE ENTREVISTA — M3-F2-01 (Plantilla M3-02 §4.5)
// ──────────────────────────────────────────────────────────────

export const crearSesionEntrevistaSchema = z.object({
  srsId: z.string().min(1),
  proyectoId: z.string().min(1),
  fecha: z.string().min(1, 'Fecha de la sesión requerida'),
  entrevistadoId: z.string().min(1, 'Stakeholder entrevistado requerido (ID M1-01)'),
  entrevistadoNombre: z.string().min(2),
  entrevistador: z.string().min(2, 'Nombre del entrevistador requerido'),
  objetivos: z.string().min(20, 'Objetivos de la sesión requeridos (mín. 20 caracteres)'),
  duracionMin: z.number().min(15, 'Duración mínima 15 minutos').max(480, 'Duración máxima 8 horas'),
  modalidad: z.enum(['presencial', 'virtual', 'hibrido']),
  tipoEntrevista: z.enum(['abierta', 'cerrada', 'mixta']),
  grabacion: z.string().optional(),
  reqsEmergentes: z.array(z.string()).default([]),
  terminosGlosario: z.array(z.string()).default([]),
  conflictosDetectados: z.string().default(''),
  observaciones: z.string().optional(),
  proximaSesion: z.string().optional(),
})
// M3-02 §4.5: solo entrevista_cerrada NO descubre conocimiento tácito → advertencia
// (no bloqueamos, solo para mostrar advertencia en UI)

export type CrearSesionEntrevistaFormValues = z.infer<typeof crearSesionEntrevistaSchema>

// ──────────────────────────────────────────────────────────────
// ESCENARIO / HISTORIA DE USUARIO — M3-F2-02 (M3-02 §5)
// ──────────────────────────────────────────────────────────────

export const crearEscenarioSchema = z.object({
  srsId: z.string().min(1),
  proyectoId: z.string().min(1),
  titulo: z.string().min(5, 'Título del escenario requerido (mín. 5 caracteres)').max(100),
  actorPrincipal: z.string().min(1, 'Actor principal requerido (ID M1-01)'),
  actorNombre: z.string().min(2),
  situacionInicial: z.string().min(10, 'Situación inicial requerida'),
  flujoNormal: z
    .array(z.string().min(3, 'Cada paso debe tener al menos 3 caracteres'))
    .min(2, 'El flujo normal debe tener al menos 2 pasos'),
  flujoAlternativo: z.array(z.string()).optional(),
  excepcionesErrores: z.array(z.string()).optional(),
  requerimientosGenerados: z.array(z.string()).default([]),
  esBaseParaCasoDeUso: z.boolean().default(false),
})

export type CrearEscenarioFormValues = z.infer<typeof crearEscenarioSchema>

// ──────────────────────────────────────────────────────────────
// CASO DE PRUEBA — M3-F7-02, M3-10
// ──────────────────────────────────────────────────────────────

export const crearCasoPruebaSchema = z.object({
  srsId: z.string().min(1),
  proyectoId: z.string().min(1),
  requerimientoId: z.string().min(1, 'Requerimiento RF Must Have asociado requerido'),
  codigoRF: z.string().min(1),
  titulo: z.string().min(5, 'Título del caso de prueba requerido').max(100),
  tipo: z.enum(['aceptacion_alfa', 'aceptacion_beta', 'funcional', 'no_funcional']),
  dado: z.string().min(10, 'DADO: precondición del sistema requerida (mín. 10 caracteres)'),
  cuando: z.string().min(10, 'CUANDO: acción del actor requerida (mín. 10 caracteres)'),
  entonces: z.string().min(10, 'ENTONCES: resultado verificable esperado requerido (mín. 10 caracteres)'),
  estado: z.enum(['pendiente', 'ejecutado_ok', 'ejecutado_fallo', 'bloqueado']).default('pendiente'),
  responsable: z.string().optional(),
  notas: z.string().optional(),
})

export type CrearCasoPruebaFormValues = z.infer<typeof crearCasoPruebaSchema>

// ──────────────────────────────────────────────────────────────
// TÉRMINO DE DOMINIO SRS — M3-F1-02, M3-08
// ──────────────────────────────────────────────────────────────

export const crearTerminoDominioSRSSchema = z.object({
  srsId: z.string().min(1),
  proyectoId: z.string().min(1),
  termino: z
    .string()
    .min(2, 'Término requerido (mín. 2 caracteres)')
    .max(80, 'Término demasiado largo (máx. 80 caracteres)'),
  definicionOperativa: z
    .string()
    .min(20, 'Definición operativa requerida (mín. 20 caracteres)')
    .refine(
      (v) => !contieneAlertaSinJustificacion(v),
      { message: 'La definición no debe contener palabras de alerta (M3-04 §4.1). Use términos precisos.' }
    ),
  fuenteRegulatoriaONorma: z.string().optional(),
  esRequerimientoDominio: z.boolean().default(false),
  requerimientoDominioId: z.string().optional(),
  origen: z.enum(['importado_m1', 'nuevo_proyecto']).default('nuevo_proyecto'),
  entradaGlosarioId: z.string().optional(),
})
.refine(
  (d) => {
    // Si origen = importado_m1, debe tener entradaGlosarioId
    if (d.origen === 'importado_m1') return !!d.entradaGlosarioId
    return true
  },
  {
    message: 'Los términos importados de M1 deben tener entradaGlosarioId',
    path: ['entradaGlosarioId'],
  }
)

export type CrearTerminoDominioSRSFormValues = z.infer<typeof crearTerminoDominioSRSSchema>

// ──────────────────────────────────────────────────────────────
// PROTOTIPO — M3-F3-01
// ──────────────────────────────────────────────────────────────

export const crearPrototipoSchema = z.object({
  objetivo: z.string().min(10, 'Objetivo del prototipo requerido (qué RFs valida)'),
  tipo: z.enum(['wireframe_papel', 'mockup_digital', 'mago_de_oz', 'prototipo_funcional']),
  requerimientosAValidar: z
    .array(z.string())
    .min(1, 'Selecciona al menos 1 requerimiento a validar')
    .max(15, 'Máximo 15 requerimientos por prototipo (M3-F3-01)'),
  urlArtifacto: z.string().url('URL válida requerida').optional().or(z.literal('')),
  fechaSesionEvaluacion: z.string().optional(),
  stakeholdersParticipantes: z.array(z.string()).default([]),
  observaciones: z.string().optional(),
})

export type CrearPrototipoFormValues = z.infer<typeof crearPrototipoSchema>

// ──────────────────────────────────────────────────────────────
// ARTEFACTO DE MODELO UML — M3-F4
// ──────────────────────────────────────────────────────────────

export const crearArtefactoModeloSchema = z.object({
  nombre: z.string().min(3, 'Nombre del artefacto requerido (mín. 3 caracteres)'),
  tipo: z.enum([
    'modelo_contexto',
    'caso_de_uso',
    'bpmn',
    'diagrama_actividad',
    'diagrama_secuencia',
    'diagrama_clase',
    'diagrama_estado',
    'diagrama_proceso',
  ]),
  descripcion: z.string().optional(),
  url: z.string().url('URL del artefacto requerida (draw.io, Miro, Lucidchart, etc.)'),
  herramienta: z.string().min(2, 'Herramienta usada requerida (ej: draw.io, Miro)'),
  sistemasExternosIdentificados: z.array(z.string()).optional(),
  rnfInteroperabilidadIds: z.array(z.string()).optional(),
  actoresIdentificados: z.array(z.string()).optional(),
  casosDeUsoListados: z.array(z.string()).optional(),
  casosDeUsoHuerfanos: z.array(z.string()).optional(),
  procesosModelados: z.array(z.string()).optional(),
  actividadesIdentificadas: z.array(z.string()).optional(),
  puntosDecision: z.number().optional(),
})

export type CrearArtefactoModeloFormValues = z.infer<typeof crearArtefactoModeloSchema>

// ──────────────────────────────────────────────────────────────
// SCR DEL SRS — M3-09 §5
// ──────────────────────────────────────────────────────────────

export const crearSCRSRSSchema = z.object({
  titulo: z.string().min(5, 'Título de la solicitud requerido (mín. 5 caracteres)'),
  solicitante: z.string().min(2, 'Nombre del solicitante requerido'),
  fechaSolicitud: z.string().min(1, 'Fecha de solicitud requerida'),
  urgencia: z.enum(['baja', 'media', 'alta', 'critica']),
  descripcion: z.string().min(30, 'Descripción del cambio requerida (mín. 30 caracteres)'),
  justificacion: z.string().min(20, 'Justificación del cambio requerida (mín. 20 caracteres)'),
  causaRaiz: z.enum([
    'cambio_negocio',
    'error_especificacion',
    'nuevo_requerimiento',
    'factor_externo',
    'decision_tecnica',
  ]),
  requerimientosAfectados: z.array(z.string()).min(1, 'Selecciona al menos 1 requerimiento afectado'),
  requerimientosImpactoIndirecto: z.array(z.string()).default([]),
  analisisImpacto: z.string().optional(),
  impactoEnPresupuesto: z.enum(['ninguno', 'menor', 'moderado', 'significativo']).optional(),
  impactoEnPlazo: z.enum(['ninguno', 'menor', 'moderado', 'significativo']).optional(),
  tipoCambio: z.enum(['menor', 'mayor']),
  nuevaVersion: z.string().optional(),
  implementadoPor: z.string().optional(),
})

export type CrearSCRSRSFormValues = z.infer<typeof crearSCRSRSSchema>

// ──────────────────────────────────────────────────────────────
// FACTIBILIDAD GATE 1 — M3-F1-04
// ──────────────────────────────────────────────────────────────

export const gate1Schema = z.object({
  factibilidad: factibilidadSchema,
  decision: z.enum(['go', 'nogo']),
  decisionPor: z.string().min(2, 'Firmante de la decisión requerido'),
})
.refine(
  (d) => {
    // Si global = no_viable, la decisión DEBE ser nogo
    if (d.factibilidad.global === 'no_viable') return d.decision === 'nogo'
    return true
  },
  {
    message: 'Si la factibilidad es "no_viable", la decisión Gate 1 debe ser "NoGo"',
    path: ['decision'],
  }
)

export type Gate1FormValues = z.infer<typeof gate1Schema>

// ──────────────────────────────────────────────────────────────
// DATOS INICIALES SRS — F1-01 (Declaración del Problema)
// ──────────────────────────────────────────────────────────────

export const inicioSRSSchema = z.object({
  declaracionProblema: z
    .string()
    .min(50, 'La declaración del problema debe ser suficientemente descriptiva (mín. 50 caracteres)')
    .max(2000),
  objetivosNegocio: z
    .array(z.string().min(10, 'Cada objetivo debe tener al menos 10 caracteres'))
    .min(1, 'Al menos 1 objetivo de negocio requerido')
    .max(5, 'Máximo 5 objetivos de negocio (M3-F1-01 restringe a 5 objetivos verificables)'),
  sistemasExistentes: z.array(z.string().min(3)).default([]),
  tecnicasActivas: z
    .array(z.enum([
      'entrevista_abierta',
      'entrevista_cerrada',
      'entrevista_mixta',
      'etnografia',
      'taller_jad',
      'escenarios',
      'casos_uso_adquisicion',
    ]))
    .min(1, 'Al menos 1 técnica de adquisición requerida'),
  stakeholdersSRS: z.array(stakeholderSRSSchema).min(1, 'Al menos 1 stakeholder clasificado requerido'),
})
.refine(
  (d) => {
    // M3-F2-01: Si solo se usa entrevista_cerrada, NO descubre conocimiento tácito → bloqueo
    const soloCerrada =
      d.tecnicasActivas.every((t) => t === 'entrevista_cerrada') &&
      d.tecnicasActivas.includes('entrevista_cerrada')
    return !soloCerrada
  },
  {
    message:
      'La entrevista cerrada sola no descubre conocimiento tácito. ' +
      'Agrega al menos una técnica abierta: entrevista_abierta, etnografia, taller_jad o escenarios (M3-02 §4.5)',
    path: ['tecnicasActivas'],
  }
)

export type InicioSRSFormValues = z.infer<typeof inicioSRSSchema>

// ──────────────────────────────────────────────────────────────
// PLAN DESPLIEGUE — M3-F8-01
// ──────────────────────────────────────────────────────────────

export const planDespliegueSchema = z.object({
  estrategia: z.enum(['big_bang', 'incremental', 'paralelo', 'piloto']),
  sistemasAMigrar: z.array(z.object({
    nombre: z.string().min(2),
    datosAMigrar: z.string().min(5),
    formatoOrigen: z.string().min(2),
    formatoDestino: z.string().min(2),
    responsableTecnico: z.string().min(2),
  })).default([]),
  esquemaMigracion: z.string().min(10, 'Esquema de migración requerido'),
  fechaTargetDespliegue: z.string().optional(),
  responsable: z.string().optional(),
})

export type PlanDespliegueFormValues = z.infer<typeof planDespliegueSchema>

// ──────────────────────────────────────────────────────────────
// PLAN SLA — M3-F8-03
// ──────────────────────────────────────────────────────────────

export const planSLASchema = z.object({
  periodoGarantia: z.number().min(30, 'Período mínimo de garantía: 30 días').max(365),
  slaDisponibilidad: z
    .number()
    .min(90, 'SLA de disponibilidad mínimo: 90%')
    .max(100),
  tiemposRespuesta: z.array(z.object({
    severidad: z.enum(['critico', 'alto', 'medio', 'bajo']),
    tiempoRespuesta: z.string().min(1, 'Tiempo de respuesta requerido (ej: "2h")'),
    tiempoResolucion: z.string().min(1, 'Tiempo de resolución requerido (ej: "8h")'),
  })).min(1, 'Al menos 1 nivel de severidad requerido'),
  responsablePostEntrega: z.enum(['proveedor', 'cliente', 'mixto']),
  mecanismoReporte: z.string().min(10, 'Mecanismo de reporte de incidentes requerido'),
  criterioFinGarantia: z.string().min(10, 'Criterio de cierre del período de garantía requerido'),
})

export type PlanSLAFormValues = z.infer<typeof planSLASchema>

// ──────────────────────────────────────────────────────────────
// OBSERVACIÓN DE VALIDACIÓN — M3-F7-01
// ──────────────────────────────────────────────────────────────

export const observacionValidacionSchema = z.object({
  seccionAfectada: z.string().min(3, 'Sección afectada requerida (ej: "Sección 3 — RF-042")'),
  descripcion: z.string().min(10, 'Descripción de la observación requerida (mín. 10 caracteres)'),
  tipoObservacion: z.enum(['aclaracion', 'ajuste_menor', 'ajuste_mayor']),
  autor: z.string().min(2, 'Nombre del revisor requerido'),
  autorId: z.string().optional(),
})

export type ObservacionValidacionFormValues = z.infer<typeof observacionValidacionSchema>
