# M2-01-inicio-proyecto-planificacion.md

---

## Metadatos

| Campo            | Valor                                                                 |
|------------------|-----------------------------------------------------------------------|
| **Archivo**      | `M2-01-inicio-proyecto-planificacion.md`                             |
| **Módulo**       | Módulo 2 — Registro y Configuración de Proyectos                     |
| **Capítulos fuente** | Cap. 22 (§22.1, §22.2, §22.3) · Cap. 23 (§23.2, §23.3)         |
| **Libro**        | *Ingeniería de Software*, Ian Sommerville, 9ª ed. (Pearson, 2011)    |
| **Versión**      | 1.0.0                                                                 |
| **Fecha**        | 2026-02-24                                                            |
| **Estado**       | `aprobado`                                                            |

---

## Objetivo del Documento

Este archivo documenta el **marco teórico completo** que sustenta el Módulo 2 del sistema
de gestión de proyectos de software. Cubre todo el ciclo que recorre un proyecto desde que
una Entidad del Módulo 1 solicita iniciarlo, hasta que el proyecto queda en estado
`activo_en_definicion` y habilitado para iniciar el proceso SRS del Módulo 3.

### Flujo cubierto

```
Entidad (NIVEL ESTÁNDAR, M1-07)
    │
    ▼
[PASO 1] Datos básicos           → estado: 'borrador'
[PASO 2] Metodología             → metodología registrada y justificada
[PASO 3] Equipo                  → equipo[] asignado con roles
[PASO 4] Riesgos iniciales       → riesgos[] pre-poblados
[PASO 5] Calendarización         → fechas + hitos[]
[PASO 6] Presupuesto estimado    → presupuestoEstimado registrado
[PASO 7] Aprobación y activación → estado: 'activo_en_definicion'
    │
    ▼
Módulo 3 — SRS habilitado
```

### Artefactos que produce este proceso

| Artefacto                        | Tipo       | Criterio de aprobación                              |
|----------------------------------|------------|-----------------------------------------------------|
| Registro del proyecto            | Objeto `Proyecto` | Todos los campos obligatorios completos       |
| Registro de equipo               | `MiembroEquipo[]` | Mínimo 1 miembro con rol `PM` o `gestor`     |
| Registro inicial de riesgos      | `RiesgoProyecto[]` | Mínimo 3 riesgos registrados                |
| Calendario con hitos             | `fechaInicio` + `fechaFinEstimada` + `hitos[]` | Mínimo 3 hitos, fechaFin > fechaInicio |
| Presupuesto referencial          | `presupuestoEstimado` | Obligatorio si criticidad = `alta` o `critica` |
| Estado de activación             | `EstadoProyecto` | Aprobado por rol `gestor` o `admin`          |

---

## 3. ¿Qué es la Gestión de Proyectos de Software?

> **Fuente:** Cap. 22, introducción, p. 594

### Definición formal

Según Sommerville:

> *"La gestión de proyectos de software es una parte esencial de la ingeniería de software.
> Los proyectos necesitan administrarse porque la ingeniería de software profesional está
> sujeta siempre a restricciones organizacionales de presupuesto y fecha. El trabajo del
> administrador del proyecto es asegurarse de que el proyecto de software cumpla y supere
> tales restricciones, además de que entregue software de alta calidad."*
> (Cap. 22, p. 594)

Las **metas importantes** de la gestión para la mayoría de los proyectos son:

1. Entregar el software al cliente en el tiempo acordado.
2. Mantener costos dentro del presupuesto general.
3. Entregar software que cumpla con las expectativas del cliente.
4. Mantener un equipo de desarrollo óptimo y con buen funcionamiento.

### Por qué la gestión de software es distinta

Sommerville identifica tres diferencias estructurales que hacen la gestión de software
particularmente desafiante (Cap. 22, p. 594–595):

| Característica        | Descripción según Sommerville                                                                                                      |
|-----------------------|------------------------------------------------------------------------------------------------------------------------------------|
| **Intangibilidad**    | "El software es intangible. No se puede ver ni tocar. Los administradores de proyectos de software no pueden constatar el progreso con sólo observar el artefacto que se construye." |
| **Proyectos excepcionales** | "Los grandes proyectos de software se consideran en general diferentes en ciertas formas de los proyectos anteriores... los vertiginosos cambios tecnológicos en computadoras y comunicaciones pueden volver obsoleta la experiencia de un administrador." |
| **Variabilidad del proceso** | "Los procesos de software varían considerablemente de una organización a otra... no es posible predecir de manera confiable cuándo un proceso de software particular conducirá a problemas de desarrollo." |

### Actividades principales del administrador de proyecto

Sommerville enumera las siguientes actividades que la mayoría de los administradores
asumen en alguna etapa (Cap. 22, p. 594–595):

1. **Planeación del proyecto** — planificación, estimación y calendarización del desarrollo, asignación de tareas, monitoreo de avance y cumplimiento de estándares.
2. **Informes** — comunicar el avance a clientes y administradores de la compañía en múltiples niveles de detalle técnico y administrativo.
3. **Gestión del riesgo** — valorar los riesgos que pueden afectar el proyecto, monitorizarlos y emprender acciones cuando surjan problemas.
4. **Gestión de personal** — elegir a los integrantes del equipo y establecer formas de trabajo que conduzcan a un desempeño efectivo.
5. **Redactar propuestas** — escribir propuestas para obtener contratos de trabajo, incluyendo estimaciones de costo y calendarización.

> **Nota:** El libro menciona adicionalmente la *gestión de contratos* como responsabilidad
> implícita del administrador en el contexto de la negociación con clientes (Cap. 22, p. 622).

---

**Aplicación en el sistema:**
Las cinco actividades anteriores definen las secciones del formulario de creación de
proyecto en el Módulo 2. La *planeación* se implementa en los Pasos 2, 5 y 6;
los *informes* en los mecanismos de estado y hitos; la *gestión del riesgo* en el Paso 4;
la *gestión de personal* en el Paso 3; y la *redacción de propuestas* se refleja en los
campos de descripción y justificación de metodología.

---

## 4. Gestión del Riesgo en el Inicio del Proyecto

> **Fuente:** Cap. 22 §22.1, pp. 595–602

### Definición y propósito

> *"La gestión del riesgo implica anticipar riesgos que pudieran alterar el calendario del
> proyecto o la calidad del software a entregar, y posteriormente tomar acciones para evitar
> dichos riesgos."* (Cap. 22 §22.1, p. 595–596)

Un riesgo puede definirse como *"algo que es preferible que no ocurra"* (p. 596).

### Tres categorías de riesgo obligatorias al iniciar todo proyecto

Sommerville distingue tres categorías que deben identificarse desde el inicio (Cap. 22 §22.1, p. 596):

| Categoría              | Definición                                                                                     | Ejemplo típico                                 |
|------------------------|-----------------------------------------------------------------------------------------------|------------------------------------------------|
| **Riesgos del proyecto** | "Riesgos que alteran el calendario o los recursos del proyecto."                            | Renuncia de un diseador experimentado         |
| **Riesgos del producto** | "Riesgos que afectan la calidad o el rendimiento del software a desarrollar."               | Componente adquirido que no funciona como se esperaba |
| **Riesgos empresariales** | "Riesgos que afectan a la organización que desarrolla o adquiere el software."             | Competidor que introduce un nuevo producto     |

### Tipos de riesgo que deben chequearse al crear un proyecto

