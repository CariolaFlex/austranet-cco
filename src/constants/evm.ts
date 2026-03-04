/**
 * EVM — Constantes y utilidades para Earned Value Management
 * M4: Módulo Cronograma y Control Visual
 */

import type { SemaforoEVM } from '@/types'

// -------------------------------------------------------
// UMBRALES DE SEMÁFOROS
// Basados en estándares PMI/P6: SPI y CPI
// -------------------------------------------------------

export const EVM_THRESHOLDS = {
  SPI: {
    verde:    { min: 0.95 },   // ≥ 0.95: en cronograma
    amarillo: { min: 0.80 },   // 0.80 – 0.94: leve retraso, atención
    // rojo: < 0.80 — retraso severo
  },
  CPI: {
    verde:    { min: 0.95 },   // ≥ 0.95: dentro del presupuesto
    amarillo: { min: 0.85 },   // 0.85 – 0.94: sobrecosto leve
    // rojo: < 0.85 — sobrecosto severo
  },
} as const

// -------------------------------------------------------
// FUNCIONES DE CÁLCULO DE SEMÁFOROS
// -------------------------------------------------------

/**
 * Devuelve el semáforo SPI (Schedule Performance Index = EV/PV)
 * verde ≥ 0.95 | amarillo 0.80–0.95 | rojo < 0.80
 */
export function calcularSemaforoSPI(spi: number): SemaforoEVM {
  if (!isFinite(spi) || isNaN(spi)) return 'sin_datos'
  if (spi >= EVM_THRESHOLDS.SPI.verde.min) return 'verde'
  if (spi >= EVM_THRESHOLDS.SPI.amarillo.min) return 'amarillo'
  return 'rojo'
}

/**
 * Devuelve el semáforo CPI (Cost Performance Index = EV/AC)
 * verde ≥ 0.95 | amarillo 0.85–0.95 | rojo < 0.85
 */
export function calcularSemaforoCPI(cpi: number): SemaforoEVM {
  if (!isFinite(cpi) || isNaN(cpi)) return 'sin_datos'
  if (cpi >= EVM_THRESHOLDS.CPI.verde.min) return 'verde'
  if (cpi >= EVM_THRESHOLDS.CPI.amarillo.min) return 'amarillo'
  return 'rojo'
}

/**
 * Semáforo general: rojo si cualquiera es rojo, amarillo si alguno es amarillo.
 */
export function calcularSemaforoGeneral(
  semaforoCronograma: SemaforoEVM,
  semaforoCostos: SemaforoEVM,
): SemaforoEVM {
  if (semaforoCronograma === 'sin_datos' && semaforoCostos === 'sin_datos') return 'sin_datos'
  if (semaforoCronograma === 'rojo' || semaforoCostos === 'rojo') return 'rojo'
  if (semaforoCronograma === 'amarillo' || semaforoCostos === 'amarillo') return 'amarillo'
  return 'verde'
}

// -------------------------------------------------------
// FÓRMULAS EVM ESTÁNDAR
// -------------------------------------------------------

/** SPI = EV / PV. Devuelve 1 si PV === 0 (inicio del proyecto). */
export function calcularSPI(ev: number, pv: number): number {
  if (pv === 0) return 1
  return Math.round((ev / pv) * 1000) / 1000  // 3 decimales
}

/** CPI = EV / AC. Devuelve 1 si AC === 0 (sin gasto aún). */
export function calcularCPI(ev: number, ac: number): number {
  if (ac === 0) return 1
  return Math.round((ev / ac) * 1000) / 1000
}

/** SV (Schedule Variance) = EV - PV. Negativo = retraso. */
export function calcularSV(ev: number, pv: number): number {
  return Math.round((ev - pv) * 100) / 100
}

/** CV (Cost Variance) = EV - AC. Negativo = sobrecosto. */
export function calcularCV(ev: number, ac: number): number {
  return Math.round((ev - ac) * 100) / 100
}

/** EAC (Estimate at Completion) = BAC / CPI. Proyección del costo final. */
export function calcularEAC(bac: number, cpi: number): number {
  if (cpi === 0) return bac
  return Math.round((bac / cpi) * 100) / 100
}

/** ETC (Estimate to Complete) = EAC - AC. Costo restante proyectado. */
export function calcularETC(eac: number, ac: number): number {
  return Math.max(0, Math.round((eac - ac) * 100) / 100)
}

/**
 * TCPI (To-Complete Performance Index) = (BAC - EV) / (BAC - AC)
 * Indica la eficiencia futura necesaria para completar dentro del presupuesto.
 * TCPI > 1 = necesita mejorar rendimiento. TCPI < 1 = hay margen.
 */
export function calcularTCPI(bac: number, ev: number, ac: number): number {
  const denominador = bac - ac
  if (denominador <= 0) return 0
  return Math.round(((bac - ev) / denominador) * 1000) / 1000
}

// -------------------------------------------------------
// COLORES DE SEMÁFORO PARA ESTILOS
// -------------------------------------------------------

export const SEMAFORO_COLOR: Record<SemaforoEVM, {
  text: string
  bg: string
  border: string
  icon: string         // Para Lucide icon name
}> = {
  verde:     { text: 'text-green-700 dark:text-green-400',  bg: 'bg-green-100 dark:bg-green-900/20',   border: 'border-green-200 dark:border-green-800', icon: 'CheckCircle2' },
  amarillo:  { text: 'text-yellow-700 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800', icon: 'AlertCircle' },
  rojo:      { text: 'text-red-700 dark:text-red-400',      bg: 'bg-red-100 dark:bg-red-900/20',       border: 'border-red-200 dark:border-red-800',       icon: 'XCircle' },
  sin_datos: { text: 'text-gray-500 dark:text-gray-400',    bg: 'bg-gray-100 dark:bg-gray-800',        border: 'border-gray-200 dark:border-gray-700',     icon: 'MinusCircle' },
} as const

// -------------------------------------------------------
// LABELS DE INDICADORES EVM
// -------------------------------------------------------

export const EVM_LABELS = {
  PV:   { sigla: 'PV',   nombre: 'Valor Planificado',      color: '#3b82f6' },  // blue-500
  EV:   { sigla: 'EV',   nombre: 'Valor Ganado',           color: '#22c55e' },  // green-500
  AC:   { sigla: 'AC',   nombre: 'Costo Real',             color: '#ef4444' },  // red-500
  EAC:  { sigla: 'EAC',  nombre: 'Estimación a Conclusión', color: '#f59e0b' }, // amber-500
  BAC:  { sigla: 'BAC',  nombre: 'Presupuesto Total',      color: '#8b5cf6' },  // violet-500
  SPI:  { sigla: 'SPI',  nombre: 'Índice Rendimiento Cronograma', color: '#06b6d4' },
  CPI:  { sigla: 'CPI',  nombre: 'Índice Rendimiento Costo',      color: '#84cc16' },
  SV:   { sigla: 'SV',   nombre: 'Variación de Cronograma', color: '#0ea5e9' },
  CV:   { sigla: 'CV',   nombre: 'Variación de Costo',      color: '#ec4899' },
  TCPI: { sigla: 'TCPI', nombre: 'Índice Rendimiento para Completar', color: '#14b8a6' },
  ETC:  { sigla: 'ETC',  nombre: 'Estimación para Completar', color: '#f97316' },
} as const
