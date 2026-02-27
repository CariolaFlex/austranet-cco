# M3-02 · Técnicas de Recopilación de Requerimientos

---

## 1. Metadatos

| Campo | Valor |
|---|---|
| **Nombre del archivo** | `M3-02-tecnicas-recopilacion.md` |
| **Módulo** | Módulo 3 — Documentación de Objetivos y Alcance (SRS) |
| **Capítulo fuente** | Cap. 4 §4.5 — Adquisición y Análisis de Requerimientos |
| **Libro** | *Ingeniería de Software*, Ian Sommerville, 9ª Ed., Pearson, 2011 |
| **Versión** | 1.0.0 |
| **Fecha** | 2026-02-25 |
| **Estado** | activo |
| **Depende de** | M1-01, M1-03, M1-04, M2-02, M3-01 |
| **Alimenta** | M3-01 §6 Actividad 2 — Recopilación de Requerimientos |

---

## 2. Objetivo del Documento

Este archivo documenta el **marco teórico completo de las técnicas de recopilación de requerimientos** que el analista aplica cuando el SRS de un proyecto entra en estado `en_adquisicion`. Cubre: qué son las técnicas, cómo se ejecutan, cuándo aplicar cada una y el proceso operativo para completar la fase.

> **Principio rector:** La calidad del SRS depende directamente de la calidad de la recopilación. Un SRS construido con entrevistas superficiales producirá requerimientos incompletos que se descubrirán durante el desarrollo, cuando el costo de cambio es máximo. Un error en los requerimientos detectado en producción puede costar hasta 100× más que uno detectado durante la adquisición. **Ver M2-02, Sección 4** para el análisis de costos de cambio tardío.

**Lo que este archivo NO repite:**
- El proceso IR completo → **Ver M3-01, Sección 6**
- El ciclo de vida del SRS y sus estados → **Ver M3-01, Sección 5**
- La identificación de stakeholders → **Ver M1-01**
- El glosario del dominio del cliente → **Ver M1-03**
- La referencia inicial a etnografía → **Ver M1-04** (aquí se desarrolla con máximo detalle)

---

## 3. El Proceso de Descubrimiento de Requerimientos

> **Fuente:** Cap. 4 §4.5.1, p. 103

### 3.1 Definición formal según Sommerville

> *"El descubrimiento de requerimientos […] es el proceso de recopilar información sobre el sistema requerido y los sistemas existentes, así como de separar, a partir de esta información, los requerimientos del usuario y del sistema."* (§4.5.1, p. 103)

Las fuentes de información durante esta fase incluyen:

- **Documentación existente** del cliente (manuales, procedimientos, formularios)
- **Participantes del sistema** (stakeholders identificados en M1-01)
- **Especificaciones de sistemas similares** o predecesores
- **Interacción directa** vía entrevistas y observaciones
- **Escenarios y prototipos** para hacer concreto lo abstracto

### 3.2 Por qué el descubrimiento es la actividad más difícil de la IR

Sommerville identifica **5 razones estructurales** que hacen del descubrimiento la actividad más difícil (§4.5, p. 102):

1. **Los participantes frecuentemente no saben lo que quieren** excepto en términos generales; encuentran difícil articular qué quieren que haga el sistema.
2. **Conocimiento tácito del dominio:** los especialistas usan terminología que los ingenieros no dominan, y cierto conocimiento es tan familiar para ellos que no lo verbalizan porque *"creen que es tan fundamental que no vale la pena mencionarlo."*
3. **Multiplicidad de fuentes:** diferentes stakeholders tienen distintos requerimientos expresados en formas variadas; el analista debe descubrir todas las fuentes potenciales e identificar similitudes y conflictos.
4. **Factores políticos:** los administradores pueden solicitar requerimientos específicos para aumentar su influencia en la organización.
5. **Dinamismo del entorno:** el ambiente económico y empresarial cambia durante el proceso de análisis; pueden surgir nuevos requerimientos de nuevos stakeholders no consultados originalmente.

### 3.3 Tipos de requerimientos difíciles de descubrir

| Tipo | Descripción | Técnica recomendada |
|---|---|---|
| **Dados por obvios** | El cliente los omite porque los considera implícitos en su actividad diaria | Etnografía, observación |
| **Que emergen del uso real** | Solo aparecen cuando el usuario interactúa con el sistema real o un prototipo | Prototipado, etnografía combinada |
| **Que el cliente no sabe que tiene** | Necesidades latentes no verbalizables hasta ver una alternativa concreta | Escenarios, prototipos |
| **Contradictorios entre stakeholders** | Visiones incompatibles entre roles distintos (ej.: usuario final vs. gerente) | Talleres JAD, negociación |

### 3.4 El analista como facilitador, no como transcriptor

Sommerville distingue explícitamente el rol del analista efectivo:

> *"Los entrevistadores efectivos poseen dos características: 1. Tienen mentalidad abierta, evitan ideas preconcebidas sobre los requerimientos y escuchan a los participantes. 2. Instan al entrevistado con una pregunta de trampolín para continuar la plática, dar una propuesta de requerimientos o trabajar juntos en un sistema de prototipo. Cuando se pregunta al individuo 'dime qué quieres' es improbable que alguien consiga información útil."* (§4.5.2, p. 105)

El analista **no transcribe lo que el stakeholder dice** — **facilita la emergencia** de requerimientos que el stakeholder no sabría articular por sí mismo. Esta diferencia es crítica: un transcriptor produce un SRS del cliente; un facilitador produce un SRS del sistema.

> **Aplicación en el sistema:** El estado `en_adquisicion` representa exactamente esta fase. El sistema debe exigir al analista registrar las técnicas aplicadas antes de permitir el avance a `en_modelado`. El checklist de la Sección 12 operacionaliza este control. Si el analista solo realizó una entrevista cerrada, el sistema debe bloquear el avance y señalar las técnicas faltantes.

---

## 4. Entrevistas

> **Fuente:** Cap. 4 §4.5.2, p. 104–105

### 4.1 Tipos de entrevistas

#### Entrevistas cerradas

> *"Entrevistas cerradas, donde los participantes responden a un conjunto de preguntas preestablecidas."* (§4.5.2, p. 104)

| Dimensión | Descripción |
|---|---|
| **Definición** | Conjunto fijo de preguntas elaboradas previamente por el analista |
| **Cuándo usar** | Validación de supuestos, recopilación de datos cuantitativos, verificación de requerimientos ya identificados |
| **Ventajas** | Resultados comparables entre stakeholders; fácil de procesar; eficiente en tiempo |
| **Desventajas** | No permite descubrir lo desconocido; el conocimiento tácito no emerge; el entrevistado responde lo que se le pregunta, no lo que sabe |

