'use client'

// ============================================================
// COMPONENTE: ExportarSRSModal
// Exporta el SRS en JSON, PDF, DOCX o copia el enlace
// ============================================================

import { useState } from 'react'
import { toast } from 'sonner'
import {
  FileJson, FileText, FileType2, Link as LinkIcon, Download, X,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ESTADO_SRS_CONFIG } from '@/constants'
import type { SRS, Proyecto } from '@/types'

// -------------------------------------------------------
// TIPOS
// -------------------------------------------------------

interface Props {
  srs: SRS
  proyecto: Proyecto
  onClose: () => void
}

type ExportKey = 'json' | 'pdf' | 'docx' | 'link'

// -------------------------------------------------------
// HELPERS
// -------------------------------------------------------

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function srsFilename(proyecto: Proyecto, ext: string) {
  const codigo = proyecto.codigo.replace(/[^a-zA-Z0-9-_]/g, '_')
  return `SRS-${codigo}.${ext}`
}

// -------------------------------------------------------
// EXPORT HANDLERS
// -------------------------------------------------------

async function exportJSON(srs: SRS, proyecto: Proyecto) {
  const payload = JSON.stringify(
    { exportadoEn: new Date().toISOString(), proyecto: { id: proyecto.id, codigo: proyecto.codigo, nombre: proyecto.nombre }, srs },
    null,
    2,
  )
  const blob = new Blob([payload], { type: 'application/json' })
  triggerDownload(blob, srsFilename(proyecto, 'json'))
}

async function exportPDF(srs: SRS, proyecto: Proyecto) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  const estadoCfg = ESTADO_SRS_CONFIG[srs.estado]
  const margin = 20
  let y = margin

  const addLine = (text: string, size = 11, bold = false) => {
    doc.setFontSize(size)
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    const lines = doc.splitTextToSize(text, 210 - margin * 2) as string[]
    lines.forEach((line) => {
      if (y > 270) { doc.addPage(); y = margin }
      doc.text(line, margin, y)
      y += size * 0.4 + 1
    })
  }

  const addSection = (title: string) => {
    y += 4
    if (y > 260) { doc.addPage(); y = margin }
    doc.setDrawColor(220, 220, 220)
    doc.line(margin, y, 210 - margin, y)
    y += 5
    addLine(title, 13, true)
    y += 1
  }

  // Portada
  addLine('ESPECIFICACIÓN DE REQUERIMIENTOS DE SOFTWARE', 16, true)
  y += 2
  addLine(`${proyecto.nombre}`, 13)
  addLine(`Código: ${proyecto.codigo}  ·  Versión: ${srs.version}`, 10)
  addLine(`Estado: ${estadoCfg?.label ?? srs.estado}`, 10)
  if (srs.tipoSRS) addLine(`Tipo SRS: ${srs.tipoSRS}`, 10)
  addLine(`Exportado el: ${new Date().toLocaleDateString('es-CL', { dateStyle: 'long' })}`, 10)
  y += 6

  // Fase 1
  addSection('FASE 1 — Inicio del Negocio')
  if (srs.declaracionProblema) addLine(`Declaración del problema:\n${srs.declaracionProblema}`)
  if (srs.objetivosNegocio?.length) {
    addLine('Objetivos del negocio:', 11, true)
    srs.objetivosNegocio.forEach((o, i) => addLine(`  ${i + 1}. ${o}`))
  }
  if (srs.sistemasExistentes?.length) {
    addLine('Sistemas existentes:', 11, true)
    srs.sistemasExistentes.forEach((s) => addLine(`  • ${s}`))
  }

  // Fase 2
  if (srs.tecnicasActivas?.length || srs.analisisOrganizacional) {
    addSection('FASE 2 — Adquisición')
    if (srs.tecnicasActivas?.length) {
      addLine(`Técnicas activas: ${srs.tecnicasActivas.join(', ')}`)
    }
    if (srs.analisisOrganizacional) {
      const ao = srs.analisisOrganizacional
      if (ao.estructuraDecisiones) addLine(`Estructura de decisiones: ${ao.estructuraDecisiones}`)
      if (ao.factoresPoliticos) addLine(`Factores políticos: ${ao.factoresPoliticos}`)
    }
  }

  // Fase 5 — Secciones SRS
  if (srs.secciones) {
    addSection('FASE 5 — Especificación SRS')
    const sec = srs.secciones
    if (sec.s1_introduccion?.contenido) addLine(`Sección 1 — Introducción:\n${sec.s1_introduccion.contenido}`)
    if (sec.s2_descripcionGeneral?.contenido) addLine(`Sección 2 — Descripción general:\n${sec.s2_descripcionGeneral.contenido}`)
  }

  // Fase 8
  if (srs.planDespliegue) {
    addSection('FASE 8 — Transición')
    if ((srs.planDespliegue as { descripcion?: string }).descripcion) {
      addLine(String((srs.planDespliegue as { descripcion?: string }).descripcion))
    }
  }

  // Aprobación
  if (srs.aprobadoPorNombre || srs.fechaAprobacion) {
    addSection('APROBACIÓN')
    if (srs.aprobadoPorNombre) addLine(`Aprobado por: ${srs.aprobadoPorNombre}`)
    if (srs.fechaAprobacion) {
      addLine(`Fecha de aprobación: ${new Date(srs.fechaAprobacion).toLocaleDateString('es-CL', { dateStyle: 'long' })}`)
    }
  }

  // Número de página
  const pageCount = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(150)
    doc.text(`Página ${i} de ${pageCount}  ·  ${proyecto.codigo} — SRS ${srs.version}`, margin, 290)
    doc.setTextColor(0)
  }

  doc.save(srsFilename(proyecto, 'pdf'))
}

