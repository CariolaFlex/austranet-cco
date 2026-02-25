# M1-03-glosario-dominio.md

---

## Metadatos

| Campo              | Valor                                                              |
|--------------------|--------------------------------------------------------------------|
| **Nombre archivo** | `M1-03-glosario-dominio.md`                                        |
| **Módulo**         | Módulo 1 — Registro de Clientes y Proveedores (Entidades)          |
| **Capítulos fuente** | Cap. 4 §4.1 (requerimientos de dominio), §4.2 (SRS y Glosario), §4.3 (lenguaje y ambigüedad), §4.5.2 (entrevistas), §4.5.5 (etnografía) |
| **Libro fuente**   | *Ingeniería de Software*, Ian Sommerville, 9.ª edición, Pearson 2011 |
| **Versión**        | 1.0.0                                                              |
| **Fecha**          | 2026-02-24                                                         |
| **Estado**         | ✅ Aprobado — listo para implementación                            |
| **Autor**          | Marco teórico extraído de Sommerville                              |

---

## 1. Objetivo del Documento

Este archivo establece el **marco teórico y operativo** para construir y mantener el **glosario de términos de dominio** de cada entidad registrada en el sistema.

### Por qué el glosario es un artefacto del Módulo 1 (y no del Módulo 3)

El error más frecuente en proyectos de software es intentar construir el glosario durante la redacción del SRS (Módulo 3). Para entonces ya es demasiado tarde: los requerimientos se habrán escrito con términos ambiguos que cada stakeholder interpreta de forma distinta.

La cadena correcta es:

```
Módulo 1 — Registro de la Entidad
    ↓
  Se captura el dominio de operación del cliente
  (construcción, salud, finanzas, etc.)
    ↓
  Se construye el GLOSARIO DE DOMINIO de esa entidad
    ↓
Módulo 2 — Registro del Proyecto
    ↓
  El proyecto hereda el glosario de su entidad
  (el glosario ya existe antes de iniciar el SRS)
    ↓
Módulo 3 — SRS
    ↓
  Cada término técnico en los requerimientos
  enlaza automáticamente a su definición del glosario
  → Requerimientos sin ambigüedad
```

**Regla fundamental:** Antes de crear cualquier proyecto para una entidad en el Módulo 2, el glosario de esa entidad debe existir y estar validado. El Módulo 3 no puede iniciarse si el glosario está vacío o sin validar.

---

## 2. El Documento de Requerimientos de Software y el Glosario

**Fuente:** Cap. 4 §4.2, p. 91–94 — *Ingeniería de Software*, Sommerville, 9.ª ed.

### 2.1 Definición del SRS

> «El documento de requerimientos de software (llamado algunas veces especificación de requerimientos de software o SRS) es un comunicado oficial de lo que deben implementar los desarrolladores del sistema. Incluye tanto los requerimientos del usuario para un sistema, como una especificación detallada de los requerimientos del sistema.»
> *(Cap. 4 §4.2, p. 91)*

### 2.2 El Glosario como sección obligatoria del SRS (Fig. 4.7)

Sommerville presenta la **estructura estándar IEEE** para documentos de requerimientos (Fig. 4.7, p. 93). La sección **Glosario** es una de sus secciones fundamentales:

| Sección del SRS (Fig. 4.7) | Descripción extraída del libro |
|---|---|
| **Prefacio** | Define el número esperado de lectores y la historia de versiones |
| **Introducción** | Describe la necesidad para el sistema y sus funciones |
| **Glosario** | «Define los términos técnicos usados en el documento. **No debe hacer conjeturas sobre la experiencia o la habilidad del lector.**» |
| **Definición de requerimientos del usuario** | Servicios que se ofrecen al usuario, en lenguaje comprensible para clientes |
| **Arquitectura del sistema** | Panorama de alto nivel de la arquitectura anticipada |
| **Especificación de requerimientos del sistema** | Requerimientos funcionales y no funcionales con detalle |
| **Modelos del sistema** | Modelos gráficos que muestran relaciones entre componentes |
| **Evolución del sistema** | Supuestos fundamentales y cambios anticipados |
| **Apéndices** | Información específica: hardware, bases de datos |
| **Índice** | Índice alfabético, de diagramas, de funciones |

*(Cap. 4 §4.2, Fig. 4.7, p. 93)*

### 2.3 Estándar IEEE que cita Sommerville

> «Algunas organizaciones grandes, como el Departamento de Defensa estadounidense y el Institute of Electrical and Electronic Engineers (IEEE), definieron estándares para los documentos de requerimientos. [...] El IEEE es uno de los proveedores de estándares mejor conocidos y desarrolló un estándar para la estructura de documentos de requerimientos.»
> *(Cap. 4 §4.2, p. 91)*

