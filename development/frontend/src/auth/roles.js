/**
 * Definición centralizada de roles del sistema.
 * Se utiliza para control de permisos y renderizado.
 */
export const ROLES = {
  ADMIN: "admin",
  EGRESADO: "egresado",
  DOCENTE: "docente",
};

/**
 * Etiquetas visibles para cada rol.
 */
export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Administrador",
  [ROLES.EGRESADO]: "Egresado",
  [ROLES.DOCENTE]: "Docente",
};

/**
 * Configuración del menú según el rol del usuario.
 */
export const MENU_BY_ROLE = {
  [ROLES.ADMIN]: [
    { label: "Gestión de Cuentas", to: "/admin/cuentas" },
    { label: "Gestión de Investigaciones", to: "/admin/investigaciones" },
    { label: "Gestión Vinculación con el Medio", to: "/admin/vinculacion" },
    { label: "Gestión de Docentes", to: "/admin/docentes" },
    { label: "Gestión de Estudiantes", to: "/admin/estudiantes" },
    { label: "Gestión de Contacto", to: "/admin/contacto" },
    { label: "Gestión de Equipamiento", to: "/admin/equipamiento" },
    { label: "Trazabilidad", to: "/admin/trazabilidad" },
  ],

  [ROLES.EGRESADO]: [
    {
      label: "Gestión de Investigaciones",
      to: "/admin/investigaciones",
    },
    {
      label: "Gestión de Vinculación con el Medio",
      to: "/admin/vinculacion",
    },

  ],

  [ROLES.DOCENTE]: [
    {
      label: "Gestión de Investigaciones",
      to: "/admin/investigaciones",
    },
  ],
};