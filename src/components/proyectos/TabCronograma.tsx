'use client'

/**
 * TabCronograma — M4 · Sprint M4-S04
 * Tab de Cronograma en ProyectoDetalle.
 * Sub-tabs: Gantt Estándar | Tracking Gantt | PERT / Red
 */

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { BarChart2, GitCompare, Network } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Proyecto } from '@/types'

// Lazy-load de componentes con SSR:false
const GanttChart = dynamic(
  () => import('@/components/cronograma/GanttChart').then((m) => ({ default: m.GanttChart })),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse bg-muted rounded-md" />,
  },
)

const TrackingGantt = dynamic(
  () => import('@/components/cronograma/TrackingGantt').then((m) => ({ default: m.TrackingGantt })),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse bg-muted rounded-md" />,
  },
)

const NetworkDiagram = dynamic(
  () => import('@/components/cronograma/NetworkDiagram').then((m) => ({ default: m.NetworkDiagram })),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse bg-muted rounded-md" />,
  },
)

// -------------------------------------------------------
// TIPOS
// -------------------------------------------------------

interface TabCronogramaProps {
  proyecto: Proyecto
}

type SubTab = 'gantt' | 'tracking' | 'pert'

const SUB_TABS: { id: SubTab; label: string; icon: React.ElementType }[] = [
  { id: 'gantt',    label: 'Gantt Estándar', icon: BarChart2  },
  { id: 'tracking', label: 'Tracking Gantt', icon: GitCompare },
  { id: 'pert',     label: 'PERT / Red',     icon: Network    },
]

// -------------------------------------------------------
// COMPONENTE
// -------------------------------------------------------

export function TabCronograma({ proyecto }: TabCronogramaProps) {
  const [subTab, setSubTab] = useState<SubTab>('gantt')

  return (
    <div className="space-y-4">
      {/* Sub-tab selector */}
      <div className="flex gap-1 border-b">
        {SUB_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSubTab(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px',
              subTab === id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      {subTab === 'gantt' && (
        <GanttChart proyectoId={proyecto.id} altura={500} />
      )}
      {subTab === 'tracking' && (
        <TrackingGantt proyectoId={proyecto.id} altura={500} />
      )}
      {subTab === 'pert' && (
        <NetworkDiagram proyectoId={proyecto.id} altura={520} />
      )}
    </div>
  )
}
