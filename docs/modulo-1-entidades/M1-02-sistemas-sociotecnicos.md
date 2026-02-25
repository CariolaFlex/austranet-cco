# M1-02-sistemas-sociotecnicos.md

<!--
  METADATOS DEL DOCUMENTO
  ─────────────────────────────────────────────────────────────────────
  Archivo       : M1-02-sistemas-sociotecnicos.md
  Módulo        : Módulo 1 — Registro de Clientes y Proveedores (Entidades)
  Capítulo fuente: Cap. 10 "Sistemas sociotécnicos" — Sommerville (9ª ed., Pearson, 2011)
  Versión       : 1.0
  Fecha         : 2026-02-24
  Estado        : ✅ Aprobado para implementación
  Autor         : Generado con base en Sommerville Cap. 10
  Relacionado   : src/types/index.ts → interface Entidad
                  M2-XX-proyectos.md (Módulo 2)
                  M3-XX-srs.md      (Módulo 3)
-->

---

## 1. Objetivo del Documento

Este archivo documenta el **marco teórico de sistemas sociotécnicos** (Cap. 10,
Sommerville 2011) que justifica por qué el sistema necesita entender y registrar
el **contexto organizacional** de cada entidad cliente o proveedor — no solo sus
datos de contacto.

El contexto organizacional de una entidad comprende su estructura social, sus
procesos de negocio, su cultura laboral y sus sistemas técnicos existentes.
Todos estos factores afectan directamente:

- **Módulo 1**: qué campos deben capturarse al registrar una Entidad y cómo
  calcular su `nivelRiesgo`.
- **Módulo 2**: qué riesgos deben registrarse al crear un Proyecto para esa
  Entidad.
- **Módulo 3**: el alcance real del SRS, que no puede definirse ignorando el
  sistema sociotécnico del cliente.

> **Regla de lectura:** Cada sección responde la pregunta:
> *¿para qué sirve esto en el Módulo 1 o Módulo 2?*
> Si una sección no responde esa pregunta, no está aquí.

---

## 2. ¿Qué es un Sistema Sociotécnico? (Cap. 10 §10.1, p. 267–268)

### 2.1 Definición formal

> *"Los sistemas sociotécnicos incluyen uno o más sistemas técnicos, pero también
> incluyen individuos que entienden el propósito del sistema dentro del sistema
> en sí. Los sistemas sociotécnicos tienen procesos operacionales definidos y las
> personas —los operadores— son partes inherentes del sistema. Están administrados
> por polticas y reglas organizacionales, y podrían verse afectados por
> restricciones externas como leyes nacionales y políticas reguladoras."*
> (Cap. 10, p. 267)

Un sistema sociotécnico **no es solo software o hardware**: incluye personas,
procesos, cultura organizacional y el entorno legal donde opera. Cuando un
cliente nos contrata, el software que entregamos se integrará en su sistema
sociotécnico preexistente.

### 2.2 Capas del sistema sociotécnico (Cap. 10 §10.1, p. 264–265)

> *"Los sistemas sociotécnicos son tan complejos que es prácticamente imposible
> entenderlos como un todo. En vez de ello, deben verse como capas."*
> (Cap. 10, p. 264)

| # | Capa | Contenido según Sommerville | Relevancia para Módulo 1 |
|---|------|-----------------------------|--------------------------|
| 1 | **Equipo** | Dispositivos de hardware, algunos de los cuales pueden ser computadoras | Infraestructura física del cliente que el sistema debe conocer |
| 2 | **Sistema operativo** | Interactúa con el hardware y ofrece facilidades comunes para capas superiores | Restricciones técnicas del entorno del cliente |
| 3 | **Comunicaciones y gestión de datos** | Extiende el SO; interfaz con sistemas remotos, bases de datos; a veces llamado *middleware* | Sistemas existentes del cliente con los que el nuevo software debe integrarse |
| 4 | **Aplicaciones** | Entrega la funcionalidad específica de la aplicación | Software actual del cliente que podría reemplazarse o complementarse |
| 5 | **Procesos de negocio** | Procesos empresariales de la organización que usan el software del sistema | Procesos actuales que el software debe respetar o transformar |
| 6 | **Organización** | Procesos estratégicos de alto nivel, reglas, políticas y normas de la empresa | Estructura jerárquica, políticas internas, decisores reales |
| 7 | **Sociedad** | Leyes y regulaciones de la sociedad que rigen la operación del sistema | Marco legal del sector (campo `sector` + `pais` de la Entidad) |

