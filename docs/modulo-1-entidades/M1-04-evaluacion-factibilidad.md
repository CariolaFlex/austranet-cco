# M1-04-evaluacion-factibilidad.md

---

## Metadatos

| Campo | Valor |
|---|---|
| **Nombre del archivo** | `M1-04-evaluacion-factibilidad.md` |
| **Módulo principal** | Módulo 1 — Registro de Clientes y Proveedores (Entidades) |
| **Módulo secundario** | Módulo 2 — Registro y Configuración de Proyectos |
| **Capítulos fuente** | Cap. 4 §4.4 · Cap. 4 §4.5 · Cap. 22 §22.1 |
| **Referencia bibliográfica** | Sommerville, I. (2011). *Ingeniería de Software* (9.ª ed.). Pearson Educación. |
| **Versión** | 1.0.0 |
| **Fecha** | 2026-02-24 |
| **Estado** | ✅ Completo — listo para implementación |

---

## 1. Objetivo del Documento

Este archivo establece el **marco teórico completo** para evaluar la factibilidad de trabajar con una entidad y de ejecutar un proyecto para ella, antes de comprometer recursos del equipo de desarrollo.

El marco teórico se extrae exclusivamente de:
- **Cap. 4 §4.4 y §4.5** — Definición formal del estudio de factibilidad dentro del proceso de ingeniería de requerimientos.
- **Cap. 22 §22.1** — Gestión del riesgo como actividad central de la administración de proyectos de software.

### Dos momentos de evaluación en el sistema

La evaluación de factibilidad ocurre en **dos momentos distintos** del flujo del sistema:

| Momento | Módulo | Qué se evalúa | Resultado |
|---|---|---|---|
| **M1** | Módulo 1 — Entidades | Viabilidad de establecer relación comercial con la entidad | Valor de `nivelRiesgoEntidad`: `bajo` / `medio` / `alto` / `crítico` |
| **M2** | Módulo 2 — Proyectos | Viabilidad técnica, económica y organizacional del proyecto propuesto | Registro de riesgos del proyecto (`RiesgoProyecto[]`) |

La **conexión clave** entre ambos momentos: los riesgos identificados durante la evaluación de la entidad en M1 se heredan como riesgos iniciales del proyecto en M2. Un `nivelRiesgoEntidad: 'alto'` o `'critico'` genera automáticamente ítems en el registro de riesgos del proyecto antes de que el equipo inicie la ingeniería de requerimientos.

---

## 2. El Estudio de Factibilidad (Cap. 4 §4.4 y §4.5)

### 2.1 Definición Formal

> *"Un estudio de factibilidad es un breve estudio enfocado que debe realizarse con oportunidad en el proceso de IR."*
> — Sommerville, Cap. 4 §4.5, p. 100

El estudio de factibilidad es la **primera actividad** del proceso de ingeniería de requerimientos (IR), anterior a la adquisición y análisis de requerimientos. Su propósito es determinar si continuar con el proyecto tiene sentido para la organización, dado el estado actual de la tecnología, el presupuesto disponible y el entorno organizacional del cliente.

Sommerville ubica esta actividad en el inicio de la **vista en espiral del proceso de IR** (Fig. 4.12, p. 99): el estudio de factibilidad es el primer ciclo de la espiral, y su resultado condiciona si se avanza hacia la adquisición de requerimientos y, eventualmente, hacia la especificación (SRS).

### 2.2 Las Tres Preguntas Fundamentales

El libro define con precisión las tres preguntas que debe responder un estudio de factibilidad (Cap. 4 §4.5, p. 100):

> **a)** *¿El sistema contribuye con los objetivos globales de la organización?*
>
> **b)** *¿El sistema puede implementarse dentro de la fecha y el presupuesto usando la tecnología actual?*
>
> **c)** *¿El sistema puede integrarse con otros sistemas que se utilicen?*

> *"Si la respuesta a cualquiera de estas preguntas es negativa, probablemente no sea conveniente continuar con el proyecto."*
> — Sommerville, Cap. 4 §4.5, p. 100

Estas tres preguntas mapean directamente a los tres tipos de factibilidad del sistema:

| Pregunta del libro | Tipo de factibilidad | Módulo donde se evalúa |
|---|---|---|
| ¿Contribuye a los objetivos de la organización? | Organizacional | M1 (entidad) y M2 (proyecto) |
| ¿Puede implementarse con tecnología actual, en plazo y presupuesto? | Técnica + Económica | M2 (proyecto) |
| ¿Puede integrarse con sistemas existentes? | Técnica | M2 (proyecto) |

### 2.3 Fuentes de Información para el Estudio

Sommerville indica que el estudio de factibilidad requiere consultar a personas clave de la organización cliente (Cap. 4 §4.5, p. 100–103):

- **Administradores de nivel ejecutivo**: definen objetivos estratégicos y disponibilidad de presupuesto.
- **Usuarios finales del sistema**: describen los sistemas existentes y sus limitaciones.
- **Personal de TI del cliente**: informa sobre la infraestructura tecnológica disponible y los sistemas con los que debe integrarse.
- **Responsables de procesos de negocio**: describen los flujos de trabajo que el sistema deberá soportar o modificar.

### 2.4 Resultado del Estudio: Qué Decide y Qué Produce

El estudio de factibilidad produce una **decisión binaria** respaldada por evidencia:

| Resultado | Acción |
|---|---|
| Factible | Continuar hacia la adquisición de requerimientos (inicio del SRS en Módulo 3) |
| No factible | Suspender el proyecto antes de comprometer recursos significativos |

Como entregable, el estudio produce un **documento o formulario de evaluación** que registra las respuestas a las tres preguntas fundamentales, los supuestos utilizados y la decisión resultante. Este documento es aprobado por el administrador del proyecto o el responsable comercial del equipo de desarrollo.

### 2.5 Por qué el Estudio de Factibilidad es Previo a la IR

Sommerville es explícito en que el estudio de factibilidad no es parte de la ingeniería de requerimientos, sino su **precondición** (Cap. 4 §4.4, p. 99):

> *"[Las actividades] se enfocan en valorar si el sistema es útil para la empresa (estudio de factibilidad), descubrir requerimientos (adquisición y análisis)…"*
> — Sommerville, Cap. 4 §4.4, p. 99

