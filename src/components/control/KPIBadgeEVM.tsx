'use client'

/**
 * KPIBadgeEVM — M4
 * Badge individual para un indicador EVM (SPI, CPI, EAC, ETC, SV, CV, TCPI).
 * Muestra valor + semáforo + tendencia.
 */

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SEMAFORO_COLOR, EVM_LABELS } from '@/constants/evm'
import type { SemaforoEVM } from '@/types'

type EVMKey = keyof typeof EVM_LABELS

interface KPIBadgeEVMProps {
  /** Clave del indicador (SPI, CPI, EAC, etc.) */
  kpi: EVMKey
  /** Valor numérico */
  valor: number
  /** Semáforo opcional (si no se provee, se muestra neutro) */
  semaforo?: SemaforoEVM
  /** Formateo del valor (default: 3 decimales para índices, 0 para montos) */
  formatear?: (v: number) => string
  /** Clases adicionales */
  className?: string
  /** Comparado con período anterior para tendencia */
  valorAnterior?: number
}

function formatDefault(kpi: EVMKey, valor: number): string {
  // Índices (SPI, CPI, TCPI): 3 decimales
  if (['SPI', 'CPI', 'TCPI'].includes(kpi)) return valor.toFixed(3)
  // Varianzas (SV, CV): 2 decimales con signo
  if (['SV', 'CV'].includes(kpi)) {
    const sign = valor > 0 ? '+' : ''
    return `${sign}${valor.toFixed(2)}`
  }
  // Montos (PV, EV, AC, EAC, BAC, ETC): sin decimales
  return valor.toLocaleString('es-CL', { maximumFractionDigits: 0 })
}

export function KPIBadgeEVM({
  kpi,
  valor,
  semaforo = 'sin_datos',
  formatear,
  className,
  valorAnterior,
}: KPIBadgeEVMProps) {
  const label = EVM_LABELS[kpi]
  const safeSemaforo: SemaforoEVM = SEMAFORO_COLOR[semaforo] ? semaforo : 'sin_datos'
  const cfg = SEMAFORO_COLOR[safeSemaforo]
  const valorStr = formatear ? formatear(valor) : formatDefault(kpi, valor)

  // Tendencia
  let TrendIcon: React.ElementType = Minus
  let trendClass = 'text-muted-foreground'
  if (valorAnterior !== undefined) {
    if (valor > valorAnterior) {
      TrendIcon = TrendingUp
      trendClass = 'text-green-600'
    } else if (valor < valorAnterior) {
      TrendIcon = TrendingDown
      trendClass = 'text-red-500'
    }
  }

  return (
    <div
      className={cn(
        'rounded-lg border p-3 flex flex-col gap-1',
        cfg.bg,
        cfg.border,
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {label.sigla}
        </span>
        {valorAnterior !== undefined && (
          <TrendIcon className={cn('h-3.5 w-3.5 shrink-0', trendClass)} />
        )}
      </div>
      <p className={cn('text-xl font-bold', cfg.text)}>{valorStr}</p>
      <p className="text-xs text-muted-foreground leading-tight">{label.nombre}</p>
    </div>
  )
}
