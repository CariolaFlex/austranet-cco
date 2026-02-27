# M3-03-modelado-requerimientos.md

---

## 1. Metadatos

| Campo | Valor |
|---|---|
| **Nombre del archivo** | M3-03-modelado-requerimientos.md |
| **Módulo** | Módulo 3 — Documentación de Objetivos y Alcance (SRS) |
| **Capítulo fuente principal** | Capítulo 5: Modelado del Sistema — Ian Sommerville, *Ingeniería de Software*, 9ª ed. (Pearson, 2011) |
| **Versión** | 1.0.0 |
| **Fecha** | 2026-02-25 |
| **Estado del SRS en que aplica** | `en_modelado` |
| **Archivos relacionados** | M3-01 (Sección 6: Actividad 3 del proceso IR), M3-02 (Sección 6: casos de uso en adquisición) |

---

## 2. Objetivo del Documento

Este archivo documenta el **marco teórico completo del modelado de sistemas** aplicado al proceso de Ingeniería de Requerimientos (IR) del Módulo 3 durante la fase de estado SRS `en_modelado`. El modelado transforma los requerimientos recopilados durante `en_adquisicion` (M3-02) en representaciones visuales estructuradas que el equipo técnico puede usar para diseñar e implementar el sistema.

### ¿Qué cubre este archivo?

- Las cuatro perspectivas de modelado según Sommerville y su aplicación al SRS
- Los tipos de diagramas UML que el analista puede producir como artefactos del SRS
- Los criterios de selección de modelos según tipo y criticidad del proyecto
- El proceso operativo de la fase `en_modelado` paso a paso
- El criterio verificable para avanzar al estado `en_especificacion`

### Obligatoriedad del modelado

El modelado **no es opcional** en proyectos de criticidad `alta` o `critica`. Un SRS sin modelos de contexto, interacción y estructura es considerado **incompleto** según los estándares del sistema, ya que:

- Los modelos de contexto son el único mecanismo formal para definir el alcance del sistema
- Los modelos de interacción (CU + secuencia) son el puente entre los requerimientos textuales y el diseño
- Los modelos estructurales del dominio previenen ambigüedades terminológicas entre cliente y equipo técnico

Para proyectos de criticidad `baja` o tipo `consultoria`, el modelado puede limitarse al diagrama de contexto obligatorio.

### Entradas y salidas de la fase `en_modelado`

| | Descripción | Fuente |
|---|---|---|
| **Entrada** | Lista de requerimientos candidatos (RF y RNF), actores preliminares, glosario inicial | M3-02 (estado `en_adquisicion`) |
| **Entrada** | Tipo de proyecto, criticidad, módulos involucrados | M2-01 (configuración del Proyecto) |
| **Salida** | Artefactos de modelo adjuntos al SRS (URLs a diagramas externos) | Módulo 3 (estado `en_modelado`) |
| **Condición de avance** | Criterio verificable documentado en Sección 10 (Paso 7) | Este archivo |

---

## 3. ¿Qué es el Modelado de Sistemas? (Cap. 5, p. 119)

### 3.1 Definición Formal

> *"El modelado de sistemas es el proceso para desarrollar modelos abstractos de un sistema, donde cada modelo presenta una visin o perspectiva diferente de dicho sistema."*
> — Sommerville, Cap. 5, p. 119

Sommerville precisa que un **modelo es una abstracción**, no una representación alternativa del sistema:

> *"Un modelo es una abstraccin del sistema a estudiar, y no una representacin alternativa de dicho sistema. […] Una abstraccin simplifica y recoge deliberadamente las caractersticas ms destacadas."*
> — Sommerville, Cap. 5, p. 119

### 3.2 Por qué se necesitan múltiples modelos

Ningún modelo único puede capturar toda la complejidad de un sistema. Sommerville establece que desde diferentes perspectivas se desarrollan diferentes modelos para representar el sistema. Esto es consistente con la visión 4+1 de Kruchten (1995), que sugiere que la arquitectura de un sistema debe documentarse desde distintas perspectivas.

Los modelos se usan en tres momentos del proceso de ingeniería de software (Cap. 5, p. 119):
1. **Durante la IR**: para derivar requerimientos, aclarar el sistema existente y discutir propuestas con stakeholders
2. **Durante el diseño**: para describir el sistema a los ingenieros que lo implementarán
3. **Después de la implementación**: para documentar la estructura y operación del sistema

### 3.3 Las 4 Perspectivas de Modelado (Cap. 5, p. 120)

Sommerville define explícitamente cuatro perspectivas para modelar un sistema:

| Perspectiva | Descripción según Sommerville | Diagrama principal |
|---|---|---|
| **Contexto** | *"Una perspectiva externa, donde se modelen el contexto o entorno del sistema."* | Diagrama de actividad UML / diagrama de bloques |
| **Interacción** | *"Una perspectiva de interaccin, donde se modele la interaccin entre un sistema y su entorno, o entre los componentes de un sistema."* | Diagrama de casos de uso + Diagrama de secuencia |
| **Estructural** | *"Una perspectiva estructural, donde se modelen la organizacin de un sistema o la estructura de datos que procese el sistema."* | Diagrama de clases UML |
| **Comportamiento** | *"Una perspectiva de comportamiento, donde se modele el comportamiento dinmico del sistema y cmo responde ante ciertos eventos."* | Diagrama de actividad + Diagrama de estado |

> *"Desde diferentes perspectivas, usted puede desarrollar diferentes modelos para representar el sistema."*
> — Sommerville, Cap. 5, p. 120

### 3.4 Los 5 tipos de diagrama UML esenciales (Cap. 5, p. 120)

Un estudio de 2007 (Erickson y Siau) mostró que la mayoría de los usuarios del UML considera que **cinco tipos de diagrama** pueden representar lo esencial de un sistema:

1. **Diagramas de actividad**: muestran actividades en un proceso o procesamiento de datos
2. **Diagramas de caso de uso**: exponen interacciones entre un sistema y su entorno
3. **Diagramas de secuencia**: muestran interacciones entre actores, sistema y componentes
4. **Diagramas de clase**: revelan clases de objetos y asociaciones entre ellas
5. **Diagramas de estado**: explican cómo reacciona el sistema frente a eventos internos y externos

### 3.5 UML como notación estándar

> *"El UML es aceptado universalmente como el enfoque estndar al desarrollo de modelos de sistemas de software."*
> — Sommerville, Cap. 5 (recuadro UML, p. 121)

El UML tiene 13 tipos de diagrama y surgió del trabajo en la década de 1990 sobre modelado orientado a objetos. Una amplia revisión UML 2 se finalizó en 2004.

**Limitación importante según Sommerville**: el nivel de rigor depende del uso previsto del modelo:
- Como medio de **discusión**: puede ser incompleto e informal (modelado ágil)
- Como **documentación**: debe ser correcto pero no necesariamente completo
- Como base para **generación de código** (MDE): debe ser completo y correcto

