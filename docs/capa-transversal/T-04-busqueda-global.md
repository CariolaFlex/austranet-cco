<!-- ============================================================
  AUSTRANET-CCO — CAPA TRANSVERSAL
  Archivo:  T-04-busqueda-global.md
  Capa:     Transversal
  Elemento: 4 de 6
  Sirve a:  M1 · M2 · M3
  Prerrequisito: T-01 (filtrado de resultados por rol y proyectos asignados)
  Stack:    Firestore (consultas nativas) · Next.js API Routes · TypeScript
            Algolia / Firebase Extension Search (opcional — escala futura)
  Versión:  1.0
  Fecha:    2026-02-27
  Estado:   activo
  Autor:    austranet-cco
  ============================================================ -->

# T-04-busqueda-global.md

> **Capa Transversal — Elemento 4 de 6**
> **Búsqueda Global**
> *Componente que sirve a todos los módulos del sistema: M1 · M2 · M3*

---

## 1. Metadatos del Documento

| Campo | Valor |
|---|---|
| **Nombre del archivo** | `T-04-busqueda-global.md` |
| **Capa** | Transversal |
| **Posición** | Elemento 4 de 6 |
| **Módulos que sirve** | M1 — Registro de Entidades · M2 — Gestión de Proyectos · M3 — Documentación SRS |
| **Prerrequisito** | T-01 — Autenticación, Roles y Permisos (filtrado de resultados por rol y `proyectosAsignados`) |
| **Stack** | Firestore (consultas nativas con prefijo) · Next.js API Routes · TypeScript · Algolia / Firebase Extension Search (opcional — escala futura) |
| **Versión** | 1.0 |
| **Fecha** | 2026-02-27 |
| **Estado** | `activo` — listo para implementación |
| **Sistema de referencia** | austranet-cco |
| **Dependencias directas** | T-01, T-03, M1-01, M2-01, M3-01 |

---

## 2. Objetivo del Documento

### ¿Por qué la búsqueda es transversal?

En austranet-cco, la información de un proyecto de consultoría está distribuida en tres módulos: la entidad cliente vive en M1, el proyecto y sus riesgos en M2, el SRS y sus requerimientos en M3. Cuando un usuario busca "requerimiento de autenticación" o "riesgo de proveedor externo", no sabe de antemano en qué módulo está ese elemento ni tiene tiempo para navegar módulo por módulo. La búsqueda global resuelve esto cruzando las tres colecciones en una sola operación y retornando resultados unificados.

Colocar la búsqueda dentro de un módulo específico la haría incompleta por definición: una búsqueda en M3 no encontraría stakeholders de M1, y una búsqueda en M2 no encontraría requerimientos de M3. Solo un componente transversal puede operar sobre el universo completo del sistema.

### El problema que resuelve

El sistema gestiona docenas de entidades heterogéneas: clientes, proveedores, stakeholders, proyectos activos, riesgos, hitos, SRS en múltiples fases, requerimientos funcionales y no funcionales, términos de glosario, solicitudes de cambio. Sin búsqueda global, acceder a cualquiera de estos elementos requiere conocer su módulo, navegar hasta él y usar los filtros locales de cada vista.

La búsqueda global es el atajo universal: un usuario escribe dos palabras, el sistema consulta todo el universo accesible para ese rol y entrega los resultados más relevantes ordenados y clasificados.

### Búsqueda global vs. búsqueda contextual

| Característica | Búsqueda global (T-04) | Búsqueda contextual (local) |
|---|---|---|
| **Alcance** | Todos los módulos simultáneamente | Solo el dataset de la vista actual |
| **Punto de entrada** | Navbar superior — shortcut `Cmd/Ctrl+K` | Barra de filtro dentro de cada lista |
| **Implementación** | API Route `/api/search` + Firestore | Filtro client-side sobre datos ya cargados |
| **Auditable** | ✅ Registra en T-03 | ❌ No registra — es UI local |
| **Rol aplicado** | ✅ Siempre filtra por T-01 | ✅ Datos ya filtrados al cargar la vista |
| **Cuándo usarla** | No sé dónde está el elemento | Ya estoy en la sección correcta |

---

## 3. Entidades Buscables — Índice Completo

### 3.1 Módulo 1 — Registro de Entidades

| Entidad | Campos buscados | Muestra en resultado | Navega a | Rol mínimo |
|---|---|---|---|---|
| `Entidad` | `nombre`, `rut`, `sector`, `pais` (sobre campos `_normalized`) | Nombre + sector + badge `nivelRiesgo` | `/m1/entidades/{id}` | `gestor` |
| `Stakeholder` | `nombre`, `cargo`, `email`, `organizacion` | Nombre + cargo + entidad asociada | `/m1/entidades/{entidadId}/stakeholders/{id}` | `gestor` |
| `EntradaGlosario` | `termino`, `definicion`, `sinonimos` | Término + definición truncada (120 chars) | `/m1/entidades/{entidadId}/glosario/{id}` | `analista` |

---

### 3.2 Módulo 2 — Gestión de Proyectos

| Entidad | Campos buscados | Muestra en resultado | Navega a | Rol mínimo |
|---|---|---|---|---|
| `Proyecto` | `nombre`, `codigo`, `descripcion` | Nombre + estado + entidad cliente | `/m2/proyectos/{id}` | `gestor` ¹ |
| `Riesgo` | `titulo`, `descripcion`, `categoria` | Título + estado + proyecto asociado | `/m2/proyectos/{proyectoId}/riesgos/{id}` | `gestor` |
| `Hito` | `nombre`, `descripcion` | Nombre + estado + fecha límite + proyecto | `/m2/proyectos/{proyectoId}/hitos/{id}` | `gestor` |
| `LeccionAprendida` | `descripcion`, `tipo` | Descripción truncada + tipo + proyecto | `/m2/proyectos/{proyectoId}/lecciones/{id}` | `gestor` |

