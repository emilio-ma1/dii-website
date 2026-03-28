import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { AuthProvider, useAuth } from '../../auth/authContext'

const wrapper = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
)

function createFakeJwt(expInSecondsFromNow = 3600) {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + expInSecondsFromNow,
  }

  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  return `header.${encodedPayload}.signature`
}

describe('authContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
    localStorage.clear()

    vi.stubGlobal('fetch', vi.fn())
    vi.stubGlobal('alert', vi.fn())
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: 'http://localhost/' },
    })

    import.meta.env.VITE_API_URL = 'http://localhost:3000'
  })

  afterEach(() => {
    vi.useRealTimers()
    localStorage.clear()
  })

  describe('useAuth', () => {
    it('01 - useAuth fuera de AuthProvider lanza error')
  })

  describe('Estado inicial sin token', () => {
    it('02 - Inicia con user null')
    it('03 - Inicia con isAuthenticated false')
    it('04 - Finaliza loading en false cuando no hay token')
  })

  describe('Restauración desde localStorage', () => {
    it('05 - Si hay token válido restaura user desde localStorage')
    it('06 - Si hay token válido deja isAuthenticated en true')
    it('07 - Si hay token válido programa cierre automático por expiración')
  })

  describe('Token expirado o inválido', () => {
    it('08 - Si el token ya expiró ejecuta logout')
    it('09 - Si el token es inválido limpia sesión y redirige a /login')
    it('10 - Si el token es inválido hace console.error')
  })

  describe('login', () => {
    it('11 - login exitoso guarda token en localStorage')
    it('12 - login exitoso guarda user en localStorage')
    it('13 - login exitoso actualiza user en contexto')
    it('14 - login exitoso retorna { ok: true }')
    it('15 - login con response no ok retorna ok false con message del backend')
    it('16 - login con error de red retorna ok false con mensaje de network')
    it('17 - login llama fetch con POST a /api/auth/login')
  })

  describe('register', () => {
    it('18 - register exitoso retorna ok true y user')
    it('19 - register envía Authorization Bearer token')
    it('20 - register con response no ok retorna ok false con message del backend')
    it('21 - register con error de red retorna ok false con mensaje de network')
    it('22 - register llama fetch con POST a /api/auth/register')
  })

  describe('logout', () => {
    it('23 - logout elimina token de localStorage')
    it('24 - logout elimina user de localStorage')
    it('25 - logout deja user null')
    it('26 - logout redirige a /login')
  })

  describe('Expiración automática', () => {
    it('27 - Al expirar el token muestra alert de sesión expirada')
    it('28 - Al expirar el token hace console.warn')
    it('29 - Al expirar el token ejecuta logout')
  })

  describe('Valor del contexto', () => {
    it('30 - Expone user, loading, isAuthenticated, login, logout y register')
  })
})
