'use client'

// ============================================================
// COMPONENTE: Fase6Panel — Planificación y Coherencia SRS-M2
// Fuentes: M3-04 (Checklist C4, C6, M4), M3-07 §5, M2-07
// Tareas: F6-01 (estrategia de entrega) | F6-02 (distribución MoSCoW)
// ============================================================

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  AlertTriangle, CheckCircle2, BarChart2, Layers, Save,
  GitBranch, RefreshCw, Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib'
import { Input, FormField, Select } from '@/components/ui/input'
import {
  useActualizarSRS,
  useRequerimientos,
} from '@/hooks/useAlcance'
import { REGLAS_MOSCOW, CATEGORIAS_RNF_CONFIG } from '@/constants/alcance'
import type { Proyecto, SRS } from '@/types'

// ──────────────────────────────────────────────────────────
// Mapeo metodología M2-07 → tipoSRS recomendado
// ──────────────────────────────────────────────────────────

const METODOLOGIA_A_TIPO_SRS: Record<
  string,
  { tipo: SRS['tipoSRS']; validacionIncremental: boolean; razon: string }
> = {
  cascada: {
    tipo: 'completo',
    validacionIncremental: false,
    razon: 'Cascada requiere SRS completo antes de comenzar diseño (baseline única)',
  },
  incremental: {
    tipo: 'incremental',
    validacionIncremental: true,
    razon: 'Modelo incremental entrega funcionalidad por etapas — SRS crece con cada incremento',
  },
  agil_scrum: {
    tipo: 'epica',
    validacionIncremental: true,
    razon: 'Scrum gestiona requerimientos como épicas/historias — SRS es living document por sprint',
  },
  agil_xp: {
    tipo: 'epica',
    validacionIncremental: true,
    razon: 'XP usa historias de usuario cortas — SRS mínimo por iteración, validación continua',
  },
  rup: {
    tipo: 'incremental',
    validacionIncremental: true,
    razon: 'RUP elabora casos de uso iterativamente — SRS se completa al final de Elaboración',
  },
  espiral: {
    tipo: 'incremental',
    validacionIncremental: true,
    razon: 'Espiral itera por riesgo — cada ciclo refina el SRS según los prototipos de riesgo',
  },
}

const TIPOS_SRS_LABELS: Record<NonNullable<SRS['tipoSRS']>, string> = {
  completo: 'Completo (baseline única, IEEE 830 tradicional)',
  incremental: 'Incremental (secciones que crecen por sprint/fase)',
  epica: 'Épicas (historias de usuario agrupadas, living document)',
  minimo: 'Mínimo viable (scope muy acotado, proyectos pequeños)',
}

// ──────────────────────────────────────────────────────────
// Schema F6-01
// ──────────────────────────────────────────────────────────

const f601Schema = z.object({
  tipoSRS: z.enum(['completo', 'incremental', 'epica', 'minimo']),
  validacionIncremental: z.boolean(),
})
type F601Form = z.infer<typeof f601Schema>

// ──────────────────────────────────────────────────────────
// Schema F6-02 — horas por prioridad
// ──────────────────────────────────────────────────────────

const f602Schema = z.object({
  horasMust: z.coerce.number().min(0, 'Ingresa las horas Must'),
  horasShould: z.coerce.number().min(0),
  horasCould: z.coerce.number().min(0),
  horasWont: z.coerce.number().min(0),
})
type F602Form = z.infer<typeof f602Schema>

// ──────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────

function calcularDistribucion(horas: F602Form) {
  const total = horas.horasMust + horas.horasShould + horas.horasCould + horas.horasWont
  if (total === 0) return null
  return {
    must: Math.round((horas.horasMust / total) * 100),
    should: Math.round((horas.horasShould / total) * 100),
    could: Math.round((horas.horasCould / total) * 100),
    wont: Math.round((horas.horasWont / total) * 100),
    total,
  }
}

function validarMoscow(dist: NonNullable<ReturnType<typeof calcularDistribucion>>) {
  const errores: string[] = []
  if (dist.must < REGLAS_MOSCOW.mustMinPorcentajeEsfuerzo) {
    errores.push(`Must debe representar ≥ ${REGLAS_MOSCOW.mustMinPorcentajeEsfuerzo}% del esfuerzo (actual: ${dist.must}%)`)
  }
  if (dist.must > REGLAS_MOSCOW.mustMaxPorcentajeEsfuerzo) {
    errores.push(`Must no debe superar ${REGLAS_MOSCOW.mustMaxPorcentajeEsfuerzo}% del esfuerzo — deja margen para Should (actual: ${dist.must}%)`)
  }
  if (dist.could > REGLAS_MOSCOW.couldMaxPorcentaje) {
    errores.push(`Could debe ser ≤ ${REGLAS_MOSCOW.couldMaxPorcentaje}% del esfuerzo (actual: ${dist.could}%)`)
  }
  return errores
}

