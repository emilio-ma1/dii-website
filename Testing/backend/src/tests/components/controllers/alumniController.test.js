// src/tests/components/controllers/alumniController.test.js
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

const AlumniModel   = require('../../../models/alumniModel')
const AuditLogModel = require('../../../models/auditLogModel')
const {
  getAllAlumni,
  upsertAlumni,
  deleteAlumni,
  getAlumniImage,
} = require('../../../controllers/alumniController')

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

const baseAlumni = {
  user_id: 1,
  degree: 'Ingeniería Civil',
  specialty: 'Estructuras',
  video_url_embed: null,
  is_profile_public: true,
}

// =============================================================================
describe('alumniController', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getAllAlumni', () => {

    it('01 - Llama AlumniModel.getAll una vez', async () => {
      const getAll = vi.spyOn(AlumniModel, 'getAll').mockResolvedValue([baseAlumni])
      const res = mockRes()
      await getAllAlumni(mockReq(), res)
      expect(getAll).toHaveBeenCalledTimes(1)
    })

    it('02 - Retorna 200 con la lista de egresados', async () => {
      vi.spyOn(AlumniModel, 'getAll').mockResolvedValue([baseAlumni])
      const res = mockRes()
      await getAllAlumni(mockReq(), res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([baseAlumni])
    })

    it('03 - Retorna 200 con arreglo vacío si no hay egresados', async () => {
      vi.spyOn(AlumniModel, 'getAll').mockResolvedValue([])
      const res = mockRes()
      await getAllAlumni(mockReq(), res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([])
    })

    it('04 - Retorna 500 si AlumniModel.getAll lanza error', async () => {
      vi.spyOn(AlumniModel, 'getAll').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await getAllAlumni(mockReq(), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('upsertAlumni', () => {

    it('05 - Retorna 400 si falta user_id', async () => {
      const res = mockRes()
      await upsertAlumni(mockReq({ body: { degree: 'Ingeniería' } }), res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('06 - Retorna 400 si falta degree', async () => {
      const res = mockRes()
      await upsertAlumni(mockReq({ body: { user_id: 1 } }), res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('07 - Llama AlumniModel.upsert con los datos correctos sin archivo', async () => {
      const upsert = vi.spyOn(AlumniModel, 'upsert').mockResolvedValue(baseAlumni)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await upsertAlumni(mockReq({
        body: { user_id: 1, degree: 'Ingeniería', specialty: 'Estructuras', is_profile_public: true },
        user: { id: 10 },
        file: null,
      }), res)
      expect(upsert).toHaveBeenCalledWith(expect.objectContaining({
        user_id: 1, degree: 'Ingeniería', imageData: null, imageMimetype: null,
      }))
    })

    it('08 - Llama AlumniModel.upsert con buffer si hay archivo', async () => {
      const buf = Buffer.from('img')
      const upsert = vi.spyOn(AlumniModel, 'upsert').mockResolvedValue(baseAlumni)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await upsertAlumni(mockReq({
        body: { user_id: 1, degree: 'Ingeniería' },
        user: { id: 10 },
        file: { buffer: buf, mimetype: 'image/png' },
      }), res)
      expect(upsert).toHaveBeenCalledWith(expect.objectContaining({
        imageData: buf, imageMimetype: 'image/png',
      }))
    })

    it('09 - is_profile_public es false cuando viene "false" como string', async () => {
      const upsert = vi.spyOn(AlumniModel, 'upsert').mockResolvedValue(baseAlumni)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await upsertAlumni(mockReq({
        body: { user_id: 1, degree: 'Ingeniería', is_profile_public: 'false' },
        user: { id: 10 },
      }), res)
      expect(upsert).toHaveBeenCalledWith(expect.objectContaining({ is_profile_public: false }))
    })

    it('10 - is_profile_public es true cuando viene "true" como string', async () => {
      const upsert = vi.spyOn(AlumniModel, 'upsert').mockResolvedValue(baseAlumni)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await upsertAlumni(mockReq({
        body: { user_id: 1, degree: 'Ingeniería', is_profile_public: 'true' },
        user: { id: 10 },
      }), res)
      expect(upsert).toHaveBeenCalledWith(expect.objectContaining({ is_profile_public: true }))
    })

    it('11 - Retorna 200 con el perfil guardado', async () => {
      vi.spyOn(AlumniModel, 'upsert').mockResolvedValue(baseAlumni)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await upsertAlumni(mockReq({
        body: { user_id: 1, degree: 'Ingeniería' },
        user: { id: 10 },
      }), res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(baseAlumni)
    })

    it('12 - Llama AuditLogModel.logAction con UPSERT si hay user', async () => {
      vi.spyOn(AlumniModel, 'upsert').mockResolvedValue(baseAlumni)
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await upsertAlumni(mockReq({
        body: { user_id: 1, degree: 'Ingeniería' },
        user: { id: 10 },
      }), res)
      expect(logAction).toHaveBeenCalledWith(10, 'UPSERT', 'alumni_profiles', baseAlumni.user_id, expect.any(Object))
    })

    it('13 - No llama AuditLogModel si no hay user', async () => {
      vi.spyOn(AlumniModel, 'upsert').mockResolvedValue(baseAlumni)
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await upsertAlumni(mockReq({
        body: { user_id: 1, degree: 'Ingeniería' },
        user: null,
      }), res)
      expect(logAction).not.toHaveBeenCalled()
    })

    it('14 - Retorna 500 si AlumniModel.upsert lanza error', async () => {
      vi.spyOn(AlumniModel, 'upsert').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await upsertAlumni(mockReq({
        body: { user_id: 1, degree: 'Ingeniería' },
        user: { id: 10 },
      }), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('deleteAlumni', () => {

    it('15 - Llama AlumniModel.delete con req.params.id', async () => {
      const del = vi.spyOn(AlumniModel, 'delete').mockResolvedValue(true)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await deleteAlumni(mockReq({ params: { id: '3' }, user: { id: 1 } }), res)
      expect(del).toHaveBeenCalledWith('3')
    })

    it('16 - Retorna 404 si el perfil no existe', async () => {
      vi.spyOn(AlumniModel, 'delete').mockResolvedValue(false)
      const res = mockRes()
      await deleteAlumni(mockReq({ params: { id: '99' }, user: { id: 1 } }), res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('17 - Retorna 200 si elimina correctamente', async () => {
      vi.spyOn(AlumniModel, 'delete').mockResolvedValue(true)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await deleteAlumni(mockReq({ params: { id: '3' }, user: { id: 1 } }), res)
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('18 - Llama AuditLogModel.logAction con DELETE si hay user', async () => {
      vi.spyOn(AlumniModel, 'delete').mockResolvedValue(true)
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await deleteAlumni(mockReq({ params: { id: '3' }, user: { id: 1 } }), res)
      expect(logAction).toHaveBeenCalledWith(1, 'DELETE', 'alumni_profiles', '3', expect.any(Object))
    })

    it('19 - No llama AuditLogModel si no hay user', async () => {
      vi.spyOn(AlumniModel, 'delete').mockResolvedValue(true)
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await deleteAlumni(mockReq({ params: { id: '3' }, user: null }), res)
      expect(logAction).not.toHaveBeenCalled()
    })

    it('20 - Retorna 500 si AlumniModel.delete lanza error', async () => {
      vi.spyOn(AlumniModel, 'delete').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await deleteAlumni(mockReq({ params: { id: '3' }, user: { id: 1 } }), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getAlumniImage', () => {

    it('21 - Retorna 404 si no existe el egresado', async () => {
      vi.spyOn(AlumniModel, 'getImage').mockResolvedValue(null)
      const res = mockRes()
      await getAlumniImage(mockReq({ params: { id: '1' } }), res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('22 - Retorna 404 si image_data es null', async () => {
      vi.spyOn(AlumniModel, 'getImage').mockResolvedValue({ image_data: null })
      const res = mockRes()
      await getAlumniImage(mockReq({ params: { id: '1' } }), res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('23 - Setea Content-Type y Cross-Origin-Resource-Policy', async () => {
      const buf = Buffer.from('img')
      vi.spyOn(AlumniModel, 'getImage').mockResolvedValue({ image_data: buf, image_mimetype: 'image/jpeg' })
      const res = mockRes()
      await getAlumniImage(mockReq({ params: { id: '1' } }), res)
      expect(res.set).toHaveBeenCalledWith('Content-Type', 'image/jpeg')
      expect(res.set).toHaveBeenCalledWith('Cross-Origin-Resource-Policy', 'cross-origin')
    })

    it('24 - Envía image_data con res.send', async () => {
      const buf = Buffer.from('img')
      vi.spyOn(AlumniModel, 'getImage').mockResolvedValue({ image_data: buf, image_mimetype: 'image/jpeg' })
      const res = mockRes()
      await getAlumniImage(mockReq({ params: { id: '1' } }), res)
      expect(res.send).toHaveBeenCalledWith(buf)
    })

    it('25 - Retorna 500 si AlumniModel.getImage lanza error', async () => {
      vi.spyOn(AlumniModel, 'getImage').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await getAlumniImage(mockReq({ params: { id: '1' } }), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })
})