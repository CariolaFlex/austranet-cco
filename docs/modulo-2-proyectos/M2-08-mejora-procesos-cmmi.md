# M2-08 — Mejora de Procesos y CMMI Aplicado: Ciclo de Mejora Entre Proyectos

---

## 1. Metadatos

| Campo | Valor |
|---|---|
| **Archivo** | `M2-08-mejora-procesos-cmmi.md` |
| **Módulo** | Módulo 2 — Registro y Configuración de Proyectos |
| **Capítulos fuente** | Cap. 26 §26.1, §26.2, §26.3, §26.4, §26.5 — Sommerville, Ian. *Ingeniería de Software*, 9.ª ed., Pearson Educación, 2011 |
| **Versión** | 1.0.0 |
| **Fecha** | 2026-02-26 |
| **Estado del proyecto cubierto** | `activo_en_desarrollo` → `completado` (la mejora se mide durante y al cierre) |
| **Depende de** | M2-01, M2-02, M2-03, M2-04, M2-05 |
| **Conecta con** | Todos los archivos M2 (ciclo de mejora), M1 (retroalimentación al proveedor), M3 (calidad del SRS) |
| **No repite** | Ciclo medir-analizar-cambiar (Fig.26.1), definición GQM, 5 niveles CMMI, áreas PP/PMC/SAM/CM/PPQA — todo documentado en M2-05 |
| **Referencias cruzadas** | M2-05 §5 (ciclo de mejora), M2-05 §4 (GQM), M2-05 §6 (niveles CMMI) |

---

## 2. Objetivo del Documento

### 2.1 Extensión de M2-05, no duplicación

Este archivo **extiende** M2-05 — no lo duplica. M2-05 documenta el plan de calidad del proceso de un proyecto individual: qué estándares se aplican, cómo se revisan los artefactos, qué GQMs se definen y en qué nivel CMMI opera el equipo. M2-08 documenta el **ciclo de mejora que ocurre entre proyectos**: cómo los datos recolectados en un proyecto se convierten en mejoras concretas disponibles para el siguiente. Sommerville establece esta distinción en §26.1 cuando diferencia la *gestión de calidad* —orientada a asegurar que un proyecto sigue sus procesos definidos— de la *mejora de procesos*, que es la actividad sistemática de modificar esos procesos para que los proyectos futuros sean mejores:

> *"El proceso de mejora de procesos es cíclico [...]. Incluye tres subprocesos: 1. Medición del proceso [...] 2. Análisis del proceso [...] 3. Cambio del proceso."* (Cap. 26 §26.1, p. 710)

La distinción es temporal: M2-05 opera *dentro* de un proyecto. M2-08 opera *entre* proyectos.

### 2.2 La organización que aprende

El concepto central del archivo es que la organización que gestiona proyectos en austranet-cco no solo entrega software: **aprende**. Cada proyecto es una oportunidad de medir atributos del proceso, analizar debilidades y cambiar las plantillas, parámetros y criterios que los proyectos futuros usarán desde el primer día. Sommerville fundamenta esta visión en §26.1:

> *"Como se explicó en el capítulo 24, el proceso de desarrollo usado para crear un sistema de software influye en la calidad de dicho sistema. Por eso, muchas personas creen que mejorar el proceso de desarrollo de software conducirá a un software de mejor calidad."* (Cap. 26, p. 707)

Y añade que el horizonte de la mejora es necesariamente largo:

> *"La mejora del proceso es una actividad de largo plazo, así que cada una de las etapas en el proceso de mejora puede durar varios meses. También es una actividad continua pues, independientemente de los procesos introducidos, el ambiente de negocios cambiará y los nuevos procesos tendrán que evolucionar."* (Cap. 26 §26.1, p. 711)

### 2.3 Por qué la mejora es difícil en la práctica

La mejora de procesos choca sistemáticamente con la realidad de los proyectos en entrega. Sommerville identifica en §26.4 (pp. 719–721) las tensiones estructurales que hacen que la mejora fracase: los equipos resisten los cambios que perciben como burocracia, los gestores priorizan la entrega inmediata sobre la mejora a largo plazo, y sin medición basal es imposible demostrar que un cambio funcionó. Esta tensión entre "hay que entregar" y "hay que mejorar" es la razón por la que la mejora informal no es suficiente: requiere artefactos explícitos (`LeccionAprendida`, `MetricaProceso`, `PlanMejora`) que sobrevivan la presión del proyecto y persistan en el sistema para el equipo siguiente. M2-08 documenta esos artefactos y el flujo que los conecta.

### 2.4 Posición del archivo en el sistema

M2-08 se activa cuando un proyecto alcanza el estado `completado` y produce tres tipos de artefactos que se inyectan en el siguiente proyecto al crearse en M2-01: `LeccionesAprendidas[]` filtradas por tipo y metodología, un `PlanMejora` actualizado a nivel organización, y los parámetros de estimación y catálogo de riesgos ajustados. Es el archivo que **cierra el ciclo completo del Módulo 2**: ningún proyecto queda cerrado sin haber contribuido al aprendizaje organizacional.

---

## 3. El Proceso de Mejora de Procesos (Cap. 26 §26.1)

### 3.1 Definición y propósito de la mejora de procesos

Sommerville define la mejora de procesos como la actividad sistemática de modificar los procesos de desarrollo para aumentar la calidad del software, reducir costos y acelerar la entrega. La cita fundacional del capítulo es:

> *"Por lo tanto, la mejora de procesos no significa simplemente adoptar métodos o herramientas particulares o usar un proceso genérico publicado. [...] Siempre hay que considerar el entorno y la cultura locales y cómo esto puede verse afectado por las propuestas de cambio del proceso."* (Cap. 26 §26.1, p. 709)

Esta definición establece dos principios que guían todo M2-08: (1) la mejora no es una lista de buenas prácticas genéricas sino un proceso situado en el contexto de la organización, y (2) el factor humano y cultural es tan importante como el técnico. La diferencia con la gestión de calidad documentada en M2-05 (Cap. 24) es de foco: la gestión de calidad verifica que el proceso actual se siga correctamente; la mejora de procesos cuestiona si el proceso actual es el correcto y lo modifica.

Sommerville identifica cuatro factores que afectan la calidad del software y que la mejora de procesos busca optimizar:

1. **Calidad del proceso** — principal factor en proyectos grandes
2. **Calidad del personal** — principal factor en proyectos pequeños  
3. **Tecnología de desarrollo** — importante en equipos pequeños
4. **Costo, tiempo y calendarización** — un presupuesto inadecuado degrada la calidad estructuralmente (Cap. 26, §26.1)

**Aplicación en el sistema:** `Proyecto.nivelMadurezCMMI` registra el nivel de madurez del proceso como diagnóstico al cierre de cada proyecto. Este campo, junto con `Proyecto.leccionesAprendidas[]`, `Proyecto.metricasProceso[]` y `Proyecto.planMejora`, son los cuatro campos que materializan la mejora de procesos en austranet-cco.

---

### 3.2 El ciclo de mejora de procesos (Fig.26.1)