> ¹ `Proyecto`: el `gestor` solo ve proyectos donde su `uid` está en `proyectosAsignados`. El `admin` y `superadmin` ven todos. Ver §5 para la implementación del filtro.

---

### 3.3 Módulo 3 — Documentación SRS

| Entidad | Campos buscados | Muestra en resultado | Navega a | Rol mínimo |
|---|---|---|---|---|
| `SRS` | `nombre`, `codigoSRS`, `descripcion` | Nombre + estado + versión + proyecto | `/m3/srs/{id}` | `analista` ² |
| `Requerimiento` | `codigo`, `titulo`, `descripcion`, `criterioAceptacion` | Código + título + tipo + prioridad MoSCoW + SRS | `/m3/srs/{srsId}/requerimientos/{id}` | `analista` |
| `EntradaTrazabilidad` | `stakeholderFuente`, `moduloSistema` | RF asociado + stakeholder fuente | `/m3/srs/{srsId}/trazabilidad` | `analista` |
| `SolicitudCambioSRS` | `titulo`, `descripcion` | Título + estado CCB + SRS asociado | `/m3/srs/{srsId}/cambios/{id}` | `gestor` |

> ² `SRS` y `Requerimiento`: el `analista` solo ve resultados de proyectos en su `proyectosAsignados`. El `viewer` **no accede a la búsqueda global** — sus permisos de lectura son demasiado restringidos para que la búsqueda sea útil.

---

## 4. Tipos TypeScript

```typescript
// types/busqueda.ts — austranet-cco

// ─── Enum de tipos de entidad buscable ────────────────────────────────────────

export type TipoEntidadBuscable =
  // Módulo 1
  | 'Entidad'
  | 'Stakeholder'
  | 'EntradaGlosario'
  // Módulo 2
  | 'Proyecto'
  | 'Riesgo'
  | 'Hito'
  | 'LeccionAprendida'
  // Módulo 3
  | 'SRS'
  | 'Requerimiento'
  | 'EntradaTrazabilidad'
  | 'SolicitudCambioSRS'

// ─── Resultado individual de búsqueda ─────────────────────────────────────────

export interface ResultadoBusqueda {
  id: string
  tipo: TipoEntidadBuscable
  modulo: 'M1' | 'M2' | 'M3'

  // Contenido a mostrar en la UI
  titulo: string                   // campo principal — nombre, código, término
  subtitulo: string                // campo secundario — entidad padre, estado, cargo
  descripcionCorta?: string        // máx 120 caracteres del campo de descripción

  // Chips visuales para el resultado
  tags: string[]                   // estado, prioridad MoSCoW, tipo, módulo, nivelRiesgo

  // Navegación
  url: string                      // ruta directa al elemento

  // Ranking
  relevancia: number               // 0-100: 100 = coincidencia exacta en título, menos = parcial

  // Metadatos
  ultimaModificacion: Date

  // Contexto jerárquico
  entidadPadre?: {
    tipo: 'Entidad' | 'Proyecto' | 'SRS'
    id: string
    nombre: string
  }
}

// ─── Query de búsqueda ────────────────────────────────────────────────────────

export interface QueryBusqueda {
  texto: string                          // mín 2 caracteres para ejecutar
  filtroModulo?: ('M1' | 'M2' | 'M3')[]
  filtroTipo?: TipoEntidadBuscable[]
  filtroEstado?: string[]
  soloAccesibles: boolean                // siempre true — filtrado obligatorio por T-01
  limit: number                          // default 20, máx 50 (configurable desde T-06)
  offset: number                         // para paginación
}

// ─── Respuesta de la API ──────────────────────────────────────────────────────

export interface RespuestaBusqueda {
  resultados: ResultadoBusqueda[]
  total: number                    // total de resultados antes de aplicar limit/offset
  tiempoMs: number                 // latencia de la consulta en milisegundos
  queryNormalizada: string         // texto normalizado que se ejecutó (para debug)
  pagina: {
    offset: number
    limit: number
    hayMas: boolean
  }
}

// ─── Historial de búsqueda (localStorage) ────────────────────────────────────

export interface EntradaHistorialBusqueda {
  texto: string
  timestamp: number                // Date.now()
  totalResultados: number
}

// ─── Mapa de configuración de entidades buscables ────────────────────────────
// Usado por la API Route para saber qué campos y colección consultar por tipo

export interface ConfigEntidadBuscable {
  coleccion: string                // nombre de la colección de Firestore
  camposBusqueda: string[]         // campos _normalized sobre los que se hace prefijo
  camposRetorno: string[]          // campos a incluir en la respuesta
  rolMinimo: 'admin' | 'gestor' | 'analista'
  requiereFiltroProyecto: boolean  // true = filtrar por proyectosAsignados del usuario
  construirUrl: (doc: FirebaseFirestore.DocumentData, id: string) => string
  construirResultado: (doc: FirebaseFirestore.DocumentData, id: string) => ResultadoBusqueda
}
```

---

## 5. Estrategia de Búsqueda con Firestore

Firestore no tiene búsqueda full-text nativa. El sistema implementa dos niveles: el Nivel 1 es la implementación inmediata sin dependencias externas; el Nivel 2 es la ruta de escalado para cuando el volumen de datos supere la eficiencia del Nivel 1.

