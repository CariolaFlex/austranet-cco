# M2-04: Seguimiento y Control del Proyecto Activo

***

**Archivo:** `M2-04-seguimiento-control-proyecto.md`
**Módulo:** Módulo 2 — Registro y Configuración de Proyectos
**Fuentes primarias:** Cap. 22 §22.1, §22.2, §22.3 · Cap. 23 §23.2, §23.3 — *Ingeniería de Software*, Ian Sommerville, 9.ª ed. (Pearson, 2011)
**Versión:** 1.0
**Fecha:** 2026-02-24
**Estado:** ✅ Activo

***

## 1. Metadatos

| Campo | Valor |
|---|---|
| Nombre del archivo | `M2-04-seguimiento-control-proyecto.md` |
| Módulo propietario | Módulo 2 — Registro y Configuración de Proyectos |
| Capítulos fuente | Cap. 22 §22.1 · Cap. 23 §23.2.1, §23.2.2, §23.3 |
| Archivos relacionados | `M2-01` (plan), `M2-02` (costos), `M2-03` (riesgos), `M3-*` (SRS) |
| Versión | 1.0.0 |
| Fecha de creación | 2026-02-24 |
| Estado del documento | Activo |

***

## 2. Objetivo del Documento

Este archivo documenta el **marco teórico y el proceso operativo completo** para hacer seguimiento y control de un proyecto activo dentro del sistema, desde que entra en estado `activo_en_definicion` hasta que alcanza `completado` o `cancelado`.

### Diferencia entre planificación y seguimiento/control

> **Planificación** _(M2-01)_: define el plan base — cronograma, presupuesto, hitos, asignación de recursos.
> **Seguimiento** _(este archivo)_: detecta desviaciones del plan en ejecución.
> **Control**: toma acciones correctivas para reencauzar el proyecto.

Sommerville establece con precisión esta distinción operacional (Cap. 23 §23.2.2, p. 625):

> *"El plan creado al comienzo de un proyecto se usa para comunicar al equipo y los clientes cómo se realizará el trabajo, así como para ayudar a valorar el avance del proyecto."* — y más adelante — *"Después de cierto tiempo —por lo general de dos a tres semanas—, se debe revisar el avance y anotar las diferencias del calendario planeado."*[^1]

### El ciclo plan → ejecutar → medir → controlar

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────────┐
│  PLANIFICAR │────▶│   EJECUTAR   │────▶│    MEDIR    │────▶│    CONTROLAR     │
│  (M2-01)   │     │  (equipo)    │     │  (sistema)  │     │  (gestor)        │
└─────────────┘     └──────────────┘     └─────────────┘     └──────────────────┘
       ▲                                                               │
       └───────────────── Replanificación si es necesario ────────────┘