La distinción es fundamental: la IR supone que ya se decidió que el proyecto *vale la pena*. El estudio de factibilidad es la actividad que toma esa decisión preliminar, con el mínimo de recursos invertidos.

**Aplicación en el sistema:** En el Módulo 2, al crear un proyecto nuevo, el sistema presenta el formulario de evaluación de factibilidad (Sección 5 de este documento) *antes* de habilitar la creación del SRS en el Módulo 3. La decisión de factibilidad queda registrada como metadato del proyecto y puede auditarse. Si la evaluación resulta en `nivelRiesgo: 'critico'`, el sistema requiere aprobación explícita de un administrador para continuar.

---

## 3. Los 3 Tipos de Factibilidad

Basándose en Cap. 4 §4.5, p. 100, los tres tipos de factibilidad corresponden a las tres preguntas del estudio de factibilidad.

### 3.1 Factibilidad Técnica

**Definición:** Evalúa si el sistema *puede construirse* con la tecnología disponible actualmente, dentro de los plazos estimados.

La pregunta del libro: *"¿El sistema puede implementarse dentro de la fecha y el presupuesto usando la tecnología actual?"* (Cap. 4 §4.5, p. 100)

| Factor | Indicador de baja factibilidad | Indicador de alta factibilidad | Peso |
|---|---|---|---|
| Madurez tecnológica del stack requerido | Tecnología nueva sin casos de uso probados | Stack ampliamente adoptado con documentación madura | 20% |
| Experiencia previa del equipo con tecnologías del cliente | Ninguna experiencia con los sistemas del cliente | El equipo ya integró sistemas similares | 20% |
| Existencia de sistemas con los que hay que integrarse | Sistemas heredados no documentados, sin API | APIs documentadas, estándares abiertos | 25% |
| Disponibilidad de infraestructura en el cliente | Sin infraestructura mínima (servidores, red, dispositivos) | Infraestructura adecuada disponible | 15% |
| Complejidad técnica del problema | Requerimientos que exceden el estado del arte | Problema técnicamente resuelto en el mercado | 20% |

**Aplicación en el sistema:** En M1, la pregunta "¿Ha ejecutado proyectos de software antes?" y "¿Tiene sistemas existentes documentados?" evalúan la factibilidad técnica de la entidad. En M2, los riesgos de tipo `'tecnologico'` del enum `RiesgoProyecto.tipo` capturan los factores de esta dimensión.

### 3.2 Factibilidad Económica

**Definición:** Evalúa si los beneficios derivados del sistema *justifican* los costos de su desarrollo, operación y mantenimiento.

La pregunta implícita: el sistema debe poder *implementarse dentro del presupuesto disponible* (Cap. 4 §4.5, p. 100).

| Factor | Indicador de baja factibilidad | Indicador de alta factibilidad | Peso |
|---|---|---|---|
| Presupuesto definido para el proyecto | Sin presupuesto aprobado o en negociación indefinida | Presupuesto aprobado por autoridad competente | 25% |
| Accesibilidad de los decisores financieros | Decisores desconocidos o inaccesibles | Patrocinador ejecutivo identificado y comprometido | 20% |
| Relación beneficio/costo estimada | Beneficios intangibles únicamente, ROI incierto | Beneficios tangibles cuantificables, ROI positivo estimado | 30% |
| Capacidad para cubrir costos de operación | Sin presupuesto para mantenimiento post-entrega | Presupuesto operativo incluido en la planificación | 25% |

**Nota sobre la dificultad de estimación económica en software:** Sommerville señala en Cap. 23 §23.1 que estimar el costo de proyectos de software es inherentemente difícil porque *"el software es intangible"* y *"los administradores de proyectos de software no pueden constatar el progreso con sólo observar el artefacto que se construye"* (Cap. 22, p. 594). Esta dificultad hace que la factibilidad económica deba evaluarse con márgenes de contingencia explícitos.

**Aplicación en el sistema:** En M1, las preguntas sobre presupuesto y accesibilidad de decisores financieros evalúan la factibilidad económica de la entidad. Los riesgos de tipo `'estimacion'` en `RiesgoProyecto` capturan los riesgos económicos del proyecto.

### 3.3 Factibilidad Organizacional

**Definición:** Evalúa si la organización cliente *puede absorber el cambio* que implica el nuevo sistema.

La pregunta del libro: *"¿El sistema contribuye con los objetivos globales de la organización?"* (Cap. 4 §4.5, p. 100). Esta pregunta no solo indaga sobre la alineación estratégica, sino también sobre la capacidad real de la organización para adoptar el cambio.

| Factor | Indicador de baja factibilidad | Indicador de alta factibilidad | Peso |
|---|---|---|---|
| Disponibilidad de stakeholders clave | Stakeholders dispersos, sin tiempo para el proyecto | Stakeholders identificados y con disponibilidad confirmada | 25% |
| Patrocinador ejecutivo identificado | Sin sponsor ejecutivo | Sponsor comprometido con autoridad para decidir | 25% |
| Resistencia organizacional al cambio | Alta resistencia documentada, cultura sin innovación tecnológica | Cultura de adopción tecnológica, experiencia con cambios previos | 20% |
| Capacidad de gestión del cambio | Sin procesos de gestión del cambio organizacional | Procesos formales de cambio, personal de TI dedicado | 15% |
| Alineación del proyecto con objetivos estratégicos | Proyecto periférico sin apoyo estratégico | Proyecto alineado con objetivos declarados de la organización | 15% |

**Conexión con sistemas sociotécnicos (M1-02):** Una organización con estructuras complejas, múltiples niveles jerárquicos o procesos organizacionales rígidos presenta *menor factibilidad organizacional inicial*, porque el nuevo sistema requerirá modificar procesos establecidos y vencer la inercia institucional. Esto se refleja directamente en los riesgos de tipo `'organizacional'` en `RiesgoProyecto`.

**Aplicación en el sistema:** En M1, la existencia de patrocinador ejecutivo y la disponibilidad de stakeholders clave son los indicadores más determinantes del nivel de riesgo inicial de la entidad.

---

