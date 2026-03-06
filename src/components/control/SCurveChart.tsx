'use client'

/**
 * SCurveChart — M4
 * Curvas "S" acumulativas: Planificado vs Real.
 * Usa Recharts AreaChart con Brush para zoom temporal.
 */

import { memo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChartContainer } from '@/components/common/ChartContainer'
import { EVM_LABELS } from '@/constants/evm'
import type { SnapshotEVM } from '@/types'

// -------------------------------------------------------
// DATOS MOCK
// -------------------------------------------------------

function generarMock() {
  const base = new Date('2026-01-05')
  const bac = 500000
  return Array.from({ length: 10 }, (_, i) => {
    const fecha = new Date(base)
    fecha.setDate(fecha.getDate() + i * 7)
    const pv = Math.round(bac * Math.pow((i + 1) / 10, 1.5) * 0.95)  // forma S
    const ac = Math.round(pv * (0.88 + Math.random() * 0.15))
    return {
      fecha: format(fecha, 'd MMM', { locale: es }),
      Planificado: pv,
      Real: ac,
    }
  })
}

// -------------------------------------------------------
// HELPERS
// -------------------------------------------------------

function formatPct(v: number, bac: number) {
  if (bac <= 0) return `$${v}`
  return `${((v / bac) * 100).toFixed(1)}%`
}

function formatMonto(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`
  return `$${v}`
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL
// -------------------------------------------------------

interface SCurveChartProps {
  snapshots?: SnapshotEVM[]
  bac?: number
  altura?: number
  className?: string
  isLoading?: boolean
  /** Si true, muestra eje Y como porcentaje del BAC */
  mostrarPorcentaje?: boolean
}

export const SCurveChart = memo(function SCurveChart({
  snapshots,
  bac = 0,
  altura = 320,
  className,
  isLoading = false,
  mostrarPorcentaje = false,
}: SCurveChartProps) {
  const esMock = !snapshots || snapshots.length === 0

  const chartData = esMock
    ? generarMock()
    : snapshots.map((s) => ({
        fecha: format(new Date(s.fecha), 'd MMM', { locale: es }),
        Planificado: s.pv,
        Real: s.ac,
      }))

  const bacValue = bac || (snapshots?.[snapshots.length - 1]?.bac ?? 0)
  const yFormatter = mostrarPorcentaje && bacValue > 0
    ? (v: number) => formatPct(v, bacValue)
    : formatMonto

  return (
    <ChartContainer
      title='Curvas "S" — Acumulado Planificado vs. Real'
      height={altura}
      isLoading={isLoading}
      isEmpty={false}
      className={className}
      actions={
        esMock ? (
          <span className="text-xs text-muted-foreground italic">datos de muestra</span>
        ) : undefined
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="colorPV" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={EVM_LABELS.PV.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={EVM_LABELS.PV.color} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorAC" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={EVM_LABELS.AC.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={EVM_LABELS.AC.color} stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={yFormatter} tick={{ fontSize: 11 }} width={60} />
          <Tooltip
            formatter={(value: number, name: string) => [formatMonto(value), name]}
            contentStyle={{ fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Brush dataKey="fecha" height={20} stroke="#94a3b8" travellerWidth={8} />

          <Area
            type="monotone"
            dataKey="Planificado"
            stroke={EVM_LABELS.PV.color}
            strokeWidth={2}
            fill="url(#colorPV)"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Area
            type="monotone"
            dataKey="Real"
            stroke={EVM_LABELS.AC.color}
            strokeWidth={2}
            fill="url(#colorAC)"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
})
