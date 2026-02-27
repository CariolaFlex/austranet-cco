# M2-07-metodologia-desarrollo-acordada.md

<!--
  Archivo       : M2-07-metodologia-desarrollo-acordada.md
  Módulo        : Módulo 2 — Registro de Proyectos
  Capítulos fuente: Cap. 2 §2.3 / Cap. 2 §2.4 / Cap. 3 §3.2 / Cap. 3 §3.5
  Libro         : Ingeniería de Software, Ian Sommerville, 9ª Edición (Pearson, 2011)
  Versión       : 1.0.0
  Fecha         : 2026-02-26
  Estado        : APROBADO
-->

---

## 1. Metadatos

| Campo | Valor |
|---|---|
| **Nombre del archivo** | `M2-07-metodologia-desarrollo-acordada.md` |
| **Módulo** | Módulo 2 — Registro de Proyectos |
| **Capítulos fuente** | Cap. 2 §2.3 (entrega incremental) · Cap. 2 §2.4 (RUP fases e hitos) · Cap. 3 §3.2 (plan vs. ágil) · Cap. 3 §3.5 (escalamiento ágil) |
| **Libro** | *Ingeniería de Software*, Ian Sommerville, 9ª Edición (Pearson, 2011) |
| **Versión** | 1.0.0 |
| **Fecha** | 2026-02-26 |
| **Estado del proyecto cubierto** | `borrador` → `pendiente_aprobacion` (la metodología se acuerda antes de activar el proyecto) |
| **Referencias cruzadas** | `01-modelos-proceso-software.md` · `02-metodologias-agiles.md` · `M2-01` (PASO 2 del flujo de creación) · `M2-02` (la metodología condiciona el método de estimación) · `M2-06` (la metodología define la política de entregas) · `M3-01` (la metodología condiciona el tipo de SRS) |

---

## 2. Objetivo del Documento

Este archivo **NO** es un repositorio teórico de metodologías de desarrollo. La teoría ya existe: los modelos en cascada, incremental y RUP están completamente documentados en `01-modelos-proceso-software.md`; los métodos ágiles (Scrum, XP, Manifiesto Ágil, escalamiento) están íntegramente cubiertos en `02-metodologias-agiles.md`; y la tabla de criterios de selección de metodología con 5 dimensiones se encuentra en `M2-01`, Sección 7 (PASO 2). Repetir esa teoría aquí introduciría duplicación y, con el tiempo, contradicción entre archivos.

Lo que este archivo documenta es algo distinto: el **acuerdo formal** de metodología para un proyecto específico. Existe una diferencia fundamental entre *conocer* qué es Scrum y *acordar* con el cliente de la Entidad (Módulo 1) que el proyecto se ejecutará usando Scrum, con todas sus implicaciones concretas sobre disponibilidad, frecuencia de revisiones y forma de recibir los entregables. Este documento captura ese acuerdo, lo convierte en un artefacto auditable y establece sus consecuencias operativas en los tres módulos del sistema.

La metodología es la decisión con mayor **efecto en cascada** sobre todo el sistema. Una vez registrada en `Proyecto.metodologia` durante M2-01 PASO 2, condiciona: el tipo de SRS habilitado en el Módulo 3 (completo, incremental, por épica o mínimo); la política de entregas en M2-06 (una entrega final, por incremento o por sprint); la estructura del equipo en M2-05 (roles obligatorios, tamaño máximo); el método de estimación en M2-02 (COCOMO II, puntos de función o story points); y los KPIs de seguimiento en M2-04 (burndown, avance por hito o velocidad). Ninguna otra decisión del proyecto tiene este alcance transversal.

El **acuerdo con el cliente** es la dimensión que distingue a este archivo de los documentos de fundamentos. La metodología no la decide unilateralmente el equipo técnico: el cliente de la Entidad (M1) debe aceptarla de forma explícita porque implica compromisos sobre su disponibilidad (`Entidad.disponibilidadParaSprints`), la frecuencia con que recibirá revisiones y demos, y la forma en que se gestionarán los cambios de requerimientos. Este consentimiento informado del cliente queda documentado en la Plantilla Operativa de la Sección 5 y es condición necesaria antes de que el proyecto avance a estado `pendiente_aprobacion`.

---

## 3. La Decisión de Metodología: Marco Operativo

Esta sección no repite la teoría de los archivos de fundamentos. La referencia explícita a ellos y construye el marco operativo de la decisión.

### 3.1 Inputs Requeridos para Tomar la Decisión

Los siguientes datos del proyecto deben estar disponibles **antes** de poder registrar la metodología en PASO 2 de M2-01. Algunos provienen de M1; otros se ingresan en PASO 1 del mismo flujo.

| Campo en `Proyecto` | Origen | Por qué es crítico para la decisión |
|---|---|---|
| `criticidad` | M2-01 PASO 1 | Determina si se requiere documentación formal obligatoria; criticidad `alta` o `critica` bloquea metodologías sin SRS completo (ver M2-01, PASO 2) |
| `tamanoEquipo` | Estimación en M2-01 PASO 3 | Limita qué metodologías son viables: ágil puro es inviable sobre 9-10 personas sin adaptación (Sommerville Cap. 3 §3.5) |
| `distribuidoGeograficamente` | M2-01 PASO 3 | Si `true`, las metodologías ágiles requieren adaptación; el equipo distribuido favorece documentación formal (Cap. 3 §3.2, p. 63, pregunta 7) |
| `requiereRegulacionExterna` | M2-01 PASO 1 | Si `true`, bloquea metodologías sin documentación formal; los reguladores externos exigen documentación detallada del sistema (Cap. 3 §3.2, p. 64, pregunta 10) |
| `estabilidadRequerimientos` | M2-01 PASO 2 | El criterio más determinante para cascada vs. ágil; requerimientos volátiles son incompatibles con cascada (Cap. 2 §2.1.1, p. 32) |
| `clienteDisponibleParaIteraciones` | Perfil Entidad en M1 (`Entidad.disponibilidadParaSprints`) | Bloquea Scrum y XP si es `false`; la participación del cliente es condición sine qua non del ágil (Cap. 3 §3.1, p. 59) |
| `tieneContratoFijo` | M2-01 PASO 1 | Si `true`, fuerza mayor documentación formal; ágil con contrato fijo requiere SRS formal de todas formas (M3-01), porque las entregas deben estar contractualmente definidas |

