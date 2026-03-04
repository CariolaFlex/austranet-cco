// ============================================================
// HOOK: useTareas — Módulo 4 (Sprint M4-S01)
// Usa TanStack Query + tareasService
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { tareasService } from '@/services/tareas.service'
import type { CrearTareaDTO, ActualizarTareaDTO, EstadoTarea } from '@/types'

/** Todas las tareas de un proyecto, ordenadas por `orden` */
export function useTareas(proyectoId: string) {
  return useQuery({
    queryKey: ['tareas', proyectoId],
    queryFn: () => tareasService.getByProyectoId(proyectoId),
    enabled: !!proyectoId,
    staleTime: 2 * 60 * 1000,
  })
}

/** Tarea individual por ID */
export function useTarea(id: string) {
  return useQuery({
    queryKey: ['tareas', 'detalle', id],
    queryFn: () => tareasService.getById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  })
}

/** Solo tareas de la ruta crítica de un proyecto */
export function useTareasCriticas(proyectoId: string) {
  return useQuery({
    queryKey: ['tareas', proyectoId, 'criticas'],
    queryFn: () => tareasService.getCriticas(proyectoId),
    enabled: !!proyectoId,
    staleTime: 2 * 60 * 1000,
  })
}

/** Tareas filtradas por estado */
export function useTareasPorEstado(proyectoId: string, estado: EstadoTarea) {
  return useQuery({
    queryKey: ['tareas', proyectoId, 'estado', estado],
    queryFn: () => tareasService.getByEstado(proyectoId, estado),
    enabled: !!proyectoId,
    staleTime: 2 * 60 * 1000,
  })
}

/** Crear tarea */
export function useCreateTarea() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CrearTareaDTO) => tareasService.create(data),
    onSuccess: (tarea) => {
      qc.invalidateQueries({ queryKey: ['tareas', tarea.proyectoId] })
      toast.success(`Tarea "${tarea.nombre}" creada correctamente`)
    },
    onError: (error: Error) => {
      toast.error(`Error al crear la tarea: ${error.message}`)
    },
  })
}

/** Actualizar tarea */
export function useUpdateTarea() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; proyectoId: string; data: ActualizarTareaDTO }) =>
      tareasService.update(id, data),
    onSuccess: (tarea, variables) => {
      qc.invalidateQueries({ queryKey: ['tareas', variables.proyectoId] })
      qc.invalidateQueries({ queryKey: ['tareas', 'detalle', variables.id] })
      toast.success('Tarea actualizada correctamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar la tarea: ${error.message}`)
    },
  })
}

/** Actualizar avance (porcentaje + estado) */
export function useUpdateAvanceTarea() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      porcentajeAvance,
      estado,
    }: {
      id: string
      proyectoId: string
      porcentajeAvance: number
      estado?: EstadoTarea
    }) => tareasService.updateAvance(id, porcentajeAvance, estado),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['tareas', variables.proyectoId] })
      qc.invalidateQueries({ queryKey: ['tareas', 'detalle', variables.id] })
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar avance: ${error.message}`)
    },
  })
}

/** Eliminar tarea (soft delete → estado 'suspendida') */
export function useDeleteTarea() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string; proyectoId: string }) => tareasService.delete(id),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['tareas', variables.proyectoId] })
      toast.success('Tarea eliminada correctamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar la tarea: ${error.message}`)
    },
  })
}

/** Reordenar tareas de un proyecto */
export function useReordenarTareas() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ proyectoId, ordenIds }: { proyectoId: string; ordenIds: string[] }) =>
      tareasService.reordenar(proyectoId, ordenIds),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['tareas', variables.proyectoId] })
    },
    onError: (error: Error) => {
      toast.error(`Error al reordenar tareas: ${error.message}`)
    },
  })
}
