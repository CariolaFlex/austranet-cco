# M1-06-control-configuracion-perfiles.md

> **Marco Teórico:** Administración de la Configuración aplicada al Módulo 1 — Registro de Clientes y Proveedores  
> **Fuente:** Ian Sommerville, *Ingeniería de Software*, 9.ª edición, Pearson, 2011 — **Capítulo 25 completo**

---

## 1. Metadatos del Documento

| Campo | Valor |
|---|---|
| **Nombre del archivo** | `M1-06-control-configuracion-perfiles.md` |
| **Módulo principal** | Módulo 1 — Registro de Clientes y Proveedores (Entidades) |
| **Módulos relacionados** | Módulo 2 — Proyectos · Módulo 3 — Documentación SRS |
| **Capítulo fuente** | Cap. 25 — Administración de la Configuración (pp. 681–703) |
| **Versión** | 1.0.0 |
| **Fecha** | 2026-02-24 |
| **Estado** | `activo` — listo para implementación |
| **Sistema de referencia** | austranet-cco |

---

## 2. Objetivo del Documento

Este archivo documenta el **marco teórico de la administración de la configuración** tal como lo define Sommerville en el Cap. 25, y lo mapea de forma operativa a los tres módulos del sistema **austranet-cco**. El énfasis primario está en el Módulo 1 (perfiles de entidades), con proyecciones al Módulo 2 (proyectos) y Módulo 3 (documentos SRS).

### ¿Por qué es un requisito legal y profesional, no solo una buena práctica?

Cuando el sistema opera con **empresas de alto calibre** — contratistas, proveedores estratégicos, entidades con NDA activo — la trazabilidad de cambios en los perfiles deja de ser una conveniencia técnica y se convierte en:

- **Requisito contractual**: un NDA firmado referencia datos específicos del perfil de una entidad en un momento dado. Si ese perfil cambia sin trazabilidad, la validez del acuerdo puede cuestionarse legalmente.
- **Requisito de auditoría**: en proyectos con certificación ISO 9001 o CMMI, la norma exige que los cambios a elementos de configuración sean registrados, rastreados y aprobados formalmente.
- **Requisito de trazabilidad forense**: ante disputas contractuales, litigios o auditorías fiscales, el sistema debe poder responder con exactitud: *¿qué versión del perfil se usó para firmar este contrato?* — una pregunta que no puede responderse sin control de configuración.
- **Requisito de integridad operacional**: cambiar el nivel de riesgo de una entidad de `medio` a `crítico` sin registro de quién lo cambió, cuándo y por qué, es un riesgo institucional inaceptable.

> La administración de la configuración no es burocracia: es la memoria institucional del sistema.

---

## 3. ¿Qué es la Administración de la Configuración?

### 3.1 Definición Formal

*(Cap. 25, introducción, p. 682)*

> **"La administración de la configuración (CM, por las siglas de *configuration management*) se ocupa de las políticas, los procesos y las herramientas para administrar los sistemas cambiantes de software."**

Sommerville precisa el propósito:

> **"Es necesario gestionar los sistemas en evolución porque es fácil perder la pista de cuáles cambios y versiones del componente se incorporaron en cada versión del sistema."** (p. 682)

Y agrega la consecuencia de no tener CM:

> **"Si no se cuenta con procedimientos efectivos de administración de la configuración, se puede malgastar esfuerzo al modificar la versión equivocada de un sistema, entregar a los clientes la versión incorrecta de un sistema u olvidar dónde se almacena el código fuente del software para una versión particular del sistema o componente."** (p. 682)

**Aplicación en el sistema:** En austranet-cco, "versión equivocada" equivale a mostrar datos obsoletos del perfil de una entidad al generar un contrato o un SRS. Sin CM, no hay garantía de qué datos se usaron en una operación pasada. Con CM, cada perfil tiene una versión exacta vinculada a cada operación realizada.

---

### 3.2 Ítems de Configuración (SCI)

*(Cap. 25, Fig. 25.2 — Terminología CM, p. 684)*

> **"Ítem de configuración o ítem de configuración de software (SCI, por las siglas de *Software Configuration Item*): Cualquier aspecto asociado con un proyecto de software —diseño, código, datos de prueba, documento, etcétera— se coloca bajo control de configuración. Por lo general, existen diferentes versiones de un ítem de configuración. Los ítems de configuración tienen un nombre único."**

El libro enumera explícitamente los tipos de elementos que pueden ser SCIs:
- Código fuente de componentes
- Datos de prueba
- Documentos del proyecto
- Diseños y modelos
- Archivos de configuración

> **Principio clave:** todo artefacto del proyecto — no solo el código — debe estar bajo control de configuración.

**Aplicación en el sistema:**

| Tipo SCI (Sommerville) | Equivalente en austranet-cco | Módulo |
|---|---|---|
| Código fuente | Código del sistema (repositorio Git) | Infraestructura |
| Documento | Documento SRS, NDA, contrato | M1, M3 |
| Datos de prueba | Fixtures de pruebas automatizadas | Infraestructura |
| Datos de configuración | Perfil de entidad, configuración de proyecto | M1, M2 |
| Diseño | Modelos de datos, arquitectura del sistema | Infraestructura |

---

### 3.3 Las 4 Actividades Principales de la CM

*(Cap. 25, p. 682 — Fig. 25.1)*