> **Aplicación en el sistema:** Los campos anteriores mapean directamente al tipo `Proyecto` del sistema. El formulario de M2-01 PASO 2 debe mostrar los valores actuales de estos campos antes de solicitar la elección de `metodologia`, para que el gestor tome la decisión informado. Si algún campo obligatorio está vacío, el sistema bloquea PASO 2 hasta que PASO 1 esté completo.

---

### 3.2 Árbol de Decisión de Metodología

El siguiente árbol traduce las 10 preguntas de Sommerville (Cap. 3 §3.2, pp. 63-64) — documentadas en `02-metodologias-agiles.md`, Sección 3.3 — a los campos exactos del tipo `Proyecto`. Es la lógica que el sistema ejecuta para **recomendar** una metodología al gestor.

```
¿requiereRegulacionExterna = true?
│
├─ SÍ → ¿criticidad = 'alta' | 'critica'?
│       │
│       ├─ SÍ → CASCADA o RUP
│       │        (metodología con documentación formal obligatoria;
│       │         regulación + alta criticidad = máxima documentación)
│       │
│       └─ NO → INCREMENTAL o RUP
│                (entrega parcial con documentación formal por hito;
│                 regulación presente pero criticidad tolerable)
│
└─ NO → ¿estabilidadRequerimientos = 'alta'?
        │
        ├─ SÍ → ¿tamanoEquipo > 10 O distribuidoGeograficamente = true?
        │       │
        │       ├─ SÍ → RUP
        │       │        (proceso formal para equipos grandes o distribuidos;
        │       │         requerimientos estables + equipo grande → RUP)
        │       │
        │       └─ NO → CASCADA
        │                (requerimientos estables, equipo pequeño-mediano;
        │                 contexto ideal para cascada según §2.1.1, p. 32)
        │
        └─ NO (estabilidadRequerimientos = 'media' | 'baja')
               │
               └─ ¿clienteDisponibleParaIteraciones = true?
                  │
                  ├─ SÍ → ¿tamanoEquipo <= 9?
                  │        │
                  │        ├─ SÍ → ¿estabilidadRequerimientos = 'baja'?
                  │        │        │
                  │        │        ├─ SÍ → ÁGIL/XP
                  │        │        │        (cambio continuo, equipo muy pequeño,
                  │        │        │         máxima volatilidad de reqs.)
                  │        │        │
                  │        │        └─ NO → ÁGIL/SCRUM
                  │        │                (cambio moderado, equipo pequeño,
                  │        │                 cliente disponible por sprint)
                  │        │
                  │        └─ NO (tamanoEquipo > 9) → INCREMENTAL o HÍBRIDO
                  │                                    (ágil no escala sin adaptación
                  │                                     — ver Cap. 3 §3.5)
                  │
                  └─ NO (clienteDisponibleParaIteraciones = false)
                         │
                         └─ ¿tieneContratoFijo = true?
                            │
                            ├─ SÍ → CASCADA
                            │        (sin cliente disponible + contrato fijo:
                            │         máxima documentación previa obligatoria)
                            │
                            └─ NO → INCREMENTAL
                                     (entregas definidas sin iteración ágil;
                                      cliente no disponible pero sin contrato fijo)
```

> **Nota operativa:** Este árbol es una guía basada en los criterios de Sommerville (Cap. 3 §3.2, pp. 63-64). El gestor del proyecto puede sobrescribir la recomendación del árbol justificando explícitamente la decisión en el campo `justificacionMetodologia`. La sobrescritura queda auditada en el sistema: se registra quién sobrescribió, cuándo y por qué.

---

### 3.3 Tabla de Validaciones Bloqueantes

El sistema verifica estas condiciones **automáticamente** al registrar la metodología. Si se viola una condición bloqueante, el sistema impide guardar hasta que el usuario la resuelva o la justifique explícitamente con confirmación de rol `gestor` o `admin`.

| Metodología | Condición bloqueante | Campo verificado | Mensaje de error del sistema |
|---|---|---|---|
| `agil_scrum` | `clienteDisponibleParaIteraciones = false` | `Proyecto.clienteDisponibleParaIteraciones` | *"Scrum requiere disponibilidad del cliente para revisiones por sprint. Cambia a 'Incremental' o confirma disponibilidad del cliente actualizando el perfil en Módulo 1."* |
| `agil_xp` | `tamanoEquipo > 6` | `Proyecto.tamanoEquipo` | *"XP no escala sobre 6 personas (Sommerville Cap. 3 §3.5). Considera Scrum o Incremental para este tamaño de equipo."* |
| `agil_scrum` / `agil_xp` | `requiereRegulacionExterna = true` Y `tieneContratoFijo = true` | Ambos campos simultáneamente | *"Proyecto regulado con contrato fijo requiere SRS formal. Metodología ágil solo es compatible si se documenta el SRS completo antes de iniciar desarrollo (ver M3-01, Sección 2)."* |
| `cascada` | `estabilidadRequerimientos = 'baja'` | `Proyecto.estabilidadRequerimientos` | *"Cascada requiere requerimientos estables. Con alta volatilidad de requerimientos, considera Incremental o Scrum."* |
| `rup` | `tamanoEquipo < 5` | `Proyecto.tamanoEquipo` | *"RUP está diseñado para equipos medianos-grandes. Para equipos de menos de 5 personas, considera Incremental o Scrum."* |

