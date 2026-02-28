'use client'

import { ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProyectoDetalle } from '@/components/proyectos/ProyectoDetalle'
import { useProyecto } from '@/hooks/useProyectos'
import { useEntidades } from '@/hooks/useEntidades'
import { ROUTES } from '@/constants'

interface Props {
  params: { proyectoId: string }
}

export default function DetalleProyectoPage({ params }: Props) {
  const { proyectoId } = params
  const { data: proyecto, isLoading, isError } = useProyecto(proyectoId)
  const { data: entidades = [] } = useEntidades()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-3" />
          <p className="text-sm">Cargando proyecto...</p>
        </div>
      </div>
    )
  }

  if (isError || !proyecto) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="h-12 w-12 text-destructive opacity-60" />
        <div className="text-center">
          <p className="font-semibold">Proyecto no encontrado</p>
          <p className="text-sm text-muted-foreground mt-1">
            El proyecto que buscas no existe o fue eliminado.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={ROUTES.PROYECTOS}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a proyectos
          </Link>
        </Button>
      </div>
    )
  }

  const entidad = entidades.find((e) => e.id === proyecto.clienteId) ?? null

  return <ProyectoDetalle proyecto={proyecto} entidad={entidad} />
}
