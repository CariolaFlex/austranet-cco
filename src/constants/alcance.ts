// ============================================================
// CONSTANTES — Módulo 3 (Alcance / SRS)
// Fuentes: M3-01 a M3-10 (Sommerville Ingeniería de Software)
// ============================================================

import type {
  TecnicaAdquisicion,
  TipoArtefactoModelo,
  TipoPrototipo,
  TipoRNFCategoria,
  EstadoSCRSRS,
  EstrategiaDespliegue,
  RolStakeholderSRS,
} from '@/types'

// ──────────────────────────────────────────────────────────
// PALABRAS DE ALERTA — M3-04 §4.1
// Palabras que indican ambigüedad en la descripción de un RF.
// Si aparecen sin métrica asociada, el sistema debe alertar.
// ──────────────────────────────────────────────────────────

export const PALABRAS_ALERTA_SRS: string[] = [
  // Adjetivos vagos
  'adecuado', 'adecuada',
  'flexible',
  'robusto', 'robusta',
  'eficiente', 'eficientemente',
  'seguro', 'segura',       // aceptado SOLO si incluye métrica
  'rápido', 'rápidamente',
  'moderno', 'moderna',
  'simple', 'sencillo', 'sencilla',
  'fácil', 'fácilmente',
  'intuitivo', 'intuitiva',
  'amigable',
  'escalable',
  'extensible',
  'configurable',
  'transparente',
  'manejable',
  'óptimo', 'óptima',
  'suficiente', 'suficientemente',
  'oportuno', 'oportuna',
  // Cuantificadores indefinidos
  'mínimo',   // aceptado SOLO si incluye valor
  'máximo',   // aceptado SOLO si incluye valor
  'algunos', 'algunas', 'algún', 'alguna',
  'varios', 'varias',
  'muchos', 'muchas',
  'pocos', 'pocas',
  // Frecuencias indefinidas
  'normalmente',
  'generalmente',
  'usualmente',
  'habitualmente',
  'a veces',
  'posiblemente',
  'típicamente',
  'en la mayoría de',
  'frecuentemente',
  // Pronombres genéricos
  'el sistema',             // reemplazar por el actor o subsistema concreto
  'el usuario',             // reemplazar por el rol de usuario específico
  // Comparativos sin referencia
  'mejor',
  'mayor',
  'menor',
  'más rápido',
  'más seguro',
  'mejorado', 'mejorada',
]

// ──────────────────────────────────────────────────────────
// VOCABULARIO CONTROLADO — M3-04 §4.1 (punto 2)
// La descripción de un RF DEBE contener al menos una de estas palabras.
// DEBE = Must, DEBERÍA = Should, PODRÁ = Could
// ──────────────────────────────────────────────────────────

export const VOCABULARIO_CONTROLADO_SRS: string[] = [
  'debe', 'deberá', 'DEBE', 'DEBERÁ',
  'debería', 'DEBERÍA',
  'podrá', 'PODRÁ',
  'shall', 'should', 'may',  // por si se usa inglés
]

// ──────────────────────────────────────────────────────────
// TÉCNICAS DE ADQUISICIÓN — M3-02 §4-§8
// ──────────────────────────────────────────────────────────

export const TECNICAS_ADQUISICION_CONFIG: Record<
  TecnicaAdquisicion,
  {
    label: string
    descripcion: string
    descubreConocimientoTacito: boolean  // si false y es la única técnica → bloqueo M3-F2-01
    formularioHabilitado: boolean
  }
