'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EntidadForm } from '@/components/entidades/EntidadForm';
import { ROUTES } from '@/constants';

export default function NuevaEntidadPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.ENTIDADES}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nueva entidad</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Registrar nuevo cliente o proveedor
          </p>
        </div>
      </div>

      <EntidadForm mode="create" />
    </div>
  );
}
