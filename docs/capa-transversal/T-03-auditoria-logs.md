<!-- ============================================================
  AUSTRANET-CCO — CAPA TRANSVERSAL
  Archivo:  T-03-auditoria-logs.md
  Capa:     Transversal
  Elemento: 3 de 6
  Sirve a:  M1 · M2 · M3 · T-01 · T-02 · T-04 · T-05 · T-06
  Prerrequisitos: T-01 (identidad del actor) · T-02 (eventos críticos no accionados)
  Stack:    Firebase Firestore (colección inmutable) · Cloud Functions · GCP Cloud Logging
  Versión:  1.0
  Fecha:    2026-02-27
  Estado:   activo
  Autor:    austranet-cco
  ============================================================ -->

# T-03-auditoria-logs.md

> **Capa Transversal — Elemento 3 de 6**
> **Log de Auditoría e Historial de Cambios**
> *Componente que sirve a todos los módulos y elementos transversales del sistema*

> ⚠️ **PROPIEDAD FUNDAMENTAL:** La colección `auditoria` es **write-only e inmutable**.
> Ningún usuario del sistema — incluyendo `superadmin` — puede editar o eliminar
> una entrada una vez creada. Esta restricción es absoluta y sin excepciones.

---

## 1. Metadatos del Documento

| Campo | Valor |
|---|---|
| **Nombre del archivo** | `T-03-auditoria-logs.md` |
| **Capa** | Transversal |
| **Posición** | Elemento 3 de 6 |
| **Módulos que sirve** | M1 · M2 · M3 · T-01 · T-02 · T-04 · T-05 · T-06 (todos) |
| **Prerrequisitos** | T-01 — Autenticación y Roles (identidad del actor) · T-02 — Notificaciones (eventos críticos sin accionar) |
| **Stack** | Firebase Firestore (colección inmutable) · Cloud Functions (triggers) · GCP Cloud Logging (logs técnicos opcionales) |
| **Versión** | 1.0 |
| **Fecha** | 2026-02-27 |
| **Estado** | `activo` — listo para implementación |
| **Sistema de referencia** | austranet-cco |
| **Dependencias directas** | T-01, T-02, M1-01, M2-01, M3-01 |

---

## 2. Objetivo del Documento

### Por qué la auditoría es una necesidad del sistema — no un "nice to have"

El log de auditoría de austranet-cco cumple cuatro roles críticos que justifican su existencia como elemento obligatorio de la Capa Transversal:

**1. Trazabilidad legal del SRS.** El SRS producido en M3 es un contrato técnico firmado por el cliente. Una vez aprobado (Gate 2), cualquier modificación a un requerimiento tiene implicaciones legales directas: puede constituir un cambio de alcance, generar costos adicionales o invalidar compromisos contractuales previos. El log debe registrar cada cambio post-aprobación con el actor, el timestamp del servidor, el valor anterior y el valor nuevo. Sin este registro, el sistema no puede responder a disputas contractuales con evidencia objetiva.

**2. Reconstrucción cronológica de proyectos.** Los cambios de estado de un proyecto en M2 — de `iniciado` a `en ejecución`, de `en ejecución` a `pausado`, de `pausado` a `cancelado` — son decisiones de negocio que afectan recursos, contratos y expectativas del cliente. El log permite reconstruir la historia completa de cualquier proyecto como una línea de tiempo auditable, lo que es indispensable para post-mortems, disputas y auditorías externas.

**3. Seguridad y acceso rastreable.** El sistema gestiona datos sensibles: NDAs, requerimientos confidenciales de clientes, estructuras organizacionales. Todo acceso, modificación y denegación debe quedar registrado con la identidad del actor (T-01) y los datos de sesión. Esto no solo protege al sistema ante ataques, sino que disuade el mal uso por parte de usuarios autorizados.

**4. Insumo para mejora de procesos (M2-08).** El módulo de mejora de procesos necesita datos históricos confiables para calcular tendencias de precisión de estimaciones, frecuencia de riesgos materializados y tasas de iteración del SRS. Si esos datos pueden ser alterados, los análisis de M2-08 carecen de validez estadística.

### Tres categorías de log — qué cubre T-03

| Categoría | Qué registra | Dónde vive | Quién lo lee |
|---|---|---|---|
| **Log de negocio** | Acciones sobre entidades del dominio: crear entidad, aprobar SRS, cambiar estado de proyecto | Firestore `auditoria/` | admin, gestor (sus proyectos), M2-08 |
| **Log de seguridad** | Logins, accesos denegados, cambios de roles, intentos fallidos | Firestore `auditoria/` (misma colección, `modulo: 'T01'`) | admin, superadmin |
| **Log técnico** | Errores de Cloud Functions, timeouts, excepciones no manejadas | GCP Cloud Logging (externo a Firestore) | superadmin, equipo de infraestructura |

> T-03 documenta y gestiona el **log de negocio** y el **log de seguridad**. El log técnico usa GCP Cloud Logging directamente y está fuera del alcance de este documento.

---

## 3. Tipos TypeScript

