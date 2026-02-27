// ============================================================
// EFECTOS EN CASCADA DE LA METODOLOGÍA — M2-07 §4 (M2-INT-03)
// Al guardar Proyecto.metodologia, el sistema calcula los valores
// derivados para los módulos dependientes: M3 (SRS), M2-02
// (estimación), M2-05 (equipo), M2-04 (KPIs), M2-06 (entregas).
// ============================================================

import type { MetodologiaProyecto, MetodoEstimacion } from '@/types'

export type TipoSRS = 'completo' | 'incremental' | 'epica' | 'minimo'
export type PoliticaEntregas =
  | 'unica_final'
  | 'por_fase_tecnica'
  | 'por_fase_rup'
  | 'por_incremento'
  | 'por_sprint'
  | 'por_iteracion_xp'

export interface EfectosCascadaMetodologia {
  // M3 — SRS
  tipoSRS: TipoSRS
  validacionIncremental: boolean
  srsCompletoAntesDesarrollo: boolean

  // M2-02 — Estimación
  metodoEstimacionRecomendado: MetodoEstimacion
  presupuestoTotalObligatorio: boolean

  // M2-05 — Equipo
  tamanoMaximoEquipo: number | null // null = sin límite
  rolesObligatorios: string[]

  // M2-04 — KPIs activos
  kpisActivosPorDefecto: string[]

  // M2-06 — Entregas y Repositorio
  politicaEntregas: PoliticaEntregas
  cicdObligatorio: boolean

  // M2-01 PASO 5 — Estructura de hitos
  estructuraHitos: 'por_fase_tecnica' | 'cuatro_fases_rup' | 'por_incremento' | 'por_sprint' | 'por_iteracion_xp'
  hitoCriticoActivacion: string // Nombre del hito que habilita activo_en_desarrollo
}

/**
 * Calcula todos los efectos en cascada de la metodología.
 * Esta función es la fuente de verdad para los módulos dependientes.
 * M2-07 §4 — Implicaciones de cada metodología en el sistema.
 */
