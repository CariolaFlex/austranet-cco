/**
 * @fileoverview Seed de datos de demostración — Austranet CCO
 *
 * Puebla Firestore con datos realistas para la demo con Austranet.
 *
 * REQUISITOS:
 *   - Service account JSON en la raíz del proyecto (serviceAccountKey.json)
 *     o variable de entorno GOOGLE_APPLICATION_CREDENTIALS apuntando al archivo.
 *   - firebase-admin instalado: npm install firebase-admin
 *   - ts-node instalado: npm install -D ts-node
 *
 * USO:
 *   # Modo normal (idempotente — no crea si ya existe)
 *   npx ts-node --project scripts/tsconfig.json scripts/seed-demo.ts
 *
 *   # Modo reset (borra y recrea todos los datos de demo)
 *   npx ts-node --project scripts/tsconfig.json scripts/seed-demo.ts --reset
 *
 * DATOS CREADOS:
 *   - 2 entidades (constructora + mandante)
 *   - 3 proyectos (1 activo_en_desarrollo, 1 activo_en_definicion, 1 completado)
 *   - Para proyecto activo: 8 tareas, 1 APU aprobado (4 partidas), 6 snapshots EVM,
 *     3 riesgos, 4 hitos, 3 usuarios, 5 notificaciones
 *
 * IDEMPOTENCIA:
 *   Todos los documentos usan IDs deterministas con prefijo "demo-".
 *   Si los documentos ya existen y no se pasa --reset, el script termina sin cambios.
 */

import * as admin from 'firebase-admin'
import * as path from 'path'
import * as fs from 'fs'

// ============================================================
// CONFIGURACIÓN
// ============================================================

const SERVICE_ACCOUNT_PATH = path.join(__dirname, '..', 'serviceAccountKey.json')
const DEMO_PREFIX = 'demo'

// IDs deterministas para idempotencia
const IDS = {
  entidad1: `${DEMO_PREFIX}-entidad-constructora`,
  entidad2: `${DEMO_PREFIX}-entidad-mandante`,
  proyecto1: `${DEMO_PREFIX}-proyecto-activo`,
  proyecto2: `${DEMO_PREFIX}-proyecto-definicion`,
  proyecto3: `${DEMO_PREFIX}-proyecto-completado`,
  usuario_admin: `${DEMO_PREFIX}-usuario-admin`,
  usuario_pm: `${DEMO_PREFIX}-usuario-pm`,
  usuario_analista: `${DEMO_PREFIX}-usuario-analista`,
  apu1: `${DEMO_PREFIX}-apu-edificio`,
  srs1: `${DEMO_PREFIX}-srs-proyecto-activo`,
  srs2: `${DEMO_PREFIX}-srs-proyecto-definicion`,
  repo1: `${DEMO_PREFIX}-repo-proyecto-activo`,
  tarea1: `${DEMO_PREFIX}-tarea-01`,
  tarea2: `${DEMO_PREFIX}-tarea-02`,
  tarea3: `${DEMO_PREFIX}-tarea-03`,
  tarea4: `${DEMO_PREFIX}-tarea-04`,
  tarea5: `${DEMO_PREFIX}-tarea-05`,
  tarea6: `${DEMO_PREFIX}-tarea-06`,
  tarea7: `${DEMO_PREFIX}-tarea-07`,
  tarea8: `${DEMO_PREFIX}-tarea-08`,
} as const

// ============================================================
// INICIALIZACIÓN FIREBASE ADMIN
// ============================================================

function initAdmin(): admin.app.App {
  if (admin.apps.length > 0) return admin.apps[0]!

  // Preferir variable de entorno; si no, buscar el archivo en la raíz
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return admin.initializeApp({ projectId: 'austranet-cco' })
  }

  if (fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require(SERVICE_ACCOUNT_PATH)
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'austranet-cco',
    })
  }

  throw new Error(
    `No se encontró el service account.\n` +
    `Opciones:\n` +
    `  1. Coloca serviceAccountKey.json en la raíz del proyecto\n` +
    `  2. Define GOOGLE_APPLICATION_CREDENTIALS=<ruta-al-json>\n`,
  )
}

// ============================================================
// HELPERS
// ============================================================

function ts(date: Date): admin.firestore.Timestamp {
  return admin.firestore.Timestamp.fromDate(date)
}

/** Fecha relativa a hoy en días (negativo = pasado, positivo = futuro). */
function daysFromNow(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(0, 0, 0, 0)
  return d
}

/** Lunes de la semana N (0 = esta semana, -1 = semana pasada, etc.). */
function mondayOfWeek(weeksOffset: number): string {
  const d = new Date()
  const diaSemana = d.getDay()
  const diasParaLunes = diaSemana === 0 ? -6 : 1 - diaSemana
  d.setDate(d.getDate() + diasParaLunes + weeksOffset * 7)
  d.setHours(0, 0, 0, 0)
  return d.toISOString().slice(0, 10)
}

/** Calcula EVM básico para generar snapshots realistas. */
function calcularEVM(
  bac: number,
  pctPV: number,
  pctEV: number,
  pctAC: number,
): {
  pv: number; ev: number; ac: number
  spi: number; cpi: number; sv: number; cv: number; eac: number; etc: number; tcpi: number
  semaforoCronograma: string; semaforoCostos: string
} {
  const pv = Math.round(bac * pctPV * 100) / 100
  const ev = Math.round(bac * pctEV * 100) / 100
  const ac = Math.round(bac * pctAC * 100) / 100

  const spi = pv === 0 ? 1 : Math.round((ev / pv) * 1000) / 1000
  const cpi = ac === 0 ? 1 : Math.round((ev / ac) * 1000) / 1000
  const sv = Math.round((ev - pv) * 100) / 100
  const cv = Math.round((ev - ac) * 100) / 100
  const eac = cpi === 0 ? bac : Math.round((bac / cpi) * 100) / 100
  const etc = Math.max(0, Math.round((eac - ac) * 100) / 100)
  const den = bac - ac
  const tcpi = den <= 0 ? 0 : Math.round(((bac - ev) / den) * 1000) / 1000

  const semaforoCronograma = spi >= 0.95 ? 'verde' : spi >= 0.80 ? 'amarillo' : 'rojo'
  const semaforoCostos = cpi >= 0.95 ? 'verde' : cpi >= 0.85 ? 'amarillo' : 'rojo'

  return { pv, ev, ac, spi, cpi, sv, cv, eac, etc, tcpi, semaforoCronograma, semaforoCostos }
}

// ============================================================
// RESET
// ============================================================

