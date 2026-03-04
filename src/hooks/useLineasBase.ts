// ============================================================
// HOOK: useLineasBase — Módulo 4 (Sprint M4-S01)
// Usa TanStack Query + lineasBaseService
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { lineasBaseService } from '@/services/lineas-base.service'
import type { Tarea } from '@/types'

/** Todas las líneas base de un proyecto, más recientes primero */
export function useLineasBase(proyectoId: string) {
  return useQuery({
    queryKey: ['lineas_base', proyectoId],
    queryFn: () => lineasBaseService.getByProyectoId(proyectoId),
    enabled: !!proyectoId,
    staleTime: 5 * 60 * 1000,
  })
}

/** La línea base activa de un proyecto */
export function useLineaBaseActiva(proyectoId: string) {
  return useQuery({
    queryKey: ['lineas_base', proyectoId, 'activa'],
    queryFn: () => lineasBaseService.getActiva(proyectoId),
    enabled: !!proyectoId,
    staleTime: 5 * 60 * 1000,
  })
}

/** Línea base individual por ID */
export function useLineaBase(id: string) {
  return useQuery({
    queryKey: ['lineas_base', 'detalle', id],
    queryFn: () => lineasBaseService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

/** Capturar una nueva línea base (sin activarla) */
export function useCapturarLineaBase() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      proyectoId,
      nombre,
      tareas,
      opciones,
    }: {
      proyectoId: string
      nombre: string
      tareas: Tarea[]
      opciones?: { capturaAutomatica?: boolean; notas?: string }
    }) => lineasBaseService.create(proyectoId, nombre, tareas, opciones),
    onSuccess: (lb) => {
      qc.invalidateQueries({ queryKey: ['lineas_base', lb.proyectoId] })
      toast.success(`Línea base "${lb.nombre}" capturada correctamente`)
    },
    onError: (error: Error) => {
      toast.error(`Error al capturar línea base: ${error.message}`)
    },
  })
}

/** Capturar y activar inmediatamente una nueva línea base */
export function useCapturarYActivarLineaBase() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      proyectoId,
      nombre,
      tareas,
      opciones,
    }: {
      proyectoId: string
      nombre: string
      tareas: Tarea[]
      opciones?: { capturaAutomatica?: boolean; notas?: string }
    }) => lineasBaseService.capturarYActivar(proyectoId, nombre, tareas, opciones),
    onSuccess: (lb) => {
      qc.invalidateQueries({ queryKey: ['lineas_base', lb.proyectoId] })
      qc.invalidateQueries({ queryKey: ['lineas_base', lb.proyectoId, 'activa'] })
      toast.success(`Línea base "${lb.nombre}" activada como línea base de referencia`)
    },
    onError: (error: Error) => {
      toast.error(`Error al activar línea base: ${error.message}`)
    },
  })
}

/** Activar una línea base existente (desactiva las demás) */
export function useActivarLineaBase() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ proyectoId, lineaBaseId }: { proyectoId: string; lineaBaseId: string }) =>
      lineasBaseService.setActiva(proyectoId, lineaBaseId),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['lineas_base', variables.proyectoId] })
      qc.invalidateQueries({ queryKey: ['lineas_base', variables.proyectoId, 'activa'] })
      toast.success('Línea base activada correctamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al activar línea base: ${error.message}`)
    },
  })
}

/** Actualizar nombre/notas de una línea base */
export function useUpdateLineaBase() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      proyectoId: string
      data: { nombre?: string; notas?: string }
    }) => lineasBaseService.update(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['lineas_base', variables.proyectoId] })
      qc.invalidateQueries({ queryKey: ['lineas_base', 'detalle', variables.id] })
      toast.success('Línea base actualizada')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar línea base: ${error.message}`)
    },
  })
}
