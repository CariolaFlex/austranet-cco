'use client'

// ============================================================
// TabAPU — M5-S02
// Tab "Presupuesto APU" dentro de ProyectoDetalle.
// Layout: lista de APUs (izq.) + detalle del APU seleccionado (der.)
// ============================================================

import { useState } from 'react'
import { ChevronLeft, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  onVolver: () => void
}

function APUDetalle({ apuId, onVolver }: APUDetalleProps) {
  const { data: apu, isLoading, error } = useAPU(apuId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse bg-muted rounded-md" />
        <div className="h-24 animate-pulse bg-muted rounded-md" />
        <div className="h-64 animate-pulse bg-muted rounded-md" />
      </div>
    )
  }

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

  return (
    <div className="space-y-5">
      {/* Header con botón volver (visible en mobile) */}
      <div className="flex items-center gap-3 lg:hidden">
        <Button variant="ghost" size="sm" onClick={onVolver}>
          <ChevronLeft className="h-4 w-4 mr-1" /> APUs
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium truncate">{apu.nombre}</span>
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
