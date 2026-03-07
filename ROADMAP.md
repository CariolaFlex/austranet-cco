# Hoja de Ruta — Austranet CCO

> Versión: 2.0 · Fecha: 2026-03-07 · Estado: **MVP completado y listo para presentación**

---

## Estado Actual

El sistema ha alcanzado la cobertura funcional completa del MVP. Todos los módulos de negocio (M1–M5) y los componentes transversales están operativos con persistencia en Firebase Firestore.

### Módulos funcionales

| Módulo | Descripción | Estado |
| :-- | :-- | :-- |
| **M1 — Entidades** | CRUD de clientes/proveedores, stakeholders, evaluación de factibilidad, KPIs de completitud, glosario de dominio | ✅ Completo |
| **M2 — Proyectos** | Wizard de 7 pasos, línea base, hitos, riesgos, seguimiento, cierre/cancelación, repositorio de configuración | ✅ Completo |
| **M3 — Alcance / SRS** | Especificación IEEE 830, 8 fases, trazabilidad, CCB, exportación PDF / DOCX / JSON | ✅ Completo |
| **M4 — Cronograma + Control** | Gantt interactivo, CPM/PERT, EVM con Curvas S, histograma de recursos, portafolio bubble chart, exportación PDF/CSV | ✅ Completo |
| **M5 — APU** | Análisis de Precios Unitarios: CRUD de partidas e insumos, vinculación Tarea↔APU, catálogo global de insumos, exportación PDF/CSV | ✅ Completo |
| **T — Transversales** | Autenticación Firebase Auth, notificaciones (badge + página), auditoría M1–M5 (tabla + exportación), búsqueda global, admin de usuarios | ✅ Completo |
| **Firestore Rules v3.0** | Reglas explícitas para todas las colecciones. `isAdmin()` via `get()` sobre `usuarios/{uid}`. 0 errores en validación. | ✅ Completo |

---

## Arquitectura Técnica

### Stack principal

| Capa | Tecnología |
| :-- | :-- |
| Framework | Next.js 14 App Router · TypeScript strict |
| UI | Tailwind CSS · shadcn/ui · Framer Motion |
| Estado remoto | TanStack Query v5 (cache + invalidación automática) |
| Estado local | Zustand (UI store, auth store) |
| Backend | Firebase Authentication + Cloud Firestore |
| Gráficos | Recharts (EVM/KPIs), gantt-task-react (Gantt), @xyflow/react + @dagrejs/dagre (PERT/CPM) |
| Exportación | jsPDF (PDFs), CSV nativo con BOM `\ufeff` + separador `;` (Excel es-CL) |

### Decisiones técnicas clave (ADRs)

| ADR | Decisión | Motivación |
| :-- | :-- | :-- |
| ADR-001 | Next.js 14 App Router | SSR + RSC para páginas de listado; interactividad granular con Client Components |
| ADR-003 | TanStack Query v5 | Cache declarativo + invalidación automática tras mutaciones Firestore |
| ADR-007 | EVM via snapshots semanales | ID = lunes ISO → upsert idempotente; máx. 104 docs/proyecto en 2 años |
| ADR-008 | CPM client-side (≤ 200 tareas) | BFS forward + backward pass en `src/lib/cpm.ts`; suficiente para el MVP |
| ADR-009 | Firestore Rules: `isAdmin()` via `get()` | Sin custom claims → no requiere Functions para gestión de roles |
| ADR-010 | APU: full-replace de `partidas[]` | Consistencia de datos; evita conflictos de `arrayUnion` con updates concurrentes |

### Colecciones Firestore

```
entidades/          → M1 — clientes, proveedores
proyectos/          → M2 — proyectos con wizard
  └─ lineas_base/   → M4 — líneas base del cronograma
  └─ snapshots_evm/ → M4 — snapshots EVM semanales (ID = lunes ISO)
tareas/             → M4 — top-level con FK proyectoId
srs/                → M3 — SRS por proyecto
apus/               → M5 — APUs con partidas embebidas, FK proyectoId
catalogo_insumos/   → M5 — catálogo global con soft-delete (activo=false)
usuarios/           → T  — perfil + rol (admin / pm / analista)
auditoria/          → T  — log de acciones M1–M5 + módulo T
configuracion/      → T  — ajustes globales de la organización (write: isAdmin)
```

---

## Sprints Completados

### 🏁 Sprint 0 — Setup y base
**Objetivo:** Scaffolding, Firebase, layout dashboard, componentes UI base.
**Commit:** scaffolding inicial con Next.js 14, Auth flow, stores Zustand, 13 páginas placeholder.

---

### 🏗️ Sprint M1 — Módulo Entidades
**Objetivo:** CRUD completo de entidades con Firebase, stakeholders, factibilidad, KPIs, glosario.
**Entregable:** Módulo 1 al 100% con wizard de 3 pasos, matriz influencia/interés, nivelRiesgo calculado.
**Commit:** `feat(M1): módulo entidades completo`

---

### 🏗️ Sprint M2 — Módulo Proyectos
**Objetivo:** Gestión completa del ciclo de vida del proyecto.
**Entregable:** Wizard de 7 pasos, seguimiento KPIs, transiciones de estado, cierre/cancelación con lecciones aprendidas.
**Commit:** `feat(M2): módulo proyectos con wizard y seguimiento completo`

---