// ──────────────────────────────────────────────────────────
// SUB-COMPONENTE: F6-01 Estrategia de Entrega
// ──────────────────────────────────────────────────────────

interface F601Props {
  proyecto: Proyecto
  srs: SRS
  rnfProceso: import('@/types').Requerimiento[]
}

function F601StrategiaEntrega({ proyecto, srs, rnfProceso }: F601Props) {
  const recomendado = METODOLOGIA_A_TIPO_SRS[proyecto.metodologia]
  const actualizar = useActualizarSRS()

  const { register, handleSubmit, watch, setValue, formState: { errors, isDirty } } = useForm<F601Form>({
    resolver: zodResolver(f601Schema),
    defaultValues: {
      tipoSRS: srs.tipoSRS ?? recomendado?.tipo ?? 'completo',
      validacionIncremental: srs.validacionIncremental ?? recomendado?.validacionIncremental ?? false,
    },
  })

  const tipoSeleccionado = watch('tipoSRS')

  const onSubmit = (data: F601Form) => {
    actualizar.mutate({ id: srs.id, data })
  }

  const aplicarRecomendacion = () => {
    if (!recomendado) return
    setValue('tipoSRS', recomendado.tipo!, { shouldDirty: true })
    setValue('validacionIncremental', recomendado.validacionIncremental, { shouldDirty: true })
  }

  const METODOLOGIA_LABELS: Record<string, string> = {
    cascada: 'Cascada', incremental: 'Incremental', agil_scrum: 'Scrum',
    agil_xp: 'XP', rup: 'RUP', espiral: 'Espiral',
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Info metodología M2-07 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GitBranch className="h-4 w-4 text-primary" />
            Metodología acordada (M2-07)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Badge className="text-sm px-3 py-1">
              {METODOLOGIA_LABELS[proyecto.metodologia] ?? proyecto.metodologia}
            </Badge>
            {proyecto.justificacionMetodologia && (
              <p className="text-sm text-muted-foreground">
                {proyecto.justificacionMetodologia}
              </p>
            )}
          </div>

          {recomendado && (
            <div className="rounded-md border border-primary/20 bg-primary/5 p-3 space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-primary">
                    Recomendación para {METODOLOGIA_LABELS[proyecto.metodologia]}:
                    {' '}SRS {TIPOS_SRS_LABELS[recomendado.tipo!]?.split(' ')[0]}
                  </p>
                  <p className="text-muted-foreground mt-0.5">{recomendado.razon}</p>
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={aplicarRecomendacion}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Aplicar recomendación
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tipo SRS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tipo de SRS para este proyecto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Tipo de SRS" error={errors.tipoSRS?.message}>
            <Select {...register('tipoSRS')}>
              {Object.entries(TIPOS_SRS_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </Select>
          </FormField>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="validInc"
              {...register('validacionIncremental')}
              className="h-4 w-4 rounded border border-input"
            />
            <label htmlFor="validInc" className="text-sm">
              Validación incremental (stakeholders validan RF por sprint/iteración)
            </label>
          </div>

          {/* Alerta de coherencia C4 */}
          {tipoSeleccionado === 'completo' &&
            (proyecto.metodologia === 'agil_scrum' || proyecto.metodologia === 'agil_xp') && (
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Inconsistencia detectada — Checklist C4</p>
                <p className="mt-0.5">
                  La metodología {METODOLOGIA_LABELS[proyecto.metodologia]} es ágil pero elegiste SRS Completo.
                  Considera cambiar a Épicas o Incremental para mantener coherencia.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* RNF de proceso derivados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            RNF de proceso vinculados (F2-04)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rnfProceso.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay RNF de proceso registrados. Vuelve a F2-04 para registrar los hallazgos del análisis organizacional.
            </p>
          ) : (
            <div className="space-y-2">
              {rnfProceso.map(rnf => (
                <div
                  key={rnf.id}
                  className="flex items-start justify-between rounded-md border bg-card p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{rnf.codigo} — {rnf.titulo}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {rnf.descripcion}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-3 text-xs shrink-0">
                    {CATEGORIAS_RNF_CONFIG.proceso.label}
                  </Badge>
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-2">
                Checklist C4: Estos RNF de proceso deben ser coherentes con la metodología acordada en M2-07.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={!isDirty || actualizar.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {actualizar.isPending ? 'Guardando…' : 'Guardar estrategia de entrega'}
        </Button>
      </div>
    </form>
  )
}

// ──────────────────────────────────────────────────────────
// SUB-COMPONENTE: F6-02 Distribución MoSCoW por esfuerzo
// ──────────────────────────────────────────────────────────

interface F602Props {
  srs: SRS
  reqs: import('@/types').Requerimiento[]
}

function F602DistribucionMoscow({ srs, reqs }: F602Props) {
  const actualizar = useActualizarSRS()

  const conteos = useMemo(() => {
    const total = reqs.filter(r => r.tipo === 'funcional')
    return {
      must:   total.filter(r => r.prioridad === 'must').length,
      should: total.filter(r => r.prioridad === 'should').length,
      could:  total.filter(r => r.prioridad === 'could').length,
      wont:   total.filter(r => r.prioridad === 'wont').length,
      total:  total.length,
    }
  }, [reqs])

  // Inicializar con distribución guardada o estimación proporcional
  const horasInicio = useMemo(() => {
    if (srs.distribucionMoSCoW) {
      // Calcular horas desde porcentajes (estimamos 100h total como referencia)
      const ref = 100
      return {
        horasMust: Math.round(srs.distribucionMoSCoW.must * ref / 100),
        horasShould: Math.round(srs.distribucionMoSCoW.should * ref / 100),
        horasCould: Math.round(srs.distribucionMoSCoW.could * ref / 100),
        horasWont: Math.round(srs.distribucionMoSCoW.wont * ref / 100),
      }
    }
    // Estimación inicial proporcional por cantidad de RFs
    return {
      horasMust: conteos.must * 8,
      horasShould: conteos.should * 5,
      horasCould: conteos.could * 3,
      horasWont: 0,
    }
  }, [srs.distribucionMoSCoW, conteos])

  const { register, handleSubmit, watch, formState: { errors } } = useForm<F602Form>({
    resolver: zodResolver(f602Schema),
    defaultValues: horasInicio,
  })

  const horasWatch = watch()
  const distribucion = useMemo(() => calcularDistribucion(horasWatch), [horasWatch])
  const erroresMoscow = distribucion ? validarMoscow(distribucion) : []

  const onSubmit = (data: F602Form) => {
    const dist = calcularDistribucion(data)
    if (!dist) return
    actualizar.mutate({
      id: srs.id,
      data: {
        distribucionMoSCoW: {
          must: dist.must,
          should: dist.should,
          could: dist.could,
          wont: dist.wont,
        },
      },
    })
  }

  const getBarColor = (cat: string) =>
    cat === 'must' ? 'bg-red-500' :
    cat === 'should' ? 'bg-amber-500' :
    cat === 'could' ? 'bg-blue-400' :
    'bg-gray-400'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Conteos actuales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Distribución actual de RFs funcionales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3 text-center">
            {[
              { cat: 'Must Have', count: conteos.must, color: 'text-red-600 dark:text-red-400' },
              { cat: 'Should Have', count: conteos.should, color: 'text-amber-600 dark:text-amber-400' },
              { cat: "Could Have", count: conteos.could, color: 'text-blue-600 dark:text-blue-400' },
              { cat: "Won't Have", count: conteos.wont, color: 'text-gray-600 dark:text-gray-400' },
            ].map(item => (
              <div key={item.cat} className="rounded-lg border bg-card p-3">
                <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.cat}</p>
              </div>
            ))}
          </div>
          {conteos.total === 0 && (
            <p className="mt-3 text-sm text-amber-600 dark:text-amber-400">
              No hay RFs funcionales. Ve a F5-02 para crear requerimientos antes de estimar esfuerzo.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Estimación de horas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-primary" />
            Estimación de esfuerzo por categoría
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Ingresa el esfuerzo estimado (horas) por cada categoría MoSCoW.
            El sistema calcula el porcentaje de distribución y verifica las reglas M3-04.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Must Have (horas)" error={errors.horasMust?.message}>
              <Input
                type="number"
                min={0}
                {...register('horasMust')}
                className="border-red-300 focus:border-red-500"
              />
            </FormField>
            <FormField label="Should Have (horas)" error={errors.horasShould?.message}>
              <Input
                type="number"
                min={0}
                {...register('horasShould')}
                className="border-amber-300 focus:border-amber-500"
              />
            </FormField>
            <FormField label="Could Have (horas)" error={errors.horasCould?.message}>
              <Input
                type="number"
                min={0}
                {...register('horasCould')}
                className="border-blue-300 focus:border-blue-500"
              />
            </FormField>
            <FormField label="Won't Have (horas)" error={errors.horasWont?.message}>
              <Input
                type="number"
                min={0}
                {...register('horasWont')}
                className="border-gray-300 focus:border-gray-400"
              />
            </FormField>
          </div>

          {/* Visualización barra */}
          {distribucion && (
            <div className="space-y-3">
              <div className="flex h-6 rounded-full overflow-hidden">
                {[
                  { key: 'must', val: distribucion.must },
                  { key: 'should', val: distribucion.should },
                  { key: 'could', val: distribucion.could },
                  { key: 'wont', val: distribucion.wont },
                ].filter(x => x.val > 0).map(x => (
                  <div
                    key={x.key}
                    className={`${getBarColor(x.key)} flex items-center justify-center text-xs text-white font-medium`}
                    style={{ width: `${x.val}%` }}
                  >
                    {x.val >= 8 ? `${x.val}%` : ''}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-500" />
                  Must: {distribucion.must}%
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-500" />
                  Should: {distribucion.should}%
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm bg-blue-400" />
                  Could: {distribucion.could}%
                </span>
                {distribucion.wont > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2.5 h-2.5 rounded-sm bg-gray-400" />
                    Won't: {distribucion.wont}%
                  </span>
                )}
                <span className="ml-auto font-medium">
                  Total: {distribucion.total}h
                </span>
              </div>
            </div>
          )}

          {/* Validación REGLAS_MOSCOW */}
          {distribucion && erroresMoscow.length > 0 && (
            <div className="space-y-2">
              {erroresMoscow.map((err, i) => (
                <div key={i} className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{err}</span>
                </div>
              ))}
            </div>
          )}

          {distribucion && erroresMoscow.length === 0 && (
            <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>Distribución MoSCoW válida — cumple Checklist C6 y M4 (M3-04 §8)</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Distribución guardada */}
      {srs.distribucionMoSCoW && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Distribución guardada en el SRS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 text-sm">
              <span>Must: <strong>{srs.distribucionMoSCoW.must}%</strong></span>
              <span>Should: <strong>{srs.distribucionMoSCoW.should}%</strong></span>
              <span>Could: <strong>{srs.distribucionMoSCoW.could}%</strong></span>
              <span>Won't: <strong>{srs.distribucionMoSCoW.wont}%</strong></span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!distribucion || actualizar.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          {actualizar.isPending ? 'Guardando…' : 'Guardar distribución MoSCoW'}
        </Button>
      </div>
    </form>
  )
}

// ──────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ──────────────────────────────────────────────────────────

interface Fase6PanelProps {
  proyecto: Proyecto
  srs: SRS
  onAdvance?: () => void
}

const TABS = [
  { id: 'f601', label: 'F6-01 Estrategia de entrega' },
  { id: 'f602', label: 'F6-02 Distribución MoSCoW' },
] as const

export function Fase6Panel({ proyecto, srs, onAdvance }: Fase6PanelProps) {
  const [tab, setTab] = useState<typeof TABS[number]['id']>('f601')

  const { data: reqs = [] } = useRequerimientos(srs.id)
  const rnfProceso = reqs.filter(r => r.tipo === 'no_funcional' && r.categoria === 'proceso')

  const f601Done = !!srs.tipoSRS
  const f602Done = !!srs.distribucionMoSCoW

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Fase 6 — Planificación y Coherencia SRS-M2</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Vincula la estrategia de entrega (M2-07) con el SRS y valida la distribución de esfuerzo MoSCoW.
          Esta fase no bloquea F7.
        </p>
      </div>

      {/* Progreso */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { id: 'f601', label: 'F6-01 Estrategia de entrega', done: f601Done },
          { id: 'f602', label: 'F6-02 Distribución MoSCoW', done: f602Done },
        ].map(item => (
          <div
            key={item.id}
            className={`flex items-center gap-2 rounded-md border p-2.5 text-sm cursor-pointer transition-colors
              ${tab === item.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
            onClick={() => setTab(item.id as typeof tab)}
          >
            {item.done ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/40" />
            )}
            <span className={item.done ? 'text-muted-foreground' : 'font-medium'}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px
              ${tab === t.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      {tab === 'f601' && (
        <F601StrategiaEntrega proyecto={proyecto} srs={srs} rnfProceso={rnfProceso} />
      )}
      {tab === 'f602' && (
        <F602DistribucionMoscow srs={srs} reqs={reqs} />
      )}

      {/* Avanzar a F7 */}
      {onAdvance && (
        <div className="flex justify-end pt-2 border-t">
          <Button onClick={onAdvance} variant="outline">
            Avanzar a Fase 7 — Validación →
          </Button>
        </div>
      )}
    </div>
  )
}
