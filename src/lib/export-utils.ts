/**
 * export-utils — M4 · Sprint M4-S07
 * Utilidades de exportación: Gantt → PDF, EVM → CSV.
 */

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { SnapshotEVM } from '@/types'

// ── Gantt → PDF ───────────────────────────────────────────────────────────────

/**
 * Exporta el área del Gantt como PDF landscape A4.
 * Serializa los elementos SVG del contenedor y los agrega con jsPDF.addSvgAsImage.
 * @param containerEl  Elemento div que envuelve los SVG del GanttLib
 * @param proyectoNombre  Nombre del proyecto (para título y nombre del archivo)
 */
export async function exportarGanttPDF(
  containerEl: HTMLElement,
  proyectoNombre: string,
): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const pageW = pdf.internal.pageSize.getWidth()    // 297 mm
  const pageH = pdf.internal.pageSize.getHeight()   // 210 mm
  const marginL = 10
  const usableW = pageW - marginL * 2               // 277 mm

  // Título
  pdf.setFontSize(13)
  pdf.text(`Cronograma: ${proyectoNombre}`, marginL, 12)
  pdf.setFontSize(8)
  pdf.setTextColor(120)
  pdf.text(
    `Generado: ${format(new Date(), "d 'de' MMMM yyyy HH:mm", { locale: es })}`,
    marginL,
    18,
  )
  pdf.setTextColor(0)

  const svgs = Array.from(containerEl.querySelectorAll<SVGSVGElement>('svg'))
  if (svgs.length === 0) {
    pdf.setFontSize(10)
    pdf.text('No hay contenido Gantt para exportar.', marginL, 30)
    pdf.save(`gantt-${slugify(proyectoNombre)}.pdf`)
    return
  }

  let yPos = 24
  for (const svg of svgs) {
    const rect = svg.getBoundingClientRect()
    const svgW = rect.width > 0 ? rect.width : (parseFloat(svg.getAttribute('width') ?? '0') || 800)
    const svgH = rect.height > 0 ? rect.height : (parseFloat(svg.getAttribute('height') ?? '0') || 300)

    if (svgW <= 5 || svgH <= 5) continue  // ignorar SVGs triviales (scrollbars, etc.)

    const scale = usableW / svgW
    const pdfH = Math.min(svgH * scale, pageH - yPos - 10)

    if (yPos + 20 > pageH - 10) {
      pdf.addPage()
      yPos = 10
    }

    try {
      const svgString = new XMLSerializer().serializeToString(svg)
      pdf.addSvgAsImage(svgString, marginL, yPos, usableW, pdfH)
      yPos += pdfH + 3
    } catch {
      // ignorar SVGs que no se puedan serializar
    }
  }

  pdf.save(`gantt-${slugify(proyectoNombre)}.pdf`)
}

// ── EVM → CSV ─────────────────────────────────────────────────────────────────

const EVM_CSV_HEADERS = [
  'Fecha', 'BAC', 'PV', 'EV', 'AC',
  'SV', 'CV', 'SPI', 'CPI', 'EAC', 'ETC', 'TCPI',
]

/**
 * Descarga los snapshots EVM como archivo CSV
 * (UTF-8 BOM, separador punto-y-coma para compatibilidad Excel es-CL).
 */
export function exportarEVMCSV(snapshots: SnapshotEVM[], proyectoNombre: string): void {
  if (snapshots.length === 0) return

  const rows = snapshots.map((s) => [
    format(new Date(s.fecha), 'dd/MM/yyyy'),
    s.bac,
    s.pv,
    s.ev,
    s.ac,
    s.sv,
    s.cv,
    s.spi.toFixed(3),
    s.cpi.toFixed(3),
    s.eac,
    s.etc,
    s.tcpi.toFixed(3),
  ])

  const csv = [EVM_CSV_HEADERS, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(';'))
    .join('\r\n')

  downloadBlob(
    new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }),
    `evm-${slugify(proyectoNombre)}.csv`,
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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
