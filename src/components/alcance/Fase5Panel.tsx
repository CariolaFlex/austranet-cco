'use client'

// ============================================================
// COMPONENTE: Fase5Panel — Especificación y Documentación SRS
// Fuentes: M3-04 (IEEE 830 central), M3-07 (RNF), M3-08 (RD)
// Tareas: F5-01 | F5-02 | F5-03 | F5-04 | F5-05 | F5-06
// ============================================================

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Plus, Save, ChevronRight, AlertTriangle, CheckCircle2,
  FileText, Shield, Trash2, Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib'
import { Input, Textarea, FormField, Select } from '@/components/ui/input'
import {
  useActualizarSRS,
  useRequerimientos, useCrearRequerimiento, useActualizarRequerimiento, useEliminarRequerimiento,
  useTerminosDominio,
} from '@/hooks/useAlcance'
import { PALABRAS_ALERTA_SRS, VOCABULARIO_CONTROLADO_SRS, CATEGORIAS_RNF_CONFIG } from '@/constants/alcance'
import type {
  Proyecto, SRS, Requerimiento, TipoRequerimiento, TipoRNFCategoria,
  EntradaTrazabilidad, SeccionSRS,
} from '@/types'

// -------------------------------------------------------
// SCHEMAS de Requerimiento
// -------------------------------------------------------

const rfSchema = z.object({
  tipo: z.enum(['funcional', 'no_funcional', 'dominio']),
  prioridad: z.enum(['must', 'should', 'could', 'wont']),
  titulo: z.string().min(5, 'Título requerido'),
  descripcion: z.string().min(10, 'Descripción requerida'),
  criterioAceptacion: z.string().optional(),
  fuente: z.string().min(1, 'Stakeholder fuente requerido'),
  categoria: z.string().optional(),
  metricaObjetivo: z.string().optional(),
  metodMedicion: z.string().optional(),
  esVolatil: z.boolean().optional(),
  razonCambio: z.string().optional(),
  justificacionWont: z.string().optional(),
  versionObjetivo: z.string().optional(),
  // Campos RD
  normaOLeyFuente: z.string().optional(),
  verificabilidadRD: z.string().optional(),
})

type RFForm = z.infer<typeof rfSchema>

// -------------------------------------------------------
// HELPER: Validaciones semánticas V1 y V2
// -------------------------------------------------------

function checkAlerta(text: string): string[] {
  const lower = text.toLowerCase()
  return PALABRAS_ALERTA_SRS.filter((p) => lower.includes(p.toLowerCase()))
}

function hasVocabulario(text: string): boolean {
  const lower = text.toLowerCase()
  return VOCABULARIO_CONTROLADO_SRS.some((v) => lower.includes(v.toLowerCase()))
}

// -------------------------------------------------------
// SUB-COMPONENTE: F5-01 Editor SRS 8 Secciones
// -------------------------------------------------------

const SECCIONES_SRS: { key: keyof NonNullable<SRS['secciones']>; label: string; hint: string }[] = [
  { key: 'portada', label: 'Portada', hint: 'Nombre, código, versión, fecha, estado, historial de cambios' },
  { key: 's1_introduccion', label: 'S1 — Introducción', hint: '1.1 Propósito · 1.2 Alcance · 1.3 Glosario · 1.4 Referencias · 1.5 Visión general' },
  { key: 's2_descripcionGeneral', label: 'S2 — Descripción General', hint: '2.1 Perspectiva · 2.2 Funciones Must · 2.3 Usuarios · 2.4 Restricciones · 2.5 Suposiciones · 2.6 Won\'t Have' },
  { key: 's3_rf', label: 'S3 — Requerimientos Funcionales', hint: 'RF organizados por actor o módulo (subsistemas de F4-04)' },
  { key: 's4_rnf', label: 'S4 — RNF con métricas', hint: 'RNF con métricas cuantitativas por las 7 categorías de M3-07' },
  { key: 's5_interfaces', label: 'S5 — Interfaces con Sistemas', hint: 'Interfaces con sistemas externos del Modelo de Contexto (F4-01)' },
  { key: 's6_restriccionesDiseno', label: 'S6 — Restricciones de Diseño', hint: 'Panorama arquitectónico de F4-04 y restricciones tecnológicas' },
  { key: 's7_modelos', label: 'S7 — Índice de Modelos', hint: 'Índice de artefactos UML adjuntados en Fase 4' },
  { key: 's8_apendices', label: 'S8 — Apéndices', hint: 'A: Glosario · B: Stakeholders · C: Cambios · D: Diferidos (Won\'t Have)' },
]

