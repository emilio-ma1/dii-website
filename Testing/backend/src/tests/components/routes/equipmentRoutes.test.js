/**
 * @file equipmentRoutes.test.js
 * @description Route-level integration tests for /api/equipment.
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
const EquipmentModel = require('../../../models/equipmentModel')

describe('equipmentRoutes — /api/equipment', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ======================
  // GET /api/equipment - Public
  // ======================
  it('01-03 - getEquipment + 200 + sin middlewares', async () => {
    vi.spyOn(EquipmentModel, 'getAll').mockResolvedValue([
      { id: 1, name: 'Microscope A', description: 'High power microscope' },
      { id: 2, name: 'Centrifuge B', description: 'Lab centrifuge' }
    ])

    const res = await request(app).get('/api/equipment')

    expect(res.status).toBe(200)
    expect(res.body).toBeInstanceOf(Array)
    expect(res.body.length).toBe(2)
  })

  // ======================
  // GET /api/equipment/:id/image - Public
  // ======================
  it('04-06 - getEquipmentImage + 200 + sin middlewares', async () => {
    vi.spyOn(EquipmentModel, 'getImage').mockResolvedValue({
      image_data: Buffer.from('mock-image'),
      image_mimetype: 'image/jpeg'
    })

    const res = await request(app).get('/api/equipment/1/image')

    expect(res.status).toBe(200)
  })
})