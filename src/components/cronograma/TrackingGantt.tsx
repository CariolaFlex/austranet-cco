'use client'

/**
 * TrackingGantt — M4 · Sprint M4-S03 + M4-S07 (useMemo + responsive)
 * Gantt de seguimiento: muestra tareas actuales + tareas de línea base (gris).
 * Requiere una línea base activa en el proyecto.
 */

import dynamic from 'next/dynamic'
import { useState, useMemo, memo } from 'react'
import { ViewMode } from 'gantt-task-react'
import 'gantt-task-react/dist/index.css'
import { AlertCircle } from 'lucide-react'
import { GanttToolbar } from './GanttToolbar'
import { useTareasGantt, useBaselineGanttTasks } from './hooks/useTareasGantt'
import { useTareas } from '@/hooks/useTareas'
import { useLineaBaseActiva } from '@/hooks/useLineasBase'
import type { EstadoTarea } from '@/types'

// Dynamic import SSR:false
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

interface TrackingGanttProps {
  proyectoId: string
  altura?: number
}

// -------------------------------------------------------
// COMPONENTE
// -------------------------------------------------------

export const TrackingGantt = memo(function TrackingGantt({
  proyectoId,
  altura = 450,
}: TrackingGanttProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Week)
  const [mostrarCPM, setMostrarCPM] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState<EstadoTarea | 'todas'>('todas')

  const { data: tareas = [], isLoading: loadingTareas } = useTareas(proyectoId)
  const { data: lineaBase, isLoading: loadingLB } = useLineaBaseActiva(proyectoId)

  const tareasFiltradas = useMemo(
    () => (filtroEstado === 'todas' ? tareas : tareas.filter((t) => t.estado === filtroEstado)),
    [tareas, filtroEstado],
  )

  const tareasParaGantt = useMemo(
    () =>
      mostrarCPM
        ? tareasFiltradas
        : tareasFiltradas.map((t) => ({ ...t, esCritica: false })),
    [tareasFiltradas, mostrarCPM],
  )

  const ganttTasks = useTareasGantt(tareasParaGantt)
  const baselineTasks = useBaselineGanttTasks(lineaBase?.snapshotTareas ?? [])
  const tareasCriticas = useMemo(() => tareas.filter((t) => t.esCritica).length, [tareas])

  const isLoading = loadingTareas || loadingLB

  // Intercalar: baseline gris al inicio, actuales coloreadas encima
  const allTasks = useMemo(
    () => [...baselineTasks, ...ganttTasks],
    [baselineTasks, ganttTasks],
  )

  if (isLoading) {
    return <div className="h-64 animate-pulse bg-muted rounded-md" />
  }

  if (!ganttTasks.length) {
    return (
      <div className="h-40 flex flex-col items-center justify-center text-center gap-2">
        <p className="text-sm text-muted-foreground">No hay tareas para mostrar.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {!lineaBase && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          No hay línea base activa para este proyecto. Las barras de referencia no se mostrarán.
        </div>
      )}

      <div className="flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-6 rounded-sm bg-blue-500" />
          Plan actual
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-6 rounded-sm bg-slate-400" />
          Línea base
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-6 rounded-sm bg-red-500" />
          Ruta crítica
        </span>
      </div>

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

      {/* Responsive: overflowX + minWidth permite scroll horizontal en pantallas pequeñas */}
      <div style={{ height: altura, overflowX: 'auto' }}>
        <div style={{ minWidth: 800 }}>
          <GanttLib
            tasks={allTasks}
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
    </div>
  )
})
