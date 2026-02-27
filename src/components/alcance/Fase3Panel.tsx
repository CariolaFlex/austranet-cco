'use client'

// ============================================================
// COMPONENTE: Fase3Panel — Prototipado y Validación Temprana ⟳
// Fuentes: M3-02 §9 (prototipado); M3-01 §5 (bucle retro.)
// Tareas: F3-01 | F3-02
// ============================================================

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Plus, FlaskConical, ChevronRight, AlertTriangle,
  CheckCircle2, RefreshCw, ChevronDown, ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib'
import { Input, Textarea, FormField, Select } from '@/components/ui/input'
import {
  useActualizarSRS, useAgregarPrototipo,
  useActualizarResultadoPrototipo, useRegistrarIteracionBucle,
  useRequerimientos,
} from '@/hooks/useAlcance'
import { TIPOS_PROTOTIPO_CONFIG } from '@/constants/alcance'
import type {
  Proyecto, SRS, Prototipo, ResultadoValidacionProto, TipoPrototipo,
} from '@/types'

// -------------------------------------------------------
// SCHEMAS
// -------------------------------------------------------

const prototipoSchema = z.object({
  objetivo: z.string().min(10, 'Describe el objetivo del prototipo'),
  tipo: z.enum(['wireframe_papel', 'mockup_digital', 'mago_de_oz', 'prototipo_funcional']),
  urlArtifacto: z.string().url('URL válida requerida').optional().or(z.literal('')),
  fechaSesionEvaluacion: z.string().optional(),
})

type PrototipoForm = z.infer<typeof prototipoSchema>

