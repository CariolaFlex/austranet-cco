'use client'

// ============================================================
// FormularioAPU — M5-S02
// Formulario crear/editar APU (nombre, descripción, moneda, estado).
// Usa react-hook-form + Zod para validación.
// ============================================================

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Save, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/lib'
import { cn } from '@/lib/utils'
import type { APU, CrearAPUDTO, ActualizarAPUDTO, EstadoAPU } from '@/types'

// -------------------------------------------------------
// SCHEMA ZOD
// -------------------------------------------------------

const MONEDAS = ['CLP', 'USD', 'UF', 'PEN', 'EUR'] as const
const ESTADOS: EstadoAPU[] = ['borrador', 'revision', 'aprobado']

const ESTADO_LABELS: Record<EstadoAPU, string> = {
  borrador:  'Borrador',
  revision:  'En revisión',
  aprobado:  'Aprobado',
}

const MONEDA_LABELS: Record<string, string> = {
  CLP: 'CLP — Peso chileno',
  USD: 'USD — Dólar americano',
  UF:  'UF — Unidad de Fomento',
  PEN: 'PEN — Sol peruano',
  EUR: 'EUR — Euro',
}

const apuSchema = z.object({
  nombre:      z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(120, 'Máximo 120 caracteres'),
  descripcion: z.string().max(500, 'Máximo 500 caracteres').optional(),
  moneda:      z.enum(MONEDAS, { errorMap: () => ({ message: 'Selecciona una moneda válida' }) }),
  estado:      z.enum(['borrador', 'revision', 'aprobado'] as const, {
    errorMap: () => ({ message: 'Estado inválido' }),
  }),
})

type APUFormValues = z.infer<typeof apuSchema>

// -------------------------------------------------------
// TIPOS
// -------------------------------------------------------

interface FormularioAPUProps {
  proyectoId: string
  /** Si se pasa `apu`, el formulario está en modo edición. */
  apu?: APU
  onConfirmar: (data: CrearAPUDTO | ActualizarAPUDTO) => void
  onCancelar: () => void
  isLoading?: boolean
}

// -------------------------------------------------------
// COMPONENTE
// -------------------------------------------------------

export function FormularioAPU({
  proyectoId,
  apu,
  onConfirmar,
  onCancelar,
  isLoading = false,
}: FormularioAPUProps) {
  const esEdicion = !!apu

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<APUFormValues>({
    resolver: zodResolver(apuSchema),
    defaultValues: {
      nombre:      apu?.nombre ?? '',
      descripcion: apu?.descripcion ?? '',
      moneda:      (apu?.moneda as typeof MONEDAS[number]) ?? 'CLP',
      estado:      apu?.estado ?? 'borrador',
    },
  })

  // Reiniciar si cambia el APU (edición de distinto APU)
  useEffect(() => {
    reset({
      nombre:      apu?.nombre ?? '',
      descripcion: apu?.descripcion ?? '',
      moneda:      (apu?.moneda as typeof MONEDAS[number]) ?? 'CLP',
      estado:      apu?.estado ?? 'borrador',
    })
  }, [apu?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const estadoActual = watch('estado')

  function onSubmit(values: APUFormValues) {
    if (esEdicion) {
      const payload: ActualizarAPUDTO = {
        nombre:      values.nombre,
        descripcion: values.descripcion || undefined,
        moneda:      values.moneda,
        estado:      values.estado,
      }
      onConfirmar(payload)
    } else {
      const payload: CrearAPUDTO = {
        proyectoId,
        nombre:      values.nombre,
        descripcion: values.descripcion || undefined,
        moneda:      values.moneda,
        estado:      values.estado,
        partidas:    [],
      }
      onConfirmar(payload)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-background border rounded-lg shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold">
              {esEdicion ? 'Editar APU' : 'Nuevo APU'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancelar}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Nombre */}
          <div className="space-y-1.5">
            <Label htmlFor="apu-nombre">
              Nombre <span className="text-destructive">*</span>
            </Label>
            <Input
              id="apu-nombre"
              {...register('nombre')}
              placeholder="Ej: APU Obras Civiles v1"
              className={cn(errors.nombre && 'border-destructive')}
            />
            {errors.nombre && (
              <p className="text-xs text-destructive">{errors.nombre.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <Label htmlFor="apu-descripcion">Descripción</Label>
            <textarea
              id="apu-descripcion"
              {...register('descripcion')}
              rows={3}
              placeholder="Descripción opcional del APU y su alcance..."
              className={cn(
                'w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                'placeholder:text-muted-foreground resize-none',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                errors.descripcion && 'border-destructive',
              )}
            />
            {errors.descripcion && (
              <p className="text-xs text-destructive">{errors.descripcion.message}</p>
            )}
          </div>

          {/* Moneda + Estado */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="apu-moneda">
                Moneda <span className="text-destructive">*</span>
              </Label>
              <select
                id="apu-moneda"
                {...register('moneda')}
                className={cn(
                  'w-full h-9 rounded-md border border-input bg-background px-3 text-sm',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                  errors.moneda && 'border-destructive',
                )}
              >
                {MONEDAS.map((m) => (
                  <option key={m} value={m}>{MONEDA_LABELS[m] ?? m}</option>
                ))}
              </select>
              {errors.moneda && (
                <p className="text-xs text-destructive">{errors.moneda.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="apu-estado">
                Estado <span className="text-destructive">*</span>
              </Label>
              <select
                id="apu-estado"
                {...register('estado')}
                className={cn(
                  'w-full h-9 rounded-md border border-input bg-background px-3 text-sm',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                  errors.estado && 'border-destructive',
                )}
              >
                {ESTADOS.map((s) => (
                  <option key={s} value={s}>{ESTADO_LABELS[s]}</option>
                ))}
              </select>
              {errors.estado && (
                <p className="text-xs text-destructive">{errors.estado.message}</p>
              )}
            </div>
          </div>

          {/* Advertencia si APU aprobado */}
          {estadoActual === 'aprobado' && (
            <div className="rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
              Un APU aprobado queda en solo lectura. Las partidas no se podrán modificar.
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2 border-t">
            <Button type="button" variant="outline" onClick={onCancelar} disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || (!isDirty && esEdicion)}
              className="min-w-28"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Crear APU'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
