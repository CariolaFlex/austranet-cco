'use client'

/**
 * TabControlEVM — M4 · Sprint M4-S05
 * Tab de Control / EVM en ProyectoDetalle.
 * Conecta los componentes de S02 con datos reales de Firestore:
 *  - SemaforoPanel ← proyecto.kpisDashboard o KPIs calculados en vivo
 *  - EVMChart      ← useSnapshotsEVM (historial semanal)
 *  - SCurveChart   ← useSnapshotsEVM (curvas acumulativas)
 *  - EVMSummaryTable ← snapshot más reciente (o KPIs live)
 *  - ResourceHistogram ← useTareas (asignaciones reales)
 *
 * Botón "Capturar Snapshot EVM" → graba snapshot manual en Firestore.
 */

import { useMemo, useCallback } from 'react'
import { TrendingUp, Camera, RefreshCw, Info, Download } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib'
import { SemaforoPanel } from '@/components/control/SemaforoPanel'
import { EVMChart } from '@/components/control/EVMChart'
import { SCurveChart } from '@/components/control/SCurveChart'
import { EVMSummaryTable } from '@/components/control/EVMSummaryTable'
import { ResourceHistogram } from '@/components/control/ResourceHistogram'
import { useTareas } from '@/hooks/useTareas'
import {
  useSnapshotsEVM,
  useKPIsEVMActuales,
  useCrearSnapshotDesdeTareas,
} from '@/hooks/useSnapshotsEVM'
import { exportarEVMCSV } from '@/lib/export-utils'
import type { Proyecto, KPIsDashboard, SnapshotEVM } from '@/types'

// -------------------------------------------------------
// TIPOS
// -------------------------------------------------------

interface TabControlEVMProps {
  proyecto: Proyecto
}

// -------------------------------------------------------
// HELPERS
// -------------------------------------------------------

/**
 * Construye un SnapshotEVM sintético a partir de KPIsDashboard.
 * Se usa para EVMSummaryTable cuando no hay snapshots históricos.
 */
function kpisASnapshot(kpis: KPIsDashboard): SnapshotEVM {
  const { bac, pv, ev, ac, eac, spi, cpi } = kpis
  const acSafe = ac > 0 ? ac : 1   // evitar división por cero en TCPI
  return {
    id: 'live',
    fecha: kpis.actualizadoEn,
    bac,
    pv,
    ev,
    ac,
    spi,
    cpi,
    sv: ev - pv,
    cv: ev - ac,
    eac,
    etc: Math.max(0, eac - ac),
    tcpi: bac > ev ? (bac - ev) / (bac - acSafe) : 1,
    semaforoSPI: kpis.semaforoCronograma,
    semaforoCPI: kpis.semaforoCostos,
    creadoEn: new Date(),
  }
}

// -------------------------------------------------------
// COMPONENTE
// -------------------------------------------------------

