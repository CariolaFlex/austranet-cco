'use client'

// ============================================================
// COMPONENTE: SRSPage — Contenedor principal del SRS
// Sprint M3-FULL · Stepper de 8 fases + 2 gates
// Controla qué fases están habilitadas según ESTADO_SRS_FASES
// ============================================================

import { useState } from 'react'
import {
  FileText, Search, FlaskConical, LayoutList, ClipboardList,
  Calendar, CheckSquare, Rocket, Lock, CheckCircle2,
  AlertTriangle, ChevronRight, Info, ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/lib'
import { ESTADO_SRS_CONFIG, ROUTES } from '@/constants'
import { ESTADO_SRS_FASES } from '@/constants/alcance'
import type { Proyecto, SRS } from '@/types'
import { Fase1Panel } from './Fase1Panel'
import { Fase2Panel } from './Fase2Panel'
import { Fase3Panel } from './Fase3Panel'
import { Fase4Panel } from './Fase4Panel'
import { Fase5Panel } from './Fase5Panel'
import { Fase6Panel } from './Fase6Panel'
import { Fase7Panel } from './Fase7Panel'
import { Fase8Panel } from './Fase8Panel'

// -------------------------------------------------------
// TIPOS
// -------------------------------------------------------

interface Props {
  proyecto: Proyecto
  srs: SRS
}

type FaseId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

interface FaseConfig {
  id: FaseId
  label: string
  sublabel: string
  icon: React.ComponentType<{ className?: string }>
  gateAntes?: string // gate que precede esta fase
}

// -------------------------------------------------------
// CONFIGURACIÓN DE FASES
// -------------------------------------------------------

const FASES_CONFIG: FaseConfig[] = [
  {
    id: 1,
    label: 'Fase 1',
    sublabel: 'Inicio del Negocio',
    icon: FileText,
    gateAntes: undefined,
  },
  {
    id: 2,
    label: 'Fase 2',
    sublabel: 'Adquisición',
    icon: Search,
    gateAntes: 'GATE 1',
  },
  {
    id: 3,
    label: 'Fase 3',
    sublabel: 'Prototipado',
    icon: FlaskConical,
  },
  {
    id: 4,
    label: 'Fase 4',
    sublabel: 'Modelado',
    icon: LayoutList,
  },
  {
    id: 5,
    label: 'Fase 5',
    sublabel: 'Especificación',
    icon: ClipboardList,
  },
  {
    id: 6,
    label: 'Fase 6',
    sublabel: 'Planificación',
    icon: Calendar,
  },
  {
    id: 7,
    label: 'Fase 7',
    sublabel: 'Validación',
    icon: CheckSquare,
  },
  {
    id: 8,
    label: 'Fase 8',
    sublabel: 'Transición',
    icon: Rocket,
    gateAntes: 'GATE 2',
  },
]

// -------------------------------------------------------
// HELPERS
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
  cyan:   'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400 border-cyan-200',
  indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200',
}

// -------------------------------------------------------
// COMPONENTE GATE INDICATOR
// -------------------------------------------------------

