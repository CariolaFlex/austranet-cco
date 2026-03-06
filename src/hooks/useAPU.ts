// ============================================================
// HOOK: useAPU — Módulo 5 (Sprint M5-S01)
// Usa TanStack Query + apuService
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apuService } from '@/services/apu.service'
import { tareasService } from '@/services/tareas.service'
import type {
  CrearAPUDTO,
  ActualizarAPUDTO,
  CrearPartidaDTO,
  ActualizarPartidaDTO,
  Partida,
  Insumo,
  EstadoAPU,
} from '@/types'

// ---- QUERIES ----

/** Todos los APUs de un proyecto */
export function useAPUs(proyectoId: string) {
  return useQuery({
    queryKey: ['apus', proyectoId],
    queryFn: () => apuService.getByProyectoId(proyectoId),
    enabled: !!proyectoId,
    staleTime: 5 * 60 * 1000,
  })
}

/** APU individual por ID */
export function useAPU(apuId: string) {
  return useQuery({
    queryKey: ['apus', 'detalle', apuId],
    queryFn: () => apuService.getById(apuId),
    enabled: !!apuId,
    staleTime: 5 * 60 * 1000,
  })
}

/** APUs de un proyecto filtrados por estado */
export function useAPUsPorEstado(proyectoId: string, estado: EstadoAPU) {
  return useQuery({
    queryKey: ['apus', proyectoId, 'estado', estado],
    queryFn: () => apuService.getByEstado(proyectoId, estado),
    enabled: !!proyectoId,
    staleTime: 5 * 60 * 1000,
  })
}

// ---- MUTATIONS: APU ----

/** Crear APU */
export function useCreateAPU() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CrearAPUDTO) => apuService.create(data),
    onSuccess: (apu) => {
      qc.invalidateQueries({ queryKey: ['apus', apu.proyectoId] })
      toast.success(`APU "${apu.nombre}" creado correctamente`)
    },
    onError: (error: Error) => {
      toast.error(`Error al crear APU: ${error.message}`)
    },
  })
}

/** Actualizar campos del APU (nombre, descripcion, moneda, estado) */
export function useUpdateAPU() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      proyectoId: string
      data: ActualizarAPUDTO
    }) => apuService.update(id, data),
    onSuccess: (apu, variables) => {
      qc.invalidateQueries({ queryKey: ['apus', variables.proyectoId] })
      qc.invalidateQueries({ queryKey: ['apus', 'detalle', variables.id] })
      toast.success('APU actualizado correctamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar APU: ${error.message}`)
    },
  })
}

/** Aprobar APU (estado borrador/revision → aprobado, incrementa version) */
export function useAprobarAPU() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string; proyectoId: string }) => apuService.aprobar(id),
    onSuccess: (apu, variables) => {
      qc.invalidateQueries({ queryKey: ['apus', variables.proyectoId] })
      qc.invalidateQueries({ queryKey: ['apus', 'detalle', variables.id] })
      toast.success(`APU aprobado. Versión ${apu.version}`)
    },
    onError: (error: Error) => {
      toast.error(`Error al aprobar APU: ${error.message}`)
    },
  })
}

/** Eliminar APU (solo estado 'borrador') */
export function useDeleteAPU() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string; proyectoId: string }) => apuService.delete(id),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['apus', variables.proyectoId] })
      toast.success('APU eliminado correctamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar APU: ${error.message}`)
    },
  })
}

// ---- MUTATIONS: PARTIDAS ----

/** Crear partida en un APU */
export function useCrearPartida() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      apuId,
      data,
      partidasActuales,
    }: {
      apuId: string
      proyectoId: string
      data: CrearPartidaDTO
      partidasActuales: Partida[]
    }) => apuService.crearPartida(apuId, data, partidasActuales),
    onSuccess: (apu, variables) => {
      qc.invalidateQueries({ queryKey: ['apus', variables.proyectoId] })
      qc.invalidateQueries({ queryKey: ['apus', 'detalle', variables.apuId] })
      toast.success('Partida agregada correctamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al crear partida: ${error.message}`)
    },
  })
}

/** Actualizar partida en un APU */
export function useActualizarPartida() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      apuId,
      partidaId,
      data,
      partidasActuales,
    }: {
      apuId: string
      proyectoId: string
      partidaId: string
      data: ActualizarPartidaDTO
      partidasActuales: Partida[]
    }) => apuService.actualizarPartida(apuId, partidaId, data, partidasActuales),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['apus', variables.proyectoId] })
      qc.invalidateQueries({ queryKey: ['apus', 'detalle', variables.apuId] })
      toast.success('Partida actualizada correctamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar partida: ${error.message}`)
    },
  })
}

