'use client'

// ============================================================
// PÁGINA: Admin > Auditoría — T-03
// Solo visible para admin y superadmin.
// Log de actividad del sistema con filtros y exportación CSV.
// ============================================================

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ClipboardList,
  Shield,
  Loader2,
  Download,
  Filter,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { auditoriaService } from '@/services/auditoria.service'
import type { EntradaAuditoria } from '@/types'
import { cn } from '@/lib/utils'

const MODULOS = ['', 'M1', 'M2', 'M3', 'T'] as const

const RESULTADO_STYLE = {
  exito: 'text-green-700 bg-green-50 border-green-200 dark:bg-green-950/30',
  error: 'text-red-700 bg-red-50 border-red-200 dark:bg-red-950/30',
  bloqueado: 'text-yellow-700 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30',
} as const

function formatTs(d: Date | undefined): string {
  if (!d) return '—'
  return new Date(d).toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function exportarCSV(entradas: EntradaAuditoria[]) {
  const headers = ['Timestamp', 'Actor', 'Rol', 'Acción', 'Módulo', 'Entidad', 'Descripción', 'Resultado']
  const rows = entradas.map((e) => [
    formatTs(e.timestamp),
    e.actor.nombre,
    e.actor.rol,
    e.accion,
    e.modulo,
    e.entidad ? `${e.entidad.tipo}:${e.entidad.nombre ?? e.entidad.id}` : '',
    e.descripcion,
    e.resultado,
  ])
  const csv = [headers, ...rows]
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `auditoria_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminAuditoriaPage() {
  const { user } = useAuth()
  const [moduloFiltro, setModuloFiltro] = useState<string>('')

  const { data: entradas, isLoading } = useQuery({
    queryKey: ['auditoria', moduloFiltro],
    queryFn: () =>
      auditoriaService.getAll(
        moduloFiltro ? { modulo: moduloFiltro } : undefined,
        100
      ),
    staleTime: 30 * 1000, // 30s
  })

  // Guard: solo admin/superadmin
  if (user?.rol !== 'admin' && user?.rol !== 'superadmin') {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center space-y-2">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="font-medium">Acceso restringido</p>
          <p className="text-sm text-muted-foreground">Esta sección requiere permisos de administrador.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Auditoría del sistema"
        description="Registro inmutable de actividad. Solo lectura."
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">
                Entradas ({entradas?.length ?? 0})
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {/* Filtro por módulo */}
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={moduloFiltro}
                  onChange={(e) => setModuloFiltro(e.target.value)}
                  className="text-sm border rounded px-2 py-1 bg-background h-8"
                >
                  <option value="">Todos los módulos</option>
                  {MODULOS.filter(Boolean).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Exportar CSV */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                disabled={!entradas?.length}
                onClick={() => entradas && exportarCSV(entradas)}
              >
                <Download className="h-3.5 w-3.5" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Cargando registros...</span>
            </div>
          ) : !entradas?.length ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No se encontraron registros de auditoría.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">Timestamp</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actor</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Acción</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Módulo</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Entidad</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {entradas.map((e) => (
                    <tr
                      key={e.id}
                      className={cn(
                        'hover:bg-muted/30 transition-colors',
                        e.resultado === 'error' && 'bg-red-50/30 dark:bg-red-950/10',
                        e.resultado === 'bloqueado' && 'bg-yellow-50/30 dark:bg-yellow-950/10'
                      )}
                    >
                      <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap font-mono">
                        {formatTs(e.timestamp)}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-xs">{e.actor.nombre}</div>
                        <div className="text-xs text-muted-foreground">{e.actor.rol}</div>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs">{e.accion}</td>
                      <td className="px-4 py-2.5">
                        <Badge variant="outline" className="text-xs">{e.modulo}</Badge>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">
                        {e.entidad ? (
                          <span>{e.entidad.tipo}: {e.entidad.nombre ?? e.entidad.id}</span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge variant="outline" className={cn('text-xs', RESULTADO_STYLE[e.resultado])}>
                          {e.resultado}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
