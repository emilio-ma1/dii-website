// src/tests/components/controllers/professorController.test.js
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

const ProfessorModel = require('../../../models/professorModel')
const AuditLogModel  = require('../../../models/auditLogModel')
const {
  getProfessors,
  upsertProfessor,
  deleteProfessor,
  getProfessorImage,
} = require('../../../controllers/professorController')

// ─── Helpers ──────────────────────────────────────────────────────────────────
const mockReq = ({ body = {}, params = {}, user = null, file = null } = {}) => ({
  body, params, user, file
})
const mockRes = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json   = vi.fn().mockReturnValue(res)
  res.set    = vi.fn().mockReturnValue(res)
  res.send   = vi.fn().mockReturnValue(res)
  return res
}

const baseProfessor = {
  user_id: 1,
  degree: 'Dr.',
  area: 'Computación',
  image_data: null,
  image_mimetype: null,
}

// =============================================================================
describe('professorController', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getProfessors', () => {

    it('01 - Llama ProfessorModel.getAll una vez', async () => {
      const getAll = vi.spyOn(ProfessorModel, 'getAll').mockResolvedValue([baseProfessor])
      const res = mockRes()
      await getProfessors(mockReq(), res)
      expect(getAll).toHaveBeenCalledTimes(1)
    })

    it('02 - Retorna 200 con la lista de profesores', async () => {
      vi.spyOn(ProfessorModel, 'getAll').mockResolvedValue([baseProfessor])
      const res = mockRes()
      await getProfessors(mockReq(), res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([baseProfessor])
    })

    it('03 - Retorna 200 con arreglo vacío si no hay profesores', async () => {
      vi.spyOn(ProfessorModel, 'getAll').mockResolvedValue([])
      const res = mockRes()
      await getProfessors(mockReq(), res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([])
    })

    it('04 - Retorna 500 si ProfessorModel.getAll lanza error', async () => {
      vi.spyOn(ProfessorModel, 'getAll').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await getProfessors(mockReq(), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('upsertProfessor', () => {

    it('05 - Retorna 400 si falta user_id', async () => {
      const res = mockRes()
      await upsertProfessor(mockReq({ body: { degree: 'Dr.', area: 'CS' } }), res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('06 - Retorna 400 si falta degree', async () => {
      const res = mockRes()
      await upsertProfessor(mockReq({ body: { user_id: 1, area: 'CS' } }), res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('07 - Retorna 400 si falta area', async () => {
      const res = mockRes()
      await upsertProfessor(mockReq({ body: { user_id: 1, degree: 'Dr.' } }), res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('08 - Llama ProfessorModel.upsert con los datos correctos sin archivo', async () => {
      const upsert = vi.spyOn(ProfessorModel, 'upsert').mockResolvedValue(baseProfessor)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await upsertProfessor(mockReq({
        body: { user_id: 1, degree: 'Dr.', area: 'CS' },
        user: { id: 10 },
        file: null,
      }), res)
      expect(upsert).toHaveBeenCalledWith({
        user_id: 1, degree: 'Dr.', area: 'CS',
        imageData: null, imageMimetype: null,
      })
    })

    it('09 - Llama ProfessorModel.upsert con buffer e imagen si hay archivo', async () => {
      const buf = Buffer.from('img')
      const upsert = vi.spyOn(ProfessorModel, 'upsert').mockResolvedValue(baseProfessor)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await upsertProfessor(mockReq({
        body: { user_id: 1, degree: 'Dr.', area: 'CS' },
        user: { id: 10 },
        file: { buffer: buf, mimetype: 'image/png' },
      }), res)
      expect(upsert).toHaveBeenCalledWith({
        user_id: 1, degree: 'Dr.', area: 'CS',
        imageData: buf, imageMimetype: 'image/png',
      })
    })

    it('10 - Retorna 200 con el perfil guardado', async () => {
      vi.spyOn(ProfessorModel, 'upsert').mockResolvedValue(baseProfessor)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await upsertProfessor(mockReq({
        body: { user_id: 1, degree: 'Dr.', area: 'CS' },
        user: { id: 10 },
      }), res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(baseProfessor)
    })

    it('11 - Llama AuditLogModel.logAction con UPSERT si hay user', async () => {
      vi.spyOn(ProfessorModel, 'upsert').mockResolvedValue(baseProfessor)
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await upsertProfessor(mockReq({
        body: { user_id: 1, degree: 'Dr.', area: 'CS' },
        user: { id: 10 },
      }), res)
      expect(logAction).toHaveBeenCalledWith(10, 'UPSERT', 'professors', baseProfessor.user_id, expect.any(Object))
    })

    it('12 - No llama AuditLogModel si no hay user', async () => {
      vi.spyOn(ProfessorModel, 'upsert').mockResolvedValue(baseProfessor)
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await upsertProfessor(mockReq({
        body: { user_id: 1, degree: 'Dr.', area: 'CS' },
        user: null,
      }), res)
      expect(logAction).not.toHaveBeenCalled()
    })

    it('13 - Retorna 500 si ProfessorModel.upsert lanza error', async () => {
      vi.spyOn(ProfessorModel, 'upsert').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await upsertProfessor(mockReq({
        body: { user_id: 1, degree: 'Dr.', area: 'CS' },
        user: { id: 10 },
      }), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('deleteProfessor', () => {

    it('14 - Llama ProfessorModel.delete con req.params.id', async () => {
      const del = vi.spyOn(ProfessorModel, 'delete').mockResolvedValue(true)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await deleteProfessor(mockReq({ params: { id: '3' }, user: { id: 1 } }), res)
      expect(del).toHaveBeenCalledWith('3')
    })

    it('15 - Retorna 404 si el perfil no existe', async () => {
      vi.spyOn(ProfessorModel, 'delete').mockResolvedValue(false)
      const res = mockRes()
      await deleteProfessor(mockReq({ params: { id: '99' }, user: { id: 1 } }), res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('16 - Retorna 200 si elimina correctamente', async () => {
      vi.spyOn(ProfessorModel, 'delete').mockResolvedValue(true)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await deleteProfessor(mockReq({ params: { id: '3' }, user: { id: 1 } }), res)
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('17 - Llama AuditLogModel.logAction con DELETE si hay user', async () => {
      vi.spyOn(ProfessorModel, 'delete').mockResolvedValue(true)
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await deleteProfessor(mockReq({ params: { id: '3' }, user: { id: 1 } }), res)
      expect(logAction).toHaveBeenCalledWith(1, 'DELETE', 'professors', '3', expect.any(Object))
    })

    it('18 - No llama AuditLogModel si no hay user', async () => {
      vi.spyOn(ProfessorModel, 'delete').mockResolvedValue(true)
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await deleteProfessor(mockReq({ params: { id: '3' }, user: null }), res)
      expect(logAction).not.toHaveBeenCalled()
    })

    it('19 - Retorna 500 si ProfessorModel.delete lanza error', async () => {
      vi.spyOn(ProfessorModel, 'delete').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await deleteProfessor(mockReq({ params: { id: '3' }, user: { id: 1 } }), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getProfessorImage', () => {

    it('20 - Retorna 404 si no existe el profesor', async () => {
      vi.spyOn(ProfessorModel, 'getImage').mockResolvedValue(null)
      const res = mockRes()
      await getProfessorImage(mockReq({ params: { id: '1' } }), res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('21 - Retorna 404 si image_data es null', async () => {
      vi.spyOn(ProfessorModel, 'getImage').mockResolvedValue({ image_data: null })
      const res = mockRes()
      await getProfessorImage(mockReq({ params: { id: '1' } }), res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('22 - Setea Content-Type y Cross-Origin-Resource-Policy', async () => {
      const buf = Buffer.from('img')
      vi.spyOn(ProfessorModel, 'getImage').mockResolvedValue({ image_data: buf, image_mimetype: 'image/jpeg' })
      const res = mockRes()
      await getProfessorImage(mockReq({ params: { id: '1' } }), res)
      expect(res.set).toHaveBeenCalledWith('Content-Type', 'image/jpeg')
      expect(res.set).toHaveBeenCalledWith('Cross-Origin-Resource-Policy', 'cross-origin')
    })

    it('23 - Envía image_data con res.send', async () => {
      const buf = Buffer.from('img')
      vi.spyOn(ProfessorModel, 'getImage').mockResolvedValue({ image_data: buf, image_mimetype: 'image/jpeg' })
      const res = mockRes()
      await getProfessorImage(mockReq({ params: { id: '1' } }), res)
      expect(res.send).toHaveBeenCalledWith(buf)
    })

    it('24 - Retorna 500 si ProfessorModel.getImage lanza error', async () => {
      vi.spyOn(ProfessorModel, 'getImage').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await getProfessorImage(mockReq({ params: { id: '1' } }), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })
})