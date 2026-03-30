/**
 * @file auditLogModel.test.js
 * @description Unit tests for AuditLogModel (DAO for audit_logs table).
 * Strategy: prototype-level-2 interception on pool.query (no vi.mock).
 */

import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'

// ─── 1. Intercept pool.query at prototype level 2 BEFORE importing the model ───
const poolModule = await import('../../../config/db')
const pool = poolModule.default ?? poolModule

let proto = pool
for (let i = 0; i < 2; i++) proto = Object.getPrototypeOf(proto)
proto.query = vi.fn()

// ─── 2. Import model AFTER intercepting ────────────────────────────────────────
const auditLogModule = await import('../../../models/auditLogModel')
const AuditLogModel = auditLogModule.default ?? auditLogModule

// ─── 3. Reset mock between tests ───────────────────────────────────────────────
beforeEach(() => {
  proto.query.mockReset()
})

// ══════════════════════════════════════════════════════════════════════════════
// logAction
// ══════════════════════════════════════════════════════════════════════════════
describe('AuditLogModel.logAction', () => {

  // ── Happy path ──────────────────────────────────────────────────────────────

  it('inserts a log record and returns the created row', async () => {
    const fakeRow = {
      id: 1,
      user_id: 42,
      action: 'CREATE',
      entity_type: 'professor',
      entity_id: 7,
      details: { note: 'test' },
      created_at: new Date()
    }
    proto.query.mockResolvedValue({ rows: [fakeRow] })

    const result = await AuditLogModel.logAction(42, 'CREATE', 'professor', 7, { note: 'test' })

    expect(result).toEqual(fakeRow)
  })

  it('sends the correct SQL with RETURNING *', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 2 }] })

    await AuditLogModel.logAction(1, 'DELETE', 'news', 3, null)

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/INSERT INTO audit_logs/i)
    expect(sql).toMatch(/RETURNING \*/i)
  })

  it('passes values in the correct positional order ($1–$5)', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 3 }] })

    await AuditLogModel.logAction(10, 'UPDATE', 'project', 99, { field: 'title' })

    const values = proto.query.mock.calls[0][1]
    expect(values).toEqual([10, 'UPDATE', 'project', 99, { field: 'title' }])
  })

  it('uses null for entityId and details when omitted (defaults)', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 4 }] })

    await AuditLogModel.logAction(5, 'LOGIN', 'session')

    const values = proto.query.mock.calls[0][1]
    expect(values[3]).toBeNull()   // entityId
    expect(values[4]).toBeNull()   // details
  })

  it('accepts explicit null for entityId and details', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 5 }] })

    await AuditLogModel.logAction(5, 'LOGOUT', 'session', null, null)

    const values = proto.query.mock.calls[0][1]
    expect(values[3]).toBeNull()
    expect(values[4]).toBeNull()
  })

  it('calls pool.query exactly once per invocation', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 6 }] })

    await AuditLogModel.logAction(1, 'CREATE', 'news', 1, null)

    expect(proto.query).toHaveBeenCalledTimes(1)
  })

  // ── Validation errors (missing required fields) ──────────────────────────────

  it('throws [FATAL] error when userId is missing', async () => {
    await expect(
      AuditLogModel.logAction(null, 'CREATE', 'news')
    ).rejects.toThrow('[FATAL] Missing required fields for audit log: userId, action, or entityType.')
  })

  it('throws [FATAL] error when action is missing', async () => {
    await expect(
      AuditLogModel.logAction(1, '', 'news')
    ).rejects.toThrow('[FATAL] Missing required fields for audit log')
  })

  it('throws [FATAL] error when entityType is missing', async () => {
    await expect(
      AuditLogModel.logAction(1, 'CREATE', null)
    ).rejects.toThrow('[FATAL] Missing required fields for audit log')
  })

  it('does NOT call pool.query when validation fails', async () => {
    await expect(
      AuditLogModel.logAction(null, null, null)
    ).rejects.toThrow()

    expect(proto.query).not.toHaveBeenCalled()
  })

  // ── DB error propagation ────────────────────────────────────────────────────

  it('re-throws the original DB error on query failure', async () => {
    const dbError = new Error('DB connection lost')
    proto.query.mockRejectedValue(dbError)

    await expect(
      AuditLogModel.logAction(1, 'CREATE', 'professor', 1, null)
    ).rejects.toThrow('DB connection lost')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// getRecentLogs
// ══════════════════════════════════════════════════════════════════════════════
describe('AuditLogModel.getRecentLogs', () => {

  // ── Happy path ──────────────────────────────────────────────────────────────

  it('returns the array of log rows from the DB', async () => {
    const fakeRows = [
      { id: 1, action: 'CREATE', entity_type: 'news', user_name: 'Alice', user_email: 'a@test.com' },
      { id: 2, action: 'DELETE', entity_type: 'project', user_name: 'Bob',   user_email: 'b@test.com' }
    ]
    proto.query.mockResolvedValue({ rows: fakeRows })

    const result = await AuditLogModel.getRecentLogs()

    expect(result).toEqual(fakeRows)
  })

  it('returns an empty array when there are no logs', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    const result = await AuditLogModel.getRecentLogs()

    expect(result).toEqual([])
  })

  it('uses the default limit of 50 when no argument is provided', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await AuditLogModel.getRecentLogs()

    const values = proto.query.mock.calls[0][1]
    expect(values).toEqual([50])
  })

  it('forwards a custom limit to the query', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await AuditLogModel.getRecentLogs(10)

    const values = proto.query.mock.calls[0][1]
    expect(values).toEqual([10])
  })

  it('SQL includes LEFT JOIN with users and ORDER BY created_at DESC', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await AuditLogModel.getRecentLogs()

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/LEFT JOIN users/i)
    expect(sql).toMatch(/ORDER BY a\.created_at DESC/i)
    expect(sql).toMatch(/LIMIT \$1/i)
  })

  it('SQL selects user_name and user_email via aliases', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await AuditLogModel.getRecentLogs()

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/u\.full_name AS user_name/i)
    expect(sql).toMatch(/u\.email AS user_email/i)
  })

  it('calls pool.query exactly once per invocation', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await AuditLogModel.getRecentLogs(5)

    expect(proto.query).toHaveBeenCalledTimes(1)
  })

  // ── DB error propagation ────────────────────────────────────────────────────

  it('re-throws the original DB error on query failure', async () => {
    const dbError = new Error('Timeout querying audit_logs')
    proto.query.mockRejectedValue(dbError)

    await expect(AuditLogModel.getRecentLogs()).rejects.toThrow('Timeout querying audit_logs')
  })
})