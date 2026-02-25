# M2-02-estimacion-costos.md

---

## 1. Metadatos

| Campo            | Valor                                                              |
|------------------|--------------------------------------------------------------------|
| **Archivo**      | `M2-02-estimacion-costos.md`                                       |
| **Módulo**       | Módulo 2 — Registro y Configuración de Proyectos                  |
| **Capítulo fuente** | Cap. 23 — Planeación de proyectos (Sommerville, 9ª ed., 2011)  |
| **Secciones**    | §23.1, §23.4, §23.5 (completo)                                     |
| **Versión**      | 1.0.0                                                              |
| **Fecha**        | 2026-02-24                                                         |
| **Estado**       | ✅ Activo — Marco teórico de referencia                           |
| **Autor**        | Generado a partir de fuente primaria                               |
| **Relacionado**  | `M2-01-flujo-creacion-proyecto.md` (Paso 6), `M3-SRS`             |

---

## 2. Objetivo del Documento

Este archivo establece el **marco teórico completo para la estimación de costos y esfuerzo de proyectos de software** que respalda el Módulo 2 del sistema. Cubre los fundamentos epistemológicos, técnicas de estimación y el proceso operativo que el analista debe seguir al registrar un `presupuestoEstimado` en el tipo `Proyecto`.

### Por qué documentar la metodología de estimación

Trabajar con empresas de alto calibre exige que toda cifra presupuestaria esté **justificada con una metodología reconocida**, no simplemente ingresada como valor intuitivo. Sommerville establece explícitamente que *"siempre habr que calcular los costos del software de manera objetiva, con la finalidad de predecir con precisión el costo para el desarrollo del software"* (Cap. 23, intro, p. 619). La ausencia de documentación metodológica convierte una estimación en opinión, no en artefacto técnico. Ante una disputa contractual, solo la segunda tiene peso.

### Dos niveles de estimación del sistema

El sistema implementa un modelo de estimación en dos etapas que refleja la madurez progresiva del conocimiento del proyecto:

| Nivel | Cuándo ocurre | Técnicas aplicables | Precisión esperada | Campo que actualiza |
|-------|--------------|---------------------|--------------------|---------------------|
| **Estimación referencial** | Paso 6 del flujo M2, antes del SRS | Juicio experto, Analogía | ±30–50% | `presupuestoEstimado` (borrador) |
| **Estimación detallada** | Tras completar SRS en M3 | Descomposición, PF, COCOMO II, Planning Poker | ±10–20% | `presupuestoEstimado` (confirmado) |

> ⚠️ **Principio fundamental**: La estimación es un artefacto vivo que se refina iterativamente, no un dato que se ingresa una sola vez. Este principio es crítico para la credibilidad del sistema ante clientes exigentes.

---

## 3. Fijación de Precio al Software

**Fuente**: Cap. 23 §23.1, pp. 621–623

### 3.1 Por qué el precio ≠ costo de desarrollo

Sommerville establece el problema central: *"En principio, el precio de un producto de software a un cliente es simplemente el costo del desarrollo más las ganancias para el diseñador. Sin embargo, en la práctica, la relación entre el costo del proyecto y el precio cotizado al cliente no es tan simple. Cuando se calcula un precio, hay que hacer consideraciones más amplias de índole organizacional, económica, política y empresarial"* (§23.1, p. 621).

Los tres parámetros de costo base según Sommerville (p. 620):

- **Costos de esfuerzo**: pagar a ingenieros y administradores de software
- **Costos de hardware y software**: incluyendo mantenimiento y licencias de middleware
- **Costos de viajes y capacitación**: frecuentes en proyectos multi-sitio

### 3.2 Factores que afectan la fijación de precio

El libro presenta una tabla de factores (Figura 23.1, p. 622) que el sistema debe considerar:

| Factor | Descripción (Sommerville, Fig. 23.1, p. 622) |
|--------|----------------------------------------------|
| **Oportunidad de mercado** | Una organización puede cotizar precio bajo para ingresar a un nuevo segmento. La experiencia alcanzada puede ayudar a desarrollar nuevos productos. |
| **Incertidumbre de estimación de costo** | Si una organización no está segura de sus estimaciones, puede aumentar su precio mediante una contingencia por encima de su ganancia normal. |
| **Términos contractuales** | Un cliente puede permitir al desarrollador retener la propiedad del código fuente. Entonces el precio podrá ser inferior al que se cobra si el código se entrega al cliente. |
| **Volatilidad de requerimientos** | Si es probable que cambien los requerimientos, una organización puede reducir su precio para ganar el contrato. Una vez otorgado, pueden cobrarse precios altos por cambios. |
| **Salud financiera** | Los desarrolladores en dificultad financiera pueden reducir sus costos para obtener un contrato. El flujo de efectivo es más importante que la ganancia en tiempos difíciles. |

### 3.3 Estrategias de fijación de precio

Sommerville describe tres estrategias implícitas que el libro ilustra con casos:

#### Precio basado en costo
El precio refleja el costo real de desarrollo más un margen razonable. Es el enfoque "honesto" pero rara vez el único factor. **Cuándo usar**: proyectos con requerimientos muy definidos, cliente conocido, sin presión competitiva extrema.

#### Precio de mercado (cotizar para ganar)
Sommerville lo describe explícitamente: *"Cotizar para ganar significa que una compañía tiene alguna idea del precio que el cliente espera pagar y hace una apuesta por el contrato con base en el precio esperado por el cliente"* (§23.1, p. 622). El caso PharmaSoft ilustra esto: con costos reales de $1.2M, cotizan $0.8M para retener personal especializado y posicionarse para contratos futuros más rentables. **Cuándo usar**: cuando la obtención del contrato tiene valor estratégico que supera la pérdida inmediata.

#### Precio estratégico (funcionalidad ajustada al presupuesto)
El precio se fija primero; los requerimientos se ajustan para no superar ese precio. Sommerville ilustra con el caso OilSoft: *"Para este sistema no hay documento de requerimientos detallado, de manera que OilSoft estima que un precio de $900,000 dólares probablemente sea competitivo [...] Después de que se le otorga el contrato, OilSoft negocia los requerimientos detallados del sistema, de manera que se entrega la funcionalidad básica"* (§23.1, p. 622–623). **Cuándo usar**: licitaciones competitivas con presupuesto del cliente preestablecido.

### 3.4 El problema de la subestimación deliberada y sus consecuencias

Sommerville identifica el riesgo sistémico: *"Como el costo de un proyecto sólo está débilmente relacionado con el precio cotizado a un cliente, cotizar para ganar es una estrategia usada comúnmente"* (§23.1, p. 622). Las consecuencias a largo plazo incluyen:

- Equipos trabajando sin remuneración por horas extra
- Funcionalidad recortada sin notificar debidamente al cliente
- Pérdida de credibilidad cuando se descubren las omisiones
- Disputas contractuales sobre qué estaba incluido originalmente

### 3.5 Problemas éticos en la estimación

Sommerville plantea directamente en el ejercicio 23.10 (p. 649): *"¿Es ético que una compañía cotice un precio bajo para un contrato de software, a sabiendas de que los requerimientos son ambiguos y que pueden cobrar un precio alto por cambios posteriores solicitados por el cliente?"*. 

