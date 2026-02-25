// ============================================================
// HOOK: useAlcance — Módulo 3
// Estado: STUB — pendiente de implementación
// Descripción: Hook para gestionar el estado y operaciones
//              de SRS y requerimientos (alcance del proyecto)
// ============================================================

// TODO: Implementar con TanStack Query y alcanceService
// Ejemplo de implementación futura:
//
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { alcanceService } from '@/services'
// import { useAlcanceStore } from '@/store'
//
// export function useAlcance(proyectoId: string) {
//   const { data: srs, isLoading, error } = useQuery({
//     queryKey: ['alcance', proyectoId],
//     queryFn: () => alcanceService.getSRSByProyecto(proyectoId),
//     enabled: !!proyectoId,
//   })
//   return { srs, isLoading, error }
// }

export {};
