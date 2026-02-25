**Nombre del archivo:** `M1-01-identificacion-stakeholders.md`  
**Módulo:** Módulo 1 — Registro de Clientes y Proveedores (Entidades)  
**Capítulos fuente:** Cap. 4 §4.1, §4.4, §4.5, §4.5.1–§4.5.5, §4.7 · Cap. 10 §10.1–§10.3  
**Fuente bibliográfica:** Sommerville, Ian. *Ingeniería de Software*, 9ª Edición. Pearson Educación, 2011.  
**Versión:** 1.0.0  
**Fecha:** 2026-02-24  
**Estado:** ✅ Aprobado para implementación  
**Aplica a:** Módulo 1 (formulario de alta de entidad) · Módulo 2 (configuración de proyecto)

---

## 1. Objetivo del Documento

Este archivo establece el **marco teórico completo** para identificar, clasificar y gestionar
los *participantes* (stakeholders) de los proyectos registrados en el sistema, con respaldo
directo en Sommerville (2011).

Cubre específicamente:

- La justificación de **cada campo** del tipo `Stakeholder` definido en `src/types/index.ts`
- Los **criterios de clasificación** de roles y niveles de influencia/interés
- El **proceso de descubrimiento** que guía el flujo del formulario de alta en el Módulo 1
- La **lógica de conflictos** que fundamenta las alertas del sistema en el Módulo 2

> **Este documento es la base teórica del formulario de registro de stakeholders del
> Módulo 1.** Toda decisión de diseño sobre los campos, validaciones y flujos de ese
> formulario debe referenciarse aquí.

---

## 2. Definición de Stakeholder

### 2.1 Definición formal

**(Cap. 4 §4.1, p. 87)**

Sommerville define formalmente al participante como:

> *«Un participante es un individuo o una función que se ve afectado de alguna forma
> por el sistema.»*

Y amplía esta definición en §4.5 (p. 101):

> *«Un participante en el sistema es quien debe tener alguna influencia directa o indirecta
> sobre los requerimientos del mismo. Los participantes incluyen a usuarios finales que
> interactuarán con el sistema, y a cualquiera en una organización que resulte afectado
> por él.»*

### 2.2 El problema central: necesidades inconsistentes

**(Cap. 4 §4.1, p. 87)**

Sommerville advierte directamente sobre el riesgo de ignorar la pluralidad de participantes:

> *«Los participantes tienen diferentes necesidades, pero con frecuencia son inconsistentes.
> Tales inconsistencias tal vez no sean evidentes cuando se especifican por primera vez los
> requerimientos, de modo que en la especificación se incluyen requerimientos inconsistentes.
> Los problemas suelen surgir sólo después de un análisis en profundidad o después de que
> se entregó el sistema al cliente.»*

### 2.3 Participantes directos, indirectos y externos

**(Cap. 4 §4.5, p. 101 · §4.5.1, p. 103)**

Sommerville distingue implícitamente tres categorías por nivel de relación con el sistema:

| Tipo           | Descripción según Sommerville                                                                                                         |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------|
| **Directo**    | Usuarios finales que interactuarán con el sistema                                                                                     |
| **Indirecto**  | Cualquiera en la organización afectado por él; también *«ingenieros que desarrollan o mantienen otros sistemas relacionados, administradores de negocios, expertos de dominio y representantes de asociaciones sindicales»* |
| **Externo**    | *«Participantes externos como los reguladores, quienes certifican la aceptabilidad del sistema»* (§4.5.1, p. 103)                    |

**Aplicación en el sistema:** Esta definición justifica por qué el Módulo 1 almacena
**múltiples stakeholders por entidad**, cada uno con su propio perfil. Un mismo proyecto
puede tener participantes directos (quienes usarán el software) e indirectos (financiadores,
reguladores, afectados organizacionales), y cada uno requiere un registro independiente
con campos `nivelInfluencia` y `nivelInteres` propios, porque sus necesidades son
frecuentemente inconsistentes entre sí.

---

## 3. Tipos de Stakeholders

### 3.1 Clasificación según Sommerville

**(Cap. 4 §4.5.1, p. 103)**

Sommerville presenta el siguiente ejemplo de participantes para un sistema real (MHC-PMS),
que ilustra la taxonomía completa aplicable a cualquier proyecto:

> *«Los participantes que se incluyen para el sistema de información de pacientes en
> atención a la salud mental son:*
> 1. *Pacientes cuya información se registra en el sistema.*
> 2. *Médicos que son responsables de valorar y tratar a los pacientes.*
> 3. *Enfermeros que coordinan, junto con los médicos, las consultas.*
> 4. *Recepcionistas que administran las citas médicas.*
> 5. *Personal de TI que es responsable de instalar y mantener el sistema.*
> 6. *Un director de ética médica que debe garantizar que el sistema cumpla con los
>    lineamientos éticos actuales de la atención al paciente.*
> 7. *Encargados de atención a la salud que obtienen información administrativa del
>    sistema.*
> 8. *Personal de archivo médico que es responsable de garantizar que la información
>    del sistema se conserve.»*

Complementa con tipos adicionales en §4.5 (p. 101):

> *«Otros participantes del sistema pueden ser los ingenieros que desarrollan o mantienen
> otros sistemas relacionados, administradores de negocios, expertos de dominio y
> representantes de asociaciones sindicales.»*

Y en §4.5.1 (p. 103):

> *«Los participantes varían desde administradores y usuarios finales de un sistema hasta
> participantes externos como los reguladores, quienes certifican la aceptabilidad del
> sistema.»*

### 3.2 Tabla de mapeo: tipos Sommerville → campo `rol` del sistema

> Esta tabla es la referencia canónica para poblar el selector de `rol` en el formulario
> del Módulo 1. Cubre **todos los valores posibles** del campo.

| Tipo Sommerville                   | Descripción                                                                                  | Valor en campo `rol`     | Nivel influencia típico |
|------------------------------------|----------------------------------------------------------------------------------------------|--------------------------|-------------------------|
| Usuario final del sistema          | Interactúa directamente con el sistema en operación                                          | `usuario_final`          | bajo–medio              |
| Administrador / gerente del sistema| Responsable de la operación y uso del sistema en la organización                             | `gerente_sistema`        | medio–alto              |
| Propietario / decisor de compra    | Quien autoriza y financia el proyecto; impone restricciones presupuestales                   | `propietario`            | alto                    |
| Ingeniero / responsable técnico    | Responsable técnico del lado del cliente; integra con otros sistemas                         | `responsable_tecnico`    | medio                   |
| Experto de dominio                 | Conoce el dominio de aplicación; fuente principal de requerimientos de dominio               | `experto_dominio`        | medio                   |
| Regulador externo                  | Certifica aceptabilidad del sistema; impone restricciones legales y normativas               | `regulador_externo`      | alto                    |
| Administrador de negocios          | Gestiona procesos empresariales afectados por el sistema                                     | `administrador_negocio`  | medio–alto              |
| Personal de TI / mantenimiento     | Instala, mantiene y opera la infraestructura técnica                                         | `ti_mantenimiento`       | bajo–medio              |

> **Nota de implementación:** Se recomienda tipar el campo `rol` como unión de literales
> con estos valores en v2, reemplazando el actual `rol: string`.

**Aplicación en el sistema:** Esta tabla es la referencia para el dropdown de `rol` en el
Módulo 1. El sistema puede usar el valor seleccionado para **sugerir automáticamente** el
`nivelInfluencia` como valor por defecto al crear un nuevo stakeholder.

---

## 4. Proceso de Descubrimiento de Stakeholders

### 4.1 El proceso en espiral de IR

**(Cap. 4 §4.4, p. 99–100 — Fig. 4.12)**

Sommerville describe el proceso de ingeniería de requerimientos como iterativo y organizado
en espiral:

> *«Las actividades están organizadas como un proceso iterativo alrededor de una espiral,
> y la salida es un documento de requerimientos del sistema. La cantidad de tiempo y
> esfuerzo dedicados a cada actividad en cada iteración depende de la etapa del proceso
> global y el tipo de sistema que está siendo desarrollado.»*

### 4.2 Las 4 actividades del proceso de adquisición y análisis

**(Cap. 4 §4.5, p. 101–102 — Fig. 4.13)**

> *«Las actividades del proceso son:*
>
> 1. *Descubrimiento de requerimientos: Es el proceso de interactuar con los participantes
>    del sistema para descubrir sus requerimientos. También los requerimientos de dominio
>    de los participantes y la documentación se descubren durante esta actividad.*
>
> 2. *Clasificación y organización de requerimientos: Esta actividad toma la compilación
>    no estructurada de requerimientos, agrupa requerimientos relacionados y los organiza
>    en grupos coherentes.*
>
> 3. *Priorización y negociación de requerimientos: Inevitablemente, cuando intervienen
>    diversos participantes, los requerimientos entrarán en conflicto. Esta actividad se
>    preocupa por priorizar los requerimientos, así como por encontrar y resolver conflictos
>    de requerimientos mediante la negociación. Por lo general, los participantes tienen que
>    reunirse para resolver las diferencias y estar de acuerdo con el compromiso de los
>    requerimientos.*
>
> 4. *Especificación de requerimientos: Los requerimientos se documentan e ingresan en la
>    siguiente ronda de la espiral.»*

