# M3-06 — Calidad y KPIs del SRS

---

## 1. Metadatos

| Campo | Valor |
|---|---|
| **Archivo** | `M3-06-calidad-kpis-srs.md` |
| **Módulo** | Módulo 3 — Documentación de Alcance (SRS) |
| **Posición** | Archivo 6 de 6 del Módulo 3 — Último archivo del sistema |
| **Capítulos fuente** | Cap. 4 §4.1–§4.7 · Cap. 24 §24.1, §24.3, §24.4 · Cap. 26 §26.1 |
| **Complementa** | M1-07 (calidad entidades) · M2-05 (calidad proceso) |
| **Versión** | 1.0 |
| **Fecha** | 2026-02-25 |
| **Estado** | ✅ Completo |

---

## 2. Objetivo del Documento

Este archivo cierra el Módulo 3 y el sistema completo **austranet-cco**. Cubre dos dimensiones complementarias de calidad que el sistema debe medir y gestionar para garantizar que el SRS aprobado sea un documento confiable y que el proceso que lo produjo sea eficiente y repetible.

### Dimensión 1 — Calidad del producto (el SRS)

¿El SRS producido es completo, consistente, verificable y trazable? ¿Cumple el estándar mínimo para guiar el desarrollo correctamente? Un SRS deficiente produce software deficiente: Sommerville señala que "los errores en un documento de requerimientos pueden conducir a grandes costos por tener que rehacer, cuando dichos problemas se descubren durante el desarrollo del sistema o después de que éste se halla en servicio" (Cap. 4 §4.6, p. 110).

### Dimensión 2 — Calidad del proceso de IR

¿El proceso que produjo el SRS siguió las técnicas y etapas correctas? ¿Fue eficiente? ¿Puede mejorar? Sommerville establece que "la suposición subyacente en la gestión de calidad del software es que la calidad del software se relaciona directamente con la calidad del proceso de desarrollo" (Cap. 24 §24.1, p. 657).

### El ciclo de retroalimentación del sistema

Este archivo también cierra el ciclo de retroalimentación del sistema completo. El SRS aprobado no es el fin del proceso sino el inicio del siguiente:


SRS aprobado
↓
Lecciones aprendidas del proceso IR
↓
Mejora del proceso de IR en el siguiente proyecto
↓
Mejor SRS → menos ciclos → más valor al cliente
text

El sistema **austranet-cco** no es un gestor de documentos estático: es un sistema de aprendizaje organizacional donde cada proyecto completado hace más predecible y eficiente al siguiente (Cap. 26 §26.1).

---

## 3. Atributos de Calidad del SRS

> **Fuente principal:** Sommerville, Cap. 4 §4.3 (especificación), §4.6 (validación) y Cap. 24 §24.1.
> Los atributos de calidad enumerados aquí son el **vocabulario oficial del sistema** para evaluar un SRS. Toda evaluación de calidad en austranet-cco usa esta terminología.

Sommerville establece: "De manera ideal, los requerimientos del usuario y del sistema deben ser **claros, sin ambigüedades, fáciles de entender, completos y consistentes**. Esto en la práctica es difícil de lograr, pues los participantes interpretan los requerimientos de formas diferentes y con frecuencia en los requerimientos hay conflictos e inconsistencias inherentes." (Cap. 4 §4.3, p. 94)

---

### 3.1 Atributo 1 — Corrección

**Definición (libro):** Un requerimiento es correcto cuando describe con exactitud una función, restricción o comportamiento que el sistema realmente debe tener, según la necesidad del negocio expresada por los stakeholders. Un SRS tiene comprobaciones de validez cuando "un usuario quizá crea que necesita un sistema para realizar ciertas funciones. Sin embargo, con mayor consideración y análisis se logra identificar las funciones adicionales o diferentes que se requieran." (Cap. 4 §4.6, p. 110)

**Cómo verificarla:**
- Revisión formal por stakeholders de influencia alta (Ver M3-05, Sección 4)
- Generación de casos de prueba por cada RF (Ver M3-05, Sección 6.3)
- Comprobación de validez: ¿cada RF corresponde a una necesidad real expresada por un stakeholder identificado?

**Consecuencias de no cumplirla:**
"La razón es que un cambio a los requerimientos significa generalmente que también deben cambiar el diseño y la implementación del sistema. Más aún, el sistema debe entonces ponerse a prueba de nuevo." (Cap. 4 §4.6, p. 110) En términos económicos: un defecto de corrección detectado en desarrollo cuesta 5–10× más que uno detectado en validación del SRS.

**Aplicación en el sistema:** En austranet-cco, cada `Requerimiento` tiene el campo `fuente` que vincula al ID del stakeholder (M1). Un RF sin fuente no puede verificarse como correcto. La corrección se certifica cuando el stakeholder fuente aprueba el RF en la revisión formal.

---

### 3.2 Atributo 2 — Completitud

**Definición (libro):** "Totalidad significa que deben definirse todos los servicios requeridos por el usuario." (Cap. 4 §4.1, p. 86–87) "En principio, la especificación de los requerimientos funcionales de un sistema debe ser completa y consistente." (Cap. 4 §4.1, p. 86)

**Por qué la completitud perfecta es imposible:**
"Para sistemas complejos grandes, es casi imposible lograr la consistencia y la totalidad de los requerimientos. Una causa para ello es la facilidad con que se cometen errores y omisiones al escribir especificaciones para sistemas complejos. Otra es que hay muchos participantes en un sistema grande." (Cap. 4 §4.1, p. 87)

**Nivel mínimo aceptable:** En austranet-cco se define como aceptable el siguiente umbral:
- 100% de actores del diagrama de contexto con ≥1 RF asociado
- 100% de RF Must Have con `criterioAceptacion` definido en formato DADO/CUANDO/ENTONCES
- Al menos 2 RNF por cada subsistema principal identificado
- Comprobación de totalidad en validación: "el documento de requerimientos debe incluir requerimientos que definan todas las funciones y las restricciones pretendidas por el usuario del sistema." (Cap. 4 §4.6, p. 110)

