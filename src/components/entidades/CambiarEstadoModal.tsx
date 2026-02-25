'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialogs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/dialogs';
import { ESTADO_ENTIDAD_CONFIG } from '@/constants';
import { useUpdateEstadoEntidad } from '@/hooks/useEntidades';
import type { Entidad, EstadoEntidad } from '@/types';

interface CambiarEstadoModalProps {
  entidad: Entidad | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CambiarEstadoModal({ entidad, open, onOpenChange }: CambiarEstadoModalProps) {
  const [nuevoEstado, setNuevoEstado] = useState<EstadoEntidad>('activo');
  const [motivo, setMotivo] = useState('');
  const { mutate, isPending } = useUpdateEstadoEntidad();

  const handleSubmit = () => {
    if (!entidad || !motivo.trim()) return;
    mutate(
      { id: entidad.id, estado: nuevoEstado, motivo },
      {
        onSuccess: () => {
          onOpenChange(false);
          setMotivo('');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar estado</DialogTitle>
          <DialogDescription>
            Cambiando estado de <strong>{entidad?.razonSocial}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Nuevo estado</Label>
            <Select
              value={nuevoEstado}
              onValueChange={(v) => setNuevoEstado(v as EstadoEntidad)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ESTADO_ENTIDAD_CONFIG).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Motivo <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Indique el motivo del cambio de estado..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
            {!motivo.trim() && (
              <p className="text-xs text-destructive">El motivo es obligatorio</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !motivo.trim()}
          >
            {isPending ? 'Guardando...' : 'Guardar cambio'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
