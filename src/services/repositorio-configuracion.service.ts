// ============================================================
// SERVICIO: Repositorio de Configuración del Proyecto — M2-06 (M2-INT-05)
// Colección Firestore: 'repositorios_configuracion'
// Se crea automáticamente al pasar a pendiente_aprobacion.
// Diferente de configuracion.service.ts (configuración de la organización).
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
} from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'
import { getFirestoreDb, convertTimestamps, removeUndefined } from '@/lib/firebase/firestore'
import { getFirebaseAuth } from '@/lib/firebase/auth'
import { calcularEfectosCascada } from '@/lib/metodologia/efectosCascada'
import type {
  ConfiguracionProyecto,
  ItemConfiguracion,
  MiembroCCB,
  SolicitudCambioRepositorio,
  VersionRepositorio,
  MetodologiaProyecto,
  EstadoConfiguracionProyecto,
} from '@/types'

const COLECCION = 'repositorios_configuracion'

function getCurrentUserId(): string {
  const auth = getFirebaseAuth()
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('Usuario no autenticado')
  return uid
}

function docToConfiguracion(id: string, data: Record<string, unknown>): ConfiguracionProyecto {
  const converted = convertTimestamps({ id, ...data }) as ConfiguracionProyecto
  converted.itemsConfiguracion = converted.itemsConfiguracion ?? []
  converted.ccbComposicion = converted.ccbComposicion ?? []
  converted.historialVersiones = converted.historialVersiones ?? []
  converted.solicitudesCambio = converted.solicitudesCambio ?? []
  return converted
}

