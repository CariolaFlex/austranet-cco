'use client'

// ============================================================
// TablaInsumos — M5-S02
// Tabla editable inline de insumos dentro de una partida.
// Opera 100% en estado local (useState) — sin Firestore.
// El padre (FormularioPartida) persiste al confirmar la partida completa.
// ============================================================

import { useState } from 'react'
import { Plus, Trash2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/lib'
import { cn } from '@/lib/utils'
import type { Insumo, CategoriaInsumo } from '@/types'

// -------------------------------------------------------
// HELPERS
// -------------------------------------------------------

const CATEGORIA_LABELS: Record<CategoriaInsumo, string> = {
  material:     'Material',
  mano_de_obra: 'Mano de obra',
  equipo:       'Equipo',
  subcontrato:  'Subcontrato',
}

const CATEGORIAS: CategoriaInsumo[] = ['material', 'mano_de_obra', 'equipo', 'subcontrato']

function calcSubtotal(cantidad: number, precioUnitario: number): number {
  return Math.round((cantidad * precioUnitario) * 100) / 100
}

function insumoVacio(): Insumo {
  return {
    id: crypto.randomUUID(),
    tipo: 'material',
    descripcion: '',
    unidad: 'un',
    cantidad: 1,
    precioUnitario: 0,
    subtotal: 0,
  }
}

// -------------------------------------------------------
// TIPOS
// -------------------------------------------------------

interface TablaInsumosProps {
  insumos: Insumo[]
  onChange: (insumos: Insumo[]) => void
  readOnly?: boolean
  moneda?: string
}

// -------------------------------------------------------
// COMPONENTE
// -------------------------------------------------------

export function TablaInsumos({ insumos, onChange, readOnly = false, moneda = 'CLP' }: TablaInsumosProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const simbolo = moneda === 'USD' ? 'US$' : moneda === 'PEN' ? 'S/' : '$'

  function handleAdd() {
    const nuevo = insumoVacio()
    onChange([...insumos, nuevo])
    setEditingId(nuevo.id)
  }

  function handleDelete(id: string) {
    onChange(insumos.filter((i) => i.id !== id))
    if (editingId === id) setEditingId(null)
  }

  function handleChange(id: string, field: keyof Insumo, value: string | number) {
    onChange(
      insumos.map((i) => {
        if (i.id !== id) return i
        const updated = { ...i, [field]: value }
        updated.subtotal = calcSubtotal(
          Number(updated.cantidad),
          Number(updated.precioUnitario),
        )
        return updated
      }),
    )
  }

  const costoDirecto = insumos.reduce((s, i) => s + i.subtotal, 0)

  if (insumos.length === 0 && readOnly) {
    return (
      <p className="text-sm text-muted-foreground italic py-2">Sin insumos registrados.</p>
    )
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_auto] gap-2 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        <span>Descripción</span>
        <span>Tipo</span>
        <span>Unidad</span>
        <span>Cant.</span>
        <span>P. Unitario</span>
        <span>Subtotal</span>
      </div>

      {/* Filas */}
      <div className="space-y-1">
        {insumos.map((insumo) => {
          const isEditing = !readOnly && editingId === insumo.id
          return (
            <div
              key={insumo.id}
              className={cn(
                'grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1.5fr_auto] gap-2 items-center rounded-md p-2 text-sm transition-colors',
                isEditing ? 'bg-muted/60 ring-1 ring-primary/20' : 'hover:bg-muted/30',
              )}
              onClick={() => { if (!readOnly) setEditingId(insumo.id) }}
            >
              {/* Descripción */}
              {isEditing ? (
                <Input
                  value={insumo.descripcion}
                  onChange={(e) => handleChange(insumo.id, 'descripcion', e.target.value)}
                  placeholder="Ej: Hormigón H25"
                  className="h-7 text-sm"
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              ) : (
                <span className={cn('truncate', !insumo.descripcion && 'text-muted-foreground italic')}>
                  {insumo.descripcion || 'Sin descripción'}
                </span>
              )}

              {/* Tipo */}
              {isEditing ? (
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={insumo.tipo}
                    onChange={(e) => handleChange(insumo.id, 'tipo', e.target.value as CategoriaInsumo)}
                    className="w-full h-7 text-sm rounded-md border border-input bg-background px-2 pr-7 appearance-none"
                  >
                    {CATEGORIAS.map((c) => (
                      <option key={c} value={c}>{CATEGORIA_LABELS[c]}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                </div>
              ) : (
                <span className="text-muted-foreground text-xs">{CATEGORIA_LABELS[insumo.tipo]}</span>
              )}

              {/* Unidad */}
              {isEditing ? (
                <Input
                  value={insumo.unidad}
                  onChange={(e) => handleChange(insumo.id, 'unidad', e.target.value)}
                  placeholder="m², kg, hr"
                  className="h-7 text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="text-muted-foreground text-xs">{insumo.unidad}</span>
              )}

              {/* Cantidad */}
              {isEditing ? (
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={insumo.cantidad}
                  onChange={(e) => handleChange(insumo.id, 'cantidad', parseFloat(e.target.value) || 0)}
                  className="h-7 text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="tabular-nums text-right">{insumo.cantidad}</span>
              )}

              {/* Precio Unitario */}
              {isEditing ? (
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{simbolo}</span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={insumo.precioUnitario}
                    onChange={(e) => handleChange(insumo.id, 'precioUnitario', parseFloat(e.target.value) || 0)}
                    className="h-7 text-sm pl-7"
                  />
                </div>
              ) : (
                <span className="tabular-nums text-right text-xs text-muted-foreground">
                  {simbolo} {insumo.precioUnitario.toLocaleString('es-CL')}
                </span>
              )}

              {/* Subtotal + Acciones */}
              <div className="flex items-center justify-between gap-2">
                <span className="tabular-nums font-medium text-right flex-1">
                  {simbolo} {insumo.subtotal.toLocaleString('es-CL')}
                </span>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDelete(insumo.id) }}
                    className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                    title="Eliminar insumo"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer: total + botón agregar */}
      <div className="flex items-center justify-between pt-2 border-t">
        {!readOnly && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="h-7 text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Agregar insumo
          </Button>
        )}
        <div className={cn('flex items-center gap-2 text-sm font-semibold', readOnly && 'ml-auto')}>
          <span className="text-muted-foreground font-normal">Costo directo:</span>
          <span className="text-foreground">
            {simbolo} {costoDirecto.toLocaleString('es-CL')}
          </span>
        </div>
      </div>
    </div>
  )
}
