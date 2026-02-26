'use client'

// ============================================================
// MODAL: CambiarEstadoRiesgoModal — M2-03 §6
// Cambio de estado de un riesgo activo con justificación obligatoria
// ============================================================

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea, FormField, Select } from '@/components/ui/input'
import { useUpdateRiesgoEstado } from '@/hooks/useProyectos'
import type { RiesgoProyecto } from '@/types'

type EstadoRiesgo = 'activo' | 'mitigado' | 'materializado' | 'cerrado'

// Transiciones permitidas por estado actual (M2-03 §6)
const TRANSICIONES: Record<EstadoRiesgo, EstadoRiesgo[]> = {
  activo: ['mitigado', 'materializado', 'cerrado'],
  mitigado: ['cerrado'],
  materializado: ['cerrado'],
  cerrado: [],
}

const ESTADO_LABELS: Record<EstadoRiesgo, string> = {
  activo: 'Activo',
  mitigado: 'Mitigado',
  materializado: 'Materializado',
  cerrado: 'Cerrado',
}

const ESTADO_DESCRIPTIONS: Record<EstadoRiesgo, string> = {
  activo: 'El riesgo está identificado y siendo monitoreado',
  mitigado: 'Las acciones de mitigación fueron aplicadas exitosamente',
  materializado: 'El riesgo ocurrió y está generando impacto en el proyecto',
  cerrado: 'El riesgo ya no aplica o fue resuelto definitivamente',
}

interface CambiarEstadoRiesgoModalProps {
  proyectoId: string
  riesgo: RiesgoProyecto
  onClose: () => void
}

export function CambiarEstadoRiesgoModal({
  proyectoId,
  riesgo,
  onClose,
}: CambiarEstadoRiesgoModalProps) {
  const [nuevoEstado, setNuevoEstado] = useState<EstadoRiesgo | ''>('')
  const [justificacion, setJustificacion] = useState('')
  const updateRiesgo = useUpdateRiesgoEstado()

  const estadoActual = riesgo.estado as EstadoRiesgo
  const transicionesDisponibles = TRANSICIONES[estadoActual] ?? []

  const handleSubmit = () => {
    if (!nuevoEstado || !justificacion.trim()) return
    updateRiesgo.mutate(
      { proyectoId, riesgoId: riesgo.id, nuevoEstado, justificacion },
      { onSuccess: onClose }
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Cambiar estado del riesgo — M2-03 §6</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Estado actual:{' '}
            <strong className="text-foreground">{ESTADO_LABELS[estadoActual]}</strong>
          </p>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2 italic">
            &ldquo;{riesgo.descripcion}&rdquo;
          </p>
        </div>

        {transicionesDisponibles.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Este riesgo está en estado <strong>cerrado</strong> y no puede cambiar de estado.
          </p>
        ) : (
          <>
            <FormField label="Nuevo estado" required>
              <Select
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value as EstadoRiesgo)}
                options={[
                  { value: '', label: 'Seleccionar nuevo estado...' },
                  ...transicionesDisponibles.map((e) => ({
                    value: e,
                    label: ESTADO_LABELS[e],
                  })),
                ]}
              />
            </FormField>

            {nuevoEstado && (
              <p className="text-xs text-muted-foreground -mt-2 px-1">
                {ESTADO_DESCRIPTIONS[nuevoEstado]}
              </p>
            )}

            <FormField label="Justificación (resultado de la revisión)" required>
              <Textarea
                value={justificacion}
                onChange={(e) => setJustificacion(e.target.value)}
                placeholder="Describe el resultado de la revisión del riesgo, acciones tomadas y evidencia..."
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
              disabled={!nuevoEstado || !justificacion.trim() || updateRiesgo.isPending}
              className="flex-1"
            >
              {updateRiesgo.isPending ? 'Guardando...' : 'Actualizar riesgo'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