export const repositorioConfiguracionService = {
  /**
   * Obtiene la configuración activa del proyecto.
   * Retorna null si el proyecto no tiene repositorio de configuración aún.
   */
  getByProyectoId: async (proyectoId: string): Promise<ConfiguracionProyecto | null> => {
    const db = getFirestoreDb()
    const q = query(
      collection(db, COLECCION),
      where('proyectoId', '==', proyectoId),
      orderBy('creadoEn', 'desc')
    )
    const snap = await getDocs(q)
    if (snap.empty) return null
    const d = snap.docs[0]
    return docToConfiguracion(d.id, d.data())
  },

  getById: async (id: string): Promise<ConfiguracionProyecto | null> => {
    const db = getFirestoreDb()
    const snap = await getDoc(doc(db, COLECCION, id))
    if (!snap.exists()) return null
    return docToConfiguracion(snap.id, snap.data())
  },

  /**
   * Crea automáticamente la configuración inicial del proyecto.
   * M2-INT-05: Se llama cuando el proyecto pasa a pendiente_aprobacion.
   * La politicaEntregas se deriva de la metodología del proyecto.
   */
  crearConfiguracionInicial: async (
    proyectoId: string,
    metodologia: MetodologiaProyecto
  ): Promise<ConfiguracionProyecto> => {
    const db = getFirestoreDb()
    const uid = getCurrentUserId()
    const ahora = Timestamp.now()

    // Verificar si ya existe
    const existente = await repositorioConfiguracionService.getByProyectoId(proyectoId)
    if (existente) return existente

    const efectos = calcularEfectosCascada(metodologia)

    const versionInicial: VersionRepositorio = {
      version: '1.0.0',
      fecha: ahora.toDate(),
      descripcion: 'Repositorio de configuración creado automáticamente al pasar a pendiente_aprobacion.',
      cambios: [
        `Política de entregas: ${efectos.politicaEntregas}`,
        `CI/CD obligatorio: ${efectos.cicdObligatorio}`,
        `Metodología: ${metodologia}`,
      ],
      aprobadoPor: uid,
    }

    const docData = {
      proyectoId,
      version: '1.0.0',
      estado: 'borrador' as EstadoConfiguracionProyecto,
      itemsConfiguracion: [],
      ccbComposicion: [],
      politicaEntregas: efectos.politicaEntregas,
      cicdObligatorio: efectos.cicdObligatorio,
      historialVersiones: [versionInicial],
      solicitudesCambio: [],
      creadoEn: ahora,
      actualizadoEn: ahora,
      creadoPor: uid,
    }

    const ref = await addDoc(collection(db, COLECCION), docData)
    return docToConfiguracion(ref.id, {
      ...docData,
      creadoEn: ahora.toDate(),
      actualizadoEn: ahora.toDate(),
    })
  },

  /** Agrega un ítem de configuración al repositorio */
  agregarItem: async (
    configuracionId: string,
    item: Omit<ItemConfiguracion, 'id'>
  ): Promise<ItemConfiguracion> => {
    const db = getFirestoreDb()
    const snap = await getDoc(doc(db, COLECCION, configuracionId))
    if (!snap.exists()) throw new Error('Repositorio de configuración no encontrado')
    const cfg = docToConfiguracion(snap.id, snap.data())

    const nuevoItem: ItemConfiguracion = { ...item, id: uuidv4() }
    await updateDoc(doc(db, COLECCION, configuracionId), {
      itemsConfiguracion: [...cfg.itemsConfiguracion, nuevoItem],
      actualizadoEn: Timestamp.now(),
    })
    return nuevoItem
  },

  /** Actualiza un ítem de configuración */
  actualizarItem: async (
    configuracionId: string,
    itemId: string,
    cambios: Partial<Omit<ItemConfiguracion, 'id'>>
  ): Promise<void> => {
    const db = getFirestoreDb()
    const snap = await getDoc(doc(db, COLECCION, configuracionId))
    if (!snap.exists()) throw new Error('Repositorio de configuración no encontrado')
    const cfg = docToConfiguracion(snap.id, snap.data())

    const items = cfg.itemsConfiguracion.map((i) =>
      i.id === itemId ? { ...i, ...cambios } : i
    )
    await updateDoc(doc(db, COLECCION, configuracionId), {
      itemsConfiguracion: items,
      actualizadoEn: Timestamp.now(),
    })
  },

  /** Actualiza la composición del CCB para este proyecto (independiente del CCB del SRS) */
  actualizarCCB: async (
    configuracionId: string,
    ccbComposicion: MiembroCCB[]
  ): Promise<void> => {
    const db = getFirestoreDb()
    await updateDoc(doc(db, COLECCION, configuracionId), {
      ccbComposicion,
      actualizadoEn: Timestamp.now(),
    })
  },

  /**
   * Crea una solicitud de cambio al repositorio (SCR).
   * M2-06: Flujo de 3 etapas: propuesta → en_analisis → evaluada → aprobada/rechazada → implementada
   */
  crearSCR: async (
    configuracionId: string,
    scr: Omit<SolicitudCambioRepositorio, 'id' | 'configuracionId' | 'estado' | 'creadoEn' | 'actualizadoEn' | 'creadoPor'>
  ): Promise<SolicitudCambioRepositorio> => {
    const db = getFirestoreDb()
    const uid = getCurrentUserId()
    const ahora = Timestamp.now()

    const snap = await getDoc(doc(db, COLECCION, configuracionId))
    if (!snap.exists()) throw new Error('Repositorio de configuración no encontrado')
    const cfg = docToConfiguracion(snap.id, snap.data())

    const nuevaSCR: SolicitudCambioRepositorio = {
      ...scr,
      id: uuidv4(),
      configuracionId,
      estado: 'propuesta',
      creadoEn: ahora.toDate(),
      actualizadoEn: ahora.toDate(),
      creadoPor: uid,
    }

    await updateDoc(doc(db, COLECCION, configuracionId), removeUndefined({
      solicitudesCambio: [...cfg.solicitudesCambio, nuevaSCR],
      actualizadoEn: ahora,
    }))

    return nuevaSCR
  },

  /**
   * Avanza una SCR al siguiente estado del flujo.
   * M2-06: propuesta → en_analisis → evaluada (CCB) → aprobada/rechazada → implementada
   */
  avanzarSCR: async (
    configuracionId: string,
    scrId: string,
    datos: {
      nuevoEstado: SolicitudCambioRepositorio['estado']
      analisisTecnico?: string
      resolucionCCB?: 'aprobar' | 'rechazar' | 'diferir'
      motivoCCB?: string
      miembrosPresentes?: string[]
      versionResultante?: string
    }
  ): Promise<void> => {
    const db = getFirestoreDb()
    const ahora = Timestamp.now()

    const snap = await getDoc(doc(db, COLECCION, configuracionId))
    if (!snap.exists()) throw new Error('Repositorio de configuración no encontrado')
    const cfg = docToConfiguracion(snap.id, snap.data())

    const scrs = cfg.solicitudesCambio.map((s) => {
      if (s.id !== scrId) return s
      const actualizado: SolicitudCambioRepositorio = {
        ...s,
        estado: datos.nuevoEstado,
        actualizadoEn: ahora.toDate(),
      }
      if (datos.analisisTecnico) {
        actualizado.analisisTecnico = datos.analisisTecnico
        actualizado.fechaAnalisis = ahora.toDate()
      }
      if (datos.resolucionCCB) {
        actualizado.resolucionCCB = datos.resolucionCCB
        actualizado.motivoCCB = datos.motivoCCB
        actualizado.miembrosPresentes = datos.miembrosPresentes
        actualizado.fechaEvaluacion = ahora.toDate()
      }
      if (datos.versionResultante) {
        actualizado.versionResultante = datos.versionResultante
        actualizado.fechaImplementacion = ahora.toDate()
      }
      return actualizado
    })

    await updateDoc(doc(db, COLECCION, configuracionId), removeUndefined({
      solicitudesCambio: scrs,
      actualizadoEn: ahora,
    }))
  },

  /**
   * Registra una nueva versión en el historial inmutable del repositorio.
   * M2-06: El historial de versiones es append-only (nunca se modifica ni elimina).
   */
  registrarVersion: async (
    configuracionId: string,
    nuevaVersion: string,
    descripcion: string,
    cambios: string[],
    scrId?: string
  ): Promise<void> => {
    const db = getFirestoreDb()
    const uid = getCurrentUserId()
    const ahora = Timestamp.now()

    const snap = await getDoc(doc(db, COLECCION, configuracionId))
    if (!snap.exists()) throw new Error('Repositorio de configuración no encontrado')
    const cfg = docToConfiguracion(snap.id, snap.data())

    const entrada: VersionRepositorio = {
      version: nuevaVersion,
      fecha: ahora.toDate(),
      descripcion,
      cambios,
      aprobadoPor: uid,
      scrId,
    }

    await updateDoc(doc(db, COLECCION, configuracionId), removeUndefined({
      version: nuevaVersion,
      historialVersiones: [...cfg.historialVersiones, entrada],
      actualizadoEn: ahora,
    }))
  },

  /** Cambia el estado del repositorio de configuración */
  cambiarEstado: async (
    configuracionId: string,
    estado: EstadoConfiguracionProyecto
  ): Promise<void> => {
    const db = getFirestoreDb()
    await updateDoc(doc(db, COLECCION, configuracionId), {
      estado,
      actualizadoEn: Timestamp.now(),
    })
  },
}
