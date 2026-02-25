# HOJA DE RUTA — austranet-cco

## Sprints de Desarrollo hasta Módulo 2


***

## Contexto del proyecto al día de hoy

```
Estado actual:
✅ Scaffolding base creado (Next.js 14, TypeScript strict)
✅ 25+ componentes UI copiados de CCOWORKS
✅ Auth flow completo (Firebase Auth)
✅ Layout dashboard (Sidebar, Header, AuthGuard)
✅ Stores base (useAuthStore, useUIStore)
✅ Tipos base completos (src/types/index.ts)
✅ Constantes y rutas (src/constants/index.ts)
✅ Servicios STUB creados (entidades, proyectos, alcance)
✅ Hooks STUB creados
✅ 13 páginas placeholder
✅ UI/UX base mejorada (EmptyState, PageHeader, Dashboard)
✅ Firebase conectado y funcionando
✅ GitHub repositorio conectado y commiteado

Documentación disponible en /docs:
✅ 00-indice-general.md
✅ 01-modelos-proceso-software.md
✅ 02-metodologias-agiles.md
✅ M1-01 al M1-07 (Módulo 1 completo)
✅ M2-01 al M2-05 (Módulo 2 completo)
🔜 M3-01 al M3-06 (pendientes — se crean en próxima sesión)
```


***

## Estructura de carpetas /docs

```
Indicarle a Claude que distribuya así:

C:\Austranet\austranet-cco\docs\
│
├── 00-indice-general.md
│
├── fundamentos/
│   ├── 01-modelos-proceso-software.md
│   └── 02-metodologias-agiles.md
│
├── modulo-1-entidades/
│   ├── M1-01-identificacion-stakeholders.md
│   ├── M1-02-sistemas-sociotecnicos.md
│   ├── M1-03-glosario-dominio.md
│   ├── M1-04-evaluacion-factibilidad.md
│   ├── M1-05-confiabilidad-seguridad-entidades.md
│   ├── M1-06-control-configuracion-perfiles.md
│   └── M1-07-calidad-kpis-entidades.md
│
├── modulo-2-proyectos/
│   ├── M2-01-inicio-proyecto-planificacion.md
│   ├── M2-02-estimacion-costos.md
│   ├── M2-03-registro-riesgos-proyecto.md
│   ├── M2-04-seguimiento-control-proyecto.md
│   └── M2-05-calidad-proceso-proyecto.md
│
└── modulo-3-alcance/ ← (pendiente próxima sesión)
    ├── M3-01-ingenieria-requerimientos.md
    ├── M3-02-tecnicas-recopilacion.md
    ├── M3-03-modelado-requerimientos.md
    ├── M3-04-especificacion-srs.md
    ├── M3-05-validacion-requerimientos.md
    └── M3-06-calidad-kpis-srs.md
```


***

## SPRINTS DE DESARROLLO


***

### 🏁 SPRINT 0 — Organización y base (1 sesión)

**Objetivo:** Dejar el proyecto listo para desarrollar.

```
Tareas:
1. Crear estructura de carpetas /docs y distribuir
   los archivos .md en sus carpetas correspondientes
2. Verificar que npm run dev funciona sin errores
3. Verificar conexión Firebase (Auth + Firestore)
4. Hacer commit: "docs: estructura de documentación completa"
```

**Entregable:** Proyecto organizado, documentado, funcionando.

***

### 🏗️ SPRINT 1 — Módulo 1: CRUD Entidades (2-3 sesiones)

**Objetivo:** Módulo 1 completamente funcional con Firebase.

**Documentos de referencia:**

```
- docs/modulo-1-entidades/M1-01-identificacion-stakeholders.md
  → Define el tipo Stakeholder y sus campos
- docs/modulo-1-entidades/M1-04-evaluacion-factibilidad.md
  → Define nivelRiesgo y su lógica de cálculo
- docs/modulo-1-entidades/M1-07-calidad-kpis-entidades.md
  → Define los 3 niveles de completitud del perfil
- src/types/index.ts → Tipos Entidad y Stakeholder
- src/constants/index.ts → ESTADO_ENTIDAD_CONFIG
```

**Tareas ordenadas:**

