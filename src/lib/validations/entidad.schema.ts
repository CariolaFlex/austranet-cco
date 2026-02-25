// ============================================================
// SCHEMA: Entidad — Módulo 1
// Validaciones Zod para el formulario de entidades
// ============================================================

import { z } from 'zod';
import { rutSchema, emailSchema, phoneSchema } from './helpers';

export const stakeholderSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  cargo: z.string().min(2, 'El cargo es requerido'),
  email: emailSchema,
  telefono: phoneSchema,
  rol: z.enum([
    'usuario_final',
    'gerente_sistema',
    'propietario',
    'responsable_tecnico',
    'experto_dominio',
    'regulador_externo',
    'administrador_negocio',
    'ti_mantenimiento',
  ], { required_error: 'Seleccione un rol' }),
  nivelInfluencia: z.enum(['alto', 'medio', 'bajo'], { required_error: 'Seleccione nivel de influencia' }),
  nivelInteres: z.enum(['alto', 'medio', 'bajo'], { required_error: 'Seleccione nivel de interés' }),
  canalComunicacion: z.string().optional(),
});

export const respuestasFactibilidadSchema = z.object({
  t1_sistemasDocumentados: z.enum(['si', 'parcial', 'no'], { required_error: 'Requerido' }),
  t2_experienciaSoftware: z.enum(['si', 'no'], { required_error: 'Requerido' }),
  t3_infraestructura: z.enum(['si', 'parcial', 'no'], { required_error: 'Requerido' }),
  t4_procesosDocumentados: z.enum(['si', 'parcial', 'no'], { required_error: 'Requerido' }),
  e5_presupuesto: z.enum(['si', 'en_proceso', 'no'], { required_error: 'Requerido' }),
  e6_decisoresAccesibles: z.enum(['si', 'no'], { required_error: 'Requerido' }),
  e7_presupuestoOperacion: z.enum(['si', 'parcial', 'no'], { required_error: 'Requerido' }),
  o8_stakeholdersDisponibles: z.enum(['si', 'parcial', 'no'], { required_error: 'Requerido' }),
  o9_patrocinadorEjecutivo: z.enum(['si', 'no'], { required_error: 'Requerido' }),
  o10_experienciaCambio: z.enum(['si', 'parcial', 'no'], { required_error: 'Requerido' }),
  o11_alineacionEstrategica: z.enum(['si', 'no', 'desconocido'], { required_error: 'Requerido' }),
});

export const entidadBaseSchema = z.object({
  tipo: z.enum(['cliente', 'proveedor', 'ambos'], { required_error: 'Seleccione el tipo de entidad' }),
  razonSocial: z.string().min(2, 'La razón social es requerida').max(200),
  nombreComercial: z.string().max(200).optional(),
  rut: rutSchema,
  sector: z.enum([
    'construccion', 'salud', 'tecnologia', 'educacion', 'finanzas',
    'manufactura', 'retail', 'consultoria', 'otro',
  ], { required_error: 'Seleccione un sector' }),
  pais: z.string().min(2, 'El país es requerido').default('Chile'),
  ciudad: z.string().optional(),
  direccion: z.string().optional(),
  sitioWeb: z.string().url('URL inválida').optional().or(z.literal('')),
});

// Schema sin refine para poder llamar .partial()
const entidadCreateBaseSchema = entidadBaseSchema.extend({
  stakeholders: z.array(stakeholderSchema).min(1, 'Debe agregar al menos un stakeholder'),
  respuestasFactibilidad: respuestasFactibilidadSchema.optional(),
  tieneNDA: z.boolean().default(false),
  fechaNDA: z.date().optional(),
  notas: z.string().optional(),
  nivelRiesgo: z.enum(['bajo', 'medio', 'alto', 'critico']).default('bajo'),
  estado: z.enum(['activo', 'inactivo', 'observado', 'suspendido']).default('activo'),
});

export const entidadCreateSchema = entidadCreateBaseSchema.refine(
  (data) => {
    if (data.tieneNDA === true && !data.fechaNDA) return false;
    return true;
  },
  { message: 'Si tiene NDA, debe indicar la fecha de firma', path: ['fechaNDA'] }
);

export const entidadUpdateSchema = entidadCreateBaseSchema.partial().omit({ estado: true });

export const filtrosEntidadSchema = z.object({
  tipo: z.enum(['cliente', 'proveedor', 'ambos']).optional(),
  estado: z.enum(['activo', 'inactivo', 'observado', 'suspendido']).optional(),
  sector: z.enum([
    'construccion', 'salud', 'tecnologia', 'educacion', 'finanzas',
    'manufactura', 'retail', 'consultoria', 'otro',
  ]).optional(),
  nivelRiesgo: z.enum(['bajo', 'medio', 'alto', 'critico']).optional(),
  busqueda: z.string().optional(),
});

export type EntidadCreateFormData = z.infer<typeof entidadCreateSchema>;
export type EntidadUpdateFormData = z.infer<typeof entidadUpdateSchema>;
export type StakeholderFormData = z.infer<typeof stakeholderSchema>;
export type FiltrosFormData = z.infer<typeof filtrosEntidadSchema>;