## 4. Gestión del Riesgo — Marco Completo (Cap. 22 §22.1)

### 4.1 Definición de Riesgo en IS

> *"Podemos considerar un riesgo como algo que es preferible que no ocurra."*
> — Sommerville, Cap. 22 §22.1, p. 596

Sommerville establece que los riesgos pueden afectar tres dimensiones:

> *"Los riesgos pueden amenazar el proyecto, el software que se desarrolla o a la organización."*
> — Sommerville, Cap. 22 §22.1, p. 596

#### Tres categorías de riesgo (Cap. 22 §22.1, p. 596)

| Categoría | Definición | Ejemplo del libro |
|---|---|---|
| **Riesgos del proyecto** | *"Riesgos que alteran el calendario o los recursos del proyecto."* | *"La renuncia de un diseador experimentado."* |
| **Riesgos del producto** | *"Riesgos que afectan la calidad o el rendimiento del software a desarrollar."* | *"La falla que presenta un componente que se adquirió al no desempearse como se esperaba."* |
| **Riesgos empresariales** | *"Riesgos que afectan a la organización que desarrolla o adquiere el software."* | *"Un competidor que introduce un nuevo producto."* |

#### Por qué la gestión del riesgo es una actividad continua

> *"La gestión del riesgo es particularmente importante para los proyectos de software, debido a la incertidumbre inherente que enfrentan la mayoría de proyectos."*
> — Sommerville, Cap. 22 §22.1, p. 596

> *"El proceso de gestión del riesgo es un proceso iterativo que continúa a lo largo del proyecto."*
> — Sommerville, Cap. 22 §22.1, p. 597

**Aplicación en el sistema:** El tipo `RiesgoProyecto` del sistema incluye el campo `estado` (`activo` / `mitigado` / ...) precisamente para soportar esta naturaleza continua. Los riesgos no se registran una sola vez; se revisan en cada iteración del proyecto.

---

### 4.2 Tipos de Riesgos — Tabla Completa (Fig. 22.3, Cap. 22 §22.1, p. 598–599)

Sommerville define **seis tipos de riesgos** con una lista de comprobación de ejemplos concretos:

> *"Existen al menos seis tipos de riesgos que pueden incluirse en una lista de verificación."*
> — Sommerville, Cap. 22 §22.1, p. 598

#### Tabla 22.3 — Ejemplos de diferentes tipos de riesgos (reproducción íntegra)

| # | Tipo de riesgo | Descripción del libro | Valor en `RiesgoProyecto.tipo` |
|---|---|---|---|
| 1 | **Tecnológico** | *"La base de datos que se usa en el sistema no puede procesar tantas transacciones por segundo como se esperaba."* | `'tecnologico'` |
| 2 | **Tecnológico** | *"Los componentes de software de reutilización contienen defectos que hacen que no puedan reutilizarse como se planeó."* | `'tecnologico'` |
| 3 | **Personal** | *"Es imposible reclutar personal con las habilidades requeridas."* | `'personas'` |
| 4 | **Personal** | *"El personal clave está enfermo e indispuesto en momentos críticos."* | `'personas'` |
| 5 | **Personal** | *"No está disponible la capacitación requerida para el personal."* | `'personas'` |
| 6 | **Organizacional** | *"La organización se reestructura de modo que diferentes administraciones son responsables del proyecto."* | `'organizacional'` |
| 7 | **Organizacional** | *"Problemas financieros de la organización fuerzan reducciones en el presupuesto del proyecto."* | `'organizacional'` |
| 8 | **Herramientas** | *"El código elaborado por las herramientas de generación de código de software es ineficiente."* | `'tecnologico'`* |
| 9 | **Herramientas** | *"Las herramientas de software no pueden trabajar en una forma integrada."* | `'tecnologico'`* |
| 10 | **Requerimientos** | *"Se proponen cambios a los requerimientos que demandan mayor trabajo de rediseño."* | `'requerimientos'` |
| 11 | **Requerimientos** | *"Los clientes no entienden las repercusiones de los cambios a los requerimientos."* | `'requerimientos'` |
| 12 | **Estimación** | *"Se subestima el tiempo requerido para desarrollar el software."* | `'estimacion'` |
| 13 | **Estimación** | *"Se subestima la tasa de reparación de defectos."* | `'estimacion'` |
| 14 | **Estimación** | *"Se subestima el tamaño del software."* | `'estimacion'` |

> *Nota de mapeo:* El libro define "riesgos de herramientas" como categoría separada. El enum del sistema no incluye `'herramientas'` como valor propio, por lo que los riesgos de herramientas se mapean a `'tecnologico'`, que es la categoría semánticamente más cercana. Esto es consistente con la naturaleza técnica de los riesgos de herramientas.

#### Riesgos comunes del proyecto, el producto y la empresa (Fig. 22.1, Cap. 22 §22.1, p. 597)

| Riesgo | Repercute en | Descripción |
|---|---|---|
| Rotación de personal | Proyecto | Personal experimentado abandonará el proyecto antes de que éste se termine. |
| Cambio administrativo | Proyecto | Habrá un cambio de gestión en la organización con diferentes prioridades. |
| Indisponibilidad de hardware | Proyecto | Hardware, que es esencial para el proyecto, no se entregará a tiempo. |
| Cambio de requerimientos | Proyecto y producto | Habrá mayor cantidad de cambios a los requerimientos que los anticipados. |
| Demoras en la especificación | Proyecto y producto | Especificaciones de interfaces esenciales no están disponibles a tiempo. |
| Subestimación del tamaño | Proyecto y producto | Se subestimó el tamaño del sistema. |
| Bajo rendimiento de herramientas CASE | Producto | Las herramientas CASE, que apoyan el proyecto, no se desempeñan como se anticipaba. |
| Cambio tecnológico | Empresa | La tecnología subyacente sobre la cual se construye el sistema se sustituye con nueva tecnología. |
| Competencia de productos | Empresa | Un producto competitivo se comercializa antes de que el sistema esté completo. |

**Aplicación en el sistema:** El campo `tipo` del tipo `RiesgoProyecto` implementa directamente los seis tipos de riesgos de Sommerville (consolidando "herramientas" en `'tecnologico'`). Esta tabla es la fuente canónica para clasificar cualquier riesgo identificado durante la evaluación de una entidad (M1) o al crear un proyecto (M2).

