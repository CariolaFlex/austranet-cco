'use client';

// ============================================================
// WIZARD PASO 3 — Evaluación de factibilidad + NDA
// Único <form> con submit real en el wizard.
// El submit llama onSubmit(data) → el padre combina todo y llama Firebase.
// El preprocess de respuestasFactibilidad convierte '' → undefined
// para que zodResolver funcione correctamente con los <Select> vacíos.
// ============================================================

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib';
import { Badge } from '@/components/ui/badge';
import { FormField, Select, Textarea } from '@/components/ui/input';
import { respuestasFactibilidadSchema } from '@/lib/validations/entidad.schema';
import { calcularNivelRiesgo } from '@/services/entidades.service';
import type { RespuestasFactibilidad } from '@/types';

// -------------------------------------------------------
// SCHEMA LOCAL — Paso 3 con preprocess para selects vacíos
// -------------------------------------------------------

const paso3Schema = z
  .object({
    respuestasFactibilidad: z.preprocess(
      (raw) => {
        if (raw === null || raw === undefined) return undefined;
        if (typeof raw !== 'object' || Array.isArray(raw)) return undefined;
        const cleaned: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
          if (v !== '' && v !== null && v !== undefined) cleaned[k] = v;
        }
        return Object.keys(cleaned).length > 0 ? cleaned : undefined;
      },
      respuestasFactibilidadSchema.partial().optional()
    ),
    tieneNDA: z.boolean().default(false),
    fechaNDA: z.date().optional(),
    notas: z.string().optional(),
  })
  .refine((data) => !(data.tieneNDA === true && !data.fechaNDA), {
    message: 'Si tiene NDA, debe indicar la fecha de firma',
    path: ['fechaNDA'],
  });

export type Paso3Data = z.infer<typeof paso3Schema>;

// -------------------------------------------------------
// DATOS DE CONFIGURACIÓN
// -------------------------------------------------------

const PREGUNTAS_FACTIBILIDAD = [
  {
    categoria: 'Técnica (40%)',
    preguntas: [
      {
        key: 't1_sistemasDocumentados',
        label: '¿Los sistemas actuales están documentados?',
        opciones: [{ value: 'si', label: 'Sí' }, { value: 'parcial', label: 'Parcial' }, { value: 'no', label: 'No' }],
      },
      {
        key: 't2_experienciaSoftware',
        label: '¿La organización tiene experiencia con software a medida?',
        opciones: [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }],
      },
      {
        key: 't3_infraestructura',
        label: '¿Cuenta con infraestructura tecnológica adecuada?',
        opciones: [{ value: 'si', label: 'Sí' }, { value: 'parcial', label: 'Parcial' }, { value: 'no', label: 'No' }],
      },
      {
        key: 't4_procesosDocumentados',
        label: '¿Los procesos de negocio están documentados?',
        opciones: [{ value: 'si', label: 'Sí' }, { value: 'parcial', label: 'Parcial' }, { value: 'no', label: 'No' }],
      },
    ],
  },
  {
    categoria: 'Económica (35%)',
    preguntas: [
      {
        key: 'e5_presupuesto',
        label: '¿Cuenta con presupuesto asignado para el proyecto?',
        opciones: [{ value: 'si', label: 'Sí' }, { value: 'en_proceso', label: 'En proceso' }, { value: 'no', label: 'No' }],
      },
      {
        key: 'e6_decisoresAccesibles',
        label: '¿Los decisores financieros son accesibles?',
        opciones: [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }],
      },
      {
        key: 'e7_presupuestoOperacion',
        label: '¿Existe presupuesto para operación continua?',
        opciones: [{ value: 'si', label: 'Sí' }, { value: 'parcial', label: 'Parcial' }, { value: 'no', label: 'No' }],
      },
    ],
  },
  {
    categoria: 'Organizacional (25%)',
    preguntas: [
      {
        key: 'o8_stakeholdersDisponibles',
        label: '¿Los stakeholders clave están disponibles?',
        opciones: [{ value: 'si', label: 'Sí' }, { value: 'parcial', label: 'Parcial' }, { value: 'no', label: 'No' }],
      },
      {
        key: 'o9_patrocinadorEjecutivo',
        label: '¿Existe patrocinador ejecutivo del proyecto?',
        opciones: [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }],
      },
      {
        key: 'o10_experienciaCambio',
        label: '¿La organización tiene experiencia en gestión del cambio?',
        opciones: [{ value: 'si', label: 'Sí' }, { value: 'parcial', label: 'Parcial' }, { value: 'no', label: 'No' }],
      },
      {
        key: 'o11_alineacionEstrategica',
        label: '¿El proyecto está alineado estratégicamente?',
        opciones: [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }, { value: 'desconocido', label: 'Desconocido' }],
      },
    ],
  },
];

