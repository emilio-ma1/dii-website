import express from 'express'
import request from 'supertest'
import { describe, it, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../controllers/newsController', () => ({
  getNews: vi.fn((req, res) => res.status(200).json([])),
  createNews: vi.fn((req, res) => res.status(201).json({ ok: true })),
  updateNews: vi.fn((req, res) => res.status(200).json({ ok: true })),
  deleteNews: vi.fn((req, res) => res.status(200).json({ message: 'deleted' })),
  getNewsBySlug: vi.fn((req, res) => res.status(200).json({ id: 1 })),
  getNewsImage: vi.fn((req, res) => res.status(200).send('image')),
}))

vi.mock('../../middlewares/authMiddleware', () => ({
  verifyToken: vi.fn((req, res, next) => next()),
  verifyAdmin: vi.fn((req, res, next) => next()),
}))

const newsRoutes = require('../../routes/newsRoutes')
const newsController = require('../../controllers/newsController')
const authMiddleware = require('../../middlewares/authMiddleware')

function createTestApp() {
  const app = express()
  app.use(express.json())
  app.use('/api/news', newsRoutes)
  return app
}

describe('newsRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('GET /api/news', () => {
    it.todo('01 - Llama getNews')
    it.todo('02 - Responde 200')
    it.todo('03 - No usa verifyToken ni verifyAdmin')
  })

  describe('GET /api/news/slug/:slug', () => {
    it.todo('04 - Llama getNewsBySlug')
    it.todo('05 - Responde 200')
    it.todo('06 - No usa verifyToken ni verifyAdmin')
  })

  describe('GET /api/news/:id/image', () => {
    it.todo('07 - Llama getNewsImage')
    it.todo('08 - Responde 200')
    it.todo('09 - No usa verifyToken ni verifyAdmin')
  })

  describe('POST /api/news', () => {
    it.todo('10 - Ejecuta verifyToken')
    it.todo('11 - Ejecuta verifyAdmin')
    it.todo('12 - Procesa upload.single(image)')
    it.todo('13 - Llama createNews')
    it.todo('14 - Responde 201')
  })

  describe('PUT /api/news/:id', () => {
    it.todo('15 - Ejecuta verifyToken')
    it.todo('16 - Ejecuta verifyAdmin')
    it.todo('17 - Procesa upload.single(image)')
    it.todo('18 - Llama updateNews')
    it.todo('19 - Responde 200')
  })

  describe('DELETE /api/news/:id', () => {
    it.todo('20 - Ejecuta verifyToken')
    it.todo('21 - Ejecuta verifyAdmin')
    it.todo('22 - Llama deleteNews')
    it.todo('23 - Responde 200')
  })
})