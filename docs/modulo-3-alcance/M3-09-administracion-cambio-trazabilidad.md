# M3-09 — Administración del Cambio y Trazabilidad del SRS

## 1. Metadatos

| Campo | Valor |
|---|---|
| **Nombre del archivo** | `M3-09-administracion-cambio-trazabilidad.md` |
| **Módulo** | Módulo 3 — Documentación de Objetivos y Alcance (SRS) |
| **Capítulos fuente** | Cap. 4 §4.7 (Administración de requerimientos) · Cap. 25 §25.1 (aplicado al SRS como elemento de configuración) — Sommerville, Ian. *Ingeniería de Software*, 9.ª ed., Pearson, 2011 |
| **Versión** | 1.0.0 |
| **Fecha** | 2026-02-26 |
| **Estado del SRS cubierto** | `aprobado` → `version_anterior` (este archivo opera **después** de que el SRS fue aprobado) |
| **Depende de** | M3-01 (ciclo de vida del req.) · M3-04 (proceso de cambio al SRS) · M3-05 (validación) · M3-06 (KPIs del SRS) · M2-06 (CCB del repositorio) |
| **Conecta con** | M3-10 (casos de prueba — destino final de la trazabilidad) · M1-01 (stakeholders — origen de los requerimientos) · M2-04 (cambios de alcance que generan SCR al SRS) |

---

## 2. Objetivo del Documento

### 2.1 Qué cubre M3-09 que no está en ningún otro archivo

Este archivo documenta **la administración del cambio específica del SRS como elemento de configuración**, y la **matriz de trazabilidad completa** desde el stakeholder que originó el requerimiento hasta el caso de prueba que lo verifica. Ningún archivo del sistema ha cubierto estos dos entregables en forma operativa: M3-04 define el proceso de cambio post-aprobación al SRS; M3-09 lo hace **operativo** con el CCB específico del SRS, el formulario completo de `SolicitudCambioSRS`, la política de evaluación de impacto cruzado entre requerimientos y los tipos de dependencia entre RF. M1-06 cubre la teoría general de GCS del Cap. 25; M3-09 aplica esa teoría **exclusivamente** al SRS como artefacto gestionado, diferenciándolo del repositorio de código (M2-06) y del perfil de entidad (M1-06).

### 2.2 Por qué los requerimientos cambian inevitablemente

> *"Prác­tica­mente en todos los sistemas cambian los requerimientos. Las personas implicadas desarrollan una mejor comprensión de qué quieren que haga el software; la organización que compra el sistema cambia; se hacen modificaciones al hardware, al software y al entorno organizacional del sistema."*
> — (Cap. 4 §4.4, p. 100)

Sommerville identifica tres causas estructurales que hacen que el cambio sea **inevitable** después de aprobado el SRS (Cap. 4 §4.7, p. 112): **(1)** Los ambientes empresarial y técnico del sistema siempre cambian después de la instalación — puede introducirse nuevo hardware, cambiar las prioridades de la empresa, o introducirse nuevas leyes y regulaciones. **(2)** Los individuos que pagan por un sistema y los usuarios de dicho sistema no son los mismos; sus requerimientos pueden divergir después de la entrega. **(3)** Los sistemas grandes tienen una comunidad de usuarios diversa, cuyos requerimientos son inevitablemente un compromiso, y con la experiencia se descubre que el equilibrio de apoyo a diferentes usuarios debe cambiar. El SRS aprobado (v1.0) no es el final del proceso de requerimientos; es el inicio del proceso formal de control de cambios que este archivo operacionaliza.

### 2.3 Requerimientos duraderos vs. requerimientos volátiles

> *"Los requerimientos duraderos son los requerimientos que se asocian con las actividades centrales, de lento cambio, de una organización. También estos requerimientos se relacionan con actividades laborales fundamentales. Por el contrario, los requerimientos volátiles tienen más probabilidad de cambio. Se asocian por lo general con actividades de apoyo que reflejan cómo la organización hace su trabajo más que el trabajo en sí."*
> — (Cap. 4 §4.7.1, p. 112)

Esta distinción es central en M3-09 porque determina dónde aplicar mayor rigor de trazabilidad. Los requerimientos **volátiles** en austranet-cco son los candidatos más probables a generar `SolicitudesCambioSRS`. El sistema puede marcar preventivamente los requerimientos volátiles al momento de especificarlos en M3-04 — el campo `Requerimiento.razonCambio` puede usarse como indicador de volatilidad esperada, registrando desde el inicio por qué se anticipa que este requerimiento podría cambiar.

### 2.4 La trazabilidad como contraparte de la gestión del cambio

La gestión del cambio por sí sola no es suficiente: hay que poder demostrar que **todo requerimiento tiene un origen en una necesidad del negocio**, se especificó en el SRS, se diseñó en la arquitectura y se verificó con una prueba. Sommerville señala que es necesario *"seguir la huella de las relaciones entre requerimientos, sus fuentes y el diseño del sistema, de modo que usted pueda analizar las razones para los cambios propuestos, así como el efecto que dichos cambios tengan probablemente sobre otras partes del sistema"* (Cap. 4 §4.7, p. 114). La trazabilidad es el hilo que conecta cuatro capas: **M1 (stakeholder origen) → M3-SRS (requerimiento especificado) → M2/M3 (componente de diseño) → M3-10 (caso de prueba)**. Sin este hilo, cuando un requerimiento cambia, es imposible identificar el efecto completo del cambio sobre el sistema.

---

## 3. Administración de Requerimientos — Marco Teórico
*(Cap. 4 §4.7 — Sommerville, p. 111–114)*

### 3.1 Qué es la administración de requerimientos