**Ver M2-05, Sección 5.2** para la descripción completa del ciclo medir-analizar-cambiar y su diagrama correspondiente. Lo que M2-05 documenta es la teoría del ciclo; lo que esta sección documenta es su aplicación concreta en el sistema.

Cada etapa del ciclo se materializa así en austranet-cco:

#### MEDIR → Datos que el sistema recolecta durante el proyecto

| Fuente de datos | Dato recolectado | Campo del sistema |
|---|---|---|
| **M2-04** (seguimiento) | Velocidad real del equipo por sprint | `MetricaProceso.valor` con `categoria = 'velocidad'` |
| **M2-04** (seguimiento) | Esfuerzo real acumulado | `MetricaProceso.valor` con `categoria = 'esfuerzo'` |
| **M2-04** (informes) | Defectos encontrados por período | `MetricaProceso.valor` con `categoria = 'defectos'` |
| **M2-01** (hitos) | Desviación de cronograma por hito | `MetricaProceso.valor` con `categoria = 'proceso'` |
| **M3** (SRS) | Tiempo promedio de aprobación de requerimientos | `MetricaProceso.valor` con `categoria = 'velocidad'` |
| **M3** (SRS) | Número de revisiones necesarias por requerimiento | `MetricaProceso.valor` con `categoria = 'calidad'` |
| **M2-03** (riesgos) | Riesgos materializados vs. riesgos con plan | `MetricaProceso.valor` con `categoria = 'proceso'` |

#### ANALIZAR → Análisis que el sistema realiza al cierre del proyecto

- Comparación estimado vs. real en esfuerzo, costo y cronograma (M2-02 vs. M2-04 datos reales)
- Análisis de riesgos que se materializaron vs. los que tenían plan de mitigación (M2-03)
- Verificación del GQM: ¿se respondieron las preguntas definidas al inicio del proyecto?
- Identificación de patrones: ¿qué tipos de riesgo y desviación son recurrentes en este tipo de proyecto?

#### CAMBIAR → Output de mejora que produce el sistema

- `LeccionesAprendidas[]` registradas al cierre del proyecto con `tipo`, `impacto` y `accionRecomendada`
- `PlanMejora` actualizado o creado, con `AccionesMejora[]` priorizadas
- Ajustes al catálogo estándar de riesgos predefinidos (M2-03)
- Ajustes a los parámetros de estimación de referencia (M2-02)

**Aplicación en el sistema:** Los tres tipos `LeccionAprendida`, `MetricaProceso` y `PlanMejora` son exactamente los artefactos concretos del ciclo de mejora. Su estructura de campos permite trazar cada acción de mejora hasta la métrica que la motivó y hasta el proyecto donde se implementó.

---

## 4. Medición del Proceso (Cap. 26 §26.2)

### 4.1 Por qué medir: el problema de la medición sin objetivo

Sommerville es explícito sobre el riesgo de recolectar métricas sin propósito definido. En §26.2, distingue dos tipos de medición que deben mantenerse separados:

> *"Pueden recopilarse tres tipos de métricas de proceso: 1. El tiempo que tarda en completarse un proceso particular [...] 2. Los recursos requeridos para un proceso particular [...] 3. El número de ocurrencias de un evento particular."* (Cap. 26 §26.2, p. 711)

Y establece la distinción crítica entre métricas de proceso y métricas de proyecto:

- **Métricas de proceso:** miden los atributos del proceso de desarrollo en sí (velocidad, calidad del proceso, adherencia a procedimientos). Son *organizacionales*: sirven para comparar proyectos entre sí y mejorar el proceso estándar.
- **Métricas de proyecto:** miden el estado y avance de un proyecto específico (hitos cumplidos, presupuesto gastado, riesgos materializados). Son *locales*: sirven para controlar ese proyecto.

El peligro que Sommerville identifica es la "medición sin base racional":

> *"Resulta tentador, cuando se inicia la recolección de datos, recopilar tantos datos como sea posible. [...] Sin embargo, recopilar todos los datos posibles lleva a que los ingenieros pasen mucho tiempo en actividades de recolección de datos sin que esto redunde en beneficios evidentes."* (Cap. 26 §26.2, p. 712)

**Aplicación en el sistema:** El campo `MetricaProceso.gqmObjetivo` es obligatorio en el sistema cuando `MetricaProceso.categoria` es distinto de `'velocidad'` medida operacional. Ninguna métrica de proceso se registra sin estar vinculada a un GQM definido al inicio del proyecto. Esto implementa directamente la advertencia de Sommerville.

---

### 4.2 El método GQM — Plantilla operativa para austranet-cco

**Ver M2-05, Sección 4.2** para la definición teórica del paradigma GQM (Basili y Rombach, 1988) y su estructura Goal-Question-Metric.

Esta sección proporciona la **plantilla operativa** para aplicar GQM en cada proyecto del sistema. Para cada proyecto registrado, el gestor define al inicio del proyecto al menos 2 GQMs que guiarán la recolección de `MetricaProceso[]`.


GQM #[N] — Proyecto [ID]
═══════════════════════════════════════════════════════════
GOAL (Objetivo de medición)
Propósito: [mejorar / evaluar / controlar / predecir]
El: [objeto de medición: proceso, producto, recurso]
Con respecto a: [atributo de calidad: velocidad, defectos, etc.]
Desde el punto
de vista de: [gestor / cliente / equipo]
En el contexto
de: [tipo de proyecto, metodología, organización]
QUESTIONS (Preguntas de medición)
Q1: [Pregunta que operacionaliza el objetivo]
Q2: [Segunda pregunta complementaria]
METRICS (Métricas que responden las preguntas)
M1 (para Q1): [nombre métrica] = [fórmula o definición]
[unidad] | [frecuencia de recolección]
MetricaProceso.nombre = "[nombre]"
MetricaProceso.unidad = "[unidad]"
MetricaProceso.categoria = '[velocidad|calidad|esfuerzo|defectos|proceso]'
MetricaProceso.gqmObjetivo = "[texto del GOAL]"
MetricaProceso.gqmPregunta = "Q1: [texto]"
M2 (para Q2): [nombre métrica] = [fórmula o definición]
[unidad] | [frecuencia de recolección]
[mismos campos MetricaProceso]
text

---

#### GQM #1 — Precisión de la estimación de costos


GOAL
Propósito: Mejorar
El: proceso de estimación de esfuerzo
Con respecto a: precisión (desviación estimado vs. real)
Desde el punto
de vista de: gestor del proyecto
En el contexto
de: proyectos de software en austranet-cco
QUESTIONS
Q1: ¿Cuánto se desvía el esfuerzo real del estimado
al final del proyecto?
Q2: ¿En qué fase o módulo ocurre la mayor desviación?
METRICS
M1 (para Q1):
Nombre: Desviación de esfuerzo global
Fórmula: abs(esfuerzo_real - esfuerzo_estimado)
/ esfuerzo_estimado × 100
Unidad: %
Frecuencia: Al cierre del proyecto
MetricaProceso.categoria = 'esfuerzo'
MetricaProceso.gqmObjetivo = 'Precisión estimación costos'
MetricaProceso.gqmPregunta = 'Q1: Desviación esfuerzo global'
M2 (para Q2):
Nombre: Desviación de esfuerzo por módulo/fase
Fórmula: abs(real_modulo - estimado_modulo)
/ estimado_modulo × 100
Unidad: %
Frecuencia: Al cierre de cada incremento o fase
MetricaProceso.categoria = 'esfuerzo'
MetricaProceso.gqmObjetivo = 'Precisión estimación costos'
MetricaProceso.gqmPregunta = 'Q2: Desviación por módulo'
text