Una estimación irresponsable se caracteriza por:
- Omitir supuestos deliberadamente para que el cliente no pueda comparar
- No documentar qué está excluido del alcance
- Usar la ambigüedad de los requerimientos como mecanismo de rentabilidad posterior
- No advertir al cliente sobre el nivel de incertidumbre de la estimación

El ingeniero tiene **responsabilidad profesional** de documentar la metodología usada, los supuestos asumidos y las exclusiones explícitas. Esto protege a ambas partes.

### 3.6 Relación precio / costo / margen

Para documentar la estructura de precio ante el cliente:

```

Precio = Costo de esfuerzo + Costo de HW/SW + Costos generales + Contingencia + Margen

```

Los **costos generales** (overhead) merecen mención especial: Sommerville advierte que *"no sólo se multiplican los sueldos del personal involucrado por el tiempo invertido en el proyecto, sino que también hay que tener en cuenta todos los costos generales de la organización —espacio de oficinas, administración, etc.— que deben cubrirse con el ingreso del proyecto"* (Cap. 23, p. 620).

> **Aplicación en el sistema:** El sistema debe registrar no solo el `presupuestoEstimado` sino también el método de estimación usado y los supuestos asumidos. Documentar si la estrategia de precio es "basada en costo", "de mercado" o "estratégica" permite al equipo justificar la cifra ante el cliente y gestionar expectativas desde el inicio. La Plantilla Operativa (Sección 8) incluye los campos `supuestos[]` y `exclusiones[]` precisamente para este propósito.

---

## 4. Incertidumbre en la Estimación

**Fuente**: Cap. 23 §23.5 (intro), pp. 633–635

### 4.1 Por qué la estimación es inherentemente incierta

Sommerville es directo: *"Es difícil la estimación del calendario del proyecto. Probablemente haya que hacer estimaciones iniciales sobre la base de una definición de requerimientos de usuario de alto nivel. El software puede ejecutarse en computadoras no familiares o usar nueva tecnología de desarrollo. Quizá no lleguen a conocerse las personas involucradas en el proyecto y sus habilidades. Existe tanta incertidumbre que es imposible estimar con precisión los costos de desarrollo del sistema durante las primeras etapas de un proyecto"* (§23.5, p. 633–634).

### 4.2 El cono de incertidumbre (Figura 23.9, p. 635)

El libro presenta la evolución de la precisión de la estimación a lo largo del ciclo de vida del proyecto. Sommerville describe que Boehm y colaboradores *"descubrieron que las estimaciones de arranque varían significativamente. Si la estimación inicial del esfuerzo requerido es de **x** meses de esfuerzo, el rango puede ser de **0.25x a 4x** del esfuerzo real, medido cuando el sistema se entregó"* (§23.5, p. 634).

La Figura 23.9 del libro (p. 635) muestra este cono de incertidumbre:

```

Etapa del proyecto    → Rango de la estimación respecto al valor real
─────────────────────────────────────────────────────────────
Factibilidad          →  0.25x  ←──── x ────→  4x   (±75–300%)
Requerimientos        →  0.5x   ←──── x ────→  2x   (±50–100%)
Diseño                →  0.67x  ←──── x ────→  1.5x (±33–50%)
Código                →  0.8x   ←──── x ────→  1.25x(±20–25%)
Entrega               →  ~x     ←──── x ────→  ~x   (±5–10%)

```

**Interpretación para el sistema**: En el Paso 6 de M2 el proyecto está en la etapa de factibilidad/requerimientos iniciales → incertidumbre de 0.25x a 4x. Después del SRS en M3 la incertidumbre baja a 0.5x–2x. Este es el fundamento para exigir un rango mínimo–nominal–máximo en la plantilla.

### 4.3 Por qué se subestima sistemáticamente

Sommerville identifica el problema de las estimaciones auto-satisfactorias: *"Con frecuencia, las estimaciones del proyecto se autosatisfacen. La estimación se utiliza para definir el presupuesto del proyecto, y el producto se ajusta para que se cumpla la cifra del presupuesto. Un proyecto que está dentro de presupuesto puede lograr esto a expensas de las características en el software a desarrollar"* (§23.5, p. 634).

Factores de subestimación identificados en el libro:
- **Tecnología no familiar**: el equipo subestima el tiempo de aprendizaje
- **Optimismo cognitivo**: se estima el escenario ideal, no el probable
- **Presión organizacional**: los administradores presionan hacia cifras bajas para ganar contratos
- **Ausencia de contingencia**: no se contemplan demoras por enfermedad, rotación de personal, fallas de hardware, retrasos en entregas de software de soporte

Sommerville recomienda explícitamente: *"Las estimaciones de contingencia pueden agregar entre 30 y 50% al esfuerzo y tiempo requeridos para el proyecto"* (§23.3, p. 627).

### 4.4 Estimación optimista, pesimista y más probable

Sommerville prescribe: *"Si se usa un modelo algorítmico de estimación de costos, hay que desarrollar un rango de estimaciones —peor, esperado y mejor— en lugar de una sola estimación y aplicar la fórmula de costo a todas ellas"* (§23.5.1, p. 637).

| Escenario | Descripción | Cuándo usar como base de decisión |
|-----------|-------------|-----------------------------------|
| **Optimista (mejor)** | Todo sale según lo planeado. Sin imprevistos, equipo al 100%, requerimientos estables. | Para calcular el piso del presupuesto mínimo posible. |
| **Nominal (esperado)** | Estimación más probable considerando factores normales del proyecto. | Base para `presupuestoEstimado` en el tipo Proyecto. |
| **Pesimista (peor)** | Contempla retrasos, cambios de requerimientos, rotación parcial del equipo. | Para calcular la reserva de contingencia y el techo presupuestario. |

> **Aplicación en el sistema:** El campo `presupuestoEstimado` del tipo `Proyecto` debe contener la estimación nominal. Sin embargo, el sistema debe almacenar también `estimacionMinima` y `estimacionMaxima` para comunicar el rango real al cliente. Antes del SRS, el rango puede ser 0.5x–2x del nominal; después del SRS, puede reducirse a 0.8x–1.2x. Este rango es lo que el cliente de alto calibre necesita ver para tomar decisiones informadas.

---

## 5. Técnicas de Estimación

**Fuente**: Cap. 23 §23.5, pp. 633–645

Sommerville clasifica las técnicas en dos categorías fundamentales: *"Existen dos tipos de técnicas: 1) Técnicas basadas en la experiencia [...] 2) Modelado algorítmico de costo"* (§23.5, p. 634).

### 5.1 Juicio Experto (Técnica basada en experiencia)

#### Definición
Sommerville describe: *"La estimación de los requerimientos de esfuerzo futuro se basan en la experiencia del administrador con proyectos anteriores y el dominio de aplicación. En esencia, el administrador emite un juicio informado de cuáles serán los requerimientos de esfuerzo"* (§23.5, p. 634).

#### Proceso de aplicación
1. Identificar los entregables que hay que producir y los componentes a desarrollar
2. Documentar en hoja de cálculo y estimar cada ítem individualmente
3. **Involucrar a un grupo de personas**: *"Por lo general, ayuda a que un grupo de personas se involucre en la estimación del esfuerzo y a pedir a cada miembro del grupo que explique sus estimaciones. Con frecuencia, esto revela factores que otros no consideraron y entonces se itera hacia una estimación grupal consensuada"* (§23.5, p. 634–635)
4. Calcular el esfuerzo total y aplicar contingencia del 30–50%