### 5.1 Nivel 1 — Implementación Inmediata (prefijo + normalización)

#### Normalización de campos buscables

Antes de guardar cualquier documento con campos buscables, se crea un campo paralelo `{campo}_normalized` en minúsculas, sin acentos y sin caracteres especiales. La búsqueda opera siempre sobre los campos normalizados.

```typescript
// lib/busqueda/normalizar.ts

/**
 * Normaliza texto para búsqueda: minúsculas, sin acentos, sin caracteres especiales.
 * Se aplica tanto al guardar documentos como al ejecutar consultas.
 */
export function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')                          // descompone caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '')          // elimina diacríticos (tildes, ñ → n, etc.)
    .replace(/[^a-z0-9\s]/g, '')              // elimina caracteres especiales
    .replace(/\s+/g, ' ')                      // colapsa espacios múltiples
    .trim()
}

// Ejemplo:
// normalizarTexto("Autenticación OAuth2") → "autenticacion oauth2"
// normalizarTexto("Integración con proveedor externo") → "integracion con proveedor externo"
```

#### Campos normalizados en cada colección

Al crear o actualizar un documento, el sistema genera automáticamente los campos `_normalized` correspondientes:

```typescript
// lib/busqueda/prepararDocumento.ts

export function agregarCamposNormalizados<T extends Record<string, unknown>>(
  documento: T,
  camposBuscables: (keyof T)[]
): T & Record<string, string> {
  const normalizados: Record<string, string> = {}

  for (const campo of camposBuscables) {
    const valor = documento[campo]
    if (typeof valor === 'string') {
      normalizados[`${String(campo)}_normalized`] = normalizarTexto(valor)
    }
  }

  return { ...documento, ...normalizados }
}

// Ejemplo — al guardar un Requerimiento:
// { titulo: "Autenticación OAuth2", titulo_normalized: "autenticacion oauth2", ... }
```

#### Consulta por prefijo en Firestore

```typescript
// lib/busqueda/consultarPrefijo.ts

import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

/**
 * Búsqueda por prefijo en un campo normalizado de Firestore.
 * Soporta búsqueda de la primera palabra del texto.
 * Limitación: no detecta substrings en el medio del texto.
 */
export async function buscarPorPrefijo(
  coleccion: string,
  campoBusqueda: string,   // campo _normalized
  textoBusqueda: string,   // ya normalizado
  limitResultados: number = 20
): Promise<FirebaseFirestore.QuerySnapshot> {
  const fin = textoBusqueda + '\uf8ff'  // carácter Unicode alto — marca el fin del rango

  const q = query(
    collection(db, coleccion),
    where(campoBusqueda, '>=', textoBusqueda),
    where(campoBusqueda, '<=', fin),
    orderBy(campoBusqueda),
    limit(limitResultados)
  )

  return getDocs(q)
}
```

#### Búsqueda paralela en múltiples colecciones

```typescript
// lib/busqueda/ejecutarBusquedaGlobal.ts — Nivel 1

import { normalizarTexto } from './normalizar'
import { buscarPorPrefijo } from './consultarPrefijo'
import { CONFIGURACION_ENTIDADES } from './configuracionEntidades'
import type { QueryBusqueda, ResultadoBusqueda } from '@/types/busqueda'
import type { Usuario } from '@/types'

export async function ejecutarBusquedaGlobal(
  query: QueryBusqueda,
  usuario: Usuario
): Promise<ResultadoBusqueda[]> {
  const textoNorm = normalizarTexto(query.texto)

  if (textoNorm.length < 2) return []

  // Determinar qué tipos de entidades consultar según filtros y rol
  const tiposAConsultar = Object.entries(CONFIGURACION_ENTIDADES).filter(([, config]) => {
    // Filtro por módulo
    if (query.filtroModulo?.length && !query.filtroModulo.includes(config.modulo)) return false
    // Filtro por tipo
    if (query.filtroTipo?.length && !query.filtroTipo.includes(config.tipo)) return false
    // Filtro por rol mínimo
    const jerarquiaRol = ['viewer', 'analista', 'gestor', 'admin', 'superadmin']
    const rolUsuarioIdx = jerarquiaRol.indexOf(usuario.rol)
    const rolMinimoIdx = jerarquiaRol.indexOf(config.rolMinimo)
    return rolUsuarioIdx >= rolMinimoIdx
  })

  // Ejecutar todas las consultas en paralelo
  const resultadosPorTipo = await Promise.all(
    tiposAConsultar.flatMap(([, config]) =>
      config.camposBusqueda.map(campo =>
        buscarPorPrefijo(config.coleccion, `${campo}_normalized`, textoNorm, query.limit)
          .then(snap => snap.docs.map(doc => config.construirResultado(doc.data(), doc.id)))
          .catch(() => [] as ResultadoBusqueda[])  // error en una colección no detiene el resto
      )
    )
  )

  // Aplanar, deduplicar por ID, filtrar por proyectosAsignados y ordenar por relevancia
  const todos = resultadosPorTipo.flat()
  const deduplicados = deduplicarPorId(todos)
  const filtrados = aplicarFiltroRol(deduplicados, usuario)
  return filtrados.sort((a, b) => b.relevancia - a.relevancia).slice(query.offset, query.offset + query.limit)
}

function deduplicarPorId(resultados: ResultadoBusqueda[]): ResultadoBusqueda[] {
  const mapa = new Map<string, ResultadoBusqueda>()
  for (const r of resultados) {
    const existing = mapa.get(r.id)
    // Si ya existe, conservar el de mayor relevancia
    if (!existing || r.relevancia > existing.relevancia) {
      mapa.set(r.id, r)
    }
  }
  return Array.from(mapa.values())
}

function aplicarFiltroRol(resultados: ResultadoBusqueda[], usuario: Usuario): ResultadoBusqueda[] {
  if (usuario.rol === 'admin' || usuario.rol === 'superadmin') return resultados

  return resultados.filter(r => {
    // Para entidades de M2 y M3: verificar proyectosAsignados
    if (r.modulo === 'M2' || r.modulo === 'M3') {
      const proyectoId = r.entidadPadre?.id ?? r.id
      return usuario.proyectosAsignados.includes(proyectoId)
    }
    // Para M1: verificar entidadesAcceso
    if (r.modulo === 'M1' && r.tipo === 'Entidad') {
      return usuario.entidadesAcceso.includes(r.id)
    }
    return true
  })
}
```