> *"En principio, la mayoría de las interacciones están entre capas contiguas,
> y cada capa oculta el detalle de la capa de abajo de la capa superior. En la
> práctica, éste no siempre es el caso. Entre las capas quizás haya interacciones
> inesperadas, lo cual derivaría en problemas para el sistema como un todo."*
> (Cap. 10, p. 265)

**Aplicación en el sistema:**
El campo `sector` de la Entidad captura la capa 6–7 (organización y sociedad);
los `stakeholders` capturan la capa 6 (decisores y normas internas); y los campos
de contexto técnico propuestos en §8 cubren las capas 3–4.
Juntos, estos campos permiten evaluar la complejidad real del sistema sociotécnico
del cliente **antes** de iniciar cualquier proyecto en el Módulo 2.

---

## 3. Propiedades Emergentes del Sistema (Cap. 10 §10.1.1, p. 269–271)

### 3.1 Definición

> *"Tales propiedades emergentes no pueden atribuirse a alguna parte específica
> del sistema. En cambio, sólo surgen una vez que se integran los componentes
> del sistema."*
> (Cap. 10, p. 269)

Las propiedades emergentes son características del **sistema como un todo** que
no se pueden calcular sumando las propiedades de sus partes individuales.

### 3.2 Dos tipos de propiedades emergentes

1. **Funcionales** — El propósito del sistema solo surge después de integrar sus
   componentes. Ejemplo: una bicicleta como dispositivo de transporte solo existe
   cuando se ensamblan todas sus piezas. (Cap. 10, p. 269)

2. **No funcionales** — Se relacionan con el comportamiento del sistema en su
   entorno operacional: fiabilidad, rendimiento, seguridad y protección.
   Sommerville las llama *críticas* porque su ausencia hace inútil al sistema.
   (Cap. 10, p. 269–270)

### 3.3 Por qué no pueden predecirse solo desde el software

> *"Las propiedades emergentes de confiabilidad, como la fiabilidad, dependen
> tanto de las propiedades de los componentes individuales como de sus
> interacciones. Los componentes en un sistema son interdependientes. Las fallas
> en un componente pueden propagarse a lo largo del sistema y afectar la operación
> de otros componentes. A pesar de ello, con frecuencia es difícil anticiparse a
> cómo las fallas en dichos componentes afectarán a otros componentes."*
> (Cap. 10, p. 270)

**Aplicación en el sistema:**
El campo `nivelRiesgo` de la Entidad **no puede calcularse** solo con datos
financieros o históricos del cliente. El riesgo real es una propiedad emergente
del sistema organizacional completo: depende de la interacción entre la madurez
técnica del cliente, la claridad de sus procesos, la estabilidad de su estructura
y la experiencia de sus stakeholders. La Tabla de Riesgo Organizacional (§7)
operacionaliza esta idea.

---

## 4. Sistemas Complejos y sus Implicaciones (Cap. 10 §10.1, p. 266–272)

Solo se extraen las características que afectan directamente cómo el Módulo 1
gestiona las Entidades.

### 4.1 Interacciones no lineales entre subsistemas

> *"Una característica de todos los sistemas complejos es que las propiedades y
> el comportamiento de los componentes del sistema están estrechamente vinculados.
> El funcionamiento exitoso de cada componente del sistema depende del
> funcionamiento de los otros componentes."*
> (Cap. 10, p. 267)

La organización del cliente es un sistema complejo: su área de TI depende de la
voluntad directiva, que depende del presupuesto, que depende de los procesos de
aprobación. Un cambio en cualquier nodo puede bloquear el proyecto.

### 4.2 No determinismo

> *"Los sistemas sociotécnicos no son deterministas, ya que incluyen personas y
> [...] los cambios al hardware, al software y a los datos en dichos sistemas son
> muy frecuentes. Las interacciones entre tales cambios son complejas y, por lo
> tanto, el comportamiento del sistema se vuelve impredecible."*
> (Cap. 10, p. 272)

Esto significa que el mismo cliente puede comportarse de manera diferente en dos
proyectos distintos, dependiendo de su contexto organizacional en cada momento.

### 4.3 Los sistemas complejos fallan de maneras no anticipadas

