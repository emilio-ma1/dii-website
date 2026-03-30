/**
 * @file authRoutes.test.js
 * @description Route-level integration tests for /api/auth.
 * Uses supertest + real app. Mocks applied at model/service layer via vi.spyOn.
 * vi.mock() is NOT used in this stack.
 */
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest'
import { createRequire } from 'module'
import request from 'supertest'

const require = createRequire(import.meta.url)
const app           = require('../../../app')
const UserModel     = require('../../../models/userModel')
const AuditLogModel = require('../../../models/auditLogModel')
const emailService  = require('../../../services/emailService')
const pool          = require('../../../config/db')

// ─── Suite ────────────────────────────────────────────────────────────────────
describe('authRoutes — /api/auth', () => {

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ── POST /login ─────────────────────────────────────────────────────────────
  describe('POST /api/auth/login', () => {
    it('returns 206 with tempToken when credentials are valid', async () => {
      vi.spyOn(UserModel, 'getByEmail').mockResolvedValue({
        id: 1, email: 'admin@dii.cl', password_hash: '$2a$10$validhash'
      })
      const bcrypt = require('bcryptjs')
      vi.spyOn(bcrypt, 'compare').mockResolvedValue(true)
      vi.spyOn(UserModel, 'setLoginCode').mockResolvedValue()
      vi.spyOn(emailService, 'send2FACode').mockResolvedValue()

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@dii.cl', password: 'Pass123' })

      expect(res.status).toBe(206)
      expect(res.body).toHaveProperty('tempToken')
      expect(res.body.requires2FA).toBe(true)
    })

    it('returns 400 when email or password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@dii.cl' })

      expect(res.status).toBe(400)
    })

    it('returns 401 when user is not found', async () => {
      vi.spyOn(UserModel, 'getByEmail').mockResolvedValue(null)

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'ghost@dii.cl', password: 'Pass123' })

      expect(res.status).toBe(401)
    })

    it('returns 401 when password is invalid', async () => {
      vi.spyOn(UserModel, 'getByEmail').mockResolvedValue({
        id: 1, email: 'admin@dii.cl', password_hash: '$2a$10$validhash'
      })
      const bcrypt = require('bcryptjs')
      vi.spyOn(bcrypt, 'compare').mockResolvedValue(false)

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@dii.cl', password: 'wrong' })

      expect(res.status).toBe(401)
    })

    it('returns 500 when model throws', async () => {
      vi.spyOn(UserModel, 'getByEmail').mockRejectedValue(new Error('DB error'))

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@dii.cl', password: 'Pass123' })

      expect(res.status).toBe(500)
    })
  })

  // ── POST /verify-2fa ────────────────────────────────────────────────────────
  describe('POST /api/auth/verify-2fa', () => {
    it('returns 400 when tempToken or code is missing', async () => {
      const res = await request(app)
        .post('/api/auth/verify-2fa')
        .send({ code: '123456' })

      expect(res.status).toBe(400)
    })

    it('returns 401 when tempToken is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/verify-2fa')
        .send({ tempToken: 'invalid-token', code: '123456' })

      expect(res.status).toBe(401)
    })

    it('returns 401 when code is wrong', async () => {
      const jwt = require('jsonwebtoken')
      const tempToken = jwt.sign({ id: 1 }, process.env.JWT_TEMP_SECRET, { expiresIn: '10m' })

      vi.spyOn(UserModel, 'getLoginCode').mockResolvedValue({
        login_code: '999999',
        login_code_expires_at: new Date(Date.now() + 60000)
      })

      const res = await request(app)
        .post('/api/auth/verify-2fa')
        .send({ tempToken, code: '000000' })

      expect(res.status).toBe(401)
    })

    it('returns 200 with final token when code is valid', async () => {
      const jwt = require('jsonwebtoken')
      const tempToken = jwt.sign({ id: 1 }, process.env.JWT_TEMP_SECRET, { expiresIn: '10m' })
      const validCode = '123456'

      vi.spyOn(UserModel, 'getLoginCode').mockResolvedValue({
        login_code: validCode,
        login_code_expires_at: new Date(Date.now() + 60000)
      })
      vi.spyOn(UserModel, 'clearLoginCode').mockResolvedValue()
      vi.spyOn(UserModel, 'getFullProfile').mockResolvedValue({
        id: 1, email: 'admin@dii.cl', role: 'admin', full_name: 'Admin DII'
      })
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue()

      const res = await request(app)
        .post('/api/auth/verify-2fa')
        .send({ tempToken, code: validCode })

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('token')
    })
  })

  // ── POST /forgot-password ───────────────────────────────────────────────────
  describe('POST /api/auth/forgot-password', () => {
    it('returns 400 when email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({})

      expect(res.status).toBe(400)
    })

    it('returns 200 even when email is not registered (anti-enumeration)', async () => {
      vi.spyOn(UserModel, 'getByEmail').mockResolvedValue(null)

      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'ghost@dii.cl' })

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('Si el correo existe, recibirás instrucciones.')
    })

    it('returns 200 and sends reset email when email exists', async () => {
      vi.spyOn(UserModel, 'getByEmail').mockResolvedValue({ id: 1, email: 'admin@dii.cl' })
      vi.spyOn(UserModel, 'setResetToken').mockResolvedValue()
      vi.spyOn(emailService, 'sendPasswordResetEmail').mockResolvedValue()
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue()

      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'admin@dii.cl' })

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('Si el correo existe, recibirás instrucciones.')
    })

    it('returns 500 when model throws', async () => {
      vi.spyOn(UserModel, 'getByEmail').mockRejectedValue(new Error('DB error'))

      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'admin@dii.cl' })

      expect(res.status).toBe(500)
    })
  })

  // ── POST /reset-password/:token ─────────────────────────────────────────────
  describe('POST /api/auth/reset-password/:token', () => {
    it('returns 400 when newPassword is missing', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password/some-token')
        .send({})

      expect(res.status).toBe(400)
    })

    it('returns 400 when newPassword is shorter than 8 characters', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password/some-token')
        .send({ newPassword: 'short' })

      expect(res.status).toBe(400)
    })

    it('returns 400 when reset token is invalid or expired', async () => {
      vi.spyOn(UserModel, 'getByResetToken').mockResolvedValue(null)

      const res = await request(app)
        .post('/api/auth/reset-password/expired-token')
        .send({ newPassword: 'NewPass123' })

      expect(res.status).toBe(400)
    })

    it('returns 400 when token exists but is expired', async () => {
      vi.spyOn(UserModel, 'getByResetToken').mockResolvedValue({
        id: 1,
        reset_token_expires_at: new Date(Date.now() - 1000) // already expired
      })

      const res = await request(app)
        .post('/api/auth/reset-password/expired-token')
        .send({ newPassword: 'NewPass123' })

      expect(res.status).toBe(400)
    })

    it('returns 200 when token is valid and password is reset', async () => {
      vi.spyOn(UserModel, 'getByResetToken').mockResolvedValue({
        id: 1,
        reset_token_expires_at: new Date(Date.now() + 60000)
      })
      vi.spyOn(UserModel, 'updatePasswordAndClearToken').mockResolvedValue()
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue()

      const res = await request(app)
        .post('/api/auth/reset-password/valid-token')
        .send({ newPassword: 'NewPass123' })

      expect(res.status).toBe(200)
    })

    it('returns 500 when model throws', async () => {
      vi.spyOn(UserModel, 'getByResetToken').mockRejectedValue(new Error('DB error'))

      const res = await request(app)
        .post('/api/auth/reset-password/some-token')
        .send({ newPassword: 'NewPass123' })

      expect(res.status).toBe(500)
    })
  })

  // ── POST /api/auth/register ──────────────────────────────────────────
