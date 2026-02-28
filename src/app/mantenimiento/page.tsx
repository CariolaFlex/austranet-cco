// ============================================================
// PÁGINA: Modo Mantenimiento — T-06-F
// Página pública mostrada cuando el sistema está en mantenimiento.
// superadmin puede continuar al panel; el resto espera.
// ============================================================

import Link from 'next/link'
import { Wrench, ArrowRight } from 'lucide-react'

export default async function MantenimientoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 p-4">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Ícono */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wrench className="h-10 w-10" />
          </div>
        </div>

        {/* Título */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Sistema en mantenimiento
          </h1>
          <p className="text-muted-foreground">
            Estamos realizando mejoras para brindarte una mejor experiencia.
            El sistema estará disponible en breve.
          </p>
        </div>

        {/* Separador visual */}
        <div className="border-t border-border" />

        {/* Info adicional */}
        <div className="rounded-lg border bg-card/60 px-6 py-4 text-sm text-muted-foreground">
          <p>Si tienes alguna consulta urgente, contacta al equipo de administración.</p>
        </div>

        {/* Botón para superadmin */}
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
          >
            Continuar al panel de administración
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">(Solo disponible para superadmin)</p>
        </div>
      </div>
    </div>
  )
}