> *"Puesto que el software es inherentemente flexible, se deja por lo general a
> los ingenieros de software solucionar los problemas imprevistos del sistema.
> [...] Muchas de las llamadas fallas de operación del software no son
> consecuencia de problemas inherentes de software, sino el resultado de buscar
> cambiar el software para instalar requerimientos modificados de ingeniería
> del sistema."*
> (Cap. 10, p. 266)

**Aplicación en el sistema:**
Justifica por qué `nivelRiesgo` no es un campo estático: el perfil de riesgo de
una Entidad debe poder actualizarse a medida que cambia su contexto
organizacional. También justifica el campo `notas` como registro libre de
observaciones no estructuradas sobre comportamientos inesperados del cliente.

---

## 5. Ingeniería de Sistemas: Etapas Relevantes (Cap. 10 §10.2–§10.4, p. 273–281)

> *"La ingeniería de sistemas abarca todas las actividades que hay en la
> procuración, la especificación, el diseño, la implementación, la validación,
> el despliegue, la operación y el mantenimiento de los sistemas sociotécnicos."*
> (Cap. 10, p. 273)

Las siguientes etapas son relevantes porque determinan qué información del
cliente necesitamos capturar en el Módulo 1 para ejecutarlas correctamente.

### 5.1 Procuración / Adquisición

La etapa inicial donde se decide el propósito del sistema, se establecen los
requerimientos de alto nivel, se toman decisiones sobre la distribución de
funcionalidad entre hardware/software/personal, y se adquieren los componentes.
(Cap. 10, p. 273)

**Información de Módulo 1 necesaria:** `sector`, `sistemas existentes`,
`procesos actuales`, `nivelRiesgo` inicial.

### 5.2 Desarrollo de requerimientos

> *"Los requerimientos de alto nivel y empresariales identificados durante el
> proceso de procuración deben desarrollarse con más detalle. Los requerimientos
> deben asignarse al hardware, al software o a los procesos, y hay que priorizar
> su implementación."*
> (Cap. 10, p. 278)

**Información de Módulo 1 necesaria:** estructura jerárquica del cliente
(quién aprueba qué), `stakeholders` con roles definidos.

### 5.3 Diseño del sistema

> *"Este proceso se superpone significativamente con el proceso de desarrollo de
> requerimientos. Implica el establecimiento de la arquitectura global del sistema,
> al identificar los diferentes componentes del sistema y entender las relaciones
> entre ellos."*
> (Cap. 10, p. 279)

El software que desarrollamos debe encajar en el sistema mayor del cliente.
Sin conocer sus capas 3–4 (middleware y aplicaciones existentes) este diseño
es imposible.

### 5.4 Integración del sistema

> *"Durante esta etapa, los componentes se reúnen para crear un nuevo sistema.
> Sólo entonces se vuelven evidentes las propiedades emergentes del sistema."*
> (Cap. 10, p. 279)

Los problemas de integración son la principal fuente de costos imprevistos.
Conocer los sistemas existentes del cliente (propuesto como `sistemasExistentes`
en §8) es esencial.

### 5.5 Implementación del sistema

> *"Éste es el proceso de poner el sistema a disposición de sus usuarios, de
> transferir datos de los sistemas existentes y establecer comunicaciones con
> otros sistemas en el entorno."*
> (Cap. 10, p. 279)

**Información de Módulo 1 necesaria:** datos sobre sistemas legados del cliente
y disposición organizacional al cambio.

### 5.6 Operación del sistema

> *"Constantemente, tienen entonces que cambiar los procesos operacionales
> planeados para reflejar el entorno de trabajo real donde se usa el sistema."*
> (Cap. 10, p. 273)

**Aplicación en el sistema:**
Estas etapas justifican los campos de contexto de la Entidad (sector, sistemas
existentes, stakeholders) que deben capturarse al registrar un cliente nuevo.
Sin esta información, el sistema no puede estimar correctamente el esfuerzo ni
los riesgos de un proyecto en el Módulo 2.

---

## 6. Procuración del Sistema — El Cliente como Adquiriente (Cap. 10 §10.3, p. 275–278)

Esta sección es crítica para el Módulo 1 porque describe exactamente la posición
del cliente en la relación contractual con nuestra empresa.

### 6.1 Definición de procuración según Sommerville