#### Entrevistas abiertas

> *"Entrevistas abiertas, en las cuales no hay agenda predefinida. El equipo de ingeniería de requerimientos explora un rango de conflictos con los participantes del sistema y, como resultado, desarrolla una mejor comprensión de sus necesidades."* (§4.5.2, p. 104)

| Dimensión | Descripción |
|---|---|
| **Definición** | Sin agenda predefinida; exploración libre guiada por el analista |
| **Cuándo usar** | Exploración inicial del dominio; stakeholders con conocimiento tácito profundo; sistemas nuevos sin precedente en el cliente |
| **Ventajas** | Permite descubrir lo inesperado; el stakeholder guía hacia sus verdaderas necesidades; compatible con el conocimiento tácito |
| **Desventajas** | Riesgo de desviarse del objetivo; difícil de procesar; requiere analistas experimentados |

> **Por qué en IR se prefieren las abiertas:** Sommerville es explícito: *"Rara vez funcionan bien las discusiones completamente abiertas. Con frecuencia debe plantear algunas preguntas para comenzar y mantener la entrevista enfocada"* — la práctica recomendada es la **combinación de ambos tipos**. Sin embargo, en etapas de exploración inicial las abiertas son superiores porque el conocimiento tácito **no emerge con preguntas cerradas**: el especialista no puede articular lo que da por obvio si no se le da espacio para explorar. (§4.5.2, p. 104)

### 4.2 El proceso de la entrevista

#### Preparación (antes de la sesión)
- Revisar la ficha del stakeholder en **M1-01** (rol, nivel de influencia, área funcional)
- Revisar el **glosario de dominio M1-03** para no malinterpretar terminología técnica del cliente
- Revisar riesgos de tipo `requerimientos` del proyecto en **M2-03**
- Preparar preguntas de trampolín (abiertas) para iniciar y preguntas de sondeo para profundizar
- Definir los **objetivos específicos** de la sesión (qué se quiere descubrir)

#### Apertura (rapport)
- Explicar el propósito del sistema y del proceso de IR en lenguaje no técnico
- Clarificar el rol del stakeholder en el proceso: *"Usted es el experto, yo soy quien aprende"*
- Aclarar condiciones de grabación y uso de la información

#### Desarrollo (escucha activa)
- Usar preguntas abiertas para explorar; cerradas para confirmar
- Tomar notas continuamente; no interrumpir el flujo del entrevistado
- Identificar y anotar términos nuevos para el glosario
- Detectar inconsistencias entre lo declarado y lo implícito

#### Cierre (confirmación)
- Resumir los puntos clave identificados y pedir confirmación: *"¿Entendí bien que...?"*
- Identificar temas pendientes para la próxima sesión
- Confirmar disponibilidad para seguimiento

#### Post-entrevista (documentación inmediata)
> Documentar **inmediatamente después** de la sesión, nunca después de 24 horas. La memoria del analista degrada rápidamente los detalles contextuales.
- Completar la plantilla de entrevista (ver §4.4)
- Crear requerimientos candidatos en estado `propuesto` en el Módulo 3
- Agregar términos nuevos al glosario de M1-03
- Identificar requerimientos que requieren confirmación adicional

### 4.3 Técnicas de preguntas

| Tipo | Definición | Ejemplo | Cuándo usar |
|---|---|---|---|
| **Abierta** | No tiene respuesta predefinida; invita a explorar | "¿Cómo gestionan actualmente los proyectos?" | Exploración inicial |
| **Cerrada** | Respuesta sí/no o de opción limitada | "¿El sistema actual genera informes automáticos?" | Validar supuestos |
| **Sondeo** | Profundiza en una respuesta ya dada | "¿Puede darme un ejemplo concreto de eso?" | Después de respuestas generales |
| **Hipotética** | Explora escenarios no ocurridos | "¿Qué pasaría si el proveedor no entrega a tiempo?" | Descubrir manejo de excepciones |
| **Contraste** | Compara el estado actual con el deseado | "¿En qué se diferencia el proceso actual del ideal?" | Identificar brechas y mejoras |

### 4.4 Problemas comunes en entrevistas y cómo mitigarlos

| Problema | Descripción según Sommerville | Mitigación |
|---|---|---|
| **Stakeholder no sabe lo que quiere** | Solo expresa necesidades en términos generales; no puede articular funcionalidades | Usar escenarios concretos; mostrar ejemplos de sistemas similares |
| **Dice lo que cree que el analista quiere escuchar** | Responde en función de lo que percibe como "correcto" o esperado | Preguntas neutras; validar con otros stakeholders; etnografía |
| **Conflicto entre lo declarado y lo real** | Las estructuras organizacionales publicadas *"rara vez coinciden con la realidad de la toma de decisiones"* (§4.5.2, p. 105) | Complementar con observación etnográfica |
| **Diferencia entre responsable y usuario final** | El jefe declara lo que cree que necesita; el usuario final tiene requerimientos distintos | Entrevistar ambos por separado; cruzar resultados |

### 4.5 Plantilla de Entrevista del Sistema

> **Nota de implementación:** El campo `Entrevistado` **no es texto libre**. Es una **referencia directa al ID del stakeholder** registrado en M1-01. El sistema debe renderizarlo como un selector de la lista de stakeholders vinculados a la Entidad del proyecto.

| Campo | Tipo | Descripción | Obligatorio |
|---|---|---|---|
| `entrevista_id` | `ENT-XXX` | Identificador único de la sesión | Sí |
| `fecha` | `YYYY-MM-DD HH:MM` | Timestamp de inicio de la sesión | Sí |
| `entrevistado_id` | `REF → M1-01.stakeholder_id` | ID del stakeholder entrevistado | Sí |
| `entrevistado_rol` | Derivado de M1-01 | Rol en la organización del cliente | Auto |
| `influencia` | Derivado de M1-01 | `alta / media / baja` | Auto |
| `entrevistador` | ID del analista | Miembro del equipo del sistema | Sí |
| `objetivos` | Texto libre | Qué se quería descubrir en esta sesión | Sí |
| `duracion_min` | Número | Duración en minutos | Sí |
| `modalidad` | Enum | `presencial / remota_video / remota_audio` | Sí |
| `grabacion` | Boolean | `true / false` | Sí |
| `tipo_entrevista` | Enum | `abierta / cerrada / mixta` | Sí |
| `reqs_emergentes` | `[ ]` | Lista de IDs de requerimientos creados (`RF-XXX`, `RNF-XXX`) | No |
| `terminos_glosario` | `[ ]` | Lista de términos nuevos → agregar a M1-03 | No |
| `conflictos_detectados` | Texto libre | Contradicciones entre stakeholders detectadas | No |
| `observaciones` | Texto libre | Notas contextuales, lenguaje corporal, ambiente | No |
| `proxima_sesion` | `YYYY-MM-DD` | Fecha propuesta y objetivos de seguimiento | No |