```typescript
// types/auditoria.ts — austranet-cco

// ─── Enum de acciones auditables ──────────────────────────────────────────────
// Catálogo completo — ver descripción detallada en §4

export type AccionAuditoria =
  // Módulo 1 — Entidades
  | 'M1_ENTIDAD_CREADA'
  | 'M1_ENTIDAD_EDITADA'
  | 'M1_ENTIDAD_ELIMINADA'
  | 'M1_STAKEHOLDER_CREADO'
  | 'M1_STAKEHOLDER_EDITADO'
  | 'M1_GLOSARIO_TERMINO_AGREGADO'
  | 'M1_NIVEL_RIESGO_CAMBIADO'
  // Módulo 2 — Proyectos
  | 'M2_PROYECTO_CREADO'
  | 'M2_PROYECTO_ESTADO_CAMBIADO'
  | 'M2_PROYECTO_ELIMINADO'
  | 'M2_ESTIMACION_REGISTRADA'
  | 'M2_ESTIMACION_MODIFICADA'
  | 'M2_RIESGO_CREADO'
  | 'M2_RIESGO_ESTADO_CAMBIADO'
  | 'M2_RIESGO_MATERIALIZADO'
  | 'M2_HITO_CERRADO'
  | 'M2_HITO_VENCIDO_SIN_CERRAR'
  | 'M2_METODOLOGIA_ACORDADA'
  | 'M2_PRESUPUESTO_DESVIACION_CRITICA'
  | 'M2_LECCION_APRENDIDA_REGISTRADA'
  | 'M2_PLAN_MEJORA_CREADO'
  // Módulo 3 — SRS
  | 'M3_SRS_CREADO'
  | 'M3_SRS_ESTADO_CAMBIADO'
  | 'M3_GATE1_GO'
  | 'M3_GATE1_NO_GO'
  | 'M3_REQUERIMIENTO_CREADO'
  | 'M3_REQUERIMIENTO_APROBADO'
  | 'M3_REQUERIMIENTO_RECHAZADO'
  | 'M3_REQUERIMIENTO_MODIFICADO_POST_APROBACION'
  | 'M3_MOSCOW_PRIORIDAD_CAMBIADA'
  | 'M3_ITERACION_BUCLE_REGISTRADA'
  | 'M3_PROTOTIPO_EVALUADO'
  | 'M3_GATE2_SRS_APROBADO'
  | 'M3_SRS_VERSION_CREADA'
  | 'M3_TRAZABILIDAD_RF_VINCULADA'
  | 'M3_CCB_SOLICITUD_CAMBIO_CREADA'
  | 'M3_CCB_CAMBIO_APROBADO'
  | 'M3_CCB_CAMBIO_RECHAZADO'
  // Capa Transversal
  | 'T01_USUARIO_CREADO'
  | 'T01_USUARIO_ROL_CAMBIADO'
  | 'T01_USUARIO_DESACTIVADO'
  | 'T01_LOGIN_EXITOSO'
  | 'T01_LOGIN_FALLIDO'
  | 'T01_ACCESO_DENEGADO'
  | 'T02_NOTIFICACION_CRITICA_NO_ACCIONADA'
  // Correcciones (meta-auditoría)
  | 'AUDITORIA_CORRECCION'

export type CriticidadAuditoria = 'critico' | 'alto' | 'medio' | 'bajo'

export type ModuloAuditoria =
  | 'M1' | 'M2' | 'M3'
  | 'T01' | 'T02' | 'T03' | 'T04' | 'T05' | 'T06'

// ─── Tipo principal: EntradaAuditoria ─────────────────────────────────────────

export interface EntradaAuditoria {
  // ─── Identidad del registro ─────────────────────────────────────
  id: string                         // UUID inmutable — nunca reutilizable
  timestamp: Date                    // SIEMPRE serverTimestamp() — nunca new Date() del cliente
  inmutable: true                    // campo constante — recordatorio explícito

  // ─── Actor (snapshot al momento del evento) ─────────────────────
  actor: {
    uid: string                      // UID de T-01 — 'sistema' si es automático (Cloud Function)
    nombre: string                   // snapshot: nombre del usuario en el momento del evento
    rol: string                      // snapshot: rol del usuario en el momento del evento
    ip?: string                      // IP del cliente si está disponible vía Cloud Function
    userAgent?: string               // navegador / dispositivo
    sesionId: string                 // ID de sesión Firebase Auth para agrupar acciones
  }

  // ─── Clasificación del evento ───────────────────────────────────
  accion: AccionAuditoria
  modulo: ModuloAuditoria
  criticidad: CriticidadAuditoria

  // ─── Entidad afectada (snapshot al momento del evento) ──────────
  entidad: {
    tipo: string                     // 'Entidad' | 'Proyecto' | 'SRS' | 'Requerimiento' | 'Usuario' | etc.
    id: string                       // ID del documento afectado en Firestore
    nombre: string                   // snapshot: nombre de la entidad en el momento del evento
  }

  // ─── Descripción legible ────────────────────────────────────────
  descripcion: string                // texto en español legible por humanos — qué ocurrió exactamente

  // ─── Campos modificados (solo para acciones UPDATE) ─────────────
  camposModificados?: {
    campo: string
    valorAnterior: unknown           // snapshot del valor antes del cambio
    valorNuevo: unknown              // snapshot del valor después del cambio
  }[]

  // ─── Resultado ──────────────────────────────────────────────────
  resultado: 'exitoso' | 'fallido' | 'bloqueado'
  motivoBloqueo?: string             // si resultado = 'bloqueado': qué regla de T-01 lo impidió

  // ─── Vínculos con otros elementos transversales ─────────────────
  notificacionRelacionada?: string   // ID de Notificacion de T-02 (si aplica)
  entradaCorreccionDe?: string       // si accion = AUDITORIA_CORRECCION: ID de entrada que corrige
}

// ─── Tipos auxiliares ─────────────────────────────────────────────────────────

/**
 * Payload que reciben las Cloud Functions para crear una entrada de auditoría.
 * El id, timestamp e inmutable los genera registrarAuditoria() — no el llamador.
 */
export type EntradaAuditoriaInput = Omit<
  EntradaAuditoria,
  'id' | 'timestamp' | 'inmutable'
>

/** Política de retención — determina si la entrada se archiva o queda permanente */
export type PoliticaRetencion =
  | 'permanente'   // nunca se mueve de auditoria/
  | '5_anios'      // se mueve a auditoria_archivo/ a los 5 años
  | '2_anios'      // se mueve a auditoria_archivo/ a los 2 años
  | '1_anio'       // se mueve a auditoria_archivo/ al año
  | '90_dias'      // se mueve a auditoria_archivo/ a los 90 días

/** Mapa de retención por acción — usado por la Cloud Function scheduled de archivado */
export const RETENCION_POR_ACCION: Record<AccionAuditoria, PoliticaRetencion> = {
  // M1
  M1_ENTIDAD_CREADA:                         'permanente',
  M1_ENTIDAD_EDITADA:                        'permanente',
  M1_ENTIDAD_ELIMINADA:                      'permanente',
  M1_STAKEHOLDER_CREADO:                     '5_anios',
  M1_STAKEHOLDER_EDITADO:                    '5_anios',
  M1_GLOSARIO_TERMINO_AGREGADO:              '2_anios',
  M1_NIVEL_RIESGO_CAMBIADO:                  'permanente',
  // M2
  M2_PROYECTO_CREADO:                        'permanente',
  M2_PROYECTO_ESTADO_CAMBIADO:               'permanente',
  M2_PROYECTO_ELIMINADO:                     'permanente',
  M2_ESTIMACION_REGISTRADA:                  'permanente',
  M2_ESTIMACION_MODIFICADA:                  'permanente',
  M2_RIESGO_CREADO:                          '5_anios',
  M2_RIESGO_ESTADO_CAMBIADO:                 '5_anios',
  M2_RIESGO_MATERIALIZADO:                   'permanente',
  M2_HITO_CERRADO:                           'permanente',
  M2_HITO_VENCIDO_SIN_CERRAR:               'permanente',
  M2_METODOLOGIA_ACORDADA:                   'permanente',
  M2_PRESUPUESTO_DESVIACION_CRITICA:         'permanente',
  M2_LECCION_APRENDIDA_REGISTRADA:           'permanente',
  M2_PLAN_MEJORA_CREADO:                     'permanente',
  // M3
  M3_SRS_CREADO:                             'permanente',
  M3_SRS_ESTADO_CAMBIADO:                    'permanente',
  M3_GATE1_GO:                               'permanente',
  M3_GATE1_NO_GO:                            'permanente',
  M3_REQUERIMIENTO_CREADO:                   'permanente',
  M3_REQUERIMIENTO_APROBADO:                 'permanente',
  M3_REQUERIMIENTO_RECHAZADO:                'permanente',
  M3_REQUERIMIENTO_MODIFICADO_POST_APROBACION: 'permanente',
  M3_MOSCOW_PRIORIDAD_CAMBIADA:              'permanente',
  M3_ITERACION_BUCLE_REGISTRADA:             '5_anios',
  M3_PROTOTIPO_EVALUADO:                     '5_anios',
  M3_GATE2_SRS_APROBADO:                     'permanente',
  M3_SRS_VERSION_CREADA:                     'permanente',
  M3_TRAZABILIDAD_RF_VINCULADA:              'permanente',
  M3_CCB_SOLICITUD_CAMBIO_CREADA:            'permanente',
  M3_CCB_CAMBIO_APROBADO:                    'permanente',
  M3_CCB_CAMBIO_RECHAZADO:                   'permanente',
  // T
  T01_USUARIO_CREADO:                        'permanente',
  T01_USUARIO_ROL_CAMBIADO:                  'permanente',
  T01_USUARIO_DESACTIVADO:                   'permanente',
  T01_LOGIN_EXITOSO:                         '90_dias',
  T01_LOGIN_FALLIDO:                         '1_anio',
  T01_ACCESO_DENEGADO:                       '2_anios',
  T02_NOTIFICACION_CRITICA_NO_ACCIONADA:     '2_anios',
  AUDITORIA_CORRECCION:                      'permanente',
}
```

