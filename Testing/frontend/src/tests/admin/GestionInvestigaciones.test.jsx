import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import GestionInvestigaciones from '../../admin/GestionInvestigaciones'
import { useAuth } from '../../auth/authContext'
import { useResearchData } from '../../hooks/useResearchData'

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

vi.mock('../../hooks/useResearchData', () => ({
  useResearchData: vi.fn()
}))

vi.mock('../../components/Research/ProjectForm', () => ({
  ProjectForm: vi.fn(() => <div data-testid="project-form">ProjectForm</div>)
}))

vi.mock('../../components/Research/ProjectCard', () => ({
  ProjectCard: vi.fn(() => <div data-testid="project-card">ProjectCard</div>)
}))

describe('GestionInvestigaciones', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useAuth).mockReturnValue({
      user: { role: 'admin' }
    })

    vi.mocked(useResearchData).mockReturnValue({
      availableAuthors: [],
      categories: []
    })

    global.fetch = vi.fn()
    global.alert = vi.fn()
    localStorage.setItem('token', 'fake-token')
  })

  describe('Renderizado general', () => {
    it('01 - Renderiza el título "Gestión de Investigaciones"')
    it('02 - Renderiza estado vacío cuando no hay proyectos')
    it('03 - Renderiza la sección principal')
  })

  describe('Permisos', () => {
    it('04 - Muestra botón "+ Nuevo Proyecto" cuando createProject=true')
    it('05 - Oculta botón "+ Nuevo Proyecto" cuando createProject=false')
    it('06 - useResearchData recibe true cuando createProject o editProject están habilitados')
    it('07 - useResearchData recibe false cuando no se deben cargar dependencias')
  })

  describe('Carga inicial', () => {
    it('08 - useEffect ejecuta fetchProjects al montar')
    it('09 - fetchProjects consulta /api/projects')
    it('10 - Si response.ok=true guarda proyectos en estado')
    it('11 - Si fetch falla, maneja error sin romper render')
  })

  describe('Formulario', () => {
    it('12 - Al hacer click en "+ Nuevo Proyecto" muestra ProjectForm')
    it('13 - initializeNewProject reinicia EMPTY_FORM')
    it('14 - ProjectForm recibe formData inicial correcto')
    it('15 - ProjectForm recibe availableUsers desde useResearchData')
    it('16 - ProjectForm recibe categories desde useResearchData')
    it('17 - Botón cancelar ejecuta resetFormState')
  })

  describe('Edición', () => {
    it('18 - loadProjectForEditing carga datos del proyecto seleccionado')
    it('19 - isEditing=true cuando editingProjectId existe')
    it('20 - ProjectForm recibe isEditing=true en modo edición')
    it('21 - loadProjectForEditing conserva authors array')
    it('22 - loadProjectForEditing conserva category_id y status')
  })

  describe('Listado', () => {
    it('23 - Renderiza un ProjectCard por cada proyecto')
    it('24 - ProjectCard recibe onEdit')
    it('25 - ProjectCard recibe onDelete')
    it('26 - ProjectCard recibe permissions')
  })

  describe('Manejo del formulario', () => {
    it('27 - updateFormState actualiza campos simples del formData')
    it('28 - submitProjectData previene recarga del formulario')
    it('29 - submitProjectData hace POST a /api/projects')
    it('30 - submitProjectData envía Authorization Bearer token')
    it('31 - submitProjectData envía Content-Type application/json')
    it('32 - submitProjectData envía body con JSON.stringify(formData)')
  })

  describe('Respuestas del submit', () => {
    it('33 - Si response.ok=true muestra alert de éxito')
    it('34 - Si response.ok=true cierra formulario')
    it('35 - Si response.ok=true vuelve a consultar proyectos')
    it('36 - Si response.ok=false muestra alert con data.message')
    it('37 - Si hay error de red muestra alert de error de red')
  })

  describe('Edge cases', () => {
    it('38 - Usa DEFAULT_PERMISSIONS si user.role no existe')
    it('39 - Usa status "in_progress" por defecto en EMPTY_FORM')
    it('40 - Tolera proyecto sin image_url o pdf_url')
    it('41 - deleteProject actual no rompe render aunque esté vacío')
  })

  describe('Accesibilidad y contrato', () => {
    it('42 - ProjectForm solo aparece cuando showForm=true')
    it('43 - El listado desaparece cuando showForm=true')
    it('44 - El estado vacío desaparece cuando existen proyectos')
  })

  it('45 - Snapshot del estado inicial')
})
