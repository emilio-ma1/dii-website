import express from 'express'
import request from 'supertest'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../controllers/professorController', () => ({
  getProfessors: vi.fn((req, res) => {
    res.status(200).json([{ id: 1, user_name: 'Profesor 1' }])
  }),
  upsertProfessor: vi.fn((req, res) => {
    res.status(200).json({ ok: true })
  }),
  deleteProfessor: vi.fn((req, res) => {
    res.status(200).json({ message: 'deleted' })
  }),
}))

vi.mock('../../middlewares/authMiddleware', () => ({
  verifyToken: vi.fn((req, res, next) => next()),
  verifyAdmin: vi.fn((req, res, next) => next()),
}))

const professorRoutes = require('../../routes/professorRoutes')
const professorController = require('../../controllers/professorController')
const authMiddleware = require('../../middlewares/authMiddleware')

function createTestApp() {
  const app = express()
  app.use(express.json())
  app.use('/api/professors', professorRoutes)
  return app
}

describe('professorRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/professors', () => {
    it('01 - Llama getProfessors')
    it('02 - Responde 200')
    it('03 - No usa verifyToken ni verifyAdmin')
  })

  describe('POST /api/professors', () => {
    it('04 - Ejecuta verifyToken')
    it('05 - Ejecuta verifyAdmin')
    it('06 - Llama upsertProfessor')
    it('07 - Responde 200')
  })

  describe('PUT /api/professors/:id', () => {
    it('08 - Ejecuta verifyToken')
    it('09 - Ejecuta verifyAdmin')
    it('10 - Llama upsertProfessor')
    it('11 - Responde 200')
  })

  describe('DELETE /api/professors/:id', () => {
    it('12 - Ejecuta verifyToken')
    it('13 - Ejecuta verifyAdmin')
    it('14 - Llama deleteProfessor')
    it('15 - Responde 200')
  })
})