> *"Cuando desarrolle modelos de sistema, sea flexible en la forma en que use la notacin grfica. No siempre necesitar apegarse rigurosamente a los detalles de una notacin."*
> — Sommerville, Cap. 5, p. 120

### 3.6 Modelos formales vs. informales

| Criterio | Modelo informal | Modelo formal |
|---|---|---|
| **Propósito** | Estimular discusión, comunicar ideas | Documentación precisa, generación de código |
| **Completitud** | No requerida | Requerida |
| **Rigor notacional** | Flexible | Estricto |
| **Uso en el sistema** | Proyectos de criticidad baja / consultoria | Proyectos de criticidad alta / critica |

> **Aplicación en el sistema:** Las 4 perspectivas de Sommerville determinan los 4 tipos de modelos que el analista puede adjuntar al SRS en el Módulo 3. El modelo de contexto es obligatorio para toda criticidad. Los demás se seleccionan según la Tabla Maestra de la Sección 9. Los modelos del Módulo 3 no se crean dentro del sistema (es un sistema de gestión, no un editor de diagramas); se adjuntan como URLs de archivos externos (draw.io, Miro, Lucidchart, etc.) referenciados desde la Plantilla de Artefacto de la Sección 11.

---

## 4. Modelos de Contexto (Cap. 5 §5.1, pp. 121–124)

### 4.1 Definición y propósito

> *"En una primera etapa en la especificacin de un sistema, debe decidir sobre las fronteras del sistema. Esto implica trabajar con los participantes del sistema para determinar cul funcionalidad se incluir en el sistema y cul la ofrecer el entorno del sistema."*
> — Sommerville, §5.1, p. 121

Los modelos de contexto muestran el sistema en relación con su entorno, pero con una limitación explícita:

> *"Los modelos de contexto, por lo general, muestran que el entorno incluye varios sistemas automatizados. Sin embargo, no presentan los tipos de relaciones entre los sistemas en el entorno y el sistema que se especifica."*
> — Sommerville, §5.1, p. 122

### 4.2 El problema de definir límites del sistema

La definición de la frontera del sistema **no es un juicio técnico libre de valor**. Sommerville advierte:

> *"La definicin de frontera de un sistema no es un juicio libre de valor. Las preocupaciones sociales y organizacionales pueden significar que la posicin de la frontera de un sistema se determine considerando factores no tcnicos."*
> — Sommerville, §5.1, p. 122

Ejemplos de factores no técnicos que afectan la frontera:
- Costos de análisis y desarrollo: se prefiere limitar el alcance a un sitio para reducir costos
- Dinámicas organizacionales: evitar consultar a administradores difíciles
- Estrategia de negocio: la división de desarrollo puede expandirse si el costo del sistema aumenta

### 4.3 Cómo construir el modelo de contexto

El primer paso es producir un **modelo arquitectónico simple** que muestre el sistema y los otros sistemas con los que se relaciona. El modelo de contexto típicamente incluye:
- El sistema a especificar (recuadro central)
- Los sistemas externos en su entorno (recuadros o figuras conectados)
- Las asociaciones que indican que existe alguna relación (sin detallar el tipo)

### 4.4 Modelos de proceso de negocio y diagramas de actividad UML

Los modelos de contexto simples se usan junto con **modelos de proceso empresarial**, que:

> *"Describen procesos humanos y automatizados que se usan en sistemas particulares de software."*
> — Sommerville, §5.1, p. 122

Para modelar el contexto del proceso se utiliza el **diagrama de actividad UML**:

> *"Los diagramas de actividad intentan mostrar las actividades que incluyen un proceso de sistema, as como el flujo de control de una actividad a otra."*
> — Sommerville, §5.1, p. 123

**Elementos notacionales del diagrama de actividad UML** (Cap. 5, p. 123):

| Elemento | Notación UML |
|---|---|
| Inicio del proceso | Círculo relleno (●) |
| Fin del proceso | Círculo relleno dentro de otro círculo (⊙) |
| Actividad / subproceso | Rectángulo con esquinas redondeadas |
| Flujo de trabajo | Flechas entre actividades |
| Coordinación (sincronización) | Barra sólida horizontal |
| Paralelismo | Barra sólida con múltiples flechas salientes |
| Condición de flujo | Guarda anotada sobre la flecha (ej: `[Peligroso]`) |

> **Aplicación en el sistema:** El modelo de contexto del SRS (Módulo 3) define formalmente el alcance del proyecto. Los elementos externos identificados en el diagrama de contexto se convierten en actores del SRS y en integraciones a documentar como RNF de interoperabilidad. La frontera del sistema definida en el modelo de contexto determina qué funcionalidades quedan **dentro** del alcance del Proyecto (Módulo 2) y cuáles son responsabilidad de sistemas externos.

---

## 5. Modelos de Interacción (Cap. 5 §5.2, pp. 124–128)

> *"Todos los sistemas incluyen interacciones de algn tipo. stas son interacciones del usuario, que implican entradas y salidas del usuario; interacciones entre el sistema a desarrollar y otros sistemas o interacciones entre los componentes del sistema."*
> — Sommerville, §5.2, p. 124

Sommerville cubre dos enfoques de modelado de interacción:
1. **Modelado de casos de uso**: interacciones entre el sistema y actores externos
2. **Diagramas de secuencia**: interacciones entre componentes del sistema (y actores externos)

> *"Los modelos de caso de uso y los diagramas de secuencia presentan la interaccin a diferentes niveles de detalle y, por lo tanto, es posible utilizarlos juntos. Los detalles de las interacciones que hay en un caso de uso de alto nivel se documentan en un diagrama de secuencia."*
> — Sommerville, §5.2, p. 124

### 5.1 Modelado de casos de uso (Cap. 5 §5.2.1, pp. 124–126)

> **Nota:** La descripción inicial de casos de uso fue introducida en M3-02 (Sección 6) como herramienta de adquisición. Esta sección profundiza en el **modelado UML formal** de los casos de uso, que es la actividad del estado `en_modelado`.

#### 5.1.1 Definición

> *"Un caso de uso puede tomarse como un simple escenario que describa lo que espera el usuario de un sistema. Cada caso de uso representa una tarea discreta que implica interaccin externa con un sistema."*
> — Sommerville, §5.2.1, p. 124

El modelado de casos de uso fue desarrollado originalmente por Jacobson (1993) e incorporado en el primer lanzamiento del UML.

#### 5.1.2 Elementos del diagrama de casos de uso UML

| Elemento | Notación | Descripción |
|---|---|---|
| **Caso de uso** | Elipse | Tarea discreta que implica interacción externa |
| **Actor** | Figura humana (stick figure) | Usuario individual u otro sistema externo |
| **Asociación** | Línea sin flecha (formalmente) | Participación del actor en el caso de uso |
| **Dirección informal** | Flecha | Indica quién inicia la transacción (uso informal) |

