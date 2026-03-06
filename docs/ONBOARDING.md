# Austranet CCO — Onboarding de Desarrollo

> Versión: 1.0 · Fecha: 2026-03-06
> Objetivo: que un desarrollador nuevo pueda levantar el proyecto y entender la arquitectura en menos de 30 minutos.

---

## Prerrequisitos

| Herramienta | Versión mínima | Verificar |
|-------------|----------------|-----------|
| Node.js | 18.x LTS | `node -v` |
| npm | 9.x | `npm -v` |
| Git | 2.x | `git --version` |
| Firebase CLI | 13.x | `firebase --version` |

Cuenta de Google con acceso al proyecto Firebase `austranet-cco` (pedir al admin).

---

## Setup en 5 pasos

### 1. Clonar el repositorio

```bash
git clone https://github.com/CariolaFlex/austranet-cco.git
cd austranet-cco
npm install
```

### 2. Configurar variables de entorno

Crear el archivo `.env.local` en la raíz (no se commitea — está en `.gitignore`):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=austranet-cco.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=austranet-cco
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=austranet-cco.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=624542750327
NEXT_PUBLIC_FIREBASE_APP_ID=1:624542750327:web:6b70060bbeb9cdfc135872
```

Solicitar el valor de `NEXT_PUBLIC_FIREBASE_API_KEY` al administrador del proyecto.

### 3. Levantar el servidor de desarrollo

```bash
npx next dev --port 3001
```

La app estará disponible en `http://localhost:3001`.

> **Nota Windows:** si usas cmd.exe, el comando es exactamente el mismo.

### 4. Iniciar sesión en la app

Usar una cuenta de Google o email/password registrado en Firebase Auth del proyecto `austranet-cco`. El primer usuario debe crearse desde la consola de Firebase o mediante el formulario de registro habilitado en T-01.

### 5. Verificar el TypeScript

Antes de cualquier commit:

```bash
npx tsc --noEmit --skipLibCheck
```

Debe terminar sin output (0 errores). Este es un requisito obligatorio del proyecto.

---

## Estructura de la codebase (tour rápido)

```
src/
├── app/(dashboard)/     → Páginas del sistema (rutas protegidas)
├── components/          → UI organizada por módulo
│   ├── layout/          → Sidebar + Header
│   ├── common/          → Reutilizables (PageHeader, ChartContainer…)
│   ├── cronograma/      → M4: Gantt, PERT, CPM
│   ├── control/         → M4: EVM, Semáforos, S-Curves
│   └── portafolio/      → M4: BubbleChart, RiskMatrix
├── hooks/               → TanStack Query hooks (uno por dominio)
├── services/            → Acceso a Firestore (funciones puras)
├── lib/firebase/        → Config Firebase, auth helpers, firestore helpers
├── lib/cpm.ts           → Algoritmo CPM client-side
├── lib/export-utils.ts  → Exportar Gantt PDF y EVM CSV
├── types/index.ts       → Todos los tipos TypeScript del sistema (~1200 líneas)
└── constants/           → NAV_ITEMS, ROUTES, colores semáforo EVM
```

Lee `docs/ARQUITECTURA.md` para el detalle completo.

---

## Conceptos clave para entender el código

### Módulos del sistema

| Módulo | Ruta | Descripción |
|--------|------|-------------|
| M1 | `/entidades` | CRUD de clientes, proveedores, stakeholders |
| M2 | `/proyectos` | Gestión de proyectos con wizard, hitos, riesgos |
| M3 | `/proyectos/[id]` → tab Alcance | SRS y requerimientos |
| M4 | `/proyectos/[id]` → tabs Cronograma/Control | Gantt, PERT, EVM |
| Dashboard | `/` | Portafolio general con KPIs |

### Patrones que debes conocer

**1. Servicio → Hook → Componente:**
```
tareas.service.ts → useTareas.ts → TabCronograma.tsx
```

**2. Firestore — siempre usar los helpers:**
```typescript
import { getFirestoreDb, convertTimestamps, removeUndefined } from '@/lib/firebase/firestore'
// getFirestoreDb()      → instancia lazy del DB
// convertTimestamps()   → Timestamp → Date en toda la respuesta
// removeUndefined()     → limpiar antes de escribir
```

**3. Auth — siempre usar los helpers:**
```typescript
import { getCurrentUserId, getCurrentUserName } from '@/lib/firebase/auth'
// No crear copias locales en los servicios — ya existe centralizado
```

**4. Gráficos — SSR:false obligatorio:**
```typescript
const GanttChart = dynamic(() => import('@/components/cronograma/GanttChart'), { ssr: false })
```
Aplica a: `gantt-task-react`, `@xyflow/react`.

**5. KPIs EVM:**
- `proyecto.kpisDashboard` → cache embebido en el documento, actualizado por Cloud Functions (pendientes de activar)
- `evmService.calcularKPIsActuales(tareas, bac, fecha, opciones)` → cálculo cliente en tiempo real
- Snapshots en `proyectos/{id}/snapshots_evm` con ID = fecha del lunes de la semana

---

## Comandos frecuentes

| Comando | Uso |
|---------|-----|
| `npx next dev --port 3001` | Desarrollo local |
| `npx tsc --noEmit --skipLibCheck` | Verificar tipos (pre-commit) |
| `npx next build` | Build de producción |
| `firebase deploy --only firestore:rules` | Desplegar reglas Firestore |
| `firebase deploy --only hosting` | Desplegar a hosting |

---

## Documentación adicional

| Documento | Descripción |
|-----------|-------------|
| `docs/ARQUITECTURA.md` | Estructura, patrones y convenciones |
| `docs/DECISIONES_TECNICAS.md` | Por qué se eligió cada librería (ADRs) |
| `docs/herramientas-graficas/M4_SPRINT_TRACKING.md` | Historial de sprints M4 + decisiones arquitectónicas |
| `docs/herramientas-graficas/planificacion_graficas_p6.md` | Arquitectura detallada de M4 |
| `docs/capa-transversal/T-05-dashboard-principal.md` | Especificación del dashboard |

---

## Contacto y accesos

- Repositorio: https://github.com/CariolaFlex/austranet-cco (privado)
- Firebase Console: https://console.firebase.google.com/project/austranet-cco
- Para acceso al proyecto Firebase o al repositorio, contactar al admin del equipo.