Sommerville recomienda usar una lista de verificación con **seis tipos** de riesgo
(Cap. 22 §22.1.1, p. 598):

| Tipo                   | Descripción                                                                                     |
|------------------------|-------------------------------------------------------------------------------------------------|
| **Riesgos tecnológicos** | Se derivan de las tecnologías de software o hardware usadas para desarrollar el sistema.      |
| **Riesgos personales**   | Se asocian con las personas en el equipo de desarrollo.                                       |
| **Riesgos organizacionales** | Se derivan del entorno organizacional donde se desarrolla el software.                   |
| **Riesgos de herramientas** | Resultan de las herramientas de software y otro software de soporte.                       |
| **Riesgos de requerimientos** | Proceden de cambios a los requerimientos del cliente y del proceso de gestionarlos.      |
| **Riesgos de estimación** | Surgen de las estimaciones administrativas de los recursos requeridos.                      |

### Lista mínima de riesgos que todo proyecto debe registrar al crearse

Basado en los riesgos comunes identificados por Sommerville (Cap. 22 §22.1, figura 22.1, p. 597):

| # | Riesgo                              | Categoría       | Probabilidad inicial | Efecto               |
|---|-------------------------------------|-----------------|----------------------|----------------------|
| R1 | Rotación de personal clave         | Proyecto        | Moderada             | Catastrófico / Grave |
| R2 | Cambio administrativo en la organización | Proyecto  | Baja                 | Grave                |
| R3 | Cambio de requerimientos           | Proyecto/Producto | Moderada            | Grave                |
| R4 | Subestimación del tamaño del sistema | Proyecto/Producto | Alta              | Tolerable            |
| R5 | Imposibilidad de reclutar personal con habilidades requeridas | Personal | Alta | Catastrófico |
| R6 | Cambio tecnológico                 | Empresarial     | Baja                 | Catastrófico         |

> *"Boehm (1988) recomienda identificar y monitorizar los 10 riesgos principales, pero
> considera que esta cifra es más bien arbitraria."* (Cap. 22 §22.1.2, p. 600)

### Herencia de riesgos desde la Entidad (M1 → M2)

Los riesgos registrados en el perfil de la Entidad cliente en el Módulo 1 se convierten
en riesgos iniciales del proyecto al momento de su creación. Esta herencia sigue la
lógica de Sommerville sobre los **riesgos empresariales**: si la organización cliente
tiene fragilidad financiera, inestabilidad estructural o historial de cambios de
requerimientos, estos factores deben trasladarse automáticamente al registro de riesgos
del proyecto nuevo.

### Cuándo un nivel de riesgo inicial impide activar el proyecto

Siguiendo el esquema de Sommerville (Cap. 22 §22.1.2, p. 599), los efectos se clasifican en:

- **Catastrófico** — amenaza la supervivencia del proyecto → **requiere escalamiento**: el proyecto no puede activarse sin aprobación explícita del nivel `admin` y un plan de mitigación documentado.
- **Grave** — causaría grandes demoras → **requiere revisión**: el PM debe registrar estrategia de mitigación antes de activar.
- **Tolerable** — demoras dentro de la contingencia permitida → puede activarse con riesgo registrado.
- **Insignificante** → puede activarse sin restricción adicional.

---

**Aplicación en el sistema:**
Al crear un proyecto, el sistema pre-poblará el array `riesgos[]` con (a) los riesgos
heredados de la Entidad cliente según su perfil en M1, y (b) los 6 riesgos mínimos
obligatorios de la tabla anterior. Si algún riesgo heredado tiene efecto `Catastrófico`,
el sistema bloqueará la activación hasta que un usuario con rol `admin` lo apruebe
explícitamente.

---

## 5. Gestión de Personal

> **Fuente:** Cap. 22 §22.2, pp. 602–606

> *"Las personas que trabajan en una organización de software son los activos más importantes.
> Cuesta mucho dinero reclutar y retener al buen personal, así que depende de los
> administradores de software garantizar que la organización obtenga el mejor aprovechamiento
> posible por su inversión."* (Cap. 22 §22.2, p. 602)

Sommerville identifica **cuatro factores críticos** en la gestión de personal (p. 603):

1. **Consistencia** — "Todas las personas en un equipo de proyecto deben recibir un trato similar."
2. **Respeto** — "Las personas tienen distintas habilidades y los administradores deben respetar esas diferencias."
3. **Inclusión** — "Las personas contribuyen efectivamente cuando sienten que otros las escuchan y que sus propuestas se toman en cuenta."
4. **Honestidad** — "Como administrador, siempre debe ser honesto acerca de lo que está bien y lo que está mal en el equipo."

---

### 5.1 Selección del Personal

> **Fuente:** Cap. 22 §22.3.1, p. 609 (contexto de composición del equipo)

Sommerville establece que conformar un grupo requiere *"el equilibrio correcto de
habilidades técnicas y personalidades"* y que los administradores raramente tienen
libertad absoluta en la selección; con frecuencia *"deben recurrir a las personas que
están disponibles en la compañía, aun cuando no sean ideales para el puesto"*
(Cap. 22 §22.3.1, p. 609).

Los factores clave al seleccionar al equipo incluyen:

- **Experiencia previa** en proyectos similares (dominio de aplicación y tecnología).
- **Habilidades técnicas** relevantes para el tipo de proyecto.
- **Habilidades de comunicación** — los ingenieros de software "pueden carecer de habilidades más sutiles que les permitan motivar y dirigir a un equipo" (p. 603).
- **Tipo de personalidad** — Sommerville cita a Bass y Dunteman (1963), quienes clasifican a los profesionales en tres tipos (Cap. 22 §22.2.1, p. 606):
  - *Orientados a las tareas*: motivados por el reto intelectual.
  - *Orientados hacia sí mismos*: motivados por el éxito y el reconocimiento personal.
  - *Orientados a la interacción*: motivados por la presencia y acciones de los compañeros de trabajo.

Para el **gestor de proyecto**, los criterios específicos son: habilidades de gestión de recursos humanos, capacidad técnica suficiente para comprender los problemas del equipo, y honestidad para comunicar tanto logros como problemas (p. 603).

---

### 5.2 Motivación del Equipo

> **Fuente:** Cap. 22 §22.2.1, pp. 603–606

> *"Motivación significa organizar el trabajo y el ambiente laboral para alentar a los
> individuos a desempeñarse tan efectivamente como sea posible."* (Cap. 22 §22.2.1, p. 603)

#### Jerarquía de Maslow aplicada a equipos de IS

Sommerville aplica el modelo de Maslow (1954) específicamente al contexto de
organizaciones de desarrollo de software (Cap. 22 §22.2.1, pp. 603–604):

| Nivel | Necesidad         | Descripción según Sommerville                                             | Cómo satisfacerla en IS                                                          |
|-------|-------------------|---------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| 1     | **Fisiológicas**  | Necesidades fundamentales de alimentación, sueño, etc.                    | Las personas en IS "por lo general no están hambrientas ni sedientas ni físicamente amenazadas". Este nivel se considera cubierto. |
| 2     | **De seguridad**  | Necesidad de sentirse seguro en el ambiente.                              | Estabilidad laboral, contrato claro, ambiente físico seguro.                     |
| 3     | **Sociales**      | "Sentirse parte de un grupo social."                                      | Dar tiempo para reunirse con compañeros, proporcionar lugares de socialización, organizar reuniones cara a cara en etapas tempranas. |
| 4     | **De estima**     | "La necesidad de sentirse respetado por otros."                           | Reconocimiento público de logros; asegurar que las personas "se sientan valoradas por la organización"; remuneración acorde a habilidades y experiencia. |
| 5     | **De autorrealización** | "Tienen que ver con el desarrollo personal."                        | Dar responsabilidad sobre el trabajo; asignar "tareas demandantes pero no imposibles"; ofrecer programa de capacitación para desarrollar nuevas habilidades. |

