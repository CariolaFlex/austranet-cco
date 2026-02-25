import { FolderKanban, Plus } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';

export default function ProyectosPage() {
  return (
    <div>
      <PageHeader
        title="Proyectos"
        description="Gestión de proyectos de software"
        action={{
          label: 'Nuevo proyecto',
          icon: Plus,
          href: '/proyectos/nuevo',
        }}
      />

      <EmptyState
        icon={FolderKanban}
        title="No hay proyectos registrados"
        description="Crea tu primer proyecto para comenzar a gestionar el desarrollo de software."
        action={{ label: 'Crear proyecto', href: '/proyectos/nuevo' }}
      />
    </div>
  );
}
