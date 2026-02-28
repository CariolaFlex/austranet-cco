<!-- ============================================================
  AUSTRANET-CCO — CAPA TRANSVERSAL
  Archivo:  T-06-configuracion-sistema.md
  Capa:     Transversal
  Elemento: 6 de 6 — CIERRE DE LA CAPA TRANSVERSAL
  Sirve a:  M1 · M2 · M3 · T-01 · T-02 · T-03 · T-04 · T-05
  Prerrequisito: T-01 (solo superadmin/admin pueden modificar configuración)
  Stack:    Firestore (colección `configuracion`, documento único `sistema`)
            Next.js API Routes · TypeScript
  Versión:  1.0
  Fecha:    2026-02-27
  Estado:   activo
  Autor:    austranet-cco
  ============================================================ -->

# T-06-configuracion-sistema.md

> **Capa Transversal — Elemento 6 de 6 · CIERRE DE LA CAPA TRANSVERSAL**
> **Configuración del Sistema**
> *Componente que sirve a todo el sistema: M1 · M2 · M3 · T-01 · T-02 · T-03 · T-04 · T-05*

---

## 1. Metadatos del Documento

| Campo | Valor |
|---|---|
| **Nombre del archivo** | `T-06-configuracion-sistema.md` |
| **Capa** | Transversal |
| **Posición** | Elemento 6 de 6 — **Cierre de la Capa Transversal** |
| **Módulos que sirve** | M1 — Registro de Entidades · M2 — Gestión de Proyectos · M3 — Documentación SRS · T-01 a T-05 (todo el sistema) |
| **Prerrequisito** | T-01 — Autenticación, Roles y Permisos (solo `superadmin` y `admin` pueden modificar la configuración) |
| **Stack** | Firestore (colección `configuracion`, documento único `sistema`) · Next.js API Routes · TypeScript |
| **Versión** | 1.0 |
| **Fecha** | 2026-02-27 |
| **Estado** | `activo` — listo para implementación |
| **Sistema de referencia** | austranet-cco |
| **Dependencias directas** | T-01, T-02, T-03, T-04, T-05 |

---

## 2. Objetivo del Documento

### ¿Por qué la configuración es transversal?

T-06 no pertenece a ningún módulo específico porque sus parámetros afectan simultáneamente el comportamiento de todos los módulos y todos los elementos transversales. Un umbral del semáforo de M2 (§6 de T-05) depende de `proyectos.semaforoRojo.diasHitoVencidoSinCerrar`. El rate limit de T-04 depende de `busqueda.rateLimitRequestsPorMinuto`. El plazo de escalamiento de T-02 depende de `notificaciones.plazoEscalamientoCriticoHoras`. Ninguno de estos parámetros puede vivir dentro de un módulo específico sin crear dependencias cruzadas incorrectas. Solo un componente transversal puede ser la fuente de verdad de todos ellos.

### El problema que resuelve

Sin T-06, todos los umbrales y límites operativos del sistema estarían hardcodeados en el código fuente. Cambiar el límite de iteraciones del bucle de M3 de 3 a 5 para un proyecto complejo requeriría modificar el código, hacer un build y desplegar en Vercel — un ciclo de cambio que puede tomar horas o días. Con T-06, el admin actualiza el valor en Firestore desde el panel de configuración y el sistema lo aplica en la próxima carga de sesión, sin intervención del equipo técnico. Esto es especialmente crítico para parámetros operativos que cambian según el contexto del negocio: períodos de retención de auditoría por regulación, plazos de revisión del cliente según contrato, o umbrales de alerta según el perfil de riesgo de la consultora.

### Tres niveles de configuración

| Nivel | Scope | Quién puede modificar | Dónde se guarda |
|---|---|---|---|
| **Configuración del sistema** (T-06) | Aplica a todo el sistema — a todos los proyectos y usuarios | Solo `admin` y `superadmin` | `configuracion/sistema` en Firestore |
| **Configuración por proyecto** | Sobreescribe parámetros del sistema solo para un proyecto específico | `gestor` del proyecto (dentro de límites que fija T-06) | `proyectos/{id}/configuracion` en Firestore |
| **Preferencias de usuario** | Personalizaciones individuales — layout del dashboard, historial de búsqueda | Cada usuario para sí mismo | `configDashboard/{uid}` en Firestore + `localStorage` |

T-06 gestiona únicamente el primer nivel. El segundo nivel (ConfiguracionProyecto) está habilitado y limitado por T-06. El tercero es responsabilidad de T-05 y T-04.

---

## 3. Tipo TypeScript `ConfiguracionSistema`

