/**
 * @file newsRoutes.test.js
 * @description Route-level integration tests for /api/news.
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
const NewsModel = require('../../../models/newsModel')
const AuditLogModel = require('../../../models/auditLogModel')

describe('newsRoutes — /api/news', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })


  // ======================
  // GET /api/news
  // ======================
  it('01-03 - getNews + 200 + sin middlewares', async () => {
    vi.spyOn(NewsModel, 'getAll').mockResolvedValue([
      { id: 1, title: 'News 1', slug: 'news-1' }
    ])

    const res = await request(app).get('/api/news')

    expect(res.status).toBe(200)
    expect(res.body).toBeInstanceOf(Array)
  })

  // ======================
  // GET slug
  // ======================
  it('04-06 - getNewsBySlug + 200 + sin middlewares', async () => {
    vi.spyOn(NewsModel, 'getBySlug').mockResolvedValue({
      id: 1, title: 'Test News', slug: 'test', content: 'Content', image: null
    })

    const res = await request(app).get('/api/news/slug/test')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('title')
  })

  // ======================
  // GET image
  // ======================
  it('07-09 - getNewsImage + 200 + sin middlewares', async () => {
    vi.spyOn(NewsModel, 'getImage').mockResolvedValue({
      image_data: Buffer.from('mock-image'),
      image_mimetype: 'image/jpeg'
    })

    const res = await request(app).get('/api/news/1/image')

    expect(res.status).toBe(200)
  })

  // ======================
  // POST
  // ======================
  it('10-14 - middlewares + controller + 201', async () => {
    vi.spyOn(NewsModel, 'create').mockResolvedValue({
      id: 3, title: 'New News', slug: 'new-news'
    })
    vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({
      id: 1, action: 'CREATE'
    })

    const res = await request(app)
      .post('/api/news')
      .set('Authorization', 'Bearer token')
      .send({ title: 'test', content: 'content here' })

    expect(res.status).toBe(201)
  })

  // ======================
  // PUT
  // ======================
  it('15-19 - middlewares + controller + 200', async () => {
    vi.spyOn(NewsModel, 'update').mockResolvedValue({
      id: 1, title: 'Updated News', slug: 'updated'
    })
    vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({
      id: 1, action: 'UPDATE'
    })

    const res = await request(app)
      .put('/api/news/1')
      .set('Authorization', 'Bearer token')
      .send({ title: 'updated', content: 'updated content' })

    expect(res.status).toBe(200)
  })

  // ======================
  // DELETE
  // ======================
  it('20-23 - middlewares + controller + 200', async () => {
    vi.spyOn(NewsModel, 'delete').mockResolvedValue(true)
    vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({
      id: 1, action: 'DELETE'
    })

    const res = await request(app)
      .delete('/api/news/1')
      .set('Authorization', 'Bearer token')

    expect(res.status).toBe(200)
  })
})