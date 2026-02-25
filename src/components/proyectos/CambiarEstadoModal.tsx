'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea, FormField, Select } from '@/components/ui/input'
import { ESTADO_PROYECTO_CONFIG } from '@/constants'
import { useUpdateEstadoProyecto } from '@/hooks/useProyectos'
import type { Proyecto, EstadoProyecto } from '@/types'

interface CambiarEstadoModalProps {
  proyecto: Proyecto
  onClose: () => void
}

// Transiciones permitidas por estado actual
const TRANSICIONES: Record<EstadoProyecto, EstadoProyecto[]> = {
  borrador: ['pendiente_aprobacion', 'cancelado'],
  pendiente_aprobacion: ['activo_en_definicion', 'borrador', 'cancelado'],
  activo_en_definicion: ['activo_en_desarrollo', 'pausado', 'cancelado'],
  activo_en_desarrollo: ['pausado', 'completado', 'cancelado'],
  pausado: ['activo_en_desarrollo', 'cancelado'],
  completado: [],
  cancelado: [],
}

export function CambiarEstadoModal({ proyecto, onClose }: CambiarEstadoModalProps) {
  const [nuevoEstado, setNuevoEstado] = useState<EstadoProyecto | ''>('')
  const [motivo, setMotivo] = useState('')
  const updateEstado = useUpdateEstadoProyecto()

  const transicionesDisponibles = TRANSICIONES[proyecto.estado] ?? []

  const handleSubmit = () => {
    if (!nuevoEstado || !motivo.trim()) return
    updateEstado.mutate(
      { id: proyecto.id, estado: nuevoEstado, motivo },
      { onSuccess: onClose }
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Cambiar estado del proyecto</h2>
          <p className="text-sm text-muted-foreground mt-1">
            <strong>{proyecto.nombre}</strong> — Estado actual: {ESTADO_PROYECTO_CONFIG[proyecto.estado]?.label ?? proyecto.estado}
          </p>
        </div>

        {transicionesDisponibles.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Este proyecto no puede cambiar de estado ({proyecto.estado}).
          </p>
        ) : (
          <>
            <FormField label="Nuevo estado" required>
              <Select
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value as EstadoProyecto)}
                options={[
                  { value: '', label: 'Seleccionar estado...' },
                  ...transicionesDisponibles.map((e) => ({
                    value: e,
                    label: ESTADO_PROYECTO_CONFIG[e]?.label ?? e,
                  })),
                ]}
              />
            </FormField>

            <FormField label="Motivo del cambio" required>
              <Textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Describe el motivo de este cambio de estado..."
                rows={3}
              />
            </FormField>
          </>
        )}

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          {transicionesDisponibles.length > 0 && (
            <Button
              onClick={handleSubmit}
              disabled={!nuevoEstado || !motivo.trim() || updateEstado.isPending}
              className="flex-1"
            >
              {updateEstado.isPending ? 'Guardando...' : 'Cambiar estado'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
