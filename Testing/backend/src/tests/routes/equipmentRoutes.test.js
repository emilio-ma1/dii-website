import express from 'express'
import request from 'supertest'
import { describe, it, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../controllers/equipmentController', () => ({
  getEquipment: vi.fn((req, res) => res.status(200).json([])),
  createEquipment: vi.fn((req, res) => res.status(201).json({ ok: true })),
  updateEquipment: vi.fn((req, res) => res.status(200).json({ ok: true })),
  deleteEquipment: vi.fn((req, res) => res.status(200).json({ message: 'deleted' })),
  getEquipmentImage: vi.fn((req, res) => res.status(200).send('image')),
}))

vi.mock('../../middlewares/authMiddleware', () => ({
  verifyToken: vi.fn((req, res, next) => next()),
  verifyAdmin: vi.fn((req, res, next) => next()),
}))

const equipmentRoutes = require('../../routes/equipmentRoutes')
const equipmentController = require('../../controllers/equipmentController')
const authMiddleware = require('../../middlewares/authMiddleware')

function createTestApp() {
  const app = express()
  app.use(express.json())
  app.use('/api/equipment', equipmentRoutes)
  return app
}

describe('equipmentRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('GET /api/equipment', () => {
    it.todo('01 - Llama getEquipment')
    it.todo('02 - Responde 200')
    it.todo('03 - No usa verifyToken ni verifyAdmin')
  })

  describe('GET /api/equipment/:id/image', () => {
    it.todo('04 - Llama getEquipmentImage')
    it.todo('05 - Responde 200')
    it.todo('06 - No usa verifyToken ni verifyAdmin')
  })

  describe('POST /api/equipment', () => {
    it.todo('07 - Ejecuta verifyToken')
    it.todo('08 - Ejecuta verifyAdmin')
    it.todo('09 - Procesa upload.single(image)')
    it.todo('10 - Llama createEquipment')
    it.todo('11 - Responde 201')
  })

  describe('PUT /api/equipment/:id', () => {
    it.todo('12 - Ejecuta verifyToken')
    it.todo('13 - Ejecuta verifyAdmin')
    it.todo('14 - Procesa upload.single(image)')
    it.todo('15 - Llama updateEquipment')
    it.todo('16 - Responde 200')
  })

  describe('DELETE /api/equipment/:id', () => {
    it.todo('17 - Ejecuta verifyToken')
    it.todo('18 - Ejecuta verifyAdmin')
    it.todo('19 - Llama deleteEquipment')
    it.todo('20 - Responde 200')
  })
})