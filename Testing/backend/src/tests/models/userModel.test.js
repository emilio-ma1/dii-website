// src/tests/models/userModel.test.js
import { describe, it, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../config/db', () => ({
  query: vi.fn(),
  connect: vi.fn(),
}))

const pool = require('../../config/db')
const UserModel = require('../../models/userModel')

describe('userModel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getAll', () => {
    it.todo('01 - Llama pool.query una vez')
    it.todo('02 - Ejecuta SELECT id, full_name, email, role FROM users ORDER BY full_name ASC')
    it.todo('03 - Retorna rows cuando la consulta es exitosa')
    it.todo('04 - Retorna arreglo vacío si no hay usuarios')
    it.todo('05 - Hace console.error y relanza error si la consulta falla')
  })

  describe('getByRole', () => {
    it.todo('06 - Llama pool.query con WHERE role = $1')
    it.todo('07 - Envía roleName en values')
    it.todo('08 - Retorna rows cuando la consulta es exitosa')
    it.todo('09 - Retorna arreglo vacío si no hay usuarios con ese rol')
    it.todo('10 - Hace console.error y relanza error si la consulta falla')
  })

  describe('deleteById', () => {
    it.todo('11 - Llama pool.query con DELETE FROM users WHERE id = $1')
    it.todo('12 - Retorna true si el usuario fue eliminado')
    it.todo('13 - Retorna false si el usuario no existía')
    it.todo('14 - Hace console.error y relanza error si la consulta falla')
  })

  describe('updateById', () => {
    it.todo('15 - Si viene passwordHash actualiza también password_hash')
    it.todo('16 - Si no viene passwordHash no actualiza password_hash')
    it.todo('17 - Retorna rows[0] si el usuario existe')
    it.todo('18 - Retorna null si el usuario no existe')
    it.todo('19 - Hace console.error y relanza error si la consulta falla')
  })

  describe('updateAccountAndCleanProfiles', () => {
    it.todo('20 - Llama pool.connect y comienza transacción con BEGIN')
    it.todo('21 - Si viene passwordHash actualiza users incluyendo password_hash')
    it.todo('22 - Si no viene passwordHash actualiza users sin password_hash')
    it.todo('23 - Si no encuentra usuario hace ROLLBACK y retorna null')
    it.todo('24 - Si role es teacher elimina perfil de alumni_profiles')
    it.todo('25 - Si role es alumni elimina perfil de professors')
    it.todo('26 - Si role es admin elimina perfiles de alumni_profiles y professors')
    it.todo('27 - Hace COMMIT cuando la transacción es exitosa')
    it.todo('28 - Retorna el usuario actualizado')
    it.todo('29 - Hace ROLLBACK si ocurre error')
    it.todo('30 - Libera client con release al finalizar')
    it.todo('31 - Hace console.error y relanza error si la transacción falla')
  })

  describe('getFullProfile', () => {
    it.todo('32 - Consulta usuario base con SELECT id, full_name, email, role FROM users WHERE id = $1')
    it.todo('33 - Retorna null si el usuario no existe')
    it.todo('34 - Si role es teacher consulta professors')
    it.todo('35 - Si role es alumni consulta alumni_profiles')
    it.todo('36 - Si role no tiene perfil extendido retorna solo baseUser')
    it.todo('37 - Combina baseUser con extendedProfile cuando existe')
    it.todo('38 - Hace console.error y relanza error si getFullProfile falla')
  })

  describe('getAuthors', () => {
    it.todo('39 - Llama pool.query una vez')
    it.todo('40 - Ejecuta consulta filtrando role IN teacher y alumni')
    it.todo('41 - Retorna rows cuando la consulta es exitosa')
    it.todo('42 - Retorna arreglo vacío si no hay autores')
    it.todo('43 - Hace console.error y relanza error si getAuthors falla')
  })

  describe('getProfileImage', () => {
    it.todo('44 - Consulta primero el role del usuario')
    it.todo('45 - Retorna null si el usuario no existe')
    it.todo('46 - Si role es teacher consulta imagen en professors')
    it.todo('47 - Si role es alumni consulta imagen en alumni_profiles')
    it.todo('48 - Retorna null si role no soporta imagen')
    it.todo('49 - Retorna rows[0] si existe imagen')
    it.todo('50 - Retorna null si no existe imagen en la tabla correspondiente')
    it.todo('51 - Hace console.error y relanza error si getProfileImage falla')
  })
})