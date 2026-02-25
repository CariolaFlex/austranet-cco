# 00-marco-teorico-ingenieria-software.md

---

## METADATOS

| Campo              | Valor                                                                 |
|--------------------|-----------------------------------------------------------------------|
| **Nombre**         | 00-marco-teorico-ingenieria-software.md                               |
| **Módulo**         | Capa 0 — Fundamentos Teóricos                                         |
| **Capítulo fuente**| Capítulo 1: Introducción — Ian Sommerville                            |
| **Fuente**         | Ingeniería de Software, 9ª Edición — Pearson / Addison-Wesley, 2011   |
| **ISBN**           | 978-607-32-0603-7 (impreso)                                           |
| **Versión**        | 1.0.0                                                                 |
| **Fecha**          | 2026-02-24                                                            |
| **Estado**         | Activo — Revisión inicial                                             |

---

## OBJETIVO DEL DOCUMENTO

Este archivo establece el marco conceptual base del sistema de gestión, fundamentado
exclusivamente en el **Capítulo 1 de Ingeniería de Software (Sommerville, 9ª ed.)**.
Su propósito es triple:

1. **Justificación metodológica:** Toda decisión de diseño, proceso y criterio de
   calidad del sistema tiene respaldo en una fuente académica estándar de la industria.

2. **Respaldo ante clientes y empresas:** En contextos legales o contractuales, este
   documento demuestra que el sistema fue construido bajo los principios formales de la
   Ingeniería de Software profesional, no bajo criterios arbitrarios.

3. **Trazabilidad:** Cada concepto teórico se conecta explícitamente con uno o más de
   los tres módulos del sistema:
   - **Módulo 1:** Registro de Clientes y Proveedores
   - **Módulo 2:** Registro y Configuración de Proyectos
   - **Módulo 3:** Documentación de Objetivos y Alcance (SRS)

> **Restricción de alcance:** Este archivo cubre únicamente el **Capítulo 1**.
> Los capítulos posteriores (procesos, requerimientos, arquitectura, etc.) se
> documentan en archivos separados de la misma capa.

---

## 1. DEFINICIÓN DE INGENIERÍA DE SOFTWARE

### 1.1 Definición Formal

*(Cap. 1 §1.1.1, p.7)*

> "La ingeniería de software es una disciplina de ingeniería que se interesa por todos
> los aspectos de la producción de software, desde las primeras etapas de la
> especificación del sistema hasta el mantenimiento del sistema después de que se pone
> en operación."

La definición descansa en dos frases clave que el propio autor destaca:

1. **Disciplina de ingeniería:** "Los ingenieros hacen que las cosas funcionen. Aplican
   teorías, métodos y herramientas donde es adecuado. Sin embargo, los usan de manera
   selectiva y siempre tratan de encontrar soluciones a problemas, incluso cuando no
   hay teorías ni métodos aplicables. Los ingenieros también reconocen que deben
   trabajar ante restricciones organizacionales y financieras, de modo que buscan
   soluciones dentro de tales limitaciones."

2. **Todos los aspectos de la producción del software:** "La ingeniería de software no
   sólo se interesa por los procesos técnicos del desarrollo de software, sino también
   incluye actividades como la administración del proyecto de software y el desarrollo
   de herramientas, así como métodos y teorías para apoyar la producción de software."

---

### 1.2 Programa de Computadora vs. Producto de Software Profesional

*(Cap. 1 §1.1, p.5–6)*

El libro establece una distinción explícita y fundamental:

> "El software no es sólo un programa o programas, sino que también incluye toda la
> documentación asociada y los datos de configuración requeridos para hacer que estos
> programas operen de manera correcta."

> "Un sistema de software desarrollado profesionalmente es usualmente más que un solo
> programa. El sistema por lo regular consta de un número de programas separados y
> archivos de configuración que se usan para instalar dichos programas. Puede incluir
> documentación del sistema, que describe la estructura del sistema; documentación del
> usuario, que explica cómo usar el sistema, y los sitios web para que los usuarios
> descarguen información reciente del producto."

