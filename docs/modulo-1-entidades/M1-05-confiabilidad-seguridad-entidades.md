# M1-05 — Confiabilidad y Seguridad: Marco Teórico Aplicado a Entidades

***

## Metadatos del Documento

| Campo | Valor |
|---|---|
| **Nombre del archivo** | `M1-05-confiabilidad-seguridad-entidades.md` |
| **Módulo principal** | Módulo 1 — Registro de Clientes y Proveedores (Entidades) |
| **Capítulos fuente** | Cap. 11 completo · Cap. 12 §12.4 |
| **Fuente bibliográfica** | Sommerville, Ian. *Ingeniería de Software*, 9ª ed. Pearson, 2011 |
| **Versión** | 1.0.0 |
| **Fecha** | 2026-02-24 |
| **Estado** | ✅ Completo — Marco teórico base |
| **Relacionado con** | `types/index.ts` → `Entidad`, `NivelRiesgoEntidad`, `RolUsuario` |

***

## Objetivo del Documento

Este archivo establece el marco teórico de **confiabilidad y seguridad** según Sommerville, aplicado a la plataforma de gestión y, en particular, al **Módulo 1 — Registro de Entidades** (clientes y proveedores).

La confiabilidad y la seguridad no son propiedades técnicas opcionales: son **propiedades emergentes del sistema**  que impactan directamente la relación contractual con cada entidad. Una plataforma que gestiona NDAs digitales, requerimientos confidenciales y estructuras organizacionales de empresas de alto calibre está sujeta a **obligaciones contractuales de protección de datos** que derivan en requerimientos no funcionales (RNF) concretos, especialmente en los Módulos 2 y 3.

El documento cubre:

- Las 4 propiedades de confiabilidad como criterios de calidad no negociables (§11.1)
- Métricas técnicas de disponibilidad y fiabilidad para negociación de SLAs (§11.2)
- Protección como fundamento del modelo de roles y permisos (§11.3)
- Seguridad, tipos de amenazas y gestión de controles (§11.4)
- Especificación de requerimientos de seguridad dirigida por riesgos (§12.4)
- Marco operativo para NDAs y tabla de activos del sistema
- RNF de seguridad justificados con citas exactas del libro

***

## 3. Propiedades de Confiabilidad (Cap. 11 §11.1)

### 3.1 Definición Formal de Confiabilidad

> *"La confiabilidad de un sistema de cómputo es una propiedad del sistema que refleja su fiabilidad. Aquí, esta última significa en esencia el grado de confianza que un usuario tiene que el sistema ejecutará como se espera, y que el sistema no fallará en su uso normal."*
> — Sommerville, Cap. 11, p. 291 

El término **confiabilidad** (*dependability*) fue propuesto por Laprie (1995) para cubrir de forma unificada los atributos de disponibilidad, fiabilidad, protección y seguridad. Estas propiedades están *inextricablemente vinculadas*, por lo que tiene sentido tratarlas bajo un solo concepto .

### 3.2 Las 4 Propiedades Principales

Sommerville define las cuatro dimensiones principales de la confiabilidad de la siguiente manera (Cap. 11 §11.1, p. 292) :

| Propiedad | Definición exacta (Sommerville) | Capacidad del sistema |
|---|---|---|
| **Disponibilidad** | *"De manera informal, la disponibilidad de un sistema es la probabilidad de que en un momento dado éste funcionará, ejecutará y ofrecerá servicios útiles a los usuarios."* | Entregar servicios cuando se requiera |
| **Fiabilidad** | *"De manera informal, la fiabilidad de un sistema es la probabilidad, durante un tiempo determinado, de que el sistema brindará correctamente servicios como espera el usuario."* | Entregar servicios según se especifique |
| **Protección (Safety)** | *"De modo no convencional, la protección de un sistema es un juicio de cuán probable es que el sistema causará daños a las personas o su ambiente."* | Ejecutar sin fallas catastróficas |
| **Seguridad (Security)** | *"Informalmente, la seguridad de un sistema es un juicio de cuán probable es que el sistema pueda resistir intrusiones accidentales o deliberadas."* | Protegerse contra intrusión accidental o deliberada |

### 3.3 Propiedades como Propiedad Emergente

La confiabilidad —incluyendo la seguridad— es una **propiedad emergente del sistema** . Según Sommerville:

> *"Fiabilidad, rendimiento, seguridad y protección son ejemplos de propiedades emergentes. Éstas son críticas para los sistemas basados en computadora, pues las fallas para lograr un nivel mínimo definido en dichas propiedades suelen hacer inútil al sistema."*
> — Cap. 10 §10.1.1, p. 269 

Esto significa que la confiabilidad **no puede añadirse al sistema después del desarrollo**. Debe incorporarse desde la especificación de requerimientos, el diseño arquitectónico y cada decisión técnica del ciclo de vida. Un sistema que se construya sin considerar estas propiedades desde el inicio requerirá un costo exponencialmente mayor para corregirlas .

### 3.4 Interdependencia entre Propiedades

