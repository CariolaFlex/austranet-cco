'use client';

// ============================================================
// WIZARD PASO 2 — Stakeholders
// Formulario aislado con su propio useForm + zodResolver.
// El submit llama onNext(data) → avanza al paso 3.
// Muestra la matriz de influencia/interés en tiempo real.
// ============================================================

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib';
import { Input, FormField, Select } from '@/components/ui/input';
import { stakeholderSchema } from '@/lib/validations/entidad.schema';

// -------------------------------------------------------
// SCHEMA LOCAL — solo los campos del paso 2
// -------------------------------------------------------

const paso2Schema = z.object({
  stakeholders: z
    .array(stakeholderSchema)
    .min(1, 'Debe agregar al menos un stakeholder'),
});

export type Paso2Data = z.infer<typeof paso2Schema>;

// -------------------------------------------------------
// OPCIONES
// -------------------------------------------------------

const ROL_OPTIONS = [
  { value: 'usuario_final', label: 'Usuario Final' },
  { value: 'gerente_sistema', label: 'Gerente de Sistema' },
  { value: 'propietario', label: 'Propietario / Sponsor' },
  { value: 'responsable_tecnico', label: 'Responsable Técnico' },
  { value: 'experto_dominio', label: 'Experto de Dominio' },
  { value: 'regulador_externo', label: 'Regulador Externo' },
  { value: 'administrador_negocio', label: 'Administrador de Negocio' },
  { value: 'ti_mantenimiento', label: 'TI / Mantenimiento' },
];

const NIVEL_OPTIONS = [
  { value: 'alto', label: 'Alto' },
  { value: 'medio', label: 'Medio' },
  { value: 'bajo', label: 'Bajo' },
];

// -------------------------------------------------------
// HELPERS
// -------------------------------------------------------

function crearStakeholderVacio() {
  return {
    id: uuidv4(),
    nombre: '',
    cargo: '',
    email: '',
    telefono: '',
    rol: 'usuario_final' as const,
    nivelInfluencia: 'medio' as const,
    nivelInteres: 'medio' as const,
    canalComunicacion: '',
  };
}

// -------------------------------------------------------
// PROPS
// -------------------------------------------------------

interface WizardPaso2Props {
  defaultValues?: Partial<Paso2Data>;
  onNext: (data: Paso2Data) => void;
  /** Recibe el draft actual para preservarlo si el usuario vuelve al paso 1 */
  onBack: (currentData?: Partial<Paso2Data>) => void;
}

// -------------------------------------------------------
// COMPONENTE
// -------------------------------------------------------