> *"La fase inicial de la ingeniería de sistemas es la procuración del sistema
> —llamada en ocasiones adquisición del sistema—. En esta etapa se toman
> decisiones sobre el ámbito de un sistema que se adquirirá, los presupuestos
> y plazos del sistema, así como sobre los requerimientos de alto nivel del
> sistema."*
> (Cap. 10, p. 275)

> **Nota del revisor técnico del libro:** *"En inglés, el término procurement
> (procuración) abarca las actividades de compra, elaboración del plan inicial
> de desarrollo y contratación para el desarrollo."*
> (Cap. 10, p. 267)

### 6.2 Decisores que disparan la procuración

Sommerville identifica dos controladores principales para la decisión de adquirir
un sistema (Cap. 10, p. 275):

1. **Estado de sistemas existentes:** Si la organización tiene sistemas que no
   logran comunicarse o son costosos de mantener, la procuración de un reemplazo
   genera beneficios empresariales.
2. **Cumplimiento con regulaciones externas:** Las empresas cada vez más deben
   demostrar cumplimiento con regulaciones (contabilidad, privacidad de datos,
   seguridad sectorial, etc.).

### 6.3 Proceso de adquisición: perspectiva del cliente

El proceso de procuración del sistema incluye las siguientes actividades
(Cap. 10, Fig. 10.6, p. 276):

```

Definición de requerimientos empresariales
↓
Estudio de mercado para sistemas existentes
↓
Definición de requerimientos ← → Valoración de sistemas existentes
↓
Emisión de solicitud de licitación
↓
Seleccionar al licitador
↓
Elección del proveedor del sistema
↓
Negociación del contrato
↓
[Si COTS] Personalización del sistema requerido / Adaptación de requerimientos
[Si a medida] Inicio del desarrollo

```

### 6.4 Problemas típicos del proceso de adquisición

> *"Los componentes comerciales regularmente no cubren con exactitud los
> requerimientos, a menos que éstos se hayan escrito con tales componentes en
> mente. Por ello, elegir un sistema significa que debe encontrarse la coincidencia
> más cercana entre los requerimientos del sistema y las funcionalidades ofrecidas
> por los sistemas comerciales. Entonces, quizás tengan que modificarse los
> requerimientos. Esto podría tener efectos secundarios sobre otros subsistemas."*
> (Cap. 10, p. 276)

> *"Cuando un sistema se construye a la medida, la especificación de
> requerimientos forma parte del contrato para el sistema que se va a adquirir.
> Por consiguiente, se trata de un documento tanto legal como técnico."*
> (Cap. 10, p. 277)

> *"Después de seleccionar a un contratista para construir un sistema, hay un
> periodo de negociación del contrato en que quizás se tengan que negociar más
> cambios a los requerimientos, y discutir temas como el costo de los cambios
> al sistema."*
> (Cap. 10, p. 277)

**Tabla de problemas típicos de adquisición → riesgos en Módulo 2:**

| Problema de adquisición (Cap. 10) | Riesgo que genera en M2 |
|-----------------------------------|-------------------------|
| Requerimientos que no coinciden con sistemas COTS disponibles | Alcance inflado o recorte forzado de funcionalidad |
| Especificación de requerimientos como documento legal (contrato) | Disputas contractuales por cambios de alcance |
| Negociación post-selección de contratista | Scope creep no documentado |
| Errores de configuración en sistemas COTS | Vulnerabilidades de seguridad no anticipadas |
| Decisión de procurar sistema personalizado sin experiencia interna | Subestimación de esfuerzo y presupuesto |

### 6.5 Responsabilidades del adquiriente durante el desarrollo

> *"El comprador trata con el contratista y no con los subcontratistas, de modo
> que hay una sola interfaz comprador/proveedor."*
> (Cap. 10, p. 277)

> *"Una decisión para procurar un sistema personalizado significa que debe
> dedicarse un esfuerzo considerable para entender y definir los requerimientos
> de seguridad y confiabilidad. Si una compañía tiene experiencia limitada en el
> área, ésta será una labor muy difícil de realizar."*
> (Cap. 10, p. 278)

**Aplicación en el sistema:**
Los *problemas típicos del proceso de adquisición* identificados por Sommerville
son exactamente los riesgos que debe registrar el **Módulo 2** cuando se crea un
proyecto para esa entidad. Esta sección justifica la **conexión directa** entre el
perfil de la Entidad en M1 (especialmente `nivelRiesgo`, `sistemasExistentes`,
`stakeholders`) y el registro de riesgos del Proyecto en M2: si el perfil M1 indica
que el cliente nunca ha procurado software a medida, el M2 debe registrar
automáticamente un riesgo de *especificación de requerimientos inadecuada*.

