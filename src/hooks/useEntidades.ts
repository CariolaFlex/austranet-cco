// ============================================================
// HOOK: useEntidades — Módulo 1
// Usa TanStack Query + entidadesService
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { entidadesService } from '@/services/entidades.service';
import type { FiltrosEntidad, CrearEntidadDTO, ActualizarEntidadDTO, EstadoEntidad } from '@/types';

/** Lista de entidades con filtros opcionales */
export function useEntidades(filtros?: FiltrosEntidad) {
  return useQuery({
    queryKey: ['entidades', filtros],
    queryFn: () => entidadesService.getAll(filtros),
    staleTime: 5 * 60 * 1000,
  });
}

/** Entidad individual por ID */
export function useEntidad(id: string) {
  return useQuery({
    queryKey: ['entidades', id],
    queryFn: () => entidadesService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/** Historial de una entidad */
export function useEntidadHistorial(entidadId: string) {
  return useQuery({
    queryKey: ['entidades', entidadId, 'historial'],
    queryFn: async () => {
      const { getFirestoreDb, convertTimestamps } = await import('@/lib/firebase/firestore');
      const { collection, getDocs, orderBy, query } = await import('firebase/firestore');
      const db = getFirestoreDb();
      const ref = collection(db, 'entidades', entidadId, 'historial');
      const q = query(ref, orderBy('fechaHora', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map((d) => convertTimestamps({ id: d.id, ...d.data() }));
    },
    enabled: !!entidadId,
  });
}

/** Crear entidad */
export function useCreateEntidad() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CrearEntidadDTO) => entidadesService.create(data),
    onSuccess: (entidad) => {
      qc.invalidateQueries({ queryKey: ['entidades'] });
      toast.success(`Entidad "${entidad.razonSocial}" creada correctamente`);
    },
    onError: (error: Error) => {
      toast.error(`Error al crear la entidad: ${error.message}`);
    },
  });
}

/** Actualizar entidad */
export function useUpdateEntidad() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ActualizarEntidadDTO }) =>
      entidadesService.update(id, data),
    onSuccess: (entidad) => {
      qc.invalidateQueries({ queryKey: ['entidades'] });
      qc.invalidateQueries({ queryKey: ['entidades', entidad.id] });
      toast.success('Entidad actualizada correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar: ${error.message}`);
    },
  });
}

/** Cambiar estado de entidad */
export function useUpdateEstadoEntidad() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, estado, motivo }: { id: string; estado: EstadoEntidad; motivo: string }) =>
      entidadesService.updateEstado(id, estado, motivo),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['entidades'] });
      qc.invalidateQueries({ queryKey: ['entidades', variables.id] });
      qc.invalidateQueries({ queryKey: ['entidades', variables.id, 'historial'] });
      toast.success('Estado actualizado correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al cambiar estado: ${error.message}`);
    },
  });
}

/** Eliminar entidad (soft delete) */
export function useDeleteEntidad() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => entidadesService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['entidades'] });
      toast.success('Entidad desactivada correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar: ${error.message}`);
    },
  });
}