> = {
  entrevista_abierta: {
    label: 'Entrevista Abierta',
    descripcion: 'Preguntas abiertas sin guión fijo — descubre necesidades latentes (Sommerville §4.5.1)',
    descubreConocimientoTacito: true,
    formularioHabilitado: true,
  },
  entrevista_cerrada: {
    label: 'Entrevista Cerrada',
    descripcion: 'Preguntas predefinidas — confirma suposiciones pero NO descubre conocimiento tácito',
    descubreConocimientoTacito: false,
    formularioHabilitado: true,
  },
  entrevista_mixta: {
    label: 'Entrevista Mixta',
    descripcion: 'Combinación de preguntas abiertas y cerradas — balanceo recomendado',
    descubreConocimientoTacito: true,
    formularioHabilitado: true,
  },
  etnografia: {
    label: 'Etnografía',
    descripcion: 'Observación directa del trabajo real — captura procesos implícitos no verbalizados (§4.5.4)',
    descubreConocimientoTacito: true,
    formularioHabilitado: true,
  },
  taller_jad: {
    label: 'Taller JAD',
    descripcion: 'Joint Application Development — sesión facilitada con múltiples stakeholders para negociar (§4.5.5)',
    descubreConocimientoTacito: true,
    formularioHabilitado: true,
  },
  escenarios: {
    label: 'Escenarios / Historias de Usuario',
    descripcion: 'Narrativas de interacción con el sistema — muy eficaces para usuarios finales (§4.5.2)',
    descubreConocimientoTacito: true,
    formularioHabilitado: true,
  },
  casos_uso_adquisicion: {
    label: 'Casos de Uso (Adquisición)',
    descripcion: 'Diagramas UML de casos de uso para estructura inicial de actores y flujos (§4.5.3)',
    descubreConocimientoTacito: true,
    formularioHabilitado: true,
  },
}

// ──────────────────────────────────────────────────────────
// TIPOS DE PROTOTIPO — M3-02 §9, M3-F3-01
// ──────────────────────────────────────────────────────────

export const TIPOS_PROTOTIPO_CONFIG: Record<
  TipoPrototipo,
  { label: string; descripcion: string; fidelidad: 'baja' | 'media' | 'alta' }
> = {
  wireframe_papel: {
    label: 'Wireframe en papel',
    descripcion: 'Boceto manual — muy rápido, ideal para validar flujos antes de invertir en diseño',
    fidelidad: 'baja',
  },
  mockup_digital: {
    label: 'Mockup digital',
    descripcion: 'Diseño visual estático — muestra la UI sin interactividad (Figma, Balsamiq)',
    fidelidad: 'media',
  },
  mago_de_oz: {
    label: 'Mago de Oz',
    descripcion: 'Sistema real operado manualmente — simula el comportamiento del software final',
    fidelidad: 'media',
  },
  prototipo_funcional: {
    label: 'Prototipo funcional',
    descripcion: 'Código funcional parcial — valida viabilidad técnica y flujos complejos',
    fidelidad: 'alta',
  },
}

// ──────────────────────────────────────────────────────────
// TIPOS DE ARTEFACTO DE MODELO — M3-03
// ──────────────────────────────────────────────────────────

export const TIPOS_ARTEFACTO_MODELO_CONFIG: Record<
  TipoArtefactoModelo,
  { label: string; descripcion: string; obligatorio: boolean; condicionObligatoriedad?: string }
> = {
  modelo_contexto: {
    label: 'Modelo de Contexto',
    descripcion: 'Diagrama de bloques — sistemas externos y fronteras del sistema (M3-03 §4.3)',
    obligatorio: true,
    condicionObligatoriedad: 'Toda criticidad — sin excepción (Checklist S7)',
  },
  caso_de_uso: {
    label: 'Diagrama de Casos de Uso',
    descripcion: 'Actores y CU UML — interacción entre actores y funcionalidades (M3-03 §5.1)',
    obligatorio: false,
    condicionObligatoriedad: 'Opcional para criticidad baja, recomendado para media/alta',
  },
  bpmn: {
    label: 'Diagrama BPMN',
    descripcion: 'Business Process Model — flujos de proceso de negocio con notación BPMN 2.0',
    obligatorio: false,
    condicionObligatoriedad: 'Obligatorio si criticidad = alta | critica (junto con diagrama_actividad)',
  },
  diagrama_actividad: {
    label: 'Diagrama de Actividad UML',
    descripcion: 'Flujo de trabajo con decisiones — equivalente UML al BPMN (M3-03 §4.4)',
    obligatorio: false,
    condicionObligatoriedad: 'Obligatorio si criticidad = alta | critica',
  },
  diagrama_secuencia: {
    label: 'Diagrama de Secuencia',
    descripcion: 'Interacción temporal entre objetos — flujo de mensajes en CU críticos (M3-03 §5.2)',
    obligatorio: false,
    condicionObligatoriedad: 'Recomendado para CU con criticidad alta',
  },
  diagrama_clase: {
    label: 'Diagrama de Clases',
    descripcion: 'Modelo estructural — entidades del dominio y sus relaciones (M3-03 §3.3)',
    obligatorio: false,
    condicionObligatoriedad: 'Recomendado para proyectos tipo nuevo_desarrollo',
  },
  diagrama_estado: {
    label: 'Diagrama de Estado',
    descripcion: 'Máquina de estados finita — ciclo de vida de entidades con estados complejos (M3-03 §7)',
    obligatorio: false,
    condicionObligatoriedad: 'Recomendado para entidades con ciclo de vida definido',
  },
  diagrama_proceso: {
    label: 'Diagrama de Proceso (genérico)',
    descripcion: 'Diagrama de proceso de negocio sin notación formal específica',
    obligatorio: false,
  },
}