---

## 7. Factores Organizacionales que Afectan el Proyecto (Cap. 10 §10.1, p. 267–268)

Sommerville identifica explícitamente tres factores del entorno organizacional que
determinan el éxito o fracaso de un proyecto de software:

### 7.1 Cambios de procesos (resistencia)

> *"El sistema puede requerir cambios en los procesos de trabajo del entorno.
> Si es así, ciertamente se requerirá capacitación. Si los cambios son
> significativos, o si implican que la gente pierda su empleo, hay riesgo de
> que los usuarios se resistan a la introducción del sistema."*
> (Cap. 10, p. 268)

**En proyectos reales:** El nuevo sistema de gestión reemplaza Excel manual.
El área de contabilidad lleva 10 años con ese proceso y no fue consultada.
**Campo en sistema:** `notas` + `nivelRiesgo` elevado + stakeholder de
resistencia documentado.

### 7.2 Cambios laborales (desplazamiento de habilidades)

> *"Los nuevos sistemas pueden reemplazar las habilidades de los usuarios en
> un entorno, o bien, hacer que cambien la forma como trabajan. Si es así,
> los usuarios se opondrían activamente a la introducción del sistema en la
> organización. Los diseños que requieran que los directivos deban cambiar su
> forma de trabajar, para acoplarse a un nuevo sistema de cómputo, a menudo
> son molestos. Los directivos quizás crean que su estatus en la organización
> decrece por el sistema."*
> (Cap. 10, p. 268)

**En proyectos reales:** El gerente de área pierde control sobre información
que antes solo él manejaba. Vetará el sistema indirectamente.
**Campo en sistema:** `stakeholders` con rol `opositor` y `notas` con
descripción del conflicto político.

### 7.3 Cambios en la organización (poder político)

> *"El sistema podría cambiar la estructura política de poder en una
> organización. Por ejemplo, si una organización depende de un sistema
> complejo, quienes controlan el acceso a dicho sistema tienen, por lo
> tanto, mayor poder político."*
> (Cap. 10, p. 268)

**En proyectos reales:** Centralizar datos en un dashboard unifica información
que antes estaba distribuida entre áreas. Eso implica redistribución de poder.
**Campo en sistema:** `stakeholders` con rol `decisor político` claramente
distinguido del `decisor técnico`.

**Aplicación en el sistema:**
Estos tres factores justifican el campo `notas` de la Entidad y sugieren los
campos adicionales `culturaAdopcion` y `historialCambios` propuestos en §8.
La ausencia de este contexto en el perfil de la Entidad hace que el Módulo 2
no pueda estimar correctamente el riesgo de adopción del sistema por parte
del cliente.

---

## 8. Tabla de Riesgo Organizacional (Cap. 10 — Operativa para Módulo 1)

> **Esta tabla es el entregable operativo principal de este documento.**
> Se usa directamente en el formulario de evaluación de `nivelRiesgo`
> de la Entidad en el Módulo 1.

Cada fila representa un factor del contexto sociotécnico del cliente identificado
en Cap. 10. Los indicadores se derivan de las tres características de sistemas
sociotécnicos (p. 268) y las propiedades emergentes (p. 269–271).