#### Ventajas
- Rapidez de aplicación
- Captura experiencia tácita del equipo que los modelos no contemplan
- No requiere datos históricos formalizados

#### Desventajas
- Sommerville advierte: *"La dificultad con las técnicas basadas en la experiencia es que un nuevo proyecto de software puede no tener mucho en común con proyectos anteriores. El desarrollo de software cambia muy rápidamente y con frecuencia un proyecto usará técnicas no familiares"* (§23.5, p. 635)
- Sesgo optimista individual
- Inconsistencia entre expertos distintos

#### Cuándo usar
Proyectos similares a trabajos anteriores del equipo. Etapa de propuesta donde no hay tiempo para análisis profundo. Siempre como complemento de otras técnicas.

> **Aplicación en el sistema:** En el Paso 6 de M2, cuando el proyecto recién se configura y no hay SRS, el juicio experto es la técnica más aplicable. El sistema debe registrar `metodoUsado: "juicio_experto"` y forzar al analista a documentar al menos tres `supuestos[]` concretos que fundamentan la cifra.

---

### 5.2 Estimación por Analogía (Técnica basada en experiencia)

#### Definición
Sommerville la menciona como parte de las técnicas basadas en la experiencia: los entregables y componentes se identifican y *"se les estima de manera individual"* (§23.5, p. 634–635) usando proyectos previos similares como referencia. La estimación del tamaño puede implicar *"estimación por analogía con otros proyectos"* (§23.5.1, p. 635).

#### Proceso paso a paso
1. **Identificar proyectos similares** en el historial de la organización
2. **Medir diferencias** entre el proyecto histórico y el nuevo: tamaño, complejidad tecnológica, dominio de aplicación, equipo disponible
3. **Ajustar la estimación** histórica según las diferencias identificadas (factores de ajuste)
4. **Documentar los ajustes** realizados y por qué se aplicaron

#### Factores de ajuste relevantes (derivados del libro)
- Cambio de tecnología o lenguaje de programación
- Diferencia de tamaño funcional (más/menos módulos que el proyecto histórico)
- Diferencia en experiencia del equipo
- Diferencia en nivel de fiabilidad requerido
- Presencia/ausencia de reutilización de componentes

#### Ventajas
- Basada en datos reales de la organización, no en fórmulas genéricas
- Calibrada automáticamente a las prácticas locales

#### Desventajas
- Requiere historial documentado de proyectos anteriores
- Difícil aplicar cuando el proyecto usa tecnologías nuevas para el equipo

#### Cuándo usar
Cuando la organización tiene al menos 2–3 proyectos históricos similares documentados con esfuerzo real registrado.

> **Aplicación en el sistema:** Para organizaciones con historial en la plataforma, el sistema debería en versiones futuras permitir referenciar proyectos anteriores como base de la estimación analógica. El campo `supuestos[]` debe incluir el proyecto de referencia usado y los factores de ajuste aplicados.

---

### 5.3 Descomposición (Work Breakdown Structure)

#### Definición
La descomposición emerge del proceso de calendarización descrito por Sommerville: *"La calendarización de proyectos es el proceso de decidir cómo se organizará el trabajo en un proyecto como tareas separadas, y cuándo y cómo se ejecutarán dichas tareas. Se estima el tiempo calendario para completar cada tarea, el esfuerzo requerido y quién trabajará en las tareas identificadas"* (§23.3, p. 626).

#### Proceso
1. **Identificar actividades**: dividir el proyecto en tareas. Sommerville prescribe: *"Por lo general, las tareas deben durar al menos una semana, pero no más de dos meses. La cantidad máxima de tiempo para cualquier tarea debe durar alrededor de ocho a diez semanas. Si tarda más que esto, la tarea debe subdividirse"* (§23.3, p. 627)
2. **Estimar cada tarea individualmente**: esfuerzo en días-hombre y duración en días calendario
3. **Identificar dependencias entre tareas**
4. **Sumar las estimaciones** considerando tareas paralelas
5. **Agregar contingencia**: *"Las estimaciones de contingencia pueden agregar entre 30 y 50% al esfuerzo y tiempo requeridos"* (§23.3, p. 627)

#### Cómo agregar estimaciones con paralelismo
- Las tareas independientes se ejecutan en paralelo: su esfuerzo suma pero su duración no
- Las tareas con dependencias determinan la ruta crítica
- El esfuerzo total ≠ suma simple de esfuerzos cuando hay paralelismo

#### Ventajas
- Alta precisión cuando los requerimientos están bien definidos
- Permite identificar la ruta crítica y los cuellos de botella
- Produce un WBS usable para asignación de recursos

#### Desventajas
- Requiere conocimiento detallado del alcance antes de comenzar
- Imposible de aplicar antes del SRS

#### Cuándo usar
Proyectos con SRS completo, metodología dirigida por plan o RUP. Ideal como técnica de la **Etapa 2** (post-SRS) del proceso del sistema.

> **Aplicación en el sistema:** La descomposición aplica en la Etapa 2 del proceso de estimación. Su resultado debe registrarse en el campo `supuestos[]` incluyendo el WBS resumido. El `presupuestoEstimado` se actualiza con esta estimación más precisa.

---

### 5.4 Estimación Algorítmica — COCOMO II

**Fuente**: Cap. 23 §23.5.2, pp. 637–645 — *Extraer con el máximo detalle provisto por el libro*

#### Definición y propósito

Sommerville define: *"COCOMO II es un modelo empírico que se derivó al recopilar datos a partir de un gran número de proyectos de software. Dichos datos se analizaron para descubrir qué fórmulas se ajustaban mejor con las observaciones. Dichas fórmulas vinculan el tamaño del sistema y los factores del producto, proyecto y equipo, con el esfuerzo para desarrollar el sistema. COCOMO II es un modelo de estimación bien documentado y no registrado"* (§23.5.2, p. 637).

COCOMO II se desarrolló a partir de los modelos COCOMO originales y *"toma en cuenta enfoques más modernos para el desarrollo de software, tales como el desarrollo rápido que usa lenguajes dinámicos, el desarrollo mediante composición de componentes y el uso de programación de base de datos. COCOMO II soporta el modelo en espiral de desarrollo"* (§23.5.2, p. 637).

#### Ecuación base de COCOMO II

Sommerville presenta la ecuación fundamental (§23.5.1, p. 635):

\[
\text{Esfuerzo} = A \times \text{Tamaño}^B \times M
\]

Donde:

| Variable | Definición | Valores |
|----------|-----------|---------|
| **A** | Factor constante que depende de las prácticas locales de la organización y el tipo de software. Para el modelo de diseño temprano, Boehm propuso **A = 2.94** (p. 640) | Calibrar con datos locales |
| **Tamaño** | Valoración del tamaño del código (KSLOC) o estimación de la funcionalidad en puntos de función. *"El número de miles de líneas de código fuente"* (p. 640) | KSLOC o PF convertidos a KSLOC |
| **B** | Exponente que refleja el esfuerzo creciente con el tamaño y la complejidad. *"El valor del exponente B se encuentra por lo general entre 1 y 1.5"* (p. 635). Para diseño temprano varía *"de 1.1 a 1.24"* (p. 640) | 1.01 a 1.26 |
| **M** | Multiplicador que combina atributos de proceso, producto y desarrollo | Producto de los controladores de costo |

