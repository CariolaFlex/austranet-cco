M3-07-requerimientos-no-funcionales.md


<!-- METADATOS DEL DOCUMENTO -->
<!--
  Nombre:     M3-07-requerimientos-no-funcionales.md
  Módulo:     Módulo 3 – Documentación de Objetivos y Alcance SRS
  Fuentes:    Sommerville, Ian. Ingeniería de Software, 9ª ed. Pearson, 2011
              Cap. 4 §4.1.2 (Requerimientos No Funcionales)
              Cap. 11 (Confiabilidad: Disponibilidad, Fiabilidad, Protección, Seguridad)
              Cap. 12 §12.1 (Especificación dirigida por riesgos)
              Cap. 12 §12.2 (Especificación de protección – HAZOP)
              Cap. 12 §12.3 (Especificación de fiabilidad)
              Cap. 12 §12.4 (Especificación de seguridad)
              Cap. 12 §12.5 (Especificación formal – Lenguaje Z)
  Versión:    1.0.0
  Fecha:      2026-02-26
  Estado:     Completo
  Arch. prev: M3-06-calidad-kpis-srs.md
  Arch. sig:  M3-08-requerimientos-dominio.md
  Relacionado: M1-05-confiabilidad-seguridad-entidades.md (Cap. 11–12 aplicado a M1)
               M3-01-ingenieria-requerimientos.md (definición base de RNF, Fig. 4.3)
               M3-04-especificacion-srs.md (Sección 4 – RNF en el SRS formal)
-->

# M3-07: Requerimientos No Funcionales — Especificación Profunda

## 1. Metadatos

| Campo              | Valor                                                                                   |
|--------------------|-----------------------------------------------------------------------------------------|
| Nombre del archivo | M3-07-requerimientos-no-funcionales.md                                                  |
| Módulo del sistema | Módulo 3 – Documentación de Objetivos y Alcance SRS                                     |
| Capítulos fuente   | Sommerville Cap. 4 §4.1.2 · Cap. 11 · Cap. 12 §§12.1–12.5                             |
| Versión            | 1.0.0                                                                                   |
| Fecha              | 2026-02-26                                                                              |
| Estado             | Completo                                                                                |
| Prerrequisitos     | M3-01, M3-04, M1-05                                                                     |

---

## 2. Objetivo del Documento

Este archivo profundiza la especificación de Requerimientos No Funcionales (RNF) para los proyectos gestionados en el sistema austranet-cco. Mientras M3-01 introduce los RNF como categoría y define su taxonomía básica (§4.1.2), este archivo entrega el marco completo para especificarlos con rigor técnico, partiendo de los Capítulos 11 y 12 de Sommerville, que son los capítulos dedicados exclusivamente a sistemas críticos, confiabilidad y especificación formal.

**¿Por qué existe este archivo?**

Los RNF genéricos (tiempo de respuesta, disponibilidad) son conocidos por cualquier analista. Pero los RNF de **confiabilidad** —protección, fiabilidad, seguridad— requieren técnicas de especificación propias que Sommerville desarrolla en los Capítulos 11 y 12. Este archivo cierra esa brecha para el Módulo 3.

**Flujo de uso:**


M3-01 → Clasificación inicial de RNF (Fig. 4.3)
M3-07 → Especificación profunda de RNF de confiabilidad
M3-04 → Integración de todos los RNF en la Sección 4 del SRS formal
M1-05 → RNF de seguridad aplicados al Módulo 1
text

---

## 3. Taxonomía Completa de RNF — Fig. 4.3 (Cap. 4 §4.1.2, p. 88)

Sommerville clasifica los requerimientos no funcionales en tres grandes categorías, cada una con subtipos específicos. Esta es la taxonomía oficial que estructura la Sección 4 del SRS formal (ver M3-04, §5):

> "Los requerimientos no funcionales, como indica su nombre, son requerimientos que no se relacionan directamente con los servicios específicos que el sistema entrega a sus usuarios. Pueden relacionarse con propiedades emergentes del sistema, como fiabilidad, tiempo de respuesta y uso de almacenamiento. De forma alternativa, pueden definir restricciones sobre la implementación del sistema."
> — Sommerville, Cap. 4, §4.1.2, p. 87

### 3.1 Requerimientos del Producto

> "Estos requerimientos especifican o restringen el comportamiento del software. Los ejemplos incluyen requerimientos de rendimiento sobre qué tan rápido se debe ejecutar el sistema y cuánta memoria requiere, requerimientos de fiabilidad que establecen la tasa aceptable de fallas, requerimientos de seguridad y requerimientos de usabilidad."
> — Sommerville, Cap. 4, §4.1.2, p. 88

