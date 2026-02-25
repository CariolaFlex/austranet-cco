// ============================================================
// Austranet CCO - Proyecto Store (Zustand) — STUB
// Módulo 2: Registro y Configuración de Proyectos
// Estado: STUB — pendiente de implementación
// ============================================================

import { create } from 'zustand';
import type { Proyecto } from '@/types';

interface ProyectoState {
  // Estado
  proyectos: Proyecto[];
  proyectoSeleccionado: Proyecto | null;
  isLoading: boolean;
  error: string | null;

  // Acciones — por implementar
  setProyectos: (proyectos: Proyecto[]) => void;
  setProyectoSeleccionado: (proyecto: Proyecto | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useProyectoStore = create<ProyectoState>()((set) => ({
  proyectos: [],
  proyectoSeleccionado: null,
  isLoading: false,
  error: null,

  setProyectos: (proyectos) => set({ proyectos }),
  setProyectoSeleccionado: (proyecto) => set({ proyectoSeleccionado: proyecto }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ proyectos: [], proyectoSeleccionado: null, isLoading: false, error: null }),
}));