// ──────────────────────────────────────────────────────────
// 7 CATEGORÍAS DE RNF — M3-07 (Sommerville Fig. 4.3)
// Para cada categoría: campos guiados de métricas obligatorias
// ──────────────────────────────────────────────────────────

export const CATEGORIAS_RNF_CONFIG: Record<
  TipoRNFCategoria,
  {
    label: string
    descripcion: string
    prefijoCodigo: string    // parte del código RNF: RNF-PRD-VEL, RNF-ORG-OPE, etc.
    camposMetrica: string[]  // nombres de los campos guiados de la métrica
    ejemploMetrica: string
  }
> = {
  rendimiento: {
    label: 'Rendimiento',
    descripcion: 'Velocidad, capacidad de carga, tiempo de respuesta (Fig. 4.5: transacciones/seg, tiempo respuesta)',
    prefijoCodigo: 'RNF-PRD-VEL',
    camposMetrica: ['tiempoRespuesta_ms', 'cargaConcurrente_usuarios', 'throughput_req_por_seg'],
    ejemploMetrica: 'El sistema DEBE responder en < 200ms para el 95% de las solicitudes bajo carga de 500 usuarios concurrentes',
  },
  seguridad: {
    label: 'Seguridad',
    descripcion: 'Autenticación, cifrado, auditoría, protección contra intrusiones (M3-07 §4)',
    prefijoCodigo: 'RNF-PRD-SEC',
    camposMetrica: ['mecanismoAutenticacion', 'nivelCifrado', 'protocoloAuditoria'],
    ejemploMetrica: 'El sistema DEBE cifrar todos los datos en tránsito con TLS 1.3 y registrar todos los accesos en log de auditoría',
  },
  disponibilidad: {
    label: 'Disponibilidad',
    descripcion: 'Uptime, RTO, RPO, ventana de mantenimiento (AVAIL = MTTF / (MTTF + MTTR))',
    prefijoCodigo: 'RNF-PRD-FIA',
    camposMetrica: ['uptime_porcentaje', 'rto_horas', 'rpo_horas', 'ventanaMantenimiento'],
    ejemploMetrica: 'El sistema DEBERÁ estar disponible el 99.9% del tiempo medido mensualmente, con RTO < 2h y RPO < 1h',
  },
  usabilidad: {
    label: 'Usabilidad',
    descripcion: 'Facilidad de uso, horas de capacitación necesarias, tasa de errores del usuario',
    prefijoCodigo: 'RNF-PRD-USA',
    camposMetrica: ['horasCapacitacion', 'tasaErroresUsuario', 'satisfaccionMin_SUS'],
    ejemploMetrica: 'Un usuario nuevo DEBERÁ ser capaz de completar las tareas principales con menos de 2 horas de capacitación',
  },
  mantenibilidad: {
    label: 'Mantenibilidad',
    descripcion: 'Cobertura de tests, tiempo de diagnóstico de bugs, deuda técnica máxima',
    prefijoCodigo: 'RNF-ORG-DES',
    camposMetrica: ['coberturaTests_porcentaje', 'tiempoDiagnosticoBug_horas', 'complejidadCiclomaticaMax'],
    ejemploMetrica: 'El código DEBE tener una cobertura mínima de pruebas del 80% y complejidad ciclomática ≤ 10 por función',
  },
  portabilidad: {
    label: 'Portabilidad',
    descripcion: 'Plataformas requeridas, versiones OS/browser, porcentaje código plataforma-dependiente',
    prefijoCodigo: 'RNF-PRD-POR',
    camposMetrica: ['plataformas', 'versionesMinimas', 'porcentajeCodigo_independiente'],
    ejemploMetrica: 'El sistema DEBE funcionar en Chrome ≥ 100, Firefox ≥ 100, Safari ≥ 15 sin plugins adicionales',
  },
  proceso: {
    label: 'Proceso / Organización',
    descripcion: 'Metodología obligatoria del cliente, herramientas mandatorias, estándares de desarrollo (M3-07 §5)',
    prefijoCodigo: 'RNF-ORG-OPE',
    camposMetrica: ['metodologiaObligatoria', 'herramientasMandatorias', 'estandarCodigo'],
    ejemploMetrica: 'El desarrollo DEBE seguir la metodología acordada en M2-07 y utilizar el sistema de tickets designado por el cliente',
  },
}

