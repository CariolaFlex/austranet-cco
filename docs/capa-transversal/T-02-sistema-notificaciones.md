<!-- ============================================================
  AUSTRANET-CCO — CAPA TRANSVERSAL
  Archivo:  T-02-sistema-notificaciones.md
  Capa:     Transversal
  Elemento: 2 de 6
  Sirve a:  M1 · M2 · M3
  Prerrequisito: T-01 (Autenticación, Roles y Permisos)
  Stack:    Firebase Cloud Functions · Firestore · SendGrid · Next.js
  Versión:  1.0
  Fecha:    2026-02-27
  Estado:   activo
  Autor:    austranet-cco
  ============================================================ -->

# T-02-sistema-notificaciones.md

> **Capa Transversal — Elemento 2 de 6**
> **Sistema de Notificaciones**
> *Componente que sirve a todos los módulos del sistema: M1 · M2 · M3*

---

## 1. Metadatos del Documento

| Campo | Valor |
|---|---|
| **Nombre del archivo** | `T-02-sistema-notificaciones.md` |
| **Capa** | Transversal |
| **Posición** | Elemento 2 de 6 |
| **Módulos que sirve** | M1 — Registro de Entidades · M2 — Gestión de Proyectos · M3 — Documentación SRS |
| **Prerrequisito** | T-01 — Autenticación, Roles y Permisos (determina quién recibe cada notificación) |
| **Stack** | Firebase Cloud Functions · Firestore (colección `notificaciones`) · SendGrid · Next.js |
| **Versión** | 1.0 |
| **Fecha** | 2026-02-27 |
| **Estado** | `activo` — listo para implementación |
| **Sistema de referencia** | austranet-cco |
| **Dependencias directas** | T-01, M1-01, M2-01, M3-01 |

---

## 2. Objetivo del Documento

### ¿Por qué las notificaciones son transversales?

Los eventos que requieren comunicación ocurren en los tres módulos del sistema de forma indistinta: una entidad alcanza nivel de riesgo crítico (M1), un hito vence sin cerrarse (M2), un SRS supera el límite de iteraciones permitidas (M3). Ninguno de estos eventos pertenece a un solo módulo, pero todos necesitan el mismo mecanismo para comunicarlos: identificar al destinatario correcto (via T-01), elegir el canal adecuado, y registrar si se accionó o no.

Centralizar el sistema de notificaciones en la Capa Transversal elimina la duplicación de lógica de envío entre módulos y garantiza que las reglas de escalamiento, expiración y auditoría se apliquen de forma consistente a todo el sistema.

### El problema que resuelven

En un sistema de gestión de consultoría con roles diferenciados (T-01), cada usuario tiene responsabilidades concretas sobre objetos específicos: el `gestor` aprueba gates del SRS, el `analista` resuelve conflictos MoSCoW, el `admin` responde a entidades con riesgo crítico. Sin notificaciones, cada usuario debe revisar manualmente el sistema para detectar si algo requiere su atención — un comportamiento inviable en operación real con múltiples proyectos simultáneos.

### Acción requerida vs. informativa

El campo `accionRequerida: boolean` es la distinción operativa más importante del sistema de notificaciones:

- **Notificación informativa** (`accionRequerida: false`): comunica un evento ocurrido. No bloquea ningún flujo. El usuario puede leerla cuando lo considere conveniente. Ejemplos: proyecto creado, SRS iniciado, metodología acordada.
- **Notificación de acción requerida** (`accionRequerida: true`): el flujo del sistema está bloqueado hasta que el destinatario actúe. Mientras permanece sin accionar, el badge del navbar muestra el contador activo y el sistema aplica la lógica de escalamiento (§6). Ejemplos: Gate 1 pendiente de decisión, hito vencido, SRS listo para validación con el cliente.

---

## 3. Tipos TypeScript

