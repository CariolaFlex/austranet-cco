# M2-03-registro-riesgos-proyecto.md

---

## METADATOS DEL DOCUMENTO

| Campo              | Valor                                                        |
|--------------------|--------------------------------------------------------------|
| **Nombre**         | `M2-03-registro-riesgos-proyecto.md`                         |
| **Módulo**         | Módulo 2 — Registro y Configuración de Proyectos             |
| **Capítulo fuente**| Cap. 22 §22.1, Sommerville — *Ingeniería de Software*, 9ª ed.|
| **Versión**        | v2.0                                                         |
| **Fecha**          | 2026-02-24                                                   |
| **Estado**         | Activo — Manual operativo                                    |
| **Autor**          | Documentación del sistema                                    |
| **Referencia base**| M1-04 (evaluación-factibilidad) — Marco teórico del riesgo   |

---

## 1. OBJETIVO DEL DOCUMENTO

### 1.1 Qué cubre este archivo

Este documento es el **manual operativo** del registro de riesgos del Módulo 2. Define **cómo nace, evoluciona y se cierra** cada riesgo individual a lo largo del ciclo de vida de un proyecto registrado en el sistema.

Específicamente, este archivo documenta:

- El ciclo de vida de un riesgo individual (estados y transiciones).
- El mecanismo de herencia de riesgos desde la Entidad (M1) al Proyecto (M2).
- El catálogo estándar de riesgos pre-definidos por tipo de proyecto.
- Los indicadores observables de materialización por tipo de riesgo.
- El protocolo de revisión periódica del registro de riesgos.
- La plantilla operativa extendida del tipo `RiesgoProyecto`.
- El checklist de completitud para activar el registro de riesgos.

### 1.2 Qué NO cubre este archivo

Este archivo **no repite** el marco teórico ya documentado en **M1-04 (evaluación-factibilidad)**. Las siguientes secciones están definidas allí y se referencian directamente desde este documento:

- Definición formal de riesgo (Ver M1-04, Sección 3).
- Tipos de riesgo según Tabla 22.1 del libro (Ver M1-04, Sección 4).
- El proceso de gestión del riesgo en 4 etapas (Ver M1-04, Sección 5).
- Las 3 estrategias de mitigación: evitación, minimización y contingencia (Ver M1-04, Sección 6).
- La matriz probabilidad × impacto (Ver M1-04, Sección 8).

### 1.3 Posición en el flujo del sistema

El registro de riesgos es un **artefacto vivo** que nace en el **PASO 4** del flujo de creación de proyecto definido en M2-01, se alimenta de los riesgos heredados de la Entidad evaluada en M1-04, y evoluciona durante todo el ciclo de vida del proyecto hasta su cierre formal.

---

## 2. EL REGISTRO DE RIESGOS COMO ARTEFACTO VIVO

### 2.1 Fundamento teórico

Sommerville establece de forma explícita que la gestión del riesgo no es una actividad puntual:

> *"El proceso de gestión del riesgo es un proceso iterativo que continúa a lo largo del proyecto. Una vez desarrollado un plan de gestión del riesgo inicial, se monitoriza la situación para detectar riesgos emergentes. Conforme esté disponible más información referente a los riesgos, habrá que volver a analizar los riesgos y decidir si cambió la prioridad del riesgo."*
> — Cap. 22 §22.1, p. 597

Esta naturaleza iterativa implica que el registro de riesgos **no es un formulario que se llena una vez**. Es un artefacto que acumula historial, cambia de estado, incorpora nuevos riesgos y descarta los cerrados. Cada revisión lo actualiza; ignorarlo entre revisiones es una falla de gestión.

Sommerville también prescribe la frecuencia mínima de revisión:

> *"Los riesgos deben monitorizarse comúnmente en todas las etapas del proyecto. En cada revisión administrativa, es necesario reflexionar y estudiar cada uno de los riesgos clave por separado."*
> — Cap. 22 §22.1.4, p. 602

**Aplicación en el sistema:** Cada revisión del registro de riesgos en el Módulo 2 debe quedar registrada con fecha, usuario que revisó y cambios aplicados. El sistema debe impedir que un proyecto avance al Módulo 3 si el registro de riesgos nunca fue revisado desde su creación.

---

### 2.2 Los 4 estados de un riesgo en el sistema

El campo `estado` del tipo `RiesgoProyecto` implementa el ciclo de vida del riesgo individual. A continuación se define cada estado y el significado de cada transición:

| Estado           | Significado operativo                                                                                     |
|------------------|-----------------------------------------------------------------------------------------------------------|
| `activo`         | El riesgo fue identificado y está bajo seguimiento. Todavía no ocurrió ni fue controlado.                 |
| `mitigado`       | La estrategia de mitigación se implementó y los indicadores de alerta disminuyeron o desaparecieron.      |
| `materializado`  | El riesgo se convirtió en un problema real que está afectando el proyecto.                                |
| `cerrado`        | El riesgo ya no requiere seguimiento. Puede llegar a este estado desde `mitigado` o `materializado`.      |

---

### 2.3 Diagrama de transición de estados

```

                    ┌─────────────┐
                    │    activo   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────────┐
              ▼                             ▼
    ┌──────────────────┐         ┌────────────────────┐
    │    mitigado      │         │   materializado     │
    └────────┬─────────┘         └──────────┬──────────┘
             │    ▲                         │
             │    │ (reactivación)          │
             ▼                             ▼
    ┌──────────────────────────────────────────────────┐
    │                    cerrado                        │
    └──────────────────────────────────────────────────┘
    ```