### 4.3 Las 4 actividades aplicadas a la gestión de stakeholders

| Actividad                               | Qué se hace                                                                             | Quién participa                    | Qué se produce                                          |
|-----------------------------------------|-----------------------------------------------------------------------------------------|------------------------------------|---------------------------------------------------------|
| **1. Descubrimiento**                   | Identificar todos los participantes del sistema y sus requerimientos                    | Analista + representante del cliente | Lista inicial de stakeholders                         |
| **2. Clasificación y organización**     | Agrupar stakeholders por tipo, rol y área funcional                                     | Analista                           | Stakeholders clasificados con `rol` y `cargo` asignados |
| **3. Priorización y negociación**       | Asignar niveles de influencia e interés; detectar conflictos entre posiciones           | Analista + stakeholders clave      | Matriz influencia/interés; identificación de conflictos |
| **4. Especificación (documentación)**   | Registrar formalmente cada stakeholder en el sistema                                    | Analista                           | Fichas de stakeholder completas en el Módulo 1          |

### 4.4 Identificación de stakeholders ocultos o pasivos

**(Cap. 4 §4.5, p. 102)**

Sommerville advierte sobre participantes que no se manifiestan espontáneamente:

> *«Inevitablemente cambia durante el proceso de análisis. Puede cambiar la importancia de
> requerimientos particulares o bien, tal vez surjan nuevos requerimientos de nuevos
> participantes a quienes no se consultó originalmente.»*

Y sobre el riesgo político de ignorarlos:

> *«Es imposible complacer por completo a cada participante, pero, si algunos suponen que
> sus visiones no se consideraron de forma adecuada, quizás intenten deliberadamente
> socavar el proceso de IR.»*

El factor político añade una capa adicional:

> *«Factores políticos llegan a influir en los requerimientos de un sistema. Los
> administradores pueden solicitar requerimientos específicos del sistema, porque éstos
> les permitirán aumentar su influencia en la organización.»*

### 4.5 Técnicas de descubrimiento

**(Cap. 4 §4.5.1–§4.5.5, p. 103–109)**

| Técnica            | Descripción según Sommerville                                                                                     | Útil para identificar                         |
|--------------------|------------------------------------------------------------------------------------------------------------------|-----------------------------------------------|
| **Entrevistas**    | Formales o informales; permiten comprender qué hacen los participantes y cómo interactuarán con el nuevo sistema | Stakeholders directos con rol definido        |
| **Escenarios**     | Ejemplos de sesiones de interacción; revelan usuarios finales que no se conocían                                 | Usuarios finales y casos de uso no anticipados|
| **Puntos de vista**| Cada grupo de participantes es un punto de vista; identificar todos los puntos de vista = todos los stakeholders | Stakeholders de distintas áreas funcionales   |
| **Etnografía**     | Observación en el entorno de trabajo; revela stakeholders ocultos por procesos informales de la organización     | Stakeholders pasivos y requerimientos tácitos |

**Aplicación en el sistema:** Este proceso de 4 actividades define el **flujo de trabajo
del formulario de alta de nueva entidad en el Módulo 1**. El formulario debe estructurarse
en pasos que sigan este espiral:

1. **Paso 1 — Datos de la entidad:** nombre, tipo (cliente/proveedor), sector
2. **Paso 2 — Descubrimiento:** lista inicial de stakeholders con `nombre` y `cargo`
3. **Paso 3 — Clasificación:** asignación de `rol`, `nivelInfluencia`, `nivelInteres`
4. **Paso 4 — Documentación:** completar `email`, `telefono`, `canalComunicacion`

El sistema no debe permitir guardar la entidad sin al menos un stakeholder con
`nivelInfluencia: 'alto'` registrado.

---

## 5. Conflictos entre Stakeholders

### 5.1 Por qué los conflictos son inevitables

**(Cap. 4 §4.5, p. 102)**

> *«Resulta ineludible que diferentes participantes tengan diversas visiones de la
> importancia y prioridad de los requerimientos y, algunas veces, dichas visiones están
> en conflicto.»*

> *«Es imposible complacer por completo a cada participante, pero, si algunos suponen
> que sus visiones no se consideraron de forma adecuada, quizás intenten deliberadamente
> socavar el proceso de IR.»*

La raíz estructural del conflicto está en la propia naturaleza del sistema (§4.5, p. 101):

> *«Los participantes con frecuencia no saben lo que quieren de un sistema de cómputo,
> excepto en términos muy generales; pueden encontrar difícil articular qué quieren que
> haga el sistema; pueden hacer peticiones inalcanzables porque no saben qué es factible
> y qué no lo es.»*