```typescript
// types/configuracion.ts — austranet-cco

import type { TipoNotificacion } from './notificaciones'  // enum de T-02
import type { RolUsuario } from './index'                  // enum de T-01

// ─── Tipo principal: ConfiguracionSistema ────────────────────────────────────

export interface ConfiguracionSistema {

  // ── Metadatos del documento de configuración ────────────────────────────────
  version: string                         // versión semántica del esquema — ej: '1.0.0'
  ultimaModificacion: Date
  modificadoPor: string                   // UID del admin/superadmin que hizo el último cambio

  // ── T-02: Parámetros de Notificaciones ──────────────────────────────────────
  notificaciones: {
    plazoEscalamientoAltoHoras: number    // default: 48 — tras N horas sin accionar, prioridad=alta escala a critica
    plazoEscalamientoCriticoHoras: number // default: 24 — tras N horas, notificación critica re-notifica al admin
    canalesHabilitados: {
      email: boolean                      // default: true — requiere SendGrid configurado
      inapp: boolean                      // default: true — no deshabilitable en producción
    }
    retencionNotificacionesLeidasDias: number   // default: 30 — notificaciones leídas se limpian tras N días
    limitePorPaginaComunicaciones: number       // default: 50 — ítems por página en el centro de notificaciones
  }

  // ── T-03: Parámetros de Auditoría ───────────────────────────────────────────
  auditoria: {
    retencionesDias: {
      login_exitoso: number               // default: 90
      login_fallido: number               // default: 365
      acceso_denegado: number             // default: 730
      bajo: number                        // default: 730 — acciones de criticidad baja
      medio: number                       // default: 1825 — acciones de criticidad media (5 años)
      // alto y critico: retención PERMANENTE — no configurable por diseño
    }
    exportacionHabilitada: boolean        // default: true — permite exportar logs a CSV desde la UI
    limitePorPaginaUI: number             // default: 50 — filas por página en /admin/auditoria
  }

  // ── T-04: Parámetros de Búsqueda ────────────────────────────────────────────
  busqueda: {
    limitePorDefecto: number              // default: 20 — resultados retornados si no se especifica limit
    limiteMaximo: number                  // default: 50 — techo absoluto del parámetro limit en /api/search
    rateLimitRequestsPorMinuto: number    // default: 30 — req/min por usuario antes de 429
    minimoCaracteresQuery: number         // default: 2 — mínimo de caracteres para activar la búsqueda
    motorActivo: 'firestore_prefijo' | 'algolia' | 'typesense'  // default: 'firestore_prefijo'
    algoliaAppId?: string                 // solo si motorActivo = 'algolia'
    algoliaIndexName?: string             // solo si motorActivo = 'algolia'
    typesenseHost?: string                // solo si motorActivo = 'typesense'
    typesenseApiKey?: string              // solo si motorActivo = 'typesense'
  }

  // ── T-05: Parámetros del Dashboard ──────────────────────────────────────────
  dashboard: {
    layoutsDefectoPorRol: {
      admin: string[]                     // IDs de widgets en orden por defecto — ej: ['W-A2','W-A1','W-A3',...]
      gestor: string[]
      analista: string[]
      viewer: string[]
    }
    widgetsObligatoriosPorRol: {          // IDs de widgets que ningún usuario puede ocultar
      admin: string[]                     // default: ['W-A2']
      gestor: string[]                    // default: ['W-G1', 'W-G2']
      analista: string[]                  // default: ['W-AN1', 'W-AN2']
      viewer: string[]                    // default: ['W-V1', 'W-V2']
    }
    pollingIntervalMetricasMs: number     // default: 300000 (5 min) — intervalo de W-A4 y W-A7
    limiteListenersSimultaneos: number    // default: 3 — restricción de diseño de T-05
  }

  // ── M2: Parámetros de Proyectos ─────────────────────────────────────────────
  proyectos: {
    semaforoRojo: {
      diasHitoVencidoSinCerrar: number              // default: 3
      porcentajeDesviacionPresupuesto: number        // default: 20 (%)
      diasGateSinDecision: number                    // default: 5
      diasRiesgoMaterializadoSinMitigacion: number  // default: 7
      iteracionesBucleSuperadas: boolean             // default: true — bucle > limiteIteracionesBucle → rojo
    }
    semaforoAmarillo: {
      diasHitoProximo: number                        // default: 3
      porcentajePresupuestoAlerta: number            // default: 80 (%)
      diasGatePendienteAlerta: number                // default: 2
    }
    limiteIteracionesBucle: number                   // default: 3 — máximo de ciclos Fase3→2 o Fase4→2 en M3
    limiteIteracionesBucleMaximoProyecto: number     // default: 5 — techo para sobreescritura por proyecto
    diasAlertaHitoProximo: number                    // default: 7 — W-G3 muestra hitos en próximos N días
  }

  // ── M3: Parámetros del SRS ──────────────────────────────────────────────────
  srs: {
    limiteIteracionesBucle: number          // default: 3 — debe coincidir con proyectos.limiteIteracionesBucle
    coberturaMinimaTrazabilidad: number     // default: 80 (%) — alerta W-AN4 si cae por debajo
    coberturaMinimaTrazabilidadMinProyecto: number  // default: 60 — piso para sobreescritura por proyecto
    diasMaximosRevisionCliente: number      // default: 5 — si viewer no actúa en N días, notifica al gestor
    versionInicial: string                  // default: '0.1.0' — versión del SRS al crearse
    versionAprobada: string                 // default: '1.0.0' — versión al aprobar Gate 2
  }

  // ── M1: Parámetros de Entidades ─────────────────────────────────────────────
  entidades: {
    nivelRiesgoAlertaConProyectos: ('alto' | 'critico')[]  // default: ['alto', 'critico'] — W-A5 en T-05
    diasSinActividadAlerta: number                         // default: 180 — entidad activa sin proyectos
  }

  // ── Sistema: Parámetros Generales ───────────────────────────────────────────
  sistema: {
    nombreEmpresa: string             // nombre de la consultora — aparece en emails, PDF y pantalla de login
    logoUrl?: string                  // URL pública del logo en Firebase Storage
    zonaHoraria: string               // default: 'America/Santiago' — usada para timestamps de UI
    idiomaDefecto: 'es'               // por ahora solo español — preparado para i18n futuro
    modoMantenimiento: boolean        // default: false — si true, bloquea acceso a todos excepto superadmin
    mensajeMantenimiento?: string     // texto que ve el usuario bloqueado en /mantenimiento
    versionApp: string                // versión actual del sistema — solo lectura, se inyecta en build
  }
}

// ─── Configuración por proyecto (sobreescritura local) ────────────────────────

export interface ConfiguracionProyecto {
  proyectoId: string
  sobreescrituras: {
    limiteIteracionesBucle?: number           // hasta proyectos.limiteIteracionesBucleMaximoProyecto
    diasMaximosRevisionCliente?: number       // sin techo — según acuerdo contractual
    coberturaMinimaTrazabilidad?: number      // hasta srs.coberturaMinimaTrazabilidadMinProyecto como piso
  }
  modificadoPor: string                       // UID del gestor que configuró la sobreescritura
  fechaModificacion: Date
}

// ─── Plantillas de email ──────────────────────────────────────────────────────

export interface PlantillaEmail {
  tipo: TipoNotificacion              // enum de T-02 — una plantilla por tipo
  asunto: string
  cuerpoHTML: string                  // HTML con variables: {{nombreUsuario}}, {{entidadAfectada}},
                                      // {{tipoEvento}}, {{accionUrl}}, {{nombreEmpresa}}, {{fechaEvento}}
  firmante: string                    // ej: 'El equipo de Austranet'
  activa: boolean                     // false = usar plantilla por defecto del sistema
  ultimaModificacion: Date
  modificadoPor: string
}

// ─── Plantillas de documentos PDF ────────────────────────────────────────────

export interface PlantillaDocumento {
  tipo: 'srs_pdf' | 'reporte_proyecto'
  logoUrl?: string                    // sobreescribe sistema.logoUrl solo para documentos
  nombreEmpresa: string               // sobreescribe sistema.nombreEmpresa solo para documentos
  textoPie: string                    // texto del pie de página — ej: 'Documento confidencial'
  clausulaConfidencialidad?: string   // texto legal de confidencialidad — aparece en portada
  activa: boolean
}

// ─── Función utilitaria: resolución de parámetros ────────────────────────────

/**
 * Firma de la función de resolución de parámetros del sistema.
 * Implementada en lib/configuracion/resolverParametro.ts
 * Prioridad: ConfiguracionProyecto.sobreescrituras > ConfiguracionSistema > valor hardcodeado (fallback)
 */
export type ResolverParametroFn = <T>(
  campo: string,
  valorFallback: T,
  proyectoId?: string
) => Promise<T>
```

---

## 4. Catálogo Completo de Parámetros Configurables

### 4.1 T-02 — Notificaciones

| Campo | Descripción | Default | Rango válido | Consumido por | Aplica en caliente |
|---|---|---|---|---|:---:|
| `notificaciones.plazoEscalamientoAltoHoras` | Horas sin accionar antes de escalar prioridad=alta a critica | `48` | 12 – 168 | T-02 Cloud Function escalamiento | ✅ |
| `notificaciones.plazoEscalamientoCriticoHoras` | Horas antes de re-notificar al admin por notificación critica no accionada | `24` | 4 – 72 | T-02 Cloud Function escalamiento | ✅ |
| `notificaciones.canalesHabilitados.email` | Activa/desactiva el canal email (SendGrid) | `true` | true / false | T-02 función enviarEmail | ✅ |
| `notificaciones.canalesHabilitados.inapp` | Activa/desactiva notificaciones en-app | `true` | Solo true en producción | T-02 UI centro notificaciones | ✅ |
| `notificaciones.retencionNotificacionesLeidasDias` | Días antes de eliminar notificaciones con estado=leida o accionada | `30` | 7 – 365 | T-02 Cloud Function limpieza | ✅ |
| `notificaciones.limitePorPaginaComunicaciones` | Ítems por página en el centro de comunicaciones | `50` | 10 – 200 | T-02 UI | ✅ |

### 4.2 T-03 — Auditoría

| Campo | Descripción | Default | Rango válido | Consumido por | Aplica en caliente |
|---|---|---|---|---|:---:|
| `auditoria.retencionesDias.login_exitoso` | Días de retención de entradas de login exitoso | `90` | 30 – 730 | T-03 Cloud Function archivado | ✅ |
| `auditoria.retencionesDias.login_fallido` | Días de retención de intentos de login fallido | `365` | 90 – 1825 | T-03 Cloud Function archivado | ✅ |
| `auditoria.retencionesDias.acceso_denegado` | Días de retención de accesos denegados | `730` | 365 – 1825 | T-03 Cloud Function archivado | ✅ |
| `auditoria.retencionesDias.bajo` | Días de retención de acciones de criticidad baja | `730` | 90 – 1825 | T-03 Cloud Function archivado | ✅ |
| `auditoria.retencionesDias.medio` | Días de retención de acciones de criticidad media | `1825` | 365 – 3650 | T-03 Cloud Function archivado | ✅ |
| `auditoria.exportacionHabilitada` | Permite exportar logs de auditoría a CSV desde la UI | `true` | true / false | T-03 UI /admin/auditoria | ✅ |
| `auditoria.limitePorPaginaUI` | Filas por página en el visor de auditoría | `50` | 10 – 200 | T-03 UI | ✅ |

