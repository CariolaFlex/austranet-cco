'use client'

// ============================================================
// COMPONENTE: PanelCCBRepositorio — M2-06 (M2-INT-06)
// Panel del Comité de Control de Cambios del Repositorio.
// DIFERENTE del CCB del SRS (M3-09): son entes independientes.
// Muestra: ítems de configuración, SCRs, historial (inmutable),
// composición del CCB del repositorio.
// ============================================================

import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Package, GitBranch, FileText, Users, Plus, Clock,
  CheckCircle, XCircle, AlertCircle, Eye, Filter,
  ChevronRight, Database, Code, Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib'
import { Input, FormField, Select, Textarea } from '@/components/ui/input'
import type {
  ConfiguracionProyecto,
  ItemConfiguracion,
  SolicitudCambioRepositorio,
  TipoItemConfiguracion,
  EstadoSCR,
} from '@/types'
import { labelPoliticaEntregas } from '@/lib/metodologia/efectosCascada'

// ──────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────

const TIPO_ITEM_ICONS: Record<TipoItemConfiguracion, React.ReactNode> = {
  codigo: <Code className="h-3.5 w-3.5" />,
  documento: <FileText className="h-3.5 w-3.5" />,
  dato_configuracion: <Settings className="h-3.5 w-3.5" />,
  dependencia: <Database className="h-3.5 w-3.5" />,
}

const TIPO_ITEM_LABEL: Record<TipoItemConfiguracion, string> = {
  codigo: 'Código',
  documento: 'Documento',
  dato_configuracion: 'Config',
  dependencia: 'Dependencia',
}

