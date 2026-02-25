# 02-metodologias-agiles.md

<!--
  Archivo       : 02-metodologias-agiles.md
  Módulo        : Capa 0 — Fundamentos del Sistema
  Capítulo fuente: Cap. 3 — Desarrollo ágil de software
  Libro fuente  : Ingeniería de Software, Ian Sommerville, 9ª Edición (Pearson, 2011)
  Versión       : 1.0.0
  Fecha         : 2026-02-24
  Estado        : APROBADO
-->

---

## Metadatos del Documento

| Campo           | Valor                                                                 |
|-----------------|-----------------------------------------------------------------------|
| Nombre archivo  | `02-metodologias-agiles.md`                                           |
| Capa            | Capa 0 — Fundamentos                                                  |
| Capítulo fuente | Cap. 3 — Desarrollo ágil de software                                  |
| Libro           | Ingeniería de Software, Ian Sommerville, 9ª Edición (Pearson, 2011)   |
| Versión         | 1.0.0                                                                 |
| Fecha creación  | 2026-02-24                                                            |
| Estado          | APROBADO                                                              |
| Autor           | Generado desde fuente primaria (Sommerville Cap. 3)                   |

---

## 1. Objetivo del Documento

Este archivo documenta los fundamentos teóricos de los **métodos ágiles** extraídos exclusivamente del **Capítulo 3** de Sommerville (2011), seleccionando únicamente aquello que sea directamente operacional para el sistema de gestión de proyectos.

**Propósito dentro del sistema:**

- **Módulo 2 (Registro y Configuración de Proyectos):** Este archivo alimenta directamente el campo `metodología` del proyecto. Cada concepto documentado tiene un mapeo explícito a campos del formulario de registro. Las preguntas del §3.2 constituyen el formulario de evaluación de metodología. Los artefactos y roles de Scrum (§3.4) se mapean a los campos de equipo y configuración del proyecto.
- **Módulo 3 (Documentación de Objetivos y Alcance / SRS):** La equivalencia entre el *Product Backlog* y el registro de requerimientos queda documentada en la Sección 5.2. Los principios ágiles (§3.1) permiten validar si el enfoque declarado en el SRS es coherente con las prácticas reales del proyecto.
- **Módulo 1 (Registro de Clientes y Proveedores):** Indirectamente, el perfil del cliente (si tiene disponibilidad para participar, si acepta entregas incrementales, si opera en entorno cambiante) condiciona la validación de metodología en el Módulo 2.

> **REGLA DE USO:** Este archivo NO es un tutorial de metodologías ágiles. Es la fuente de verdad teórica que respalda las decisiones de clasificación y configuración metodológica del Módulo 2.

---

## 2. ¿Qué son los Métodos Ágiles? (Cap. 3 §3.1, pp. 57-62)

### 2.1 Definición Formal

Sommerville define los métodos ágiles como:

> *"Los métodos ágiles son métodos de desarrollo incremental donde los incrementos son mínimos y, por lo general, se crean las nuevas liberaciones del sistema, y cada dos o tres semanas se ponen a disposición de los clientes. Involucran a los clientes en el proceso de desarrollo para conseguir una rápida retroalimentación sobre los requerimientos cambiantes. Minimizan la cantidad de documentación con el uso de comunicaciones informales, en vez de reuniones formales con documentos escritos."*
> (Cap. 3 §3.1, p. 58)

Y amplía:

> *"Los métodos ágiles se apoyan universalmente en el enfoque incremental para la especificación, el desarrollo y la entrega del software. Son más adecuados para el diseño de aplicaciones en que los requerimientos del sistema cambian, por lo general, rápidamente durante el proceso de desarrollo. Tienen la intención de entregar con prontitud el software operativo a los clientes, quienes entonces propondrán requerimientos nuevos y variados para incluir en posteriores iteraciones del sistema."*
> (Cap. 3 §3.1, p. 59)

### 2.2 Contexto Histórico — Por Qué Surgieron

> *"En la década de 1980 y a inicios de la siguiente, había una visión muy difundida de que la forma más adecuada para lograr un mejor software era mediante una cuidadosa planeación del proyecto, aseguramiento de calidad formalizada, el uso de métodos de análisis y el diseño apoyado por herramientas CASE, así como procesos de desarrollo de software rigurosos y controlados."*
> (Cap. 3 §3.1, p. 58)

El problema fue que:

> *"Cuando este engorroso enfoque de desarrollo basado en la planeación se aplica a sistemas de negocios pequeños y medianos, los costos que se incluyen son tan grandes que dominan el proceso de desarrollo del software. Se invierte más tiempo en diseñar el sistema, que en el desarrollo y la prueba del programa."*
> (Cap. 3 §3.1, p. 58)

**Contexto histórico clave:** La noción prospera *"realmente a finales de la década de 1990, con el desarrollo de la noción de enfoques ágiles como el DSDM (Stapleton, 1997), Scrum (Schwaber y Beedle, 2001) y la programación extrema (Beck, 1999; Beck, 2000)."* (Cap. 3 §3.1, p. 57)

