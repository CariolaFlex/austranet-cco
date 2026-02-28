<!-- ============================================================
  AUSTRANET-CCO — CAPA TRANSVERSAL
  Archivo:  T-01-autenticacion-usuarios.md
  Capa:     Transversal
  Elemento: 1 de 6
  Sirve a:  M1 · M2 · M3
  Stack:    Firebase Auth · Firestore · Next.js middleware · TypeScript
  Versión:  1.0
  Fecha:    2026-02-27
  Estado:   activo
  Autor:    austranet-cco
  ============================================================ -->

# T-01-autenticacion-usuarios.md

> **Capa Transversal — Elemento 1 de 6**
> **Autenticación, Roles y Permisos**
> *Componente que sirve a todos los módulos del sistema: M1 · M2 · M3*

---

## 1. Metadatos del Documento

| Campo | Valor |
|---|---|
| **Nombre del archivo** | `T-01-autenticacion-usuarios.md` |
| **Capa** | Transversal |
| **Posición** | Elemento 1 de 6 |
| **Módulos que sirve** | M1 — Registro de Entidades · M2 — Gestión de Proyectos · M3 — Documentación SRS |
| **Stack** | Firebase Auth · Firestore · Next.js middleware · TypeScript |
| **Versión** | 1.0 |
| **Fecha** | 2026-02-27 |
| **Estado** | `activo` — listo para implementación |
| **Sistema de referencia** | austranet-cco |
| **Dependencias** | M1-01, M1-02, M2-01, M3-01 |

---

## 2. Objetivo del Documento

### ¿Por qué la autenticación es transversal?

La autenticación y el control de acceso no pertenecen a ningún módulo específico porque **ningún módulo puede funcionar de forma segura sin ellos**. M1 protege datos contractuales de entidades con NDA activo. M2 gestiona proyectos con información económica confidencial. M3 produce documentos SRS con requerimientos sensibles del negocio del cliente. Los tres módulos comparten la misma base de identidad — el `uid` de Firebase Auth — y todos deben aplicar las mismas reglas de acceso diferenciado según el rol del usuario autenticado.

Colocar la lógica de autenticación dentro de cualquiera de los módulos generaría duplicación, inconsistencias y brechas de seguridad. La Capa Transversal es el lugar correcto: un único sistema de identidad, roles y permisos que se aplica horizontalmente a cada operación del sistema, independientemente del módulo que la ejecute.

### ¿Por qué austranet-cco requiere roles diferenciados?

Un sistema de gestión de consultoría opera con usuarios de naturaleza muy distinta: el equipo interno de la consultora (admin, gestor, analista), y los usuarios externos del cliente (viewer). Cada perfil necesita un nivel de acceso diferente no solo por razones de seguridad, sino por razones operacionales:

- Un **analista** debe poder construir el SRS sin poder eliminar la entidad cliente.
- Un **gestor** debe poder aprobar proyectos sin poder configurar el sistema.
- Un **viewer** (cliente externo) debe poder revisar el SRS de su proyecto sin ver los proyectos de otras empresas.
- Un **admin** necesita acceso completo para administrar el sistema, pero sus acciones deben quedar auditadas.

El campo `rol` del tipo `Usuario`, combinado con `proyectosAsignados` y `entidadesAcceso`, forma el núcleo del control de acceso diferenciado del sistema.

---

## 3. Roles del Sistema

### 3.1 Definición de Roles

| Rol | Alcance general | Descripción operativa |
|---|---|---|
| `superadmin` | Total + configuración técnica | Rol técnico de mantenimiento. Acceso a todo el sistema incluyendo configuración de infraestructura, reglas de Firestore, variables de entorno y gestión de usuarios. No debe usarse en operaciones ordinarias. |
| `admin` | Total sobre M1, M2 y M3 | Acceso completo a todos los módulos. Puede crear, editar y eliminar entidades (M1), proyectos (M2) y documentos SRS (M3). Gestiona usuarios del sistema: crea cuentas, asigna roles y proyectos, activa y desactiva usuarios. |
| `gestor` | Total sobre M2 y M3 de su proyecto · Lectura en M1 | Gestiona los proyectos que tiene asignados en `proyectosAsignados`. Puede crear y editar proyectos y documentos SRS dentro de su alcance. Lee entidades de M1 pero no puede crearlas ni modificarlas. Aprueba el SRS de su proyecto en la Fase de Validación. |
| `analista` | Total sobre M3 de su proyecto · Lectura en M2 | Responsable de la documentación SRS del proyecto asignado. Puede crear, editar y gestionar todos los documentos de M3 en su proyecto. Lee el proyecto en M2 (solo su proyecto asignado). Sin acceso a M1. |
| `viewer` | Solo lectura en M2 y M3 del proyecto asignado | Típicamente el cliente o un stakeholder externo. Solo puede leer las secciones de M2 y M3 que el gestor habilite explícitamente. Puede comentar en el SRS durante la Fase 7 de validación si el gestor lo habilita. |

