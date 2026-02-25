# 01-modelos-proceso-software.md

---

## Metadatos

| Campo            | Valor                                                                 |
|------------------|-----------------------------------------------------------------------|
| **Archivo**      | `01-modelos-proceso-software.md`                                      |
| **Módulo**       | Capa 0 — Fundamentos Teóricos                                         |
| **Capítulo fuente** | Capítulo 2: Procesos de software — Sommerville, Ian. *Ingeniería de Software*, 9.ª ed., Pearson, 2011 |
| **Versión**      | 1.0.0                                                                 |
| **Fecha**        | 2026-02-24                                                            |
| **Estado**       | ✅ Completo — revisado contra texto fuente                            |

---

## Objetivo del Documento

Este documento extrae y aplica los conceptos del **Capítulo 2** de Sommerville (2011) directamente al sistema de gestión compuesto por tres módulos: Registro de Clientes y Proveedores (Módulo 1), Registro y Configuración de Proyectos (Módulo 2) y Documentación de Objetivos y Alcance/SRS (Módulo 3).

**Cubre:**
- Los tres modelos de proceso genéricos (§2.1) que justifican la arquitectura del proceso adoptado.
- Las cuatro actividades fundamentales del proceso (§2.2) que estructuran el flujo de trabajo interno de cada módulo.
- Las estrategias para enfrentar el cambio (§2.3) que dan sustento al prototipado en el Módulo 3 y a la estrategia de entrega incremental que se configura en el Módulo 2.
- El Proceso Unificado Racional —RUP— (§2.4) cuyas cuatro fases constituyen la estructura de fases adoptada en el Módulo 2 para la configuración de proyectos.

**No cubre:** contenidos de capítulos distintos al 2. Cualquier referencia a ágil, CMMI u otros marcos se omite por ser materia de otros archivos de la Capa 0.

---

## 3. Los 3 Modelos de Proceso de Software (Cap. 2 §2.1)

> *"Un modelo de proceso de software es una representación simplificada de este proceso. Cada modelo del proceso representa a otro desde una particular perspectiva y, por lo tanto, ofrece sólo información parcial acerca de dicho proceso."*
> (Cap. 2 §2.1, p. 29)

Los tres modelos genéricos que examina Sommerville son:

1. **El modelo en cascada (waterfall)**
2. **Desarrollo incremental**
3. **Ingeniería de software orientada a la reutilización**

> *"Dichos modelos no son mutuamente excluyentes y con frecuencia se usan en conjunto, sobre todo para el desarrollo de grandes sistemas."* (Cap. 2 §2.1, p. 30)

---

### 3.1 Modelo en Cascada (Waterfall) — Cap. 2 §2.1.1, pp. 30–32

**Definición exacta:**

> *"El modelo en cascada es un ejemplo de un proceso dirigido por un plan —en principio, usted debe planear y programar todas las actividades del proceso, antes de comenzar a trabajar con ellas."* (Cap. 2 §2.1.1, p. 30)

#### Las 5 fases del modelo en cascada

Las etapas reflejan directamente las actividades fundamentales del desarrollo (Cap. 2 §2.1.1, p. 31):

| # | Fase | Definición (texto del libro) |
|---|------|------------------------------|
| 1 | **Análisis y definición de requerimientos** | *"Los servicios, las restricciones y las metas del sistema se establecen mediante consulta a los usuarios del sistema. Luego, se definen con detalle y sirven como una especificación del sistema."* |
| 2 | **Diseño del sistema y del software** | *"El proceso de diseño de sistemas asigna los requerimientos, para sistemas de hardware o de software, al establecer una arquitectura de sistema global. El diseño del software implica identificar y describir las abstracciones fundamentales del sistema de software y sus relaciones."* |
| 3 | **Implementación y prueba de unidad** | *"Durante esta etapa, el diseño de software se realiza como un conjunto de programas o unidades del programa. La prueba de unidad consiste en verificar que cada unidad cumpla con su especificación."* |
| 4 | **Integración y prueba de sistema** | *"Las unidades del programa o los programas individuales se integran y prueban como un sistema completo para asegurarse de que se cumplan los requerimientos de software. Después de probarlo, se libera el sistema de software al cliente."* |
| 5 | **Operación y mantenimiento** | *"Por lo general —aunque no necesariamente—, ésta es la fase más larga del ciclo de vida, donde el sistema se instala y se pone en práctica. El mantenimiento incluye corregir los errores que no se detectaron en etapas anteriores del ciclo de vida, mejorar la implementación de las unidades del sistema e incrementar los servicios del sistema conforme se descubren nuevos requerimientos."* |

#### Cuándo usarlo (contexto ideal)

> *"En principio, el modelo en cascada sólo debe usarse cuando los requerimientos se entiendan bien y sea improbable el cambio radical durante el desarrollo del sistema."* (Cap. 2 §2.1.1, p. 32)

#### Ventajas según Sommerville

- Produce documentación en cada fase, lo que hace que *"el proceso sea visible, de modo que los administradores monitoricen el progreso contra el plan de desarrollo."* (p. 32)
- Es consecuente con otros modelos del proceso de ingeniería, lo que facilita el uso de un modelo de gestión común durante todo el proyecto. (p. 32)

#### Desventajas / Limitaciones principales