async function resetDemoData(db: admin.firestore.Firestore): Promise<void> {
  console.log('🗑️  Borrando datos de demo existentes...')

  const batch = db.batch()

  // Entidades
  batch.delete(db.collection('entidades').doc(IDS.entidad1))
  batch.delete(db.collection('entidades').doc(IDS.entidad2))

  // Proyectos
  batch.delete(db.collection('proyectos').doc(IDS.proyecto1))
  batch.delete(db.collection('proyectos').doc(IDS.proyecto2))
  batch.delete(db.collection('proyectos').doc(IDS.proyecto3))

  // APU
  batch.delete(db.collection('apus').doc(IDS.apu1))

  // Tareas
  for (const tareaKey of ['tarea1','tarea2','tarea3','tarea4','tarea5','tarea6','tarea7','tarea8'] as const) {
    batch.delete(db.collection('tareas').doc(IDS[tareaKey]))
  }

  // Usuarios
  batch.delete(db.collection('usuarios').doc(IDS.usuario_admin))
  batch.delete(db.collection('usuarios').doc(IDS.usuario_pm))
  batch.delete(db.collection('usuarios').doc(IDS.usuario_analista))

  await batch.commit()

  // Snapshots EVM (subcol — no admite batch delete directo de subcol)
  for (let i = -5; i <= 0; i++) {
    const docId = mondayOfWeek(i)
    try {
      await db.collection('proyectos').doc(IDS.proyecto1).collection('snapshots_evm').doc(docId).delete()
    } catch {
      // Ignorar si no existe
    }
  }

  // Notificaciones (filtrar por metadata de demo)
  const notis = await db.collection('notificaciones')
    .where('contextoId', '>=', DEMO_PREFIX)
    .where('contextoId', '<', DEMO_PREFIX + '\uffff')
    .get()
  const notiBatch = db.batch()
  notis.docs.forEach((d) => notiBatch.delete(d.ref))
  if (!notis.empty) await notiBatch.commit()

  // SRS
  try { await db.collection('srs').doc(IDS.srs1).delete() } catch { /* ignorar */ }
  try { await db.collection('srs').doc(IDS.srs2).delete() } catch { /* ignorar */ }

  // Repositorio de configuración
  try { await db.collection('repositorios_configuracion').doc(IDS.repo1).delete() } catch { /* ignorar */ }

  // Historial del proyecto (subcol — listar y borrar todos los docs)
  try {
    const historialDocs = await db.collection('proyectos').doc(IDS.proyecto1).collection('historial').listDocuments()
    if (historialDocs.length > 0) {
      const histBatch = db.batch()
      historialDocs.forEach((d) => histBatch.delete(d))
      await histBatch.commit()
    }
  } catch { /* ignorar */ }

  console.log('✅ Datos de demo borrados.')
}

// ============================================================
// VERIFICAR EXISTENCIA
// ============================================================

async function yaExisteDatos(db: admin.firestore.Firestore): Promise<boolean> {
  const doc = await db.collection('entidades').doc(IDS.entidad1).get()
  return doc.exists
}

// ============================================================
// SEED — ENTIDADES
// ============================================================

async function seedEntidades(db: admin.firestore.Firestore): Promise<void> {
  console.log('🏢 Creando entidades...')
  const now = new Date()

  const constructora = {
    tipo: 'cliente',
    razonSocial: 'Constructora del Sur S.A.',
    nombreComercial: 'ConSur',
    rut: '76.543.210-9',
    sector: 'construccion',
    pais: 'Chile',
    ciudad: 'Santiago',
    direccion: 'Av. Apoquindo 4501, Las Condes',
    sitioWeb: 'https://consur.cl',
    estado: 'activo',
    nivelRiesgo: 'bajo',
    tieneNDA: true,
    fechaNDA: ts(daysFromNow(-180)),
    disponibilidadParaSprints: true,
    aceptaEntregasIncrementales: true,
    stakeholders: [
      {
        id: 's1',
        nombre: 'María Fernández',
        cargo: 'Gerente de TI',
        email: 'mfernandez@consur.cl',
        rol: 'sponsor',
        nivelInfluencia: 'alto',
        nivelInteres: 'alto',
        canalComunicacion: 'email',
      },
      {
        id: 's2',
        nombre: 'Jorge Salinas',
        cargo: 'Jefe de Proyectos',
        email: 'jsalinas@consur.cl',
        rol: 'decisor',
        nivelInfluencia: 'medio',
        nivelInteres: 'alto',
        canalComunicacion: 'Teams',
      },
    ],
    creadoEn: ts(daysFromNow(-200)),
    actualizadoEn: ts(now),
    creadoPor: IDS.usuario_admin,
  }

  const mandante = {
    tipo: 'proveedor',
    razonSocial: 'Inmobiliaria Los Olivos Ltda.',
    nombreComercial: 'Olivos',
    rut: '77.234.567-1',
    sector: 'construccion',
    pais: 'Chile',
    ciudad: 'Viña del Mar',
    estado: 'activo',
    nivelRiesgo: 'medio',
    tieneNDA: false,
    disponibilidadParaSprints: false,
    aceptaEntregasIncrementales: true,
    stakeholders: [
      {
        id: 's3',
        nombre: 'Roberto Pizarro',
        cargo: 'Director General',
        email: 'rpizarro@olivos.cl',
        rol: 'sponsor',
        nivelInfluencia: 'alto',
        nivelInteres: 'medio',
      },
    ],
    creadoEn: ts(daysFromNow(-90)),
    actualizadoEn: ts(now),
    creadoPor: IDS.usuario_admin,
  }

  await db.collection('entidades').doc(IDS.entidad1).set(constructora)
  await db.collection('entidades').doc(IDS.entidad2).set(mandante)
  console.log('  ✓ 2 entidades creadas')
}

// ============================================================
// SEED — USUARIOS
// ============================================================

async function seedUsuarios(db: admin.firestore.Firestore): Promise<void> {
  console.log('👥 Creando usuarios de demo...')

  await db.collection('usuarios').doc(IDS.usuario_admin).set({
    uid: IDS.usuario_admin,
    email: 'admin@austranet.demo',
    nombre: 'Carlos Administrador',
    rol: 'admin',
    activo: true,
    creadoEn: ts(daysFromNow(-200)),
  })

  await db.collection('usuarios').doc(IDS.usuario_pm).set({
    uid: IDS.usuario_pm,
    email: 'pm@austranet.demo',
    nombre: 'Ana González (PM)',
    rol: 'gestor',
    activo: true,
    creadoEn: ts(daysFromNow(-200)),
  })

  await db.collection('usuarios').doc(IDS.usuario_analista).set({
    uid: IDS.usuario_analista,
    email: 'analista@austranet.demo',
    nombre: 'Pedro Analista',
    rol: 'analista',
    activo: true,
    creadoEn: ts(daysFromNow(-200)),
  })

  console.log('  ✓ 3 usuarios creados (admin, pm, analista)')
}

// ============================================================
// SEED — PROYECTOS
// ============================================================