const NIVEL_RIESGO_COLOR: Record<string, string> = {
  bajo: 'bg-green-100 text-green-800 border-green-200',
  medio: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  alto: 'bg-orange-100 text-orange-800 border-orange-200',
  critico: 'bg-red-100 text-red-800 border-red-200',
};

const COMPLETITUD_COLOR: Record<string, string> = {
  minimo: 'bg-gray-100 text-gray-700 border-gray-200',
  estandar: 'bg-blue-100 text-blue-800 border-blue-200',
  completo: 'bg-green-100 text-green-800 border-green-200',
};

// -------------------------------------------------------
// PROPS
// -------------------------------------------------------

interface WizardPaso3Props {
  defaultValues?: Partial<Paso3Data>;
  /** Recibe el draft actual para preservarlo si el usuario vuelve al paso 2 */
  onBack: (currentData?: Partial<Paso3Data>) => void;
  onSubmit: (data: Paso3Data) => Promise<void>;
  isLoading: boolean;
  mode: 'create' | 'edit';
  /** Completitud calculada en el padre a partir de datos de pasos 1 y 2 */
  completitud: 'minimo' | 'estandar' | 'completo';
}

// -------------------------------------------------------
// COMPONENTE
// -------------------------------------------------------

export function WizardPaso3({
  defaultValues,
  onBack,
  onSubmit,
  isLoading,
  mode,
  completitud,
}: WizardPaso3Props) {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<Paso3Data>({
    resolver: zodResolver(paso3Schema),
    defaultValues: {
      tieneNDA: false,
      ...defaultValues,
    },
  });

  const watchedTieneNDA = watch('tieneNDA');
  // watch devuelve los valores raw del form (strings de <select>), no los procesados por zodResolver
  const watchedRespuestasRaw = watch('respuestasFactibilidad') as Record<string, unknown> | undefined;

  // Solo mostrar nivelRiesgo cuando las 11 preguntas están respondidas (sin vacíos)
  const nivelRiesgoCalc = (() => {
    if (!watchedRespuestasRaw) return null;
    const vals = Object.values(watchedRespuestasRaw);
    if (vals.length < 11 || vals.some((v) => !v || v === '')) return null;
    return calcularNivelRiesgo(watchedRespuestasRaw as unknown as RespuestasFactibilidad);
  })();

  const handleBack = () => {
    onBack(getValues() as Partial<Paso3Data>);
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Evaluación de factibilidad */}
      {PREGUNTAS_FACTIBILIDAD.map(({ categoria, preguntas }) => (
        <Card key={categoria}>
          <CardHeader>
            <CardTitle className="text-base">{categoria}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {preguntas.map(({ key, label, opciones }) => (
              <FormField key={key} label={label}>
                <Select
                  {...register(
                    `respuestasFactibilidad.${key as keyof RespuestasFactibilidad}`
                  )}
                  options={opciones}
                  placeholder="Seleccionar..."
                />
              </FormField>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* NDA + Notas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">NDA y notas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Acuerdo de confidencialidad (NDA)">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('tieneNDA')}
                className="h-4 w-4 rounded border-gray-300 text-primary"
              />
              <span className="text-sm">La entidad tiene NDA firmado</span>
            </label>
          </FormField>

          {watchedTieneNDA && (
            <FormField
              label="Fecha de firma del NDA"
              required
              error={errors.fechaNDA?.message}
            >
              <input
                type="date"
                {...register('fechaNDA', { valueAsDate: true })}
                className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </FormField>
          )}

          <FormField label="Notas adicionales" error={errors.notas?.message}>
            <Textarea
              {...register('notas')}
              placeholder="Observaciones, contexto adicional, acuerdos verbales... (opcional)"
              rows={3}
            />
          </FormField>
        </CardContent>
      </Card>

      {/* Indicadores en tiempo real */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Nivel de riesgo calculado</p>
              {nivelRiesgoCalc ? (
                <Badge variant="outline" className={NIVEL_RIESGO_COLOR[nivelRiesgoCalc]}>
                  {nivelRiesgoCalc.charAt(0).toUpperCase() + nivelRiesgoCalc.slice(1)}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  Completar evaluación
                </Badge>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Completitud estimada</p>
              <Badge variant="outline" className={COMPLETITUD_COLOR[completitud]}>
                {completitud.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navegación */}
      <div className="flex items-center justify-between pt-2">
        <Button type="button" variant="outline" onClick={handleBack}>
          <ChevronLeft className="h-4 w-4 mr-1.5" />
          Anterior
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? mode === 'create'
              ? 'Creando...'
              : 'Guardando...'
            : mode === 'create'
            ? 'Crear entidad'
            : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  );
}
