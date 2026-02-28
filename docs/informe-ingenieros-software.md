# Austranet CCO — Informe Técnico de Arquitectura y Desarrollo
**Audiencia:** Equipo de Ingeniería de Software
**Fecha:** 2026-02-27
**Versión del sistema:** 0.1.0
**Repositorio:** https://github.com/CariolaFlex/austranet-cco (privado)

---

## 1. VISIÓN GENERAL DEL SISTEMA

Austranet CCO (Centro de Control Operacional) es un sistema web de gestión integral de proyectos de software que digitaliza el ciclo completo desde el registro de clientes/proveedores hasta la especificación formal de requerimientos (SRS). Está construido sobre Next.js 14 con App Router, Firebase como backend-as-a-service y un stack moderno de librerías ReactJS.

### Objetivo de Negocio
Centralizar la gestión de tres dominios críticos en consultoras de software:
- **M1 – Entidades:** Registro y clasificación de clientes y proveedores con análisis de factibilidad comercial.
- **M2 – Proyectos:** Ciclo de vida completo de proyectos, selección de metodología y repositorio de configuración.
- **M3 – Alcance / SRS:** Proceso formal de ingeniería de requerimientos en 8 fases con trazabilidad completa.

---

## 2. STACK TECNOLÓGICO

| Capa | Tecnología | Versión | Rol |
|------|-----------|---------|-----|
| Framework | Next.js (App Router) | 14.2.22 | SSR, routing, layout groups |
| UI Library | React | 18.2.0 | Composición de componentes |
| Lenguaje | TypeScript | 5.3.3 | Tipado estático fuerte |
| Estilos | Tailwind CSS | 3.4.1 | Utility-first CSS |
| Componentes base | Radix UI + shadcn/ui | varios | Headless + estilizados |
| Animaciones | Framer Motion | 12.24.10 | Sidebar, transiciones |
| Estado cliente | Zustand | 4.5.0 | UI state, auth state |
| Estado servidor | TanStack Query v5 | 5.17.0 | Caché, sincronización, invalidación |
| Tablas | TanStack Table | 8.21.3 | Sorting, paginación, filtros |
| Formularios | React Hook Form | 7.50.0 | Validación en cliente |
| Validación | Zod | 3.25.76 | Schemas compartidos cliente/servidor |
| Backend | Firebase Firestore | 10.8.0 | Base de datos NoSQL |
| Auth | Firebase Auth | 10.8.0 | Autenticación |
| Charts | Recharts | 2.10.4 | Visualización de KPIs |
| Fechas | date-fns | 3.6.0 | Formato y cálculo de fechas |
| Íconos | Lucide React | 0.312.0 | Iconografía consistente |
| Toasts | Sonner | 2.0.7 | Notificaciones push in-app |
| IDs | uuid v4 | 13.0.0 | Generación de IDs para embeds |

---

## 3. ARQUITECTURA DEL PROYECTO

### 3.1 Estructura de Directorios

