import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../models/projectModel', () => ({
  getAll: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  getByAuthorId: vi.fn(),
  getImage: vi.fn(),
  getPdf: vi.fn(),
}))

vi.mock('../../models/auditLogModel', () => ({
  logAction: vi.fn(),
}))

const ProjectModel = require('../../models/projectModel')
const AuditLogModel = require('../../models/auditLogModel')
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getPanelProjects,
  getProjectImage,
  getProjectPdf,
} = require('../../controllers/projectController')

function mockRequest({ body = {}, params = {}, files = null, user = null } = {}) {
  return { body, params, files, user }
}

function mockResponse() {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  res.set = vi.fn().mockReturnValue(res)
  res.send = vi.fn().mockReturnValue(res)
  return res
}

describe('projectController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  describe('getAllProjects', () => {
    it('01 - Llama ProjectModel.getAll una vez')
    it('02 - Retorna 200 con la lista de investigaciones')
    it('03 - Retorna 500 si ocurre error interno')
  })

  describe('getProjectById', () => {
    it('04 - Llama ProjectModel.getById con req.params.id')
    it('05 - Retorna 200 con el proyecto encontrado')
    it('06 - Retorna 404 si el proyecto no existe')
    it('07 - Retorna 500 si ocurre error interno')
  })

  describe('createProject', () => {
    it('08 - Retorna 400 si falta title')
    it('09 - Retorna 400 si falta category_id')
    it('10 - Retorna 400 si la imagen supera 2MB')
    it('11 - Retorna 400 si el PDF supera 5MB')
    it('12 - Procesa image y pdf válidos en finalProjectData')
    it('13 - Extrae author ids desde arreglo mixto')
    it('14 - Extrae author ids desde JSON string')
    it('15 - Si authors string es inválido usa arreglo vacío')
    it('16 - Llama ProjectModel.create con datos limpios y author ids')
    it('17 - Retorna 201 con el proyecto creado')
    it('18 - Si existe req.user.id registra acción CREATE en audit log')
    it('19 - Si no existe req.user no registra audit log')
    it('20 - Retorna 500 si ocurre error interno')
  })

  describe('updateProject', () => {
    it('21 - Retorna 400 si falta title')
    it('22 - Retorna 404 si el proyecto no existe')
    it('23 - Retorna 403 si usuario no admin no es autor del proyecto')
    it('24 - Permite actualización si el usuario es admin')
    it('25 - Permite actualización si el usuario es autor del proyecto')
    it('26 - Retorna 400 si archivo excede límite')
    it('27 - Llama ProjectModel.update con datos limpios y author ids')
    it('28 - Si existe req.user.id registra acción UPDATE en audit log')
    it('29 - Retorna 200 con el proyecto actualizado')
    it('30 - Retorna 500 si ocurre error interno')
  })

  describe('deleteProject', () => {
    it('31 - Retorna 404 si el proyecto no existe')
    it('32 - Retorna 403 si usuario no admin no es autor del proyecto')
    it('33 - Permite eliminación si el usuario es admin')
    it('34 - Permite eliminación si el usuario es autor del proyecto')
    it('35 - Si existe req.user.id registra acción DELETE en audit log')
    it('36 - Retorna 200 si elimina correctamente')
    it('37 - Retorna 500 si ocurre error interno')
  })

  describe('getPanelProjects', () => {
    it('38 - Si role es admin llama ProjectModel.getAll')
    it('39 - Si role no es admin llama ProjectModel.getByAuthorId')
    it('40 - Retorna 200 con la lista de proyectos del panel')
    it('41 - Retorna 500 si ocurre error interno')
  })

  describe('getProjectImage', () => {
    it('42 - Retorna 404 si la imagen no existe')
    it('43 - Setea Content-Type y Cross-Origin-Resource-Policy')
    it('44 - Envía image_data con res.send')
    it('45 - Retorna 500 si ocurre error interno')
  })

  describe('getProjectPdf', () => {
    it('46 - Retorna 404 si el PDF no existe')
    it('47 - Setea Content-Type y Content-Disposition')
    it('48 - Envía pdf_data con res.send')
    it('49 - Retorna 500 si ocurre error interno')
  })
})