> *"Su principal problema es la partición inflexible del proyecto en distintas etapas. Tienen que establecerse compromisos en una etapa temprana del proceso, lo que dificulta responder a los requerimientos cambiantes del cliente."* (Cap. 2 §2.1.1, p. 32)

- El freno prematuro de los requerimientos *"quizás signifique que el sistema no hará lo que el usuario desea."* (p. 31)
- Puede conducir a *"sistemas mal estructurados conforme los problemas de diseño se evadan con la implementación de trucos."* (p. 31)

> **Aplicación en el sistema:** El Módulo 1 (Registro de Clientes y Proveedores) es el candidato natural a un proceso tipo cascada dentro del sistema, porque sus entidades y reglas de negocio (campos obligatorios, validaciones, tipos de cliente/proveedor) pueden definirse completamente antes de construir. El Módulo 3 (SRS), en cambio, requiere iteración y NO debe usarse cascada pura.

---

### 3.2 Desarrollo Incremental — Cap. 2 §2.1.2, pp. 32–34

**Definición exacta:**

> *"El desarrollo incremental se basa en la idea de diseñar una implementación inicial, exponer ésta al comentario del usuario, y luego desarrollarla en sus diversas versiones hasta producir un sistema adecuado. Las actividades de especificación, desarrollo y validación están entrelazadas en vez de separadas, con rápida retroalimentación a través de las actividades."* (Cap. 2 §2.1.2, p. 32–33)

#### Concepto de incremento

> *"Cada incremento o versión del sistema incorpora algunas de las funciones que necesita el cliente. Por lo general, los primeros incrementos del sistema incluyen la función más importante o la más urgente."* (p. 33)

#### Ventajas sobre el modelo en cascada

Sommerville enumera tres beneficios importantes (Cap. 2 §2.1.2, p. 33):

1. *"Se reduce el costo de adaptar los requerimientos cambiantes del cliente. La cantidad de análisis y la documentación que tiene que reelaborarse son mucho menores de lo requerido con el modelo en cascada."*
2. *"Es más sencillo obtener retroalimentación del cliente sobre el trabajo de desarrollo que se realizó. Los clientes pueden comentar las demostraciones del software y darse cuenta de cuánto se ha implementado."*
3. *"Es posible que sea más rápida la entrega e implementación de software útil al cliente —aun si no se ha incluido toda la funcionalidad. Los clientes tienen posibilidad de usar y ganar valor del software más temprano de lo que sería posible con un proceso en cascada."*

#### Desventajas: degradación de la estructura

Desde una perspectiva administrativa existen dos problemas (Cap. 2 §2.1.2, p. 34):

1. *"El proceso no es visible. Los administradores necesitan entregas regulares para medir el avance. Si los sistemas se desarrollan rápidamente, resulta poco efectivo en términos de costos producir documentos que reflejen cada versión del sistema."*
2. *"La estructura del sistema tiende a degradarse conforme se tienen nuevos incrementos. A menos que se gaste tiempo y dinero en la refactorización para mejorar el software, el cambio regular tiende a corromper su estructura. La incorporación de más cambios de software se vuelve cada vez más difícil y costosa."*

#### Diferencia entre desarrollo incremental y entrega incremental

- **Desarrollo incremental:** El sistema se desarrolla por versiones y puede mostrarse al cliente sin desplegarlo en el entorno operacional real.
- **Entrega incremental:** *"La entrega y la implementación incrementales significan que el software se usa en procesos operacionales reales."* (p. 34) — Esta distinción se amplía en §2.3.2.

> **Aplicación en el sistema:** El Módulo 2 (Configuración de Proyectos) aplica desarrollo incremental, ya que los tipos de proyecto, plantillas y configuraciones evolucionan con la retroalimentación del cliente. Cada incremento agrega funcionalidad (ej.: primero proyectos simples, luego proyectos con fases y dependencias).

---

### 3.3 Ingeniería de Software Orientada a la Reutilización — Cap. 2 §2.1.3, pp. 35–36

**Definición exacta:**

> *"Este enfoque se basa en la existencia de un número significativo de componentes reutilizables. El proceso de desarrollo del sistema se enfoca en la integración de estos componentes en un sistema, en vez de desarrollarlo desde cero."* (Cap. 2 §2.1, p. 30)

#### Los 3 tipos de componentes reutilizables (Cap. 2 §2.1.3, pp. 35–36)

De acuerdo con el capítulo 16 referenciado desde §2.1.3, los tres tipos son:

| Tipo | Descripción |
|------|-------------|
| **Reutilización del sistema de aplicación** | Todo un sistema de aplicación puede reutilizarse al incorporarlo sin cambios en otros sistemas o al configurar la aplicación para diferentes clientes. |
| **Reutilización de componentes** | Los componentes de una aplicación, que varían en tamaño desde subsistemas hasta objetos individuales, pueden reutilizarse. |
| **Reutilización de objetos y funciones** | Componentes de software que implementan una sola función (función matemática, clase de objeto). Esta forma de reutilización en torno a librerías estándar ha sido común durante los últimos 40 años. |

#### Etapas del proceso (Cap. 2 §2.1.3, pp. 35–36)

Las etapas intermedias del proceso orientado a la reutilización son:

1. **Análisis de componentes** — *"Dada la especificación de requerimientos, se realiza una búsqueda de componentes para implementar dicha especificación. Por lo general, no hay coincidencia exacta y los componentes que se usan proporcionan sólo parte de la funcionalidad requerida."*
2. **Modificación de requerimientos** — *"Durante esta etapa se analizan los requerimientos usando información de los componentes descubiertos. Luego se modifican para reflejar los componentes disponibles. Donde las modificaciones son imposibles, puede regresarse a la actividad de análisis de componentes para buscar soluciones alternativas."*
3. **Diseño de sistema con reutilización** — *"Durante esta fase se diseña el marco conceptual del sistema o se reutiliza un marco conceptual existente. Los creadores toman en cuenta los componentes que se reutilizan y organizan el marco de referencia para atenderlo."*
4. **Desarrollo e integración** — *"Se diseña el software que no puede procurarse de manera externa, y se integran los componentes y los sistemas COTS para crear el nuevo sistema."*

#### Cuándo aplica en proyectos reales

Aplica cuando existe una base de componentes reutilizables (librerías, SDKs, sistemas COTS, frameworks). Se ha convertido en la norma del nuevo desarrollo empresarial desde el año 2000, especialmente en stacks como Firebase, Next.js y librerías de UI.

> **Aplicación en el sistema:** Los tres módulos reutilizan componentes del stack (Firebase Auth, Firestore, componentes UI de Next.js/Tailwind). El diseño de la plataforma reconoce explícitamente este modelo: primero se evalúa qué existe (análisis de componentes) y luego se adaptan los requerimientos a lo disponible, evitando desarrollo desde cero.

---

### 3.4 Tabla Comparativa de los 3 Modelos

| Modelo | Mejor para | Riesgo principal | Entregable clave |
|--------|-----------|-----------------|-----------------|
| **Cascada** | Requerimientos bien definidos, estables y documentables desde el inicio; sistemas con equipos distribuidos o regulación contractual | Cambio de requerimientos congela etapas anteriores; costoso de iterar | Documento de especificación aprobado por fase |
| **Incremental** | Sistemas empresariales con requerimientos cambiantes; equipos pequeños con acceso frecuente al cliente | Degradación de la arquitectura sin refactorización; baja visibilidad para la gestión | Versión funcional del sistema por cada incremento |
| **Orientado a reutilización** | Proyectos donde existen componentes COTS o librerías maduras aplicables; reducción de tiempo de entrega es prioritaria | Dependencia de terceros; funcionalidad limitada por los componentes disponibles | Sistema integrado a partir de componentes evaluados |

---

## 4. Actividades del Proceso de Software (Cap. 2 §2.2)

> *"Existen muchos diferentes procesos de software, pero todos deben incluir cuatro actividades que son fundamentales para la ingeniería de software."* (Cap. 2, p. 28)

---

### 4.1 Especificación del Software — Cap. 2 §2.2, p. 28 y §2.2.1

**Definición exacta:**

> *"Especificación del software — Tienen que definirse tanto la funcionalidad del software como las restricciones de su operación."* (Cap. 2, p. 28)

La especificación incluye las siguientes subactividades (Cap. 2 §2.2.1):

- **Estudio de factibilidad:** Determina si el sistema propuesto es viable técnica y financieramente. Produce un informe que recomienda si el desarrollo debe continuar.
- **Adquisición y análisis de requerimientos:** Proceso de derivar los requerimientos del sistema mediante observación de sistemas existentes, discusión con los usuarios, análisis de tareas, etc.
- **Especificación de requerimientos:** Actividad de traducir la información recabada en un documento que define un conjunto de requerimientos.
- **Validación de requerimientos:** Verifica que los requerimientos sean realistas, consistentes y completos.

> **Aplicación en el sistema:** La actividad de Especificación es el núcleo completo del **Módulo 3 (SRS)**. Cada campo del documento de objetivos y alcance corresponde a una subactividad: el estudio de factibilidad se llena en la sección de viabilidad; la adquisición y análisis produce las entrevistas y actas capturadas; la especificación genera el cuerpo del SRS; y la validación se refleja en el gate de aprobación del documento.

---

### 4.2 Diseño e Implementación — Cap. 2 §2.2, p. 28 y §2.2.2

**Definición exacta:**

> *"Diseño e implementación del software — Debe desarrollarse el software para cumplir con las especificaciones."* (Cap. 2, p. 28)

Sommerville identifica cuatro actividades del diseño (Cap. 2 §2.2.2):

| Actividad de diseño | Descripción |
|--------------------|-------------|
| **Diseño arquitectónico** | Se identifican la estructura general del sistema, los componentes principales (subsistemas o módulos), sus relaciones y cómo se distribuye su implementación. |
| **Diseño de interfaz** | Se definen las interfaces entre los componentes del sistema; una especificación de interfaz no ambigua permite desarrollar los componentes en paralelo. |
| **Diseño de componentes** | Se toma cada componente del sistema y se diseña su funcionamiento; puede ser un diseño simple de los servicios que se proveerán. |
| **Diseño de base de datos** | Se diseñan las estructuras de datos del sistema y su representación en una base de datos. |

> **Aplicación en el sistema:** Esta actividad es la referencia para la **Fase 4 del Módulo 2** (arquitectura preliminar del proyecto). Cuando en el Módulo 2 se configura un proyecto, el equipo define la arquitectura de componentes, las interfaces entre módulos y el modelo de datos que regirá el sistema a desarrollar.

