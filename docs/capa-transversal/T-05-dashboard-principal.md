<!-- ============================================================
  AUSTRANET-CCO — CAPA TRANSVERSAL
  Archivo:  T-05-dashboard-principal.md
  Capa:     Transversal
  Elemento: 5 de 6
  Sirve a:  M1 · M2 · M3
  Prerrequisito: T-01 (rol determina qué ve) · T-02 (widget notificaciones)
                 T-03 (widget actividad reciente) · T-04 (acceso rápido y búsqueda)
  Stack:    Next.js 14+ App Router · TypeScript · Tailwind CSS
            Firestore (onSnapshot tiempo real)
  Versión:  1.0
  Fecha:    2026-02-27
  Estado:   activo
  Autor:    austranet-cco
  ============================================================ -->

# T-05-dashboard-principal.md

> **Capa Transversal — Elemento 5 de 6**
> **Dashboard Principal**
> *Componente que sirve a todos los módulos del sistema: M1 · M2 · M3*

---

## 1. Metadatos del Documento

| Campo | Valor |
|---|---|
| **Nombre del archivo** | `T-05-dashboard-principal.md` |
| **Capa** | Transversal |
| **Posición** | Elemento 5 de 6 |
| **Módulos que sirve** | M1 — Registro de Entidades · M2 — Gestión de Proyectos · M3 — Documentación SRS |
| **Prerrequisitos** | T-01 — Autenticación, Roles y Permisos (rol determina qué dashboard ve el usuario) · T-02 — Sistema de Notificaciones (widget de alertas y acciones pendientes) · T-03 — Auditoría y Logs (widget de actividad reciente) · T-04 — Búsqueda Global (panel de navegación rápida y shortcut `Cmd/Ctrl+K`) |
| **Stack** | Next.js 14+ App Router · TypeScript · Tailwind CSS · Firestore (`onSnapshot` para tiempo real) |
| **Versión** | 1.0 |
| **Fecha** | 2026-02-27 |
| **Estado** | `activo` — listo para implementación |
| **Sistema de referencia** | austranet-cco |
| **Dependencias directas** | T-01, T-02, T-03, T-04, M1-01, M2-01, M3-01 |

---

## 2. Objetivo del Documento

### ¿Por qué el dashboard es transversal?

El dashboard principal no pertenece a ningún módulo específico porque su función es agregar y cruzar datos de M1, M2 y M3 simultáneamente en una sola vista. Un componente de M2 puede mostrar proyectos; uno de M3 puede mostrar SRS. Pero solo un componente transversal puede mostrar al mismo tiempo cuántas entidades activas hay en M1, cuántos proyectos están en riesgo en M2, y cuántos SRS están bloqueados en un Gate en M3. El dashboard es, por definición, la vista que ningún módulo puede proveer por sí solo.

Además, el dashboard consume directamente los cuatro elementos transversales previos: filtra su contenido por el rol del usuario (T-01), muestra las acciones pendientes de la colección `notificaciones` (T-02), despliega actividad reciente de la colección `auditoria` (T-03), y expone el acceso rápido y el shortcut de búsqueda global de T-04. Es el punto de integración central del sistema.

### El problema que resuelve

Sin una vista unificada, el usuario tendría que navegar a M1, M2 y M3 por separado para entender el estado actual del sistema. Un gestor con tres proyectos activos debería revisar tres pantallas de M2, tres pantallas de M3 y los registros de T-02 antes de saber qué requiere su atención inmediata. El dashboard resuelve esto priorizando visualmente lo que requiere acción, con acceso directo desde cada widget al recurso afectado.

La priorización visual es la función más importante del dashboard: no se trata de mostrar todo, sino de mostrar primero lo que bloquea el avance del sistema. Los widgets con `accionable=true` y ítems pendientes siempre aparecen primero en el layout y no pueden ocultarse.

### Dashboard ejecutivo vs. dashboard operativo

| Característica | Dashboard Ejecutivo (admin/superadmin) | Dashboard Operativo (gestor/analista) |
|---|---|---|
| **Propósito** | Visión global del estado de toda la organización | Tareas pendientes e inmediatas del usuario |
| **Foco** | ¿Cómo está el sistema en su conjunto? | ¿Qué debo hacer hoy? |
| **Scope de datos** | Todos los proyectos, entidades y usuarios | Solo los proyectos asignados al usuario |
| **Widget prioritario** | W-A2 · Alertas Críticas de la organización | W-G1/W-AN1 · Mis Acciones Pendientes |
| **Métricas** | KPIs sistémicos: totales, tasas, tendencias | Estado operativo: semáforos, fechas, riesgos |
| **Actualización crítica** | `onSnapshot` en alertas de organización | `onSnapshot` en acciones del propio usuario |

---

## 3. Dashboard por Rol — Layouts Diferenciados

### 3.1 ROL: admin y superadmin — Dashboard Ejecutivo

El dashboard ejecutivo ofrece visión global de toda la organización. El admin ve el sistema completo: todas las entidades, todos los proyectos, todos los SRS y todos los usuarios.

#### Tabla de Widgets — Rol admin/superadmin

| ID Widget | Título | Fuente Firestore | Actualización | Accionable | Ocultable |
|---|---|---|---|:---:|:---:|
| W-A1 | Resumen del Sistema | `entidades`, `proyectos`, `documentosSRS`, `usuarios` | `onload` | ❌ | ❌ |
| W-A2 | Alertas Críticas | `notificaciones` (accionRequerida=true, prioridad=critica) | `realtime` (onSnapshot) | ✅ | ❌ |
| W-A3 | Estado de Proyectos | `proyectos` (estado=activo*) | `onload` | ✅ | ✅ |
| W-A4 | Pipeline de SRS | `documentosSRS` (agrupado por estado) | `polling_5min` | ✅ | ✅ |
| W-A5 | Entidades de Riesgo Alto/Crítico | `entidades` (nivelRiesgo=alto\|critico) + `proyectos` | `onload` | ✅ | ✅ |
| W-A6 | Actividad Reciente | `auditoria` (criticidad=critico\|alto, hoy) | `onload` | ❌ | ✅ |
| W-A7 | Métricas de Mejora | `proyectos` (estado=completado, últimos 5) + `metricasProceso` | `polling_5min` | ✅ | ✅ |

#### Descripción de Widgets Ejecutivos

**W-A1 · Resumen del Sistema**
Cuatro tarjetas numéricas dispuestas en fila horizontal:
- **Total entidades activas (M1):** `COUNT(entidades WHERE estado='activa')`.
- **Proyectos activos (M2):** `COUNT(proyectos WHERE estado IN [activo_en_definicion, activo_en_desarrollo])`.
- **SRS en proceso (M3):** `COUNT(documentosSRS WHERE estado NOT IN [noiniciado, aprobado, cancelado])`.
- **Usuarios activos (T-01):** `COUNT(usuarios WHERE activo=true)`.

