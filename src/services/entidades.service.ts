// ============================================================
// SERVICIO: Entidades — Módulo 1
// Documentación: /docs/modulo-1-entidades/
// ============================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { getFirestoreDb, convertTimestamps, removeUndefined } from '@/lib/firebase/firestore';
import { getFirebaseAuth } from '@/lib/firebase/auth';
import type {
  Entidad,
  EstadoEntidad,
  FiltrosEntidad,
  CrearEntidadDTO,
  ActualizarEntidadDTO,
  RespuestasFactibilidad,
  NivelRiesgoEntidad,
  EntradaHistorial,
  EntradaGlosario,
  CrearEntradaGlosarioDTO,
  ChecklistGlosario,
} from '@/types';

const COLECCION = 'entidades';

// -------------------------------------------------------
// FUNCIONES PURAS DE CÁLCULO (sin efectos secundarios)
// -------------------------------------------------------

/**
 * Calcula el nivel de completitud del perfil de una entidad.
 * Basado en M1-07 Sección 9 — Estándar de Completitud (actualizado Sprint 2).
 *
 * NIVEL MÍNIMO: razonSocial, rut, tipo, sector, pais, ≥1 stakeholder, estado
 * NIVEL ESTÁNDAR: mínimo + ≥2 stakeholders con influencia + factibilidad + glosario ≥5
 * NIVEL COMPLETO: estándar + NDA resuelto + glosario ≥10 + todos con canal + ≥2 alto influencia
 *
 * @param entidad - Datos de la entidad
 * @param glosarioCount - Número de términos en el glosario (default: 0)
 */
export function calcularNivelCompletitud(
  entidad: Entidad,
  glosarioCount = 0
): 'minimo' | 'estandar' | 'completo' {
  // NIVEL MÍNIMO (M1-07 §9)
  const cumpleMinimo =
    !!entidad.razonSocial?.trim() &&
    !!entidad.rut?.trim() &&
    !!entidad.tipo &&
    !!entidad.sector &&
    !!entidad.pais?.trim() &&
    entidad.stakeholders.length >= 1 &&
    !!entidad.estado;

  if (!cumpleMinimo) return 'minimo';

  // NIVEL ESTÁNDAR (M1-07 §9): ≥2 stakeholders con influencia + factibilidad + glosario ≥5
  const stakeholdersConInfluencia = entidad.stakeholders.filter(
    (s) => !!s.nivelInfluencia
  );
  const tieneFactibilidad = !!entidad.respuestasFactibilidad;
  const cumpleEstandar =
    stakeholdersConInfluencia.length >= 2 &&
    tieneFactibilidad &&
    glosarioCount >= 5;

  if (!cumpleEstandar) return 'minimo';

  // NIVEL COMPLETO (M1-07 §9): NDA resuelto + glosario ≥10 + todos stakeholders con canal + ≥2 alto
  const ndaResuelto =
    entidad.tieneNDA === false ||
    (entidad.tieneNDA === true && !!entidad.fechaNDA);
  const todosConCanal = entidad.stakeholders.every(
    (s) => !!s.canalComunicacion?.trim()
  );
  const stakeholdersAltos = entidad.stakeholders.filter(
    (s) => s.nivelInfluencia === 'alto'
  ).length;

  if (ndaResuelto && glosarioCount >= 10 && todosConCanal && stakeholdersAltos >= 2) {
    return 'completo';
  }
  return 'estandar';
}

/**
 * Calcula el nivel de riesgo de una entidad a partir de las respuestas
 * al formulario de evaluación de factibilidad.
 * Basado en M1-04 Sección 5.2 — umbrales ponderados.
 */
