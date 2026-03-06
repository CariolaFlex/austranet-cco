<!-- ============================================================
  AUSTRANET-CCO — CAPA TRANSVERSAL
  Archivo:  Sprint-Capa-Transversal.md
  Ruta:     C:\Austranet\austranet-cco\docs\capa-transversal\Sprint-Capa-Transversal.md
  Objetivo: Implementar los 6 elementos transversales T-01 a T-06
  Sprint:   T-TRANSVERSAL (único sprint de implementación)
  Fecha:    2026-02-27
  Estado:   listo-para-ejecutar
  ============================================================ -->

# Sprint — Capa Transversal (T-01 a T-06)

> **Objetivo:** Implementar los 6 elementos transversales del sistema austranet-cco.
> Estos elementos son la infraestructura compartida que conecta M1, M2 y M3.
> La documentación fuente está en `docs/capa-transversal/`.
> **ANTES DE IMPLEMENTAR CUALQUIER TAREA:** Lee el código existente primero.
> El sistema ya tiene partes implementadas — tu trabajo es completar, no duplicar.

---

## CONTEXTO CRÍTICO — Estado actual del proyecto

El proyecto austranet-cco tiene M1, M2 y M3 **completamente implementados** con:

- `src/types/index.ts` — tipos extendidos incluyendo todos los de M3
- `src/services/` — entidades, proyectos, alcance, repositorio-configuracion
- `src/hooks/` — useEntidades, useProyectos, useAlcance
- `src/contexts/AuthContext.tsx` — autenticación Firebase con fallback email + migración automática a UID-based docs
- `src/services/usuarios.service.ts` — getById, crearDocumento, verificarYCrear
- `src/app/registro/page.tsx` — pantalla de registro completa (split-screen, indicador contraseña)
- `src/lib/firebase/firestore.ts` — helper `removeUndefined` recursivo
- `firebase.json`, `firestore.rules`, `firestore.indexes.json` — infraestructura desplegada

**Roles existentes:** `superadmin | admin | gestor | analista | viewer | tester`
**Stack confirmado:** Next.js 14.2.22 · TypeScript · Tailwind · shadcn/ui · Firebase Auth + Firestore · TanStack Query · Zustand · React Hook Form + Zod

**IMPORTANTE — Patrón Next.js 14:** Los dynamic routes usan `params` como objeto plano, NO como Promise.
```typescript
// CORRECTO (Next.js 14):
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params
}
// INCORRECTO (Next.js 15 — NO usar):
const params = use(params)
```

---

## INSTRUCCIÓN GENERAL PARA CLAUDE

1. **Lee el código existente antes de cada tarea.** Usa `Explore` y `Read` para entender qué ya existe.
2. **Verifica si cada archivo ya existe** antes de crearlo — puede haber stubs o implementaciones parciales.
3. **Si encuentras algo diferente a lo propuesto aquí, adáptate al código real.** Este sprint es una propuesta, no una orden rígida.
4. **Usa siempre `removeUndefined`** de `src/lib/firebase/firestore.ts` en cualquier escritura a Firestore.
5. **Sigue el patrón de hooks existente** (TanStack Query) de `useEntidades.ts` y `useProyectos.ts`.
6. **TypeScript strict:** corre `npx tsc --noEmit --skipLibCheck` al final de cada tarea grande.
7. **Al terminar el sprint completo:** entrega un resumen de qué se hizo, qué se ajustó respecto a la propuesta, y si hay acciones manuales pendientes en Firebase Console.

---

## ARQUITECTURA FIRESTORE — Capa Transversal

| Elemento | Colección Firestore | Patrón |
|---|---|---|
| T-01 Usuarios | `usuarios` (ya existe) | doc por UID |
| T-02 Notificaciones | `notificaciones` | top-level, por destinatarioId |
| T-03 Auditoría | `auditoria` | top-level, write-only, append-only |
| T-04 Búsqueda | No colección propia | API Route sobre colecciones existentes |
| T-05 Dashboard | `configuracion_dashboard` | doc por UID (preferencias personales) |
| T-06 Configuración | `configuracion` > doc `sistema` | singleton + subcolección `plantillas` |

---

## TAREA T-01 — Verificación y Completado de Autenticación

> **Fuente:** `docs/capa-transversal/T-01-autenticacion-usuarios.md`
> **Estado esperado:** PARCIALMENTE IMPLEMENTADO — verificar y completar gaps

### Lo que ya existe (NO reimplementar)
- `AuthContext.tsx` con Firebase Auth, fallback email, migración UID-based docs
- `src/services/usuarios.service.ts` con `getById`, `crearDocumento`, `verificarYCrear`
- Roles: `superadmin | admin | gestor | analista | viewer | tester` en `types/index.ts`
- Pantalla de registro `/registro/page.tsx`
- Login con Google con auto-creación de documento