```

**Cómo el sistema implementa este ciclo en el Módulo 2:**

| Fase | Acción en el sistema |
|---|---|
| Planificar | M2-01: plan de proyecto, hitos, presupuesto estimado |
| Ejecutar | Equipo registra avance; estados de hitos se actualizan |
| Medir | Módulo 2 calcula KPIs automáticamente (Sección 10) |
| Controlar | Gestor revisa alertas, aprueba cambios, replanifica |

> **Aplicación en el sistema:** El Módulo 2 es el panel de control durante la ejecución. Cada ciclo de revisión (cada 2–3 semanas según el libro) se materializa como un período de reporte configurable por proyecto. El sistema compara el estado actual de hitos y gasto real contra el plan base definido en M2-01 y calcula automáticamente las desviaciones que aparecen en la Sección 10.

***

## 3. Elaboración de Informes de Avance

*(Cap. 23 §23.2.1, p. 624 · Cap. 23 §23.2.2, p. 625)*

### 3.1 Definición y propósito

Sommerville define los informes de avance como parte de los **mecanismos de monitorización y reporte** del plan de proyecto (Cap. 23 §23.2.1, p. 624):

> *"Esta sección define los informes administrativos que deben producirse, cuándo tienen que elaborarse y los mecanismos de monitorización del proyecto que se usarán."*[^1]

Los informes se dirigen al **administrador del proyecto**, a la **dirección** y al **cliente**, y son el instrumento formal mediante el cual el administrador cumple su rol de informes:

> *"Los administradores de proyectos por lo común son responsables de informar del avance de un proyecto a los clientes y administradores de la compañía que desarrolla el software. Deben ser capaces de comunicarse en varios niveles, desde codificar información técnica detallada hasta elaborar resúmenes administrativos."* (Cap. 22, p. 595)[^1]

### 3.2 Frecuencia recomendada

Sommerville establece el ciclo de revisión del plan (Cap. 23 §23.2.2, p. 625):

> *"Después de cierto tiempo —por lo general de dos a tres semanas—, se debe revisar el avance y anotar las diferencias del calendario planeado."*[^1]

Este intervalo de **2 a 3 semanas** es el referente operativo para proyectos con desarrollo dirigido por un plan.

### 3.3 Contenido mínimo de un informe de avance

Basado en las responsabilidades del administrador y el proceso de planeación (Cap. 22, p. 595; Cap. 23 §23.2.2, p. 625–626):[^1]

| Ítem | Descripción |
|---|---|
| Actividades completadas | Qué tareas se terminaron desde el último informe |
| Actividades en curso | Qué está en ejecución actualmente |
| Actividades retrasadas | Cuáles no se completaron según el plan |
| Problemas detectados | Riesgos materializados, impedimentos técnicos u organizacionales |
| Decisiones tomadas | Cambios al plan, escalamientos, aprobaciones |
| Próximos pasos | Actividades programadas hasta el siguiente informe |
| Estado del presupuesto | Gasto real vs. estimado acumulado |
| Estado de riesgos | Actualización del registro de riesgos (Ver M2-03, Sección 3) |

### 3.4 Informe de hitos vs. informe periódico

Sommerville distingue dos mecanismos de reporte (Cap. 23 §23.3, p. 628):

> *"Cuando planee un proyecto, también deberá definir los hitos —esto es, cada etapa del proyecto en la que puede realizarse una valoración del avance—. Cada hito debe documentarse mediante un breve reporte que compendie el avance realizado y el trabajo efectuado."*[^1]

| Tipo | Disparador | Audiencia | Contenido |
|---|---|---|---|
| **Informe periódico** | Cada 2–3 semanas, configurable | Gestor, dirección | Avance general, gasto, riesgos, pendientes |
| **Informe de hito** | Al completar un hito | Gestor, cliente, dirección | Entregable producido, validación, decisión de continuar |

### 3.5 El problema de la regla del 90%

Este es uno de los conceptos más relevantes para el control efectivo del proyecto. Sommerville lo describe en el contexto de la intangibilidad del software y la dificultad de medir el progreso real (Cap. 22, pp. 594–595):

> *"El software es intangible. No se puede ver ni tocar. Los administradores de proyectos de software no pueden constatar el progreso con sólo observar el artefacto que se construye. Más bien, ellos se apoyan en otros para crear la prueba que pueden utilizar al revisar el progreso del trabajo."*[^1]

Este problema estructural genera el fenómeno conocido como **la regla del 90%**: las tareas de software tienden a reportarse como "90% terminadas" durante un periodo desproporcionadamente largo del proyecto, sin que ese 90% se convierta en 100%. Las causas son:

1. **Intangibilidad**: no hay producto visible que confirme el avance real.
2. **Complejidad oculta**: el último 10% generalmente contiene la mayor parte de los defectos y la integración.
3. **Optimismo del equipo**: los desarrolladores reportan el avance que esperan, no el avance real medido.
4. **Ausencia de puntos finales definidos**: sin un criterio de completitud claro, la tarea nunca está "terminada" de forma verificable.

Sommerville señala que cada actividad debe tener **un punto final definido** (Cap. 23 §23.3, p. 628):

> *"Un punto final definido. Éste representa el resultado tangible de completar la actividad. También podría ser un documento, la realización de una junta de revisión, una ejecución exitosa de todas las pruebas, etcétera."*[^1]

**Consecuencia directa para el sistema:** una tarea sin punto final tangible y verificable no puede reportarse como completada. El sistema **no acepta "casi terminado" como estado válido**. Los únicos estados de un hito son: `pendiente`, `en_riesgo`, `completado` o `incumplido`.

### 3.6 Cómo medir el avance real

Sommerville describe la monitorización informal como complemento necesario (Cap. 23 §23.1, p. 621):

> *"La monitorización informal ayuda a pronosticar problemas potenciales de proyecto al revelar las dificultades conforme ocurren. Por ejemplo, los intercambios diarios con el personal del proyecto pueden revelar un problema particular para encontrar una falla del software."*[^1]

Las métricas de avance recomendadas son:

- **% de hitos completados** sobre el total planificado (verificados, con entregable aceptado).
- **Tareas completadas vs. planificadas** en el período.
- **Gasto real acumulado** vs. estimado a la misma fecha.
- **Indicadores de riesgo activos** (Ver M2-03, Sección 4): peticiones de cambio, quejas del cliente, rotación de personal.

> **Aplicación en el sistema:** El informe de avance es el artefacto periódico central del Módulo 2. Se genera automáticamente con los datos del proyecto (hitos completados, gasto registrado, riesgos actualizados) y se entrega al gestor según la frecuencia configurada. El gestor lo valida antes de enviarlo a la Entidad cliente.

***

## 4. Gestión del Cambio en el Proyecto

*(Cap. 23 §23.2.2, p. 625–626 · Cap. 22 §22.1, p. 597)*

### 4.1 Por qué los cambios son inevitables

Sommerville establece que la modificación del plan no es una excepción sino una constante (Cap. 23 §23.2.2, p. 625):

> *"Los cambios al plan son inevitables. Conforme más información sobre el sistema y el equipo está disponible durante el proyecto, habrá que revisar regularmente el plan para reflejar los requerimientos, el calendario y los cambios en el riesgo. Modificar las metas de la empresa conduce también a cambios en los planes del proyecto."*[^1]

### 4.2 Tipos de cambios durante el proyecto

| Tipo | Origen | Impacto típico |
|---|---|---|
| Cambios de requerimientos | Cliente o nueva información | Replanificación del alcance, SRS |
| Cambios de personal | Renuncia, enfermedad, reasignación | Retraso en cronograma |
| Cambios de tecnología | Obsolescencia, nuevas restricciones | Rediseño técnico |
| Cambios organizacionales | Reestructura, nuevas prioridades | Presupuesto, continuidad |
| Cambios de alcance | Expansión o reducción del proyecto | Presupuesto, cronograma, SRS |

Sommerville identifica como riesgos comunes: *"Se proponen cambios a los requerimientos que demandan mayor trabajo de rediseño"* y *"Los clientes no entienden las repercusiones de los cambios a los requerimientos"* (Cap. 22, Fig. 22.3, p. 599).[^1]

### 4.3 El costo del cambio según la fase del proyecto

Sommerville describe el proceso iterativo de planeación con una advertencia explícita sobre los retrasos (Cap. 23 §23.2.2, p. 625–626):

> *"Si existen graves problemas con el trabajo de desarrollo que conduzcan a demoras significativas, habrá que iniciar acciones de mitigación del riesgo para reducir los riesgos de falla del proyecto. Junto con dichas acciones, se debe también replantear el proyecto."*[^1]

El costo del cambio crece a lo largo del proyecto porque:

1. En etapas tempranas (definición), el cambio afecta documentos.
2. En desarrollo, el cambio afecta código, pruebas y documentación.
3. En integración/cierre, el cambio puede invalidar trabajo ya validado.

**Regla operativa:** Todo cambio al alcance del proyecto debe evaluarse por impacto antes de aprobarse. A mayor avance del proyecto, mayor umbral de autorización requerido.

### 4.4 Proceso formal de gestión del cambio durante la ejecución

*(Diferente al CCB del Módulo 1 M1-06, que aplica a cambios de contrato)*

```
SOLICITUD DE CAMBIO
        │
        ▼
1. Registro formal del cambio (quién, qué, por qué, fecha)
        │
        ▼
2. Análisis de impacto
   ├── ¿Afecta cronograma?  → ¿cuántos días?
   ├── ¿Afecta presupuesto? → ¿cuánto $/h?
   ├── ¿Afecta alcance/SRS? → notificar M3
   └── ¿Activa riesgos?     → actualizar M2-03
        │
        ▼
3. Aprobación según nivel de impacto (ver 4.5)
        │
        ▼
4. Actualización del plan base
   ├── Actualizar hitos afectados
   ├── Recalcular presupuesto (Ver M2-02)
   ├── Actualizar registro de riesgos (Ver M2-03)
   └── Notificar a M3 si el cambio modifica el alcance
        │
        ▼
