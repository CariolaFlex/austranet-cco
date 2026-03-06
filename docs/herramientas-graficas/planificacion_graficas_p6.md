# M4 — Planificación de Herramientas Gráficas (Arquitectura Implementada)

> Versión: 1.0 · Fecha: 2026-03-06
> Estado: **implementado** — M4 completo, tag v4.0, commit 3be46b8
> Este documento describe la arquitectura **real** del Módulo M4, no aspiracional.

---

## 1. Visión General del Módulo M4

El Módulo 4 implementa un conjunto de herramientas visuales inspiradas en Primavera P6 para el control de proyectos de software. Está organizado en tres áreas:

| Área | Componentes | Ruta de acceso |
|------|-------------|----------------|
| **Cronograma** | Gantt Estándar, Tracking Gantt, PERT/Red CPM | `/proyectos/[id]` → tab "Cronograma" |
| **Control EVM** | Semáforos, EVM Chart, S-Curves, Histograma, EVM Table | `/proyectos/[id]` → tab "Control / EVM" |
| **Portafolio** | Bubble Chart, Risk Matrix Heatmap | `/` (Dashboard) → sección Portafolio |

---

## 2. Arquitectura de Datos

### Colecciones Firestore

```
tareas/                              ← Top-level, FK proyectoId
  {tareaId}
    nombre, descripcion
    fechaInicioPlaneada, fechaFinPlaneada (Date)
    fechaInicioReal?, fechaFinReal?  (Date, opcionales)
    duracion                         (número de días)
    estado: 'pendiente' | 'en_progreso' | 'completado' | 'suspendida'
    avancePct: 0-100
    recursos: AsignacionRecurso[]    (nombre, rol, horas)
    dependencias: Dependencia[]      (tareaId, tipo: FS|SS|FF|SF, lag)
    cpmCache?                        (es, ef, ls, lf: number; holgura; esCritica)
    hitoVinculadoId?                 (bridge con hitos M2)

proyectos/{id}/snapshots_evm/        ← Subcol. historial EVM
  {YYYY-MM-DD}                       ← ID = lunes de la semana (idempotente)
    fecha, bac, pv, ev, ac
    spi, cpi, sv, cv
    eac, etc, tcpi
    semaforoSPI, semaforoCPI (verde|amarillo|rojo|sin_datos)

proyectos/{id}/lineas_base/          ← Subcol. snapshots de línea base
  {lineaBaseId}
    nombre, descripcion
    creadaEn, activada (bool)
    tareasSnapshot: TareaSnapshot[]

proyectos/{id}                       ← Cache embebido
  kpisDashboard: KPIsDashboard?      ← Actualizado por Cloud Functions (pendiente)
  bac?: number
  lineaBaseActivaId?: string
```

### Tipos TypeScript clave (en `src/types/index.ts`)

```typescript
interface Tarea {
  id: string; proyectoId: string; nombre: string
  fechaInicioPlaneada: Date; fechaFinPlaneada: Date; duracion: number
  estado: EstadoTarea; avancePct: number
  recursos: AsignacionRecurso[]; dependencias: Dependencia[]
  cpmCache?: { es: number; ef: number; ls: number; lf: number
               holguraTotal: number; holguraLibre: number; esCritica: boolean }
}

interface KPIsDashboard {
  bac: number; pv: number; ev: number; ac: number; eac: number
  spi: number; cpi: number; sv: number; cv: number
  tcpi: number; diasRestantes: number; desviacionDias: number
  pctAvancePonderado: number; roi: number
  semaforoCronograma: SemaforoEVM; semaforoCostos: SemaforoEVM
  semaforoGeneral: SemaforoEVM
  actualizadoEn: Date
}

interface ProyectoConKPIs extends Proyecto {
  kpisDashboard: KPIsDashboard  // garantizado no-null para portafolio
}
```

---

## 3. Componentes del Módulo — Mapa de Archivos

### 3.1 Cronograma (`src/components/cronograma/`)

| Componente | Descripción | Librería |
|------------|-------------|----------|
| `GanttChart.tsx` | Gantt estándar con dependencias, CPM toggle, filtros | gantt-task-react@0.3.9 |
| `TrackingGantt.tsx` | Gantt de seguimiento (baseline gris + actual coloreado) | gantt-task-react@0.3.9 |
| `NetworkDiagram.tsx` | Diagrama PERT/Red interactivo con minimap | @xyflow/react + @dagrejs/dagre |
| `NodoCPMCustom.tsx` | Nodo React Flow con 9 celdas PERT (ES/EF/LS/LF/holgura) | @xyflow/react |
| `GanttToolbar.tsx` | Toolbar: zoom day/week/month, toggle CPM, filtro estado, export PDF | — |
| `hooks/useTareasGantt.ts` | `Tarea[]` → `Task[]` para gantt-task-react (incluye baseline) | — |
| `hooks/usePERTData.ts` | `Tarea[]` + CPM → `{nodes, edges}` con layout Dagre LR | @dagrejs/dagre |