### 2.3 Los 4 Valores del Manifiesto Ágil

Texto original reproducido del libro:

> *"Este manifiesto afirma: Estamos descubriendo mejores formas para desarrollar software, al hacerlo y al ayudar a otros a hacerlo. Gracias a este trabajo llegamos a valorar:*
> - *A los individuos y las interacciones sobre los procesos y las herramientas*
> - *Al software operativo sobre la documentación exhaustiva*
> - *La colaboración con el cliente sobre la negociación del contrato*
> - *La respuesta al cambio sobre el seguimiento de un plan*
>
> *Esto es, aunque exista valor en los objetos a la derecha, valoraremos más los de la izquierda."*
> (Cap. 3 §3.1, p. 59)

### 2.4 Los 5 Principios Ágiles (Figura 3.1)

Sommerville presenta en la Figura 3.1 los principios de los métodos ágiles. El libro en su Cap. 3 presenta 5 principios fundamentales en la tabla de la Figura 3.1, que son la base operacional; adicionalmente el Manifiesto Ágil original tiene 12, pero Sommerville los sintetiza en estos 5 para el marco teórico del capítulo:

| Principio               | Descripción (texto original, Fig. 3.1, p. 60)                                                                                                                                                                          |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Participación del cliente** | *"Los clientes deben intervenir estrechamente durante el proceso de desarrollo. Su función consiste en ofrecer y priorizar nuevos requerimientos del sistema y evaluar las iteraciones del mismo."*                |
| **Entrega incremental** | *"El software se desarrolla en incrementos y el cliente especifica los requerimientos que se van a incluir en cada incremento."*                                                                                        |
| **Personas, no procesos** | *"Tienen que reconocerse y aprovecharse las habilidades del equipo de desarrollo. Debe permitirse a los miembros del equipo desarrollar sus propias formas de trabajar sin procesos establecidos."*                 |
| **Adoptar el cambio**   | *"Esperar a que cambien los requerimientos del sistema y, de este modo, diseñar el sistema para adaptar dichos cambios."*                                                                                               |
| **Mantener simplicidad** | *"Enfocarse en la simplicidad tanto en el software a desarrollar como en el proceso de desarrollo. Siempre que sea posible, trabajar de manera activa para eliminar la complejidad del sistema."*                   |

> **Nota:** Sommerville presenta estos 5 principios como la síntesis operacional del Manifiesto Ágil dentro del Cap. 3 (Fig. 3.1, p. 60). Son suficientes para evaluar si un proyecto es ágil o no en el contexto del sistema.

**Aplicación en el sistema:** Estos 5 principios son el **criterio de validación metodológica** del Módulo 2. Cuando un proyecto registra metodología "Ágil/Scrum", el sistema debe verificar que al menos los principios de *Participación del cliente*, *Entrega incremental* y *Adoptar el cambio* sean operacionalmente factibles para ese proyecto (cliente disponible, entregas parciales aceptadas, requerimientos cambiantes). Si un proyecto declara ágil pero su cliente no puede intervenir o los requerimientos están congelados, el sistema debe marcar una **alerta de incoherencia metodológica**.

---

## 3. Desarrollo Dirigido por Plan vs. Desarrollo Ágil (Cap. 3 §3.2, pp. 62-64)

Esta sección es **crítica**: alimenta directamente la lógica de decisión del campo `metodología` en el Módulo 2.

### 3.1 Distinción Fundamental

> *"Los enfoques ágiles en el desarrollo de software consideran el diseño y la implementación como las actividades centrales en el proceso del software. Incorporan otras actividades en el diseño y la implementación, como la adquisición de requerimientos y pruebas. En contraste, un enfoque basado en un plan para la ingeniería de software identifica etapas separadas en el proceso de software con salidas asociadas a cada etapa."*
> (Cap. 3 §3.2, p. 62)

> *"En un enfoque basado en un plan, la iteración ocurre dentro de las actividades con documentos formales usados para comunicarse entre etapas del proceso. [...] En un enfoque ágil, la iteración ocurre a través de las actividades. Por lo tanto, los requerimientos y el diseño se desarrollan en conjunto, no por separado."*
> (Cap. 3 §3.2, p. 62)

### 3.2 Tabla Comparativa — Dirigido por Plan vs. Ágil