### T-01-A: Verificar middleware de protección de rutas
**Archivo:** `src/middleware.ts`
- Verificar si existe. Si no existe, crear con protección de rutas `/dashboard/*` redirige a `/login` si no autenticado.
- Si existe, verificar que `/configuracion` esté protegido solo para `admin` y `superadmin`.
- Verificar que `/registro` sea pública (sin auth).
- **Adapta según lo que encuentres en el código real.**

### T-01-B: Panel de gestión de usuarios
**Ruta:** `/dashboard/admin/usuarios`
**Archivo:** `src/app/dashboard/admin/usuarios/page.tsx`
- Verificar si ya existe.
- Si no existe: crear página de lista de usuarios solo visible para `admin` y `superadmin`.
- Tabla con columnas: nombre, email, rol, empresa, cargo, activo, fechaCreacion.
- Acciones: cambiar rol (select), activar/desactivar (toggle), ver detalle.
- Usar `usuariosService` para operaciones.
- Agregar hook `useUsuarios()` en `src/hooks/useUsuarios.ts` si no existe — patrón TanStack Query como `useEntidades`.

### T-01-C: Verificar tipo Usuario en types/index.ts
- Confirmar que `Usuario` incluye: `uid`, `email`, `nombre`, `apellido?`, `rol`, `empresa?`, `cargo?`, `proyectosAsignados?`, `entidadesAcceso?`, `activo`, `fechaCreacion`, `fechaUltimoAcceso?`, `creadoPor?`.
- Agregar campos faltantes sin romper los existentes (todos opcionales con `?`).

---

## TAREA T-02 — Sistema de Notificaciones

> **Fuente:** `docs/capa-transversal/T-02-sistema-notificaciones.md`
> **Estado esperado:** NO IMPLEMENTADO

### T-02-A: Tipos y constantes
**Verificar en `src/types/index.ts`** si ya existe el tipo `Notificacion`. Si no:
```typescript
// Agregar a src/types/index.ts
export type TipoNotificacion = 
  | 'entidad_creada' | 'entidad_riesgo_alto' | 'entidad_sin_actividad'
  | 'proyecto_creado' | 'proyecto_estado_cambio' | 'proyecto_hito_proximo'
  | 'proyecto_hito_vencido' | 'proyecto_presupuesto_alerta' | 'proyecto_riesgo_materializado'
  | 'srs_creado' | 'srs_estado_cambio' | 'srs_gate1_pendiente' | 'srs_gate2_pendiente'
  | 'srs_observacion_agregada' | 'srs_bucle_limite'
  | 'usuario_creado' | 'usuario_rol_cambiado'
  | 'sistema_mantenimiento' | 'config_modificada'

export type CanalNotificacion = 'inapp' | 'email' | 'ambos'
export type PrioridadNotificacion = 'critica' | 'alta' | 'media' | 'baja'
export type EstadoNotificacion = 'pendiente' | 'leida' | 'archivada' | 'expirada'

export interface Notificacion {
  id: string
  tipo: TipoNotificacion
  canal: CanalNotificacion
  destinatarios: string[]        // UIDs
  titulo: string
  mensaje: string
  accionRequerida: boolean
  accionUrl?: string
  entidadRelacionada?: { id: string; tipo: 'entidad' | 'proyecto' | 'srs' | 'usuario'; nombre: string }
  modulo: 'M1' | 'M2' | 'M3' | 'T'
  estado: EstadoNotificacion
  fechaCreacion: Date
  prioridad: PrioridadNotificacion
  fechaExpiracion?: Date
  escaladaEl?: Date
}
```

**Crear `src/constants/notificaciones.ts`** con:
- `PRIORIDAD_NOTIFICACION_CONFIG` — colores y labels por prioridad
- `TIPO_NOTIFICACION_CONFIG` — label, módulo y canal por defecto para cada tipo

### T-02-B: Servicio de notificaciones
**Archivo:** `src/services/notificaciones.service.ts`
```
Métodos:
- crear(data: Omit<Notificacion, 'id' | 'fechaCreacion' | 'estado'>): Promise<string>
- getByDestinatario(uid: string, soloNoLeidas?: boolean): Promise<Notificacion[]>
- marcarLeida(notificacionId: string): Promise<void>
- marcarTodasLeidas(uid: string): Promise<void>
- archivar(notificacionId: string): Promise<void>
- getNoLeidasCount(uid: string): Promise<number>

Colección Firestore: 'notificaciones'
Índices necesarios: [destinatarios (array-contains), estado, fechaCreacion desc]
Usar removeUndefined en todas las escrituras.
```

