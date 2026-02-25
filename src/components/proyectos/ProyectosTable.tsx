'use client'

import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Eye, Pencil, RefreshCw, MoreHorizontal } from 'lucide-react'
import { DataTable, Column } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dialogs'
import { ESTADO_PROYECTO_CONFIG, ROUTES } from '@/constants'
import { CRITICIDAD_CONFIG, TIPO_PROYECTO_CONFIG } from '@/constants/proyectos'
import type { Proyecto, Entidad } from '@/types'

const colorMap: Record<string, string> = {
  gray:   'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200',
  blue:   'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
  green:  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200',
  red:    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200',
  teal:   'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200',
}

function ColorBadge({ color, label }: { color: string; label: string }) {
  return (
    <Badge variant="outline" className={colorMap[color] || colorMap.gray}>
      {label}
    </Badge>
  )
}

interface ProyectosTableProps {
  proyectos: Proyecto[]
  entidades: Entidad[]
  loading?: boolean
  onCambiarEstado?: (proyecto: Proyecto) => void
}

export function ProyectosTable({
  proyectos,
  entidades,
  loading,
  onCambiarEstado,
}: ProyectosTableProps) {
  const router = useRouter()

  const entidadesMap = entidades.reduce<Record<string, Entidad>>((acc, e) => {
    acc[e.id] = e
    return acc
  }, {})

  const columns: Column<Proyecto>[] = [
    {
      key: 'nombre',
      header: 'Proyecto',
      sortable: true,
      render: (_, row) => (
        <div>
          <p className="font-medium text-foreground">{row.nombre}</p>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">{row.codigo}</p>
        </div>
      ),
    },
    {
      key: 'tipo',
      header: 'Tipo',
      sortable: true,
      render: (value) => {
        const cfg = TIPO_PROYECTO_CONFIG[value as keyof typeof TIPO_PROYECTO_CONFIG]
        return <ColorBadge color={cfg?.color ?? 'gray'} label={cfg?.label ?? value} />
      },
    },
    {
      key: 'criticidad',
      header: 'Criticidad',
      sortable: true,
      render: (value) => {
        const cfg = CRITICIDAD_CONFIG[value as keyof typeof CRITICIDAD_CONFIG]
        return <ColorBadge color={cfg?.color ?? 'gray'} label={cfg?.label ?? value} />
      },
    },
    {
      key: 'estado',
      header: 'Estado',
      sortable: true,
      render: (value) => {
        const cfg = ESTADO_PROYECTO_CONFIG[value as keyof typeof ESTADO_PROYECTO_CONFIG]
        return <ColorBadge color={cfg?.color ?? 'gray'} label={cfg?.label ?? value} />
      },
    },
    {
      key: 'clienteId',
      header: 'Cliente',
      sortable: true,
      render: (value) => {
        const entidad = entidadesMap[value as string]
        return entidad ? (
          <button
            className="text-left hover:text-primary transition-colors"
            onClick={(e) => { e.stopPropagation(); router.push(ROUTES.ENTIDAD_DETALLE(entidad.id)) }}
          >
            <p className="text-sm font-medium">{entidad.razonSocial}</p>
            {entidad.nombreComercial && (
              <p className="text-xs text-muted-foreground">{entidad.nombreComercial}</p>
            )}
          </button>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )
      },
    },
    {
      key: 'metodologia',
      header: 'Metodología',
      sortable: true,
      render: (value) => {
        const labels: Record<string, string> = {
          cascada: 'Cascada', incremental: 'Incremental', agil_scrum: 'Scrum',
          agil_xp: 'XP', rup: 'RUP', espiral: 'Espiral',
        }
        return <span className="text-sm capitalize">{labels[value as string] ?? value}</span>
      },
    },
    {
      key: 'actualizadoEn',
      header: 'Actualizado',
      sortable: true,
      render: (value) => {
        if (!value) return '—'
        try {
          return (
            <span className="text-sm text-muted-foreground">
              {format(new Date(value), 'dd MMM yyyy', { locale: es })}
            </span>
          )
        } catch { return '—' }
      },
    },
  ]

  return (
    <DataTable
      data={proyectos}
      columns={columns}
      loading={loading}
      searchable
      searchPlaceholder="Buscar por nombre o código..."
      pagination
      pageSize={10}
      pageSizeOptions={[10, 25, 50]}
      getRowId={(row) => row.id}
      onRowClick={(row) => router.push(ROUTES.PROYECTO_DETALLE(row.id))}
      emptyMessage="No se encontraron proyectos con los filtros aplicados"
      actions={(row) => (
        <>
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(ROUTES.PROYECTO_DETALLE(row.id))}>
            <Eye className="mr-2 h-4 w-4" />
            Ver detalle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(ROUTES.PROYECTO_EDITAR(row.id))}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCambiarEstado?.(row)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Cambiar estado
          </DropdownMenuItem>
        </>
      )}
    />
  )
}
