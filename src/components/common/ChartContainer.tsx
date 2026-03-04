'use client'

/**
 * ChartContainer — M4
 * Wrapper genérico para gráficos: maneja loading (Skeleton), estado vacío y título.
 * Reutilizable en todos los gráficos de M4.
 */

import { type LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib'
import { cn } from '@/lib/utils'

interface ChartContainerProps {
  /** Título de la tarjeta */
  title: string
  /** Ícono lucide opcional */
  icon?: LucideIcon
  /** Altura del área del gráfico (px). Default 300. */
  height?: number
  /** true mientras se carga data */
  isLoading?: boolean
  /** true cuando no hay datos (muestra EmptyState interno) */
  isEmpty?: boolean
  /** Mensaje para el estado vacío */
  emptyMessage?: string
  /** Clases adicionales para la Card */
  className?: string
  /** Contenido del gráfico */
  children: React.ReactNode
  /** Slot opcional para acciones extra en el header */
  actions?: React.ReactNode
}

export function ChartContainer({
  title,
  icon: Icon,
  height = 300,
  isLoading = false,
  isEmpty = false,
  emptyMessage = 'No hay datos disponibles todavía.',
  className,
  children,
  actions,
}: ChartContainerProps) {
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground shrink-0" />}
            {title}
          </CardTitle>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        {isLoading ? (
          <div
            style={{ height }}
            className="animate-pulse bg-muted rounded-md"
          />
        ) : isEmpty ? (
          <div
            style={{ height }}
            className="flex flex-col items-center justify-center text-center gap-2"
          >
            <p className="text-sm text-muted-foreground max-w-xs">{emptyMessage}</p>
          </div>
        ) : (
          <div style={{ height }}>{children}</div>
        )}
      </CardContent>
    </Card>
  )
}
