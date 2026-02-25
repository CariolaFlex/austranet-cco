// ============================================================
// STORE: useEntidadStore — Módulo 1
// Estado global de entidades con Zustand
// ============================================================

import { create } from 'zustand';
import type { Entidad, FiltrosEntidad } from '@/types';

interface EntidadState {
  entidadSeleccionada: Entidad | null;
  filtrosActivos: FiltrosEntidad;
  vistaActual: 'tabla' | 'tarjetas';

  setEntidadSeleccionada: (entidad: Entidad | null) => void;
  setFiltros: (filtros: FiltrosEntidad) => void;
  clearFiltros: () => void;
  setVista: (vista: 'tabla' | 'tarjetas') => void;
}

export const useEntidadStore = create<EntidadState>()((set) => ({
  entidadSeleccionada: null,
  filtrosActivos: {},
  vistaActual: 'tabla',

  setEntidadSeleccionada: (entidad) => set({ entidadSeleccionada: entidad }),
  setFiltros: (filtros) => set({ filtrosActivos: filtros }),
  clearFiltros: () => set({ filtrosActivos: {} }),
  setVista: (vista) => set({ vistaActual: vista }),
}));