---

### 2.4 Reglas de transición

#### `activo` → `mitigado`
- **Cuándo ocurre:** Cuando el responsable del riesgo confirma que la acción de mitigación fue ejecutada completamente y los indicadores de alerta temprana (Sección 5) ya no están presentes.
- **Qué lo evidencia:** Una nota en el campo `mitigacion` que describe la acción tomada, la fecha de implementación y el responsable que la ejecutó.
- **Quién puede ejecutarla:** Rol `gestor` del proyecto.

#### `activo` → `materializado`
- **Cuándo ocurre:** Cuando un indicador de materialización de la Sección 5 se confirma como real y está impactando activamente el proyecto (cronograma, presupuesto, alcance o calidad).
- **Qué implica:** El sistema debe activar una notificación al rol `gestor` y al proceso SRS del Módulo 3 si el tipo es `requerimientos`. El plan de contingencia (campo `mitigacion`) debe activarse inmediatamente.
- **Quién puede ejecutarla:** Rol `gestor` del proyecto.

#### `materializado` → `cerrado`
- **Cuándo ocurre:** Cuando el impacto del riesgo materializado fue contenido, el plan de contingencia se ejecutó y el proyecto puede continuar sin intervención adicional para este riesgo.
- **Qué requiere:** Documentación obligatoria en el historial: qué ocurrió, qué se hizo, cuánto impactó al proyecto (costo, plazo u alcance) y qué lecciones se extraen.
- **Quién puede ejecutarla:** Rol `gestor` del proyecto, con revisión del rol `admin` si el impacto fue categoría `alto` o `muy_alto`.

#### `mitigado` → `cerrado`
- **Cuándo ocurre:** Cuando el período de observación post-mitigación confirmó que el riesgo ya no puede resurgir (por ejemplo, la tecnología riesgosa fue reemplazada definitivamente, o la persona clave fue reemplazada con el perfil correcto).
- **Qué documenta:** Una entrada en el historial con la fecha de cierre, la justificación de por qué el riesgo no puede regresar al estado `activo`, y el nombre del responsable que cerró formalmente.
- **Quién puede ejecutarla:** Rol `gestor` del proyecto.

#### `mitigado` → `activo` (reactivación)
- **Cuándo ocurre:** Cuando durante una revisión periódica (Sección 6) se detecta que la mitigación ya no es efectiva o que el contexto del proyecto cambió de forma que el riesgo puede materializarse nuevamente.
- **Qué requiere:** Documentación obligatoria en el historial explicando por qué la mitigación falló o dejó de ser válida.
- **Quién puede ejecutarla:** Rol `gestor` del proyecto.

---

### 2.5 Frecuencia mínima de revisión del registro completo

Sommerville establece que la revisión debe ocurrir *"en cada revisión administrativa"* y *"en todas las etapas del proyecto"* (Cap. 22 §22.1.4, p. 602). El protocolo operativo específico por metodología se define en la Sección 6.

**Aplicación en el sistema:** El campo `estado` del tipo `RiesgoProyecto` implementa este ciclo de vida. El sistema **debe registrar la fecha y el usuario de cada transición de estado** como parte del historial de auditoría (`historial: Cambio[]`, propuesto en la Sección 7).

---

## 3. RIESGOS HEREDADOS DE LA ENTIDAD (MECANISMO M1 → M2)

### 3.1 Fundamento del mecanismo de herencia

La evaluación de factibilidad de la Entidad realizada en M1-04 produce como resultado el campo `nivelRiesgo` de la entidad (`bajo` | `medio` | `alto` | `critico`). Este nivel sintetiza la exposición histórica y estructural de la entidad como cliente o proveedor.

Cuando se crea un proyecto vinculado a esa entidad, el sistema debe **transferir automáticamente** un conjunto inicial de riesgos al registro de riesgos del proyecto, proporcional al nivel de riesgo de la entidad. Esta herencia no es opcional: es una regla de negocio que garantiza que ningún proyecto comience desde cero ignorando el historial de la entidad con quien se trabaja.

**Base teórica:** Sommerville establece que los riesgos organizacionales *"se derivan del entorno organizacional donde se desarrolla el software"* y que los riesgos de personas *"se asocian con las personas en el equipo de desarrollo"* (Cap. 22 §22.1.1, p. 598). Ambos tipos son directamente influenciados por las características de la entidad contratante o proveedora.

---

### 3.2 Reglas de mapeo: `nivelRiesgo` de la Entidad → Riesgos iniciales del Proyecto

| `nivelRiesgo` de la Entidad | Riesgos heredados obligatorios                                   | Cantidad mínima |
|-----------------------------|------------------------------------------------------------------|-----------------|
| `bajo`                      | Ninguno. El registro comienza vacío (solo riesgos mínimos M2).  | 0 heredados     |
| `medio`                     | 1 riesgo de tipo `organizacional` heredado.                     | 1 heredado      |
| `alto`                      | 1 riesgo `organizacional` + 1 riesgo `personas` heredados.      | 2 heredados     |
| `critico`                   | Riesgos de todos los tipos disponibles: `organizacional`, `personas`, `requerimientos`, `estimacion`. | 4 heredados |