### 5.2 Tipos de conflictos más comunes

A partir de §4.5 (p. 101–102):

| Tipo de conflicto              | Descripción                                                                                          |
|-------------------------------|------------------------------------------------------------------------------------------------------|
| **Intereses opuestos**        | Un stakeholder maximiza calidad; otro minimiza costo/tiempo                                          |
| **Inconsistencias funcionales** | Dos stakeholders especifican comportamientos contradictorios para el mismo módulo o proceso        |
| **Diferencias de prioridad**  | Un stakeholder prioriza una función que otro considera secundaria o innecesaria                      |
| **Conflicto político**        | Un administrador pide funciones que aumentan su poder organizacional, en detrimento de usuarios finales |
| **Requerimientos ocultos**    | Un stakeholder no revela sus requerimientos reales por razones de poder o confidencialidad interna   |

### 5.3 Proceso de negociación y resolución

**(Cap. 4 §4.5 — actividad 3 del espiral, p. 101)**

> *«Por lo general, los participantes tienen que reunirse para resolver las diferencias y
> estar de acuerdo con el compromiso de los requerimientos.»*

Pasos derivados del proceso de Sommerville:

1. **Identificar** los requerimientos en conflicto y los stakeholders involucrados (con sus `nivelInfluencia`)
2. **Priorizar** usando la matriz influencia/interés (Sección 6): el stakeholder del cuadrante 🔴 tiene precedencia
3. **Negociar** con los participantes presentes para alcanzar un compromiso documentado
4. **Documentar** el compromiso alcanzado; este registro alimenta el Módulo 3 (SRS)

### 5.4 Rol del ingeniero como mediador

**(Cap. 4 §4.5, p. 102)**

> *«Durante el proceso, usted deberá organizar negociaciones regulares con los
> participantes, de forma que se alcancen compromisos.»*

**Aplicación en el sistema:** Los campos `nivelInfluencia` y `nivelInteres` son la
implementación directa de esta sección. Cuando dos stakeholders de una misma entidad
tienen `nivelInfluencia: 'alto'` simultáneamente, el sistema **debe alertar al analista**
durante el Módulo 2 (configuración de proyecto) sobre el riesgo de conflicto. Esta alerta
es especialmente crítica cuando sus valores de `rol` implican intereses estructuralmente
opuestos (p. ej., `propietario` vs. `usuario_final`, o `propietario` vs. `regulador_externo`).

---

## 6. Matriz de Influencia / Interés

### 6.1 Fundamento en Sommerville

**(Cap. 4 §4.5, p. 101–102 — implícito en clasificación de participantes)**

> **Nota explícita:** Sommerville **no presenta** la Matriz Influencia/Interés como figura
> con ese nombre. Sin embargo, los niveles que describe para clasificar participantes la
> fundamentan directamente. El texto establece que los participantes tienen distintos niveles
> de influencia (directa o indirecta) e interés en el sistema, y que la actividad 3 del
> espiral (priorización y negociación) requiere gestionar estas diferencias sistemáticamente.

> *«Un participante en el sistema es quien debe tener alguna influencia directa o indirecta
> sobre los requerimientos del mismo.»* (§4.5, p. 101)

La matriz se construye aquí aplicando los principios de priorización de Sommerville y es
consistente con la práctica estándar de gestión de participantes derivada de su marco teórico.

### 6.2 Matriz Influencia / Interés

|                        | **Interés Bajo**                          | **Interés Alto**                          |
|------------------------|-------------------------------------------|-------------------------------------------|
| **Influencia Alta**    | 🟡 **Mantener satisfecho**                | 🔴 **Gestionar de cerca**                 |
| **Influencia Baja**    | ⚫ **Monitorear**                          | 🔵 **Mantener informado**                 |

### 6.3 Descripción operativa de cada cuadrante

#### 🔴 Influencia Alta + Interés Alto — *Gestionar de cerca*

- **Tipo de stakeholder:** Decisor de compra, propietario del sistema, gerente con autoridad directa sobre el proyecto
- **Riesgo si se ignora:** Puede cancelar el proyecto o imponer cambios radicales en cualquier momento
- **Frecuencia de comunicación:** Semanal o según hitos del proyecto
- **Canal apropiado:** Reuniones presenciales o videollamadas, reportes ejecutivos, demos de avances
- **Involucramiento en requerimientos:** Validación de requerimientos de alto nivel; aprobación formal de alcance

#### 🟡 Influencia Alta + Interés Bajo — *Mantener satisfecho*