**Fórmula del modelo de diseño temprano** (p. 640):

\[
PM = 2.94 \times \text{Tamaño}^{(1.1 \text{ a } 1.24)} \times M
\]

\[
M = PERS \times RCPX \times RUSE \times PDIF \times PREX \times FCIL \times SCED
\]

**Fórmula de duración del proyecto TDEV** (p. 645):

\[
TDEV = 3 \times PM^{(0.33 + 0.2(B - 1.01))}
\]

Donde TDEV es el calendario nominal en meses. Ejemplo del libro: con B = 1.17 y PM = 60 meses-hombre → TDEV = 3 × 60^0.36 = **13 meses**.

---

#### Los cuatro modelos de COCOMO II (Figura 23.10, p. 638)

**Modelo 1: Composición de aplicación** (pp. 638–639)

- **Cuándo se usa**: Proyectos de creación de prototipos o desarrollo mediante composición de componentes existentes, lenguajes dinámicos, scripting, programación de base de datos
- **Qué datos necesita**: Número de pantallas desplegadas, número de informes producidos, módulos en lenguajes imperativos, líneas de scripting → **puntos de aplicación (NAP)**
- **Fórmula**:

\[
PM = \frac{NAP \times (1 - \text{reutilización}/100)}{PROD}
\]

- **Productividad PROD** según experiencia del equipo y madurez ICASE (Figura 23.11, p. 639):

| Experiencia/habilidad del desarrollador | Muy bajo | Bajo | Nominal | Alto | Muy alto |
|----------------------------------------|----------|------|---------|------|----------|
| **PROD (NAP/mes)**                     | 4        | 7    | 13      | 25   | 50       |

- **Qué produce**: Estimación aproximada del esfuerzo de prototipado en meses-hombre

**Modelo 2: Diseño temprano** (pp. 639–640)

- **Cuándo se usa**: Durante etapas tempranas del diseño del sistema, después de establecer los requerimientos pero antes del diseño arquitectónico detallado. *"Más útil para la exploración de opciones en que es necesario comparar diferentes formas de implementar los requerimientos del usuario"* (p. 640)
- **Qué datos necesita**: Puntos de función convertidos a KSLOC usando tablas estándar por lenguaje de programación
- **Multiplicadores M** (7 atributos simplificados, escala 1 muy bajo a 6 muy alto):
  - **RCPX**: Fiabilidad y complejidad del producto
  - **RUSE**: Reutilización requerida
  - **PDIF**: Dificultad de plataforma
  - **PERS**: Habilidad personal del equipo
  - **PREX**: Experiencia personal del equipo
  - **FCIL**: Facilidades de soporte disponibles
  - **SCED**: Restricción de calendario (compresión)
- **Qué produce**: Estimación rápida y aproximada para toma de decisiones tempranas

**Modelo 3: Reutilización** (pp. 640–642)

- **Cuándo se usa**: Para calcular el esfuerzo requerido al integrar componentes de reutilización o código generado automáticamente. *"Muchas veces se utiliza en conjunto con el modelo posarquitectónico"* (p. 638)
- **Qué datos necesita**: ASLOC (líneas de código de reutilización), porcentaje AT (generado automáticamente), AAM (Multiplicador de Ajuste de Adaptación)
- **Componentes de AAM** (Multiplicador de Ajuste y Adaptación):
  - **AAF**: Costos de adaptar el código de reutilización (cambios al diseño, código e integración)
  - **SU**: Costos de comprensión del código a reutilizar (varía de 50 para código complejo a 10 para código OO bien escrito)
  - **AA**: Costos de decidir si reutilizar (varía de 0 a 8)
- **Qué produce**: ESLOC (líneas equivalentes de nuevo código fuente)

**Modelo 4: Posarquitectónico** (pp. 642–644)

- **Cuándo se usa**: *"Una vez diseada la arquitectura del sistema, puede hacerse una estimación más precisa del tamaño del software"* (p. 638). Es el modelo más detallado
- **Qué datos necesita**:
  1. Número total de SLOC nuevo a desarrollar
  2. ESLOC calculado por el modelo de reutilización
  3. Número de líneas que se modificarán por cambios a requerimientos
  - Suma de estos tres parámetros = tamaño total en KSLOC
- **Multiplicadores M**: Conjunto extenso de **17 atributos** controladores de costos (vs. 7 del diseño temprano)
- **Qué produce**: La estimación más precisa disponible; base para el presupuesto definitivo

---

#### Factores de escala para calcular B (Figura 23.12, p. 643)

El exponente B se calcula sumando los valores de los 5 factores, dividiendo entre 100 y sumando 1.01:

\[
B = 1.01 + \sum_{i=1}^{5} \frac{W_i}{100}
\]

Cada factor se clasifica en escala de **0 (extra alto) a 5 (muy bajo)**:

| Factor de escala | Explicación (Sommerville, Fig. 23.12, p. 643) |
|-----------------|-----------------------------------------------|
| **Precedencia** | Refleja la experiencia previa de la organización con este tipo de proyectos. Muy bajo = ninguna experiencia; extra alto = organización completamente familiarizada con este dominio |
| **Flexibilidad de desarrollo** | Refleja el grado de flexibilidad en el proceso de desarrollo. Muy bajo = proceso establecido rígido; extra alto = cliente sólo establece metas generales |
| **Resolución arquitectura/riesgo** | Refleja la extensión de análisis de riesgos realizado. Muy bajo = poco análisis; extra alto = análisis completo y a profundidad |
| **Cohesin del equipo** | Refleja cuán bien el equipo se conoce y trabaja en conjunto. Muy bajo = interacciones muy difíciles; extra alto = equipo integrado y efectivo sin problemas de comunicación |
| **Madurez del proceso** | Refleja la madurez del proceso de la organización según CMM. *"puede lograrse una estimación al restar el nivel de madurez del proceso CMM de 5"* |

**Ejemplo del libro** (p. 643–644): Organización con poca experiencia en el dominio, proceso poco definido, sin análisis de riesgo, equipo nuevo, nivel CMM 2:
- Precedencia: 4 (baja experiencia)
- Flexibilidad: 1 (sin involucramiento del cliente)
- Resolución arquitectura/riesgo: 5 (sin análisis)
- Cohesión del equipo: 3 (nominal, equipo nuevo)
- Madurez del proceso: 3 (nominal, nivel CMM 2)
- **Suma = 16 → B = 16/100 + 1.01 = 1.17**

---

#### Controladores de costos — 17 atributos del modelo posarquitectónico

Sommerville explica: *"Los controladores de costos (cost drivers) COCOMO II son atributos que reflejan algunos de los factores del producto, equipo, proceso y organización que afectan la cantidad de esfuerzo necesario para desarrollar un sistema de software"* (p. 645).

Los **5 controladores de costo clave** ilustrados en el libro con sus multiplicadores (Figura 23.13, p. 644):