> *"Las personas requieren cubrir las necesidades de nivel inferior, como el hambre, antes
> de las necesidades de nivel superior, que son más abstractas."* (p. 603–604)

> *"Asegurarse de que se cubren las necesidades sociales, de estima y autorrealización de
> las personas es más importante desde un punto de vista administrativo."* (p. 604)

#### Tipos de personalidad y motivación

Sommerville amplía el modelo de Maslow reconociendo que "el modelo de Maslow es útil sólo hasta cierto punto, ya que adopta un punto de vista exclusivamente personal de la motivación" (p. 606). Añade que:

> *"Ser miembro de un grupo cohesivo es enormemente motivador para la mayoría de la gente."*

---

### 5.3 Retención del Personal

> **Fuente:** Cap. 22 §22.2, p. 602; §22.3, p. 608

#### Por qué la rotación es especialmente dañina en IS

Sommerville señala que la salida de un programador experimentado puede ser simultáneamente:
- **Riesgo del proyecto**: altera el calendario.
- **Riesgo del producto**: el sustituto "tal vez no sea tan experimentado y, por lo tanto, podría cometer errores de programación".
- **Riesgo empresarial**: si "la experiencia de dicho programador es vital para obtener nuevos contratos" (Cap. 22 §22.1, p. 597).

#### Factores que contribuyen a retener talento

Derivado del modelo de Maslow aplicado a IS (Cap. 22 §22.2.1, pp. 604–606):

- Satisfacer las necesidades sociales: reuniones cara a cara, ambientes de socialización.
- Reconocimiento público de logros (necesidad de estima).
- Capacitación continua y asignación de tareas desafiantes (autorrealización).
- Autonomía en el diseño y toma de decisiones técnicas.
- Comunicación honesta y transparente del administrador.

#### Impacto de la pérdida de un miembro clave: registro como riesgo

Cuando un miembro clave del equipo abandona el proyecto, Sommerville indica que
"siempre se requiere tiempo para que un nuevo miembro del proyecto comprenda el trabajo
realizado, de manera que no puede ser inmediatamente productivo" (p. 596–597).
Este evento debe registrarse como un **riesgo del proyecto** con:
- **Probabilidad**: Moderada (ajustable según contexto).
- **Efecto**: Grave (demoras significativas en el calendario).
- **Estrategia de mitigación**: "Reorganice los equipos de manera que haya más traslape de trabajo y, así, las personas comprendan las labores de los demás" (Cap. 22 §22.1.3, figura 22.5, p. 601).

---

**Aplicación en el sistema:**
El tipo `MiembroEquipo` con sus campos `rol`, `esExterno` y `rolCliente` refleja directamente
los factores de selección de Sommerville. El campo `rol` debe capturar el rol técnico y nivel
de responsabilidad, mientras que `esExterno` permite identificar riesgos adicionales de
disponibilidad. La pérdida de cualquier miembro con `esExterno: false` y rol crítico
(`PM`, `Arquitecto`) debe generar automáticamente un riesgo en `riesgos[]`.

---

## 6. Trabajo en Equipo

> **Fuente:** Cap. 22 §22.3, pp. 607–616

---

### 6.1 Cohesión del Equipo

> **Fuente:** Cap. 22 §22.3, pp. 607–609

Sommerville define cohesión del equipo como la condición en que "los miembros piensan
que el equipo es más importante que los individuos que lo integran. Los miembros de un
grupo cohesivo bien liderado son leales [...] Se identifican con las metas del grupo y con
los demás miembros. Tratan de proteger al grupo, como entidad, de cualquier interferencia
externa." (Cap. 22 §22.3, p. 607–608)

#### Beneficios de un equipo cohesionado en proyectos IS (Cap. 22 §22.3, p. 608)

1. **Estándares de calidad propios** — "Puesto que dichos estándares se establecen por consenso, éstos tienen más probabilidad de respetarse que los estándares externos impuestos sobre el grupo."
2. **Aprendizaje mutuo** — "Las personas en el grupo aprenden de los demás. Las inhibiciones causadas por la ignorancia se minimizan."
3. **Continuidad del conocimiento** — "Si sale un miembro del grupo. Otros en el grupo pueden tomar el control de las tareas críticas."
4. **Mejoramiento continuo** — "Los miembros del grupo trabajan de manera colectiva para entregar resultados de alta calidad y corregir problemas, sin importar quiénes crearon originalmente el diseño o programa."

#### Factores que construyen cohesión

- Organizar eventos sociales para los miembros del grupo y sus familias.
- Establecer identidad grupal (nombre, compatibilidad y territorio).
- Organizar actividades explícitas de construcción grupal.
- Compartir información libremente: "El simple intercambio de información es una forma efectiva de hacer que las personas se sientan valoradas." (p. 608)
- Involucrar a todos los miembros en las decisiones de especificación y diseño.

#### Factores que destruyen cohesión

- Turbulencia organizacional por reorganizaciones constantes e inseguridad laboral.
- Comunicación deficiente o retención de información por parte del administrador.
- Miembros del equipo que no se ajustan al grupo y no se abordan oportunamente.
- Motivación individual que decae por expectativas no cumplidas (ver caso Dorothy, p. 605).

#### Tamaño óptimo del equipo

> *"Como regla general, los grupos del proyecto de ingeniería de software no deben tener
> más de 10 miembros. Cuando se usan grupos pequeños se reducen los problemas de
> comunicación. Todos conocen a todos los demás, y el grupo en su conjunto puede
> reunirse en torno a una mesa para estudiar el proyecto."* (Cap. 22 §22.3, p. 607)

---

### 6.2 Comunicación del Equipo

> **Fuente:** Cap. 22 §22.3, p. 609

Sommerville establece que la comunicación es uno de los tres factores genéricos
que afectan el trabajo en equipo, junto con la composición del grupo y su organización.
*"Es esencial la óptima comunicación entre los miembros del grupo, y entre el equipo de
ingeniería de software y otras partes interesadas en el proyecto."* (p. 609)

#### Problemas de comunicación más comunes

Derivados del contexto del libro:

- Equipos distribuidos geográficamente que no pueden reunirse en un mismo lugar.
- Miembros que retienen información por temor a revelar problemas.
- Comunicaciones descendentes sesgadas: el administrador no comparte el estado real del proyecto.
- Malentendidos en requerimientos cuando las interfaces entre subgrupos no están bien definidas.

#### Estructura del equipo y comunicación

| Tipo de equipo        | Comunicación                                                                 |
|-----------------------|------------------------------------------------------------------------------|
| **Jerárquico**        | Centralizada en el jefe: reduce canales pero puede crear cuellos de botella. |
| **Democrático ágil**  | Distribuida entre todos los miembros: más robusta pero requiere más coordinación. |

#### Reuniones efectivas

Sommerville, a través del estudio de caso de Alice (figura 22.9, p. 608), describe las reuniones efectivas como:
- **Propósito**: Comunicar estado del proyecto, compartir aprendizajes, reforzar cohesión.
- **Frecuencia**: Mensual para reuniones formales de equipo; diaria/informal para seguimiento operativo.
- **Estructura**: El administrador informa novedades organizacionales → cada miembro reporta brevemente su trabajo → discusión de un tema general compartido.