```
SPRINT 1A — Servicio y store:
1. Implementar entidades.service.ts completo:
   - getAll(), getById(), create(), update(), delete()
   - Colección Firestore: 'entidades'
   - Reglas de Firestore para la colección

2. Implementar useEntidades.ts hook completo:
   - useEntidades() → lista con filtros
   - useEntidad(id) → detalle
   - useCreateEntidad() → mutación
   - useUpdateEntidad() → mutación
   - useDeleteEntidad() → mutación con confirmación

3. Implementar useEntidadStore.ts:
   - entidad seleccionada
   - filtros activos
   - estado de carga y error

SPRINT 1B — Listado de entidades:
4. Página /entidades:
   - Tabla con TanStack Table (ya instalado)
   - Columnas: razonSocial, tipo, sector, estado,
     nivelRiesgo, fechaCreación, acciones
   - Filtros: por tipo, estado, sector, búsqueda por nombre
   - Badge de estado con colores de ESTADO_ENTIDAD_CONFIG
   - Badge de nivelRiesgo con colores de NIVEL_RIESGO_CONFIG
   - Botón "Nueva entidad" funcional

SPRINT 1C — Formulario crear/editar:
5. Página /entidades/nueva y /entidades/[id]/editar:
   - Formulario multi-paso (wizard de 3 pasos):
     Paso 1: Datos básicos (razonSocial, rut, tipo, sector,
             pais, ciudad, sitioWeb, nombreComercial)
     Paso 2: Stakeholders (lista dinámica, agregar/quitar,
             campos del tipo Stakeholder completos,
             matriz influencia/interés visual)
     Paso 3: Evaluación (nivelRiesgo calculado según M1-04,
             tieneNDA + fechaNDA, notas)
   - Validación con Zod (usar entidad.schema.ts)
   - Indicador de nivel de completitud (NIVEL MÍNIMO /
     ESTÁNDAR / COMPLETO según M1-07 Sección 9)

SPRINT 1D — Detalle de entidad:
6. Página /entidades/[id]:
   - Header con razonSocial + estado + nivelRiesgo
   - Tabs: Información | Stakeholders | Proyectos | Historial
   - Tab Información: todos los campos de la entidad
   - Tab Stakeholders: tabla con matriz influencia/interés
   - Tab Proyectos: lista de proyectos vinculados (solo vista)
   - Tab Historial: log de cambios (M1-06 control de config.)
   - Botones: Editar, Cambiar estado, Ver proyectos
```

**Entregable:** CRUD completo de entidades en Firebase.
**Commit:** "feat(M1): módulo entidades completo con Firebase"

***

### 🏗️ SPRINT 2 — Módulo 1: Glosario y Factibilidad (1-2 sesiones)

**Objetivo:** Completar el Módulo 1 con glosario y evaluación.

**Documentos de referencia:**

```
- docs/modulo-1-entidades/M1-03-glosario-dominio.md
  → Plantilla de entrada del glosario (Sección 8)
- docs/modulo-1-entidades/M1-04-evaluacion-factibilidad.md
  → Formulario de factibilidad (Sección 6)
  → Matriz de riesgo operativa (Sección 8)
- docs/modulo-1-entidades/M1-07-calidad-kpis-entidades.md
  → KPIs de calidad de datos (Sección 7.1)
```

**Tareas:**

```
1. Subcolección Firestore 'entidades/{id}/glosario':
   - Servicio CRUD para entradas del glosario
   - Campos según M1-03 Sección 8:
     término, definición, sinónimos, términoTécnico,
     fuente, fechaValidacion, contexto, advertencia
   - Componente GlosarioManager dentro del detalle
     de entidad (nueva tab o sección expandible)

2. Formulario de Evaluación de Factibilidad:
   - Componente FactibilidadForm dentro del Paso 3
     del formulario de entidad
   - Preguntas según M1-04 Sección 6 (tabla completa)
   - Cálculo automático de nivelRiesgo resultado
   - Visual: semáforo de riesgo (verde/amarillo/naranja/rojo)

3. Panel de KPIs de la entidad:
   - Componente EntidadKPIs en el detalle de entidad
   - KPIs según M1-07 Sección 7.1:
     * Completitud del perfil (% barra de progreso)
     * Stakeholders de influencia alta registrados
     * Vigencia del NDA
     * Términos en el glosario
   - Indicador visual de nivel: MÍNIMO / ESTÁNDAR / COMPLETO
   - Este indicador determina si la entidad puede tener
     proyectos activos (validación en Sprint 3)
```