const TIPO_ITEM_COLOR: Record<TipoItemConfiguracion, string> = {
  codigo: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  documento: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  dato_configuracion: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  dependencia: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

const ESTADO_SCR_CONFIG: Record<EstadoSCR, { label: string; color: string }> = {
  propuesta: { label: 'Propuesta', color: 'bg-gray-100 text-gray-700' },
  en_analisis: { label: 'En análisis', color: 'bg-blue-100 text-blue-700' },
  evaluada: { label: 'Evaluada CCB', color: 'bg-yellow-100 text-yellow-700' },
  aprobada: { label: 'Aprobada', color: 'bg-green-100 text-green-700' },
  rechazada: { label: 'Rechazada', color: 'bg-red-100 text-red-700' },
  implementada: { label: 'Implementada', color: 'bg-teal-100 text-teal-700' },
}

// ──────────────────────────────────────────────────────────
// PROPS
// ──────────────────────────────────────────────────────────

interface PanelCCBRepositorioProps {
  configuracion: ConfiguracionProyecto | null
  proyectoId: string
  onAgregarItem?: (item: Omit<ItemConfiguracion, 'id'>) => Promise<void>
  onCrearSCR?: (scr: Omit<SolicitudCambioRepositorio, 'id' | 'configuracionId' | 'estado' | 'creadoEn' | 'actualizadoEn' | 'creadoPor'>) => Promise<void>
  onAvanzarSCR?: (scrId: string, datos: { nuevoEstado: EstadoSCR; analisisTecnico?: string; resolucionCCB?: 'aprobar' | 'rechazar' | 'diferir'; motivoCCB?: string }) => Promise<void>
  isLoading?: boolean
}

// ──────────────────────────────────────────────────────────
// TABS
// ──────────────────────────────────────────────────────────

const TABS = [
  { id: 'items', label: 'Ítems de Configuración', icon: Package },
  { id: 'scr', label: 'Solicitudes de Cambio', icon: GitBranch },
  { id: 'historial', label: 'Historial (inmutable)', icon: Clock },
  { id: 'ccb', label: 'Composición CCB', icon: Users },
]

// ──────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ──────────────────────────────────────────────────────────

export function PanelCCBRepositorio({
  configuracion,
  proyectoId,
  onAgregarItem,
  onCrearSCR,
  onAvanzarSCR,
  isLoading,
}: PanelCCBRepositorioProps) {
  const [tabActivo, setTabActivo] = useState('items')
  const [filtroTipo, setFiltroTipo] = useState<TipoItemConfiguracion | ''>('')
  const [showFormItem, setShowFormItem] = useState(false)
  const [showFormSCR, setShowFormSCR] = useState(false)

  if (!configuracion) {
    return (
      <div className="p-8 text-center border-2 border-dashed rounded-lg">
        <Package className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground font-medium">Repositorio de Configuración no iniciado</p>
        <p className="text-sm text-muted-foreground mt-1">
          El repositorio se crea automáticamente cuando el proyecto pasa a{' '}
          <strong>pendiente_aprobacion</strong>.
        </p>
      </div>
    )
  }

  const itemsFiltrados = filtroTipo
    ? configuracion.itemsConfiguracion.filter((i) => i.tipo === filtroTipo)
    : configuracion.itemsConfiguracion

  return (
    <div className="space-y-4">
      {/* Header del repositorio */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">v{configuracion.version}</Badge>
            <Badge variant="outline" className={
              configuracion.estado === 'aprobado'
                ? 'text-green-700 border-green-300'
                : configuracion.estado === 'revision'
                ? 'text-yellow-700 border-yellow-300'
                : 'text-gray-600'
            }>
              {configuracion.estado}
            </Badge>
            {configuracion.cicdObligatorio && (
              <Badge className="bg-blue-600 text-white text-xs">CI/CD Obligatorio</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Política de entregas:{' '}
            <strong>{labelPoliticaEntregas(configuracion.politicaEntregas as never)}</strong>
          </p>
        </div>
        <div className="text-xs text-muted-foreground bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 px-3 py-1.5 rounded-lg">
          <strong>CCB del Repositorio</strong> — independiente del CCB del SRS (M3-09)
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
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  tabActivo === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {tab.id === 'scr' && configuracion.solicitudesCambio.length > 0 && (
                  <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                    {configuracion.solicitudesCambio.filter((s) => !['aprobada', 'rechazada', 'implementada'].includes(s.estado)).length}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* TAB: Ítems de Configuración */}
      {tabActivo === 'items' && (
        <div className="space-y-3">
          {/* Filtros y acciones */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              Filtrar por tipo:
            </div>
            {(['', 'codigo', 'documento', 'dato_configuracion', 'dependencia'] as const).map((tipo) => (
              <button
                key={tipo}
                onClick={() => setFiltroTipo(tipo)}
                className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                  filtroTipo === tipo
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40'
                }`}
              >
                {tipo === '' ? 'Todos' : TIPO_ITEM_LABEL[tipo]}
              </button>
            ))}
            <div className="ml-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowFormItem(!showFormItem)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Agregar ítem
              </Button>
            </div>
          </div>

          {/* Formulario agregar ítem */}
          {showFormItem && onAgregarItem && (
            <FormAgregarItem
              onGuardar={async (item) => {
                await onAgregarItem(item)
                setShowFormItem(false)
              }}
              onCancelar={() => setShowFormItem(false)}
            />
          )}

          {/* Lista de ítems */}
          {itemsFiltrados.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No hay ítems de configuración registrados</p>
              {filtroTipo && <p className="text-sm">Intenta limpiar el filtro de tipo.</p>}
            </div>
          ) : (
            <div className="space-y-2">
              {itemsFiltrados.map((item) => (
                <div key={item.id} className="p-3 border rounded-lg flex items-center gap-3 hover:bg-muted/30 transition-colors">
                  <span className={`p-1.5 rounded ${TIPO_ITEM_COLOR[item.tipo]}`}>
                    {TIPO_ITEM_ICONS[item.tipo]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{item.nombre}</span>
                      <Badge variant="outline" className="text-xs font-mono">v{item.version}</Badge>
                      <Badge variant="outline" className={`text-xs ${
                        item.estado === 'vigente' ? 'text-green-700 border-green-300' :
                        item.estado === 'en_revision' ? 'text-yellow-700 border-yellow-300' :
                        'text-gray-500'
                      }`}>
                        {item.estado}
                      </Badge>
                    </div>
                    {item.descripcion && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.descripcion}</p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground text-right shrink-0">
                    <p>{item.responsable}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${TIPO_ITEM_COLOR[item.tipo]}`}>
                      {TIPO_ITEM_ICONS[item.tipo]}
                      {TIPO_ITEM_LABEL[item.tipo]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: Solicitudes de Cambio (SCR) */}
      {tabActivo === 'scr' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {configuracion.solicitudesCambio.length} solicitudes totales
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowFormSCR(!showFormSCR)}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Nueva SCR
            </Button>
          </div>

          {showFormSCR && onCrearSCR && (
            <FormCrearSCR
              configuracionId={configuracion.id}
              items={configuracion.itemsConfiguracion}
              onGuardar={async (scr) => {
                await onCrearSCR(scr)
                setShowFormSCR(false)
              }}
              onCancelar={() => setShowFormSCR(false)}
            />
          )}

          {configuracion.solicitudesCambio.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <GitBranch className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No hay solicitudes de cambio</p>
            </div>
          ) : (
            <div className="space-y-2">
              {configuracion.solicitudesCambio.map((scr) => {
                const estadoCfg = ESTADO_SCR_CONFIG[scr.estado]
                return (
                  <div key={scr.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm">{scr.titulo}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{scr.descripcion}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className={`text-xs ${
                          scr.impactoEstimado === 'alto' ? 'text-red-700 border-red-300' :
                          scr.impactoEstimado === 'medio' ? 'text-yellow-700 border-yellow-300' :
                          'text-green-700 border-green-300'
                        }`}>
                          impacto {scr.impactoEstimado}
                        </Badge>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoCfg.color}`}>
                          {estadoCfg.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Solicitante: {scr.solicitante}</span>
                      <span>Items: {scr.itemsAfectados.length}</span>
                      {scr.creadoEn && (
                        <span>{format(new Date(scr.creadoEn), 'dd/MM/yy', { locale: es })}</span>
                      )}
                    </div>
                    {/* Flujo de etapas */}
                    <div className="flex items-center gap-1 text-xs">
                      {(['propuesta', 'en_analisis', 'evaluada', 'aprobada', 'implementada'] as EstadoSCR[]).map((e, i) => {
                        const estadosOrden = ['propuesta', 'en_analisis', 'evaluada', 'aprobada', 'implementada']
                        const idxActual = estadosOrden.indexOf(scr.estado)
                        const idxE = estadosOrden.indexOf(e)
                        const completado = idxActual > idxE
                        const activo = scr.estado === e
                        return (
                          <div key={e} className="flex items-center gap-1">
                            {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                            <span className={`px-1.5 py-0.5 rounded text-xs ${
                              completado ? 'bg-green-100 text-green-700' :
                              activo ? 'bg-primary/20 text-primary font-semibold' :
                              'text-muted-foreground'
                            }`}>
                              {ESTADO_SCR_CONFIG[e].label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB: Historial de versiones (inmutable - solo lectura) */}
      {tabActivo === 'historial' && (
        <div className="space-y-2">
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 text-xs text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
            <Eye className="h-4 w-4 shrink-0" />
            El historial de versiones es <strong>inmutable</strong>. Solo lectura. Cada versión queda
            permanentemente registrada (M2-06 — Sommerville Cap. 25).
          </div>
          {configuracion.historialVersiones.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">Sin registros</div>
          ) : (
            <div className="space-y-2">
              {[...configuracion.historialVersiones].reverse().map((v, i) => (
                <div key={i} className="p-3 border rounded-lg bg-muted/20">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <Badge variant="outline" className="font-mono text-xs">v{v.version}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {v.fecha
                        ? format(new Date(v.fecha), "dd MMM yyyy 'a las' HH:mm", { locale: es })
                        : '—'}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{v.descripcion}</p>
                  {v.cambios.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {v.cambios.map((c, j) => (
                        <li key={j} className="text-xs text-muted-foreground flex items-start gap-1">
                          <span className="mt-0.5">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {v.aprobadoPor && (
                    <p className="text-xs text-muted-foreground mt-1">Aprobado por: {v.aprobadoPor}</p>
                  )}
                  {v.scrId && (
                    <p className="text-xs text-muted-foreground">SCR: {v.scrId}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: Composición del CCB */}
      {tabActivo === 'ccb' && (
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-400 flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0" />
            <span>
              Este es el <strong>CCB del Repositorio de Configuración</strong>. Es diferente e independiente
              del CCB del SRS (M3-09). Aprobar un cambio en uno NO aprueba automáticamente en el otro.
            </span>
          </div>
          {configuracion.ccbComposicion.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No hay miembros definidos en el CCB del repositorio</p>
              <p className="text-sm">Agrega miembros desde la gestión del proyecto.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {configuracion.ccbComposicion.map((m, i) => (
                <div key={i} className="p-3 border rounded-lg flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                    {m.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{m.nombre}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{m.rol}</Badge>
                      {m.esExterno && <Badge variant="outline" className="text-xs text-orange-700 border-orange-300">externo</Badge>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// SUBCOMPONENTES: Formularios
// ──────────────────────────────────────────────────────────

function FormAgregarItem({
  onGuardar,
  onCancelar,
}: {
  onGuardar: (item: Omit<ItemConfiguracion, 'id'>) => Promise<void>
  onCancelar: () => void
}) {
  const [form, setForm] = useState<Omit<ItemConfiguracion, 'id'>>({
    nombre: '',
    tipo: 'codigo',
    version: '1.0.0',
    responsable: '',
    estado: 'vigente',
    descripcion: '',
    ubicacion: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.nombre.trim() || !form.responsable.trim()) return
    setLoading(true)
    try {
      await onGuardar(form)
    } finally {
      setLoading(false)
    }
  }

  const TIPO_OPTS = [
    { value: 'codigo', label: 'Código fuente' },
    { value: 'documento', label: 'Documento' },
    { value: 'dato_configuracion', label: 'Dato de configuración' },
    { value: 'dependencia', label: 'Dependencia externa' },
  ]
  const ESTADO_OPTS = [
    { value: 'vigente', label: 'Vigente' },
    { value: 'en_revision', label: 'En revisión' },
    { value: 'obsoleto', label: 'Obsoleto' },
    { value: 'archivado', label: 'Archivado' },
  ]

  return (
    <div className="p-4 border-2 border-primary/30 rounded-lg bg-primary/5 space-y-3">
      <h4 className="font-semibold text-sm">Agregar ítem de configuración</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Nombre *">
          <Input
            value={form.nombre}
            onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
            placeholder="Ej. módulo-autenticación"
          />
        </FormField>
        <FormField label="Tipo *">
          <Select
            value={form.tipo}
            onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value as never }))}
            options={TIPO_OPTS}
          />
        </FormField>
        <FormField label="Versión *">
          <Input
            value={form.version}
            onChange={(e) => setForm((p) => ({ ...p, version: e.target.value }))}
            placeholder="1.0.0"
          />
        </FormField>
        <FormField label="Responsable *">
          <Input
            value={form.responsable}
            onChange={(e) => setForm((p) => ({ ...p, responsable: e.target.value }))}
            placeholder="Nombre del responsable"
          />
        </FormField>
        <FormField label="Estado">
          <Select
            value={form.estado}
            onChange={(e) => setForm((p) => ({ ...p, estado: e.target.value as never }))}
            options={ESTADO_OPTS}
          />
        </FormField>
        <FormField label="Ubicación (ruta / URL)">
          <Input
            value={form.ubicacion ?? ''}
            onChange={(e) => setForm((p) => ({ ...p, ubicacion: e.target.value }))}
            placeholder="ej. /src/auth o https://github.com/..."
          />
        </FormField>
      </div>
      <FormField label="Descripción">
        <Textarea
          value={form.descripcion ?? ''}
          onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
          rows={2}
          placeholder="Descripción breve del ítem..."
        />
      </FormField>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onCancelar}>Cancelar</Button>
        <Button type="button" size="sm" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar ítem'}
        </Button>
      </div>
    </div>
  )
}

function FormCrearSCR({
  configuracionId,
  items,
  onGuardar,
  onCancelar,
}: {
  configuracionId: string
  items: ItemConfiguracion[]
  onGuardar: (scr: Omit<SolicitudCambioRepositorio, 'id' | 'configuracionId' | 'estado' | 'creadoEn' | 'actualizadoEn' | 'creadoPor'>) => Promise<void>
  onCancelar: () => void
}) {
  const [form, setForm] = useState({
    proyectoId: '',
    titulo: '',
    descripcion: '',
    justificacion: '',
    itemsAfectados: [] as string[],
    impactoEstimado: 'medio' as 'bajo' | 'medio' | 'alto',
    solicitante: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.titulo.trim() || !form.descripcion.trim() || !form.solicitante.trim()) return
    setLoading(true)
    try {
      await onGuardar({ ...form, proyectoId: configuracionId })
    } finally {
      setLoading(false)
    }
  }

  const IMPACTO_OPTS = [
    { value: 'bajo', label: 'Bajo' },
    { value: 'medio', label: 'Medio' },
    { value: 'alto', label: 'Alto' },
  ]

  return (
    <div className="p-4 border-2 border-primary/30 rounded-lg bg-primary/5 space-y-3">
      <h4 className="font-semibold text-sm">Nueva Solicitud de Cambio al Repositorio (SCR)</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Título *">
          <Input
            value={form.titulo}
            onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))}
            placeholder="Título de la SCR"
          />
        </FormField>
        <FormField label="Solicitante *">
          <Input
            value={form.solicitante}
            onChange={(e) => setForm((p) => ({ ...p, solicitante: e.target.value }))}
            placeholder="Nombre del solicitante"
          />
        </FormField>
        <FormField label="Impacto estimado">
          <Select
            value={form.impactoEstimado}
            onChange={(e) => setForm((p) => ({ ...p, impactoEstimado: e.target.value as never }))}
            options={IMPACTO_OPTS}
          />
        </FormField>
      </div>
      <FormField label="Descripción del cambio *">
        <Textarea
          value={form.descripcion}
          onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
          rows={2}
          placeholder="Describe qué cambio se solicita..."
        />
      </FormField>
      <FormField label="Justificación">
        <Textarea
          value={form.justificacion}
          onChange={(e) => setForm((p) => ({ ...p, justificacion: e.target.value }))}
          rows={2}
          placeholder="Por qué es necesario este cambio..."
        />
      </FormField>
      {items.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-1.5">Ítems afectados:</p>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <label key={item.id} className="flex items-center gap-1.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={form.itemsAfectados.includes(item.id)}
                  onChange={(e) => {
                    const ids = e.target.checked
                      ? [...form.itemsAfectados, item.id]
                      : form.itemsAfectados.filter((x) => x !== item.id)
                    setForm((p) => ({ ...p, itemsAfectados: ids }))
                  }}
                  className="rounded"
                />
                {item.nombre} (v{item.version})
              </label>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onCancelar}>Cancelar</Button>
        <Button type="button" size="sm" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creando...' : 'Crear SCR'}
        </Button>
      </div>
    </div>
  )
}