> "Ésta es una de las principales diferencias entre el desarrollo de software
> profesional y el de aficionado. Si usted diseña un programa personal, nadie más lo
> usará ni tendrá que preocuparse por elaborar guías del programa, documentar el diseño
> del programa, etcétera. Por el contrario, si crea software que otros usarán y otros
> ingenieros cambiarán, entonces, en general debe ofrecer información adicional, así
> como el código del programa."

| Dimensión                 | Programa Personal           | Producto de Software Profesional              |
|---------------------------|------------------------------|-----------------------------------------------|
| Destinatario              | El propio desarrollador      | Otros usuarios e ingenieros                   |
| Desarrollo                | Individual                   | Por equipos                                   |
| Documentación             | No requerida                 | Obligatoria (sistema, usuario, configuración) |
| Mantenimiento             | Ad hoc o inexistente         | Sistemático a lo largo del ciclo de vida      |
| Validación                | Informal                     | Formal, con criterios definidos               |

**Aplicación en el sistema:** El sistema objeto de este documento es un producto de
software profesional, no un programa personal. Por ello, el **Módulo 3 (SRS)** genera
documentación formal del sistema (no solo código), y los **Módulos 1 y 2** incluyen
flujos de configuración, validación y trazabilidad que van más allá del mero
funcionamiento técnico.

---

### 1.3 Tipos de Productos de Software: Genérico vs. Personalizado

*(Cap. 1 §1.1, p.6–7)*

> "Los ingenieros de software están interesados por el desarrollo de productos de
> software —es decir, software que puede venderse a un cliente. Existen dos tipos de
> productos de software:"

> "1. **Productos genéricos** Consisten en sistemas independientes que se producen por
> una organización de desarrollo y se venden en el mercado abierto a cualquier cliente
> que desee comprarlos. Ejemplos de este tipo de productos incluyen software para PC,
> como bases de datos, procesadores de texto, paquetes de dibujo y herramientas de
> administración de proyectos."

> "2. **Productos personalizados o a la medida** Son sistemas que están destinados para
> un cliente en particular. Un contratista de software desarrolla el programa
> especialmente para dicho cliente. Ejemplos de este tipo de software incluyen los
> sistemas de control para dispositivos electrónicos, sistemas escritos para apoyar
> cierto proceso empresarial y los sistemas de control de tráfico aéreo."

> "Una diferencia importante entre estos tipos de software es que, en productos
> genéricos, la organización que desarrolla el software controla la especificación del
> mismo. Para los productos personalizados, la organización que compra el software
> generalmente desarrolla y controla la especificación, por lo que los desarrolladores
> de software deben trabajar siguiendo dicha especificación."

**Clasificación del sistema:** El sistema que se documenta es un **producto
personalizado o a la medida**. El cliente define y controla la especificación. El
**Módulo 3 (SRS)** es, precisamente, el instrumento formal a través del cual el
cliente ejerce ese control sobre la especificación.

---

### 1.4 Por Qué el Software es Distinto a Otros Productos de Ingeniería

*(Cap. 1, p.4)*

> "Los sistemas de software son abstractos e intangibles. No están restringidos por las
> propiedades de los materiales, regidos por leyes físicas ni por procesos de
> fabricación. Esto simplifica la ingeniería de software, pues no existen límites
> naturales a su potencial. Sin embargo, debido a la falta de restricciones físicas,
> los sistemas de software pueden volverse rápidamente muy complejos, difíciles de
> entender y costosos de cambiar."

Esta naturaleza abstracta del software tiene tres consecuencias directas para el
sistema:

- La **complejidad** no es visible en el artefacto final; se gestiona con documentación
  (SRS, especificaciones) y procesos formales.
- Los **errores** no son desgaste físico: son errores de especificación o de
  implementación, por lo tanto prevenibles.
- El **cambio** no tiene límite físico, pero sí tiene costo: sin administración de
  requerimientos, el sistema se degrada.

**Aplicación en el sistema:** La naturaleza abstracta del software justifica que el
**Módulo 3** exista como disciplina formal. Sin un SRS controlado, el sistema puede
crecer en complejidad sin control, volverse costoso de cambiar y difícil de validar
ante el cliente.

