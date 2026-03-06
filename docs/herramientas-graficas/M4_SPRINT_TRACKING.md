# M4 — Cronograma y Control Visual · Sprint Tracking

> **Propósito:** Este archivo es el punto de entrada para cualquier chat nuevo que continúe el desarrollo del Módulo M4. Contiene el estado actual de implementación, decisiones tomadas y el siguiente paso exacto a ejecutar.
>
> **Instrucción para el modelo en un chat nuevo:**
> Lee este archivo completo primero. Luego lee `planificacion_graficas_p6.md` si necesitas detalles de arquitectura. Empieza desde el primer ítem con estado `🔲 PENDIENTE`.

---

## Estado Global del Módulo

| Campo | Valor |
|-------|-------|
| Fecha inicio M4 | 2026-03-04 |
| Fase actual | **FASE 6 — Polish y Export** |
| Sprint actual | **M4 COMPLETADO** |
| % completado global | 100% (Sprints S01–S07 ✅) |
| Último commit M4 | `3be46b8` feat(M4): Sprint M4-S07 |
| Branch | `main` |

---

## Leyenda de Estados

| Ícono | Significado |
|-------|------------|
| ✅ COMPLETADO | Implementado, con 0 errores TS, pusheado |
| 🔄 EN PROGRESO | En este chat/sesión actual |
| 🔲 PENDIENTE | No iniciado |
| ⏭️ BLOQUEADO | Depende de otro ítem pendiente |
| ⚠️ REVISIÓN | Completado pero requiere revisión/testing |

---

## SPRINT M4-S01 — Base de Datos y Tipos
**Objetivo:** Colección `tareas`, tipos TypeScript, servicios CRUD básicos, algoritmo CPM.
**Archivos clave a tocar:**
- `src/types/index.ts` (extender)
- `src/services/tareas.service.ts` (NUEVO)
- `src/services/lineas-base.service.ts` (NUEVO)
- `src/services/evm.service.ts` (NUEVO)
- `src/lib/cpm.ts` (NUEVO)
- `src/constants/evm.ts` (NUEVO)
- `src/hooks/useTareas.ts` (NUEVO)
- `src/hooks/useLineasBase.ts` (NUEVO)
- `src/hooks/useSnapshotsEVM.ts` (NUEVO)

| # | Tarea | Estado | Commit | Notas |
|---|-------|--------|--------|-------|
| 0.1 | Añadir tipos `Tarea`, `Dependencia`, `AsignacionRecurso`, `LineaBase`, `SnapshotEVM`, `KPIsDashboard` a `types/index.ts` | ✅ COMPLETADO | c482263 | |
| 0.2 | Extender interfaz `Proyecto` con `bac?`, `lineaBaseActivaId?`, `fechaInicioReal?`, `kpisDashboard?` | ✅ COMPLETADO | c482263 | |
| 0.3 | Crear `src/services/tareas.service.ts` | ✅ COMPLETADO | c482263 | |
| 0.4 | Crear `src/services/lineas-base.service.ts` | ✅ COMPLETADO | c482263 | |
| 0.5 | Crear `src/services/evm.service.ts` | ✅ COMPLETADO | c482263 | |
| 0.6 | Crear `src/lib/cpm.ts` | ✅ COMPLETADO | c482263 | |
| 0.7 | Crear `src/constants/evm.ts` | ✅ COMPLETADO | c482263 | |
| 0.8 | Crear `src/hooks/useTareas.ts` | ✅ COMPLETADO | c482263 | |
| 0.9 | Crear `src/hooks/useLineasBase.ts` | ✅ COMPLETADO | c482263 | |
| 0.10 | Crear `src/hooks/useSnapshotsEVM.ts` | ✅ COMPLETADO | c482263 | |
| 0.11 | `npx tsc --noEmit` → 0 errores | ✅ COMPLETADO | c482263 | |
| 0.12 | `git commit + push` Sprint M4-S01 | ✅ COMPLETADO | c482263 | |

---

## SPRINT M4-S02 — Componentes Base (Sin datos reales aún)
**Prerrequisito:** Sprint M4-S01 completado.
**Archivos clave:**
- `src/components/control/` (NUEVO directorio)
- `src/components/portafolio/` (NUEVO directorio)
- `src/components/common/ChartContainer.tsx` (NUEVO)

