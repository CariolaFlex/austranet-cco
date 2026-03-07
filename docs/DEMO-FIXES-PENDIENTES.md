# DEMO-FIXES-PENDIENTES — Guía Maestra de Correcciones
> Generado: 2026-03-07 | Para ser ejecutado por una nueva sesión de Claude Code
> Autor: análisis exhaustivo del código fuente post-testing en producción

---

## ⚠️ Propósito de este archivo

Después del deploy exitoso en Vercel + Firebase, se realizó una ronda completa de testing. Se encontraron **8 problemas** (3 críticos con crash/congelamiento, 5 con datos incorrectos/vacíos). Este documento describe con **exactitud quirúrgica** cada problema, su causa raíz en el código, y el cambio preciso para solucionarlo.

**Comando final post-correcciones:**
```bash
npx ts-node --project scripts/tsconfig.json scripts/seed-demo.ts --reset
```

---

## 📊 Estado actual por tab (build 5b36e6e)

| Módulo / Tab | Estado | Severidad |
|---|---|---|
| Entidades | ✅ Funciona | — |
| Proyectos (lista + wizard) | ✅ Funciona | — |
| APU — Vista APU y tabla de partidas | ✅ Funciona | — |
| APU — Exportar CSV | ✅ Funciona | — |
| APU — Exportar PDF | ❌ Falla silenciosamente | Medio |
| Cronograma — Gantt | ⚠️ Funciona pero muestra "undefined X.X ..." | Bajo |
| Cronograma — Tracking Gantt | ✅ Funciona | — |
| Cronograma — PERT/Red de dependencias | ❌ Vacío, sin tareas | Alto |
| Control — EVM (tab Control del proyecto) | ❌ Crash: "Application error" | **CRÍTICO** |
| Alcance — SRS | ❌ Carga infinita: "Inicializando SRS..." | **CRÍTICO** |
| Alcance — Historial | ❌ Vacío: "No hay registros" | Alto |
| Alcance — Repositorio Configuración | ❌ "El repositorio se crea automáticamente..." | Alto |
| Notificaciones | ✅ Funciona | — |
| Dashboard | ✅ Funciona | — |
| Catálogo de Insumos | ✅ Funciona | — |
| Portafolio | ✅ Funciona | — |

---

## 🔍 Diagnóstico: causa raíz de cada problema

### PROBLEMA 1 — Control/EVM: crash "Application error" [CRÍTICO]

**Flujo de crash:**
1. `TabControlEVM.tsx` lee `proyecto.kpisDashboard` (existe en seed) y lo pasa a `SemaforoPanel`
2. `SemaforoPanel` (línea 112) accede a `kpis.semaforoCronograma`
3. El seed almacena `semaforoSPI`/`semaforoCPI` pero `KPIsDashboard` espera `semaforoCronograma`/`semaforoCostos`
4. `kpis.semaforoCronograma = undefined`
5. `SEMAFORO_COLOR[undefined] = undefined` → `cfg.bg` → **TypeError: Cannot read properties of undefined (reading 'bg')** → React crash boundary

**Causa secundaria:** `TabControlEVM.tsx` línea 80: `const bac = proyecto.bac ?? 0`
- `Proyecto` tipo tiene `bac?: number` (opcional). El seed NO pone `bac` en el doc de proyecto (lo pone dentro de `kpisDashboard.bac`).
- Resultado: `bac = 0` → `sinBAC = true` → botón "Capturar Snapshot" deshabilitado y aviso "BAC no configurado"

**Archivos con bug:** `scripts/seed-demo.ts` (datos incorrectos) + `src/components/proyectos/TabControlEVM.tsx` (campo incorrecto)

---

### PROBLEMA 2 — PERT/Red: vacío sin tareas [ALTO]

**Causa:** `src/components/cronograma/hooks/usePERTData.ts` filtra:
```ts
tareas.filter((t) => t.tipo === 'tarea' || t.tipo === 'hito_gantt')
```
El seed NO incluye el campo `tipo` en ninguna tarea → todas tienen `tipo = undefined` → filtro devuelve 0 tareas → PERT vacío.

**Causa 2:** El campo `dependencias` en el seed usa formato string:
```ts
dependencias: [IDS.tarea1]  // ❌ string[]
```
Pero `Tarea.dependencias` espera:
```ts
dependencias: [{ tareaIdPredecesora: string, tipo: string, lagDias: number }]  // ✅
```
PERT no puede construir aristas sin el objeto de dependencia.

---

### PROBLEMA 3 — Gantt: prefijo "undefined" [BAJO]

**Causa:** `useTareasGantt` (o similar) construye el nombre del task como `${task.wbsCode} ${task.nombre}`. El seed no incluye el campo `wbsCode` → resultado: `"undefined Levantamiento y análisis..."`

---

### PROBLEMA 4 — APU PDF: falla silenciosamente [MEDIO]

**Causa 1 (crash):** En `exportarAPUPDF.ts` línea 262:
```ts
{ label: 'Moneda', value: apu.moneda }
```
El seed NO incluye `moneda` en el APU → `apu.moneda = undefined` → `pdf.text(undefined, ...)` → **jsPDF lanza error**.

**Causa 2 (datos incorrectos):** Las partidas en el seed usan `porcentajeGG` y `porcentajeUtilidad`, pero el tipo `Partida` (y `exportarAPUPDF.ts` líneas 317-318) usan `ggPct` y `utilidadPct`. Resultado: las columnas GG% y Util% muestran "undefined%".

---