```typescript
// types/notificaciones.ts — austranet-cco

// ─── Enum de tipos de notificación ────────────────────────────────────────────
// Catálogo completo — ver descripción detallada en §4

export type TipoNotificacion =
  // Módulo 1 — Entidades
  | 'M1_ENTIDAD_CREADA'
  | 'M1_RIESGO_NIVEL_CRITICO'
  | 'M1_PERFIL_INCOMPLETO_BLOQUEANDO'
  // Módulo 2 — Proyectos
  | 'M2_PROYECTO_CREADO'
  | 'M2_HITO_PROXIMO'
  | 'M2_HITO_VENCIDO'
  | 'M2_RIESGO_MATERIALIZADO'
  | 'M2_PRESUPUESTO_ALERTA'
  | 'M2_METODOLOGIA_ACORDADA'
  | 'M2_PROYECTO_ESTADO_CAMBIO'
  // Módulo 3 — SRS
  | 'M3_SRS_CREADO'
  | 'M3_GATE1_DECISION_REQUERIDA'
  | 'M3_GATE1_NO_GO'
  | 'M3_REQUERIMIENTO_PROPUESTO'
  | 'M3_CONFLICTO_MOSCOW'
  | 'M3_PROTOTIPO_RECHAZO'
  | 'M3_ITERACION_LIMITE'
  | 'M3_SRS_LISTO_VALIDACION'
  | 'M3_OBSERVACION_CLIENTE'
  | 'M3_OBSERVACION_CRITICA'
  | 'M3_GATE2_APROBACION'
  | 'M3_SRS_APROBADO'
  | 'M3_TRAZABILIDAD_INCOMPLETA'

// ─── Tipo principal ────────────────────────────────────────────────────────────

export interface Notificacion {
  id: string                        // UUID generado por Firestore

  // Clasificación
  tipo: TipoNotificacion
  modulo: 'M1' | 'M2' | 'M3'
  prioridad: 'critica' | 'alta' | 'media' | 'baja'

  // Entrega
  canal: 'inapp' | 'email' | 'ambos'
  destinatarios: string[]           // UIDs de usuarios (tipo Usuario de T-01)

  // Contenido
  titulo: string
  mensaje: string

  // Comportamiento de flujo
  accionRequerida: boolean          // true = flujo bloqueado hasta que se accione
  accionUrl?: string                // ruta del sistema — ej: '/m3/srs/abc123/gate1'

  // Entidad relacionada
  entidadRelacionada: {
    tipo: 'entidad' | 'proyecto' | 'srs' | 'requerimiento' | 'riesgo'
    id: string
    nombre: string
  }

  // Estado del ciclo de vida
  estado: 'pendiente' | 'enviada' | 'leida' | 'accionada' | 'expirada'

  // Timestamps
  fechaCreacion: Date
  fechaEnvio?: Date                 // cuando se envió por el canal configurado
  fechaLectura?: Date               // cuando el destinatario marcó como leída
  fechaExpiracion?: Date            // si no se acciona antes → escala o cancela

  // Trazabilidad
  creadaPor: 'sistema' | string     // 'sistema' = automática · string = UID del usuario
  escaladaDe?: string               // ID de la notificación original si es un escalamiento
}

// ─── Tipos auxiliares ─────────────────────────────────────────────────────────

/** Payload para crear una nueva notificación desde una Cloud Function */
export type CrearNotificacionPayload = Omit<
  Notificacion,
  'id' | 'estado' | 'fechaCreacion' | 'fechaEnvio' | 'fechaLectura'
>

/** Estado de lectura por destinatario — subcolección en usuarios/{uid}/notificaciones */
export interface NotificacionUsuario {
  notificacionId: string            // referencia a notificaciones/{id}
  uid: string
  estado: 'pendiente' | 'leida' | 'accionada'
  fechaLectura?: Date
  fechaAccion?: Date
}

/** Preferencias de notificación configurables por usuario */
export interface PreferenciasNotificacion {
  uid: string
  emailHabilitado: boolean          // desactiva todos los emails
  emailPorPrioridad: {
    critica: boolean                // no se puede desactivar — siempre true
    alta: boolean
    media: boolean
    baja: boolean
  }
  inappHabilitado: boolean          // no se puede desactivar — siempre true
}
```

---

## 4. Catálogo Completo de Eventos

### 4.1 Módulo 1 — Registro de Entidades

| Tipo | Disparador | Destinatario (rol T-01) | Canal | Acción Requerida | Prioridad | Expira en |
|---|---|---|---|:---:|---|---|
| `M1_ENTIDAD_CREADA` | Nueva entidad registrada en el sistema | Todos los `admin` | in-app | ❌ | baja | — |
| `M1_RIESGO_NIVEL_CRITICO` | `nivelRiesgo` de una entidad cambia a `critico` | Todos los `admin` + `gestor` con proyectos activos de esa entidad | ambos | ✅ | critica | 24h |
| `M1_PERFIL_INCOMPLETO_BLOQUEANDO` | Perfil de entidad con `completitudPerfil < 60%` impide avanzar en M2 | Todos los `admin` | in-app | ✅ | alta | 72h |

---

### 4.2 Módulo 2 — Gestión de Proyectos

| Tipo | Disparador | Destinatario (rol T-01) | Canal | Acción Requerida | Prioridad | Expira en |
|---|---|---|---|:---:|---|---|
| `M2_PROYECTO_CREADO` | Proyecto nuevo creado en el sistema | Todos los usuarios en `proyectosAsignados` | in-app | ❌ | baja | — |
| `M2_HITO_PROXIMO` | Hito a ≤ 7 días de su `fechaLimite` sin estado `cerrado` | `gestor` del proyecto | ambos | ❌ | alta | En `fechaLimite` |
| `M2_HITO_VENCIDO` | Hito cuya `fechaLimite` pasó y sigue sin cerrarse | `gestor` del proyecto + todos los `admin` | ambos | ✅ | critica | 48h |
| `M2_RIESGO_MATERIALIZADO` | Riesgo pasa a estado `materializado` | `gestor` del proyecto + todos los `admin` | ambos | ✅ | alta | 48h |
| `M2_PRESUPUESTO_ALERTA` | Gasto real supera el 80% del presupuesto estimado | `gestor` del proyecto + todos los `admin` | ambos | ❌ | alta | — |
| `M2_METODOLOGIA_ACORDADA` | Metodología registrada y cliente dio conformidad | Todo el equipo del proyecto (`proyectosAsignados`) | in-app | ❌ | media | — |
| `M2_PROYECTO_ESTADO_CAMBIO` | Cualquier cambio de estado del proyecto | Todos los usuarios en `proyectosAsignados` | in-app | ❌ | baja | — |