- **Tipo de stakeholder:** Regulador externo, directivo senior no involucrado operativamente
- **Riesgo si se ignora:** Puede bloquear el proyecto por incumplimiento normativo o político sin previo aviso
- **Frecuencia de comunicación:** Mensual o en hitos clave de entrega
- **Canal apropiado:** Informes formales, notificaciones de cumplimiento, documentación legal
- **Involucramiento en requerimientos:** Revisión de requerimientos regulatorios; no participa en detalles funcionales

#### 🔵 Influencia Baja + Interés Alto — *Mantener informado*

- **Tipo de stakeholder:** Usuarios finales del sistema, personal operativo
- **Riesgo si se ignora:** Resistencia en la adopción; requerimientos funcionales mal capturados; sistema rechazado
- **Frecuencia de comunicación:** Quincenal durante desarrollo; mensual en operación
- **Canal apropiado:** Newsletters de avance, demos interactivas, sesiones de feedback, formularios de validación
- **Involucramiento en requerimientos:** Principal fuente de requerimientos funcionales y de usabilidad

#### ⚫ Influencia Baja + Interés Bajo — *Monitorear*

- **Tipo de stakeholder:** Personal administrativo periférico, stakeholders de sistemas adyacentes
- **Riesgo si se ignora:** Mínimo en el corto plazo; puede migrar a otro cuadrante ante cambios organizacionales
- **Frecuencia de comunicación:** Trimestral o bajo demanda
- **Canal apropiado:** Comunicados generales, documentación accesible en portal
- **Involucramiento en requerimientos:** Revisión puntual; no participan activamente en elicitación

**Aplicación en el sistema:** Esta matriz es la **lógica de negocio detrás de los campos
`nivelInfluencia` + `nivelInteres`**. El sistema puede usar la combinación de ambos valores
para:

1. Sugerir automáticamente el valor de `canalComunicacion` al crear un stakeholder
2. Generar una vista de mapa de participantes en el Módulo 2 (cuadrante visual por proyecto)
3. Alertar cuando el cuadrante crítico (🔴) no tiene stakeholder registrado para una entidad

---

## 7. Sistemas Sociotécnicos y Contexto Organizacional

### 7.1 Definición de sistema sociotécnico

**(Cap. 10 §10.1, p. 267)**

> *«Los sistemas sociotécnicos incluyen uno o más sistemas técnicos, pero también
> incluyen individuos que entienden el propósito del sistema dentro del sistema en sí.
> Los sistemas sociotécnicos tienen procesos operacionales definidos y las personas
> (los operadores) son partes inherentes del sistema. Están administrados por políticas
> y reglas organizacionales, y podrían verse afectados por restricciones externas como
> leyes nacionales y políticas reguladoras.»*

Y sobre los sistemas sociotécnicos como sistemas empresariales:

> *«Los sistemas sociotécnicos son sistemas empresariales que intentan auxiliar para
> alcanzar una meta de negocio [...] Puesto que están incrustados en un entorno
> organizacional, la procuración, el desarrollo y el uso de dichos sistemas tienen
> influencia de las políticas y los procedimientos de la organización, así como de su
> cultura laboral.»*

### 7.2 Las capas del sistema sociotécnico relevantes para stakeholders

**(Cap. 10 §10.1, p. 264–265 — Fig. 10.1)**

Sommerville describe 7 capas. Las directamente relevantes para identificar stakeholders:

| Capa (nº)                           | Descripción Sommerville                                                                          | Stakeholders que genera                         |
|-------------------------------------|--------------------------------------------------------------------------------------------------|-------------------------------------------------|
| **4. Aplicaciones**                 | *«Entrega la funcionalidad específica de la aplicación que se requiere»*                          | Usuarios finales, Personal TI                   |
| **5. Proceso empresarial**          | *«En este nivel se definen y establecen los procesos empresariales de la organización»*           | Administradores, Gerentes del sistema           |
| **6. Organización**                 | *«Incluye procesos estratégicos de alto nivel, así como reglas, políticas y normas de la empresa»* | Propietarios, Decisores de compra             |
| **7. Social**                       | *«En ella se definen las leyes y regulaciones de la sociedad que rigen la operación del sistema»* | Reguladores externos, Auditores               |

El contexto organizacional también genera riesgos específicos (§10.1, p. 268):

> *«Los factores organizacionales del entorno del sistema que pueden afectar los
> requerimientos, el diseño y la operación de un sistema sociotécnico incluyen:*
> 1. *Cambios de procesos: el sistema puede requerir cambios en los procesos de trabajo
>    del entorno.*
> 2. *Cambios laborales: los nuevos sistemas pueden reemplazar las habilidades de los
>    usuarios en un entorno, o bien, hacer que cambien la forma como trabajan.*
> 3. *Cambios en la organización: el sistema podría cambiar la estructura política de
>    poder en una organización.»*

