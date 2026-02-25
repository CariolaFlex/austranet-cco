# M3-01-ingenieria-requerimientos.md

---

## METADATOS

| Campo | Valor |
|---|---|
| **Nombre del archivo** | `M3-01-ingenieria-requerimientos.md` |
| **Módulo** | Módulo 3 — Documentación de Objetivos y Alcance (SRS) |
| **Capítulo fuente** | Capítulo 4 completo — *Ingeniería de requerimientos* |
| **Libro** | Sommerville, I. *Ingeniería de Software*, 9ª ed. Pearson, 2011 |
| **Versión** | 1.0.0 |
| **Fecha** | 2026-02-24 |
| **Estado** | ✅ Completo |
| **Archivo anterior** | M2-04 — Estados del Proyecto |
| **Archivo siguiente** | M3-02 — Técnicas de Adquisición de Requerimientos |

---

## 1. OBJETIVO DEL DOCUMENTO

Este archivo es el **marco teórico fundacional del Módulo 3**. Documenta la teoría completa de Ingeniería de Requerimientos (IR) extraída del Capítulo 4 de Sommerville, justificando cada decisión de diseño del sistema: la estructura del tipo `SRS`, los campos del tipo `Requerimiento`, los estados del proceso, las plantillas de especificación y las reglas de priorización.

Es el archivo más importante del sistema porque **el SRS no nace de la nada**: es la síntesis formal de todo lo que se capturó en los módulos anteriores. El flujo es el siguiente:

```
M1 (Contexto)          M2 (Plan)             M3 (SRS)
─────────────────    ──────────────────    ──────────────────────────
Perfil de Entidad  → Tipo de proyecto    → Alcance del sistema
Stakeholders       → Metodología         → Audiencia del SRS
Glosario           → Criticidad          → Reqs. de dominio
Riesgos del client → Registro de riesgos → Riesgos del SRS
                   → Estado 'activo_en_definicion' → ACTIVA Módulo 3
```

**Propósito concreto:** Cuando un proyecto alcanza el estado `activo_en_definicion` (M2-04, Sección 5), se crea un `SRS` con estado `no_iniciado`. Este archivo define qué es ese SRS, qué contiene, cómo se construye y cómo se valida.

---

## 2. ¿QUÉ SON LOS REQUERIMIENTOS?
*Cap. 4 §4.1, p. 83-84*

### 2.1 Definición Formal

> "Los requerimientos para un sistema son descripciones de lo que el sistema debe hacer: el servicio que ofrece y las restricciones en su operación. Tales requerimientos reflejan las necesidades del cliente para el sistema que le ayude a resolver algún problema."
> — Sommerville, Cap. 4, p. 83

El término "requerimiento" es deliberadamente ambiguo en la industria. Sommerville documenta esta **dualidad**:

> "El término requerimiento no se usa de manera consistente en la industria de software. En algunos casos, un requerimiento es simplemente un enunciado abstracto de alto nivel de un servicio que debe proporcionar el sistema o una restricción en el sistema. En el otro extremo, es una definición matemática detallada y formal de una función del sistema."
> — Sommerville, Cap. 4, p. 83

Esto explica por qué en el sistema existen **dos niveles** de requerimiento:
- El campo `descripcion` del `Requerimiento` puede expresarse en lenguaje natural (requerimiento de usuario)
- El campo `criterioAceptacion` lo formaliza en formato verificable (requerimiento del sistema)

### 2.2 Los Tres Tipos de Requerimientos

#### TIPO 1 — Requerimientos del Usuario

> "Son enunciados en lenguaje natural y en diagramas de los servicios que se espera que el sistema proporcione, y las restricciones bajo las cuales debe operar. Se escriben para los clientes."
> — Sommerville, Cap. 4, p. 83

- **Audiencia:** Clientes, usuarios finales, gerentes del cliente
- **Lenguaje:** Natural, sin jerga técnica, con tablas y diagramas
- **Nivel de detalle:** Alto nivel, comportamiento externo únicamente
- **Problema si se especifican mal:** Los requerimientos del usuario demasiado detallados restringen la libertad del diseñador e impiden encontrar mejores soluciones; demasiado vagos generan implementaciones inconsistentes con las necesidades reales

**Ejemplo del libro (MHC-PMS):**
> "Un usuario podrá buscar en todas las clínicas las listas de citas." *(Cap. 4, §4.1.1, p. 86)*

Este requerimiento parece claro pero es ambiguo: ¿"buscar" significa ingresar el nombre y el sistema busca en todas las clínicas, o el usuario debe seleccionar una clínica primero? Un desarrollador puede interpretar ambas formas. Resultado: dos implementaciones incompatibles con la necesidad del cliente.

#### TIPO 2 — Requerimientos del Sistema

> "Son descripciones más detalladas de las funciones, los servicios y las restricciones operacionales del sistema de software. El documento de requerimientos del sistema (conocido en ocasiones como especificación funcional) debe definir exactamente qué se va a implementar. Puede ser parte del contrato entre el comprador del sistema y los desarrolladores del software."
> — Sommerville, Cap. 4, p. 83

- **Audiencia:** Equipo técnico, arquitectos, ingenieros de prueba
- **Lenguaje:** Formal o semiestructurado; puede usar notaciones UML
- **Nivel de detalle:** Preciso, completo, sin ambigüedades
- **Diferencia clave con los del usuario:** Dicen **cómo** debe comportarse el sistema ante situaciones específicas, no solo **qué** debe hacer

**Ejemplo del libro (MHC-PMS):**
> "El sistema elaborará diariamente, para cada clínica, una lista de pacientes que se espera que asistan a cita ese día." *(Cap. 4, §4.1.1, p. 86)*

#### TIPO 3 — Requerimientos de Dominio

> "Los requerimientos de dominio se derivan del dominio de aplicación del sistema, más que a partir de las necesidades específicas de los usuarios del sistema. Pueden ser requerimientos funcionales nuevos por derecho propio, restricciones a los requerimientos funcionales existentes o formas en que deben realizarse cálculos particulares."
> — Sommerville, Cap. 4, §4.1, p. 86

- **Por qué son los más difíciles de capturar:** Los ingenieros de software no pertenecen al dominio del cliente; la terminología especializada se usa con precisión sutil que es fácil de malinterpretar; el conocimiento del dominio es tan implícito que los stakeholders no piensan en mencionarlo
- **Consecuencias de omitirlos:** El software funciona según su especificación pero el **sistema falla** (análogo al accidente de Varsovia descrito en Cap. 12: el software operó correctamente pero la especificación era incompleta)

> "El problema con los requerimientos de dominio es que los ingenieros de software no pueden entender las características del dominio en que opera el sistema. Por lo común, no pueden indicar si un requerimiento de dominio se perdió o entró en conflicto con otros requerimientos."
> — Sommerville, Cap. 4, §4.1, p. 86

*(Ver M1-03 — Glosario de Dominio para la captura de estos requerimientos antes del Módulo 3)*

### 2.3 Mapeo al Campo `tipo` del Tipo `Requerimiento`

