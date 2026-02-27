# M2-06-repositorio-configuracion-proyecto.md

> **Marco Teórico:** Gestión de la Configuración aplicada al Repositorio de Software del Proyecto  
> **Fuente:** Ian Sommerville, *Ingeniería de Software*, 9.ª edición, Pearson, 2011 — **Capítulo 25 completo**

---

## 1. Metadatos del Documento

| Campo | Valor |
|---|---|
| **Nombre del archivo** | `M2-06-repositorio-configuracion-proyecto.md` |
| **Módulo** | Módulo 2 — Registro de Proyectos |
| **Capítulo fuente** | Cap. 25 — Administración de la Configuración (pp. 681–703) |
| **Versión** | 1.0 |
| **Fecha** | 2026-02-26 |
| **Estado del proyecto cubierto** | `activo_en_desarrollo` |
| **Referencias cruzadas** | M1-06, M2-03, M2-07, T-03 |

---

## 2. Objetivo del Documento

### 2.1 Qué cubre este archivo

Este archivo documenta la **gestión de la configuración del repositorio de software** del proyecto, aplicando el marco del Cap. 25 de Sommerville al código fuente, builds, entregas y documentación técnica que el equipo produce durante el estado `activo_en_desarrollo`. En este estado el proyecto tiene un SRS aprobado (v1.0) y el equipo está construyendo el software; por tanto, el repositorio requiere gestión formal para garantizar trazabilidad, reproducibilidad y coordinación del trabajo paralelo.

### 2.2 Diferencia crítica con M1-06

**Este archivo NO es una continuación de M1-06 ni repite su teoría.** M1-06 aplica los conceptos del Cap. 25 a los **elementos de configuración del sistema austranet-cco** en sí mismo: perfiles de entidades, contratos, documentos SRS, estados de proyectos. Este archivo aplica los **mismos conceptos** a un objeto radicalmente diferente: el **repositorio de software que el equipo está construyendo para el cliente**. La diferencia es análoga a la distinción entre administrar los planos de un edificio vs. administrar el andamio con que se construye. Para las definiciones teóricas del Cap. 25 ya documentadas (definición de GCS, tipos de SCI, CCB, CRF, operaciones de check-in/check-out, modelos de almacenamiento, construcción, entregas), consultar: **Ver M1-06, Secciones 3 a 7.**

### 2.3 Por qué es crítico

Sin gestión de configuración del repositorio, el equipo no puede reproducir versiones anteriores del software entregado al cliente, evaluar el impacto real de un cambio en el código antes de implementarlo, ni coordinar el trabajo paralelo de múltiples desarrolladores sin riesgo de sobreescritura mutua. Sommerville lo advierte con precisión:

> **"Si no se cuenta con procedimientos efectivos de administración de la configuración, se puede malgastar esfuerzo al modificar la versión equivocada de un sistema, entregar a los clientes la versión incorrecta de un sistema u olvidar dónde se almacena el código fuente del software para una versión particular del sistema o componente."** (Cap. 25, introducción, p. 682)

### 2.4 Contexto de uso

Este documento lo consulta el **gestor del proyecto** en el momento en que el proyecto transita al estado `activo_en_desarrollo` (disparado por la aprobación del SRS v1.0 en M3). En ese momento, el gestor debe completar la plantilla de la Sección 9.2 y establecer las políticas del repositorio antes de que el equipo escriba la primera línea de código. Sin estas políticas activas, los cambios que lleguen al repositorio carecen de trazabilidad respecto al SRS aprobado.

---

## 3. Gestión de la Configuración del Software (Cap. 25 — Introducción)

> Para la **definición formal completa** de administración de la configuración, los tipos de ítems de configuración (SCI) y el mapeo teórico de las 4 actividades, ver: **Ver M1-06, Secciones 3.1, 3.2 y 3.3.**

Esta sección presenta únicamente el **encuadre aplicado al repositorio del proyecto**.

### 3.1 Definición y Propósito

*(Cap. 25, introducción, p. 682)*

Sommerville clasifica la GCS como una **actividad de apoyo** (no de desarrollo) porque su propósito no es producir funcionalidades sino proteger la integridad del trabajo que produce el equipo:

> **"La administración de la configuración (CM) se ocupa de las políticas, los procesos y las herramientas para administrar los sistemas cambiantes de software."** (p. 682)

Los **tipos de elementos de configuración** que Sommerville enumera son (Cap. 25, Fig. 25.2, p. 684):

- **Programas** — tanto código fuente como código ejecutable
- **Documentos asociados al software** — especificaciones técnicas y manuales de usuario
- **Datos** — datos usados por el programa o generados por él (fixtures, migraciones)

La relación entre GCS y gestión del cambio es directa: la GCS es el mecanismo que hace que cada cambio al repositorio sea **trazable** (quién lo hizo, cuándo y por qué) y **reversible** (es posible reconstruir cualquier versión anterior del sistema).

> **Aplicación en el sistema:** Los tres tipos de elementos de configuración de Sommerville mapean al repositorio del proyecto así: *programas* → código fuente Flutter/Next.js/Firebase; *documentos* → documentación técnica, especificaciones de API; *datos* → scripts de migración de base de datos y fixtures de prueba. Todos deben estar bajo control de versiones desde el primer commit. El tipo `ElementoConfiguracion` del Módulo 2 registra cada uno de estos elementos con sus campos `version`, `rama` y `estado`.

---

### 3.2 Las Cuatro Actividades Principales de la GCS

*(Cap. 25, p. 682, Fig. 25.1)*

Sommerville enumera cuatro actividades estrechamente relacionadas que componen la GCS:

> **"La administración de la configuración de un producto de sistema de software comprende cuatro actividades estrechamente relacionadas:"** (p. 682)

| # | Actividad | Definición exacta (Sommerville) | Sección del cap. |
|---|---|---|---|
| 1 | **Administración del cambio** | *"Hacer un seguimiento de las peticiones de cambios al software por parte de clientes y desarrolladores, estimar los costos y el efecto de realizar dichos cambios, y decidir si deben implementarse los cambios y cuándo."* | §25.1 |
| 2 | **Gestión de versiones** | *"Hacer un seguimiento de las numerosas versiones de los componentes del sistema y garantizar que los cambios hechos por diferentes desarrolladores a los componentes no interfieran entre sí."* | §25.2 |
| 3 | **Construcción del sistema** | *"El proceso de ensamblar los componentes del programa, datos y librerías, y luego compilarlos y vincularlos para crear un sistema ejecutable."* | §25.3 |
| 4 | **Gestión de entregas** | *"Preparar el software para la entrega externa y hacer un seguimiento de las versiones del sistema que se entregaron para uso del cliente."* | §25.4 |