### 7.3 Procuración del sistema como fuente de stakeholders formales

**(Cap. 10 §10.2–§10.3, p. 273–277)**

> *«La procuración del sistema cubre todas las actividades que intervienen en decidir
> qué sistema comprar y quién debe suministrar dicho sistema. Los requerimientos de
> alto nivel se desarrollan como parte del proceso de procuración.»*

Roles identificados durante la etapa de procuración que **siempre son stakeholders formales**:

| Rol en procuración                  | Descripción Sommerville                                                                     | `rol` en el sistema       |
|-------------------------------------|---------------------------------------------------------------------------------------------|---------------------------|
| Decisor de compra/contratación      | Decide qué sistema adquirir; establece requerimientos de alto nivel                         | `propietario`             |
| Evaluador técnico                   | Evalúa viabilidad técnica; distribuye funcionalidad entre hardware, software y personal      | `responsable_tecnico`     |
| Usuario final designado             | Será operador del sistema en producción; fuente de requerimientos funcionales               | `usuario_final`           |
| Responsable del presupuesto         | Impone restricciones presupuestales que condicionan el alcance                              | `administrador_negocio`   |

**Aplicación en el sistema:** Cuando se registra una nueva entidad (cliente) en el Módulo 1,
el sistema debe **sugerir los stakeholders mínimos requeridos** según el tipo de relación:

- **Cliente de nuevo desarrollo:** Requerir al menos `propietario`, `responsable_tecnico`, `usuario_final`
- **Cliente de mantenimiento:** Requerir al menos `gerente_sistema`, `ti_mantenimiento`
- **Cliente con componente regulatorio:** Agregar `regulador_externo` como requerido

---

## 8. Plantilla Operativa: Ficha de Stakeholder

> ⭐ **Sección de mayor prioridad operativa.** Lista para uso directo en el sistema sin
> modificación.

### 8.1 Mapeo de campos actuales del tipo `Stakeholder`

```typescript
// src/types/index.ts — tipo actual del sistema
interface Stakeholder {
  id: string
  nombre: string
  cargo: string
  email: string
  telefono?: string
  rol: string
  nivelInfluencia: 'alto' | 'medio' | 'bajo'
  nivelInteres: 'alto' | 'medio' | 'bajo'
  canalComunicacion?: string
}
```

| Campo del sistema | Tipo TS | Obligatorio | Justificación Sommerville |
| :-- | :-- | :-- | :-- |
| `id` | `string` | Sí (auto) | Identificación exclusiva del participante; necesaria para trazabilidad entre participante y requerimientos (§4.7, p. 113) |
| `nombre` | `string` | Sí | Identificación única del participante; requerida para entrevistas y consultas (Cap. 4 §4.4) |
| `cargo` | `string` | Sí | Determina nivel de autoridad organizacional y rol en la toma de decisiones (Cap. 4 §4.5.1) |
| `email` | `string` | Sí | Canal de comunicación formal primario para todas las categorías de participantes (Cap. 4 §4.5) |
| `telefono` | `string` | No | Canal alternativo para comunicación directa en negociaciones de alta urgencia |
| `rol` | `string` (enum recomendado) | Sí | Clasificación según tipos de participantes de Sommerville (Cap. 4 §4.5.1, p. 103); determina responsabilidad en IR |
| `nivelInfluencia` | `'alto' \| 'medio' \| 'bajo'` | Sí | Eje vertical de la Matriz Influencia/Interés; indica poder sobre los requerimientos del sistema (Cap. 4 §4.5) |
| `nivelInteres` | `'alto' \| 'medio' \| 'bajo'` | Sí | Eje horizontal de la Matriz Influencia/Interés; indica motivación para involucrarse en el proceso (Cap. 4 §4.5) |
| `canalComunicacion` | `string` | No | Frecuencia y medio de comunicación según cuadrante de la matriz; se sugiere automáticamente (Cap. 4 §4.5.1) |

### 8.2 Campos propuestos para v2 (justificados en Sommerville)

| Campo propuesto | Tipo TS propuesto | Justificación Sommerville | Versión |
| :-- | :-- | :-- | :-- |
| `tipo` | `'directo' \| 'indirecto' \| 'externo'` | Distinción directa/indirecta/externa de participantes (Cap. 4 §4.5, p. 101) | **v2** |
| `organizacion` | `string` | Contexto organizacional determina quiénes son los stakeholders reales (Cap. 10 §10.1) | **v2** |
| `frecuenciaComunicacion` | `'semanal' \| 'quincenal' \| 'mensual' \| 'trimestral'` | Frecuencia recomendada según cuadrante de la matriz (Cap. 4 §4.5) | **v2** |
| `requerimientosAsociados` | `string[]` | Trazabilidad entre participante y sus requerimientos específicos (Cap. 4 §4.7, p. 113) | **v2** |
| `notas` | `string` | Documentar requerimientos tácitos y conocimiento implícito del dominio (Cap. 4 §4.5.2) | **v2** |
| `fechaUltimoContacto` | `Date` | Gestión activa del canal de comunicación según nivel de influencia (Cap. 4 §4.5) | **v2** |