const RESULTADO_LABELS: Record<ResultadoValidacionProto, { label: string; color: string }> = {
  validado: { label: 'Validado ✓', color: 'bg-green-50 text-green-700 border-green-200' },
  ajuste_menor: { label: 'Ajuste menor', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  ajuste_mayor: { label: 'Ajuste mayor ⚠', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  eliminado: { label: 'Eliminado ✗', color: 'bg-red-50 text-red-700 border-red-200' },
}

// -------------------------------------------------------
// SUB-COMPONENTE: F3-01 Registro de Prototipo
// -------------------------------------------------------

function F301({ srs, proyectoId }: { srs: SRS; proyectoId: string }) {
  const { data: reqs = [] } = useRequerimientos(srs.id)
  const { mutate: agregarPrototipo, isPending } = useAgregarPrototipo()
  const [showForm, setShowForm] = useState(false)
  const [selectedReqs, setSelectedReqs] = useState<string[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PrototipoForm>({
    resolver: zodResolver(prototipoSchema),
    defaultValues: { tipo: 'mockup_digital' },
  })

  const toggleReq = (id: string) => {
    setSelectedReqs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const onSubmit = (data: PrototipoForm) => {
    if (selectedReqs.length > 15) return
    agregarPrototipo(
      {
        srsId: srs.id,
        proyectoId,
        data: {
          prototipoId: '',
          objetivo: data.objetivo,
          tipo: data.tipo as TipoPrototipo,
          requerimientosAValidar: selectedReqs,
          urlArtifacto: data.urlArtifacto || undefined,
          fechaSesionEvaluacion: data.fechaSesionEvaluacion ? new Date(data.fechaSesionEvaluacion) : undefined,
          stakeholdersParticipantes: [],
        },
      },
      { onSuccess: () => { reset(); setSelectedReqs([]); setShowForm(false) } }
    )
  }

  const prototipos = srs.prototipos ?? []
  const rfAprobados = reqs.filter((r) => r.tipo === 'funcional')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Registro de prototipos (embebidos en el SRS). Máximo 15 RF por prototipo.
        </p>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Nuevo prototipo
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <FormField label="Objetivo del prototipo *" error={errors.objetivo?.message}>
                <Textarea {...register('objetivo')} placeholder="¿Qué RF específicos valida este prototipo?" rows={2} />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Tipo de prototipo" error={errors.tipo?.message}>
                  <Select {...register('tipo')}>
                    {(Object.entries(TIPOS_PROTOTIPO_CONFIG) as [TipoPrototipo, typeof TIPOS_PROTOTIPO_CONFIG[TipoPrototipo]][]).map(([k, v]) => (
                      <option key={k} value={k}>{v.label} ({v.fidelidad})</option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Fecha de evaluación">
                  <Input type="date" {...register('fechaSesionEvaluacion')} />
                </FormField>
              </div>
              <FormField label="URL del artefacto (Figma, draw.io...)" error={errors.urlArtifacto?.message}>
                <Input {...register('urlArtifacto')} placeholder="https://figma.com/..." type="url" />
              </FormField>

              {/* Selección de RFs a validar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium">Requerimientos a validar</label>
                  <span className={`text-xs ${selectedReqs.length > 15 ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                    {selectedReqs.length}/15
                  </span>
                </div>
                {selectedReqs.length > 15 && (
                  <p className="text-xs text-destructive mb-2">Máximo 15 RF por prototipo. Divide en múltiples prototipos.</p>
                )}
                <div className="max-h-40 overflow-y-auto space-y-1 border rounded-md p-2">
                  {rfAprobados.length === 0 ? (
                    <p className="text-xs text-muted-foreground p-2">Sin RF disponibles. Crea requerimientos en Fase 2.</p>
                  ) : (
                    rfAprobados.map((r) => (
                      <label key={r.id} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-muted/40 rounded">
                        <input
                          type="checkbox"
                          checked={selectedReqs.includes(r.id)}
                          onChange={() => toggleReq(r.id)}
                          className="rounded"
                        />
                        <Badge variant="outline" className="text-xs font-mono">{r.codigo || '???'}</Badge>
                        <span className="text-xs truncate">{r.titulo}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => { reset(); setSelectedReqs([]); setShowForm(false) }}>Cancelar</Button>
                <Button type="submit" size="sm" disabled={isPending || selectedReqs.length > 15}>
                  {isPending ? 'Guardando...' : 'Registrar prototipo'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {prototipos.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <FlaskConical className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Sin prototipos registrados.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {prototipos.map((p) => {
            const tipoConfig = TIPOS_PROTOTIPO_CONFIG[p.tipo]
            return (
              <div key={p.id} className="border rounded-lg bg-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/40"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono">{p.prototipoId || 'PRT-?'}</Badge>
                    <span className="font-medium text-sm">{tipoConfig?.label}</span>
                    <Badge variant="outline" className="text-xs">fidelidad: {tipoConfig?.fidelidad}</Badge>
                    {p.resultado && (
                      <Badge variant="outline" className={`text-xs ${RESULTADO_LABELS[p.resultado].color}`}>
                        {RESULTADO_LABELS[p.resultado].label}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">{p.requerimientosAValidar.length} RF</span>
                  </div>
                  {expanded === p.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expanded === p.id && (
                  <div className="px-4 pb-4 border-t pt-3 space-y-2">
                    <p className="text-sm"><span className="text-muted-foreground">Objetivo: </span>{p.objetivo}</p>
                    {p.urlArtifacto && (
                      <p className="text-sm"><span className="text-muted-foreground">URL: </span>
                        <a href={p.urlArtifacto} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{p.urlArtifacto}</a>
                      </p>
                    )}
                    {p.fechaSesionEvaluacion && (
                      <p className="text-sm"><span className="text-muted-foreground">Fecha: </span>{new Date(p.fechaSesionEvaluacion).toLocaleDateString('es-CL')}</p>
                    )}
                    {p.observaciones && (
                      <p className="text-sm"><span className="text-muted-foreground">Observaciones: </span>{p.observaciones}</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------
// SUB-COMPONENTE: F3-02 Evaluación del Prototipo y Bucle
// -------------------------------------------------------

function F302({ srs, proyectoId }: { srs: SRS; proyectoId: string }) {
  const { data: reqs = [] } = useRequerimientos(srs.id)
  const { mutate: actualizarResultado, isPending: isPendingResultado } = useActualizarResultadoPrototipo()
  const { mutate: registrarBucle, isPending: isPendingBucle } = useRegistrarIteracionBucle()
  const [selectedProto, setSelectedProto] = useState<string | null>(null)
  const [resultados, setResultados] = useState<Record<string, ResultadoValidacionProto>>({})
  const [observaciones, setObservaciones] = useState('')
  const [motivoBucle, setMotivoBucle] = useState('')

  const prototipos = srs.prototipos ?? []
  const iteracionesBucle = srs.iteracionesBucle ?? []
  const alertaIteraciones = iteracionesBucle.filter((i) => i.fase === 'F3→F2').length > 3

  const proto = prototipos.find((p) => p.id === selectedProto)

  const handleSaveResultados = () => {
    if (!selectedProto || !proto) return
    actualizarResultado({
      srsId: srs.id,
      proyectoId,
      prototipoId: selectedProto,
      resultado: Object.values(resultados).every((r) => r === 'validado' || r === 'ajuste_menor')
        ? 'validado'
        : 'ajuste_mayor',
      resultadoPorRequerimiento: resultados,
      observaciones: observaciones || undefined,
    })
  }

  const handleBucle = () => {
    if (!proto || !motivoBucle) return
    const reqsAfectados = Object.entries(resultados)
      .filter(([, v]) => v === 'ajuste_mayor' || v === 'eliminado')
      .map(([k]) => k)

    registrarBucle({
      srsId: srs.id,
      proyectoId,
      fase: 'F3→F2',
      motivo: motivoBucle,
      reqsAfectados,
    })
  }

  const tieneAjustesMayores = Object.values(resultados).some((r) => r === 'ajuste_mayor' || r === 'eliminado')

  return (
    <div className="space-y-4">
      {alertaIteraciones && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
          <p className="text-xs text-red-800">
            <strong>Alerta:</strong> Más de 3 iteraciones F3→F2. Considera registrar riesgo de alcance en M2-03.
          </p>
        </div>
      )}

      {/* Log de iteraciones */}
      {iteracionesBucle.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Log de Iteraciones (inmutable)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="space-y-1">
              {iteracionesBucle.map((it, i) => (
                <div key={i} className="flex items-center gap-2 text-xs p-2 bg-muted/40 rounded">
                  <Badge variant="outline" className="text-xs font-mono">{it.fase}</Badge>
                  <span>#{it.iteracion}</span>
                  <span className="text-muted-foreground truncate">{it.motivo}</span>
                  <span className="text-muted-foreground ml-auto">
                    {it.fechaRetorno ? new Date(it.fechaRetorno).toLocaleDateString('es-CL') : ''}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selección de prototipo */}
      {prototipos.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <FlaskConical className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Registra un prototipo en F3-01 para evaluarlo.</p>
        </div>
      ) : (
        <>
          <FormField label="Prototipo a evaluar">
            <Select value={selectedProto ?? ''} onChange={(e) => {
              setSelectedProto(e.target.value || null)
              setResultados({})
            }}>
              <option value="">Seleccionar prototipo...</option>
              {prototipos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.prototipoId || 'PRT'} — {TIPOS_PROTOTIPO_CONFIG[p.tipo]?.label} ({p.requerimientosAValidar.length} RF)
                </option>
              ))}
            </Select>
          </FormField>

          {proto && (
            <div className="space-y-3">
              {/* Resultados por RF */}
              <div>
                <p className="text-sm font-medium mb-2">Resultados por Requerimiento</p>
                <div className="space-y-2">
                  {proto.requerimientosAValidar.map((reqId) => {
                    const req = reqs.find((r) => r.id === reqId)
                    const resultado = resultados[reqId] ?? (proto.resultadoPorRequerimiento?.[reqId] ?? 'validado')
                    return (
                      <div key={reqId} className="flex items-center gap-3 p-2 rounded border bg-card">
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-mono text-muted-foreground">
                            {req?.codigo ?? reqId}
                          </span>
                          <span className="text-sm ml-2 truncate">{req?.titulo ?? reqId}</span>
                        </div>
                        <Select
                          value={resultado}
                          onChange={(e) => setResultados((prev) => ({ ...prev, [reqId]: e.target.value as ResultadoValidacionProto }))}
                          className="w-36 flex-shrink-0"
                        >
                          {(Object.entries(RESULTADO_LABELS) as [ResultadoValidacionProto, { label: string }][]).map(([k, v]) => (
                            <option key={k} value={k}>{v.label}</option>
                          ))}
                        </Select>
                      </div>
                    )
                  })}
                </div>
              </div>

              <FormField label="Observaciones generales">
                <Textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Notas del facilitador de la evaluación"
                  rows={2}
                />
              </FormField>

              {/* Bucle F3→F2 si hay ajustes mayores */}
              {tieneAjustesMayores && (
                <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-900/10">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <RefreshCw className="h-4 w-4 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-amber-800 dark:text-amber-300">
                          Bucle F3 → F2 necesario
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                          Hay requerimientos con ajuste mayor o eliminados. Documenta el motivo del retorno.
                        </p>
                      </div>
                    </div>
                    <FormField label="Motivo del retorno a Fase 2 *">
                      <Textarea
                        value={motivoBucle}
                        onChange={(e) => setMotivoBucle(e.target.value)}
                        placeholder="¿Qué descubrimos que requiere volver a la adquisición?"
                        rows={2}
                      />
                    </FormField>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!motivoBucle || isPendingBucle}
                      onClick={handleBucle}
                      className="border-amber-300 text-amber-800 hover:bg-amber-100"
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      {isPendingBucle ? 'Registrando...' : 'Registrar retorno F3→F2'}
                    </Button>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end">
                <Button onClick={handleSaveResultados} disabled={isPendingResultado}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {isPendingResultado ? 'Guardando...' : 'Guardar evaluación'}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL: Fase3Panel
// -------------------------------------------------------

type Tab3 = 'F3-01' | 'F3-02'

const TABS: { id: Tab3; label: string; sublabel: string }[] = [
  { id: 'F3-01', label: 'F3-01', sublabel: 'Prototipos' },
  { id: 'F3-02', label: 'F3-02', sublabel: 'Evaluación ⟳' },
]

interface Fase3Props {
  srs: SRS
  proyecto: Proyecto
  onAdvance: () => void
}

export function Fase3Panel({ srs, proyecto, onAdvance }: Fase3Props) {
  const [tab, setTab] = useState<Tab3>('F3-01')

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Fase 3 — Prototipado y Validación Temprana ⟳</h2>
        <p className="text-sm text-muted-foreground">
          Prototipos para validar RF con usuarios. Retorno F3→F2 si hay ajustes mayores.
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
        {tab === 'F3-01' && <F301 srs={srs} proyectoId={proyecto.id} />}
        {tab === 'F3-02' && <F302 srs={srs} proyectoId={proyecto.id} />}
      </div>

      <div className="flex justify-end pt-2 border-t">
        <Button variant="outline" onClick={onAdvance}>
          Avanzar a Fase 4 — Modelado <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
