'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/dialogs';
import { ESTADO_ENTIDAD_CONFIG, NIVEL_RIESGO_CONFIG } from '@/constants';
import type { FiltrosEntidad } from '@/types';

const SECTORES = [
  { value: 'construccion', label: 'Construcción' },
  { value: 'salud', label: 'Salud' },
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'educacion', label: 'Educación' },
  { value: 'finanzas', label: 'Finanzas' },
  { value: 'manufactura', label: 'Manufactura' },
  { value: 'retail', label: 'Retail' },
  { value: 'consultoria', label: 'Consultoría' },
  { value: 'otro', label: 'Otro' },
];

interface EntidadesFiltrosProps {
  filtros: FiltrosEntidad;
  totalResultados: number;
  onChange: (filtros: FiltrosEntidad) => void;
  onLimpiar: () => void;
}

export function EntidadesFiltros({
  filtros,
  totalResultados,
  onChange,
  onLimpiar,
}: EntidadesFiltrosProps) {
  const hayFiltros =
    filtros.tipo || filtros.estado || filtros.sector || filtros.nivelRiesgo || filtros.busqueda;

  return (
    <div className="space-y-3 mb-4">
      <div className="flex flex-wrap gap-3 items-end">
        {/* Búsqueda */}
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Buscar por nombre o RUT..."
            value={filtros.busqueda ?? ''}
            onChange={(e) => onChange({ ...filtros, busqueda: e.target.value || undefined })}
            className="h-9"
          />
        </div>

        {/* Tipo */}
        <div className="w-[160px]">
          <Select
            value={filtros.tipo ?? '__all__'}
            onValueChange={(v) => onChange({ ...filtros, tipo: v === '__all__' ? undefined : v as FiltrosEntidad['tipo'] })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todos los tipos</SelectItem>
              <SelectItem value="cliente">Cliente</SelectItem>
              <SelectItem value="proveedor">Proveedor</SelectItem>
              <SelectItem value="ambos">Ambos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Estado */}
        <div className="w-[160px]">
          <Select
            value={filtros.estado ?? '__all__'}
            onValueChange={(v) => onChange({ ...filtros, estado: v === '__all__' ? undefined : v as FiltrosEntidad['estado'] })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todos los estados</SelectItem>
              {Object.entries(ESTADO_ENTIDAD_CONFIG).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sector */}
        <div className="w-[160px]">
          <Select
            value={filtros.sector ?? '__all__'}
            onValueChange={(v) => onChange({ ...filtros, sector: v === '__all__' ? undefined : v as FiltrosEntidad['sector'] })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todos los sectores</SelectItem>
              {SECTORES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nivel Riesgo */}
        <div className="w-[160px]">
          <Select
            value={filtros.nivelRiesgo ?? '__all__'}
            onValueChange={(v) => onChange({ ...filtros, nivelRiesgo: v === '__all__' ? undefined : v as FiltrosEntidad['nivelRiesgo'] })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Riesgo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todos los riesgos</SelectItem>
              {Object.entries(NIVEL_RIESGO_CONFIG).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Limpiar */}
        {hayFiltros && (
          <Button variant="ghost" size="sm" onClick={onLimpiar} className="h-9 gap-1">
            <X className="h-4 w-4" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Contador de resultados */}
      <p className="text-sm text-muted-foreground">
        {totalResultados === 0
          ? 'Sin resultados'
          : `${totalResultados} entidad${totalResultados !== 1 ? 'es' : ''} encontrada${totalResultados !== 1 ? 's' : ''}`}
      </p>
    </div>
  );
}
