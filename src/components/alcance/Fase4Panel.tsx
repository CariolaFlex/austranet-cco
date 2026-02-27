'use client'

// ============================================================
// COMPONENTE: Fase4Panel — Análisis y Modelado del Sistema ⟳
// Fuente: M3-03-modelado-requerimientos.md (íntegro)
// Tareas: F4-01 | F4-02 | F4-03 | F4-04 | F4-05
// ============================================================

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Plus, Trash2, Save, ChevronRight, AlertTriangle,
  LayoutList, RefreshCw, ExternalLink, CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib'
import { Input, Textarea, FormField, Select } from '@/components/ui/input'
import {
  useActualizarSRS, useAgregarArtefactoModelo,
  useRegistrarIteracionBucle, useRequerimientos, useCrearRequerimiento,
} from '@/hooks/useAlcance'
import { TIPOS_ARTEFACTO_MODELO_CONFIG } from '@/constants/alcance'
import type {
  Proyecto, SRS, TipoArtefactoModelo, ArtefactoModelo, Subsistema,
} from '@/types'

// -------------------------------------------------------
// SCHEMAS
// -------------------------------------------------------

const artefactoSchema = z.object({
  nombre: z.string().min(3, 'Nombre requerido'),
  tipo: z.enum([
    'modelo_contexto', 'caso_de_uso', 'bpmn', 'diagrama_actividad',
    'diagrama_secuencia', 'diagrama_clase', 'diagrama_estado', 'diagrama_proceso',
  ]),
  url: z.string().url('URL válida requerida'),
  herramienta: z.string().min(2, 'Herramienta requerida'),
  descripcion: z.string().optional(),
  sistemasExternosIdentificados: z.string().optional(), // comma-separated
  actoresIdentificados: z.string().optional(),
  casosDeUsoListados: z.string().optional(),
  casosDeUsoHuerfanos: z.string().optional(),
  procesosModelados: z.string().optional(),
})

type ArtefactoForm = z.infer<typeof artefactoSchema>

const subsistemaSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  responsabilidad: z.string().min(5, 'Responsabilidad requerida'),
  tecnologia: z.string().min(2, 'Tecnología requerida'),
})

// -------------------------------------------------------
// SUB-COMPONENTE: F4-01, F4-02, F4-03 — Artefactos de Modelo
// -------------------------------------------------------

