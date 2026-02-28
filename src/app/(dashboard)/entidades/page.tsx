'use client';

import { useState } from 'react';
import { Plus, Building2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { EntidadesTable } from '@/components/entidades/EntidadesTable';
import { EntidadesFiltros } from '@/components/entidades/EntidadesFiltros';
import { CambiarEstadoModal } from '@/components/entidades/CambiarEstadoModal';
import { Skeleton } from '@/components/ui';
import { useEntidades, useDeleteEntidad } from '@/hooks/useEntidades';
import { useEntidadStore } from '@/store/useEntidadStore';
import { ROUTES } from '@/constants';
import type { Entidad } from '@/types';

export default function EntidadesPage() {
  const { filtrosActivos, setFiltros, clearFiltros } = useEntidadStore();
  const { data: entidades, isLoading, isError } = useEntidades(filtrosActivos);
  const { mutate: eliminarEntidad } = useDeleteEntidad();
  const [entidadParaEstado, setEntidadParaEstado] = useState<Entidad | null>(null);

  const handleDelete = (entidad: Entidad) => {
    eliminarEntidad(entidad.id);
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Entidades"
          description="Gestión de clientes y proveedores"
          action={{ label: 'Nueva entidad', icon: Plus, href: ROUTES.ENTIDAD_NUEVA }}
        />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <PageHeader
          title="Entidades"
          description="Gestión de clientes y proveedores"
          action={{ label: 'Nueva entidad', icon: Plus, href: ROUTES.ENTIDAD_NUEVA }}
        />
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-sm text-destructive">
            Error al cargar las entidades. Verifica tu conexión e intenta nuevamente.
          </p>
        </div>
      </div>
    );
  }

  const lista = entidades ?? [];

  return (
    <div>
      <PageHeader
        title="Entidades"
        description="Gestión de clientes y proveedores"
        action={{ label: 'Nueva entidad', icon: Plus, href: ROUTES.ENTIDAD_NUEVA }}
      />

      <EntidadesFiltros
        filtros={filtrosActivos}
        totalResultados={lista.length}
        onChange={setFiltros}
        onLimpiar={clearFiltros}
      />

      {lista.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No hay entidades registradas"
          description="Comienza agregando tu primer cliente o proveedor para gestionar tus relaciones comerciales."
          action={{ label: 'Nueva entidad', href: ROUTES.ENTIDAD_NUEVA }}
        />
      ) : (
        <EntidadesTable
          entidades={lista}
          loading={isLoading}
          onCambiarEstado={setEntidadParaEstado}
          onDelete={handleDelete}
        />
      )}

      <CambiarEstadoModal
        entidad={entidadParaEstado}
        open={!!entidadParaEstado}
        onOpenChange={(open) => { if (!open) setEntidadParaEstado(null); }}
      />
    </div>
  );
}