async function seedProyectos(db: admin.firestore.Firestore): Promise<void> {
  console.log('📁 Creando proyectos...')
  const BAC = 48_500_000  // CLP

  // ── PROYECTO 1: activo_en_desarrollo ──────────────────────
  const evm6Semanas = calcularEVM(BAC, 0.58, 0.55, 0.57)
  const proyecto1 = {
    codigo: 'CCO-2025-001',
    nombre: 'Sistema de Gestión de Obras CCO',
    descripcion: 'Desarrollo del sistema integrado de gestión de proyectos de construcción con módulos de planificación, control de costos (EVM) y seguimiento de APU.',
    tipo: 'nuevo_desarrollo',
    estado: 'activo_en_desarrollo',
    criticidad: 'alta',
    metodologia: 'agil_scrum',
    justificacionMetodologia: 'El cliente requiere entregas incrementales cada 2 semanas y tiene alta disponibilidad para revisiones.',
    clienteId: IDS.entidad1,
    equipo: [
      { usuarioId: IDS.usuario_pm, nombre: 'Ana González (PM)', rol: 'PM', esExterno: false },
      { usuarioId: IDS.usuario_analista, nombre: 'Pedro Analista', rol: 'analista', esExterno: false },
      { usuarioId: IDS.usuario_admin, nombre: 'Carlos Administrador', rol: 'arquitecto', esExterno: false },
    ],
    riesgos: [
      {
        id: 'r1',
        descripcion: 'Cambios frecuentes en los requerimientos de módulo APU',
        tipo: 'requerimientos',
        probabilidad: 'media',
        impacto: 'alto',
        estrategia: 'minimizar',
        mitigacion: 'Sesiones de refinamiento semanales con el cliente',
        responsable: 'Ana González',
        estado: 'activo',
        origen: 'identificado_proyecto',
      },
      {
        id: 'r2',
        descripcion: 'Integración con sistema ERP legado de ConSur',
        tipo: 'tecnologico',
        probabilidad: 'alta',
        impacto: 'muy_alto',
        estrategia: 'contingencia',
        mitigacion: 'Desarrollar adaptador de API REST con capa de abstracción',
        responsable: 'Pedro Analista',
        estado: 'mitigado',
        origen: 'identificado_proyecto',
      },
      {
        id: 'r3',
        descripcion: 'Disponibilidad del equipo técnico cliente para pruebas UAT',
        tipo: 'personas',
        probabilidad: 'alta',
        impacto: 'medio',
        estrategia: 'evitar',
        mitigacion: 'Calendario de UAT confirmado con mes de anticipación',
        responsable: 'María Fernández',
        estado: 'materializado',
        origen: 'identificado_proyecto',
      },
    ],
    hitos: [
      {
        id: 'h1',
        nombre: 'Kick-off y aprobación de SRS',
        descripcion: 'Reunión de inicio del proyecto y firma del SRS v1.0',
        fechaEstimada: ts(daysFromNow(-90)),
        fechaReal: ts(daysFromNow(-88)),
        estado: 'completado',
        entregable: 'SRS v1.0 firmado',
        responsable: 'Ana González',
      },
      {
        id: 'h2',
        nombre: 'Entrega MVP — Módulos M1 y M2',
        descripcion: 'Módulos de Entidades y Proyectos funcionando en producción',
        fechaEstimada: ts(daysFromNow(-30)),
        fechaReal: ts(daysFromNow(-28)),
        estado: 'completado',
        entregable: 'Deploy en Firebase Hosting',
        responsable: 'Ana González',
      },
      {
        id: 'h3',
        nombre: 'Entrega M4 + M5 (Cronograma + APU)',
        descripcion: 'Gantt, EVM y APU completos con exportación PDF/CSV',
        fechaEstimada: ts(daysFromNow(14)),
        estado: 'en_riesgo',
        entregable: 'Deploy + documentación de usuario',
        responsable: 'Pedro Analista',
      },
      {
        id: 'h4',
        nombre: 'Cierre del proyecto y aceptación final',
        descripcion: 'UAT completado, lecciones aprendidas y cierre contractual',
        fechaEstimada: ts(daysFromNow(60)),
        estado: 'pendiente',
        entregable: 'Acta de aceptación firmada',
        responsable: 'Ana González',
      },
    ],
    presupuesto: {
      metodoUsado: 'descomposicion',
      estimacionMinima: 42_000_000,
      estimacionNominal: BAC,
      estimacionMaxima: 55_000_000,
      moneda: 'CLP',
      supuestos: ['Equipo de 3 personas a tiempo completo', 'Cliente disponible para revisiones semanales'],
      exclusiones: ['Infraestructura de producción', 'Licencias de terceros'],
    },
    presupuestoEstimado: BAC,
    moneda: 'CLP',
    fechaInicio: daysFromNow(-120),
    fechaFinEstimada: daysFromNow(60),
    estadoSRS: 'aprobado',
    kpisDashboard: {
      ...evm6Semanas,
      bac: BAC,
      desviacionDias: -5,
      pctAvanceTareas: 62.5,
      pctAvancePonderado: evm6Semanas.ev / BAC * 100,
      semaforoGeneral: 'amarillo',
      actualizadoEn: ts(new Date()),
    },
    creadoEn: ts(daysFromNow(-120)),
    actualizadoEn: ts(new Date()),
    creadoPor: IDS.usuario_admin,
  }

  // ── PROYECTO 2: activo_en_definicion ──────────────────────
  const proyecto2 = {
    codigo: 'CCO-2025-002',
    nombre: 'Portal Web Inmobiliaria Los Olivos',
    descripcion: 'Portal de gestión de propiedades y atención a clientes para Inmobiliaria Los Olivos.',
    tipo: 'nuevo_desarrollo',
    estado: 'activo_en_definicion',
    criticidad: 'media',
    metodologia: 'cascada',
    clienteId: IDS.entidad2,
    equipo: [
      { usuarioId: IDS.usuario_pm, nombre: 'Ana González (PM)', rol: 'PM', esExterno: false },
    ],
    riesgos: [
      {
        id: 'r4',
        descripcion: 'Falta de claridad en los requerimientos funcionales del portal',
        tipo: 'requerimientos',
        probabilidad: 'alta',
        impacto: 'alto',
        estrategia: 'minimizar',
        estado: 'activo',
        origen: 'identificado_proyecto',
      },
    ],
    hitos: [
      {
        id: 'h5',
        nombre: 'Aprobación de SRS',
        descripcion: 'Firma del SRS completo por parte del cliente',
        fechaEstimada: ts(daysFromNow(30)),
        estado: 'pendiente',
        responsable: 'Ana González',
      },
    ],
    presupuestoEstimado: 18_000_000,
    moneda: 'CLP',
    fechaInicio: daysFromNow(-15),
    fechaFinEstimada: daysFromNow(150),
    estadoSRS: 'en_especificacion',
    creadoEn: ts(daysFromNow(-15)),
    actualizadoEn: ts(new Date()),
    creadoPor: IDS.usuario_admin,
  }

  // ── PROYECTO 3: completado ────────────────────────────────
  const proyecto3 = {
    codigo: 'CCO-2024-008',
    nombre: 'Migración ERP ConSur v2 → v3',
    descripcion: 'Migración del sistema ERP de ConSur desde la versión 2.1 a la versión 3.0 con nueva arquitectura cloud.',
    tipo: 'migracion',
    estado: 'completado',
    criticidad: 'critica',
    metodologia: 'incremental',
    clienteId: IDS.entidad1,
    equipo: [
      { usuarioId: IDS.usuario_pm, nombre: 'Ana González (PM)', rol: 'PM', esExterno: false },
      { usuarioId: IDS.usuario_analista, nombre: 'Pedro Analista', rol: 'arquitecto', esExterno: false },
    ],
    riesgos: [],
    hitos: [],
    presupuestoEstimado: 62_000_000,
    moneda: 'CLP',
    fechaInicio: daysFromNow(-365),
    fechaFinEstimada: daysFromNow(-30),
    estadoSRS: 'aprobado',
    kpisDashboard: {
      spi: 0.97,
      cpi: 1.03,
      sv: 0,
      cv: 1_805_826,
      pv: 62_000_000,
      ev: 62_000_000,
      ac: 60_194_174,
      eac: 60_194_174,
      etc: 0,
      tcpi: 1,
      bac: 62_000_000,
      desviacionDias: 0,
      pctAvanceTareas: 100,
      pctAvancePonderado: 100,
      semaforoGeneral: 'verde',
      semaforoCronograma: 'verde',
      semaforoCostos: 'verde',
      actualizadoEn: ts(daysFromNow(-30)),
    },
    creadoEn: ts(daysFromNow(-365)),
    actualizadoEn: ts(daysFromNow(-30)),
    creadoPor: IDS.usuario_admin,
  }

  await db.collection('proyectos').doc(IDS.proyecto1).set(proyecto1)
  await db.collection('proyectos').doc(IDS.proyecto2).set(proyecto2)
  await db.collection('proyectos').doc(IDS.proyecto3).set(proyecto3)
  console.log('  ✓ 3 proyectos creados')
}