---

### 6.3 Organización del Equipo

> **Fuente:** Cap. 22 §22.3, pp. 609–611 (inferido del contexto de organización grupal)

#### Modelo jerárquico (jefe de programadores)

| Atributo         | Descripción                                                                |
|------------------|----------------------------------------------------------------------------|
| **Estructura**   | Un jefe de programadores toma decisiones técnicas; el resto ejecuta.       |
| **Ventajas**     | Toma de decisiones rápida; responsabilidad técnica clara; eficiente para proyectos bien definidos. |
| **Desventajas**  | Cuello de botella en el jefe; menor participación del equipo; inadecuado cuando los requerimientos cambian frecuentemente. |
| **Cuando usar**  | Proyectos con requerimientos estables, sistemas críticos de seguridad y protección, trabajo de larga duración. |

#### Modelo democrático ágil

| Atributo         | Descripción                                                                |
|------------------|----------------------------------------------------------------------------|
| **Estructura**   | Todos los miembros participan en decisiones; el Scrum Master facilita.     |
| **Ventajas**     | Mayor cohesión; más adaptabilidad al cambio; todos comprenden el sistema completo. |
| **Desventajas**  | Puede ser lento para decisiones complejas; requiere mayor coordinación.    |
| **Cuando usar**  | Sistemas de información pequeños a medianos en entornos competitivos cambiantes (Cap. 23 §23.2, p. 623). |

#### Tabla de roles posibles del equipo

| Rol técnico       | Descripción                                                            | Modelo de equipo | Responsabilidad principal en el Módulo 2          |
|-------------------|------------------------------------------------------------------------|------------------|---------------------------------------------------|
| `PM` / `gestor`   | Administrador del proyecto. Gestiona planificación, riesgos y reportes. | Ambos            | Aprobación del proyecto; validación de hitos      |
| `analista`        | Especialista en requerimientos. Prepara el SRS del Módulo 3.           | Ambos            | Definición del alcance y objetivos del proyecto   |
| `arquitecto`      | Diseña la arquitectura técnica del sistema.                            | Jerárquico       | Decisiones técnicas de diseño del sistema         |
| `desarrollador`   | Implementa las funcionalidades del sistema.                            | Ambos            | Estimación de esfuerzo y complejidad              |
| `qa`              | Asegura la calidad mediante pruebas e inspecciones.                    | Ambos            | Revisión de entregables y criterios de aceptación |
| `scrum_master`    | Facilita el proceso ágil, elimina impedimentos del equipo.             | Ágil             | Facilitación de ceremonias y seguimiento de sprints|
| `ux_designer`     | Diseña la experiencia e interfaces de usuario.                         | Ambos            | Especificación de requerimientos de interfaz       |
| `devops`          | Gestiona infraestructura, CI/CD y despliegue.                          | Ambos            | Planificación de entornos y estrategia de releases |

> **Nota**: Estos son los valores válidos para el campo `rol` del tipo `MiembroEquipo`.
> El campo `rolCliente` captura el rol que tiene este miembro dentro de la organización del cliente.

---

**Aplicación en el sistema:**
La tabla anterior define el enum completo para el campo `rol` de `MiembroEquipo`.
El sistema debe validar que exista al menos un miembro con `rol: 'PM'` o `rol: 'gestor'`
antes de activar el proyecto. La elección de modelo de equipo (jerárquico vs. ágil)
debe estar alineada con el campo `metodologia` del proyecto.

---

## 7. Desarrollo Dirigido por Plan

> **Fuente:** Cap. 23 §23.2, pp. 623–626

### Definición

> *"El desarrollo dirigido por un plan o basado en un plan es un enfoque para la ingeniería
> de software donde el proceso de desarrollo se planea a detalle. Se elabora un plan de
> proyecto que registra el trabajo que se va a realizar, quién lo efectuará, el calendario
> de desarrollo y los productos de trabajo."* (Cap. 23 §23.2, p. 623)

### Cuándo es apropiado

Sommerville indica que el equilibrio entre desarrollo dirigido por plan y ágil depende del
tipo de proyecto y las habilidades del personal (p. 623):

- **Usar enfoque dirigido por plan cuando:** el sistema es crítico de seguridad o protección, requiere certificación previa, o involucra múltiples compañías coordinando trabajo en distintos sitios.
- **Usar enfoque ágil cuando:** el sistema de información es pequeño a mediano, en un entorno competitivo y cambiante.
- **Combinar ambos:** la mayoría de los proyectos se benefician de "una mezcla juiciosa de desarrollo basado en un plan y ágil" (p. 623).

### Planes que debe producir el proceso de planificación

#### Plan de Proyecto principal

Sommerville define la estructura completa del plan de proyecto (Cap. 23 §23.2.1, pp. 623–624):

| Sección del Plan                         | Contenido                                                                         | Elabora              | Aprueba              |
|------------------------------------------|-----------------------------------------------------------------------------------|----------------------|----------------------|
| **1. Introducción**                      | Objetivos del proyecto y restricciones (presupuesto, tiempo, etc.) que afectan la administración. | PM / gestor          | Admin / cliente      |
| **2. Organización del proyecto**         | Forma en que está organizado el equipo de desarrollo, personas involucradas y sus roles. | PM / gestor      | Admin                |
| **3. Análisis de riesgo**                | Posibles riesgos, probabilidad de que surjan y estrategias para reducirlos.       | PM / gestor          | Admin                |
| **4. Requerimientos de hardware y software** | Hardware y software de soporte requerido para el desarrollo; estimaciones de precio y calendario de entregas. | Arquitecto / DevOps | PM / gestor    |
| **5. División del trabajo**              | Actividades del proyecto con plazos y entregas asociados. Los plazos son etapas clave; las entregas son productos de trabajo al cliente. | PM / Analista | Admin / cliente |
| **6. Calendario del proyecto**           | Dependencias entre actividades, tiempo estimado por plazo, asignación de personal a actividades. | PM / gestor  | Admin                |
| **7. Mecanismos de monitorización y reporte** | Informes administrativos requeridos, cuándo elaborarlos y mecanismos de monitorización. | PM / gestor  | Admin / cliente  |

#### Planes complementarios

Sommerville enumera los siguientes planes adicionales (Cap. 23 §23.2.1, figura 23.2, p. 624):

| Plan complementario                  | Descripción                                                                           | Elabora        | Aprueba       |
|--------------------------------------|---------------------------------------------------------------------------------------|----------------|---------------|
| **Plan de calidad**                  | Describe los procedimientos de calidad y estándares que se usarán en el proyecto.    | QA / PM        | Admin         |
| **Plan de validación**               | Describe el enfoque, los recursos y el calendario utilizados para la validación del sistema. | QA / Analista | PM / Admin |
| **Plan de gestión de la configuración** | Describe la configuración de los procedimientos y las estructuras para la gestión. | DevOps / PM   | Admin         |
| **Plan de mantenimiento**            | Predice los requerimientos, los costos y el esfuerzo de mantenimiento.               | PM / Arquitecto| Admin / cliente|
| **Plan de desarrollo de personal**   | Describe cómo se desarrollarán las habilidades y la experiencia de los miembros del equipo. | PM / gestor | Admin    |

### El proceso de planeación

Sommerville describe el proceso de planeación como iterativo (Cap. 23 §23.2.2, p. 624–626):

