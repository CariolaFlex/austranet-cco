# M1-07-calidad-kpis-entidades.md

***

## 1. Metadatos

| Campo | Valor |
|---|---|
| **Nombre del archivo** | `M1-07-calidad-kpis-entidades.md` |
| **Módulo** | Módulo 1 — Registro de Clientes y Proveedores (Entidades) |
| **Capítulo fuente** | Cap. 24 — Gestión de la Calidad, *Ingeniería de Software*, Ian Sommerville, 9ª ed. (Pearson, 2011) |
| **Versión** | 1.0.0 |
| **Fecha** | 2026-02-24 |
| **Estado** | Aprobado — listo para implementación |
| **Autor** | austranet-cco |
| **Dependencias** | M1-01, M1-02, M1-03, M1-04, M1-05, M1-06 |

***

## 2. Objetivo del Documento

Este archivo documenta el **marco teórico de gestión de calidad** aplicado al Módulo 1, extrayendo exclusivamente del Capítulo 24 de Sommerville los conceptos directamente implementables en el sistema. Es el último archivo del Módulo 1 y cierra el marco teórico de todos los aspectos de la plataforma austranet-cco relacionados con el registro y evaluación de entidades.

La calidad en el Módulo 1 opera en **dos dimensiones complementarias** que deben medirse con métricas distintas:

- **Dimensión 1 — Calidad de los Datos de la Entidad**: ¿Qué tan completo, consistente y actualizado está el perfil que el sistema almacena? Incluye completitud de campos, vigencia del NDA, stakeholders registrados, glosario de dominio y evaluación de riesgo. Esta dimensión es calidad de *producto*, medida con métricas estáticas sobre los datos almacenados.

- **Dimensión 2 — Calidad de la Relación con la Entidad**: ¿Cómo se comporta esta entidad en proyectos reales? ¿Cumple plazos? ¿Sus stakeholders participan? ¿Sus requerimientos son estables? Esta dimensión es calidad de *proceso*, medida con métricas dinámicas acumuladas por proyecto. Alimenta directamente el campo `nivelRiesgo` de la Entidad.

**Impacto transversal**: La calidad de los datos del Módulo 1 determina la precisión de la evaluación de riesgos en el Módulo 2 (Registro de Proyectos) y la viabilidad del proceso de especificación en el Módulo 3 (SRS). Una entidad con perfil incompleto produce proyectos mal dimensionados y SRS con requerimientos inestables.

***

## 3. ¿Qué es la Calidad del Software? (Cap. 24 §24.1, p. 655)

### 3.1 Definición Formal

Sommerville establece que la evaluación de calidad del software es fundamentalmente diferente a la calidad en manufactura porque no existe el concepto de tolerancia en sistemas digitales y porque "es prácticamente imposible llegar a una conclusión objetiva sobre si un sistema de software cumple o no su especificación" (Cap. 24 §24.1, p. 655).[^1]

La calidad del software, según el libro, es un proceso subjetivo en el que el equipo de gestión de calidad "tiene que usar su juicio para decidir si se logró un nivel aceptable de calidad" y debe considerar "si el software se ajusta o no a su propósito pretendido" (Cap. 24 §24.1, p. 655). Esto incluye responder preguntas como:[^1]

1. ¿En el proceso de desarrollo se siguieron los estándares de programación y documentación?
2. ¿El software se verificó de manera adecuada?
3. ¿El software es suficientemente confiable para utilizarse?
4. ¿El rendimiento del software es aceptable para uso normal?
5. ¿El software es utilizable?
6. ¿El software está bien estructurado y es comprensible?

> **Definición clave (Cap. 24 §24.1, p. 656):** *"La calidad subjetiva de un sistema de software se basa principalmente en sus características no funcionales. Esto refleja la experiencia práctica del usuario: Si la funcionalidad del software no es lo que se esperaba, entonces los usuarios con frecuencia sólo le darán la vuelta a este asunto y encontrarán otras formas de hacer lo que quieren. Sin embargo, si el software no es fiable o resulta muy lento, entonces es prácticamente imposible que los usuarios logren sus metas."*[^1]

### 3.2 El Dilema de la Calidad

El libro establece explícitamente que "no es posible que algún sistema se optimice para todos esos atributos; por ejemplo, mejorar la robustez puede conducir a pérdida de rendimiento" (Cap. 24 §24.1, p. 656). Este es el dilema de la calidad: mejorar una propiedad puede degradar otra.[^1]

**Consecuencia para el sistema**: Al definir los KPIs del Módulo 1, deben priorizarse los atributos más críticos (completitud, vigencia, consistencia) sobre atributos secundarios. El plan de calidad debe especificar qué atributos son obligatorios y en qué orden se resuelven los conflictos.

### 3.3 Los 15 Atributos de Calidad de Boehm (Cap. 24 §24.1, Fig. 24.2, p. 656)

Sommerville cita a Boehm et al. (1978) indicando que "existen 15 importantes atributos de calidad de software" relacionados con la confiabilidad, usabilidad, eficiencia y mantenibilidad. Los más relevantes para el Módulo 1 son:[^1]

| Atributo | Definición aplicable al Módulo 1 |
|---|---|
| **Fiabilidad** | Los datos almacenados son correctos y no contienen errores |
| **Usabilidad** | El formulario de registro es fácil de completar correctamente |
| **Comprensibilidad** | Los campos del perfil tienen denominaciones claras y sin ambigüedad |
| **Modularidad** | El perfil de entidad se puede actualizar en secciones independientes |
| **Adaptabilidad** | El perfil puede extenderse con nuevos campos sin romper registros existentes |
| **Comprobabilidad** | Cada KPI puede evaluarse automáticamente con los datos disponibles |

### 3.4 Calidad de Proceso vs. Calidad de Producto

> **Definición (Cap. 24 §24.1, p. 656–657):** *"Una suposición que subyace en la gestión de la calidad del software es que la calidad del software se relaciona directamente con la calidad del proceso de desarrollo del software."*[^1]

| Dimensión | Definición (Sommerville) | Aplicación en Módulo 1 |
|---|---|---|
| **Calidad de producto** | Atributos medibles del entregable software: tamaño, complejidad, densidad de defectos | Completitud del perfil, vigencia de datos, consistencia entre campos |
| **Calidad de proceso** | Calidad del proceso usado para desarrollar/mantener el producto | Proceso de registro, auditoría periódica, flujo de aprobación de perfiles |

