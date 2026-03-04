'use client'

/**
 * RiskMatrixHeatmap — M4
 * Matriz de Riesgos: Heatmap 5×5 de Probabilidad × Impacto.
 * Refactorizada desde la lógica inline de TabRiesgos en ProyectoDetalle.
 * Reutilizable en modo proyecto individual o modo portafolio.
 */

import { cn } from '@/lib/utils'
import type { RiesgoProyecto } from '@/types'

// -------------------------------------------------------
// CONSTANTES DE MATRIZ 5×5
// -------------------------------------------------------

type NivelRiesgo = 'bajo' | 'medio' | 'alto' | 'critico'

const PROBABILIDADES = ['muy_baja', 'baja', 'media', 'alta', 'muy_alta'] as const
const IMPACTOS = ['muy_bajo', 'bajo', 'medio', 'alto', 'muy_alto'] as const

const NIVEL_RIESGO_MATRIX: Record<string, Record<string, NivelRiesgo>> = {
  muy_baja: { muy_bajo: 'bajo', bajo: 'bajo', medio: 'bajo', alto: 'medio', muy_alto: 'medio' },
  baja:     { muy_bajo: 'bajo', bajo: 'bajo', medio: 'medio', alto: 'medio', muy_alto: 'alto' },
  media:    { muy_bajo: 'bajo', bajo: 'medio', medio: 'medio', alto: 'alto', muy_alto: 'alto' },
  alta:     { muy_bajo: 'medio', bajo: 'medio', medio: 'alto', alto: 'alto', muy_alto: 'critico' },
  muy_alta: { muy_bajo: 'medio', bajo: 'alto', medio: 'alto', alto: 'critico', muy_alto: 'critico' },
}

const NIVEL_STYLES: Record<NivelRiesgo, { bg: string; text: string; border: string; label: string }> = {
  bajo:    { bg: 'bg-green-100 dark:bg-green-900/30',   text: 'text-green-700 dark:text-green-300',   border: 'border-green-200', label: 'Bajo' },
  medio:   { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-200', label: 'Medio' },
  alto:    { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200', label: 'Alto' },
  critico: { bg: 'bg-red-100 dark:bg-red-900/30',       text: 'text-red-700 dark:text-red-300',       border: 'border-red-200',    label: 'Crítico' },
}

const LABEL_PROB: Record<string, string> = {
  muy_baja: 'Muy baja', baja: 'Baja', media: 'Media', alta: 'Alta', muy_alta: 'Muy alta',
}
const LABEL_IMP: Record<string, string> = {
  muy_bajo: 'Muy bajo', bajo: 'Bajo', medio: 'Medio', alto: 'Alto', muy_alto: 'Muy alto',
}

function calcNivel(prob: string, imp: string): NivelRiesgo {
  return NIVEL_RIESGO_MATRIX[prob]?.[imp] ?? 'medio'
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL
// -------------------------------------------------------

interface RiskMatrixHeatmapProps {
  riesgos: RiesgoProyecto[]
  /** Solo mostrar riesgos activos (filtrar cerrados/mitigados). Default true. */
  soloActivos?: boolean
  /** Callback al hacer clic en un riesgo del heatmap */
  onRiesgoClick?: (riesgo: RiesgoProyecto) => void
  /** 'proyecto' = riesgos de un proyecto. 'portafolio' = multi-proyecto. */
  modo?: 'proyecto' | 'portafolio'
  className?: string
}

export function RiskMatrixHeatmap({
  riesgos,
  soloActivos = true,
  onRiesgoClick,
  modo = 'proyecto',
  className,
}: RiskMatrixHeatmapProps) {
  const riesgosFiltrados = soloActivos
    ? riesgos.filter((r) => r.estado !== 'cerrado' && r.estado !== 'mitigado')
    : riesgos

  // Mapeo: (prob, imp) → lista de riesgos en esa celda
  const celdaMap = new Map<string, RiesgoProyecto[]>()
  for (const r of riesgosFiltrados) {
    const key = `${r.probabilidad}__${r.impacto}`
    if (!celdaMap.has(key)) celdaMap.set(key, [])
    celdaMap.get(key)!.push(r)
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Título modo portafolio */}
      {modo === 'portafolio' && (
        <p className="text-xs text-muted-foreground mb-2">
          {riesgosFiltrados.length} riesgos activos en el portafolio
        </p>
      )}

      <div className="overflow-x-auto">
        <div className="min-w-[420px]">
          {/* Header: Impacto (columnas) */}
          <div className="flex">
            {/* Celda vacía esquina */}
            <div className="w-20 shrink-0" />
            {IMPACTOS.map((imp) => (
              <div
                key={imp}
                className="flex-1 text-center text-xs font-semibold text-muted-foreground py-1 px-0.5"
              >
                {LABEL_IMP[imp]}
              </div>
            ))}
          </div>

          {/* Filas: Probabilidad */}
          {[...PROBABILIDADES].reverse().map((prob) => (
            <div key={prob} className="flex items-stretch">
              {/* Etiqueta probabilidad */}
              <div className="w-20 shrink-0 flex items-center justify-end pr-2">
                <span className="text-xs font-semibold text-muted-foreground text-right leading-tight">
                  {LABEL_PROB[prob]}
                </span>
              </div>

              {/* Celdas de impacto */}
              {IMPACTOS.map((imp) => {
                const nivel = calcNivel(prob, imp)
                const style = NIVEL_STYLES[nivel]
                const riesgosEnCelda = celdaMap.get(`${prob}__${imp}`) ?? []

                return (
                  <div
                    key={imp}
                    className={cn(
                      'flex-1 border min-h-[52px] m-0.5 rounded flex flex-col items-center justify-center gap-1 p-1 transition-opacity',
                      style.bg,
                      style.border,
                      riesgosEnCelda.length > 0 && onRiesgoClick ? 'cursor-pointer hover:opacity-80' : '',
                    )}
                    onClick={() => {
                      if (riesgosEnCelda.length > 0 && onRiesgoClick) {
                        onRiesgoClick(riesgosEnCelda[0])
                      }
                    }}
                  >
                    {riesgosEnCelda.length > 0 ? (
                      <>
                        <span
                          className={cn(
                            'text-lg font-bold leading-none',
                            style.text,
                          )}
                        >
                          {riesgosEnCelda.length}
                        </span>
                        <span className={cn('text-[10px] font-medium', style.text)}>
                          {riesgosEnCelda.length === 1 ? 'riesgo' : 'riesgos'}
                        </span>
                      </>
                    ) : (
                      <span className={cn('text-[10px] opacity-40', style.text)}>
                        {style.label}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}

          {/* Etiqueta eje X */}
          <div className="flex mt-1">
            <div className="w-20 shrink-0" />
            <div className="flex-1 text-center text-xs text-muted-foreground font-semibold py-1">
              ← Impacto →
            </div>
          </div>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-2 mt-3">
        {(Object.entries(NIVEL_STYLES) as [NivelRiesgo, typeof NIVEL_STYLES[NivelRiesgo]][]).map(
          ([nivel, style]) => (
            <div key={nivel} className="flex items-center gap-1">
              <div className={cn('h-3 w-3 rounded border', style.bg, style.border)} />
              <span className="text-xs text-muted-foreground">{style.label}</span>
            </div>
          ),
        )}
      </div>

      {/* Sin riesgos */}
      {riesgosFiltrados.length === 0 && (
        <p className="text-sm text-muted-foreground text-center mt-4">
          No hay riesgos activos para mostrar.
        </p>
      )}
    </div>
  )
}
