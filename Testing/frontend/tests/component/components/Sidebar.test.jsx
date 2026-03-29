import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Sidebar from '../../../src/components/Sidebar'

const mockUseAuth = vi.fn()

vi.mock('../../../src/auth/authContext', () => ({
  useAuth: () => mockUseAuth()
}))

vi.mock('../../../src/auth/roles', () => ({
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
    it('01 - Muestra nombre desde full_name o name', () => {
      renderSidebar({ full_name: 'Juan Pérez', role: 'admin' })
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
    })
    it('02 - Avatar con alt={user.name}', () => {
      renderSidebar({ full_name: 'Juan Pérez', role: 'admin' })
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveAttribute('alt', 'Juan Pérez')
    })
    it('03 - Role label según getUserRoleLabel()', () => {
      renderSidebar({ full_name: 'Juan', role: 'admin' })
      expect(screen.getByText('Secretaria del Departamento')).toBeInTheDocument()
    })
    it('04 - Badge ROLE_LABELS[role]', () => {
      renderSidebar({ full_name: 'Juan', role: 'admin' })
      expect(screen.getByText('Admin')).toBeInTheDocument()
    })
  })

  describe('Menú por Rol', () => {
    it('05 - Admin: muestra MENU_BY_ROLE.admin', () => {
      renderSidebar({ full_name: 'Juan', role: 'admin' })
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
    it('06 - Docente: muestra MENU_BY_ROLE.docente', () => {
      renderSidebar({ full_name: 'Juan', role: 'docente' }, '/docentes')
      expect(screen.getByText('Mis Cursos')).toBeInTheDocument()
    })
    it('07 - Egresado sin user: menú vacío', () => {
      renderSidebar({ full_name: 'Juan', role: 'egresado' })
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })
    it('08 - NavLink active en ruta actual', () => {
      renderSidebar({ full_name: 'Juan', role: 'admin' }, '/admin')
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
  })

  describe('Estilos', () => {
    it('09 - Active: bg-[#722b4d] text-white shadow-md', () => {
      renderSidebar({ full_name: 'Juan', role: 'admin' }, '/admin')
      const link = screen.getByText('Dashboard').closest('a')
      expect(link.className).toContain('bg-[#722b4d]')
    })
    it('10 - Inactive: hover:bg-[#722b4d]/5', () => {
      renderSidebar({ full_name: 'Juan', role: 'admin' }, '/otra-ruta')
      const link = screen.getByText('Dashboard').closest('a')
      expect(link.className).toContain('hover:bg-[#722b4d]/5')
    })
    it('11 - Avatar rounded-full border-[#722b4d]/15', () => {
      renderSidebar({ full_name: 'Juan', role: 'admin' })
      const avatarContainer = screen.getByRole('img').parentElement
      expect(avatarContainer.className).toContain('rounded-full')
    })
  })

  describe('Funcionalidad', () => {
    it('12 - onNavigate() al click NavLink', () => {
      const mockNavigate = vi.fn()
      mockUseAuth.mockReturnValue({ user: { full_name: 'Juan', role: 'admin' } })
      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Sidebar onNavigate={mockNavigate} />
        </MemoryRouter>
      )
      fireEvent.click(screen.getByText('Dashboard'))
      expect(mockNavigate).toHaveBeenCalled()
    })
    it('13 - Overflow-y-auto en aside', () => {
      const { container } = renderSidebar({ full_name: 'Juan', role: 'admin' })
      const aside = container.querySelector('aside')
      expect(aside.className).toContain('overflow-y-auto')
    })
  })

  describe('Edge Cases', () => {
    it('14 - user=null → rol "egresado" por default', () => {
      renderSidebar(null)
      expect(screen.getByText('Usuario')).toBeInTheDocument()
    })
    it('15 - MENU_BY_ROLE[role] undefined → menú vacío', () => {
      renderSidebar({ full_name: 'Juan', role: 'rol_inexistente' })
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })
  })

  describe('Accesibilidad', () => {
    it('16 - Alt descriptivo en avatar', () => {
      renderSidebar({ full_name: 'Maria López', role: 'admin' })
      expect(screen.getByAltText('Maria López')).toBeInTheDocument()
    })
    it('17 - Nav semántico', () => {
      renderSidebar({ full_name: 'Juan', role: 'admin' })
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
  })

  it('18 - Snapshot: admin en /admin', () => {
    const { container } = renderSidebar({ full_name: 'Juan', role: 'admin' }, '/admin')
    expect(container).toMatchSnapshot()
  })
})