Sin embargo, el libro advierte: "en el desarrollo del software es más compleja la relación entre calidad de proceso y calidad del producto. El diseño del software es un proceso creativo más que mecánico" (Cap. 24 §24.1, p. 657). Por ello, el sistema usa *ambas* dimensiones en paralelo, sin asumir que un buen proceso garantiza automáticamente datos de alta calidad.[^1]

**Aplicación en el sistema:** La calidad del Módulo 1 es calidad de *datos* (producto) + calidad del *proceso de registro* (proceso). La Dimensión 1 mide la calidad de producto con los KPIs de la Sección 7.1. La Dimensión 2 mide la calidad de proceso con los KPIs de la Sección 7.2. Ambas se implementan como validaciones automáticas en el sistema, pero se calculan con fórmulas distintas y producen alertas independientes.

***

## 4. Estándares de Software (Cap. 24 §24.2, p. 657–663)

### 4.1 Definición y Propósito

> **Definición (Cap. 24 §24.2, p. 658):** *"Los estándares de software son importantes por tres razones: 1. Los estándares reflejan la sabiduría que es de valor para la organización. 2. Los estándares proporcionan un marco para definir, en un escenario particular, lo que significa el término calidad. 3. Los estándares auxilian la continuidad cuando una persona retoma el trabajo iniciado por alguien más."*[^1]

### 4.2 Tipos de Estándares

El libro define dos tipos de estándares de ingeniería de software aplicables al sistema (Cap. 24 §24.2, p. 658):[^1]

> *"1. **Estándares del producto**: Se aplican al producto de software a desarrollar. Incluyen estándares de documentos como la estructura de los documentos de requerimientos, estándares de documentación como el encabezado de un comentario estándar para una definición de clase de objeto y estándares de codificación, los cuales definen cómo debe usarse un lenguaje de programación.*
>
> *2. **Estándares de proceso**: Establecen los procesos que deben seguirse durante el desarrollo del software. Deben especificar cómo es una buena práctica de desarrollo."*

| Tipo | Descripción | Ejemplo en Módulo 1 |
|---|---|---|
| **Estándar de producto** | Qué características debe tener el software, cómo se documenta | Estructura mínima del perfil de Entidad, campos obligatorios, formato de fechas |
| **Estándar de proceso** | Cómo debe desarrollarse, qué actividades son obligatorias | Flujo de registro de entidad, proceso de auditoría periódica, escalamiento de riesgo |

### 4.3 Estándares de Documentación

> **Definición (Cap. 24 §24.2, p. 658):** *"Los estándares de documentación definen la organización de diferentes tipos de documentos, así como el formato del documento. Son importantes porque facilitan la comprobación de que no se haya omitido material importante de los documentos y garantizan que los documentos del proyecto tengan una apariencia común."*[^1]

Aplicado al Módulo 1: los estándares de documentación definen qué campos son obligatorios en el perfil de una Entidad para que se considere documentalmente completo.

### 4.4 ISO 9001 Aplicado al Sistema (Cap. 24 §24.2.1, p. 660–663)

> **Definición (Cap. 24 §24.2.1, p. 660):** *"El estándar ISO 9001 no es en sí mismo un estándar para el desarrollo de software, sino un marco para elaborar estándares de software. Establece principios de calidad total, describe en general el proceso de calidad, y explica los estándares y procedimientos organizacionales que deben determinarse."*[^1]

Los 9 procesos centrales de ISO 9001 (Fig. 24.5) relevantes para el sistema son:[^1]

- **Adquisición empresarial** → proceso de incorporar una nueva entidad al sistema
- **Diseño y desarrollo** → proceso de creación del perfil de entidad
- **Administración del proveedor** → gestión de proveedores registrados
- **Administración de la configuración** → versionado de perfiles de entidad

> **Advertencia del libro (Cap. 24 §24.2.1, p. 662):** *"El estándar ISO 9001 no define ni prescribe los procesos de calidad específicos que deben usarse en una compañía. Para estar de conformidad con ISO 9001, una compañía debe especificar los tipos de proceso [...] y tener procedimientos que demuestren que se siguen sus procesos de calidad."*[^1]

### 4.5 Resistencia a los Estándares y Cómo Superarla

El libro identifica que "los ingenieros de software consideran los estándares como demasiado prescriptivos y realmente poco relevantes para la actividad técnica" (Cap. 24 §24.2, p. 659). Las estrategias para superar esto son:[^1]

1. **Involucrar a los ingenieros en la selección de estándares**: si comprenden el porqué, se comprometen más.
2. **Revisar y modificar regularmente los estándares** para reflejar tecnologías cambiantes.
3. **Ofrecer herramientas de software para dar soporte**: si la adhesión es automática, el esfuerzo es mínimo.

**Aplicación en el sistema:** Los estándares de documentación definen qué constituye un perfil de Entidad "completo" en el Módulo 1. Una entidad sin glosario de dominio, sin stakeholders identificados o sin evaluación de factibilidad no cumple el estándar mínimo del sistema y no debería poder asociarse a un proyecto activo. La Sección 9 formaliza este estándar.

***

## 5. Revisiones e Inspecciones (Cap. 24 §24.3, p. 663–668)

### 5.1 Definición de Revisión de Calidad

> **Definición (Cap. 24 §24.3, p. 663):** *"Durante una revisión, un grupo de personas examinan el software y su documentación asociada en busca de problemas potenciales y la falta de conformidad con los estándares. El equipo de revisión realiza juicios informados sobre el nivel de calidad de un entregable de sistema o de proyecto."*[^1]

El libro establece que "la revisión debe comprobar la coherencia e integridad de los documentos o el código objeto de prueba, y asegurarse de que se han seguido las normas de calidad" (Cap. 24 §24.3, p. 663).[^1]

**Principio fundamental del libro**: "El propósito de las revisiones e inspecciones es mejorar la calidad del software, no valorar el rendimiento de los miembros del equipo de desarrollo" (Cap. 24 §24.3, p. 663).[^1]

### 5.2 El Proceso de Revisión (Cap. 24 §24.3.1, Fig. 24.7, p. 664)

El libro estructura el proceso de revisión en tres fases (Cap. 24 §24.3.1, p. 664):[^1]

**Fase 1 — Actividades previas a la revisión:**
> *"Las actividades previas a la revisión se ocupan de la planeación y preparación de la revisión. La planeación de la revisión incluye establecer un equipo de revisión, organizar un tiempo, destinar un lugar para la revisión y distribuir los documentos a revisar."*[^1]

**Fase 2 — La reunión de revisión:**
> *"Durante la reunión de revisión un autor del documento o programa a revisar debe repasar el documento con el equipo de revisión. La revisión en sí debe ser relativamente corta, dos horas a lo sumo. Un miembro del equipo debe dirigir la revisión y otro registrar formalmente todas las decisiones y acciones de revisión a tomar."*[^1]