| Tipo Sommerville | Valor `tipo` en sistema | Audiencia | Nivel de detalle | Código asignado |
|---|---|---|---|---|
| Requerimiento de usuario | *(capturado como descripción natural del RF o RNF)* | Stakeholders cliente | Alto nivel, lenguaje natural | — |
| Req. del sistema **funcional** | `'funcional'` | Equipo técnico, QA | Detallado, preciso, verificable | `RF-XXX` |
| Req. del sistema **no funcional** | `'no_funcional'` | Arquitecto, QA, DevOps | Métrico cuando sea posible | `RNF-XXX` |
| Req. de **dominio** | `'dominio'` | Todo el equipo | Específico del dominio del cliente | `RD-XXX` |

**Aplicación en el sistema:**
El campo `tipo: TipoRequerimiento` del tipo `Requerimiento` implementa directamente esta clasificación de Sommerville. Todo requerimiento ingresado al Módulo 3 debe clasificarse en una de estas tres categorías antes de ser aprobado. Los requerimientos de dominio (`'dominio'`) tienen fuente directa en el Glosario de Entidad (M1-03) y en los Stakeholders de Entidad (M1-02).

---

## 3. REQUERIMIENTOS FUNCIONALES
*Cap. 4 §4.1.1, p. 85-87*

### 3.1 Definición Formal

> "Los requerimientos funcionales son enunciados de los servicios que debe proporcionar el sistema, de la manera en que éste debe reaccionar a entradas específicas y de cómo se debe comportar el sistema en situaciones particulares. En algunos casos, los requerimientos funcionales de los sistemas también pueden declarar explícitamente lo que el sistema no debe hacer."
> — Sommerville, Cap. 4, §4.1.1, p. 85

Un RF describe:
- **Servicios:** qué funciones ejecuta el sistema para el usuario
- **Reacciones a entradas:** cómo responde ante acciones del usuario
- **Comportamiento situacional:** cómo actúa el sistema en condiciones específicas
- **Restricciones funcionales (requerimientos "no debe"):** comportamientos explícitamente prohibidos

### 3.2 El Problema de la Imprecisión en Requerimientos Funcionales

Sommerville documenta un ejemplo concreto de cómo una especificación imprecisa genera **interpretaciones contradictorias**:

> "La inexactitud en la especificación de requerimientos causa muchos problemas en la ingeniería de software. Es natural que un desarrollador de sistemas interprete un requerimiento ambiguo de forma que simplifique su implementación. Sin embargo, con frecuencia, esto no es lo que desea el cliente."
> — Sommerville, Cap. 4, §4.1.1, p. 86

**Ejemplo MHC-PMS (p. 86):**
- **RF ambiguo:** "Un usuario podrá buscar en todas las clínicas las listas de citas."
- **Interpretación del cliente:** Dado el nombre de un paciente, el sistema busca automáticamente en **todas** las clínicas
- **Interpretación del desarrollador:** El usuario selecciona una clínica y luego busca (simplifica implementación)
- **Consecuencia:** El sistema entregado no sirve para los pacientes confundidos que asisten a la clínica equivocada; hay que reescribir el módulo y retrasar la entrega

### 3.3 Completitud y Consistencia como Propiedades Ideales

> "En principio, la especificación de los requerimientos funcionales de un sistema debe ser **completa** y **consistente**. Totalidad significa que deben definirse todos los servicios requeridos por el usuario. Consistencia quiere decir que los requerimientos tienen que evitar definiciones contradictorias. En la práctica, para sistemas complejos grandes, es casi imposible lograr la consistencia y la totalidad de los requerimientos."
> — Sommerville, Cap. 4, §4.1.1, p. 87

**¿Por qué son imposibles de garantizar?**
1. **Omisiones:** Es fácil olvidar casos extremos en sistemas complejos
2. **Múltiples participantes:** Cada stakeholder tiene visión parcial del sistema; sus requerimientos son frecuentemente inconsistentes entre sí
3. **Inconsistencias tardías:** Las contradicciones suelen descubrirse solo después de un análisis profundo o tras entregar el sistema

### 3.4 Ejemplo: RF bien especificado vs. mal especificado

| Versión | Texto | Problema |
|---|---|---|
| ❌ Mal especificado | "El sistema permitirá buscar pacientes" | Ambiguo: ¿por nombre? ¿número? ¿en todas las clínicas? ¿resultados parciales? |
| ✅ Bien especificado | "El sistema DEBE permitir al personal médico buscar un paciente por nombre completo en todas las clínicas registradas. Si existen múltiples pacientes con el mismo apellido, el sistema DEBE mostrar nombre completo y fecha de nacimiento para identificación." | Completo, sin ambigüedades, verificable |

**Aplicación en el sistema:**
Los RF se registran en el Módulo 3 con `tipo: 'funcional'` y código `RF-XXX`. El campo `criterioAceptacion` es **obligatorio** para todos los RF con `estado: 'aprobado'`: define exactamente cómo verificar que el RF fue implementado correctamente. Un RF aprobado sin criterio de aceptación es inválido según este marco teórico.

---

## 4. REQUERIMIENTOS NO FUNCIONALES
*Cap. 4 §4.1.2, p. 87-90*

### 4.1 Definición Formal

> "Los requerimientos no funcionales, como indica su nombre, son requerimientos que no se relacionan directamente con los servicios específicos que el sistema entrega a sus usuarios. Pueden relacionarse con propiedades emergentes del sistema, como fiabilidad, tiempo de respuesta y uso de almacenamiento. De forma alternativa, pueden definir restricciones sobre la implementación del sistema, como las capacidades de los dispositivos IO o las representaciones de datos usados en las interfaces con otros sistemas."
> — Sommerville, Cap. 4, §4.1.2, p. 87

### 4.2 Por qué los RNF son Más Críticos que los RF

> "Los requerimientos no funcionales, como el rendimiento, la seguridad o la disponibilidad, especifican o restringen por lo general características del sistema como un todo. Los requerimientos no funcionales a menudo son **más significativos** que los requerimientos funcionales individuales. Es común que los usuarios del sistema encuentren formas para trabajar en torno a una función del sistema que realmente no cubre sus necesidades. No obstante, el **fracaso para cubrir los requerimientos no funcionales haría que todo el sistema fuera inútil**."
> — Sommerville, Cap. 4, §4.1.2, p. 87

**Ejemplos del libro:**
- Un sistema de aeronave que no cumpla sus requerimientos de fiabilidad → no será certificado para operación
- Un sistema de control embebido que no cumpla requerimientos de rendimiento → las funciones de control no operarán correctamente

### 4.3 Clasificación Completa de RNF (Fig. 4.3, p. 88)

Sommerville organiza los RNF en tres grandes categorías:

#### 4.3.1 Requerimientos del Producto

> "Estos requerimientos especifican o restringen el comportamiento del software. Los ejemplos incluyen requerimientos de rendimiento sobre qué tan rápido se debe ejecutar el sistema y cuánta memoria requiere, requerimientos de fiabilidad que establecen la tasa aceptable de fallas, requerimientos de seguridad y requerimientos de usabilidad."
> — Sommerville, Cap. 4, §4.1.2, p. 88

