import { describe, it, expect, vi, beforeEach } from 'vitest'

process.env.JWT_SECRET = 'test-secret'

vi.mock('../../config/db', () => ({
  query: vi.fn(),
  connect: vi.fn(),
}))

vi.mock('bcryptjs', () => ({
  compare: vi.fn(),
  genSalt: vi.fn(),
  hash: vi.fn(),
}))

vi.mock('jsonwebtoken', () => ({
  sign: vi.fn(),
}))

vi.mock('../../models/auditLogModel', () => ({
  logAction: vi.fn(),
}))

const pool = require('../../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const AuditLogModel = require('../../models/auditLogModel')
const { login, register } = require('../../controllers/authController')

function mockRequest({ body = {}, user = null } = {}) {
  return { body, user }
}

function mockResponse() {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('authController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('01 - Retorna 400 si falta email')
    it('02 - Retorna 400 si falta password')
    it('03 - Retorna 401 si el usuario no existe')
    it('04 - Retorna 401 si la contraseña es incorrecta')
    it('05 - Consulta la base de datos por email')
    it('06 - Genera JWT con id, email y role')
    it('07 - Retorna 200 con token y user si login es exitoso')
    it('08 - Retorna 500 si ocurre error interno')
  })

  describe('register', () => {
    it('09 - Retorna 400 si falta full_name')
    it('10 - Retorna 400 si falta email')
    it('11 - Retorna 400 si falta password')
    it('12 - Retorna 409 si el correo ya existe')
    it('13 - Usa role teacher por defecto si no se envía role')
    it('14 - Hashea la contraseña antes de insertar')
    it('15 - Inserta usuario y retorna 201 con user')
    it('16 - Hace COMMIT cuando el registro es exitoso')
    it('17 - Registra acción en AuditLogModel al crear usuario')
    it('18 - Usa req.user.id como actorId si existe usuario autenticado')
    it('19 - Usa newUser.id como actorId si no existe req.user')
    it('20 - Hace ROLLBACK si ocurre un error')
    it('21 - Retorna 500 si ocurre error interno')
    it('22 - Libera client al finalizar')
  })
})