/**
 * @file categoryRoutes.test.js
 * @description Route-level integration tests for /api/categories.
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
const CategoryModel = require('../../../models/categoryModel')

describe('categoryRoutes — /api/categories', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ======================
  // GET /api/categories - Public
  // ======================
  it('01-03 - getAllCategories + 200 + sin middlewares', async () => {
    vi.spyOn(CategoryModel, 'getAll').mockResolvedValue([
      { id: 1, name: 'Research Line A', description: 'Description A' },
      { id: 2, name: 'Research Line B', description: 'Description B' },
      { id: 3, name: 'Research Line C', description: 'Description C' }
    ])

    const res = await request(app).get('/api/categories')

    expect(res.status).toBe(200)
    expect(res.body).toBeInstanceOf(Array)
    expect(res.body.length).toBe(3)
    expect(res.body[0]).toHaveProperty('id')
    expect(res.body[0]).toHaveProperty('name')
    expect(res.body[0]).toHaveProperty('description')
  })

  // ======================
  // GET /api/categories - Empty result
  // ======================
  it('04-06 - getAllCategories + 200 + empty array', async () => {
    vi.spyOn(CategoryModel, 'getAll').mockResolvedValue([])

    const res = await request(app).get('/api/categories')

    expect(res.status).toBe(200)
    expect(res.body).toBeInstanceOf(Array)
    expect(res.body.length).toBe(0)
  })
})