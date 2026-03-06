'use client'

// ============================================================
// APUList — M5-S02
// Lista de APUs de un proyecto con botón "Nuevo APU".
// Gestiona el ciclo de vida: lista → selección → detalle.
// ============================================================

import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { APUCard } from './APUCard'
import { FormularioAPU } from './FormularioAPU'
import { cn } from '@/lib/utils'
import { useAPUs, useCreateAPU, useUpdateAPU, useDeleteAPU } from '@/hooks/useAPU'
import type { APU, CrearAPUDTO, ActualizarAPUDTO } from '@/types'

// -------------------------------------------------------
// TIPOS
// -------------------------------------------------------

interface APUListProps {
  proyectoId: string
  apuSeleccionadoId: string | null
  onSelect: (apuId: string) => void
}

// -------------------------------------------------------
// COMPONENTE
// -------------------------------------------------------

export function APUList({ proyectoId, apuSeleccionadoId, onSelect }: APUListProps) {
  const [showForm, setShowForm]   = useState(false)
  const [editando, setEditando]   = useState<APU | undefined>(undefined)
  const [confirmando, setConfirmando] = useState<string | null>(null)

  const { data: apus, isLoading, error } = useAPUs(proyectoId)
  const createAPU  = useCreateAPU()
  const updateAPU  = useUpdateAPU()
  const deleteAPU  = useDeleteAPU()

  const isLoadingMutation = createAPU.isPending || updateAPU.isPending || deleteAPU.isPending

  function handleNuevo() {
    setEditando(undefined)
    setShowForm(true)
  }

  function handleEditar(apu: APU, e: React.MouseEvent) {
    e.stopPropagation()
    setEditando(apu)
    setShowForm(true)
  }

  function handleCancelarForm() {
    setShowForm(false)
    setEditando(undefined)
  }

  async function handleConfirmarForm(data: CrearAPUDTO | ActualizarAPUDTO) {
    try {
      if (editando) {
        await updateAPU.mutateAsync({
          id: editando.id,
          proyectoId,
          data: data as ActualizarAPUDTO,
        })
      } else {
        const created = await createAPU.mutateAsync(data as CrearAPUDTO)
        onSelect(created.id)
      }
      setShowForm(false)
      setEditando(undefined)
    } catch {
      // Manejado por onError del hook (toast)
    }
  }

  async function handleEliminar(apuId: string) {
    try {
      await deleteAPU.mutateAsync({ id: apuId, proyectoId })
      setConfirmando(null)
      if (apuSeleccionadoId === apuId) onSelect('')
    } catch {
      // Manejado por onError del hook
    }
  }

  // ---- LOADING ----
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-28 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  // ---- ERROR ----
  if (error) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
        Error al cargar APUs: {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          {apus?.length ?? 0} APU{(apus?.length ?? 0) !== 1 ? 's' : ''}
        </p>
        <Button size="sm" onClick={handleNuevo} disabled={isLoadingMutation}>
          {isLoadingMutation
            ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            : <Plus className="h-4 w-4 mr-2" />
          }
          Nuevo APU
        </Button>
      </div>

      {/* Lista */}
      {apus?.length === 0 ? (
        <div className="text-center py-10 border rounded-lg bg-muted/20">
          <p className="text-sm text-muted-foreground mb-3">
            No hay APUs en este proyecto.
          </p>
          <Button size="sm" variant="outline" onClick={handleNuevo}>
            <Plus className="h-4 w-4 mr-2" />
            Crear primer APU
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {apus?.map((apu) => (
            <div key={apu.id}>
              <APUCard
                apu={apu}
                selected={apuSeleccionadoId === apu.id}
                onClick={() => onSelect(apu.id)}
                onEditar={() => { setEditando(apu); setShowForm(true) }}
                onEliminar={() => setConfirmando(apu.id)}
              />

              {/* Confirmación de eliminación */}
              {confirmando === apu.id && (
                <div className={cn(
                  'mt-1 px-4 py-3 rounded-md bg-destructive/5 border border-destructive/20',
                  'flex items-center justify-between gap-3 text-sm',
                )}>
                  <p className="text-destructive font-medium">
                    ¿Eliminar APU &quot;{apu.nombre}&quot;?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConfirmando(null)}
                      disabled={isLoadingMutation}
                    >
                      No
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleEliminar(apu.id)}
                      disabled={isLoadingMutation}
                    >
                      {deleteAPU.isPending ? 'Eliminando…' : 'Sí, eliminar'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal FormularioAPU */}
      {showForm && (
        <FormularioAPU
          proyectoId={proyectoId}
          apu={editando}
          onConfirmar={handleConfirmarForm}
          onCancelar={handleCancelarForm}
          isLoading={isLoadingMutation}
        />
      )}
    </div>
  )
}