### T-02-C: Hook de notificaciones
**Archivo:** `src/hooks/useNotificaciones.ts`
```
- useNotificaciones(uid: string) — onSnapshot en tiempo real para notificaciones del usuario
- useMutacionNotificacion() — marcarLeida, archivar, marcarTodasLeidas
Patrón: igual que useProyectos.ts con TanStack Query + invalidateQueries
```

### T-02-D: Widget de notificaciones (campana en navbar)
**Archivo:** `src/components/transversal/NotificacionesCampana.tsx`
- Ícono de campana con badge de contador de no leídas (máximo "99+").
- Al hacer click: dropdown/popover con lista de últimas 5 notificaciones.
- Cada notificación muestra: título, mensaje truncado, tiempo relativo, badge de prioridad.
- Botón "Ver todas" → `/dashboard/notificaciones`.
- Botón "Marcar todas como leídas".
- Usar `useNotificaciones(user.uid)` con `onSnapshot` para actualización en tiempo real.

### T-02-E: Página centro de comunicaciones
**Ruta:** `/dashboard/notificaciones`
**Archivo:** `src/app/dashboard/notificaciones/page.tsx`
- Lista paginada de todas las notificaciones del usuario.
- Filtros: por prioridad, por módulo, por estado (leídas/no leídas).
- Cada fila: click navega a `accionUrl` si existe y marca como leída.

### T-02-F: Integrar campana en DashboardLayout
- Verificar `src/components/layout/DashboardLayout.tsx`.
- Agregar `<NotificacionesCampana />` en el navbar del layout, junto al avatar del usuario.

---

## TAREA T-03 — Auditoría y Logs

> **Fuente:** `docs/capa-transversal/T-03-auditoria-logs.md`
> **Estado esperado:** NO IMPLEMENTADO

### T-03-A: Tipos
**Verificar en `src/types/index.ts`** si existen. Si no, agregar:
```typescript
export type AccionAuditoria =
  // Auth
  | 'LOGIN_EXITOSO' | 'LOGIN_FALLIDO' | 'LOGOUT' | 'ACCESO_DENEGADO'
  | 'REGISTRO_USUARIO' | 'ROL_CAMBIADO' | 'USUARIO_DESACTIVADO'
  // M1
  | 'ENTIDAD_CREADA' | 'ENTIDAD_EDITADA' | 'ENTIDAD_ELIMINADA'
  | 'STAKEHOLDER_CREADO' | 'GLOSARIO_ENTRADA_CREADA'
  // M2
  | 'PROYECTO_CREADO' | 'PROYECTO_ESTADO_CAMBIADO' | 'METODOLOGIA_ACORDADA'
  | 'HITO_CREADO' | 'RIESGO_CREADO' | 'SCR_CREADO' | 'SCR_AVANZADO'
  // M3
  | 'SRS_CREADO' | 'SRS_ESTADO_CAMBIADO' | 'GATE1_PROCESADO' | 'GATE2_APROBADO'
  | 'REQUERIMIENTO_CREADO' | 'REQUERIMIENTO_EDITADO' | 'BUCLE_REGISTRADO'
  // T
  | 'BUSQUEDA_GLOBAL' | 'CONFIG_MODIFICADA' | 'T06_CONFIGURACION_MODIFICADA'

export interface EntradaAuditoria {
  id: string                    // UUID inmutable — generado por el sistema
  timestamp: Date               // serverTimestamp de Firestore
  actor: {
    uid: string
    nombre: string
    rol: RolUsuario
    ip?: string
  }
  accion: AccionAuditoria
  modulo: 'M1' | 'M2' | 'M3' | 'T'
  entidad?: { id: string; tipo: string; nombre?: string }
  descripcion: string
  camposModificados?: Array<{ campo: string; valorAnterior: unknown; valorNuevo: unknown }>
  resultado: 'exito' | 'error' | 'bloqueado'
  motivoBloqueo?: string
}
```

### T-03-B: Servicio de auditoría
**Archivo:** `src/services/auditoria.service.ts`
```
REGLA CRÍTICA: write-only absolute. Ningún método puede editar ni eliminar entradas.

Métodos:
- registrar(entrada: Omit<EntradaAuditoria, 'id' | 'timestamp'>): Promise<void>
  → usa addDoc (nunca setDoc) + serverTimestamp() + crypto.randomUUID() para id
  → siempre envuelto en try/catch silencioso — nunca debe romper el flujo principal
- getByModulo(modulo, limite?: number): Promise<EntradaAuditoria[]>
- getByActor(uid, limite?: number): Promise<EntradaAuditoria[]>
- getByEntidad(entidadId): Promise<EntradaAuditoria[]>
- getByCriticidad(accion: AccionAuditoria[]): Promise<EntradaAuditoria[]>

Reglas Firestore para esta colección:
  allow read: if request.auth.token.rol in ['admin', 'superadmin'];
  allow create: if request.auth != null;
  allow update, delete: if false;  // write-only absoluto
```

