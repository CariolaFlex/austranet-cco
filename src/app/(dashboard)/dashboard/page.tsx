'use client'

import Link from 'next/link'
import {
  Building2,
  FolderKanban,
  FileText,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useEntidades } from '@/hooks/useEntidades'
import { useProyectos, useProyectosStats } from '@/hooks/useProyectos'

// ── Helpers de fecha ──────────────────────────────────────
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// ── Quick access cards ─────────────────────────────────────
const QUICK_ACCESS = [
  {
    label: 'Entidades',
    description: 'Gestiona clientes y proveedores del sistema.',
    href: '/entidades',
    icon: Building2,
  },
  {
    label: 'Proyectos',
    description: 'Crea y administra proyectos de software.',
    href: '/proyectos',
    icon: FolderKanban,
  },
  {
    label: 'Alcance / SRS',
    description: 'Documenta objetivos y requerimientos.',
    href: '/alcance',
    icon: FileText,
  },
] as const

// ── Page ──────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth()
  const firstName = user?.nombre?.split(' ')[0] ?? 'Usuario'

  // Datos reales desde Firestore
  const { data: entidades, isLoading: loadingEntidades } = useEntidades()
  const { data: stats, isLoading: loadingStats } = useProyectosStats()
  const { data: proyectosRecientes } = useProyectos({ estado: 'activo_en_desarrollo' })

  const entidadesCount = entidades?.length ?? 0
  const activosCount = stats?.activos ?? 0

  const KPI_CARDS = [
    {
      title: 'Entidades registradas',
      value: loadingEntidades ? '—' : entidadesCount,
      description: 'Clientes y proveedores',
      icon: Building2,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Proyectos activos',
      value: loadingStats ? '—' : activosCount,
      description: 'En definición o desarrollo',
      icon: FolderKanban,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
    },
    {
      title: 'Total proyectos',
      value: loadingStats ? '—' : (stats?.total ?? 0),
      description: 'En todos los estados',
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
  ]

  return (
    <div className="space-y-8">
      {/* ── Bienvenida ──────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {getGreeting()},{' '}
          <span className="text-primary">{firstName}</span>
        </h1>
        <p className="mt-0.5 text-sm capitalize text-muted-foreground">
          {capitalize(getFormattedDate())}
        </p>
      </div>

      {/* ── KPI Cards ───────────────────────────────── */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Resumen
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {KPI_CARDS.map(({ title, value, description, icon: Icon, color, bg }) => (
            <Card key={title} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
                      {value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                  </div>
                  <div className={cn('rounded-lg p-2.5', bg)}>
                    <Icon className={cn('h-5 w-5', color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Proyectos recientes activos ──────────────── */}
      {proyectosRecientes && proyectosRecientes.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Proyectos en desarrollo
          </h2>
          <div className="space-y-2">
            {proyectosRecientes.slice(0, 5).map((p) => (
              <Link key={p.id} href={`/proyectos/${p.id}`}>
                <Card className="group cursor-pointer transition-all duration-150 hover:border-primary/50 hover:shadow-sm">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-violet-500/10">
                      <FolderKanban className="h-4 w-4 text-violet-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{p.nombre}</p>
                      <p className="text-xs text-muted-foreground font-mono">{p.codigo}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Accesos rápidos ─────────────────────────── */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Accesos rápidos
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {QUICK_ACCESS.map(({ label, description, href, icon: Icon }) => (
            <Link key={href} href={href}>
              <Card className="group h-full cursor-pointer transition-all duration-150 hover:border-primary/50 hover:shadow-sm">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{label}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