### PROBLEMA 5 — Alcance/SRS: carga infinita [CRÍTICO]

**Causa:** La página de Alcance busca un documento SRS en la colección `srs` donde `proyectoId == demo-proyecto-activo`. Como el seed nunca crea un SRS, la consulta devuelve vacío, la UI muestra "Inicializando SRS... El trigger automático está en proceso" indefinidamente.

El trigger real (en `proyectos.service.ts`) crea el SRS cuando el proyecto transita a `activo_en_definicion`, pero el seed crea el proyecto directamente en `activo_en_desarrollo`, saltando ese estado.

---

### PROBLEMA 6 — Historial: vacío [ALTO]

**Causa:** La subcollección `proyectos/{id}/historial` solo se puebla mediante `proyectosService.addHistorialEntry()` cuando ocurren eventos reales (creación, cambio de estado, etc.). El seed nunca la escribe.

---

### PROBLEMA 7 — Repositorio Configuración: no iniciado [ALTO]

**Causa:** El documento `repositorios_configuracion` se crea cuando el proyecto pasa por el estado `pendiente_aprobacion`. El seed crea el proyecto directamente en `activo_en_desarrollo`, saltando ese estado. La UI muestra el mensaje de placeholder correspondiente.

---

### PROBLEMA 8 — Campos adicionales incorrectos en tareas [MEDIO]

Campos con nombre equivocado en seed que afectan funcionalidad:
- `esRutaCritica` → debe ser `esCritica` (filtro CPM usa `esCritica`)
- `duracionEstimada` → debe ser `duracionDias` (tipo `Tarea` usa `duracionDias`)
- Faltan: `nivel`, `holguraLibre` (usados en Gantt y PERT)

---

## 🔧 IMPLEMENTACIÓN — Cambios a realizar

**Orden de implementación:** A → B1 → B2 → B3 → B4 → B5 → B6 → B7 → B8 → B9

---

### CAMBIO A — `src/components/proyectos/TabControlEVM.tsx`

**Línea 80.** Cambiar UNA línea:

```tsx
// ❌ ANTES (línea 80):
const bac = proyecto.bac ?? 0

// ✅ DESPUÉS:
const bac = proyecto.presupuestoEstimado ?? 0
```

> `Proyecto.bac` es un campo opcional que el seed no establece en el documento raíz del proyecto. `presupuestoEstimado` siempre está presente (es requerido por el wizard de creación).

---

### CAMBIO B — `scripts/seed-demo.ts` (múltiples secciones)

#### B1: Renombrar campos de `calcularEVM()` — líneas 118–145

Reemplazar la función completa `calcularEVM`:

```ts
// ❌ ANTES:
function calcularEVM(
  bac: number,
  pctPV: number,
  pctEV: number,
  pctAC: number,
): {
  pv: number; ev: number; ac: number
  spi: number; cpi: number; sv: number; cv: number; eac: number; etc: number; tcpi: number
  semaforoSPI: string; semaforoCPI: string
} {
  const pv = Math.round(bac * pctPV * 100) / 100
  const ev = Math.round(bac * pctEV * 100) / 100
  const ac = Math.round(bac * pctAC * 100) / 100

  const spi = pv === 0 ? 1 : Math.round((ev / pv) * 1000) / 1000
  const cpi = ac === 0 ? 1 : Math.round((ev / ac) * 1000) / 1000
  const sv = Math.round((ev - pv) * 100) / 100
  const cv = Math.round((ev - ac) * 100) / 100
  const eac = cpi === 0 ? bac : Math.round((bac / cpi) * 100) / 100
  const etc = Math.max(0, Math.round((eac - ac) * 100) / 100)
  const den = bac - ac
  const tcpi = den <= 0 ? 0 : Math.round(((bac - ev) / den) * 1000) / 1000

  const semaforoSPI = spi >= 0.95 ? 'verde' : spi >= 0.80 ? 'amarillo' : 'rojo'
  const semaforoCPI = cpi >= 0.95 ? 'verde' : cpi >= 0.85 ? 'amarillo' : 'rojo'

  return { pv, ev, ac, spi, cpi, sv, cv, eac, etc, tcpi, semaforoSPI, semaforoCPI }
}

// ✅ DESPUÉS (renombrar semaforoSPI→semaforoCronograma, semaforoCPI→semaforoCostos):
function calcularEVM(
  bac: number,
  pctPV: number,
  pctEV: number,
  pctAC: number,
): {
  pv: number; ev: number; ac: number
  spi: number; cpi: number; sv: number; cv: number; eac: number; etc: number; tcpi: number
  semaforoCronograma: string; semaforoCostos: string
} {
  const pv = Math.round(bac * pctPV * 100) / 100
  const ev = Math.round(bac * pctEV * 100) / 100
  const ac = Math.round(bac * pctAC * 100) / 100

  const spi = pv === 0 ? 1 : Math.round((ev / pv) * 1000) / 1000
  const cpi = ac === 0 ? 1 : Math.round((ev / ac) * 1000) / 1000
  const sv = Math.round((ev - pv) * 100) / 100
  const cv = Math.round((ev - ac) * 100) / 100
  const eac = cpi === 0 ? bac : Math.round((bac / cpi) * 100) / 100
  const etc = Math.max(0, Math.round((eac - ac) * 100) / 100)
  const den = bac - ac
  const tcpi = den <= 0 ? 0 : Math.round(((bac - ev) / den) * 1000) / 1000

  const semaforoCronograma = spi >= 0.95 ? 'verde' : spi >= 0.80 ? 'amarillo' : 'rojo'
  const semaforoCostos = cpi >= 0.95 ? 'verde' : cpi >= 0.85 ? 'amarillo' : 'rojo'

  return { pv, ev, ac, spi, cpi, sv, cv, eac, etc, tcpi, semaforoCronograma, semaforoCostos }
}
```

