# Austranet CCO — Decisiones Técnicas (ADR)

> Versión: 1.0 · Fecha: 2026-03-06
> Formato: Architecture Decision Record (ADR) simplificado.
> Una vez tomada, una decisión no se discute de nuevo a menos que cambien las circunstancias.

---

## ADR-001 — Librería de Gantt: gantt-task-react

**Estado:** Aceptado (M4-S03, commit c5dac9c)

**Contexto:** Se necesita un componente Gantt para Next.js que soporte dependencias FS/SS/FF/SF, línea base visual y ruta crítica, con licencia MIT y mantenimiento activo.

**Decisión:** `gantt-task-react@0.3.9`

**Razones:**
- MIT license, instalación simple (`npm install gantt-task-react`)
- Soporta los 4 tipos de dependencia (FS, SS, FF, SF) nativamente
- Renderiza baseline y barras actuales en paralelo (TrackingGantt)
- Bundle ~90 KB (aceptable)
- Se integra con Next.js via `dynamic(..., { ssr: false })`

**Alternativas descartadas:**
- `dhtmlx-gantt`: licencia comercial
- `frappe-gantt`: solo FS, sin TypeScript nativo
- `react-gantt-chart`: abandonado

**Consecuencias:** Requiere `dynamic(ssr: false)` siempre. Las dependencias se mapean manualmente desde `Tarea.dependencias[]`.

---

## ADR-002 — Librería PERT/Red: @xyflow/react + @dagrejs/dagre

**Estado:** Aceptado (M4-S04, commit fe46f29)

**Contexto:** Se necesita un diagrama de red interactivo (PERT) con nodos arrastables, zoom, minimap y layout automático dirigido (LR).

**Decisión:** `@xyflow/react` (nodos/edges) + `@dagrejs/dagre` (layout)

**Razones:**
- `@xyflow/react` (ex ReactFlow) es el estándar de facto para diagramas de nodos en React
- MIT license, TypeScript first, activamente mantenido por xyflow.dev
- `@dagrejs/dagre` es el fork oficial del equipo xyflow del dagre original
- ⚠️ `@xyflow/dagre` **NO existe en npm** — el paquete correcto es `@dagrejs/dagre`
- Layout LR automático evita posicionamiento manual de 200+ nodos

**Consecuencias:**
- `NodeProps` se usa sin type parameter (genérico) en v12 — cast interno a `NodoCPMData`
- `NodoCPMData` debe extender `Record<string, unknown>` para compatibilidad con xyflow v12
- Requiere `dynamic(ssr: false)` para el componente que usa `ReactFlowProvider`

---

## ADR-003 — Librería de Gráficos EVM: Recharts

**Estado:** Aceptado (M4-S01/S02)

**Contexto:** Se necesitan gráficos interactivos para EVM (líneas PV/EV/AC), S-Curves (áreas acumulativas), Histograma de recursos (barras) y Bubble Chart (scatter) en el portafolio.

**Decisión:** `recharts` (ya instalado desde M2)

**Razones:**
- Ya estaba en el proyecto — 0 instalaciones adicionales
- MIT license, React-first API declarativa
- ComposedChart soporta Line + ReferenceLine en el mismo componente (necesario para EVM)
- Bundle acceptable (~220 KB gzipped)

**Alternativas descartadas:**
- `echarts` / `echarts-for-react`: +500 KB de bundle innecesario
- `chart.js` + `react-chartjs-2`: API imperativa, peor DX con TypeScript

---

## ADR-004 — Snapshots EVM: Idempotencia con setDoc

**Estado:** Aceptado (bug fix commit 368d945)

**Contexto:** Los snapshots EVM se capturan semanalmente. Se necesita que al recapturar la misma semana se actualice el documento existente, no crear un duplicado.

**Decisión:** El ID del snapshot es la fecha del lunes de la semana en ISO string (ej. `"2026-03-09"`). Se usa `setDoc(doc(subcol, snapshotId), data)` en lugar de `addDoc`.

**Razones:**
- `addDoc` genera IDs aleatorios — múltiples capturas de la misma semana crearían duplicados
- `setDoc` con ID predecible = upsert idempotente
- Al actualizar, se preserva `creadoEn` del documento existente (no se sobreescribe la fecha de creación original)

**Consecuencias:** El historial puede tener máximo 1 snapshot por semana. Si se necesita historial intradía hay que cambiar la estrategia de IDs.

---

## ADR-005 — KPIs Dashboard: Cache embebido en Proyecto

