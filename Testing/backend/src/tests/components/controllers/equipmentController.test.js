/**
 * @file equipmentController.test.js
 * @description Integration tests for equipmentController.
 * Uses vi.spyOn over createRequire — vi.mock() is NOT used in this stack.
 */
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const EquipmentModel          = require('../../../models/equipmentModel')
const AuditLogModel           = require('../../../models/auditLogModel')
const { getEquipment,
        createEquipment,
        updateEquipment,
        deleteEquipment,
        getEquipmentImage }   = require('../../../controllers/equipmentController')

// ─── Helpers ──────────────────────────────────────────────────────────────────
const mockReq = ({ body = {}, params = {}, user = null, file = null, query = {} } = {}) =>
  ({ body, params, user, file, query })

const mockRes = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json   = vi.fn().mockReturnValue(res)
  res.set    = vi.fn().mockReturnValue(res)
  res.send   = vi.fn().mockReturnValue(res)
  return res
}

const fakeAdmin = { id: 99 }

// ─── Suite ────────────────────────────────────────────────────────────────────
describe('equipmentController', () => {

  let getAllSpy, createSpy, updateSpy, deleteSpy, getImageSpy, logActionSpy

  beforeEach(() => {
    getAllSpy     = vi.spyOn(EquipmentModel, 'getAll')
    createSpy    = vi.spyOn(EquipmentModel, 'create')
    updateSpy    = vi.spyOn(EquipmentModel, 'update')
    deleteSpy    = vi.spyOn(EquipmentModel, 'delete')
    getImageSpy  = vi.spyOn(EquipmentModel, 'getImage')
    logActionSpy = vi.spyOn(AuditLogModel,  'logAction').mockResolvedValue()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ── getEquipment ─────────────────────────────────────────────────────────────
  describe('getEquipment', () => {
    it('returns 200 with the full equipment list', async () => {
      const fakeList = [{ id: 1, name: 'Projector' }, { id: 2, name: 'Laptop' }]
      getAllSpy.mockResolvedValue(fakeList)

      const req = mockReq()
      const res = mockRes()

      await getEquipment(req, res)

      expect(getAllSpy).toHaveBeenCalledOnce()
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(fakeList)
    })

    it('returns 200 with an empty array when no equipment exists', async () => {
      getAllSpy.mockResolvedValue([])

      const req = mockReq()
      const res = mockRes()

      await getEquipment(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([])
    })

    it('returns 500 when model throws', async () => {
      getAllSpy.mockRejectedValue(new Error('DB error'))

      const req = mockReq()
      const res = mockRes()

      await getEquipment(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error interno del servidor al obtener el equipamiento.'
      })
    })
  })

  // ── createEquipment ──────────────────────────────────────────────────────────
  describe('createEquipment', () => {
    const fakeEquipment = { id: 10, name: 'Microscope' }

    it('returns 201 with new equipment (no file, with admin)', async () => {
      createSpy.mockResolvedValue(fakeEquipment)

      const req = mockReq({ body: { name: 'Microscope', description: 'Lab use' }, user: fakeAdmin })
      const res = mockRes()

      await createEquipment(req, res)

      expect(createSpy).toHaveBeenCalledWith('Microscope', 'Lab use', null, null)
      expect(logActionSpy).toHaveBeenCalledWith(99, 'CREATE', 'equipment', 10, { name: 'Microscope' })
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Equipamiento registrado exitosamente.',
        equipment: fakeEquipment
      })
    })

    it('returns 201 and skips audit log when no authenticated user', async () => {
      createSpy.mockResolvedValue(fakeEquipment)

      const req = mockReq({ body: { name: 'Microscope' }, user: null })
      const res = mockRes()

      await createEquipment(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(logActionSpy).not.toHaveBeenCalled()
    })

    it('passes file buffer and mimetype to model when file is present', async () => {
      createSpy.mockResolvedValue(fakeEquipment)
      const fakeFile = { buffer: Buffer.from('img'), mimetype: 'image/png' }

      const req = mockReq({ body: { name: 'Microscope' }, file: fakeFile, user: fakeAdmin })
      const res = mockRes()

      await createEquipment(req, res)

      expect(createSpy).toHaveBeenCalledWith('Microscope', null, fakeFile.buffer, 'image/png')
      expect(res.status).toHaveBeenCalledWith(201)
    })

    it('returns 400 when name is missing', async () => {
      const req = mockReq({ body: {} })
      const res = mockRes()

      await createEquipment(req, res)

      expect(createSpy).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'El nombre del equipamiento es obligatorio.'
      })
    })

    it('returns 400 when name is empty string', async () => {
      const req = mockReq({ body: { name: '' } })
      const res = mockRes()

      await createEquipment(req, res)

      expect(createSpy).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('returns 500 when model throws', async () => {
      createSpy.mockRejectedValue(new Error('Insert failed'))

      const req = mockReq({ body: { name: 'Microscope' }, user: fakeAdmin })
      const res = mockRes()

      await createEquipment(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error interno al registrar el equipamiento.'
      })
    })
  })

  // ── updateEquipment ──────────────────────────────────────────────────────────
  describe('updateEquipment', () => {
    const fakeUpdated = { id: 5, name: 'Updated Scope' }

    it('returns 200 with updated equipment (no file, with admin)', async () => {
      updateSpy.mockResolvedValue(fakeUpdated)

      const req = mockReq({
        params: { id: '5' },
        body: { name: 'Updated Scope', description: 'New desc' },
        user: fakeAdmin
      })
      const res = mockRes()

      await updateEquipment(req, res)

      expect(updateSpy).toHaveBeenCalledWith('5', 'Updated Scope', 'New desc', null, null)
      expect(logActionSpy).toHaveBeenCalledWith(99, 'UPDATE', 'equipment', '5', { name: 'Updated Scope' })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Equipamiento actualizado.',
        equipment: fakeUpdated
      })
    })

    it('passes file buffer and mimetype to model when file is present', async () => {
      updateSpy.mockResolvedValue(fakeUpdated)
      const fakeFile = { buffer: Buffer.from('img'), mimetype: 'image/jpeg' }

      const req = mockReq({
        params: { id: '5' },
        body: { name: 'Updated Scope' },
        file: fakeFile,
        user: fakeAdmin
      })
      const res = mockRes()

      await updateEquipment(req, res)

      expect(updateSpy).toHaveBeenCalledWith('5', 'Updated Scope', null, fakeFile.buffer, 'image/jpeg')
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('skips audit log when no authenticated user', async () => {
      updateSpy.mockResolvedValue(fakeUpdated)

      const req = mockReq({ params: { id: '5' }, body: { name: 'Updated Scope' }, user: null })
      const res = mockRes()

      await updateEquipment(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(logActionSpy).not.toHaveBeenCalled()
    })

    it('returns 400 when name is missing', async () => {
      const req = mockReq({ params: { id: '5' }, body: {} })
      const res = mockRes()

      await updateEquipment(req, res)

      expect(updateSpy).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'El nombre del equipamiento es obligatorio.'
      })
    })

    it('returns 404 when equipment does not exist', async () => {
      updateSpy.mockResolvedValue(null)

      const req = mockReq({ params: { id: '999' }, body: { name: 'Ghost' }, user: fakeAdmin })
      const res = mockRes()

      await updateEquipment(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Equipamiento no encontrado.' })
      expect(logActionSpy).not.toHaveBeenCalled()
    })

    it('returns 500 when model throws', async () => {
      updateSpy.mockRejectedValue(new Error('Update failed'))

      const req = mockReq({ params: { id: '5' }, body: { name: 'Scope' }, user: fakeAdmin })
      const res = mockRes()

      await updateEquipment(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error interno al actualizar el equipamiento.'
      })
    })
  })

  // ── deleteEquipment ──────────────────────────────────────────────────────────
  describe('deleteEquipment', () => {
    const fakeDeleted = { id: 7, name: 'Old Printer' }

    it('returns 200 on successful deletion with admin', async () => {
      deleteSpy.mockResolvedValue(fakeDeleted)

      const req = mockReq({ params: { id: '7' }, user: fakeAdmin })
      const res = mockRes()

      await deleteEquipment(req, res)

      expect(deleteSpy).toHaveBeenCalledWith('7')
      expect(logActionSpy).toHaveBeenCalledWith(99, 'DELETE', 'equipment', '7', { name: 'Old Printer' })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ message: 'Equipamiento eliminado exitosamente.' })
    })

    it('skips audit log when no authenticated user', async () => {
      deleteSpy.mockResolvedValue(fakeDeleted)

      const req = mockReq({ params: { id: '7' }, user: null })
      const res = mockRes()

      await deleteEquipment(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(logActionSpy).not.toHaveBeenCalled()
    })

    it('returns 404 when equipment does not exist', async () => {
      deleteSpy.mockResolvedValue(null)

      const req = mockReq({ params: { id: '999' }, user: fakeAdmin })
      const res = mockRes()

      await deleteEquipment(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Equipamiento no encontrado.' })
      expect(logActionSpy).not.toHaveBeenCalled()
    })

    it('returns 500 when model throws', async () => {
      deleteSpy.mockRejectedValue(new Error('Delete failed'))

      const req = mockReq({ params: { id: '7' }, user: fakeAdmin })
      const res = mockRes()

      await deleteEquipment(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al eliminar el equipamiento.' })
    })
  })

  // ── getEquipmentImage ────────────────────────────────────────────────────────
  describe('getEquipmentImage', () => {
    it('serves binary image with correct headers', async () => {
      const fakeBuffer = Buffer.from('fake-image-data')
      getImageSpy.mockResolvedValue({ image_data: fakeBuffer, image_mimetype: 'image/png' })

      const req = mockReq({ params: { id: '3' } })
      const res = mockRes()

      await getEquipmentImage(req, res)

      expect(getImageSpy).toHaveBeenCalledWith('3')
      expect(res.set).toHaveBeenCalledWith('Content-Type', 'image/png')
      expect(res.set).toHaveBeenCalledWith('Cross-Origin-Resource-Policy', 'cross-origin')
      expect(res.send).toHaveBeenCalledWith(fakeBuffer)
    })

    it('returns 404 when equipment record is not found', async () => {
      getImageSpy.mockResolvedValue(null)

      const req = mockReq({ params: { id: '999' } })
      const res = mockRes()

      await getEquipmentImage(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Imagen no encontrada.' })
    })

    it('returns 404 when equipment exists but has no image_data', async () => {
      getImageSpy.mockResolvedValue({ image_data: null, image_mimetype: null })

      const req = mockReq({ params: { id: '3' } })
      const res = mockRes()

      await getEquipmentImage(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Imagen no encontrada.' })
    })

    it('returns 500 when model throws', async () => {
      getImageSpy.mockRejectedValue(new Error('DB error'))

      const req = mockReq({ params: { id: '3' } })
      const res = mockRes()

      await getEquipmentImage(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'Error interno al obtener la imagen.' })
    })
  })
})