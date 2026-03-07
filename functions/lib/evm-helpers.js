"use strict";
// ============================================================
// Cloud Functions — Helpers puros de cálculo EVM
// Austranet CCO
// ============================================================
// Estas funciones replican la lógica de:
//   src/constants/evm.ts  (fórmulas EVM estándar + semáforos)
//   src/services/evm.service.ts (calcularEV/AC/PVDesdeTareas)
//
// NO importan desde src/ para evitar dependencia circular
// con el entorno Next.js (que usa Firebase client SDK y browser APIs).
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcularSemaforoSPI = calcularSemaforoSPI;
exports.calcularSemaforoCPI = calcularSemaforoCPI;
exports.calcularSemaforoGeneral = calcularSemaforoGeneral;
exports.calcularSPI = calcularSPI;
exports.calcularCPI = calcularCPI;
exports.calcularSV = calcularSV;
exports.calcularCV = calcularCV;
exports.calcularEAC = calcularEAC;
exports.calcularETC = calcularETC;
exports.calcularTCPI = calcularTCPI;
exports.calcularEVDesdeTareas = calcularEVDesdeTareas;
exports.calcularACDesdeTareas = calcularACDesdeTareas;
exports.calcularPVDesdeTareas = calcularPVDesdeTareas;
exports.generarSnapshotId = generarSnapshotId;
exports.calcularKPIsDesdeArrayTareas = calcularKPIsDesdeArrayTareas;
exports.construirSnapshotDesdeTareas = construirSnapshotDesdeTareas;
// -------------------------------------------------------
// UMBRALES PMI (SPI/CPI)
// -------------------------------------------------------
const SPI_VERDE = 0.95;
const SPI_AMARILLO = 0.80;
const CPI_VERDE = 0.95;
const CPI_AMARILLO = 0.85;
// -------------------------------------------------------
// SEMÁFOROS
// -------------------------------------------------------
function calcularSemaforoSPI(spi) {
    if (!isFinite(spi) || isNaN(spi))
        return 'sin_datos';
    if (spi >= SPI_VERDE)
        return 'verde';
    if (spi >= SPI_AMARILLO)
        return 'amarillo';
    return 'rojo';
}
function calcularSemaforoCPI(cpi) {
    if (!isFinite(cpi) || isNaN(cpi))
        return 'sin_datos';
    if (cpi >= CPI_VERDE)
        return 'verde';
    if (cpi >= CPI_AMARILLO)
        return 'amarillo';
    return 'rojo';
}
function calcularSemaforoGeneral(semaforoCronograma, semaforoCostos) {
    if (semaforoCronograma === 'sin_datos' && semaforoCostos === 'sin_datos')
        return 'sin_datos';
    if (semaforoCronograma === 'rojo' || semaforoCostos === 'rojo')
        return 'rojo';
    if (semaforoCronograma === 'amarillo' || semaforoCostos === 'amarillo')
        return 'amarillo';
    return 'verde';
}
// -------------------------------------------------------
// FÓRMULAS EVM ESTÁNDAR
// -------------------------------------------------------
function calcularSPI(ev, pv) {
    if (pv === 0)
        return 1;
    return Math.round((ev / pv) * 1000) / 1000;
}
function calcularCPI(ev, ac) {
    if (ac === 0)
        return 1;
    return Math.round((ev / ac) * 1000) / 1000;
}
function calcularSV(ev, pv) {
    return Math.round((ev - pv) * 100) / 100;
}
function calcularCV(ev, ac) {
    return Math.round((ev - ac) * 100) / 100;
}
function calcularEAC(bac, cpi) {
    if (cpi === 0)
        return bac;
    return Math.round((bac / cpi) * 100) / 100;
}
function calcularETC(eac, ac) {
    return Math.max(0, Math.round((eac - ac) * 100) / 100);
}
function calcularTCPI(bac, ev, ac) {
    const denominador = bac - ac;
    if (denominador <= 0)
        return 0;
    return Math.round(((bac - ev) / denominador) * 1000) / 1000;
}
// -------------------------------------------------------
// CÁLCULO DESDE ARRAY DE TAREAS
// -------------------------------------------------------
/** EV = Σ (costoPlaneado × porcentajeAvance / 100). Excluye tareas suspendidas. */
function calcularEVDesdeTareas(tareas) {
    return tareas
        .filter((t) => t.estado !== 'suspendida')
        .reduce((sum, t) => sum + (t.costoPlaneado * t.porcentajeAvance) / 100, 0);
}
/** AC = Σ (costoReal ?? 0). */
function calcularACDesdeTareas(tareas) {
    return tareas.reduce((sum, t) => sum + (t.costoReal ?? 0), 0);
}
/**
 * PV = Σ costoPlaneado de tareas cuya fechaInicioPlaneada <= fecha.
 * Versión simplificada MVP (distribución lineal diferida — P5).
 */