1. Valorar las **restricciones** que afectan el proyecto (fecha de entrega, personal disponible, presupuesto, herramientas).
2. Identificar **hitos y entregables** del proyecto.
3. Preparar un **calendario estimado** y autorizar el inicio de actividades.
4. Revisar el **avance** cada dos a tres semanas y comparar con el plan.
5. Si hay **problemas menores**: modificar el plan manteniendo hitos y restricciones.
6. Si hay **problemas serios**: iniciar acciones de mitigación del riesgo y replantear el proyecto.

---

**Aplicación en el sistema:**
El "Plan de Proyecto" de Sommerville corresponde directamente al objeto `Proyecto` del sistema.
Las 7 secciones del plan se mapean así: Secciones 1–2 → Pasos 1–3 del flujo de creación;
Sección 3 → Paso 4 (riesgos); Secciones 5–6 → Paso 5 (calendarización);
Sección 4 y los planes complementarios → referencias a archivos específicos del módulo.
El campo `metodologia` determina qué planes complementarios son obligatorios vs. opcionales.

---

## 8. Calendarización de Proyectos

> **Fuente:** Cap. 23 §23.3, pp. 626–631

### Definición y propósito

> *"La calendarización de proyectos es el proceso de decidir cómo se organizará el trabajo
> en un proyecto como tareas separadas, y cuándo y cómo se ejecutarán dichas tareas."*
> (Cap. 23 §23.3, p. 626)

La calendarización se relaciona con la estimación en que ambas deben realizarse de
forma integrada: se estima el tiempo para cada tarea, el esfuerzo requerido, quién
trabajará en cada tarea y los recursos necesarios (espacio en disco, hardware
especializado, presupuesto de viajes). (p. 626)

### El proceso de calendarización

Sommerville describe el proceso de calendarización (Cap. 23 §23.3, figura 23.4, p. 628):

```
Información de requerimientos y diseño de software
    │
    ▼
1. Identificar actividades
    │
    ▼
2. Identificar dependencias entre actividades
    │
    ▼
3. Estimar recursos para actividades
    │
    ▼
4. Asignar personal a actividades
    │
    ▼
5. Crear gráficas del proyecto (Gantt + red de actividades)
    │
    ▼
Gráfica de barras que describe el calendario del proyecto
```

### Identificación de actividades y dependencias

Sommerville establece las siguientes reglas para descomponer el trabajo en tareas
(Cap. 23 §23.3, p. 626–627):

- Las tareas deben durar **al menos una semana, pero no más de ocho a diez semanas**.
- Una subdivisión más fina implica "una cantidad desproporcionada de tiempo empleado para volver a planear y actualizar el plan".
- Las tareas que son independientes pueden realizarse **en paralelo**.
- Es necesario *"evitar una situación en la que todo el proyecto se demore debido a que una tarea crítica no está terminada"*.
- Cada actividad cuenta con: **duración** (días calendario), **estimación del esfuerzo** (días-hombre), **plazo** de completitud y **punto final definido** (resultado tangible).

### Estimación de duración de actividades

Técnicas y factores de ajuste según Sommerville (Cap. 23 §23.3, p. 627):

- **Basada en experiencia previa**: "Si el proyecto a calendarizar es similar a un proyecto anterior, pueden reutilizarse las estimaciones previas."
- **Factor de contingencia**: "Las estimaciones de contingencia pueden agregar entre 30 y 50% al esfuerzo y tiempo requeridos para el proyecto." (p. 627)
- **Regla empírica**: "Estimar que nada saldrá mal, luego ampliar la estimación para enfrentar problemas anticipados. También puede añadirse a la estimación un factor de contingencia para hacer frente a problemas no anticipados." (p. 627)
- **Factores de ajuste**: tipo de proyecto, parámetros del proceso (plazos, estándares), calidad y experiencia de los ingenieros.

### Diagrama de actividades (red de actividades)

> *"Redes de actividad, son diagramas de red que muestran las dependencias entre las
> diferentes actividades que constituyen un proyecto."* (Cap. 23 §23.3.1, p. 628)

La **ruta crítica** a través de la red de actividades es la secuencia más larga de tareas
dependientes y define la duración mínima del proyecto. Toda demora en una tarea de la
ruta crítica demora todo el proyecto.

### Diagrama de barras (Gantt)

> *"Gráficas de barras, basadas en el calendario, las cuales señalan al responsable de
> cada actividad, el tiempo transcurrido previsto y la fecha en que se programó el inicio
> y el fin de la actividad. En ocasiones, las gráficas de barras se llaman gráficas de
> Gantt, en honor a su inventor, Henry Gantt."* (Cap. 23 §23.3.1, p. 628)

| Característica      | Diagrama de Gantt                          | Red de actividades                              |
|---------------------|--------------------------------------------|-------------------------------------------------|
| **Muestra**         | Cuándo comienza y termina cada tarea       | Dependencias entre actividades                  |
| **Fortaleza**       | Fácil de leer; muestra asignación de personal | Identifica la ruta crítica; muestra paralelismo |
| **Limitación**      | No muestra dependencias claramente         | Más complejo de interpretar                     |
| **Uso principal**   | Comunicación con clientes y seguimiento    | Planificación técnica y detección de cuellos de botella |

### Hitos del proyecto

> *"Un hito de proyecto es un resultado predecible de una actividad o un conjunto de
> actividades. En cada hito debe presentarse a la administración un reporte formal de
> avance."* (Cap. 23 §23.3, Puntos clave, p. 647)

> *"Los hitos son puntos en el calendario contra los que puede valorar el avance, por
> ejemplo, la transferencia del sistema para pruebas."* (Cap. 23 §23.2.2, p. 625)

**Diferencia entre hito y tarea:**
- Una **tarea** es una actividad con duración y esfuerzo medible.
- Un **hito** es un **punto de control** que puede asociarse con una o varias tareas y que marca el inicio o fin de una fase significativa. No tiene duración propia; representa el momento en que se puede valorar el avance.

**Diferencia entre hito y entregable:**

> *"Un entregable es un producto de trabajo que se entrega al cliente. Es el resultado de
> una fase significativa del proyecto, como la especificación o el diseño. Por lo general,
> los entregables requeridos se especifican en el contrato del proyecto."* (Cap. 23 §23.3, p. 628–629)

Un hito puede o no coincidir con un entregable. Todo entregable marca un hito, pero no
todo hito produce un entregable para el cliente.

### Problemas comunes en la calendarización de proyectos IS

Sommerville identifica los siguientes problemas recurrentes (Cap. 23 §23.3, pp. 626–630):

1. **Estimaciones optimistas**: "Si un proyecto está técnicamente avanzado, las estimaciones iniciales seguramente serán optimistas aun cuando se trate de considerar todas las eventualidades." (p. 627)
2. **Efecto dominó por demoras**: "Si una tarea se retrasa [...] afectará el desarrollo de tareas posteriores que dependen de ella." (p. 630)
3. **Conflictos de asignación de personal**: cuando los individuos trabajan en varios proyectos simultáneamente, una demora en una tarea desencadena reasignaciones que agravan la demora. (p. 630)
4. **Reutilización inválida de experiencia**: "Los proyectos pueden usar diferentes métodos de diseño y lenguajes de implementación, de modo que la experiencia de proyectos anteriores tal vez no sea aplicable." (p. 627)
5. **Subestimación del tamaño**: incluida en la lista de riesgos comunes de la Figura 22.1 (p. 597).

---

