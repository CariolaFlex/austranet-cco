'use client'

// ============================================================
// PÁGINA: Centro de Comunicaciones — T-02
// Lista paginada de notificaciones del usuario autenticado.
// ============================================================

import { useState } from 'react'
import { Bell, Check, CheckCheck, Archive, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useNotificacionesFS, useMutacionNotificacion } from '@/hooks/useNotificacionesFS'
import type { NotificacionFS, PrioridadNotificacion, EstadoNotificacion } from '@/types'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

// ── Configuración visual ────────────────────────────────────

const PRIORIDAD_STYLE: Record<PrioridadNotificacion, string> = {
  critica: 'text-red-700 bg-red-50 border-red-200 dark:bg-red-950/30',
  alta: 'text-orange-700 bg-orange-50 border-orange-200 dark:bg-orange-950/30',
  media: 'text-yellow-700 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30',
  baja: 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-800/30',
}

const ESTADO_FILTER: { value: string; label: string }[] = [
  { value: 'todos', label: 'Todas' },
  { value: 'pendiente', label: 'No leídas' },
  { value: 'leida', label: 'Leídas' },
  { value: 'archivada', label: 'Archivadas' },
]

// ── Componente fila ─────────────────────────────────────────
function FilaNotificacion({
  n,
  onMarcarLeida,
  onArchivar,
}: {
  n: NotificacionFS
  onMarcarLeida: (id: string) => void
  onArchivar: (id: string) => void
}) {
  const router = useRouter()
  const isNoLeida = n.estado === 'pendiente'

  const handleClick = () => {
    if (isNoLeida) onMarcarLeida(n.id)
    if (n.accionUrl) router.push(n.accionUrl)
  }

  return (
    <div
      className={cn(
        'flex gap-4 px-4 py-3.5 border-b last:border-0 transition-colors',
        isNoLeida ? 'bg-primary/5 hover:bg-primary/8' : 'hover:bg-muted/40',
        n.accionUrl && 'cursor-pointer'
      )}
      onClick={n.accionUrl ? handleClick : undefined}
    >
      {/* Indicador no leída */}
      <div className="flex-shrink-0 mt-1.5">
        {isNoLeida ? (
          <div className="h-2 w-2 rounded-full bg-primary" />
        ) : (
          <div className="h-2 w-2 rounded-full bg-transparent" />
        )}
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-sm leading-snug', isNoLeida && 'font-medium')}>
            {n.titulo}
          </p>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Badge variant="outline" className={cn('text-xs', PRIORIDAD_STYLE[n.prioridad])}>
              {n.prioridad}
            </Badge>
          </div>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{n.mensaje}</p>
        <div className="mt-1.5 flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(n.fechaCreacion), { addSuffix: true, locale: es })}
          </span>
          <Badge variant="outline" className="text-xs py-0">{n.modulo}</Badge>
          {n.accionRequerida && (
            <Badge variant="outline" className="text-xs py-0 text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
              Acción requerida
            </Badge>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-start gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {isNoLeida && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            title="Marcar como leída"
            onClick={(e) => { e.stopPropagation(); onMarcarLeida(n.id) }}
          >
            <Check className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          title="Archivar"
          onClick={(e) => { e.stopPropagation(); onArchivar(n.id) }}
        >
          <Archive className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────
export default function NotificacionesPage() {
  const { user } = useAuth()
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [filtroModulo, setFiltroModulo] = useState<string>('todos')

  const { notificaciones, totalNoLeidas, isLoading } = useNotificacionesFS(user?.id ?? '', 100)
  const { marcarLeida, marcarTodasLeidas, archivar } = useMutacionNotificacion(user?.id ?? '')

  const filtradas = notificaciones.filter((n) => {
    const estadoOk = filtroEstado === 'todos' || n.estado === filtroEstado
    const moduloOk = filtroModulo === 'todos' || n.modulo === filtroModulo
    return estadoOk && moduloOk
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Centro de comunicaciones"
        description="Todas tus notificaciones del sistema."
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">
                Notificaciones
                {totalNoLeidas > 0 && (
                  <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                    {totalNoLeidas > 99 ? '99+' : totalNoLeidas}
                  </span>
                )}
              </CardTitle>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Filtro estado */}
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="text-xs border rounded px-2 py-1 bg-background h-8"
              >
                {ESTADO_FILTER.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>

              {/* Filtro módulo */}
              <select
                value={filtroModulo}
                onChange={(e) => setFiltroModulo(e.target.value)}
                className="text-xs border rounded px-2 py-1 bg-background h-8"
              >
                <option value="todos">Todos los módulos</option>
                {['M1', 'M2', 'M3', 'T'].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              {/* Marcar todas */}
              {totalNoLeidas > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  disabled={marcarTodasLeidas.isPending}
                  onClick={() => marcarTodasLeidas.mutate()}
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Marcar todas leídas
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Cargando notificaciones...</span>
            </div>
          ) : filtradas.length === 0 ? (
            <div className="flex flex-col items-center py-14 gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Bell className="h-5 w-5 text-muted-foreground/60" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Sin notificaciones</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {filtroEstado !== 'todos' || filtroModulo !== 'todos'
                    ? 'Prueba cambiando los filtros'
                    : 'No tienes notificaciones pendientes'}
                </p>
              </div>
            </div>
          ) : (
            <div className="group">
              {filtradas.map((n) => (
                <FilaNotificacion
                  key={n.id}
                  n={n}
                  onMarcarLeida={(id) => marcarLeida.mutate(id)}
                  onArchivar={(id) => archivar.mutate(id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