5. Implementación y seguimiento del cambio
```

### 4.5 Niveles de autorización para cambios

| Nivel de impacto | Descripción | Quién aprueba |
|---|---|---|
| **Menor** | No afecta cronograma ni presupuesto | Gestor del proyecto |
| **Moderado** | Retraso ≤ 5 días O desviación ≤ 10% presupuesto | Gestor + registro formal |
| **Mayor** | Retraso > 5 días O desviación > 10% O afecta alcance SRS | Administrador del sistema |
| **Crítico** | Retraso > 15 días O desviación > 25% O cancelación de hito | Administrador + dirección |

> **Aplicación en el sistema:** Un cambio aprobado en el Módulo 2 dispara actualizaciones automáticas en cascada: actualiza hitos afectados, recalcula el presupuesto estimado, reabre riesgos relacionados en M2-03 y notifica al proceso SRS del Módulo 3 si el cambio modifica el alcance definido.

***

## 5. Transiciones de Estado del Proyecto

*(Cap. 23 §23.2.2, p. 625–626 · lógica de negocio del sistema)*

### 5.1 Diagrama completo de transiciones

```
         [borrador]
              │
              │ Pasos 1-6 M2-01 completos
              ▼
    [pendiente_aprobacion]
              │
              │ Revisión y aprobación gestor/admin
              ▼
    [activo_en_definicion] ─────────────────────────────────────┐
              │                                                  │
              │ SRS v1.0 aprobado en M3                         │ motivo documentado
              ▼                                                  ▼
    [activo_en_desarrollo] ◀──────────────────────── [pausado]
              │            condiciones resueltas         │
              │                                          │ cualquier estado activo
              │ entregables aceptados                    │ o pausado
              ▼                                          ▼
         [completado]                              [cancelado]
