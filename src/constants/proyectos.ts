// ============================================================
// CONSTANTES MÓDULO 2 — Proyectos
// Fuente: M2-01 (roles, hitos), M2-02 (estimación), M2-03 (riesgos)
// 02-metodologias-agiles.md §7 (Tabla Maestra)
// ============================================================

// -------------------------------------------------------
// METODOLOGÍAS — Tabla Maestra (02-metodologias-agiles.md §7)
// -------------------------------------------------------
export const METODOLOGIAS_CONFIG = {
  cascada: {
    label: 'Cascada',
    tipo: 'plan' as const,
    descripcion: 'Modelo secuencial con fases bien definidas',
    mejorPara: 'Sistemas críticos de seguridad; requerimientos completamente definidos; contratos fijos',
    tamanoEquipo: 'Cualquiera',
    estabilidadReqs: 'Alta (reqs. congelados)',
    documentacion: 'Extensiva y formal',
    entregable: 'Documento de especificación completo',
  },
  incremental: {
    label: 'Incremental',
    tipo: 'plan' as const,
    descripcion: 'Entrega de funcionalidades en incrementos sucesivos',
    mejorPara: 'Sistemas de negocio donde la funcionalidad se puede priorizar; requerimientos conocidos',
    tamanoEquipo: 'Mediano',
    estabilidadReqs: 'Media (estable por incremento)',
    documentacion: 'Moderada por incremento',
    entregable: 'Incrementos funcionales sucesivos',
  },
  agil_scrum: {
    label: 'Ágil / Scrum',
    tipo: 'agil' as const,
    descripcion: 'Sprints de 2-4 semanas con entregas incrementales al cliente',
    mejorPara: 'Sistemas de negocio pequeños/medianos; requerimientos cambiantes; cliente disponible',
    tamanoEquipo: 'Pequeño (5-9 pers.)',
    estabilidadReqs: 'Baja (cambian por sprint)',
    documentacion: 'Mínima (backlog + código)',
    entregable: 'Incremento funcional por sprint (2-4 semanas)',
  },
  agil_xp: {
    label: 'Ágil / XP',
    tipo: 'agil' as const,
    descripcion: 'TDD, pair programming, integración continua, refactoring constante',
    mejorPara: 'Sistemas con requerimientos muy cambiantes; equipos pequeños co-ubicados; alta deuda técnica',
    tamanoEquipo: 'Pequeño (2-6 pers.)',
    estabilidadReqs: 'Muy Baja (cambian continuamente)',
    documentacion: 'Mínima (historias de usuario + pruebas automatizadas)',
    entregable: 'Liberaciones frecuentes (cada 1-2 semanas); código probado',
  },
  rup: {
    label: 'RUP',
    tipo: 'hibrido' as const,
    descripcion: '4 fases: concepción, elaboración, construcción, transición con flujos de trabajo UML',
    mejorPara: 'Proyectos medianos/grandes; equipos distribuidos; integración de subsistemas UML',
    tamanoEquipo: 'Mediano-Grande',
    estabilidadReqs: 'Media-Alta',
    documentacion: 'Extensa (flujos de trabajo documentados)',
    entregable: 'Releases por fase',
  },
  espiral: {
    label: 'Espiral',
    tipo: 'plan' as const,
    descripcion: 'Iteraciones con énfasis en análisis y reducción de riesgos por ciclo',
    mejorPara: 'Proyectos de alto riesgo técnico u organizacional; requieren validación continua',
    tamanoEquipo: 'Mediano',
    estabilidadReqs: 'Media',
    documentacion: 'Moderada-Extensa',
    entregable: 'Prototipos iterativos validados',
  },
} as const

