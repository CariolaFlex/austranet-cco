'use client'

// ============================================================
// COMPONENTE: ProyectoKPIs — M2-04 §10
// Panel de indicadores clave con semáforo: verde / amarillo / rojo
// ============================================================

import { differenceInDays } from 'date-fns'
import { TrendingDown, AlertTriangle, Calendar, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib'
import type { Proyecto } from '@/types'

// -------------------------------------------------------
// TIPOS Y HELPERS
// -------------------------------------------------------

type Semaforo = 'verde' | 'amarillo' | 'rojo'

const SEMAFORO_STYLES: Record<Semaforo, { bg: string; text: string; border: string }> = {
  verde: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
  },
  amarillo: {
    bg: 'bg-yellow-50 dark:bg-yellow-950/30',
    text: 'text-yellow-700 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800',
  },
  rojo: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
}

/**
 * Calcula el semáforo para un KPI.
 * @param value El valor numérico del KPI
 * @param yellowAt Umbral amarillo (inclusive)
 * @param redAt Umbral rojo (inclusive)
 * @param lowerIsBetter true = menor es peor (ej: % avance); false = mayor es peor (ej: días desviación)
 */
function semaforo(value: number, yellowAt: number, redAt: number, lowerIsBetter: boolean): Semaforo {
  if (lowerIsBetter) {
    // Menor valor = peor (ej: avance de hitos %)
    if (value <= redAt) return 'rojo'
    if (value <= yellowAt) return 'amarillo'
    return 'verde'
  } else {
    // Mayor valor = peor (ej: días de desviación, riesgos materializados)
    if (value >= redAt) return 'rojo'
    if (value >= yellowAt) return 'amarillo'
    return 'verde'
  }
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL
// -------------------------------------------------------

interface Props {
  proyecto: Proyecto
}

export function ProyectoKPIs({ proyecto }: Props) {
  const hitos = proyecto.hitos ?? []
  const riesgos = proyecto.riesgos ?? []

  const totalHitos = hitos.length
  const hitosCompletados = hitos.filter((h) => h.estado === 'completado').length
  const hitosIncumplidos = hitos.filter((h) => h.estado === 'incumplido').length
  const avancePct = totalHitos > 0 ? Math.round((hitosCompletados / totalHitos) * 100) : 100

  const riesgosMaterializados = riesgos.filter((r) => r.estado === 'materializado').length

  // Desviación: días que llevamos pasada la fecha fin estimada (0 si aún no vence)
  const desviacionDias = proyecto.fechaFinEstimada
    ? Math.max(0, differenceInDays(new Date(), new Date(proyecto.fechaFinEstimada)))
    : 0

  const kpis = [
    {
      label: 'Avance de hitos',
      valor: totalHitos === 0 ? 'N/A' : `${avancePct}%`,
      descripcion: totalHitos === 0 ? 'Sin hitos definidos' : `${hitosCompletados} de ${totalHitos} completados`,
      semaforo: totalHitos === 0 ? ('verde' as Semaforo) : semaforo(avancePct, 80, 60, true),
      icon: Calendar,
    },
    {
      label: 'Desviación cronograma',
      valor: desviacionDias === 0 ? 'En plazo' : `+${desviacionDias}d`,
      descripcion: proyecto.fechaFinEstimada ? 'días sobre lo estimado' : 'Sin fecha estimada',
      semaforo: semaforo(desviacionDias, 5, 15, false),
      icon: TrendingDown,
    },
    {
      label: 'Riesgos materializados',
      valor: riesgosMaterializados,
      descripcion: `de ${riesgos.length} riesgo${riesgos.length !== 1 ? 's' : ''} totales`,
      semaforo: semaforo(riesgosMaterializados, 1, 3, false),
      icon: AlertTriangle,
    },
    {
      label: 'Hitos incumplidos',
      valor: hitosIncumplidos,
      descripcion: `de ${totalHitos} hito${totalHitos !== 1 ? 's' : ''} totales`,
      semaforo: semaforo(hitosIncumplidos, 1, 2, false),
      icon: CheckCircle,
    },
  ] as const

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Panel KPIs — M2-04 §10</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {kpis.map((kpi) => {
            const style = SEMAFORO_STYLES[kpi.semaforo]
            const Icon = kpi.icon
            return (
              <div
                key={kpi.label}
                className={`p-3 rounded-lg border ${style.bg} ${style.border}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground font-medium">{kpi.label}</span>
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${style.text}`} />
                </div>
                <p className={`text-xl font-bold ${style.text}`}>{kpi.valor}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{kpi.descripcion}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