```

**Regla transversal:** Los estados `completado` y `cancelado` son terminales. Ningún proyecto puede volver a un estado anterior desde ellos.

### 5.2 Proceso de cada transición

#### Tabla de transiciones

| Transición | Rol requerido | Condición necesaria | Documentación requerida | Efectos en cascada | Reversible |
|---|---|---|---|---|---|
| `borrador` → `pendiente_aprobacion` | Analista | Pasos 1–6 de M2-01 completos | Plan de proyecto completo (M2-01) | Notificación al gestor para revisión | **Sí** |
| `pendiente_aprobacion` → `activo_en_definicion` | Gestor / Admin | Revisión del plan aprobada | Acta de inicio del proyecto | Activa proceso SRS en M3; inicia monitoreo de KPIs | **No** |
| `activo_en_definicion` → `activo_en_desarrollo` | Gestor | SRS v1.0 aprobado y firmado en M3 | SRS v1.0 firmado (M3) | Cierra proceso SRS activo; activa seguimiento de hitos de desarrollo | **No** |
| `activo_*` → `pausado` | Gestor | Motivo documentado y aprobado | Acta de pausa + fecha estimada de reanudación | Suspende alertas periódicas; registra motivo en historial | **Sí** (reanudación) |
| `pausado` → `activo_en_desarrollo` | Gestor / Admin | Condiciones de pausa resueltas documentadas | Acta de reanudación | Reactiva monitoreo y alertas desde el estado anterior | — |
| `activo_*` → `completado` | Admin | Todos los entregables aceptados por el cliente | Acta de cierre + lecciones aprendidas | Actualiza `nivelRiesgo` de la Entidad en M1; cierra todos los hitos | **No** |
| `activo_*` / `pausado` → `cancelado` | Admin | Aprobación de dirección | Acta de cancelación + causa documentada | Registra estado al momento de cancelación; actualiza `nivelRiesgo` de la Entidad en M1 | **No** |

#### Detalle de cada transición

**T1: `borrador` → `pendiente_aprobacion`**
- **Rol mínimo:** Analista
- **Condiciones:** Todos los pasos del proceso M2-01 (Secciones 1–6) completados: alcance definido, cronograma elaborado, estimación de costos registrada (M2-02), análisis de riesgos inicial completado (M2-03).
- **Documentación:** Plan de proyecto completo.
- **Cascada:** Notificación al gestor/admin para revisión.
- **Reversible:** Sí. El gestor puede devolver al estado `borrador` con observaciones.

**T2: `pendiente_aprobacion` → `activo_en_definicion`**
- **Rol mínimo:** Gestor o Admin
- **Condiciones:** Plan de proyecto revisado y aprobado. Presupuesto confirmado. Cliente notificado.
- **Documentación:** Acta de inicio del proyecto firmada.
- **Cascada:** Activa el proceso SRS en el Módulo 3. Inicia el monitoreo de KPIs. Registra `fechaInicio` real del proyecto.
- **Reversible:** No. Una vez iniciado formalmente, el proyecto no vuelve a estado de propuesta.

**T3: `activo_en_definicion` → `activo_en_desarrollo`**
- **Rol mínimo:** Gestor
- **Condiciones:** SRS v1.0 aprobado y firmado en el Módulo 3. Todos los requerimientos funcionales y no funcionales documentados.
- **Documentación:** SRS v1.0 firmado (referencia a M3).
- **Cascada:** Cierra el proceso SRS activo. Activa el seguimiento de hitos de desarrollo. Congela la línea base de alcance para control de cambios.
- **Reversible:** No. Si el SRS requiere revisión mayor, se aplica un cambio formal (Sección 4.4).

**T4: `activo_*` → `pausado`**
- **Rol mínimo:** Gestor
- **Condiciones:** Motivo documentado (fuerza mayor, decisión del cliente, impedimento técnico, etc.). Fecha estimada de reanudación registrada.
- **Documentación:** Acta de pausa con motivo y fecha estimada de reanudación.
- **Cascada:** Suspende alertas periódicas automáticas. Registra evento en historial auditable. Notifica a la Entidad cliente.
- **Reversible:** Sí. Se reanuda con T5.

**T5: `pausado` → `activo_en_desarrollo`**
- **Rol mínimo:** Gestor o Admin
- **Condiciones:** Causa de la pausa resuelta y documentada.
- **Documentación:** Acta de reanudación con descripción de condiciones resueltas.
- **Cascada:** Reactiva alertas y monitoreo. Recalcula proyecciones de cronograma si la pausa superó la fecha estimada.
- **Reversible:** — (puede volver a `pausado` si es necesario).

**T6: `activo_*` → `completado`**
- **Rol mínimo:** Admin
- **Condiciones:** Todos los entregables del proyecto aceptados formalmente por el cliente. SRS v1.0 aprobado. Acta de cierre firmada. Lecciones aprendidas documentadas.
- **Documentación:** Acta de cierre + Documento de lecciones aprendidas.
- **Cascada:** Cierra y congela todos los hitos. Calcula KPIs finales. **Actualiza `nivelRiesgo` de la Entidad en el Módulo 1** con base en el desempeño del proyecto.
- **Reversible:** No.

**T7: `activo_*` / `pausado` → `cancelado`**
- **Rol mínimo:** Admin (con aprobación de dirección)
- **Condiciones:** Decisión de dirección documentada con causa específica.
- **Documentación:** Acta de cancelación con: causa, estado al momento de la cancelación, entregables parciales producidos, compromisos pendientes.
- **Cascada:** Conserva todos los datos del proyecto con estado `cancelado` (no se eliminan). **Actualiza `nivelRiesgo` de la Entidad en el Módulo 1** con impacto de cancelación.
- **Reversible:** No. Los datos se conservan para auditoría y lecciones aprendidas.

***

## 6. Seguimiento de Hitos

*(Cap. 23 §23.2.1, p. 624–625 · §23.3, p. 628–629)*

### 6.1 Definición de hito según Sommerville

> *"Los hitos son puntos en el calendario contra los que puede valorar el avance, por ejemplo, la transferencia del sistema para pruebas."* (Cap. 23 §23.2.1, p. 625)[^1]

> *"Cada hito debe documentarse mediante un breve reporte que compense el avance realizado y el trabajo efectuado. Los hitos pueden asociarse con una sola tarea o con grupos de actividades relacionadas."* (Cap. 23 §23.3, p. 628)[^1]

Ver la definición completa de hitos y su estructura en **M2-01, Sección 5**.

### 6.2 Cómo monitorear el avance hacia cada hito

Sommerville establece que la monitorización debe ser tanto formal como informal (Cap. 23 §23.1, p. 621):

> *"La monitorización informal ayuda a pronosticar problemas potenciales de proyecto al revelar las dificultades conforme ocurren."*[^1]

Los **indicadores de avance** hacia un hito son:

- % de tareas del hito marcadas como completadas (con punto final verificable).
- Días restantes hasta la fecha planificada del hito.
- Presencia de impedimentos activos registrados.
- Indicadores de riesgo específicos del hito (peticiones de cambio relacionadas, problemas técnicos abiertos).

### 6.3 Qué hacer cuando un hito está en riesgo

Sommerville describe el proceso de alerta temprana y acción correctiva (Cap. 23 §23.2.2, p. 625–626):

> *"Puesto que las estimaciones iniciales de los parámetros del proyecto inevitablemente son aproximadas, es normal que se presenten atrasos menores y habrá que hacer modificaciones al plan original."*[^1]

**Proceso de alerta temprana:**
1. El sistema detecta que el hito está a menos del umbral de días sin completarse.
2. Se emite alerta `en_riesgo` al gestor.
3. El gestor realiza análisis de causa (técnica, de recursos, de dependencias).
4. Se define y registra un plan de acción correctivo.
5. Si la acción correctiva requiere modificar el cronograma: se inicia proceso de cambio (Sección 4.4).

### 6.4 Qué hacer cuando un hito se incumple

Sommerville describe la replanificación obligatoria (Cap. 23 §23.2.2, p. 626):

> *"Si esta renegociación no tiene éxito o si no son efectivas las acciones de mitigación del riesgo, se debe organizar entonces una revisión técnica formal del proyecto."*[^1]

**Proceso de incumplimiento:**
1. El sistema marca el hito como `incumplido` y emite alerta crítica.
2. El gestor registra análisis de causa formal.
3. Se realiza replanificación del calendario afectado.
4. La replanificación requiere aprobación de Admin si impacta cronograma general > 5 días.
5. El cliente es notificado si el hito incumplido estaba vinculado a un entregable.

### 6.5 Hito como punto de revisión formal

> *"Los entregables son productos de trabajo que se proporcionan al cliente. Es el resultado de una fase significativa del proyecto, como la especificación o el diseño."* (Cap. 23 §23.3, p. 629)[^1]

En la revisión de cada hito participan: gestor del proyecto, equipo técnico responsable, y representante de la Entidad cliente (cuando el hito produce un entregable al cliente).

### 6.6 Tabla de seguimiento de hitos

| Estado del hito | Descripción | Acción del sistema | Acción del gestor |
|---|---|---|---|
| `pendiente` | Dentro del plazo, sin alertas activas | Monitoreo normal; KPIs actualizados | Seguimiento rutinario; confirmar avance de tareas |
| `en_riesgo` | A menos de X días sin completarse (umbral configurable) | Alerta amarilla al gestor; registro en historial | Análisis de causa; definir plan correctivo; registrar en sistema |
| `completado` | Entregable aceptado, antes o en fecha | Registro de `fechaCompletado` real; actualiza KPIs | Validar entregable; firmar acta de aceptación si aplica |
| `incumplido` | Fecha pasada sin completarse | Alerta roja + bloqueo de transición a `completado` del proyecto | Replanificación formal; notificar cliente si corresponde |

> **Aplicación en el sistema:** El Módulo 2 bloquea la transición `activo_en_desarrollo` → `completado` si existen hitos con estado `incumplido` sin replanificación aprobada. Esto implementa el principio de Sommerville de que el avance debe verificarse contra puntos finales tangibles, no estimaciones subjetivas.

***

## 7. Control del Presupuesto

*(Cap. 23 §23.1, p. 619–621 · §23.2.1, p. 624 · §23.2.2, p. 625–626)*

### 7.1 Comparar gasto real vs. estimación original

Sommerville establece que el plan debe incluir seguimiento de costos (Cap. 23 §23.2.1, p. 624–625):

> *"Es necesario hacer un seguimiento del avance del proyecto y comparar los avances y costos reales con el progreso planeado."*[^1]

Los tres parámetros de costo que deben monitorizarse (Cap. 23 §23.1, p. 620):

1. **Costos de esfuerzo:** horas-hombre reales vs. estimadas (componente principal).
2. **Costos de hardware y software:** licencias, infraestructura, herramientas.
3. **Costos de viajes y capacitación:** desplazamientos, formación del equipo.

### 7.2 Indicadores de alerta de desviación presupuestaria

Sommerville advierte sobre el optimismo en las estimaciones (Cap. 23 §23.3, p. 627):

> *"Si el proyecto es nuevo y técnicamente avanzado, las estimaciones iniciales seguramente serán optimistas aun cuando se trate de considerar todas las eventualidades. [...] Por lo tanto, los calendarios deben actualizarse continuamente conforme se disponga de mejor información sobre el avance."*[^1]

Y recomienda explícitamente incluir contingencia (Cap. 23 §23.3, p. 627):

> *"Tiene que haber suficiente contingencia acumulada en el plan, de modo que las restricciones y los hitos del plan no necesiten renegociarse cada vez que se revisa el ciclo de planeación."*[^1]

**Umbrales de alerta operativos** (Ver Sección 10, KPI de desviación de presupuesto):

| Desviación acumulada | Nivel | Acción |
|---|---|---|
| ≤ 10% sobre estimado | Normal | Sin acción requerida |
| 10%–25% sobre estimado | ⚠️ Alerta amarilla | Gestor revisa causas y proyecta cierre |
| > 25% sobre estimado | 🔴 Alerta roja | Admin notificado; revisión formal del presupuesto |

### 7.3 Qué hacer cuando el presupuesto se agota anticipadamente

Sommerville describe el proceso de escalamiento (Cap. 23 §23.2.2, p. 626):

> *"Esto puede incluir renegociar las restricciones del proyecto y entregables con el cliente. También es necesario establecer y acordar con el cliente un nuevo calendario sobre el tiempo en que se completará el trabajo."*[^1]

**Proceso de escalamiento presupuestario:**
1. Gestor registra proyección de agotamiento anticipado.
2. Análisis de causa: ¿retraso en cronograma? ¿cambios no controlados? ¿subestimación original?
3. Opciones: a) reducir alcance, b) solicitar presupuesto adicional, c) renegociar entregables con el cliente.
4. Si no hay acuerdo: revisión técnica formal del proyecto (puede derivar en `cancelado`).

### 7.4 Relación entre desviación de cronograma y desviación de presupuesto

Sommerville explica por qué estas desviaciones van siempre juntas (Cap. 23 §23.3, p. 630):

> *"Si una tarea T se demora, las personas seleccionadas pueden asignarse a otro trabajo W. Completar este último tal vez tarde más que la demora; sin embargo, el personal, una vez asignado, no puede simplemente reasignarse a la tarea original T. Entonces esto conducirá a más aplazamientos en T mientras se completa W."*[^1]

**Regla operativa:** Toda desviación de cronograma > 5 días en una tarea crítica debe evaluarse automáticamente por su impacto en el costo (horas adicionales de personal asignado).

> **Aplicación en el sistema:** El control del presupuesto se registra como actualizaciones periódicas documentando el gasto real acumulado contra el presupuesto estimado (M2-02). El sistema calcula automáticamente el `%_desviacion_presupuesto` y activa alertas cuando supera los umbrales definidos en la Sección 10.

***

## 8. Comunicación con la Entidad Cliente

*(Cap. 22, p. 595 · Cap. 23 §23.2.2, p. 625–626)*

### 8.1 Rol del gestor como intermediario

Sommerville establece la responsabilidad de comunicación del administrador (Cap. 22, p. 595):

> *"Los administradores de proyectos por lo común son responsables de informar del avance de un proyecto a los clientes y administradores de la compañía que desarrolla el software. Deben ser capaces de comunicarse en varios niveles, desde codificar información técnica detallada hasta elaborar resúmenes administrativos. Deben redactar documentos concisos y coherentes que sinteticen información crítica de reportes detallados del proyecto. Es necesario que esta información se presente durante las revisiones de avance."*[^1]

El gestor actúa como intermediario entre el equipo técnico y la Entidad cliente: traduce el estado técnico del proyecto en información comprensible y accionable para el cliente.

### 8.2 Tipos de reuniones con el cliente

| Tipo de reunión | Disparador | Participantes | Agenda mínima |
|---|---|---|---|
| **Reunión de avance periódica** | Cada 2–3 semanas | Gestor + representante cliente | Estado de hitos, gasto acumulado, riesgos activos, próximos pasos |
| **Revisión de hito** | Al completar un hito con entregable | Gestor + equipo técnico + cliente | Presentación del entregable, aceptación formal, criterios de calidad |
| **Revisión de cambio** | Cambio mayor o crítico solicitado | Gestor + Admin + cliente | Descripción del cambio, análisis de impacto, decisión de aprobación |
| **Reunión de cierre** | Estado → `completado` | Gestor + Admin + cliente | Aceptación final de entregables, lecciones aprendidas, acta de cierre |
| **Reunión de contingencia** | Hito `incumplido` o alerta roja | Gestor + Admin + cliente | Causa, impacto, opciones de replanificación, decisión de continuar/cancelar |

### 8.3 Cómo registrar los acuerdos de las reuniones

Cada reunión con la Entidad cliente debe registrarse en el Módulo 2 con:

- **Fecha y hora**
- **Tipo de reunión** (según tabla 8.2)
- **Asistentes** (nombres y roles)
- **Puntos tratados** (resumen ejecutivo)
- **Acuerdos y decisiones** tomados
- **Próximos pasos** con responsables y fechas

Sommerville destaca la importancia de la comunicación bidireccional y el registro formal (Cap. 22, §22.3.3, p. 613–614):

> *"Es absolutamente esencial que los miembros del grupo se comuniquen efectiva y eficientemente entre sí y con otras partes interesadas en el proyecto. Los miembros del grupo deben intercambiar información acerca del estatus de su trabajo, las decisiones de diseño que se tomaron y los cambios a las decisiones de diseño previas."*[^1]

> **Aplicación en el sistema:** Cada reunión con la Entidad cliente se registra como un evento en el Módulo 2 con los campos mencionados. Este registro es parte del historial auditable del proyecto y no puede eliminarse. Los acuerdos registrados tienen el mismo peso que el plan de proyecto para efectos de control de cambios.

***

## 9. Cierre del Proyecto

*(Cap. 23 §23.2.2, p. 626 · Cap. 22, p. 595)*

### 9.1 Cierre por completitud — estado: `completado`

#### Condiciones para el cierre exitoso

1. Todos los hitos del proyecto están en estado `completado`.
2. Todos los entregables han sido aceptados formalmente por la Entidad cliente.
3. SRS v1.0 aprobado en el Módulo 3 (sin requerimientos rechazados pendientes).
4. Deudas técnicas identificadas y documentadas (pueden quedar pendientes si el cliente las acepta).
5. Acta de cierre firmada por el gestor, el admin y el representante de la Entidad cliente.

#### Proceso de aceptación formal

Sommerville describe la aceptación como parte del entregable al cliente (Cap. 23 §23.3, p. 629):

> *"Un tipo especial de hito es la producción de un entregable del proyecto. Un entregable es un producto de trabajo que se entrega al cliente. Es el resultado de una fase significativa del proyecto, como la especificación o el diseño."*[^1]

La aceptación formal requiere que el cliente confirme por escrito que el entregable cumple los criterios del SRS.

#### Documentación de cierre requerida

| Documento | Responsable | Contenido |
|---|---|---|
| Acta de cierre | Admin | Fecha de cierre, entregables aceptados, firma del cliente |
| Lecciones aprendidas | Gestor | Ver Sección 9.3 |
| Evaluación final del equipo | Gestor | Desempeño, disponibilidad para futuros proyectos |
| Métricas finales del proyecto | Sistema automático | Ver tabla a continuación |

#### Métricas finales calculadas al cierre

| Métrica | Cálculo |
|---|---|
| Desviación real de cronograma | `fecha_cierre_real` - `fecha_cierre_planificada` (días) |
| Desviación real de presupuesto | `(gasto_real_total - presupuesto_estimado) / presupuesto_estimado × 100` |
| Número de cambios procesados | `count(cambios donde estado = 'aprobado')` |
| Número de riesgos materializados | `count(riesgos donde estado = 'materializado')` (Ver M2-03) |
| Número de hitos incumplidos | `count(hitos donde estado final = 'incumplido' o replanificados)` |
| Estabilidad de requerimientos | `count(reqs_sin_cambios_tras_SRS_aprobado) / total_reqs × 100` |

### 9.2 Cierre por cancelación — estado: `cancelado`

#### Tipos de cancelación

Sommerville identifica las causas posibles de cancelación (Cap. 23 §23.2.2, p. 626):

> *"El resultado de una revisión puede ser una decisión para cancelar un proyecto. Esto podría obedecer a un efecto de los fracasos técnicos o administrativos pero, a menudo, es consecuencia de cambios externos que afectan al proyecto. Durante este tiempo, los objetivos y las prioridades de la compañía cambian inevitablemente. Tales cambios pueden significar que el software ya no se requiere más o que los requerimientos del proyecto original resultan inadecuados."*[^1]

| Tipo de cancelación | Descripción | Iniciador |
|---|---|---|
| Decisión del cliente | El cliente retira el encargo o el contrato | Entidad cliente |
| Inviabilidad técnica | El proyecto no puede completarse con los recursos disponibles | Gestor / Admin |
| Fuerza mayor | Circunstancias externas no controlables | Admin |
| Incumplimiento contractual | Incumplimiento de obligaciones por cualquiera de las partes | Admin / cliente |
| Cambio de prioridades | Los objetivos de la organización cambiaron y el proyecto ya no es relevante | Admin / dirección |

#### Proceso de documentación de la cancelación

El acta de cancelación debe registrar:
- **Causa específica** de la cancelación (según tipos anteriores).
- **Estado del proyecto al momento de la cancelación:** % de hitos completados, gasto incurrido, requerimientos aprobados.
- **Entregables parciales producidos** que puedan ser útiles o transferibles al cliente.
- **Compromisos pendientes** (deudas técnicas, compromisos contractuales no cumplidos).
- **Lecciones aprendidas** (Ver Sección 9.3, obligatorio también en cancelaciones).

#### Conservación de datos

**Los proyectos cancelados no se eliminan del sistema.** Permanecen con estado `cancelado` en el Módulo 2 y son accesibles para:
- Auditoría y trazabilidad.
- Análisis de causa raíz.
- Alimentación del catálogo de riesgos estándar (M2-03).
- Actualización del `nivelRiesgo` de la Entidad en el Módulo 1.

### 9.3 Lecciones Aprendidas

Esta sección es **estratégicamente la más importante del archivo completo**, ya que cierra el ciclo de retroalimentación del sistema: **M1 → M2 → M3 → M2 → M1**.

#### Definición y propósito

Las lecciones aprendidas son el mecanismo mediante el cual la experiencia de un proyecto alimenta la planificación de proyectos futuros. Sommerville establece que la experiencia previa tiene un rol central en la gestión de proyectos (Cap. 22, p. 594–595):

> *"Los grandes proyectos de software se consideran en general diferentes en ciertas formas de los proyectos anteriores. Por eso, incluso los administradores que cuentan con vasta experiencia pueden encontrar difícil anticiparse a los problemas. Aunado a esto, los vertiginosos cambios tecnológicos en computadoras y comunicaciones pueden volver obsoleta la experiencia de un administrador. Las lecciones aprendidas de proyectos anteriores pueden no ser aplicables a nuevos proyectos."*[^1]

Esta advertencia justifica que las lecciones aprendidas se documenten **con contexto específico**: el tipo de proyecto, la Entidad, el equipo, la tecnología y el período.

#### Proceso de recolección

| Fase | Actividad | Participantes |
|---|---|---|
| **Preparación** | El gestor revisa KPIs finales, historial de cambios, hitos incumplidos | Gestor |
| **Sesión de retrospectiva** | Reunión estructurada de 1–2 horas al cierre del proyecto | Gestor + equipo técnico + (opcional) representante cliente |
| **Preguntas guía** | ¿Qué salió bien? ¿Qué salió mal? ¿Qué haríamos diferente? ¿Qué riesgos no anticipamos? | Todos |
| **Documentación** | Registro formal en el Módulo 2 con categorías: cronograma, presupuesto, riesgos, requerimientos, equipo | Gestor |
| **Clasificación** | Cada lección se clasifica por tipo y se vincula a un riesgo estándar si aplica | Gestor / Admin |

#### Retroalimentación al sistema — cierre del ciclo

```
┌──────────────────────────────────────────────────────────────────────┐
│                    CICLO DE RETROALIMENTACIÓN                        │
│                                                                      │
│  M1 (Entidades)                                                      │
│  ┌──────────────────┐                                                │
│  │ nivelRiesgo      │◀─── se actualiza al cierre del proyecto        │
│  │ de la Entidad    │     (completado o cancelado)                   │
│  └──────────────────┘                                                │
│           │                                                          │
│           │ proyecto asignado                                        │
│           ▼                                                          │
│  M2 (Proyectos)                                                      │
│  ┌──────────────────┐     ┌──────────────────────────────────────┐   │
│  │ Plan + seguim.   │────▶│ Lecciones aprendidas al cierre       │   │
│  │ y control        │     │                                      │   │
│  └──────────────────┘     │ ┌──────────────────────────────────┐ │   │
│           │               │ │ ¿Nueva categoría de riesgo?     │ │   │
│           │ inicia SRS    │ │ → Actualiza catálogo M2-03       │ │   │
│           ▼               │ └──────────────────────────────────┘ │   │
│  M3 (SRS)                 └──────────────────────────────────────┘   │
│  ┌──────────────────┐                                                │
│  │ Especificación   │     ↑ La experiencia del proyecto retroalimenta│
│  │ de reqs.         │     ↑ el registro de riesgos estándar y el     │
│  └──────────────────┘     ↑ nivel de riesgo de la Entidad en M1      │
└──────────────────────────────────────────────────────────────────────┘
```

**Conexión explícita:** Al cerrar un proyecto (estado `completado` o `cancelado`), el sistema:

1. **Actualiza `nivelRiesgo` de la Entidad en M1** (Módulo 1):
   - Si el proyecto se completó a tiempo y dentro del presupuesto: `nivelRiesgo` se mantiene o mejora.
   - Si el proyecto tuvo desviaciones mayores o fue cancelado: `nivelRiesgo` se incrementa.
   - La fórmula considera: desviación de cronograma + desviación de presupuesto + riesgos materializados.

2. **Actualiza el catálogo de riesgos estándar en M2-03** con nuevas categorías detectadas en las lecciones aprendidas.

3. **Alimenta las plantillas de estimación de M2-02** con datos reales del proyecto cerrado.

> **Aplicación en el sistema:** Las lecciones aprendidas no son un documento opcional de cierre: son la fuente de retroalimentación que hace que el sistema sea aprendiente. Cada proyecto cerrado mejora la precisión de estimaciones y la pertinencia del catálogo de riesgos para proyectos futuros con la misma Entidad o de tipo similar.

***

## 10. KPIs de Seguimiento del Proyecto

*(Cap. 22 §22.1, p. 595–602 · Cap. 23 §23.2.2, p. 625–626)*

Los siguientes KPIs son calculados **automáticamente** por el sistema para cada proyecto en estado activo o pausado. Se recalculan en cada ciclo de revisión (por defecto, cada 2–3 semanas).

| KPI | Definición | Fórmula | Alerta amarilla ⚠️ | Alerta roja 🔴 |
|---|---|---|---|---|
| **Avance de hitos** | % de hitos completados en tiempo respecto al total planificado | `(hitos_completados_a_tiempo / total_hitos) × 100` | < 80% | < 60% |
| **Desviación de cronograma** | Días de retraso acumulado en hitos completados o incumplidos | `fecha_hito_real − fecha_hito_estimada` (promedio) | > 5 días | > 15 días |
| **Desviación de presupuesto** | % de sobrecosto respecto a la estimación original | `((gasto_real − estimado) / estimado) × 100` | > 10% | > 25% |
| **Riesgos materializados** | Cantidad de riesgos que se convirtieron en problemas activos | `count(riesgos donde estado = 'materializado')` (M2-03) | ≥ 1 | ≥ 3 |
| **Cambios procesados** | Cantidad de cambios aprobados al plan base | `count(cambios donde estado = 'aprobado')` | ≥ 3 | ≥ 6 |
| **Estabilidad de requerimientos** | % de requerimientos del SRS sin cambios tras su aprobación | `count(reqs_inalterados) / total_reqs × 100` (Ver M2-03) | < 85% | < 70% |
| **Hitos incumplidos** | Cantidad de hitos que superaron su fecha sin completarse | `count(hitos donde estado = 'incumplido')` | ≥ 1 | ≥ 2 |

**Reglas de operación de los KPIs:**
- Una alerta roja en cualquier KPI activa notificación automática al Admin del sistema.
- Dos o más alertas rojas simultáneas requieren revisión formal del proyecto (ver proceso en Sección 7.3).
- Los KPIs se calculan con datos reales registrados; no se acepta estimación subjetiva de avance.
- La **regla del 90%** (Sección 3.5) se implementa operativamente aquí: el sistema solo cuenta un hito como completado cuando tiene un entregable verificable aceptado, no cuando el equipo lo reporta como "casi terminado".

***

## 11. Tabla de Conexiones con los 3 Módulos

| Concepto | Módulo | Campo o proceso específico |
|---|---|---|
| `nivelRiesgo` de la Entidad | **M1** | Se actualiza al cerrar/cancelar proyecto (Sección 9.3) |
| Historial de proyectos de la Entidad | **M1** | Referencia de proyectos anteriores para estimaciones |
| Plan de proyecto base | **M2-01** | Hitos, cronograma y presupuesto que se monitorean aquí |
| Estimación de costos | **M2-02** | `presupuestoEstimado` comparado con `gastoReal` en Sección 7 |
| Registro de riesgos | **M2-03** | Se actualiza en cada ciclo de revisión y al cierre del proyecto |
| Catálogo de riesgos estándar | **M2-03** | Alimentado por lecciones aprendidas (Sección 9.3) |
| Estados del proyecto | **M2** (este archivo) | Máquina de estados documentada en Sección 5 |
| Informes de avance | **M2** (este archivo) | Artefacto periódico del Módulo 2 (Sección 3) |
| Gestión de cambios durante ejecución | **M2** (este archivo) | Proceso formal en Sección 4.4 |
| KPIs automáticos | **M2** (este archivo) | Calculados sobre datos de M2-01, M2-02, M2-03 |
| SRS v1.0 aprobado | **M3** | Condición para transición `activo_en_definicion` → `activo_en_desarrollo` |
| Cambios de alcance | **M3** | Notificación automática desde Módulo 2 cuando cambia el alcance |
| Estabilidad de requerimientos | **M3** | KPI calculado sobre requerimientos del SRS (Sección 10) |

***

## 12. Checklist de Completitud

| Ítem | Sección | Estado |
|---|---|---|
| Metadatos del documento | §1 | ✅ |
| Diferencia planificación vs. seguimiento/control | §2 | ✅ |
| Ciclo plan → ejecutar → medir → controlar | §2 | ✅ |
| Definición y propósito del informe de avance (Sommerville) | §3.1 | ✅ |
| Frecuencia recomendada del informe (2–3 semanas) | §3.2 | ✅ |
| Contenido mínimo del informe de avance | §3.3 | ✅ |
| Informe de hito vs. informe periódico | §3.4 | ✅ |
| El problema de la regla del 90% (con texto de Sommerville) | §3.5 | ✅ |
| Cómo medir el avance real (métricas) | §3.6 | ✅ |
| Por qué los cambios son inevitables (Sommerville) | §4.1 | ✅ |
| Tipos de cambios durante el proyecto | §4.2 | ✅ |
| Costo del cambio según la fase del proyecto | §4.3 | ✅ |
| Proceso formal de gestión del cambio (5 pasos) | §4.4 | ✅ |
| Niveles de autorización para cambios | §4.5 | ✅ |
| Diagrama completo de transiciones de estado | §5.1 | ✅ |
| Tabla de transiciones con 7 filas | §5.2 | ✅ |
| Detalle de cada transición (7 transiciones) | §5.2 | ✅ |
| Definición de hito (Sommerville, Cap. 23) | §6.1 | ✅ |
| Indicadores de avance hacia un hito | §6.2 | ✅ |
| Proceso de alerta temprana para hito en riesgo | §6.3 | ✅ |
| Proceso de incumplimiento y replanificación | §6.4 | ✅ |
| Hito como punto de revisión formal | §6.5 | ✅ |
| Tabla de seguimiento de hitos (4 estados) | §6.6 | ✅ |
| Comparar gasto real vs. estimación (Sommerville) | §7.1 | ✅ |
| Indicadores de alerta de desviación presupuestaria | §7.2 | ✅ |
| Proceso de escalamiento presupuestario | §7.3 | ✅ |
| Relación cronograma–presupuesto (Sommerville) | §7.4 | ✅ |
| Rol del gestor como intermediario (Sommerville) | §8.1 | ✅ |
| Tipos de reuniones con el cliente | §8.2 | ✅ |
| Registro de acuerdos de reuniones | §8.3 | ✅ |
| Condiciones de cierre por completitud | §9.1 | ✅ |
| Documentación de cierre requerida | §9.1 | ✅ |
| Métricas finales al cierre | §9.1 | ✅ |
| Tipos de cancelación (Sommerville) | §9.2 | ✅ |
| Documentación de cancelación | §9.2 | ✅ |
| Conservación de datos de proyectos cancelados | §9.2 | ✅ |
| Definición y propósito de lecciones aprendidas | §9.3 | ✅ |
| Proceso de recolección de lecciones aprendidas | §9.3 | ✅ |
| Ciclo de retroalimentación M1→M2→M3→M2→M1 | §9.3 | ✅ |
| Actualización de `nivelRiesgo` de Entidad en M1 | §9.3 | ✅ |
| Actualización catálogo de riesgos M2-03 | §9.3 | ✅ |
| 7 KPIs con fórmula y umbrales de alerta | §10 | ✅ |
| Reglas de operación de los KPIs | §10 | ✅ |
| Tabla de conexiones con los 3 módulos | §11 | ✅ |
| Checklist de completitud | §12 | ✅ |

***

*Documento generado con base en: Sommerville, Ian. **Ingeniería de Software**, 9.ª edición. Pearson Educación, 2011. Capítulos 22 y 23.*
*Extiende y coordina: M2-01 (plan), M2-02 (costos), M2-03 (riesgos). No repite su contenido.*

---

## References

1. [Ingenieria-de-Software-Sommerville.pdf](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_20766faf-8b01-49ce-8ad0-87abfae47f60/e01c9caf-8926-412e-b6f0-c64fac70bd56/Ingenieria-de-Software-Sommerville.pdf?AWSAccessKeyId=ASIA2F3EMEYEUQ4VNO7M&Signature=D9j77P0tKBRTqZaWl2ltxdkol4w%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEDkaCXVzLWVhc3QtMSJHMEUCIA8uf9Xn08upTsmDQEJZRXj3hdapg5gEnl8tTqNq7d1yAiEA9TfPLWQN1wMPsuI6RQ5mkryDjtrFNqqE9GlTrqcjh0Yq8wQIAhABGgw2OTk3NTMzMDk3MDUiDEAkg0xw0qmNOqiJ6CrQBPTYvb3BorObCg%2BH5oYz5I3CPJyX1aZUTpRyGENwtYPxdLZhQ31HRihLn4czGCfF7grvjj9d0nN3RZ%2BmECdRomCEwKOD1TbfhfPmZ5hSPd0Re1wx2TO2JMvvsDIE1399I1eLq3H0mcrG8L%2FfJu88PIm5XiwHdxAXuZI6gbbhULfDbfdx7vT7mWQbPJwT1Bi3J%2F0yO%2BLNba0dD0J3I1d%2BtRZNzozr%2BbyxuTLeJJsV35SWEo1B2XOjce%2Bfi9OSxhZrBZwgRWo2xvqrHCqqiiPQzUUkhV01vUN7X%2B%2BrUN7NYIq2Lu0o1MVQG76UrcPtrknYKBU4P4Fm1juFmZd1ynKTHRGKiCTrOgIFYIjnoDyitG5dKgocvrti3%2Bb6ysEbRIVRLBWo2ta1rPpd68zf9IAkkV4XtNNz2ug3Su7geHsiOCIhtHLsNMET2f8fNPuwBSkNonPAupk6TS4jjhMt7rcKxA3Mr8q2dFZTp8n6NgyPypEEdEAkzEQy5cvOxGmh3BAhnXEhr95c%2BOise8NVmMn9UkmXUGc2VMCRL7U8zmN6deYoB%2BpMmX1MtCJB%2BjdZ02oZ7iI5iIoJWkC3A8H8MecnVUuPHSvfoMnSGs43%2FhSO1PIm8lq1kbulcMu6DVBk1jBeFO9OvNKmjAaMkV%2BEfbJxD%2BFEdg3wGIHTpxOuY4aRttIY%2FQkus1pelHPg7gR1Sv4E%2F%2F0guxmp9pG%2FJGE6r84hFSjLFKAMwndpB8jUR29mfxS2hrYfqveBbbgPk9CDEABfRv2XaDhpQuMLspR6vJ8mSPwwrZP5zAY6mAF1A3ISoQPcY4VeAInNQ4lDemHwcs6AmJcOOpx%2BWE0aMSEDIyv5O9%2BM1Wrobz88D8%2BT9kILfSegxD9ebHpd%2Bf%2BCMsOzSGk8w1UhVxFm1eEgKmUOQjYmQkrR4Mr2y4p0V1JRzpcZdOs9q7wS8kh6x76vMR6jI%2BWCsdZ5qirLyE70c9U9seKyx0XojVrxv%2F3eGS5c1RosqLENiA%3D%3D&Expires=1771986752) - Los componentes de software de reutilizacin contienen defectos que hacen que no puedan reutilizarse ...