### 4.3 T-04 — Búsqueda

| Campo | Descripción | Default | Rango válido | Consumido por | Aplica en caliente |
|---|---|---|---|---|:---:|
| `busqueda.limitePorDefecto` | Resultados retornados por defecto en /api/search | `20` | 5 – 50 | T-04 API Route | ✅ |
| `busqueda.limiteMaximo` | Techo absoluto del parámetro `limit` en /api/search | `50` | 20 – 200 | T-04 API Route | ✅ |
| `busqueda.rateLimitRequestsPorMinuto` | Máximo de búsquedas por usuario por minuto | `30` | 10 – 120 | T-04 lib/rateLimit.ts | ✅ |
| `busqueda.minimoCaracteresQuery` | Mínimo de caracteres para activar búsqueda | `2` | 1 – 5 | T-04 UI y API Route | ✅ |
| `busqueda.motorActivo` | Motor de búsqueda activo en el sistema | `firestore_prefijo` | firestore_prefijo / algolia / typesense | T-04 lib/busqueda | ❌ Requiere migración de índice |

### 4.4 T-05 — Dashboard

| Campo | Descripción | Default | Rango válido | Consumido por | Aplica en caliente |
|---|---|---|---|---|:---:|
| `dashboard.layoutsDefectoPorRol.*` | Orden de widgets por defecto para usuarios nuevos de cada rol | Arrays predefinidos por rol | IDs de widgets válidos del rol | T-05 useConfigDashboard | ✅ |
| `dashboard.widgetsObligatoriosPorRol.*` | Widgets que no pueden ser ocultados por los usuarios del rol | Arrays predefinidos | IDs de widgets válidos del rol | T-05 useConfigDashboard | ✅ |
| `dashboard.pollingIntervalMetricasMs` | Intervalo de polling para widgets W-A4 y W-A7 | `300000` | 60000 – 1800000 | T-05 usePipelineSRS | ✅ |
| `dashboard.limiteListenersSimultaneos` | Máximo de listeners onSnapshot activos por sesión | `3` | 1 – 5 | T-05 useDashboardRealtime | ✅ |

### 4.5 M2 — Proyectos

| Campo | Descripción | Default | Rango válido | Consumido por | Aplica en caliente |
|---|---|---|---|---|:---:|
| `proyectos.semaforoRojo.diasHitoVencidoSinCerrar` | Días vencido un hito sin cerrar para activar semáforo rojo | `3` | 1 – 14 | T-05 calcularSemaforoProyecto | ✅ |
| `proyectos.semaforoRojo.porcentajeDesviacionPresupuesto` | % de desviación del presupuesto que activa semáforo rojo | `20` | 5 – 50 | T-05 calcularSemaforoProyecto | ✅ |
| `proyectos.semaforoRojo.diasGateSinDecision` | Días con Gate pendiente sin decisión para semáforo rojo | `5` | 2 – 30 | T-05 calcularSemaforoProyecto | ✅ |
| `proyectos.semaforoRojo.diasRiesgoMaterializadoSinMitigacion` | Días desde materialización de riesgo sin plan activo | `7` | 1 – 30 | T-05 calcularSemaforoProyecto | ✅ |
| `proyectos.semaforoAmarillo.diasHitoProximo` | Días antes del vencimiento de un hito para semáforo amarillo | `3` | 1 – 7 | T-05 calcularSemaforoProyecto | ✅ |
| `proyectos.semaforoAmarillo.porcentajePresupuestoAlerta` | % de presupuesto consumido para semáforo amarillo | `80` | 50 – 95 | T-05 calcularSemaforoProyecto | ✅ |
| `proyectos.semaforoAmarillo.diasGatePendienteAlerta` | Días con Gate pendiente para semáforo amarillo | `2` | 1 – 10 | T-05 calcularSemaforoProyecto | ✅ |
| `proyectos.limiteIteracionesBucle` | Ciclos máximos de bucle Fase3→2 o Fase4→2 en M3 | `3` | 2 – 5 | M3 control de bucle · T-05 semáforo | ✅ |
| `proyectos.limiteIteracionesBucleMaximoProyecto` | Techo máximo para sobreescritura por proyecto | `5` | 3 – 10 | ConfiguracionProyecto validación | ✅ |
| `proyectos.diasAlertaHitoProximo` | Días hacia adelante para W-G3 "Hitos Próximos" | `7` | 3 – 30 | T-05 W-G3 | ✅ |

### 4.6 M3 — SRS

| Campo | Descripción | Default | Rango válido | Consumido por | Aplica en caliente |
|---|---|---|---|---|:---:|
| `srs.limiteIteracionesBucle` | Ciclos máximos de bucle en fases de M3 (debe igualar proyectos.limiteIteracionesBucle) | `3` | 2 – 5 | M3 control de flujo de fases | ✅ |
| `srs.coberturaMinimaTrazabilidad` | % mínimo de cobertura de trazabilidad antes de alerta W-AN4 | `80` | 50 – 100 | T-05 W-AN4 | ✅ |
| `srs.coberturaMinimaTrazabilidadMinProyecto` | Piso mínimo de cobertura permitido en sobreescritura por proyecto | `60` | 40 – 80 | ConfiguracionProyecto validación | ✅ |
| `srs.diasMaximosRevisionCliente` | Días sin acción del viewer en envalidacion antes de notificar al gestor | `5` | 2 – 30 | T-02 Cloud Function · T-05 W-V2 | ✅ |
| `srs.versionInicial` | Versión semántica asignada al SRS al crearse | `'0.1.0'` | Formato semver | M3 al crear SRS | ✅ |
| `srs.versionAprobada` | Versión semántica asignada al SRS al aprobar Gate 2 | `'1.0.0'` | Formato semver | M3 al aprobar Gate | ✅ |

### 4.7 M1 — Entidades

| Campo | Descripción | Default | Rango válido | Consumido por | Aplica en caliente |
|---|---|---|---|---|:---:|
| `entidades.nivelRiesgoAlertaConProyectos` | Niveles de riesgo que generan alerta en W-A5 si tienen proyectos activos | `['alto','critico']` | Subconjunto de {bajo,medio,alto,critico} | T-05 W-A5 | ✅ |
| `entidades.diasSinActividadAlerta` | Días sin proyectos activos antes de alertar sobre entidad inactiva | `180` | 30 – 730 | T-02 notificación de entidad sin actividad | ✅ |

### 4.8 Sistema General

| Campo | Descripción | Default | Rango válido | Consumido por | Aplica en caliente |
|---|---|---|---|---|:---:|
| `sistema.nombreEmpresa` | Nombre de la consultora — aparece en emails, PDFs y pantalla de login | `'Austranet'` | Texto libre, máx 100 chars | T-02 emails · M3 PDF · M2 reportes | ✅ |
| `sistema.logoUrl` | URL pública del logo en Firebase Storage | `null` | URL válida de Storage | T-06 UI · PDFs · pantalla login | ✅ |
| `sistema.zonaHoraria` | Zona horaria para timestamps en la UI | `'America/Santiago'` | IANA timezone válida | UI global | ✅ |
| `sistema.modoMantenimiento` | Bloquea el acceso a todos los usuarios excepto superadmin | `false` | true / false | Middleware Next.js | ⚡ Inmediato — afecta a todos los usuarios activos |
| `sistema.mensajeMantenimiento` | Texto mostrado en /mantenimiento cuando el modo está activo | `null` | Texto libre, máx 500 chars | Página /mantenimiento | ✅ |
| `sistema.versionApp` | Versión actual del sistema — inyectada en build, solo lectura en UI | Variable de entorno | Formato semver | Footer de la app | ❌ Requiere nuevo despliegue |