Las propiedades de confiabilidad no son independientes. Sommerville describe cómo la mejora o degradación de una afecta directamente a las demás (Cap. 11 §11.1, p. 293–294) :

- Un sistema se vuelve **no fiable** cuando un curioso corrompe sus datos → la seguridad afecta la fiabilidad.
- Los ataques de negación de servicio comprometen la **disponibilidad** → la falta de seguridad afecta la disponibilidad.
- Si un sistema se infecta con un virus, ya no se puede confiar en su **fiabilidad ni en su protección** → la seguridad es condición de las demás.

> *"Sin un nivel razonable de seguridad, la disponibilidad, fiabilidad y protección del sistema estarían comprometidas si ataques externos dañan el sistema."*
> — Sommerville, Cap. 11, Puntos clave, p. 306 

***

**Aplicación en el sistema:** Las 4 propiedades son los criterios no negociables de calidad que la plataforma debe garantizar ante sus entidades clientes. Cada una se traduce en requerimientos no funcionales del Módulo 3 (SRS): disponibilidad en forma de SLA, fiabilidad como ROCOF/POFOD, protección como control de roles, y seguridad como cifrado + auditoría. El campo `nivelRiesgo: NivelRiesgoEntidad` en el tipo `Entidad` debe vincularse al nivel de exigencia de estas 4 propiedades.

***

## 4. Disponibilidad y Fiabilidad (Cap. 11 §11.2)

### 4.1 Definiciones Técnicas con Métricas

Sommerville precisa las definiciones técnicas (Cap. 11 §11.2, p. 295–296) :

> *"**Fiabilidad:** La probabilidad de operación libre de falla durante cierto tiempo, en un entorno dado, para un propósito específico."*

> *"**Disponibilidad:** La probabilidad de que un sistema, en un momento en el tiempo, sea operativo y brinde los servicios solicitados."*

Las métricas técnicas asociadas son:

| Métrica | Nombre completo | Qué mide |
|---|---|---|
| **MTTF** | Mean Time To Failure (Tiempo Medio hasta la Falla) | Tiempo promedio que opera el sistema sin fallar; aplica a fiabilidad |
| **MTTR** | Mean Time To Repair (Tiempo Medio de Reparación) | Tiempo promedio necesario para restaurar el sistema tras una falla |
| **ROCOF** | Rate of Occurrence of Failures (Tasa de Ocurrencia de Fallas) | Frecuencia con que ocurren fallas en el tiempo |
| **POFOD** | Probability of Failure on Demand (Probabilidad de Falla bajo Demanda) | Probabilidad de que el sistema falle cuando se le solicita un servicio |

La **fórmula de disponibilidad** presentada implícitamente por Sommerville (Cap. 11 §11.2, p. 296) es:

\[ \text{Disponibilidad} = \frac{\text{MTTF}}{\text{MTTF} + \text{MTTR}} \]

Si la disponibilidad es 0.999, el sistema está disponible el 99.9% del tiempo . Si la fiabilidad expresada como tasa de ocurrencia de falla es 0.002, significa que 2 de cada 1 000 entradas causan fallas .

### 4.2 Diferencia Clave: Disponibilidad ≠ Fiabilidad

Sommerville ilustra la diferencia con un ejemplo directo (Cap. 11 §11.2, p. 296) :

> *"Si el sistema A falla una vez al año y el sistema B falla una vez al mes, entonces a todas luces A es más fiable que B. Sin embargo, suponga que el sistema A tarda tres días en reiniciarse después de una falla, mientras que el sistema B tarda sólo 10 minutos en reiniciar. La disponibilidad del sistema B durante el año (120 minutos de tiempo muerto) es mucho mejor que la del sistema A (4,320 minutos de tiempo muerto)."*

Un sistema puede tener **alta disponibilidad y baja fiabilidad** si sus fallas son frecuentes pero de recuperación rápida. El conmutador telefónico es el ejemplo canónico del libro: *"los usuarios esperan un tono de marcado cuando levantan el auricular, así que el sistema tiene altos requerimientos de disponibilidad. Si ocurre una falla del sistema mientras se establece una conexión, esto con frecuencia es rápidamente recuperable"* .

### 4.3 Fiabilidad Percibida vs. Fiabilidad Medida

Sommerville distingue la fiabilidad medida de la percibida (Cap. 11 §11.2, p. 297–298) :

- Un programa puede contener **fallas en el desarrollo conocidas** y aun así percibirse como fiable porque los usuarios nunca ejecutan el código defectuoso.
- La fiabilidad percibida depende del **patrón de uso del sistema**: si las entradas que causan fallas nunca son producidas por los usuarios reales, el sistema se comporta de forma confiable desde su perspectiva.
- Los usuarios adaptan su comportamiento para **evitar las características que saben que fallan**, reduciendo efectivamente la tasa de errores observada.

### 4.4 Fiabilidad y Comportamiento del Usuario

La fiabilidad no es una propiedad absoluta del software: depende del entorno y modo de uso . Medir la fiabilidad en un entorno de oficina controlado puede dar resultados muy distintos a medirla en un entorno universitario donde los usuarios experimentan con el sistema. Las fallas que solo ocurren en ciertos patrones de uso tienen **bajo impacto práctico** en la fiabilidad operacional aunque existan como fallas en el desarrollo.

