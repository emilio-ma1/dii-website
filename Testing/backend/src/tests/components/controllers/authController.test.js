// src/tests/components/controllers/authController.test.js
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

// ─── Obtener referencias CJS reales (mismo slot en require.cache) ─────────────
const UserModel     = require('../../../models/userModel')
const AuditLogModel = require('../../../models/auditLogModel')
const emailService  = require('../../../services/emailService')
const bcrypt        = require('bcryptjs')
const jwt           = require('jsonwebtoken')

// ─── pool prototype patch (para register() que usa pool.connect()) ────────────
const pool = require('../../../config/db')
let proto = pool
for (let i = 0; i < 2; i++) proto = Object.getPrototypeOf(proto)
proto.connect = vi.fn()

const mockClient = { query: vi.fn(), release: vi.fn() }

// ─── Controller (se importa después — sus require() ya están en cache) ────────
const { login, verify2FA, register, forgotPassword, resetPassword } =
  require('../../../controllers/authController')

// ─── Helpers ──────────────────────────────────────────────────────────────────
const mockReq = (body = {}, params = {}, user = null) => ({ body, params, user, ip: '127.0.0.1' })
const mockRes = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json   = vi.fn().mockReturnValue(res)
  return res
}

// =============================================================================
describe('authController', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    proto.connect.mockResolvedValue(mockClient)
    mockClient.query.mockResolvedValue({ rows: [] })
    mockClient.release.mockResolvedValue()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('login', () => {

    it('01 - Retorna 400 si faltan email o password', async () => {
      const req = mockReq({ email: '', password: '' })
      const res = mockRes()
      await login(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }))
    })

    it('02 - Retorna 400 si falta email', async () => {
      const req = mockReq({ password: 'abc123' })
      const res = mockRes()
      await login(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('03 - Retorna 400 si falta password', async () => {
      const req = mockReq({ email: 'a@b.com' })
      const res = mockRes()
      await login(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('04 - Retorna 401 si el usuario no existe', async () => {
      vi.spyOn(UserModel, 'getByEmail').mockResolvedValue(null)
      const req = mockReq({ email: 'x@x.com', password: '123456' })
      const res = mockRes()
      await login(req, res)
      expect(res.status).toHaveBeenCalledWith(401)
    })

    it('05 - Retorna 401 si la contraseña es inválida', async () => {
      vi.spyOn(UserModel, 'getByEmail').mockResolvedValue({ id: 1, email: 'a@b.com', password_hash: 'hash' })
      vi.spyOn(bcrypt, 'compare').mockResolvedValue(false)
      const req = mockReq({ email: 'a@b.com', password: 'wrong' })
      const res = mockRes()
      await login(req, res)
      expect(res.status).toHaveBeenCalledWith(401)
    })

    it('06 - Retorna 206 con tempToken si las credenciales son válidas', async () => {
      vi.spyOn(UserModel, 'getByEmail').mockResolvedValue({ id: 1, email: 'a@b.com', password_hash: 'hash' })
      vi.spyOn(bcrypt, 'compare').mockResolvedValue(true)
      vi.spyOn(UserModel, 'setLoginCode').mockResolvedValue(true)
      vi.spyOn(emailService, 'send2FACode').mockResolvedValue(true)
      vi.spyOn(jwt, 'sign').mockReturnValue('temp-token-mock')
      const req = mockReq({ email: 'a@b.com', password: 'correct' })
      const res = mockRes()
      await login(req, res)
      expect(res.status).toHaveBeenCalledWith(206)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        requires2FA: true,
        tempToken: 'temp-token-mock'
      }))
    })

    it('07 - Llama a setLoginCode con el userId correcto', async () => {
      vi.spyOn(UserModel, 'getByEmail').mockResolvedValue({ id: 42, email: 'a@b.com', password_hash: 'hash' })
      vi.spyOn(bcrypt, 'compare').mockResolvedValue(true)
      const setLoginCode = vi.spyOn(UserModel, 'setLoginCode').mockResolvedValue(true)
      vi.spyOn(emailService, 'send2FACode').mockResolvedValue(true)
      vi.spyOn(jwt, 'sign').mockReturnValue('tok')
      const req = mockReq({ email: 'a@b.com', password: 'p' })
      const res = mockRes()
      await login(req, res)
      expect(setLoginCode).toHaveBeenCalledWith(42, expect.any(String), expect.any(Date))
    })

    it('08 - Retorna 500 si UserModel.getByEmail lanza error', async () => {
      vi.spyOn(UserModel, 'getByEmail').mockRejectedValue(new Error('db error'))
      const req = mockReq({ email: 'a@b.com', password: '123' })
      const res = mockRes()
      await login(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('verify2FA', () => {

    it('09 - Retorna 400 si faltan tempToken o code', async () => {
      const req = mockReq({})
      const res = mockRes()
      await verify2FA(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('10 - Retorna 401 si el tempToken es inválido', async () => {
      vi.spyOn(jwt, 'verify').mockImplementation(() => { throw new Error('invalid') })
      const req = mockReq({ tempToken: 'bad', code: '123456' })
      const res = mockRes()
      await verify2FA(req, res)
      expect(res.status).toHaveBeenCalledWith(401)
    })

    it('11 - Retorna 401 si el código no existe en DB', async () => {
      vi.spyOn(jwt, 'verify').mockReturnValue({ id: 1 })
      vi.spyOn(UserModel, 'getLoginCode').mockResolvedValue(null)
      const req = mockReq({ tempToken: 'tok', code: '123456' })
      const res = mockRes()
      await verify2FA(req, res)
      expect(res.status).toHaveBeenCalledWith(401)
    })

    it('12 - Retorna 401 si el código no coincide', async () => {
      vi.spyOn(jwt, 'verify').mockReturnValue({ id: 1 })
      vi.spyOn(UserModel, 'getLoginCode').mockResolvedValue({
        login_code: '999999',
        login_code_expires_at: new Date(Date.now() + 60000)
      })
      const req = mockReq({ tempToken: 'tok', code: '123456' })
      const res = mockRes()
      await verify2FA(req, res)
      expect(res.status).toHaveBeenCalledWith(401)
    })

    it('13 - Retorna 401 si el código está expirado', async () => {
      vi.spyOn(jwt, 'verify').mockReturnValue({ id: 1 })
      vi.spyOn(UserModel, 'getLoginCode').mockResolvedValue({
        login_code: '123456',
        login_code_expires_at: new Date(Date.now() - 60000)
      })
      const req = mockReq({ tempToken: 'tok', code: '123456' })
      const res = mockRes()
      await verify2FA(req, res)
      expect(res.status).toHaveBeenCalledWith(401)
    })

    it('14 - Retorna 200 con token y user si el código es válido', async () => {
      vi.spyOn(jwt, 'verify').mockReturnValue({ id: 1 })
      vi.spyOn(UserModel, 'getLoginCode').mockResolvedValue({
        login_code: '123456',
        login_code_expires_at: new Date(Date.now() + 60000)
      })
      vi.spyOn(UserModel, 'clearLoginCode').mockResolvedValue(true)
      vi.spyOn(UserModel, 'getFullProfile').mockResolvedValue({
        id: 1, email: 'a@b.com', role: 'teacher', full_name: 'Test User'
      })
      vi.spyOn(jwt, 'sign').mockReturnValue('final-token')
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ tempToken: 'tok', code: '123456' })
      const res = mockRes()
      await verify2FA(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'final-token' }))
    })

    it('15 - Llama a clearLoginCode tras verificación exitosa', async () => {
      vi.spyOn(jwt, 'verify').mockReturnValue({ id: 5 })
      vi.spyOn(UserModel, 'getLoginCode').mockResolvedValue({
        login_code: '654321',
        login_code_expires_at: new Date(Date.now() + 60000)
      })
      const clearLoginCode = vi.spyOn(UserModel, 'clearLoginCode').mockResolvedValue(true)
      vi.spyOn(UserModel, 'getFullProfile').mockResolvedValue({ id: 5, email: 'b@b.com', role: 'admin', full_name: 'Admin' })
      vi.spyOn(jwt, 'sign').mockReturnValue('tok')
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ tempToken: 'tok', code: '654321' })
      const res = mockRes()
      await verify2FA(req, res)
      expect(clearLoginCode).toHaveBeenCalledWith(5)
    })

    it('16 - Llama a AuditLogModel.logAction con LOGIN_2FA', async () => {
      vi.spyOn(jwt, 'verify').mockReturnValue({ id: 7 })
      vi.spyOn(UserModel, 'getLoginCode').mockResolvedValue({
        login_code: '111111',
        login_code_expires_at: new Date(Date.now() + 60000)
      })
      vi.spyOn(UserModel, 'clearLoginCode').mockResolvedValue(true)
      vi.spyOn(UserModel, 'getFullProfile').mockResolvedValue({ id: 7, email: 'c@c.com', role: 'teacher', full_name: 'C' })
      vi.spyOn(jwt, 'sign').mockReturnValue('tok')
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ tempToken: 'tok', code: '111111' })
      const res = mockRes()
      await verify2FA(req, res)
      expect(logAction).toHaveBeenCalledWith(7, 'LOGIN_2FA', 'users', 7, expect.any(Object))
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('register', () => {

    it('17 - Retorna 400 si faltan campos obligatorios', async () => {
      const req = mockReq({ email: 'a@b.com' })
      const res = mockRes()
      await register(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('18 - Retorna 409 si el email ya está registrado', async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ id: 1 }] })
      const req = mockReq({ full_name: 'Test', email: 'a@b.com', password: 'pass123' })
      const res = mockRes()
      await register(req, res)
      expect(res.status).toHaveBeenCalledWith(409)
    })

    it('19 - Retorna 201 y el nuevo usuario si el registro es exitoso', async () => {
      const newUser = { id: 10, full_name: 'Test', email: 'new@b.com', role: 'teacher' }
      mockClient.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [newUser] })
        .mockResolvedValueOnce({ rows: [] })
      vi.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt')
      vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashed')
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ full_name: 'Test', email: 'new@b.com', password: 'pass123' })
      const res = mockRes()
      await register(req, res)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ user: newUser }))
    })

    it('20 - Asigna role "teacher" por defecto si no se especifica', async () => {
      const newUser = { id: 11, full_name: 'T', email: 'x@x.com', role: 'teacher' }
      mockClient.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [newUser] })
        .mockResolvedValueOnce({ rows: [] })
      vi.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt')
      vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashed')
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ full_name: 'T', email: 'x@x.com', password: 'pass' })
      const res = mockRes()
      await register(req, res)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        user: expect.objectContaining({ role: 'teacher' })
      }))
    })

    it('21 - Llama a client.release() incluso si hay error', async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [] })
        .mockRejectedValueOnce(new Error('db crash'))
      const req = mockReq({ full_name: 'T', email: 'x@x.com', password: 'pass' })
      const res = mockRes()
      await register(req, res)
      expect(mockClient.release).toHaveBeenCalled()
    })

    it('22 - Retorna 500 si la transacción falla', async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [] })
        .mockRejectedValueOnce(new Error('db crash'))
      const req = mockReq({ full_name: 'T', email: 'x@x.com', password: 'pass' })
      const res = mockRes()
      await register(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
    })

    it('23 - Llama a AuditLogModel.logAction con CREATE tras registro exitoso', async () => {
      const newUser = { id: 20, full_name: 'Audit', email: 'audit@b.com', role: 'teacher' }
      mockClient.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [newUser] })
        .mockResolvedValueOnce({ rows: [] })
      vi.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt')
      vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashed')
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ full_name: 'Audit', email: 'audit@b.com', password: 'pass' })
      const res = mockRes()
      await register(req, res)
      expect(logAction).toHaveBeenCalledWith(
        newUser.id, 'CREATE', 'users', newUser.id, expect.any(Object)
      )
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('forgotPassword', () => {

    it('24 - Retorna 400 si falta email', async () => {
      const req = mockReq({})
      const res = mockRes()
      await forgotPassword(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('25 - Retorna 200 aunque el email no exista (anti-enumeración)', async () => {
      vi.spyOn(UserModel, 'getByEmail').mockResolvedValue(null)
      const req = mockReq({ email: 'noexiste@b.com' })
      const res = mockRes()
      await forgotPassword(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('26 - Retorna 200 y envía email si el usuario existe', async () => {
      vi.spyOn(UserModel, 'getByEmail').mockResolvedValue({ id: 1, email: 'a@b.com' })
      vi.spyOn(UserModel, 'setResetToken').mockResolvedValue(true)
      vi.spyOn(emailService, 'sendPasswordResetEmail').mockResolvedValue(true)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ email: 'a@b.com' })
      const res = mockRes()
      await forgotPassword(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith('a@b.com', expect.any(String))
    })

    it('27 - Llama a AuditLogModel.logAction con PASSWORD_RESET_REQUESTED', async () => {
      vi.spyOn(UserModel, 'getByEmail').mockResolvedValue({ id: 3, email: 'c@c.com' })
      vi.spyOn(UserModel, 'setResetToken').mockResolvedValue(true)
      vi.spyOn(emailService, 'sendPasswordResetEmail').mockResolvedValue(true)
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ email: 'c@c.com' })
      const res = mockRes()
      await forgotPassword(req, res)
      expect(logAction).toHaveBeenCalledWith(3, 'PASSWORD_RESET_REQUESTED', 'users', 3, expect.any(Object))
    })

    it('28 - Retorna 500 si ocurre un error interno', async () => {
      vi.spyOn(UserModel, 'getByEmail').mockRejectedValue(new Error('db error'))
      const req = mockReq({ email: 'a@b.com' })
      const res = mockRes()
      await forgotPassword(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('resetPassword', () => {

    it('29 - Retorna 400 si falta token o newPassword', async () => {
      const req = mockReq({}, {})
      const res = mockRes()
      await resetPassword(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('30 - Retorna 400 si newPassword tiene menos de 8 caracteres', async () => {
      const req = mockReq({ newPassword: 'short' }, { token: 'abc' })
      const res = mockRes()
      await resetPassword(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('31 - Retorna 400 si el token no existe en DB', async () => {
      vi.spyOn(UserModel, 'getByResetToken').mockResolvedValue(null)
      const req = mockReq({ newPassword: 'newpass123' }, { token: 'invalid-token' })
      const res = mockRes()
      await resetPassword(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('32 - Retorna 400 si el token está expirado', async () => {
      vi.spyOn(UserModel, 'getByResetToken').mockResolvedValue({
        id: 1,
        reset_token_expires_at: new Date(Date.now() - 60000)
      })
      const req = mockReq({ newPassword: 'newpass123' }, { token: 'expired' })
      const res = mockRes()
      await resetPassword(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('33 - Retorna 200 si el token es válido y la contraseña se actualiza', async () => {
      vi.spyOn(UserModel, 'getByResetToken').mockResolvedValue({
        id: 1,
        reset_token_expires_at: new Date(Date.now() + 60000)
      })
      vi.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt')
      vi.spyOn(bcrypt, 'hash').mockResolvedValue('newhash')
      vi.spyOn(UserModel, 'updatePasswordAndClearToken').mockResolvedValue(true)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ newPassword: 'newpass123' }, { token: 'valid-token' })
      const res = mockRes()
      await resetPassword(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('34 - Llama a updatePasswordAndClearToken con el hash correcto', async () => {
      vi.spyOn(UserModel, 'getByResetToken').mockResolvedValue({
        id: 9,
        reset_token_expires_at: new Date(Date.now() + 60000)
      })
      vi.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt')
      vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-pw')
      const updatePw = vi.spyOn(UserModel, 'updatePasswordAndClearToken').mockResolvedValue(true)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ newPassword: 'newpass123' }, { token: 'valid' })
      const res = mockRes()
      await resetPassword(req, res)
      expect(updatePw).toHaveBeenCalledWith(9, 'hashed-pw')
    })

    it('35 - Llama a AuditLogModel.logAction con PASSWORD_RESET_COMPLETED', async () => {
      vi.spyOn(UserModel, 'getByResetToken').mockResolvedValue({
        id: 2,
        reset_token_expires_at: new Date(Date.now() + 60000)
      })
      vi.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt')
      vi.spyOn(bcrypt, 'hash').mockResolvedValue('h')
      vi.spyOn(UserModel, 'updatePasswordAndClearToken').mockResolvedValue(true)
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ newPassword: 'newpass123' }, { token: 'valid' })
      const res = mockRes()
      await resetPassword(req, res)
      expect(logAction).toHaveBeenCalledWith(2, 'PASSWORD_RESET_COMPLETED', 'users', 2, expect.any(Object))
    })

    it('36 - Retorna 500 si ocurre un error interno', async () => {
      vi.spyOn(UserModel, 'getByResetToken').mockRejectedValue(new Error('db error'))
      const req = mockReq({ newPassword: 'newpass123' }, { token: 'tok' })
      const res = mockRes()
      await resetPassword(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })
})