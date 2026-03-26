import { describe, it, expect, vi, beforeEach } from 'vitest'

process.env.JWT_SECRET = 'test-secret'

vi.mock('jsonwebtoken', () => ({
  verify: vi.fn(),
}))

const jwt = require('jsonwebtoken')
const { verifyToken, verifyAdmin } = require('../../middlewares/authMiddleware')

function mockRequest({ headers = {}, user = null } = {}) {
  return { headers, user }
}

function mockResponse() {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

function mockNext() {
  return vi.fn()
}

describe('authMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  describe('verifyToken', () => {
    it('01 - Retorna 401 si no existe authorization header')
    it('02 - Si el header comienza con Bearer remueve el prefijo antes de verificar')
    it('03 - Si el header no comienza con Bearer usa el token tal cual')
    it('04 - Si el token es válido asigna req.user')
    it('05 - Si el token es válido llama next()')
    it('06 - Retorna 401 si jwt.verify lanza error')
    it('07 - Hace console.error cuando jwt.verify falla')
  })

  describe('verifyAdmin', () => {
    it('08 - Si req.user.role es admin llama next()')
    it('09 - Si req.user no existe retorna 403')
    it('10 - Si req.user.role no es admin retorna 403')
    it('11 - Hace console.warn cuando el acceso admin es denegado')
  })
})