export function calcularEfectosCascada(metodologia: MetodologiaProyecto): EfectosCascadaMetodologia {
  switch (metodologia) {
    case 'cascada':
      return {
        tipoSRS: 'completo',
        validacionIncremental: false,
        srsCompletoAntesDesarrollo: true,
        metodoEstimacionRecomendado: 'cocomo_ii',
        presupuestoTotalObligatorio: true,
        tamanoMaximoEquipo: null,
        rolesObligatorios: ['PM'],
        kpisActivosPorDefecto: ['avance_por_hito', 'CPI'],
        politicaEntregas: 'unica_final',
        cicdObligatorio: false,
        estructuraHitos: 'por_fase_tecnica',
        hitoCriticoActivacion: 'Aprobación SRS v1.0 (fin fase de análisis)',
      }

    case 'incremental':
      return {
        tipoSRS: 'incremental',
        validacionIncremental: true,
        srsCompletoAntesDesarrollo: false, // solo el incremento 1 necesita SRS aprobado
        metodoEstimacionRecomendado: 'puntos_funcion',
        presupuestoTotalObligatorio: true,
        tamanoMaximoEquipo: null,
        rolesObligatorios: ['PM', 'analista'],
        kpisActivosPorDefecto: ['avance_por_hito', 'CPI'],
        politicaEntregas: 'por_incremento',
        cicdObligatorio: false,
        estructuraHitos: 'por_incremento',
        hitoCriticoActivacion: 'SRS del Incremento 1 aprobado',
      }

    case 'rup':
      return {
        tipoSRS: 'completo',
        validacionIncremental: false,
        srsCompletoAntesDesarrollo: true,
        metodoEstimacionRecomendado: 'cocomo_ii',
        presupuestoTotalObligatorio: true,
        tamanoMaximoEquipo: null,
        rolesObligatorios: ['PM', 'arquitecto', 'analista'],
        kpisActivosPorDefecto: ['avance_por_hito', 'CPI'],
        politicaEntregas: 'por_fase_rup',
        cicdObligatorio: false,
        estructuraHitos: 'cuatro_fases_rup',
        hitoCriticoActivacion: 'Hito 2 — Revisión de Arquitectura del Ciclo de Vida (fin Elaboración)',
      }

    case 'agil_scrum':
      return {
        tipoSRS: 'epica',
        validacionIncremental: true,
        srsCompletoAntesDesarrollo: false,
        metodoEstimacionRecomendado: 'planning_poker',
        presupuestoTotalObligatorio: false,
        tamanoMaximoEquipo: 9,
        rolesObligatorios: ['scrum_master', 'product_owner'],
        kpisActivosPorDefecto: ['burndown', 'velocidad_equipo'],
        politicaEntregas: 'por_sprint',
        cicdObligatorio: true,
        estructuraHitos: 'por_sprint',
        hitoCriticoActivacion: 'Épicas del MVP aprobadas (primer sprint habilitado)',
      }

    case 'agil_xp':
      return {
        tipoSRS: 'minimo',
        validacionIncremental: true,
        srsCompletoAntesDesarrollo: false,
        metodoEstimacionRecomendado: 'planning_poker',
        presupuestoTotalObligatorio: false,
        tamanoMaximoEquipo: 6,
        rolesObligatorios: ['desarrollador'],
        kpisActivosPorDefecto: ['burndown', 'velocidad_equipo'],
        politicaEntregas: 'por_iteracion_xp',
        cicdObligatorio: true,
        estructuraHitos: 'por_iteracion_xp',
        hitoCriticoActivacion: 'Historias de usuario del MVP validadas',
      }

    case 'hibrido':
      return {
        tipoSRS: 'completo', // default; el gestor puede ajustar según la combinación
        validacionIncremental: true,
        srsCompletoAntesDesarrollo: false,
        metodoEstimacionRecomendado: 'analogia',
        presupuestoTotalObligatorio: true,
        tamanoMaximoEquipo: null,
        rolesObligatorios: ['PM'],
        kpisActivosPorDefecto: ['avance_por_hito', 'CPI'],
        politicaEntregas: 'por_fase_tecnica',
        cicdObligatorio: false,
        estructuraHitos: 'cuatro_fases_rup',
        hitoCriticoActivacion: 'Depende de la combinación específica descrita en justificación',
      }

    case 'espiral':
    default:
      return {
        tipoSRS: 'completo',
        validacionIncremental: false,
        srsCompletoAntesDesarrollo: true,
        metodoEstimacionRecomendado: 'juicio_experto',
        presupuestoTotalObligatorio: true,
        tamanoMaximoEquipo: null,
        rolesObligatorios: ['PM', 'analista'],
        kpisActivosPorDefecto: ['avance_por_hito'],
        politicaEntregas: 'por_fase_tecnica',
        cicdObligatorio: false,
        estructuraHitos: 'por_fase_tecnica',
        hitoCriticoActivacion: 'Ciclo de análisis de riesgos completado',
      }
  }
}

/**
 * Texto descriptivo de la política de entregas para mostrar en UI.
 */
export function labelPoliticaEntregas(politica: PoliticaEntregas): string {
  const labels: Record<PoliticaEntregas, string> = {
    unica_final: 'Una entrega final al completar el proyecto',
    por_fase_tecnica: 'Por fase técnica (análisis, diseño, implementación, pruebas)',
    por_fase_rup: 'Por fase RUP (Inicio, Elaboración, Construcción, Transición)',
    por_incremento: 'Por incremento funcional',
    por_sprint: 'Por sprint (cada 2-4 semanas)',
    por_iteracion_xp: 'Por iteración XP (cada 1-2 semanas)',
  }
  return labels[politica] ?? politica
}