function GateIndicator({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className={`
      flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border my-1 mx-2
      ${passed
        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
      }
    `}>
      {passed ? <CheckCircle2 className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
      {label}
    </div>
  )
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL
// -------------------------------------------------------

export function SRSPage({ proyecto, srs }: Props) {
  const fasesHabilitadas = ESTADO_SRS_FASES[srs.estado]?.fasesHabilitadas ?? []

  // Seleccionar la primera fase habilitada por defecto
  const defaultFase = (fasesHabilitadas[0] ?? 1) as FaseId
  const [faseActiva, setFaseActiva] = useState<FaseId>(defaultFase)

  const estadoConfig = ESTADO_SRS_CONFIG[srs.estado]

  const gate1Passed = ['en_adquisicion', 'en_prototipado', 'en_modelado', 'en_especificacion', 'en_validacion', 'con_observaciones', 'aprobado'].includes(srs.estado)
  const gate2Passed = srs.estado === 'aprobado'

  const handleFaseClick = (fase: FaseId) => {
    if ((fasesHabilitadas as readonly number[]).includes(fase)) {
      setFaseActiva(fase)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="sm" asChild className="-ml-2">
              <Link href={`${ROUTES.PROYECTOS}/${proyecto.id}`}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                {proyecto.codigo}
              </Link>
            </Button>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">SRS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Especificación de Requerimientos
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {proyecto.nombre} · {srs.version}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant="outline" className={colorMap[estadoConfig?.color ?? 'gray']}>
            {estadoConfig?.label ?? srs.estado}
          </Badge>
          {srs.tipoSRS && (
            <Badge variant="outline" className="text-xs">
              SRS {srs.tipoSRS}
            </Badge>
          )}
        </div>
      </div>

      {/* SRS Cancelado */}
      {srs.estado === 'cancelado' && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-800 dark:text-red-400">SRS Cancelado (Gate 1 No-Go)</p>
                {srs.factibilidad?.motivoCancelacion && (
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {srs.factibilidad.motivoCancelacion}
                  </p>
                )}
                {srs.gate1DecisionPor && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Decisión por: {srs.gate1DecisionPor} · {srs.gate1FechaDecision ? new Date(srs.gate1FechaDecision).toLocaleDateString('es-CL') : ''}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Layout: stepper + contenido */}
      <div className="flex gap-4 min-h-[600px]">
        {/* Stepper lateral */}
        <div className="w-52 flex-shrink-0">
          <nav className="space-y-0.5">
            {FASES_CONFIG.map((fase) => {
              const isHabilitada = (fasesHabilitadas as readonly number[]).includes(fase.id)
              const isActiva = faseActiva === fase.id
              const Icon = fase.icon

              return (
                <div key={fase.id}>
                  {/* Gate indicator antes de Fase 2 y Fase 8 */}
                  {fase.id === 2 && (
                    <GateIndicator label="GATE 1" passed={gate1Passed} />
                  )}
                  {fase.id === 8 && (
                    <GateIndicator label="GATE 2" passed={gate2Passed} />
                  )}

                  <button
                    onClick={() => handleFaseClick(fase.id)}
                    disabled={!isHabilitada}
                    className={`
                      w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors
                      ${isActiva
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : isHabilitada
                          ? 'hover:bg-muted/60 text-foreground'
                          : 'opacity-40 cursor-not-allowed text-muted-foreground'
                      }
                    `}
                  >
                    <div className={`
                      p-1.5 rounded-md flex-shrink-0
                      ${isActiva ? 'bg-primary/20' : isHabilitada ? 'bg-muted' : 'bg-muted/50'}
                    `}>
                      <Icon className={`h-3.5 w-3.5 ${isActiva ? 'text-primary' : ''}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold leading-tight">{fase.label}</div>
                      <div className="text-xs text-muted-foreground truncate leading-tight">{fase.sublabel}</div>
                    </div>
                    {!isHabilitada && <Lock className="h-3 w-3 ml-auto flex-shrink-0 opacity-50" />}
                  </button>
                </div>
              )
            })}
          </nav>

          {/* Info del SRS */}
          <div className="mt-4 p-3 rounded-lg bg-muted/40 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Info className="h-3 w-3" />
              <span className="font-medium">Estado actual</span>
            </div>
            <p className="text-xs text-foreground font-medium">
              {ESTADO_SRS_FASES[srs.estado]?.label ?? srs.estado}
            </p>
            {srs.contadorCiclosValidacion !== undefined && srs.contadorCiclosValidacion > 0 && (
              <p className={`text-xs ${srs.contadorCiclosValidacion > 3 ? 'text-red-600' : 'text-muted-foreground'}`}>
                Ciclos validación: {srs.contadorCiclosValidacion}
                {srs.contadorCiclosValidacion > 3 && ' ⚠️'}
              </p>
            )}
            {srs.iteracionesBucle && srs.iteracionesBucle.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Iteraciones: {srs.iteracionesBucle.length}
              </p>
            )}
          </div>
        </div>

        {/* Contenido de la fase activa */}
        <div className="flex-1 min-w-0">
          {faseActiva === 1 && (
            <Fase1Panel srs={srs} proyecto={proyecto} onAdvance={() => setFaseActiva(2)} />
          )}
          {faseActiva === 2 && (
            <Fase2Panel srs={srs} proyecto={proyecto} onAdvance={() => setFaseActiva(3)} />
          )}
          {faseActiva === 3 && (
            <Fase3Panel srs={srs} proyecto={proyecto} onAdvance={() => setFaseActiva(4)} />
          )}
          {faseActiva === 4 && (
            <Fase4Panel srs={srs} proyecto={proyecto} onAdvance={() => setFaseActiva(5)} />
          )}
          {faseActiva === 5 && (
            <Fase5Panel srs={srs} proyecto={proyecto} onAdvance={() => setFaseActiva(6)} />
          )}
          {faseActiva === 6 && (
            <Fase6Panel srs={srs} proyecto={proyecto} onAdvance={() => setFaseActiva(7)} />
          )}
          {faseActiva === 7 && (
            <Fase7Panel srs={srs} proyecto={proyecto} onAdvance={() => setFaseActiva(8)} />
          )}
          {faseActiva === 8 && (
            <Fase8Panel srs={srs} proyecto={proyecto} />
          )}
        </div>
      </div>
    </div>
  )
}