| # | Factor organizacional | Indicador de BAJO riesgo | Indicador de ALTO riesgo | Referencia Sommerville |
|---|----------------------|--------------------------|--------------------------|------------------------|
| 1 | **Experiencia previa con software a medida** | Proyectos previos exitosos documentados; personal técnico interno | Sin experiencia previa; primera vez que procuran software | Cap. 10, p. 278 (procuración personalizada) |
| 2 | **Cultura de adopción al cambio** | Adopción ágil documentada; capacitación voluntaria histórica | Resistencia histórica documentada; rotación de personal en proyectos anteriores | Cap. 10, p. 268 (cambios de procesos) |
| 3 | **Claridad y documentación de procesos** | Procesos documentados formalmente; manuales vigentes | Procesos informales o solo en conocimiento tácito de personas clave | Cap. 10, p. 264 (capa de procesos de negocio) |
| 4 | **Estabilidad organizacional** | Estructura estable > 2 años; misma dirección | Reorganizaciones frecuentes; cambio de directivos durante proyectos anteriores | Cap. 10, p. 272 (no determinismo) |
| 5 | **Claridad de stakeholders y decisores** | Decisores identificados con autoridad formal; una sola interfaz cliente/proveedor | Múltiples centros de poder sin jerarquía clara; decisor cambia durante el proyecto | Cap. 10, p. 277 (interfaz comprador/proveedor) |
| 6 | **Estado de sistemas existentes** | Sistemas bien documentados; arquitectura conocida; APIs disponibles | Sin documentación de sistemas; sistemas legados sin soporte; "nadie sabe cómo funciona" | Cap. 10, p. 264–265 (capas 3–4) |
| 7 | **Conflictos políticos internos** | Alineación organizacional explícita hacia el proyecto | Disputas de poder documentadas; departamentos en competencia por el sistema | Cap. 10, p. 268 (cambios en la organización) |
| 8 | **Cumplimiento regulatorio del sector** | Certificaciones vigentes; procesos de auditoría establecidos | Sin conocimiento de regulaciones aplicables; sector altamente regulado sin compliance | Cap. 10, p. 265 (capa social) + p. 275 (regulaciones externas) |
| 9 | **Disposición a definir requerimientos** | Participantes disponibles; proceso formal de aprobación | Requerimientos "los definimos sobre la marcha"; sin patrocinador técnico | Cap. 10, p. 277 (especificación como documento legal) |
| 10 | **Fiabilidad del operador (usuarios finales)** | Usuarios con experiencia en software similar; capacitación previa | Usuarios no técnicos; alta rotación; resistencia activa al sistema | Cap. 10, p. 270 (fiabilidad del operador) |

**Criterio de cálculo sugerido para `nivelRiesgo`:**
- 0–2 factores de alto riesgo → `bajo`
- 3–5 factores de alto riesgo → `medio`
- 6–10 factores de alto riesgo → `alto`
- ≥8 factores de alto riesgo o factores 4+5 en alto → `crítico`

---

## 9. Campos Propuestos para Ampliar el Tipo Entidad (Cap. 10)

Solo se proponen campos con justificación directa y explícita en el Cap. 10.
La versión indica cuándo debe implementarse.

| Campo propuesto | Tipo | Justificación (Cap. 10) | Versión |
|-----------------|------|-------------------------|---------|
| `tieneNDA` | `boolean` | Ya existe — protección de información sensible del cliente | v1 ✅ |
| `sector` | `SectorEntidad` (enum) | Ya existe — capas social y organizacional (p. 264–265) | v1 ✅ |
| `pais` | `string` | Ya existe — leyes y regulaciones de la sociedad, capa social (p. 265) | v1 ✅ |
| `nivelRiesgo` | `NivelRiesgoEntidad` (enum) | Ya existe — propiedad emergente del sistema organizacional (p. 269–271) | v1 ✅ |
| `stakeholders` | `Stakeholder[]` | Ya existe — interfaz comprador/proveedor, decisores (p. 277) | v1 ✅ |
| `notas` | `string` | Ya existe — factores políticos y culturales no estructurados (p. 268) | v1 ✅ |
| `sistemasExistentes` | `string[]` | Capas 3–4: integración con middleware y aplicaciones existentes (p. 264–265); problemas de integración (p. 279) | **v2** |
| `culturaAdopcion` | `SelectEnum` (`alta`/`media`/`baja`/`desconocida`) | Resistencia al cambio como factor crítico de riesgo (p. 268) | **v2** |
| `experienciaConSoftware` | `SelectEnum` (`ninguna`/`básica`/`intermedia`/`avanzada`) | Procuración personalizada requiere experiencia técnica interna (p. 278) | **v2** |
| `historialCambiosOrg` | `string` | No determinismo organizacional; reorganizaciones frecuentes como riesgo (p. 272) | **v3** |
| `cumplimientoRegulatorio` | `SelectEnum` (`conforme`/`parcial`/`no-conforme`/`N/A`) | Regulaciones externas como controlador de procuración (p. 275) | **v3** |

---

## 10. Tabla de Conexiones con los 3 Módulos

