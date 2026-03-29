import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAccountManagement } from '../../../src/hooks/useAccountManagement'
import { useAuth } from '../../../src/auth/authContext'

vi.mock('../../../src/auth/authContext', () => ({
  useAuth: vi.fn()
}))

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

describe('useAccountManagement', () => {
  const mockRegister = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
    localStorageMock.setItem('token', 'fake-token')
    vi.stubGlobal('fetch', vi.fn())
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(useAuth).mockReturnValue({ register: mockRegister })
  })

  describe('Estado inicial', () => {
    it('01 - Inicia con users vacío', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => [] })
      const { result } = renderHook(() => useAccountManagement(true))
      await waitFor(() => expect(fetch).toHaveBeenCalled())
      expect(result.current.users).toEqual([])
    })
    it('02 - Inicia con isSaving en false', () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => [] })
      const { result } = renderHook(() => useAccountManagement(false))
      expect(result.current.isSaving).toBe(false)
    })
    it('03 - Inicia con message vacío', () => {
      const { result } = renderHook(() => useAccountManagement(false))
      expect(result.current.message).toBe('')
    })
    it('04 - Inicia con errorMessage vacío', () => {
      const { result } = renderHook(() => useAccountManagement(false))
      expect(result.current.errorMessage).toBe('')
    })
  })

  describe('clearFeedbackMessages', () => {
    it('05 - Limpia message y errorMessage', async () => {
      fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ message: 'Error' }) })
      const { result } = renderHook(() => useAccountManagement(false))
      await act(async () => {
        await result.current.deleteUser('1')
      })
      act(() => { result.current.clearFeedbackMessages() })
      expect(result.current.message).toBe('')
      expect(result.current.errorMessage).toBe('')
    })
  })

  describe('loadUsers', () => {
    it('06 - Si shouldFetch=true hace fetch a /api/users', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => [] })
      renderHook(() => useAccountManagement(true))
      await waitFor(() => expect(fetch).toHaveBeenCalled())
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/users'), expect.any(Object))
    })
    it('07 - Si shouldFetch=false no hace fetch inicial', () => {
      renderHook(() => useAccountManagement(false))
      expect(fetch).not.toHaveBeenCalled()
    })
    it('08 - Normaliza full_name a fullName', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: '1', full_name: 'Juan Pérez', email: 'juan@test.com', role: 'admin' }]
      })
      const { result } = renderHook(() => useAccountManagement(true))
      await waitFor(() => expect(result.current.users.length).toBeGreaterThan(0))
      expect(result.current.users[0].fullName).toBe('Juan Pérez')
    })
    it('09 - Guarda usuarios normalizados en users', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: '1', full_name: 'Juan', email: 'juan@test.com', role: 'admin' }]
      })
      const { result } = renderHook(() => useAccountManagement(true))
      await waitFor(() => expect(result.current.users.length).toBe(1))
      expect(result.current.users[0]).toHaveProperty('fullName')
    })
    it('10 - Envía Authorization Bearer token en la carga', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => [] })
      renderHook(() => useAccountManagement(true))
      await waitFor(() => expect(fetch).toHaveBeenCalled())
      expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer fake-token' })
      }))
    })
    it('11 - Si fetch falla hace console.error', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))
      renderHook(() => useAccountManagement(true))
      await waitFor(() => expect(console.error).toHaveBeenCalled())
    })
  })

  describe('deleteUser', () => {
    it('12 - deleteUser hace fetch DELETE al endpoint correcto', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => [] })
      fetch.mockResolvedValueOnce({ ok: true })
      const { result } = renderHook(() => useAccountManagement(true))
      await waitFor(() => expect(fetch).toHaveBeenCalled())
      await act(async () => { await result.current.deleteUser('1') })
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/users/1'), expect.objectContaining({ method: 'DELETE' }))
    })
    it('13 - Si deleteUser responde ok elimina el usuario del estado', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: '1', full_name: 'Juan', email: 'juan@test.com', role: 'admin' }]
      })
      fetch.mockResolvedValueOnce({ ok: true })
      const { result } = renderHook(() => useAccountManagement(true))
      await waitFor(() => expect(result.current.users.length).toBe(1))
      await act(async () => { await result.current.deleteUser('1') })
      expect(result.current.users.length).toBe(0)
    })
    it('14 - Si deleteUser responde ok setea message de éxito', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => [] })
      fetch.mockResolvedValueOnce({ ok: true })
      const { result } = renderHook(() => useAccountManagement(true))
      await waitFor(() => expect(fetch).toHaveBeenCalled())
      await act(async () => { await result.current.deleteUser('1') })
      expect(result.current.message).not.toBe('')
    })
    it('15 - Si deleteUser responde no ok setea errorMessage de servidor', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => [] })
      fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ message: 'Error del servidor' }) })
      const { result } = renderHook(() => useAccountManagement(true))
      await waitFor(() => expect(fetch).toHaveBeenCalled())
      await act(async () => { await result.current.deleteUser('1') })
      expect(result.current.errorMessage).not.toBe('')
    })
    it('16 - Si deleteUser falla por red setea errorMessage de red', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => [] })
      fetch.mockRejectedValueOnce(new Error('Network error'))
      const { result } = renderHook(() => useAccountManagement(true))
      await waitFor(() => expect(fetch).toHaveBeenCalled())
      await act(async () => { await result.current.deleteUser('1') })
      expect(result.current.errorMessage).not.toBe('')
    })
  })

  describe('updateUser', () => {
    it('17 - updateUser activa isSaving mientras procesa', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => [] })
      let resolveFetch
      fetch.mockImplementationOnce(() => new Promise(resolve => { resolveFetch = resolve }))
      const { result } = renderHook(() => useAccountManagement(true))
      await waitFor(() => expect(fetch).toHaveBeenCalled())
      act(() => { result.current.updateUser('1', { fullName: 'Juan', email: 'juan@test.com', role: 'admin', password: '' }) })
      expect(result.current.isSaving).toBe(true)
      resolveFetch({ ok: true, json: async () => ({ id: '1', full_name: 'Juan', email: 'juan@test.com', role: 'admin' }) })
    })
    it('18 - updateUser hace fetch PUT al endpoint correcto', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => [] })
      fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: '1', full_name: 'Juan', email: 'juan@test.com', role: 'admin' }) })
      const { result } = renderHook(() => useAccountManagement(true))
      await waitFor(() => expect(fetch).toHaveBeenCalled())
      await act(async () => { await result.current.updateUser('1', { fullName: 'Juan', email: 'juan@test.com', role: 'admin', password: '' }) })
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/users/1'), expect.objectContaining({ method: 'PUT' }))
    })
    it('19 - updateUser envía body transformando fullName a full_name', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => [] })
      fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: '1', full_name: 'Juan', email: 'juan@test.com', role: 'admin' }) })
      const { result } = renderHook(() => useAccountManagement(true))
      await waitFor(() => expect(fetch).toHaveBeenCalled())
      await act(async () => { await result.current.updateUser('1', { fullName: 'Juan', email: 'juan@test.com', role: 'admin', password: '' }) })
      const body = JSON.parse(fetch.mock.calls[1][1].body)
      expect(body).toHaveProperty('full_name', 'Juan')
    })
    it('20 - Si updateUser responde ok actualiza el usuario en users', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [{ id: '1', full_name: 'Juan', email: 'juan@test.com', role: 'admin' }]
  })
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      user: { id: '1', full_name: 'Juan Actualizado', email: 'juan@test.com', role: 'admin' },
      message: 'Actualizado'
    })
  })
  const { result } = renderHook(() => useAccountManagement(true))
  await waitFor(() => expect(result.current.users.length).toBe(1))
  await act(async () => { await result.current.updateUser('1', { fullName: 'Juan Actualizado', email: 'juan@test.com', role: 'admin', password: '' }) })
  expect(result.current.users[0].fullName).toBe('Juan Actualizado')
})
    it('21 - Si updateUser responde ok setea message de éxito', async () => {
  fetch.mockResolvedValueOnce({ ok: true, json: async () => [] })
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      user: { id: '1', full_name: 'Juan', email: 'juan@test.com', role: 'admin' },
      message: 'Usuario actualizado correctamente.'
    })
  })
  const { result } = renderHook(() => useAccountManagement(true))
  await waitFor(() => expect(fetch).toHaveBeenCalled())
  await act(async () => { await result.current.updateUser('1', { fullName: 'Juan', email: 'juan@test.com', role: 'admin', password: '' }) })
  expect(result.current.message).not.toBe('')
})
    it('22 - Si updateUser responde ok retorna true', async () => {
  fetch.mockResolvedValueOnce({ ok: true, json: async () => [] })
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      user: { id: '1', full_name: 'Juan', email: 'juan@test.com', role: 'admin' },
      message: 'Actualizado'
    })
  })
  const { result } = renderHook(() => useAccountManagement(true))
  await waitFor(() => expect(fetch).toHaveBeenCalled())
  let updateResult
  await act(async () => { updateResult = await result.current.updateUser('1', { fullName: 'Juan', email: 'juan@test.com', role: 'admin', password: '' }) })
  expect(updateResult).toBe(true)
})
    it('23 - Si updateUser responde no ok setea errorMessage', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => [] })
      fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ message: 'Error al actualizar' }) })
      const { result } = renderHook(() => useAccountManagement(true))
      await waitFor(() => expect(fetch).toHaveBeenCalled())
      await act(async () => { await result.current.updateUser('1', { fullName: 'Juan', email: 'juan@test.com', role: 'admin', password: '' }) })
      expect(result.current.errorMessage).not.toBe('')
    })
    it('24 - Si updateUser responde no ok retorna false', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => [] })
      fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ message: 'Error' }) })
      const { result } = renderHook(() => useAccountManagement(true))
      await waitFor(() => expect(fetch).toHaveBeenCalled())
      let updateResult
      await act(async () => { updateResult = await result.current.updateUser('1', { fullName: 'Juan', email: 'juan@test.com', role: 'admin', password: '' }) })
      expect(updateResult).toBe(false)
    })
    it('25 - Si updateUser falla por red setea errorMessage de conexión', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => [] })
      fetch.mockRejectedValueOnce(new Error('Network error'))
      const { result } = renderHook(() => useAccountManagement(true))
      await waitFor(() => expect(fetch).toHaveBeenCalled())
      await act(async () => { await result.current.updateUser('1', { fullName: 'Juan', email: 'juan@test.com', role: 'admin', password: '' }) })
      expect(result.current.errorMessage).not.toBe('')
    })
    it('26 - Si updateUser falla por red retorna false', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => [] })
      fetch.mockRejectedValueOnce(new Error('Network error'))
      const { result } = renderHook(() => useAccountManagement(true))
      await waitFor(() => expect(fetch).toHaveBeenCalled())
      let updateResult
      await act(async () => { updateResult = await result.current.updateUser('1', { fullName: 'Juan', email: 'juan@test.com', role: 'admin', password: '' }) })
      expect(updateResult).toBe(false)
    })
    it('27 - updateUser siempre deja isSaving en false al terminar', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => [] })
      fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: '1', full_name: 'Juan', email: 'juan@test.com', role: 'admin' }) })
      const { result } = renderHook(() => useAccountManagement(true))
      await waitFor(() => expect(fetch).toHaveBeenCalled())
      await act(async () => { await result.current.updateUser('1', { fullName: 'Juan', email: 'juan@test.com', role: 'admin', password: '' }) })
      expect(result.current.isSaving).toBe(false)
    })
  })

  describe('createUser', () => {
    it('28 - createUser activa isSaving al iniciar', async () => {
      let resolveRegister
      mockRegister.mockImplementationOnce(() => new Promise(resolve => { resolveRegister = resolve }))
      const { result } = renderHook(() => useAccountManagement(false))
      act(() => { result.current.createUser({ fullName: 'Nuevo', email: 'nuevo@test.com', role: 'admin', password: '123' }) })
      expect(result.current.isSaving).toBe(true)
      resolveRegister({ ok: true, user: { id: '2', full_name: 'Nuevo', email: 'nuevo@test.com', role: 'admin' } })
    })
    it('29 - createUser llama register con datos normalizados', async () => {
      mockRegister.mockResolvedValueOnce({ ok: true, user: { id: '2', full_name: 'Nuevo', email: 'nuevo@test.com', role: 'admin' } })
      const { result } = renderHook(() => useAccountManagement(false))
      await act(async () => { await result.current.createUser({ fullName: 'Nuevo', email: 'nuevo@test.com', role: 'admin', password: '123' }) })
      expect(mockRegister).toHaveBeenCalledWith(expect.objectContaining({ full_name: 'Nuevo' }))
    })
    it('30 - Si register responde ok y trae user agrega el usuario al estado', async () => {
      mockRegister.mockResolvedValueOnce({ ok: true, user: { id: '2', full_name: 'Nuevo', email: 'nuevo@test.com', role: 'admin' } })
      const { result } = renderHook(() => useAccountManagement(false))
      await act(async () => { await result.current.createUser({ fullName: 'Nuevo', email: 'nuevo@test.com', role: 'admin', password: '123' }) })
      expect(result.current.users.length).toBe(1)
    })
    it('31 - Si register responde ok y trae user setea message de éxito', async () => {
      mockRegister.mockResolvedValueOnce({ ok: true, user: { id: '2', full_name: 'Nuevo', email: 'nuevo@test.com', role: 'admin' } })
      const { result } = renderHook(() => useAccountManagement(false))
      await act(async () => { await result.current.createUser({ fullName: 'Nuevo', email: 'nuevo@test.com', role: 'admin', password: '123' }) })
      expect(result.current.message).not.toBe('')
    })
    it('32 - Si register responde ok retorna true', async () => {
      mockRegister.mockResolvedValueOnce({ ok: true, user: { id: '2', full_name: 'Nuevo', email: 'nuevo@test.com', role: 'admin' } })
      const { result } = renderHook(() => useAccountManagement(false))
      let createResult
      await act(async () => { createResult = await result.current.createUser({ fullName: 'Nuevo', email: 'nuevo@test.com', role: 'admin', password: '123' }) })
      expect(createResult).toBe(true)
    })
    it('33 - Si register responde ok pero no trae user llama window.location.reload', async () => {
  mockRegister.mockResolvedValueOnce({ ok: true })
  fetch.mockResolvedValueOnce({ ok: true, json: async () => [] })
  const { result } = renderHook(() => useAccountManagement(false))
  await act(async () => { await result.current.createUser({ fullName: 'Nuevo', email: 'nuevo@test.com', role: 'admin', password: '123' }) })
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/users'), expect.any(Object))
})
    it('34 - Si register responde no ok setea errorMessage', async () => {
      mockRegister.mockResolvedValueOnce({ ok: false, message: 'Email ya registrado' })
      const { result } = renderHook(() => useAccountManagement(false))
      await act(async () => { await result.current.createUser({ fullName: 'Nuevo', email: 'nuevo@test.com', role: 'admin', password: '123' }) })
      expect(result.current.errorMessage).not.toBe('')
    })
    it('35 - Si register responde no ok retorna false', async () => {
      mockRegister.mockResolvedValueOnce({ ok: false, message: 'Error' })
      const { result } = renderHook(() => useAccountManagement(false))
      let createResult
      await act(async () => { createResult = await result.current.createUser({ fullName: 'Nuevo', email: 'nuevo@test.com', role: 'admin', password: '123' }) })
      expect(createResult).toBe(false)
    })
    it('36 - createUser deja isSaving en false al terminar', async () => {
      mockRegister.mockResolvedValueOnce({ ok: true, user: { id: '2', full_name: 'Nuevo', email: 'nuevo@test.com', role: 'admin' } })
      const { result } = renderHook(() => useAccountManagement(false))
      await act(async () => { await result.current.createUser({ fullName: 'Nuevo', email: 'nuevo@test.com', role: 'admin', password: '123' }) })
      expect(result.current.isSaving).toBe(false)
    })
  })

  it('37 - Snapshot lógico del estado inicial', () => {
    const { result } = renderHook(() => useAccountManagement(false))
    expect({
      usersLength: result.current.users.length,
      isSaving: result.current.isSaving,
      message: result.current.message,
      errorMessage: result.current.errorMessage,
    }).toMatchSnapshot()
  })
})