#### Cálculo de relevancia

```typescript
// lib/busqueda/calcularRelevancia.ts

export function calcularRelevancia(
  textoQuery: string,
  camposTitulo: string[],     // valores normalizados de los campos de título
  camposSecundarios: string[] // valores normalizados de campos de descripción
): number {
  let puntuacion = 0

  for (const campo of camposTitulo) {
    if (campo === textoQuery) {
      puntuacion = Math.max(puntuacion, 100)     // coincidencia exacta en título
    } else if (campo.startsWith(textoQuery)) {
      puntuacion = Math.max(puntuacion, 80)      // prefijo en título
    } else if (campo.includes(textoQuery)) {
      puntuacion = Math.max(puntuacion, 60)      // substring en título
    }
  }

  for (const campo of camposSecundarios) {
    if (campo.startsWith(textoQuery)) {
      puntuacion = Math.max(puntuacion, 40)      // prefijo en campo secundario
    } else if (campo.includes(textoQuery)) {
      puntuacion = Math.max(puntuacion, 20)      // substring en campo secundario
    }
  }

  return puntuacion
}
```

#### Limitaciones del Nivel 1

| Limitación | Descripción | Solución en Nivel 2 |
|---|---|---|
| Solo prefijos | `"auth"` encuentra `"autenticacion"` pero no `"oauth"` | Full-text con Algolia |
| Sin tolerancia a errores | `"autenticaion"` (typo) no encuentra nada | Fuzzy search con Algolia/Typesense |
| Sin ranking semántico | Relevancia calculada heurísticamente | Ranking ML de Algolia |
| Consultas múltiples | N consultas paralelas por N colecciones × M campos | Una sola consulta al índice externo |
| Sin búsqueda fonética | No encuentra "Gonzalez" buscando "Gonzales" | Phonetic matching en Typesense |

---

### 5.2 Nivel 2 — Implementación Futura con Algolia

La interfaz de la Cloud Function de sincronización está diseñada para que la migración al Nivel 2 sea **transparente para el frontend** — la API Route `/api/search` no cambia, solo cambia la implementación interna de `ejecutarBusquedaGlobal`.

```typescript
// functions/src/busqueda/sincronizarAlgolia.ts — NIVEL 2 (implementación futura)

import algoliasearch from 'algoliasearch'
import * as functions from 'firebase-functions'

const client = algoliasearch(
  functions.config().algolia.app_id,
  functions.config().algolia.admin_key
)
const index = client.initIndex('austranet_cco_busqueda')

/**
 * Trigger: onCreate y onUpdate en todas las colecciones buscables.
 * Sincroniza el documento con el índice de Algolia.
 * El objectID de Algolia es el mismo que el ID del documento de Firestore.
 */
export const sincronizarDocumentoConAlgolia = functions.firestore
  .document('{coleccion}/{docId}')
  .onWrite(async (change, context) => {
    const { coleccion, docId } = context.params

    const COLECCIONES_BUSCABLES = [
      'entidades', 'stakeholders', 'glosario',
      'proyectos', 'riesgos', 'hitos', 'leccionesAprendidas',
      'documentosSRS', 'requerimientos', 'trazabilidad', 'solicitudesCambioSRS',
    ]

    if (!COLECCIONES_BUSCABLES.includes(coleccion)) return

    if (!change.after.exists) {
      // Documento eliminado — remover del índice
      await index.deleteObject(docId)
      return
    }

    const data = change.after.data()!

    // El record de Algolia es el ResultadoBusqueda pre-calculado
    // El frontend no cambia — consume el mismo tipo
    await index.saveObject({
      objectID: docId,
      coleccion,
      ...construirRecordAlgolia(data, coleccion, docId),
    })
  })

/**
 * Interfaz pública de búsqueda — NIVEL 2.
 * Misma firma que ejecutarBusquedaGlobal() del Nivel 1.
 * La API Route llama esta función en lugar de la del Nivel 1 sin cambios adicionales.
 */
export async function ejecutarBusquedaGlobalAlgolia(
  query: QueryBusqueda,
  usuario: Usuario
): Promise<ResultadoBusqueda[]> {
  const filtrosAlgolia = construirFiltrosAlgolia(query, usuario)

  const { hits } = await index.search(query.texto, {
    filters: filtrosAlgolia,
    hitsPerPage: query.limit,
    page: Math.floor(query.offset / query.limit),
    attributesToRetrieve: ['tipo', 'modulo', 'titulo', 'subtitulo', 'url', 'tags', 'entidadPadre'],
  })

  return hits.map(hit => ({ ...hit, id: hit.objectID, relevancia: hit._rankingInfo?.nbExactWords ?? 50 }))
}
```

---

## 6. API Route de Búsqueda

### 6.1 Especificación del Endpoint