```
austranet-cco/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (dashboard)/            # Layout group protegido (AuthGuard)
│   │   │   ├── layout.tsx          # DashboardLayout (sidebar + header)
│   │   │   ├── dashboard/          # Página principal de KPIs
│   │   │   ├── entidades/          # M1: CRUD entidades
│   │   │   │   ├── page.tsx        # Lista con filtros
│   │   │   │   ├── nueva/page.tsx  # Formulario de creación (wizard 3 pasos)
│   │   │   │   └── [entidadId]/
│   │   │   │       ├── page.tsx    # Detalle con tabs
│   │   │   │       └── editar/     # Formulario de edición
│   │   │   ├── proyectos/          # M2: CRUD proyectos
│   │   │   │   ├── page.tsx        # Lista con semáforo
│   │   │   │   ├── nuevo/page.tsx  # Wizard 7 pasos
│   │   │   │   └── [proyectoId]/
│   │   │   │       ├── page.tsx    # Detalle con tabs
│   │   │   │       ├── editar/     # Edición
│   │   │   │       └── alcance/    # Enlace al SRS del proyecto
│   │   │   ├── alcance/            # M3: SRS workflow 8 fases
│   │   │   │   ├── page.tsx        # Lista de proyectos con SRS
│   │   │   │   └── [srsId]/        # Workflow completo
│   │   │   ├── configuracion/      # T-06: Configuración del sistema
│   │   │   ├── notificaciones/     # T-02: Centro de notificaciones
│   │   │   └── admin/              # Panel administrativo
│   │   │       ├── usuarios/       # Gestión de usuarios
│   │   │       └── auditoria/      # T-03: Logs de auditoría
│   │   ├── login/                  # Página de autenticación
│   │   └── mantenimiento/          # Modo mantenimiento
│   ├── components/
│   │   ├── layout/                 # Sidebar, Header, DashboardLayout
│   │   ├── common/                 # PageHeader, EmptyState (server components)
│   │   ├── entidades/              # 9 componentes M1
│   │   ├── proyectos/              # 12 componentes M2
│   │   ├── alcance/                # 9 componentes Fase1-Fase8 + SRSPage
│   │   ├── busqueda/               # BusquedaGlobal (command palette)
│   │   └── ui/                     # shadcn/ui + custom
│   ├── services/                   # Lógica de negocio + Firestore
│   │   ├── entidades.service.ts    # M1: 14 funciones + cálculos puros
│   │   ├── proyectos.service.ts    # M2: 15 funciones
│   │   ├── alcance.service.ts      # M3: 35+ funciones
│   │   ├── auditoria.service.ts    # T-03
│   │   ├── configuracion.service.ts
│   │   ├── dashboard.service.ts
│   │   ├── notificaciones.service.ts
│   │   ├── usuarios.service.ts
│   │   └── repositorio-configuracion.service.ts
│   ├── hooks/                      # TanStack Query wrappers
│   │   ├── useEntidades.ts         # 7 hooks M1
│   │   ├── useProyectos.ts         # 15 hooks M2
│   │   ├── useAlcance.ts           # 20+ hooks M3
│   │   ├── useGlosario.ts
│   │   ├── useNotificaciones.ts
│   │   └── useDashboard.ts
│   ├── store/                      # Zustand stores
│   │   ├── useUIStore.ts
│   │   ├── useAuthStore.ts
│   │   ├── useEntidadStore.ts
│   │   ├── useProyectoStore.ts
│   │   └── useAlcanceStore.ts
│   ├── types/
│   │   └── index.ts                # 1,374 líneas — todos los tipos
│   ├── constants/
│   │   ├── index.ts                # ROUTES, NAV_ITEMS, configs de estado
│   │   ├── alcance.ts              # M3 constants (palabras alerta, vocabulario)
│   │   └── proyectos.ts            # M2 constants (metodologías, riesgos)
│   ├── lib/
│   │   ├── firebase/               # config, auth, firestore helpers
│   │   ├── validations/            # Zod schemas por módulo
│   │   ├── dashboard/              # semaforoProyecto.ts
│   │   ├── metodologia/            # arbolDecision.ts, efectosCascada.ts
│   │   ├── config/                 # configuracion.ts (thresholds)
│   │   └── utils.ts
│   └── contexts/
│       └── AuthContext.tsx         # Firebase Auth provider
├── firestore.rules                 # Reglas de seguridad Firestore
├── firestore.indexes.json          # Índices compuestos
├── firebase.json                   # Configuración Firebase CLI
└── .env.local                      # Variables de entorno (gitignored)
```

### 3.2 Patrón de Layout Groups (Next.js App Router)

El sistema usa **route groups** para separar la autenticación del dashboard:

```
app/
├── (dashboard)/layout.tsx    # Requiere sesión activa (AuthGuard)
│   └── DashboardLayout       # Sidebar + Header siempre presentes
├── login/page.tsx            # Pública
└── mantenimiento/page.tsx    # Pública (redirección si modo on)
```