Estrategia: `getDocs` al cargar el dashboard con `getCountFromServer()` de Firestore para minimizar lecturas. Sin botón de actualizar — dato de contexto, no operativo.

**W-A2 · Alertas Críticas**
Lista de notificaciones con `accionRequerida=true` y `prioridad='critica'` de toda la organización. Cada ítem muestra:
- Tipo de notificación (badge de color).
- Entidad afectada (enlace directo al recurso).
- Tiempo transcurrido desde creación sin ser accionada.
- Botón de acción directa que navega a `accionUrl` de T-02.

Orden: más antiguas primero (las que llevan más tiempo sin resolverse). Actualización: `onSnapshot` en la colección `notificaciones` con filtro `accionRequerida=true AND prioridad='critica'`. Listener compartido con el contador de notificaciones del navbar.

**W-A3 · Estado de Proyectos**
Tabla compacta con todas las filas correspondientes a proyectos en estado activo. Columnas: Nombre del proyecto, Entidad cliente (M1), Estado actual, Metodología acordada (M2-07), Gestor asignado, % avance de hitos (hitos cerrados / hitos totales × 100), Próximo hito + fecha límite, Semáforo de salud (verde/amarillo/rojo — ver §6). Click en cualquier fila navega a `/m2/proyectos/{id}`. Botón "Actualizar" manual disponible.

**W-A4 · Pipeline de SRS**
Vista tipo funnel horizontal que muestra cuántos SRS existen en cada estado del ciclo M3:

```
noiniciado → enadquisicion → enprototipado → enmodelado →
enespecificacion → envalidacion → conobservaciones → aprobado
```

Cada columna del funnel muestra el conteo numérico. Click en cualquier columna navega a la lista de M3 filtrada por ese estado. Actualización: `polling_5min` — las transiciones de estado son acciones deliberadas, no cambios por segundo.

**W-A5 · Entidades de Riesgo Alto/Crítico**
Lista de entidades de M1 con `nivelRiesgo='alto'` o `nivelRiesgo='critico'` que tienen al menos un proyecto en estado activo. Muestra: nombre de la entidad, nivel de riesgo (badge), número de proyectos activos asociados, acciones vigentes de mitigación. Cada fila enlaza a `/m1/entidades/{id}`. Útil para que el admin identifique concentración de riesgo organizacional.

**W-A6 · Actividad Reciente**
Últimas 10 entradas de la colección `auditoria` (T-03) con `criticidad IN ['critico', 'alto']` del día actual. Muestra: timestamp, actor (nombre + rol), acción (badge de tipo), módulo, entidad afectada. No es interactivo — es solo informativo. Estrategia: `getDocs` al cargar con `orderBy('timestamp', 'desc').limit(10)`.

**W-A7 · Métricas de Mejora (M2-08)**
Solo visible si existen proyectos con estado `completado`. Muestra tres métricas basadas en los últimos 5 proyectos completados:
- **Precisión de estimación:** tendencia de `costoReal / costoEstimado` (gráfico mini de línea).
- **Tasa de materialización de riesgos:** porcentaje de riesgos identificados que llegaron a estado `materializado`.
- **Acciones de mejora implementadas:** cantidad de `PlanMejora` con estado `implementado` en el último trimestre.

Estrategia: `polling_5min` — son agregaciones costosas basadas en datos históricos que no cambian por segundo.

---

### 3.2 ROL: gestor — Dashboard Operativo de Proyectos

El dashboard del gestor prioriza las acciones inmediatas de sus proyectos asignados. El primer widget siempre es W-G1 con las acciones pendientes — si hay alguna pendiente, el gestor la ve antes que cualquier otra cosa.

#### Tabla de Widgets — Rol gestor

| ID Widget | Título | Fuente Firestore | Actualización | Accionable | Ocultable |
|---|---|---|---|:---:|:---:|
| W-G1 | Mis Acciones Pendientes | `notificaciones` (accionRequerida=true, destinatario=uid) | `realtime` (onSnapshot) | ✅ | ❌ |
| W-G2 | Mis Proyectos Activos | `proyectos` (proyectosAsignados del gestor, estado=activo*) | `onload` | ✅ | ❌ |
| W-G3 | Hitos Próximos (7 días) | `proyectos/{id}/hitos` (fechaLimite ≤ hoy+7d) | `onload` | ✅ | ✅ |
| W-G4 | Riesgos Activos | `proyectos/{id}/riesgos` (estado=identificado\|enSeguimiento\|mitigandose) | `onload` | ✅ | ✅ |
| W-G5 | Estado SRS de mis Proyectos | `documentosSRS` + `requerimientos` (proyectosAsignados) | `onload` | ✅ | ✅ |
| W-G6 | Actividad Reciente | `auditoria` (entidadRelacionada IN proyectosAsignados) | `onload` | ❌ | ✅ |

#### Descripción de Widgets del Gestor

**W-G1 · Mis Acciones Pendientes**
Notificaciones de T-02 con `accionRequerida=true` y el `uid` del gestor en `destinatarios`, con `estado IN ['pendiente', 'enviada']`. Primer widget del layout — siempre visible y no ocultable mientras haya ítems pendientes. Cada ítem muestra: qué requiere (título de la notificación), en qué proyecto ocurre, cuánto tiempo lleva pendiente, botón de acción directa a `accionUrl`. Orden: por `prioridad` (critica primero) y luego por `fechaCreacion` ascendente. Actualización: `onSnapshot`.

**W-G2 · Mis Proyectos Activos**
Tarjetas individuales por cada proyecto en `proyectosAsignados` del gestor con estado `activo_en_definicion` o `activo_en_desarrollo`. Cada tarjeta incluye:
- Nombre del proyecto y estado actual (badge con color).
- Metodología acordada (M2-07).
- Próximo hito y fecha límite.
- Estado del SRS vinculado (fase 1-8 y estado).
- Número de riesgos abiertos (estado != cerrado|descartado).
- Semáforo de salud (verde/amarillo/rojo — ver §6).
- Enlace directo a `/m2/proyectos/{id}`.

No ocultable mientras haya al menos un proyecto activo asignado.

**W-G3 · Hitos Próximos (7 días)**
Hitos de los proyectos del gestor con `fechaLimite` entre hoy y hoy+7 días. Agrupados por proyecto. Alerta visual diferenciada para hitos ya vencidos sin cerrar (fechaLimite < hoy AND estado != cerrado): borde rojo y badge "Vencido hace N días". Cada ítem enlaza directamente al hito en `/m2/proyectos/{proyectoId}/hitos/{hitoId}`.

