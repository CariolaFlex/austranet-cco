'use client'

// ============================================================
// COMPONENTE: NotificacionesBadge — Sprint 5
// Badge de notificaciones en el Header con dropdown de alertas.
// ============================================================

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Bell, AlertCircle, Calendar, TrendingDown, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  useNotificaciones,
  type TipoNotificacion,
} from '@/hooks/useNotificaciones'

// -------------------------------------------------------
// CONFIG
// -------------------------------------------------------

const TIPO_ICON: Record<TipoNotificacion, React.ElementType> = {
  hito_vencimiento: Calendar,
  riesgo_materializado: AlertCircle,
  desviacion_proyecto: TrendingDown,
  nda_vencimiento: FileText,
}

const PRIORIDAD_COLOR = {
  alta: 'text-red-500',
  media: 'text-yellow-500',
}

// -------------------------------------------------------
// COMPONENTE
// -------------------------------------------------------

export function NotificacionesBadge() {
  const { notificaciones, total, isLoading } = useNotificaciones()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        className="h-8 w-8 text-muted-foreground relative"
        title="Notificaciones"
      >
        <Bell className="h-4 w-4" />
        {!isLoading && total > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground leading-none">
            {total > 9 ? '9+' : total}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-80 rounded-lg border bg-card shadow-lg ring-1 ring-black/5 dark:ring-white/5 z-50">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-3 py-2.5">
            <p className="text-sm font-semibold">Notificaciones</p>
            {total > 0 && (
              <span className="text-xs text-muted-foreground">{total} alerta{total > 1 ? 's' : ''}</span>
            )}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="px-3 py-6 text-center">
              <p className="text-sm text-muted-foreground">Cargando...</p>
            </div>
          ) : total === 0 ? (
            <div className="px-3 py-8 text-center">
              <div className="flex justify-center mb-2">
                <Bell className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium text-foreground">Todo en orden</p>
              <p className="text-xs text-muted-foreground mt-0.5">Sin alertas pendientes</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto divide-y">
              {notificaciones.map((n) => {
                const Icon = TIPO_ICON[n.tipo]
                return (
                  <Link
                    key={n.id}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 px-3 py-3 hover:bg-muted/60 transition-colors"
                  >
                    <div className={`mt-0.5 shrink-0 ${PRIORIDAD_COLOR[n.prioridad]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-snug">{n.titulo}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.descripcion}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