// ============================================================
// SEED — TAREAS (Proyecto activo)
// ============================================================

async function seedTareas(db: admin.firestore.Firestore): Promise<void> {
  console.log('📋 Creando tareas...')

  const tareas = [
    {
      id: IDS.tarea1,
      proyectoId: IDS.proyecto1,
      nombre: 'Levantamiento y análisis de requerimientos',
      descripcion: 'Entrevistas con stakeholders, taller de requerimientos, documentación SRS',
      tipo: 'tarea',
      wbsCode: '1.0',
      nivel: 1,
      estado: 'completada',
      orden: 1,
      porcentajeAvance: 100,
      duracionDias: 10,
      fechaInicioPlaneada: ts(daysFromNow(-118)),
      fechaFinPlaneada: ts(daysFromNow(-108)),
      costoPlaneado: 4_200_000,
      costoReal: 4_350_000,
      responsable: IDS.usuario_analista,
      dependencias: [],
      asignaciones: [IDS.usuario_analista, IDS.usuario_pm],
      holguraTotal: 0,
      holguraLibre: 0,
      esCritica: true,
    },
    {
      id: IDS.tarea2,
      proyectoId: IDS.proyecto1,
      nombre: 'Diseño de arquitectura del sistema',
      descripcion: 'Diagramas de arquitectura, modelo de datos Firestore, definición de APIs',
      tipo: 'tarea',
      wbsCode: '2.0',
      nivel: 1,
      estado: 'completada',
      orden: 2,
      porcentajeAvance: 100,
      duracionDias: 8,
      fechaInicioPlaneada: ts(daysFromNow(-108)),
      fechaFinPlaneada: ts(daysFromNow(-100)),
      costoPlaneado: 3_800_000,
      costoReal: 3_650_000,
      responsable: IDS.usuario_admin,
      dependencias: [{ tareaIdPredecesora: IDS.tarea1, tipo: 'FS', lagDias: 0 }],
      asignaciones: [IDS.usuario_admin],
      holguraTotal: 0,
      holguraLibre: 0,
      esCritica: true,
    },
    {
      id: IDS.tarea3,
      proyectoId: IDS.proyecto1,
      nombre: 'Módulo M1 — Entidades y stakeholders',
      descripcion: 'CRUD de entidades, wizard de registro, evaluación de factibilidad, KPIs',
      tipo: 'tarea',
      wbsCode: '3.0',
      nivel: 1,
      estado: 'completada',
      orden: 3,
      porcentajeAvance: 100,
      duracionDias: 15,
      fechaInicioPlaneada: ts(daysFromNow(-100)),
      fechaFinPlaneada: ts(daysFromNow(-85)),
      costoPlaneado: 7_200_000,
      costoReal: 7_450_000,
      responsable: IDS.usuario_pm,
      dependencias: [{ tareaIdPredecesora: IDS.tarea2, tipo: 'FS', lagDias: 0 }],
      asignaciones: [IDS.usuario_pm, IDS.usuario_analista],
      holguraTotal: 0,
      holguraLibre: 0,
      esCritica: true,
    },
    {
      id: IDS.tarea4,
      proyectoId: IDS.proyecto1,
      nombre: 'Módulo M2 — Proyectos y ciclo de vida',
      descripcion: 'Wizard de 7 pasos, gestión de riesgos, hitos, seguimiento y cierre',
      tipo: 'tarea',
      wbsCode: '4.0',
      nivel: 1,
      estado: 'completada',
      orden: 4,
      porcentajeAvance: 100,
      duracionDias: 18,
      fechaInicioPlaneada: ts(daysFromNow(-85)),
      fechaFinPlaneada: ts(daysFromNow(-67)),
      costoPlaneado: 8_400_000,
      costoReal: 8_100_000,
      responsable: IDS.usuario_pm,
      dependencias: [{ tareaIdPredecesora: IDS.tarea3, tipo: 'FS', lagDias: 0 }],
      asignaciones: [IDS.usuario_pm, IDS.usuario_analista],
      holguraTotal: 0,
      holguraLibre: 0,
      esCritica: true,
    },
    {
      id: IDS.tarea5,
      proyectoId: IDS.proyecto1,
      nombre: 'Módulo M3 — Alcance y SRS',
      descripcion: 'SRS bajo IEEE 830, 8 fases, trazabilidad, CCB, exportación PDF/DOCX',
      tipo: 'tarea',
      wbsCode: '5.0',
      nivel: 1,
      estado: 'completada',
      orden: 5,
      porcentajeAvance: 100,
      duracionDias: 12,
      fechaInicioPlaneada: ts(daysFromNow(-67)),
      fechaFinPlaneada: ts(daysFromNow(-55)),
      costoPlaneado: 5_500_000,
      costoReal: 5_320_000,
      responsable: IDS.usuario_analista,
      dependencias: [{ tareaIdPredecesora: IDS.tarea4, tipo: 'FS', lagDias: 0 }],
      asignaciones: [IDS.usuario_analista],
      holguraTotal: 0,
      holguraLibre: 0,
      esCritica: true,
    },
    {
      id: IDS.tarea6,
      proyectoId: IDS.proyecto1,
      nombre: 'Módulo M4 — Cronograma y EVM',
      descripcion: 'Gantt, CPM/PERT, curvas S, histograma de recursos, portafolio',
      tipo: 'tarea',
      wbsCode: '6.0',
      nivel: 1,
      estado: 'en_progreso',
      orden: 6,
      porcentajeAvance: 85,
      duracionDias: 20,
      fechaInicioPlaneada: ts(daysFromNow(-55)),
      fechaFinPlaneada: ts(daysFromNow(-35)),
      costoPlaneado: 9_400_000,
      costoReal: 9_200_000,
      responsable: IDS.usuario_admin,
      dependencias: [{ tareaIdPredecesora: IDS.tarea5, tipo: 'FS', lagDias: 0 }],
      asignaciones: [IDS.usuario_admin, IDS.usuario_pm],
      holguraTotal: 0,
      holguraLibre: 0,
      esCritica: true,
      apuId: IDS.apu1,
      apuPartidaId: 'p1',
      cantidad: 1,
      costoUnitarioAPU: 9_400_000,
    },
    {
      id: IDS.tarea7,
      proyectoId: IDS.proyecto1,
      nombre: 'Módulo M5 — APU y catálogo de insumos',
      descripcion: 'APU con partidas/insumos, vinculación Tarea↔APU, catálogo global, exportación',
      tipo: 'tarea',
      wbsCode: '7.0',
      nivel: 1,
      estado: 'en_progreso',
      orden: 7,
      porcentajeAvance: 75,
      duracionDias: 14,
      fechaInicioPlaneada: ts(daysFromNow(-35)),
      fechaFinPlaneada: ts(daysFromNow(-21)),
      costoPlaneado: 6_300_000,
      costoReal: 5_100_000,
      responsable: IDS.usuario_pm,
      dependencias: [{ tareaIdPredecesora: IDS.tarea6, tipo: 'FS', lagDias: 0 }],
      asignaciones: [IDS.usuario_pm, IDS.usuario_analista],
      holguraTotal: 0,
      holguraLibre: 0,
      esCritica: true,
      apuId: IDS.apu1,
      apuPartidaId: 'p2',
      cantidad: 1,
      costoUnitarioAPU: 6_300_000,
    },
    {
      id: IDS.tarea8,
      proyectoId: IDS.proyecto1,
      nombre: 'QA, pruebas UAT y deploy final',
      descripcion: 'Pruebas de aceptación con el cliente, correcciones, deploy a Firebase Hosting',
      tipo: 'tarea',
      wbsCode: '8.0',
      nivel: 1,
      estado: 'pendiente',
      orden: 8,
      porcentajeAvance: 30,
      duracionDias: 15,
      fechaInicioPlaneada: ts(daysFromNow(-10)),
      fechaFinPlaneada: ts(daysFromNow(5)),
      costoPlaneado: 3_700_000,
      costoReal: 1_200_000,
      responsable: IDS.usuario_analista,
      dependencias: [{ tareaIdPredecesora: IDS.tarea7, tipo: 'FS', lagDias: 0 }],
      asignaciones: [IDS.usuario_analista, IDS.usuario_pm, IDS.usuario_admin],
      holguraTotal: 5,
      holguraLibre: 5,
      esCritica: false,
    },
  ]

  const batch = db.batch()
  for (const tarea of tareas) {
    const { id, ...data } = tarea
    batch.set(db.collection('tareas').doc(id), data)
  }
  await batch.commit()
  console.log('  ✓ 8 tareas creadas')
}