La figura 4.7 está «basada en un estándar del IEEE para documentos de requerimientos (IEEE, 1998)» *(p. 93)*. El Glosario es parte de ese estándar: no es opcional.

### 2.4 Tipos de términos que debe incluir el glosario

Derivado de §4.2 y §4.3, los términos del glosario se clasifican en tres categorías:

| Tipo de término | Descripción | Riesgo si se omite |
|---|---|---|
| **Términos técnicos del dominio** | Vocabulario especializado que el cliente usa en su industria | Malinterpretación del requerimiento por el analista |
| **Acrónimos** | Siglas específicas del dominio del cliente (ej: OC, HH.EE., BIM en construcción) | El desarrollador puede asumir un significado incorrecto |
| **Términos con significado distinto al común** | Palabras comunes que en el dominio del cliente tienen significado técnico específico | El ejemplo del MHC-PMS: «buscar» (ver §4 de este documento) |

*(Derivado de Cap. 4 §4.2 y §4.3, pp. 91–97)*

### 2.5 Consecuencias de no tener glosario

> «La inexactitud en la especificación de requerimientos causa muchos problemas en la ingeniería de software. Es natural que un desarrollador de sistemas interprete un requerimiento ambiguo de forma que simplifique su implementación. Sin embargo, con frecuencia, esto no es lo que desea el cliente. Tienen que establecerse nuevos requerimientos y efectuar cambios al sistema. Desde luego, esto aplaza la entrega del sistema y aumenta los costos.»
> *(Cap. 4 §4.3, p. 86)*

---

**Aplicación en el sistema:**
El glosario se construye durante el **Módulo 1**, como parte del perfil de la entidad, no durante el Módulo 3. Cuando se crea un proyecto para esa entidad en el Módulo 2, el glosario ya debe estar completo y validado. El Módulo 3 solo consume el glosario (enlazando términos a sus definiciones), pero nunca lo construye desde cero.

---

## 3. Requerimientos de Dominio

**Fuente:** Cap. 4 §4.1 (sección final), p. 86–87 — *Ingeniería de Software*, Sommerville, 9.ª ed.

### 3.1 Definición exacta según Sommerville

> «Los requerimientos de dominio se derivan del dominio de aplicación del sistema, más que a partir de las necesidades específicas de los usuarios del sistema. Pueden ser requerimientos funcionales nuevos por derecho propio, restricciones a los requerimientos funcionales existentes o formas en que deben realizarse cálculos particulares.»
> *(Cap. 4 §4.1, p. 86)*

**Distinción fundamental:**

| Tipo de requerimiento | De dónde se deriva | Ejemplo |
|---|---|---|
| **Funcional** | Necesidades específicas del usuario | «El sistema debe permitir registrar pagos» |
| **No funcional** | Restricciones de rendimiento, seguridad, disponibilidad | «El sistema debe estar disponible 99.9% del tiempo» |
| **De dominio** | Dominio de aplicación del cliente (industria, sector) | «Los presupuestos deben calcularse en UF según normativa MINVU» |

### 3.2 Por qué los ingenieros no entienden los requerimientos de dominio

> «El problema con los requerimientos de dominio es que los ingenieros de software no pueden entender las características del dominio en que opera el sistema. Por lo común, no pueden indicar si un requerimiento de dominio se perdió o entró en conflicto con otros requerimientos.»
> *(Cap. 4 §4.1, p. 87)*

### 3.3 Los dos problemas principales

Sommerville identifica dos problemas fundamentales con los requerimientos de dominio:

1. **Comprensibilidad:** Los especialistas del dominio usan terminología propia con precisión y sutileza. El analista sin experiencia en el dominio malinterpreta esos términos. Sommerville señala explícitamente en §4.5.2 (p. 104): «Todos los especialistas en la aplicación usan terminología y jerga que son específicos de un dominio. Es imposible que ellos discutan los requerimientos de dominio sin usar este tipo de lenguaje. Por lo general, usan la terminología en una forma precisa y sutil, que para los ingenieros de requerimientos es fácil de malinterpretar.»

2. **Completitud:** El conocimiento del dominio puede ser tan familiar para los especialistas que no lo mencionan porque lo consideran obvio. Sommerville ejemplifica con §4.5.2 (p. 104): «para un bibliotecario no es necesario decir que todas las adquisiciones deben catalogarse antes de agregarlas al acervo. Sin embargo, esto quizás no sea obvio para el entrevistador y, por lo tanto, es posible que no lo tome en cuenta en los requerimientos.»

### 3.4 Consecuencias de no entender el dominio

