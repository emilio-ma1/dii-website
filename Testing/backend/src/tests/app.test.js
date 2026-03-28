// src/tests/app.test.js
import request from 'supertest'
import { describe, it, vi, beforeEach, afterEach } from 'vitest'

process.env.FRONTEND_URL = 'http://localhost:5173'

vi.mock('../routes/authRoutes', () => {
  const express = require('express')
  const router = express.Router()

  router.get('/__mock__', (req, res) => {
    res.status(200).json({ route: 'auth' })
  })

  router.get('/__error__', (req, res, next) => {
    next(new Error('forced route error'))
  })

  return router
})

vi.mock('../routes/newsRoutes', () => {
  const express = require('express')
  const router = express.Router()

  router.get('/__mock__', (req, res) => {
    res.status(200).json({ route: 'news' })
  })

  return router
})

vi.mock('../routes/projectRoutes', () => {
  const express = require('express')
  const router = express.Router()

  router.get('/__mock__', (req, res) => {
    res.status(200).json({ route: 'projects' })
  })

  return router
})

vi.mock('../routes/userRoutes', () => {
  const express = require('express')
  const router = express.Router()

  router.get('/__mock__', (req, res) => {
    res.status(200).json({ route: 'users' })
  })

  return router
})

vi.mock('../routes/categoryRoutes', () => {
  const express = require('express')
  const router = express.Router()

  router.get('/__mock__', (req, res) => {
    res.status(200).json({ route: 'categories' })
  })

  return router
})

vi.mock('../routes/professorRoutes', () => {
  const express = require('express')
  const router = express.Router()

  router.get('/__mock__', (req, res) => {
    res.status(200).json({ route: 'professors' })
  })

  return router
})

vi.mock('../routes/alumniRoutes', () => {
  const express = require('express')
  const router = express.Router()

  router.get('/__mock__', (req, res) => {
    res.status(200).json({ route: 'alumni' })
  })

  return router
})

vi.mock('../routes/auditLogRoutes', () => {
  const express = require('express')
  const router = express.Router()

  router.get('/__mock__', (req, res) => {
    res.status(200).json({ route: 'audit-logs' })
  })

  return router
})

vi.mock('../routes/equipmentRoutes', () => {
  const express = require('express')
  const router = express.Router()

  router.get('/__mock__', (req, res) => {
    res.status(200).json({ route: 'equipment' })
  })

  return router
})

vi.mock('../routes/contactRoutes', () => {
  const express = require('express')
  const router = express.Router()

  router.get('/__mock__', (req, res) => {
    res.status(200).json({ route: 'contacts' })
  })

  return router
})

const app = require('../app')

describe('app', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('GET /', () => {
    it.todo('01 - Retorna 200 en el health check')
    it.todo('02 - Retorna el mensaje de estado esperado')
  })

  describe('Route mounting', () => {
    it.todo('03 - Monta /api/auth correctamente')
    it.todo('04 - Monta /api/news correctamente')
    it.todo('05 - Monta /api/projects correctamente')
    it.todo('06 - Monta /api/users correctamente')
    it.todo('07 - Monta /api/categories correctamente')
    it.todo('08 - Monta /api/professors correctamente')
    it.todo('09 - Monta /api/alumni correctamente')
    it.todo('10 - Monta /api/audit-logs correctamente')
    it.todo('11 - Monta /api/equipment correctamente')
    it.todo('12 - Monta /api/contacts correctamente')
  })

  describe('Global middlewares', () => {
    it.todo('13 - Aplica headers de Helmet')
    it.todo('14 - Aplica configuración CORS con credentials true')
    it.todo('15 - Permite el origin configurado en FRONTEND_URL')
    it.todo('16 - Parsea JSON correctamente con express.json')
  })

  describe('Fallback handlers', () => {
    it.todo('17 - Retorna 404 para una ruta inexistente')
    it.todo('18 - Retorna el mensaje esperado en el 404 fallback')
    it.todo('19 - Retorna 500 cuando una ruta llama next(error)')
    it.todo('20 - Retorna el mensaje esperado en el error handler global')
    it.todo('21 - Hace console.error en errores no controlados')
  })
})