// ============================================================
// SEED — APU
// ============================================================

async function seedAPU(db: admin.firestore.Firestore): Promise<void> {
  console.log('📊 Creando APU...')

  const apu = {
    proyectoId: IDS.proyecto1,
    codigo: 'APU-CCO-001',
    nombre: 'APU Sistema Gestión de Obras',
    descripcion: 'Análisis de Precios Unitarios para el desarrollo completo del sistema CCO',
    estado: 'aprobado',
    moneda: 'CLP',
    version: 1,
    partidas: [
      {
        id: 'p1',
        codigo: 'M4-CRONOGRAMA',
        nombre: 'Módulo Cronograma y Control EVM',
        descripcion: 'Desarrollo del módulo M4: Gantt, CPM, PERT, curvas S, histograma',
        unidad: 'GL',
        cantidad: 1,
        insumos: [
          {
            id: 'i1',
            tipo: 'mano_obra',
            descripcion: 'Desarrollador Senior Frontend',
            unidad: 'hora',
            cantidad: 320,
            precioUnitario: 18_500,
            subtotal: 5_920_000,
          },
          {
            id: 'i2',
            tipo: 'mano_obra',
            descripcion: 'Arquitecto de Software',
            unidad: 'hora',
            cantidad: 80,
            precioUnitario: 24_000,
            subtotal: 1_920_000,
          },
          {
            id: 'i3',
            tipo: 'equipo',
            descripcion: 'Licencias Recharts + gantt-task-react + @xyflow',
            unidad: 'GL',
            cantidad: 1,
            precioUnitario: 0,
            subtotal: 0,
          },
        ],
        costoDirecto: 7_840_000,
        ggPct: 10,
        utilidadPct: 5,
        precioUnitario: 9_408_000,
        subtotal: 9_408_000,
      },
      {
        id: 'p2',
        codigo: 'M5-APU',
        nombre: 'Módulo APU y Catálogo de Insumos',
        descripcion: 'Desarrollo del módulo M5: CRUD APU, vinculación, catálogo global, exportación',
        unidad: 'GL',
        cantidad: 1,
        insumos: [
          {
            id: 'i4',
            tipo: 'mano_obra',
            descripcion: 'Desarrollador Senior Fullstack',
            unidad: 'hora',
            cantidad: 240,
            precioUnitario: 18_500,
            subtotal: 4_440_000,
          },
          {
            id: 'i5',
            tipo: 'mano_obra',
            descripcion: 'Analista de Negocio',
            unidad: 'hora',
            cantidad: 60,
            precioUnitario: 15_000,
            subtotal: 900_000,
          },
        ],
        costoDirecto: 5_340_000,
        ggPct: 10,
        utilidadPct: 5,
        precioUnitario: 6_195_000,
        subtotal: 6_195_000,  // ajustado por presupuesto nominal
      },
      {
        id: 'p3',
        codigo: 'QA-PRUEBAS',
        nombre: 'QA, pruebas UAT y documentación',
        descripcion: 'Pruebas funcionales, pruebas de aceptación con el cliente, documentación técnica y de usuario',
        unidad: 'GL',
        cantidad: 1,
        insumos: [
          {
            id: 'i6',
            tipo: 'mano_obra',
            descripcion: 'QA Tester',
            unidad: 'hora',
            cantidad: 120,
            precioUnitario: 12_000,
            subtotal: 1_440_000,
          },
          {
            id: 'i7',
            tipo: 'mano_obra',
            descripcion: 'Technical Writer',
            unidad: 'hora',
            cantidad: 40,
            precioUnitario: 13_000,
            subtotal: 520_000,
          },
        ],
        costoDirecto: 1_960_000,
        ggPct: 10,
        utilidadPct: 5,
        precioUnitario: 2_250_000,
        subtotal: 2_250_000,
      },
      {
        id: 'p4',
        codigo: 'INFRA-DEPLOY',
        nombre: 'Infraestructura y deploy Firebase',
        descripcion: 'Configuración Firebase Hosting, Firestore rules, Cloud Functions, dominio',
        unidad: 'GL',
        cantidad: 1,
        insumos: [
          {
            id: 'i8',
            tipo: 'material',
            descripcion: 'Firebase Blaze plan (estimación anual)',
            unidad: 'mes',
            cantidad: 12,
            precioUnitario: 85_000,
            subtotal: 1_020_000,
          },
          {
            id: 'i9',
            tipo: 'mano_obra',
            descripcion: 'DevOps / infraestructura',
            unidad: 'hora',
            cantidad: 24,
            precioUnitario: 22_000,
            subtotal: 528_000,
          },
        ],
        costoDirecto: 1_548_000,
        ggPct: 10,
        utilidadPct: 5,
        precioUnitario: 1_785_000,
        subtotal: 1_785_000,
      },
    ],
    costoTotalDirecto: 16_688_000,
    totalGG: 1_668_800,
    totalUtilidad: 1_668_800,
    totalAPU: 19_638_000,
    aprobadoPor: IDS.usuario_admin,
    aprobadoEn: ts(daysFromNow(-60)),
    creadoEn: ts(daysFromNow(-90)),
    actualizadoEn: ts(daysFromNow(-60)),
    creadoPor: IDS.usuario_pm,
  }

  await db.collection('apus').doc(IDS.apu1).set(apu)
  console.log('  ✓ 1 APU aprobado con 4 partidas')
}