> *"De manera formal, los diagramas de caso de uso deben emplear lneas sin flechas —las flechas en el UML indican la direccin del flujo de mensajes."*
> — Sommerville, §5.2.1, p. 125

#### 5.1.3 Descripción complementaria del caso de uso

Un diagrama de casos de uso provee *"un panorama bastante sencillo de una interaccin"*, por lo que debe complementarse con:
- **Descripción textual simple** en lenguaje natural
- **Descripción tabular estructurada** (formato estándar recomendado por Sommerville): incluye Actores, Descripción, Datos, Estímulo, Respuesta, Comentarios
- **Diagrama de secuencia** para el flujo principal (ver §5.2)

#### 5.1.4 Organización de casos de uso en múltiples diagramas

Cuando el sistema es grande, Sommerville recomienda:

> *"Puede desarrollar varios diagramas, cada uno de los cuales exponga casos de uso relacionados."*
> — Sommerville, §5.2.1, p. 125

La estrategia es agrupar los casos de uso por **actor principal** (todos los CU del actor X en un diagrama) o por **subsistema/módulo**.

#### 5.1.5 Limitaciones del diagrama de casos de uso

- Muestra **qué** interacciones ocurren, no **cómo** ocurren internamente
- No muestra el flujo de mensajes entre objetos del sistema
- No muestra condiciones, bucles ni bifurcaciones del flujo
- Debe complementarse con diagramas de secuencia para capturar el flujo detallado

### 5.2 Diagramas de Secuencia (Cap. 5 §5.2.2, pp. 126–128)

#### 5.2.1 Definición formal

> *"Los diagramas de secuencia en el UML se usan principalmente para modelar las interacciones entre los actores y los objetos en un sistema, as como las interacciones entre los objetos en s."*
> — Sommerville, §5.2.2, p. 126

> *"Como sugiere el nombre, un diagrama de secuencia muestra la sucesin de interacciones que ocurre durante un caso de uso particular o una instancia de caso de uso."*
> — Sommerville, §5.2.2, p. 126

#### 5.2.2 Elementos del diagrama de secuencia

| Elemento | Notación | Descripción |
|---|---|---|
| **Actores / Objetos** | Recuadros en la parte superior | Participantes en la secuencia |
| **Línea de vida** | Línea punteada vertical | Duración de existencia/participación del objeto |
| **Barra de activación** | Rectángulo sobre la línea punteada | Período en que el objeto está activo |
| **Mensaje síncronos** | Flecha dirigida sólida | Llamada a método/operación con parámetros |
| **Valor de retorno** | Flecha punteada | Valor que regresa la operación |
| **Alternativas** | Recuadro `alt` con condiciones en `[corchetes]` | Flujo condicional |

> *"Las anotaciones sobre las flechas sealan las llamadas a los objetos, sus parmetros y los valores que regresan. […] La secuencia de interacciones se lee de arriba abajo."*
> — Sommerville, §5.2.2, p. 126

#### 5.2.3 Nivel de detalle recomendado

> *"A menos que use diagramas de secuencia para generacin de cdigo o documentacin detallada, en dichos diagramas no tiene que incluir todas las interacciones."*
> — Sommerville, §5.2.2, p. 128

En el contexto de IR (no de generación de código), los diagramas de secuencia del SRS:
- Documentan el flujo **principal** del caso de uso
- Pueden omitir detalles de implementación que se definirán después
- Deben mostrar actores externos, objetos principales del sistema y flujos alternativos clave

#### 5.2.4 Relación entre caso de uso y diagrama de secuencia

- Cada **flujo principal** de un CU de criticidad `alta` tiene su diagrama de secuencia correspondiente
- Los diagramas de secuencia **extienden** los CU mostrando el flujo interno de mensajes
- La jerarquía es: Modelo de Contexto → Casos de Uso → Diagramas de Secuencia

> **Aplicación en el sistema:** En el Módulo 3, cada RF de criticidad `alta` con flujo de interacción complejo (múltiples actores, validaciones, objetos intermedios) debe tener al menos un diagrama de secuencia que describa su interacción principal. Los diagramas se adjuntan al SRS como artefactos de respaldo (ver Sección 11) y se referencian desde el campo `requerimientosVinculados` del artefacto correspondiente al RF.

---

## 6. Modelos Estructurales (Cap. 5 §5.3, pp. 129–133)

> *"Los modelos estructurales de software muestran la organizacin de un sistema, en trminos de los componentes que constituyen dicho sistema y sus relaciones."*
> — Sommerville, §5.3, p. 129

Los modelos estructurales pueden ser:
- **Estáticos**: muestran la estructura del diseño del sistema
- **Dinámicos**: revelan la organización del sistema cuando se ejecuta

En el contexto de IR, se usan principalmente los **modelos estáticos de clases del dominio**, no de diseño.

### 6.1 Diagramas de Clase (Cap. 5 §5.3.1, pp. 129–131)

#### 6.1.1 Definición en el contexto de IR

> *"Cuando se desarrollan modelos durante las primeras etapas del proceso de ingeniera de software, los objetos representan algo en el mundo real, como un paciente, una receta, un mdico, etctera."*
> — Sommerville, §5.3.1, p. 129

> *"En el anlisis de requerimientos orientado a objetos, se modelan entidades del mundo real usando clases de objetos."*
> — Sommerville, §5.3.1 (recuadro OORA), p. 129

La diferencia fundamental entre el diagrama de clases en IR vs. diseño:
- En **IR**: modela entidades del dominio del negocio del cliente (Paciente, Consulta, Medicamento)
- En **diseño**: modela clases de implementación del software (Controller, Repository, Service)

#### 6.1.2 Estructura de una clase UML

El rectángulo de clase tiene tres secciones:
1. **Sección superior**: nombre de la clase de objeto
2. **Sección media**: atributos de la clase (nombres y opcionalmente tipos)
3. **Sección inferior**: operaciones (métodos) asociadas con la clase

> *"Una clase de objeto se considera como una definicin general de un tipo de objeto del sistema. Una asociacin es un vnculo entre clases, que indica que hay una relacin entre dichas clases."*
> — Sommerville, §5.3.1, p. 129

#### 6.1.3 Multiplicidad en asociaciones

| Notación | Significado |
|---|---|
| `1` | Exactamente uno |
| `*` (o `1..*`) | Uno o más (número indefinido) |
| `1..4` | Entre 1 y 4 |
| `0..1` | Cero o uno (opcional) |

#### 6.1.4 Tipos de relaciones entre clases

| Relación | Notación | Definición |
|---|---|---|
| **Asociación** | Línea simple con nombre | Vínculo entre clases que indica relación. Cada clase puede tener conocimiento de la otra. |
| **Generalización** | Flecha que apunta a la clase más general | Jerarquía de herencia: subclases heredan atributos y operaciones de superclases |
| **Agregación** | Rombo hueco (◇) junto al "todo" | Un objeto (todo) se compone de otros objetos (partes). Partes pueden existir independientemente. |
| **Composición** | Rombo relleno (◆) junto al "todo" | Forma fuerte de agregación: las partes no existen sin el todo. |

