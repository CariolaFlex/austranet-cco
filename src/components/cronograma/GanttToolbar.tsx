'use client'

/**
 * GanttToolbar — M4 · Sprint M4-S03
 * Barra de controles para el Gantt: zoom, toggle CPM, filtro de estado.
 */

import { ViewMode } from 'gantt-task-react'
import { ZoomIn, ZoomOut, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { EstadoTarea } from '@/types'

// -------------------------------------------------------
// TIPOS
// -------------------------------------------------------

interface GanttToolbarProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  mostrarCPM: boolean
  onToggleCPM: () => void
  filtroEstado: EstadoTarea | 'todas'
  onFiltroEstadoChange: (estado: EstadoTarea | 'todas') => void
  totalTareas: number
  tareasCriticas: number
}

// -------------------------------------------------------
// OPCIONES
// -------------------------------------------------------

const ZOOM_OPTIONS: { label: string; value: ViewMode }[] = [
  { label: 'Día',      value: ViewMode.Day },
  { label: 'Semana',   value: ViewMode.Week },
  { label: 'Mes',      value: ViewMode.Month },
]

const ESTADO_OPTIONS: { label: string; value: EstadoTarea | 'todas' }[] = [
  { label: 'Todas',        value: 'todas' },
  { label: 'Pendientes',   value: 'pendiente' },
  { label: 'En progreso',  value: 'en_progreso' },
  { label: 'Completadas',  value: 'completada' },
]

// -------------------------------------------------------
// COMPONENTE
// -------------------------------------------------------

export function GanttToolbar({
  viewMode,
  onViewModeChange,
  mostrarCPM,
  onToggleCPM,
  filtroEstado,
  onFiltroEstadoChange,
  totalTareas,
  tareasCriticas,
}: GanttToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 pb-3 border-b">
      {/* Zoom */}
      <div className="flex items-center gap-1">
        <ZoomOut className="h-4 w-4 text-muted-foreground" />
        <div className="flex rounded-md border overflow-hidden">
          {ZOOM_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onViewModeChange(opt.value)}
              className={cn(
                'px-3 py-1 text-xs font-medium transition-colors',
                viewMode === opt.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:bg-muted',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <ZoomIn className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Filtro de estado */}
      <div className="flex rounded-md border overflow-hidden">
        {ESTADO_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onFiltroEstadoChange(opt.value)}
            className={cn(
              'px-3 py-1 text-xs font-medium transition-colors',
              filtroEstado === opt.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-muted-foreground hover:bg-muted',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Toggle CPM */}
      <Button
        variant={mostrarCPM ? 'default' : 'outline'}
        size="sm"
        onClick={onToggleCPM}
        className="h-7 text-xs gap-1.5"
      >
        {mostrarCPM ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        Ruta Crítica
      </Button>

      {/* Estadísticas */}
      <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline" className="font-normal text-xs">
          {totalTareas} tareas
        </Badge>
        {tareasCriticas > 0 && (
          <Badge className="bg-red-500/10 text-red-600 border-red-200 font-normal text-xs">
            {tareasCriticas} críticas
          </Badge>
        )}
      </div>
    </div>
  )
}
