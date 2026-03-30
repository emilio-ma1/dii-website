/**
 * @file userRoutes.test.js
 * @description Route-level integration tests for /api/users.
 * Uses supertest + real app. Mocks applied at model layer via vi.spyOn.
 * Loads .env first, then mocks middlewares before app loads.
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { createRequire } from 'module'
import request from 'supertest'

const require = createRequire(import.meta.url)

// Load .env FIRST to provide JWT_SECRET and other env vars
require('dotenv').config()

// Mock middlewares BEFORE requiring app
const authMiddleware = require('../../../middlewares/authMiddleware')
vi.spyOn(authMiddleware, 'verifyToken').mockImplementation((req, res, next) => {
  req.user = { id: 1, email: 'test@test.com' }
  next()
})
vi.spyOn(authMiddleware, 'verifyAdmin').mockImplementation((req, res, next) => {
  next()
})

// NOW require app (which requires middleware with dotenv already loaded)
const app = require('../../../app')

// Also require models for spyOn
const UserModel = require('../../../models/userModel')
const AuditLogModel = require('../../../models/auditLogModel')

describe('userRoutes — /api/users', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ======================
  // GET /api/users/me
  // ======================
  it('01-04 - getCurrentUserProfile + 200 + con verifyToken', async () => {
    vi.spyOn(UserModel, 'getFullProfile').mockResolvedValue({
      id: 1, email: 'test@test.com', full_name: 'Test User', role: 'admin'
    })

    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer token')

    expect(res.status).toBe(200)
  })

  // ======================
  // GET /api/users/me/image
  // ======================
  it('05-08 - getProfileImage + 200 + con verifyToken', async () => {
    vi.spyOn(UserModel, 'getProfileImage').mockResolvedValue({
      image_data: Buffer.from('mock-image'),
      image_mimetype: 'image/jpeg'
    })

    const res = await request(app)
      .get('/api/users/me/image')
      .set('Authorization', 'Bearer token')

    expect(res.status).toBe(200)
  })

  // ======================
  // GET /api/users/authors
  // ======================
  it('09-12 - getAuthorsList + 200 + con verifyToken', async () => {
    vi.spyOn(UserModel, 'getAuthors').mockResolvedValue([
      { id: 1, full_name: 'Author 1' },
      { id: 2, full_name: 'Author 2' }
    ])

    const res = await request(app)
      .get('/api/users/authors')
      .set('Authorization', 'Bearer token')

    expect(res.status).toBe(200)
  })

  // ======================
  // GET /api/users - Admin only
  // ======================
  it('13-16 - getAllUsers + 200 + con verifyAdmin', async () => {
    vi.spyOn(UserModel, 'getAll').mockResolvedValue([
      { id: 1, email: 'user1@test.com', role: 'admin' },
      { id: 2, email: 'user2@test.com', role: 'user' }
    ])

    const res = await request(app)
      .get('/api/users')
      .set('Authorization', 'Bearer token')

    expect(res.status).toBe(200)
  })

  // ======================
  // GET /api/users/role/:roleName - Admin only
  // ======================
  it('17-20 - getUsersByRole + 200 + con verifyAdmin', async () => {
    vi.spyOn(UserModel, 'getByRole').mockResolvedValue([
      { id: 1, email: 'admin@test.com', role: 'admin' }
    ])

    const res = await request(app)
      .get('/api/users/role/admin')
      .set('Authorization', 'Bearer token')

    expect(res.status).toBe(200)
  })

  // ======================
  // GET /api/users/:id/image - Public
  // ======================
  it('21-23 - getProfileImage by ID + 200 + sin middlewares', async () => {
    vi.spyOn(UserModel, 'getProfileImage').mockResolvedValue({
      image_data: Buffer.from('mock-image'),
      image_mimetype: 'image/jpeg'
    })

    const res = await request(app).get('/api/users/1/image')

    expect(res.status).toBe(200)
  })

  // ======================
  // PUT /api/users/:id - Admin only
  // ======================
  it('24-27 - updateUser + 200 + con verifyAdmin', async () => {
    vi.spyOn(UserModel, 'updateById').mockResolvedValue({
      id: 1, email: 'updated@test.com', role: 'admin'
    })
    vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue()

    const res = await request(app)
      .put('/api/users/1')
      .set('Authorization', 'Bearer token')
      .send({ email: 'updated@test.com', role: 'admin' })

    expect(res.status).toBe(200)
  })

  // ======================
  // DELETE /api/users/:id - Admin only
  // ======================
  it('28-31 - deleteUser + 200 + con verifyAdmin', async () => {
    vi.spyOn(UserModel, 'deleteById').mockResolvedValue(true)
    vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue()

    const res = await request(app)
      .delete('/api/users/1')
      .set('Authorization', 'Bearer token')

    expect(res.status).toBe(200)
  })
})