***

**Aplicación en el sistema:** El SLA (Service Level Agreement) negociado con cada entidad cliente en el Módulo 2 debe expresarse con estas métricas. Por ejemplo: `disponibilidad_objetivo: 0.999`, `POFOD_máximo: 0.001`. Estos valores deben quedar registrados como RNF en el Módulo 3 (SRS del proyecto). El campo `nivelRiesgo` de la entidad puede condicionar umbrales más exigentes: una entidad de `nivelRiesgo: ALTO` requiere SLAs más estrictos que una de `nivelRiesgo: BAJO`.

***

## 5. Protección — Safety (Cap. 11 §11.3)

### 5.1 Definición de Protección

> *"La protección de un sistema es un atributo que refleja la habilidad del mismo para ejecutar, normal o anormalmente, sin lesionar a los individuos o dañar el ambiente."*
> — Sommerville, Cap. 11, Puntos clave, p. 306 

Los sistemas críticos para la protección son aquellos en los que *"resulta esencial que la operación del sistema sea segura en todo momento; esto es, el sistema nunca debe dañar a las personas o a su entorno, incluso cuando falle"* (Cap. 11 §11.3, p. 299) .

### 5.2 Tipos de Daño que un Fallo puede Causar

Sommerville clasifica el daño que un fallo del sistema puede generar (Cap. 11 §11.3, p. 301) :

- **Daño accidental:** causado por errores de especificación, fallas de hardware no anticipadas, o entradas incorrectas de operadores sin intención maliciosa.
- **Daño deliberado:** causado por actores externos o internos que explotan vulnerabilidades del sistema.

El vocabulario especializado de protección incluye (Cap. 11 §11.3, Figura 11.6, p. 301) :

| Término | Definición (Sommerville) |
|---|---|
| **Accidente/Contratiempo** | Evento no planeado o secuencia de eventos que derivan en muerte o lesin de un individuo, o daño a la propiedad o al ambiente |
| **Peligro** | Condición con el potencial para causar o contribuir a un accidente |
| **Daño** | Medida de la pérdida que resulta de un contratiempo |
| **Severidad del peligro** | Valoración del peor daño posible resultante de un peligro particular |
| **Riesgo** | Medida de probabilidad de que el sistema causará un accidente |

### 5.3 Niveles de Protección

Sommerville describe tres enfoques complementarios para garantizar la protección (Cap. 11 §11.3, p. 302) :

1. **Evitar el peligro:** diseñar el sistema de modo que no puedan surgir ciertos estados peligrosos.
2. **Detectar y eliminar el peligro:** incluir mecanismos que detecten condiciones peligrosas antes de que produzcan un accidente.
3. **Limitar el daño:** incluir características de protección que minimicen las consecuencias si ocurre un accidente.

### 5.4 Protección en Sistemas de Negocio (no solo físicos)

Sommerville clasifica el software crítico para la protección en dos categorías (Cap. 11 §11.3, p. 300) :

> *"**Software secundario crítico para la protección** es un software que podría repercutir **indirectamente** en una lesión. Un ejemplo... es el sistema de administración de atención a la salud mental, MHC-PMS. La falla de este sistema cuando un paciente inestable no se trata de manera adecuada podría llevar a que éste se lesione a sí mismo o a otros."*

Una plataforma de gestión de proyectos con datos contractuales es análogamente un **sistema secundario crítico**: su fallo no causa daño físico directo, pero puede causar **daño organizacional severo e irreversible**: pérdida de información confidencial de clientes, incumplimiento de NDAs, compromisos legales.

***

**Aplicación en el sistema:** La protección justifica el modelo de roles `RolUsuario: admin | gestor | analista | viewer`. Un analista no debe poder eliminar una entidad ni su historial de proyectos porque eso constituye un daño organizacional irreversible (pérdida de datos contractuales, violación de confidencialidad). El sistema debe diseñar el *control de acceso por rol* como un mecanismo de **evitación del peligro** (nivel 1 de protección), no como una comodidad técnica.

***

## 6. Seguridad (Cap. 11 §11.4)

### 6.1 Definición y Tipos de Amenazas

#### Definición Formal

> *"La seguridad es un atributo del sistema que refleja la habilidad de éste para protegerse a sí mismo de ataques externos, que podrían ser accidentales o deliberados."*
> — Sommerville, Cap. 11 §11.4, p. 302 

#### Terminología de Seguridad (Cap. 11 §11.4, Figura 11.7, p. 303)

