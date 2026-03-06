'use client'

// ============================================================
// CatalogoInsumosAdmin — M5-S03
// Tabla CRUD completa del catálogo global de insumos.
// Solo visible para roles superadmin y admin.
// ============================================================

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Plus, Pencil, Ban, RefreshCw, Save, X,
  Search, Loader2, Package, AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import {
  useCatalogoInsumos,
  useCrearCatalogoInsumo,
  useActualizarCatalogoInsumo,
  useDesactivarCatalogoInsumo,
  useReactivarCatalogoInsumo,
} from '@/hooks/useCatalogoInsumos'
import type { CatalogoInsumo, CategoriaInsumo } from '@/types'

// ── Constantes ────────────────────────────────────────────────────────────────

const CATEGORIAS: { value: CategoriaInsumo; label: string }[] = [
  { value: 'material',     label: 'Material' },
  { value: 'mano_de_obra', label: 'Mano de Obra' },
  { value: 'equipo',       label: 'Equipo' },
  { value: 'subcontrato',  label: 'Subcontrato' },
]

const MONEDAS = ['CLP', 'USD', 'UF', 'PEN', 'EUR'] as const

const TIPO_COLOR: Record<CategoriaInsumo, string> = {
  material:     'bg-blue-100 text-blue-700 border-blue-200',
  mano_de_obra: 'bg-orange-100 text-orange-700 border-orange-200',
  equipo:       'bg-purple-100 text-purple-700 border-purple-200',
  subcontrato:  'bg-green-100 text-green-700 border-green-200',
}

function simb(moneda: string): string {
  const map: Record<string, string> = { CLP: '$', USD: 'US$', UF: 'UF', PEN: 'S/', EUR: '€' }
  return map[moneda] ?? moneda
}

// ── Zod schema ────────────────────────────────────────────────────────────────

const insumoSchema = z.object({
  codigo:           z.string().min(2, 'Mínimo 2 caracteres').max(20),
  descripcion:      z.string().min(3, 'Mínimo 3 caracteres').max(200),
  tipo:             z.enum(['material', 'mano_de_obra', 'equipo', 'subcontrato']),
  unidad:           z.string().min(1, 'Obligatorio').max(20),
  precioReferencia: z.number().min(0, 'Debe ser ≥ 0'),
  moneda:           z.enum(['CLP', 'USD', 'UF', 'PEN', 'EUR']),
  proveedor:        z.string().max(100).optional(),
  activo:           z.boolean(),
})

type InsumoFormValues = z.infer<typeof insumoSchema>

// ── Componente interno: FormularioInsumo ──────────────────────────────────────

interface FormularioInsumoProps {
  insumo?: CatalogoInsumo
  onClose: () => void
}

