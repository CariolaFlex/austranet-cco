'use client';

import { use } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui';
import { EntidadForm } from '@/components/entidades/EntidadForm';
import { useEntidad } from '@/hooks/useEntidades';
import { ROUTES } from '@/constants';

interface Props {
  params: Promise<{ entidadId: string }>;
}

export default function EditarEntidadPage({ params }: Props) {
  const { entidadId } = use(params);
  const { data: entidad, isLoading, isError } = useEntidad(entidadId);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !entidad) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.ENTIDADES}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Volver
          </Link>
        </Button>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-sm text-destructive">
            No se encontró la entidad o ocurrió un error al cargarla.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.ENTIDAD_DETALLE(entidadId)}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Editar entidad</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{entidad.razonSocial}</p>
        </div>
      </div>

      <EntidadForm mode="edit" entidad={entidad} />
    </div>
  );
}
