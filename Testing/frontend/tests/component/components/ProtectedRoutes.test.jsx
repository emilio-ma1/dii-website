import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import ProtectedRoute from '../../../src/components/ProtectedRoutes'

const mockChild = <div data-testid="protected-content">Contenido protegido</div>

const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString() },
    clear: () => { store = {} },
    removeItem: (key) => { delete store[key] }
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

const renderProtected = (user = null) => {
  localStorageMock.clear()
  if (user) localStorageMock.setItem('user', JSON.stringify(user))
  return render(
    <MemoryRouter>
      <ProtectedRoute>{mockChild}</ProtectedRoute>
    </MemoryRouter>
  )
}

describe('ProtectedRoutes', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  describe('Sin Autenticación', () => {
    it('01 - Redirige a "/" si no hay user en localStorage', () => {
      renderProtected(null)
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })
    it('02 - Usa replace: true en Navigate', () => {
      renderProtected(null)
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })
  })

  describe('Usuario No Autorizado', () => {
    it('03 - Redirige a "/" si user.role !== "admin"', () => {
      renderProtected({ role: 'egresado' })
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })
    it('04 - Usuario con role "student" es bloqueado', () => {
      renderProtected({ role: 'student' })
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })
    it('05 - Usuario con role "teacher" es bloqueado', () => {
      renderProtected({ role: 'teacher' })
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })
  })

  describe('Usuario Autorizado', () => {
    it('06 - Renderiza children si user.role === "admin"', () => {
      renderProtected({ role: 'admin' })
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    })
    it('07 - Parsea correctamente JSON de localStorage', () => {
      localStorageMock.setItem('user', JSON.stringify({ role: 'admin' }))
      render(
        <MemoryRouter>
          <ProtectedRoute>{mockChild}</ProtectedRoute>
        </MemoryRouter>
      )
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('08 - JSON inválido en localStorage → redirige', () => {
  localStorageMock.setItem('user', 'invalid-json')
  expect(() => {
    render(
      <MemoryRouter>
        <ProtectedRoute>{mockChild}</ProtectedRoute>
      </MemoryRouter>
    )
  }).toThrow()
})
    it('09 - localStorage vacío → redirige', () => {
      renderProtected(null)
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })
    it('10 - User sin propiedad "role" → redirige', () => {
      renderProtected({ name: 'sin rol' })
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })
  })

  describe('Accesibilidad/Seguridad', () => {
    it('11 - No expone children en DOM si no autorizado', () => {
      renderProtected(null)
      expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument()
    })
    it('12 - Navigate inmediato sin flash de contenido', () => {
      renderProtected({ role: 'egresado' })
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })
  })

  it('13 - Snapshot: admin autorizado', () => {
    const { container } = renderProtected({ role: 'admin' })
    expect(container).toMatchSnapshot()
  })
})