function FormularioInsumo({ insumo, onClose }: FormularioInsumoProps) {
  const esEdicion = !!insumo
  const crear = useCrearCatalogoInsumo()
  const actualizar = useActualizarCatalogoInsumo()
  const isPending = crear.isPending || actualizar.isPending

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<InsumoFormValues>({
    resolver: zodResolver(insumoSchema),
    defaultValues: {
      codigo:           insumo?.codigo ?? '',
      descripcion:      insumo?.descripcion ?? '',
      tipo:             insumo?.tipo ?? 'material',
      unidad:           insumo?.unidad ?? '',
      precioReferencia: insumo?.precioReferencia ?? 0,
      moneda:           (insumo?.moneda as typeof MONEDAS[number]) ?? 'CLP',
      proveedor:        insumo?.proveedor ?? '',
      activo:           insumo?.activo ?? true,
    },
  })

  async function onSubmit(values: InsumoFormValues) {
    const dto = {
      ...values,
      proveedor: values.proveedor?.trim() || undefined,
    }

    try {
      if (esEdicion && insumo) {
        await actualizar.mutateAsync({ id: insumo.id, dto })
      } else {
        await crear.mutateAsync(dto)
      }
      onClose()
    } catch {
      // Manejado por onError del hook (toast)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            {esEdicion ? 'Editar insumo' : 'Nuevo insumo en catálogo'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-1">
          {/* Código + Tipo */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ci-codigo">Código <span className="text-destructive">*</span></Label>
              <Input
                id="ci-codigo"
                placeholder="MAT-001"
                {...register('codigo')}
                className={cn(errors.codigo && 'border-destructive')}
              />
              {errors.codigo && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />{errors.codigo.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ci-tipo">Tipo <span className="text-destructive">*</span></Label>
              <select
                id="ci-tipo"
                {...register('tipo')}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {CATEGORIAS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <Label htmlFor="ci-desc">Descripción <span className="text-destructive">*</span></Label>
            <Input
              id="ci-desc"
              placeholder="Ej: Cemento Portland IP 42.5"
              {...register('descripcion')}
              className={cn(errors.descripcion && 'border-destructive')}
            />
            {errors.descripcion && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />{errors.descripcion.message}
              </p>
            )}
          </div>

          {/* Unidad + Precio + Moneda */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ci-unidad">Unidad <span className="text-destructive">*</span></Label>
              <Input
                id="ci-unidad"
                placeholder="kg, m², HH"
                {...register('unidad')}
                className={cn(errors.unidad && 'border-destructive')}
              />
              {errors.unidad && (
                <p className="text-xs text-destructive">{errors.unidad.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ci-precio">P. Referencia <span className="text-destructive">*</span></Label>
              <Input
                id="ci-precio"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                {...register('precioReferencia', { valueAsNumber: true })}
                className={cn(errors.precioReferencia && 'border-destructive', 'font-mono')}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ci-moneda">Moneda</Label>
              <select
                id="ci-moneda"
                {...register('moneda')}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {MONEDAS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Proveedor */}
          <div className="space-y-1.5">
            <Label htmlFor="ci-proveedor">Proveedor (opcional)</Label>
            <Input
              id="ci-proveedor"
              placeholder="Nombre del proveedor de referencia"
              {...register('proveedor')}
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              <X className="h-4 w-4 mr-1.5" />Cancelar
            </Button>
            <Button type="submit" disabled={isPending || (esEdicion && !isDirty)}>
              {isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-1.5" />{esEdicion ? 'Guardando…' : 'Creando…'}</>
              ) : (
                <><Save className="h-4 w-4 mr-1.5" />{esEdicion ? 'Guardar cambios' : 'Crear insumo'}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────

export function CatalogoInsumosAdmin() {
  const [busqueda, setBusqueda]         = useState('')
  const [filtroTipo, setFiltroTipo]     = useState<CategoriaInsumo | ''>('')
  const [soloActivos, setSoloActivos]   = useState(true)
  const [editando, setEditando]         = useState<CatalogoInsumo | undefined>(undefined)
  const [showForm, setShowForm]         = useState(false)
  const [confirmId, setConfirmId]       = useState<string | null>(null)
  const [confirmAccion, setConfirmAccion] = useState<'desactivar' | 'reactivar' | null>(null)

  const { data: insumos = [], isLoading, error } = useCatalogoInsumos({
    busqueda: busqueda.trim().length >= 2 ? busqueda : undefined,
    tipo: filtroTipo || undefined,
    soloActivos,
  })

  const desactivar = useDesactivarCatalogoInsumo()
  const reactivar  = useReactivarCatalogoInsumo()
  const isActualizando = desactivar.isPending || reactivar.isPending

  function handleNuevo() {
    setEditando(undefined)
    setShowForm(true)
  }

  function handleEditar(insumo: CatalogoInsumo) {
    setEditando(insumo)
    setShowForm(true)
  }

  function handleConfirmarAccion(id: string, accion: 'desactivar' | 'reactivar') {
    setConfirmId(id)
    setConfirmAccion(accion)
  }

  async function ejecutarAccion() {
    if (!confirmId || !confirmAccion) return
    try {
      if (confirmAccion === 'desactivar') await desactivar.mutateAsync(confirmId)
      else await reactivar.mutateAsync(confirmId)
    } catch {
      // toast manejado por hook
    } finally {
      setConfirmId(null)
      setConfirmAccion(null)
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar…"
              className="h-8 w-44 rounded-md border border-input bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Filtro tipo */}
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as CategoriaInsumo | '')}
            className="h-8 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Todos los tipos</option>
            {CATEGORIAS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          {/* Toggle activos/todos */}
          <button
            type="button"
            onClick={() => setSoloActivos(!soloActivos)}
            className={cn(
              'h-8 px-3 rounded-md text-xs font-medium border transition-colors',
              soloActivos
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'bg-muted text-muted-foreground border-border',
            )}
          >
            {soloActivos ? 'Solo activos' : 'Todos'}
          </button>
        </div>

        <Button size="sm" onClick={handleNuevo}>
          <Plus className="h-4 w-4 mr-1.5" />
          Nuevo insumo
        </Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse bg-muted rounded-md" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
          Error al cargar el catálogo: {error.message}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && insumos.length === 0 && (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground mb-3">
            {busqueda ? `Sin resultados para "${busqueda}"` : 'El catálogo está vacío'}
          </p>
          {!busqueda && (
            <Button size="sm" onClick={handleNuevo}>
              <Plus className="h-4 w-4 mr-1.5" />
              Agregar primer insumo
            </Button>
          )}
        </div>
      )}

      {/* Tabla */}
      {!isLoading && insumos.length > 0 && (
        <div className="rounded-md border overflow-hidden">
          {/* Header */}
          <div className="hidden md:grid grid-cols-[1fr_2.5fr_1fr_1.5fr_1.2fr_auto] gap-2 px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b bg-muted/30">
            <span>Código</span>
            <span>Descripción</span>
            <span>Tipo</span>
            <span className="text-right">P. Referencia</span>
            <span>Estado</span>
            <span />
          </div>

          <div className="divide-y">
            {insumos.map((insumo) => (
              <div key={insumo.id}>
                <div className={cn(
                  'grid grid-cols-[1fr_2.5fr_1fr_1.5fr_1.2fr_auto] gap-2 items-center px-4 py-3 text-sm',
                  !insumo.activo && 'opacity-60',
                )}>
                  <span className="font-mono text-xs text-muted-foreground">{insumo.codigo}</span>

                  <div className="min-w-0">
                    <p className="font-medium truncate">{insumo.descripcion}</p>
                    {insumo.proveedor && (
                      <p className="text-xs text-muted-foreground truncate">{insumo.proveedor}</p>
                    )}
                  </div>

                  <Badge
                    variant="outline"
                    className={cn('w-fit text-xs', TIPO_COLOR[insumo.tipo])}
                  >
                    {CATEGORIAS.find((c) => c.value === insumo.tipo)?.label ?? insumo.tipo}
                  </Badge>

                  <div className="text-right">
                    <span className="tabular-nums font-medium">
                      {simb(insumo.moneda)}{' '}
                      {insumo.precioReferencia.toLocaleString('es-CL', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-xs text-muted-foreground block">
                      {insumo.moneda} / {insumo.unidad}
                    </span>
                  </div>

                  <Badge variant={insumo.activo ? 'default' : 'secondary'} className="w-fit text-xs">
                    {insumo.activo ? 'Activo' : 'Inactivo'}
                  </Badge>

                  {/* Acciones */}
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleEditar(insumo)}
                      className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
                      title="Editar"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConfirmarAccion(insumo.id, insumo.activo ? 'desactivar' : 'reactivar')}
                      className={cn(
                        'p-1 rounded transition-colors',
                        insumo.activo
                          ? 'text-muted-foreground hover:text-destructive'
                          : 'text-muted-foreground hover:text-green-600',
                      )}
                      title={insumo.activo ? 'Desactivar' : 'Reactivar'}
                    >
                      {insumo.activo
                        ? <Ban className="h-3.5 w-3.5" />
                        : <RefreshCw className="h-3.5 w-3.5" />
                      }
                    </button>
                  </div>
                </div>

                {/* Confirmación inline */}
                {confirmId === insumo.id && (
                  <div className={cn(
                    'px-4 py-3 border-t flex items-center justify-between gap-3',
                    confirmAccion === 'desactivar'
                      ? 'bg-destructive/5 border-destructive/20'
                      : 'bg-green-50 border-green-200 dark:bg-green-950/20',
                  )}>
                    <p className={cn(
                      'text-sm font-medium',
                      confirmAccion === 'desactivar' ? 'text-destructive' : 'text-green-700 dark:text-green-400',
                    )}>
                      ¿{confirmAccion === 'desactivar' ? 'Desactivar' : 'Reactivar'} &quot;{insumo.descripcion}&quot;?
                    </p>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setConfirmId(null); setConfirmAccion(null) }}
                        disabled={isActualizando}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        variant={confirmAccion === 'desactivar' ? 'destructive' : 'default'}
                        onClick={ejecutarAccion}
                        disabled={isActualizando}
                      >
                        {isActualizando ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Confirmar'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contador */}
      {!isLoading && insumos.length > 0 && (
        <p className="text-xs text-muted-foreground text-right">
          {insumos.length} insumo{insumos.length !== 1 ? 's' : ''}
          {!soloActivos && ` (incluyendo inactivos)`}
        </p>
      )}

      {/* Modal formulario */}
      {showForm && (
        <FormularioInsumo
          insumo={editando}
          onClose={() => { setShowForm(false); setEditando(undefined) }}
        />
      )}
    </div>
  )
}