// -------------------------------------------------------
// ROLES DEL EQUIPO — M2-01 §6.3
// -------------------------------------------------------
export const ROLES_EQUIPO = [
  { value: 'PM', label: 'Project Manager (PM)', descripcion: 'Gestión, aprobación y seguimiento del proyecto' },
  { value: 'analista', label: 'Analista', descripcion: 'Definición de requerimientos y objetivos del proyecto' },
  { value: 'arquitecto', label: 'Arquitecto', descripcion: 'Decisiones de diseño técnico y arquitectura del sistema' },
  { value: 'desarrollador', label: 'Desarrollador', descripcion: 'Estimación de complejidad e implementación del código' },
  { value: 'qa', label: 'QA / Testing', descripcion: 'Revisión de entregables y validación de criterios de aceptación' },
  { value: 'scrum_master', label: 'Scrum Master', descripcion: 'Facilitación de ceremonias ágiles y protección del equipo' },
  { value: 'ux_designer', label: 'Diseñador UX', descripcion: 'Especificación de requerimientos de interfaz y experiencia de usuario' },
  { value: 'devops', label: 'DevOps', descripcion: 'Planificación de ambientes y estrategia de despliegue / CI-CD' },
  { value: 'product_owner', label: 'Product Owner', descripcion: 'Representante del cliente; priorización del backlog de producto' },
] as const

// -------------------------------------------------------
// MÉTODOS DE ESTIMACIÓN — M2-02 §7 (Tabla Maestra)
// -------------------------------------------------------
export const METODOS_ESTIMACION_CONFIG = {
  juicio_experto: {
    label: 'Juicio de Experto',
    etapa: 'Cualquier etapa',
    precision: '±50%',
    descripcion: 'Basado en experiencia del equipo e historial tácito de proyectos similares',
  },
  analogia: {
    label: 'Analogía',
    etapa: 'Inicio / propuesta',
    precision: '±30%',
    descripcion: 'Comparación con proyectos históricos de similar complejidad y dominio',
  },
  descomposicion: {
    label: 'Descomposición (WBS)',
    etapa: 'Post-SRS',
    precision: '±20%',
    descripcion: 'Desglose exhaustivo en actividades con WBS completo del alcance',
  },
  cocomo_ii: {
    label: 'COCOMO II',
    etapa: 'Diseño temprano / post-arquitectura',
    precision: '±25%',
    descripcion: 'Modelo algorítmico basado en KSLOC estimado y 5 factores de escala',
  },
  puntos_funcion: {
    label: 'Puntos de Función',
    etapa: 'Post-SRS',
    precision: '±15%',
    descripcion: 'Basado en requerimientos funcionales definidos: entradas, salidas, consultas, archivos, interfaces',
  },
  planning_poker: {
    label: 'Planning Poker (Ágil)',
    etapa: 'Inicio de sprint / iteración',
    precision: '±10% por sprint',
    descripcion: 'Estimación colaborativa del equipo con story points, requiere backlog priorizado y velocidad del equipo',
  },
} as const

// -------------------------------------------------------
// CRITICIDAD CONFIG
// -------------------------------------------------------
export const CRITICIDAD_CONFIG = {
  baja:    { label: 'Baja',    color: 'gray'   },
  media:   { label: 'Media',   color: 'blue'   },
  alta:    { label: 'Alta',    color: 'orange' },
  critica: { label: 'Crítica', color: 'red'    },
} as const

// -------------------------------------------------------
// TIPO DE PROYECTO CONFIG
// -------------------------------------------------------
export const TIPO_PROYECTO_CONFIG = {
  nuevo_desarrollo: { label: 'Nuevo Desarrollo', color: 'blue'   },
  mantenimiento:    { label: 'Mantenimiento',     color: 'green'  },
  migracion:        { label: 'Migración',         color: 'purple' },
  consultoria:      { label: 'Consultoría',       color: 'yellow' },
  integracion:      { label: 'Integración',       color: 'orange' },
} as const