---

## 4. Implicaciones de Cada Metodología en el Sistema

Esta sección es el **aporte único** de este archivo. Los archivos de fundamentos describen *qué son* las metodologías; esta sección describe *qué cambia en el sistema* cuando se elige cada una. La distinción es crítica: el gestor que lee M2-07 no necesita reaprender la teoría de Scrum; necesita saber exactamente qué campos, procesos y restricciones se activan en los Módulos 1, 2 y 3 cuando registra `metodologia: 'agil_scrum'`.

---

### 4.1 CASCADA — Implicaciones en el Sistema

#### Impacto en Módulo 3 (SRS)

- El SRS debe estar en estado `aprobado` (versión 1.0) **antes** de que el proyecto pueda transicionar a `activo_en_desarrollo`. El sistema bloquea esta transición si `SRS.estado ≠ 'aprobado'` y `Proyecto.metodologia = 'cascada'`.
- No se admite la opción de validación incremental por épica (que sí existe en Scrum — ver M3-05, Sección 8.3). El campo `validacionIncremental` del SRS debe ser `false`.
- Los requerimientos deben tener estado `propuesto` antes de iniciar la especificación. No se pueden agregar requerimientos nuevos tras la aprobación del SRS v1.0 sin pasar por el proceso CCB documentado en M3-08. Toda modificación post-aprobación genera una Solicitud de Cambio formal.

#### Impacto en Módulo 2 (Proyecto — Estimación y Presupuesto)

- Método de estimación recomendado: **COCOMO II** o puntos de función (ver M2-02). El plan completo debe existir antes de comenzar a construir; sin estimación total no se puede estructurar el Gantt.
- El campo `presupuestoEstimado` es **obligatorio** en cascada. Si `Proyecto.metodologia = 'cascada'` y `presupuestoEstimado` es nulo o cero, el sistema bloquea la transición a `pendiente_aprobacion`.
- La política de entregas en M2-06 es: **una entrega al final** o entregas parciales por fase técnica (no por funcionalidades). El campo `politicaEntregas` del M2-06 debe configurarse como `'unica_final'` o `'por_fase_tecnica'`.

#### Impacto en Módulo 2 (Hitos — M2-01 PASO 5)

- El array `hitos[]` en M2-01 PASO 5 debe cubrir **todo el alcance del proyecto** organizado por las 5 fases técnicas del modelo cascada (ver `01-modelos-proceso-software.md`, Sección 3.1): análisis de requerimientos → diseño → implementación → integración y pruebas → operación y mantenimiento. No hay replaneación por sprint.
- Cada hito corresponde a la finalización y aprobación de una fase. El hito crítico para transicionar a `activo_en_desarrollo` es el que marca la aprobación del SRS v1.0 (fin de la fase de análisis de requerimientos).

#### Impacto en Módulo 2 (Equipo — M2-05)

- Los roles en `MiembroEquipo[]` pueden rotar por fase: analistas en fase 1, arquitectos en fase 2, desarrolladores en fases 3-4, testers en fase 4, operaciones en fase 5. El sistema debe permitir registrar la fase de participación activa de cada miembro.
- La Matriz RACI (M2-05) se define **por fase técnica**, no por sprint.

#### Impacto en Módulo 1 (Entidad)

- El cliente (Entidad) **no necesita** disponibilidad continua. Solo se requiere participación en dos momentos: aprobación del SRS y entrega final. El campo `Entidad.disponibilidadParaSprints` **no es condición bloqueante** en cascada.
- El campo `Entidad.aceptaEntregasIncrementales` debería ser `false` en cascada pura; si es `true`, el sistema muestra una advertencia de incoherencia metodológica.

> **Referencia teórica completa:** Ver `01-modelos-proceso-software.md`, Sección 3.1 (5 fases del modelo cascada con citas textuales, ventajas, desventajas, cuándo usarlo — Cap. 2 §2.1.1, pp. 30-32).

---

### 4.2 INCREMENTAL — Implicaciones en el Sistema

#### Impacto en Módulo 3 (SRS)

- El SRS puede aprobarse **por incrementos**. Cada incremento tiene su propio subconjunto de requerimientos funcionales aprobados. El campo `SRS.validacionIncremental` debe ser `true`.
- Se puede iniciar el desarrollo del incremento 1 con los RF del incremento 1 en estado `aprobado`, mientras los RF del incremento 2 aún están en `en_adquisicion`. Esta es la distinción operativa clave respecto a cascada (ver `01-modelos-proceso-software.md`, Sección 5.2 — entrega incremental §2.3.2).
- Cada incremento genera su propio tag de versión en el SRS: `v1.0` (Inc-1), `v1.1` (Inc-2), `v1.2` (Inc-3), etc. El sistema debe soportar versionado por incremento en el Módulo 3.

#### Impacto en Módulo 2 (Proyecto — Hitos)

- El array `hitos[]` en M2-01 PASO 5 debe organizarse **por incremento**, no por fase técnica. Cada hito de incremento incluye: (a) los RF comprometidos en ese incremento, (b) el criterio de aceptación del incremento, y (c) la fecha de entrega al cliente.
- La política de entregas en M2-06 se configura como `'por_incremento'`. El cliente recibe software funcional (desplegado en entorno operacional real) al finalizar cada incremento — ver distinción desarrollo incremental vs. entrega incremental en `01-modelos-proceso-software.md`, Sección 5.2.
- El presupuesto puede estimarse por incremento usando estimación por analogía o puntos de función (M2-02). El campo `presupuestoEstimado` es recomendado pero no estrictamente bloqueante para cada incremento individual; sí es obligatorio el presupuesto total antes de `pendiente_aprobacion`.

