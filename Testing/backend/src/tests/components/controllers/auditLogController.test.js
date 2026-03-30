/**
 * @file auditLogController.test.js
 * @description Integration tests for auditLogController.
 * Uses vi.spyOn over createRequire — vi.mock() is NOT used in this stack.
 */
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const AuditLogModel        = require('../../../models/auditLogModel')
const { getAuditLogs }     = require('../../../controllers/auditLogController')

// ─── Helpers ─────────────────────────────────────────────────────────────────
const mockReq = ({ query = {}, user = null } = {}) => ({ query, user })
const mockRes = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json   = vi.fn().mockReturnValue(res)
  return res
}

// ─── Suite ───────────────────────────────────────────────────────────────────
describe('auditLogController — getAuditLogs', () => {
  let getRecentLogsSpy

  beforeEach(() => {
    getRecentLogsSpy = vi.spyOn(AuditLogModel, 'getRecentLogs')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ── Happy path ──────────────────────────────────────────────────────────────

  it('returns 200 with logs using default limit (50) when no query param', async () => {
    const fakeLogs = [{ id: 1, action: 'LOGIN' }, { id: 2, action: 'LOGOUT' }]
    getRecentLogsSpy.mockResolvedValue(fakeLogs)

    const req = mockReq()
    const res = mockRes()

    await getAuditLogs(req, res)

    expect(getRecentLogsSpy).toHaveBeenCalledWith(50)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(fakeLogs)
  })

  it('returns 200 with logs using a valid custom limit', async () => {
    const fakeLogs = [{ id: 3, action: 'UPDATE' }]
    getRecentLogsSpy.mockResolvedValue(fakeLogs)

    const req = mockReq({ query: { limit: '10' } })
    const res = mockRes()

    await getAuditLogs(req, res)

    expect(getRecentLogsSpy).toHaveBeenCalledWith(10)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(fakeLogs)
  })

  it('accepts limit = 1 (boundary minimum)', async () => {
    getRecentLogsSpy.mockResolvedValue([])

    const req = mockReq({ query: { limit: '1' } })
    const res = mockRes()

    await getAuditLogs(req, res)

    expect(getRecentLogsSpy).toHaveBeenCalledWith(1)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('accepts limit = 500 (boundary maximum)', async () => {
    getRecentLogsSpy.mockResolvedValue([])

    const req = mockReq({ query: { limit: '500' } })
    const res = mockRes()

    await getAuditLogs(req, res)

    expect(getRecentLogsSpy).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('returns 200 with an empty array when there are no logs', async () => {
    getRecentLogsSpy.mockResolvedValue([])

    const req = mockReq()
    const res = mockRes()

    await getAuditLogs(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith([])
  })

  // ── Validation errors ───────────────────────────────────────────────────────

  it('returns 400 when limit is not a number', async () => {
    const req = mockReq({ query: { limit: 'abc' } })
    const res = mockRes()

    await getAuditLogs(req, res)

    expect(getRecentLogsSpy).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Parámetro limit inválido. Debe ser un número entre 1 y 500.'
    })
  })

  it('returns 400 when limit = 0', async () => {
    const req = mockReq({ query: { limit: '0' } })
    const res = mockRes()

    await getAuditLogs(req, res)

    expect(getRecentLogsSpy).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('returns 400 when limit is negative', async () => {
    const req = mockReq({ query: { limit: '-5' } })
    const res = mockRes()

    await getAuditLogs(req, res)

    expect(getRecentLogsSpy).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('returns 400 when limit exceeds 500', async () => {
    const req = mockReq({ query: { limit: '501' } })
    const res = mockRes()

    await getAuditLogs(req, res)

    expect(getRecentLogsSpy).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('accepts limit as a float string (parseInt truncates to valid int)', async () => {
  getRecentLogsSpy.mockResolvedValue([])
    const req = mockReq({ query: { limit: '10.5' } })
    const res = mockRes()

    await getAuditLogs(req, res)

    // parseInt('10.5') = 10 → valid, should NOT return 400
    expect(getRecentLogsSpy).toHaveBeenCalledWith(10)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  // ── Error handling ──────────────────────────────────────────────────────────

  it('returns 500 when AuditLogModel.getRecentLogs throws', async () => {
    getRecentLogsSpy.mockRejectedValue(new Error('DB failure'))

    const req = mockReq()
    const res = mockRes()

    await getAuditLogs(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error interno al obtener el registro de actividad.'
    })
  })

  it('returns 500 when model throws unexpectedly with a custom limit', async () => {
    getRecentLogsSpy.mockRejectedValue(new Error('Timeout'))

    const req = mockReq({ query: { limit: '25' } })
    const res = mockRes()

    await getAuditLogs(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error interno al obtener el registro de actividad.'
    })
  })
})