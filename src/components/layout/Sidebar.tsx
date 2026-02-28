'use client';

// ============================================================
// Austranet CCO - Sidebar Navigation Component
// ============================================================

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store';
import { useAuth } from '@/contexts/AuthContext';
import { NAV_ITEMS } from '@/constants';
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Network,
  LogOut,
  Users,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

// Mapa de nombres de ícono a componentes Lucide
const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Building2,
  FolderKanban,
  FileText,
  Settings,
  Users,
  ClipboardList,
};

// Ítems de navegación admin (solo admin/superadmin)
const ADMIN_NAV_ITEMS = [
  {
    label: 'Usuarios',
    href: '/admin/usuarios',
    icon: 'Users',
    description: 'Gestión de accesos',
  },
  {
    label: 'Auditoría',
    href: '/admin/auditoria',
    icon: 'ClipboardList',
    description: 'Registro de actividad',
  },
] as const;

// Grupos de navegación
interface NavItem {
  label: string;
  href: string;
  icon: string;
  description?: string;
}

interface NavGroup {
  label?: string;
  items: readonly NavItem[];
}

function buildNavGroups(isAdmin: boolean): NavGroup[] {
  const groups: NavGroup[] = [
    {
      items: [NAV_ITEMS[0]],
    },
    {
      label: 'Módulos',
      items: [NAV_ITEMS[1], NAV_ITEMS[2], NAV_ITEMS[3]],
    },
    {
      label: 'Sistema',
      items: [NAV_ITEMS[4]],
    },
  ];

  if (isAdmin) {
    groups.push({
      label: 'Administración',
      items: ADMIN_NAV_ITEMS,
    });
  }

  return groups;
}

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { sidebarCollapsed, toggleSidebar, setMobileSidebarOpen } = useUIStore();

  const isAdmin = user?.rol === 'admin' || user?.rol === 'superadmin';
  const navGroups = buildNavGroups(isAdmin);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleLinkClick = () => {
    setMobileSidebarOpen(false);
  };

  const userInitials = user?.nombre
    ? user.nombre
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  const userRolLabel = user?.rol
    ? user.rol.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    : 'Sin rol';

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 256 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className={cn(
        'flex h-full flex-col border-r bg-card overflow-hidden flex-shrink-0',
        className
      )}
    >
      {/* ── Logo ─────────────────────────────────────── */}
      <div className="flex h-14 items-center justify-between border-b px-3 flex-shrink-0">
        <Link
          href="/dashboard"
          onClick={handleLinkClick}
          className={cn(
            'flex items-center gap-2 min-w-0 flex-1',
            sidebarCollapsed && 'justify-center'
          )}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary flex-shrink-0">
            <Network className="h-4 w-4 text-primary-foreground" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.18 }}
                className="whitespace-nowrap text-base font-bold"
              >
                Austranet
                <span className="text-primary ml-0.5">CCO</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden h-7 w-7 lg:flex flex-shrink-0 text-muted-foreground"
          title={sidebarCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* ── Navegación ───────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className={cn(groupIdx > 0 && 'mt-1')}>
            {/* Separador + label de grupo */}
            {groupIdx > 0 && (
              <div className="mx-3 mb-1 mt-3 border-t border-border" />
            )}
            {group.label && !sidebarCollapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-1 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
              >
                {group.label}
              </motion.p>
            )}

            <ul className="space-y-0.5 px-2">
              {group.items.map((item) => {
                const Icon = iconMap[item.icon] ?? LayoutDashboard;
                const active = isActive(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={cn(
                        'flex items-center rounded-md py-2 text-sm transition-all duration-150',
                        'border-l-2',
                        sidebarCollapsed
                          ? 'justify-center px-2'
                          : 'gap-2.5 px-2.5',
                        active
                          ? 'border-primary bg-primary/10 text-primary font-medium'
                          : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />

                      <AnimatePresence>
                        {!sidebarCollapsed && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="min-w-0"
                          >
                            <span className="block leading-snug">
                              {item.label}
                            </span>
                            {'description' in item && item.description && (
                              <span className="block truncate text-[11px] leading-tight text-muted-foreground">
                                {item.description}
                              </span>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Footer (usuario) ─────────────────────────── */}
      <div className="border-t flex-shrink-0">
        {sidebarCollapsed ? (
          <div className="flex flex-col items-center gap-2 py-3">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-semibold"
              title={user?.nombre ?? 'Usuario'}
            >
              {userInitials}
            </div>
            <button
              onClick={() => signOut()}
              title="Cerrar sesión"
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 p-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium leading-snug">
                {user?.nombre ?? 'Usuario'}
              </p>
              <p className="truncate text-xs capitalize leading-tight text-muted-foreground">
                {userRolLabel}
              </p>
            </div>
            <button
              onClick={() => signOut()}
              title="Cerrar sesión"
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </motion.aside>
  );
}

export default Sidebar;