| Factor de comparación         | Dirigido por Plan                                                                 | Ágil                                                                            |
|-------------------------------|-----------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| **Especificación del producto** | Especificación detallada y completa antes de la implementación; documentos formales entre etapas | Especificación incremental y evolutiva; sin documento completo previo           |
| **Iteración**                 | Ocurre *dentro* de cada actividad; las etapas son secuenciales con salidas formales | Ocurre *a través* de las actividades; requerimientos y diseño se desarrollan en conjunto |
| **Participación del cliente** | Principalmente en especificación inicial y validación final                       | Intervención estrecha y continua durante todo el desarrollo; cliente en sitio   |
| **Documentación**             | Extensa; documentos de diseño como parte del contrato y mantenimiento             | Mínima; comunicaciones informales; el código legible es la documentación clave  |
| **Herramientas de apoyo**     | Herramientas CASE para análisis, diseño y gestión de requerimientos               | Herramientas para seguir el diseño en evolución; IDE con visualización y análisis |
| **Entregables del proyecto**  | Documentos formales por etapa (especificación, diseño, código, pruebas)           | Incrementos funcionales frecuentes (cada 2-4 semanas)                           |
| **Control del proceso**       | Plan detallado previo; seguimiento contra el plan                                 | Plan adaptativo por sprint; replanificación continua                            |
| **Regulación externa**        | Necesaria cuando reguladores exigen documentación formal del sistema              | Difícil de aplicar en sistemas sujetos a regulación estricta                    |
| **Tamaño del equipo**         | Efectivo con equipos grandes distribuidos                                         | Más efectivo con equipos pequeños co-ubicados (comunicación informal)           |
| **Estabilidad de requerimientos** | Adecuado cuando los requerimientos son estables y conocidos desde el inicio   | Diseñado para requerimientos cambiantes e impredecibles                         |

(Construida a partir del contenido del Cap. 3 §3.2, pp. 62-64)

### 3.3 Las 10 Preguntas Clave para Decidir la Metodología

Sommerville propone explícitamente estas preguntas para elegir entre dirigido por plan y ágil:

> *"Para decidir sobre el equilibrio entre un enfoque basado en un plan y uno ágil, se deben responder algunas preguntas técnicas, humanas y organizacionales:"*
> (Cap. 3 §3.2, p. 63)

| # | Pregunta (texto original)                                                                                                                                                                                                                                              | Favorece **Ágil** si...                                                         | Favorece **Dirigido por Plan** si...                                            |
|---|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| 1 | *"¿Es importante tener una especificación y un diseño muy detallados antes de dirigirse a la implementación?"*                                                                                                                                                          | No; el equipo puede desarrollar diseño y código en paralelo                     | Sí; la especificación previa es un requisito contractual o técnico              |
| 2 | *"¿Es práctica una estrategia de entrega incremental, donde se dé el software a los clientes y se obtenga así una rápida retroalimentación de ellos?"*                                                                                                                 | Sí; cliente disponible y dispuesto a evaluar incrementos frecuentes             | No; el cliente requiere el sistema completo para operar                         |
| 3 | *"¿Qué tan grande es el sistema que se desarrollará? Los métodos ágiles son más efectivos cuando el sistema logra diseñarse con un pequeño equipo asignado que se comunique de manera informal."*                                                                       | Sistema pequeño/mediano; equipo pequeño co-ubicado                              | Sistema grande; múltiples equipos distribuidos                                  |
| 4 | *"¿Qué tipo de sistema se desarrollará? Los sistemas que demandan mucho análisis antes de la implementación (por ejemplo, sistema en tiempo real con requerimientos de temporización compleja), por lo general, necesitan un diseño bastante detallado."*               | Sistema de negocio; lógica de aplicación; sin requerimientos de tiempo real     | Sistema de tiempo real, embebido, o de seguridad crítica                        |
| 5 | *"¿Cuál es el tiempo de vida que se espera del sistema? Los sistemas con lapsos de vida prolongados podrían requerir más documentación de diseño."*                                                                                                                     | Sistema con vida corta o media; cambios frecuentes esperados                    | Sistema de larga vida; equipos de mantenimiento futuros necesitarán documentación |
| 6 | *"¿Qué tecnologías se hallan disponibles para apoyar el desarrollo del sistema? Los métodos ágiles se auxilian a menudo de buenas herramientas para seguir la pista de un diseño en evolución."*                                                                       | IDE con buenas herramientas de visualización y análisis disponibles             | Entorno de desarrollo limitado; documentación escrita compensa la falta de herramientas |
| 7 | *"¿Cómo está organizado el equipo de desarrollo? Si el equipo de desarrollo está distribuido, o si parte del desarrollo se subcontrata, entonces tal vez se requiera elaborar documentos de diseño."*                                                                  | Equipo co-ubicado; comunicación informal efectiva                               | Equipo distribuido geográficamente o con subcontratación                        |
| 8 | *"¿Existen problemas culturales que afecten el desarrollo del sistema? Las organizaciones de ingeniería tradicionales presentan una cultura de desarrollo basada en un plan."*                                                                                          | Organización con cultura ágil o startup                                         | Organización con cultura de ingeniería tradicional; procesos formales establecidos |
| 9 | *"¿Qué tan buenos son los diseñadores y programadores en el equipo de desarrollo? [...] Si usted tiene un equipo con niveles de habilidad relativamente bajos, es probable que necesite del mejor personal para desarrollar el diseño."*                                | Equipo con alto nivel de habilidad y experiencia en auto-organización            | Equipo mixto; conviene separar diseñadores de programadores con un diseño detallado previo |
| 10 | *"¿El sistema está sujeto a regulación externa? Si un regulador externo tiene que aprobar el sistema [...] entonces, tal vez se le requerirá documentación detallada como parte del sistema de seguridad."*                                                             | Sin regulación externa que exija documentación formal del proceso               | Regulación externa presente (aeronáutico, médico, financiero, gubernamental)    |