### T-03-C: Integrar auditoría en servicios existentes
**Archivos a modificar:** `entidades.service.ts`, `proyectos.service.ts`, `alcance.service.ts`
- Agregar llamada a `auditoriaService.registrar()` en los métodos clave (create, update, estado changes, gates).
- El registro de auditoría debe ir **después** del write principal, en un `try/catch` propio para no bloquear si falla.
- No agregar en todos los métodos — priorizar las acciones del tipo `ENTIDAD_CREADA`, `PROYECTO_ESTADO_CAMBIADO`, `GATE1_PROCESADO`, `GATE2_APROBADO`, `SCR_AVANZADO`.

### T-03-D: Panel de auditoría
**Ruta:** `/dashboard/admin/auditoria`
**Archivo:** `src/app/dashboard/admin/auditoria/page.tsx`
- Solo visible para `admin` y `superadmin`.
- Tabla con columnas: timestamp, actor (nombre+rol), acción, módulo, entidad, resultado.
- Filtros: por módulo, por actor, por acción, por rango de fechas.
- Paginación de 50 registros por página.
- Botón "Exportar CSV" (genera y descarga CSV con los registros filtrados).
- Color de fila según resultado: éxito=normal, error=rojo suave, bloqueado=amarillo suave.

---

## TAREA T-04 — Búsqueda Global

> **Fuente:** `docs/capa-transversal/T-04-busqueda-global.md`
> **Estado esperado:** NO IMPLEMENTADO

### T-04-A: API Route de búsqueda
**Archivo:** `src/app/api/search/route.ts`
```typescript
// GET /api/search?q=texto&modulo=M1&limite=20
// Rate limit: verificar en headers o implementar con un contador simple en memoria

Lógica:
1. Validar query: mínimo 2 caracteres, máximo 100
2. Buscar en paralelo (Promise.all) en:
   - entidades: campo nombre_normalized (prefijo)
   - proyectos: campo nombre_normalized (prefijo)  
   - srs: campo titulo_normalized (prefijo)
   - requerimientos: campo descripcion_normalized (prefijo)
   - usuarios (solo admin/superadmin): campo nombre_normalized
3. Filtrar resultados por rol del usuario (verificar JWT claim o doc de Firestore)
4. Retornar array de ResultadoBusqueda ordenado por relevancia

interface ResultadoBusqueda {
  id: string
  tipo: 'entidad' | 'proyecto' | 'srs' | 'requerimiento' | 'usuario'
  modulo: 'M1' | 'M2' | 'M3' | 'T'
  titulo: string
  subtitulo?: string
  url: string
  relevancia: number
}
```

**NOTA:** Para que la búsqueda por prefijo funcione en Firestore, los campos `nombre_normalized` deben existir en los documentos. Verificar si ya existen. Si no, agregar la normalización en los servicios de create/update.

### T-04-B: Función de normalización
**Archivo:** `src/lib/utils/normalizar.ts` (verificar si ya existe)
```typescript
export function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')  // elimina acentos
    .trim()
}
```
Si ya existe una función similar, usar esa.

### T-04-C: Modal de búsqueda global (Cmd/Ctrl+K)
**Archivo:** `src/components/transversal/BusquedaGlobal.tsx`
- Modal que se abre con `Cmd+K` / `Ctrl+K` y con click en un ícono de lupa en el navbar.
- Input con debounce de 300ms.
- Muestra resultados agrupados por tipo (Entidades / Proyectos / SRS / Requerimientos).
- Cada resultado: click navega a la URL del resultado y cierra el modal.
- Estados: vacío (instrucciones), cargando (skeleton), sin resultados, resultados.
- Keyboard navigation: flechas arriba/abajo para mover selección, Enter para navegar.

### T-04-D: Integrar en DashboardLayout
- Agregar `<BusquedaGlobal />` en el navbar del layout.
- Agregar ícono de lupa clickable junto a la campana de notificaciones.
- Registrar el shortcut `Cmd/Ctrl+K` con un event listener global en el layout.

---

## TAREA T-05 — Dashboard Principal

> **Fuente:** `docs/capa-transversal/T-05-dashboard-principal.md`
> **Estado esperado:** VERIFICAR — puede haber dashboard placeholder

### T-05-A: Verificar estado actual del dashboard
- Leer `src/app/dashboard/page.tsx` — ¿qué hay actualmente?
- Si es un placeholder, reemplazarlo.
- Si ya hay lógica, extenderla respetando lo existente.