---

### 4.3 El Proceso de Gestión del Riesgo — 4 Etapas (Fig. 22.2, Cap. 22 §22.1, p. 597)

> *"En la figura 22.2 se ilustra una idea general del proceso de gestión del riesgo."*
> — Sommerville, Cap. 22 §22.1, p. 597

El proceso comprende cuatro etapas:

```
Identificación del riesgo
        ↓
Análisis del riesgo
        ↓
Planeación ante el riesgo
        ↓
Monitorización del riesgo
```

---

#### Etapa 1 — Identificación del Riesgo (Cap. 22 §22.1.1, p. 598)

> *"La identificación del riesgo es la primera etapa del proceso de gestión del riesgo. Se ocupa de identificar los riesgos que pudieran plantear una mayor amenaza al proceso de ingeniería de software, al software a desarrollar, o a la organización que lo desarrolla."*
> — Sommerville, Cap. 22 §22.1.1, p. 598

**Técnicas:**
- **Lista de verificación por tipos**: usar los seis tipos de riesgo como punto de partida para la identificación estructurada.
- **Proceso de equipo**: *"La identificación del riesgo puede ser un proceso de equipo en el que este último se reúne para pensar en posibles riesgos."*
- **Juicio del administrador**: *"O bien, el administrador del proyecto, con base en su experiencia, identifica los riesgos más probables o críticos."*

**Produce:** Lista de riesgos potenciales (entrada a la siguiente etapa).

> *"Al concluir el proceso de identificación de riesgos, se tendrá una larga lista de eventualidades que podrían ocurrir y afectar al producto, al proceso y a la empresa. Entonces se necesita reducir esta lista a un tamaño razonable."*
> — Sommerville, Cap. 22 §22.1.1, p. 598

**Aplicación en el sistema:** En M1, la evaluación de factibilidad de la entidad es una forma sistematizada de identificación de riesgos usando una lista de verificación fija (ver Sección 5). En M2, al crear un proyecto, el equipo completa un registro de riesgos libre que usa los seis tipos como estructura de clasificación.

---

#### Etapa 2 — Análisis de Riesgos (Cap. 22 §22.1.2, p. 598–600)

> *"Durante el proceso de análisis de riesgos, hay que considerar cada riesgo identificado y realizar un juicio acerca de la probabilidad y gravedad de dicho riesgo."*
> — Sommerville, Cap. 22 §22.1.2, p. 598

**Escala de probabilidad** (Cap. 22 §22.1.2, p. 599):

> *"La probabilidad del riesgo puede valorarse como muy baja (<10%), baja (del 10 al 25%), moderada (del 25 al 50%), alta (del 50 al 75%) o muy alta (>75%)."*
> — Sommerville, Cap. 22 §22.1.2, p. 599

| Valor Sommerville | Rango | Valor en `RiesgoProyecto.probabilidad` |
|---|---|---|
| Muy baja | < 10% | `'muy_baja'` |
| Baja | 10–25% | `'baja'` |
| Moderada | 25–50% | `'media'` |
| Alta | 50–75% | `'alta'` |
| Muy alta | > 75% | `'muy_alta'` |

**Escala de impacto (efectos)** (Cap. 22 §22.1.2, p. 599):

> *"Los efectos del riesgo pueden estimarse como catastróficos (amenazan la supervivencia del proyecto), graves (causarían grandes demoras), tolerables (demoras dentro de la contingencia permitida) o insignificantes."*
> — Sommerville, Cap. 22 §22.1.2, p. 599

| Valor Sommerville | Descripción | Valor en `RiesgoProyecto.impacto` |
|---|---|---|
| Insignificantes | No afectan materialmente el proyecto | `'muy_bajo'` |
| Tolerables | Demoras dentro de la contingencia | `'bajo'` / `'medio'` |
| Graves | Causarían grandes demoras | `'alto'` |
| Catastróficos | Amenazan la supervivencia del proyecto | `'muy_alto'` |

**Priorización:** Los riesgos se clasifican por la combinación de probabilidad y gravedad:

> *"En general, los riesgos catastróficos deben considerarse siempre, así como los riesgos graves con más de una probabilidad moderada de ocurrencia."*
> — Sommerville, Cap. 22 §22.1.2, p. 599

**Produce:** Lista de riesgos prioritarios (tabla clasificada por gravedad).

**Aplicación en el sistema:** Los campos `probabilidad` e `impacto` del tipo `RiesgoProyecto` implementan directamente las escalas de Sommerville. La Sección 7 de este documento provee la matriz de combinación para calcular la prioridad resultante.

---

#### Etapa 3 — Planeación del Riesgo (Cap. 22 §22.1.3, p. 600–601)

> *"El proceso de planeación del riesgo considera cada uno de los riesgos clave identificados y desarrolla estrategias para manejarlos."*
> — Sommerville, Cap. 22 §22.1.3, p. 600

Sommerville define **tres estrategias de mitigación**:

> *"Dichas estrategias se establecen en tres categorías."*
> — Sommerville, Cap. 22 §22.1.3, p. 601

##### Estrategia 1 — Evitación del riesgo (`'evitar'`)

> *"Estrategias de evitación. Seguir estas estrategias significa que se reducirá la probabilidad de que surja el riesgo."*
> — Sommerville, Cap. 22 §22.1.3, p. 601

**Cuándo usarla:** Cuando el riesgo tiene probabilidad alta o muy alta Y la consecuencia es catastrófica. Es la estrategia preferida cuando es factible.

**Ejemplo del libro:** Componentes defectuosos → *"Sustituya los componentes potencialmente defectuosos con la compra de componentes de conocida fiabilidad."* (Fig. 22.5, p. 601)

##### Estrategia 2 — Minimización del riesgo (`'minimizar'`)

> *"Estrategias de minimización. Seguir estas estrategias significa que se reducirá el efecto del riesgo."*
> — Sommerville, Cap. 22 §22.1.3, p. 601

**Cuándo usarla:** Cuando el riesgo no puede evitarse pero sus efectos pueden acotarse mediante diseño organizativo o técnico.

