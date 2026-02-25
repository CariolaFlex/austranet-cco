# M2-05 — Calidad del Proceso del Proyecto

---

## Metadatos

| Campo            | Valor                                                                 |
|------------------|-----------------------------------------------------------------------|
| **Archivo**      | `M2-05-calidad-proceso-proyecto.md`                                   |
| **Módulo**       | Módulo 2 — Registro y Configuración de Proyectos                      |
| **Capítulos fuente** | Cap. 24 §24.2, §24.3, §24.4 · Cap. 26 §26.1, §26.2, §26.3, §26.4, §26.5 |
| **Fuente bibliográfica** | Sommerville, I. *Ingeniería de Software*, 9ª ed., Pearson, 2011 |
| **Versión**      | 1.0.0                                                                 |
| **Fecha**        | 2026-02-24                                                            |
| **Estado**       | ✅ Completo — Cierre del Módulo 2                                      |
| **Depende de**   | M2-01, M2-02, M2-03, M2-04, M1-07                                    |
| **Conecta con**  | M1-07 (KPIs entidades), M3 (inicio SRS)                              |

---

## 1. Objetivo del Documento

Este archivo documenta el **marco teórico de gestión de calidad del proceso** aplicado a cada proyecto activo en el sistema, y constituye el **cierre formal del Módulo 2**. No describe qué hace el proyecto, sino **cómo se verifica que se está gestionando bien**.

La calidad en el Módulo 2 opera en **tres dimensiones complementarias**:

| Dimensión | Pregunta central | Sección que la aborda |
|-----------|-----------------|----------------------|
| **D1 — Calidad del proceso de gestión** | ¿Se están siguiendo los procesos de M2-01 a M2-04? | §4 (Revisiones e Inspecciones), §5 (Medición GQM) |
| **D2 — Calidad del producto del proceso** | ¿Los artefactos que produce la gestión (plan, registros, informes) son completos y precisos? | §3 (Plan de Calidad), §10 (KPIs) |
| **D3 — Mejora continua del proceso** | ¿El equipo aprende de cada proyecto para mejorar el siguiente? | §6 (Mejora de procesos), §7 (CMM/CMMI), §8 (Ágil) |

Este archivo es la **base del sistema de certificación de calidad** que el equipo puede presentar ante clientes exigentes. Un proyecto gestionado con los procesos del sistema y evaluado con los estándares de la §9 constituye evidencia tangible de madurez profesional, directamente comparable con prácticas de nivel 2 y 3 del modelo CMMI (§7).

> **Nota de integración:** El presente archivo **no repite** contenidos de M1-07 (calidad de datos de entidades) ni de M2-01 a M2-04 (procesos que este archivo evalúa). Donde sea necesario referenciar esos contenidos, se indica explícitamente.

---

## 2. Planes de Calidad (Cap. 24 §24.2, pp. 653–654)

### 2.1 Definición y propósito

Sommerville define la planeación de calidad de la siguiente manera:

> *"La planeación de calidad es el proceso de desarrollar un plan de calidad para un proyecto. El plan de calidad debe establecer las cualidades deseadas de software y describir cómo se valorarán. Por lo tanto, define lo que realmente significa software de alta calidad para un sistema particular."* (Cap. 24 §24.2, p. 653)

Sin un plan de calidad, los ingenieros pueden hacer suposiciones distintas —a veces contradictorias— sobre qué atributos del producto son los más importantes. El plan formaliza ese acuerdo antes de que comience el trabajo.

- **Quién lo elabora:** El gestor del proyecto, con apoyo del equipo QA cuando existe. En organizaciones pequeñas, las responsabilidades de desarrollo y calidad recaen en las mismas personas.
- **Cuándo se crea:** Al inicio del proyecto, como parte del proceso de planificación general. Es un plan complementario al plan de proyecto (ver M2-01 Sección 9), no el mismo documento.
- **Audiencia:** El equipo de desarrollo, el cliente y el equipo QA.

### 2.2 Estructura completa del plan de calidad

Sommerville recoge la estructura propuesta por Humphrey (1989), que es la referencia estándar para planes de calidad de proyecto:

> *"Humphrey (1989), en su clásico libro referente a la gestión del software, sugiere un bosquejo de estructura para un plan de calidad."* (Cap. 24 §24.2, p. 653)

Las secciones son:

| N° | Sección | Contenido |
|----|---------|-----------|
| 1 | **Introducción del producto** | Descripción del producto, la pretensión de su mercado y las **expectativas de calidad** para el producto. Fija el contexto del plan. |
| 2 | **Planes del producto** | Fechas de entrega críticas y responsabilidades para el producto, junto con planes para distribución y servicio. Define el calendario de control de calidad. |
| 3 | **Descripciones de procesos** | Los procesos y estándares de desarrollo y servicio que deben usarse para **diseño y gestión del producto**. Referencia directa a M2-01 a M2-04. |
| 4 | **Metas de calidad** | Las metas y los planes de calidad para el producto, incluyendo **identificación y justificación de los atributos esenciales** de calidad. Por ejemplo: fiabilidad, portabilidad, mantenibilidad. |
| 5 | **Riesgos y gestión del riesgo** | Los riesgos clave que pueden afectar la calidad del producto y las **acciones a tomar** para enfrentar dichos riesgos. Vinculado directamente con M2-03. |

> *"Cuando escriba planes de calidad, debe tratar de mantenerlos tan breves como sea posible. Si el documento es demasiado amplio, las personas no lo leerán y, en consecuencia, se anulará el propósito de generar un plan de calidad."* (Cap. 24 §24.2, p. 654)

### 2.3 Relación plan de calidad ↔ plan de proyecto

El plan de calidad es un **plan complementario**, no parte del plan de proyecto. Sommerville lo confirma en la figura 23.2 (Cap. 23, p. 624):

> *"Plan de calidad: Describe los procedimientos de calidad y estándares que se usarán en un proyecto."*

**Diferencia fundamental:**

| Documento | Responde a | Contenido principal |
|-----------|-----------|---------------------|
| **Plan de proyecto** (M2-01) | ¿Qué hay que hacer, cuándo y con quién? | Alcance, cronograma, recursos, riesgos operativos |
| **Plan de calidad** (este archivo) | ¿Cómo sabremos que se está haciendo bien? | Metas de calidad, procesos de verificación, estándares aplicables |

Ambos se crean al inicio del proyecto. El plan de calidad **referencia** al plan de proyecto, pero no lo contiene.

### 2.4 Plan de calidad en proyectos ágiles

Para proyectos con `metodologia: 'agil_scrum'`, Sommerville reconoce que:

> *"Los métodos ágiles adoptan un enfoque menos formal para la gestión de calidad."* (Cap. 24 §24.2, p. 653)