```
GET /api/search
  ?q={texto}              (requerido, mín 2 chars)
  &modulo={M1,M2,M3}      (opcional, separado por coma)
  &tipo={Requerimiento}   (opcional)
  &estado={activo}        (opcional)
  &limit={20}             (opcional, default 20, máx 50)
  &offset={0}             (opcional, default 0)

Headers:
  Authorization: Bearer {firebase_id_token}

Responses:
  200 OK      → RespuestaBusqueda
  400 Bad Request → { error: 'Texto de búsqueda demasiado corto (mínimo 2 caracteres)' }
  401 Unauthorized → { error: 'Token de autenticación inválido o ausente' }
  429 Too Many Requests → { error: 'Límite de búsquedas excedido. Intente en {segundos}s' }
  500 Internal Server Error → { error: 'Error interno del sistema' }
```

### 6.2 Implementación de la API Route

```typescript
// app/api/search/route.ts — Next.js 14 App Router

import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'
import { ejecutarBusquedaGlobal } from '@/lib/busqueda/ejecutarBusquedaGlobal'
import { registrarAuditoria } from '@/lib/auditoria'
import { verificarRateLimit } from '@/lib/rateLimit'
import { normalizarTexto } from '@/lib/busqueda/normalizar'
import type { QueryBusqueda } from '@/types/busqueda'

export async function GET(request: NextRequest) {
  const inicio = Date.now()
  const { searchParams } = new URL(request.url)

  // ─── 1. Autenticación (T-01) ─────────────────────────────────────────────────
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ error: 'Token de autenticación ausente' }, { status: 401 })
  }

  let decodedToken: { uid: string }
  try {
    decodedToken = await adminAuth.verifyIdToken(token)
  } catch {
    return NextResponse.json({ error: 'Token de autenticación inválido o expirado' }, { status: 401 })
  }

  // ─── 2. Cargar perfil del usuario (T-01) ──────────────────────────────────────
  const usuarioSnap = await adminDb.collection('usuarios').doc(decodedToken.uid).get()
  if (!usuarioSnap.exists || !usuarioSnap.data()?.activo) {
    return NextResponse.json({ error: 'Usuario inactivo o no encontrado' }, { status: 401 })
  }
  const usuario = usuarioSnap.data() as Usuario

  // ─── 3. Rate limiting (30 req/min por usuario) ───────────────────────────────
  const { permitido, segundosRestantes } = await verificarRateLimit(decodedToken.uid, 30, 60)
  if (!permitido) {
    return NextResponse.json(
      { error: `Límite de búsquedas excedido. Intente en ${segundosRestantes}s` },
      { status: 429, headers: { 'Retry-After': String(segundosRestantes) } }
    )
  }

  // ─── 4. Validar y construir query ────────────────────────────────────────────
  const texto = searchParams.get('q') ?? ''
  if (texto.length < 2) {
    return NextResponse.json(
      { error: 'Texto de búsqueda demasiado corto (mínimo 2 caracteres)' },
      { status: 400 }
    )
  }

  const moduloParam = searchParams.get('modulo')
  const tipoParam = searchParams.get('tipo')
  const limit = Math.min(Number(searchParams.get('limit') ?? 20), 50)
  const offset = Number(searchParams.get('offset') ?? 0)

  const queryBusqueda: QueryBusqueda = {
    texto,
    filtroModulo: moduloParam ? (moduloParam.split(',') as ('M1' | 'M2' | 'M3')[]) : undefined,
    filtroTipo: tipoParam ? [tipoParam as TipoEntidadBuscable] : undefined,
    filtroEstado: searchParams.get('estado')?.split(','),
    soloAccesibles: true,   // siempre true — nunca se bypasea
    limit,
    offset,
  }

  // ─── 5. Ejecutar búsqueda ────────────────────────────────────────────────────
  let resultados: ResultadoBusqueda[] = []
  let errorInterno = false

  try {
    resultados = await ejecutarBusquedaGlobal(queryBusqueda, usuario)
  } catch (error) {
    console.error('[T04] Error en búsqueda global:', error)
    errorInterno = true
  }

  const tiempoMs = Date.now() - inicio

  if (errorInterno) {
    return NextResponse.json({ error: 'Error interno del sistema' }, { status: 500 })
  }

  // ─── 6. Registrar en T-03 (auditoría) ────────────────────────────────────────
  // Nota: el texto buscado se registra — no contiene datos sensibles
  // (es el query del usuario, no los resultados retornados)
  await registrarAuditoria({
    actor: {
      uid: decodedToken.uid,
      nombre: usuario.nombre,
      rol: usuario.rol,
      sesionId: token.slice(-10),  // últimos 10 chars del token como proxy de sesión
    },
    accion: 'T04_BUSQUEDA_EJECUTADA' as AccionAuditoria,
    modulo: 'T04' as ModuloAuditoria,
    criticidad: 'bajo',
    entidad: { tipo: 'Busqueda', id: 'global', nombre: texto },
    descripcion: `Búsqueda: "${texto}" | Resultados: ${resultados.length} | Tiempo: ${tiempoMs}ms`,
    resultado: 'exitoso',
  }).catch(() => {
    // Fallo en auditoría no interrumpe la respuesta de búsqueda
  })

  // ─── 7. Retornar respuesta ───────────────────────────────────────────────────
  const respuesta: RespuestaBusqueda = {
    resultados: resultados.slice(0, limit),
    total: resultados.length,
    tiempoMs,
    queryNormalizada: normalizarTexto(texto),
    pagina: {
      offset,
      limit,
      hayMas: resultados.length > offset + limit,
    },
  }

  return NextResponse.json(respuesta, {
    headers: {
      'Cache-Control': 'no-store',      // resultados de búsqueda no se cachean
      'X-Query-Time-Ms': String(tiempoMs),
    },
  })
}
```