#### Impacto en Módulo 2 (Equipo)

- El equipo es **estable durante todos los incrementos** (a diferencia de cascada, donde puede rotar por fase). El array `equipo[]` no cambia de composición entre incrementos; si cambia, debe registrarse como evento en el log del proyecto.
- Se recomienda equipo pequeño a mediano con roles T-shaped: un developer puede asumir análisis Y desarrollo, lo que facilita la transición fluida entre incrementos sin costosos traspasos de conocimiento.

#### Impacto en Módulo 1 (Entidad)

- El cliente **debe** estar disponible para validar cada incremento antes de liberar el siguiente. `Entidad.disponibilidadParaSprints = true` es **recomendado** (no bloqueante, a diferencia de Scrum), pero sin esta disponibilidad el ciclo incremental puede detenerse.
- El campo `Entidad.aceptaEntregasIncrementales` debe ser `true`. Si es `false`, el sistema muestra una alerta: *"La entidad cliente no ha aceptado el modelo de entregas parciales. Se requiere confirmación explícita antes de continuar."*

> **Referencia teórica completa:** Ver `01-modelos-proceso-software.md`, Sección 3.2 (definición incremental, 3 ventajas, 2 desventajas — Cap. 2 §2.1.2, pp. 32-34) y Sección 5.2 (distinción desarrollo incremental vs. entrega incremental — Cap. 2 §2.3.2, pp. 47-49).

---

### 4.3 RUP — Implicaciones en el Sistema

#### Impacto en Módulo 3 (SRS)

- El SRS se construye principalmente en la **fase de Elaboración** del RUP. Los casos de uso son el artefacto central de especificación de requerimientos (ver `01-modelos-proceso-software.md`, Sección 6 — RUP completo).
- La fase de Inicio puede iniciarse con el SRS parcial (alcance y caso empresarial). La Elaboración termina con el SRS completo y aprobado: ese es el gate que habilita la transición a `activo_en_desarrollo`.
- El gate de fin de Elaboración = aprobación del SRS v1.0 = transición del proyecto a `activo_en_desarrollo`. El sistema debe verificar que `SRS.estado = 'aprobado'` **y** que el hito "Revisión de la Arquitectura del Ciclo de Vida" esté marcado como completado antes de permitir esta transición.

#### Impacto en Módulo 2 (Proyecto — Hitos)

El array `hitos[]` **debe** incluir los 4 hitos de fase del RUP con sus criterios de avance. A continuación se documentan basados en Sommerville (Cap. 2 §2.4):

| # | Hito RUP | Nombre formal | Criterios de avance (Cap. 2 §2.4) |
|---|---|---|---|
| 1 | Fin de **Inicio** | Revisión de Objetivos del Ciclo de Vida | Caso empresarial aprobado; alcance acordado con el cliente; riesgos principales identificados y valorados; factibilidad técnica y económica confirmada |
| 2 | Fin de **Elaboración** | Revisión de la Arquitectura del Ciclo de Vida | Arquitectura baseline estable y documentada; requerimientos críticos capturados en casos de uso; plan de proyecto detallado aprobado; SRS v1.0 aprobado → **habilita `activo_en_desarrollo`** |
| 3 | Fin de **Construcción** | Capacidad Operativa Inicial | Sistema funcional en versión beta; documentación de usuario completa; sistema listo para pruebas de aceptación con el cliente |
| 4 | Fin de **Transición** | Liberación del Producto | Sistema desplegado en entorno de producción; usuarios capacitados; soporte post-lanzamiento establecido; proyecto en condiciones de cierre |

- El hito crítico que activa `activo_en_desarrollo` es el **Hito 2 (Revisión de la Arquitectura del Ciclo de Vida)**, al completar la fase de Elaboración.
- La política de entregas en M2-06 se configura como `'por_fase_rup'`. El cliente recibe software funcional al final de Construcción (Hito 3) y el sistema productivo al final de Transición (Hito 4).

#### Impacto en Módulo 2 (Equipo — M2-05)

RUP define roles específicos que deben mapearse al campo `MiembroEquipo.rol`:

| Rol RUP | Campo `MiembroEquipo.rol` | Observación |
|---|---|---|
| Arquitecto | `'arquitecto'` | Responsable de la arquitectura baseline (Hito 2) |
| Analista | `'analista'` | Captura casos de uso en Inicio y Elaboración |
| Diseñador | `'ux_designer'` / `'arquitecto'` | Según el tipo de diseño (interfaz vs. arquitectónico) |
| Implementador | `'desarrollador'` | Activo principalmente en Construcción |
| Tester | `'qa'` | Activo en Construcción y Transición |
| Gerente de Proyecto | `'pm'` / `'gestor'` | Gestión de todo el ciclo |

#### Impacto en Módulo 1 (Entidad)

- El cliente participa en los **hitos de fase**, no en iteraciones semanales. Disponibilidad requerida: 4 reuniones de hito durante el proyecto.
- El Hito 2 (fin de Elaboración) requiere la presencia del stakeholder de M1 con `Stakeholder.nivelInfluencia = 'alto'` para aprobar la arquitectura baseline y el SRS v1.0. Si no existe tal stakeholder registrado en la Entidad, el sistema genera una advertencia.

> **Referencia teórica completa:** Ver `01-modelos-proceso-software.md`, Sección 6 (RUP completo: 4 fases, 6 buenas prácticas, flujos de ingeniería y de apoyo — Cap. 2 §2.4).

---

### 4.4 ÁGIL/SCRUM — Implicaciones en el Sistema

#### Impacto en Módulo 3 (SRS)