---

### 3.2 Tabla de Permisos por Rol y Módulo

> **Convención:** ✅ Permitido · ❌ No permitido · 👁 Solo lectura · 🔒 Solo si el gestor lo habilita explícitamente

#### Módulo 1 — Registro de Entidades

| Acción | superadmin | admin | gestor | analista | viewer |
|---|:---:|:---:|:---:|:---:|:---:|
| Crear entidad | ✅ | ✅ | ❌ | ❌ | ❌ |
| Leer entidad | ✅ | ✅ | 👁 | ❌ | ❌ |
| Editar entidad | ✅ | ✅ | ❌ | ❌ | ❌ |
| Eliminar entidad | ✅ | ✅ | ❌ | ❌ | ❌ |
| Aprobar perfil de entidad | ✅ | ✅ | ❌ | ❌ | ❌ |
| Gestionar stakeholders | ✅ | ✅ | ❌ | ❌ | ❌ |
| Ver glosario de dominio | ✅ | ✅ | 👁 | ❌ | ❌ |
| Gestionar NDA | ✅ | ✅ | ❌ | ❌ | ❌ |
| Ver KPIs de entidad | ✅ | ✅ | 👁 | ❌ | ❌ |

#### Módulo 2 — Gestión de Proyectos

| Acción | superadmin | admin | gestor | analista | viewer |
|---|:---:|:---:|:---:|:---:|:---:|
| Crear proyecto | ✅ | ✅ | ✅ | ❌ | ❌ |
| Leer proyecto (propio) | ✅ | ✅ | ✅ | 👁 | 🔒 |
| Editar proyecto | ✅ | ✅ | ✅ | ❌ | ❌ |
| Eliminar proyecto | ✅ | ✅ | ❌ | ❌ | ❌ |
| Aprobar hitos | ✅ | ✅ | ✅ | ❌ | ❌ |
| Gestionar equipo del proyecto | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ver riesgos del proyecto | ✅ | ✅ | ✅ | 👁 | ❌ |
| Cambiar estado del proyecto | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ver estimaciones y presupuesto | ✅ | ✅ | ✅ | ❌ | ❌ |

#### Módulo 3 — Documentación SRS

| Acción | superadmin | admin | gestor | analista | viewer |
|---|:---:|:---:|:---:|:---:|:---:|
| Crear documento SRS | ✅ | ✅ | ✅ | ✅ | ❌ |
| Leer SRS (propio proyecto) | ✅ | ✅ | ✅ | ✅ | 🔒 |
| Editar sección SRS | ✅ | ✅ | ✅ | ✅ | ❌ |
| Eliminar sección SRS | ✅ | ✅ | ✅ | ❌ | ❌ |
| Aprobar SRS (gate de fase) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Comentar en SRS | ✅ | ✅ | ✅ | ✅ | 🔒 |
| Avanzar a fase siguiente | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ver historial de versiones SRS | ✅ | ✅ | ✅ | ✅ | ❌ |

---

## 4. Tipo TypeScript `Usuario`