> **Aplicación en el sistema:** Cada entrevista registrada en estado `en_adquisicion` debe quedar vinculada al SRS del proyecto mediante su `entrevista_id`. El sistema debe mostrar en el panel del SRS el conteo de sesiones realizadas, stakeholders de influencia `alta` consultados vs. pendientes, y requerimientos emergentes acumulados.

---

## 5. Escenarios

> **Fuente:** Cap. 4 §4.5.3, p. 105–106

### 5.1 Definición formal según Sommerville

> *"Los escenarios son particularmente útiles para detallar un bosquejo de descripción de requerimientos. Se trata de ejemplos sobre descripciones de sesiones de interacción. Cada escenario abarca comúnmente una interacción o un número pequeño de interacciones posibles."* (§4.5.3, p. 105)

> *"Por lo general, las personas encuentran más sencillo vincularse con ejemplos reales que con descripciones abstractas. Pueden comprender y criticar un escenario sobre cómo interactuar con un sistema de software."* (§4.5.3, p. 105)

### 5.2 Por qué los escenarios son más efectivos que las preguntas abstractas

Los escenarios funcionan porque:

1. **Concretan lo abstracto:** El cliente puede validar una narrativa de uso real aunque no pueda leer un documento técnico.
2. **Activan la memoria episódica:** Rememorar una situación real es más efectivo que abstraer reglas generales.
3. **Revelan excepciones:** Al narrar *qué puede salir mal*, afloran requerimientos de manejo de errores que las preguntas directas no capturan.
4. **Son el puente hacia casos de uso formales:** Un escenario validado por el cliente se convierte en la base del caso de uso técnico para el equipo de desarrollo.

### 5.3 Estructura de un escenario según Sommerville

Sommerville define que *"en su forma más general, un escenario puede incluir"* (§4.5.3, p. 105–106):

1. **Situación inicial:** *"Una descripción de qué esperan el sistema y los usuarios cuando inicia el escenario"*
2. **Flujo normal:** *"Una descripción en el escenario del flujo normal de los eventos"*
3. **Excepciones:** *"Una descripción de qué puede salir mal y cómo se manejaría"*
4. **Actividades concurrentes:** *"Información de otras actividades que están en marcha al mismo tiempo"*
5. **Estado final:** *"Una descripción del estado del sistema cuando termina el escenario"*

**Ejemplo del libro** (§4.5.3, Fig. 4.14, p. 106) — Escenario MHC-PMS: Ingreso de historia médica de nuevo paciente:


SUPOSICIÓN INICIAL: El paciente observa a un auxiliar médico que elabora
un registro en el sistema y recaba información personal (nombre, dirección,
edad, etc.). Una enfermera ingresa en el sistema y obtiene la historia médica.
NORMAL: La enfermera busca al paciente por su nombre completo. Si hay más
de un paciente con el mismo apellido, para identificarlo se usa el nombre y
la fecha de nacimiento. La enfermera elige la opción de menú y añade la
historia médica [...]
QUÉ PUEDE SALIR MAL: Si no existe el registro del paciente o no puede
encontrarse, la enfermera debe crear un nuevo registro [...] Las condiciones
o los medicamentos del paciente no se ingresan en el menú [...]
OTRAS ACTIVIDADES: Mientras se ingresa la información, otros miembros del
personal pueden consultar los registros, pero no editarlos.
ESTADO DEL SISTEMA AL COMPLETAR: El registro del paciente, incluida su
historia médica, se integra en la base de datos [...]
text

### 5.4 Escenario vs. Caso de Uso

| Dimensión | Escenario | Caso de Uso |
|---|---|---|
| **Naturaleza** | Narrativo, en lenguaje natural del cliente | Formal, estructurado para el equipo técnico |
| **Abstracción** | Instancia concreta de una interacción | Clase de interacciones (agrupa múltiples escenarios) |
| **Audiencia** | Stakeholders no técnicos | Ingenieros de software |
| **Propósito principal** | Validar comprensión con el cliente | Especificar interacciones para implementación |
| **Nivel de detalle** | Variable; según lo que el cliente relata | Preciso; incluye flujos alternativos numerados |

> *"No hay distinción tajante y rápida entre escenarios y casos de uso. Algunas personas consideran que cada caso de uso es un solo escenario; otras [...] encapsulan un conjunto de escenarios en un solo caso de uso. Cada escenario es un solo hilo a través del caso de uso."* (§4.5.4, p. 107)

### 5.5 Plantilla Operativa de Escenario

| Campo | Descripción | Obligatorio |
|---|---|---|
| `escenario_id` | `ESC-XXX` | Sí |
| `titulo` | Nombre descriptivo en lenguaje del cliente (ej: "Registrar un nuevo contrato de obra") | Sí |
| `actor_principal` | `REF → M1-01.stakeholder_id` — Stakeholder protagonista | Sí |
| `situacion_inicial` | Estado del sistema antes de que comience la interacción | Sí |
| `flujo_normal` | Pasos 1 a N en lenguaje natural del cliente | Sí |
| `excepciones` | Qué puede fallar en cada paso y cómo se resuelve | Sí |
| `actividades_concurrentes` | Qué otros usuarios o procesos ocurren en paralelo | No |
| `estado_final` | Qué cambió en el sistema al completarse el escenario | Sí |
| `rfs_derivados` | `[ RF-XXX, RF-YYY ]` — IDs de RF generados a partir de este escenario | No |
| `rnfs_derivados` | `[ RNF-XXX ]` — IDs de RNF generados a partir de este escenario | No |
| `casos_uso_derivados` | `[ CU-XXX ]` — IDs de casos de uso formalizados desde este escenario | No |
| `validado_por` | `REF → M1-01.stakeholder_id` — Stakeholder que confirmó el escenario | No |