### T-05-B: Tipos de configuración del dashboard
**En `src/types/index.ts`**, agregar si no existen:
```typescript
export interface WidgetConfig {
  id: string
  visible: boolean
  orden: number
}

export interface ConfigDashboard {
  uid: string
  widgetsOcultos: string[]
  ordenPersonalizado: string[]
  actualizadoEl: Date
}
```

### T-05-C: Servicio y hook del dashboard
**Archivo:** `src/services/dashboard.service.ts`
```
- getConfig(uid): Promise<ConfigDashboard | null>
- saveConfig(uid, config): Promise<void>
- resetConfig(uid): Promise<void>
Colección: 'configuracion_dashboard', doc por uid
```

**Archivo:** `src/hooks/useDashboard.ts`
```
- useDashboardConfig(uid) — TanStack Query
- useGuardarDashboardConfig() — mutation
```

### T-05-D: Componentes de widgets
**Directorio:** `src/components/dashboard/`
Crear un widget por rol. Cada widget es un componente independiente que:
- Recibe sus datos via hook propio
- Tiene estado de loading (skeleton), error y datos
- Muestra badge de semáforo si aplica

**Widgets Admin (W-A1 a W-A7):**
- `WidgetResumenSistema.tsx` — 4 contadores (entidades, proyectos, SRS, usuarios) con `getCountFromServer`
- `WidgetAlertasCriticas.tsx` — notificaciones `accionRequerida=true, prioridad=critica` — onSnapshot
- `WidgetEstadoProyectos.tsx` — tabla de proyectos activos con semáforo
- `WidgetPipelineSRS.tsx` — conteo de SRS agrupado por estado
- `WidgetEntidadesRiesgo.tsx` — entidades con `nivelRiesgo in [alto, critico]`
- `WidgetActividadReciente.tsx` — últimas 10 entradas de auditoría críticas/altas
- `WidgetMetricasMejora.tsx` — últimos 5 proyectos completados + métricas GQM

**Widgets Gestor (W-G1 a W-G6):**
- `WidgetMisAccionesPendientes.tsx` — notificaciones del usuario con `accionRequerida=true`
- `WidgetMisProyectos.tsx` — proyectos del usuario (de `proyectosAsignados`)
- `WidgetHitosProximos.tsx` — hitos de sus proyectos en próximos 7 días
- `WidgetRiesgosMaterializados.tsx` — riesgos activos de sus proyectos
- `WidgetSRSEnProgreso.tsx` — SRS de sus proyectos con estado actual
- `WidgetAccesoRapido.tsx` — botones rápidos: nuevo proyecto, nuevo SRS, ver entidades

**Widgets Analista (W-AN1 a W-AN5):**
- `WidgetMisAccionesAnalista.tsx` — SRS asignados con acción pendiente
- `WidgetRequerimientosPendientes.tsx` — requerimientos sin cerrar
- `WidgetTrazabilidadCobertura.tsx` — % cobertura de trazabilidad por SRS
- `WidgetChecklistPendiente.tsx` — ítems del checklist 21 sin completar
- `WidgetActividadRecienteAnalista.tsx` — cambios recientes en sus SRS

**Widgets Viewer (W-V1 a W-V3):**
- `WidgetResumenViewer.tsx` — estado general de proyectos que puede ver
- `WidgetDocumentosViewer.tsx` — SRS aprobados accesibles
- `WidgetActividadViewer.tsx` — notificaciones informativas

### T-05-E: Semáforo de salud de proyectos
**Archivo:** `src/lib/dashboard/semaforoProyecto.ts`
```typescript
// Implementar función:
export function calcularSemaforoProyecto(proyecto: Proyecto, config?: ConfiguracionSistema): 'verde' | 'amarillo' | 'rojo'
// Lógica según T-05 sección 5: verifica hitos vencidos, presupuesto, gates pendientes, riesgos materializados
// Si ConfiguracionSistema no está disponible, usar umbrales hardcodeados por defecto
```

### T-05-F: Página principal del dashboard
**Archivo:** `src/app/dashboard/page.tsx`
- Leer el rol del usuario del AuthContext.
- Renderizar el layout correspondiente según rol.
- Layout: grid de widgets con drag para reordenar (si hay librería disponible) o grid estático.
- Widgets marcados como `accionable` y con ítems pendientes van primero.
- Botón "Personalizar" abre panel lateral donde el usuario puede ocultar/mostrar widgets opcionales.
- Máximo 3 listeners `onSnapshot` simultáneos — el resto usa `getDocs` al cargar.

---

## TAREA T-06 — Configuración del Sistema