| # | Tarea | Estado | Commit | Notas |
|---|-------|--------|--------|-------|
| 1.1 | `src/components/common/ChartContainer.tsx` — wrapper con Skeleton + EmptyState | ✅ COMPLETADO | 999af4a | animate-pulse en vez de Skeleton (no existe en proyecto) |
| 1.2 | `src/components/control/SemaforoPanel.tsx` | ✅ COMPLETADO | 999af4a | Pure React, sin chart lib |
| 1.3 | `src/components/control/KPIBadgeEVM.tsx` | ✅ COMPLETADO | 999af4a | |
| 1.4 | `src/components/control/EVMSummaryTable.tsx` | ✅ COMPLETADO | 999af4a | Tabla con colores semáforo |
| 1.5 | `src/components/control/EVMChart.tsx` — Recharts ComposedChart (datos mock) | ✅ COMPLETADO | 999af4a | 3 Line: PV, EV, AC + ReferenceLine fecha hoy |
| 1.6 | `src/components/control/SCurveChart.tsx` — Recharts AreaChart (datos mock) | ✅ COMPLETADO | 999af4a | Curva acumulativa + Brush zoom |
| 1.7 | `src/components/control/ResourceHistogram.tsx` — Recharts BarChart (datos mock) | ✅ COMPLETADO | 999af4a | ReferenceLine para capacidad máxima |
| 1.8 | `src/components/portafolio/RiskMatrixHeatmap.tsx` — refactorizar desde `TabRiesgos` | ✅ COMPLETADO | 999af4a | Pure CSS grid 5×5, NO tocó TabRiesgos |
| 1.9 | `src/components/portafolio/BubbleChartPortafolio.tsx` — Recharts ScatterChart | ✅ COMPLETADO | 999af4a | Dot custom con tamaño = presupuesto |
| 1.10 | `src/components/control/index.ts` — re-exports | ✅ COMPLETADO | 999af4a | |
| 1.11 | `src/components/portafolio/index.ts` — re-exports | ✅ COMPLETADO | 999af4a | |
| 1.12 | `npx tsc --noEmit` → 0 errores | ✅ COMPLETADO | 999af4a | |
| 1.13 | `git commit + push` Sprint M4-S02 | ✅ COMPLETADO | 999af4a | |

---

## SPRINT M4-S03 — Gantt Chart
**Prerrequisito:** Sprint M4-S01 (tipos + hooks).
**Instalar:** `npm install gantt-task-react`
**Archivos clave:**
- `src/components/cronograma/` (NUEVO directorio)

| # | Tarea | Estado | Commit | Notas |
|---|-------|--------|--------|-------|
| 2.1 | `npm install gantt-task-react` | ✅ COMPLETADO | c5dac9c | gantt-task-react@0.3.9 |
| 2.2 | `src/components/cronograma/hooks/useTareasGantt.ts` | ✅ COMPLETADO | c5dac9c | Incluye useBaselineGanttTasks para TrackingGantt |
| 2.3 | `src/components/cronograma/GanttToolbar.tsx` | ✅ COMPLETADO | c5dac9c | Zoom day/week/month, toggle CPM, filtro por estado |
| 2.4 | `src/components/cronograma/GanttChart.tsx` (estándar) | ✅ COMPLETADO | c5dac9c | Dynamic import SSR:false, filtro + CPM toggle |
| 2.5 | `src/components/cronograma/TrackingGantt.tsx` | ✅ COMPLETADO | c5dac9c | Baseline gris + actual coloreado; alerta si sin LB |
| 2.6 | `src/components/cronograma/index.ts` — re-exports | ✅ COMPLETADO | c5dac9c | |
| 2.7 | `src/components/proyectos/TabCronograma.tsx` — sub-tabs: Gantt / Tracking | ✅ COMPLETADO | c5dac9c | Lazy load SSR:false en cada sub-tab |
| 2.8 | Agregar tab `{ id: 'cronograma', label: 'Cronograma', icon: GanttChartSquare }` a `TABS` en `ProyectoDetalle.tsx` | ✅ COMPLETADO | c5dac9c | |
| 2.9 | `npx tsc --noEmit` → 0 errores | ✅ COMPLETADO | c5dac9c | |
| 2.10 | `git commit + push` Sprint M4-S03 | ✅ COMPLETADO | c5dac9c | |

---

## SPRINT M4-S04 — Diagrama PERT / Network
**Prerrequisito:** Sprint M4-S01 (tipos + CPM).
**Instalar:** `npm install @xyflow/react @xyflow/dagre`

