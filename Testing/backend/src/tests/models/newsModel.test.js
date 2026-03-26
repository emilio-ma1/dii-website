import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../config/db', () => ({
  query: vi.fn(),
}))

const pool = require('../../config/db')
const NewsModel = require('../../models/newsModel')

describe('newsModel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('getAll', () => {
    it('01 - Llama pool.query una vez')
    it('02 - Ejecuta la consulta de news ordenada por published_at DESC')
    it('03 - Retorna rows cuando la consulta es exitosa')
    it('04 - Retorna arreglo vacío si no hay noticias')
    it('05 - Hace console.error y relanza error si la consulta falla')
  })

  describe('create', () => {
    it('06 - Llama pool.query con INSERT INTO news')
    it('07 - Envía values en el orden correcto')
    it('08 - Retorna rows[0] cuando la inserción es exitosa')
    it('09 - Hace console.error y relanza error si la inserción falla')
  })

  describe('update', () => {
    it('10 - Llama pool.query con UPDATE news')
    it('11 - Envía values en el orden correcto para update')
    it('12 - Retorna rows[0] si la noticia existe')
    it('13 - Retorna null si la noticia no existe')
    it('14 - Hace console.error y relanza error si update falla')
  })

  describe('delete', () => {
    it('15 - Llama pool.query con DELETE FROM news WHERE id = $1')
    it('16 - Retorna rows[0] si elimina una noticia existente')
    it('17 - Retorna null si la noticia no existe')
    it('18 - Hace console.error y relanza error si delete falla')
  })

  describe('getBySlug', () => {
    it('19 - Llama pool.query con SELECT ... WHERE slug = $1')
    it('20 - Retorna rows[0] si encuentra la noticia')
    it('21 - Retorna null si no encuentra la noticia')
    it('22 - Hace console.error y relanza error si la consulta falla')
  })
})