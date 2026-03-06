'use client'

// ============================================================
// APUResumenCostos — M5-S02
// Tarjeta de resumen de costos totales de un APU.
// Muestra: costo directo, GG estimado, utilidad estimada, total.
// ============================================================

import { TrendingUp, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib'
import { cn } from '@/lib/utils'
import type { APU } from '@/types'

// -------------------------------------------------------
// HELPERS
// -------------------------------------------------------

function simb(moneda: string) {
  if (moneda === 'USD') return 'US$'
  if (moneda === 'PEN') return 'S/'
  return '$'
}

function fmt(n: number): string {
  return n.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

// -------------------------------------------------------
// TIPOS
// -------------------------------------------------------

interface APUResumenCostosProps {
  apu: APU
  className?: string
}

// -------------------------------------------------------
// COMPONENTE
// -------------------------------------------------------

export function APUResumenCostos({ apu, className }: APUResumenCostosProps) {
  const s = simb(apu.moneda)

  // Totales calculados desde las partidas
  const totalCostoDirecto = apu.partidas.reduce((sum, p) => sum + p.costoDirecto, 0)
  const totalPrecioUnitario = apu.partidas.reduce((sum, p) => sum + p.precioUnitario, 0)
  const totalGG = totalPrecioUnitario - totalCostoDirecto > 0
    ? totalPrecioUnitario - totalCostoDirecto
    : 0

  // GG% promedio ponderado (informativo)
  const ggProm = apu.partidas.length > 0
    ? apu.partidas.reduce((s, p) => s + p.ggPct, 0) / apu.partidas.length
    : 0
  const utilProm = apu.partidas.length > 0
    ? apu.partidas.reduce((s, p) => s + p.utilidadPct, 0) / apu.partidas.length
    : 0

  const items = [
    {
      label: 'Costo directo',
      value: `${s} ${fmt(totalCostoDirecto)}`,
      sub: 'Σ insumos',
      highlight: false,
    },
    {
      label: 'GG + Utilidad est.',
      value: `${s} ${fmt(totalGG)}`,
      sub: `GG prom. ${ggProm.toFixed(1)}% · Util. prom. ${utilProm.toFixed(1)}%`,
      highlight: false,
    },
    {
      label: 'Total APU',
      value: `${s} ${fmt(totalPrecioUnitario)}`,
      sub: `${apu.partidas.length} partida${apu.partidas.length !== 1 ? 's' : ''}`,
      highlight: true,
    },
  ]

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Resumen de costos — {apu.moneda}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.label}
              className={cn(
                'rounded-md p-4 space-y-1',
                item.highlight
                  ? 'bg-primary/5 border border-primary/20'
                  : 'bg-muted/40',
              )}
            >
              <div className="flex items-center gap-1.5">
                {item.highlight && <DollarSign className="h-3.5 w-3.5 text-primary" />}
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
              <p className={cn('text-lg font-bold tabular-nums', item.highlight && 'text-primary')}>
                {item.value}
              </p>
              <p className="text-xs text-muted-foreground">{item.sub}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