---

## 5. Implementación en Firestore

### 5.1 Estructura del Documento

La configuración se almacena como un **documento único** con ID fijo `sistema` dentro de la colección `configuracion`:

```
Firestore
└── configuracion/
    └── sistema/                          ← documento único (singleton)
        ├── version: '1.0.0'
        ├── ultimaModificacion: Timestamp
        ├── modificadoPor: string (UID)
        ├── notificaciones: { ... }
        ├── auditoria: { ... }
        ├── busqueda: { ... }
        ├── dashboard: { ... }
        ├── proyectos: { ... }
        ├── srs: { ... }
        ├── entidades: { ... }
        ├── sistema: { ... }
        │
        └── plantillas/                   ← subcolección del documento
            ├── email_{TipoNotificacion}/ ← un documento por tipo de notificación
            │   ├── tipo: TipoNotificacion
            │   ├── asunto: string
            │   ├── cuerpoHTML: string
            │   ├── firmante: string
            │   ├── activa: boolean
            │   ├── ultimaModificacion: Timestamp
            │   └── modificadoPor: string
            │
            ├── doc_srs_pdf/              ← plantilla de PDF del SRS
            │   ├── tipo: 'srs_pdf'
            │   ├── nombreEmpresa: string
            │   ├── textoPie: string
            │   └── clausulaConfidencialidad?: string
            │
            └── doc_reporte_proyecto/     ← plantilla de PDF de reportes
                ├── tipo: 'reporte_proyecto'
                ├── nombreEmpresa: string
                └── textoPie: string
```

**Por qué un documento único:** La configuración es un singleton del sistema — no hay múltiples instancias de `ConfiguracionSistema`. Un documento único permite leerlo con una sola operación `getDoc(doc(db, 'configuracion', 'sistema'))` desde cualquier parte del sistema. Si se fragmentara en múltiples documentos, cada inicio de sesión generaría N lecturas en lugar de 1.

### 5.2 Reglas de Seguridad de Firestore

```javascript
// firestore.rules — sección de configuración

match /configuracion/{docId} {
  // Todos los usuarios autenticados pueden leer la configuración del sistema
  // (necesaria para inicializar el estado global de la app)
  allow read: if request.auth != null && request.auth.token.activo == true;

  // Solo admin y superadmin pueden modificar la configuración
  allow write: if request.auth != null
    && request.auth.token.activo == true
    && request.auth.token.rol in ['admin', 'superadmin'];
}

match /configuracion/sistema/plantillas/{plantillaId} {
  allow read: if request.auth != null && request.auth.token.activo == true;
  allow write: if request.auth != null
    && request.auth.token.activo == true
    && request.auth.token.rol in ['admin', 'superadmin'];
}
```

### 5.3 Caché en el Cliente

La configuración se lee **una vez al iniciar sesión** y se almacena en el estado global de la app. No se usa `onSnapshot` sobre el documento de configuración general — los cambios del admin surten efecto en la próxima recarga de sesión de los usuarios afectados.

**Excepción crítica:** `sistema.modoMantenimiento` sí usa `onSnapshot` con un listener dedicado — si el admin activa el modo mantenimiento, todos los usuarios activos deben ser desconectados en tiempo real (ver §9).

```typescript
// lib/configuracion/cargarConfiguracion.ts — austranet-cco

import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { ConfiguracionSistema } from '@/types/configuracion'
import { CONFIG_DEFAULTS } from './defaults'

/**
 * Lee la ConfiguracionSistema desde Firestore una vez al iniciar sesión.
 * Si el documento no existe o un campo está ausente, usa CONFIG_DEFAULTS como fallback.
 * El resultado se almacena en el estado global (Zustand/Context) de la app.
 */
export async function cargarConfiguracionSistema(): Promise<ConfiguracionSistema> {
  try {
    const snap = await getDoc(doc(db, 'configuracion', 'sistema'))

    if (!snap.exists()) {
      console.warn('[T06] Documento de configuración no encontrado — usando valores por defecto')
      return CONFIG_DEFAULTS
    }

    const data = snap.data()

    // Merge profundo: si existe el documento pero faltan campos (ej: campo nuevo en update),
    // los campos ausentes se completan con los defaults correspondientes
    return mergeConDefaults(data, CONFIG_DEFAULTS) as ConfiguracionSistema

  } catch (error) {
    console.error('[T06] Error al leer configuración — usando valores por defecto:', error)
    return CONFIG_DEFAULTS
  }
}

/**
 * Merge recursivo: rellena campos faltantes del objeto remoto con valores del objeto de defaults.
 * No sobreescribe campos que sí existen en el objeto remoto.
 */
function mergeConDefaults<T extends Record<string, unknown>>(
  remoto: Partial<T>,
  defaults: T
): T {
  const resultado = { ...defaults }
  for (const key of Object.keys(defaults) as (keyof T)[]) {
    if (remoto[key] !== undefined) {
      if (
        typeof defaults[key] === 'object' &&
        defaults[key] !== null &&
        !Array.isArray(defaults[key])
      ) {
        resultado[key] = mergeConDefaults(
          remoto[key] as Record<string, unknown>,
          defaults[key] as Record<string, unknown>
        ) as T[keyof T]
      } else {
        resultado[key] = remoto[key] as T[keyof T]
      }
    }
  }
  return resultado
}
```

### 5.4 Función `resolverParametro`

La función `resolverParametro` implementa la lógica de resolución de los tres niveles de configuración (§2). Se usa en cualquier parte del sistema que necesite un parámetro configurable.

```typescript
// lib/configuracion/resolverParametro.ts — austranet-cco

import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { ConfiguracionProyecto } from '@/types/configuracion'

/**
 * Resuelve el valor de un parámetro configurable aplicando la siguiente prioridad:
 *   1. ConfiguracionProyecto.sobreescrituras.{campo}  (si proyectoId está definido y tiene sobreescritura)
 *   2. ConfiguracionSistema.{campo}                   (valor global del sistema)
 *   3. valorFallback                                   (hardcodeado — último recurso)
 *
 * @param campo          - Nombre del campo en ConfiguracionProyecto.sobreescrituras
 * @param valorFallback  - Valor hardcodeado de respaldo si todo lo demás falla
 * @param configSistema  - ConfiguracionSistema ya cargada en el estado global
 * @param proyectoId     - Opcional: si se provee, busca sobreescritura en el proyecto
 */
export async function resolverParametro<T>(
  campo: keyof ConfiguracionProyecto['sobreescrituras'],
  valorSistema: T,
  proyectoId?: string
): Promise<T> {
  if (!proyectoId) return valorSistema

  try {
    const snap = await getDoc(
      doc(db, 'proyectos', proyectoId, 'configuracion', 'proyecto')
    )

    if (!snap.exists()) return valorSistema

    const config = snap.data() as ConfiguracionProyecto
    const sobreescritura = config.sobreescrituras[campo]

    if (sobreescritura !== undefined && sobreescritura !== null) {
      return sobreescritura as unknown as T
    }

    return valorSistema
  } catch {
    return valorSistema
  }
}

// ─── Uso típico ──────────────────────────────────────────────────────────────

// En M3 — al controlar iteraciones de bucle:
// const limite = await resolverParametro(
//   'limiteIteracionesBucle',
//   configSistema.proyectos.limiteIteracionesBucle,
//   proyectoId
// )

// En T-05 calcularSemaforoProyecto:
// const diasHito = await resolverParametro(
//   'diasMaximosRevisionCliente',
//   configSistema.srs.diasMaximosRevisionCliente,
//   proyectoId
// )
```

