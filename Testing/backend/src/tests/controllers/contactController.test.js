import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../models/contactModel', () => ({
  getAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('../../models/auditLogModel', () => ({
  logAction: vi.fn(),
}))

const ContactModel = require('../../models/contactModel')
const AuditLogModel = require('../../models/auditLogModel')
const {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} = require('../../controllers/contactController')

function mockRequest({ body = {}, params = {}, user = null } = {}) {
  return { body, params, user }
}

function mockResponse() {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('contactController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('getContacts', () => {
    it('01 - Llama ContactModel.getAll una vez')
    it('02 - Retorna 200 con la lista de contactos')
    it('03 - Retorna 500 si ocurre error interno')
  })

  describe('createContact', () => {
    it('04 - Retorna 400 si falta initials')
    it('05 - Retorna 400 si falta full_name')
    it('06 - Retorna 400 si falta role')
    it('07 - Llama ContactModel.create con los datos correctos')
    it('08 - Retorna 201 con el contacto creado')
    it('09 - Si existe req.user.id registra acción CREATE en audit log')
    it('10 - Si no existe req.user no registra audit log')
    it('11 - Retorna 500 si ocurre error interno')
  })

  describe('updateContact', () => {
    it('12 - Retorna 400 si falta initials')
    it('13 - Retorna 400 si falta full_name')
    it('14 - Retorna 400 si falta role')
    it('15 - Llama ContactModel.update con los datos correctos')
    it('16 - Retorna 404 si el contacto no existe')
    it('17 - Retorna 200 con el contacto actualizado')
    it('18 - Si existe req.user.id registra acción UPDATE en audit log')
    it('19 - Si no existe req.user no registra audit log')
    it('20 - Retorna 500 si ocurre error interno')
  })

  describe('deleteContact', () => {
    it('21 - Llama ContactModel.delete con req.params.id')
    it('22 - Retorna 404 si el contacto no existe')
    it('23 - Retorna 200 si elimina correctamente')
    it('24 - Si existe req.user.id registra acción DELETE en audit log')
    it('25 - Si no existe req.user no registra audit log')
    it('26 - Retorna 500 si ocurre error interno')
  })
})