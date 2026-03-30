// src/tests/components/controllers/userController.test.js
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

const UserModel    = require('../../../models/userModel')
const AuditLogModel = require('../../../models/auditLogModel')
const bcrypt       = require('bcryptjs')
const {
  getAllUsers,
  getUsersByRole,
  deleteUser,
  updateUser,
  getCurrentUserProfile,
  getAuthorsList,
  getUserImage,
} = require('../../../controllers/userController')

// ─── Helpers ──────────────────────────────────────────────────────────────────
const mockReq = ({ body = {}, params = {}, user = null } = {}) => ({
  body, params, user
})
const mockRes = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json   = vi.fn().mockReturnValue(res)
  res.set    = vi.fn().mockReturnValue(res)
  res.send   = vi.fn().mockReturnValue(res)
  return res
}

const baseUser = { id: 1, full_name: 'Test User', email: 'test@test.com', role: 'teacher' }

// =============================================================================
describe('userController', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getAllUsers', () => {

    it('01 - Llama UserModel.getAll una vez', async () => {
      const getAll = vi.spyOn(UserModel, 'getAll').mockResolvedValue([baseUser])
      const res = mockRes()
      await getAllUsers(mockReq(), res)
      expect(getAll).toHaveBeenCalledTimes(1)
    })

    it('02 - Retorna 200 con la lista de usuarios', async () => {
      vi.spyOn(UserModel, 'getAll').mockResolvedValue([baseUser])
      const res = mockRes()
      await getAllUsers(mockReq(), res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([baseUser])
    })

    it('03 - Retorna 200 con arreglo vacío si no hay usuarios', async () => {
      vi.spyOn(UserModel, 'getAll').mockResolvedValue([])
      const res = mockRes()
      await getAllUsers(mockReq(), res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([])
    })

    it('04 - Retorna 500 si ocurre error interno', async () => {
      vi.spyOn(UserModel, 'getAll').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await getAllUsers(mockReq(), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getUsersByRole', () => {

    it('05 - Retorna 400 si falta roleName', async () => {
      const res = mockRes()
      await getUsersByRole(mockReq({ params: { roleName: '' } }), res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('06 - Llama UserModel.getByRole con req.params.roleName', async () => {
      const getByRole = vi.spyOn(UserModel, 'getByRole').mockResolvedValue([baseUser])
      const res = mockRes()
      await getUsersByRole(mockReq({ params: { roleName: 'teacher' } }), res)
      expect(getByRole).toHaveBeenCalledWith('teacher')
    })

    it('07 - Retorna 200 con la lista filtrada', async () => {
      vi.spyOn(UserModel, 'getByRole').mockResolvedValue([baseUser])
      const res = mockRes()
      await getUsersByRole(mockReq({ params: { roleName: 'teacher' } }), res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([baseUser])
    })

    it('08 - Retorna 200 con arreglo vacío si no hay usuarios con ese rol', async () => {
      vi.spyOn(UserModel, 'getByRole').mockResolvedValue([])
      const res = mockRes()
      await getUsersByRole(mockReq({ params: { roleName: 'admin' } }), res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([])
    })

    it('09 - Retorna 500 si ocurre error interno', async () => {
      vi.spyOn(UserModel, 'getByRole').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await getUsersByRole(mockReq({ params: { roleName: 'teacher' } }), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('deleteUser', () => {

    it('10 - Retorna 400 si el usuario intenta eliminar su propia cuenta', async () => {
      const res = mockRes()
      await deleteUser(mockReq({ params: { id: '1' }, user: { id: 1 } }), res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('11 - No llama UserModel.deleteById si el usuario intenta autoeliminarse', async () => {
      const deleteById = vi.spyOn(UserModel, 'deleteById').mockResolvedValue(true)
      const res = mockRes()
      await deleteUser(mockReq({ params: { id: '1' }, user: { id: 1 } }), res)
      expect(deleteById).not.toHaveBeenCalled()
    })

    it('12 - Llama UserModel.deleteById con req.params.id', async () => {
      const deleteById = vi.spyOn(UserModel, 'deleteById').mockResolvedValue(true)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await deleteUser(mockReq({ params: { id: '2' }, user: { id: 1 } }), res)
      expect(deleteById).toHaveBeenCalledWith('2')
    })

    it('13 - Retorna 404 si el usuario no existe', async () => {
      vi.spyOn(UserModel, 'deleteById').mockResolvedValue(false)
      const res = mockRes()
      await deleteUser(mockReq({ params: { id: '99' }, user: { id: 1 } }), res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('14 - Retorna 200 si elimina correctamente', async () => {
      vi.spyOn(UserModel, 'deleteById').mockResolvedValue(true)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await deleteUser(mockReq({ params: { id: '2' }, user: { id: 1 } }), res)
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('15 - Si existe req.user.id registra acción DELETE en audit log', async () => {
      vi.spyOn(UserModel, 'deleteById').mockResolvedValue(true)
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await deleteUser(mockReq({ params: { id: '2' }, user: { id: 1 } }), res)
      expect(logAction).toHaveBeenCalledWith(1, 'DELETE', 'users', '2', expect.any(Object))
    })

    it('16 - Si no existe req.user no registra audit log', async () => {
      vi.spyOn(UserModel, 'deleteById').mockResolvedValue(true)
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await deleteUser(mockReq({ params: { id: '2' }, user: null }), res)
      expect(logAction).not.toHaveBeenCalled()
    })

    it('17 - Retorna 500 si ocurre error interno', async () => {
      vi.spyOn(UserModel, 'deleteById').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await deleteUser(mockReq({ params: { id: '2' }, user: { id: 1 } }), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('updateUser', () => {

    it('18 - Si viene password llama bcrypt.genSalt con 10', async () => {
      const genSalt = vi.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt')
      vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashed')
      vi.spyOn(UserModel, 'updateAccountAndCleanProfiles').mockResolvedValue(baseUser)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await updateUser(mockReq({ params: { id: '1' }, body: { password: 'secret' }, user: { id: 1 } }), res)
      expect(genSalt).toHaveBeenCalledWith(10)
    })

    it('19 - Si viene password llama bcrypt.hash con password y salt', async () => {
      vi.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt')
      const hash = vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashed')
      vi.spyOn(UserModel, 'updateAccountAndCleanProfiles').mockResolvedValue(baseUser)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await updateUser(mockReq({ params: { id: '1' }, body: { password: 'secret' }, user: { id: 1 } }), res)
      expect(hash).toHaveBeenCalledWith('secret', 'salt')
    })

    it('20 - Si viene password envía passwordHash a UserModel.updateAccountAndCleanProfiles', async () => {
      vi.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt')
      vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashed')
      const update = vi.spyOn(UserModel, 'updateAccountAndCleanProfiles').mockResolvedValue(baseUser)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await updateUser(mockReq({ params: { id: '1' }, body: { password: 'secret' }, user: { id: 1 } }), res)
      expect(update).toHaveBeenCalledWith('1', undefined, undefined, undefined, 'hashed')
    })

    it('21 - Si no viene password envía passwordHash null', async () => {
      const update = vi.spyOn(UserModel, 'updateAccountAndCleanProfiles').mockResolvedValue(baseUser)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await updateUser(mockReq({ params: { id: '1' }, body: {}, user: { id: 1 } }), res)
      expect(update).toHaveBeenCalledWith('1', undefined, undefined, undefined, null)
    })

    it('22 - Llama UserModel.updateAccountAndCleanProfiles con los argumentos correctos', async () => {
      const update = vi.spyOn(UserModel, 'updateAccountAndCleanProfiles').mockResolvedValue(baseUser)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await updateUser(mockReq({
        params: { id: '1' },
        body: { full_name: 'Nuevo Nombre', email: 'new@test.com', role: 'admin' },
        user: { id: 1 }
      }), res)
      expect(update).toHaveBeenCalledWith('1', 'Nuevo Nombre', 'new@test.com', 'admin', null)
    })

    it('23 - Retorna 404 si el usuario no existe', async () => {
      vi.spyOn(UserModel, 'updateAccountAndCleanProfiles').mockResolvedValue(null)
      const res = mockRes()
      await updateUser(mockReq({ params: { id: '99' }, body: {}, user: { id: 1 } }), res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('24 - Retorna 200 con el usuario actualizado', async () => {
      vi.spyOn(UserModel, 'updateAccountAndCleanProfiles').mockResolvedValue(baseUser)
      vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await updateUser(mockReq({ params: { id: '1' }, body: {}, user: { id: 1 } }), res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ message: expect.any(String), user: baseUser })
    })

    it('25 - Si existe req.user.id registra acción UPDATE en audit log', async () => {
      vi.spyOn(UserModel, 'updateAccountAndCleanProfiles').mockResolvedValue(baseUser)
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await updateUser(mockReq({ params: { id: '2' }, body: {}, user: { id: 1 } }), res)
      expect(logAction).toHaveBeenCalledWith(1, 'UPDATE', 'users', '2', expect.any(Object))
    })

    it('26 - Si no existe req.user no registra audit log', async () => {
      vi.spyOn(UserModel, 'updateAccountAndCleanProfiles').mockResolvedValue(baseUser)
      const logAction = vi.spyOn(AuditLogModel, 'logAction').mockResolvedValue({})
      const res = mockRes()
      await updateUser(mockReq({ params: { id: '1' }, body: {}, user: null }), res)
      expect(logAction).not.toHaveBeenCalled()
    })

    it('27 - Retorna 500 si ocurre error interno', async () => {
      vi.spyOn(UserModel, 'updateAccountAndCleanProfiles').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await updateUser(mockReq({ params: { id: '1' }, body: {}, user: { id: 1 } }), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getCurrentUserProfile', () => {

    it('28 - Llama UserModel.getFullProfile con req.user.id', async () => {
      const getFullProfile = vi.spyOn(UserModel, 'getFullProfile').mockResolvedValue(baseUser)
      const res = mockRes()
      await getCurrentUserProfile(mockReq({ user: { id: 5 } }), res)
      expect(getFullProfile).toHaveBeenCalledWith(5)
    })

    it('29 - Retorna 404 si el usuario no existe', async () => {
      vi.spyOn(UserModel, 'getFullProfile').mockResolvedValue(null)
      const res = mockRes()
      await getCurrentUserProfile(mockReq({ user: { id: 5 } }), res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('30 - Retorna 200 con el perfil unificado', async () => {
      vi.spyOn(UserModel, 'getFullProfile').mockResolvedValue(baseUser)
      const res = mockRes()
      await getCurrentUserProfile(mockReq({ user: { id: 5 } }), res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(baseUser)
    })

    it('31 - Retorna 500 si ocurre error interno', async () => {
      vi.spyOn(UserModel, 'getFullProfile').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await getCurrentUserProfile(mockReq({ user: { id: 5 } }), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getAuthorsList', () => {

    it('32 - Llama UserModel.getAuthors una vez', async () => {
      const getAuthors = vi.spyOn(UserModel, 'getAuthors').mockResolvedValue([baseUser])
      const res = mockRes()
      await getAuthorsList(mockReq(), res)
      expect(getAuthors).toHaveBeenCalledTimes(1)
    })

    it('33 - Retorna 200 con la lista de autores', async () => {
      vi.spyOn(UserModel, 'getAuthors').mockResolvedValue([baseUser])
      const res = mockRes()
      await getAuthorsList(mockReq(), res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([baseUser])
    })

    it('34 - Retorna 200 con arreglo vacío si no hay autores', async () => {
      vi.spyOn(UserModel, 'getAuthors').mockResolvedValue([])
      const res = mockRes()
      await getAuthorsList(mockReq(), res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([])
    })

    it('35 - Retorna 500 si ocurre error interno', async () => {
      vi.spyOn(UserModel, 'getAuthors').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await getAuthorsList(mockReq(), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getUserImage', () => {

    it('36 - Usa req.user.id cuando req.params.id es "me"', async () => {
      const getProfileImage = vi.spyOn(UserModel, 'getProfileImage').mockResolvedValue({
        image_data: Buffer.from('img'), image_mimetype: 'image/png'
      })
      const res = mockRes()
      await getUserImage(mockReq({ params: { id: 'me' }, user: { id: 7 } }), res)
      expect(getProfileImage).toHaveBeenCalledWith(7)
    })

    it('37 - Usa req.params.id cuando no es "me"', async () => {
      const getProfileImage = vi.spyOn(UserModel, 'getProfileImage').mockResolvedValue({
        image_data: Buffer.from('img'), image_mimetype: 'image/png'
      })
      const res = mockRes()
      await getUserImage(mockReq({ params: { id: '3' }, user: { id: 7 } }), res)
      expect(getProfileImage).toHaveBeenCalledWith('3')
    })

    it('38 - Llama UserModel.getProfileImage con el targetId correcto', async () => {
      const getProfileImage = vi.spyOn(UserModel, 'getProfileImage').mockResolvedValue({
        image_data: Buffer.from('img'), image_mimetype: 'image/jpeg'
      })
      const res = mockRes()
      await getUserImage(mockReq({ params: { id: '5' }, user: { id: 1 } }), res)
      expect(getProfileImage).toHaveBeenCalledWith('5')
    })

    it('39 - Retorna 404 si no existe imagen', async () => {
      vi.spyOn(UserModel, 'getProfileImage').mockResolvedValue(null)
      const res = mockRes()
      await getUserImage(mockReq({ params: { id: '1' }, user: { id: 1 } }), res)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('40 - Setea Content-Type y Cross-Origin-Resource-Policy', async () => {
      const buf = Buffer.from('img')
      vi.spyOn(UserModel, 'getProfileImage').mockResolvedValue({ image_data: buf, image_mimetype: 'image/png' })
      const res = mockRes()
      await getUserImage(mockReq({ params: { id: '1' }, user: { id: 1 } }), res)
      expect(res.set).toHaveBeenCalledWith('Content-Type', 'image/png')
      expect(res.set).toHaveBeenCalledWith('Cross-Origin-Resource-Policy', 'cross-origin')
    })

    it('41 - Envía image_data con res.send', async () => {
      const buf = Buffer.from('img')
      vi.spyOn(UserModel, 'getProfileImage').mockResolvedValue({ image_data: buf, image_mimetype: 'image/png' })
      const res = mockRes()
      await getUserImage(mockReq({ params: { id: '1' }, user: { id: 1 } }), res)
      expect(res.send).toHaveBeenCalledWith(buf)
    })

    it('42 - Retorna 500 si ocurre error interno', async () => {
      vi.spyOn(UserModel, 'getProfileImage').mockRejectedValue(new Error('db'))
      const res = mockRes()
      await getUserImage(mockReq({ params: { id: '1' }, user: { id: 1 } }), res)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })
})