En estos proyectos el plan de calidad se adapta de la siguiente forma:

- **Metas de calidad** se expresan como criterios de aceptación de las historias de usuario
- **Descripciones de procesos** se reducen a las prácticas del equipo Scrum (revisión de sprint, retrospectiva)
- **Riesgos** se revisan en cada sprint planning, no de forma periódica fija
- La documentación es mínima pero los **compromisos de calidad** siguen vigentes

El plan de calidad ágil es un artefacto vivo que evoluciona sprint a sprint.

### 2.5 Responsabilidades de calidad

Sommerville es explícito sobre quién responde de qué:

> *"El equipo QA debe ser independiente del equipo de desarrollo para que pueda tener una perspectiva objetiva del software. Esto les permite reportar la calidad del software sin estar influidos por los conflictos de desarrollo del software."* (Cap. 24 §24.2, p. 653)

En el contexto del sistema:

| Rol | Responsabilidad |
|-----|----------------|
| **Gestor del proyecto** | Elaborar y mantener el plan de calidad; asegurar que el equipo sigue los procesos definidos |
| **Equipo de desarrollo** | Cumplir los estándares del plan de calidad; reportar desviaciones |
| **Responsable QA** (o el gestor si equipo pequeño) | Verificar independientemente que se siguen los procesos; generar reportes de calidad |
| **Cliente** | Validar que las metas de calidad del plan corresponden a sus expectativas |

> **Aplicación en el sistema:** El plan de calidad es el artefacto que el gestor completa al activar un proyecto (parte del PASO 7 de M2-01). Se almacena como un documento estructurado asociado al `proyectoId`. Define los estándares que se aplicarán a ese proyecto específico: qué atributos de calidad son prioritarios, qué procesos se seguirán y quién es responsable de verificarlos.

---

## 3. Revisiones e Inspecciones del Proceso (Cap. 24 §24.3, pp. 663–669)

### 3.1 Definición y alcance

> *"Las revisiones e inspecciones son actividades QA que comprueban la calidad de los entregables del proyecto. Esto incluye examinar el software, su documentación y los registros del proceso para descubrir errores y omisiones, así como observar que se siguieron los estándares de calidad."* (Cap. 24 §24.3, p. 663)

> *"Durante una revisión, un grupo de personas examinan el software y su documentación asociada en busca de problemas potenciales y la falta de conformidad con los estándares. El equipo de revisión realiza juicios informados sobre el nivel de calidad de un entregable de sistema o de proyecto."* (Cap. 24 §24.3, p. 663)

### 3.2 Inspección del proceso vs. inspección del producto

| Tipo | Objeto de inspección | Pregunta que responde | Cuándo aplicar en M2 |
|------|---------------------|----------------------|----------------------|
| **Inspección del proceso** | Los pasos y actividades de gestión seguidos | ¿Se gestionó el proyecto como se definió? | En cada hito del proyecto (Ver M2-01 §10) |
| **Inspección del producto** | Los artefactos producidos (plan, registros, informes) | ¿Los entregables de gestión son completos y correctos? | Al entregar cada artefacto al cliente o al cierre |

Sommerville confirma que ambas son necesarias:

> *"Al igual que las especificaciones, el diseño o el código del software, también pueden revisarse los modelos de proceso, planes de prueba, procedimientos de gestión de configuración, estándares de proceso y manuales de usuario."* (Cap. 24 §24.3, p. 663)

### 3.3 Revisión del plan de proyecto

**Qué se verifica:**
- Coherencia e integridad del documento (todos los campos del plan de M2-01 Sección 9 completados)
- Correspondencia entre alcance, recursos y cronograma
- Que los riesgos identificados son consistentes con el nivel de complejidad del proyecto
- Que los mecanismos de monitorización y reporte están definidos (M2-01 §9.7)

**Quién lo revisa:** El responsable QA, el cliente (para validar alcance y metas), opcionalmente un par técnico.

**Frecuencia:** Una vez al inicio, y nuevamente tras cualquier cambio de alcance mayor (Ver M2-04 control de cambios).

### 3.4 Revisión del registro de riesgos

El registro de riesgos (M2-03) es un artefacto vivo. Además de registrar los riesgos, la revisión de calidad del propio registro debe verificar:

**Criterios de calidad del registro de riesgos:**

| Criterio | Pregunta de verificación | Indicador de problema |
|----------|--------------------------|----------------------|
| **Completitud** | ¿Cada riesgo tiene todos los campos requeridos? | Campos vacíos en probabilidad, impacto o categoría |
| **Formulación correcta** | ¿Los riesgos están expresados como condición + consecuencia? | Riesgos expresados como tareas o hechos ciertos |
| **Planes concretos** | ¿Los planes de mitigación son accionables y tienen responsable? | Planes vagos: "revisar el tema", sin fecha ni responsable |
| **Cobertura** | ¿Se cubren las categorías principales (técnico, externo, organizacional)? | Solo riesgos técnicos, sin considerar riesgos de gestión |
| **Actualización** | ¿La fecha de última revisión es reciente? | Registro sin actualizar por más de 30 días en proyecto activo |

### 3.5 Auditoría de proceso

Sommerville distingue entre **revisión** (evaluación periódica de artefactos) y **auditoría** (evaluación formal independiente del proceso completo):

> *"Las conclusiones de la revisión deben registrarse formalmente como parte del proceso de gestión de calidad."* (Cap. 24 §24.3, p. 663)

**Auditoría de proceso:**
- **Definición:** Examen formal, realizado por alguien externo al equipo del proyecto, que verifica si el proceso definido se siguió de principio a fin
- **Diferencia con revisión:** La revisión es periódica e interna; la auditoría es puntual, formal e independiente
- **Cuándo realizarla:** Al cierre del proyecto, o cuando el cliente lo solicite, o cuando la revisión periódica detecta desviaciones sistemáticas
- **Resultado:** Informe formal de auditoría que queda como evidencia en el historial del proyecto

### 3.6 Métricas de calidad del proceso que el libro menciona

Derivadas de Cap. 24 §24.3 y Cap. 26 §26.2:

- **Tasa de cumplimiento de procesos definidos:** porcentaje de actividades del proceso estándar ejecutadas según lo definido
- **Número de excepciones al proceso documentadas:** cuántas veces el equipo se desvió del proceso y lo registró formalmente (vs. desviaciones no documentadas)
- **Número de revisiones completadas en tiempo:** de las revisiones programadas en hitos, cuántas se realizaron en la fecha prevista