> **"La administración de la configuración de un producto de sistema de software comprende cuatro actividades estrechamente relacionadas:"**

1. **Administración del cambio**: *"Hacer un seguimiento de las peticiones de cambios al software por parte de clientes y desarrolladores, estimar los costos y el efecto de realizar dichos cambios, y decidir si deben implementarse los cambios y cuándo."*

2. **Gestión de versiones**: *"Hacer un seguimiento de las numerosas versiones de los componentes del sistema y garantizar que los cambios hechos por diferentes desarrolladores a los componentes no interfieran entre sí."*

3. **Construcción del sistema**: *"El proceso de ensamblar los componentes del programa, datos y librerías, y luego compilarlos y vincularlos para crear un sistema ejecutable."*

4. **Gestión de entregas (release)**: *"Preparar el software para la entrega externa y hacer un seguimiento de las versiones del sistema que se entregaron para uso del cliente."*

#### Mapeo al sistema austranet-cco

| Actividad (Sommerville) | Equivalente en austranet-cco |
|---|---|
| Administración del cambio | Cambios en perfiles de entidades (M1) y configuración de proyectos (M2) |
| Gestión de versiones | Historial de versiones de documentos SRS (M3) y perfiles de entidades (M1) |
| Construcción del sistema | Despliegue de nuevas versiones de austranet-cco en producción (CI/CD) |
| Gestión de entregas | Entrega formal de documentación SRS al cliente (M3) |

**Aplicación en el sistema:** Cada actividad tiene un proceso específico en austranet-cco. La administración del cambio cubre los flujos de aprobación de modificaciones en perfiles. La gestión de versiones cubre el versionado automático de cada entidad y documento. La construcción y entregas cubren el ciclo de vida del sistema mismo y sus documentos exportables.

---

## 4. Administración del Cambio

*(Cap. 25, §25.1, pp. 685–689)*

> **"La administración del cambio tiene la intención de asegurar que la evolución del sistema sea un proceso gestionado en el que se da prioridad a los cambios más urgentes y rentables. El proceso de administración del cambio se ocupa de analizar los costos y beneficios de los cambios propuestos, aprobar aquellos que lo ameritan e indagar cuál o cuáles de los componentes del sistema se modificaron."** (p. 685)

---

### 4.1 El Proceso de Administración del Cambio

*(Cap. 25, §25.1, Fig. 25.3, pp. 685–689)*

Sommerville describe un proceso de múltiples etapas, cuyo modelo se muestra en la Fig. 25.3. A continuación se extrae cada etapa con sus características formales:

#### Etapa 1 — Envío de la Solicitud de Cambio

> **"El proceso de administración del cambio se inicia cuando un cliente completa y envía una petición de cambio en que se describe el cambio requerido al sistema. Éste podría ser el reporte de un bug, en el que se describan sus síntomas, o una petición para agregar alguna funcionalidad al sistema."** (p. 686)

Las solicitudes se envían mediante un **Formato de Petición de Cambio (CRF — *Change Request Form*)**.

> **"Los formatos electrónicos de petición de cambios registran información que se comparte entre todos los grupos implicados en la administración del cambio. Conforme se procesa la petición del cambio, se agrega información al CRF para registrar las decisiones tomadas en cada etapa del proceso. Por lo tanto, en cualquier momento representa una fotografía instantánea del estado de petición del cambio."** (p. 686)

#### Etapa 2 — Verificación (Comprobación de Validez)

> **"Después de enviar una petición de cambio, ésta se verifica para asegurarse de que sea válida. [...] La comprobación es necesaria porque no todas las peticiones de cambio requieren acción. Si la petición de cambio es un reporte de bug, tal vez éste ya haya sido reportado. En ocasiones, lo que la gente considera como problemas en realidad son malas interpretaciones de lo que se espera que haga el sistema."** (p. 687)

- **Si es inválida:** la solicitud se cierra y el formato se actualiza con la razón de cierre.
- **Si es válida:** se registra como petición sobresaliente para análisis posterior.

#### Etapa 3 — Análisis de Impacto y Costo-Beneficio

> **"Para peticiones válidas de cambio, la siguiente etapa del proceso consiste en evaluar y costear el cambio. Por lo general, esto es responsabilidad del equipo de desarrollo o del de mantenimiento [...] Debe comprobarse el efecto del cambio sobre el resto del sistema. Para hacer esto, hay que identificar todos los componentes afectados por el cambio."** (p. 687)

#### Etapa 4 — Aprobación o Rechazo (CCB)

El CCB o grupo de desarrollo evalúa los factores estratégicos. Sommerville enumera los criterios de decisión:

1. **Las consecuencias de no realizar el cambio** — gravedad si no se implementa
2. **Los beneficios del cambio** — a cuántos usuarios beneficia
3. **El número de usuarios afectados** — impacto en la base de usuarios
4. **Los costos de hacer el cambio** — esfuerzo, tiempo, riesgo de regresión
5. **El ciclo de liberación del producto** — si conviene diferir a la siguiente versión

> **"Los cambios aceptados se transmiten de regreso al grupo de desarrollo; las peticiones de cambio rechazadas se cierran y ya no se emprenden más acciones."** (p. 688)

#### Etapa 5 — Implementación del Cambio

El equipo de desarrollo ejecuta el cambio conforme a lo aprobado. Sommerville indica:

> **"Conforme el equipo de desarrollo modifica los componentes de software, debe mantener un registro de los cambios hechos a cada componente. Algunas veces a esto se le conoce como historial de derivación de un componente."** (p. 689)

El **historial de derivación** incluye: versión, modificador, fecha, descripción del cambio y referencia a la petición de cambio que lo originó (ver Fig. 25.5, p. 689).

#### Etapa 6 — Verificación del Cambio (QA)

> **"Cuando se implementa una nueva versión del software, se transfiere del equipo de desarrollo al equipo de aseguramiento de la calidad (QA). El equipo QA comprueba que la calidad del sistema sea aceptable."** (p. 683)

#### Etapa 7 — Cierre del Cambio

> **"Si algo de esto sucede, la petición de cambio se cierra y el formato se actualiza indicando la razón para el cierre."** (p. 687)

El CRF registra las fechas de solicitud, aprobación, implementación y validación, dejando un registro completo y auditable.

**Aplicación en el sistema:** En austranet-cco, este proceso de 7 etapas se implementa como el flujo de estados de una `ChangeRequest`. Para cambios en perfiles de entidades, el flujo completo aplica cuando el nivel de riesgo es `alto` o `crítico`. Para entidades de nivel `bajo` o `medio`, las etapas 3 y 4 pueden simplificarse (ver §8.3).

---

### 4.2 El Comité de Control de Cambios (CCB)

*(Cap. 25, §25.1, p. 688)*

> **"Para sistemas militares y gubernamentales, este grupo se conoce usualmente como consejo de control del cambio (CCB, por las siglas de *change control board*). En la industria puede llamarse grupo de desarrollo del producto, el cual es el responsable de tomar las decisiones sobre cómo debe evolucionar el sistema de software."** (p. 688)

**Propósito del CCB:**

> **"Este grupo debe revisar y aprobar todas las peticiones de cambio, a menos que los cambios impliquen simplemente corregir errores menores en pantallas de despliegue, páginas Web o documentos."** (p. 688)

**Perspectiva del CCB:**

> **"El CCB o el grupo de desarrollo del producto consideran el efecto del cambio desde un punto de vista estratégico y organizacional más que técnico. Decide si el cambio en cuestión está justificado económicamente y prioriza los cambios aceptados para su implementación."** (p. 688)

**Cuándo el CCB no es obligatorio** (cambios directos sin revisión formal):

> **"[...] a menos que los cambios impliquen simplemente corregir errores menores en pantallas de despliegue, páginas Web o documentos. Estas peticiones menores deben transmitirse al equipo de desarrollo sin un análisis detallado, pues esto podría ser más costoso que implementar el cambio."** (p. 688)

#### Composición típica del CCB según Sommerville:

| Rol en el CCB | Función |
|---|---|
| Representante del equipo de desarrollo | Evalúa viabilidad técnica del cambio |
| Representante de soporte al cliente | Representa los intereses del usuario final |
| Representante de marketing / negocio | Evalúa el impacto comercial y estratégico |
| Arquitecto del sistema | Valora cambios que afectan múltiples módulos |

**Aplicación en el sistema:** En austranet-cco, el CCB se implementa como el **flujo de aprobación formal** para:
- Cambios en perfiles de entidades con nivel de riesgo `alto` o `crítico`
- Cambios en documentos SRS que estén en estado `aprobado`
- Cambios en el estado o metodología de proyectos activos
Los cambios en entidades de nivel `bajo` o `medio` pueden ser directos, sin aprobación CCB.

---

### 4.3 Formulario de Solicitud de Cambio (CRF)

*(Cap. 25, §25.1, Fig. 25.4, pp. 686–688)*

Sommerville presenta en la **Fig. 25.4** un ejemplo de CRF parcialmente completado para el proyecto SICSA. Los campos que el libro muestra como parte del formato estándar son:

| Campo CRF | Descripción (Sommerville) | Obligatorio | Aplicación en austranet-cco |
|---|---|---|---|
| **Proyecto** | Identificador del proyecto al que pertenece el cambio | Sí | Nombre del módulo afectado (M1/M2/M3) |
| **Número de solicitud** | Identificador único de la petición de cambio | Sí | Auto-generado por el sistema (UUID o secuencial) |
| **Solicitante del cambio** | Quién pide el cambio | Sí | Usuario autenticado (UID + nombre) |
| **Fecha de solicitud** | Cuándo se envió la petición | Sí | Timestamp automático (ISO 8601) |
| **Cambio solicitado** | Descripción del cambio requerido y sus síntomas | Sí | Texto libre, mínimo 50 caracteres |
| **Analizador del cambio** | Quién realiza el análisis de impacto | Sí (post-recepción) | Analista o gestor asignado |
| **Fecha de análisis** | Cuándo se realizó el análisis | Sí (post-análisis) | Timestamp automático al asignar análisis |
| **Componentes afectados** | Qué elementos del sistema se modifican | Sí | Entidad/Proyecto/SRS + ID + campo específico |
| **Componentes asociados** | Qué otros elementos pueden verse impactados | No | Análisis de dependencias previo |
| **Valoración del cambio** | Descripción técnica del impacto y complejidad | Sí | Texto de análisis del analista |
| **Prioridad del cambio** | Nivel de urgencia del cambio | Sí | `critical` / `high` / `medium` / `low` |
| **Esfuerzo estimado** | Tiempo o costo estimado de implementación | No | Estimado en horas o días |
| **Fecha de decisión CCB** | Cuándo el CCB tomó la decisión | Sí (si pasa CCB) | Timestamp del registro de decisión |
| **Decisión** | Aprobado / Rechazado + versión objetivo | Sí | `approved` / `rejected` + versión de release |
| **Implementador** | Quién realizó el cambio | Sí (post-aprobación) | UID del ejecutor |
| **Fecha de implementación** | Cuándo se implementó | Sí (post-implementación) | Timestamp automático |
| **Fecha de envío a QA** | Cuándo se pasó a verificación | Sí (post-implementación) | Timestamp automático |
| **Decisión de QA** | Si el cambio pasó la verificación | Sí | `passed` / `failed` |
| **Estado general** | Etapa actual del proceso | Sí | `pending` → `analyzing` → `approved`/`rejected` → `implementing` → `verifying` → `closed` |