// ============================================================
// SEED — SNAPSHOTS EVM
// ============================================================

async function seedSnapshotsEVM(db: admin.firestore.Firestore): Promise<void> {
  console.log('📈 Creando snapshots EVM históricos...')
  const BAC = 48_500_000

  // 6 semanas de historia con valores EVM realistas (progresión)
  // SPI levemente bajo plan (proyecto va un poco retrasado)
  // CPI razonable (dentro de presupuesto con leve desviación)
  const semanas: Array<{ offset: number; pctPV: number; pctEV: number; pctAC: number }> = [
    { offset: -5, pctPV: 0.12, pctEV: 0.10, pctAC: 0.11 },
    { offset: -4, pctPV: 0.22, pctEV: 0.19, pctAC: 0.21 },
    { offset: -3, pctPV: 0.33, pctEV: 0.29, pctAC: 0.31 },
    { offset: -2, pctPV: 0.44, pctEV: 0.40, pctAC: 0.43 },
    { offset: -1, pctPV: 0.52, pctEV: 0.48, pctAC: 0.50 },
    { offset: 0,  pctPV: 0.58, pctEV: 0.55, pctAC: 0.57 },
  ]

  for (const semana of semanas) {
    const snapshotId = mondayOfWeek(semana.offset)
    const fecha = new Date(snapshotId + 'T00:00:00')
    const evm = calcularEVM(BAC, semana.pctPV, semana.pctEV, semana.pctAC)

    await db
      .collection('proyectos')
      .doc(IDS.proyecto1)
      .collection('snapshots_evm')
      .doc(snapshotId)
      .set({
        fecha: ts(fecha),
        bac: BAC,
        pv: evm.pv,
        ev: evm.ev,
        ac: evm.ac,
        spi: evm.spi,
        cpi: evm.cpi,
        sv: evm.sv,
        cv: evm.cv,
        eac: evm.eac,
        etc: evm.etc,
        tcpi: evm.tcpi,
        semaforoSPI: evm.semaforoCronograma,
        semaforoCPI: evm.semaforoCostos,
        creadoEn: ts(fecha),
      })
  }

  console.log('  ✓ 6 snapshots EVM creados (últimas 6 semanas)')
}

// ============================================================
// SEED — NOTIFICACIONES
// ============================================================

async function seedNotificaciones(db: admin.firestore.Firestore): Promise<void> {
  console.log('🔔 Creando notificaciones...')

  const notificaciones = [
    {
      tipo: 'alerta',
      prioridad: 'critica',
      titulo: 'Riesgo materializado: UAT sin participantes',
      mensaje: 'El riesgo R3 se materializó. El equipo técnico de ConSur no está disponible para las pruebas UAT programadas esta semana.',
      leida: false,
      contextoId: IDS.proyecto1,
      contextoTipo: 'proyecto',
      modulo: 'M2',
      destinatarioId: IDS.usuario_pm,
      creadoEn: ts(daysFromNow(-2)),
    },
    {
      tipo: 'alerta',
      prioridad: 'alta',
      titulo: 'Hito en riesgo: Entrega M4+M5',
      mensaje: 'El hito "Entrega M4+M5" está en riesgo. Faltan 14 días y el avance ponderado es del 55%.',
      leida: false,
      contextoId: IDS.proyecto1,
      contextoTipo: 'proyecto',
      modulo: 'M2',
      destinatarioId: IDS.usuario_pm,
      creadoEn: ts(daysFromNow(-1)),
    },
    {
      tipo: 'info',
      prioridad: 'media',
      titulo: 'APU aprobado: APU-CCO-001',
      mensaje: 'El APU "APU Sistema Gestión de Obras" fue aprobado y está disponible para vinculación con tareas.',
      leida: true,
      contextoId: IDS.apu1,
      contextoTipo: 'apu',
      modulo: 'M5',
      destinatarioId: IDS.usuario_pm,
      creadoEn: ts(daysFromNow(-60)),
    },
    {
      tipo: 'info',
      prioridad: 'baja',
      titulo: 'Snapshot EVM semanal generado',
      mensaje: 'El snapshot EVM de esta semana fue creado. SPI: 0.948 (amarillo). CPI: 0.965 (verde).',
      leida: true,
      contextoId: IDS.proyecto1,
      contextoTipo: 'proyecto',
      modulo: 'M4',
      destinatarioId: IDS.usuario_admin,
      creadoEn: ts(daysFromNow(-7)),
    },
    {
      tipo: 'alerta',
      prioridad: 'alta',
      titulo: 'SPI por debajo del umbral: Proyecto CCO-2025-001',
      mensaje: 'El SPI del proyecto ha bajado a 0.948, por debajo del umbral verde (0.95). Se recomienda revisar el cronograma.',
      leida: false,
      contextoId: IDS.proyecto1,
      contextoTipo: 'proyecto',
      modulo: 'M4',
      destinatarioId: IDS.usuario_admin,
      creadoEn: ts(daysFromNow(-1)),
    },
  ]

  const batch = db.batch()
  for (const notif of notificaciones) {
    batch.set(db.collection('notificaciones').doc(), notif)
  }
  await batch.commit()
  console.log('  ✓ 5 notificaciones creadas')
}

// ============================================================
// SEED — ALCANCE (SRS)
// ============================================================

