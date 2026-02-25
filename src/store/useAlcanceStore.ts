// ============================================================
// Austranet CCO - Alcance Store (Zustand) — STUB
// Módulo 3: Documentación de Objetivos y Alcance (SRS)
// Estado: STUB — pendiente de implementación
// ============================================================

import { create } from 'zustand';
import type { SRS, Requerimiento } from '@/types';

interface AlcanceState {
  // Estado
  srsList: SRS[];
  srsSeleccionado: SRS | null;
  requerimientos: Requerimiento[];
  isLoading: boolean;
  error: string | null;

  // Acciones — por implementar
  setSrsList: (srsList: SRS[]) => void;
  setSrsSeleccionado: (srs: SRS | null) => void;
  setRequerimientos: (requerimientos: Requerimiento[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAlcanceStore = create<AlcanceState>()((set) => ({
  srsList: [],
  srsSeleccionado: null,
  requerimientos: [],
  isLoading: false,
  error: null,

  setSrsList: (srsList) => set({ srsList }),
  setSrsSeleccionado: (srs) => set({ srsSeleccionado: srs }),
  setRequerimientos: (requerimientos) => set({ requerimientos }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ srsList: [], srsSeleccionado: null, requerimientos: [], isLoading: false, error: null }),
}));
