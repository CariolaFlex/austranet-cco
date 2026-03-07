"use strict";
// ============================================================
// Cloud Functions — Austranet CCO
// ============================================================
// DEPLOY: requiere Firebase Blaze plan. Ver SETUP.md para instrucciones.
//
// Pasos para hacer deploy:
//   1. Verificar que el proyecto Firebase está en plan Blaze (pay-as-you-go)
//   2. Agregar sección "functions" en firebase.json:
//        "functions": { "source": "functions" }
//   3. cd functions && npm install
//   4. firebase deploy --only functions
//
// Variables de entorno necesarias (firebase functions:config:set):
//   No se requieren variables adicionales — usa Application Default Credentials.
// ============================================================
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduledEVMSnapshot = exports.onTareaWrite = void 0;
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-functions/v2/firestore");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const v2_1 = require("firebase-functions/v2");
const evm_helpers_1 = require("./evm-helpers");
// -------------------------------------------------------
// INICIALIZACIÓN ADMIN SDK
// -------------------------------------------------------
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const db = admin.firestore();
// -------------------------------------------------------
// HELPERS INTERNOS
// -------------------------------------------------------
/**
 * Convierte los Timestamps de Firestore a Date de JS.
 * Replica la lógica de src/lib/firebase/firestore.ts:convertTimestamps.
 */