| Controlador | Descripción | Valor bajo | Valor alto |
|-------------|------------|-----------|-----------|
| **RELY** | Nivel de fiabilidad requerido del software | 0.75 (muy bajo) | 1.39 (muy alto) |
| **CPLX** | Complejidad del sistema | 0.75 (muy bajo) | 1.30 (muy alto) |
| **STOR** | Restricción de memoria disponible | 1.00 (sin restricción) | 1.21 (alto) |
| **TOOL** | Uso de herramientas de desarrollo | 0.72 (muy alto/buenas herramientas) | 1.12 (bajo/herramientas básicas) |
| **SCED** | Restricción de calendario | 1.00 (normal) | 1.29 (acelerado) |

**Efecto de los controladores** (Figura 23.13, p. 644): Con B = 1.17 y tamaño = 128,000 DSI:
- Estimación COCOMO inicial (sin controladores): **730 meses-hombre**
- Con controladores en valores máximos adversos: **2,306 meses-hombre** (+215%)
- Con controladores en valores mínimos favorables: **295 meses-hombre** (-60%)

> Esto demuestra que los controladores de costo pueden multiplicar por **más de 3x** la estimación inicial, lo que subraya la importancia de documentarlos.

---

#### Limitaciones de COCOMO II según Sommerville

1. *"Con frecuencia es difícil estimar el Tamaño en una etapa temprana del proyecto, cuando sólo está disponible la especificación"* (§23.5.1, p. 636)
2. *"Las estimaciones de los factores que contribuyen a B y M son subjetivas. Las estimaciones varían de una persona a otra"* (§23.5.1, p. 636)
3. Requiere calibración con datos históricos locales: *"los usuarios del modelo deben calibrar sus modelos y valores de los atributos con sus datos históricos de proyecto"* (§23.5.1, p. 636–637)
4. *"Esta complejidad desalienta a los usuarios potenciales y, por lo tanto, la aplicación práctica del modelado algorítmico de costos se limita a un número pequeño de compañías"* (§23.5.1, p. 637)

> **Aplicación en el sistema:** Para proyectos medianos/grandes con metodología dirigida por plan o RUP, el sistema debe registrar `metodoUsado: "cocomo_ii"` y capturar los 5 factores de escala y los controladores de costo relevantes en el campo `supuestos[]`. El resultado de PM y TDEV debe documentarse como respaldo ante el cliente. El exponente B calculado y el valor de A usado deben quedar registrados.

---

### 5.5 Puntos de Función

**Fuente**: Cap. 23 §23.5.2, p. 638, 640

#### Definición
Sommerville define: *"Los puntos de función son una forma independiente de lenguaje para cuantificar la funcionalidad del programa"* (§23.5.2, p. 638).

#### Tipos de funciones que se cuentan
*"El número total de puntos de función en un programa se calcula al medir o estimar el número de:"* (§23.5.2, p. 638):

| Tipo de función | Descripción |
|----------------|-------------|
| **Entradas externas** | Datos ingresados al sistema desde fuera del límite del sistema |
| **Salidas externas** | Datos que el sistema envía fuera de su límite |
| **Interacciones de usuario** (consultas externas) | Consultas interactivas que requieren respuesta inmediata |
| **Interfaces externas** | Archivos o datos compartidos con otros sistemas |
| **Tablas de archivos o bases de datos** | Archivos lógicos internos mantenidos por el sistema |

#### Proceso básico de cálculo
1. Identificar y contar cada tipo de función en el sistema
2. Aplicar pesos según complejidad (simple, media, compleja)
3. Ajustar por factores técnicos generales del proyecto
4. Obtener PF ajustados
5. Convertir a KSLOC usando tablas estándar por lenguaje de programación

#### Ventajas sobre LOC como unidad de medida
- **Independiente del lenguaje**: *"Los puntos de función son una forma independiente de lenguaje para cuantificar la funcionalidad del programa"* (p. 638)
- Aplicable antes de escribir una línea de código
- Basada en requerimientos funcionales visibles al usuario
- Permite comparar productividad entre proyectos con diferentes lenguajes

#### Conversión de Puntos de Función a KSLOC
Sommerville indica que *"las KSLOC se calculan al estimar el número de puntos de función en el software. Entonces se usan tablas estándar que relacionan el tamaño del software con puntos de función para diferentes lenguajes de programación"* (§23.5.2, p. 640). El libro no incluye los factores de conversión en el texto principal, pero menciona que estas tablas estándar existen y son la base para el modelo de diseño temprano.

> **Aplicación en el sistema:** Los puntos de función son la técnica más adecuada cuando se dispone de un SRS o backlog inicial con requerimientos funcionales definidos. Para proyectos Next.js + Firebase del sistema, los tipos de función mapean directamente a: pantallas/rutas (entradas/salidas), endpoints API (interfaces externas), colecciones Firestore (archivos de BD). El campo `supuestos[]` debe registrar la tabla de conversión PF→KSLOC usada y el lenguaje de referencia.

---

### 5.6 Planning Poker y Estimación Ágil (Juego de Planeación XP)

**Fuente**: Cap. 23 §23.4 (Planeación Ágil), pp. 631–633

#### Definición
Sommerville describe el proceso ágil de estimación como el **juego de planeación**: *"el juego de planeación [...] por lo general implica a todo el equipo de desarrollo, incluidos los representantes del cliente"* (§23.4, p. 631–632).

#### Proceso: cómo funciona
Sommerville describe el proceso XP en 5 etapas (Figura 23.8, p. 632):

1. **Identificación de la historia**: El equipo y el cliente identifican historias de usuario que representen toda la funcionalidad del sistema final
2. **Estimación inicial**: *"El equipo del proyecto lee y discute las historias y las clasifica de acuerdo con la cantidad de tiempo que consideran que se tardará implementar la historia"*
3. **Asignación de puntos de esfuerzo**: *"Una vez completada la clasificación, entonces el equipo asigna puntos de esfuerzo hipotéticos a las historias. Una historia compleja puede tener 8 puntos y una historia sencilla 2"* (p. 632)
4. **Planeación de la entrega** (release planning): *"implica seleccionar y afinar las historias que reflejarán las características a aplicar en una entrega de un sistema y el orden en el que deben implementarse las historias"* (p. 633)
5. **Planeación de la iteración**: *"Se eligen las historias a implementar para dicha iteración —el número de historias refleja el tiempo para entregar una iteración (por lo general dos o tres semanas) y la velocidad del equipo"* (p. 633)

#### Story Points (Puntos de esfuerzo)
Son unidades de medida relativa del esfuerzo de implementación. Sommerville indica: *"Una historia compleja puede tener 8 puntos y una historia sencilla 2. Esto se hace para todas las historias en la lista clasificada"* (§23.4, p. 632). La estimación relativa es clave: *"La estimación relativa con frecuencia es más sencilla que la estimación absoluta. Por lo regular, las personas encuentran difícil evaluar cuánto esfuerzo o tiempo se requiere para hacer algo. Sin embargo, cuando se les presentan muchas actividades por hacer, pueden emitir juicios acerca de cuáles historias requerirán más tiempo y más esfuerzo"* (p. 632).

#### Velocidad del equipo
Sommerville define: *"En XP, velocidad es el número de puntos de esfuerzo implementados por el equipo, por día. Esto puede valuarse a partir de la experiencia previa o al desarrollar una o dos historias para ver el tiempo que se requiere. La estimación de la velocidad es aproximada, pero se afina durante el proceso de desarrollo"* (§23.4, p. 632).

**Uso para planificar**: *"Una vez evaluada la velocidad, es posible calcular el esfuerzo total en días-hombre para implementar el sistema"* (p. 632–633).