- Requerimientos de dominio **perdidos**: no se identifican porque el analista no sabe lo que no sabe.
- Requerimientos **malinterpretados**: se especifican, pero con el significado equivocado (ver ejemplo MHC-PMS en §4).
- Requerimientos **en conflicto**: el analista no puede detectar contradicciones entre requerimientos de dominio y funcionales porque no entiende el contexto de aplicación.

> «Por lo común, no pueden indicar si un requerimiento de dominio se perdió o entró en conflicto con otros requerimientos.»
> *(Cap. 4 §4.1, p. 87)*

---

**Aplicación en el sistema:**
Los requerimientos de dominio son los que con mayor frecuencia se omiten en el Módulo 3 porque el analista no conoce el dominio del cliente. Una empresa constructora tiene requerimientos de dominio derivados de la Ley de Urbanismo, del MINVU, de la normativa de cálculo estructural. Una empresa de salud tiene requerimientos derivados de la legislación sanitaria. El glosario construido en el Módulo 1 es la primera defensa contra esta omisión: documenta el vocabulario del dominio antes de que el analista inicie el SRS.

---

## 4. El Problema del Lenguaje y la Ambigüedad en la Especificación

**Fuente:** Cap. 4 §4.3, pp. 94–98 — *Ingeniería de Software*, Sommerville, 9.ª ed.

### 4.1 El problema central del lenguaje natural

> «La flexibilidad del lenguaje natural, que es tan útil para la especificación, causa problemas frecuentemente. Hay espacio para escribir requerimientos poco claros, y los lectores (los diseadores) pueden malinterpretar los requerimientos porque tienen un antecedente diferente al del usuario. Es fácil mezclar muchos requerimientos en una sola oración y quizás sea difícil estructurar los requerimientos en lenguaje natural.»
> *(Cap. 4 §4.3, p. 94 — nota al margen)*

Y en §4.3.1 (p. 96): «[El lenguaje natural] también es potencialmente vago, ambiguo y su significado depende de los antecedentes del lector.»

### 4.2 El caso de uso perfecto: el ejemplo del MHC-PMS

Este ejemplo, directamente del libro, es el argumento más persuasivo para justificar el glosario ante cualquier cliente.

**El requerimiento ambiguo:**

> «Un usuario podrá buscar en todas las clínicas las listas de citas.»
> *(Cap. 4 §4.3, p. 86)*

**El contexto del cliente (lo que el personal médico quería decir):**

> «El motivo para este requerimiento es que los pacientes con problemas de salud mental en ocasiones están confundidos. Quizás tengan una cita en una clínica y en realidad acudan a una diferente. De ahí que si tienen una cita, se registrará que asistieron, sin importar la clínica. Los miembros del personal médico que especifican esto quizás esperen que *buscar* significa que, dado el nombre de un paciente, el sistema busca dicho nombre en las citas de **todas** las clínicas.»
> *(Cap. 4 §4.3, p. 86)*

**Lo que el desarrollador interpretó (implementación incorrecta):**

> «Sin embargo, esto no es claro en el requerimiento. Los desarrolladores del sistema pueden interpretar el requerimiento de forma diferente e implementar una búsqueda, de tal modo que el usuario deba elegir una clínica y luego realizar la búsqueda. Evidentemente, esto implicará más entradas del usuario y tomará más tiempo.»
> *(Cap. 4 §4.3, p. 86)*

**Análisis del problema:**

| | Interpretación del cliente | Interpretación del desarrollador |
|---|---|---|
| **Término ambiguo** | «buscar» | «buscar» |
| **Significado asumido** | Búsqueda global automática en todas las clínicas | El usuario selecciona una clínica y luego busca |
| **Implementación resultante** | Una búsqueda centralizada sin selección previa | Dos pasos: seleccionar clínica → buscar |
| **Impacto operacional** | Cero fricción para el personal médico | Más pasos, más tiempo, pacientes no encontrados |
| **Consecuencia del error** | — | «Aplaza la entrega del sistema y aumenta los costos» (p. 86) |

**Si existiera un glosario, la entrada para «buscar» hubiera especificado:**

```
término: "buscar paciente"
definición: "Consulta de un paciente por nombre en los registros de citas
             de TODAS las clínicas de la red, sin preselección de clínica,
             para cubrir casos donde el paciente acude a una clínica distinta
             a la de su cita registrada."
advertencia: "NO confundir con búsqueda en una sola clínica.
              El término implica búsqueda global en toda la red."
fuente: "Personal médico de admisión, Clínica Central"
```

### 4.3 Lenguaje natural estructurado como solución parcial

Sommerville propone el lenguaje natural estructurado como alternativa para reducir ambigüedad:

> «El lenguaje natural estructurado es una manera de escribir requerimientos del sistema, donde está limitada la libertad del escritor de requerimientos y todos éstos se anotan en una forma estándar. Aunque este enfoque conserva la mayoría de la expresividad y comprensibilidad del lenguaje natural, asegura que haya cierta uniformidad sobre la especificación.»
> *(Cap. 4 §4.3.2, p. 97)*

La plantilla estructurada para cada requerimiento incluye los campos (Fig. 4.10, p. 97):

| Campo de la plantilla | Propósito |
|---|---|
| **Función** | Nombre de la función o entidad |
| **Descripción** | Qué hace exactamente |
| **Entradas** | Datos de entrada y su procedencia |
| **Fuente** | De dónde vienen las entradas |
| **Salidas** | Qué produce y a dónde va |
| **Destino** | Receptor de las salidas |
| **Acción** | Descripción del procesamiento |
| **Requerimientos** | Precondiciones para la ejecución |
| **Precondicción** | Lo que debe ser verdadero antes de ejecutar |
| **Postcondición** | Lo que es verdadero después de ejecutar |
| **Efectos colaterales** | Consecuencias adicionales |

*(Cap. 4 §4.3.2, Fig. 4.10, p. 97)*

**Límite del lenguaje estructurado:** Reduce pero no elimina la ambigüedad. Si el término «buscar» no está definido en el glosario, sigue siendo ambiguo aunque se use en una plantilla estructurada. El glosario y el lenguaje estructurado son complementarios, no sustitutos.

---

**Aplicación en el sistema:**
El ejemplo del MHC-PMS es el caso de uso perfecto para presentar el glosario ante clientes que no entienden para qué sirve. La secuencia «una sola palabra genera dos implementaciones completamente distintas» es comprensible para cualquier cliente, sin importar su dominio. Cuando un término del glosario aparece en un requerimiento del Módulo 3, el sistema debe poder **enlazarlo automáticamente** a su definición validada en el Módulo 1.

---

## 5. Etnografía como Técnica de Descubrimiento del Dominio

**Fuente:** Cap. 4 §4.5.5, pp. 108–109 — *Ingeniería de Software*, Sommerville, 9.ª ed.

### 5.1 Definición de etnografía aplicada a IS

> «La etnografía es una técnica de observación que se usa para entender los procesos operacionales y ayudar a derivar requerimientos de apoyo para dichos procesos. Un analista se adentra en el ambiente laboral donde se usará el sistema. Observa el trabajo diario y toma notas acerca de las tareas existentes en que intervienen los participantes.»
> *(Cap. 4 §4.5.5, p. 108)*

> «El valor de la etnografía es que ayuda a descubrir requerimientos implícitos del sistema que reflejan las formas actuales en que trabaja la gente, en vez de los procesos formales definidos por la organización.»
> *(Cap. 4 §4.5.5, p. 108)*

### 5.2 Los DOS tipos de requerimientos que solo revela la etnografía

Sommerville identifica explícitamente dos tipos:

**Tipo 1 — Requerimientos del trabajo real (no del trabajo documentado):**

> «Requerimientos que se derivan de la forma en que realmente trabaja la gente, en vez de la forma en la cual las definiciones del proceso indican que debería trabajar. Por ejemplo, los controladores de tráfico aéreo pueden desactivar un sistema de alerta de conflicto que detecte una aeronave con trayectoria de vuelo que se cruza, aun cuando los procedimientos de control normales especifiquen que es obligatorio usar tal sistema. Ellos deliberadamente dejan a la aeronave sobre la ruta de conflicto durante breves momentos, para ayudarse a dirigir el espacio aéreo.»
> *(Cap. 4 §4.5.5, p. 109)*

**Tipo 2 — Requerimientos de cooperación y conocimiento contextual:**

> «Requerimientos que se derivan de la cooperación y el conocimiento de las actividades de otras personas. Por ejemplo, los controladores de tráfico aéreo pueden usar el conocimiento del trabajo de otros controladores para predecir el número de aeronaves que entrarán a su sector de control. Entonces, modifican sus estrategias de control dependiendo de dicha carga de trabajo prevista. Por lo tanto, un sistema ATC automatizado debería permitir a los controladores en un sector tener cierta visibilidad del trabajo en sectores adyacentes.»
> *(Cap. 4 §4.5.5, p. 109)*

### 5.3 Por qué las entrevistas no bastan para capturar el dominio real

Sommerville lo explica en §4.5.2 (p. 104), al hablar de las limitaciones de las entrevistas:

> «Las personas con frecuencia encuentran muy difícil articular los detalles de su trabajo, porque es una segunda forma de vida para ellas. Entienden su trabajo, pero tal vez no su relación con otras funciones en la organización.»
> *(Cap. 4 §4.5.5, p. 108)*