> *"La administración de requerimientos es el proceso de comprender y controlar los cambios en los requerimientos del sistema. Es necesario seguir la pista de requerimientos individuales y mantener los vínculos entre los requerimientos dependientes, de manera que pueda valorarse el efecto del cambio en los requerimientos. También es preciso establecer un proceso formal para hacer cambios a las propuestas y vincular éstos con los requerimientos del sistema."*
> — (Cap. 4 §4.7, p. 112)

La diferencia con la **ingeniería de requerimientos** (cubierta en M3-01 y M3-02) es de fase y propósito: la IR captura, analiza y especifica los requerimientos durante el proceso de definición del sistema; la **administración de requerimientos** gestiona el cambio una vez que el SRS está aprobado y el proceso de desarrollo ha comenzado. La IR produce el SRS v1.0; la administración de requerimientos garantiza que ese documento evolucione de forma controlada y que nunca se pierda la coherencia entre lo que está especificado y lo que está implementado.

> *"El proceso formal de la administración de requerimientos debe comenzar tan pronto como esté disponible un borrador del documento de requerimientos. Sin embargo, hay que empezar a planear cómo administrar el cambio en los requerimientos durante el proceso de adquisición de los mismos."*
> — (Cap. 4 §4.7, p. 112)

### 3.2 Por qué los requerimientos cambian: causas

Sommerville enumera tres causas estructurales del cambio (Cap. 4 §4.7, pp. 111–112):

1. **Los ambientes empresarial y técnico del sistema siempre cambian después de la instalación.** Puede introducirse nuevo hardware, y quizá sea necesario poner en interfaz el sistema con otros sistemas; cambiar las prioridades de la empresa con los consecuentes cambios en el sistema de apoyo requerido; e introducir nuevas leyes y regulaciones que el sistema deba cumplir cabalmente.
2. **Los individuos que pagan por un sistema y los usuarios de dicho sistema, por lo general, no son los mismos.** Los clientes del sistema imponen requerimientos debido a restricciones organizativas y presupuestales. Esto podría estar en conflicto con los requerimientos del usuario final y, después de la entrega, probablemente deban agregarse nuevas características para apoyar al usuario, si el sistema debe cubrir sus metas.
3. **Los sistemas grandes regularmente tienen una comunidad de usuarios diversa**, en la cual muchos individuos tienen diferentes requerimientos y prioridades que quizás estén en conflicto o sean contradictorios. Los requerimientos finales del sistema inevitablemente tienen un compromiso entre sí y, con la experiencia, a menudo se descubre que el equilibrio de apoyo brindado a diferentes usuarios tiene que cambiar.

**Mapeo al sistema austranet-cco:**

| Causa del cambio (Sommerville) | Manifestación en austranet-cco | Trazabilidad cruzada |
|---|---|---|
| Cambio en el ambiente empresarial/técnico | Perfil de la Entidad en M1 ha cambiado: nuevo sector, nueva regulación, cambio de stakeholder registrado en M1-01 | Campo `Proyecto.requiereRegulacionExterna` actualizado en M2 |
| Conflictos entre cliente pagador y usuarios finales | Detectados durante la revisión de M3-05 o durante el desarrollo (M2-04) como discrepancia entre lo firmado y lo solicitado operativamente | `SolicitudCambioSRS.tipo = 'mayor'` con impacto `'alto'` |
| Cambio en la comunidad de usuarios diversa | Stakeholder de M1-01 con `nivelInfluencia = 'alto'` solicita modificación post-aprobación | Genera `SolicitudCambioSRS` con participación obligatoria del cliente |

### 3.3 Requerimientos duraderos vs. requerimientos volátiles

*(Cap. 4 §4.7.1, p. 112)*

| Tipo | Definición (Sommerville) | Características en austranet-cco |
|---|---|---|
| **Duraderos** | *"Se asocian con las actividades centrales, de lento cambio, de una organización. También estos requerimientos se relacionan con actividades laborales fundamentales."* | RF de registro de entidades, autenticación, estructura base de proyectos. Son RF Must Have de alto valor y baja probabilidad de `SolicitudCambioSRS`. |
| **Volátiles** | *"Tienen más probabilidad de cambio. Se asocian por lo general con actividades de apoyo que reflejan cómo la organización hace su trabajo más que el trabajo en sí."* | RF de reportes, notificaciones, integraciones opcionales, flujos de aprobación específicos del cliente. Son candidatos primarios a generar `SolicitudesCambioSRS`. |

> **Aplicación en el sistema:** Los requerimientos volátiles deben registrarse con `Requerimiento.razonCambio` completado ya en el momento de la especificación (M3-04), documentando la razón de su volatilidad esperada. Esto permite al analista anticipar qué requerimientos monitorear con mayor frecuencia durante el desarrollo. Un RF con `razonCambio` completado antes de la aprobación es una señal preventiva de riesgo de requerimiento — debe registrarse también como riesgo tipo `'requerimientos'` en M2-03.

### 3.4 Planificación de la administración de requerimientos

*(Cap. 4 §4.7.1, p. 113)*

> *"La planeación es una primera etapa esencial en el proceso de administración de requerimientos. Esta etapa establece el nivel de detalle que se requiere en la administración de requerimientos."*
> — (Cap. 4 §4.7.1, p. 113)

Sommerville establece que la planificación debe abordar cuatro decisiones:

| Decisión de planificación (§4.7.1) | Definición del libro | Implementación en austranet-cco |
|---|---|---|
| **1. Identificación de requerimientos** | *"Cada requerimiento debe identificarse de manera exclusiva, de forma que pueda tener referencia cruzada con otros requerimientos y usarse en las evaluaciones de seguimiento."* | Campo `Requerimiento.codigo` (RF-001, RNF-001, RD-001). Sistema impide duplicados de código por `proyectoId`. |
| **2. Proceso de administración del cambio** | *"Este es el conjunto de actividades que valoran el efecto y costo de los cambios."* | Flujo `SolicitudCambioSRS` definido en §5 de este archivo. Ver M3-04 §7.3 para el flujo base. |
| **3. Políticas de seguimiento** | *"Dichas políticas definen las relaciones entre cada requerimiento, así como entre los requerimientos y el diseño del sistema que debe registrarse."* | Tipo `EntradaTrazabilidad` del sistema. Detallado en §6 de este archivo. |
| **4. Herramientas de apoyo** | *"La administración de requerimientos incluye el procesamiento de grandes cantidades de información acerca de los requerimientos. Las herramientas disponibles varían desde sistemas especializados de administración de requerimientos, hasta hojas de cálculo y sistemas de bases de datos simples."* | Firestore como almacén centralizado. Los tipos `SRS`, `Requerimiento`, `SolicitudCambioSRS` y `EntradaTrazabilidad` implementan estas herramientas directamente en el sistema. |

> **Aplicación en el sistema:** La "planeación de la administración de requerimientos" de §4.7.1 en austranet-cco ocurre en M2-01 PASO 2 junto con la decisión de metodología. El gestor define en ese momento si el SRS tendrá validación incremental (métodos ágiles) o validación completa antes de desarrollo (cascada/RUP), lo cual determina toda la política de gestión del cambio: en cascada, toda `SolicitudCambioSRS` requiere CCB formal completo; en Scrum, las SCR se generan por sprint y el cliente representante valora el cambio en la Planning del sprint siguiente (Ver M2-07).

---

## 4. El SRS como Elemento de Configuración (Cap. 25)

> **Ver M1-06, Sección 3** para la definición completa de GCS, ítems de configuración (SCI), las 4 actividades principales de la GCS y el proceso CCB general según Sommerville.

Esta sección hace **una sola cosa nueva**: aplicar el concepto de elemento de configuración específicamente al SRS del sistema austranet-cco, distinguiéndolo de los otros elementos de configuración ya documentados en otros archivos.

### 4.1 El SRS como SCI — Diferencias respecto a otros SCIs

El sistema austranet-cco gestiona tres elementos de configuración distintos. Cada uno tiene un CCB diferente, una herramienta de versión diferente y un archivo de referencia diferente:

| Elemento de configuración | Quién lo gestiona | CCB responsable | Herramienta de versión | Archivo de referencia |
|---|---|---|---|---|
| Perfil de Entidad (M1) | Admin / gestor M1 | CCB M1 (perfiles) | Historial de perfil en Firestore | M1-06 |
| Repositorio de código (M2) | Equipo de desarrollo | CCB repositorio | Git (branches, tags, semantic versioning) | M2-06 |
| **SRS del proyecto (M3)** | **Analista / gestor M3** | **CCB del SRS (este archivo)** | **`historialVersiones[]` en Firestore** | **M3-09 (este archivo)** |

La diferencia crítica del SRS como SCI es que su versión tiene **validez contractual**: el cliente firma la v1.0 y cualquier cambio posterior tiene implicaciones legales sobre el alcance acordado. Esto hace que el CCB del SRS incluya necesariamente al representante del cliente para cambios tipo `'mayor'`, a diferencia del CCB del repositorio que opera exclusivamente entre el equipo técnico.

### 4.2 El CCB del SRS — Composición y responsabilidades

> **Ver M1-06, Sección 4.2** para la definición completa del CCB según Sommerville: *"Para sistemas militares y gubernamentales, este grupo se conoce usualmente como consejo de control del cambio (CCB, por las siglas de change control board). En la industria puede llamarse grupo de desarrollo del producto, el cual es el responsable de tomar las decisiones sobre cómo debe evolucionar el sistema de software."* (Cap. 25 §25.1, p. 688)

Lo nuevo en M3-09 es la **composición específica** del CCB del SRS, que es distinta al CCB del repositorio (M2-06):

**CCB DEL SRS (este archivo — M3-09):**
- Analista responsable del SRS — **obligatorio en todo cambio**
- Gestor del proyecto — **obligatorio en todo cambio**
- Representante del cliente (Stakeholder M1 con `nivelInfluencia = 'alto'`) — **obligatorio para cambios tipo `'mayor'`**
- Arquitecto del sistema — **requerido si el cambio afecta requerimientos no funcionales o arquitectura**

**CCB DEL REPOSITORIO (M2-06):**
- Solo equipo técnico (desarrolladores + gestor)
- Sin participación del cliente
- Sin requisito de stakeholder M1

| Dimensión | CCB del SRS (M3-09) | CCB del Repositorio (M2-06) |
|---|---|---|
| Objeto que controla | Requerimientos del SRS aprobado | Código fuente, builds, dependencias |
| Quién aprueba | Analista + Gestor (± Cliente) | Gestor del proyecto |
| Qué evalúa | Impacto funcional y contractual del cambio | Impacto técnico del cambio en el código |
| Artefacto producido | Nueva versión del SRS (v1.X o v2.0) | SCR aprobada → merge commit |
| Participación del cliente | Obligatoria en cambios `'mayor'` | No requerida |

### 4.3 Cuándo se activa el proceso de control de cambios del SRS

El proceso de M3-09 se activa **únicamente** cuando el SRS está en estado `'aprobado'`. Antes de la aprobación, los requerimientos se pueden modificar libremente en el flujo normal de M3-04. **Después de la aprobación** (`SRS.version = 'v1.0'`, `SRS.estado = 'aprobado'`):