> **Aplicación en el sistema:** Estas 4 actividades definen exactamente las 4 secciones operativas de este archivo (Secciones 4, 5, 7 y 8) y los 4 procesos que el gestor del proyecto debe activar al declarar el estado `activo_en_desarrollo`. La administración del cambio se implementa mediante el flujo CCB de la Sección 4; la gestión de versiones mediante la política de ramas de la Sección 5; la construcción del sistema mediante el pipeline CI de la Sección 7; y la gestión de entregas mediante las notas de versión de la Sección 8.

---

## 4. Administración del Cambio al Repositorio (Cap. 25 §25.1)

Esta es la sección operativa central del archivo. Toda modificación al código fuente del proyecto que se encuentre en estado `activo_en_desarrollo` debe pasar por este proceso.

### 4.1 El Comité de Control de Cambios (CCB)

*(Cap. 25, §25.1, p. 688)*

> **"Para sistemas militares y gubernamentales, este grupo se conoce usualmente como consejo de control del cambio (CCB, por las siglas de *change control board*). En la industria puede llamarse grupo de desarrollo del producto, el cual es el responsable de tomar las decisiones sobre cómo debe evolucionar el sistema de software."** (p. 688)

> **"El CCB o el grupo de desarrollo del producto consideran el efecto del cambio desde un punto de vista estratégico y organizacional más que técnico. Decide si el cambio en cuestión está justificado económicamente y prioriza los cambios aceptados para su implementación."** (p. 688)

La composición típica según Sommerville incluye:

| Rol en el CCB | Función |
|---|---|
| Representante del equipo de desarrollo | Evalúa viabilidad técnica del cambio |
| Representante de soporte al cliente | Representa intereses del usuario final |
| Representante de marketing / negocio | Evalúa impacto comercial y estratégico |
| Arquitecto del sistema | Valora cambios que afectan múltiples módulos |

#### ⚠️ Distinción crítica: CCB del repositorio vs. CCB del SRS

| Dimensión | CCB del Repositorio (este archivo) | CCB del SRS (M3-05) |
|---|---|---|
| **Objeto que controla** | Código fuente, builds, dependencias | Requerimientos del SRS aprobado |
| **Quién aprueba** | Gestor del proyecto (`Proyecto.gestorId`) | Analista + Gestor + Cliente |
| **Qué evalúa** | Impacto técnico del cambio en el código | Impacto funcional del cambio en el alcance |
| **Artefacto producido** | SCR aprobada → merge commit | Nueva versión del SRS (v1.X o v2.0) |
| **Cuándo se activa** | Cualquier cambio al repositorio | Cualquier cambio a RF/RNF aprobados |

**Regla de doble CCB:** Un cambio en el código que modifica el comportamiento de una funcionalidad ya especificada en el SRS v1.0 **requiere pasar por AMBOS CCB**: primero el CCB del SRS (para actualizar la especificación) y luego el CCB del repositorio (para implementar el cambio). Ver también: **Ver M1-06, Sección 4.2** para el marco general del CCB según Sommerville.

> **Aplicación en el sistema:** En austranet-cco, el CCB del repositorio se implementa como el flujo de aprobación del tipo `SolicitudCambioRepositorio`. El aprobador es `Proyecto.gestorId`. Para cambios urgentes (hotfix), el gestor tiene 24 horas para resolver. Para cambios que modifican RF del SRS, el sistema debe disparar también el proceso de cambio de M3-05.

---

### 4.2 El Proceso Formal de Solicitud de Cambio (Fig. 25.3)

*(Cap. 25, §25.1, Fig. 25.3, pp. 685–689)*

Sommerville describe el proceso de administración del cambio como un flujo de múltiples etapas. Cada etapa produce un artefacto y tiene un criterio de avance:

```
┌─────────────────────────────────────────────────────────────┐
│          PROCESO CCB DEL REPOSITORIO — austranet-cco         │
└─────────────────────────────────────────────────────────────┘

 [1. Solicitud de cambio presentada]
       │  Quién: cualquier MiembroEquipo
       │  Artefacto: SCR-YYYY-NNN (estado: pendiente)
       │  Criterio de avance: formulario completo
       ↓
 [2. Verificación de validez]
       │  Quién: gestor del proyecto
       │  Artefacto: SCR actualizada (estado: en_revision | rechazada)
       │  Criterio: ¿es un cambio real, no duplicado, no mal interpretación?
       │
       ├──── [INVÁLIDA] ──→ [Notificación al solicitante] → SCR cerrada
       │
       ↓ (válida)
 [3. Análisis de impacto]
       │  Quién: desarrollador asignado + gestor
       │  Artefacto: sección "Análisis de impacto" del formulario SCR
       │  Criterio: funcionalidad afectada, dependencias, esfuerzo estimado,
       │            riesgo del cambio, impacto en cronograma documentados
       ↓
 [4. Revisión del CCB]
       │  Quién: gestor del proyecto (CCB del repositorio)
       │  Artefacto: decisión registrada en SCR
       │  Criterios de decisión (Sommerville, p. 687–688):
       │    1. Consecuencias de NO realizar el cambio
       │    2. Beneficios del cambio
       │    3. Número de usuarios afectados
       │    4. Costo de hacer el cambio
       │    5. Ciclo de liberación del producto
       │
       ├──── [RECHAZADA] ──→ [Notificación al solicitante] → SCR cerrada
       │
       ├──── [DIFERIDA] ──→ [Programada para versión futura] → SCR en espera
       │
       ↓ (aprobada)
 [5. Implementación del cambio]
       │  Quién: MiembroEquipo responsable
       │  Artefacto: rama feature/SCR-NNN + commits con referencia SCR
       │  Criterio: código implementado en rama específica, pipeline verde
       │
       │  Sommerville: "Conforme el equipo de desarrollo modifica los
       │  componentes de software, debe mantener un registro de los cambios
       │  hechos a cada componente." (historial de derivación, p. 689)
       ↓
 [6. Validación y QA]
       │  Quién: equipo QA
       │  Artefacto: resultado de pruebas, cobertura
       │  Criterio: pipeline verde, cobertura ≥ umbral definido en §9.2
       ↓
 [7. Merge y cierre]
          Quién: gestor del proyecto
          Artefacto: merge commit (hash registrado en SCR), SCR cerrada
          Criterio: SCR.estado = 'implementado', commit hash registrado
```

> **Aplicación en el sistema:** El proceso de 7 etapas se implementa como el flujo de estados de `SolicitudCambioRepositorio`: `pendiente → en_revision → aprobado → implementado` (o `rechazado` / `diferido`). Ver M1-06, Sección 4.1 para el detalle de cada etapa según Sommerville. **Ver M2-03, Sección 5** para los indicadores de riesgo que pueden generarse durante el análisis de impacto (paso 3).

---

### 4.3 Formulario de Petición de Cambio al Repositorio