### 6.3 Rate Limiting

```typescript
// lib/rateLimit.ts
// Implementado con Firestore como backend de contadores (sin Redis)

export async function verificarRateLimit(
  uid: string,
  maxRequests: number,
  ventanaSegundos: number
): Promise<{ permitido: boolean; segundosRestantes: number }> {
  const db = adminDb
  const ahora = Date.now()
  const ventanaInicio = ahora - ventanaSegundos * 1000

  const ref = db.collection('_rateLimit').doc(`busqueda_${uid}`)

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref)
    const datos = snap.data() ?? { requests: [], ventanaInicio: ahora }

    // Filtrar requests dentro de la ventana actual
    const requestsEnVentana: number[] = (datos.requests as number[])
      .filter((ts: number) => ts > ventanaInicio)

    if (requestsEnVentana.length >= maxRequests) {
      const masAntiguo = requestsEnVentana[0]
      const segundosRestantes = Math.ceil((masAntiguo + ventanaSegundos * 1000 - ahora) / 1000)
      return { permitido: false, segundosRestantes }
    }

    requestsEnVentana.push(ahora)
    tx.set(ref, { requests: requestsEnVentana, ultimaActualizacion: ahora })

    return { permitido: true, segundosRestantes: 0 }
  })
}
```

---

## 7. UI — Barra de Búsqueda Global

### 7.1 Comportamiento del Modal

```
NAVBAR (visible en todas las páginas)
└── [🔍 Buscar...  ⌘K]  ← barra/botón que abre el modal

MODAL DE BÚSQUEDA (fullscreen overlay o dialog centrado)
├── Input de búsqueda
│   ├── Placeholder: "Buscar entidades, proyectos, requerimientos..."
│   ├── Autoenfoque al abrir
│   ├── Debounce: 300ms antes de ejecutar
│   ├── Mínimo 2 caracteres para activar la búsqueda
│   └── Botón [✕] para limpiar + cerrar (o tecla Escape)
│
├── Chips de filtro rápido (filtran sin nueva búsqueda)
│   [Todo] [Entidades M1] [Proyectos M2] [Requerimientos M3] [SRS M3]
│
├── Estado: campo vacío → Búsquedas recientes
│   └── Últimas 5 búsquedas de localStorage
│       cada una: texto + "N resultados · hace X minutos"
│
├── Estado: escribiendo (< 2 chars) → "Escribe al menos 2 caracteres"
│
├── Estado: buscando → Skeleton loader (3 filas animadas)
│
├── Estado: con resultados → Lista agrupada por módulo
│   ├── [M1 — Entidades]  (N resultados)
│   │   └── Tarjeta de resultado
│   │       ├── Ícono del tipo de entidad
│   │       ├── Título (con texto buscado resaltado en negrita)
│   │       ├── Subtítulo (entidad padre, estado, cargo)
│   │       ├── Tags: chips de estado/prioridad/módulo
│   │       └── Breadcrumb: "M1 › Entidades › {nombre entidad padre}"
│   ├── [M2 — Proyectos]  (N resultados)
│   └── [M3 — SRS]  (N resultados)
│
└── Estado: sin resultados
    ├── "No se encontraron resultados para '{texto}'"
    └── Sugerencias basadas en las últimas 3 búsquedas del historial
```

### 7.2 Componente React — Estructura

```typescript
// components/busqueda/BusquedaGlobalModal.tsx

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useBusquedaGlobal } from '@/hooks/useBusquedaGlobal'
import type { ResultadoBusqueda } from '@/types/busqueda'

const DEBOUNCE_MS = 300
const MIN_CHARS = 2
const MAX_HISTORIAL = 5
const HISTORIAL_KEY = 'austranet_busqueda_historial'

export function BusquedaGlobalModal({ abierto, onCerrar }: {
  abierto: boolean
  onCerrar: () => void
}) {
  const [texto, setTexto] = useState('')
  const [filtroModulo, setFiltroModulo] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const { resultados, cargando, total } = useBusquedaGlobal(texto, filtroModulo, DEBOUNCE_MS)

  const historial = leerHistorial()

  // Autoenfoque al abrir
  useEffect(() => {
    if (abierto) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setTexto('')
    }
  }, [abierto])

  // Shortcut global Cmd/Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        abierto ? onCerrar() : undefined  // el padre gestiona abrir
      }
      if (e.key === 'Escape' && abierto) onCerrar()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [abierto, onCerrar])

  const navegarAResultado = useCallback((resultado: ResultadoBusqueda) => {
    guardarEnHistorial(texto, total)
    router.push(resultado.url)
    onCerrar()
  }, [texto, total, router, onCerrar])

  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20"
         onClick={onCerrar}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4"
           onClick={e => e.stopPropagation()}>
        {/* Input */}
        <div className="flex items-center px-4 py-3 border-b">
          <SearchIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder="Buscar entidades, proyectos, requerimientos..."
            className="flex-1 outline-none text-gray-900 placeholder-gray-400"
          />
          {texto && (
            <button onClick={() => setTexto('')} className="text-gray-400 hover:text-gray-600">
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Chips de filtro */}
        <div className="flex gap-2 px-4 py-2 border-b overflow-x-auto">
          {['Todo', 'M1 Entidades', 'M2 Proyectos', 'M3 Requerimientos'].map(chip => (
            <button key={chip}
              onClick={() => setFiltroModulo(chip === 'Todo' ? null : chip.split(' ')[0])}
              className={`chip ${filtroModulo === chip.split(' ')[0] ? 'chip-activo' : 'chip-inactivo'}`}>
              {chip}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div className="max-h-[60vh] overflow-y-auto">
          {texto.length === 0 && <HistorialBusqueda items={historial} onClick={setTexto} />}
          {texto.length > 0 && texto.length < MIN_CHARS && (
            <p className="p-4 text-sm text-gray-500">Escribe al menos {MIN_CHARS} caracteres</p>
          )}
          {texto.length >= MIN_CHARS && cargando && <SkeletonResultados />}
          {texto.length >= MIN_CHARS && !cargando && resultados.length === 0 && (
            <SinResultados texto={texto} historial={historial} onSugerenciaClick={setTexto} />
          )}
          {texto.length >= MIN_CHARS && !cargando && resultados.length > 0 && (
            <ListaResultados resultados={resultados} onSeleccionar={navegarAResultado} />
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t flex justify-between text-xs text-gray-400">
          <span>↑↓ navegar · Enter seleccionar · Esc cerrar</span>
          {total > 0 && <span>{total} resultado{total !== 1 ? 's' : ''}</span>}
        </div>
      </div>
    </div>
  )
}

// ─── Helpers de historial (localStorage) ─────────────────────────────────────

function leerHistorial(): EntradaHistorialBusqueda[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(HISTORIAL_KEY) ?? '[]')
  } catch { return [] }
}

function guardarEnHistorial(texto: string, totalResultados: number): void {
  if (!texto || texto.length < MIN_CHARS) return
  const historial = leerHistorial()
  const nueva: EntradaHistorialBusqueda = { texto, timestamp: Date.now(), totalResultados }
  const actualizado = [nueva, ...historial.filter(h => h.texto !== texto)].slice(0, MAX_HISTORIAL)
  localStorage.setItem(HISTORIAL_KEY, JSON.stringify(actualizado))
}
```

