'use client'

import { use } from 'react'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useProyecto } from '@/hooks/useProyectos'
import { useSRS } from '@/hooks/useAlcance'
import { ROUTES } from '@/constants'
import { SRSPage } from '@/components/alcance/SRSPage'

interface Props {
  params: Promise<{ proyectoId: string }>
}

export default function AlcanceProyectoPage({ params }: Props) {
  const { proyectoId } = use(params)
  const { data: proyecto, isLoading: loadingProyecto } = useProyecto(proyectoId)
  const { data: srs, isLoading: loadingSRS } = useSRS(proyectoId)

  const isLoading = loadingProyecto || loadingSRS

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-3" />
          <p className="text-sm">Cargando SRS...</p>
        </div>
      </div>
    )
  }

  if (!proyecto) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="h-12 w-12 text-destructive opacity-60" />
        <div className="text-center">
          <p className="font-semibold">Proyecto no encontrado</p>
          <p className="text-sm text-muted-foreground mt-1">
            El proyecto no existe o fue eliminado.
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

  // Proyecto debe estar en estado activo_en_definicion o superior para tener SRS
  const estadosConSRS: string[] = [
    'activo_en_definicion',
    'activo_en_desarrollo',
    'pausado',
    'completado',
  ]

  if (!estadosConSRS.includes(proyecto.estado)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="h-12 w-12 text-amber-500 opacity-70" />
        <div className="text-center">
          <p className="font-semibold">SRS no disponible</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            El SRS se activa automáticamente cuando el proyecto pasa a estado{' '}
            <span className="font-medium text-foreground">Activo en Definición</span>.
            Actualmente el proyecto está en:{' '}
            <span className="font-medium text-foreground">{proyecto.estado}</span>.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`${ROUTES.PROYECTOS}/${proyectoId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al proyecto
          </Link>
        </Button>
      </div>
    )
  }

  if (!srs) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">
          Inicializando SRS... El trigger automático está en proceso.
        </p>
      </div>
    )
  }

  return <SRSPage proyecto={proyecto} srs={srs} />
}