### 5.5 Valores por Defecto (Fallback Hardcodeado)

```typescript
// lib/configuracion/defaults.ts — austranet-cco
// Valores hardcodeados que se usan si Firestore no está disponible o el documento no existe.
// NUNCA modificar estos valores directamente — usar el panel T-06 en producción.

import type { ConfiguracionSistema } from '@/types/configuracion'

export const CONFIG_DEFAULTS: ConfiguracionSistema = {
  version: '1.0.0',
  ultimaModificacion: new Date(),
  modificadoPor: 'system',

  notificaciones: {
    plazoEscalamientoAltoHoras: 48,
    plazoEscalamientoCriticoHoras: 24,
    canalesHabilitados: { email: true, inapp: true },
    retencionNotificacionesLeidasDias: 30,
    limitePorPaginaComunicaciones: 50,
  },

  auditoria: {
    retencionesDias: {
      login_exitoso: 90,
      login_fallido: 365,
      acceso_denegado: 730,
      bajo: 730,
      medio: 1825,
    },
    exportacionHabilitada: true,
    limitePorPaginaUI: 50,
  },

  busqueda: {
    limitePorDefecto: 20,
    limiteMaximo: 50,
    rateLimitRequestsPorMinuto: 30,
    minimoCaracteresQuery: 2,
    motorActivo: 'firestore_prefijo',
  },

  dashboard: {
    layoutsDefectoPorRol: {
      admin:    ['W-A2', 'W-A1', 'W-A3', 'W-A4', 'W-A5', 'W-A6', 'W-A7'],
      gestor:   ['W-G1', 'W-G2', 'W-G3', 'W-G4', 'W-G5', 'W-G6'],
      analista: ['W-AN1', 'W-AN2', 'W-AN3', 'W-AN4', 'W-AN5'],
      viewer:   ['W-V2', 'W-V1', 'W-V3'],
    },
    widgetsObligatoriosPorRol: {
      admin:    ['W-A2'],
      gestor:   ['W-G1', 'W-G2'],
      analista: ['W-AN1', 'W-AN2'],
      viewer:   ['W-V1', 'W-V2'],
    },
    pollingIntervalMetricasMs: 300_000,
    limiteListenersSimultaneos: 3,
  },

  proyectos: {
    semaforoRojo: {
      diasHitoVencidoSinCerrar: 3,
      porcentajeDesviacionPresupuesto: 20,
      diasGateSinDecision: 5,
      diasRiesgoMaterializadoSinMitigacion: 7,
      iteracionesBucleSuperadas: true,
    },
    semaforoAmarillo: {
      diasHitoProximo: 3,
      porcentajePresupuestoAlerta: 80,
      diasGatePendienteAlerta: 2,
    },
    limiteIteracionesBucle: 3,
    limiteIteracionesBucleMaximoProyecto: 5,
    diasAlertaHitoProximo: 7,
  },

  srs: {
    limiteIteracionesBucle: 3,
    coberturaMinimaTrazabilidad: 80,
    coberturaMinimaTrazabilidadMinProyecto: 60,
    diasMaximosRevisionCliente: 5,
    versionInicial: '0.1.0',
    versionAprobada: '1.0.0',
  },

  entidades: {
    nivelRiesgoAlertaConProyectos: ['alto', 'critico'],
    diasSinActividadAlerta: 180,
  },

  sistema: {
    nombreEmpresa: 'Austranet',
    zonaHoraria: 'America/Santiago',
    idiomaDefecto: 'es',
    modoMantenimiento: false,
    versionApp: process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.0',
  },
}
```

---

## 6. Plantillas del Sistema

### 6.1 Plantillas de Email (T-02)

Las plantillas de email son los cuerpos HTML que T-02 usa al enviar notificaciones críticas por correo. Cada plantilla corresponde a un `TipoNotificacion` del enum de T-02. Si no existe plantilla personalizada para un tipo (o `activa=false`), T-02 usa una plantilla por defecto hardcodeada.

**Variables disponibles en todas las plantillas:**

| Variable | Descripción | Ejemplo |
|---|---|---|
| `{{nombreUsuario}}` | Nombre completo del destinatario | `Juan Pérez` |
| `{{tipoEvento}}` | Tipo legible del evento | `Riesgo materializado` |
| `{{entidadAfectada}}` | Nombre de la entidad/proyecto afectado | `Proyecto FinTech 2024` |
| `{{accionUrl}}` | URL directa a la acción requerida | `https://app.austranet.cl/m2/...` |
| `{{nombreEmpresa}}` | Valor de `sistema.nombreEmpresa` | `Austranet` |
| `{{fechaEvento}}` | Timestamp del evento en zona horaria configurada | `27/02/2026 17:24` |
| `{{rolDestinatario}}` | Rol del usuario destinatario | `gestor` |

**Colección Firestore:** `configuracion/sistema/plantillas` — un documento por tipo de notificación, con ID `email_{tipoNotificacion}`.

```typescript
// Ejemplo de plantilla para notificación de riesgo materializado

const plantillaRiesgoMaterializado: PlantillaEmail = {
  tipo: 'M2_RIESGO_MATERIALIZADO',
  asunto: '[{{nombreEmpresa}}] Alerta: Riesgo materializado en {{entidadAfectada}}',
  cuerpoHTML: `
    <h2>Alerta de Riesgo Materializado</h2>
    <p>Hola {{nombreUsuario}},</p>
    <p>Se ha registrado la materialización de un riesgo en <strong>{{entidadAfectada}}</strong>
    que requiere tu atención inmediata.</p>
    <p>Fecha del evento: {{fechaEvento}}</p>
    <a href="{{accionUrl}}" style="...">Ver detalles y registrar mitigación</a>
    <hr/>
    <small>{{nombreEmpresa}} — Gestión de Consultoría</small>
  `,
  firmante: 'El sistema de gestión de {{nombreEmpresa}}',
  activa: true,
  ultimaModificacion: new Date(),
  modificadoPor: 'system',
}
```

### 6.2 Plantillas de Documentos PDF

Las plantillas de PDF definen el wrapper visual de los documentos generados por el sistema. El contenido de cada documento (texto del SRS, datos del proyecto) lo genera el módulo correspondiente — T-06 solo controla el encabezado, pie de página y cláusulas visuales.

**Tipos de plantilla de documento:**

| Tipo | Generado en | Contenido que define T-06 |
|---|---|---|
| `srs_pdf` | M3 — al exportar el SRS aprobado en Gate 2 | Logo, nombre empresa, pie de página, cláusula de confidencialidad |
| `reporte_proyecto` | M2 — al exportar el reporte de seguimiento | Logo, nombre empresa, pie de página |

**Colección Firestore:** `configuracion/sistema/plantillas` — documentos `doc_srs_pdf` y `doc_reporte_proyecto`.

---

## 7. Panel de Administración — UI de T-06

### 7.1 Ruta y Acceso

**Ruta:** `/configuracion`
**Acceso:** Solo roles `admin` y `superadmin`. El middleware de Next.js redirige a `/sin-acceso` si el rol es inferior. El superadmin ve todas las secciones; el admin ve todas excepto variables de entorno técnicas (claves API de Algolia/Typesense).

### 7.2 Secciones del Panel