> **Aplicación en el sistema:** Los escenarios son el **artefacto de validación con el cliente** durante `en_adquisicion`. Cada escenario debe vincularse a los RF que genera. El analista usa escenarios para presentar al cliente su comprensión del negocio antes de redactar requerimientos formales. Un escenario aprobado por el cliente reduce drásticamente el riesgo de requerimientos mal entendidos.

---

## 6. Casos de Uso

> **Fuente:** Cap. 4 §4.5.4, p. 106–108; Cap. 5 §5.2.1, p. 125

### 6.1 Definición formal según Sommerville

> *"En su forma más sencilla, un caso de uso identifica a los actores implicados en una interacción, y nombra el tipo de interacción. Entonces, esto se complementa con información adicional que describe la interacción con el sistema."* (§4.5.4, p. 107)

> *"Los casos de uso son una técnica de descubrimiento de requerimientos que se introdujo por primera vez en el método Objectory [Jacobson et al., 1993]. Ahora se ha convertido en una característica fundamental del modelado de lenguaje unificado."* (§4.5.4, p. 106)

### 6.2 Elementos de un caso de uso

#### Actor
- **Definición:** Cualquier entidad (persona u otro sistema) que interactúa con el sistema desde el exterior.
- **Actor primario:** Quien inicia la interacción y tiene el objetivo principal (ej.: analista que crea un SRS).
- **Actor secundario:** Quien participa en la interacción pero no la inicia (ej.: sistema de notificaciones).

#### Estructura del caso de uso
- **Nombre:** Verbo + objeto en lenguaje del negocio (ej.: "Registrar proyecto")
- **Flujo básico:** Secuencia exitosa de pasos (happy path)
- **Flujos alternativos:** Variantes del flujo básico
- **Flujos de excepción:** Qué ocurre cuando algo falla

#### Relaciones entre casos de uso
| Relación | Descripción | Símbolo UML |
|---|---|---|
| `<<include>>` | El caso de uso base siempre incluye el caso incluido | Flecha punteada con etiqueta |
| `<<extend>>` | El caso extendido puede ocurrir condicionalmente | Flecha punteada con etiqueta |
| **Generalización** | Un caso de uso hijo hereda comportamiento del padre | Flecha sólida |

### 6.3 Diagrama de casos de uso: qué muestra y qué no

**Muestra:**
- Los actores del sistema y sus roles
- Las interacciones de alto nivel con el sistema
- Agrupación de interacciones relacionadas

**No muestra** (limitaciones según Sommerville):
- La secuencia exacta de pasos dentro de una interacción
- La lógica interna del sistema
- Restricciones no funcionales
- Requerimientos de dominio o reglas del negocio

> *"Los escenarios y los casos de uso son técnicas efectivas para adquirir requerimientos de los participantes que interactúan directamente con el sistema. Sin embargo, debido a que se enfocan en interacciones con el sistema, no son tan efectivos para adquirir restricciones o requerimientos empresariales y no funcionales de alto nivel, ni para descubrir requerimientos de dominio."* (§4.5.4, p. 108)

### 6.4 Por qué los casos de uso solos no son suficientes

Los casos de uso capturan **qué hace el sistema desde el punto de vista del actor**, pero no capturan:
- RNF (rendimiento, seguridad, disponibilidad)
- Requerimientos de dominio (normas, regulaciones)
- Restricciones organizacionales
- Requerimientos que emergen de actividades implícitas (→ etnografía)

> **Aplicación en el sistema:** Los casos de uso son el **puente entre escenarios narrativos y RF formales del SRS**. El flujo es: Escenario (cliente valida) → Caso de Uso (equipo técnico formaliza) → RF en Módulo 3 (base de implementación). Un escenario puede derivar múltiples casos de uso; cada caso de uso se convierte en uno o más RF. Esta cadena de trazabilidad debe quedar registrada en los campos `casos_uso_derivados` de la plantilla de escenario y `escenario_origen` del RF.

---

## 7. Historias de Usuario

> **Fuente:** Cap. 3 (Desarrollo Ágil) + Cap. 4 §4.5.3 (escenarios como historias en XP); construcción desde principios ágiles de Sommerville

### 7.1 Definición según Sommerville

Sommerville referencia explícitamente las historias de usuario en el contexto de escenarios y programación extrema:

> *"Las historias que se usan en programación extrema, estudiadas en el capítulo 3, son un tipo de escenario de requerimientos."* (§4.5.3, p. 105)

Las historias de usuario son **escenarios de requerimientos de grano fino**, formulados desde la perspectiva del usuario, en el formato:


Como [rol del usuario]
quiero [acción o funcionalidad]
para [beneficio o valor de negocio]
text

**Ejemplo aplicado al sistema:**

Como analista de IR
quiero registrar las técnicas de recopilación aplicadas a un SRS
para poder verificar que se cumplió el criterio de avance a 'en_modelado'
text

### 7.2 Criterios de aceptación

Formato **DADO / CUANDO / ENTONCES** (referencia M3-01 §9):


DADO que el SRS está en estado 'en_adquisicion'
Y se han registrado al menos 2 técnicas distintas
Y todos los stakeholders de influencia 'alta' han sido consultados
CUANDO el analista solicita avanzar a 'en_modelado'
ENTONCES el sistema permite el cambio de estado
Y registra la fecha de cierre de adquisición
Y notifica al equipo del proyecto
text

### 7.3 Historia de usuario vs. RF formal

| Criterio | Historia de Usuario | RF Formal |
|---|---|---|
| **Perspectiva** | Usuario / negocio | Sistema / funcionalidad |
| **Lenguaje** | Natural, del cliente | Técnico, preciso |
| **Verificación** | Criterios de aceptación DADO/CUANDO/ENTONCES | Casos de prueba formales |
| **Trazabilidad** | Backlog → Sprint | SRS → Diseño → Código |
| **Cambios** | Renegociables por prioridad | Requieren gestión de cambios formal |

### 7.4 Tabla de equivalencia metodológica

| Metodología | Técnica de especificación | Nivel de formalidad | Artefacto principal |
|---|---|---|---|
| Cascada / RUP | RF con plantilla formal estructurada | Alto | Documento SRS con IEEE 830 |
| Incremental | RF simplificados + casos de uso | Medio | SRS por módulo/versión |
| Ágil / Scrum | Historia de usuario + criterios de aceptación | Bajo–Medio | Product Backlog |
| Cualquier metodología | Escenarios | Bajo (validación) | Narrativa validada por cliente |