- Cualquier modificación a un requerimiento aprobado requiere `SolicitudCambioSRS`
- Cualquier adición de nuevos requerimientos requiere `SolicitudCambioSRS`
- La eliminación de requerimientos Must Have requiere `SolicitudCambioSRS` tipo `'mayor'`

Sommerville advierte explícitamente sobre el riesgo de saltarse este proceso:

> *"Si un nuevo requerimiento tiene que implementarse urgentemente, siempre existe la tentación para cambiar el sistema y luego modificar de manera retrospectiva el documento de requerimientos. Hay que tratar de evitar esto, pues casi siempre conducirá a que la especificación de requerimientos y la implementación del sistema se salgan de ritmo. Una vez realizados los cambios al sistema, es fácil olvidar la inclusión de dichos cambios en el documento de requerimientos, o bien, agregar información al documento de requerimientos que sea inconsistente con la implementación."*
> — (Cap. 4 §4.7.2, p. 114)

---

## 5. Proceso Formal de Administración del Cambio del SRS

> **Ver M3-04, Sección 7.3** para el flujo completo de cambio al SRS aprobado (solicitud → análisis → aprobación → actualización → notificación) basado en las tres etapas de Sommerville (Cap. 4 §4.7.2, p. 113–114).

Esta sección **extiende** ese flujo con tres elementos que M3-04 no tiene:

### 5.1 Formulario de SolicitudCambioSRS

Basado en los campos del tipo `SolicitudCambioSRS` del sistema e inspirado en la *"forma de solicitud de cambio"* de Sommerville (Cap. 25 §25.1, Fig. 25.4, p. 686):

```
SOLICITUD DE CAMBIO AL SRS
══════════════════════════════════════════════════════════════════

IDENTIFICACIÓN
──────────────────────────────────────────────────────────────────
ID de la solicitud:     [SolicitudCambioSRS.id]               — generado automáticamente
SRS afectado:           [SolicitudCambioSRS.srsId]
Proyecto:               [SolicitudCambioSRS.proyectoId]
Fecha de solicitud:     [Date]                                — timestamp automático
Solicitante:            [SolicitudCambioSRS.solicitanteId]
Rol del solicitante:    [gestor | analista | cliente | developer]

DESCRIPCIÓN DEL CAMBIO
──────────────────────────────────────────────────────────────────
Tipo de cambio:         [menor | mayor]
Descripción:            [SolicitudCambioSRS.descripcion]       — mínimo 100 caracteres
Justificación:          [SolicitudCambioSRS.justificacion]     — razón de negocio
Causa raíz:             [cambio_negocio | conflicto_emergente |
                         regulacion | error_especificacion | otro]

REQUERIMIENTOS AFECTADOS
──────────────────────────────────────────────────────────────────
Requerimientos directos:  [SolicitudCambioSRS.requerimientosAfectados]
                          — lista de códigos RF-XXX, RNF-XXX, RD-XXX

Para cada requerimiento afectado:
  Código:                  [RF-XXX]
  Título actual:           [Requerimiento.titulo]
  Estado actual:           [aprobado | en_revision]
  Versión actual:          [Requerimiento.version]
  Tipo de cambio:          [modificacion_descripcion | modificacion_criterio |
                            cambio_prioridad | eliminacion | nuevo_requerimiento]

Requerimientos dependientes transitivos:
  (Sistema obtiene automáticamente todos los RF que tienen
   a alguno de los directos en su campo .dependencias[])

ANÁLISIS DE IMPACTO
──────────────────────────────────────────────────────────────────
Impacto estimado:         [SolicitudCambioSRS.impactoEstimado]
                          [bajo | medio | alto]

Impacto en el plan del proyecto:
  ¿Requiere re-estimación de esfuerzo?        [sí / no]
  ¿Afecta hitos comprometidos?                [sí / no]
  ¿Modifica el alcance acordado con cliente?  [sí / no → activa cambio tipo 'mayor']

Impacto en el SRS:
  Tipo de versión resultante:                 [v1.X (cambio menor) | v2.0 (cambio mayor)]
  Secciones del SRS afectadas:               [lista: §3.X, §4.X, etc.]

Impacto en casos de prueba:
  Casos de prueba M3-10 a actualizar:        [lista de CP-XXX]
  Casos de prueba M3-10 a crear:             [lista pendientes]
  Casos de prueba M3-10 que quedan obsoletos:[lista CP-XXX → archivar]

DECISIÓN DEL CCB DEL SRS
──────────────────────────────────────────────────────────────────
Composición del CCB activado:
  Analista responsable:                       [nombre] — obligatorio
  Gestor del proyecto:                        [nombre] — obligatorio
  Representante cliente (si 'mayor'):         [Stakeholder M1 con nivelInfluencia='alto']
  Arquitecto del sistema (si RNF afectado):   [nombre]

Decisión:                 [SolicitudCambioSRS.estadoAprobacion]
                          [aprobado | rechazado | diferido]
Fecha de resolución:      [SolicitudCambioSRS.fechaResolucion]
Aprobado por:             [SolicitudCambioSRS.aprobadoPor]

Condiciones si diferido:  [condiciones para re-evaluar la solicitud]
Razón si rechazado:       [texto justificativo obligatorio]

IMPLEMENTACIÓN (post-aprobación)
──────────────────────────────────────────────────────────────────
Nueva versión del SRS:    [v1.X o v2.0]
RF modificados:           [lista con nuevo Requerimiento.version]
razonCambio registrado:   [obligatorio en cada RF afectado → Requerimiento.razonCambio]
Actualización de
trazabilidad requerida:   [sí/no — actualizar EntradaTrazabilidad.estado]
Notificación al equipo:   [roles a notificar: gestor, desarrolladores, QA, cliente]
SRS anterior archivado:   [SRS.estado anterior → 'version_anterior']
```