Subtipos:
- **Rendimiento:** Velocidad de respuesta, throughput de transacciones
- **Espacio/Tamaño:** Memoria RAM, almacenamiento en disco, ROM para sistemas embebidos
- **Fiabilidad:** Tasa de fallos, disponibilidad, MTBF
- **Usabilidad:** Tiempo de capacitación, tasa de errores del usuario, curva de aprendizaje
- **Seguridad:** Confidencialidad, integridad, autenticación

#### 4.3.2 Requerimientos de la Organización

> "Son requerimientos de sistemas amplios, derivados de políticas y procedimientos en la organización del cliente y del desarrollador. Los ejemplos incluyen requerimientos del proceso operacional que definen cómo se usará el sistema, requerimientos del proceso de desarrollo que especifican el lenguaje de programación, estándares del entorno o el proceso de desarrollo a utilizar, y requerimientos ambientales que definen el entorno de operación del sistema."
> — Sommerville, Cap. 4, §4.1.2, p. 88

Subtipos:
- **Operacionales:** Horarios de disponibilidad, procedimientos de operación
- **De desarrollo:** Lenguajes, frameworks, metodologías obligatorias
- **De estándares:** Normas ISO, estándares de codificación

#### 4.3.3 Requerimientos Externos

> "Este término cubre todos los requerimientos derivados de factores externos al sistema y su proceso de desarrollo. En ellos se incluyen requerimientos regulatorios que establecen lo que debe hacer el sistema para ser aprobado en su uso por un regulador, como sería un banco central; requerimientos legislativos que tienen que seguirse para garantizar que el sistema opere conforme a la ley, y requerimientos éticos que garanticen que el sistema será aceptable para sus usuarios y el público en general."
> — Sommerville, Cap. 4, §4.1.2, p. 88

Subtipos:
- **Regulatorios:** Certificaciones sectoriales (médico, financiero, aeronáutico)
- **Legislativos:** Leyes de privacidad, protección de datos personales
- **Éticos:** Acceptabilidad social, equidad, no discriminación

**Ejemplo completo del libro (MHC-PMS, Fig. 4.4, p. 89):**

| Tipo | Requerimiento | Fuente |
|---|---|---|
| Del producto (disponibilidad) | "El MHC-PMS estará disponible en todas las clínicas durante las horas de trabajo normales (lunes a viernes, de 8:30 a 17:30). En cualquier día, los tiempos muertos dentro de las horas laborales normales no rebasarán los cinco segundos." | Política operacional |
| De la organización (autenticación) | "Los usuarios del sistema MHC-PMS se acreditarán a sí mismos con el uso de la tarjeta de identidad de la autoridad sanitaria." | Política de la organización |
| Externo (privacidad) | "Como establece la HStan-03-2006-priv, el sistema implementará provisiones para la privacidad del paciente." | Legislación |

### 4.4 El Problema de los RNF No Medibles

> "Un problema común con requerimientos no funcionales es que los usuarios o clientes con frecuencia proponen estos requerimientos como metas generales, como facilidad de uso, capacidad de que el sistema se recupere de fallas, o rapidez de respuesta al usuario. Las metas establecen buenas intenciones; no obstante, ocasionan problemas a los desarrolladores del sistema, pues dejan espacio para la interpretación y la disputa posterior una vez que se entregue el sistema."
> — Sommerville, Cap. 4, §4.1.2, p. 89

**Ejemplo del libro:**

| Versión | Texto | Problema |
|---|---|---|
| ❌ Meta (no válida) | "Para el personal médico debe ser fácil usar el sistema, y éste último debe organizarse de tal forma que minimice los errores del usuario." | Subjetivo, no verificable, genera disputas en entrega |
| ✅ RNF válido | "Después de cuatro horas de capacitación, el personal médico usará todas las funciones del sistema. Después de esta capacitación, los usuarios experimentados no deberán superar el promedio de dos errores cometidos por hora de uso del sistema." | Medible, verificable objetivamente |

> "Siempre que sea posible, se deberán escribir de manera cuantitativa los requerimientos no funcionales, de manera que puedan ponerse objetivamente a prueba."
> — Sommerville, Cap. 4, §4.1.2, p. 89

### 4.5 Tabla de Métricas para RNF (Fig. 4.5, p. 90)

| Propiedad | Medida | Ejemplo de RNF bien especificado |
|---|---|---|
| **Rapidez** | Transacciones/segundo procesadas; Tiempo de respuesta usuario/evento; Tiempo de regeneración de pantalla | "El sistema procesará ≥ 10 solicitudes de búsqueda/segundo bajo carga normal." |
| **Tamaño** | Mbytes; Número de chips ROM | "El cliente móvil no ocupará más de 50 MB de almacenamiento en el dispositivo." |
| **Facilidad de uso** | Tiempo de capacitación; Número de cuadros de ayuda | "El administrador podrá registrar un nuevo proveedor en ≤ 5 minutos sin consultar ayuda, tras 2 horas de capacitación." |
| **Fiabilidad** | Tiempo medio para falla (MTTF); Probabilidad de indisponibilidad (POFOD); Tasa de ocurrencia de falla (ROCOF); Disponibilidad (AVAIL) | "El sistema tendrá disponibilidad ≥ 99.5% mensual en horario laboral (08:00–20:00)." |
| **Robustez** | Tiempo de reinicio después de falla; % de eventos que causan falla; Probabilidad de corrupción de datos en falla | "El sistema deberá recuperarse de una falla no planificada en ≤ 30 segundos sin pérdida de datos." |
| **Portabilidad** | % de enunciados dependientes del objetivo; Número de sistemas objetivo | "≤ 5% del código fuente será dependiente de plataforma específica." |

### 4.6 Conflictos entre RNF

> "Los requerimientos no funcionales entran a menudo en conflicto e interactúan con otros requerimientos funcionales o no funcionales."
> — Sommerville, Cap. 4, §4.1.2, p. 90

**Ejemplo del libro:** El requerimiento de autenticación con tarjeta de identidad (RNF organizacional) requiere lector de tarjeta en cada computadora. Pero otro requerimiento exige acceso móvil desde laptops, que no tienen lector de tarjeta. Solución: debe permitirse un método de autenticación alternativo, lo que modifica el RNF original.

**Aplicación en el sistema:**
Los RNF se registran con `tipo: 'no_funcional'` y código `RNF-XXX`. A diferencia de los RF, los RNF deben tener su `criterioAceptacion` en **formato métrico**: valor objetivo + método de medición (ej: "Medido con herramienta de carga simulando 100 usuarios concurrentes"). Un RNF aprobado con criterio no medible es inválido según Sommerville.

---

## 5. EL PROCESO DE INGENIERÍA DE REQUERIMIENTOS
*Cap. 4 §4.4 y §4.5, p. 99-109*

### 5.1 Definición del Proceso