> **Aplicación en el sistema:** El Módulo 3 soporta las metodologías del M2-02. Si el proyecto tiene `metodologia = agil`, los RF pueden originarse desde historias de usuario con sus criterios de aceptación. Si `metodologia = cascada`, se usan RF con plantilla formal. Los escenarios son aplicables en ambos casos como instrumento de validación con el cliente.

---

## 8. Etnografía

> **Fuente:** Cap. 4 §4.5.5, p. 108–109; Fig. 4.16, p. 109
> **Extiende:** M1-04 (referencia inicial); aquí se desarrolla el proceso completo.

### 8.1 Definición formal

> *"La etnografía es una técnica de observación que se usa para entender los procesos operacionales y ayudar a derivar requerimientos de apoyo para dichos procesos. Un analista se adentra en el ambiente laboral donde se usará el sistema. Observa el trabajo diario y toma notas acerca de las tareas existentes en que intervienen los participantes."* (§4.5.5, p. 108)

> *"El valor de la etnografía es que ayuda a descubrir requerimientos implícitos del sistema que reflejan las formas actuales en que trabaja la gente, en vez de los procesos formales definidos por la organización."* (§4.5.5, p. 108)

### 8.2 Qué revelan las observaciones que las entrevistas no revelan

Sommerville identifica **dos tipos específicos** de requerimientos que solo la etnografía captura (§4.5.5, p. 109):

#### Tipo 1: Requerimientos de la práctica real vs. el proceso formal

> *"Requerimientos que se derivan de la forma en que realmente trabaja la gente, en vez de la forma en la cual las definiciones del proceso indican que debería trabajar."*

**Ejemplo del libro:** Los controladores de tráfico aéreo desactivan deliberadamente el sistema de alerta de conflicto aunque los procedimientos especifiquen su uso obligatorio — porque su estrategia real de control requiere esa flexibilidad. El sistema formal *no* capturaría este requerimiento de "opción de desactivación temporal" mediante entrevistas.

**Aplicación:** En el sistema, un gerente puede decir *"los proyectos siempre se aprueban antes de iniciar"*, pero la observación puede revelar que informalmente comienzan actividades de pre-inicio antes de la aprobación formal. Esto genera un requerimiento de gestión de estado pre-aprobación que ninguna entrevista produciría.

#### Tipo 2: Requerimientos de cooperación entre usuarios

> *"Requerimientos que se derivan de la cooperación y el conocimiento de las actividades de otras personas."*

**Ejemplo del libro:** Los controladores de tráfico aéreo usan el conocimiento del trabajo de controladores adyacentes para predecir carga futura. El sistema debe exponer visibilidad entre sectores — un requerimiento invisible en entrevistas individuales.

**Aplicación:** El analista puede descubrir que los miembros del equipo usan WhatsApp o correos informales para coordinar cambios al alcance del proyecto — lo que revela un requerimiento de notificaciones y trazabilidad de cambios que ningún stakeholder mencionaría explícitamente.

#### Requerimientos adicionales que emergen de la observación

| Tipo de requerimiento | Descripción | Ejemplo concreto |
|---|---|---|
| **Implícitos en la rutina** | Tareas automáticas que el usuario no menciona porque las da por sentadas | El analista siempre hace una copia de respaldo manual antes de enviar un SRS |
| **De contexto físico** | Restricciones del ambiente real de trabajo | El sistema se usa en obras con mala conectividad → offline requerido |
| **De restricción temporal** | Momentos del día/semana donde el sistema NO puede usarse | Cierre de mes bloquea registros durante 48h |
| **De herramientas no oficiales** | Hojas de cálculo, formularios en papel que complementan el sistema oficial | Excel de seguimiento paralelo al sistema → revelan qué falta en el sistema |

### 8.3 El proceso de observación etnográfica

#### Preparación (antes de observar)
- Estudiar el **glosario del dominio M1-03** antes de ingresar al ambiente del cliente
- Obtener los **permisos formales** del cliente (confidencialidad, acceso a instalaciones)
- Revisar la **lista de stakeholders M1-01** para identificar a quiénes observar
- Definir el **objetivo de observación**: ¿qué proceso se quiere entender?
- Preparar el instrumento de registro (plantilla de notas de campo)

#### Durante la observación (qué registrar y cómo)
- Registrar **secuencialmente** las acciones del usuario, no las interpretaciones
- Anotar **herramientas usadas** (incluyendo las no oficiales: papel, Excel, chat)
- Registrar **interrupciones y desvíos** del proceso formal
- Anotar **conversaciones informales** que revelen coordinación entre usuarios
- **No interrumpir** el trabajo; las preguntas van al final o en pausas naturales
- Usar el formato: `[HH:MM] ACCIÓN — CONTEXTO — OBSERVACIÓN`

#### Análisis (convertir observaciones en requerimientos candidatos)
1. Revisar las notas de campo y subrayar patrones repetidos
2. Identificar **brechas** entre el proceso formal descrito y el observado
3. Formular requerimientos candidatos en lenguaje: *"El sistema debe soportar [comportamiento observado]"*
4. Clasificar como RF, RNF o requerimiento de dominio
5. Marcar los que requieren validación con el stakeholder

#### Validación (confirmar la interpretación)
- Presentar al usuario observado los requerimientos derivados en lenguaje natural
- Preguntar: *"¿Este requerimiento refleja correctamente lo que observé?"*
- Ajustar según feedback; nunca asumir que la interpretación del analista es correcta

#### Duración recomendada según el tipo de proceso

| Tipo de proceso | Duración recomendada |
|---|---|
| Proceso simple y repetitivo (ej.: registro de datos) | 2–4 horas |
| Proceso complejo con variantes (ej.: gestión de proyectos) | 1–3 días |
| Proceso de ciclo largo (ej.: proceso completo de licitación) | Varias semanas, por fases |

### 8.4 Combinación etnografía + prototipado

> **Fuente:** Fig. 4.16, p. 109

Sommerville presenta el **modelo combinado etnografía-prototipado** como el ciclo más efectivo para descubrir requerimientos en sistemas con usuarios finales identificados:


[Análisis etnográfico]
↓
[Reuniones de interrogatorio] ←─────────────────────┐
↓ │
[Etnografía enfocada] │
↓ │
[Desarrollo del sistema genérico / Prototipo] │
↓ │
[Evaluación de prototipos] ──────────────────────────→┘
text