**Entregable:** Módulo 1 completo al 100%.
**Commit:** "feat(M1): glosario, factibilidad y KPIs completos"

***

### 🏗️ SPRINT 3 — Módulo 2: CRUD Proyectos (2-3 sesiones)

**Objetivo:** Módulo 2 con creación de proyectos funcional.

**Documentos de referencia:**

```
- docs/modulo-2-proyectos/M2-01-inicio-proyecto-planificacion.md
  → Flujo de 7 pasos de creación (Sección 9)
  → Plantilla de hitos (Sección 10)
  → Tabla de roles del equipo (Sección 6.3)
- docs/fundamentos/02-metodologias-agiles.md
  → Tabla Maestra de Metodologías (Sección 8)
- src/types/index.ts → tipos Proyecto, MiembroEquipo,
  RiesgoProyecto, EstadoProyecto
- src/constants/index.ts → ESTADO_PROYECTO_CONFIG
```

**Tareas:**

```
SPRINT 3A — Servicio y store:
1. Implementar proyectos.service.ts completo:
   - Colección Firestore: 'proyectos'
   - CRUD completo + getByEntidadId()
   - Validación: entidad debe estar en NIVEL ESTÁNDAR
     antes de crear proyecto (consulta a entidades service)

2. Implementar useProyectos.ts y useProyectoStore.ts

SPRINT 3B — Formulario wizard de creación (7 pasos M2-01):
3. Página /proyectos/nuevo — Wizard de 7 pasos:

   PASO 1 — Datos básicos:
   nombre, codigo (auto-generado sugerido), tipo,
   criticidad, clienteId (selector de entidades en
   NIVEL ESTÁNDAR o COMPLETO)

   PASO 2 — Metodología:
   Selector con la Tabla Maestra de Metodologías
   (02-metodologias-agiles.md Sección 8)
   Campo justificación obligatorio si criticidad
   es 'alta' o 'critica'
   Info card que muestra las características de la
   metodología seleccionada

   PASO 3 — Equipo:
   Lista dinámica de miembros (MiembroEquipo[])
   Selector de rol con tabla de roles de M2-01 §6.3
   Validación: mínimo 1 miembro con rol 'PM'
   Toggle esExterno para miembros externos

   PASO 4 — Riesgos iniciales:
   Pre-poblar automáticamente con riesgos heredados
   de la entidad según su nivelRiesgo (M2-03 Sección 4)
   + riesgos del catálogo estándar según tipo de
   proyecto (M2-03 Sección 5)
   Permitir agregar/quitar/editar riesgos
   Validación: mínimo 3 riesgos

   PASO 5 — Calendarización:
   fechaInicio (DatePicker)
   fechaFinEstimada (DatePicker, debe ser > fechaInicio)
   Lista dinámica de hitos con plantilla de M2-01 §10
   Hitos sugeridos según tipo de proyecto
   Validación: mínimo 3 hitos

   PASO 6 — Presupuesto:
   Selector de método de estimación
   (Tabla Maestra M2-02 Sección 7)
   Campos: estimacionMinima, estimacionNominal,
   estimacionMaxima, moneda, supuestos[], exclusiones[]
   Obligatorio si criticidad es 'alta' o 'critica'

   PASO 7 — Revisión y activación:
   Resumen de todos los pasos
   Checklist de validación visual (verde/rojo)
   Botón "Crear proyecto" → estado 'borrador'
   Botón "Crear y solicitar aprobación" →
   estado 'pendiente_aprobacion'

SPRINT 3C — Listado de proyectos:
4. Página /proyectos:
   - Tabla con filtros: estado, tipo, cliente, criticidad
   - Badge de estado con ESTADO_PROYECTO_CONFIG
   - Badge de criticidad
   - Columna "Cliente" vinculada a la entidad
   - Acciones: ver detalle, editar, cambiar estado

SPRINT 3D — Detalle de proyecto:
5. Página /proyectos/[id]:
   - Header: nombre + código + estado + criticidad
   - Tabs: Resumen | Equipo | Riesgos | Hitos |
           Presupuesto | Historial
   - Tab Resumen: datos generales + metodología +
     cliente vinculado con link al M1
   - Tab Equipo: tabla de miembros con roles
   - Tab Riesgos: tabla de riesgos con matriz visual
     (M2-03 Sección 8 — colores por nivel)
   - Tab Hitos: timeline o tabla con estados y fechas
   - Tab Presupuesto: estimación con rango min/nominal/max
   - Tab Historial: log de cambios de estado
```

