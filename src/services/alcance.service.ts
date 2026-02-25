// ============================================================
// SERVICIO: Alcance / SRS — Módulo 3
// Estado: STUB — pendiente de implementación
// Documentación: /docs/modulo-3-alcance/
// ============================================================

import type { SRS, Requerimiento } from '@/types';

export const alcanceService = {
  // SRS
  getAllSRS: async (): Promise<SRS[]> => {
    throw new Error('alcanceService.getAllSRS: no implementado aún');
  },

  getSRSByProyecto: async (_proyectoId: string): Promise<SRS | null> => {
    throw new Error('alcanceService.getSRSByProyecto: no implementado aún');
  },

  createSRS: async (_data: Omit<SRS, 'id' | 'creadoEn' | 'actualizadoEn'>): Promise<SRS> => {
    throw new Error('alcanceService.createSRS: no implementado aún');
  },

  updateSRS: async (_id: string, _data: Partial<SRS>): Promise<SRS> => {
    throw new Error('alcanceService.updateSRS: no implementado aún');
  },

  // Requerimientos
  getRequerimientos: async (_proyectoId: string): Promise<Requerimiento[]> => {
    throw new Error('alcanceService.getRequerimientos: no implementado aún');
  },

  createRequerimiento: async (_data: Omit<Requerimiento, 'id' | 'creadoEn' | 'actualizadoEn'>): Promise<Requerimiento> => {
    throw new Error('alcanceService.createRequerimiento: no implementado aún');
  },

  updateRequerimiento: async (_id: string, _data: Partial<Requerimiento>): Promise<Requerimiento> => {
    throw new Error('alcanceService.updateRequerimiento: no implementado aún');
  },

  deleteRequerimiento: async (_id: string): Promise<void> => {
    throw new Error('alcanceService.deleteRequerimiento: no implementado aún');
  },
};
