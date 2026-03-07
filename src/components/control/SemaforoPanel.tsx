'use client'

/**
 * SemaforoPanel — M4
 * Panel de semáforos SPI/CPI con indicadores visuales de salud del proyecto.
 * Pure React, sin dependencias de chart libraries.
 */

import { memo } from 'react'
import { CheckCircle2, AlertCircle, XCircle, MinusCircle, TrendingUp, Clock, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib'
import { cn } from '@/lib/utils'
import { SEMAFORO_COLOR } from '@/constants/evm'
import type { KPIsDashboard, SemaforoEVM } from '@/types'

// -------------------------------------------------------
// HELPERS
// -------------------------------------------------------

const SEMAFORO_ICONS: Record<SemaforoEVM, React.ElementType> = {
  verde: CheckCircle2,
  amarillo: AlertCircle,
  rojo: XCircle,
  sin_datos: MinusCircle,
}

const SEMAFORO_LABELS: Record<SemaforoEVM, string> = {
  verde: 'En control',
  amarillo: 'Atención',
  rojo: 'Alerta',
  sin_datos: 'Sin datos',
}

interface SemaforoItemProps {
  label: string
  semaforo: SemaforoEVM
  valor?: string
  descripcion?: string
  icon: React.ElementType
}

function SemaforoItem({ label, semaforo, valor, descripcion, icon: ContextIcon }: SemaforoItemProps) {
  const safeSemaforo: SemaforoEVM = SEMAFORO_COLOR[semaforo] ? semaforo : 'sin_datos'
  const cfg = SEMAFORO_COLOR[safeSemaforo]
  const SemaforoIcon = SEMAFORO_ICONS[safeSemaforo]

  return (
    <div className={cn('rounded-lg border p-3 flex flex-col gap-1.5', cfg.bg, cfg.border)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ContextIcon className={cn('h-3.5 w-3.5 shrink-0', cfg.text)} />
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
        </div>
        <SemaforoIcon className={cn('h-4 w-4 shrink-0', cfg.text)} />
      </div>
      {valor && <p className={cn('text-2xl font-bold', cfg.text)}>{valor}</p>}
      <p className={cn('text-xs', cfg.text)}>{descripcion ?? SEMAFORO_LABELS[semaforo]}</p>
    </div>
  )
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL
// -------------------------------------------------------

interface SemaforoPanelProps {
  kpis: KPIsDashboard
  modo?: 'compact' | 'detailed'
  className?: string
}

export const SemaforoPanel = memo(function SemaforoPanel({ kpis, modo = 'detailed', className }: SemaforoPanelProps) {
  const compact = modo === 'compact'

  if (compact) {
    // Solo íconos + etiqueta
    const items: { label: string; semaforo: SemaforoEVM }[] = [
      { label: 'General', semaforo: kpis.semaforoGeneral },
      { label: 'Cronograma', semaforo: kpis.semaforoCronograma },
      { label: 'Costos', semaforo: kpis.semaforoCostos },
    ]
    return (
      <div className={cn('flex items-center gap-3', className)}>
        {items.map(({ label, semaforo }) => {
          const safeSemaforo: SemaforoEVM = SEMAFORO_COLOR[semaforo] ? semaforo : 'sin_datos'
          const cfg = SEMAFORO_COLOR[safeSemaforo]
          const Icon = SEMAFORO_ICONS[safeSemaforo]
          return (
            <div key={label} className="flex items-center gap-1">
              <Icon className={cn('h-4 w-4', cfg.text)} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Indicadores de Salud EVM</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          <SemaforoItem
            label="General"
            semaforo={kpis.semaforoGeneral}
            icon={TrendingUp}
            descripcion={SEMAFORO_LABELS[kpis.semaforoGeneral]}
          />
          <SemaforoItem
            label="Cronograma (SPI)"
            semaforo={kpis.semaforoCronograma}
            valor={kpis.spi.toFixed(2)}
            icon={Clock}
            descripcion={`SPI = ${kpis.spi.toFixed(3)}`}
          />
          <SemaforoItem
            label="Costos (CPI)"
            semaforo={kpis.semaforoCostos}
            valor={kpis.cpi.toFixed(2)}
            icon={DollarSign}
            descripcion={`CPI = ${kpis.cpi.toFixed(3)}`}
          />
        </div>

        {/* Avance ponderado */}
        <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
          <span>Avance ponderado:</span>
          <span className="font-semibold text-foreground">{kpis.pctAvancePonderado.toFixed(1)}%</span>
          <span className="ml-auto">Tareas completadas:</span>
          <span className="font-semibold text-foreground">{kpis.pctAvanceTareas.toFixed(1)}%</span>
        </div>
      </CardContent>
    </Card>
  )
})