---

## 4. Catálogo Completo de Acciones Auditables

### 4.1 Módulo 1 — Registro de Entidades

| AccionAuditoria | Descripción | Criticidad | `camposModificados` | Retención |
|---|---|:---:|:---:|---|
| `M1_ENTIDAD_CREADA` | Nueva entidad registrada en el sistema con todos sus campos iniciales | critico | ❌ | Permanente |
| `M1_ENTIDAD_EDITADA` | Edición de cualquier campo del perfil de una entidad existente | alto | ✅ | Permanente |
| `M1_ENTIDAD_ELIMINADA` | Eliminación de entidad — snapshot completo del perfil en `descripcion` | critico | ❌ | Permanente |
| `M1_STAKEHOLDER_CREADO` | Nuevo stakeholder vinculado a una entidad | medio | ❌ | 5 años |
| `M1_STAKEHOLDER_EDITADO` | Edición de datos de un stakeholder existente | medio | ✅ | 5 años |
| `M1_GLOSARIO_TERMINO_AGREGADO` | Nuevo término agregado al glosario de dominio de una entidad | bajo | ❌ | 2 años |
| `M1_NIVEL_RIESGO_CAMBIADO` | Cambio del `nivelRiesgo` de una entidad — incluye valorAnterior y valorNuevo | critico | ✅ | Permanente |

---

### 4.2 Módulo 2 — Gestión de Proyectos

