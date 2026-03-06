// ============================================================
// HOOK: useCatalogoInsumos — Módulo 5 (Sprint M5-S03)
// Usa TanStack Query v5 + catalogoInsumosService
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { catalogoInsumosService } from '@/services/catalogo-insumos.service'
import type {
  CrearCatalogoInsumoDTO,
  ActualizarCatalogoInsumoDTO,
  FiltrosCatalogoInsumo,
  CategoriaInsumo,
} from '@/types'

// ── QueryKeys ─────────────────────────────────────────────────────────────────

const QK_CATALOGO = ['catalogo_insumos'] as const

// ── QUERIES ───────────────────────────────────────────────────────────────────

/**
 * Lista todos los insumos del catálogo.
 * `filtros.soloActivos` = true por defecto.
 * Usa JSON.stringify para que los filtros funcionen como clave de caché.
 */
export function useCatalogoInsumos(filtros: FiltrosCatalogoInsumo = {}) {
  return useQuery({
    queryKey: [...QK_CATALOGO, 'lista', JSON.stringify(filtros)],
    queryFn: () => catalogoInsumosService.getAll(filtros),
    staleTime: 5 * 60 * 1000,  // 5 min — el catálogo cambia poco
  })
}

/** Obtiene un insumo del catálogo por ID. */
export function useCatalogoInsumo(id: string) {
  return useQuery({
    queryKey: [...QK_CATALOGO, 'detalle', id],
    queryFn: () => catalogoInsumosService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Búsqueda reactiva de insumos por texto y tipo opcional.
 * Se activa solo cuando `texto` tiene ≥ 2 caracteres.
 */
export function useBuscarCatalogoInsumos(texto: string, tipo?: CategoriaInsumo) {
  return useQuery({
    queryKey: [...QK_CATALOGO, 'buscar', texto, tipo ?? 'todos'],
    queryFn: () => catalogoInsumosService.buscar(texto, tipo),
    enabled: texto.trim().length >= 2,
    staleTime: 60 * 1000,  // 1 min — búsquedas tienen caché corto
  })
}

/** Lista insumos del catálogo filtrados por tipo. */
export function useCatalogoInsumosPorTipo(tipo: CategoriaInsumo) {
  return useQuery({
    queryKey: [...QK_CATALOGO, 'tipo', tipo],
    queryFn: () => catalogoInsumosService.getByTipo(tipo),
    staleTime: 5 * 60 * 1000,
  })
}

// ── MUTATIONS ─────────────────────────────────────────────────────────────────

/** Crea un nuevo insumo en el catálogo global. */
export function useCrearCatalogoInsumo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CrearCatalogoInsumoDTO) => catalogoInsumosService.crear(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK_CATALOGO })
      toast.success('Insumo añadido al catálogo')
    },
    onError: (error: Error) => {
      toast.error(`Error al crear insumo: ${error.message}`)
    },
  })
}

/** Actualiza un insumo del catálogo. */
export function useActualizarCatalogoInsumo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: ActualizarCatalogoInsumoDTO }) =>
      catalogoInsumosService.actualizar(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK_CATALOGO })
      toast.success('Insumo del catálogo actualizado')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar insumo: ${error.message}`)
    },
  })
}

/** Desactiva (soft-delete) un insumo del catálogo. */
export function useDesactivarCatalogoInsumo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => catalogoInsumosService.desactivar(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK_CATALOGO })
      toast.success('Insumo desactivado del catálogo')
    },
    onError: (error: Error) => {
      toast.error(`Error al desactivar insumo: ${error.message}`)
    },
  })
}

/** Reactiva un insumo desactivado del catálogo. */
export function useReactivarCatalogoInsumo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => catalogoInsumosService.reactivar(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK_CATALOGO })
      toast.success('Insumo reactivado en el catálogo')
    },
    onError: (error: Error) => {
      toast.error(`Error al reactivar insumo: ${error.message}`)
    },
  })
}