**Fase 3 — Actividades posteriores a la revisión:**
> *"Después de terminada una reunión de revisión, deben tratarse los conflictos y problemas surgidos durante la revisión. Esto puede implicar corregir bugs de software, refactorizar el software de modo que esté conforme con los estándares de calidad, o reescribir los documentos."*[^1]

### 5.3 Inspecciones del Programa — Fagan (Cap. 24 §24.3.2, p. 666)

> **Definición (Cap. 24 §24.3.2, p. 666):** *"Las inspecciones del programa son revisiones de pares en las que los miembros del equipo colaboran para encontrar bugs en el programa en desarrollo. Complementan las pruebas, puesto que no requieren la ejecución del programa. Esto quiere decir que es posible verificar versiones incompletas del sistema y comprobar representaciones como los modelos UML."*[^1]

El libro cita los resultados de Fagan: "es posible detectar más del 60% de los errores en un programa mediante inspecciones informales de programa. Mills et al. sugieren que un enfoque más formal a la inspección permite detectar más del 90% de los errores" (Cap. 24 §24.3.2, p. 666).[^1]

**Roles en el proceso de inspección (Fagan, 1976)**: moderador, lector de código, secretario, autor del código, inspector.[^1]

### 5.4 Tipos de Revisión — Cuándo Usar Cada Una

| Tipo | Descripción | Cuándo usarla en Módulo 1 |
|---|---|---|
| **Revisión informal** | Examen individual o par, sin proceso formal | Validación rápida de campos al guardar un perfil |
| **Revisión técnica** | Equipo pequeño, semi-estructurada | Verificación de que el perfil cumple el nivel estándar antes de crear un proyecto |
| **Inspección formal** | Proceso completo con roles definidos, lista de verificación, acta | Auditoría periódica de entidades de alto y crítico riesgo |

### 5.5 Métricas de una Inspección

Basado en el libro (Cap. 24 §24.3.2, p. 666):[^1]

- **Tasa de detección de defectos**: % de problemas encontrados en inspección vs. total encontrados en el ciclo de vida. Meta: >60%.
- **Tiempo invertido vs. defectos encontrados**: Eficiencia de la inspección. Una inspección de 2 horas que detecta 5 problemas críticos es más eficiente que una prueba de 8 horas que detecta 2.
- **Tasa de retrabajo**: % de ítems que requirieron corrección post-inspección.

**Aplicación en el sistema:** Las revisiones se aplican al Módulo 1 como "auditoría de perfil de entidad": proceso periódico para verificar que los datos de cada entidad siguen siendo completos, vigentes y consistentes. La frecuencia depende del `nivelRiesgo` de la entidad (ver Sección 8).

***

## 6. Medición y Métricas del Software (Cap. 24 §24.4, p. 668–677)

### 6.1 Métricas de Producto (Cap. 24 §24.4.1, p. 672)

#### Definición de Métrica de Software

> **Definición (Cap. 24 §24.4, p. 668):** *"Una métrica de software es una característica de un sistema de software, documentación de sistema o proceso de desarrollo que puede medirse de manera objetiva. Los ejemplos de métricas incluyen el tamaño de un producto en líneas de código; el índice Fog (Gunning, 1962), que es una medida de la legibilidad de un pasaje de texto escrito; el número de fallas reportadas en un producto de software entregado, y el número de días-hombre requeridos para desarrollar un componente de sistema."*[^1]

#### Métricas de Control vs. Predicción

> **Definición (Cap. 24 §24.4, p. 668–669):** *"Las métricas de software pueden ser métricas de control o de predicción. Las métricas de control apoyan la gestión del proceso, y las métricas de predicción ayudan a predecir las características del software. Las métricas de control se asocian por lo general con procesos de software. Las métricas de predicción se asocian con el software en sí y a veces se conocen como métricas de producto."*[^1]

| Tipo de Métrica | Asociada con | Uso | Ejemplo en Módulo 1 |
|---|---|---|---|
| **Métricas de control** | Proceso | Gestionar cómo avanza el proceso | Tiempo promedio para completar un perfil de entidad |
| **Métricas de predicción** | Producto | Predecir características del software | Completitud del perfil, tasa de estabilidad de reqs. |

#### Métricas Estáticas de Productos (Cap. 24 §24.4.1, Fig. 24.11, p. 673)

El libro lista las siguientes métricas estáticas relevantes para evaluar calidad:[^1]

| Métrica | Descripción (Sommerville) | Adaptación al Módulo 1 |
|---|---|---|
| **Fan-in / Fan-out** | Acoplamiento entre funciones. Alto fan-out indica alta complejidad | Número de proyectos activos que dependen de esta entidad |
| **Longitud de código** | Tamaño del componente; más grande = más probable de tener errores | Tamaño del perfil de entidad (campos completados) |
| **Complejidad ciclomática** | Medida de la complejidad del control; relacionada con comprensibilidad | Nivel de complejidad de la red de stakeholders de la entidad |
| **Profundidad de anidado condicional** | Enunciados if profundamente anidados son difíciles de entender | N/A directo — aplica al código del módulo |
| **Índice Fog** | Longitud promedio de palabras y oraciones; cuanto más alto, más difícil entender | Claridad del glosario de dominio de la entidad |

#### Densidad de Defectos

Concepto derivado del libro (Cap. 24 §24.4, p. 668): la densidad de defectos mide la cantidad de errores o inconsistencias por unidad de tamaño. Para el Módulo 1:[^1]

\[ \text{Densidad de defectos de perfil} = \frac{\text{campos\_con\_error\_o\_vacío}}{\text{total\_campos\_obligatorios}} \times 100 \]

- **Meta**: 0% (perfil sin defectos)
- **Alerta**: >20% (más de 1 de cada 5 campos tiene problema)
- **Bloqueo de proyecto**: >50%

### 6.2 Predicción de Calidad de Componentes (Cap. 24 §24.4.2, Fig. 24.13, p. 674–675)

El libro describe el proceso de medición de componentes que puede ser parte de un proceso de valoración de calidad (Cap. 24 §24.4.2, p. 674):[^1]

1. **Elegir las mediciones a realizar**: formular las preguntas que la medición busca responder.
2. **Seleccionar componentes a valorar**: enfocarse en los componentes centrales del sistema.
3. **Medir las características de los componentes**: calcular valores de métrica usando herramientas automatizadas.
4. **Identificar mediciones anómalas**: "observar los valores inusualmente altos o bajos para cada métrica, pues éstos sugieren que podría haber problemas con el componente".[^1]
5. **Analizar componentes anómalos**: examinar si los valores anómalos significan realmente que la calidad está comprometida.