> **Nota de Sommerville** (p. 686): *"Para proyectos más pequeños, se recomienda que las peticiones de cambio se registren de manera formal y el CRF se enfoque en la descripción del cambio requerido, con menos énfasis en los conflictos de implementación."*

**Aplicación en el sistema:** El CRF se implementa como la entidad `ChangeRequest` en la base de datos. Los campos marcados como *obligatorios en el libro* son campos requeridos en el formulario. Los campos de timestamps se generan automáticamente. El campo `Estado general` mapea exactamente el flujo del proceso de administración del cambio de Sommerville (Fig. 25.3).

---

## 5. Gestión de Versiones

*(Cap. 25, §25.2, pp. 690–692)*

### 5.1 Definición

> **"La gestión de versiones (VM, por las siglas de *version management*) es el proceso de hacer un seguimiento de las diferentes versiones de los componentes de software o ítems de configuración, y los sistemas donde se usan dichos componentes. También incluye asegurar que los cambios hechos a dichas versiones por los diferentes desarrolladores no interfieran unos con otros."** (p. 690)

> **"Por lo tanto, se puede considerar a la gestión de versiones como el proceso de administrar líneas de código y líneas base."** (p. 690)

---

### 5.2 Terminología Fundamental de Versiones

*(Cap. 25, Fig. 25.2, p. 684)*

Sommerville define con precisión los términos clave en la Fig. 25.2 (Terminología CM):

| Término | Definición exacta (Sommerville, p. 684) |
|---|---|
| **Versión** | *"Una instancia de un ítem de configuración que difiere, en alguna forma, de otras instancias del mismo ítem. Las versiones siempre tienen un identificador único, que se compone generalmente del nombre del ítem de configuración más un número de versión."* |
| **Línea base (baseline)** | *"Una colección de versiones de componente que construyen un sistema. Las líneas base están controladas, lo que significa que las versiones de los componentes que conforman el sistema no pueden ser cambiadas."* |
| **Línea de código (codeline)** | *"Un conjunto de versiones de un componente de software y otros ítems de configuración de los cuales depende dicho componente."* |
| **Línea principal (mainline)** | *"Una secuencia de líneas base que representa diferentes versiones de un sistema."* |
| **Entrega / Liberación (release)** | *"Una entrega de un sistema que se libera para su uso a los clientes u otros usuarios en una organización."* |
| **Ramificación (branching)** | *"La creación de una nueva línea de código a partir de una versión en una línea de código existente. La nueva línea de código y la existente pueden desarrollarse de manera independiente."* |
| **Combinación (merging)** | *"La creación de una nueva versión de un componente de software al combinar versiones separadas en diferentes líneas de código."* |

> **⚠️ Distinción crítica para el Módulo 3:**
>
> - **Versión**: una instancia específica del documento SRS (ej. `SRS-001 v1.2`)
> - **Línea base**: el conjunto de versiones de todos los componentes (SRS + perfiles + configuración) que definen el sistema en un momento dado
> - **Release / Entrega**: la versión del SRS que se entrega formalmente al cliente

El libro **no usa el término "variante"** como un término técnico específico con definición propia en el Cap. 25. El concepto equivalente es el de *versiones en diferentes ramas (branches)* de una misma línea de código, que representan adaptaciones paralelas del mismo componente para contextos distintos.

---

### 5.3 Operaciones Fundamentales de Control de Versiones

*(Cap. 25, §25.2, pp. 691–692, Fig. 25.8)*

**Check-out (salida):**

> *"Los desarrolladores sacan componentes del repositorio público hacia su espacio de trabajo privado y pueden cambiarlos como deseen en su mismo espacio."* (p. 692)

- **Cuándo se usa:** antes de modificar cualquier ítem de configuración; garantiza que el desarrollador trabaja con la última versión del componente sin afectar a otros.

**Check-in (ingreso):**

> *"Cuando sus cambios están completos, ingresan los componentes al repositorio."* (p. 692)

- **Cuándo se usa:** al completar la modificación y haberla verificado localmente; crea una nueva versión en el repositorio.

**Branching (ramificación):**

> *"Una consecuencia del desarrollo independiente del mismo componente es que las líneas de código pueden ramificarse (branch). En vez de una secuencia lineal de versiones que refleje los cambios al componente con el paso del tiempo, puede haber varias secuencias independientes."* (p. 692)