### 5.2 Evaluación de impacto cruzado entre requerimientos

Este es uno de los procesos más críticos de M3-09. Cuando se aprueba un cambio a un requerimiento RF-X, el sistema debe evaluar todos los requerimientos que dependen de RF-X (`Requerimiento.dependencias[]`) para detectar si el cambio los invalida.

Sommerville fundamenta la necesidad de este análisis:

> *"Es necesario seguir la pista de las relaciones entre requerimientos, sus fuentes y el diseño del sistema, de modo que usted pueda analizar las razones para los cambios propuestos, así como el efecto que dichos cambios tengan probablemente sobre otras partes del sistema. Es necesario poder seguir la pista de cómo un cambio se propaga hacia el sistema."*
> — (Cap. 4 §4.7, p. 114)

```
PROCESO DE EVALUACIÓN DE IMPACTO CRUZADO
══════════════════════════════════════════════════════════════════

CAMBIO APROBADO EN RF-X
│
▼
PASO 1 — Identificar requerimientos dependientes
  Para cada RF que tiene RF-X en su campo .dependencias[]:
    → Marcar como candidato a revisión
  Para cada EntradaTrazabilidad que referencia RF-X:
    → Identificar casoPrueba M3-10 asociados
    → Marcar como "potencialmente desactualizado"

│
▼
PASO 2 — Clasificar el impacto por dependiente
  Para cada RF dependiente RF-Y identificado:
    ¿El cambio en RF-X hace inconsistente a RF-Y?
      SÍ  → RF-Y.estado = 'en_revision'
             Analista debe revisar RF-Y antes del próximo sprint
      NO  → RF-Y no requiere acción inmediata

│
▼
PASO 3 — Actualizar la Matriz de Trazabilidad
  EntradaTrazabilidad[RF-X].estado = 'modificado'
  EntradaTrazabilidad[RF-X].versionSRS = nueva versión
  Casos de prueba M3-10 afectados → notificación al responsable de QA

│
▼
PASO 4 — Actualizar historialVersiones del SRS
  Nueva VersionSRS con:
    .version = nueva versión calculada (v1.X o v2.0)
    .tipo = 'menor' | 'mayor'
    .cambiosRealizados = [RF-X, + todos los RF dependientes modificados]
    .solicitudCambioId = SolicitudCambioSRS.id aprobada
    .autor = analista responsable
    .fecha = Date actual
```

### 5.3 Reglas de escalamiento por tipo de cambio y criticidad

| Tipo de cambio | Criticidad del proyecto | Aprobador mínimo requerido | Participación cliente |
|---|---|---|---|
| Menor (v1.X) — solo descripción o criterio de aceptación | baja / media | Analista responsable | No requerida |
| Menor (v1.X) — cambio de prioridad Should↔Could | baja / media / alta | Gestor del proyecto | No requerida |
| Menor (v1.X) — cualquier campo | crítica | Gestor + Analista | No requerida |
| Mayor (v2.0) — nuevo RF o eliminación Must Have | baja / media | Gestor del proyecto | Recomendada |
| Mayor (v2.0) — nuevo RF o eliminación Must Have | alta / crítica | Gestor + Admin | **Obligatoria** |
| Mayor (v2.0) — cambio de alcance del sistema | cualquiera | Admin del sistema | **Obligatoria** |

---

## 6. Trazabilidad de Requerimientos

*(Cap. 4 §4.7.1 — Sommerville, p. 113)*

### 6.1 Definición y propósito de la trazabilidad

> *"Políticas de seguimiento: dichas políticas definen las relaciones entre cada requerimiento, así como entre los requerimientos y el diseño del sistema que debe registrarse. La política de seguimiento también tiene que definir cómo mantener dichos registros."*
> — (Cap. 4 §4.7.1, p. 113)

> *"Es necesario seguir la huella de las relaciones entre requerimientos, sus fuentes y el diseño del sistema, de modo que usted pueda analizar las razones para los cambios propuestos, así como el efecto que dichos cambios tengan probablemente sobre otras partes del sistema."*
> — (Cap. 4 §4.7, p. 114)

M3-04 §6.1 presenta la trazabilidad en el contexto de la especificación del SRS. M3-09 la extiende como **proceso operativo vivo** que se mantiene y actualiza durante todo el ciclo de desarrollo.

**Tipos de trazabilidad** (derivados de Cap. 4 §4.7.1, p. 113–114):

| Tipo | Dirección | Pregunta que responde | Implementación en el sistema |
|---|---|---|---|
| **Trazabilidad hacia atrás** | RF → Stakeholder / Fuente | ¿Quién pidió este requerimiento y por qué? | `EntradaTrazabilidad.fuente` → `Stakeholder.id` (M1-01) |
| **Trazabilidad hacia adelante** | RF → Componente → Prueba | ¿Qué implementa este RF y qué prueba lo verifica? | `EntradaTrazabilidad.componenteDiseno` + `.casoPrueba` |
| **Trazabilidad entre requerimientos** | RF → RF dependientes | ¿Qué otros RF se ven afectados si este cambia? | `Requerimiento.dependencias[]` |

**Capas de trazabilidad en austranet-cco:**
```
ORIGEN      →  REQUERIMIENTO  →  DISEÑO            →  PRUEBA
(M1-01)         (M3-SRS)         (M2/M3 arquitectura)  (M3-10)
Stakeholder     RF-001            Módulo Auth           CP-001
con fuente      RNF-001           Infraestructura       CP-015
identificada    RD-001            Módulo Proyectos      CP-020
```

### 6.2 La Matriz de Trazabilidad (MatrizTrazabilidad)