| Término | Definición exacta (Sommerville) |
|---|---|
| **Activo** | *Algo de valor que debe protegerse. El activo sería el sistema de software en sí o los datos usados por dicho sistema.* |
| **Exposición** | *Posible pérdida o daño a un sistema de cómputo. Esto sería la pérdida o el daño a los datos, o bien, una pérdida de tiempo y esfuerzo si es necesaria la recuperación después de una violación a la seguridad.* |
| **Vulnerabilidad** | *Una debilidad en un sistema basado en computadora que puede aprovecharse para causar pérdida o daño.* |
| **Ataque** | *Aprovechamiento de una vulnerabilidad del sistema. Por lo general, es desde afuera del sistema y es un intento deliberado por causar cierto daño.* |
| **Amenaza** | *Circunstancias que tienen potencial para causar pérdida o daño. Se puede pensar en ellas como una vulnerabilidad de sistema que está sujeta a un ataque.* |
| **Control** | *Medida de protección que reduce la vulnerabilidad de un sistema. La encriptación es un ejemplo de control que reduce la vulnerabilidad de un sistema de control de acceso débil.* |

#### Los 4 Tipos de Amenazas (Cap. 11 §11.4 / Cap. 14 §14.1, con clasificación Pfleeger)

Sommerville, citando a Pfleeger & Pfleeger (2007), clasifica las amenazas en cuatro categorías (Cap. 14 §14.1, p. 371) :

| Tipo de Amenaza | Definición | Ejemplo en el sistema |
|---|---|---|
| **Interrupción** | *"Sucede cuando los servicios del sistema son atacados y no pueden entregarse como se esperaba. Los ataques de negación de servicio implican el bombardeo de un nodo con peticiones de servicio ilegítimas, de modo que no se puede hacer frente a peticiones legítimas."* | Ataque DoS que deja inaccesibles los datos de entidades durante negociación contractual |
| **Intercepción** | *"Un atacante intercepta las comunicaciones entre las partes del sistema, para que haya poca confidencialidad."* | Captura de tokens de autenticación o datos de stakeholders en tránsito |
| **Modificación** | *"El atacante cambia los datos o servicios del sistema."* | Alteración del NDA digital de una entidad o de sus datos comerciales en la base de datos |
| **Fabricación** | *"Un atacante genera información que no debe existir y luego la usa para conseguir ciertos privilegios. Por ejemplo, un atacante puede generar una falsa entrada de contraseña y usarla para obtener el acceso a un sistema."* | Creación de credenciales falsas para acceder como administrador y extraer información confidencial |

Sommerville también clasifica las tres amenazas principales a cualquier sistema en red (Cap. 11 §11.4, p. 304) :

1. **Amenazas a la confidencialidad:** difunden información a individuos o programas no autorizados.
2. **Amenazas a la integridad:** dañan o corrompen el software o sus datos.
3. **Amenazas a la disponibilidad:** restringen el acceso al software o sus datos a usuarios autorizados.

#### Por qué la Seguridad es una Propiedad del Sistema Completo

> *"Para algunos sistemas, la seguridad es la dimensión más importante de confiabilidad del sistema. Los sistemas militares, los de comercio electrónico y los que requieren procesamiento e intercambio de información confidencial deben diseñarse de modo que logren un alto nivel de seguridad."*
> — Cap. 11 §11.4, p. 303 

La seguridad no es responsabilidad únicamente del código de la aplicación. Incluye el hardware, el sistema operativo, las redes, los procesos operacionales y el comportamiento humano. Las vulnerabilidades más comunes en sistemas sociotécnicos son *"fallas humanas más que problemas técnicos"*: contraseñas débiles, errores de configuración, falta de uso de software de protección (Cap. 11 §11.4, p. 304–305) .

### 6.2 Gestión de Seguridad

#### Controles de Seguridad

Sommerville describe tres tipos de controles equivalentes a los de protección (Cap. 11 §11.4, p. 305) :

1. **Evitar la vulnerabilidad:** diseñar el sistema de modo que los ataques no tengan éxito. La encriptación es el ejemplo canónico: *"Cualquier acceso no autorizado a datos encriptados significa que el atacante no puede leerlos."*
2. **Detectar y neutralizar ataques:** monitorizar la operación del sistema y detectar patrones de actividad inusuales.
3. **Limitar la exposición y recuperación:** estrategias de respaldo, replicación e incluso pólizas de seguro.

#### Autenticación vs. Autorización

La distinción entre autenticación y autorización es fundamental para el sistema de roles. Aunque Sommerville no define los términos en un glosario explícito, su distinción queda clara en el contexto de la gestión de acceso (Cap. 12 §12.4, p. 330; Cap. 14 §14.2.1, p. 374) :

| Concepto | Qué verifica | Pregunta que responde | Implementación típica |
|---|---|---|---|
| **Autenticación** | **Identidad** del usuario — confirmar que el usuario es quien dice ser | *"¿Quién eres?"* | Combinación nombre/contraseña, passphrase, token MFA |
| **Autorización** | **Permisos** del usuario — determinar qué acciones puede realizar según su rol | *"¿Qué puedes hacer?"* | Control de acceso por rol (RBAC), permisos por recurso |

Sommerville señala que la autenticación basada en *passphrase* es *"más segura que las passwords"* porque *"son más difíciles de descifrar por un atacante o de descubrir a través de un sistema automatizado de rompimiento de contraseñas"* (Cap. 12 §12.4, p. 330) .

#### Cifrado

