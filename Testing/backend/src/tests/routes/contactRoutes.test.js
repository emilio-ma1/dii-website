import express from 'express'
import request from 'supertest'
import { describe, it, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../controllers/contactController', () => ({
  getContacts: vi.fn((req, res) => res.status(200).json([])),
  createContact: vi.fn((req, res) => res.status(201).json({ ok: true })),
  updateContact: vi.fn((req, res) => res.status(200).json({ ok: true })),
  deleteContact: vi.fn((req, res) => res.status(200).json({ message: 'deleted' })),
}))

vi.mock('../../middlewares/authMiddleware', () => ({
  verifyToken: vi.fn((req, res, next) => next()),
  verifyAdmin: vi.fn((req, res, next) => next()),
}))

const contactRoutes = require('../../routes/contactRoutes')
const contactController = require('../../controllers/contactController')
const authMiddleware = require('../../middlewares/authMiddleware')

function createTestApp() {
  const app = express()
  app.use(express.json())
  app.use('/api/contacts', contactRoutes)
  return app
}

describe('contactRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('GET /api/contacts', () => {
    it.todo('01 - Llama getContacts')
    it.todo('02 - Responde 200')
    it.todo('03 - No usa verifyToken ni verifyAdmin')
  })

  describe('POST /api/contacts', () => {
    it.todo('04 - Ejecuta verifyToken')
    it.todo('05 - Ejecuta verifyAdmin')
    it.todo('06 - Llama createContact')
    it.todo('07 - Responde 201')
  })

  describe('PUT /api/contacts/:id', () => {
    it.todo('08 - Ejecuta verifyToken')
    it.todo('09 - Ejecuta verifyAdmin')
    it.todo('10 - Llama updateContact')
    it.todo('11 - Responde 200')
  })

  describe('DELETE /api/contacts/:id', () => {
    it.todo('12 - Ejecuta verifyToken')
    it.todo('13 - Ejecuta verifyAdmin')
    it.todo('14 - Llama deleteContact')
    it.todo('15 - Responde 200')
  })
})