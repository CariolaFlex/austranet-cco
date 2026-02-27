'use client'

// ============================================================
// COMPONENTE: Fase7Panel — Validación, Pruebas, CCB y GATE 2
// Fuentes: M3-05 (validación), M3-10 (pruebas), M3-09 (CCB/SCR)
// Tareas: F7-01 | F7-02 | F7-03 | F7-04 | GATE 2
// ============================================================

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  CheckCircle2, AlertTriangle, Plus, Save, ClipboardList,
  TestTube2, Users, BarChart2, ShieldCheck, RefreshCw, MessageSquare,
  XCircle, Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib'
import { Input, Textarea, FormField, Select } from '@/components/ui/input'
import {
  useActualizarSRS,
  useInicializarChecklist, useActualizarItemChecklist,
  useAgregarObservacion, useResolverObservacion,
  useRegistrarIteracionBucle,
  useRequerimientos, useCrearCasoPrueba, useCasosPrueba,
  useCrearSCRSRS, useAvanzarSCRSRS,
  useAprobarGate2,
} from '@/hooks/useAlcance'
import { CHECKLIST_SRS_21_ITEMS, ESTADO_SCR_SRS_CONFIG, ROLES_CCB_SRS_CONFIG } from '@/constants/alcance'
import type {
  Proyecto, SRS, ItemChecklistSRS, ObservacionValidacion,
  SolicitudCambioSRS, CasoPrueba, MiembroCCBSRS,
} from '@/types'

// ──────────────────────────────────────────────────────────
// SCHEMAS
// ──────────────────────────────────────────────────────────

const observacionSchema = z.object({
  seccionAfectada: z.string().min(2, 'Indica la sección afectada'),
  descripcion: z.string().min(10, 'Describe la observación'),
  tipoObservacion: z.enum(['error', 'inconsistencia', 'ambigüedad', 'omisión', 'mejora']),
  autor: z.string().min(2, 'Nombre del revisor requerido'),
})
type ObservacionForm = z.infer<typeof observacionSchema>

const casoPruebaSchema = z.object({
  requerimientoId: z.string().min(1, 'Selecciona un RF Must'),
  titulo: z.string().min(5, 'Título requerido'),
  tipo: z.enum(['aceptacion_alfa', 'aceptacion_beta', 'funcional', 'no_funcional']),
  dado: z.string().min(5, 'Precondición requerida'),
  cuando: z.string().min(5, 'Acción requerida'),
  entonces: z.string().min(5, 'Resultado esperado requerido'),
  responsable: z.string().optional(),
})
type CasoPruebaForm = z.infer<typeof casoPruebaSchema>

const scrSchema = z.object({
  titulo: z.string().min(5, 'Título requerido'),
  solicitante: z.string().min(2, 'Nombre del solicitante requerido'),
  descripcion: z.string().min(10, 'Descripción requerida'),
  justificacion: z.string().min(10, 'Justificación requerida'),
  causaRaiz: z.enum([
    'cambio_negocio', 'error_especificacion', 'nuevo_requerimiento',
    'factor_externo', 'decision_tecnica',
  ]),
  urgencia: z.enum(['baja', 'media', 'alta', 'critica']),
  tipoCambio: z.enum(['menor', 'mayor']),
  requerimientosAfectados: z.string().min(1, 'Indica al menos un RF afectado (IDs separados por coma)'),
})
type SCRForm = z.infer<typeof scrSchema>

const gate2Schema = z.object({
  aprobadoPorNombre: z.string().min(2, 'Nombre del firmante requerido'),
  aprobadoPorId: z.string().min(1, 'ID del stakeholder firmante requerido'),
  confirmacion: z.literal(true, { errorMap: () => ({ message: 'Debes confirmar antes de aprobar' }) }),
})
type Gate2Form = z.infer<typeof gate2Schema>

// ──────────────────────────────────────────────────────────
// HELPER: estado del checklist
// ──────────────────────────────────────────────────────────

function getChecklistStats(items: ItemChecklistSRS[]) {
  const total = items.length
  const cumplidos = items.filter(i => i.estado === 'cumplido').length
  const bloqueadores = CHECKLIST_SRS_21_ITEMS
    .filter(def => def.bloqueaSiIncumple)
    .filter(def => {
      const item = items.find(i => i.codigo === def.codigo)
      return !item || item.estado !== 'cumplido'
    })
  return { total, cumplidos, bloqueadores }
}

// ──────────────────────────────────────────────────────────
// SUB-COMPONENTE: F7-01 Checklist 21 ítems
// ──────────────────────────────────────────────────────────