> *"La etnografía informa del desarrollo del prototipo, de modo que se requieren menos ciclos de refinamiento del prototipo. Más aún, la creación de prototipos se enfoca en la etnografía al identificar problemas y preguntas que entonces pueden discutirse con el etnógrafo."* (§4.5.5, p. 109)

**Por qué el prototipo hace emerger conocimiento tácito:**

El prototipo hace concreto lo que el usuario no puede verbalizar. Al interactuar con un prototipo, el usuario dice *"esto no es como lo hago"* — revelando el requerimiento implícito que ni la entrevista ni la observación capturaron. Es la externalización del conocimiento tácito mediante la reacción a un artefacto concreto.

**Cuándo este ciclo es obligatorio según Sommerville:**

El ciclo etnografía + prototipado es obligatorio cuando:
- El sistema reemplaza un proceso manual complejo con fuerte componente tácito
- Los usuarios finales tienen dificultad para articular sus necesidades
- El dominio es nuevo para el equipo de desarrollo
- El riesgo de requerimientos incorrectos es alto (sistemas críticos)

> **Aplicación en el sistema (justificación del estado `en_prototipado`):**
> La etnografía justifica la existencia del estado `en_prototipado` en el ciclo de vida del SRS. Este estado no es opcional: es la respuesta técnica al hecho, documentado por Sommerville, de que el conocimiento tácito no emerge completamente ni con entrevistas ni con observación sola. **Un proyecto con `tipo = nuevo_desarrollo` y usuarios finales identificados DEBE pasar por `en_prototipado` antes de `en_especificacion`**. El sistema debe generar una advertencia si un SRS con estas características intenta avanzar de `en_adquisicion` directamente a `en_modelado` sin haber pasado por `en_prototipado`. El estado `en_prototipado` es la implementación del ciclo Fig. 4.16 en el workflow del sistema.

---

## 9. Talleres de Requerimientos (JAD / Workshops)

> **Fuente:** Principios derivados de Cap. 4 §4.5 (trabajo con múltiples participantes) y §4.5 p. 101–102 (negociación de requerimientos y resolución de conflictos)

### 9.1 Definición y propósito

Un taller de requerimientos (Joint Application Design – JAD, o Requirements Workshop) es una **sesión estructurada** en la que múltiples stakeholders y el analista trabajan juntos para:
- Descubrir y priorizar requerimientos en tiempo real
- Resolver conflictos entre stakeholders en la misma sesión
- Construir un consenso documentado sobre el alcance del sistema

Sommerville fundamenta este enfoque al señalar que es necesario *"organizar negociaciones regulares con los participantes, de forma que se alcancen compromisos"* y que *"si algunos suponen que sus visiones no se consideraron de forma adecuada, quizás intenten deliberadamente socavar el proceso de IR"* (§4.5, p. 102).

### 9.2 Participantes y roles

| Rol | Responsabilidad en el taller |
|---|---|
| **Facilitador** (analista) | Conduce el taller, gestiona el tiempo, evita dominancias, captura acuerdos |
| **Stakeholders de influencia alta** | Decisores; sus acuerdos tienen peso en el SRS |
| **Usuarios finales** | Aportan perspectiva de uso real; validan flujos |
| **Representante técnico** | Evalúa factibilidad de requerimientos en tiempo real |
| **Secretario / Escriba** | Registra las decisiones y requerimientos emergentes |

### 9.3 Estructura típica de un taller

| Fase | Duración aprox. | Actividad |
|---|---|---|
| **Apertura** | 15 min | Objetivos del taller, reglas de participación, contexto del proyecto |
| **Revisión del contexto** | 30 min | Revisar stakeholders M1-01 y glosario M1-03; alinear vocabulario |
| **Descubrimiento** | 60–90 min | Brainstorming de requerimientos por área funcional |
| **Consolidación** | 45 min | Agrupar, eliminar duplicados, identificar conflictos |
| **Negociación** | 30–45 min | Resolver conflictos; priorizar requerimientos |
| **Cierre** | 15 min | Resumir acuerdos, asignar seguimientos, definir próximos pasos |
| **Post-taller** | 24h | El analista redacta el acta y crea los requerimientos candidatos en el sistema |

### 9.4 Artefactos que produce un taller

- **Lista de requerimientos candidatos** con clasificación RF/RNF/dominio
- **Acta de acuerdos** con decisiones tomadas y participantes que las firmaron
- **Mapa de conflictos** detectados y cómo se resolvieron (o quedaron pendientes)
- **Términos nuevos** para agregar al glosario M1-03
- **Acuerdos de priorización** (alta/media/baja para cada requerimiento)

### 9.5 Ventajas y desventajas vs. entrevistas individuales

| Dimensión | Taller JAD | Entrevistas individuales |
|---|---|---|
| **Resolución de conflictos** | En tiempo real; todos presencian el acuerdo | Diferida; el analista media entre sesiones |
| **Tiempo total** | Menor (un taller = N entrevistas) | Mayor (N sesiones individuales) |
| **Profundidad por stakeholder** | Menor (se habla menos por persona) | Mayor (sesión dedicada) |
| **Riesgo de dominancia** | Alto (stakeholders de poder pueden silenciar a otros) | Bajo (cada uno habla en privado) |
| **Dificultad de organización** | Alta (coordinar agendas múltiples) | Baja (coordinar 1 a 1) |
| **Consenso documentado** | Inmediato y verificable | Debe construirse post-sesiones |

---

## 10. Tabla Maestra de Técnicas de Recopilación

> **Artefacto operativo principal.** El analista consulta esta tabla al inicio de la fase `en_adquisicion` para seleccionar las técnicas apropiadas al perfil del proyecto y la entidad cliente.

