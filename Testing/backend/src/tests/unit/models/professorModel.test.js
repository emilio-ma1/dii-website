/**
 * @file professorModel.test.js
 * @description Unit tests for ProfessorModel (DAO for professors table).
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
const professorModule = await import('../../../models/professorModel')
const ProfessorModel = professorModule.default ?? professorModule

// ─── 3. Reset mock between tests ───────────────────────────────────────────────
beforeEach(() => {
  proto.query.mockReset()
})

// ══════════════════════════════════════════════════════════════════════════════
// getAll
// ══════════════════════════════════════════════════════════════════════════════
describe('ProfessorModel.getAll', () => {

  it('returns the array of professor rows from the DB', async () => {
    const fakeRows = [
      { id: 1, user_id: 1, profile_id: 10, degree: 'PhD', area: 'IA', user_name: 'Ana', email: 'a@u.cl', projects: [] },
      { id: 2, user_id: 2, profile_id: 11, degree: 'MSc', area: 'Redes', user_name: 'Bob', email: 'b@u.cl', projects: [{ id: 5, title: 'P1' }] }
    ]
    proto.query.mockResolvedValue({ rows: fakeRows })

    const result = await ProfessorModel.getAll()

    expect(result).toEqual(fakeRows)
  })

  it('returns an empty array when there are no professors', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    const result = await ProfessorModel.getAll()

    expect(result).toEqual([])
  })

  it('SQL joins professors, project_authors and projects tables', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProfessorModel.getAll()

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/LEFT JOIN professors/i)
    expect(sql).toMatch(/LEFT JOIN project_authors/i)
    expect(sql).toMatch(/LEFT JOIN projects/i)
  })

  it('SQL filters users with role = teacher', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProfessorModel.getAll()

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/WHERE u\.role\s*=\s*'teacher'/i)
  })

  it('SQL uses COALESCE with json_agg to build the projects array', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProfessorModel.getAll()

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/COALESCE/i)
    expect(sql).toMatch(/json_agg/i)
    expect(sql).toMatch(/json_build_object/i)
  })

  it('SQL includes GROUP BY and ORDER BY u.full_name ASC', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProfessorModel.getAll()

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/GROUP BY/i)
    expect(sql).toMatch(/ORDER BY u\.full_name ASC/i)
  })

  it('SQL does not select image_data (memory optimization)', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProfessorModel.getAll()

    const sql = proto.query.mock.calls[0][0]
    expect(sql).not.toMatch(/image_data/i)
  })

  it('sends no query parameters (static query)', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProfessorModel.getAll()

    expect(proto.query.mock.calls[0]).toHaveLength(1)
  })

  it('calls pool.query exactly once', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProfessorModel.getAll()

    expect(proto.query).toHaveBeenCalledTimes(1)
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('Join query failed'))

    await expect(ProfessorModel.getAll()).rejects.toThrow('Join query failed')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// upsert
// ══════════════════════════════════════════════════════════════════════════════
describe('ProfessorModel.upsert', () => {

  const fakeBuffer = Buffer.from('prof-image')

  it('returns the upserted profile row', async () => {
    const fakeRow = { user_id: 3, degree: 'PhD', area: 'Robótica' }
    proto.query.mockResolvedValue({ rows: [fakeRow] })

    const result = await ProfessorModel.upsert({
      user_id: 3, degree: 'PhD', area: 'Robótica', imageData: fakeBuffer, imageMimetype: 'image/png'
    })

    expect(result).toEqual(fakeRow)
  })

  it('SQL uses INSERT ... ON CONFLICT (user_id) DO UPDATE', async () => {
    proto.query.mockResolvedValue({ rows: [{ user_id: 1 }] })

    await ProfessorModel.upsert({ user_id: 1, degree: 'MSc', area: 'IA', imageData: null, imageMimetype: null })

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/INSERT INTO professors/i)
    expect(sql).toMatch(/ON CONFLICT\s*\(user_id\)/i)
    expect(sql).toMatch(/DO UPDATE SET/i)
  })

  it('SQL uses COALESCE to preserve existing image on update', async () => {
    proto.query.mockResolvedValue({ rows: [{ user_id: 1 }] })

    await ProfessorModel.upsert({ user_id: 1, degree: 'MSc', area: 'IA', imageData: null, imageMimetype: null })

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/COALESCE\(EXCLUDED\.image_data,\s*professors\.image_data\)/i)
    expect(sql).toMatch(/COALESCE\(EXCLUDED\.image_mimetype,\s*professors\.image_mimetype\)/i)
  })

  it('RETURNING includes user_id, degree and area (no binary fields)', async () => {
    proto.query.mockResolvedValue({ rows: [{ user_id: 1 }] })

    await ProfessorModel.upsert({ user_id: 1, degree: 'MSc', area: 'IA', imageData: null, imageMimetype: null })

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/RETURNING user_id,\s*degree,\s*area/i)
    expect(sql).not.toMatch(/RETURNING.*image_data/i)
  })

  it('passes values in order [user_id, degree, area, imageData, imageMimetype]', async () => {
    proto.query.mockResolvedValue({ rows: [{ user_id: 5 }] })

    await ProfessorModel.upsert({ user_id: 5, degree: 'Dr', area: 'CV', imageData: fakeBuffer, imageMimetype: 'image/jpeg' })

    const values = proto.query.mock.calls[0][1]
    expect(values).toEqual([5, 'Dr', 'CV', fakeBuffer, 'image/jpeg'])
  })

  it('accepts null for imageData and imageMimetype', async () => {
    proto.query.mockResolvedValue({ rows: [{ user_id: 6 }] })

    await ProfessorModel.upsert({ user_id: 6, degree: 'BSc', area: 'Redes', imageData: null, imageMimetype: null })

    const values = proto.query.mock.calls[0][1]
    expect(values[3]).toBeNull()
    expect(values[4]).toBeNull()
  })

  it('calls pool.query exactly once', async () => {
    proto.query.mockResolvedValue({ rows: [{ user_id: 1 }] })

    await ProfessorModel.upsert({ user_id: 1, degree: 'X', area: 'Y', imageData: null, imageMimetype: null })

    expect(proto.query).toHaveBeenCalledTimes(1)
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('FK constraint on user_id'))

    await expect(
      ProfessorModel.upsert({ user_id: 99, degree: 'X', area: 'Y', imageData: null, imageMimetype: null })
    ).rejects.toThrow('FK constraint on user_id')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// delete
// ══════════════════════════════════════════════════════════════════════════════
describe('ProfessorModel.delete', () => {

  it('returns { user_id } of the deleted record when found', async () => {
    proto.query.mockResolvedValue({ rows: [{ user_id: 7 }] })

    const result = await ProfessorModel.delete(7)

    expect(result).toEqual({ user_id: 7 })
  })

  it('returns null when the user_id does not exist', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    const result = await ProfessorModel.delete(999)

    expect(result).toBeNull()
  })

  it('SQL deletes by user_id (not by id)', async () => {
    proto.query.mockResolvedValue({ rows: [{ user_id: 1 }] })

    await ProfessorModel.delete(1)

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/DELETE FROM professors/i)
    expect(sql).toMatch(/WHERE user_id\s*=\s*\$1/i)
    expect(sql).toMatch(/RETURNING user_id/i)
  })

  it('passes only the id as the query parameter', async () => {
    proto.query.mockResolvedValue({ rows: [{ user_id: 3 }] })

    await ProfessorModel.delete(3)

    expect(proto.query.mock.calls[0][1]).toEqual([3])
  })

  it('calls pool.query exactly once', async () => {
    proto.query.mockResolvedValue({ rows: [{ user_id: 1 }] })

    await ProfessorModel.delete(1)

    expect(proto.query).toHaveBeenCalledTimes(1)
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('Delete failed'))

    await expect(ProfessorModel.delete(1)).rejects.toThrow('Delete failed')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// getImage
// ══════════════════════════════════════════════════════════════════════════════
describe('ProfessorModel.getImage', () => {

  it('returns { image_data, image_mimetype } when the record exists', async () => {
    const fakeRow = { image_data: Buffer.from('img'), image_mimetype: 'image/png' }
    proto.query.mockResolvedValue({ rows: [fakeRow] })

    const result = await ProfessorModel.getImage(1)

    expect(result).toEqual(fakeRow)
  })

  it('returns null when the user_id does not exist', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    const result = await ProfessorModel.getImage(999)

    expect(result).toBeNull()
  })

  it('SQL selects only image_data and image_mimetype WHERE user_id = $1', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProfessorModel.getImage(1)

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/SELECT\s+image_data,\s*image_mimetype/i)
    expect(sql).toMatch(/FROM professors/i)
    expect(sql).toMatch(/WHERE user_id\s*=\s*\$1/i)
  })

  it('passes only the id as the query parameter', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProfessorModel.getImage(4)

    expect(proto.query.mock.calls[0][1]).toEqual([4])
  })

  it('calls pool.query exactly once', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProfessorModel.getImage(1)

    expect(proto.query).toHaveBeenCalledTimes(1)
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('Image fetch error'))

    await expect(ProfessorModel.getImage(1)).rejects.toThrow('Image fetch error')
  })
})