// ──────────────────────────────────────────────────────────
// CHECKLIST 21 ÍTEMS DE CALIDAD — M3-04 §8
// 4 grupos: Completitud (S), Consistencia (C), Verificabilidad (V), Modificabilidad (M)
// ──────────────────────────────────────────────────────────

export interface DefinicionItemChecklist {
  codigo: string
  grupo: 'completitud' | 'consistencia' | 'verificabilidad' | 'modificabilidad'
  descripcion: string
  faseRevision: string         // en qué fase debe estar cumplido
  bloqueaSiIncumple: boolean   // si true, no puede avanzar sin marcarlo cumplido
}

export const CHECKLIST_SRS_21_ITEMS: DefinicionItemChecklist[] = [
  // ── COMPLETITUD (S) — Sommerville §8.1 ──
  {
    codigo: 'S1',
    grupo: 'completitud',
    descripcion: 'Todas las secciones del SRS están completas (portada + S1 a S8 + apéndices)',
    faseRevision: 'F5 antes de avanzar a F6',
    bloqueaSiIncumple: true,
  },
  {
    codigo: 'S2',
    grupo: 'completitud',
    descripcion: 'Cada actor/stakeholder con nivelInfluencia = alto tiene al menos un RF asociado',
    faseRevision: 'F5-05 Matriz de Trazabilidad',
    bloqueaSiIncumple: true,
  },
  {
    codigo: 'S3',
    grupo: 'completitud',
    descripcion: 'Todo RF Must Have tiene criterioAceptacion en formato DADO/CUANDO/ENTONCES',
    faseRevision: 'F5-02 Formalización RF',
    bloqueaSiIncumple: true,
  },
  {
    codigo: 'S4',
    grupo: 'completitud',
    descripcion: 'Todo RNF tiene métrica cuantitativa definida (valor objetivo + método de medición)',
    faseRevision: 'F5-03 Formalización RNF',
    bloqueaSiIncumple: true,
  },
  {
    codigo: 'S5',
    grupo: 'completitud',
    descripcion: 'Al menos un diagrama de contexto (modelo_contexto) está adjunto en F4',
    faseRevision: 'F4-01 Modelo de Contexto',
    bloqueaSiIncumple: true,
  },
  {
    codigo: 'S6',
    grupo: 'completitud',
    descripcion: 'Todo Won\'t Have tiene justificación, versionObjetivo y dependenciasTecnicas documentadas',
    faseRevision: 'F5-06 Apéndice D',
    bloqueaSiIncumple: true,
  },
  {
    codigo: 'S7',
    grupo: 'completitud',
    descripcion: 'El glosario del SRS incluye todos los términos técnicos y de dominio usados en los requerimientos',
    faseRevision: 'F5-01 Sección 1.3',
    bloqueaSiIncumple: false,
  },
  {
    codigo: 'S8',
    grupo: 'completitud',
    descripcion: 'La Sección 5 de interfaces documenta todos los sistemas externos del modelo de contexto',
    faseRevision: 'F5-01 Sección 5',
    bloqueaSiIncumple: false,
  },
  // ── CONSISTENCIA (C) — Sommerville §8.2 ──
  {
    codigo: 'C1',
    grupo: 'consistencia',
    descripcion: 'Ningún término del glosario tiene dos definiciones contradictorias en el SRS',
    faseRevision: 'F7-01 Revisión conjunta',
    bloqueaSiIncumple: false,
  },
  {
    codigo: 'C2',
    grupo: 'consistencia',
    descripcion: 'Ningún RF contradice a otro RF del mismo tipo/actor',
    faseRevision: 'F7-01 Revisión conjunta',
    bloqueaSiIncumple: true,
  },
  {
    codigo: 'C3',
    grupo: 'consistencia',
    descripcion: 'Los actores del diagrama de CU son un subconjunto de los stakeholders de M1-01',
    faseRevision: 'F4-02 Casos de Uso',
    bloqueaSiIncumple: true,
  },
  {
    codigo: 'C4',
    grupo: 'consistencia',
    descripcion: 'La estrategia de entrega en el SRS es consistente con la metodología acordada en M2-07',
    faseRevision: 'F6-01 Estrategia de entrega',
    bloqueaSiIncumple: false,
  },
  {
    codigo: 'C5',
    grupo: 'consistencia',
    descripcion: 'Los conflictos entre RNF (ej: rendimiento vs. seguridad) están documentados con decisión de diseño',
    faseRevision: 'F5-03 RNF / F5-01 Sección 6',
    bloqueaSiIncumple: false,
  },
  {
    codigo: 'C6',
    grupo: 'consistencia',
    descripcion: 'La distribución MoSCoW cumple: ≥60% esfuerzo en Must, ≤20% en Could, todo Won\'t justificado',
    faseRevision: 'F2-05 MoSCoW / F6-02 Estimación',
    bloqueaSiIncumple: true,
  },
  // ── VERIFICABILIDAD (V) — Sommerville §8.3 ──
  {
    codigo: 'V1',
    grupo: 'verificabilidad',
    descripcion: 'Ningún RF usa palabras de alerta de M3-04 §4.1 sin justificación o métrica asociada',
    faseRevision: 'F5-02 Formalización RF',
    bloqueaSiIncumple: true,
  },
  {
    codigo: 'V2',
    grupo: 'verificabilidad',
    descripcion: 'Cada RF contiene vocabulario controlado: DEBE / DEBERÍA / PODRÁ',
    faseRevision: 'F5-02 Formalización RF',
    bloqueaSiIncumple: true,
  },
  {
    codigo: 'V3',
    grupo: 'verificabilidad',
    descripcion: 'Cada RF Must Have tiene un Caso de Prueba (CP-XXX) vinculado en la Matriz de Trazabilidad',
    faseRevision: 'F7-02 Plan de Pruebas',
    bloqueaSiIncumple: true,
  },
  {
    codigo: 'V4',
    grupo: 'verificabilidad',
    descripcion: 'Los RD de tipo normaOLeyFuente tienen criterio de verificabilidad documentado',
    faseRevision: 'F5-04 RD',
    bloqueaSiIncumple: false,
  },
  {
    codigo: 'V5',
    grupo: 'verificabilidad',
    descripcion: 'Los RNF de disponibilidad son consistentes con el SLA del Plan de Soporte (F8-03)',
    faseRevision: 'F8-03 SLA',
    bloqueaSiIncumple: false,
  },
  // ── MODIFICABILIDAD (M) — Sommerville §8.4 ──
  {
    codigo: 'M1',
    grupo: 'modificabilidad',
    descripcion: 'Cada RF está identificado con código único (RF-XXX), sin referencias externas por nombre',
    faseRevision: 'F5-02 Formalización RF',
    bloqueaSiIncumple: true,
  },
  {
    codigo: 'M2',
    grupo: 'modificabilidad',
    descripcion: 'Los requerimientos volátiles (esVolatil = true) tienen razonCambio documentada',
    faseRevision: 'F5-06 Evolución anticipada',
    bloqueaSiIncumple: false,
  },
  {
    codigo: 'M3',
    grupo: 'modificabilidad',
    descripcion: 'El Apéndice D está completo: todos los Won\'t Have con justificación y versión objetivo',
    faseRevision: 'F5-06 Apéndice D',
    bloqueaSiIncumple: true,
  },
  {
    codigo: 'M4',
    grupo: 'modificabilidad',
    descripcion: 'El esfuerzo total de RF Must Have es implementable dentro del presupuesto/plazo de M2-02',
    faseRevision: 'F6-02 Estimación',
    bloqueaSiIncumple: true,
  },
]