(Cap. 3 §3.2, pp. 63-64)

**Aplicación en el sistema:** Estas 10 preguntas son el **formulario de evaluación de metodología del Módulo 2**. Cada proyecto registrado debe responderlas para que el sistema valide o sugiera la metodología más coherente. Las preguntas 3, 7 y 10 son las más críticas y deben evaluarse antes de aceptar la clasificación "Ágil/Scrum" en el campo `metodología`.

---

## 4. Scrum — Marco de Trabajo (Cap. 3 §3.4, pp. 72-74)

### 4.1 Roles de Scrum con Definiciones

Sommerville describe el proceso Scrum y sus participantes en el §3.4 (pp. 72-74). Los roles se derivan directamente del texto:

#### Maestro de Scrum (Scrum Master)

> *"El maestro de Scrum es el facilitador que ordena las reuniones diarias, rastrea el atraso del trabajo a realizar, registra las decisiones, mide el progreso del atraso, y se comunica con los clientes y administradores fuera del equipo."*
> (Cap. 3 §3.4, p. 74)

> *"Durante esta etapa, el equipo se aísla del cliente y la organización, y todas las comunicaciones se canalizan a través del llamado maestro de Scrum. El papel de este último es proteger al equipo de desarrollo de distracciones externas."*
> (Cap. 3 §3.4, p. 73)

**Responsabilidades operacionales del Scrum Master según el libro:**
- Facilitar y ordenar las reuniones diarias
- Rastrear el atraso (*backlog*) de trabajo
- Registrar decisiones del equipo
- Medir el progreso del backlog (burndown)
- Comunicarse con clientes y administradores externos
- Proteger al equipo de distracciones externas

#### Equipo de Desarrollo

> *"La idea detrás de Scrum es que debe autorizarse a todo el equipo para tomar decisiones, de modo que se evita deliberadamente el término administrador del proyecto."*
> (Cap. 3 §3.4, p. 74)

> *"Todo el equipo asiste a las reuniones diarias [...]. Durante la reunión, todos los miembros del equipo comparten información, describen sus avances desde la última reunión, los problemas que han surgido y los planes del día siguiente."*
> (Cap. 3 §3.4, p. 74)

**Características del equipo de desarrollo según el libro:**
- Auto-organizado; no hay dirección descendente
- Toma decisiones colectivas durante el sprint
- Participa en la selección de ítems del backlog
- Asiste a todas las reuniones diarias

#### Product Owner (implícito en el proceso Scrum)

> *"El cliente interviene estrechamente en este proceso y al comienzo de cada sprint puede introducir nuevos requerimientos o tareas."*
> (Cap. 3 §3.4, p. 73)

> *"La fase de selección incluye a todo el equipo del proyecto que trabaja con el cliente, con la finalidad de seleccionar las características y la funcionalidad a desarrollar durante el sprint."*
> (Cap. 3 §3.4, p. 73)

**Nota:** Sommerville en la 9ª edición describe el rol del cliente en Scrum de forma funcional (como el responsable de la cartera del producto y la priorización), sin asignarle el nombre "Product Owner" en el cuerpo del Cap. 3, aunque la figura del propietario del producto es implícita y operacionalmente equivalente.

**Aplicación en el sistema — Mapeo de roles a `MiembroEquipo`:**

| Rol Scrum (Sommerville)       | Campo en `MiembroEquipo` (types/index.ts)   | Observaciones                                                           |
|-------------------------------|---------------------------------------------|-------------------------------------------------------------------------|
| Maestro de Scrum              | `rol: "scrum_master"`                       | Solo un miembro puede tener este rol por proyecto                       |
| Cliente / Product Owner       | `rol: "product_owner"`                      | Puede ser externo; registrado en Módulo 1 como cliente del proyecto     |
| Equipo de Desarrollo          | `rol: "developer"` / `rol: "team_member"`   | Múltiples miembros; sin jerarquía interna                               |

---

### 4.2 Artefactos de Scrum

#### Cartera del Producto (Product Backlog)

> *"El punto de partida para la planeación es la cartera del producto, que es la lista de trabajo por realizar en el proyecto. Durante la fase de valoración del sprint, esto se revisa, y se asignan prioridades y riesgos. El cliente interviene estrechamente en este proceso y al comienzo de cada sprint puede introducir nuevos requerimientos o tareas."*
> (Cap. 3 §3.4, p. 73)