// -------------------------------------------------------
// CATÁLOGO DE RIESGOS INICIALES — M2-03 §4
// Se pre-poblan en PASO 4 del wizard según tipo de proyecto
// -------------------------------------------------------
export const RIESGOS_CATALOGO: Record<string, Array<{
  descripcion: string
  tipo: 'tecnologico' | 'personas' | 'organizacional' | 'requerimientos' | 'estimacion'
  probabilidad: 'muy_baja' | 'baja' | 'media' | 'alta' | 'muy_alta'
  impacto: 'muy_bajo' | 'bajo' | 'medio' | 'alto' | 'muy_alto'
  estrategia: 'evitar' | 'minimizar' | 'contingencia' | 'aceptar'
}>> = {
  nuevo_desarrollo: [
    { descripcion: 'La tecnología seleccionada no soporta los volúmenes de transacciones requeridos.', tipo: 'tecnologico', probabilidad: 'media', impacto: 'alto', estrategia: 'minimizar' },
    { descripcion: 'Componentes de software de terceros contienen defectos que impiden su reutilización.', tipo: 'tecnologico', probabilidad: 'media', impacto: 'medio', estrategia: 'contingencia' },
    { descripcion: 'No es posible reclutar personal con las habilidades técnicas requeridas para el stack definido.', tipo: 'personas', probabilidad: 'alta', impacto: 'alto', estrategia: 'minimizar' },
    { descripcion: 'Los stakeholders proponen cambios al alcance que demandan trabajo de rediseño significativo.', tipo: 'requerimientos', probabilidad: 'alta', impacto: 'alto', estrategia: 'minimizar' },
    { descripcion: 'El tiempo requerido para desarrollar los módulos principales fue subestimado.', tipo: 'estimacion', probabilidad: 'alta', impacto: 'alto', estrategia: 'contingencia' },
    { descripcion: 'La organización se reestructura durante el proyecto y el nuevo responsable tiene prioridades distintas.', tipo: 'organizacional', probabilidad: 'baja', impacto: 'alto', estrategia: 'contingencia' },
  ],
  mantenimiento: [
    { descripcion: 'La documentación técnica del sistema existente está desactualizada o incompleta.', tipo: 'tecnologico', probabilidad: 'alta', impacto: 'medio', estrategia: 'minimizar' },
    { descripcion: 'El sistema contiene deuda técnica que hace que cada corrección introduzca regresiones.', tipo: 'tecnologico', probabilidad: 'alta', impacto: 'alto', estrategia: 'minimizar' },
    { descripcion: 'El desarrollador original no está disponible para transferir conocimiento sobre diseño crítico.', tipo: 'personas', probabilidad: 'media', impacto: 'alto', estrategia: 'contingencia' },
    { descripcion: 'Las estimaciones de tiempo para corregir defectos en código heredado son consistentemente inferiores al tiempo real.', tipo: 'estimacion', probabilidad: 'alta', impacto: 'medio', estrategia: 'contingencia' },
    { descripcion: 'Los usuarios finales rechazan cambios introducidos durante el mantenimiento.', tipo: 'requerimientos', probabilidad: 'media', impacto: 'medio', estrategia: 'minimizar' },
  ],
  migracion: [
    { descripcion: 'La migración de datos produce pérdida o corrupción de registros históricos.', tipo: 'tecnologico', probabilidad: 'media', impacto: 'muy_alto', estrategia: 'evitar' },
    { descripcion: 'Los formatos del sistema legado son incompatibles con el sistema destino y requieren transformaciones no previstas.', tipo: 'tecnologico', probabilidad: 'alta', impacto: 'alto', estrategia: 'minimizar' },
    { descripcion: 'El tiempo de inactividad supera la ventana de mantenimiento acordada con los usuarios.', tipo: 'tecnologico', probabilidad: 'media', impacto: 'alto', estrategia: 'minimizar' },
    { descripcion: 'Los stakeholders cambian requerimientos de datos a migrar una vez iniciado el proceso.', tipo: 'requerimientos', probabilidad: 'media', impacto: 'alto', estrategia: 'evitar' },
    { descripcion: 'El volumen real de datos supera en más del 30% la estimación inicial.', tipo: 'estimacion', probabilidad: 'media', impacto: 'alto', estrategia: 'contingencia' },
  ],
  consultoria: [
    { descripcion: 'Las recomendaciones no son implementadas por la organización cliente por falta de voluntad política.', tipo: 'organizacional', probabilidad: 'alta', impacto: 'alto', estrategia: 'minimizar' },
    { descripcion: 'El alcance del trabajo no está formalmente delimitado, generando expectativas divergentes.', tipo: 'requerimientos', probabilidad: 'alta', impacto: 'alto', estrategia: 'evitar' },
    { descripcion: 'La organización genera dependencia del consultor dificultando la transferencia de conocimiento.', tipo: 'personas', probabilidad: 'media', impacto: 'medio', estrategia: 'minimizar' },
    { descripcion: 'Conflicto de interés entre recomendaciones técnicas óptimas e intereses políticos del cliente.', tipo: 'organizacional', probabilidad: 'media', impacto: 'alto', estrategia: 'contingencia' },
  ],
  integracion: [
    { descripcion: 'Las APIs del sistema externo a integrar son inestables o cambian sin previo aviso.', tipo: 'tecnologico', probabilidad: 'media', impacto: 'alto', estrategia: 'minimizar' },
    { descripcion: 'Las versiones de protocolos entre sistemas son incompatibles.', tipo: 'tecnologico', probabilidad: 'media', impacto: 'alto', estrategia: 'evitar' },
    { descripcion: 'El proveedor del sistema externo no entrega a tiempo la documentación técnica de sus APIs.', tipo: 'personas', probabilidad: 'media', impacto: 'alto', estrategia: 'contingencia' },
    { descripcion: 'Los requerimientos de integración cambian porque el sistema externo lanza una actualización no comunicada.', tipo: 'requerimientos', probabilidad: 'media', impacto: 'alto', estrategia: 'minimizar' },
    { descripcion: 'El volumen de llamadas a la API externa supera los límites del plan contratado.', tipo: 'estimacion', probabilidad: 'baja', impacto: 'medio', estrategia: 'contingencia' },
  ],
}