**Aplicación en el sistema:** El KPI `Cobertura de actores` (Sección 5.1) mide esta dimensión directamente. Un SRS con actores sin RF es incompleto por definición y no puede superar el Nivel Mínimo (Sección 7).

---

### 3.3 Atributo 3 — Consistencia

**Definición (libro):** "Consistencia quiere decir que los requerimientos tienen que evitar definiciones contradictorias." (Cap. 4 §4.1, p. 86) Las comprobaciones de consistencia verifican que "los requerimientos en el documento no deben estar en conflicto. Esto es, no debe haber restricciones contradictorias o descripciones diferentes de la misma función del sistema." (Cap. 4 §4.6, p. 110)

**Tipos de inconsistencias:**

| Tipo | Descripción | Ejemplo |
|---|---|---|
| **Terminológica** | El mismo concepto recibe nombres distintos en diferentes RF | RF-001 usa "usuario" y RF-007 usa "cliente" para el mismo actor |
| **Temporal** | Dos RF definen secuencias de eventos incompatibles | RF-010 dice que A ocurre antes que B; RF-025 dice que B ocurre antes que A |
| **Comportamiento** | Dos RF definen respuestas contradictorias al mismo evento | RF-015 dice que el sistema acepta X; RF-031 dice que el sistema rechaza X |

**Cómo detectarlas:**
- Revisión cruzada con matriz de trazabilidad (Ver M3-04, Sección 6)
- Uso del glosario de dominio de M1 para homologar terminología
- Inspección formal con lista de verificación (Ver M3-05, Sección 4.2)

**Aplicación en el sistema:** El glosario del Módulo 1 (`EntradaGlosario`) es el árbitro terminológico. Todo conflicto terminológico en el SRS se resuelve consultando M1 primero.

---

### 3.4 Atributo 4 — No Ambigüedad

**Definición (libro):** "Es natural que un desarrollador de sistemas interprete un requerimiento ambiguo de forma que simplifique su implementación. Sin embargo, con frecuencia, esto no es lo que desea el cliente. Tienen que establecerse nuevos requerimientos y efectuar cambios al sistema. Desde luego, esto aplaza la entrega del sistema y aumenta los costos." (Cap. 4 §4.1, p. 86)

**Tipos de ambigüedad lingüística:**

| Tipo | Descripción | Palabras de alerta |
|---|---|---|
| **Cuantitativa indefinida** | Magnitud sin métrica objetiva | rápido, eficiente, simple, fácil, robusto |
| **Alcance indefinido** | Límite del comportamiento no especificado | adecuado, apropiado, suficiente, si es necesario |
| **Frecuencia indefinida** | Periodicidad no cuantificada | usualmente, normalmente, frecuentemente, a veces |
| **Responsabilidad difusa** | Actor o sistema no especificado | el sistema debería, se podría, podría |

**Relación con las reglas de escritura:** Las palabras prohibidas y el uso de SHALL/SHOULD/MAY están documentados en M3-04, Sección 4.1. Este atributo es el fundamento de esas reglas.

**Aplicación en el sistema:** El campo `descripcion` de cada `Requerimiento` debe pasar un filtro de palabras de alerta antes de ser marcado como `aprobado`. El KPI `RF sin ambigüedad` (Sección 5.1) mide el porcentaje de RF que superan esta comprobación.

---

### 3.5 Atributo 5 — Verificabilidad

**Definición (libro):** "Para reducir el potencial de disputas entre cliente y contratista, los requerimientos del sistema deben escribirse siempre de manera que sean verificables. Esto significa que usted debe ser capaz de escribir un conjunto de pruebas que demuestren que el sistema entregado cumpla cada requerimiento especificado." (Cap. 4 §4.6, p. 110–111)

Además: "Los requerimientos deben ser comprobables. Si las pruebas para los requerimientos se diseñan como parte del proceso de validación, esto revela con frecuencia problemas en los requerimientos. Si una prueba es difícil o imposible de diseñar, esto generalmente significa que los requerimientos serán difíciles de implementar, por lo que deberían reconsiderarse." (Cap. 4 §4.6, p. 111)

**Relación con criterios de aceptación:**
El campo `criterioAceptacion` en formato DADO/CUANDO/ENTONCES (Ver M3-01, Sección 9) es la implementación directa de este atributo. Un RF sin este campo es no verificable por definición.

**Aplicación en el sistema:** La verificabilidad es condición necesaria para que un RF pase de `propuesto` a `aprobado`. Todo RF Must Have sin `criterioAceptacion` bloquea la transición del SRS a `aprobado`.

---

### 3.6 Atributo 6 — Trazabilidad

**Definición (libro):** "Es necesario seguir la huella de las relaciones entre requerimientos, sus fuentes y el diseño del sistema, de modo que usted pueda analizar las razones para los cambios propuestos, así como el efecto que dichos cambios tengan probablemente sobre otras partes del sistema." (Cap. 4 §4.7, p. 114)

**Dos direcciones de trazabilidad:**

| Dirección | Pregunta que responde | Implementación en el sistema |
|---|---|---|
| **Hacia atrás** (backward) | ¿De qué necesidad del negocio / stakeholder proviene este RF? | Campo `fuente` del `Requerimiento` → ID del Stakeholder en M1 |
| **Hacia adelante** (forward) | ¿Qué componentes / módulos implementan este RF? | Matriz de trazabilidad de M3-04, Sección 6 → vincula RF con módulos |

**Relación con la matriz de trazabilidad:**
La construcción de esta matriz está documentada en M3-04, Sección 6. Este atributo establece **por qué** esa matriz es obligatoria, no opcional.

**Aplicación en el sistema:** El campo `fuente` es obligatorio en el tipo `Requerimiento`. Sin él, el RF no tiene trazabilidad hacia atrás y no puede justificarse ante el cliente ni ante el equipo de desarrollo.

---

### 3.7 Atributo 7 — Modificabilidad

**Definición (libro):** "Hay que organizar el documento de requerimientos de forma que sea posible realizar cambios sin reescritura o reorganización extensos. Conforme a los programas, la variabilidad en los documentos se logra al minimizar las referencias externas y al hacer las secciones del documento tan modulares como sea posible. De esta manera, secciones individuales pueden modificarse y sustituirse sin afectar otras partes del documento." (Cap. 4 §4.7, p. 114)