> **Fuente:** `docs/capa-transversal/T-06-configuracion-sistema.md`
> **Estado esperado:** NO IMPLEMENTADO

### T-06-A: Tipos
**En `src/types/index.ts`**, agregar si no existen:
```typescript
export interface ConfiguracionSistema {
  version: string
  ultimaModificacion: Date
  modificadoPor: string
  notificaciones: {
    plazoEscalamientoAltoHoras: number          // default: 48
    plazoEscalamientoCriticoHoras: number       // default: 24
    canalesHabilitados: { email: boolean; inapp: boolean }
    retenciónNotificacionesLeídasDías: number   // default: 30
    limitePorPaginaCentroComunicaciones: number // default: 50
  }
  auditoria: {
    retencionesDias: { login_exitoso: number; login_fallido: number; acceso_denegado: number; bajo: number; medio: number }
    exportacionHabilitada: boolean
    limitePorPaginaUI: number
  }
  busqueda: {
    limitePorDefecto: number
    limiteMaximo: number
    rateLimitRequestsPorMinuto: number
    minimoCaracteresQuery: number
    motorActivo: 'firestore_prefijo' | 'algolia' | 'typesense'
  }
  dashboard: {
    layoutsDefectoPorRol: { admin: string[]; gestor: string[]; analista: string[]; viewer: string[] }
    widgetsObligatoriosPorRol: { admin: string[]; gestor: string[]; analista: string[]; viewer: string[] }
    pollingIntervalMetricasMs: number
    limiteListenersSimultaneos: number
  }
  proyectos: {
    semaforoRojo: { diasHitoVencidoSinCerrar: number; porcentajeDesviacionPresupuesto: number; diasGateSinDecision: number; diasRiesgoMaterializadoSinMitigacion: number }
    semaforoAmarillo: { diasHitoProximo: number; porcentajePresupuestoAlerta: number; diasGatePendienteAlerta: number }
    limiteIteracionesBucle: number
    diasAlertaHitoProximo: number
  }
  srs: {
    limiteIteracionesBucle: number
    coberturaMinimaTrazabilidad: number
    diasMaximosRevisionCliente: number
    versionInicial: string
    versionAprobada: string
  }
  entidades: {
    nivelRiesgoAlertaConProyectos: ('alto' | 'critico')[]
    diasSinActividadAlerta: number
  }
  sistema: {
    nombreEmpresa: string
    logoUrl?: string
    zonaHoraria: string
    idiomaDefecto: 'es'
    modoMantenimiento: boolean
    mensajeMantenimiento?: string
    versionApp: string
  }
}

export const CONFIG_SISTEMA_DEFAULTS: ConfiguracionSistema = {
  version: '1.0.0',
  ultimaModificacion: new Date(),
  modificadoPor: 'sistema',
  notificaciones: { plazoEscalamientoAltoHoras: 48, plazoEscalamientoCriticoHoras: 24, canalesHabilitados: { email: true, inapp: true }, retenciónNotificacionesLeídasDías: 30, limitePorPaginaCentroComunicaciones: 50 },
  auditoria: { retencionesDias: { login_exitoso: 90, login_fallido: 365, acceso_denegado: 730, bajo: 730, medio: 1825 }, exportacionHabilitada: true, limitePorPaginaUI: 50 },
  busqueda: { limitePorDefecto: 20, limiteMaximo: 50, rateLimitRequestsPorMinuto: 30, minimoCaracteresQuery: 2, motorActivo: 'firestore_prefijo' },
  dashboard: { layoutsDefectoPorRol: { admin: ['W-A2','W-A1','W-A3','W-A4','W-A5','W-A6','W-A7'], gestor: ['W-G1','W-G2','W-G3','W-G4','W-G5','W-G6'], analista: ['W-AN1','W-AN2','W-AN3','W-AN4','W-AN5'], viewer: ['W-V1','W-V2','W-V3'] }, widgetsObligatoriosPorRol: { admin: ['W-A2'], gestor: ['W-G1','W-G2'], analista: ['W-AN1','W-AN2'], viewer: ['W-V1','W-V2'] }, pollingIntervalMetricasMs: 300000, limiteListenersSimultaneos: 3 },
  proyectos: { semaforoRojo: { diasHitoVencidoSinCerrar: 3, porcentajeDesviacionPresupuesto: 20, diasGateSinDecision: 5, diasRiesgoMaterializadoSinMitigacion: 7 }, semaforoAmarillo: { diasHitoProximo: 3, porcentajePresupuestoAlerta: 80, diasGatePendienteAlerta: 2 }, limiteIteracionesBucle: 3, diasAlertaHitoProximo: 7 },
  srs: { limiteIteracionesBucle: 3, coberturaMinimaTrazabilidad: 80, diasMaximosRevisionCliente: 5, versionInicial: '0.1.0', versionAprobada: '1.0.0' },
  entidades: { nivelRiesgoAlertaConProyectos: ['alto', 'critico'], diasSinActividadAlerta: 180 },
  sistema: { nombreEmpresa: 'Austranet', logoUrl: undefined, zonaHoraria: 'America/Santiago', idiomaDefecto: 'es', modoMantenimiento: false, mensajeMantenimiento: undefined, versionApp: '1.0.0' }
}
```

