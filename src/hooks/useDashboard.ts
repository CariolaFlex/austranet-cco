// ============================================================
// HOOK: useDashboard — T-05
// Configuración personal del dashboard por usuario.
// Patrón TanStack Query.
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { dashboardService } from '@/services/dashboard.service'
import type { ConfigDashboard } from '@/types'

/** Configuración del dashboard de un usuario */
export function useDashboardConfig(uid: string) {
  return useQuery({
    queryKey: ['dashboard_config', uid],
    queryFn: () => dashboardService.getConfig(uid),
    enabled: !!uid,
    staleTime: 10 * 60 * 1000,
  })
}

/** Guardar configuración personalizada del dashboard */
export function useGuardarDashboardConfig() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      uid,
      config,
    }: {
      uid: string
      config: Pick<ConfigDashboard, 'widgetsOcultos' | 'ordenPersonalizado'>
    }) => dashboardService.saveConfig(uid, config),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['dashboard_config', variables.uid] })
      toast.success('Preferencias del dashboard guardadas')
    },
    onError: (error: Error) => {
      toast.error(`Error al guardar preferencias: ${error.message}`)
    },
  })
}

/** Resetear configuración del dashboard a los defaults */
export function useResetDashboardConfig() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (uid: string) => dashboardService.resetConfig(uid),
    onSuccess: (_, uid) => {
      qc.invalidateQueries({ queryKey: ['dashboard_config', uid] })
      toast.success('Dashboard restaurado a la configuración por defecto')
    },
    onError: (error: Error) => {
      toast.error(`Error al restaurar el dashboard: ${error.message}`)
    },
  })
}