### 6.2 Generalización (Cap. 5 §5.3.2, pp. 131–133)

> *"La generalizacin es una tcnica cotidiana que se usa para gestionar la complejidad. En vez de aprender las caractersticas detalladas de cada entidad que se experimenta, dichas entidades se colocan en clases ms generales."*
> — Sommerville, §5.3.2, p. 131

En el modelado de sistemas:

> *"Con frecuencia es til examinar las clases en un sistema, con la finalidad de ver si hay mbito para la generalizacin. Esto significa que la informacin comn se mantendr solamente en un lugar."*
> — Sommerville, §5.3.2, p. 132

Reglas para usar generalización:
- **Usar cuando**: múltiples entidades del dominio comparten atributos y operaciones comunes
- **Evitar cuando**: las entidades comparten solo el nombre pero tienen comportamientos muy distintos
- En UML, la generalización se muestra como **flecha que apunta hacia la clase más general** (superclase)

En una jerarquía de generalización:
- Las clases de nivel inferior (**subclases**) heredan atributos y operaciones de sus **superclases**
- Las subclases agregan atributos y operaciones más específicos

**Cuándo usar generalización vs. composición:**

| Criterio | Generalización | Composición |
|---|---|---|
| **Pregunta clave** | ¿Es-un-tipo-de? (Médico de cabecera **es-un** Médico) | ¿Contiene-como-parte? (Proyecto **contiene** Partidas) |
| **Herencia** | Sí, los atributos se heredan hacia abajo | No aplica herencia |
| **Existencia independiente** | Las subclases pueden existir sin la superclase | Las partes no existen sin el todo (composición fuerte) |

### 6.3 Agregación (Cap. 5 §5.3.3, p. 133)

> *"El UML proporciona un tipo especial de asociacin entre clases llamado agregacin, que significa que un objeto (el todo) se compone de otros objetos (las partes). Para mostrarlo, se usa un trazo en forma de diamante, junto con la clase que representa el todo."*
> — Sommerville, §5.3.3, p. 133

**Diferencia entre agregación y composición:**

| | Agregación | Composición |
|---|---|---|
| **Rombo** | Hueco (◇) | Relleno (◆) |
| **Dependencia** | Las partes pueden existir sin el todo | Las partes **no pueden** existir sin el todo |
| **Ejemplo del dominio** | Proyecto ◇→ Equipo (el equipo puede existir en otro proyecto) | Proyecto ◆→ Partidas (las partidas no existen fuera del proyecto) |

> **Aplicación en el sistema:** Los diagramas de clases del Módulo 3 modelan el **negocio del cliente**, no el software a construir. Por ejemplo, en un proyecto de construcción: `Obra ◆→ Partida ◆→ Subcontrato`. Estos modelos alimentan el glosario de dominio del Módulo 1 (términos del negocio) y los tipos de datos del sistema a construir (referencia a `src/types/index.ts` en la implementación). Una clase del dominio en el SRS se convierte en un type/interface en el código.

---

## 7. Modelos de Comportamiento (Cap. 5 §5.4, pp. 133–138)

> *"Los modelos de comportamiento son modelos dinmicos del sistema conforme se ejecutan. En ellos se muestra lo que sucede o lo que se supone que pasa cuando un sistema responde ante un estmulo de su entorno."*
> — Sommerville, §5.4, p. 133

Los estímulos son de dos tipos:
1. **Datos**: algunos datos que llegan se procesan por el sistema
2. **Eventos**: algunos eventos activan el procesamiento del sistema (pueden tener datos asociados)

### 7.1 Modelado Dirigido por Datos (Cap. 5 §5.4.1, pp. 134–135)

#### 7.1.1 Definición

> *"Los modelos dirigidos por datos muestran la secuencia de acciones involucradas en el procesamiento de datos de entrada, as como la generacin de una salida asociada. Son particularmente tiles durante el anlisis de requerimientos, pues sirven para mostrar procesamiento extremo a extremo en un sistema."*
> — Sommerville, §5.4.1, p. 134

#### 7.1.2 Diagramas de flujo de datos (DFD)

Los DFD fueron introducidos en la década de 1970 (DeMarco, 1978) como parte del análisis estructurado:

> *"Los modelos de flujo de datos son tiles porque el hecho de rastrear y documentar cmo los datos asociados con un proceso particular se mueven a travs del sistema ayuda a los analistas y diseadores a entender lo que sucede."*
> — Sommerville, §5.4.1, p. 134

Característica clave: *"Los diagramas de flujo de datos son simples e intuitivos y, por lo general, es posible explicarlos a los usuarios potenciales del sistema, quienes despus pueden participar en la validacin del modelo."*

**Limitación**: El UML **no soporta DFD nativamente**, porque los DFD se enfocan en funciones y no reconocen objetos del sistema.

#### 7.1.3 Diagramas de actividad UML (sustituto de los DFD)

> *"Como los sistemas dirigidos por datos son tan comunes en los negocios, UML 2.0 introdujo diagramas de actividad, que son similares a los diagramas de flujo de datos."*
> — Sommerville, §5.4.1, p. 134

Los pasos de procesamiento se representan como **actividades** y los datos que fluyen entre ellos como **objetos**. 

**Cuándo usar diagramas de actividad vs. DFD:**

| Criterio | Diagrama de actividad UML | Diagrama de flujo de datos (DFD) |
|---|---|---|
| **Enfoque** | Objetos y actividades | Funciones y transformaciones de datos |
| **Soporte UML** | Sí (UML 2.0+) | No (herramientas externas) |
| **Uso recomendado** | Proyectos orientados a objetos | Sistemas legacy, análisis estructurado |
| **Swimlanes** | Soportado (particiones por actor/sistema) | Mediante carriles en herramientas externas |

Los **swimlanes** (carriles) en diagramas de actividad permiten asignar cada actividad al actor o sistema responsable de ejecutarla, lo que los hace especialmente útiles para modelar procesos de negocio multi-actor.

### 7.2 Modelado Dirigido por Eventos (Cap. 5 §5.4.2, pp. 135–138)

#### 7.2.1 Definición

> *"El modelado dirigido por un evento muestra cmo responde un sistema a eventos externos e internos. Se basa en la suposicin de que un sistema tiene un nmero finito de estados y que los eventos (estmulos) pueden causar una transicin de un estado a otro."*
> — Sommerville, §5.4.2, p. 135

#### 7.2.2 Diagramas de estado UML

> *"El UML soporta modelado basado en eventos usando diagramas de estado, que se fundamentaron en grficos de estado (Harel, 1987, 1988). Los diagramas de estado muestran estados y eventos del sistema que causan transiciones de un estado a otro."*
> — Sommerville, §5.4.2, p. 135