---

### 4.3 Módulo 3 — Documentación SRS

| Tipo | Disparador | Destinatario (rol T-01) | Canal | Acción Requerida | Prioridad | Expira en |
|---|---|---|---|:---:|---|---|
| `M3_SRS_CREADO` | Nuevo documento SRS iniciado para un proyecto | `analista` del proyecto | in-app | ❌ | baja | — |
| `M3_GATE1_DECISION_REQUERIDA` | Factibilidad completada — Gate 1 pendiente de decisión GO / NO-GO | `gestor` del proyecto | ambos | ✅ | critica | 48h |
| `M3_GATE1_NO_GO` | Decisión Gate 1 = NO-GO — proyecto cancelado | Todos los asignados al proyecto + todos los `admin` | ambos | ❌ | critica | — |
| `M3_REQUERIMIENTO_PROPUESTO` | Nuevo RF / RNF / RD en estado `propuesto` aguardando formalización | `analista` del proyecto | in-app | ❌ | media | — |
| `M3_CONFLICTO_MOSCOW` | Conflicto MoSCoW detectado entre stakeholders de influencia `alta` | `analista` + `gestor` del proyecto | ambos | ✅ | alta | 48h |
| `M3_PROTOTIPO_RECHAZO` | Evaluación de prototipo genera retorno a Fase 2 | `analista` del proyecto | in-app | ❌ | alta | — |
| `M3_ITERACION_LIMITE` | Bucle Fase 3→2 o Fase 4→2 supera 3 iteraciones sin convergencia | `gestor` del proyecto + todos los `admin` | ambos | ✅ | alta | 48h |
| `M3_SRS_LISTO_VALIDACION` | SRS listo para revisión conjunta Fase 7 | `gestor` del proyecto + `viewer` clientes del proyecto | ambos | ✅ | alta | 72h |
| `M3_OBSERVACION_CLIENTE` | Cliente (`viewer`) deja observación en el SRS durante Fase 7 | `analista` del proyecto | in-app | ❌ | media | — |
| `M3_OBSERVACION_CRITICA` | Observación de tipo `ajuste_mayor` en el SRS | `analista` + `gestor` del proyecto | ambos | ✅ | alta | 48h |
| `M3_GATE2_APROBACION` | Todos los ítems del Gate 2 cumplidos — esperando firma del cliente | `gestor` del proyecto + `viewer` stakeholder cliente | ambos | ✅ | critica | 72h |
| `M3_SRS_APROBADO` | SRS v1.0 firmado y aprobado por el cliente | Todos los asignados al proyecto + todos los `admin` | ambos | ❌ | critica | — |
| `M3_TRAZABILIDAD_INCOMPLETA` | RF Must Have sin stakeholder fuente o sin caso de prueba antes de Gate 2 | `analista` del proyecto | in-app | ✅ | alta | 48h |

> **Nota sobre `M3_SRS_APROBADO`:** aunque `accionRequerida = false` (es informativa), tiene prioridad `critica` porque dispara automáticamente el cambio de estado del proyecto en M2 (`estado → 'srs_aprobado'`). Esta es la única notificación que tiene efecto colateral directo sobre otro módulo.

---

## 5. Arquitectura de Implementación

### 5.1 Estructura en Firestore

```
Firestore
├── notificaciones/
│   └── {notificacionId}/          ← documento Notificacion completo
│       ├── tipo: TipoNotificacion
│       ├── modulo: 'M1' | 'M2' | 'M3'
│       ├── prioridad: string
│       ├── canal: string
│       ├── destinatarios: string[]
│       ├── titulo: string
│       ├── mensaje: string
│       ├── accionRequerida: boolean
│       ├── accionUrl: string
│       ├── entidadRelacionada: { tipo, id, nombre }
│       ├── estado: string
│       ├── fechaCreacion: Timestamp
│       ├── fechaEnvio: Timestamp
│       ├── fechaExpiracion: Timestamp
│       └── creadaPor: string
│
└── usuarios/
    └── {uid}/
        └── notificaciones/        ← subcolección para lectura rápida
            └── {notificacionId}/  ← documento NotificacionUsuario
                ├── notificacionId: string
                ├── uid: string
                ├── estado: 'pendiente' | 'leida' | 'accionada'
                ├── fechaLectura: Timestamp
                └── fechaAccion: Timestamp
```

La colección raíz `notificaciones/` contiene el documento completo (fuente de verdad). La subcolección `usuarios/{uid}/notificaciones/` contiene solo el estado de lectura individual, permitiendo consultas eficientes como "todas mis notificaciones pendientes" sin leer el documento completo.

---

### 5.2 Cloud Function — Generador de Notificaciones