**Ejemplo del libro:** Enfermedad del personal → *"Reorganice los equipos de manera que haya más traslape de trabajo y, así, las personas comprendan las labores de los demás."* (Fig. 22.5, p. 601)

##### Estrategia 3 — Plan de contingencia (`'contingencia'`)

> *"Planes de contingencia. Seguir estas estrategias significa que se está preparado para lo peor y se tiene una estrategia para hacer frente a ello."*
> — Sommerville, Cap. 22 §22.1.3, p. 601

**Cuándo usarla:** Cuando el riesgo no puede evitarse ni minimizarse suficientemente, pero puede prepararse una respuesta para cuando ocurra.

**Ejemplo del libro:** Problemas financieros de la organización → *"Prepare un documento informativo para altos ejecutivos en el que muestre cómo el proyecto realiza una aportación muy importante a las metas de la empresa y presente razones por las que los recortes al presupuesto del proyecto no serían efectivos en costo."* (Fig. 22.5, p. 601)

##### Estrategia 4 — Aceptación (`'aceptar'`)

Implícita en Sommerville cuando el riesgo tiene impacto muy bajo o probabilidad muy baja: aceptar el riesgo sin acción preventiva, monitorizando su evolución.

> *"Boehm (1988) recomienda identificar y monitorizar los 10 riesgos principales."*
> — Sommerville, Cap. 22 §22.1.2, p. 600

Los riesgos fuera de este umbral se aceptan.

**Jerarquía de preferencia:**

> *"Desde luego, es mejor usar una estrategia que evitar el riesgo. Si esto no es posible, se debe usar una estrategia que reduzca las posibilidades de que el riesgo cause graves efectos. Finalmente, se debe contar con estrategias para enfrentar el riesgo cuando éste surja."*
> — Sommerville, Cap. 22 §22.1.3, p. 601

| Prioridad | Estrategia | Valor en `RiesgoProyecto.estrategia` |
|---|---|---|
| 1 (preferida) | Evitación | `'evitar'` |
| 2 | Minimización | `'minimizar'` |
| 3 | Contingencia | `'contingencia'` |
| 4 (última opción) | Aceptación | `'aceptar'` |

**Produce:** Planes de mitigación para cada riesgo prioritario.

**Aplicación en el sistema:** El campo `estrategia` del tipo `RiesgoProyecto` implementa las tres estrategias de Sommerville más la estrategia de aceptación. El campo `mitigacion` (texto libre) captura el plan concreto de cada estrategia.

---

#### Etapa 4 — Monitorización del Riesgo (Cap. 22 §22.1.4, p. 602)

> *"La monitorización del riesgo es el proceso para comprobar que no han cambiado sus suposiciones sobre riesgos del producto, el proceso y la empresa."*
> — Sommerville, Cap. 22 §22.1.4, p. 602

> *"Los riesgos deben monitorizarse comúnmente en todas las etapas del proyecto. En cada revisión administrativa, es necesario reflexionar y estudiar cada uno de los riesgos clave por separado."*
> — Sommerville, Cap. 22 §22.1.4, p. 602

**Frecuencia recomendada:** En cada revisión administrativa del proyecto (mínimo una vez por iteración o sprint).

#### Indicadores de riesgo por tipo (Fig. 22.6, Cap. 22 §22.1.4, p. 602)

| Tipo de riesgo | Indicadores para monitorizar |
|---|---|
| **Tecnológico** | *"Entrega tardía de hardware o software de soporte; muchos problemas tecnológicos reportados."* |
| **Personal** | *"Baja moral de personal; malas relaciones entre miembros del equipo; alta rotación de personal."* |
| **Organizacional** | *"Chismes en la organización; falta de acción de los altos ejecutivos."* |
| **Herramientas** | *"Renuencia de los miembros del equipo para usar herramientas; quejas acerca de las herramientas CASE; demandas por estaciones de trabajo mejor equipadas."* |
| **Requerimientos** | *"Muchas peticiones de cambio de requerimientos; quejas de los clientes."* |
| **Estimación** | *"Falla para cumplir con el calendario acordado; falla para corregir los defectos reportados."* |

**Aplicación en el sistema:** El campo `estado` del registro de riesgo (`activo` / `mitigado` / otros) permite implementar la monitorización continua. Cuando un indicador de la tabla anterior se detecta en el proyecto, el riesgo correspondiente pasa de `'mitigado'` de vuelta a `'activo'` si las condiciones cambian.

---

### 4.4 Los Riesgos de Mayor Probabilidad — Lista Priorizada (Fig. 22.4, Cap. 22 §22.1.2, p. 600)

Sommerville presenta una **tabla de riesgos priorizados** (Fig. 22.4) con probabilidad y efectos estimados. Los ocho riesgos que recomienda monitorizar activamente son:

| # | Riesgo | Probabilidad | Efectos | Tipo en el sistema |
|---|---|---|---|---|
| 7 | *"Problemas financieros de la organización fuerzan reducciones en el presupuesto del proyecto."* | Baja | **Catastróficos** | `'organizacional'` |
| 3 | *"Es imposible reclutar personal con las habilidades requeridas."* | Alta | **Catastróficos** | `'personas'` |
| 4 | *"El personal clave está enfermo e indispuesto en momentos críticos."* | Moderada | **Graves** | `'personas'` |
| 2 | *"Los componentes de software de reutilización contienen defectos que hacen que no puedan reutilizarse como se planeó."* | Moderada | **Graves** | `'tecnologico'` |
| 10 | *"Se proponen cambios a los requerimientos que demandan mayor trabajo de rediseño."* | Moderada | **Graves** | `'requerimientos'` |
| 6 | *"La organización se reestructura de modo que diferentes administraciones son responsables del proyecto."* | Alta | **Graves** | `'organizacional'` |
| 1 | *"La base de datos que se usa en el sistema no puede procesar tantas transacciones por segundo como se esperaba."* | Moderada | **Graves** | `'tecnologico'` |
| 12 | *"Se subestima el tiempo requerido para desarrollar el software."* | Alta | **Graves** | `'estimacion'` |

Con las estrategias de gestión correspondientes (Fig. 22.5, p. 601):

