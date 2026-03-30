/**
 * @file categoryModel.test.js
 * @description Unit tests for CategoryModel (DAO for categories table).
 * Strategy: prototype-level-2 interception on pool.query (no vi.mock).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── 1. Intercept pool.query at prototype level 2 BEFORE importing the model ───
const poolModule = await import('../../../config/db')
const pool = poolModule.default ?? poolModule

let proto = pool
for (let i = 0; i < 2; i++) proto = Object.getPrototypeOf(proto)
proto.query = vi.fn()

// ─── 2. Import model AFTER intercepting ────────────────────────────────────────
const categoryModule = await import('../../../models/categoryModel')
const CategoryModel = categoryModule.default ?? categoryModule

// ─── 3. Reset mock between tests ───────────────────────────────────────────────
beforeEach(() => {
  proto.query.mockReset()
})

// ══════════════════════════════════════════════════════════════════════════════
// getAll
// ══════════════════════════════════════════════════════════════════════════════
describe('CategoryModel.getAll', () => {

  // ── Happy path ──────────────────────────────────────────────────────────────

  it('returns the array of category rows from the DB', async () => {
    const fakeRows = [
      { id: 1, name: 'Inteligencia Artificial', description: 'IA y ML' },
      { id: 2, name: 'Redes',                   description: 'Redes y telecom' }
    ]
    proto.query.mockResolvedValue({ rows: fakeRows })

    const result = await CategoryModel.getAll()

    expect(result).toEqual(fakeRows)
  })

  it('returns an empty array when there are no categories', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    const result = await CategoryModel.getAll()

    expect(result).toEqual([])
  })

  it('calls pool.query exactly once per invocation', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await CategoryModel.getAll()

    expect(proto.query).toHaveBeenCalledTimes(1)
  })

  // ── SQL correctness ─────────────────────────────────────────────────────────

  it('selects only id, name and description (no SELECT *)', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await CategoryModel.getAll()

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/SELECT\s+id,\s*name,\s*description/i)
    expect(sql).not.toMatch(/SELECT \*/i)
  })

  it('queries the categories table', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await CategoryModel.getAll()

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/FROM categories/i)
  })

  it('orders results alphabetically by name ASC', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await CategoryModel.getAll()

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/ORDER BY name ASC/i)
  })

  it('sends no query parameters (static query)', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await CategoryModel.getAll()

    // pool.query called with only the SQL string, no values array
    expect(proto.query.mock.calls[0]).toHaveLength(1)
  })

  // ── DB error propagation ────────────────────────────────────────────────────

  it('re-throws the original DB error on query failure', async () => {
    const dbError = new Error('Connection refused')
    proto.query.mockRejectedValue(dbError)

    await expect(CategoryModel.getAll()).rejects.toThrow('Connection refused')
  })
})