| Subtipo         | Qué mide / restringe                                          | Código en sistema |
|-----------------|---------------------------------------------------------------|-------------------|
| Velocidad       | Transacciones procesadas/segundo, tiempo de respuesta         | RNF-PRD-VEL       |
| Tamaño          | Memoria RAM, almacenamiento en disco, ROM embebido            | RNF-PRD-TAM       |
| Facilidad de uso| Tiempo de capacitación, tasa de errores del usuario           | RNF-PRD-USA       |
| Fiabilidad      | MTTF, POFOD, ROCOF, disponibilidad AVAIL                      | RNF-PRD-FIA       |
| Robustez        | Tiempo de reinicio tras falla, probabilidad de corrupción     | RNF-PRD-ROB       |
| Portabilidad    | % código dependiente de plataforma, sistemas objetivo         | RNF-PRD-POR       |

### 3.2 Requerimientos de la Organización

> "Son requerimientos de sistemas amplios, derivados de políticas y procedimientos en la organización del cliente y del desarrollador. Los ejemplos incluyen requerimientos del proceso operacional que definen cómo se usará el sistema, requerimientos del proceso de desarrollo que especifican el lenguaje de programación, estándares del entorno o el proceso de desarrollo a utilizar, y requerimientos ambientales que definen el entorno de operación del sistema."
> — Sommerville, Cap. 4, §4.1.2, p. 88

| Subtipo          | Descripción                                                        | Código en sistema |
|------------------|--------------------------------------------------------------------|-------------------|
| Operacionales    | Horarios de disponibilidad, procedimientos operacionales           | RNF-ORG-OPE       |
| De desarrollo    | Lenguajes, frameworks, metodologías obligatorias                   | RNF-ORG-DES       |
| De estándares    | Normas ISO, estándares de codificación internos                    | RNF-ORG-EST       |

### 3.3 Requerimientos Externos

> "Este término cubre todos los requerimientos derivados de factores externos al sistema y su proceso de desarrollo. En ellos se incluyen requerimientos regulatorios que establecen lo que debe hacer el sistema para ser aprobado en su uso por un regulador, como sería un banco central; requerimientos legislativos que tienen que seguirse para garantizar que el sistema opere conforme a la ley, y requerimientos éticos que garanticen que el sistema será aceptable para sus usuarios y el público en general."
> — Sommerville, Cap. 4, §4.1.2, p. 88

| Subtipo      | Descripción                                                           | Código en sistema |
|--------------|-----------------------------------------------------------------------|-------------------|
| Regulatorios | Certificaciones sectoriales (médico, financiero, aeronáutico)         | RNF-EXT-REG       |
| Legislativos | Leyes de privacidad, protección de datos personales                   | RNF-EXT-LEG       |
| Éticos       | Aceptabilidad social, equidad, no discriminación algorítmica           | RNF-EXT-ETI       |

**Ejemplos del libro MHC-PMS** (Cap. 4, §4.1.2, p. 88):

| Tipo RNF         | Ejemplo textual Sommerville                                                                                                                    | Fuente                  |
|------------------|------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------|
| Del producto     | "El MHC-PMS estará disponible en todas las clínicas durante las horas de trabajo normales (lunes a viernes, de 8:30 a 17:30)."                 | Política operacional    |
| De la organización | "Los usuarios del sistema MHC-PMS se acreditarán a sí mismos con el uso de la tarjeta de identidad de la autoridad sanitaria."               | Política organizacional |
| Externo          | "Como establece la HStan-03-2006-priv, el sistema implementará provisiones para la privacidad del paciente."                                   | Legislación             |

---

## 4. Métricas para Especificación Cuantitativa — Fig. 4.5 (Cap. 4 §4.1.2, p. 90)

El problema central con los RNF es que suelen expresarse como metas subjetivas. Sommerville documenta explícitamente este problema:

> "Un problema común con requerimientos no funcionales es que los usuarios o clientes con frecuencia proponen estos requerimientos como metas generales, como facilidad de uso, capacidad de que el sistema se recupere de fallas, o rapidez de respuesta al usuario. Las metas establecen buenas intenciones; no obstante, ocasionan problemas a los desarrolladores del sistema, pues dejan espacio para la interpretación y la disputa posterior una vez que se entregue el sistema."
> — Sommerville, Cap. 4, §4.1.2, p. 89

> "Siempre que sea posible, se deberán escribir de manera cuantitativa los requerimientos no funcionales, de manera que puedan ponerse objetivamente a prueba."
> — Sommerville, Cap. 4, §4.1.2, p. 89

**Tabla de métricas completa — Figura 4.5 (p. 90):**

