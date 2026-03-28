// src/tests/models/alumniModel.test.js
import { describe, it, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../config/db', () => ({
  query: vi.fn(),
}))

const pool = require('../../config/db')
const AlumniModel = require('../../models/alumniModel')

describe('alumniModel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getAll', () => {
    it.todo('01 - Llama pool.query una vez')
    it.todo('02 - Ejecuta la consulta con joins de users, alumni_profiles, project_authors y projects')
    it.todo('03 - Filtra por u.role = alumni')
    it.todo('04 - Retorna rows cuando la consulta es exitosa')
    it.todo('05 - Retorna arreglo vacío si no hay egresados')
    it.todo('06 - Hace console.error y relanza error si la consulta falla')
  })

  describe('upsert', () => {
    it.todo('07 - Llama pool.query con INSERT INTO alumni_profiles')
    it.todo('08 - Ejecuta ON CONFLICT (user_id)')
    it.todo('09 - Usa COALESCE para image_data e image_mimetype')
    it.todo('10 - Envía values en el orden correcto')
    it.todo('11 - Retorna rows[0] cuando el upsert es exitoso')
    it.todo('12 - Hace console.error y relanza error si el upsert falla')
  })

  describe('delete', () => {
    it.todo('13 - Llama pool.query con DELETE FROM alumni_profiles WHERE user_id = $1')
    it.todo('14 - Retorna rows[0] si elimina un perfil existente')
    it.todo('15 - Retorna null si no existe perfil para ese user_id')
    it.todo('16 - Hace console.error y relanza error si delete falla')
  })

  describe('getImage', () => {
    it.todo('17 - Llama pool.query con SELECT image_data, image_mimetype')
    it.todo('18 - Retorna rows[0] si la imagen existe')
    it.todo('19 - Retorna null si la imagen no existe')
    it.todo('20 - Hace console.error y relanza error si getImage falla')
  })
})