describe('POST /api/auth/register', () => {
  const jwt = require('jsonwebtoken')

  const getToken = (role = 'admin') =>
    jwt.sign(
      { id: 99, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('Authorization', `Bearer ${getToken()}`)
      .send({ email: 'new@dii.cl' })

    expect(res.status).toBe(400)
  })

  it('returns 409 when email is already registered', async () => {
    const mockClient = {
      query: vi.fn()
        .mockResolvedValueOnce() // BEGIN
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }), // email exists
      release: vi.fn()
    }

    vi.spyOn(pool, 'connect').mockResolvedValue(mockClient)

    const res = await request(app)
      .post('/api/auth/register')
      .set('Authorization', `Bearer ${getToken()}`)
      .send({
        full_name: 'Test',
        email: 'existing@dii.cl',
        password: 'Pass123'
      })

    expect(res.status).toBe(409)
  })

  it('returns 201 when user is created successfully', async () => {
    const newUser = {
      id: 10,
      full_name: 'New User',
      email: 'new@dii.cl',
      role: 'teacher'
    }

    const mockClient = {
      query: vi.fn()
        .mockResolvedValueOnce() // BEGIN
        .mockResolvedValueOnce({ rows: [] }) // email not exists
        .mockResolvedValueOnce({ rows: [newUser] }) // insert
        .mockResolvedValueOnce(), // COMMIT
      release: vi.fn()
    }

    vi.spyOn(pool, 'connect').mockResolvedValue(mockClient)
    vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue()

    const res = await request(app)
      .post('/api/auth/register')
      .set('Authorization', `Bearer ${getToken()}`)
      .send({
        full_name: 'New User',
        email: 'new@dii.cl',
        password: 'Pass123'
      })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('user')
  })

  it('returns 401 when token is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        full_name: 'X',
        email: 'x@dii.cl',
        password: 'Pass123'
      })

    expect(res.status).toBe(401)
  })

  it('returns 403 when user is not admin', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('Authorization', `Bearer ${getToken('user')}`)
      .send({
        full_name: 'X',
        email: 'x@dii.cl',
        password: 'Pass123'
      })

    expect(res.status).toBe(403)
  })
})

  // ── 404 fallback ─────────────────────────────────────────────────────────────
  describe('404 fallback', () => {
    it('returns 404 for an unknown auth sub-route', async () => {
      const res = await request(app).post('/api/auth/nonexistent')
      expect(res.status).toBe(404)
    })
  })
})