Sommerville presenta en la **Fig. 25.4** (p. 686) el **Formato de Petición de Cambio (CRF)** con campos de identificación, descripción, análisis, decisión e implementación. La siguiente plantilla incorpora todos los campos del libro complementados con los campos necesarios para el sistema austranet-cco:

```
══════════════════════════════════════════════════════════════════
  SOLICITUD DE CAMBIO AL REPOSITORIO — SCR-YYYY-NNN
══════════════════════════════════════════════════════════════════

IDENTIFICACIÓN
─────────────────────────────────────────────────────────────────
ID de Solicitud:        [SCR-YYYY-NNN — generado automáticamente]
Proyecto:               [ID del proyecto en M2]
Fecha de Solicitud:     [Date — timestamp automático]
Solicitante:            [ID MiembroEquipo]
Estado actual del SCR:  [pendiente | en_revision | aprobado
                          | rechazado | diferido | implementado]

DESCRIPCIÓN DEL CAMBIO
─────────────────────────────────────────────────────────────────
Elemento(s) afectado(s): [ruta del archivo / módulo / componente]
Versión actual:          [X.Y.Z]
Versión propuesta:       [X.Y.Z]
Tipo de cambio:          [correctivo | adaptativo | perfectivo
                           | preventivo]
Descripción:             [qué cambia y por qué — mínimo 50 chars]
Justificación técnica:   [evidencia del problema o mejora]

ANÁLISIS DE IMPACTO
─────────────────────────────────────────────────────────────────
Funcionalidad afectada:  [RF/RNF del SRS que se ven afectados]
¿Modifica alcance SRS?:  [sí → requiere CCB del SRS (M3-05) | no]
Dependencias afectadas:  [otros EC que deben actualizarse]
Estimación de esfuerzo:  [horas/días]
Riesgo del cambio:       [bajo | medio | alto]
Impacto en cronograma:   [descripción y días estimados]

DECISIÓN DEL CCB
─────────────────────────────────────────────────────────────────
Resolución:              [aprobado | rechazado | diferido]
Justificación:           [motivo de la decisión]
Aprobado por:            [ID Proyecto.gestorId + fecha]
Condiciones:             [requisitos para implementar si aplica]
Versión objetivo:        [X.Y.Z en que se implementará]

IMPLEMENTACIÓN Y CIERRE
─────────────────────────────────────────────────────────────────
Responsable:             [ID MiembroEquipo]
Rama de trabajo:         [feature/SCR-NNN]
Commit de cierre:        [hash del merge commit]
Verificado por QA:       [sí | no]
Fecha de cierre:         [Date]
══════════════════════════════════════════════════════════════════
```

> **Aplicación en el sistema:** El campo *"¿Modifica alcance SRS?"* es el disparador de doble CCB. Si el valor es `sí`, el sistema debe bloquear la implementación hasta que exista un SCR aprobado en M3-05 vinculado a la misma funcionalidad. La trazabilidad completa es: `RF del SRS → SCR del repositorio → commit → versión del sistema`. **Ver M1-06, Sección 4.3** para el ejemplo completo del formulario CRF según Sommerville (Fig. 25.4).

---

## 5. Gestión de Versiones (Cap. 25 §25.2)

> Para la **definición formal** de gestión de versiones, la terminología completa (versión, línea base, línea de código, línea principal, release, branching, merging), los modelos de almacenamiento con deltas y las operaciones de check-in/check-out, ver: **Ver M1-06, Secciones 5.1 a 5.5.**

Esta sección documenta la **aplicación práctica al repositorio del proyecto**.

### 5.1 Conceptos Fundamentales de Versiones

*(Cap. 25, §25.2, Fig. 25.2, p. 684)*

Sommerville distingue con precisión los tres conceptos que el repositorio debe gestionar:

**VERSIÓN:**
> *"Una instancia de un ítem de configuración que difiere, en alguna forma, de otras instancias del mismo ítem. Las versiones siempre tienen un identificador único, que se compone generalmente del nombre del ítem de configuración más un número de versión."* (Fig. 25.2, p. 684)

En el repositorio del proyecto, cada commit que cambia un componente crea una nueva versión de ese componente. La convención de numeración es `X.Y.Z` (Semantic Versioning — ver Sección 8.2).

**VARIANTE:**  
Sommerville no define "variante" como término técnico independiente en el Cap. 25. El concepto equivalente es el de *versiones en ramas paralelas* de la misma línea de código, que representan adaptaciones simultáneas del mismo componente para diferentes contextos (ej. versión para Android vs. iOS, versión para entorno de staging vs. producción). *(Cap. 25, §25.2, p. 692)*

**ENTREGA (Release):**
> *"Una entrega de un sistema que se libera para su uso a los clientes u otros usuarios en una organización."* (Fig. 25.2, p. 684)

Una entrega no es solo el código ejecutable. Según Sommerville (§25.4, p. 700), debe acompañarse de: archivos de configuración, archivos de datos, programa de instalación, documentación electrónica y escrita. Ver la plantilla completa en la Sección 8.3.

---

### 5.2 Modelos de Almacenamiento de Versiones

*(Cap. 25, §25.2, Fig. 25.7, p. 691)*

Sommerville describe dos modelos para almacenar el historial de versiones:

#### 1. Almacenamiento de Deltas (diferencias)

- **Qué almacena:** Solo los cambios entre una versión y la siguiente (diferencias línea por línea).
- **Cómo funciona:** Para reconstruir la versión N, el sistema aplica secuencialmente todos los deltas desde la versión base hasta N.
- **Ventaja según el libro:** *Ahorro significativo de espacio de almacenamiento*, especialmente cuando los componentes son grandes y los cambios son pequeños.
- **Desventaja según el libro:** El tiempo de reconstrucción crece con el número de versiones; reconstruir una versión muy antigua requiere aplicar muchos deltas.

#### 2. Almacenamiento de Instantáneas Completas

- **Qué almacena:** Una copia completa del componente en cada versión.
- **Cómo funciona:** Cada check-in guarda el estado completo del archivo; no se requiere cálculo de deltas para reconstruir.
- **Ventaja según el libro:** *Acceso inmediato* a cualquier versión sin cálculo.
- **Desventaja según el libro:** Requiere espacio de almacenamiento significativamente mayor.

> **Nota práctica:** Git moderno usa un modelo híbrido — almacena instantáneas (blobs) pero comprime el repositorio usando deltas internamente durante el empaquetado (`git pack`). Sommerville no especifica este detalle en §25.2; describe los dos modelos puros como conceptos teóricos.

---

### 5.3 Operaciones de Check-in / Check-out

*(Cap. 25, §25.2, pp. 691–692, Fig. 25.8)*

**CHECK-OUT:**
> *"Los desarrolladores sacan componentes del repositorio público hacia su espacio de trabajo privado y pueden cambiarlos como deseen en su mismo espacio."* (p. 692)

