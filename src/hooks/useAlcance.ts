// ============================================================
// HOOKS: Alcance / SRS — Módulo 3 (Sprint M3-FULL)
// Patrón: TanStack Query + alcanceService (idéntico a useProyectos.ts)
//
// Jerarquía de query keys:
//   ['srs', proyectoId]                          — doc SRS del proyecto
//   ['requerimientos', srsId]                    — array de RFs/RNFs/RDs
//   ['sesionesEntrevista', srsId]                — entrevistas
//   ['escenarios', srsId]                        — escenarios / HU
//   ['casosPrueba', srsId]                       — CPs de aceptación
//   ['terminosDominio', srsId]                   — glosario SRS
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { alcanceService } from '@/services/alcance.service'
import type {
  SRS,
  Requerimiento,
  SesionEntrevista,
  Escenario,
  CasoPrueba,
  TerminoDominioSRS,
  EstadoSRS,
  EstadoGate1,
  Factibilidad,
  Prototipo,
  ArtefactoModelo,
  ObservacionValidacion,
  ItemChecklistSRS,
  SolicitudCambioSRS,
  EstadoSCRSRS,
  CrearRequerimientoDTO,
  CrearSesionEntrevistaDTO,
  CrearEscenarioDTO,
  CrearCasoPruebaDTO,
  CrearTerminoDominioSRSDTO,
} from '@/types'

// ──────────────────────────────────────────────────────────────
// SRS (un documento por proyecto)
// ──────────────────────────────────────────────────────────────

/**
 * Obtiene el SRS del proyecto.
 * Deshabilitado si el proyecto no está en 'activo_en_definicion' o superior.
 */
export function useSRS(proyectoId: string | undefined) {
  return useQuery<SRS | null>({
    queryKey: ['srs', proyectoId],
    queryFn: () => alcanceService.getSRSByProyecto(proyectoId!),
    enabled: !!proyectoId,
    staleTime: 1000 * 60 * 2, // 2 min — el SRS no cambia frecuentemente
  })
}

export function useActualizarSRS() {
  const qc = useQueryClient()
  return useMutation<SRS, Error, { id: string; data: Partial<Omit<SRS, 'id' | 'creadoEn' | 'creadoPor'>> }>({
    mutationFn: ({ id, data }) => alcanceService.updateSRS(id, data),
    onSuccess: (srs) => {
      qc.setQueryData(['srs', srs.proyectoId], srs)
    },
  })
}

export function useActualizarEstadoSRS() {
  const qc = useQueryClient()
  return useMutation<void, Error, { srsId: string; proyectoId: string; estado: EstadoSRS }>({
    mutationFn: ({ srsId, estado }) => alcanceService.updateEstadoSRS(srsId, estado),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['srs', vars.proyectoId] })
    },
  })
}

// ──────────────────────────────────────────────────────────────
// GATE 1 (M3-GATE1 — Factibilidad)
// ──────────────────────────────────────────────────────────────

export function useProcesarGate1() {
  const qc = useQueryClient()
  return useMutation<void, Error, {
    srsId: string
    proyectoId: string
    decision: EstadoGate1
    factibilidad: Factibilidad
    decisionPor: string
  }>({
    mutationFn: ({ srsId, decision, factibilidad, decisionPor }) =>
      alcanceService.procesarGate1(srsId, decision, factibilidad, decisionPor),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['srs', vars.proyectoId] })
    },
  })
}

// ──────────────────────────────────────────────────────────────
// GATE 2 (M3-GATE2 — Aprobación formal SRS v1.0)
// ──────────────────────────────────────────────────────────────

export function useAprobarGate2() {
  const qc = useQueryClient()
  return useMutation<void, Error, {
    srsId: string
    proyectoId: string
    aprobadoPorId: string
    aprobadoPorNombre: string
  }>({
    mutationFn: ({ srsId, aprobadoPorId, aprobadoPorNombre }) =>
      alcanceService.aprobarGate2(srsId, aprobadoPorId, aprobadoPorNombre),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['srs', vars.proyectoId] })
    },
  })
}

// ──────────────────────────────────────────────────────────────
// REQUERIMIENTOS (RF / RNF / RD)
// ──────────────────────────────────────────────────────────────

