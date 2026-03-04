/**
 * useTareasGantt — M4 · Sprint M4-S03
 * Transforma Tarea[] → Task[] de gantt-task-react.
 * Aplica estilos según esCritica y tipo de tarea.
 */

import { useMemo } from 'react'
import type { Task } from 'gantt-task-react'
import type { Tarea } from '@/types'

// Paleta de colores para el Gantt
const COLORES = {
  critica:    { bg: '#ef4444', selected: '#dc2626', progress: '#b91c1c', progressSelected: '#991b1b' },
  fase:       { bg: '#6366f1', selected: '#4f46e5', progress: '#4338ca', progressSelected: '#3730a3' },
  tarea:      { bg: '#3b82f6', selected: '#2563eb', progress: '#1d4ed8', progressSelected: '#1e40af' },
  hito:       { bg: '#f59e0b', selected: '#d97706', progress: '#b45309', progressSelected: '#92400e' },
  completada: { bg: '#22c55e', selected: '#16a34a', progress: '#15803d', progressSelected: '#166534' },
} as const

function getEstiloTarea(tarea: Tarea) {
  if (tarea.esCritica) return COLORES.critica
  if (tarea.estado === 'completada') return COLORES.completada
  if (tarea.tipo === 'fase' || tarea.tipo === 'resumen') return COLORES.fase
  if (tarea.tipo === 'hito_gantt') return COLORES.hito
  return COLORES.tarea
}

function tareaToGanttTask(tarea: Tarea): Task {
  const colores = getEstiloTarea(tarea)

  return {
    id: tarea.id,
    name: `${tarea.wbsCode} ${tarea.nombre}`,
    start: new Date(tarea.fechaInicioPlaneada),
    end: new Date(tarea.fechaFinPlaneada),
    progress: tarea.porcentajeAvance,
    type:
      tarea.tipo === 'hito_gantt'
        ? 'milestone'
        : tarea.tipo === 'fase' || tarea.tipo === 'resumen'
        ? 'project'
        : 'task',
    project: tarea.tareaResumenId ?? undefined,
    dependencies: tarea.dependencias.map((d) => d.tareaIdPredecesora),
    isDisabled: tarea.estado === 'suspendida',
    styles: {
      backgroundColor:         colores.bg,
      backgroundSelectedColor: colores.selected,
      progressColor:           colores.progress,
      progressSelectedColor:   colores.progressSelected,
    },
  }
}

/**
 * Convierte un array de Tareas al formato Task[] que consume `gantt-task-react`.
 * Mantiene el orden por `orden` y coloca las tareas hijas después de su padre.
 */
export function useTareasGantt(tareas: Tarea[]): Task[] {
  return useMemo(() => {
    if (!tareas.length) return []

    // Ordenar: primero por orden ascendente
    const sorted = [...tareas].sort((a, b) => a.orden - b.orden)

    return sorted.map(tareaToGanttTask)
  }, [tareas])
}

/**
 * Versión que genera tasks de "línea base" para TrackingGantt.
 * Las tareas de baseline se muestran como gris semi-transparente.
 */
export function useBaselineGanttTasks(snapshotTareas: Array<{
  tareaId: string
  nombre: string
  wbsCode: string
  fechaInicioPlaneada: Date | string
  fechaFinPlaneada: Date | string
  duracionDias: number
  esCritica: boolean
  holguraTotal: number
}>): Task[] {
  return useMemo(() => {
    return snapshotTareas.map((t) => ({
      id:       `baseline_${t.tareaId}`,
      name:     `[LB] ${t.wbsCode} ${t.nombre}`,
      start:    new Date(t.fechaInicioPlaneada),
      end:      new Date(t.fechaFinPlaneada),
      progress: 0,
      type:     'task' as const,
      isDisabled: true,
      styles: {
        backgroundColor:         '#94a3b8',
        backgroundSelectedColor: '#94a3b8',
        progressColor:           '#64748b',
        progressSelectedColor:   '#64748b',
      },
    }))
  }, [snapshotTareas])
}