---

#### B2: Corregir `kpisDashboard` en proyecto1 y proyecto3

**En proyecto1** (alrededor de línea 450), añadir `desviacionDias`:

```ts
// ❌ ANTES:
    kpisDashboard: {
      ...evm6Semanas,
      bac: BAC,
      pctAvanceTareas: 62.5,
      pctAvancePonderado: evm6Semanas.ev / BAC * 100,
      semaforoGeneral: 'amarillo',
      actualizadoEn: ts(new Date()),
    },

// ✅ DESPUÉS (solo agregar desviacionDias — después del fix B1, evm6Semanas ya tendrá semaforoCronograma/semaforoCostos):
    kpisDashboard: {
      ...evm6Semanas,
      bac: BAC,
      desviacionDias: -5,
      pctAvanceTareas: 62.5,
      pctAvancePonderado: evm6Semanas.ev / BAC * 100,
      semaforoGeneral: 'amarillo',
      actualizadoEn: ts(new Date()),
    },
```

**En proyecto3** (alrededor de línea 529), reemplazar kpisDashboard completo:

```ts
// ❌ ANTES:
    kpisDashboard: {
      spi: 0.97,
      cpi: 1.03,
      pv: 62_000_000,
      ev: 62_000_000,
      ac: 60_194_174,
      eac: 60_194_174,
      bac: 62_000_000,
      pctAvanceTareas: 100,
      pctAvancePonderado: 100,
      semaforoGeneral: 'verde',
      semaforoSPI: 'verde',
      semaforoCPI: 'verde',
      actualizadoEn: ts(daysFromNow(-30)),
    },

// ✅ DESPUÉS:
    kpisDashboard: {
      spi: 0.97,
      cpi: 1.03,
      sv: 0,
      cv: 1_805_826,
      pv: 62_000_000,
      ev: 62_000_000,
      ac: 60_194_174,
      eac: 60_194_174,
      etc: 0,
      tcpi: 1,
      bac: 62_000_000,
      desviacionDias: 0,
      pctAvanceTareas: 100,
      pctAvancePonderado: 100,
      semaforoGeneral: 'verde',
      semaforoCronograma: 'verde',
      semaforoCostos: 'verde',
      actualizadoEn: ts(daysFromNow(-30)),
    },
```

---

#### B3: Corregir el array `tareas` en `seedTareas()` — REEMPLAZAR COMPLETO

Reemplazar el array `tareas` dentro de `seedTareas()` con la versión corregida.
Los cambios por tarea son:
- Añadir `tipo: 'tarea'` a todas
- Añadir `wbsCode: '1.0'`, `'2.0'`, ..., `'8.0'` (según `orden`)
- Renombrar `duracionEstimada` → `duracionDias`
- Renombrar `esRutaCritica` → `esCritica`
- Añadir `nivel: 1`
- Añadir `holguraLibre` (0 para críticas, 5 para tarea 8)
- Convertir `dependencias: [IDS.tareaX]` → `dependencias: [{tareaIdPredecesora: IDS.tareaX, tipo: 'FS', lagDias: 0}]`

