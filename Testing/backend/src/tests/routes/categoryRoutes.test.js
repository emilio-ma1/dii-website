import express from 'express'
import request from 'supertest'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../controllers/categoryController', () => ({
  getAllCategories: vi.fn((req, res) => {
    res.status(200).json([
      { id: 1, name: 'Optimización' },
      { id: 2, name: 'Investigación Operativa' },
    ])
  }),
}))

const categoryRoutes = require('../../routes/categoryRoutes')
const categoryController = require('../../controllers/categoryController')

function createTestApp() {
  const app = express()
  app.use(express.json())
  app.use('/api/categories', categoryRoutes)
  return app
}

describe('categoryRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/categories', () => {
    it('01 - Llama getAllCategories')
    it('02 - Responde 200')
    it('03 - Retorna el payload mockeado')
  })
})