---

#### GQM #2 — Calidad del proceso de gestión de riesgos


GOAL
Propósito: Evaluar
El: proceso de gestión de riesgos (M2-03)
Con respecto a: efectividad de la mitigación preventiva
Desde el punto
de vista de: gestor del proyecto
En el contexto
de: proyectos con criticidad 'alta' o 'critica'
QUESTIONS
Q1: ¿Qué porcentaje de los riesgos materializados tenía
plan de mitigación documentado al ocurrir?
Q2: ¿Qué tipos de riesgo se identifican tarde o no se
identifican antes de materializarse?
METRICS
M1 (para Q1):
Nombre: Tasa de riesgos cubiertos
Fórmula: (riesgos_materializados_con_plan /
total_riesgos_materializados) × 100
Unidad: % | Meta: > 80%
Frecuencia: Por evento de materialización
MetricaProceso.categoria = 'proceso'
MetricaProceso.gqmObjetivo = 'Calidad gestión de riesgos'
MetricaProceso.gqmPregunta = 'Q1: Tasa riesgos cubiertos'
M2 (para Q2):
Nombre: Distribución de riesgos tardíos por tipo
Fórmula: conteo por tipo (tecnológico, personal,
organizacional, herramientas, requerimientos,
estimación — tipos del catálogo M2-03)
Unidad: conteo por categoría
Frecuencia: Al cierre del proyecto
MetricaProceso.categoria = 'proceso'
MetricaProceso.gqmObjetivo = 'Calidad gestión de riesgos'
MetricaProceso.gqmPregunta = 'Q2: Riesgos tardíos por tipo'
text

---

#### GQM #3 — Velocidad del ciclo de validación del SRS


GOAL
Propósito: Controlar
El: proceso de validación de requerimientos (M3)
Con respecto a: tiempo de ciclo de aprobación
Desde el punto
de vista de: gestor del proyecto y equipo M3
En el contexto
de: proyectos con Módulo 3 activo
QUESTIONS
Q1: ¿Cuántos días tarda en promedio un requerimiento en
pasar de 'propuesto' a 'aprobado' en el SRS?
Q2: ¿Cuántas iteraciones de revisión requiere un
requerimiento típico antes de su aprobación?
METRICS
M1 (para Q1):
Nombre: Tiempo medio de aprobación de requerimiento
Fórmula: Σ(fecha_aprobacion - fecha_propuesto)
/ total_requerimientos
Unidad: días
Frecuencia: Al cierre del SRS
MetricaProceso.categoria = 'velocidad'
MetricaProceso.gqmObjetivo = 'Velocidad ciclo validación SRS'
MetricaProceso.gqmPregunta = 'Q1: Tiempo medio aprobación'
M2 (para Q2):
Nombre: Nro. medio de revisiones por requerimiento
Fórmula: total_revisiones_srs / total_requerimientos
Unidad: revisiones/requerimiento
Frecuencia: Al cierre del SRS
MetricaProceso.categoria = 'calidad'
MetricaProceso.gqmObjetivo = 'Velocidad ciclo validación SRS'
MetricaProceso.gqmPregunta = 'Q2: Revisiones por requerimiento'
text

---

### 4.3 Métricas de proceso extraídas del libro (§26.2)

Sommerville presenta en §26.2 (p. 711) las tres categorías fundamentales de métricas de proceso que cualquier programa de medición debe contemplar:

> *"Pueden recopilarse tres tipos de métricas de proceso: 1. El tiempo que tarda en completarse un proceso particular, como el tiempo para llevar a cabo una inspección de software u otro proceso de revisión. 2. Los recursos requeridos para un proceso particular, como el esfuerzo total en persona-días. 3. El número de ocurrencias de un evento particular, como el número de defectos encontrados durante la inspección de código."* (Cap. 26 §26.2, p. 711)

La siguiente tabla mapea las tres categorías del libro a los campos del sistema:

| Categoría Sommerville | Descripción del libro | Ejemplos en austranet-cco | `MetricaProceso.categoria` |
|---|---|---|---|
| **Tiempo** | Duración de un proceso específico | Días de revisión del SRS; días de aprobación de hito; tiempo en validación de requerimiento | `'velocidad'` |
| **Recursos** | Esfuerzo consumido en persona-días | Esfuerzo real por sprint; esfuerzo total del proyecto; esfuerzo en gestión de riesgos | `'esfuerzo'` |
| **Ocurrencias de evento** | Conteo de eventos específicos del proceso | Defectos encontrados por inspección; riesgos materializados; cambios de alcance solicitados; revisiones de riesgos ejecutadas | `'defectos'` o `'proceso'` |

Sommerville también menciona en §26.2 métricas de producto de proceso que son útiles como indicadores de calidad del proceso:

- **Número de defectos encontrados durante inspecciones de código** → `categoria = 'defectos'`
- **Número de cambios de requerimientos** → `categoria = 'proceso'`
- **Tiempo empleado en corrección de defectos** → `categoria = 'esfuerzo'`

Adicionalmente, la **velocidad del equipo** (story points por sprint) aplica exclusivamente a proyectos `metodologia: 'agil_scrum'` y se registra con `categoria = 'velocidad'`.

---

### 4.4 El problema de las métricas vacías

Sommerville advierte sobre las consecuencias organizacionales de introducir métricas sin propósito claro:

> *"Resulta tentador, cuando se inicia la recolección de datos, recopilar tantos datos como sea posible. [...] Sin embargo, recopilar todos los datos posibles lleva a que los ingenieros pasen mucho tiempo en actividades de recolección de datos sin que esto redunde en beneficios evidentes."* (Cap. 26 §26.2, p. 712)

Y añade el problema de la percepción del equipo:

> *"Los gerentes podrían usar las mediciones del proceso para evaluar la productividad del desarrollador, en lugar de buscar formas de mejorar los procesos organizacionales. Si los desarrolladores creen que esto puede suceder, resistirán la recolección de datos del proceso."* (Cap. 26 §26.2, p. 712)

**Salvaguardas que el sistema implementa:**

1. **Vinculación obligatoria al GQM:** `MetricaProceso.gqmObjetivo` es un campo recomendado para métricas de categoría `'proceso'`, `'esfuerzo'` y `'calidad'`. Ninguna métrica de auditoría se crea sin estar vinculada a un objetivo de medición.
2. **Sin métricas individuales:** Las `MetricaProceso[]` son atributos del *proyecto*, no del *desarrollador*. El sistema no permite asociar una métrica a un `usuarioId` individual.
3. **Propósito explícito:** Cada `MetricaProceso` incluye `gqmPregunta` que documenta explícitamente qué pregunta de mejora responde esa métrica.