async function seedAlcance(db: admin.firestore.Firestore): Promise<void> {
  console.log('📋 Creando documentos SRS...')

  // SRS para proyecto1 (activo_en_desarrollo — SRS aprobado)
  await db.collection('srs').doc(IDS.srs1).set({
    proyectoId: IDS.proyecto1,
    version: 'v1.0',
    estado: 'aprobado',
    tipoSRS: 'completo',
    gate1Estado: 'go',
    gate1FechaDecision: ts(daysFromNow(-85)),
    gate1DecisionPor: IDS.usuario_admin,
    stakeholdersSRS: [
      {
        id: 'ss1',
        nombre: 'María Fernández',
        cargo: 'Gerente de TI',
        email: 'mfernandez@consur.cl',
        rol: 'cliente_clave',
        nivelParticipacion: 'alto',
        tecnicasAplicadas: ['entrevista', 'taller'],
      },
      {
        id: 'ss2',
        nombre: 'Jorge Salinas',
        cargo: 'Jefe de Proyectos',
        email: 'jsalinas@consur.cl',
        rol: 'usuario_final',
        nivelParticipacion: 'medio',
        tecnicasAplicadas: ['cuestionario'],
      },
    ],
    riesgosSRS: [
      {
        id: 'rs1',
        descripcion: 'Requerimientos volátiles en módulo EVM',
        probabilidad: 'media',
        impacto: 'alto',
        mitigacion: 'Revisión semanal de requerimientos con el cliente',
      },
    ],
    tecnicasActivas: ['entrevista', 'taller', 'casos_uso'],
    prototipos: [],
    iteracionesBucle: [],
    artefactosModelo: [],
    checklistValidacion: [
      { item: 'Requerimientos completos y sin ambigüedad', cumple: true },
      { item: 'Trazabilidad bidireccional verificada', cumple: true },
      { item: 'Aprobación formal del cliente', cumple: true },
    ],
    observacionesValidacion: [],
    ccbSRS: [
      { id: 'ccb1', nombre: 'Ana González', rol: 'PM', voto: 'aprobado' },
      { id: 'ccb2', nombre: 'María Fernández', rol: 'cliente', voto: 'aprobado' },
    ],
    solicitudesCambioSRS: [
      {
        id: 'sc1',
        titulo: 'Agregar exportación a formato DOCX',
        descripcion: 'El cliente requiere exportación en Word además de PDF',
        estado: 'aprobada',
        prioridad: 'baja',
        impactoEstimado: 'bajo',
        solicitadoPor: 'Jorge Salinas',
        fechaSolicitud: ts(daysFromNow(-50)),
        fechaResolucion: ts(daysFromNow(-48)),
      },
    ],
    matrizTrazabilidad: [],
    contadorCiclosValidacion: 2,
    creadoEn: ts(daysFromNow(-90)),
    actualizadoEn: ts(daysFromNow(-60)),
    creadoPor: IDS.usuario_analista,
  })

  // SRS para proyecto2 (activo_en_definicion — en proceso)
  await db.collection('srs').doc(IDS.srs2).set({
    proyectoId: IDS.proyecto2,
    version: 'v0.1',
    estado: 'no_iniciado',
    tipoSRS: 'completo',
    gate1Estado: 'pendiente',
    stakeholdersSRS: [
      {
        id: 'ss3',
        nombre: 'Roberto Pizarro',
        cargo: 'Director General',
        email: 'rpizarro@olivos.cl',
        rol: 'sponsor',
        nivelParticipacion: 'bajo',
        tecnicasAplicadas: ['entrevista'],
      },
    ],
    riesgosSRS: [],
    tecnicasActivas: ['entrevista'],
    prototipos: [],
    iteracionesBucle: [],
    artefactosModelo: [],
    checklistValidacion: [],
    observacionesValidacion: [],
    ccbSRS: [],
    solicitudesCambioSRS: [],
    matrizTrazabilidad: [],
    contadorCiclosValidacion: 0,
    creadoEn: ts(daysFromNow(-14)),
    actualizadoEn: ts(daysFromNow(-1)),
    creadoPor: IDS.usuario_analista,
  })

  console.log('  ✓ 2 documentos SRS creados')
}

// ============================================================
// SEED — HISTORIAL DEL PROYECTO
// ============================================================

async function seedHistorial(db: admin.firestore.Firestore): Promise<void> {
  console.log('📜 Creando historial del proyecto...')

  const historialRef = db.collection('proyectos').doc(IDS.proyecto1).collection('historial')

  const entradas = [
    {
      proyectoId: IDS.proyecto1,
      usuarioId: IDS.usuario_admin,
      usuarioNombre: 'Carlos Administrador',
      tipoAccion: 'creacion',
      motivo: 'Proyecto creado desde el wizard de nuevo proyecto',
      fechaHora: ts(daysFromNow(-120)),
    },
    {
      proyectoId: IDS.proyecto1,
      usuarioId: IDS.usuario_admin,
      usuarioNombre: 'Carlos Administrador',
      tipoAccion: 'cambio_estado',
      campoModificado: 'estado',
      valorAnterior: 'borrador',
      valorNuevo: 'pendiente_aprobacion',
      motivo: 'Metodología acordada con el cliente. Metodología: agil_scrum.',
      fechaHora: ts(daysFromNow(-118)),
    },
    {
      proyectoId: IDS.proyecto1,
      usuarioId: IDS.usuario_admin,
      usuarioNombre: 'Carlos Administrador',
      tipoAccion: 'metodologia_acordada',
      campoModificado: 'metodologia',
      valorNuevo: 'agil_scrum',
      motivo: 'Metodología Scrum acordada con ConSur en reunión de kick-off',
      fechaHora: ts(daysFromNow(-118)),
    },
    {
      proyectoId: IDS.proyecto1,
      usuarioId: IDS.usuario_admin,
      usuarioNombre: 'Carlos Administrador',
      tipoAccion: 'cambio_estado',
      campoModificado: 'estado',
      valorAnterior: 'pendiente_aprobacion',
      valorNuevo: 'activo_en_definicion',
      motivo: 'Propuesta aprobada por el cliente. SRS iniciado.',
      fechaHora: ts(daysFromNow(-115)),
    },
    {
      proyectoId: IDS.proyecto1,
      usuarioId: IDS.usuario_pm,
      usuarioNombre: 'Ana González (PM)',
      tipoAccion: 'cambio_estado',
      campoModificado: 'estado',
      valorAnterior: 'activo_en_definicion',
      valorNuevo: 'activo_en_desarrollo',
      motivo: 'SRS aprobado por el cliente. Desarrollo iniciado.',
      fechaHora: ts(daysFromNow(-88)),
    },
    {
      proyectoId: IDS.proyecto1,
      usuarioId: IDS.usuario_pm,
      usuarioNombre: 'Ana González (PM)',
      tipoAccion: 'gestion_equipo',
      motivo: 'Incorporación de Pedro Analista al equipo como analista de negocio',
      fechaHora: ts(daysFromNow(-85)),
    },
    {
      proyectoId: IDS.proyecto1,
      usuarioId: IDS.usuario_pm,
      usuarioNombre: 'Ana González (PM)',
      tipoAccion: 'gestion_riesgos',
      motivo: 'Riesgo R2 actualizado a estado mitigado: adaptador API implementado',
      fechaHora: ts(daysFromNow(-40)),
    },
    {
      proyectoId: IDS.proyecto1,
      usuarioId: IDS.usuario_analista,
      usuarioNombre: 'Pedro Analista',
      tipoAccion: 'actualizacion_datos',
      campoModificado: 'presupuestoEstimado',
      valorAnterior: '45000000',
      valorNuevo: '48500000',
      motivo: 'Ajuste de presupuesto tras vinculación APU-CCO-001',
      fechaHora: ts(daysFromNow(-60)),
    },
    {
      proyectoId: IDS.proyecto1,
      usuarioId: IDS.usuario_pm,
      usuarioNombre: 'Ana González (PM)',
      tipoAccion: 'gestion_riesgos',
      motivo: 'Riesgo R3 materializado: cliente no disponible para UAT esta semana',
      fechaHora: ts(daysFromNow(-2)),
    },
  ]

  const batch = db.batch()
  for (const entrada of entradas) {
    batch.set(historialRef.doc(), entrada)
  }
  await batch.commit()
  console.log('  ✓ 9 entradas de historial creadas')
}