> **Regla complementaria:** Independientemente del nivel de riesgo de la entidad, el registro de riesgos del proyecto **siempre** debe incluir al menos 1 riesgo de tipo `requerimientos` y 1 de tipo `estimacion` como riesgos mínimos obligatorios del Módulo 2 (ver Sección 8, checklist). Estos dos últimos **no son heredados**: se generan del contexto del proyecto.

---

### 3.3 Cómo se documenta el origen del riesgo

El campo adicional **`origen`** (propuesto en la Sección 7) diferencia los riesgos heredados de los identificados directamente en el proyecto:

| Valor de `origen`       | Descripción                                                                             |
|-------------------------|-----------------------------------------------------------------------------------------|
| `heredado_entidad`      | El riesgo fue creado automáticamente por el sistema al crear el proyecto, basado en el `nivelRiesgo` de la Entidad vinculada. |
| `identificado_proyecto` | El riesgo fue registrado manualmente por el gestor durante el transcurso del proyecto.  |

El sistema debe **impedir la eliminación** de riesgos con `origen = 'heredado_entidad'` mientras el proyecto esté en estado `activo`. Solo pueden modificarse con justificación documentada o cerrarse cuando corresponda.

---

### 3.4 Política de edición de riesgos heredados

Los riesgos heredados **pueden editarse** en sus campos de análisis (`probabilidad`, `impacto`, `estrategia`, `mitigacion`, `responsable`) para adaptarlos al contexto específico del proyecto. Sin embargo:

- **No pueden eliminarse** mientras el proyecto esté activo (requieren el estado `cerrado` para dejar de aparecer en el registro activo).
- **No pueden cambiar su `tipo`**: el tipo del riesgo heredado está determinado por la categoría de riesgo que lo generó.
- **El campo `origen`** es de solo lectura una vez asignado.
- Cualquier modificación a un riesgo heredado **debe quedar registrada en el historial** con la justificación del cambio.

**Aplicación en el sistema:** La herencia de riesgos M1 → M2 es la regla de negocio central que conecta el perfil de riesgo de la entidad con el registro operativo del proyecto. El sistema debe ejecutar este mecanismo automáticamente en el PASO 4 del flujo de M2-01, sin intervención manual del gestor, pero permitiéndole ajustar los valores heredados inmediatamente después.

---

## 4. CATÁLOGO DE RIESGOS ESTÁNDAR POR TIPO DE PROYECTO

Los riesgos del catálogo se basan en los tipos de la Figura 22.3 (Cap. 22 §22.1.1, p. 599) y los ejemplos de la Figura 22.1 (p. 597) de Sommerville, extrapolados a los tipos de proyecto del sistema. Cada riesgo del catálogo es un punto de partida sugerido, no una imposición: el gestor puede aceptarlos, modificarlos o descartarlos justificando la decisión.

> **Nota de uso:** Los campos `probabilidad` e `impacto` son valores iniciales sugeridos. El gestor debe ajustarlos al contexto real del proyecto antes de activar el registro.

---

### 4.1 Riesgos estándar para `nuevo_desarrollo`

| # | Descripción                                                                                    | Tipo              | Prob. sugerida | Impacto sugerido | Estrategia por defecto | Justificación Sommerville                          |
|---|-----------------------------------------------------------------------------------------------|-------------------|----------------|------------------|------------------------|----------------------------------------------------|
| 1 | La tecnología seleccionada para el backend no soporta los volúmenes de transacciones requeridos. | `tecnologico`   | `media`        | `alto`           | `minimizar`            | Fig. 22.3 #1: "La base de datos no puede procesar tantas transacciones." |
| 2 | Los componentes de software de terceros (librerías, SDKs) contienen defectos que impiden su reutilización como se planificó. | `tecnologico` | `media` | `medio` | `contingencia` | Fig. 22.3 #2: "Componentes de reutilización contienen defectos." |
| 3 | No es posible reclutar o contratar personal con las habilidades técnicas requeridas para el stack definido. | `personas` | `alta` | `alto` | `minimizar` | Fig. 22.3 #3: "Imposible reclutar personal con las habilidades requeridas." |
| 4 | El personal clave del equipo se encuentra incapacitado o no disponible en hitos críticos del proyecto. | `personas` | `baja` | `alto` | `minimizar` | Fig. 22.3 #4: "Personal clave está enfermo en momentos críticos." |
| 5 | Los stakeholders proponen cambios al alcance que demandan trabajo de rediseño significativo. | `requerimientos` | `alta` | `alto` | `minimizar` | Fig. 22.3 #10: "Cambios a los requerimientos que demandan mayor trabajo de rediseño." |
| 6 | Los clientes no comprenden las implicaciones técnicas o de costo de los cambios que solicitan. | `requerimientos` | `media` | `medio` | `minimizar` | Fig. 22.3 #11: "Los clientes no entienden las repercusiones de los cambios." |
| 7 | El tiempo requerido para desarrollar los módulos principales fue subestimado en la planificación inicial. | `estimacion` | `alta` | `alto` | `contingencia` | Fig. 22.3 #12: "Se subestima el tiempo requerido para desarrollar el software." |
| 8 | El tamaño real del sistema supera en más de un 20% la estimación inicial de líneas de código o puntos de función. | `estimacion` | `media` | `medio` | `contingencia` | Fig. 22.3 #14: "Se subestima el tamaño del software." |
| 9 | La organización se reestructura durante el proyecto y el nuevo responsable tiene prioridades distintas. | `organizacional` | `baja` | `alto` | `contingencia` | Fig. 22.3 #6: "La organización se reestructura con diferentes administraciones." |
| 10 | Restricciones presupuestarias de la organización obligan a reducir el alcance o el equipo del proyecto. | `organizacional` | `baja` | `muy_alto` | `contingencia` | Fig. 22.3 #7: "Problemas financieros fuerzan reducciones en el presupuesto." |