---

## 5. Análisis del Proceso (Cap. 26 §26.3)

> **Nota:** Esta sección cubre contenido exclusivo de M2-08. M2-05 no documenta §26.3. Es el análisis —no solo la recolección— lo que transforma datos en mejoras.

### 5.1 Modelado del proceso como base del análisis

Sommerville establece en §26.3 que el análisis del proceso no puede realizarse sin primero modelar el proceso actual. El modelado sirve para comprender el proceso tal como *es*, no tal como *debería ser*:

> *"Para analizar y mejorar un proceso de software, primero es necesario entenderlo. [...] Los modelos de proceso son representaciones simplificadas de los procesos. Cada modelo de proceso representa una perspectiva del proceso y, por lo tanto, sólo proporciona información parcial sobre el proceso."* (Cap. 26 §26.3, p. 715)

Sommerville menciona los siguientes tipos de modelo de proceso que pueden usarse como base del análisis:

| Tipo de modelo | Qué captura | Aplicación en austranet-cco |
|---|---|---|
| **Modelos de flujo de actividades** | La secuencia de actividades en el proceso | El flujo de estados de un proyecto (`borrador` → `activo_en_definicion` → ...) modela el proceso de gestión |
| **Modelos de flujo de información** | Cómo fluyen los datos entre actividades del proceso | Los datos de M2-03 que fluyen a M2-01 del siguiente proyecto es un modelo de flujo de información de mejora |
| **Modelos de roles/acciones** | Qué hace cada rol en cada actividad | Los roles `gestor`, `desarrollador`, `cliente` con sus responsabilidades en cada paso del proceso |

**Aplicación en el sistema:** El diagrama de flujo de la Sección 8 de este archivo *es* el modelo de proceso del ciclo de mejora en austranet-cco. Antes de analizar qué mejorar, el gestor debe revisar ese modelo para entender qué etapa del ciclo está fallando.

---

### 5.2 Análisis estadístico del proceso

Sommerville describe en §26.3 el uso de técnicas cuantitativas para analizar el proceso:

> *"Si se recopilan datos de proceso durante un periodo largo, es posible usarlos para predecir tendencias de proceso. [...] Los métodos estadísticos pueden demostrar tendencias y pueden usarse para predecir cómo el proceso puede progresar si no se hacen cambios."* (Cap. 26 §26.3, p. 715)

Las técnicas de análisis estadístico que Sommerville menciona aplicables al proceso de software incluyen:

- **Análisis de tendencias:** comparar el valor de una métrica entre proyectos consecutivos para determinar si mejora, se mantiene estable o empeora. Ejemplo: tendencia de desviación de esfuerzo entre los últimos 5 proyectos.
- **Análisis de distribución:** identificar la distribución estadística de una métrica (media, desviación estándar, rango intercuartílico) para establecer líneas base y detectar outliers. Ejemplo: distribución del tiempo de aprobación de requerimientos para establecer qué es "normal".
- **Análisis de correlación:** identificar si dos métricas están correlacionadas. Ejemplo: ¿los proyectos con mayor número de cambios de requerimientos tienen también mayor desviación de esfuerzo?

**Aplicación en el sistema:** Con `MetricaProceso[]` de múltiples proyectos almacenados, el sistema puede ejecutar estos análisis como proceso batch al cerrar cada proyecto. Los campos `MetricaProceso.gqmObjetivo` y `MetricaProceso.categoria` permiten agrupar métricas comparables entre proyectos distintos para el análisis estadístico.

---

### 5.3 Aplicación al sistema: análisis entre proyectos

Esta es la sección diferenciadora de M2-08. El análisis del proceso en austranet-cco ocurre a nivel **organización**, cruzando datos de múltiples proyectos completados:

---

#### Análisis 1 — Tendencia de precisión de estimación

**Datos fuente:** `MetricaProceso[]` con `gqmObjetivo = 'Precisión estimación costos'` de todos los proyectos con `estado = 'completado'`.

**Proceso de análisis:**
1. Calcular la desviación de esfuerzo de cada proyecto completado: `abs(real - estimado) / estimado × 100`
2. Ordenar cronológicamente y calcular la tendencia (regresión lineal simple o media móvil de 3 proyectos)
3. Segmentar por `metodologia` y `criticidad` para identificar patrones

**Preguntas que responde:**
- ¿Está mejorando la precisión de estimación con el tiempo?
- ¿En qué tipo de proyectos (`criticidad`, `metodologia`) la estimación es sistemáticamente peor?
- ¿La actualización de parámetros de M2-02 (LeccionesAprendidas tipo `'estimacion'`) está teniendo efecto?

**Output:** `LeccionAprendida` tipo `'estimacion'` con `accionRecomendada` específica + actualización de `MetricaProceso` de referencia en M2-02.

---

#### Análisis 2 — Patrones de riesgos recurrentes

**Datos fuente:** `LeccionAprendida[]` con `tipo = 'proceso'` + `MetricaProceso[]` con `gqmObjetivo = 'Calidad gestión de riesgos'` de todos los proyectos completados.

**Proceso de análisis:**
1. Identificar los tipos de riesgo (del catálogo M2-03) que se materializaron con mayor frecuencia
2. Segmentar por `metodologia` del proyecto: ¿los riesgos recurrentes son distintos en Scrum vs. Cascada?
3. Verificar si los riesgos recurrentes tenían o no plan de mitigación en cada proyecto

**Preguntas que responde:**
- ¿Qué riesgos del catálogo de M2-03 se materializan con mayor frecuencia?
- ¿Hay riesgos que se materializan reiteradamente sin que el equipo los haya identificado?
- ¿Los riesgos recurrentes son específicos de una metodología o transversales?

**Output:** `AccionMejora` de tipo "Ajuste de plantilla de riesgos" → actualización del catálogo estándar de M2-03 para que los riesgos recurrentes aparezcan preseleccionados en los nuevos proyectos.

---

#### Análisis 3 — Calidad del SRS por tipo de proyecto

**Datos fuente:** `MetricaProceso[]` con `gqmObjetivo = 'Velocidad ciclo validación SRS'` + datos de M3 (número de revisiones, tiempo en estado `en_validacion`, defectos detectados post-aprobación).

**Proceso de análisis:**
1. Calcular el tiempo medio de aprobación de requerimientos agrupado por `criticidad` del proyecto
2. Identificar qué tipos de proyectos producen SRS con mayor número de revisiones necesarias
3. Correlacionar el número de revisiones SRS con la posterior aparición de defectos de requerimientos en desarrollo

**Preguntas que responde:**
- ¿Los proyectos con `criticidad = 'alta'` producen SRS que requieren más revisiones?
- ¿Hay una correlación entre el tiempo en validación SRS y los defectos de requerimientos encontrados en desarrollo?
- ¿El proceso de validación de M3-05 es suficientemente robusto para proyectos con múltiples stakeholders?

**Output:** `AccionMejora` de tipo "Cambio de proceso de validación" → ajuste a los criterios de validación de M3-05 basado en los datos históricos del análisis.