---

## 2. ATRIBUTOS ESENCIALES DEL BUEN SOFTWARE

*(Cap. 1 §1.1, Figura 1.2, p.8)*

Sommerville establece cuatro atributos que toda aplicación de software profesional debe
satisfacer. Se reproducen a continuación con sus definiciones exactas.

| # | Atributo                      | Definición exacta (Figura 1.2, p.8)                                                                                                                                                                        | Cómo se mide / evalúa                                                                      |
|---|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| 1 | **Mantenimiento**             | "El software debe escribirse de tal forma que pueda evolucionar para satisfacer las necesidades cambiantes de los clientes. Éste es un atributo crítico porque el cambio del software es un requerimiento inevitable de un entorno empresarial variable." | Facilidad de modificar, extender y entender el código y la documentación sin regresiones. |
| 2 | **Confiabilidad y seguridad** | "La confiabilidad del software incluye un rango de características que abarcan fiabilidad, seguridad y protección. El software confiable no tiene que causar daño físico ni económico, en caso de falla del sistema. Los usuarios malintencionados no deben tener posibilidad de acceder al sistema o dañarlo." | Tasa de fallos, disponibilidad, ausencia de vulnerabilidades, integridad de datos.         |
| 3 | **Eficiencia**                | "El software no tiene que desperdiciar los recursos del sistema, como la memoria y los ciclos del procesador. Por lo tanto, la eficiencia incluye capacidad de respuesta, tiempo de procesamiento, utilización de memoria, etcétera." | Tiempo de respuesta, uso de CPU/memoria, throughput bajo carga normal y pico.              |
| 4 | **Aceptabilidad**             | "El software debe ser aceptable al tipo de usuarios para quienes se diseña. Esto significa que necesita ser comprensible, utilizable y compatible con otros sistemas que ellos usan." | Pruebas de usabilidad, tasa de adopción, compatibilidad con entornos del cliente.          |

> "El conjunto específico de atributos que se espera de un sistema de software depende
> evidentemente de su aplicación." *(p.7)*

**Aplicación en el sistema:** Estos cuatro atributos son los **criterios de calidad no
negociables** que el **Módulo 3 (SRS)** debe capturar como Requerimientos No
Funcionales (RNF). Cada uno se traduce en secciones específicas del SRS:
- **Mantenimiento** → RNF de arquitectura y modularidad del código.
- **Confiabilidad y seguridad** → RNF de disponibilidad, autenticación y protección de
  datos.
- **Eficiencia** → RNF de rendimiento y tiempos de respuesta.
- **Aceptabilidad** → RNF de usabilidad e integración con sistemas del cliente.

---

## 3. DESAFÍOS FUNDAMENTALES APLICABLES AL SISTEMA

*(Cap. 1 §1.1, p.10)*

Sommerville identifica tres desafíos generales que afectan a la ingeniería de software
actual. Los tres son directamente relevantes para el sistema.

### 3.1 Heterogeneidad

> "Cada vez con mayor frecuencia se requieren sistemas que operen como distribuidos a
> través de redes que incluyan diferentes tipos de computadoras y dispositivos móviles.
> Es posible que el software se ejecute tanto en computadoras de propósito general como
> en teléfonos móviles. Se tendrá que integrar con frecuencia el nuevo software con
> sistemas legados más viejos, escritos en diferentes lenguajes de programación. El
> reto aquí es desarrollar técnicas para construir software confiable que sea
> suficientemente flexible para enfrentar esa heterogeneidad."

**Aplicación en el sistema:** El sistema opera en múltiples entornos: web (Next.js),
móvil (Flutter), y puede integrarse con infraestructuras distintas según el cliente.
El **Módulo 2** debe registrar la configuración técnica específica de cada proyecto
(entorno de despliegue, integraciones, plataformas objetivo), y el **Módulo 3** debe
especificar los requerimientos de portabilidad e interoperabilidad como RNF
formales.

---

### 3.2 Cambio Empresarial y Social

