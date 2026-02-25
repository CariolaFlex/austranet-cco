'use client';

import Link from 'next/link';
import {
  Building2,
  FolderKanban,
  FileText,
  Info,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// ── Helpers de fecha ──────────────────────────────────────
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── KPI Cards data ────────────────────────────────────────
const KPI_CARDS = [
  {
    title: 'Entidades registradas',
    value: 0,
    description: 'Clientes y proveedores',
    icon: Building2,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    title: 'Proyectos activos',
    value: 0,
    description: 'En definición o desarrollo',
    icon: FolderKanban,
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    title: 'SRS en proceso',
    value: 0,
    description: 'Documentos de alcance activos',
    icon: FileText,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
] as const;

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
] as const;

// ── Page ──────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.nombre?.split(' ')[0] ?? 'Usuario';

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
                    <p className="text-sm font-medium text-muted-foreground">
                      {title}
                    </p>
                    <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
                      {value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {description}
                    </p>
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
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Banner estado del sistema ────────────────── */}
      <section>
        <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3.5 dark:border-blue-900 dark:bg-blue-950/40">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Sistema en configuración inicial
            </p>
            <p className="mt-0.5 text-xs text-blue-600/80 dark:text-blue-500/80">
              Conecta Firebase para comenzar a registrar datos reales en el sistema.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
