// ============================================================
// HOOK: useConfiguracion — Sprint 5
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  configuracionService,
  type ActualizarConfigOrganizacionDTO,
} from '@/services/configuracion.service'

/** Configuración de la organización */
export function useConfiguracion() {
  return useQuery({
    queryKey: ['configuracion', 'organizacion'],
    queryFn: () => configuracionService.getOrganizacion(),
    staleTime: 10 * 60 * 1000, // 10 min
  })
}

/** Guardar configuración de la organización */
export function useUpdateConfiguracion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ActualizarConfigOrganizacionDTO) =>
      configuracionService.updateOrganizacion(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['configuracion'] })
      toast.success('Configuración guardada correctamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al guardar: ${error.message}`)
    },
  })
}