```ts
// ✅ REEMPLAZAR el array tareas completo (dentro de seedTareas()):
  const tareas = [
    {
      id: IDS.tarea1,
      proyectoId: IDS.proyecto1,
      nombre: 'Levantamiento y análisis de requerimientos',
      descripcion: 'Entrevistas con stakeholders, taller de requerimientos, documentación SRS',
      tipo: 'tarea',
      wbsCode: '1.0',
      nivel: 1,
      estado: 'completada',
      orden: 1,
      porcentajeAvance: 100,
      duracionDias: 10,
      fechaInicioPlaneada: ts(daysFromNow(-118)),
      fechaFinPlaneada: ts(daysFromNow(-108)),
      costoPlaneado: 4_200_000,
      costoReal: 4_350_000,
      responsable: IDS.usuario_analista,
      dependencias: [],
      asignaciones: [IDS.usuario_analista, IDS.usuario_pm],
      holguraTotal: 0,
      holguraLibre: 0,
      esCritica: true,
    },
    {
      id: IDS.tarea2,
      proyectoId: IDS.proyecto1,
      nombre: 'Diseño de arquitectura del sistema',
      descripcion: 'Diagramas de arquitectura, modelo de datos Firestore, definición de APIs',
      tipo: 'tarea',
      wbsCode: '2.0',
      nivel: 1,
      estado: 'completada',
      orden: 2,
      porcentajeAvance: 100,
      duracionDias: 8,
      fechaInicioPlaneada: ts(daysFromNow(-108)),
      fechaFinPlaneada: ts(daysFromNow(-100)),
      costoPlaneado: 3_800_000,
      costoReal: 3_650_000,
      responsable: IDS.usuario_admin,
      dependencias: [{ tareaIdPredecesora: IDS.tarea1, tipo: 'FS', lagDias: 0 }],
      asignaciones: [IDS.usuario_admin],
      holguraTotal: 0,
      holguraLibre: 0,
      esCritica: true,
    },
    {
      id: IDS.tarea3,
      proyectoId: IDS.proyecto1,
      nombre: 'Módulo M1 — Entidades y stakeholders',
      descripcion: 'CRUD de entidades, wizard de registro, evaluación de factibilidad, KPIs',
      tipo: 'tarea',
      wbsCode: '3.0',
      nivel: 1,
      estado: 'completada',
      orden: 3,
      porcentajeAvance: 100,
      duracionDias: 15,
      fechaInicioPlaneada: ts(daysFromNow(-100)),
      fechaFinPlaneada: ts(daysFromNow(-85)),
      costoPlaneado: 7_200_000,
      costoReal: 7_450_000,
      responsable: IDS.usuario_pm,
      dependencias: [{ tareaIdPredecesora: IDS.tarea2, tipo: 'FS', lagDias: 0 }],
      asignaciones: [IDS.usuario_pm, IDS.usuario_analista],
      holguraTotal: 0,
      holguraLibre: 0,
      esCritica: true,
    },
    {
      id: IDS.tarea4,
      proyectoId: IDS.proyecto1,
      nombre: 'Módulo M2 — Proyectos y ciclo de vida',
      descripcion: 'Wizard de 7 pasos, gestión de riesgos, hitos, seguimiento y cierre',
      tipo: 'tarea',
      wbsCode: '4.0',
      nivel: 1,
      estado: 'completada',
      orden: 4,
      porcentajeAvance: 100,
      duracionDias: 18,
      fechaInicioPlaneada: ts(daysFromNow(-85)),
      fechaFinPlaneada: ts(daysFromNow(-67)),
      costoPlaneado: 8_400_000,
      costoReal: 8_100_000,
      responsable: IDS.usuario_pm,
      dependencias: [{ tareaIdPredecesora: IDS.tarea3, tipo: 'FS', lagDias: 0 }],
      asignaciones: [IDS.usuario_pm, IDS.usuario_analista],
      holguraTotal: 0,
      holguraLibre: 0,
      esCritica: true,
    },
    {
      id: IDS.tarea5,
      proyectoId: IDS.proyecto1,
      nombre: 'Módulo M3 — Alcance y SRS',
      descripcion: 'SRS bajo IEEE 830, 8 fases, trazabilidad, CCB, exportación PDF/DOCX',
      tipo: 'tarea',
      wbsCode: '5.0',
      nivel: 1,
      estado: 'completada',
      orden: 5,
      porcentajeAvance: 100,
      duracionDias: 12,
      fechaInicioPlaneada: ts(daysFromNow(-67)),
      fechaFinPlaneada: ts(daysFromNow(-55)),
      costoPlaneado: 5_500_000,
      costoReal: 5_320_000,
      responsable: IDS.usuario_analista,
      dependencias: [{ tareaIdPredecesora: IDS.tarea4, tipo: 'FS', lagDias: 0 }],
      asignaciones: [IDS.usuario_analista],
      holguraTotal: 0,
      holguraLibre: 0,
      esCritica: true,
    },
    {
      id: IDS.tarea6,
      proyectoId: IDS.proyecto1,
      nombre: 'Módulo M4 — Cronograma y EVM',
      descripcion: 'Gantt, CPM/PERT, curvas S, histograma de recursos, portafolio',
      tipo: 'tarea',
      wbsCode: '6.0',
      nivel: 1,
      estado: 'en_progreso',
      orden: 6,
      porcentajeAvance: 85,
      duracionDias: 20,
      fechaInicioPlaneada: ts(daysFromNow(-55)),
      fechaFinPlaneada: ts(daysFromNow(-35)),
      costoPlaneado: 9_400_000,
      costoReal: 9_200_000,
      responsable: IDS.usuario_admin,
      dependencias: [{ tareaIdPredecesora: IDS.tarea5, tipo: 'FS', lagDias: 0 }],
      asignaciones: [IDS.usuario_admin, IDS.usuario_pm],
      holguraTotal: 0,
      holguraLibre: 0,
      esCritica: true,
      apuId: IDS.apu1,
      apuPartidaId: 'p1',
      cantidad: 1,
      costoUnitarioAPU: 9_400_000,
    },
    {
      id: IDS.tarea7,
      proyectoId: IDS.proyecto1,
      nombre: 'Módulo M5 — APU y catálogo de insumos',
      descripcion: 'APU con partidas/insumos, vinculación Tarea↔APU, catálogo global, exportación',
      tipo: 'tarea',
      wbsCode: '7.0',
      nivel: 1,
      estado: 'en_progreso',
      orden: 7,
      porcentajeAvance: 75,
      duracionDias: 14,
      fechaInicioPlaneada: ts(daysFromNow(-35)),
      fechaFinPlaneada: ts(daysFromNow(-21)),
      costoPlaneado: 6_300_000,
      costoReal: 5_100_000,
      responsable: IDS.usuario_pm,
      dependencias: [{ tareaIdPredecesora: IDS.tarea6, tipo: 'FS', lagDias: 0 }],
      asignaciones: [IDS.usuario_pm, IDS.usuario_analista],
      holguraTotal: 0,
      holguraLibre: 0,
      esCritica: true,
      apuId: IDS.apu1,
      apuPartidaId: 'p2',
      cantidad: 1,
      costoUnitarioAPU: 6_300_000,
    },
    {
      id: IDS.tarea8,
      proyectoId: IDS.proyecto1,
      nombre: 'QA, pruebas UAT y deploy final',
      descripcion: 'Pruebas de aceptación con el cliente, correcciones, deploy a Firebase Hosting',
      tipo: 'tarea',
      wbsCode: '8.0',
      nivel: 1,
      estado: 'pendiente',
      orden: 8,
      porcentajeAvance: 30,
      duracionDias: 15,
      fechaInicioPlaneada: ts(daysFromNow(-10)),
      fechaFinPlaneada: ts(daysFromNow(5)),
      costoPlaneado: 3_700_000,
      costoReal: 1_200_000,
      responsable: IDS.usuario_analista,
      dependencias: [{ tareaIdPredecesora: IDS.tarea7, tipo: 'FS', lagDias: 0 }],
      asignaciones: [IDS.usuario_analista, IDS.usuario_pm, IDS.usuario_admin],
      holguraTotal: 5,
      holguraLibre: 5,
      esCritica: false,
    },
  ]
```