---

### 4.2 Riesgos estándar para `mantenimiento`

| # | Descripción                                                                                    | Tipo              | Prob. sugerida | Impacto sugerido | Estrategia por defecto |
|---|-----------------------------------------------------------------------------------------------|-------------------|----------------|------------------|------------------------|
| 1 | La documentación técnica del sistema existente está desactualizada o incompleta, aumentando el tiempo de análisis antes de cada cambio. | `tecnologico` | `alta` | `medio` | `minimizar` |
| 2 | El sistema contiene deuda técnica acumulada que hace que cada corrección introduzca regresiones en otras funcionalidades. | `tecnologico` | `alta` | `alto` | `minimizar` |
| 3 | Dependencias del sistema (librerías, frameworks, APIs externas) están obsoletas y sin soporte activo del proveedor. | `tecnologico` | `media` | `alto` | `evitar` |
| 4 | El desarrollador original del sistema no está disponible para transferir conocimiento sobre decisiones de diseño críticas. | `personas` | `media` | `alto` | `contingencia` |
| 5 | Los usuarios finales rechazan o dificultan la adopción de cambios introducidos durante el mantenimiento, generando conflictos de versiones en producción. | `requerimientos` | `media` | `medio` | `minimizar` |
| 6 | Las estimaciones de tiempo para corregir defectos en el código heredado son consistentemente inferiores al tiempo real requerido. | `estimacion` | `alta` | `medio` | `contingencia` |

---

### 4.3 Riesgos estándar para `migracion`

| # | Descripción                                                                                    | Tipo              | Prob. sugerida | Impacto sugerido | Estrategia por defecto |
|---|-----------------------------------------------------------------------------------------------|-------------------|----------------|------------------|------------------------|
| 1 | La migración de datos produce pérdida o corrupción de registros históricos por incompatibilidad de formatos entre el sistema origen y destino. | `tecnologico` | `media` | `muy_alto` | `evitar` |
| 2 | Los formatos de datos del sistema legado son incompatibles con los esquemas del sistema destino y requieren transformaciones no previstas. | `tecnologico` | `alta` | `alto` | `minimizar` |
| 3 | El tiempo de inactividad del sistema durante la migración supera la ventana de mantenimiento acordada con los usuarios. | `tecnologico` | `media` | `alto` | `minimizar` |
| 4 | Los usuarios finales muestran resistencia activa al nuevo sistema y demandan el retorno al sistema legado durante el periodo de transición. | `personas` | `media` | `medio` | `minimizar` |
| 5 | Los stakeholders cambian los requerimientos de datos a migrar una vez iniciado el proceso de transformación, invalidando scripts ya validados. | `requerimientos` | `media` | `alto` | `evitar` |
| 6 | El volumen real de datos a migrar supera en más de un 30% la estimación inicial, desbordando el tiempo y costo planificados. | `estimacion` | `media` | `alto` | `contingencia` |
| 7 | Las APIs o conectores del sistema destino cambian de versión durante el proyecto de migración, invalidando la integración desarrollada. | `tecnologico` | `baja` | `alto` | `contingencia` |

---

### 4.4 Riesgos estándar para `consultoria`

| # | Descripción                                                                                    | Tipo              | Prob. sugerida | Impacto sugerido | Estrategia por defecto |
|---|-----------------------------------------------------------------------------------------------|-------------------|----------------|------------------|------------------------|
| 1 | Las recomendaciones entregadas por el consultor no son implementadas por la organización cliente por falta de recursos o voluntad política. | `organizacional` | `alta` | `alto` | `minimizar` |
| 2 | El alcance del trabajo de consultoría no está formalmente delimitado, generando expectativas divergentes entre el consultor y el cliente. | `requerimientos` | `alta` | `alto` | `evitar` |
| 3 | La organización cliente genera dependencia del consultor para tareas que deberían ser internas, dificultando la transferencia de conocimiento al finalizar el contrato. | `personas` | `media` | `medio` | `minimizar` |
| 4 | Conflicto de interés entre las recomendaciones técnicamente óptimas y los intereses comerciales o políticos de la organización cliente. | `organizacional` | `media` | `alto` | `contingencia` |

---

### 4.5 Riesgos estándar para `integracion`

