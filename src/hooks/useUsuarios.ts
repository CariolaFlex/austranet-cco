// ============================================================
// HOOK: useUsuarios — T-01
// Gestión de usuarios del sistema (solo admin/superadmin).
// Patrón TanStack Query como useEntidades.ts
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usuariosService } from '@/services/usuarios.service'
import type { RolUsuario } from '@/types'

/** Lista de todos los usuarios del sistema */
export function useUsuarios() {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: () => usuariosService.getAll(),
    staleTime: 2 * 60 * 1000, // 2 min (más frecuente que otros, es datos de admin)
  })
}

/** Usuario individual por UID */
export function useUsuario(uid: string) {
  return useQuery({
    queryKey: ['usuarios', uid],
    queryFn: () => usuariosService.getById(uid),
    enabled: !!uid,
    staleTime: 5 * 60 * 1000,
  })
}

/** Actualizar el rol de un usuario */
export function useUpdateRolUsuario() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ uid, rol }: { uid: string; rol: RolUsuario }) =>
      usuariosService.updateRol(uid, rol),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['usuarios'] })
      qc.invalidateQueries({ queryKey: ['usuarios', variables.uid] })
      toast.success('Rol actualizado correctamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar el rol: ${error.message}`)
    },
  })
}

/** Activar / desactivar un usuario */
export function useToggleActivoUsuario() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ uid, activo }: { uid: string; activo: boolean }) =>
      usuariosService.toggleActivo(uid, activo),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['usuarios'] })
      qc.invalidateQueries({ queryKey: ['usuarios', variables.uid] })
      toast.success(variables.activo ? 'Usuario activado' : 'Usuario desactivado')
    },
    onError: (error: Error) => {
      toast.error(`Error al cambiar el estado: ${error.message}`)
    },
  })
}
