// ============================================================
// SCHEMAS ZOD — Proyecto (Módulo 2, Sprint 3)
// Referencia: M2-01 §9 — Flujo de 7 pasos de creación
// ============================================================

import { z } from 'zod'

// -------------------------------------------------------
// SUB-SCHEMAS
// -------------------------------------------------------

export const miembroEquipoSchema = z.object({
  usuarioId: z.string().min(1, 'ID de usuario requerido'),
  nombre: z.string().min(2, 'Nombre requerido (mín. 2 caracteres)'),
  rol: z.string().min(1, 'Rol requerido'),
  rolCliente: z.string().optional(),
  esExterno: z.boolean(),
})

export const riesgoProyectoSchema = z.object({
  id: z.string(),
  descripcion: z.string().min(10, 'Descripción debe tener al menos 10 caracteres'),
  tipo: z.enum(['tecnologico', 'personas', 'organizacional', 'requerimientos', 'estimacion']),
  probabilidad: z.enum(['muy_baja', 'baja', 'media', 'alta', 'muy_alta']),
  impacto: z.enum(['muy_bajo', 'bajo', 'medio', 'alto', 'muy_alto']),
  estrategia: z.enum(['evitar', 'minimizar', 'contingencia', 'aceptar']),
  mitigacion: z.string().optional(),
  responsable: z.string().optional(),
  estado: z.enum(['activo', 'mitigado', 'materializado', 'cerrado']).default('activo'),
  origen: z.enum(['heredado_entidad', 'identificado_proyecto']).default('identificado_proyecto'),
})

export const hitoSchema = z.object({
  id: z.string(),
  nombre: z.string().min(3, 'Nombre del hito requerido (mín. 3 caracteres)'),
  descripcion: z.string().min(5, 'Descripción del hito requerida'),
  fechaEstimada: z.string().min(1, 'Fecha estimada requerida'),
  fechaReal: z.string().optional(),
  estado: z.enum(['pendiente', 'en_riesgo', 'completado', 'incumplido']).default('pendiente'),
  entregable: z.string().optional(),
  responsable: z.string().min(2, 'Responsable requerido'),
})

export const presupuestoSchema = z.object({
  metodoUsado: z.enum(['juicio_experto', 'analogia', 'descomposicion', 'cocomo_ii', 'puntos_funcion', 'planning_poker']),
  estimacionMinima: z.number().positive('Debe ser mayor a 0'),
  estimacionNominal: z.number().positive('Debe ser mayor a 0'),
  estimacionMaxima: z.number().positive('Debe ser mayor a 0'),
  moneda: z.string().min(1, 'Moneda requerida'),
  supuestos: z.array(z.string().min(3)).min(1, 'Ingresa al menos 1 supuesto'),
  exclusiones: z.array(z.string().min(3)).min(1, 'Ingresa al menos 1 exclusión'),
}).refine(
  (d) => d.estimacionMaxima >= d.estimacionNominal && d.estimacionNominal >= d.estimacionMinima,
  { message: 'Los rangos deben ser: mínimo ≤ nominal ≤ máximo', path: ['estimacionMaxima'] }
)

// -------------------------------------------------------
// PASO 1 — Datos básicos
// -------------------------------------------------------
export const paso1Schema = z.object({
  nombre: z.string().min(3, 'Nombre del proyecto requerido (mín. 3 caracteres)'),
  codigo: z.string().min(2, 'Código requerido').max(20, 'Código muy largo (máx. 20)'),
  descripcion: z.string().min(10, 'Descripción requerida (mín. 10 caracteres)'),
  tipo: z.enum(['nuevo_desarrollo', 'mantenimiento', 'migracion', 'consultoria', 'integracion']),
  criticidad: z.enum(['baja', 'media', 'alta', 'critica']),
  clienteId: z.string().min(1, 'Debes seleccionar una entidad cliente'),
})

// -------------------------------------------------------
// PASO 2 — Metodología (M2-INT: incluye 7 campos decisorios + acuerdo)
// -------------------------------------------------------
export const paso2Schema = z.object({
  metodologia: z.enum(['cascada', 'incremental', 'agil_scrum', 'agil_xp', 'rup', 'espiral', 'hibrido']),
  justificacionMetodologia: z.string().optional(),
  // M2-07: Campos decisorios del árbol de metodología
  tamanoEquipo: z.number({ required_error: 'Tamaño estimado del equipo requerido' })
    .int('Debe ser un número entero')
    .min(1, 'El equipo debe tener al menos 1 persona')
    .max(100, 'Máximo 100 personas'),
  distribuidoGeograficamente: z.boolean(),
  requiereRegulacionExterna: z.boolean(),
  estabilidadRequerimientos: z.enum(['baja', 'media', 'alta'], {
    required_error: 'Estabilidad de requerimientos requerida',
  }),
  clienteDisponibleParaIteraciones: z.boolean(),
  tieneContratoFijo: z.boolean(),
  // M2-07: Consentimiento del cliente y versión del acuerdo
  clienteConsentioMetodologia: z.boolean(),
  metodologiaVersion: z.number().int().min(1).default(1),
})

// -------------------------------------------------------
// PASO 3 — Equipo
// -------------------------------------------------------
export const paso3Schema = z.object({
  equipo: z.array(miembroEquipoSchema).min(1, 'Debe haber al menos 1 miembro en el equipo'),
})

// -------------------------------------------------------
// PASO 4 — Riesgos
// -------------------------------------------------------
export const paso4Schema = z.object({
  riesgos: z.array(riesgoProyectoSchema).min(3, 'Debes registrar al menos 3 riesgos'),
})

// -------------------------------------------------------
// PASO 5 — Calendarización
// -------------------------------------------------------
export const paso5Schema = z.object({
  fechaInicio: z.string().min(1, 'Fecha de inicio requerida'),
  fechaFinEstimada: z.string().min(1, 'Fecha de fin estimada requerida'),
  hitos: z.array(hitoSchema).min(3, 'Debes definir al menos 3 hitos'),
})

// -------------------------------------------------------
// PASO 6 — Presupuesto
// -------------------------------------------------------
export const paso6Schema = z.object({
  presupuesto: presupuestoSchema.optional(),
})

// -------------------------------------------------------
// SCHEMA COMPLETO
// -------------------------------------------------------
export const proyectoWizardSchema = paso1Schema
  .merge(paso2Schema)
  .merge(paso3Schema)
  .merge(paso4Schema)
  .merge(paso5Schema)
  .merge(paso6Schema)

export type ProyectoWizardFormData = z.infer<typeof proyectoWizardSchema>
export type MiembroEquipoFormData = z.infer<typeof miembroEquipoSchema>
export type RiesgoProyectoFormData = z.infer<typeof riesgoProyectoSchema>
export type HitoFormData = z.infer<typeof hitoSchema>
export type PresupuestoFormData = z.infer<typeof presupuestoSchema>