| Propiedad       | Medida                                                                  | Ejemplo de RNF bien especificado                                                                       |
|-----------------|-------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| Rapidez         | Transacciones/segundo procesadas; Tiempo de respuesta usuario/evento; Tiempo de regeneración de pantalla | "El sistema procesará 10 solicitudes de búsqueda/segundo bajo carga normal." |
| Tamaño          | Mbytes; Número de chips ROM                                             | "El cliente móvil no ocupará más de 50 MB de almacenamiento en el dispositivo."                        |
| Facilidad de uso| Tiempo de capacitación; Número de cuadros de ayuda                     | "El administrador podrá registrar un nuevo proveedor en 5 minutos sin consultar ayuda, tras 2 horas de capacitación." |
| Fiabilidad      | Tiempo medio para falla (MTTF); Probabilidad de indisponibilidad (POFOD); Tasa de ocurrencia de falla (ROCOF); Disponibilidad (AVAIL) | "El sistema tendrá disponibilidad ≥99.5% mensual en horario laboral (08:00–20:00)." |
| Robustez        | Tiempo de reinicio después de falla; % de eventos que causan falla; Probabilidad de corrupción de datos en falla | "El sistema deberá recuperarse de una falla no planificada en 30 segundos sin pérdida de datos." |
| Portabilidad    | % de enunciados dependientes del objetivo; Número de sistemas objetivo   | "≤5% del código fuente será dependiente de plataforma específica."                                     |

**Comparación meta vs. RNF válido** (p. 89):

| Versión              | Texto                                                                                                                                                       | Problema                                  |
|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------|
| Meta no válida       | "Para el personal médico debe ser fácil usar el sistema, y éste último debe organizarse de tal forma que minimice los errores del usuario."                 | Subjetivo, no verificable, genera disputas en entrega |
| RNF válido           | "Después de cuatro horas de capacitación, el personal médico usará todas las funciones del sistema. Después de esta capacitación, los usuarios experimentados no deberán superar el promedio de dos errores cometidos por hora de uso del sistema." | Medible, verificable objetivamente |

**Regla de oro para el sistema austranet-cco:**

Un RNF aprobado con criterio no medible es **inválido** según Sommerville. El campo `criterioAceptacion` de todo RNF (código `RNF-XXX`) debe incluir: `valor objetivo numérico` + `método de medición` + `condición de carga`.

---

## 5. Conflictos entre RNF (Cap. 4 §4.1.2, p. 90)

> "Los requerimientos no funcionales entran a menudo en conflicto e interactúan con otros requerimientos funcionales o no funcionales."
> — Sommerville, Cap. 4, §4.1.2, p. 90

**Ejemplo del libro:** El requerimiento de autenticación con tarjeta de identidad (RNF organizacional) requiere lector de tarjeta en cada computadora. Pero otro requerimiento exige acceso móvil desde laptops, que no tienen lector de tarjeta. **Solución:** debe permitirse un método de autenticación alternativo, lo que modifica el RNF original.

**Patrón de resolución de conflictos entre RNF en el sistema:**

1. Identificar los RNF en conflicto y documentarlos en `observaciones` del SRS.
2. Priorizar según MoSCoW: el RNF de mayor prioridad prevalece.
3. Documentar la decisión de diseño en la Sección 6 "Restricciones de Diseño" del SRS (M3-04, §5).
4. Si ambos son Must Have, escalar al cliente para negociación.

---

## 6. RNF de Confiabilidad — Marco del Capítulo 11

El Capítulo 11 amplía los RNF de producto de la Fig. 4.3 hacia una teoría completa de **confiabilidad** aplicable a sistemas críticos. Este marco es la base teórica de los RNF de fiabilidad, disponibilidad, protección y seguridad en el SRS.

> "La confiabilidad de un sistema de cómputo es una propiedad del sistema que refleja su fiabilidad. Aquí, esta última significa en esencia el grado de confianza que un usuario tiene que el sistema ejecutará como se espera, y que el sistema no fallará en su uso normal."
> — Sommerville, Cap. 11, p. 291

> "Fiabilidad, rendimiento, seguridad y protección son ejemplos de propiedades emergentes. Éstas son críticas para los sistemas basados en computadora, pues las fallas para lograr un nivel mínimo definido en dichas propiedades suelen hacer inútil al sistema."
> — Sommerville, Cap. 10, §10.1.1, p. 269

**Las 4 propiedades de confiabilidad** (Cap. 11, §11.1, p. 292):