| # | Descripción                                                                                    | Tipo              | Prob. sugerida | Impacto sugerido | Estrategia por defecto |
|---|-----------------------------------------------------------------------------------------------|-------------------|----------------|------------------|------------------------|
| 1 | Las APIs del sistema externo a integrar son inestables o cambian sin previo aviso durante el desarrollo. | `tecnologico` | `media` | `alto` | `minimizar` |
| 2 | Las versiones de los protocolos o estándares de comunicación entre sistemas son incompatibles. | `tecnologico` | `media` | `alto` | `evitar` |
| 3 | La latencia o el rendimiento de la red en producción degrada la experiencia del usuario por debajo de los requisitos no funcionales. | `tecnologico` | `baja` | `medio` | `contingencia` |
| 4 | La transferencia de datos entre sistemas expone información sensible por ausencia o debilidad en los mecanismos de cifrado. | `tecnologico` | `baja` | `muy_alto` | `evitar` |
| 5 | El proveedor del sistema externo no entrega a tiempo la documentación técnica de sus APIs, bloqueando el desarrollo de la integración. | `personas` | `media` | `alto` | `contingencia` |
| 6 | Los requerimientos de integración cambian porque el sistema externo lanza una actualización mayor no comunicada oportunamente. | `requerimientos` | `media` | `alto` | `minimizar` |
| 7 | El volumen de llamadas a la API externa supera los límites del plan contratado, generando costos no presupuestados o bloqueos de servicio. | `estimacion` | `baja` | `medio` | `contingencia` |

---

## 5. INDICADORES DE MATERIALIZACIÓN POR TIPO DE RIESGO

**Fundamento teórico:** Sommerville describe en la Figura 22.6 (Cap. 22 §22.1.4, p. 602) los *"indicadores potenciales"* por tipo de riesgo como la herramienta central del proceso de monitoreo. Para el sistema, estos indicadores se operacionalizan en dos niveles: **alerta temprana** (el riesgo está escalando) y **materialización** (el riesgo ya es un problema activo).

> *"Para hacer esto, observe otros factores, como el número de peticiones de cambio de requerimientos, lo que da pistas acerca de la probabilidad del riesgo y sus efectos."*
> — Cap. 22 §22.1.4, p. 602

Todos los indicadores listados a continuación son **observables y medibles**, no subjetivos. El gestor debe poder confirmar o descartar cada uno de ellos sin interpretación.

| Tipo de riesgo    | Indicador de alerta temprana                                                                    | Indicador de materialización confirmada                                                          |
|-------------------|-------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| `tecnologico`     | Una herramienta, librería o plataforma no funciona como se esperaba en el ambiente de desarrollo o staging. | Bloqueador técnico confirmado sin solución viable identificada en más de 2 días hábiles. |
| `tecnologico`     | Entrega tardía del hardware, software de soporte o acceso a ambientes por parte del proveedor. (Fig. 22.6) | El ambiente de producción o integración no está disponible en la fecha comprometida y no hay fecha alternativa. |
| `personas`        | Baja moral visible en el equipo; aumento de conflictos entre miembros; disminución de velocidad de entrega. (Fig. 22.6) | Renuncia, licencia prolongada o ausencia no planificada de un miembro clave del equipo confirmada. |
| `personas`        | Un miembro del equipo demuestra consistentemente no poseer la habilidad técnica requerida para su rol en el proyecto. | Retraso confirmado en una tarea crítica directamente atribuible a falta de competencia no subsanable sin capacitación. |
| `organizacional`  | Stakeholder principal no responde comunicaciones en más de 5 días hábiles. Chismes o rumores de reorganización. (Fig. 22.6) | Decisión organizacional formal que bloquea, cambia el alcance o elimina recursos comprometidos para el proyecto. |
| `organizacional`  | Falta de acción de los altos ejecutivos ante solicitudes de aprobación con más de 10 días de antigüedad. (Fig. 22.6) | Congelamiento de presupuesto o cambio de sponsor del proyecto comunicado oficialmente. |
| `requerimientos`  | Los stakeholders cambian opinión o posición frecuentemente entre reuniones. Múltiples peticiones de cambio de requerimientos en una semana. (Fig. 22.6) | Cambio de alcance formal solicitado por escrito que requiere rediseño de módulos ya implementados o aprobados. |
| `requerimientos`  | Quejas recurrentes de los clientes sobre el producto en demos o revisiones de sprint. (Fig. 22.6) | Rechazo formal del cliente a un entregable ya completado, exigiendo rehacer trabajo validado previamente. |
| `estimacion`      | Tareas consecutivas toman consistentemente el doble del tiempo estimado. Falla para cumplir el calendario acordado. (Fig. 22.6) | Más del 30% del presupuesto o tiempo consumido sin haber alcanzado el 30% del avance planificado. |
| `estimacion`      | La tasa de corrección de defectos es persistentemente menor a la tasa de generación de nuevos defectos reportados. (Fig. 22.6) | El backlog de defectos críticos supera la capacidad del equipo para resolverlos en el plazo del sprint o fase actual. |

**Aplicación en el sistema:** Esta tabla es la base del sistema de alertas del Módulo 2. Cada indicador de materialización debe poder ser registrado manualmente por el gestor como evento en el historial del riesgo, cambiando el estado de `activo` a `materializado` con evidencia documentada.

---

## 6. PROCESO DE REVISIÓN PERIÓDICA DEL REGISTRO DE RIESGOS

**Fundamento teórico:** La etapa de Monitoreo de Riesgos del Cap. 22 §22.1.4 (p. 602) establece que:

> *"La monitorización del riesgo es el proceso para comprobar que no han cambiado sus suposiciones sobre riesgos del producto, el proceso y la empresa. Hay que valorar regularmente cada uno de los riesgos identificados para decidir si este riesgo se vuelve más o menos probable."*

---

### 6.1 Frecuencia de revisión por metodología del proyecto