| AccionAuditoria | Descripción | Criticidad | `camposModificados` | Retención |
|---|---|:---:|:---:|---|
| `M2_PROYECTO_CREADO` | Nuevo proyecto registrado en el sistema | critico | ❌ | Permanente |
| `M2_PROYECTO_ESTADO_CAMBIADO` | Transición de estado del proyecto (ej: `iniciado` → `en_ejecucion`) | critico | ✅ | Permanente |
| `M2_PROYECTO_ELIMINADO` | Eliminación de proyecto — snapshot completo en `descripcion` | critico | ❌ | Permanente |
| `M2_ESTIMACION_REGISTRADA` | Primera estimación de esfuerzo / costo registrada para el proyecto | alto | ❌ | Permanente |
| `M2_ESTIMACION_MODIFICADA` | Revisión de estimación existente — incluye valorAnterior y valorNuevo | alto | ✅ | Permanente |
| `M2_RIESGO_CREADO` | Nuevo riesgo identificado y registrado en el proyecto | medio | ❌ | 5 años |
| `M2_RIESGO_ESTADO_CAMBIADO` | Cambio de estado de un riesgo (ej: `identificado` → `mitigado`) | alto | ✅ | 5 años |
| `M2_RIESGO_MATERIALIZADO` | Riesgo que transiciona a estado `materializado` | critico | ❌ | Permanente |
| `M2_HITO_CERRADO` | Hito cerrado exitosamente dentro del plazo | alto | ❌ | Permanente |
| `M2_HITO_VENCIDO_SIN_CERRAR` | Hito cuya `fechaLimite` expiró sin cerrarse | critico | ❌ | Permanente |
| `M2_METODOLOGIA_ACORDADA` | Metodología de trabajo registrada y aceptada por el cliente | critico | ✅ | Permanente |
| `M2_PRESUPUESTO_DESVIACION_CRITICA` | Gasto real supera el 80% del presupuesto estimado | critico | ❌ | Permanente |
| `M2_LECCION_APRENDIDA_REGISTRADA` | Nueva lección aprendida documentada al cierre o durante el proyecto | medio | ❌ | Permanente |
| `M2_PLAN_MEJORA_CREADO` | Plan de mejora de procesos creado a partir de análisis de M2-08 | alto | ❌ | Permanente |

---

### 4.3 Módulo 3 — Documentación SRS

| AccionAuditoria | Descripción | Criticidad | `camposModificados` | Retención |
|---|---|:---:|:---:|---|
| `M3_SRS_CREADO` | Nuevo documento SRS iniciado para un proyecto | critico | ❌ | Permanente |
| `M3_SRS_ESTADO_CAMBIADO` | Transición de fase del SRS (ej: `fase_2` → `fase_3`) | critico | ✅ | Permanente |
| `M3_GATE1_GO` | Decisión de GO en Gate 1 — proyecto avanza a especificación | critico | ❌ | Permanente |
| `M3_GATE1_NO_GO` | Decisión de NO-GO en Gate 1 — proyecto cancelado; snapshot de factibilidad en `descripcion` | critico | ❌ | Permanente |
| `M3_REQUERIMIENTO_CREADO` | Nuevo RF, RNF o RD creado en el SRS | medio | ❌ | Permanente |
| `M3_REQUERIMIENTO_APROBADO` | Requerimiento aprobado y formalizado en el SRS | critico | ❌ | Permanente |
| `M3_REQUERIMIENTO_RECHAZADO` | Requerimiento rechazado — `motivoBloqueo` contiene la justificación | alto | ❌ | Permanente |
| `M3_REQUERIMIENTO_MODIFICADO_POST_APROBACION` | ⚠️ Modificación de requerimiento ya aprobado — requiere SCR asociada; `camposModificados` completos obligatorios | **critico** | ✅ | Permanente |
| `M3_MOSCOW_PRIORIDAD_CAMBIADA` | Cambio de clasificación MoSCoW de un requerimiento | alto | ✅ | Permanente |
| `M3_ITERACION_BUCLE_REGISTRADA` | Registro de una iteración en el bucle Fase 3→2 o Fase 4→2 | medio | ❌ | 5 años |
| `M3_PROTOTIPO_EVALUADO` | Evaluación de prototipo registrada (aceptado / rechazado / observaciones) | medio | ❌ | 5 años |
| `M3_GATE2_SRS_APROBADO` | SRS v1.0 aprobado y firmado por el cliente — snapshot del estado completo en `descripcion` | critico | ❌ | Permanente |
| `M3_SRS_VERSION_CREADA` | Nueva versión del SRS creada (post-aprobación vía CCB) | critico | ✅ | Permanente |
| `M3_TRAZABILIDAD_RF_VINCULADA` | RF Must Have vinculado a stakeholder fuente y caso de prueba | medio | ❌ | Permanente |
| `M3_CCB_SOLICITUD_CAMBIO_CREADA` | Solicitud de cambio (SCR) creada ante el Change Control Board | critico | ❌ | Permanente |
| `M3_CCB_CAMBIO_APROBADO` | SCR aprobada por el CCB — cambio al SRS autorizado | critico | ❌ | Permanente |
| `M3_CCB_CAMBIO_RECHAZADO` | SCR rechazada por el CCB — cambio al SRS denegado | alto | ❌ | Permanente |

> ⚠️ **`M3_REQUERIMIENTO_MODIFICADO_POST_APROBACION`** es la acción de mayor sensibilidad legal del sistema. Toda entrada de este tipo debe incluir obligatoriamente: el `id` de la SCR asociada en `descripcion`, los `camposModificados` completos con `valorAnterior` y `valorNuevo`, y el `uid` del actor con snapshot de su rol en el momento del cambio.

---

### 4.4 Capa Transversal