> "Los procesos de ingeniería de requerimientos incluyen cuatro actividades de alto nivel. Éstas se enfocan en valorar si el sistema es útil para la empresa (estudio de factibilidad), descubrir requerimientos (adquisición y análisis), convertir dichos requerimientos en alguna forma estándar (especificación) y comprobar que los requerimientos definan realmente el sistema que quiere el cliente (validación)."
> — Sommerville, Cap. 4, §4.4, p. 99

El proceso **no es secuencial** sino iterativo:

> "En la práctica, la ingeniería de requerimientos es un proceso iterativo donde las actividades están entrelazadas. Las actividades están organizadas como un proceso iterativo alrededor de una espiral, y la salida es un documento de requerimientos del sistema."
> — Sommerville, Cap. 4, §4.4, p. 99

### 5.2 Las Actividades del Proceso (Fig. 4.12 y Fig. 4.13)

El modelo en espiral de Sommerville (Fig. 4.12, p. 99) organiza cuatro actividades iterativas dentro de la adquisición y análisis:

#### ACTIVIDAD 1 — Descubrimiento de Requerimientos

> "Éste es el proceso de interactuar con los participantes del sistema para descubrir sus requerimientos. También los requerimientos de dominio de los participantes y la documentación se descubren durante esta actividad."
> — Sommerville, Cap. 4, §4.5, p. 101

- **Qué implica:** Entrevistas, escenarios, casos de uso, etnografía, talleres con stakeholders
- **Quién participa:** Todos los stakeholders identificados en M1 (clientes, usuarios finales, reguladores, expertos de dominio)
- **Qué produce:** Lista raw de requerimientos sin clasificar
- **Referencia técnica:** M3-02 — Técnicas de Adquisición de Requerimientos (entrevistas, escenarios, casos de uso, etnografía)

#### ACTIVIDAD 2 — Clasificación y Organización

> "Esta actividad toma la compilación no estructurada de requerimientos, agrupa requerimientos relacionados y los organiza en grupos coherentes. La forma más común de agrupar requerimientos es usar un modelo de la arquitectura del sistema, para identificar subsistemas y asociar los requerimientos con cada subsistema."
> — Sommerville, Cap. 4, §4.5, p. 101

- **Qué implica:** Identificar duplicados, agrupar por módulo/subsistema, detectar contradicciones preliminares
- **Qué produce:** Requerimientos organizados por categoría (`funcional`, `no_funcional`, `dominio`)

#### ACTIVIDAD 3 — Priorización y Negociación

> "Inevitablemente, cuando intervienen diversos participantes, los requerimientos entrarán en conflicto. Esta actividad se preocupa por priorizar los requerimientos, así como por encontrar y resolver conflictos de requerimientos mediante la negociación. Por lo general, los participantes tienen que reunirse para resolver las diferencias y estar de acuerdo con el compromiso de los requerimientos."
> — Sommerville, Cap. 4, §4.5, p. 101

- **Qué implica:** Sesiones MoSCoW con stakeholders (ver Sección 8 de este archivo), resolución de conflictos
- **Qué produce:** Backlog priorizado con campo `prioridad` asignado a cada requerimiento

#### ACTIVIDAD 4 — Especificación

> "Los requerimientos se documentan e ingresan en la siguiente ronda de la espiral. Pueden producirse documentos de requerimientos formales o informales."
> — Sommerville, Cap. 4, §4.5, p. 102

- **Qué implica:** Redactar los requerimientos en las plantillas estructuradas (Sección 9 de este archivo)
- **Qué produce:** SRS borrador; versión preliminar del documento con secciones y requerimientos formalizados

La espiral termina con las actividades de validación del SRS completo (ver M3-05 — Validación de Requerimientos).

### 5.3 Mapeo Actividades IR → Estados del SRS en el Sistema

Esta tabla define **cuándo cambia el estado del SRS** y qué lo activa. Es el entregable operativo más importante del Módulo 3.

| Actividad IR (Sommerville) | Estado `EstadoSRS` en sistema | Artefacto producido | Transición activada por |
|---|---|---|---|
| Proyecto alcanza `activo_en_definicion` | `'no_iniciado'` | SRS vacío creado | Sistema automáticamente |
| Estudio de factibilidad + Comprensión del dominio | `'en_adquisicion'` | Glosario actualizado (M1-03); Stakeholders confirmados | Inicio manual del proceso IR |
| Descubrimiento de requerimientos | `'en_adquisicion'` | Lista raw de requerimientos (todos en `'propuesto'`) | El equipo registra primeros requerimientos |
| Creación de prototipos / validación temprana | `'en_prototipado'` | Mockups, prototipos de pantalla validados con cliente | Decision del equipo |
| Clasificación y organización | `'en_modelado'` | Requerimientos organizados por tipo y subsistema | Todos los reqs. tienen `tipo` asignado |
| Priorización y negociación | `'en_especificacion'` | Backlog priorizado (campo `prioridad` completo) | Sesión MoSCoW completada |
| Especificación formal | `'en_especificacion'` | SRS borrador con plantillas completas | Requerimientos tienen `criterioAceptacion` |
| Revisión y validación | `'en_validacion'` | SRS revisado, observaciones registradas | Inicio revisión formal |
| Aprobación con observaciones | `'con_observaciones'` | Observaciones documentadas, reqs. en `'diferido'` o `'rechazado'` | Revisor registra observaciones |
| Aprobación final | `'aprobado'` | SRS v1.0 firmado (`aprobadoPor`, `fechaAprobacion`) | Aprobador firma el SRS |

**Regla de oro:** El estado del SRS avanza secuencialmente. No puede ir de `'en_adquisicion'` a `'aprobado'` sin pasar por `'en_validacion'`.

---

## 6. EL DOCUMENTO DE REQUERIMIENTOS DEL SOFTWARE (SRS)
*Cap. 4 §4.2, p. 91-94*

### 6.1 Propósito del Documento

> "El documento de requerimientos de software —llamado algunas veces especificación de requerimientos de software o SRS— es un comunicado oficial de lo que deben implementar los desarrolladores del sistema. Incluye tanto los requerimientos del usuario para un sistema, como una especificación detallada de los requerimientos del sistema."
> — Sommerville, Cap. 4, §4.2, p. 91

### 6.2 Audiencias del SRS (Fig. 4.6, p. 92)

El SRS tiene múltiples lectores con necesidades distintas:

| Actor | Uso del SRS |
|---|---|
| **Clientes del sistema** | Especifican los requerimientos y los leen para comprobar que cubren sus necesidades. Especifican los cambios a los requerimientos. |
| **Administradores** | Usan el documento de requerimientos para planear una cotización para el sistema y el proceso de desarrollo del sistema. |
| **Ingenieros del sistema** | Usan los requerimientos para entender qué sistema debe desarrollarse. |
| **Ingenieros de prueba** | Usan los requerimientos para desarrollar pruebas de validación para el sistema. |
| **Ingenieros de mantenimiento** | Usan los requerimientos para entender el sistema y las relaciones entre sus componentes. |

> "La diversidad de posibles usuarios significa que el documento de requerimientos debe ser un compromiso entre la comunicación de los requerimientos a los clientes, la definición de los requerimientos con detalle preciso para desarrolladores y examinadores, y la inclusión de información sobre la posible evolución del sistema."
> — Sommerville, Cap. 4, §4.2, p. 92