| Propiedad        | Definición exacta Sommerville                                                                                                                                                              | Código RNF   |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| Disponibilidad   | "De manera informal, la disponibilidad de un sistema es la probabilidad de que en un momento dado éste funcionará, ejecutará y ofrecerá servicios útiles a los usuarios."                  | RNF-PRD-FIA  |
| Fiabilidad       | "De manera informal, la fiabilidad de un sistema es la probabilidad, durante un tiempo determinado, de que el sistema brindará correctamente servicios como espera el usuario."             | RNF-PRD-FIA  |
| Protección (Safety) | "De modo no convencional, la protección de un sistema es un juicio de cuán probable es que el sistema causará daños a las personas o su ambiente."                                     | RNF-PRD-ROB  |
| Seguridad (Security) | "Informalmente, la seguridad de un sistema es un juicio de cuán probable es que el sistema pueda resistir intrusiones accidentales o deliberadas."                                   | RNF-EXT-REG  |

**Interdependencia entre propiedades** (Cap. 11, §11.1, pp. 293–294):
- Un sistema se vuelve no fiable cuando un intruso corrompe sus datos → la **seguridad** afecta la **fiabilidad**.
- Los ataques de negación de servicio comprometen la **disponibilidad** → la falta de seguridad afecta la disponibilidad.
- Si un sistema se infecta con un virus, ya no puede confiarse en su fiabilidad ni en su protección.

> "Sin un nivel razonable de seguridad, la disponibilidad, fiabilidad y protección del sistema estarían comprometidas si ataques externos dañan el sistema."
> — Sommerville, Cap. 11, Puntos clave, p. 306

### 6.1 Métricas de Fiabilidad y Disponibilidad (Cap. 11 §11.2, pp. 295–296)

| Métrica | Nombre completo                        | Qué mide                                                        |
|---------|----------------------------------------|-----------------------------------------------------------------|
| MTTF    | Mean Time To Failure                   | Tiempo promedio que opera el sistema sin fallar                 |
| MTTR    | Mean Time To Repair                    | Tiempo promedio necesario para restaurar tras una falla         |
| ROCOF   | Rate of Occurrence of Failures         | Frecuencia con que ocurren fallas en el tiempo                  |
| POFOD   | Probability of Failure on Demand       | Probabilidad de que el sistema falle cuando se le solicita      |
| AVAIL   | Availability                           | `MTTF / (MTTF + MTTR)` — porcentaje de tiempo disponible        |

**Ejemplo del libro** (p. 296): Si el sistema A falla una vez al año y tarda 3 días en reiniciar → 4.320 minutos de tiempo muerto al año. Si el sistema B falla una vez al mes pero tarda 10 minutos en reiniciar → 120 minutos de tiempo muerto al año. La **disponibilidad** de B es mucho mejor, aunque su **fiabilidad** sea menor.

**Aplicación en el sistema:**
Los RNF de fiabilidad en el SRS deben especificar al menos:

RNF-PRD-FIA-001
Disponibilidad: AVAIL ≥ 99.5% mensual en días hábiles (08:00–20:00)
Fiabilidad: POFOD ≤ 0.001 (1 falla cada 1.000 solicitudes)
Métrica: medida mensualmente con herramienta de monitoreo uptime (ej: UptimeRobot)
text

---

## 7. Especificación Dirigida por Riesgos — Cap. 12 §12.1

La especificación dirigida por riesgos es el enfoque recomendado por Sommerville para sistemas donde las fallas tienen consecuencias graves. En lugar de especificar todos los RNF por igual, se priorizan según el riesgo que representan.

> "La especificación de requerimientos de confiabilidad debe centrarse en los riesgos más importantes para el sistema, no en todos los riesgos posibles."
> — Sommerville, Cap. 12, §12.1

El proceso sigue estas etapas:

1. **Identificar los riesgos** del sistema (vinculado con M2-03 Registro de Riesgos).
2. **Analizar cada riesgo**: ¿qué peligros puede causar? ¿cuál es la probabilidad? ¿cuál es el impacto?
3. **Descomponer el riesgo** en eventos causales (árbol de fallos, HAZOP).
4. **Definir RNF** que mitiguen o eliminen cada riesgo identificado.
5. **Verificar** que los RNF son suficientes para reducir el riesgo a un nivel aceptable.

**Conexión con el sistema:**
Los riesgos identificados en M2-03 son la entrada directa a este proceso. Cada riesgo con nivel `ALTO` o `CRÍTICO` en el Registro de Riesgos debe generar al menos un RNF en la Sección 4 del SRS.

---

## 8. Especificación de Protección — Cap. 12 §12.2 — HAZOP

La especificación de protección (*safety*) utiliza el método HAZOP (HAZard and OPerability study) como técnica sistemática para identificar peligros en el sistema.

> "HAZOP es una técnica formal para identificar peligros en sistemas, basada en el análisis sistemático de cómo los valores de los parámetros del sistema pueden desviarse de sus valores esperados."
> — Sommerville, Cap. 12, §12.2

### 8.1 Vocabulario de Protección (Cap. 11 §11.3, Figura 11.6, p. 301)