| # | Tarea | Estado | Commit | Notas |
|---|-------|--------|--------|-------|
| 3.1 | `npm install @xyflow/react @dagrejs/dagre` | ✅ COMPLETADO | — | `@xyflow/dagre` no existe en npm → usar `@dagrejs/dagre` (fork oficial xyflow) |
| 3.2 | `src/components/cronograma/NodoCPMCustom.tsx` — Custom node React Flow | ✅ COMPLETADO | — | 9 celdas PERT; acepta `NodeProps` genérico para compatibilidad v12 |
| 3.3 | `src/components/cronograma/hooks/usePERTData.ts` | ✅ COMPLETADO | — | `Tarea[]` + CPM inline → nodes + edges + Dagre layout (LR) |
| 3.4 | `src/components/cronograma/NetworkDiagram.tsx` | ✅ COMPLETADO | — | Dynamic imports SSR:false; NODE_TYPES: NodeTypes; minimap + leyenda |
| 3.5 | Agregar sub-tab `PERT / Red` en `TabCronograma.tsx` | ✅ COMPLETADO | — | SubTab 'pert' con ícono Network de lucide-react |
| 3.6 | Actualizar `src/components/cronograma/index.ts` | ✅ COMPLETADO | — | Exports: NetworkDiagram, NodoCPMCustom, NodoCPMData, usePERTData, PERTData |
| 3.7 | `npx tsc --noEmit` → 0 errores | ✅ COMPLETADO | — | |
| 3.8 | `git commit + push` Sprint M4-S04 | ✅ COMPLETADO | fe46f29 | |

---

## SPRINT M4-S05 — Control EVM (datos reales)
**Prerrequisito:** Sprints M4-S01 + M4-S02.

| # | Tarea | Estado | Commit | Notas |
|---|-------|--------|--------|-------|
| 4.1 | Conectar `EVMChart.tsx` a `useSnapshotsEVM(proyectoId)` (datos reales) | ✅ COMPLETADO | a4a6cb5 | Props `snapshots?` ya existían; TabControlEVM pasa datos reales |
| 4.2 | Conectar `SCurveChart.tsx` a datos reales | ✅ COMPLETADO | a4a6cb5 | Mismo patrón — props opcionales |
| 4.3 | Conectar `SemaforoPanel.tsx` a `proyecto.kpisDashboard` | ✅ COMPLETADO | a4a6cb5 | Prioridad: kpisDashboard → kpisLive → skeleton |
| 4.4 | Conectar `ResourceHistogram.tsx` a tareas reales | ✅ COMPLETADO | a4a6cb5 | Props `tareas?` ya existían; pasa `useTareas(proyectoId)` |
| 4.5 | `src/components/proyectos/TabControlEVM.tsx` — compone todos | ✅ COMPLETADO | a4a6cb5 | SemaforoPanel + EVMChart + SCurveChart + EVMSummaryTable + ResourceHistogram + btn Capturar Snapshot |
| 4.6 | Agregar tab `{ id: 'control', label: 'Control / EVM', icon: TrendingUp }` a `TABS` | ✅ COMPLETADO | a4a6cb5 | |
| 4.7 | Cloud Function `scheduledEVMSnapshot` (Firebase Functions) | ⏭️ BLOQUEADO | — | Diferido a S06/S07 — requiere Firebase Functions configurado |
| 4.8 | Cloud Function `onProyectoEstadoChange` (auto-captura LineaBase) | ⏭️ BLOQUEADO | — | Diferido |
| 4.9 | `npx tsc --noEmit` → 0 errores | ✅ COMPLETADO | a4a6cb5 | |
| 4.10 | `git commit + push` Sprint M4-S05 | ✅ COMPLETADO | a4a6cb5 | |

---

## SPRINT M4-S06 — Dashboard Portafolio
**Prerrequisito:** Sprint M4-S05 (`kpisDashboard` funcional).

| # | Tarea | Estado | Commit | Notas |
|---|-------|--------|--------|-------|
| 5.1 | Extender página `/dashboard` con sección portafolio | ✅ COMPLETADO | 85d3b83 | Sección "Portafolio EVM" con BubbleChart + RiskMatrix en xl:grid-cols-2 |
| 5.2 | `BubbleChartPortafolio.tsx` con datos reales (`useProyectos` + `kpisDashboard`) | ✅ COMPLETADO | 85d3b83 | Filtra `todosProyectos` con `!!kpisDashboard`; fallback mock cuando vacío |
| 5.3 | `RiskMatrixHeatmap` en modo portafolio (todos los proyectos) | ✅ COMPLETADO | 85d3b83 | `flatMap(p.riesgos)` de proyectos activos; `modo="portafolio"` |
| 5.4 | Cloud Function `onTareaWrite` → actualiza `kpisDashboard` en proyecto | ⏭️ BLOQUEADO | — | Diferido a S07/post — requiere Firebase Functions configurado |
| 5.5 | `npx tsc --noEmit` → 0 errores | ✅ COMPLETADO | 85d3b83 | |
| 5.6 | `git commit + push` Sprint M4-S06 | ✅ COMPLETADO | 85d3b83 | |