> **Aplicación en el sistema:** Las revisiones de proceso del Módulo 2 se ejecutan en cada hito del proyecto (referencia M2-01 Sección 10) y producen un **informe de calidad del proceso** que se agrega al historial del proyecto como un evento del tipo `revision_proceso`. Este informe incluye: fecha, responsable, criterios verificados, hallazgos y estado (conforme / no conforme con observaciones).

---

## 4. Medición de la Calidad del Proceso (Cap. 26 §26.2, pp. 711–714)

### 4.1 Tipos de métricas de proceso

Sommerville clasifica las métricas de proceso en tres categorías:

> *"Pueden recopilarse tres tipos de métricas de proceso: 1. El tiempo que tarda en completarse un proceso particular [...] 2. Los recursos requeridos para un proceso particular [...] 3. El número de ocurrencias de un evento particular."* (Cap. 26 §26.2, p. 711)

### 4.2 El paradigma GQM (Meta–Pregunta–Métrica)

> *"Basili y Rombach (1988) proponen lo que llaman el paradigma GQM (Meta-Pregunta-Métrica, por las siglas de Goal-Question-Metric), que se usa ampliamente en la medición del software y los procesos."* (Cap. 26 §26.2, p. 712)

El paradigma GQM responde tres preguntas fundamentales:

1. **¿Por qué** se introduce la mejora de procesos? → **Meta**
2. **¿Qué** información se necesita para identificar y valorar las mejoras? → **Preguntas**
3. **¿Qué mediciones** se requieren para obtener esa información? → **Métricas**

> *"La ventaja de usar el enfoque GQM en la mejora de procesos es que separa las preocupaciones de la organización (las metas) de preocupaciones específicas del proceso (las preguntas). Proporciona una base para determinar cuáles datos deben recopilarse."* (Cap. 26 §26.2, p. 713)

### 4.3 GQMs específicos del sistema

---

#### GQM #1 — Gestión del Riesgo

| Elemento | Contenido |
|----------|-----------|
| **Meta** | Reducir la tasa de riesgos que se materializan sin haber sido mitigados |
| **Pregunta 1** | ¿Con qué frecuencia se revisa el registro de riesgos? |
| **Pregunta 2** | ¿Qué porcentaje de riesgos identificados tiene un plan de mitigación documentado? |
| **Métrica 1** | `Frecuencia_revision = días_calendario entre revisiones del registro` |
| **Métrica 2** | `Cobertura_mitigacion = (riesgos_con_plan / total_riesgos_activos) × 100` |
| **Meta numérica** | Frecuencia ≤ 14 días; Cobertura ≥ 90% |

---

#### GQM #2 — Control de Cambios

| Elemento | Contenido |
|----------|-----------|
| **Meta** | Minimizar los cambios no planificados al alcance del proyecto |
| **Pregunta 1** | ¿Qué porcentaje de cambios al alcance fue procesado formalmente mediante el proceso de control de cambios (M2-04)? |
| **Pregunta 2** | ¿Cuántos cambios informales (ejecutados sin solicitud formal aprobada) se detectaron en cada revisión de proceso? |
| **Métrica 1** | `Tasa_cambios_formales = (cambios_con_solicitud_aprobada / total_cambios) × 100` |
| **Métrica 2** | `Cambios_informales = número de cambios implementados sin trazabilidad formal detectados por período` |
| **Meta numérica** | Tasa formal = 100%; Cambios informales = 0 |

---

#### GQM #3 — Seguimiento de Hitos

| Elemento | Contenido |
|----------|-----------|
| **Meta** | Maximizar el cumplimiento de hitos en la fecha planificada |
| **Pregunta 1** | ¿Qué porcentaje de hitos del proyecto se completó en la fecha planificada o antes? |
| **Pregunta 2** | ¿Cuál es la desviación promedio en días cuando un hito se completa tarde? |
| **Métrica 1** | `Cumplimiento_hitos = (hitos_en_tiempo / total_hitos_vencidos) × 100` |
| **Métrica 2** | `Desviacion_promedio_hitos = Σ(dias_retraso) / hitos_retrasados` |
| **Meta numérica** | Cumplimiento ≥ 85%; Desviación promedio ≤ 5 días |

---

#### GQM #4 — Calidad de Estimaciones

| Elemento | Contenido |
|----------|-----------|
| **Meta** | Mejorar la precisión de las estimaciones de costo y duración a lo largo de los proyectos del equipo |
| **Pregunta 1** | ¿Cuál es la desviación porcentual entre el costo estimado al inicio y el costo real al cierre del proyecto? |
| **Pregunta 2** | ¿Cómo evoluciona la precisión de estimación de un proyecto al siguiente (tendencia de mejora)? |
| **Métrica 1** | `Error_estimacion_costo = abs(costo_real - costo_estimado) / costo_estimado × 100` |
| **Métrica 2** | `Tendencia_precision = Error_estimacion(proyecto_n) - Error_estimacion(proyecto_n-1)` *(negativo = mejora)* |
| **Meta numérica** | Error ≤ 20%; Tendencia negativa (mejora proyecto a proyecto) |

> **Aplicación en el sistema:** Las métricas GQM se recopilan automáticamente a partir de los eventos registrados en M2-03 (cambios en el registro de riesgos), M2-04 (informes de avance, solicitudes de cambio) y M2-01 (fechas de hitos). Los valores se calculan al cierre de cada proyecto y alimentan el ciclo de mejora descrito en §5.

---

## 5. Mejora del Proceso de Software (Cap. 26 §26.1, pp. 708–711)

### 5.1 Definición formal de mejora del proceso

> *"Por lo tanto, la mejora de procesos no significa simplemente adoptar métodos o herramientas particulares o usar un proceso genérico publicado. [...] Siempre hay que considerar el entorno y la cultura locales y cómo esto puede verse afectado por las propuestas de cambio del proceso."* (Cap. 26 §26.1, p. 709)

La mejora del proceso de software es la actividad sistemática de **identificar debilidades en los procesos actuales y modificarlos** para obtener software de mejor calidad, reducir costos de proceso y acelerar la entrega.

### 5.2 El ciclo de mejora del proceso

Sommerville describe el proceso de mejora como cíclico y continuo:

> *"El proceso de mejora de procesos es cíclico [...]. Incluye tres subprocesos: 1. Medición del proceso [...] 2. Análisis del proceso [...] 3. Cambio del proceso."* (Cap. 26 §26.1, p. 710)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  MEDICIÓN   │────▶│   ANÁLISIS  │────▶│   CAMBIO    │
│ del proceso │     │ del proceso │     │ del proceso │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                                       │
       └───────────────────────────────────────┘
                   Nueva medición
