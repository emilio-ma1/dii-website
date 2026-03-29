import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { AuthProvider, useAuth } from '../../../src/auth/authContext'

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>

function createFakeJwt(expInSecondsFromNow = 3600) {
  const payload = { exp: Math.floor(Date.now() / 1000) + expInSecondsFromNow }
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return `header.${encodedPayload}.signature`
}

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

describe('authContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
    localStorageMock.clear()
    vi.stubGlobal('fetch', vi.fn())
    vi.stubGlobal('alert', vi.fn())
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    Object.defineProperty(window, 'location', { writable: true, value: { href: 'http://localhost/' } })
  })

  afterEach(() => {
    vi.useRealTimers()
    localStorageMock.clear()
  })

  describe('useAuth', () => {
    it('01 - useAuth fuera de AuthProvider lanza error', () => {
      expect(() => {
        renderHook(() => useAuth())
      }).toThrow()
    })
  })

  describe('Estado inicial sin token', () => {
    it('02 - Inicia con user null', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.user).toBeNull()
    })
    it('03 - Inicia con isAuthenticated false', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.isAuthenticated).toBe(false)
    })
    it('04 - Finaliza loading en false cuando no hay token', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.loading).toBe(false)
    })
  })

  describe('Restauración desde localStorage', () => {
    it('05 - Si hay token válido restaura user desde localStorage', async () => {
      const token = createFakeJwt(3600)
      const user = { id: 1, email: 'test@test.com', role: 'admin' }
      localStorageMock.setItem('token', token)
      localStorageMock.setItem('user', JSON.stringify(user))
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.user).toEqual(user)
    })
    it('06 - Si hay token válido deja isAuthenticated en true', async () => {
      const token = createFakeJwt(3600)
      const user = { id: 1, email: 'test@test.com', role: 'admin' }
      localStorageMock.setItem('token', token)
      localStorageMock.setItem('user', JSON.stringify(user))
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.isAuthenticated).toBe(true)
    })
    it('07 - Si hay token válido programa cierre automático por expiración', async () => {
  const token = createFakeJwt(3600)
  const user = { id: 1, email: 'test@test.com', role: 'admin' }
  localStorageMock.setItem('token', token)
  localStorageMock.setItem('user', JSON.stringify(user))
  const { result } = renderHook(() => useAuth(), { wrapper })
  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(result.current.isAuthenticated).toBe(true)
})
  })

  describe('Token expirado o inválido', () => {
    it('08 - Si el token ya expiró ejecuta logout', async () => {
      const token = createFakeJwt(-3600)
      const user = { id: 1, email: 'test@test.com', role: 'admin' }
      localStorageMock.setItem('token', token)
      localStorageMock.setItem('user', JSON.stringify(user))
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.user).toBeNull()
    })
    it('09 - Si el token es inválido limpia sesión y redirige a /login', async () => {
      localStorageMock.setItem('token', 'invalid.token.here')
      localStorageMock.setItem('user', JSON.stringify({ id: 1 }))
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.user).toBeNull()
    })
    it('10 - Si el token es inválido hace console.error', async () => {
      localStorageMock.setItem('token', 'invalid.token.here')
      localStorageMock.setItem('user', JSON.stringify({ id: 1 }))
      renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(console.error).toHaveBeenCalled())
    })
  })

  describe('login', () => {
    it('11 - login exitoso guarda token en localStorage', async () => {
      const token = createFakeJwt(3600)
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token, user: { id: 1, email: 'test@test.com' } })
      })
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      await act(async () => { await result.current.login({ email: 'test@test.com', password: '123' }) })
      expect(localStorageMock.getItem('token')).toBe(token)
    })
    it('12 - login exitoso guarda user en localStorage', async () => {
      const token = createFakeJwt(3600)
      const user = { id: 1, email: 'test@test.com' }
      fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ token, user }) })
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      await act(async () => { await result.current.login({ email: 'test@test.com', password: '123' }) })
      expect(localStorageMock.getItem('user')).toBe(JSON.stringify(user))
    })
    it('13 - login exitoso actualiza user en contexto', async () => {
      const token = createFakeJwt(3600)
      const user = { id: 1, email: 'test@test.com' }
      fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ token, user }) })
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      await act(async () => { await result.current.login({ email: 'test@test.com', password: '123' }) })
      expect(result.current.user).toEqual(user)
    })
    it('14 - login exitoso retorna { ok: true }', async () => {
      const token = createFakeJwt(3600)
      fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ token, user: { id: 1 } }) })
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      let loginResult
      await act(async () => { loginResult = await result.current.login({ email: 'test@test.com', password: '123' }) })
      expect(loginResult.ok).toBe(true)
    })
    it('15 - login con response no ok retorna ok false con message del backend', async () => {
      fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ message: 'Credenciales inválidas' }) })
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      let loginResult
      await act(async () => { loginResult = await result.current.login({ email: 'bad@test.com', password: 'wrong' }) })
      expect(loginResult.ok).toBe(false)
      expect(loginResult.message).toBe('Credenciales inválidas')
    })
    it('16 - login con error de red retorna ok false con mensaje de network', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      let loginResult
      await act(async () => { loginResult = await result.current.login({ email: 'test@test.com', password: '123' }) })
      expect(loginResult.ok).toBe(false)
    })
    it('17 - login llama fetch con POST a /api/auth/login', async () => {
      fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ message: 'error' }) })
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      await act(async () => { await result.current.login({ email: 'test@test.com', password: '123' }) })
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/auth/login'), expect.objectContaining({ method: 'POST' }))
    })
  })

  describe('register', () => {
    it('18 - register exitoso retorna ok true y user', async () => {
      const user = { id: 2, email: 'new@test.com' }
      fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ user }) })
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      let registerResult
      await act(async () => { registerResult = await result.current.register({ email: 'new@test.com', password: '123', full_name: 'New User' }) })
      expect(registerResult.ok).toBe(true)
    })
    it('19 - register envía Authorization Bearer token', async () => {
      const token = createFakeJwt(3600)
      localStorageMock.setItem('token', token)
      localStorageMock.setItem('user', JSON.stringify({ id: 1 }))
      fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ user: { id: 2 } }) })
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      await act(async () => { await result.current.register({ email: 'new@test.com', password: '123', full_name: 'New' }) })
      expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        headers: expect.objectContaining({ Authorization: expect.stringContaining('Bearer') })
      }))
    })
    it('20 - register con response no ok retorna ok false con message del backend', async () => {
      fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ message: 'Email ya registrado' }) })
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      let registerResult
      await act(async () => { registerResult = await result.current.register({ email: 'dup@test.com', password: '123', full_name: 'Dup' }) })
      expect(registerResult.ok).toBe(false)
      expect(registerResult.message).toBe('Email ya registrado')
    })
    it('21 - register con error de red retorna ok false con mensaje de network', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      let registerResult
      await act(async () => { registerResult = await result.current.register({ email: 'test@test.com', password: '123', full_name: 'Test' }) })
      expect(registerResult.ok).toBe(false)
    })
    it('22 - register llama fetch con POST a /api/auth/register', async () => {
      fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ message: 'error' }) })
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      await act(async () => { await result.current.register({ email: 'test@test.com', password: '123', full_name: 'Test' }) })
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/auth/register'), expect.objectContaining({ method: 'POST' }))
    })
  })

  describe('logout', () => {
    it('23 - logout elimina token de localStorage', async () => {
      const token = createFakeJwt(3600)
      localStorageMock.setItem('token', token)
      localStorageMock.setItem('user', JSON.stringify({ id: 1 }))
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      await act(async () => { result.current.logout() })
      expect(localStorageMock.getItem('token')).toBeNull()
    })
    it('24 - logout elimina user de localStorage', async () => {
      const token = createFakeJwt(3600)
      localStorageMock.setItem('token', token)
      localStorageMock.setItem('user', JSON.stringify({ id: 1 }))
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      await act(async () => { result.current.logout() })
      expect(localStorageMock.getItem('user')).toBeNull()
    })
    it('25 - logout deja user null', async () => {
      const token = createFakeJwt(3600)
      localStorageMock.setItem('token', token)
      localStorageMock.setItem('user', JSON.stringify({ id: 1 }))
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      await act(async () => { result.current.logout() })
      expect(result.current.user).toBeNull()
    })
    it('26 - logout redirige a /login', async () => {
      const token = createFakeJwt(3600)
      localStorageMock.setItem('token', token)
      localStorageMock.setItem('user', JSON.stringify({ id: 1 }))
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      await act(async () => { result.current.logout() })
      expect(window.location.href).toContain('/login')
    })
  })

  describe('Expiración automática', () => {
    it('27 - Al expirar el token muestra alert de sesión expirada', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
  const token = createFakeJwt(1)
  localStorageMock.setItem('token', token)
  localStorageMock.setItem('user', JSON.stringify({ id: 1 }))
  const { result } = renderHook(() => useAuth(), { wrapper })
  await act(async () => { await Promise.resolve() })
  await act(async () => { vi.advanceTimersByTime(2000) })
  expect(alert).toHaveBeenCalled()
  vi.useRealTimers()
})
    it('28 - Al expirar el token hace console.warn', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
  const token = createFakeJwt(1)
  localStorageMock.setItem('token', token)
  localStorageMock.setItem('user', JSON.stringify({ id: 1 }))
  const { result } = renderHook(() => useAuth(), { wrapper })
  await act(async () => { await Promise.resolve() })
  await act(async () => { vi.advanceTimersByTime(2000) })
  expect(console.warn).toHaveBeenCalled()
  vi.useRealTimers()
})
    it('29 - Al expirar el token ejecuta logout', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
  const token = createFakeJwt(1)
  localStorageMock.setItem('token', token)
  localStorageMock.setItem('user', JSON.stringify({ id: 1 }))
  const { result } = renderHook(() => useAuth(), { wrapper })
  await act(async () => { await Promise.resolve() })
  await act(async () => { vi.advanceTimersByTime(2000) })
  expect(result.current.user).toBeNull()
  vi.useRealTimers()
})
  })

  describe('Valor del contexto', () => {
    it('30 - Expone user, loading, isAuthenticated, login, logout y register', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current).toHaveProperty('user')
      expect(result.current).toHaveProperty('loading')
      expect(result.current).toHaveProperty('isAuthenticated')
      expect(result.current).toHaveProperty('login')
      expect(result.current).toHaveProperty('logout')
      expect(result.current).toHaveProperty('register')
    })
  })
})