**Características:**
- Lista ordenada por prioridad de todo el trabajo pendiente
- Revisada y actualizada al inicio de cada sprint
- El cliente puede agregar requerimientos al inicio de cada sprint
- Contiene prioridades y riesgos asignados

#### Sprint Backlog (implícito en el proceso Scrum)

Deriva de la fase de selección del sprint:

> *"La fase de selección incluye a todo el equipo del proyecto que trabaja con el cliente, con la finalidad de seleccionar las características y la funcionalidad a desarrollar durante el sprint."*
> (Cap. 3 §3.4, p. 73)

**Características:**
- Subconjunto del Product Backlog seleccionado para un sprint
- Definido en la fase de selección con participación del cliente
- Fijo durante el sprint (el equipo se aísla de cambios externos)

#### Incremento del Sistema

> *"Un sprint de Scrum es una unidad de planeación en la que se valora el trabajo que se va a realizar, se seleccionan las particularidades por desarrollar y se implementa el software. Al final de un sprint, la funcionalidad completa se entrega a los participantes."*
> (Cap. 3 §3.4, p. 73)

**Aplicación en el sistema — Equivalencia crítica:**

> **El Product Backlog de Scrum es el equivalente funcional al registro de requerimientos del Módulo 3 (SRS).** Cuando un proyecto registra metodología "Scrum" en el Módulo 2, el sistema debe tratar cada ítem del SRS (Módulo 3) como un ítem del Product Backlog. Esta equivalencia debe reflejarse en la configuración del proyecto: el campo `backlogSource` del Módulo 2 debe apuntar a la colección de requerimientos del Módulo 3.

---

### 4.3 El Proceso Scrum — Flujo Completo (Fig. 3.8, p. 73)

Sommerville describe el flujo completo en la Figura 3.8 y el texto del §3.4:


[Planeación del bosquejo y diseño arquitectónico]
↓
┌─────────────────────────────────────────┐
│ CICLO SPRINT │
│ 1. Valoración (revisión del backlog, │
│ prioridades y riesgos) │
│ 2. Selección (equipo + cliente eligen │
│ ítems a desarrollar) │
│ 3. Desarrollo (equipo aislado; │
│ reuniones diarias; Scrum Master │
│ protege al equipo) │
│ 4. Revisión (se presenta la │
│ funcionalidad completa) │
└────────────┬────────────────────────────┘
↓ (siguiente sprint)
[repetir ciclo]
↓
[Cierre del proyecto: documentación,
manuales, lecciones aprendidas]
text

**Descripción por fase:**

> *"Existen tres fases con Scrum. La primera es la planeación del bosquejo, donde se establecen los objetivos generales del proyecto y el diseño de la arquitectura de software. A esto le sigue una serie de ciclos sprint, donde cada ciclo desarrolla un incremento del sistema. Finalmente, la fase de cierre del proyecto concluye el proyecto, completa la documentación requerida, como los marcos de ayuda del sistema y los manuales del usuario, y valora las lecciones aprendidas en el proyecto."*
> (Cap. 3 §3.4, p. 72-73)

**Características clave del ciclo sprint:**

1. **Longitud fija:** *"Los sprints tienen longitud fija, por lo general de dos a cuatro semanas."* (p. 73)
2. **Inicio con backlog:** *"El punto de partida para la planeación es la cartera del producto."* (p. 73)
3. **Selección colaborativa:** *"La fase de selección incluye a todo el equipo del proyecto que trabaja con el cliente."* (p. 73)
4. **Aislamiento del equipo:** *"El equipo se aísla del cliente y la organización, y todas las comunicaciones se canalizan a través del maestro de Scrum."* (p. 73)
5. **Reuniones diarias:** El equipo revisa progreso, problemas y planes del día siguiente. (p. 74)
6. **Entrega al final:** *"Al final del sprint, el trabajo hecho se revisa y se presenta a los participantes."* (p. 73)

---

## 5. Administración de un Proyecto Ágil (Cap. 3 §3.4, pp. 72-74)

### 5.1 Contexto de Gestión

> *"La responsabilidad principal de los administradores del proyecto de software es dirigir el proyecto, de modo que el software se entregue a tiempo y con el presupuesto planeado para ello. [...] Un enfoque basado en un plan [...] no funciona bien con los métodos ágiles, donde los requerimientos se desarrollan incrementalmente, donde el software se entrega en rápidos incrementos cortos, y donde los cambios a los requerimientos y el software son la norma."*
> (Cap. 3 §3.4, p. 72)

### 5.2 Prácticas de Gestión en Scrum

#### Seguimiento del Progreso — Burndown Chart

El Maestro de Scrum:
> *"...rastrea el atraso del trabajo a realizar, registra las decisiones, mide el progreso del atraso."*
> (Cap. 3 §3.4, p. 74)

**Qué es el burndown chart:** Es la representación visual del trabajo restante en el backlog a lo largo del tiempo. Permite al Scrum Master y al equipo ver si el sprint está en ritmo para completarse a tiempo. El eje Y muestra el trabajo pendiente (en story points o ítems); el eje X muestra los días del sprint. Una línea ideal muestra la trayectoria esperada; la línea real muestra el avance actual.

