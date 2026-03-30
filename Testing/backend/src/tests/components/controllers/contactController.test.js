/**
 * @file contactController.test.js
 * @description Integration tests for contactController.
 * Uses vi.spyOn over createRequire — vi.mock() is NOT used in this stack.
 */
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const ContactModel                                      = require('../../../models/contactModel')
const AuditLogModel                                     = require('../../../models/auditLogModel')
const { getContacts, createContact,
        updateContact, deleteContact }                  = require('../../../controllers/contactController')

// ─── Helpers ──────────────────────────────────────────────────────────────────
const mockReq = ({ body = {}, params = {}, user = null } = {}) =>
  ({ body, params, user })

const mockRes = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json   = vi.fn().mockReturnValue(res)
  return res
}

const fakeAdmin = { id: 42 }

// ─── Suite ────────────────────────────────────────────────────────────────────
describe('contactController', () => {

  let getAllSpy, createSpy, updateSpy, deleteSpy, logActionSpy

  beforeEach(() => {
    getAllSpy     = vi.spyOn(ContactModel,  'getAll')
    createSpy    = vi.spyOn(ContactModel,  'create')
    updateSpy    = vi.spyOn(ContactModel,  'update')
    deleteSpy    = vi.spyOn(ContactModel,  'delete')
    logActionSpy = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ── getContacts ──────────────────────────────────────────────────────────────
  describe('getContacts', () => {
    it('returns 200 with the full contacts list', async () => {
      const fakeList = [{ id: 1, full_name: 'Ana Torres' }, { id: 2, full_name: 'Luis Vera' }]
      getAllSpy.mockResolvedValue(fakeList)

      const req = mockReq()
      const res = mockRes()

      await getContacts(req, res)

      expect(getAllSpy).toHaveBeenCalledOnce()
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(fakeList)
    })

    it('returns 200 with an empty array when no contacts exist', async () => {
      getAllSpy.mockResolvedValue([])

      const req = mockReq()
      const res = mockRes()

      await getContacts(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([])
    })

    it('returns 500 when model throws', async () => {
      getAllSpy.mockRejectedValue(new Error('DB error'))

      const req = mockReq()
      const res = mockRes()

      await getContacts(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error interno al obtener los contactos.'
      })
    })
  })

  // ── createContact ────────────────────────────────────────────────────────────
  describe('createContact', () => {
    const fakeContact = { id: 10, initials: 'AT', full_name: 'Ana Torres', role: 'Jefa' }

    it('returns 201 with new contact and logs action when admin present', async () => {
      createSpy.mockResolvedValue(fakeContact)

      const req = mockReq({
        body: { initials: 'AT', full_name: 'Ana Torres', role: 'Jefa' },
        user: fakeAdmin
      })
      const res = mockRes()

      await createContact(req, res)

      expect(createSpy).toHaveBeenCalledWith('AT', 'Ana Torres', 'Jefa')
      expect(logActionSpy).toHaveBeenCalledWith(42, 'CREATE', 'contacts', 10, { name: 'Ana Torres' })
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Contacto registrado exitosamente.',
        contact: fakeContact
      })
    })

    it('skips audit log when no authenticated user', async () => {
      createSpy.mockResolvedValue(fakeContact)

      const req = mockReq({
        body: { initials: 'AT', full_name: 'Ana Torres', role: 'Jefa' },
        user: null
      })
      const res = mockRes()

      await createContact(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(logActionSpy).not.toHaveBeenCalled()
    })

    it('returns 400 when initials is missing', async () => {
      const req = mockReq({ body: { full_name: 'Ana Torres', role: 'Jefa' } })
      const res = mockRes()

      await createContact(req, res)

      expect(createSpy).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Las iniciales, nombre completo y cargo son obligatorios.'
      })
    })

    it('returns 400 when full_name is missing', async () => {
      const req = mockReq({ body: { initials: 'AT', role: 'Jefa' } })
      const res = mockRes()

      await createContact(req, res)

      expect(createSpy).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('returns 400 when role is missing', async () => {
      const req = mockReq({ body: { initials: 'AT', full_name: 'Ana Torres' } })
      const res = mockRes()

      await createContact(req, res)

      expect(createSpy).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('returns 400 when body is empty', async () => {
      const req = mockReq({ body: {} })
      const res = mockRes()

      await createContact(req, res)

      expect(createSpy).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('returns 500 when model throws', async () => {
      createSpy.mockRejectedValue(new Error('Insert failed'))

      const req = mockReq({
        body: { initials: 'AT', full_name: 'Ana Torres', role: 'Jefa' },
        user: fakeAdmin
      })
      const res = mockRes()

      await createContact(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error interno al registrar el contacto.'
      })
    })
  })

  // ── updateContact ────────────────────────────────────────────────────────────
  describe('updateContact', () => {
    const fakeUpdated = { id: 5, initials: 'LV', full_name: 'Luis Vera', role: 'Director' }

    it('returns 200 with updated contact and logs action when admin present', async () => {
      updateSpy.mockResolvedValue(fakeUpdated)

      const req = mockReq({
        params: { id: '5' },
        body: { initials: 'LV', full_name: 'Luis Vera', role: 'Director' },
        user: fakeAdmin
      })
      const res = mockRes()

      await updateContact(req, res)

      expect(updateSpy).toHaveBeenCalledWith('5', 'LV', 'Luis Vera', 'Director')
      expect(logActionSpy).toHaveBeenCalledWith(42, 'UPDATE', 'contacts', '5', { name: 'Luis Vera' })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Contacto actualizado.',
        contact: fakeUpdated
      })
    })

    it('skips audit log when no authenticated user', async () => {
      updateSpy.mockResolvedValue(fakeUpdated)

      const req = mockReq({
        params: { id: '5' },
        body: { initials: 'LV', full_name: 'Luis Vera', role: 'Director' },
        user: null
      })
      const res = mockRes()

      await updateContact(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(logActionSpy).not.toHaveBeenCalled()
    })

    it('returns 400 when initials is missing', async () => {
      const req = mockReq({
        params: { id: '5' },
        body: { full_name: 'Luis Vera', role: 'Director' }
      })
      const res = mockRes()

      await updateContact(req, res)

      expect(updateSpy).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Las iniciales, nombre completo y cargo son obligatorios.'
      })
    })

    it('returns 400 when full_name is missing', async () => {
      const req = mockReq({
        params: { id: '5' },
        body: { initials: 'LV', role: 'Director' }
      })
      const res = mockRes()

      await updateContact(req, res)

      expect(updateSpy).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('returns 400 when role is missing', async () => {
      const req = mockReq({
        params: { id: '5' },
        body: { initials: 'LV', full_name: 'Luis Vera' }
      })
      const res = mockRes()

      await updateContact(req, res)

      expect(updateSpy).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('returns 404 when contact does not exist', async () => {
      updateSpy.mockResolvedValue(null)

      const req = mockReq({
        params: { id: '999' },
        body: { initials: 'XX', full_name: 'Ghost', role: 'None' },
        user: fakeAdmin
      })
      const res = mockRes()

      await updateContact(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Contacto no encontrado.' })
      expect(logActionSpy).not.toHaveBeenCalled()
    })

    it('returns 500 when model throws', async () => {
      updateSpy.mockRejectedValue(new Error('Update failed'))

      const req = mockReq({
        params: { id: '5' },
        body: { initials: 'LV', full_name: 'Luis Vera', role: 'Director' },
        user: fakeAdmin
      })
      const res = mockRes()

      await updateContact(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error interno al actualizar el contacto.'
      })
    })
  })

  // ── deleteContact ────────────────────────────────────────────────────────────
  describe('deleteContact', () => {
    const fakeDeleted = { id: 7, full_name: 'Pedro Soto' }

    it('returns 200 on successful deletion and logs action when admin present', async () => {
      deleteSpy.mockResolvedValue(fakeDeleted)

      const req = mockReq({ params: { id: '7' }, user: fakeAdmin })
      const res = mockRes()

      await deleteContact(req, res)

      expect(deleteSpy).toHaveBeenCalledWith('7')
      expect(logActionSpy).toHaveBeenCalledWith(42, 'DELETE', 'contacts', '7', { id: '7' })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ message: 'Contacto eliminado exitosamente.' })
    })

    it('skips audit log when no authenticated user', async () => {
      deleteSpy.mockResolvedValue(fakeDeleted)

      const req = mockReq({ params: { id: '7' }, user: null })
      const res = mockRes()

      await deleteContact(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(logActionSpy).not.toHaveBeenCalled()
    })

    it('returns 404 when contact does not exist', async () => {
      deleteSpy.mockResolvedValue(null)

      const req = mockReq({ params: { id: '999' }, user: fakeAdmin })
      const res = mockRes()

      await deleteContact(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Contacto no encontrado.' })
      expect(logActionSpy).not.toHaveBeenCalled()
    })

    it('returns 500 when model throws', async () => {
      deleteSpy.mockRejectedValue(new Error('Delete failed'))

      const req = mockReq({ params: { id: '7' }, user: fakeAdmin })
      const res = mockRes()

      await deleteContact(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error interno al eliminar el contacto.'
      })
    })
  })
})