**Cómo estructurar el SRS para modificabilidad:**
- Cada RF en registro independiente con ID único (`codigo`: RF-001, RNF-001, RD-001)
- No duplicar información: referencias cruzadas por ID, no por copiar texto
- Secciones modulares: un cambio en RF-015 no obliga a reescribir RF-016
- Versionado granular: `version: number` en cada `Requerimiento` permite rastrear qué cambió

**Relación con el versionado:** Las reglas v0.X/v1.0/v1.X/v2.0 documentadas en M3-04, Sección 7 son la implementación operativa de este atributo.

**Aplicación en el sistema:** El KPI `Estabilidad post-aprobación` (Sección 5.1) es el indicador inverso de este atributo: mide cuántos RF del v1.0 resistieron sin cambios. Un índice bajo indica problemas de modificabilidad o de calidad original.

---

### 3.8 Atributo 8 — Comprensibilidad

**Definición:** Un SRS es comprensible cuando todos sus lectores legítimos pueden entender lo que describe sin necesidad de asistencia externa. Sommerville establece que "el documento de requerimientos tiene un conjunto variado de usuarios, desde el administrador ejecutivo de la organización que paga por el sistema, hasta los ingenieros responsables del desarrollo del software." (Cap. 4 §4.2, p. 91)

**Nivel de tecnicismo aceptable por sección:**

| Sección del SRS | Audiencia primaria | Nivel técnico |
|---|---|---|
| Introducción / Propósito | Directivos, cliente | No técnico |
| Definición de requerimientos del usuario | Stakeholders, cliente | Lenguaje natural + diagramas intuitivos |
| Especificación de requerimientos del sistema | Ingenieros, QA | Técnico con notación estructurada |
| Modelos del sistema | Ingenieros, arquitectos | UML, diagramas formales |
| Glosario | Todos | Definiciones en lenguaje natural |

**Relación con el glosario de M1:** "Debe definir los términos técnicos usados en el documento. No debe hacer conjeturas sobre la experiencia o la habilidad del lector." (Cap. 4 §4.2, Fig. 4.7, p. 92–93) El glosario de dominio de M1 (`EntradaGlosario`) es la fuente primaria de términos para el SRS.

**Aplicación en el sistema:** La comprensibilidad se verifica con el KPI de participación del cliente en la revisión formal: si un stakeholder de influencia alta no puede entender el SRS sin ayuda, el documento falla este atributo independientemente del nivel técnico del equipo.

---

### Tabla de Evaluación de Atributos de Calidad

| Atributo | Peso en calidad | Cómo medirlo en el sistema | Umbral mínimo |
|---|---|---|---|
| **Corrección** | 🔴 Crítico | Defectos de validez encontrados en revisión formal | 0 defectos críticos abiertos |
| **Completitud** | 🔴 Crítico | % actores con ≥1 RF / % RF Must Have con criterio | 100% en ambas métricas |
| **Consistencia** | 🟠 Alto | Conflictos entre RF no resueltos al cierre de validación | 0 conflictos abiertos |
| **No ambigüedad** | 🟠 Alto | RF con palabras de alerta detectadas | 0 palabras prohibidas en RF Must Have |
| **Verificabilidad** | 🟠 Alto | % RF Must Have con `criterioAceptacion` en DADO/CUANDO/ENTONCES | 100% |
| **Trazabilidad** | 🟡 Medio | % RF con campo `fuente` vinculado a stakeholder | 100% |
| **Modificabilidad** | 🟡 Medio | Tiempo promedio para incorporar un cambio de alcance | < 2 días hábiles |
| **Comprensibilidad** | 🟡 Medio | % stakeholders que entienden el SRS sin asistencia en revisión | > 80% |

---

## 4. Métricas del SRS como Producto

> **Fuente:** Sommerville, Cap. 24 §24.4 (Medición y métricas del software).
> Este capítulo extiende lo ya cubierto en M1-07 §6 (métricas generales de calidad). El foco aquí es exclusivamente el SRS como artefacto medible.

Sommerville establece el principio fundamental: "La medición del software puede usarse para recopilar datos cuantitativos tanto del software como del proceso de software. Se usan los valores de las métricas de software recopilados para hacer inferencias referentes a la calidad del producto y el proceso." (Cap. 24 §24.4, p. 677)

El paradigma **GQM** (Goal-Question-Metric) de Basili (1988) es "un enfoque adecuado cuando se decide cuáles datos hay que recopilar" (Cap. 24 §24.4, p. 675). Toda métrica del SRS en austranet-cco tiene una meta y preguntas que la justifican.

---

### 4.1 Métricas de Tamaño del SRS

#### Número total de requerimientos

**Significado:** El tamaño del SRS es un indicador de la complejidad del alcance del proyecto. Un SRS muy pequeño puede indicar alcance insuficientemente analizado; uno excesivamente grande puede indicar sobreespecificación o mezcla de nivel de análisis con nivel de diseño.

| Rango | Interpretación | Acción recomendada |
|---|---|---|
| < 5 RF Must Have | SRS incompleto — alcance insuficiente | Revisar sesiones de adquisición |
| 5–15 RF | Proyecto pequeño bien acotado | Normal |
| 16–50 RF | Proyecto mediano | Verificar consistencia y trazabilidad |
| 51–100 RF | Proyecto grande | Dividir en subsistemas o sprints |
| > 100 RF | Posible sobreespecificación | Revisar nivel de granularidad — posible mezcla de RF con sub-RF |

#### Distribución por tipo

| Proporción | Interpretación |
|---|---|
| RF >> RNF (< 10% RNF) | SRS con calidad no funcional insuficiente — riesgos técnicos no documentados |
| RF ≈ RNF (20–40% RNF) | Distribución saludable para sistemas de información |
| RNF >> RF (> 50% RNF) | Sistema de infraestructura / plataforma — verificar que el alcance funcional esté completo |
| RD presentes | Sistema de dominio especializado — verificar que el glosario de M1 cubra los términos |

#### Distribución MoSCoW: señales de desequilibrio