function F701Checklist({ srs, proyectoId }: { srs: SRS; proyectoId: string }) {
  const inicializar = useInicializarChecklist()
  const actualizar = useActualizarItemChecklist()
  const agregarObs = useAgregarObservacion()
  const resolverObs = useResolverObservacion()
  const registrarBucle = useRegistrarIteracionBucle()
  const [showObsForm, setShowObsForm] = useState(false)
  const [resolviendo, setResolviendo] = useState<string | null>(null)
  const [resolucionTexto, setResolucionTexto] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ObservacionForm>({
    resolver: zodResolver(observacionSchema),
    defaultValues: { tipoObservacion: 'error' },
  })

  const checklist = srs.checklistValidacion ?? []
  const observaciones = srs.observacionesValidacion ?? []
  const stats = getChecklistStats(checklist)

  const handleInicializar = () => {
    inicializar.mutate({ srsId: srs.id, proyectoId })
  }

  const toggleItem = (codigo: string, estadoActual: ItemChecklistSRS['estado']) => {
    const siguiente =
      estadoActual === 'pendiente' ? 'cumplido' :
      estadoActual === 'cumplido' ? 'no_aplica' :
      'pendiente'
    actualizar.mutate({ srsId: srs.id, proyectoId, codigo, estado: siguiente })
  }

  const onSubmitObs = (data: ObservacionForm) => {
    agregarObs.mutate({
      srsId: srs.id,
      proyectoId,
      data: {
        ...data,
        tipoObservacion: data.tipoObservacion as ObservacionValidacion['tipoObservacion'],
      },
    }, {
      onSuccess: () => { reset(); setShowObsForm(false) },
    })
  }

  const handleResolver = (obsId: string) => {
    if (!resolucionTexto.trim()) return
    resolverObs.mutate({
      srsId: srs.id,
      proyectoId,
      obsId,
      resolucionTexto,
    }, { onSuccess: () => { setResolviendo(null); setResolucionTexto('') } })
  }

  const handleBucleF7F5 = () => {
    const obsAbiertas = observaciones.filter(o => !o.resuelto)
    if (obsAbiertas.length === 0) return
    registrarBucle.mutate({
      srsId: srs.id,
      proyectoId,
      fase: 'F7→F5',
      motivo: `${obsAbiertas.length} observaciones de validación requieren corrección en F5`,
      reqsAfectados: [],
    })
  }

  const grupos = ['completitud', 'consistencia', 'verificabilidad', 'modificabilidad'] as const
  const GRUPO_LABELS: Record<string, string> = {
    completitud: 'Completitud (S1-S8)',
    consistencia: 'Consistencia (C1-C6)',
    verificabilidad: 'Verificabilidad (V1-V5)',
    modificabilidad: 'Modificabilidad (M1-M4)',
  }

  const ESTADO_ICONO = {
    cumplido: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    pendiente: <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/50" />,
    no_aplica: <XCircle className="h-4 w-4 text-muted-foreground/40" />,
  }

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border bg-card p-3 text-center">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.cumplidos}</p>
          <p className="text-xs text-muted-foreground mt-1">Ítems cumplidos</p>
        </div>
        <div className="rounded-lg border bg-card p-3 text-center">
          <p className="text-2xl font-bold text-muted-foreground">{stats.total}</p>
          <p className="text-xs text-muted-foreground mt-1">Total ítems</p>
        </div>
        <div className="rounded-lg border bg-card p-3 text-center">
          <p className={`text-2xl font-bold ${stats.bloqueadores.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
            {stats.bloqueadores.length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Bloqueadores pendientes</p>
        </div>
      </div>

      {checklist.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center space-y-3">
            <ClipboardList className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">
              El checklist de 21 ítems aún no está inicializado.
            </p>
            <Button onClick={handleInicializar} disabled={inicializar.isPending}>
              <Plus className="h-4 w-4 mr-2" />
              Inicializar checklist de calidad (21 ítems)
            </Button>
          </CardContent>
        </Card>
      ) : (
        grupos.map(grupo => {
          const itemsDef = CHECKLIST_SRS_21_ITEMS.filter(d => d.grupo === grupo)
          return (
            <Card key={grupo}>
              <CardHeader>
                <CardTitle className="text-base">{GRUPO_LABELS[grupo]}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {itemsDef.map(def => {
                  const item = checklist.find(i => i.codigo === def.codigo)
                  const estado = item?.estado ?? 'pendiente'
                  return (
                    <div
                      key={def.codigo}
                      className="flex items-start gap-3 rounded-md border p-2.5 hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => toggleItem(def.codigo, estado)}
                    >
                      <div className="mt-0.5">{ESTADO_ICONO[estado]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-muted-foreground">{def.codigo}</span>
                          {def.bloqueaSiIncumple && estado !== 'cumplido' && (
                            <Badge variant="destructive" className="text-xs py-0">Bloqueador</Badge>
                          )}
                        </div>
                        <p className="text-sm mt-0.5">{def.descripcion}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Fase: {def.faseRevision}</p>
                        {item?.nota && (
                          <p className="text-xs italic text-muted-foreground mt-0.5">Nota: {item.nota}</p>
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs shrink-0 ${
                          estado === 'cumplido' ? 'border-green-300 text-green-700 dark:text-green-400' :
                          estado === 'no_aplica' ? 'text-muted-foreground' :
                          'border-amber-300 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {estado === 'cumplido' ? 'Cumplido' : estado === 'no_aplica' ? 'N/A' : 'Pendiente'}
                      </Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )
        })
      )}

      {/* Observaciones */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Observaciones de la revisión ({observaciones.length})
            </CardTitle>
            <div className="flex gap-2">
              {observaciones.filter(o => !o.resuelto).length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBucleF7F5}
                  disabled={registrarBucle.isPending}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Registrar bucle F7→F5
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setShowObsForm(!showObsForm)}>
                <Plus className="h-3 w-3 mr-1" />
                Nueva observación
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showObsForm && (
            <form onSubmit={handleSubmit(onSubmitObs)} className="rounded-md border bg-muted/20 p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Sección afectada" error={errors.seccionAfectada?.message}>
                  <Input placeholder="ej: Sección 3 — RF-042" {...register('seccionAfectada')} />
                </FormField>
                <FormField label="Tipo" error={errors.tipoObservacion?.message}>
                  <Select {...register('tipoObservacion')}>
                    {['error', 'inconsistencia', 'ambigüedad', 'omisión', 'mejora'].map(t => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </Select>
                </FormField>
              </div>
              <FormField label="Descripción" error={errors.descripcion?.message}>
                <Textarea placeholder="Describe la observación con precisión" {...register('descripcion')} />
              </FormField>
              <FormField label="Autor (nombre del revisor)" error={errors.autor?.message}>
                <Input placeholder="Nombre completo" {...register('autor')} />
              </FormField>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowObsForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" disabled={agregarObs.isPending}>
                  Agregar observación
                </Button>
              </div>
            </form>
          )}

          {observaciones.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Sin observaciones registradas. Agrega comentarios de la revisión conjunta.
            </p>
          ) : (
            <div className="space-y-2">
              {observaciones.map(obs => (
                <div
                  key={obs.id}
                  className={`rounded-md border p-3 space-y-2 ${obs.resuelto ? 'opacity-60 bg-muted/20' : 'bg-card'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">{obs.tipoObservacion}</Badge>
                        <span className="text-xs text-muted-foreground">{obs.seccionAfectada}</span>
                        <span className="text-xs text-muted-foreground">— {obs.autor}</span>
                      </div>
                      <p className="text-sm mt-1">{obs.descripcion}</p>
                      {obs.resuelto && obs.resolucionTexto && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          Resolución: {obs.resolucionTexto}
                        </p>
                      )}
                    </div>
                    {obs.resuelto ? (
                      <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                        Resuelta
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setResolviendo(obs.id)}
                      >
                        Resolver
                      </Button>
                    )}
                  </div>
                  {resolviendo === obs.id && (
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Texto de resolución"
                        value={resolucionTexto}
                        onChange={e => setResolucionTexto(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleResolver(obs.id)}
                        disabled={resolverObs.isPending}
                      >
                        Confirmar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setResolviendo(null); setResolucionTexto('') }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// SUB-COMPONENTE: F7-02 Casos de prueba
// ──────────────────────────────────────────────────────────

function F702CasosPrueba({ srs, proyectoId }: { srs: SRS; proyectoId: string }) {
  const { data: reqs = [] } = useRequerimientos(srs.id)
  const { data: casosPrueba = [] } = useCasosPrueba(srs.id)
  const crearCP = useCrearCasoPrueba()
  const [rfSeleccionado, setRfSeleccionado] = useState<string | null>(null)

  const rfMust = reqs.filter(r => r.tipo === 'funcional' && r.prioridad === 'must')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CasoPruebaForm>({
    resolver: zodResolver(casoPruebaSchema),
    defaultValues: { tipo: 'aceptacion_alfa' },
  })

  const onSubmit = (data: CasoPruebaForm) => {
    const rf = reqs.find(r => r.id === data.requerimientoId)
    if (!rf) return
    crearCP.mutate({
      srsId: srs.id,
      proyectoId,
      codigo: `CP-${String(casosPrueba.length + 1).padStart(3, '0')}`,
      requerimientoId: data.requerimientoId,
      codigoRF: rf.codigo,
      titulo: data.titulo,
      tipo: data.tipo,
      dado: data.dado,
      cuando: data.cuando,
      entonces: data.entonces,
      estado: 'pendiente',
      responsable: data.responsable,
      creadoPor: 'usuario',
    }, {
      onSuccess: () => { reset(); setRfSeleccionado(null) },
    })
  }

  const cpPorRF = useMemo(() => {
    const map: Record<string, CasoPrueba[]> = {}
    casosPrueba.forEach(cp => {
      if (!map[cp.requerimientoId]) map[cp.requerimientoId] = []
      map[cp.requerimientoId].push(cp)
    })
    return map
  }, [casosPrueba])

  const cobertura = rfMust.length > 0
    ? Math.round((rfMust.filter(rf => cpPorRF[rf.id]?.length > 0).length / rfMust.length) * 100)
    : 0

  const ESTADO_CP_COLORS: Record<string, string> = {
    pendiente: 'border-gray-300 text-gray-600',
    ejecutado_ok: 'border-green-300 text-green-700 dark:text-green-400',
    ejecutado_fallo: 'border-red-300 text-red-700 dark:text-red-400',
    bloqueado: 'border-amber-300 text-amber-700 dark:text-amber-400',
  }

  return (
    <div className="space-y-6">
      {/* KPI Cobertura */}
      <div className="rounded-lg border bg-card p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Cobertura de CPs por RF Must Have</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Checklist V3: Todo RF Must debe tener al menos un CP vinculado
          </p>
        </div>
        <div className="text-right">
          <p className={`text-3xl font-bold ${cobertura === 100 ? 'text-green-500' : cobertura >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
            {cobertura}%
          </p>
          <p className="text-xs text-muted-foreground">
            {rfMust.filter(rf => cpPorRF[rf.id]?.length > 0).length} / {rfMust.length} RFs
          </p>
        </div>
      </div>

      {rfMust.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No hay RFs Must Have. Ve a F5-02 para crear requerimientos.
        </p>
      ) : (
        rfMust.map(rf => {
          const cps = cpPorRF[rf.id] ?? []
          const isExpanded = rfSeleccionado === rf.id
          return (
            <Card key={rf.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-mono">{rf.codigo}</CardTitle>
                    <p className="text-sm mt-0.5">{rf.titulo}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {cps.length} CP{cps.length !== 1 ? 's' : ''}
                    </Badge>
                    {cps.length === 0 && (
                      <Badge variant="destructive" className="text-xs">Sin CP</Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRfSeleccionado(isExpanded ? null : rf.id)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {isExpanded ? 'Cerrar' : 'Agregar CP'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {/* Casos existentes */}
                {cps.map(cp => (
                  <div key={cp.id} className="rounded-md border bg-muted/20 p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold">{cp.codigo} — {cp.titulo}</span>
                      <Badge variant="outline" className={`text-xs ${ESTADO_CP_COLORS[cp.estado]}`}>
                        {cp.estado.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground"><strong>DADO:</strong> {cp.dado}</p>
                    <p className="text-xs text-muted-foreground"><strong>CUANDO:</strong> {cp.cuando}</p>
                    <p className="text-xs text-muted-foreground"><strong>ENTONCES:</strong> {cp.entonces}</p>
                  </div>
                ))}

                {/* Formulario nuevo CP */}
                {isExpanded && (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="rounded-md border border-primary/20 bg-primary/5 p-4 space-y-3"
                  >
                    <input type="hidden" value={rf.id} {...register('requerimientoId')} />
                    <p className="text-sm font-medium text-primary">Nuevo caso de prueba para {rf.codigo}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Título del CP" error={errors.titulo?.message}>
                        <Input placeholder="ej: Validar login con credenciales correctas" {...register('titulo')} />
                      </FormField>
                      <FormField label="Tipo de prueba" error={errors.tipo?.message}>
                        <Select {...register('tipo')}>
                          {[
                            ['aceptacion_alfa', 'Aceptación Alfa'],
                            ['aceptacion_beta', 'Aceptación Beta'],
                            ['funcional', 'Funcional'],
                            ['no_funcional', 'No Funcional'],
                          ].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                        </Select>
                      </FormField>
                    </div>
                    <FormField label="DADO (precondición del sistema)" error={errors.dado?.message}>
                      <Input placeholder="ej: El sistema está disponible y el usuario tiene credenciales válidas" {...register('dado')} />
                    </FormField>
                    <FormField label="CUANDO (acción del actor)" error={errors.cuando?.message}>
                      <Input placeholder="ej: El usuario ingresa email y contraseña correctos y hace clic en Ingresar" {...register('cuando')} />
                    </FormField>
                    <FormField label="ENTONCES (resultado esperado verificable)" error={errors.entonces?.message}>
                      <Input placeholder="ej: El sistema redirige al dashboard en < 2 segundos y muestra el nombre del usuario" {...register('entonces')} />
                    </FormField>
                    <FormField label="Responsable (opcional)">
                      <Input placeholder="Nombre del QA responsable" {...register('responsable')} />
                    </FormField>
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="ghost" size="sm" onClick={() => setRfSeleccionado(null)}>
                        Cancelar
                      </Button>
                      <Button type="submit" size="sm" disabled={crearCP.isPending}>
                        <TestTube2 className="h-3 w-3 mr-1" />
                        Crear CP
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// SUB-COMPONENTE: F7-03 CCB del SRS
// ──────────────────────────────────────────────────────────

function F703CCB({ srs, proyectoId }: { srs: SRS; proyectoId: string }) {
  const actualizarSRS = useActualizarSRS()
  const crearSCR = useCrearSCRSRS()
  const avanzarSCR = useAvanzarSCRSRS()
  const [showSCRForm, setShowSCRForm] = useState(false)
  const [showCCBForm, setShowCCBForm] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SCRForm>({
    resolver: zodResolver(scrSchema),
    defaultValues: { causaRaiz: 'cambio_negocio', urgencia: 'media', tipoCambio: 'menor' },
  })

  const [nombreMiembro, setNombreMiembro] = useState('')
  const [rolMiembro, setRolMiembro] = useState<MiembroCCBSRS['rol']>('analista_responsable')

  const ccb = srs.ccbSRS ?? []
  const scrs = srs.solicitudesCambioSRS ?? []

  const onSubmitSCR = (data: SCRForm) => {
    crearSCR.mutate({
      srsId: srs.id,
      proyectoId,
      datos: {
        titulo: data.titulo,
        solicitante: data.solicitante,
        fechaSolicitud: new Date(),
        urgencia: data.urgencia,
        descripcion: data.descripcion,
        justificacion: data.justificacion,
        causaRaiz: data.causaRaiz,
        requerimientosAfectados: data.requerimientosAfectados.split(',').map(s => s.trim()),
        tipoCambio: data.tipoCambio,
      },
    }, { onSuccess: () => { reset(); setShowSCRForm(false) } })
  }

  const agregarMiembroCCB = () => {
    if (!nombreMiembro.trim()) return
    const nuevo: MiembroCCBSRS = {
      nombre: nombreMiembro.trim(),
      rol: rolMiembro,
      esObligatorio: ROLES_CCB_SRS_CONFIG[rolMiembro].esObligatorio,
    }
    actualizarSRS.mutate({
      id: srs.id,
      data: { ccbSRS: [...ccb, nuevo] },
    }, { onSuccess: () => { setNombreMiembro(''); setShowCCBForm(false) } })
  }

  const CAUSA_LABELS: Record<string, string> = {
    cambio_negocio: 'Cambio de negocio',
    error_especificacion: 'Error en especificación',
    nuevo_requerimiento: 'Nuevo requerimiento',
    factor_externo: 'Factor externo',
    decision_tecnica: 'Decisión técnica',
  }

  return (
    <div className="space-y-6">
      {/* Composición CCB */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Composición del CCB del SRS
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowCCBForm(!showCCBForm)}>
              <Plus className="h-3 w-3 mr-1" />
              Agregar miembro
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            CCB del SRS — INDEPENDIENTE del CCB del Repositorio (M2-06). Gestiona cambios al contrato de requerimientos.
          </p>

          {showCCBForm && (
            <div className="rounded-md border bg-muted/20 p-3 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium">Nombre</label>
                  <Input
                    value={nombreMiembro}
                    onChange={e => setNombreMiembro(e.target.value)}
                    placeholder="Nombre completo"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Rol en CCB</label>
                  <Select
                    value={rolMiembro}
                    onChange={e => setRolMiembro(e.target.value as MiembroCCBSRS['rol'])}
                    className="mt-1"
                  >
                    {Object.entries(ROLES_CCB_SRS_CONFIG).map(([val, cfg]) => (
                      <option key={val} value={val}>
                        {cfg.label}{cfg.esObligatorio ? ' (Obligatorio)' : ''}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowCCBForm(false)}>Cancelar</Button>
                <Button type="button" size="sm" onClick={agregarMiembroCCB} disabled={actualizarSRS.isPending}>
                  Agregar
                </Button>
              </div>
            </div>
          )}

          {ccb.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-3">
              Sin miembros CCB. Agrega al menos el Analista Responsable y el Gestor del Proyecto.
            </p>
          ) : (
            <div className="divide-y">
              {ccb.map((m, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{m.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      {ROLES_CCB_SRS_CONFIG[m.rol]?.label ?? m.rol}
                    </p>
                  </div>
                  {m.esObligatorio && (
                    <Badge variant="outline" className="text-xs">Obligatorio</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SCRs del SRS */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Solicitudes de Cambio al SRS — post-aprobación ({scrs.length})
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowSCRForm(!showSCRForm)}>
              <Plus className="h-3 w-3 mr-1" />
              Nueva SCR-SRS
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {showSCRForm && (
            <form onSubmit={handleSubmit(onSubmitSCR)} className="rounded-md border bg-muted/20 p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Título" error={errors.titulo?.message}>
                  <Input placeholder="Título conciso de la SCR" {...register('titulo')} />
                </FormField>
                <FormField label="Solicitante" error={errors.solicitante?.message}>
                  <Input placeholder="Nombre del solicitante" {...register('solicitante')} />
                </FormField>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <FormField label="Urgencia">
                  <Select {...register('urgencia')}>
                    {['baja', 'media', 'alta', 'critica'].map(v => (
                      <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Tipo de cambio">
                  <Select {...register('tipoCambio')}>
                    <option value="menor">Menor (analista + gestor)</option>
                    <option value="mayor">Mayor (requiere cliente)</option>
                  </Select>
                </FormField>
                <FormField label="Causa raíz">
                  <Select {...register('causaRaiz')}>
                    {Object.entries(CAUSA_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </Select>
                </FormField>
              </div>
              <FormField label="Descripción" error={errors.descripcion?.message}>
                <Textarea placeholder="Describe el cambio solicitado" {...register('descripcion')} />
              </FormField>
              <FormField label="Justificación" error={errors.justificacion?.message}>
                <Textarea placeholder="¿Por qué es necesario este cambio?" {...register('justificacion')} />
              </FormField>
              <FormField label="RFs afectados (IDs separados por coma)" error={errors.requerimientosAfectados?.message}>
                <Input placeholder="ej: RF-001, RF-003" {...register('requerimientosAfectados')} />
              </FormField>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowSCRForm(false)}>Cancelar</Button>
                <Button type="submit" size="sm" disabled={crearSCR.isPending}>Crear SCR-SRS</Button>
              </div>
            </form>
          )}

          {scrs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay solicitudes de cambio al SRS. El CCB gestiona cambios post-aprobación.
            </p>
          ) : (
            scrs.map(scr => (
              <div key={scr.id} className="rounded-md border bg-card p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold">{scr.codigo}</span>
                      <Badge
                        variant="outline"
                        className={`text-xs border-${ESTADO_SCR_SRS_CONFIG[scr.estado]?.color || 'gray'}-300`}
                      >
                        {ESTADO_SCR_SRS_CONFIG[scr.estado]?.label}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${scr.urgencia === 'critica' ? 'border-red-400 text-red-700' : ''}`}
                      >
                        {scr.urgencia}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium mt-1">{scr.titulo}</p>
                    <p className="text-xs text-muted-foreground">{CAUSA_LABELS[scr.causaRaiz]} — {scr.solicitante}</p>
                  </div>
                </div>
                {scr.descripcion && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{scr.descripcion}</p>
                )}
                {/* Avanzar estado */}
                {ESTADO_SCR_SRS_CONFIG[scr.estado]?.siguiente?.length ? (
                  <div className="flex gap-2 flex-wrap">
                    {ESTADO_SCR_SRS_CONFIG[scr.estado].siguiente!.map(sig => (
                      <Button
                        key={sig}
                        variant="outline"
                        size="sm"
                        onClick={() => avanzarSCR.mutate({
                          srsId: srs.id,
                          proyectoId,
                          scrId: scr.id,
                          datos: { nuevoEstado: sig },
                        })}
                        disabled={avanzarSCR.isPending}
                      >
                        → {ESTADO_SCR_SRS_CONFIG[sig]?.label}
                      </Button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// SUB-COMPONENTE: F7-04 KPIs dashboard
// ──────────────────────────────────────────────────────────

function F704KPIs({ srs, proyectoId }: { srs: SRS; proyectoId: string }) {
  const { data: reqs = [] } = useRequerimientos(srs.id)
  const { data: casosPrueba = [] } = useCasosPrueba(srs.id)

  const stats = useMemo(() => {
    const rfMust = reqs.filter(r => r.tipo === 'funcional' && r.prioridad === 'must')
    const rfConCP = rfMust.filter(rf => casosPrueba.some(cp => cp.requerimientoId === rf.id))
    const checklist = srs.checklistValidacion ?? []
    const obsAbiertas = (srs.observacionesValidacion ?? []).filter(o => !o.resuelto)
    const obsTotal = (srs.observacionesValidacion ?? []).length
    const bucles = srs.iteracionesBucle ?? []

    return {
      totalReqs: reqs.length,
      rfMust: rfMust.length,
      rfShould: reqs.filter(r => r.tipo === 'funcional' && r.prioridad === 'should').length,
      rfCould: reqs.filter(r => r.tipo === 'funcional' && r.prioridad === 'could').length,
      rfWont: reqs.filter(r => r.tipo === 'funcional' && r.prioridad === 'wont').length,
      rnf: reqs.filter(r => r.tipo === 'no_funcional').length,
      rd: reqs.filter(r => r.tipo === 'dominio').length,
      coberturaCP: rfMust.length ? Math.round(rfConCP.length / rfMust.length * 100) : 0,
      checklistPct: checklist.length ? Math.round(checklist.filter(i => i.estado === 'cumplido').length / checklist.length * 100) : 0,
      obsAbiertas,
      obsTotal,
      bucles,
      ciclosValidacion: srs.contadorCiclosValidacion ?? 0,
    }
  }, [reqs, casosPrueba, srs])

  const KPICard = ({ title, value, sub, color = '' }: { title: string; value: string | number; sub?: string; color?: string }) => (
    <div className="rounded-lg border bg-card p-3 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs font-medium mt-0.5">{title}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Requerimientos */}
      <Card>
        <CardHeader><CardTitle className="text-base">Requerimientos totales</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            <KPICard title="Total" value={stats.totalReqs} />
            <KPICard title="Must" value={stats.rfMust} color="text-red-600 dark:text-red-400" />
            <KPICard title="Should" value={stats.rfShould} color="text-amber-600 dark:text-amber-400" />
            <KPICard title="Could" value={stats.rfCould} color="text-blue-600 dark:text-blue-400" />
            <KPICard title="RNF" value={stats.rnf} color="text-purple-600 dark:text-purple-400" />
            <KPICard title="RD" value={stats.rd} color="text-teal-600 dark:text-teal-400" />
          </div>
        </CardContent>
      </Card>

      {/* Calidad */}
      <Card>
        <CardHeader><CardTitle className="text-base">Indicadores de calidad</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <KPICard
              title="Cobertura CPs (V3)"
              value={`${stats.coberturaCP}%`}
              sub="Must con CP vinculado"
              color={stats.coberturaCP === 100 ? 'text-green-500' : stats.coberturaCP >= 60 ? 'text-amber-500' : 'text-red-500'}
            />
            <KPICard
              title="Checklist completado"
              value={`${stats.checklistPct}%`}
              sub="21 ítems de calidad"
              color={stats.checklistPct >= 90 ? 'text-green-500' : stats.checklistPct >= 60 ? 'text-amber-500' : 'text-red-500'}
            />
            <KPICard
              title="Observaciones abiertas"
              value={stats.obsAbiertas.length}
              sub={`de ${stats.obsTotal} totales`}
              color={stats.obsAbiertas.length === 0 ? 'text-green-500' : 'text-amber-500'}
            />
          </div>
        </CardContent>
      </Card>

      {/* Ciclos e iteraciones */}
      <Card>
        <CardHeader><CardTitle className="text-base">Historial de iteraciones</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {stats.ciclosValidacion > 2 && (
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>
                {stats.ciclosValidacion} ciclos de validación — más de 3 ciclos activa alerta en M2-03 (riesgo de alcance indefinido).
              </span>
            </div>
          )}
          {stats.bucles.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin iteraciones de bucle registradas.</p>
          ) : (
            <div className="divide-y">
              {stats.bucles.map((b, i) => (
                <div key={i} className="py-2 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{b.fase}</Badge>
                      <span className="text-xs text-muted-foreground">Iteración #{b.iteracion}</span>
                    </div>
                    <p className="text-sm mt-0.5">{b.motivo}</p>
                    {b.reqsAfectados.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        RFs afectados: {b.reqsAfectados.join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(b.fechaRetorno).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// SUB-COMPONENTE: GATE 2 — Aprobación formal SRS v1.0
// ──────────────────────────────────────────────────────────

function Gate2Aprobacion({ srs, proyectoId }: { srs: SRS; proyectoId: string }) {
  const aprobar = useAprobarGate2()

  const { register, handleSubmit, formState: { errors } } = useForm<Gate2Form>({
    resolver: zodResolver(gate2Schema),
    defaultValues: { confirmacion: false as unknown as true },
  })

  const checklist = srs.checklistValidacion ?? []
  const stats = getChecklistStats(checklist)
  const obsAbiertas = (srs.observacionesValidacion ?? []).filter(o => !o.resuelto)
  const puedeAprobar = stats.bloqueadores.length === 0 && obsAbiertas.length === 0

  const onSubmit = (data: Gate2Form) => {
    aprobar.mutate({
      srsId: srs.id,
      proyectoId,
      aprobadoPorId: data.aprobadoPorId,
      aprobadoPorNombre: data.aprobadoPorNombre,
    })
  }

  if (srs.estado === 'aprobado') {
    return (
      <Card>
        <CardContent className="py-8 text-center space-y-3">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
          <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
            SRS Aprobado — versión 1.0
          </h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Aprobado por: <strong>{srs.aprobadoPorNombre}</strong></p>
            {srs.fechaAprobacion && (
              <p>Fecha: {new Date(srs.fechaAprobacion).toLocaleDateString()}</p>
            )}
          </div>
          <p className="text-sm">
            El proyecto puede avanzar a la Fase 8 (Transición al Desarrollo).
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Pre-requisitos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Pre-requisitos para GATE 2
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              ok: stats.bloqueadores.length === 0,
              label: `Checklist calidad: ${stats.bloqueadores.length === 0 ? 'todos los ítems bloqueadores cumplidos' : `${stats.bloqueadores.length} ítems bloqueadores pendientes: ${stats.bloqueadores.map(b => b.codigo).join(', ')}`}`,
            },
            {
              ok: obsAbiertas.length === 0,
              label: `Observaciones: ${obsAbiertas.length === 0 ? 'todas resueltas' : `${obsAbiertas.length} observaciones abiertas pendientes de resolución`}`,
            },
            {
              ok: !!srs.distribucionMoSCoW,
              label: `Distribución MoSCoW: ${srs.distribucionMoSCoW ? 'registrada' : 'pendiente (F6-02)'}`,
            },
          ].map((req, i) => (
            <div key={i} className="flex items-start gap-2">
              {req.ok ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              )}
              <p className={`text-sm ${req.ok ? 'text-muted-foreground' : 'text-red-700 dark:text-red-400'}`}>
                {req.label}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Formulario de aprobación */}
      {puedeAprobar ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Firma de aprobación formal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="ID del firmante (stakeholder M1-01)" error={errors.aprobadoPorId?.message}>
                  <Input placeholder="ID del stakeholder cliente" {...register('aprobadoPorId')} />
                </FormField>
                <FormField label="Nombre del firmante" error={errors.aprobadoPorNombre?.message}>
                  <Input placeholder="Nombre completo del representante" {...register('aprobadoPorNombre')} />
                </FormField>
              </div>

              <div className="rounded-md border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30 space-y-3">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                  Declaración de aprobación formal
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-500">
                  Al aprobar, el SRS pasa a versión 1.0 y el proyecto avanza a la Fase 8 (Transición al Desarrollo).
                  Cualquier cambio posterior requerirá una SCR-SRS aprobada por el CCB.
                </p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('confirmacion')}
                    className="h-4 w-4 rounded border border-input"
                  />
                  <span className="text-sm font-medium text-amber-800 dark:text-amber-400">
                    Confirmo que el SRS está completo, revisado y listo para la aprobación formal como baseline v1.0
                  </span>
                </label>
                {errors.confirmacion && (
                  <p className="text-xs text-red-600">{errors.confirmacion.message}</p>
                )}
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={aprobar.isPending} className="bg-green-600 hover:bg-green-700">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  {aprobar.isPending ? 'Procesando aprobación…' : 'Aprobar SRS — GATE 2 Go'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800 dark:text-red-400">
              No se puede aprobar — hay pre-requisitos pendientes
            </p>
            <p className="text-sm text-red-700 dark:text-red-500 mt-1">
              Resuelve todos los ítems bloqueadores del checklist y las observaciones abiertas antes de proceder con la aprobación formal.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ──────────────────────────────────────────────────────────

interface Fase7PanelProps {
  proyecto: Proyecto
  srs: SRS
  onAdvance?: () => void
}

const TABS = [
  { id: 'f701', label: 'F7-01 Checklist', icon: ClipboardList },
  { id: 'f702', label: 'F7-02 Casos de prueba', icon: TestTube2 },
  { id: 'f703', label: 'F7-03 CCB SRS', icon: Users },
  { id: 'f704', label: 'F7-04 KPIs', icon: BarChart2 },
  { id: 'gate2', label: 'GATE 2', icon: ShieldCheck },
] as const

export function Fase7Panel({ proyecto, srs, onAdvance }: Fase7PanelProps) {
  const [tab, setTab] = useState<typeof TABS[number]['id']>('f701')

  const checklist = srs.checklistValidacion ?? []
  const stats = getChecklistStats(checklist)
  const obsAbiertas = (srs.observacionesValidacion ?? []).filter(o => !o.resuelto)

  const tabStatus = {
    f701: checklist.length > 0 && stats.bloqueadores.length === 0,
    f702: true, // se mide por cobertura KPI
    f703: (srs.ccbSRS ?? []).length > 0,
    f704: true,
    gate2: srs.estado === 'aprobado',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Fase 7 — Validación, Pruebas y Aprobación</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Valida el SRS mediante checklist 21 ítems, crea casos de prueba por RF Must,
          gestiona el CCB y ejecuta el GATE 2 de aprobación formal.
        </p>
      </div>

      {/* Alertas */}
      {obsAbiertas.length > 0 && (
        <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>
            {obsAbiertas.length} observación{obsAbiertas.length !== 1 ? 'es' : ''} abierta{obsAbiertas.length !== 1 ? 's' : ''}.
            Resuelve las observaciones antes de proceder con GATE 2.
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
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap
                ${tab === t.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
              {tabStatus[t.id] && t.id !== 'f704' && (
                <CheckCircle2 className="h-3 w-3 text-green-500 ml-0.5" />
              )}
            </button>
          )
        })}
      </div>

      {/* Contenido */}
      {tab === 'f701' && <F701Checklist srs={srs} proyectoId={proyecto.id} />}
      {tab === 'f702' && <F702CasosPrueba srs={srs} proyectoId={proyecto.id} />}
      {tab === 'f703' && <F703CCB srs={srs} proyectoId={proyecto.id} />}
      {tab === 'f704' && <F704KPIs srs={srs} proyectoId={proyecto.id} />}
      {tab === 'gate2' && <Gate2Aprobacion srs={srs} proyectoId={proyecto.id} />}

      {/* Avanzar a F8 — solo si GATE 2 aprobado */}
      {onAdvance && srs.estado === 'aprobado' && (
        <div className="flex justify-end pt-2 border-t">
          <Button onClick={onAdvance}>
            Avanzar a Fase 8 — Transición →
          </Button>
        </div>
      )}
    </div>
  )
}