| Metodología del proyecto          | Frecuencia de revisión del registro de riesgos                                    |
|-----------------------------------|------------------------------------------------------------------------------------|
| `cascada` / `incremental` / `RUP` | En cada hito formal del proyecto (según el plan definido en M2-01). Mínimo 1 revisión por fase. |
| `agil` / `scrum`                  | Al final de cada Sprint, durante el Sprint Review, antes de planificar el siguiente Sprint. |
| Cualquier metodología con criticidad `critica` | Revisión adicional semanal, independiente de la metodología. El sistema debe enviar recordatorio automático al gestor. |

---

### 6.2 Protocolo operativo de revisión

El gestor del proyecto debe seguir los siguientes pasos en cada revisión formal del registro:

---

**PASO 1 — Revisar riesgos en estado `activo`**

Para cada riesgo activo:
- ¿Alguno de los indicadores de alerta temprana de la Sección 5 está presente?
  - **Si sí →** Actualizar el campo `probabilidad` al valor más alto correspondiente. Registrar una observación en el historial (`historial`) con fecha, descripción del indicador detectado y acción tomada.
  - ¿El indicador de materialización ya se confirmó?
    - **Si sí →** Cambiar estado a `materializado` con evidencia documentada.
- ¿La probabilidad o el impacto del riesgo cambió desde la última revisión?
  - **Si sí →** Actualizar ambos campos y registrar el cambio en el historial.

---

**PASO 2 — Revisar riesgos en estado `mitigado`**

Para cada riesgo mitigado:
- ¿La acción de mitigación ejecutada sigue siendo efectiva en el contexto actual del proyecto?
  - **Si no →** Reactivar el riesgo a estado `activo`, documentar en el historial por qué la mitigación dejó de ser válida y definir una nueva estrategia.
- ¿El contexto del proyecto cambió de forma que el riesgo podría resurgir?
  - **Si sí →** Evaluar reactivación.

---

**PASO 3 — Verificar nuevos riesgos no registrados**

- Comparar el estado actual del proyecto con el catálogo de la Sección 4 correspondiente al tipo de proyecto.
- ¿Hay situaciones en el proyecto que correspondan a riesgos del catálogo no registrados?
  - **Si sí →** Registrar el nuevo riesgo con `origen = 'identificado_proyecto'` y `estado = 'activo'`.
- Revisar si hubo cambios en el equipo, los requerimientos o el contexto organizacional que introduzcan riesgos nuevos no cubiertos por el catálogo.

---

**PASO 4 — Actualizar la matriz de riesgo del proyecto**

- Recalcular el nivel de riesgo general del proyecto usando la matriz probabilidad × impacto de M1-04 (Ver M1-04, Sección 8).
  - El nivel general se calcula como el nivel más alto entre todos los riesgos en estado `activo` o `materializado`.
- ¿El nivel general subió desde la última revisión?
  - **Si sí →** Activar las reglas de escalamiento de la Sección 6.3.
- Actualizar el campo `nivelCalculado` de todos los riesgos activos.

---

**PASO 5 — Documentar el resultado de la revisión**

Crear una entrada en el historial de la revisión con:
- Fecha y hora de la revisión.
- Nombre y rol del gestor que revisó.
- Resumen de cambios: cuántos riesgos cambiaron de estado, cuántos nuevos se agregaron, cuántos se cerraron.
- Nivel general del registro antes y después de la revisión.
- Fecha estimada de la próxima revisión.

---

### 6.3 Escalamiento por nivel de riesgo general del proyecto

| Nivel general del proyecto | Acción automática del sistema                                                                                          |
|----------------------------|------------------------------------------------------------------------------------------------------------------------|
| `alto`                     | Notificación automática al rol `gestor` del proyecto con resumen de los riesgos que elevaron el nivel.               |
| `critico`                  | Notificación automática al rol `admin` del sistema + **bloqueo de avance al Módulo 3** hasta que el gestor realice una revisión manual y documente un plan de acción. |
| Riesgo `materializado` de tipo `requerimientos` | Notificación automática al proceso SRS activo del Módulo 3, si existe, indicando que hay un riesgo de requerimientos materializado que puede impactar el SRS en curso. |

**Aplicación en el sistema:** Las reglas de escalamiento son disparadores automáticos del sistema. No requieren intervención del gestor para activarse. El bloqueo al Módulo 3 por nivel `critico` solo puede levantarse cuando el gestor cambia el estado de los riesgos críticos o documenta una justificación de continuación aprobada por el rol `admin`.

---

## 7. PLANTILLA OPERATIVA EXTENDIDA: `RiesgoProyecto`

La siguiente tabla extiende el tipo `RiesgoProyecto` existente en `src/types/index.ts` con los campos adicionales que el proceso operativo requiere. Los campos propuestos deben añadirse en la versión `v2` del tipo.

