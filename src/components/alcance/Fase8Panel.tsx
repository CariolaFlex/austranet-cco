'use client'

// ============================================================
// COMPONENTE: Fase8Panel — Transición al Desarrollo
// Fuentes: M3-F8-01 (despliegue), M3-F8-02 (capacitación), M3-F8-03 (SLA)
// Tareas: F8-01 | F8-02 | F8-03 | F8-04 (resumen final)
// ============================================================

import { useState, useMemo } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Rocket, GraduationCap, ShieldAlert, BarChart2, Plus, Trash2,
  Save, CheckCircle2, AlertTriangle, ArrowRight, Globe, Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib'
import { Input, Textarea, FormField, Select } from '@/components/ui/input'
import {
  useActualizarSRS,
  useRequerimientos, useCasosPrueba,
} from '@/hooks/useAlcance'
import { ESTRATEGIAS_DESPLIEGUE_CONFIG } from '@/constants/alcance'
import type { Proyecto, SRS, PlanDespliegue, PlanCapacitacion, PlanSLA, SistemaAMigrar } from '@/types'

// ──────────────────────────────────────────────────────────
// SCHEMAS
// ──────────────────────────────────────────────────────────

const sistemaAMigrarSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  datosAMigrar: z.string().min(5, 'Describe los datos a migrar'),
  formatoOrigen: z.string().min(1, 'Formato origen requerido'),
  formatoDestino: z.string().min(1, 'Formato destino requerido'),
  responsableTecnico: z.string().min(2, 'Responsable técnico requerido'),
})

const f801Schema = z.object({
  estrategia: z.enum(['big_bang', 'incremental', 'paralelo', 'piloto']),
  esquemaMigracion: z.string().min(5, 'Describe el esquema de migración'),
  fechaTargetDespliegue: z.string().optional(),
  responsable: z.string().optional(),
  sistemasAMigrar: z.array(sistemaAMigrarSchema),
})
type F801Form = z.infer<typeof f801Schema>

const grupoCapacitacionSchema = z.object({
  nombre: z.string().min(2, 'Nombre del grupo requerido'),
  numeroPersonas: z.coerce.number().min(1, 'Al menos 1 persona'),
  nivelTecnicoActual: z.enum(['basico', 'intermedio', 'avanzado']),
  duracionEstimadaHoras: z.coerce.number().min(1, 'Horas requeridas'),
  stakeholderIds: z.string(), // comma-separated IDs
})

const f802Schema = z.object({
  modalidad: z.enum(['presencial', 'virtual', 'hibrido', 'autoservicio']),
  responsableCapacitacion: z.string().optional(),
  materialesRequeridos: z.string().min(1, 'Lista al menos un material'),
  grupos: z.array(grupoCapacitacionSchema),
})
type F802Form = z.infer<typeof f802Schema>

const tiempoRespuestaSchema = z.object({
  severidad: z.enum(['critico', 'alto', 'medio', 'bajo']),
  tiempoRespuesta: z.string().min(1),
  tiempoResolucion: z.string().min(1),
})

const f803Schema = z.object({
  periodoGarantia: z.coerce.number().min(30, 'Mínimo 30 días de garantía'),
  slaDisponibilidad: z.coerce.number().min(90).max(100, 'Entre 90 y 100%'),
  responsablePostEntrega: z.enum(['proveedor', 'cliente', 'mixto']),
  mecanismoReporte: z.string().min(5, 'Describe el mecanismo de reporte'),
  criterioFinGarantia: z.string().min(5, 'Define el criterio de cierre'),
  tiemposRespuesta: z.array(tiempoRespuestaSchema),
})
type F803Form = z.infer<typeof f803Schema>

// ──────────────────────────────────────────────────────────
// HELPER: convertir fecha string ↔ Date
// ──────────────────────────────────────────────────────────

function dateToInput(d: Date | undefined): string {
  if (!d) return ''
  const dt = d instanceof Date ? d : new Date(d)
  return dt.toISOString().slice(0, 10)
}

