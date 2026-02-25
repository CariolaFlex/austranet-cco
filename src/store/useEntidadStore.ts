// ============================================================
// Austranet CCO - Entidad Store (Zustand) — STUB
// Módulo 1: Registro y Gestión de Clientes y Proveedores
// Estado: STUB — pendiente de implementación
// ============================================================

import { create } from 'zustand';
import type { Entidad } from '@/types';

interface EntidadState {
  // Estado
  entidades: Entidad[];
  entidadSeleccionada: Entidad | null;
  isLoading: boolean;
  error: string | null;

  // Acciones — por implementar
  setEntidades: (entidades: Entidad[]) => void;
  setEntidadSeleccionada: (entidad: Entidad | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useEntidadStore = create<EntidadState>()((set) => ({
  entidades: [],
  entidadSeleccionada: null,
  isLoading: false,
  error: null,

  setEntidades: (entidades) => set({ entidades }),
  setEntidadSeleccionada: (entidad) => set({ entidadSeleccionada: entidad }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ entidades: [], entidadSeleccionada: null, isLoading: false, error: null }),
}));