En Git, esto corresponde a `git clone` (primera vez) o `git pull` + creación de rama (`git checkout -b feature/SCR-NNN`). El espacio de trabajo privado es la copia local del repositorio.

**CHECK-IN:**
> *"Cuando sus cambios están completos, ingresan los componentes al repositorio."* (p. 692)

En Git: `git commit` (registra la nueva versión localmente) + `git push` (la sube al repositorio remoto). Los metadatos que se almacenan son: hash del commit, autor, fecha, mensaje descriptivo (referencia obligatoria a la SCR).

**El problema de la integración concurrente:**  
Cuando dos desarrolladores modifican el mismo archivo en ramas distintas, se produce un **conflicto de fusión**:

> *"En alguna etapa, tal vez sea necesario combinar ramificaciones de líneas de código para crear una nueva versión de un componente que incluya todos los cambios realizados. Si hay traslapes, un desarrollador debe verificar los conflictos y modificar los cambios de manera que sean compatibles."* (p. 692)

La política del repositorio debe definir quién resuelve los conflictos de merge (responsabilidad del autor de la rama o del gestor del proyecto).

---

### 5.4 Ramificación y Fusión (Branching / Merging)

*(Cap. 25, §25.2, Fig. 25.9, p. 692)*

Sommerville describe la ramificación como consecuencia natural del desarrollo paralelo:

> *"Una consecuencia del desarrollo independiente del mismo componente es que las líneas de código pueden ramificarse (branch). En vez de una secuencia lineal de versiones que refleje los cambios al componente con el paso del tiempo, puede haber varias secuencias independientes."* (p. 692)

**Cuándo crear una rama:** cuando se trabaja en una SCR específica, cuando se necesita una versión especial para un cliente, o cuando se debe aislar una corrección urgente (hotfix) de la línea de desarrollo principal.

**Proceso de fusión:** al completar el trabajo en una rama, se fusiona con la rama destino. Si hay traslapes en los mismos bloques de código, se produce un conflicto que debe resolverse manualmente.

**Esquema de ramas del repositorio del proyecto:**

```
main ──────────────────────────────●─────────────────────────────●────
                                  ╱ merge (release)             ╱ merge
develop ──────────────────────── ──────────────────────────────  ──────
                      ╲ feature ╱                     ╲ hotfix ╱
                       ╲       ╱                       ╲       ╱
feature/SCR-001 ────────●──────                         │
                                                         │
hotfix/SCR-002 ──────────────────────────────────────────●
```

| Rama | Propósito | Quién puede hacer merge |
|---|---|---|
| `main` | Solo entregas aprobadas y etiquetadas (tags X.Y.Z) | Gestor del proyecto (CCB aprobado) |
| `develop` | Integración continua — todas las SCR aprobadas | Desarrollador + pipeline verde |
| `feature/SCR-NNN` | Implementación de una SCR específica | Desarrollador asignado |
| `hotfix/SCR-NNN` | Corrección urgente directamente a `main` | Gestor del proyecto (proceso expedito) |

> **Aplicación en el sistema:** El tipo `ElementoConfiguracion` del proyecto tiene campos: `version` (X.Y.Z), `rama` (string), `estado` ('en_desarrollo' | 'estable' | 'obsoleto'). La política de ramas se define en el Plan de GCS (Sección 9.2) al inicio de `activo_en_desarrollo`. **Ver M2-01, Sección 7** para la calendarización que define cuándo se crean ramas de hotfix.

---

## 6. Sistemas de Control de Versiones: Centralizado vs. Distribuido

*(Cap. 25, §25.2, pp. 690–693)*

> Para el contexto teórico completo de la gestión de versiones, ver: **Ver M1-06, Sección 5.**

### 6.1 Sistema Centralizado (Subversion / CVS)

Sommerville describe el modelo centralizado como aquel donde existe un **repositorio central único** al que todos los desarrolladores envían sus cambios directamente:

- **Arquitectura:** Un servidor central aloja el repositorio completo; los desarrolladores trabajan con copias locales limitadas.
- **Flujo típico:** check-out → modificar → commit directo al servidor central.
- **Ventajas según el libro:** Control centralizado de acceso; un único punto de verdad; más simple de administrar para equipos pequeños.
- **Desventajas según el libro:** Requiere conexión de red para cualquier operación de commit; el servidor es un punto único de fallo; operaciones lentas en redes de baja velocidad.
- **Cuándo recomienda este modelo:** equipos pequeños con red confiable y repositorio sin necesidad de trabajo offline.

### 6.2 Sistema Distribuido (Git)

Sommerville presenta el modelo distribuido como la evolución natural para equipos que trabajan en paralelo o de forma remota:

- **Arquitectura:** Cada desarrollador tiene una **copia completa del repositorio** (incluyendo todo el historial) en su máquina local.
- **Flujo típico:** `clone` → trabajar → `commit local` → `push` al repositorio de integración.
- **El repositorio de integración:** Sommerville identifica la necesidad de un **repositorio de integración** (integration repo) que actúa como la fuente de verdad compartida. En el contexto del proyecto, este es el repositorio remoto en GitHub/GitLab.

> *"Para ser congruentes con la noción de los métodos ágiles de elaborar muchos cambios pequeños, la integración continua implica reconstruir frecuentemente la línea principal (mainline), después de realizar pequeños cambios al código fuente."* (Cap. 25, §25.3, p. 697)

- **Ventajas según el libro:** Trabajo offline completo (commit sin red); velocidad de operaciones locales instantáneas; respaldo distribuido (cada clon es un backup completo).
- **Desventajas/complejidades:** Resolver conflictos de merge es más complejo; requiere disciplina de sincronización frecuente con el repositorio de integración.
- **Cuándo recomienda este modelo:** equipos distribuidos geográficamente, proyectos open source, equipos que requieren trabajo offline.

### 6.3 Tabla Comparativa

| Dimensión | Sistema Centralizado | Sistema Distribuido |
|---|---|---|
| **Arquitectura** | Repositorio central único; copias locales parciales | Repositorio completo en cada nodo |
| **Trabajo sin conexión** | No (requiere red para commit) | Sí (commit local sin red) |
| **Velocidad de operaciones** | Depende de la red | Operaciones locales instantáneas |
| **Resolución de conflictos** | Centralizada, en el servidor | Distribuida, en el merge entre ramas |
| **Punto de fallo** | Servidor central = punto único | Ningún nodo es crítico |
| **Escenario recomendado** | Equipo pequeño, red confiable | Equipos distribuidos, open source |
| **Herramienta típica** | Subversion (SVN) | Git |

> *Tabla basada exclusivamente en lo que Sommerville describe en Cap. 25, §25.2, pp. 690–693.*

