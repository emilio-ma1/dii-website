/**
 * @file professorRoutes.test.js
 * @description Route-level integration tests for /api/professors.
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
const ProfessorModel = require('../../../models/professorModel')

describe('professorRoutes — /api/professors', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ======================
  // GET /api/professors - Public
  // ======================
  it('01-03 - getProfessors + 200 + sin middlewares', async () => {
    vi.spyOn(ProfessorModel, 'getAll').mockResolvedValue([
      { id: 1, user_id: 1, degree: 'PhD', area: 'AI' },
      { id: 2, user_id: 2, degree: 'MSc', area: 'ML' }
    ])

    const res = await request(app).get('/api/professors')

    expect(res.status).toBe(200)
    expect(res.body).toBeInstanceOf(Array)
    expect(res.body.length).toBe(2)
  })

  // ======================
  // GET /api/professors/:id/image - Public
  // ======================
  it('04-06 - getProfessorImage + 200 + sin middlewares', async () => {
    vi.spyOn(ProfessorModel, 'getImage').mockResolvedValue({
      image_data: Buffer.from('mock-image'),
      image_mimetype: 'image/jpeg'
    })

    const res = await request(app).get('/api/professors/1/image')

    expect(res.status).toBe(200)
  })
})