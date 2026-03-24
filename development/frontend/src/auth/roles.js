/**
 * @file roles.js
 * @description
 * Centralized definition of system roles, labels, and route access control.
 * Used by the Sidebar and route guards to determine authorization and UI rendering.
 */

/**
 * Core system roles. 
 */
export const ROLES = {
  ADMIN: "admin",
  EGRESADO: "alumni",  
  DOCENTE: "teacher",  
};

/**
 * Human-readable labels for each role to be displayed in the UI (e.g., in the Sidebar).
 */
export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Administrador",
  [ROLES.EGRESADO]: "Egresado",
  [ROLES.DOCENTE]: "Docente",
};

/**
 * Navigation menu configuration based on the user's role.
 * Maps exact route paths to the visible label in the Sidebar.
 */
export const MENU_BY_ROLE = {
  [ROLES.ADMIN]: [
    { label: "Gestión de Cuentas", to: "/admin/cuentas" },
    { label: "Gestión de Investigaciones", to: "/admin/investigaciones" },
    { label: "Gestión de Vinculación con el Medio", to: "/admin/vinculacion" },
    { label: "Gestión de Docentes", to: "/admin/docentes" },
    { label: "Gestión de Estudiantes", to: "/admin/estudiantes" },
    { label: "Gestión de Contacto", to: "/admin/contacto" },
    { label: "Gestión de Equipamiento", to: "/admin/equipamiento" },
    { label: "Trazabilidad", to: "/admin/trazabilidad" },
  ],

  [ROLES.EGRESADO]: [
    { label: "Gestión de Investigaciones", to: "/admin/investigaciones" },
    { label: "Gestión de Vinculación con el Medio", to: "/admin/vinculacion" },
  ],

  [ROLES.DOCENTE]: [
    { label: "Gestión de Investigaciones", to: "/admin/investigaciones" },
  ],
};