**Aplicación en el sistema:**
Los hitos definidos en la calendarización se registran como puntos de control del proyecto
en el array `hitos[]`. El sistema debe alertar cuando un hito tenga `estado: 'en_riesgo'`
(fecha estimada a menos de 5 días sin completarse) o `estado: 'incumplido'`
(fecha estimada superada sin `fechaReal` registrada). Cada hito debe tener un responsable
mapeado a un `usuarioId` del array `equipo[]`.

---

## 9. Flujo Completo de Creación de Proyecto en el Sistema

> **Base teórica:** Cap. 22 (§22.1, §22.2, §22.3) + Cap. 23 (§23.2, §23.3)

Este flujo es el **proceso oficial del Módulo 2**. Define la secuencia obligatoria que
debe completarse para que un proyecto pase del estado `borrador` al estado
`activo_en_definicion`.

---

### PASO 1 — Datos básicos del proyecto

| Campo            | Tipo              | Descripción                                            | Obligatorio |
|------------------|-------------------|--------------------------------------------------------|-------------|
| `nombre`         | string            | Nombre descriptivo del proyecto                        | Sí          |
| `codigo`         | string            | Código único del proyecto (generado o manual)          | Sí          |
| `tipo`           | `TipoProyecto`    | Tipo: `nuevo_desarrollo`, `mantenimiento`, `migracion`, `consultoria`, `integracion` | Sí |
| `criticidad`     | `CriticidadProyecto` | `baja`, `media`, `alta`, `critica`                  | Sí          |
| `clienteId`      | string            | ID de la Entidad cliente del Módulo 1                  | Sí          |

**Validación:**
- La Entidad referenciada por `clienteId` debe estar en **NIVEL ESTÁNDAR** de completitud
  según lo definido en `M1-07`.
- Si la Entidad no cumple el nivel estándar, el sistema bloquea la creación del proyecto
  y redirige al usuario al Módulo 1 para completar el perfil.

**Resultado:** Proyecto creado en estado `borrador`.

---

### PASO 2 — Selección de metodología

| Campo                     | Tipo                   | Descripción                                             | Obligatorio                              |
|---------------------------|------------------------|---------------------------------------------------------|------------------------------------------|
| `metodologia`             | `MetodologiaProyecto`  | `scrum`, `kanban`, `xp`, `cascada`, `hibrida`, `prince2` | Sí                                     |
| `justificacionMetodologia`| string                 | Justificación textual de la elección metodológica       | Sí si criticidad = `alta` o `critica`   |

**Referencia teórica:** Archivos `02-metodologias-agiles.md` y `01-modelos-proceso-software.md`.

**Validación:**
- Si `criticidad` es `alta` o `critica`, el campo `justificacionMetodologia` es
  obligatorio. Sommerville justifica esto porque los sistemas críticos de seguridad
  "requieren un amplio análisis previo y quiz certificarse antes de utilizarse"
  y deben estar "dirigidos mediante un plan" (Cap. 23 §23.2, p. 623).

**Resultado:** Metodología registrada y justificada en el objeto `Proyecto`.

---

### PASO 3 — Conformación del equipo

| Campo              | Tipo               | Descripción                                                    | Obligatorio |
|--------------------|--------------------|----------------------------------------------------------------|-------------|
| `equipo[]`         | `MiembroEquipo[]`  | Lista de miembros del equipo asignados al proyecto             | Sí          |
| `usuarioId`        | string             | ID del usuario en el sistema                                   | Sí          |
| `nombre`           | string             | Nombre del miembro                                             | Sí          |
| `rol`              | string (enum)      | Ver tabla de roles §6.3                                        | Sí          |
| `rolCliente`       | string             | Rol que tiene este miembro en la organización del cliente      | No          |
| `esExterno`        | boolean            | `true` si el miembro pertenece a una organización externa      | Sí          |

**Referencia teórica:** Cap. 22 §22.2 y §22.3 (este archivo).

**Validaciones:**
- Debe existir al menos **1 miembro** con `rol: 'PM'` o `rol: 'gestor'`.
- El tamaño del equipo no debe superar **10 miembros** (regla general de Sommerville,
  Cap. 22 §22.3, p. 607). Si se supera, el sistema muestra una advertencia.
- Si `criticidad` es `alta` o `critica`, se recomienda incluir roles `arquitecto` y `qa`.

**Resultado:** Array `equipo[]` poblado con roles definidos.

---

### PASO 4 — Registro inicial de riesgos

| Campo              | Tipo                  | Descripción                                                 | Obligatorio |
|--------------------|-----------------------|-------------------------------------------------------------|-------------|
| `riesgos[]`        | `RiesgoProyecto[]`    | Lista de riesgos del proyecto                               | Sí          |
| `descripcion`      | string                | Descripción del riesgo                                      | Sí          |
| `tipo`             | string (enum)         | `tecnologico`, `personal`, `organizacional`, `herramientas`, `requerimientos`, `estimacion` | Sí |
| `probabilidad`     | string (enum)         | `muy_baja`, `baja`, `moderada`, `alta`, `muy_alta`         | Sí          |
| `efecto`           | string (enum)         | `catastrofico`, `grave`, `tolerable`, `insignificante`     | Sí          |
| `estrategia`       | string                | Estrategia de mitigación documentada                        | Sí si efecto = `catastrofico` |

**Referencia teórica:** M1-04 (gestión de riesgos) + Cap. 22 §22.1 (este archivo).

**Validaciones:**
- Mínimo **3 riesgos** registrados.
- El sistema **pre-popula** el array con: (a) riesgos heredados del perfil de la Entidad
  cliente en M1, y (b) los 6 riesgos mínimos de la tabla §4.
- Si algún riesgo tiene `efecto: 'catastrofico'`, el campo `estrategia` es obligatorio
  y el proyecto no puede activarse sin aprobación de un usuario con rol `admin`.

**Resultado:** Array `riesgos[]` con mínimo 3 riesgos documentados.

---

### PASO 5 — Calendarización inicial

| Campo               | Tipo     | Descripción                                               | Obligatorio |
|---------------------|----------|-----------------------------------------------------------|-------------|
| `fechaInicio`       | Date     | Fecha de inicio planificada del proyecto                  | Sí          |
| `fechaFinEstimada`  | Date     | Fecha de finalización estimada del proyecto               | Sí          |
| `hitos[]`           | `Hito[]` | Lista de hitos del proyecto (ver §10)                     | Sí          |

**Referencia teórica:** Cap. 23 §23.3 (este archivo).

**Validaciones:**
- `fechaFinEstimada` > `fechaInicio`.
- Mínimo **3 hitos** definidos.
- Al menos 1 hito debe tener `entregable` especificado (por ser un entregable al cliente,
  según definición de Sommerville, p. 628–629).
- Cada hito debe tener un `responsable` mapeado a un `usuarioId` existente en `equipo[]`.

**Resultado:** Calendario con hitos registrado en el objeto `Proyecto`.

---

### PASO 6 — Estimación de presupuesto

| Campo                  | Tipo    | Descripción                                              | Obligatorio                              |
|------------------------|---------|----------------------------------------------------------|------------------------------------------|
| `presupuestoEstimado`  | number  | Presupuesto referencial estimado del proyecto            | Sí si criticidad = `alta` o `critica`   |
| `moneda`               | string  | Código de moneda ISO 4217 (e.g., `CLP`, `USD`)          | Sí si `presupuestoEstimado` está definido|

**Referencia teórica:** M2-02 (archivo de estimación de costos); Cap. 23 §23.1 y §23.5.

