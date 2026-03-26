import { describe, it, expect, vi, beforeEach } from 'vitest'

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

  describe('getAll', () => {
    it('01 - Llama pool.query una vez')
    it('02 - Ejecuta la consulta sin password_hash y ordena por full_name ASC')
    it('03 - Retorna rows cuando la consulta es exitosa')
    it('04 - Retorna arreglo vacío si no hay usuarios')
    it('05 - Hace console.error y relanza error si la consulta falla')
  })

  describe('getByRole', () => {
    it('06 - Llama pool.query con WHERE role = $1')
    it('07 - Envía roleName en values')
    it('08 - Retorna rows cuando la consulta es exitosa')
    it('09 - Retorna arreglo vacío si no hay usuarios con ese rol')
    it('10 - Hace console.error y relanza error si la consulta falla')
  })

  describe('deleteById', () => {
    it('11 - Llama pool.query con DELETE FROM users WHERE id = $1')
    it('12 - Retorna true si el usuario fue eliminado')
    it('13 - Retorna false si el usuario no existía')
    it('14 - Hace console.error y relanza error si la consulta falla')
  })

  describe('updateById', () => {
    it('15 - Si viene passwordHash actualiza también password_hash')
    it('16 - Si no viene passwordHash no actualiza password_hash')
    it('17 - Retorna rows[0] si el usuario existe')
    it('18 - Retorna null si el usuario no existe')
    it('19 - Hace console.error y relanza error si la consulta falla')
  })

  describe('updateAccountAndCleanProfiles', () => {
    it('20 - Llama pool.connect y comienza transacción con BEGIN')
    it('21 - Si viene passwordHash actualiza users incluyendo password_hash')
    it('22 - Si no viene passwordHash actualiza users sin password_hash')
    it('23 - Si no encuentra usuario hace ROLLBACK y retorna null')
    it('24 - Si role es teacher elimina perfil de alumni_profiles')
    it('25 - Si role es alumni elimina perfil de professors')
    it('26 - Si role es admin elimina perfiles de alumni_profiles y professors')
    it('27 - Hace COMMIT cuando la transacción es exitosa')
    it('28 - Retorna el usuario actualizado')
    it('29 - Hace ROLLBACK si ocurre error')
    it('30 - Libera client con release al finalizar')
    it('31 - Hace console.error y relanza error si la transacción falla')
  })
})