'use client'

// ============================================================
// PÁGINA: Admin > Usuarios — T-01
// Solo visible para admin y superadmin.
// Lista de usuarios con acciones de cambiar rol / activar.
// ============================================================

import { useState } from 'react'
import {
  Users,
  Shield,
  Search,
  Loader2,
  UserCheck,
  UserX,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { useUsuarios, useUpdateRolUsuario, useToggleActivoUsuario } from '@/hooks/useUsuarios'
import type { RolUsuario, Usuario } from '@/types'
import { cn } from '@/lib/utils'

const ROLES: RolUsuario[] = ['superadmin', 'admin', 'gestor', 'analista', 'viewer', 'tester']

const ROL_BADGE_COLOR: Record<RolUsuario, string> = {
  superadmin: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800',
  admin: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:border-red-800',
  gestor: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800',
  analista: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/30 dark:border-green-800',
  viewer: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/30 dark:border-gray-700',
  tester: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800',
}

export default function AdminUsuariosPage() {
  const { user: currentUser } = useAuth()
  const { data: usuarios, isLoading } = useUsuarios()
  const updateRol = useUpdateRolUsuario()
  const toggleActivo = useToggleActivoUsuario()
  const [busqueda, setBusqueda] = useState('')
  const [rolEditando, setRolEditando] = useState<string | null>(null)

  // Guard: solo admin/superadmin
  if (currentUser?.rol !== 'admin' && currentUser?.rol !== 'superadmin') {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center space-y-2">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="font-medium">Acceso restringido</p>
          <p className="text-sm text-muted-foreground">Esta sección requiere permisos de administrador.</p>
        </div>
      </div>
    )
  }

  const filtrados = (usuarios ?? []).filter((u) => {
    const q = busqueda.toLowerCase()
    return (
      u.nombre.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.empresa ?? '').toLowerCase().includes(q)
    )
  })

  function handleRolChange(u: Usuario, nuevoRol: RolUsuario) {
    if (u.id === currentUser?.id) return
    updateRol.mutate({ uid: u.id, rol: nuevoRol })
    setRolEditando(null)
  }

  function handleToggleActivo(u: Usuario) {
    if (u.id === currentUser?.id) return
    toggleActivo.mutate({ uid: u.id, activo: !u.activo })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de usuarios"
        description="Administra los accesos y roles del sistema."
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">
                Usuarios ({filtrados.length})
              </CardTitle>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8 h-8 text-sm"
                placeholder="Buscar por nombre, email..."
                value={busqueda}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Cargando usuarios...</span>
            </div>
          ) : filtrados.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No se encontraron usuarios.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Usuario</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Empresa</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rol</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Creado</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtrados.map((u) => (
                    <tr
                      key={u.id}
                      className={cn(
                        'hover:bg-muted/30 transition-colors',
                        !u.activo && 'opacity-60'
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium">{u.nombre}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{u.empresa ?? '—'}</td>
                      <td className="px-4 py-3">
                        {rolEditando === u.id ? (
                          <select
                            autoFocus
                            defaultValue={u.rol}
                            onBlur={() => setRolEditando(null)}
                            onChange={(e) => handleRolChange(u, e.target.value as RolUsuario)}
                            className="text-sm border rounded px-2 py-1 bg-background"
                          >
                            {ROLES.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        ) : (
                          <button
                            onClick={() => {
                              if (u.id !== currentUser?.id) setRolEditando(u.id)
                            }}
                            disabled={u.id === currentUser?.id}
                            title={
                              u.id === currentUser?.id
                                ? 'No puedes cambiar tu propio rol'
                                : 'Click para cambiar rol'
                            }
                            className="inline-flex"
                          >
                            <Badge
                              variant="outline"
                              className={cn('text-xs', u.id !== currentUser?.id && 'cursor-pointer hover:opacity-80', ROL_BADGE_COLOR[u.rol])}
                            >
                              {u.rol}
                            </Badge>
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs',
                            u.activo
                              ? 'text-green-700 border-green-200 bg-green-50 dark:bg-green-950/30'
                              : 'text-red-700 border-red-200 bg-red-50 dark:bg-red-950/30'
                          )}
                        >
                          {u.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {u.creadoEn
                          ? new Date(u.creadoEn).toLocaleDateString('es-CL', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={u.id === currentUser?.id || toggleActivo.isPending}
                          onClick={() => handleToggleActivo(u)}
                          title={u.activo ? 'Desactivar usuario' : 'Activar usuario'}
                          className="h-8 w-8 p-0"
                        >
                          {u.activo ? (
                            <UserX className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <UserCheck className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