---

#### B4: Corregir APU — añadir `moneda` y renombrar campos de partidas

**Añadir `moneda: 'CLP'`** al objeto APU (junto a los otros campos de nivel raíz, por ejemplo después de `estado: 'aprobado'`):

```ts
// ✅ Añadir en el objeto apu, después de "estado: 'aprobado'":
moneda: 'CLP',
```

**En las 4 partidas**, renombrar `porcentajeGG` → `ggPct` y `porcentajeUtilidad` → `utilidadPct`:

```ts
// ❌ ANTES (en cada partida):
        porcentajeGG: 10,
        porcentajeUtilidad: 5,

// ✅ DESPUÉS (en cada partida):
        ggPct: 10,
        utilidadPct: 5,
```

> Verificar que las 4 partidas (p1, p2, p3, p4) tengan este cambio.

---

#### B5: Añadir `seedAlcance()` — nueva función completa

Agregar esta función nueva DESPUÉS de `seedNotificaciones()` y ANTES de `seedDemo()`:

```ts
// ============================================================
// SEED — ALCANCE (SRS)
// ============================================================

async function seedAlcance(db: admin.firestore.Firestore): Promise<void> {
  console.log('📋 Creando documentos SRS...')

  // SRS para proyecto1 (activo_en_desarrollo — SRS aprobado)
  await db.collection('srs').doc(IDS.srs1).set({
    proyectoId: IDS.proyecto1,
    version: 'v1.0',
    estado: 'aprobado',
    tipoSRS: 'completo',
    gate1Estado: 'go',
    gate1FechaDecision: ts(daysFromNow(-85)),
    gate1DecisionPor: IDS.usuario_admin,
    stakeholdersSRS: [
      {
        id: 'ss1',
        nombre: 'María Fernández',
        cargo: 'Gerente de TI',
        email: 'mfernandez@consur.cl',
        rol: 'cliente_clave',
        nivelParticipacion: 'alto',
        tecnicasAplicadas: ['entrevista', 'taller'],
      },
      {
        id: 'ss2',
        nombre: 'Jorge Salinas',
        cargo: 'Jefe de Proyectos',
        email: 'jsalinas@consur.cl',
        rol: 'usuario_final',
        nivelParticipacion: 'medio',
        tecnicasAplicadas: ['cuestionario'],
      },
    ],
    riesgosSRS: [
      {
        id: 'rs1',
        descripcion: 'Requerimientos volátiles en módulo EVM',
        probabilidad: 'media',
        impacto: 'alto',
        mitigacion: 'Revisión semanal de requerimientos con el cliente',
      },
    ],
    tecnicasActivas: ['entrevista', 'taller', 'casos_uso'],
    prototipos: [],
    iteracionesBucle: [],
    artefactosModelo: [],
    checklistValidacion: [
      { item: 'Requerimientos completos y sin ambigüedad', cumple: true },
      { item: 'Trazabilidad bidireccional verificada', cumple: true },
      { item: 'Aprobación formal del cliente', cumple: true },
    ],
    observacionesValidacion: [],
    ccbSRS: [
      {
        id: 'ccb1',
        nombre: 'Ana González',
        rol: 'PM',
        voto: 'aprobado',
      },
      {
        id: 'ccb2',
        nombre: 'María Fernández',
        rol: 'cliente',
        voto: 'aprobado',
      },
    ],
    solicitudesCambioSRS: [
      {
        id: 'sc1',
        titulo: 'Agregar exportación a formato DOCX',
        descripcion: 'El cliente requiere que el SRS se exporte también en formato Word además de PDF',
        estado: 'aprobada',
        prioridad: 'baja',
        impactoEstimado: 'bajo',
        solicitadoPor: 'Jorge Salinas',
        fechaSolicitud: ts(daysFromNow(-50)),
        fechaResolucion: ts(daysFromNow(-48)),
      },
    ],
    matrizTrazabilidad: [],
    contadorCiclosValidacion: 2,
    creadoEn: ts(daysFromNow(-90)),
    actualizadoEn: ts(daysFromNow(-60)),
    creadoPor: IDS.usuario_analista,
  })

  // SRS para proyecto2 (activo_en_definicion — SRS en proceso)
  await db.collection('srs').doc(IDS.srs2).set({
    proyectoId: IDS.proyecto2,
    version: 'v0.1',
    estado: 'en_elicitacion',
    tipoSRS: 'completo',
    gate1Estado: 'pendiente',
    stakeholdersSRS: [
      {
        id: 'ss3',
        nombre: 'Roberto Pizarro',
        cargo: 'Director General',
        email: 'rpizarro@olivos.cl',
        rol: 'sponsor',
        nivelParticipacion: 'bajo',
        tecnicasAplicadas: ['entrevista'],
      },
    ],
    riesgosSRS: [],
    tecnicasActivas: ['entrevista'],
    prototipos: [],
    iteracionesBucle: [],
    artefactosModelo: [],
    checklistValidacion: [],
    observacionesValidacion: [],
    ccbSRS: [],
    solicitudesCambioSRS: [],
    matrizTrazabilidad: [],
    contadorCiclosValidacion: 0,
    creadoEn: ts(daysFromNow(-14)),
    actualizadoEn: ts(daysFromNow(-1)),
    creadoPor: IDS.usuario_analista,
  })

  console.log('  ✓ 2 documentos SRS creados')
}
```