function calcularPVDesdeTareas(tareas, fecha) {
    return tareas
        .filter((t) => t.estado !== 'suspendida' && t.fechaInicioPlaneada <= fecha)
        .reduce((sum, t) => sum + t.costoPlaneado, 0);
}
// -------------------------------------------------------
// HELPERS DE SNAPSHOT / KPIs
// -------------------------------------------------------
/**
 * Genera el ID del snapshot en formato ISO date del lunes de la semana.
 * Idempotente: si se llama varias veces la misma semana, produce el mismo ID.
 */
function generarSnapshotId(fecha = new Date()) {
    const d = new Date(fecha);
    const diaSemana = d.getDay(); // 0 = domingo
    const diasParaLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
    d.setDate(d.getDate() + diasParaLunes);
    return d.toISOString().slice(0, 10); // "2026-03-09"
}
/**
 * Calcula todos los KPIs EVM a partir de tareas y BAC.
 * Retorna el objeto listo para guardar en Firestore.
 */
function calcularKPIsDesdeArrayTareas(tareas, bac, fecha = new Date()) {
    const ev = calcularEVDesdeTareas(tareas);
    const ac = calcularACDesdeTareas(tareas);
    const pv = calcularPVDesdeTareas(tareas, fecha);
    const spi = calcularSPI(ev, pv);
    const cpi = calcularCPI(ev, ac);
    const eac = calcularEAC(bac, cpi);
    const semaforoSPI = calcularSemaforoSPI(spi);
    const semaforoCPI = calcularSemaforoCPI(cpi);
    const semaforoGeneral = calcularSemaforoGeneral(semaforoSPI, semaforoCPI);
    const tareasActivas = tareas.filter((t) => t.estado !== 'suspendida');
    const completadas = tareasActivas.filter((t) => t.estado === 'completada').length;
    const pctAvanceTareas = tareasActivas.length > 0 ? (completadas / tareasActivas.length) * 100 : 0;
    const pctAvancePonderado = bac > 0 ? (ev / bac) * 100 : 0;
    return { spi, cpi, pv, ev, ac, eac, bac, pctAvanceTareas, pctAvancePonderado, semaforoGeneral };
}
/**
 * Construye el payload de SnapshotEVM a partir de tareas y BAC.
 * Listo para guardarse en Firestore (sin conversión Timestamp — el llamador lo hace).
 */
function construirSnapshotDesdeTareas(tareas, bac, fecha = new Date()) {
    const ev = calcularEVDesdeTareas(tareas);
    const ac = calcularACDesdeTareas(tareas);
    const pv = calcularPVDesdeTareas(tareas, fecha);
    const spi = calcularSPI(ev, pv);
    const cpi = calcularCPI(ev, ac);
    const sv = calcularSV(ev, pv);
    const cv = calcularCV(ev, ac);
    const eac = calcularEAC(bac, cpi);
    const etc = calcularETC(eac, ac);
    const tcpi = calcularTCPI(bac, ev, ac);
    const semaforoSPIRaw = calcularSemaforoSPI(spi);
    const semaforoCPIRaw = calcularSemaforoCPI(cpi);
    return {
        fecha,
        bac,
        pv,
        ev,
        ac,
        spi,
        cpi,
        sv,
        cv,
        eac,
        etc,
        tcpi,
        semaforoSPI: semaforoSPIRaw === 'sin_datos' ? 'rojo' : semaforoSPIRaw,
        semaforoCPI: semaforoCPIRaw === 'sin_datos' ? 'rojo' : semaforoCPIRaw,
    };
}
//# sourceMappingURL=evm-helpers.js.map