# Austranet CCO — Guía Completa para el Usuario
**¿Qué es este sistema y cómo usarlo?**
**Fecha:** 2026-02-27 | Versión: 0.1.0

---

## ¿QUÉ ES AUSTRANET CCO?

**Austranet CCO** es tu centro de control para gestionar proyectos de software de principio a fin.

Imagínalo como el "cuaderno de mando" digital de tu consultora: aquí registras a tus clientes, organizas tus proyectos, y defines con precisión qué debe construir tu equipo de desarrollo antes de escribir una sola línea de código.

### ¿Para qué sirve exactamente?

| Lo que haces hoy | Lo que Austranet CCO te permite hacer |
|-----------------|--------------------------------------|
| Hoja de cálculo con clientes | Fichas completas con análisis de riesgo y stakeholders |
| Email o Word para propuestas | Proyectos estructurados con metodología recomendada automáticamente |
| Requerimientos en un chat o Word | Especificación formal verificada, aprobada y trazable |
| Sin historial de cambios | Trazabilidad completa de quién cambió qué y cuándo |

---

## CÓMO INGRESAR AL SISTEMA

1. Abre tu navegador y ve a la dirección de Austranet CCO.
2. Ingresa tu **correo** y **contraseña** en la pantalla de login.
3. Serás llevado directamente al **Dashboard** (pantalla principal).

> **Si olvidas tu contraseña:** Contacta al administrador del sistema para que te la restablezca.

---

## LA PANTALLA PRINCIPAL (DASHBOARD)

Al ingresar, verás el Dashboard con un resumen de todo:

```
┌──────────────────────────────────────────────────────┐
│  📊 DASHBOARD                                        │
│                                                      │
│  [Entidades activas: 12]  [Proyectos activos: 5]     │
│  [SRS en proceso: 3]      [Notificaciones: 2]        │
│                                                      │
│  Semáforo de proyectos:                              │
│  🟢 En plazo: 3   🟡 En riesgo: 1   🔴 Atrasado: 1  │
│                                                      │
│  Hitos próximos esta semana...                       │
└──────────────────────────────────────────────────────┘
```

**El semáforo es automático:**
- 🟢 **Verde:** El proyecto va según lo planeado.
- 🟡 **Amarillo:** Hay hitos próximos a vencer o riesgos que atender.
- 🔴 **Rojo:** El proyecto tiene retrasos o riesgos materializados urgentes.

---

## MENÚ DE NAVEGACIÓN (BARRA LATERAL)

En el lado izquierdo de la pantalla encontrarás:

| Ícono | Sección | Para qué sirve |
|-------|---------|---------------|
| 🏠 | **Dashboard** | Resumen general y semáforo |
| 🏢 | **Entidades** | Clientes y proveedores |
| 📁 | **Proyectos** | Todos tus proyectos |
| 📄 | **Alcance / SRS** | Requerimientos de cada proyecto |
| ⚙️ | **Configuración** | Tu perfil y ajustes |
| 🔔 | **Notificaciones** | Alertas y avisos del sistema |

---

## MÓDULO 1 — ENTIDADES (Clientes y Proveedores)

### ¿Qué es una Entidad?

Una **entidad** es cualquier empresa u organización con la que trabajas: puede ser un **cliente**, un **proveedor**, o **ambos**.

Antes de crear un proyecto, necesitas tener registrada y bien completada la entidad del cliente.

---

### Cómo registrar una nueva Entidad

1. Ve al menú **Entidades** → clic en **"Nueva entidad"**
2. El formulario tiene **3 pasos:**

#### Paso 1 — Datos básicos
Completa los campos obligatorios (marcados con *):
- **Tipo de entidad:** Cliente / Proveedor / Ambos
- **Razón social:** Nombre legal de la empresa
- **Nombre comercial:** Cómo se conoce popularmente (opcional)
- **RUT:** En formato 12.345.678-9
- **Sector:** Elige el rubro de la empresa (salud, tecnología, construcción...)
- **País y ciudad**
- **Sitio web** (opcional)

> Haz clic en **"Siguiente"** cuando termines. El sistema validará los datos.

#### Paso 2 — Stakeholders
Los **stakeholders** son las personas clave de esa empresa que participarán en el proyecto.

