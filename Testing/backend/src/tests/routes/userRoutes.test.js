import express from 'express'
import request from 'supertest'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../controllers/userController', () => ({
  getAllUsers: vi.fn((req, res) => {
    res.status(200).json([{ id: 1, full_name: 'Admin User' }])
  }),
  getUsersByRole: vi.fn((req, res) => {
    res.status(200).json([{ id: 2, full_name: 'Profesor 1', email: 'profe@userena.cl' }])
  }),
  deleteUser: vi.fn((req, res) => {
    res.status(200).json({ message: 'Usuario eliminado' })
  }),
  updateUser: vi.fn((req, res) => {
    res.status(200).json({ message: 'Usuario actualizado' })
  }),
  getCurrentUserProfile: vi.fn((req, res) => {
    res.status(200).json({ id: 7, full_name: 'Usuario Actual', role: 'teacher' })
  }),
  getAuthorsList: vi.fn((req, res) => {
    res.status(200).json([
      { id: 7, full_name: 'Profesor 1', role: 'teacher' },
      { id: 8, full_name: 'Egresado 1', role: 'alumni' },
    ])
  }),
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

  describe('GET /api/users/me', () => {
    it('01 - Ejecuta verifyToken')
    it('02 - Llama getCurrentUserProfile')
    it('03 - No usa verifyAdmin')
    it('04 - Responde 200')
  })

  describe('GET /api/users/authors', () => {
    it('05 - Ejecuta verifyToken')
    it('06 - Llama getAuthorsList')
    it('07 - No usa verifyAdmin')
    it('08 - Responde 200')
  })

  describe('GET /api/users', () => {
    it('09 - Ejecuta verifyToken')
    it('10 - Ejecuta verifyAdmin')
    it('11 - Llama getAllUsers')
    it('12 - Responde 200')
  })

  describe('GET /api/users/role/:roleName', () => {
    it('13 - Ejecuta verifyToken')
    it('14 - Ejecuta verifyAdmin')
    it('15 - Llama getUsersByRole')
    it('16 - Responde 200')
  })

  describe('PUT /api/users/:id', () => {
    it('17 - Ejecuta verifyToken')
    it('18 - Ejecuta verifyAdmin')
    it('19 - Llama updateUser')
    it('20 - Responde 200')
  })

  describe('DELETE /api/users/:id', () => {
    it('21 - Ejecuta verifyToken')
    it('22 - Ejecuta verifyAdmin')
    it('23 - Llama deleteUser')
    it('24 - Responde 200')
  })
})