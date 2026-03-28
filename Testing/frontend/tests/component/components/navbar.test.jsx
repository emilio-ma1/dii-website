import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'

// Mocks
vi.mock('../../auth/authContext', () => ({
  useAuth: vi.fn(() => ({ isAuthenticated: false, user: null, logout: vi.fn() }))
}))

const renderWithRouter = (ui, { path = '/' } = {}) => {
  return render(<MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>)
}

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
  })

  describe('Layout y Renderizado', () => {
    it('01 - Renderiza logos institucionales')
    it('02 - Muestra enlaces de navegación desktop')
    it('03 - Destaca enlace activo según ruta actual')
    it('04 - Botón hamburguesa visible en mobile')
  })

  describe('Autenticación', () => {
    it('05 - Oculta enlaces auth si no está logueado')
    it('06 - Muestra "Mi perfil" y "Cerrar sesión" si está logueado')
    it('07 - Logout navega a /login')
  })

  describe('Menú Móvil', () => {
    it('08 - Abre/cierra menú al click hamburguesa')
    it('09 - Cierra menú al click fuera')
    it('10 - Enlaces mobile con estilos correctos')
  })

  describe('Estados Visuales', () => {
    it('11 - Navbar scrolled (bg-blur después scrollY > 20)')
    it('12 - ActiveIndicator visible en ruta activa')
  })

  describe('Accesibilidad', () => {
    it('13 - aria-labels en botones hamburguesa')
    it('14 - Roles semánticos: navigation, button, img')
  })

  it('15 - Snapshot: estado inicial sin auth')
})