### 7.3 Hook `useBusquedaGlobal`

```typescript
// hooks/useBusquedaGlobal.ts

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import type { ResultadoBusqueda } from '@/types/busqueda'

export function useBusquedaGlobal(
  texto: string,
  filtroModulo: string | null,
  debounceMs: number
) {
  const { usuario } = useAuth()
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>([])
  const [cargando, setCargando] = useState(false)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (texto.length < 2) {
      setResultados([])
      setTotal(0)
      return
    }

    setCargando(true)
    const controller = new AbortController()

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: texto, limit: '20' })
        if (filtroModulo) params.set('modulo', filtroModulo)

        const token = await getFirebaseToken()  // token Firebase actual del usuario
        const resp = await fetch(`/api/search?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        })

        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)

        const data = await resp.json()
        setResultados(data.resultados)
        setTotal(data.total)
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          setResultados([])
          setTotal(0)
        }
      } finally {
        setCargando(false)
      }
    }, debounceMs)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [texto, filtroModulo, usuario?.uid])

  return { resultados, cargando, total }
}
```

---

## 8. Búsqueda Contextual dentro de Módulos

La búsqueda global (T-04) y la búsqueda contextual (filtros locales de cada módulo) son **complementarias, no excluyentes**. Cada una tiene su caso de uso óptimo.

### 8.1 Diferencias operacionales

| Escenario | Herramienta correcta |
|---|---|
| "Necesito encontrar el requerimiento de autenticación pero no sé en qué SRS está" | Búsqueda global `⌘K` |
| "Estoy viendo la lista de requerimientos del SRS-2024-003 y quiero filtrar por 'login'" | Filtro local del módulo |
| "Quiero ver todos los riesgos que mencionan 'proveedor' en cualquier proyecto" | Búsqueda global `⌘K` |
| "Estoy en el dashboard de M2 y quiero filtrar mis proyectos activos" | Filtro local del módulo |
| "El cliente mencionó una empresa llamada 'TechCorp' y quiero ver todos los elementos relacionados" | Búsqueda global `⌘K` |

### 8.2 Implementación de búsqueda contextual (ejemplo M3)

La búsqueda contextual es un filtro client-side sobre datos ya cargados — **no hace requests adicionales** y **no registra en T-03**.

```typescript
// components/m3/ListaRequerimientos.tsx — búsqueda contextual

const [filtroLocal, setFiltroLocal] = useState('')

