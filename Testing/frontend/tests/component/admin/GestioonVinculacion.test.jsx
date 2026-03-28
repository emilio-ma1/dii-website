import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import GestionVinculacion from '../../admin/GestionVinculacion'
import { useAuth } from '../../auth/authContext'

vi.mock('../../auth/authContext', () => ({
  useAuth: vi.fn()
}))

vi.mock('../../auth/permisos', () => ({
  PERMISSIONS: {
    admin: {
      createProject: true,
      editProject: true,
      deleteProject: true,
      manageAccounts: true
    },
    docente: {
      createProject: false,
      editProject: true,
      deleteProject: false,
      manageAccounts: false
    }
  }
}))

describe('GestionVinculacion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuth).mockReturnValue({
      user: { role: 'admin' }
    })
  })

  describe('Utilidades', () => {
    it('01 - getStatusBadgeStyles("current") retorna estilos verdes')
    it('02 - getStatusBadgeStyles("not_current") retorna estilos vino/blanco')
    it('03 - resolveProjectImage usa imagen por defecto si image está vacío')
    it('04 - resolveProjectImage usa imagen por defecto si image tiene espacios')
    it('05 - resolveProjectImage retorna image cuando existe')
  })

  describe('Renderizado general', () => {
    it('06 - Renderiza el título "Gestión de Vinculación con el Medio"')
    it('07 - Renderiza el estado vacío cuando no hay proyectos')
    it('08 - Renderiza la sección principal')
  })

  describe('Permisos', () => {
    it('09 - Muestra botón "+ Nuevo Proyecto" cuando createProject=true')
    it('10 - Oculta botón "+ Nuevo Proyecto" cuando createProject=false')
    it('11 - ProjectCard muestra botón "Editar" cuando editProject=true')
    it('12 - ProjectCard muestra botón "Eliminar" cuando deleteProject=true')
    it('13 - ProjectCard oculta acciones cuando no hay permisos')
    it('14 - Usa DEFAULT_PERMISSIONS si user.role no existe')
  })

  describe('Estado de vista', () => {
    it('15 - showForm=false muestra listado o estado vacío')
    it('16 - showForm=true muestra ProjectForm')
    it('17 - Al mostrar ProjectForm se oculta el listado')
  })

  describe('Formulario', () => {
    it('18 - Botón "+ Nuevo Proyecto" abre formulario en modo creación')
    it('19 - ProjectForm renderiza todos los campos requeridos')
    it('20 - Select status contiene opciones "Vigente" y "No vigente"')
    it('21 - Modo creación muestra botón "Guardar"')
    it('22 - Modo edición muestra botón "Guardar Cambios"')
    it('23 - Botón "Cancelar" ejecuta onCancel')
  })

  describe('Manejo de estado', () => {
    it('24 - handleNewProject limpia editingProjectId y abre formulario')
    it('25 - handleEditProject carga datos del proyecto en formData')
    it('26 - handleEditProject activa modo edición')
    it('27 - handleChange actualiza title')
    it('28 - handleChange actualiza author')
    it('29 - handleChange actualiza topic')
    it('30 - handleChange actualiza year')
    it('31 - handleChange actualiza summary')
    it('32 - handleChange actualiza description')
    it('33 - handleChange actualiza image')
    it('34 - handleChange actualiza status')
    it('35 - handleSubmit previene recarga y resetea estado')
    it('36 - resetFormState limpia showForm, editingProjectId y formData')
  })

  describe('ProjectCard', () => {
    it('37 - Renderiza título, resumen, año y autor')
    it('38 - Renderiza TopicBadge con el topic')
    it('39 - Renderiza StatusBadge con el status')
    it('40 - Usa imagen por defecto si project.image no existe')
    it('41 - Usa alt con el título del proyecto')
  })

  describe('Badges', () => {
    it('42 - StatusBadge muestra texto "Vigente" para status=current')
    it('43 - StatusBadge muestra texto "No Vigente" para status=not_current')
    it('44 - StatusBadge muestra fallback si status no está en STATUS_LABELS')
    it('45 - TopicBadge muestra el texto del área')
  })

  describe('Accesibilidad', () => {
    it('46 - Inputs requeridos conservan required')
    it('47 - Imagen del proyecto tiene alt descriptivo')
    it('48 - Botones del formulario tienen type correcto')
  })

  it('49 - Snapshot del estado inicial')
})