**Aplicación en el sistema:** `Proyecto.metricasProceso[]` almacena los datos de cada proyecto. El análisis entre proyectos se ejecuta como proceso batch al cambiar el estado de un proyecto a `completado`. Los outputs del análisis se registran como `LeccionAprendida[]` de tipo `'proceso'` y se vinculan al `PlanMejora` de la organización.

---

## 6. Cambios en los Procesos (Cap. 26 §26.4)

> **Nota:** §26.4 no está cubierto en M2-05 y es contenido exclusivo de M2-08.

### 6.1 Cómo introducir cambios en los procesos

Sommerville establece en §26.4 que la introducción de cambios al proceso es en sí misma un proceso que debe gestionarse:

> *"Después de analizar el proceso, podría concluir que se necesitan cambios de proceso para mejorar la calidad del software o reducir los costos o el tiempo de desarrollo. [...] Los cambios de proceso son los cambios que se proponen para atacar algunas de las debilidades del proceso identificadas."* (Cap. 26 §26.4, p. 719)

Sommerville identifica las condiciones que deben darse para que un cambio de proceso sea exitoso:

> *"La introducción de nuevas tecnologías de procesos es difícil porque los procesos son complejos y están arraigados en la cultura corporativa de la organización. [...] Los cambios de proceso requieren que las personas aprendan y adopten nuevas formas de trabajar, lo que inevitablemente provoca interrupciones a corto plazo."* (Cap. 26 §26.4, p. 719)

Las condiciones para el éxito que el libro identifica son:
1. El cambio debe responder a una debilidad identificada con datos, no a intuición o moda
2. Debe existir un "evangelista del cambio" que lo promueva activamente
3. El cambio debe ser incremental: los cambios masivos simultaneos raramente se adoptan
4. Debe poder medirse el efecto del cambio con las mismas métricas que diagnosticaron el problema

---

### 6.2 Problemas al cambiar procesos

Sommerville dedica una parte significativa de §26.4 a los problemas reales que enfrenta quien intenta introducir mejoras de proceso. Las citas textuales son:

> *"Existe resistencia a los cambios de proceso por parte de los miembros del equipo o de los líderes de proyecto. Las personas que se oponen al cambio pueden presentar razones por las que los cambios no funcionarán."* (Cap. 26 §26.4, p. 720)

> *"Un cambio de proceso puede depender del entusiasmo de un individuo en particular para llevarlo a cabo. Si ese individuo deja la organización o cambia de responsabilidades, la motivación para el cambio puede perderse y los procesos volverán a su estado anterior."* (Cap. 26 §26.4, p. 720)

> *"Es posible que sea necesario aumentar el presupuesto del proyecto para permitir los costos adicionales de la transición. A corto plazo, los cambios de proceso pueden aumentar los costos y reducir la productividad."* (Cap. 26 §26.4, p. 720)

> *"Los beneficios de la mejora del proceso son a largo plazo. Los gerentes de proyectos, que tienen que ver principalmente con la entrega del proyecto a tiempo y dentro del presupuesto, pueden no estar dispuestos a invertir en la mejora del proceso si esto retrasa la entrega del software."* (Cap. 26 §26.4, pp. 720–721)

La siguiente tabla documenta cómo austranet-cco mitiga cada problema:

| Problema identificado por Sommerville | Cita (§26.4) | Mitigación en austranet-cco |
|---|---|---|
| **Resistencia al cambio** | "razones por las que los cambios no funcionarán" | Cada `AccionMejora` está vinculada a una `LeccionAprendida.descripcion` específica: el cambio no es abstracto sino la consecuencia directa de un problema documentado con nombre y fecha |
| **Pérdida del evangelista** | "los procesos volverán a su estado anterior" | Los cambios se institucionalizan en los artefactos del sistema (catálogo de riesgos de M2-03, parámetros de M2-02, árbol de decisión de M2-07) — no dependen de que una persona los recuerde |
| **Costo y demora a corto plazo** | "pueden aumentar los costos y reducir la productividad" | `AccionMejora.prioridad` = `'alta' | 'media' | 'baja'` permite implementar solo cambios de alta prioridad en proyectos urgentes |
| **Beneficios a largo plazo vs. presión inmediata** | "gerentes de proyectos [...] pueden no estar dispuestos" | El `PlanMejora.fechaRevision` obliga a revisar formalmente el plan antes del inicio del siguiente proyecto, creando un momento estructural para la mejora |
| **Múltiples cambios simultáneos** | (implícito en §26.4) | El sistema no permite crear un `PlanMejora` sin `AccionMejora[]` priorizadas. La implementación es secuencial, no simultánea |

---

### 6.3 Tipos de cambio de proceso que el sistema registra

La siguiente tabla documenta los tipos de `AccionMejora` que el sistema soporta, con su impacto concreto en los archivos del Módulo 2:

| Tipo de cambio | Descripción | Ejemplo | Impacto en el sistema |
|---|---|---|---|
| **Ajuste de plantilla de riesgos** | Agregar, modificar o eliminar riesgos del catálogo estándar de M2-03 | Agregar riesgo "Integración Firebase con cliente sin experiencia técnica" al catálogo para proyectos con `metodologia = 'agil_scrum'` | M2-03: catálogo estándar actualizado; los nuevos proyectos heredan el riesgo automáticamente |
| **Ajuste de estimación de referencia** | Modificar factores de productividad o velocidad de referencia usados en M2-02 | Ajustar productividad de referencia de 8 a 6 SP/sprint tras tres proyectos consecutivos con sobreestimación | M2-02: parámetros de referencia actualizados; las nuevas estimaciones parten de valores empíricos |
| **Cambio de proceso de validación** | Modificar el número de revisiones obligatorias o los criterios de aprobación del SRS en M3 | Agregar revisión obligatoria de stakeholder con `nivelInfluencia = 'alto'` antes de aprobar RF críticos | M3-05: flujo de validación actualizado para proyectos con stakeholders de alto impacto |
| **Ajuste de criterios de metodología** | Modificar umbrales del árbol de decisión de M2-07 | Reducir límite de `tamanoEquipo` para Scrum de 9 a 7 personas tras 2 proyectos de 8-9 personas con problemas de coordinación documentados | M2-07: árbol de decisión actualizado; los nuevos proyectos recibirán recomendación diferente |
| **Cambio de hito obligatorio** | Agregar o eliminar un hito obligatorio en el proceso de M2-01 PASO 5 | Hacer obligatorio el hito "Revisión de arquitectura" para proyectos con `criticidad = 'alta'` | M2-01: validación de hitos actualizada; el sistema rechaza proyectos de alta criticidad sin ese hito |

---

## 7. CMMI en austranet-cco (Cap. 26 §26.5)

### 7.1 CMMI como hoja de ruta de madurez

**Ver M2-05, Sección 6** para la descripción completa de los 5 niveles CMMI, las 22 áreas de proceso y las áreas PP, PMC, SAM, CM y PPQA con sus descripciones detalladas.