**Elementos del diagrama de estado UML:**

| Elemento | Notación | Descripción |
|---|---|---|
| **Estado** | Rectángulo redondeado | Condición en que se encuentra el sistema |
| **Acción en estado** | `do / <acción>` dentro del estado | Actividad que ocurre mientras el sistema está en ese estado |
| **Acción de salida** | `exit / <acción>` dentro del estado | Actividad que ocurre al salir del estado |
| **Estado inicial** | Círculo relleno (●) | Punto de entrada al diagrama |
| **Estado final** | Círculo dentro de círculo (⊙) | Punto de salida al diagrama |
| **Transición** | Flecha etiquetada | Cambio de estado provocado por un evento/estímulo |
| **Evento/Estímulo** | Etiqueta sobre la flecha | Condición que dispara la transición |
| **Superestado** | Rectángulo redondeado grande que contiene estados | Agrupa subestados para reducir complejidad |

> *"La notacin UML permite indicar la actividad que ocurre en un estado."*
> — Sommerville, §5.4.2, p. 137

#### 7.2.3 Manejo de la complejidad con superestados

> *"El problema con el modelado basado en el estado es que el nmero de posibles estados se incrementa rpidamente. Por lo tanto, para modelos de sistemas grandes, necesita ocultar detalles en los modelos. Una forma de hacer esto es mediante la nocin de un superestado que encapsule algunos estados separados."*
> — Sommerville, §5.4.2, p. 138

#### 7.2.4 Cuándo usar diagramas de estado

Sommerville indica que esta visión es *"adecuado particularmente para sistema en tiempo real"*, pero es igualmente aplicable a cualquier entidad del dominio que tenga un **ciclo de vida definido** con múltiples estados y transiciones controladas por eventos.

Criterios para usar diagramas de estado:
- La entidad tiene más de 2 estados claramente diferenciados
- Existen reglas de negocio que controlan qué transiciones son válidas
- El mismo evento puede producir efectos distintos según el estado actual
- La entidad tiene acciones específicas al entrar o salir de un estado

> **Aplicación en el sistema:** Los diagramas de estado del Módulo 3 son especialmente relevantes para modelar los **ciclos de vida** ya definidos en los módulos anteriores: `EstadoEntidad` (M1), `EstadoProyecto` (M2), `EstadoSRS` y `EstadoRequerimiento` (M3, definidos en M3-01 Sección 10). Un diagrama de estado UML de `EstadoSRS` con sus transiciones (`en_adquisicion` → `en_modelado` → `en_especificacion` → etc.) es un artefacto válido del SRS que expresa formalmente el ciclo de vida ya documentado en texto.

---

## 8. Ingeniería Dirigida por Modelo (MDE) (Cap. 5 §5.5, pp. 138–142)

### 8.1 Definición y filosofía

> *"La ingeniera dirigida por modelo (MDE, por las siglas de Model-Driven Engineering) es un enfoque al desarrollo de software donde los modelos, y no los programas, son las salidas principales del proceso de desarrollo. Los programas que se ejecutan en una plataforma hardware/software se generan en tal caso automticamente a partir de los modelos."*
> — Sommerville, §5.5, p. 138

> *"Los partidarios de la MDE argumentan que sta eleva el nivel de abstraccin en la ingeniera de software, pues los ingenieros ya no tienen que preocuparse por detalles del lenguaje de programacin o las especificidades de las plataformas de ejecucin."*
> — Sommerville, §5.5, p. 138

### 8.2 La Arquitectura Dirigida por Modelo (MDA)

La MDE tiene sus raíces en la **Arquitectura Dirigida por Modelo (MDA)**, propuesta por el Object Management Group (OMG) en 2001. El método MDA recomienda tres tipos de modelo abstracto (Cap. 5, §5.5.1, p. 140):

| Tipo de Modelo | Siglas | Definición según Sommerville |
|---|---|---|
| **Modelo Independiente de Computación** | CIM | *"Modela las importantes abstracciones de dominio usadas en el sistema. En ocasiones, los CIM se llaman modelos de dominio."* |
| **Modelo Independiente de Plataforma** | PIM | *"Modela la operacin del sistema sin referencia a su implementacin. El PIM se describe usualmente mediante modelos UML que muestran la estructura esttica del sistema y cmo responde a eventos externos e internos."* |
| **Modelos Específicos de Plataforma** | PSM | *"Son transformaciones del modelo independiente de plataforma con un PSM separado para cada plataforma de aplicacin."* |

La cadena de transformación es: **CIM → PIM → PSM → Código ejecutable**

### 8.3 Ventajas del MDE según el libro

> *"La ingeniera basada en modelo permite a los ingenieros pensar sobre sistemas en un nivel de abstraccin elevado, sin ocuparse por los detalles de su implementacin. Esto reduce la probabilidad de errores, acelera el diseo y el proceso de implementacin, y permite la creacin de modelos de aplicacin reutilizables, independientes de la plataforma de aplicacin."*
> — Sommerville, §5.5, p. 139

Ventajas adicionales:
- **Portabilidad**: a partir de un PIM se puede generar código para múltiples plataformas (Java, .NET, etc.)
- **Documentación viva**: los modelos reflejan el estado del sistema
- **Automatización**: las transformaciones entre modelos pueden aplicarse con herramientas de software

### 8.4 Limitaciones y críticas del MDE

> *"No siempre se sigue que las abstracciones que soporta el modelo son las abstracciones correctas para la implementacin."*
> — Sommerville, §5.5, p. 139

Críticas adicionales según Sommerville:
- Los argumentos para independencia de plataforma solo son válidos para sistemas grandes de larga duración
- Para sistemas críticos, los problemas reales son IR, seguridad, confiabilidad e integración con sistemas heredados (no la implementación)
- No hay herramientas MDA que soporten prácticas ágiles como TDD o pruebas de regresión
- *"En el momento de escribir este texto, los enfoques dirigidos por modelo no son ampliamente usados por la ingeniera de software."* (p. 139)

### 8.5 UML Ejecutable (xUML)

Para la transformación completamente automatizada de modelos a código, se usa el **UML ejecutable (xUML)**, que reduce los tipos de modelo a tres:
1. **Modelos de dominio**: diagramas de clase con objetos, atributos y asociaciones
2. **Modelos de clase**: clases con atributos y operaciones detalladas
3. **Modelos de estado**: un diagrama de estado asociado con cada clase para describir su ciclo de vida

> **Aplicación en el sistema:** La MDE justifica por qué los modelos del Módulo 3 **no son "diagramas bonitos"** sino artefactos de primer orden del proceso de IR. El CIM del SRS corresponde al modelo de dominio del cliente (clases del negocio). El PIM corresponde a los diagramas de interacción y comportamiento del sistema a construir. Un modelo del SRS actualizado refleja el estado real del sistema a construir en el momento de su actualización, no el estado al momento de escribirlo inicialmente.