```typescript
// functions/src/notificaciones/onEventoSistema.ts

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { CrearNotificacionPayload, TipoNotificacion } from '../types/notificaciones'

const db = admin.firestore()

/**
 * Trigger: cuando un proyecto actualiza su campo `estadoHito`
 * Detecta hitos vencidos y genera M2_HITO_VENCIDO
 */
export const onHitoActualizado = functions.firestore
  .document('proyectos/{proyectoId}/hitos/{hitoId}')
  .onUpdate(async (change, context) => {
    const antes = change.before.data()
    const despues = change.after.data()
    const { proyectoId } = context.params

    const ahora = new Date()
    const fechaLimite = despues.fechaLimite?.toDate()

    // Detectar hito recién vencido (no estaba vencido antes)
    if (
      fechaLimite &&
      fechaLimite < ahora &&
      despues.estado !== 'cerrado' &&
      antes.estado !== 'vencido'
    ) {
      await crearNotificacion({
        tipo: 'M2_HITO_VENCIDO',
        modulo: 'M2',
        prioridad: 'critica',
        canal: 'ambos',
        destinatarios: await obtenerDestinatarios('M2_HITO_VENCIDO', proyectoId),
        titulo: `Hito vencido: ${despues.nombre}`,
        mensaje: `El hito "${despues.nombre}" del proyecto ${proyectoId} venció el ${fechaLimite.toLocaleDateString('es-CL')} sin cerrarse.`,
        accionRequerida: true,
        accionUrl: `/m2/proyectos/${proyectoId}/hitos/${context.params.hitoId}`,
        entidadRelacionada: { tipo: 'proyecto', id: proyectoId, nombre: despues.proyectoNombre ?? proyectoId },
        fechaExpiracion: new Date(ahora.getTime() + 48 * 60 * 60 * 1000), // +48h
        creadaPor: 'sistema',
      })
    }
  })

/**
 * Trigger: cuando un SRS actualiza su campo `fase`
 * Detecta Gate 1 pendiente de decisión y genera M3_GATE1_DECISION_REQUERIDA
 */
export const onSRSFaseCambio = functions.firestore
  .document('documentosSRS/{srsId}')
  .onUpdate(async (change, context) => {
    const antes = change.before.data()
    const despues = change.after.data()

    if (antes.fase !== 'gate1_pendiente' && despues.fase === 'gate1_pendiente') {
      const proyectoId = despues.proyectoId

      await crearNotificacion({
        tipo: 'M3_GATE1_DECISION_REQUERIDA',
        modulo: 'M3',
        prioridad: 'critica',
        canal: 'ambos',
        destinatarios: await obtenerDestinatarios('M3_GATE1_DECISION_REQUERIDA', proyectoId),
        titulo: 'Gate 1 pendiente de decisión GO / NO-GO',
        mensaje: `El SRS del proyecto ${despues.proyectoNombre} completó la evaluación de factibilidad. Se requiere decisión de GO / NO-GO.`,
        accionRequerida: true,
        accionUrl: `/m3/srs/${context.params.srsId}/gate1`,
        entidadRelacionada: { tipo: 'srs', id: context.params.srsId, nombre: despues.proyectoNombre },
        fechaExpiracion: new Date(Date.now() + 48 * 60 * 60 * 1000),
        creadaPor: 'sistema',
      })
    }
  })

// ─── Función auxiliar: crear notificación ─────────────────────────────────────

async function crearNotificacion(payload: CrearNotificacionPayload): Promise<string> {
  const notificacionRef = db.collection('notificaciones').doc()

  const notificacion = {
    ...payload,
    id: notificacionRef.id,
    estado: 'pendiente',
    fechaCreacion: admin.firestore.FieldValue.serverTimestamp(),
  }

  await notificacionRef.set(notificacion)

  // Crear entrada en subcolección de cada destinatario
  const batch = db.batch()
  for (const uid of payload.destinatarios) {
    const userNotifRef = db
      .collection('usuarios')
      .doc(uid)
      .collection('notificaciones')
      .doc(notificacionRef.id)

    batch.set(userNotifRef, {
      notificacionId: notificacionRef.id,
      uid,
      estado: 'pendiente',
    })
  }
  await batch.commit()

  return notificacionRef.id
}

// ─── Función auxiliar: resolver destinatarios según tipo y contexto ────────────

async function obtenerDestinatarios(
  tipo: TipoNotificacion,
  contextoId: string     // proyectoId o entidadId según el tipo
): Promise<string[]> {
  const uids: string[] = []

  // Obtener todos los admin activos
  const adminSnap = await db.collection('usuarios')
    .where('rol', 'in', ['admin', 'superadmin'])
    .where('activo', '==', true)
    .get()
  const adminUids = adminSnap.docs.map(d => d.id)

  // Obtener gestores del proyecto
  const gestoresSnap = await db.collection('usuarios')
    .where('rol', '==', 'gestor')
    .where('proyectosAsignados', 'array-contains', contextoId)
    .where('activo', '==', true)
    .get()
  const gestorUids = gestoresSnap.docs.map(d => d.id)

  // Obtener analistas del proyecto
  const analistasSnap = await db.collection('usuarios')
    .where('rol', '==', 'analista')
    .where('proyectosAsignados', 'array-contains', contextoId)
    .where('activo', '==', true)
    .get()
  const analistaUids = analistasSnap.docs.map(d => d.id)

  // Obtener viewers del proyecto
  const viewersSnap = await db.collection('usuarios')
    .where('rol', '==', 'viewer')
    .where('proyectosAsignados', 'array-contains', contextoId)
    .where('activo', '==', true)
    .get()
  const viewerUids = viewersSnap.docs.map(d => d.id)

  const MAP: Record<TipoNotificacion, string[]> = {
    M1_ENTIDAD_CREADA:               [...adminUids],
    M1_RIESGO_NIVEL_CRITICO:         [...adminUids, ...gestorUids],
    M1_PERFIL_INCOMPLETO_BLOQUEANDO: [...adminUids],
    M2_PROYECTO_CREADO:              [...adminUids, ...gestorUids, ...analistaUids, ...viewerUids],
    M2_HITO_PROXIMO:                 [...gestorUids],
    M2_HITO_VENCIDO:                 [...adminUids, ...gestorUids],
    M2_RIESGO_MATERIALIZADO:         [...adminUids, ...gestorUids],
    M2_PRESUPUESTO_ALERTA:           [...adminUids, ...gestorUids],
    M2_METODOLOGIA_ACORDADA:         [...gestorUids, ...analistaUids, ...viewerUids],
    M2_PROYECTO_ESTADO_CAMBIO:       [...adminUids, ...gestorUids, ...analistaUids, ...viewerUids],
    M3_SRS_CREADO:                   [...analistaUids],
    M3_GATE1_DECISION_REQUERIDA:     [...gestorUids],
    M3_GATE1_NO_GO:                  [...adminUids, ...gestorUids, ...analistaUids, ...viewerUids],
    M3_REQUERIMIENTO_PROPUESTO:      [...analistaUids],
    M3_CONFLICTO_MOSCOW:             [...analistaUids, ...gestorUids],
    M3_PROTOTIPO_RECHAZO:            [...analistaUids],
    M3_ITERACION_LIMITE:             [...adminUids, ...gestorUids],
    M3_SRS_LISTO_VALIDACION:         [...gestorUids, ...viewerUids],
    M3_OBSERVACION_CLIENTE:          [...analistaUids],
    M3_OBSERVACION_CRITICA:          [...analistaUids, ...gestorUids],
    M3_GATE2_APROBACION:             [...gestorUids, ...viewerUids],
    M3_SRS_APROBADO:                 [...adminUids, ...gestorUids, ...analistaUids, ...viewerUids],
    M3_TRAZABILIDAD_INCOMPLETA:      [...analistaUids],
  }

  return [...new Set(MAP[tipo] ?? [])] // eliminar duplicados
}
```

