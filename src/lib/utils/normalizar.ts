// ============================================================
// UTILIDAD: Normalización de texto — T-04 Búsqueda
// Convierte texto a minúsculas sin acentos para búsqueda por prefijo.
// ============================================================

/**
 * Normaliza un texto para búsqueda:
 * - Convierte a minúsculas
 * - Elimina acentos (NFD + rango diacrítico Unicode)
 * - Elimina espacios extra
 */
export function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // elimina diacríticos (acentos)
    .trim()
}

/**
 * Genera todos los prefijos de un texto normalizado para
 * soportar búsqueda por prefijo en Firestore sin Algolia.
 * Útil para poblar campos `nombre_keywords` en documentos.
 *
 * Ejemplo: "hola" → ["h", "ho", "hol", "hola"]
 */
export function generarPrefijos(texto: string, minLen = 2): string[] {
  const normalizado = normalizarTexto(texto)
  const prefijos: string[] = []
  for (let i = minLen; i <= normalizado.length; i++) {
    prefijos.push(normalizado.slice(0, i))
  }
  return prefijos
}