La distribución MoSCoW equilibrada (40–65% Must) está documentada en M3-01, Sección 8. Las señales de desequilibrio **no** cubiertas allí son:

- **Must Have > 80%:** El equipo está usando Must como categoría por defecto sin análisis de prioridad real. Resultado: sobrecarga de alcance y cronograma inviable.
- **Must Have < 30%:** El equipo está siendo excesivamente conservador o los RF fueron degradados por presión del cliente para reducir costo. Resultado: sistema que no cubre necesidades mínimas.
- **Won't Have = 0%:** No se documentaron exclusiones. Esto genera disputas post-aprobación sobre qué "quedó fuera". Un buen SRS siempre documenta lo que **no** incluye.
- **Could Have > 40%:** Exceso de funcionalidad especulativa. Señal de que el alcance no fue suficientemente negociado.

#### Densidad de RNF

**Proporción saludable:** ≥ 2 RNF por cada 10 RF funcionales.

**Por qué es importante:** "Los requerimientos no funcionales a menudo son más significativos que los requerimientos funcionales individuales. Es común que los usuarios del sistema encuentren formas para trabajar en torno a una función del sistema que realmente no cubre sus necesidades. No obstante, el fracaso para cubrir los requerimientos no funcionales haría que todo el sistema fuera inútil." (Cap. 4 §4.1.2, p. 87)

Una densidad de RNF < 1/10 indica que el proceso de adquisición se enfocó exclusivamente en funcionalidad y omitió atributos de calidad críticos (rendimiento, seguridad, disponibilidad).

---

### 4.2 Métricas de Calidad del SRS

#### Tasa de defectos del SRS


Tasa_defectos = (defectos_encontrados_en_validación / total_RF) × 100
text

**Interpretación:** Número de problemas (ambigüedad, inconsistencia, falta de verificabilidad, etc.) encontrados durante la validación por cada 100 RF. Una tasa > 20% indica que el proceso de especificación fue deficiente y la validación está actuando como corrector, en lugar de como verificador.

**Meta:** < 10% (< 1 defecto por cada 10 RF).

---

#### Tasa de requerimientos ambiguos


Tasa_ambiguos = (RF_que_requirieron_aclaración / total_RF) × 100
text

**Qué mide:** Porcentaje de RF que, durante la revisión formal o el desarrollo, generaron preguntas de aclaración porque su descripción no era suficientemente clara.

**Meta:** < 5%. Una tasa alta indica que las reglas de escritura (M3-04, Sección 4.1) no se aplicaron correctamente.

---

#### Índice de estabilidad del SRS


Estabilidad = (RF_sin_cambio_post_v1.0 / total_RF_v1.0) × 100
text

**Cuándo se mide:** Esta métrica se evalúa **30 y 60 días después de la aprobación del v1.0**, cuando el proyecto está en `activo_en_desarrollo`. Mide la calidad real del SRS: un SRS de alta calidad produce pocos cambios de alcance durante el desarrollo.

**Importancia estratégica:** "Los requerimientos voltiles tienen más probabilidad de cambio. Se asocian por lo general con actividades de apoyo que reflejan cómo la organización hace su trabajo más que el trabajo en sí." (Cap. 4 §4.7, p. 112) Un índice de estabilidad < 70% indica que el proceso de adquisición no capturó el dominio real del cliente.

**Meta:** > 85% a los 30 días post-aprobación.

---

#### Cobertura de criterios de aceptación


Cobertura_criterios = (RF_must_con_criterioAceptacion / total_RF_must) × 100
text

**Meta:** 100%. Este es un requisito no negociable para la aprobación del SRS en austranet-cco (Nivel Mínimo, Sección 7).

---

### 4.3 Métricas del Proceso de IR — Paradigma GQM

> **Fuente:** Sommerville, Cap. 24 §24.4, p. 675: "Deben formularse las preguntas que la medición busca responder, y definir las mediciones requeridas para responder a tales preguntas."

Estos GQMs son específicos para el proceso de IR del Módulo 3. No están cubiertos en M1-07 ni M2-05.

---

#### GQM #1 — Eficiencia de la Recopilación

| Componente | Contenido |
|---|---|
| **Goal** | Maximizar la cobertura de necesidades del cliente en la primera ronda de adquisición, minimizando el descubrimiento tardío de RF críticos |
| **Question 1** | ¿Cuántos RF Must Have se descubrieron después de la aprobación del v1.0? |
| **Question 2** | ¿Cuántas técnicas distintas de recopilación se aplicaron? |
| **Metric 1** | `RF_tardíos = count(RF Must Have agregados tras v1.0)` |
| **Metric 2** | `Técnicas_aplicadas = count(técnicas_documentadas_en_proceso_IR)` |
| **Interpretación** | RF_tardíos > 2 indica proceso de adquisición insuficiente. Técnicas_aplicadas = 1 es señal de riesgo (Ver M3-02). |

---

#### GQM #2 — Eficiencia del Proceso de Especificación

| Componente | Contenido |
|---|---|
| **Goal** | Reducir los ciclos de re-especificación: cada ciclo adicional consume tiempo, recursos y erosiona la confianza del cliente |
| **Question 1** | ¿Cuántas veces regresó el SRS al estado `en_especificacion` desde `con_observaciones`? |
| **Question 2** | ¿Cuánto tiempo tomó cada ciclo de corrección? |
| **Metric 1** | `Ciclos_respec = count(transiciones con_observaciones → en_especificacion)` |
| **Metric 2** | `Tiempo_ciclo_avg = avg(días entre transición con_obs → en_spec → siguiente validación)` |
| **Interpretación** | Ciclos_respec ≥ 3 activa alerta. Tiempo_ciclo > 7 días indica proceso de corrección ineficiente. |

---

#### GQM #3 — Calidad de los RF Producidos

| Componente | Contenido |
|---|---|
| **Goal** | Producir RF que no requieran aclaración durante el desarrollo y que no generen cambios de alcance no anticipados |
| **Question 1** | ¿Cuántos RF requirieron aclaración del analista después de la aprobación? |
| **Question 2** | ¿Cuántos RF aprobados generaron solicitudes de cambio formales en M2? |
| **Metric 1** | `RF_con_aclaración = count(RF con campo observaciones actualizado post-v1.0)` |
| **Metric 2** | `RF_que_generaron_cambio = count(RF que derivaron en SolicitudCambio en M2-04)` |
| **Interpretación** | RF_que_generaron_cambio / total_RF > 15% indica SRS con calidad insuficiente para guiar el desarrollo. |