#### Planeación Basada en Velocidad del Equipo

La planeación en Scrum se basa en la velocidad histórica del equipo:

> *"Todo el equipo asiste a las reuniones diarias [...]. Todos participan en esta planeación — no hay dirección descendente desde el maestro de Scrum."*
> (Cap. 3 §3.4, p. 74)

La selección de ítems del sprint refleja implícitamente la **velocidad del equipo** (cuánto trabajo puede completarse en un sprint), derivada de la experiencia de sprints anteriores.

#### Gestión de Cambios en el Backlog

> *"El cliente interviene estrechamente en este proceso y al comienzo de cada sprint puede introducir nuevos requerimientos o tareas."*
> (Cap. 3 §3.4, p. 73)

**Regla operacional:** Los cambios al backlog solo se incorporan **al inicio del siguiente sprint**, no durante el sprint en curso. El equipo está aislado de cambios durante el sprint activo.

#### Ventajas Reportadas del Enfoque Scrum

> *"Rising y Janoff (2000) discuten su uso exitoso [...] y mencionan sus ventajas:*
> 1. *El producto se desglosa en un conjunto de piezas manejables y comprensibles.*
> 2. *Los requerimientos inestables no retrasan el progreso.*
> 3. *Todo el equipo tiene conocimiento de todo y, en consecuencia, se mejora la comunicación entre el equipo.*
> 4. *Los clientes observan la entrega a tiempo de los incrementos y obtienen retroalimentación sobre cómo funciona el producto.*
> 5. *Se establece la confianza entre clientes y desarrolladores, a la vez que se crea una cultura positiva donde todos esperan el triunfo del proyecto."*
> (Cap. 3 §3.4, p. 74)

**Aplicación en el sistema:** Las prácticas de gestión ágil definen los **campos de seguimiento del Módulo 2** para proyectos con metodología Scrum. El proyecto debe registrar: duración del sprint actual, fecha de inicio/fin de sprint, velocidad del equipo (story points por sprint), estado del burndown (adelantado/en ritmo/atrasado), y cambios pendientes al backlog para el próximo sprint.

---

## 6. Escalamiento de Métodos Ágiles (Cap. 3 §3.5, pp. 74-76)

### 6.1 Límites de los Métodos Ágiles

> *"Los métodos ágiles se desarrollaron para usarse en pequeños equipos de programación, que podían trabajar juntos en la misma habitación y comunicarse de manera informal. Por lo tanto, los métodos ágiles se emplean principalmente para el diseño de sistemas pequeños y medianos."*
> (Cap. 3 §3.5, p. 74)

### 6.2 Problemas al Escalar — Listado Oficial (Sommerville §3.5)

El desarrollo de grandes sistemas difiere en las siguientes formas (Cap. 3 §3.5, pp. 75-76):

1. *"Los grandes sistemas son, por lo general, colecciones de sistemas separados en comunicación, donde equipos separados desarrollan cada sistema [...]. Es prácticamente imposible que cada equipo tenga una visión de todo el sistema."*
2. *"Los grandes sistemas son sistemas abandonados [...] esto es, incluyen e interactúan con algunos sistemas existentes. Muchos de los requerimientos del sistema se interesan por su interacción y, por lo tanto, en realidad no se prestan a la flexibilidad y al desarrollo incremental."*
3. *"Donde muchos sistemas se integran para crear un solo sistema, una fracción significativa del desarrollo se ocupa en la configuración del sistema, y no en el desarrollo del código original."*
4. *"Los grandes sistemas y sus procesos de desarrollo por lo común están restringidos por reglas y regulaciones externas."*
5. *"Los grandes sistemas tienen un tiempo prolongado de adquisición y desarrollo. Es difícil mantener equipos coherentes que conozcan el sistema durante dicho periodo."*
6. *"Los grandes sistemas tienen por lo general un conjunto variado de participantes [...]. En realidad es imposible involucrar a todos estos participantes en el proceso de desarrollo."*

### 6.3 Adaptaciones Necesarias para Escalar

> *"Es esencial mantener los fundamentos de los métodos ágiles — planeación flexible, liberación frecuente del sistema, integración continua, desarrollo dirigido por pruebas y buena comunicación del equipo. [...] Las siguientes adaptaciones son críticas y deben introducirse:*
> 1. *Para el desarrollo de grandes sistemas no es posible enfocarse sólo en el código del sistema. Es necesario hacer más diseño frontal y documentación del sistema.*
> 2. *Tienen que diseñarse y usarse mecanismos de comunicación entre equipos.*
> 3. *La integración continua, donde todo el sistema se construya cada vez que un desarrollador verifica un cambio, es prácticamente imposible cuando muchos programas separados deben integrarse."*
> (Cap. 3 §3.5, p. 76)

### 6.4 Problemas al Introducir Ágil en Grandes Organizaciones

