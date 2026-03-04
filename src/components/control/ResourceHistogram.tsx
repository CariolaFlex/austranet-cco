'use client'

/**
 * ResourceHistogram — M4
 * Histograma de recursos por período.
 * Detecta sobreasignación (barra roja cuando supera capacidad máxima).
 * Usa Recharts BarChart con ReferenceLine para el límite.
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import { ChartContainer } from '@/components/common/ChartContainer'
import type { Tarea } from '@/types'

// -------------------------------------------------------
// TIPOS
// -------------------------------------------------------

interface RecursoHistograma {
  periodo: string          // "Semana 1", "Mar 2026", etc.
  horas: number            // Total horas asignadas
  personas?: number        // Personas únicas en el período
}

// -------------------------------------------------------
// DATOS MOCK
// -------------------------------------------------------

function generarMock(): RecursoHistograma[] {
  const semanas = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8']
  return semanas.map((sem, i) => ({
    periodo: sem,
    horas: 20 + Math.round(Math.random() * 60) + (i === 3 || i === 5 ? 40 : 0),
    personas: 2 + Math.floor(Math.random() * 4),
  }))
}

/**
 * Calcula el histograma de horas desde tareas reales.
 * Agrupa por semana: distribuye horas totales de cada tarea
 * uniformemente entre su fecha inicio y fin.
 */
function calcularHistogramaDesdeTareas(tareas: Tarea[]): RecursoHistograma[] {
  const semanas = new Map<string, { horas: number; personas: Set<string> }>()

  for (const tarea of tareas) {
    const inicio = new Date(tarea.fechaInicioPlaneada)
    const fin = new Date(tarea.fechaFinPlaneada)
    const durSemanas = Math.max(1, Math.ceil((fin.getTime() - inicio.getTime()) / (7 * 24 * 3600 * 1000)))

    for (const asig of tarea.asignaciones) {
      const horasPorSemana = (asig.horasPorDia ?? 8) * 5  // 5 días hábiles
      const cur = new Date(inicio)
      for (let s = 0; s < durSemanas; s++) {
        const key = cur.toISOString().slice(0, 10)
        if (!semanas.has(key)) semanas.set(key, { horas: 0, personas: new Set() })
        const entry = semanas.get(key)!
        entry.horas += horasPorSemana
        if (asig.emailOId) entry.personas.add(asig.emailOId)
        cur.setDate(cur.getDate() + 7)
      }
    }
  }

  return Array.from(semanas.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, v]) => ({
      periodo: key.slice(5),    // MM-DD
      horas: v.horas,
      personas: v.personas.size,
    }))
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL
// -------------------------------------------------------

interface ResourceHistogramProps {
  tareas?: Tarea[]
  /** Capacidad máxima de horas por semana (para ReferenceLine). Default 80 (2 personas × 40h) */
  capacidadMaximaHoras?: number
  altura?: number
  className?: string
  isLoading?: boolean
}

export function ResourceHistogram({
  tareas,
  capacidadMaximaHoras = 80,
  altura = 300,
  className,
  isLoading = false,
}: ResourceHistogramProps) {
  const tieneAsignaciones = tareas && tareas.some((t) => t.asignaciones.length > 0)
  const esMock = !tieneAsignaciones

  const chartData = esMock
    ? generarMock()
    : calcularHistogramaDesdeTareas(tareas!)

  return (
    <ChartContainer
      title="Histograma de Recursos (Horas/Semana)"
      height={altura}
      isLoading={isLoading}
      isEmpty={chartData.length === 0}
      emptyMessage="No hay asignaciones de recursos registradas."
      className={className}
      actions={
        esMock ? (
          <span className="text-xs text-muted-foreground italic">datos de muestra</span>
        ) : undefined
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} width={40} unit="h" />
          <Tooltip
            formatter={(value: number) => [`${value}h`, 'Horas']}
            contentStyle={{ fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />

          {/* Límite de capacidad */}
          <ReferenceLine
            y={capacidadMaximaHoras}
            stroke="#ef4444"
            strokeDasharray="5 3"
            label={{ value: `Límite ${capacidadMaximaHoras}h`, position: 'right', fontSize: 10, fill: '#ef4444' }}
          />

          <Bar dataKey="horas" name="Horas asignadas" radius={[3, 3, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.horas > capacidadMaximaHoras ? '#ef4444' : '#3b82f6'}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