---

## 9. Tabla Maestra de Modelos del SRS

Esta tabla es el **instrumento de decisión** que el analista usa para determinar qué modelos incluir en el SRS según el tipo y criticidad del proyecto. La selección debe hacerse al inicio del estado `en_modelado`, registrando en el SRS los modelos comprometidos.

| Modelo | Perspectiva | Herramienta UML | Tipo de proyecto | Criticidad mínima | Obligatorio |
|---|---|---|---|---|---|
| Diagrama de contexto | Contexto | Diagrama de actividad UML o diagrama de bloques | **Todos** | Cualquiera | **Sí, siempre** |
| Diagrama de casos de uso | Interacción | UML CU | Nuevo desarrollo, migracion | Media, Alta, Critica | Sí (≥ Media) |
| Diagrama de secuencia | Interacción | UML DS | Nuevo desarrollo | Alta, Critica | Por cada RF de criticidad Alta/Critica con flujo complejo |
| Diagrama de clases del dominio | Estructural | UML DC | Nuevo desarrollo, migracion | Alta, Critica | Sí (≥ Alta) |
| Diagrama de actividad (proceso) | Comportamiento | UML DA | Todos con flujos complejos | Cualquiera | Por cada proceso de negocio con bifurcaciones |
| Diagrama de estado | Comportamiento | UML DE | Sistemas con ciclos de vida de entidades | Media, Alta, Critica | Por cada entidad con ≥ 3 estados y transiciones condicionadas |

### Criterios por tipo de proyecto

#### Tipo: `nuevo_desarrollo`
- Se aplica la tabla completa según criticidad
- Todos los modelos aplican desde criticidad `media`
- Diagramas de secuencia son obligatorios para RF de criticidad `alta` o `critica`

#### Tipo: `mantenimiento`
- **No crear modelos nuevos** si el sistema ya tiene documentación de modelos existente
- **Actualizar** el diagrama de contexto si cambian integraciones o actores externos
- **Actualizar** el diagrama de clases si se agregan o modifican entidades del dominio
- **Crear diagramas de secuencia nuevos** solo para RF nuevos de criticidad `alta`/`critica`
- Prioridad: actualizar modelos existentes antes de crear nuevos

#### Tipo: `migracion`
- **Obligatorio**: diagrama de contexto del **sistema origen** (captura qué existe actualmente)
- **Obligatorio**: diagrama de contexto del **sistema destino** (define el nuevo alcance)
- Diagramas de clases del dominio del sistema origen: obligatorios para mapear la migración de datos
- Diagramas de estado del sistema origen: si existen ciclos de vida que deben preservarse
- Diagramas de casos de uso: para documentar qué funcionalidades se migran vs. qué se abandona

#### Tipo: `integracion`
- **Foco principal**: diagrama de contexto con especial detalle en los sistemas externos
- Diagramas de secuencia para cada **interface de integración** (protocolo, datos intercambiados, orden)
- Los diagramas de secuencia de integración son los artefactos más críticos de este tipo de proyecto
- Los modelos de clases del dominio son opcionales (depende si se crean entidades nuevas)

#### Tipo: `consultoria`
- El modelado formal **generalmente no aplica** en proyectos de consultoría pura
- Excepción: si el proyecto de consultoría produce un informe con recomendaciones de sistema, aplicar diagrama de contexto como mínimo
- Los diagramas de actividad son útiles para documentar procesos de negocio actuales (AS-IS) y propuestos (TO-BE)

---

## 10. Proceso Operativo: Fase `en_modelado`

El SRS entra en estado `en_modelado` cuando el analista completa la adquisición de requerimientos (`en_adquisicion`, M3-02) y tiene una lista de requerimientos candidatos. Los siguientes pasos son la secuencia de trabajo durante esta fase.

---

### PASO 1 — Selección de modelos

**Objetivo:** Determinar el conjunto de modelos a construir antes de comenzar a modelar.

**Actividad:**
1. Consultar la Tabla Maestra (Sección 9) con los datos de Tipo de Proyecto y Criticidad del Proyecto (M2-01)
2. Registrar en el SRS los modelos comprometidos como artefactos vacíos (con estado `pendiente`)
3. Identificar para cada RF de criticidad `alta`/`critica` si requiere diagrama de secuencia

**Resultado:** Lista de artefactos de modelo comprometidos, registrados en el sistema con campos mínimos.

---

### PASO 2 — Modelo de contexto (obligatorio para todos los proyectos)

**Objetivo:** Definir formalmente el alcance del sistema.

**Actividad:**
1. Identificar: ¿qué funcionalidades están **dentro** del sistema?
2. Identificar: ¿qué sistemas externos interactúan con el sistema?
3. Identificar: ¿qué actores humanos interactúan con el sistema?
4. Construir el diagrama de contexto (herramienta externa: draw.io, Miro, Lucidchart)
5. Adjuntar como artefacto al SRS con tipo `contexto`

**Resultado:** Alcance del sistema definido formalmente. Todo lo que está fuera del recuadro del sistema es responsabilidad de sistemas externos o procesos manuales.

---

### PASO 3 — Modelos de interacción (si aplica según Tabla Maestra)

**Objetivo:** Modelar cómo los actores interactúan con el sistema.

**Actividad:**
1. Para cada actor identificado en el Paso 2: construir el diagrama de casos de uso que lo involucra (extiende M3-02 §6)
2. Revisar que todos los RF candidatos estén cubiertos por al menos un caso de uso
3. Para cada RF de criticidad `alta` con flujo complejo: construir el diagrama de secuencia del flujo principal
4. Adjuntar cada diagrama como artefacto al SRS con el tipo correspondiente (`casos_uso`, `secuencia`)
5. Vincular cada artefacto a los RF que ilustra (campo `requerimientosVinculados`)

**Resultado:** Todos los actores del contexto están cubiertos por casos de uso. Los RF críticos tienen diagramas de secuencia.

---

### PASO 4 — Modelos estructurales (si aplica según Tabla Maestra)

**Objetivo:** Modelar las entidades del dominio del cliente.

**Actividad:**
1. Identificar las entidades principales del negocio del cliente (sustantivos en los RF y en el glosario de M1)
2. Construir el diagrama de clases del dominio (entidades, atributos clave, relaciones)
3. **Comparar con el glosario del Módulo 1**: ¿hay entidades en el diagrama sin entrada en el glosario? → Actualizar glosario (M1)
4. **Verificar consistencia**: ¿los nombres de clases coinciden con los términos usados en los RF candidatos?
5. Adjuntar como artefacto al SRS con tipo `clases`

**Resultado:** Diagrama de clases del dominio que mapea el negocio del cliente. Glosario de M1 actualizado con términos faltantes.

---

### PASO 5 — Modelos de comportamiento (si aplica según Tabla Maestra)