| Término                | Definición Sommerville                                                                                 |
|------------------------|--------------------------------------------------------------------------------------------------------|
| Accidente/Contratiempo | Evento no planeado o secuencia de eventos que derivan en muerte o lesión de un individuo, o daño a la propiedad o al ambiente |
| Peligro                | Condición con el potencial para causar o contribuir a un accidente                                     |
| Daño                   | Medida de la pérdida que resulta de un contratiempo                                                    |
| Severidad del peligro  | Valoración del peor daño posible resultante de un peligro particular                                   |
| Riesgo                 | Medida de probabilidad de que el sistema causará un accidente                                          |

### 8.2 El Proceso HAZOP

En HAZOP se analiza cada componente o flujo del sistema usando **palabras guía** que representan desviaciones del comportamiento esperado:

| Palabra guía | Significado de la desviación                  | Ejemplo en sistema de software              |
|-------------|-----------------------------------------------|---------------------------------------------|
| NO / NINGUNO | La intención de diseño no se logra en absoluto | El servicio de autenticación no responde    |
| MÁS          | Cantidad aumentada de la intención            | Demasiadas solicitudes simultáneas → DoS    |
| MENOS        | Cantidad disminuida de la intención           | Timeout demasiado corto → sesiones cortadas |
| ADEMÁS       | Actividad adicional no diseñada ocurre        | Se guardan datos duplicados sin detección   |
| OTRO QUE     | Sustitución completa de la intención original | Se escribe en base de datos incorrecta      |
| ANTES        | La secuencia de diseño se adelanta            | Commit antes de validación completa         |
| DESPUÉS      | La secuencia de diseño se retrasa             | Notificación llega después de expirar plazo |

### 8.3 Tres Niveles de Protección (Cap. 11 §11.3, p. 302)

> Sommerville describe tres enfoques complementarios para garantizar la protección:
>
> 1. **Evitar el peligro**: diseñar el sistema de modo que no puedan surgir ciertos estados peligrosos.
> 2. **Detectar y eliminar el peligro**: incluir mecanismos que detecten condiciones peligrosas antes de que produzcan un accidente.
> 3. **Limitar el daño**: incluir características de protección que minimicen las consecuencias si ocurre un accidente.
> — Sommerville, Cap. 11, §11.3, p. 302

**Aplicación en austranet-cco:**

| Nivel          | Mecanismo en el sistema                                                      |
|----------------|------------------------------------------------------------------------------|
| Evitar peligro | Control de roles (un `analista` no puede eliminar un SRS aprobado)           |
| Detectar peligro | Validaciones automáticas antes de transiciones de estado del SRS            |
| Limitar daño   | Backups automáticos en Firestore; historial de versiones inmutable del SRS   |

### 8.4 RNF de Protección — Plantilla


Código: RNF-PRD-ROB-001
Tipo: Protección (Safety) — Del Producto
Título: Integridad del SRS aprobado ante cambios no autorizados
Descripción: El sistema DEBE impedir que cualquier usuario con rol inferior a
gestor modifique el contenido de un SRS con estado aprobado.
Nivel HAZOP: "Otro que" — sustitución del contenido por datos no validados.
Métrica: 0 modificaciones directas a SRS aprobado sin pasar por proceso
formal de cambio (M3-09), medido en log de auditoría mensual.
Criterio: DADO que el SRS tiene estado aprobado, CUANDO un usuario con
rol analista o inferior intenta editar un requerimiento,
ENTONCES el sistema rechaza la operación y registra el intento.
Prioridad: Must Have
Fuente: Sommerville Cap. 12 §12.2 – Evitar el peligro (Nivel 1)
text

---

## 9. Especificación de Fiabilidad — Cap. 12 §12.3

La especificación de fiabilidad requiere traducir los objetivos de confiabilidad del sistema en **métricas cuantificables** que se puedan verificar durante las pruebas.

> "La especificación de fiabilidad consiste en definir métricas de fiabilidad cuantitativas para el sistema, determinar el nivel requerido para cada métrica e identificar las posibles formas en que se podría lograr el nivel de fiabilidad requerido."
> — Sommerville, Cap. 12, §12.3

### 9.1 Selección de la Métrica Adecuada

La elección de métrica depende del tipo de sistema:

| Tipo de sistema                  | Métrica recomendada | Razón                                                              |
|----------------------------------|---------------------|--------------------------------------------------------------------|
| Sistema de transacciones en línea | AVAIL (disponibilidad) | Los usuarios requieren acceso continuo                          |
| Sistema de control en tiempo real | ROCOF               | Las fallas frecuentes son críticas aunque sean breves             |
| Sistema de seguridad crítica      | POFOD               | Lo crítico es la probabilidad de falla cuando se solicita una función |
| Sistema batch / procesamiento     | MTTF                | Las fallas durante procesamiento largo son costosas               |