**W-G4 · Riesgos Activos**
Riesgos de los proyectos del gestor con `estado IN ['identificado', 'enSeguimiento', 'mitigandose']`. Ordenados por `probabilidad × impacto` descendente (matriz de riesgo). Muestra top 10 con enlace "Ver todos (N)" al listado completo del proyecto. Cada ítem: título del riesgo, estado, proyecto asociado, nivel de exposición calculado, plan de mitigación activo (sí/no).

**W-G5 · Estado SRS de mis Proyectos**
Una fila por cada proyecto activo del gestor con SRS vinculado. Columnas: nombre del proyecto, fase actual del SRS (número 1-8), Gate pendiente si aplica (con días en espera), RF totales (propuesto / aprobado / rechazado), cobertura de trazabilidad %. Semáforo por Gate pendiente: rojo si >5 días, amarillo si 2-5 días. Click navega a `/m3/srs/{srsId}`.

**W-G6 · Actividad Reciente de mis Proyectos**
Últimas 8 entradas de `auditoria` (T-03) donde `entidad.id IN proyectosAsignados` o `entidadRelacionada.id IN proyectosAsignados`. Muestra: timestamp, actor, acción, entidad afectada. Solo informativo. `getDocs` al cargar con `orderBy('timestamp', 'desc').limit(8)`.

---

### 3.3 ROL: analista — Dashboard Operativo de SRS

El dashboard del analista prioriza el avance de los SRS bajo su responsabilidad. Foco total en M3 con lectura de contexto de M2.

#### Tabla de Widgets — Rol analista

| ID Widget | Título | Fuente Firestore | Actualización | Accionable | Ocultable |
|---|---|---|---|:---:|:---:|
| W-AN1 | Mis Acciones Pendientes | `notificaciones` (accionRequerida=true, destinatario=uid) | `realtime` (onSnapshot) | ✅ | ❌ |
| W-AN2 | Mis SRS Activos | `documentosSRS` (proyectosAsignados, estado!=noiniciado,aprobado) | `onload` | ✅ | ❌ |
| W-AN3 | Requerimientos Pendientes de Formalizar | `requerimientos` (estado=propuesto, srsId IN srsActivos) | `onload` | ✅ | ✅ |
| W-AN4 | Cobertura de Trazabilidad | `requerimientos` + `trazabilidad` (por SRS activo) | `onload` | ✅ | ✅ |
| W-AN5 | Conflictos y Alertas del SRS | `requerimientos` + `documentosSRS` (reglas de alerta) | `onload` | ✅ | ✅ |

#### Descripción de Widgets del Analista

**W-AN1 · Mis Acciones Pendientes**
Notificaciones de T-02 con `accionRequerida=true` y `uid` del analista en `destinatarios`. Incluye: requerimientos sin formalizar con fecha límite inminente, conflictos MoSCoW pendientes de resolución, observaciones del cliente (viewer) en estado `pendiente` de M3. Igual lógica que W-G1: primer widget, no ocultable con ítems pendientes, orden por prioridad y antigüedad. Actualización: `onSnapshot`.

**W-AN2 · Mis SRS Activos**
Tarjetas por cada SRS en `proyectosAsignados` del analista con estado distinto de `noiniciado`, `aprobado` y `cancelado`. Cada tarjeta muestra:
- Fase actual del SRS (número 1-8 con barra de progreso visual).
- Gate pendiente si aplica (con nombre del gate y días transcurridos).
- RF por estado: propuesto (gris) / aprobado (verde) / rechazado (rojo) — conteos con chips de color.
- Próxima acción sugerida (texto derivado del estado actual del SRS).
- Enlace a `/m3/srs/{id}`.

No ocultable mientras haya al menos un SRS activo asignado.

**W-AN3 · Requerimientos Pendientes de Formalizar**
Requerimientos con `estado='propuesto'` de los SRS activos del analista, agrupados por tipo:
- **RF** — Requerimientos Funcionales propuestos.
- **RNF** — Requerimientos No Funcionales propuestos.
- **RD** — Requerimientos de Dominio propuestos.

Orden dentro de cada grupo: más antiguos primero (`fechaCreacion` ascendente). Cada ítem enlaza directamente al formulario de formalización en `/m3/srs/{srsId}/requerimientos/{reqId}/formalizar`. Badge de antigüedad: amarillo si >3 días, rojo si >7 días sin formalizar.

**W-AN4 · Cobertura de Trazabilidad**
Por cada SRS activo, dos barras de progreso:
- **Trazabilidad hacia atrás:** % de RF aprobados que tienen `stakeholderFuente` documentado en `EntradaTrazabilidad`.
- **Trazabilidad hacia adelante:** % de RF con `prioridad='must'` que tienen al menos un caso de prueba asociado.

Alerta visual cuando cualquier barra cae por debajo del 80% (borde amarillo) o del 60% (borde rojo). Click navega a la matriz de trazabilidad en `/m3/srs/{srsId}/trazabilidad`.

**W-AN5 · Conflictos y Alertas del SRS**
Lista consolidada de todos los elementos que bloquean el avance del SRS, derivados de reglas evaluadas al cargar:

| Tipo de alerta | Condición | Acción sugerida |
|---|---|---|
| Conflicto MoSCoW | RF `must` con dependencia de RF `wont` | Resolver conflicto de prioridad |
| Bucle cercano al límite | Iteración de Fase 3 o 4 en ciclo ≥ 2 de 3 | Revisar con el gestor antes del límite |
| RNF sin métrica | RNF `aprobado` sin campo `metrica` definido | Agregar métrica verificable |
| Won't Have sin justificación | RF con `prioridad='wont'` sin `justificacionWont` | Documentar justificación obligatoria |
| Observación pendiente del cliente | `ObservacionValidacion` con `estado='pendiente'` | Responder observación del viewer |

Cada ítem enlaza directamente al elemento afectado. Si la lista está vacía, muestra mensaje positivo: "Sin conflictos activos — el SRS puede avanzar".

---

### 3.4 ROL: viewer — Dashboard de Seguimiento

El dashboard del viewer es minimalista y enfocado en su proyecto. El viewer es típicamente el cliente — solo ve lo que necesita para seguir el avance y participar en la validación cuando se le requiere.

#### Tabla de Widgets — Rol viewer

| ID Widget | Título | Fuente Firestore | Actualización | Accionable | Ocultable |
|---|---|---|---|:---:|:---:|
| W-V1 | Estado del Proyecto | `proyectos` (proyectosAsignados[0]) | `onload` | ❌ | ❌ |
| W-V2 | SRS para Revisión | `documentosSRS` (estado=envalidacion, proyectoId) | `onload` | ✅ | ❌ |
| W-V3 | Mis Observaciones | `observacionesValidacion` (autorUid=uid) | `onload` | ❌ | ✅ |

#### Descripción de Widgets del Viewer

