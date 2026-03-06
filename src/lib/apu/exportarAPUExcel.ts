/**
 * exportarAPUExcel — M5-S03
 * Genera un CSV estructurado del APU para abrir en Excel.
 *
 * Estrategia: CSV nativo sin dependencias externas.
 *   - Separador: `;` (compatibilidad Excel es-CL)
 *   - BOM: `\ufeff` (UTF-8 BOM para que Excel detecte codificación)
 *   - Columna "Tipo Fila": "APU" | "PARTIDA" | "INSUMO"
 *   - Las filas hijas usan indentación visual en columna Descripción
 *
 * ¿Por qué CSV nativo y no xlsx?
 *   xlsx no está en package.json. CSV con separador `;` + BOM es el
 *   estándar del proyecto (ver exportarEVMCSV en export-utils.ts)
 *   y abre correctamente en Excel es-CL sin dependencias adicionales.
 */

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { APU } from '@/types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 40)
}

/** Escapa una celda para CSV: envuelve en comillas y escapa comillas internas. */
function esc(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '""'
  const s = String(value).replace(/"/g, '""')
  return `"${s}"`
}

function fmtN(n: number): string {
  return n.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function simb(moneda: string): string {
  const map: Record<string, string> = { CLP: '$', USD: 'US$', UF: 'UF', PEN: 'S/', EUR: '€' }
  return map[moneda] ?? moneda
}

const TIPO_LABEL: Record<string, string> = {
  material:     'Material',
  mano_de_obra: 'Mano de Obra',
  equipo:       'Equipo',
  subcontrato:  'Subcontrato',
}

// ── Definición de columnas ────────────────────────────────────────────────────

/**
 * Columnas del CSV (en orden).
 * Las columnas vacías en cada nivel se rellenan con "".
 *
 * Jerarquía visual:
 *   APU:     Tipo Fila = "APU"     → rellena columnas de APU
 *   PARTIDA: Tipo Fila = "PARTIDA" → repite info APU, rellena columnas de partida
 *   INSUMO:  Tipo Fila = "INSUMO"  → repite APU+partida, rellena columnas de insumo
 */
const HEADERS = [
  // Meta
  'Tipo Fila',
  // APU
  'APU Nombre',
  'APU Estado',
  'APU Versión',
  'APU Moneda',
  'APU Fecha Actualización',
  // Partida
  'Partida Código',
  'Partida Descripción',
  'Partida Unidad',
  'Partida GG%',
  'Partida Utilidad%',
  'Partida Costo Directo',
  'Partida Precio Unitario',
  // Insumo
  'Insumo Tipo',
  'Insumo Descripción',
  'Insumo Código',
  'Insumo Unidad',
  'Insumo Cantidad',
  'Insumo Precio Unitario',
  'Insumo Subtotal',
  // Totales APU (solo fila APU)
  'Total Costo Directo',
  'Total GG+Utilidad',
  'Total APU',
] as const

// ── Función pública ───────────────────────────────────────────────────────────

/**
 * Genera y descarga un CSV del APU con estructura jerárquica APU > PARTIDA > INSUMO.
 * @param apu           - Objeto APU completo (datos ya en memoria, sin nueva query).
 * @param nombreProyecto - Nombre del proyecto (para nombre del archivo).
 */
export function exportarAPUExcel(apu: APU, nombreProyecto: string): void {
  const fechaActualizacion = format(
    new Date(apu.actualizadoEn),
    "d MMM yyyy HH:mm",
    { locale: es },
  )

  const totalCostoDirecto  = apu.partidas.reduce((s, p) => s + p.costoDirecto, 0)
  const totalPrecioTotal   = apu.partidas.reduce((s, p) => s + p.precioUnitario, 0)
  const totalGG            = Math.max(0, totalPrecioTotal - totalCostoDirecto)
  const s                  = simb(apu.moneda)

  // Acumulador de filas
  const rows: string[][] = []

  // ── Fila APU (1 por documento) ─────────────────────────────────────────────
  rows.push([
    'APU',
    apu.nombre,
    apu.estado,
    `v${apu.version}`,
    apu.moneda,
    fechaActualizacion,
    // Partida (vacío)
    '', '', '', '', '', '', '',
    // Insumo (vacío)
    '', '', '', '', '', '', '',
    // Totales
    `${s} ${fmtN(totalCostoDirecto)}`,
    `${s} ${fmtN(totalGG)}`,
    `${s} ${fmtN(totalPrecioTotal)}`,
  ])

  // ── Filas PARTIDA e INSUMO ─────────────────────────────────────────────────
  apu.partidas.forEach((partida) => {
    // Fila PARTIDA
    rows.push([
      'PARTIDA',
      apu.nombre,
      apu.estado,
      `v${apu.version}`,
      apu.moneda,
      fechaActualizacion,
      // Partida
      partida.codigo,
      partida.descripcion,
      partida.unidad,
      String(partida.ggPct),
      String(partida.utilidadPct),
      `${s} ${fmtN(partida.costoDirecto)}`,
      `${s} ${fmtN(partida.precioUnitario)}`,
      // Insumo (vacío)
      '', '', '', '', '', '', '',
      // Totales (vacío en fila de partida)
      '', '', '',
    ])

    // Filas INSUMO
    partida.insumos.forEach((insumo) => {
      rows.push([
        'INSUMO',
        apu.nombre,
        apu.estado,
        `v${apu.version}`,
        apu.moneda,
        fechaActualizacion,
        // Partida (repetida para contexto)
        partida.codigo,
        partida.descripcion,
        partida.unidad,
        String(partida.ggPct),
        String(partida.utilidadPct),
        `${s} ${fmtN(partida.costoDirecto)}`,
        `${s} ${fmtN(partida.precioUnitario)}`,
        // Insumo
        TIPO_LABEL[insumo.tipo] ?? insumo.tipo,
        `  ${insumo.descripcion}`,   // indentación visual con espacios
        insumo.codigo ?? '',
        insumo.unidad,
        fmtN(insumo.cantidad),
        `${s} ${fmtN(insumo.precioUnitario)}`,
        `${s} ${fmtN(insumo.subtotal)}`,
        // Totales (vacío)
        '', '', '',
      ])
    })
  })

  // ── Serializar CSV ─────────────────────────────────────────────────────────
  const csv = [
    HEADERS.map(esc).join(';'),
    ...rows.map((row) => row.map(esc).join(';')),
  ].join('\r\n')

  // BOM + descarga
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `apu-${slugify(apu.nombre)}-${slugify(nombreProyecto)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
