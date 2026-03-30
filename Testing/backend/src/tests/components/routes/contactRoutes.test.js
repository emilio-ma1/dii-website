/**
 * @file contactRoutes.test.js
 * @description Route-level integration tests for /api/contacts.
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
const ContactModel = require('../../../models/contactModel')

describe('contactRoutes — /api/contacts', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ======================
  // GET /api/contacts - Public
  // ======================
  it('01-03 - getContacts + 200 + sin middlewares', async () => {
    vi.spyOn(ContactModel, 'getAll').mockResolvedValue([
      { id: 1, initials: 'JD', fullName: 'John Doe', role: 'Director' },
      { id: 2, initials: 'JS', fullName: 'Jane Smith', role: 'Secretary' },
      { id: 3, initials: 'BJ', fullName: 'Bob Johnson', role: 'Coordinator' }
    ])

    const res = await request(app).get('/api/contacts')

    expect(res.status).toBe(200)
    expect(res.body).toBeInstanceOf(Array)
    expect(res.body.length).toBe(3)
    expect(res.body[0]).toHaveProperty('fullName')
    expect(res.body[0]).toHaveProperty('role')
  })
})