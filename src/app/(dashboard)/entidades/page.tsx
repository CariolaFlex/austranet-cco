import { Building2, Plus } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';

export default function EntidadesPage() {
  return (
    <div>
      <PageHeader
        title="Entidades"
        description="Gestión de clientes y proveedores"
        action={{
          label: 'Nueva entidad',
          icon: Plus,
          href: '/entidades/nueva',
        }}
      />

      <EmptyState
        icon={Building2}
        title="No hay entidades registradas"
        description="Comienza agregando tu primer cliente o proveedor para gestionar tus relaciones comerciales."
        action={{ label: 'Agregar entidad', href: '/entidades/nueva' }}
      />
    </div>
  );
}