> "Los negocios y la sociedad cambian de manera increíblemente rápida, conforme se
> desarrollan las economías emergentes y nuevas tecnologías están a la disposición.
> Ambos necesitan tener la posibilidad de cambiar su software existente y desarrollar
> rápidamente uno nuevo. Muchas técnicas tradicionales de la ingeniería de software
> consumen tiempo, y generalmente la entrega de los nuevos sistemas tarda más de lo
> planeado. Requieren evolucionar de modo que se reduzca el tiempo necesario para que
> el software dé valor a sus clientes."

**Aplicación en el sistema:** Los requerimientos del sistema evolucionarán durante el
ciclo de vida del proyecto. Este desafío justifica por qué el **Módulo 3** incluye
un proceso formal de **administración de cambios**: ningún cambio de alcance se
incorpora al SRS sin pasar por un gate de aprobación documentado, protegiendo así
tanto al cliente como al equipo desarrollador.

---

### 3.3 Seguridad y Confianza

> "Dado que el software está vinculado con todos los aspectos de la vida, es esencial
> confiar en dicho software. Esto es especialmente cierto para los sistemas de software
> remoto a los que se accede a través de una página Web o una interfaz de servicio Web.
> Es necesario asegurarse de que usuarios malintencionados no puedan atacar el software
> y que se conserve la seguridad de la información."

**Aplicación en el sistema:** El sistema maneja datos confidenciales de clientes,
proveedores y proyectos. Este desafío fundamenta: (a) que el **Módulo 1** requiera
un NDA (Acuerdo de Confidencialidad) antes del registro de cualquier entidad
sensible, y (b) que el **Módulo 3** incluya RNF de seguridad explícitos
(autenticación, autorización, cifrado de datos en tránsito y en reposo).

---

## 4. LAS 4 ACTIVIDADES ESENCIALES DEL PROCESO DE SOFTWARE

*(Cap. 1 §1.1, p.9 / Cap. 2 §2.0, p.28)*

> "Un proceso de software es una secuencia de actividades que conducen a la elaboración
> de un producto de software. Existen cuatro actividades fundamentales que son comunes
> a todos los procesos de software:"

---

### 4.1 Especificación del Software

> "Especificación del software, donde clientes e ingenieros **definen el software que
> se producirá y las restricciones en su operación**."

*(Definición complementaria, Cap. 2, p.28)*

> "Especificación del software — Tienen que definirse tanto la funcionalidad del
> software como las restricciones de su operación."

**Entregable que produce:** El documento SRS (Software Requirements Specification),
que detalla qué debe hacer el sistema y bajo qué restricciones debe operar.

**Ejecución en el sistema:** Esta actividad se ejecuta íntegramente en el **Módulo 3**.
El SRS generado es el contrato técnico entre el cliente y el equipo de desarrollo.

---

### 4.2 Desarrollo del Software

> "Desarrollo del software, donde **se diseña y programa el software**."

*(Definición complementaria, Cap. 2, p.28)*

> "Diseo e implementación del software — Debe desarrollarse el software para cumplir
> con las especificaciones."

**Entregable que produce:** Código fuente, arquitectura implementada, artefactos de
diseño (diagramas, modelos).

**Ejecución en el sistema:** Esta actividad es la **fase posterior** al sistema
documentado en estos tres módulos. El presente sistema (Módulos 1, 2 y 3) produce los
insumos (SRS, configuración de proyecto, datos de clientes) necesarios para que la fase
de desarrollo comience correctamente.

---

### 4.3 Validación del Software

> "Validación del software, donde **se verifica el software para asegurar que sea lo
> que el cliente requiere**."

*(Definición complementaria, Cap. 2, p.28)*

> "Validación del software — Hay que validar el software para asegurarse de que cumple
> lo que el cliente quiere."

**Entregable que produce:** Reportes de prueba, actas de aceptación, evidencia de
conformidad con los requerimientos.

**Ejecución en el sistema:** La validación opera como **gates de aprobación** en los
tres módulos: al registrar un cliente o proveedor (Módulo 1), al finalizar la
configuración de un proyecto (Módulo 2), y al aprobar el SRS completo (Módulo 3).
Ningún entregable pasa al siguiente módulo sin validación formal.