### 🏗️ Sprint M3 — Módulo Alcance / SRS
**Objetivo:** SRS completo bajo IEEE 830, exportación multi-formato.
**Entregable:** 8 fases de SRS, trazabilidad de requerimientos, CCB, exportación PDF/DOCX/JSON.
**Commit:** `feat(M3): módulo alcance SRS completo`

---

### 🏗️ Sprints M4 S01–S07 — Cronograma y Control EVM
**Objetivo:** Gantt interactivo, red CPM/PERT, análisis EVM completo, portafolio.
**Tag:** `v4.0`

| Sprint | Entregable |
| :-- | :-- |
| M4-S01 | Capa de datos Firestore: `tareas.service`, `evm.service`, `lineas-base.service`, hooks TanStack Query |
| M4-S02 | Gantt interactivo (`gantt-task-react`) con drag & drop, filtros, export PDF |
| M4-S03 | Red CPM (`@xyflow/react` + `@dagrejs/dagre`), algoritmo BFS forward/backward |
| M4-S04 | Diagrama PERT con nodos personalizados, rutas críticas destacadas |
| M4-S05 | Panel EVM: SPI, CPI, Curvas S (Recharts), semáforo PMI |
| M4-S06 | Histograma de recursos, bubble chart portafolio, heatmap de riesgos |
| M4-S07 | Líneas base: guardar/restaurar, comparación Gantt base vs actual |

**Post-M4 fixes:** commits `368d945`, `556fe33`, `3ca6be5` — correcciones tipos CPM, auth helpers, export CSV.

---

### 🏗️ Sprints M5 S01–S03 — APU
**Objetivo:** Análisis de Precios Unitarios vinculado al cronograma EVM.

| Sprint | Commit | Entregable |
| :-- | :-- | :-- |
| M5-S01 | `8ea6f90` | Capa de datos: `apu.service` (16 métodos), `catalogo-insumos.service`, hooks, tipos extendidos |
| M5-S02 | `f9d42af` | UI completa: TablaInsumos, FormularioPartida, APUCard, APUList, VincularAPUModal |
| M5-S03 | `95e892b` | Exportación PDF/CSV, catálogo global de insumos con buscador, admin de catálogo |

---

### 🔧 Fixes y cierre de cadena lógica APU→EVM
**Commits:** `a2414e3` (Firestore Rules v3.0), `5f2fc3d` (BAC sync, costoPlaneado propagation, snapshot trigger, auditoría)

**Cadena implementada:**
```
Insumo editado
  → actualizarPartida()         (APU service)
    → batch update costoPlaneado en tareas
      → _sincronizarBAC()       (recalcula proyecto.presupuestoEstimado)
        → updateAvance()        (snapshot trigger)
          → crearSnapshotDesdeTareas() → EVM correcto
```

---

### 🔧 Sprints Transversales
| Tarea | Entregable |
| :-- | :-- |
| T-02 | Notificaciones: badge en navbar + página completa con filtros y acciones |
| T-03 | Auditoría: tabla M1–M5, filtros por módulo/acción/usuario, exportación CSV |
| T-06 | Admin de usuarios: tabla, cambio de rol, activar/desactivar |
| T-07 | Búsqueda global (cmdk): entidades + proyectos + SRS desde el Header |

---

## Pendientes Post-MVP

Los siguientes ítems están fuera del alcance del MVP y documentados para el siguiente ciclo de desarrollo.

| Ítem | Descripción | Prioridad |
| :-- | :-- | :-- |
| **Cloud Functions deploy** | `onTareaWrite` (KPIs dashboard en tiempo real) + `scheduledEVMSnapshot` (snapshot semanal automático). Requiere plan Firebase Blaze. Archivos listos en `functions/`. | Alta |
| **PV distribución lineal** | Post-MVP P5: distribuir el `costoPlaneado` linealmente entre `fechaInicioPlaneada` y `fechaFinPlaneada` para PV más preciso. `@todo` en `evm.service.ts`. | Media |
| **M5-S04: Reportes APU vs EAC** | Comparación costo APU planificado vs EAC real por proyecto | Media |
| **Tests unitarios** | `cpm.ts` (algoritmo CPM) + `evmService.calcularKPIsActuales` | Media |
| **Performance Gantt** | Paginación + virtualización para proyectos >200 tareas | Baja |
| **CPM en Cloud Function** | Para proyectos >200 tareas, mover cálculo CPM al servidor | Baja |

---

## Cómo Levantar el Proyecto

Ver `docs/ONBOARDING.md` para instrucciones completas de setup local.

**Resumen rápido:**

```bash
# 1. Clonar repositorio
git clone https://github.com/CariolaFlex/austranet-cco.git
cd austranet-cco

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con las credenciales Firebase del proyecto austranet-cco

# 4. Levantar servidor de desarrollo
npm run dev
# → http://localhost:3000

# 5. (Opcional) Poblar datos de demo
npx ts-node --project scripts/tsconfig.json scripts/seed-demo.ts
# → Agrega entidades, proyectos, APUs, tareas y snapshots EVM de demostración
```

**Prerrequisitos:** Node.js ≥ 18, acceso al proyecto Firebase `austranet-cco`.

---

## Contacto y Repositorio

- **Repositorio:** https://github.com/CariolaFlex/austranet-cco (privado)
- **Firebase Project:** `austranet-cco`
- **Documentación técnica:** `docs/ARQUITECTURA.md` · `docs/ONBOARDING.md` · `docs/DECISIONES_TECNICAS.md`