### 6.3 Estructura Estándar del SRS (Fig. 4.7, p. 93) — Estándar IEEE

| Capítulo | Descripción | Campo SRS en sistema |
|---|---|---|
| **Prefacio** | Define el número esperado de lectores del documento, historia de versiones, causas para la creación de nuevas versiones y resumen de cambios. | Campo `version`, `fechaUltimaRevision`, `observaciones` |
| **Introducción** | Describe la necesidad para el sistema, detalla brevemente sus funciones y explica cómo se ajusta a los objetivos empresariales de la organización. | Alimentado desde Perfil de Entidad (M1) y Tipo de Proyecto (M2) |
| **Glosario** | Define los términos técnicos usados en el documento, sin hacer conjeturas sobre la experiencia del lector. | Alimentado desde Glosario de Entidad (M1-03) |
| **Definición de requerimientos del usuario** | Servicios que se ofrecen al usuario y requerimientos no funcionales en lenguaje comprensible para los clientes. | Requerimientos con `tipo: 'funcional'` y `tipo: 'no_funcional'` en nivel de usuario |
| **Arquitectura del sistema** | Panorama de alto nivel de la arquitectura anticipada y distribución de funciones a través de los módulos. | Alimentado desde Módulo 2 (alcance técnico) |
| **Especificación de requerimientos del sistema** | Requerimientos funcionales y no funcionales con detalle técnico. Interfaces a otros sistemas. | Array `requerimientos[]` del SRS |
| **Modelos del sistema** | Modelos gráficos que muestran relaciones entre componentes (diagramas UML, flujos de datos). | Referencia a diagramas externos |
| **Evolución del sistema** | Supuestos fundamentales sobre los que se basa el sistema y cambios anticipados por evolución. | Campo `observaciones` del SRS |
| **Apéndices** | Información específica: descripciones de hardware, bases de datos, configuraciones mínimas. | Documentación externa |
| **Índice** | Índice alfabético, de diagramas y de funciones para navegación del documento. | Generado automáticamente |

### 6.4 El SRS en Metodologías Ágiles

> "Los métodos de desarrollo ágiles argumentan que los requerimientos cambian tan rápidamente que un documento de requerimientos se vuelve obsoleto tan pronto como se escribe... En lugar de un documento formal, los enfoques como la programación extrema recopilan de manera incremental requerimientos del usuario y los escriben en tarjetas como historias de usuario."
> — Sommerville, Cap. 4, §4.2, p. 91

Sin embargo:

> "Aún resulta útil escribir un breve documento de apoyo que defina los requerimientos de la empresa y los requerimientos de confiabilidad para el sistema; es fácil olvidar los requerimientos que se aplican al sistema como un todo cuando uno se enfoca en los requerimientos funcionales para la siguiente liberación del sistema."
> — Sommerville, Cap. 4, §4.2, p. 91

**Implicación para el sistema:** En proyectos con metodología ágil (registrada en M2), el SRS puede ser menos formal, pero los RNF y requerimientos de dominio **siempre** deben documentarse formalmente.

### 6.5 Evolución del SRS

El SRS es un documento vivo. Su evolución está controlada por:
- **Campo `version`:** Incrementa cada vez que el SRS es revisado y aprobado (ej: `1.0`, `1.1`, `2.0`)
- **Campo `fechaUltimaRevision`:** Registra cuándo fue revisado por última vez
- **Campo `aprobadoPor` + `fechaAprobacion`:** Solo se completan al alcanzar estado `'aprobado'`
- **Política de control de cambios:** Ver M1-06 — Control de Configuración para el proceso formal de cambio

**Aplicación en el sistema:**
El tipo `SRS` del sistema es la implementación digital del documento SRS de Sommerville. Cada campo del tipo tiene correspondencia directa con una sección del estándar IEEE 830. El array `requerimientos[]` es la Sección 6 (Especificación de requerimientos del sistema).

---

## 7. PRIORIZACIÓN MoSCoW
*Cap. 4 §4.4 / §4.5, p. 101-102*

### 7.1 Definición y Origen

MoSCoW es el método de priorización de requerimientos más utilizado en ingeniería de software. El nombre es un acrónimo de los cuatro niveles de prioridad. Sommerville lo presenta en el contexto de la actividad de **priorización y negociación** del proceso IR, cuando múltiples stakeholders tienen visiones contradictorias sobre qué debe incluir el sistema.

Su propósito es forzar a los stakeholders a una conversación explícita sobre qué es verdaderamente esencial vs. deseable, evitando la trampa común donde "todo es Must Have".

### 7.2 Los Cuatro Niveles

#### Must Have — `'must'`
El sistema **no puede** funcionar sin este requerimiento. Su ausencia es un fallo total del sistema. Criterio de asignación: si se elimina este requerimiento, el sistema no puede ser entregado o no cumple el objetivo mínimo acordado.

- Representa el MVP (Minimum Viable Product) del sistema
- Generalmente: requerimientos de seguridad críticos, flujos principales, RNF de disponibilidad mínima

#### Should Have — `'should'`
Requerimiento **importante** pero con workaround conocido y aceptable. El sistema puede funcionar sin él, pero de forma degradada. Criterio: los stakeholders aceptarían entregar sin este requerimiento si el tiempo o presupuesto lo exige, pero preferirían incluirlo.

- Generalmente: mejoras de usabilidad, reportes secundarios, automatizaciones de procesos manuales

#### Could Have — `'could'`
Requerimiento **deseable** que solo se incluye si el tiempo y los recursos lo permiten. Criterio: tiene valor para el usuario pero su ausencia no afecta la percepción de éxito del proyecto.

- Generalmente: funcionalidades "nice to have", optimizaciones de rendimiento menores, personalización

#### Won't Have (this time) — `'wont'`
Requerimiento **explícitamente excluido** de esta versión del sistema. **Importante:** Won't Have no significa "nunca"; significa "no en esta versión". El valor de este nivel es documentar formalmente los requerimientos que están fuera del alcance, evitando el scope creep durante el desarrollo.

- Generalmente: funcionalidades para futuras versiones, integraciones no prioritarias

### 7.3 Proceso de Priorización con Stakeholders

El proceso de negociación MoSCoW sigue estos pasos:
1. **Lista inicial:** Todos los requerimientos descubiertos en la adquisición comienzan como `'must'` (tendencia natural de los stakeholders)
2. **Restricción de Must:** Recordar a los participantes que Must = "el sistema no puede funcionar sin esto"; forzar reclasificación a Should o Could
3. **Resolución de conflictos:** Cuando stakeholders están en desacuerdo, la prioridad la determina quien tiene autoridad sobre el presupuesto del proyecto
4. **Regla de distribución recomendada:**

| Nivel | % del esfuerzo total recomendado |
|---|---|
| Must Have | ~60% |
| Should Have | ~20% |
| Could Have | ~20% |
| Won't Have | 0% (esta versión) |

