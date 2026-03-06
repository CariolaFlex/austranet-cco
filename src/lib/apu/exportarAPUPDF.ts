/**
 * exportarAPUPDF — M5-S03
 * Genera un PDF estructurado del APU usando jsPDF (lazy import, sin SSR).
 * Patrón: mismo que src/lib/export-utils.ts — función pura async, sin React.
 *
 * Estructura del PDF:
 *   Portada → por cada partida: tabla partida + tabla de insumos → resumen total.
 */

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { APU } from '@/types'

// ── Constantes de diseño ─────────────────────────────────────────────────────

const M    = 14          // Margen en mm
const PW   = 210         // Ancho página A4
const PH   = 297         // Alto página A4
const UW   = PW - M * 2  // Ancho utilizable = 182 mm

const ROW_H  = 6.5       // Alto fila de datos
const HDRL_H = 7.5       // Alto fila de encabezado de tabla
const SEC_H  = 8         // Alto encabezado de sección
const META_H = 13        // Alto bloque de metadata

// Paleta de colores [R, G, B]
const C_PRIMARY     = [37, 99, 235] as const   // blue-600
const C_HEADER_BG   = [239, 246, 255] as const  // blue-50
const C_HEADER_TEXT = [30, 64, 175] as const    // blue-800
const C_TH_BG       = [30, 64, 175] as const    // blue-800 (table header)
const C_TH_TEXT     = [255, 255, 255] as const  // white
const C_GRID        = [209, 213, 219] as const  // gray-300
const C_ALT         = [249, 250, 251] as const  // gray-50 (alternating row)
const C_BLACK       = [17, 24, 39] as const     // gray-900
const C_MUTED       = [107, 114, 128] as const  // gray-500

// ── Definición de columnas ───────────────────────────────────────────────────

interface Col {
  header: string
  w: number
  align?: 'L' | 'R' | 'C'
}

// Tabla de partidas — suma = 182 mm
const COLS_PARTIDAS: Col[] = [
  { header: 'Código',        w: 22, align: 'L' },
  { header: 'Descripción',   w: 60, align: 'L' },
  { header: 'Unidad',        w: 16, align: 'C' },
  { header: 'Costo Directo', w: 26, align: 'R' },
  { header: 'GG%',           w: 12, align: 'R' },
  { header: 'Util%',         w: 12, align: 'R' },
  { header: 'P. Unitario',   w: 34, align: 'R' },
]

// Tabla de insumos — suma = 182 mm
const COLS_INSUMOS: Col[] = [
  { header: 'Tipo',          w: 22, align: 'L' },
  { header: 'Descripción',   w: 62, align: 'L' },
  { header: 'Unidad',        w: 15, align: 'C' },
  { header: 'Cantidad',      w: 19, align: 'R' },
  { header: 'P. Unitario',   w: 28, align: 'R' },
  { header: 'Subtotal',      w: 36, align: 'R' },
]

// Tabla resumen final — suma = 182 mm
const COLS_RESUMEN: Col[] = [
  { header: 'Descripción',   w: 104, align: 'L' },
  { header: 'Importe',       w: 78,  align: 'R' },
]

// ── Helpers locales ───────────────────────────────────────────────────────────

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 40)
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function simb(moneda: string): string {
  const map: Record<string, string> = { CLP: '$', USD: 'US$', UF: 'UF', PEN: 'S/', EUR: '€' }
  return map[moneda] ?? moneda
}