El `AuthContext.tsx` envuelve toda la app. El layout del dashboard verifica `isAuthenticated` antes de renderizar; si no hay sesión, redirige a `/login`.

---

## 4. MODELO DE DATOS (FIRESTORE)

### 4.1 Colecciones de Primer Nivel

```
Firestore
├── usuarios/{uid}                          # Perfil de usuario
├── entidades/{entidadId}                   # M1: Entidades
│   ├── glosario/{terminoId}               # Subcolección: términos del dominio
│   └── historial/{entradaId}              # Subcolección: inmutable (M1-06)
├── proyectos/{proyectoId}                  # M2: Proyectos
│   └── historial/{entradaId}              # Subcolección: inmutable (M2-04)
├── repositorios_configuracion/{configId}   # M2-06: CCB/SCR por proyecto
├── srs/{srsId}                             # M3: SRS (1 por proyecto, FK proyectoId)
├── requerimientos/{reqId}                  # M3: RF/RNF/RD (FK srsId + proyectoId)
├── sesiones_entrevista/{sesionId}          # M3: Entrevistas (FK srsId)
├── escenarios/{escenarioId}               # M3: Escenarios/CU (FK srsId)
├── casos_prueba/{casoId}                   # M3: Test cases (FK srsId + reqId)
├── terminos_dominio_srs/{terminoId}        # M3: Glosario SRS
├── notificaciones/{docId}                  # T-02: Notificaciones
├── auditoria/{docId}                       # T-03: Audit trail (inmutable)
├── configuracion/{docId}                   # T-06: Config sistema
└── configuracion_dashboard/{uid}           # T-05: Config personal
```

### 4.2 Tipo Entidad (M1)

```typescript
interface Entidad {
  id: string
  tipo: 'cliente' | 'proveedor' | 'ambos'
  razonSocial: string
  nombreComercial?: string
  rut: string                    // Formato chileno validado (módulo 11)
  sector: SectorEntidad          // 9 valores posibles
  pais: string
  ciudad?: string
  direccion?: string
  sitioWeb?: string
  estado: 'activo' | 'inactivo' | 'observado' | 'suspendido'
  nivelRiesgo: 'bajo' | 'medio' | 'alto' | 'critico'
  stakeholders: Stakeholder[]    // Mínimo 1 requerido
  tieneNDA: boolean
  fechaNDA?: Date
  notas?: string
  respuestasFactibilidad?: RespuestasFactibilidad   // 11 campos ponderados
  checklistGlosario?: ChecklistGlosario
  creadoEn: Date
  actualizadoEn: Date
  creadoPor: string              // UID del usuario
}
```

### 4.3 Tipo Proyecto (M2)

```typescript
interface Proyecto {
  id: string
  codigo: string                  // Auto-generado: PRY-001
  nombre: string
  descripcion: string
  tipo: TipoProyecto              // nuevo_desarrollo | mantenimiento | ...
  estado: EstadoProyecto          // 7 estados en workflow
  criticidad: CriticidadProyecto  // baja | media | alta | critica
  metodologia: MetodologiaProyecto // cascada | agil_scrum | rup | espiral | ...
  justificacionMetodologia: string
  clienteId: string               // FK a entidades
  proveedoresIds: string[]
  equipo: MiembroEquipo[]
  riesgos: RiesgoProyecto[]
  hitos: Hito[]
  presupuesto?: PresupuestoProyecto
  fechaInicio?: Date
  fechaFinEstimada?: Date
  estadoSRS?: EstadoSRS
  creadoEn: Date
  actualizadoEn: Date
  creadoPor: string
}
```

### 4.4 Tipo SRS (M3)

