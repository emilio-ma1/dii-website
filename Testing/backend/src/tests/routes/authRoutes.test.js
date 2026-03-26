import express from 'express'
import request from 'supertest'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../controllers/authController', () => ({
  login: vi.fn((req, res) => {
    res.status(200).json({ token: 'fake-jwt-token' })
  }),
  register: vi.fn((req, res) => {
    res.status(201).json({ message: 'Usuario registrado' })
  }),
}))

vi.mock('../../middlewares/authMiddleware', () => ({
  verifyToken: vi.fn((req, res, next) => next()),
  verifyAdmin: vi.fn((req, res, next) => next()),
}))

const authRoutes = require('../../routes/authRoutes')
const authController = require('../../controllers/authController')
const authMiddleware = require('../../middlewares/authMiddleware')

function createTestApp() {
  const app = express()
  app.use(express.json())
  app.use('/api/auth', authRoutes)
  return app
}

describe('authRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/auth/login', () => {
    it('01 - Llama login')
    it('02 - Responde 200')
    it('03 - No usa verifyToken ni verifyAdmin')
  })

  describe('POST /api/auth/register', () => {
    it('04 - Ejecuta verifyToken')
    it('05 - Ejecuta verifyAdmin')
    it('06 - Llama register')
    it('07 - Responde 201')
  })
})