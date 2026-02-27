'use client'

// ============================================================
// COMPONENTE: DashboardMetricasProceso — M2-08 (M2-INT-07)
// Dashboard de métricas GQM y KPIs de proceso.
// Calcula automáticamente las métricas desde los datos del proyecto.
// Umbrales verde/amarillo/rojo según M2-08.
// ============================================================

import { useMemo } from 'react'
import {
  BarChart3, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle, Clock, Target, Zap, Users,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib'
import { Badge } from '@/components/ui/badge'
import type { Proyecto, ConfiguracionProyecto, KPICalidadProceso, SemaforoMetrica } from '@/types'

// ──────────────────────────────────────────────────────────
// HELPERS — Semáforo
// ──────────────────────────────────────────────────────────

function calcularSemaforo(valor: number | null, verde: { min?: number; max?: number }, amarillo: { min?: number; max?: number }): SemaforoMetrica {
  if (valor === null) return 'sin_datos'
  const enVerde = (verde.min === undefined || valor >= verde.min) && (verde.max === undefined || valor <= verde.max)
  if (enVerde) return 'verde'
  const enAmarillo = (amarillo.min === undefined || valor >= amarillo.min) && (amarillo.max === undefined || valor <= amarillo.max)
  if (enAmarillo) return 'amarillo'
  return 'rojo'
}

const SEMAFORO_CONFIG: Record<SemaforoMetrica, { color: string; icon: React.ReactNode; label: string }> = {
  verde: {
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200',
    icon: <CheckCircle className="h-4 w-4" />,
    label: 'OK',
  },
  amarillo: {
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200',
    icon: <AlertTriangle className="h-4 w-4" />,
    label: 'Atención',
  },
  rojo: {
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200',
    icon: <AlertTriangle className="h-4 w-4" />,
    label: 'Alerta',
  },
  sin_datos: {
    color: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border-gray-200',
    icon: <Clock className="h-4 w-4" />,
    label: 'Sin datos',
  },
}

// ──────────────────────────────────────────────────────────
// CALCULAR MÉTRICAS desde datos del proyecto
// ──────────────────────────────────────────────────────────

function calcularMetricas(proyecto: Proyecto, configuracion: ConfiguracionProyecto | null): Record<string, KPICalidadProceso> {
  const esAgil = ['agil_scrum', 'agil_xp'].includes(proyecto.metodologia)
  const esCascada = proyecto.metodologia === 'cascada'
  const ahora = new Date()

  // KPI 1: Coherencia de entregas (¿se sigue la política acordada?)
  // En ausencia de datos de sprints reales, se usa el número de hitos completados como proxy
  const hitosCompletados = proyecto.hitos.filter((h) => h.estado === 'completado').length
  const totalHitos = proyecto.hitos.length
  const tasaCompletitud = totalHitos > 0 ? Math.round((hitosCompletados / totalHitos) * 100) : null
  const coherenciaEntregas: KPICalidadProceso = {
    nombre: 'Coherencia de entregas',
    descripcion: 'Porcentaje de hitos completados respecto al total planificado',
    valor: tasaCompletitud,
    umbralVerde: { min: 80 },
    umbralAmarillo: { min: 60, max: 79 },
    semaforo: calcularSemaforo(tasaCompletitud, { min: 80 }, { min: 60, max: 79 }),
    formula: '(hitos_completados / total_hitos) × 100',
    fechaCalculo: ahora,
  }

  // KPI 2: Riesgos activos vs. mitigados
  const riesgosActivos = proyecto.riesgos.filter((r) => r.estado === 'activo').length
  const riesgosMitigados = proyecto.riesgos.filter((r) => r.estado === 'mitigado').length
  const totalRiesgos = proyecto.riesgos.length
  const tasaMitigacionRiesgos = totalRiesgos > 0
    ? Math.round(((riesgosMitigados) / totalRiesgos) * 100)
    : null
  const participacionCliente: KPICalidadProceso = {
    nombre: 'Mitigación de riesgos',
    descripcion: 'Porcentaje de riesgos mitigados sobre el total identificado',
    valor: tasaMitigacionRiesgos,
    umbralVerde: { min: 70 },
    umbralAmarillo: { min: 40, max: 69 },
    semaforo: calcularSemaforo(tasaMitigacionRiesgos, { min: 70 }, { min: 40, max: 69 }),
    formula: '(riesgos_mitigados / total_riesgos) × 100',
    fechaCalculo: ahora,
  }

  // KPI 3: SCRs post-aprobación (solo cascada)
  const scrPostAprobacion = configuracion?.solicitudesCambio.length ?? 0
  const umbralSCRVerde = { max: 2 }
  const umbralSCRAmarillo = { min: 3, max: 5 }
  const cambiosPostAprobacion: KPICalidadProceso = {
    nombre: esCascada ? 'SCRs post-aprobación SRS' : 'Solicitudes de cambio al repositorio',
    descripcion: esCascada
      ? 'Número de cambios al repositorio tras aprobación del SRS (meta: 0 en cascada)'
      : 'Total de solicitudes de cambio al repositorio de configuración',
    valor: configuracion ? scrPostAprobacion : null,
    umbralVerde: umbralSCRVerde,
    umbralAmarillo: umbralSCRAmarillo,
    semaforo: calcularSemaforo(
      configuracion ? scrPostAprobacion : null,
      umbralSCRVerde,
      umbralSCRAmarillo
    ),
    formula: 'count(SCR en repositorio de configuración)',
    fechaCalculo: ahora,
  }

  // KPI 4: Velocidad del equipo (solo ágil — proxy por hitos completados a tiempo)
  const hitosATiempo = proyecto.hitos.filter((h) => {
    if (h.estado !== 'completado' || !h.fechaReal || !h.fechaEstimada) return false
    return new Date(h.fechaReal) <= new Date(h.fechaEstimada)
  }).length
  const velocidadEquipo: KPICalidadProceso = {
    nombre: esAgil ? 'Velocidad del equipo (sprints)' : 'Hitos completados a tiempo',
    descripcion: esAgil
      ? 'Porcentaje de hitos de sprint completados dentro del plazo estimado'
      : 'Porcentaje de hitos completados en la fecha estimada o antes',
    valor: hitosCompletados > 0 ? Math.round((hitosATiempo / hitosCompletados) * 100) : null,
    umbralVerde: { min: 80 },
    umbralAmarillo: { min: 60, max: 79 },
    semaforo: calcularSemaforo(
      hitosCompletados > 0 ? Math.round((hitosATiempo / hitosCompletados) * 100) : null,
      { min: 80 },
      { min: 60, max: 79 }
    ),
    formula: '(hitos_completados_a_tiempo / total_hitos_completados) × 100',
    fechaCalculo: ahora,
  }

  // KPI 5: Completitud del acuerdo de metodología
  const camposAcuerdo = [
    proyecto.metodologia,
    proyecto.clienteConsentioMetodologia !== undefined,
    proyecto.inputsMetodologiaSnapshot,
    proyecto.tamanoEquipo,
    proyecto.estabilidadRequerimientos,
    proyecto.clienteDisponibleParaIteraciones !== undefined,
    proyecto.tieneContratoFijo !== undefined,
  ]
  const completados = camposAcuerdo.filter(Boolean).length
  const totalCampos = camposAcuerdo.length
  const completitudAcuerdo: KPICalidadProceso = {
    nombre: 'Completitud acuerdo de metodología',
    descripcion: 'Porcentaje de campos del acuerdo de metodología (M2-07) completados',
    valor: Math.round((completados / totalCampos) * 100),
    umbralVerde: { min: 100 },
    umbralAmarillo: { min: 71, max: 99 },
    semaforo: calcularSemaforo(
      Math.round((completados / totalCampos) * 100),
      { min: 100 },
      { min: 71, max: 99 }
    ),
    formula: '(campos_completados / total_campos_obligatorios) × 100',
    fechaCalculo: ahora,
  }

  // KPI 6: Tasa de éxito de estimaciones (estimado vs. real en hitos)
  const hitosConFechaReal = proyecto.hitos.filter((h) => h.fechaReal && h.fechaEstimada)
  const cumplieronEstimacion = hitosConFechaReal.filter((h) => {
    const real = new Date(h.fechaReal!)
    const est = new Date(h.fechaEstimada)
    const margen = (est.getTime() - new Date(proyecto.fechaInicio ?? new Date()).getTime()) * 0.1
    return real.getTime() <= est.getTime() + margen
  }).length
  const tasaExitoEstimaciones: KPICalidadProceso = {
    nombre: 'Tasa de éxito de estimaciones',
    descripcion: 'Porcentaje de hitos completados dentro del ±10% del plazo estimado',
    valor: hitosConFechaReal.length > 0
      ? Math.round((cumplieronEstimacion / hitosConFechaReal.length) * 100)
      : null,
    umbralVerde: { min: 80 },
    umbralAmarillo: { min: 60, max: 79 },
    semaforo: calcularSemaforo(
      hitosConFechaReal.length > 0
        ? Math.round((cumplieronEstimacion / hitosConFechaReal.length) * 100)
        : null,
      { min: 80 },
      { min: 60, max: 79 }
    ),
    formula: '(hitos_dentro_del_plazo_±10% / hitos_con_fecha_real) × 100',
    fechaCalculo: ahora,
  }

  // KPI 7: Tiempo promedio en cada estado del proyecto (proxy: versión simplificada)
  const tiempoPromedioEstado: KPICalidadProceso = {
    nombre: 'Densidad de riesgos críticos',
    descripcion: 'Porcentaje de riesgos con probabilidad alta×impacto alto sobre el total',
    valor: totalRiesgos > 0
      ? Math.round((proyecto.riesgos.filter(
          (r) => ['alta', 'muy_alta'].includes(r.probabilidad) && ['alto', 'muy_alto'].includes(r.impacto)
        ).length / totalRiesgos) * 100)
      : null,
    umbralVerde: { max: 20 },
    umbralAmarillo: { min: 21, max: 40 },
    semaforo: calcularSemaforo(
      totalRiesgos > 0
        ? Math.round((proyecto.riesgos.filter(
            (r) => ['alta', 'muy_alta'].includes(r.probabilidad) && ['alto', 'muy_alto'].includes(r.impacto)
          ).length / totalRiesgos) * 100)
        : null,
      { max: 20 },
      { min: 21, max: 40 }
    ),
    formula: '(riesgos_alta_prob_×_alto_impacto / total_riesgos) × 100',
    fechaCalculo: ahora,
  }

  // KPI 8: Velocidad resolución SCR
  const scrResueltas = configuracion?.solicitudesCambio.filter(
    (s) => ['implementada', 'rechazada'].includes(s.estado)
  ).length ?? 0
  const scrTotales = configuracion?.solicitudesCambio.length ?? 0
  const tasaResolucionSCR = scrTotales > 0
    ? Math.round((scrResueltas / scrTotales) * 100)
    : null
  const velocidadResolucionSCR: KPICalidadProceso = {
    nombre: 'Velocidad resolución SCR',
    descripcion: 'Porcentaje de solicitudes de cambio resueltas (implementadas o rechazadas)',
    valor: tasaResolucionSCR,
    umbralVerde: { min: 75 },
    umbralAmarillo: { min: 50, max: 74 },
    semaforo: calcularSemaforo(tasaResolucionSCR, { min: 75 }, { min: 50, max: 74 }),
    formula: '(SCR_resueltas / SCR_totales) × 100',
    fechaCalculo: ahora,
  }

  return {
    coherenciaEntregas,
    participacionCliente,
    cambiosPostAprobacion,
    velocidadEquipo,
    completitudAcuerdo,
    tasaExitoEstimaciones,
    tiempoPromedioEstado,
    velocidadResolucionSCR,
  }
}

// ──────────────────────────────────────────────────────────
// COMPONENTE TARJETA KPI
// ──────────────────────────────────────────────────────────

function KPICard({ kpi }: { kpi: KPICalidadProceso }) {
  const cfg = SEMAFORO_CONFIG[kpi.semaforo]

  return (
    <div className={`p-4 rounded-lg border-2 ${cfg.color}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {cfg.icon}
          <span className="text-xs font-semibold uppercase tracking-wide">{cfg.label}</span>
        </div>
        {kpi.valor !== null && (
          <span className="text-2xl font-bold">
            {kpi.valor}<span className="text-sm font-normal">%</span>
          </span>
        )}
        {kpi.valor === null && (
          <span className="text-sm text-current opacity-60">—</span>
        )}
      </div>
      <p className="text-sm font-semibold">{kpi.nombre}</p>
      <p className="text-xs mt-0.5 opacity-70 line-clamp-2">{kpi.descripcion}</p>
      <details className="mt-2">
        <summary className="text-xs cursor-pointer opacity-70">Fórmula</summary>
        <p className="text-xs mt-0.5 font-mono opacity-70">{kpi.formula}</p>
      </details>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ──────────────────────────────────────────────────────────

interface DashboardMetricasProcesoProps {
  proyecto: Proyecto
  configuracion: ConfiguracionProyecto | null
}

export function DashboardMetricasProceso({
  proyecto,
  configuracion,
}: DashboardMetricasProcesoProps) {
  const metricas = useMemo(
    () => calcularMetricas(proyecto, configuracion),
    [proyecto, configuracion]
  )

  const totalKPIs = Object.values(metricas).length
  const verdes = Object.values(metricas).filter((k) => k.semaforo === 'verde').length
  const amarillos = Object.values(metricas).filter((k) => k.semaforo === 'amarillo').length
  const rojos = Object.values(metricas).filter((k) => k.semaforo === 'rojo').length
  const sinDatos = Object.values(metricas).filter((k) => k.semaforo === 'sin_datos').length

  const saludGeneral: SemaforoMetrica =
    rojos > 0 ? 'rojo' :
    amarillos > 1 ? 'amarillo' :
    verdes >= totalKPIs - sinDatos ? 'verde' :
    'sin_datos'

  const metodologiaConfig = {
    agil_scrum: { label: 'Ágil/Scrum', color: 'bg-green-100 text-green-700' },
    agil_xp: { label: 'Ágil/XP', color: 'bg-green-100 text-green-700' },
    cascada: { label: 'Cascada', color: 'bg-blue-100 text-blue-700' },
    incremental: { label: 'Incremental', color: 'bg-blue-100 text-blue-700' },
    rup: { label: 'RUP', color: 'bg-purple-100 text-purple-700' },
    hibrido: { label: 'Híbrido', color: 'bg-orange-100 text-orange-700' },
    espiral: { label: 'Espiral', color: 'bg-gray-100 text-gray-700' },
  }
  const metCfg = metodologiaConfig[proyecto.metodologia as keyof typeof metodologiaConfig]

  return (
    <div className="space-y-5">
      {/* Resumen de salud del proceso */}
      <div className={`p-4 rounded-lg border-2 ${SEMAFORO_CONFIG[saludGeneral].color}`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {SEMAFORO_CONFIG[saludGeneral].icon}
            <div>
              <h3 className="font-bold text-base">Salud del Proceso — GQM (M2-08)</h3>
              <p className="text-xs opacity-70">
                {verdes} OK · {amarillos} atención · {rojos} alerta · {sinDatos} sin datos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${metCfg?.color ?? ''}`}>
              {metCfg?.label ?? proyecto.metodologia}
            </span>
            <Badge variant="outline" className="text-xs">
              {proyecto.estado}
            </Badge>
          </div>
        </div>
      </div>

      {/* Indicadores de contexto */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="text-center p-3 bg-muted/40 rounded-lg border">
          <p className="text-2xl font-bold">{proyecto.hitos.length}</p>
          <p className="text-xs text-muted-foreground">Hitos totales</p>
        </div>
        <div className="text-center p-3 bg-muted/40 rounded-lg border">
          <p className="text-2xl font-bold text-green-600">
            {proyecto.hitos.filter((h) => h.estado === 'completado').length}
          </p>
          <p className="text-xs text-muted-foreground">Hitos completados</p>
        </div>
        <div className="text-center p-3 bg-muted/40 rounded-lg border">
          <p className="text-2xl font-bold text-orange-600">
            {proyecto.riesgos.filter((r) => r.estado === 'activo').length}
          </p>
          <p className="text-xs text-muted-foreground">Riesgos activos</p>
        </div>
        <div className="text-center p-3 bg-muted/40 rounded-lg border">
          <p className="text-2xl font-bold text-blue-600">
            {configuracion?.solicitudesCambio.length ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">SCRs repositorio</p>
        </div>
      </div>

      {/* Grid de KPIs */}
      <div>
        <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          KPIs de Proceso — Umbrales según M2-08
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          <KPICard kpi={metricas.coherenciaEntregas} />
          <KPICard kpi={metricas.participacionCliente} />
          <KPICard kpi={metricas.velocidadEquipo} />
          <KPICard kpi={metricas.completitudAcuerdo} />
          <KPICard kpi={metricas.tasaExitoEstimaciones} />
          <KPICard kpi={metricas.cambiosPostAprobacion} />
          <KPICard kpi={metricas.tiempoPromedioEstado} />
          <KPICard kpi={metricas.velocidadResolucionSCR} />
        </div>
      </div>

      {/* Nota de M2-08 */}
      <div className="p-3 bg-muted/30 rounded-lg border text-xs text-muted-foreground">
        <strong>Fuente:</strong> Métricas calculadas automáticamente desde datos del proyecto (hitos, riesgos, SCRs).
        Las métricas se actualizan en tiempo real con cada evento del ciclo de vida.
        Referencia: M2-08 (Mejora de Procesos CMMI — Sommerville Cap. 26).
      </div>
    </div>
  )
}