| Concepto del Cap. 10 | Referencia | Módulo donde aplica | Campo o proceso |
|----------------------|------------|---------------------|-----------------|
| Capas del sistema sociotécnico | p. 264–265 | M1 | `sector`, `sistemasExistentes` (v2), `pais` |
| Propiedades emergentes (fiabilidad) | p. 269–271 | M1 | `nivelRiesgo` — no calculable como suma de partes |
| No determinismo | p. 271–272 | M1 + M2 | `nivelRiesgo` actualizable; riesgo de comportamiento impredecible del cliente |
| Factores organizacionales: cambio de procesos | p. 268 | M1 + M2 | `culturaAdopcion` (v2), `notas`, riesgos de adopción en M2 |
| Factores organizacionales: política de poder | p. 268 | M1 + M3 | `stakeholders` con roles, `notas`; impacta definición de alcance SRS |
| Procuración: decisores para adquirir sistema | p. 275 | M1 | `stakeholders` con rol `sponsor` / `decisor` |
| Procuración: interfaz comprador/proveedor única | p. 277 | M1 + M2 | `stakeholders` con rol `contacto principal`; punto único de contacto en proyecto |
| Procuración: requerimientos como documento legal | p. 277 | M2 + M3 | Riesgo contractual en M2; SRS formal en M3 |
| Procuración: experiencia del cliente en adquisición | p. 278 | M1 + M2 | `experienciaConSoftware` (v2); riesgo de subestimación de esfuerzo en M2 |
| Desarrollo: integración del sistema | p. 279 | M2 | Riesgo técnico de integración; alimentado por `sistemasExistentes` desde M1 |
| Criterios de éxito: metas empresariales cambiantes | p. 272–273 | M2 + M3 | Riesgo de scope creep; justifica SRS con versionado en M3 |
| Regulaciones externas como controlador de procuración | p. 275 | M1 + M3 | `cumplimientoRegulatorio` (v3); requerimientos no funcionales de compliance en SRS |

---

## 11. Checklist de Completitud del Cap. 10

Todos los ítems extraídos del Cap. 10 que son aplicables al sistema:

- [x] Definición formal de sistema sociotécnico (§10.1, p. 267)
- [x] Capas del sistema sociotécnico — las 7 capas completas (§10.1, p. 264–265)
- [x] Interacciones entre capas no contiguas e impacto en problemas del sistema (§10.1, p. 265)
- [x] Sistema como colección intencionada de componentes interrelacionados (§10.1, p. 266)
- [x] Definición de propiedades emergentes (§10.1.1, p. 269)
- [x] Propiedades emergentes funcionales vs. no funcionales (§10.1.1, p. 269)
- [x] Fiabilidad como propiedad emergente tridimensional: hardware, software, operador (§10.1.1, p. 270)
- [x] Propagación de fallas entre capas (§10.1.1, p. 270–271)
- [x] No determinismo de sistemas sociotécnicos por presencia humana (§10.1.2, p. 271–272)
- [x] Criterios de éxito como función de metas empresariales cambiantes (§10.1.3, p. 272–273)
- [x] Factores organizacionales: cambios de procesos, laborales y de poder (§10.1, p. 268)
- [x] Etapas de la ingeniería de sistemas: procuración, desarrollo, operación (§10.2, p. 273)
- [x] Seis actividades del desarrollo de sistemas (§10.4, p. 278–279)
- [x] Definición de procuración del sistema (§10.3, p. 275)
- [x] Controladores de la decisión de procurar: sistemas existentes y regulaciones (§10.3, p. 275)
- [x] Proceso de procuración paso a paso (§10.3, Fig. 10.6, p. 276)
- [x] Problemas de sistemas COTS vs. sistemas a medida (§10.3, p. 276–278)
- [x] Especificación de requerimientos como documento legal en contratos (§10.3, p. 277)
- [x] Interfaz única comprador/contratista (§10.3, p. 277)
- [x] Impacto de la decisión de procuración en la seguridad y confiabilidad (§10.3, p. 277–278)

**Ítems del Cap. 10 explícitamente excluidos** (no aplicables al sistema):
- Sistemas de tiempo real y radar (ejemplo de interferencia de espectros) — demasiado específico
- Metodología sociotécnica de Mumford y SSM de Checkland — marco metodológico no operativo en M1
- Sociología del trabajo (Ackroyd, Suchman) — referenciado pero no desarrollado en Cap. 10

---

*Fin del documento M1-02-sistemas-sociotecnicos.md — v1.0*
```