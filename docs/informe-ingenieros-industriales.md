# Austranet CCO — Informe de Procesos, Gestión y Operaciones
**Audiencia:** Equipo de Ingeniería Industrial / Gestión de Procesos
**Fecha:** 2026-02-27
**Versión del sistema:** 0.1.0

---

## 1. DESCRIPCIÓN GENERAL DEL SISTEMA

**Austranet CCO (Centro de Control Operacional)** es una plataforma digital de gestión integral para consultoras de desarrollo de software. Su propósito es estandarizar, auditar y optimizar tres procesos críticos del negocio:

1. **Gestión de Entidades** — Registro, clasificación y análisis de riesgo de clientes y proveedores.
2. **Gestión de Proyectos** — Ciclo de vida completo desde la propuesta hasta el cierre, con selección de metodología basada en evidencia.
3. **Ingeniería de Requerimientos (SRS)** — Proceso formal de 8 fases para especificar, validar y aprobar los requerimientos de software antes del desarrollo.

### 1.1 Problema que Resuelve

Las consultoras de software enfrentan tres problemas recurrentes:

| Problema | Impacto | Cómo lo resuelve el sistema |
|----------|---------|---------------------------|
| Clientes sin evaluación formal de capacidad | Proyectos fallidos por capacidad operacional insuficiente | Evaluación de factibilidad en 11 dimensiones antes de activar un proyecto |
| Metodología elegida sin criterios objetivos | Costos y plazos desbordados | Árbol de decisión de 7 factores que recomienda metodología automáticamente |
| Requerimientos ambiguos o incompletos | Retrabajo del 30-40% en desarrollo | Proceso SRS de 8 fases con checklist de 21 ítems y 2 puntos de control formales |

---

## 2. MAPA DE PROCESOS DEL SISTEMA

### 2.1 Diagrama de Flujo General (Nivel 0)

```
┌─────────────────────────────────────────────────────────────────────┐
│                          AUSTRANET CCO                              │
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │   MÓDULO 1   │───▶│   MÓDULO 2   │───▶│      MÓDULO 3        │  │
│  │  ENTIDADES   │    │  PROYECTOS   │    │   ALCANCE / SRS      │  │
│  └──────────────┘    └──────────────┘    └──────────────────────┘  │
│       M1                   M2                      M3               │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │               CAPA TRANSVERSAL                              │   │
│  │  Usuarios │ Notificaciones │ Auditoría │ Dashboard │ Config │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Secuencia Operacional Obligatoria

El sistema impone una secuencia de activación con prerequisitos formales:

```
[REGISTRAR ENTIDAD]
       │
       ▼ Evaluación factibilidad → Nivel ESTÁNDAR mínimo requerido
[CREAR PROYECTO]
       │
       ▼ Proyecto → estado "activo_en_definición" → SRS se crea automáticamente
[INICIAR SRS]
       │
       ▼ Gate 1 (factibilidad técnica/negocio/integración) → DECISIÓN GO/NO-GO
[ADQUIRIR REQUERIMIENTOS] (8 fases)
       │
       ▼ Gate 2 (checklist formal 21 ítems) → APROBACIÓN FORMAL
[TRANSICIÓN A DESARROLLO]
```

---

## 3. MÓDULO 1 — GESTIÓN DE ENTIDADES (M1)

### 3.1 Propósito del Proceso

Mantener un registro estructurado de todas las organizaciones (clientes y proveedores) con las que trabaja la consultora, incluyendo una evaluación de capacidad organizacional que determina si la entidad está lista para iniciar un proyecto.

### 3.2 Flujo del Proceso M1

```
PASO 1: REGISTRO INICIAL
  ├── Datos básicos: razón social, RUT, sector, tipo, país
  ├── Mínimo 1 stakeholder identificado
  └── Estado inicial: "activo"

PASO 2: CLASIFICACIÓN DE RIESGO (Evaluación de Factibilidad)
  ├── 11 preguntas ponderadas en 3 dimensiones:
  │   ├── Técnica (40%): sistemas documentados, experiencia, infraestructura, procesos
  │   ├── Económica (35%): presupuesto asignado, decisores accesibles, operación continua
  │   └── Organizacional (25%): disponibilidad stakeholders, sponsor ejecutivo, gestión del cambio
  └── Resultado automático: bajo / medio / alto / crítico

