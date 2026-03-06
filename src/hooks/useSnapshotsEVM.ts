// ============================================================
// HOOK: useSnapshotsEVM — Módulo 4 (Sprint M4-S01)
// Usa TanStack Query + evmService
// Subcol.: proyectos/{proyectoId}/snapshots_evm
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { evmService } from '@/services/evm.service'
import type { Tarea } from '@/types'

/** Todos los snapshots EVM de un proyecto (ASC por fecha, para gráficos) */
export function useSnapshotsEVM(proyectoId: string) {
  return useQuery({
    queryKey: ['snapshots_evm', proyectoId],
    queryFn: () => evmService.getSnapshotsEVM(proyectoId),
    enabled: !!proyectoId,
    staleTime: 10 * 60 * 1000,   // Los snapshots son semanales → baja volatilidad
  })
}

/** Últimos N snapshots EVM (más recientes, para dashboard) */
export function useUltimosSnapshotsEVM(proyectoId: string, n = 12) {
  return useQuery({
    queryKey: ['snapshots_evm', proyectoId, 'ultimos', n],
    queryFn: () => evmService.getUltimosSnapshots(proyectoId, n),
    enabled: !!proyectoId,
    staleTime: 10 * 60 * 1000,
  })
}

/** El snapshot EVM más reciente (para KPIs actuales en dashboard) */
export function useSnapshotEVMActual(proyectoId: string) {
  return useQuery({
    queryKey: ['snapshots_evm', proyectoId, 'actual'],
    queryFn: () => evmService.getSnapshotActual(proyectoId),
    enabled: !!proyectoId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * KPIs EVM calculados en tiempo real desde tareas (sin guardar snapshot).
 * Útil para mostrar valores actualizados al instante sin esperar el cron semanal.
 *
 * @param opciones.fechaFinEstimada  Fecha de fin del proyecto (del wizard M2-01).
 *   Necesaria para calcular diasRestantes correctamente.
 * @param opciones.fechaFinBaseline  Fecha de fin de la línea base activa.
 *   Necesaria para calcular desviacionDias.
 */
export function useKPIsEVMActuales(
  tareas: Tarea[] | undefined,
  bac: number,
  proyectoId: string,
  opciones?: { fechaFinEstimada?: Date; fechaFinBaseline?: Date },
) {
  return useQuery({
    queryKey: [
      'snapshots_evm',
      proyectoId,
      'kpis_live',
      bac,
      opciones?.fechaFinEstimada?.toISOString(),
      opciones?.fechaFinBaseline?.toISOString(),
    ],
    queryFn: () => {
      if (!tareas || tareas.length === 0) return null
      return evmService.calcularKPIsActuales(tareas, bac, new Date(), opciones)
    },
    enabled: !!proyectoId && !!tareas && bac > 0,
    staleTime: 60 * 1000,   // 1 minuto (cambia según avance de tareas)
  })
}

/** Crear snapshot EVM manual (con valores explícitos) */
export function useCrearSnapshotEVM() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      proyectoId,
      datos,
    }: {
      proyectoId: string
      datos: { bac: number; pv: number; ev: number; ac: number; fecha?: Date }
    }) => evmService.crearSnapshot(proyectoId, datos),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['snapshots_evm', variables.proyectoId] })
      toast.success('Snapshot EVM registrado correctamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al registrar snapshot EVM: ${error.message}`)
    },
  })
}

/** Crear snapshot EVM automáticamente desde las tareas actuales */
export function useCrearSnapshotDesdeTareas() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      proyectoId,
      tareas,
      bac,
      fecha,
    }: {
      proyectoId: string
      tareas: Tarea[]
      bac: number
      fecha?: Date
    }) => evmService.crearSnapshotDesdeTareas(proyectoId, tareas, bac, fecha),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['snapshots_evm', variables.proyectoId] })
      toast.success('Snapshot EVM capturado desde tareas actuales')
    },
    onError: (error: Error) => {
      toast.error(`Error al capturar snapshot EVM: ${error.message}`)
    },
  })
}