```typescript
interface SRS {
  id: string
  proyectoId: string
  version: string                 // 'v0.0', 'v1.0' post Gate 2
  estado: EstadoSRS               // 9 estados
  tipoSRS: 'completo' | 'incremental' | 'epica'
  gate1Estado: 'pendiente' | 'go' | 'nogo'
  gate1FechaDecision?: Date
  gate1DecisionPor?: string
  stakeholdersSRS: StakeholderSRS[]
  riesgosSRS: RiesgoSRS[]
  prototipos: Prototipo[]         // Embebidos en documento SRS
  artefactosModelo: ArtefactoModelo[]
  checklistValidacion: ItemChecklist[]  // 21 ítems
  observacionesValidacion: ObservacionValidacion[]
  solicitudesCambioSRS: SolicitudCambioSRS[]
  matrizTrazabilidad: FilaTrazabilidad[]
  tecnicasActivas: string[]
  iteracionesBucle: IteracionBucle[]
  contadorCiclosValidacion: number
  factibilidad?: EvaluacionFactibilidad  // Gate 1
}
```

---

## 5. CAPA DE SERVICIOS

### 5.1 Patrón de Servicio

Cada módulo tiene un objeto de servicio singleton que encapsula toda la lógica Firestore:

```typescript
// Patrón base (entidades.service.ts)
export const entidadesService = {
  getAll: async (filtros?) => Entidad[],
  getById: async (id) => Entidad | null,
  create: async (data) => Entidad,
  update: async (id, data) => Entidad,
  updateEstado: async (id, estado, motivo) => void,
  delete: async (id) => void,    // Soft delete → 'inactivo'
  glosario: { getAll, getById, getCount, create, update, delete },
};

// Funciones puras exportadas (reutilizables en componentes)
export function calcularNivelCompletitud(entidad, glosarioCount) { ... }
export function calcularNivelRiesgo(respuestasFactibilidad) { ... }
```

### 5.2 Integración de Auditoría T-03

Cada operación crítica dispara un registro de auditoría de forma silenciosa (nunca rompe el flujo principal):

```typescript
// Patrón de auditoría silenciosa en todos los servicios
try {
  const { auditoriaService } = await import('./auditoria.service')
  const fbUser = getFirebaseAuth().currentUser
  if (fbUser) await auditoriaService.registrar({
    actor: { uid, nombre, rol: 'analista' },
    accion: 'ENTIDAD_CREADA',
    modulo: 'M1',
    entidad: { id, tipo: 'Entidad', nombre: data.razonSocial },
    descripcion: `Entidad "${data.razonSocial}" creada`,
    resultado: 'exito',
  })
} catch { /* silencioso */ }
```

### 5.3 Normalización de Datos Firestore

Firestore omite arrays vacíos al persistir. El patrón de normalización en `docToEntidad`:

```typescript
function docToEntidad(id: string, data: Record<string, unknown>): Entidad {
  const converted = convertTimestamps({ id, ...data }) as Entidad;
  if (!Array.isArray(converted.stakeholders)) {
    converted.stakeholders = [];   // Guard crítico
  }
  return converted;
}
```

Este patrón se replica en `docToProyecto` (normaliza `equipo`, `riesgos`, `hitos`) y en `docToSRS` (normaliza 10+ arrays).

---

## 6. CAPA DE HOOKS (TanStack Query v5)

### 6.1 Convención de Hooks

```typescript
// Query
export function useEntidades(filtros?: FiltrosEntidad) {
  return useQuery({
    queryKey: ['entidades', filtros],
    queryFn: () => entidadesService.getAll(filtros),
    staleTime: 1000 * 60 * 2,   // 2 minutos de caché
  });
}

// Mutation
export function useCreateEntidad() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CrearEntidadDTO) => entidadesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entidades'] });
      toast.success('Entidad creada correctamente');
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Error inesperado');
    },
  });
}
```

### 6.2 Query Keys Hierarchy

