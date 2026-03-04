'use client'

/**
 * EVMChart — M4
 * Gráfico EVM con curvas PV, EV, AC y línea de proyección EAC.
 * Usa Recharts ComposedChart. Acepta snapshots reales o datos mock.
 */

import {
  ComposedChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChartContainer } from '@/components/common/ChartContainer'
import { EVM_LABELS } from '@/constants/evm'
import type { SnapshotEVM } from '@/types'

// -------------------------------------------------------
// DATOS MOCK para previsualización sin datos reales
// -------------------------------------------------------

function generarMock(): SnapshotEVM[] {
  const base = new Date('2026-01-05') // Lunes
  const bac = 500000
  return Array.from({ length: 8 }, (_, i) => {
    const fecha = new Date(base)
    fecha.setDate(fecha.getDate() + i * 7)
    const pv = Math.round(bac * (i + 1) / 12)
    const ev = Math.round(pv * (0.85 + Math.random() * 0.1))
    const ac = Math.round(ev * (1.05 + Math.random() * 0.08))
    const cpi = ev / ac
    return {
      id: fecha.toISOString().slice(0, 10),
      fecha,
      bac,
      pv,
      ev,
      ac,
      spi: ev / pv,
      cpi,
      sv: ev - pv,
      cv: ev - ac,
      eac: Math.round(bac / cpi),
      etc: Math.round(bac / cpi - ac),
      tcpi: (bac - ev) / (bac - ac),
      semaforoSPI: 'amarillo',
      semaforoCPI: 'amarillo',
      creadoEn: new Date(),
    } as SnapshotEVM
  })
}

// -------------------------------------------------------
// HELPERS
// -------------------------------------------------------

function formatMonto(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`
  return `$${v}`
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL
// -------------------------------------------------------

interface EVMChartProps {
  snapshots?: SnapshotEVM[]
  bac?: number
  fechaHoy?: Date
  mostrarPV?: boolean
  mostrarEV?: boolean
  mostrarAC?: boolean
  mostrarEAC?: boolean
  altura?: number
  className?: string
  isLoading?: boolean
}

export function EVMChart({
  snapshots,
  bac,
  fechaHoy = new Date(),
  mostrarPV = true,
  mostrarEV = true,
  mostrarAC = true,
  mostrarEAC = true,
  altura = 320,
  className,
  isLoading = false,
}: EVMChartProps) {
  const datos = snapshots && snapshots.length > 0 ? snapshots : generarMock()
  const esMock = !snapshots || snapshots.length === 0

  const chartData = datos.map((s) => ({
    fecha: format(new Date(s.fecha), 'd MMM', { locale: es }),
    PV: mostrarPV ? s.pv : undefined,
    EV: mostrarEV ? s.ev : undefined,
    AC: mostrarAC ? s.ac : undefined,
    EAC: mostrarEAC ? s.eac : undefined,
  }))

  const bacValue = bac ?? datos[datos.length - 1]?.bac

  return (
    <ChartContainer
      title="Análisis de Valor Ganado (EVM)"
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
        <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={formatMonto} tick={{ fontSize: 11 }} width={60} />
          <Tooltip
            formatter={(value: number, name: string) => [formatMonto(value), name]}
            contentStyle={{ fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />

          {/* Línea BAC de referencia */}
          {bacValue && (
            <ReferenceLine
              y={bacValue}
              label={{ value: 'BAC', position: 'right', fontSize: 11 }}
              stroke={EVM_LABELS.BAC.color}
              strokeDasharray="6 3"
            />
          )}

          {/* Línea "hoy" */}
          <ReferenceLine
            x={format(fechaHoy, 'd MMM', { locale: es })}
            stroke="#94a3b8"
            strokeDasharray="4 2"
            label={{ value: 'Hoy', position: 'top', fontSize: 10 }}
          />

          {mostrarPV && (
            <Line
              type="monotone"
              dataKey="PV"
              name={EVM_LABELS.PV.nombre}
              stroke={EVM_LABELS.PV.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          )}
          {mostrarEV && (
            <Line
              type="monotone"
              dataKey="EV"
              name={EVM_LABELS.EV.nombre}
              stroke={EVM_LABELS.EV.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          )}
          {mostrarAC && (
            <Line
              type="monotone"
              dataKey="AC"
              name={EVM_LABELS.AC.nombre}
              stroke={EVM_LABELS.AC.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          )}
          {mostrarEAC && (
            <Line
              type="monotone"
              dataKey="EAC"
              name={EVM_LABELS.EAC.nombre}
              stroke={EVM_LABELS.EAC.color}
              strokeWidth={1.5}
              strokeDasharray="5 3"
              dot={false}
              activeDot={{ r: 4 }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