- El SRS puede aprobarse **por épica** (validación incremental activada — ver M3-05, Sección 8.3). El campo `SRS.validacionIncremental` debe ser `true`.
- El campo `SRS.estado` puede ser `'aprobado'` parcialmente: las épicas del MVP aprobadas permiten iniciar el desarrollo del primer sprint aunque el SRS completo no esté en v1.0. Esta es la diferencia operativa más importante respecto a cascada y RUP.
- El Product Backlog de Scrum mapea directamente al registro de requerimientos del Módulo 3: `Requerimiento.tipo = 'funcional'` con prioridad MoSCoW corresponde al sprint backlog. Ver `02-metodologias-agiles.md`, Sección 4.2 (equivalencia Product Backlog / SRS).

#### Impacto en Módulo 2 (Proyecto — Hitos y Estimación)

- El array `hitos[]` en M2-01 PASO 5 se organiza **por sprint**, no por fase. Cada hito de sprint incluye: (a) duración en semanas (2-4 según Sommerville §3.4, p. 73), (b) RF comprometidos del Sprint Backlog, y (c) criterio de Definition of Done.
- El método de estimación recomendado es **Planning Poker / Story Points** con velocidad del equipo (ver M2-02). El presupuesto **no se estima globalmente en COCOMO II**; se calcula por velocidad del equipo multiplicada por costo por sprint.
- El campo `presupuestoEstimado` no es obligatorio en Scrum (se estima gradualmente). Si `tieneContratoFijo = true`, el sistema activa una advertencia: *"Scrum con contrato de precio fijo requiere estimación de story points total antes de firmar el contrato."*
- La política de entregas en M2-06 se configura como `'por_sprint'`. El campo `Sprint.burndownData[]` es obligatorio para el seguimiento de progreso (ver M2-04).

#### Impacto en Módulo 2 (Equipo — M2-05)

El equipo debe ser pequeño: entre 5 y 9 personas según Sommerville (Cap. 3 §3.4, p. 73 — ver `02-metodologias-agiles.md`, Sección 4.1). Los roles Scrum son obligatorios en el sistema:

| Rol Scrum | Campo `MiembroEquipo.rol` | Restricción |
|---|---|---|
| Maestro de Scrum | `'scrum_master'` | Máximo 1 por proyecto; obligatorio |
| Product Owner | `'product_owner'` | Puede ser el stakeholder de M1; obligatorio |
| Equipo de Desarrollo | `'developer'` / `'team_member'` | Sin jerarquía interna; auto-organizado |

- El sistema bloquea la activación del proyecto si no existe exactamente 1 miembro con `rol: 'scrum_master'` y al menos 1 con `rol: 'product_owner'`.

#### Impacto en Módulo 1 (Entidad)

- `Entidad.disponibilidadParaSprints = true` es **condición bloqueante** para Scrum (ver Sección 3.3 de este archivo). Sin esta disponibilidad, el sistema impide registrar `metodologia: 'agil_scrum'`.
- El stakeholder con `Stakeholder.nivelInfluencia = 'alto'` de M1 puede actuar como Product Owner en el sistema; en ese caso, `MiembroEquipo.esExterno = true` y se vincula al perfil de la Entidad.
- El cliente debe tener disponibilidad mínima de 1 reunión cada 2-4 semanas (revisión de sprint). Este compromiso debe quedar registrado en la Sección "Acuerdo con el Cliente" de la Plantilla Operativa (Sección 5).

> **Referencia teórica completa:** Ver `02-metodologias-agiles.md`, Secciones 4 y 5 (Scrum completo: roles, artefactos, proceso, escalamiento — Cap. 3 §3.4 y §3.5, pp. 72-76).

---

### 4.5 ÁGIL/XP — Implicaciones en el Sistema

#### Impacto en Módulo 3 (SRS)

- El SRS es **mínimo** en XP. Los artefactos principales son las Historias de Usuario, no el documento formal SRS. El campo `SRS.tipoDocumento` debe configurarse como `'historias_usuario'`.
- `Requerimiento.tipo = 'funcional'` adopta el formato de Historia de Usuario: *"Como [rol] quiero [funcionalidad] para [beneficio]"*. El campo `criterioAceptacion` es especialmente crítico en XP porque los tests automatizados (TDD) se escriben a partir de él antes de codificar.
- No se requiere SRS v1.0 completo para iniciar desarrollo, **EXCEPTO si** `tieneContratoFijo = true` o `requiereRegulacionExterna = true` (ver validaciones bloqueantes en Sección 3.3). En esos casos, incluso XP debe producir documentación formal antes de desarrollo.

#### Impacto en Módulo 2 (Proyecto — Tamaño y Prácticas)

- El equipo debe ser **muy pequeño**: entre 2 y 6 personas. La condición bloqueante `tamanoEquipo > 6` está documentada en la Sección 3.3. Si se supera este límite, XP pierde sus ventajas de comunicación informal y pair programming efectivo (Cap. 3 §3.3 — ver `02-metodologias-agiles.md`, Sección 3).
- La práctica de Programación en Pares implica que 2 personas trabajan simultáneamente en 1 tarea: el `tamanoEquipo` efectivo de producción es aproximadamente `tamanoEquipo / 2` para efectos de capacidad de sprint.
- **Integración Continua (CI) es OBLIGATORIA** en XP, no opcional. El campo `cicdObligatorio` en M2-06 debe ser `true` cuando `metodologia: 'agil_xp'`. El sistema debe verificar este campo antes de activar el proyecto.
- Sommerville no especifica un método de estimación formal único para XP en §3.3. La implicación documentada se deriva de los principios del método (entrega incremental + mínima documentación + iteraciones cortas) y del marco de decisión del §3.2: se recomienda Story Points con iteraciones de 1-2 semanas.

#### Impacto en Módulo 2 (Equipo)

