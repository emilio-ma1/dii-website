// src/tests/models/equipmentModel.test.js
import { describe, it, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../config/db', () => ({
  query: vi.fn(),
}))

const pool = require('../../config/db')
const EquipmentModel = require('../../models/equipmentModel')

describe('equipmentModel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getAll', () => {
    it.todo('01 - Llama pool.query una vez')
    it.todo('02 - Ejecuta SELECT id, name, description FROM equipment ORDER BY id DESC')
    it.todo('03 - Retorna rows cuando la consulta es exitosa')
    it.todo('04 - Retorna arreglo vacío si no hay equipamiento')
    it.todo('05 - Hace console.error y relanza error si la consulta falla')
  })

  describe('create', () => {
    it.todo('06 - Llama pool.query con INSERT INTO equipment')
    it.todo('07 - Envía values en el orden correcto')
    it.todo('08 - Retorna rows[0] cuando create es exitoso')
    it.todo('09 - Hace console.error y relanza error si create falla')
  })

  describe('update', () => {
    it.todo('10 - Llama pool.query con UPDATE equipment')
    it.todo('11 - Usa COALESCE para image_data e image_mimetype')
    it.todo('12 - Envía values en el orden correcto')
    it.todo('13 - Retorna rows[0] si el equipamiento existe')
    it.todo('14 - Retorna null si el equipamiento no existe')
    it.todo('15 - Hace console.error y relanza error si update falla')
  })

  describe('delete', () => {
    it.todo('16 - Llama pool.query con DELETE FROM equipment WHERE id = $1')
    it.todo('17 - Retorna rows[0] si elimina un equipamiento existente')
    it.todo('18 - Retorna null si el equipamiento no existe')
    it.todo('19 - Hace console.error y relanza error si delete falla')
  })

  describe('getImage', () => {
    it.todo('20 - Llama pool.query con SELECT image_data, image_mimetype')
    it.todo('21 - Retorna rows[0] si la imagen existe')
    it.todo('22 - Retorna null si la imagen no existe')
    it.todo('23 - Hace console.error y relanza error si getImage falla')
  })
})