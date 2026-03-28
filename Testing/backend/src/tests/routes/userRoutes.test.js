import express from 'express'
import request from 'supertest'
import { describe, it, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../controllers/userController', () => ({
  getAllUsers: vi.fn((req, res) => res.status(200).json([])),
  getUsersByRole: vi.fn((req, res) => res.status(200).json([])),
  deleteUser: vi.fn((req, res) => res.status(200).json({ message: 'deleted' })),
  updateUser: vi.fn((req, res) => res.status(200).json({ ok: true })),
  getCurrentUserProfile: vi.fn((req, res) => res.status(200).json({ id: 1 })),
  getAuthorsList: vi.fn((req, res) => res.status(200).json([])),
  getUserImage: vi.fn((req, res) => res.status(200).send('image')),
}))

vi.mock('../../middlewares/authMiddleware', () => ({
  verifyToken: vi.fn((req, res, next) => next()),
  verifyAdmin: vi.fn((req, res, next) => next()),
}))

const userRoutes = require('../../routes/userRoutes')
const userController = require('../../controllers/userController')
const authMiddleware = require('../../middlewares/authMiddleware')

function createTestApp() {
  const app = express()
  app.use(express.json())
  app.use('/api/users', userRoutes)
  return app
}

describe('userRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('GET /api/users/me', () => {
    it.todo('01 - Ejecuta verifyToken')
    it.todo('02 - Llama getCurrentUserProfile')
    it.todo('03 - No usa verifyAdmin')
    it.todo('04 - Responde 200')
  })

  describe('GET /api/users/me/image', () => {
    it.todo('05 - Ejecuta verifyToken')
    it.todo('06 - Llama getUserImage')
    it.todo('07 - No usa verifyAdmin')
    it.todo('08 - Responde 200')
  })

  describe('GET /api/users/authors', () => {
    it.todo('09 - Ejecuta verifyToken')
    it.todo('10 - Llama getAuthorsList')
    it.todo('11 - No usa verifyAdmin')
    it.todo('12 - Responde 200')
  })

  describe('GET /api/users', () => {
    it.todo('13 - Ejecuta verifyToken')
    it.todo('14 - Ejecuta verifyAdmin')
    it.todo('15 - Llama getAllUsers')
    it.todo('16 - Responde 200')
  })

  describe('GET /api/users/role/:roleName', () => {
    it.todo('17 - Ejecuta verifyToken')
    it.todo('18 - Ejecuta verifyAdmin')
    it.todo('19 - Llama getUsersByRole')
    it.todo('20 - Responde 200')
  })

  describe('GET /api/users/:id/image', () => {
    it.todo('21 - Llama getUserImage')
    it.todo('22 - Responde 200')
    it.todo('23 - No usa verifyToken ni verifyAdmin')
  })

  describe('PUT /api/users/:id', () => {
    it.todo('24 - Ejecuta verifyToken')
    it.todo('25 - Ejecuta verifyAdmin')
    it.todo('26 - Llama updateUser')
    it.todo('27 - Responde 200')
  })

  describe('DELETE /api/users/:id', () => {
    it.todo('28 - Ejecuta verifyToken')
    it.todo('29 - Ejecuta verifyAdmin')
    it.todo('30 - Llama deleteUser')
    it.todo('31 - Responde 200')
  })
})