> **Aplicación en el sistema:** El sistema austranet-cco usa **Git** (modelo distribuido) con repositorio de integración en GitHub/GitLab. Esta elección es coherente con el stack Flutter + Next.js del equipo y con el trabajo potencialmente distribuido entre desarrolladores remotos. El campo `herramienta` del Plan de GCS (Sección 9.2) debe registrar explícitamente esta elección.

---

## 7. Construcción del Sistema (Cap. 25 §25.3)

> Para la definición completa de construcción del sistema, las 3 plataformas involucradas y las 7 capacidades de las herramientas de construcción, ver: **Ver M1-06, Secciones 6.1 y 6.2.**

### 7.1 Definición y Componentes

*(Cap. 25, §25.3, p. 693)*

> **"La construcción del sistema es el proceso de crear un sistema ejecutable y completo al compilar y vincular los componentes del sistema, librerías externas, archivos de configuración, etcétera."** (p. 693)

La diferencia clave con simplemente compilar un archivo es que la construcción del sistema involucra **ensamblar todos los componentes** en la versión correcta, no solo compilar código fuente aislado. Sommerville (p. 684) lo define en la Fig. 25.2 como:

> *"Construcción de sistema: Creación de una versión ejecutable del sistema al compilar y vincular las versiones adecuadas de los componentes y las librerías que constituyen el sistema."*

**Los scripts de construcción son ellos mismos elementos de configuración.** Sommerville establece que la construcción es un proceso complejo que puede involucrar tres plataformas distintas (p. 694): el sistema de desarrollo (IDE local), el servidor de construcción (CI), y el entorno objetivo (producción). Un script de construcción desactualizado puede producir un ejecutable que no funciona en producción aunque funcione en el entorno de desarrollo. Por esto, archivos como `package.json`, `pubspec.yaml`, `Makefile`, `Dockerfile` y `.github/workflows/` deben estar **bajo control de versiones** como cualquier otro elemento de configuración.

---

### 7.2 Herramientas de Construcción

*(Cap. 25, §25.3, p. 695)*

Sommerville menciona explícitamente herramientas y categorías:

| Herramienta | Propósito | Categoría según el libro |
|---|---|---|
| **Make** | Automatización de compilación con resolución de dependencias | Herramienta clásica de construcción (Unix) |
| **Maven** | Gestión del ciclo de vida de proyectos Java (compilar, probar, empaquetar) | Sistema de construcción con gestión de dependencias |
| **Ant** | Automatización de tareas de construcción en Java (XML-based) | Herramienta de construcción orientada a tareas |
| **Gradle** | Construcción flexible para proyectos Java/Android | Sistema moderno de construcción (mencionado por contexto en ediciones actuales) |

Sommerville también enumera las **7 capacidades** que debe ofrecer cualquier sistema de construcción automatizado (p. 695): generación de scripts, integración con el gestor de versiones, recompilación mínima, creación del ejecutable, automatización de pruebas, generación de informes y generación de documentación. **Ver M1-06, Sección 6.2** para la lista completa.

---

### 7.3 Gestión de Dependencias

*(Cap. 25, §25.3, p. 694)*

Sommerville identifica la complejidad del proceso de construcción asociada a las dependencias externas:

> **"Construir es un proceso complejo, que potencialmente es proclive al error, pues tres diferentes plataformas de sistema pueden estar implicadas."** (p. 694)

La gestión de dependencias resuelve el problema de reproducibilidad: garantizar que el sistema construido hoy con la versión 1.2.3 de una librería pueda construirse exactamente igual en 6 meses. Lo que debe incluirse en el control de versiones respecto a las dependencias:

- **Lockfiles** (`package-lock.json`, `yarn.lock`, `pubspec.lock`): fijan las versiones exactas de todas las dependencias transitivas. Sommerville no menciona explícitamente los lockfiles (el concepto es posterior a la 9ª edición), pero el principio se deriva directamente de su exigencia de reproducibilidad de versiones (p. 700).
- **Manifiestos de dependencias** (`package.json`, `pubspec.yaml`, `requirements.txt`): declaran las dependencias del proyecto. Siempre bajo control de versiones.
- **Las dependencias en sí** (node_modules, .pub-cache): Sommerville no desarrolla este tema en §25.3. La práctica estándar es **no** versionarlas directamente (excluirlas con `.gitignore`) y reconstruirlas desde el lockfile en cada build.

---

### 7.4 Integración Continua

*(Cap. 25, §25.3, Fig. 25.12, pp. 697–698)*

> **"Para ser congruentes con la noción de los métodos ágiles de elaborar muchos cambios pequeños, la integración continua implica reconstruir frecuentemente la línea principal (mainline), después de realizar pequeños cambios al código fuente."** (p. 697)

**Frecuencia recomendada:** Reconstrucción de la línea principal después de cada pequeño cambio al código fuente — en la práctica, en cada commit a la rama `develop`.

**Lo que debe ocurrir en cada ciclo de integración** (Sommerville, Fig. 25.12, pp. 697–698):

1. Sacar la línea principal al espacio de trabajo privado
2. Construir el sistema y ejecutar pruebas automatizadas
3. Realizar cambios a los componentes
4. Construir el sistema localmente y re-ejecutar pruebas
5. Ingresar al servidor de construcción
6. Construir en el servidor y ejecutar pruebas (si otros cambiaron componentes → resolver conflictos)
7. Si pasa → confirmar como nueva línea base en la línea principal

**Problemas que resuelve:**
> *"El argumento para la integración continua es que permite que los problemas causados por las interacciones entre diferentes desarrolladores se descubran y reparen tan pronto como sea posible."* (p. 698)

**Problemas que puede generar:** Sommerville advierte que si el equipo es grande y los cambios son frecuentes, puede ser difícil identificar qué cambio específico rompió la build. Por esto la política de commits debe exigir cambios pequeños y cohesivos (un commit = un cambio lógico).

**Herramientas de CI mencionadas por Sommerville:** El libro no menciona herramientas específicas de CI en §25.3. En el contexto del stack del proyecto (Next.js + Flutter + Firebase), las herramientas habituales son GitHub Actions, GitLab CI o CircleCI.

> **Aplicación en el sistema:** El pipeline de CI del proyecto se configura durante M2-01 (planificación). Este archivo documenta el marco teórico que justifica la política de CI. El gestor define en el Plan de GCS (Sección 9.2): frecuencia de builds (en cada commit a `develop`), umbral de cobertura mínima y criterio de ruptura del pipeline (pipeline roto = bloquea el merge a `develop`). **Ver M2-01, Sección 7** para la planificación del plan de gestión de la configuración como plan complementario al plan de proyecto.

---

## 8. Gestión de Entregas (Cap. 25 §25.4)

### 8.1 Definición de Entrega

*(Cap. 25, §25.4, p. 699)*