**Entregable:** Módulo 2 CRUD completo con wizard de 7 pasos.
**Commit:** "feat(M2): módulo proyectos con wizard completo"

***

### 🏗️ SPRINT 4 — Módulo 2: Seguimiento y Control (1-2 sesiones)

**Objetivo:** Gestión del ciclo de vida del proyecto activo.

**Documentos de referencia:**

```
- docs/modulo-2-proyectos/M2-04-seguimiento-control-proyecto.md
  → Transiciones de estado (Sección 5)
  → KPIs de seguimiento (Sección 10)
  → Proceso de cierre (Sección 9)
- docs/modulo-2-proyectos/M2-03-registro-riesgos-proyecto.md
  → Indicadores de materialización (Sección 6)
  → Protocolo de revisión (Sección 7)
```

**Tareas:**

```
1. Sistema de transiciones de estado del proyecto:
   - Componente CambiarEstadoProyecto con modal
   - Validaciones por transición según M2-04 Sección 5.2
   - Registro automático de la transición en historial
   - Efectos en cascada según la tabla de transiciones

2. Panel de KPIs del proyecto activo:
   - Componente ProyectoKPIs en el detalle del proyecto
   - KPIs según M2-04 Sección 10:
     * Avance de hitos (% con barra de progreso)
     * Desviación de cronograma (días, color semáforo)
     * Riesgos materializados (contador con alerta)
     * Cambios procesados (contador)
   - Alertas visuales amarillas y rojas según umbrales

3. Gestión de riesgos en el proyecto activo:
   - Cambio de estado de riesgo con modal y
     justificación obligatoria
   - Indicadores de alerta temprana según M2-03 §6
   - Notificación visual cuando un riesgo pasa a
     'materializado'

4. Cierre del proyecto:
   - Modal de cierre por completitud con checklist
     según M2-04 Sección 9.1
   - Modal de cancelación con campos de causa
     según M2-04 Sección 9.2
   - Formulario de lecciones aprendidas (M2-04 §9.3)
     que actualiza el nivelRiesgo de la entidad en M1

5. Dashboard actualizado con datos reales:
   - KPI "Entidades registradas" → count de Firestore
   - KPI "Proyectos activos" → count estados activos
   - KPI "SRS en proceso" → preparado para M3
```

**Entregable:** Módulo 2 completo con seguimiento en tiempo real.
**Commit:** "feat(M2): seguimiento, control y cierre de proyectos"

***

### 🏗️ SPRINT 5 — Dashboard y UX global (1 sesión)

**Objetivo:** Dashboard ejecutivo con datos reales de M1 y M2.

```
1. Dashboard con datos reales de Firebase:
   - 3 KPI cards con contadores reales
   - Lista de proyectos activos recientes (5 últimos)
   - Lista de entidades con alertas de completitud
   - Proyectos con riesgos materializados (alertas)

2. Búsqueda global en el Header:
   - Buscar entidades y proyectos simultáneamente
   - Resultados con link directo al detalle

3. Notificaciones del sistema:
   - Badge en Header con alertas pendientes:
     * Hitos próximos a vencer (< 7 días)
     * Riesgos materializados sin acción
     * Proyectos con desviación > umbral amarillo
     * Entidades con NDA próximo a vencer

4. Página de configuración funcional:
   - Datos de la organización guardados en Firestore
   - Gestión básica de usuarios (solo admin)
```

**Entregable:** Sistema M1+M2 completamente funcional y presentable.
**Commit:** "feat: dashboard ejecutivo y notificaciones completas"

***

## Resumen de sprints

| Sprint | Módulo | Duración estimada | Resultado |
| :-- | :-- | :-- | :-- |
| Sprint 0 | Setup | 1 sesión corta | Proyecto organizado |
| Sprint 1 | M1 CRUD | 2-3 sesiones | Entidades en Firebase |
| Sprint 2 | M1 Completo | 1-2 sesiones | M1 al 100% |
| Sprint 3 | M2 CRUD | 2-3 sesiones | Proyectos con wizard |
| Sprint 4 | M2 Control | 1-2 sesiones | M2 al 100% |
| Sprint 5 | Dashboard | 1 sesión | Sistema presentable |

**Total estimado: 8-14 sesiones de Claude Code**

***