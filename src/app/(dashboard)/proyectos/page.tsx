'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { ProyectosTable } from '@/components/proyectos/ProyectosTable'
import { ProyectosFiltros } from '@/components/proyectos/ProyectosFiltros'
import { CambiarEstadoModal } from '@/components/proyectos/CambiarEstadoModal'
import { useProyectos } from '@/hooks/useProyectos'
import { useEntidades } from '@/hooks/useEntidades'
import { useProyectoStore } from '@/store/useProyectoStore'
import { ROUTES } from '@/constants'
import type { Proyecto } from '@/types'

export default function ProyectosPage() {
  const { filtros, setFiltros } = useProyectoStore()
  const { data: proyectos, isLoading } = useProyectos(filtros)
  const { data: entidades } = useEntidades()
  const [proyectoCambioEstado, setProyectoCambioEstado] = useState<Proyecto | null>(null)

  return (
    <div>
      <PageHeader
        title="Proyectos"
        description="Gestión de proyectos de software"
        action={{
          label: 'Nuevo proyecto',
          icon: Plus,
          href: ROUTES.PROYECTO_NUEVO,
        }}
      />

      <div className="space-y-4">
        <ProyectosFiltros
          filtros={filtros}
          onChange={setFiltros}
          entidades={entidades ?? []}
        />

        <ProyectosTable
          proyectos={proyectos ?? []}
          entidades={entidades ?? []}
          loading={isLoading}
          onCambiarEstado={setProyectoCambioEstado}
        />
      </div>

      {proyectoCambioEstado && (
        <CambiarEstadoModal
          proyecto={proyectoCambioEstado}
          onClose={() => setProyectoCambioEstado(null)}
        />
      )}
    </div>
  )
}
