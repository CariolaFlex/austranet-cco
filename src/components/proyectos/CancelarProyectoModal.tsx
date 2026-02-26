'use client'

// ============================================================
// MODAL: CancelarProyectoModal — M2-04 §9.2
// Cancelación formal del proyecto con causa tipificada
// ============================================================

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea, FormField, Select } from '@/components/ui/input'
import { useCancelarProyecto } from '@/hooks/useProyectos'
import type { Proyecto, CausaCancelacion } from '@/types'

const CAUSAS_CANCELACION: { value: CausaCancelacion; label: string; descripcion: string }[] = [
  {
    value: 'decision_cliente',
    label: 'Decisión del cliente',
    descripcion: 'El cliente decidió no continuar con el proyecto',
  },
  {
    value: 'inviabilidad_tecnica',
    label: 'Inviabilidad técnica',
    descripcion: 'El proyecto no puede completarse por restricciones tecnológicas',
  },
  {
    value: 'fuerza_mayor',
    label: 'Fuerza mayor',
    descripcion: 'Causas externas fuera del control de las partes',
  },
  {
    value: 'incumplimiento_contractual',
    label: 'Incumplimiento contractual',
    descripcion: 'Una de las partes incumplió las condiciones del contrato',
  },
  {
    value: 'cambio_prioridades',
    label: 'Cambio de prioridades',
    descripcion: 'El proyecto dejó de ser prioritario para la organización',
  },
]

interface CancelarProyectoModalProps {
  proyecto: Proyecto
  onClose: () => void
}

export function CancelarProyectoModal({ proyecto, onClose }: CancelarProyectoModalProps) {
  const [causa, setCausa] = useState<CausaCancelacion | ''>('')
  const [detalle, setDetalle] = useState('')
  const [confirmado, setConfirmado] = useState(false)
  const cancelar = useCancelarProyecto()

  const causaSeleccionada = CAUSAS_CANCELACION.find((c) => c.value === causa)
  const canSubmit = !!causa && detalle.trim().length > 0 && confirmado && !cancelar.isPending

  const handleSubmit = () => {
    if (!canSubmit || !causa) return
    cancelar.mutate(
      { proyectoId: proyecto.id, entidadId: proyecto.clienteId, causa, detalle },
      { onSuccess: onClose }
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 shrink-0">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Cancelar proyecto — M2-04 §9.2</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Esta acción es <strong>irreversible</strong>. El proyecto pasará a estado cancelado y
              el nivel de riesgo de la entidad cliente será actualizado.
            </p>
          </div>
        </div>

        <div className="p-3 bg-muted/40 rounded-lg text-sm">
          <p className="text-muted-foreground">Proyecto a cancelar:</p>
          <p className="font-medium">{proyecto.nombre}</p>
          <p className="font-mono text-xs text-muted-foreground">{proyecto.codigo}</p>
        </div>

        <FormField label="Causa de cancelación" required>
          <Select
            value={causa}
            onChange={(e) => setCausa(e.target.value as CausaCancelacion)}
            options={[
              { value: '', label: 'Seleccionar causa...' },
              ...CAUSAS_CANCELACION.map((c) => ({ value: c.value, label: c.label })),
            ]}
          />
        </FormField>

        {causaSeleccionada && (
          <p className="text-xs text-muted-foreground -mt-2 px-1">{causaSeleccionada.descripcion}</p>
        )}

        <FormField label="Detalle de la cancelación" required>
          <Textarea
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
            placeholder="Describe en detalle las circunstancias que llevan a la cancelación del proyecto..."
            rows={3}
          />
        </FormField>

        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={confirmado}
            onChange={(e) => setConfirmado(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-destructive cursor-pointer"
          />
          <span className="text-sm text-muted-foreground">
            Confirmo que deseo cancelar este proyecto. Entiendo que esta acción es irreversible y
            que el nivel de riesgo de la entidad cliente será incrementado.
          </span>
        </label>

        <div className="flex gap-3 pt-1">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Volver
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            variant="destructive"
            className="flex-1"
          >
            {cancelar.isPending ? 'Cancelando...' : 'Cancelar proyecto'}
          </Button>
        </div>
      </div>
    </div>
  )
}