---

#### GQM #4 — Participación del Cliente

| Componente | Contenido |
|---|---|
| **Goal** | Maximizar el involucramiento de los stakeholders de influencia alta en el proceso IR, que es la principal fuente de calidad del SRS |
| **Question 1** | ¿Qué porcentaje de stakeholders de influencia alta participaron activamente en al menos una revisión formal? |
| **Question 2** | ¿Cuántas sesiones de revisión formal se realizaron en el proceso IR? |
| **Metric 1** | `Participación_cliente` — ver cálculo en M3-05, Sección 10 |
| **Metric 2** | `Sesiones_revisión = count(revisiones_formales_registradas)` |
| **Interpretación** | Participación < 75% es el predictor más fuerte de inestabilidad post-aprobación. |

---

## 5. KPIs Operativos del Módulo 3

Todos los KPIs a continuación son calculables directamente con los campos de los tipos `SRS` y `Requerimiento` almacenados en Firestore. Ningún KPI depende de datos externos al sistema.

---

### 5.1 KPIs de Calidad del SRS (producto)

| KPI | Definición | Fórmula | Meta | Alerta |
|---|---|---|---|---|
| **Completitud de RF Must Have** | % de RF Must Have con criterio de aceptación definido | `(count(req donde prioridad='must' AND criterioAceptacion!=null) / count(req donde prioridad='must')) × 100` | 100% | < 90% |
| **Cobertura de actores** | % de actores del diagrama de contexto con ≥1 RF asociado | `(actores_con_RF / total_actores_contexto) × 100` | 100% | < 80% |
| **Densidad de RNF** | RNF por cada 10 RF funcionales | `(count(req donde tipo='no_funcional') / count(req donde tipo='funcional')) × 10` | ≥ 2 RNF/10 RF | < 1 RNF/10 RF |
| **Trazabilidad completa** | % de RF con stakeholder fuente vinculado | `(count(req donde fuente!=null) / count(req)) × 100` | 100% | < 85% |
| **RF sin ambigüedad** | % de RF sin palabras de alerta en descripción | `(count(req sin palabras_prohibidas) / count(req)) × 100` | 100% | < 90% |
| **Distribución MoSCoW** | % de RF Must Have sobre total de RF | `(count(req donde prioridad='must') / count(req)) × 100` | 50–65% | > 80% o < 40% |
| **Estabilidad post-aprobación** | % RF que no cambiaron tras v1.0 (medido a 30 días) | `(count(req con version=1 sin cambios) / count(req_v1.0)) × 100` | > 85% | < 70% |

---

### 5.2 KPIs de Calidad del Proceso de IR

| KPI | Definición | Fórmula | Meta | Alerta |
|---|---|---|---|---|
| **Técnicas aplicadas** | Técnicas distintas documentadas en la fase de adquisición | `count(técnicas_documentadas_en_srs.proceso_ir)` | ≥ 2 | = 1 |
| **Ciclos de revisión** | Veces que el SRS regresó a `en_especificacion` | `count(transiciones con_observaciones → en_especificacion en historial_estados)` | 1 | ≥ 3 |
| **Tasa de defectos IR** | Defectos encontrados en validación por cada 10 RF | `(defectos_encontrados_en_validación / count(req)) × 10` | < 2/10 RF | > 5/10 RF |
| **Participación cliente** | % stakeholders influencia alta en revisión formal | Ver M3-05 §10 | 100% | < 75% |
| **Tiempo total del proceso IR** | Días calendario desde `en_adquisicion` hasta `aprobado` | `srs.fechaAprobacion - fecha_inicio_adquisicion` | Según tipo (Sección 6) | Ver tabla §6 |
| **Cobertura de modelos** | % de tipos de modelo requeridos que se construyeron | `(modelos_construidos / modelos_requeridos_según_tipo) × 100` | 100% | < 80% |

---

## 6. Tiempos Esperados del Proceso IR por Tipo de Proyecto

> **Base:** Principios de estimación de M2-02 aplicados al proceso IR.
> Estos rangos son **referencias normativas**, no SLAs. Cada proyecto puede ajustarlos según los factores de la tabla inferior.

| Fase / Estado SRS | Proyecto pequeño (< 20 RF) | Proyecto mediano (20–50 RF) | Proyecto grande (> 50 RF) |
|---|---|---|---|
| `en_adquisicion` | 3–5 días | 1–2 semanas | 2–4 semanas |
| `en_prototipado` (si aplica) | 3–5 días | 1–2 semanas | 2–3 semanas |
| `en_modelado` | 2–3 días | 3–5 días | 1–2 semanas |
| `en_especificacion` | 3–5 días | 1–2 semanas | 2–4 semanas |
| `en_validacion` | 3–5 días | 5–7 días | 1–2 semanas |
| **Total proceso IR** | **2–3 semanas** | **4–7 semanas** | **8–14 semanas** |

### Factores que modifican estos tiempos

| Factor | Efecto | Fases afectadas |
|---|---|---|
| `nivelRiesgo` = `alto` o `critico` en Entidad cliente | **+30–50%** en todas las fases | Todas — mayor rigor requerido en especificación y validación |
| Metodología ágil | **−40%** en `en_especificacion` pero **+N ciclos** | Reduce especificación monolítica, requiere múltiples iteraciones incrementales |
| Proyecto de migración de sistema existente | **×2** en `en_adquisicion` | Requiere inventario exhaustivo del sistema origen antes de especificar el nuevo |
| Proyecto de integración con sistemas externos | **×3** en `en_modelado` | Cada interfaz externa requiere modelado de protocolo, formato de datos y gestión de errores |
| Cliente con baja disponibilidad histórica (ver M1) | **+1–2 semanas** en `en_validacion` | La validación depende de la participación del cliente — ver historial de la Entidad en M1-06 |

---

