// ============================================================
// Cloud Functions — Helpers puros de cálculo EVM
// Austranet CCO
// ============================================================
// Estas funciones replican la lógica de:
//   src/constants/evm.ts  (fórmulas EVM estándar + semáforos)
//   src/services/evm.service.ts (calcularEV/AC/PVDesdeTareas)
//
// NO importan desde src/ para evitar dependencia circular
// con el entorno Next.js (que usa Firebase client SDK y browser APIs).
// ============================================================

import type { Tarea, SemaforoEVM, SnapshotEVM, KPIsDashboard } from './types'

// -------------------------------------------------------
// UMBRALES PMI (SPI/CPI)
// -------------------------------------------------------

const SPI_VERDE = 0.95
const SPI_AMARILLO = 0.80
const CPI_VERDE = 0.95
const CPI_AMARILLO = 0.85

// -------------------------------------------------------
// SEMÁFOROS
// -------------------------------------------------------

export function calcularSemaforoSPI(spi: number): SemaforoEVM {
  if (!isFinite(spi) || isNaN(spi)) return 'sin_datos'
  if (spi >= SPI_VERDE) return 'verde'
  if (spi >= SPI_AMARILLO) return 'amarillo'
  return 'rojo'
}

export function calcularSemaforoCPI(cpi: number): SemaforoEVM {
  if (!isFinite(cpi) || isNaN(cpi)) return 'sin_datos'
  if (cpi >= CPI_VERDE) return 'verde'
  if (cpi >= CPI_AMARILLO) return 'amarillo'
  return 'rojo'
}

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

export function calcularSPI(ev: number, pv: number): number {
  if (pv === 0) return 1
  return Math.round((ev / pv) * 1000) / 1000
}

export function calcularCPI(ev: number, ac: number): number {
  if (ac === 0) return 1
  return Math.round((ev / ac) * 1000) / 1000
}

export function calcularSV(ev: number, pv: number): number {
  return Math.round((ev - pv) * 100) / 100
}

export function calcularCV(ev: number, ac: number): number {
  return Math.round((ev - ac) * 100) / 100
}

export function calcularEAC(bac: number, cpi: number): number {
  if (cpi === 0) return bac
  return Math.round((bac / cpi) * 100) / 100
}

export function calcularETC(eac: number, ac: number): number {
  return Math.max(0, Math.round((eac - ac) * 100) / 100)
}

export function calcularTCPI(bac: number, ev: number, ac: number): number {
  const denominador = bac - ac
  if (denominador <= 0) return 0
  return Math.round(((bac - ev) / denominador) * 1000) / 1000
}

// -------------------------------------------------------
// CÁLCULO DESDE ARRAY DE TAREAS
// -------------------------------------------------------

/** EV = Σ (costoPlaneado × porcentajeAvance / 100). Excluye tareas suspendidas. */
export function calcularEVDesdeTareas(tareas: Tarea[]): number {
  return tareas
    .filter((t) => t.estado !== 'suspendida')
    .reduce((sum, t) => sum + (t.costoPlaneado * t.porcentajeAvance) / 100, 0)
}

/** AC = Σ (costoReal ?? 0). */
export function calcularACDesdeTareas(tareas: Tarea[]): number {
  return tareas.reduce((sum, t) => sum + (t.costoReal ?? 0), 0)
}

/**
 * PV = Σ costoPlaneado de tareas cuya fechaInicioPlaneada <= fecha.
 * Versión simplificada MVP (distribución lineal diferida — P5).
 */
export function calcularPVDesdeTareas(tareas: Tarea[], fecha: Date): number {
  return tareas
    .filter((t) => t.estado !== 'suspendida' && t.fechaInicioPlaneada <= fecha)
    .reduce((sum, t) => sum + t.costoPlaneado, 0)
}

// -------------------------------------------------------
// HELPERS DE SNAPSHOT / KPIs
// -------------------------------------------------------

/**
 * Genera el ID del snapshot en formato ISO date del lunes de la semana.
 * Idempotente: si se llama varias veces la misma semana, produce el mismo ID.
 */
export function generarSnapshotId(fecha: Date = new Date()): string {
  const d = new Date(fecha)
  const diaSemana = d.getDay()  // 0 = domingo
  const diasParaLunes = diaSemana === 0 ? -6 : 1 - diaSemana
  d.setDate(d.getDate() + diasParaLunes)
  return d.toISOString().slice(0, 10)  // "2026-03-09"
}

/**
 * Calcula todos los KPIs EVM a partir de tareas y BAC.
 * Retorna el objeto listo para guardar en Firestore.
 */
export function calcularKPIsDesdeArrayTareas(
  tareas: Tarea[],
  bac: number,
  fecha: Date = new Date(),
): Omit<KPIsDashboard, 'actualizadoEn'> {
  const ev = calcularEVDesdeTareas(tareas)
  const ac = calcularACDesdeTareas(tareas)
  const pv = calcularPVDesdeTareas(tareas, fecha)

  const spi = calcularSPI(ev, pv)
  const cpi = calcularCPI(ev, ac)
  const eac = calcularEAC(bac, cpi)

  const semaforoSPI = calcularSemaforoSPI(spi)
  const semaforoCPI = calcularSemaforoCPI(cpi)
  const semaforoGeneral = calcularSemaforoGeneral(semaforoSPI, semaforoCPI)

  const tareasActivas = tareas.filter((t) => t.estado !== 'suspendida')
  const completadas = tareasActivas.filter((t) => t.estado === 'completada').length
  const pctAvanceTareas = tareasActivas.length > 0 ? (completadas / tareasActivas.length) * 100 : 0
  const pctAvancePonderado = bac > 0 ? (ev / bac) * 100 : 0

  return { spi, cpi, pv, ev, ac, eac, bac, pctAvanceTareas, pctAvancePonderado, semaforoGeneral }
}

/**
 * Construye el payload de SnapshotEVM a partir de tareas y BAC.
 * Listo para guardarse en Firestore (sin conversión Timestamp — el llamador lo hace).
 */
export function construirSnapshotDesdeTareas(
  tareas: Tarea[],
  bac: number,
  fecha: Date = new Date(),
): Omit<SnapshotEVM, 'creadoEn'> {
  const ev = calcularEVDesdeTareas(tareas)
  const ac = calcularACDesdeTareas(tareas)
  const pv = calcularPVDesdeTareas(tareas, fecha)

  const spi = calcularSPI(ev, pv)
  const cpi = calcularCPI(ev, ac)
  const sv = calcularSV(ev, pv)
  const cv = calcularCV(ev, ac)
  const eac = calcularEAC(bac, cpi)
  const etc = calcularETC(eac, ac)
  const tcpi = calcularTCPI(bac, ev, ac)

  const semaforoSPIRaw = calcularSemaforoSPI(spi)
  const semaforoCPIRaw = calcularSemaforoCPI(cpi)

  return {
    fecha,
    bac,
    pv,
    ev,
    ac,
    spi,
    cpi,
    sv,
    cv,
    eac,
    etc,
    tcpi,
    semaforoSPI: semaforoSPIRaw === 'sin_datos' ? 'rojo' : semaforoSPIRaw,
    semaforoCPI: semaforoCPIRaw === 'sin_datos' ? 'rojo' : semaforoCPIRaw,
  }
}