```typescript
// types/index.ts — austranet-cco
// Tipo principal de usuario del sistema

export type RolUsuario =
  | 'superadmin'
  | 'admin'
  | 'gestor'
  | 'analista'
  | 'viewer'

export interface Usuario {
  // ─── Identidad ────────────────────────────────────────────
  uid: string                      // Firebase Auth UID (inmutable)
  email: string                    // Email verificado en Firebase Auth
  nombre: string
  apellido: string

  // ─── Control de acceso ────────────────────────────────────
  rol: RolUsuario                  // Rol principal del usuario en el sistema
  proyectosAsignados: string[]     // IDs de proyectos (M2/M3) — vacío si admin o superadmin
  entidadesAcceso: string[]        // IDs de entidades M1 con acceso de lectura — vacío si admin/superadmin

  // ─── Estado y ciclo de vida ───────────────────────────────
  activo: boolean                  // false = desactivado (no puede iniciar sesión)
  fechaCreacion: Date              // Timestamp de creación del registro
  fechaUltimoAcceso: Date          // Timestamp del último login exitoso
  creadoPor: string                // UID del admin que creó este usuario

  // ─── Auditoría ────────────────────────────────────────────
  ultimaModificacion?: Date        // Timestamp de la última edición del perfil
  modificadoPor?: string           // UID del admin que realizó la última modificación
}

// ─── Tipos auxiliares ─────────────────────────────────────────

/** Payload para crear un usuario nuevo — sin uid ni fechas automáticas */
export type CrearUsuarioPayload = Omit<
  Usuario,
  'uid' | 'fechaCreacion' | 'fechaUltimoAcceso' | 'ultimaModificacion' | 'modificadoPor'
>

/** Payload para actualizar un usuario — solo campos editables */
export type ActualizarUsuarioPayload = Partial<
  Pick<
    Usuario,
    | 'nombre'
    | 'apellido'
    | 'rol'
    | 'proyectosAsignados'
    | 'entidadesAcceso'
    | 'activo'
  >
> & {
  modificadoPor: string  // siempre requerido al actualizar
}

/** Contexto de autenticación disponible en toda la app vía React Context */
export interface AuthContext {
  usuario: Usuario | null
  cargando: boolean
  tieneAcceso: (modulo: 'M1' | 'M2' | 'M3', accion: AccionPermiso) => boolean
  tieneAccesoProyecto: (proyectoId: string) => boolean
}

export type AccionPermiso = 'crear' | 'leer' | 'editar' | 'eliminar' | 'aprobar'
```

---

## 5. Lógica de Control de Acceso por Módulo

### 5.1 Módulo 1 — Entidades

**Regla principal:** Solo `admin` y `superadmin` pueden modificar entidades.

```typescript
// lib/permisos/m1.ts

export function puedeGestionarEntidad(usuario: Usuario): boolean {
  return usuario.rol === 'admin' || usuario.rol === 'superadmin'
}

export function puedeLeerEntidad(usuario: Usuario, entidadId: string): boolean {
  if (usuario.rol === 'superadmin' || usuario.rol === 'admin') return true
  if (usuario.rol === 'gestor') {
    // El gestor puede leer entidades asociadas a sus proyectos asignados
    return usuario.entidadesAcceso.includes(entidadId)
  }
  // analista y viewer no acceden directamente a M1
  return false
}
```

**Reglas de negocio de M1:**
- `admin` y `superadmin`: acceso CRUD completo a todas las entidades.
- `gestor`: lectura solo de entidades incluidas en `entidadesAcceso`. Este campo lo gestiona el `admin` al asignar el gestor a un proyecto. Un gestor no puede crear entidades nuevas ni modificar el perfil existente.
- `analista` y `viewer`: no acceden directamente a M1. Si necesitan contexto de la entidad, el gestor puede exponer información específica dentro del scope de M2/M3.

---

### 5.2 Módulo 2 — Proyectos

**Regla principal:** Cada usuario solo ve proyectos donde su `uid` está en `proyectosAsignados` del proyecto, salvo `admin` y `superadmin` que ven todos.

```typescript
// lib/permisos/m2.ts

export function puedeAccederProyecto(usuario: Usuario, proyectoId: string): boolean {
  if (usuario.rol === 'superadmin' || usuario.rol === 'admin') return true
  return usuario.proyectosAsignados.includes(proyectoId)
}

export function puedeEditarProyecto(usuario: Usuario, proyectoId: string): boolean {
  if (usuario.rol === 'superadmin' || usuario.rol === 'admin') return true
  if (usuario.rol === 'gestor') return usuario.proyectosAsignados.includes(proyectoId)
  // analista y viewer: solo lectura
  return false
}

export function puedeVerProyectoViewer(
  usuario: Usuario,
  proyectoId: string,
  seccionHabilitada: boolean // flag que activa el gestor
): boolean {
  if (usuario.rol !== 'viewer') return puedeAccederProyecto(usuario, proyectoId)
  return usuario.proyectosAsignados.includes(proyectoId) && seccionHabilitada
}
```

