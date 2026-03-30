// src/tests/components/controllers/projectController.test.js
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

const ProjectModel  = require('../../../models/projectModel')
const AuditLogModel = require('../../../models/auditLogModel')
const {
  getAllProjects, getProjectById, createProject, updateProject,
  deleteProject, getPanelProjects, getProjectImage, getProjectPdf
} = require('../../../controllers/projectController')

// ─── Helpers ──────────────────────────────────────────────────────────────────
const mockReq = (body = {}, params = {}, user = null, files = null) => ({
  body, params, user, files, ip: '127.0.0.1'
})
const mockRes = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json   = vi.fn().mockReturnValue(res)
  res.set    = vi.fn().mockReturnValue(res)
  res.send   = vi.fn().mockReturnValue(res)
  return res
}

const baseProject = {
  id: 1,
  title: 'Proyecto Test',
  authors: [{ id: 5 }, { id: 6 }]
}

// =============================================================================
describe('projectController', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getAllProjects', () => {

    it('01 - Retorna 200 con la lista de proyectos', async () => {
      vi.spyOn(ProjectModel, 'getAll').mockResolvedValue([baseProject])
      const res = mockRes()
      await getAllProjects(mockReq(), res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([baseProject])
    })

    it('02 - Retorna 200 con lista vacía si no hay proyectos', async () => {
      vi.spyOn(ProjectModel, 'getAll').mockResolvedValue([])
      const res = mockRes()
      await getAllProjects(mockReq(), res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([])
    })

    it('03 - Retorna 500 si ProjectModel.getAll lanza error', async () => {
      vi.spyOn(ProjectModel, 'getAll').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await getAllProjects(mockReq(), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getProjectById', () => {

    it('04 - Retorna 200 con el proyecto si existe', async () => {
      vi.spyOn(ProjectModel, 'getById').mockResolvedValue(baseProject)
      const res = mockRes()
      await getProjectById(mockReq({}, { id: '1' }), res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(baseProject)
    })

    it('05 - Retorna 404 si el proyecto no existe', async () => {
      vi.spyOn(ProjectModel, 'getById').mockResolvedValue(null)
      const res = mockRes()
      await getProjectById(mockReq({}, { id: '99' }), res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('06 - Retorna 500 si ProjectModel.getById lanza error', async () => {
      vi.spyOn(ProjectModel, 'getById').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await getProjectById(mockReq({}, { id: '1' }), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('createProject', () => {

    it('07 - Retorna 400 si falta title', async () => {
      const req = mockReq({ category_id: 1 }, {}, { id: 1 })
      const res = mockRes()
      await createProject(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('08 - Retorna 400 si falta category_id', async () => {
      const req = mockReq({ title: 'T' }, {}, { id: 1 })
      const res = mockRes()
      await createProject(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('09 - Retorna 400 si la imagen supera 2MB', async () => {
      const req = mockReq(
        { title: 'T', category_id: 1 }, {}, { id: 1 },
        { image: [{ buffer: Buffer.alloc(1), mimetype: 'image/png', size: 3 * 1024 * 1024 }] }
      )
      const res = mockRes()
      await createProject(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('10 - Retorna 400 si el PDF supera 5MB', async () => {
      const req = mockReq(
        { title: 'T', category_id: 1 }, {}, { id: 1 },
        { pdf: [{ buffer: Buffer.alloc(1), mimetype: 'application/pdf', size: 6 * 1024 * 1024 }] }
      )
      const res = mockRes()
      await createProject(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('11 - Retorna 201 con el proyecto creado', async () => {
      const newProject = { id: 10, title: 'T' }
      vi.spyOn(ProjectModel, 'create').mockResolvedValue(newProject)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ title: 'T', category_id: 1 }, {}, { id: 5 })
      const res = mockRes()
      await createProject(req, res)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(newProject)
    })

    it('12 - Llama a AuditLogModel.logAction con CREATE si hay user', async () => {
      const newProject = { id: 10, title: 'T' }
      vi.spyOn(ProjectModel, 'create').mockResolvedValue(newProject)
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ title: 'T', category_id: 1 }, {}, { id: 5 })
      const res = mockRes()
      await createProject(req, res)
      expect(logAction).toHaveBeenCalledWith(5, 'CREATE', 'projects', newProject.id, expect.any(Object))
    })

    it('13 - No llama a AuditLogModel si no hay user', async () => {
      vi.spyOn(ProjectModel, 'create').mockResolvedValue({ id: 10, title: 'T' })
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ title: 'T', category_id: 1 }, {}, null)
      const res = mockRes()
      await createProject(req, res)
      expect(logAction).not.toHaveBeenCalled()
    })

    it('14 - Extrae authors correctamente desde array de objetos', async () => {
      const newProject = { id: 10, title: 'T' }
      const create = vi.spyOn(ProjectModel, 'create').mockResolvedValue(newProject)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq(
        { title: 'T', category_id: 1, authors: [{ id: 3 }, { id: 7 }] },
        {}, { id: 1 }
      )
      const res = mockRes()
      await createProject(req, res)
      expect(create).toHaveBeenCalledWith(expect.any(Object), [3, 7])
    })

    it('15 - Retorna 500 si ProjectModel.create lanza error', async () => {
      vi.spyOn(ProjectModel, 'create').mockRejectedValue(new Error('db'))
      const req = mockReq({ title: 'T', category_id: 1 }, {}, { id: 1 })
      const res = mockRes()
      await createProject(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('updateProject', () => {

    it('16 - Retorna 400 si falta title', async () => {
      const res = mockRes()
      await updateProject(mockReq({}, { id: '1' }, { id: 1, role: 'admin' }), res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('17 - Retorna 404 si el proyecto no existe', async () => {
      vi.spyOn(ProjectModel, 'getById').mockResolvedValue(null)
      const res = mockRes()
      await updateProject(mockReq({ title: 'T' }, { id: '99' }, { id: 1, role: 'admin' }), res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('18 - Retorna 403 si el usuario no es autor ni admin', async () => {
      vi.spyOn(ProjectModel, 'getById').mockResolvedValue({
        ...baseProject,
        authors: [{ id: 5 }, { id: 6 }]
      })
      const res = mockRes()
      await updateProject(mockReq({ title: 'T' }, { id: '1' }, { id: 99, role: 'teacher' }), res)
      expect(res.status).toHaveBeenCalledWith(403)
    })

    it('19 - Admin puede editar proyectos de otros', async () => {
      vi.spyOn(ProjectModel, 'getById').mockResolvedValue({ ...baseProject, authors: [{ id: 5 }] })
      vi.spyOn(ProjectModel, 'update').mockResolvedValue({ id: 1, title: 'T' })
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await updateProject(mockReq({ title: 'T' }, { id: '1' }, { id: 99, role: 'admin' }), res)
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('20 - Autor puede editar su propio proyecto', async () => {
      vi.spyOn(ProjectModel, 'getById').mockResolvedValue({ ...baseProject, authors: [{ id: 5 }] })
      vi.spyOn(ProjectModel, 'update').mockResolvedValue({ id: 1, title: 'T' })
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await updateProject(mockReq({ title: 'T' }, { id: '1' }, { id: 5, role: 'teacher' }), res)
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('21 - Retorna 400 si imagen supera 2MB en update', async () => {
      vi.spyOn(ProjectModel, 'getById').mockResolvedValue({ ...baseProject, authors: [{ id: 1 }] })
      const req = mockReq(
        { title: 'T' }, { id: '1' }, { id: 1, role: 'admin' },
        { image: [{ buffer: Buffer.alloc(1), mimetype: 'image/png', size: 3 * 1024 * 1024 }] }
      )
      const res = mockRes()
      await updateProject(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('22 - Llama a AuditLogModel.logAction con UPDATE', async () => {
      vi.spyOn(ProjectModel, 'getById').mockResolvedValue({ ...baseProject, authors: [{ id: 1 }] })
      vi.spyOn(ProjectModel, 'update').mockResolvedValue({ id: 1, title: 'T' })
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await updateProject(mockReq({ title: 'T' }, { id: '1' }, { id: 1, role: 'admin' }), res)
      expect(logAction).toHaveBeenCalledWith(1, 'UPDATE', 'projects', '1', expect.any(Object))
    })

    it('23 - Retorna 500 si ProjectModel.update lanza error', async () => {
      vi.spyOn(ProjectModel, 'getById').mockResolvedValue({ ...baseProject, authors: [{ id: 1 }] })
      vi.spyOn(ProjectModel, 'update').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await updateProject(mockReq({ title: 'T' }, { id: '1' }, { id: 1, role: 'admin' }), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('deleteProject', () => {

    it('24 - Retorna 404 si el proyecto no existe', async () => {
      vi.spyOn(ProjectModel, 'getById').mockResolvedValue(null)
      const res = mockRes()
      await deleteProject(mockReq({}, { id: '99' }, { id: 1, role: 'admin' }), res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('25 - Retorna 403 si el usuario no es autor ni admin', async () => {
      vi.spyOn(ProjectModel, 'getById').mockResolvedValue({ ...baseProject, authors: [{ id: 5 }] })
      const res = mockRes()
      await deleteProject(mockReq({}, { id: '1' }, { id: 99, role: 'teacher' }), res)
      expect(res.status).toHaveBeenCalledWith(403)
    })

    it('26 - Admin puede eliminar proyectos de otros', async () => {
      vi.spyOn(ProjectModel, 'getById').mockResolvedValue({ ...baseProject, authors: [{ id: 5 }] })
      vi.spyOn(ProjectModel, 'delete').mockResolvedValue({ id: 1, title: 'T' })
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await deleteProject(mockReq({}, { id: '1' }, { id: 99, role: 'admin' }), res)
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('27 - Autor puede eliminar su propio proyecto', async () => {
      vi.spyOn(ProjectModel, 'getById').mockResolvedValue({ ...baseProject, authors: [{ id: 5 }] })
      vi.spyOn(ProjectModel, 'delete').mockResolvedValue({ id: 1, title: 'T' })
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await deleteProject(mockReq({}, { id: '1' }, { id: 5, role: 'teacher' }), res)
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('28 - Llama a AuditLogModel.logAction con DELETE', async () => {
      vi.spyOn(ProjectModel, 'getById').mockResolvedValue({ ...baseProject, authors: [{ id: 1 }] })
      vi.spyOn(ProjectModel, 'delete').mockResolvedValue({ id: 1, title: 'T' })
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await deleteProject(mockReq({}, { id: '1' }, { id: 1, role: 'admin' }), res)
      expect(logAction).toHaveBeenCalledWith(1, 'DELETE', 'projects', '1', expect.any(Object))
    })

    it('29 - Retorna 500 si ProjectModel.delete lanza error', async () => {
      vi.spyOn(ProjectModel, 'getById').mockResolvedValue({ ...baseProject, authors: [{ id: 1 }] })
      vi.spyOn(ProjectModel, 'delete').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await deleteProject(mockReq({}, { id: '1' }, { id: 1, role: 'admin' }), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getPanelProjects', () => {

    it('30 - Admin recibe todos los proyectos', async () => {
      const all = [{ id: 1 }, { id: 2 }]
      vi.spyOn(ProjectModel, 'getAll').mockResolvedValue(all)
      const res = mockRes()
      await getPanelProjects(mockReq({}, {}, { id: 1, role: 'admin' }), res)
      expect(ProjectModel.getAll).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(all)
    })

    it('31 - Teacher recibe solo sus proyectos', async () => {
      const mine = [{ id: 3 }]
      vi.spyOn(ProjectModel, 'getByAuthorId').mockResolvedValue(mine)
      const res = mockRes()
      await getPanelProjects(mockReq({}, {}, { id: 5, role: 'teacher' }), res)
      expect(ProjectModel.getByAuthorId).toHaveBeenCalledWith(5)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mine)
    })

    it('32 - Retorna 500 si lanza error', async () => {
      vi.spyOn(ProjectModel, 'getAll').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await getPanelProjects(mockReq({}, {}, { id: 1, role: 'admin' }), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getProjectImage', () => {

    it('33 - Retorna 404 si no hay imagen', async () => {
      vi.spyOn(ProjectModel, 'getImage').mockResolvedValue(null)
      const res = mockRes()
      await getProjectImage(mockReq({}, { id: '1' }), res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('34 - Retorna 404 si image_data es null', async () => {
      vi.spyOn(ProjectModel, 'getImage').mockResolvedValue({ image_data: null })
      const res = mockRes()
      await getProjectImage(mockReq({}, { id: '1' }), res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('35 - Envía imagen con Content-Type correcto', async () => {
      const buf = Buffer.from('img')
      vi.spyOn(ProjectModel, 'getImage').mockResolvedValue({ image_data: buf, image_mimetype: 'image/jpeg' })
      const res = mockRes()
      await getProjectImage(mockReq({}, { id: '1' }), res)
      expect(res.set).toHaveBeenCalledWith('Content-Type', 'image/jpeg')
      expect(res.send).toHaveBeenCalledWith(buf)
    })

    it('36 - Retorna 500 si ProjectModel.getImage lanza error', async () => {
      vi.spyOn(ProjectModel, 'getImage').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await getProjectImage(mockReq({}, { id: '1' }), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getProjectPdf', () => {

    it('37 - Retorna 404 si no hay PDF', async () => {
      vi.spyOn(ProjectModel, 'getPdf').mockResolvedValue(null)
      const res = mockRes()
      await getProjectPdf(mockReq({}, { id: '1' }), res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('38 - Retorna 404 si pdf_data es null', async () => {
      vi.spyOn(ProjectModel, 'getPdf').mockResolvedValue({ pdf_data: null })
      const res = mockRes()
      await getProjectPdf(mockReq({}, { id: '1' }), res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('39 - Envía PDF con Content-Type y Content-Disposition correctos', async () => {
      const buf = Buffer.from('pdf')
      vi.spyOn(ProjectModel, 'getPdf').mockResolvedValue({ pdf_data: buf, pdf_mimetype: 'application/pdf' })
      const res = mockRes()
      await getProjectPdf(mockReq({}, { id: '1' }), res)
      expect(res.set).toHaveBeenCalledWith('Content-Type', 'application/pdf')
      expect(res.set).toHaveBeenCalledWith('Content-Disposition', 'inline; filename="investigacion.pdf"')
      expect(res.send).toHaveBeenCalledWith(buf)
    })

    it('40 - Retorna 500 si ProjectModel.getPdf lanza error', async () => {
      vi.spyOn(ProjectModel, 'getPdf').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await getProjectPdf(mockReq({}, { id: '1' }), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })
})