/**
 * usePERTData — M4 · Sprint M4-S04
 *
 * Transforma Tarea[] + resultado CPM en nodes[] y edges[] listos para
 * @xyflow/react, con layout automático usando @dagrejs/dagre (dirección LR).
 *
 * Colores de aristas por tipo de dependencia:
 *  - FS (Finish→Start)  → azul   #3b82f6
 *  - SS (Start→Start)   → verde  #22c55e
 *  - FF (Finish→Finish) → naranja #f97316
 *  - SF (Start→Finish)  → rojo   #ef4444
 */

import { useMemo } from 'react'
import dagre from '@dagrejs/dagre'
import type { Node, Edge } from '@xyflow/react'
import { calcularCPM } from '@/lib/cpm'
import type { Tarea, TipoDependencia } from '@/types'
import type { NodoCPMData } from '../NodoCPMCustom'

// -------------------------------------------------------
// CONSTANTES
// -------------------------------------------------------

/** Dimensiones del nodo PERT personalizado (deben coincidir con el CSS real) */
const NODO_ANCHO = 220
const NODO_ALTO = 100

/** Color de arista por tipo de dependencia */
const COLOR_DEPENDENCIA: Record<TipoDependencia, string> = {
  FS: '#3b82f6',   // azul
  SS: '#22c55e',   // verde
  FF: '#f97316',   // naranja
  SF: '#ef4444',   // rojo
}

/** Etiqueta de dependencia para la arista */
const LABEL_DEPENDENCIA: Record<TipoDependencia, string> = {
  FS: 'FS',
  SS: 'SS',
  FF: 'FF',
  SF: 'SF',
}

// -------------------------------------------------------
// HELPER: layout con Dagre
// -------------------------------------------------------

function aplicarDagreLayout(
  nodes: Node<NodoCPMData>[],
  edges: Edge[],
): Node<NodoCPMData>[] {
  const g = new dagre.graphlib.Graph()

  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({
    rankdir: 'LR',    // Left → Right
    align: 'UL',
    nodesep: 40,      // Separación vertical entre nodos del mismo rango
    ranksep: 80,      // Separación horizontal entre columnas
    marginx: 20,
    marginy: 20,
  })

  for (const node of nodes) {
    g.setNode(node.id, { width: NODO_ANCHO, height: NODO_ALTO })
  }

  for (const edge of edges) {
    g.setEdge(edge.source, edge.target)
  }

  dagre.layout(g)

  return nodes.map((node) => {
    const posicion = g.node(node.id)
    return {
      ...node,
      position: {
        x: posicion.x - NODO_ANCHO / 2,
        y: posicion.y - NODO_ALTO / 2,
      },
    }
  })
}

// -------------------------------------------------------
// HOOK PRINCIPAL
// -------------------------------------------------------

export interface PERTData {
  nodes: Node<NodoCPMData>[]
  edges: Edge[]
}

/**
 * Genera nodes y edges para el NetworkDiagram a partir de las tareas del proyecto.
 * Ejecuta CPM internamente para calcular ES/EF/LS/LF/Holgura si la tarea no los tiene cacheados.
 * Solo incluye tareas de tipo 'tarea' (excluye fases/resumen y hitos_gantt).
 */
export function usePERTData(tareas: Tarea[]): PERTData {
  return useMemo(() => {
    if (!tareas.length) return { nodes: [], edges: [] }

    // Filtrar: solo tareas operativas (no fases ni hitos en el diagrama PERT)
    const tareasRed = tareas.filter(
      (t) => t.tipo === 'tarea' || t.tipo === 'hito_gantt',
    )
    if (!tareasRed.length) return { nodes: [], edges: [] }

    // Calcular CPM si las tareas no tienen los valores cacheados
    const necesitaCPM = tareasRed.some(
      (t) => t.es === undefined || t.ef === undefined,
    )

    let resultadoCPM: Record<string, { es: number; ef: number; ls: number; lf: number; holguraTotal: number; esCritica: boolean }> = {}

    if (necesitaCPM) {
      resultadoCPM = calcularCPM(
        tareasRed.map((t) => ({
          id: t.id,
          duracion: t.duracionDias,
          dependencias: t.dependencias.map((d) => ({
            id: d.tareaIdPredecesora,
            tipo: d.tipo,
            lagDias: d.lagDias,
          })),
        })),
      )
    }

    // ─── CONSTRUIR NODES ──────────────────────────────────────────────────────
    const rawNodes: Node<NodoCPMData>[] = tareasRed.map((tarea) => {
      const cpm = resultadoCPM[tarea.id]

      const es           = tarea.es           ?? cpm?.es           ?? 0
      const ef           = tarea.ef           ?? cpm?.ef           ?? tarea.duracionDias
      const ls           = tarea.ls           ?? cpm?.ls           ?? 0
      const lf           = tarea.lf           ?? cpm?.lf           ?? tarea.duracionDias
      const holguraTotal = tarea.holguraTotal ?? cpm?.holguraTotal ?? 0
      const esCritica    = tarea.esCritica    || (cpm?.esCritica   ?? false)

      return {
        id:       tarea.id,
        type:     'nodoCPM',
        position: { x: 0, y: 0 },   // Dagre asignará la posición real
        data: {
          nombre:       tarea.nombre,
          wbsCode:      tarea.wbsCode,
          duracion:     tarea.duracionDias,
          es:           Math.round(es),
          ef:           Math.round(ef),
          ls:           Math.round(ls),
          lf:           Math.round(lf),
          holguraTotal: Math.round(holguraTotal),
          esCritica,
        },
      }
    })

    // Conjunto de IDs de tareas incluidas en el diagrama (para filtrar edges)
    const idsEnRed = new Set(tareasRed.map((t) => t.id))

    // ─── CONSTRUIR EDGES ──────────────────────────────────────────────────────
    const rawEdges: Edge[] = []
    const edgesVistos = new Set<string>()

    for (const tarea of tareasRed) {
      for (const dep of tarea.dependencias) {
        // Solo incluir aristas entre nodos que están en el diagrama
        if (!idsEnRed.has(dep.tareaIdPredecesora)) continue

        const edgeId = `${dep.tareaIdPredecesora}->${tarea.id}:${dep.tipo}`
        if (edgesVistos.has(edgeId)) continue
        edgesVistos.add(edgeId)

        const color = COLOR_DEPENDENCIA[dep.tipo] ?? '#94a3b8'
        const label = dep.lagDias !== 0
          ? `${LABEL_DEPENDENCIA[dep.tipo]}${dep.lagDias > 0 ? '+' : ''}${dep.lagDias}d`
          : LABEL_DEPENDENCIA[dep.tipo]

        rawEdges.push({
          id:       edgeId,
          source:   dep.tareaIdPredecesora,
          target:   tarea.id,
          label,
          type:     'smoothstep',
          animated: false,
          style: {
            stroke:      color,
            strokeWidth: 2,
          },
          labelStyle: {
            fontSize: 9,
            fill:     color,
            fontWeight: 600,
          },
          labelBgStyle: {
            fill:    'var(--background)',
            fillOpacity: 0.85,
          },
          markerEnd: {
            type: 'arrowclosed' as const,
            color,
            width:  12,
            height: 12,
          },
        })
      }
    }

    // ─── APLICAR LAYOUT DAGRE ────────────────────────────────────────────────
    const nodesConLayout = aplicarDagreLayout(rawNodes, rawEdges)

    return { nodes: nodesConLayout, edges: rawEdges }
  }, [tareas])
}
