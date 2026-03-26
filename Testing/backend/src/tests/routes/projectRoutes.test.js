import express from 'express'
import request from 'supertest'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../controllers/projectController', () => ({
  getAllProjects: vi.fn((req, res) => {
    res.status(200).json([{ id: 1, title: 'Proyecto A' }])
  }),
  getPanelProjects: vi.fn((req, res) => {
    res.status(200).json([{ id: 2, title: 'Proyecto panel' }])
  }),
  getProjectById: vi.fn((req, res) => {
    res.status(200).json({ id: 10, title: 'Proyecto detalle' })
  }),
  createProject: vi.fn((req, res) => {
    res.status(201).json({ id: 20, title: 'Proyecto creado' })
  }),
  updateProject: vi.fn((req, res) => {
    res.status(200).json({ id: 20, title: 'Proyecto actualizado' })
  }),
  deleteProject: vi.fn((req, res) => {
    res.status(200).json({ message: 'Proyecto eliminado' })
  }),
  getProjectImage: vi.fn((req, res) => {
    res.status(200).send('image-bytes')
  }),
  getProjectPdf: vi.fn((req, res) => {
    res.status(200).send('pdf-bytes')
  }),
}))

vi.mock('../../middlewares/authMiddleware', () => ({
  verifyToken: vi.fn((req, res, next) => next()),
  verifyAdmin: vi.fn((req, res, next) => next()),
}))

const projectRoutes = require('../../routes/projectRoutes')
const projectController = require('../../controllers/projectController')
const authMiddleware = require('../../middlewares/authMiddleware')

function createTestApp() {
  const app = express()
  app.use(express.json())
  app.use('/api/projects', projectRoutes)
  return app
}

describe('projectRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/projects', () => {
    it('01 - Llama getAllProjects')
    it('02 - Responde 200')
    it('03 - No usa verifyToken ni verifyAdmin')
  })

  describe('GET /api/projects/panel', () => {
    it('04 - Ejecuta verifyToken')
    it('05 - Llama getPanelProjects')
    it('06 - No llama getProjectById para la ruta /panel')
    it('07 - Responde 200')
    it('08 - No usa verifyAdmin')
  })

  describe('GET /api/projects/:id', () => {
    it('09 - Llama getProjectById')
    it('10 - Responde 200')
    it('11 - No usa verifyToken ni verifyAdmin')
  })

  describe('GET /api/projects/:id/image', () => {
    it('12 - Llama getProjectImage')
    it('13 - Responde 200')
    it('14 - No usa verifyToken ni verifyAdmin')
  })

  describe('GET /api/projects/:id/pdf', () => {
    it('15 - Llama getProjectPdf')
    it('16 - Responde 200')
    it('17 - No usa verifyToken ni verifyAdmin')
  })

  describe('POST /api/projects', () => {
    it('18 - Ejecuta verifyToken')
    it('19 - Llama createProject')
    it('20 - Responde 201')
    it('21 - No usa verifyAdmin')
  })

  describe('PUT /api/projects/:id', () => {
    it('22 - Ejecuta verifyToken')
    it('23 - Llama updateProject')
    it('24 - Responde 200')
    it('25 - No usa verifyAdmin')
  })

  describe('DELETE /api/projects/:id', () => {
    it('26 - Ejecuta verifyToken')
    it('27 - Llama deleteProject')
    it('28 - Responde 200')
    it('29 - No usa verifyAdmin')
  })
})