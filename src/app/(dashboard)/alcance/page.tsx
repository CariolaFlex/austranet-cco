import { FileText } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';

export default function AlcancePage() {
  return (
    <div>
      <PageHeader
        title="Alcance / SRS"
        description="Documentación de objetivos y especificación de requerimientos"
      />

      <EmptyState
        icon={FileText}
        title="Sin documentos SRS"
        description="Los documentos SRS se generan desde cada proyecto. Navega a un proyecto para crear su alcance."
        action={{ label: 'Ver proyectos', href: '/proyectos' }}
      />
    </div>
  );
}
