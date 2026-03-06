'use client'

// ============================================================
// FormularioPartida — M5-S02
// Modal para crear/editar una partida con sus insumos.
// Flujo:
//   1. Estado local (useState) para la partida + insumos durante edición.
//   2. calcularPartidaLocal() recalcula totales en pantalla en tiempo real.
//   3. Al confirmar → useCrearPartida / useActualizarPartida → full replace APU.
// ============================================================

import { useState, useEffect, useMemo } from 'react'
import { X, Save, AlertCircle, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/lib'
import { TablaInsumos } from './TablaInsumos'
import { CatalogoInsumosBuscador } from './CatalogoInsumosBuscador'
import { cn } from '@/lib/utils'
import type { APU, Partida, Insumo, CrearPartidaDTO, ActualizarPartidaDTO, CatalogoInsumo } from '@/types'

// -------------------------------------------------------
// HELPER — cálculo en tiempo real (sin Firestore)
// -------------------------------------------------------

function calcularPartidaLocal(insumos: Insumo[], ggPct: number, utilidadPct: number): {
  costoDirecto: number
  precioUnitario: number
} {
  const costoDirecto = insumos.reduce((s, i) => s + i.cantidad * i.precioUnitario, 0)
  const precioUnitario = costoDirecto * (1 + ggPct / 100) * (1 + utilidadPct / 100)
  return {
    costoDirecto: Math.round(costoDirecto * 100) / 100,
    precioUnitario: Math.round(precioUnitario * 100) / 100,
  }
}

// -------------------------------------------------------
// TIPOS
// -------------------------------------------------------

interface FormularioPartidaProps {
  apu: APU
  /** Si se pasa `partida`, el formulario está en modo edición. Sin ella → crear. */
  partida?: Partida
  onConfirmar: (data: CrearPartidaDTO | ActualizarPartidaDTO) => void
  onCancelar: () => void
  isLoading?: boolean
}

interface FormState {
  codigo: string
  descripcion: string
  unidad: string
  ggPct: number
  utilidadPct: number
  insumos: Insumo[]
}

// -------------------------------------------------------
// COMPONENTE
// -------------------------------------------------------

export function FormularioPartida({
  apu,
  partida,
  onConfirmar,
  onCancelar,
  isLoading = false,
}: FormularioPartidaProps) {
  const esEdicion = !!partida
  const readOnly = apu.estado === 'aprobado'

  const simbolo = apu.moneda === 'USD' ? 'US$' : apu.moneda === 'PEN' ? 'S/' : '$'

  // Estado local — no persiste hasta confirmar
  const [form, setForm] = useState<FormState>({
    codigo:      partida?.codigo ?? '',
    descripcion: partida?.descripcion ?? '',
    unidad:      partida?.unidad ?? 'm²',
    ggPct:       partida?.ggPct ?? 0,
    utilidadPct: partida?.utilidadPct ?? 0,
    insumos:     partida?.insumos ?? [],
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [showCatalogoBuscador, setShowCatalogoBuscador] = useState(false)

  // Reiniciar si cambia la partida (edición de distinta partida)
  useEffect(() => {
    setForm({
      codigo:      partida?.codigo ?? '',
      descripcion: partida?.descripcion ?? '',
      unidad:      partida?.unidad ?? 'm²',
      ggPct:       partida?.ggPct ?? 0,
      utilidadPct: partida?.utilidadPct ?? 0,
      insumos:     partida?.insumos ?? [],
    })
    setErrors({})
  }, [partida?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cálculo en tiempo real
  const { costoDirecto, precioUnitario } = useMemo(
    () => calcularPartidaLocal(form.insumos, form.ggPct, form.utilidadPct),
    [form.insumos, form.ggPct, form.utilidadPct],
  )

  function handleField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.codigo.trim()) next.codigo = 'El código es obligatorio'
    if (!form.descripcion.trim()) next.descripcion = 'La descripción es obligatoria'
    if (!form.unidad.trim()) next.unidad = 'La unidad es obligatoria'
    if (form.ggPct < 0 || form.ggPct > 100) next.ggPct = 'Debe estar entre 0 y 100'
    if (form.utilidadPct < 0 || form.utilidadPct > 100) next.utilidadPct = 'Debe estar entre 0 y 100'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  /**
   * Al seleccionar un insumo del catálogo global:
   *  - crea un nuevo Insumo con los datos del catálogo (precio editable)
   *  - lo agrega al array de insumos de la partida
   *  - guarda catalogoInsumoId para trazabilidad
   */
  function handleSeleccionarDelCatalogo(catalogoInsumo: CatalogoInsumo) {
    const nuevoInsumo: Insumo = {
      id: crypto.randomUUID(),
      tipo: catalogoInsumo.tipo,
      descripcion: catalogoInsumo.descripcion,
      codigo: catalogoInsumo.codigo,
      unidad: catalogoInsumo.unidad,
      cantidad: 1,
      precioUnitario: catalogoInsumo.precioReferencia,
      subtotal: catalogoInsumo.precioReferencia,      // cantidad=1 → subtotal = precio
      catalogoInsumoId: catalogoInsumo.id,
    }
    handleField('insumos', [...form.insumos, nuevoInsumo])
    setShowCatalogoBuscador(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (readOnly || !validate()) return

    const payload: CrearPartidaDTO = {
      codigo: form.codigo.trim(),
      descripcion: form.descripcion.trim(),
      unidad: form.unidad.trim(),
      ggPct: form.ggPct,
      utilidadPct: form.utilidadPct,
      insumos: form.insumos,
    }
    onConfirmar(payload)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 overflow-y-auto py-8 px-4">
      <div className="bg-background border rounded-lg shadow-xl w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-base font-semibold">
              {esEdicion ? 'Editar partida' : 'Nueva partida'}
            </h2>
            <p className="text-sm text-muted-foreground">
              APU: <span className="font-medium">{apu.nombre}</span>
              {readOnly && <span className="ml-2 text-amber-600 text-xs">(APU aprobado — solo lectura)</span>}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancelar}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Fila: código + descripción + unidad */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_1fr] gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="prt-codigo">
                Código <span className="text-destructive">*</span>
              </Label>
              <Input
                id="prt-codigo"
                value={form.codigo}
                onChange={(e) => handleField('codigo', e.target.value)}
                placeholder="OB-001"
                disabled={readOnly}
                className={cn(errors.codigo && 'border-destructive')}
              />
              {errors.codigo && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />{errors.codigo}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prt-descripcion">
                Descripción <span className="text-destructive">*</span>
              </Label>
              <Input
                id="prt-descripcion"
                value={form.descripcion}
                onChange={(e) => handleField('descripcion', e.target.value)}
                placeholder="Ej: Excavación en terreno blando"
                disabled={readOnly}
                className={cn(errors.descripcion && 'border-destructive')}
              />
              {errors.descripcion && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />{errors.descripcion}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prt-unidad">
                Unidad <span className="text-destructive">*</span>
              </Label>
              <Input
                id="prt-unidad"
                value={form.unidad}
                onChange={(e) => handleField('unidad', e.target.value)}
                placeholder="m², kg, hr"
                disabled={readOnly}
                className={cn(errors.unidad && 'border-destructive')}
              />
              {errors.unidad && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />{errors.unidad}
                </p>
              )}
            </div>
          </div>

          {/* Fila: GG% + Utilidad% */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="prt-gg">Gastos Grales. (%)</Label>
              <Input
                id="prt-gg"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={form.ggPct}
                onChange={(e) => handleField('ggPct', parseFloat(e.target.value) || 0)}
                disabled={readOnly}
                className={cn(errors.ggPct && 'border-destructive')}
              />
              {errors.ggPct && (
                <p className="text-xs text-destructive">{errors.ggPct}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prt-util">Utilidad (%)</Label>
              <Input
                id="prt-util"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={form.utilidadPct}
                onChange={(e) => handleField('utilidadPct', parseFloat(e.target.value) || 0)}
                disabled={readOnly}
                className={cn(errors.utilidadPct && 'border-destructive')}
              />
              {errors.utilidadPct && (
                <p className="text-xs text-destructive">{errors.utilidadPct}</p>
              )}
            </div>

            {/* Preview de costos en tiempo real */}
            <div className="col-span-2 grid grid-cols-2 gap-4">
              <div className="rounded-md bg-muted/50 p-3 space-y-0.5">
                <p className="text-xs text-muted-foreground">Costo directo</p>
                <p className="text-sm font-semibold tabular-nums">
                  {simbolo} {costoDirecto.toLocaleString('es-CL')}
                </p>
              </div>
              <div className="rounded-md bg-primary/5 border border-primary/20 p-3 space-y-0.5">
                <p className="text-xs text-muted-foreground">Precio unitario</p>
                <p className="text-sm font-bold text-primary tabular-nums">
                  {simbolo} {precioUnitario.toLocaleString('es-CL')}
                </p>
                <p className="text-xs text-muted-foreground">por {form.unidad || '—'}</p>
              </div>
            </div>
          </div>

          {/* Insumos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Insumos</Label>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => setShowCatalogoBuscador(true)}
                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Buscar en catálogo
                </button>
              )}
            </div>
            <div className="border rounded-md p-3">
              <TablaInsumos
                insumos={form.insumos}
                onChange={(ins) => handleField('insumos', ins)}
                readOnly={readOnly}
                moneda={apu.moneda}
              />
            </div>
          </div>

          {/* Footer */}
          {!readOnly && (
            <div className="flex justify-end gap-3 pt-2 border-t">
              <Button type="button" variant="outline" onClick={onCancelar} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="min-w-28">
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Agregar partida'}
              </Button>
            </div>
          )}
          {readOnly && (
            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={onCancelar}>Cerrar</Button>
            </div>
          )}
        </form>
      </div>

      {/* Catálogo global de insumos — se monta sobre este modal (z-[60]) */}
      {showCatalogoBuscador && (
        <CatalogoInsumosBuscador
          onSeleccionar={handleSeleccionarDelCatalogo}
          onCerrar={() => setShowCatalogoBuscador(false)}
        />
      )}
    </div>
  )
}