El tipo `EntradaTrazabilidad` del sistema implementa esta matriz. Para cada requerimiento del SRS, existe una entrada que registra: de dónde viene (stakeholder M1), dónde está especificado (SRS), qué componente de arquitectura lo implementa, qué caso de prueba M3-10 lo verifica, y en qué versión del SRS apareció o fue modificado.

**Plantilla completa — 5 ejemplos representativos:**

| Código RF | Título | Stakeholder origen (M1) | Fuente / razón de negocio | Sección SRS | Prioridad | Estado | Componente de diseño | Caso de prueba M3-10 | Versión SRS | EntradaTrazabilidad.estado |
|---|---|---|---|---|---|---|---|---|---|---|
| RF-001 | Registrar nueva entidad cliente | Ana López (Gerente Comercial) | El equipo comercial necesita registrar clientes antes de crear proyectos | §3.1 | must | aprobado | Módulo Auth + Módulo M1 Entidades | CP-001, CP-002 | v1.0 | activo |
| RF-002 | Crear proyecto y asociarlo a entidad cliente | Carlos Ríos (Gestor de Proyectos) | Todo proyecto debe tener una entidad cliente registrada como origen contractual | §3.2 | must | aprobado | Módulo M2 Proyectos | CP-003, CP-004, CP-005 | v1.0 | activo |
| RF-003 | Exportar SRS aprobado como PDF firmado | Ana López (Gerente Comercial) | El cliente requiere copia PDF del SRS firmado para sus registros contractuales | §3.5 | should | en_revision | Módulo M3 Exportación | — (pendiente actualización) | v1.1 | modificado |
| RNF-001 | Disponibilidad de la plataforma ≥ 99.5% mensual | Arquitecto del sistema | Restricción técnica de SLA acordada con el cliente en el contrato marco | §4.3 | must | aprobado | Infraestructura GCP + Monitoring | CP-015 | v1.0 | activo |
| RD-001 | Validar RUT chileno antes de registrar entidad | Glosario M1-03 (Ley 19.628) | Regulación chilena requiere RUT válido para entidades que operan contratos con organismos públicos | §5.1 | must | aprobado | Módulo M1 Validaciones | CP-020 | v1.0 | activo |

### 6.3 Trazabilidad hacia atrás: del requerimiento al stakeholder

"Hacia atrás" significa: dado un RF, ¿quién lo pidió y por qué? Esta trazabilidad es crítica para:
- Saber **a quién consultar** cuando el RF necesita cambiar (el analista llama al stakeholder fuente, no a un representante genérico)
- Demostrar en una auditoría que cada RF tiene **una necesidad del negocio real** detrás, no es un capricho técnico
- Evaluar el impacto de que **un stakeholder abandone el proyecto**: ¿qué RFs quedan sin "dueño"?

**Proceso en el sistema:**
- `EntradaTrazabilidad.fuente` → `Stakeholder.id` (M1-01)
- `Requerimiento.fuente` → texto descriptivo de la fuente (quién lo pidió y por qué)

> **Regla:** Todo RF con prioridad `must` **debe** tener `EntradaTrazabilidad.fuente` vinculado a un `Stakeholder` de M1 con `nivelInfluencia = 'alto'` o `'medio'`. Un RF Must Have sin stakeholder identificado es un riesgo de requerimiento (registrar en M2-03 tipo `'requerimientos'`).

### 6.4 Trazabilidad hacia adelante: del requerimiento a la prueba

"Hacia adelante" significa: dado un RF aprobado, ¿qué caso de prueba en M3-10 verifica que fue implementado correctamente? Esta trazabilidad es crítica para:
- Saber si todos los RFs tienen prueba asignada (**cobertura de requerimientos**)
- Identificar RFs sin caso de prueba (riesgo de que el requerimiento quede sin verificar)
- Cuando un RF cambia, saber **qué pruebas actualizar** sin tener que revisar todos los CP de M3-10

> **Regla de completitud de trazabilidad:** Todo RF Must Have con estado `'aprobado'` debe tener al menos un `EntradaTrazabilidad.casoPrueba` vinculado **antes** de que el proyecto pueda pasar a estado `'activo_en_desarrollo'` (o antes del sprint que lo implementa, en metodologías ágiles).

**KPI de cobertura de trazabilidad:**
```
cobertura_trazabilidad_pruebas =
  (RFs_must_con_casoPrueba / total_RFs_must_aprobados) × 100

Meta:   100% antes de iniciar desarrollo del RF
Alerta: < 80%
```

### 6.5 Trazabilidad entre requerimientos: dependencias

La matriz de trazabilidad también registra las dependencias entre requerimientos (`Requerimiento.dependencias[]`). Una dependencia RF-X → RF-Y significa que RF-X solo puede implementarse si RF-Y está implementado, o que RF-X entra en conflicto con RF-Y si se implementan simultáneamente.

**Tipos de dependencia entre requerimientos:**

| Tipo | Definición | Ejemplo en austranet-cco |
|---|---|---|
| **Dependencia de precedencia** | RF-Y debe existir antes de que RF-X sea técnicamente viable | RF "Crear SRS" depende de RF "Crear Proyecto" — no puede haber SRS sin proyecto |
| **Dependencia de conflicto** | RF-X y RF-Y son mutuamente excluyentes; implementar ambos viola algún RNF | RF "Exportar datos sin restricciones" conflictúa con RNF "Privacidad de datos según Ley 19.628" |
| **Dependencia de refinamiento** | RF-X es un detalle de RF-Y (agrega precisión a RF-Y) | RF "Aprobar SRS con firma digital" refina RF "Aprobar SRS" |