| Técnica | Mejor para | Stakeholders | Duración típica | Artefacto generado | Metodología compatible | Estado SRS |
|---|---|---|---|---|---|---|
| **Entrevista abierta** | Exploración inicial del dominio; sistemas nuevos; stakeholders con conocimiento tácito profundo | 1 por sesión | 60–90 min | Registro de entrevista + reqs. candidatos | Todas | `en_adquisicion` |
| **Entrevista cerrada** | Validación de supuestos; completar gaps; recopilar datos cuantitativos | 1 por sesión | 30–60 min | Formulario completado + confirmaciones | Todas | `en_adquisicion` |
| **Escenario** | Validar flujos con no técnicos; explicar comprensión del negocio al cliente; documentar casos de uso futuros | 1–3 | 30–60 min | Narrativa escrita + ESC-XXX vinculado a RF | Todas | `en_adquisicion` |
| **Caso de uso** | Especificación formal de interacciones; modelado del sistema; comunicación con equipo técnico | Equipo técnico + analistas | Variable | Diagrama UML + descripción textual estructurada | Plan-driven / RUP | `en_modelado` |
| **Historia de usuario** | Definición ágil de funcionalidades; priorización de backlog | Product Owner + usuarios finales | 15–30 min | Tarjeta + criterios de aceptación DADO/CUANDO/ENTONCES | Ágil / Scrum | `en_adquisicion` |
| **Etnografía** | Sistemas con usuarios finales directos; procesos con fuerte conocimiento tácito; reemplazos de sistemas manuales | Usuarios finales en su ambiente real | Días a semanas | Informe de observación + reqs. implícitos identificados | Todas (obligatoria en nuevo_desarrollo) | `en_adquisicion` |
| **Taller JAD** | Resolver conflictos entre stakeholders; proyectos con múltiples áreas involucradas; cuando hay contradicciones previas | Todos los stakeholders a la vez | Medio día – 1 día | Lista de reqs. consensuados + acta de acuerdos | Todas | `en_adquisicion` |

### 10.1 Criterios de selección por perfil de proyecto

| Perfil del proyecto | Técnicas obligatorias | Técnicas recomendadas | Justificación |
|---|---|---|---|
| `nuevo_desarrollo` con usuarios finales | Entrevista abierta + Etnografía | Escenarios + Taller JAD | El conocimiento tácito es máximo en sistemas completamente nuevos |
| `mejora` de sistema existente | Entrevista abierta + Escenarios | Entrevista cerrada | Los usuarios tienen sistema de referencia concreto |
| `integracion` entre sistemas | Entrevista cerrada + Casos de uso | Taller JAD (áreas involucradas) | Los requerimientos son técnicos y verificables |
| Muchos stakeholders con intereses divergentes | Taller JAD | Entrevistas individuales previas | El conflicto debe resolverse antes de redactar el SRS |
| Cliente con baja disponibilidad | Escenarios + Historias de usuario | Entrevistas cerradas asincrónicas | Minimiza tiempo de dedicación del cliente |

---

## 11. Proceso Operativo: Sesión de Recopilación en Estado `en_adquisicion`

> **Artefacto operativo principal.** Este proceso define exactamente qué hace el analista desde que el SRS entra en `en_adquisicion` hasta que avanza a `en_modelado`.

---

### ETAPA 1 — Preparación (antes de cualquier sesión)

**Acciones obligatorias:**

- [ ] Revisar la lista de stakeholders de la Entidad en **M1-01**: identificar a todos los de influencia `alta`
- [ ] Revisar el glosario de dominio de la Entidad en **M1-03**: estudiar la terminología específica antes de cualquier sesión
- [ ] Revisar los riesgos de tipo `requerimientos` del proyecto en **M2-03**
- [ ] Seleccionar técnicas según el perfil del proyecto usando la **Tabla Maestra de la Sección 10**
- [ ] Preparar la guía de preguntas (entrevista) o la agenda (taller) según las técnicas seleccionadas
- [ ] Confirmar asistencia de todos los stakeholders de influencia `alta`
- [ ] Crear el registro de la sesión en el sistema (plantilla §4.5 o §5.5 según la técnica)

---

### ETAPA 2 — Ejecución de las sesiones

**Reglas de ejecución:**

- [ ] Aplicar **mínimo 2 técnicas distintas** por proyecto antes de avanzar
- [ ] Registrar cada sesión con la plantilla correspondiente (Sección 4 o Sección 5)
- [ ] Documentar **términos nuevos** inmediatamente → agregar al glosario M1-03
- [ ] Crear requerimientos candidatos en estado `propuesto` en el Módulo 3 **a medida que emergen** (no esperar al final)
- [ ] Si la técnica es etnografía: tomar notas de campo según el formato §8.3
- [ ] Si el proyecto es `nuevo_desarrollo` con usuarios finales: planificar la sesión de prototipado → estado `en_prototipado`

---

### ETAPA 3 — Consolidación (post-sesiones)

**Acciones de consolidación:**

- [ ] Revisar **duplicados** entre requerimientos candidatos (mismo requerimiento expresado por distintos stakeholders)
- [ ] Identificar **contradicciones** entre stakeholders y documentarlas (campo `conflictos_detectados`)
- [ ] **Agrupar** requerimientos por área funcional del sistema (Módulo 1 / Módulo 2 / Módulo 3)
- [ ] **Marcar** requerimientos que necesitan validación adicional con escenarios o prototipos
- [ ] Verificar que hay cobertura de los **3 tipos**: RF, RNF y requerimientos de dominio

---

### ETAPA 4 — Criterio de avance a `en_modelado`

> **Criterio binario y verificable.** El sistema NO debe permitir el avance si alguno de los siguientes criterios no se cumple. Ningún criterio es subjetivo.

| Criterio | Verificación en el sistema | Valor mínimo requerido |
|---|---|---|
| **Técnicas aplicadas** | Conteo de registros de sesión con técnicas distintas | ≥ 2 técnicas diferentes |
| **Requerimientos candidatos** | Conteo de reqs. en estado `propuesto` vinculados al SRS | ≥ 5 requerimientos |
| **Cobertura de stakeholders** | Cruce entre M1-01 (influencia `alta`) y sesiones registradas | 100% consultados ≥ 1 vez |
| **Glosario actualizado** | Verificación de que existen entradas post-adquisicion en M1-03 | ≥ 1 término nuevo (si aplica) |
| **Conflictos documentados** | Campo `conflictos_detectados` completado o marcado "sin conflictos" | Completado explícitamente |
| **Cobertura de tipos** | Al menos 1 RF por cada actor principal identificado en M1-01 | 1 RF por actor principal |
| **Prototipado si aplica** | Si `tipo = nuevo_desarrollo` Y hay usuarios finales → estado `en_prototipado` completado | Obligatorio si aplica |
| **Cobertura de tipos de req.** | Verificar que existen RF, RNF y reqs. de dominio candidatos | ≥ 1 de cada tipo |

> **Importante:** Si algún criterio no se cumple, el sistema debe mostrar qué criterio falta y qué acción debe tomar el analista. El rechazo no puede ser genérico.

---

## 12. Checklist Operativo: Recopilación Completa

> Lista de verificación que el sistema usa para validar el avance de `en_adquisicion` a `en_modelado`.