El cifrado (*encriptación* en la traducción oficial) es descrito como un control de *evitación de vulnerabilidades*: *"Cualquier acceso no autorizado a datos encriptados significa que el atacante no puede leerlos. En la práctica, es muy costoso y consume mucho tiempo romper una encriptación fuerte."* (Cap. 11 §11.4, p. 305) . Es necesario en dos contextos:

- **En tránsito:** para proteger datos que viajan por la red contra intercepción.
- **En reposo:** para proteger datos almacenados contra acceso físico o lógico no autorizado.

#### Auditoría

El registro de auditoría es parte integral de la seguridad, no solo del debugging. Sommerville lo especifica como requerimiento de recuperación y trazabilidad (Cap. 12 §12.4, p. 332) :

> *"La bitácora de todos los cambios realizados a la base de datos del sistema y el iniciador de dichos cambios deberían mantenerse en una computadora separada del servidor de la base de datos. [...] El cuarto requerimiento es un requerimiento de recuperación y auditoría. Ello significa que los cambios pueden recuperarse al reproducir la bitácora de cambios y que es posible descubrir quién realizó los cambios. **Esto desalienta el mal uso del sistema por parte del personal autorizado.**"*

***

**Aplicación en el sistema:** Los 4 tipos de amenazas se mapean directamente a los controles de seguridad del sistema. **Interrupción** → alta disponibilidad y protección DoS. **Intercepción** → HTTPS + cifrado en tránsito de NDAs y tokens. **Modificación** → control de versiones de registros + auditoría de cambios. **Fabricación** → autenticación robusta con MFA + bloqueo de cuentas por intentos fallidos. Los datos de las entidades —NDA digitales, stakeholders, datos comerciales— son los **activos** que deben protegerse según la terminología de Sommerville.

***

## 7. Especificación de Seguridad (Cap. 12 §12.4)

### 7.1 Proceso de Análisis de Amenazas (Identificación de Activos)

Sommerville describe el proceso de especificación de seguridad dirigido por riesgos como una secuencia de etapas (Cap. 12 §12.4, p. 331) :

1. **Identificación del activo:** identificar los activos del sistema que podrían requerir protección — el sistema en sí, funciones particulares, y los datos asociados.
2. **Estimación del valor del activo:** evaluar el valor de los activos identificados.
3. **Valoración de la exposición:** valorar las pérdidas potenciales, incluyendo pérdidas directas (robo de información), costos de recuperación y posible pérdida de reputación.
4. **Identificación de amenazas:** identificar las amenazas a los activos del sistema.
5. **Valoración del ataque:** descomponer cada amenaza en ataques posibles y cómo podrían realizarse.
6. **Identificación del control:** proponer controles técnicos (encriptación, control de acceso, etc.) para proteger los activos.
7. **Valoración de factibilidad:** valorar la factibilidad técnica y los costos de los controles propuestos.

La **política de seguridad organizacional** es una entrada crítica a este proceso: *"establece condiciones que un sistema de seguridad debe mantener siempre, ya que ayudan a identificar amenazas que se puedan presentar"* (Cap. 12 §12.4, p. 332) .

### 7.2 Tipos de Requerimientos de Seguridad

Sommerville enumera 10 tipos de requerimientos de seguridad (Cap. 12 §12.4, p. 330) :

| # | Tipo de Requerimiento | Descripción |
|---|---|---|
| 1 | **Identificación y autenticación** | Cómo se identifica y autentica a los usuarios |
| 2 | **Autorización** | Qué recursos y servicios puede usar cada usuario autenticado |
| 3 | **Encriptación** | Cómo se protegen datos con cifrado |
| 4 | **Registro externo** | Protección de datos que salen del sistema |
| 5 | **Integridad** | Cómo se preserva la integridad de los datos |
| 6 | **Detección de intrusiones** | Mecanismos para detectar ataques |
| 7 | **No repudio** | Garantizar que una parte no pueda negar su participación en una transacción |
| 8 | **Privacidad** | Cómo se mantiene la privacidad de los datos |
| 9 | **Auditoría de seguridad** | Cómo puede auditarse y verificarse el uso del sistema |
| 10 | **Seguridad de mantenimiento** | Evitar que cambios autorizados deshabiliten mecanismos de seguridad |

### 7.3 Requerimientos Específicos por Área

#### Autenticación
El sistema debe verificar la identidad del usuario mediante credenciales. Sommerville señala que usar **passphrase** en lugar de password es una práctica de mayor seguridad. Si se usa password, deben implementarse *verificadores de contraseñas* que detecten contraseñas vulnerables (palabras del diccionario, nombres propios) y notifiquen al administrador (Cap. 12 §12.4 / Cap. 14, p. 374) .

#### Autorización
El sistema debe controlar qué puede hacer cada usuario según su rol. El ejemplo de política de seguridad militar en el libro es aplicable: *"los lectores pueden examinar sólo los documentos cuya clasificación sea la misma o esté por abajo del nivel de inspección del lector"* (Cap. 12 §12.4, p. 332) . Esta lógica se traduce directamente en el modelo `RolUsuario`.

