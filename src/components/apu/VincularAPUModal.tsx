'use client'

/**
 * VincularAPUModal — M5-S02-06
 * Modal para vincular una tarea del proyecto a una partida de un APU.
 * Flujo: selector de tarea → selector de APU → selector de partida → cantidad → preview → confirmar.
 * Si la tarea ya tiene APU vinculado, permite desvincular.
 */

import { useState, useMemo } from 'react'
import {
  Link2, Link2Off, Calculator, ChevronRight,
  AlertCircle, CheckCircle2, Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/lib'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useTareas } from '@/hooks/useTareas'
import { useAPUs } from '@/hooks/useAPU'
import { useVincularAPUTarea, useDesvincularAPUTarea } from '@/hooks/useAPU'
import type { Tarea, APU, Partida } from '@/types'

// -------------------------------------------------------
// HELPERS
// -------------------------------------------------------

function simb(moneda: string): string {
  const map: Record<string, string> = { CLP: '$', USD: 'US$', UF: 'UF', PEN: 'S/', EUR: '€' }
  return map[moneda] ?? moneda
}

function fmt(n: number, moneda = 'CLP') {
  return `${simb(moneda)} ${n.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

// -------------------------------------------------------
// TIPOS
// -------------------------------------------------------

interface VincularAPUModalProps {
  proyectoId: string
  onClose: () => void
}

// -------------------------------------------------------
// SUB-COMPONENTE: InfoTareaVinculada
// -------------------------------------------------------

function InfoTareaVinculada({
  tarea,
  apus,
  onDesvincular,
  isDesvinculando,
}: {
  tarea: Tarea
  apus: APU[]
  onDesvincular: () => void
  isDesvinculando: boolean
}) {
  const apuActual = apus.find((a) => a.id === tarea.apuId)
  const partidaActual = apuActual?.partidas.find((p) => p.id === tarea.apuPartidaId)

  if (!tarea.apuId) return null

  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1">
            <Link2 className="h-3.5 w-3.5" />
            APU vinculado actualmente
          </p>
          <p className="text-sm font-semibold text-foreground">
            {apuActual?.nombre ?? tarea.apuId}
          </p>
          {partidaActual && (
            <p className="text-xs text-muted-foreground">
              Partida: {partidaActual.codigo} — {partidaActual.descripcion}
            </p>
          )}
          {tarea.costoPlaneado != null && (
            <p className="text-xs text-muted-foreground">
              Costo planeado actual:{' '}
              <span className="font-mono font-medium text-foreground">
                {fmt(tarea.costoPlaneado, apuActual?.moneda)}
              </span>
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onDesvincular}
          disabled={isDesvinculando}
          className="text-destructive border-destructive/40 hover:bg-destructive/10 shrink-0"
        >
          {isDesvinculando ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Link2Off className="h-3.5 w-3.5" />
          )}
          <span className="ml-1.5">Desvincular</span>
        </Button>
      </div>
    </div>
  )
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL
// -------------------------------------------------------

export function VincularAPUModal({ proyectoId, onClose }: VincularAPUModalProps) {
  // Selecciones del formulario
  const [tareaId,   setTareaId]   = useState<string>('')
  const [apuId,     setApuId]     = useState<string>('')
  const [partidaId, setPartidaId] = useState<string>('')
  const [cantidad,  setCantidad]  = useState<string>('1')

  // Datos remotos
  const { data: tareas = [], isLoading: loadingTareas } = useTareas(proyectoId)
  const { data: apus   = [], isLoading: loadingAPUs   } = useAPUs(proyectoId)

  // Mutaciones
  const vincular     = useVincularAPUTarea()
  const desvincular  = useDesvincularAPUTarea()

  // Derivados
  const tareaSeleccionada  = tareas.find((t) => t.id === tareaId)
  const apuSeleccionado    = apus.find((a) => a.id === apuId)
  const partidaSeleccionada: Partida | undefined = apuSeleccionado?.partidas.find(
    (p) => p.id === partidaId,
  )

  const cantidadNum = parseFloat(cantidad) || 0
  const costoPreview = useMemo(
    () => (partidaSeleccionada ? partidaSeleccionada.precioUnitario * cantidadNum : null),
    [partidaSeleccionada, cantidadNum],
  )

  // Resetear selecciones aguas abajo al cambiar tarea
  const handleTareaChange = (id: string) => {
    setTareaId(id)
    setApuId('')
    setPartidaId('')
    setCantidad('1')
  }

  // Resetear partida al cambiar APU
  const handleApuChange = (id: string) => {
    setApuId(id)
    setPartidaId('')
  }

  const puedeConfirmar =
    !!tareaId &&
    !!apuId &&
    !!partidaId &&
    cantidadNum > 0 &&
    !vincular.isPending

  const handleConfirmar = async () => {
    if (!puedeConfirmar || !partidaSeleccionada) return
    try {
      await vincular.mutateAsync({
        tareaId,
        proyectoId,
        apuId,
        partida: partidaSeleccionada,
        cantidad: cantidadNum,
      })
      onClose()
    } catch {
      // Manejado por onError en el hook
    }
  }

  const handleDesvincular = async () => {
    if (!tareaId) return
    try {
      await desvincular.mutateAsync({ tareaId, proyectoId })
      // Resetear estado local post-desvinculación
      setApuId('')
      setPartidaId('')
      setCantidad('1')
    } catch {
      // Manejado por onError en el hook
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Vincular Tarea a APU
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-1">

          {/* ── Paso 1: Tarea ── */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              1. Seleccionar tarea
            </label>
            {loadingTareas ? (
              <div className="h-9 animate-pulse bg-muted rounded-md" />
            ) : (
              <select
                value={tareaId}
                onChange={(e) => handleTareaChange(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">— Elige una tarea —</option>
                {tareas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}{t.apuId ? ' 🔗' : ''}
                  </option>
                ))}
              </select>
            )}

            {/* Info de APU ya vinculado */}
            {tareaSeleccionada && tareaSeleccionada.apuId && (
              <InfoTareaVinculada
                tarea={tareaSeleccionada}
                apus={apus}
                onDesvincular={handleDesvincular}
                isDesvinculando={desvincular.isPending}
              />
            )}
          </div>

          {/* ── Paso 2: APU ── */}
          {tareaId && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                2. Seleccionar APU
              </label>
              {loadingAPUs ? (
                <div className="h-9 animate-pulse bg-muted rounded-md" />
              ) : apus.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  No hay APUs en este proyecto. Crea uno en la pestaña &quot;Presupuesto APU&quot;.
                </p>
              ) : (
                <select
                  value={apuId}
                  onChange={(e) => handleApuChange(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">— Elige un APU —</option>
                  {apus.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre}
                      {a.estado === 'aprobado' ? ' ✓' : a.estado === 'revision' ? ' ⏳' : ''}
                      {' '}({a.moneda})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* ── Paso 3: Partida ── */}
          {apuId && apuSeleccionado && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                3. Seleccionar partida
              </label>
              {apuSeleccionado.partidas.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  Este APU no tiene partidas aún.
                </p>
              ) : (
                <select
                  value={partidaId}
                  onChange={(e) => setPartidaId(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">— Elige una partida —</option>
                  {apuSeleccionado.partidas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.codigo} — {p.descripcion} ({p.unidad}) ·{' '}
                      {simb(apuSeleccionado.moneda)}{p.precioUnitario.toLocaleString('es-CL')}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* ── Paso 4: Cantidad + Preview ── */}
          {partidaId && partidaSeleccionada && (
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  4. Cantidad ({partidaSeleccionada.unidad})
                </label>
                <input
                  type="number"
                  min="0.001"
                  step="0.01"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                  placeholder="0.00"
                />
              </div>

              {/* Preview de costo */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-primary mb-1">
                    <Calculator className="h-3.5 w-3.5" />
                    Preview de costo planeado
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Precio unitario</p>
                      <p className="font-mono font-medium">
                        {fmt(partidaSeleccionada.precioUnitario, apuSeleccionado?.moneda)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Cantidad</p>
                      <p className="font-mono font-medium">
                        {cantidadNum.toLocaleString('es-CL')} {partidaSeleccionada.unidad}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Costo planeado</p>
                      <p className="font-mono font-semibold text-primary">
                        {costoPreview != null
                          ? fmt(costoPreview, apuSeleccionado?.moneda)
                          : '—'}
                      </p>
                    </div>
                  </div>
                  {cantidadNum <= 0 && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      La cantidad debe ser mayor a cero
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={vincular.isPending}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmar}
            disabled={!puedeConfirmar}
          >
            {vincular.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Vinculando…
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirmar vinculación
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
