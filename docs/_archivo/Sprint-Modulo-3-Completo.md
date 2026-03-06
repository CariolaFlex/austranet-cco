Sprint — Módulo 3: Sistema Definitivo de Documentación de Alcance (8 Fases + 2 Gates)
Sprint M3-FULL · Integración Completa de los 10 Archivos en el Flujo de 8 Fases

Objetivo: Implementar el sistema completo de documentación de alcance como flujo operativo de 8 fases + 2 gates, utilizando íntegramente el contenido de los 10 archivos del Módulo 3 sin omitir ningún archivo ni sección. Cada archivo alimenta fases específicas. El resultado final es un SRS firmado que activa el desarrollo.

══════════════════════════════════════════════════════════════════
PRE-CONDICIONES: INFRAESTRUCTURA YA IMPLEMENTADA (NO REIMPLEMENTAR)
══════════════════════════════════════════════════════════════════

Los siguientes archivos ya están completamente implementados en la sesión de preparación
y NO deben ser modificados ni recreados — solo consumirlos:

TIPOS TypeScript (src/types/index.ts):
  ✅ EstadoSRS (con 'cancelado' para Gate 1 NoGo)
  ✅ EstadoRequerimiento, TipoRNFCategoria, TecnicaAdquisicion, TipoPrototipo
  ✅ TipoArtefactoModelo, ResultadoValidacionProto, TipoObservacionValidacion
  ✅ EstadoCasoPrueba, TipoCasoPrueba, EstadoSCRSRS, EstrategiaDespliegue
  ✅ ResultadoFactibilidad, EstadoGate1, RolStakeholderSRS
  ✅ MetricasRNF, StakeholderSRS, FactibilidadDimension, Factibilidad
  ✅ RiesgoSRS, SesionEntrevista, Escenario, Prototipo, IteracionBucle
  ✅ ArtefactoModelo, Subsistema, PanoramaArquitectonico, EntradaTrazabilidad
  ✅ ItemChecklistSRS, ObservacionValidacion, CasoPrueba, MiembroCCBSRS
  ✅ SolicitudCambioSRS, SeccionSRS, SeccionesSRS, TerminoDominioSRS
  ✅ SistemaAMigrar, PlanDespliegue, GrupoCapacitacion, PlanCapacitacion
  ✅ TiempoRespuestaSLA, PlanSLA, DistribucionMoSCoW
  ✅ SRS (interface principal con 8 fases + 2 gates)
  ✅ DTOs: CrearSRSDTO, CrearRequerimientoDTO, CrearCasoPruebaDTO,
          CrearSesionEntrevistaDTO, CrearEscenarioDTO, CrearTerminoDominioSRSDTO

CONSTANTES M3 (src/constants/alcance.ts):
  ✅ PALABRAS_ALERTA_SRS — ~50 palabras de alerta (M3-04 §4.1)
  ✅ VOCABULARIO_CONTROLADO_SRS — DEBE/DEBERÍA/PODRÁ/shall/should/may
  ✅ TECNICAS_ADQUISICION_CONFIG — 7 técnicas con flag descubreConocimientoTacito
  ✅ TIPOS_PROTOTIPO_CONFIG — 4 tipos con nivel de fidelidad
  ✅ TIPOS_ARTEFACTO_MODELO_CONFIG — 8 tipos con obligatoriedad
  ✅ CATEGORIAS_RNF_CONFIG — 7 categorías con prefijoCodigo + camposMetrica
  ✅ CHECKLIST_SRS_21_ITEMS — 21 ítems (S1-S8, C1-C6, V1-V5, M1-M4) con bloqueaSiIncumple
  ✅ ESTADO_SCR_SRS_CONFIG — estados + transiciones del SCR SRS
  ✅ ESTRATEGIAS_DESPLIEGUE_CONFIG — 4 estrategias con nivel de riesgo
  ✅ ROLES_CCB_SRS_CONFIG — roles + quién aprueba menor/mayor
  ✅ ROL_STAKEHOLDER_SRS_CONFIG — 7 roles del proceso IR
  ✅ COLECCIONES_M3 — nombres de colecciones Firestore
  ✅ ESTADO_SRS_FASES — qué fases habilita cada estado
  ✅ REGLAS_MOSCOW — umbrales de distribución MoSCoW

SERVICIO Firestore (src/services/alcance.service.ts):
  ✅ alcanceService.getSRSByProyecto(proyectoId)
  ✅ alcanceService.crearSRSInicial(proyectoId, metodologia) — TRIGGER M3
  ✅ alcanceService.updateSRS(id, data)
  ✅ alcanceService.updateEstadoSRS(id, estado)
  ✅ alcanceService.procesarGate1(srsId, decision, factibilidad, decisionPor)
  ✅ alcanceService.aprobarGate2(srsId, aprobadoPorId, aprobadoPorNombre)
  ✅ alcanceService.getRequerimientos(srsId) / createRequerimiento / updateRequerimiento / deleteRequerimiento
  ✅ alcanceService.getSesionesEntrevista(srsId) / createSesionEntrevista / updateSesionEntrevista
  ✅ alcanceService.getEscenarios(srsId) / createEscenario / updateEscenario
  ✅ alcanceService.getCasosPrueba(srsId) / createCasoPrueba / updateCasoPrueba
  ✅ alcanceService.getTerminosDominio(srsId) / createTerminoDominio / updateTerminoDominio
  ✅ alcanceService.agregarPrototipo / actualizarResultadoPrototipo
  ✅ alcanceService.agregarArtefactoModelo
  ✅ alcanceService.inicializarChecklist / actualizarItemChecklist
  ✅ alcanceService.agregarObservacion / resolverObservacion
  ✅ alcanceService.crearSCRSRS / avanzarSCRSRS
  ✅ alcanceService.registrarIteracionBucle

HOOKS TanStack Query (src/hooks/useAlcance.ts):
  ✅ useSRS, useActualizarSRS, useActualizarEstadoSRS
  ✅ useProcesarGate1, useAprobarGate2
  ✅ useRequerimientos, useCrearRequerimiento, useActualizarRequerimiento, useEliminarRequerimiento
  ✅ useSesionesEntrevista, useCrearSesionEntrevista, useActualizarSesionEntrevista
  ✅ useEscenarios, useCrearEscenario, useActualizarEscenario
  ✅ useCasosPrueba, useCrearCasoPrueba, useActualizarCasoPrueba
  ✅ useTerminosDominio, useCrearTerminoDominio, useActualizarTerminoDominio
  ✅ useAgregarPrototipo, useActualizarResultadoPrototipo
  ✅ useAgregarArtefactoModelo
  ✅ useInicializarChecklist, useActualizarItemChecklist
  ✅ useAgregarObservacion, useResolverObservacion
  ✅ useCrearSCRSRS, useAvanzarSCRSRS
  ✅ useRegistrarIteracionBucle

VALIDACIONES ZOD (src/lib/validations/alcance.schema.ts):
  ✅ crearRequerimientoSchema — con validaciones V1 (palabras alerta), V2 (vocab controlado),
     S3 (DADO/CUANDO/ENTONCES para Must), S4 (métricas RNF obligatorias)
  ✅ crearSesionEntrevistaSchema
  ✅ crearEscenarioSchema
  ✅ crearCasoPruebaSchema
  ✅ crearTerminoDominioSRSSchema
  ✅ crearPrototipoSchema
  ✅ crearArtefactoModeloSchema
  ✅ crearSCRSRSSchema
  ✅ factibilidadSchema, gate1Schema
  ✅ inicioSRSSchema — con bloqueo solo-entrevista-cerrada
  ✅ planDespliegueSchema, planSLASchema, observacionValidacionSchema