#### Cifrado
Los datos sensibles deben cifrarse en reposo. Sommerville especifica como requerimiento ejemplo: *"Debe encriptarse en el sistema cliente toda la información de los pacientes"* (Cap. 12 §12.4, p. 332) . En el sistema, los datos equivalentes son NDAs digitales, datos de contacto de stakeholders y requerimientos confidenciales del SRS.

#### Auditoría
El registro de cambios debe almacenarse separado del servidor principal. Sommerville indica: *"La bitácora de todos los cambios realizados a la base de datos del sistema y el iniciador de dichos cambios deberían mantenerse en una computadora separada del servidor de la base de datos"* (Cap. 12 §12.4, p. 332) . Esto garantiza que los registros de auditoría no sean comprometidos si el servidor principal es atacado.

***

## 8. NDA como Requerimiento de Seguridad

### 8.1 Fundamento Teórico: NDA como Control de Seguridad Organizacional

Antes de ser un documento legal, el NDA es un **control de seguridad organizacional** que actúa en la capa *social* y *organizacional* del sistema sociotécnico (Cap. 10, p. 264) . Según la terminología de Sommerville, el NDA es un mecanismo de la categoría **"evitar la vulnerabilidad"** (Cap. 11 §11.4, p. 305) : establece condiciones legales que desincentivan el acceso no autorizado a la información antes de que ocurra, complementando los controles técnicos de cifrado y control de acceso.

Sommerville describe la política de seguridad de manera análoga: *"La política de seguridad establece condiciones que un sistema de seguridad debe mantener siempre, ya que ayudan a identificar amenazas que se puedan presentar"* (Cap. 12 §12.4, p. 332) . El NDA opera como esa política de seguridad en el nivel contractual con las entidades externas.

### 8.2 Qué Protege el NDA en el Sistema

Los activos protegidos por el NDA corresponden directamente a los activos identificables en los módulos del sistema (Cap. 12 §12.4, p. 331 — terminología de "activo") :

- **Datos de identificación de la entidad:** nombre, RUT, datos bancarios, estructura societaria.
- **Stakeholders y contactos:** personas clave, jerarquía organizacional, datos de contacto directivo.
- **Requerimientos y alcance del proyecto:** información del SRS en el Módulo 3, incluyendo problemas de negocio internos del cliente.
- **Documentos contractuales:** propuestas técnicas, términos económicos, condiciones especiales.
- **Información de arquitectura y soluciones técnicas propuestas.**

### 8.3 Campos del Sistema para Gestión de NDA

**Campos actuales en el tipo `Entidad`:**

| Campo | Tipo | Propósito de seguridad |
|---|---|---|
| `tieneNDA` | `boolean` | Indicador binario de existencia del acuerdo de confidencialidad |
| `fechaNDA` | `Date?` | Fecha de suscripción; relevante para vigencia y renovación |

**Campos propuestos para v2 (justificados por Cap. 11 §11.4 y Cap. 12 §12.4):**

| Campo propuesto | Tipo | Justificación Sommerville |
|---|---|---|
| `vencimientoNDA` | `Date?` | Auditoría de seguridad: saber cuándo expira el control (§12.4) |
| `nivelClasificacionNDA` | `enum` (`BASICO`, `ESTANDAR`, `CRITICO`) | Política de seguridad por niveles, análoga al modelo militar (§12.4) |
| `documentoNDA_ref` | `string` (hash o ID de Storage) | Referencia al documento cifrado; integridad del activo (§11.4) |
| `renovacionPendiente` | `boolean` | Control proactivo antes de expiración; evitar pérdida de cobertura |
| `responsableNDA` | `string` (userId) | No repudio: quién suscribió el acuerdo en el sistema (§12.4 — requerimiento tipo 7) |

### 8.4 Tabla de Activos del Sistema que Requieren Protección NDA o Equivalente

| Activo del sistema | Módulo | Nivel de confidencialidad | Control requerido |
|---|---|---|---|
| Datos de identificación de la Entidad (nombre, RUT, datos bancarios) | M1 | **Alto** | NDA + control de acceso por rol |
| Stakeholders y contactos directivos | M1 | **Alto** | NDA + cifrado en reposo |
| Tipo de entidad y relación comercial | M1 | **Medio** | Control de acceso por rol |
| `nivelRiesgo` de la entidad | M1 | **Alto** | Control de acceso: solo `admin` y `gestor` |
| Datos de configuración del proyecto (presupuesto, plazos) | M2 | **Alto** | NDA + control de acceso por rol |
| Riesgos identificados del proyecto | M2 | **Alto** | Control de acceso por rol (`analista` read-only) |
| Stakeholders del proyecto y sus roles | M2 | **Alto** | NDA + cifrado en reposo |
| Requerimientos funcionales del SRS | M3 | **Crítico** | NDA + control de versiones + auditoría |
| Alcance y límites del proyecto (SRS) | M3 | **Crítico** | NDA + cifrado en reposo |
| Supuestos y restricciones del SRS | M3 | **Crítico** | NDA + control de acceso por rol |
| Historial de cambios del SRS (versiones) | M3 | **Crítico** | NDA + registro de auditoría inmutable |
| Credenciales de usuarios del sistema | Infraestructura | **Crítico** | Hashing + salting + MFA |
| Bitácora de auditoría | Infraestructura | **Crítico** | Solo lectura para `admin`; almacenamiento separado |
| Tokens de autenticación | Infraestructura | **Crítico** | Cifrado en tránsito (TLS) + expiración |

