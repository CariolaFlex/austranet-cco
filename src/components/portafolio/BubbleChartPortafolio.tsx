'use client'

/**
 * BubbleChartPortafolio — M4
 * Visualización de portafolio como burbujas: Eje X = Riesgo/SPI,
 * Eje Y = ROI/CPI, Tamaño = Presupuesto/Equipo.
 * Usa Recharts ScatterChart con shape personalizado.
 */

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from 'recharts'
import { ChartContainer } from '@/components/common/ChartContainer'
import { SEMAFORO_COLOR } from '@/constants/evm'
import type { ProyectoConKPIs } from '@/types'

// -------------------------------------------------------
// TIPOS
// -------------------------------------------------------

type EjeX = 'riesgo' | 'spi' | 'desviacionDias'
type EjeY = 'roi' | 'cpi' | 'pctAvance'
type Tamano = 'presupuesto' | 'uniform'

// -------------------------------------------------------
// HELPERS
// -------------------------------------------------------

const EJE_LABELS: Record<EjeX | EjeY, string> = {
  riesgo: 'Nivel de Riesgo',
  spi: 'SPI (Cronograma)',
  desviacionDias: 'Desviación (días)',
  roi: 'ROI (%)',
  cpi: 'CPI (Costos)',
  pctAvance: '% Avance',
}

/** Convierte nivel de riesgo cualitativo a número 0-4 */
const RIESGO_NUM: Record<string, number> = {
  bajo: 1, medio: 2, alto: 3, critico: 4,
}

function getValorX(p: ProyectoConKPIs, ejeX: EjeX): number {
  const k = p.kpisDashboard
  switch (ejeX) {
    case 'riesgo': return RIESGO_NUM[p.criticidad] ?? 2
    case 'spi': return k.spi
    case 'desviacionDias': return k.desviacionDias
  }
}

function getValorY(p: ProyectoConKPIs, ejeY: EjeY): number {
  const k = p.kpisDashboard
  switch (ejeY) {
    case 'roi': return k.roi ?? 0
    case 'cpi': return k.cpi
    case 'pctAvance': return k.pctAvancePonderado
  }
}

function getSize(p: ProyectoConKPIs, tamano: Tamano): number {
  if (tamano === 'uniform') return 400
  const budget = p.bac ?? p.presupuestoEstimado ?? 0
  // Escalar entre 100 y 2000 en proporción logarítmica
  if (budget <= 0) return 200
  return Math.min(2000, Math.max(100, Math.log10(budget) * 200))
}

// -------------------------------------------------------
// DATOS MOCK
// -------------------------------------------------------

function generarMock() {
  const nombres = ['Proyecto Alpha', 'Proyecto Beta', 'Proyecto Gamma', 'Proyecto Delta', 'Proyecto Epsilon']
  return nombres.map((nombre, i) => ({
    x: 1 + Math.random() * 3,
    y: 5 + Math.random() * 90,
    z: 200 + Math.random() * 1800,
    nombre,
    semaforo: (['verde', 'amarillo', 'rojo'] as const)[i % 3],
  }))
}

// -------------------------------------------------------
// TOOLTIP CUSTOM
// -------------------------------------------------------

interface TooltipPayload {
  payload?: { nombre?: string; x: number; y: number }
}

function CustomTooltip({ active, payload, ejeX, ejeY }: {
  active?: boolean
  payload?: TooltipPayload[]
  ejeX: EjeX
  ejeY: EjeY
}) {
  if (!active || !payload?.[0]?.payload) return null
  const d = payload[0].payload
  return (
    <div className="bg-background border rounded-lg shadow-md p-3 text-sm max-w-48">
      <p className="font-semibold mb-1">{d.nombre ?? 'Proyecto'}</p>
      <p className="text-muted-foreground">{EJE_LABELS[ejeX]}: <strong>{d.x?.toFixed(2)}</strong></p>
      <p className="text-muted-foreground">{EJE_LABELS[ejeY]}: <strong>{d.y?.toFixed(1)}</strong></p>
    </div>
  )
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL
// -------------------------------------------------------

interface BubbleChartPortafolioProps {
  proyectos?: ProyectoConKPIs[]
  ejeX?: EjeX
  ejeY?: EjeY
  tamano?: Tamano
  onProyectoClick?: (proyectoId: string) => void
  altura?: number
  className?: string
  isLoading?: boolean
}

export function BubbleChartPortafolio({
  proyectos,
  ejeX = 'riesgo',
  ejeY = 'cpi',
  tamano = 'presupuesto',
  altura = 320,
  className,
  isLoading = false,
}: BubbleChartPortafolioProps) {
  const esMock = !proyectos || proyectos.length === 0

  const chartData = esMock
    ? generarMock()
    : proyectos.map((p) => ({
        x: getValorX(p, ejeX),
        y: getValorY(p, ejeY),
        z: getSize(p, tamano),
        nombre: p.nombre,
        semaforo: p.kpisDashboard.semaforoGeneral,
        id: p.id,
      }))

  // Agrupar por semáforo para colorear series
  const verdes = chartData.filter((d) => d.semaforo === 'verde')
  const amarillos = chartData.filter((d) => d.semaforo === 'amarillo')
  const rojos = chartData.filter((d) => d.semaforo === 'rojo')
  const sinDatos = chartData.filter((d) => !['verde', 'amarillo', 'rojo'].includes(d.semaforo ?? ''))

  const colorVerde = SEMAFORO_COLOR.verde.text.split(' ')[0].replace('text-', '#').replace('green-700', '15803d')
  void colorVerde

  return (
    <ChartContainer
      title="Portafolio de Proyectos"
      height={altura}
      isLoading={isLoading}
      isEmpty={chartData.length === 0}
      emptyMessage="No hay proyectos con KPIs calculados."
      className={className}
      actions={
        esMock ? (
          <span className="text-xs text-muted-foreground italic">datos de muestra</span>
        ) : undefined
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            type="number"
            dataKey="x"
            name={EJE_LABELS[ejeX]}
            tick={{ fontSize: 11 }}
            label={{ value: EJE_LABELS[ejeX], position: 'insideBottom', offset: -5, fontSize: 11 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={EJE_LABELS[ejeY]}
            tick={{ fontSize: 11 }}
            width={45}
            label={{ value: EJE_LABELS[ejeY], angle: -90, position: 'insideLeft', fontSize: 11 }}
          />
          <ZAxis type="number" dataKey="z" range={[80, 800]} />
          <Tooltip
            content={<CustomTooltip ejeX={ejeX} ejeY={ejeY} />}
            cursor={{ strokeDasharray: '3 3' }}
          />

          {verdes.length > 0 && (
            <Scatter name="Verde" data={verdes} fill="#22c55e" fillOpacity={0.7} />
          )}
          {amarillos.length > 0 && (
            <Scatter name="Amarillo" data={amarillos} fill="#eab308" fillOpacity={0.7} />
          )}
          {rojos.length > 0 && (
            <Scatter name="Rojo" data={rojos} fill="#ef4444" fillOpacity={0.7} />
          )}
          {sinDatos.length > 0 && (
            <Scatter name="Sin datos" data={sinDatos} fill="#94a3b8" fillOpacity={0.6} />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
