'use client';

// ============================================================
// WIZARD PASO 1 — Datos básicos de la entidad
// Formulario aislado con su propio useForm + zodResolver.
// El submit llama onNext(data) y NO puede disparar el paso 3.
// ============================================================

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib';
import { Input, FormField, Select } from '@/components/ui/input';
import { entidadBaseSchema } from '@/lib/validations/entidad.schema';
import type { z } from 'zod';

export type Paso1Data = z.infer<typeof entidadBaseSchema>;

// -------------------------------------------------------
// OPCIONES
// -------------------------------------------------------

const TIPO_OPTIONS = [
  { value: 'cliente', label: 'Cliente' },
  { value: 'proveedor', label: 'Proveedor' },
  { value: 'ambos', label: 'Cliente + Proveedor' },
];

const SECTOR_OPTIONS = [
  { value: 'construccion', label: 'Construcción' },
  { value: 'salud', label: 'Salud' },
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'educacion', label: 'Educación' },
  { value: 'finanzas', label: 'Finanzas' },
  { value: 'manufactura', label: 'Manufactura' },
  { value: 'retail', label: 'Retail' },
  { value: 'consultoria', label: 'Consultoría' },
  { value: 'otro', label: 'Otro' },
];

// -------------------------------------------------------
// PROPS
// -------------------------------------------------------

interface WizardPaso1Props {
  defaultValues?: Partial<Paso1Data>;
  onNext: (data: Paso1Data) => void;
  onCancel: () => void;
}

// -------------------------------------------------------
// COMPONENTE
// -------------------------------------------------------

export function WizardPaso1({ defaultValues, onNext, onCancel }: WizardPaso1Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Paso1Data>({
    resolver: zodResolver(entidadBaseSchema),
    defaultValues: {
      tipo: 'cliente',
      pais: 'Chile',
      ...defaultValues,
    },
  });

  return (
    <form noValidate onSubmit={handleSubmit(onNext)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Datos básicos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Tipo */}
          <FormField label="Tipo de entidad" required error={errors.tipo?.message}>
            <div className="flex gap-2 flex-wrap">
              {TIPO_OPTIONS.map((opt) => (
                <Controller
                  key={opt.value}
                  control={control}
                  name="tipo"
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => field.onChange(opt.value)}
                      className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                        field.value === opt.value
                          ? 'bg-primary text-white border-primary'
                          : 'border-input bg-background hover:bg-accent'
                      }`}
                    >
                      {opt.label}
                    </button>
                  )}
                />
              ))}
            </div>
          </FormField>

          {/* Razón Social + Nombre Comercial */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Razón social" required error={errors.razonSocial?.message}>
              <Input
                {...register('razonSocial')}
                placeholder="Ej: Empresa S.A."
                error={!!errors.razonSocial}
              />
            </FormField>
            <FormField label="Nombre comercial" error={errors.nombreComercial?.message}>
              <Input
                {...register('nombreComercial')}
                placeholder="Ej: MiEmpresa (opcional)"
              />
            </FormField>
          </div>

          {/* RUT + Sector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="RUT" required error={errors.rut?.message}>
              <Input
                {...register('rut')}
                placeholder="Ej: 76.123.456-7"
                error={!!errors.rut}
              />
            </FormField>
            <FormField label="Sector" required error={errors.sector?.message}>
              <Select
                {...register('sector')}
                options={SECTOR_OPTIONS}
                placeholder="Seleccione sector..."
                error={!!errors.sector}
              />
            </FormField>
          </div>

          {/* País + Ciudad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="País" required error={errors.pais?.message}>
              <Input
                {...register('pais')}
                placeholder="Chile"
                error={!!errors.pais}
              />
            </FormField>
            <FormField label="Ciudad" error={errors.ciudad?.message}>
              <Input
                {...register('ciudad')}
                placeholder="Ej: Santiago (opcional)"
              />
            </FormField>
          </div>

          {/* Dirección + Sitio Web */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Dirección" error={errors.direccion?.message}>
              <Input
                {...register('direccion')}
                placeholder="Ej: Av. Principal 123 (opcional)"
              />
            </FormField>
            <FormField label="Sitio web" error={errors.sitioWeb?.message}>
              <Input
                {...register('sitioWeb')}
                placeholder="https://ejemplo.com (opcional)"
                error={!!errors.sitioWeb}
              />
            </FormField>
          </div>

        </CardContent>
      </Card>

      {/* Navegación */}
      <div className="flex items-center justify-between pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          <ChevronLeft className="h-4 w-4 mr-1.5" />
          Cancelar
        </Button>
        <Button type="submit">
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1.5" />
        </Button>
      </div>
    </form>
  );
}
