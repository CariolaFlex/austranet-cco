'use client'

// ============================================================
// APUCard — M5-S02
// Tarjeta resumen de un APU: nombre, estado, # partidas, costo total.
// ============================================================

import { FileText, CheckCircle2, Clock3, Edit3, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/lib'
import { cn } from '@/lib/utils'
import type { APU, EstadoAPU } from '@/types'

// -------------------------------------------------------
// HELPERS
// -------------------------------------------------------

const ESTADO_CONFIG: Record<EstadoAPU, { label: string; color: string; icon: React.ElementType }> = {
  borrador:  { label: 'Borrador',    color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200', icon: Edit3 },
  revision:  { label: 'En revisión', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200', icon: Clock3 },
  aprobado:  { label: 'Aprobado',    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200', icon: CheckCircle2 },
}

function simb(moneda: string): string {
  if (moneda === 'USD') return 'US$'
  if (moneda === 'PEN') return 'S/'
  return '$'
}

// -------------------------------------------------------
// TIPOS
// -------------------------------------------------------

interface APUCardProps {
  apu: APU
  selected?: boolean
  onClick: () => void
  onEditar?: () => void
  onEliminar?: () => void
}

// -------------------------------------------------------
// COMPONENTE
// -------------------------------------------------------

export function APUCard({ apu, selected = false, onClick, onEditar, onEliminar }: APUCardProps) {
  const cfg = ESTADO_CONFIG[apu.estado]
  const Icon = cfg.icon
  const s = simb(apu.moneda)

  const totalPrecio = apu.partidas.reduce((sum, p) => sum + p.precioUnitario, 0)
  const totalDirecto = apu.partidas.reduce((sum, p) => sum + p.costoDirecto, 0)

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md group',
        selected
          ? 'ring-2 ring-primary border-primary'
          : 'hover:border-primary/50',
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className={cn(
              'rounded-md p-2 flex-shrink-0 transition-colors',
              selected ? 'bg-primary/10' : 'bg-muted group-hover:bg-primary/5',
            )}>
              <FileText className={cn('h-4 w-4', selected ? 'text-primary' : 'text-muted-foreground')} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{apu.nombre}</p>
              {apu.descripcion && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">{apu.descripcion}</p>
              )}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="outline" className={cn('text-xs h-5', cfg.color)}>
                  <Icon className="h-3 w-3 mr-1" />
                  {cfg.label}
                </Badge>
                <Badge variant="secondary" className="text-xs h-5">
                  v{apu.version}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {apu.partidas.length} partida{apu.partidas.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div
            className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            {onEditar && apu.estado !== 'aprobado' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEditar}
                className="h-7 w-7 p-0"
                title="Editar APU"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </Button>
            )}
            {onEliminar && apu.estado === 'borrador' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEliminar}
                className="h-7 w-7 p-0 hover:text-destructive hover:bg-destructive/10"
                title="Eliminar APU"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Costos */}
        <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-muted-foreground">Costo directo</p>
            <p className="text-sm font-semibold tabular-nums">
              {s} {totalDirecto.toLocaleString('es-CL')}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total APU</p>
            <p className={cn('text-sm font-bold tabular-nums', selected ? 'text-primary' : '')}>
              {s} {totalPrecio.toLocaleString('es-CL')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