async function exportDOCX(srs: SRS, proyecto: Proyecto) {
  const { Document, Paragraph, TextRun, HeadingLevel, Packer, AlignmentType } = await import('docx')

  const estadoCfg = ESTADO_SRS_CONFIG[srs.estado]

  const heading = (text: string, level: typeof HeadingLevel[keyof typeof HeadingLevel]) =>
    new Paragraph({ text, heading: level, spacing: { before: 300, after: 100 } })

  const para = (text: string) =>
    new Paragraph({ children: [new TextRun(text)], spacing: { after: 80 } })

  const children: InstanceType<typeof Paragraph>[] = []

  // Portada
  children.push(
    new Paragraph({
      children: [new TextRun({ text: 'Especificación de Requerimientos de Software', bold: true, size: 32 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: proyecto.nombre, size: 26 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Código: ${proyecto.codigo}  ·  Versión: ${srs.version}`, size: 20 })],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [new TextRun({ text: `Estado: ${estadoCfg?.label ?? srs.estado}`, size: 20 })],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [new TextRun({ text: `Exportado el ${new Date().toLocaleDateString('es-CL', { dateStyle: 'long' })}`, size: 18, color: '666666' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),
  )

  // Fase 1
  children.push(heading('Fase 1 — Inicio del Negocio', HeadingLevel.HEADING_1))
  if (srs.declaracionProblema) {
    children.push(heading('Declaración del problema', HeadingLevel.HEADING_2))
    children.push(para(srs.declaracionProblema))
  }
  if (srs.objetivosNegocio?.length) {
    children.push(heading('Objetivos del negocio', HeadingLevel.HEADING_2))
    srs.objetivosNegocio.forEach((o, i) => children.push(para(`${i + 1}. ${o}`)))
  }
  if (srs.sistemasExistentes?.length) {
    children.push(heading('Sistemas existentes', HeadingLevel.HEADING_2))
    srs.sistemasExistentes.forEach((s) => children.push(para(`• ${s}`)))
  }

  // Fase 2
  if (srs.tecnicasActivas?.length || srs.analisisOrganizacional) {
    children.push(heading('Fase 2 — Adquisición', HeadingLevel.HEADING_1))
    if (srs.tecnicasActivas?.length) {
      children.push(heading('Técnicas activas', HeadingLevel.HEADING_2))
      children.push(para(srs.tecnicasActivas.join(', ')))
    }
    if (srs.analisisOrganizacional?.estructuraDecisiones) {
      children.push(heading('Estructura de decisiones', HeadingLevel.HEADING_2))
      children.push(para(srs.analisisOrganizacional.estructuraDecisiones))
    }
  }

  // Fase 5
  if (srs.secciones) {
    children.push(heading('Fase 5 — Especificación SRS', HeadingLevel.HEADING_1))
    const sec = srs.secciones
    if (sec.s1_introduccion?.contenido) {
      children.push(heading('Sección 1 — Introducción', HeadingLevel.HEADING_2))
      children.push(para(sec.s1_introduccion.contenido))
    }
    if (sec.s2_descripcionGeneral?.contenido) {
      children.push(heading('Sección 2 — Descripción general', HeadingLevel.HEADING_2))
      children.push(para(sec.s2_descripcionGeneral.contenido))
    }
  }

  // Aprobación
  if (srs.aprobadoPorNombre || srs.fechaAprobacion) {
    children.push(heading('Aprobación', HeadingLevel.HEADING_1))
    if (srs.aprobadoPorNombre) children.push(para(`Aprobado por: ${srs.aprobadoPorNombre}`))
    if (srs.fechaAprobacion) {
      children.push(para(`Fecha: ${new Date(srs.fechaAprobacion).toLocaleDateString('es-CL', { dateStyle: 'long' })}`))
    }
  }

  const doc = new Document({
    sections: [{ children }],
  })

  const blob = await Packer.toBlob(doc)
  triggerDownload(blob, srsFilename(proyecto, 'docx'))
}

async function copyLink() {
  await navigator.clipboard.writeText(window.location.href)
  toast.success('Enlace copiado al portapapeles')
}

// -------------------------------------------------------
// COMPONENT
// -------------------------------------------------------

const EXPORT_OPTIONS: Array<{
  key: ExportKey
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
  variant?: 'default' | 'outline'
}> = [
  {
    key: 'json',
    icon: FileJson,
    label: 'Exportar JSON',
    description: 'Datos completos del SRS en formato estructurado (JSON).',
  },
  {
    key: 'pdf',
    icon: FileText,
    label: 'Exportar PDF',
    description: 'Documento PDF formateado con todas las secciones del SRS.',
  },
  {
    key: 'docx',
    icon: FileType2,
    label: 'Exportar DOCX',
    description: 'Documento Word editable con estructura por fases.',
  },
  {
    key: 'link',
    icon: LinkIcon,
    label: 'Copiar enlace',
    description: 'Copia la URL de esta página para compartir el SRS.',
    variant: 'outline',
  },
]

export function ExportarSRSModal({ srs, proyecto, onClose }: Props) {
  const [loading, setLoading] = useState<ExportKey | null>(null)

  const handleExport = async (key: ExportKey) => {
    setLoading(key)
    try {
      if (key === 'json') await exportJSON(srs, proyecto)
      else if (key === 'pdf') await exportPDF(srs, proyecto)
      else if (key === 'docx') await exportDOCX(srs, proyecto)
      else if (key === 'link') await copyLink()

      if (key !== 'link') toast.success(`SRS exportado como ${key.toUpperCase()}`)
    } catch (err) {
      console.error('[ExportarSRSModal] Error al exportar:', err)
      toast.error(`Error al exportar ${key.toUpperCase()}. Intenta nuevamente.`)
    } finally {
      setLoading(null)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportar SRS
          </DialogTitle>
          <DialogDescription>
            {proyecto.codigo} · {srs.version} · Selecciona el formato de exportación.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {EXPORT_OPTIONS.map((opt) => {
            const Icon = opt.icon
            const isLoading = loading === opt.key
            return (
              <div
                key={opt.key}
                className="flex items-center gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{opt.description}</p>
                </div>
                <Button
                  size="sm"
                  variant={opt.variant ?? 'default'}
                  disabled={loading !== null}
                  onClick={() => handleExport(opt.key)}
                  className="shrink-0"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-1.5">
                      <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Exportando…
                    </span>
                  ) : opt.key === 'link' ? 'Copiar' : 'Descargar'}
                </Button>
              </div>
            )
          })}
        </div>

        <div className="flex justify-end pt-1">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4 mr-1.5" />
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