### T-06-B: Función `getConfigValue`
**Archivo:** `src/lib/config/configuracion.ts`
```typescript
// Función que obtiene un valor de config con fallback a los defaults
export function getConfigValue<T>(
  config: ConfiguracionSistema | null,
  path: string,  // ej: 'proyectos.semaforoRojo.diasHitoVencidoSinCerrar'
  defaultValue: T
): T

// Función que resuelve un parámetro: primero busca en config del proyecto, luego en sistema
export async function resolverParametro<T>(
  campo: keyof ConfiguracionProyecto['sobreescrituras'],
  proyectoId?: string,
  configSistema?: ConfiguracionSistema | null
): Promise<T>
```

### T-06-C: Servicio de configuración
**Archivo:** `src/services/configuracion.service.ts`
- Verificar si ya existe — puede haber un `configuracion.service.ts` de organización.
- Si existe, extenderlo. Si no, crear nuevo.
```
Métodos:
- getSistema(): Promise<ConfiguracionSistema>  // getDoc(doc(db, 'configuracion', 'sistema'))
- updateSistema(campos, modificadoPor): Promise<void>  // merge: true + auditoría T06_CONFIGURACION_MODIFICADA
- initSistema(): Promise<void>  // crea el documento con CONFIG_SISTEMA_DEFAULTS si no existe

Modo mantenimiento especial:
- onModoMantenimientoChange(callback): Unsubscribe  // onSnapshot solo para el campo sistema.modoMantenimiento
```

### T-06-D: Context/Hook de configuración
**Archivo:** `src/contexts/ConfiguracionContext.tsx`
```typescript
// Context que:
// 1. Lee la configuración una vez al montar (getSistema)
// 2. La guarda en estado global
// 3. Expone onSnapshot SOLO para modoMantenimiento
// 4. Provee: config, loading, refreshConfig

// Hook:
export function useConfiguracion(): { config: ConfiguracionSistema; loading: boolean; refreshConfig: () => void }
```
- Agregar `<ConfiguracionProvider>` en `src/app/layout.tsx` o en el layout del dashboard.

### T-06-E: Middleware de modo mantenimiento
**En `src/middleware.ts`:**
- Si `config.sistema.modoMantenimiento === true` y el rol del usuario no es `superadmin`, redirigir a `/mantenimiento`.
- **NOTA:** El middleware de Next.js no puede hacer Firestore queries directamente. Implementar con una cookie `mantenimiento=true` que el servidor actualiza cuando cambia el flag, o simplemente manejar el redirect en el layout del dashboard leyendo el ConfiguracionContext.
- **Elige la solución más simple que se alinee con el código existente.**

### T-06-F: Página de modo mantenimiento
**Archivo:** `src/app/mantenimiento/page.tsx`
- Página pública que muestra el `mensajeMantenimiento` de la configuración.
- Diseño consistente con el login (misma paleta de colores).
- Si el usuario es `superadmin`, mostrar botón "Continuar al panel de administración".

### T-06-G: Panel de configuración del sistema
**Ruta:** `/dashboard/configuracion`
**Archivo:** `src/app/dashboard/configuracion/page.tsx`
- Solo accesible para `admin` y `superadmin`.
- Dividido en secciones (tabs o acordeones):
  1. **General** — nombreEmpresa, logoUrl, zonaHoraria, versionApp (read-only), modoMantenimiento (switch con confirmación doble).
  2. **Notificaciones** — plazos de escalamiento, canales, retención.
  3. **Auditoría** — períodos de retención, exportación.
  4. **Búsqueda** — motor activo, límites, rate limit.
  5. **Dashboard** — layouts por defecto por rol, widgets obligatorios, polling interval.
  6. **Proyectos y SRS** — umbrales del semáforo (T-05 usa estos), límite iteraciones, cobertura mínima trazabilidad.
- Cada sección tiene su propio botón "Guardar cambios".
- Cada save genera entrada de auditoría `T06_CONFIGURACION_MODIFICADA`.
- Formularios con React Hook Form + Zod.

---

## INTEGRACIÓN FINAL — Conectar todo

