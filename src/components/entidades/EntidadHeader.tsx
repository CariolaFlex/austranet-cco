'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ESTADO_ENTIDAD_CONFIG, NIVEL_RIESGO_CONFIG, ROUTES } from '@/constants';
import { entidadesService } from '@/services/entidades.service';
import { useDeleteEntidad } from '@/hooks/useEntidades';
import { CambiarEstadoModal } from './CambiarEstadoModal';
import type { Entidad } from '@/types';

const COLOR_MAP: Record<string, string> = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200',
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
};

const TIPO_LABELS: Record<string, { label: string; color: string }> = {
  cliente: { label: 'Cliente', color: 'blue' },
  proveedor: { label: 'Proveedor', color: 'gray' },
  ambos: { label: 'Cliente + Proveedor', color: 'orange' },
};

const COMPLETITUD_CONFIG = {
  minimo: { label: 'MÍNIMO', color: 'gray' },
  estandar: { label: 'ESTÁNDAR', color: 'blue' },
  completo: { label: 'COMPLETO', color: 'green' },
};

interface EntidadHeaderProps {
  entidad: Entidad;
  onDeleted?: () => void;
}

export function EntidadHeader({ entidad, onDeleted }: EntidadHeaderProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteEntidad();

  const nivel = entidadesService.calcularNivelCompletitud(entidad);
  const completitudCfg = COMPLETITUD_CONFIG[nivel];
  const estadoCfg = ESTADO_ENTIDAD_CONFIG[entidad.estado];
  const riesgoCfg = NIVEL_RIESGO_CONFIG[entidad.nivelRiesgo];
  const tipoCfg = TIPO_LABELS[entidad.tipo];

  const handleDelete = () => {
    if (!confirm(`¿Desactivar la entidad "${entidad.razonSocial}"? Esta acción cambiará su estado a inactivo.`)) return;
    deleteMutate(entidad.id, { onSuccess: onDeleted });
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{entidad.razonSocial}</h1>
            {entidad.nombreComercial && (
              <p className="text-muted-foreground mt-0.5">{entidad.nombreComercial}</p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline" className={COLOR_MAP[tipoCfg?.color ?? 'gray']}>
                {tipoCfg?.label ?? entidad.tipo}
              </Badge>
              <Badge variant="outline" className={COLOR_MAP[estadoCfg?.color ?? 'gray']}>
                {estadoCfg?.label ?? entidad.estado}
              </Badge>
              <Badge variant="outline" className={COLOR_MAP[riesgoCfg?.color ?? 'gray']}>
                Riesgo {riesgoCfg?.label ?? entidad.nivelRiesgo}
              </Badge>
              <Badge variant="outline" className={COLOR_MAP[completitudCfg.color]}>
                {completitudCfg.label}
              </Badge>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.ENTIDAD_EDITAR(entidad.id)}>
                <Pencil className="mr-1.5 h-4 w-4" />
                Editar
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>
              <RefreshCw className="mr-1.5 h-4 w-4" />
              Estado
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </div>
        </div>
      </div>

      <CambiarEstadoModal
        entidad={entidad}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
