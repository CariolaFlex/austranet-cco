'use client'

// ============================================================
// CatalogoInsumosBuscador — M5-S03
// Input de búsqueda con dropdown de resultados del catálogo global.
// Se usa en FormularioPartida para pre-rellenar un insumo desde el catálogo.
// ============================================================

import { useState, useRef, useEffect } from 'react'
import { Search, X, BookOpen, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useBuscarCatalogoInsumos } from '@/hooks/useCatalogoInsumos'
import type { CatalogoInsumo, CategoriaInsumo } from '@/types'

// ── Helpers ───────────────────────────────────────────────────────────────────

const TIPO_CONFIG: Record<CategoriaInsumo, { label: string; color: string }> = {
  material:     { label: 'Material',      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  mano_de_obra: { label: 'Mano de Obra',  color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  equipo:       { label: 'Equipo',        color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  subcontrato:  { label: 'Subcont.',      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
}

function simb(moneda: string): string {
  const map: Record<string, string> = { CLP: '$', USD: 'US$', UF: 'UF', PEN: 'S/', EUR: '€' }
  return map[moneda] ?? moneda
}

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface CatalogoInsumosBuscadorProps {
  /** Tipo de insumo para filtrar resultados (opcional). */
  filtroPorTipo?: CategoriaInsumo
  /** Callback cuando el usuario selecciona un insumo del catálogo. */
  onSeleccionar: (insumo: CatalogoInsumo) => void
  /** Callback para cerrar el buscador. */
  onCerrar: () => void
}

// ── Componente ────────────────────────────────────────────────────────────────

export function CatalogoInsumosBuscador({
  filtroPorTipo,
  onSeleccionar,
  onCerrar,
}: CatalogoInsumosBuscadorProps) {
  const [texto, setTexto] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus al montar
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const { data: resultados = [], isLoading, isFetching } = useBuscarCatalogoInsumos(
    texto,
    filtroPorTipo,
  )

  const mostrarResultados = texto.trim().length >= 2
  const sinResultados = mostrarResultados && !isLoading && resultados.length === 0

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 pt-16 px-4">
      <div className="bg-background border rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <BookOpen className="h-4 w-4 text-primary shrink-0" />
          <h3 className="text-sm font-semibold flex-1">Buscar en catálogo de insumos</h3>
          <button
            type="button"
            onClick={onCerrar}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Input de búsqueda */}
        <div className="relative px-4 pt-3 pb-2">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground mt-1.5" />
          <input
            ref={inputRef}
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Descripción, código o proveedor (mín. 2 caracteres)…"
            className="w-full h-9 rounded-md border border-input bg-background pl-8 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {(isLoading || isFetching) && (
            <Loader2 className="absolute right-7 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground mt-1.5" />
          )}
          {texto && !isLoading && (
            <button
              type="button"
              onClick={() => setTexto('')}
              className="absolute right-7 top-1/2 -translate-y-1/2 mt-1.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filtro de tipo activo */}
        {filtroPorTipo && (
          <div className="px-4 pb-1">
            <span className="text-xs text-muted-foreground">
              Filtrado por tipo:{' '}
              <span className="font-medium">{TIPO_CONFIG[filtroPorTipo]?.label}</span>
            </span>
          </div>
        )}

        {/* Resultados */}
        <div className="max-h-72 overflow-y-auto">
          {!mostrarResultados && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Escribe al menos 2 caracteres para buscar
            </div>
          )}

          {sinResultados && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No se encontraron insumos con &quot;{texto}&quot;
            </div>
          )}

          {mostrarResultados && resultados.length > 0 && (
            <ul className="py-1">
              {resultados.map((insumo) => {
                const tipoCfg = TIPO_CONFIG[insumo.tipo]
                return (
                  <li key={insumo.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSeleccionar(insumo)
                        onCerrar()
                      }}
                      className={cn(
                        'w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors',
                        'flex items-start gap-3 border-b border-border/50 last:border-0',
                      )}
                    >
                      {/* Tipo badge */}
                      <span className={cn(
                        'shrink-0 mt-0.5 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium',
                        tipoCfg?.color,
                      )}>
                        {tipoCfg?.label ?? insumo.tipo}
                      </span>

                      {/* Descripción + código */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{insumo.descripcion}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground font-mono">{insumo.codigo}</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">{insumo.unidad}</span>
                          {insumo.proveedor && (
                            <>
                              <span className="text-xs text-muted-foreground">·</span>
                              <span className="text-xs text-muted-foreground truncate">{insumo.proveedor}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Precio referencial */}
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold tabular-nums text-primary">
                          {simb(insumo.moneda)}{' '}
                          {insumo.precioReferencia.toLocaleString('es-CL', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">{insumo.moneda} / {insumo.unidad}</p>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t bg-muted/30">
          <p className="text-xs text-muted-foreground">
            El precio pre-rellenado es referencial y puede editarse libremente.
          </p>
        </div>
      </div>
    </div>
  )
}