**Punto de entrada:** `src/components/proyectos/TabCronograma.tsx`
Sub-tabs: `gantt` · `tracking` · `pert`

> **⚠️ SSR:false obligatorio** para `GanttChart`, `TrackingGantt` y `NetworkDiagram`

### 3.2 Control EVM (`src/components/control/`)

| Componente | Descripción | Librería |
|------------|-------------|----------|
| `SemaforoPanel.tsx` | 3 semáforos: CronogramaGeneral, Costos, General (modo `detailed` o `compact`) | Pure React |
| `KPIBadgeEVM.tsx` | Badge individual con valor y color según semáforo | Pure React |
| `EVMChart.tsx` | Gráfico de líneas PV/EV/AC con ReferenceLine en fecha actual | Recharts ComposedChart |
| `SCurveChart.tsx` | Curvas S acumulativas planificado vs real, con Brush para zoom | Recharts AreaChart |
| `EVMSummaryTable.tsx` | Tabla de resumen EVM con indicadores coloreados | Pure React |
| `ResourceHistogram.tsx` | Histograma de recursos por período con línea de capacidad | Recharts BarChart |

**Punto de entrada:** `src/components/proyectos/TabControlEVM.tsx`
Botón "Capturar Snapshot EVM" → `useCrearSnapshotDesdeTareas`

### 3.3 Portafolio (`src/components/portafolio/`)

| Componente | Descripción | Librería |
|------------|-------------|----------|
| `BubbleChartPortafolio.tsx` | Scatter chart: Eje X = SPI/Riesgo, Eje Y = CPI/ROI, Size = Presupuesto | Recharts ScatterChart |
| `RiskMatrixHeatmap.tsx` | Heatmap 5×5 de probabilidad vs impacto con puntos de proyectos | Pure CSS Grid |

**Punto de entrada:** `src/app/(dashboard)/page.tsx` → sección "Portafolio EVM"

---

## 4. Flujo de Datos EVM

```
useTareas(proyectoId)
  └─► Tarea[]
        ├─► evmService.calcularKPIsActuales(tareas, bac, fecha, opciones)
        │     └─► KPIsDashboard (live, sin guardar)
        │           └─► SemaforoPanel, EVMSummaryTable
        │
        ├─► useCrearSnapshotDesdeTareas.mutate(...)
        │     └─► evmService.crearSnapshotDesdeTareas()
        │           └─► setDoc(doc(subcol, lunISO), data)  ← idempotente
        │
        └─► ResourceHistogram (distribución de horas por semana)

useSnapshotsEVM(proyectoId)
  └─► SnapshotEVM[]  (ordenados ASC)
        ├─► EVMChart (líneas históricas PV/EV/AC)
        └─► SCurveChart (curvas acumulativas)
```

---

## 5. Algoritmo CPM

Implementado en `src/lib/cpm.ts`. Flujo:

1. **Forward pass (BFS):** calcula ES (Early Start) y EF (Early Finish)
2. **Backward pass (BFS inverso):** calcula LS (Late Start) y LF (Late Finish)
3. **Holguras:** `holguraTotal = LS - ES`, `holguraLibre` desde sucesor más temprano
4. **Ruta crítica:** `esCritica = holguraTotal === 0`

**Tipos:** ES/EF/LS/LF son **días enteros** desde el día 0 del proyecto (tipo `number`). Nunca usar `Date`.

**Límites:** Optimizado para ≤200 tareas en cliente. Para proyectos mayores, mover cálculo a Cloud Function.

---

## 6. Export

| Función | Archivo | Descripción |
|---------|---------|-------------|
| `exportarGanttPDF` | `src/lib/export-utils.ts` | Captura SVG del Gantt → jsPDF → descarga |
| `exportarEVMCSV` | `src/lib/export-utils.ts` | Snapshots EVM → CSV con separador `;` + BOM UTF-8 (compatible Excel es-CL) |

---

## 7. Cloud Functions — Estado Actual

| CF | Propósito | Estado |
|----|-----------|--------|
| `scheduledEVMSnapshot` | Captura snapshot EVM cada lunes automáticamente | ⏭️ PENDIENTE (requiere Firebase Functions activado) |
| `onTareaWrite` | Actualiza `kpisDashboard` en el proyecto cuando cambia una tarea | ⏭️ PENDIENTE |

Mientras estas CF no estén activas, `kpisDashboard` solo se actualiza mediante snapshot manual y `calcularKPIsActuales` calcula KPIs en tiempo real en el cliente.

---

## 8. Semáforos EVM

| KPI | Verde | Amarillo | Rojo |
|-----|-------|----------|------|
| SPI | ≥ 0.95 | 0.80 – 0.95 | < 0.80 |
| CPI | ≥ 0.95 | 0.80 – 0.95 | < 0.80 |
| General | Ambos verde | Al menos uno amarillo | Al menos uno rojo |

Colores y thresholds definidos en `src/constants/evm.ts`.