**Revisión continua**: *"Cuando se alcanza la fecha de entrega de la iteración, ésta se completa, incluso si no se han implementado todas las historias. El equipo considera las historias que se implementaron y suma sus puntos de esfuerzo. Entonces puede calcularse nuevamente la velocidad y ésta se considera en la planeación de la siguiente entrega del sistema"* (p. 633).

#### Burndown y control de desviaciones
En la planeación XP, el sistema de control de avance funciona así: *"A la mitad de una iteración se revisa el avance. En esta etapa deben estar completos la mitad de los puntos de esfuerzo de la historia. De este modo, si una iteración implica 24 puntos de historia y 36 tareas, 12 puntos de historia y 18 tareas deben estar completos. Si éste no es el caso, se debe consultar al cliente y eliminar algunas historias de la iteración"* (§23.4, p. 633).

El burndown chart mide la **velocidad de consumo de story points** vs. lo planificado. Cuando la curva real se aleja de la planificada, la respuesta ágil no es extender el plazo sino reducir el alcance.

> **Aplicación en el sistema:** Para proyectos con `metodologia: "agil_scrum"`, el sistema debe registrar la `velocidadEquipo` (puntos/día) y el `totalStoryPoints` del backlog inicial como base de la estimación de duración. La fórmula es: `duracionEstimada = totalStoryPoints / velocidadEquipo`. El campo `presupuestoEstimado` se calcula como: `duracionEstimada × costo_diario_equipo`.

---

## 6. Planeación Ágil

**Fuente**: Cap. 23 §23.4, pp. 631–633

### 6.1 Definición según Sommerville

*"Los métodos ágiles de desarrollo de software son enfoques iterativos donde el software se desarrolla y entrega a los clientes en incrementos. A diferencia de los enfoques dirigidos por un plan, la funcionalidad de dichos incrementos no se planea por anticipado, sino que se decide durante el desarrollo. La decisión acerca de qué incluir en un incremento depende del progreso y las prioridades del cliente"* (§23.4, p. 631).

### 6.2 Enfoque de dos etapas de la planeación ágil

Sommerville describe: los enfoques ágiles tienen *"un enfoque de dos etapas para la planeación, las cuales corresponden a la fase de arranque en el desarrollo dirigido por un plan y la planeación del desarrollo: 1) Planeación de la entrega (release), que prevé con muchos meses de antelación [...] 2) Planeación de la iteración, que tiene un panorama a corto plazo"* (§23.4, p. 631).

### 6.3 Estimación del backlog completo

La estimación del esfuerzo total parte de estimar todas las historias del backlog con puntos de esfuerzo y usar la velocidad como divisor. Sommerville indica: *"Al inicio del proyecto, el equipo y el cliente tratan de identificar un conjunto de historias que comprendan toda la funcionalidad que se incluirá en el sistema final"* (§23.4, p. 632). Inevitablemente se perderá cierta funcionalidad, pero la estimación se afina conforme se completan iteraciones.

### 6.4 Replaneación durante el proyecto

La planeación ágil es continua. Si el trabajo no puede completarse: *"la filosofía XP es reducir el alcance del trabajo en lugar de extender el calendario"* (§23.4, p. 633). El sistema de monitoreo compara puntos completados vs. puntos planificados en cada iteración, y usa la velocidad real para proyectar la fecha de entrega futura.

### 6.5 Release planning

La planeación de la entrega implica: *"Entonces se elige una fecha de entrega y las historias se examinan para ver si la estimación del esfuerzo es congruente con dicha fecha. Si no lo es, las historias se agregan o eliminan de la lista"* (§23.4, p. 633).

> **Aplicación en el sistema:** Para proyectos `agil_scrum`, el sistema debe en la Etapa 2 (post-SRS) capturar: `velocidadEquipo` (puntos/día, de iteraciones pasadas o estimada), `totalStoryPoints` (suma del backlog priorizado), y calcular automáticamente `duracionProyectada = totalStoryPoints / velocidadEquipo`. Este cálculo respaldado por metodología Sommerville es presentable ante cualquier cliente.

---

## 7. Tabla Maestra de Técnicas de Estimación

Esta tabla define la lógica de recomendación de técnica que el sistema usa según el contexto del proyecto. Lista de compatibilidad por metodología: `plan` = desarrollo dirigido por plan, `rup` = RUP, `agil_scrum` = Scrum/XP, `hibrido` = combinación.

| Técnica | Etapa del proyecto | Tipo de proyecto | Datos necesarios | Precisión típica | Metodología compatible |
|---------|-------------------|-----------------|-----------------|-----------------|----------------------|
| **Juicio experto** | Cualquiera | Cualquiera | Experiencia del equipo, historial tácito | ±50% | Todas |
| **Analogía** | Inicio / propuesta | Cualquiera | Proyectos históricos similares documentados | ±30% | `plan` / `hibrido` |
| **Descomposición (WBS)** | Tras SRS | Bien definido | WBS completo con todas las actividades | ±20% | `plan` / `rup` |
| **COCOMO II** | Inicio / diseño temprano / posarquitectura | Mediano / Grande | Tamaño estimado en KSLOC o PF, 5 factores de escala | ±25% | `plan` / `rup` |
| **Puntos de función** | Tras SRS | Cualquiera | Requerimientos funcionales definidos (entradas, salidas, consultas, archivos, interfaces) | ±15% | Todas |
| **Planning Poker (Ágil)** | Inicio de sprint / iteración | Ágil | Backlog priorizado con historias, velocidad del equipo | ±10% por sprint | `agil_scrum` |

**Notas de uso de la tabla:**
- La precisión indicada asume que se documentan supuestos y exclusiones correctamente
- Para la Etapa 1 (antes del SRS), solo aplican: Juicio experto y Analogía
- Para la Etapa 2 (tras el SRS), aplican todas las demás según metodología
- Es válido y recomendado combinar técnicas (ej: COCOMO II + Juicio experto) para triangular la estimación

---

## 8. Plantilla Operativa: Registro de Estimación

Esta plantilla define la estructura de datos que el sistema almacena para documentar una estimación de proyecto. Los campos marcados con 🟢 **ya existen** en el tipo `Proyecto`; los marcados con 🔵 son **propuestos** para versiones futuras.

