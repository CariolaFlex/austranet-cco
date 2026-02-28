'use client';

// ============================================================
// Austranet CCO - Header Component — Sprint 5
// Agrega: BusquedaGlobal + NotificacionesBadge
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useUIStore } from '@/store';
import { Button } from '@/components/ui/button';
import {
  Moon,
  Sun,
  LogOut,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  User,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { BusquedaGlobal } from '@/components/busqueda/BusquedaGlobal';
import { NotificacionesBadge } from '@/components/layout/NotificacionesBadge';

// ── Breadcrumb helpers ─────────────────────────────────────
type Crumb = { label: string; href?: string };

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  entidades: 'Entidades',
  proyectos: 'Proyectos',
  alcance: 'Alcance / SRS',
  configuracion: 'Configuración',
  admin: 'Administración',
  usuarios: 'Usuarios',
  auditoria: 'Auditoría',
  notificaciones: 'Notificaciones',
  nueva: 'Nueva entidad',
  nuevo: 'Nuevo proyecto',
  editar: 'Editar',
};

function buildBreadcrumbs(pathname: string): Crumb[] {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return [{ label: 'Dashboard' }];

  const crumbs: Crumb[] = [];
  let path = '';

  segments.forEach((seg, idx) => {
    path += `/${seg}`;
    const label = SEGMENT_LABELS[seg] ?? capitalize(seg);
    const isLast = idx === segments.length - 1;
    crumbs.push({ label, href: isLast ? undefined : path });
  });

  return crumbs;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Component ──────────────────────────────────────────────
export function Header() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toggleMobileSidebar, sidebarMobileOpen } = useUIStore();
  const pathname = usePathname();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const crumbs = buildBreadcrumbs(pathname ?? '');

  const userInitials = user?.nombre
    ? user.nombre
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* ── Left: mobile toggle + breadcrumb ──────── */}
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileSidebar}
          className="h-8 w-8 lg:hidden"
        >
          {sidebarMobileOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm">
          {crumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
              )}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-foreground">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* ── Right: search + notifications + theme + user ── */}
      <div className="flex items-center gap-1">
        {/* Búsqueda global */}
        <BusquedaGlobal />

        {/* Notificaciones */}
        <NotificacionesBadge />

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8 text-muted-foreground"
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* User menu */}
        <div className="relative ml-1" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu((v) => !v)}
            className={cn(
              'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted',
              showUserMenu && 'bg-muted'
            )}
          >
            {/* Avatar */}
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              {userInitials}
            </div>
            {/* Name – desktop only */}
            <span className="hidden font-medium md:block">
              {user?.nombre ?? 'Usuario'}
            </span>
            <ChevronDown
              className={cn(
                'hidden h-3.5 w-3.5 text-muted-foreground transition-transform duration-150 md:block',
                showUserMenu && 'rotate-180'
              )}
            />
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-1.5 w-52 rounded-lg border bg-card shadow-lg ring-1 ring-black/5 dark:ring-white/5">
              {/* User info */}
              <div className="border-b px-3 py-2.5">
                <p className="text-sm font-medium">{user?.nombre ?? 'Usuario'}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email ?? ''}
                </p>
              </div>

              {/* Items */}
              <div className="p-1">
                <Link
                  href="/configuracion"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  Mi perfil
                </Link>
                <Link
                  href="/configuracion"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Configuración
                </Link>
              </div>

              {/* Sign out */}
              <div className="border-t p-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    signOut();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