- Todos los miembros del equipo son desarrolladores con **rol rotativo**: no hay jerarquías fijas más allá del cliente. En el sistema, todos los miembros excepto el cliente registran `rol: 'developer'`.
- El cliente (Entidad) debe estar disponible **diariamente**, no solo por sprint. Esta es la condición más exigente de todas las metodologías. Si el cliente no puede garantizar disponibilidad diaria, el sistema recomienda cambiar a Scrum (disponibilidad semanal / por sprint).

#### Impacto en Módulo 1 (Entidad)

- `Entidad.disponibilidadParaSprints = true` es **condición bloqueante** (igual que Scrum — ver Sección 3.3).
- La diferencia práctica con Scrum: en XP, el cliente no solo asiste a demos; está disponible para responder preguntas de los desarrolladores cada día. Este nivel de disponibilidad debe quedar explícitamente acordado en la Sección "Acuerdo con el Cliente" de la Plantilla Operativa (Sección 5), especificando disponibilidad **diaria** vs. la disponibilidad por sprint de Scrum.

> **Referencia teórica completa:** Ver `02-metodologias-agiles.md`, Sección 3 (XP completo: 12 prácticas con definiciones textuales, cuándo usar XP — Cap. 3 §3.3, pp. 64-72).

---

### 4.6 HÍBRIDO — Implicaciones en el Sistema

Sommerville reconoce explícitamente que la mayoría de proyectos reales combinan enfoques:

> *"En la práctica, la mayoría de los procesos de software prácticos incluyen elementos de todos estos modelos de procesos."*
> (Cap. 2 §2.1, p. 30)

Y en el contexto de plan vs. ágil:

> *"En la práctica, la mayoría de los proyectos de software incluyen algunas prácticas de ambos enfoques."*
> (Cap. 3 §3.2, p. 62 — paráfrasis del principio; la formulación exacta puede consultarse en `02-metodologias-agiles.md`, Sección 3.1)

#### Cuándo el sistema recomienda `metodologia: 'hibrido'`

El árbol de decisión (Sección 3.2) produce la recomendación `HÍBRIDO` cuando:
- El resultado del árbol es conflictivo: por ejemplo, cliente disponible (`clienteDisponibleParaIteraciones = true`) pero `tamanoEquipo > 9` (ágil puro no escala sin adaptación — Cap. 3 §3.5).
- `tamanoEquipo > 9` con `estabilidadRequerimientos = 'baja'` (Scrum con estructura de RUP para proyectos grandes).
- El sistema tiene módulos con distintas estabilidades de requerimientos: cascada para módulos estables, incremental para los volátiles.

#### Combinaciones reconocidas en el sistema

| Combinación híbrida | Contexto típico | Impacto en SRS (M3) | Impacto en hitos M2 |
|---|---|---|---|
| **RUP + Scrum** (fases RUP con sprints dentro de Construcción) | Proyecto grande con arquitectura compleja y equipo mediano-grande | SRS formal completo en Elaboración (Hito 2); Product Backlog activo durante Construcción | 4 hitos de fase RUP + hitos de sprint dentro del hito de Construcción |
| **Cascada por módulo + Incremental por módulo** | Sistema con partes estables e inestables claramente separadas | SRS por módulo: sección estable completa antes de desarrollo; sección volátil con validación incremental | Hitos por fase para módulo estable; hitos por incremento para módulo volátil |
| **Scrum con documentación formal** (ágil regulado) | Proyecto ágil con contrato fijo o regulación externa | SRS v1.0 completo antes de iniciar + validación por épica post-aprobación activa | Hitos por sprint + hito adicional de aprobación SRS formal antes del primer sprint |

> **Aplicación en el sistema:** Cuando `metodologia: 'hibrido'`, el campo `tipoMetodologia` debe ser `'hibrido'`. El gestor **debe** especificar en `justificacionMetodologia` cuáles combinaciones se aplican y a qué partes del proyecto. La plantilla operativa (Sección 5) incluye un campo de descripción de la combinación específica.

---

## 5. Plantilla Operativa: Acuerdo de Metodología

Esta plantilla es el **formulario que el gestor completa en M2-01 PASO 2**. Es el entregable operativo central de este archivo. Los campos entre corchetes con prefijo `Proyecto.` son campos exactos del tipo `Proyecto`; los demás son campos del formulario de acuerdo que se almacenan como subdocumento del proyecto.