---

### 5.3 Cloud Function — Envío de Email

```typescript
// functions/src/notificaciones/enviarEmailNotificacion.ts

import * as functions from 'firebase-functions'
import * as sgMail from '@sendgrid/mail'

sgMail.setApiKey(functions.config().sendgrid.key)

/**
 * Trigger: cuando se crea una notificación con canal = 'email' | 'ambos'
 * Envía el email a cada destinatario usando SendGrid
 */
export const enviarEmailNotificacion = functions.firestore
  .document('notificaciones/{notificacionId}')
  .onCreate(async (snap, context) => {
    const notif = snap.data()

    if (notif.canal !== 'email' && notif.canal !== 'ambos') return

    const db = admin.firestore()

    for (const uid of notif.destinatarios) {
      // Verificar preferencias del usuario
      const prefSnap = await db
        .collection('usuarios')
        .doc(uid)
        .collection('preferencias')
        .doc('notificaciones')
        .get()

      const prefs = prefSnap.data()

      // Las notificaciones críticas siempre se envían
      const emailHabilitado =
        notif.prioridad === 'critica' ||
        (prefs?.emailHabilitado !== false &&
          prefs?.emailPorPrioridad?.[notif.prioridad] !== false)

      if (!emailHabilitado) continue

      const usuarioSnap = await db.collection('usuarios').doc(uid).get()
      const usuario = usuarioSnap.data()

      if (!usuario?.email || !usuario?.activo) continue

      await sgMail.send({
        to: usuario.email,
        from: 'noreply@austranet.cl',
        templateId: obtenerTemplateId(notif.tipo, notif.prioridad),
        dynamicTemplateData: {
          nombre: usuario.nombre,
          titulo: notif.titulo,
          mensaje: notif.mensaje,
          accionUrl: notif.accionUrl
            ? `${process.env.APP_URL}${notif.accionUrl}`
            : undefined,
          accionRequerida: notif.accionRequerida,
          modulo: notif.modulo,
          prioridad: notif.prioridad,
          fechaExpiracion: notif.fechaExpiracion
            ? new Date(notif.fechaExpiracion).toLocaleDateString('es-CL')
            : undefined,
        },
      })
    }

    // Marcar notificación como enviada
    await snap.ref.update({
      estado: 'enviada',
      fechaEnvio: admin.firestore.FieldValue.serverTimestamp(),
    })
  })

function obtenerTemplateId(tipo: TipoNotificacion, prioridad: string): string {
  // IDs de templates SendGrid — configurar en el panel de SendGrid
  const templates: Partial<Record<TipoNotificacion, string>> = {
    M3_GATE1_DECISION_REQUERIDA: 'd-gate1-decision',
    M3_GATE2_APROBACION:         'd-gate2-aprobacion',
    M3_SRS_APROBADO:             'd-srs-aprobado',
    M2_HITO_VENCIDO:             'd-hito-vencido',
    M1_RIESGO_NIVEL_CRITICO:     'd-riesgo-critico',
  }
  return templates[tipo] ?? (prioridad === 'critica' ? 'd-critica-generica' : 'd-estandar-generica')
}
```