```
['entidades']                    → Lista completa
['entidades', filtros]           → Lista filtrada
['entidades', id]                → Entidad individual
['entidades', id, 'historial']   → Historial

['proyectos']
['proyectos', filtros]
['proyectos', id]
['proyectos', id, 'historial']
['proyectos', 'stats']

['srs', proyectoId]
['requerimientos', srsId]
['escenarios', srsId]
['sesiones', srsId]
['glosario', entidadId]
['notificaciones', userId]
```

---

## 7. GESTIÓN DE ESTADO (ZUSTAND)

| Store | Propósito | Estado Principal |
|-------|-----------|-----------------|
| `useUIStore` | UI global | `sidebarOpen`, `theme`, `notificationsUnread` |
| `useAuthStore` | Sesión | `user`, `isAuthenticated`, `rol` |
| `useEntidadStore` | Filtros M1 | `filtrosActivos`, `entidadSeleccionada` |
| `useProyectoStore` | Filtros M2 | `filtrosActivos`, `proyectoSeleccionado` |
| `useAlcanceStore` | Estado M3 | `faseActiva`, `srsSeleccionado`, `filtroRequerimientos` |

---

## 8. VALIDACIÓN — ESQUEMAS ZOD

### 8.1 Entidad Schema

```typescript
const entidadCreateSchema = z.object({
  tipo: z.enum(['cliente', 'proveedor', 'ambos']),
  razonSocial: z.string().min(2).max(200),
  rut: rutSchema,                   // Validación dígito verificador (módulo 11)
  sector: z.enum(SECTORES),
  pais: z.string().min(2),
  stakeholders: z.array(stakeholderSchema).min(1, 'Se requiere al menos 1 stakeholder'),
  tieneNDA: z.boolean().default(false),
  fechaNDA: z.date().optional(),
  respuestasFactibilidad: respuestasFactibilidadSchema.optional(),
  // ...
});
```

### 8.2 Validación RUT Chileno

```typescript
const rutSchema = z.string().refine((val) => validarRut(val), {
  message: 'RUT inválido',
});
// Algoritmo módulo 11 estándar chileno
```

### 8.3 Esquema Proyecto (7 pasos)

El wizard de proyectos valida cada paso contra un sub-schema Zod antes de avanzar:
- Paso 1: Identificación + tipo
- Paso 2: Datos del cliente (valida contra entidades existentes)
- Paso 3: Equipo (mínimo 1 miembro)
- Paso 4: Metodología (árbol de decisión de 7 factores)
- Paso 5: Riesgos (tipificados)
- Paso 6: Hitos y fechas
- Paso 7: Presupuesto (estimación PERT: min/nominal/máx)

---

## 9. SEGURIDAD

### 9.1 Reglas Firestore

```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }

    // Usuarios: lectura abierta a todos los autenticados (panel admin),
    // escritura solo propio documento
    match /usuarios/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && request.auth.uid == userId;
    }

    // M1-M3: todos los autenticados pueden leer/escribir (reglas en código)
    match /entidades/{entidadId} { allow read, write: if isAuthenticated(); }
    match /proyectos/{proyectoId} { allow read, write: if isAuthenticated(); }
    match /srs/{srsId} { allow read, write: if isAuthenticated(); }

    // Historial: inmutable (M1-06 §8)
    match /entidades/{entidadId}/historial/{entradaId} {
      allow read, create: if isAuthenticated();
      allow update, delete: if false;    // Nunca modificar
    }

    // Auditoría: write-only para usuarios, read para todos (beta)
    match /auditoria/{docId} {
      allow read, create: if isAuthenticated();
      allow update, delete: if false;    // Absolutamente inmutable
    }

    // Bloqueo total de colecciones no listadas
    match /{document=**} { allow read, write: if false; }
  }
}
```

### 9.2 Políticas de Borrado (Soft Deletes)