---

### 4.4 Evolución del Software

> "Evolución del software, donde **se modifica el software para reflejar los
> requerimientos cambiantes del cliente y del mercado**."

*(Definición complementaria, Cap. 2, p.28)*

> "Evolución del software — El software tiene que evolucionar para satisfacer las
> necesidades cambiantes del cliente."

**Entregable que produce:** Versiones actualizadas del software, registros de cambio,
SRS revisado.

**Ejecución en el sistema:** La administración de cambios del **Módulo 3** es el
mecanismo formal que gestiona esta actividad. Toda solicitud de cambio sobre el SRS
aprobado activa un proceso controlado de evolución, con trazabilidad completa.

---

## 5. ÉTICA Y RESPONSABILIDAD PROFESIONAL

*(Cap. 1 §1.2, p.14–16)*

### 5.1 Responsabilidad Profesional Ampliada

> "Como ingeniero de software, usted debe aceptar que su labor implica
> responsabilidades mayores que la simple aplicación de habilidades técnicas. También
> debe comportarse de forma ética y moralmente responsable para ser respetado como un
> ingeniero profesional."

> "La ingeniería de software se realiza dentro de un marco social y legal que limita
> la libertad de la gente que trabaja en dicha área."

---

### 5.2 Las 4 Áreas de Responsabilidad Profesional

*(Cap. 1 §1.2, p.14)*

> "Sin embargo, existen áreas donde los estándares de comportamiento aceptable no
> están acotados por la legislación, sino por la noción más difusa de responsabilidad
> profesional. Algunas de ellas son:"

| # | Área                              | Definición exacta del libro                                                                                                                                                                     |
|---|-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1 | **Confidencialidad**              | "Por lo general, debe respetar la confidencialidad de sus empleadores o clientes sin importar si se firmó o no un acuerdo formal sobre la misma."                                               |
| 2 | **Competencia**                   | "No debe desvirtuar su nivel de competencia. Es decir, no hay que aceptar de manera intencional trabajo que esté fuera de su competencia."                                                      |
| 3 | **Derechos de propiedad intelectual** | "Tiene que conocer las leyes locales que rigen el uso de la propiedad intelectual, como las patentes y el copyright. Debe ser cuidadoso para garantizar que se protege la propiedad intelectual de empleadores y clientes." |
| 4 | **Mal uso de computadoras**       | "No debe emplear sus habilidades técnicas para usar incorrectamente las computadoras de otros individuos. El mal uso de computadoras varía desde lo relativamente trivial [...] hasta lo extremadamente serio (diseminación de virus u otro malware)." |

---

### 5.3 Los 8 Principios del Código ACM/IEEE

*(Cap. 1 §1.2, Figura 1.3, p.15)*

> "Los ingenieros de software deben comprometerse a hacer del análisis, la
> especificación, el diseño, el desarrollo, la prueba y el mantenimiento del software,
> una profesión benéfica y respetada."

| # | Principio        | Descripción del código                                                                                                                                  |
|---|------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1 | **PÚBLICO**      | Los ingenieros de software deben actuar consecuentemente con el interés del público.                                                                    |
| 2 | **CLIENTE Y EMPLEADOR** | Los ingenieros de software tienen que comportarse de tal forma que fomente el mejor interés para su cliente y empleador, en coherencia con el interés público. |
| 3 | **PRODUCTO**     | Los ingenieros de software deben garantizar que sus productos y modificaciones relacionadas satisfagan los estándares profesionales más altos posibles.  |
| 4 | **JUICIO**       | Los ingenieros de software tienen que mantener integridad e independencia en su juicio profesional.                                                     |
| 5 | **GESTIÓN**      | Los administradores y líderes en la ingeniería de software deben suscribir y promover un enfoque ético a la gestión del desarrollo y el mantenimiento del software. |
| 6 | **PROFESIÓN**    | Los ingenieros de software tienen que fomentar la integridad y la reputación de la profesión consecuente con el interés público.                        |
| 7 | **COLEGAS**      | Los ingenieros de software deben ser justos con sus colegas y apoyarlos.                                                                                |
| 8 | **UNO MISMO**    | Los ingenieros de software tienen que intervenir en el aprendizaje para toda la vida, en cuanto a la práctica de su profesión, y promover un enfoque ético. |