### INT-01: Agregar nuevas rutas al sidebar/navbar
**Verificar `src/components/layout/DashboardLayout.tsx` o archivo de navegación:**
- Agregar items de navegación según rol:
  - Admin/Superadmin: `Usuarios`, `Auditoría`, `Configuración` (en sección admin)
  - Todos: `Notificaciones` (visible en campana + link a centro de comunicaciones)

### INT-02: Inicializar configuración del sistema
**En `src/app/dashboard/layout.tsx` o en `ConfiguracionProvider`:**
- Al arrancar, llamar `configuracionService.initSistema()` una vez para asegurar que el documento existe con los defaults.

### INT-03: Agregar índices Firestore para las nuevas colecciones
**En `firestore.indexes.json`**, agregar índices para:
- `notificaciones`: [destinatarios (array-contains), estado, fechaCreacion DESC]
- `notificaciones`: [destinatarios (array-contains), prioridad, accionRequerida, fechaCreacion DESC]
- `auditoria`: [modulo, timestamp DESC]
- `auditoria`: [actor.uid, timestamp DESC]
- `auditoria`: [accion, timestamp DESC]

### INT-04: Actualizar firestore.rules
**En `firestore.rules`**, agregar reglas para las nuevas colecciones:
```
match /notificaciones/{docId} {
  allow read: if request.auth != null && request.auth.uid in resource.data.destinatarios;
  allow create: if request.auth != null;
  allow update: if request.auth != null && request.auth.uid in resource.data.destinatarios;
  allow delete: if false;
}
match /auditoria/{docId} {
  allow read: if request.auth != null && request.auth.token.rol in ['admin', 'superadmin'];
  allow create: if request.auth != null;
  allow update, delete: if false;
}
match /configuracion/{docId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && request.auth.token.rol in ['superadmin', 'admin'];
}
match /configuracion_dashboard/{uid} {
  allow read, write: if request.auth != null && request.auth.uid == uid;
}
```

### INT-05: Desplegar reglas e índices actualizados
```bash
firebase deploy --only firestore:rules,firestore:indexes
```
**Documenta al final del sprint si esto es necesario como acción manual.**

---

## ORDEN DE IMPLEMENTACIÓN RECOMENDADO

```
1. T-06-A/B/C/D (tipos + servicio + context de configuración) — base para todos
2. T-01-A/B/C (completar auth + gestión usuarios)
3. T-03-A/B (tipos + servicio de auditoría — sin UI por ahora)
4. T-02-A/B/C/D (notificaciones — servicio + widget campana)
5. T-04-A/B/C (búsqueda — API route + modal)
6. INT-01/02 (integrar campana + búsqueda en layout)
7. T-05-A/B/C/D/E/F (dashboard completo)
8. T-02-E (centro de comunicaciones — página completa)
9. T-03-C/D (integrar auditoría en servicios + panel admin)
10. T-06-E/F/G (mantenimiento + panel configuración)
11. INT-03/04/05 (índices + reglas + deploy)
```

---

## CHECKLIST DE COMPLETITUD FINAL

Al terminar el sprint, verificar:

- [ ] `npx tsc --noEmit --skipLibCheck` → 0 errores
- [ ] Campana de notificaciones visible en navbar
- [ ] Modal de búsqueda abre con Cmd/Ctrl+K
- [ ] Dashboard muestra widgets diferenciados por rol
- [ ] Panel `/dashboard/admin/usuarios` accesible solo para admin/superadmin
- [ ] Panel `/dashboard/admin/auditoria` accesible solo para admin/superadmin
- [ ] Panel `/dashboard/configuracion` accesible solo para admin/superadmin
- [ ] Modo mantenimiento redirige a usuarios no-superadmin
- [ ] `firestore.rules` actualizado con nuevas colecciones
- [ ] `firestore.indexes.json` actualizado con nuevos índices
- [ ] `removeUndefined` usado en todas las escrituras nuevas
- [ ] No se usa `use(params)` — patrón Next.js 14 confirmado en nuevas páginas
- [ ] Todas las rutas de admin protegidas por rol

---

## REPORTE FINAL ESPERADO

Al completar el sprint, Claude debe entregar:

1. **Resumen de archivos creados/modificados** (tabla: archivo | cambio | estado)
2. **Diferencias respecto a esta propuesta** (qué se adaptó y por qué)
3. **Acciones manuales requeridas en Firebase Console** (si aplica):
   - ¿Hay nuevos índices que desplegar?
   - ¿Las reglas de Firestore necesitan actualización?
   - ¿Algún proveedor de Auth necesita habilitarse?
4. **Estado de TypeScript:** confirmación de 0 errores
5. **Próximos pasos opcionales** (mejoras futuras fuera del scope del sprint)
