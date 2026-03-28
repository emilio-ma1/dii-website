// src/tests/models/newsModel.test.js
import { describe, it, vi, beforeEach, afterEach } from 'vitest'

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

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getAll', () => {
    it.todo('01 - Llama pool.query una vez')
    it.todo('02 - Ejecuta SELECT de news ordenado por published_at DESC')
    it.todo('03 - Retorna rows cuando la consulta es exitosa')
    it.todo('04 - Retorna arreglo vacío si no hay noticias')
    it.todo('05 - Hace console.error y relanza error si la consulta falla')
  })

  describe('create', () => {
    it.todo('06 - Llama pool.query con INSERT INTO news')
    it.todo('07 - Incluye NOW() en published_at')
    it.todo('08 - Envía values en el orden correcto')
    it.todo('09 - Retorna rows[0] cuando create es exitoso')
    it.todo('10 - Hace console.error y relanza error si create falla')
  })

  describe('update', () => {
    it.todo('11 - Llama pool.query con UPDATE news')
    it.todo('12 - Usa COALESCE para image_data e image_mimetype')
    it.todo('13 - Envía values en el orden correcto')
    it.todo('14 - Retorna rows[0] si la noticia existe')
    it.todo('15 - Retorna null si la noticia no existe')
    it.todo('16 - Hace console.error y relanza error si update falla')
  })

  describe('delete', () => {
    it.todo('17 - Llama pool.query con DELETE FROM news WHERE id = $1')
    it.todo('18 - Retorna rows[0] si elimina una noticia existente')
    it.todo('19 - Retorna null si la noticia no existe')
    it.todo('20 - Hace console.error y relanza error si delete falla')
  })

  describe('getBySlug', () => {
    it.todo('21 - Llama pool.query con WHERE slug = $1')
    it.todo('22 - Retorna rows[0] si la noticia existe')
    it.todo('23 - Retorna null si la noticia no existe')
    it.todo('24 - Hace console.error y relanza error si getBySlug falla')
  })

  describe('getImage', () => {
    it.todo('25 - Llama pool.query con SELECT image_data, image_mimetype FROM news WHERE id = $1')
    it.todo('26 - Retorna rows[0] si la imagen existe')
    it.todo('27 - Retorna null si la imagen no existe')
    it.todo('28 - Hace console.error y relanza error si getImage falla')
  })
})