---

### 5.4 Cloud Function Programada — Expiración y Escalamiento

```typescript
// functions/src/notificaciones/limpiarNotificacionesExpiradas.ts

import * as functions from 'firebase-functions'

/**
 * Se ejecuta cada hora.
 * Expira notificaciones vencidas y dispara escalamiento según §6.
 */
export const limpiarNotificacionesExpiradas = functions.pubsub
  .schedule('every 60 minutes')
  .onRun(async () => {
    const db = admin.firestore()
    const ahora = new Date()

    const expiradas = await db
      .collection('notificaciones')
      .where('fechaExpiracion', '<=', ahora)
      .where('estado', 'in', ['pendiente', 'enviada', 'leida'])
      .get()

    for (const doc of expiradas.docs) {
      const notif = doc.data()

      // Solo escalar si era de acción requerida
      if (notif.accionRequerida) {
        await dispararEscalamiento(notif, doc.id)
      }

      await doc.ref.update({ estado: 'expirada' })
    }
  })
```

---

### 5.5 Listener In-App (Next.js)

```typescript
// hooks/useNotificaciones.ts — Next.js

import { useEffect, useState } from 'react'
import { onSnapshot, collection, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/hooks/useAuth'  // contexto de T-01

export function useNotificaciones() {
  const { usuario } = useAuth()
  const [notificaciones, setNotificaciones] = useState<NotificacionUsuario[]>([])
  const [contadorAccionRequerida, setContadorAccionRequerida] = useState(0)

  useEffect(() => {
    if (!usuario?.uid) return

    // Listener en tiempo real sobre la subcolección del usuario
    const q = query(
      collection(db, 'usuarios', usuario.uid, 'notificaciones'),
      where('estado', 'in', ['pendiente', 'leida']),
      orderBy('fechaCreacion', 'desc')
    )

    const unsubscribe = onSnapshot(q, async (snap) => {
      const items = snap.docs.map(d => d.data() as NotificacionUsuario)
      setNotificaciones(items)

      // El badge solo cuenta accionRequerida = true + estado pendiente
      // Para eso necesitamos cruzar con el documento de la notificación
      const pendientesConAccion = await Promise.all(
        items
          .filter(i => i.estado === 'pendiente')
          .map(async i => {
            const notifDoc = await getDoc(
              doc(db, 'notificaciones', i.notificacionId)
            )
            return notifDoc.data()?.accionRequerida === true
          })
      )
      setContadorAccionRequerida(pendientesConAccion.filter(Boolean).length)
    })

    return () => unsubscribe()
  }, [usuario?.uid])

  return { notificaciones, contadorAccionRequerida }
}
```

---

## 6. Lógica de Escalamiento

Cuando una notificación con `accionRequerida = true` no es accionada dentro del plazo definido por `fechaExpiracion`, el sistema aplica la siguiente tabla de escalamiento:

### 6.1 Tabla de Escalamiento

| Tipo de notificación | Plazo de acción | Escala a | Nuevo destinatario | Registra en T-03 |
|---|---|---|---|:---:|
| `M1_RIESGO_NIVEL_CRITICO` | 24h | Re-notificación `critica` | Todos los `admin` | ✅ |
| `M1_PERFIL_INCOMPLETO_BLOQUEANDO` | 72h | Re-notificación `alta` | Todos los `admin` | ❌ |
| `M2_HITO_VENCIDO` | 48h | Re-notificación `critica` | Todos los `admin` | ✅ |
| `M2_RIESGO_MATERIALIZADO` | 48h | Re-notificación `critica` | `admin` + `gestor` superior | ✅ |
| `M3_GATE1_DECISION_REQUERIDA` | 48h | Re-notificación `critica` | Todos los `admin` | ✅ |
| `M3_CONFLICTO_MOSCOW` | 48h | Re-notificación `alta` → `critica` | `gestor` → `admin` | ❌ → ✅ |
| `M3_ITERACION_LIMITE` | 48h | Re-notificación `critica` | Todos los `admin` | ✅ |
| `M3_SRS_LISTO_VALIDACION` | 72h | Re-notificación `critica` | `admin` + `gestor` | ✅ |
| `M3_OBSERVACION_CRITICA` | 48h | Re-notificación `critica` | `gestor` + `admin` | ✅ |
| `M3_GATE2_APROBACION` | 72h | Re-notificación `critica` | Todos los `admin` | ✅ |
| `M3_TRAZABILIDAD_INCOMPLETA` | 48h | Re-notificación `alta` | `gestor` del proyecto | ❌ |

