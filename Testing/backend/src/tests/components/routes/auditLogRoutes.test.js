/**
 * @file auditLogRoutes.test.js
 * @description Route-level integration tests for /api/audit-logs.
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
const AuditLogModel = require('../../../models/auditLogModel')

describe('auditLogRoutes — /api/audit-logs', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ======================
  // GET /api/audit-logs - Admin Protected
  // ======================
  it('01-05 - getAuditLogs + 200 + con verifyToken', async () => {
    vi.spyOn(AuditLogModel, 'getRecentLogs').mockResolvedValue([
      { id: 1, user_id: 1, action: 'CREATE', entity_type: 'projects', entity_id: 1 },
      { id: 2, user_id: 2, action: 'UPDATE', entity_type: 'users', entity_id: 2 },
      { id: 3, user_id: 1, action: 'DELETE', entity_type: 'news', entity_id: 3 }
    ])

    const res = await request(app)
      .get('/api/audit-logs')
      .set('Authorization', 'Bearer token')

    expect(res.status).toBe(200)
    expect(res.body).toBeInstanceOf(Array)
    expect(res.body.length).toBe(3)
    expect(res.body[0]).toHaveProperty('action')
    expect(res.body[0]).toHaveProperty('entity_type')
  })
})