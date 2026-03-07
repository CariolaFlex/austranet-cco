// ============================================================
// Cloud Functions — Tipos mínimos necesarios
// Austranet CCO
// ============================================================
// Nota: estos tipos son una copia simplificada de src/types/index.ts
// para evitar importar desde el proyecto Next.js (distintos entornos).
// ============================================================

export type EstadoProyecto =
  | 'borrador'
  | 'pendiente_aprobacion'
  | 'activo_en_definicion'
  | 'activo_en_desarrollo'
  | 'pausado'
  | 'completado'
  | 'cancelado'

export type EstadoTarea =
  | 'pendiente'
  | 'en_progreso'
  | 'completada'
  | 'suspendida'
  | 'bloqueada'

export type SemaforoEVM = 'verde' | 'amarillo' | 'rojo' | 'sin_datos'

/** Documento de proyecto (solo campos que usa onTareaWrite). */
export interface Proyecto {
  id: string
  estado: EstadoProyecto
  presupuestoEstimado: number  // BAC
  fechaFinEstimada?: Date
}

/** Documento de tarea (campos que usa el cálculo EVM). */
export interface Tarea {
  id: string
  proyectoId: string
  estado: EstadoTarea
  porcentajeAvance: number      // 0–100
  costoPlaneado: number
  costoReal?: number
  fechaInicioPlaneada: Date
  fechaFinPlaneada: Date
}

/** Snapshot EVM almacenado en proyectos/{proyectoId}/snapshots_evm/{lunesISO}. */
export interface SnapshotEVM {
  fecha: Date
  bac: number
  pv: number
  ev: number
  ac: number
  spi: number
  cpi: number
  sv: number
  cv: number
  eac: number
  etc: number
  tcpi: number
  semaforoSPI: Exclude<SemaforoEVM, 'sin_datos'>
  semaforoCPI: Exclude<SemaforoEVM, 'sin_datos'>
  creadoEn: Date
}

/** KPIs embebidos en el documento de proyecto para reads O(1) en dashboard. */
export interface KPIsDashboard {
  spi: number
  cpi: number
  pv: number
  ev: number
  ac: number
  eac: number
  bac: number
  pctAvanceTareas: number
  pctAvancePonderado: number
  semaforoGeneral: SemaforoEVM
  actualizadoEn: Date
}
