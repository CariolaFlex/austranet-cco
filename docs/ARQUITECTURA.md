# Austranet CCO — Arquitectura del Sistema

> Versión: 1.0 · Fecha: 2026-03-06
> Estado: **activo** — refleja el estado implementado (M1–M4 completos, tag v4.0)

---

## 1. Visión General

Austranet CCO es un sistema web de gestión de proyectos de software con análisis EVM (Earned Value Management), cronograma CPM/Gantt, visualización PERT y dashboard de portafolio. Está construido como una SPA con Server Components donde aplica y Client Components para interactividad.

**Stack principal:**
- **Framework:** Next.js 14 App Router (TypeScript strict)
- **UI:** Tailwind CSS + shadcn/ui + Framer Motion
- **Estado remoto:** TanStack Query v5 (cache, mutaciones, invalidación)
- **Estado local:** Zustand (UI store, auth store)
- **Backend:** Firebase — Authentication + Firestore
- **Gráficos:** Recharts (EVM, S-Curves, Histograma, BubbleChart), gantt-task-react (Gantt), @xyflow/react + @dagrejs/dagre (PERT)
- **Export:** jsPDF (PDF Gantt), papaparse/CSV nativo (EVM CSV)

---

## 2. Estructura de Directorios

```
src/
├── app/
│   ├── (auth)/               # Login, reset password — sin layout de dashboard
│   └── (dashboard)/          # Todas las rutas protegidas
│       ├── layout.tsx         # DashboardLayout con auth guard
│       ├── page.tsx           # Dashboard principal (portafolio)
│       ├── entidades/         # M1 — CRUD de entidades
│       ├── proyectos/         # M2 — gestión de proyectos
│       │   └── [id]/          # Detalle con tabs (cronograma, EVM, etc.)
│       ├── alcance/           # M3 — SRS por proyecto
│       └── configuracion/     # T-06 — settings globales
│
├── components/
│   ├── layout/               # Sidebar, Header, DashboardLayout
│   ├── common/               # Reutilizables: PageHeader, EmptyState,
│   │                          #   ChartContainer, ChartErrorBoundary
│   ├── ui/                   # Componentes shadcn (Button, Card, Dialog…)
│   ├── entidades/            # M1: TablaEntidades, FormularioEntidad…
│   ├── proyectos/            # M2+M4: ProyectoDetalle, TabCronograma,
│   │                          #   TabControlEVM, FormularioProyecto…
│   ├── alcance/              # M3: TablaRequerimientos, FormSRS…
│   ├── cronograma/           # M4: GanttChart, TrackingGantt,
│   │                          #   NetworkDiagram, NodoCPMCustom…
│   ├── control/              # M4: SemaforoPanel, EVMChart, SCurveChart,
│   │                          #   EVMSummaryTable, ResourceHistogram…
│   ├── portafolio/           # M4: BubbleChartPortafolio, RiskMatrixHeatmap
│   ├── busqueda/             # T-04: búsqueda global (cmdk)
│   └── transversal/          # T-01…T-06: componentes compartidos
│
├── hooks/                    # TanStack Query hooks por dominio
│   ├── useTareas.ts           # CRUD tareas + CPM invalidation
│   ├── useSnapshotsEVM.ts     # Snapshots + KPIs live
│   ├── useLineasBase.ts       # Líneas base
│   ├── useProyectos.ts        # Proyectos + filtros
│   └── …                     # useEntidades, useAlcance, etc.
│
├── services/                 # Capa de acceso a Firestore (sin estado)
│   ├── index.ts               # Barrel con los 11 servicios
│   ├── tareas.service.ts      # CRUD tareas + CPM cache update
│   ├── evm.service.ts         # Snapshots EVM + cálculo KPIs
│   ├── proyectos.service.ts   # CRUD proyectos + kpisDashboard update
│   └── …
│
├── lib/
│   ├── firebase/
│   │   ├── config.ts          # Firebase app init (lazy)
│   │   ├── auth.ts            # Auth helpers: getCurrentUserId/Name
│   │   └── firestore.ts       # getFirestoreDb, convertTimestamps,
│   │                          #   removeUndefined
│   ├── cpm.ts                 # Algoritmo CPM client-side (BFS forward/backward)
│   ├── export-utils.ts        # exportarGanttPDF, exportarEVMCSV
│   └── utils.ts               # cn(), formatDate, etc.
│
├── types/
│   └── index.ts               # ~1200 líneas — todos los tipos del sistema
│
├── constants/
│   ├── index.ts               # NAV_ITEMS, ROUTES, APP_NAME (no modificar)
│   └── evm.ts                 # SEMAFORO_COLOR, thresholds SPI/CPI
│
├── contexts/
│   └── AuthContext.tsx        # Firebase Auth provider
│
└── store/
    ├── useUIStore.ts          # Sidebar collapse, tema
    └── useAuthStore.ts        # Usuario autenticado (mirror de AuthContext)
```

---

## 3. Patrones de Implementación

### 3.1 Server vs Client Components

| Patrón | Regla |
|--------|-------|
| `PageHeader`, `EmptyState` | Server Components — NO `'use client'`, se les pasa LucideIcon como prop |
| Páginas con interactividad | `'use client'` en la página o en el componente interactivo |
| Gráficos (gantt-task-react, @xyflow/react) | `dynamic(() => import(...), { ssr: false })` obligatorio |
| Formularios, modales | `'use client'` |

