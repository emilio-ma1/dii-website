import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../config/db', () => ({
  query: vi.fn(),
}))

vi.mock('../../models/userModel', () => ({
  getAll: vi.fn(),
  getByRole: vi.fn(),
  deleteById: vi.fn(),
  updateAccountAndCleanProfiles: vi.fn(),
}))

vi.mock('bcryptjs', () => ({
  genSalt: vi.fn(),
  hash: vi.fn(),
}))

vi.mock('../../models/auditLogModel', () => ({
  logAction: vi.fn(),
}))

const pool = require('../../config/db')
const UserModel = require('../../models/userModel')
const bcrypt = require('bcryptjs')
const AuditLogModel = require('../../models/auditLogModel')
const {
  getAllUsers,
  getUsersByRole,
  deleteUser,
  updateUser,
  getCurrentUserProfile,
  getAuthorsList,
} = require('../../controllers/userController')

function mockRequest({ body = {}, params = {}, user = null } = {}) {
  return { body, params, user }
}

function mockResponse() {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('userController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('getAllUsers', () => {
    it('01 - Llama UserModel.getAll una vez')
    it('02 - Retorna 200 con la lista de usuarios')
    it('03 - Retorna 500 si ocurre error interno')
  })

  describe('getUsersByRole', () => {
    it('04 - Retorna 400 si falta roleName')
    it('05 - Llama UserModel.getByRole con req.params.roleName')
    it('06 - Retorna 200 con la lista filtrada')
    it('07 - Retorna 500 si ocurre error interno')
  })

  describe('deleteUser', () => {
    it('08 - Retorna 400 si el admin intenta eliminar su propia cuenta')
    it('09 - Llama UserModel.deleteById con req.params.id')
    it('10 - Retorna 404 si el usuario no existe')
    it('11 - Retorna 200 si elimina correctamente')
    it('12 - Si existe req.user.id registra acción DELETE en audit log')
    it('13 - Si no existe req.user no registra audit log')
    it('14 - Retorna 500 si ocurre error interno')
  })

  describe('updateUser', () => {
    it('15 - Si viene password genera salt con bcrypt.genSalt(10)')
    it('16 - Si viene password genera passwordHash con bcrypt.hash')
    it('17 - Si no viene password envía null como passwordHash')
    it('18 - Llama UserModel.updateAccountAndCleanProfiles con los datos correctos')
    it('19 - Retorna 404 si el usuario no existe')
    it('20 - Retorna 200 con el usuario actualizado')
    it('21 - Si existe req.user.id registra acción UPDATE en audit log')
    it('22 - Retorna 500 si ocurre error interno')
  })

  describe('getCurrentUserProfile', () => {
    it('23 - Consulta el usuario base en users usando req.user.id')
    it('24 - Retorna 404 si el usuario base no existe')
    it('25 - Si role es teacher consulta tabla professors')
    it('26 - Si role es alumni consulta tabla alumni_profiles')
    it('27 - Si role no tiene perfil extendido retorna solo datos base')
    it('28 - Retorna 200 con perfil unificado para teacher')
    it('29 - Retorna 200 con perfil unificado para alumni')
    it('30 - Retorna 500 si ocurre error interno')
  })

  describe('getAuthorsList', () => {
    it('31 - Consulta autores con roles teacher y alumni')
    it('32 - Retorna 200 con la lista de autores')
    it('33 - Retorna 500 si ocurre error interno')
  })
})