PASO 3: NIVEL DE COMPLETITUD DEL PERFIL
  ├── Mínimo: campos básicos + 1 stakeholder
  ├── Estándar: Mínimo + ≥2 stakeholders con influencia + factibilidad + glosario ≥5 términos
  └── Completo: Estándar + NDA + glosario ≥10 + todos con canal comunicación + ≥2 stakeholders alto impacto
```

### 3.3 Estados de una Entidad

```
       activo ←────────────────────────────────────────┐
         │                                              │
         ▼                                              │
    [cambio manual por analista con motivo obligatorio] │
         │                                              │
    ┌────┴─────┐         ┌──────────┐                   │
    │observado │         │suspendido│                   │
    └──────────┘         └──────────┘                   │
         │                    │                         │
         └────────┬───────────┘                         │
                  ▼                                     │
              inactivo ───────────────────────────────►─┘
           (soft delete)       (reactivable)
```

### 3.4 Indicadores Clave de Gestión (KPIs M1)

| KPI | Descripción | Cálculo |
|-----|-------------|---------|
| **Nivel Completitud** | Qué tan completo está el perfil | Algoritmo ponderado: mínimo / estándar / completo |
| **Nivel Riesgo** | Riesgo operacional de la entidad | Suma de 11 factores ponderados (30/50/70 umbral) |
| **Stakeholders de Alto Impacto** | Cantidad con influencia = "alto" | Count filtrado |
| **Proyectos Activos** | Proyectos vinculados en ejecución | Query cruzada M2 |
| **Proyectos Completados** | Historial de éxito | Query cruzada M2 |

### 3.5 Glosario de Dominio

Cada entidad mantiene su propio glosario de términos del negocio. Estos términos se reutilizan en el SRS (M3) para garantizar vocabulario consistente entre cliente y equipo técnico.

### 3.6 Impacto de Proyectos en el Riesgo de la Entidad

El sistema actualiza automáticamente el nivel de riesgo de la entidad basado en resultados de proyectos:

```
Proyecto cerrado exitosamente → Riesgo de entidad DISMINUYE 1 nivel
Proyecto cancelado           → Riesgo de entidad AUMENTA 1 nivel
```

---

## 4. MÓDULO 2 — GESTIÓN DE PROYECTOS (M2)

### 4.1 Ciclo de Vida del Proyecto

```
BORRADOR
    │ (validar que entidad esté en nivel ESTÁNDAR)
    ▼
PENDIENTE DE APROBACIÓN
    │ (se crea repositorio de configuración CCB automáticamente)
    ▼
ACTIVO EN DEFINICIÓN
    │ (SRS se crea automáticamente en M3)
    ▼
ACTIVO EN DESARROLLO
    │ (solo tras Gate 2 aprobado en M3)
    ▼
PAUSADO ◄──────────────────────── (reversible desde cualquier estado activo)
    │
COMPLETADO ──── (cierre formal con lecciones aprendidas)
CANCELADO  ──── (causa tipificada + impacto en riesgo entidad)
```

### 4.2 Prerequisito: Entidad en Nivel ESTÁNDAR

Antes de crear un proyecto, el sistema valida que la entidad cliente tenga:
- ≥2 stakeholders con nivel de influencia definido
- Evaluación de factibilidad completada
- Glosario con ≥5 términos

Esto garantiza que el cliente tiene suficiente madurez organizacional para iniciar un proyecto.

### 4.3 Proceso de Creación (7 Pasos)

| Paso | Contenido | Decisiones Clave |
|------|-----------|-----------------|
| 1 | Identificación | Nombre, tipo de proyecto, criticidad |
| 2 | Cliente y proveedores | Vinculación a entidades registradas |
| 3 | Equipo del proyecto | Roles internos y externos |
| 4 | Selección de metodología | Árbol de decisión automático (7 factores) |
| 5 | Gestión de riesgos | Tipificación y estrategias de mitigación |
| 6 | Hitos y cronograma | Fechas estimadas por entregable |
| 7 | Presupuesto | Estimación PERT (mínimo/nominal/máximo) |

### 4.4 Árbol de Decisión de Metodología

El sistema recomienda la metodología basándose en 7 factores objetivos:

| Factor | Opciones |
|--------|---------|
| Criticidad del proyecto | baja / media / alta / crítica |
| Tamaño del equipo | número |
| Equipo distribuido geográficamente | sí / no |
| Requiere regulación externa | sí / no |
| Estabilidad de requerimientos | estable / parcial / inestable |
| Cliente disponible para iteraciones | sí / no |
| Tiene contrato de precio fijo | sí / no |

**Salidas posibles:** cascada · incremental · ágil Scrum · ágil XP · RUP · espiral · híbrido

La metodología elegida determina:
- El tipo de SRS que se creará en M3 (completo / incremental / épica)
- Las fases activas del proceso de requerimientos

### 4.5 Gestión de Riesgos

El sistema tipifica los riesgos por categoría y permite un workflow de gestión:

```
Riesgo identificado (activo)
         │
   ┌─────┴──────┐
   ▼            ▼
