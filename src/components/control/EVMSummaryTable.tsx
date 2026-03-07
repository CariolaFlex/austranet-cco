'use client'

/**
 * EVMSummaryTable — M4
 * Tabla resumen con todos los indicadores EVM con colores semáforo.
 * PV, EV, AC, SV, CV, SPI, CPI, EAC, ETC, TCPI, BAC.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/lib'
import { cn } from '@/lib/utils'
import {
  SEMAFORO_COLOR,
  EVM_LABELS,
  calcularSemaforoSPI,
  calcularSemaforoCPI,
} from '@/constants/evm'
import type { SnapshotEVM, SemaforoEVM } from '@/types'

// -------------------------------------------------------
// HELPERS
// -------------------------------------------------------

function fmt(v: number, decimales = 2): string {
  return v.toLocaleString('es-CL', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  })
}

function fmtMonto(v: number): string {
  return v.toLocaleString('es-CL', { maximumFractionDigits: 0 })
}

interface FilaEVM {
  kpi: string
  nombre: string
  valor: string
  semaforo: SemaforoEVM
  descripcion: string
}

function buildFilas(snap: SnapshotEVM): FilaEVM[] {
  const { pv, ev, ac, sv, cv, spi, cpi, eac, etc, tcpi, bac } = snap

  return [
    {
      kpi: 'BAC',
      nombre: EVM_LABELS.BAC.nombre,
      valor: fmtMonto(bac),
      semaforo: 'sin_datos',
      descripcion: 'Presupuesto total aprobado',
    },
    {
      kpi: 'PV',
      nombre: EVM_LABELS.PV.nombre,
      valor: fmtMonto(pv),
      semaforo: 'sin_datos',
      descripcion: 'Trabajo planificado acumulado a hoy',
    },
    {
      kpi: 'EV',
      nombre: EVM_LABELS.EV.nombre,
      valor: fmtMonto(ev),
      semaforo: ev >= pv ? 'verde' : ev >= pv * 0.9 ? 'amarillo' : 'rojo',
      descripcion: 'Trabajo real completado (monetizado)',
    },
    {
      kpi: 'AC',
      nombre: EVM_LABELS.AC.nombre,
      valor: fmtMonto(ac),
      semaforo: 'sin_datos',
      descripcion: 'Costo real acumulado gastado',
    },
    {
      kpi: 'SV',
      nombre: EVM_LABELS.SV.nombre,
      valor: (sv >= 0 ? '+' : '') + fmtMonto(sv),
      semaforo: sv >= 0 ? 'verde' : sv >= -pv * 0.05 ? 'amarillo' : 'rojo',
      descripcion: 'SV = EV − PV. Negativo = retraso',
    },
    {
      kpi: 'CV',
      nombre: EVM_LABELS.CV.nombre,
      valor: (cv >= 0 ? '+' : '') + fmtMonto(cv),
      semaforo: cv >= 0 ? 'verde' : cv >= -ev * 0.05 ? 'amarillo' : 'rojo',
      descripcion: 'CV = EV − AC. Negativo = sobrecosto',
    },
    {
      kpi: 'SPI',
      nombre: EVM_LABELS.SPI.nombre,
      valor: fmt(spi, 3),
      semaforo: calcularSemaforoSPI(spi),
      descripcion: 'SPI = EV/PV. ≥0.95 verde',
    },
    {
      kpi: 'CPI',
      nombre: EVM_LABELS.CPI.nombre,
      valor: fmt(cpi, 3),
      semaforo: calcularSemaforoCPI(cpi),
      descripcion: 'CPI = EV/AC. ≥0.95 verde',
    },
    {
      kpi: 'EAC',
      nombre: EVM_LABELS.EAC.nombre,
      valor: fmtMonto(eac),
      semaforo: eac <= bac ? 'verde' : eac <= bac * 1.1 ? 'amarillo' : 'rojo',
      descripcion: 'EAC = BAC/CPI. Costo final proyectado',
    },
    {
      kpi: 'ETC',
      nombre: EVM_LABELS.ETC.nombre,
      valor: fmtMonto(etc),
      semaforo: 'sin_datos',
      descripcion: 'ETC = EAC − AC. Costo restante',
    },
    {
      kpi: 'TCPI',
      nombre: EVM_LABELS.TCPI.nombre,
      valor: fmt(tcpi, 3),
      semaforo: tcpi <= 1.0 ? 'verde' : tcpi <= 1.1 ? 'amarillo' : 'rojo',
      descripcion: 'TCPI ≤ 1: hay margen. > 1: necesita mejorar',
    },
  ]
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL
// -------------------------------------------------------

interface EVMSummaryTableProps {
  snapshot: SnapshotEVM
  className?: string
}

export function EVMSummaryTable({ snapshot, className }: EVMSummaryTableProps) {
  const filas = buildFilas(snapshot)

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Resumen EVM</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-2 px-4 font-semibold text-muted-foreground w-16">KPI</th>
                <th className="text-left py-2 px-4 font-semibold text-muted-foreground">Nombre</th>
                <th className="text-right py-2 px-4 font-semibold text-muted-foreground">Valor</th>
                <th className="text-left py-2 px-4 font-semibold text-muted-foreground hidden sm:table-cell">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((fila, i) => {
                const cfg = SEMAFORO_COLOR[fila.semaforo] ?? SEMAFORO_COLOR['sin_datos']
                return (
                  <tr
                    key={fila.kpi}
                    className={cn(
                      'border-b last:border-0',
                      i % 2 === 0 ? 'bg-background' : 'bg-muted/20',
                    )}
                  >
                    <td className="py-2 px-4">
                      <span
                        className={cn(
                          'inline-block rounded px-1.5 py-0.5 text-xs font-bold font-mono',
                          fila.semaforo !== 'sin_datos' ? cn(cfg.bg, cfg.text, cfg.border, 'border') : 'text-muted-foreground',
                        )}
                      >
                        {fila.kpi}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-muted-foreground">{fila.nombre}</td>
                    <td className={cn('py-2 px-4 text-right font-mono font-semibold', cfg.text)}>
                      {fila.valor}
                    </td>
                    <td className="py-2 px-4 text-xs text-muted-foreground hidden sm:table-cell">
                      {fila.descripcion}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
