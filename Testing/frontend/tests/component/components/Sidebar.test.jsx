import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Sidebar from '../../components/Sidebar'

// Mocks
const mockUseAuth = vi.fn()
vi.mock('../../auth/authContext', () => ({
  useAuth: () => mockUseAuth()
}))

vi.mock('../../auth/roles', () => ({
  MENU_BY_ROLE: {
    admin: [{ to: '/admin', label: 'Dashboard' }],
    docente: [{ to: '/docentes', label: 'Mis Cursos' }]
  },
  ROLE_LABELS: { admin: 'Admin', docente: 'Docente', egresado: 'Egresado' }
}))

const renderSidebar = (user = null, path = '/admin') => {
  mockUseAuth.mockReturnValue({ user })
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Sidebar onNavigate={vi.fn()} />
    </MemoryRouter>
  )
}

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Información Usuario', () => {
    it('01 - Muestra nombre desde full_name o name')
    it('02 - Avatar con alt={user.name}')
    it('03 - Role label según getUserRoleLabel()')
    it('04 - Badge ROLE_LABELS[role]')
  })

  describe('Menú por Rol', () => {
    it('05 - Admin: muestra MENU_BY_ROLE.admin')
    it('06 - Docente: muestra MENU_BY_ROLE.docente')
    it('07 - Egresado sin user: menú vacío')
    it('08 - NavLink active en ruta actual')
  })

  describe('Estilos', () => {
    it('09 - Active: bg-[#722b4d] text-white shadow-md')
    it('10 - Inactive: hover:bg-[#722b4d]/5')
    it('11 - Avatar rounded-full border-[#722b4d]/15')
  })

  describe('Funcionalidad', () => {
    it('12 - onNavigate() al click NavLink')
    it('13 - Overflow-y-auto en aside')
  })

  describe('Edge Cases', () => {
    it('14 - user=null → rol "egresado" por default')
    it('15 - MENU_BY_ROLE[role] undefined → menú vacío')
  })

  describe('Accesibilidad', () => {
    it('16 - Alt descriptivo en avatar')
    it('17 - Nav semántico')
  })

  it('18 - Snapshot: admin en /admin')
})