export function useRequerimientos(srsId: string | undefined) {
  return useQuery<Requerimiento[]>({
    queryKey: ['requerimientos', srsId],
    queryFn: () => alcanceService.getRequerimientos(srsId!),
    enabled: !!srsId,
    staleTime: 1000 * 60,
  })
}

export function useCrearRequerimiento() {
  const qc = useQueryClient()
  return useMutation<Requerimiento, Error, CrearRequerimientoDTO>({
    mutationFn: (data) => alcanceService.createRequerimiento(data),
    onSuccess: (req) => {
      qc.invalidateQueries({ queryKey: ['requerimientos', req.srsId] })
    },
  })
}

export function useActualizarRequerimiento() {
  const qc = useQueryClient()
  return useMutation<
    Requerimiento,
    Error,
    { id: string; srsId: string; data: Partial<Omit<Requerimiento, 'id' | 'creadoEn' | 'creadoPor' | 'codigo' | 'srsId' | 'proyectoId'>> }
  >({
    mutationFn: ({ id, data }) => alcanceService.updateRequerimiento(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['requerimientos', vars.srsId] })
    },
  })
}

export function useEliminarRequerimiento() {
  const qc = useQueryClient()
  return useMutation<void, Error, { id: string; srsId: string; motivo?: string }>({
    mutationFn: ({ id, motivo }) => alcanceService.deleteRequerimiento(id, motivo),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['requerimientos', vars.srsId] })
    },
  })
}

// ──────────────────────────────────────────────────────────────
// SESIONES DE ENTREVISTA (M3-F2)
// ──────────────────────────────────────────────────────────────

export function useSesionesEntrevista(srsId: string | undefined) {
  return useQuery<SesionEntrevista[]>({
    queryKey: ['sesionesEntrevista', srsId],
    queryFn: () => alcanceService.getSesionesEntrevista(srsId!),
    enabled: !!srsId,
  })
}

export function useCrearSesionEntrevista() {
  const qc = useQueryClient()
  return useMutation<SesionEntrevista, Error, CrearSesionEntrevistaDTO>({
    mutationFn: (data) => alcanceService.createSesionEntrevista(data),
    onSuccess: (sesion) => {
      qc.invalidateQueries({ queryKey: ['sesionesEntrevista', sesion.srsId] })
    },
  })
}

export function useActualizarSesionEntrevista() {
  const qc = useQueryClient()
  return useMutation<
    void,
    Error,
    { id: string; srsId: string; data: Partial<Omit<SesionEntrevista, 'id' | 'creadoEn' | 'creadoPor'>> }
  >({
    mutationFn: ({ id, data }) => alcanceService.updateSesionEntrevista(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['sesionesEntrevista', vars.srsId] })
    },
  })
}

// ──────────────────────────────────────────────────────────────
// ESCENARIOS / HISTORIAS DE USUARIO (M3-F2)
// ──────────────────────────────────────────────────────────────

export function useEscenarios(srsId: string | undefined) {
  return useQuery<Escenario[]>({
    queryKey: ['escenarios', srsId],
    queryFn: () => alcanceService.getEscenarios(srsId!),
    enabled: !!srsId,
  })
}

export function useCrearEscenario() {
  const qc = useQueryClient()
  return useMutation<Escenario, Error, CrearEscenarioDTO>({
    mutationFn: (data) => alcanceService.createEscenario(data),
    onSuccess: (esc) => {
      qc.invalidateQueries({ queryKey: ['escenarios', esc.srsId] })
    },
  })
}

export function useActualizarEscenario() {
  const qc = useQueryClient()
  return useMutation<
    void,
    Error,
    { id: string; srsId: string; data: Partial<Omit<Escenario, 'id' | 'creadoEn' | 'creadoPor'>> }
  >({
    mutationFn: ({ id, data }) => alcanceService.updateEscenario(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['escenarios', vars.srsId] })
    },
  })
}

// ──────────────────────────────────────────────────────────────
// CASOS DE PRUEBA (M3-F7-02 / M3-10)
// ──────────────────────────────────────────────────────────────

