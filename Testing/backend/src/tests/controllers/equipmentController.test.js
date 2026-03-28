import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../models/equipmentModel', () => ({
  getAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  getImage: vi.fn(),
}))

vi.mock('../../models/auditLogModel', () => ({
  logAction: vi.fn(),
}))

const EquipmentModel = require('../../models/equipmentModel')
const AuditLogModel = require('../../models/auditLogModel')
const {
  getEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipmentImage,
} = require('../../controllers/equipmentController')

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

describe('equipmentController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('getEquipment', () => {
    it('01 - Llama EquipmentModel.getAll una vez')
    it('02 - Retorna 200 con la lista de equipamiento')
    it('03 - Retorna 500 si ocurre error interno')
  })

  describe('createEquipment', () => {
    it('04 - Retorna 400 si falta name')
    it('05 - Llama EquipmentModel.create con description null si no viene')
    it('06 - Usa imageData e imageMimetype desde req.file')
    it('07 - Usa imageData e imageMimetype null si no hay req.file')
    it('08 - Retorna 201 con el equipamiento creado')
    it('09 - Si existe req.user.id registra acción CREATE en audit log')
    it('10 - Si no existe req.user no registra audit log')
    it('11 - Retorna 500 si ocurre error interno')
  })

  describe('updateEquipment', () => {
    it('12 - Retorna 400 si falta name')
    it('13 - Llama EquipmentModel.update con los datos correctos')
    it('14 - Usa imageData e imageMimetype desde req.file')
    it('15 - Usa imageData e imageMimetype null si no hay req.file')
    it('16 - Retorna 404 si el equipamiento no existe')
    it('17 - Retorna 200 con el equipamiento actualizado')
    it('18 - Si existe req.user.id registra acción UPDATE en audit log')
    it('19 - Si no existe req.user no registra audit log')
    it('20 - Retorna 500 si ocurre error interno')
  })

  describe('deleteEquipment', () => {
    it('21 - Llama EquipmentModel.delete con req.params.id')
    it('22 - Retorna 404 si el equipamiento no existe')
    it('23 - Retorna 200 si elimina correctamente')
    it('24 - Si existe req.user.id registra acción DELETE en audit log')
    it('25 - Si no existe req.user no registra audit log')
    it('26 - Retorna 500 si ocurre error interno')
  })

  describe('getEquipmentImage', () => {
    it('27 - Llama EquipmentModel.getImage con req.params.id')
    it('28 - Retorna 404 si no existe imagen')
    it('29 - Setea Content-Type y Cross-Origin-Resource-Policy')
    it('30 - Envía image_data con res.send')
    it('31 - Retorna 500 si ocurre error interno')
  })
})