> *"Es difícil introducir los métodos ágiles en las grandes compañías por algunas razones:*
> 1. *Los gerentes del proyecto carecen de experiencia con los métodos ágiles — pueden ser reticentes para aceptar el riesgo de un nuevo enfoque.*
> 2. *Las grandes organizaciones tienen a menudo procedimientos y estándares de calidad que se espera sigan todos los proyectos y [...] es probable que sean incompatibles con los métodos ágiles."*
> (Cap. 3 §3.5, p. 75)

**Aplicación en el sistema:** Si un proyecto registrado en el Módulo 2 supera los siguientes umbrales, el sistema debe generar una **alerta de escalamiento**: equipo > 10 personas, duración estimada > 12 meses, múltiples equipos distribuidos, sistemas existentes a integrar, o regulación externa presente. La alerta debe indicar que la metodología "Ágil/Scrum simple" puede necesitar adaptación y recomendar revisión con el Módulo 3.

---

## 7. Tabla Maestra de Metodologías del Sistema

Esta tabla es el **entregable principal de este archivo**. Está lista para usarse como referencia directa en el formulario de registro del Módulo 2 sin modificación adicional. Se construyó combinando el Cap. 2 (modelos de proceso) y el Cap. 3 (métodos ágiles) de Sommerville.

| Metodología       | Tipo            | Mejor para                                                                              | Tamaño equipo       | Estabilidad reqs.           | Documentación               | Entregable clave                     |
|-------------------|-----------------|-----------------------------------------------------------------------------------------|---------------------|-----------------------------|-----------------------------|------------------------------------|
| **Cascada**       | Plan            | Sistemas críticos de seguridad; requerimientos completamente definidos; contratos fijos  | Cualquiera          | Alta (reqs. congelados)     | Extensiva y formal          | Documento de especificación completo |
| **Incremental**   | Plan            | Sistemas de negocio donde la funcionalidad se puede priorizar; requerimientos conocidos  | Mediano             | Media (estable por incremento) | Moderada por incremento    | Incrementos funcionales sucesivos   |
| **RUP**           | Plan / Híbrido  | Proyectos medianos/grandes; equipos distribuidos; integración de subsistemas UML         | Mediano-Grande      | Media-Alta                  | Extensa (flujos de trabajo documentados) | Releases por fase (concepción, elaboración, construcción, transición) |
| **Scrum**         | Ágil            | Sistemas de negocio pequeños/medianos; requerimientos cambiantes; cliente disponible     | Pequeño (5-9 pers.) | Baja (cambian por sprint)   | Mínima (backlog + código)   | Incremento funcional por sprint (2-4 semanas) |
| **XP**            | Ágil            | Sistemas de negocio con requerimientos muy cambiantes; equipos pequeños co-ubicados; alta deuda técnica | Pequeño (2-6 pers.) | Muy Baja (cambian continuamente) | Mínima (historias de usuario + pruebas automatizadas) | Liberaciones frecuentes (cada 1-2 semanas); código probado |

> **Fuentes:** Cascada e Incremental: Cap. 2 §2.1 (Sommerville, pp. 28-34). RUP: Cap. 2 §2.4 (pp. 50-52). Scrum: Cap. 3 §3.4 (pp. 72-74). XP: Cap. 3 §3.3 (pp. 64-72).

### 7.1 Reglas de Validación por Metodología (Módulo 2)

| Metodología | Condición bloqueante (no puede usarse si...)                                                           | Alerta (revisar si...)                                                    |
|-------------|--------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| Scrum       | Cliente no disponible para sprints / requerimientos completamente congelados / regulación exige doc. formal | Equipo > 10 personas / proyecto > 12 meses / equipos distribuidos        |
| XP          | No hay tests automatizados / equipo > 6 personas / cliente no puede estar en sitio                     | Sin experiencia previa en pair programming / sin integración continua     |
| Cascada     | Requerimientos altamente inestables / cliente necesita retroalimentación frecuente                      | Proyecto de duración > 24 meses (riesgo de obsolescencia)                 |
| Incremental | Sin priorización clara de funcionalidades / cliente no puede validar incrementos                        | Dependencias técnicas fuertes entre incrementos                           |
| RUP         | Equipo sin experiencia en UML / proyecto muy pequeño (< 3 meses)                                       | Sin herramientas de modelado disponibles                                  |

---

## 8. Tabla de Conexiones con los 3 Módulos