// ──────────────────────────────────────────────────────────
// ESTADOS DEL SCR DEL SRS — M3-09 §5
// ──────────────────────────────────────────────────────────

export const ESTADO_SCR_SRS_CONFIG: Record<
  EstadoSCRSRS,
  { label: string; color: string; siguiente?: EstadoSCRSRS[] }
> = {
  propuesta:    { label: 'Propuesta',       color: 'gray',   siguiente: ['en_analisis'] },
  en_analisis:  { label: 'En análisis',     color: 'blue',   siguiente: ['evaluada_ccb'] },
  evaluada_ccb: { label: 'Evaluada (CCB)',  color: 'yellow', siguiente: ['aprobada', 'rechazada', 'diferida'] },
  aprobada:     { label: 'Aprobada',        color: 'green',  siguiente: ['implementada'] },
  rechazada:    { label: 'Rechazada',       color: 'red',    siguiente: [] },
  implementada: { label: 'Implementada',    color: 'teal',   siguiente: [] },
  diferida:     { label: 'Diferida',        color: 'orange', siguiente: ['en_analisis'] },
}

// ──────────────────────────────────────────────────────────
// ESTRATEGIAS DE DESPLIEGUE — M3-F8-01
// ──────────────────────────────────────────────────────────

export const ESTRATEGIAS_DESPLIEGUE_CONFIG: Record<
  EstrategiaDespliegue,
  { label: string; descripcion: string; riesgo: 'bajo' | 'medio' | 'alto' }
