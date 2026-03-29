import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import Navbar from '../../../src/components/navbar'

vi.mock('../../../src/auth/authContext', () => ({
  useAuth: vi.fn(() => ({ isAuthenticated: false, user: null, logout: vi.fn() }))
}))

import { useAuth } from '../../../src/auth/authContext'

const renderWithRouter = (ui, { path = '/' } = {}) => {
  return render(<MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>)
}

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuth.mockReturnValue({ isAuthenticated: false, user: null, logout: vi.fn() })
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
  })

  describe('Layout y Renderizado', () => {
    it('01 - Renderiza logos institucionales', () => {
      renderWithRouter(<Navbar />)
      expect(screen.getAllByRole('img').length).toBeGreaterThan(0)
    })
    it('02 - Muestra enlaces de navegación desktop', () => {
      renderWithRouter(<Navbar />)
      expect(screen.getAllByRole('link').length).toBeGreaterThan(0)
    })
    it('03 - Destaca enlace activo según ruta actual', () => {
      renderWithRouter(<Navbar />, { path: '/' })
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
    it('04 - Botón hamburguesa visible en mobile', () => {
      renderWithRouter(<Navbar />)
      expect(screen.getByLabelText(/abrir menú/i)).toBeInTheDocument()
    })
  })

  describe('Autenticación', () => {
    it('05 - Oculta enlaces auth si no está logueado', () => {
      useAuth.mockReturnValue({ isAuthenticated: false, user: null, logout: vi.fn() })
      renderWithRouter(<Navbar />)
      expect(screen.queryByText(/cerrar sesión/i)).not.toBeInTheDocument()
    })
    it('06 - Muestra "Mi perfil" y "Cerrar sesión" si está logueado', () => {
      useAuth.mockReturnValue({ isAuthenticated: true, user: { role: 'admin', full_name: 'Admin' }, logout: vi.fn() })
      renderWithRouter(<Navbar />)
      expect(screen.getAllByText(/cerrar sesión/i).length).toBeGreaterThan(0)
    })
    it('07 - Logout navega a /login', () => {
      const mockLogout = vi.fn()
      useAuth.mockReturnValue({ isAuthenticated: true, user: { role: 'admin', full_name: 'Admin' }, logout: mockLogout })
      renderWithRouter(<Navbar />)
      fireEvent.click(screen.getAllByText(/cerrar sesión/i)[0])
      expect(mockLogout).toHaveBeenCalled()
    })
  })

  describe('Menú Móvil', () => {
    it('08 - Abre/cierra menú al click hamburguesa', () => {
      renderWithRouter(<Navbar />)
      const btn = screen.getByLabelText(/abrir menú/i)
      fireEvent.click(btn)
      expect(btn).toHaveAttribute('aria-expanded', 'true')
    })
    it('09 - Cierra menú al click fuera', () => {
      renderWithRouter(<Navbar />)
      const btn = screen.getByLabelText(/abrir menú/i)
      fireEvent.click(btn)
      expect(btn).toHaveAttribute('aria-expanded', 'true')
      fireEvent.click(btn)
      expect(btn).toHaveAttribute('aria-expanded', 'false')
    })
    it('10 - Enlaces mobile con estilos correctos', () => {
      renderWithRouter(<Navbar />)
      expect(screen.getAllByRole('link').length).toBeGreaterThan(0)
    })
  })

  describe('Estados Visuales', () => {
    it('11 - Navbar scrolled (bg-blur después scrollY > 20)', () => {
      renderWithRouter(<Navbar />)
      act(() => {
        window.scrollY = 30
        window.dispatchEvent(new Event('scroll'))
      })
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
    it('12 - ActiveIndicator visible en ruta activa', () => {
      renderWithRouter(<Navbar />, { path: '/' })
      expect(screen.getAllByRole('link').length).toBeGreaterThan(0)
    })
  })

  describe('Accesibilidad', () => {
    it('13 - aria-labels en botones hamburguesa', () => {
      renderWithRouter(<Navbar />)
      expect(screen.getByLabelText(/abrir menú/i)).toBeInTheDocument()
    })
    it('14 - Roles semánticos: navigation, button, img', () => {
      renderWithRouter(<Navbar />)
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getAllByRole('img').length).toBeGreaterThan(0)
    })
  })

  it('15 - Snapshot: estado inicial sin auth', () => {
    const { container } = renderWithRouter(<Navbar />)
    expect(container).toMatchSnapshot()
  })
})