> "Es imposible complacer por completo a cada participante, pero, si algunos suponen que sus visiones no se consideraron de forma adecuada, quizás intenten deliberadamente socavar el proceso de IR."
> — Sommerville, Cap. 4, §4.5, p. 102

### 7.4 Conexión MoSCoW → Estimación (M2-02)

La distribución MoSCoW tiene impacto directo en el presupuesto y cronograma definidos en M2:
- **Must Have define el alcance mínimo** garantizado al cliente
- **Should Have define el alcance objetivo** si el proyecto marcha según lo planificado
- **Could Have es el buffer** de alcance que se sacrifica si hay retrasos
- Los requerimientos `'wont'` documentan el acuerdo de exclusión, protegiendo al equipo de reclamaciones por funcionalidades no incluidas

### 7.5 Mapeo al Campo `prioridad` del Tipo `Requerimiento`

| Nivel MoSCoW | Valor `prioridad` | Criterio de asignación |
|---|---|---|
| Must Have | `'must'` | Sin este req., el sistema no funciona o no cumple el objetivo mínimo pactado |
| Should Have | `'should'` | Importante, existe workaround aceptable, se incluye si el plan lo permite |
| Could Have | `'could'` | Deseable, sin impacto crítico si se omite, sacrificable ante retrasos |
| Won't Have | `'wont'` | Explícitamente fuera de esta versión; documentado para versiones futuras |

**Aplicación en el sistema:**
Todo `Requerimiento` en el sistema tiene campo `prioridad` obligatorio. No se puede aprobar (`estado: 'aprobado'`) un requerimiento sin prioridad asignada. Los requerimientos con `prioridad: 'wont'` se registran con `estado: 'diferido'` automáticamente.

---

## 8. ESPECIFICACIÓN CON LENGUAJE NATURAL ESTRUCTURADO
*Cap. 4 §4.3, p. 94-98*

### 8.1 El Problema del Lenguaje Natural Libre

Sommerville documenta los problemas sistemáticos del lenguaje natural sin estructura:

> "La flexibilidad del lenguaje natural, que es tan útil para la especificación, causa problemas frecuentemente. Hay espacio para escribir requerimientos poco claros, y los lectores —los diseñadores— pueden malinterpretar los requerimientos porque tienen un antecedente diferente al del usuario. Es fácil mezclar muchos requerimientos en una sola oración y quizá sea difícil estructurar los requerimientos en lenguaje natural."
> — Sommerville, Cap. 4, §4.3, p. 94

Problemas específicos documentados:
1. **Ambigüedad:** Una oración puede tener múltiples interpretaciones correctas desde el punto de vista gramatical
2. **Mezcla de requerimientos:** Un párrafo puede contener 3-4 requerimientos distintos no identificados
3. **Falta de estructura:** Sin formato estándar, diferentes autores especifican requerimientos de formas incompatibles
4. **Dependencia del contexto:** El significado depende del antecedente del lector

### 8.2 Lenguaje Natural Estructurado como Solución

> "El lenguaje natural estructurado es una manera de escribir requerimientos del sistema, donde está limitada la libertad del escritor de requerimientos y todos éstos se anotan en una forma estándar. Aunque este enfoque conserva la mayoría de la expresividad y comprensibilidad del lenguaje natural, asegura que haya cierta uniformidad sobre la especificación."
> — Sommerville, Cap. 4, §4.3.2, p. 97

**Ventajas:**
- Reduce la variabilidad en la especificación
- Organiza requerimientos de forma efectiva y comparable
- Obliga a pensar en precondiciones, postcondiciones y efectos colaterales

**Limitaciones:**
- Aún puede haber ambigüedades en cálculos complejos
- No siempre puede expresar restricciones muy complejas sin complementar con tablas o diagramas

### 8.3 Campos de la Especificación Estructurada (Fig. 4.10, p. 97)

Cuando se usa un enfoque estructurado, Sommerville establece que debe incluirse:

> "Cuando use una forma estándar para especificar requerimientos funcionales, debe incluir la siguiente información:
> 1. Una descripción de la función o entidad a especificar.
> 2. Una descripción de sus entradas y sus procedencias.
> 3. Una descripción de sus salidas y a dónde se dirigen.
> 4. Información sobre los datos requeridos para el cálculo u otras entidades en el sistema que se utilizan.
> 5. Una descripción de la acción que se va a tomar.
> 6. Si se usa un enfoque funcional, una precondicin establece lo que debe ser verdadero antes de llamar a la función, y una postcondición especifica lo que es verdadero después de llamar a la función.
> 7. Una descripción de los efectos colaterales si acaso hay alguno de la operación."
> — Sommerville, Cap. 4, §4.3.2, p. 98

### 8.4 Lineamientos para Especificación en Lenguaje Natural (p. 96)

> "Para minimizar la interpretación errónea al escribir los requerimientos en lenguaje natural, se recomienda seguir algunos lineamientos sencillos:
> 1. Elabore un formato estándar y asegúrese de que todas las definiciones de requerimientos se adhieran a dicho formato.
> 2. Utilice el lenguaje de manera clara para distinguir entre requerimientos obligatorios y deseables. Los primeros son requerimientos que el sistema debe soportar y, por lo general, se escriben en futuro: 'debe ser'. En tanto que los requerimientos deseables no son necesarios y se escriben como condicional: 'debería ser'.
> 3. Use texto resaltado (negrilla, cursiva o color) para seleccionar partes clave del requerimiento.
> 4. No deduzca que los lectores entienden el lenguaje técnico de la ingeniería de software.
> 5. Siempre que sea posible, asocie una razón con cada requerimiento de usuario."
> — Sommerville, Cap. 4, §4.3.1, p. 96

### 8.5 Plantillas Operativas del Sistema

Estas plantillas están listas para copiar y pegar en el Módulo 3. Mapean los campos de la especificación de Sommerville al tipo `Requerimiento` de `src/types/index.ts`.

---

#### PLANTILLA RF — Requerimiento Funcional

```
Código:           RF-[NNN]  (ej: RF-001, RF-042)
Tipo:             funcional
Título:           [VERBO EN INFINITIVO + OBJETO]  (máx. 60 chars)
                  Ejemplo: "Registrar nuevo proveedor en el sistema"

Descripción:      "El sistema DEBE [acción específica] cuando [condición/contexto]
                   para que [actor/usuario] pueda [objetivo de negocio]."
                  Ejemplo: "El sistema DEBE permitir al administrador registrar un nuevo 
                   proveedor con razón social, RUT, contacto y categoría, cuando el 
                   administrador acceda al módulo de proveedores, para que los proyectos 
                   puedan asociar proveedores sin duplicados."

Precondición:     [Estado del sistema o del actor ANTES de ejecutar el RF]
                  Ejemplo: "El administrador ha iniciado sesión con rol 'admin'."

Postcondición:    [Estado del sistema DESPUÉS de ejecutar exitosamente el RF]
                  Ejemplo: "El proveedor queda registrado en la base de datos con 
                   estado 'activo' y aparece disponible para asociación a proyectos."

Actor principal:  [Stakeholder que origina o ejecuta el RF]
                  Fuente: Stakeholders de Entidad (M1-02)

Criterio de       DADO [contexto inicial del sistema]
aceptación:       CUANDO [acción específica que realiza el actor]
(formato BDD)     ENTONCES [resultado observable y verificable]

                  Ejemplo: 
                  DADO que el administrador está en el módulo de proveedores
                  CUANDO ingresa todos los campos requeridos y presiona "Guardar"
                  ENTONCES el sistema guarda el proveedor, muestra confirmación de 
                  éxito y el proveedor aparece en el listado con estado 'activo'.

Prioridad MoSCoW: must | should | could | wont
Fuente:           [Stakeholder que solicitó este requerimiento — referencia a M1-02]
Estado inicial:   propuesto
Versión:          1
```

