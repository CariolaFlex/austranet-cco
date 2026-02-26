// ============================================================
// HOOK: useProyectos — Módulo 2 (Sprint 3A)
// Usa TanStack Query + proyectosService
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { proyectosService } from '@/services/proyectos.service'
import type {
  FiltrosProyecto,
  CrearProyectoDTO,
  ActualizarProyectoDTO,
  EstadoProyecto,
  LeccionesAprendidas,
  CausaCancelacion,
} from '@/types'

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

/** Cambiar estado de un riesgo del proyecto (M2-03 §6) */
export function useUpdateRiesgoEstado() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      proyectoId,
      riesgoId,
      nuevoEstado,
      justificacion,
    }: {
      proyectoId: string
      riesgoId: string
      nuevoEstado: 'activo' | 'mitigado' | 'materializado' | 'cerrado'
      justificacion: string
    }) => proyectosService.updateRiesgoEstado(proyectoId, riesgoId, nuevoEstado, justificacion),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['proyectos', variables.proyectoId] })
      qc.invalidateQueries({ queryKey: ['proyectos', variables.proyectoId, 'historial'] })
      toast.success('Estado del riesgo actualizado correctamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar el riesgo: ${error.message}`)
    },
  })
}

/** Cerrar proyecto como completado con lecciones aprendidas (M2-04 §9.1 + §9.3) */
export function useCerrarProyecto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      proyectoId,
      entidadId,
      lecciones,
    }: {
      proyectoId: string
      entidadId: string
      lecciones: LeccionesAprendidas
    }) => proyectosService.cerrar(proyectoId, entidadId, lecciones),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['proyectos'] })
      qc.invalidateQueries({ queryKey: ['proyectos', variables.proyectoId] })
      qc.invalidateQueries({ queryKey: ['proyectos', variables.proyectoId, 'historial'] })
      qc.invalidateQueries({ queryKey: ['entidades'] })
      toast.success('Proyecto cerrado correctamente. Lecciones aprendidas registradas.')
    },
    onError: (error: Error) => {
      toast.error(`Error al cerrar el proyecto: ${error.message}`)
    },
  })
}

/** Cancelar proyecto con causa tipificada (M2-04 §9.2) */
export function useCancelarProyecto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      proyectoId,
      entidadId,
      causa,
      detalle,
    }: {
      proyectoId: string
      entidadId: string
      causa: CausaCancelacion
      detalle: string
    }) => proyectosService.cancelar(proyectoId, entidadId, causa, detalle),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['proyectos'] })
      qc.invalidateQueries({ queryKey: ['proyectos', variables.proyectoId] })
      qc.invalidateQueries({ queryKey: ['proyectos', variables.proyectoId, 'historial'] })
      qc.invalidateQueries({ queryKey: ['entidades'] })
      toast.success('Proyecto cancelado. El nivel de riesgo de la entidad ha sido actualizado.')
    },
    onError: (error: Error) => {
      toast.error(`Error al cancelar el proyecto: ${error.message}`)
    },
  })
}

/** Estadísticas rápidas de proyectos para el dashboard */
export function useProyectosStats() {
  return useQuery({
    queryKey: ['proyectos', 'stats'],
    queryFn: () => proyectosService.getStats(),
    staleTime: 5 * 60 * 1000,
  })
}