- **Cuándo se usa:** cuando dos desarrolladores modifican el mismo componente simultáneamente, o cuando se necesita una versión especial para un cliente específico.

**Merging (combinación):**

> *"En alguna etapa, tal vez sea necesario combinar ramificaciones de líneas de código para crear una nueva versión de un componente que incluya todos los cambios realizados."* (p. 692)

- **Cuándo se usa:** al consolidar cambios paralelos en una sola versión. Si hay traslapes, *"un desarrollador debe verificar los conflictos y modificar los cambios de manera que sean compatibles."* (p. 692)

---

### 5.4 Identificación de Versiones

*(Cap. 25, §25.2, p. 691)*

> **"A las versiones gestionadas se les asignan identificadores cuando se envían al sistema. Dichos identificadores se basan, por lo general, en el nombre del ítem de configuración por ejemplo, ButtonManager, seguido por uno o más números. De esta manera, ButtonManager 1.3 significa la tercera versión en codeline 1 del componente ButtonManager."** (p. 691)

> **"Es importante que el sistema de identificación sea consistente, ya que esto simplifica el problema de definir configuraciones."** (p. 691)

El libro también menciona el uso de **atributos** como mecanismo de identificación adicional:

> *"Algunos sistemas CM también permiten la asociación de atributos con versiones — por ejemplo, móvil, pantalla pequeña — que también pueden usarse para identificación de la versión."* (p. 691)

---

### 5.5 Gestión de Ramas (Branching)

*(Cap. 25, §25.2, Fig. 25.9, p. 692)*

Sommerville ilustra en la Fig. 25.9 una estrategia de ramas donde:
- La **Codeline 1** es la línea de desarrollo principal
- La **Codeline 2** es una rama creada desde una versión de Codeline 1
- La **Codeline 2.1** es una sub-rama de Codeline 2
- Las versiones se fusionan (merging) cuando los cambios de diferentes ramas deben consolidarse

**Cuándo crear una rama:** cuando se necesita desarrollo paralelo o una versión especial para un cliente que no debe mezclarse con el desarrollo principal.

**Cuándo fusionar:** cuando los cambios paralelos están completos y deben incorporarse a la línea principal.

**Aplicación en el sistema:** Para el Módulo 3, cada documento SRS del sistema tiene su propia *codeline* de versiones. Cuando un SRS está en estado `aprobado`, crear una nueva versión equivale a crear una nueva entrada en su línea de versiones. La versión aprobada nunca se modifica directamente — siempre se crea una nueva versión (`v1.1`, `v2.0`), preservando la línea base original. Este es el principio de *línea base controlada* de Sommerville aplicado a documentos.

---

## 6. Construcción del Sistema

*(Cap. 25, §25.3, pp. 693–698)*

### 6.1 Definición

*(Cap. 25, Fig. 25.2, p. 684)*

> **"Construcción de sistema: Creación de una versión ejecutable del sistema al compilar y vincular las versiones adecuadas de los componentes y las librerías que constituyen el sistema."**

> **"La construcción del sistema es el proceso de crear un sistema ejecutable y completo al compilar y vincular los componentes del sistema, librerías externas, archivos de configuración, etcétera."** (p. 693)

---

### 6.2 Herramientas de Construcción

*(Cap. 25, §25.3, p. 695)*

Sommerville lista las capacidades que debe ofrecer un sistema de construcción automatizado:

1. **Generación de rutinas (scripts) de construcción** — analiza dependencias y genera el script de build
2. **Integración con el sistema de gestión de versiones** — extrae las versiones correctas de los componentes
3. **Recompilación mínima** — solo recompila los componentes que cambiaron (usando timestamps o checksums)
4. **Creación del sistema ejecutable** — vincula todos los artefactos para producir el ejecutable final
5. **Automatización de pruebas** — ejecuta el conjunto de pruebas definido después de cada build
6. **Informes** — reporta éxito o fallo de la construcción y las pruebas
7. **Generación de documentación** — genera notas de la construcción y páginas de ayuda

---

### 6.3 Integración Continua

*(Cap. 25, §25.3, Fig. 25.12, pp. 697–698)*

> **"Para ser congruentes con la noción de los métodos ágiles de elaborar muchos cambios pequeños, la integración continua implica reconstruir frecuentemente la línea principal (mainline), después de realizar pequeños cambios al código fuente."** (p. 697)

El proceso de integración continua según Sommerville (pp. 697–698):

1. Sacar la línea principal al espacio de trabajo privado
2. Construir el sistema y ejecutar pruebas automatizadas (si falla → corregir el problema)
3. Realizar cambios a los componentes del sistema
4. Construir el sistema localmente y re-ejecutar pruebas (si fallan → continuar editando)
5. Ingresar al servidor de construcción
6. Construir en el servidor y ejecutar pruebas (si otros cambiaron componentes → sacar y editar hasta pasar)
7. Si pasa → confirmar como nueva línea base en la línea principal

> **"El argumento para la integración continua es que permite que los problemas causados por las interacciones entre diferentes desarrolladores se descubran y reparen tan pronto como sea posible."** (p. 698)

---

### 6.4 Gestión de Dependencias

*(Cap. 25, §25.3, p. 694)*

> **"Construir es un proceso complejo, que potencialmente es proclive al error, pues tres diferentes plataformas de sistema pueden estar implicadas."** (p. 694)