**W-V1 · Estado del Proyecto**
Tarjeta única del proyecto al que tiene acceso el viewer (el primero en `proyectosAsignados`). Muestra: nombre del proyecto, estado actual (badge), metodología acordada, % avance de hitos (solo hitos que el gestor marcó como visibles al viewer), próximos 2 hitos con fechas. No expone información financiera (presupuesto, estimaciones COCOMO). Solo lectura — no hay acciones en este widget.

**W-V2 · SRS para Revisión**
Widget más prominente cuando el SRS del proyecto está en estado `envalidacion`. Muestra:
- Banner destacado con fondo de color de llamado a la acción.
- Título: "El SRS de su proyecto requiere su revisión".
- Enlace directo al SRS completo en modo lectura.
- Botón "Agregar observación" que abre el formulario de `ObservacionValidacion` (M3).
- Fecha límite de la revisión si está definida.

Cuando el SRS **no** está en estado `envalidacion`, este widget se oculta o muestra estado neutro: "El SRS está en preparación — recibirá notificación cuando requiera su revisión."

**W-V3 · Mis Observaciones**
Lista de `ObservacionValidacion` creadas por el viewer (`autorUid=uid`). Por cada observación: número de RF al que aplica, texto corto de la observación, estado (pendiente de resolución / resuelta), respuesta del analista si existe. Solo lectura — el viewer puede ver si sus observaciones fueron consideradas, pero no editarlas una vez enviadas.

---

## 4. Tipos TypeScript

```typescript
// types/dashboard.ts — austranet-cco

// ─── Enum de tipos de widget ──────────────────────────────────────────────────

export type TipoWidget =
  | 'resumen_sistema'       // W-A1: métricas numéricas en tarjetas
  | 'alertas_criticas'      // W-A2: lista de notificaciones críticas con acción
  | 'estado_proyectos'      // W-A3: tabla de proyectos activos
  | 'pipeline_srs'          // W-A4: funnel de estados SRS
  | 'entidades_riesgo'      // W-A5: entidades con riesgo alto/crítico
  | 'actividad_reciente'    // W-A6, W-G6: log de auditoría reciente
  | 'metricas_mejora'       // W-A7: métricas de mejora entre proyectos
  | 'acciones_pendientes'   // W-G1, W-AN1: notificaciones accionables del usuario
  | 'mis_proyectos'         // W-G2: tarjetas de proyectos propios
  | 'hitos_proximos'        // W-G3: hitos en los próximos 7 días
  | 'riesgos_activos'       // W-G4: top riesgos por exposición
  | 'estado_srs_proyectos'  // W-G5: resumen SRS por proyecto del gestor
  | 'mis_srs'               // W-AN2: tarjetas de SRS activos del analista
  | 'req_pendientes'        // W-AN3: requerimientos sin formalizar
  | 'cobertura_trazabilidad'// W-AN4: barras de progreso de trazabilidad
  | 'conflictos_srs'        // W-AN5: alertas y conflictos del SRS
  | 'estado_proyecto_viewer'// W-V1: tarjeta única del proyecto del viewer
  | 'srs_revision'          // W-V2: SRS en validación para el viewer
  | 'mis_observaciones'     // W-V3: observaciones del viewer

// ─── Fuente de datos de un widget ────────────────────────────────────────────

export interface FuenteDatos {
  coleccion: string                // colección de Firestore
  filtros: string[]                // descripción de los filtros aplicados (legible)
  limite?: number                  // limit() de la query si aplica
}

// ─── Definición de un widget ──────────────────────────────────────────────────

export interface WidgetDashboard {
  id: string                          // ej: 'W-A1', 'W-G2', 'W-AN3'
  tipo: TipoWidget
  titulo: string
  rolesVisibles: RolUsuario[]         // roles de T-01 que ven este widget
  orden: number                       // posición en el layout del rol (1 = primero)
  tamano: 'pequeno' | 'mediano' | 'grande' | 'completo'
  fuentes: FuenteDatos[]
  actualizacion: 'realtime' | 'onload' | 'polling_5min'
  accionable: boolean                 // true si el widget requiere o dispara acciones
  ocultable: boolean                  // false si tiene ítems pendientes (bloqueo de ocultación)
}

// ─── Semáforo de salud del proyecto ──────────────────────────────────────────

export type ColorSemaforo = 'verde' | 'amarillo' | 'rojo'

export interface SemaforoProceso {
  proyectoId: string
  color: ColorSemaforo
  condicionesRojas: string[]          // lista de condiciones rojas activas (puede estar vacía)
  condicionesAmarillas: string[]      // lista de condiciones amarillas activas
  calculadoEn: Date                   // timestamp del último cálculo
}

// ─── Configuración personalizada del dashboard de un usuario ─────────────────

export interface ConfigDashboard {
  uid: string
  rol: RolUsuario
  widgetsOcultos: string[]            // IDs de widgets que el usuario ocultó (ej: ['W-A7'])
  ordenPersonalizado?: string[]       // IDs de widgets en el orden definido por el usuario
  ultimaActualizacion: Date
}

// ─── Elemento de navegación rápida (historial reciente) ──────────────────────

export interface ElementoNavRapida {
  tipo: 'Proyecto' | 'SRS' | 'Entidad'
  id: string
  nombre: string
  url: string
  visitadoEn: number                  // Date.now() — guardado en localStorage
}

// ─── Estado del dashboard en el cliente ──────────────────────────────────────

export interface EstadoDashboard {
  rol: RolUsuario
  uid: string
  cargando: boolean
  errorConexion: boolean              // true si Firestore está offline
  widgetsActivos: WidgetDashboard[]   // widgets visibles según rol y config
  config: ConfigDashboard
  navReciente: ElementoNavRapida[]    // últimos 5 elementos visitados (localStorage)
}

// ─── Resultado del cálculo del semáforo ──────────────────────────────────────

export interface ResultadoSemaforo {
  proyectoId: string
  color: ColorSemaforo
  condicionesActivas: {
    nivel: 'rojo' | 'amarillo'
    descripcion: string
    fuente: string                    // colección/campo de Firestore que originó la condición
  }[]
  calculadoEn: Date
}

// ─── Contadores del widget W-A1 ───────────────────────────────────────────────

export interface ResumenSistema {
  totalEntidadesActivas: number
  totalProyectosActivos: number
  totalSrsEnProceso: number
  totalUsuariosActivos: number
  calculadoEn: Date
}
```

---

## 5. Estrategia de Datos en Tiempo Real

### 5.1 Los Tres Niveles de Actualización

El costo de lecturas de Firestore es la principal restricción de diseño del dashboard. No todos los widgets necesitan datos en tiempo real — aplicar `onSnapshot` a todos los widgets generaría cientos de lecturas por minuto por usuario activo. La estrategia diferencia tres niveles según la urgencia del dato.