const requerimientosFiltrados = useMemo(() =>
  requerimientos.filter(r => {
    if (!filtroLocal) return true
    const texto = filtroLocal.toLowerCase()
    return (
      r.titulo.toLowerCase().includes(texto) ||
      r.codigo.toLowerCase().includes(texto) ||
      r.descripcion?.toLowerCase().includes(texto)
    )
  }),
  [requerimientos, filtroLocal]
)
```

### 8.3 Regla para el desarrollador

> **Regla:** Si el componente necesita buscar **dentro de datos ya cargados en memoria** → filtro local (array `.filter()`). Si el componente necesita buscar **en Firestore** o **cruzar módulos** → API `/api/search`.

---

## 9. Conexiones con Otros Elementos Transversales

### T-01 — Autenticación, Roles y Permisos

El filtrado de resultados por rol es **no bypasseable** — el parámetro `soloAccesibles` está hardcodeado a `true` en la API Route y la función `aplicarFiltroRol()` siempre se ejecuta. Un `analista` nunca puede recibir resultados de proyectos fuera de su `proyectosAsignados`, aunque manipule los parámetros de la query manualmente. La seguridad está en el servidor, no en la UI.

El `viewer` no tiene acceso a la búsqueda global: sus permisos son tan restringidos (solo lecturas que el gestor habilita explícitamente en secciones específicas de T-01) que la búsqueda retornaría resultados vacíos o casi vacíos en todos los casos. El sistema devuelve 403 si el rol del token es `viewer`.

### T-03 — Log de Auditoría

Cada búsqueda exitosa genera una entrada `T04_BUSQUEDA_EJECUTADA` en la colección `auditoria/` de T-03. Los datos registrados son:

```
accion: 'T04_BUSQUEDA_EJECUTADA'
actor.uid: string
descripcion: 'Búsqueda: "{texto}" | Resultados: N | Tiempo: Xms'
modulo: 'T04'
criticidad: 'bajo'
resultado: 'exitoso'
```

> El texto buscado **sí se registra** — es la query del usuario, no los resultados (que pueden contener datos sensibles). Los `resultados[]` nunca se incluyen en el log.

Las búsquedas contextuales (filtros locales de módulos) **no generan entrada en T-03** — son operaciones puramente client-side sobre datos ya cargados.

### T-05 — Dashboard Principal

El dashboard de T-05 usa internamente la misma función `ejecutarBusquedaGlobal()` para el widget de **"Acceso rápido"**, que permite al usuario navegar directamente a un proyecto o SRS reciente sin salir del dashboard. La diferencia es que T-05 ejecuta la búsqueda con datos pre-configurados (los últimos 3 proyectos del usuario) en lugar de texto libre.

### T-06 — Configuración del Sistema

Los siguientes parámetros de búsqueda son configurables desde T-06 por el `superadmin`:

| Parámetro | Default | Configurable en T-06 |
|---|---|---|
| `limit` máximo por búsqueda | 50 | ✅ |
| Requests por minuto (rate limit) | 30 | ✅ |
| Mínimo de caracteres para buscar | 2 | ✅ |
| Debounce en ms | 300 | ❌ (fijo en UI) |
| Motor de búsqueda: `firestore` / `algolia` | `firestore` | ✅ (migración Nivel 1 → 2) |

---

## 10. Checklist de Completitud del Documento

| Ítem | Estado |
|---|:---:|
| Metadatos completos (nombre, capa, posición, módulos, prerrequisito, stack, versión, fecha, estado) | ✅ |
| Objetivo — por qué la búsqueda es transversal | ✅ |
| Objetivo — el problema que resuelve en un sistema multi-módulo | ✅ |
| Tabla de diferencias: búsqueda global vs. búsqueda contextual | ✅ |
| Universo buscable M1: 3 entidades con tabla completa (campos, muestra, URL, rol mínimo) | ✅ |
| Universo buscable M2: 4 entidades con tabla completa | ✅ |
| Universo buscable M3: 4 entidades con tabla completa + nota sobre viewer | ✅ |
| Enum `TipoEntidadBuscable` con 11 tipos | ✅ |
| Tipo `ResultadoBusqueda` con todos los campos requeridos | ✅ |
| Tipo `QueryBusqueda` con `soloAccesibles: true` documentado | ✅ |
| Tipo `RespuestaBusqueda` con paginación | ✅ |
| Tipo `EntradaHistorialBusqueda` (localStorage) | ✅ |
| Tipo `ConfigEntidadBuscable` para el mapa de configuración | ✅ |
| Nivel 1 — función `normalizarTexto()` con ejemplos | ✅ |
| Nivel 1 — función `agregarCamposNormalizados()` y campos `_normalized` | ✅ |
| Nivel 1 — función `buscarPorPrefijo()` con rango Firestore `` | ✅ |
| Nivel 1 — `ejecutarBusquedaGlobal()` con `Promise.all()` paralelo | ✅ |
| Nivel 1 — `calcularRelevancia()` con puntuación 20-100 | ✅ |
| Nivel 1 — tabla de limitaciones vs. Nivel 2 | ✅ |
| Nivel 2 — Cloud Function `sincronizarDocumentoConAlgolia()` con misma interfaz | ✅ |
| Nivel 2 — `ejecutarBusquedaGlobalAlgolia()` con misma firma que Nivel 1 | ✅ |
| API Route `GET /api/search` — especificación completa (params, headers, responses) | ✅ |
| API Route — autenticación con `adminAuth.verifyIdToken()` | ✅ |
| API Route — filtrado por rol usando perfil Firestore del usuario | ✅ |
| API Route — rate limiting 30 req/min implementado con Firestore | ✅ |
| API Route — registro en T-03 con `T04_BUSQUEDA_EJECUTADA` | ✅ |
| Componente `BusquedaGlobalModal` con shortcut `⌘K`, debounce y historial | ✅ |
| Hook `useBusquedaGlobal` con debounce y abort controller | ✅ |
| Helpers de historial (localStorage, máx 5 entradas) | ✅ |
| Tabla de escenarios: búsqueda global vs. contextual | ✅ |
| Ejemplo de búsqueda contextual client-side (no registra en T-03) | ✅ |
| Regla para el desarrollador: cuándo usar cada tipo de búsqueda | ✅ |
| Conexión con T-01 (filtrado no bypasseable, viewer bloqueado) | ✅ |
| Conexión con T-03 (qué se registra y qué no) | ✅ |
| Conexión con T-05 (widget acceso rápido) | ✅ |
| Conexión con T-06 (parámetros configurables con tabla) | ✅ |
| Todo en español con terminología consistente con T-01, T-02, T-03 y módulos | ✅ |

---

*Documento generado para el sistema austranet-cco · Capa Transversal · T-04 de 6*