export function WizardPaso2({ defaultValues, onNext, onBack }: WizardPaso2Props) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<Paso2Data>({
    resolver: zodResolver(paso2Schema),
    defaultValues: {
      stakeholders:
        defaultValues?.stakeholders && defaultValues.stakeholders.length > 0
          ? defaultValues.stakeholders
          : [crearStakeholderVacio()],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'stakeholders' });
  const watchedStakeholders = watch('stakeholders');

  const handleBack = () => {
    onBack({ stakeholders: getValues('stakeholders') });
  };

  return (
    <form noValidate onSubmit={handleSubmit(onNext)} className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Stakeholders</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append(crearStakeholderVacio())}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Agregar stakeholder
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Error a nivel de array */}
          {errors.stakeholders?.root && (
            <p className="text-xs text-red-500">{errors.stakeholders.root.message}</p>
          )}
          {errors.stakeholders?.message && (
            <p className="text-xs text-red-500">{errors.stakeholders.message}</p>
          )}

          {fields.map((field, idx) => (
            <div key={field.id} className="rounded-lg border p-4 space-y-3 relative">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Stakeholder {idx + 1}
                  </span>
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive h-7 w-7 p-0"
                    onClick={() => remove(idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  label="Nombre"
                  required
                  error={errors.stakeholders?.[idx]?.nombre?.message}
                >
                  <Input
                    {...register(`stakeholders.${idx}.nombre`)}
                    placeholder="Nombre completo"
                    error={!!errors.stakeholders?.[idx]?.nombre}
                  />
                </FormField>

                <FormField
                  label="Cargo"
                  required
                  error={errors.stakeholders?.[idx]?.cargo?.message}
                >
                  <Input
                    {...register(`stakeholders.${idx}.cargo`)}
                    placeholder="Ej: Gerente TI"
                    error={!!errors.stakeholders?.[idx]?.cargo}
                  />
                </FormField>

                <FormField
                  label="Email"
                  required
                  error={errors.stakeholders?.[idx]?.email?.message}
                >
                  <Input
                    {...register(`stakeholders.${idx}.email`)}
                    type="email"
                    placeholder="email@empresa.com"
                    error={!!errors.stakeholders?.[idx]?.email}
                  />
                </FormField>

                <FormField
                  label="Teléfono"
                  error={errors.stakeholders?.[idx]?.telefono?.message}
                >
                  <Input
                    {...register(`stakeholders.${idx}.telefono`)}
                    placeholder="+56 9 1234 5678 (opcional)"
                  />
                </FormField>

                <FormField
                  label="Rol"
                  required
                  error={errors.stakeholders?.[idx]?.rol?.message}
                >
                  <Select
                    {...register(`stakeholders.${idx}.rol`)}
                    options={ROL_OPTIONS}
                    placeholder="Seleccione rol..."
                    error={!!errors.stakeholders?.[idx]?.rol}
                  />
                </FormField>

                <FormField
                  label="Canal de comunicación"
                  error={errors.stakeholders?.[idx]?.canalComunicacion?.message}
                >
                  <Input
                    {...register(`stakeholders.${idx}.canalComunicacion`)}
                    placeholder="Ej: Email, Teams, Reunión (opcional)"
                  />
                </FormField>

                <FormField
                  label="Nivel de influencia"
                  required
                  error={errors.stakeholders?.[idx]?.nivelInfluencia?.message}
                >
                  <Select
                    {...register(`stakeholders.${idx}.nivelInfluencia`)}
                    options={NIVEL_OPTIONS}
                    error={!!errors.stakeholders?.[idx]?.nivelInfluencia}
                  />
                </FormField>

                <FormField
                  label="Nivel de interés"
                  required
                  error={errors.stakeholders?.[idx]?.nivelInteres?.message}
                >
                  <Select
                    {...register(`stakeholders.${idx}.nivelInteres`)}
                    options={NIVEL_OPTIONS}
                    error={!!errors.stakeholders?.[idx]?.nivelInteres}
                  />
                </FormField>
              </div>
            </div>
          ))}

        </CardContent>
      </Card>

      {/* Matriz influencia/interés (M1-01 §6) */}
      {(watchedStakeholders?.length ?? 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Matriz Influencia / Interés (M1-01 §6)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: '🔴 Gestionar de cerca', influencia: 'alto', interes: 'alto', cls: 'bg-red-50 border-red-200 dark:bg-red-950/20' },
                { label: '🟡 Mantener satisfecho', influencia: 'alto', interes: 'bajo', cls: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20' },
                { label: '🔵 Mantener informado', influencia: 'bajo', interes: 'alto', cls: 'bg-blue-50 border-blue-200 dark:bg-blue-950/20' },
                { label: '⚫ Monitorear', influencia: 'bajo', interes: 'bajo', cls: 'bg-gray-50 border-gray-200 dark:bg-gray-900/20' },
              ].map(({ label, influencia, interes, cls }) => {
                const en = (watchedStakeholders ?? []).filter(
                  (s) => s.nivelInfluencia === influencia && s.nivelInteres === interes
                );
                return (
                  <div key={label} className={`rounded border p-2 ${cls}`}>
                    <div className="font-medium mb-1">{label}</div>
                    {en.length === 0 ? (
                      <div className="text-muted-foreground italic">—</div>
                    ) : (
                      en.map((s, i) => (
                        <div key={i} className="truncate">
                          {s.nombre || `Stakeholder ${i + 1}`}
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Influencia: filas (alto = arriba) · Interés: columnas (alto = derecha)
            </p>
          </CardContent>
        </Card>
      )}

      {/* Navegación */}
      <div className="flex items-center justify-between pt-2">
        <Button type="button" variant="outline" onClick={handleBack}>
          <ChevronLeft className="h-4 w-4 mr-1.5" />
          Anterior
        </Button>
        <Button type="submit">
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1.5" />
        </Button>
      </div>
    </form>
  );
}