---

## 9. Checklist Operativo: ¿Están todos los stakeholders?

> ⭐ **Sección de mayor prioridad operativa.** Lista de verificación para uso directo por
> el analista al registrar una entidad. Basada en Sommerville Cap. 4 §4.4–§4.5.1 y
> Cap. 10 §10.3.

### Al registrar cualquier entidad (cliente o proveedor):

- [ ] ¿Está identificado el **decisor de compra/contratación**?
(`rol: 'propietario'`, `nivelInfluencia: 'alto'`)
- [ ] ¿Están identificados los **usuarios finales** del sistema que se desarrollará?
(`rol: 'usuario_final'`)
- [ ] ¿Está identificado el **responsable técnico** del lado del cliente?
(`rol: 'responsable_tecnico'`)
- [ ] ¿Está identificado el **responsable financiero/presupuesto**?
(`rol: 'administrador_negocio'`)
- [ ] ¿Existen **stakeholders regulatorios externos**?
(Si el proyecto requiere certificaciones, auditorías o cumplimiento legal →
`rol: 'regulador_externo'`)
- [ ] ¿Hay stakeholders con **`nivelInfluencia: 'alto'` y `nivelInteres: 'bajo'`**
(cuadrante 🟡 *Mantener satisfecho*) que podrían bloquear el proyecto
silenciosamente sin manifestarse activamente?
- [ ] ¿Se documentó el **`canalComunicacion`** para cada stakeholder con
`nivelInfluencia: 'alto'`?
- [ ] ¿Existen **stakeholders ocultos o pasivos** que no participaron en la reunión
inicial pero que serán afectados por el sistema?
(Revisar organigramas, sistemas adyacentes, áreas con cambios de proceso)
- [ ] ¿Se verificó que no existan **dos stakeholders con `nivelInfluencia: 'alto'`**
cuyos `rol` impliquen intereses estructuralmente opuestos, sin un proceso de
negociación documentado?
- [ ] Para entidades cliente de **nuevo desarrollo**: ¿están presentes como mínimo
`propietario`, `responsable_tecnico` y `usuario_final`?
- [ ] Para entidades cliente de **mantenimiento**: ¿están presentes como mínimo
`gerente_sistema` y `ti_mantenimiento`?


### Al iniciar un proyecto en el Módulo 2:

- [ ] ¿Se revisó si cambiaron los stakeholders de la entidad desde el último proyecto?
- [ ] ¿Se actualizó el `nivelInfluencia` o `nivelInteres` de algún stakeholder por
cambios organizacionales del cliente?
- [ ] ¿Surgen nuevos stakeholders específicos del alcance de este proyecto que no
aplican a la entidad en general?

---

## 10. Tabla de Conexiones con los 3 Módulos

| Concepto Sommerville | Módulo | Campo o proceso específico |
| :-- | :-- | :-- |
| Definición de participante (§4.1, p. 87) | Módulo 1 | Existencia del tipo `Stakeholder` en el modelo de datos |
| Participantes directos e indirectos (§4.5, p. 101) | Módulo 1 | Campo `rol`; sugerencia de stakeholders mínimos por tipo de entidad |
| Tipos de participantes (§4.5.1, p. 103) | Módulo 1 | Opciones del selector `rol` en el formulario de alta |
| Proceso espiral — Descubrimiento (§4.5, p. 101) | Módulo 1 | Paso 1 del formulario: lista inicial de stakeholders con `nombre` y `cargo` |
| Proceso espiral — Clasificación (§4.5, p. 101) | Módulo 1 | Paso 2 del formulario: asignación de `rol`, `nivelInfluencia`, `nivelInteres` |
| Proceso espiral — Priorización (§4.5, p. 101) | Módulo 2 | Vista de matriz influencia/interés por proyecto |
| Proceso espiral — Especificación (§4.5, p. 102) | Módulo 1 | Guardado y persistencia de ficha completa de stakeholder |
| Conflictos entre participantes (§4.5, p. 102) | Módulo 2 | Alerta: dos stakeholders con `nivelInfluencia: 'alto'` en una misma entidad |
| Negociación y compromisos (§4.5, p. 101) | Módulo 2 | Log de decisiones de alcance en configuración de proyecto |
| Matriz influencia/interés (§4.5 — derivada) | Módulo 1 | Lógica de sugerencia automática de `canalComunicacion` |
| Matriz influencia/interés (§4.5 — derivada) | Módulo 2 | Vista de cuadrantes por proyecto; alerta de cuadrante 🔴 vacío |
| Canal de comunicación (§4.5.1, p. 103) | Módulo 1 | Campo `canalComunicacion`; obligatorio si `nivelInfluencia: 'alto'` |
| Sistemas sociotécnicos — capas (Cap. 10 §10.1, p. 264) | Módulo 1 | Sugerencia de stakeholders según capa organizacional del cliente |
| Procuración del sistema (Cap. 10 §10.3, p. 273) | Módulo 1 | Stakeholders mínimos requeridos según tipo (nuevo desarrollo vs. mantenimiento) |
| Trazabilidad participante → requerimientos (§4.7, p. 113) | Módulo 3 | Vínculo entre `Stakeholder.id` y sección del SRS que generó |


