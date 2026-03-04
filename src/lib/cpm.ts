/**
 * CPM — Critical Path Method (Método del Camino Crítico)
 * M4: Módulo Cronograma y Control Visual
 *
 * Algoritmo puro sin dependencias React. Ejecutable en cliente (≤200 tareas)
 * o en Cloud Function. Complejidad: O(V + E) — forward + backward pass BFS.
 *
 * Soporta los 4 tipos de dependencia PMI/P6: FS, SS, FF, SF con lag.
 */

// -------------------------------------------------------
// TIPOS (locales, no importa @/types para evitar ciclos)
// -------------------------------------------------------

export type TipoDependencia = 'FS' | 'SS' | 'FF' | 'SF'

export interface NodoCPM {
  id: string
  duracion: number                          // Días (entero, ≥ 0)
  dependencias: Array<{
    id: string                              // ID del predecesor
    tipo: TipoDependencia
    lagDias: number                         // + retraso, - adelanto
  }>
}

export interface ResultadoNodoCPM {
  es: number    // Early Start (días desde día 0 del proyecto)
  ef: number    // Early Finish = es + duracion
  ls: number    // Late Start
  lf: number    // Late Finish = ls + duracion
  holguraTotal: number      // ls - es (o lf - ef). 0 = nodo crítico
  holguraLibre: number      // Diferencia entre EF del nodo y ES más temprano de sus sucesores
  esCritica: boolean        // holguraTotal === 0
}

export type ResultadoCPM = Record<string, ResultadoNodoCPM>

// -------------------------------------------------------
// HELPER: Calcular ES de sucesor basado en tipo de dependencia
// -------------------------------------------------------

function calcularESDesde(
  tipoSucesor: TipoDependencia,
  lag: number,
  predecesorES: number,
  predecesorEF: number,
  duracionSucesor: number,
): number {
  switch (tipoSucesor) {
    case 'FS':
      return predecesorEF + lag                           // Sucesor inicia cuando termina predecesor
    case 'SS':
      return predecesorES + lag                           // Sucesor inicia cuando inicia predecesor
    case 'FF':
      return predecesorEF + lag - duracionSucesor         // EF sucesor = EF predecesor + lag → ES = EF_s - dur_s
    case 'SF':
      return predecesorES + lag - duracionSucesor         // EF sucesor ≥ LS predecesor + lag (raro en práctica)
    default:
      return predecesorEF + lag
  }
}

// -------------------------------------------------------
// FUNCIÓN PRINCIPAL
// -------------------------------------------------------

/**
 * Calcula CPM (Forward + Backward pass) para una lista de tareas.
 *
 * @param tareas Lista de nodos con sus duraciones y dependencias
 * @returns Mapa de resultados CPM por ID de tarea
 */