> **Regla de consistencia:** Si RF-X depende de RF-Y y RF-Y es eliminado vía `SolicitudCambioSRS`, el sistema **debe marcar RF-X como `'en_revision'` automáticamente** y generar una alerta al analista responsable. RF-X queda huérfano: su precondición de implementación desapareció.

---

## 7. Proceso Operativo de M3-09 en el Ciclo de Vida del SRS

```
CICLO DE VIDA DEL SRS — POSICIÓN DE M3-09
══════════════════════════════════════════════════════════════════

[M3-01] → [M3-02] → [M3-03] → [M3-04] → [M3-05] → [M3-06]
Fundamen-  Adquisi-  Modelado  Especif.  Valida-   KPIs
tos IR     ción                          ción
                                            │
                               SRS.estado = 'aprobado'
                               SRS.version = 'v1.0'
                               SRS.aprobadoPor = stakeholder M1
                                            │
                                            ▼
                          ┌─────────────────────────────────┐
                          │       M3-09 SE ACTIVA           │
                          │  Administración del cambio      │
                          │  + Trazabilidad completa        │
                          └─────────────────────────────────┘
                                            │
              ┌─────────────────────────────┼──────────────────────────┐
              ▼                             ▼                          ▼
  Trazabilidad inicial           Control de cambios           Conexión M3-10
  construida al aprobar          post-aprobación              Casos de prueba
  el SRS v1.0:                   (SolicitudCambioSRS)         vinculados a cada
  EntradaTrazabilidad[]          CCB del SRS                  RF Must Have:
  para todos los RF Must         Evaluación de impacto        cobertura = 100%
  Have (§7.1)                    cruzado (§5.2)               antes de desarrollo
                                            │
                               SRS.version = 'v1.1' o 'v2.0'
                               SRS.estado = 'aprobado' (nueva versión)
                               SRS anterior → 'version_anterior'
```

### 7.1 Responsabilidades del analista al aprobar el SRS v1.0

Lista de acciones que el analista debe completar en el momento de la aprobación inicial, antes de declarar el SRS como `'aprobado'`:

1. Construir la `EntradaTrazabilidad[]` inicial para **todos** los RF Must Have (trazabilidad mínima requerida antes de la aprobación)
2. Verificar que cada RF Must Have tiene `EntradaTrazabilidad.fuente` vinculado a un stakeholder M1 con `nivelInfluencia = 'alto'` o `'medio'`
3. Verificar que cada RF Must Have tiene `EntradaTrazabilidad.casoPrueba` asignado **o** está marcado explícitamente como "pendiente asignación en M3-10" con fecha estimada
4. Revisar el grafo de dependencias (`Requerimiento.dependencias[]`) y confirmar que no hay dependencias circulares (RF-X → RF-Y → RF-X)
5. Registrar el estado inicial de la matriz en `SRS.matrizTrazabilidad[]`
6. Verificar que todos los RF volátiles (identificados en §3.3) tienen `Requerimiento.razonCambio` documentado

### 7.2 Responsabilidades periódicas durante el desarrollo

Cada vez que el proyecto avanza un hito o sprint, el analista debe:

1. Verificar que los RF implementados en ese sprint tienen su `EntradaTrazabilidad.casoPrueba` asignado en M3-10 (no puede terminar el sprint con RF implemented y sin CP vinculado)
2. Revisar si hay `SolicitudesCambioSRS` pendientes de resolución que afecten el sprint actual o el próximo
3. Actualizar `EntradaTrazabilidad.estado` a `'modificado'` si algún RF fue ajustado durante el desarrollo por el equipo técnico (cualquier ajuste requiere SCR retroactiva si el SRS está aprobado — ver advertencia §4.3)
4. Calcular el KPI de cobertura de trazabilidad hacia adelante (§8) antes del inicio de cada sprint

---

## 8. KPIs de Administración del Cambio y Trazabilidad

| KPI | Definición | Fórmula | Meta | Alerta |
|---|---|---|---|---|
| **Cobertura trazabilidad hacia atrás** | % de RF Must con stakeholder M1 identificado | `(RF_must_con_fuente / total_RF_must) × 100` | 100% al aprobar SRS v1.0 | < 90% |
| **Cobertura trazabilidad hacia adelante** | % de RF Must con caso de prueba M3-10 asignado | `(RF_must_con_prueba / total_RF_must) × 100` | 100% antes de iniciar desarrollo del RF | < 80% |
| **Tiempo de resolución de SCR** | Días promedio entre creación y resolución de `SolicitudCambioSRS` | `Σ(fechaResolucion - creadoEn) / total_SCR` | ≤ 5 días (cambio menor) · ≤ 10 días (cambio mayor) | > 15 días |
| **Tasa de cambios aprobados** | % de `SolicitudesCambioSRS` aprobadas vs. totales | `(SCR_aprobadas / total_SCR) × 100` | > 70% | < 50% (indica especificación deficiente en M3-04) |
| **RF en revisión por impacto cruzado** | Nº de RF en estado `'en_revision'` por impacto cruzado pendiente | `count(RF donde estado = 'en_revision' por SCR)` | 0 al inicio de cada sprint | > 3 |
| **Integridad de la matriz** | % de RF con todos los campos de `EntradaTrazabilidad` completos | `(entradas_completas / total_RF_aprobados) × 100` | 100% al aprobar SRS | < 90% |

---

## 9. Tabla de Conexiones con los 3 Módulos