TRIGGER AUTOMÁTICO (src/services/proyectos.service.ts):
  ✅ Cuando proyecto pasa a 'activo_en_definicion' → alcanceService.crearSRSInicial() automático
  ✅ La página /proyectos/[proyectoId]/alcance/page.tsx es el punto de entrada del Módulo 3

CONSTANTES GLOBALES (src/constants/index.ts):
  ✅ ESTADO_SRS_CONFIG incluye 'cancelado' (color: red, Gate 1 NoGo)

══════════════════════════════════════════════════════════════════
ARQUITECTURA FIRESTORE — MÓDULO 3
══════════════════════════════════════════════════════════════════

Colecciones top-level (mismo patrón que M2-06 repositorios_configuracion):

  'srs'                   — 1 doc por proyecto (FK proyectoId único)
                            El doc SRS contiene arrays embebidos para:
                            - stakeholdersSRS, riesgosSRS, tecnicasActivas
                            - prototipos (<10 usualmente), iteracionesBucle (log inmutable)
                            - artefactosModelo, checklistValidacion, observacionesValidacion
                            - ccbSRS, solicitudesCambioSRS (post-aprobación)
                            - matrizTrazabilidad, secciones (IEEE 830 8 secciones)
                            - factibilidad, Gate1/Gate2 campos
                            - planDespliegue, planCapacitacion, planSLA

  'requerimientos'        — N docs por SRS (FK srsId + proyectoId)
                            RF-XXX | RNF-XXX | RD-XXX (código generado automáticamente)

  'sesiones_entrevista'   — N docs por SRS (FK srsId + proyectoId)
                            ENT-XXX (código generado automáticamente)

  'escenarios'            — N docs por SRS (FK srsId + proyectoId)
                            ESC-XXX (código generado automáticamente)

  'casos_prueba'          — N docs por SRS (FK srsId + proyectoId + requerimientoId)
                            CP-XXX (código generado automáticamente)

  'terminos_dominio_srs'  — N docs por SRS (FK srsId + proyectoId)

NOMBRES CORRECTOS DE CAMPOS (referencia rápida):
  ❌ activoendefinicion  → ✅ 'activo_en_definicion'  (EstadoProyecto)
  ❌ enadquisicion       → ✅ 'en_adquisicion'        (EstadoSRS)
  ❌ enmodelado          → ✅ 'en_modelado'           (EstadoSRS)
  ❌ enespecificacion    → ✅ 'en_especificacion'     (EstadoSRS)
  ❌ envalidacion        → ✅ 'en_validacion'         (EstadoSRS)
  ❌ conobservaciones    → ✅ 'con_observaciones'     (EstadoSRS)
  ❌ noiniciado          → ✅ 'no_iniciado'           (EstadoSRS)
  ❌ activoendesarrollo  → ✅ 'activo_en_desarrollo'  (EstadoProyecto)
  ❌ metodologiaAcordada → ✅ metodologia             (Proyecto.metodologia)

══════════════════════════════════════════════════════════════════
ORDEN DE IMPLEMENTACIÓN DE UI (dependencias entre tareas)
══════════════════════════════════════════════════════════════════

CAPA 0 (página base — src/app/(dashboard)/proyectos/[proyectoId]/alcance/page.tsx):
  Reemplazar el placeholder actual con la página principal del SRS.
  Debe: verificar que el proyecto existe y está en 'activo_en_definicion' o superior,
  usar useSRS(proyectoId) para obtener el SRS (ya creado por el trigger),
  mostrar el stepper de 8 fases según SRS.estado + ESTADO_SRS_FASES[estado].fasesHabilitadas.

CAPA 1 — Dependen solo del SRS (pueden implementarse en paralelo):
  F1-01, F1-02, F1-03, F1-04, F1-05 (Fase 1 — requiere SRS en estado 'no_iniciado')
  GATE 1 (requiere F1-04 completo)

CAPA 2 — Dependen de Gate 1 Go (SRS en 'en_adquisicion'):
  F2-01, F2-02, F2-03, F2-04, F2-05 (Fase 2)
  F3-01, F3-02 (Fase 3 — puede ser paralela a F2)

CAPA 3 — Depende de Fase 2 completa:
  F4-01 (OBLIGATORIO — bloquea F5 si no existe modelo_contexto)
  F4-02, F4-03, F4-04, F4-05 (opcionales según criticidad)