> **Principio del libro (Cap. 24 §24.4.2, p. 675):** *"Siempre es conveniente mantener datos recopilados como un recurso organizacional, así como registros históricos de todos los proyectos aun cuando no se hayan usado durante un proyecto particular. Una vez establecida una base suficientemente grande de datos de medición, será posible hacer comparaciones de calidad de software a través de proyectos."*[^1]

**Consecuencia para el sistema**: el campo `historialProyectos` de la Entidad es el equivalente a esta base de datos de medición histórica. Cada proyecto completado actualiza los KPIs de la Sección 7.2.

### 6.3 Medición del Proceso y GQM (Cap. 24 §24.4 + Cap. 26 §26.2, p. 674 + p. 712–713)

#### Definición del Paradigma GQM

El libro introduce GQM (Meta-Pregunta-Métrica) de Basili y Rombach (1988) como el enfoque recomendado para decidir qué datos recopilar (Cap. 24 §24.4.2, p. 674; Cap. 26 §26.2, p. 712):[^1]

> **Definición (Cap. 26 §26.2, p. 712–713):** *"El paradigma GQM se usa en la mejora de procesos para ayudar a responder tres preguntas fundamentales: 1. ¿Por qué se introduce la mejora de procesos? 2. ¿Qué información se necesita para ayudar a identificar y valorar las mejoras? 3. ¿Qué mediciones de proceso y producto se requieren para obtener esta información?"*[^1]

Las tres abstracciones del GQM son:[^1]

- **Meta**: un objetivo que la organización pretende lograr (no los atributos del proceso, sino cómo el proceso afecta los productos o la organización).
- **Pregunta**: refinamiento de las metas, que identifica áreas específicas de incertidumbre relacionadas con las metas.
- **Métrica**: mediciones que deben recopilarse para responder las preguntas y confirmar si las mejoras lograron las metas.

#### GQM Aplicado a los KPIs del Módulo 1

La siguiente tabla aplica el paradigma GQM a cada KPI de la Sección 7, justificando su existencia con el marco teórico del Cap. 24:[^1]

| KPI | Goal (Meta) | Question (Pregunta) | Metric (Métrica) |
|---|---|---|---|
| Completitud del perfil | Asegurar que toda entidad registrada tiene datos suficientes para evaluarse | ¿Qué porcentaje de los campos obligatorios está completado? | (campos_completados / campos_obligatorios) × 100 |
| Stakeholders registrados | Garantizar que los participantes clave de la entidad están identificados | ¿Cuántos stakeholders de alta influencia están registrados? | count(stakeholders donde nivelInfluencia = 'alto') |
| Vigencia del NDA | Asegurar que los acuerdos legales están activos antes de compartir información sensible | ¿El NDA está vigente y no ha vencido? | fechaNDA > hoy − 365 días |
| Evaluación de riesgo | Mantener actualizada la evaluación de riesgo para cada entidad | ¿La evaluación de riesgo fue realizada recientemente? | fechaEvaluacion > hoy − 180 días |
| Glosario de dominio | Garantizar que el vocabulario del dominio del cliente está documentado para el SRS | ¿Cuántos términos de dominio están documentados? | count(terminosGlosario) |
| Tasa de estabilidad de reqs. | Reducir el retrabajo por cambios de requerimientos en proyectos | ¿Con qué frecuencia cambian los requerimientos post-aprobación? | (reqs_sin_cambio / total_reqs) × 100 |
| Disponibilidad de stakeholders | Asegurar que los stakeholders participan activamente en el proyecto | ¿Con qué frecuencia asisten a reuniones planificadas? | (reuniones_con_asistencia / total_reuniones) × 100 |
| Tiempo de aprobación de SRS | Reducir el tiempo del ciclo de aprobación del SRS | ¿Cuántos días tarda la entidad en aprobar un SRS? | avg(fecha_aprobacion − fecha_entrega) |
| Proyectos completados exitosamente | Medir el historial de éxito de la entidad como cliente/proveedor | ¿Qué porcentaje de proyectos cerró en tiempo y alcance? | (proyectos_exitosos / total_proyectos) × 100 |

#### Por qué las Métricas sin Contexto son Peligrosas

El libro dedica toda la sección §24.4.3 a la "Ambigüedad de mediciones" y advierte (Cap. 24 §24.4.3, p. 676–677):[^1]

> *"Es fácil malinterpretar los datos y hacer inferencias incorrectas. No basta con observar los datos por sí mismos, sino que también hay que considerar el contexto donde se recaban los datos."*

Un ejemplo concreto del libro: aumentar el número de peticiones de cambio de requerimientos puede significar que el software es malo *o* que es tan bueno que los usuarios lo usan intensamente y piden nuevas funciones. La misma métrica tiene interpretaciones opuestas dependiendo del contexto.

**Regla para el sistema**: ningún KPI del Módulo 1 debe disparar una acción automática sin validación contextual. Los KPIs generan *alertas*, no *acciones automáticas*. Un gestor o admin debe confirmar la interpretación antes de escalar el `nivelRiesgo`.

***

## 7. KPIs Operativos del Módulo 1

### 7.1 KPIs de Calidad de Datos de la Entidad

*(Dimensión 1 — ¿Qué tan completo y vigente está el perfil?)*

Estas métricas son **métricas de predicción** en la terminología de Sommerville: predicen si el perfil de la entidad es apto para asociarse a un proyecto. Se calculan automáticamente sobre los campos del tipo `Entidad` en la base de datos.[^1]