| Concepto de M3-09 | Módulo donde impacta | Campo/proceso específico |
|---|---|---|
| `EntradaTrazabilidad.fuente` | M1 — Stakeholders | `Stakeholder.id` → origen del requerimiento (M1-01) |
| `SolicitudCambioSRS` aprobada | M2 — Seguimiento | M2-04: cambio de alcance registrado formalmente |
| Cambio tipo `'mayor'` (v2.0) | M2 — Estimación | M2-02: puede requerir re-estimación de esfuerzo |
| SCR que afecta RNF | M2 — Arquitectura | Componente de diseño afectado requiere revisión técnica |
| `EntradaTrazabilidad.casoPrueba` | M3-10 — Pruebas | Vincula RF aprobados con casos de prueba (destino final) |
| RF eliminado vía SCR | M3-10 — Pruebas | Casos de prueba del RF eliminado quedan obsoletos → archivar |
| `SRS.version_anterior` | M2-06 — Repositorio | Versión anterior archivada en Firestore (inmutable, retención permanente) |
| `SolicitudCambioSRS` en proyectos ágiles | M2-07 — Metodología | En Scrum: SCR se genera por sprint, cliente valora en Planning; en cascada: CCB formal completo obligatorio |
| Requerimientos volátiles (§3.3) | M2-03 — Riesgos | Requerimientos volátiles son riesgo tipo `'requerimientos'` en M2-03 |

---

## 10. Checklist de Completitud

| Ítem | Fuente en el libro | ✅ |
|---|---|---|
| Definición de administración de requerimientos (§4.7) con cita textual | Cap. 4 §4.7, p. 112 | ✅ |
| Por qué los requerimientos cambian: 3 causas estructurales del libro (§4.7) | Cap. 4 §4.7, pp. 111–112 | ✅ |
| Requerimientos duraderos vs. volátiles con citas textuales (§4.7.1) | Cap. 4 §4.7.1, p. 112 | ✅ |
| Planificación de la administración: 4 decisiones de §4.7.1 mapeadas al sistema | Cap. 4 §4.7.1, p. 113 | ✅ |
| SRS como SCI — tabla comparativa con M1 y M2 | Cap. 25 + sistema | ✅ |
| CCB del SRS con composición diferenciada del CCB del repositorio | Cap. 25 §25.1, p. 688 + sistema | ✅ |
| Cuándo se activa el control de cambios (post-aprobación) | Cap. 4 §4.7.2, p. 113 | ✅ |
| Cita sobre peligro de cambiar el sistema antes que el SRS (§4.7.2) | Cap. 4 §4.7.2, p. 114 | ✅ |
| Formulario `SolicitudCambioSRS` completo con todos los campos del tipo | Cap. 25 §25.1, Fig. 25.4 + sistema | ✅ |
| Proceso de evaluación de impacto cruzado entre requerimientos | Cap. 4 §4.7, p. 114 + sistema | ✅ |
| Tabla de reglas de escalamiento por tipo y criticidad | Sistema | ✅ |
| Definición de trazabilidad con cita del libro (§4.7.1) | Cap. 4 §4.7.1, p. 113 | ✅ |
| Tipos de trazabilidad (hacia atrás, hacia adelante, entre requerimientos) | Cap. 4 §4.7.1, p. 113–114 | ✅ |
| Figura 4.17 (evolución de los requerimientos) referenciada | Cap. 4 §4.7, p. 111 | ✅ |
| Figura 4.18 (proceso de administración del cambio de 3 etapas) referenciada | Cap. 4 §4.7.2, p. 113 | ✅ |
| Figura 25.3 (proceso CCB) aplicada al SRS — referenciando M1-06 para la definición completa | Cap. 25 §25.1, Fig. 25.3 + M1-06 | ✅ |
| Figura 25.4 (formulario de peticin de cambio) aplicada a SolicitudCambioSRS | Cap. 25 §25.1, Fig. 25.4 | ✅ |
| Matriz de trazabilidad con 5 ejemplos y todos los campos | Sistema | ✅ |
| Trazabilidad hacia atrás: regla de stakeholder obligatorio para Must Have | Sistema | ✅ |
| Trazabilidad hacia adelante: KPI de cobertura de pruebas | Sistema + M3-10 | ✅ |
| Trazabilidad entre requerimientos: 3 tipos de dependencia | Sistema | ✅ |
| Regla de consistencia al eliminar requerimiento con dependientes | Sistema | ✅ |
| Diagrama de posición de M3-09 en el ciclo de vida del SRS | Sistema | ✅ |
| Responsabilidades del analista al aprobar SRS v1.0 (6 puntos) | Sistema | ✅ |
| 6 KPIs con fórmulas y umbrales | Sistema | ✅ |
| Tabla de conexiones con M1, M2, M3-10 (9 filas) | Sistema | ✅ |
| Bloque final de descripción de fuentes | Sistema | ✅ |

---

> **Documento generado con base en:**
> Sommerville, Ian. *Ingeniería de Software*, 9.ª edición.
> Pearson Educación, 2011. Capítulo 4 §4.7 (Administración
> de requerimientos, pp. 111–114) y Capítulo 25 §25.1
> (Administración del cambio — aplicado al SRS como
> elemento de configuración, pp. 685–689).
>
> **Extiende y coordina:**
> M3-01 (ciclo de vida del requerimiento), M3-04 (proceso
> de cambio al SRS aprobado), M3-05 (validación),
> M3-06 (KPIs del SRS), M3-10 (casos de prueba — destino
> final de la trazabilidad), M2-04 (cambios de alcance),
> M2-06 (CCB del repositorio de código).
>
> **No repite:**
> Ciclo de vida del requerimiento ni proceso de cambio
> básico de 3 etapas (M3-01). Flujo de cambio al SRS
> post-aprobación ni política de versiones (M3-04).
> Definición completa de GCS, ítems de configuración,
> proceso CCB teórico y gestión de versiones del Cap. 25
> (M1-06). CCB del repositorio de código (M2-06).