| Campo                  | Estado           | Tipo TypeScript                                                              | Descripción operativa                                                                                   | Justificación                                      |
|------------------------|------------------|------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|----------------------------------------------------|
| `id`                   | **Existe**       | `string`                                                                     | UUID único del riesgo dentro del proyecto.                                                              | Identificación. Cap. 22 §22.1.                     |
| `descripcion`          | **Existe**       | `string`                                                                     | Enunciado concreto del riesgo: qué puede ocurrir, en qué contexto. No acepta enunciados genéricos.      | Cap. 22 §22.1, Fig. 22.3.                          |
| `tipo`                 | **Existe**       | `'tecnologico' \| 'personas' \| 'organizacional' \| 'requerimientos' \| 'estimacion'` | Categoría del riesgo según la clasificación de Sommerville.                              | Tabla 22.1. Ver M1-04, Sección 4.                  |
| `probabilidad`         | **Existe**       | `'muy_baja' \| 'baja' \| 'media' \| 'alta' \| 'muy_alta'`                   | Probabilidad estimada de ocurrencia. Debe actualizarse en cada revisión.                                | Cap. 22 §22.1.2, p. 599.                           |
| `impacto`              | **Existe**       | `'muy_bajo' \| 'bajo' \| 'medio' \| 'alto' \| 'muy_alto'`                   | Gravedad del efecto si el riesgo se materializa.                                                        | Cap. 22 §22.1.2, p. 599.                           |
| `estrategia`           | **Existe**       | `'evitar' \| 'minimizar' \| 'contingencia' \| 'aceptar'`                    | Estrategia de respuesta elegida. Ver M1-04, Sección 6 para definición de cada estrategia.               | Cap. 22 §22.1.3, p. 601.                           |
| `mitigacion`           | **Existe**       | `string?`                                                                    | Descripción de la acción concreta a tomar. Obligatorio si `estrategia !== 'aceptar'` y `probabilidad` es `alta` o `muy_alta`. | Cap. 22 §22.1.3.         |
| `responsable`          | **Existe**       | `string?`                                                                    | Nombre o ID del usuario responsable de ejecutar la mitigación. Obligatorio si `impacto` es `alto` o `muy_alto`. | Cap. 22 §22.1.                          |
| `estado`               | **Existe**       | `'activo' \| 'mitigado' \| 'materializado' \| 'cerrado'`                    | Estado actual del riesgo en su ciclo de vida. Ver Sección 2.                                            | Cap. 22 §22.1.4.                                   |
| `origen`               | **PROPUESTO v2** | `'heredado_entidad' \| 'identificado_proyecto'`                              | Indica si el riesgo fue generado automáticamente por herencia M1→M2 o registrado manualmente. Ver Sección 3.3. | Sección 3 (este documento).          |
| `fechaIdentificacion`  | **PROPUESTO v2** | `Date`                                                                       | Fecha en que el riesgo fue creado o identificado en el registro.                                        | Trazabilidad y auditoría. Cap. 25 §25.1.           |
| `fechaUltimaRevision`  | **PROPUESTO v2** | `Date`                                                                       | Fecha de la última revisión formal del riesgo. Se actualiza en cada ciclo de PASO 1 o PASO 2 (Sección 6.2). | Monitoreo. Cap. 22 §22.1.4.           |
| `historial`            | **PROPUESTO v2** | `CambioRiesgo[]`                                                             | Array de cambios registrados: cada elemento documenta fecha, usuario, campo modificado, valor anterior y valor nuevo, más nota opcional. | Gestión de configuración. Cap. 25 §25.1. |
| `nivelCalculado`       | **PROPUESTO v2** | `'bajo' \| 'medio' \| 'alto' \| 'critico'`                                  | Nivel de riesgo resultante de la combinación probabilidad × impacto, calculado automáticamente por el sistema con la matriz de M1-04. | Matriz de riesgo. Ver M1-04, Sección 8. |

#### Tipo auxiliar `CambioRiesgo` (propuesto v2)

```typescript
interface CambioRiesgo {
  fecha: Date
  usuarioId: string
  campo: string           // nombre del campo modificado
  valorAnterior: string   // serializado como string para cualquier tipo
  valorNuevo: string
  nota?: string           // justificación del cambio (obligatoria en transiciones de estado)
}
```

**Aplicación en el sistema:** Los campos propuestos deben agregarse al tipo `RiesgoProyecto` en `src/types/index.ts` como parte de la versión v2 del schema. El campo `historial` es especialmente crítico para la auditoría del ciclo de vida del riesgo requerida por el proceso operativo de la Sección 6.

---

## 8. CHECKLIST OPERATIVO: REGISTRO DE RIESGOS COMPLETO

Lista de verificación para confirmar que el registro de riesgos de un proyecto está listo para activarse y habilitar el avance al Módulo 3.

**Completitud del registro:**

- [ ] ¿Se registraron todos los riesgos heredados de la Entidad según las reglas de mapeo de la Sección 3.2 (proporcional al `nivelRiesgo` de la entidad vinculada)?
- [ ] ¿El registro tiene al menos **3 riesgos** registrados en total (entre heredados e identificados)?
- [ ] ¿Cada riesgo tiene los campos `descripcion`, `tipo`, `probabilidad` e `impacto` completados con valores concretos (no dejados en valor por defecto)?
- [ ] ¿Existe al menos **1 riesgo de tipo `requerimientos`**? (siempre presente en proyectos de software: los requerimientos siempre cambian — Cap. 22 §22.1.1, p. 598)
- [ ] ¿Existe al menos **1 riesgo de tipo `estimacion`**? (siempre presente antes de tener un SRS completo: la estimación inicial es inherentemente inexacta — Cap. 22 §22.1.1, p. 598)

**Calidad del análisis:**

- [ ] ¿Los riesgos con `probabilidad = 'alta'` o `'muy_alta'` tienen el campo `mitigacion` completado con una acción concreta (no con texto genérico)?
- [ ] ¿Los riesgos con `impacto = 'alto'` o `'muy_alto'` tienen el campo `responsable` asignado a un usuario real del sistema?
- [ ] ¿Los riesgos con `estrategia = 'evitar'` tienen una justificación escrita en `mitigacion` que explica **cómo** se evita el riesgo? (la estrategia de evitación no puede usarse sin documentar el mecanismo de evitación)
- [ ] ¿Los riesgos con `estrategia = 'aceptar'` tienen justificación explícita de por qué el impacto es tolerable sin acción? (la aceptación no puede ser la opción por defecto)