| Riesgo | Estrategia de Sommerville | Tipo en sistema |
|---|---|---|
| Problemas financieros | *"Prepare un documento informativo para altos ejecutivos en el que muestre cómo el proyecto realiza una aportación muy importante a las metas de la empresa."* | `'contingencia'` |
| Problemas de reclutamiento | *"Alerte al cliente de dificultades potenciales y de la posibilidad de demoras; investigue la compra de componentes."* | `'minimizar'` |
| Enfermedad del personal | *"Reorganice los equipos de manera que haya más traslape de trabajo."* | `'minimizar'` |
| Componentes defectuosos | *"Sustituya los componentes potencialmente defectuosos con la compra de componentes de conocida fiabilidad."* | `'evitar'` |
| Cambios de requerimientos | *"Obtenga información de seguimiento para valorar el efecto de cambiar los requerimientos; maximice la información que se oculta en el diseño."* | `'minimizar'` |
| Reestructuración | *"Prepare un documento informativo para altos ejecutivos en el que muestre cómo el proyecto realiza una aportación muy importante a las metas de la empresa."* | `'contingencia'` |
| Rendimiento de la base de datos | *"Investigue la posibilidad de comprar una base de datos de mayor rendimiento."* | `'evitar'` |
| Subestimación del tiempo | *"Investigue los componentes comprados; indague el uso de un generador de programa."* | `'minimizar'` |

**Aplicación en el sistema:** Esta lista se usa como **catálogo inicial de riesgos predefinidos** en M2. Al crear un proyecto, el sistema puede pre-poblar el registro de riesgos con los ítems de esta lista que el evaluador considere aplicables, acelerando el proceso de identificación de riesgos.

---

## 5. Plantilla Operativa: Evaluación de Factibilidad (M1)

Esta plantilla se completa **al registrar una Entidad nueva en el Módulo 1**. El resultado determina el valor inicial de `nivelRiesgoEntidad`.

**Base teórica:** Las tres preguntas de factibilidad de Sommerville (Cap. 4 §4.5, p. 100) y los seis tipos de riesgo (Cap. 22 §22.1.1, p. 598).

### 5.1 Formulario de Evaluación

| # | Dimensión | Pregunta de evaluación | Respuesta posible | Peso | Cuenta como riesgo si |
|---|---|---|---|---|---|
| 1 | **Técnica** | ¿La entidad tiene sistemas existentes documentados con los que habría que integrarse? | `Sí` / `Parcial` / `No` | 10% | `No` o `Parcial` |
| 2 | **Técnica** | ¿La entidad ha ejecutado proyectos de software o digitalización previamente? | `Sí` / `No` | 15% | `No` |
| 3 | **Técnica** | ¿La entidad cuenta con infraestructura tecnológica mínima (servidores, dispositivos, conectividad)? | `Sí` / `Parcial` / `No` | 10% | `No` o `Parcial` |
| 4 | **Técnica** | ¿Los procesos de negocio de la entidad que el sistema afectará están documentados? | `Sí` / `Parcial` / `No` | 5% | `No` o `Parcial` |
| 5 | **Económica** | ¿La entidad tiene presupuesto definido y aprobado para el proyecto? | `Sí` / `En proceso` / `No` | 20% | `No` o `En proceso` |
| 6 | **Económica** | ¿Los decisores financieros (quienes aprueban el gasto) son accesibles para el equipo? | `Sí` / `No` | 10% | `No` |
| 7 | **Económica** | ¿La entidad tiene presupuesto contemplado para operación y mantenimiento post-entrega? | `Sí` / `Parcial` / `No` | 5% | `No` o `Parcial` |
| 8 | **Organizacional** | ¿Los stakeholders clave están identificados y tienen disponibilidad confirmada? | `Sí` / `Parcial` / `No` | 10% | `No` o `Parcial` |
| 9 | **Organizacional** | ¿Existe un patrocinador ejecutivo identificado con autoridad para tomar decisiones? | `Sí` / `No` | 10% | `No` |
| 10 | **Organizacional** | ¿La entidad tiene experiencia previa adoptando cambios organizacionales tecnológicos? | `Sí` / `Parcial` / `No` | 3% | `No` o `Parcial` |
| 11 | **Organizacional** | ¿El proyecto está alineado con los objetivos estratégicos declarados de la organización? | `Sí` / `No` / `Desconocido` | 2% | `No` o `Desconocido` |
| **Total** | | | | **100%** | |

### 5.2 Lógica de Cálculo del `nivelRiesgoEntidad`

El cálculo considera el **porcentaje ponderado de factores en riesgo** (es decir, la suma de los pesos de los ítems que "cuentan como riesgo"):

```
pesoEnRiesgo = suma(peso_i) para cada ítem i donde la respuesta activa la condición de riesgo

nivelRiesgoEntidad:
  - pesoEnRiesgo ∈ [0%, 30%]   → 'bajo'
  - pesoEnRiesgo ∈ (30%, 50%]  → 'medio'
  - pesoEnRiesgo ∈ (50%, 70%]  → 'alto'
  - pesoEnRiesgo ∈ (70%, 100%] → 'critico'
```

**Ejemplo:**
- Ítem 5 (Sin presupuesto): 20% en riesgo
- Ítem 2 (Sin experiencia en software): 15% en riesgo
- Ítem 9 (Sin patrocinador): 10% en riesgo
- Ítem 1 (Sistemas no documentados): 10% en riesgo
- **Total: 55% → `nivelRiesgoEntidad: 'alto'`**

### 5.3 Herencia de Riesgos hacia M2

Cuando se crea un proyecto para una entidad en M2, el sistema **hereda automáticamente** los ítems en riesgo de la evaluación M1 como riesgos iniciales del proyecto:

| Ítem M1 en riesgo | Riesgo inicial en M2 | `tipo` | `probabilidad` sugerida | `impacto` sugerido | `estrategia` sugerida |
|---|---|---|---|---|---|
| Ítem 1: Sin sistemas documentados | Integración con sistemas legados desconocidos | `'tecnologico'` | `'alta'` | `'alto'` | `'evitar'` |
| Ítem 2: Sin experiencia en software | Resistencia y errores en implementación | `'organizacional'` | `'media'` | `'medio'` | `'minimizar'` |
| Ítem 3: Sin infraestructura mínima | Bloqueo técnico por falta de hardware/red | `'tecnologico'` | `'alta'` | `'muy_alto'` | `'evitar'` |
| Ítem 5: Sin presupuesto aprobado | Cancelación o reducción del proyecto | `'organizacional'` | `'media'` | `'muy_alto'` | `'contingencia'` |
| Ítem 6: Decisores inaccesibles | Demoras en aprobación de decisiones | `'organizacional'` | `'alta'` | `'alto'` | `'minimizar'` |
| Ítem 8: Stakeholders no disponibles | Adquisición de requerimientos incompleta | `'requerimientos'` | `'alta'` | `'alto'` | `'minimizar'` |
| Ítem 9: Sin patrocinador ejecutivo | Proyecto sin apoyo ejecutivo ante conflictos | `'organizacional'` | `'media'` | `'muy_alto'` | `'contingencia'` |

---

## 6. Plantilla Operativa: Registro de Riesgo (M2)

Esta plantilla define la estructura completa de un ítem del registro de riesgos que se usa en el Módulo 2 al crear o gestionar un proyecto. Mapea exactamente al tipo `RiesgoProyecto` del sistema.

### 6.1 Esquema del Registro

| Campo | Tipo TypeScript | Valores permitidos | Justificación Sommerville |
|---|---|---|---|
| `id` | `string` | UUID v4 | Identificación única del riesgo para trazabilidad |
| `descripcion` | `string` | Texto libre (ej: *"La base de datos no puede procesar tantas transacciones"*) | *"Enunciado del riesgo"* — Cap. 22 §22.1, p. 596 |
| `tipo` | `enum` | `'tecnologico'` \| `'personas'` \| `'organizacional'` \| `'requerimientos'` \| `'estimacion'` | Fig. 22.3 — Seis tipos de riesgo del libro (herramientas consolidadas en tecnológico) |
| `probabilidad` | `enum` | `'muy_baja'` \| `'baja'` \| `'media'` \| `'alta'` \| `'muy_alta'` | Escala de análisis §22.1.2, p. 599 |
| `impacto` | `enum` | `'muy_bajo'` \| `'bajo'` \| `'medio'` \| `'alto'` \| `'muy_alto'` | Escala de efectos §22.1.2, p. 599 |
| `estrategia` | `enum` | `'evitar'` \| `'minimizar'` \| `'contingencia'` \| `'aceptar'` | Tres estrategias §22.1.3, p. 601 + aceptación implícita |
| `mitigacion` | `string` | Texto libre (ej: *"Sustituir componente por alternativa de fiabilidad probada"*) | *"Plan de contingencia"* — §22.1.3, p. 601 |
| `responsable` | `string` | Nombre o rol (ej: `"Tech Lead"`, `"Project Manager"`) | *"Monitorización del riesgo"* — §22.1.4, p. 602 |
| `estado` | `enum` | `'activo'` \| `'mitigado'` \| `'ocurrido'` \| `'cerrado'` | *"Proceso iterativo que continúa a lo largo del proyecto"* — §22.1, p. 597 |
| `fechaIdentificacion` | `string` | ISO 8601 date | Trazabilidad del proceso iterativo |
| `fechaRevision` | `string` | ISO 8601 date | Frecuencia de revisión en cada iteración — §22.1.4, p. 602 |

### 6.2 Ejemplo de Registro Completo

```typescript
const riesgoEjemplo: RiesgoProyecto & {
  id: string;
  descripcion: string;
  mitigacion: string;
  responsable: string;
  estado: 'activo' | 'mitigado' | 'ocurrido' | 'cerrado';
  fechaIdentificacion: string;
  fechaRevision: string;
} = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  descripcion: "El personal clave del cliente no está disponible para sesiones de levantamiento de requerimientos durante el primer mes del proyecto.",
  tipo: "personas",
  probabilidad: "alta",
  impacto: "alto",
  estrategia: "minimizar",
  mitigacion: "Reorganizar el calendario de sesiones de adquisición de requerimientos para adaptarse a la disponibilidad del cliente. Documentar cada sesión con minutas aprobadas para evitar retrabajo.",
  responsable: "Project Manager",
  estado: "activo",
  fechaIdentificacion: "2026-02-24",
  fechaRevision: "2026-03-10"
}
```

---

## 7. Matriz de Riesgo Operativa

Combinación de los valores exactos de los enums `probabilidad` e `impacto` del tipo `RiesgoProyecto`, consistente con la lógica de Sommerville (Cap. 22 §22.1.2, p. 599):

> *"En general, los riesgos catastróficos deben considerarse siempre, así como los riesgos graves con más de una probabilidad moderada de ocurrencia."*

| Probabilidad ↓ / Impacto → | `muy_bajo` | `bajo` | `medio` | `alto` | `muy_alto` |
|---|---|---|---|---|---|
| **`muy_alta`** | 🟡 Medio | 🟠 Alto | 🟠 Alto | 🔴 Crítico | 🔴 Crítico |
| **`alta`** | 🟢 Bajo | 🟡 Medio | 🟠 Alto | 🟠 Alto | 🔴 Crítico |
| **`media`** | 🟢 Bajo | 🟢 Bajo | 🟡 Medio | 🟠 Alto | 🟠 Alto |
| **`baja`** | 🟢 Bajo | 🟢 Bajo | 🟢 Bajo | 🟡 Medio | 🟠 Alto |
| **`muy_baja`** | 🟢 Bajo | 🟢 Bajo | 🟢 Bajo | 🟢 Bajo | 🟡 Medio |

**Leyenda y estrategia recomendada:**

| Nivel | Color | Estrategia recomendada por Sommerville |
|---|---|---|
| 🟢 **Bajo** | Verde | `'aceptar'` — monitorizar sin acción inmediata |
| 🟡 **Medio** | Amarillo | `'minimizar'` — reducir efectos mediante diseño organizativo |
| 🟠 **Alto** | Naranja | `'evitar'` o `'minimizar'` — acción preventiva prioritaria |
| 🔴 **Crítico** | Rojo | `'evitar'` con plan de `'contingencia'` — atención inmediata del administrador del proyecto |