/** Eliminar partida de un APU */
export function useEliminarPartida() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      apuId,
      partidaId,
      partidasActuales,
    }: {
      apuId: string
      proyectoId: string
      partidaId: string
      partidasActuales: Partida[]
    }) => apuService.eliminarPartida(apuId, partidaId, partidasActuales),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['apus', variables.proyectoId] })
      qc.invalidateQueries({ queryKey: ['apus', 'detalle', variables.apuId] })
      toast.success('Partida eliminada correctamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar partida: ${error.message}`)
    },
  })
}

/** Reordenar partidas de un APU */
export function useReordenarPartidas() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      apuId,
      ordenIds,
      partidasActuales,
    }: {
      apuId: string
      proyectoId: string
      ordenIds: string[]
      partidasActuales: Partida[]
    }) => apuService.reordenarPartidas(apuId, ordenIds, partidasActuales),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['apus', variables.proyectoId] })
      qc.invalidateQueries({ queryKey: ['apus', 'detalle', variables.apuId] })
    },
    onError: (error: Error) => {
      toast.error(`Error al reordenar partidas: ${error.message}`)
    },
  })
}

// ---- MUTATIONS: INSUMOS ----

/** Crear insumo en una partida de un APU */
export function useCrearInsumo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      apuId,
      partidaId,
      insumo,
      partidasActuales,
    }: {
      apuId: string
      proyectoId: string
      partidaId: string
      insumo: Omit<Insumo, 'id' | 'subtotal'>
      partidasActuales: Partida[]
    }) => apuService.crearInsumo(apuId, partidaId, insumo, partidasActuales),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['apus', variables.proyectoId] })
      qc.invalidateQueries({ queryKey: ['apus', 'detalle', variables.apuId] })
      toast.success('Insumo agregado correctamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al crear insumo: ${error.message}`)
    },
  })
}

/** Actualizar insumo en una partida de un APU */
export function useActualizarInsumo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      apuId,
      partidaId,
      insumoId,
      data,
      partidasActuales,
    }: {
      apuId: string
      proyectoId: string
      partidaId: string
      insumoId: string
      data: Partial<Omit<Insumo, 'id' | 'subtotal'>>
      partidasActuales: Partida[]
    }) => apuService.actualizarInsumo(apuId, partidaId, insumoId, data, partidasActuales),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['apus', variables.proyectoId] })
      qc.invalidateQueries({ queryKey: ['apus', 'detalle', variables.apuId] })
      toast.success('Insumo actualizado correctamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar insumo: ${error.message}`)
    },
  })
}

/** Eliminar insumo de una partida de un APU */
export function useEliminarInsumo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      apuId,
      partidaId,
      insumoId,
      partidasActuales,
    }: {
      apuId: string
      proyectoId: string
      partidaId: string
      insumoId: string
      partidasActuales: Partida[]
    }) => apuService.eliminarInsumo(apuId, partidaId, insumoId, partidasActuales),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['apus', variables.proyectoId] })
      qc.invalidateQueries({ queryKey: ['apus', 'detalle', variables.apuId] })
      toast.success('Insumo eliminado correctamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar insumo: ${error.message}`)
    },
  })
}

// ---- MUTATIONS: VINCULACIÓN TAREA ↔ APU ----

/**
 * Vincula una tarea a una partida del APU.
 * Actualiza costoPlaneado de la tarea = partida.precioUnitario × cantidad.
 */
export function useVincularAPUTarea() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      tareaId,
      apuId,
      partida,
      cantidad,
    }: {
      tareaId: string
      proyectoId: string
      apuId: string
      partida: Partida
      cantidad: number
    }) => tareasService.vincularAPU(tareaId, apuId, partida, cantidad),
    onSuccess: (tarea, variables) => {
      qc.invalidateQueries({ queryKey: ['tareas', variables.proyectoId] })
      qc.invalidateQueries({ queryKey: ['tareas', 'detalle', variables.tareaId] })
      toast.success(
        `Tarea vinculada a APU. Costo planeado actualizado: $${tarea.costoPlaneado.toLocaleString('es-CL')}`
      )
    },
    onError: (error: Error) => {
      toast.error(`Error al vincular APU a tarea: ${error.message}`)
    },
  })
}

/** Desvincula una tarea de su APU (limpia campos FK, preserva costoPlaneado). */
export function useDesvincularAPUTarea() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ tareaId }: { tareaId: string; proyectoId: string }) =>
      tareasService.desvincularAPU(tareaId),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['tareas', variables.proyectoId] })
      qc.invalidateQueries({ queryKey: ['tareas', 'detalle', variables.tareaId] })
      toast.success('Tarea desvinculada del APU')
    },
    onError: (error: Error) => {
      toast.error(`Error al desvincular APU: ${error.message}`)
    },
  })
}