Las tres plataformas que Sommerville identifica:
1. **Sistema de desarrollo** — donde se escribe y edita el código (VS Code, IDE)
2. **Servidor de construcción** — donde se construyen las versiones ejecutables definitivas
3. **Entorno objetivo** — donde se ejecuta el sistema en producción

**Aplicación en el sistema:** La construcción del sistema se refiere al proceso de despliegue de austranet-cco en producción (Vercel + Firebase). Cada despliegue exitoso constituye una nueva "entrega" que debe registrarse con: número de versión del sistema, fecha de despliegue, commit SHA del repositorio Git y lista de cambios incluidos (changelog). El pipeline CI/CD (GitHub Actions o equivalente) implementa el proceso de integración continua de Sommerville.

---

## 7. Gestión de Entregas de Software (Release)

*(Cap. 25, §25.4, pp. 699–701)*

### 7.1 Definición y Tipos de Release

> **"Una entrega (release) de sistema es una versión de un sistema de software que se distribuye a los clientes. Para software de mercado masivo es posible identificar por lo general dos tipos de entregas: release mayor, que proporciona funcionalidad significativamente nueva, y release menor, que repara bugs y corrige problemas reportados por el cliente."** (p. 699)

**Ejemplo del libro:** *"OS 10.5.8. Esto significa la release menor 8 de la release mayor 5 de OS 10."* (p. 699)

> **"Las entregas mayores son muy importantes económicamente para el proveedor de software, pues los clientes tienen que pagar por ellas. Las entregas menores generalmente se distribuyen de manera gratuita."** (p. 699)

---

### 7.2 Contenido de una Entrega

*(Cap. 25, §25.4, p. 700)*

> **"Una entrega de sistema no sólo es el código ejecutable del sistema — ésta también puede incluir:"**
> - *"Archivos de configuración que definan cómo debe configurarse la entrega (release) para instalaciones particulares"*
> - *"Archivos de datos, como los archivos de mensajes de error, necesarios para la operación exitosa del sistema"*
> - *"Un programa de instalación para ayudar a instalar el sistema en el hardware objetivo"*
> - *"Documentación electrónica y escrita que describa al sistema"*
> - *"Empaquetado y publicidad asociada diseados para dicha entrega"*

---

### 7.3 Documentación de una Entrega

*(Cap. 25, §25.4, p. 700)*

> **"Por lo tanto, cuando se produce una entrega de sistema, esto debe documentarse para garantizar que pueda recrearse con exactitud en el futuro."** (p. 700)

Sommerville especifica qué debe registrarse:

> **"Para documentar una entrega, es necesario registrar las versiones específicas de los componentes de código fuente que se usaron en la creación del código ejecutable. Hay que conservar copias de los archivos de código fuente, los ejecutables correspondientes y todos los datos y archivos de configuración. También hay que registrar las versiones del sistema operativo, librerías, compiladores y otras herramientas utilizadas para construir el software."** (p. 700)

---

### 7.4 Factores que Determinan el Momento de una Entrega

*(Cap. 25, §25.4, Fig. 25.13, p. 700)*

| Factor | Descripción (Sommerville) |
|---|---|
| **Calidad técnica del sistema** | Fallas graves pueden requerir una entrega de reparación inmediata; fallas menores se manejan con parches |
| **Cambios de plataforma** | Nueva versión del SO u otra plataforma puede requerir nueva entrega |
| **Quinta Ley de Lehman** | Mucha funcionalidad nueva introduce bugs → la siguiente entrega se enfoca en correcciones |
| **Competencia** | Nuevas características de competidores pueden forzar una entrega para mantener participación de mercado |
| **Requerimientos de marketing** | Compromisos de fechas de entrega del departamento comercial |
| **Propuestas de cambio del cliente** | Cambios pagados por el cliente que esperan una entrega específica |

---

### 7.5 Entregas en Metodologías Ágiles

*(Cap. 25, §25.4, pp. 699–701)*

Si bien Sommerville trata las entregas principalmente en el contexto de productos de software, establece el principio de **entregas frecuentes y pequeñas** como consistente con los métodos ágiles:

> *"La integración continua implica reconstruir frecuentemente la línea principal, después de realizar pequeños cambios al código fuente."* (p. 697)

Y en el contexto de productos:

> *"Si las entregas son muy frecuentes o requieren actualizaciones de hardware, los clientes quizá no se cambien hacia la nueva entrega."* (p. 700)

La tensión entre **frecuencia de entregas** y **adopción por parte del cliente** es la razón por la que la gestión de entregas requiere planificación estratégica.

**Aplicación en el sistema:** La gestión de entregas aplica directamente al Módulo 3 cuando se entrega un documento SRS al cliente. Cada entrega del SRS es un **release externo** que debe registrarse con: número de versión, fecha de entrega, lista de requerimientos incluidos (funcionales y no funcionales), identificadores de los stakeholders que lo aprobaron y observaciones o condicionantes. El código ejecutable equivale al PDF/documento firmado que se entrega al cliente.

---

## 8. Política de Control de Configuración del Sistema austranet-cco

> Esta sección es el **entregable operativo** del documento. Está lista para implementarse como reglas de negocio del sistema sin modificación.

---

### 8.1 Ítems bajo Control de Configuración

Todos los artefactos listados en esta tabla deben tener versionado automático y auditoría de cambios en el sistema:

| Ítem de Configuración | Módulo | Evento que dispara versionado | ¿Requiere aprobación CCB? |
|---|---|---|---|
| **Perfil de Entidad** (datos generales) | M1 | Cualquier modificación de campos | No (nivel `bajo`/`medio`) / Sí (nivel `alto`/`crítico`) |
| **Estado de Entidad** | M1 | Cambio de estado (`activo` → `inactivo`, etc.) | Sí, siempre |
| **Nivel de Riesgo de Entidad** | M1 | Cambio de clasificación de riesgo | Sí, siempre |
| **NDA de Entidad** | M1 | Alta inicial, renovación o revocación | Sí, siempre |
| **Stakeholders de Entidad** | M1 | Alta, modificación o baja de contactos clave | No |
| **Perfil de Proyecto** | M2 | Cambio de metodología, equipo o presupuesto | Sí si estado = `activo` |
| **Estado de Proyecto** | M2 | Cambio de estado del proyecto | Sí, siempre |
| **Registro de Riesgos** | M2 | Alta, actualización o cierre de riesgo | No |
| **Documento SRS** | M3 | Cualquier cambio después del primer `aprobado` | Sí, siempre |
| **Requerimiento individual** | M3 | Alta, modificación, priorización o cierre | No si SRS en `borrador` / Sí si SRS en `aprobado` |
| **Stakeholders del SRS** | M3 | Alta o modificación de aprobadores | Sí si SRS en `aprobado` |

---

### 8.2 Reglas de Versionado del SRS (Módulo 3)

Basado en el principio de Sommerville de **releases mayores vs. menores** (§25.4, p. 699) y en el concepto de **línea base controlada** (Fig. 25.2, p. 684), aplicado a documentos en lugar de software:

```
ESQUEMA:  vMAJOR.MINOR
```

| Versión | Significado | ¿Requiere aprobación? | Descripción de uso |
|---|---|---|---|
| `v0.x` | Borrador en construcción | No | Fase de elicitación y redacción inicial. `v0.1`, `v0.2`, etc. se crean libremente. No es una línea base. |
| `v1.0` | Primera versión aprobada | Sí — firma del cliente | El SRS se convierte en línea base controlada. Equivale a la "primera release mayor" de Sommerville. |
| `v1.x` | Cambios menores post-aprobación | Sí — aprobación del analista | Correcciones, aclaraciones o detalles que no alteran el alcance acordado. Equivale a "release menor". |
| `v2.0+` | Cambios mayores post-aprobación | Sí — aprobación gestor + firma cliente | Cambios que alteran el alcance, agregan requerimientos estructurales o redefinen objetivos. Nueva "release mayor". |

**Regla fundamental (del principio de línea base de Sommerville):**

> Una vez que un SRS alcanza el estado `v1.0 aprobado`, **ninguna versión aprobada puede ser editada directamente**. Todo cambio genera una nueva versión. La versión aprobada queda inmutable, trazable y reproducible — exactamente como Sommerville define una *baseline*: *"las versiones de los componentes que conforman el sistema no pueden ser cambiadas"* (p. 684).

---

### 8.3 Flujo de Aprobación de Cambios por Nivel de Impacto

Basado en el proceso de administración del cambio (§25.1, Fig. 25.3) y los criterios del CCB (pp. 687–688):

| Nivel de Impacto | Definición | Flujo de aprobación | Módulos donde aplica |
|---|---|---|---|
| **Cosmético** | Corrección de errores tipográficos, formato, ortografía | Directo — sin aprobación formal. El ejecutor registra el cambio en el historial de derivación. | M1, M2, M3 |
| **Menor** | Aclaración de datos, actualización de contactos secundarios, corrección de detalles sin impacto funcional | Aprobación del analista responsable del módulo. Estado: `pending` → `approved` → `done`. | M1 (nivel bajo/medio), M2 (estado draft), M3 (SRS en borrador) |
| **Mayor** | Nuevo requerimiento, cambio de estado de entidad, modificación de datos contractuales, cambio de alcance parcial | Aprobación del gestor del proyecto + notificación automática al cliente. Estado completo del CRF. | M1 (nivel alto/crítico), M2 (proyecto activo), M3 (SRS aprobado v1.x) |
| **Crítico** | Cambio de metodología, redefinición de alcance, cambio de NDA, nueva versión mayor del SRS | Aprobación del administrador del sistema + firma digital o confirmación explícita del cliente. Registro inmutable en el log de auditoría. | M1 (NDA, nivel crítico), M2 (metodología), M3 (SRS v2.0+) |

**Regla derivada de Sommerville (p. 688):**
> *"[Los cambios menores] deben transmitirse al equipo de desarrollo sin un análisis detallado, pues esto podría ser más costoso que implementar el cambio."*

Por lo tanto, los cambios cosméticos y menores **no requieren CCB** en el sistema. Solo los cambios mayores y críticos activan el flujo completo de aprobación.

---

## 9. Tabla de Conexiones con los 3 Módulos