export function calcularNivelRiesgo(
  respuestas: RespuestasFactibilidad
): NivelRiesgoEntidad {
  let pesoEnRiesgo = 0;

  // Técnica (total: 40%)
  if (respuestas.t1_sistemasDocumentados !== 'si') pesoEnRiesgo += 10;
  if (respuestas.t2_experienciaSoftware === 'no') pesoEnRiesgo += 15;
  if (respuestas.t3_infraestructura !== 'si') pesoEnRiesgo += 10;
  if (respuestas.t4_procesosDocumentados !== 'si') pesoEnRiesgo += 5;

  // Económica (total: 35%)
  if (respuestas.e5_presupuesto !== 'si') pesoEnRiesgo += 20;
  if (respuestas.e6_decisoresAccesibles === 'no') pesoEnRiesgo += 10;
  if (respuestas.e7_presupuestoOperacion !== 'si') pesoEnRiesgo += 5;

  // Organizacional (total: 25%)
  if (respuestas.o8_stakeholdersDisponibles !== 'si') pesoEnRiesgo += 10;
  if (respuestas.o9_patrocinadorEjecutivo === 'no') pesoEnRiesgo += 10;
  if (respuestas.o10_experienciaCambio !== 'si') pesoEnRiesgo += 3;
  if (respuestas.o11_alineacionEstrategica !== 'si') pesoEnRiesgo += 2;

  // Umbrales M1-04 §5.2
  if (pesoEnRiesgo <= 30) return 'bajo';
  if (pesoEnRiesgo <= 50) return 'medio';
  if (pesoEnRiesgo <= 70) return 'alto';
  return 'critico';
}

// -------------------------------------------------------
// HELPERS INTERNOS
// -------------------------------------------------------

function getCurrentUserId(): string {
  const auth = getFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuario no autenticado');
  return uid;
}

function getCurrentUserName(): string {
  const auth = getFirebaseAuth();
  return auth.currentUser?.displayName || auth.currentUser?.email || 'Sistema';
}

async function registrarHistorial(
  entidadId: string,
  entrada: Omit<EntradaHistorial, 'id' | 'entidadId' | 'fechaHora'>
): Promise<void> {
  const db = getFirestoreDb();
  const historialRef = collection(db, COLECCION, entidadId, 'historial');
  await addDoc(historialRef, removeUndefined({
    ...entrada,
    entidadId,
    fechaHora: Timestamp.now(),
  }));
}

function docToEntidad(id: string, data: Record<string, unknown>): Entidad {
  return convertTimestamps({ id, ...data }) as Entidad;
}

// -------------------------------------------------------
// SERVICIO PRINCIPAL
// -------------------------------------------------------