---

### 4.3 Validación del Software — Cap. 2 §2.2, p. 28 y §2.2.3

**Definición exacta:**

> *"Validación del software — Hay que validar el software para asegurarse de que cumple lo que el cliente quiere."* (Cap. 2, p. 28)

#### Verificación y Validación (V&V)

La validación del software implica el proceso de **Verificación y Validación (V&V)**:

- **Verificación:** ¿Estamos construyendo el producto correctamente? — Comprueba que el software cumpla su especificación.
- **Validación:** ¿Estamos construyendo el producto correcto? — Comprueba que el software satisfaga las expectativas reales del cliente.

#### Etapas de las pruebas (Cap. 2 §2.2.3)

1. **Pruebas de componente (prueba de unidad):** Prueba de los componentes individuales del sistema; cada componente se prueba de manera independiente.
2. **Pruebas de sistema:** Prueba del sistema como un todo; se pone especial atención a las interacciones entre los componentes del sistema.
3. **Pruebas de aceptación:** Prueba con datos del cliente para verificar que el sistema satisface las necesidades del cliente; puede revelar errores y omisiones en la definición de requerimientos del sistema.

> **Aplicación en el sistema:** V&V justifica los **Gates de aprobación presentes en los 3 módulos**. El gate del Módulo 1 verifica que el registro de clientes/proveedores cumpla reglas de negocio (verificación). El gate del Módulo 3 valida que el SRS generado satisfaga las expectativas del cliente (validación). Las pruebas de aceptación son el mecanismo formal antes de aprobar el cierre de cada módulo.

---

### 4.4 Evolución del Software — Cap. 2 §2.2, p. 28

**Definición exacta:**

> *"Evolución del software — El software tiene que evolucionar para satisfacer las necesidades cambiantes del cliente."* (Cap. 2, p. 28)

Sommerville describe que el software, una vez en producción, enfrenta errores descubiertos, cambios en el entorno y nuevas necesidades:

> *"Durante la fase final del ciclo de vida —operación y mantenimiento—, el software se pone en servicio. Se descubren los errores y las omisiones en los requerimientos originales del software. Surgen los errores de programa y diseño, y se detecta la necesidad de nueva funcionalidad. Por lo tanto, el sistema debe evolucionar para mantenerse útil."* (Cap. 2 §2.1.1, p. 31)

> *"La evolución del software tiene lugar cuando cambian los sistemas de software existentes para satisfacer nuevos requerimientos. Los cambios son continuos y el software debe evolucionar para seguir siendo útil."* (Cap. 2 — Puntos clave, p. 53)

> **Aplicación en el sistema:** Este concepto justifica el **sistema de control de cambios del Módulo 3**. El SRS no es un documento estático; cuando un proyecto evoluciona, los objetivos y alcances registrados en el Módulo 3 deben versionarse y actualizarse formalmente. El control de versiones del SRS es la implementación directa de este principio de evolución continua.

---

## 5. Cómo Enfrentar el Cambio (Cap. 2 §2.3)

> *"Los procesos deben incluir actividades para lidiar con el cambio. Esto puede implicar una fase de creación de prototipos que ayude a evitar malas decisiones sobre los requerimientos y el diseño."* (Cap. 2 — Puntos clave, p. 53)

---

### 5.1 Prototipado del Sistema — Cap. 2 §2.3.1, pp. 44–47

**Definición de prototipo según el libro:**

> *"Un prototipo es una versión inicial de un sistema de software que se usa para demostrar conceptos, probar opciones de diseño y encontrar más sobre el problema y sus posibles soluciones."* (Cap. 2 §2.3.1, implícito en el proceso descrito, p. 44)

Sommerville identifica que la creación de prototipos es adecuada para:
- Desarrollar un sistema para un prototipo de la interfaz del usuario.
- Validar los requerimientos funcionales del sistema.
- Demostrar a los administradores la factibilidad de la aplicación.

#### Proceso de desarrollo del prototipo (Cap. 2 §2.3.1, Fig. 2.9, p. 45)

Los pasos del proceso son:

1. **Establecimiento de objetivos del prototipo** → *Plan de creación del prototipo*: Los objetivos deben ser explícitos desde el inicio. ¿Para qué sirve este prototipo: interfaz, validación de requerimientos, demostración de factibilidad?
2. **Definición de la funcionalidad del prototipo** → *Bosquejo de definición*: Decidir qué incluir y —más importante— qué dejar fuera para reducir costos y acelerar la entrega.
3. **Desarrollo del prototipo** → *Prototipo ejecutable*: Construcción del prototipo. Los requerimientos no funcionales (rendimiento, seguridad) pueden relajarse; el manejo de errores puede omitirse si no es el objetivo.
4. **Evaluación del prototipo** → *Reporte de evaluación*: Requiere tiempo de capacitación del usuario. Los usuarios deben usar el sistema de manera normal para descubrir errores y omisiones.

#### Prototipo desechable vs. evolutivo

| Dimensión | Prototipo desechable | Prototipo evolutivo |
|-----------|---------------------|---------------------|
| **Propósito** | Explorar requerimientos o probar un concepto específico; se descarta después de la evaluación | Evoluciona continuamente para convertirse en el sistema final |
| **Calidad del código** | Baja deliberadamente; estándares relajados | Debe mantenerse alta para sostenerse a largo plazo |
| **Documentación** | Mínima o ninguna | Debe documentarse como el sistema real |
| **Uso posterior** | Se descarta; los aprendizajes se integran en el sistema final | Se convierte en el sistema de producción |