## 7. Estándar de Calidad del SRS

> **Fundamento:** Sommerville, Cap. 24 §24.2: "Los estándares proporcionan un marco para definir, en un escenario particular, lo que significa el término calidad." (p. 658)

El sistema define tres niveles de calidad para un SRS, análogos a los niveles de completitud del perfil de Entidad definidos en M1-07, Sección 9. Un SRS debe alcanzar al menos el **Nivel Mínimo** para ser aprobado (transición a estado `aprobado`).

---

### Nivel Mínimo — SRS Aceptable

> Condición necesaria para la aprobación. El proyecto **no puede pasar a `activo_en_desarrollo`** sin cumplir todos estos ítems.

- [ ] Estructura completa del SRS con las 8 secciones documentadas (Ver M3-04, Sección 5)
- [ ] Al menos 5 RF Must Have especificados y en estado `aprobado`
- [ ] Al menos 2 RNF especificados (rendimiento, seguridad o disponibilidad)
- [ ] Diagrama de contexto adjunto o referenciado en el SRS
- [ ] **100%** de RF Must Have con `criterioAceptacion` en formato DADO/CUANDO/ENTONCES
- [ ] **0 defectos críticos** abiertos al cierre del proceso de validación
- [ ] Al menos **1 stakeholder de influencia alta** participó y firmó la revisión formal
- [ ] Todos los RF con campo `fuente` vinculado a un stakeholder existente en M1

---

### Nivel Estándar — SRS de Calidad Profesional

> Excelencia operativa. Es el nivel esperado para proyectos comerciales regulares.

- [ ] Todo lo del Nivel Mínimo ✓
- [ ] Cobertura de actores al 100% (todos los actores con ≥1 RF)
- [ ] Trazabilidad completa: 100% de RF con campo `fuente`
- [ ] Distribución MoSCoW equilibrada: Must Have en rango 40–65%
- [ ] 0 palabras ambiguas en RF Must Have (verificado contra lista de palabras prohibidas)
- [ ] Diagrama de casos de uso adjunto o referenciado
- [ ] Matriz de trazabilidad RF → stakeholder completada (Ver M3-04, Sección 6)
- [ ] Tiempo total en estado `en_validacion` < 15 días
- [ ] Densidad de RNF ≥ 1 por cada 10 RF

---

### Nivel Completo — SRS de Excelencia

> Máxima calidad. Indicado para proyectos de alta criticidad o clientes estratégicos.

- [ ] Todo lo del Nivel Estándar ✓
- [ ] Densidad de RNF ≥ **2** por cada 10 RF
- [ ] Todos los modelos requeridos según tipo y criticidad del proyecto construidos y revisados con el cliente (Ver M3-03)
- [ ] **0 ciclos de re-especificación**: el SRS fue aprobado en la primera ronda de validación
- [ ] Índice de estabilidad > 85% a los **30 días post-aprobación** (medido retrospectivamente)
- [ ] GQMs documentados para el proceso IR de este proyecto específico (con datos reales)
- [ ] Lecciones aprendidas registradas formalmente (Ver Sección 8.1)
- [ ] Won't Have documentados: exclusiones de alcance explícitamente registradas

---

## 8. Cierre del Sistema: Retroalimentación M3 → M1 + M2

> **Fundamento:** Sommerville, Cap. 26 §26.1 (mejora del proceso): "La razón para invertir en la mejora del proceso es mejorar la calidad del software, reducir costos o acelerar los procesos de desarrollo." (Cap. 26 §26.1)

Este mecanismo es el que diferencia a **austranet-cco** de un simple gestor de documentos. El sistema es **cíclico**: cada SRS aprobado retroalimenta el conocimiento organizacional y hace el siguiente proyecto más predecible.

---

### 8.1 Lecciones Aprendidas del Proceso IR

Al aprobar el SRS v1.0, el analista responsable registra las siguientes lecciones (campo `observaciones` del SRS o página vinculada):

1. **Técnicas de recopilación:** ¿Qué técnicas funcionaron mejor con este tipo de cliente? ¿Entrevistas estructuradas, talleres JAD, etnografía? ¿Por qué?
2. **RF difíciles de especificar:** ¿Qué tipos de RF requirieron más ciclos de refinamiento? ¿RF de integración? ¿RNF de rendimiento? ¿Por qué?
3. **Modelos más útiles:** ¿Qué diagramas generaron más valor en la validación con el cliente? ¿Casos de uso, prototipos, diagramas de actividad?
4. **Riesgos de requerimientos materializados:** ¿Qué riesgos identificados en M2-03 tipo "requerimientos" se materializaron? ¿Cómo se mitigaron?
5. **Mejoras para el próximo proyecto:** ¿Qué haría diferente el analista en el próximo proyecto con este cliente o con este tipo de dominio?

---

### 8.2 Retroalimentación al Módulo 1

La experiencia del proceso IR produce actualizaciones concretas a la Entidad cliente en M1:

| Evento en el proceso IR | Actualización en M1 |
|---|---|
| Cliente con **baja participación** en revisiones formales | Actualizar `disponibilidad` de stakeholders afectados en M1 · Posible escalada de `nivelRiesgo` de la Entidad |
| **Glosario insuficiente**: términos de dominio desconocidos durante el IR | Agregar términos descubiertos al glosario de dominio (M1-03) para el próximo proyecto |
| **Múltiples ciclos de re-especificación** por requerimientos inestables | Registrar en historial de la Entidad (M1-06) · Impacta KPI de estabilidad histórica de M1-07 |
| **Stakeholder que bloqueó el proceso** (no disponible, cambió de posición) | Actualizar perfil del stakeholder en M1-01 con nota de gestión |

---

### 8.3 Retroalimentación al Módulo 2

La experiencia del proceso IR produce actualizaciones al proyecto activo en M2:

