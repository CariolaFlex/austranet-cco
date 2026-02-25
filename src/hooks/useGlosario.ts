// ============================================================
// HOOK: useGlosario — Módulo 1 Sprint 2
// Glosario de dominio por entidad (M1-03)
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { entidadesService } from '@/services/entidades.service';
import type { CrearEntradaGlosarioDTO, ChecklistGlosario } from '@/types';

/** Lista de términos del glosario de una entidad (A-Z) */
export function useGlosario(entidadId: string) {
  return useQuery({
    queryKey: ['glosario', entidadId],
    queryFn: () => entidadesService.glosario.getAll(entidadId),
    enabled: !!entidadId,
    staleTime: 5 * 60 * 1000,
  });
}

/** Cantidad de términos en el glosario (para KPIs) */
export function useGlosarioCount(entidadId: string) {
  return useQuery({
    queryKey: ['glosario', entidadId, 'count'],
    queryFn: () => entidadesService.glosario.getCount(entidadId),
    enabled: !!entidadId,
    staleTime: 5 * 60 * 1000,
  });
}

/** Crear un término en el glosario */
export function useCreateEntradaGlosario(entidadId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CrearEntradaGlosarioDTO) =>
      entidadesService.glosario.create(entidadId, data),
    onSuccess: (entrada) => {
      qc.invalidateQueries({ queryKey: ['glosario', entidadId] });
      toast.success(`Término "${entrada.termino}" agregado al glosario`);
    },
    onError: (error: Error) => {
      toast.error(`Error al agregar término: ${error.message}`);
    },
  });
}

/** Actualizar un término del glosario */
export function useUpdateEntradaGlosario(entidadId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      terminoId,
      data,
    }: {
      terminoId: string;
      data: Partial<CrearEntradaGlosarioDTO>;
    }) => entidadesService.glosario.update(entidadId, terminoId, data),
    onSuccess: (entrada) => {
      qc.invalidateQueries({ queryKey: ['glosario', entidadId] });
      toast.success(`Término "${entrada.termino}" actualizado`);
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar término: ${error.message}`);
    },
  });
}

/** Eliminar un término del glosario (hard delete) */
export function useDeleteEntradaGlosario(entidadId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (terminoId: string) =>
      entidadesService.glosario.delete(entidadId, terminoId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['glosario', entidadId] });
      toast.success('Término eliminado del glosario');
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar término: ${error.message}`);
    },
  });
}

/** Actualizar checklist operativo del glosario (M1-03 §8) */
export function useUpdateChecklistGlosario(entidadId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (checklist: Partial<ChecklistGlosario>) =>
      entidadesService.updateChecklistGlosario(entidadId, checklist),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['entidades', entidadId] });
    },
    onError: (error: Error) => {
      toast.error(`Error al guardar checklist: ${error.message}`);
    },
  });
}
