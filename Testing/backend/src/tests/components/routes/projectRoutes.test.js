/**
 * @file projectRoutes.test.js
 * @description Route-level integration tests for /api/projects.
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
const ProjectModel = require('../../../models/projectModel')
const AuditLogModel = require('../../../models/auditLogModel')

describe('projectRoutes — /api/projects', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ======================
  // GET /api/projects - Public
  // ======================
  it('01-03 - getAllProjects + 200 + sin middlewares', async () => {
    vi.spyOn(ProjectModel, 'getAll').mockResolvedValue([
      { id: 1, title: 'Project 1' },
      { id: 2, title: 'Project 2' }
    ])

    const res = await request(app).get('/api/projects')

    expect(res.status).toBe(200)
    expect(res.body).toBeInstanceOf(Array)
  })

  // ======================
  // GET /api/projects/panel - Protected
  // ======================
  it('04-08 - getPanelProjects + 200 + con verifyToken', async () => {
    vi.spyOn(ProjectModel, 'getByAuthorId').mockResolvedValue([
      { id: 1, title: 'My Project', author_id: 1 }
    ])

    const res = await request(app)
      .get('/api/projects/panel')
      .set('Authorization', 'Bearer token')

    expect(res.status).toBe(200)
  })

  // ======================
  // GET /api/projects/:id - Public
  // ======================
  it('09-11 - getProjectById + 200 + sin middlewares', async () => {
    vi.spyOn(ProjectModel, 'getById').mockResolvedValue({
      id: 1, title: 'Project 1', description: 'Details'
    })

    const res = await request(app).get('/api/projects/1')

    expect(res.status).toBe(200)
  })

  // ======================
  // GET /api/projects/:id/image - Public
  // ======================
  it('12-14 - getProjectImage + 200 + sin middlewares', async () => {
    vi.spyOn(ProjectModel, 'getImage').mockResolvedValue({
      image_data: Buffer.from('mock-image'),
      image_mimetype: 'image/jpeg'
    })

    const res = await request(app).get('/api/projects/1/image')

    expect(res.status).toBe(200)
  })

  // ======================
  // GET /api/projects/:id/pdf - Public
  // ======================
  it('15-17 - getProjectPdf + 200 + sin middlewares', async () => {
    vi.spyOn(ProjectModel, 'getPdf').mockResolvedValue({
      pdf_data: Buffer.from('mock-pdf'),
      pdf_mimetype: 'application/pdf'
    })

    const res = await request(app).get('/api/projects/1/pdf')

    expect(res.status).toBe(200)
  })

})