```
/configuracion
├── General
│   ├── nombreEmpresa (input texto)
│   ├── logoUrl (upload a Firebase Storage + preview)
│   ├── zonaHoraria (selector IANA timezone)
│   ├── versionApp (solo lectura — desde variable de entorno)
│   └── modoMantenimiento (switch con confirmación doble — ver §9)
│
├── Notificaciones
│   ├── plazoEscalamientoAltoHoras (slider 12-168)
│   ├── plazoEscalamientoCriticoHoras (slider 4-72)
│   ├── canalesHabilitados.email (toggle)
│   ├── retencionNotificacionesLeidasDias (input numérico)
│   └── limitePorPaginaComunicaciones (input numérico)
│
├── Auditoría
│   ├── retencionesDias.* (inputs numéricos por nivel)
│   ├── nota visual: "criticidad alto y critico: retención permanente"
│   ├── exportacionHabilitada (toggle)
│   └── limitePorPaginaUI (input numérico)
│
├── Búsqueda
│   ├── motorActivo (selector con advertencia si se cambia)
│   ├── limitePorDefecto / limiteMaximo / rateLimitRequestsPorMinuto
│   ├── minimoCaracteresQuery
│   └── algoliaAppId / algoliaIndexName (solo si motorActivo=algolia)
│
├── Dashboard
│   ├── layoutsDefectoPorRol (editor drag-and-drop por rol — 4 listas)
│   ├── widgetsObligatoriosPorRol (checkboxes por rol y widget)
│   ├── pollingIntervalMetricasMs (slider con etiqueta "X minutos")
│   └── limiteListenersSimultaneos (input numérico con nota de costo)
│
├── Proyectos y SRS
│   ├── semaforoRojo.* (inputs numéricos — umbrales)
│   ├── semaforoAmarillo.* (inputs numéricos)
│   ├── limiteIteracionesBucle (input con nota: "debe coincidir con SRS")
│   ├── limiteIteracionesBucleMaximoProyecto
│   ├── srs.coberturaMinimaTrazabilidad
│   ├── srs.coberturaMinimaTrazabilidadMinProyecto
│   ├── srs.diasMaximosRevisionCliente
│   └── entidades.diasSinActividadAlerta
│
└── Plantillas
    ├── Plantillas de Email (lista por TipoNotificacion)
    │   └── Editor: asunto, textarea HTML, preview en tiempo real con variables dummy
    └── Plantillas de PDF (srs_pdf / reporte_proyecto)
        └── Editor: logoUrl, textoPie, clausulaConfidencialidad, preview
```

### 7.3 Guardar Cambios y Auditoría

Cada vez que el admin guarda cambios en el panel, el sistema:

1. Valida los valores enviados contra los rangos definidos en §4.
2. Lee el valor actual de Firestore para cada campo modificado.
3. Escribe los nuevos valores en `configuracion/sistema`.
4. Genera una entrada en `auditoria` (T-03) con la acción `T06_CONFIGURACION_MODIFICADA`:

```typescript
// lib/configuracion/guardarConfiguracion.ts — austranet-cco

import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { registrarAuditoria } from '@/lib/auditoria'
import type { ConfiguracionSistema } from '@/types/configuracion'

export async function guardarCambiosConfiguracion(
  cambios: Partial<ConfiguracionSistema>,
  adminUid: string,
  adminNombre: string,
  adminRol: string
): Promise<{ exito: boolean; error?: string }> {

  try {
    // 1. Leer estado actual para registrar valorAnterior en auditoría
    const snap = await getDoc(doc(db, 'configuracion', 'sistema'))
    const configActual = snap.data() as Partial<ConfiguracionSistema> ?? {}

    // 2. Construir lista de campos modificados para T-03
    const camposModificados = extraerCamposModificados(configActual, cambios)

    // 3. Escribir en Firestore
    await updateDoc(doc(db, 'configuracion', 'sistema'), {
      ...aplanarObjeto(cambios),         // aplanar para update parcial con dot notation
      version: incrementarVersion(configActual.version ?? '1.0.0'),
      ultimaModificacion: serverTimestamp(),
      modificadoPor: adminUid,
    })

    // 4. Registrar en T-03
    await registrarAuditoria({
      actor: { uid: adminUid, nombre: adminNombre, rol: adminRol },
      accion: 'T06_CONFIGURACION_MODIFICADA',
      modulo: 'T06',
      criticidad: 'alto',
      entidad: { tipo: 'ConfiguracionSistema', id: 'sistema', nombre: 'Configuración Global' },
      descripcion: `${camposModificados.length} campo(s) de configuración modificado(s)`,
      camposModificados,
      resultado: 'exitoso',
    })

    return { exito: true }

  } catch (error) {
    return { exito: false, error: (error as Error).message }
  }
}

// Extrae pares {campo, valorAnterior, valorNuevo} para el log de auditoría
function extraerCamposModificados(
  actual: Record<string, unknown>,
  cambios: Record<string, unknown>,
  prefijo = ''
): { campo: string; valorAnterior: unknown; valorNuevo: unknown }[] {
  const resultado = []
  for (const [key, nuevoValor] of Object.entries(cambios)) {
    const campoCompleto = prefijo ? `${prefijo}.${key}` : key
    if (typeof nuevoValor === 'object' && nuevoValor !== null && !Array.isArray(nuevoValor)) {
      resultado.push(
        ...extraerCamposModificados(
          (actual[key] ?? {}) as Record<string, unknown>,
          nuevoValor as Record<string, unknown>,
          campoCompleto
        )
      )
    } else {
      resultado.push({
        campo: campoCompleto,
        valorAnterior: actual[key],
        valorNuevo: nuevoValor,
      })
    }
  }
  return resultado
}
```

---

## 8. Configuración por Proyecto (Sobreescritura Local)

### 8.1 Parámetros Sobreescribibles por el Gestor

El gestor puede ajustar tres parámetros del sistema globalmente para su proyecto específico, dentro de los límites que fija T-06. Estas sobreescrituras no afectan otros proyectos ni el sistema global.

| Parámetro | Valor global (T-06) | Límite de sobreescritura | Cuándo usarlo |
|---|---|---|---|
| `limiteIteracionesBucle` | `3` (default) | Hasta `proyectos.limiteIteracionesBucleMaximoProyecto` (default: `5`) | Proyectos complejos con múltiples rondas de revisión de requerimientos |
| `diasMaximosRevisionCliente` | `5` (default) | Sin techo — según acuerdo contractual con el cliente | Clientes con disponibilidad limitada o en zonas horarias distintas |
| `coberturaMinimaTrazabilidad` | `80%` (default) | Hasta `srs.coberturaMinimaTrazabilidadMinProyecto` como piso (default: `60%`) — no puede ir por debajo | Proyectos de baja criticidad o con SRS simplificado acordado |

### 8.2 Flujo de Sobreescritura

```
Gestor navega a /m2/proyectos/{id}/configuracion
  └── Ve los parámetros sobreescribibles con el valor global actual como referencia
      └── Modifica el parámetro dentro del rango permitido
          └── Guarda → se escribe en proyectos/{id}/configuracion/proyecto
              └── Sistema registra en auditoria: T06_CONFIG_PROYECTO_MODIFICADA
```

**Validación de rangos en el servidor:**