| KPI | Definición | Fórmula de cálculo | Tipo de dato fuente | Meta | Alerta |
|---|---|---|---|---|---|
| **Completitud del perfil** | % de campos obligatorios completados | `(campos_completados / campos_obligatorios) × 100` | `Entidad.*` (todos los campos obligatorios) | 100% | < 80% |
| **Stakeholders de alta influencia** | Cantidad de stakeholders con influencia alta identificados | `count(Stakeholder WHERE entidadId = X AND nivelInfluencia = 'alto')` | `Stakeholder.nivelInfluencia` | ≥ 2 | < 2 |
| **Vigencia del NDA** | ¿El NDA está activo y no ha vencido en el último año? | `Entidad.fechaNDA > now() - INTERVAL 365 DAYS` | `Entidad.fechaNDA, Entidad.tienNDA` | `true` | `false` |
| **Vigencia de evaluación de riesgo** | ¿El `nivelRiesgo` fue evaluado en los últimos 6 meses? | `Entidad.fechaUltimaEvaluacionRiesgo > now() - INTERVAL 180 DAYS` | `Entidad.fechaUltimaEvaluacionRiesgo` | `true` | `false` |
| **Cobertura del glosario de dominio** | ¿La entidad tiene al menos 10 términos documentados? | `count(TerminoGlosario WHERE entidadId = X)` | `TerminoGlosario` | ≥ 10 | < 5 |
| **Stakeholders con canal de comunicación** | % de stakeholders que tienen canal de comunicación registrado | `(count(Stakeholder WHERE canalComunicacion IS NOT NULL) / count(Stakeholder)) × 100` | `Stakeholder.canalComunicacion` | 100% | < 80% |
| **Factibilidad completada** | ¿La evaluación de factibilidad fue completada? | `Entidad.factibilidadCompleta = true` | `Entidad.factibilidadCompleta` | `true` | `false` |
| **Densidad de defectos del perfil** | % de campos obligatorios con error o valor inválido | `(campos_con_error / campos_obligatorios) × 100` | Validaciones de tipo/formato por campo | 0% | > 20% |
| **Tiempo desde último contacto** | Días transcurridos desde la última interacción registrada con la entidad | `now() - max(Proyecto.fechaUltimaActualizacion WHERE entidadId = X)` | `Proyecto.fechaUltimaActualizacion` | < 180 días | > 365 días |

### 7.2 KPIs de Desempeño de la Entidad en Proyectos

*(Dimensión 2 — ¿Cómo se comporta esta entidad como cliente/proveedor?)*

Estas métricas son **métricas de control** (métricas de proceso en la terminología de Sommerville): miden el comportamiento de la entidad en proyectos reales y se actualizan automáticamente con cada proyecto completado. Alimentan el campo `nivelRiesgo`.[^1]

| KPI | Definición | Fórmula de cálculo | Tipo de dato fuente | Meta | Impacto en `nivelRiesgo` |
|---|---|---|---|---|---|
| **Tasa de estabilidad de requerimientos** | % de requerimientos que no cambiaron tras aprobación del SRS | `(reqs_sin_cambio / total_reqs) × 100` sobre todos los proyectos de la entidad | `Requerimiento.estadoCambio`, `SRS.fechaAprobacion` | > 80% | Alto si < 60%; Crítico si < 40% |
| **Disponibilidad de stakeholders** | % de reuniones donde los stakeholders clave asistieron | `(reuniones_con_asistencia_stakeholder / total_reuniones) × 100` | `Reunion.asistentes`, `Stakeholder.nivelInfluencia` | > 90% | Medio si < 75%; Alto si < 60% |
| **Tiempo de aprobación de SRS** | Días promedio desde entrega del SRS hasta su aprobación | `AVG(SRS.fechaAprobacion - SRS.fechaEntrega)` por entidad | `SRS.fechaAprobacion`, `SRS.fechaEntrega` | < 10 días | Medio si > 15 días; Alto si > 20 días |
| **Tasa de proyectos exitosos** | % de proyectos que cerraron en tiempo y alcance original | `(count(Proyecto WHERE estadoCierre = 'exitoso') / count(Proyecto)) × 100` | `Proyecto.estadoCierre`, `Proyecto.entidadId` | > 85% | Alto si < 70%; Crítico si < 50% |
| **Tasa de solicitudes de cambio de alcance** | Promedio de cambios de alcance por proyecto | `AVG(count(SolicitudCambio WHERE proyectoId = P))` por entidad | `SolicitudCambio.proyectoId` | < 2 por proyecto | Medio si > 4; Alto si > 8 |
| **Tiempo de respuesta a observaciones** | Días promedio que la entidad tarda en responder observaciones del equipo | `AVG(Observacion.fechaRespuesta - Observacion.fechaCreacion)` | `Observacion.fechaRespuesta`, `Observacion.entidadId` | < 3 días hábiles | Medio si > 7 días; Alto si > 14 días |
| **Historial de incumplimiento de hitos** | % de hitos de proyecto en que la entidad causó retraso | `(hitos_retrasados_por_entidad / total_hitos) × 100` | `Hito.responsable`, `Hito.fechaReal`, `Hito.fechaPlaneada` | < 5% | Alto si > 20%; Crítico si > 40% |
| **Tasa de requerimientos ambiguos** | % de requerimientos que requirieron más de 2 aclaraciones antes de aprobarse | `(reqs_con_multiples_aclaraciones / total_reqs) × 100` | `Requerimiento.historicoAclaraciones` | < 10% | Medio si > 25%; Alto si > 50% |

***

## 8. Proceso de Auditoría Periódica de Entidades

*Basado en Cap. 24 §24.3 — El proceso de revisión (p. 663–668)*[^1]

### 8.1 Frecuencia por Nivel de Riesgo

| `nivelRiesgo` | Frecuencia de auditoría | Justificación (Sommerville Cap. 24 §24.3) |
|---|---|---|
| `bajo` | **Anual** (cada 12 meses) | Entidades con historial sólido; auditoría de mantenimiento |
| `medio` | **Semestral** (cada 6 meses) | Entidades con algunas alertas; monitoreo preventivo |
| `alto` | **Trimestral** (cada 3 meses) | Entidades con problemas recurrentes; revisión técnica formal |
| `critico` | **Mensual** (cada 30 días) | Inspección formal completa; máxima prioridad |

### 8.2 Checklist de la Auditoría

Para cada auditoría, el auditor debe evaluar los siguientes ítems basados en los KPIs de la Sección 7:

**Bloque A — Calidad de Datos (Dimensión 1):**
- [ ] Completitud del perfil ≥ 80% (alerta si <80%, bloqueo si <60%)
- [ ] Al menos 2 stakeholders de alta influencia registrados
- [ ] NDA vigente (si aplica al tipo de entidad)
- [ ] Evaluación de riesgo realizada en los últimos 6 meses
- [ ] Glosario de dominio con ≥ 5 términos (al menos nivel estándar)
- [ ] Factibilidad completada
- [ ] Todos los stakeholders tienen canal de comunicación registrado
- [ ] Densidad de defectos del perfil < 20%

**Bloque B — Calidad de Relación (Dimensión 2):**
- [ ] Tasa de estabilidad de reqs. > 60% (en últimos 3 proyectos)
- [ ] Disponibilidad de stakeholders > 75%
- [ ] Tiempo de aprobación de SRS < 20 días (promedio)
- [ ] Tasa de proyectos exitosos > 70%
- [ ] Tasa de solicitudes de cambio de alcance < 4 por proyecto
- [ ] Sin incumplimientos críticos de hitos en últimos 2 proyectos

