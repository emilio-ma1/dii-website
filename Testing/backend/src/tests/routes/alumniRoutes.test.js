import express from 'express'
import request from 'supertest'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../controllers/alumniController', () => ({
  getAllAlumni: vi.fn((req, res) => res.status(200).json([{ id: 1, full_name: 'Alumno 1' }])),
  upsertAlumni: vi.fn((req, res) => res.status(200).json({ ok: true })),
  deleteAlumni: vi.fn((req, res) => res.status(200).json({ message: 'deleted' })),
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

  describe('GET /api/alumni', () => {
    it('01 - Responde 200')
    it('02 - Llama getAllAlumni')
    it('03 - No usa verifyToken ni verifyAdmin')
  })

  describe('POST /api/alumni', () => {
    it('04 - Ejecuta verifyToken')
    it('05 - Ejecuta verifyAdmin')
    it('06 - Llama upsertAlumni')
    it('07 - Responde 200')
  })

  describe('PUT /api/alumni/:id', () => {
    it('08 - Ejecuta verifyToken')
    it('09 - Ejecuta verifyAdmin')
    it('10 - Llama upsertAlumni')
    it('11 - Responde 200')
  })

  describe('DELETE /api/alumni/:id', () => {
    it('12 - Ejecuta verifyToken')
    it('13 - Ejecuta verifyAdmin')
    it('14 - Llama deleteAlumni')
    it('15 - Responde 200')
  })
})