### 3.2 Patrón Servicio → Hook → Componente

```
Firestore
  └─► service.ts          (async functions puras, sin React)
        └─► useHook.ts    (TanStack Query: useQuery / useMutation)
              └─► Componente.tsx  (consume el hook, renderiza UI)
```

Cada mutación invalida el queryKey correspondiente y muestra toast via `sonner`.

### 3.3 Patrón Firestore

```typescript
// Siempre:
const db = getFirestoreDb()                 // lazy init singleton
const raw = (await getDoc(ref)).data()
const data = convertTimestamps(raw)         // Timestamp → Date
await setDoc(ref, removeUndefined(payload)) // no guardar undefined
```

- **Colecciones top-level:** `entidades`, `proyectos`, `tareas`, `srs`, `usuarios`, `auditoria`, `configuracion`
- **Subcol. historial:** `proyectos/{id}/snapshots_evm`, `proyectos/{id}/lineas_base`
- **Soft delete:** tareas nunca se borran — `estado: 'suspendida'`

### 3.4 EVM — Snapshots Semanales

- ID del documento = lunes de la semana en ISO (`"2026-03-09"`)
- `setDoc(doc(subcol, snapshotId), data)` → idempotente (upsert)
- `kpisDashboard` embebido en el documento de proyecto para reads O(1) en dashboard
- Cloud Functions (`scheduledEVMSnapshot`, `onTareaWrite`) pendientes de configurar — actualmente los KPIs se calculan en cliente con `evmService.calcularKPIsActuales`

### 3.5 CPM

- Implementado en `src/lib/cpm.ts` (BFS forward + backward pass)
- ES/EF/LS/LF son **días enteros** desde el día 0 del proyecto (tipo `number`)
- Umbrales: client-side ≤ 200 tareas. Proyectos mayores necesitarán Cloud Function.

---

## 4. Módulos del Sistema

| Módulo | Descripción | Colecciones Firestore | Estado |
|--------|-------------|----------------------|--------|
| M1 — Entidades | CRUD de clientes/proveedores, stakeholders, riesgos | `entidades` | ✅ Completo |
| M2 — Proyectos | Wizard de creación, línea base, hitos, riesgos, repositorio config | `proyectos` | ✅ Completo |
| M3 — Alcance/SRS | Requerimientos funcionales/no-funcionales, trazabilidad | `srs` | ✅ Completo |
| M4 — Cronograma + Control | Gantt, PERT/CPM, EVM, Portafolio | `tareas`, `proyectos/{id}/snapshots_evm`, `proyectos/{id}/lineas_base` | ✅ Completo (v4.0) |
| M5 — APU | Análisis de Precios Unitarios: partidas, insumos, vinculación Tarea↔APU | `apus` | 🔄 En desarrollo (M5-S01 completo) |
| T — Transversal | Auth, Notificaciones, Auditoría, Búsqueda, Dashboard, Config | `usuarios`, `auditoria`, `configuracion` | ✅ Completo |

---

## 5. Flujo de Datos — Dashboard Portafolio

```
Firestore: proyectos[]
  └─► useProyectos()
        └─► filtra proyectos con !!kpisDashboard → ProyectoConKPIs[]
              ├─► BubbleChartPortafolio (SPI vs CPI, size = presupuesto)
              └─► RiskMatrixHeatmap (flatMap de riesgos por proyecto)
```

---

## 6. Convenciones de Código

- **Imports:** `@/` alias siempre (no rutas relativas entre módulos)
- **Types:** Todo en `src/types/index.ts`. Los tipos locales solo si son 100% internos al archivo.
- **Colores de acento:** `text-primary`, `bg-primary/10`, `border-primary` (blue-600)
- **Loading states:** `animate-pulse` + `bg-muted rounded` (no usar componente `Skeleton`)
- **Error boundaries:** `ChartErrorBoundary` wrapeando cada gráfico en listas/dashboards
- **Commit:** siempre `npx tsc --noEmit` → 0 errores antes de hacer commit

---

## 7. Próximos Pasos

### M5 — APU (En progreso)

**M5-S01 ✅ (commit 8ea6f90):** Capa de datos completa
- `apus/` colección Firestore: top-level, FK `proyectoId`, partidas embebidas
- `apu.service.ts`: CRUD APU + CRUD partidas/insumos con full-replace (ADR-010)
- `tareas.service.ts` extendido: `vincularAPU()` + `desvincularAPU()`
- `useAPU.ts`: 16 hooks TanStack Query (queries + mutations APU/Partida/Insumo/Vinculación)
- `Tarea` extendida: `apuId?`, `apuPartidaId?`, `cantidad?`, `costoUnitarioAPU?`

**M5-S02 (pendiente):** UI — TablaAPUs, FormularioAPU, TablaPartidas, TablaInsumos, modal vinculación Tarea↔APU

**M5-S03 (pendiente):** Catálogo de insumos global, reportes de costo APU vs EAC

### Otros pendientes
- **Cloud Functions:** `scheduledEVMSnapshot` (snapshot semanal automático) + `onTareaWrite` (actualiza `kpisDashboard`)
- **Tests:** Unitarios para `cpm.ts` y `evmService.calcularKPIsActuales`
- **Performance:** Paginación en tablas grandes, virtualización en Gantt >200 tareas