| Evento en el proceso IR | Actualización en M2 |
|---|---|
| Defectos tipo **'realismo'** encontrados en validación | Registrar como nuevos riesgos técnicos en el registro de riesgos (M2-03) |
| **Tiempo real del IR** vs. tiempo estimado | Actualizar desviación de cronograma en M2-04 · Mejora estimaciones futuras en M2-02 |
| **RF Must Have que cambiaron** tras la aprobación del v1.0 | Procesar como cambios formales en M2-04, Sección 4 · No aplicar informalmente |
| **Estimación de costos refinada** ahora que el SRS define el alcance exacto | Actualizar estimación de M2-02, Sección 9 con datos del SRS v1.0 aprobado |
| **SRS aprobado** → hito "SRS aprobado" cerrado | Actualizar estado del proyecto a `activo_en_desarrollo` en M2 |

---

### 8.4 El Ciclo Completo del Sistema

El siguiente diagrama muestra el ciclo cerrado de **austranet-cco**. La flecha clave es la de retorno: el conocimiento generado en cada proyecto no se pierde sino que se incorpora al sistema.


┌─────────────────────────────────────────────────────────────┐
│ CICLO austranet-cco │
└─────────────────────────────────────────────────────────────┘
M1: Registrar Entidad
stakeholders + glosario + nivelRiesgo
│
▼
M2: Crear Proyecto
equipo + hitos + riesgos heredados de M1
│
▼
M3: Proceso IR
en_adquisicion → en_prototipado → en_modelado
→ en_especificacion → en_validacion → aprobado
│
▼
M2: Proyecto activo_en_desarrollo
seguimiento + control de hitos + presupuesto
│
▼
M2: Proyecto completado
lecciones aprendidas del proyecto
│
▼
M1: Entidad actualizada
nivelRiesgo revisado + historial actualizado
glosario enriquecido + estabilidad histórica
│
▼
M2: Nuevo proyecto con mejor estimación
riesgos conocidos + cronograma calibrado
│
▼
M3: Proceso IR más eficiente
técnicas optimizadas + glosario maduro
│
└──────────────────────────────────────────┐
│
(ciclo repite — cada vuelta mejora │
la predicibilidad del sistema) │
◄──────────────────────────────────────────┘
text

**Propiedad emergente del sistema:** La calidad no se logra en un proyecto individual sino acumulativamente. Un sistema austranet-cco maduro (con ≥5 proyectos completados) tiene datos históricos suficientes para predecir con precisión el tiempo del proceso IR, el número de ciclos de revisión, y la tasa de cambios post-aprobación para cada tipo de cliente y dominio.

---

## 9. Proceso de Auditoría del SRS Post-Aprobación

> **Fundamento:** Sommerville, Cap. 24 §24.3: "Las revisiones e inspecciones son actividades QA que comprueban la calidad de los entregables del proyecto." (p. 663)

Una vez aprobado el SRS v1.0 y el proyecto en estado `activo_en_desarrollo`, el SRS no queda archivado. Es un documento **vivo** que debe auditarse periódicamente para garantizar que sigue siendo la guía válida del desarrollo.

### Propósito

Verificar que el SRS aprobado:
- Sigue siendo válido como guía del desarrollo (el alcance no cambió informalmente)
- Está siendo implementado según lo especificado (los RF aprobados coinciden con lo que se está construyendo)
- Los cambios ocurridos se formalizaron correctamente (no hay RF "extraoficiales")

### Frecuencia según Criticidad del Proyecto

| Criticidad | Frecuencia de auditoría | Responsable |
|---|---|---|
| `baja` | 1 auditoría al cierre del proyecto | Gestor del proyecto |
| `media` | 1 auditoría por cada hito mayor cerrado | Gestor del proyecto |
| `alta` | Auditoría mensual | Gestor del proyecto + Analista |
| `critica` | Auditoría por sprint (cada 2 semanas) | Gestor del proyecto + Analista + QA |

### Qué se Verifica en la Auditoría

1. **Validez del alcance:** ¿Sigue siendo válido el alcance definido en el SRS v1.0? ¿Ocurrieron cambios en el negocio que invaliden RF aprobados?
2. **Coincidencia de implementación:** ¿Los RF en estado `implementado` coinciden con lo que el equipo de desarrollo realmente construyó?
3. **RF que requieren aclaración:** ¿Hay RF aprobados que el equipo de desarrollo necesita aclarar con el analista?
4. **Cambios informales pendientes de formalizar:** ¿El cliente ha solicitado cambios informales que deben formalizarse como versión v1.X o v2.0 mediante el proceso de M2-04, Sección 4?

### Producto de la Auditoría

Informe de Auditoría del SRS con los campos:

```typescript
InformeAuditoríaSRS {
  id: string
  srsId: string                    // referencia al SRS auditado
  proyectoId: string
  fecha: Date
  auditor: string                  // ID del gestor del proyecto
  participantes: string[]          // IDs del analista + QA
  hallazgos: {
    alcanceSigoVálido: boolean
    rfConDesviaciónImplementación: string[]   // códigos de RF
    rfQueRequierenAclaración: string[]         // códigos de RF
    cambiosInformalesPendientes: string[]      // descripción
  }
  accionesRequeridas: AcciónAuditoría[]
  proximaAuditoría: Date
}

AcciónAuditoría {
  tipo: 'formalizar_cambio' | 'actualizar_rf' | 'notificar_cliente' | 'escalar_riesgo'
  rfAfectados: string[]
  responsable: string
  fechaLímite: Date
  estado: 'pendiente' | 'completada'
}


10. Tabla Maestra de Cierre: Los 3 Módulos Integrados
Esta tabla es la síntesis del sistema completo austranet-cco. Cada fila representa una relación causa–efecto concreta y verificable entre KPIs de módulos distintos.
Módulo origen
KPI
Módulo impactado
Cómo impacta (concretamente)
M1
Completitud del perfil de Entidad
M2
La Entidad sólo puede asociarse a proyectos activos si el perfil está completo (KPI completitud ≥ umbral mínimo)
M1
nivelRiesgo de la Entidad
M2 + M3
Hereda riesgos al proyecto en M2-03 · Aumenta tiempo estimado del proceso IR en M3 (factor +30–50%, Sección 6)
M1
Estabilidad histórica de reqs. de la Entidad
M3
Predice cuántos ciclos de re-especificación tendrá el proceso IR: clientes con historial inestable → alertar en planificación del IR
M2
Avance de hito "SRS aprobado"
M3
Este hito específico es el disparador que transiciona el proyecto a activo_en_desarrollo — el SRS aprobado lo cierra
M2
Desviación de cronograma
M3
El retraso acumulado en el proceso IR impacta directamente el plan de hitos del proyecto en M2
M2
Riesgos de tipo "requerimientos"
M3
Los riesgos de requerimientos abiertos en M2-03 se cierran (mitigan) cuando el SRS es aprobado sin observaciones
M3
Ciclos de revisión del SRS (KPI)
M1 + M2
≥ 3 ciclos → actualizar historial de la Entidad en M1-06 · escalar nivelRiesgo · registrar riesgo de calidad en M2-03
M3
Tasa de defectos del SRS (KPI)
M2
Defectos críticos abiertos → bloquean la transición a activo_en_desarrollo en M2
M3
Estabilidad post-aprobación (KPI)
M2
RF que cambian post-v1.0 → se procesan como SolicitudCambio formal en M2-04 · impactan presupuesto y cronograma
M3
Participación del cliente en revisión (KPI)
M1
Baja participación → actualizar disponibilidad de stakeholders en M1 · posible escalada de nivelRiesgo


11. Checklist Final del Sistema Completo
Este checklist confirma que el framework teórico de austranet-cco está 100% documentado y listo para implementarse como sistema de software.
MÓDULO 1 — Registro de Entidades (Clientes y Proveedores)
M1-01: Identificación de stakeholders ✅
M1-02: Sistemas sociotécnicos ✅
M1-03: Glosario de dominio ✅
M1-04: Evaluación de factibilidad ✅
M1-05: Confiabilidad y seguridad ✅
M1-06: Control de configuración ✅
M1-07: Calidad y KPIs de entidades ✅
MÓDULO 2 — Registro de Proyectos
M2-01: Inicio y planificación ✅
M2-02: Estimación de costos ✅
M2-03: Registro de riesgos ✅
M2-04: Seguimiento y control ✅
M2-05: Calidad del proceso ✅
MÓDULO 3 — Documentación de Alcance (SRS)
M3-01: Ingeniería de requerimientos ✅
M3-02: Técnicas de recopilación ✅
M3-03: Modelado de requerimientos ✅
M3-04: Especificación del SRS ✅
M3-05: Validación de requerimientos ✅
M3-06: Calidad y KPIs del SRS ✅ ← este archivo
DOCUMENTOS BASE DEL SISTEMA
00-indice-general.md ✅
01-modelos-proceso-software.md ✅
02-metodologias-agiles.md ✅

TOTAL: 21 archivos de documentación. Sistema austranet-cco completamente documentado.

12. Checklist de Completitud del Archivo
Verificación de que todos los ítems requeridos en las instrucciones de construcción están cubiertos:
Secciones estructurales
Metadatos completos (nombre, módulo, capítulos, versión, fecha, estado)
Objetivo del documento con 2 dimensiones de calidad
Ciclo de retroalimentación del sistema explicado
Sección 3 — Atributos de Calidad del SRS
Atributo 1 — Corrección: definición del libro + verificación + consecuencias
Atributo 2 — Completitud: definición + imposibilidad en sistemas grandes + umbral
Atributo 3 — Consistencia: definición + 3 tipos de inconsistencias + detección
Atributo 4 — No ambigüedad: definición + 4 tipos de ambigüedad + relación M3-04
Atributo 5 — Verificabilidad: definición + relación DADO/CUANDO/ENTONCES
Atributo 6 — Trazabilidad: forward + backward + relación matriz M3-04
Atributo 7 — Modificabilidad: definición + estructuración + relación versionado
Atributo 8 — Comprensibilidad: audiencias + tecnicismo por sección + glosario M1
Tabla de evaluación de 8 atributos con peso, métrica y umbral
Sección 4 — Métricas del SRS
4.1 Métricas de tamaño: número total + distribución tipo + MoSCoW + densidad RNF
4.2 Métricas de calidad: tasa defectos + tasa ambiguos + índice estabilidad + cobertura criterios
4.3 GQM #1: Eficiencia de recopilación
4.3 GQM #2: Eficiencia de especificación
4.3 GQM #3: Calidad de RF producidos
4.3 GQM #4: Participación del cliente
Sección 5 — KPIs Operativos
5.1 Tabla de 7 KPIs de producto (fórmulas calculables con campos Firestore)
5.2 Tabla de 6 KPIs de proceso (fórmulas calculables con campos Firestore)
Sección 6 — Tiempos Esperados
Tabla de duraciones por fase y tamaño de proyecto
5 factores modificadores con efecto cuantificado
Sección 7 — Estándar de Calidad
Nivel Mínimo: 8 ítems de checklist
Nivel Estándar: 8 ítems adicionales
Nivel Completo: 7 ítems adicionales
Sección 8 — Retroalimentación
8.1 Lecciones aprendidas: 5 preguntas estructuradas
8.2 Retroalimentación a M1: tabla de 4 eventos → actualizaciones
8.3 Retroalimentación a M2: tabla de 5 eventos → actualizaciones
8.4 Diagrama del ciclo completo del sistema
Secciones de cierre
Sección 9 — Auditoría del SRS post-aprobación (proceso completo + tipo InformeAuditoríaSRS)
Sección 10 — Tabla Maestra de Cierre con 10 filas de relaciones inter-módulo
Sección 11 — Checklist Final del Sistema (21 archivos)
Sección 12 — Checklist de Completitud del Archivo (este documento)
Requisitos transversales
Citas de capítulo y sección en cada sección principal
Definiciones con texto original del libro (no parafraseo)
"Aplicación en el sistema" en cada atributo de la Sección 3
Fórmulas de KPIs calculables con campos del tipo SRS y Requerimiento
Sin repetición de contenido de M1-07 ni M2-05
Sin repetición de contenido de M3-01 a M3-05
Referencias cruzadas con "Ver M3-0X, Sección X" donde corresponde
Idioma: español con terminología de la traducción oficial Pearson

Fin del archivo M3-06-calidad-kpis-srs.md
Fin del Módulo 3 — Documentación de Alcance (SRS)
Fin del sistema austranet-cco — Framework teórico completo