**Reglas de negocio de M2:**
- `admin` y `gestor`: gestionan proyectos activamente. El `gestor` solo ve y modifica proyectos en su `proyectosAsignados`.
- `analista`: acceso de solo lectura al proyecto asignado en `proyectosAsignados`. No puede cambiar estado ni presupuesto ni equipo.
- `viewer`: accede únicamente a las secciones que el `gestor` habilita explícitamente mediante un flag en el documento del proyecto (`seccionesViewer: string[]`). Perder el proyecto de `proyectosAsignados` revoca el acceso inmediatamente.

---

### 5.3 Módulo 3 — SRS

**Regla principal:** El `analista` construye el SRS, el `gestor` lo aprueba, el `viewer` puede revisar y comentar en Fase 7 si el gestor lo habilita.

```typescript
// lib/permisos/m3.ts

export function puedeEditarSRS(usuario: Usuario, proyectoId: string): boolean {
  if (usuario.rol === 'superadmin' || usuario.rol === 'admin') return true
  if (usuario.rol === 'gestor' || usuario.rol === 'analista') {
    return usuario.proyectosAsignados.includes(proyectoId)
  }
  return false
}

export function puedeAprobarSRS(usuario: Usuario, proyectoId: string): boolean {
  if (usuario.rol === 'superadmin' || usuario.rol === 'admin') return true
  if (usuario.rol === 'gestor') return usuario.proyectosAsignados.includes(proyectoId)
  return false
}

export function puedeComentarSRS(
  usuario: Usuario,
  proyectoId: string,
  fase: number,
  validacionHabilitada: boolean // gestiona el gestor en Fase 7
): boolean {
  if (puedeEditarSRS(usuario, proyectoId)) return true
  if (usuario.rol === 'viewer') {
    return (
      usuario.proyectosAsignados.includes(proyectoId) &&
      fase === 7 &&
      validacionHabilitada
    )
  }
  return false
}
```

**Reglas de negocio de M3:**
- `analista`: acceso total al SRS de su proyecto. Puede crear secciones, subir documentos, gestionar requerimientos funcionales y no funcionales, registrar restricciones y avanzar el SRS dentro de su fase actual. No puede aprobar gates.
- `gestor`: aprueba el SRS en los gates de fase. Puede editar cualquier sección del SRS de su proyecto. Es el único que puede habilitar la participación del `viewer` en Fase 7 (validación con el cliente).
- `viewer`: en Fase 7 únicamente, si el `gestor` activa `validacionHabilitada`, puede leer el SRS completo del proyecto asignado y agregar comentarios. No puede editar ni aprobar.

---

## 6. Implementación con Firebase Auth + Firestore

### 6.1 Almacenamiento de Roles en Firestore

Los roles se almacenan en la colección `usuarios` de Firestore, **no exclusivamente en Firebase Auth Custom Claims**. La razón: Firestore permite reglas de seguridad granulares, auditoría completa de cambios y campos adicionales como `proyectosAsignados` que Auth no soporta nativamente.

```
Firestore
└── usuarios/
    └── {uid}/              ← documento por usuario (uid = Firebase Auth UID)
        ├── email: string
        ├── nombre: string
        ├── apellido: string
        ├── rol: RolUsuario
        ├── proyectosAsignados: string[]
        ├── entidadesAcceso: string[]
        ├── activo: boolean
        ├── fechaCreacion: Timestamp
        ├── fechaUltimoAcceso: Timestamp
        ├── creadoPor: string
        ├── ultimaModificacion: Timestamp
        └── modificadoPor: string
```

### 6.2 Sincronización con Firebase Auth Custom Claims

Los **Custom Claims** de Firebase Auth se sincronizan con el campo `rol` de Firestore para permitir validaciones rápidas en el middleware de Next.js sin consultar Firestore en cada request.

