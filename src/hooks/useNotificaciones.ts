// ============================================================
// HOOK: useNotificaciones — Sprint 5
// Calcula alertas del sistema a partir de datos cacheados.
// Sin llamadas extra a Firestore — usa datos de useProyectos + useEntidades.
// ============================================================

import { useMemo } from 'react'
import { differenceInDays } from 'date-fns'
import { useEntidades } from '@/hooks/useEntidades'
import { useProyectos } from '@/hooks/useProyectos'

// -------------------------------------------------------
// TIPOS
// -------------------------------------------------------

export type TipoNotificacion =
  | 'hito_vencimiento'
  | 'riesgo_materializado'
  | 'desviacion_proyecto'
  | 'nda_vencimiento'

export interface Notificacion {
  id: string
  tipo: TipoNotificacion
  titulo: string
  descripcion: string
  href: string
  prioridad: 'alta' | 'media'
}

// -------------------------------------------------------
// HOOK
// -------------------------------------------------------

export function useNotificaciones() {
  const { data: proyectosTodos, isLoading: loadingProyectos } = useProyectos()
  const { data: entidades, isLoading: loadingEntidades } = useEntidades()

  const notificaciones = useMemo((): Notificacion[] => {
    const alerts: Notificacion[] = []
    const ahora = new Date()

    // Solo proyectos activos
    const proyectosActivos = (proyectosTodos ?? []).filter((p) =>
      ['activo_en_definicion', 'activo_en_desarrollo'].includes(p.estado)
    )

    for (const proyecto of proyectosActivos) {
      // 1. Hitos próximos a vencer (< 7 días, sin completar ni incumplir)
      const hitosProximos = (proyecto.hitos ?? []).filter((h) => {
        if (h.estado === 'completado' || h.estado === 'incumplido') return false
        if (!h.fechaEstimada) return false
        const dias = differenceInDays(new Date(h.fechaEstimada), ahora)
        return dias >= 0 && dias < 7
      })
      if (hitosProximos.length > 0) {
        alerts.push({
          id: `hito-${proyecto.id}`,
          tipo: 'hito_vencimiento',
          titulo: `Hitos próximos — ${proyecto.nombre}`,
          descripcion: `${hitosProximos.length} hito${hitosProximos.length > 1 ? 's' : ''} vence${hitosProximos.length > 1 ? 'n' : ''} en menos de 7 días`,
          href: `/proyectos/${proyecto.id}`,
          prioridad: 'alta',
        })
      }

      // 2. Riesgos materializados sin cerrar
      const riesgosMat = (proyecto.riesgos ?? []).filter((r) => r.estado === 'materializado')
      if (riesgosMat.length > 0) {
        alerts.push({
          id: `riesgo-mat-${proyecto.id}`,
          tipo: 'riesgo_materializado',
          titulo: `Riesgos materializados — ${proyecto.nombre}`,
          descripcion: `${riesgosMat.length} riesgo${riesgosMat.length > 1 ? 's' : ''} materializado${riesgosMat.length > 1 ? 's' : ''} requiere${riesgosMat.length === 1 ? '' : 'n'} atención`,
          href: `/proyectos/${proyecto.id}`,
          prioridad: 'alta',
        })
      }

      // 3. Desviación de cronograma > umbral amarillo (5 días)
      if (proyecto.fechaFinEstimada) {
        const desvDias = differenceInDays(ahora, new Date(proyecto.fechaFinEstimada))
        if (desvDias > 5) {
          alerts.push({
            id: `desv-${proyecto.id}`,
            tipo: 'desviacion_proyecto',
            titulo: `Desviación de cronograma — ${proyecto.nombre}`,
            descripcion: `${desvDias} día${desvDias > 1 ? 's' : ''} sobre la fecha estimada`,
            href: `/proyectos/${proyecto.id}`,
            prioridad: desvDias > 15 ? 'alta' : 'media',
          })
        }
      }
    }

    // 4. Entidades con NDA próximo a vencer (< 30 días)
    for (const entidad of entidades ?? []) {
      if (entidad.tieneNDA && entidad.fechaNDA) {
        const diasRestantes = differenceInDays(new Date(entidad.fechaNDA), ahora)
        if (diasRestantes >= 0 && diasRestantes < 30) {
          alerts.push({
            id: `nda-${entidad.id}`,
            tipo: 'nda_vencimiento',
            titulo: `NDA próximo a vencer — ${entidad.razonSocial}`,
            descripcion: `El acuerdo de confidencialidad vence en ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''}`,
            href: `/entidades/${entidad.id}`,
            prioridad: diasRestantes < 7 ? 'alta' : 'media',
          })
        }
      }
    }

    // Ordenar: prioridad alta primero
    return alerts.sort((a, b) => (a.prioridad === 'alta' && b.prioridad !== 'alta' ? -1 : 1))
  }, [proyectosTodos, entidades])

  return {
    notificaciones,
    total: notificaciones.length,
    isLoading: loadingProyectos || loadingEntidades,
  }
}
