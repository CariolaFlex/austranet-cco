'use client'

// ============================================================
// COMPONENTE: Fase2Panel — Descubrimiento y Adquisición
// Fuente: M3-02-tecnicas-recopilacion.md (íntegro)
// Tareas: F2-01 | F2-02 | F2-03 | F2-04 | F2-05
// ============================================================

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Plus, Trash2, Save, Users, MessageSquare,
  FileText, BarChart2, AlertTriangle, ChevronDown, ChevronUp, ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib'
import { Input, Textarea, FormField, Select } from '@/components/ui/input'
import {
  useActualizarSRS,
  useSesionesEntrevista, useCrearSesionEntrevista,
  useEscenarios, useCrearEscenario,
  useRequerimientos, useCrearRequerimiento, useActualizarRequerimiento,
} from '@/hooks/useAlcance'
import { TECNICAS_ADQUISICION_CONFIG, REGLAS_MOSCOW } from '@/constants/alcance'
import type { Proyecto, SRS, TecnicaAdquisicion, PrioridadRequerimiento } from '@/types'

// -------------------------------------------------------
// TABS
// -------------------------------------------------------

type Tab2 = 'F2-01' | 'F2-02' | 'F2-03' | 'F2-04' | 'F2-05'

const TABS: { id: Tab2; label: string; sublabel: string }[] = [
  { id: 'F2-01', label: 'F2-01', sublabel: 'Técnicas' },
  { id: 'F2-02', label: 'F2-02', sublabel: 'Entrevistas' },
  { id: 'F2-03', label: 'F2-03', sublabel: 'Escenarios' },
  { id: 'F2-04', label: 'F2-04', sublabel: 'Análisis Org.' },
  { id: 'F2-05', label: 'F2-05', sublabel: 'MoSCoW' },
]

// -------------------------------------------------------
// SUB-COMPONENTE: F2-01 Técnicas de Adquisición
// -------------------------------------------------------