> = {
  big_bang: {
    label: 'Big Bang',
    descripcion: 'Despliegue completo de una sola vez — alto riesgo pero sencillo de planificar',
    riesgo: 'alto',
  },
  incremental: {
    label: 'Incremental',
    descripcion: 'Despliegue por módulos o sprints — riesgo bajo, retroalimentación continua',
    riesgo: 'bajo',
  },
  paralelo: {
    label: 'Paralelo',
    descripcion: 'Sistema nuevo y viejo operan simultáneamente — validación segura pero costoso',
    riesgo: 'bajo',
  },
  piloto: {
    label: 'Piloto',
    descripcion: 'Despliegue en grupo reducido de usuarios antes de la producción general',
    riesgo: 'medio',
  },
}

// ──────────────────────────────────────────────────────────
// ROLES DEL CCB DEL SRS — M3-09 §4 (tabla de escalamiento)
// DIFERENTE de ROLES del CCB del Repositorio (M2-06)
// ──────────────────────────────────────────────────────────

export const ROLES_CCB_SRS_CONFIG = {
  analista_responsable: {
    label: 'Analista Responsable SRS',
    esObligatorio: true,
    aprueba: ['menor'],
    descripcion: 'Responsable del SRS — obligatorio siempre',
  },
  gestor_proyecto: {
    label: 'Gestor del Proyecto',
    esObligatorio: true,
    aprueba: ['menor', 'mayor'],
    descripcion: 'Gestor del proyecto M2 — obligatorio siempre',
  },
  representante_cliente: {
    label: 'Representante del Cliente',
    esObligatorio: false,
    aprueba: ['mayor'],
    descripcion: 'Stakeholder M1 con nivelInfluencia = alto — obligatorio solo para cambios MAJOR',
  },
  arquitecto: {
    label: 'Arquitecto',
    esObligatorio: false,
    aprueba: ['mayor'],
    descripcion: 'Obligatorio si el cambio afecta RNF o arquitectura del sistema',
  },
} as const

// ──────────────────────────────────────────────────────────
// ROLES DE STAKEHOLDER EN EL SRS — M3-F1-03
// ──────────────────────────────────────────────────────────

export const ROL_STAKEHOLDER_SRS_CONFIG: Record<
  RolStakeholderSRS,
  { label: string; descripcion: string }