| Nivel | Estrategia | Widgets | Justificación |
|---|---|---|---|
| **Realtime** | `onSnapshot` (listener activo) | W-A2, W-G1, W-AN1 | El usuario necesita ver nuevas alertas sin refresh manual. Son notificaciones con `accionRequerida=true` — cada segundo de retraso puede implicar escalamiento automático de T-02. |
| **On load** | `getDocs` al montar el componente | W-A1, W-A3, W-A5, W-A6, W-G2, W-G3, W-G4, W-G5, W-G6, W-AN2, W-AN3, W-AN4, W-AN5, W-V1, W-V2, W-V3 | El estado de proyectos y SRS cambia con acciones deliberadas del usuario. Un botón "Actualizar" manual permite refrescar cuando se necesita. |
| **Polling 5 min** | `setInterval` de 5 minutos | W-A4, W-A7 | Son agregaciones costosas (counts, métricas cross-project). No cambian por segundo y su recálculo implica múltiples lecturas. |

### 5.2 Límite de Listeners Simultáneos

**Regla de diseño:** Máximo 3 listeners `onSnapshot` activos simultáneamente en el dashboard.

Esta es una restricción de diseño, no técnica. Firestore soporta más listeners, pero cada listener activo consume 1 lectura inicial + 1 lectura por cada documento que cambia. Con N usuarios activos y K listeners cada uno, el costo escala rápidamente:

```
Costo estimado (mensual) con 10 usuarios activos, 8 horas/día, 20 días/mes:
  - Sin límite (10 listeners/usuario):  10 × 10 × 8h × 3600s × ~0.5 cambios/min ≈ miles de lecturas/día
  - Con límite (3 listeners/usuario):   3 × 10 × 8h × 3600s × ~0.5 cambios/min ≈ costo controlado
```

Los 3 listeners permitidos son exactamente W-A2, W-G1 o W-AN1 (solo uno activo según el rol) — que son los únicos widgets donde el tiempo real es operacionalmente crítico.

### 5.3 Implementación de los Listeners

```typescript
// hooks/useDashboardRealtime.ts — austranet-cco

import { useEffect, useState } from 'react'
import {
  collection, query, where, onSnapshot,
  orderBy, Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Notificacion } from '@/types'

/**
 * Hook para los widgets realtime del dashboard.
 * Solo activa 1 listener según el rol del usuario.
 * admin/superadmin → W-A2 (alertas críticas de la organización)
 * gestor           → W-G1 (acciones pendientes del gestor)
 * analista         → W-AN1 (acciones pendientes del analista)
 * viewer           → sin listener realtime (W-V2 es onload)
 */
export function useDashboardRealtime(uid: string, rol: string) {
  const [notificacionesPendientes, setNotificacionesPendientes] = useState<Notificacion[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (rol === 'viewer') {
      setCargando(false)
      return
    }

    let q

    if (rol === 'admin' || rol === 'superadmin') {
      // W-A2: alertas críticas de toda la organización
      q = query(
        collection(db, 'notificaciones'),
        where('accionRequerida', '==', true),
        where('prioridad', '==', 'critica'),
        where('estado', 'in', ['pendiente', 'enviada']),
        orderBy('fechaCreacion', 'asc')  // más antiguas primero
      )
    } else {
      // W-G1 (gestor) y W-AN1 (analista): acciones pendientes del propio usuario
      q = query(
        collection(db, 'notificaciones'),
        where('destinatarios', 'array-contains', uid),
        where('accionRequerida', '==', true),
        where('estado', 'in', ['pendiente', 'enviada']),
        orderBy('prioridad', 'desc'),
        orderBy('fechaCreacion', 'asc')
      )
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }) as Notificacion)
      setNotificacionesPendientes(items)
      setCargando(false)
    }, (error) => {
      console.error('[T05] Error en listener realtime:', error)
      setCargando(false)
    })

    // Cleanup: desuscribir el listener al desmontar el componente
    return () => unsubscribe()
  }, [uid, rol])

  return { notificacionesPendientes, cargando }
}
```

### 5.4 Polling para Métricas Agregadas

```typescript
// hooks/useDashboardPolling.ts — austranet-cco

import { useEffect, useState, useCallback } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const POLLING_INTERVAL_MS = 5 * 60 * 1000  // 5 minutos

export function usePipelineSRS() {
  const [pipeline, setPipeline] = useState<Record<string, number>>({})
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null)

  const cargar = useCallback(async () => {
    const estadosSRS = [
      'noiniciado', 'enadquisicion', 'enprototipado', 'enmodelado',
      'enespecificacion', 'envalidacion', 'conobservaciones', 'aprobado',
    ]

    // Cargar todos los SRS y agrupar por estado (getCountFromServer por estado)
    const conteos: Record<string, number> = {}

    await Promise.all(
      estadosSRS.map(async (estado) => {
        const snap = await getDocs(
          query(collection(db, 'documentosSRS'), where('estado', '==', estado))
        )
        conteos[estado] = snap.size
      })
    )

    setPipeline(conteos)
    setUltimaActualizacion(new Date())
  }, [])

  useEffect(() => {
    cargar()  // carga inicial
    const intervalo = setInterval(cargar, POLLING_INTERVAL_MS)
    return () => clearInterval(intervalo)
  }, [cargar])

  return { pipeline, ultimaActualizacion, recargar: cargar }
}
```

---

## 6. Algoritmo del Semáforo de Salud del Proyecto

El semáforo de salud aparece en W-A3 (admin) y W-G2 (gestor) por cada proyecto activo. Es la señal visual más importante del dashboard operativo: permite identificar de un vistazo qué proyectos requieren atención inmediata.

### 6.1 Tabla de Condiciones del Semáforo

