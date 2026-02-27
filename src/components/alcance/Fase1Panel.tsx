'use client'

// ============================================================
// COMPONENTE: Fase1Panel — Inicio y Definición del Negocio
// Fuentes: M3-01 (marco fundacional), M3-08 (glosario dominio)
// Tareas: F1-01 | F1-02 | F1-03 | F1-04 | F1-05 | GATE 1
// ============================================================

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Plus, Trash2, CheckCircle2, XCircle, AlertTriangle,
  Save, ChevronRight, Users, Globe, BookOpen,
  ShieldAlert, TrendingDown, Clock, AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib'
import { Input, Textarea, FormField, Select } from '@/components/ui/input'
import {
  useActualizarSRS, useProcesarGate1,
  useTerminosDominio, useCrearTerminoDominio, useCrearRequerimiento,
} from '@/hooks/useAlcance'
import { useProyecto } from '@/hooks/useProyectos'
import {
  TECNICAS_ADQUISICION_CONFIG,
  ROL_STAKEHOLDER_SRS_CONFIG,
} from '@/constants/alcance'
import type {
  Proyecto, SRS, RiesgoSRS, StakeholderSRS, TecnicaAdquisicion,
  ResultadoFactibilidad, EstadoGate1,
} from '@/types'

// -------------------------------------------------------
// TABS
// -------------------------------------------------------

type Tab1 = 'F1-01' | 'F1-02' | 'F1-03' | 'F1-04' | 'F1-05' | 'GATE1'

const TABS: { id: Tab1; label: string; sublabel: string }[] = [
  { id: 'F1-01', label: 'F1-01', sublabel: 'Inicio SRS' },
  { id: 'F1-02', label: 'F1-02', sublabel: 'Glosario' },
  { id: 'F1-03', label: 'F1-03', sublabel: 'Stakeholders' },
  { id: 'F1-04', label: 'F1-04', sublabel: 'Factibilidad' },
  { id: 'F1-05', label: 'F1-05', sublabel: 'Riesgos' },
  { id: 'GATE1', label: '🔒', sublabel: 'Gate 1' },
]

// -------------------------------------------------------
// SCHEMAS
// -------------------------------------------------------

const inicioSchema = z.object({
  declaracionProblema: z.string().min(20, 'Describe el problema de negocio en detalle'),
  objetivosNegocio: z.array(z.string().min(5)).min(1).max(5, 'Máximo 5 objetivos'),
  sistemasExistentes: z.array(z.string().min(2)),
})

const terminoSchema = z.object({
  termino: z.string().min(2, 'Término requerido'),
  definicionOperativa: z.string().min(10, 'Definición requerida'),
  fuenteRegulatoriaONorma: z.string().optional(),
  esRequerimientoDominio: z.boolean(),
})

const riesgoSchema = z.object({
  descripcion: z.string().min(10, 'Describe el riesgo'),
  tipo: z.enum(['stakeholder_no_disponible', 'dominio_complejo', 'reqs_volatiles', 'alcance_indefinido', 'conflicto_stakeholders']),
  probabilidad: z.enum(['muy_baja', 'baja', 'media', 'alta', 'muy_alta']),
  impacto: z.enum(['muy_bajo', 'bajo', 'medio', 'alto', 'muy_alto']),
  mitigacion: z.string().optional(),
  registradoEnM203: z.boolean(),
})

type InicioForm = z.infer<typeof inicioSchema>
type TerminoForm = z.infer<typeof terminoSchema>
type RiesgoForm = z.infer<typeof riesgoSchema>

// -------------------------------------------------------
// HELPERS
// -------------------------------------------------------

const FACTIBILIDAD_LABELS: Record<ResultadoFactibilidad, string> = {
  viable: 'Viable',
  viable_con_restricciones: 'Viable con restricciones',
  no_viable: 'No viable',
}

const RIESGO_TIPO_LABELS: Record<RiesgoSRS['tipo'], string> = {
  stakeholder_no_disponible: 'Stakeholder no disponible',
  dominio_complejo: 'Dominio complejo',
  reqs_volatiles: 'Requerimientos volátiles',
  alcance_indefinido: 'Alcance indefinido',
  conflicto_stakeholders: 'Conflicto entre stakeholders',
}