| Entidad | Campo | Valor de "borrado" | Física |
|---------|-------|-------------------|--------|
| Entidad | `estado` | `'inactivo'` | ❌ |
| Proyecto | `estado` | `'cancelado'` | ❌ |
| Requerimiento | `estado` | `'rechazado'` | ❌ |
| Término glosario | — | — | ✅ (permitido) |
| Notificación | — | — | ❌ |
| Auditoría | — | — | ❌ (ni update) |

---

## 10. FLUJO DE DATOS COMPLETO

```
Usuario interactúa con componente
  ↓
React Hook Form valida con Zod
  ↓
Hook mutation (TanStack Query)
  ↓
Service function (Firestore write)
  ├── Registro en subcolección historial
  └── Auditoría T-03 (silenciosa)
  ↓
Query cache invalidado (queryClient.invalidateQueries)
  ↓
Toast notification (Sonner)
  ↓
Componente re-renders desde nueva caché
```

---

## 11. WORKFLOW M3 — SRS (8 Fases)

```
FASE 1 — Factibilidad
  ├── Evaluación 3 dimensiones: negocio / técnica / integración
  └── GATE 1: Go → Fase 2 | No-Go → SRS cancelado

FASE 2 — Adquisición de Requerimientos
  ├── 7 técnicas de adquisición (Entrevista, JAD, Etnografía, etc.)
  ├── Sesiones de entrevista (FK: srsId → sesiones_entrevista)
  └── RF/RNF/RD emergen → requerimientos collection

FASE 3 — Prototipado
  ├── 4 tipos: wireframe / mockup / Mago de Oz / funcional
  ├── Resultado por requerimiento (aprobado/rechazado/requiere_ajuste)
  └── Embebidos en documento SRS (no subcolección)

FASE 4 — Análisis y Modelado
  ├── 8 tipos de artefactos (Contexto, CU, BPMN, Secuencia, etc.)
  ├── Modelo de Contexto: OBLIGATORIO siempre
  └── BPMN: OBLIGATORIO si criticidad = alta/crítica

FASE 5 — Especificación
  ├── Redacción formal de RF, RNF, RD
  ├── MoSCoW (Must/Should/Could/Won't)
  ├── Vocabulario controlado (debe/deberá/podrá)
  └── Detector de palabras ambiguas (17 adjetivos + cuantificadores)

FASE 6 — Integración Documental
  ├── Matriz de trazabilidad (stakeholder → RF → CasoPrueba)
  └── Glosario de dominio unificado

FASE 7 — Validación
  ├── Checklist 21 ítems (S, C, V, M groups)
  ├── Observaciones con resolución
  └── Ciclos de validación (feedback loop M3-01)

FASE 8 — Transición al Desarrollo
  ├── GATE 2: validación checklist formal
  ├── Versión SRS: v1.0
  ├── Proyecto → estado 'activo_en_desarrollo'
  └── SCR SRS habilitado (Change Requests post-aprobación)
```

---

## 12. MÓDULO 2 — ÁRBOL DE DECISIÓN DE METODOLOGÍA

El sistema evalúa 7 factores para recomendar automáticamente la metodología:

```typescript
// src/lib/metodologia/arbolDecision.ts
inputs: {
  criticidad: 'baja' | 'media' | 'alta' | 'critica',
  tamanoEquipo: number,
  distribuidoGeograficamente: boolean,
  requiereRegulacionExterna: boolean,
  estabilidadRequerimientos: 'estable' | 'parcial' | 'inestable',
  clienteDisponibleParaIteraciones: boolean,
  tieneContratoFijo: boolean,
}

// Salidas posibles
output: 'cascada' | 'incremental' | 'agil_scrum' | 'agil_xp' | 'rup' | 'espiral' | 'hibrido'
```

La recomendación viene con `justificacion` (texto generado) y `efecto_en_srs` (qué tipo de SRS corresponde: completo/incremental/épica).

---

## 13. SEMÁFORO DE PROYECTOS

