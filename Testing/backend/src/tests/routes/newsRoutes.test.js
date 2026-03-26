import express from 'express'
import request from 'supertest'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../controllers/newsController', () => ({
  getNews: vi.fn((req, res) => {
    res.status(200).json([{ id: 1, title: 'Noticia A' }])
  }),
  getNewsBySlug: vi.fn((req, res) => {
    res.status(200).json({ id: 1, slug: 'noticia-a', title: 'Noticia A' })
  }),
  createNews: vi.fn((req, res) => {
    res.status(201).json({ message: 'Noticia creada' })
  }),
  updateNews: vi.fn((req, res) => {
    res.status(200).json({ message: 'Noticia actualizada' })
  }),
  deleteNews: vi.fn((req, res) => {
    res.status(200).json({ message: 'Noticia eliminada' })
  }),
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

  describe('GET /api/news', () => {
    it('01 - Llama getNews')
    it('02 - Responde 200')
    it('03 - No usa verifyToken ni verifyAdmin')
  })

  describe('GET /api/news/slug/:slug', () => {
    it('04 - Llama getNewsBySlug')
    it('05 - Responde 200')
    it('06 - No usa verifyToken ni verifyAdmin')
  })

  describe('POST /api/news', () => {
    it('07 - Ejecuta verifyToken')
    it('08 - Ejecuta verifyAdmin')
    it('09 - Llama createNews')
    it('10 - Responde 201')
  })

  describe('PUT /api/news/:id', () => {
    it('11 - Ejecuta verifyToken')
    it('12 - Ejecuta verifyAdmin')
    it('13 - Llama updateNews')
    it('14 - Responde 200')
  })

  describe('DELETE /api/news/:id', () => {
    it('15 - Ejecuta verifyToken')
    it('16 - Ejecuta verifyAdmin')
    it('17 - Llama deleteNews')
    it('18 - Responde 200')
  })
})