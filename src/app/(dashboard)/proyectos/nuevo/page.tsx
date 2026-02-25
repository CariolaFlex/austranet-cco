'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProyectoWizard } from '@/components/proyectos/ProyectoWizard'
import { useEntidades } from '@/hooks/useEntidades'
import { ROUTES } from '@/constants'

export default function NuevoProyectoPage() {
  const { data: entidades = [], isLoading } = useEntidades()

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.PROYECTOS}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nuevo proyecto</h1>
          <p className="text-sm text-muted-foreground">
            Completa los 7 pasos para registrar el proyecto · M2-01 §9
          </p>
        </div>
      </div>

      {/* Wizard */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-3" />
            <p className="text-sm">Cargando entidades...</p>
          </div>
        </div>
      ) : (
        <ProyectoWizard entidades={entidades} />
      )}
    </div>
  )
}
