// ============================================================
// SERVICIO: Proyectos — Módulo 2
// Estado: STUB — pendiente de implementación
// Documentación: /docs/modulo-2-proyectos/
// ============================================================

import type { Proyecto } from '@/types';

export const proyectosService = {
  getAll: async (): Promise<Proyecto[]> => {
    throw new Error('proyectosService.getAll: no implementado aún');
  },

  getById: async (_id: string): Promise<Proyecto | null> => {
    throw new Error('proyectosService.getById: no implementado aún');
  },

  create: async (_data: Omit<Proyecto, 'id' | 'creadoEn' | 'actualizadoEn'>): Promise<Proyecto> => {
    throw new Error('proyectosService.create: no implementado aún');
  },

  update: async (_id: string, _data: Partial<Proyecto>): Promise<Proyecto> => {
    throw new Error('proyectosService.update: no implementado aún');
  },

  delete: async (_id: string): Promise<void> => {
    throw new Error('proyectosService.delete: no implementado aún');
  },
};