function F201({ srs }: { srs: SRS }) {
  const { mutate: actualizarSRS, isPending } = useActualizarSRS()
  const [tecnicasActivas, setTecnicasActivas] = useState<TecnicaAdquisicion[]>(
    srs.tecnicasActivas ?? []
  )

  const toggleTecnica = (t: TecnicaAdquisicion) => {
    setTecnicasActivas((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    )
  }

  const soloSinTacito = tecnicasActivas.length > 0 &&
    tecnicasActivas.every((t) => !TECNICAS_ADQUISICION_CONFIG[t].descubreConocimientoTacito)

  const handleSave = () => {
    actualizarSRS({ id: srs.id, data: { tecnicasActivas } })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Selecciona las técnicas activas para la Fase 2. Cada técnica habilitará su formulario de registro.
      </p>

      {soloSinTacito && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800">
            <strong>Bloqueo M3-F2-01:</strong> Solo entrevistas cerradas no descubren conocimiento tácito. Agrega al menos una técnica alternativa.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2">
        {(Object.entries(TECNICAS_ADQUISICION_CONFIG) as [TecnicaAdquisicion, typeof TECNICAS_ADQUISICION_CONFIG[TecnicaAdquisicion]][]).map(([key, config]) => {
          const activa = tecnicasActivas.includes(key)
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleTecnica(key)}
              className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-colors
                ${activa ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/40'}`}
            >
              <div className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5
                ${activa ? 'bg-primary border-primary' : 'border-muted-foreground/40'}`} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{config.label}</span>
                  {!config.descubreConocimientoTacito && (
                    <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">Solo explícito</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{config.descripcion}</p>
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isPending || soloSinTacito}>
          <Save className="h-4 w-4 mr-2" />
          {isPending ? 'Guardando...' : 'Guardar técnicas'}
        </Button>
      </div>
    </div>
  )
}

// -------------------------------------------------------
// SUB-COMPONENTE: F2-02 Sesiones de Entrevista
// -------------------------------------------------------

const sesionSchema = z.object({
  fecha: z.string().min(1, 'Fecha requerida'),
  entrevistadoNombre: z.string().min(2, 'Nombre requerido'),
  entrevistadoId: z.string().min(1, 'ID del stakeholder requerido'),
  entrevistador: z.string().min(2, 'Entrevistador requerido'),
  objetivos: z.string().min(10, 'Describe los objetivos'),
  duracionMin: z.coerce.number().min(15, 'Mínimo 15 min'),
  modalidad: z.enum(['presencial', 'virtual', 'hibrido']),
  tipoEntrevista: z.enum(['abierta', 'cerrada', 'mixta']),
  conflictosDetectados: z.string(),
  observaciones: z.string().optional(),
})

type SesionForm = z.infer<typeof sesionSchema>

function F202({ srs, proyectoId }: { srs: SRS; proyectoId: string }) {
  const { data: sesiones = [], isLoading } = useSesionesEntrevista(srs.id)
  const { mutate: crearSesion, isPending } = useCrearSesionEntrevista()
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SesionForm>({
    resolver: zodResolver(sesionSchema),
    defaultValues: {
      modalidad: 'virtual',
      tipoEntrevista: 'mixta',
      conflictosDetectados: '',
      duracionMin: 60,
    },
  })

  const onSubmit = (data: SesionForm) => {
    crearSesion(
      {
        srsId: srs.id,
        proyectoId,
        entrevistaId: '',
        fecha: new Date(data.fecha),
        entrevistadoId: data.entrevistadoId,
        entrevistadoNombre: data.entrevistadoNombre,
        entrevistador: data.entrevistador,
        objetivos: data.objetivos,
        duracionMin: data.duracionMin,
        modalidad: data.modalidad,
        tipoEntrevista: data.tipoEntrevista,
        reqsEmergentes: [],
        terminosGlosario: [],
        conflictosDetectados: data.conflictosDetectados,
        observaciones: data.observaciones,
        creadoPor: '',
      },
      { onSuccess: () => { reset(); setShowForm(false) } }
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Registro de sesiones de entrevista. Template completo M3-02 §4.5.
        </p>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Nueva sesión
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Fecha *" error={errors.fecha?.message}>
                  <Input type="date" {...register('fecha')} />
                </FormField>
                <FormField label="Duración (min) *" error={errors.duracionMin?.message}>
                  <Input type="number" {...register('duracionMin')} />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Entrevistado — ID Stakeholder *" error={errors.entrevistadoId?.message}>
                  <Input {...register('entrevistadoId')} placeholder="ID del stakeholder M1-01" />
                </FormField>
                <FormField label="Nombre del entrevistado *" error={errors.entrevistadoNombre?.message}>
                  <Input {...register('entrevistadoNombre')} placeholder="Nombre completo" />
                </FormField>
              </div>
              <FormField label="Entrevistador *" error={errors.entrevistador?.message}>
                <Input {...register('entrevistador')} placeholder="Nombre del analista" />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Modalidad" error={errors.modalidad?.message}>
                  <Select {...register('modalidad')}>
                    <option value="presencial">Presencial</option>
                    <option value="virtual">Virtual</option>
                    <option value="hibrido">Híbrido</option>
                  </Select>
                </FormField>
                <FormField label="Tipo de entrevista" error={errors.tipoEntrevista?.message}>
                  <Select {...register('tipoEntrevista')}>
                    <option value="abierta">Abierta (descubre tácito)</option>
                    <option value="cerrada">Cerrada (confirma supuestos)</option>
                    <option value="mixta">Mixta (recomendada)</option>
                  </Select>
                </FormField>
              </div>
              <FormField label="Objetivos *" error={errors.objetivos?.message}>
                <Textarea {...register('objetivos')} placeholder="¿Qué se busca descubrir en esta sesión?" rows={2} />
              </FormField>
              <FormField label="Conflictos detectados">
                <Textarea {...register('conflictosDetectados')} placeholder="Conflictos entre stakeholders identificados (si aplica)" rows={2} />
              </FormField>
              <FormField label="Observaciones">
                <Textarea {...register('observaciones')} placeholder="Notas adicionales" rows={1} />
              </FormField>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => { reset(); setShowForm(false) }}>Cancelar</Button>
                <Button type="submit" size="sm" disabled={isPending}>
                  {isPending ? 'Guardando...' : 'Guardar sesión'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-6 text-sm text-muted-foreground">Cargando sesiones...</div>
      ) : sesiones.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Sin sesiones registradas.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sesiones.map((s) => (
            <div key={s.id} className="border rounded-lg bg-card overflow-hidden">
              <button
                type="button"
                onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs font-mono">{s.entrevistaId || 'ENT-?'}</Badge>
                  <span className="font-medium text-sm">{s.entrevistadoNombre}</span>
                  <Badge variant="outline" className="text-xs">{s.tipoEntrevista}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(s.fecha).toLocaleDateString('es-CL')}</span>
                </div>
                {expanded === s.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {expanded === s.id && (
                <div className="px-4 pb-4 space-y-2 text-sm border-t">
                  <div className="grid grid-cols-3 gap-2 pt-3">
                    <div><span className="text-xs text-muted-foreground">Entrevistador</span><p>{s.entrevistador}</p></div>
                    <div><span className="text-xs text-muted-foreground">Duración</span><p>{s.duracionMin} min</p></div>
                    <div><span className="text-xs text-muted-foreground">Modalidad</span><p>{s.modalidad}</p></div>
                  </div>
                  <div><span className="text-xs text-muted-foreground">Objetivos</span><p className="text-sm">{s.objetivos}</p></div>
                  {s.conflictosDetectados && (
                    <div className="flex items-start gap-2 p-2 rounded bg-amber-50 border border-amber-200">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5" />
                      <div>
                        <span className="text-xs font-medium text-amber-800">Conflictos detectados:</span>
                        <p className="text-xs text-amber-700">{s.conflictosDetectados}</p>
                      </div>
                    </div>
                  )}
                  {s.reqsEmergentes.length > 0 && (
                    <div>
                      <span className="text-xs text-muted-foreground">Reqs emergentes: </span>
                      <span className="text-xs">{s.reqsEmergentes.join(', ')}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------
// SUB-COMPONENTE: F2-03 Escenarios / Historias de Usuario
// -------------------------------------------------------

const escenarioSchema = z.object({
  titulo: z.string().min(5, 'Título requerido'),
  actorNombre: z.string().min(2, 'Actor requerido'),
  actorPrincipal: z.string().min(1, 'ID stakeholder requerido'),
  situacionInicial: z.string().min(10, 'Describe la situación inicial'),
  flujoNormal: z.array(z.string().min(3, 'Paso requerido')).min(2, 'Mínimo 2 pasos'),
  esBaseParaCasoDeUso: z.boolean(),
})

type EscenarioForm = z.infer<typeof escenarioSchema>

function F203({ srs, proyectoId }: { srs: SRS; proyectoId: string }) {
  const { data: escenarios = [], isLoading } = useEscenarios(srs.id)
  const { mutate: crearEscenario, isPending } = useCrearEscenario()
  const [showForm, setShowForm] = useState(false)

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<EscenarioForm>({
    resolver: zodResolver(escenarioSchema),
    defaultValues: { flujoNormal: ['', ''], esBaseParaCasoDeUso: false },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'flujoNormal' as never })

  const onSubmit = (data: EscenarioForm) => {
    crearEscenario(
      {
        srsId: srs.id,
        proyectoId,
        escenarioId: '',
        titulo: data.titulo,
        actorPrincipal: data.actorPrincipal,
        actorNombre: data.actorNombre,
        situacionInicial: data.situacionInicial,
        flujoNormal: data.flujoNormal.filter(Boolean),
        esBaseParaCasoDeUso: data.esBaseParaCasoDeUso,
        requerimientosGenerados: [],
        creadoPor: '',
      },
      { onSuccess: () => { reset(); setShowForm(false) } }
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Narrativas de interacción. Los marcados como base para Caso de Uso serán disponibles en Fase 4.
        </p>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Nuevo escenario
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <FormField label="Título del escenario *" error={errors.titulo?.message}>
                <Input {...register('titulo')} placeholder="Ej: Registro de nuevo usuario" />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Actor — ID Stakeholder *" error={errors.actorPrincipal?.message}>
                  <Input {...register('actorPrincipal')} placeholder="ID stakeholder M1-01" />
                </FormField>
                <FormField label="Nombre del actor *" error={errors.actorNombre?.message}>
                  <Input {...register('actorNombre')} placeholder="Nombre del actor/usuario" />
                </FormField>
              </div>
              <FormField label="Situación inicial *" error={errors.situacionInicial?.message}>
                <Textarea {...register('situacionInicial')} placeholder="Contexto y condición de inicio del escenario" rows={2} />
              </FormField>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Flujo normal (pasos) *</label>
                  <Button type="button" variant="outline" size="sm" onClick={() => append('')}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Paso
                  </Button>
                </div>
                {errors.flujoNormal && (
                  <p className="text-xs text-destructive mb-1">
                    {Array.isArray(errors.flujoNormal)
                      ? errors.flujoNormal.find((e) => e)?.message
                      : (errors.flujoNormal as { message?: string })?.message}
                  </p>
                )}
                <div className="space-y-2">
                  {fields.map((field, i) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                      <Input {...register(`flujoNormal.${i}`)} placeholder={`Paso ${i + 1}`} className="flex-1" />
                      {fields.length > 2 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => remove(i)}>
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('esBaseParaCasoDeUso')} className="rounded" />
                <span className="text-sm">Base para Caso de Uso (Fase 4)</span>
              </label>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => { reset(); setShowForm(false) }}>Cancelar</Button>
                <Button type="submit" size="sm" disabled={isPending}>
                  {isPending ? 'Guardando...' : 'Guardar escenario'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-6 text-sm text-muted-foreground">Cargando escenarios...</div>
      ) : escenarios.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Sin escenarios registrados.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {escenarios.map((e) => (
            <div key={e.id} className="p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-mono">{e.escenarioId || 'ESC-?'}</Badge>
                <span className="font-medium text-sm">{e.titulo}</span>
                {e.esBaseParaCasoDeUso && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">Base CU</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Actor: {e.actorNombre}</p>
              <p className="text-xs text-muted-foreground">{e.flujoNormal.length} pasos documentados</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------
// SUB-COMPONENTE: F2-04 Análisis Organizacional
// -------------------------------------------------------

function F204({ srs }: { srs: SRS }) {
  const { mutate: actualizarSRS, isPending } = useActualizarSRS()
  const { mutate: crearReq } = useCrearRequerimiento()
  const [analisis, setAnalisis] = useState(srs.analisisOrganizacional ?? {
    estructuraDecisiones: '',
    dependenciasSistemas: '',
    resistenciasOrganizacionales: '',
    factoresPoliticos: '',
    conflictosOrganizacionales: '',
  })

  const handleSave = () => {
    actualizarSRS({ id: srs.id, data: { analisisOrganizacional: analisis } })
  }

  const generarRNFProceso = () => {
    if (!analisis.resistenciasOrganizacionales && !analisis.factoresPoliticos) return
    const desc = [
      analisis.resistenciasOrganizacionales && `Resistencia organizacional: ${analisis.resistenciasOrganizacionales}`,
      analisis.factoresPoliticos && `Factores políticos: ${analisis.factoresPoliticos}`,
    ].filter(Boolean).join('. ')

    crearReq({
      srsId: srs.id,
      proyectoId: srs.proyectoId,
      codigo: '',
      tipo: 'no_funcional',
      prioridad: 'should',
      titulo: 'RNF Proceso — Restricciones organizacionales',
      descripcion: `DEBE considerar las siguientes restricciones organizacionales: ${desc}`,
      fuente: 'analisis_organizacional',
      estado: 'propuesto',
      version: 1,
      categoria: 'proceso',
      metricas: {
        metricaObjetivo: 'Cumplimiento documentado de restricciones',
        metodMedicion: 'Revisión en auditoría de proceso',
      },
    })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Hallazgos sociotécnicos del análisis organizacional. Los conflictos generan ítems en M2-03.
      </p>

      <div className="space-y-3">
        <FormField label="Estructura de decisiones">
          <Textarea
            value={analisis.estructuraDecisiones ?? ''}
            onChange={(e) => setAnalisis({ ...analisis, estructuraDecisiones: e.target.value })}
            placeholder="¿Quién decide qué en la organización del cliente?"
            rows={2}
          />
        </FormField>
        <FormField label="Dependencias de sistemas">
          <Textarea
            value={analisis.dependenciasSistemas ?? ''}
            onChange={(e) => setAnalisis({ ...analisis, dependenciasSistemas: e.target.value })}
            placeholder="¿Qué sistemas condicionan el proyecto?"
            rows={2}
          />
        </FormField>
        <FormField label="Resistencias organizacionales">
          <Textarea
            value={analisis.resistenciasOrganizacionales ?? ''}
            onChange={(e) => setAnalisis({ ...analisis, resistenciasOrganizacionales: e.target.value })}
            placeholder="Áreas o personas resistentes al cambio"
            rows={2}
          />
        </FormField>
        <FormField label="Factores políticos">
          <Textarea
            value={analisis.factoresPoliticos ?? ''}
            onChange={(e) => setAnalisis({ ...analisis, factoresPoliticos: e.target.value })}
            placeholder="Dinámicas de poder que afectan el proyecto"
            rows={2}
          />
        </FormField>
        <FormField label="Conflictos organizacionales">
          <Textarea
            value={analisis.conflictosOrganizacionales ?? ''}
            onChange={(e) => setAnalisis({ ...analisis, conflictosOrganizacionales: e.target.value })}
            placeholder="Conflictos internos del cliente relevantes al proyecto"
            rows={2}
          />
        </FormField>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={generarRNFProceso} size="sm">
          Generar RNF de Proceso
        </Button>
        <Button onClick={handleSave} disabled={isPending}>
          <Save className="h-4 w-4 mr-2" />
          {isPending ? 'Guardando...' : 'Guardar Análisis'}
        </Button>
      </div>
    </div>
  )
}

// -------------------------------------------------------
// SUB-COMPONENTE: F2-05 Clasificación MoSCoW
// -------------------------------------------------------

const PRIORIDAD_CONFIG: Record<PrioridadRequerimiento, { label: string; color: string; bg: string }> = {
  must:   { label: 'Must Have',    color: 'text-red-700',    bg: 'bg-red-50 border-red-200' },
  should: { label: 'Should Have',  color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
  could:  { label: 'Could Have',   color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200' },
  wont:   { label: "Won't Have",   color: 'text-gray-700',   bg: 'bg-gray-50 border-gray-200' },
}

function F205({ srs, proyectoId }: { srs: SRS; proyectoId: string }) {
  const { data: reqs = [], isLoading } = useRequerimientos(srs.id)
  const { mutate: actualizarReq } = useActualizarRequerimiento()
  const { mutate: actualizarSRS } = useActualizarSRS()
  const [wontDialogId, setWontDialogId] = useState<string | null>(null)
  const [wontJustif, setWontJustif] = useState('')
  const [wontVersion, setWontVersion] = useState('v2.0')

  const propuestos = reqs.filter((r) => r.estado === 'propuesto')

  const totalReqs = propuestos.length
  const mustCount = propuestos.filter((r) => r.prioridad === 'must').length
  const couldCount = propuestos.filter((r) => r.prioridad === 'could').length
  const wontCount = propuestos.filter((r) => r.prioridad === 'wont').length

  const mustPct = totalReqs > 0 ? Math.round((mustCount / totalReqs) * 100) : 0
  const couldPct = totalReqs > 0 ? Math.round((couldCount / totalReqs) * 100) : 0

  const mustAlert = mustPct < REGLAS_MOSCOW.mustMinPorcentaje
  const couldAlert = couldPct > REGLAS_MOSCOW.couldMaxPorcentaje

  const changePriority = (reqId: string, srsId: string, prioridad: PrioridadRequerimiento) => {
    if (prioridad === 'wont') {
      setWontDialogId(reqId)
      return
    }
    actualizarReq({ id: reqId, srsId, data: { prioridad } })
  }

  const confirmWont = () => {
    if (!wontDialogId || !wontJustif) return
    const req = reqs.find((r) => r.id === wontDialogId)
    if (!req) return
    actualizarReq({
      id: wontDialogId,
      srsId: srs.id,
      data: {
        prioridad: 'wont',
        justificacionWont: wontJustif,
        versionObjetivo: wontVersion,
      },
    })
    setWontDialogId(null)
    setWontJustif('')
  }

  const saveMoSCoW = () => {
    const total = mustCount + couldCount + wontCount + propuestos.filter((r) => r.prioridad === 'should').length
    if (total === 0) return
    actualizarSRS({
      id: srs.id,
      data: {
        distribucionMoSCoW: {
          must: Math.round((mustCount / total) * 100),
          should: Math.round((propuestos.filter((r) => r.prioridad === 'should').length / total) * 100),
          could: Math.round((couldCount / total) * 100),
          wont: Math.round((wontCount / total) * 100),
        },
      },
    })
  }

  return (
    <div className="space-y-4">
      {/* KPIs MoSCoW */}
      <div className="grid grid-cols-4 gap-2">
        {(['must', 'should', 'could', 'wont'] as PrioridadRequerimiento[]).map((p) => {
          const count = propuestos.filter((r) => r.prioridad === p).length
          const pct = totalReqs > 0 ? Math.round((count / totalReqs) * 100) : 0
          const cfg = PRIORIDAD_CONFIG[p]
          return (
            <Card key={p} className={`border ${cfg.bg}`}>
              <CardContent className="p-3 text-center">
                <p className={`text-2xl font-bold ${cfg.color}`}>{count}</p>
                <p className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</p>
                <p className="text-xs text-muted-foreground">{pct}%</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Alertas MoSCoW */}
      {mustAlert && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
          <p className="text-xs text-amber-800">
            <strong>Alerta MoSCoW:</strong> Must Have ({mustPct}%) está por debajo del mínimo ({REGLAS_MOSCOW.mustMinPorcentaje}%). Revisa la priorización.
          </p>
        </div>
      )}
      {couldAlert && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
          <p className="text-xs text-amber-800">
            <strong>Alerta MoSCoW:</strong> Could Have ({couldPct}%) supera el máximo ({REGLAS_MOSCOW.couldMaxPorcentaje}%). Revisa la priorización.
          </p>
        </div>
      )}

      {/* Won't dialog */}
      {wontDialogId && (
        <Card className="border-gray-300">
          <CardContent className="p-4 space-y-3">
            <p className="font-medium text-sm">Registrar como Won&apos;t Have</p>
            <FormField label="Justificación *">
              <Textarea
                value={wontJustif}
                onChange={(e) => setWontJustif(e.target.value)}
                placeholder="¿Por qué no se incluye en esta versión?"
                rows={2}
              />
            </FormField>
            <FormField label="Versión objetivo">
              <Input value={wontVersion} onChange={(e) => setWontVersion(e.target.value)} placeholder="v2.0" />
            </FormField>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setWontDialogId(null)}>Cancelar</Button>
              <Button size="sm" disabled={!wontJustif} onClick={confirmWont}>Confirmar Won&apos;t</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de requerimientos */}
      {isLoading ? (
        <div className="text-center py-6 text-sm text-muted-foreground">Cargando requerimientos...</div>
      ) : propuestos.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <BarChart2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Sin requerimientos propuestos. Agrega desde F2-02 o F2-03.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {propuestos.map((req) => {
            const cfg = PRIORIDAD_CONFIG[req.prioridad]
            return (
              <div key={req.id} className={`flex items-start gap-3 p-3 rounded-lg border ${cfg.bg}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono">{req.codigo || '???'}</Badge>
                    <span className="font-medium text-sm truncate">{req.titulo}</span>
                    <Badge variant="outline" className="text-xs">{req.tipo}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{req.descripcion}</p>
                </div>
                <Select
                  value={req.prioridad}
                  onChange={(e) => changePriority(req.id, srs.id, e.target.value as PrioridadRequerimiento)}
                  className="w-36 flex-shrink-0"
                >
                  <option value="must">Must Have</option>
                  <option value="should">Should Have</option>
                  <option value="could">Could Have</option>
                  <option value="wont">Won&apos;t Have</option>
                </Select>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button onClick={saveMoSCoW} size="sm">
          <Save className="h-3.5 w-3.5 mr-1" /> Guardar distribución MoSCoW
        </Button>
      </div>
    </div>
  )
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL: Fase2Panel
// -------------------------------------------------------

interface Fase2Props {
  srs: SRS
  proyecto: Proyecto
  onAdvance: () => void
}

export function Fase2Panel({ srs, proyecto, onAdvance }: Fase2Props) {
  const [tab, setTab] = useState<Tab2>('F2-01')

  if (srs.estado === 'no_iniciado' || srs.estado === 'cancelado') {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <AlertTriangle className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground text-center">
          {srs.estado === 'cancelado'
            ? 'El SRS fue cancelado en Gate 1.'
            : 'Completa Gate 1 para habilitar la Fase 2.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Fase 2 — Descubrimiento y Adquisición</h2>
        <p className="text-sm text-muted-foreground">
          Técnicas de adquisición, entrevistas, escenarios y clasificación MoSCoW.
        </p>
      </div>

      <div className="flex gap-1 border-b">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 text-xs font-medium rounded-t-md transition-colors border-b-2 -mb-px
              ${tab === t.id ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            <span>{t.label}</span>
            <span className="block text-xs font-normal">{t.sublabel}</span>
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {tab === 'F2-01' && <F201 srs={srs} />}
        {tab === 'F2-02' && <F202 srs={srs} proyectoId={proyecto.id} />}
        {tab === 'F2-03' && <F203 srs={srs} proyectoId={proyecto.id} />}
        {tab === 'F2-04' && <F204 srs={srs} />}
        {tab === 'F2-05' && <F205 srs={srs} proyectoId={proyecto.id} />}
      </div>

      {/* Avanzar a Fase 3 */}
      <div className="flex justify-end pt-2 border-t">
        <Button variant="outline" onClick={onAdvance}>
          Avanzar a Fase 3 — Prototipado <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