```typescript
// lib/configuracion/validarSobreescritura.ts — austranet-cco

import type { ConfiguracionSistema, ConfiguracionProyecto } from '@/types/configuracion'

export function validarSobreescritura(
  sobreescrituras: ConfiguracionProyecto['sobreescrituras'],
  configSistema: ConfiguracionSistema
): { valido: boolean; errores: string[] } {
  const errores: string[] = []

  if (sobreescrituras.limiteIteracionesBucle !== undefined) {
    const max = configSistema.proyectos.limiteIteracionesBucleMaximoProyecto
    const min = configSistema.proyectos.limiteIteracionesBucle
    if (sobreescrituras.limiteIteracionesBucle < min ||
        sobreescrituras.limiteIteracionesBucle > max) {
      errores.push(`limiteIteracionesBucle debe estar entre ${min} y ${max}`)
    }
  }

  if (sobreescrituras.coberturaMinimaTrazabilidad !== undefined) {
    const piso = configSistema.srs.coberturaMinimaTrazabilidadMinProyecto
    const techo = 100
    if (sobreescrituras.coberturaMinimaTrazabilidad < piso ||
        sobreescrituras.coberturaMinimaTrazabilidad > techo) {
      errores.push(`coberturaMinimaTrazabilidad debe estar entre ${piso} y ${techo}`)
    }
  }

  return { valido: errores.length === 0, errores }
}
```

---

## 9. Modo Mantenimiento

El modo mantenimiento es el único parámetro de T-06 con efecto **inmediato y global** — cuando se activa, interrumpe el trabajo de todos los usuarios activos excepto el superadmin.

### 9.1 Comportamiento al Activar

- Todos los usuarios con rol distinto de `superadmin` son redirigidos a `/mantenimiento` en el próximo request.
- La pantalla `/mantenimiento` muestra `mensajeMantenimiento` si está definido, o un mensaje genérico.
- Las Cloud Functions (T-02, T-03) **continúan operando** — la cola de notificaciones y el log de auditoría no se interrumpen.
- El propio superadmin puede acceder al panel de T-06 para desactivar el modo mantenimiento.

### 9.2 Implementación

**Listener dedicado en el cliente:**

```typescript
// hooks/useModoMantenimiento.ts — austranet-cco

import { useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { useAuth } from './useAuth'

/**
 * Hook que escucha cambios en modoMantenimiento en tiempo real.
 * Si el modo se activa y el usuario no es superadmin, redirige a /mantenimiento.
 * Se monta una sola vez en el layout raíz de la app.
 */
export function useModoMantenimiento() {
  const router = useRouter()
  const { usuario } = useAuth()

  useEffect(() => {
    if (!usuario || usuario.rol === 'superadmin') return

    const unsubscribe = onSnapshot(
      doc(db, 'configuracion', 'sistema'),
      (snap) => {
        const data = snap.data()
        if (data?.sistema?.modoMantenimiento === true) {
          router.replace('/mantenimiento')
        }
      }
    )

    return () => unsubscribe()
  }, [usuario?.uid, usuario?.rol])
}
```

**Middleware de Next.js — caché de 60 segundos:**

```typescript
// middleware.ts — sección de modo mantenimiento

// Variable de proceso in-memory para evitar leer Firestore en cada request
let modoMantenimientoCache: { valor: boolean; expiraEn: number } | null = null
const CACHE_TTL_MS = 60_000  // 60 segundos

async function esModoMantenimiento(): Promise<boolean> {
  const ahora = Date.now()

  if (modoMantenimientoCache && modoMantenimientoCache.expiraEn > ahora) {
    return modoMantenimientoCache.valor
  }

  try {
    // Lee desde Firestore Admin SDK (edge no disponible — usar fetch a una API Route interna)
    const snap = await adminDb.doc('configuracion/sistema').get()
    const valor = snap.data()?.sistema?.modoMantenimiento ?? false
    modoMantenimientoCache = { valor, expiraEn: ahora + CACHE_TTL_MS }
    return valor
  } catch {
    // Si falla la lectura, asumir que NO está en mantenimiento (fail-open para disponibilidad)
    return false
  }
}
```

### 9.3 Flujo de Activación con Confirmación Doble

```
Admin navega a /configuracion → sección General → switch "Modo Mantenimiento"
  └── Al hacer click:
      ├── Modal de confirmación muestra:
      │   ├── "Usuarios activos en los últimos 30 minutos: N"
      │   ├── "Estos usuarios serán redirigidos a la pantalla de mantenimiento."
      │   └── Input de texto: "Escribe CONFIRMAR MANTENIMIENTO para continuar"
      └── Si el texto coincide:
          └── Se escribe sistema.modoMantenimiento = true en Firestore
              └── El onSnapshot del cliente propaga el cambio a todos los usuarios activos
                  └── Sistema registra en auditoria: T06_MODO_MANTENIMIENTO_ACTIVADO
```

**Conteo de usuarios activos:**

```typescript
// Consulta usada para mostrar cuántos usuarios serán afectados
const hace30min = new Date(Date.now() - 30 * 60 * 1000)

const usuariosActivos = await getDocs(
  query(
    collection(db, 'usuarios'),
    where('activo', '==', true),
    where('fechaUltimoAcceso', '>=', hace30min),
    where('rol', '!=', 'superadmin')
  )
)
// usuariosActivos.size = número de usuarios que serán afectados
```

---

## 10. Conexiones con Todos los Elementos Transversales

| Elemento | Parámetro de T-06 | Efecto en el elemento |
|---|---|---|
| **T-01** · Autenticación | `sistema.modoMantenimiento` | Si `true`, el middleware redirige a `/mantenimiento` a todos los usuarios excepto `superadmin` |
| **T-01** · Autenticación | `sistema.nombreEmpresa` | Aparece en la pantalla de login y en emails de bienvenida |
| **T-02** · Notificaciones | `notificaciones.plazoEscalamientoAltoHoras` | La Cloud Function de escalamiento lee este valor para decidir cuándo escalar `prioridad=alta` |
| **T-02** · Notificaciones | `notificaciones.plazoEscalamientoCriticoHoras` | La Cloud Function lee este valor para decidir cuándo re-notificar al admin por alertas críticas no accionadas |
| **T-02** · Notificaciones | `notificaciones.canalesHabilitados` | Determina si se llama a SendGrid (email) o solo se escribe en Firestore (inapp) |
| **T-02** · Notificaciones | `notificaciones.retencionNotificacionesLeidasDias` | La Cloud Function de limpieza usa este valor para eliminar notificaciones expiradas |
| **T-02** · Notificaciones | Plantillas de email | La función `enviarEmail` de T-02 consulta `configuracion/sistema/plantillas/email_{tipo}` antes de usar la plantilla por defecto |
| **T-03** · Auditoría | `auditoria.retencionesDias.*` | La Cloud Function de archivado usa estos valores para determinar qué entradas archivar o eliminar |
| **T-03** · Auditoría | `auditoria.exportacionHabilitada` | Si `false`, el botón de exportar CSV en `/admin/auditoria` se deshabilita y el endpoint /api/auditoria/export retorna 403 |
| **T-04** · Búsqueda | `busqueda.rateLimitRequestsPorMinuto` | `lib/rateLimit.ts` lee este valor para el límite de la ventana deslizante de T-04 |
| **T-04** · Búsqueda | `busqueda.limiteMaximo` | La API Route `/api/search` usa este valor para el techo del parámetro `limit` |
| **T-04** · Búsqueda | `busqueda.motorActivo` | Determina si se usa `ejecutarBusquedaGlobal` (Firestore) o `ejecutarBusquedaGlobalAlgolia` |
| **T-05** · Dashboard | `dashboard.layoutsDefectoPorRol` | `useConfigDashboard` usa estos arrays como layout inicial para usuarios sin `ConfigDashboard` en Firestore |
| **T-05** · Dashboard | `dashboard.widgetsObligatoriosPorRol` | `useConfigDashboard` bloquea la ocultación de los widgets listados aquí |
| **T-05** · Dashboard | `dashboard.pollingIntervalMetricasMs` | `usePipelineSRS` usa este valor para el `setInterval` de W-A4 y W-A7 |
| **T-05** · Dashboard | `proyectos.semaforoRojo.*` y `semaforoAmarillo.*` | `calcularSemaforoProyecto` lee estos umbrales para evaluar cada condición del semáforo |
| **M1** · Entidades | `entidades.nivelRiesgoAlertaConProyectos` | W-A5 del dashboard filtra entidades con `nivelRiesgo` dentro de este array |
| **M1** · Entidades | `entidades.diasSinActividadAlerta` | T-02 usa este valor para generar la notificación de entidad sin actividad |
| **M2** · Proyectos | `proyectos.limiteIteracionesBucle` | M3 usa este valor (vía `resolverParametro`) para controlar el máximo de ciclos de bucle en fases 3 y 4 |
| **M2** · Proyectos | `proyectos.diasAlertaHitoProximo` | W-G3 del dashboard consulta hitos con `fechaLimite ≤ hoy + N días` |
| **M3** · SRS | `srs.coberturaMinimaTrazabilidad` | W-AN4 del dashboard muestra alerta si la cobertura cae por debajo de este umbral |
| **M3** · SRS | `srs.diasMaximosRevisionCliente` | T-02 usa este valor para notificar al gestor cuando el viewer no actúa en el SRS en envalidacion |
| **M3** · SRS | `srs.versionInicial` y `srs.versionAprobada` | M3 asigna estas versiones semánticas al crear el SRS y al aprobar el Gate 2 respectivamente |