**Técnicas y cobertura:**
- [ ] ¿Se aplicaron al menos 2 técnicas distintas de recopilación?
- [ ] ¿Se consultó a todos los stakeholders de influencia `alta` de la Entidad (M1-01) al menos 1 vez?
- [ ] ¿Hay al menos 1 RF para cada actor principal identificado en M1-01?

**Registro y trazabilidad:**
- [ ] ¿Se registraron todas las sesiones con fecha, participantes (ID stakeholder) y requerimientos emergentes?
- [ ] ¿Los términos nuevos se agregaron al glosario de la Entidad en M1-03?
- [ ] ¿Cada requerimiento candidato tiene su técnica de origen registrada?

**Conflictos y calidad:**
- [ ] ¿Se documentaron los conflictos entre stakeholders detectados (o se confirmó "sin conflictos")?
- [ ] ¿Los requerimientos candidatos cubren los 3 tipos: `funcional`, `no_funcional` y `dominio`?

**Prototipado (condicional):**
- [ ] Si el proyecto es `tipo = nuevo_desarrollo` con usuarios finales directos identificados: ¿se completó el estado `en_prototipado` con al menos una sesión de evaluación de prototipo?

**Calidad general:**
- [ ] ¿Se aplicó etnografía o prototipado si el proyecto tiene usuarios finales directos?
- [ ] ¿Hay al menos 5 requerimientos candidatos en estado `propuesto`?

---

## 13. Tabla de Conexiones con los 3 Módulos

| Técnica / Concepto | Módulo | Campo o proceso vinculado |
|---|---|---|
| **Entrevistado (ID stakeholder)** | Módulo 1 — M1-01 | `stakeholder_id`, nivel de influencia, rol en la organización |
| **Glosario de dominio** | Módulo 1 — M1-03 | Campo `terminos_glosario` de cada sesión → agrega entradas al glosario |
| **Etnografía (referencia inicial)** | Módulo 1 — M1-04 | Aquí se desarrolla el proceso completo; M1-04 es la referencia de contexto organizacional |
| **Riesgos de tipo requerimientos** | Módulo 2 — M2-03 | Guían la preparación de la entrevista (qué áreas tienen mayor incertidumbre) |
| **Costo de cambio tardío** | Módulo 2 — M2-02 §4 | Justifica la exhaustividad de la fase `en_adquisicion` |
| **Proceso IR (Actividad 2)** | Módulo 3 — M3-01 §6 | Este archivo desarrolla la Actividad 2; M3-01 define el proceso completo |
| **Criterios de aceptación DADO/CUANDO/ENTONCES** | Módulo 3 — M3-01 §9 | Formato de criterios de aceptación de historias de usuario |
| **Estado `en_adquisicion`** | Módulo 3 — M3-01 §5 | Estado del SRS donde se aplican todas las técnicas de este archivo |
| **Estado `en_prototipado`** | Módulo 3 — M3-01 §5 | Justificado por el ciclo etnografía + prototipado de Fig. 4.16 §4.5.5 |
| **Estado `en_modelado`** | Módulo 3 — M3-01 §5 | Criterio de avance definido en Sección 11 Etapa 4 de este archivo |
| **RF candidatos (estado `propuesto`)** | Módulo 3 | Creados durante `en_adquisicion`; vinculados a técnica origen y sesión |
| **RNF candidatos** | Módulo 3 | Identificados especialmente en etnografía y entrevistas abiertas |
| **Casos de uso** | Módulo 3 | Puente entre escenarios (validación con cliente) y RF formales (implementación) |
| **Escenarios (ESC-XXX)** | Módulo 3 | Artefacto de validación; vinculado a RF y CU derivados |

---

## 14. Checklist de Completitud del Documento

| Sección | Contenido | Estado |
|---|---|---|
| §1 Metadatos | Nombre, módulo, capítulo, versión, fecha, estado, dependencias | ✅ |
| §2 Objetivo | Propósito del archivo + principio rector de calidad del SRS + referencias | ✅ |
| §3 Proceso de descubrimiento | Definición §4.5.1, 5 razones de dificultad, tipos de reqs. difíciles, analista facilitador vs. transcriptor | ✅ |
| §4.1 Tipos de entrevistas | Cerradas y abiertas: definición, ventajas, desventajas, cuándo usar | ✅ |
| §4.2 Proceso de entrevista | Preparación, apertura, desarrollo, cierre, post-entrevista | ✅ |
| §4.3 Técnicas de preguntas | Abiertas, cerradas, sondeo, hipotéticas, contraste | ✅ |
| §4.4 Problemas comunes | 4 problemas con mitigación | ✅ |
| §4.5 Plantilla de entrevista | 11 campos con referencia a M1-01 para ID stakeholder | ✅ |
| §5 Escenarios | Definición, efectividad, estructura 5 partes, ejemplo del libro, escenario vs. CU, plantilla | ✅ |
| §6 Casos de uso | Definición, elementos, relaciones, qué muestra/no muestra, limitaciones, puente a RF | ✅ |
| §7 Historias de usuario | Definición desde Cap.3, formato, criterios DADO/CUANDO/ENTONCES, HU vs. RF, tabla de equivalencia | ✅ |
| §8.1 Qué revela la etnografía | 2 tipos Sommerville + 4 adicionales con tabla | ✅ |
| §8.2 Proceso de observación | Preparación, durante, análisis, validación, duración recomendada | ✅ |
| §8.3 Etnografía + prototipado | Fig. 4.16, ciclo completo, cuándo es obligatorio | ✅ |
| §8 Aplicación (estado `en_prototipado`) | Justificación explícita del estado, condición de obligatoriedad | ✅ |
| §9 Talleres JAD | Definición, participantes, estructura, artefactos, ventajas/desventajas | ✅ |
| §10 Tabla Maestra | 7 técnicas con 7 dimensiones + criterios de selección por perfil | ✅ |
| §11 Proceso Operativo | 4 etapas con criterios binarios y verificables para avance a `en_modelado` | ✅ |
| §12 Checklist operativo | 12 ítems verificables agrupados por categoría | ✅ |
| §13 Tabla de conexiones | 14 conceptos mapeados a módulo y campo específico | ✅ |
| §14 Checklist de completitud | Este checklist | ✅ |

---

*Archivo generado el 2026-02-25. Fuente principal: Sommerville, I. (2011). Ingeniería de Software, 9ª Ed. Pearson. Cap. 4 §4.5, pp. 100–109.*