export function useCasosPrueba(srsId: string | undefined) {
  return useQuery<CasoPrueba[]>({
    queryKey: ['casosPrueba', srsId],
    queryFn: () => alcanceService.getCasosPrueba(srsId!),
    enabled: !!srsId,
  })
}

export function useCrearCasoPrueba() {
  const qc = useQueryClient()
  return useMutation<CasoPrueba, Error, CrearCasoPruebaDTO>({
    mutationFn: (data) => alcanceService.createCasoPrueba(data),
    onSuccess: (cp) => {
      qc.invalidateQueries({ queryKey: ['casosPrueba', cp.srsId] })
      qc.invalidateQueries({ queryKey: ['requerimientos', cp.srsId] })
    },
  })
}

export function useActualizarCasoPrueba() {
  const qc = useQueryClient()
  return useMutation<
    void,
    Error,
    { id: string; srsId: string; data: Partial<Omit<CasoPrueba, 'id' | 'creadoEn' | 'creadoPor'>> }
  >({
    mutationFn: ({ id, data }) => alcanceService.updateCasoPrueba(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['casosPrueba', vars.srsId] })
    },
  })
}

// ──────────────────────────────────────────────────────────────
// TÉRMINOS DE DOMINIO SRS (M3-F1-02, M3-08)
// ──────────────────────────────────────────────────────────────

export function useTerminosDominio(srsId: string | undefined) {
  return useQuery<TerminoDominioSRS[]>({
    queryKey: ['terminosDominio', srsId],
    queryFn: () => alcanceService.getTerminosDominio(srsId!),
    enabled: !!srsId,
  })
}

export function useCrearTerminoDominio() {
  const qc = useQueryClient()
  return useMutation<TerminoDominioSRS, Error, CrearTerminoDominioSRSDTO>({
    mutationFn: (data) => alcanceService.createTerminoDominio(data),
    onSuccess: (termino) => {
      qc.invalidateQueries({ queryKey: ['terminosDominio', termino.srsId] })
    },
  })
}

export function useActualizarTerminoDominio() {
  const qc = useQueryClient()
  return useMutation<
    void,
    Error,
    { id: string; srsId: string; data: Partial<Omit<TerminoDominioSRS, 'id' | 'creadoEn' | 'creadoPor'>> }
  >({
    mutationFn: ({ id, data }) => alcanceService.updateTerminoDominio(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['terminosDominio', vars.srsId] })
    },
  })
}

// ──────────────────────────────────────────────────────────────
// PROTOTIPOS (embebidos en SRS — M3-F3)
// ──────────────────────────────────────────────────────────────

export function useAgregarPrototipo() {
  const qc = useQueryClient()
  return useMutation<
    Prototipo,
    Error,
    { srsId: string; proyectoId: string; data: Omit<Prototipo, 'id' | 'creadoEn' | 'creadoPor'> }
  >({
    mutationFn: ({ srsId, data }) => alcanceService.agregarPrototipo(srsId, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['srs', vars.proyectoId] })
    },
  })
}

export function useActualizarResultadoPrototipo() {
  const qc = useQueryClient()
  return useMutation<
    void,
    Error,
    {
      srsId: string
      proyectoId: string
      prototipoId: string
      resultado: Prototipo['resultado']
      resultadoPorRequerimiento?: Record<string, Prototipo['resultado']>
      observaciones?: string
    }
  >({
    mutationFn: ({ srsId, prototipoId, resultado, resultadoPorRequerimiento, observaciones }) =>
      alcanceService.actualizarResultadoPrototipo(
        srsId,
        prototipoId,
        resultado,
        resultadoPorRequerimiento,
        observaciones
      ),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['srs', vars.proyectoId] })
    },
  })
}

// ──────────────────────────────────────────────────────────────
// ARTEFACTOS DE MODELO UML (embebidos en SRS — M3-F4)
// ──────────────────────────────────────────────────────────────

export function useAgregarArtefactoModelo() {
  const qc = useQueryClient()
  return useMutation<
    ArtefactoModelo,
    Error,
    { srsId: string; proyectoId: string; data: Omit<ArtefactoModelo, 'id' | 'creadoEn' | 'creadoPor'> }
  >({
    mutationFn: ({ srsId, data }) => alcanceService.agregarArtefactoModelo(srsId, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['srs', vars.proyectoId] })
    },
  })
}

