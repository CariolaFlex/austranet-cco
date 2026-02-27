// ============================================================
// CONSTANTES — austranet-cco
// ============================================================

export const APP_NAME = 'Austranet CCO'
export const APP_VERSION = '0.1.0'

// Rutas de navegación
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  // Módulo 1
  ENTIDADES: '/entidades',
  ENTIDAD_NUEVA: '/entidades/nueva',
  ENTIDAD_DETALLE: (id: string) => `/entidades/${id}`,
  ENTIDAD_EDITAR: (id: string) => `/entidades/${id}/editar`,
  // Módulo 2
  PROYECTOS: '/proyectos',
  PROYECTO_NUEVO: '/proyectos/nuevo',
  PROYECTO_DETALLE: (id: string) => `/proyectos/${id}`,
  PROYECTO_EDITAR: (id: string) => `/proyectos/${id}/editar`,
  PROYECTO_ALCANCE: (id: string) => `/proyectos/${id}/alcance`,
  // Módulo 3
  ALCANCE: '/alcance',
  // Sistema
  CONFIGURACION: '/configuracion',
  ADMIN: '/admin',
} as const

// Items de navegación del Sidebar
export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: 'LayoutDashboard',
  },
  {
    label: 'Entidades',
    href: ROUTES.ENTIDADES,
    icon: 'Building2',
    description: 'Clientes y Proveedores',
  },
  {
    label: 'Proyectos',
    href: ROUTES.PROYECTOS,
    icon: 'FolderKanban',
    description: 'Gestión de proyectos',
  },
  {
    label: 'Alcance / SRS',
    href: ROUTES.ALCANCE,
    icon: 'FileText',
    description: 'Objetivos y alcance',
  },
  {
    label: 'Configuración',
    href: ROUTES.CONFIGURACION,
    icon: 'Settings',
  },
] as const

// Estados con colores para badges
export const ESTADO_ENTIDAD_CONFIG = {
  activo:     { label: 'Activo',     color: 'green'  },
  inactivo:   { label: 'Inactivo',   color: 'gray'   },
  observado:  { label: 'Observado',  color: 'yellow' },
  suspendido: { label: 'Suspendido', color: 'red'    },
} as const

export const ESTADO_PROYECTO_CONFIG = {
  borrador:               { label: 'Borrador',              color: 'gray'   },
  pendiente_aprobacion:   { label: 'Pendiente aprobación',  color: 'yellow' },
  activo_en_definicion:   { label: 'En definición',         color: 'blue'   },
  activo_en_desarrollo:   { label: 'En desarrollo',         color: 'green'  },
  pausado:                { label: 'Pausado',               color: 'orange' },
  completado:             { label: 'Completado',            color: 'teal'   },
  cancelado:              { label: 'Cancelado',             color: 'red'    },
} as const

export const ESTADO_SRS_CONFIG = {
  no_iniciado:       { label: 'No iniciado',       color: 'gray'   },
  en_adquisicion:    { label: 'En adquisición',    color: 'blue'   },
  en_prototipado:    { label: 'En prototipado',    color: 'purple' },
  en_modelado:       { label: 'En modelado',       color: 'indigo' },
  en_especificacion: { label: 'Especificando',     color: 'cyan'   },
  en_validacion:     { label: 'En validación',     color: 'yellow' },
  aprobado:          { label: 'Aprobado',          color: 'green'  },
  con_observaciones: { label: 'Con observaciones', color: 'orange' },
  cancelado:         { label: 'Cancelado (Gate 1)', color: 'red'   }, // M3-GATE1 No-Go
} as const

export const NIVEL_RIESGO_CONFIG = {
  bajo:    { label: 'Bajo',    color: 'green'  },
  medio:   { label: 'Medio',   color: 'yellow' },
  alto:    { label: 'Alto',    color: 'orange' },
  critico: { label: 'Crítico', color: 'red'    },
} as const

export const PRIORIDAD_REQ_CONFIG = {
  must:   { label: 'Must Have',   color: 'red'    },
  should: { label: 'Should Have', color: 'orange' },
  could:  { label: 'Could Have',  color: 'blue'   },
  wont:   { label: "Won't Have",  color: 'gray'   },
} as const