> **"Una entrega (release) de sistema es una versión de un sistema de software que se distribuye a los clientes. Para software de mercado masivo es posible identificar por lo general dos tipos de entregas: release mayor, que proporciona funcionalidad significativamente nueva, y release menor, que repara bugs y corrige problemas reportados por el cliente."** (p. 699)

**Diferencia entre entrega interna y externa:**

| Tipo | Destinatario | Criterio de calidad | Documentación |
|---|---|---|---|
| **Interna** (staging) | Equipo de pruebas / QA | Pipeline verde, pruebas automatizadas | Notas de build internas |
| **Externa** (producción) | Cliente / usuarios finales | Aceptación formal del cliente | Notas de versión completas (Sección 8.3) |

**Componentes de un paquete de entrega** según Sommerville (§25.4, p. 700):

> *"Una entrega de sistema no sólo es el código ejecutable del sistema — ésta también puede incluir: archivos de configuración que definan cómo debe configurarse la entrega para instalaciones particulares; archivos de datos, como los archivos de mensajes de error, necesarios para la operación exitosa del sistema; un programa de instalación para ayudar a instalar el sistema en el hardware objetivo; documentación electrónica y escrita que describa al sistema; empaquetado y publicidad asociada diseñados para dicha entrega."* (p. 700)

---

### 8.2 Tipos de Entregas y Semantic Versioning

*(Cap. 25, §25.4, p. 699)*

Sommerville distingue releases mayores y menores con el ejemplo:

> *"OS 10.5.8. Esto significa la release menor 8 de la release mayor 5 de OS 10."* (p. 699)

Aplicando este esquema al repositorio del proyecto con la convención `X.Y.Z`:

| Componente | Cuándo incrementa | Qué implica |
|---|---|---|
| **VERSIÓN MAYOR (X)** | Cambio incompatible con versiones anteriores; nueva funcionalidad estructural; cambio de alcance que requiere SRS v2.0 | Requiere CCB del SRS (M3-05) + CCB del repositorio; notificación formal al cliente |
| **VERSIÓN MENOR (Y)** | Nueva funcionalidad compatible con versiones anteriores; grupo de SCR aprobadas del sprint | Requiere CCB del repositorio; entrega externa con notas de versión |
| **CORRECCIÓN (Z)** | Corrección de bug (hotfix) sin nuevas funcionalidades; no cambia el comportamiento esperado por el SRS | Proceso expedito de CCB; rama `hotfix/SCR-NNN`; despliegue urgente |

> *Sommerville no usa explícitamente el término "Semantic Versioning" en §25.4. La convención X.Y.Z se deriva de su descripción de releases mayores/menores (p. 699) combinada con la práctica estándar de la industria.*

---

### 8.3 Notas de Versión (Release Notes)

*(Cap. 25, §25.4, p. 700)*

Sommerville establece:

> **"Cuando se produce una entrega de sistema, esto debe documentarse para garantizar que pueda recrearse con exactitud en el futuro. Para documentar una entrega, es necesario registrar las versiones específicas de los componentes de código fuente que se usaron en la creación del código ejecutable. Hay que conservar copias de los archivos de código fuente, los ejecutables correspondientes y todos los datos y archivos de configuración. También hay que registrar las versiones del sistema operativo, librerías, compiladores y otras herramientas utilizadas para construir el software."** (p. 700)

Elementos que el libro establece como obligatorios en la documentación de una entrega:
- Versiones específicas de los componentes de código fuente usados
- Copias de los archivos de código fuente y ejecutables
- Todos los datos y archivos de configuración
- Versiones del sistema operativo, librerías, compiladores y herramientas de construcción

Plantilla operativa completa para el sistema:

```
══════════════════════════════════════════════════════════════════
  NOTAS DE VERSIÓN — [nombre-proyecto] v[X.Y.Z]
══════════════════════════════════════════════════════════════════

IDENTIFICACIÓN
─────────────────────────────────────────────────────────────────
Proyecto:               [nombre del proyecto en austranet-cco]
Versión:                [X.Y.Z]
Fecha:                  [Date]
Entorno:                [staging | producción]
Responsable:            [ID MiembroEquipo — gestor del proyecto]

RESUMEN DE CAMBIOS
─────────────────────────────────────────────────────────────────
Nuevas funcionalidades:
  - [RF-XXX]: descripción breve del cambio implementado
  - [RF-XXX]: ...
Correcciones:
  - [SCR-NNN]: descripción del bug corregido
  - [SCR-NNN]: ...
Cambios técnicos:
  - [descripción de refactoring, actualización de dependencia, etc.]

REQUERIMIENTOS PREVIOS
─────────────────────────────────────────────────────────────────
Versión anterior requerida:     [X.Y.Z]
Cambios en base de datos:       [sí/no — migraciones requeridas]
Variables de entorno nuevas:    [lista de variables]
Librerías externas actualizadas:[nombre@versión — lista]

COMPONENTES INCLUIDOS (Sommerville, §25.4, p. 700)
─────────────────────────────────────────────────────────────────
Código fuente:          [hash del commit de release / tag]
Scripts DB:             [lista de migraciones aplicadas]
Archivos de config:     [lista de archivos de configuración]
Documentación:          [versión actualizada del documento]
Casos de prueba:        [resultado del pipeline: X/Y passed]
Herramientas de build:  [Node X.Y.Z, Flutter X.Y.Z, etc.]

INSTRUCCIONES DE DESPLIEGUE
─────────────────────────────────────────────────────────────────
1. [paso a paso del proceso de despliegue]
2. ...

ROLLBACK
─────────────────────────────────────────────────────────────────
Procedimiento para revertir a v[X.Y.Z-anterior]:
1. [paso a paso del rollback]
2. ...
Commit de rollback:     [hash del commit al que revertir]
══════════════════════════════════════════════════════════════════
```

---

### 8.4 Distribución y Despliegue

Sommerville no desarrolla explícitamente los aspectos de distribución y despliegue en §25.4. El foco del libro está en la documentación de la entrega y la reproducibilidad. La gestión del despliegue en la nube (Vercel, Firebase) y los pipelines de CD (Continuous Deployment) son prácticas que van más allá del alcance de la 9ª edición (2011).

> **Aplicación en el sistema:** Cada entrega del proyecto genera una entrada en el historial de versiones del `Proyecto` en el Módulo 2. El campo `SRS.version` y `Proyecto.estado` registran si la entrega corresponde al alcance aprobado del SRS v1.0 o incluye cambios post-aprobación (SRS v1.X o v2.0). Una entrega con cambios de SRS v2.0 requiere que el proceso M3-05 haya aprobado esos cambios antes del merge a `main`.

---

## 9. Plan de Gestión de Configuración del Proyecto