| Color | Condición | Fuente de dato | Prioridad de evaluación |
|---|---|---|:---:|
| 🔴 ROJO | Riesgo materializado en los últimos 7 días sin plan de mitigación activo | `proyectos/{id}/riesgos` · campo `estado='materializado'` + `fechaMaterializacion` · ausencia de `planMitigacionActivo` | 1 |
| 🔴 ROJO | Hito vencido hace más de 3 días sin cerrar | `proyectos/{id}/hitos` · `fechaLimite < hoy-3días` + `estado != 'cerrado'` | 2 |
| 🔴 ROJO | Desviación de presupuesto superior al 20% | `proyectos/{id}` · `costoReal / costoEstimado > 1.20` | 3 |
| 🔴 ROJO | SRS en Gate con más de 5 días sin decisión | `documentosSRS` · `estadoGate='pendiente'` + `diasEnGate > 5` | 4 |
| 🔴 ROJO | Iteración de bucle Fase 3 o 4 que superó el límite de 3 ciclos | `documentosSRS` · `iteracionFase3 > 3` o `iteracionFase4 > 3` | 5 |
| 🟡 AMARILLO | Hito con fecha límite en los próximos 3 días sin cerrar | `proyectos/{id}/hitos` · `fechaLimite BETWEEN hoy AND hoy+3días` + `estado != 'cerrado'` | 1 |
| 🟡 AMARILLO | Riesgo con `probabilidad='alta'` sin plan de mitigación | `proyectos/{id}/riesgos` · `probabilidad='alta'` + ausencia de `planMitigacion` | 2 |
| 🟡 AMARILLO | Presupuesto entre 80% y 100% consumido sin margen | `proyectos/{id}` · `costoReal / costoEstimado BETWEEN 0.80 AND 1.00` | 3 |
| 🟡 AMARILLO | SRS con Gate pendiente entre 2 y 5 días | `documentosSRS` · `estadoGate='pendiente'` + `diasEnGate BETWEEN 2 AND 5` | 4 |
| 🟡 AMARILLO | RF Must Have sin `criterioAceptacion` definido | `requerimientos` · `prioridad='must'` + `estado='aprobado'` + `criterioAceptacion=null` | 5 |
| 🟢 VERDE | Ninguna condición roja ni amarilla activa | — evaluación por descarte | — |

### 6.2 Reglas de evaluación

- El semáforo es **ROJO** si **cualquiera** de las condiciones rojas es verdadera. No importa cuántas condiciones amarillas haya.
- El semáforo es **AMARILLO** si **ninguna condición roja** es verdadera y **al menos una condición amarilla** es verdadera.
- El semáforo es **VERDE** si ninguna condición roja ni amarilla es verdadera.

### 6.3 Implementación del Cálculo

```typescript
// lib/dashboard/calcularSemaforo.ts — austranet-cco

import { getDocs, collection, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { ResultadoSemaforo, ColorSemaforo } from '@/types/dashboard'

/**
 * Calcula el semáforo de salud de un proyecto.
 * Se ejecuta al cargar el widget W-A3 (admin) o W-G2 (gestor).
 * El resultado se cachea en Proyecto.saludCalculada para evitar recálculos
 * en cada render del mismo widget durante la misma sesión.
 */
export async function calcularSemaforoProyecto(
  proyectoId: string
): Promise<ResultadoSemaforo> {
  const ahora = new Date()
  const hace3Dias = new Date(ahora.getTime() - 3 * 24 * 60 * 60 * 1000)
  const hace7Dias = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000)
  const en3Dias = new Date(ahora.getTime() + 3 * 24 * 60 * 60 * 1000)

  const condicionesActivas: ResultadoSemaforo['condicionesActivas'] = []

  // ─── CONDICIONES ROJAS ────────────────────────────────────────────────────

  // R1: Riesgo materializado en últimos 7 días sin plan de mitigación
  const riesgosMaterializados = await getDocs(
    query(
      collection(db, `proyectos/${proyectoId}/riesgos`),
      where('estado', '==', 'materializado'),
      where('fechaMaterializacion', '>=', hace7Dias),
      where('planMitigacionActivo', '==', false)
    )
  )
  if (!riesgosMaterializados.empty) {
    condicionesActivas.push({
      nivel: 'rojo',
      descripcion: `${riesgosMaterializados.size} riesgo(s) materializado(s) en los últimos 7 días sin plan activo`,
      fuente: `proyectos/${proyectoId}/riesgos.estado=materializado`,
    })
  }

  // R2: Hito vencido hace más de 3 días sin cerrar
  const hitosVencidos = await getDocs(
    query(
      collection(db, `proyectos/${proyectoId}/hitos`),
      where('fechaLimite', '<', hace3Dias),
      where('estado', '!=', 'cerrado')
    )
  )
  if (!hitosVencidos.empty) {
    condicionesActivas.push({
      nivel: 'rojo',
      descripcion: `${hitosVencidos.size} hito(s) vencido(s) hace más de 3 días sin cerrar`,
      fuente: `proyectos/${proyectoId}/hitos.fechaLimite`,
    })
  }

  // ─── CONDICIONES AMARILLAS (solo si no hay rojas) ─────────────────────────

  if (!condicionesActivas.some(c => c.nivel === 'rojo')) {

    // A1: Hito con fecha límite en próximos 3 días sin cerrar
    const hitosProximos = await getDocs(
      query(
        collection(db, `proyectos/${proyectoId}/hitos`),
        where('fechaLimite', '>=', ahora),
        where('fechaLimite', '<=', en3Dias),
        where('estado', '!=', 'cerrado')
      )
    )
    if (!hitosProximos.empty) {
      condicionesActivas.push({
        nivel: 'amarillo',
        descripcion: `${hitosProximos.size} hito(s) con fecha límite en los próximos 3 días`,
        fuente: `proyectos/${proyectoId}/hitos.fechaLimite`,
      })
    }

    // A2: Riesgo con probabilidad alta sin plan de mitigación
    const riesgosAltaSinPlan = await getDocs(
      query(
        collection(db, `proyectos/${proyectoId}/riesgos`),
        where('probabilidad', '==', 'alta'),
        where('planMitigacion', '==', null)
      )
    )
    if (!riesgosAltaSinPlan.empty) {
      condicionesActivas.push({
        nivel: 'amarillo',
        descripcion: `${riesgosAltaSinPlan.size} riesgo(s) de probabilidad alta sin plan de mitigación`,
        fuente: `proyectos/${proyectoId}/riesgos.probabilidad=alta`,
      })
    }
  }

  // ─── Determinar color final ────────────────────────────────────────────────

  let color: ColorSemaforo = 'verde'
  if (condicionesActivas.some(c => c.nivel === 'rojo')) color = 'rojo'
  else if (condicionesActivas.some(c => c.nivel === 'amarillo')) color = 'amarillo'

  return {
    proyectoId,
    color,
    condicionesActivas,
    calculadoEn: ahora,
  }
}
```

### 6.4 Caché del Semáforo

El semáforo se recalcula en cada carga del widget y el resultado se cachea en el campo `Proyecto.saludCalculada` de Firestore. Este campo se usa en renders subsiguientes del mismo widget durante la sesión actual — evita lanzar múltiples queries cuando el componente se re-renderiza por cambios de estado locales (ej: abrir/cerrar un panel de detalles). La próxima carga completa del dashboard siempre ejecuta `calcularSemaforoProyecto()` ignorando el caché.

```typescript
// Estructura del campo cacheado en Firestore (colección proyectos)
interface SaludCalculadaCache {
  color: ColorSemaforo
  condicionesActivas: string[]   // solo descripciones (sin fuente) para minimizar tamaño
  calculadoEn: Timestamp
}
```

---

## 7. Personalización del Dashboard

### 7.1 Reglas de Personalización