function convertTimestamps(data) {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
        if (value && typeof value === 'object' && '_seconds' in value && '_nanoseconds' in value) {
            result[key] = new Date(value._seconds * 1000 +
                Math.floor(value._nanoseconds / 1e6));
        }
        else if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
            result[key] = value.toDate();
        }
        else {
            result[key] = value;
        }
    }
    return result;
}
function docToTarea(id, data) {
    const converted = convertTimestamps(data);
    return {
        id,
        proyectoId: converted.proyectoId,
        estado: converted.estado,
        porcentajeAvance: converted.porcentajeAvance ?? 0,
        costoPlaneado: converted.costoPlaneado ?? 0,
        costoReal: converted.costoReal,
        fechaInicioPlaneada: converted.fechaInicioPlaneada,
        fechaFinPlaneada: converted.fechaFinPlaneada,
    };
}
async function getTareasDeProyecto(proyectoId) {
    const snap = await db
        .collection('tareas')
        .where('proyectoId', '==', proyectoId)
        .get();
    return snap.docs.map((d) => docToTarea(d.id, d.data()));
}
// -------------------------------------------------------
// FUNCIÓN A — onTareaWrite
// -------------------------------------------------------
//
// Trigger: cuando se escribe un documento en la colección 'tareas'.
// Propósito: recalcular kpisDashboard en proyectos/{proyectoId}
//   cuando cambia porcentajeAvance o costoReal.
//
// Campos que escribe en proyectos/{proyectoId}/kpisDashboard:
//   spi, cpi, pv, ev, ac, eac, bac, pctAvanceTareas,
//   pctAvancePonderado, semaforoGeneral, actualizadoEn
exports.onTareaWrite = (0, firestore_1.onDocumentWritten)('tareas/{tareaId}', async (event) => {
    const change = event.data;
    if (!change)
        return;
    const before = change.before?.data();
    const after = change.after?.data();
    // Solo procesar si cambió porcentajeAvance o costoReal
    const avanceCambio = (before?.porcentajeAvance ?? null) !== (after?.porcentajeAvance ?? null);
    const costoCambio = (before?.costoReal ?? null) !== (after?.costoReal ?? null);
    if (!avanceCambio && !costoCambio) {
        v2_1.logger.debug('[onTareaWrite] Sin cambio relevante — skipping');
        return;
    }
    // Obtener proyectoId desde el documento after (o before si fue delete)
    const proyectoId = (after?.proyectoId ?? before?.proyectoId);
    if (!proyectoId) {
        v2_1.logger.warn('[onTareaWrite] tareaId sin proyectoId — skipping', { tareaId: event.params.tareaId });
        return;
    }
    // Leer datos del proyecto (BAC)
    const proyectoDoc = await db.collection('proyectos').doc(proyectoId).get();
    if (!proyectoDoc.exists) {
        v2_1.logger.warn('[onTareaWrite] Proyecto no encontrado', { proyectoId });
        return;
    }
    const proyectoData = proyectoDoc.data();
    const bac = proyectoData.presupuestoEstimado ?? 0;
    // Leer todas las tareas del proyecto
    const tareas = await getTareasDeProyecto(proyectoId);
    // Calcular KPIs
    const kpis = (0, evm_helpers_1.calcularKPIsDesdeArrayTareas)(tareas, bac);
    const kpisDashboard = {
        ...kpis,
        actualizadoEn: new Date(),
    };
    // Guardar en el documento del proyecto (campo embebido para reads O(1))
    await db.collection('proyectos').doc(proyectoId).update({
        kpisDashboard: {
            ...kpisDashboard,
            actualizadoEn: admin.firestore.FieldValue.serverTimestamp(),
        },
    });
    v2_1.logger.info('[onTareaWrite] kpisDashboard actualizado', {
        proyectoId,
        spi: kpis.spi,
        cpi: kpis.cpi,
        semaforoGeneral: kpis.semaforoGeneral,
    });
});
// -------------------------------------------------------
// FUNCIÓN B — scheduledEVMSnapshot
// -------------------------------------------------------
//
// Schedule: todos los lunes a las 06:00 (America/Santiago)
// Propósito: crear snapshot EVM semanal para todos los proyectos activos.
//
// Proyectos procesados: estado in ['activo_en_definicion', 'activo_en_desarrollo']
// Batch: máx. 10 proyectos simultáneos (Promise.allSettled)
// Log de resultado: proyectos procesados, fallidos.
const ESTADOS_ACTIVOS = [
    'activo_en_definicion',
    'activo_en_desarrollo',
];
async function procesarSnapshotProyecto(proyectoDoc, fecha) {
    const proyectoId = proyectoDoc.id;
    const proyectoData = proyectoDoc.data();
    const bac = proyectoData.presupuestoEstimado ?? 0;
    const tareas = await getTareasDeProyecto(proyectoId);
    if (tareas.length === 0) {
        v2_1.logger.info(`[scheduledEVMSnapshot] Proyecto sin tareas — skipping`, { proyectoId });
        return;
    }
    const snapshotId = (0, evm_helpers_1.generarSnapshotId)(fecha);
    const snapshotPayload = (0, evm_helpers_1.construirSnapshotDesdeTareas)(tareas, bac, fecha);
    const snapshotRef = db
        .collection('proyectos')
        .doc(proyectoId)
        .collection('snapshots_evm')
        .doc(snapshotId);
    // Idempotente: upsert por ID (lunes ISO). Preserva creadoEn si ya existe.
    const existing = await snapshotRef.get();
    const creadoEn = existing.exists
        ? existing.data().creadoEn
        : admin.firestore.FieldValue.serverTimestamp();
    await snapshotRef.set({
        ...snapshotPayload,
        fecha: admin.firestore.Timestamp.fromDate(snapshotPayload.fecha),
        creadoEn,
    });
    v2_1.logger.info(`[scheduledEVMSnapshot] Snapshot guardado`, {
        proyectoId,
        snapshotId,
        spi: snapshotPayload.spi,
        cpi: snapshotPayload.cpi,
    });
}
exports.scheduledEVMSnapshot = (0, scheduler_1.onSchedule)({
    schedule: 'every monday 06:00',
    timeZone: 'America/Santiago',
    retryCount: 2,
}, async () => {
    const fecha = new Date();
    v2_1.logger.info('[scheduledEVMSnapshot] Iniciando snapshot semanal EVM', {
        fecha: fecha.toISOString(),
        snapshotId: (0, evm_helpers_1.generarSnapshotId)(fecha),
    });
    // Obtener todos los proyectos activos
    const proyectosSnap = await db
        .collection('proyectos')
        .where('estado', 'in', ESTADOS_ACTIVOS)
        .get();
    if (proyectosSnap.empty) {
        v2_1.logger.info('[scheduledEVMSnapshot] Sin proyectos activos — terminando');
        return;
    }
    const proyectos = proyectosSnap.docs;
    v2_1.logger.info(`[scheduledEVMSnapshot] ${proyectos.length} proyecto(s) a procesar`);
    // Procesar en batches de máx. 10 simultáneos
    const BATCH_SIZE = 10;
    let procesados = 0;
    let fallidos = 0;
    for (let i = 0; i < proyectos.length; i += BATCH_SIZE) {
        const batch = proyectos.slice(i, i + BATCH_SIZE);
        const resultados = await Promise.allSettled(batch.map((doc) => procesarSnapshotProyecto(doc, fecha)));
        for (const resultado of resultados) {
            if (resultado.status === 'fulfilled') {
                procesados++;
            }
            else {
                fallidos++;
                v2_1.logger.error('[scheduledEVMSnapshot] Error procesando proyecto', {
                    error: resultado.reason,
                });
            }
        }
    }
    v2_1.logger.info('[scheduledEVMSnapshot] Snapshot semanal completado', {
        total: proyectos.length,
        procesados,
        fallidos,
    });
});
//# sourceMappingURL=index.js.map