function calcularFactibilidadGlobal(
  negocio: ResultadoFactibilidad,
  tecnica: ResultadoFactibilidad,
  integracion: ResultadoFactibilidad,
): ResultadoFactibilidad {
  if (negocio === 'no_viable' || tecnica === 'no_viable' || integracion === 'no_viable') {
    return 'no_viable'
  }
  if (negocio === 'viable_con_restricciones' || tecnica === 'viable_con_restricciones' || integracion === 'viable_con_restricciones') {
    return 'viable_con_restricciones'
  }
  return 'viable'
}

// -------------------------------------------------------
// SUB-COMPONENTE: F1-01 Declaración del Problema
// -------------------------------------------------------

function F101({ srs, proyectoId }: { srs: SRS; proyectoId: string }) {
  const { mutate: actualizarSRS, isPending } = useActualizarSRS()
  const { register, handleSubmit, control, formState: { errors } } = useForm<InicioForm>({
    resolver: zodResolver(inicioSchema),
    defaultValues: {
      declaracionProblema: srs.declaracionProblema ?? '',
      objetivosNegocio: srs.objetivosNegocio?.length ? srs.objetivosNegocio : [''],
      sistemasExistentes: srs.sistemasExistentes?.length ? srs.sistemasExistentes : [''],
    },
  })
  const {
    fields: objetivosFields,
    append: appendObjetivo,
    remove: removeObjetivo,
  } = useFieldArray({ control, name: 'objetivosNegocio' as never })
  const {
    fields: sistemasFields,
    append: appendSistema,
    remove: removeSistema,
  } = useFieldArray({ control, name: 'sistemasExistentes' as never })

  const onSubmit = (data: InicioForm) => {
    actualizarSRS({
      id: srs.id,
      data: {
        declaracionProblema: data.declaracionProblema,
        objetivosNegocio: data.objetivosNegocio.filter(Boolean),
        sistemasExistentes: data.sistemasExistentes.filter(Boolean),
        // También guardar técnicas activas si está definido el campo
      },
    })
  }

  // Selección de técnicas
  const [tecnicasActivas, setTecnicasActivas] = useState<TecnicaAdquisicion[]>(
    srs.tecnicasActivas ?? []
  )

  const toggleTecnica = (t: TecnicaAdquisicion) => {
    setTecnicasActivas((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    )
  }

  const soloEntrevistaCerrada =
    tecnicasActivas.length > 0 &&
    tecnicasActivas.every((t) => TECNICAS_ADQUISICION_CONFIG[t].descubreConocimientoTacito === false)

  const saveTecnicas = () => {
    actualizarSRS({ id: srs.id, data: { tecnicasActivas } })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Declaración del problema */}
      <div>
        <label className="block text-sm font-medium mb-1.5">
          Declaración del Problema <span className="text-destructive">*</span>
        </label>
        <p className="text-xs text-muted-foreground mb-2">
          ¿Por qué existe este proyecto? Describe en lenguaje del negocio, no técnico.
        </p>
        <Textarea
          {...register('declaracionProblema')}
          placeholder="La empresa enfrenta el problema de... lo que genera impactos en... El sistema propuesto resolverá..."
          rows={4}
          className={errors.declaracionProblema ? 'border-destructive' : ''}
        />
        {errors.declaracionProblema && (
          <p className="text-xs text-destructive mt-1">{errors.declaracionProblema.message}</p>
        )}
      </div>

      {/* Objetivos de negocio */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <label className="block text-sm font-medium">Objetivos de Negocio</label>
            <p className="text-xs text-muted-foreground">Máximo 5 objetivos verificables</p>
          </div>
          {objetivosFields.length < 5 && (
            <Button type="button" variant="outline" size="sm" onClick={() => appendObjetivo('')}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Agregar
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {objetivosFields.map((field, i) => (
            <div key={field.id} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-5 flex-shrink-0">{i + 1}.</span>
              <Input
                {...register(`objetivosNegocio.${i}`)}
                placeholder={`Objetivo ${i + 1}: El sistema debe...`}
                className="flex-1"
              />
              {objetivosFields.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeObjetivo(i)}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sistemas existentes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <label className="block text-sm font-medium">Sistemas Existentes</label>
            <p className="text-xs text-muted-foreground">Sistemas actuales del cliente que interactúan con el proyecto</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => appendSistema('')}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Agregar
          </Button>
        </div>
        <div className="space-y-2">
          {sistemasFields.map((field, i) => (
            <div key={field.id} className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                {...register(`sistemasExistentes.${i}`)}
                placeholder="Nombre del sistema existente"
                className="flex-1"
              />
              {sistemasFields.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeSistema(i)}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Técnicas de adquisición */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <label className="block text-sm font-medium">Técnicas de Adquisición</label>
            <p className="text-xs text-muted-foreground">Selecciona las técnicas que se usarán en Fase 2</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={saveTecnicas} disabled={isPending}>
            <Save className="h-3.5 w-3.5 mr-1" /> Guardar técnicas
          </Button>
        </div>
        {soloEntrevistaCerrada && (
          <div className="mb-3 flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-900/10 dark:border-amber-900/30">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-800 dark:text-amber-300">
              <strong>Bloqueo M3-F2-01:</strong> No puedes usar solo entrevistas cerradas — no descubren conocimiento tácito. Agrega al menos una técnica con conocimiento tácito.
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 gap-2">
          {(Object.entries(TECNICAS_ADQUISICION_CONFIG) as [TecnicaAdquisicion, typeof TECNICAS_ADQUISICION_CONFIG[TecnicaAdquisicion]][]).map(([key, config]) => {
            const activa = tecnicasActivas.includes(key)
            return (
              <button
                type="button"
                key={key}
                onClick={() => toggleTecnica(key)}
                className={`
                  flex items-start gap-3 p-3 rounded-lg border text-left transition-colors
                  ${activa ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/40'}
                `}
              >
                <div className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center
                  ${activa ? 'bg-primary border-primary' : 'border-muted-foreground/40'}`}>
                  {activa && <CheckCircle2 className="h-3 w-3 text-white" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{config.label}</span>
                    {config.descubreConocimientoTacito ? (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        Tácito ✓
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                        Solo explícito
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{config.descripcion}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Guardando...' : <><Save className="h-4 w-4 mr-2" />Guardar Inicio SRS</>}
        </Button>
      </div>
    </form>
  )
}

// -------------------------------------------------------
// SUB-COMPONENTE: F1-02 Glosario del Dominio
// -------------------------------------------------------

function F102({ srs, proyectoId }: { srs: SRS; proyectoId: string }) {
  const { data: terminos = [], isLoading } = useTerminosDominio(srs.id)
  const { mutate: crearTermino, isPending } = useCrearTerminoDominio()
  const { mutate: crearReq } = useCrearRequerimiento()
  const [showForm, setShowForm] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TerminoForm>({
    resolver: zodResolver(terminoSchema),
    defaultValues: { termino: '', definicionOperativa: '', esRequerimientoDominio: false },
  })

  const onSubmit = (data: TerminoForm) => {
    crearTermino(
      {
        srsId: srs.id,
        proyectoId,
        termino: data.termino,
        definicionOperativa: data.definicionOperativa,
        fuenteRegulatoriaONorma: data.fuenteRegulatoriaONorma || undefined,
        esRequerimientoDominio: data.esRequerimientoDominio,
        origen: 'nuevo_proyecto',
        requerimientoDominioId: undefined,
        entradaGlosarioId: undefined,
        creadoPor: 'usuario',
      },
      {
        onSuccess: (termino) => {
          if (data.esRequerimientoDominio) {
            // Generar RD propuesto automáticamente
            crearReq({
              proyectoId,
              srsId: srs.id,
              codigo: '', // generado por el servicio
              tipo: 'dominio',
              prioridad: 'must',
              titulo: `RD: ${data.termino}`,
              descripcion: data.definicionOperativa,
              fuente: 'glosario',
              estado: 'propuesto',
              version: 1,
              normaOLeyFuente: data.fuenteRegulatoriaONorma,
            })
          }
          reset()
          setShowForm(false)
        },
      }
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Términos técnicos y de dominio del proyecto. Los marcados como Requerimiento de Dominio generan un RD-XXX propuesto.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Nuevo término
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Término *" error={errors.termino?.message}>
                  <Input {...register('termino')} placeholder="Nombre del término" />
                </FormField>
                <FormField label="Norma / Ley fuente" error={errors.fuenteRegulatoriaONorma?.message}>
                  <Input {...register('fuenteRegulatoriaONorma')} placeholder="ISO 9001, Ley 20.393..." />
                </FormField>
              </div>
              <FormField label="Definición operativa *" error={errors.definicionOperativa?.message}>
                <Textarea {...register('definicionOperativa')} placeholder="Definición precisa en lenguaje del negocio" rows={2} />
              </FormField>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('esRequerimientoDominio')} className="rounded" />
                <span className="text-sm">Genera Requerimiento de Dominio (RD-XXX)</span>
              </label>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => { reset(); setShowForm(false) }}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" disabled={isPending}>
                  {isPending ? 'Guardando...' : 'Guardar término'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-6 text-sm text-muted-foreground">Cargando glosario...</div>
      ) : terminos.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Sin términos. Agrega el vocabulario del dominio del proyecto.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {terminos.map((t) => (
            <div key={t.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{t.termino}</span>
                  {t.esRequerimientoDominio && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">RD</Badge>
                  )}
                  {t.fuenteRegulatoriaONorma && (
                    <Badge variant="outline" className="text-xs">{t.fuenteRegulatoriaONorma}</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{t.definicionOperativa}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------
// SUB-COMPONENTE: F1-03 Stakeholders del SRS
// -------------------------------------------------------

function F103({ srs, proyecto }: { srs: SRS; proyecto: Proyecto }) {
  const { mutate: actualizarSRS, isPending } = useActualizarSRS()
  const [stakeholdersSRS, setStakeholdersSRS] = useState<StakeholderSRS[]>(
    srs.stakeholdersSRS ?? []
  )

  // Importar desde M1-01 stakeholders del proyecto
  // En un proyecto real: useEntidad(proyecto.clienteId) para obtener los stakeholders
  const stakeholdersProyecto = [] // Se obtienen de la entidad del proyecto

  const handleRolChange = (stakeholderId: string, rolSRS: StakeholderSRS['rolSRS']) => {
    setStakeholdersSRS((prev) => {
      const exists = prev.find((s) => s.stakeholderId === stakeholderId)
      if (exists) {
        return prev.map((s) => s.stakeholderId === stakeholderId ? { ...s, rolSRS } : s)
      }
      return [...prev, {
        stakeholderId,
        nombre: stakeholderId,
        rolSRS,
        esObligatorioTenerRF: false,
        disponibleParaEntrevista: true,
      }]
    })
  }

  const handleSave = () => {
    actualizarSRS({ id: srs.id, data: { stakeholdersSRS } })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/30">
        <Users className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-800 dark:text-blue-300">
          Los stakeholders se importan desde M1-01 (Entidad del proyecto). Clasifica cada uno para el proceso IR usando los roles disponibles. Los de <strong>nivelInfluencia = alto</strong> son obligatorios tener al menos un RF asociado.
        </p>
      </div>

      {srs.stakeholdersSRS && srs.stakeholdersSRS.length > 0 ? (
        <div className="space-y-3">
          {srs.stakeholdersSRS.map((sh) => (
            <div key={sh.stakeholderId} className="p-3 rounded-lg border bg-card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{sh.nombre}</span>
                    {sh.esObligatorioTenerRF && (
                      <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                        RF obligatorio
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">
                      Rol SRS: {ROL_STAKEHOLDER_SRS_CONFIG[sh.rolSRS]?.label ?? sh.rolSRS}
                    </span>
                    <span className={`text-xs ${sh.disponibleParaEntrevista ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {sh.disponibleParaEntrevista ? '✓ Disponible' : '✗ No disponible'}
                    </span>
                  </div>
                </div>
                <Select
                  value={sh.rolSRS}
                  onChange={(e) => handleRolChange(sh.stakeholderId, e.target.value as StakeholderSRS['rolSRS'])}
                  className="w-44"
                >
                  {(Object.entries(ROL_STAKEHOLDER_SRS_CONFIG) as [StakeholderSRS['rolSRS'], typeof ROL_STAKEHOLDER_SRS_CONFIG[StakeholderSRS['rolSRS']]][]).map(([key, cfg]) => (
                    <option key={key} value={key}>{cfg.label}</option>
                  ))}
                </Select>
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isPending} size="sm">
              <Save className="h-3.5 w-3.5 mr-1" />
              {isPending ? 'Guardando...' : 'Guardar stakeholders'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Sin stakeholders clasificados.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Los stakeholders se importan automáticamente desde M1-01 al activar el proyecto.
          </p>
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------
// SUB-COMPONENTE: F1-04 Estudio de Factibilidad
// -------------------------------------------------------

function F104({ srs }: { srs: SRS }) {
  const { mutate: actualizarSRS, isPending } = useActualizarSRS()
  const [negocioRes, setNegocioRes] = useState<ResultadoFactibilidad>(srs.factibilidad?.negocio?.resultado ?? 'viable')
  const [negocioJust, setNegocioJust] = useState(srs.factibilidad?.negocio?.justificacion ?? '')
  const [tecnicaRes, setTecnicaRes] = useState<ResultadoFactibilidad>(srs.factibilidad?.tecnica?.resultado ?? 'viable')
  const [tecnicaJust, setTecnicaJust] = useState(srs.factibilidad?.tecnica?.justificacion ?? '')
  const [integracionRes, setIntegracionRes] = useState<ResultadoFactibilidad>(srs.factibilidad?.integracion?.resultado ?? 'viable')
  const [integracionJust, setIntegracionJust] = useState(srs.factibilidad?.integracion?.justificacion ?? '')

  const globalResult = calcularFactibilidadGlobal(negocioRes, tecnicaRes, integracionRes)

  const handleSave = () => {
    actualizarSRS({
      id: srs.id,
      data: {
        factibilidad: {
          negocio: { resultado: negocioRes, justificacion: negocioJust },
          tecnica: { resultado: tecnicaRes, justificacion: tecnicaJust },
          integracion: { resultado: integracionRes, justificacion: integracionJust },
          global: globalResult,
        },
      },
    })
  }

  const globalColor = globalResult === 'viable' ? 'green' : globalResult === 'viable_con_restricciones' ? 'yellow' : 'red'
  const globalBg = { green: 'bg-green-50 border-green-200 text-green-800', yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800', red: 'bg-red-50 border-red-200 text-red-800' }[globalColor]

  const DimensionRow = ({
    label, desc, result, onResult, just, onJust,
  }: {
    label: string; desc: string
    result: ResultadoFactibilidad; onResult: (v: ResultadoFactibilidad) => void
    just: string; onJust: (v: string) => void
  }) => (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium text-sm">{label}</p>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
          <Select
            value={result}
            onChange={(e) => onResult(e.target.value as ResultadoFactibilidad)}
            className="w-56 flex-shrink-0"
          >
            <option value="viable">✅ Viable</option>
            <option value="viable_con_restricciones">⚠️ Viable con restricciones</option>
            <option value="no_viable">❌ No viable</option>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Justificación *</label>
          <Textarea
            value={just}
            onChange={(e) => onJust(e.target.value)}
            placeholder="Describe los hallazgos que sustentan esta evaluación..."
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4">
      {/* Resultado global */}
      <div className={`flex items-center gap-3 p-4 rounded-lg border ${globalBg}`}>
        {globalResult === 'viable' && <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />}
        {globalResult === 'viable_con_restricciones' && <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />}
        {globalResult === 'no_viable' && <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />}
        <div>
          <p className="font-semibold text-sm">
            Factibilidad Global: {FACTIBILIDAD_LABELS[globalResult]}
          </p>
          <p className="text-xs mt-0.5">
            {globalResult === 'no_viable'
              ? 'Al menos una dimensión es No Viable → Gate 1 resultará en No-Go'
              : globalResult === 'viable_con_restricciones'
                ? 'Al menos una dimensión tiene restricciones — documentar en Gate 1'
                : 'Todas las dimensiones son viables — Gate 1 puede resultar en Go'}
          </p>
        </div>
      </div>

      <DimensionRow
        label="Factibilidad de Negocio"
        desc="¿El proyecto resuelve el problema declarado? ¿El ROI está justificado?"
        result={negocioRes} onResult={setNegocioRes}
        just={negocioJust} onJust={setNegocioJust}
      />
      <DimensionRow
        label="Factibilidad Técnica"
        desc="¿El stack tecnológico de M2-07 puede implementar la solución? ¿Hay dependencias críticas?"
        result={tecnicaRes} onResult={setTecnicaRes}
        just={tecnicaJust} onJust={setTecnicaJust}
      />
      <DimensionRow
        label="Factibilidad de Integración"
        desc="¿Los sistemas existentes (F1-01) permiten la integración necesaria?"
        result={integracionRes} onResult={setIntegracionRes}
        just={integracionJust} onJust={setIntegracionJust}
      />

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? 'Guardando...' : <><Save className="h-4 w-4 mr-2" />Guardar Factibilidad</>}
        </Button>
      </div>
    </div>
  )
}

// -------------------------------------------------------
// SUB-COMPONENTE: F1-05 Riesgos del SRS
// -------------------------------------------------------

function F105({ srs }: { srs: SRS }) {
  const { mutate: actualizarSRS, isPending } = useActualizarSRS()
  const [riesgos, setRiesgos] = useState<RiesgoSRS[]>(srs.riesgosSRS ?? [])
  const [showForm, setShowForm] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RiesgoForm>({
    resolver: zodResolver(riesgoSchema),
    defaultValues: { tipo: 'reqs_volatiles', probabilidad: 'media', impacto: 'medio', registradoEnM203: false },
  })

  const altaAlerta = riesgos.filter((r) => r.probabilidad === 'alta' || r.probabilidad === 'muy_alta').length

  const onSubmit = (data: RiesgoForm) => {
    const nuevo: RiesgoSRS = {
      id: crypto.randomUUID(),
      ...data,
      mitigacion: data.mitigacion || undefined,
    }
    const nuevos = [...riesgos, nuevo]
    setRiesgos(nuevos)
    actualizarSRS({ id: srs.id, data: { riesgosSRS: nuevos } })
    reset()
    setShowForm(false)
  }

  const removeRiesgo = (id: string) => {
    const nuevos = riesgos.filter((r) => r.id !== id)
    setRiesgos(nuevos)
    actualizarSRS({ id: srs.id, data: { riesgosSRS: nuevos } })
  }

  return (
    <div className="space-y-4">
      {altaAlerta >= 3 && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/10 dark:border-red-900/30">
          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-red-800 dark:text-red-300">
            <strong>Alerta:</strong> {altaAlerta} riesgos con probabilidad alta/muy alta antes del Gate 1. Considera registrar en M2-03 y revisar la factibilidad.
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Nuevo riesgo
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <FormField label="Descripción del riesgo *" error={errors.descripcion?.message}>
                <Textarea {...register('descripcion')} placeholder="Describe el riesgo del proceso IR" rows={2} />
              </FormField>
              <div className="grid grid-cols-3 gap-3">
                <FormField label="Tipo" error={errors.tipo?.message}>
                  <Select {...register('tipo')}>
                    {(Object.entries(RIESGO_TIPO_LABELS) as [RiesgoSRS['tipo'], string][]).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Probabilidad" error={errors.probabilidad?.message}>
                  <Select {...register('probabilidad')}>
                    <option value="muy_baja">Muy baja</option>
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="muy_alta">Muy alta</option>
                  </Select>
                </FormField>
                <FormField label="Impacto" error={errors.impacto?.message}>
                  <Select {...register('impacto')}>
                    <option value="muy_bajo">Muy bajo</option>
                    <option value="bajo">Bajo</option>
                    <option value="medio">Medio</option>
                    <option value="alto">Alto</option>
                    <option value="muy_alto">Muy alto</option>
                  </Select>
                </FormField>
              </div>
              <FormField label="Mitigación">
                <Input {...register('mitigacion')} placeholder="Estrategia de mitigación propuesta" />
              </FormField>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('registradoEnM203')} className="rounded" />
                <span className="text-sm">Registrar también en M2-03 (Riesgos del Proyecto)</span>
              </label>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => { reset(); setShowForm(false) }}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" disabled={isPending}>Guardar riesgo</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {riesgos.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <ShieldAlert className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Sin riesgos registrados para el proceso IR.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {riesgos.map((r) => {
            const esAlto = r.probabilidad === 'alta' || r.probabilidad === 'muy_alta'
            return (
              <div key={r.id} className={`flex items-start gap-3 p-3 rounded-lg border ${esAlto ? 'border-red-200 bg-red-50/50 dark:bg-red-900/10' : 'bg-card'}`}>
                <ShieldAlert className={`h-4 w-4 mt-0.5 flex-shrink-0 ${esAlto ? 'text-red-500' : 'text-muted-foreground'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{r.descripcion}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{RIESGO_TIPO_LABELS[r.tipo]}</Badge>
                    <span className="text-xs text-muted-foreground">P: {r.probabilidad} · I: {r.impacto}</span>
                    {r.registradoEnM203 && <Badge variant="outline" className="text-xs">M2-03</Badge>}
                  </div>
                  {r.mitigacion && <p className="text-xs text-muted-foreground mt-1">Mitigación: {r.mitigacion}</p>}
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeRiesgo(r.id)}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------
// SUB-COMPONENTE: GATE 1
// -------------------------------------------------------

function Gate1Panel({ srs, proyectoId, onGo }: { srs: SRS; proyectoId: string; onGo: () => void }) {
  const { mutate: procesarGate1, isPending } = useProcesarGate1()
  const [decisionPor, setDecisionPor] = useState('')
  const [motivoCancelacion, setMotivoCancelacion] = useState('')
  const [alternativas, setAlternativas] = useState('')
  const [firmaCancelacion, setFirmaCancelacion] = useState('')

  const factibilidad = srs.factibilidad
  const globalResult = factibilidad?.global ?? 'viable'

  const canGo = !!factibilidad && !!decisionPor && globalResult !== 'no_viable'
  const canNoGo = !!factibilidad && !!motivoCancelacion && !!firmaCancelacion

  const handleGo = () => {
    if (!factibilidad || !decisionPor) return
    procesarGate1({
      srsId: srs.id,
      proyectoId,
      decision: 'go' as EstadoGate1,
      factibilidad,
      decisionPor,
    }, { onSuccess: onGo })
  }

  const handleNoGo = () => {
    if (!factibilidad) return
    procesarGate1({
      srsId: srs.id,
      proyectoId,
      decision: 'nogo' as EstadoGate1,
      factibilidad: {
        ...factibilidad,
        motivoCancelacion,
        alternativasConsideradas: alternativas,
        firmaCancelacion,
      },
      decisionPor: firmaCancelacion,
    })
  }

  const gateColor = globalResult === 'viable' ? 'green' : globalResult === 'viable_con_restricciones' ? 'yellow' : 'red'

  return (
    <div className="space-y-5">
      {/* Estado Gate 1 */}
      {srs.gate1Estado && srs.gate1Estado !== 'pendiente' && (
        <div className={`flex items-center gap-3 p-4 rounded-lg border ${srs.gate1Estado === 'go' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          {srs.gate1Estado === 'go'
            ? <CheckCircle2 className="h-5 w-5 text-green-600" />
            : <XCircle className="h-5 w-5 text-red-600" />}
          <div>
            <p className="font-semibold">Gate 1: {srs.gate1Estado === 'go' ? 'GO ✓' : 'NO-GO ✗'}</p>
            <p className="text-xs text-muted-foreground">
              Decisión tomada por: {srs.gate1DecisionPor} · {srs.gate1FechaDecision ? new Date(srs.gate1FechaDecision).toLocaleDateString('es-CL') : ''}
            </p>
          </div>
        </div>
      )}

      {/* Resumen factibilidad */}
      {factibilidad ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Resumen de Factibilidad (F1-04)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2">
            {(['negocio', 'tecnica', 'integracion'] as const).map((dim) => (
              <div key={dim} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground capitalize">{dim === 'negocio' ? 'Negocio' : dim === 'tecnica' ? 'Técnica' : 'Integración'}</span>
                <Badge variant="outline" className={
                  factibilidad[dim].resultado === 'viable' ? 'bg-green-50 text-green-700 border-green-200' :
                  factibilidad[dim].resultado === 'viable_con_restricciones' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  'bg-red-50 text-red-700 border-red-200'
                }>
                  {FACTIBILIDAD_LABELS[factibilidad[dim].resultado]}
                </Badge>
              </div>
            ))}
            <div className="pt-2 border-t flex items-center justify-between text-sm font-semibold">
              <span>Global</span>
              <Badge variant="outline" className={
                globalResult === 'viable' ? 'bg-green-50 text-green-700 border-green-200' :
                globalResult === 'viable_con_restricciones' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                'bg-red-50 text-red-700 border-red-200'
              }>
                {FACTIBILIDAD_LABELS[globalResult]}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
          <p className="text-sm text-amber-800">Completa el Estudio de Factibilidad (F1-04) antes de tomar la decisión de Gate 1.</p>
        </div>
      )}

      {/* Solo si gate no tomado aún */}
      {(!srs.gate1Estado || srs.gate1Estado === 'pendiente') && factibilidad && (
        <>
          <FormField label="Decisión tomada por *">
            <Input
              value={decisionPor}
              onChange={(e) => setDecisionPor(e.target.value)}
              placeholder="Nombre del decisor (PM, sponsor...)"
            />
          </FormField>

          {globalResult === 'no_viable' && (
            <Card className="border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-red-700">Campos requeridos para No-Go</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <FormField label="Motivo de cancelación *">
                  <Textarea value={motivoCancelacion} onChange={(e) => setMotivoCancelacion(e.target.value)} placeholder="Describe el motivo de la cancelación del SRS" rows={2} />
                </FormField>
                <FormField label="Alternativas consideradas">
                  <Textarea value={alternativas} onChange={(e) => setAlternativas(e.target.value)} placeholder="¿Qué alternativas se evaluaron?" rows={2} />
                </FormField>
                <FormField label="Firma del decisor *">
                  <Input value={firmaCancelacion} onChange={(e) => setFirmaCancelacion(e.target.value)} placeholder="Nombre completo del responsable" />
                </FormField>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3 pt-2">
            {globalResult !== 'no_viable' && (
              <Button
                onClick={handleGo}
                disabled={!canGo || isPending}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {isPending ? 'Procesando...' : 'Gate 1: GO → Avanzar a Fase 2'}
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={handleNoGo}
              disabled={!canNoGo || isPending}
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-2" />
              {isPending ? 'Procesando...' : 'Gate 1: NO-GO → Cancelar SRS'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL: Fase1Panel
// -------------------------------------------------------

interface Fase1Props {
  srs: SRS
  proyecto: Proyecto
  onAdvance: () => void
}

export function Fase1Panel({ srs, proyecto, onAdvance }: Fase1Props) {
  const [tab, setTab] = useState<Tab1>('F1-01')

  return (
    <div className="space-y-4">
      {/* Header fase */}
      <div>
        <h2 className="text-lg font-semibold">Fase 1 — Inicio y Definición del Negocio</h2>
        <p className="text-sm text-muted-foreground">
          Establece el marco fundacional del SRS: problema, stakeholders, factibilidad y Gate 1.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 text-xs font-medium rounded-t-md transition-colors border-b-2 -mb-px
              ${tab === t.id
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground'
              }
              ${t.id === 'GATE1' ? 'ml-auto' : ''}
            `}
          >
            <span>{t.label}</span>
            <span className="block text-xs font-normal">{t.sublabel}</span>
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className="min-h-[400px]">
        {tab === 'F1-01' && <F101 srs={srs} proyectoId={proyecto.id} />}
        {tab === 'F1-02' && <F102 srs={srs} proyectoId={proyecto.id} />}
        {tab === 'F1-03' && <F103 srs={srs} proyecto={proyecto} />}
        {tab === 'F1-04' && <F104 srs={srs} />}
        {tab === 'F1-05' && <F105 srs={srs} />}
        {tab === 'GATE1' && (
          <Gate1Panel srs={srs} proyectoId={proyecto.id} onGo={onAdvance} />
        )}
      </div>
    </div>
  )
}