Para cada stakeholder ingresa:
- Nombre y cargo
- Email de contacto
- Teléfono (opcional)
- **Rol:** usuario final, gerente de sistema, sponsor, responsable técnico...
- **Nivel de influencia:** Alto / Medio / Bajo
- **Nivel de interés:** Alto / Medio / Bajo
- Canal de comunicación preferido (Teams, email, reunión...)

> **Mínimo 1 stakeholder es obligatorio.** Para crear un proyecto, necesitarás al menos 2.

Puedes agregar más stakeholders con el botón **"Agregar stakeholder"**.

El sistema muestra automáticamente la **Matriz Influencia/Interés** para que visualices cómo gestionar a cada persona.

#### Paso 3 — Evaluación de Factibilidad (opcional pero importante)
Esta evaluación determina el **nivel de riesgo** de la entidad.

Responde 11 preguntas sobre la organización en 3 categorías:
- **Técnica:** ¿Tienen sistemas documentados? ¿Tienen experiencia con software?
- **Económica:** ¿Tienen presupuesto asignado? ¿Los decisores son accesibles?
- **Organizacional:** ¿Los stakeholders están disponibles? ¿Hay un sponsor ejecutivo?

Al final, también puedes indicar si la empresa tiene NDA firmado y agregar notas adicionales.

> Haz clic en **"Crear entidad"** para guardar.

---

### El Nivel de Completitud del Perfil

Después de crear una entidad, verás un indicador de qué tan completo está su perfil:

| Nivel | Qué significa | Qué falta |
|-------|--------------|-----------|
| **Mínimo** | Solo lo básico está registrado | Faltan stakeholders, factibilidad o glosario |
| **Estándar** | Suficiente para crear proyectos | Es el mínimo para activar un proyecto |
| **Completo** | Perfil óptimo | NDA, glosario completo, todos con canal |

> ⚠️ **No podrás crear un proyecto** hasta que la entidad esté en nivel **Estándar**.

---

### El Nivel de Riesgo

El sistema calcula automáticamente el riesgo de trabajar con esta entidad:

| Nivel | Qué significa |
|-------|--------------|
| 🟢 Bajo | Empresa con buen perfil organizacional |
| 🟡 Medio | Algunas áreas de mejora identificadas |
| 🟠 Alto | Riesgos significativos a considerar |
| 🔴 Crítico | Alta probabilidad de problemas en el proyecto |

> El riesgo se actualiza automáticamente: **si un proyecto termina exitosamente**, el riesgo baja. **Si se cancela**, sube.

---

### Glosario de la Entidad

Cada entidad tiene su propio **diccionario de términos** específicos de su negocio. Por ejemplo: "Ficha clínica", "Orden de compra", "KPI operacional"...

Estos términos se usan después en el proceso de requerimientos para que el equipo técnico y el cliente hablen el mismo idioma.

Puedes agregar términos desde la pestaña **"Glosario"** dentro de la ficha de la entidad.

---

### Acciones disponibles sobre una Entidad

Desde la lista o desde el detalle de una entidad puedes:
- **Ver detalle** — Ver toda la información, historial, stakeholders y glosario
- **Editar** — Modificar cualquier dato
- **Cambiar estado** — Pasar de activo a observado, suspendido, etc. (requiere motivo)
- **Eliminar** — La entidad pasa a "inactivo" pero NO se borra (siempre es recuperable)

---

## MÓDULO 2 — PROYECTOS

### ¿Qué es un Proyecto en el sistema?

Un proyecto es el contrato de trabajo con un cliente. Aquí defines **qué vas a construir, con quién, en cuánto tiempo y con qué metodología.**

---

### Cómo crear un nuevo Proyecto

1. Ve al menú **Proyectos** → clic en **"Nuevo proyecto"**
2. El formulario tiene **7 pasos:**

#### Paso 1 — Identificación
- Nombre del proyecto
- Descripción
- Tipo: nuevo desarrollo / mantenimiento / migración / consultoría / integración
- **Criticidad:** baja / media / alta / crítica (afecta las reglas del proceso)