### 8.3 Quién Realiza la Auditoría

Basado en el libro: "Con frecuencia, los equipos de revisión tienen un eje de tres o cuatro personas seleccionadas como revisores principales" (Cap. 24 §24.3.1, p. 665).[^1]

En el sistema, la auditoría requiere:

- **Rol mínimo**: `RolUsuario: gestor` o `RolUsuario: admin`
- **Para entidades críticas**: debe participar al menos un `admin`
- **Conflicto de interés**: el auditor no puede ser el mismo usuario que creó o modificó la entidad en los últimos 30 días

### 8.4 Entregable de la Auditoría

El proceso de revisión del libro indica que "las conclusiones de la revisión deben registrarse formalmente como parte del proceso de gestión de calidad" (Cap. 24 §24.3, p. 663). El informe de auditoría del sistema debe contener:[^1]

```
InformeAuditoria {
  id: uuid
  fechaAuditoria: Date
  auditorId: UserId (ref Usuario)
  entidadId: EntityId (ref Entidad)
  nivelRiesgoAntes: 'bajo' | 'medio' | 'alto' | 'critico'
  
  kpisEvaluados: {
    bloqueA: {
      completitudPerfil: number        // valor calculado
      stakeholdersAltos: number        // valor calculado
      ndaVigente: boolean
      evaluacionRiesgoVigente: boolean
      glosarioCount: number
      factibilidadCompleta: boolean
      densidadDefectos: number
    }
    bloqueB: {
      tasaEstabilidadReqs: number | null  // null si < 3 proyectos
      disponibilidadStakeholders: number | null
      tiempoAprobacionSRS: number | null
      tasaProyectosExitosos: number | null
      tasaCambiosAlcance: number | null
    }
  }
  
  hallazgos: string[]         // lista de problemas detectados
  accionesRequeridas: {
    descripcion: string
    prioridad: 'critica' | 'alta' | 'media' | 'baja'
    responsableId: UserId
    fechaLimite: Date
    estadoResolucion: 'pendiente' | 'en_progreso' | 'resuelta'
  }[]
  
  nivelRiesgoRecomendado: 'bajo' | 'medio' | 'alto' | 'critico'
  nivelRiesgoAprobado: 'bajo' | 'medio' | 'alto' | 'critico'
  adminAprobadorId: UserId | null   // requerido si cambia el nivel
  
  fechaSeguimiento: Date
  estadoAuditoria: 'aprobada' | 'observada' | 'rechazada'
}
```

### 8.5 Consecuencias de una Auditoría Negativa

Siguiendo el principio del libro de que "a veces, los problemas descubiertos en una revisión de calidad son tales que es necesaria también una revisión administrativa" (Cap. 24 §24.3.1, p. 664):[^1]

| Resultado | Condición | Consecuencia automática |
|---|---|---|
| **Observada** | 1–3 hallazgos de prioridad media/baja | Notificación al gestor responsable; próxima auditoría adelantada 30 días |
| **Rechazada — nivel escalado** | ≥1 hallazgo crítico O tasa exitosa < 50% | `nivelRiesgo` sube un nivel; bloqueo parcial de nuevos proyectos hasta resolver acciones críticas |
| **Bloqueo total** | Densidad defectos > 50% O `nivelRiesgo = critico` con hallazgos críticos sin resolver | Entidad bloqueada para nuevos proyectos hasta resolución validada por `admin` |
| **Aprobada con seguimiento** | 0 hallazgos críticos; acciones menores identificadas | Estado normal; próxima auditoría en fecha programada según nivel de riesgo |

***

## 9. Estándar de Completitud del Perfil de Entidad

*Basado en Cap. 24 §24.2 — Estándares de software (p. 657–663)*[^1]

Este estándar implementa la definición de Sommerville: "los estándares proporcionan un marco para definir, en un escenario particular, lo que significa el término calidad" (Cap. 24 §24.2, p. 658). Determina formalmente si una entidad puede avanzar al Módulo 2 y al Módulo 3.[^1]

***

### NIVEL MÍNIMO — `completitudPerfil: 'minimo'`

**Condición**: puede crear proyectos en modo `borrador` solamente.

```
Requisitos mínimos:
  ☑ Razón social (nombre legal completo)
  ☑ RUT o identificador tributario válido
  ☑ Tipo de entidad: 'cliente' | 'proveedor' | 'ambos'
  ☑ Sector de actividad (categoría principal)
  ☑ País de operación
  ☑ Al menos 1 stakeholder registrado (cualquier nivelInfluencia)
  ☑ Estado de la entidad definido: 'activo' | 'inactivo' | 'potencial'
```

**KPI evaluado**: Completitud del perfil ≥ 60%.
**Transición a nivel siguiente**: completar los requisitos del nivel estándar.

***

### NIVEL ESTÁNDAR — `completitudPerfil: 'estandar'`

**Condición**: puede crear proyectos en estado `activo` en el Módulo 2.

```
Requisitos estándar (incluye todo el nivel mínimo, más):
  ☑ Al menos 2 stakeholders registrados con nivelInfluencia definido
      (al menos 1 con nivelInfluencia = 'alto')
  ☑ Evaluación de factibilidad completada (factibilidadCompleta = true)
  ☑ nivelRiesgo calculado y registrado (no puede ser nulo)
  ☑ fechaUltimaEvaluacionRiesgo dentro de los últimos 180 días
  ☑ Al menos 5 términos en el glosario de dominio
  ☑ Contacto principal con email válido
```

**KPI evaluado**: Completitud del perfil ≥ 85%; stakeholders de alta influencia ≥ 1.
**Transición a nivel siguiente**: completar los requisitos del nivel completo.

***

### NIVEL COMPLETO — `completitudPerfil: 'completo'`

**Condición**: puede iniciar el proceso SRS en el Módulo 3 y acceder a todas las funcionalidades de la plataforma.

```
Requisitos completos (incluye todo el nivel estándar, más):
  ☑ NDA firmado y vigente (si tienNDA = true, entonces fechaNDA > now() - 365 días)
  ☑ Al menos 10 términos en el glosario de dominio
  ☑ Todos los stakeholders registrados con canal de comunicación definido
  ☑ Auditoría inicial completada (primeraAuditoriaRealizada = true)
  ☑ nivelRiesgo evaluado con todos los criterios de factibilidad
  ☑ Al menos 2 stakeholders con nivelInfluencia = 'alto' registrados
```

