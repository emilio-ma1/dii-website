import { ROLES } from "./roles";

/**
 * Genera una estructura base de permisos en falso.
 */
function createBasePermissions() {
  return {
    createProject: false,
    editProject: false,
    deleteProject: false,
    downloadPdf: false,
    manageAccounts: false,
    createTeacher: false,
    editTeacher: false,
    deleteTeacher: false,
    createStudent: false,
    editStudent: false,
    deleteStudent: false,
    createContact: false,
    editContact: false,
    deleteContact: false,
    createEquipment: false,
    editEquipment: false,
    deleteEquipment: false,
  };
}

/**
 * Permisos del rol administrador.
 */
const ADMIN_PERMISSIONS = {
  ...createBasePermissions(),
  createProject: true,
  editProject: true,
  deleteProject: true,
  downloadPdf: true,
  manageAccounts: true,
  createTeacher: true,
  editTeacher: true,
  deleteTeacher: true,
  createStudent: true,
  editStudent: true,
  deleteStudent: true,
  createContact: true,
  editContact: true,
  deleteContact: true,
  createEquipment: true,
  editEquipment: true,
  deleteEquipment: true,
};

/**
 * Permisos del rol egresado.
 */
const GRADUATE_PERMISSIONS = {
  ...createBasePermissions(),
  createProject: true,
  editProject: true,
  downloadPdf: true,
};

/**
 * Permisos del rol docente.
 */
const TEACHER_PERMISSIONS = {
  ...createBasePermissions(),
  createProject: true,
  editProject: true,
  downloadPdf: true,
};

/**
 * Mapa de permisos por rol.
 */
export const PERMISSIONS = {
  [ROLES.ADMIN]: ADMIN_PERMISSIONS,
  [ROLES.EGRESADO]: GRADUATE_PERMISSIONS,
  [ROLES.DOCENTE]: TEACHER_PERMISSIONS,
};