> = {
  cliente_sponsor: {
    label: 'Cliente / Sponsor',
    descripcion: 'Paga el desarrollo — define el valor del negocio y aprueba el SRS',
  },
  usuario_final: {
    label: 'Usuario Final',
    descripcion: 'Usa el sistema en el día a día — fuente principal de RF funcionales',
  },
  gestor_proyecto: {
    label: 'Gestor del Proyecto',
    descripcion: 'Controla presupuesto/plazo — necesita RNF de gestión y seguimiento',
  },
  arquitecto: {
    label: 'Arquitecto',
    descripcion: 'Define la arquitectura técnica — necesita RNF de calidad y Sección 6',
  },
  regulador: {
    label: 'Regulador',
    descripcion: 'Exige cumplimiento de normas — fuente principal de RD y RNF legales',
  },
  qa_tester: {
    label: 'QA / Tester',
    descripcion: 'Verifica el sistema — necesita criteriosAceptacion verificables y CP',
  },
  analista_futuro: {
    label: 'Analista Futuro',
    descripcion: 'Mantendrá el SRS — necesita comprensibilidad y modificabilidad alta',
  },
}

// ──────────────────────────────────────────────────────────
// COLECCIONES FIRESTORE — Módulo 3
// Arquitectura de datos: qué se guarda donde
// ──────────────────────────────────────────────────────────

export const COLECCIONES_M3 = {
  SRS: 'srs',                           // top-level: un doc por proyecto (FK proyectoId)
  REQUERIMIENTOS: 'requerimientos',      // top-level: muchos por SRS (FK srsId + proyectoId)
  SESIONES_ENTREVISTA: 'sesiones_entrevista', // top-level (FK srsId + proyectoId)
  ESCENARIOS: 'escenarios',             // top-level (FK srsId + proyectoId)
  CASOS_PRUEBA: 'casos_prueba',         // top-level (FK srsId + proyectoId + requerimientoId)
  TERMINOS_DOMINIO_SRS: 'terminos_dominio_srs', // top-level (FK srsId + proyectoId)
} as const

// ──────────────────────────────────────────────────────────
// ESTADO SRS FASES — mapeo estado ↔ fase habilitada
// Cuándo habilita cada fase del flujo de 8 fases + 2 gates
// ──────────────────────────────────────────────────────────

export const ESTADO_SRS_FASES = {
  no_iniciado:       { fasesHabilitadas: [1],       label: 'Pendiente inicio (activar proyecto en M2)' },
  en_adquisicion:    { fasesHabilitadas: [1, 2],    label: 'Fase 2: Adquisición de Requerimientos' },
  en_prototipado:    { fasesHabilitadas: [1, 2, 3], label: 'Fase 3: Prototipado y Validación' },
  en_modelado:       { fasesHabilitadas: [1, 2, 3, 4], label: 'Fase 4: Análisis y Modelado' },
  en_especificacion: { fasesHabilitadas: [1, 2, 3, 4, 5, 6], label: 'Fase 5-6: Especificación SRS' },
  en_validacion:     { fasesHabilitadas: [1, 2, 3, 4, 5, 6, 7], label: 'Fase 7: Validación y Aprobación' },
  con_observaciones: { fasesHabilitadas: [5, 7],    label: 'Revisión post-observaciones (retorno a F5)' },
  aprobado:          { fasesHabilitadas: [8],        label: 'Fase 8: Transición al Desarrollo' },
  cancelado:         { fasesHabilitadas: [],         label: 'SRS cancelado (Gate 1 No-Go)' },
} as const

// ──────────────────────────────────────────────────────────
// REGLAS MOSCW — M3-04 checklist M4, M3-F2-05
// ──────────────────────────────────────────────────────────

export const REGLAS_MOSCOW = {
  mustMinPorcentaje: 40,     // ≥ 40% de todos los RF deben ser Must (por cantidad)
  mustMaxPorcentajeEsfuerzo: 80, // el esfuerzo Must ≤ 80% del total para dejar margen
  mustMinPorcentajeEsfuerzo: 60, // el esfuerzo Must ≥ 60% del total
  couldMaxPorcentaje: 20,    // ≤ 20% de los RF pueden ser Could
  wontRequiereJustificacion: true, // todo Won't Need justificacionWont
} as const
