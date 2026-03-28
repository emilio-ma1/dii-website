import express from 'express'
import request from 'supertest'
import { describe, it, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../controllers/alumniController', () => ({
  getAllAlumni: vi.fn((req, res) => res.status(200).json([])),
  upsertAlumni: vi.fn((req, res) => res.status(200).json({ ok: true })),
  deleteAlumni: vi.fn((req, res) => res.status(200).json({ message: 'deleted' })),
  getAlumniImage: vi.fn((req, res) => res.status(200).send('image')),
}))

vi.mock('../../middlewares/authMiddleware', () => ({
  verifyToken: vi.fn((req, res, next) => next()),
  verifyAdmin: vi.fn((req, res, next) => next()),
}))

const alumniRoutes = require('../../routes/alumniRoutes')
const alumniController = require('../../controllers/alumniController')
const authMiddleware = require('../../middlewares/authMiddleware')

function createTestApp() {
  const app = express()
  app.use(express.json())
  app.use('/api/alumni', alumniRoutes)
  return app
}

describe('alumniRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('GET /api/alumni', () => {
    it.todo('01 - Llama getAllAlumni')
    it.todo('02 - Responde 200')
    it.todo('03 - No usa verifyToken ni verifyAdmin')
  })

  describe('GET /api/alumni/:id/image', () => {
    it.todo('04 - Llama getAlumniImage')
    it.todo('05 - Responde 200')
    it.todo('06 - No usa verifyToken ni verifyAdmin')
  })

  describe('POST /api/alumni', () => {
    it.todo('07 - Ejecuta verifyToken')
    it.todo('08 - Ejecuta verifyAdmin')
    it.todo('09 - Procesa upload.single(image)')
    it.todo('10 - Llama upsertAlumni')
    it.todo('11 - Responde 200')
  })

  describe('PUT /api/alumni/:id', () => {
    it.todo('12 - Ejecuta verifyToken')
    it.todo('13 - Ejecuta verifyAdmin')
    it.todo('14 - Procesa upload.single(image)')
    it.todo('15 - Llama upsertAlumni')
    it.todo('16 - Responde 200')
  })

  describe('DELETE /api/alumni/:id', () => {
    it.todo('17 - Ejecuta verifyToken')
    it.todo('18 - Ejecuta verifyAdmin')
    it.todo('19 - Llama deleteAlumni')
    it.todo('20 - Responde 200')
  })
})