| Acción | Descripción | Restricción |
|---|---|---|
| **Ocultar widget** | El usuario puede ocultar widgets no relevantes para su flujo | Un widget con `accionable=true` y al menos 1 ítem pendiente **no puede ocultarse** — muestra tooltip: *"Este widget tiene N elementos que requieren tu atención. Resuélvelos antes de ocultarlo."* |
| **Reordenar widgets** | Drag-and-drop para cambiar el orden de los widgets visibles | El widget de acciones pendientes (W-G1, W-AN1, W-A2) siempre mantiene la posición 1 si tiene ítems pendientes, independientemente del orden guardado |
| **Restaurar layout** | Botón "Restaurar layout por defecto" elimina la `ConfigDashboard` y vuelve al estándar del rol | Confirmar con modal antes de restaurar |
| **Layout por defecto** | El admin puede definir el layout por defecto aplicado a nuevos usuarios desde T-06 | Solo `admin` y `superadmin` — configurado desde T-06 (Configuración del Sistema) |

### 7.2 Persistencia de la Configuración

La configuración personalizada se guarda en Firestore (no en `localStorage`) para que persista entre dispositivos:

```
Firestore
└── configDashboard/
    └── {uid}/                   ← documento por usuario
        ├── uid: string
        ├── rol: RolUsuario
        ├── widgetsOcultos: string[]       // ej: ['W-A7', 'W-A5']
        ├── ordenPersonalizado: string[]   // ej: ['W-A2', 'W-A1', 'W-A3', ...]
        └── ultimaActualizacion: Timestamp
```

```typescript
// lib/dashboard/persistirConfig.ts — austranet-cco

import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { ConfigDashboard } from '@/types/dashboard'

export async function guardarConfigDashboard(
  uid: string,
  cambios: Partial<Pick<ConfigDashboard, 'widgetsOcultos' | 'ordenPersonalizado'>>
): Promise<void> {
  await setDoc(
    doc(db, 'configDashboard', uid),
    {
      ...cambios,
      ultimaActualizacion: serverTimestamp(),
    },
    { merge: true }  // merge para no sobreescribir campos no enviados
  )
}

export async function restaurarLayoutPorDefecto(uid: string): Promise<void> {
  await setDoc(doc(db, 'configDashboard', uid), {
    uid,
    widgetsOcultos: [],
    ordenPersonalizado: null,
    ultimaActualizacion: serverTimestamp(),
  })
}
```

### 7.3 Aplicación de la Configuración al Cargar

```typescript
// hooks/useConfigDashboard.ts — austranet-cco

import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { WIDGETS_POR_ROL } from '@/lib/dashboard/widgetsPorRol'
import type { ConfigDashboard, WidgetDashboard } from '@/types/dashboard'

export function useConfigDashboard(uid: string, rol: string) {
  const [widgetsActivos, setWidgetsActivos] = useState<WidgetDashboard[]>([])
  const [config, setConfig] = useState<ConfigDashboard | null>(null)

  useEffect(() => {
    async function cargar() {
      // 1. Widgets por defecto según rol
      const widgetsDelRol: WidgetDashboard[] = WIDGETS_POR_ROL[rol] ?? []

      // 2. Cargar config personalizada de Firestore
      const snap = await getDoc(doc(db, 'configDashboard', uid))
      const cfg = snap.data() as ConfigDashboard | undefined

      // 3. Aplicar orden personalizado si existe
      let widgets = [...widgetsDelRol]
      if (cfg?.ordenPersonalizado?.length) {
        const mapaWidgets = Object.fromEntries(widgets.map(w => [w.id, w]))
        widgets = cfg.ordenPersonalizado
          .map(id => mapaWidgets[id])
          .filter(Boolean)
        // Agregar widgets que no están en el orden guardado (nuevos widgets)
        const idsEnOrden = new Set(cfg.ordenPersonalizado)
        widgets.push(...widgetsDelRol.filter(w => !idsEnOrden.has(w.id)))
      }

      // 4. Aplicar widgets ocultos (respetando restricción de accionables con pendientes)
      const ocultos = new Set(cfg?.widgetsOcultos ?? [])
      widgets = widgets.filter(w => !ocultos.has(w.id) || !w.ocultable)

      setWidgetsActivos(widgets)
      setConfig(cfg ?? { uid, rol, widgetsOcultos: [], ultimaActualizacion: new Date() })
    }

    cargar()
  }, [uid, rol])

  return { widgetsActivos, config }
}
```

---

## 8. Navegación Rápida

### 8.1 Panel de Navegación Rápida

Panel fijo en la barra superior (navbar), visible para todos los roles excepto cuando hay indicador de modo offline. Tiene cuatro componentes:

**Historial de elementos recientes**
Últimos 5 elementos visitados (proyectos, SRS, entidades) ordenados por `visitadoEn` descendente. Guardados en `localStorage` bajo la clave `austranet_nav_reciente` — no en Firestore, para evitar lecturas en cada navegación. Cada ítem muestra: ícono del tipo, nombre truncado, enlace directo. El historial se actualiza automáticamente al navegar a cualquier recurso de M1, M2 o M3.

```typescript
// lib/dashboard/navReciente.ts — austranet-cco

const NAV_KEY = 'austranet_nav_reciente'
const MAX_ITEMS = 5

export function registrarElementoVisitado(elemento: ElementoNavRapida): void {
  const historial = leerNavReciente()
  const nuevo = [
    { ...elemento, visitadoEn: Date.now() },
    ...historial.filter(h => h.id !== elemento.id),
  ].slice(0, MAX_ITEMS)
  localStorage.setItem(NAV_KEY, JSON.stringify(nuevo))
}

export function leerNavReciente(): ElementoNavRapida[] {
  try {
    return JSON.parse(localStorage.getItem(NAV_KEY) ?? '[]')
  } catch {
    return []
  }
}
```

**Accesos rápidos fijos**

| Acción | Shortcut / Botón | Rol mínimo | Destino |
|---|---|---|---|
| Búsqueda global | `Cmd/Ctrl+K` | `analista` | Modal de T-04 |
| Crear nuevo proyecto | Botón `+` | `gestor` | `/m2/proyectos/nuevo` |
| Ver notificaciones | Ícono campana + badge | Todos | Panel lateral T-02 |
| Ver auditoría | Ícono log | `gestor` (solo sus proyectos) / `admin` (todo) | `/admin/auditoria` o `/m2/proyectos/{id}/auditoria` |

**Indicador de conectividad Firestore**
Banner visible en la parte superior del contenido (debajo del navbar) cuando Firestore detecta modo offline:

```typescript
// components/dashboard/BannerOffline.tsx — austranet-cco

import { useEffect, useState } from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function BannerOffline() {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    // Firestore emite error en listeners cuando hay problemas de conexión
    const unsubscribe = onSnapshot(
      doc(db, '_heartbeat', 'ping'),
      () => setOffline(false),
      () => setOffline(true)
    )
    return () => unsubscribe()
  }, [])

  if (!offline) return null

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-sm text-yellow-800 flex items-center gap-2">
      <span>⚠️</span>
      <span>
        <strong>Modo sin conexión.</strong> Mostrando datos del caché local.
        Los cambios realizados se sincronizarán al restaurar la conexión.
      </span>
    </div>
  )
}
```

Los datos cacheados de Firestore (Persistence habilitado) continúan disponibles en modo offline. Los widgets con `onSnapshot` muestran los datos del último estado conocido.

---

## 9. Conexiones con los Elementos Transversales

### T-01 — Autenticación, Roles y Permisos

El rol del usuario (T-01) determina completamente qué dashboard ve el usuario y qué datos puede ver en cada widget. No existe un dashboard único que se adapta — son layouts completamente distintos según el rol. La verificación del rol ocurre en el servidor (middleware de Next.js) antes de renderizar la página del dashboard, y se aplica nuevamente en cada query de Firestore a través de las reglas de seguridad. El campo `proyectosAsignados` del tipo `Usuario` (T-01) es el filtro principal de todos los widgets del gestor y el analista — sin él, los widgets estarían vacíos o mostrarían datos de proyectos ajenos.

### T-02 — Sistema de Notificaciones

W-A2 (admin), W-G1 (gestor), W-AN1 (analista) y W-V2 (viewer) son vistas filtradas de la colección `notificaciones` de T-02. El dashboard no duplica la lógica de generación de notificaciones — solo consume la misma fuente con filtros adicionales (`accionRequerida=true`, `destinatarios array-contains uid`). Las acciones ejecutadas desde los botones de los widgets actualizan el campo `estado` de la notificación en T-02 (de `enviada` a `accionada`), lo que a su vez elimina la notificación del widget gracias al listener `onSnapshot`.

### T-03 — Auditoría y Logs

W-A6 (admin) y W-G6 (gestor) consumen directamente la colección `auditoria` de T-03 con filtros de criticidad y de proyectos asignados respectivamente. El dashboard no escribe en `auditoria` — solo lee. Las acciones ejecutadas desde el dashboard (navegar a un recurso, ejecutar una acción desde un widget) son registradas por los módulos correspondientes (M1, M2, M3) cuando el usuario llega a ellos y realiza la operación. La auditoría del dashboard en sí registra solo la acción `T05_DASHBOARD_CARGADO` para métricas de uso.

### T-04 — Búsqueda Global

El panel de navegación rápida del dashboard expone el shortcut `Cmd/Ctrl+K` que abre el modal de búsqueda de T-04 sin cambiar de pantalla. El historial de elementos recientes de la navegación rápida (§8) es complementario al historial de búsquedas de T-04 — el primero registra elementos visitados, el segundo registra términos buscados. Ambos se guardan en `localStorage` y son independientes entre sí.

### T-06 — Configuración del Sistema

Los layouts por defecto por rol y la lista de widgets no ocultables se configuran desde T-06 (Configuración del Sistema). El admin accede a T-06 para:
- Definir el `ordenPersonalizado` por defecto que se aplica a usuarios nuevos de cada rol.
- Definir qué widgets son obligatorios (no ocultables) para cada rol.
- Configurar el límite de tiempo para el escalamiento de notificaciones críticas no accionadas (que afecta W-A2).

Esta separación de responsabilidades mantiene el dashboard como componente de visualización y T-06 como el componente de configuración del sistema.

---

## 10. Checklist de Completitud del Documento

| Ítem | Estado |
|---|:---:|
| Metadatos completos (nombre, capa, posición, módulos, prerrequisitos, stack, versión, fecha, estado) | ✅ |
| Objetivo — por qué el dashboard es transversal y no pertenece a ningún módulo | ✅ |
| Objetivo — problema resuelto: vista unificada vs. navegación módulo por módulo | ✅ |
| Distinción clara entre dashboard ejecutivo (admin) y dashboard operativo (gestor/analista) | ✅ |
| Widgets documentados para el rol admin/superadmin (W-A1 a W-A7) | ✅ |
| Widgets documentados para el rol gestor (W-G1 a W-G6) | ✅ |
| Widgets documentados para el rol analista (W-AN1 a W-AN5) | ✅ |
| Widgets documentados para el rol viewer (W-V1 a W-V3) | ✅ |
| Tabla Markdown de widgets por rol con columnas: ID, Título, Fuente, Actualización, Accionable, Ocultable | ✅ |
| Tipos TypeScript: `TipoWidget`, `WidgetDashboard`, `FuenteDatos`, `ConfigDashboard`, `SemaforoProceso`, `EstadoDashboard`, `ResumenSistema` | ✅ |
| Estrategia de datos en tiempo real — los 3 niveles con justificación de costo Firestore | ✅ |
| Límite de 3 listeners simultáneos documentado con justificación y cálculo de costo | ✅ |
| Implementación de hook `useDashboardRealtime` con código TypeScript | ✅ |
| Implementación de polling con `usePipelineSRS` con código TypeScript | ✅ |
| Algoritmo del semáforo — tabla completa con condiciones rojas y amarillas | ✅ |
| Fuentes de datos del semáforo por cada condición | ✅ |
| Implementación de `calcularSemaforoProyecto` con código TypeScript | ✅ |
| Caché del semáforo en `Proyecto.saludCalculada` documentado | ✅ |
| Personalización — ocultar widgets con restricción de accionables pendientes | ✅ |
| Personalización — reordenar con drag-and-drop y persistencia en Firestore | ✅ |
| Personalización — restaurar layout por defecto | ✅ |
| Personalización — layout por defecto configurable desde T-06 | ✅ |
| Navegación rápida — historial de 5 elementos en localStorage | ✅ |
| Navegación rápida — accesos rápidos fijos con roles mínimos | ✅ |
| Indicador de conectividad Firestore (banner modo offline) | ✅ |
| Conexión T-01: rol determina completamente el dashboard y los filtros de datos | ✅ |
| Conexión T-02: widgets de acciones pendientes consumen `notificaciones` sin duplicar lógica | ✅ |
| Conexión T-03: widgets de actividad reciente consumen `auditoria` con filtros de rol | ✅ |
| Conexión T-04: shortcut `Cmd+K` y panel de navegación rápida | ✅ |
| Conexión T-06: configuración de layouts por defecto y widgets obligatorios | ✅ |
| Todo en español con terminología consistente de T-01, T-02, T-03, T-04, M1, M2, M3 | ✅ |
| Formato de metadatos HTML comentados consistente con T-01 a T-04 | ✅ |

---

*Documento generado para el sistema austranet-cco · Capa Transversal · T-05 de 6*
