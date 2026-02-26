'use client'

// ============================================================
// COMPONENTE: BusquedaGlobal — Sprint 5
// Busca entidades y proyectos simultáneamente desde el Header.
// Opera sobre datos cacheados de TanStack Query — sin llamadas extra.
// ============================================================

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Building2, FolderKanban, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEntidades } from '@/hooks/useEntidades'
import { useProyectos } from '@/hooks/useProyectos'

// -------------------------------------------------------
// COMPONENTE
// -------------------------------------------------------

export function BusquedaGlobal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Datos desde caché (sin llamadas extra si ya están cargados)
  const { data: entidades = [] } = useEntidades()
  const { data: proyectos = [] } = useProyectos()

  // Resultados filtrados — mínimo 2 caracteres
  const q = query.toLowerCase().trim()
  const hasQuery = q.length >= 2

  const entidadesResult = hasQuery
    ? entidades
        .filter(
          (e) =>
            e.razonSocial.toLowerCase().includes(q) ||
            e.nombreComercial?.toLowerCase().includes(q) ||
            e.rut?.toLowerCase().includes(q)
        )
        .slice(0, 5)
    : []

  const proyectosResult = hasQuery
    ? proyectos
        .filter(
          (p) =>
            p.nombre.toLowerCase().includes(q) ||
            p.codigo?.toLowerCase().includes(q) ||
            p.descripcion?.toLowerCase().includes(q)
        )
        .slice(0, 5)
    : []

  const hasResults = entidadesResult.length > 0 || proyectosResult.length > 0
  const showEmpty = hasQuery && !hasResults

  // Abrir foco en el input al abrir
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    } else {
      setQuery('')
    }
  }, [open])

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Navegar al resultado
  const handleNavigate = useCallback(
    (href: string) => {
      setOpen(false)
      router.push(href)
    },
    [router]
  )

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        className="h-8 w-8 text-muted-foreground"
        title="Buscar"
      >
        <Search className="h-4 w-4" />
      </Button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-80 sm:w-96 rounded-lg border bg-card shadow-lg ring-1 ring-black/5 dark:ring-white/5 z-50">
          {/* Input de búsqueda */}
          <div className="p-2">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar entidades, proyectos..."
                className="w-full h-9 rounded-md bg-muted pl-8 pr-8 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Estado: sin query suficiente */}
          {!hasQuery && (
            <div className="px-3 pb-3 pt-0">
              <p className="text-xs text-muted-foreground">
                Escribe al menos 2 caracteres para buscar
              </p>
            </div>
          )}

          {/* Estado: sin resultados */}
          {showEmpty && (
            <div className="px-3 pb-5 pt-1 text-center">
              <p className="text-sm text-muted-foreground">
                Sin resultados para &ldquo;{query}&rdquo;
              </p>
            </div>
          )}

          {/* Resultados */}
          {hasResults && (
            <div className="max-h-72 overflow-y-auto pb-2">
              {entidadesResult.length > 0 && (
                <div>
                  <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Entidades ({entidadesResult.length})
                  </p>
                  {entidadesResult.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => handleNavigate(`/entidades/${e.id}`)}
                      className="flex items-center gap-3 w-full px-3 py-2 hover:bg-muted/60 transition-colors text-left"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10 shrink-0">
                        <Building2 className="h-3.5 w-3.5 text-blue-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{e.razonSocial}</p>
                        {e.nombreComercial && (
                          <p className="text-xs text-muted-foreground truncate">{e.nombreComercial}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {proyectosResult.length > 0 && (
                <div>
                  <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Proyectos ({proyectosResult.length})
                  </p>
                  {proyectosResult.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleNavigate(`/proyectos/${p.id}`)}
                      className="flex items-center gap-3 w-full px-3 py-2 hover:bg-muted/60 transition-colors text-left"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-500/10 shrink-0">
                        <FolderKanban className="h-3.5 w-3.5 text-violet-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{p.nombre}</p>
                        <p className="text-xs text-muted-foreground font-mono truncate">{p.codigo}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