mitigado     materializado
                  │
              controlado
```

### 4.6 Repositorio de Configuración (CCB — M2-06)

Cuando el proyecto pasa a "pendiente de aprobación", el sistema crea automáticamente un repositorio de configuración para gestionar solicitudes de cambio (SCR) a través de un Comité de Control de Cambios (CCB).

Estados de un SCR de proyecto:
```
propuesta → en_análisis → evaluada_CCB → {aprobada / rechazada / diferida} → implementada
```

### 4.7 Semáforo de Salud del Proyecto

Cada proyecto tiene un indicador visual de salud (verde/amarillo/rojo) calculado automáticamente:

| Color | Condición |
|-------|-----------|
| 🔴 Rojo | Hitos vencidos + riesgos materializados + fecha fin retrasada sobre umbral |
| 🟡 Amarillo | Hitos próximos a vencer (< 7 días) + riesgos de alta probabilidad |
| 🟢 Verde | Todo dentro del plan |

Los umbrales son configurables por el administrador del sistema.

### 4.8 KPIs del Dashboard M2

| KPI | Descripción |
|-----|-------------|
| Proyectos activos | Total en estados activos |
| Distribución por estado | Borrador / Definición / Desarrollo / Pausado |
| Proyectos por metodología | Ágil vs. Cascada vs. Híbrido |
| Tasa de éxito | Completados / Total histórico |
| Deuda de riesgo | Promedio de riesgos activos no mitigados |

---

## 5. MÓDULO 3 — INGENIERÍA DE REQUERIMIENTOS / SRS (M3)

### 5.1 Fundamento Metodológico

El proceso M3 está basado en el estándar IEEE 830 y los principios de Sommerville (Ingeniería del Software, 10.ª edición). El objetivo es producir un **Documento de Especificación de Requerimientos de Software (SRS)** que sea:

- **Completo:** todos los requerimientos documentados
- **Consistente:** sin contradicciones entre requerimientos
- **Verificable:** cada requerimiento tiene criterio de aceptación medible
- **Modificable:** código único, trazabilidad completa

### 5.2 Las 8 Fases del Proceso SRS

#### FASE 1 — Evaluación de Factibilidad (Gate 1)

Antes de invertir en la adquisición de requerimientos, se evalúa si el proyecto es viable en 3 dimensiones:

| Dimensión | Criterios |
|-----------|-----------|
| **Negocio** | Valor estratégico, beneficio esperado, prioridad organizacional |
| **Técnica** | Complejidad tecnológica, madurez de la solución propuesta |
| **Integración** | Dependencias con otros sistemas, estabilidad de interfaces |

**GATE 1 — DECISIÓN:**
- **GO:** Las 3 dimensiones son "viable" → Avanza a Fase 2
- **NO-GO:** Al menos 1 dimensión es "no_viable" → SRS se cancela, proyecto se revisa

#### FASE 2 — Adquisición de Requerimientos

Captura sistemática de necesidades usando 7 técnicas reconocidas:

| Técnica | Cuándo usar | Descubre conocimiento tácito |
|---------|-------------|------------------------------|
| Entrevista Abierta | Exploración inicial | ✅ Sí |
| Entrevista Cerrada | Validación de hipótesis | ❌ No |
| Entrevista Mixta | Equilibrio eficiencia/descubrimiento | ✅ Parcial |
| Etnografía | Procesos complejos/implícitos | ✅ Máximo |
| Taller JAD | Múltiples stakeholders | ✅ Sí |
| Escenarios/Historias | Usuarios finales | ✅ Sí |
| Casos de Uso | Sistemas complejos | ✅ Sí |

Cada sesión de entrevista se registra con: fecha, participantes, técnicas usadas, requerimientos emergentes, términos del glosario identificados, conflictos detectados.

#### FASE 3 — Prototipado y Validación Temprana

Validación visual antes de la especificación formal, con 4 niveles de fidelidad:

| Tipo | Fidelidad | Propósito |
|------|-----------|-----------|
| Wireframe en papel | Baja | Estructurar flujo general rápidamente |
| Mockup digital | Media | Validar interfaz con stakeholders |
| Mago de Oz | Media | Simular funcionalidad sin código |
| Prototipo funcional | Alta | Validar requerimientos técnicos complejos |

Resultado por prototipo: **aprobado / rechazado / requiere ajuste** (por requerimiento).

#### FASE 4 — Análisis y Modelado

Documentación gráfica de los requerimientos con artefactos UML/BPMN:

| Artefacto | Obligatoriedad |
|-----------|---------------|
| Modelo de Contexto | **SIEMPRE obligatorio** |
| BPMN | **Obligatorio si criticidad = alta o crítica** |
| Casos de Uso | Opcional |
| Diagrama de Actividad | Opcional |
| Diagrama de Secuencia | Opcional |
| Diagrama de Clases | Opcional |
| Diagrama de Estado | Opcional |

#### FASE 5 — Especificación Formal

Redacción de los requerimientos según estándares de calidad:

**Tipos de Requerimientos:**
- **RF (Funcional):** Lo que el sistema debe HACER
- **RNF (No Funcional):** Cómo debe comportarse (rendimiento, seguridad, usabilidad, disponibilidad, mantenibilidad, portabilidad)
- **RD (Dominio):** Restricciones del dominio del negocio (leyes, normativas, políticas)

**MoSCoW — Priorización:**
| Categoría | Significado | Acción |
|-----------|-------------|--------|
| **Must Have** | Imprescindible para el sistema mínimo | Siempre en el alcance |
| **Should Have** | Importante pero no crítico | En el alcance si el presupuesto lo permite |
| **Could Have** | Deseable si hay capacidad | Candidato a versión siguiente |
| **Won't Have** | Fuera del alcance actual | Documentado para no generar expectativas |

**Vocabulario Controlado:**
El sistema valida que los requerimientos funcionales usen:
- `debe / deberá` → Obligatorio (RFC 2119: SHALL)
- `debería` → Recomendado (SHOULD)
- `podrá` → Opcional (MAY)

**Detector de Ambigüedad:**
El sistema alerta si el texto contiene palabras vagas como: "adecuado", "flexible", "rápido", "suficiente", "algunos", "varios", "normalmente", etc. (17 palabras alerta configuradas).

#### FASE 6 — Integración Documental

- **Matriz de Trazabilidad:** Vincula Stakeholder → Requerimiento → Caso de Prueba
- **Glosario Unificado:** Términos del dominio consolidados desde entrevistas y glosario de la entidad

#### FASE 7 — Validación y Aprobación

Revisión sistemática con checklist de 21 ítems en 4 grupos:

| Grupo | Ítems | Ejemplos |
|-------|-------|---------|
| **Completitud (S)** | 8 | Todas las secciones, criterios Must-Have, RNF cuantificados |
| **Consistencia (C)** | 6 | Sin RF contradictorios, distribución MoSCoW válida |
| **Verificabilidad (V)** | 5 | Sin palabras alerta sin métricas, casos de prueba vinculados |
| **Modificabilidad (M)** | 4 | Códigos únicos, volatilidad documentada |

Las observaciones se registran y requieren resolución formal antes de Gate 2.

#### FASE 8 — Gate 2: Aprobación y Transición al Desarrollo

**GATE 2 — DECISIÓN FINAL:**
- Validación de todos los ítems del checklist
- Si se aprueba: versión SRS → `v1.0`, proyecto → `activo_en_desarrollo`
- Post-aprobación: gestión de cambios a través de SCR SRS (Solicitudes de Cambio post-aprobación)

### 5.3 Gestión de Cambios Post-Aprobación (M3-09)

Una vez aprobado el SRS, cualquier cambio requiere un proceso formal:

```
SCR PROPUESTO (descripción + requerimientos afectados)
         ↓
   EN ANÁLISIS (impacto técnico + económico)
         ↓
   EVALUADA CCB (Comité de Control de Cambios)
         ↓
    ┌────┴──────┐
    ▼           ▼