```typescript
// src/lib/dashboard/semaforoProyecto.ts
export function calcularSemaforoProyecto(proyecto, config?): 'verde' | 'amarillo' | 'rojo' {
  // ROJO si:
  // - Hitos vencidos sin completar
  // - Riesgos materializados sin mitigar
  // - Fecha fin retrasada más de umbral configurable

  // AMARILLO si:
  // - Hitos próximos a vencer (< 7 días)
  // - Riesgos de alta probabilidad no abordados

  // VERDE: todo en control
}
```

---

## 14. ESCALABILIDAD

### 14.1 Firestore Scaling
- **Reads:** Query constraints via `where()` + `orderBy()` en Firestore (índices compuestos en `firestore.indexes.json`)
- **Writes:** Subcollections para historial evitan documentos gigantes
- **Pagination:** TanStack Table con paginación client-side (10/25/50 por página)
- **Real-time:** `onSnapshot` disponible para notificaciones (ya implementado en `useNotificacionesFS.ts`)

### 14.2 Consideraciones para Escalar

| Aspecto | Estado Actual | Mejora Recomendada |
|---------|-------------|-------------------|
| Auth | Firebase Auth básico | Custom Claims para roles granulares |
| Multi-tenant | No implementado | Añadir `organizacionId` a todos los documentos |
| File Storage | No implementado | Firebase Storage para adjuntos (NDA, SRS PDF) |
| Offline | No implementado | Firestore offline persistence + PWA |
| Background jobs | No implementado | Cloud Functions para notificaciones automáticas, recordatorios de hitos |
| Search | Client-side | Algolia / Typesense para búsqueda full-text escalable |
| Export | No implementado | Cloud Functions para PDF generation (SRS formal) |
| Analytics | No implementado | Google Analytics + Firebase Performance |

### 14.3 Variables de Entorno Requeridas

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=austranet-cco.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=austranet-cco
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=austranet-cco.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=624542750327
NEXT_PUBLIC_FIREBASE_APP_ID=1:624542750327:web:6b70060bbeb9cdfc135872
```

---

## 15. COMANDOS DE DESARROLLO

```bash
# Desarrollo local
npm run dev

# Build producción
npm run build

# TypeScript check
npx tsc --noEmit

# Lint
npm run lint

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes

# Deploy completo (si se configura hosting)
firebase deploy
```

---

## 16. CONVENCIONES DE CÓDIGO

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Componentes | PascalCase | `EntidadForm.tsx` |
| Hooks | camelCase + `use` prefix | `useCreateEntidad` |
| Servicios | camelCase + `Service` suffix | `entidadesService` |
| Tipos/Interfaces | PascalCase | `Entidad`, `CrearEntidadDTO` |
| Constantes | SCREAMING_SNAKE_CASE | `ROUTES`, `NAV_ITEMS` |
| Stores | `use{Domain}Store` | `useEntidadStore` |
| Server components | Sin `'use client'` | `PageHeader`, `EmptyState` |
| Client components | `'use client'` en primera línea | Todos los formularios |

---

## 17. MÓDULOS TRANSVERSALES (SPRINT CAPA TRANSVERSAL)

| ID | Módulo | Estado | Descripción |
|----|--------|--------|-------------|
| T-01 | Auth / Usuarios | ✅ Activo | Firebase Auth + Firestore usuarios |
| T-02 | Notificaciones | ✅ Implementado | In-app, real-time con Firestore listeners |
| T-03 | Auditoría | ✅ Implementado | Registro silencioso de todas las acciones CRUD críticas |
| T-04 | Búsqueda Global | ✅ Implementado | BusquedaGlobal command palette cross-module |
| T-05 | Dashboard KPIs | ✅ Implementado | Métricas de proceso, semáforo, estadísticas |
| T-06 | Configuración | ✅ Implementado | Thresholds configurables (días semáforo, umbrales) |

---

*Informe generado: 2026-02-27 | Sistema: Austranet CCO v0.1.0*