Esta sección es el **entregable operativo más importante del archivo**. El gestor del proyecto lo completa al momento en que el proyecto transita a `activo_en_desarrollo`.

### 9.1 Contenido del Plan según Sommerville

*(Cap. 25, §23.2.1, Fig. 23.2, p. 624 — Plan complementario de GCS)*

Sommerville establece que el **Plan de Gestión de la Configuración** es uno de los planes complementarios que debe producir el proceso de planificación del proyecto:

> *"Plan de gestión de la configuración: Describe la configuración de los procedimientos y las estructuras para la gestión."* (Cap. 23, §23.2.1, Fig. 23.2, p. 624)

Los elementos que el libro indica que debe incluir un Plan de GCS:

- Identificación de los elementos de configuración bajo control
- Políticas y procedimientos de cambio
- Herramientas y estructura del repositorio
- Roles y responsabilidades en el proceso de CM
- Política de versiones y etiquetado
- Política de entregas y distribución

**Ver M1-06, Sección 8** para la política de control de configuración aplicada a los datos del sistema (perfiles de entidades, SRS).

---

### 9.2 Políticas del Repositorio del Proyecto

Plantilla operativa que el gestor del proyecto completa al activar `activo_en_desarrollo`:

```
══════════════════════════════════════════════════════════════════
  PLAN DE GESTIÓN DE CONFIGURACIÓN — PROYECTO [ID]
══════════════════════════════════════════════════════════════════

SISTEMA DE CONTROL DE VERSIONES
─────────────────────────────────────────────────────────────────
Herramienta:            [Git]
Modelo:                 [distribuido]
Repositorio remoto:     [URL — GitHub / GitLab]
Acceso:                 [lista de MiembroEquipo con permisos]
Responsable de accesos: [ID Proyecto.gestorId]

POLÍTICA DE RAMAS
─────────────────────────────────────────────────────────────────
Rama principal:         main (solo entregas aprobadas por CCB)
Rama de integración:    develop (CI — integración continua)
Ramas de trabajo:       feature/SCR-NNN (una por solicitud de cambio aprobada)
Ramas de corrección:    hotfix/SCR-NNN (correcciones críticas en main)
Merge a main:           requiere aprobación del CCB + pipeline verde + tag X.Y.Z
Protección de main:     sin commits directos — solo merge aprobado

ELEMENTOS DE CONFIGURACIÓN BAJO CONTROL (Sommerville, §25, p. 684)
─────────────────────────────────────────────────────────────────
[ ] Código fuente (todos los archivos del proyecto)
[ ] Scripts de construcción (package.json, pubspec.yaml, Makefile)
[ ] Scripts de base de datos (migraciones Firestore / SQL)
[ ] Archivos de configuración (sin secretos — usar variables de entorno)
[ ] Casos de prueba automatizados
[ ] Documentación técnica (README, wikis, diagramas)
[ ] Lockfile de dependencias (package-lock.json, pubspec.lock)
[ ] Dockerfile / archivos de infraestructura como código
[ ] Archivos del pipeline CI (.github/workflows/, .gitlab-ci.yml)
[ ] Archivos excluidos: node_modules/, .pub-cache/, .env, secretos

POLÍTICA DE COMMITS
─────────────────────────────────────────────────────────────────
Formato obligatorio:    [SCR-NNN] Descripción breve del cambio
Ejemplo:                [SCR-2026-042] Fix: validación de email en login
Tamaño máximo:          Un commit = un cambio lógico cohesivo
Sin commits directos a main ni develop sin aprobación CCB

INTEGRACIÓN CONTINUA
─────────────────────────────────────────────────────────────────
Herramienta de CI:      [GitHub Actions | GitLab CI | CircleCI]
Frecuencia de builds:   En cada commit a develop
Pipeline mínimo:        lint → compilación → pruebas unitarias
                        → pruebas de integración → análisis estático
Umbral de cobertura:    [XX% — definido por el gestor]
Criterio de ruptura:    Pipeline roto = bloquea el merge a develop
Notificación:           Alerta automática al MiembroEquipo responsable

POLÍTICA DE VERSIONES (Semantic Versioning X.Y.Z)
─────────────────────────────────────────────────────────────────
Mayor (X):  Cambio incompatible; nuevo alcance; requiere SRS v2.0
Menor (Y):  Nueva funcionalidad compatible; grupo de SCR de sprint
Corrección (Z): Corrección de bug; no cambia funcionalidad del SRS
Etiquetado: git tag -a vX.Y.Z -m "Release vX.Y.Z — [descripción]"

PROCESO CCB DEL REPOSITORIO
─────────────────────────────────────────────────────────────────
Quién puede crear SCR:  Cualquier MiembroEquipo del proyecto
Quién aprueba SCR:      Gestor del proyecto (Proyecto.gestorId)
Tiempo máximo revisión: [N días hábiles — recomendado: ≤ 3 días]
SCR urgente (hotfix):   Aprobación del gestor en < 24 horas
Doble CCB:              Si SCR modifica RF del SRS → requiere
                        también aprobación CCB del SRS (M3-05)
══════════════════════════════════════════════════════════════════
```

---

## 10. Checklist Operativo: Auditoría del Repositorio

Lista de verificación que el gestor del proyecto ejecuta al inicio de cada entrega externa:

```
══════════════════════════════════════════════════════════════════
  AUDITORÍA DEL REPOSITORIO
  Proyecto: _________________________  Versión: _______________
══════════════════════════════════════════════════════════════════

CONTROL DE VERSIONES
[ ] Todos los EC están bajo control de versiones (ningún artefacto fuera del repo)
[ ] No hay archivos modificados sin commit en ramas de entrega
[ ] La rama main está protegida (sin commits directos sin CCB)
[ ] Los tags de versión aplicados con formato X.Y.Z
[ ] Las ramas feature/hotfix cerradas tras su merge

CONSTRUCCIÓN DEL SISTEMA
[ ] El script de construcción está versionado (package.json, pubspec.yaml, etc.)
[ ] La build ejecuta sin errores en entorno limpio (desde cero)
[ ] Las dependencias de terceros tienen versiones fijadas (lockfile presente)
[ ] Los artefactos de build están excluidos del repositorio (.gitignore)
[ ] Las variables de entorno de producción están documentadas (sin valores secretos)

INTEGRACIÓN CONTINUA
[ ] El pipeline de CI está activo y verde en develop
[ ] Todos los tests automatizados pasan (0 fallos)
[ ] La cobertura de código cumple el umbral definido en el Plan de GCS
[ ] No hay alertas de seguridad activas en las dependencias

CONTROL DE CAMBIOS
[ ] Todos los cambios implementados en esta versión tienen SCR aprobada
[ ] Las SCR rechazadas están notificadas al solicitante
[ ] La trazabilidad SCR → commit → versión está completa
[ ] Los cambios que modificaron RF del SRS tienen también CCB del SRS aprobado (M3-05)

GESTIÓN DE ENTREGAS
[ ] Las notas de versión están redactadas con todos los campos (Sección 8.3)
[ ] El paquete de entrega incluye todos los componentes (Sommerville, p. 700)
[ ] El plan de rollback está documentado y probado
[ ] Los stakeholders de M1 con nivelInfluencia = 'alto' recibieron las notas de versión
══════════════════════════════════════════════════════════════════
```

