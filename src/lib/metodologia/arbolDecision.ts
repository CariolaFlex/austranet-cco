// ============================================================
// ÁRBOL DE DECISIÓN DE METODOLOGÍA — M2-07 §3.2
// Implementa el árbol de decisión de Sommerville Cap. 3 §3.2 (pp. 63-64)
// mapeado a los campos exactos del tipo Proyecto.
// ============================================================

import type { MetodologiaProyecto, InputsMetodologiaSnapshot } from '@/types'

export interface ResultadoRecomendacion {
  recomendacion: MetodologiaProyecto
  justificacion: string
  rutaDecision: string[]
}

export interface ValidacionHardBlock {
  esValido: boolean
  mensajeBloqueo?: string
  campo?: string
}

/**
 * Árbol de decisión de metodología (M2-07 §3.2).
 * Recibe los 7 campos decisorios y devuelve la metodología recomendada
 * con justificación textual y la ruta seguida en el árbol.
 */
export function calcularRecomendacionMetodologia(
  inputs: InputsMetodologiaSnapshot
): ResultadoRecomendacion {
  const {
    requiereRegulacionExterna,
    criticidad,
    estabilidadRequerimientos,
    tamanoEquipo,
    distribuidoGeograficamente,
    clienteDisponibleParaIteraciones,
    tieneContratoFijo,
  } = inputs

  const ruta: string[] = []

  // ─── RAMA 1: regulación externa ───────────────────────────────────────────
  if (requiereRegulacionExterna) {
    ruta.push('requiereRegulacionExterna = true')

    if (criticidad === 'alta' || criticidad === 'critica') {
      ruta.push('criticidad = alta/critica')
      return {
        recomendacion: 'cascada',
        justificacion:
          'Proyecto regulado externamente con criticidad alta o crítica. ' +
          'Regulación + alta criticidad = máxima documentación obligatoria. ' +
          'El modelo cascada garantiza la trazabilidad y el SRS completo que exigen los reguladores (Sommerville Cap. 3 §3.2, p. 63).',
        rutaDecision: ruta,
      }
    } else {
      ruta.push('criticidad = baja/media')
      return {
        recomendacion: 'incremental',
        justificacion:
          'Proyecto regulado externamente con criticidad tolerable. ' +
          'El modelo incremental permite entregas parciales con documentación formal por hito, ' +
          'satisfaciendo los requisitos regulatorios sin la rigidez de cascada (Sommerville Cap. 3 §3.2, p. 63).',
        rutaDecision: ruta,
      }
    }
  }

  ruta.push('requiereRegulacionExterna = false')

  // ─── RAMA 2: estabilidad de requerimientos ────────────────────────────────
  if (estabilidadRequerimientos === 'alta') {
    ruta.push('estabilidadRequerimientos = alta')

    if (tamanoEquipo > 10 || distribuidoGeograficamente) {
      ruta.push(`tamanoEquipo > 10 (${tamanoEquipo}) o distribuidoGeograficamente = ${distribuidoGeograficamente}`)
      return {
        recomendacion: 'rup',
        justificacion:
          'Requerimientos estables con equipo grande o distribuido. ' +
          'RUP provee el proceso formal necesario para coordinar equipos grandes y distribuidos, ' +
          'con sus 4 fases y flujos de trabajo UML (Sommerville Cap. 2 §2.4).',
        rutaDecision: ruta,
      }
    } else {
      ruta.push(`tamanoEquipo ≤ 10 (${tamanoEquipo}) y distribuidoGeograficamente = false`)
      return {
        recomendacion: 'cascada',
        justificacion:
          'Requerimientos estables, equipo pequeño-mediano co-ubicado. ' +
          'Contexto ideal para cascada: requerimientos congelados permiten planificación completa ' +
          'previa a la ejecución (Sommerville Cap. 2 §2.1.1, p. 32).',
        rutaDecision: ruta,
      }
    }
  }

  ruta.push(`estabilidadRequerimientos = ${estabilidadRequerimientos} (media/baja)`)

  // ─── RAMA 3: volatilidad + disponibilidad del cliente ────────────────────
  if (clienteDisponibleParaIteraciones) {
    ruta.push('clienteDisponibleParaIteraciones = true')

    if (tamanoEquipo <= 9) {
      ruta.push(`tamanoEquipo ≤ 9 (${tamanoEquipo})`)

      if (estabilidadRequerimientos === 'baja') {
        ruta.push('estabilidadRequerimientos = baja')
        return {
          recomendacion: 'agil_xp',
          justificacion:
            'Máxima volatilidad de requerimientos, equipo muy pequeño, cliente disponible. ' +
            'XP con TDD y pair programming es la metodología óptima para cambio continuo ' +
            '(Sommerville Cap. 3 §3.3).',
          rutaDecision: ruta,
        }
      } else {
        ruta.push('estabilidadRequerimientos = media')
        return {
          recomendacion: 'agil_scrum',
          justificacion:
            'Cambio moderado de requerimientos, equipo pequeño (≤9), cliente disponible por sprint. ' +
            'Scrum con sprints de 2-4 semanas permite adaptación controlada ' +
            '(Sommerville Cap. 3 §3.4, p. 73).',
          rutaDecision: ruta,
        }
      }
    } else {
      ruta.push(`tamanoEquipo > 9 (${tamanoEquipo})`)
      return {
        recomendacion: 'hibrido',
        justificacion:
          `Ágil no escala sin adaptación para equipos de ${tamanoEquipo} personas. ` +
          'Un enfoque híbrido (ej. RUP para fases + Scrum para Construcción) permite combinar ' +
          'la estructura formal con la flexibilidad ágil (Sommerville Cap. 3 §3.5).',
        rutaDecision: ruta,
      }
    }
  } else {
    ruta.push('clienteDisponibleParaIteraciones = false')

    if (tieneContratoFijo) {
      ruta.push('tieneContratoFijo = true')
      return {
        recomendacion: 'cascada',
        justificacion:
          'Sin disponibilidad del cliente para iteraciones y con contrato fijo. ' +
          'La máxima documentación previa es obligatoria para proteger contractualmente al proyecto ' +
          '(Sommerville Cap. 3 §3.2, p. 64).',
        rutaDecision: ruta,
      }
    } else {
      ruta.push('tieneContratoFijo = false')
      return {
        recomendacion: 'incremental',
        justificacion:
          'Entregas definidas sin iteración ágil: cliente no disponible pero sin contrato fijo. ' +
          'El modelo incremental permite entregas funcionales parciales sin requerir disponibilidad ' +
          'continua del cliente (Sommerville Cap. 2 §2.1.2).',
        rutaDecision: ruta,
      }
    }
  }
}