Sommerville advierte explícitamente sobre el riesgo de usar prototipos desechables como sistemas de producción (p. 47):
> *"Puede ser imposible corregir el prototipo para cubrir requerimientos no funcionales, como los requerimientos de rendimiento, seguridad, robustez y fiabilidad, ignorados durante el desarrollo del prototipo."*
> *"El cambio rápido durante el desarrollo significa claramente que el prototipo no está documentado. La única especificación de diseño es el código del prototipo."*
> *"Probablemente los cambios realizados durante el desarrollo de prototipos degradarán la estructura del sistema, y este último será difícil y costoso de mantener."*

#### Beneficios del prototipado en la reducción del riesgo

- Reduce el riesgo de malentender requerimientos antes de comprometer recursos de desarrollo completo.
- Permite a los usuarios ver y opinar sobre la interfaz antes de que esté codificada en el sistema final.
- Detecta omisiones y contradicciones en los requerimientos de manera temprana y económica.
- Es la única forma sensible para desarrollar interfaces de usuario gráficas.

#### Limitaciones del prototipado (Cap. 2 §2.3.1, p. 46–47)

- El prototipo quizás no se utilice en la misma forma que el sistema final; el evaluador puede no ser un usuario típico.
- Si el prototipo es lento, los evaluadores ajustan su comportamiento, lo que produce retroalimentación sesgada.
- Los administradores pueden presionar para entregar prototipos desechables como versiones de producción.

> **Aplicación en el sistema:** El prototipado es la base de la **Fase 3 del Módulo 3** (prototipado y validación temprana del SRS). Antes de formalizar el documento de objetivos y alcance, se construye un prototipo desechable de las pantallas clave del sistema a documentar. Esto permite al cliente validar el alcance antes de comprometerse con un SRS firmado. El reporte de evaluación del prototipo se convierte en insumo directo para la sección de requerimientos del Módulo 3.

---

### 5.2 Entrega Incremental — Cap. 2 §2.3.2, pp. 47–49

**Definición exacta:**

> *"La entrega incremental es un enfoque al desarrollo de software donde algunos de los incrementos diseñados se entregan al cliente y se implementan para usarse en un entorno operacional."* (Cap. 2 §2.3.2, p. 47)

#### Diferencia entre entrega incremental y desarrollo incremental

- **Desarrollo incremental (§2.1.2):** El sistema se desarrolla por versiones y puede mostrarse al cliente; no necesariamente se despliega en producción.
- **Entrega incremental (§2.3.2):** Los incrementos **se usan en procesos operacionales reales**. El cliente pone en servicio cada incremento y gana valor real antes de completar todo el sistema.

#### Ventajas para el cliente (Cap. 2 §2.3.2, p. 47–48)

1. *"Los clientes pueden usar los primeros incrementos como prototipos y adquirir experiencia que informe sobre sus requerimientos, para posteriores incrementos del sistema."*
2. *"Los clientes deben esperar hasta la entrega completa del sistema, antes de ganar valor del mismo. El primer incremento cubre sus requerimientos más críticos, de modo que es posible usar inmediatamente el software."*
3. *"El proceso mantiene los beneficios del desarrollo incremental en cuanto a que debe ser relativamente sencillo incorporar cambios al sistema."*
4. *"Puesto que primero se entregan los servicios de mayor prioridad y luego se integran los incrementos, los servicios de sistema más importantes reciben mayores pruebas."*

#### Problemas de la entrega incremental (Cap. 2 §2.3.2, p. 48)

1. *"La mayoría de los sistemas requieren de una serie de recursos que se utilizan para diferentes partes del sistema. Dado que los requerimientos no están definidos con detalle sino hasta que se implementa un incremento, resulta difícil identificar recursos comunes que necesiten todos los incrementos."*
2. *"El desarrollo iterativo resulta complicado cuando se diseña un sistema de reemplazo. Los usuarios requieren de toda la funcionalidad del sistema antiguo, ya que es común que no deseen experimentar con un nuevo sistema incompleto."*
3. *"La esencia de los procesos iterativos es que la especificación se desarrolla en conjunto con el software. Sin embargo, esto se puede contradecir con el modelo de adquisiciones de muchas organizaciones, donde la especificación completa del sistema es parte del contrato de desarrollo del sistema."*

#### Cuándo NO es apropiada la entrega incremental (Cap. 2 §2.3.2, p. 48–49)

- Sistemas muy grandes donde el desarrollo incluye equipos en diferentes ubicaciones.
- Sistemas embebidos donde el software depende del desarrollo de hardware.
- Sistemas críticos donde todos los requerimientos deben analizarse para comprobar interacciones que comprometan la seguridad.

> **Aplicación en el sistema:** La entrega incremental justifica la **estrategia de entrega definida en la Fase 6 del Módulo 3**. El SRS de un proyecto puede entregarse incrementalmente: primero el alcance funcional de alto nivel, luego los requerimientos detallados por módulo. Cada entrega es operable para el cliente (puede aprobarla, firmarla y usarla), lo que reduce el riesgo de que el documento completo sea rechazado al final.

---

