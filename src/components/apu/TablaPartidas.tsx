'use client'

// ============================================================
// TablaPartidas — M5-S02
// Tabla de partidas de un APU con acciones (añadir, editar, eliminar).
// Abre FormularioPartida como modal para crear/editar.
// ============================================================

import { useState } from 'react'
import { Plus, Pencil, Trash2, ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FormularioPartida } from './FormularioPartida'
import { TablaInsumos } from './TablaInsumos'
import { cn } from '@/lib/utils'
import {
  useCrearPartida,
  useActualizarPartida,
  useEliminarPartida,
} from '@/hooks/useAPU'
import type { APU, Partida, CrearPartidaDTO, ActualizarPartidaDTO } from '@/types'

// -------------------------------------------------------
// TIPOS
// -------------------------------------------------------

interface TablaPartidasProps {
  apu: APU
}

// -------------------------------------------------------
// COMPONENTE
// -------------------------------------------------------

export function TablaPartidas({ apu }: TablaPartidasProps) {
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState<Partida | undefined>(undefined)
  const [expandida, setExpandida] = useState<string | null>(null)
  const [confirmandoEliminar, setConfirmandoEliminar] = useState<string | null>(null)

  const readOnly = apu.estado === 'aprobado'
  const simbolo = apu.moneda === 'USD' ? 'US$' : apu.moneda === 'PEN' ? 'S/' : '$'

  const crearPartida   = useCrearPartida()
  const actualizarPartida = useActualizarPartida()
  const eliminarPartida   = useEliminarPartida()

  function handleNueva() {
    setEditando(undefined)
    setShowForm(true)
  }

  function handleEditar(partida: Partida) {
    setEditando(partida)
    setShowForm(true)
  }

  function handleCancelarForm() {
    setShowForm(false)
    setEditando(undefined)
  }

  async function handleConfirmarForm(data: CrearPartidaDTO | ActualizarPartidaDTO) {
    try {
      if (editando) {
        await actualizarPartida.mutateAsync({
          apuId: apu.id,
          proyectoId: apu.proyectoId,
          partidaId: editando.id,
          data: data as ActualizarPartidaDTO,
          partidasActuales: apu.partidas,
        })
      } else {
        await crearPartida.mutateAsync({
          apuId: apu.id,
          proyectoId: apu.proyectoId,
          data: data as CrearPartidaDTO,
          partidasActuales: apu.partidas,
        })
      }
      setShowForm(false)
      setEditando(undefined)
    } catch {
      // Manejado por onError del hook (toast)
    }
  }

  async function handleEliminar(partidaId: string) {
    try {
      await eliminarPartida.mutateAsync({
        apuId: apu.id,
        proyectoId: apu.proyectoId,
        partidaId,
        partidasActuales: apu.partidas,
      })
      setConfirmandoEliminar(null)
    } catch {
      // Manejado por onError del hook
    }
  }

  const totalCostoDirecto  = apu.partidas.reduce((s, p) => s + p.costoDirecto, 0)
  const totalPrecioTotal   = apu.partidas.reduce((s, p) => s + p.precioUnitario, 0)
  const isLoadingMutation  = crearPartida.isPending || actualizarPartida.isPending || eliminarPartida.isPending

  // ---- EMPTY STATE ----
  if (apu.partidas.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground text-sm mb-3">
            Este APU no tiene partidas todavía.
          </p>
          {!readOnly && (
            <Button size="sm" onClick={handleNueva}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar primera partida
            </Button>
          )}
        </div>
        {showForm && (
          <FormularioPartida
            apu={apu}
            partida={editando}
            onConfirmar={handleConfirmarForm}
            onCancelar={handleCancelarForm}
            isLoading={isLoadingMutation}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex justify-end">
          <Button size="sm" onClick={handleNueva} disabled={isLoadingMutation}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva partida
          </Button>
        </div>
      )}

      {/* Header tabla */}
      <div className="hidden md:grid grid-cols-[auto_2fr_1fr_1fr_1.5fr_1.5fr_auto] gap-2 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b">
        <span />
        <span>Partida</span>
        <span>Unidad</span>
        <span>Insumos</span>
        <span className="text-right">Costo Directo</span>
        <span className="text-right">Precio Unitario</span>
        <span />
      </div>

      {/* Filas */}
      <div className="space-y-1">
        {apu.partidas.map((partida) => {
          const isExp = expandida === partida.id

          return (
            <div key={partida.id} className="rounded-md border overflow-hidden">
              {/* Fila principal */}
              <div
                className={cn(
                  'grid grid-cols-[auto_2fr_1fr_1fr_1.5fr_1.5fr_auto] gap-2 items-center px-4 py-3 text-sm transition-colors cursor-pointer',
                  isExp ? 'bg-muted/50' : 'hover:bg-muted/30',
                )}
                onClick={() => setExpandida(isExp ? null : partida.id)}
              >
                {/* Toggle expand */}
                {isExp
                  ? <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  : <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                }

                {/* Nombre + código */}
                <div className="min-w-0">
                  <p className="font-medium truncate">{partida.descripcion}</p>
                  <p className="text-xs text-muted-foreground font-mono">{partida.codigo}</p>
                </div>

                {/* Unidad */}
                <span className="text-muted-foreground">{partida.unidad}</span>

                {/* # insumos */}
                <Badge variant="secondary" className="w-fit text-xs">
                  {partida.insumos.length} insumo{partida.insumos.length !== 1 ? 's' : ''}
                </Badge>

                {/* Costo directo */}
                <span className="tabular-nums text-right text-sm">
                  {simbolo} {partida.costoDirecto.toLocaleString('es-CL')}
                </span>

                {/* Precio unitario */}
                <span className="tabular-nums text-right font-semibold text-primary">
                  {simbolo} {partida.precioUnitario.toLocaleString('es-CL')}
                </span>

                {/* Acciones */}
                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {!readOnly && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleEditar(partida)}
                        className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
                        title="Editar partida"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmandoEliminar(
                          confirmandoEliminar === partida.id ? null : partida.id
                        )}
                        className="p-1 text-muted-foreground hover:text-destructive rounded transition-colors"
                        title="Eliminar partida"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Confirmación de eliminación inline */}
              {confirmandoEliminar === partida.id && (
                <div className="px-4 py-3 bg-destructive/5 border-t flex items-center justify-between gap-3">
                  <p className="text-sm text-destructive font-medium">
                    ¿Eliminar partida &quot;{partida.descripcion}&quot;? Esta acción no se puede deshacer.
                  </p>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConfirmandoEliminar(null)}
                      disabled={isLoadingMutation}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleEliminar(partida.id)}
                      disabled={isLoadingMutation}
                    >
                      {isLoadingMutation ? 'Eliminando…' : 'Sí, eliminar'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Detalle de insumos expandido */}
              {isExp && (
                <div className="px-4 pb-4 pt-2 border-t bg-muted/10">
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    Desglose de insumos
                  </p>
                  <TablaInsumos
                    insumos={partida.insumos}
                    onChange={() => { /* read-only en la expansión; editar desde el modal */ }}
                    readOnly
                    moneda={apu.moneda}
                  />
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span>GG: <strong>{partida.ggPct}%</strong></span>
                    <span>Utilidad: <strong>{partida.utilidadPct}%</strong></span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer totales */}
      <div className="flex justify-end gap-8 px-4 py-3 rounded-md bg-muted/30 text-sm border">
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Total costo directo</p>
          <p className="font-semibold tabular-nums">
            {simbolo} {totalCostoDirecto.toLocaleString('es-CL')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Total precio unitario</p>
          <p className="font-bold text-primary tabular-nums">
            {simbolo} {totalPrecioTotal.toLocaleString('es-CL')}
          </p>
        </div>
      </div>

      {/* Modal FormularioPartida */}
      {showForm && (
        <FormularioPartida
          apu={apu}
          partida={editando}
          onConfirmar={handleConfirmarForm}
          onCancelar={handleCancelarForm}
          isLoading={isLoadingMutation}
        />
      )}
    </div>
  )
}
