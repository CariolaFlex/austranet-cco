'use client'

/**
 * NodoCPMCustom — M4 · Sprint M4-S04
 * Custom node para @xyflow/react con las 9 celdas estándar del diagrama PERT/CPM.
 *
 * Layout (3×3):
 * ┌────────────┬──────────────────┬────────────┐
 * │  ES        │     Nombre       │  EF        │
 * ├────────────┼──────────────────┼────────────┤
 * │  LS        │    Duración      │  LF        │
 * ├────────────┼──────────────────┼────────────┤
 * │  Holgura   │      WBS         │  Crítica   │
 * └────────────┴──────────────────┴────────────┘
 *
 * - Borde rojo grueso cuando la tarea es crítica.
 * - Borde azul estándar para no críticas.
 */

import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils'

// -------------------------------------------------------
// TIPOS
// -------------------------------------------------------

/** Datos del nodo PERT — almacenados en node.data */
export interface NodoCPMData extends Record<string, unknown> {
  nombre: string
  wbsCode: string
  duracion: number    // días
  es: number          // Early Start
  ef: number          // Early Finish
  ls: number          // Late Start
  lf: number          // Late Finish
  holguraTotal: number
  esCritica: boolean
}

// -------------------------------------------------------
// SUB-COMPONENTES
// -------------------------------------------------------

function Celda({
  valor,
  label,
  className,
}: {
  valor: string | number
  label: string
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-1 min-w-[48px]', className)}>
      <span className="text-[9px] text-muted-foreground leading-none uppercase tracking-wide">
        {label}
      </span>
      <span className="text-xs font-semibold leading-tight mt-0.5">
        {valor}
      </span>
    </div>
  )
}

// -------------------------------------------------------
// NODO PRINCIPAL
// Acepta NodeProps genérico (sin parámetro) para compatibilidad con NodeTypes.
// Los datos se castean internamente a NodoCPMData.
// -------------------------------------------------------

export const NodoCPMCustom = memo(function NodoCPMCustom({
  data,
  selected,
}: NodeProps) {
  const {
    nombre,
    wbsCode,
    duracion,
    es,
    ef,
    ls,
    lf,
    holguraTotal,
    esCritica,
  } = data as NodoCPMData

  return (
    <>
      {/* Handles de conexión — entrada izquierda, salida derecha */}
      <Handle type="target" position={Position.Left} className="!w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2" />

      {/* Tarjeta PERT */}
      <div
        className={cn(
          'bg-background text-foreground rounded shadow-md select-none',
          'border-2 transition-colors',
          esCritica
            ? 'border-red-500 shadow-red-200 dark:shadow-red-900/30'
            : 'border-blue-400 dark:border-blue-600',
          selected && 'ring-2 ring-primary ring-offset-1',
        )}
        style={{ minWidth: 180 }}
      >
        {/* Fila 1: ES | Nombre | EF */}
        <div
          className={cn(
            'flex divide-x border-b',
            esCritica
              ? 'divide-red-200 border-red-200 bg-red-50 dark:bg-red-900/20 dark:divide-red-800 dark:border-red-800'
              : 'divide-blue-100 border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:divide-blue-800 dark:border-blue-800',
          )}
        >
          <Celda valor={es as number} label="ES" />
          <div className="flex-1 flex items-center justify-center px-2 py-1.5">
            <span
              className="text-[11px] font-semibold text-center leading-tight line-clamp-2"
              title={nombre as string}
            >
              {nombre as string}
            </span>
          </div>
          <Celda valor={ef as number} label="EF" />
        </div>

        {/* Fila 2: LS | Duración | LF */}
        <div className="flex divide-x border-b border-border divide-border">
          <Celda valor={ls as number} label="LS" />
          <div className="flex-1 flex items-center justify-center px-2 py-1.5">
            <span className="text-xs text-muted-foreground">
              {duracion as number} {(duracion as number) === 1 ? 'día' : 'días'}
            </span>
          </div>
          <Celda valor={lf as number} label="LF" />
        </div>

        {/* Fila 3: Holgura | WBS | Indicador crítica */}
        <div className="flex divide-x divide-border text-[10px]">
          <Celda
            valor={`H: ${holguraTotal as number}`}
            label="Holgura"
            className={cn((holguraTotal as number) === 0 && 'text-red-600 dark:text-red-400')}
          />
          <div className="flex-1 flex items-center justify-center px-2 py-1">
            <span className="text-[10px] text-muted-foreground font-mono">
              {wbsCode as string}
            </span>
          </div>
          <div className="flex items-center justify-center p-1 min-w-[48px]">
            <span
              className={cn(
                'text-[9px] font-bold px-1 py-0.5 rounded uppercase',
                esCritica
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              {esCritica ? '★ Crít.' : 'Normal'}
            </span>
          </div>
        </div>
      </div>
    </>
  )
})