// ──────────────────────────────────────────────────────────
// SUB-COMPONENTE: F8-01 Plan de despliegue
// ──────────────────────────────────────────────────────────

function F801Despliegue({ srs }: { srs: SRS }) {
  const actualizar = useActualizarSRS()
  const plan = srs.planDespliegue

  const defaultValues: F801Form = {
    estrategia: plan?.estrategia ?? 'incremental',
    esquemaMigracion: plan?.esquemaMigracion ?? '',
    fechaTargetDespliegue: dateToInput(plan?.fechaTargetDespliegue),
    responsable: plan?.responsable ?? '',
    sistemasAMigrar: plan?.sistemasAMigrar ?? [],
  }

  const { register, control, handleSubmit, watch, formState: { errors, isDirty } } = useForm<F801Form>({
    resolver: zodResolver(f801Schema),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sistemasAMigrar',
  })

  const estrategiaSeleccionada = watch('estrategia')

  const onSubmit = (data: F801Form) => {
    const planData: PlanDespliegue = {
      estrategia: data.estrategia,
      esquemaMigracion: data.esquemaMigracion,
      fechaTargetDespliegue: data.fechaTargetDespliegue ? new Date(data.fechaTargetDespliegue) : undefined,
      responsable: data.responsable,
      sistemasAMigrar: data.sistemasAMigrar.map(s => ({
        nombre: s.nombre,
        datosAMigrar: s.datosAMigrar,
        formatoOrigen: s.formatoOrigen,
        formatoDestino: s.formatoDestino,
        responsableTecnico: s.responsableTecnico,
      })),
    }
    actualizar.mutate({ id: srs.id, data: { planDespliegue: planData } })
  }

  const cfgEstrategia = ESTRATEGIAS_DESPLIEGUE_CONFIG[estrategiaSeleccionada]

  const RIESGO_COLOR: Record<string, string> = {
    bajo: 'text-green-700 dark:text-green-400',
    medio: 'text-amber-700 dark:text-amber-400',
    alto: 'text-red-700 dark:text-red-400',
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Estrategia */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Rocket className="h-4 w-4 text-primary" />
            Estrategia de despliegue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Estrategia" error={errors.estrategia?.message}>
              <Select {...register('estrategia')}>
                {Object.entries(ESTRATEGIAS_DESPLIEGUE_CONFIG).map(([val, cfg]) => (
                  <option key={val} value={val}>{cfg.label}</option>
                ))}
              </Select>
            </FormField>
            <FormField label="Fecha target de despliegue">
              <Input type="date" {...register('fechaTargetDespliegue')} />
            </FormField>
          </div>

          {cfgEstrategia && (
            <div className="rounded-md border bg-muted/20 p-3">
              <div className="flex items-center gap-2">
                <p className="text-sm">{cfgEstrategia.descripcion}</p>
                <Badge variant="outline" className={`text-xs ml-auto ${RIESGO_COLOR[cfgEstrategia.riesgo]}`}>
                  Riesgo: {cfgEstrategia.riesgo}
                </Badge>
              </div>
            </div>
          )}

          <FormField label="Esquema de migración" error={errors.esquemaMigracion?.message}>
            <Textarea
              placeholder="Describe cómo se ejecutará la migración de datos y el proceso de transición al nuevo sistema"
              {...register('esquemaMigracion')}
            />
          </FormField>

          <FormField label="Responsable del despliegue">
            <Input placeholder="Nombre o rol del responsable" {...register('responsable')} />
          </FormField>
        </CardContent>
      </Card>

      {/* Sistemas a migrar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Sistemas a migrar</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({
                nombre: '', datosAMigrar: '', formatoOrigen: '', formatoDestino: '',
                responsableTecnico: '',
              })}
            >
              <Plus className="h-3 w-3 mr-1" />
              Agregar sistema
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-3">
              No hay sistemas a migrar. Si el proyecto reemplaza un sistema existente, regístralo aquí.
            </p>
          ) : (
            fields.map((field, i) => (
              <div key={field.id} className="rounded-md border p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Sistema #{i + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(i)}
                    className="h-6 w-6 p-0 text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Nombre del sistema" error={errors.sistemasAMigrar?.[i]?.nombre?.message}>
                    <Input placeholder="ej: Sistema legacy de facturación" {...register(`sistemasAMigrar.${i}.nombre`)} />
                  </FormField>
                  <FormField label="Responsable técnico" error={errors.sistemasAMigrar?.[i]?.responsableTecnico?.message}>
                    <Input placeholder="Nombre o rol" {...register(`sistemasAMigrar.${i}.responsableTecnico`)} />
                  </FormField>
                  <FormField label="Formato origen" error={errors.sistemasAMigrar?.[i]?.formatoOrigen?.message}>
                    <Input placeholder="ej: Oracle DB, CSV, Excel" {...register(`sistemasAMigrar.${i}.formatoOrigen`)} />
                  </FormField>
                  <FormField label="Formato destino" error={errors.sistemasAMigrar?.[i]?.formatoDestino?.message}>
                    <Input placeholder="ej: PostgreSQL, JSON API" {...register(`sistemasAMigrar.${i}.formatoDestino`)} />
                  </FormField>
                </div>
                <FormField label="Datos a migrar" error={errors.sistemasAMigrar?.[i]?.datosAMigrar?.message}>
                  <Textarea placeholder="ej: Historial de facturas (5 años), catálogo de productos, usuarios activos" {...register(`sistemasAMigrar.${i}.datosAMigrar`)} />
                </FormField>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={actualizar.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {actualizar.isPending ? 'Guardando…' : 'Guardar plan de despliegue'}
        </Button>
      </div>
    </form>
  )
}

// ──────────────────────────────────────────────────────────
// SUB-COMPONENTE: F8-02 Plan de capacitación
// ──────────────────────────────────────────────────────────

function F802Capacitacion({ srs }: { srs: SRS }) {
  const actualizar = useActualizarSRS()
  const plan = srs.planCapacitacion

  const defaultValues: F802Form = {
    modalidad: plan?.modalidad ?? 'presencial',
    responsableCapacitacion: plan?.responsableCapacitacion ?? '',
    materialesRequeridos: plan?.materialesRequeridos?.join(', ') ?? '',
    grupos: plan?.grupos?.map(g => ({
      nombre: g.nombre,
      numeroPersonas: g.numeroPersonas,
      nivelTecnicoActual: g.nivelTecnicoActual,
      duracionEstimadaHoras: g.duracionEstimadaHoras,
      stakeholderIds: g.stakeholderIds.join(', '),
    })) ?? [],
  }

  const { register, control, handleSubmit, formState: { errors } } = useForm<F802Form>({
    resolver: zodResolver(f802Schema),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'grupos' })

  const onSubmit = (data: F802Form) => {
    const planData: PlanCapacitacion = {
      modalidad: data.modalidad,
      responsableCapacitacion: data.responsableCapacitacion,
      materialesRequeridos: data.materialesRequeridos.split(',').map(s => s.trim()).filter(Boolean),
      grupos: data.grupos.map(g => ({
        nombre: g.nombre,
        numeroPersonas: g.numeroPersonas,
        nivelTecnicoActual: g.nivelTecnicoActual,
        duracionEstimadaHoras: g.duracionEstimadaHoras,
        stakeholderIds: g.stakeholderIds.split(',').map(s => s.trim()).filter(Boolean),
      })),
    }
    actualizar.mutate({ id: srs.id, data: { planCapacitacion: planData } })
  }

  const NIVEL_LABELS: Record<string, string> = {
    basico: 'Básico', intermedio: 'Intermedio', avanzado: 'Avanzado',
  }
  const MODALIDAD_LABELS: Record<string, string> = {
    presencial: 'Presencial', virtual: 'Virtual (videoconferencia)',
    hibrido: 'Híbrido', autoservicio: 'Autoservicio (e-learning)',
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Config general */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            Configuración general del plan de capacitación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Modalidad de capacitación" error={errors.modalidad?.message}>
              <Select {...register('modalidad')}>
                {Object.entries(MODALIDAD_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </Select>
            </FormField>
            <FormField label="Responsable de capacitación">
              <Input placeholder="Nombre o rol del facilitador" {...register('responsableCapacitacion')} />
            </FormField>
          </div>
          <FormField label="Materiales requeridos (separados por coma)" error={errors.materialesRequeridos?.message}>
            <Input
              placeholder="ej: Manual de usuario, Videos tutoriales, Guía rápida de referencia"
              {...register('materialesRequeridos')}
            />
          </FormField>
        </CardContent>
      </Card>

      {/* Grupos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Grupos de capacitación</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({
                nombre: '', numeroPersonas: 1, nivelTecnicoActual: 'basico',
                duracionEstimadaHoras: 4, stakeholderIds: '',
              })}
            >
              <Plus className="h-3 w-3 mr-1" />
              Agregar grupo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-3">
              Define grupos de usuarios a capacitar según su rol y nivel técnico.
            </p>
          ) : (
            fields.map((field, i) => (
              <div key={field.id} className="rounded-md border p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Grupo #{i + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive"
                    onClick={() => remove(i)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Nombre del grupo" error={errors.grupos?.[i]?.nombre?.message}>
                    <Input placeholder="ej: Administradores del sistema" {...register(`grupos.${i}.nombre`)} />
                  </FormField>
                  <FormField label="Número de personas" error={errors.grupos?.[i]?.numeroPersonas?.message}>
                    <Input type="number" min={1} {...register(`grupos.${i}.numeroPersonas`)} />
                  </FormField>
                  <FormField label="Nivel técnico actual">
                    <Select {...register(`grupos.${i}.nivelTecnicoActual`)}>
                      {Object.entries(NIVEL_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </Select>
                  </FormField>
                  <FormField label="Horas estimadas de capacitación" error={errors.grupos?.[i]?.duracionEstimadaHoras?.message}>
                    <Input type="number" min={1} {...register(`grupos.${i}.duracionEstimadaHoras`)} />
                  </FormField>
                </div>
                <FormField label="IDs stakeholders del grupo (separados por coma)">
                  <Input placeholder="ej: STK-001, STK-003" {...register(`grupos.${i}.stakeholderIds`)} />
                </FormField>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={actualizar.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {actualizar.isPending ? 'Guardando…' : 'Guardar plan de capacitación'}
        </Button>
      </div>
    </form>
  )
}

// ──────────────────────────────────────────────────────────
// SUB-COMPONENTE: F8-03 Plan SLA
// ──────────────────────────────────────────────────────────

function F803SLA({ srs }: { srs: SRS }) {
  const actualizar = useActualizarSRS()
  const { data: reqs = [] } = useRequerimientos(srs.id)
  const plan = srs.planSLA

  const rnfDisponibilidad = reqs.find(
    r => r.tipo === 'no_funcional' && r.categoria === 'disponibilidad'
  )

  const defaultTiempos = [
    { severidad: 'critico' as const, tiempoRespuesta: '2h', tiempoResolucion: '8h' },
    { severidad: 'alto' as const, tiempoRespuesta: '4h', tiempoResolucion: '24h' },
    { severidad: 'medio' as const, tiempoRespuesta: '8h', tiempoResolucion: '72h' },
    { severidad: 'bajo' as const, tiempoRespuesta: '24h', tiempoResolucion: '5 días' },
  ]

  const defaultValues: F803Form = {
    periodoGarantia: plan?.periodoGarantia ?? 90,
    slaDisponibilidad: plan?.slaDisponibilidad ?? 99,
    responsablePostEntrega: plan?.responsablePostEntrega ?? 'proveedor',
    mecanismoReporte: plan?.mecanismoReporte ?? '',
    criterioFinGarantia: plan?.criterioFinGarantia ?? '',
    tiemposRespuesta: plan?.tiemposRespuesta?.length
      ? plan.tiemposRespuesta
      : defaultTiempos,
  }

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<F803Form>({
    resolver: zodResolver(f803Schema),
    defaultValues,
  })

  const { fields } = useFieldArray({ control, name: 'tiemposRespuesta' })
  const slaWatch = watch('slaDisponibilidad')

  // Coherencia con RNF disponibilidad (Checklist V5)
  const incoherenciaRNF = useMemo(() => {
    if (!rnfDisponibilidad?.metricas?.metricaObjetivo) return null
    const metrica = rnfDisponibilidad.metricas.metricaObjetivo
    const match = metrica.match(/(\d+\.?\d*)%/)
    if (!match) return null
    const valorRNF = parseFloat(match[1])
    if (Math.abs(valorRNF - slaWatch) > 0.1) {
      return `El RNF de disponibilidad indica ${valorRNF}% pero el SLA indica ${slaWatch}%`
    }
    return null
  }, [rnfDisponibilidad, slaWatch])

  const onSubmit = (data: F803Form) => {
    const planData: PlanSLA = {
      periodoGarantia: data.periodoGarantia,
      slaDisponibilidad: data.slaDisponibilidad,
      responsablePostEntrega: data.responsablePostEntrega,
      mecanismoReporte: data.mecanismoReporte,
      criterioFinGarantia: data.criterioFinGarantia,
      tiemposRespuesta: data.tiemposRespuesta,
    }
    actualizar.mutate({ id: srs.id, data: { planSLA: planData } })
  }

  const SEVERIDAD_COLORS: Record<string, string> = {
    critico: 'text-red-700 dark:text-red-400',
    alto: 'text-orange-700 dark:text-orange-400',
    medio: 'text-amber-700 dark:text-amber-400',
    bajo: 'text-blue-700 dark:text-blue-400',
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Config principal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-primary" />
            Configuración del SLA y soporte post-entrega
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Período de garantía (días)" error={errors.periodoGarantia?.message}>
              <Input type="number" min={30} {...register('periodoGarantia')} />
            </FormField>
            <FormField label="SLA disponibilidad (%)" error={errors.slaDisponibilidad?.message}>
              <Input
                type="number"
                step="0.1"
                min={90}
                max={100}
                {...register('slaDisponibilidad')}
                className={incoherenciaRNF ? 'border-amber-400' : ''}
              />
            </FormField>
            <FormField label="Responsable post-entrega">
              <Select {...register('responsablePostEntrega')}>
                <option value="proveedor">Proveedor</option>
                <option value="cliente">Cliente</option>
                <option value="mixto">Mixto (ambos)</option>
              </Select>
            </FormField>
          </div>

          {/* Alerta coherencia V5 */}
          {rnfDisponibilidad && (
            <div className={`rounded-md border p-3 ${
              incoherenciaRNF
                ? 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30'
                : 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30'
            }`}>
              <div className="flex items-start gap-2 text-sm">
                {incoherenciaRNF ? (
                  <>
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800 dark:text-amber-400">Inconsistencia detectada — Checklist V5</p>
                      <p className="mt-0.5 text-amber-700 dark:text-amber-500">{incoherenciaRNF}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-green-800 dark:text-green-400">
                      SLA coherente con RNF disponibilidad {rnfDisponibilidad.codigo} — Checklist V5 ✓
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          <FormField label="Mecanismo de reporte de incidentes" error={errors.mecanismoReporte?.message}>
            <Textarea
              placeholder="ej: Ticket en sistema de soporte + email a soporte@empresa.com + llamada telefónica para incidentes críticos"
              {...register('mecanismoReporte')}
            />
          </FormField>

          <FormField label="Criterio de fin de garantía" error={errors.criterioFinGarantia?.message}>
            <Textarea
              placeholder="ej: Cierre formal cuando el cliente firme el acta de aceptación final del sistema en producción sin incidentes abiertos de severidad alta o crítica"
              {...register('criterioFinGarantia')}
            />
          </FormField>
        </CardContent>
      </Card>

      {/* Tiempos de respuesta por severidad */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tiempos de respuesta por severidad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3 text-xs font-medium text-muted-foreground border-b pb-2">
              <span>Severidad</span>
              <span>Tiempo de respuesta (inicio)</span>
              <span>Tiempo de resolución</span>
            </div>
            {fields.map((field, i) => (
              <div key={field.id} className="grid grid-cols-3 gap-3 items-center">
                <div className={`text-sm font-medium capitalize ${SEVERIDAD_COLORS[field.severidad]}`}>
                  {field.severidad}
                </div>
                <FormField error={errors.tiemposRespuesta?.[i]?.tiempoRespuesta?.message}>
                  <Input
                    placeholder="ej: 2h, 30min"
                    {...register(`tiemposRespuesta.${i}.tiempoRespuesta`)}
                  />
                </FormField>
                <FormField error={errors.tiemposRespuesta?.[i]?.tiempoResolucion?.message}>
                  <Input
                    placeholder="ej: 8h, 24h, 5 días"
                    {...register(`tiemposRespuesta.${i}.tiempoResolucion`)}
                  />
                </FormField>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={actualizar.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {actualizar.isPending ? 'Guardando…' : 'Guardar plan SLA'}
        </Button>
      </div>
    </form>
  )
}

// ──────────────────────────────────────────────────────────
// SUB-COMPONENTE: F8-04 Resumen final
// ──────────────────────────────────────────────────────────

function F804ResumenFinal({ proyecto, srs }: { proyecto: Proyecto; srs: SRS }) {
  const { data: reqs = [] } = useRequerimientos(srs.id)
  const { data: casosPrueba = [] } = useCasosPrueba(srs.id)

  const stats = useMemo(() => {
    const rf = reqs.filter(r => r.tipo === 'funcional')
    const rnf = reqs.filter(r => r.tipo === 'no_funcional')
    const rd = reqs.filter(r => r.tipo === 'dominio')
    const rfMust = rf.filter(r => r.prioridad === 'must')
    const checklist = srs.checklistValidacion ?? []
    const secciones = srs.secciones
    const seccionesCompletadas = secciones
      ? Object.values(secciones).filter(s => s.completada).length
      : 0
    return {
      rf: rf.length, rnf: rnf.length, rd: rd.length,
      rfMust: rfMust.length,
      casosPrueba: casosPrueba.length,
      checklistCumplidos: checklist.filter(i => i.estado === 'cumplido').length,
      checklistTotal: checklist.length,
      seccionesCompletadas,
      seccionesTotal: 9, // portada + s1-s8
    }
  }, [reqs, casosPrueba, srs])

  const completado = {
    despliegue: !!srs.planDespliegue,
    capacitacion: !!srs.planCapacitacion,
    sla: !!srs.planSLA,
  }
  const todoCompleto = Object.values(completado).every(Boolean)

  return (
    <div className="space-y-6">
      {/* Estado general */}
      {srs.estado === 'aprobado' && todoCompleto ? (
        <div className="flex items-center gap-3 rounded-md border border-green-300 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
          <CheckCircle2 className="h-8 w-8 text-green-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-800 dark:text-green-400">
              Módulo 3 Alcance — COMPLETADO
            </p>
            <p className="text-sm text-green-700 dark:text-green-500 mt-0.5">
              El SRS está aprobado como v1.0 y todos los planes de transición están documentados.
              El proyecto "{proyecto.nombre}" puede avanzar a la fase de desarrollo.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800 dark:text-amber-400">
              Fase 8 en progreso
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-500 mt-0.5">
              Completa los tres planes de transición para finalizar el Módulo 3.
            </p>
          </div>
        </div>
      )}

      {/* Checklist F8 */}
      <Card>
        <CardHeader><CardTitle className="text-base">Planes de transición</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {[
            { label: 'F8-01 Plan de despliegue', done: completado.despliegue },
            { label: 'F8-02 Plan de capacitación', done: completado.capacitacion },
            { label: 'F8-03 Plan SLA', done: completado.sla },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              {item.done ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/40" />
              )}
              <span className={`text-sm ${item.done ? 'text-muted-foreground line-through' : 'font-medium'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* KPIs finales */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-primary" />
          KPIs del Módulo 3 — Alcance
        </CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'RF funcionales', value: stats.rf },
              { label: 'RNF calidad', value: stats.rnf },
              { label: 'RD dominio', value: stats.rd },
              { label: 'Casos de prueba', value: stats.casosPrueba },
              { label: 'Secciones SRS completadas', value: `${stats.seccionesCompletadas}/${stats.seccionesTotal}` },
              { label: 'Checklist calidad', value: `${stats.checklistCumplidos}/${stats.checklistTotal}` },
              { label: 'RF Must Have cubiertos', value: `${stats.rfMust}` },
              { label: 'Versión SRS', value: srs.version },
            ].map(kpi => (
              <div key={kpi.label} className="rounded-lg border bg-card p-3 text-center">
                <p className="text-xl font-bold text-primary">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Información del SRS */}
      <Card>
        <CardHeader><CardTitle className="text-base">Información del SRS</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Proyecto:</span>
              <p className="font-medium">{proyecto.nombre}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Versión SRS:</span>
              <p className="font-medium">{srs.version}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Tipo SRS:</span>
              <p className="font-medium">{srs.tipoSRS ?? '—'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Distribución MoSCoW (esfuerzo):</span>
              <p className="font-medium">
                {srs.distribucionMoSCoW
                  ? `Must ${srs.distribucionMoSCoW.must}% / Should ${srs.distribucionMoSCoW.should}% / Could ${srs.distribucionMoSCoW.could}%`
                  : '—'}
              </p>
            </div>
            {srs.aprobadoPorNombre && (
              <>
                <div>
                  <span className="text-muted-foreground">Aprobado por:</span>
                  <p className="font-medium">{srs.aprobadoPorNombre}</p>
                </div>
                {srs.fechaAprobacion && (
                  <div>
                    <span className="text-muted-foreground">Fecha aprobación:</span>
                    <p className="font-medium">{new Date(srs.fechaAprobacion).toLocaleDateString()}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {srs.estado === 'aprobado' && (
            <div className="mt-4 rounded-md border border-primary/20 bg-primary/5 p-3">
              <p className="text-sm font-medium text-primary flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Próximo paso: Módulo 4 — Diseño y Arquitectura
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                El SRS aprobado sirve como baseline de requerimientos para el diseño técnico del sistema.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ──────────────────────────────────────────────────────────

interface Fase8PanelProps {
  proyecto: Proyecto
  srs: SRS
}

const TABS = [
  { id: 'f801', label: 'F8-01 Despliegue', icon: Rocket },
  { id: 'f802', label: 'F8-02 Capacitación', icon: GraduationCap },
  { id: 'f803', label: 'F8-03 SLA', icon: ShieldAlert },
  { id: 'f804', label: 'F8-04 Resumen', icon: BarChart2 },
] as const

export function Fase8Panel({ proyecto, srs }: Fase8PanelProps) {
  const [tab, setTab] = useState<typeof TABS[number]['id']>('f801')

  const tabStatus = {
    f801: !!srs.planDespliegue,
    f802: !!srs.planCapacitacion,
    f803: !!srs.planSLA,
    f804: !!srs.planDespliegue && !!srs.planCapacitacion && !!srs.planSLA,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Fase 8 — Transición al Desarrollo</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Documenta los planes de despliegue, capacitación y SLA para entregar el proyecto al equipo de desarrollo.
          Fase habilitada solo tras aprobación del GATE 2.
        </p>
      </div>

      {srs.estado !== 'aprobado' && (
        <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>
            El SRS aún no tiene aprobación formal (GATE 2). Estos planes se pueden editar, pero el Módulo 3 no estará completo hasta la aprobación.
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b overflow-x-auto">
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap
                ${tab === t.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
              {tabStatus[t.id] && (
                <CheckCircle2 className="h-3 w-3 text-green-500 ml-0.5" />
              )}
            </button>
          )
        })}
      </div>

      {/* Contenido */}
      {tab === 'f801' && <F801Despliegue srs={srs} />}
      {tab === 'f802' && <F802Capacitacion srs={srs} />}
      {tab === 'f803' && <F803SLA srs={srs} />}
      {tab === 'f804' && <F804ResumenFinal proyecto={proyecto} srs={srs} />}
    </div>
  )
}