| AccionAuditoria | Descripción | Criticidad | `camposModificados` | Retención |
|---|---|:---:|:---:|---|
| `T01_USUARIO_CREADO` | Nuevo usuario creado en el sistema por un admin | critico | ❌ | Permanente |
| `T01_USUARIO_ROL_CAMBIADO` | Cambio de rol de un usuario existente — valorAnterior y valorNuevo del rol | critico | ✅ | Permanente |
| `T01_USUARIO_DESACTIVADO` | Usuario desactivado (`activo = false`) — registro de quién y por qué | critico | ❌ | Permanente |
| `T01_LOGIN_EXITOSO` | Login exitoso de un usuario en el sistema | bajo | ❌ | 90 días |
| `T01_LOGIN_FALLIDO` | Intento de login fallido — credenciales incorrectas o cuenta inactiva | medio | ❌ | 1 año |
| `T01_ACCESO_DENEGADO` | Acceso a ruta o recurso denegado por las reglas de T-01 — `motivoBloqueo` obligatorio | alto | ❌ | 2 años |
| `T02_NOTIFICACION_CRITICA_NO_ACCIONADA` | Notificación crítica de T-02 que expiró sin ser accionada — creada automáticamente por T-02 | alto | ❌ | 2 años |
| `AUDITORIA_CORRECCION` | Meta-registro que documenta una corrección a una entrada errónea previa — la original queda intacta | critico | ❌ | Permanente |

---

## 5. Regla de Inmutabilidad

> ### ⚠️ EL LOG DE AUDITORÍA ES WRITE-ONLY. ESTA RESTRICCIÓN ES ABSOLUTA.
>
> Ningún usuario del sistema — incluyendo `superadmin` — puede editar o eliminar
> una entrada de la colección `auditoria` una vez creada. No existen excepciones
> operacionales. Esta propiedad es la base de la confiabilidad legal del sistema.

### 5.1 Implementación en Reglas de Firestore

```javascript
// firestore.rules — sección auditoria

match /auditoria/{entradaId} {
  // LECTURA: solo admin y superadmin pueden leer el log completo
  // gestor puede leer entradas de sus proyectos (ver §7)
  allow read: if esAutenticado() && usuarioActivo() && (
    esAdmin() ||
    (esGestor() && resource.data.entidad.id in
      get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.proyectosAsignados)
  );

  // ESCRITURA: SOLO la service account de Cloud Functions puede escribir
  // Ningún usuario — ni siquiera superadmin — puede crear entradas directamente
  allow create: if false;  // bloqueado para todos los clientes
  allow update: if false;  // INMUTABLE — nunca se actualiza
  allow delete: if false;  // INMUTABLE — nunca se elimina
}

match /auditoria_archivo/{entradaId} {
  // Mismo esquema de reglas — solo admin lee, nadie escribe/edita/elimina
  allow read: if esAutenticado() && usuarioActivo() && esAdmin();
  allow create: if false;
  allow update: if false;
  allow delete: if false;
}
```

> La escritura real al log solo ocurre desde Cloud Functions usando la **Firebase Admin SDK** (service account), que omite las reglas de Firestore por diseño. Esto es intencional y es la única vía de escritura permitida.

### 5.2 Cómo Corregir una Entrada Errónea

Si se detecta que una entrada de auditoría contiene información incorrecta (por ejemplo, el nombre del actor fue capturado mal por un bug), el procedimiento correcto es:

1. **No tocar la entrada original.** Queda como está en `auditoria/{id}`.
2. **Crear una nueva entrada** con `accion: 'AUDITORIA_CORRECCION'`.
3. En el campo `descripcion` de la nueva entrada: documentar qué información es incorrecta, cuál es la información correcta y la causa del error.
4. En el campo `entradaCorreccionDe`: incluir el `id` de la entrada original que se corrige.

```typescript
// Ejemplo de entrada de corrección
const correccion: EntradaAuditoriaInput = {
  actor: { uid: adminUid, nombre: 'Admin Sistema', rol: 'admin', sesionId: '...' },
  accion: 'AUDITORIA_CORRECCION',
  modulo: 'M3',
  criticidad: 'critico',
  entidad: {
    tipo: 'EntradaAuditoria',
    id: 'entrada-original-id-abc123',
    nombre: 'Corrección de entrada de auditoría'
  },
  descripcion: 'La entrada abc123 registró incorrectamente el nombre del actor como "undefined" ' +
    'debido a un bug en la captura del snapshot. El actor correcto era Juan Pérez (uid: xyz789, rol: analista).',
  resultado: 'exitoso',
  entradaCorreccionDe: 'entrada-original-id-abc123',
}
```

### 5.3 Política de Retención — Archivado, No Eliminación

Las entradas con retención limitada **no se eliminan** al vencer su período — se **mueven** a la colección `auditoria_archivo/`. La distinción es crítica: archivar preserva el dato, eliminar lo destruye.

```
Firestore
├── auditoria/              ← entradas activas (retención vigente)
│   └── {entradaId}/
└── auditoria_archivo/      ← entradas archivadas (retención vencida)
    └── {entradaId}/        ← mismo documento, mismo ID, campo archivadoEn: Timestamp
```

```typescript
// functions/src/auditoria/archivarEntradasVencidas.ts
// Cloud Function scheduled — corre diariamente

export const archivarEntradasVencidas = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async () => {
    const db = admin.firestore()
    const ahora = new Date()

    // Obtener entradas con política de retención no permanente que superaron su plazo
    const vencidas = await db.collection('auditoria')
      .where('politicaRetencion', '!=', 'permanente')
      .where('fechaArchivado', '<=', ahora)
      .get()

    for (const doc of vencidas.docs) {
      const datos = doc.data()
      const archivoRef = db.collection('auditoria_archivo').doc(doc.id)

      // Copiar a auditoria_archivo con campo adicional
      await archivoRef.set({ ...datos, archivadoEn: admin.firestore.FieldValue.serverTimestamp() })

      // Eliminar de auditoria activa (la copia en archivo queda permanente)
      await doc.ref.delete()
    }
  })
```

---

## 6. Implementación con Cloud Functions

### 6.1 Función Central `registrarAuditoria`