| Campo | Tipo | Descripción | Obligatorio | Estado |
|-------|------|-------------|-------------|--------|
| `metodoUsado` | `enum` | Técnica de estimación aplicada: `"juicio_experto"` \| `"analogia"` \| `"descomposicion"` \| `"cocomo_ii"` \| `"puntos_funcion"` \| `"planning_poker"` | Sí | 🔵 Propuesto |
| `estimacionMinima` | `number` | Escenario optimista (mejor caso). Base: Sommerville §23.5.1 p. 637 | Sí | 🔵 Propuesto |
| `estimacionNominal` | `number` | Escenario más probable. Base para `presupuestoEstimado` | Sí | 🟢 Existe como `presupuestoEstimado` |
| `estimacionMaxima` | `number` | Escenario pesimista (peor caso). Base: Sommerville §23.5.1 p. 637 | Sí | 🔵 Propuesto |
| `moneda` | `string` | Código ISO 4217 (ej: `"CLP"`, `"USD"`, `"EUR"`) | Sí | 🟢 Existe como `moneda` |
| `nivelConfianza` | `enum` | `"bajo"` \| `"medio"` \| `"alto"`. Bajo = antes del SRS (cono 0.25x–4x); Alto = post-arquitectura | Sí | 🔵 Propuesto |
| `supuestos` | `string[]` | Lista de supuestos asumidos. Ej: "Se asume equipo de 3 devs disponibles al 80%", "No incluye QA externo". Base: Sommerville §23.1 p. 621 | Sí | 🔵 Propuesto |
| `exclusiones` | `string[]` | Qué NO está incluido en la estimación. Fundamental para disputas contractuales. Base: Sommerville §23.1 §23.5 | Sí | 🔵 Propuesto |
| `fechaEstimacion` | `Date` | Cuándo se realizó la estimación. La estimación envejece: base Sommerville §23.2.2 | Sí | 🔵 Propuesto |
| `realizadaPor` | `string` | ID o nombre del analista/administrador que estimó. Responsabilidad profesional: Sommerville Cap. 23 intro | Sí | 🔵 Propuesto |
| `version` | `number` | Número de revisión de la estimación (inicia en 1). Base: Sommerville §23.2.2 — el plan evoluciona | Sí | 🔵 Propuesto |
| `motivoRevision` | `string` | Por qué se revisó la estimación (ej: "Cambio de alcance en módulo X", "Completado el SRS"). Requerido si `version > 1` | Condicional (si `version > 1`) | 🔵 Propuesto |
| `tecnicaSecundaria` | `enum \| null` | Técnica de triangulación usada como validación cruzada | No | 🔵 Propuesto |
| `velocidadEquipo` | `number \| null` | Story points por día. Solo para `metodologia: "agil_scrum"`. Base: Sommerville §23.4 p. 632 | Condicional (ágil) | 🔵 Propuesto |
| `totalStoryPoints` | `number \| null` | Total de story points del backlog inicial. Solo para proyectos ágiles | Condicional (ágil) | 🔵 Propuesto |

### Justificación de campos por referencia

- **`metodoUsado`** → Sommerville §23.5 clasifica dos grandes categorías de técnicas (p. 634); registrar cuál se usó es un requisito mínimo de trazabilidad metodológica
- **`estimacionMinima` / `estimacionMaxima`** → Sommerville §23.5.1 prescribe explícitamente desarrollar "un rango de estimaciones —peor, esperado y mejor—" (p. 637); y el cono de incertidumbre (Figura 23.9) fundamenta el rango
- **`nivelConfianza`** → Deriva directamente del cono de incertidumbre: si la estimación es de arranque, la confianza es baja (rango 0.25x–4x); si es posarquitectónica, es alta (rango ≈ ±10–20%)
- **`supuestos`** → Sommerville §23.2.2 advierte que el plan debe revisarse cuando cambia la información; documentar supuestos permite detectar cuándo la estimación quedó obsoleta
- **`exclusiones`** → Sommerville §23.1 describe el caso OilSoft donde la funcionalidad adicional genera costos extras; las exclusiones explícitas previenen este escenario
- **`version` / `motivoRevision`** → Sommerville §23.2.2 establece que "Los cambios al plan son inevitables" (p. 624); el plan y la estimación se revisan regularmente durante el proyecto (p. 619)
- **`velocidadEquipo` / `totalStoryPoints`** → Sommerville §23.4 define velocidad como "el número de puntos de esfuerzo implementados por el equipo, por día" (p. 632) como base de la estimación ágil

---

## 9. Proceso Oficial de Estimación del Sistema

Este proceso define los pasos que el analista sigue al completar el **Paso 6 del flujo de creación de proyecto** en M2. El proceso es iterativo y tiene dos etapas.

---

### ETAPA 1 — Estimación Referencial (antes del SRS)

> **Cuándo ocurre**: Paso 6 del flujo M2. El proyecto existe pero no tiene SRS completo.

**Base teórica**: Sommerville establece que en la etapa de propuesta *"inevitablemente, es especulativa, pues muchas veces no se cuenta con un conjunto completo de requerimientos para el software a desarrollar"* (Cap. 23 intro, p. 619). La estimación en esta etapa es *"la mejor evaluación posible"* a la que se agrega *"contingencia significativa"* (p. 620).

#### Pasos del analista

1. **Seleccionar técnica**: En esta etapa solo aplican:
   - `juicio_experto`: si el equipo tiene experiencia en proyectos similares
   - `analogia`: si existen proyectos históricos comparables documentados

2. **Documentar supuestos mínimos** (al menos 3):
   - Composición del equipo asumida (ej: "2 devs full-stack + 1 diseñador")
   - Tecnología asumida (ej: "Next.js 14 + Firebase + Flutter")
   - Duración estimada sin compresión (ej: "proyecto de 4 meses en condiciones normales")

3. **Documentar exclusiones** (al menos 2):
   - Qué módulos quedan fuera del alcance actual
   - Qué tipo de pruebas no están incluidas (ej: "QA externo no incluido")

4. **Calcular estimación nominal**: con la técnica seleccionada

5. **Calcular rango**: aplicar el cono de Sommerville para etapa de factibilidad:
   - `estimacionMinima = estimacionNominal × 0.5`
   - `estimacionMaxima = estimacionNominal × 2.0`

6. **Registrar**: `nivelConfianza: "bajo"`, `version: 1`

#### Campos mínimos a completar en esta etapa
- `metodoUsado` ✅
- `estimacionNominal` (= `presupuestoEstimado`) ✅
- `estimacionMinima` ✅
- `estimacionMaxima` ✅
- `supuestos[]` (≥ 3 ítems) ✅
- `exclusiones[]` (≥ 2 ítems) ✅
- `nivelConfianza: "bajo"` ✅
- `fechaEstimacion` ✅
- `realizadaPor` ✅

#### Advertencia al usuario (UI)
> ⚠️ **Esta estimación tiene alta incertidumbre (±50–100%). Se realizó con información parcial, antes de completar el documento de requerimientos (SRS). Debe refinarse al finalizar el SRS en el Módulo 3. No utilizar como cifra contractual definitiva sin la aprobación del cliente.**

---

### ETAPA 2 — Estimación Detallada (tras el SRS en M3)

> **Cuándo ocurre**: Después de que M3 genera el SRS. El proyecto tiene requerimientos completos y la arquitectura está definida o en proceso.

**Base teórica**: Sommerville establece que *"durante la planeación del desarrollo, las estimaciones se vuelven cada vez más precisas conforme avanza el proyecto"* (§23.5, p. 634, Figura 23.9). Con los requerimientos definidos, la incertidumbre cae a 0.67x–1.5x.

#### Selección de técnica según metodología del proyecto

| Metodología | Técnica recomendada | Razón |
|-------------|---------------------|-------|
| `plan` / `rup` | Descomposición (WBS) + COCOMO II | Requerimientos estables, arquitectura definida |
| `agil_scrum` | Planning Poker + velocidad del equipo | Backlog priorizado disponible |
| `hibrido` | Puntos de función + Juicio experto | Combina funcionalidad definida con experiencia |

#### Pasos del analista

1. **Seleccionar técnica** según tabla anterior
2. **Aplicar técnica** con los datos del SRS
3. **Actualizar rango** con el nuevo cono de incertidumbre (±15–25%):
   - `estimacionMinima = estimacionNominal × 0.80`
   - `estimacionMaxima = estimacionNominal × 1.25`