CAPA 4 — Depende de Fase 4 con modelo_contexto:
  F5-01 (editor SRS 8 secciones — base de toda la Fase 5)
  F5-02, F5-03, F5-04 (formalización — pueden ser paralelas)
  F5-05 (Matriz Trazabilidad — requiere RF aprobados de F5-02/03/04)
  F5-06 (Apéndice D — requiere Won't Have identificados de F2-05)

CAPA 5 — Depende de Fase 5 completa:
  F6-01, F6-02 (Planificación — lectura de M2-02, no bloquean F7)

CAPA 6 — Depende de secciones SRS completas:
  F7-01 (inicializa checklist → llama alcanceService.inicializarChecklist())
  F7-02 (depende de RF Must con criterioAceptacion de F5-02)
  F7-03 (CCB — puede configurarse antes)
  F7-04 (KPIs — puede ser paralelo)
  GATE 2 (requiere checklist completo + CP vinculados)

CAPA 7 — Solo después de Gate 2 aprobado (SRS.estado = 'aprobado'):
  F8-01, F8-02, F8-03, F8-04 (Fase 8 — transición al desarrollo)

══════════════════════════════════════════════════════════════════
FASE 1 — Inicio y Definición del Negocio
══════════════════════════════════════════════════════════════════
Archivos principales: M3-01 (marco fundacional), M3-08 (glosario del dominio), M3-01 §4.3 stakeholders

TAREA M3-F1-01 · Declaración del Problema y Objetivo del Negocio
Fuente: M3-01 Sección 1 — Objetivo del documento; conexión M1→M2→M3
Hook disponible: useActualizarSRS()
Schema: inicioSRSSchema (src/lib/validations/alcance.schema.ts)

Qué hacer:
Crear el formulario de "Inicio del SRS" en la página /proyectos/[proyectoId]/alcance:
- Campo declaracionProblema: textarea — "¿por qué existe el proyecto?" en lenguaje del negocio, no técnico
- Campo objetivosNegocio: lista de máximo 5 objetivos de negocio verificables del cliente
  (inicioSRSSchema.objetivosNegocio.max(5) ya lo valida)
- Campo sistemasExistentes: lista de sistemas actuales del cliente que interactúan con el proyecto
  (precarga del diagrama de contexto en Fase 4)
- Campo tecnicasActivas: checklist de técnicas (TECNICAS_ADQUISICION_CONFIG)
- Campo stakeholdersSRS: importar de M1-01 vinculados al proyecto y clasificar para IR
  (stakeholderSRSSchema ya definido en alcance.schema.ts)
Los datos de M1 (perfil de entidad, stakeholders) deben estar visibles en sidebar como contexto.
NOTA: inicioSRSSchema ya bloquea si solo se usa entrevista_cerrada (bloqueo M3-F2-01).
Validación: declaracionProblema no debe contener palabras de PALABRAS_ALERTA_SRS sin justificación.
Criterio de salida: Formulario guarda en SRS con useActualizarSRS(). El SRS pasa de 'no_iniciado'
a 'en_adquisicion' solo cuando Gate 1 retorna Go (F1-04 + GATE1 completos).

TAREA M3-F1-02 · Glosario del Dominio — Fase 1
Fuente: M3-08-requerimientos-dominio.md; M3-01 §2.2 Tipo 3
Hooks: useTerminosDominio(srsId), useCrearTerminoDominio(), useActualizarTerminoDominio()
Schema: crearTerminoDominioSRSSchema
Colección Firestore: 'terminos_dominio_srs'

Qué hacer:
El glosario del dominio es editable desde el inicio del SRS (no solo en M1-03):
- Importar automáticamente el Glosario de M1-03 al SRS en creación (origen = 'importado_m1')
- Habilitar adición de nuevos términos específicos del proyecto (origen = 'nuevo_proyecto')
- TerminoDominioSRS tiene: termino, definicionOperativa, fuenteRegulatoriaONorma,
  esRequerimientoDominio (boolean)
- Los términos con esRequerimientoDominio = true → llamar createRequerimiento con tipo = 'dominio'
  y estado = 'propuesto' automáticamente al guardar el término
Criterio de salida: Términos en colección 'terminos_dominio_srs'. Los términos con flag
generan Requerimiento RD-XXX con estado = 'propuesto' en colección 'requerimientos'.

TAREA M3-F1-03 · Identificación de Stakeholders para el SRS
Fuente: M3-01 §4.3 stakeholders en el proceso IR; M1-01 fuente de datos
Hook: useActualizarSRS() con data: { stakeholdersSRS: [...] }
Schema: stakeholderSRSSchema (sub-schema en alcance.schema.ts)

Qué hacer:
Crear la vista de "Stakeholders del SRS" que importa desde M1-01 y clasifica para IR:
- Importar todos los stakeholders de M1-01 vinculados al proyecto
- Clasificar por rolSRS: 'cliente_sponsor' | 'usuario_final' | 'gestor_proyecto' | 'arquitecto' |
  'regulador' | 'qa_tester' | 'analista_futuro' (ROL_STAKEHOLDER_SRS_CONFIG para labels)
- Si nivelInfluencia = 'alto' → esObligatorioTenerRF = true (genera alerta en F5-05 si no tiene RF)
- Agregar disponibleParaEntrevista + fechaDisponibilidad para planificar Fase 2
El campo SRS.stakeholdersSRS es el array embebido en el documento SRS (no colección separada).
Criterio de salida: SRS.stakeholdersSRS actualizado. Flags de obligatoriedad visibles.

TAREA M3-F1-04 · Estudio de Factibilidad — Inputs estructurados
Fuente: M3-01 §4 RNF organización; M2-01 tipo proyecto; M2-03 riesgos
Hook: useActualizarSRS() / después useProcesarGate1()
Schema: factibilidadSchema, gate1Schema (alcance.schema.ts)

Qué hacer:
Crear el formulario de "Estudio de Factibilidad" con tres dimensiones:
- Factibilidad de negocio: ¿resuelve el problema de F1-01? ¿ROI justificado?
- Factibilidad técnica: ¿el stack de M2-07 puede implementarlo? ¿dependencias críticas?
- Factibilidad de integración: ¿los sistemas de F1-01 permiten integración?
- Cada dimensión: resultado ('viable' | 'viable_con_restricciones' | 'no_viable') + justificacion
- factibilidadGlobal: calculado automáticamente — si cualquier dimensión = no_viable → no_viable
  (factibilidadSchema.refine() ya tiene esta validación)
Los 3 resultados se guardan en SRS.factibilidad.
Criterio de salida: Formulario completo. SRS.factibilidad guardado.

TAREA M3-F1-05 · Valoración Inicial de Riesgos del SRS
Fuente: M3-01 §4.3.2 riesgos proceso IR; M2-03 registro de riesgos
Hook: useActualizarSRS() con data: { riesgosSRS: [...] }

Qué hacer:
Crear la sección de "Riesgos del SRS" vinculada a M2-03:
- RiesgoSRS: tipo ('stakeholder_no_disponible' | 'dominio_complejo' | 'reqs_volatiles' |
  'alcance_indefinido' | 'conflicto_stakeholders'), probabilidad, impacto, mitigacion,
  registradoEnM203 (boolean), riesgoProyectoId (FK a M2-03 si se registró allí)
- Los riesgos con tipo = 'reqs_volatiles' se registran también en M2-03 como tipo = 'requerimientos'
- Mostrar alerta si hay más de 3 riesgos con probabilidad 'alta' antes de Gate 1
El array SRS.riesgosSRS es embebido en el documento SRS.
Criterio de salida: SRS.riesgosSRS actualizado. Vinculación a M2-03 opcional pero registrada.

──────────────────────────────────────────────────────────────────
🔒 GATE 1 — Decisión Go / No-Go
──────────────────────────────────────────────────────────────────

TAREA M3-GATE1 · Implementar Gate 1 como transición controlada
Fuente: M3-01 §5 ciclo de vida del SRS
Hook: useProcesarGate1() → alcanceService.procesarGate1(srsId, decision, factibilidad, decisionPor)
IMPORTANTE: procesarGate1 es idempotente y ya calcula el global automáticamente.

Qué hacer:
Implementar Gate 1 como pantalla de decisión formal (disponible cuando F1-04 está completo):
No-Go (factibilidadGlobal = no_viable):
- Pantalla "No-Go" con campos obligatorios: motivoCancelacion, alternativasConsideradas, firmaCancelacion
- procesarGate1 pone SRS.estado = 'cancelado' + gate1Estado = 'nogo'
- En proyectos.service: escuchar el cambio de estadoSRS para actualizar Proyecto.estado = 'cancelado'
- NOTA: la transición del Proyecto.estado debe hacerse como paso adicional desde el componente
  (llamar proyectosService.updateEstado después de procesarGate1)

Go (factibilidadGlobal = viable | viable_con_restricciones):
- Pantalla "Go" con resumen de restricciones + botón de confirmación
- procesarGate1 pone SRS.estado = 'en_adquisicion' + gate1Estado = 'go'
- Se habilitan las tareas de Fase 2

Criterio de salida: Gate 1 funciona. SRS.estado = 'cancelado' o 'en_adquisicion'.
El estado 'cancelado' en ESTADO_SRS_CONFIG ya tiene color = 'red', label = 'Cancelado (Gate 1)'.

══════════════════════════════════════════════════════════════════
FASE 2 — Descubrimiento y Adquisición de Requerimientos (SRS en 'en_adquisicion')
══════════════════════════════════════════════════════════════════
Archivos principales: M3-02-tecnicas-recopilacion.md (íntegro)

TAREA M3-F2-01 · Selección y registro de técnicas de adquisición
Fuente: M3-02 §4 (entrevistas), §5 (escenarios), §6 (CU), §7 (etnografía), §8 (JAD)
Hook: useActualizarSRS() con data: { tecnicasActivas: [...] }
Referencia: TECNICAS_ADQUISICION_CONFIG (src/constants/alcance.ts)

Qué hacer:
Panel de "Técnicas de Adquisición" en estado 'en_adquisicion':
- Checklist de técnicas disponibles — usar TECNICAS_ADQUISICION_CONFIG para labels/descripciones
- Por cada técnica marcada como activa → habilitar formulario de registro de sesiones
- BLOQUEO: si solo se selecciona 'entrevista_cerrada' (descubreConocimientoTacito = false
  para todas las activas) → mostrar error (inicioSRSSchema.refine() ya tiene esta validación)
- Contador de sesiones por técnica visible en el panel
El campo SRS.tecnicasActivas es el array de TecnicaAdquisicion embebido en el documento SRS.
Criterio de salida: Panel funcional. Bloqueo solo-entrevistas-cerradas activo.

TAREA M3-F2-02 · Registro completo de sesiones de entrevista
Fuente: M3-02 §4.5 — Plantilla de Entrevista completa
Hooks: useSesionesEntrevista(srsId), useCrearSesionEntrevista(), useActualizarSesionEntrevista()
Schema: crearSesionEntrevistaSchema
Colección Firestore: 'sesiones_entrevista'

Qué hacer:
Formulario de entrevista con todos los campos de la plantilla M3-02:
- entrevistaId (ENT-XXX, generado por alcanceService.createSesionEntrevista automáticamente)
- fecha, entrevistadoId (selector de stakeholders de M1-01 — no texto libre)
- entrevistador, objetivos, duracionMin, modalidad, grabacion
- tipoEntrevista ('abierta' | 'cerrada' | 'mixta')
- reqsEmergentes: lista de IDs de Requerimientos creados desde esta sesión
  (crear con useCrearRequerimiento + linkear el ID al campo reqsEmergentes de la sesión)
- terminosGlosario: nuevos términos → botón "Agregar a glosario M1" llama createTerminoDominio
- conflictosDetectados: si tiene texto → opción de crear riesgo en M2-03
- observaciones, proximaSesion
Los reqsEmergentes se guardan directamente como Requerimiento con estado = 'propuesto'.
Criterio de salida: Formulario con todos los campos. Requerimientos emergentes creados.

TAREA M3-F2-03 · Registro de escenarios e historias de usuario
Fuente: M3-02 §5 (Escenarios); M3-01 §3.4
Hooks: useEscenarios(srsId), useCrearEscenario(), useActualizarEscenario()
Schema: crearEscenarioSchema
Colección Firestore: 'escenarios'

Qué hacer:
Formulario de "Escenario / Historia de Usuario":
- escenarioId (ESC-XXX, generado automáticamente)
- titulo, actorPrincipal (selector REF M1-01), actorNombre (desnormalizado)
- situacionInicial, flujoNormal (lista de pasos mín 2), flujoAlternativo, excepcionesErrores
- requerimientosGenerados: lista de IDs de Requerimientos propuestos generados por este escenario
  (crear con useCrearRequerimiento + linkear)
- esBaseParaCasoDeUso: boolean — los marcados true quedan disponibles como base para F4-02
Criterio de salida: Formulario funcional. Requerimientos generados vinculados.

TAREA M3-F2-04 · Análisis Sociotécnico y Organizacional
Fuente: M3-01 §4.3.2 RNF organizacionales; M3-02 §3.4
Hook: useActualizarSRS() con data: { analisisOrganizacional: {...} }

Qué hacer:
Sección de "Análisis Organizacional" del SRS (SRS.analisisOrganizacional):
- estructuraDecisiones: texto libre
- dependenciasSistemas: texto libre (sistemas de F1-01 que condicionan el proyecto)
- resistenciasOrganizacionales: texto libre
- factoresPoliticos: texto libre
- conflictosOrganizacionales: si tiene contenido → opción de crear item en M2-03 tipo 'organizacional'
Los hallazgos relevantes deben convertirse en RNF de tipo 'proceso' (categoría = 'proceso')
usando useCrearRequerimiento con tipo = 'no_funcional', categoria = 'proceso'.
Criterio de salida: SRS.analisisOrganizacional actualizado. RNF organizacionales creados.

TAREA M3-F2-05 · Clasificación MoSCoW y resolución de conflictos
Fuente: M3-01 §7; M3-02 §8 JAD para negociación; REGLAS_MOSCOW (src/constants/alcance.ts)
Hook: useRequerimientos(srsId), useActualizarRequerimiento()

Qué hacer:
Vista Kanban o tabla de todos los Requerimientos con estado = 'propuesto':
- Drag-and-drop (o selector) a columnas Must / Should / Could / Won't
- Al mover a Won't: dialog obligatorio para capturar justificacionWont + versionObjetivo
  (crearRequerimientoSchema ya los requiere para prioridad = 'wont')
- Validación en tiempo real usando REGLAS_MOSCOW:
  mustMinPorcentajeEsfuerzo: 60% → alerta si Must < 60% del esfuerzo total
  couldMaxPorcentaje: 20% → alerta si Could > 20% de la cantidad total de RF
- Panel de "Conflictos MoSCoW": dos stakeholders de nivelInfluencia = 'alto' con
  priorización diferente del mismo RF → marcado como conflicto a resolver
- Campo resolucionConflicto: texto de decisión + stakeholder que decidió
Criterio de salida: Vista funcional. Conflictos documentados. Distribución MoSCoW calculada
y guardada en SRS.distribucionMoSCoW (DistribucionMoSCoW type).

══════════════════════════════════════════════════════════════════
FASE 3 — Prototipado y Validación Temprana ⟳
══════════════════════════════════════════════════════════════════
Archivos: M3-02 §9 (prototipado en adquisición); M3-01 §5 (bucle de retroalimentación)

TAREA M3-F3-01 · Registro de prototipo y su objetivo
Fuente: M3-01 §5; M3-02 §9
Hooks: useSRS(proyectoId) para leer SRS.prototipos, useAgregarPrototipo()
Schema: crearPrototipoSchema

Qué hacer:
Formulario de "Prototipo de Requerimientos" (embebido en SRS.prototipos):
- objetivo, tipo (TIPOS_PROTOTIPO_CONFIG para labels)
- requerimientosAValidar: selector de RF existentes — máx 15 (crearPrototipoSchema lo valida)
- Si > 15: mostrar sugerencia de dividir el prototipo
- urlArtifacto: URL externa del prototipo (draw.io, Figma, etc.)
- fechaSesionEvaluacion, stakeholdersParticipantes (multiselect de M1-01)
Nota: prototipo no tiene colección propia — se guarda embebido en SRS.prototipos.
Criterio de salida: SRS.prototipos actualizado. Prototipo visible en lista.

TAREA M3-F3-02 · Evaluación con usuarios y bucle de retorno a Fase 2
Fuente: M3-01 §5 y §6 — proceso IR en espiral
Hooks: useActualizarResultadoPrototipo(), useRegistrarIteracionBucle()

Qué hacer:
Formulario de "Evaluación del Prototipo":
- Resultados por requerimiento: 'validado' | 'ajuste_menor' | 'ajuste_mayor' | 'eliminado'
  (ResultadoValidacionProto type — 4 opciones usando ResultadoValidacionProto)
- Requerimientos con 'ajuste_mayor' o 'eliminado' → bucle F3→F2:
  llamar useRegistrarIteracionBucle({ fase: 'F3→F2', motivo, reqsAfectados })
  Esto cambia SRS.estado a 'en_adquisicion' automáticamente (alcanceService.registrarIteracionBucle)
- Si SRS.contadorCiclosValidacion > 3 → mostrar alerta de riesgo de alcance
  (sugerir registro de riesgo en M2-03)
- Con todos los RF del prototipo en 'validado' | 'ajuste_menor' → avanzar manualmente a Fase 4
NOTA: iteracionesBucle es array inmutable (append-only) — no se edita ni elimina.
Criterio de salida: Resultado guardado. Bucle F3→F2 funcional. Log de iteraciones permanente.

══════════════════════════════════════════════════════════════════
FASE 4 — Análisis y Modelado del Sistema ⟳
══════════════════════════════════════════════════════════════════
Archivos: M3-03-modelado-requerimientos.md (íntegro)

TAREA M3-F4-01 · Modelo de Contexto — artefacto OBLIGATORIO (Checklist S5)
Fuente: M3-03 §4 Modelos de Contexto; §4.3 cómo construirlo
Hooks: useAgregarArtefactoModelo(), useSRS() para ver SRS.artefactosModelo
Schema: crearArtefactoModeloSchema

Qué hacer:
Módulo de adjunto del Modelo de Contexto (tipo = 'modelo_contexto'):
- nombre, url (draw.io / Miro / Lucidchart), herramienta, descripcion
- sistemasExternosIdentificados: lista de sistemas externos del diagrama
  → sincronizar con SRS.sistemasExistentes de F1-01 — alertar si hay sistemas nuevos
  → cada sistema externo nuevo genera RNF de interoperabilidad (tipo = 'no_funcional',
    categoria = 'rendimiento' o 'portabilidad') con estado = 'propuesto'
BLOQUEO: El modelo de contexto es obligatorio para cualquier criticidad.
Si SRS.artefactosModelo no contiene ningún item con tipo = 'modelo_contexto' → no se puede avanzar a Fase 5
(Checklist S5 de CHECKLIST_SRS_21_ITEMS verifica esto).
Criterio de salida: Artefacto con tipo = 'modelo_contexto' en SRS.artefactosModelo.

TAREA M3-F4-02 · Casos de Uso UML
Fuente: M3-03 §5 Modelos de Interacción; §5.1 CU (pp. 124-126)
Hooks: useAgregarArtefactoModelo()

Qué hacer:
Formulario de adjunto tipo = 'caso_de_uso':
- actoresIdentificados: los actores del diagrama DEBEN coincidir con M1-01 stakeholders
  → validar que cada actor está en SRS.stakeholdersSRS; si hay actor nuevo → registrar primero en M1-01
- casosDeUsoListados: nombres de CU del diagrama
- casosDeUsoHuerfanos: CU sin RF asociados = posibles reqs faltantes (Checklist S2)
  → mostrar alerta de "posibles RF faltantes" para cada huérfano
Para criticidad = 'baja': opcionales pero recomendados.
Para criticidad = 'alta' | 'critica': obligatorios (junto con diagrama_actividad o bpmn).
Criterio de salida: Artefacto adjuntado. Actores validados. CU huérfanos alertados.

TAREA M3-F4-03 · Modelos de Procesos BPMN / Diagramas de Actividad
Fuente: M3-03 §4.4 Diagramas de actividad; §3.2 múltiples modelos

Qué hacer:
Adjunto de modelos tipo = 'bpmn' | 'diagrama_actividad' | 'diagrama_proceso':
- procesosModelados, actividadesIdentificadas, puntosDecision (número de gateways)
- Procesos sin RF asociados → alerta de posibles RF faltantes (Checklist S2)
- Para criticidad = 'alta' | 'critica': obligatorio al menos un bpmn o diagrama_actividad
Criterio de salida: Artefacto adjuntado. Alertas de procesos sin RF funcionando.

TAREA M3-F4-04 · Panorama Arquitectónico Preliminar
Fuente: M3-03 §3.3; M3-04 §5 Sección 6; M3-01 §4.3.1
Hook: useActualizarSRS() con data: { panoramaArquitectonico: {...} }

Qué hacer:
Formulario de "Panorama Arquitectónico" — SRS.panoramaArquitectonico:
- subsistemas: lista de Subsistema con nombre, responsabilidad, tecnologia (del stack de M2-07)
- distribucionFunciones: mapa { nombreSubsistema → [rfIds] } — RF Must asignados a cada subsistema
- restriccionesArquitectonicas: lista de strings con restricciones de diseño
Este panorama alimenta la Sección 6 del editor SRS de F5-01.
Criterio de salida: SRS.panoramaArquitectonico guardado. Distribución visible y sincronizada.

TAREA M3-F4-05 · Bucle de retorno Fase 4 → Fase 2
Fuente: M3-01 §6 proceso IR en espiral
Hook: useRegistrarIteracionBucle({ fase: 'F4→F2', ... })

Qué hacer:
Botón "Requerimiento emergente del modelado" disponible durante toda la Fase 4:
- Captura RF nuevo, crea Requerimiento con estado = 'propuesto'
- Llama useRegistrarIteracionBucle({ fase: 'F4→F2', motivo, reqsAfectados: [nuevoRfId] })
- Si SRS.iteracionesBucle tiene > 5 entradas con fase = 'F4→F2' → sugerir retorno formal a Fase 2
- Con modelos validados sin requerimientos emergentes pendientes → confirmar avance a Fase 5
Criterio de salida: Botón funcional. Log de iteraciones actualizado.

══════════════════════════════════════════════════════════════════
FASE 5 — Especificación y Documentación del SRS
══════════════════════════════════════════════════════════════════
Archivos: M3-04-especificacion-srs.md (EL ARCHIVO CENTRAL), M3-07-rnf.md, M3-08-dominio.md

TAREA M3-F5-01 · Estructura completa del SRS — 8 secciones + portada + apéndices
Fuente: M3-04 §5 IEEE 830 + Sommerville Fig. 4.7
Hook: useActualizarSRS() con data: { secciones: {...} }

Qué hacer:
Editor del SRS con estructura completa de M3-04 (SRS.secciones: SeccionesSRS):
- portada: nombre (de M2-01), código (M2-01), entidad cliente (M1), versión, fecha, estado
- s1_introduccion: 1.1 Propósito, 1.2 Alcance (de F4-01), 1.3 Glosario (M1-03 + F1-02),
  1.4 Referencias, 1.5 Visión general
- s2_descripcionGeneral: 2.1 Perspectiva, 2.2 Funciones Must Have (de F2-05),
  2.3 Usuarios (de M1-01/F1-03), 2.4 Restricciones (F2-04 + M2-01),
  2.5 Suposiciones, 2.6 Distribución de Won't Have (Apéndice D)
- s3_rf: RF organizados por actor o módulo (subsistemas de F4-04)
- s4_rnf: RNF con métricas obligatorias (7 categorías de M3-07)
- s5_interfaces: sistemas externos de F4-01
- s6_restriccionesDiseno: panorama arquitectónico de F4-04
- s7_modelos: índice de artefactos UML de F4
- s8_apendices: A (Glosario), B (Stakeholders), C (Cambios), D (Diferidos de F5-06)
Checklist S1: ninguna sección puede quedar con completada = false para avanzar a Gate 2.
Criterio de salida: Editor con todas las secciones. SeccionSRS.completada actualizando.

TAREA M3-F5-02 · Formalización de RF — 8 directrices
Fuente: M3-04 §4.1 Reglas de escritura; §9 PASO 2
Hooks: useRequerimientos(srsId), useActualizarRequerimiento()
Schema: crearRequerimientoSchema (validaciones V1, V2, S3 ya implementadas)

Qué hacer:
Proceso de formalización de Requerimiento (estado 'propuesto' → 'aprobado') para RF funcionales:
- Para cada RF en estado = 'propuesto' de tipo = 'funcional': abrir formulario de formalización
- Validaciones automáticas del crearRequerimientoSchema:
  · V1: si descripcion contiene palabras de PALABRAS_ALERTA_SRS → bloquear guardar
  · V2: si descripcion NO contiene VOCABULARIO_CONTROLADO_SRS → bloquear guardar
  · S3: si prioridad = 'must' → criterioAceptacion obligatorio en formato DADO/CUANDO/ENTONCES
- codigo RF-XXX generado automáticamente por alcanceService.createRequerimiento
- Al aprobar: updateRequerimiento({ estado: 'aprobado' })
Criterio de salida: Validaciones de M3-04 §4.1 bloqueando. RF aprobados con código RF-XXX.

TAREA M3-F5-03 · Formalización de RNF — 7 categorías con métricas
Fuente: M3-07-requerimientos-no-funcionales.md (íntegro)
Schema: crearRequerimientoSchema con tipo = 'no_funcional' (ya requiere categoria + metricas)
Referencia: CATEGORIAS_RNF_CONFIG (src/constants/alcance.ts) — campos guiados por categoría

Qué hacer:
Formulario guiado por categoría de RNF:
- Selector de categoría usando CATEGORIAS_RNF_CONFIG (labels + camposMetrica por categoría):
  · rendimiento: tiempoRespuesta_ms + cargaConcurrente_usuarios + throughput_req_por_seg
  · seguridad: mecanismoAutenticacion + nivelCifrado + protocoloAuditoria
  · disponibilidad: uptime_porcentaje + rto_horas + rpo_horas + ventanaMantenimiento
  · usabilidad: horasCapacitacion + tasaErroresUsuario + satisfaccionMin_SUS
  · mantenibilidad: coberturaTests_porcentaje + tiempoDiagnosticoBug_horas
  · portabilidad: plataformas + versionesMinimas + porcentajeCodigo_independiente
  · proceso: metodologiaObligatoria + herramientasMandatorias + estandarCodigo
- MetricasRNF: metricaObjetivo (DEBE contener valor numérico — Checklist S4) + metodMedicion
- Detección de conflictos entre RNF: si existe RNF rendimiento y RNF seguridad → sugerir
  documentar decisión de diseño en s6_restriccionesDiseno (Checklist C5)
Criterio de salida: Formulario guiado por categoría. Métricas obligatorias. Conflictos alertados.

TAREA M3-F5-04 · Formalización de Requerimientos de Dominio
Fuente: M3-08-requerimientos-dominio.md (íntegro); M3-01 §2.2 Tipo 3
Schema: crearRequerimientoSchema con tipo = 'dominio'

Qué hacer:
Formalización de RD usando M3-08:
- Los términos de F1-02 con esRequerimientoDominio = true aparecen como RD-XXX propuestos
- Plantilla RD: codigo (RD-XXX), titulo, descripcion (lenguaje del dominio, no jerga técnica),
  normaOLeyFuente (referencia regulatoria), stakeholderDominio (FK M1-01),
  implicacionEnRF (IDs de RF que deben cumplir esta regla), verificabilidadRD
- Los RD con normaOLeyFuente → vincular automáticamente a Sección 4 (cumplimiento legal)
  en el campo s4_rnf del SRS
Criterio de salida: RD con códigos RD-XXX aprobados. Vinculación a Sección 4 del SRS.

TAREA M3-F5-05 · Matriz de Trazabilidad — construcción inicial
Fuente: M3-04 §6 Trazabilidad; M3-09 §6
Hook: useActualizarSRS() con data: { matrizTrazabilidad: [...] }

Qué hacer:
Construcción de la Matriz de Trazabilidad (SRS.matrizTrazabilidad: EntradaTrazabilidad[]):
- Para cada RF aprobado: EntradaTrazabilidad con:
  requerimientoId, codigoRF (desnorm), tituloRF (desnorm),
  stakeholderFuente (REF M1-01), stakeholderNombre (desnorm),
  moduloSistema (subsistema de F4-04),
  casoPruebaId (vacío — se completa en F7-02),
  estado: 'completa' | 'parcial' | 'faltante'
- Vista tabla: Código RF | Título | Stakeholder origen | Módulo | Caso de prueba | Estado
- KPI cobertura trazabilidad hacia atrás: RF Must con stakeholder / total RF Must → meta 100%
- Alerta: RF Must sin stakeholder de M1-01 con nivelInfluencia = 'alto' | 'medio'
Criterio de salida: Matriz construida. KPI calculado. Alertas activas.

TAREA M3-F5-06 · Evolución anticipada del sistema (Apéndice D)
Fuente: M3-04 §5 Sección 2.6 y Apéndice D; M3-01 §4
Hooks: useRequerimientos para filtrar prioridad = 'wont', useActualizarRequerimiento()

Qué hacer:
Registro de Requerimientos Diferidos (Apéndice D = SRS.secciones.s8_apendices):
- Todos los Won't Have de F2-05 necesitan:
  justificacionWont (ya requerido por crearRequerimientoSchema.refine)
  versionObjetivo (en qué versión futura se considera)
  dependenciasTecnicas (qué debe existir antes)
- Checklist M3 (CHECKLIST_SRS_21_ITEMS): Won't sin justificación → bloqueaSiIncumple = true
- Generar contenido del Apéndice D automáticamente desde los datos de los Won't Have
  para pre-completar SRS.secciones.s8_apendices.contenido
Criterio de salida: Apéndice D generado. Todos los Won't Have con justificación completa.

══════════════════════════════════════════════════════════════════
FASE 6 — Planificación, Estimación y Restricciones
══════════════════════════════════════════════════════════════════
Archivos: M3-04 §5 Sección 2.4; M2-02 (estimación); M2-03 (riesgos)

TAREA M3-F6-01 · Estrategia de entrega y plan de calidad
Fuente: M3-04 §5 restricciones de diseño; M2-07 metodología acordada
Hook: useActualizarSRS() con data actualización de s2_descripcionGeneral

Qué hacer:
Conectar la estrategia de entrega (de Proyecto.metodologia = M2-07) con el SRS:
- Leer Proyecto.metodologia → mostrar texto de estrategia derivada como restricción de proceso
  (RNF tipo 'proceso' con categoría 'proceso' usando CATEGORIAS_RNF_CONFIG)
- Sección 2.4 del SRS se pre-completa con restricciones de M2-01 (tipo, criticidad, tecnologías)
- Plan de Calidad: criterios de aceptación globales, cobertura mínima de pruebas, estándares
  → documentar en s2_descripcionGeneral o s6_restriccionesDiseno
- La estrategia de entrega derivada en M2-07 se refleja como RNF de proceso
Criterio de salida: Sección 2.4 con restricciones. RNF de proceso creados.

TAREA M3-F6-02 · Estimación de esfuerzo y validación MoSCoW
Fuente: M3-04 §8.4 checklist M4 (RF Must implementable en presupuesto/plazo de M2-02)
Referencia: REGLAS_MOSCOW (src/constants/alcance.ts)

Qué hacer:
Validación de coherencia entre SRS y M2-02:
- Mostrar la distribución actual de RF por prioridad
- Calcular SRS.distribucionMoSCoW (% esfuerzo Must/Should/Could/Won't)
  y guardarlo en SRS via useActualizarSRS({ distribucionMoSCoW: {...} })
- Usando REGLAS_MOSCOW:
  · mustMinPorcentajeEsfuerzo: 60 → alerta si esfuerzo Must < 60%
  · couldMaxPorcentaje: 20 → alerta si cantidad Could > 20%
  · mustMaxPorcentajeEsfuerzo: 80 → si Must > 80%, el esfuerzo del equipo no es sostenible
- Si esfuerzo Must supera presupuesto/plazo de M2-02 → bloqueo forzando re-priorización
  (Checklist M4 de CHECKLIST_SRS_21_ITEMS — bloqueaSiIncumple = true)
Criterio de salida: Distribución MoSCoW calculada. Alertas de desbordamiento activas.

══════════════════════════════════════════════════════════════════
FASE 7 — Validación, Aprobación y Control de Cambios
══════════════════════════════════════════════════════════════════
Archivos: M3-05-validacion-srs.md (íntegro); M3-06-calidad-kpis.md

TAREA M3-F7-01 · Revisión conjunta del SRS — checklist 21 ítems
Fuente: M3-04 §8 (21 ítems S1-S8, C1-C6, V1-V5, M1-M4); M3-05 §4
Hooks: useInicializarChecklist(), useActualizarItemChecklist(), useAgregarObservacion(), useResolverObservacion()
Referencia: CHECKLIST_SRS_21_ITEMS (src/constants/alcance.ts) — todos los ítems con bloqueaSiIncumple

Qué hacer:
Proceso formal de validación (estado 'en_validacion'):
- Botón "Iniciar Validación" → llama useInicializarChecklist() que:
  · Crea los 21 ítems en SRS.checklistValidacion con estado = 'pendiente'
  · Cambia SRS.estado a 'en_validacion'
- Checklist interactivo: cada ítem tiene estado ('cumplido' | 'pendiente' | 'no_aplica') + nota
  Usar CHECKLIST_SRS_21_ITEMS para mostrar descripcion, faseRevision, bloqueaSiIncumple
  Los ítems con bloqueaSiIncumple = true aparecen marcados visualmente (badge rojo)
- Vista de revisión conjunta: modo lectura del SRS + sistema de comentarios por sección
  Usando useAgregarObservacion() con los campos de ObservacionValidacion
  (seccionAfectada, descripcion, tipoObservacion, autor)
- Observaciones tipo 'ajuste_mayor' → activar bucle F7→F5:
  llamar useRegistrarIteracionBucle({ fase: 'F7→F5', ... })
  Esto cambia SRS.estado a 'en_especificacion' (retorno a Fase 5)
- Observaciones resueltas: useResolverObservacion() — si todas resueltas → estado vuelve a 'en_validacion'
Criterio de salida: Checklist de 21 ítems. Sistema de comentarios. Bucle F7→F5 funcional.

TAREA M3-F7-02 · Plan de Pruebas de Aceptación
Fuente: M3-05 §4; M3-10 (casos de prueba)
Hooks: useCasosPrueba(srsId), useCrearCasoPrueba()
Schema: crearCasoPruebaSchema
Colección Firestore: 'casos_prueba'

Qué hacer:
Vinculación SRS ↔ M3-10 para completar Matriz de Trazabilidad:
- Para cada RF Must Have con criterioAceptacion (DADO/CUANDO/ENTONCES):
  Botón "Crear CP desde criterio" → useCrearCasoPrueba() con:
  dado/cuando/entonces extraídos del criterioAceptacion del RF
  tipo = 'aceptacion_alfa' | 'aceptacion_beta' según criterio del analista
  requerimientoId + codigoRF (FK al Requerimiento)
- Después de crear CP: llamar useActualizarRequerimiento() para actualizar casoPruebaId en el RF
- Actualizar EntradaTrazabilidad correspondiente en SRS.matrizTrazabilidad con casoPruebaId
- KPI cobertura hacia adelante: RF Must con casoPrueba / total RF Must → meta 100% antes de Gate 2
  (Checklist V3 de CHECKLIST_SRS_21_ITEMS — bloqueaSiIncumple = true)
Criterio de salida: CP creados. Vinculación RF ↔ CP. KPI cobertura hacia adelante calculado.

TAREA M3-F7-03 · CCB del SRS — Administración de Cambios
Fuente: M3-09-administracion-cambio-trazabilidad.md (secciones 4 y 5); M3-04 §7.3
Hook: useActualizarSRS() para SRS.ccbSRS, useCrearSCRSRS(), useAvanzarSCRSRS()
Schema: crearSCRSRSSchema
NOTA: Este CCB es INDEPENDIENTE del CCB del Repositorio (M2-06). Son dos entidades distintas.

Qué hacer:
CCB del SRS (activado desde Fase 7, pero las SCR se usan post-aprobación en Fase 8+):
- Registrar composición del CCB en SRS.ccbSRS (array de MiembroCCBSRS):
  · analista_responsable: siempre obligatorio (ROLES_CCB_SRS_CONFIG)
  · gestor_proyecto: siempre obligatorio
  · representante_cliente: obligatorio solo para cambios 'mayor'
  · arquitecto: si el cambio afecta RNF o arquitectura
- Formulario completo SolicitudCambioSRS (SCRSRS-XXX) con todas las secciones de M3-09 §5.1
  (useCrearSCRSRS disponible — solo funciona cuando SRS.estado = 'aprobado')
- Tabla de escalamiento: tipoCambio 'menor' → solo analista + gestor pueden aprobar;
  'mayor' → requiere representante_cliente (ROLES_CCB_SRS_CONFIG.aprueba)
- Evaluación de impacto cruzado: al crear SCR con requerimientosAfectados = [RF-X],
  buscar en requerimientos donde dependencias.includes(RF-X) → mostrar impacto indirecto
Criterio de salida: CCB del SRS configurado. Formulario SCR completo. Tabla de escalamiento.

TAREA M3-F7-04 · KPIs del SRS durante la validación
Fuente: M3-06-calidad-kpis.md (íntegro); M3-09 §8

Qué hacer:
Dashboard de KPIs visible en Fase 7 (calcular en tiempo real desde TanStack Query):
- Tiempo promedio en estado 'en_especificacion' (delta entre creadoEn del estado y ahora)
- Tasa de RF rechazados vs. aprobados: count(estado='rechazado') / count(all) * 100
- Número de observaciones en primera ronda: count(SRS.observacionesValidacion) en ciclo 1
- Densidad RF Must por módulo: groupBy(moduloSistema).count(prioridad='must')
- Cobertura trazabilidad hacia atrás: count(matrizTrazabilidad con stakeholderFuente) / total Must
- Cobertura trazabilidad hacia adelante: count(matrizTrazabilidad con casoPruebaId) / total Must
- Tiempo resolución SCR: delta entre fechaSolicitud y fechaImplementacion de SCRs
- SRS.contadorCiclosValidacion visible con alerta si > 3 (Checklist C6)
Criterio de salida: Dashboard visible. Todos los KPIs calculados en tiempo real.

──────────────────────────────────────────────────────────────────
🔒 GATE 2 — Firma del Cliente sobre el SRS v1.0
──────────────────────────────────────────────────────────────────

TAREA M3-GATE2 · Aprobación formal del SRS como transacción atómica
Fuente: M3-04 §9 PASO 7; M3-05 proceso de aprobación; política de versiones v0.X → v1.0
Hook: useAprobarGate2()

Qué hacer:
Gate 2 como transición atómica en dos pasos:

Paso 1 — Con observaciones (bucle F7→F5):
- Si SRS.observacionesValidacion tiene items con resuelto = false → botón "Aprobar" deshabilitado
- Si hay observaciones con tipoObservacion = 'ajuste_mayor' → retorno formal a Fase 5
- El SRS queda en estado 'con_observaciones' (ya manejado por resolverObservacion en el servicio)
- SRS.contadorCiclosValidacion se incrementa con cada retorno F7→F5 (alcanceService lo gestiona)

Paso 2 — Aprobado:
- useAprobarGate2() verifica programáticamente:
  · Todos los ítems bloqueantes del checklist en estado 'cumplido' (ya lo hace alcanceService.aprobarGate2)
  · SRS.estado = 'en_validacion' (ya validado)
- Al aprobar: SRS.estado = 'aprobado', SRS.version = 'v1.0', SRS.aprobadoPor, SRS.fechaAprobacion
- Después de useAprobarGate2(), llamar desde el componente:
  proyectosService.updateEstado(proyectoId, 'activo_en_desarrollo', 'SRS v1.0 aprobado')
- Generar notificación (o toast) al equipo: "SRS v1.0 aprobado — desarrollo autorizado"
NOTA: proyectosService.updateEstado ya está implementado (src/services/proyectos.service.ts).
Criterio de salida: Transacción atómica. SRS.version = 'v1.0'. Proyecto.estado = 'activo_en_desarrollo'.

══════════════════════════════════════════════════════════════════
FASE 8 — Transición, Capacitación y Cierre de Alcance (SRS en 'aprobado')
══════════════════════════════════════════════════════════════════
Archivos: M3-04 §5 Apéndice D; M3-09 §7 responsabilidades post-aprobación; M3-01 §5

TAREA M3-F8-01 · Plan de Despliegue y Migración de Datos
Fuente: M3-04 §5 Sección 2.5; M3-01 §9
Hook: useActualizarSRS() con data: { planDespliegue: {...} }
Schema: planDespliegueSchema

Qué hacer:
Formulario "Plan de Despliegue" como sección del SRS aprobado:
- estrategia: 'big_bang' | 'incremental' | 'paralelo' | 'piloto' (ESTRATEGIAS_DESPLIEGUE_CONFIG)
- sistemasAMigrar: lista de SistemaAMigrar (nombre, datosAMigrar, formatoOrigen, formatoDestino,
  responsableTecnico) — puede pre-cargar desde SRS.sistemasExistentes de F1-01
- esquemaMigracion: descripción de la estrategia de migración por sistema
- fechaTargetDespliegue, responsable
Criterio de salida: SRS.planDespliegue guardado via useActualizarSRS().

TAREA M3-F8-02 · Plan de Capacitación de Usuarios Finales
Fuente: M3-01 §2.3 requerimientos de organización; M1-01 stakeholders
Hook: useActualizarSRS() con data: { planCapacitacion: {...} }

Qué hacer:
Formulario "Plan de Capacitación" (SRS.planCapacitacion):
- grupos: lista de GrupoCapacitacion — los stakeholders de M1-01 con rol = 'usuario_final'
  aparecen como sugerencia. Campos: nombre, stakeholderIds, numeroPersonas,
  nivelTecnicoActual, duracionEstimadaHoras
- modalidad: 'presencial' | 'virtual' | 'hibrido' | 'autoservicio'
- materialesRequeridos: lista de strings
- responsableCapacitacion: selector del equipo del proyecto (M2-05)
Criterio de salida: SRS.planCapacitacion guardado.

TAREA M3-F8-03 · SLA y Plan de Soporte Post-Entrega
Fuente: M3-01 §4.3.1 RNF disponibilidad; M3-07 RNF disponibilidad (RTO/RPO)
Hook: useActualizarSRS() con data: { planSLA: {...} }
Schema: planSLASchema

Qué hacer:
Formulario "SLA y Soporte" (SRS.planSLA):
- periodoGarantia: días post-go-live (min 30, max 365)
- slaDisponibilidad: uptime % (debe ser coherente con RNF disponibilidad del SRS → Checklist V5)
  Si hay RNF disponibilidad aprobado: pre-cargar su metricaObjetivo
- tiemposRespuesta: tabla de TiempoRespuestaSLA por severidad ('critico' | 'alto' | 'medio' | 'bajo')
- responsablePostEntrega, mecanismoReporte, criterioFinGarantia
Criterio de salida: SRS.planSLA guardado. Coherencia con RNF de disponibilidad.

TAREA M3-F8-04 · Activación de activoendesarrollo y responsabilidades post-aprobación
Fuente: M3-09 §7.1; M3-04 §11
Hooks: useRequerimientos, useActualizarSRS, proyectosService.updateEstado (directo, no hook)

Qué hacer:
Checklist post-aprobación obligatorio antes de cerrar formalmente Módulo 3:
1. Verificar cobertura 100% Trazabilidad hacia atrás (todos los RF Must tienen stakeholderFuente)
2. Verificar cobertura 100% Trazabilidad hacia adelante (todos los RF Must tienen casoPruebaId)
3. Verificar que todos los RF volátiles (esVolatil = true) tienen razonCambio documentado
4. Revisar que no hay dependencias circulares en Requerimiento.dependencias
5. Registrar estado inicial de la matriz en SRS.matrizTrazabilidad (actualizar EntradaTrazabilidades)
6. Toast/notificación: "Módulo 3 cerrado — SRS v1.0 firmado — Proyecto en desarrollo"
Si Proyecto.estado no está en 'activo_en_desarrollo' todavía (por si useAprobarGate2 falló):
  llamar proyectosService.updateEstado(proyectoId, 'activo_en_desarrollo', motivo)
El SRS en estado 'aprobado' pasa a modo solo-lectura — solo modificable vía SCR del CCB del SRS.
Criterio de salida: 6 puntos del checklist cumplidos. Estado 'activo_en_desarrollo' activo.

══════════════════════════════════════════════════════════════════
FASE FINAL · Alcance Definitivo Aprobado
══════════════════════════════════════════════════════════════════

SRS v1.0 firmado. Proyecto listo para desarrollar.
El SRS es el contrato técnico del proyecto. Cualquier cambio posterior requiere SCR formal
del CCB del SRS (useCrearSCRSRS + useAvanzarSCRSRS — M3-09).

Integración de los 10 archivos:
  M3-01: Marco conceptual de todo el flujo (estados, bucles, propiedades emergentes)
  M3-02: Fase 2 — técnicas de adquisición, entrevistas, escenarios
  M3-03: Fase 4 — modelado UML, contexto, CU, BPMN, panorama arquitectónico
  M3-04: EJE CENTRAL — especificación IEEE 830, vocabulario, checklist 21 ítems, MoSCoW
  M3-05: Fase 7 — validación, revisión conjunta, técnicas de validación
  M3-06: KPIs transversales (calculados en tiempo real en dashboard Fase 7)
  M3-07: Fase 5-F5-03 — 7 categorías RNF con métricas guiadas
  M3-08: Fase 1-F1-02 y Fase 5-F5-04 — requerimientos de dominio y glosario
  M3-09: Fase 7-F7-03 y Fase 8+ — CCB del SRS, SCR, trazabilidad post-aprobación
  M3-10: Fase 7-F7-02 — casos de prueba de aceptación alfa/beta

══════════════════════════════════════════════════════════════════
PROMPT PARA EL PRÓXIMO CHAT (COPIAR ÍNTEGRO)
══════════════════════════════════════════════════════════════════

Continua con el Sprint M3-FULL del proyecto Austranet CCO.

CONTEXTO: La infraestructura de datos para el Módulo 3 está 100% lista:
- Tipos TypeScript: src/types/index.ts (SRS, Requerimiento, CasoPrueba, etc.)
- Servicio Firestore: src/services/alcance.service.ts (CRUD + Gates + bucles)
- Hooks TanStack Query: src/hooks/useAlcance.ts (useSRS, useRequerimientos, etc.)
- Validaciones Zod: src/lib/validations/alcance.schema.ts
- Constantes M3: src/constants/alcance.ts (PALABRAS_ALERTA_SRS, CHECKLIST_SRS_21_ITEMS, etc.)
- Trigger automático: proyectos.service.ts crea SRS cuando proyecto → 'activo_en_definicion'

LO QUE FALTA: Solo los componentes UI (React/Next.js). Sigue el orden de implementación del
sprint document en docs/modulo-3-alcance/Sprint-Módulo_ 3_Completo.md:

CAPA 0 PRIMERO: Reemplazar el placeholder en
  src/app/(dashboard)/proyectos/[proyectoId]/alcance/page.tsx
con la página principal del SRS que usa useSRS(proyectoId) y muestra el stepper de 8 fases.
Usar ESTADO_SRS_FASES[srs.estado].fasesHabilitadas para controlar qué fases están activas.

Después, implementar en orden de capas (1→2→3→4→5→6→7) las tareas del sprint.
Los archivos de referencia de contenido están en docs/modulo-3-alcance/ (M3-01 a M3-10).
El sprint document revisado explica exactamente qué hook/schema/colección usar en cada tarea.
