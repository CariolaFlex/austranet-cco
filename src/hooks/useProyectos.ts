// ============================================================
// HOOK: useProyectos — Módulo 2 (Sprint 3A)
// Usa TanStack Query + proyectosService
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { proyectosService } from '@/services/proyectos.service'
import type { FiltrosProyecto, CrearProyectoDTO, ActualizarProyectoDTO, EstadoProyecto } from '@/types'

/** Lista de proyectos con filtros opcionales */
export function useProyectos(filtros?: FiltrosProyecto) {
  return useQuery({
    queryKey: ['proyectos', filtros],
    queryFn: () => proyectosService.getAll(filtros),
    staleTime: 5 * 60 * 1000,
  })
}

/** Proyecto individual por ID */
export function useProyecto(id: string) {
  return useQuery({
    queryKey: ['proyectos', id],
    queryFn: () => proyectosService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

/** Proyectos de una entidad cliente */
export function useProyectosPorCliente(clienteId: string) {
  return useQuery({
    queryKey: ['proyectos', 'cliente', clienteId],
    queryFn: () => proyectosService.getByClienteId(clienteId),
    enabled: !!clienteId,
    staleTime: 5 * 60 * 1000,
  })
}

/** Historial de un proyecto */
export function useProyectoHistorial(proyectoId: string) {
  return useQuery({
    queryKey: ['proyectos', proyectoId, 'historial'],
    queryFn: () => proyectosService.getHistorial(proyectoId),
    enabled: !!proyectoId,
  })
}

/** Crear proyecto */
export function useCreateProyecto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, activar = false }: { data: CrearProyectoDTO; activar?: boolean }) =>
      proyectosService.create(data, activar),
    onSuccess: (proyecto) => {
      qc.invalidateQueries({ queryKey: ['proyectos'] })
      toast.success(`Proyecto "${proyecto.nombre}" creado correctamente`)
    },
    onError: (error: Error) => {
      toast.error(`Error al crear el proyecto: ${error.message}`)
    },
  })
}

/** Actualizar proyecto */
export function useUpdateProyecto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ActualizarProyectoDTO }) =>
      proyectosService.update(id, data),
    onSuccess: (proyecto) => {
      qc.invalidateQueries({ queryKey: ['proyectos'] })
      qc.invalidateQueries({ queryKey: ['proyectos', proyecto.id] })
      toast.success('Proyecto actualizado correctamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar: ${error.message}`)
    },
  })
}

/** Cambiar estado del proyecto */
export function useUpdateEstadoProyecto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, estado, motivo }: { id: string; estado: EstadoProyecto; motivo: string }) =>
      proyectosService.updateEstado(id, estado, motivo),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['proyectos'] })
      qc.invalidateQueries({ queryKey: ['proyectos', variables.id] })
      qc.invalidateQueries({ queryKey: ['proyectos', variables.id, 'historial'] })
      toast.success('Estado actualizado correctamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al cambiar estado: ${error.message}`)
    },
  })
}

/** Cancelar proyecto (soft delete) */
export function useDeleteProyecto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => proyectosService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proyectos'] })
      toast.success('Proyecto cancelado correctamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al cancelar: ${error.message}`)
    },
  })
}
