Sprint — Módulo 2: Integración de los 3 Archivos Faltantes
Sprint M2-INT · Integración de M2-06, M2-07 y M2-08 al Sistema
Objetivo: Integrar completamente los tres archivos nuevos del Módulo 2 — repositorio de configuración, metodología acordada y métricas de calidad del proceso — al sistema existente, extendiendo los tipos de datos, la lógica de negocio y la UI/flujos ya construidos para los archivos anteriores.

TAREA M2-INT-01 · Extensión del tipo Proyecto con campos de M2-07
Archivo fuente: M2-07-metodologia-desarrollo-acordada.md
Qué hacer:
Agregar al tipo Proyecto los nuevos campos que M2-07 define como requeridos para documentar el acuerdo de metodología:
metodologiaAcordada: enum cascada | incremental | rup | agil_scrum | agil_xp | hibrido
metodologiaJustificacion: string — razón operativa de la elección (no solo el nombre)
clienteConsentioMetodologia: boolean — consentimiento informado explícito del cliente (M1 Entidad.disponibilidadParaSprints)
inputsMetodologiaSnapshot: objeto con snapshot de los 7 campos decisorios al momento de elegir la metodología (criticidad, tamanoEquipo, distribuidoGeograficamente, requiereRegulacionExterna, estabilidadRequerimientos, clienteDisponibleParaIteraciones, tieneContratoFijo)
metodologiaVersion: number — número de versión del acuerdo (por si se renegocia durante el proyecto)
Criterio de salida: El tipo Proyecto en Firestore tiene estos campos. El formulario de M2-01 PASO 2 muestra los inputs actuales del proyecto antes de pedir la elección de metodología y bloquea el PASO 2 si PASO 1 está incompleto.

TAREA M2-INT-02 · Árbol de decisión de metodología como lógica del sistema
Archivo fuente: M2-07-metodologia-desarrollo-acordada.md — Sección 3.2
Qué hacer:
Implementar el árbol de decisión completo de M2-07 como función del sistema que recomienda (no impone) la metodología al gestor en PASO 2 de M2-01:
La función recibe los 7 campos del inputsMetodologiaSnapshot y devuelve la metodología recomendada + justificación textual
La UI debe mostrar la recomendación con badge visual (RECOMENDADO) antes de que el gestor elija
Si el gestor elige diferente a la recomendación, el campo metodologiaJustificacion se vuelve obligatorio (no puede guardar sin explicar por qué se desvía de la recomendación)
Los bloqueos del árbol son hard-blocks en el sistema: requiereRegulacionExterna=true + criticidad=alta bloquea ágil puro completamente
Criterio de salida: El formulario PASO 2 muestra la recomendación calculada dinámicamente. Los hard-blocks impiden guardar combinaciones inválidas.

TAREA M2-INT-03 · Efecto en cascada de la metodología sobre los demás módulos
Archivo fuente: M2-07-metodologia-desarrollo-acordada.md — Sección 2, párrafos de efectos en cascada
Qué hacer:
Conectar el campo Proyecto.metodologiaAcordada con todos los módulos que dependen de él:
M3-01 / tipo SRS: el campo SRS.tipoSRS debe derivarse automáticamente de la metodología: cascada/rup → completo, incremental → incremental, agil_scrum → epica, agil_xp → minimo
M2-02 Estimación: el método de estimación sugerido debe cambiar según metodología: cascada/rup → COCOMO II, agil → story_points, incremental → puntos_funcion
M2-05 Equipo: los roles obligatorios del equipo se filtran por metodología (Scrum requiere Product Owner y Scrum Master)
M2-04 Seguimiento: los KPIs activos por defecto cambian según metodología: agil → burndown + velocidad, cascada → avance_por_hito + CPI
M2-06 Entregas: la política de entregas se inicializa según metodología: cascada → entrega_final, incremental → por_incremento, agil → por_sprint
Criterio de salida: Al guardar metodologiaAcordada, el sistema actualiza automáticamente los campos derivados en los módulos afectados (o los pre-completa como sugerencia si ya existen valores).