APROBADA    RECHAZADA
    │       DIFERIDA
    ▼
IMPLEMENTADA (nueva versión SRS: v1.1, v1.2...)
```

---

## 6. CAPA TRANSVERSAL — PROCESOS DE SOPORTE

### 6.1 T-01 — Gestión de Usuarios y Roles

| Rol | Permisos |
|-----|---------|
| **superadmin** | Acceso total + gestión del sistema |
| **admin** | Gestión de usuarios + todos los módulos |
| **gestor** | Crear/editar proyectos y entidades |
| **analista** | Operar SRS + requerimientos |
| **viewer** | Solo lectura |
| **tester** | Acceso a casos de prueba |

### 6.2 T-02 — Sistema de Notificaciones

El sistema genera notificaciones automáticas ante eventos críticos:
- Cambio de estado de proyecto
- Decisiones Gate 1 / Gate 2
- Nuevas observaciones de validación
- Riesgos materializados
- Hitos próximos a vencerse

### 6.3 T-03 — Auditoría y Trazabilidad Completa

**Todo queda registrado.** El sistema mantiene un registro inmutable (nunca editable, nunca borrable) de:

| Acción | Registro |
|--------|---------|
| Creación de entidad | Actor, timestamp, datos iniciales |
| Cambio de estado | Actor, estado anterior → nuevo, motivo obligatorio |
| Activación de proyecto | Actor, validaciones previas |
| Decisión Gate 1/2 | Decisor, fecha, criterios evaluados |
| Cambio de requerimiento | Actor, versión anterior, nueva versión |
| Solicitud de cambio CCB | Miembros presentes, resolución |

**Registro histórico por entidad/proyecto:** Cada documento tiene su propia subcolección de historial donde se registra cada cambio con usuario responsable, timestamp y valores antes/después.

### 6.4 T-04 — Búsqueda Global

Los usuarios pueden buscar entidades, proyectos y requerimientos desde cualquier punto del sistema usando la paleta de búsqueda global (Ctrl+K).

### 6.5 T-05 — Dashboard Ejecutivo

Panel centralizado con:
- Total de entidades activas / por nivel de riesgo
- Total de proyectos por estado
- Semáforo agregado de proyectos
- Requerimientos pendientes / aprobados
- Tasa de aprobación de SRS
- Timeline de hitos próximos

### 6.6 T-06 — Configuración del Sistema

Los administradores pueden configurar:
- Umbrales del semáforo (días de retraso para amarillo/rojo)
- Modo de mantenimiento (bloquea acceso a todos los usuarios)
- Parámetros por defecto de evaluación

---

## 7. GOVERNANCE Y CONTROL DE CALIDAD

### 7.1 Política de No-Eliminación

**Ningún dato crítico se borra jamás.** El sistema implementa "soft deletes":

| Entidad | Acción "borrar" | Efecto real |
|---------|-----------------|-------------|
| Entidad | Eliminar | Estado → `inactivo` (recuperable) |
| Proyecto | Cancelar | Estado → `cancelado` (recuperable con autorización) |
| Requerimiento | Rechazar | Estado → `rechazado` (historial preservado) |
| Términos glosario | Eliminar | Borrado físico (permitido, bajo riesgo) |
| Historial | — | Nunca eliminable ni modificable |
| Auditoría | — | Absolutamente inmutable |

### 7.2 Control de Cambios (SCR)

Existen dos niveles de control de cambios:
1. **SCR de Proyecto (M2-06):** Cambios al alcance, equipo, presupuesto del proyecto. Gestionado por CCB del proyecto.
2. **SCR de SRS (M3-09):** Cambios a requerimientos post-aprobación. Requiere nueva versión del SRS.

### 7.3 Prerequisitos Cruzados (Business Rules)

El sistema hace cumplir automáticamente estas reglas de negocio:

```
REGLA 1: No se puede crear un proyecto si la entidad no está en nivel ESTÁNDAR
REGLA 2: No se puede activar un proyecto si la entidad tiene estado "suspendido"
REGLA 3: No se puede avanzar el SRS más allá de Fase 1 sin Gate 1 aprobado
REGLA 4: No se puede pasar a "activo_en_desarrollo" sin Gate 2 aprobado
REGLA 5: Los cambios de estado siempre requieren motivo escrito
REGLA 6: El historial es inmutable (no editable ni eliminable)
REGLA 7: La cancelación de un proyecto aumenta el riesgo de la entidad cliente
REGLA 8: El cierre exitoso de un proyecto reduce el riesgo de la entidad cliente
```

---

## 8. MÉTRICAS DE EFICIENCIA DEL PROCESO

### 8.1 M1 — Entidades

| Métrica | Valor Objetivo | Medición |
|---------|---------------|---------|
| Completitud perfil | ≥ ESTÁNDAR antes de proyecto | Sistema valida automáticamente |
| Tiempo de registro inicial | < 15 minutos | Formulario 3 pasos guiado |
| Evaluación de factibilidad | 100% antes de primer proyecto | Prerequisito bloqueante |

### 8.2 M2 — Proyectos

| Métrica | Valor Objetivo | Medición |
|---------|---------------|---------|
| Tiempo ciclo borrador→activo | < 5 días hábiles | Timestamps automáticos |
| Proyectos en rojo semáforo | < 15% del total activo | Dashboard en tiempo real |
| Riesgos mitigados vs. totales | > 80% | KPI dashboard |
| Hitos cumplidos en fecha | > 75% | Tracking automático |

### 8.3 M3 — SRS

| Métrica | Valor Objetivo | Medición |
|---------|---------------|---------|
| Ítems checklist OK en Gate 2 | 100% | Sistema bloquea si < 100% |
| Ciclos de validación promedio | ≤ 3 | `contadorCiclosValidacion` en SRS |
| Requerimientos con caso de prueba | > 90% | Matriz de trazabilidad |
| Palabras ambiguas en SRS final | 0 | Detector automático |
| Tiempo Fase 1 → Gate 2 | Varía por metodología | Timestamps por fase |

---

## 9. INTEGRACIÓN CON PROCESOS EXTERNOS

### 9.1 Inputs al Sistema

| Fuente Externa | Datos | Módulo |
|---------------|-------|--------|
| CRM / Base de clientes | Datos básicos de entidades | M1 |
| Licitaciones / propuestas | Datos iniciales del proyecto | M2 |
| Entrevistas con clientes | Requerimientos capturados | M3 |
| Regulaciones sectoriales | RD (Requerimientos de Dominio) | M3 |

### 9.2 Outputs del Sistema

| Documento/Dato | Receptor | Módulo |
|----------------|---------|--------|
| Perfil de entidad | Equipo comercial, dirección | M1 |
| Metodología recomendada + justificación | Gerencia de proyectos | M2 |
| Plan de riesgos | PMO, equipo técnico | M2 |
| SRS v1.0 (formal) | Equipo de desarrollo | M3 |
| Matriz de trazabilidad | QA, testers | M3 |
| Casos de prueba | QA | M3 |
| Registro de auditoría | Gerencia, compliance | T-03 |

### 9.3 Integración Futura Recomendada

| Sistema | Integración | Beneficio |
|---------|------------|-----------|
| Jira / Azure DevOps | Export de requerimientos aprobados | Trazabilidad a tareas de desarrollo |
| DocuSign / Firma electrónica | NDA y contratos | Automatización legal |
| Microsoft Teams / Slack | Notificaciones | Comunicación en tiempo real |
| Power BI | Dashboard ejecutivo | Reportería avanzada |
| ERP / Contabilidad | Presupuesto de proyectos | Control financiero integrado |

---

## 10. ESCALABILIDAD DEL PROCESO

### 10.1 Escenarios de Escalado

| Escenario | Impacto | Preparación Actual |
|-----------|---------|-------------------|
| +50 entidades concurrentes | Alta carga en M1 | Firestore escala automáticamente |
| +20 proyectos simultáneos | Semáforo complejo | Dashboard recalculado en tiempo real |
| +5 SRS en paralelo | Múltiples procesos M3 | Cada SRS es independiente |
| Equipo de 50+ usuarios | Multi-tenant necesario | Arquitectura actual: single-tenant |
| Sucursales en otros países | Localización | Campos `pais` ya presentes; i18n pendiente |

### 10.2 Recomendaciones para Escalar la Operación

1. **Procesos paralelos:** El sistema permite múltiples proyectos y SRS en paralelo sin interferencia.
2. **Roles diferenciados:** Los analistas pueden gestionar M3 mientras los gestores manejan M2.
3. **Auditoría automática:** No requiere personal dedicado — todos los registros son automáticos.
4. **Configuración de umbrales:** Los thresholds del semáforo se adaptan al contexto de cada organización.
5. **Templates de riesgos:** Los tipos de riesgo tipificados permiten estandarizar la gestión en toda la organización.

---

*Informe generado: 2026-02-27 | Sistema: Austranet CCO v0.1.0*