**Estado:** Aceptado (M4-S05)

**Contexto:** El dashboard principal y el portafolio necesitan leer KPIs de todos los proyectos. Calcularlos en tiempo real para cada proyecto en el dashboard sería O(n·m) queries.

**Decisión:** `proyecto.kpisDashboard` — objeto embebido en el documento del proyecto, actualizado por Cloud Functions cuando cambian las tareas.

**Razones:**
- O(1) por proyecto en lugar de O(tareas) por proyecto al cargar el dashboard
- Dashboard lee `proyectos[]` y ya tiene todos los KPIs para renderizar semáforos y bubble chart
- Cloud Functions actualizan el cache cuando hay writes en tareas (trigger `onTareaWrite`)

**Estado actual:** Cloud Functions pendientes de configurar. Mientras tanto, `useKPIsEVMActuales` calcula KPIs en cliente en tiempo real con `evmService.calcularKPIsActuales`.

**Consecuencias:** `kpisDashboard` puede estar desactualizado si las CF no están corriendo. El campo puede ser `null` (primera vez). Los componentes manejan este caso con fallback al cálculo live.

---

## ADR-006 — CPM Client-Side

**Estado:** Aceptado (M4-S01, `src/lib/cpm.ts`)

**Contexto:** Se necesita calcular la ruta crítica (CPM) para mostrar holguras y nodos críticos en Gantt y PERT.

**Decisión:** Cálculo client-side en `src/lib/cpm.ts` con BFS forward + backward pass.

**Razones:**
- Para proyectos ≤200 tareas el cálculo es <50ms en el cliente
- Elimina la necesidad de una Cloud Function para el MVP
- Algoritmo totalmente determinístico y testeable de forma unitaria

**Limitación:** Para proyectos con >200 tareas puede haber lag perceptible. Solución futura: mover a Cloud Function con trigger `onTareaWrite`.

**Tipos:** ES/EF/LS/LF son `number` (días enteros desde el día 0 del proyecto), NO `Date`. Este contrato es fijo entre `cpm.ts`, `types/index.ts` y `tareas.service.updateCPMCache`.

---

## ADR-007 — Colección tareas: Top-Level vs Subcol

**Estado:** Aceptado (M4-S01)

**Contexto:** Las tareas pertenecen a un proyecto. ¿Subcol `proyectos/{id}/tareas` o colección top-level `tareas` con FK?

**Decisión:** Colección top-level `tareas` con `proyectoId: string` como FK.

**Razones:**
- Consistencia con `srs` (también top-level con FK `proyectoId`)
- Permite queries cross-proyecto en el futuro (ej. todas las tareas asignadas a un usuario)
- Simplifica las Cloud Functions que necesitan escribir tareas en batch
- Firestore limita subcol writes en transacciones — FK es más flexible

**Consecuencia:** Hay que incluir siempre `where('proyectoId', '==', id)` en las queries.

---

## ADR-008 — ProyectoConKPIs en types/index.ts

**Estado:** Aceptado (refactor commit 556fe33)

**Contexto:** `BubbleChartPortafolio` necesitaba un tipo que extendiera `Proyecto` con `kpisDashboard` garantizado (no nullable). Estaba definido localmente en el componente.

**Decisión:** Mover `ProyectoConKPIs` a `src/types/index.ts` y re-exportar desde el barrel.

```typescript
export interface ProyectoConKPIs extends Proyecto {
  kpisDashboard: KPIsDashboard  // garantizado no-null
}
```

**Razones:**
- Los tipos de dominio nunca deben vivir en componentes de UI
- Otros componentes (ej. futura tabla de portafolio) necesitarán el mismo tipo
- El barrel `portafolio/index.ts` re-exporta desde `@/types` para compatibilidad de imports externos

---

## ADR-009 — getCurrentUserId/Name: Centralizado en auth.ts

**Estado:** Aceptado (refactor commit 556fe33)

**Contexto:** `getCurrentUserId()` y `getCurrentUserName()` estaban copiados en 3 servicios (`proyectos`, `tareas`, `lineas-base`).

**Decisión:** Definir una sola vez en `src/lib/firebase/auth.ts` e importar desde ahí.

**Razones:**
- DRY — una sola fuente de verdad para el comportamiento de autenticación
- Si cambia la lógica (ej. multi-tenant) se modifica en un solo lugar
- Consistencia: todos los servicios usan exactamente el mismo mensaje de error

**Regla:** Nunca copiar helpers de auth en servicios. Siempre importar de `@/lib/firebase/auth`.
