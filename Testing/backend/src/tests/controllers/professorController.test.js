import { describe, it, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../models/professorModel', () => ({
  getAll: vi.fn(),
  upsert: vi.fn(),
  delete: vi.fn(),
  getImage: vi.fn(),
}))

vi.mock('../../models/auditLogModel', () => ({
  logAction: vi.fn(),
}))

const ProfessorModel = require('../../models/professorModel')
const AuditLogModel = require('../../models/auditLogModel')
const {
  getProfessors,
  upsertProfessor,
  deleteProfessor,
  getProfessorImage,
} = require('../../controllers/professorController')

function mockRequest({ body = {}, params = {}, user = null, file = null } = {}) {
  return { body, params, user, file }
}

function mockResponse() {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  res.set = vi.fn().mockReturnValue(res)
  res.send = vi.fn().mockReturnValue(res)
  return res
}

describe('professorController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getProfessors', () => {
    it.todo('01 - Llama ProfessorModel.getAll una vez')
    it.todo('02 - Retorna 200 con la lista de docentes')
    it.todo('03 - Retorna 200 con arreglo vacío si no hay docentes')
    it.todo('04 - Retorna 500 si ocurre error interno')
  })

  describe('upsertProfessor', () => {
    it.todo('05 - Retorna 400 si falta user_id')
    it.todo('06 - Retorna 400 si falta degree')
    it.todo('07 - Retorna 400 si falta area')
    it.todo('08 - Usa imageData e imageMimetype desde req.file')
    it.todo('09 - Usa imageData e imageMimetype null si no hay req.file')
    it.todo('10 - Llama ProfessorModel.upsert con payload correcto')
    it.todo('11 - Retorna 200 con el perfil guardado')
    it.todo('12 - Si existe req.user.id registra acción UPSERT en audit log')
    it.todo('13 - Si no existe req.user no registra audit log')
    it.todo('14 - Retorna 500 si ocurre error interno')
  })

  describe('deleteProfessor', () => {
    it.todo('15 - Llama ProfessorModel.delete con req.params.id')
    it.todo('16 - Retorna 404 si el perfil no existe')
    it.todo('17 - Retorna 200 si elimina correctamente')
    it.todo('18 - Si existe req.user.id registra acción DELETE en audit log')
    it.todo('19 - Si no existe req.user no registra audit log')
    it.todo('20 - Retorna 500 si ocurre error interno')
  })

  describe('getProfessorImage', () => {
    it.todo('21 - Llama ProfessorModel.getImage con req.params.id')
    it.todo('22 - Retorna 404 si no existe imagen')
    it.todo('23 - Setea Content-Type y Cross-Origin-Resource-Policy')
    it.todo('24 - Envía image_data con res.send')
    it.todo('25 - Retorna 500 si ocurre error interno')
  })
})