```typescript
// functions/src/auditoria/registrarAuditoria.ts

import * as admin from 'firebase-admin'
import { EntradaAuditoriaInput, RETENCION_POR_ACCION } from '../types/auditoria'

const db = admin.firestore()

/**
 * Función central de escritura al log de auditoría.
 * SOLO debe llamarse desde otras Cloud Functions — nunca desde el cliente.
 * Implementa reintentos con backoff exponencial (hasta 3 intentos).
 */
export async function registrarAuditoria(
  payload: EntradaAuditoriaInput,
  intento: number = 1
): Promise<string | null> {
  try {
    const entradaRef = db.collection('auditoria').doc()

    // Calcular fecha de archivado según política de retención
    const politica = RETENCION_POR_ACCION[payload.accion]
    const fechaArchivado = calcularFechaArchivado(politica)

    await entradaRef.set({
      ...payload,
      id: entradaRef.id,
      inmutable: true,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      politicaRetencion: politica,
      ...(fechaArchivado && { fechaArchivado }),
    })

    return entradaRef.id

  } catch (error) {
    if (intento < 3) {
      // Backoff exponencial: 1s, 2s, 4s
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, intento - 1)))
      return registrarAuditoria(payload, intento + 1)
    }

    // Después de 3 intentos fallidos: registrar en GCP Cloud Logging (no en Firestore)
    console.error('[AUDITORIA_CRITICA] Fallo al registrar entrada después de 3 intentos:', {
      accion: payload.accion,
      actor: payload.actor.uid,
      entidad: payload.entidad.id,
      error,
    })

    // La operación de negocio NO se revierte — solo se pierde el log
    return null
  }
}

function calcularFechaArchivado(politica: string): Date | null {
  const ahora = new Date()
  const mapa: Record<string, number> = {
    '90_dias':  90,
    '1_anio':   365,
    '2_anios':  730,
    '5_anios':  1825,
  }
  const dias = mapa[politica]
  if (!dias) return null // permanente — sin fecha de archivado
  return new Date(ahora.getTime() + dias * 24 * 60 * 60 * 1000)
}
```

### 6.2 Patrón de Uso desde Otras Cloud Functions

```typescript
// functions/src/m3/aprobarSRS.ts — ejemplo de integración

import { registrarAuditoria } from '../auditoria/registrarAuditoria'

export const aprobarSRSGate2 = functions.https.onCall(async (data, context) => {
  const { srsId, proyectoId } = data
  const uid = context.auth?.uid

  if (!uid) throw new functions.https.HttpsError('unauthenticated', 'No autenticado')

  // 1. Verificar permisos (T-01)
  const usuario = await obtenerUsuario(uid)
  if (usuario.rol !== 'gestor' && usuario.rol !== 'admin') {
    // Registrar acceso denegado antes de lanzar el error
    await registrarAuditoria({
      actor: { uid, nombre: usuario.nombre, rol: usuario.rol, sesionId: data.sesionId },
      accion: 'T01_ACCESO_DENEGADO',
      modulo: 'M3',
      criticidad: 'alto',
      entidad: { tipo: 'SRS', id: srsId, nombre: data.srsNombre },
      descripcion: `Intento de aprobación de Gate 2 bloqueado. Rol '${usuario.rol}' no tiene permiso.`,
      resultado: 'bloqueado',
      motivoBloqueo: `Rol requerido: 'gestor' o 'admin'. Rol del actor: '${usuario.rol}'`,
    })
    throw new functions.https.HttpsError('permission-denied', 'Sin permisos para aprobar Gate 2')
  }

  // 2. Leer el documento ANTES de modificar (para camposModificados)
  const srsSnap = await db.collection('documentosSRS').doc(srsId).get()
  const srsAntes = srsSnap.data()

  // 3. Ejecutar la operación de negocio
  await db.collection('documentosSRS').doc(srsId).update({
    estado: 'aprobado',
    version: '1.0',
    fechaAprobacion: admin.firestore.FieldValue.serverTimestamp(),
    aprobadoPor: uid,
  })

  // 4. Registrar en auditoría DESPUÉS de la operación exitosa
  await registrarAuditoria({
    actor: { uid, nombre: usuario.nombre, rol: usuario.rol, sesionId: data.sesionId },
    accion: 'M3_GATE2_SRS_APROBADO',
    modulo: 'M3',
    criticidad: 'critico',
    entidad: { tipo: 'SRS', id: srsId, nombre: srsAntes?.proyectoNombre ?? srsId },
    descripcion: `SRS v1.0 aprobado y firmado para el proyecto "${srsAntes?.proyectoNombre}". ` +
      `Total requerimientos: ${srsAntes?.totalRequerimientos ?? 'N/D'}. ` +
      `Aprobado por: ${usuario.nombre} (${uid}).`,
    camposModificados: [
      { campo: 'estado', valorAnterior: srsAntes?.estado, valorNuevo: 'aprobado' },
      { campo: 'version', valorAnterior: srsAntes?.version, valorNuevo: '1.0' },
    ],
    resultado: 'exitoso',
  })

  // 5. El trigger M3_SRS_APROBADO en T-02 se disparará por el onChange de Firestore
  return { exito: true }
})
```

### 6.3 Reglas de Atomicidad

| Escenario | Comportamiento |
|---|---|
| Operación de negocio **exitosa** → auditoría exitosa | Flujo normal — ambas operaciones completas |
| Operación de negocio **fallida** → no se registra auditoría | La entrada de auditoría no se crea (no hay nada que auditar) |
| Operación de negocio **exitosa** → auditoría **falla** (1er intento) | Se reintenta hasta 3 veces con backoff exponencial (1s, 2s, 4s) |
| Operación de negocio **exitosa** → auditoría **falla** (3 intentos agotados) | Se registra en GCP Cloud Logging como error crítico. La operación de negocio **no se revierte**. |
| Acción de negocio **bloqueada** por T-01 → se registra `T01_ACCESO_DENEGADO` | El log del intento bloqueado siempre se registra, incluso si la operación no se ejecutó |