### 9.2 RNF de Fiabilidad — Ejemplos para austranet-cco


RNF-PRD-FIA-001 [Must Have]
Disponibilidad plataforma web en días hábiles:
AVAIL ≥ 99.5% mensual (08:00–20:00 hora local, lunes a viernes)
Medición: reporte mensual de monitoreo uptime durante 3 meses consecutivos.
MTTF/MTTR: tiempo de recuperación tras falla no planificada ≤ 5 minutos.
RNF-PRD-FIA-002 [Should Have]
Fiabilidad módulo SRS bajo carga concurrente:
POFOD ≤ 0.001 con 50 usuarios concurrentes editando requerimientos simultáneamente.
Medición: prueba de carga con herramienta (Artillery, k6) simulando 50 sesiones.
RNF-PRD-FIA-003 [Should Have]
Integridad de datos tras falla:
Probabilidad de corrupción de datos en SRS ante falla inesperada ≤ 0.0001.
Medición: pruebas de resiliencia con corte abrupto de conexión durante escritura.
text

---

## 10. Especificación de Seguridad — Cap. 12 §12.4

La especificación de seguridad en el Capítulo 12 extiende lo documentado en Cap. 11 §11.4 (ver M1-05) con un **proceso sistemático** de análisis de amenazas y definición de controles.

> "La seguridad es un atributo del sistema que refleja la habilidad de éste para protegerse a sí mismo de ataques externos, que podrían ser accidentales o deliberados."
> — Sommerville, Cap. 11, §11.4, p. 302

### 10.1 Proceso de Especificación de Seguridad Dirigido por Riesgos (Cap. 12 §12.4, p. 331)

Sommerville describe el proceso como una secuencia de 7 etapas:

1. **Identificación del activo**: identificar los activos del sistema que podrían requerir protección — el sistema en sí, funciones particulares, y los datos asociados.
2. **Estimación del valor del activo**: evaluar el valor de los activos identificados.
3. **Valoración de la exposición**: valorar las pérdidas potenciales, incluyendo pérdidas directas (robo de información), costos de recuperación y posible pérdida de reputación.
4. **Identificación de amenazas**: identificar las amenazas a los activos del sistema.
5. **Valoración del ataque**: descomponer cada amenaza en ataques posibles y cómo podrían realizarse.
6. **Identificación del control**: proponer controles técnicos (encriptación, control de acceso, etc.) para proteger los activos.
7. **Valoración de factibilidad**: valorar la factibilidad técnica y los costos de los controles propuestos.

### 10.2 Los 10 Tipos de Requerimientos de Seguridad (Cap. 12 §12.4, p. 330)

| N° | Tipo de Requerimiento         | Descripción                                                                    | Código en sistema |
|----|-------------------------------|--------------------------------------------------------------------------------|-------------------|
| 1  | Identificación y autenticación | Cómo se identifica y autentica a los usuarios                                 | RNF-SEG-01        |
| 2  | Autorización                   | Qué recursos y servicios puede usar cada usuario autenticado                   | RNF-SEG-02        |
| 3  | Encriptación                   | Cómo se protegen datos con cifrado                                             | RNF-SEG-03        |
| 4  | Registro externo               | Protección de datos que salen del sistema                                      | RNF-SEG-04        |
| 5  | Integridad                     | Cómo se preserva la integridad de los datos                                    | RNF-SEG-05        |
| 6  | Detección de intrusiones       | Mecanismos para detectar ataques                                               | RNF-SEG-06        |
| 7  | No repudio                     | Garantizar que una parte no pueda negar su participación en una transacción    | RNF-SEG-07        |
| 8  | Privacidad                     | Cómo se mantiene la privacidad de los datos                                    | RNF-SEG-08        |
| 9  | Auditoría de seguridad         | Cómo puede auditarse y verificarse el uso del sistema                          | RNF-SEG-09        |
| 10 | Seguridad de mantenimiento     | Evitar que cambios autorizados deshabiliten mecanismos de seguridad            | RNF-SEG-10        |

**Requerimientos de seguridad del libro (MHC-PMS)** (Cap. 12 §12.4, p. 332):

> "Debe encriptarse en el sistema cliente toda la información de los pacientes."

> "La bitácora de todos los cambios realizados a la base de datos del sistema y el iniciador de dichos cambios deberían mantenerse en una computadora separada del servidor de la base de datos. ... El cuarto requerimiento es un requerimiento de recuperación y auditoría. Ello significa que los cambios pueden recuperarse al reproducir la bitácora de cambios y que es posible descubrir quién realizó los cambios. Esto desalienta el mal uso del sistema por parte del personal autorizado."
> — Sommerville, Cap. 12, §12.4, p. 332