export function calcularCPM(tareas: NodoCPM[]): ResultadoCPM {
  if (tareas.length === 0) return {}

  // Construir mapa de nodos y listas de adyacencia
  const nodosMap = new Map<string, NodoCPM>()
  const sucesores = new Map<string, string[]>()     // id → lista de IDs sucesores
  const inDegree = new Map<string, number>()        // Para ordenamiento topológico

  for (const tarea of tareas) {
    nodosMap.set(tarea.id, tarea)
    if (!sucesores.has(tarea.id)) sucesores.set(tarea.id, [])
    if (!inDegree.has(tarea.id)) inDegree.set(tarea.id, 0)
  }

  // Construir grafo de sucesores e in-degree
  for (const tarea of tareas) {
    for (const dep of tarea.dependencias) {
      // dep.id es el predecesor, tarea.id es el sucesor
      if (!sucesores.has(dep.id)) sucesores.set(dep.id, [])
      sucesores.get(dep.id)!.push(tarea.id)
      inDegree.set(tarea.id, (inDegree.get(tarea.id) ?? 0) + 1)
    }
  }

  // ─── FORWARD PASS (Kahn's topological sort + ES/EF) ────────────────────────
  const es = new Map<string, number>()
  const ef = new Map<string, number>()

  const cola: string[] = []
  const ordenTopologico: string[] = []

  // Inicializar nodos raíz (sin predecesores)
  for (const tarea of tareas) {
    if ((inDegree.get(tarea.id) ?? 0) === 0) {
      cola.push(tarea.id)
      es.set(tarea.id, 0)
    }
  }

  const tempInDegree = new Map(inDegree)

  while (cola.length > 0) {
    const actual = cola.shift()!
    ordenTopologico.push(actual)
    const nodoActual = nodosMap.get(actual)!
    const efActual = (es.get(actual) ?? 0) + nodoActual.duracion
    ef.set(actual, efActual)

    for (const sucesorId of (sucesores.get(actual) ?? [])) {
      const sucesorNodo = nodosMap.get(sucesorId)!
      // Calcular ES tentativo desde este predecesor
      const depDef = sucesorNodo.dependencias.find((d) => d.id === actual)!
      const esTentativo = calcularESDesde(
        depDef.tipo,
        depDef.lagDias,
        es.get(actual) ?? 0,
        efActual,
        sucesorNodo.duracion,
      )
      // ES del sucesor = max de todos sus predecesores (más restrictivo)
      const esActualSucesor = es.get(sucesorId) ?? -Infinity
      es.set(sucesorId, Math.max(esActualSucesor, esTentativo))

      tempInDegree.set(sucesorId, (tempInDegree.get(sucesorId) ?? 1) - 1)
      if ((tempInDegree.get(sucesorId) ?? 0) === 0) {
        cola.push(sucesorId)
      }
    }
  }

  // Detectar ciclos (si quedaron nodos sin procesar)
  if (ordenTopologico.length < tareas.length) {
    console.warn('[CPM] Ciclo detectado en dependencias. El CPM puede ser incorrecto.')
    // Completar con datos por defecto para nodos en ciclo
    for (const tarea of tareas) {
      if (!es.has(tarea.id)) {
        es.set(tarea.id, 0)
        ef.set(tarea.id, tarea.duracion)
        ordenTopologico.push(tarea.id)
      }
    }
  }

  // ─── BACKWARD PASS (LS/LF) ─────────────────────────────────────────────────
  const ls = new Map<string, number>()
  const lf = new Map<string, number>()

  // Duración total del proyecto = max(EF de todos los nodos)
  let proyectoDuracion = 0
  for (const id of ordenTopologico) {
    proyectoDuracion = Math.max(proyectoDuracion, ef.get(id) ?? 0)
  }

  // Inicializar nodos finales (sin sucesores)
  for (const tarea of tareas) {
    if ((sucesores.get(tarea.id)?.length ?? 0) === 0) {
      lf.set(tarea.id, proyectoDuracion)
      ls.set(tarea.id, proyectoDuracion - tarea.duracion)
    }
  }

  // Recorrer en orden inverso
  for (let i = ordenTopologico.length - 1; i >= 0; i--) {
    const actual = ordenTopologico[i]
    const nodoActual = nodosMap.get(actual)!
    const lfActual = lf.get(actual) ?? proyectoDuracion

    ls.set(actual, lfActual - nodoActual.duracion)

    // Propagar hacia predecesores
    for (const dep of nodoActual.dependencias) {
      const predId = dep.id
      const predNodo = nodosMap.get(predId)
      if (!predNodo) continue

      // Calcular LF tentativo del predecesor desde este sucesor
      let lfTentativoPred: number
      switch (dep.tipo) {
        case 'FS':
          lfTentativoPred = (ls.get(actual) ?? 0) - dep.lagDias
          break
        case 'SS':
          lfTentativoPred = (ls.get(actual) ?? 0) - dep.lagDias + predNodo.duracion
          break
        case 'FF':
          lfTentativoPred = lfActual - dep.lagDias
          break
        case 'SF':
          lfTentativoPred = (ls.get(actual) ?? 0) - dep.lagDias + predNodo.duracion
          break
        default:
          lfTentativoPred = (ls.get(actual) ?? 0) - dep.lagDias
      }
      // LF del predecesor = min de todos sus sucesores
      const lfActualPred = lf.get(predId) ?? Infinity
      lf.set(predId, Math.min(lfActualPred, lfTentativoPred))
      ls.set(predId, lf.get(predId)! - predNodo.duracion)
    }
  }

  // ─── CALCULAR HOLGURAS Y ENSAMBLAR RESULTADO ────────────────────────────────

  // Holgura libre: para cada nodo, es la diferencia entre su EF y el ES mínimo de sus sucesores
  const holguraLibreMap = new Map<string, number>()
  for (const id of ordenTopologico) {
    const nodo = nodosMap.get(id)!
    const efNodo = ef.get(id) ?? 0
    const listaSucesores = sucesores.get(id) ?? []

    if (listaSucesores.length === 0) {
      holguraLibreMap.set(id, proyectoDuracion - efNodo)
    } else {
      let esMinSucesores = Infinity
      for (const sucId of listaSucesores) {
        esMinSucesores = Math.min(esMinSucesores, es.get(sucId) ?? Infinity)
      }
      holguraLibreMap.set(id, Math.max(0, esMinSucesores - efNodo))
    }
  }

  // Construir resultado final
  const resultado: ResultadoCPM = {}
  for (const tarea of tareas) {
    const id = tarea.id
    const holguraTotal = (ls.get(id) ?? 0) - (es.get(id) ?? 0)
    resultado[id] = {
      es: Math.max(0, es.get(id) ?? 0),
      ef: ef.get(id) ?? tarea.duracion,
      ls: ls.get(id) ?? 0,
      lf: lf.get(id) ?? proyectoDuracion,
      holguraTotal: Math.max(0, holguraTotal),
      holguraLibre: Math.max(0, holguraLibreMap.get(id) ?? 0),
      esCritica: Math.max(0, holguraTotal) === 0,
    }
  }

  return resultado
}

// -------------------------------------------------------
// UTILIDADES AUXILIARES
// -------------------------------------------------------

/**
 * Extrae la lista de IDs que forman la ruta crítica (en orden topológico).
 */
export function obtenerRutaCritica(resultado: ResultadoCPM): string[] {
  return Object.entries(resultado)
    .filter(([, r]) => r.esCritica)
    .sort(([, a], [, b]) => a.es - b.es)
    .map(([id]) => id)
}

/**
 * Convierte días de offset desde el inicio del proyecto a una fecha real.
 * @param diasOffset Días desde el día 0 (inicio del proyecto)
 * @param fechaInicio Fecha de inicio del proyecto
 * @param soloHabilesEnFuturo Si true, salta fines de semana (simplificado)
 */
export function diasAFecha(diasOffset: number, fechaInicio: Date): Date {
  const fecha = new Date(fechaInicio)
  fecha.setDate(fecha.getDate() + Math.round(diasOffset))
  return fecha
}

/**
 * Calcula la duración en días entre dos fechas (días calendario).
 */
export function duracionEnDias(inicio: Date, fin: Date): number {
  const ms = fin.getTime() - inicio.getTime()
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)))
}
