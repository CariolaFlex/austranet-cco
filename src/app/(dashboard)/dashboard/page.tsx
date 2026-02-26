'use client'

// ============================================================
// PÁGINA: Dashboard — Sprint 4 + Sprint 5
// Datos reales de Firebase, alertas y proyectos recientes.
// ============================================================

import { useMemo } from 'react'
import Link from 'next/link'
import {
  Building2,
  FolderKanban,
  FileText,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

// ── Nivel riesgo config ─────────────────────────────────────
const NIVEL_RIESGO_CONFIG = {
  bajo: { label: 'Bajo', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800' },
  medio: { label: 'Medio', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-950/30', border: 'border-yellow-200 dark:border-yellow-800' },
  alto: { label: 'Alto', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800' },
  critico: { label: 'Crítico', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800' },
} as const

// ── Page ──────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth()
  const firstName = user?.nombre?.split(' ')[0] ?? 'Usuario'

  // Datos reales desde Firestore
  const { data: entidades, isLoading: loadingEntidades } = useEntidades()
  const { data: stats, isLoading: loadingStats } = useProyectosStats()
  const { data: proyectosRecientes } = useProyectos({ estado: 'activo_en_desarrollo' })
  const { data: todosProyectos } = useProyectos()

  const entidadesCount = entidades?.length ?? 0
  const activosCount = stats?.activos ?? 0

  // Entidades con nivelRiesgo alto o crítico (alertas de completitud)
  const entidadesEnAlerta = useMemo(
    () =>
      (entidades ?? [])
        .filter((e) => e.nivelRiesgo === 'alto' || e.nivelRiesgo === 'critico')
        .slice(0, 5),
    [entidades]
  )

  // Proyectos activos con al menos 1 riesgo materializado
  const proyectosConRiesgos = useMemo(
    () =>
      (todosProyectos ?? [])
        .filter(
          (p) =>
            ['activo_en_definicion', 'activo_en_desarrollo'].includes(p.estado) &&
            (p.riesgos ?? []).some((r) => r.estado === 'materializado')
        )
        .slice(0, 5),
    [todosProyectos]
  )

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

      {/* ── Proyectos con riesgos materializados ─────── */}
      {proyectosConRiesgos.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-red-500" />
            Proyectos con riesgos materializados
          </h2>
          <div className="space-y-2">
            {proyectosConRiesgos.map((p) => {
              const riesgosMat = (p.riesgos ?? []).filter(
                (r) => r.estado === 'materializado'
              ).length
              return (
                <Link key={p.id} href={`/proyectos/${p.id}`}>
                  <Card className="group cursor-pointer transition-all duration-150 hover:border-red-300 hover:shadow-sm border-red-200 bg-red-50/30 dark:bg-red-950/10 dark:border-red-900">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-red-500/10">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {p.nombre}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">{p.codigo}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs text-red-700 border-red-300 bg-red-50 dark:bg-red-950/30 shrink-0"
                      >
                        {riesgosMat} materializado{riesgosMat > 1 ? 's' : ''}
                      </Badge>
                      <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Entidades con alertas de riesgo ──────────── */}
      {entidadesEnAlerta.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
            Entidades con nivel de riesgo elevado
          </h2>
          <div className="space-y-2">
            {entidadesEnAlerta.map((e) => {
              const cfg = NIVEL_RIESGO_CONFIG[e.nivelRiesgo]
              return (
                <Link key={e.id} href={`/entidades/${e.id}`}>
                  <Card
                    className={`group cursor-pointer transition-all duration-150 hover:shadow-sm ${cfg.bg} ${cfg.border}`}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-background/60">
                        <Building2 className={`h-4 w-4 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {e.razonSocial}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {e.sector} · {e.pais}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs shrink-0 ${cfg.color} ${cfg.border}`}
                      >
                        Riesgo {cfg.label}
                      </Badge>
                      <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Proyectos en desarrollo ───────────────────── */}
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