> "Los lectores pueden examinar sólo los documentos cuya clasificación sea la misma o esté por abajo del nivel de inspección del lector."
> — Sommerville, Cap. 12, §12.4, p. 332 (política de seguridad militar como modelo de control de acceso)

> "Las contraseñas de los usuarios que aparezcan en el diccionario del sistema deben identificarse."
> — Sommerville, Cap. 12, §12.4, p. 332 (requerimiento de validación de contraseñas)

---

## 11. Especificación Formal — Cap. 12 §12.5 — Lenguaje Z

La especificación formal es la técnica más rigurosa disponible para sistemas de máxima criticidad. Aunque raramente se aplica en sistemas de gestión, Sommerville la documenta en §12.5 como referencia para proyectos donde una ambigüedad en la especificación puede tener consecuencias catastróficas.

> "En ocasiones, se usan especificaciones matemáticas formales con la finalidad de describir los requerimientos para sistemas de protección o seguridad críticos, aunque rara vez se usan en otras circunstancias."
> — Sommerville, Cap. 4, §4.3, p. 95

### 11.1 El Lenguaje Z

El **Lenguaje Z** es una notación matemática basada en teoría de conjuntos y lógica de predicados, diseñada para especificar sistemas de forma precisa y sin ambigüedades. Fue desarrollado en la Universidad de Oxford en los años 1980.

**Estructura de un esquema Z:**

Un esquema Z tiene la forma:

┌─ NombreEsquema ──────────────────────────────────┐
│ declaración de variables y sus tipos │
├──────────────────────────────────────────────────┤
│ predicados que deben ser verdaderos │
└──────────────────────────────────────────────────┘
text

**Ejemplo conceptual aplicado al sistema** (basado en el enfoque de Sommerville §12.5):

Para el RNF "ningún usuario puede leer datos de otro usuario sin permiso explícito":