#### Paso 2 — Cliente y Proveedores
- Selecciona el **cliente** (debe estar en nivel Estándar o superior)
- Agrega proveedores si los hay (opcional)

#### Paso 3 — Equipo del Proyecto
Agrega los miembros del equipo:
- Nombre y rol dentro del proyecto
- Rol del cliente asignado a cada uno
- Si es un recurso externo o interno

#### Paso 4 — Metodología 🔑
Esta es la parte más importante. El sistema te **recomienda automáticamente** la metodología más adecuada.

Responde 7 preguntas:
1. ¿Cuál es la criticidad del proyecto?
2. ¿Cuántas personas hay en el equipo?
3. ¿El equipo está distribuido geográficamente?
4. ¿Requiere cumplir regulación externa?
5. ¿Qué tan estables son los requerimientos?
6. ¿El cliente puede participar en iteraciones?
7. ¿Tienes un contrato de precio fijo?

El sistema recomendará una metodología y mostrará la justificación. Puedes aceptarla o elegir otra.

**Metodologías disponibles:** Cascada · Incremental · Ágil Scrum · Ágil XP · RUP · Espiral · Híbrido

#### Paso 5 — Riesgos
Identifica los riesgos del proyecto:
- Descripción del riesgo
- Tipo: técnico / económico / organizacional / externo
- Probabilidad e impacto: bajo / medio / alto
- Estrategia: aceptar / mitigar / transferir / evitar
- Plan de mitigación
- Responsable de seguimiento

#### Paso 6 — Hitos
Define los hitos importantes del proyecto:
- Nombre del hito
- Descripción y entregable asociado
- Fecha estimada de entrega
- Responsable

#### Paso 7 — Presupuesto
Estima el costo del proyecto usando 3 escenarios:
- **Mínimo:** Si todo va perfectamente
- **Nominal:** Estimación realista
- **Máximo:** Si ocurren los riesgos identificados
- Moneda (CLP, USD, EUR)
- Supuestos y exclusiones del presupuesto

> Haz clic en **"Crear proyecto"** para guardar.

---

### Estados de un Proyecto

El proyecto avanza por estos estados:

```
📝 Borrador
    ↓  (revisión y aprobación interna)
⏳ Pendiente de Aprobación
    ↓  (aprobación formal)
🔵 Activo en Definición  ← Aquí se trabaja el SRS (Módulo 3)
    ↓  (Gate 2 aprobado en SRS)
🟢 Activo en Desarrollo
    ↓
⏸️ Pausado  ← Reversible
    ↓
✅ Completado   →  Requiere registro de lecciones aprendidas
❌ Cancelado    →  Requiere causa y explicación detallada
```

---

### El Semáforo de tu Proyecto

En la lista de proyectos verás un color junto a cada proyecto:
- 🟢 **Verde** — Todo marcha bien
- 🟡 **Amarillo** — Hay algo que atender esta semana
- 🔴 **Rojo** — El proyecto necesita atención urgente

---

### Acciones sobre un Proyecto

Desde el detalle del proyecto puedes:
- **Ver Equipo** — Gestión del equipo
- **Ver Riesgos** — Actualizar estado de riesgos (mitigado, materializado...)
- **Ver Hitos** — Marcar hitos como completados
- **Ver Presupuesto** — Consultar estimaciones
- **Ver Historial** — Ver todos los cambios con fecha y responsable
- **Configuración / CCB** — Gestionar solicitudes de cambio al proyecto
- **Ir al Alcance (SRS)** — Acceder al proceso de requerimientos

---

## MÓDULO 3 — ALCANCE Y REQUERIMIENTOS (SRS)

### ¿Qué es el SRS?

El **SRS (Software Requirements Specification)** es el documento formal que define **exactamente qué debe hacer el software** que vas a desarrollar.

Es el contrato técnico entre tú y el cliente: elimina ambigüedades y evita el retrabajo costoso.

---

### Las 8 Fases del Proceso SRS

El sistema te guía por 8 fases estructuradas. No puedes saltarte ninguna.

#### 🔵 Fase 1 — ¿El proyecto es viable? (Gate 1)

Antes de invertir tiempo en requerimientos, evalúas si el proyecto tiene sentido:

- **Viabilidad de Negocio:** ¿Genera valor real para el cliente?
- **Viabilidad Técnica:** ¿Es técnicamente realizable?
- **Viabilidad de Integración:** ¿Se puede integrar con los sistemas existentes?

**Decisión:**
- ✅ **GO** → Avanzas a la Fase 2
- ❌ **NO-GO** → El proceso se detiene y se revisa el proyecto

---

#### 🔵 Fase 2 — Recopilación de Requerimientos

Aquí capturas todo lo que el cliente necesita. Registras **sesiones de trabajo** (entrevistas, talleres) donde:
- Defines qué técnica usaste (entrevista, taller, observación...)
- Listas los participantes
- Registras los requerimientos que emergieron
- Identificas términos del glosario
- Documentas conflictos o contradicciones detectadas

**Los requerimientos se clasifican en:**
- **RF** (Requerimiento Funcional): Lo que el sistema debe hacer. Ej: "El sistema **debe** permitir al usuario iniciar sesión con email y contraseña."
- **RNF** (No Funcional): Cómo debe comportarse. Ej: "El sistema **debe** responder en menos de 2 segundos."
- **RD** (Dominio): Restricciones legales o del negocio. Ej: "Los datos deben cumplir con la Ley 19.628 de Protección de Datos."

**Priorización MoSCoW:**
- **Must Have** ← Obligatorio para que el sistema funcione
- **Should Have** ← Importante pero podría diferirse
- **Could Have** ← Deseable si hay tiempo y presupuesto
- **Won't Have** ← Fuera del alcance de esta versión

---

#### 🔵 Fase 3 — Prototipos

Creas prototipos para validar visualmente con el cliente **antes de desarrollar**:

- **Wireframe:** Boceto en papel (más rápido, menos costoso)
- **Mockup digital:** Diseño de pantallas sin código
- **Mago de Oz:** Simulación manual de funcionalidad
- **Prototipo funcional:** Versión interactiva real

Para cada prototipo registras qué requerimientos validaste y el resultado: ✅ aprobado / ❌ rechazado / ⚠️ requiere ajuste.

---

#### 🔵 Fase 4 — Diagramas y Modelos

Documentas gráficamente cómo funciona el sistema:
- **Modelo de Contexto** ← Siempre obligatorio
- Diagramas de flujo, casos de uso, secuencia...

---

#### 🔵 Fase 5 — Especificación Formal

Cada requerimiento queda formalmente redactado. El sistema te ayuda a escribirlos correctamente:

**Palabras que DEBES usar:**
- "El sistema **debe/deberá**..." → Requerimiento obligatorio
- "El sistema **debería**..." → Requerimiento recomendado
- "El sistema **podrá**..." → Requerimiento opcional

**Palabras que DEBES evitar** (el sistema te alerta):
- ❌ "El sistema debe ser **rápido**" → ¿Cuántos segundos exactamente?
- ❌ "El sistema debe ser **seguro**" → ¿Qué mecanismos de seguridad?
- ❌ "El sistema debe ser **fácil de usar**" → ¿Medido cómo?

---

#### 🔵 Fase 6 — Integración Documental

El sistema construye automáticamente la **Matriz de Trazabilidad**: muestra qué stakeholder pidió qué requerimiento y qué caso de prueba lo verifica.

---

#### 🔵 Fase 7 — Validación

El sistema verifica tu SRS contra un **checklist de 21 puntos** en 4 categorías:
- Completitud: ¿Está todo documentado?
- Consistencia: ¿Hay contradicciones?
- Verificabilidad: ¿Cada requerimiento es medible?
- Modificabilidad: ¿Tiene códigos únicos y trazabilidad?

Si hay observaciones, las registras y debes resolverlas antes de avanzar.

---

#### 🔵 Fase 8 — Aprobación Final (Gate 2)

El SRS se aprueba formalmente:
- El checklist completo debe estar en verde
- El SRS recibe versión **v1.0**
- El proyecto automáticamente pasa a estado **"Activo en Desarrollo"**
- A partir de aquí, cualquier cambio requiere una Solicitud de Cambio formal

---

### Cómo crear un Requerimiento

Dentro del SRS, en la Fase 2 o Fase 5, puedes crear requerimientos:

1. Haz clic en **"Nuevo requerimiento"**
2. Selecciona el tipo: RF / RNF / RD
3. El sistema genera automáticamente el código: RF-001, RF-002, RNF-001...
4. Escribe la descripción usando el vocabulario controlado
5. Define la prioridad MoSCoW
6. Escribe el criterio de aceptación (¿Cómo sabré que está bien hecho?)
7. Indica si es volátil (puede cambiar durante el desarrollo)

---

## NOTIFICACIONES 🔔

El sistema te avisa automáticamente cuando:
- Un proyecto cambia de estado
- Se aprueba o rechaza una solicitud de cambio
- Hay hitos que vencen esta semana
- Se materializa un riesgo
- Hay observaciones pendientes en tu SRS

Accede a todas tus notificaciones desde el ícono de campana o desde el menú **Notificaciones**.

---

## HISTORIAL Y AUDITORÍA

Cada entidad y proyecto tiene una pestaña **"Historial"** donde puedes ver:
- Quién hizo qué cambio
- Cuándo exactamente
- Qué valores tenía antes y después

**Esto nunca se borra.** El historial es permanente.

---

## PREGUNTAS FRECUENTES

**¿Puedo borrar una entidad o proyecto?**
No se borran de verdad. Pasan a estado "inactivo" o "cancelado" pero siempre están en el historial. Esto es intencional para mantener la trazabilidad completa.

**¿Por qué no me deja crear un proyecto?**
Posiblemente la entidad cliente no está en nivel "Estándar". Asegúrate de haber completado la evaluación de factibilidad y tener al menos 2 stakeholders con nivel de influencia definido.

**¿Por qué no avanza la Fase 2 del SRS?**
El Gate 1 debe haber sido aprobado (decisión GO). Si fue NO-GO, el SRS está cancelado y debes revisar el proyecto.

**¿Puedo cambiar los requerimientos después de que el SRS fue aprobado?**
Sí, pero requiere una **Solicitud de Cambio (SCR)** formal que pasa por el proceso de revisión del CCB. Cada cambio aprobado genera una nueva versión del SRS (v1.1, v1.2...).

**¿Quién puede ver mis proyectos?**
Todos los usuarios autenticados pueden ver la información. El administrador gestiona los accesos. Si necesitas acceso restringido, consulta con tu administrador.

**¿Cómo busco algo rápidamente?**
Usa la **búsqueda global** (ícono de lupa o Ctrl+K en tu teclado). Puedes buscar entidades, proyectos o requerimientos desde cualquier pantalla.

**¿El sistema se actualiza en tiempo real?**
Las notificaciones sí son en tiempo real. Los datos de listas y detalles se actualizan automáticamente con cachés de 2 minutos.

---

## RESUMEN VISUAL — EL FLUJO COMPLETO

```
1. REGISTRAS LA EMPRESA DEL CLIENTE (Módulo Entidades)
   └─ Datos básicos + stakeholders + evaluación de riesgo

2. CREAS EL PROYECTO (Módulo Proyectos)
   └─ El cliente debe estar en nivel ESTÁNDAR
   └─ 7 pasos: datos, equipo, metodología, riesgos, hitos, presupuesto

3. ACTIVAS EL PROYECTO
   └─ El sistema crea el SRS automáticamente

4. TRABAJAS EL SRS EN 8 FASES (Módulo Alcance)
   └─ Fase 1: ¿Es viable? (Gate 1 GO/NO-GO)
   └─ Fase 2-6: Recopilación, prototipos, diagramas, especificación formal
   └─ Fase 7: Validación con checklist
   └─ Fase 8: Aprobación formal v1.0 (Gate 2)

5. EL PROYECTO PASA A "EN DESARROLLO"
   └─ El equipo de desarrollo trabaja con el SRS aprobado
   └─ Cualquier cambio pasa por Solicitud de Cambio formal

6. CIERRAS EL PROYECTO
   └─ Registras lecciones aprendidas
   └─ El nivel de riesgo de la entidad mejora automáticamente
```

---

*Guía de usuario generada: 2026-02-27 | Austranet CCO v0.1.0*
*Para soporte técnico, contacta al administrador del sistema.*