**Añadir `IDS.srs1` e `IDS.srs2` al objeto `IDS`** (junto con `IDS.repo1` del cambio B7):

```ts
// ✅ Añadir al objeto IDS (después de las entradas existentes):
  srs1: `${DEMO_PREFIX}-srs-proyecto-activo`,
  srs2: `${DEMO_PREFIX}-srs-proyecto-definicion`,
  repo1: `${DEMO_PREFIX}-repo-proyecto-activo`,
```

---

#### B6: Añadir `seedHistorial()` — nueva función completa

Agregar DESPUÉS de `seedAlcance()`:

```ts
// ============================================================
// SEED — HISTORIAL DE PROYECTO
// ============================================================

async function seedHistorial(db: admin.firestore.Firestore): Promise<void> {
  console.log('📜 Creando historial del proyecto...')

  const historialRef = db.collection('proyectos').doc(IDS.proyecto1).collection('historial')

  const entradas = [
    {
      proyectoId: IDS.proyecto1,
      usuarioId: IDS.usuario_admin,
      usuarioNombre: 'Carlos Administrador',
      tipoAccion: 'creacion',
      motivo: 'Proyecto creado desde el wizard de nuevo proyecto',
      fechaHora: ts(daysFromNow(-120)),
    },
    {
      proyectoId: IDS.proyecto1,
      usuarioId: IDS.usuario_admin,
      usuarioNombre: 'Carlos Administrador',
      tipoAccion: 'cambio_estado',
      campoModificado: 'estado',
      valorAnterior: 'borrador',
      valorNuevo: 'pendiente_aprobacion',
      motivo: 'Metodología acordada con el cliente. Metodología: agil_scrum.',
      fechaHora: ts(daysFromNow(-118)),
    },
    {
      proyectoId: IDS.proyecto1,
      usuarioId: IDS.usuario_admin,
      usuarioNombre: 'Carlos Administrador',
      tipoAccion: 'metodologia_acordada',
      campoModificado: 'metodologia',
      valorAnterior: null,
      valorNuevo: 'agil_scrum',
      motivo: 'Metodología Scrum acordada con ConSur en reunión de kick-off',
      fechaHora: ts(daysFromNow(-118)),
    },
    {
      proyectoId: IDS.proyecto1,
      usuarioId: IDS.usuario_admin,
      usuarioNombre: 'Carlos Administrador',
      tipoAccion: 'cambio_estado',
      campoModificado: 'estado',
      valorAnterior: 'pendiente_aprobacion',
      valorNuevo: 'activo_en_definicion',
      motivo: 'Propuesta aprobada por el cliente. SRS iniciado.',
      fechaHora: ts(daysFromNow(-115)),
    },
    {
      proyectoId: IDS.proyecto1,
      usuarioId: IDS.usuario_pm,
      usuarioNombre: 'Ana González (PM)',
      tipoAccion: 'cambio_estado',
      campoModificado: 'estado',
      valorAnterior: 'activo_en_definicion',
      valorNuevo: 'activo_en_desarrollo',
      motivo: 'SRS aprobado por el cliente. Desarrollo iniciado.',
      fechaHora: ts(daysFromNow(-88)),
    },
    {
      proyectoId: IDS.proyecto1,
      usuarioId: IDS.usuario_pm,
      usuarioNombre: 'Ana González (PM)',
      tipoAccion: 'gestion_equipo',
      motivo: 'Incorporación de Pedro Analista al equipo como analista de negocio',
      fechaHora: ts(daysFromNow(-85)),
    },
    {
      proyectoId: IDS.proyecto1,
      usuarioId: IDS.usuario_pm,
      usuarioNombre: 'Ana González (PM)',
      tipoAccion: 'gestion_riesgos',
      motivo: 'Riesgo R2 actualizado a estado mitigado: adaptador API implementado',
      fechaHora: ts(daysFromNow(-40)),
    },
    {
      proyectoId: IDS.proyecto1,
      usuarioId: IDS.usuario_pm,
      usuarioNombre: 'Ana González (PM)',
      tipoAccion: 'gestion_riesgos',
      motivo: 'Riesgo R3 materializado: cliente no disponible para UAT esta semana',
      fechaHora: ts(daysFromNow(-2)),
    },
    {
      proyectoId: IDS.proyecto1,
      usuarioId: IDS.usuario_analista,
      usuarioNombre: 'Pedro Analista',
      tipoAccion: 'actualizacion_datos',
      campoModificado: 'presupuestoEstimado',
      valorAnterior: '45000000',
      valorNuevo: '48500000',
      motivo: 'Ajuste de presupuesto tras vinculación APU-CCO-001',
      fechaHora: ts(daysFromNow(-60)),
    },
  ]

  const batch = db.batch()
  for (const entrada of entradas) {
    batch.set(historialRef.doc(), entrada)
  }
  await batch.commit()
  console.log('  ✓ 9 entradas de historial creadas')
}
```

---

#### B7: Añadir `seedRepositorios()` — nueva función completa