---

## 11. Checklist de Completitud del Documento

| Ítem extraído de Sommerville | Estado |
| :-- | :-- |
| Definición formal de participante (Cap. 4 §4.1, p. 87) | ✅ Incluido |
| Definición ampliada de participante (Cap. 4 §4.5, p. 101) | ✅ Incluido |
| Problema de inconsistencias entre participantes (Cap. 4 §4.1, p. 87) | ✅ Incluido |
| Distinción directos / indirectos / externos (Cap. 4 §4.5 y §4.5.1) | ✅ Incluido |
| Lista de tipos de participantes — ejemplo MHC-PMS (§4.5.1, p. 103) | ✅ Incluido |
| Tipos adicionales: administradores de negocios, expertos, sindicatos (§4.5, p. 101) | ✅ Incluido |
| Tabla de mapeo tipos Sommerville → campo `rol` (8 tipos) | ✅ Incluido |
| Proceso en espiral de IR — Fig. 4.12 (Cap. 4 §4.4, p. 99) | ✅ Incluido |
| 4 actividades del proceso de adquisición (Cap. 4 §4.5, p. 101–102) | ✅ Incluido |
| Técnicas de descubrimiento: entrevistas, escenarios, puntos de vista, etnografía | ✅ Incluido |
| Stakeholders ocultos / pasivos (Cap. 4 §4.5, p. 102) | ✅ Incluido |
| Factor político en requerimientos (Cap. 4 §4.5, p. 102) | ✅ Incluido |
| Conflictos inevitables entre participantes (Cap. 4 §4.5, p. 102) | ✅ Incluido |
| Tabla de tipos de conflictos más comunes | ✅ Incluido |
| Proceso de negociación y resolución — actividad 3 del espiral (§4.5, p. 101) | ✅ Incluido |
| Rol del ingeniero como mediador (Cap. 4 §4.5, p. 102) | ✅ Incluido |
| Nota explícita: Sommerville NO presenta la Matriz I/I por ese nombre | ✅ Declarado |
| Matriz Influencia/Interés construida a partir de niveles de Sommerville | ✅ Incluido |
| 4 cuadrantes con descripción operativa completa (canal, frecuencia, involucramiento) | ✅ Incluido |
| Definición de sistemas sociotécnicos (Cap. 10 §10.1, p. 267) | ✅ Incluido |
| Capas sociotécnicas relevantes para stakeholders (Cap. 10 §10.1, p. 264–265) | ✅ Incluido |
| Factores organizacionales que afectan requerimientos (Cap. 10 §10.1, p. 268) | ✅ Incluido |
| Procuración del sistema como fuente de stakeholders formales (Cap. 10 §10.3, p. 273) | ✅ Incluido |
| Roles de procuración mapeados a `rol` del sistema | ✅ Incluido |
| Plantilla operativa: 9 campos actuales mapeados con justificación Sommerville | ✅ Incluido |
| Campos propuestos para v2: 6 campos con justificación | ✅ Incluido |
| Checklist operativo de completitud: 11 ítems al registrar + 3 al iniciar proyecto | ✅ Incluido |
| Tabla de conexiones con los 3 módulos del sistema: 15 conexiones | ✅ Incluido |


---

*Documento generado con respaldo bibliográfico directo en:*
*Sommerville, Ian. **Ingeniería de Software**, 9ª Edición. Pearson Educación, México, 2011.*
*Capítulos utilizados: Cap. 4 (§4.1, §4.4, §4.5, §4.5.1–§4.5.5, §4.7) · Cap. 10 (§10.1, §10.2, §10.3)*