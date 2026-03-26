import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../models/auditLogModel', () => ({
  getRecentLogs: vi.fn(),
}))

const AuditLogModel = require('../../models/auditLogModel')
const { getAuditLogs } = require('../../controllers/auditLogController')

function mockRequest({ query = {} } = {}) {
  return { query }
}

function mockResponse() {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('auditLogController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('getAuditLogs', () => {
    it('01 - Usa limit 50 por defecto cuando no se envía query.limit')
    it('02 - Si query.limit es válido llama AuditLogModel.getRecentLogs con ese valor')
    it('03 - Retorna 200 con la lista de logs')
    it('04 - Retorna 400 si limit no es numérico')
    it('05 - Retorna 400 si limit es menor o igual a 0')
    it('06 - Retorna 400 si limit es mayor a 500')
    it('07 - No llama AuditLogModel.getRecentLogs cuando limit es inválido')
    it('08 - Retorna 500 si ocurre error interno')
    it('09 - Hace console.error cuando ocurre error interno')
  })
})