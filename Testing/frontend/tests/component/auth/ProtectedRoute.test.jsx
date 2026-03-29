import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProtectedRoute from '../../../src/auth/ProtectedRoute'
import { useAuth } from '../../../src/auth/authContext'

vi.mock('../../../src/auth/authContext', () => ({
  useAuth: vi.fn()
}))

const ProtectedContent = () => <div>Contenido protegido</div>
const LoginPage = () => <div>Página de login</div>

const renderWithRoutes = () => {
  return render(
    <MemoryRouter initialEntries={['/privado']}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/privado" element={<ProtectedContent />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Estado loading', () => {
    it('01 - Muestra "Cargando sesión..." cuando loading=true', () => {
      useAuth.mockReturnValue({ isAuthenticated: false, loading: true })
      renderWithRoutes()
      expect(screen.getByText(/cargando sesión/i)).toBeInTheDocument()
    })
    it('02 - No renderiza contenido protegido cuando loading=true', () => {
      useAuth.mockReturnValue({ isAuthenticated: false, loading: true })
      renderWithRoutes()
      expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument()
    })
    it('03 - No redirige a login cuando loading=true', () => {
      useAuth.mockReturnValue({ isAuthenticated: false, loading: true })
      renderWithRoutes()
      expect(screen.queryByText('Página de login')).not.toBeInTheDocument()
    })
  })

  describe('Usuario no autenticado', () => {
    it('04 - Redirige a /login cuando isAuthenticated=false y loading=false', () => {
      useAuth.mockReturnValue({ isAuthenticated: false, loading: false })
      renderWithRoutes()
      expect(screen.getByText('Página de login')).toBeInTheDocument()
    })
    it('05 - Renderiza la página de login tras la redirección', () => {
      useAuth.mockReturnValue({ isAuthenticated: false, loading: false })
      renderWithRoutes()
      expect(screen.getByText('Página de login')).toBeInTheDocument()
    })
    it('06 - No renderiza contenido protegido cuando no está autenticado', () => {
      useAuth.mockReturnValue({ isAuthenticated: false, loading: false })
      renderWithRoutes()
      expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument()
    })
  })

  describe('Usuario autenticado', () => {
    it('07 - Renderiza Outlet cuando isAuthenticated=true y loading=false', () => {
      useAuth.mockReturnValue({ isAuthenticated: true, loading: false })
      renderWithRoutes()
      expect(screen.getByText('Contenido protegido')).toBeInTheDocument()
    })
    it('08 - Muestra contenido protegido cuando está autenticado', () => {
      useAuth.mockReturnValue({ isAuthenticated: true, loading: false })
      renderWithRoutes()
      expect(screen.getByText('Contenido protegido')).toBeInTheDocument()
    })
    it('09 - No muestra mensaje de carga cuando está autenticado', () => {
      useAuth.mockReturnValue({ isAuthenticated: true, loading: false })
      renderWithRoutes()
      expect(screen.queryByText(/cargando sesión/i)).not.toBeInTheDocument()
    })
    it('10 - No redirige a login cuando está autenticado', () => {
      useAuth.mockReturnValue({ isAuthenticated: true, loading: false })
      renderWithRoutes()
      expect(screen.queryByText('Página de login')).not.toBeInTheDocument()
    })
  })

  describe('Consistencia del hook', () => {
    it('11 - useAuth es llamado para resolver el estado de acceso', () => {
      useAuth.mockReturnValue({ isAuthenticated: true, loading: false })
      renderWithRoutes()
      expect(useAuth).toHaveBeenCalled()
    })
  })

  it('12 - Snapshot del estado autenticado', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, loading: false })
    const { container } = renderWithRoutes()
    expect(container).toMatchSnapshot()
  })
})