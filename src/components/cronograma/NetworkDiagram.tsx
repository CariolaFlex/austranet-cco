'use client'

/**
 * NetworkDiagram — M4 · Sprint M4-S04
 * Diagrama PERT / Red de Precedencias usando @xyflow/react.
 * Dynamic import con SSR:false — @xyflow/react no es SSR-compatible.
 *
 * Características:
 *  - Nodos custom NodoCPMCustom con 9 celdas PERT estándar
 *  - Layout automático Dagre (izquierda → derecha)
 *  - Aristas coloreadas por tipo de dependencia (FS/SS/FF/SF)
 *  - Controles pan/zoom + botón fit-to-view
 *  - Minimap opcional (habilitado por defecto)
 *  - Panel de leyenda de tipos de dependencia
 */

import dynamic from 'next/dynamic'
import { useState, useMemo } from 'react'
import { Network, Maximize2, Map as MapIcon } from 'lucide-react'
import type { NodeTypes } from '@xyflow/react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTareas } from '@/hooks/useTareas'
import { usePERTData } from './hooks/usePERTData'
import { NodoCPMCustom } from './NodoCPMCustom'
import '@xyflow/react/dist/style.css'

// -------------------------------------------------------
// DYNAMIC IMPORTS — @xyflow/react no es SSR-compatible
// -------------------------------------------------------

const ReactFlow = dynamic(
  () => import('@xyflow/react').then((m) => ({ default: m.ReactFlow })),
  { ssr: false },
)

const Background = dynamic(
  () => import('@xyflow/react').then((m) => ({ default: m.Background })),
  { ssr: false },
)

const Controls = dynamic(
  () => import('@xyflow/react').then((m) => ({ default: m.Controls })),
  { ssr: false },
)

const MiniMap = dynamic(
  () => import('@xyflow/react').then((m) => ({ default: m.MiniMap })),
  { ssr: false },
)

// -------------------------------------------------------
// CONSTANTES
// -------------------------------------------------------

/** Tipos de dependencia con su color y etiqueta — para la leyenda */
const LEYENDA_DEPENDENCIAS = [
  { tipo: 'FS', label: 'Fin → Inicio',    color: '#3b82f6' },
  { tipo: 'SS', label: 'Inicio → Inicio', color: '#22c55e' },
  { tipo: 'FF', label: 'Fin → Fin',       color: '#f97316' },
  { tipo: 'SF', label: 'Inicio → Fin',    color: '#ef4444' },
] as const

// -------------------------------------------------------
// TIPOS
// -------------------------------------------------------

interface NetworkDiagramProps {
  proyectoId: string
  /** Altura del diagrama en px. Default 560. */
  altura?: number
}

// -------------------------------------------------------
// COMPONENTE INTERNO (necesita estar fuera del dynamic para
// que los custom node types funcionen correctamente)
// -------------------------------------------------------

// NodoCPMCustom acepta NodeProps genérico — compatible con NodeTypes de @xyflow/react v12
const NODE_TYPES: NodeTypes = { nodoCPM: NodoCPMCustom }

function NetworkDiagramInner({ proyectoId, altura = 560 }: NetworkDiagramProps) {
  const [mostrarMinimap, setMostrarMinimap] = useState(true)
  const [mostrarLeyenda, setMostrarLeyenda] = useState(true)

  const { data: tareas = [], isLoading } = useTareas(proyectoId)
  const { nodes, edges } = usePERTData(tareas)

  // Estadísticas rápidas
  const stats = useMemo(() => ({
    total:    nodes.length,
    criticas: nodes.filter((n) => n.data.esCritica).length,
    aristas:  edges.length,
  }), [nodes, edges])

  if (isLoading) {
    return <div className="animate-pulse bg-muted rounded-md" style={{ height: altura }} />
  }

  if (!nodes.length) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 text-center bg-muted/30 rounded-lg border-2 border-dashed border-border"
        style={{ height: altura }}
      >
        <Network className="h-10 w-10 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Sin tareas para el diagrama PERT
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Crea tareas de tipo &quot;tarea&quot; con dependencias para visualizar la red.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            <span className="font-semibold text-foreground">{stats.total}</span> tareas
          </span>
          <span>
            <span className="font-semibold text-red-600">{stats.criticas}</span> críticas
          </span>
          <span>
            <span className="font-semibold text-foreground">{stats.aristas}</span> dependencias
          </span>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMostrarLeyenda((v) => !v)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors',
              mostrarLeyenda
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-background border-border text-muted-foreground hover:text-foreground',
            )}
          >
            <Maximize2 className="h-3 w-3" />
            Leyenda
          </button>
          <button
            onClick={() => setMostrarMinimap((v) => !v)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors',
              mostrarMinimap
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-background border-border text-muted-foreground hover:text-foreground',
            )}
          >
            <MapIcon className="h-3 w-3" />
            Minimap
          </button>
        </div>
      </div>

      {/* Leyenda de tipos de dependencia */}
      {mostrarLeyenda && (
        <div className="flex items-center gap-4 flex-wrap px-3 py-2 bg-muted/40 rounded-md border text-xs">
          <span className="font-medium text-foreground">Tipos de dependencia:</span>
          {LEYENDA_DEPENDENCIAS.map(({ tipo, label, color }) => (
            <span key={tipo} className="flex items-center gap-1.5">
              <span
                className="inline-block h-0.5 w-5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="font-mono font-bold" style={{ color }}>{tipo}</span>
              <span className="text-muted-foreground">{label}</span>
            </span>
          ))}
          <span className="ml-2 flex items-center gap-1.5">
            <span className="inline-block h-4 w-4 rounded-sm border-2 border-red-500 bg-red-50" />
            <span className="text-muted-foreground">Tarea crítica</span>
          </span>
        </div>
      )}

      {/* Diagrama */}
      <div
        className="rounded-lg border border-border overflow-hidden"
        style={{ height: altura }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.2}
          maxZoom={2}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={20} size={1} className="bg-muted/20" />
          <Controls showInteractive={false} />
          {mostrarMinimap && (
            <MiniMap
              nodeStrokeWidth={3}
              zoomable
              pannable
              className="!bg-background !border-border"
            />
          )}
        </ReactFlow>
      </div>
    </div>
  )
}

// -------------------------------------------------------
// EXPORT: wrapper en Card con dynamic outer para SSR:false
// -------------------------------------------------------

export function NetworkDiagram({ proyectoId, altura = 560 }: NetworkDiagramProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Network className="h-4 w-4 text-primary" />
          Diagrama PERT / Red de Precedencias
        </CardTitle>
      </CardHeader>
      <CardContent>
        <NetworkDiagramInner proyectoId={proyectoId} altura={altura} />
      </CardContent>
    </Card>
  )
}
