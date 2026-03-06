'use client'

// ============================================================
// PÁGINA: Catálogo de Insumos APU — M5-S03
// Ruta: /configuracion/catalogo-insumos
// Solo accesible para rol admin / superadmin.
// ============================================================

import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/common/PageHeader'
import { CatalogoInsumosAdmin } from '@/components/apu/CatalogoInsumosAdmin'
import { useAuth } from '@/contexts/AuthContext'

export default function CatalogoInsumosPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const isAdmin = user?.rol === 'admin' || user?.rol === 'superadmin'

  // Redirige a /configuracion si el usuario no es admin
  useEffect(() => {
    if (!loading && user && !isAdmin) {
      router.replace('/configuracion')
    }
  }, [loading, user, isAdmin, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Mientras redirige (o si no hay usuario auth), no muestra nada
  if (!isAdmin) return null

  return (
    <div>
      {/* Breadcrumb de retorno */}
      <div className="mb-4">
        <Link
          href="/configuracion"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a Configuración
        </Link>
      </div>

      <PageHeader
        title="Catálogo de insumos"
        description="Gestión global de materiales, mano de obra, equipos y subcontratos utilizados en partidas APU."
      />

      <div className="mt-6">
        <CatalogoInsumosAdmin />
      </div>
    </div>
  )
}
