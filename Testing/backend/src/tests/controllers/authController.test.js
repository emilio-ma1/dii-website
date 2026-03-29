import { describe, it, expect, vi, beforeEach } from 'vitest'

process.env.JWT_SECRET = 'test-secret'
process.env.JWT_TEMP_SECRET = 'test-temp-secret'
process.env.JWT_TEMP_EXPIRES_IN = '10m'

vi.mock('../../config/db', () => ({
  connect: vi.fn(),
}))

vi.mock('../..//models/userModel', () => ({
  getByEmail: vi.fn(),
  setLoginCode: vi.fn(),
  getLoginCode: vi.fn(),
  clearLoginCode: vi.fn(),
  getFullProfile: vi.fn(),
}))

vi.mock('../../models/auditLogModel', () => ({
  logAction: vi.fn(),
}))

vi.mock('../../services/emailService', () => ({
  send2FACode: vi.fn(),
}))

vi.mock('bcryptjs', () => ({
  compare: vi.fn(),
  genSalt: vi.fn(),
  hash: vi.fn(),
}))

vi.mock('jsonwebtoken', () => ({
  sign: vi.fn(),
  verify: vi.fn(),
}))

vi.mock('crypto', () => ({
  randomInt: vi.fn(),
}))

const pool = require('../../config/db')
const UserModel = require('../../models/userModel')
const AuditLogModel = require('../../models/auditLogModel')
const emailService = require('../../services/emailService')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { login, register, verify2FA } = require('../../controllers/authController')

function mockRequest({ body = {}, user = null, ip = '127.0.0.1' } = {}) {
  return { body, user, ip }
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
    it('05 - Consulta UserModel.getByEmail con el email recibido')
    it('06 - Compara la contraseña ingresada con password_hash')
    it('07 - Genera un código 2FA de 6 dígitos')
    it('08 - Guarda el código y expiración con UserModel.setLoginCode')
    it('09 - Envía el código 2FA al correo con emailService.send2FACode')
    it('10 - Genera un tempToken con JWT_TEMP_SECRET')
    it('11 - Retorna 206 con requires2FA true y tempToken')
    it('12 - Retorna el mensaje esperado cuando se envía el código 2FA')
    it('13 - Retorna 500 si ocurre error interno en login')
  })

  describe('verify2FA', () => {
    it('14 - Retorna 400 si falta tempToken')
    it('15 - Retorna 400 si falta code')
    it('16 - Verifica tempToken usando JWT_TEMP_SECRET')
    it('17 - Consulta UserModel.getLoginCode con el id decodificado')
    it('18 - Retorna 401 si no existe código guardado')
    it('19 - Retorna 401 si el código no coincide')
    it('20 - Retorna 401 si el código está expirado')
    it('21 - Limpia el código con UserModel.clearLoginCode cuando la validación es exitosa')
    it('22 - Consulta UserModel.getFullProfile después de validar el código')
    it('23 - Genera el token final con JWT_SECRET')
    it('24 - Registra la acción LOGIN_2FA en AuditLogModel')
    it('25 - Retorna 200 con token y datos básicos del usuario')
    it('26 - Retorna 401 si el tempToken es inválido o expiró')
  })

  describe('register', () => {
    it('27 - Retorna 400 si falta full_name')
    it('28 - Retorna 400 si falta email')
    it('29 - Retorna 400 si falta password')
    it('30 - Obtiene un cliente con pool.connect')
    it('31 - Inicia transacción con BEGIN')
    it('32 - Retorna 409 si el correo ya existe')
    it('33 - Hace ROLLBACK si el correo ya existe')
    it('34 - Usa role teacher por defecto si no se envía role')
    it('35 - Genera salt antes de hashear la contraseña')
    it('36 - Hashea la contraseña antes de insertar')
    it('37 - Inserta usuario y retorna 201 con user')
    it('38 - Hace COMMIT cuando el registro es exitoso')
    it('39 - Registra acción en AuditLogModel al crear usuario')
    it('40 - Usa req.user.id como actorId si existe usuario autenticado')
    it('41 - Usa newUser.id como actorId si no existe req.user')
    it('42 - Hace ROLLBACK si ocurre un error')
    it('43 - Retorna 500 si ocurre error interno')
    it('44 - Libera client al finalizar')
  })
})