/**
 * Valida las condiciones bloqueantes de M2-07 §3.3.
 * Devuelve `esValido = true` si no hay hard-block.
 */
export function validarHardBlock(
  metodologia: MetodologiaProyecto,
  inputs: InputsMetodologiaSnapshot
): ValidacionHardBlock {
  const { tamanoEquipo, clienteDisponibleParaIteraciones, requiereRegulacionExterna, tieneContratoFijo, estabilidadRequerimientos } = inputs

  switch (metodologia) {
    case 'agil_scrum':
      if (!clienteDisponibleParaIteraciones) {
        return {
          esValido: false,
          mensajeBloqueo:
            'Scrum requiere disponibilidad del cliente para revisiones por sprint. ' +
            'Cambia a "Incremental" o confirma disponibilidad del cliente actualizando el perfil en Módulo 1.',
          campo: 'clienteDisponibleParaIteraciones',
        }
      }
      if (requiereRegulacionExterna && tieneContratoFijo) {
        return {
          esValido: false,
          mensajeBloqueo:
            'Proyecto regulado con contrato fijo requiere SRS formal. Metodología ágil solo es compatible ' +
            'si se documenta el SRS completo antes de iniciar desarrollo (ver M3-01, Sección 2).',
          campo: 'requiereRegulacionExterna',
        }
      }
      break

    case 'agil_xp':
      if (!clienteDisponibleParaIteraciones) {
        return {
          esValido: false,
          mensajeBloqueo:
            'XP requiere disponibilidad del cliente para revisiones por sprint. ' +
            'Confirma disponibilidad del cliente actualizando el perfil en Módulo 1.',
          campo: 'clienteDisponibleParaIteraciones',
        }
      }
      if (tamanoEquipo > 6) {
        return {
          esValido: false,
          mensajeBloqueo:
            `XP no escala sobre 6 personas (Sommerville Cap. 3 §3.5). ` +
            `El equipo actual tiene ${tamanoEquipo} personas. Considera Scrum o Incremental para este tamaño.`,
          campo: 'tamanoEquipo',
        }
      }
      if (requiereRegulacionExterna && tieneContratoFijo) {
        return {
          esValido: false,
          mensajeBloqueo:
            'Proyecto regulado con contrato fijo requiere SRS formal. Metodología ágil solo es compatible ' +
            'si se documenta el SRS completo antes de iniciar desarrollo (ver M3-01, Sección 2).',
          campo: 'requiereRegulacionExterna',
        }
      }
      break

    case 'cascada':
      if (estabilidadRequerimientos === 'baja') {
        return {
          esValido: false,
          mensajeBloqueo:
            'Cascada requiere requerimientos estables. ' +
            'Con alta volatilidad de requerimientos, considera Incremental o Scrum.',
          campo: 'estabilidadRequerimientos',
        }
      }
      break

    case 'rup':
      if (tamanoEquipo < 5) {
        return {
          esValido: false,
          mensajeBloqueo:
            `RUP está diseñado para equipos medianos-grandes (mín. 5 personas). ` +
            `El equipo actual tiene ${tamanoEquipo} personas. Considera Incremental o Scrum.`,
          campo: 'tamanoEquipo',
        }
      }
      break
  }

  return { esValido: true }
}