## 6. El Proceso Unificado Racional — RUP (Cap. 2 §2.4, pp. 50–52)

**Definición:**

> *"El Proceso Unificado Racional (RUP, por las siglas de Rational Unified Process) [...] es un buen ejemplo de un modelo de proceso híbrido. Conjunta elementos de todos los modelos de proceso genéricos (sección 2.1), ilustra la buena práctica en especificación y diseño (sección 2.2), y apoya la creación de prototipos y entrega incremental (sección 2.3)."* (Cap. 2 §2.4, p. 50)

El RUP se describe desde tres perspectivas (Cap. 2 §2.4, p. 51):
1. **Perspectiva dinámica:** muestra las fases del modelo a través del tiempo.
2. **Perspectiva estática:** presenta las actividades del proceso que se establecen (flujos de trabajo).
3. **Perspectiva práctica:** sugiere buenas prácticas a usar durante el proceso.

---

### 6.1 Las 4 Fases del RUP con sus Hitos — Cap. 2 §2.4, pp. 50–52

> *"El RUP es un modelo en fases que identifica cuatro fases discretas en el proceso de software. Sin embargo, a diferencia del modelo en cascada, donde las fases se igualan con actividades del proceso, las fases en el RUP están más estrechamente vinculadas con la empresa que con las preocupaciones técnicas."* (Cap. 2 §2.4, p. 50)

#### Fase 1: Concepción (Inception)

- **Objetivo:** *"La meta de la fase de concepción es establecer un caso empresarial para el sistema."* (p. 50–51)
- **Actividades:** Identificar todas las entidades externas (personas y sistemas) que interactuarán con el sistema; definir dichas interacciones; valorar la aportación del sistema hacia la empresa.
- **Hito de salida:** Si la aportación del sistema es menor, *"el proyecto puede cancelarse después de esta fase."* Caso contrario: caso empresarial aprobado.

#### Fase 2: Elaboración (Elaboration)

- **Objetivo:** *"Las metas de la fase de elaboración consisten en desarrollar la comprensión del problema de dominio, establecer un marco conceptual arquitectónico para el sistema, diseñar el plan del proyecto e identificar los riesgos clave del proyecto."* (p. 51)
- **Actividades:** Construir modelo de requerimientos (casos de uso UML), descripción arquitectónica, plan de desarrollo.
- **Hito de salida:** *"Al completar esta fase, debe tenerse un modelo de requerimientos para el sistema, que podría ser una serie de casos de uso del UML, una descripción arquitectónica y un plan de desarrollo para el software."*

#### Fase 3: Construcción (Construction)

- **Objetivo:** Desarrollar el sistema completo.
- **Actividades:** *"La fase de construcción incluye diseño, programación y pruebas del sistema. Partes del sistema se desarrollan en paralelo y se integran durante esta fase."* (p. 51)
- **Hito de salida:** *"Al completar ésta, debe tenerse un sistema de software funcionando y la documentación relacionada y lista para entregarse al usuario."*

#### Fase 4: Transición (Transition)

- **Objetivo:** Desplegar el sistema en el entorno del usuario.
- **Actividades:** *"La fase final del RUP se interesa por el cambio del sistema desde la comunidad de desarrollo hacia la comunidad de usuarios, y por ponerlo a funcionar en un ambiente real."* (p. 51)
- **Hito de salida:** *"En el complemento de esta fase se debe tener un sistema de software documentado que funcione correctamente en su entorno operacional."*

> *"Esto es algo ignorado en la mayoría de los modelos de proceso de software aunque, en efecto, es una actividad costosa y en ocasiones problemática."* (p. 51)

> **Aplicación en el sistema:** Las 4 fases del RUP son la estructura adoptada directamente en el **Módulo 2 (Registro y Configuración de Proyectos)**. Cada proyecto registrado en el sistema sigue estas fases: Concepción (caso de negocio), Elaboración (arquitectura y requerimientos), Construcción (desarrollo) y Transición (despliegue). Los hitos de salida de cada fase se configuran como gates en el Módulo 2.

---

### 6.2 Los Flujos de Trabajo del RUP — Cap. 2 §2.4, Fig. 2.13, p. 52

> *"La visin estática del RUP se enfoca en las actividades que tienen lugar durante el proceso de desarrollo. Se les llama flujos de trabajo en la descripción RUP. En el proceso se identifican seis flujos de trabajo de proceso centrales y tres flujos de trabajo de apoyo centrales."* (Cap. 2 §2.4, p. 51)

#### Flujos de trabajo de ingeniería (centrales)

| Flujo de trabajo | Descripción (texto del libro) |
|-----------------|-------------------------------|
| **Modelado del negocio** | *"Se modelan los procesos de negocios utilizando casos de uso de la empresa."* |
| **Requerimientos** | *"Se identifican los actores que interactúan con el sistema y se desarrollan casos de uso para modelar los requerimientos del sistema."* |
| **Análisis y diseño** | *"Se crea y documenta un modelo de diseño utilizando modelos arquitectónicos, de componentes, de objetos y de secuencias."* |
| **Implementación** | *"Se implementan y estructuran los componentes del sistema en subsistemas de implementación. La generación automática de código a partir de modelos de diseño ayuda a acelerar este proceso."* |
| **Pruebas** | *"Las pruebas son un proceso iterativo que se realiza en conjunto con la implementación. Las pruebas del sistema siguen al completar la implementación."* |
| **Despliegue** | *"Se crea la liberación de un producto, se distribuye a los usuarios y se instala en su lugar de trabajo."* |