```
╔══════════════════════════════════════════════════════════════════════╗
║    ACUERDO DE METODOLOGÍA DE DESARROLLO — PROYECTO [Proyecto.id]    ║
╚══════════════════════════════════════════════════════════════════════╝

━━━ SECCIÓN A: IDENTIFICACIÓN DEL PROYECTO ━━━━━━━━━━━━━━━━━━━━━━━━━━

  ID del Proyecto:         [Proyecto.id]
  Nombre:                  [Proyecto.nombre]
  Entidad Cliente:         [Proyecto.entidadClienteId → Entidad.nombre]
  Fecha del Acuerdo:       [Date — completar al firmar]
  Gestor del Proyecto:     [MiembroEquipo con rol = 'pm' | 'gestor']

━━━ SECCIÓN B: INPUTS PARA LA DECISIÓN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Criticidad del sistema:              [Proyecto.criticidad]
                                        baja | media | alta | critica

  Tamaño estimado del equipo:          [Proyecto.tamanoEquipo] personas

  Equipo distribuido geográficamente:  [Proyecto.distribuidoGeograficamente]
                                        sí | no

  Regulación externa requerida:        [Proyecto.requiereRegulacionExterna]
                                        sí | no
    → Si sí, especificar regulador:    ___________________________

  Estabilidad de requerimientos:       [Proyecto.estabilidadRequerimientos]
                                        baja | media | alta

  Cliente disponible para iteraciones: [Proyecto.clienteDisponibleParaIteraciones]
                                        sí | no

  Tiene contrato de precio fijo:       [Proyecto.tieneContratoFijo]
                                        sí | no

  Vida útil estimada del sistema:      ___________________________
                                        corta (< 2 años) | media (2-5 años) | larga (> 5 años)
    → Nota: sistemas de larga vida requieren mayor documentación de diseño
      (Cap. 3 §3.2, p. 63 — pregunta 5).

━━━ SECCIÓN C: RECOMENDACIÓN DEL ÁRBOL DE DECISIÓN ━━━━━━━━━━━━━━━━━━

  Metodología recomendada por el árbol:
    [resultado del árbol de Sección 3.2 de este archivo]

  Condiciones verificadas (ruta del árbol):
    □ requiereRegulacionExterna = ___
    □ criticidad = ___
    □ estabilidadRequerimientos = ___
    □ tamanoEquipo = ___ (≤ 9 / > 9 / > 10)
    □ distribuidoGeograficamente = ___
    □ clienteDisponibleParaIteraciones = ___
    □ tieneContratoFijo = ___

  Alertas activas (validaciones de Sección 3.3):
    □ [lista de validaciones bloqueantes que aplican, o "Ninguna"]

━━━ SECCIÓN D: METODOLOGÍA ACORDADA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Metodología seleccionada:   [Proyecto.metodologia]
    cascada | incremental | rup | agil_scrum | agil_xp | hibrido

  Tipo de metodología:        [Proyecto.tipoMetodologia]
    plan | agil | hibrido

  Justificación (≥ 50 palabras, obligatoria):
    [Proyecto.justificacionMetodologia]
    _______________________________________________________________
    _______________________________________________________________
    _______________________________________________________________

  ¿Sobrescribe la recomendación del árbol?:   sí | no

  Motivo de sobrescritura (obligatorio si respuesta anterior es "sí"):
    _______________________________________________________________
    _______________________________________________________________

  Si metodología es 'hibrido' — descripción de la combinación:
    _______________________________________________________________
    (ej.: "RUP para fases de Inicio y Elaboración; Scrum para Construcción")

━━━ SECCIÓN E: ACUERDO CON EL CLIENTE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  El cliente ([nombre stakeholder] de [Entidad.nombre])
  ha sido informado y acepta explícitamente:

  [ ] El tipo de entregas que recibirá:
      _______________________________________________________________
      (Describir: única al final / por fase / por incremento / por sprint)

  [ ] La frecuencia de revisiones requerida de su parte:
      _______________________________________________________________
      (Describir: en hitos de fase / por incremento / por sprint / diaria)

  [ ] La forma en que se gestionarán los cambios de requerimientos:
      _______________________________________________________________
      (Describir: proceso CCB formal / gestión de cambios ágil por sprint /
       congelamiento de reqs. post-aprobación SRS v1.0)

  [ ] La documentación que recibirá al finalizar el proyecto:
      _______________________________________________________________
      (Listar artefactos comprometidos: SRS completo / HU + tests /
       manuales de usuario / documentación arquitectónica / etc.)

  Confirmación del cliente:
    Nombre:   ___________________   Fecha: ___________
    Firma / Sello digital:   ___________________

  Confirmación del gestor:
    Nombre:   ___________________   Fecha: ___________

━━━ SECCIÓN F: IMPLICACIONES AUTOMÁTICAS EN EL SISTEMA ━━━━━━━━━━━━━━
  [Esta sección la completa el sistema automáticamente al guardar
   la metodología, basándose en la Sección 4 de este archivo]

  SRS (Módulo 3):
    Tipo de SRS habilitado:            completo | incremental | por-épica | mínimo (HU)
    ¿Validación incremental activa?:   sí | no
    ¿SRS completo antes de desarrollo?: sí | no

  Estimación (M2-02):
    Método de estimación recomendado:  COCOMO II | Story Points | Análogo / PF
    ¿Presupuesto total obligatorio?:   sí | no

  Equipo (M2-05):
    Tamaño máximo del equipo:          sin límite | ≤ 9 | ≤ 6
    Roles obligatorios:                [lista según metodología]

  Repositorio / Entregas (M2-06):
    Política de entregas:              única final | por fase técnica | por fase RUP | por incremento | por sprint
    ¿CI/CD obligatorio?:               sí | no

  Hitos (M2-01 PASO 5):
    Estructura de hitos requerida:     por fase técnica | 4 fases RUP | por incremento | por sprint
    Hito crítico para activar
    'activo_en_desarrollo':            [nombre del hito según metodología]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 6. KPIs de Coherencia Metodológica

El sistema calcula estas métricas para detectar proyectos donde la metodología acordada no está siendo respetada en la práctica. Los KPIs se calculan en M2-04 (Seguimiento y Control) y se alimentan con datos de M2-06 (Entregas) y M3 (SRS).

| KPI | Definición | Fórmula / Criterio | Meta | Alerta |
|---|---|---|---|---|
| **Coherencia de entregas** | ¿Las entregas reales siguen la frecuencia acordada? | Para `cascada`: 0 entregas hasta el hito final. Para `agil_scrum` / `agil_xp`: ≥ 1 entrega por sprint completado | Coherente con la metodología registrada | Cascada con múltiples entregas parciales de funcionalidades; ágil sin entregas en 2 o más sprints consecutivos |
| **Participación del cliente** | % de revisiones donde asistió el stakeholder clave de M1 | `(revisiones_con_cliente / total_revisiones) × 100` | Cascada / RUP: 100% en hitos de fase. Ágil: 100% por sprint / iteración | < 75% en cualquier metodología |
| **Cambios post-aprobación en cascada** | N.º de solicitudes de cambio que modifican RF del SRS v1.0 tras su aprobación | `count(SCR donde RF_afectados ≠ null AND fecha > fecha_aprobacion_SRS_v1.0)` | 0 (en cascada ideal) | > 3 SCR post-aprobación en metodología `cascada` |
| **Velocidad del equipo (ágil)** | Story Points completados por sprint | `sum(SP_completados) / total_sprints` | Estable con variación ± 20% respecto a velocidad media | Caída > 30% en sprint consecutivo; o velocidad = 0 en cualquier sprint |
| **Completitud del acuerdo** | % de campos de la Sección 5 (Plantilla Operativa) completados | `(campos_completados / total_campos_obligatorios) × 100` | 100% antes de avanzar al PASO 3 de M2-01 | < 100%: el sistema bloquea el avance al PASO 3 hasta que el formulario esté completo |

---

## 7. Tabla de Impacto por Metodología en M1 / M2 / M3

Esta tabla resume la Sección 4. Es de lectura rápida para el gestor que necesita verificar de un vistazo qué cambia en el sistema al elegir cada metodología.

| Aspecto del sistema | CASCADA | INCREMENTAL | RUP | ÁGIL/SCRUM | ÁGIL/XP |
|---|---|---|---|---|---|
| **SRS antes de desarrollo** | Completo obligatorio (v1.0 aprobado) | Por incremento (v1.0 de Inc-1) | Al finalizar Elaboración (v1.0 aprobado) | Por épica del MVP | Mínimo: HU + criterios de aceptación |
| **Validación incremental SRS** | No (`validacionIncremental = false`) | Por incremento (`true`) | No (gate en Elaboración) | Sí por épica (`true`) | Continua por iteración (`true`) |
| **Organización de `hitos[]` M2** | Por fase técnica (5 fases cascada) | Por incremento | 4 fases RUP (hitos formales) | Por sprint (2-4 sem.) | Por iteración XP (1-2 sem.) |
| **Estimación recomendada (M2-02)** | COCOMO II / Puntos de Función | Análoga / Puntos de Función | COCOMO II (por fase RUP) | Story Points / velocidad | Story Points / velocidad |
| **`presupuestoEstimado` obligatorio** | Sí (bloquea `pendiente_aprobacion`) | Sí (total estimado) | Sí (por fase RUP) | No (se estima por sprint) | No (se estima por iteración) |
| **Rol Scrum Master obligatorio** | No aplica | No aplica | No aplica | Sí (1 exactamente) | No aplica |
| **Disponibilidad del cliente** | Hitos clave (aprobación SRS + entrega final) | Por incremento (validación y liberación) | Hitos de fase RUP (4 reuniones) | Cada sprint (semanal / quincenal) | Diaria |
| **`Entidad.disponibilidadParaSprints` bloqueante** | No | No (recomendado) | No | **Sí** | **Sí** |
| **CI/CD** | Opcional | Recomendado | Recomendado | Obligatorio | **Obligatorio** |
| **Política de entregas M2-06** | Una final o por fase técnica | Por incremento funcional | Por fase RUP | Por sprint | Por iteración XP |
| **`Entidad.aceptaEntregasIncrementales`** | Debe ser `false` (alerta si `true`) | Debe ser `true` (alerta si `false`) | Recomendado `false` | Debe ser `true` | Debe ser `true` |

---

## 8. Checklist de Completitud del Archivo

| Ítem verificado | Fuente | ✅ |
|---|---|---|
| Objetivo claro: acuerdo formal ≠ teoría de metodologías | Sistema | ✅ |
| Inputs requeridos para la decisión con campos exactos del tipo `Proyecto` | Sistema + Cap. 3 §3.2 | ✅ |
| Árbol de decisión con nombres de campos exactos del tipo `Proyecto` | Cap. 3 §3.2, pp. 63-64 | ✅ |
| Tabla de validaciones bloqueantes con mensajes de error del sistema | Cap. 3 §3.5 + sistema | ✅ |
| Implicaciones cascada: M1, M2 (hitos, equipo, presupuesto), M3 con campos específicos | Cap. 2 §2.1.1 | ✅ |
| Implicaciones incremental: M1, M2 (hitos por incremento, equipo estable), M3 con campos | Cap. 2 §2.1.2, §2.3.2 | ✅ |
| Implicaciones RUP: 4 hitos con criterios de avance, roles mapeados, M1/M2/M3 | Cap. 2 §2.4 | ✅ |
| Implicaciones Scrum: M1 (bloqueante), M2 (roles obligatorios), M3 (por épica) | Cap. 3 §3.4 | ✅ |
| Implicaciones XP: M1, M2 (CI obligatorio, pair programming), M3 (HU mínimo) | Cap. 3 §3.3 | ✅ |
| Modelo híbrido con 3 combinaciones, contextos y impact en SRS y hitos | Cap. 3 §3.2 + Cap. 2 §2.1 | ✅ |
| Plantilla operativa completa con todos los campos (A-F) | Sistema | ✅ |
| Sección F de implicaciones automáticas del sistema en la plantilla | Sistema | ✅ |
| KPIs de coherencia metodológica con fórmulas y umbrales de alerta | Sistema + M2-04 | ✅ |
| Tabla maestra de impacto por metodología en M1/M2/M3 (Sección 7) | Sistema | ✅ |
| Referencias cruzadas explícitas a `01`, `02`, `M2-01`, `M2-02`, `M2-04`, `M2-05`, `M2-06`, `M3-01` | Sistema | ✅ |
| Sin duplicación de teoría ya cubierta en archivos de fundamentos | — | ✅ |
| Árbol usa nombres de campos exactos del tipo `Proyecto` (no abstracciones genéricas) | Sistema | ✅ |
| Distinción entre acuerdo con cliente y decisión técnica documentada en objetivo | Sistema | ✅ |