**Objetivo:** Modelar los procesos complejos y ciclos de vida de entidades.

**Actividad:**
1. **Para procesos con flujos complejos** (bifurcaciones, paralelismo, múltiples actores): construir diagrama de actividad con swimlanes
2. **Para entidades con ciclos de vida** (≥ 3 estados con transiciones condicionadas): construir diagrama de estado
3. Verificar que los estados del diagrama de estado sean consistentes con los valores del campo `estado` en el SRS y en los tipos del sistema
4. Adjuntar como artefactos al SRS con tipos `actividad` y `estado` respectivamente

**Resultado:** Procesos de negocio complejos documentados visualmente. Ciclos de vida de entidades expresados formalmente en UML.

---

### PASO 6 — Revisión con stakeholders

**Objetivo:** Validar los modelos con las personas que tienen conocimiento del dominio.

**Actividad:**
1. Presentar los modelos a los stakeholders de influencia `alta` (M3-01, Sección de Stakeholders)
2. Los modelos son el medio de comunicación preferido: más efectivos que el texto para detectar errores de comprensión
3. Prioridad de revisión: modelo de contexto primero (alcance), luego casos de uso, luego clases del dominio
4. Registrar en el campo `observaciones` de cada artefacto las notas de la revisión
5. Marcar `revisadoPorStakeholder = true` y registrar `fechaRevision` en el artefacto
6. Si la revisión genera cambios a los RF candidatos: actualizar los RF en el sistema y re-verificar consistencia con modelos

**Resultado:** Modelos revisados y validados por el cliente. Campo `revisadoPorStakeholder` marcado en todos los artefactos obligatorios.

---

### PASO 7 — Criterio de avance a `en_especificacion`

El SRS puede avanzar al estado `en_especificacion` **únicamente si se cumplen todos los siguientes criterios**, los cuales son verificables (no interpretativos):

| N° | Criterio | Verificación |
|---|---|---|
| 1 | Diagrama de contexto completado, adjunto al SRS y marcado como revisado | `artefactos[tipo='contexto'][revisadoPorStakeholder=true]` existe |
| 2 | Todos los actores identificados en el modelo de contexto están vinculados a stakeholders del Módulo 1 | Cada actor del diagrama de contexto tiene correspondencia en la lista de stakeholders del Módulo 3 |
| 3 | Casos de uso construidos para todos los actores principales del contexto | Para cada actor principal: existe al menos un artefacto `tipo='casos_uso'` que lo referencia |
| 4 | RF candidatos de criticidad `alta` con flujo complejo tienen diagrama de secuencia asociado | Para cada RF de criticidad `alta` con flujo complejo: existe `requerimientosVinculados` en un artefacto `tipo='secuencia'` |
| 5 | RF candidatos son consistentes con los modelos (sin contradicciones no resueltas) | No existen RF candidatos que contradigan lo representado en los modelos (verificado en Paso 6) |
| 6 | No existen ambigüedades críticas sin resolver entre modelos | No existen observaciones pendientes de resolución en artefactos obligatorios |

> **Regla de bloqueo:** Si algún criterio del Paso 7 no se cumple, el SRS **no puede avanzar** a `en_especificacion`. El analista debe completar o corregir los artefactos faltantes antes de la transición de estado.

---

## 11. Plantilla Operativa: Artefacto de Modelo

Los modelos **no se crean dentro del sistema** (el sistema es una plataforma de gestión, no un editor de diagramas). Los modelos se construyen en herramientas externas (draw.io, Miro, Lucidchart, PlantUML, etc.) y se **adjuntan al SRS como artefactos referenciados por URL**.

| Campo | Tipo | Descripción | Obligatorio |
|---|---|---|---|
| `id` | `string` (UUID v4) | Identificador único del artefacto de modelo | **Sí** |
| `srsId` | `string` (UUID v4) | ID del SRS al que pertenece este artefacto | **Sí** |
| `tipo` | `enum` | `contexto` / `casos_uso` / `secuencia` / `clases` / `actividad` / `estado` | **Sí** |
| `titulo` | `string` | Nombre descriptivo del modelo. Ej: "Diagrama de contexto - Sistema de Gestión de Obras" | **Sí** |
| `descripcion` | `string` | Qué representa este modelo: qué perspectiva cubre y qué entidades/procesos muestra | **Sí** |
| `archivoUrl` | `string` (URL) | URL del diagrama en Drive / Storage / Miro / etc. Debe ser accesible para el equipo | **Sí** |
| `herramienta` | `string` | Herramienta usada: `draw.io`, `Miro`, `Lucidchart`, `PlantUML`, `otro` | No |
| `version` | `number` | Número de revisión del diagrama (inicia en 1, incrementa con cada modificación) | **Sí** |
| `requerimientosVinculados` | `string[]` | IDs de RF y/o RNF del SRS que este modelo ilustra o detalla | No |
| `revisadoPorStakeholder` | `boolean` | `true` si el cliente o stakeholder relevante revisó y aprobó este modelo | **Sí** |
| `fechaRevision` | `Date` | Fecha en que fue revisado por el stakeholder | No |
| `observaciones` | `string` | Notas de la revisión: acuerdos, cambios solicitados, pendientes | No |
| `creadoEn` | `Date` | Timestamp de creación del registro en el sistema | **Sí** (automático) |
| `actualizadoEn` | `Date` | Timestamp de última modificación | **Sí** (automático) |

### Notas de implementación

- El campo `archivoUrl` es el **vínculo entre el sistema y el diagrama externo**. El sistema no almacena el diagrama, solo la referencia.
- Cuando el diagrama se actualiza en la herramienta externa, se debe incrementar `version` en el sistema para mantener la trazabilidad.
- El campo `revisadoPorStakeholder` es el gate para el criterio de avance del Paso 7.
- Se puede tener **múltiples artefactos del mismo tipo** en un SRS (ej: un diagrama de secuencia por cada RF crítico).

---

## 12. Tabla de Conexiones con los 3 Módulos

