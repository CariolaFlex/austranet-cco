'use client'

/**
 * GanttChart — M4 · Sprint M4-S03
 * Gantt estándar usando gantt-task-react (dynamic import SSR:false).
 * Muestra tareas de un proyecto con resaltado de ruta crítica.
 */

import dynamic from 'next/dynamic'
import { useState, useMemo } from 'react'
import { ViewMode } from 'gantt-task-react'
import 'gantt-task-react/dist/index.css'
import { GanttToolbar } from './GanttToolbar'
import { useTareasGantt } from './hooks/useTareasGantt'
import { useTareas } from '@/hooks/useTareas'
import type { EstadoTarea } from '@/types'

// Dynamic import para evitar SSR (gantt-task-react no es SSR-compatible)
const GanttLib = dynamic(
  () => import('gantt-task-react').then((m) => ({ default: m.Gantt })),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
        Cargando Gantt...
      </div>
    ),
  },
)

// -------------------------------------------------------
// TIPOS
// -------------------------------------------------------

interface GanttChartProps {
  proyectoId: string
  /** Altura del área del Gantt en px. Default 450. */
  altura?: number
}

// -------------------------------------------------------
// COMPONENTE
// -------------------------------------------------------

export function GanttChart({ proyectoId, altura = 450 }: GanttChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Week)
  const [mostrarCPM, setMostrarCPM] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState<EstadoTarea | 'todas'>('todas')

  const { data: tareas = [], isLoading } = useTareas(proyectoId)

  // Filtrar por estado si corresponde
  const tareasFiltradas = useMemo(
    () => (filtroEstado === 'todas' ? tareas : tareas.filter((t) => t.estado === filtroEstado)),
    [tareas, filtroEstado],
  )

  // Cuando mostrarCPM es false, limpiar el flag esCritica visualmente
  const tareasParaGantt = useMemo(
    () =>
      mostrarCPM
        ? tareasFiltradas
        : tareasFiltradas.map((t) => ({ ...t, esCritica: false })),
    [tareasFiltradas, mostrarCPM],
  )

  const ganttTasks = useTareasGantt(tareasParaGantt)
  const tareasCriticas = tareas.filter((t) => t.esCritica).length

  if (isLoading) {
    return (
      <div className="h-64 animate-pulse bg-muted rounded-md" />
    )
  }

  if (!ganttTasks.length) {
    return (
      <div className="h-40 flex flex-col items-center justify-center text-center gap-2">
        <p className="text-sm text-muted-foreground">
          No hay tareas para mostrar en el cronograma.
        </p>
        <p className="text-xs text-muted-foreground">
          Crea tareas con fechas de inicio y fin para visualizar el Gantt.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <GanttToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        mostrarCPM={mostrarCPM}
        onToggleCPM={() => setMostrarCPM((v) => !v)}
        filtroEstado={filtroEstado}
        onFiltroEstadoChange={setFiltroEstado}
        totalTareas={tareasFiltradas.length}
        tareasCriticas={tareasCriticas}
      />

      <div style={{ height: altura, overflowX: 'auto' }}>
        <GanttLib
          tasks={ganttTasks}
          viewMode={viewMode}
          locale="es"
          ganttHeight={altura}
          listCellWidth="200px"
          columnWidth={viewMode === ViewMode.Day ? 40 : viewMode === ViewMode.Week ? 100 : 200}
          todayColor="rgba(59,130,246,0.1)"
          barCornerRadius={3}
          barFill={75}
        />
      </div>
    </div>
  )
}
