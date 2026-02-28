// ============================================================
// UTILIDAD: Semáforo de salud de proyectos — T-05
// Calcula verde/amarillo/rojo según estado del proyecto.
// ============================================================

import { differenceInDays } from 'date-fns'
import type { Proyecto, ConfiguracionSistema } from '@/types'
import { CONFIG_SISTEMA_DEFAULTS } from '@/types'

export type ColorSemaforo = 'verde' | 'amarillo' | 'rojo'

/**
 * Calcula el semáforo de salud de un proyecto.
 *
 * Criterios ROJO (cualquiera de estos):
 * - Hito vencido sin cerrar > umbral días
 * - Riesgo materializado sin cerrar
 * - Fecha fin superada (proyecto retrasado)
 *
 * Criterios AMARILLO (cualquiera, si no es rojo):
 * - Hito próximo a vencer ≤ umbral días
 * - Fecha fin en los próximos N días
 *
 * VERDE: ninguno de los anteriores aplica.
 */
export function calcularSemaforoProyecto(
  proyecto: Proyecto,
  config?: ConfiguracionSistema | null
): ColorSemaforo {
  const cfg = config ?? CONFIG_SISTEMA_DEFAULTS
  const rojo = cfg.proyectos.semaforoRojo
  const amarillo = cfg.proyectos.semaforoAmarillo
  const ahora = new Date()

  // ── ROJO ──────────────────────────────────────────────────

  // Hitos vencidos sin cerrar (superan el umbral de días sin cerrar)
  const hitosVencidos = (proyecto.hitos ?? []).filter((h) => {
    if (h.estado === 'completado' || h.estado === 'incumplido') return false
    if (!h.fechaEstimada) return false
    return differenceInDays(ahora, new Date(h.fechaEstimada)) >= rojo.diasHitoVencidoSinCerrar
  })
  if (hitosVencidos.length > 0) return 'rojo'

  // Riesgos materializados sin cerrar
  const riesgosMat = (proyecto.riesgos ?? []).filter(
    (r) => r.estado === 'materializado'
  )
  if (riesgosMat.length > 0) return 'rojo'

  // Proyecto retrasado (fecha fin estimada ya pasó)
  if (proyecto.fechaFinEstimada) {
    const diasVencido = differenceInDays(ahora, new Date(proyecto.fechaFinEstimada))
    if (diasVencido >= rojo.diasGateSinDecision) return 'rojo'
  }

  // ── AMARILLO ─────────────────────────────────────────────

  // Hitos próximos a vencer
  const hitosProximos = (proyecto.hitos ?? []).filter((h) => {
    if (h.estado === 'completado' || h.estado === 'incumplido') return false
    if (!h.fechaEstimada) return false
    const dias = differenceInDays(new Date(h.fechaEstimada), ahora)
    return dias >= 0 && dias <= amarillo.diasHitoProximo
  })
  if (hitosProximos.length > 0) return 'amarillo'

  // Fecha fin próxima a vencer (dentro del umbral de alerta)
  if (proyecto.fechaFinEstimada) {
    const diasRestantes = differenceInDays(new Date(proyecto.fechaFinEstimada), ahora)
    if (diasRestantes >= 0 && diasRestantes <= cfg.proyectos.diasAlertaHitoProximo) return 'amarillo'
  }

  return 'verde'
}

/** Retorna la clase Tailwind de color de fondo según el semáforo */
export function colorBgSemaforo(color: ColorSemaforo): string {
  switch (color) {
    case 'rojo': return 'bg-red-500'
    case 'amarillo': return 'bg-yellow-400'
    case 'verde': return 'bg-green-500'
  }
}

/** Retorna la clase Tailwind de color de texto según el semáforo */
export function colorTextSemaforo(color: ColorSemaforo): string {
  switch (color) {
    case 'rojo': return 'text-red-600'
    case 'amarillo': return 'text-yellow-600'
    case 'verde': return 'text-green-600'
  }
}

/** Retorna el label legible del semáforo */
export function labelSemaforo(color: ColorSemaforo): string {
  switch (color) {
    case 'rojo': return 'Crítico'
    case 'amarillo': return 'Atención'
    case 'verde': return 'Normal'
  }
}