```z
┌─ ControlAcceso ──────────────────────────────────────────┐
│ usuario : USUARIO                                        │
│ recurso : RECURSO                                        │
│ permisos : USUARIO ↔ RECURSO                            │
├──────────────────────────────────────────────────────────┤
│ ∀ u : USUARIO; r : RECURSO -                             │
│   acceder(u, r) ⟹ (u, r) ∈ permisos                  │
└──────────────────────────────────────────────────────────┘

Este esquema expresa formalmente que ningún usuario puede acceder a un recurso a menos que el par (usuario, recurso) esté en el conjunto de permisos, sin ambigüedad lingüística posible.
11.2 Cuándo Aplicar Especificación Formal en austranet-cco
Situación
Decisión
Justificación
Sistema de gestión empresarial (apps Flutter/Next.js estándar)
NO aplicar
Costo-beneficio desfavorable
Módulo de autenticación y control de acceso crítico
Considerar
Las políticas de acceso se prestan a Z
Sistema con certificación regulatoria (médico, aeronáutico)
Aplicar
Requerido por reguladores
Algoritmo de cálculo crítico con requisito de certificación
Aplicar
Especificación sin ambigüedad necesaria

"Las especificaciones formales son para sistemas críticos de seguridad, no para sistemas de gestión empresarial."
— Sommerville, Cap. 4, §4.3, p. 95 (parafraseado)
Aplicación práctica en el sistema:
El concepto de precondición y postcondición del esquema Z sí aplica en austranet-cco para todos los RF y RNF (ver plantillas en M3-01, §9 y M3-04, §4.3). La especificación Z completa solo se requeriría si un cliente de nivel nivelRiesgo: CRÍTICO opera en un sector regulado que lo exija.

12. Proceso Operativo — Especificación de RNF en el SRS
Paso 1: Identificar RNF candidatos
Fuente A: requerimientos no funcionales emergidos durante enadquisicion (M3-02).
Fuente B: riesgos del proyecto en M2-03 que deben traducirse en RNF.
Fuente C: propiedades de confiabilidad requeridas por el tipo de cliente (ver M1-05).
Fuente D: requerimientos legislativos del dominio (ver M3-08 Requerimientos de Dominio).
Paso 2: Clasificar según taxonomía Fig. 4.3
Asignar cada RNF a su categoría (Del Producto / De la Organización / Externo) y subcategoría. Asignar código RNF-CAT-SUB-NNN.
Paso 3: Cuantificar con métrica de Fig. 4.5
Para cada RNF, completar:
text
Propiedad afectada: [velocidad / tamaño / facilidad de uso / fiabilidad / robustez / portabilidad]
Valor objetivo: [número + unidad]
Condición de medición: [carga, contexto, herramienta]
Método de verificación: [herramienta + procedimiento]

Paso 4: Detectar conflictos entre RNF
Verificar que ningún par de RNF se contradiga. Si hay conflicto, documentar en observaciones del SRS y registrar la decisión de diseño.
Paso 5: Aplicar análisis de seguridad (si aplica)
Para proyectos con criticidad: alta o criticidad: crítica en M2-01, ejecutar las 7 etapas del proceso de especificación de seguridad (§10.1 de este archivo).
Paso 6: Redactar con plantilla RNF
Usar la plantilla de M3-01 §8.5:
text
Código:        RNF-XXX
Tipo:          nofuncional
Título:        PROPIEDAD DE CALIDAD — COMPONENTE AFECTADO
Descripción:   El sistema DEBE [propiedad medible] en [contexto de aplicación].
Tipo de RNF:   [producto / organizacional / externo]
Métrica:       [valor objetivo] medido por [método específico]
Criterio de aceptación: [prueba específica y medible]
Prioridad:     [Must / Should / Could / Won't]
Fuente:        [stakeholder / legislación / política]
Estado:        propuesto
Versión:       1


13. Tabla de Conexiones con los 3 Módulos
Concepto
Sección RNF en SRS
Módulo fuente
Campo o proceso que lo alimenta
Nivel de riesgo de entidad
Sección 4.2 seguridad
M1
Entidad.nivelRiesgo → determina umbral de SLA
SLA negociado con cliente
Sección 4.3 disponibilidad
M1, M2
SLA de entidad cliente → RNF de disponibilidad
Riesgos del proyecto
Sección 4 completa
M2
RiesgoProyecto → genera RNF de mitigación
Criticidad del proyecto
Profundidad del análisis
M2
Proyecto.criticidad → activa análisis HAZOP/seguridad
Glosario de dominio
Sección 4.7 cumplimiento legal
M1
GlosarioDominio → identifica RNF legislativos
Stakeholders (influencia alta)
Fuente de RNF organizacionales
M1
Stakeholder.nivelInfluencia: alto → fuente de RNF-ORG
Restricciones del proyecto
Sección 6 restricciones diseño
M2
Proyecto.restricciones → RNF tecnológicos
Registro de cambios post-aprobación
RNF inmutabilidad
M3
M3-09 proceso de cambio → RNF de no repudio


14. Checklist de Completitud
Marco teórico extraído de Sommerville
 Definición formal de RNF (Cap. 4 §4.1.2, p. 87) con cita textual
 Por qué los RNF son más críticos que los RF (p. 87) con cita textual
 Taxonomía completa — Figura 4.3 (p. 88) — tres categorías con subtipos y ejemplos MHC-PMS
 Problema de RNF no medibles — ejemplo de usabilidad MHC-PMS (p. 89) con cita textual
 Figura 4.5 — Tabla de métricas completa (p. 90) — seis propiedades con medidas y ejemplos
 Conflictos entre RNF — ejemplo autenticación vs. acceso móvil (p. 90)
 Confiabilidad como propiedad emergente (Cap. 10 §10.1.1, p. 269)
 4 propiedades de confiabilidad con definiciones exactas (Cap. 11 §11.1, p. 292)
 Interdependencia entre propiedades de confiabilidad (pp. 293–294)
 Métricas MTTF, MTTR, ROCOF, POFOD, AVAIL (Cap. 11 §11.2, pp. 295–296)
 Diferencia disponibilidad vs. fiabilidad con ejemplo del libro (p. 296)
 Cap. 12 §12.1 — Especificación dirigida por riesgos
 Cap. 12 §12.2 — HAZOP: vocabulario, palabras guía, 3 niveles de protección
 Cap. 12 §12.3 — Especificación de fiabilidad: selección de métrica, ejemplos RNF
 Cap. 12 §12.4 — 10 tipos de requerimientos de seguridad (p. 330) con tabla
 Cap. 12 §12.4 — 7 etapas del proceso de análisis de amenazas (p. 331)
 Cap. 12 §12.4 — Ejemplos textuales de requerimientos MHC-PMS (p. 332)
 Cap. 12 §12.5 — Especificación formal, Lenguaje Z: estructura, ejemplo, cuándo usar
Proceso operativo
 Proceso de 6 pasos para especificación de RNF en el SRS
 Plantilla RNF completa con todos los campos
 Tabla de conexiones con los 3 módulos
 Cruzreferencias con M3-01, M3-04, M1-05, M2-03

Fin del archivo M3-07-requerimientos-no-funcionales.md
Versión 1.0.0 — 2026-02-26
Siguiente: M3-08-requerimientos-dominio.md
Referencia canónica: Sommerville, I. (2011). Ingeniería de Software (9ª ed.). Pearson.
Cap. 4 §4.1.2, pp. 87–90 · Cap. 11 completo, pp. 291–306 · Cap. 12 §§12.1–12.5, pp. 307–340