---

## 7. Acceso al Log — UI y Roles

### 7.1 Permisos de Acceso por Rol

| Rol (T-01) | Acceso al log | Alcance |
|---|---|---|
| `superadmin` | ✅ Completo | Toda la aplicación — todos los módulos y todas las entradas |
| `admin` | ✅ Completo | Toda la aplicación — todos los módulos y todas las entradas |
| `gestor` | ✅ Parcial | Solo entradas de M2 y M3 de los proyectos en su `proyectosAsignados` |
| `analista` | ❌ Sin acceso | No puede consultar el log directamente |
| `viewer` | ❌ Sin acceso | No puede consultar el log directamente |

### 7.2 Pantalla `/auditoria`

```
/auditoria
├── Header
│   ├── Título: "Log de Auditoría"
│   └── Botón: "Exportar a CSV" (solo admin)
│
├── Barra de filtros
│   ├── Módulo: [M1] [M2] [M3] [T-01] [T-02] [Todos]
│   ├── Acción: selector con todos los AccionAuditoria
│   ├── Actor: búsqueda por nombre o UID
│   ├── Entidad: búsqueda por ID o nombre de entidad
│   ├── Rango de fechas: desde / hasta
│   ├── Resultado: [Exitoso] [Fallido] [Bloqueado]
│   └── Criticidad: [Crítico] [Alto] [Medio] [Bajo]
│
├── Vista de lista (por defecto)
│   └── Fila de entrada
│       ├── Timestamp relativo + absoluto
│       ├── Indicador de criticidad (color)
│       ├── Badge de módulo
│       ├── AccionAuditoria (código + descripción legible)
│       ├── Actor: nombre + rol
│       ├── Entidad afectada: tipo + nombre
│       └── Resultado: exitoso / fallido / bloqueado
│
├── Vista de línea de tiempo por entidad (/auditoria/entidad/{id})
│   ├── Todas las entradas de auditoría de un proyecto o SRS específico
│   ├── Ordenadas cronológicamente (ascendente — historia desde el inicio)
│   ├── Agrupadas por fase del proyecto
│   └── Útil para reconstrucción de disputas contractuales
│
└── Vista "Accesos denegados" (/auditoria/accesos-denegados)
    ├── Solo entradas con resultado = 'bloqueado'
    ├── Agrupadas por actor (¿quién intenta acceder fuera de sus permisos?)
    └── Alerta si un mismo actor acumula > 5 accesos denegados en 24h
```

### 7.3 Exportación a CSV

La exportación a CSV está disponible para `admin` y `superadmin` desde el panel de filtros. Genera un archivo con todas las entradas que coinciden con los filtros activos. Campos exportados:

```
id, timestamp, actor.uid, actor.nombre, actor.rol, actor.ip,
accion, modulo, criticidad, entidad.tipo, entidad.id, entidad.nombre,
descripcion, resultado, motivoBloqueo, notificacionRelacionada
```

> Los `camposModificados` no se exportan a CSV por su estructura anidada — se acceden desde la vista de detalle individual.

---

## 8. Conexión con M2-08 (Mejora de Procesos)

El log de auditoría es la **fuente de datos primaria** para todos los análisis estadísticos de M2-08. La confiabilidad de los análisis depende directamente de la inmutabilidad del log (§5): si las entradas pudieran modificarse, los promedios y tendencias calculados por M2-08 carecerían de validez.

### 8.1 Consultas de Firestore que Ejecuta M2-08

```typescript
// Análisis 1: Tendencia de precisión de estimaciones por proyecto
// Requiere índice compuesto: (accion ASC, modulo ASC, timestamp ASC)
const estimaciones = await db.collection('auditoria')
  .where('accion', 'in', ['M2_ESTIMACION_REGISTRADA', 'M2_ESTIMACION_MODIFICADA'])
  .where('modulo', '==', 'M2')
  .orderBy('timestamp', 'asc')
  .get()

// Análisis 2: Riesgos materializados por tipo de proyecto
// Requiere índice compuesto: (accion ASC, entidad.id ASC, timestamp ASC)
const riesgosMaterializados = await db.collection('auditoria')
  .where('accion', '==', 'M2_RIESGO_MATERIALIZADO')
  .orderBy('timestamp', 'desc')
  .get()

// Análisis 3: Calidad del SRS — tiempo entre creación y aprobación
// Requiere índice compuesto: (accion ASC, entidad.id ASC)
const srsAprobados = await db.collection('auditoria')
  .where('accion', 'in', ['M3_SRS_CREADO', 'M3_GATE2_SRS_APROBADO'])
  .orderBy('entidad.id', 'asc')
  .orderBy('timestamp', 'asc')
  .get()

// Análisis 4: Frecuencia de iteraciones por proyecto (inestabilidad de reqs)
// Requiere índice compuesto: (accion ASC, entidad.id ASC, timestamp ASC)
const iteraciones = await db.collection('auditoria')
  .where('accion', '==', 'M3_ITERACION_BUCLE_REGISTRADA')
  .orderBy('entidad.id', 'asc')
  .orderBy('timestamp', 'asc')
  .get()

// Análisis 5: Cambios post-aprobación (indicador de calidad del SRS)
// Requiere índice compuesto: (accion ASC, timestamp DESC)
const cambiosPostAprobacion = await db.collection('auditoria')
  .where('accion', '==', 'M3_REQUERIMIENTO_MODIFICADO_POST_APROBACION')
  .orderBy('timestamp', 'desc')
  .get()
```