Agregar DESPUÉS de `seedHistorial()`:

```ts
// ============================================================
// SEED — REPOSITORIO DE CONFIGURACIÓN
// ============================================================

async function seedRepositorios(db: admin.firestore.Firestore): Promise<void> {
  console.log('🗂️  Creando repositorio de configuración...')

  await db.collection('repositorios_configuracion').doc(IDS.repo1).set({
    proyectoId: IDS.proyecto1,
    version: '1.2.0',
    estado: 'activo',
    politicaEntregas: 'Sprints de 2 semanas. Deploy automático a staging al cerrar sprint. Deploy a producción requiere aprobación manual del PM.',
    cicdObligatorio: true,
    itemsConfiguracion: [
      {
        id: 'ic1',
        nombre: 'firebase.json',
        tipo: 'infraestructura',
        descripcion: 'Configuración de Firebase: Firestore rules, indexes, Cloud Functions',
        version: '1.1.0',
        estado: 'aprobado',
        ubicacion: 'raíz del repositorio',
        responsable: IDS.usuario_admin,
      },
      {
        id: 'ic2',
        nombre: 'next.config.js',
        tipo: 'configuracion_app',
        descripcion: 'Configuración de Next.js 14: remotePatterns, transpilePackages',
        version: '1.0.2',
        estado: 'aprobado',
        ubicacion: 'raíz del repositorio',
        responsable: IDS.usuario_admin,
      },
      {
        id: 'ic3',
        nombre: '.env.local / Variables Vercel',
        tipo: 'secretos',
        descripcion: '6 variables NEXT_PUBLIC_FIREBASE_* configuradas en Vercel y localmente',
        version: '1.0.0',
        estado: 'aprobado',
        ubicacion: 'Vercel Dashboard > Settings > Environment Variables',
        responsable: IDS.usuario_admin,
      },
      {
        id: 'ic4',
        nombre: 'firestore.rules',
        tipo: 'seguridad',
        descripcion: 'Reglas de seguridad Firestore v3.0 — todas las colecciones cubiertas',
        version: '3.0.0',
        estado: 'aprobado',
        ubicacion: 'firestore.rules',
        responsable: IDS.usuario_admin,
      },
    ],
    ccbComposicion: [
      {
        id: 'ccb1',
        nombre: 'Carlos Administrador',
        rol: 'arquitecto',
        votoRequerido: true,
      },
      {
        id: 'ccb2',
        nombre: 'Ana González (PM)',
        rol: 'PM',
        votoRequerido: true,
      },
      {
        id: 'ccb3',
        nombre: 'María Fernández',
        rol: 'cliente',
        votoRequerido: false,
      },
    ],
    historialVersiones: [
      {
        version: '1.0.0',
        fecha: ts(daysFromNow(-115)),
        autor: IDS.usuario_admin,
        descripcion: 'Creación inicial del repositorio de configuración',
        cambios: ['Estructura base del proyecto', 'Firebase inicializado', 'CI/CD básico configurado'],
      },
      {
        version: '1.1.0',
        fecha: ts(daysFromNow(-60)),
        autor: IDS.usuario_admin,
        descripcion: 'Actualización tras deploy de M4 y M5',
        cambios: ['Índices Firestore actualizados', 'Cloud Functions agregadas', 'Reglas de seguridad v3.0'],
      },
      {
        version: '1.2.0',
        fecha: ts(daysFromNow(-7)),
        autor: IDS.usuario_analista,
        descripcion: 'Corrección de índices faltantes para colecciones M4/M5',
        cambios: ['8 índices nuevos en firestore.indexes.json', 'Deploy a producción exitoso'],
      },
    ],
    solicitudesCambio: [
      {
        id: 'scr1',
        titulo: 'Agregar índice compuesto para notificaciones por prioridad',
        descripcion: 'Se requiere un índice compuesto para la query: destinatarios CONTAINS + prioridad ASC + fechaCreacion DESC',
        estado: 'implementada',
        prioridad: 'media',
        solicitadoPor: IDS.usuario_pm,
        fechaSolicitud: ts(daysFromNow(-20)),
        fechaImplementacion: ts(daysFromNow(-7)),
      },
    ],
    creadoEn: ts(daysFromNow(-115)),
    actualizadoEn: ts(daysFromNow(-7)),
    creadoPor: IDS.usuario_admin,
  })

  console.log('  ✓ 1 repositorio de configuración creado')
}
```

---

#### B8: Actualizar `resetDemoData()` — añadir borrado de nuevas colecciones

Agregar al final de `resetDemoData()`, ANTES del `console.log('✅ Datos de demo borrados.')`:

```ts
  // SRS
  try { await db.collection('srs').doc(IDS.srs1).delete() } catch { /* ignorar */ }
  try { await db.collection('srs').doc(IDS.srs2).delete() } catch { /* ignorar */ }

  // Repositorio de configuración
  try { await db.collection('repositorios_configuracion').doc(IDS.repo1).delete() } catch { /* ignorar */ }

  // Historial del proyecto (subcol — borrar todos los docs)
  try {
    const historialDocs = await db.collection('proyectos').doc(IDS.proyecto1).collection('historial').listDocuments()
    if (historialDocs.length > 0) {
      const histBatch = db.batch()
      historialDocs.forEach((d) => histBatch.delete(d))
      await histBatch.commit()
    }
  } catch { /* ignorar */ }
```

---

#### B9: Llamar a las nuevas funciones en `seedDemo()`

En la función `seedDemo()`, DESPUÉS de `await seedNotificaciones(db)`, añadir:

