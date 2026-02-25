// ============================================================
// SERVICIO: Entidades — Módulo 1
// Estado: STUB — pendiente de implementación
// Documentación: /docs/modulo-1-entidades/
// ============================================================

import type { Entidad } from '@/types';

export const entidadesService = {
  getAll: async (): Promise<Entidad[]> => {
    throw new Error('entidadesService.getAll: no implementado aún');
  },

  getById: async (_id: string): Promise<Entidad | null> => {
    throw new Error('entidadesService.getById: no implementado aún');
  },

  create: async (_data: Omit<Entidad, 'id' | 'creadoEn' | 'actualizadoEn'>): Promise<Entidad> => {
    throw new Error('entidadesService.create: no implementado aún');
  },

  update: async (_id: string, _data: Partial<Entidad>): Promise<Entidad> => {
    throw new Error('entidadesService.update: no implementado aún');
  },

  delete: async (_id: string): Promise<void> => {
    throw new Error('entidadesService.delete: no implementado aún');
  },
};
