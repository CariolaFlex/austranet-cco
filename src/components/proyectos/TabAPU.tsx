'use client'

// ============================================================
// TabAPU — M5-S02/S03
// Tab "Presupuesto APU" dentro de ProyectoDetalle.
// Layout: lista de APUs (izq.) + detalle del APU seleccionado (der.)
// M5-S03: botón Exportar (PDF / Excel-CSV) en la cabecera del detalle.
// ============================================================

import { useState } from 'react'
import { ChevronLeft, Calculator, Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { APUList } from '@/components/apu/APUList'
import { TablaPartidas } from '@/components/apu/TablaPartidas'
import { APUResumenCostos } from '@/components/apu/APUResumenCostos'
import { useAPU } from '@/hooks/useAPU'
import type { Proyecto } from '@/types'

// -------------------------------------------------------
// TIPOS
// -------------------------------------------------------

interface TabAPUProps {
  proyecto: Proyecto
}

// -------------------------------------------------------
// COMPONENTE
// -------------------------------------------------------

export function TabAPU({ proyecto }: TabAPUProps) {
  const [apuSeleccionadoId, setApuSeleccionadoId] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {/* Layout split cuando hay un APU seleccionado en pantallas medianas+ */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Panel izquierdo — lista */}
        <div className={
          apuSeleccionadoId
            ? 'w-full lg:w-80 lg:flex-shrink-0'
            : 'w-full'
        }>
          {/* Header del tab */}
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold">Análisis de Precios Unitarios</h2>
          </div>
          <APUList
            proyectoId={proyecto.id}
            apuSeleccionadoId={apuSeleccionadoId}
            onSelect={(id) => setApuSeleccionadoId(id || null)}
          />
        </div>

        {/* Panel derecho — detalle del APU seleccionado */}
        {apuSeleccionadoId && (
          <div className="flex-1 min-w-0">
            <APUDetalle
              apuId={apuSeleccionadoId}
              nombreProyecto={proyecto.nombre}
              onVolver={() => setApuSeleccionadoId(null)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// -------------------------------------------------------
// APUDetalle — subcomponente interno
// -------------------------------------------------------

interface APUDetalleProps {
  apuId: string
  nombreProyecto: string
  onVolver: () => void
}

function APUDetalle({ apuId, nombreProyecto, onVolver }: APUDetalleProps) {
  const { data: apu, isLoading, error } = useAPU(apuId)
  const [exportando, setExportando] = useState<'pdf' | 'excel' | null>(null)

  // ── Handlers de exportación ────────────────────────────────────────────────
  async function handleExportarPDF() {
    if (!apu || exportando) return
    setExportando('pdf')
    try {
      const { exportarAPUPDF } = await import('@/lib/apu/exportarAPUPDF')
      await exportarAPUPDF(apu, nombreProyecto)
      toast.success('PDF descargado correctamente')
    } catch (err) {
      toast.error(`Error al generar PDF: ${err instanceof Error ? err.message : 'Error desconocido'}`)
    } finally {
      setExportando(null)
    }
  }

  async function handleExportarExcel() {
    if (!apu || exportando) return
    setExportando('excel')
    try {
      const { exportarAPUExcel } = await import('@/lib/apu/exportarAPUExcel')
      exportarAPUExcel(apu, nombreProyecto)
      toast.success('CSV descargado correctamente')
    } catch (err) {
      toast.error(`Error al generar CSV: ${err instanceof Error ? err.message : 'Error desconocido'}`)
    } finally {
      setExportando(null)
    }
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse bg-muted rounded-md" />
        <div className="h-24 animate-pulse bg-muted rounded-md" />
        <div className="h-64 animate-pulse bg-muted rounded-md" />
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !apu) {
    return (
      <div className="space-y-3">
        <Button variant="ghost" size="sm" onClick={onVolver}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Volver
        </Button>
        <div className="rounded-md border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
          Error al cargar APU{error ? `: ${error.message}` : ''}
        </div>
      </div>
    )
  }

  // ── Contenido ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header: volver (mobile) + nombre + botón exportar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Botón volver solo en mobile */}
          <Button variant="ghost" size="sm" onClick={onVolver} className="lg:hidden shrink-0">
            <ChevronLeft className="h-4 w-4 mr-1" /> APUs
          </Button>
          <span className="text-sm font-semibold truncate hidden lg:block">{apu.nombre}</span>
        </div>

        {/* Botón Exportar con dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={!!exportando}
              className="shrink-0 gap-1.5"
            >
              {exportando ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {exportando === 'pdf' ? 'Generando PDF…'
                : exportando === 'excel' ? 'Generando CSV…'
                  : 'Exportar'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onClick={handleExportarPDF}
              disabled={!!exportando}
              className="gap-2 cursor-pointer"
            >
              <FileText className="h-4 w-4 text-red-500" />
              Descargar PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleExportarExcel}
              disabled={!!exportando}
              className="gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
              Descargar Excel / CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Resumen de costos */}
      <APUResumenCostos apu={apu} />

      {/* Tabla de partidas */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          Partidas
          <span className="text-muted-foreground font-normal text-xs">
            ({apu.partidas.length})
          </span>
        </h3>
        <TablaPartidas apu={apu} />
      </div>
    </div>
  )
}