**Aplicación en el sistema:**
- El principio de **Confidencialidad** (área 1) justifica que el **Módulo 1** requiera
  la firma de un NDA antes de registrar datos de clientes o proveedores. El libro
  establece que esta obligación existe incluso sin acuerdo formal; el NDA lo formaliza
  y lo hace exigible contractualmente.
- Los principios **PRODUCTO** y **CLIENTE Y EMPLEADOR** justifican que el SRS del
  **Módulo 3** sea un **documento contractual formal**: no es una lista de deseos, sino
  un compromiso vinculante que protege a ambas partes y que puede ser revisado
  judicialmente en caso de disputa.

---

## 6. CLASIFICACIÓN FORMAL DEL SISTEMA

*(Cap. 1 §1.1, p.6–7 y p.10–12)*

Esta sección establece la identidad formal del sistema ante clientes y organismos
externos.

### 6.1 Tipo de Producto

**Clasificación:** Producto personalizado o a la medida *(Cap. 1 §1.1, p.7)*

**Fundamento:** El cliente define y controla la especificación del sistema. El equipo
desarrollador trabaja siguiendo dicha especificación. Esto se operacionaliza a través
del SRS generado en el Módulo 3.

---

### 6.2 Tipo de Aplicación según la Taxonomía del Cap. 1

*(Cap. 1 §1.1.2, p.10–12)*

El sistema corresponde a la categoría:

> "**Aplicaciones interactivas basadas en transacción** — Consisten en aplicaciones
> que se ejecutan en una computadora remota y a las que los usuarios acceden desde sus
> propias PC o terminales [...] Esta clase de aplicación también incluye sistemas
> empresariales, donde una organización brinda acceso a sus sistemas a través de un
> navegador Web o un programa de cliente de propósito especial y servicios basados en
> nube, como correo electrónico y comparticón de fotografías. Las aplicaciones
> interactivas incorporan con frecuencia un gran almacén de datos al que se accede y
> actualiza en cada transacción."

El sistema gestiona registros (clientes, proveedores, proyectos, objetivos) accedidos
por múltiples usuarios a través de interfaces web y móvil, con persistencia en base de
datos remota (Firebase/GCP).

---

### 6.3 Nivel de Criticidad

El sistema maneja información confidencial de terceros (clientes y proveedores
empresariales) y documenta el alcance legal de proyectos de alto valor. Su criticidad
es **media-alta** en términos de:

- **Confidencialidad de datos:** Información de clientes y proveedores con potencial
  impacto legal si se expone.
- **Integridad del SRS:** Errores en el alcance documentado tienen consecuencias
  contractuales directas.
- **Disponibilidad:** Una falla del sistema bloquea la operación del flujo de onboarding
  de clientes y la aprobación de proyectos.

No es un sistema de seguridad crítica (no controla hardware ni riesgo de vidas), pero
sí es un **sistema de información empresarial crítico para la operación**.

---

## 7. TABLA DE CONEXIONES CON LOS 3 MÓDULOS

