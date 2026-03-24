import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
//import ProtectedRoute from '../../components/ProtectedRoutes'

const mockChild = <div data-testid="protected-content">Contenido protegido</div>

const renderProtected = (user = null) => {
  localStorage.clear()
  if (user) localStorage.setItem('user', JSON.stringify(user))
  
  return render(
    <MemoryRouter>
      <ProtectedRoute>{mockChild}</ProtectedRoute>
    </MemoryRouter>
  )
}

describe('ProtectedRoutes', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Sin Autenticación', () => {
    it('01 - Redirige a "/" si no hay user en localStorage')
    it('02 - Usa replace: true en Navigate')
  })

  describe('Usuario No Autorizado', () => {
    it('03 - Redirige a "/" si user.role !== "admin"')
    it('04 - Usuario con role "student" es bloqueado')
    it('05 - Usuario con role "teacher" es bloqueado')
  })

  describe('Usuario Autorizado', () => {
    it('06 - Renderiza children si user.role === "admin"')
    it('07 - Parsea correctamente JSON de localStorage')
  })

  describe('Edge Cases', () => {
    it('08 - JSON inválido en localStorage → redirige')
    it('09 - localStorage vacío → redirige')
    it('10 - User sin propiedad "role" → redirige')
  })

  describe('Accesibilidad/Seguridad', () => {
    it('11 - No expone children en DOM si no autorizado')
    it('12 - Navigate inmediato sin flash de contenido')
  })

  it('13 - Snapshot: admin autorizado')
})
