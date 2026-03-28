import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Login from '../../pages/Login'
import { useAuth } from '../../auth/authContext'

const mockNavigate = vi.fn()

vi.mock('../../auth/authContext', () => ({
  useAuth: vi.fn()
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderPage = () => {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )
}

describe('Login', () => {
  const mockLogin = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin
    })
  })

  describe('Renderizado general', () => {
    it('01 - Renderiza logo del departamento')
    it('02 - Renderiza título "Iniciar Sesión"')
    it('03 - Renderiza input de correo electrónico')
    it('04 - Renderiza input de contraseña')
    it('05 - Renderiza botón "Ingresar"')
    it('06 - Renderiza link "¿Olvidaste tu contraseña?"')
  })

  describe('Inputs', () => {
    it('07 - Permite escribir en el campo email')
    it('08 - Permite escribir en el campo password')
    it('09 - Input email tiene type="email"')
    it('10 - Input password tiene type="password"')
    it('11 - Ambos inputs son required')
  })

  describe('Link auxiliar', () => {
    it('12 - Link de recuperación apunta a /recuperar-password')
  })

  describe('Submit exitoso', () => {
    it('13 - handleSubmit llama login con email y password')
    it('14 - Si login responde ok=true navega a /admin/investigaciones')
    it('15 - Si login responde ok=true usa replace=true')
    it('16 - Si login responde ok=true no muestra mensaje de error')
  })

  describe('Submit con error', () => {
    it('17 - Si login responde ok=false muestra errorMessage')
    it('18 - Si login responde ok=false no navega')
    it('19 - Limpia errorMessage antes de un nuevo intento')
  })

  describe('Accesibilidad y semántica', () => {
    it('20 - Existe un único h1 principal')
    it('21 - Botón de envío tiene type="submit"')
    it('22 - La imagen del logo tiene alt="Logo Departamento"')
    it('23 - El formulario se envía con submit')
  })

  it('24 - Snapshot del estado inicial')
})
