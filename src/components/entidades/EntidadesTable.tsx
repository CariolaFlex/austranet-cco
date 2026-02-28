'use client';

import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MoreHorizontal, Eye, Pencil, RefreshCw, Trash2 } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dialogs';
import { ESTADO_ENTIDAD_CONFIG, NIVEL_RIESGO_CONFIG, ROUTES } from '@/constants';
import { entidadesService } from '@/services/entidades.service';
import type { Entidad } from '@/types';

// Mapeo de color string a clases Tailwind
const colorMap: Record<string, string> = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200',
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200',
};

function ColorBadge({ color, label }: { color: string; label: string }) {
  return (
    <Badge variant="outline" className={colorMap[color] || colorMap.gray}>
      {label}
    </Badge>
  );
}

const COMPLETITUD_CONFIG = {
  minimo: { label: 'Mínimo', color: 'gray' },
  estandar: { label: 'Estándar', color: 'blue' },
  completo: { label: 'Completo', color: 'green' },
};

const TIPO_CONFIG = {
  cliente: { label: 'Cliente', color: 'blue' },
  proveedor: { label: 'Proveedor', color: 'purple' },
  ambos: { label: 'Ambos', color: 'orange' },
};

interface EntidadesTableProps {
  entidades: Entidad[];
  loading?: boolean;
  onCambiarEstado?: (entidad: Entidad) => void;
  onDelete?: (entidad: Entidad) => void;
}

export function EntidadesTable({ entidades, loading, onCambiarEstado, onDelete }: EntidadesTableProps) {
  const router = useRouter();

  const columns: Column<Entidad>[] = [
    {
      key: 'razonSocial',
      header: 'Razón Social',
      sortable: true,
      render: (_, row) => (
        <div>
          <p className="font-medium text-foreground">{row.razonSocial}</p>
          {row.nombreComercial && (
            <p className="text-xs text-muted-foreground mt-0.5">{row.nombreComercial}</p>
          )}
        </div>
      ),
    },
    {
      key: 'tipo',
      header: 'Tipo',
      sortable: true,
      render: (value) => {
        const cfg = TIPO_CONFIG[value as keyof typeof TIPO_CONFIG];
        return <ColorBadge color={cfg?.color ?? 'gray'} label={cfg?.label ?? value} />;
      },
    },
    {
      key: 'sector',
      header: 'Sector',
      sortable: true,
      render: (value) => <span className="capitalize text-sm">{value}</span>,
    },
    {
      key: 'pais',
      header: 'País',
      sortable: true,
    },
    {
      key: 'estado',
      header: 'Estado',
      sortable: true,
      render: (value) => {
        const cfg = ESTADO_ENTIDAD_CONFIG[value as keyof typeof ESTADO_ENTIDAD_CONFIG];
        return <ColorBadge color={cfg?.color ?? 'gray'} label={cfg?.label ?? value} />;
      },
    },
    {
      key: 'nivelRiesgo',
      header: 'Riesgo',
      sortable: true,
      render: (value) => {
        const cfg = NIVEL_RIESGO_CONFIG[value as keyof typeof NIVEL_RIESGO_CONFIG];
        return <ColorBadge color={cfg?.color ?? 'gray'} label={cfg?.label ?? value} />;
      },
    },
    {
      key: 'completitud',
      header: 'Completitud',
      render: (_, row) => {
        const nivel = entidadesService.calcularNivelCompletitud(row);
        const cfg = COMPLETITUD_CONFIG[nivel];
        return <ColorBadge color={cfg.color} label={cfg.label} />;
      },
    },
    {
      key: 'actualizadoEn',
      header: 'Actualización',
      sortable: true,
      render: (value) => {
        if (!value) return '-';
        try {
          return (
            <span className="text-sm text-muted-foreground">
              {format(new Date(value), 'dd MMM yyyy', { locale: es })}
            </span>
          );
        } catch {
          return '-';
        }
      },
    },
  ];

  return (
    <DataTable
      data={entidades}
      columns={columns}
      loading={loading}
      searchable
      searchPlaceholder="Buscar por nombre, RUT..."
      pagination
      pageSize={10}
      pageSizeOptions={[10, 25, 50]}
      getRowId={(row) => row.id}
      onRowClick={(row) => router.push(ROUTES.ENTIDAD_DETALLE(row.id))}
      emptyMessage="No se encontraron entidades con los filtros aplicados"
      actions={(row) => (
        <>
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(ROUTES.ENTIDAD_DETALLE(row.id))}>
            <Eye className="mr-2 h-4 w-4" />
            Ver detalle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(ROUTES.ENTIDAD_EDITAR(row.id))}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCambiarEstado?.(row)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Cambiar estado
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => {
              if (confirm(`¿Desactivar "${row.razonSocial}"?\n\nLa entidad pasará a estado inactivo. Esta acción puede revertirse cambiando el estado nuevamente.`)) {
                onDelete?.(row);
              }
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </>
      )}
    />
  );
}