> «Los factores sociales y organizacionales que afectan el trabajo, que no son evidentes para los individuos, sólo se vuelven claros cuando los percibe un observador sin prejuicios.»
> *(Cap. 4 §4.5.5, p. 108)*

Sommerville cita el trabajo de Suchman (1987) como evidencia empírica:
> «Ella descubrió que las prácticas reales del trabajo son más ricas, más complejas y más dinámicas que los modelos simples supuestos por los sistemas de automatización administrativa. La diferencia entre el trabajo supuesto y el real fue la razón más importante por la que dichos sistemas de oficina no tenían un efecto significativo sobre la productividad.»
> *(Cap. 4 §4.5.5, p. 108–109)*

### 5.4 Combinación: etnografía + prototipado (Fig. 4.16)

> «La etnografía puede combinarse con la creación de prototipos (figura 4.16). La etnografía informa del desarrollo del prototipo, de modo que se requieren menos ciclos de refinamiento del prototipo. Más aún, la creación de prototipos se enfoca en la etnografía al identificar problemas y preguntas que entonces pueden discutirse con el etnógrafo.»
> *(Cap. 4 §4.5.5, p. 109)*

El ciclo (Fig. 4.16) es:
```
Análisis etnográfico
    ↓
Reuniones de interrogatorio
    ↓
Etnografía enfocada  ←──────────────────┐
    ↓                                   │
Evaluación de prototipos                │
    ↓                                   │
Desarrollo del sistema genérico         │
    ↓                                   │
Prototipo del sistema  ─────────────────┘
                (el prototipo hace emerger
                 conocimiento tácito del dominio
                 que el cliente no sabe articular)
```

*(Cap. 4 §4.5.5, Fig. 4.16, p. 109)*

### 5.5 Limitaciones de la etnografía

> «Debido a su enfoque en el usuario final, no siempre es adecuado para descubrir requerimientos de la organización o de dominio. No en todos los casos se identifican nuevas características que deben agregarse a un sistema. En consecuencia, la etnografía no es un enfoque completo para la adquisición por sí misma, y debe usarse para complementar otros enfoques, como el análisis de casos de uso.»
> *(Cap. 4 §4.5.5, p. 109)*

---

**Aplicación en el sistema:**
La etnografía justifica por qué el glosario de dominio **no puede construirse solo con entrevistas formales**. Un cliente puede describir su proceso según el manual, pero el proceso real (con sus atajos, términos coloquiales, workarounds y coordinaciones informales) solo emerge de la observación directa. El campo `notas` de la Entidad en el Módulo 1 debe capturar observaciones del dominio real que van más allá de la documentación oficial del cliente. Esas observaciones son la fuente de los campos `advertencia` y `contexto` en las entradas del glosario.

---

## 6. Proceso Operativo: Cómo Construir el Glosario de Dominio

Basado en Cap. 4 §4.1, §4.2, §4.3, §4.5.2 y §4.5.5. Este es el flujo de trabajo oficial del sistema para construir el glosario de una entidad nueva.

---

### Paso 1 — Revisión de documentación existente

**¿Qué revisar?**
- Contratos, pliegos, bases de licitación que el cliente usa habitualmente
- Normativas, reglamentos o estándares del sector en que opera (ej: Ley General de Urbanismo y Construcciones, OGUC, protocolos MINSAL, normas IFRS)
- Formularios, planillas o templates que el cliente ya usa internamente
- Organigrama y descripción de cargos (para identificar roles y sus términos)
- Especificaciones técnicas o manuales de operación existentes

**¿Qué buscar?**
- Palabras en mayúscula o entre comillas (suelen indicar términos técnicos del dominio)
- Acrónimos y siglas sin explicación (el cliente los da por conocidos)
- Términos que aparecen repetidamente con un sentido específico
- Contradicciones entre documentos (pueden indicar términos con significados disputados)

**¿Qué registrar?**
- Cada término candidato con el documento fuente y la página/sección donde aparece
- Primera definición encontrada (aunque sea informal)
- Contexto de uso: en qué proceso o área aparece el término

---

### Paso 2 — Entrevistas de descubrimiento de dominio

Sommerville advierte que las entrevistas son insuficientes por sí solas para capturar el dominio (§4.5.2, p. 104), pero son el punto de partida.

**¿A quién entrevistar?** Mapeado a los roles de stakeholders del Módulo 1:

| Rol en el Módulo 1 | Qué preguntar | Por qué es clave |
|---|---|---|
| **Representante legal / gerencia** | ¿Qué términos distinguen su empresa en su sector? ¿Qué mal entienden sus clientes o proveedores de usted? | Visión estratégica del dominio |
| **Usuario técnico** (el que operará el sistema) | ¿Cómo llaman a X en su empresa? ¿Cuándo dicen Y, qué quieren decir exactamente? | Vocabulario operacional real |
| **Responsable de calidad o procesos** | ¿Qué términos del sector tienen significados distintos en su empresa? ¿Qué es lo primero que explican a un colaborador nuevo? | Conocimiento normativo |
| **Usuario final** (quien hará las tareas diarias) | ¿Qué confusiones ha visto con personas externas? ¿Qué términos usa que otro no entendería? | Conocimiento tácito del trabajo real |

**¿Cómo registrar términos emergentes?**
- Anotar el término exactamente como lo dijo el entrevistado (sin parafrasear)
- Registrar quién lo dijo y en qué contexto
- Si dos personas usan el mismo término con significados distintos, registrar ambas versiones como posible conflicto

Sommerville describe la técnica de «pregunta de trampolín» (§4.5.2, p. 105): en lugar de preguntar «¿qué términos usa?», proporcionar ejemplos y preguntar «¿esto es así en su empresa o lo llaman de otra forma?».

---

### Paso 3 — Observación del trabajo real (etnografía)

**¿Cuándo aplicarla?**
- Siempre que sea posible, especialmente en dominios complejos (salud, construcción, logística, finanzas)
- Obligatoria cuando hay discrepancias entre la documentación oficial del cliente y lo que dicen los usuarios en entrevistas

**¿Qué observar?**
- Los términos que usan los trabajadores entre sí (no los del manual)
- Los atajos verbales: «el del pendiente», «la ficha», «el cierre» (términos informales con significado técnico preciso)
- Momentos en que alguien corrige a otro («no, eso no es un X, es un Y»)
- Procesos que no aparecen en los documentos pero que todo el equipo conoce

**¿Cómo documentarlo?**
- Anotar en el campo `notas` de la Entidad en el Módulo 1
- Cada término observado en campo que difiera de la documentación oficial → entrada del glosario con `advertencia: "En documentos oficiales aparece como X, pero el equipo lo usa como Y"`
- Las observaciones de trabajo cooperativo (Tipo 2 de Sommerville) → pueden generar requerimientos de dominio directamente

---

### Paso 4 — Validación del glosario con el cliente

**¿Quién aprueba cada definición?**
- El stakeholder que originó la definición debe validarla (campo `fuente` del glosario)
- Para términos técnicos críticos: validación cruzada con al menos dos stakeholders de distintos roles

**¿Qué pasa si hay definiciones en conflicto?**

Este es el escenario más importante. Cuando dos stakeholders definen el mismo término de forma distinta, el conflicto debe resolverse **antes de iniciar el SRS** (Módulo 3). El procedimiento es:

1. Registrar ambas definiciones con sus fuentes respectivas
2. Convocar reunión con ambos stakeholders para negociar (Sommerville §4.5, p. 102: «los participantes tienen que reunirse para resolver las diferencias y estar de acuerdo con el compromiso de los requerimientos»)
3. Documentar la definición acordada y la razón del conflicto original en el campo `advertencia`
4. Marcar el término como `requiereValidacion: true` hasta que se resuelva
5. El Módulo 3 no puede usarse con términos marcados como `requiereValidacion: true`

**Formato de validación:**
La fecha en que el stakeholder aprueba la definición se registra en `fechaValidacion`. Una definición sin `fechaValidacion` es un borrador, no una definición oficial del glosario.

---

### Paso 5 — Integración al registro de la Entidad y versionado

**¿Cómo queda almacenado en el sistema?**
- El glosario es una colección de entradas vinculada a la Entidad en el Módulo 1
- Cada proyecto del Módulo 2 hereda el glosario de su entidad (referencia, no copia)
- Los requerimientos del Módulo 3 pueden enlazar términos del glosario por ID

**¿Cómo se versiona cuando cambia?**
- Cada modificación a una entrada existente genera una nueva versión con fecha y autor del cambio
- Las definiciones anteriores se conservan en historial (nunca se borran)
- Si un término cambia de definición después de que un requerimiento del Módulo 3 ya lo usa, el sistema debe notificar al analista responsable de ese requerimiento
- El versionado del glosario sigue la misma lógica que la administración de requerimientos descrita por Sommerville en §4.7 (pp. 111–114): cada cambio debe ser rastreable a su causa y a quién lo aprobó

---

## 7. Plantilla Operativa: Entrada del Glosario

Esta es la estructura de datos de cada entrada del glosario que el sistema debe almacenar por entidad. Cada campo está justificado con referencia a Sommerville.