function F4Artefactos({ srs, proyectoId, tipo }: { srs: SRS; proyectoId: string; tipo: TipoArtefactoModelo | 'all' }) {
  const { mutate: agregarArtefacto, isPending } = useAgregarArtefactoModelo()
  const { mutate: actualizarSRS } = useActualizarSRS()
  const { mutate: crearReq } = useCrearRequerimiento()
  const [showForm, setShowForm] = useState(false)

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ArtefactoForm>({
    resolver: zodResolver(artefactoSchema),
    defaultValues: { tipo: tipo !== 'all' ? tipo : 'modelo_contexto' },
  })

  const watchedTipo = watch('tipo') as TipoArtefactoModelo
  const tipoConfig = TIPOS_ARTEFACTO_MODELO_CONFIG[watchedTipo]

  const artefactos = (srs.artefactosModelo ?? []).filter((a) =>
    tipo === 'all' ? true : a.tipo === tipo
  )

  const hasContexto = (srs.artefactosModelo ?? []).some((a) => a.tipo === 'modelo_contexto')
  const needsContextoAlert = !hasContexto && tipo === 'all'

  const onSubmit = (data: ArtefactoForm) => {
    const sistemasExternos = data.sistemasExternosIdentificados
      ? data.sistemasExternosIdentificados.split(',').map((s) => s.trim()).filter(Boolean)
      : []
    const actores = data.actoresIdentificados
      ? data.actoresIdentificados.split(',').map((s) => s.trim()).filter(Boolean)
      : []
    const casosDeUso = data.casosDeUsoListados
      ? data.casosDeUsoListados.split(',').map((s) => s.trim()).filter(Boolean)
      : []
    const huerfanos = data.casosDeUsoHuerfanos
      ? data.casosDeUsoHuerfanos.split(',').map((s) => s.trim()).filter(Boolean)
      : []
    const procesos = data.procesosModelados
      ? data.procesosModelados.split(',').map((s) => s.trim()).filter(Boolean)
      : []

    agregarArtefacto(
      {
        srsId: srs.id,
        proyectoId,
        data: {
          nombre: data.nombre,
          tipo: data.tipo,
          url: data.url,
          herramienta: data.herramienta,
          descripcion: data.descripcion,
          sistemasExternosIdentificados: sistemasExternos.length ? sistemasExternos : undefined,
          actoresIdentificados: actores.length ? actores : undefined,
          casosDeUsoListados: casosDeUso.length ? casosDeUso : undefined,
          casosDeUsoHuerfanos: huerfanos.length ? huerfanos : undefined,
          procesosModelados: procesos.length ? procesos : undefined,
        },
      },
      {
        onSuccess: (artefacto) => {
          // Sincronizar sistemas externos con SRS.sistemasExistentes
          if (data.tipo === 'modelo_contexto' && sistemasExternos.length) {
            const nuevos = sistemasExternos.filter(
              (s) => !(srs.sistemasExistentes ?? []).includes(s)
            )
            if (nuevos.length) {
              actualizarSRS({
                id: srs.id,
                data: { sistemasExistentes: [...(srs.sistemasExistentes ?? []), ...nuevos] },
              })
              // Generar RNF de interoperabilidad por cada sistema nuevo
              nuevos.forEach((sistema) => {
                crearReq({
                  srsId: srs.id,
                  proyectoId,
                  codigo: '',
                  tipo: 'no_funcional',
                  prioridad: 'must',
                  titulo: `RNF Interoperabilidad — ${sistema}`,
                  descripcion: `El sistema DEBE integrarse con ${sistema} mediante interfaces documentadas.`,
                  fuente: 'modelo_contexto',
                  estado: 'propuesto',
                  version: 1,
                  categoria: 'portabilidad',
                  metricas: {
                    metricaObjetivo: 'Integración exitosa (100% de las operaciones)',
                    metodMedicion: 'Test de integración automatizado',
                  },
                })
              })
            }
          }
          reset()
          setShowForm(false)
        },
      }
    )
  }

  return (
    <div className="space-y-4">
      {needsContextoAlert && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
          <p className="text-xs text-amber-800">
            <strong>Bloqueo Checklist S5:</strong> El Modelo de Contexto es obligatorio para avanzar a Fase 5. Adjunta al menos un artefacto de tipo &ldquo;Modelo de Contexto&rdquo;.
          </p>
        </div>
      )}

      {tipo === 'modelo_contexto' && hasContexto && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <p className="text-xs text-green-800 font-medium">Modelo de Contexto adjunto — Checklist S5 ✓</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Adjuntar artefacto
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Nombre del artefacto *" error={errors.nombre?.message}>
                  <Input {...register('nombre')} placeholder="Ej: Diagrama de Contexto v1" />
                </FormField>
                <FormField label="Tipo *" error={errors.tipo?.message}>
                  <Select {...register('tipo')}>
                    {(Object.entries(TIPOS_ARTEFACTO_MODELO_CONFIG) as [TipoArtefactoModelo, typeof TIPOS_ARTEFACTO_MODELO_CONFIG[TipoArtefactoModelo]][]).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.obligatorio ? '⚠️ ' : ''}{v.label}
                      </option>
                    ))}
                  </Select>
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="URL del artefacto *" error={errors.url?.message}>
                  <Input {...register('url')} type="url" placeholder="https://draw.io/..." />
                </FormField>
                <FormField label="Herramienta *" error={errors.herramienta?.message}>
                  <Input {...register('herramienta')} placeholder="draw.io, Lucidchart, Miro..." />
                </FormField>
              </div>

              {/* Campos específicos por tipo */}
              {watchedTipo === 'modelo_contexto' && (
                <FormField label="Sistemas externos identificados (separados por coma)">
                  <Input {...register('sistemasExternosIdentificados')} placeholder="SAP ERP, Portal CRM, API Banco..." />
                </FormField>
              )}
              {watchedTipo === 'caso_de_uso' && (
                <>
                  <FormField label="Actores identificados (separados por coma)">
                    <Input {...register('actoresIdentificados')} placeholder="Administrador, Cliente, Sistema Pago..." />
                  </FormField>
                  <FormField label="Casos de uso listados">
                    <Input {...register('casosDeUsoListados')} placeholder="Registrar usuario, Procesar pago..." />
                  </FormField>
                  <FormField label="Casos de uso sin RF asociado (huérfanos)">
                    <Input {...register('casosDeUsoHuerfanos')} placeholder="CU que no tienen RF asignado aún..." />
                  </FormField>
                </>
              )}
              {(watchedTipo === 'bpmn' || watchedTipo === 'diagrama_actividad') && (
                <FormField label="Procesos modelados (separados por coma)">
                  <Input {...register('procesosModelados')} placeholder="Proceso de aprobación, Facturación mensual..." />
                </FormField>
              )}

              <FormField label="Descripción">
                <Textarea {...register('descripcion')} placeholder="Descripción del alcance del artefacto" rows={2} />
              </FormField>

              {tipoConfig && (
                <p className="text-xs text-muted-foreground bg-muted/40 p-2 rounded">
                  {tipoConfig.obligatorio ? '⚠️ Obligatorio' : 'Opcional'}: {tipoConfig.condicionObligatoriedad ?? tipoConfig.descripcion}
                </p>
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => { reset(); setShowForm(false) }}>Cancelar</Button>
                <Button type="submit" size="sm" disabled={isPending}>
                  {isPending ? 'Adjuntando...' : 'Adjuntar artefacto'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {artefactos.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <LayoutList className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Sin artefactos adjuntados.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {artefactos.map((a) => (
            <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{a.nombre}</span>
                  <Badge variant="outline" className="text-xs">{TIPOS_ARTEFACTO_MODELO_CONFIG[a.tipo]?.label ?? a.tipo}</Badge>
                  <span className="text-xs text-muted-foreground">{a.herramienta}</span>
                </div>
                {a.descripcion && <p className="text-xs text-muted-foreground mt-0.5">{a.descripcion}</p>}
                {a.sistemasExternosIdentificados && a.sistemasExternosIdentificados.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Sistemas: {a.sistemasExternosIdentificados.join(', ')}
                  </p>
                )}
                {a.casosDeUsoHuerfanos && a.casosDeUsoHuerfanos.length > 0 && (
                  <p className="text-xs text-amber-600 mt-0.5">
                    ⚠️ CU sin RF: {a.casosDeUsoHuerfanos.join(', ')}
                  </p>
                )}
              </div>
              <a href={a.url} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------
// SUB-COMPONENTE: F4-04 Panorama Arquitectónico
// -------------------------------------------------------

function F404({ srs, proyectoId }: { srs: SRS; proyectoId: string }) {
  const { mutate: actualizarSRS, isPending } = useActualizarSRS()
  const { data: reqs = [] } = useRequerimientos(srs.id)
  const [subsistemas, setSubsistemas] = useState<Subsistema[]>(
    srs.panoramaArquitectonico?.subsistemas ?? []
  )
  const [restricciones, setRestricciones] = useState<string[]>(
    srs.panoramaArquitectonico?.restriccionesArquitectonicas ?? ['']
  )
  const [showForm, setShowForm] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof subsistemaSchema>>({
    resolver: zodResolver(subsistemaSchema),
  })

  const rfMust = reqs.filter((r) => r.prioridad === 'must' && r.tipo === 'funcional')

  const addSubsistema = (data: z.infer<typeof subsistemaSchema>) => {
    const nuevo: Subsistema = {
      nombre: data.nombre,
      responsabilidad: data.responsabilidad,
      tecnologia: data.tecnologia,
      rfMustsAsignados: [],
    }
    setSubsistemas((prev) => [...prev, nuevo])
    reset()
    setShowForm(false)
  }

  const removeSubsistema = (i: number) => setSubsistemas((prev) => prev.filter((_, idx) => idx !== i))

  const handleSave = () => {
    const distribucion: Record<string, string[]> = {}
    subsistemas.forEach((s) => {
      if (s.rfMustsAsignados?.length) distribucion[s.nombre] = s.rfMustsAsignados
    })
    actualizarSRS({
      id: srs.id,
      data: {
        panoramaArquitectonico: {
          subsistemas,
          distribucionFunciones: distribucion,
          restriccionesArquitectonicas: restricciones.filter(Boolean),
        },
      },
    })
  }

  const assignRFToSubsistema = (subsistemaIdx: number, rfId: string, assign: boolean) => {
    setSubsistemas((prev) => prev.map((s, i) => {
      if (i !== subsistemaIdx) return s
      const current = s.rfMustsAsignados ?? []
      return {
        ...s,
        rfMustsAsignados: assign ? [...current, rfId] : current.filter((id) => id !== rfId),
      }
    }))
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Panorama arquitectónico preliminar. Define subsistemas y asigna RF Must Have a cada uno.
      </p>

      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Subsistema
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit(addSubsistema)} className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <FormField label="Nombre del subsistema *" error={errors.nombre?.message}>
                  <Input {...register('nombre')} placeholder="Auth Module, API Gateway..." />
                </FormField>
                <FormField label="Tecnología *" error={errors.tecnologia?.message}>
                  <Input {...register('tecnologia')} placeholder="Next.js, FastAPI, PostgreSQL..." />
                </FormField>
                <FormField label="Responsabilidad *" error={errors.responsabilidad?.message}>
                  <Input {...register('responsabilidad')} placeholder="Gestiona autenticación y permisos" />
                </FormField>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => { reset(); setShowForm(false) }}>Cancelar</Button>
                <Button type="submit" size="sm">Agregar subsistema</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {subsistemas.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground">Sin subsistemas definidos.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {subsistemas.map((s, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{s.nombre}</p>
                      <Badge variant="outline" className="text-xs">{s.tecnologia}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.responsabilidad}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeSubsistema(i)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
                {rfMust.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">RF Must asignados:</p>
                    <div className="flex flex-wrap gap-1">
                      {rfMust.map((r) => {
                        const assigned = s.rfMustsAsignados?.includes(r.id) ?? false
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => assignRFToSubsistema(i, r.id, !assigned)}
                            className={`text-xs px-2 py-0.5 rounded border transition-colors
                              ${assigned ? 'bg-primary/10 border-primary text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}
                          >
                            {r.codigo || r.titulo.slice(0, 15)}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Restricciones arquitectónicas */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Restricciones Arquitectónicas</label>
          <Button type="button" variant="outline" size="sm" onClick={() => setRestricciones((prev) => [...prev, ''])}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Agregar
          </Button>
        </div>
        <div className="space-y-2">
          {restricciones.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={r}
                onChange={(e) => setRestricciones((prev) => prev.map((x, idx) => idx === i ? e.target.value : x))}
                placeholder="Ej: La API debe ser RESTful, No usar frameworks de pago..."
              />
              {restricciones.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setRestricciones((prev) => prev.filter((_, idx) => idx !== i))}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isPending}>
          <Save className="h-4 w-4 mr-2" />
          {isPending ? 'Guardando...' : 'Guardar Panorama Arquitectónico'}
        </Button>
      </div>
    </div>
  )
}

// -------------------------------------------------------
// SUB-COMPONENTE: F4-05 Bucle F4→F2
// -------------------------------------------------------

function F405({ srs, proyectoId }: { srs: SRS; proyectoId: string }) {
  const { mutate: registrarBucle, isPending } = useRegistrarIteracionBucle()
  const { data: reqs = [] } = useRequerimientos(srs.id)
  const [motivo, setMotivo] = useState('')
  const [selectedReqs, setSelectedReqs] = useState<string[]>([])

  const iteracionesF4 = (srs.iteracionesBucle ?? []).filter((i) => i.fase === 'F4→F2')
  const alertaF4 = iteracionesF4.length > 5

  const handleBucle = () => {
    if (!motivo) return
    registrarBucle({
      srsId: srs.id,
      proyectoId,
      fase: 'F4→F2',
      motivo,
      reqsAfectados: selectedReqs,
    }, { onSuccess: () => { setMotivo(''); setSelectedReqs([]) } })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Si el modelado descubre nuevos requerimientos, regresa a Fase 2 con este botón.
      </p>

      {alertaF4 && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
          <p className="text-xs text-amber-800">
            <strong>Alerta:</strong> Más de 5 iteraciones F4→F2. Considera un retorno formal a Fase 2 para re-adquisición completa.
          </p>
        </div>
      )}

      <Card>
        <CardContent className="p-4 space-y-3">
          <p className="text-sm font-medium">Requerimiento emergente del modelado</p>
          <FormField label="Motivo del retorno a Fase 2 *">
            <Textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="¿Qué descubrió el modelado que requiere volver a Fase 2?"
              rows={2}
            />
          </FormField>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">RF afectados (opcional)</label>
            <div className="max-h-32 overflow-y-auto space-y-1 border rounded-md p-2">
              {reqs.slice(0, 20).map((r) => (
                <label key={r.id} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-muted/40 rounded">
                  <input
                    type="checkbox"
                    checked={selectedReqs.includes(r.id)}
                    onChange={(e) => setSelectedReqs((prev) =>
                      e.target.checked ? [...prev, r.id] : prev.filter((x) => x !== r.id)
                    )}
                    className="rounded"
                  />
                  <span className="text-xs font-mono">{r.codigo || '???'}</span>
                  <span className="text-xs truncate">{r.titulo}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              disabled={!motivo || isPending}
              onClick={handleBucle}
              variant="outline"
              className="border-amber-300 text-amber-800 hover:bg-amber-50"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              {isPending ? 'Registrando...' : 'Registrar retorno F4→F2'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {iteracionesF4.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Historial iteraciones F4→F2</p>
          <div className="space-y-1">
            {iteracionesF4.map((it, i) => (
              <div key={i} className="flex items-center gap-2 text-xs p-2 bg-muted/40 rounded">
                <span className="font-mono">#{it.iteracion}</span>
                <span className="text-muted-foreground truncate flex-1">{it.motivo}</span>
                <span className="text-muted-foreground">{it.reqsAfectados.length} RF</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL: Fase4Panel
// -------------------------------------------------------

type Tab4 = 'F4-01' | 'F4-02' | 'F4-03' | 'F4-04' | 'F4-05'

const TABS: { id: Tab4; label: string; sublabel: string }[] = [
  { id: 'F4-01', label: 'F4-01', sublabel: 'Modelo Contexto*' },
  { id: 'F4-02', label: 'F4-02', sublabel: 'Casos de Uso' },
  { id: 'F4-03', label: 'F4-03', sublabel: 'BPMN / Actividad' },
  { id: 'F4-04', label: 'F4-04', sublabel: 'Arquitectura' },
  { id: 'F4-05', label: 'F4-05', sublabel: 'Bucle F4→F2 ⟳' },
]

interface Fase4Props {
  srs: SRS
  proyecto: Proyecto
  onAdvance: () => void
}

export function Fase4Panel({ srs, proyecto, onAdvance }: Fase4Props) {
  const [tab, setTab] = useState<Tab4>('F4-01')
  const hasContexto = (srs.artefactosModelo ?? []).some((a) => a.tipo === 'modelo_contexto')

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Fase 4 — Análisis y Modelado del Sistema ⟳</h2>
        <p className="text-sm text-muted-foreground">
          Modelos UML, contexto, casos de uso, BPMN y panorama arquitectónico.
          {!hasContexto && <span className="text-amber-600 ml-1">⚠️ Modelo de Contexto pendiente (requerido)</span>}
        </p>
      </div>

      <div className="flex gap-1 border-b flex-wrap">
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
        {tab === 'F4-01' && <F4Artefactos srs={srs} proyectoId={proyecto.id} tipo="modelo_contexto" />}
        {tab === 'F4-02' && <F4Artefactos srs={srs} proyectoId={proyecto.id} tipo="caso_de_uso" />}
        {tab === 'F4-03' && <F4Artefactos srs={srs} proyectoId={proyecto.id} tipo="bpmn" />}
        {tab === 'F4-04' && <F404 srs={srs} proyectoId={proyecto.id} />}
        {tab === 'F4-05' && <F405 srs={srs} proyectoId={proyecto.id} />}
      </div>

      <div className="flex justify-end pt-2 border-t">
        <Button
          variant="outline"
          onClick={onAdvance}
          disabled={!hasContexto}
          title={!hasContexto ? 'Adjunta primero el Modelo de Contexto (F4-01)' : undefined}
        >
          Avanzar a Fase 5 — Especificación <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
