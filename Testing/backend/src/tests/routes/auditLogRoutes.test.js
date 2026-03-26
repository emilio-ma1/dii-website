import express from 'express'
import request from 'supertest'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../controllers/auditLogController', () => ({
  getAuditLogs: vi.fn((req, res) => {
    res.status(200).json([
      { id: 1, action: 'CREATE', entity_type: 'users' }
    ])
  }),
}))

vi.mock('../../middlewares/authMiddleware', () => ({
  verifyToken: vi.fn((req, res, next) => next()),
  verifyAdmin: vi.fn((req, res, next) => next()),
}))

const auditLogRoutes = require('../../routes/auditLogRoutes')
const auditLogController = require('../../controllers/auditLogController')
const authMiddleware = require('../../middlewares/authMiddleware')

function createTestApp() {
  const app = express()
  app.use(express.json())
  app.use('/api/audit-logs', auditLogRoutes)
  return app
}

describe('auditLogRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/audit-logs', () => {
    it('01 - Ejecuta verifyToken')
    it('02 - Ejecuta verifyAdmin')
    it('03 - Llama getAuditLogs')
    it('04 - Responde 200')
    it('05 - Retorna el payload mockeado')
  })
})