```ts
  await seedAlcance(db)
  await seedHistorial(db)
  await seedRepositorios(db)
```

Y actualizar el `console.log` del resumen al final de `seedDemo()`:

```ts
  console.log('   SRS:             2 (1 aprobado, 1 en elicitación)')
  console.log('   Historial:       9 entradas (proyecto activo)')
  console.log('   Repositorios:    1 (proyecto activo, v1.2.0)\n')
```

---

## 🚀 Cómo ejecutar después de todos los cambios

```bash
# Desde la raíz del proyecto C:\Austranet\austranet-cco

# 1. Verificar que no haya errores TypeScript (opcional pero recomendado)
npx tsc --noEmit

# 2. Resetear y recrear todos los datos de demo
npx ts-node --project scripts/tsconfig.json scripts/seed-demo.ts --reset

# 3. Si el --reset falla con errores de permisos en subcollecciones, es normal:
#    los documentos nuevos (srs, repositorios, historial) se crearán igual.
#    Volver a correr sin --reset para agregar los datos faltantes:
npx ts-node --project scripts/tsconfig.json scripts/seed-demo.ts
```

---

## ✅ Verificación post-fix por tab

### Control/EVM
- Abrir proyecto "Sistema de Gestión de Obras CCO" → tab "Control"
- ✅ Debe mostrar 3 semáforos de color (amarillo/verde) sin crash
- ✅ Debe mostrar gráficos de curvas S y EVM con 6 semanas de historia
- ✅ BAC debe mostrarse como $48.500.000 (no "BAC no configurado")
- ✅ Botón "Capturar Snapshot EVM" debe estar habilitado

### PERT/Red de dependencias
- Abrir proyecto → tab "Cronograma" → sub-tab "PERT/Red"
- ✅ Debe mostrar 8 nodos conectados en cadena (1→2→3→4→5→6→7→8)
- ✅ Las aristas deben tener tipo "FS" (Fin-Inicio)
- ✅ Tareas de la ruta crítica deben aparecer resaltadas

### Gantt
- Tab "Cronograma" → "Gantt"
- ✅ Cada tarea debe mostrar "1.0 Levantamiento...", "2.0 Diseño...", etc.
- ✅ No debe aparecer "undefined" como prefijo

### APU — PDF
- Abrir el APU → botón "Exportar PDF"
- ✅ Debe descargarse el archivo `apu-apu-sistema-gestion-de-obras-sistema-de-gestion-de-obras-cco.pdf`
- ✅ Las columnas GG% y Util% deben mostrar "10%" y "5%"
- ✅ La columna Moneda en la portada debe mostrar "CLP"

### Alcance/SRS
- Abrir proyecto → tab "Alcance" → "SRS"
- ✅ Debe cargar el SRS v1.0 con estado "aprobado"
- ✅ Debe mostrar 2 stakeholders, 1 riesgo SRS, checklist con 3 ítems verificados
- ✅ Gate 1 debe aparecer como "go"

### Historial
- Tab "Alcance" → "Historial"
- ✅ Debe mostrar 9 entradas ordenadas por fecha (más reciente primero)
- ✅ Debe mostrar cambios de estado, gestión de riesgos, etc.

### Repositorio Configuración
- Tab "Alcance" → "Repositorio de Configuración"
- ✅ Debe mostrar versión "1.2.0" en estado "activo"
- ✅ Debe mostrar 4 ítems de configuración
- ✅ Debe mostrar 3 miembros del CCB
- ✅ Historial de versiones con 3 entradas

---

## 📝 Notas adicionales para el implementador

### Sobre el commit
Una vez verificado que todo funciona, hacer commit con:
```bash
git add src/components/proyectos/TabControlEVM.tsx scripts/seed-demo.ts
git commit -m "fix: corregir campos semaforo KPIsDashboard, campos Tarea, APU y agregar seed de SRS/historial/repositorio"
```

### Verificar que el tipo SRS en el seed sea compatible
Si al ejecutar el seed aparece error TypeScript sobre `estado: 'en_elicitacion'` en el SRS de proyecto2, verificar en `src/types/index.ts` los valores válidos de `EstadoSRS` y ajustar al valor más cercano (probable alternativa: `'elicitacion'`, `'en_proceso'`, `'no_iniciado'`). El seed usa `firebase-admin` con tipos menos estrictos, por lo que solo fallaría en el tipo TypeScript, no en el runtime de Firestore.

### Verificar que el campo `estado` de RepositorioConfiguracion sea compatible
Si hay error en `estado: 'activo'`, verificar `EstadoConfiguracionProyecto` en `types/index.ts`. Alternativas comunes: `'en_uso'`, `'vigente'`.

### Los snapshots EVM no necesitan cambios
Los snapshots de la subcollección `snapshots_evm` usan `semaforoSPI`/`semaforoCPI` que es correcto según el tipo `SnapshotEVM`. Solo el `kpisDashboard` del documento raíz del proyecto usaba los nombres equivocados.

### Problema PDF — causa exacta
`exportarAPUPDF.ts` en la línea de metadata: `{ label: 'Moneda', value: apu.moneda }` → si `apu.moneda` es `undefined`, jsPDF falla al llamar `pdf.text(undefined, ...)`. La adición de `moneda: 'CLP'` al APU en el seed resuelve esto. Si el PDF todavía falla después del fix, revisar que `apu.moneda` esté llegando al componente (puede necesitar verificación en el servicio `apu.service.ts` que `convertTimestamps` no esté borrando el campo).