Lo nuevo aquí es la perspectiva estratégica que Sommerville añade en §26.5: el CMMI no es solo una escala descriptiva, sino una **hoja de ruta** que indica a la organización qué mejorar primero:

> *"El nivel en el cual se valora una organización indica las áreas de proceso donde se necesita mejora."* (Cap. 26 §26.5, p. 724)

Y Sommerville va más lejos al describir cómo usar CMMI para priorizar la mejora:

> *"Una valoración CMMI implica examinar los procesos en una organización y clasificar dichos procesos o áreas de proceso en una escala de seis puntos que se relacionan con el nivel de madurez en cada área de proceso. El resultado de una valoración es un perfil de madurez de la organización que muestra el nivel de cada área de proceso."* (Cap. 26 §26.5, p. 724)

Este perfil de madurez por área de proceso es más útil que un nivel CMMI global porque permite identificar brechas específicas. Una organización puede tener nivel 3 en gestión de riesgos (RSKM) pero nivel 1 en medición y análisis (MA), y el CMMI indica exactamente qué debe mejorar primero.

**Aplicación en el sistema:** `Proyecto.nivelMadurezCMMI` registra el nivel CMMI evaluado al cierre de cada proyecto. `PlanMejora.nivelCMMIObjetivo` registra el nivel CMMI al que la organización aspira. La diferencia entre ambos define la brecha de mejora que el `PlanMejora` debe cerrar.

---

### 7.2 Diagnóstico del nivel CMMI actual en el sistema

La siguiente tabla define las evidencias en austranet-cco que corresponden a cada nivel CMMI. Para diagnosticar el nivel de la organización, el gestor evalúa qué evidencias están presentes:

| Nivel CMMI | Nombre | Evidencias requeridas en austranet-cco |
|---|---|---|
| **1 — Inicial** | Proceso impredecible | Sin procesos formales. Proyectos creados sin M2-01 completo. Sin registro de riesgos. Sin estimación documentada. El éxito depende de personas específicas, no de procesos. |
| **2 — Gestionado** | Proceso gestionado | M2-01 completo (plan de proyecto documentado). M2-03 con ≥ 3 riesgos identificados. M2-02 con método de estimación documentado. M2-04 con al menos un informe de avance. Equivale al **Nivel Básico** de M2-05 §8. |
| **3 — Definido** | Proceso estándar | Todo el Nivel 2 + Plan de calidad activo (M2-05). GQMs definidos al inicio del proyecto. `LeccionesAprendidas[]` registradas al cierre. El proceso es estándar entre proyectos, no reinventado en cada uno. Equivale al **Nivel Estándar** de M2-05 §8. |
| **4 — Gestionado cuantitativamente** | Proceso predecible | Todo el Nivel 3 + `MetricaProceso[]` con histórico de ≥ 3 proyectos. Análisis estadístico de tendencias ejecutado. `PlanMejora` activo a nivel organización (`proyectoId = null`). La variación del proceso se entiende y gestiona estadísticamente. Equivale al **Nivel Avanzado** de M2-05 §8. |
| **5 — En optimización** | Proceso en mejora continua | Todo el Nivel 4 + `AccionesMejora[]` con `estadoImplementacion = 'implementada'` validadas. Reducción demostrable y medida de la desviación de estimación entre proyectos sucesivos. Las mejoras se validan cuantitativamente antes de adoptarse universalmente. |

---

### 7.3 Áreas de proceso CMMI relevantes para el sistema

**Las áreas PP, PMC, SAM, CM, PPQA, REQM, MA, RSKM, VER y VAL están documentadas en M2-05, Sección 6.5.** A continuación se mapean las acciones del ciclo de mejora de M2-08 a las tres áreas de proceso que M2-05 no cubre:

---

**OPD — Organizational Process Definition (Definición de Proceso Organizacional)**

> *"Este nivel se enfoca en la estandarización organizacional y el despliegue de procesos."* (Cap. 26 §26.5, p. 724)

La organización define y mantiene el conjunto de procesos estándar que todos los proyectos deben seguir, adaptándolo según sus características.

**En austranet-cco:** Las plantillas de M2-01 a M2-07 son el **conjunto de procesos estándar de la organización**. OPD se cumple cuando estos archivos existen, están documentados y son la base de todos los proyectos —no cuando cada proyecto los reinventa. El catálogo de riesgos de M2-03, el árbol de decisión de M2-07 y los parámetros de estimación de M2-02 son los "activos del proceso organizacional" que OPD requiere mantener.

---

**OPF — Organizational Process Focus (Enfoque de Proceso Organizacional)**

La organización planifica y coordina activamente las actividades de mejora del proceso, utilizando los datos de proyectos pasados para decidir qué procesos mejorar primero.

**En austranet-cco:** El `PlanMejora` con `proyectoId = null` (ámbito organización) es el artefacto de OPF. Este plan existe a nivel organización, no solo de proyecto, y tiene `PlanMejora.areasProcesoAfectadas[]` que lista explícitamente qué áreas CMMI están siendo mejoradas. El campo `PlanMejora.estado` = `'activo'` indica que la organización tiene un programa de mejora en curso.

---

**MA — Measurement and Analysis (Medición y Análisis)**

La organización establece y mantiene un programa de medición alineado con sus objetivos de negocio. El programa incluye objetivos de medición, procedimientos de recolección, análisis y reporte.

**En austranet-cco:** Los GQMs definidos al inicio de cada proyecto (§4.2) y `MetricaProceso[]` son el programa de medición. MA se cumple cuando: (a) las métricas están vinculadas a objetivos de mejora (`MetricaProceso.gqmObjetivo`), (b) se recolectan con la frecuencia definida, y (c) se analizan al cierre del proyecto para tomar decisiones de mejora. El análisis entre proyectos de la §5.3 es la actividad central de MA a nivel organización.

---

## 8. El Ciclo Completo de Mejora en austranet-cco

Esta sección es el entregable central del archivo. Documenta el flujo completo de cómo austranet-cco aprende de un proyecto al siguiente.

### 8.1 Flujo completo de mejora entre proyectos