```

**Subproceso 1 — Medición:** Se miden atributos del proyecto actual o el producto. La meta es mejorar las medidas de acuerdo con los objetivos de la organización. Esto constituye una línea de referencia para determinar si las mejoras son efectivas.

**Subproceso 2 — Análisis:** Se valora el proceso actual y se identifican las debilidades y los cuellos de botella. Pueden desarrollarse modelos de proceso que describan el proceso.

**Subproceso 3 — Cambio:** Los cambios al proceso son propuestas para atacar algunas de las debilidades identificadas del proceso. Estos cambios se introducen y el ciclo vuelve a recopilar datos sobre la efectividad de los cambios.

> *"La mejora del proceso es una actividad de largo plazo, así que cada una de las etapas en el proceso de mejora puede durar varios meses. También es una actividad continua pues, independientemente de los procesos introducidos, el ambiente de negocios cambiará y los nuevos procesos tendrán que evolucionar."* (Cap. 26 §26.1, p. 711)

### 5.3 Enfoque de madurez vs. enfoque ágil de mejora

Sommerville presenta dos enfoques para la mejora del proceso:

> *"Los principales enfoques para la mejora de procesos son los enfoques ágiles, orientados a reducir los costos de los procesos, y los enfoques fundados en la madurez sobre la base de una mejor gestión de procesos y el uso de buenas prácticas de ingeniería de software."* (Cap. 26, Puntos Clave, p. 728)

| Dimensión | Enfoque de Madurez (CMM/CMMI) | Enfoque Ágil (Retrospectivas) |
|-----------|-------------------------------|-------------------------------|
| **Foco** | Gestión de procesos, documentación, estandarizacin | Personas, comunicación, entrega rápida |
| **Mecanismo** | Valoraciones formales de madurez, planes de mejora | Retrospectivas de sprint, experimentación |
| **Adecuado para** | Proyectos grandes, sistemas críticos, múltiples equipos | Proyectos pequeños/medianos, equipos cohesionados |
| **Costo** | Alto (requiere inversión en proceso) | Bajo (integrado en el flujo de trabajo) |
| **Velocidad** | Lento (mejora de largo plazo) | Rápido (mejora sprint a sprint) |

> *"el autor considera que, para proyectos pequeños y medianos, adoptar las prácticas ágiles es probablemente la estrategia de mejora de proceso más efectiva en costo. Sin embargo, para sistemas grandes, sistemas críticos y sistemas que involucran a desarrolladores en diferentes compañías, los conflictos de administración a menudo son las razones por las que los proyectos pueden tener problemas."* (Cap. 26, p. 707)

### 5.4 Relación causal: proceso → calidad del producto

> *"Como se explicó en el capítulo 24, el proceso de desarrollo usado para crear un sistema de software influye en la calidad de dicho sistema. Por eso, muchas personas creen que mejorar el proceso de desarrollo de software conducirá a un software de mejor calidad."* (Cap. 26, p. 707)

Sommerville identifica cuatro factores que afectan la calidad del producto (Figura 26.1):

1. **Calidad del proceso** — principal factor en proyectos grandes
2. **Calidad del personal** — principal factor en proyectos pequeños
3. **Tecnología de desarrollo** — importante en equipos pequeños
4. **Costo, tiempo y calendarización** — presupuesto inadecuado degrada la calidad

### 5.5 Barreras para la mejora del proceso

Sommerville identifica las siguientes barreras en Cap. 26 §26.4 (pp. 719–721):

| Barrera | Descripción | Cómo superarla |
|---------|-------------|----------------|
| **Resistencia al cambio** | Miembros del equipo o líderes de proyecto se oponen a nuevos procesos; exponen razones por las que los cambios no funcionarán | Incluir al equipo en el diseño del cambio; explicar el beneficio concreto; reconocer sus preocupaciones |
| **Pérdida del evangelista** | El cambio depende de un individuo comprometido; si ese individuo se va, el proceso vuelve al estado anterior | Institucionalizar el cambio (que quede en manuales y prácticas estándar, no solo en personas) |
| **Presupuesto y tiempo insuficientes** | Los cambios a los procesos tienen costo y generan demoras a corto plazo | Aumentar el presupuesto del proyecto para permitir costos adicionales de la transición |
| **Beneficios a largo plazo vs. presión inmediata** | Los beneficios de la mejora de procesos son de largo plazo; la presión del proyecto es inmediata | Ser realista sobre el horizonte de beneficios; no prometer mejoras inmediatas |
| **Múltiples cambios simultáneos** | Introducir muchos cambios a la vez hace imposible valorar el efecto de cada uno | Introducir cambios de uno en uno; evaluar cada cambio antes del siguiente |

> **Aplicación en el sistema:** El ciclo de mejora del proceso se implementa a través de las **Lecciones Aprendidas de M2-04**. Cada proyecto completado registra: qué procesos funcionaron bien, cuáles fallaron y qué cambio específico se propone para el siguiente proyecto. Estos registros alimentan la siguiente instancia del ciclo Medición → Análisis → Cambio.

---

## 6. El Modelo CMM/CMMI (Cap. 26 §26.5, pp. 722–728)

### 6.1 Origen y definición

> *"El Software Engineering Institute (SEI) se estableció para mejorar las capacidades de la industria de software estadounidense. A mediados de la década de 1980, el SEI inició un estudio de formas para valorar las capacidades de los contratistas de software. El resultado de esta valoración de capacidad fue el Modelo de Madurez de Capacidades de Software CMM (Software Capability Maturity Model) del SEI."* (Cap. 26 §26.5, p. 722)

**Evolución CMM → CMMI:**

> *"Con la intención de integrar el cúmulo de modelos de capacidad con base en la noción de madurez de proceso —incluidos sus propios modelos—, el SEI se embarcó en un nuevo programa para desarrollar un modelo de capacidad integrado CMMI. El marco CMMI sustituye los CMM de ingeniería de software y sistemas, e integra otros modelos de madurez de capacidades. Tiene dos ejemplificaciones, en etapas y continuo."* (Cap. 26 §26.5, p. 722)

El CMMI identifica **22 áreas de proceso** organizadas en cuatro grupos (Cap. 26 §26.5, Figura 26.7, p. 723):

| Grupo | Áreas de proceso incluidas |
|-------|---------------------------|
| **Gestión de procesos** | OPD, OPF, OT, OPP, OID |
| **Gestión de proyectos** | PP, PMC, SAM, IPM, RSKM, QPM |
| **Ingeniería** | REQM, RD, TS, PI, VER, VAL |
| **Soporte** | CM, PPQA, MA, DAR, CAR |

### 6.2 Los cinco niveles de madurez del CMM por etapas

El CMMI por etapas es el modelo más comparable con el CMM original y el más usado para valorar la madurez de una organización como un todo:

> *"Su versión en etapas es compatible con el CMM de software y permite que los procesos de desarrollo y gestión del sistema de una organización se valoren asignándoles un nivel de madurez de 1 a 5."* (Cap. 26 §26.5, p. 722)

---

#### Nivel 1 — Inicial

**Características:**
- Los procesos son impredecibles, poco controlados y reactivos
- El éxito depende del esfuerzo individual de las personas, no de los procesos
- No existe estandarización; cada proyecto se gestiona de forma diferente
- Los problemas se resuelven de forma heroica pero no sistemática

**Riesgos:**
- Alta variabilidad en la calidad de los entregables
- Incapacidad de repetir el éxito de un buen proyecto
- Dependencia crítica de personas clave (el proyecto fracasa si el individuo se va)
- El cliente no puede predecir el comportamiento del proveedor

*Nota: Este nivel corresponde a la ausencia de cualquier proceso formal. Una organización que no usa los procesos de M2-01 a M2-04 opera en nivel 1.*

---

#### Nivel 2 — Gestionado (Repetible en el CMM original)

**Características:**
Sommerville describe las áreas de proceso requeridas para este nivel:

> *"Las áreas de proceso definidas en el modelo asociado con el segundo nivel (el nivel gestionado) son: 1. Gestión de requerimientos [...] 2. Planeación de proyecto [...] 3. Monitorización y control del proyecto [...] 4. Gestión de acuerdos con el proveedor [...] 5. Medición y análisis [...] 6. Aseguramiento de calidad de proceso y producto [...] 7. Administración de la configuración."* (Cap. 26 §26.5, p. 726)

**Prácticas clave:**
- Los proyectos se planifican y se monitoriza su avance contra el plan
- Los requerimientos se gestionan y se controlan los cambios
- Los productos de trabajo se revisan y se verifican que cumplen los estándares
- Se mantienen métricas básicas del proyecto

**Meta genérica del nivel 2:**
> *"Además de estas prácticas específicas, las organizaciones que operan en el segundo nivel en el modelo CMMI deben lograr la meta genérica de institucionalizar cada uno de los procesos como un proceso gestionado."* (Cap. 26 §26.5, p. 726)

**Ejemplos de prácticas institucionales (planeación de proyectos, nivel 2):**
- Establecer y mantener una política organizacional para planear y realizar el proceso de planeación del proyecto
- Brindar recursos adecuados para realizar el proceso de gestión de proyecto
- Monitorizar y controlar el proceso de planeación del proyecto con base en el plan y tomar acciones correctivas adecuadas
- Revisar las actividades, el estado y los resultados del proceso con gestión de alto nivel

---

#### Nivel 3 — Definido

**Características:**
> *"Este nivel se enfoca en la estandarización organizacional y el despliegue de procesos. Cada proyecto tiene un proceso gestionado que se adapta a los requerimientos del proyecto desde un conjunto definido de procesos organizacionales. Deben recopilarse activos y mediciones de proceso, además de usarse para futuras mejoras de proceso."* (Cap. 26 §26.5, p. 724)

**Prácticas clave:**
- Existe un proceso estándar de la organización documentado y mantenido
- Todos los proyectos se gestionan usando versiones adaptadas del proceso estándar
- Las lecciones aprendidas de proyectos anteriores se capturan y reutilizan
- Se forma al personal en los procesos estándar

**Diferencia nivel 2 vs. nivel 3:**
- En nivel 2: cada proyecto define sus propios procesos
- En nivel 3: todos los proyectos parten de un proceso organizacional estándar y lo adaptan

---

#### Nivel 4 — Gestionado Cuantitativamente

**Características:**
> *"En este nivel hay una responsabilidad organizacional cuya finalidad es usar métodos estadísticos y cuantitativos para controlar los subprocesos; esto es, deben utilizarse mediciones recopiladas de proceso y producto en la gestión del proceso."* (Cap. 26 §26.5, p. 724)

**Prácticas clave:**
- Los procesos se controlan estadísticamente (control de calidad cuantitativo)
- Se establecen objetivos cuantitativos para la calidad del proceso y del producto
- La variación en el rendimiento del proceso se entiende y se gestiona
- Los subprocesos se seleccionan para control estadístico basándose en su impacto en los objetivos

**Métricas características:**
- Distribuciones estadísticas de tiempos de ciclo, tasas de defectos, productividad
- Límites de control de proceso (UCL/LCL)
- Correlaciones entre atributos del proceso y atributos del producto

---

#### Nivel 5 — Optimizado

**Características:**
> *"En este nivel superior, la organización debe usar las mediciones de proceso y producto para impulsar la mejora de los procesos. Hay que analizar las tendencias y adaptar los procesos a las necesidades cambiantes de la empresa."* (Cap. 26 §26.5, p. 724)

**Prácticas clave:**
- La mejora continua del proceso está institucionalizada
- Las causas raíz de defectos y problemas se analizan sistemáticamente y se eliminan
- Los cambios de proceso se validan cuantitativamente antes de adoptarse universalmente
- La organización gestiona la innovación del proceso de forma proactiva

**Mecanismo principal:** Análisis causal y resolución (CAR) — el área de proceso que identifica causas de defectos y previene su recurrencia.

---

### 6.3 Evaluación del nivel de madurez

El CMMI continuo evalúa **áreas de proceso individuales** en una escala de 0 a 5:

> *"Una valoración CMMI implica examinar los procesos en una organización y clasificar dichos procesos o áreas de proceso en una escala de seis puntos que se relacionan con el nivel de madurez en cada área de proceso."* (Cap. 26 §26.5, p. 724)

Los seis niveles de capacidad del modelo continuo son:

| Nivel | Nombre | Descripción |
|-------|--------|-------------|
| 0 | **Incompleto** | Al menos no se satisface una de las metas específicas asociadas con el área de proceso |
| 1 | **Realizado** | Las metas están satisfechas; el alcance del trabajo se estableció explícitamente |
| 2 | **Gestionado** | Se satisfacen las metas; hay políticas organizacionales; planes documentados; procedimientos para gestión de recursos y monitorización |
| 3 | **Definido** | Foco en estandarización organizacional; el proyecto adapta un proceso organizacional estándar |
| 4 | **Gestionado cuantitativamente** | Se usan métodos estadísticos y cuantitativos para controlar subprocesos |
| 5 | **Optimizado** | Se usan mediciones para impulsar la mejora; se analizan tendencias y se adaptan procesos |

El resultado de una valoración continua es un **perfil de capacidad** (Figura 26.11) que muestra el nivel de cada área de proceso, permitiendo identificar fortalezas y brechas específicas.

### 6.4 Por qué el nivel CMM importa al cliente

El nivel de madurez CMM de un proveedor es una señal directa de confiabilidad:

- **Nivel 1:** El cliente no puede predecir si el proyecto será exitoso. Depende totalmente de las personas involucradas.
- **Nivel 2:** El cliente puede esperar que el proyecto se gestione según un plan, con seguimiento documentado. Los compromisos son más fiables.
- **Nivel 3:** El cliente recibe garantías de que el proveedor sigue un proceso estándar probado, no improvisado proyecto a proyecto.
- **Nivel 4+:** El cliente puede exigir métricas cuantitativas de calidad y el proveedor puede proporcionarlas con datos históricos.

Sommerville señala que algunos clientes lo exigen formalmente:
> *"Algunos clientes de software demandan que sus proveedores tengan la certificación ISO 9001. Así, los clientes podrán estar seguros de que la compañía que desarrolla el software tiene un sistema de gestión de calidad aprobado."* (Cap. 24 §24.2, p. 662)

La certificación CMM/CMMI cumple una función equivalente pero más específica para software.

### 6.5 Áreas de proceso clave en niveles 2 y 3

**Nivel 2 — Áreas de proceso:**

| Área | Sigla | Propósito |
|------|-------|-----------|
| Gestión de requerimientos | REQM | Gestionar requerimientos del proyecto; identificar inconsistencias |
| Planeación de proyecto | PP | Establecer y mantener planes que definan las actividades del proyecto |
| Monitorización y control del proyecto | PMC | Comprender el avance; tomar acciones correctivas cuando se desvía del plan |
| Gestión de acuerdos con el proveedor | SAM | Gestionar adquisición de productos/servicios de proveedores externos |
| Medición y análisis | MA | Desarrollar y sostener capacidad de medición para apoyar decisiones gerenciales |
| Aseguramiento de calidad de proceso y producto | PPQA | Ofrecer perspectiva objetiva de procesos y productos de trabajo |
| Administración de la configuración | CM | Establecer y mantener integridad de los productos de trabajo |

**Nivel 3 — Áreas de proceso adicionales (incluye las del nivel 2):**

| Área | Sigla | Propósito |
|------|-------|-----------|
| Definición de proceso organizacional | OPD | Establecer y mantener activos del proceso organizacional |
| Enfoque de proceso organizacional | OPF | Planear y ejecutar mejoras al proceso organizacional |
| Capacitación organizacional | OT | Desarrollar habilidades del personal para realizar sus roles |
| Gestión de proyectos integrados | IPM | Gestionar el proyecto usando proceso organizacional estándar adaptado |
| Gestión de riesgos | RSKM | Identificar problemas potenciales antes de que ocurran |
| Análisis y resolución de decisiones | DAR | Analizar decisiones posibles usando proceso de evaluación formal |
| Verificación | VER | Asegurar que los productos de trabajo cumplen sus requerimientos |
| Validación | VAL | Demostrar que el sistema cumple lo que el usuario pretende en su entorno |

> **Aplicación en el sistema:** El nivel CMM del equipo o proveedor puede registrarse en el perfil de la Entidad tipo `proveedor` en M1 (campo `nivelCMM`). Los proyectos gestionados con los procesos del sistema austranet-cco (M2-01 a M2-04) evidencian prácticas de **nivel 2** (planeación, monitorización, control de cambios, aseguramiento de calidad de proceso) y se aproximan a **nivel 3** cuando se aplican los procesos estándar de forma consistente entre proyectos.

---

## 7. Mejora de Procesos Ágiles (Cap. 26 §26.3, pp. 715–716; Cap. 3)

### 7.1 La retrospectiva como mecanismo de mejora continua

En metodologías ágiles, la mejora del proceso no ocurre mediante valoraciones formales CMM, sino mediante el mecanismo integrado de la **retrospectiva de sprint**:

> *"En el capítulo 3 y otras partes del libro se estudiaron los métodos ágiles, así que este capítulo se enfoca en la administración y la mejora del proceso basado en la madurez. [...] el autor considera que, para proyectos pequeños y medianos, adoptar las prácticas ágiles es probablemente la estrategia de mejora de proceso más efectiva en costo."* (Cap. 26, p. 707)

La retrospectiva responde sistemáticamente a tres preguntas:

1. **¿Qué salió bien?** → Prácticas a mantener y reforzar en el siguiente sprint
2. **¿Qué salió mal?** → Problemas del proceso que deben corregirse
3. **¿Qué mejoramos?** → Compromisos concretos de cambio para el siguiente sprint

**Estructura del ciclo ágil de mejora:**

```
Sprint N → Retrospectiva → Compromisos de mejora → Sprint N+1 → Verificar mejora
```

Los compromisos de mejora deben ser:
- **Específicos:** "Actualizaremos el registro de riesgos cada viernes" (no "mejoraremos la gestión de riesgos")
- **Accionables:** Asignados a una persona responsable
- **Verificables:** Al inicio del siguiente sprint se verifica si se cumplieron

### 7.2 Preguntas adicionales de la retrospectiva aplicadas al sistema

Para proyectos `agil_scrum` en el sistema, la retrospectiva de sprint incluye preguntas específicas de proceso de gestión:

- ¿Se actualizó el registro de riesgos durante el sprint?
- ¿Los cambios de alcance pasaron por el proceso formal de control de cambios (M2-04)?
- ¿El informe de avance refleja fielmente lo ejecutado vs. planificado?
- ¿Las estimaciones del sprint se desviaron de la realidad? ¿Por qué?

### 7.3 Comparación: mejora formal (CMM) vs. mejora ágil (retrospectivas)

| Aspecto | Mejora formal (CMM/CMMI) | Mejora ágil (Retrospectivas) |
|---------|--------------------------|------------------------------|
| **Ciclo** | Meses o años por ciclo | Sprint a sprint (semanas) |
| **Formalidad** | Alta; requiere valoraciones externas | Baja; interna al equipo |
| **Documentación** | Extensa; planes de mejora formales | Mínima; compromisos en el backlog |
| **Costo** | Alto | Casi nulo |
| **Alcance** | Organizacional | De equipo/proyecto |
| **Visibilidad para el cliente** | Alta (certificación, niveles) | Baja (proceso interno) |
| **Velocidad de mejora** | Lenta pero sistemática | Rápida pero puede ser superficial |

> *"Los métodos ágiles, que evitan la documentación y se enfocan en el código a desarrollar, tienen poco en común con los procesos de calidad formal que se examinan en ISO 9001."* (Cap. 24 §24.2, p. 662)

### 7.4 Métricas ágiles de proceso

Para proyectos `agil_scrum`, las métricas de proceso más relevantes que complementan las métricas GQM de §4.3 son:

| Métrica | Definición | Fórmula |
|---------|-----------|---------|
| **Velocidad del equipo** | Story points completados por sprint | `Σ(SP_completados) / número_sprints` |
| **Tasa de defectos por sprint** | Defectos encontrados por sprint normalizado por SP | `defectos_encontrados / SP_completados` |
| **Deuda técnica acumulada** | Trabajo técnico diferido como % del backlog total | `(items_deuda / total_backlog) × 100` |
| **Tasa de cumplimiento del sprint** | % de SP comprometidos que se completaron | `(SP_completados / SP_comprometidos) × 100` |

> **Aplicación en el sistema:** Para proyectos con `metodologia: 'agil_scrum'`, la retrospectiva de cada sprint se registra en el Módulo 2 como un **evento del proyecto** de tipo `retrospectiva_sprint`, con los campos: sprint número, fecha, lo que funcionó, lo que no funcionó, compromisos de mejora para el siguiente sprint y responsable de cada compromiso. Estos registros son insumo directo para las Lecciones Aprendidas de M2-04.

---

## 8. Estándar de Calidad del Proceso del Módulo 2

Este estándar define formalmente los criterios que un proyecto debe cumplir para considerarse **gestionado con calidad** en el sistema. Funciona como reglas de negocio directamente implementables.

---

### NIVEL BÁSICO — Gestión Documentada
*El proyecto tiene los artefactos mínimos de gestión creados.*

- [ ] Plan de proyecto completo (M2-01 Sección 9 — todos los campos completados)
- [ ] Registro de riesgos inicial con **mínimo 3 riesgos identificados** (M2-03)
- [ ] Estimación con **método documentado** (M2-02 — COCOMO, analogía o juicio experto)
- [ ] Al menos **3 hitos definidos** con entregables concretos y fechas (M2-01 §9.5)
- [ ] **Al menos 1 informe de avance** generado (M2-04)

**Criterio de superación:** Los 5 ítems marcados como completos.
**Estado en el sistema:** Proyecto `activo` sin indicadores de alerta.

---

### NIVEL ESTÁNDAR — Gestión Controlada
*El proyecto se está ejecutando con seguimiento activo del proceso.*

- [ ] Todo lo del Nivel Básico
- [ ] Registro de riesgos **revisado al menos una vez por hito** completado (M2-03)
- [ ] **Todos los cambios de alcance** procesados formalmente (M2-04 — tasa cambios formales = 100%)
- [ ] Desviación de cronograma **documentada** si supera 5 días (M2-04)
- [ ] **Plan de calidad elaborado** al inicio del proyecto (§3 de este archivo)
- [ ] KPIs de seguimiento (M2-04) con **valores actualizados** al menos en cada hito

**Criterio de superación:** Los 5 ítems de este nivel más todos los del Básico.
**Estado en el sistema:** Proyecto con `calidad: 'estandar'` — puede presentarse al cliente con documentación de gestión.

---

### NIVEL AVANZADO — Gestión Medida
*El proyecto genera datos que mejoran la organización y puede certificarse ante clientes exigentes.*

- [ ] Todo lo del Nivel Estándar
- [ ] **GQMs definidos** al inicio y **métricas recolectadas** durante el proyecto (§4.3)
- [ ] **Lecciones aprendidas documentadas** al cierre del proyecto (M2-04)
- [ ] **Retroalimentación al perfil de la Entidad** cliente/proveedor en M1 (M1-07)
- [ ] **Auditoría de proceso** realizada al menos una vez (§3.5 de este archivo)
- [ ] Para proyectos `agil_scrum`: **retrospectivas de sprint documentadas** en todos los sprints

**Criterio de superación:** Los 5 ítems de este nivel más todos los anteriores.
**Estado en el sistema:** Proyecto con `calidad: 'avanzado'` — evidencia de madurez de proceso nivel 2–3 CMM presentable ante clientes.

---

## 9. KPIs de Calidad del Proceso del Módulo 2

Complementan los KPIs de seguimiento operativo de M2-04. Estos KPIs miden **la calidad del proceso de gestión**, no el avance del proyecto.

| KPI | Dimensión | Definición | Fórmula | Meta | Alerta |
|-----|-----------|-----------|---------|------|--------|
| **Cumplimiento del proceso** | D1 — Gestión | % de pasos obligatorios del proceso de gestión ejecutados en el período | `(pasos_ejecutados / pasos_obligatorios) × 100` | 100% | < 90% |
| **Cobertura de mitigación** | D1 — Riesgos | % de riesgos activos que tienen plan de mitigación documentado | `(riesgos_con_plan / riesgos_activos) × 100` | > 90% | < 70% |
| **Puntualidad de informes** | D2 — Seguimiento | % de informes de avance generados en la fecha programada | `(informes_a_tiempo / informes_programados) × 100` | > 95% | < 80% |
| **Tasa de cambios formales** | D1 — Control | % de cambios de alcance procesados con solicitud formal aprobada | `(cambios_formales / total_cambios) × 100` | 100% | < 85% |
| **Completitud del plan** | D2 — Planificación | % de campos del plan de proyecto completados (M2-01 §9) | `(campos_completados / campos_totales) × 100` | 100% | < 90% |
| **Precisión de estimación** | D3 — Mejora | Desviación % entre estimación inicial y costo real al cierre | `abs(real - estimado) / estimado × 100` | < 20% | > 40% |
| **Frecuencia de revisión de riesgos** | D1 — Riesgos | Días promedio entre revisiones del registro de riesgos | `Σ(días entre revisiones) / nº revisiones` | ≤ 14 días | > 30 días |
| **Nivel de calidad alcanzado** | D1/D2/D3 | Nivel del Estándar de Calidad del Proceso (§8) que el proyecto cumple | Básico / Estándar / Avanzado | Estándar | Básico |

**Notas de interpretación:**
- Los KPIs de dimensión D1 se calculan durante el proyecto y se monitorean en tiempo real
- Los KPIs de dimensión D2 se verifican en cada revisión de proceso (hitos)
- Los KPIs de dimensión D3 se calculan al cierre del proyecto y alimentan la base de lecciones aprendidas

---

## 10. Cierre del Módulo 2 — Tabla de Conexiones

Integración de todos los archivos del Módulo 2 y sus conexiones con el resto del sistema:

| Archivo M2 | Concepto clave | Conecta con | Campo/proceso clave |
|------------|---------------|-------------|---------------------|
| **M2-01** | Planificación del proyecto y equipo | M1 (Entidad cliente/proveedor) | `clienteId`, `proveedorId`, `equipo[]` |
| **M2-01** | Hitos del proyecto | M3 (inicio del SRS) | `estadoSRS`, hito "Inicio SRS aprobado" |
| **M2-01** | Plan de proyecto base | M2-05 (evaluación de calidad) | Completitud del plan → KPI §9 |
| **M2-02** | Estimación de costos y esfuerzo | M3 (post-SRS, refinamiento) | `presupuestoEstimado` se refina tras SRS |
| **M2-02** | Método de estimación documentado | M2-05 (calidad del producto) | `metodoEstimacion` → Nivel Básico §8 |
| **M2-03** | Registro de riesgos del proyecto | M1 (herencia de riesgos del sector) | `nivelRiesgo` hereda contexto del cliente |
| **M2-03** | Riesgos que afectan el alcance | M3 (alertas al SRS) | Riesgos técnicos → alertas en `estadoSRS` |
| **M2-04** | Seguimiento y control de avance | M3 (cambios de alcance) | Cambios aprobados → nuevas versiones del SRS |
| **M2-04** | Control de cambios formal | M2-05 (tasa cambios formales) | KPI `tasa_cambios_formales` |
| **M2-04** | Lecciones aprendidas | M2-05 (ciclo de mejora) | Alimenta GQMs y Nivel Avanzado §8 |
| **M2-05** | Calidad del proceso de gestión | M1 (retroalimentación al proveedor) | `nivelCMM`, `calidad_proceso` en perfil entidad |
| **M2-05** | Mejora continua del proceso | M2-01 a M2-04 (próximo proyecto) | Lecciones aprendidas → ajuste de procesos |
| **M2-05** | Plan de calidad del proyecto | Todos los archivos M2 | Marco de referencia para evaluación de todos los artefactos |

**Conexiones con Módulos 1 y 3:**

| Desde | Hacia | Descripción de la conexión |
|-------|-------|---------------------------|
| M2-05 | M1-07 | Los KPIs de calidad del proceso (§9) complementan los KPIs de calidad de datos de entidades. No se repiten; se suman. |
| M2-05 | M1 (Entidad proveedor) | El `nivelCMM` del proveedor se registra en su perfil y es visible para el gestor del proyecto. |
| M2-01 hito | M3 | El hito "Inicio de documentación SRS" activa el Módulo 3. El `estadoSRS` pasa a `en_proceso`. |
| M2-04 cambio de alcance | M3 | Un cambio de alcance aprobado genera una nueva versión del SRS en Módulo 3. |

---

## 11. Checklist de Completitud

### Secciones del documento

- [x] **§1 Metadatos** — archivo, módulo, fuentes, versión, estado
- [x] **§2 Objetivo** — 3 dimensiones de calidad explicadas con tabla
- [x] **§3 Planes de Calidad** — Cap. 24 §24.2
  - [x] Definición formal de plan de calidad
  - [x] Estructura completa del plan de calidad (5 secciones de Humphrey)
  - [x] Diferencia plan de calidad vs. plan de proyecto
  - [x] Adaptación para proyectos ágiles
  - [x] Responsabilidades de calidad por rol
- [x] **§4 Revisiones e Inspecciones** — Cap. 24 §24.3
  - [x] Definición y alcance
  - [x] Inspección de proceso vs. producto
  - [x] Revisión del plan de proyecto
  - [x] Criterios de calidad del registro de riesgos
  - [x] Auditoría de proceso (definición, diferencia con revisión, cuándo)
  - [x] Métricas de calidad del proceso
- [x] **§5 Medición — GQM** — Cap. 26 §26.2
  - [x] Tipos de métricas de proceso
  - [x] Definición y estructura del paradigma GQM
  - [x] GQM #1 — Gestión del riesgo (completo)
  - [x] GQM #2 — Control de cambios (construido)
  - [x] GQM #3 — Seguimiento de hitos (construido)
  - [x] GQM #4 — Calidad de estimaciones (construido)
- [x] **§6 Mejora del Proceso** — Cap. 26 §26.1, §26.4
  - [x] Definición formal
  - [x] Ciclo cíclico: Medición → Análisis → Cambio
  - [x] Enfoque madurez vs. ágil (tabla comparativa)
  - [x] Relación causal proceso → calidad del producto
  - [x] Barreras y cómo superarlas (tabla)
- [x] **§7 CMM/CMMI** — Cap. 26 §26.5
  - [x] Origen: CMM → CMMI
  - [x] 22 áreas de proceso (tabla por grupo)
  - [x] Nivel 1 — Inicial (características y riesgos)
  - [x] Nivel 2 — Gestionado (7 áreas de proceso + prácticas institucionales)
  - [x] Nivel 3 — Definido (características y prácticas clave)
  - [x] Nivel 4 — Gestionado Cuantitativamente (características y métricas)
  - [x] Nivel 5 — Optimizado (características y mejora continua)
  - [x] Escala de 6 puntos del modelo continuo
  - [x] Por qué el nivel CMM importa al cliente
  - [x] Áreas de proceso clave niveles 2 y 3 (tablas completas)
- [x] **§8 Mejora de Procesos Ágiles** — Cap. 26 §26.3
  - [x] Retrospectiva como mecanismo de mejora
  - [x] Preguntas de la retrospectiva aplicadas al sistema
  - [x] Comparación formal vs. ágil (tabla)
  - [x] Métricas ágiles de proceso
- [x] **§9 Estándar de Calidad del Proceso** — 3 niveles
  - [x] Nivel Básico — Gestión Documentada
  - [x] Nivel Estándar — Gestión Controlada
  - [x] Nivel Avanzado — Gestión Medida
- [x] **§10 KPIs de Calidad del Proceso** — tabla de 8 KPIs con fórmulas
- [x] **§11 Cierre del Módulo 2** — tabla completa de conexiones M2-01 a M2-05
- [x] **§12 Checklist de Completitud** — este documento

### Fuentes utilizadas

- [x] Cap. 24 §24.2 — Planes de calidad (pp. 653–654)
- [x] Cap. 24 §24.3 — Revisiones e inspecciones (pp. 663–664)
- [x] Cap. 26 §26.1 — El proceso de mejora de procesos (pp. 708–711)
- [x] Cap. 26 §26.2 — Medición del proceso, GQM (pp. 711–714)
- [x] Cap. 26 §26.3 — Análisis del proceso (pp. 715–716)
- [x] Cap. 26 §26.4 — Cambios en los procesos (pp. 719–721)
- [x] Cap. 26 §26.5 — El marco CMMI (pp. 722–728)
- [x] Cap. 23 §23.2 — Plan de proyecto como referencia (pp. 623–624)

---

*Fin del documento M2-05 — Cierre del Módulo 2.*
*Sommerville, I. Ingeniería de Software, 9ª ed., Pearson, 2011.*
