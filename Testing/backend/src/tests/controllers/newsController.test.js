import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../models/newsModel', () => ({
  getAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  getBySlug: vi.fn(),
}))

vi.mock('../../models/auditLogModel', () => ({
  logAction: vi.fn(),
}))

const NewsModel = require('../../models/newsModel')
const AuditLogModel = require('../../models/auditLogModel')
const {
  getNews,
  createNews,
  updateNews,
  deleteNews,
  getNewsBySlug,
} = require('../../controllers/newsController')

function mockRequest({ body = {}, params = {}, user = null } = {}) {
  return { body, params, user }
}

function mockResponse() {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('newsController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getNews', () => {
    it('01 - Llama NewsModel.getAll una vez')
    it('02 - Retorna 200 con la lista de noticias')
    it('03 - Retorna 500 si ocurre error interno')
  })

  describe('createNews', () => {
    it('04 - Retorna 400 si falta title')
    it('05 - Retorna 400 si falta content')
    it('06 - Genera slug a partir del title y Date.now')
    it('07 - Usa image_url null por defecto')
    it('08 - Usa is_active true por defecto')
    it('09 - Usa req.user.id como authorId si existe usuario autenticado')
    it('10 - Usa authorId null si no existe req.user')
    it('11 - Retorna 201 con la noticia creada')
    it('12 - Si existe req.user.id registra acción CREATE en audit log')
    it('13 - Si no existe req.user no registra audit log')
    it('14 - Retorna 500 si ocurre error interno')
  })

  describe('updateNews', () => {
    it('15 - Retorna 400 si falta title')
    it('16 - Retorna 400 si falta content')
    it('17 - Usa slug enviado en req.body si existe')
    it('18 - Si no se envía slug genera uno desde title')
    it('19 - Llama NewsModel.update con los datos correctos')
    it('20 - Retorna 404 si la noticia no existe')
    it('21 - Retorna 200 con la noticia actualizada')
    it('22 - Si existe req.user.id registra acción UPDATE en audit log')
    it('23 - Si no existe req.user no registra audit log')
    it('24 - Retorna 500 si ocurre error interno')
  })

  describe('deleteNews', () => {
    it('25 - Llama NewsModel.delete con req.params.id')
    it('26 - Retorna 404 si la noticia no existe')
    it('27 - Retorna 200 si elimina correctamente')
    it('28 - Si existe req.user.id registra acción DELETE en audit log')
    it('29 - Si no existe req.user no registra audit log')
    it('30 - Retorna 500 si ocurre error interno')
  })

  describe('getNewsBySlug', () => {
    it('31 - Llama NewsModel.getBySlug con req.params.slug')
    it('32 - Retorna 200 con la noticia encontrada')
    it('33 - Retorna 404 si la noticia no existe')
    it('34 - Retorna 500 si ocurre error interno')
  })
})