// ============================================================
// SEED — REPOSITORIO DE CONFIGURACIÓN
// ============================================================

async function seedRepositorios(db: admin.firestore.Firestore): Promise<void> {
  console.log('🗂️  Creando repositorio de configuración...')

  await db.collection('repositorios_configuracion').doc(IDS.repo1).set({
    proyectoId: IDS.proyecto1,
    version: '1.2.0',
    estado: 'activo',
    politicaEntregas: 'Sprints de 2 semanas. Deploy automático a staging al cerrar sprint. Deploy a producción requiere aprobación manual del PM.',
    cicdObligatorio: true,
    itemsConfiguracion: [
      {
        id: 'ic1',
        nombre: 'firebase.json',
        tipo: 'infraestructura',
        descripcion: 'Configuración Firebase: Firestore rules, indexes, Cloud Functions',
        version: '1.1.0',
        estado: 'aprobado',
        ubicacion: 'raíz del repositorio',
        responsable: IDS.usuario_admin,
      },
      {
        id: 'ic2',
        nombre: 'next.config.js',
        tipo: 'configuracion_app',
        descripcion: 'Configuración de Next.js 14: remotePatterns, transpilePackages',
        version: '1.0.2',
        estado: 'aprobado',
        ubicacion: 'raíz del repositorio',
        responsable: IDS.usuario_admin,
      },
      {
        id: 'ic3',
        nombre: '.env.local / Variables Vercel',
        tipo: 'secretos',
        descripcion: '6 variables NEXT_PUBLIC_FIREBASE_* configuradas en Vercel',
        version: '1.0.0',
        estado: 'aprobado',
        ubicacion: 'Vercel Dashboard > Settings > Environment Variables',
        responsable: IDS.usuario_admin,
      },
      {
        id: 'ic4',
        nombre: 'firestore.rules',
        tipo: 'seguridad',
        descripcion: 'Reglas de seguridad Firestore v3.0 — todas las colecciones cubiertas',
        version: '3.0.0',
        estado: 'aprobado',
        ubicacion: 'firestore.rules',
        responsable: IDS.usuario_admin,
      },
    ],
    ccbComposicion: [
      { id: 'ccb1', nombre: 'Carlos Administrador', rol: 'arquitecto', votoRequerido: true },
      { id: 'ccb2', nombre: 'Ana González (PM)', rol: 'PM', votoRequerido: true },
      { id: 'ccb3', nombre: 'María Fernández', rol: 'cliente', votoRequerido: false },
    ],
    historialVersiones: [
      {
        version: '1.0.0',
        fecha: ts(daysFromNow(-115)),
        autor: IDS.usuario_admin,
        descripcion: 'Creación inicial del repositorio de configuración',
        cambios: ['Estructura base del proyecto', 'Firebase inicializado', 'CI/CD básico configurado'],
      },
      {
        version: '1.1.0',
        fecha: ts(daysFromNow(-60)),
        autor: IDS.usuario_admin,
        descripcion: 'Actualización tras deploy de M4 y M5',
        cambios: ['Índices Firestore actualizados', 'Cloud Functions agregadas', 'Reglas de seguridad v3.0'],
      },
      {
        version: '1.2.0',
        fecha: ts(daysFromNow(-7)),
        autor: IDS.usuario_analista,
        descripcion: 'Corrección de índices faltantes para colecciones M4/M5',
        cambios: ['8 índices nuevos en firestore.indexes.json', 'Deploy a producción exitoso'],
      },
    ],
    solicitudesCambio: [
      {
        id: 'scr1',
        titulo: 'Agregar índice compuesto para notificaciones por prioridad',
        descripcion: 'Se requiere índice compuesto para query: destinatarios CONTAINS + prioridad ASC + fechaCreacion DESC',
        estado: 'implementada',
        prioridad: 'media',
        solicitadoPor: IDS.usuario_pm,
        fechaSolicitud: ts(daysFromNow(-20)),
        fechaImplementacion: ts(daysFromNow(-7)),
      },
    ],
    creadoEn: ts(daysFromNow(-115)),
    actualizadoEn: ts(daysFromNow(-7)),
    creadoPor: IDS.usuario_admin,
  })

  console.log('  ✓ 1 repositorio de configuración creado (v1.2.0, 4 ítems, 3 versiones)')
}

// ============================================================
// FUNCIÓN PRINCIPAL — seedDemo()
// ============================================================

/**
 * Ejecuta el seed completo de datos de demostración.
 * @param options.reset — Si true, borra los datos existentes antes de crear
 */
export async function seedDemo(options: { reset?: boolean } = {}): Promise<void> {
  const app = initAdmin()
  const db = admin.firestore(app)

  console.log('\n🌱 Austranet CCO — Seed de datos de demostración')
  console.log('================================================')

  if (options.reset) {
    await resetDemoData(db)
  } else {
    const existe = await yaExisteDatos(db)
    if (existe) {
      console.log('✅ Los datos de demo ya existen. Usa --reset para recrearlos.\n')
      return
    }
  }

  await seedUsuarios(db)
  await seedEntidades(db)
  await seedProyectos(db)
  await seedTareas(db)
  await seedAPU(db)
  await seedSnapshotsEVM(db)
  await seedNotificaciones(db)
  await seedAlcance(db)
  await seedHistorial(db)
  await seedRepositorios(db)

  console.log('\n✅ Seed completado exitosamente.')
  console.log('   Entidades:       2')
  console.log('   Proyectos:       3 (1 activo, 1 en definición, 1 completado)')
  console.log('   Tareas:          8 (proyecto activo — con tipo, wbsCode, dependencias correctas)')
  console.log('   APU:             1 aprobado con 4 partidas (moneda CLP, ggPct/utilidadPct correctos)')
  console.log('   Snapshots EVM:   6 semanas históricas')
  console.log('   Riesgos:         3 (1 activo, 1 mitigado, 1 materializado)')
  console.log('   Hitos:           4 (2 completados, 1 en riesgo, 1 pendiente)')
  console.log('   Usuarios:        3 (admin, pm, analista)')
  console.log('   Notificaciones:  5 (1 crítica, 2 alta, 1 media, 1 baja)')
  console.log('   SRS:             2 (1 aprobado para activo, 1 no_iniciado para definición)')
  console.log('   Historial:       9 entradas (proyecto activo)')
  console.log('   Repositorios:    1 (proyecto activo, v1.2.0, 4 ítems, 3 versiones)\n')
}

// ============================================================
// CLI
// ============================================================

if (require.main === module) {
  const args = process.argv.slice(2)
  const reset = args.includes('--reset')

  seedDemo({ reset })
    .then(() => process.exit(0))
    .catch((error: unknown) => {
      console.error('❌ Error en el seed:', error)
      process.exit(1)
    })
}
