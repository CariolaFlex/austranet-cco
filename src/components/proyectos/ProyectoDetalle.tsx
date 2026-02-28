'use client'

// ============================================================
// COMPONENTE: ProyectoDetalle — Sprint 3D + Sprint 4
// Tabs: Resumen | Equipo | Riesgos | Hitos | Presupuesto | Historial
// Sprint 4: KPIs, CambiarEstadoRiesgo, CerrarProyecto, CancelarProyecto
// ============================================================

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  ArrowLeft, Pencil, RefreshCw, ExternalLink,
  Users, AlertTriangle, Calendar, DollarSign,
  Clock, CheckCircle, XCircle, AlertCircle,
  BarChart3, Info, Shield, GitBranch,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib'
import { ESTADO_PROYECTO_CONFIG, ROUTES } from '@/constants'
import {
  CRITICIDAD_CONFIG,
  TIPO_PROYECTO_CONFIG,
  METODOLOGIAS_CONFIG,
  METODOS_ESTIMACION_CONFIG,
} from '@/constants/proyectos'
import {
  useProyectoHistorial,
  useConfiguracionProyecto,
  useAgregarItemConfiguracion,
  useCrearSCR,
  useAvanzarSCR,
} from '@/hooks/useProyectos'
import { ProyectoKPIs } from './ProyectoKPIs'
import { CambiarEstadoModal } from './CambiarEstadoModal'
import { CambiarEstadoRiesgoModal } from './CambiarEstadoRiesgoModal'
import { CerrarProyectoModal } from './CerrarProyectoModal'
import { CancelarProyectoModal } from './CancelarProyectoModal'
import { PanelCCBRepositorio } from './PanelCCBRepositorio'
import { DashboardMetricasProceso } from './DashboardMetricasProceso'
import type { Proyecto, Entidad, RiesgoProyecto } from '@/types'

// -------------------------------------------------------
// COLOR HELPERS
// -------------------------------------------------------

const colorMap: Record<string, string> = {
  gray:   'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200',
  blue:   'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
  green:  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200',
  red:    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200',
  teal:   'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200',
}

function ColorBadge({ color, label, className }: { color: string; label: string; className?: string }) {
  return (
    <Badge variant="outline" className={`${colorMap[color] || colorMap.gray} ${className || ''}`}>
      {label}
    </Badge>
  )
}

// Nivel de riesgo matriz probabilidad × impacto
const NIVEL_RIESGO_MATRIX: Record<string, Record<string, string>> = {
  muy_baja: { muy_bajo: 'bajo', bajo: 'bajo', medio: 'bajo', alto: 'medio', muy_alto: 'medio' },
  baja: { muy_bajo: 'bajo', bajo: 'bajo', medio: 'medio', alto: 'medio', muy_alto: 'alto' },
  media: { muy_bajo: 'bajo', bajo: 'medio', medio: 'medio', alto: 'alto', muy_alto: 'alto' },
  alta: { muy_bajo: 'medio', bajo: 'medio', medio: 'alto', alto: 'alto', muy_alto: 'critico' },
  muy_alta: { muy_bajo: 'medio', bajo: 'alto', medio: 'alto', alto: 'critico', muy_alto: 'critico' },
}
const NIVEL_COLOR = { bajo: 'green', medio: 'yellow', alto: 'orange', critico: 'red' }

function calcNivelRiesgo(prob: string, imp: string) {
  return NIVEL_RIESGO_MATRIX[prob]?.[imp] ?? 'medio'
}

// -------------------------------------------------------
// TABS DEFINITION
// -------------------------------------------------------

const TABS = [
  { id: 'resumen', label: 'Resumen', icon: Info },
  { id: 'equipo', label: 'Equipo', icon: Users },
  { id: 'riesgos', label: 'Riesgos', icon: AlertTriangle },
  { id: 'hitos', label: 'Hitos', icon: Calendar },
  { id: 'presupuesto', label: 'Presupuesto', icon: DollarSign },
  { id: 'historial', label: 'Historial', icon: Clock },
  { id: 'configuracion', label: 'Repositorio Config.', icon: GitBranch },
  { id: 'metricas', label: 'Métricas GQM', icon: BarChart3 },
]

// -------------------------------------------------------
// COMPONENTE PRINCIPAL
// -------------------------------------------------------

interface ProyectoDetalleProps {
  proyecto: Proyecto
  entidad: Entidad | null
  onCambiarEstado?: () => void
}

