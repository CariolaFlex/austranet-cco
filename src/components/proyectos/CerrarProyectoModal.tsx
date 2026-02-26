'use client'

// ============================================================
// MODAL: CerrarProyectoModal — M2-04 §9.1 + §9.3
// Cierre formal del proyecto: checklist + lecciones aprendidas
// ============================================================

import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea, FormField } from '@/components/ui/input'
import { useCerrarProyecto } from '@/hooks/useProyectos'
import type { Proyecto, LeccionesAprendidas } from '@/types'

interface CerrarProyectoModalProps {
  proyecto: Proyecto
  onClose: () => void
}

const LECCIONES_INITIAL: LeccionesAprendidas = {
  queExitoSaliBien: '',
  queProblemasSurgieron: '',
  queHariamosDistinto: '',
  riesgosNoAnticipados: '',
}

export function CerrarProyectoModal({ proyecto, onClose }: CerrarProyectoModalProps) {
  const [lecciones, setLecciones] = useState<LeccionesAprendidas>(LECCIONES_INITIAL)
  const cerrar = useCerrarProyecto()

  const hitos = proyecto.hitos ?? []
  const totalHitos = hitos.length
  const hitosCompletados = hitos.filter((h) => h.estado === 'completado').length
  const todosCompletados = totalHitos === 0 || hitosCompletados === totalHitos
  const esActivo = ['activo_en_definicion', 'activo_en_desarrollo'].includes(proyecto.estado)

  const leccionesCompletas = Object.values(lecciones).every((v) => v.trim().length > 0)

  const handleSubmit = () => {
    if (!leccionesCompletas || cerrar.isPending) return
    cerrar.mutate(
      { proyectoId: proyecto.id, entidadId: proyecto.clienteId, lecciones },
      { onSuccess: onClose }
    )
  }

  const setField = (key: keyof LeccionesAprendidas) => (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setLecciones((prev) => ({ ...prev, [key]: e.target.value }))

  const checklist = [
    { label: `Hitos completados (${hitosCompletados}/${totalHitos})`, ok: todosCompletados },
    { label: 'Proyecto en estado activo', ok: esActivo },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-xl w-full max-w-lg p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div>
          <h2 className="text-lg font-semibold">Cerrar proyecto — M2-04 §9.1</h2>
          <p className="text-sm text-muted-foreground mt-1">
            <strong>{proyecto.nombre}</strong>{' '}
            <span className="font-mono text-xs">({proyecto.codigo})</span>
          </p>
        </div>

        {/* Verificación de cierre §9.1 */}
        <div className="space-y-2 p-3 bg-muted/40 rounded-lg">
          <p className="text-sm font-medium">Verificación de cierre</p>
          {checklist.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm">
              {item.ok ? (
                <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-orange-500 shrink-0" />
              )}
              <span className={item.ok ? 'text-foreground' : 'text-muted-foreground'}>
                {item.label}
              </span>
            </div>
          ))}
          {!todosCompletados && (
            <p className="text-xs text-orange-600 mt-1">
              Hay hitos pendientes. Puedes proceder igualmente si hay justificación válida.
            </p>
          )}
        </div>

        {/* Lecciones aprendidas §9.3 */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Lecciones aprendidas — M2-04 §9.3</p>

          <FormField label="¿Qué salió bien?" required>
            <Textarea
              value={lecciones.queExitoSaliBien}
              onChange={setField('queExitoSaliBien')}
              placeholder="Fortalezas y logros del proyecto..."
              rows={2}
            />
          </FormField>

          <FormField label="¿Qué problemas surgieron?" required>
            <Textarea
              value={lecciones.queProblemasSurgieron}
              onChange={setField('queProblemasSurgieron')}
              placeholder="Principales obstáculos y dificultades enfrentadas..."
              rows={2}
            />
          </FormField>

          <FormField label="¿Qué haríamos distinto?" required>
            <Textarea
              value={lecciones.queHariamosDistinto}
              onChange={setField('queHariamosDistinto')}
              placeholder="Mejoras y recomendaciones para proyectos futuros..."
              rows={2}
            />
          </FormField>

          <FormField label="Riesgos no anticipados" required>
            <Textarea
              value={lecciones.riesgosNoAnticipados}
              onChange={setField('riesgosNoAnticipados')}
              placeholder="Riesgos que surgieron durante el proyecto y no estaban identificados inicialmente..."
              rows={2}
            />
          </FormField>
        </div>

        <div className="flex gap-3 pt-1">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!leccionesCompletas || cerrar.isPending}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            {cerrar.isPending ? 'Cerrando proyecto...' : 'Cerrar proyecto'}
          </Button>
        </div>
      </div>
    </div>
  )
}