| Concepto del Cap. 1                         | Módulo donde aplica          | Fase específica                                                                 |
|---------------------------------------------|------------------------------|---------------------------------------------------------------------------------|
| Definición de IS: todos los aspectos        | Módulos 1, 2 y 3             | Justifica que cada módulo produzca documentación formal, no solo código         |
| Producto personalizado (spec. del cliente)  | Módulo 3                     | El cliente controla y aprueba el SRS                                            |
| Diferencia programa vs. producto profesional| Módulos 1, 2 y 3             | Cada módulo incluye documentación, validación y configuración                   |
| Atributo: Mantenimiento                     | Módulo 3 — RNF               | Especificación de requerimientos de arquitectura mantenible                     |
| Atributo: Confiabilidad y seguridad         | Módulo 1 y Módulo 3          | NDA en registro (M1), RNF de seguridad en SRS (M3)                             |
| Atributo: Eficiencia                        | Módulo 3 — RNF               | Especificación de tiempos de respuesta y uso de recursos                        |
| Atributo: Aceptabilidad                     | Módulo 3 — RNF               | Especificación de usabilidad e integración con entornos del cliente             |
| Desafío: Heterogeneidad                     | Módulo 2 y Módulo 3          | Config. de entorno por proyecto (M2), RNF portabilidad (M3)                    |
| Desafío: Cambio empresarial                 | Módulo 3                     | Proceso de administración de cambios sobre el SRS aprobado                      |
| Desafío: Seguridad y confianza              | Módulo 1 y Módulo 3          | NDA obligatorio al registrar (M1), RNF de seguridad (M3)                        |
| Actividad: Especificación                   | Módulo 3                     | Generación del SRS completo                                                     |
| Actividad: Desarrollo                       | Fase posterior al sistema    | Insumos entregados por los 3 módulos al equipo de desarrollo                    |
| Actividad: Validación                       | Módulos 1, 2 y 3             | Gates de aprobación al final de cada módulo                                     |
| Actividad: Evolución                        | Módulo 3                     | Administración de cambios post-aprobación del SRS                               |
| Ética: Confidencialidad                     | Módulo 1                     | NDA antes de registro de clientes/proveedores                                   |
| Ética: Principio PRODUCTO (ACM/IEEE)        | Módulo 3                     | SRS como documento contractual con estándares profesionales                     |
| Ética: Principio CLIENTE Y EMPLEADOR        | Módulo 3                     | SRS protege los intereses del cliente y del equipo                              |
| Tipo de aplicación: Interactiva-transaccional | Módulos 1, 2 y 3           | Define arquitectura base: web/móvil con persistencia remota                     |

---

## 8. CHECKLIST DE COMPLETITUD — CAPÍTULO 1

Todos los ítems del Capítulo 1 relevantes al sistema han sido extraídos y documentados.

### Sección 1.1 — Desarrollo de software profesional

- [x] Definición formal de Ingeniería de Software (§1.1.1)
- [x] Las dos frases clave de la definición: disciplina de ingeniería + todos los aspectos
- [x] Diferencia entre programa personal y producto de software profesional
- [x] Los dos tipos de productos: genérico y personalizado (con definiciones exactas)
- [x] Diferencia de control de especificación entre tipos de producto
- [x] Naturaleza abstracta e intangible del software
- [x] Por qué el software puede volverse complejo y costoso de cambiar
- [x] Los 4 atributos esenciales (Figura 1.2): mantenimiento, confiabilidad, eficiencia, aceptabilidad
- [x] Las 4 actividades fundamentales del proceso de software
- [x] Los 3 desafíos generales: heterogeneidad, cambio empresarial, seguridad/confianza
- [x] Clasificación de tipos de aplicación (§1.1.2) — aplicada al sistema

### Sección 1.2 — Ética en la ingeniería de software

- [x] Responsabilidad profesional más allá del aspecto técnico
- [x] Las 4 áreas de responsabilidad profesional (confidencialidad, competencia, PI, mal uso)
- [x] Los 8 principios del Código ACM/IEEE (Figura 1.3)

### Ítems excluidos (justificación)

| Ítem del Cap. 1           | Razón de exclusión                                                                   |
|---------------------------|--------------------------------------------------------------------------------------|
| §1.1.3 Ingeniería de software y la Web | Contexto histórico, no agrega criterio de decisión al sistema           |
| §1.3 Estudios de caso (MHC-PMS, bomba de insulina, estación meteorológica) | Explícitamente excluidos por instrucción: dominios ajenos |
| Dilemas éticos en sistemas militares/nucleares | Irrelevante para el dominio del sistema               |
| Historia de la IS (p.5)   | Contexto histórico sin impacto en decisiones del sistema                             |

---

*Fin del documento — Versión 1.0.0*
*Fuente única: Sommerville, Ian. Ingeniería de Software, 9ª Edición. Pearson / Addison-Wesley, 2011. ISBN 978-607-32-0603-7*
