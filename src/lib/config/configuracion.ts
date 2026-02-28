// ============================================================
// UTILIDAD: Acceso seguro a configuración del sistema — T-06
// Provee getConfigValue con fallback a defaults.
// ============================================================

import type { ConfiguracionSistema } from '@/types'
import { CONFIG_SISTEMA_DEFAULTS } from '@/types'

/**
 * Obtiene un valor de la configuración del sistema usando un path con puntos.
 * Si la config no está disponible o el path no existe, retorna el defaultValue.
 *
 * @example
 * const dias = getConfigValue(config, 'proyectos.semaforoRojo.diasHitoVencidoSinCerrar', 3)
 */
export function getConfigValue<T>(
  config: ConfiguracionSistema | null | undefined,
  path: string,
  defaultValue: T
): T {
  const source = config ?? CONFIG_SISTEMA_DEFAULTS
  const parts = path.split('.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = source
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue
    }
    current = current[part]
  }
  return current !== undefined && current !== null ? (current as T) : defaultValue
}

/**
 * Verifica si el modo mantenimiento está activo.
 * Si la config no está disponible, asume que NO está en mantenimiento.
 */
export function isModoMantenimiento(config: ConfiguracionSistema | null | undefined): boolean {
  return config?.sistema?.modoMantenimiento ?? false
}