```typescript
// functions/src/syncUserClaims.ts — Cloud Function

import * as admin from 'firebase-admin'

/**
 * Se ejecuta cuando un admin cambia el rol de un usuario en Firestore.
 * Sincroniza el custom claim de Firebase Auth para uso en el middleware.
 */
export const onUsuarioRolChange = functions.firestore
  .document('usuarios/{uid}')
  .onWrite(async (change, context) => {
    const { uid } = context.params
    const data = change.after.data()

    if (!data) return // documento eliminado — no aplica

    await admin.auth().setCustomUserClaims(uid, {
      rol: data.rol,
      activo: data.activo,
    })
  })
```

**Cuándo se sincronizan los claims:**
- Al crear un usuario nuevo (`admin` usa el formulario de creación).
- Al cambiar el `rol` de un usuario existente (`admin` edita el perfil).
- Al activar o desactivar un usuario (`activo` cambia en Firestore).

El middleware de Next.js lee el claim `rol` del JWT de Firebase para evitar roundtrips a Firestore en cada request protegido.

---

### 6.3 Middleware de Next.js

```typescript
// middleware.ts — raíz del proyecto Next.js

import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt' // o verifyIdToken de firebase-admin en edge

const RUTAS_POR_ROL: Record<string, string[]> = {
  '/m1': ['superadmin', 'admin', 'gestor'],
  '/m2': ['superadmin', 'admin', 'gestor', 'analista', 'viewer'],
  '/m3': ['superadmin', 'admin', 'gestor', 'analista', 'viewer'],
  '/admin': ['superadmin', 'admin'],
  '/configuracion': ['superadmin'],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Obtener el token JWT de Firebase Auth desde las cookies
  const token = await getFirebaseToken(request)

  // 2. Si no hay sesión, redirigir al login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 3. Si el usuario está desactivado, cerrar sesión
  if (!token.activo) {
    return NextResponse.redirect(new URL('/sesion-inactiva', request.url))
  }

  // 4. Verificar permisos según la ruta solicitada
  const rutaBase = Object.keys(RUTAS_POR_ROL).find((ruta) =>
    pathname.startsWith(ruta)
  )

  if (rutaBase) {
    const rolesPermitidos = RUTAS_POR_ROL[rutaBase]
    if (!rolesPermitidos.includes(token.rol)) {
      return NextResponse.redirect(new URL('/sin-acceso', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/m1/:path*', '/m2/:path*', '/m3/:path*', '/admin/:path*', '/configuracion/:path*'],
}
```

---

### 6.4 Reglas de Seguridad de Firestore

```javascript
// firestore.rules

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ─── Funciones auxiliares ───────────────────────────────────────

    function esAutenticado() {
      return request.auth != null;
    }

    function miRol() {
      return request.auth.token.rol;
    }

    function esAdmin() {
      return miRol() == 'admin' || miRol() == 'superadmin';
    }

    function esGestor() {
      return miRol() == 'gestor';
    }

    function esAnalista() {
      return miRol() == 'analista';
    }

    function esViewer() {
      return miRol() == 'viewer';
    }

    function tieneProyecto(proyectoId) {
      return request.auth.uid in get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.proyectosAsignados
        || proyectoId in get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.proyectosAsignados;
    }

    function usuarioActivo() {
      return request.auth.token.activo == true;
    }

    // ─── Colección: usuarios ────────────────────────────────────────

    match /usuarios/{uid} {
      // Solo admin puede leer/escribir perfiles de usuario
      // Cada usuario puede leer su propio perfil
      allow read: if esAutenticado() && usuarioActivo() && (request.auth.uid == uid || esAdmin());
      allow create: if esAutenticado() && usuarioActivo() && esAdmin();
      allow update: if esAutenticado() && usuarioActivo() && esAdmin();
      allow delete: if false; // nunca eliminar usuarios — solo desactivar
    }

    // ─── Colección: entidades (M1) ──────────────────────────────────

    match /entidades/{entidadId} {
      allow read: if esAutenticado() && usuarioActivo() && (
        esAdmin() ||
        (esGestor() && entidadId in get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.entidadesAcceso)
      );
      allow create: if esAutenticado() && usuarioActivo() && esAdmin();
      allow update: if esAutenticado() && usuarioActivo() && esAdmin();
      allow delete: if esAutenticado() && usuarioActivo() && esAdmin();
    }

    // ─── Colección: proyectos (M2) ──────────────────────────────────

    match /proyectos/{proyectoId} {
      allow read: if esAutenticado() && usuarioActivo() && (
        esAdmin() ||
        tieneProyecto(proyectoId)
      );
      allow create: if esAutenticado() && usuarioActivo() && (esAdmin() || esGestor());
      allow update: if esAutenticado() && usuarioActivo() && (
        esAdmin() ||
        (esGestor() && tieneProyecto(proyectoId))
      );
      allow delete: if esAutenticado() && usuarioActivo() && esAdmin();
    }

    // ─── Colección: documentosSRS (M3) ──────────────────────────────

    match /documentosSRS/{srsId} {
      allow read: if esAutenticado() && usuarioActivo() && (
        esAdmin() ||
        (
          (esGestor() || esAnalista() || esViewer()) &&
          tieneProyecto(resource.data.proyectoId)
        )
      );
      allow create: if esAutenticado() && usuarioActivo() && (
        esAdmin() || esGestor() || esAnalista()
      );
      allow update: if esAutenticado() && usuarioActivo() && (
        esAdmin() ||
        ((esGestor() || esAnalista()) && tieneProyecto(resource.data.proyectoId))
      );
      allow delete: if esAutenticado() && usuarioActivo() && (
        esAdmin() ||
        (esGestor() && tieneProyecto(resource.data.proyectoId))
      );
    }

    // ─── Colección: auditoria ────────────────────────────────────────

    match /auditoria/{logId} {
      allow read: if esAutenticado() && usuarioActivo() && esAdmin();
      allow create: if esAutenticado() && usuarioActivo(); // cualquier acción del sistema genera log
      allow update: if false; // los logs son inmutables
      allow delete: if false;
    }
  }
}
```