**Validaciones:**
- Para criticidad `alta` o `critica`: campo obligatorio. Justificado porque Sommerville
  indica que para sistemas críticos se requiere "un amplio análisis previo" incluyendo
  estimación de recursos (Cap. 23 §23.2, p. 623).
- Para criticidad `baja` o `media`: campo opcional pero recomendado.
- El valor debe ser > 0.

**Resultado:** Presupuesto referencial registrado en el objeto `Proyecto`.

---

### PASO 7 — Aprobación y activación

**Quién puede aprobar:** Usuario con rol `gestor` o `admin` en el sistema.

**Verificación previa automática del sistema:**

| Ítem verificado                                          | Condición de aprobación                          |
|----------------------------------------------------------|--------------------------------------------------|
| Entidad cliente en NIVEL ESTÁNDAR                        | Validado en Paso 1                               |
| Metodología registrada con justificación si corresponde  | Validado en Paso 2                               |
| Equipo con al menos 1 PM o gestor                        | Validado en Paso 3                               |
| Mínimo 3 riesgos registrados                            | Validado en Paso 4                               |
| Sin riesgos catastróficos sin estrategia ni aprobación admin | Validado en Paso 4                           |
| fechaFinEstimada > fechaInicio                           | Validado en Paso 5                               |
| Mínimo 3 hitos definidos                                 | Validado en Paso 5                               |
| Presupuesto registrado si criticidad alta o crítica      | Validado en Paso 6                               |

**Resultado:** Si todas las validaciones pasan, el sistema actualiza el campo `estado`
de `'borrador'` a `'activo_en_definicion'`. El proyecto queda habilitado para iniciar
el proceso SRS del **Módulo 3**.

> **⚠️ Regla de negocio crítica:** Un proyecto en estado `activo_en_definicion` NO puede
> regresar a `borrador` automáticamente. Cualquier modificación posterior requiere
> autorización del rol `gestor` o `admin` y queda registrada en el historial de cambios.

---

## 10. Plantilla Operativa: Hito del Proyecto

> **Base teórica:** Cap. 23 §23.3, pp. 628–629; Puntos clave, p. 647

### Estructura del tipo `Hito`

| Campo           | Tipo                                                        | Descripción                                                              | Obligatorio |
|-----------------|-------------------------------------------------------------|--------------------------------------------------------------------------|-------------|
| `id`            | string                                                      | Identificador único del hito                                             | Sí          |
| `nombre`        | string                                                      | Nombre descriptivo del hito (ej: "Aprobación de SRS")                   | Sí          |
| `descripcion`   | string                                                      | Qué debe estar completado para considerar el hito alcanzado              | Sí          |
| `fechaEstimada` | Date                                                        | Fecha objetivo del hito                                                   | Sí          |
| `fechaReal`     | Date \| null                                                | Fecha en que efectivamente se completó el hito                           | No          |
| `estado`        | `'pendiente'` \| `'en_riesgo'` \| `'completado'` \| `'incumplido'` | Estado actual del hito                                        | Sí          |
| `entregable`    | string \| null                                              | Documento o artefacto que evidencia el hito (ej: "Documento SRS v1.0")   | Sí          |
| `responsable`   | string (usuarioId)                                          | ID del miembro del equipo responsable de este hito                       | Sí          |

### Reglas de transición de estado del hito

```
pendiente → en_riesgo   (cuando fechaEstimada - hoy ≤ 5 días y sin fechaReal)
pendiente → completado  (cuando se registra fechaReal)
en_riesgo → completado  (cuando se registra fechaReal)
pendiente → incumplido  (cuando hoy > fechaEstimada y sin fechaReal)
en_riesgo → incumplido  (cuando hoy > fechaEstimada y sin fechaReal)
incumplido → completado (cuando se registra fechaReal, con nota de demora)
```

---

### Hitos estándar recomendados por tipo de proyecto

#### `nuevo_desarrollo`

| # | Nombre del hito                    | Entregable sugerido                        | Fase           |
|---|------------------------------------|--------------------------------------------|----------------|
| H1 | Aprobación del SRS                | Documento SRS firmado (M3)                 | Definición     |
| H2 | Diseño arquitectónico aprobado    | Documento de arquitectura del sistema      | Diseño         |
| H3 | Prototipo funcional validado      | Demo ejecutable con funcionalidades clave  | Desarrollo     |
| H4 | Pruebas de integración completadas| Reporte de pruebas de integración          | Pruebas        |
| H5 | Aceptación del cliente (UAT)      | Acta de aceptación del cliente             | Validación     |
| H6 | Despliegue en producción          | Sistema en producción documentado          | Entrega        |

#### `mantenimiento`

| # | Nombre del hito                    | Entregable sugerido                        | Fase           |
|---|------------------------------------|--------------------------------------------|----------------|
| H1 | Análisis de impacto completado    | Reporte de análisis de impacto             | Análisis       |
| H2 | Cambios implementados en staging  | Build en ambiente de staging               | Implementación |
| H3 | Pruebas de regresión completadas  | Reporte de pruebas de regresión            | Pruebas        |
| H4 | Despliegue y verificación         | Sistema actualizado en producción          | Entrega        |

#### `migracion`

| # | Nombre del hito                    | Entregable sugerido                        | Fase           |
|---|------------------------------------|--------------------------------------------|----------------|
| H1 | Inventario de datos validado       | Catálogo de datos a migrar                 | Análisis       |
| H2 | Estrategia de migración aprobada  | Documento de estrategia de migración       | Planificación  |
| H3 | Migración en ambiente de pruebas   | Reporte de validación de datos migrados    | Pruebas        |
| H4 | Plan de rollback documentado       | Procedimiento de rollback aprobado         | Contingencia   |
| H5 | Migración en producción            | Datos migrados y validados en producción   | Entrega        |
| H6 | Cierre y documentación             | Manual de operación post-migración         | Cierre         |

#### `consultoria`

| # | Nombre del hito                    | Entregable sugerido                        | Fase           |
|---|------------------------------------|--------------------------------------------|----------------|
| H1 | Diagnóstico inicial completado    | Reporte de diagnóstico                     | Análisis       |
| H2 | Propuesta de solución entregada   | Documento de propuesta técnica             | Propuesta      |
| H3 | Validación de propuesta por cliente| Acta de validación del cliente             | Validación     |
| H4 | Entrega de recomendaciones finales | Informe final de consultoría               | Entrega        |

#### `integracion`

| # | Nombre del hito                    | Entregable sugerido                        | Fase           |
|---|------------------------------------|--------------------------------------------|----------------|
| H1 | Mapeo de APIs y contratos definidos| Documento de contratos de integración      | Análisis       |
| H2 | Implementación de conectores       | Código de conectores en ambiente de pruebas| Desarrollo     |
| H3 | Pruebas end-to-end completadas     | Reporte de pruebas E2E                     | Pruebas        |
| H4 | Puesta en producción y monitoreo   | Sistema integrado en producción            | Entrega        |

---

## 11. Tabla de Conexiones con los 3 Módulos

