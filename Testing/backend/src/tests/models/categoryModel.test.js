import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../config/db', () => ({
  query: vi.fn(),
}))

const pool = require('../../config/db')
const CategoryModel = require('../../models/categoryModel')

describe('categoryModel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('getAll', () => {
    it('01 - Llama pool.query una vez')
    it('02 - Ejecuta la consulta SELECT id, name, description FROM categories ORDER BY name ASC')
    it('03 - Retorna rows cuando la consulta es exitosa')
    it('04 - Retorna arreglo vacío si no hay categorías')
    it('05 - Hace console.error y relanza error si la consulta falla')
  })
})