#### Flujos de trabajo de apoyo (centrales)

| Flujo de apoyo | Descripción (texto del libro) |
|---------------|-------------------------------|
| **Administración de la configuración y del cambio** | *"Este flujo de trabajo de apoyo gestiona los cambios al sistema."* |
| **Administración del proyecto** | *"Este flujo de trabajo de apoyo gestiona el desarrollo del sistema."* |
| **Entorno** | *"Este flujo de trabajo pone a disposición del equipo de desarrollo de software, las herramientas adecuadas de software."* |

#### Distribución de flujos en el tiempo

> *"En principio, al menos, todos los flujos de trabajo RUP pueden estar activos en la totalidad de las etapas del proceso. En las fases iniciales del proceso, es probable que se use mayor esfuerzo en los flujos de trabajo como modelado del negocio y requerimientos y, en fases posteriores, en las pruebas y el despliegue."* (Cap. 2 §2.4, p. 52)

---

### 6.3 Las 6 Buenas Prácticas del RUP — Cap. 2 §2.4, p. 52

> *"El enfoque práctico del RUP describe las buenas prácticas de ingeniería de software que se recomiendan para su uso en el desarrollo de sistemas."* (Cap. 2 §2.4, p. 52)

| # | Buena práctica | Descripción (texto del libro) |
|---|---------------|-------------------------------|
| 1 | **Desarrollo de software de manera iterativa** | *"Incrementar el plan del sistema con base en las prioridades del cliente, y desarrollar oportunamente las características del sistema de mayor prioridad en el proceso de desarrollo."* |
| 2 | **Gestión de requerimientos** | *"Documentar de manera explícita los requerimientos del cliente y seguir la huella de los cambios a dichos requerimientos. Analizar el efecto de los cambios sobre el sistema antes de aceptarlos."* |
| 3 | **Usar arquitecturas basadas en componentes** | *"Estructurar la arquitectura del sistema en componentes, como se estudió anteriormente en este capítulo."* |
| 4 | **Software modelado visualmente** | *"Usar modelos UML gráficos para elaborar representaciones de software estáticas y dinámicas."* |
| 5 | **Verificar la calidad del software** | *"Garantizar que el software cumpla con los estándares de calidad de la organización."* |
| 6 | **Controlar los cambios al software** | *"Gestionar los cambios al software con un sistema de administración del cambio, así como con procedimientos y herramientas de administración de la configuración."* |

> **Aplicación en el sistema:** Las 6 buenas prácticas del RUP están mapeadas directamente a los módulos: la práctica #2 (Gestión de requerimientos) es el objetivo central del Módulo 3; la práctica #6 (Control de cambios) justifica el sistema de versiones del SRS; la práctica #1 (Desarrollo iterativo) justifica la estrategia incremental del Módulo 2.

---

## 7. Tabla de Decisión: ¿Qué Metodología Usar?

> Esta tabla está construida a partir de los principios del Capítulo 2 de Sommerville (2011) y está lista para usarse directamente en el **Módulo 2 §4.1** al seleccionar la metodología de un proyecto.

| Criterio | Cascada | Incremental | RUP | Ágil |
|----------|---------|-------------|-----|------|
| **Estabilidad de requerimientos** | Alta — reqs. bien definidos y poco cambiantes | Media — reqs. parcialmente definidos, se refinan por iteración | Media-Alta — reqs. capturados en casos de uso, se gestionan formalmente | Baja — reqs. emergen y cambian durante el desarrollo |
| **Tamaño del equipo** | Mediano a grande — favorece la división formal por fases | Pequeño a mediano — equipos que interactúan frecuentemente | Mediano a grande — roles definidos (arquitecto, analista, tester) | Pequeño — comunicación cara a cara; máximo 10 personas |
| **Criticidad del sistema** | Alta — sistemas críticos con documentación formal requerida por reguladores | Media — sistemas empresariales estándar | Media-Alta — sistemas empresariales con arquitectura documentada | Baja-Media — sistemas donde la entrega rápida prima sobre la seguridad formal |
| **Participación del cliente** | Baja — el cliente aprueba al inicio y al final; poco involucramiento intermedio | Alta — el cliente revisa y aprueba cada incremento | Media — el cliente valida en hitos de fase (concepción, elaboración) | Muy alta — el cliente es parte del equipo o revisiones son constantes |
| **Plazo del proyecto** | Largo y predecible — toda la planificación debe completarse antes de construir | Corto a mediano — valor entregado en ciclos cortos | Mediano — las cuatro fases requieren planificación y tiempo | Corto — iteraciones de 1–4 semanas con entregables frecuentes |

**Regla de selección para el Módulo 2:**
- Si los 5 criterios apuntan a **Cascada** → usar modelo en cascada.
- Si la mayoría apunta a **Incremental/Ágil** → usar desarrollo incremental o metodología ágil.
- Si el proyecto tiene complejidad arquitectónica y equipo mediano-grande → usar **RUP**.
- En proyectos del sistema (plataforma de gestión) con reqs. semi-estables y cliente disponible → **RUP + Incremental** es la combinación recomendada por Sommerville.

---