╔══════════════════════════════════════════════════════════════╗
║ PROYECTO N (estado: completado) ║
╚══════════════════════════════════════════════════════════════╝
│
├── [AL INICIO DEL PROYECTO — M2-01 PASO 1-2]
│ ├── GQMs definidos (§4.2 de M2-08)
│ │ └── MetricaProceso[].gqmObjetivo registrado desde el inicio
│ ├── Catálogo de riesgos heredado (M2-03)
│ │ └── Incluye riesgos actualizados por AccionesMejora
│ │ anteriores de tipo 'Ajuste de plantilla de riesgos'
│ ├── Parámetros de estimación ajustados (M2-02)
│ │ └── Velocidad de referencia actualizada por histórico
│ │ de MetricaProceso[] de proyectos anteriores
│ └── LeccionesAprendidas[] relevantes del histórico mostradas
│ └── Filtradas por tipo de proyecto, metodología, criticidad
│
├── [DURANTE EL PROYECTO — M2-04 seguimiento]
│ ├── MetricaProceso[] recolectadas por categoría
│ │ ├── categoria='velocidad': story points/sprint, tiempo aprobación SRS
│ │ ├── categoria='esfuerzo': horas/días reales por incremento
│ │ ├── categoria='defectos': defectos por inspección/sprint
│ │ └── categoria='proceso': riesgos materializados, cambios de alcance
│ ├── Riesgos monitoreados con indicadores de M2-03
│ └── Datos del SRS recolectados: tiempos, revisiones, estados (M3)
│
└── [AL CIERRE DEL PROYECTO — estado: 'completado']
│
├── ① MEDIR
│ └── MetricaProceso[] finales calculadas para todos los GQMs
│
├── ② ANALIZAR
│ ├── Comparación estimado vs. real (M2-02 vs. M2-04 real)
│ ├── ¿Se respondieron las Q1 y Q2 de cada GQM?
│ ├── ¿Cuáles riesgos se materializaron y tenían plan?
│ ├── ¿Cuánto se desvió la estimación y en qué módulo?
│ └── Análisis estadístico cross-project (§5.3):
│ Tendencia precisión + Riesgos recurrentes + Calidad SRS
│
├── ③ REGISTRAR
│ └── LeccionAprendida[] creadas al cierre
│ ├── tipo='estimacion': desviaciones de M2-02
│ ├── tipo='proceso': riesgos sin plan, procesos fallidos
│ ├── tipo='tecnico': problemas de arquitectura/tecnología
│ └── tipo='equipo': problemas de coordinación o comunicación
│
└── ④ CAMBIAR
└── PlanMejora actualizado / creado
├── proyectoId=null (ámbito organización) si es sistémico
├── nivelCMMIObjetivo evaluado con tabla de §7.2
├── areasProcesoAfectadas[] identificadas
├── AccionesMejora[] priorizadas por impacto
└── fechaRevision = antes del inicio del Proyecto N+1
text
undefined
text
                       │
                        ▼

╔══════════════════════════════════════════════════════════════╗
║ PROYECTO N+1 (estado: borrador) ║
╚══════════════════════════════════════════════════════════════╝
│
├── [AL CREAR EN M2-01 PASO 1 — aprendizaje inyectado]
│ ├── Sistema muestra LeccionesAprendidas[] relevantes
│ │ (filtradas por metodología, criticidad, tipo de cliente)
│ ├── Catálogo de riesgos M2-03 ya incluye riesgos actualizados
│ │ por las AccionesMejora del Proyecto N
│ ├── Parámetros de estimación M2-02 ya reflejan la velocidad
│ │ real medida en proyectos anteriores
│ └── GQMs sugeridos basados en los del Proyecto N
│ (el gestor los adapta al nuevo proyecto)
│
└── [CICLO CONTINÚA → Proyecto N+2 ...]
text

---

### 8.2 Condiciones de activación del ciclo de mejora

| Evento en el sistema | Etapa del ciclo | Acción | Rol responsable |
|---|---|---|---|
| `Proyecto.estado` → `'completado'` | MEDIR | Calcular `MetricaProceso[]` finales de todos los GQMs definidos al inicio | Sistema automático (batch) |
| Fin de cada sprint / incremento | MEDIR | Actualizar `MetricaProceso[]` de `categoria='velocidad'` y `'defectos'` | Scrum Master / PM |
| `Riesgo.estado` → `'materializado'` | ANALIZAR | Crear propuesta de `LeccionAprendida` tipo `'proceso'` | Sistema + PM (aprueba) |
| Cierre formal del proyecto (M2-04) | REGISTRAR | Formulario obligatorio de lecciones aprendidas para al menos una `LeccionAprendida` por categoría | PM / Gestor |
| `PlanMejora.fechaRevision` alcanzada | CAMBIAR | Notificación de revisión del plan de mejora; `PlanMejora.estado` puede requerir actualización | Admin / Gestor |
| Nuevo proyecto creado en M2-01 | APRENDER | Mostrar `LeccionesAprendidas[]` relevantes del histórico filtradas por contexto | Sistema automático |

---

## 9. Plantilla Operativa: Plan de Mejora

Esta plantilla es el artefacto formal que documenta las mejoras comprometidas al cierre de un proyecto o al detectar una oportunidad de mejora en el análisis entre proyectos:


