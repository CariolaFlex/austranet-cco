'use client';

import { CheckCircle, XCircle, AlertCircle, Users, ShieldCheck, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { entidadesService } from '@/services/entidades.service';
import type { Entidad } from '@/types';

interface EntidadKPIsProps {
  entidad: Entidad;
  proyectosActivos?: number;
}

const COMPLETITUD_LABELS = {
  minimo: { label: 'Mínimo', color: 'text-gray-600', progress: 33 },
  estandar: { label: 'Estándar', color: 'text-blue-600', progress: 66 },
  completo: { label: 'Completo', color: 'text-green-600', progress: 100 },
};

export function EntidadKPIs({ entidad, proyectosActivos = 0 }: EntidadKPIsProps) {
  const nivel = entidadesService.calcularNivelCompletitud(entidad);
  const cfg = COMPLETITUD_LABELS[nivel];
  const stakeholdersAltos = entidad.stakeholders.filter((s) => s.nivelInfluencia === 'alto').length;
  const ndaVigente =
    entidad.tieneNDA === false
      ? false
      : entidad.tieneNDA === true && !!entidad.fechaNDA;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Completitud */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Completitud</span>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className={`text-lg font-bold ${cfg.color}`}>{cfg.label}</div>
          <Progress value={cfg.progress} className="h-1.5 mt-2" />
        </CardContent>
      </Card>

      {/* Stakeholders de influencia alta */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Influencia alta</span>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-lg font-bold">{stakeholdersAltos}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stakeholdersAltos >= 2 ? 'Óptimo' : stakeholdersAltos === 1 ? 'Mínimo' : 'Insuficiente'}
          </p>
        </CardContent>
      </Card>

      {/* NDA */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">NDA</span>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-1.5">
            {entidad.tieneNDA === false ? (
              <>
                <XCircle className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-muted-foreground">Sin NDA</span>
              </>
            ) : ndaVigente ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">Vigente</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-600">Sin fecha</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Proyectos activos */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Proyectos activos</span>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-lg font-bold">{proyectosActivos}</div>
          <p className="text-xs text-muted-foreground mt-1">vinculados</p>
        </CardContent>
      </Card>
    </div>
  );
}