**Validación con Sommerville:** La matriz es consistente con el principio del libro: los riesgos de impacto catastrófico (`muy_alto`) se escalan a Crítico incluso con probabilidad moderada, y los riesgos de impacto grave (`alto`) se consideran prioritarios con probabilidad moderada o superior.

---

## 8. Tabla de Conexiones con los 3 Módulos

| Concepto de Sommerville | Fuente | Módulo donde aplica | Campo o proceso específico |
|---|---|---|---|
| Estudio de factibilidad | Cap. 4 §4.5, p. 100 | **M1** y **M2** | Formulario de evaluación previa al SRS |
| Tres preguntas de factibilidad | Cap. 4 §4.5, p. 100 | **M1** (evaluación entidad) / **M2** (evaluación proyecto) | Dimensiones: técnica, económica, organizacional |
| `nivelRiesgoEntidad` | Cap. 4 §4.5 + Cap. 22 §22.1 | **M1** | Campo `nivelRiesgo` de la Entidad |
| Seis tipos de riesgo | Fig. 22.3, Cap. 22 §22.1.1, p. 598 | **M2** | `RiesgoProyecto.tipo` |
| Escala de probabilidad (5 niveles) | Cap. 22 §22.1.2, p. 599 | **M2** | `RiesgoProyecto.probabilidad` |
| Escala de impacto (4→5 niveles) | Cap. 22 §22.1.2, p. 599 | **M2** | `RiesgoProyecto.impacto` |
| Tres estrategias de mitigación | Cap. 22 §22.1.3, p. 601 | **M2** | `RiesgoProyecto.estrategia` |
| Monitorización continua del riesgo | Cap. 22 §22.1.4, p. 602 | **M2** | `RiesgoProyecto.estado` + `fechaRevision` |
| Indicadores de riesgo por tipo | Fig. 22.6, Cap. 22 §22.1.4, p. 602 | **M2** | Alertas del sistema al detectar indicadores |
| Herencia de riesgos M1→M2 | Cap. 22 §22.1.1 (listas de comprobación) | **M1 → M2** | Pre-población del registro de riesgos en M2 desde la evaluación M1 |
| Factibilidad como precondición del SRS | Cap. 4 §4.4, p. 99 | **M2 → M3** | El módulo 3 (SRS) solo se habilita si la evaluación de factibilidad está completa en M2 |

---

## 9. Checklist de Completitud

### Conceptos del Libro Extraídos

- [x] Definición formal del estudio de factibilidad (Cap. 4 §4.5, p. 100)
- [x] Las tres preguntas fundamentales del estudio de factibilidad (Cap. 4 §4.5, p. 100)
- [x] El estudio de factibilidad como actividad previa a la IR, no parte de ella (Cap. 4 §4.4, p. 99)
- [x] Factibilidad técnica (Cap. 4 §4.5)
- [x] Factibilidad económica (Cap. 4 §4.5)
- [x] Factibilidad organizacional (Cap. 4 §4.5)
- [x] Definición de riesgo (Cap. 22 §22.1, p. 596)
- [x] Tres categorías de riesgo: proyecto, producto, empresa (Cap. 22 §22.1, p. 596)
- [x] Por qué la gestión del riesgo es continua (Cap. 22 §22.1, p. 596–597)
- [x] Seis tipos de riesgo con todos sus ejemplos (Fig. 22.3, Cap. 22 §22.1.1, p. 598–599)
- [x] Riesgos comunes de proyecto/producto/empresa (Fig. 22.1, Cap. 22 §22.1, p. 597)
- [x] Las cuatro etapas del proceso de gestión del riesgo (Fig. 22.2, Cap. 22 §22.1, p. 597)
- [x] Escala de probabilidad de 5 niveles (Cap. 22 §22.1.2, p. 599)
- [x] Escala de efectos de 4 niveles y su mapeo a 5 niveles del sistema (Cap. 22 §22.1.2, p. 599)
- [x] Tabla de riesgos priorizados con probabilidad y efectos (Fig. 22.4, Cap. 22 §22.1.2, p. 600)
- [x] Tres estrategias de mitigación con definiciones exactas (Cap. 22 §22.1.3, p. 601)
- [x] Estrategias de gestión para los 8 riesgos principales (Fig. 22.5, Cap. 22 §22.1.3, p. 601)
- [x] Indicadores de riesgo por tipo para monitorización (Fig. 22.6, Cap. 22 §22.1.4, p. 602)
- [x] Frecuencia de revisión recomendada (Cap. 22 §22.1.4, p. 602)

### Entregables Operativos

- [x] **Sección 5**: Formulario completo de evaluación de factibilidad para M1 (11 ítems ponderados)
- [x] **Sección 5.2**: Lógica de cálculo del `nivelRiesgoEntidad` con umbrales exactos
- [x] **Sección 5.3**: Tabla de herencia de riesgos M1 → M2
- [x] **Sección 6**: Plantilla completa del registro de riesgo para M2 con mapeo al tipo `RiesgoProyecto`
- [x] **Sección 6.2**: Ejemplo de registro completo con todos los campos
- [x] **Sección 7**: Matriz de riesgo operativa 5×5 (probabilidad × impacto) con estrategias recomendadas
- [x] **Sección 8**: Tabla completa de conexiones con los 3 módulos
- [x] Coherencia entre `NivelRiesgoEntidad` enum (`bajo` | `medio` | `alto` | `critico`) y umbrales de cálculo
- [x] Coherencia entre `RiesgoProyecto.probabilidad` y escala de Sommerville (5 niveles)
- [x] Coherencia entre `RiesgoProyecto.impacto` y escala de Sommerville (4→5 niveles)
- [x] Coherencia entre `RiesgoProyecto.estrategia` y las estrategias de Sommerville
- [x] Conexión explícita M1 → M2 mediante herencia de riesgos
- [x] Restricción M2 → M3: factibilidad aprobada como precondición del SRS

---

*Documento generado a partir de: Sommerville, I. (2011). Ingeniería de Software, 9.ª edición. Pearson Educación. Fuentes: Cap. 4 §4.4 (p. 99), §4.5 (p. 100–103); Cap. 22 §22.1 (p. 594–602).*