---

## 7. Flujos de Gestión de Usuarios

### 7.1 Crear Usuario

**Quién puede:** Solo `admin` y `superadmin`.

**Campos del formulario de creación:**

| Campo | Tipo | Obligatorio | Notas |
|---|---|:---:|---|
| Email | `string` (email) | ✅ | Debe ser único en Firebase Auth |
| Nombre | `string` | ✅ | — |
| Apellido | `string` | ✅ | — |
| Rol | `RolUsuario` | ✅ | Selección del enum de roles |
| Proyectos asignados | `string[]` (IDs) | ❌ | Requerido si rol es `gestor`, `analista` o `viewer` |
| Entidades con acceso | `string[]` (IDs) | ❌ | Requerido si rol es `gestor` |
| Contraseña temporal | `string` | ✅ | Se envía al email. Usuario debe cambiarla en primer login. |

**Flujo técnico:**
1. Admin completa el formulario en `/admin/usuarios/nuevo`.
2. Se llama a la Cloud Function `crearUsuario` con `CrearUsuarioPayload`.
3. La función crea el usuario en Firebase Auth con `createUser()`.
4. La función crea el documento en `usuarios/{uid}` en Firestore.
5. La Cloud Function `onUsuarioRolChange` se dispara automáticamente y sincroniza el Custom Claim `rol`.
6. El sistema envía al nuevo usuario un email con su contraseña temporal.

---

### 7.2 Desactivar Usuario

**Quién puede:** Solo `admin` y `superadmin`.

**Regla crítica:** **Nunca eliminar usuarios con proyectos asociados.** Los registros de auditoría, la autoría de documentos SRS, las aprobaciones y el historial de proyectos hacen referencia al `uid` del usuario. Eliminar el documento destruye la trazabilidad.

**Procedimiento:**

```typescript
// lib/usuarios/desactivar.ts

export async function desactivarUsuario(
  uid: string,
  adminUid: string
): Promise<void> {
  // 1. Marcar como inactivo en Firestore — NO eliminar el documento
  await db.collection('usuarios').doc(uid).update({
    activo: false,
    modificadoPor: adminUid,
    ultimaModificacion: serverTimestamp(),
  })

  // 2. Revocar tokens activos de Firebase Auth
  await admin.auth().revokeRefreshTokens(uid)

  // 3. onUsuarioRolChange sincroniza el claim activo = false
  // → el middleware bloqueará el acceso en el próximo request

  // 4. Registrar en log de auditoría
  await registrarAuditoria({
    tipo: 'USUARIO_DESACTIVADO',
    usuarioAfectado: uid,
    realizadoPor: adminUid,
    timestamp: new Date(),
  })
}
```