TAREA M2-INT-04 · Nuevo estado pendiente_aprobacion habilitado por M2-07
Archivo fuente: M2-07-metodologia-desarrollo-acordada.md — Metadatos, campo "Estado del proyecto cubierto"
Qué hacer:
M2-07 es la condición necesaria para que un proyecto avance de borrador a pendiente_aprobacion. Implementar la validación de transición de estado:
La transición borrador → pendiente_aprobacion requiere: metodologiaAcordada registrada + clienteConsentioMetodologia = true + todos los campos de PASO 1 completos
Si la transición se intenta sin estos campos, el sistema muestra qué falta específicamente
Registrar evento en historial del proyecto: { tipo: 'metodologia_acordada', version: metodologiaVersion, metodologia: metodologiaAcordada, fecha: now }
Criterio de salida: La transición de estado funciona con la validación completa. El historial registra el evento.

TAREA M2-INT-05 · Repositorio de Configuración del Proyecto — tipo ConfiguracionProyecto
Archivo fuente: M2-06-repositorio-configuracion.md
Qué hacer:
Crear el tipo ConfiguracionProyecto en Firestore como elemento de configuración del proyecto, incluyendo:
proyectoId: FK a Proyecto
version: semantic versioning MAJOR.MINOR.PATCH
estado: enum borrador | revision | aprobado | archivado
itemsConfiguracion: array de ItemConfiguracion con campos id, nombre, tipo (codigo | documento | dato_configuracion | dependencia), version, responsable, estado
ccbComposicion: array de MiembroCCB (quién integra el CCB de este proyecto)
politicaEntregas: objeto derivado de metodologiaAcordada (ver M2-INT-03)
historialVersiones: array inmutable de cambios al repositorio
solicitudesCambio: array de SolicitudCambioRepositorio con flujo de 3 etapas (análisis → evaluación → implementación)
Criterio de salida: El tipo existe en Firestore. Se crea automáticamente cuando el proyecto pasa a pendiente_aprobacion.

TAREA M2-INT-06 · Panel CCB del Repositorio en la UI del Módulo 2
Archivo fuente: M2-06-repositorio-configuracion.md
Qué hacer:
Crear la pantalla/sección del CCB del repositorio dentro del dashboard del proyecto en M2:
Lista de ítems de configuración con su versión actual y estado
Formulario de Solicitud de Cambio al Repositorio (SolicitudCambioRepositorio) con los campos del formulario definido en M2-06
Vista del historial de versiones (inmutable, solo lectura)
Indicador de composición del CCB para el proyecto actual (diferenciado del CCB del SRS de M3-09)
Filtro por tipo de ítem (código / documentos / dependencias)
Criterio de salida: La pantalla existe, el formulario guarda en Firestore, el historial es visible y el CCB del repositorio está diferenciado del CCB del SRS.

TAREA M2-INT-07 · Métricas GQM y KPIs de proceso — tipo MetricaCalidadProceso
Archivo fuente: M2-08-metricas-calidad-proceso.md (basado en la referencia del sistema a CMMI/GQM)
Qué hacer:
Crear el tipo MetricaCalidadProceso y los KPIs de proceso del Módulo 2 como dashboard de salud del proceso por proyecto:
Implementar las métricas GQM definidas en M2-08 como campos calculados automáticamente a partir de datos ya existentes en el sistema
Conectar las métricas con los eventos del ciclo de vida del proyecto (transiciones de estado, entregas, cambios de metodología)
Crear widget de dashboard que muestre: densidad de defectos por sprint, velocidad de resolución de SCR, tasa de éxito de estimaciones (estimado vs. real en M2-02), tiempo promedio en cada estado del proyecto
Definir umbrales de alerta (verde / amarillo / rojo) para cada métrica con los valores de referencia de M2-08
Criterio de salida: El dashboard de métricas de proceso existe y se actualiza automáticamente con cada evento del proyecto.

TAREA M2-INT-08 · Tests de integración cruzada M2 ↔ M3
Qué hacer:
Verificar que los efectos en cascada de M2-07 no rompen flujos ya existentes en M3:
Test: al cambiar metodologiaAcordada de agil_scrum a cascada, el SRS.tipoSRS se actualiza correctamente
Test: un proyecto con metodologiaAcordada = cascada no puede activar Scrum ceremonies en M2-05
Test: el CCB del repositorio (M2-06) y el CCB del SRS (M3-09) son independientes — aprobar un cambio en uno no aprueba automáticamente en el otro
Test: la transición borrador → pendiente_aprobacion falla si clienteConsentioMetodologia = false
Criterio de salida: Los 4 tests pasan sin errores.
