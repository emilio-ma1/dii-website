import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../models/professorModel', () => ({
  getAll: vi.fn(),
  upsert: vi.fn(),
  delete: vi.fn(),
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
} = require('../../controllers/professorController')

function mockRequest({ body = {}, params = {}, user = null } = {}) {
  return { body, params, user }
}

function mockResponse() {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('professorController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('getProfessors', () => {
    it('01 - Llama ProfessorModel.getAll una vez')
    it('02 - Retorna 200 con la lista de docentes')
    it('03 - Retorna 500 si ocurre error interno')
  })

  describe('upsertProfessor', () => {
    it('04 - Retorna 400 si falta user_id')
    it('05 - Retorna 400 si falta degree')
    it('06 - Retorna 400 si falta area')
    it('07 - Llama ProfessorModel.upsert con profileData correcto')
    it('08 - Usa image_url null por defecto')
    it('09 - Retorna 200 con el perfil guardado')
    it('10 - Si existe req.user.id registra acción UPSERT en audit log')
    it('11 - Si no existe req.user no registra audit log')
    it('12 - Retorna 500 si ocurre error interno')
  })

  describe('deleteProfessor', () => {
    it('13 - Llama ProfessorModel.delete con req.params.id')
    it('14 - Retorna 404 si el perfil no existe')
    it('15 - Retorna 200 si elimina correctamente')
    it('16 - Si existe req.user.id registra acción DELETE en audit log')
    it('17 - Si no existe req.user no registra audit log')
    it('18 - Retorna 500 si ocurre error interno')
  })
})