---

## SPRINT M4-S07 — Polish y Export
**Prerrequisito:** Todos los sprints anteriores.

| # | Tarea | Estado | Commit | Notas |
|---|-------|--------|--------|-------|
| 6.1 | Exportar Gantt a PDF (SVG → jsPDF, ya instalado) | ✅ COMPLETADO | 3be46b8 | `src/lib/export-utils.ts` → `exportarGanttPDF`; botón PDF en GanttToolbar |
| 6.2 | Exportar EVM a CSV | ✅ COMPLETADO | 3be46b8 | `exportarEVMCSV` en export-utils; botón en TabControlEVM (visible si hay snapshots) |
| 6.3 | Responsive Gantt (scroll horizontal ≥768px) | ✅ COMPLETADO | 3be46b8 | `minWidth: 800` en div interno de GanttChart y TrackingGantt |
| 6.4 | Error boundaries por gráfico | ✅ COMPLETADO | 3be46b8 | `ChartErrorBoundary` en `src/components/common/` — class component con Reintentar |
| 6.5 | Performance: `React.memo`, `useMemo` en CPM | ✅ COMPLETADO | 3be46b8 | memo en GanttChart, TrackingGantt, EVMChart, SCurveChart, SemaforoPanel; useMemo en TrackingGantt |
| 6.6 | `git commit + push` Sprint M4-S07 · TAG v4.0 | ✅ COMPLETADO | 3be46b8 | |

---

## Decisiones Arquitectónicas Tomadas (No discutir de nuevo)

| Decisión | Elección |
|----------|---------|
| Librería Gantt | `gantt-task-react` (MIT, React-native, FS/SS/FF/SF) |
| Librería PERT | `@xyflow/react` + `@xyflow/dagre` |
| Librería EVM/SCurves/Histogram/Bubble | `recharts` (ya instalado) |
| Sin ECharts | Bundle +500kb innecesario |
| Colección `tareas` | Top-level con `proyectoId` FK (igual que `srs`) |
| Coexistencia `hitos` M2 + `tareas` M4 | Bridge: `Tarea.hitoVinculadoId?` |
| Snapshots EVM | Subcol. semanal `proyectos/{id}/snapshots_evm` |
| Cache KPIs | `proyectos/{id}.kpisDashboard` (embebido) |
| CPM client-side | `src/lib/cpm.ts` para ≤200 tareas, CF para más |

---

## Contexto del Proyecto para Onboarding

- **Stack:** Next.js 14 App Router · TypeScript · Tailwind · shadcn/ui · Firebase/Firestore · TanStack Query · Recharts (instalado) · jsPDF + docx (instalados)
- **Módulos existentes:** M1 Entidades / M2 Proyectos / M3 Alcance-SRS
- **Patrón de archivos:** Servicio en `src/services/`, hook en `src/hooks/`, componente en `src/components/{modulo}/`
- **Patrón de hooks:** TanStack Query con `invalidateQueries` en mutations + toast via `sonner`
- **Firestore:** Colecciones top-level + subcol. para historial. `convertTimestamps` en `src/lib/firebase/firestore.ts`
- **ProyectoDetalle.tsx:** `src/components/proyectos/ProyectoDetalle.tsx` — tiene tabs array `TABS[]` + renderizado condicional por `tabActivo`
- **Sin SSR** para librerías de gráficos: usar `dynamic(() => import(...), { ssr: false })`
- **0 errores TS obligatorio** antes de cada commit

---

## Cómo continuar en un nuevo chat

1. Lee este archivo completo (`M4_SPRINT_TRACKING.md`)
2. Lee `planificacion_graficas_p6.md` para detalles de arquitectura (mismo directorio)
3. Lee `src/types/index.ts` para entender tipos actuales
4. Busca el primer ítem con estado `🔲 PENDIENTE` → empieza desde ahí
5. Al terminar un ítem: actualiza este archivo a `✅ COMPLETADO` con el número de commit
6. Siempre termina con `npx tsc --noEmit` + commit + push antes de cerrar el chat