### 8.2 Índices Compuestos Requeridos en Firestore

Los siguientes índices compuestos deben estar definidos en `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "auditoria",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "accion", "order": "ASCENDING" },
        { "fieldPath": "modulo", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "auditoria",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "accion", "order": "ASCENDING" },
        { "fieldPath": "entidad.id", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "auditoria",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "modulo", "order": "ASCENDING" },
        { "fieldPath": "criticidad", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "auditoria",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "resultado", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
  ]
}
```

---

## 9. Conexiones con Otros Elementos Transversales

### T-01 — Autenticación, Roles y Permisos

El campo `actor` de toda entrada de auditoría se construye a partir de los datos del tipo `Usuario` definido en T-01. Los campos `actor.uid`, `actor.nombre` y `actor.rol` son **snapshots** tomados en el momento del evento — si el usuario cambia de rol después, la entrada histórica conserva el rol que tenía cuando ejecutó la acción.

La acción `T01_ACCESO_DENEGADO` es generada directamente por el middleware de T-01 cuando una ruta es bloqueada. T-03 es, por tanto, el receptor pasivo de los eventos de seguridad producidos por T-01.

### T-02 — Sistema de Notificaciones

Cuando T-02 detecta que una notificación con `prioridad = critica` expiró sin ser accionada (§6 de T-02), llama automáticamente a `registrarAuditoria()` con `accion: 'T02_NOTIFICACION_CRITICA_NO_ACCIONADA'`. El campo `notificacionRelacionada` de la entrada apunta al `id` de la notificación expirada. Esta conexión es unidireccional: T-02 escribe en T-03, pero T-03 nunca dispara acciones en T-02.

### T-05 — Dashboard Principal

El dashboard de T-05 incluye un widget **"Actividad reciente"** que muestra las últimas 10 entradas de auditoría con `criticidad in ['critico', 'alto']` del día actual para el usuario autenticado. La consulta usa el índice compuesto `(criticidad ASC, timestamp DESC)` definido en §8.2.

```typescript
// Consulta del widget de T-05
const actividadReciente = await db.collection('auditoria')
  .where('criticidad', 'in', ['critico', 'alto'])
  .where('timestamp', '>=', inicioDiaActual)
  .orderBy('timestamp', 'desc')
  .limit(10)
  .get()
```

### T-06 — Configuración del Sistema

Los períodos de retención de cada categoría de entrada son configurables desde T-06 por el `superadmin`. T-06 almacena estos valores en un documento de configuración global que la Cloud Function `archivarEntradasVencidas` (§5.3) lee al ejecutarse. Modificar la política de retención desde T-06 no afecta retroactivamente las entradas ya creadas — solo aplica a nuevas entradas.

---

## 10. Checklist de Completitud del Documento

| Ítem | Estado |
|---|:---:|
| Metadatos completos (nombre, capa, posición, módulos, prerrequisitos, stack, versión, fecha, estado) | ✅ |
| Objetivo — por qué la auditoría es necesidad del sistema (4 razones) | ✅ |
| Tres categorías de log con tabla: negocio, seguridad, técnico | ✅ |
| Enum `AccionAuditoria` con los 46 tipos del catálogo (incluyendo `AUDITORIA_CORRECCION`) | ✅ |
| Enum `CriticidadAuditoria` y tipo `ModuloAuditoria` | ✅ |
| Tipo `EntradaAuditoria` con todos los campos requeridos y snapshots | ✅ |
| Tipo `EntradaAuditoriaInput` (payload para Cloud Functions) | ✅ |
| Tipo `PoliticaRetencion` con los 5 niveles | ✅ |
| Mapa `RETENCION_POR_ACCION` con los 46 tipos mapeados | ✅ |
| Catálogo M1: 7 acciones con tabla completa (criticidad, camposModificados, retención) | ✅ |
| Catálogo M2: 14 acciones con tabla completa | ✅ |
| Catálogo M3: 17 acciones con tabla completa + nota sobre acción post-aprobación | ✅ |
| Catálogo Transversal: 8 acciones con tabla completa | ✅ |
| Regla de inmutabilidad — énfasis visual y explicación | ✅ |
| Reglas de Firestore `allow update: if false` y `allow delete: if false` | ✅ |
| Procedimiento para corrección de entrada errónea (sin modificar la original) | ✅ |
| Política de retención: archivado a `auditoria_archivo/` — nunca eliminación | ✅ |
| Cloud Function `archivarEntradasVencidas` con código completo | ✅ |
| Función central `registrarAuditoria` con reintentos y backoff exponencial | ✅ |
| Ejemplo de integración desde Cloud Function de M3 (`aprobarSRSGate2`) | ✅ |
| Tabla de reglas de atomicidad (5 escenarios) | ✅ |
| Permisos de acceso al log por rol (tabla completa) | ✅ |
| Pantalla `/auditoria` con filtros, vista lista, línea de tiempo y accesos denegados | ✅ |
| Exportación a CSV con campos definidos | ✅ |
| Conexión con M2-08 — 5 consultas de Firestore documentadas | ✅ |
| Índices compuestos de Firestore requeridos (formato `firestore.indexes.json`) | ✅ |
| Conexión con T-01 (snapshots del actor) | ✅ |
| Conexión con T-02 (notificaciones críticas no accionadas) | ✅ |
| Conexión con T-05 (widget actividad reciente + consulta) | ✅ |
| Conexión con T-06 (períodos de retención configurables) | ✅ |
| Todo en español con terminología consistente con T-01, T-02 y módulos M1/M2/M3 | ✅ |

---

*Documento generado para el sistema austranet-cco · Capa Transversal · T-03 de 6*