export function ProyectoDetalle({ proyecto, entidad, onCambiarEstado }: ProyectoDetalleProps) {
  const router = useRouter()
  const [tabActivo, setTabActivo] = useState('resumen')

  // Modal state
  const [showCambiarEstado, setShowCambiarEstado] = useState(false)
  const [showCerrar, setShowCerrar] = useState(false)
  const [showCancelar, setShowCancelar] = useState(false)
  const [riesgoParaCambio, setRiesgoParaCambio] = useState<RiesgoProyecto | null>(null)

  // Repositorio de configuración M2-06
  const { data: configuracion, isLoading: loadingConfig } = useConfiguracionProyecto(proyecto.id)
  const agregarItem = useAgregarItemConfiguracion()
  const crearSCR = useCrearSCR()
  const avanzarSCR = useAvanzarSCR()

  // Si viene un handler externo (desde la lista), úsalo; si no, modal interno
  const handleCambiarEstado = onCambiarEstado ?? (() => setShowCambiarEstado(true))

  const estadoCfg = ESTADO_PROYECTO_CONFIG[proyecto.estado]
  const criticidadCfg = CRITICIDAD_CONFIG[proyecto.criticidad]
  const tipoCfg = TIPO_PROYECTO_CONFIG[proyecto.tipo]

  const esActivo = ['activo_en_definicion', 'activo_en_desarrollo'].includes(proyecto.estado)
  const puedeCancelar = !['completado', 'cancelado'].includes(proyecto.estado)

  return (
    <div className="space-y-6">
      {/* Header del proyecto */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <ColorBadge color={estadoCfg?.color ?? 'gray'} label={estadoCfg?.label ?? proyecto.estado} className="text-sm" />
              <ColorBadge color={criticidadCfg?.color ?? 'gray'} label={`Criticidad: ${criticidadCfg?.label ?? proyecto.criticidad}`} className="text-sm" />
              <ColorBadge color={tipoCfg?.color ?? 'gray'} label={tipoCfg?.label ?? proyecto.tipo} className="text-sm" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{proyecto.nombre}</h1>
            <p className="text-muted-foreground font-mono text-sm mt-1">{proyecto.codigo}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(ROUTES.PROYECTO_EDITAR(proyecto.id))}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button variant="outline" size="sm" onClick={handleCambiarEstado}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Cambiar estado
            </Button>
            {esActivo && (
              <Button
                size="sm"
                onClick={() => setShowCerrar(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Cerrar proyecto
              </Button>
            )}
            {puedeCancelar && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowCancelar(true)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setTabActivo(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  tabActivo === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab content */}
      {tabActivo === 'resumen' && <TabResumen proyecto={proyecto} entidad={entidad} />}
      {tabActivo === 'equipo' && <TabEquipo proyecto={proyecto} />}
      {tabActivo === 'riesgos' && (
        <TabRiesgos proyecto={proyecto} onCambiarEstadoRiesgo={setRiesgoParaCambio} />
      )}
      {tabActivo === 'hitos' && <TabHitos proyecto={proyecto} />}
      {tabActivo === 'presupuesto' && <TabPresupuesto proyecto={proyecto} />}
      {tabActivo === 'historial' && <TabHistorial proyectoId={proyecto.id} />}
      {tabActivo === 'configuracion' && (
        <PanelCCBRepositorio
          configuracion={configuracion ?? null}
          proyectoId={proyecto.id}
          isLoading={loadingConfig}
          onAgregarItem={async (item) => {
            if (!configuracion) return
            try {
              await agregarItem.mutateAsync({
                configuracionId: configuracion.id,
                proyectoId: proyecto.id,
                item,
              })
            } catch { /* manejado por onError del hook */ }
          }}
          onCrearSCR={async (scr) => {
            if (!configuracion) return
            try {
              await crearSCR.mutateAsync({
                configuracionId: configuracion.id,
                proyectoId: proyecto.id,
                scr,
              })
            } catch { /* manejado por onError del hook */ }
          }}
          onAvanzarSCR={async (scrId, datos) => {
            if (!configuracion) return
            try {
              await avanzarSCR.mutateAsync({
                configuracionId: configuracion.id,
                proyectoId: proyecto.id,
                scrId,
                datos,
              })
            } catch { /* manejado por onError del hook */ }
          }}
        />
      )}
      {tabActivo === 'metricas' && (
        <DashboardMetricasProceso
          proyecto={proyecto}
          configuracion={configuracion ?? null}
        />
      )}

      {/* Modals */}
      {showCambiarEstado && (
        <CambiarEstadoModal proyecto={proyecto} onClose={() => setShowCambiarEstado(false)} />
      )}
      {showCerrar && (
        <CerrarProyectoModal proyecto={proyecto} onClose={() => setShowCerrar(false)} />
      )}
      {showCancelar && (
        <CancelarProyectoModal proyecto={proyecto} onClose={() => setShowCancelar(false)} />
      )}
      {riesgoParaCambio && (
        <CambiarEstadoRiesgoModal
          proyectoId={proyecto.id}
          riesgo={riesgoParaCambio}
          onClose={() => setRiesgoParaCambio(null)}
        />
      )}
    </div>
  )
}

// -------------------------------------------------------
// TAB RESUMEN
// -------------------------------------------------------

function TabResumen({ proyecto, entidad }: { proyecto: Proyecto; entidad: Entidad | null }) {
  const metCfg = METODOLOGIAS_CONFIG[proyecto.metodologia]

  return (
    <div className="space-y-6">
      {/* KPIs Panel — M2-04 §10 */}
      <ProyectoKPIs proyecto={proyecto} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Datos generales */}
          <Card>
            <CardHeader><CardTitle className="text-base">Datos generales</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                {[
                  { label: 'Código', value: proyecto.codigo },
                  { label: 'Nombre', value: proyecto.nombre },
                  { label: 'Descripción', value: proyecto.descripcion, full: true },
                  { label: 'Tipo', value: TIPO_PROYECTO_CONFIG[proyecto.tipo]?.label ?? proyecto.tipo },
                  { label: 'Criticidad', value: CRITICIDAD_CONFIG[proyecto.criticidad]?.label ?? proyecto.criticidad },
                  { label: 'Estado', value: ESTADO_PROYECTO_CONFIG[proyecto.estado]?.label ?? proyecto.estado },
                  { label: 'Inicio', value: proyecto.fechaInicio ? format(new Date(proyecto.fechaInicio), 'dd/MM/yyyy', { locale: es }) : '—' },
                  { label: 'Fin estimado', value: proyecto.fechaFinEstimada ? format(new Date(proyecto.fechaFinEstimada), 'dd/MM/yyyy', { locale: es }) : '—' },
                  { label: 'Registrado', value: format(new Date(proyecto.creadoEn), 'dd/MM/yyyy HH:mm', { locale: es }) },
                  { label: 'Actualizado', value: format(new Date(proyecto.actualizadoEn), 'dd/MM/yyyy HH:mm', { locale: es }) },
                ].map((item) => (
                  <div key={item.label} className={item.full ? 'col-span-2' : ''}>
                    <dt className="text-muted-foreground">{item.label}</dt>
                    <dd className="font-medium mt-0.5">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          {/* Metodología */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> Metodología
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-semibold">{metCfg?.label ?? proyecto.metodologia}</span>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    metCfg?.tipo === 'agil'
                      ? 'text-green-700 border-green-300'
                      : metCfg?.tipo === 'hibrido'
                      ? 'text-purple-700 border-purple-300'
                      : 'text-blue-700 border-blue-300'
                  }`}
                >
                  {metCfg?.tipo ?? '—'}
                </Badge>
              </div>
              {metCfg && (
                <dl className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div><dt className="text-muted-foreground">Mejor para</dt><dd className="font-medium mt-0.5">{metCfg.mejorPara}</dd></div>
                  <div><dt className="text-muted-foreground">Documentación</dt><dd className="font-medium mt-0.5">{metCfg.documentacion}</dd></div>
                  <div><dt className="text-muted-foreground">Tamaño equipo</dt><dd className="font-medium mt-0.5">{metCfg.tamanoEquipo}</dd></div>
                  <div><dt className="text-muted-foreground">Estabilidad reqs.</dt><dd className="font-medium mt-0.5">{metCfg.estabilidadReqs}</dd></div>
                </dl>
              )}
              {proyecto.justificacionMetodologia && (
                <div className="p-3 bg-muted/40 rounded-lg text-sm">
                  <p className="text-muted-foreground text-xs mb-1">Justificación del equipo:</p>
                  <p>{proyecto.justificacionMetodologia}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Cliente + Métricas rápidas */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Cliente vinculado (M1)</CardTitle></CardHeader>
            <CardContent>
              {entidad ? (
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-base">{entidad.razonSocial}</p>
                  {entidad.nombreComercial && (
                    <p className="text-muted-foreground">{entidad.nombreComercial}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <ColorBadge
                      color={entidad.estado === 'activo' ? 'green' : 'gray'}
                      label={entidad.estado}
                    />
                    <ColorBadge
                      color={
                        entidad.nivelRiesgo === 'bajo'
                          ? 'green'
                          : entidad.nivelRiesgo === 'medio'
                          ? 'yellow'
                          : entidad.nivelRiesgo === 'alto'
                          ? 'orange'
                          : 'red'
                      }
                      label={`Riesgo: ${entidad.nivelRiesgo}`}
                    />
                  </div>
                  <div className="pt-2">
                    <p className="text-muted-foreground">Sector: <span className="text-foreground capitalize">{entidad.sector}</span></p>
                    <p className="text-muted-foreground">País: <span className="text-foreground">{entidad.pais}</span></p>
                    <p className="text-muted-foreground">Stakeholders: <span className="text-foreground">{entidad.stakeholders?.length ?? 0}</span></p>
                  </div>
                  <Link
                    href={ROUTES.ENTIDAD_DETALLE(entidad.id)}
                    className="flex items-center gap-1 text-primary hover:underline text-sm mt-2"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Ver perfil completo en M1
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Entidad no encontrada</p>
              )}
            </CardContent>
          </Card>

          {/* Métricas rápidas */}
          <Card>
            <CardHeader><CardTitle className="text-base">Métricas del proyecto</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-center">
                {[
                  { label: 'Miembros', value: proyecto.equipo?.length ?? 0, color: 'text-blue-600' },
                  { label: 'Riesgos', value: proyecto.riesgos?.length ?? 0, color: 'text-orange-600' },
                  { label: 'Hitos', value: proyecto.hitos?.length ?? 0, color: 'text-purple-600' },
                  {
                    label: 'Riesgos activos',
                    value: proyecto.riesgos?.filter((r) => r.estado === 'activo').length ?? 0,
                    color: 'text-red-600',
                  },
                ].map((m) => (
                  <div key={m.label} className="p-3 bg-muted/40 rounded-lg">
                    <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------
// TAB EQUIPO
// -------------------------------------------------------

function TabEquipo({ proyecto }: { proyecto: Proyecto }) {
  const equipo = proyecto.equipo ?? []

  const ROL_COLOR: Record<string, string> = {
    PM: 'blue', gestor: 'blue', analista: 'purple', arquitecto: 'orange',
    desarrollador: 'green', qa: 'teal', scrum_master: 'yellow',
    ux_designer: 'purple', devops: 'gray', product_owner: 'blue',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4" /> Equipo del proyecto ({equipo.length} miembro{equipo.length !== 1 ? 's' : ''})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {equipo.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No hay miembros registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pr-4 text-muted-foreground font-medium">Nombre</th>
                  <th className="pb-3 pr-4 text-muted-foreground font-medium">Rol</th>
                  <th className="pb-3 pr-4 text-muted-foreground font-medium">Rol cliente</th>
                  <th className="pb-3 text-muted-foreground font-medium">Tipo</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {equipo.map((m, idx) => (
                  <tr key={idx} className="hover:bg-muted/40">
                    <td className="py-3 pr-4 font-medium">{m.nombre}</td>
                    <td className="py-3 pr-4">
                      <ColorBadge color={ROL_COLOR[m.rol] ?? 'gray'} label={m.rol} />
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{m.rolCliente || '—'}</td>
                    <td className="py-3">
                      <Badge
                        variant="outline"
                        className={
                          m.esExterno
                            ? 'text-orange-700 border-orange-300'
                            : 'text-green-700 border-green-300'
                        }
                      >
                        {m.esExterno ? 'Externo' : 'Interno'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// -------------------------------------------------------
// TAB RIESGOS
// -------------------------------------------------------

function TabRiesgos({
  proyecto,
  onCambiarEstadoRiesgo,
}: {
  proyecto: Proyecto
  onCambiarEstadoRiesgo: (riesgo: RiesgoProyecto) => void
}) {
  const riesgos = proyecto.riesgos ?? []
  const activos = riesgos.filter((r) => r.estado === 'activo').length
  const materializados = riesgos.filter((r) => r.estado === 'materializado').length

  const TIPO_LABELS: Record<string, string> = {
    tecnologico: 'Tecnológico',
    personas: 'Personas',
    organizacional: 'Organizacional',
    requerimientos: 'Requerimientos',
    estimacion: 'Estimación',
  }
  const ESTADO_ICONS: Record<string, React.ReactNode> = {
    activo: <AlertCircle className="h-4 w-4 text-orange-600" />,
    mitigado: <Shield className="h-4 w-4 text-blue-600" />,
    materializado: <XCircle className="h-4 w-4 text-red-600" />,
    cerrado: <CheckCircle className="h-4 w-4 text-green-600" />,
  }

  return (
    <div className="space-y-4">
      {/* Resumen */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: riesgos.length, color: 'text-foreground' },
          { label: 'Activos', value: activos, color: 'text-orange-600' },
          { label: 'Materializados', value: materializados, color: 'text-red-600' },
          { label: 'Cerrados', value: riesgos.filter((r) => r.estado === 'cerrado').length, color: 'text-green-600' },
        ].map((m) => (
          <div key={m.label} className="p-3 bg-muted/40 rounded-lg text-center">
            <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Tabla de riesgos */}
      <Card>
        <CardContent className="pt-4">
          {riesgos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No hay riesgos registrados</p>
          ) : (
            <div className="space-y-3">
              {riesgos.map((r) => {
                const nivel = calcNivelRiesgo(r.probabilidad, r.impacto)
                const puedeActualizar = r.estado !== 'cerrado'
                return (
                  <div key={r.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {ESTADO_ICONS[r.estado]}
                        <ColorBadge
                          color={NIVEL_COLOR[nivel as keyof typeof NIVEL_COLOR] ?? 'gray'}
                          label={`Nivel: ${nivel}`}
                        />
                        <Badge variant="outline" className="text-xs">
                          {TIPO_LABELS[r.tipo] ?? r.tipo}
                        </Badge>
                        {r.origen === 'heredado_entidad' && (
                          <Badge variant="outline" className="text-xs text-orange-700 border-orange-300">
                            Heredado
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className="text-xs capitalize">{r.estado}</Badge>
                        {puedeActualizar && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onCambiarEstadoRiesgo(r)}
                            className="h-7 text-xs px-2"
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Revisar
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm">{r.descripcion}</p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Prob: <strong className="text-foreground">{r.probabilidad.replace('_', ' ')}</strong></span>
                      <span>Impacto: <strong className="text-foreground">{r.impacto.replace('_', ' ')}</strong></span>
                      <span>Estrategia: <strong className="text-foreground capitalize">{r.estrategia}</strong></span>
                    </div>
                    {r.mitigacion && (
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="font-medium">Mitigación:</span> {r.mitigacion}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// -------------------------------------------------------
// TAB HITOS
// -------------------------------------------------------

function TabHitos({ proyecto }: { proyecto: Proyecto }) {
  const hitos = proyecto.hitos ?? []

  const ESTADO_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pendiente: { label: 'Pendiente', color: 'blue', icon: <Clock className="h-4 w-4 text-blue-600" /> },
    en_riesgo: { label: 'En riesgo', color: 'orange', icon: <AlertCircle className="h-4 w-4 text-orange-600" /> },
    completado: { label: 'Completado', color: 'green', icon: <CheckCircle className="h-4 w-4 text-green-600" /> },
    incumplido: { label: 'Incumplido', color: 'red', icon: <XCircle className="h-4 w-4 text-red-600" /> },
  }

  const completados = hitos.filter((h) => h.estado === 'completado').length
  const progreso = hitos.length > 0 ? Math.round((completados / hitos.length) * 100) : 0

  return (
    <div className="space-y-4">
      {hitos.length > 0 && (
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="font-medium">Avance de hitos</span>
            <span className="text-muted-foreground">
              {completados}/{hitos.length} completados ({progreso}%)
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>
      )}

      <Card>
        <CardContent className="pt-4">
          {hitos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No hay hitos definidos</p>
          ) : (
            <div className="space-y-3">
              {hitos.map((hito, idx) => {
                const cfg = ESTADO_CONFIG[hito.estado] ?? ESTADO_CONFIG.pendiente
                return (
                  <div key={hito.id || idx} className="flex gap-4 p-3 border rounded-lg">
                    <div className="flex flex-col items-center">
                      {cfg.icon}
                      {idx < hitos.length - 1 && <div className="w-0.5 h-full mt-2 bg-border" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm">{hito.nombre}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{hito.descripcion}</p>
                        </div>
                        <ColorBadge color={cfg.color} label={cfg.label} />
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                        <span>
                          Fecha:{' '}
                          <strong className="text-foreground">
                            {hito.fechaEstimada
                              ? format(new Date(hito.fechaEstimada), 'dd/MM/yyyy', { locale: es })
                              : '—'}
                          </strong>
                        </span>
                        {hito.fechaReal && (
                          <span>
                            Real:{' '}
                            <strong className="text-foreground">
                              {format(new Date(hito.fechaReal), 'dd/MM/yyyy', { locale: es })}
                            </strong>
                          </span>
                        )}
                        <span>Responsable: <strong className="text-foreground">{hito.responsable}</strong></span>
                        {hito.entregable && (
                          <span>Entregable: <strong className="text-foreground">{hito.entregable}</strong></span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// -------------------------------------------------------
// TAB PRESUPUESTO
// -------------------------------------------------------

function TabPresupuesto({ proyecto }: { proyecto: Proyecto }) {
  const p = proyecto.presupuesto

  const formatCurrency = (val: number, moneda: string) => {
    return (
      new Intl.NumberFormat('es-CL', { style: 'decimal', minimumFractionDigits: 0 }).format(val) +
      ' ' +
      moneda
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <DollarSign className="h-4 w-4" /> Estimación de presupuesto
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!p ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No se registró estimación de presupuesto para este proyecto.
          </p>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Método:</span>
              <Badge variant="outline">
                {METODOS_ESTIMACION_CONFIG[p.metodoUsado]?.label ?? p.metodoUsado}
              </Badge>
            </div>

            {/* Rango de estimación */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200">
                <p className="text-xs text-muted-foreground mb-1">Mínima</p>
                <p className="font-bold text-lg text-green-800 dark:text-green-200">
                  {formatCurrency(p.estimacionMinima, p.moneda)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 ring-2 ring-primary">
                <p className="text-xs text-muted-foreground mb-1">Nominal (base)</p>
                <p className="font-bold text-xl text-blue-800 dark:text-blue-200">
                  {formatCurrency(p.estimacionNominal, p.moneda)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200">
                <p className="text-xs text-muted-foreground mb-1">Máxima</p>
                <p className="font-bold text-lg text-red-800 dark:text-red-200">
                  {formatCurrency(p.estimacionMaxima, p.moneda)}
                </p>
              </div>
            </div>

            {/* Supuestos */}
            {(p.supuestos ?? []).length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Supuestos</h4>
                <ul className="space-y-1">
                  {(p.supuestos ?? []).map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Exclusiones */}
            {(p.exclusiones ?? []).length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Exclusiones</h4>
                <ul className="space-y-1">
                  {(p.exclusiones ?? []).map((ex, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// -------------------------------------------------------
// TAB HISTORIAL
// -------------------------------------------------------

function TabHistorial({ proyectoId }: { proyectoId: string }) {
  const { data: historial, isLoading } = useProyectoHistorial(proyectoId)

  const TIPO_ACCION_LABEL: Record<string, string> = {
    creacion: 'Creación',
    actualizacion_datos: 'Actualización de datos',
    cambio_estado: 'Cambio de estado',
    gestion_equipo: 'Gestión del equipo',
    gestion_riesgos: 'Revisión de riesgo',
    gestion_hitos: 'Gestión de hitos',
    cierre: 'Cierre del proyecto',
    cancelacion: 'Cancelación del proyecto',
    metodologia_acordada: 'Metodología acordada (M2-07)',
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground py-8 text-center">Cargando historial...</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4" /> Historial de cambios
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!historial || historial.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No hay registros en el historial</p>
        ) : (
          <div className="space-y-3">
            {historial.map((entry) => (
              <div key={entry.id} className="flex gap-3 p-3 border rounded-lg">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div className="flex-1 text-sm">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="font-medium">
                      {TIPO_ACCION_LABEL[entry.tipoAccion] ?? entry.tipoAccion}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(entry.fechaHora), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs mt-0.5">por {entry.usuarioNombre}</p>
                  {entry.campoModificado && (
                    <p className="text-xs mt-1">
                      Campo: <strong>{entry.campoModificado}</strong>
                      {entry.valorAnterior && ` · Antes: ${entry.valorAnterior}`}
                      {entry.valorNuevo && ` · Ahora: ${entry.valorNuevo}`}
                    </p>
                  )}
                  {entry.motivo && entry.tipoAccion !== 'cierre' && (
                    <p className="text-xs text-muted-foreground mt-0.5">Motivo: {entry.motivo}</p>
                  )}
                  {entry.tipoAccion === 'cierre' && entry.motivo && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Lecciones aprendidas registradas ·{' '}
                      <span className="text-primary">Ver en documentación de cierre</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