// Riesgos heredados por nivelRiesgo de entidad — M2-03 §3.2
export const RIESGOS_HEREDADOS: Record<string, Array<{
  descripcion: string
  tipo: 'tecnologico' | 'personas' | 'organizacional' | 'requerimientos' | 'estimacion'
  probabilidad: 'muy_baja' | 'baja' | 'media' | 'alta' | 'muy_alta'
  impacto: 'muy_bajo' | 'bajo' | 'medio' | 'alto' | 'muy_alto'
  estrategia: 'evitar' | 'minimizar' | 'contingencia' | 'aceptar'
}>> = {
  bajo: [],
  medio: [
    { descripcion: 'La organización cliente muestra resistencia al cambio que puede afectar la adopción del sistema.', tipo: 'organizacional', probabilidad: 'media', impacto: 'medio', estrategia: 'minimizar' },
  ],
  alto: [
    { descripcion: 'La organización cliente muestra resistencia al cambio que puede afectar la adopción del sistema.', tipo: 'organizacional', probabilidad: 'alta', impacto: 'alto', estrategia: 'minimizar' },
    { descripcion: 'El personal clave del cliente presenta baja disponibilidad para participar en reuniones críticas del proyecto.', tipo: 'personas', probabilidad: 'alta', impacto: 'medio', estrategia: 'minimizar' },
  ],
  critico: [
    { descripcion: 'La organización cliente muestra resistencia al cambio que puede afectar la adopción del sistema.', tipo: 'organizacional', probabilidad: 'alta', impacto: 'alto', estrategia: 'minimizar' },
    { descripcion: 'El personal clave del cliente presenta baja disponibilidad para participar en reuniones críticas del proyecto.', tipo: 'personas', probabilidad: 'alta', impacto: 'alto', estrategia: 'minimizar' },
    { descripcion: 'Los requerimientos del cliente cambian frecuentemente por inestabilidad organizacional interna.', tipo: 'requerimientos', probabilidad: 'alta', impacto: 'alto', estrategia: 'contingencia' },
    { descripcion: 'La estimación inicial puede verse superada significativamente por la complejidad organizacional del cliente.', tipo: 'estimacion', probabilidad: 'alta', impacto: 'alto', estrategia: 'contingencia' },
  ],
}