***

## 9. Requerimientos No Funcionales de Seguridad del Sistema

Basados en Cap. 11 (§11.1, §11.4) y Cap. 12 (§12.4) de Sommerville :

| RNF | Descripción | Métrica de cumplimiento | Justificación Sommerville |
|---|---|---|---|
| **RNF-SEG-01** | Autenticación obligatoria en todas las rutas del sistema | 100% de rutas protegidas; 0 rutas públicas con datos | Cap. 11 §11.4: la autenticación es el primer control de acceso; Cap. 12 §12.4 tipo 1 |
| **RNF-SEG-02** | Control de acceso por rol (RBAC) con 4 niveles diferenciados | 4 roles: `admin`, `gestor`, `analista`, `viewer`; permisos documentados por recurso | Cap. 12 §12.4 tipo 2; Cap. 11 §11.3: evitar daño organizacional irreversible |
| **RNF-SEG-03** | Registro de auditoría de todas las operaciones CRUD sobre entidades y proyectos | 100% de operaciones registradas; log almacenado en servidor separado; retención mínima 2 años | Cap. 12 §12.4 tipo 9; p. 332: *"desalienta el mal uso del sistema por parte del personal autorizado"* |
| **RNF-SEG-04** | Cifrado de datos sensibles en reposo | AES-256 para campos: stakeholders, NDAs, requerimientos SRS | Cap. 11 §11.4 p. 305: encriptación como control de *evitar vulnerabilidad* |
| **RNF-SEG-05** | Cifrado de comunicaciones en tránsito | TLS 1.3 en 100% de las conexiones cliente-servidor | Cap. 14 §14.1: protección contra *intercepción* |
| **RNF-SEG-06** | Política de contraseñas que impida contraseñas vulnerables | Verificador automático al crear/cambiar contraseña; bloquear palabras del diccionario y nombres propios | Cap. 12 §12.4 / Cap. 14 p. 374: *"Las contraseñas de los usuarios que aparezcan en el diccionario del sistema deben identificarse"* |
| **RNF-SEG-07** | No repudio en operaciones críticas (firmar NDA, eliminar entidad, aprobar SRS) | Hash criptográfico + marca temporal + ID de usuario en cada operación crítica | Cap. 12 §12.4 tipo 7: requerimientos de no repudio |
| **RNF-SEG-08** | Gestión de NDA: registro de vigencia, nivel y referencia del documento | 100% de entidades con `tieneNDA: true` deben tener `fechaNDA`, `vencimientoNDA` y `responsableNDA` completos | Cap. 12 §12.4: identificación del activo y estimación de su valor |
| **RNF-SEG-09** | Disponibilidad del sistema según nivel de riesgo de la entidad | Entidades `nivelRiesgo: ALTO` → SLA ≥ 99.9% (MTTF/MTTF+MTTR ≥ 0.999) | Cap. 11 §11.2: fórmula de disponibilidad; relación entre nivelRiesgo y SLA |
| **RNF-SEG-10** | Integridad de datos: verificación criptográfica de registros críticos | Checksums en SRS y NDAs; detección de modificaciones fuera de los mecanismos normales | Cap. 14 §14.2.1 p. 378: *"comprobación de integridad mediante sumas de verificación criptográficas"* |
| **RNF-SEG-11** | Separación de ambientes: bitácora de auditoría en almacenamiento separado | La bitácora NO debe residir en el mismo servidor que la base de datos principal | Cap. 12 §12.4 p. 332: *"mantenerse en una computadora separada del servidor de la base de datos"* |
| **RNF-SEG-12** | Protección contra ataques de negación de servicio (DoS/DDoS) | Rate limiting + monitorización de peticiones anómalas en todas las rutas de API | Cap. 14 §14.1: *"ataques de negación de servicio... bombardeo de un nodo con peticiones ilegítimas"* — amenaza de interrupción |

***

## 10. Tabla de Conexiones con los 3 Módulos