---

#### PLANTILLA RNF — Requerimiento No Funcional

```
Código:           RNF-[NNN]  (ej: RNF-001, RNF-015)
Tipo:             no_funcional
Título:           [PROPIEDAD DE CALIDAD] - [COMPONENTE O SISTEMA AFECTADO]
                  Ejemplo: "Disponibilidad - Plataforma Web en Horario Laboral"

Descripción:      "El sistema DEBE [propiedad medible] en [contexto de aplicación]."
                  Ejemplo: "El sistema DEBE estar disponible ≥ 99.5% del tiempo 
                   en días hábiles entre 08:00 y 20:00 hora local."

Tipo de RNF:      producto | organizacional | externo
                  (según clasificación Fig. 4.3 de Sommerville)

Métrica:          [Valor objetivo numérico] medido por [método de medición específico]
                  Ejemplo: "Disponibilidad ≥ 99.5% medida mensualmente con 
                   herramienta de monitoreo (uptime robot o equivalente)."

Criterio de       [Prueba específica y medible que demuestra cumplimiento del RNF]
aceptación:       Ejemplo: "El reporte mensual de uptime del sistema mostrará 
                   disponibilidad ≥ 99.5% durante 3 meses consecutivos de operación."

Prioridad MoSCoW: must | should | could | wont
Fuente:           [Stakeholder que solicitó o impuso este requerimiento — referencia M1-02]
Estado inicial:   propuesto
Versión:          1
```

---

#### PLANTILLA RD — Requerimiento de Dominio

```
Código:           RD-[NNN]  (ej: RD-001, RD-008)
Tipo:             dominio
Título:           [REGLA O RESTRICCIÓN DEL DOMINIO]
                  Ejemplo: "Cálculo de reajuste por IPC en contratos de construcción"

Descripción:      "Según [referencia del dominio: norma, ley, práctica sectorial], 
                   el sistema DEBE [comportamiento específico] cuando [condición del dominio]."
                  Ejemplo: "Según la Ley 19.886 (Ley de Compras Públicas), el sistema 
                   DEBE registrar todos los proveedores con RUT válido chileno antes 
                   de permitir su asociación a contratos con organismos del Estado."

Fuente de dominio: [Referencia al término en Glosario de Entidad (M1-03) que origina este req.]
Criterio de       [Verificación que demuestra que la regla de dominio se implementó correctamente]
aceptación:       
Prioridad MoSCoW: must | should | could | wont
Fuente:           [Experto de dominio o stakeholder que identificó esta restricción]
Estado inicial:   propuesto
Versión:          1
```

---

## 9. CICLO DE VIDA DEL REQUERIMIENTO EN EL SISTEMA
*Basado en Cap. 4 §4.7 — Administración de Requerimientos, p. 111-114*

### 9.1 Diagrama de Estados del Requerimiento Individual

El campo `estado` del tipo `Requerimiento` implementa el siguiente ciclo de vida:

```
                    ┌─────────────────────────────────┐
                    │                                 │
                 [propuesto]                          │
                    │                                 │
         ┌──────────┼──────────┐                      │
         │                     │                      │
         ▼                     ▼                      │
    [aprobado]           [rechazado]                  │
         │                     │                      │
         │          ┌──────────┘                      │
         │          │                                 │
         │          ▼                                 │
         │      [diferido] ──────────────────────────►│ (versión futura)
         │                                            
         ▼                                            
   [implementado]                                     
```

El estado `'con_observaciones'` aplica al **SRS contenedor**, no al requerimiento individual.

### 9.2 Transiciones del Ciclo de Vida

| Transición | Condición que la activa | Quién la ejecuta | Qué documenta el sistema | ¿Afecta estado del SRS? |
|---|---|---|---|---|
| `propuesto` → `aprobado` | El equipo técnico y stakeholders revisan y validan el requerimiento | Rol: Analista / Product Owner | Incrementa `version` del req.; registra `actualizadoEn` | Si todos los reqs. críticos están `aprobados`: SRS avanza a `'en_especificacion'` |
| `propuesto` → `rechazado` | El requerimiento es redundante, inviable técnicamente o fuera de alcance | Rol: Analista / Arquitecto | Registra razón en `observaciones` del SRS | Si hay muchos rechazados: SRS puede retroceder a `'en_adquisicion'` |
| `aprobado` → `diferido` | Prioridad `'wont'` confirmada en negociación MoSCoW | Rol: Product Owner / Cliente | Registra en `observaciones` para versión futura | No afecta estado del SRS |
| `propuesto` → `diferido` | Stakeholder acepta postponer sin revisión completa | Rol: Product Owner | Igual que anterior | No afecta estado del SRS |
| `aprobado` → `implementado` | El desarrollo completó e integró la funcionalidad del requerimiento | Rol: Desarrollador / QA | Actualiza `actualizadoEn` | Si todos los `must` están `implementados`: condición para cierre del proyecto |
| Cualquier estado → `propuesto` | Se propone un cambio al requerimiento aprobado | Rol: Cualquier stakeholder | Incrementa `version`; el cambio pasa por proceso formal (M1-06) | SRS vuelve a `'en_validacion'` |

> "Si un nuevo requerimiento tiene que implementarse urgentemente, siempre existe la tentación para cambiar el sistema y luego modificar de manera retrospectiva el documento de requerimientos. Hay que tratar de evitar esto, pues casi siempre conducirá a que la especificación de requerimientos y la implementación del sistema se salgan de ritmo."
> — Sommerville, Cap. 4, §4.7.2, p. 114

### 9.3 Administración del Cambio en Requerimientos

> "La administración del cambio en los requerimientos debe aplicarse a todos los cambios propuestos a los requerimientos de un sistema, después de aprobarse el documento de requerimientos."
> — Sommerville, Cap. 4, §4.7.2, p. 113

Las tres etapas del proceso de cambio:
1. **Análisis del problema:** Identificar si el cambio propuesto es válido y necesario
2. **Análisis del impacto:** Qué otros requerimientos se ven afectados; qué costo tiene el cambio
3. **Implementación:** Modificar el SRS, incrementar `version` del requerimiento, actualizar diseño si aplica

**Aplicación en el sistema:**
El campo `version: number` del tipo `Requerimiento` implementa el historial de cambios. Cada vez que un requerimiento aprobado se modifica, `version` se incrementa. El historial completo de cambios se registra mediante el mecanismo de auditoría definido en M1-06.