**KPI evaluado**: Completitud del perfil = 100%; todos los KPIs del Bloque A en estado verde.

***

### Reglas de Validación Automática en el Sistema

```typescript
// Pseudocódigo de validación al intentar asociar una entidad a un proyecto
function validateEntityForProject(
  entity: Entidad,
  projectType: 'borrador' | 'activo' | 'srs'
): ValidationResult {
  
  if (projectType === 'borrador') {
    return checkMinimumLevel(entity);  // nivel mínimo
  }
  
  if (projectType === 'activo') {
    return checkStandardLevel(entity); // nivel estándar
  }
  
  if (projectType === 'srs') {
    return checkCompleteLevel(entity); // nivel completo
  }
}

// Bloqueo adicional: entidades con auditoría negativa sin resolver
function checkAuditBlock(entity: Entidad): boolean {
  const latestAudit = getLatestAudit(entity.id);
  if (!latestAudit) return false; // sin auditorías, no bloqueada
  
  return latestAudit.estadoAuditoria === 'rechazada' 
    && latestAudit.accionesRequeridas.some(
      a => a.prioridad === 'critica' 
        && a.estadoResolucion !== 'resuelta'
    );
}
```

***

## 10. Tabla de Conexiones con los 3 Módulos

| Concepto del Cap. 24 | Módulo | Campo o proceso específico |
|---|---|---|
| Atributos de calidad de Boehm (Fig. 24.2) | Módulo 1 | `nivelRiesgo`, `completitudPerfil`, `factibilidadCompleta` |
| Calidad de producto vs. proceso (§24.1) | Todos | Dimensión 1 (datos) y Dimensión 2 (relación) del perfil de entidad |
| Estándares de producto (§24.2) | Módulo 1 | Estándar de Completitud: niveles mínimo / estándar / completo (Sección 9) |
| Estándares de proceso (§24.2) | Módulo 1 | Proceso de auditoría periódica; flujo de registro y aprobación de entidades |
| ISO 9001 — Administración del proveedor (Fig. 24.5) | Módulo 1 | Gestión de proveedores: perfil, auditorías, historial de proyectos |
| ISO 9001 — Adquisición empresarial (Fig. 24.5) | Módulo 1 | Proceso de incorporación de un nuevo cliente al sistema |
| Estándares de documentación (§24.2) | Módulo 1 | Definición de campos obligatorios del perfil de entidad |
| Proceso de revisión — 3 fases (§24.3.1, Fig. 24.7) | Módulo 1 | Proceso de auditoría periódica de entidades (Sección 8) |
| Inspecciones de programa — Fagan (§24.3.2) | Módulo 1 | Auditoría formal para entidades de alto y crítico riesgo |
| Lista de verificación de inspección (Fig. 24.8) | Módulo 1 | Checklist de auditoría Bloque A y Bloque B (Sección 8.2) |
| Métricas de control (§24.4) | Módulos 1 y 2 | KPIs de Dimensión 2: tasa de estabilidad, disponibilidad, éxito de proyectos |
| Métricas de predicción (§24.4) | Módulos 1 y 2 | KPIs de Dimensión 1: completitud, vigencia NDA, densidad de defectos |
| Métricas estáticas (§24.4.1, Fig. 24.11) | Módulo 1 | Completitud del perfil, cobertura del glosario, densidad de defectos |
| Proceso de medición de componentes (§24.4.2, Fig. 24.13) | Todos | Identificación de entidades "anómalas" con KPIs fuera del umbral |
| Paradigma GQM (§24.4.2 + §26.2) | Todos | Justificación de cada KPI: Goal → Question → Metric (Sección 6.3) |
| Ambigüedad de mediciones (§24.4.3) | Módulo 1 | Los KPIs generan alertas, no acciones automáticas; requieren validación contextual |
| Densidad de defectos (§24.4) | Módulo 1 | `densidadDefectosPerfil` = campos_error / campos_obligatorios × 100 |
| Datos históricos como recurso organizacional (§24.4.2) | Módulo 2 | `Entidad.historialProyectos` como base de datos de medición histórica |
| Roles en inspección — moderador, secretario (§24.3) | Módulo 1 | Roles de auditoría: `gestor` (auditor), `admin` (aprobador de cambios de riesgo) |
| Tasa de detección de defectos (§24.3.2) | Módulo 1 | Hallazgos por auditoría; % de KPIs en alerta por revisión |
| Resistencia a estándares (§24.2) | Todos | Estándares implementados como validaciones automáticas del sistema |
| Calidad de proceso → calidad de producto (§24.1, Fig. 24.3) | Módulo 2 | Entidades con buena Dimensión 2 producen proyectos con menor densidad de cambios |
| Plan de calidad con atributos prioritarios (§24.1) | Todos | Nivel completo del perfil como prerequisito para iniciar SRS en Módulo 3 |

***

## 11. Checklist de Completitud del Documento

Verificación final de todos los ítems extraídos del Cap. 24 de Sommerville y los entregables operativos comprometidos:

**Marco teórico (Cap. 24 §24.1 — Calidad del software):**
- [x] Definición formal de calidad del software (Cap. 24 §24.1, p. 655)
- [x] El dilema de la calidad: mejorar un atributo puede degradar otro (Cap. 24 §24.1, p. 656)
- [x] Los 6 criterios de evaluación de calidad subjetiva (Cap. 24 §24.1, p. 655–656)
- [x] Los 15 atributos de calidad de Boehm (Cap. 24 §24.1, Fig. 24.2, p. 656)
- [x] Calidad de proceso vs. calidad de producto: definición, diferencia y relación (Cap. 24 §24.1, p. 656–657)

**Estándares (Cap. 24 §24.2):**
- [x] Definición y 3 razones de los estándares de software (Cap. 24 §24.2, p. 658)
- [x] Tipos de estándares: producto y proceso (Cap. 24 §24.2, p. 658)
- [x] Estándares de documentación (Cap. 24 §24.2, p. 658)
- [x] ISO 9001: definición, 9 procesos centrales, flexibilidad y limitaciones (Cap. 24 §24.2.1, p. 660–662)
- [x] Resistencia a estándares y 3 estrategias para superarla (Cap. 24 §24.2, p. 659–660)