// ──────────────────────────────────────────────────────────────
// CHECKLIST DE VALIDACIÓN (M3-F7-01)
// ──────────────────────────────────────────────────────────────

export function useInicializarChecklist() {
  const qc = useQueryClient()
  return useMutation<void, Error, { srsId: string; proyectoId: string }>({
    mutationFn: ({ srsId }) => alcanceService.inicializarChecklist(srsId),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['srs', vars.proyectoId] })
    },
  })
}

export function useActualizarItemChecklist() {
  const qc = useQueryClient()
  return useMutation<
    void,
    Error,
    { srsId: string; proyectoId: string; codigo: string; estado: ItemChecklistSRS['estado']; nota?: string }
  >({
    mutationFn: ({ srsId, codigo, estado, nota }) =>
      alcanceService.actualizarItemChecklist(srsId, codigo, estado, nota),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['srs', vars.proyectoId] })
    },
  })
}

// ──────────────────────────────────────────────────────────────
// OBSERVACIONES DE VALIDACIÓN (M3-F7-01)
// ──────────────────────────────────────────────────────────────

export function useAgregarObservacion() {
  const qc = useQueryClient()
  return useMutation<
    ObservacionValidacion,
    Error,
    { srsId: string; proyectoId: string; data: Omit<ObservacionValidacion, 'id' | 'fechaCreacion' | 'resuelto'> }
  >({
    mutationFn: ({ srsId, data }) => alcanceService.agregarObservacion(srsId, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['srs', vars.proyectoId] })
    },
  })
}

export function useResolverObservacion() {
  const qc = useQueryClient()
  return useMutation<
    void,
    Error,
    { srsId: string; proyectoId: string; obsId: string; resolucionTexto: string }
  >({
    mutationFn: ({ srsId, obsId, resolucionTexto }) =>
      alcanceService.resolverObservacion(srsId, obsId, resolucionTexto),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['srs', vars.proyectoId] })
    },
  })
}

// ──────────────────────────────────────────────────────────────
// SCR DEL SRS (M3-09)
// ──────────────────────────────────────────────────────────────

export function useCrearSCRSRS() {
  const qc = useQueryClient()
  return useMutation<
    SolicitudCambioSRS,
    Error,
    {
      srsId: string
      proyectoId: string
      datos: Omit<SolicitudCambioSRS, 'id' | 'codigo' | 'estado' | 'creadoEn' | 'actualizadoEn' | 'creadoPor'>
    }
  >({
    mutationFn: ({ srsId, datos }) => alcanceService.crearSCRSRS(srsId, datos),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['srs', vars.proyectoId] })
    },
  })
}

export function useAvanzarSCRSRS() {
  const qc = useQueryClient()
  return useMutation<
    void,
    Error,
    {
      srsId: string
      proyectoId: string
      scrId: string
      datos: {
        nuevoEstado: EstadoSCRSRS
        analisisImpacto?: string
        resolucionCCB?: SolicitudCambioSRS['resolucionCCB']
        motivoCCB?: string
        miembrosPresentes?: string[]
        nuevaVersion?: string
      }
    }
  >({
    mutationFn: ({ srsId, scrId, datos }) => alcanceService.avanzarSCRSRS(srsId, scrId, datos),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['srs', vars.proyectoId] })
    },
  })
}

// ──────────────────────────────────────────────────────────────
// BUCLE DE RETROALIMENTACIÓN (M3-01 §5)
// ──────────────────────────────────────────────────────────────

export function useRegistrarIteracionBucle() {
  const qc = useQueryClient()
  return useMutation<
    void,
    Error,
    {
      srsId: string
      proyectoId: string
      fase: 'F3→F2' | 'F4→F2' | 'F7→F5'
      motivo: string
      reqsAfectados: string[]
    }
  >({
    mutationFn: ({ srsId, fase, motivo, reqsAfectados }) =>
      alcanceService.registrarIteracionBucle(srsId, fase, motivo, reqsAfectados),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['srs', vars.proyectoId] })
    },
  })
}
