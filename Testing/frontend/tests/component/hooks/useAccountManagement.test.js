import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAccountManagement } from '../../hooks/useAccountManagement'
import { useAuth } from '../../auth/authContext'

vi.mock('../../auth/authContext', () => ({
  useAuth: vi.fn()
}))

describe('useAccountManagement', () => {
  const mockRegister = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()

    import.meta.env.VITE_API_URL = 'http://localhost:3000'
    localStorage.setItem('token', 'fake-token')

    vi.stubGlobal('fetch', vi.fn())
    vi.stubGlobal('location', { reload: vi.fn() })
    vi.spyOn(console, 'error').mockImplementation(() => {})

    vi.mocked(useAuth).mockReturnValue({
      register: mockRegister
    })
  })

  describe('Estado inicial', () => {
    it('01 - Inicia con users vacío')
    it('02 - Inicia con isSaving en false')
    it('03 - Inicia con message vacío')
    it('04 - Inicia con errorMessage vacío')
  })

  describe('clearFeedbackMessages', () => {
    it('05 - Limpia message y errorMessage')
  })

  describe('loadUsers', () => {
    it('06 - Si shouldFetch=true hace fetch a /api/users')
    it('07 - Si shouldFetch=false no hace fetch inicial')
    it('08 - Normaliza full_name a fullName')
    it('09 - Guarda usuarios normalizados en users')
    it('10 - Envía Authorization Bearer token en la carga')
    it('11 - Si fetch falla hace console.error')
  })

  describe('deleteUser', () => {
    it('12 - deleteUser hace fetch DELETE al endpoint correcto')
    it('13 - Si deleteUser responde ok elimina el usuario del estado')
    it('14 - Si deleteUser responde ok setea message de éxito')
    it('15 - Si deleteUser responde no ok setea errorMessage de servidor')
    it('16 - Si deleteUser falla por red setea errorMessage de red')
  })

  describe('updateUser', () => {
    it('17 - updateUser activa isSaving mientras procesa')
    it('18 - updateUser hace fetch PUT al endpoint correcto')
    it('19 - updateUser envía body transformando fullName a full_name')
    it('20 - Si updateUser responde ok actualiza el usuario en users')
    it('21 - Si updateUser responde ok setea message de éxito')
    it('22 - Si updateUser responde ok retorna true')
    it('23 - Si updateUser responde no ok setea errorMessage')
    it('24 - Si updateUser responde no ok retorna false')
    it('25 - Si updateUser falla por red setea errorMessage de conexión')
    it('26 - Si updateUser falla por red retorna false')
    it('27 - updateUser siempre deja isSaving en false al terminar')
  })

  describe('createUser', () => {
    it('28 - createUser activa isSaving al iniciar')
    it('29 - createUser llama register con datos normalizados')
    it('30 - Si register responde ok y trae user agrega el usuario al estado')
    it('31 - Si register responde ok y trae user setea message de éxito')
    it('32 - Si register responde ok retorna true')
    it('33 - Si register responde ok pero no trae user llama window.location.reload')
    it('34 - Si register responde no ok setea errorMessage')
    it('35 - Si register responde no ok retorna false')
    it('36 - createUser deja isSaving en false al terminar')
  })

  it('37 - Snapshot lógico del estado inicial')
})