// -------------------------------------------------------
// HITOS SUGERIDOS POR TIPO DE PROYECTO — M2-01 §10
// -------------------------------------------------------
export const HITOS_SUGERIDOS: Record<string, Array<{ nombre: string; descripcion: string; entregable: string }>> = {
  nuevo_desarrollo: [
    { nombre: 'Aprobación SRS', descripcion: 'Documento SRS revisado, aprobado y firmado por todas las partes.', entregable: 'SRS firmado (M3)' },
    { nombre: 'Arquitectura aprobada', descripcion: 'Documento de arquitectura del sistema revisado y validado por el equipo técnico.', entregable: 'Documento de arquitectura del sistema' },
    { nombre: 'Prototipo funcional validado', descripcion: 'Demo con las funcionalidades principales del sistema revisado por el cliente.', entregable: 'Demo con funcionalidades clave' },
    { nombre: 'Pruebas de integración completadas', descripcion: 'Informe de pruebas de integración entre módulos aprobado por QA.', entregable: 'Informe de pruebas de integración' },
    { nombre: 'Aceptación del cliente (UAT)', descripcion: 'Pruebas de aceptación de usuario completadas y firmadas por el cliente.', entregable: 'Acta de aceptación del cliente' },
    { nombre: 'Despliegue en producción', descripcion: 'Sistema desplegado en ambiente de producción, documentado y en operación.', entregable: 'Sistema en producción documentado' },
  ],
  mantenimiento: [
    { nombre: 'Análisis de impacto completado', descripcion: 'Informe de análisis de impacto de los cambios requeridos aprobado.', entregable: 'Informe de análisis de impacto' },
    { nombre: 'Cambios implementados en staging', descripcion: 'Build disponible en ambiente de staging para revisión del cliente.', entregable: 'Build en ambiente de staging' },
    { nombre: 'Pruebas de regresión completadas', descripcion: 'Informe de pruebas de regresión aprobado por QA, sin regresiones críticas.', entregable: 'Informe de pruebas de regresión' },
    { nombre: 'Despliegue y verificación', descripcion: 'Sistema actualizado en producción con verificación post-despliegue completada.', entregable: 'Sistema actualizado en producción' },
  ],
  migracion: [
    { nombre: 'Inventario de datos validado', descripcion: 'Catálogo completo de datos a migrar validado con el cliente.', entregable: 'Catálogo de datos a migrar' },
    { nombre: 'Estrategia de migración aprobada', descripcion: 'Documento de estrategia de migración revisado y aprobado por todas las partes.', entregable: 'Documento de estrategia de migración' },
    { nombre: 'Migración en ambiente de prueba', descripcion: 'Migración ejecutada en ambiente de prueba con informe de validación de datos.', entregable: 'Informe de validación de datos migrados' },
    { nombre: 'Plan de rollback documentado', descripcion: 'Procedimiento de rollback aprobado y probado antes de la migración en producción.', entregable: 'Procedimiento de rollback aprobado' },
    { nombre: 'Migración a producción', descripcion: 'Datos migrados a producción y validados contra el inventario inicial.', entregable: 'Datos migrados y validados en producción' },
    { nombre: 'Cierre y documentación', descripcion: 'Manual de operaciones post-migración entregado y aceptado por el cliente.', entregable: 'Manual de operaciones post-migración' },
  ],
  consultoria: [
    { nombre: 'Diagnóstico inicial completado', descripcion: 'Informe de diagnóstico del estado actual de la organización presentado al cliente.', entregable: 'Informe de diagnóstico' },
    { nombre: 'Propuesta de solución entregada', descripcion: 'Documento de propuesta técnica detallada entregado al cliente para revisión.', entregable: 'Documento de propuesta técnica' },
    { nombre: 'Validación de la propuesta', descripcion: 'Reunión de validación completada; cliente aprueba la propuesta con ajustes documentados.', entregable: 'Acta de validación de propuesta' },
    { nombre: 'Entrega de recomendaciones finales', descripcion: 'Informe final de consultoría con todas las recomendaciones formalmente entregado.', entregable: 'Informe final de consultoría' },
  ],
  integracion: [
    { nombre: 'APIs y contratos definidos', descripcion: 'Documento de contrato de integración con especificación de APIs firmado por todas las partes.', entregable: 'Documento de contrato de integración' },
    { nombre: 'Implementación de conectores', descripcion: 'Conectores de integración desarrollados y operativos en ambiente de prueba.', entregable: 'Conectores en ambiente de prueba' },
    { nombre: 'Pruebas E2E completadas', descripcion: 'Informe de pruebas de extremo a extremo aprobado por QA y el cliente.', entregable: 'Informe de pruebas E2E' },
    { nombre: 'Producción y monitoreo', descripcion: 'Sistema integrado en producción con monitoreo activo y dashboard de estado.', entregable: 'Sistema integrado en producción' },
  ],
}