| Concepto del Cap. 25 | Módulo | Campo o proceso específico en austranet-cco |
|---|---|---|
| Ítem de configuración (SCI) | M1 | Perfil de entidad, NDA, estado, nivel de riesgo |
| Ítem de configuración (SCI) | M2 | Perfil de proyecto, estado, registro de riesgos |
| Ítem de configuración (SCI) | M3 | Documento SRS, requerimientos individuales |
| Administración del cambio (Fig. 25.3) | M1 | Flujo de modificación de perfiles con aprobación CCB |
| Administración del cambio (Fig. 25.3) | M2 | Flujo de cambio de estado y configuración de proyectos |
| Administración del cambio (Fig. 25.3) | M3 | Flujo de modificación de SRS aprobados |
| Formato CRF (Fig. 25.4) | M1, M2, M3 | Entidad `ChangeRequest` en base de datos |
| CCB (p. 688) | M1 | Aprobador de cambios en entidades alto/crítico |
| CCB (p. 688) | M2 | Aprobador de cambios en proyectos activos |
| CCB (p. 688) | M3 | Aprobador de cambios en SRS aprobados |
| Versión (Fig. 25.2) | M1 | Versión numerada de cada perfil de entidad |
| Versión (Fig. 25.2) | M3 | v0.x, v1.0, v1.x, v2.0 del documento SRS |
| Línea base / Baseline (Fig. 25.2) | M3 | SRS en estado `aprobado` — no editable directamente |
| Release mayor/menor (§25.4) | M3 | vMAJOR.MINOR del SRS (v1.0 = release mayor aprobada) |
| Historial de derivación (Fig. 25.5) | M1 | Log de cambios del perfil de entidad |
| Historial de derivación (Fig. 25.5) | M3 | Registro de modificaciones del SRS por versión |
| Check-in / Check-out (Fig. 25.8) | M1, M2, M3 | Operaciones de edición con bloqueo optimista o pesimista |
| Integración continua (Fig. 25.12) | Infraestructura | Pipeline CI/CD de despliegue de austranet-cco |
| Contenido de entrega (§25.4) | M3 | PDF SRS + lista de requerimientos + stakeholders aprobadores |
| Sistema controlado (p. 683) | M1 | Perfil en estado `aprobado`: solo modificable via CRF + CCB |
| Sistema controlado (p. 683) | M3 | SRS en estado `aprobado`: solo modificable creando nueva versión |

---

## 10. Checklist de Completitud

> Todos los ítems solicitados en las instrucciones del documento han sido extraídos y documentados.

### Cap. 25 — Elementos extraídos

- [x] Definición formal de administración de la configuración (p. 682)
- [x] Propósito de la CM: metas y consecuencias de no tenerla (p. 682)
- [x] Definición de ítem de configuración (SCI) con tipos (Fig. 25.2, p. 684)
- [x] Terminología completa de CM: versión, línea base, línea de código, línea principal, release, branching, merging, construcción (Fig. 25.2, p. 684)
- [x] Las 4 actividades de la CM con definiciones exactas (p. 682, Fig. 25.1)
- [x] Proceso completo de administración del cambio con 7 etapas (Fig. 25.3, pp. 685–689)
- [x] Definición, propósito y responsabilidades del CCB (p. 688)
- [x] Criterios de decisión del CCB para aprobar/rechazar (pp. 687–688)
- [x] Cuándo el CCB no es obligatorio (p. 688)
- [x] Campos del Formato CRF con ejemplo real del libro (Fig. 25.4, pp. 686–688)
- [x] Historial de derivación de componentes (Fig. 25.5, p. 689)
- [x] Definición de gestión de versiones (p. 690)
- [x] Diferencia entre versión, línea base y release (Fig. 25.2, p. 684)
- [x] Operaciones: check-in, check-out, branching, merging (pp. 691–692, Fig. 25.8, 25.9)
- [x] Identificación de versiones: esquema de nomenclatura (p. 691)
- [x] Gestión de almacenamiento con deltas (Fig. 25.7, p. 691)
- [x] Definición de construcción del sistema (Fig. 25.2, p. 684)
- [x] Las 3 plataformas del proceso de construcción (Fig. 25.10, p. 694)
- [x] Herramientas de construcción: 7 capacidades (p. 695)
- [x] Integración continua: definición y pasos (Fig. 25.12, pp. 697–698)
- [x] Definición de release mayor vs. release menor (p. 699)
- [x] Contenido de una entrega de sistema (p. 700)
- [x] Factores que determinan el momento de una entrega (Fig. 25.13, p. 700)
- [x] Documentación requerida de una entrega (p. 700)
- [x] Relación de CM con ISO 9000, CMM y CMMI (p. 683)

### Secciones del documento

- [x] Sección 1 — Metadatos completos
- [x] Sección 2 — Objetivo: justificación legal y profesional de la CM
- [x] Sección 3 — Definición, SCIs y 4 actividades mapeadas al sistema
- [x] Sección 4 — Administración del cambio completa (proceso + CCB + CRF)
- [x] Sección 5 — Gestión de versiones (definiciones + operaciones + nomenclatura)
- [x] Sección 6 — Construcción del sistema (herramientas + CI + dependencias)
- [x] Sección 7 — Gestión de entregas (tipos + contenido + factores + documentación)
- [x] Sección 8 — **Política operativa** (SCIs + versionado SRS + flujos por impacto)
- [x] Sección 9 — Tabla de conexiones con los 3 módulos
- [x] Sección 10 — Checklist de completitud

---

*Documento generado con base exclusiva en: Ian Sommerville, Ingeniería de Software, 9.ª edición, Pearson, 2011, Capítulo 25 (pp. 681–703).*
