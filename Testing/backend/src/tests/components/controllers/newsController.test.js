// src/tests/components/controllers/newsController.test.js
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

const NewsModel     = require('../../../models/newsModel')
const AuditLogModel = require('../../../models/auditLogModel')
const { getNews, createNews, updateNews, deleteNews, getNewsBySlug, getNewsImage } =
  require('../../../controllers/newsController')

// ─── Helpers ──────────────────────────────────────────────────────────────────
const mockReq = (body = {}, params = {}, user = null, file = null) => ({
  body, params, user, file, ip: '127.0.0.1'
})
const mockRes = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json   = vi.fn().mockReturnValue(res)
  res.set    = vi.fn().mockReturnValue(res)
  res.send   = vi.fn().mockReturnValue(res)
  return res
}

// =============================================================================
describe('newsController', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getNews', () => {

    it('01 - Retorna 200 con la lista de noticias', async () => {
      const list = [{ id: 1, title: 'News A' }, { id: 2, title: 'News B' }]
      vi.spyOn(NewsModel, 'getAll').mockResolvedValue(list)
      const req = mockReq()
      const res = mockRes()
      await getNews(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(list)
    })

    it('02 - Retorna 200 con lista vacía si no hay noticias', async () => {
      vi.spyOn(NewsModel, 'getAll').mockResolvedValue([])
      const req = mockReq()
      const res = mockRes()
      await getNews(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([])
    })

    it('03 - Retorna 500 si NewsModel.getAll lanza error', async () => {
      vi.spyOn(NewsModel, 'getAll').mockRejectedValue(new Error('db error'))
      const req = mockReq()
      const res = mockRes()
      await getNews(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }))
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('createNews', () => {

    it('04 - Retorna 400 si falta title', async () => {
      const req = mockReq({ content: 'Contenido' }, {}, { id: 1 })
      const res = mockRes()
      await createNews(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('05 - Retorna 400 si falta content', async () => {
      const req = mockReq({ title: 'Título' }, {}, { id: 1 })
      const res = mockRes()
      await createNews(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('06 - Retorna 201 con la noticia creada', async () => {
      const newPost = { id: 10, title: 'Nueva noticia', slug: 'nueva-noticia' }
      vi.spyOn(NewsModel, 'create').mockResolvedValue(newPost)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ title: 'Nueva noticia', content: 'Contenido' }, {}, { id: 5 })
      const res = mockRes()
      await createNews(req, res)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ news: newPost }))
    })

    it('07 - Llama a NewsModel.create con los parámetros correctos', async () => {
      const newPost = { id: 10, title: 'Título' }
      const create = vi.spyOn(NewsModel, 'create').mockResolvedValue(newPost)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ title: 'Título', content: 'Contenido', is_active: true }, {}, { id: 5 })
      const res = mockRes()
      await createNews(req, res)
      expect(create).toHaveBeenCalledWith(
        'Título', expect.any(String), 'Contenido', null, null, 5, true
      )
    })

    it('08 - Pasa buffer e mimetype si hay archivo adjunto', async () => {
      const newPost = { id: 11, title: 'Con imagen' }
      const create = vi.spyOn(NewsModel, 'create').mockResolvedValue(newPost)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const file = { buffer: Buffer.from('img'), mimetype: 'image/png' }
      const req = mockReq({ title: 'Con imagen', content: 'Contenido' }, {}, { id: 5 }, file)
      const res = mockRes()
      await createNews(req, res)
      expect(create).toHaveBeenCalledWith(
        'Con imagen', expect.any(String), 'Contenido', file.buffer, 'image/png', 5, true
      )
    })

    it('09 - Llama a AuditLogModel.logAction con CREATE si hay authorId', async () => {
      const newPost = { id: 10, title: 'T' }
      vi.spyOn(NewsModel, 'create').mockResolvedValue(newPost)
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ title: 'T', content: 'C' }, {}, { id: 7 })
      const res = mockRes()
      await createNews(req, res)
      expect(logAction).toHaveBeenCalledWith(7, 'CREATE', 'news', newPost.id, expect.any(Object))
    })

    it('10 - No llama a AuditLogModel si no hay authorId', async () => {
      const newPost = { id: 10, title: 'T' }
      vi.spyOn(NewsModel, 'create').mockResolvedValue(newPost)
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ title: 'T', content: 'C' }, {}, null) // sin user
      const res = mockRes()
      await createNews(req, res)
      expect(logAction).not.toHaveBeenCalled()
    })

    it('11 - Interpreta is_active=false correctamente', async () => {
      const newPost = { id: 12, title: 'T' }
      const create = vi.spyOn(NewsModel, 'create').mockResolvedValue(newPost)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ title: 'T', content: 'C', is_active: 'false' }, {}, { id: 1 })
      const res = mockRes()
      await createNews(req, res)
      expect(create).toHaveBeenCalledWith(
        'T', expect.any(String), 'C', null, null, 1, false
      )
    })

    it('12 - Retorna 500 si NewsModel.create lanza error', async () => {
      vi.spyOn(NewsModel, 'create').mockRejectedValue(new Error('db error'))
      const req = mockReq({ title: 'T', content: 'C' }, {}, { id: 1 })
      const res = mockRes()
      await createNews(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('updateNews', () => {

    it('13 - Retorna 400 si falta title', async () => {
      const req = mockReq({ content: 'C' }, { id: '1' }, { id: 1 })
      const res = mockRes()
      await updateNews(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('14 - Retorna 400 si falta content', async () => {
      const req = mockReq({ title: 'T' }, { id: '1' }, { id: 1 })
      const res = mockRes()
      await updateNews(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('15 - Retorna 404 si la noticia no existe', async () => {
      vi.spyOn(NewsModel, 'update').mockResolvedValue(null)
      const req = mockReq({ title: 'T', content: 'C' }, { id: '99' }, { id: 1 })
      const res = mockRes()
      await updateNews(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('16 - Retorna 200 con la noticia actualizada', async () => {
      const updated = { id: 1, title: 'T actualizado', is_active: true }
      vi.spyOn(NewsModel, 'update').mockResolvedValue(updated)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ title: 'T actualizado', content: 'C' }, { id: '1' }, { id: 2 })
      const res = mockRes()
      await updateNews(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ news: updated }))
    })

    it('17 - Usa el slug del body si se provee', async () => {
      const updated = { id: 1, title: 'T', is_active: true }
      const update = vi.spyOn(NewsModel, 'update').mockResolvedValue(updated)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ title: 'T', content: 'C', slug: 'mi-slug' }, { id: '1' }, { id: 1 })
      const res = mockRes()
      await updateNews(req, res)
      expect(update).toHaveBeenCalledWith('1', 'T', 'mi-slug', 'C', null, null, true)
    })

    it('18 - Genera slug desde title si no se provee slug', async () => {
      const updated = { id: 1, title: 'Mi Título', is_active: true }
      const update = vi.spyOn(NewsModel, 'update').mockResolvedValue(updated)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ title: 'Mi Título', content: 'C' }, { id: '1' }, { id: 1 })
      const res = mockRes()
      await updateNews(req, res)
      expect(update).toHaveBeenCalledWith('1', 'Mi Título', 'mi-titulo', 'C', null, null, true)
    })

    it('19 - Llama a AuditLogModel.logAction con UPDATE', async () => {
      const updated = { id: 1, title: 'T', is_active: true }
      vi.spyOn(NewsModel, 'update').mockResolvedValue(updated)
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({ title: 'T', content: 'C' }, { id: '1' }, { id: 3 })
      const res = mockRes()
      await updateNews(req, res)
      expect(logAction).toHaveBeenCalledWith(3, 'UPDATE', 'news', '1', expect.any(Object))
    })

    it('20 - Retorna 500 si NewsModel.update lanza error', async () => {
      vi.spyOn(NewsModel, 'update').mockRejectedValue(new Error('db error'))
      const req = mockReq({ title: 'T', content: 'C' }, { id: '1' }, { id: 1 })
      const res = mockRes()
      await updateNews(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('deleteNews', () => {

    it('21 - Retorna 404 si la noticia no existe', async () => {
      vi.spyOn(NewsModel, 'delete').mockResolvedValue(null)
      const req = mockReq({}, { id: '99' }, { id: 1 })
      const res = mockRes()
      await deleteNews(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('22 - Retorna 200 si la noticia se elimina correctamente', async () => {
      vi.spyOn(NewsModel, 'delete').mockResolvedValue({ id: 1, title: 'T' })
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({}, { id: '1' }, { id: 2 })
      const res = mockRes()
      await deleteNews(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }))
    })

    it('23 - Llama a AuditLogModel.logAction con DELETE', async () => {
      vi.spyOn(NewsModel, 'delete').mockResolvedValue({ id: 1, title: 'T' })
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({}, { id: '1' }, { id: 4 })
      const res = mockRes()
      await deleteNews(req, res)
      expect(logAction).toHaveBeenCalledWith(4, 'DELETE', 'news', '1', expect.any(Object))
    })

    it('24 - No llama a AuditLogModel si no hay adminId', async () => {
      vi.spyOn(NewsModel, 'delete').mockResolvedValue({ id: 1, title: 'T' })
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({}, { id: '1' }, null)
      const res = mockRes()
      await deleteNews(req, res)
      expect(logAction).not.toHaveBeenCalled()
    })

    it('25 - Retorna 500 si NewsModel.delete lanza error', async () => {
      vi.spyOn(NewsModel, 'delete').mockRejectedValue(new Error('db error'))
      const req = mockReq({}, { id: '1' }, { id: 1 })
      const res = mockRes()
      await deleteNews(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getNewsBySlug', () => {

    it('26 - Retorna 404 si la noticia no existe', async () => {
      vi.spyOn(NewsModel, 'getBySlug').mockResolvedValue(null)
      const req = mockReq({}, { slug: 'no-existe' }, null)
      const res = mockRes()
      await getNewsBySlug(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('27 - Retorna 200 con la noticia si existe', async () => {
      const item = { id: 1, title: 'T', slug: 'mi-slug' }
      vi.spyOn(NewsModel, 'getBySlug').mockResolvedValue(item)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({}, { slug: 'mi-slug' }, { id: 1 })
      const res = mockRes()
      await getNewsBySlug(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(item)
    })

    it('28 - Llama a AuditLogModel.logAction con READ si hay userId', async () => {
      const item = { id: 5, title: 'T', slug: 'slug' }
      vi.spyOn(NewsModel, 'getBySlug').mockResolvedValue(item)
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({}, { slug: 'slug' }, { id: 9 })
      const res = mockRes()
      await getNewsBySlug(req, res)
      expect(logAction).toHaveBeenCalledWith(9, 'READ', 'news', item.id, expect.any(Object))
    })

    it('29 - No llama a AuditLogModel si no hay userId', async () => {
      const item = { id: 5, title: 'T', slug: 'slug' }
      vi.spyOn(NewsModel, 'getBySlug').mockResolvedValue(item)
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const req = mockReq({}, { slug: 'slug' }, null)
      const res = mockRes()
      await getNewsBySlug(req, res)
      expect(logAction).not.toHaveBeenCalled()
    })

    it('30 - Retorna 500 si NewsModel.getBySlug lanza error', async () => {
      vi.spyOn(NewsModel, 'getBySlug').mockRejectedValue(new Error('db error'))
      const req = mockReq({}, { slug: 'slug' }, null)
      const res = mockRes()
      await getNewsBySlug(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getNewsImage', () => {

    it('31 - Retorna 404 si no existe la noticia', async () => {
      vi.spyOn(NewsModel, 'getImage').mockResolvedValue(null)
      const req = mockReq({}, { id: '99' })
      const res = mockRes()
      await getNewsImage(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('32 - Retorna 404 si la noticia existe pero no tiene imagen', async () => {
      vi.spyOn(NewsModel, 'getImage').mockResolvedValue({ image_data: null })
      const req = mockReq({}, { id: '1' })
      const res = mockRes()
      await getNewsImage(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('33 - Envía la imagen con el Content-Type correcto', async () => {
      const imgData = Buffer.from('fakeimg')
      vi.spyOn(NewsModel, 'getImage').mockResolvedValue({
        image_data: imgData,
        image_mimetype: 'image/jpeg'
      })
      const req = mockReq({}, { id: '1' })
      const res = mockRes()
      await getNewsImage(req, res)
      expect(res.set).toHaveBeenCalledWith('Content-Type', 'image/jpeg')
      expect(res.send).toHaveBeenCalledWith(imgData)
    })

    it('34 - Setea el header Cross-Origin-Resource-Policy', async () => {
      vi.spyOn(NewsModel, 'getImage').mockResolvedValue({
        image_data: Buffer.from('img'),
        image_mimetype: 'image/png'
      })
      const req = mockReq({}, { id: '1' })
      const res = mockRes()
      await getNewsImage(req, res)
      expect(res.set).toHaveBeenCalledWith('Cross-Origin-Resource-Policy', 'cross-origin')
    })

    it('35 - Retorna 500 si NewsModel.getImage lanza error', async () => {
      vi.spyOn(NewsModel, 'getImage').mockRejectedValue(new Error('db error'))
      const req = mockReq({}, { id: '1' })
      const res = mockRes()
      await getNewsImage(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })
})