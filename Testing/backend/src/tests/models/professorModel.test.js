import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../config/db', () => ({
  query: vi.fn(),
}))

const pool = require('../../config/db')
const ProfessorModel = require('../../models/professorModel')

describe('professorModel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('getAll', () => {
    it('01 - Llama pool.query una vez')
    it('02 - Ejecuta la consulta de profesores con joins y order')
    it('03 - Retorna rows cuando la consulta es exitosa')
    it('04 - Retorna arreglo vacío si no hay docentes')
    it('05 - Hace console.error y relanza error si la consulta falla')
  })

  describe('upsert', () => {
    it('06 - Llama pool.query con INSERT INTO professors ... ON CONFLICT')
    it('07 - Envía values en el orden correcto')
    it('08 - Retorna rows[0] cuando el upsert es exitoso')
    it('09 - Hace console.error y relanza error si el upsert falla')
  })

  describe('delete', () => {
    it('10 - Llama pool.query con DELETE FROM professors WHERE user_id = $1')
    it('11 - Retorna rows[0] si elimina un perfil existente')
    it('12 - Retorna null si no existe perfil para ese user_id')
    it('13 - Hace console.error y relanza error si delete falla')
  })
})