**Consecuencias de la desactivación:**
- `activo = false` en Firestore.
- Custom Claim `activo` se sincroniza a `false` vía Cloud Function.
- El middleware redirige al usuario a `/sesion-inactiva` en el próximo acceso.
- Los registros históricos del usuario (documentos SRS, aprobaciones) se **conservan intactos**.

---

### 7.3 Reasignar Proyectos

**Quién puede:** Solo `admin` y `superadmin`.

**Comportamiento:** Al actualizar `proyectosAsignados`, el usuario **pierde acceso inmediatamente** a los proyectos removidos. Las reglas de Firestore verifican en tiempo real el array de proyectos del documento `usuarios/{uid}`.

```typescript
// lib/usuarios/reasignarProyectos.ts

export async function reasignarProyectos(
  uid: string,
  nuevosProyectos: string[],
  adminUid: string
): Promise<void> {
  const usuarioRef = db.collection('usuarios').doc(uid)
  const usuarioSnap = await usuarioRef.get()
  const proyectosAnteriores = usuarioSnap.data()?.proyectosAsignados ?? []

  await usuarioRef.update({
    proyectosAsignados: nuevosProyectos,
    modificadoPor: adminUid,
    ultimaModificacion: serverTimestamp(),
  })

  // El acceso se revoca en el siguiente request del usuario
  // (las reglas de Firestore leen el documento actualizado en tiempo real)

  await registrarAuditoria({
    tipo: 'PROYECTOS_REASIGNADOS',
    usuarioAfectado: uid,
    realizadoPor: adminUid,
    detalles: { proyectosAnteriores, proyectosNuevos: nuevosProyectos },
    timestamp: new Date(),
  })
}
```

---

### 7.4 Cambiar Rol

**Quién puede:** Solo `admin` y `superadmin`.

**Regla de seguridad crítica:** Si se **degrada** a un usuario de `gestor` a `analista`, el sistema debe verificar antes del cambio que el proyecto asignado tiene **al menos otro gestor activo**. Un proyecto sin gestor activo no puede aprobar gates ni habilitar acceso al viewer.

```typescript
// lib/usuarios/cambiarRol.ts

export async function cambiarRol(
  uid: string,
  nuevoRol: RolUsuario,
  adminUid: string
): Promise<{ exito: boolean; error?: string }> {
  const usuarioSnap = await db.collection('usuarios').doc(uid).get()
  const usuario = usuarioSnap.data() as Usuario

  // Verificación de degradación: gestor → analista/viewer
  if (usuario.rol === 'gestor' && nuevoRol !== 'gestor' && nuevoRol !== 'admin' && nuevoRol !== 'superadmin') {
    for (const proyectoId of usuario.proyectosAsignados) {
      const otrosGestores = await db.collection('usuarios')
        .where('proyectosAsignados', 'array-contains', proyectoId)
        .where('rol', '==', 'gestor')
        .where('activo', '==', true)
        .where('uid', '!=', uid)
        .get()

      if (otrosGestores.empty) {
        return {
          exito: false,
          error: `El proyecto ${proyectoId} quedaría sin gestor activo. Asigna otro gestor antes de degradar este usuario.`,
        }
      }
    }
  }

  // Actualizar rol en Firestore
  await db.collection('usuarios').doc(uid).update({
    rol: nuevoRol,
    modificadoPor: adminUid,
    ultimaModificacion: serverTimestamp(),
  })

  // onUsuarioRolChange sincroniza el Custom Claim automáticamente

  await registrarAuditoria({
    tipo: 'ROL_CAMBIADO',
    usuarioAfectado: uid,
    realizadoPor: adminUid,
    detalles: { rolAnterior: usuario.rol, rolNuevo: nuevoRol },
    timestamp: new Date(),
  })

  return { exito: true }
}
```

---

## 8. Conexiones con los 3 Módulos

La siguiente tabla mapea las acciones clave del sistema con el **rol mínimo requerido** y el **campo del tipo `Usuario`** que se verifica para autorizar la operación.

