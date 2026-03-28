import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../models/categoryModel', () => ({
  getAll: vi.fn(),
}))

vi.mock('../../models/auditLogModel', () => ({
  logAction: vi.fn(),
}))

const CategoryModel = require('../../models/categoryModel')
const AuditLogModel = require('../../models/auditLogModel')
const { getAllCategories } = require('../../controllers/categoryController')

function mockRequest({ user = null } = {}) {
  return { user }
}

function mockResponse() {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('categoryController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('getAllCategories', () => {
    it('01 - Llama CategoryModel.getAll una vez')
    it('02 - Retorna 200 con la lista de categorías')
    it('03 - Retorna 200 con arreglo vacío si no hay categorías')
    it('04 - Si existe req.user.id registra acción READ en audit log')
    it('05 - Si no existe req.user no registra audit log')
    it('06 - Retorna 500 si ocurre error interno')
    it('07 - Hace console.error cuando ocurre error interno')
  })
})