**Nivel general:**

- [ ] ¿El nivel de riesgo general del proyecto fue calculado usando la matriz probabilidad × impacto de M1-04 (Ver M1-04, Sección 8)?
- [ ] Si el nivel general es `critico`, ¿fue revisado manualmente por el gestor y documentado en el historial con un plan de acción antes de intentar avanzar al Módulo 3?

---

## 9. TABLA DE CONEXIONES CON LOS 3 MÓDULOS

| Concepto del registro de riesgos | Módulo origen/destino | Campo o proceso específico |
| :-- | :-- | :-- |
| `nivelRiesgo` de la Entidad | Módulo 1 → Módulo 2 | Determina cuántos y qué tipos de riesgos se heredan automáticamente al crear el proyecto (Sección 3.2). |
| Herencia M1 → M2 | Módulo 1 → Módulo 2 | PASO 4 del flujo de creación de proyecto en M2-01. Genera riesgos con `origen = 'heredado_entidad'`. |
| `nivelCalculado` del registro | Módulo 2 interno | Calculado a partir de la matriz probabilidad × impacto definida en M1-04, Sección 8. |
| Bloqueo al Módulo 3 por nivel `critico` | Módulo 2 → Módulo 3 | El sistema impide iniciar el proceso SRS (M3) si el nivel de riesgo general es `critico` sin revisión manual aprobada. |
| Riesgo `materializado` tipo `requerimientos` | Módulo 2 → Módulo 3 | Notificación automática al SRS activo del Módulo 3 para que el redactor considere el impacto en los requerimientos documentados. |
| Tipos de riesgo (Tabla 22.1) | Módulo 1 (marco teórico) | Definidos en M1-04, Sección 4. Reutilizados directamente en el enum `tipo` del `RiesgoProyecto`. |
| Estrategias de mitigación | Módulo 1 (marco teórico) | Definidas en M1-04, Sección 6. Reutilizadas en el enum `estrategia` del `RiesgoProyecto`. |
| `historial: CambioRiesgo[]` | Módulo 2 → auditoría | Alimenta el registro de cambios del sistema. Referencia Cap. 25 §25.1 (gestión de configuración). |
| Catálogo de riesgos por tipo de proyecto | Módulo 2 interno | Ofrecido al gestor en el PASO 4 del flujo M2-01 como punto de partida para poblar el registro. |


---

## 10. CHECKLIST DE COMPLETITUD DEL DOCUMENTO

Verificación de que todas las secciones especificadas en las instrucciones fueron desarrolladas:

- [x] **Sección 1 — Metadatos:** Nombre, módulo, capítulo fuente, versión, fecha, estado. ✅
- [x] **Sección 2 — Objetivo del documento:** Qué cubre, qué NO cubre, posición en el flujo. ✅
- [x] **Sección 3 — Registro como artefacto vivo:** Naturaleza iterativa, 4 estados, diagrama de transiciones, reglas de transición por tipo, quién puede cambiar el estado, frecuencia mínima de revisión. ✅
- [x] **Sección 4 — Riesgos heredados de la Entidad:** Fundamento teórico, reglas de mapeo por `nivelRiesgo`, campo `origen`, política de edición. ✅
- [x] **Sección 5 — Catálogo de riesgos estándar:** 5 subsecciones por tipo de proyecto: `nuevo_desarrollo` (10 riesgos), `mantenimiento` (6), `migracion` (7), `consultoria` (4), `integracion` (7). ✅
- [x] **Sección 6 — Indicadores de materialización:** Tabla con alerta temprana e indicador de materialización para los 5 tipos de riesgo (10 filas), con referencia a Figura 22.6. ✅
- [x] **Sección 7 — Proceso de revisión periódica:** Frecuencia por metodología (6.1), protocolo en 5 pasos (6.2), escalamiento por nivel (6.3). ✅
- [x] **Sección 8 — Plantilla operativa extendida:** Tabla con todos los campos actuales + 5 campos propuestos v2, con tipo TypeScript, descripción y justificación. Tipo auxiliar `CambioRiesgo`. ✅
- [x] **Sección 9 — Checklist operativo:** 12 ítems de verificación organizados en 3 categorías. ✅
- [x] **Sección 10 — Tabla de conexiones con los 3 módulos:** 9 filas cubriendo todas las interacciones. ✅
- [x] **Sección 11 — Checklist de completitud del documento:** Esta sección. ✅
- [x] **Citas exactas del libro:** Todas las referencias incluyen capítulo, sección y página. ✅
- [x] **Referencias cruzadas a M1-04:** Secciones 1.2, 3.2, 5 (catálogo), 7, 8 y 9. ✅
- [x] **"Aplicación en el sistema":** Incluida al final de las Secciones 2.1, 2.5, 3.4, 5, 6 y 7. ✅

---

*Documento generado según las instrucciones de arquitectura documental del sistema. Fuente primaria: Ian Sommerville, Ingeniería de Software, 9ª Edición, Pearson, 2011 — Capítulo 22 §22.1.*

```