4. **Actualizar `presupuestoEstimado`** en el tipo Proyecto con la nueva estimación nominal
5. **Registrar**: `nivelConfianza: "medio"` o `"alto"` según completitud del diseño
6. **Incrementar `version`** y documentar `motivoRevision: "SRS completado — estimación detallada"`

#### Campos adicionales a completar
- `metodoUsado` (actualizar si cambió) ✅
- `estimacionMinima` (actualizar con nuevo rango) ✅
- `estimacionMaxima` (actualizar con nuevo rango) ✅
- `nivelConfianza` (actualizar a `"medio"` o `"alto"`) ✅
- `version` (incrementar) ✅
- `motivoRevision` (documentar razón) ✅
- `velocidadEquipo` + `totalStoryPoints` (si es ágil) ✅

---

## 10. Tabla de Conexiones con los 3 Módulos

| Concepto del Cap. 23 | Módulo | Campo o proceso específico |
|---------------------|--------|---------------------------|
| Fijación de precio al software (§23.1) | M2 | `presupuestoEstimado` + `moneda` + estrategia de precio documentada en `supuestos[]` |
| Factores que afectan el precio (Fig. 23.1) | M2 | `supuestos[]` — documentar si aplica "oportunidad de mercado", "volatilidad de requerimientos", etc. |
| Incertidumbre / cono de estimación (Fig. 23.9) | M2 | `nivelConfianza` + rango `estimacionMinima`–`estimacionMaxima` |
| Tres parámetros de costo (esfuerzo, HW/SW, viajes) | M2 | `supuestos[]` — listar qué categorías de costo están incluidas |
| Contingencia 30–50% (§23.3, p. 627) | M2 | `estimacionMaxima` debe incluir este factor; documentar en `supuestos[]` |
| Técnicas basadas en experiencia (§23.5) | M2 (Etapa 1) | `metodoUsado: "juicio_experto"` o `"analogia"` en Paso 6 antes del SRS |
| COCOMO II — diseño temprano (§23.5.2) | M2 (Etapa 1/2) | `metodoUsado: "cocomo_ii"` + factores de escala en `supuestos[]` |
| Puntos de función (§23.5.2) | M2/M3 (Etapa 2) | `metodoUsado: "puntos_funcion"` — requiere SRS de M3 |
| Descomposición / WBS (§23.3) | M2/M3 (Etapa 2) | `metodoUsado: "descomposicion"` — requiere SRS de M3 |
| Planning Poker / velocidad (§23.4) | M2 (ágil) | `velocidadEquipo` + `totalStoryPoints` para proyectos `agil_scrum` |
| Plan se revisa periódicamente (§23.2.2) | M2 + M3 | `version` + `motivoRevision` — la estimación se versiona, no se sobreescribe |
| Puntos de función → KSLOC (§23.5.2) | M3 → M2 | El SRS de M3 provee los datos de funciones para calcular PF que alimentan COCOMO II en M2 |
| Requerimientos de los clientes (§23.1) | M1 + M2 | El perfil del cliente (M1) determina la estrategia de precio: cliente de alto calibre → estimación detallada obligatoria con nivel de confianza documentado |

---

## 11. Checklist de Completitud

### Extraído y documentado del Cap. 23

- [x] **§23.1** — Fijación de precio al software: definición, factores (Fig. 23.1), tres estrategias, casos PharmaSoft y OilSoft
- [x] **§23.1** — Problema ético de subestimación deliberada (Ejercicio 23.10)
- [x] **§23.1** — Tres parámetros de costo base (esfuerzo, HW/SW, viajes)
- [x] **§23.1** — Costos generales (overhead)
- [x] **Cap. 23 intro** — Tres etapas de planeación (propuesta, arranque, periódica)
- [x] **§23.5 intro** — Incertidumbre inherente y sus causas
- [x] **§23.5 intro** — Cono de incertidumbre: rango 0.25x–4x (Figura 23.9)
- [x] **§23.5 intro** — Estimaciones auto-satisfactorias: el problema de usar la estimación como presupuesto fijo
- [x] **§23.5 intro** — Dos tipos de técnicas (experiencia vs. algorítmico)
- [x] **§23.5** — Técnicas basadas en experiencia: proceso, ventajas, desventajas
- [x] **§23.5.1** — Modelado algorítmico: ecuación base Esfuerzo = A × Tamaño^B × M
- [x] **§23.5.1** — Limitaciones comunes de todos los modelos algorítmicos
- [x] **§23.5.2** — COCOMO II: definición, origen, propósito
- [x] **§23.5.2** — Modelo de composición de aplicación: fórmula, tabla de productividad (Fig. 23.11)
- [x] **§23.5.2** — Modelo de diseño temprano: fórmula completa con 7 multiplicadores
- [x] **§23.5.2** — Modelo de reutilizacin: fórmulas PMAuto y ESLOC, AAM y sus componentes
- [x] **§23.5.2** — Modelo posarquitectónico: tres parámetros de tamaño, 17 controladores
- [x] **§23.5.2** — Factores de escala para B: 5 factores con descripciones completas (Fig. 23.12)
- [x] **§23.5.2** — Ejemplo de cálculo de B: suma = 16 → B = 1.17
- [x] **§23.5.2** — Controladores de costo (5 clave con multiplicadores): RELY, CPLX, STOR, TOOL, SCED (Fig. 23.13)
- [x] **§23.5.2** — Efecto de controladores: ×3 hacia arriba, ÷3 hacia abajo
- [x] **§23.5.2** — Fórmula TDEV y ejemplo numérico (B=1.17, PM=60 → 13 meses)
- [x] **§23.5.2** — Limitaciones de COCOMO II: calibración, subjetividad, complejidad
- [x] **§23.5.2** — Puntos de función: definición, 5 tipos de funciones contadas
- [x] **§23.4** — Planeación ágil: definición, diferencia con plan tradicional
- [x] **§23.4** — Juego de planeación XP: 5 etapas (Fig. 23.8)
- [x] **§23.4** — Story points: definición, escala de valores, estimación relativa vs. absoluta
- [x] **§23.4** — Velocidad del equipo: definición, cálculo, uso para proyectar duración
- [x] **§23.4** — Planeación de la entrega (release planning)
- [x] **§23.4** — Control de avance a mitad de iteración: regla del 50% de puntos
- [x] **§23.3** — Contingencia 30–50% (p. 627)
- [x] **§23.2.2** — Plan como documento vivo que se revisa periódicamente

### Construido para el sistema

- [x] Tabla maestra de técnicas con 6 técnicas, 6 dimensiones (Sección 7)
- [x] Plantilla operativa con 14 campos, estado actual vs. propuesto (Sección 8)
- [x] Proceso oficial de dos etapas con pasos detallados (Sección 9)
- [x] Advertencia de UI para Etapa 1 (texto listo para implementar)
- [x] Tabla de conexiones con los 3 módulos del sistema (Sección 10)
- [x] Ejemplo de cálculo COCOMO II completo con números reales del libro

---

*Fin del documento — `M2-02-estimacion-costos.md` v1.0.0*
*Fuente única: Sommerville, I. (2011). Ingeniería de Software, 9ª ed. Pearson. Cap. 23, pp. 619–649.*
```