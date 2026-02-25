'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PlusCircle, RefreshCw, Users, Edit } from 'lucide-react';
import { useEntidadHistorial } from '@/hooks/useEntidades';
import { Skeleton } from '@/components/ui';

const TIPO_ACCION_CONFIG = {
  creacion: { label: 'Creación', icon: PlusCircle, color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
  actualizacion_datos: { label: 'Actualización', icon: Edit, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
  cambio_estado: { label: 'Cambio de estado', icon: RefreshCw, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' },
  gestion_stakeholders: { label: 'Stakeholders', icon: Users, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
};

interface HistorialTabProps {
  entidadId: string;
}

export function HistorialTab({ entidadId }: HistorialTabProps) {
  const { data: historial, isLoading } = useEntidadHistorial(entidadId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!historial || historial.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <RefreshCw className="h-8 w-8 mx-auto mb-3 opacity-40" />
        <p className="text-sm">No hay cambios registrados en el historial</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {(historial as any[]).map((entrada) => {
        const cfg = TIPO_ACCION_CONFIG[entrada.tipoAccion as keyof typeof TIPO_ACCION_CONFIG] || TIPO_ACCION_CONFIG.actualizacion_datos;
        const Icon = cfg.icon;

        return (
          <div key={entrada.id} className="flex gap-4 p-4 rounded-lg border bg-card">
            <div className={`flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full ${cfg.color}`}>
              <Icon className="h-4 w-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-medium text-sm">{cfg.label}</span>
                  <span className="text-sm text-muted-foreground"> · {entrada.usuarioNombre}</span>
                </div>
                {entrada.fechaHora && (
                  <time className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(entrada.fechaHora), 'dd MMM yyyy HH:mm', { locale: es })}
                  </time>
                )}
              </div>

              {entrada.campoModificado && (
                <p className="text-sm text-muted-foreground mt-1">
                  Campo: <span className="font-medium text-foreground">{entrada.campoModificado}</span>
                  {entrada.valorAnterior && (
                    <> · Antes: <span className="line-through">{entrada.valorAnterior}</span></>
                  )}
                  {entrada.valorNuevo && (
                    <> → <span className="font-medium text-foreground">{entrada.valorNuevo}</span></>
                  )}
                </p>
              )}

              {entrada.motivo && (
                <p className="text-xs text-muted-foreground mt-1 italic">
                  Motivo: {entrada.motivo}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
