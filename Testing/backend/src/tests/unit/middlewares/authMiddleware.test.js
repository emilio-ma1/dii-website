import { vi } from 'vitest'
import jwt from 'jsonwebtoken'

// JWT_SECRET debe estar antes de importar el middleware
process.env.JWT_SECRET = 'test-secret'

const { verifyToken, verifyAdmin } = await import('../../../middlewares/authMiddleware')

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
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('verifyToken', () => {
    it('01 - Retorna 401 si no existe authorization header', () => {
      const req = mockRequest({ headers: {} })
      const res = mockResponse()
      const next = mockNext()
      verifyToken(req, res, next)
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.any(String) })
      )
      expect(next).not.toHaveBeenCalled()
    })

    it('02 - Si el header comienza con Bearer remueve el prefijo antes de verificar', () => {
      const token = jwt.sign({ id: 1 }, 'test-secret')
      const req = mockRequest({ headers: { authorization: `Bearer ${token}` } })
      const res = mockResponse()
      const next = mockNext()
      verifyToken(req, res, next)
      expect(next).toHaveBeenCalled()
      expect(req.user).toBeDefined()
    })

    it('03 - Si el header no comienza con Bearer usa el token tal cual', () => {
      const token = jwt.sign({ id: 1 }, 'test-secret')
      const req = mockRequest({ headers: { authorization: token } })
      const res = mockResponse()
      const next = mockNext()
      verifyToken(req, res, next)
      expect(next).toHaveBeenCalled()
      expect(req.user).toBeDefined()
    })

    it('04 - Si el token es válido asigna req.user', () => {
      const payload = { id: 42, role: 'user' }
      const token = jwt.sign(payload, 'test-secret')
      const req = mockRequest({ headers: { authorization: `Bearer ${token}` } })
      const res = mockResponse()
      const next = mockNext()
      verifyToken(req, res, next)
      expect(req.user).toMatchObject(payload)
    })

    it('05 - Si el token es válido llama next()', () => {
      const token = jwt.sign({ id: 1 }, 'test-secret')
      const req = mockRequest({ headers: { authorization: `Bearer ${token}` } })
      const res = mockResponse()
      const next = mockNext()
      verifyToken(req, res, next)
      expect(next).toHaveBeenCalledOnce()
    })

    it('06 - Retorna 401 si jwt.verify lanza error', () => {
      const req = mockRequest({ headers: { authorization: 'Bearer token-invalido' } })
      const res = mockResponse()
      const next = mockNext()
      verifyToken(req, res, next)
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.any(String) })
      )
      expect(next).not.toHaveBeenCalled()
    })

    it('07 - Hace console.error cuando jwt.verify falla', () => {
      const req = mockRequest({ headers: { authorization: 'Bearer token-invalido' } })
      const res = mockResponse()
      const next = mockNext()
      verifyToken(req, res, next)
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('verifyAdmin', () => {
    it('08 - Si req.user.role es admin llama next()', () => {
      const req = mockRequest({ user: { id: 1, role: 'admin' } })
      const res = mockResponse()
      const next = mockNext()
      verifyAdmin(req, res, next)
      expect(next).toHaveBeenCalledOnce()
    })

    it('09 - Si req.user no existe retorna 403', () => {
      const req = mockRequest({ user: null })
      const res = mockResponse()
      const next = mockNext()
      verifyAdmin(req, res, next)
      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.any(String) })
      )
      expect(next).not.toHaveBeenCalled()
    })

    it('10 - Si req.user.role no es admin retorna 403', () => {
      const req = mockRequest({ user: { id: 1, role: 'user' } })
      const res = mockResponse()
      const next = mockNext()
      verifyAdmin(req, res, next)
      expect(res.status).toHaveBeenCalledWith(403)
      expect(next).not.toHaveBeenCalled()
    })

    it('11 - Hace console.warn cuando el acceso admin es denegado', () => {
      const req = mockRequest({ user: { id: 99, role: 'user' } })
      const res = mockResponse()
      const next = mockNext()
      verifyAdmin(req, res, next)
      expect(console.warn).toHaveBeenCalled()
    })
  })
})