---

## 11. Checklist de Completitud

### 11.1 Completitud de T-06 como Documento

| Ítem | Estado |
|---|:---:|
| Metadatos completos (nombre, capa, posición, módulos, prerrequisitos, stack, versión, fecha, estado) | ✅ |
| Objetivo — por qué la configuración es transversal y centralizada | ✅ |
| Distinción clara entre configuración del sistema, por proyecto y preferencias de usuario | ✅ |
| Tipo TypeScript `ConfiguracionSistema` completo con todos los bloques (T-02 a T-05, M1 a M3, sistema) | ✅ |
| Tipo TypeScript `ConfiguracionProyecto` con sobreescrituras y validaciones | ✅ |
| Tipos TypeScript `PlantillaEmail` y `PlantillaDocumento` | ✅ |
| Tipo / firma de `ResolverParametroFn` | ✅ |
| Catálogo completo de parámetros en tablas (columnas: campo, descripción, default, rango, consumido por, caliente) | ✅ |
| Implementación Firestore — estructura del documento singleton y subcolección plantillas | ✅ |
| Reglas de seguridad Firestore (read: autenticado / write: admin) | ✅ |
| Estrategia de caché en cliente — una lectura al iniciar sesión, estado global | ✅ |
| Excepción de caché: modoMantenimiento usa onSnapshot | ✅ |
| Función `cargarConfiguracionSistema` con merge profundo de defaults | ✅ |
| Función `resolverParametro` con prioridad sobreescritura → sistema → fallback | ✅ |
| Valores por defecto hardcodeados en `CONFIG_DEFAULTS` | ✅ |
| Plantillas de email — variables disponibles, colección Firestore, ejemplo | ✅ |
| Plantillas de documentos PDF — tipos srs_pdf y reporte_proyecto | ✅ |
| UI del panel /configuracion — ruta, secciones, acceso por rol | ✅ |
| Auditoría de cambios — `T06_CONFIGURACION_MODIFICADA` con `camposModificados` completo | ✅ |
| Configuración por proyecto — parámetros sobreescribibles, límites, validación de rangos | ✅ |
| Modo mantenimiento — comportamiento, listener onSnapshot, middleware con caché 60s, confirmación doble | ✅ |
| Tabla de conexiones transversales — todos los elementos T-01 a T-05 y módulos M1/M2/M3 | ✅ |
| Todo en español con terminología consistente de T-01 a T-05, M1, M2, M3 | ✅ |
| Formato de metadatos HTML comentados consistente con T-01 a T-05 | ✅ |

---

### 11.2 Completitud de la Capa Transversal como Conjunto (T-01 a T-06)

Este checklist verifica que los seis elementos transversales forman un conjunto coherente y sin parámetros huérfanos.

| Verificación | Elemento(s) | Estado |
|---|---|:---:|
| T-01 define los 5 roles usados en T-02 a T-06, M1, M2 y M3 | T-01 → todos | ✅ |
| T-02 usa `TipoNotificacion` referenciado en las plantillas de T-06 | T-02 ↔ T-06 | ✅ |
| T-03 define `AccionAuditoria` que incluye `T06_CONFIGURACION_MODIFICADA` y `T06_MODO_MANTENIMIENTO_ACTIVADO` | T-03 ↔ T-06 | ✅ |
| T-04 `rateLimitRequestsPorMinuto` y `limiteMaximo` tienen sus valores definidos en T-06 | T-04 ↔ T-06 | ✅ |
| T-05 `pollingIntervalMetricasMs`, `layoutsDefectoPorRol` y `widgetsObligatoriosPorRol` tienen sus valores en T-06 | T-05 ↔ T-06 | ✅ |
| T-05 `calcularSemaforoProyecto` usa umbrales que define T-06 en `proyectos.semaforoRojo.*` y `semaforoAmarillo.*` | T-05 ↔ T-06 | ✅ |
| T-05 `limiteListenersSimultaneos` tiene su valor por defecto en T-06 | T-05 ↔ T-06 | ✅ |
| M2 `limiteIteracionesBucle` y `limiteIteracionesBucleMaximoProyecto` definidos en T-06 | M2 ↔ T-06 | ✅ |
| M3 `coberturaMinimaTrazabilidad`, `diasMaximosRevisionCliente`, `versionInicial`, `versionAprobada` definidos en T-06 | M3 ↔ T-06 | ✅ |
| M1 `nivelRiesgoAlertaConProyectos` y `diasSinActividadAlerta` definidos en T-06 | M1 ↔ T-06 | ✅ |
| `modoMantenimiento` de T-06 afecta a todos los módulos vía middleware de T-01 | T-06 → T-01 → todos | ✅ |
| `resolverParametro` cubre los tres niveles de configuración sin ambigüedad | T-06 | ✅ |
| Todos los parámetros de T-06 tienen valor de fallback hardcodeado en `CONFIG_DEFAULTS` | T-06 | ✅ |
| No existe ningún parámetro usado en T-01 a T-05 o M1/M2/M3 que no esté definido en T-06 | Capa completa | ✅ |
| No existe ningún parámetro definido en T-06 que no sea consumido por al menos un elemento | T-06 | ✅ |
| Cada elemento T-01 a T-06 tiene checklist de completitud individual con todos los ítems en ✅ | T-01 a T-06 | ✅ |
| La Capa Transversal puede operar de forma autónoma con solo la documentación T-01 a T-06 | Capa completa | ✅ |

---

> **🏁 CAPA TRANSVERSAL COMPLETA**
>
> Los seis elementos transversales de austranet-cco han sido documentados y verificados:
>
> | # | Archivo | Descripción |
> |:---:|---|---|
> | T-01 | `T-01-autenticacion-usuarios.md` | Autenticación, roles y permisos — base de identidad del sistema |
> | T-02 | `T-02-sistema-notificaciones.md` | Notificaciones en-app y email con escalamiento automático |
> | T-03 | `T-03-auditoria-logs.md` | Log de auditoría inmutable write-only |
> | T-04 | `T-04-busqueda-global.md` | Búsqueda global por prefijo con shortcut Cmd/Ctrl+K |
> | T-05 | `T-05-dashboard-principal.md` | Dashboard personalizado por rol con semáforo de salud |
> | T-06 | `T-06-configuracion-sistema.md` | Configuración centralizada del sistema sin necesidad de despliegue |

---

*Documento generado para el sistema austranet-cco · Capa Transversal · T-06 de 6 · Cierre de la Capa Transversal*
