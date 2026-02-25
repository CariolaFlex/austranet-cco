'use client'

import { Select } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { ESTADO_PROYECTO_CONFIG } from '@/constants'
import { CRITICIDAD_CONFIG, TIPO_PROYECTO_CONFIG } from '@/constants/proyectos'
import type { FiltrosProyecto, Entidad } from '@/types'

interface ProyectosFiltrosProps {
  filtros: FiltrosProyecto
  onChange: (filtros: FiltrosProyecto) => void
  entidades: Entidad[]
}

export function ProyectosFiltros({ filtros, onChange, entidades }: ProyectosFiltrosProps) {
  const update = <K extends keyof FiltrosProyecto>(key: K, val: FiltrosProyecto[K]) =>
    onChange({ ...filtros, [key]: val || undefined })

  const limpiar = () => onChange({})
  const hayFiltros = Object.values(filtros).some(Boolean)

  const entidadesOpts = [
    { value: '', label: 'Todos los clientes' },
    ...entidades.map((e) => ({ value: e.id, label: e.razonSocial })),
  ]

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Select
        value={filtros.estado ?? ''}
        onChange={(e) => update('estado', e.target.value as never)}
        options={[
          { value: '', label: 'Todos los estados' },
          ...Object.entries(ESTADO_PROYECTO_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
        ]}
        className="w-44"
      />
      <Select
        value={filtros.tipo ?? ''}
        onChange={(e) => update('tipo', e.target.value as never)}
        options={[
          { value: '', label: 'Todos los tipos' },
          ...Object.entries(TIPO_PROYECTO_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
        ]}
        className="w-44"
      />
      <Select
        value={filtros.criticidad ?? ''}
        onChange={(e) => update('criticidad', e.target.value as never)}
        options={[
          { value: '', label: 'Toda criticidad' },
          ...Object.entries(CRITICIDAD_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
        ]}
        className="w-40"
      />
      <Select
        value={filtros.clienteId ?? ''}
        onChange={(e) => update('clienteId', e.target.value || undefined)}
        options={entidadesOpts}
        className="w-48"
      />
      {hayFiltros && (
        <Button variant="ghost" size="sm" onClick={limpiar} className="text-muted-foreground">
          <X className="mr-1 h-4 w-4" />
          Limpiar
        </Button>
      )}
    </div>
  )
}