### 6.2 Reglas generales de escalamiento

- **`prioridad = alta` sin accionar en 48h** → escala a `prioridad = critica` + re-notificación por email al rol superior. Si el destinatario original era `analista`, se re-notifica al `gestor`. Si era `gestor`, se re-notifica al `admin`.
- **`prioridad = critica` sin accionar en 24h** → re-notificación al `admin` + entrada automática en el log de auditoría de T-03 con `tipo: 'NOTIFICACION_CRITICA_SIN_ACCIONAR'`.
- La re-notificación se crea como una nueva `Notificacion` con `escaladaDe: notificacionOriginalId` para mantener la trazabilidad.
- Una notificación expirada **no se elimina** — queda en estado `expirada` para registro histórico.

```typescript
// functions/src/notificaciones/dispararEscalamiento.ts

async function dispararEscalamiento(
  notif: Notificacion,
  notifId: string
): Promise<void> {
  const db = admin.firestore()

  // Registrar en T-03 si la notificación era crítica
  if (notif.prioridad === 'critica') {
    await db.collection('auditoria').add({
      tipo: 'NOTIFICACION_CRITICA_SIN_ACCIONAR',
      notificacionId: notifId,
      tipoNotificacion: notif.tipo,
      destinatariosOriginales: notif.destinatarios,
      modulo: notif.modulo,
      entidadRelacionada: notif.entidadRelacionada,
      fechaExpiracion: notif.fechaExpiracion,
      registradoPor: 'sistema',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
  }

  // Calcular nuevos destinatarios (rol superior)
  const adminSnap = await db.collection('usuarios')
    .where('rol', 'in', ['admin', 'superadmin'])
    .where('activo', '==', true)
    .get()
  const adminUids = adminSnap.docs.map(d => d.id)

  // Crear notificación de escalamiento
  await crearNotificacion({
    tipo: notif.tipo,
    modulo: notif.modulo,
    prioridad: 'critica',
    canal: 'ambos',
    destinatarios: [...new Set([...notif.destinatarios, ...adminUids])],
    titulo: `⚠️ ESCALAMIENTO: ${notif.titulo}`,
    mensaje: `Esta notificación no fue accionada en el plazo establecido y ha sido escalada. ${notif.mensaje}`,
    accionRequerida: true,
    accionUrl: notif.accionUrl,
    entidadRelacionada: notif.entidadRelacionada,
    fechaExpiracion: new Date(Date.now() + 24 * 60 * 60 * 1000), // +24h adicionales
    creadaPor: 'sistema',
    escaladaDe: notifId,
  })
}
```

---

## 7. Centro de Notificaciones — UI

### 7.1 Pantalla `/notificaciones`

La pantalla de notificaciones es accesible para todos los roles del sistema y muestra únicamente las notificaciones del usuario autenticado (subcolección `usuarios/{uid}/notificaciones`).

**Estructura de la pantalla:**

```
/notificaciones
├── Header
│   ├── Título: "Notificaciones"
│   └── Botón: "Marcar todas como leídas"
│
├── Barra de filtros
│   ├── Todas
│   ├── Acción requerida  (filtra accionRequerida = true + estado != accionada)
│   ├── Pendientes        (filtra estado = pendiente | enviada)
│   ├── Por módulo: [M1] [M2] [M3]
│   └── Por prioridad: [Crítica] [Alta] [Media] [Baja]
│
├── Lista de notificaciones (ordenada: prioridad desc + fecha desc)
│   └── Tarjeta de notificación
│       ├── Indicador visual de prioridad (borde izquierdo coloreado)
│       ├── Badge de módulo: [M1] / [M2] / [M3]
│       ├── Título + mensaje (truncado a 2 líneas)
│       ├── Fecha relativa: "hace 2 horas"
│       ├── Estado: pendiente / leída / accionada
│       ├── Icono de campana si accionRequerida = true
│       ├── Botón: "Ver detalle →"
│       └── Botón: "Marcar como leída" (si estado = pendiente)
│
└── Vista de detalle (modal o página /notificaciones/{id})
    ├── Título completo
    ├── Mensaje completo
    ├── Módulo · Tipo · Prioridad · Fecha
    ├── Entidad relacionada con enlace
    ├── Estado actual del ciclo de vida
    ├── Fecha de expiración (si aplica)
    └── Botón de acción directa: "Ir a [accionUrl]" (si accionRequerida = true)
```

### 7.2 Badge del Navbar

```typescript
// components/navbar/NotificacionesBadge.tsx

import { useNotificaciones } from '@/hooks/useNotificaciones'

export function NotificacionesBadge() {
  const { contadorAccionRequerida } = useNotificaciones()

  return (
    <div className="relative">
      <CampanaIcon className="w-6 h-6" />
      {contadorAccionRequerida > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white
                         text-xs font-bold rounded-full w-5 h-5
                         flex items-center justify-center">
          {contadorAccionRequerida > 9 ? '9+' : contadorAccionRequerida}
        </span>
      )}
    </div>
  )
}
```