function fmtN(n: number): string {
  return n.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

const TIPO_LABEL: Record<string, string> = {
  material:     'Material',
  mano_de_obra: 'Mano de Obra',
  equipo:       'Equipo',
  subcontrato:  'Subcont.',
}

// ── Función pública ──────────────────────────────────────────────────────────

/**
 * Genera y descarga el PDF del APU.
 * @param apu          - Objeto APU con partidas e insumos ya cargados en memoria.
 * @param nombreProyecto - Nombre del proyecto (para portada y nombre del archivo).
 */
export async function exportarAPUPDF(apu: APU, nombreProyecto: string): Promise<void> {
  const { jsPDF } = await import('jspdf')

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  pdf.setLineWidth(0.1)

  let y = M  // posición vertical actual

  // ── HELPER: verificar espacio y saltar página si es necesario ──────────────
  function ensureSpace(needed: number): void {
    if (y + needed > PH - M - 8) {
      pdf.addPage()
      y = M
    }
  }

  // ── HELPER: dibujar una fila de tabla ─────────────────────────────────────
  function drawRow(
    cols: Col[],
    data: string[],
    x: number,
    rowY: number,
    h: number,
    opts: {
      fillColor?: readonly [number, number, number]
      textColor?: readonly [number, number, number]
      bold?: boolean
      fontSize?: number
    } = {},
  ): void {
    const {
      fillColor,
      textColor = C_BLACK,
      bold = false,
      fontSize = 8,
    } = opts

    const totalW = cols.reduce((s, c) => s + c.w, 0)

    // Fondo
    if (fillColor) {
      pdf.setFillColor(fillColor[0], fillColor[1], fillColor[2])
      pdf.rect(x, rowY, totalW, h, 'F')
    }

    // Borde exterior
    pdf.setDrawColor(C_GRID[0], C_GRID[1], C_GRID[2])
    pdf.rect(x, rowY, totalW, h, 'S')

    // Fuente y color de texto
    pdf.setFont('helvetica', bold ? 'bold' : 'normal')
    pdf.setFontSize(fontSize)
    pdf.setTextColor(textColor[0], textColor[1], textColor[2])

    // Texto por celda + divisores verticales
    let cx = x
    cols.forEach((col, i) => {
      if (i > 0) {
        pdf.setDrawColor(C_GRID[0], C_GRID[1], C_GRID[2])
        pdf.line(cx, rowY, cx, rowY + h)
      }

      const rawText = String(data[i] ?? '')
      // Truncar si no cabe en la celda (usa splitTextToSize para precisión real)
      const maxW = col.w - 4
      const lines = pdf.splitTextToSize(rawText, maxW) as string[]
      const cellText = lines.length > 1 ? lines[0].slice(0, -1) + '…' : lines[0]

      const midY = rowY + h / 2
      const align = col.align ?? 'L'

      if (align === 'R') {
        pdf.text(cellText, cx + col.w - 2, midY, { align: 'right', baseline: 'middle' })
      } else if (align === 'C') {
        pdf.text(cellText, cx + col.w / 2, midY, { align: 'center', baseline: 'middle' })
      } else {
        pdf.text(cellText, cx + 2, midY, { align: 'left', baseline: 'middle' })
      }

      cx += col.w
    })
  }

  // ── HELPER: encabezado de tabla (header row) ───────────────────────────────
  function drawTableHeaders(cols: Col[], x: number, rowY: number): number {
    drawRow(cols, cols.map((c) => c.header), x, rowY, HDRL_H, {
      fillColor: C_TH_BG,
      textColor: C_TH_TEXT,
      bold: true,
      fontSize: 7.5,
    })
    return rowY + HDRL_H
  }

  // ── HELPER: encabezado de sección (barra azul) ─────────────────────────────
  function drawSectionHeader(label: string, sY: number): number {
    pdf.setFillColor(C_HEADER_BG[0], C_HEADER_BG[1], C_HEADER_BG[2])
    pdf.rect(M, sY, UW, SEC_H, 'F')
    pdf.setDrawColor(C_PRIMARY[0], C_PRIMARY[1], C_PRIMARY[2])
    pdf.rect(M, sY, UW, SEC_H, 'S')
    // Acento izquierdo
    pdf.setFillColor(C_PRIMARY[0], C_PRIMARY[1], C_PRIMARY[2])
    pdf.rect(M, sY, 2.5, SEC_H, 'F')
    // Texto
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(8)
    pdf.setTextColor(C_HEADER_TEXT[0], C_HEADER_TEXT[1], C_HEADER_TEXT[2])
    // Truncar label si es muy largo
    const maxLabelW = UW - 10
    const lines = pdf.splitTextToSize(label, maxLabelW) as string[]
    pdf.text(lines[0], M + 5, sY + SEC_H / 2, { baseline: 'middle' })
    return sY + SEC_H
  }

  // ============================================================
  // 1. PORTADA / CABECERA
  // ============================================================

  // Bloque azul principal
  pdf.setFillColor(C_PRIMARY[0], C_PRIMARY[1], C_PRIMARY[2])
  pdf.rect(M, y, UW, 26, 'F')

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)
  pdf.setTextColor(180, 210, 255)
  pdf.text('ANÁLISIS DE PRECIOS UNITARIOS', M + 5, y + 5, { baseline: 'top' })

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)
  pdf.setTextColor(200, 225, 255)
  pdf.text(`Proyecto: ${nombreProyecto}`, M + 5, y + 10.5, { baseline: 'top' })

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(13)
  pdf.setTextColor(255, 255, 255)
  // Truncar nombre APU si es muy largo para la portada
  const apuNombrePDF = (pdf.splitTextToSize(apu.nombre, UW - 12) as string[])[0]
  pdf.text(apuNombrePDF, M + 5, y + 17.5, { baseline: 'top' })

  y += 29

  // Bloque de metadata (5 columnas)
  const metaCols = [
    { label: 'Estado',   value: apu.estado.charAt(0).toUpperCase() + apu.estado.slice(1) },
    { label: 'Versión',  value: `v${apu.version}` },
    { label: 'Fecha',    value: format(new Date(apu.actualizadoEn), "d MMM yyyy", { locale: es }) },
    { label: 'Moneda',   value: apu.moneda },
    { label: 'Partidas', value: String(apu.partidas.length) },
  ]
  const metaCW = UW / metaCols.length

  pdf.setFillColor(248, 250, 252)
  pdf.rect(M, y, UW, META_H, 'F')
  pdf.setDrawColor(C_GRID[0], C_GRID[1], C_GRID[2])
  pdf.rect(M, y, UW, META_H, 'S')

  metaCols.forEach((mc, i) => {
    const mx = M + i * metaCW
    if (i > 0) {
      pdf.setDrawColor(C_GRID[0], C_GRID[1], C_GRID[2])
      pdf.line(mx, y, mx, y + META_H)
    }
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(6.5)
    pdf.setTextColor(C_MUTED[0], C_MUTED[1], C_MUTED[2])
    pdf.text(mc.label, mx + metaCW / 2, y + 4, { align: 'center', baseline: 'middle' })

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(8.5)
    pdf.setTextColor(C_BLACK[0], C_BLACK[1], C_BLACK[2])
    pdf.text(mc.value, mx + metaCW / 2, y + 9.5, { align: 'center', baseline: 'middle' })
  })

  y += META_H + 6

  // ============================================================
  // 2. PARTIDAS (sección + tabla + insumos)
  // ============================================================

  apu.partidas.forEach((partida, idx) => {
    // Asegurar espacio para: sección header + table header + 1 fila mínima
    ensureSpace(SEC_H + HDRL_H + ROW_H + 4)

    // Encabezado de partida
    y = drawSectionHeader(
      `PARTIDA ${idx + 1}: ${partida.codigo} — ${partida.descripcion} (${partida.unidad})`,
      y,
    )

    // Tabla de partida (header + 1 fila de datos)
    ensureSpace(HDRL_H + ROW_H)
    y = drawTableHeaders(COLS_PARTIDAS, M, y)

    drawRow(
      COLS_PARTIDAS,
      [
        partida.codigo,
        partida.descripcion,
        partida.unidad,
        `${simb(apu.moneda)} ${fmtN(partida.costoDirecto)}`,
        `${partida.ggPct}%`,
        `${partida.utilidadPct}%`,
        `${simb(apu.moneda)} ${fmtN(partida.precioUnitario)}`,
      ],
      M, y, ROW_H,
      { fillColor: C_ALT },
    )
    y += ROW_H + 3

    // Sub-tabla de insumos
    if (partida.insumos.length > 0) {
      ensureSpace(5.5 + HDRL_H + ROW_H)

      // Label "Desglose de insumos"
      pdf.setFont('helvetica', 'italic')
      pdf.setFontSize(7.5)
      pdf.setTextColor(C_MUTED[0], C_MUTED[1], C_MUTED[2])
      pdf.text('  Desglose de insumos:', M, y + 3.5, { baseline: 'middle' })
      y += 5.5

      y = drawTableHeaders(COLS_INSUMOS, M, y)

      partida.insumos.forEach((insumo, insIdx) => {
        ensureSpace(ROW_H)
        drawRow(
          COLS_INSUMOS,
          [
            TIPO_LABEL[insumo.tipo] ?? insumo.tipo,
            insumo.descripcion,
            insumo.unidad,
            fmtN(insumo.cantidad),
            `${simb(apu.moneda)} ${fmtN(insumo.precioUnitario)}`,
            `${simb(apu.moneda)} ${fmtN(insumo.subtotal)}`,
          ],
          M, y, ROW_H,
          { fillColor: insIdx % 2 === 1 ? C_ALT : undefined },
        )
        y += ROW_H
      })

      y += 4
    }

    y += 5  // espacio entre partidas
  })

  // ============================================================
  // 3. RESUMEN TOTAL
  // ============================================================

  ensureSpace(SEC_H + HDRL_H + (ROW_H + 1) * 3 + 10)

  y = drawSectionHeader('RESUMEN TOTAL', y)

  const totalCostoDirecto = apu.partidas.reduce((s, p) => s + p.costoDirecto, 0)
  const totalPrecioTotal  = apu.partidas.reduce((s, p) => s + p.precioUnitario, 0)
  const totalGG           = Math.max(0, totalPrecioTotal - totalCostoDirecto)

  y = drawTableHeaders(COLS_RESUMEN, M, y)

  const resumenRows: [string, string][] = [
    ['Costo directo total (Σ insumos)',              `${simb(apu.moneda)} ${fmtN(totalCostoDirecto)}`],
    ['GG + Utilidad estimada',                       `${simb(apu.moneda)} ${fmtN(totalGG)}`],
    [`TOTAL APU (${apu.partidas.length} partida${apu.partidas.length !== 1 ? 's' : ''})`,
      `${simb(apu.moneda)} ${fmtN(totalPrecioTotal)}`],
  ]

  resumenRows.forEach((row, i) => {
    const isTotal = i === resumenRows.length - 1
    drawRow(
      COLS_RESUMEN,
      [row[0], row[1]],
      M, y, ROW_H + 1,
      {
        fillColor: isTotal ? C_TH_BG : (i % 2 === 1 ? C_ALT : undefined),
        textColor: isTotal ? C_TH_TEXT : C_BLACK,
        bold: isTotal,
        fontSize: isTotal ? 8.5 : 8,
      },
    )
    y += ROW_H + 1
  })

  // ── Nota de pie de documento ───────────────────────────────────────────────
  y += 7
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(7)
  pdf.setTextColor(C_MUTED[0], C_MUTED[1], C_MUTED[2])
  pdf.text(
    `Generado el ${format(new Date(), "d 'de' MMMM yyyy 'a las' HH:mm", { locale: es })} · Austranet CCO`,
    PW / 2, y, { align: 'center', baseline: 'top' },
  )

  // ── Numeración de páginas ──────────────────────────────────────────────────
  const pageCount = pdf.getNumberOfPages()
  for (let p = 1; p <= pageCount; p++) {
    pdf.setPage(p)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7)
    pdf.setTextColor(C_MUTED[0], C_MUTED[1], C_MUTED[2])
    pdf.text(
      `Página ${p} de ${pageCount}`,
      PW - M, PH - 6,
      { align: 'right', baseline: 'bottom' },
    )
    // Marca de agua sutil
    pdf.setFontSize(7)
    pdf.setTextColor(C_MUTED[0], C_MUTED[1], C_MUTED[2])
    pdf.text('Austranet CCO', M, PH - 6, { baseline: 'bottom' })
  }

  // ── Guardar ────────────────────────────────────────────────────────────────
  const filename = `apu-${slugify(apu.nombre)}-${slugify(nombreProyecto)}.pdf`
  pdf.save(filename)
}