| Campo | Tipo | Descripción | Obligatorio | Justificación (Sommerville) |
|---|---|---|---|---|
| `id` | string (UUID) | Identificador único de la entrada | **Sí** | Necesario para trazabilidad y referencias cruzadas (§4.7, p. 113) |
| `término` | string | Palabra o frase exacta del dominio, tal como la usa el cliente | **Sí** | El SRS debe definir «los términos técnicos usados en el documento» (§4.2, Fig. 4.7, p. 93) |
| `definición` | string | Significado del término en el contexto específico del cliente | **Sí** | Sin definición validada, el requerimiento es ambiguo (§4.3, p. 86) |
| `sinónimos` | string[] | Otras formas en que el cliente usa el mismo concepto | No | Los especialistas «usan la terminología en una forma precisa y sutil» (§4.5.2, p. 104); los sinónimos capturan esa variedad |
| `términoTécnico` | string | Equivalente en lenguaje de IS o en el estándar de la industria | No | Permite mapear el lenguaje del cliente al lenguaje del equipo técnico |
| `fuente` | string | Nombre y rol del stakeholder que definió el término | **Sí** | «Las razones también pueden incluir información sobre quién planteó el requerimiento (la fuente)» (§4.3.1, p. 96) |
| `fechaValidacion` | Date | Fecha en que el cliente aprobó la definición | No* | La validación es el proceso de «verificar que los requerimientos definan realmente el sistema que en verdad quiere el cliente» (§4.6, p. 110). Sin fecha = borrador. |
| `contexto` | string | En qué proceso, área o fase del trabajo se usa el término | No | La etnografía descubre requerimientos en «el contexto social y organizacional» (§4.5.5, p. 108) |
| `advertencia` | string | Malentendidos comunes, diferencias con el uso estándar, conflictos históricos entre stakeholders | No | El ejemplo del MHC-PMS demuestra que un término puede tener dos interpretaciones radicalmente distintas (§4.3, p. 86) |
| `requiereValidacion` | boolean | `true` si hay un conflicto pendiente de resolución | **Sí** | Los conflictos entre stakeholders «deben resolverse antes de que puedan especificarse los requerimientos» (§4.5, p. 102) |
| `versión` | integer | Número de versión de esta definición | **Sí** | La administración de requerimientos exige rastrear cambios (§4.7, pp. 111–114) |
| `historial` | Entry[] | Versiones anteriores de esta entrada | **Sí** | «Los requerimientos del sistema también deben evolucionar» (§4.7, p. 111) |
| `entidadId` | string (FK) | ID de la Entidad propietaria del glosario | **Sí** | El glosario es propiedad de la entidad registrada en el Módulo 1 |

> *`fechaValidacion` es técnicamente No obligatorio en el campo, pero **funcionalmente obligatorio**: una entrada sin `fechaValidacion` tiene estado BORRADOR y no puede referenciarse desde el Módulo 3.

---

## 8. Checklist Operativo: Glosario Completo

Lista de verificación para que el analista confirme que el glosario de una entidad está listo antes de crear el primer proyecto en el Módulo 2 y antes de iniciar el Módulo 3.

### 8.1 Construcción del glosario

- [ ] ¿Se revisó la documentación interna del cliente (contratos, formularios, normativas internas)?
- [ ] ¿Se revisaron las normativas del sector en que opera el cliente?
- [ ] ¿Se entrevistó al menos a un **usuario final** (quien operará el sistema diariamente)?
- [ ] ¿Se entrevistó al menos a un **responsable técnico o de procesos** del cliente?
- [ ] ¿Se realizó al menos una sesión de **observación directa** del trabajo real (o se documentó explícitamente por qué no fue posible)?
- [ ] ¿Están definidos **todos los acrónimos** que usa el cliente en su documentación y en sus entrevistas?
- [ ] ¿Están identificados los términos que el cliente usa de forma **distinta al estándar de la industria**?
- [ ] ¿Están capturados los términos del **vocabulario informal** del equipo (los que usan entre sí, no los del manual)?

### 8.2 Validación del glosario

- [ ] ¿Cada definición fue **validada** (campo `fechaValidacion` completado) por el stakeholder que la originó?
- [ ] ¿Hay términos con definiciones **en conflicto** entre stakeholders? (Si los hay: deben resolverse antes de continuar. `requiereValidacion` debe ser `false` en todas las entradas.)
- [ ] ¿El equipo técnico **revisó el glosario** y confirmó que entiende cada término sin ambigüedad?
- [ ] ¿Alguna definición genera una **interpretación técnica que el cliente no anticipó**? (Si la hay, debe validarse con el cliente antes de continuar.)

### 8.3 Condición de cierre

- [ ] ✅ **LISTO PARA MÓDULO 2/3:** Todas las entradas tienen `requiereValidacion: false` y `fechaValidacion` completado. El glosario tiene al menos un término por cada área funcional del cliente.

---