╔══════════════════════════════════════════════════════════════════╗
║ PLAN DE MEJORA — [ÁMBITO: Proyecto [ID] / Organización] ║
╚══════════════════════════════════════════════════════════════════╝
IDENTIFICACIÓN
ID del Plan: [PlanMejora.id]
Ámbito: [Proyecto específico / Toda la organización]
Proyecto origen: [ID del proyecto que generó este plan]
[null si es análisis cross-project]
Nivel CMMI actual: [1 | 2 | 3 | 4 | 5]
Nivel CMMI objetivo: [PlanMejora.nivelCMMIObjetivo: 1|2|3|4|5]
Áreas de proceso CMMI
afectadas: [PlanMejora.areasProcesoAfectadas[]]
Ej: ['PP', 'RSKM', 'MA', 'OPF']
Fecha de creación: [Date: YYYY-MM-DD]
Fecha de revisión: [PlanMejora.fechaRevision: YYYY-MM-DD]
Debe ser anterior al inicio del Proyecto N+1
Estado del plan: [activo | completado | suspendido]
Responsable del plan: [Rol: admin | gestor]
────────────────────────────────────────────────────────────────────
LECCIONES APRENDIDAS QUE ORIGINAN ESTE PLAN
[LeccionAprendida.id #1]: [descripcion resumida] | Impacto: [alto|medio|bajo]
[LeccionAprendida.id #2]: [descripcion resumida] | Impacto: [alto|medio|bajo]
...
────────────────────────────────────────────────────────────────────
ACCIONES DE MEJORA
[AccionMejora #1]
ID: [AccionMejora.id]
Tipo de cambio: [ver tabla §6.3 de M2-08]
Descripción: [qué cambia exactamente en qué archivo M2]
LeccionAprendida: [LeccionAprendida.id que originó esta acción]
GQM que lo motivó: [MetricaProceso.gqmObjetivo]
Métrica de éxito: [cómo se medirá que la mejora funcionó en el Proyecto N+1]
Archivo M2 afectado: [M2-01 | M2-02 | M2-03 | M2-04 | M2-05 | M2-07 | M3-05]
Prioridad: [alta | media | baja]
Fecha comprometida: [antes de qué proyecto se aplica: YYYY-MM-DD]
Estado: [pendiente | en_progreso | implementada]
[AccionMejora #2]
[mismo formato]
────────────────────────────────────────────────────────────────────
MÉTRICAS DE SEGUIMIENTO DEL PLAN
KPI del plan: % de acciones implementadas en fecha
= (acciones_implementadas_a_tiempo / total_acciones_con_fecha) × 100
Meta: > 80% antes de la fecha de revisión del plan
────────────────────────────────────────────────────────────────────
VALIDACIÓN DE IMPACTO (completar tras ejecutar Proyecto N+1)
Por cada AccionMejora implementada:
GQM original (Proyecto N): [valor de la métrica que motivó el cambio]
GQM en Proyecto N+1: [valor de la misma métrica después del cambio]
¿Mejoró la métrica? [sí | no | sin datos aún]
Diferencia porcentual: [valor]
Conclusión: [la mejora fue efectiva | requiere ajuste | revertir]
text

---

## 10. KPIs de Madurez de Proceso a Nivel Organización

Estos KPIs complementan los KPIs de proyecto de M2-05 §9. Miden la madurez del proceso a nivel de toda la organización que usa austranet-cco, cruzando datos de múltiples proyectos:

| KPI | Definición | Fórmula | Meta | Alerta | Nivel CMMI |
|---|---|---|---|---|---|
| **Tasa de adopción de GQM** | % de proyectos completados que definieron GQMs al inicio | `(proyectos_con_gqm / total_proyectos_completados) × 100` | > 90% | < 70% | Nivel 3 |
| **Tendencia de precisión de estimación** | Variación de la desviación promedio de esfuerzo entre proyectos consecutivos | `Δ desviación_n vs desviación_(n-1)` (negativo = mejora) | Mejora ≥ 5% por año | Sin mejora en 3 proyectos consecutivos | Nivel 4 |
| **Tasa de lecciones aprendidas implementadas** | % de `AccionesMejora` en `estado = 'implementada'` | `(acciones_implementadas / total_acciones) × 100` | > 75% | < 50% | Nivel 3 |
| **Riesgos recurrentes no controlados** | % de riesgos materializados que ya aparecían en proyectos anteriores sin plan de mitigación | `(recurrentes_sin_mitigacion / total_materializados) × 100` | < 10% | > 25% | Nivel 3 |
| **Cobertura del ciclo de mejora** | % de proyectos completados que pasaron por el ciclo completo medir-analizar-cambiar | `(proyectos_con_ciclo_completo / total_completados) × 100` | > 85% | < 60% | Nivel 3–4 |
| **Nivel CMMI medio de proyectos** | Promedio del nivel CMMI evaluado en proyectos completados (tabla §7.2) | `Σ(nivelMadurezCMMI_proyecto) / total_proyectos_completados` | ≥ 3 | < 2 | — |

---

## 11. Tabla de Conexiones con los 3 Módulos

| Concepto de M2-08 | Módulo donde impacta | Campo / proceso específico |
|---|---|---|
| GQMs definidos al inicio | M2-01 (PASO 2) | `Proyecto.metricasProceso[].gqmObjetivo` |
| `MetricaProceso[]` durante el proyecto | M2-04 (seguimiento) | Informes de avance incluyen métricas GQM por sprint/hito |
| `LeccionAprendida` tipo `'estimacion'` | M2-02 | Ajuste de velocidad de referencia y factores de productividad |
| `LeccionAprendida` tipo `'proceso'` | M2-03 | Actualización del catálogo estándar de riesgos |
| `AccionMejora` tipo ajuste de metodología | M2-07 | Modificación de umbrales del árbol de decisión |
| `PlanMejora` a nivel organización | M2-05 | Cierre del ciclo de calidad del proceso; actualiza el marco estándar |
| Nivel CMMI evaluado del proyecto | M1 (perfil proveedor) | Campo de nivel de madurez en el perfil — visible para clientes |
| `LeccionesAprendidas[]` al crear nuevo proyecto | M2-01 (PASO 1 del próx. proyecto) | Historial de lecciones mostrado al gestor como contexto |
| `MetricaProceso[]` del SRS | M3-05, M3-06 | Datos de calidad del proceso de validación de requerimientos |
| Análisis entre proyectos §5.3 Análisis 3 | M3-05 (plantilla de validación) | Ajuste a criterios de M3-05 basado en datos históricos de revisiones |

---

## 12. Checklist de Completitud

| Ítem | Fuente en el libro | ✅ |
|---|---|---|
| Definición y propósito de la mejora de procesos (§26.1) | Cap. 26 §26.1, p. 709 | ✅ |
| Ciclo medir-analizar-cambiar mapeado al sistema (no duplica M2-05) | Cap. 26 §26.1 / M2-05 ref. | ✅ |
| GQM plantilla operativa (no duplica M2-05 definición teórica) | Cap. 26 §26.2 | ✅ |
| 3 GQMs ejemplo con campos `MetricaProceso` completos | Cap. 26 §26.2 | ✅ |
| Métricas de proceso del libro extraídas con cita (§26.2, p.711) | Cap. 26 §26.2 | ✅ |
| Problemas de la medición sin objetivo con citas (§26.2, p.712) | Cap. 26 §26.2 | ✅ |
| Modelado del proceso como base del análisis (§26.3) | Cap. 26 §26.3, p. 715 | ✅ |
| Análisis estadístico del proceso (§26.3) | Cap. 26 §26.3, p. 715 | ✅ |
| 3 análisis entre proyectos con outputs concretos (§26.3 + sistema) | §26.3 + sistema | ✅ |
| Cómo introducir cambios (§26.4, p. 719) | Cap. 26 §26.4 | ✅ |
| Problemas al cambiar procesos con citas textuales (§26.4, pp.720-721) | Cap. 26 §26.4 | ✅ |
| Mitigaciones del sistema para cada problema de §26.4 | §26.4 + sistema | ✅ |
| Tabla de tipos de `AccionMejora` con impacto en el sistema | §26.4 + sistema | ✅ |
| CMMI como hoja de ruta (no repite niveles de M2-05) | Cap. 26 §26.5, p. 724 | ✅ |
| Tabla de diagnóstico CMMI con evidencias en austranet-cco | §26.5 + sistema | ✅ |
| Áreas OPD, OPF, MA no cubiertas en M2-05 | Cap. 26 §26.5 | ✅ |
| Flujo completo de mejora entre proyectos (diagrama ASCII) | Sistema | ✅ |
| Tabla de condiciones de activación del ciclo | Sistema | ✅ |
| Plantilla operativa de `PlanMejora` con todos los campos | Sistema | ✅ |
| 6 KPIs de madurez cross-project con fórmulas y nivel CMMI | Sistema | ✅ |
| Tabla de conexiones con M1, M2, M3 | Sistema | ✅ |
| No repite: ciclo Fig.26.1, def. GQM, 5 niveles CMMI, PP/PMC/SAM/CM/PPQA | M2-05 | ✅ |

---

> **Documento generado con base en:**
> Sommerville, Ian. *Ingeniería de Software*, 9.ª edición.
> Pearson Educación, 2011. Capítulo 26 (§26.1 al §26.5).
>
> **Extiende y coordina:**
> M2-01 (plan de proyecto), M2-02 (estimación de costos),
> M2-03 (registro de riesgos), M2-04 (seguimiento y control),
> M2-05 (calidad del proceso — no repite su contenido).
>
> **No repite:**
> Ciclo de mejora básico (Fig.26.1), definición GQM,
> niveles CMMI y áreas PP/PMC/SAM/CM/PPQA documentados
> en M2-05. Este archivo extiende esos conceptos con
> la aplicación operativa del ciclo de mejora entre
> proyectos en el sistema austranet-cco.