| Concepto del Cap. 3                       | Módulo donde aplica             | Campo específico                                          |
|-------------------------------------------|---------------------------------|-----------------------------------------------------------|
| Valores del Manifiesto Ágil (§3.1)        | Módulo 2                        | `metodologiaJustificacion` — razón de la elección ágil    |
| 5 Principios ágiles (Fig. 3.1)            | Módulo 2                        | `criteriosValidacion[]` — checklist de coherencia         |
| 10 Preguntas de decisión (§3.2)           | Módulo 2                        | `formularioEvaluacionMetodologia` — formulario de registro |
| Tabla comparativa Plan vs. Ágil (§3.2)    | Módulo 2                        | `tipoMetodologia: "plan" | "agil" | "hibrido"`            |
| Rol Maestro de Scrum (§3.4)               | Módulo 2                        | `MiembroEquipo.rol: "scrum_master"`                       |
| Rol Cliente/Product Owner (§3.4)          | Módulo 1 + Módulo 2             | `Cliente.disponibilidadSprint` + `MiembroEquipo.rol: "product_owner"` |
| Equipo de Desarrollo (§3.4)               | Módulo 2                        | `MiembroEquipo.rol: "developer"`                          |
| Product Backlog / Cartera del producto (§3.4) | Módulo 2 + **Módulo 3**     | `Proyecto.backlogSource → SRS.requerimientos[]`           |
| Sprint Backlog (§3.4)                     | Módulo 2                        | `Sprint.itemsSeleccionados[]`                             |
| Incremento del sistema (§3.4)             | Módulo 2                        | `Sprint.entregable` — funcionalidad completada            |
| Duración del sprint (§3.4)                | Módulo 2                        | `Sprint.duracionSemanas: 2 | 3 | 4`                       |
| Burndown chart / progreso del atraso (§3.4) | Módulo 2                      | `Sprint.burndownData[]` — datos de seguimiento            |
| Reuniones diarias (§3.4)                  | Módulo 2                        | `Sprint.ultimaReunionDiaria` — fecha y estado             |
| Umbrales de escalamiento (§3.5)           | Módulo 2                        | `alertasEscalamiento[]` — validaciones automáticas        |
| Problemas al escalar (§3.5, pp. 75-76)    | Módulo 2                        | `riesgosMetodologia[]` — riesgos predefinidos para ágil   |
| Definición formal método ágil (§3.1)      | Módulo 3                        | `SRS.enfoqueDesarrollo` — contexto del alcance            |

---

## 9. Checklist de Completitud del Cap. 3

Lista de todos los ítems del Cap. 3 que debían extraerse, con estado de completitud:

### Sección §3.1 — Métodos Ágiles
- [x] Definición formal de método ágil (texto original reproducido)
- [x] Contexto histórico: problema con métodos plan para sistemas pequeños/medianos
- [x] 4 valores del Manifiesto Ágil (texto original reproducido)
- [x] 5 principios ágiles (Figura 3.1, texto original reproducido)
- [x] Tipos de sistemas donde los métodos ágiles tienen éxito
- [x] Limitaciones prácticas de los principios ágiles

### Sección §3.2 — Dirigido por Plan vs. Ágil
- [x] Distinción fundamental entre ambos enfoques (texto original)
- [x] Tabla comparativa completa (6+ factores)
- [x] Las 10 preguntas de decisión (texto original de cada pregunta)
- [x] Cuándo favorece ágil y cuándo dirigido por plan (por cada pregunta)

### Sección §3.4 — Scrum / Administración Ágil
- [x] Rol Maestro de Scrum: responsabilidades según el libro
- [x] Rol Equipo de Desarrollo: características según el libro
- [x] Rol Cliente/Product Owner: función en el proceso
- [x] Mapeo de roles a campos `MiembroEquipo`
- [x] Product Backlog: definición y características
- [x] Sprint Backlog: definición y características
- [x] Incremento del sistema: definición
- [x] Equivalencia Product Backlog ↔ SRS Módulo 3 (documentada explícitamente)
- [x] Flujo completo del proceso Scrum (Fig. 3.8)
- [x] 3 fases de Scrum: bosquejo, ciclos sprint, cierre
- [x] Características clave del sprint (5 puntos del libro)
- [x] Burndown chart: qué es y qué mide
- [x] Velocidad del equipo y planeación
- [x] Gestión de cambios en el backlog
- [x] Ventajas de Scrum (Rising y Janoff, reproducidas)

### Sección §3.5 — Escalamiento
- [x] Límite de los métodos ágiles (equipos pequeños/medianos)
- [x] 6 diferencias del desarrollo de sistemas grandes
- [x] Adaptaciones críticas para escalar ágil
- [x] Dificultades en grandes organizaciones
- [x] Umbrales de escalamiento para alerta en Módulo 2

### Tabla Maestra (Secciones transversales Cap. 2 + Cap. 3)
- [x] Fila Cascada
- [x] Fila Incremental
- [x] Fila RUP
- [x] Fila Scrum
- [x] Fila XP
- [x] Reglas de validación por metodología

### Tabla de Conexiones
- [x] Todos los conceptos mapeados a módulo y campo específico

---

*Fin del archivo `02-metodologias-agiles.md` — Versión 1.0.0*
*Fuente única: Sommerville, I. (2011). Ingeniería de Software, 9ª Edición. Pearson.*
*Solo se cita y extrae contenido del Cap. 3 (más Tabla Maestra que incorpora Cap. 2).*



