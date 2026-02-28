'use client'

// ============================================================
// PÁGINA: Admin — índice de administración (T-01, T-03)
// ============================================================

import Link from 'next/link'
import { Users, ClipboardList, ArrowRight, Shield } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

const ADMIN_SECTIONS = [
  {
    label: 'Gestión de usuarios',
    description: 'Ver, activar/desactivar y cambiar roles de los usuarios del sistema.',
    href: '/admin/usuarios',
    icon: Users,
  },
  {
    label: 'Auditoría del sistema',
    description: 'Registro inmutable de actividad: accesos, cambios de estado y operaciones críticas.',
    href: '/admin/auditoria',
    icon: ClipboardList,
  },
] as const

export default function AdminPage() {
  const { user } = useAuth()

  if (user?.rol !== 'admin' && user?.rol !== 'superadmin') {
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administración"
        description="Paneles de gestión del sistema (solo administradores)."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {ADMIN_SECTIONS.map(({ label, description, href, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="group h-full cursor-pointer transition-all duration-150 hover:border-primary/50 hover:shadow-sm">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
                </div>
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 mt-0.5" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