## 9. Tabla de Conexiones con los 3 Módulos

| Concepto (Sommerville) | Módulo donde aplica | Proceso específico |
|---|---|---|
| **Glosario del SRS** (§4.2, Fig. 4.7) | **Módulo 1** (construcción), **Módulo 3** (consumo) | M1: se construye durante el registro de la Entidad. M3: cada requerimiento enlaza términos del glosario |
| **Requerimientos de dominio** (§4.1) | **Módulo 1** (captura), **Módulo 3** (especificación) | M1: el glosario documenta el vocabulario del dominio. M3: los requerimientos de dominio se especifican con ese vocabulario |
| **Ambigüedad del lenguaje natural** (§4.3) | **Módulo 3** | El glosario del M1 previene la ambigüedad antes de que los requerimientos del M3 se escriban |
| **Ejemplo MHC-PMS «buscar»** (§4.3) | **Módulo 3** | Caso de uso para validar términos clave antes de escribir requerimientos |
| **Lenguaje natural estructurado** (§4.3.2) | **Módulo 3** | Plantilla de especificación de requerimientos (complementa el glosario) |
| **Entrevistas de descubrimiento** (§4.5.2) | **Módulo 1** | Paso 2 del proceso operativo de construcción del glosario |
| **Etnografía** (§4.5.5) | **Módulo 1** | Paso 3 del proceso operativo; campo `notas` de la Entidad |
| **Validación de requerimientos** (§4.6) | **Módulo 3** | El glosario pre-validado en M1 reduce el número de iteraciones de validación en M3 |
| **Administración de requerimientos** (§4.7) | **Módulos 1, 2 y 3** | El versionado del glosario sigue los mismos principios que la administración de cambios del SRS |
| **Participantes y puntos de vista** (§4.5.1) | **Módulo 1** | Identificar a qué stakeholder corresponde cada definición del glosario (campo `fuente`) |

---

## 10. Checklist de Completitud

Verificación de que todos los ítems requeridos están cubiertos en este documento.

| Ítem | Sección | Estado |
|---|---|---|
| Estructura de metadatos del archivo | §Metadatos | ✅ |
| Cadena M1 → glosario → M3 explicada | §1 | ✅ |
| Definición del SRS según Sommerville | §2.1 | ✅ |
| Estructura Fig. 4.7 con Glosario | §2.2 | ✅ |
| Estándar IEEE citado | §2.3 | ✅ |
| Tipos de términos del glosario | §2.4 | ✅ |
| Consecuencias de no tener glosario | §2.5 | ✅ |
| Definición de requerimientos de dominio | §3.1 | ✅ |
| Distinción con funcionales/no funcionales | §3.1 | ✅ |
| Por qué los ingenieros no entienden el dominio | §3.2 | ✅ |
| Dos problemas: comprensibilidad y completitud | §3.3 | ✅ |
| Consecuencias: perdidos, malinterpretados, conflicto | §3.4 | ✅ |
| Problema del lenguaje natural | §4.1 | ✅ |
| Ejemplo MHC-PMS reproducido con detalle | §4.2 | ✅ |
| Tabla de interpretaciones del MHC-PMS | §4.2 | ✅ |
| Entrada de glosario para «buscar paciente» | §4.2 | ✅ |
| Lenguaje natural estructurado y plantilla | §4.3 | ✅ |
| Definición de etnografía según Sommerville | §5.1 | ✅ |
| Tipo 1: requerimientos del trabajo real | §5.2 | ✅ |
| Tipo 2: requerimientos de cooperación | §5.2 | ✅ |
| Por qué las entrevistas no bastan (Suchman) | §5.3 | ✅ |
| Combinación etnografía + prototipado (Fig. 4.16) | §5.4 | ✅ |
| Limitaciones de la etnografía | §5.5 | ✅ |
| Proceso operativo Paso 1: documentación | §6 | ✅ |
| Proceso operativo Paso 2: entrevistas | §6 | ✅ |
| Proceso operativo Paso 3: observación | §6 | ✅ |
| Proceso operativo Paso 4: validación | §6 | ✅ |
| Proceso operativo Paso 5: integración y versionado | §6 | ✅ |
| Plantilla de entrada del glosario (todos los campos) | §7 | ✅ |
| Justificación de cada campo con Sommerville | §7 | ✅ |
| Checklist operativo de construcción | §8.1 | ✅ |
| Checklist operativo de validación | §8.2 | ✅ |
| Condición de cierre explícita | §8.3 | ✅ |
| Tabla de conexiones con los 3 módulos | §9 | ✅ |

---

*Documento generado conforme a la estructura del sistema de gestión. Fuente única: Ingeniería de Software, Ian Sommerville, 9.ª edición, Pearson 2011.*