| Concepto                                   | Módulo    | Campo o proceso específico                                              |
|--------------------------------------------|-----------|-------------------------------------------------------------------------|
| Entidad cliente (precondición)             | Módulo 1  | `clienteId` → validación NIVEL ESTÁNDAR (M1-07)                        |
| Riesgos heredados de la Entidad            | M1 → M2   | `riesgos[]` pre-poblado desde perfil de la Entidad en M1               |
| Registro del proyecto                      | Módulo 2  | Objeto `Proyecto` con todos sus campos                                  |
| Gestión del riesgo inicial (§22.1)         | Módulo 2  | Array `riesgos[]` → 6 tipos + herencia desde M1                        |
| Gestión de personal (§22.2)                | Módulo 2  | Array `equipo[]` → tipo `MiembroEquipo` con campos `rol`, `esExterno`  |
| Cohesión y organización del equipo (§22.3) | Módulo 2  | Campo `rol` → enum de roles (§6.3); tamaño máximo 10 miembros          |
| Selección de metodología                   | Módulo 2  | Campo `metodologia` → `MetodologiaProyecto`; archivo M2-02             |
| Plan de proyecto (§23.2.1)                 | Módulo 2  | Secciones del plan → campos del formulario de creación del proyecto     |
| Plan de calidad (§23.2.1)                  | Módulo 2  | Plan complementario → referencia a archivo M2-QA                       |
| Plan de gestión de configuración (§23.2.1) | Módulo 2  | Plan complementario → referencia a archivo M2-Config                   |
| Calendarización (§23.3)                    | Módulo 2  | Campos `fechaInicio`, `fechaFinEstimada`, array `hitos[]`              |
| Hitos del proyecto (§23.3)                 | Módulo 2  | Tipo `Hito` con campos `estado`, `entregable`, `responsable`           |
| Presupuesto estimado                       | Módulo 2  | Campo `presupuestoEstimado` → referencia M2-02 (estimación de costos)  |
| Estado de activación                       | M2 → M3   | `estado: 'activo_en_definicion'` → habilita el inicio del SRS en M3   |
| Documento SRS                              | Módulo 3  | Primer entregable del proyecto activo (H1 en `nuevo_desarrollo`)       |
| Criterios de aceptación del SRS            | M2 → M3   | Definidos en los hitos H1 del tipo de proyecto; aprobados en M2        |

---

## 12. Checklist de Completitud

### Sección 3 — Gestión de Proyectos de Software (Cap. 22 intro)

- [x] Definición formal de gestión de proyectos de software (p. 594)
- [x] Las cuatro metas importantes de la gestión de proyectos (p. 594)
- [x] Las tres diferencias estructurales del software vs. otras ingenierías (p. 594–595)
- [x] Las cinco actividades principales del administrador de proyecto (p. 594–595)

### Sección 4 — Gestión del Riesgo (Cap. 22 §22.1)

- [x] Definición de gestión del riesgo (p. 595–596)
- [x] Tres categorías de riesgo: proyecto, producto, empresarial (p. 596)
- [x] Seis tipos de riesgo para lista de verificación (p. 598)
- [x] Ejemplos de riesgos comunes (figura 22.1, p. 597)
- [x] Tabla de riesgos con probabilidad y efectos (figura 22.4, p. 600)
- [x] Proceso de gestión del riesgo: identificación, análisis, planeación, monitorización (p. 597–602)
- [x] Estrategias: evitación, minimización, contingencia (figura 22.5, p. 601)
- [x] Escala de efectos: catastrófico, grave, tolerable, insignificante (p. 599)
- [x] Lista mínima de riesgos para todo proyecto (tabla §4)
- [x] Criterio de escalamiento por nivel de riesgo catastrófico

### Sección 5 — Gestión de Personal (Cap. 22 §22.2)

- [x] Cuatro factores críticos de gestión de personal (p. 603)
- [x] Jerarquía de Maslow aplicada a IS con los 5 niveles (pp. 603–604)
- [x] Cómo satisfacer cada nivel en el contexto de IS (pp. 604–605)
- [x] Tres tipos de personalidad de Bass y Dunteman (p. 606)
- [x] Por qué la rotación es especialmente dañina en IS (p. 596–597)
- [x] Factores de retención del talento (pp. 604–606)
- [x] Impacto de la pérdida de miembro clave como riesgo (p. 596–597, figura 22.5)

### Sección 6 — Trabajo en Equipo (Cap. 22 §22.3)

- [x] Definición de cohesión del equipo (pp. 607–608)
- [x] Cuatro beneficios de equipo cohesionado en IS (p. 608)
- [x] Factores que construyen cohesión (p. 608)
- [x] Factores que destruyen cohesión (p. 608)
- [x] Tamaño óptimo del equipo: máximo 10 miembros (p. 607)
- [x] Tres factores genéricos que afectan el trabajo en equipo (p. 609)
- [x] Modelo jerárquico vs. democrático: descripción, ventajas, desventajas, cuándo usar
- [x] Tabla completa de roles del tipo `MiembroEquipo` (§6.3)

### Sección 7 — Desarrollo Dirigido por Plan (Cap. 23 §23.2)

- [x] Definición de desarrollo dirigido por plan (p. 623)
- [x] Cuándo usar plan vs. ágil vs. híbrido (p. 623)
- [x] Siete secciones del Plan de Proyecto principal con elabora/aprueba (pp. 623–624)
- [x] Cinco planes complementarios (figura 23.2, p. 624)
- [x] Proceso iterativo de planeación con diagrama de flujo (figura 23.3, pp. 624–626)

### Sección 8 — Calendarización (Cap. 23 §23.3)

- [x] Definición de calendarización y relación con estimación (p. 626)
- [x] Proceso de calendarización paso a paso (figura 23.4, p. 628)
- [x] Reglas de duración de tareas: mínimo 1 semana, máximo 8–10 semanas (p. 626)
- [x] Factor de contingencia: 30–50% (p. 627)
- [x] Diagrama de actividades (red): qué es, ruta crítica (p. 628)
- [x] Diagrama de Gantt: qué es, diferencia con red de actividades (p. 628)
- [x] Definición exacta de hito según Sommerville (p. 625, 647)
- [x] Diferencia entre hito y tarea; entre hito y entregable (pp. 628–629)
- [x] Cinco problemas comunes en la calendarización de IS (pp. 626–630)

### Sección 9 — Flujo Completo de Creación (Entregable operativo)

- [x] PASO 1: Datos básicos con validación NIVEL ESTÁNDAR M1-07
- [x] PASO 2: Metodología con justificación obligatoria para criticidad alta/crítica
- [x] PASO 3: Equipo con validación de rol PM obligatorio
- [x] PASO 4: Riesgos con pre-poblado y validación de catastróficos
- [x] PASO 5: Calendarización con validación de fechas y mínimo 3 hitos
- [x] PASO 6: Presupuesto obligatorio para criticidad alta/crítica
- [x] PASO 7: Aprobación con checklist automático y transición de estado
- [x] Regla de negocio crítica: no retroceso automático desde activo_en_definicion

### Sección 10 — Plantilla Operativa Hito

- [x] Estructura completa del tipo `Hito` con todos los campos
- [x] Reglas de transición de estado del hito
- [x] Hitos estándar para `nuevo_desarrollo` (6 hitos)
- [x] Hitos estándar para `mantenimiento` (4 hitos)
- [x] Hitos estándar para `migracion` (6 hitos)
- [x] Hitos estándar para `consultoria` (4 hitos)
- [x] Hitos estándar para `integracion` (4 hitos)

### Sección 11 — Tabla de Conexiones

- [x] Conexiones M1 → M2 (precondiciones y herencia)
- [x] Conexiones internas M2 (todos los campos del objeto Proyecto)
- [x] Conexiones M2 → M3 (habilitación del SRS)

---

*Fin del documento M2-01-inicio-proyecto-planificacion.md*