---

## 11. KPIs del Repositorio

Métricas que el sistema calcula para evaluar la salud del proceso de gestión de configuración:

| KPI | Definición | Fórmula | Meta | Alerta |
|---|---|---|---|---|
| **Tasa de SCR aprobadas** | % de solicitudes aprobadas sobre presentadas | `(SCR_aprobadas / SCR_total) × 100` | 70–85% | < 50% (proceso mal definido o filtro excesivo) |
| **Tiempo medio de revisión** | Días promedio entre creación y resolución del SCR | `Σ(fechaResolucion - fechaCreacion) / total_SCR` | ≤ 3 días hábiles | > 7 días (cuello de botella en el CCB) |
| **Frecuencia de builds** | Builds por semana en la rama develop | `count(builds_semana)` | ≥ 5/semana | < 2/semana (CI no activo) |
| **Tasa de builds rotos** | % de builds que fallan en el pipeline | `(builds_fallidos / total_builds) × 100` | < 10% | > 25% (inestabilidad del código base) |
| **Velocidad de entrega** | Días entre versiones menores (Y) consecutivas | `fechaEntrega_N - fechaEntrega_N-1` | Según cronograma M2-01 | > 2× el promedio histórico |
| **Trazabilidad de commits** | % de commits que referencian una SCR aprobada | `(commits_con_SCR / total_commits) × 100` | 100% | < 90% (commits sin trazabilidad) |

---

## 12. Tabla de Conexiones con los 3 Módulos

| Concepto / Proceso | Módulo | Campo o proceso específico |
|---|---|---|
| Solicitante del cambio | M2 | `MiembroEquipo` (cualquier miembro del proyecto) |
| Aprobador del CCB repositorio | M2 | `Proyecto.gestorId` |
| Impacto en SRS | M3 | Si la SCR modifica RF aprobados → requiere proceso M3-05 de cambio post-aprobación |
| Trazabilidad SCR → RF | M3 | `Requerimiento.codigo` vinculado al campo "Funcionalidad afectada" de la SCR |
| Stakeholder que recibe notas de versión | M1 | `Stakeholder.nivelInfluencia = 'alto'` |
| Estado del proyecto como precondición | M2 | `Proyecto.estado = 'activo_en_desarrollo'` (precondición para activar este proceso) |
| Riesgos técnicos del repositorio | M2 | `RiesgoProyecto.tipo = 'tecnologico'` — ver **M2-03, Sección 4.1** |
| Riesgos de requerimientos materializados | M2 → M3 | Si un riesgo de tipo `requerimientos` se materializa, notificación al SRS activo en M3 — ver **M2-03, Sección 6.3** |
| Nivel de riesgo que afecta el repositorio | M1 → M2 | `Entidad.nivelRiesgo = 'critico'` hereda riesgos organizacionales al registro del proyecto |
| Entidades que requieren historial de derivación | M1 | Perfiles con `nivelRiesgo = 'alto' | 'critico'` — ver **M1-06, Sección 4.1** |
| Plan de GCS como plan complementario | M2 | Definido en M2-01 (Sección 7, planes complementarios) — completado en este archivo (Sección 9.2) |

---

## 13. Checklist de Completitud del Archivo

| Ítem | Fuente | ✅ |
|---|---|---|
| Definición de GCS y tipos de elementos de configuración | Cap. 25, intro, p. 682 + Fig. 25.2, p. 684 | ✅ |
| Las 4 actividades principales de la GCS | Cap. 25, p. 682, Fig. 25.1 | ✅ |
| Proceso CCB con diagrama de 7 pasos | Cap. 25, §25.1, Fig. 25.3, pp. 685–689 | ✅ |
| Formulario SCR completo con todos los campos | Cap. 25, §25.1, Fig. 25.4 + sistema | ✅ |
| Distinción CCB repositorio vs. CCB del SRS | M2-06 §4.1 + M3-05 | ✅ |
| Definición de variante, versión y entrega | Cap. 25, §25.2, Fig. 25.2, p. 684 | ✅ |
| Modelos de almacenamiento: deltas vs. instantáneas | Cap. 25, §25.2, Fig. 25.7, p. 691 | ✅ |
| Operaciones check-in / check-out | Cap. 25, §25.2, pp. 691–692, Fig. 25.8 | ✅ |
| Ramificación y fusión con esquema de ramas | Cap. 25, §25.2, Fig. 25.9, p. 692 | ✅ |
| Centralizado (SVN) vs. distribuido (Git) con tabla comparativa | Cap. 25, §25.2, pp. 690–693 | ✅ |
| Definición y componentes de construcción del sistema | Cap. 25, §25.3, p. 693 + Fig. 25.2, p. 684 | ✅ |
| Herramientas de construcción mencionadas por el libro | Cap. 25, §25.3, p. 695 | ✅ |
| Gestión de dependencias y lockfiles | Cap. 25, §25.3, p. 694 | ✅ |
| Integración continua: definición, pasos y política | Cap. 25, §25.3, Fig. 25.12, pp. 697–698 | ✅ |
| Definición de entrega y componentes del paquete | Cap. 25, §25.4, pp. 699–700 | ✅ |
| Semantic versioning X.Y.Z | Cap. 25, §25.4, p. 699 | ✅ |
| Plantilla de notas de versión con campos completos | Cap. 25, §25.4, p. 700 + sistema | ✅ |
| Plan de GCS del proyecto: plantilla completa | Cap. 25 + Cap. 23, §23.2.1 + sistema | ✅ |
| Checklist de auditoría del repositorio | Sistema austranet-cco | ✅ |
| KPIs del repositorio con fórmulas y umbrales | Sistema austranet-cco | ✅ |
| Tabla de conexiones con M1, M2, M3 | Sistema completo | ✅ |
| Diferenciación explícita con M1-06 | M1-06 + M2-06, Sección 2.2 | ✅ |
| Referencias cruzadas con M1-06, M2-01, M2-03, M3-05 | Todas las secciones relevantes | ✅ |

---

*Documento generado según las instrucciones de arquitectura documental del sistema austranet-cco.*  
*Fuente primaria: Ian Sommerville, Ingeniería de Software, 9.ª edición, Pearson Educacin, 2011. Capítulo 25 (pp. 681–703).*  
*No repite contenido teórico ya cubierto en M1-06-control-configuracion-perfiles.md.*