| Concepto Sommerville | Módulo donde aplica | Campo o proceso específico |
|---|---|---|
| **Disponibilidad** (probabilidad de servicio en todo momento) | M1, M2, M3 | SLA por entidad; `nivelRiesgo` determina el umbral de disponibilidad requerido |
| **Fiabilidad** (servicios entregados según especificación) | M2, M3 | RNF registrados en SRS del Módulo 3; POFOD documentado por proyecto |
| **Protección — daño organizacional** (impedir daños irreversibles) | M1 | Control de roles: `analista` y `viewer` no pueden eliminar entidades ni modificar NDAs |
| **Seguridad — activos** | M1 | Campos `tieneNDA`, `fechaNDA`, `nivelRiesgo`; datos de stakeholders; documentos contractuales |
| **Amenaza de intercepción** | Infraestructura → M1, M2, M3 | TLS en todas las conexiones; cifrado de tokens y credenciales |
| **Amenaza de modificación** | M1, M3 | Control de versiones en SRS; auditoría de cambios en datos de entidades |
| **Amenaza de fabricación** | Infraestructura | Autenticación robusta; bloqueo por intentos fallidos; MFA para roles `admin` y `gestor` |
| **Amenaza de interrupción** | Infraestructura | Rate limiting; monitorización; alta disponibilidad |
| **Autenticación** | Infraestructura → todos los módulos | Login obligatorio; verificador de contraseñas; política de sesiones |
| **Autorización por rol** | M1, M2, M3 | `RolUsuario: admin | gestor | analista | viewer`; permisos diferenciados por módulo |
| **Cifrado en reposo** | M1, M3 | Stakeholders cifrados; requerimientos SRS cifrados; NDAs con referencia a doc cifrado |
| **Auditoría** | M1, M2, M3 | Log inmutable de todos los CRUD; almacenado en servidor separado; acceso solo `admin` |
| **NDA como control organizacional** | M1 | `tieneNDA`, `fechaNDA`, campos v2 propuestos |
| **Propiedad emergente** (no se puede añadir después) | Arquitectura del sistema | Seguridad diseñada desde el inicio en Firebase rules, Next.js middleware, Firestore índices |
| **Fiabilidad percibida vs. medida** | M2 | Los SLAs negociados deben documentarse como RNF en el SRS de cada proyecto |
| **Especificación dirigida por riesgos** | M3 | El proceso del Módulo 3 debe incluir identificación de activos y amenazas como paso del SRS |

***

## 11. Checklist de Completitud

| Ítem | Estado |
|---|---|
| Definición formal de confiabilidad (Cap. 11 §11.1, p. 291) | ✅ Incluido con texto original |
| 4 propiedades de confiabilidad con definiciones exactas (p. 292) | ✅ Incluido en tabla con citas textuales |
| Confiabilidad como propiedad emergente (Cap. 10 §10.1.1, p. 269) | ✅ Incluido con cita directa |
| Interdependencia entre propiedades (p. 293–294) | ✅ Incluido con cita y ejemplos del libro |
| Definiciones técnicas de disponibilidad y fiabilidad (p. 295–296) | ✅ Incluido |
| Métricas MTTF, MTTR, ROCOF, POFOD | ✅ Incluido en tabla |
| Fórmula de disponibilidad | ✅ Incluido con expresión matemática |
| Diferencia disponibilidad vs. fiabilidad con ejemplo del libro (p. 296) | ✅ Incluido con cita textual |
| Fiabilidad percibida vs. medida (p. 297–298) | ✅ Incluido |
| Fiabilidad según comportamiento del usuario (p. 297–298) | ✅ Incluido |
| Definición de protección (Cap. 11 §11.3) | ✅ Incluido con cita textual |
| Tipos de daño accidental vs. deliberado | ✅ Incluido |
| Niveles de protección: 3 estrategias complementarias (p. 302) | ✅ Incluido |
| Software secundario crítico aplicado a sistemas de negocio (p. 300) | ✅ Incluido con cita textual |
| Definición formal de seguridad (Cap. 11 §11.4, p. 302) | ✅ Incluido con cita textual |
| Terminología de seguridad (Figura 11.7, p. 303) | ✅ Incluido en tabla completa |
| 4 tipos de amenazas con definiciones exactas | ✅ Incluido en tabla con citas textuales |
| 3 tipos de amenazas a sistemas en red (p. 304) | ✅ Incluido |
| Seguridad como propiedad del sistema completo | ✅ Incluido |
| Controles de seguridad: 3 estrategias (p. 305) | ✅ Incluido |
| Autenticación vs. Autorización: diferencia clara | ✅ Incluido en tabla diferenciada |
| Cifrado: cuándo y qué protege | ✅ Incluido |
| Auditoría como parte de seguridad (p. 332) | ✅ Incluido con cita textual |
| Proceso de análisis de amenazas Cap. 12 §12.4 (p. 331) | ✅ Incluido con 7 etapas |
| 10 tipos de requerimientos de seguridad (p. 330) | ✅ Incluido en tabla |
| NDA como control de seguridad organizacional | ✅ Incluido con fundamento Sommerville |
| Campos actuales NDA en tipo Entidad | ✅ Documentado |
| Campos propuestos v2 con justificación | ✅ Documentado con justificación por requerimiento tipo |
| Tabla de activos del sistema con todos los módulos | ✅ Completado con 14 activos |
| RNF de seguridad del sistema (12 RNFs) | ✅ Completado con métricas y citas |
| Tabla de conexiones con los 3 módulos | ✅ Completado |

***

*Documento generado con base exclusivamente en: Sommerville, Ian. Ingeniería de Software, 9ª edición. Pearson, 2011. Capítulo 11 (completo) y Capítulo 12 §12.4.*