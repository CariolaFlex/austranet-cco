'use client'

// ============================================================
// COMPONENTE: ProyectoWizard — Wizard 7 pasos (Módulo 2 Sprint 3B)
// Paso 1: Datos básicos | Paso 2: Metodología | Paso 3: Equipo
// Paso 4: Riesgos | Paso 5: Calendario | Paso 6: Presupuesto
// Paso 7: Revisión y activación
// ============================================================

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { v4 as uuidv4 } from 'uuid'
import {
  Plus, Trash2, CheckCircle, ChevronRight, ChevronLeft,
  Users, AlertTriangle, Calendar, DollarSign, Eye, Loader2,
  Info, Shield, Clock, BarChart3, CheckSquare, XCircle,
  Lightbulb, Ban, GitBranch,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib'
import { Badge } from '@/components/ui/badge'
import { Input, Textarea, FormField, Select } from '@/components/ui/input'
import { proyectoWizardSchema, type ProyectoWizardFormData } from '@/lib/validations/proyecto.schema'
import { useCreateProyecto } from '@/hooks/useProyectos'
import { useEntidades } from '@/hooks/useEntidades'
import { ROUTES } from '@/constants'
import {
  METODOLOGIAS_CONFIG,
  ROLES_EQUIPO,
  METODOS_ESTIMACION_CONFIG,
  CRITICIDAD_CONFIG,
  TIPO_PROYECTO_CONFIG,
  RIESGOS_CATALOGO,
  RIESGOS_HEREDADOS,
  HITOS_SUGERIDOS,
} from '@/constants/proyectos'
import { calcularRecomendacionMetodologia, validarHardBlock } from '@/lib/metodologia/arbolDecision'
import { calcularEfectosCascada, labelPoliticaEntregas } from '@/lib/metodologia/efectosCascada'
import type { Entidad, TipoProyecto, CriticidadProyecto, InputsMetodologiaSnapshot } from '@/types'

// -------------------------------------------------------
// HELPERS
// -------------------------------------------------------

const colorMap: Record<string, string> = {
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  teal: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
}

function ColorBadge({ color, label }: { color: string; label: string }) {
  return (
    <Badge variant="outline" className={colorMap[color] || colorMap.gray}>
      {label}
    </Badge>
  )
}

function generarCodigo(nombre: string, tipo: string): string {
  const tipoAbrev: Record<string, string> = {
    nuevo_desarrollo: 'ND', mantenimiento: 'MNT', migracion: 'MIG',
    consultoria: 'CSL', integracion: 'INT',
  }
  const abrev = tipoAbrev[tipo] || 'PRY'
  const palabras = nombre.trim().split(' ').filter(Boolean).slice(0, 2)
  const initiales = palabras.map((p) => p[0].toUpperCase()).join('')
  const year = new Date().getFullYear().toString().slice(-2)
  const rand = Math.floor(Math.random() * 900 + 100)
  return `${abrev}-${initiales}${year}-${rand}`
}

// -------------------------------------------------------
// PASOS CONFIG
// -------------------------------------------------------

const PASOS = [
  { numero: 1, titulo: 'Datos Básicos', icono: '📋' },
  { numero: 2, titulo: 'Metodología', icono: '⚙️' },
  { numero: 3, titulo: 'Equipo', icono: '👥' },
  { numero: 4, titulo: 'Riesgos', icono: '⚠️' },
  { numero: 5, titulo: 'Calendario', icono: '📅' },
  { numero: 6, titulo: 'Presupuesto', icono: '💰' },
  { numero: 7, titulo: 'Revisión', icono: '✅' },
]

// -------------------------------------------------------
// COMPONENTE PRINCIPAL
// -------------------------------------------------------

interface ProyectoWizardProps {
  entidades: Entidad[]
}

export function ProyectoWizard({ entidades }: ProyectoWizardProps) {
  const router = useRouter()
  const [paso, setPaso] = useState(1)
  const createProyecto = useCreateProyecto()

  const form = useForm<ProyectoWizardFormData>({
    resolver: zodResolver(proyectoWizardSchema),
    defaultValues: {
      nombre: '',
      codigo: '',
      descripcion: '',
      tipo: undefined,
      criticidad: undefined,
      clienteId: '',
      metodologia: undefined,
      justificacionMetodologia: '',
      // M2-INT: Campos decisorios para árbol de metodología
      tamanoEquipo: 1,
      distribuidoGeograficamente: false,
      requiereRegulacionExterna: false,
      estabilidadRequerimientos: undefined,
      clienteDisponibleParaIteraciones: false,
      tieneContratoFijo: false,
      clienteConsentioMetodologia: false,
      metodologiaVersion: 1,
      equipo: [],
      riesgos: [],
      fechaInicio: '',
      fechaFinEstimada: '',
      hitos: [],
      presupuesto: undefined,
    },
    mode: 'onChange',
  })

  const { register, control, watch, setValue, getValues, formState: { errors } } = form

  const tipo = watch('tipo')
  const criticidad = watch('criticidad')
  const clienteId = watch('clienteId')
  const metodologia = watch('metodologia')
  const nombre = watch('nombre')

  // Auto-generar código cuando cambia nombre y tipo
  useEffect(() => {
    if (nombre && tipo && !getValues('codigo')) {
      setValue('codigo', generarCodigo(nombre, tipo))
    }
  }, [nombre, tipo, setValue, getValues])

  // Field arrays
  const equipoArray = useFieldArray({ control, name: 'equipo' })
  const riesgosArray = useFieldArray({ control, name: 'riesgos' })
  const hitosArray = useFieldArray({ control, name: 'hitos' })

  // Pre-poblar riesgos cuando se selecciona el tipo de proyecto y cliente
  useEffect(() => {
    if (tipo && clienteId && riesgosArray.fields.length === 0) {
      const entidad = entidades.find((e) => e.id === clienteId)
      const nivelRiesgo = entidad?.nivelRiesgo ?? 'bajo'

      // Riesgos heredados de la entidad (M2-03 §3)
      const heredados = (RIESGOS_HEREDADOS[nivelRiesgo] ?? []).map((r) => ({
        ...r, id: uuidv4(), estado: 'activo' as const, origen: 'heredado_entidad' as const,
        mitigacion: '', responsable: '',
      }))

      // Riesgos del catálogo del tipo de proyecto (M2-03 §4)
      const catalogo = (RIESGOS_CATALOGO[tipo] ?? []).slice(0, 5).map((r) => ({
        ...r, id: uuidv4(), estado: 'activo' as const, origen: 'identificado_proyecto' as const,
        mitigacion: '', responsable: '',
      }))

      const todos = [...heredados, ...catalogo]
      riesgosArray.replace(todos)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo, clienteId])

  // Pre-poblar hitos sugeridos cuando se selecciona tipo
  useEffect(() => {
    if (tipo && hitosArray.fields.length === 0) {
      const sugeridos = (HITOS_SUGERIDOS[tipo] ?? []).map((h) => ({
        ...h, id: uuidv4(), fechaEstimada: '', fechaReal: '',
        estado: 'pendiente' as const, responsable: '',
      }))
      hitosArray.replace(sugeridos)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo])

  // Validar paso actual antes de avanzar
  const validarPasoActual = async (): Promise<boolean> => {
    const fieldsMap: Record<number, (keyof ProyectoWizardFormData)[]> = {
      1: ['nombre', 'codigo', 'descripcion', 'tipo', 'criticidad', 'clienteId'],
      2: [
        'tamanoEquipo', 'distribuidoGeograficamente', 'requiereRegulacionExterna',
        'estabilidadRequerimientos', 'clienteDisponibleParaIteraciones', 'tieneContratoFijo',
        'metodologia', 'clienteConsentioMetodologia',
      ],
      3: ['equipo'],
      4: ['riesgos'],
      5: ['fechaInicio', 'fechaFinEstimada', 'hitos'],
      6: [],
    }
    const fields = fieldsMap[paso] ?? []
    if (fields.length === 0) return true
    const result = await form.trigger(fields)
    return result
  }

  const avanzar = async () => {
    // Validaciones extra por paso
    if (paso === 2) {
      const crit = getValues('criticidad')
      const just = getValues('justificacionMetodologia')
      if ((crit === 'alta' || crit === 'critica') && (!just || just.trim().length < 20)) {
        form.setError('justificacionMetodologia', {
          message: 'Justificación obligatoria (mín. 20 caracteres) para criticidad alta o crítica'
        })
        return
      }
      // Validar que el cliente haya consentido (M2-INT-04)
      if (!getValues('clienteConsentioMetodologia')) {
        form.setError('clienteConsentioMetodologia', {
          message: 'El consentimiento del cliente es obligatorio para avanzar al PASO 3'
        })
        return
      }
    }
    if (paso === 3) {
      const equipo = getValues('equipo')
      const tienePM = equipo.some((m) => m.rol === 'PM' || m.rol === 'gestor')
      if (!tienePM) {
        form.setError('equipo', { message: 'Debe haber al menos 1 miembro con rol "PM"' })
        return
      }
    }
    if (paso === 6) {
      const crit = getValues('criticidad')
      const presupuesto = getValues('presupuesto')
      if ((crit === 'alta' || crit === 'critica') && !presupuesto?.estimacionNominal) {
        form.setError('presupuesto', { message: 'Presupuesto obligatorio para proyectos de criticidad alta o crítica' })
        return
      }
    }

    const ok = await validarPasoActual()
    if (ok && paso < 7) setPaso(paso + 1)
  }

  const retroceder = () => { if (paso > 1) setPaso(paso - 1) }

  const onSubmit = async (activar: boolean) => {
    const data = getValues()
    const entidad = entidades.find((e) => e.id === data.clienteId)

    createProyecto.mutate(
      {
        data: {
          estado: 'borrador' as const, // el servicio lo sobreescribe según `activar`
          codigo: data.codigo,
          nombre: data.nombre,
          descripcion: data.descripcion,
          tipo: data.tipo,
          criticidad: data.criticidad,
          metodologia: data.metodologia,
          justificacionMetodologia: data.justificacionMetodologia,
          clienteId: data.clienteId,
          // M2-INT-01: Campos decisorios y acuerdo de metodología
          tamanoEquipo: data.tamanoEquipo,
          distribuidoGeograficamente: data.distribuidoGeograficamente,
          requiereRegulacionExterna: data.requiereRegulacionExterna,
          estabilidadRequerimientos: data.estabilidadRequerimientos,
          clienteDisponibleParaIteraciones: data.clienteDisponibleParaIteraciones,
          tieneContratoFijo: data.tieneContratoFijo,
          clienteConsentioMetodologia: data.clienteConsentioMetodologia,
          metodologiaVersion: data.metodologiaVersion ?? 1,
          inputsMetodologiaSnapshot: {
            criticidad: data.criticidad,
            tamanoEquipo: data.tamanoEquipo ?? 1,
            distribuidoGeograficamente: data.distribuidoGeograficamente ?? false,
            requiereRegulacionExterna: data.requiereRegulacionExterna ?? false,
            estabilidadRequerimientos: data.estabilidadRequerimientos ?? 'media',
            clienteDisponibleParaIteraciones: data.clienteDisponibleParaIteraciones ?? false,
            tieneContratoFijo: data.tieneContratoFijo ?? false,
          },
          equipo: data.equipo,
          riesgos: data.riesgos.map((r) => ({
            ...r,
            estado: 'activo',
          })),
          hitos: data.hitos.map((h) => ({
            ...h,
            fechaEstimada: new Date(h.fechaEstimada),
            fechaReal: h.fechaReal ? new Date(h.fechaReal) : undefined,
          })),
          presupuesto: data.presupuesto,
          fechaInicio: data.fechaInicio ? new Date(data.fechaInicio) : undefined,
          fechaFinEstimada: data.fechaFinEstimada ? new Date(data.fechaFinEstimada) : undefined,
          presupuestoEstimado: data.presupuesto?.estimacionNominal,
          moneda: data.presupuesto?.moneda,
        },
        activar,
      },
      {
        onSuccess: (proyecto) => {
          router.push(ROUTES.PROYECTO_DETALLE(proyecto.id))
        },
      }
    )
  }

  const clienteSeleccionado = entidades.find((e) => e.id === clienteId)

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------

  return (
    <div className="max-w-4xl mx-auto">
      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {PASOS.map((p) => (
            <div key={p.numero} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {p.numero > 1 && (
                  <div className={`flex-1 h-0.5 ${paso >= p.numero ? 'bg-primary' : 'bg-border'}`} />
                )}
                <button
                  onClick={() => paso > p.numero && setPaso(p.numero)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors shrink-0 ${
                    paso === p.numero
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                      : paso > p.numero
                      ? 'bg-primary/20 text-primary cursor-pointer hover:bg-primary/30'
                      : 'bg-muted text-muted-foreground cursor-default'
                  }`}
                >
                  {paso > p.numero ? <CheckCircle className="h-4 w-4" /> : p.numero}
                </button>
                {p.numero < 7 && (
                  <div className={`flex-1 h-0.5 ${paso > p.numero ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
              <span className={`text-xs mt-1 text-center hidden sm:block ${paso === p.numero ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                {p.titulo}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Paso 1 — Datos básicos */}
      {paso === 1 && <Paso1DatosBasicos form={form} entidades={entidades} />}

      {/* Paso 2 — Metodología */}
      {paso === 2 && <Paso2Metodologia form={form} criticidad={criticidad} entidades={entidades} />}

      {/* Paso 3 — Equipo */}
      {paso === 3 && (
        <Paso3Equipo form={form} equipoArray={equipoArray} />
      )}

      {/* Paso 4 — Riesgos */}
      {paso === 4 && (
        <Paso4Riesgos form={form} riesgosArray={riesgosArray} />
      )}

      {/* Paso 5 — Calendario */}
      {paso === 5 && (
        <Paso5Calendario form={form} hitosArray={hitosArray} tipo={tipo} />
      )}

      {/* Paso 6 — Presupuesto */}
      {paso === 6 && <Paso6Presupuesto form={form} criticidad={criticidad} />}

      {/* Paso 7 — Revisión */}
      {paso === 7 && (
        <Paso7Revision
          data={getValues()}
          entidades={entidades}
          onCrear={() => onSubmit(false)}
          onActivar={() => onSubmit(true)}
          isLoading={createProyecto.isPending}
        />
      )}

      {/* Navegación */}
      {paso < 7 && (
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={retroceder}
            disabled={paso === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          <Button type="button" onClick={avanzar}>
            Siguiente
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
      {paso === 7 && (
        <div className="flex justify-start mt-6">
          <Button type="button" variant="outline" onClick={retroceder}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Revisar pasos
          </Button>
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------
// PASO 1 — DATOS BÁSICOS
// -------------------------------------------------------

function Paso1DatosBasicos({
  form,
  entidades,
}: {
  form: ReturnType<typeof useForm<ProyectoWizardFormData>>
  entidades: Entidad[]
}) {
  const { register, control, watch, setValue, formState: { errors } } = form
  const tipo = watch('tipo')

  const entidadesOptions = entidades
    .filter((e) => e.estado === 'activo')
    .map((e) => ({ value: e.id, label: e.razonSocial + (e.nombreComercial ? ` (${e.nombreComercial})` : '') }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>📋</span> Paso 1 — Datos básicos del proyecto
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Define la identidad del proyecto, su tipo, criticidad y el cliente asociado.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nombre del proyecto" required error={errors.nombre?.message}>
            <Input {...register('nombre')} placeholder="Ej: Portal Web Corporativo" />
          </FormField>
          <FormField label="Código del proyecto" required error={errors.codigo?.message}>
            <div className="flex gap-2">
              <Input {...register('codigo')} placeholder="Auto-generado" className="flex-1" />
              <Button
                type="button" variant="outline" size="sm"
                onClick={() => {
                  const n = form.getValues('nombre')
                  const t = form.getValues('tipo')
                  if (n && t) setValue('codigo', generarCodigo(n, t))
                }}
              >
                ↺
              </Button>
            </div>
          </FormField>
        </div>

        <FormField label="Descripción" required error={errors.descripcion?.message}>
          <Textarea
            {...register('descripcion')}
            placeholder="Describe brevemente el objetivo y alcance del proyecto"
            rows={3}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Tipo de proyecto" required error={errors.tipo?.message}>
            <Controller
              control={control}
              name="tipo"
              render={({ field }) => (
                <Select
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={Object.entries(TIPO_PROYECTO_CONFIG).map(([v, c]) => ({ value: v, label: c.label }))}
                  placeholder="Seleccionar tipo"
                />
              )}
            />
          </FormField>
          <FormField label="Criticidad" required error={errors.criticidad?.message}>
            <Controller
              control={control}
              name="criticidad"
              render={({ field }) => (
                <Select
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={Object.entries(CRITICIDAD_CONFIG).map(([v, c]) => ({ value: v, label: c.label }))}
                  placeholder="Seleccionar criticidad"
                />
              )}
            />
          </FormField>
        </div>

        <FormField
          label="Entidad cliente"
          required
          error={errors.clienteId?.message}
        >
          <Controller
            control={control}
            name="clienteId"
            render={({ field }) => (
              <Select
                value={field.value || ''}
                onChange={field.onChange}
                options={entidadesOptions}
                placeholder="Seleccionar entidad cliente..."
              />
            )}
          />
        </FormField>

        {watch('clienteId') && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            {(() => {
              const ent = entidades.find((e) => e.id === watch('clienteId'))
              if (!ent) return null
              return (
                <div className="flex items-start gap-2 text-sm">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-200">{ent.razonSocial}</p>
                    <p className="text-blue-700 dark:text-blue-300">
                      {ent.sector} · Riesgo: {ent.nivelRiesgo} · {ent.stakeholders?.length ?? 0} stakeholders
                    </p>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// -------------------------------------------------------
// PASO 2 — METODOLOGÍA (M2-INT: árbol de decisión + acuerdo)
// -------------------------------------------------------

function Paso2Metodologia({
  form,
  criticidad,
  entidades,
}: {
  form: ReturnType<typeof useForm<ProyectoWizardFormData>>
  criticidad?: CriticidadProyecto
  entidades: Entidad[]
}) {
  const { register, control, watch, setValue, formState: { errors } } = form
  const metodologia = watch('metodologia')
  const clienteId = watch('clienteId')
  const tamanoEquipo = watch('tamanoEquipo') ?? 1
  const distribuidoGeograficamente = watch('distribuidoGeograficamente') ?? false
  const requiereRegulacionExterna = watch('requiereRegulacionExterna') ?? false
  const estabilidadRequerimientos = watch('estabilidadRequerimientos')
  const clienteDisponibleParaIteraciones = watch('clienteDisponibleParaIteraciones') ?? false
  const tieneContratoFijo = watch('tieneContratoFijo') ?? false
  const clienteConsentioMetodologia = watch('clienteConsentioMetodologia') ?? false
  const requiereJustificacion = criticidad === 'alta' || criticidad === 'critica'

  // Sincronizar disponibilidadParaSprints desde la entidad cliente
  const entidadCliente = entidades.find((e) => e.id === clienteId)
  useEffect(() => {
    if (entidadCliente?.disponibilidadParaSprints !== undefined) {
      setValue('clienteDisponibleParaIteraciones', entidadCliente.disponibilidadParaSprints)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clienteId])

  // Calcular recomendación del árbol de decisión (M2-07 §3.2)
  const inputs: InputsMetodologiaSnapshot | null = estabilidadRequerimientos ? {
    criticidad: criticidad ?? 'baja',
    tamanoEquipo,
    distribuidoGeograficamente,
    requiereRegulacionExterna,
    estabilidadRequerimientos,
    clienteDisponibleParaIteraciones,
    tieneContratoFijo,
  } : null

  const recomendacion = useMemo(
    () => inputs ? calcularRecomendacionMetodologia(inputs) : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tamanoEquipo, distribuidoGeograficamente, requiereRegulacionExterna,
     estabilidadRequerimientos, clienteDisponibleParaIteraciones, tieneContratoFijo, criticidad]
  )

  // Validar hard-block para la metodología seleccionada
  const hardBlock = useMemo(
    () => (metodologia && inputs) ? validarHardBlock(metodologia, inputs) : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metodologia, tamanoEquipo, distribuidoGeograficamente, requiereRegulacionExterna,
     estabilidadRequerimientos, clienteDisponibleParaIteraciones, tieneContratoFijo]
  )

  // Efectos en cascada para la metodología seleccionada
  const efectos = useMemo(
    () => metodologia ? calcularEfectosCascada(metodologia) : null,
    [metodologia]
  )

  const metConfig = metodologia ? METODOLOGIAS_CONFIG[metodologia as keyof typeof METODOLOGIAS_CONFIG] : null
  const sobrescribeRecomendacion = recomendacion && metodologia && metodologia !== recomendacion.recomendacion

  const BOOL_OPTS = [
    { value: 'false', label: 'No' },
    { value: 'true', label: 'Sí' },
  ]
  const ESTABILIDAD_OPTS = [
    { value: 'baja', label: 'Baja — cambian frecuentemente' },
    { value: 'media', label: 'Media — cambian moderadamente' },
    { value: 'alta', label: 'Alta — estables desde el inicio' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" /> Paso 2 — Metodología de desarrollo (M2-07)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Completa los inputs del árbol de decisión para obtener la recomendación del sistema.
          {requiereJustificacion && (
            <span className="text-orange-600 dark:text-orange-400 font-medium ml-1">
              (Justificación obligatoria — criticidad {criticidad})
            </span>
          )}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* ── SECCIÓN A: Inputs del árbol de decisión ── */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            Sección A — Inputs para la decisión (M2-07 §3.1)
          </h4>
          <div className="p-3 bg-muted/40 rounded-lg text-xs text-muted-foreground mb-3">
            Criticidad seleccionada en PASO 1: <strong className="text-foreground">{criticidad ?? '—'}</strong>
            {entidadCliente && (
              <span className="ml-3">
                · Entidad: <strong className="text-foreground">{entidadCliente.razonSocial}</strong>
                {entidadCliente.disponibilidadParaSprints !== undefined && (
                  <span> · Disponibilidad sprints: <strong>{entidadCliente.disponibilidadParaSprints ? 'Sí' : 'No'}</strong></span>
                )}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Tamaño estimado del equipo *"
              error={errors.tamanoEquipo?.message}
            >
              <Input
                type="number"
                min={1}
                max={100}
                {...register('tamanoEquipo', { valueAsNumber: true })}
                placeholder="ej. 5"
              />
            </FormField>

            <FormField
              label="Estabilidad de requerimientos *"
              error={errors.estabilidadRequerimientos?.message}
            >
              <Controller
                control={control}
                name="estabilidadRequerimientos"
                render={({ field: f }) => (
                  <Select
                    value={f.value ?? ''}
                    onChange={f.onChange}
                    options={ESTABILIDAD_OPTS}
                    placeholder="Seleccionar..."
                  />
                )}
              />
            </FormField>

            <FormField
              label="¿Equipo distribuido geográficamente? *"
              error={errors.distribuidoGeograficamente?.message}
            >
              <Controller
                control={control}
                name="distribuidoGeograficamente"
                render={({ field: f }) => (
                  <Select
                    value={f.value ? 'true' : 'false'}
                    onChange={(e) => f.onChange(e.target.value === 'true')}
                    options={BOOL_OPTS}
                  />
                )}
              />
            </FormField>

            <FormField
              label="¿Requiere regulación externa? *"
              error={errors.requiereRegulacionExterna?.message}
            >
              <Controller
                control={control}
                name="requiereRegulacionExterna"
                render={({ field: f }) => (
                  <Select
                    value={f.value ? 'true' : 'false'}
                    onChange={(e) => f.onChange(e.target.value === 'true')}
                    options={BOOL_OPTS}
                  />
                )}
              />
            </FormField>

            <FormField
              label="¿Cliente disponible para iteraciones? *"
              error={errors.clienteDisponibleParaIteraciones?.message}
            >
              <Controller
                control={control}
                name="clienteDisponibleParaIteraciones"
                render={({ field: f }) => (
                  <Select
                    value={f.value ? 'true' : 'false'}
                    onChange={(e) => f.onChange(e.target.value === 'true')}
                    options={BOOL_OPTS}
                  />
                )}
              />
            </FormField>

            <FormField
              label="¿Tiene contrato de precio fijo? *"
              error={errors.tieneContratoFijo?.message}
            >
              <Controller
                control={control}
                name="tieneContratoFijo"
                render={({ field: f }) => (
                  <Select
                    value={f.value ? 'true' : 'false'}
                    onChange={(e) => f.onChange(e.target.value === 'true')}
                    options={BOOL_OPTS}
                  />
                )}
              />
            </FormField>
          </div>
        </div>

        {/* ── SECCIÓN B: Recomendación del árbol ── */}
        {recomendacion && (
          <div className="p-4 rounded-lg border-2 border-primary/30 bg-primary/5">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              Sección B — Recomendación del árbol de decisión (M2-07 §3.2)
            </h4>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1">
                RECOMENDADO: {METODOLOGIAS_CONFIG[recomendacion.recomendacion as keyof typeof METODOLOGIAS_CONFIG]?.label ?? recomendacion.recomendacion}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{recomendacion.justificacion}</p>
            {recomendacion.rutaDecision.length > 0 && (
              <details className="mt-2">
                <summary className="text-xs text-primary cursor-pointer">Ver ruta del árbol</summary>
                <ul className="mt-1 space-y-0.5 pl-4">
                  {recomendacion.rutaDecision.map((paso, i) => (
                    <li key={i} className="text-xs text-muted-foreground list-disc">{paso}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}

        {/* ── SECCIÓN C: Selector de metodología ── */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-primary" />
            Sección C — Metodología acordada
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(METODOLOGIAS_CONFIG).map(([key, cfg]) => {
              const esRecomendada = recomendacion?.recomendacion === key
              const hardBlockEstaMetod = inputs ? validarHardBlock(key as never, inputs) : null
              const tieneBloqueo = hardBlockEstaMetod ? !hardBlockEstaMetod.esValido : false
              return (
                <button
                  key={key}
                  type="button"
                  disabled={tieneBloqueo}
                  onClick={() => !tieneBloqueo && setValue('metodologia', key as never)}
                  className={`text-left p-3 rounded-lg border-2 transition-all relative ${
                    tieneBloqueo
                      ? 'border-red-200 bg-red-50/50 dark:bg-red-900/10 opacity-60 cursor-not-allowed'
                      : metodologia === key
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-border hover:border-primary/40 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                    <span className="font-medium text-sm">{cfg.label}</span>
                    <div className="flex gap-1">
                      {esRecomendada && (
                        <Badge className="bg-primary text-primary-foreground text-xs px-1.5 py-0">
                          ★ RECOMENDADO
                        </Badge>
                      )}
                      {tieneBloqueo && (
                        <Badge variant="destructive" className="text-xs px-1.5 py-0">
                          <Ban className="h-2.5 w-2.5 mr-0.5" />BLOQUEADO
                        </Badge>
                      )}
                      <Badge variant="outline" className={`text-xs ${cfg.tipo === 'agil' ? 'text-green-700 border-green-300' : cfg.tipo === 'hibrido' ? 'text-purple-700 border-purple-300' : 'text-blue-700 border-blue-300'}`}>
                        {cfg.tipo}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{cfg.mejorPara}</p>
                  {tieneBloqueo && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 line-clamp-2">
                      {hardBlockEstaMetod?.mensajeBloqueo}
                    </p>
                  )}
                </button>
              )
            })}
          </div>
          {errors.metodologia && (
            <p className="text-sm text-destructive mt-1">{errors.metodologia.message}</p>
          )}

          {/* Hard-block activo para la metodología seleccionada */}
          {hardBlock && !hardBlock.esValido && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
                <Ban className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{hardBlock.mensajeBloqueo}</span>
              </p>
            </div>
          )}
        </div>

        {/* Info card de la metodología seleccionada + efectos en cascada */}
        {metConfig && efectos && (
          <div className="p-4 bg-muted/50 rounded-lg border">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              {metConfig.label} — Implicaciones automáticas en el sistema (M2-07 §4)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground block">SRS (Módulo 3):</span>
                <p className="font-medium">{efectos.tipoSRS} {efectos.validacionIncremental ? '· incremental' : ''}</p>
              </div>
              <div>
                <span className="text-muted-foreground block">Estimación (M2-02):</span>
                <p className="font-medium">{efectos.metodoEstimacionRecomendado.replace('_', ' ')}</p>
              </div>
              <div>
                <span className="text-muted-foreground block">Roles obligatorios:</span>
                <p className="font-medium">{efectos.rolesObligatorios.join(', ')}</p>
              </div>
              <div>
                <span className="text-muted-foreground block">Política entregas:</span>
                <p className="font-medium">{labelPoliticaEntregas(efectos.politicaEntregas)}</p>
              </div>
              <div>
                <span className="text-muted-foreground block">CI/CD:</span>
                <p className="font-medium">{efectos.cicdObligatorio ? 'Obligatorio' : 'Opcional'}</p>
              </div>
              <div>
                <span className="text-muted-foreground block">KPIs activos:</span>
                <p className="font-medium">{efectos.kpisActivosPorDefecto.join(', ')}</p>
              </div>
            </div>
            {sobrescribeRecomendacion && (
              <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200">
                <p className="text-xs text-yellow-700 dark:text-yellow-400 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Estás sobrescribiendo la recomendación del árbol. La justificación es obligatoria.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Justificación */}
        <FormField
          label={`Justificación de la metodología${requiereJustificacion || sobrescribeRecomendacion ? ' *' : ' (opcional)'}`}
          error={errors.justificacionMetodologia?.message}
        >
          <Textarea
            {...register('justificacionMetodologia')}
            placeholder={
              sobrescribeRecomendacion
                ? `Explica por qué elegiste ${metConfig?.label ?? metodologia} en lugar de ${METODOLOGIAS_CONFIG[recomendacion?.recomendacion as keyof typeof METODOLOGIAS_CONFIG]?.label ?? recomendacion?.recomendacion} (recomendada por el árbol)...`
                : 'Explica por qué esta metodología es la más adecuada para este proyecto...'
            }
            rows={3}
          />
        </FormField>

        {/* ── SECCIÓN D: Consentimiento del cliente ── */}
        <div className="p-4 rounded-lg border bg-muted/30">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Sección D — Acuerdo con el cliente (M2-07 §5)
          </h4>
          <p className="text-xs text-muted-foreground mb-3">
            El cliente de la entidad debe aceptar explícitamente la metodología porque implica compromisos
            sobre disponibilidad, frecuencia de revisiones y gestión de cambios.
          </p>
          <div
            className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
              clienteConsentioMetodologia
                ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                : 'border-border hover:border-primary/40'
            }`}
            onClick={() => setValue('clienteConsentioMetodologia', !clienteConsentioMetodologia)}
            role="checkbox"
            aria-checked={clienteConsentioMetodologia}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
              clienteConsentioMetodologia ? 'bg-green-500 border-green-500' : 'border-muted-foreground'
            }`}>
              {clienteConsentioMetodologia && <CheckSquare className="h-3 w-3 text-white" />}
            </div>
            <div>
              <p className="text-sm font-medium">
                El cliente ({entidadCliente?.razonSocial ?? 'entidad cliente'}) ha sido informado y acepta explícitamente:
              </p>
              <ul className="mt-1 space-y-1 text-xs text-muted-foreground list-disc pl-4">
                <li>El tipo de entregas que recibirá ({efectos ? labelPoliticaEntregas(efectos.politicaEntregas) : '—'})</li>
                <li>La frecuencia de revisiones requerida de su parte</li>
                <li>La forma en que se gestionarán los cambios de requerimientos</li>
                <li>La documentación que recibirá al finalizar el proyecto</li>
              </ul>
            </div>
          </div>
          {errors.clienteConsentioMetodologia && (
            <p className="text-sm text-destructive mt-1">{errors.clienteConsentioMetodologia.message}</p>
          )}
        </div>

      </CardContent>
    </Card>
  )
}

// -------------------------------------------------------
// PASO 3 — EQUIPO
// -------------------------------------------------------

function Paso3Equipo({
  form,
  equipoArray,
}: {
  form: ReturnType<typeof useForm<ProyectoWizardFormData>>
  equipoArray: ReturnType<typeof useFieldArray<ProyectoWizardFormData, 'equipo'>>
}) {
  const { register, control, formState: { errors } } = form
  const { fields, append, remove } = equipoArray

  const agregarMiembro = () => {
    append({ usuarioId: uuidv4(), nombre: '', rol: '', rolCliente: '', esExterno: false })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" /> Paso 3 — Equipo del proyecto
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Define los miembros del equipo. Debe haber al menos 1 miembro con rol <strong>PM</strong>.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tabla de roles de referencia */}
        <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
          <p className="font-medium mb-2">Roles disponibles (M2-01 §6.3):</p>
          <div className="flex flex-wrap gap-2">
            {ROLES_EQUIPO.map((r) => (
              <span key={r.value} className="px-2 py-0.5 bg-background rounded border text-xs">
                <strong>{r.value}</strong> — {r.label}
              </span>
            ))}
          </div>
        </div>

        {fields.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No hay miembros en el equipo</p>
            <p className="text-sm">Agrega al menos 1 miembro con rol PM</p>
          </div>
        )}

        {fields.map((field, idx) => (
          <div key={field.id} className="p-4 border rounded-lg space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Miembro #{idx + 1}</span>
              <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => remove(idx)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Nombre" required error={errors.equipo?.[idx]?.nombre?.message}>
                <Input {...register(`equipo.${idx}.nombre`)} placeholder="Nombre completo" />
              </FormField>
              <FormField label="Rol en el proyecto" required error={errors.equipo?.[idx]?.rol?.message}>
                <Controller
                  control={control}
                  name={`equipo.${idx}.rol`}
                  render={({ field: f }) => (
                    <Select
                      value={f.value}
                      onChange={f.onChange}
                      options={ROLES_EQUIPO.map((r) => ({ value: r.value, label: r.label }))}
                      placeholder="Seleccionar rol"
                    />
                  )}
                />
              </FormField>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Rol en la organización cliente (opcional)">
                <Input {...register(`equipo.${idx}.rolCliente`)} placeholder="Ej: Sponsor, Jefe de TI" />
              </FormField>
              <FormField label="¿Miembro externo?">
                <Controller
                  control={control}
                  name={`equipo.${idx}.esExterno`}
                  render={({ field: f }) => (
                    <Select
                      value={f.value ? 'si' : 'no'}
                      onChange={(e) => f.onChange(e.target.value === 'si')}
                      options={[{ value: 'no', label: 'No (interno)' }, { value: 'si', label: 'Sí (externo)' }]}
                    />
                  )}
                />
              </FormField>
            </div>
          </div>
        ))}

        {errors.equipo && typeof errors.equipo.message === 'string' && (
          <p className="text-sm text-destructive">{errors.equipo.message}</p>
        )}

        <Button type="button" variant="outline" onClick={agregarMiembro} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Agregar miembro al equipo
        </Button>
      </CardContent>
    </Card>
  )
}

// -------------------------------------------------------
// PASO 4 — RIESGOS
// -------------------------------------------------------

const TIPO_RIESGO_OPTS = [
  { value: 'tecnologico', label: 'Tecnológico' },
  { value: 'personas', label: 'Personas' },
  { value: 'organizacional', label: 'Organizacional' },
  { value: 'requerimientos', label: 'Requerimientos' },
  { value: 'estimacion', label: 'Estimación' },
]
const PROBABILIDAD_OPTS = [
  { value: 'muy_baja', label: 'Muy baja' }, { value: 'baja', label: 'Baja' },
  { value: 'media', label: 'Media' }, { value: 'alta', label: 'Alta' }, { value: 'muy_alta', label: 'Muy alta' },
]
const IMPACTO_OPTS = [
  { value: 'muy_bajo', label: 'Muy bajo' }, { value: 'bajo', label: 'Bajo' },
  { value: 'medio', label: 'Medio' }, { value: 'alto', label: 'Alto' }, { value: 'muy_alto', label: 'Muy alto' },
]
const ESTRATEGIA_OPTS = [
  { value: 'evitar', label: 'Evitar' }, { value: 'minimizar', label: 'Minimizar' },
  { value: 'contingencia', label: 'Contingencia' }, { value: 'aceptar', label: 'Aceptar' },
]

const NIVEL_RIESGO_MATRIX: Record<string, Record<string, string>> = {
  muy_baja: { muy_bajo: 'bajo', bajo: 'bajo', medio: 'bajo', alto: 'medio', muy_alto: 'medio' },
  baja: { muy_bajo: 'bajo', bajo: 'bajo', medio: 'medio', alto: 'medio', muy_alto: 'alto' },
  media: { muy_bajo: 'bajo', bajo: 'medio', medio: 'medio', alto: 'alto', muy_alto: 'alto' },
  alta: { muy_bajo: 'medio', bajo: 'medio', medio: 'alto', alto: 'alto', muy_alto: 'critico' },
  muy_alta: { muy_bajo: 'medio', bajo: 'alto', medio: 'alto', alto: 'critico', muy_alto: 'critico' },
}

const NIVEL_COLOR = { bajo: 'green', medio: 'yellow', alto: 'orange', critico: 'red' }

function calcNivel(prob: string, imp: string): string {
  return NIVEL_RIESGO_MATRIX[prob]?.[imp] ?? 'medio'
}

function Paso4Riesgos({
  form,
  riesgosArray,
}: {
  form: ReturnType<typeof useForm<ProyectoWizardFormData>>
  riesgosArray: ReturnType<typeof useFieldArray<ProyectoWizardFormData, 'riesgos'>>
}) {
  const { register, control, watch, formState: { errors } } = form
  const { fields, append, remove } = riesgosArray

  const agregarRiesgo = () => {
    append({
      id: uuidv4(), descripcion: '', tipo: 'tecnologico', probabilidad: 'media',
      impacto: 'medio', estrategia: 'minimizar', mitigacion: '', responsable: '',
      estado: 'activo', origen: 'identificado_proyecto',
    })
  }

  const riesgos = watch('riesgos') ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" /> Paso 4 — Riesgos iniciales
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Los riesgos fueron pre-poblados con el catálogo del tipo de proyecto y riesgos heredados de la entidad.
          Revisa, ajusta y agrega más si corresponde. Mínimo 3 riesgos (M2-03 §8).
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No hay riesgos registrados</p>
          </div>
        )}

        {fields.map((field, idx) => {
          const r = riesgos[idx]
          const nivel = r ? calcNivel(r.probabilidad, r.impacto) : 'medio'
          const isHeredado = r?.origen === 'heredado_entidad'

          return (
            <div key={field.id} className={`p-4 border rounded-lg space-y-3 ${isHeredado ? 'border-orange-200 dark:border-orange-800' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-muted-foreground">Riesgo #{idx + 1}</span>
                  {isHeredado && (
                    <Badge variant="outline" className="text-xs text-orange-700 border-orange-300">
                      Heredado de entidad
                    </Badge>
                  )}
                  <ColorBadge color={NIVEL_COLOR[nivel as keyof typeof NIVEL_COLOR] ?? 'gray'} label={`Nivel: ${nivel}`} />
                </div>
                <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive shrink-0" onClick={() => remove(idx)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              <FormField label="Descripción del riesgo" required error={errors.riesgos?.[idx]?.descripcion?.message}>
                <Textarea {...register(`riesgos.${idx}.descripcion`)} rows={2} placeholder="Describe concretamente qué puede ocurrir y en qué contexto..." />
              </FormField>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <FormField label="Tipo">
                  <Controller control={control} name={`riesgos.${idx}.tipo`} render={({ field: f }) => (
                    <Select value={f.value} onChange={f.onChange} options={TIPO_RIESGO_OPTS} />
                  )} />
                </FormField>
                <FormField label="Probabilidad">
                  <Controller control={control} name={`riesgos.${idx}.probabilidad`} render={({ field: f }) => (
                    <Select value={f.value} onChange={f.onChange} options={PROBABILIDAD_OPTS} />
                  )} />
                </FormField>
                <FormField label="Impacto">
                  <Controller control={control} name={`riesgos.${idx}.impacto`} render={({ field: f }) => (
                    <Select value={f.value} onChange={f.onChange} options={IMPACTO_OPTS} />
                  )} />
                </FormField>
                <FormField label="Estrategia">
                  <Controller control={control} name={`riesgos.${idx}.estrategia`} render={({ field: f }) => (
                    <Select value={f.value} onChange={f.onChange} options={ESTRATEGIA_OPTS} />
                  )} />
                </FormField>
              </div>

              <FormField label="Plan de mitigación (opcional)">
                <Input {...register(`riesgos.${idx}.mitigacion`)} placeholder="Acción concreta para mitigar o gestionar este riesgo" />
              </FormField>
            </div>
          )
        })}

        {errors.riesgos && typeof errors.riesgos.message === 'string' && (
          <p className="text-sm text-destructive">{errors.riesgos.message}</p>
        )}

        <Button type="button" variant="outline" onClick={agregarRiesgo} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Agregar riesgo
        </Button>
      </CardContent>
    </Card>
  )
}

// -------------------------------------------------------
// PASO 5 — CALENDARIO
// -------------------------------------------------------

const ESTADO_HITO_OPTS = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_riesgo', label: 'En riesgo' },
  { value: 'completado', label: 'Completado' },
  { value: 'incumplido', label: 'Incumplido' },
]

function Paso5Calendario({
  form,
  hitosArray,
  tipo,
}: {
  form: ReturnType<typeof useForm<ProyectoWizardFormData>>
  hitosArray: ReturnType<typeof useFieldArray<ProyectoWizardFormData, 'hitos'>>
  tipo?: TipoProyecto
}) {
  const { register, control, formState: { errors } } = form
  const { fields, append, remove } = hitosArray

  const agregarHito = () => {
    append({
      id: uuidv4(), nombre: '', descripcion: '', fechaEstimada: '', fechaReal: '',
      estado: 'pendiente', entregable: '', responsable: '',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" /> Paso 5 — Calendarización e hitos
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Define las fechas del proyecto y los hitos clave. Los hitos fueron pre-sugeridos según el tipo de proyecto.
          Mínimo 3 hitos (M2-01 §9).
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Fecha de inicio" required error={errors.fechaInicio?.message}>
            <Input type="date" {...register('fechaInicio')} />
          </FormField>
          <FormField label="Fecha fin estimada" required error={errors.fechaFinEstimada?.message}>
            <Input type="date" {...register('fechaFinEstimada')} />
          </FormField>
        </div>

        <div className="flex items-center justify-between mt-2">
          <h4 className="text-sm font-medium">Hitos del proyecto</h4>
          <span className="text-xs text-muted-foreground">{fields.length} hito{fields.length !== 1 ? 's' : ''}</span>
        </div>

        {fields.map((field, idx) => (
          <div key={field.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Hito #{idx + 1}</span>
              <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => remove(idx)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Nombre del hito" required error={errors.hitos?.[idx]?.nombre?.message}>
                <Input {...register(`hitos.${idx}.nombre`)} placeholder="Ej: Aprobación SRS" />
              </FormField>
              <FormField label="Responsable" required error={errors.hitos?.[idx]?.responsable?.message}>
                <Input {...register(`hitos.${idx}.responsable`)} placeholder="Nombre del responsable" />
              </FormField>
            </div>
            <FormField label="Descripción" error={errors.hitos?.[idx]?.descripcion?.message}>
              <Input {...register(`hitos.${idx}.descripcion`)} placeholder="¿Qué debe ocurrir para completar este hito?" />
            </FormField>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField label="Fecha estimada" required error={errors.hitos?.[idx]?.fechaEstimada?.message}>
                <Input type="date" {...register(`hitos.${idx}.fechaEstimada`)} />
              </FormField>
              <FormField label="Entregable (opcional)">
                <Input {...register(`hitos.${idx}.entregable`)} placeholder="Ej: SRS firmado" />
              </FormField>
              <FormField label="Estado">
                <Controller control={control} name={`hitos.${idx}.estado`} render={({ field: f }) => (
                  <Select value={f.value} onChange={f.onChange} options={ESTADO_HITO_OPTS} />
                )} />
              </FormField>
            </div>
          </div>
        ))}

        {errors.hitos && typeof errors.hitos.message === 'string' && (
          <p className="text-sm text-destructive">{errors.hitos.message}</p>
        )}

        <Button type="button" variant="outline" onClick={agregarHito} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Agregar hito
        </Button>
      </CardContent>
    </Card>
  )
}

// -------------------------------------------------------
// PASO 6 — PRESUPUESTO
// -------------------------------------------------------

function Paso6Presupuesto({
  form,
  criticidad,
}: {
  form: ReturnType<typeof useForm<ProyectoWizardFormData>>
  criticidad?: CriticidadProyecto
}) {
  const { register, control, watch, setValue, formState: { errors } } = form
  const presupuesto = watch('presupuesto')
  const tienePresupuesto = !!presupuesto?.metodoUsado
  const requierePresupuesto = criticidad === 'alta' || criticidad === 'critica'

  const [supuestoInput, setSupuestoInput] = useState('')
  const [exclusionInput, setExclusionInput] = useState('')

  const activarPresupuesto = () => {
    setValue('presupuesto', {
      metodoUsado: 'juicio_experto',
      estimacionMinima: 0,
      estimacionNominal: 0,
      estimacionMaxima: 0,
      moneda: 'CLP',
      supuestos: [],
      exclusiones: [],
    })
  }

  const addItem = (tipo: 'supuestos' | 'exclusiones', val: string) => {
    if (!val.trim()) return
    const current = watch(`presupuesto.${tipo}`) ?? []
    setValue(`presupuesto.${tipo}`, [...current, val.trim()])
    if (tipo === 'supuestos') setSupuestoInput('')
    else setExclusionInput('')
  }

  const removeItem = (tipo: 'supuestos' | 'exclusiones', idx: number) => {
    const current = watch(`presupuesto.${tipo}`) ?? []
    setValue(`presupuesto.${tipo}`, current.filter((_, i) => i !== idx))
  }

  const metodo = presupuesto?.metodoUsado
  const metConfig = metodo ? METODOS_ESTIMACION_CONFIG[metodo] : null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" /> Paso 6 — Estimación de presupuesto
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {requierePresupuesto
            ? <span className="text-orange-600 font-medium">Obligatorio para criticidad {criticidad}. </span>
            : 'Opcional para criticidad baja o media. '}
          Selecciona un método y define el rango de estimación (M2-02 §7).
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!tienePresupuesto ? (
          <div className="text-center py-8">
            <DollarSign className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">
              {requierePresupuesto ? 'La estimación de presupuesto es obligatoria para este proyecto.' : 'La estimación de presupuesto es opcional.'}
            </p>
            <Button type="button" onClick={activarPresupuesto}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar estimación de presupuesto
            </Button>
          </div>
        ) : (
          <>
            <FormField label="Método de estimación" required>
              <Controller
                control={control}
                name="presupuesto.metodoUsado"
                render={({ field: f }) => (
                  <Select
                    value={f.value || ''}
                    onChange={f.onChange}
                    options={Object.entries(METODOS_ESTIMACION_CONFIG).map(([v, c]) => ({ value: v, label: c.label }))}
                  />
                )}
              />
            </FormField>

            {metConfig && (
              <div className="p-3 bg-muted/40 rounded-lg text-sm">
                <div className="flex items-start gap-2">
                  <BarChart3 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">{metConfig.label}</p>
                    <p className="text-muted-foreground">{metConfig.descripcion}</p>
                    <p className="text-xs mt-1">Etapa: {metConfig.etapa} · Precisión típica: <strong>{metConfig.precision}</strong></p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <FormField label="Moneda" required error={errors.presupuesto?.moneda?.message}>
                <Controller control={control} name="presupuesto.moneda" render={({ field: f }) => (
                  <Select value={f.value || ''} onChange={f.onChange}
                    options={[{ value: 'CLP', label: 'CLP (Peso CL)' }, { value: 'USD', label: 'USD (Dólar)' }, { value: 'EUR', label: 'EUR (Euro)' }, { value: 'UF', label: 'UF' }]}
                  />
                )} />
              </FormField>
              <FormField label="Estimación mínima" required error={errors.presupuesto?.estimacionMinima?.message}>
                <Input type="number" min={0} {...register('presupuesto.estimacionMinima', { valueAsNumber: true })} placeholder="0" />
              </FormField>
              <FormField label="Estimación nominal" required error={errors.presupuesto?.estimacionNominal?.message}>
                <Input type="number" min={0} {...register('presupuesto.estimacionNominal', { valueAsNumber: true })} placeholder="0" />
              </FormField>
              <FormField label="Estimación máxima" required error={errors.presupuesto?.estimacionMaxima?.message}>
                <Input type="number" min={0} {...register('presupuesto.estimacionMaxima', { valueAsNumber: true })} placeholder="0" />
              </FormField>
            </div>

            {errors.presupuesto?.estimacionMaxima && (
              <p className="text-sm text-destructive">{errors.presupuesto.estimacionMaxima.message}</p>
            )}

            {/* Supuestos */}
            <div>
              <label className="text-sm font-medium mb-2 block">Supuestos</label>
              <div className="flex gap-2 mb-2">
                <Input value={supuestoInput} onChange={(e) => setSupuestoInput(e.target.value)}
                  placeholder="Ej: Equipo de 2 devs full-stack"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem('supuestos', supuestoInput) } }}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => addItem('supuestos', supuestoInput)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(watch('presupuesto.supuestos') ?? []).map((s, i) => (
                  <Badge key={i} variant="secondary" className="gap-1 cursor-pointer" onClick={() => removeItem('supuestos', i)}>
                    {s} <XCircle className="h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Exclusiones */}
            <div>
              <label className="text-sm font-medium mb-2 block">Exclusiones</label>
              <div className="flex gap-2 mb-2">
                <Input value={exclusionInput} onChange={(e) => setExclusionInput(e.target.value)}
                  placeholder="Ej: QA externo no incluido"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem('exclusiones', exclusionInput) } }}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => addItem('exclusiones', exclusionInput)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(watch('presupuesto.exclusiones') ?? []).map((ex, i) => (
                  <Badge key={i} variant="secondary" className="gap-1 cursor-pointer" onClick={() => removeItem('exclusiones', i)}>
                    {ex} <XCircle className="h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 text-sm">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                <p className="text-yellow-800 dark:text-yellow-200">
                  Esta estimación es referencial. La precisión aumentará una vez completado el SRS en el Módulo 3.
                </p>
              </div>
            </div>

            <Button type="button" variant="ghost" size="sm" className="text-destructive"
              onClick={() => setValue('presupuesto', undefined)}>
              <Trash2 className="mr-2 h-3 w-3" />
              Eliminar estimación de presupuesto
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// -------------------------------------------------------
// PASO 7 — REVISIÓN Y ACTIVACIÓN
// -------------------------------------------------------

function Paso7Revision({
  data,
  entidades,
  onCrear,
  onActivar,
  isLoading,
}: {
  data: ProyectoWizardFormData
  entidades: Entidad[]
  onCrear: () => void
  onActivar: () => void
  isLoading: boolean
}) {
  const entidad = entidades.find((e) => e.id === data.clienteId)
  const criticidad = data.criticidad
  const requiereJustificacion = criticidad === 'alta' || criticidad === 'critica'
  const requierePresupuesto = criticidad === 'alta' || criticidad === 'critica'

  const tienePM = data.equipo?.some((m) => m.rol === 'PM' || m.rol === 'gestor') ?? false
  const tieneRequerimientos = data.riesgos?.some((r) => r.tipo === 'requerimientos') ?? false
  const tieneEstimacion = data.riesgos?.some((r) => r.tipo === 'estimacion') ?? false

  const checks = [
    { ok: !!entidad, label: 'Entidad cliente seleccionada', detail: entidad?.razonSocial },
    { ok: !!data.metodologia, label: 'Metodología seleccionada', detail: data.metodologia ? METODOLOGIAS_CONFIG[data.metodologia]?.label : '' },
    { ok: !requiereJustificacion || (data.justificacionMetodologia?.trim().length ?? 0) >= 20, label: 'Justificación de metodología', detail: requiereJustificacion ? 'Requerida para criticidad alta/crítica' : 'No requerida' },
    { ok: tienePM, label: 'Equipo con rol PM asignado', detail: `${data.equipo?.length ?? 0} miembro(s)` },
    { ok: (data.riesgos?.length ?? 0) >= 3, label: 'Mínimo 3 riesgos registrados', detail: `${data.riesgos?.length ?? 0} riesgo(s)` },
    { ok: tieneRequerimientos, label: 'Riesgo de tipo "Requerimientos" presente', detail: 'Siempre requerido (M2-03 §8)' },
    { ok: tieneEstimacion, label: 'Riesgo de tipo "Estimación" presente', detail: 'Siempre requerido (M2-03 §8)' },
    { ok: !!data.fechaInicio && !!data.fechaFinEstimada && new Date(data.fechaFinEstimada) > new Date(data.fechaInicio), label: 'Fechas del proyecto válidas', detail: data.fechaInicio && data.fechaFinEstimada ? `${data.fechaInicio} → ${data.fechaFinEstimada}` : 'Sin fechas' },
    { ok: (data.hitos?.length ?? 0) >= 3, label: 'Mínimo 3 hitos definidos', detail: `${data.hitos?.length ?? 0} hito(s)` },
    { ok: !requierePresupuesto || !!data.presupuesto?.estimacionNominal, label: 'Presupuesto estimado', detail: requierePresupuesto ? 'Requerido para criticidad alta/crítica' : 'Opcional' },
  ]

  const todosOk = checks.every((c) => c.ok)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" /> Paso 7 — Revisión y activación
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Verifica que toda la información del proyecto esté completa antes de guardarlo.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Checklist de validación */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <CheckSquare className="h-4 w-4" /> Checklist de validación
          </h4>
          {checks.map((c, idx) => (
            <div key={idx} className={`flex items-start gap-3 p-2 rounded-lg ${c.ok ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              {c.ok
                ? <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                : <XCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />}
              <div className="text-sm">
                <span className={c.ok ? 'text-green-800 dark:text-green-200 font-medium' : 'text-red-800 dark:text-red-200 font-medium'}>
                  {c.label}
                </span>
                {c.detail && <span className="text-muted-foreground ml-2">— {c.detail}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Resumen del proyecto */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {[
            { label: 'Nombre', value: data.nombre || '—' },
            { label: 'Código', value: data.codigo || '—' },
            { label: 'Tipo', value: data.tipo ? TIPO_PROYECTO_CONFIG[data.tipo]?.label : '—' },
            { label: 'Criticidad', value: data.criticidad ? CRITICIDAD_CONFIG[data.criticidad]?.label : '—' },
            { label: 'Metodología', value: data.metodologia ? METODOLOGIAS_CONFIG[data.metodologia]?.label : '—' },
            { label: 'Cliente', value: entidad?.razonSocial || '—' },
            { label: 'Equipo', value: `${data.equipo?.length ?? 0} miembro(s)` },
            { label: 'Riesgos', value: `${data.riesgos?.length ?? 0} registrado(s)` },
          ].map((item) => (
            <div key={item.label} className="p-3 bg-muted/40 rounded-lg">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="font-medium text-sm mt-0.5 truncate">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCrear}
            disabled={isLoading || !todosOk}
            className="flex-1"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Guardar como borrador
          </Button>
          <Button
            type="button"
            onClick={onActivar}
            disabled={isLoading || !todosOk}
            className="flex-1"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Crear y solicitar aprobación
          </Button>
        </div>

        {!todosOk && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 text-sm text-red-800 dark:text-red-200">
            <p className="font-medium">Correcciones necesarias</p>
            <p className="mt-1">Revisa los ítems marcados en rojo para poder activar el proyecto.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