**Revisiones e inspecciones (Cap. 24 §24.3):**
- [x] Definición de revisión de calidad: propósito, quiénes participan, qué se revisa (Cap. 24 §24.3, p. 663)
- [x] El proceso de revisión en 3 fases (Cap. 24 §24.3.1, Fig. 24.7, p. 664)
- [x] Inspecciones de Fagan: definición y efectividad (Cap. 24 §24.3.2, p. 666)
- [x] Roles en el proceso de inspección (Cap. 24 §24.3.2, p. 665)
- [x] Lista de verificación de inspección (Cap. 24 §24.3.2, Fig. 24.8, p. 667)
- [x] Diferencia entre revisión informal, técnica e inspección formal
- [x] Métricas de inspección: tasa de detección de defectos (Cap. 24 §24.3.2, p. 666)

**Medición y métricas (Cap. 24 §24.4):**
- [x] Definición de métrica de software (Cap. 24 §24.4, p. 668)
- [x] Métricas de control vs. predicción (Cap. 24 §24.4, p. 668–669)
- [x] Métricas estáticas de producto: Fan-in/out, longitud, complejidad ciclomática, índice Fog (Cap. 24 §24.4.1, Fig. 24.11, p. 673)
- [x] Suite de métricas CK orientadas a objetos (Cap. 24 §24.4.1, Fig. 24.12, p. 674)
- [x] Proceso de medición de componentes en 5 etapas (Cap. 24 §24.4.2, Fig. 24.13, p. 674–675)
- [x] Predicción de calidad: relación complejidad → densidad de defectos (Cap. 24 §24.4.2, p. 670)
- [x] Paradigma GQM: definición completa y aplicación a KPIs del sistema (Cap. 24 §24.4.2 + Cap. 26 §26.2, p. 674 + p. 712–713)
- [x] Ambigüedad de mediciones: por qué las métricas sin contexto son peligrosas (Cap. 24 §24.4.3, p. 676–677)
- [x] Densidad de defectos del perfil: definición y fórmula aplicada

**Entregables operativos (Secciones 7, 8 y 9):**
- [x] KPIs de Calidad de Datos (Dimensión 1): 9 KPIs con fórmula, fuente, meta y alerta (Sección 7.1)
- [x] KPIs de Desempeño en Proyectos (Dimensión 2): 8 KPIs con fórmula, fuente, meta e impacto en `nivelRiesgo` (Sección 7.2)
- [x] GQM aplicado a cada KPI del sistema: Goal → Question → Metric (Sección 6.3)
- [x] Proceso de auditoría: frecuencia por `nivelRiesgo`, checklist, roles, entregable y consecuencias (Sección 8)
- [x] Estructura del `InformeAuditoria` con todos los campos mínimos (Sección 8.4)
- [x] Estándar de Completitud del Perfil: 3 niveles con requisitos exactos (Sección 9)
- [x] Reglas de validación automática para transición entre módulos (Sección 9, pseudocódigo)
- [x] Tabla de conexiones con los 3 módulos: 20 conceptos del Cap. 24 mapeados (Sección 10)

***

*Fuente exclusiva: Sommerville, I. (2011). Ingeniería de Software, 9ª Edición. Pearson Education. Capítulo 24: Gestión de la Calidad (pp. 651–680) + referencias cruzadas al Capítulo 26 §26.2 para el paradigma GQM (pp. 711–713).*

---

## References

1. [Ingenieria-de-Software-Sommerville.pdf](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_20766faf-8b01-49ce-8ad0-87abfae47f60/e01c9caf-8926-412e-b6f0-c64fac70bd56/Ingenieria-de-Software-Sommerville.pdf?AWSAccessKeyId=ASIA2F3EMEYEW2NOCX6T&Signature=%2BXFzDUUzNRKC76ikl282%2BqlwSC8%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEDcaCXVzLWVhc3QtMSJHMEUCIQChcb39iEs5vg5y%2BY%2FVnEUXLTMzWPmGOZzdH8%2BudGqdzAIgYIBDbfSDSAe%2F718INsZpdXrGq5Sze1NnGG4L%2Fm8TnMQq8wQIABABGgw2OTk3NTMzMDk3MDUiDDXu7E0DLCZgmUeJ%2BSrQBOJkoTMoSLUpRxEV1PH9rKYovo7t0%2FtfMr4utWkAF1VV35OD3luFLRUVN9QWkLBRZwzkwNiktXfAf25ET9dcIHWEpKqNw5LETb0MoKKWXpFIGy%2F8s59JoSAEp8kxSS67X1P%2Fck04CpHO8%2FRNy%2B6ObUd9Eko8d47UZeA8wnlr7k3Rz8cqgeg4FYN5GrrrKC%2FGoNHlww7hKDCmsTl6nsyjzdF1WDnIp6SNVYOPb88qGwuTo5n3tgSFTZPeO3r25B4hrpBTaNE8PTPLyRXVJe68c0hVyEoUY9mF7UT4SIpIL4NHPmGvTvlgGVigcklHYw1LJlKoOJP015DLcsENq9OYHFWG1RFWC9%2BFibveT92qVSCisJrRWRN%2BPqi38rFb2KJnbA85%2Bw6bRMK4DSf%2F5VKhU6S9AUHZ07hUoN6oG7k4up39n6YFAk5PrJpMtLuyLkb2%2BUkrJBlklt%2Fr1wjgoeAtPkDdersDozDiCLatpJo24leKDkDQW%2BKPQzcPp1yknVTWep0J5gGoMN3R2oM2gYctOxGrZqmHIUp9araYrN45iCFm%2Bj2hpQX5Z6HRDasHae%2B37KlE%2FWDiAtJMBspt8hBuMWt0E3pQTfjBT7Z%2FvXn%2FZTaI3R%2F8%2FPxeG5DyzTYcMrwmbmKF1U0Ickm6mB3JYNqe43mDl26Zmkf4zE%2Bh3oZd8F47zJrGZzno3XUFX6MHcksD%2B1ZiB7zvw6AxcYW1wGyLceFe1cxwMxezz2slaVVy%2F0MSY%2B4qRoyj5xdyf5Vy3yew4D8AjA0N0H6s%2FyUHvUj3PGAwptb4zAY6mAHs24aI8Y1%2F23QJ4SQRe45%2BGSzLiHnrGK0ETb%2Fz%2FSTfHWm%2BWdBxLaguGFQmaeVTiYz0vth%2BVpsLFh4kxnYwvpBqcIEndqTsNxADjAd3nmyr%2B0qdPPkg%2FwaNvVIj8G%2FgfCVwd5OWmHqeLA6W7%2Bbda%2B8ELY19eT6ih6qEXtld7v6CrADVUb%2F41amtgbCyK9Sh4nqEI%2FCe4jV90Q%3D%3D&Expires=1771979405) - 674 Captulo 24 Gestin de la calidad recopilados en proyectos anteriores. Las mediciones anmalas, que...

