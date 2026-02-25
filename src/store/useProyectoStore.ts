// ============================================================
// STORE: useProyectoStore — Módulo 2 (Sprint 3A)
// Zustand para UI state (filtros activos, proyecto seleccionado)
// ============================================================

import { create } from 'zustand'
import type { Proyecto, FiltrosProyecto } from '@/types'

interface ProyectoState {
  proyectoSeleccionado: Proyecto | null
  filtros: FiltrosProyecto
  isLoading: boolean
  error: string | null

  setProyectoSeleccionado: (proyecto: Proyecto | null) => void
  setFiltros: (filtros: FiltrosProyecto) => void
  updateFiltro: <K extends keyof FiltrosProyecto>(key: K, value: FiltrosProyecto[K]) => void
  clearFiltros: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useProyectoStore = create<ProyectoState>()((set) => ({
  proyectoSeleccionado: null,
  filtros: {},
  isLoading: false,
  error: null,

  setProyectoSeleccionado: (proyecto) => set({ proyectoSeleccionado: proyecto }),
  setFiltros: (filtros) => set({ filtros }),
  updateFiltro: (key, value) =>
    set((state) => ({ filtros: { ...state.filtros, [key]: value } })),
  clearFiltros: () => set({ filtros: {} }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ proyectoSeleccionado: null, filtros: {}, isLoading: false, error: null }),
}))