| Acción del sistema | Módulo | Rol mínimo | Campo verificado en `Usuario` |
|---|:---:|---|---|
| Crear entidad cliente/proveedor | M1 | `admin` | `rol == 'admin'` |
| Editar perfil de entidad | M1 | `admin` | `rol == 'admin'` |
| Leer entidad en un proyecto | M1 | `gestor` | `rol == 'gestor'` + `entidadesAcceso.includes(entidadId)` |
| Gestionar NDA de entidad | M1 | `admin` | `rol == 'admin'` |
| Crear proyecto nuevo | M2 | `gestor` | `rol == 'gestor'` (sin restricción de proyectoId — crea uno nuevo) |
| Editar configuración de proyecto | M2 | `gestor` | `rol == 'gestor'` + `proyectosAsignados.includes(proyectoId)` |
| Cambiar estado del proyecto | M2 | `gestor` | `rol == 'gestor'` + `proyectosAsignados.includes(proyectoId)` |
| Ver proyecto (solo lectura) | M2 | `analista` | `proyectosAsignados.includes(proyectoId)` |
| Habilitar acceso viewer a M2/M3 | M2 | `gestor` | `rol == 'gestor'` + `proyectosAsignados.includes(proyectoId)` |
| Crear/editar sección SRS | M3 | `analista` | `proyectosAsignados.includes(proyectoId)` |
| Avanzar fase SRS (gate) | M3 | `gestor` | `rol == 'gestor'` + `proyectosAsignados.includes(proyectoId)` |
| Aprobar SRS (gate final) | M3 | `gestor` | `rol == 'gestor'` + `proyectosAsignados.includes(proyectoId)` |
| Comentar en SRS (Fase 7) | M3 | `viewer` | `proyectosAsignados.includes(proyectoId)` + `fase == 7` + `validacionHabilitada == true` |
| Ver historial de versiones SRS | M3 | `analista` | `proyectosAsignados.includes(proyectoId)` |
| Crear usuario nuevo | Sistema | `admin` | `rol == 'admin'` |
| Desactivar usuario | Sistema | `admin` | `rol == 'admin'` |
| Cambiar rol de usuario | Sistema | `admin` | `rol == 'admin'` + verificación de gestor por proyecto |
| Reasignar proyectos a usuario | Sistema | `admin` | `rol == 'admin'` |
| Ver logs de auditoría | Sistema | `admin` | `rol == 'admin'` |
| Acceder a configuración técnica | Sistema | `superadmin` | `rol == 'superadmin'` |

---

## 9. Checklist de Completitud del Documento

| Ítem | Estado |
|---|:---:|
| Metadatos completos (nombre, capa, posición, módulos, stack, versión, fecha, estado) | ✅ |
| Objetivo del documento — por qué la autenticación es transversal | ✅ |
| Objetivo del documento — por qué se necesitan roles diferenciados | ✅ |
| Definición de los 5 roles con descripción operativa | ✅ |
| Tablas de permisos por rol: M1, M2 y M3 (crear/leer/editar/eliminar/aprobar) | ✅ |
| Tipo TypeScript `Usuario` con todos los campos requeridos | ✅ |
| Tipos auxiliares: `CrearUsuarioPayload`, `ActualizarUsuarioPayload`, `AuthContext` | ✅ |
| Lógica de control de acceso M1 con código y reglas de negocio | ✅ |
| Lógica de control de acceso M2 con código y reglas de negocio | ✅ |
| Lógica de control de acceso M3 con código y reglas de negocio | ✅ |
| Almacenamiento de roles en Firestore — estructura de colección `usuarios` | ✅ |
| Sincronización de Custom Claims con Firestore (Cloud Function) | ✅ |
| Middleware de Next.js para proteger rutas `/m1/*`, `/m2/*`, `/m3/*` | ✅ |
| Reglas de seguridad de Firestore para colecciones: usuarios, entidades, proyectos, documentosSRS, auditoría | ✅ |
| Flujo: Crear usuario — formulario, campos, proceso técnico | ✅ |
| Flujo: Desactivar usuario — `activo = false`, no eliminar, preservar registros | ✅ |
| Flujo: Reasignar proyectos — revocación inmediata de acceso | ✅ |
| Flujo: Cambiar rol — verificación de gestor activo antes de degradación | ✅ |
| Tabla de conexiones con los 3 módulos (rol mínimo + campo verificado) | ✅ |
| Todo en español con terminología consistente del sistema | ✅ |
| Formato consistente con archivos M1-XX, M2-XX, M3-XX | ✅ |

---

*Documento generado para el sistema austranet-cco · Capa Transversal · T-01 de 6*