function F501({ srs }: { srs: SRS }) {
  const { mutate: actualizarSRS, isPending } = useActualizarSRS()
  const [secciones, setSecciones] = useState<NonNullable<SRS['secciones']>>(
    srs.secciones ?? {
      portada: { contenido: '', completada: false },
      s1_introduccion: { contenido: '', completada: false },
      s2_descripcionGeneral: { contenido: '', completada: false },
      s3_rf: { contenido: '', completada: false },
      s4_rnf: { contenido: '', completada: false },
      s5_interfaces: { contenido: '', completada: false },
      s6_restriccionesDiseno: { contenido: '', completada: false },
      s7_modelos: { contenido: '', completada: false },
      s8_apendices: { contenido: '', completada: false },
    }
  )
  const [activaKey, setActivaKey] = useState<keyof NonNullable<SRS['secciones']>>('portada')

  const seccionActiva = secciones[activaKey] as SeccionSRS
  const completadas = SECCIONES_SRS.filter((s) => (secciones[s.key] as SeccionSRS).completada).length

  const updateSeccion = (key: keyof NonNullable<SRS['secciones']>, contenido: string) => {
    setSecciones((prev) => ({
      ...prev,
      [key]: { ...((prev[key] as SeccionSRS) ?? {}), contenido },
    }))
  }

  const toggleCompleta = (key: keyof NonNullable<SRS['secciones']>) => {
    setSecciones((prev) => ({
      ...prev,
      [key]: { ...((prev[key] as SeccionSRS) ?? {}), completada: !((prev[key] as SeccionSRS).completada) },
    }))
  }

  const handleSave = () => {
    actualizarSRS({ id: srs.id, data: { secciones } })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Editor del SRS estructura IEEE 830 (Sommerville Fig. 4.7). {completadas}/{SECCIONES_SRS.length} secciones completas.
        </p>
        <Button size="sm" onClick={handleSave} disabled={isPending}>
          <Save className="h-3.5 w-3.5 mr-1" />
          {isPending ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>

      <div className="flex gap-3">
        {/* Lista de secciones */}
        <div className="w-44 flex-shrink-0 space-y-0.5">
          {SECCIONES_SRS.map((s) => {
            const sec = secciones[s.key] as SeccionSRS
            return (
              <button
                key={s.key}
                onClick={() => setActivaKey(s.key)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-xs transition-colors
                  ${activaKey === s.key ? 'bg-primary/10 text-primary' : 'hover:bg-muted/60'}`}
              >
                {sec.completada
                  ? <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                  : <div className="h-3 w-3 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                }
                <span className="truncate">{s.label}</span>
              </button>
            )
          })}
        </div>

        {/* Editor de sección activa */}
        <div className="flex-1 min-w-0 space-y-3">
          {(() => {
            const sec = SECCIONES_SRS.find((s) => s.key === activaKey)!
            const secData = seccionActiva
            return (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{sec.label}</p>
                    <p className="text-xs text-muted-foreground">{sec.hint}</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={secData.completada}
                      onChange={() => toggleCompleta(activaKey)}
                      className="rounded"
                    />
                    <span className="text-xs">Completada</span>
                  </label>
                </div>
                <Textarea
                  value={secData.contenido}
                  onChange={(e) => updateSeccion(activaKey, e.target.value)}
                  placeholder={`Contenido de ${sec.label}...\n\n${sec.hint}`}
                  rows={12}
                  className="font-mono text-sm"
                />
                {secData.ultimaEdicion && (
                  <p className="text-xs text-muted-foreground">
                    Última edición: {new Date(secData.ultimaEdicion).toLocaleString('es-CL')}
                  </p>
                )}
              </>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------
// SUB-COMPONENTE: F5-02 / F5-03 / F5-04 — Lista y Formalización de Requerimientos
// -------------------------------------------------------

function F5Reqs({ srs, proyectoId, tipoFiltro }: {
  srs: SRS; proyectoId: string; tipoFiltro: TipoRequerimiento | 'all'
}) {
  const { data: reqs = [], isLoading } = useRequerimientos(srs.id)
  const { mutate: crearReq, isPending: creando } = useCrearRequerimiento()
  const { mutate: actualizarReq } = useActualizarRequerimiento()
  const { mutate: eliminarReq } = useEliminarRequerimiento()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [alertasV1, setAlertasV1] = useState<string[]>([])

  const filtered = tipoFiltro === 'all'
    ? reqs
    : reqs.filter((r) => r.tipo === tipoFiltro)

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<RFForm>({
    resolver: zodResolver(rfSchema),
    defaultValues: {
      tipo: tipoFiltro === 'all' ? 'funcional' : tipoFiltro,
      prioridad: 'must',
      esVolatil: false,
    },
  })

  const watchedDesc = watch('descripcion') ?? ''
  const watchedTipo = watch('tipo')
  const watchedPrioridad = watch('prioridad')
  const watchedCategoria = watch('categoria') as TipoRNFCategoria | undefined

  const v1Alertas = checkAlerta(watchedDesc)
  const v2Ok = hasVocabulario(watchedDesc)

  const onSubmit = (data: RFForm) => {
    const payload = {
      srsId: srs.id,
      proyectoId,
      codigo: '',
      tipo: data.tipo,
      prioridad: data.prioridad,
      titulo: data.titulo,
      descripcion: data.descripcion,
      criterioAceptacion: data.criterioAceptacion,
      fuente: data.fuente,
      fuenteNombre: data.fuente,
      estado: 'propuesto' as const,
      version: 1,
      categoria: data.categoria as TipoRNFCategoria | undefined,
      metricas: data.metricaObjetivo && data.metodMedicion ? {
        metricaObjetivo: data.metricaObjetivo,
        metodMedicion: data.metodMedicion,
      } : undefined,
      esVolatil: data.esVolatil,
      razonCambio: data.razonCambio,
      justificacionWont: data.justificacionWont,
      versionObjetivo: data.versionObjetivo,
      normaOLeyFuente: data.normaOLeyFuente,
      verificabilidadRD: data.verificabilidadRD,
    }
    crearReq(payload, { onSuccess: () => { reset(); setShowForm(false) } })
  }

  const formalizarReq = (req: Requerimiento) => {
    actualizarReq({ id: req.id, srsId: srs.id, data: { estado: 'aprobado' } })
  }

  const rechazarReq = (req: Requerimiento) => {
    actualizarReq({ id: req.id, srsId: srs.id, data: { estado: 'rechazado' } })
  }

  const categoriaConfig = watchedCategoria ? CATEGORIAS_RNF_CONFIG[watchedCategoria] : null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['propuesto', 'aprobado', 'rechazado', 'diferido'] as const).map((estado) => {
            const count = filtered.filter((r) => r.estado === estado).length
            return count > 0 ? (
              <Badge key={estado} variant="outline" className="text-xs">
                {estado}: {count}
              </Badge>
            ) : null
          })}
        </div>
        <Button size="sm" onClick={() => { reset(); setShowForm(!showForm) }}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Nuevo req.
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <FormField label="Tipo *">
                  <Select {...register('tipo')}>
                    <option value="funcional">RF — Funcional</option>
                    <option value="no_funcional">RNF — No Funcional</option>
                    <option value="dominio">RD — Dominio</option>
                  </Select>
                </FormField>
                <FormField label="Prioridad MoSCoW *">
                  <Select {...register('prioridad')}>
                    <option value="must">Must Have</option>
                    <option value="should">Should Have</option>
                    <option value="could">Could Have</option>
                    <option value="wont">Won&apos;t Have</option>
                  </Select>
                </FormField>
                <FormField label="Stakeholder fuente *" error={errors.fuente?.message}>
                  <Input {...register('fuente')} placeholder="ID o nombre stakeholder" />
                </FormField>
              </div>
              <FormField label="Título *" error={errors.titulo?.message}>
                <Input {...register('titulo')} placeholder="Título conciso del requerimiento" />
              </FormField>
              <FormField label="Descripción *" error={errors.descripcion?.message}>
                <Textarea
                  {...register('descripcion')}
                  placeholder="El sistema DEBE... / DEBERÍA... / PODRÁ..."
                  rows={3}
                />
              </FormField>

              {/* Validaciones V1 y V2 en tiempo real */}
              {watchedDesc.length > 5 && (
                <div className="space-y-1">
                  {v1Alertas.length > 0 && (
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      V1: Palabras de alerta: {v1Alertas.slice(0, 3).join(', ')}
                      {v1Alertas.length > 3 && ` +${v1Alertas.length - 3} más`}
                    </p>
                  )}
                  {!v2Ok && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      V2: Falta vocabulario controlado (DEBE / DEBERÍA / PODRÁ)
                    </p>
                  )}
                  {v1Alertas.length === 0 && v2Ok && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      V1+V2 OK
                    </p>
                  )}
                </div>
              )}

              {/* Criterio de aceptación para Must */}
              {watchedPrioridad === 'must' && watchedTipo === 'funcional' && (
                <FormField label="Criterio de aceptación — DADO/CUANDO/ENTONCES *" error={errors.criterioAceptacion?.message}>
                  <Textarea
                    {...register('criterioAceptacion')}
                    placeholder="DADO: [precondición]&#10;CUANDO: [acción del actor]&#10;ENTONCES: [resultado esperado]"
                    rows={3}
                  />
                </FormField>
              )}

              {/* Campos RNF */}
              {watchedTipo === 'no_funcional' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Categoría RNF *">
                      <Select {...register('categoria')}>
                        <option value="">Seleccionar...</option>
                        {(Object.entries(CATEGORIAS_RNF_CONFIG) as [TipoRNFCategoria, typeof CATEGORIAS_RNF_CONFIG[TipoRNFCategoria]][]).map(([k, v]) => (
                          <option key={k} value={k}>{v.label}</option>
                        ))}
                      </Select>
                    </FormField>
                  </div>
                  {categoriaConfig && (
                    <div className="text-xs text-muted-foreground bg-muted/40 p-2 rounded">
                      <p className="font-medium">{categoriaConfig.label}:</p>
                      <p>{categoriaConfig.descripcion}</p>
                      <p className="mt-1">Ejemplo: <em>{categoriaConfig.ejemploMetrica}</em></p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Métrica objetivo *">
                      <Input {...register('metricaObjetivo')} placeholder="< 200ms, 99.9%, 80%..." />
                    </FormField>
                    <FormField label="Método de medición *">
                      <Input {...register('metodMedicion')} placeholder="JMeter 500 usuarios..." />
                    </FormField>
                  </div>
                </>
              )}

              {/* Campos RD */}
              {watchedTipo === 'dominio' && (
                <>
                  <FormField label="Norma / Ley fuente">
                    <Input {...register('normaOLeyFuente')} placeholder="ISO 9001, Ley 20.393..." />
                  </FormField>
                  <FormField label="Verificabilidad">
                    <Input {...register('verificabilidadRD')} placeholder="Cómo se verifica cumplimiento" />
                  </FormField>
                </>
              )}

              {/* Won't Have */}
              {watchedPrioridad === 'wont' && (
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Justificación Won't *" error={errors.justificacionWont?.message}>
                    <Textarea {...register('justificacionWont')} placeholder="¿Por qué no en esta versión?" rows={2} />
                  </FormField>
                  <FormField label="Versión objetivo">
                    <Input {...register('versionObjetivo')} placeholder="v2.0" />
                  </FormField>
                </div>
              )}

              {/* Volatilidad */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('esVolatil')} className="rounded" />
                <span className="text-sm">Requerimiento volátil (se espera que cambie)</span>
              </label>
              {watch('esVolatil') && (
                <FormField label="Razón del cambio esperado *">
                  <Input {...register('razonCambio')} placeholder="¿Por qué cambiará?" />
                </FormField>
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => { reset(); setShowForm(false) }}>Cancelar</Button>
                <Button type="submit" size="sm" disabled={creando}>
                  {creando ? 'Creando...' : 'Crear requerimiento'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-6 text-sm text-muted-foreground">Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Sin requerimientos de tipo {tipoFiltro}.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((req) => {
            const v1 = checkAlerta(req.descripcion)
            const v2 = hasVocabulario(req.descripcion)
            const hasAlerts = v1.length > 0 || !v2
            return (
              <div key={req.id} className={`p-3 rounded-lg border bg-card ${hasAlerts ? 'border-amber-200' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs font-mono">{req.codigo || '???'}</Badge>
                      <span className="font-medium text-sm">{req.titulo}</span>
                      <Badge variant="outline" className="text-xs">{req.prioridad.toUpperCase()}</Badge>
                      <Badge variant="outline" className={`text-xs ${
                        req.estado === 'aprobado' ? 'bg-green-50 text-green-700 border-green-200' :
                        req.estado === 'rechazado' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-muted'
                      }`}>
                        {req.estado}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{req.descripcion}</p>
                    {hasAlerts && (
                      <div className="mt-1 space-y-0.5">
                        {v1.length > 0 && <p className="text-xs text-amber-600">⚠️ V1: {v1.slice(0, 2).join(', ')}</p>}
                        {!v2 && <p className="text-xs text-red-600">❌ V2: Falta DEBE/DEBERÍA/PODRÁ</p>}
                      </div>
                    )}
                    {req.criterioAceptacion && (
                      <p className="text-xs text-muted-foreground mt-1 font-mono bg-muted/30 p-1 rounded">
                        {req.criterioAceptacion.slice(0, 80)}...
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {req.estado === 'propuesto' && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => formalizarReq(req)} title="Aprobar">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => rechazarReq(req)} title="Rechazar">
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------
// SUB-COMPONENTE: F5-05 Matriz de Trazabilidad
// -------------------------------------------------------

function F505({ srs }: { srs: SRS }) {
  const { mutate: actualizarSRS, isPending } = useActualizarSRS()
  const { data: reqs = [] } = useRequerimientos(srs.id)

  const rfMust = reqs.filter((r) => r.tipo === 'funcional' && r.prioridad === 'must' && r.estado === 'aprobado')
  const matrizActual = srs.matrizTrazabilidad ?? []

  const coberturaAtras = rfMust.length > 0
    ? Math.round((matrizActual.filter((m) => m.stakeholderFuente).length / rfMust.length) * 100)
    : 0

  const coberturaAdelante = rfMust.length > 0
    ? Math.round((matrizActual.filter((m) => m.casoPruebaId).length / rfMust.length) * 100)
    : 0

  const construirMatriz = () => {
    const nuevaMatriz: EntradaTrazabilidad[] = rfMust.map((rf) => {
      const existente = matrizActual.find((m) => m.requerimientoId === rf.id)
      return {
        requerimientoId: rf.id,
        codigoRF: rf.codigo || rf.id,
        tituloRF: rf.titulo,
        stakeholderFuente: existente?.stakeholderFuente ?? rf.fuente,
        stakeholderNombre: existente?.stakeholderNombre ?? rf.fuenteNombre ?? rf.fuente,
        moduloSistema: existente?.moduloSistema ?? rf.moduloSistema,
        casoPruebaId: existente?.casoPruebaId ?? rf.casoPruebaId,
        casoPruebaCodigo: existente?.casoPruebaCodigo,
        estado: (existente?.casoPruebaId && existente?.stakeholderFuente) ? 'completa' :
          existente?.stakeholderFuente ? 'parcial' : 'faltante',
      }
    })
    actualizarSRS({ id: srs.id, data: { matrizTrazabilidad: nuevaMatriz } })
  }

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-primary">{rfMust.length}</p>
            <p className="text-xs text-muted-foreground">RF Must aprobados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className={`text-2xl font-bold ${coberturaAtras === 100 ? 'text-green-600' : coberturaAtras >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
              {coberturaAtras}%
            </p>
            <p className="text-xs text-muted-foreground">Trazabilidad hacia atrás</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className={`text-2xl font-bold ${coberturaAdelante === 100 ? 'text-green-600' : coberturaAdelante >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
              {coberturaAdelante}%
            </p>
            <p className="text-xs text-muted-foreground">Trazabilidad hacia adelante</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button size="sm" onClick={construirMatriz} disabled={isPending}>
          <Save className="h-3.5 w-3.5 mr-1" />
          {isPending ? 'Construyendo...' : 'Construir / Actualizar Matriz'}
        </Button>
      </div>

      {matrizActual.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground">Haz clic en &ldquo;Construir Matriz&rdquo; para generar desde los RF Must aprobados.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-2 font-medium">Código</th>
                <th className="text-left p-2 font-medium">Título</th>
                <th className="text-left p-2 font-medium">Stakeholder</th>
                <th className="text-left p-2 font-medium">Módulo</th>
                <th className="text-left p-2 font-medium">Caso Prueba</th>
                <th className="text-left p-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {matrizActual.map((entry, i) => (
                <tr key={i} className={`border-b ${entry.estado === 'faltante' ? 'bg-red-50/50' : entry.estado === 'parcial' ? 'bg-yellow-50/50' : ''}`}>
                  <td className="p-2 font-mono">{entry.codigoRF}</td>
                  <td className="p-2 max-w-[150px] truncate">{entry.tituloRF}</td>
                  <td className="p-2">{entry.stakeholderNombre || <span className="text-red-500">⚠️ Sin fuente</span>}</td>
                  <td className="p-2">{entry.moduloSistema || <span className="text-muted-foreground">—</span>}</td>
                  <td className="p-2">{entry.casoPruebaCodigo || <span className="text-muted-foreground">Pendiente F7</span>}</td>
                  <td className="p-2">
                    <Badge variant="outline" className={`text-xs ${
                      entry.estado === 'completa' ? 'bg-green-50 text-green-700 border-green-200' :
                      entry.estado === 'parcial' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {entry.estado}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------
// SUB-COMPONENTE: F5-06 Apéndice D — Won't Have
// -------------------------------------------------------

function F506({ srs }: { srs: SRS }) {
  const { data: reqs = [] } = useRequerimientos(srs.id)
  const { mutate: actualizarSRS, isPending } = useActualizarSRS()
  const wontReqs = reqs.filter((r) => r.prioridad === 'wont')
  const incompletos = wontReqs.filter((r) => !r.justificacionWont)

  const generarApendiceD = () => {
    const contenido = [
      '# Apéndice D — Requerimientos Diferidos (Won\'t Have)',
      '',
      'Los siguientes requerimientos fueron identificados durante el proceso IR pero se acordó explícitamente no incluirlos en la versión 1.0:',
      '',
      ...wontReqs.map((r) =>
        `## ${r.codigo || r.titulo}\n**Justificación:** ${r.justificacionWont || 'Sin justificación'}\n**Versión objetivo:** ${r.versionObjetivo || 'No definida'}\n**Dependencias técnicas:** ${r.dependenciasTecnicas?.join(', ') || 'No especificadas'}\n`
      ),
    ].join('\n')

    const secciones = srs.secciones ?? {}
    actualizarSRS({
      id: srs.id,
      data: {
        secciones: {
          ...secciones,
          s8_apendices: {
            contenido: ((secciones as SRS['secciones'])?.s8_apendices?.contenido ?? '') + '\n\n' + contenido,
            completada: false,
          },
        } as SRS['secciones'],
      },
    })
  }

  return (
    <div className="space-y-4">
      {incompletos.length > 0 && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
          <p className="text-xs text-amber-800">
            <strong>Checklist M3/S6:</strong> {incompletos.length} Won&apos;t Have sin justificación. Completa los campos en F2-05.
          </p>
        </div>
      )}

      {wontReqs.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground">Sin requerimientos Won&apos;t Have clasificados. Usa F2-05 para clasificarlos.</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {wontReqs.map((r) => (
              <div key={r.id} className={`p-3 rounded-lg border ${r.justificacionWont ? 'bg-card' : 'bg-amber-50/50 border-amber-200'}`}>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono">{r.codigo || '???'}</Badge>
                  <span className="font-medium text-sm">{r.titulo}</span>
                  {r.justificacionWont ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                </div>
                {r.justificacionWont && <p className="text-xs text-muted-foreground mt-0.5">Justificación: {r.justificacionWont}</p>}
                {r.versionObjetivo && <p className="text-xs text-muted-foreground">Versión: {r.versionObjetivo}</p>}
                {!r.justificacionWont && <p className="text-xs text-amber-600 mt-0.5">⚠️ Sin justificación — completar en F2-05</p>}
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={generarApendiceD}
              disabled={isPending || incompletos.length > 0}
            >
              <FileText className="h-3.5 w-3.5 mr-1" />
              {isPending ? 'Generando...' : 'Generar contenido Apéndice D'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL: Fase5Panel
// -------------------------------------------------------

type Tab5 = 'F5-01' | 'F5-02' | 'F5-03' | 'F5-04' | 'F5-05' | 'F5-06'

const TABS: { id: Tab5; label: string; sublabel: string }[] = [
  { id: 'F5-01', label: 'F5-01', sublabel: 'Editor SRS' },
  { id: 'F5-02', label: 'F5-02', sublabel: 'RF Funcionales' },
  { id: 'F5-03', label: 'F5-03', sublabel: 'RNF' },
  { id: 'F5-04', label: 'F5-04', sublabel: 'RD Dominio' },
  { id: 'F5-05', label: 'F5-05', sublabel: 'Trazabilidad' },
  { id: 'F5-06', label: 'F5-06', sublabel: 'Apéndice D' },
]

interface Fase5Props {
  srs: SRS
  proyecto: Proyecto
  onAdvance: () => void
}

export function Fase5Panel({ srs, proyecto, onAdvance }: Fase5Props) {
  const [tab, setTab] = useState<Tab5>('F5-01')

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Fase 5 — Especificación y Documentación SRS</h2>
        <p className="text-sm text-muted-foreground">
          Editor IEEE 830, formalización RF/RNF/RD con validaciones V1+V2, Matriz de Trazabilidad y Apéndice D.
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
        {tab === 'F5-01' && <F501 srs={srs} />}
        {tab === 'F5-02' && <F5Reqs srs={srs} proyectoId={proyecto.id} tipoFiltro="funcional" />}
        {tab === 'F5-03' && <F5Reqs srs={srs} proyectoId={proyecto.id} tipoFiltro="no_funcional" />}
        {tab === 'F5-04' && <F5Reqs srs={srs} proyectoId={proyecto.id} tipoFiltro="dominio" />}
        {tab === 'F5-05' && <F505 srs={srs} />}
        {tab === 'F5-06' && <F506 srs={srs} />}
      </div>

      <div className="flex justify-end pt-2 border-t">
        <Button variant="outline" onClick={onAdvance}>
          Avanzar a Fase 6 — Planificación <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