export function TabControlEVM({ proyecto }: TabControlEVMProps) {
  const bac = proyecto.bac ?? 0

  // ─── Datos ──────────────────────────────────────────────────────────────────
  const { data: tareas = [], isLoading: loadingTareas } = useTareas(proyecto.id)
  const { data: snapshots = [], isLoading: loadingSnapshots } = useSnapshotsEVM(proyecto.id)
  const { data: kpisLiveRaw, isLoading: loadingKpisLive } = useKPIsEVMActuales(
    tareas,
    bac,
    proyecto.id,
  )

  const { mutate: capturarSnapshot, isPending: capturando } = useCrearSnapshotDesdeTareas()

  const handleExportCSV = useCallback(() => {
    exportarEVMCSV(snapshots, proyecto.nombre)
  }, [snapshots, proyecto.nombre])

  // ─── Construir KPIsDashboard para SemaforoPanel ───────────────────────────
  const kpisDashboard: KPIsDashboard | null = useMemo(() => {
    // Prioridad 1: KPIs cacheados en el documento del proyecto (actualizados por Cloud Functions)
    if (proyecto.kpisDashboard) return proyecto.kpisDashboard

    // Prioridad 2: KPIs calculados en vivo desde tareas (antes de que exista Cloud Function)
    if (kpisLiveRaw) {
      return { ...kpisLiveRaw, actualizadoEn: new Date() } satisfies KPIsDashboard
    }

    return null
  }, [proyecto.kpisDashboard, kpisLiveRaw])

  // ─── Snapshot más reciente para EVMSummaryTable ───────────────────────────
  const snapshotActual: SnapshotEVM | null = useMemo(() => {
    if (snapshots.length > 0) return snapshots[snapshots.length - 1]
    if (kpisDashboard) return kpisASnapshot(kpisDashboard)
    return null
  }, [snapshots, kpisDashboard])

  // ─── Estados de carga globales ────────────────────────────────────────────
  const isLoading = loadingTareas || loadingSnapshots

  // ─── Sin BAC definido — no se puede hacer EVM ─────────────────────────────
  const sinBAC = bac <= 0

  // -----------------------------------------------------------------------
  // RENDER
  // -----------------------------------------------------------------------

  return (
    <div className="space-y-6">

      {/* ── Header con botón Capturar Snapshot ──────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold">Control de Valor Ganado (EVM)</h2>
          {snapshots.length > 0 && (
            <span className="text-xs text-muted-foreground">
              · {snapshots.length} snapshot{snapshots.length !== 1 ? 's' : ''}
              {' '} · Último: {format(new Date(snapshots[snapshots.length - 1].fecha), 'd MMM yyyy', { locale: es })}
            </span>
          )}
        </div>

        {snapshots.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCSV}
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Exportar CSV
          </Button>
        )}

        <Button
          size="sm"
          variant="outline"
          onClick={() => capturarSnapshot({ proyectoId: proyecto.id, tareas, bac })}
          disabled={capturando || sinBAC || tareas.length === 0}
        >
          {capturando ? (
            <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
          ) : (
            <Camera className="h-3.5 w-3.5 mr-1.5" />
          )}
          Capturar Snapshot EVM
        </Button>
      </div>

      {/* ── Aviso si no hay BAC configurado ──────────────────────────────── */}
      {sinBAC && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
          <CardContent className="flex items-start gap-3 py-4">
            <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <p className="font-medium">BAC no configurado</p>
              <p className="text-xs mt-0.5">
                Para activar el análisis EVM, define el presupuesto total (BAC) en la configuración del proyecto.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Fila 1: Semáforos ────────────────────────────────────────────── */}
      {kpisDashboard ? (
        <SemaforoPanel kpis={kpisDashboard} modo="detailed" />
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Indicadores de Salud EVM</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading || loadingKpisLive ? (
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 animate-pulse bg-muted rounded-lg" />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                {sinBAC
                  ? 'Define el BAC del proyecto para ver los indicadores EVM.'
                  : 'Captura un snapshot EVM para ver los indicadores de salud.'}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Fila 2: EVM Chart + S-Curve ──────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <EVMChart
          snapshots={snapshots.length > 0 ? snapshots : undefined}
          bac={bac > 0 ? bac : undefined}
          isLoading={loadingSnapshots}
          altura={300}
        />
        <SCurveChart
          snapshots={snapshots.length > 0 ? snapshots : undefined}
          bac={bac}
          isLoading={loadingSnapshots}
          altura={300}
        />
      </div>

      {/* ── Fila 3: EVM Summary Table + Resource Histogram ───────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {snapshotActual ? (
          <EVMSummaryTable snapshot={snapshotActual} />
        ) : (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Resumen EVM</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 animate-pulse bg-muted rounded" />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  Sin datos EVM disponibles.{' '}
                  {sinBAC ? 'Configura el BAC primero.' : 'Captura un snapshot para comenzar.'}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <ResourceHistogram
          tareas={tareas.length > 0 ? tareas : undefined}
          isLoading={loadingTareas}
          altura={300}
        />
      </div>
    </div>
  )
}