export const entidadesService = {
  /**
   * Obtiene todas las entidades con filtros opcionales.
   * Filtros de tipo/estado/sector/nivelRiesgo se aplican en Firestore.
   * El filtro de búsqueda por texto se aplica en cliente.
   */
  getAll: async (filtros?: FiltrosEntidad): Promise<Entidad[]> => {
    const db = getFirestoreDb();
    const constraints = [];

    if (filtros?.tipo) constraints.push(where('tipo', '==', filtros.tipo));
    if (filtros?.estado) constraints.push(where('estado', '==', filtros.estado));
    if (filtros?.sector) constraints.push(where('sector', '==', filtros.sector));
    if (filtros?.nivelRiesgo) constraints.push(where('nivelRiesgo', '==', filtros.nivelRiesgo));
    constraints.push(orderBy('actualizadoEn', 'desc'));

    const q = query(collection(db, COLECCION), ...constraints);
    const snapshot = await getDocs(q);
    let entidades = snapshot.docs.map((d) => docToEntidad(d.id, d.data()));

    if (filtros?.busqueda?.trim()) {
      const busq = filtros.busqueda.toLowerCase();
      entidades = entidades.filter(
        (e) =>
          e.razonSocial?.toLowerCase().includes(busq) ||
          e.nombreComercial?.toLowerCase().includes(busq) ||
          e.rut?.toLowerCase().includes(busq)
      );
    }

    return entidades;
  },

  /** Obtiene una entidad por ID. Retorna null si no existe. */
  getById: async (id: string): Promise<Entidad | null> => {
    const db = getFirestoreDb();
    const snap = await getDoc(doc(db, COLECCION, id));
    if (!snap.exists()) return null;
    return docToEntidad(snap.id, snap.data());
  },

  /** Crea una nueva entidad. El estado inicial siempre es 'activo'. */
  create: async (data: CrearEntidadDTO): Promise<Entidad> => {
    const db = getFirestoreDb();
    const uid = getCurrentUserId();
    const userName = getCurrentUserName();
    const ahora = Timestamp.now();

    const docData = {
      ...data,
      estado: 'activo' as EstadoEntidad,
      stakeholders: data.stakeholders.map((s) => ({
        ...s,
        id: s.id || uuidv4(),
      })),
      creadoEn: ahora,
      actualizadoEn: ahora,
      creadoPor: uid,
    };

    const docRef = await addDoc(collection(db, COLECCION), removeUndefined(docData));

    await registrarHistorial(docRef.id, {
      usuarioId: uid,
      usuarioNombre: userName,
      tipoAccion: 'creacion',
      valorNuevo: data.razonSocial,
    });

    // Auditoría T-03 (silencioso — nunca rompe el flujo)
    try {
      const { auditoriaService } = await import('./auditoria.service')
      const fbUser = getFirebaseAuth().currentUser
      if (fbUser) await auditoriaService.registrar({
        actor: { uid: fbUser.uid, nombre: fbUser.displayName ?? fbUser.email ?? 'Sistema', rol: 'analista' },
        accion: 'ENTIDAD_CREADA',
        modulo: 'M1',
        entidad: { id: docRef.id, tipo: 'Entidad', nombre: data.razonSocial },
        descripcion: `Entidad "${data.razonSocial}" creada`,
        resultado: 'exito',
      })
    } catch { /* silencioso */ }

    return docToEntidad(docRef.id, {
      ...docData,
      creadoEn: ahora.toDate(),
      actualizadoEn: ahora.toDate(),
    });
  },

  /** Actualiza una entidad existente. Registra cambio en historial. */
  update: async (id: string, data: ActualizarEntidadDTO): Promise<Entidad> => {
    const db = getFirestoreDb();
    const uid = getCurrentUserId();
    const userName = getCurrentUserName();
    const ahora = Timestamp.now();

    const updateData: Record<string, unknown> = {
      ...data,
      actualizadoEn: ahora,
    };

    if (data.stakeholders) {
      updateData.stakeholders = data.stakeholders.map((s) => ({
        ...s,
        id: s.id || uuidv4(),
      }));
    }

    await updateDoc(doc(db, COLECCION, id), removeUndefined(updateData));

    await registrarHistorial(id, {
      usuarioId: uid,
      usuarioNombre: userName,
      tipoAccion: 'actualizacion_datos',
    });

    // Auditoría T-03 (silencioso)
    try {
      const { auditoriaService } = await import('./auditoria.service')
      const fbUser = getFirebaseAuth().currentUser
      if (fbUser) await auditoriaService.registrar({
        actor: { uid: fbUser.uid, nombre: fbUser.displayName ?? fbUser.email ?? 'Sistema', rol: 'analista' },
        accion: 'ENTIDAD_EDITADA',
        modulo: 'M1',
        entidad: { id, tipo: 'Entidad' },
        descripcion: 'Entidad actualizada',
        resultado: 'exito',
      })
    } catch { /* silencioso */ }

    const updated = await entidadesService.getById(id);
    if (!updated) throw new Error('Entidad no encontrada después de actualizar');
    return updated;
  },

  /**
   * Cambia el estado de una entidad. El motivo es obligatorio.
   * Registra el cambio en historial (M1-06 §4.3 — Solicitud de Cambio).
   */
  updateEstado: async (
    id: string,
    estado: EstadoEntidad,
    motivo: string
  ): Promise<void> => {
    const db = getFirestoreDb();
    const uid = getCurrentUserId();
    const userName = getCurrentUserName();

    const actual = await entidadesService.getById(id);
    const estadoAnterior = actual?.estado;

    await updateDoc(doc(db, COLECCION, id), {
      estado,
      actualizadoEn: Timestamp.now(),
    });

    await registrarHistorial(id, {
      usuarioId: uid,
      usuarioNombre: userName,
      tipoAccion: 'cambio_estado',
      campoModificado: 'estado',
      valorAnterior: estadoAnterior,
      valorNuevo: estado,
      motivo,
    });

    // Auditoría T-03 (silencioso)
    try {
      const { auditoriaService } = await import('./auditoria.service')
      const fbUser = getFirebaseAuth().currentUser
      if (fbUser) await auditoriaService.registrar({
        actor: { uid: fbUser.uid, nombre: fbUser.displayName ?? fbUser.email ?? 'Sistema', rol: 'analista' },
        accion: estado === 'inactivo' ? 'ENTIDAD_ELIMINADA' : 'ENTIDAD_EDITADA',
        modulo: 'M1',
        entidad: { id, tipo: 'Entidad' },
        descripcion: `Estado de entidad cambiado a "${estado}". Motivo: ${motivo}`,
        resultado: 'exito',
      })
    } catch { /* silencioso */ }
  },

  /**
   * Soft delete: cambia estado a 'inactivo'.
   * NO elimina el documento de Firestore (M1-06 §8 — política de control de configuración).
   */
  delete: async (id: string): Promise<void> => {
    await entidadesService.updateEstado(id, 'inactivo', 'Entidad eliminada por el usuario');
  },

  // Re-exportar para uso externo en componentes
  calcularNivelCompletitud,
  calcularNivelRiesgo,

  // -------------------------------------------------------
  // GLOSARIO DE DOMINIO (subcolección entidades/{id}/glosario)
  // Justificado en M1-03 §5 — Integración al registro de la entidad
  // -------------------------------------------------------
  glosario: {
    /** Obtiene todos los términos del glosario ordenados A-Z */
    getAll: async (entidadId: string): Promise<EntradaGlosario[]> => {
      const db = getFirestoreDb();
      const ref = collection(db, COLECCION, entidadId, 'glosario');
      const q = query(ref, orderBy('termino', 'asc'));
      const snap = await getDocs(q);
      return snap.docs.map((d) =>
        convertTimestamps({ id: d.id, ...d.data() }) as EntradaGlosario
      );
    },

    /** Obtiene un término por ID */
    getById: async (
      entidadId: string,
      terminoId: string
    ): Promise<EntradaGlosario | null> => {
      const db = getFirestoreDb();
      const snap = await getDoc(
        doc(db, COLECCION, entidadId, 'glosario', terminoId)
      );
      if (!snap.exists()) return null;
      return convertTimestamps({ id: snap.id, ...snap.data() }) as EntradaGlosario;
    },

    /** Cuenta total de términos (para KPI de completitud M1-07 §7.1) */
    getCount: async (entidadId: string): Promise<number> => {
      const db = getFirestoreDb();
      const ref = collection(db, COLECCION, entidadId, 'glosario');
      const snap = await getDocs(ref);
      return snap.size;
    },

    /** Crea una nueva entrada en el glosario */
    create: async (
      entidadId: string,
      data: CrearEntradaGlosarioDTO
    ): Promise<EntradaGlosario> => {
      const db = getFirestoreDb();
      const uid = getCurrentUserId();
      const ahora = Timestamp.now();
      const docRef = await addDoc(
        collection(db, COLECCION, entidadId, 'glosario'),
        removeUndefined({
          ...data,
          entidadId,
          creadoEn: ahora,
          actualizadoEn: ahora,
          creadoPor: uid,
        })
      );
      return convertTimestamps({
        id: docRef.id,
        ...data,
        entidadId,
        creadoEn: ahora.toDate(),
        actualizadoEn: ahora.toDate(),
        creadoPor: uid,
      }) as EntradaGlosario;
    },

    /** Actualiza una entrada del glosario */
    update: async (
      entidadId: string,
      terminoId: string,
      data: Partial<CrearEntradaGlosarioDTO>
    ): Promise<EntradaGlosario> => {
      const db = getFirestoreDb();
      const ahora = Timestamp.now();
      await updateDoc(
        doc(db, COLECCION, entidadId, 'glosario', terminoId),
        removeUndefined({ ...data, actualizadoEn: ahora })
      );
      const updated = await entidadesService.glosario.getById(entidadId, terminoId);
      if (!updated) throw new Error('Término no encontrado después de actualizar');
      return updated;
    },

    /**
     * Hard delete — los términos del glosario SÍ son borrables
     * a diferencia de las entidades (M1-03 §5 — versionado).
     */
    delete: async (entidadId: string, terminoId: string): Promise<void> => {
      const { deleteDoc } = await import('firebase/firestore');
      const db = getFirestoreDb();
      await deleteDoc(doc(db, COLECCION, entidadId, 'glosario', terminoId));
    },
  },

  /** Actualiza el checklist operativo del glosario (M1-03 §8) */
  updateChecklistGlosario: async (
    entidadId: string,
    checklist: Partial<ChecklistGlosario>
  ): Promise<void> => {
    const db = getFirestoreDb();
    await updateDoc(doc(db, COLECCION, entidadId), {
      checklistGlosario: checklist,
      actualizadoEn: Timestamp.now(),
    });
  },
};
