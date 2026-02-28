// ============================================================
// HOOK: useConfiguracionSistema — T-06
// Acceso a la configuración del sistema con TanStack Query.
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { configuracionService } from '@/services/configuracion.service'
import type { ConfiguracionSistema } from '@/types'

const QK = ['configuracion', 'sistema'] as const

/** Obtiene la configuración del sistema */
export function useConfiguracionSistema() {
  return useQuery({
    queryKey: QK,
    queryFn: () => configuracionService.getSistema(),
    staleTime: 5 * 60 * 1000,
  })
}

/** Actualiza parcialmente la configuración del sistema */
export function useUpdateConfiguracionSistema() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      campos,
      modificadoPor,
    }: {
      campos: Partial<ConfiguracionSistema>
      modificadoPor: string
    }) => configuracionService.updateSistema(campos, modificadoPor),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK })
      toast.success('Configuración del sistema guardada')
    },
    onError: (error: Error) => {
      toast.error(`Error al guardar: ${error.message}`)
    },
  })
}