---

## 10. CONEXIÓN M1 + M2 → M3: EL SRS COMO SÍNTESIS

El SRS no es un documento que nace de la nada al comenzar el Módulo 3. Es la síntesis formal de toda la información capturada en M1 y M2. Esta tabla cierra el arco de los tres módulos:

| Sección del SRS | Necesita información de | Artefacto fuente | Módulo origen |
|---|---|---|---|
| **Contexto organizacional** | Quién es el cliente, su industria, sus procesos | Perfil de Entidad (tipo, sector, tamaño) | M1 |
| **Stakeholders del sistema** | Quiénes participan en el sistema, sus roles, sus objetivos | Stakeholders de Entidad (M1-02) | M1 |
| **Glosario de dominio** | Terminología específica del cliente, sin presuponer conocimiento | Glosario de Entidad (M1-03) | M1 |
| **Alcance del proyecto** | Qué tipo de sistema se construye, cuál es su criticidad | Tipo de proyecto, criticidad, metodología (M2) | M2 |
| **Requerimientos funcionales** | Qué debe hacer el sistema (resultado del proceso IR) | Proceso de adquisición IR (M3-02) | M3 |
| **Requerimientos no funcionales** | Restricciones de calidad, rendimiento, seguridad | Proceso de adquisición IR (M3-02) | M3 |
| **Requerimientos de dominio** | Reglas del sector, leyes aplicables, restricciones técnicas del cliente | Glosario M1-03 + IR (M3-02) | M1 + M3 |
| **Riesgos del SRS** | Riesgos específicos de requerimientos (ambigüedad, alcance) | Registro de riesgos del proyecto (M2) | M2 |
| **Criterios de aceptación** | Cómo se verificará que cada requerimiento fue implementado | Proceso de validación (M3-05) | M3 |
| **Evolución anticipada** | Qué puede cambiar en el futuro según el plan del proyecto | Plan del proyecto, restricciones presupuestales (M2) | M2 |

**Implicación arquitectónica:** Esta dependencia entre módulos es la razón por la que el estado `activo_en_definicion` del proyecto (M2-04) es el **disparador** del Módulo 3. Sin el perfil completo de la entidad (M1) y el plan del proyecto (M2), el SRS no tiene contexto suficiente para ser construido correctamente.

---

## 11. CHECKLIST DE COMPLETITUD

Esta lista verifica que todos los elementos teóricos requeridos están documentados en este archivo:

### Marco Teórico Core
- [x] Definición formal de requerimiento según Sommerville (texto exacto)
- [x] Dualidad del término "requerimiento" (alto nivel vs. especificación detallada)
- [x] Definición de requerimientos del usuario (texto exacto)
- [x] Definición de requerimientos del sistema (texto exacto)
- [x] Definición de requerimientos de dominio (texto exacto)
- [x] Problema de la captura de requerimientos de dominio
- [x] Definición de requerimientos funcionales (texto exacto)
- [x] Problema de imprecisión en RF (ejemplo MHC-PMS)
- [x] Completitud y consistencia como propiedades ideales de RF
- [x] Definición de requerimientos no funcionales (texto exacto)
- [x] Por qué los RNF son más críticos que los RF
- [x] Clasificación completa de RNF (producto, organizacional, externo)
- [x] Problema de RNF no medibles (ejemplo MHC-PMS usabilidad)
- [x] Tabla de métricas para RNF (Fig. 4.5 del libro)
- [x] Conflictos entre RNF (ejemplo autenticación vs. acceso móvil)

### Proceso IR
- [x] Definición del proceso IR como espiral iterativa
- [x] Las 4 actividades del proceso IR (Fig. 4.12 y 4.13)
- [x] Mapeo actividades IR → estados EstadoSRS en el sistema
- [x] Técnicas de adquisición (entrevistas, escenarios, casos de uso, etnografía)

### Documento SRS
- [x] Propósito del documento de requerimientos
- [x] Audiencias del SRS (Fig. 4.6 del libro)
- [x] Estructura completa del SRS según IEEE 830 (Fig. 4.7 del libro)
- [x] SRS en metodologías ágiles
- [x] Evolución y control de versiones del SRS

### Priorización
- [x] Definición y origen del método MoSCoW
- [x] Los 4 niveles con criterios de asignación
- [x] Proceso de priorización con stakeholders
- [x] Regla de distribución de esfuerzo
- [x] Conexión MoSCoW → estimación (M2-02)
- [x] Mapeo niveles MoSCoW → campo `prioridad` del tipo Requerimiento

### Especificación
- [x] Problema del lenguaje natural libre
- [x] Lenguaje natural estructurado como solución
- [x] Campos de la especificación estructurada (Fig. 4.10 del libro)
- [x] Lineamientos de especificación en lenguaje natural (5 reglas)
- [x] Plantilla operativa RF completa (lista para usar en M3)
- [x] Plantilla operativa RNF completa (lista para usar en M3)
- [x] Plantilla operativa RD completa (lista para usar en M3)
- [x] Criterio de aceptación en formato BDD (DADO/CUANDO/ENTONCES)

### Ciclo de Vida y Administración
- [x] Diagrama de estados del Requerimiento individual
- [x] Tabla de transiciones con condiciones, roles y efectos
- [x] Proceso formal de administración del cambio (3 etapas)
- [x] Justificación del campo `version: number` del tipo Requerimiento

### Síntesis del Sistema
- [x] Flujo M1 + M2 → M3 documentado
- [x] Tabla de alimentación del SRS desde artefactos de M1 y M2
- [x] Justificación del disparador `activo_en_definicion`

### Justificación de Campos del Tipo `SRS`
- [x] `id`, `proyectoId`: Identificación y trazabilidad
- [x] `version`: Control de versiones del SRS (§4.2)
- [x] `estado: EstadoSRS`: Los 8 estados mapean al proceso IR en espiral (§4.4)
- [x] `requerimientos[]`: Especificación de requerimientos del sistema (§4.1)
- [x] `fechaUltimaRevision`: Administración de requerimientos (§4.7)
- [x] `aprobadoPor` + `fechaAprobacion`: Validación formal (§4.6)
- [x] `observaciones`: Observaciones del proceso de validación
- [x] `creadoEn` + `actualizadoEn`: Trazabilidad temporal

### Justificación de Campos del Tipo `Requerimiento`
- [x] `id`, `proyectoId`, `codigo`: Identificación única (§4.7.1)
- [x] `tipo: TipoRequerimiento`: Tres tipos de Sommerville §4.1
- [x] `prioridad: PrioridadRequerimiento`: MoSCoW §4.5
- [x] `titulo`, `descripcion`: Plantilla de especificación §4.3
- [x] `criterioAceptacion`: Verificabilidad §4.6
- [x] `fuente`: Trazabilidad al stakeholder (§4.7.1)
- [x] `estado`: Ciclo de vida del requerimiento §4.7
- [x] `version: number`: Control de cambios §4.7.2

---

*Fin del archivo M3-01-ingenieria-requerimientos.md*
*Próximo archivo: M3-02-tecnicas-adquisicion.md*
