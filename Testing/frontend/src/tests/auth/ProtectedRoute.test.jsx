import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProtectedRoute from '../../auth/ProtectedRoute'
import { useAuth } from '../../auth/authContext'

vi.mock('../../auth/authContext', () => ({
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
    it('01 - Muestra "Cargando sesión..." cuando loading=true')
    it('02 - No renderiza contenido protegido cuando loading=true')
    it('03 - No redirige a login cuando loading=true')
  })

  describe('Usuario no autenticado', () => {
    it('04 - Redirige a /login cuando isAuthenticated=false y loading=false')
    it('05 - Renderiza la página de login tras la redirección')
    it('06 - No renderiza contenido protegido cuando no está autenticado')
  })

  describe('Usuario autenticado', () => {
    it('07 - Renderiza Outlet cuando isAuthenticated=true y loading=false')
    it('08 - Muestra contenido protegido cuando está autenticado')
    it('09 - No muestra mensaje de carga cuando está autenticado')
    it('10 - No redirige a login cuando está autenticado')
  })

  describe('Consistencia del hook', () => {
    it('11 - useAuth es llamado para resolver el estado de acceso')
  })

  it('12 - Snapshot del estado autenticado')
})