| Modelo / Concepto | Módulo | Campo o proceso específico |
|---|---|---|
| Diagrama de contexto — actores externos | M1 | Entidades (Clientes/Proveedores) que son sistemas externos del contexto |
| Diagrama de contexto — límite del sistema | M2 | Alcance del Proyecto (campo `alcance` en configuración del Proyecto) |
| Diagrama de contexto — actores humanos | M3 | Stakeholders del SRS (referenciados desde M3-01) |
| Diagrama de casos de uso — actores | M1 | Roles de las entidades (Cliente, Proveedor) que interactúan con el sistema |
| Diagrama de casos de uso — CU | M3 | RF candidatos: cada CU principal corresponde a uno o más RF del SRS |
| Diagrama de secuencia — objetos del sistema | M2 | Módulos del sistema (M1, M2, M3) que aparecen como objetos en la secuencia |
| Diagrama de clases del dominio — entidades | M1 | Glosario de dominio: cada clase del dominio tiene entrada en el glosario |
| Diagrama de clases del dominio — atributos | M3 | Tipos de datos del SRS: los atributos del dominio alimentan los tipos del sistema (`src/types/index.ts`) |
| Diagrama de estado — `EstadoSRS` | M3 | Ciclo de vida del SRS definido en M3-01 Sección 10 |
| Diagrama de estado — `EstadoRequerimiento` | M3 | Ciclo de vida del Requerimiento definido en M3-01 Sección 10 |
| Diagrama de estado — `EstadoProyecto` | M2 | Ciclo de vida del Proyecto definido en M2-04 |
| Diagrama de estado — `EstadoEntidad` | M1 | Ciclo de vida de Entidad (Cliente/Proveedor) definido en M1 |
| Artefacto de modelo (`archivoUrl`) | M3 | Almacenado como documento adjunto al SRS en el Módulo 3 |
| Artefacto de modelo (`srsId`) | M3 | FK al SRS del Módulo 3 al que pertenece el artefacto |
| Criterio de avance Paso 7 | M3 | Precondición para la transición de estado `en_modelado` → `en_especificacion` |

---

## 13. Checklist de Completitud

Todos los ítems del Capítulo 5 aplicables al sistema han sido extraídos y documentados.

### Marco teórico (Sección 3)
- [x] Definición formal de modelado de sistemas (p. 119) — texto exacto
- [x] Distinción entre abstracción y representación alternativa (p. 119) — texto exacto
- [x] Los 3 usos de los modelos en el proceso de IS (p. 119)
- [x] Las 4 perspectivas de modelado con definiciones exactas (p. 120) — texto exacto
- [x] Los 5 tipos de diagrama UML esenciales según estudio 2007 (p. 120)
- [x] UML como notación estándar: origen, versión 2004 (p. 121)
- [x] Los 3 niveles de uso de modelos gráficos (informal / documentación / generación de código)
- [x] Criterios para nivel de formalidad del modelo

### Modelos de contexto (Sección 4)
- [x] Definición y propósito del modelo de contexto (p. 121) — texto exacto
- [x] Limitación: no muestra tipos de relaciones (p. 122) — texto exacto
- [x] El problema político/organizacional de definir fronteras (p. 122) — texto exacto
- [x] Diagrama de bloques arquitectónico como primer paso
- [x] Modelos de proceso empresarial: propósito y relación con el contexto (p. 122)
- [x] Diagrama de actividad UML: definición y elementos notacionales completos (p. 123)

### Modelos de interacción (Sección 5)
- [x] Introducción a los 2 enfoques de interacción (p. 124) — texto exacto
- [x] Definición de caso de uso (p. 124) — texto exacto
- [x] Elementos del diagrama de CU: elipse, figura humana, líneas, flechas (p. 124-125)
- [x] Formalidad de las flechas vs. uso informal (p. 125) — texto exacto
- [x] Descripción tabular del caso de uso: campos estándar (p. 125)
- [x] Organización en múltiples diagramas para sistemas grandes (p. 125)
- [x] Limitaciones del diagrama de CU (implícito en p. 124-126)
- [x] Definición de diagrama de secuencia (p. 126) — texto exacto
- [x] Elementos del diagrama de secuencia: línea de vida, barra de activación, mensajes, alternativas (p. 126)
- [x] Lectura del diagrama: de arriba abajo (p. 126) — texto exacto
- [x] Nivel de detalle recomendado para IR vs. generación de código (p. 128) — texto exacto

### Modelos estructurales (Sección 6)
- [x] Definición de modelos estructurales (p. 129) — texto exacto
- [x] Distinción modelos estáticos vs. dinámicos (p. 129)
- [x] Diagramas de clase en IR vs. diseño (p. 129) — texto exacto
- [x] Análisis de requerimientos orientado a objetos: recuadro OORA (p. 129) — texto exacto
- [x] Estructura de una clase UML: 3 secciones (p. 131)
- [x] Multiplicidad en asociaciones: notación y significados (p. 130)
- [x] Cuatro tipos de relaciones: asociación, generalización, agregación, composición
- [x] Definición de generalización (p. 131-132) — texto exacto
- [x] Generalización en UML: flecha hacia la superclase (p. 132)
- [x] Herencia de atributos y operaciones en la jerarquía (p. 132)
- [x] Criterios generalización vs. composición
- [x] Definición de agregación (p. 133) — texto exacto
- [x] Diferencia agregación vs. composición: rombo hueco vs. relleno

### Modelos de comportamiento (Sección 7)
- [x] Definición de modelos de comportamiento (p. 133) — texto exacto
- [x] Los 2 tipos de estímulos: datos y eventos (p. 133)
- [x] Definición de modelos dirigidos por datos (p. 134) — texto exacto
- [x] DFD: definición, historia (DeMarco 1978), ventajas e intuitivo (p. 134)
- [x] Limitación: UML no soporta DFD nativamente (p. 134)
- [x] Diagramas de actividad como sustituto de DFD en UML 2.0 (p. 134)
- [x] Criterios de elección: diagramas de actividad vs. DFD
- [x] Swimlanes como extensión de diagramas de actividad
- [x] Definición de modelado dirigido por eventos (p. 135) — texto exacto
- [x] Diagramas de estado UML: fundamento en Harel (1987, 1988) (p. 135)
- [x] Elementos del diagrama de estado: estados, transiciones, acciones, estímulos (p. 136-137)
- [x] Superestados para gestionar complejidad en sistemas grandes (p. 138)
- [x] Criterios para usar diagramas de estado

### MDE (Sección 8)
- [x] Definición de MDE (p. 138) — texto exacto
- [x] Relación MDE / MDA: MDA como subconjunto de MDE (p. 138-139)
- [x] Los 3 tipos de modelo MDA: CIM, PIM, PSM (p. 140) — definiciones exactas
- [x] Ventajas del MDE según el libro (p. 139)
- [x] Críticas y limitaciones del MDE (p. 139-141)
- [x] UML Ejecutable (xUML): 3 tipos de modelo (p. 142)
- [x] Estado de adopción al momento de la publicación (p. 139)

### Artefactos operativos
- [x] Tabla Maestra de Modelos con 6 tipos de modelo (Sección 9)
- [x] Criterios por tipo de proyecto: nuevo_desarrollo, mantenimiento, migracion, integracion, consultoria (Sección 9)
- [x] Proceso operativo: 7 pasos con descripción de actividades y resultados (Sección 10)
- [x] Criterio verificable de avance a `en_especificacion`: 6 condiciones verificables (Paso 7)
- [x] Plantilla de artefacto: 14 campos con tipos, descripción y obligatoriedad (Sección 11)
- [x] Nota explícita: los modelos no se crean en el sistema, se adjuntan como URLs (Sección 11)
- [x] Tabla de conexiones con los 3 módulos: 14 conexiones mapeadas (Sección 12)
