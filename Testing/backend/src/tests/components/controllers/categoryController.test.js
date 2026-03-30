// src/tests/components/controllers/categoryController.test.js
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

const CategoryModel  = require('../../../models/categoryModel')
const AuditLogModel  = require('../../../models/auditLogModel')
const { getAllCategories } = require('../../../controllers/categoryController')

// ─── Helpers ──────────────────────────────────────────────────────────────────
const mockReq = ({ user = null } = {}) => ({ user })
const mockRes = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json   = vi.fn().mockReturnValue(res)
  return res
}

const baseCategories = [
  { id: 1, name: 'Ingeniería' },
  { id: 2, name: 'Ciencias' },
]

// =============================================================================
describe('categoryController', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getAllCategories', () => {

    it('01 - Llama CategoryModel.getAll una vez', async () => {
      const getAll = vi.spyOn(CategoryModel, 'getAll').mockResolvedValue(baseCategories)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await getAllCategories(mockReq({ user: { id: 1 } }), res)
      expect(getAll).toHaveBeenCalledTimes(1)
    })

    it('02 - Retorna 200 con la lista de categorías', async () => {
      vi.spyOn(CategoryModel, 'getAll').mockResolvedValue(baseCategories)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await getAllCategories(mockReq({ user: { id: 1 } }), res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(baseCategories)
    })

    it('03 - Retorna 200 con arreglo vacío si no hay categorías', async () => {
      vi.spyOn(CategoryModel, 'getAll').mockResolvedValue([])
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await getAllCategories(mockReq({ user: { id: 1 } }), res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([])
    })

    it('04 - Llama AuditLogModel.logAction con READ si hay user', async () => {
      vi.spyOn(CategoryModel, 'getAll').mockResolvedValue(baseCategories)
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await getAllCategories(mockReq({ user: { id: 5 } }), res)
      expect(logAction).toHaveBeenCalledWith(5, 'READ', 'categories', null, expect.any(Object))
    })

    it('05 - No llama AuditLogModel.logAction si no hay user', async () => {
      vi.spyOn(CategoryModel, 'getAll').mockResolvedValue(baseCategories)
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await getAllCategories(mockReq({ user: null }), res)
      expect(logAction).not.toHaveBeenCalled()
    })

    it('06 - Retorna 200 aunque no haya user autenticado', async () => {
      vi.spyOn(CategoryModel, 'getAll').mockResolvedValue(baseCategories)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await getAllCategories(mockReq({ user: null }), res)
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('07 - Retorna 500 si CategoryModel.getAll lanza error', async () => {
      vi.spyOn(CategoryModel, 'getAll').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await getAllCategories(mockReq(), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })

    it('08 - Retorna 500 si AuditLogModel.logAction lanza error', async () => {
      vi.spyOn(CategoryModel, 'getAll').mockResolvedValue(baseCategories)
      vi.spyOn(AuditLogModel, 'logAction').mockRejectedValue(new Error('audit fail'))
      const res = mockRes()
      await getAllCategories(mockReq({ user: { id: 1 } }), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })
})