> **Regla del badge:** solo cuenta notificaciones con `accionRequerida = true` y `estado = pendiente | enviada`. Las notificaciones informativas leídas **no** incrementan el badge.

### 7.3 Preferencias de Notificación

Accesibles desde `/perfil/notificaciones`. Cada usuario puede configurar:

| Preferencia | Configurable | Restricción |
|---|:---:|---|
| Desactivar todos los emails | ✅ | No aplica a notificaciones `critica` |
| Email para prioridad `alta` | ✅ | — |
| Email para prioridad `media` | ✅ | — |
| Email para prioridad `baja` | ✅ | — |
| Email para prioridad `critica` | ❌ | Siempre activo — no se puede desactivar |
| Notificaciones in-app | ❌ | Siempre activas — no se pueden desactivar |

---

## 8. Conexiones con Otros Elementos Transversales

### T-01 — Autenticación, Roles y Permisos

La función `obtenerDestinatarios()` (§5.2) depende completamente del modelo de roles definido en T-01. Para determinar quién recibe cada notificación, se consultan los campos `rol` y `proyectosAsignados` del tipo `Usuario` (T-01). Sin T-01 no es posible calcular los `destinatarios[]` de ninguna notificación.

La regla de escalamiento (§6) también usa roles de T-01: cuando una notificación de `analista` escala, se buscan los `gestor` del mismo proyecto, y si escala nuevamente, se buscan los `admin` del sistema.

### T-03 — Log de Auditoría

Toda notificación con `prioridad = critica` que expire sin ser accionada genera automáticamente una entrada en la colección `auditoria` de T-03 (ver `dispararEscalamiento()` en §6.2). Los campos registrados son:

```
auditoria/{logId}
├── tipo: 'NOTIFICACION_CRITICA_SIN_ACCIONAR'
├── notificacionId: string
├── tipoNotificacion: TipoNotificacion
├── destinatariosOriginales: string[]
├── modulo: 'M1' | 'M2' | 'M3'
├── entidadRelacionada: { tipo, id, nombre }
├── fechaExpiracion: Timestamp
├── registradoPor: 'sistema'
└── timestamp: Timestamp
```

### T-05 — Dashboard Principal

El dashboard de T-05 incluye un widget "Acciones requeridas" en posición prioritaria (primer cuadrante). Este widget consulta la subcolección `usuarios/{uid}/notificaciones` filtrando `accionRequerida = true` + `estado != accionada` y muestra las últimas 5, ordenadas por `prioridad` y `fechaExpiracion` ascendente (las que vencen antes, primero).

---

## 9. Checklist de Completitud del Documento

| Ítem | Estado |
|---|:---:|
| Metadatos completos (nombre, capa, posición, módulos, prerrequisito, stack, versión, fecha, estado) | ✅ |
| Objetivo — por qué las notificaciones son transversales | ✅ |
| Objetivo — el problema que resuelven en un sistema multi-rol | ✅ |
| Distinción entre notificación informativa y de acción requerida | ✅ |
| Enum `TipoNotificacion` con los 23 tipos del catálogo | ✅ |
| Tipo `Notificacion` con todos los campos requeridos | ✅ |
| Tipo `CrearNotificacionPayload` (auxiliar) | ✅ |
| Tipo `NotificacionUsuario` para subcolección de usuario | ✅ |
| Tipo `PreferenciasNotificacion` con reglas de desactivación | ✅ |
| Catálogo M1: 3 eventos con disparador, destinatario, canal, acción requerida, prioridad y expiración | ✅ |
| Catálogo M2: 7 eventos con tabla completa | ✅ |
| Catálogo M3: 13 eventos con tabla completa + nota sobre `M3_SRS_APROBADO` | ✅ |
| Estructura Firestore: colección raíz + subcolección por usuario | ✅ |
| Cloud Function generador `onEventoSistema` con triggers de ejemplo | ✅ |
| Función `obtenerDestinatarios` con mapa completo de los 23 tipos | ✅ |
| Cloud Function `enviarEmailNotificacion` con SendGrid + verificación de preferencias | ✅ |
| Cloud Function programada `limpiarNotificacionesExpiradas` (cada hora) | ✅ |
| Hook `useNotificaciones` para listener in-app en tiempo real | ✅ |
| Tabla de escalamiento con 11 tipos de notificación crítica | ✅ |
| Reglas generales de escalamiento (alta → critica en 48h, critica → admin en 24h) | ✅ |
| Función `dispararEscalamiento` con código y registro en T-03 | ✅ |
| Estructura de la pantalla `/notificaciones` con filtros y vista de detalle | ✅ |
| Componente `NotificacionesBadge` con regla de conteo exclusivo para acción requerida | ✅ |
| Tabla de preferencias por prioridad con restricciones de `critica` | ✅ |
| Conexión con T-01 (roles → destinatarios) | ✅ |
| Conexión con T-03 (auditoría de notificaciones críticas sin accionar) | ✅ |
| Conexión con T-05 (widget en dashboard) | ✅ |
| Todo en español con terminología consistente con T-01 y M1/M2/M3 | ✅ |

---

*Documento generado para el sistema austranet-cco · Capa Transversal · T-02 de 6*