## 8. Tabla de Conexiones con los 3 Módulos

| Concepto del Cap. 2 | Módulo donde aplica | Fase específica |
|--------------------|--------------------|---------------------------------|
| Modelo en cascada | Módulo 1 | Fase de registro y validación de entidades (clientes/proveedores) |
| Desarrollo incremental | Módulo 2 | Incrementos de funcionalidad de configuración de proyectos |
| Orientado a reutilización | Todos | Selección de componentes del stack (Firebase, Next.js, Tailwind) |
| Especificación del software | Módulo 3 | Núcleo completo del documento SRS |
| Diseño arquitectónico | Módulo 2 | Fase 4 — arquitectura preliminar del proyecto configurado |
| Validación (V&V) | Todos | Gates de aprobación al cierre de cada módulo |
| Evolución del software | Módulo 3 | Sistema de versiones y control de cambios del SRS |
| Prototipado (desechable) | Módulo 3 | Fase 3 — prototipado y validación temprana del SRS |
| Entrega incremental | Módulo 3 | Fase 6 — estrategia de entrega del documento SRS por partes |
| RUP — Concepción | Módulo 2 | Gate 1: aprobación del caso empresarial del proyecto |
| RUP — Elaboración | Módulo 2 | Gate 2: aprobación de arquitectura y requerimientos |
| RUP — Construcción | Módulo 2 | Gate 3: sistema funcionando y documentado |
| RUP — Transición | Módulo 2 | Gate 4: sistema desplegado en entorno operacional |
| BP #2 Gestión de reqs. | Módulo 3 | Control de versiones y trazabilidad del SRS |
| BP #6 Control de cambios | Módulo 3 | Flujo de solicitud y aprobación de cambios al SRS |

---

## 9. Checklist de Completitud

Lista de todos los ítems extraídos del Capítulo 2 de Sommerville (9.ª ed., 2011):

### §2.1 Modelos de proceso de software
- [x] Definición de modelo de proceso de software (p. 29)
- [x] Diferencia entre procesos dirigidos por un plan y procesos ágiles (p. 29)
- [x] Los 3 modelos genéricos enumerados (p. 29–30)

### §2.1.1 Modelo en cascada
- [x] Definición del modelo en cascada (p. 30)
- [x] Las 5 fases con su definición exacta (p. 31)
- [x] Descripción del flujo entre fases y retroalimentación (p. 31)
- [x] Limitaciones: partición inflexible, compromisos tempranos (p. 32)
- [x] Cuándo usarlo: requerimientos bien definidos (p. 32)
- [x] Ventajas: visibilidad, documentación (p. 32)

### §2.1.2 Desarrollo incremental
- [x] Definición del desarrollo incremental (p. 32–33)
- [x] Concepto de incremento y funciones más urgentes primero (p. 33)
- [x] 3 ventajas sobre el modelo en cascada (p. 33)
- [x] 2 desventajas administrativas: visibilidad y degradación (p. 34)
- [x] Distinción entre desarrollo incremental y entrega incremental (p. 34)

### §2.1.3 Ingeniería de software orientada a la reutilización
- [x] Definición del modelo (p. 30, 35)
- [x] 3 tipos de componentes reutilizables (p. 35–36 + Cap. 16)
- [x] Las 4 etapas del proceso de reutilización (p. 35–36)
- [x] Contexto de aplicación en proyectos reales (p. 35)

### §2.2 Actividades del proceso
- [x] Las 4 actividades fundamentales definidas (p. 28)
- [x] Especificación: estudio de factibilidad, adquisición, especificación, validación (p. 28, §2.2.1)
- [x] Diseño e implementación: 4 actividades del diseño (p. 28, §2.2.2)
- [x] Validación: V&V, diferencia verificación/validación, 3 etapas de pruebas (p. 28, §2.2.3)
- [x] Evolución: cambio continuo, mantenimiento como evolución (p. 28, 31, 53)

### §2.3 Cómo enfrentar el cambio
- [x] Prototipado: definición, tipos desechable/evolutivo (p. 44–47)
- [x] Proceso de desarrollo del prototipo en 4 pasos (Fig. 2.9, p. 45)
- [x] Beneficios del prototipado (p. 44–45)
- [x] Limitaciones y riesgos del prototipado (p. 46–47)
- [x] Entrega incremental: definición (p. 47)
- [x] Diferencia con desarrollo incremental (p. 34, 47)
- [x] 4 ventajas para el cliente (p. 47–48)
- [x] 3 problemas de la entrega incremental (p. 48)
- [x] Cuándo NO usar entrega incremental (p. 48–49)

### §2.4 El Proceso Unificado Racional
- [x] Definición del RUP y sus 3 perspectivas (p. 50–51)
- [x] Las 4 fases con objetivo, actividades e hito de salida (p. 50–51)
- [x] Los 6 flujos de trabajo centrales con descripción (Fig. 2.13, p. 52)
- [x] Los 3 flujos de trabajo de apoyo con descripción (Fig. 2.13, p. 52)
- [x] Distribución temporal de flujos por fase (p. 52)
- [x] Las 6 buenas prácticas del RUP con descripción (p. 52)

---

*Documento generado con base exclusiva en: Sommerville, Ian. **Ingeniería de Software**, 9.ª edición, Pearson Education, 2011. Capítulo 2: Procesos de software, pp. 27–54.*
