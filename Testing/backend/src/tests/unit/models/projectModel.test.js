/**
 * @file projectModel.test.js
 * @description Unit tests for ProjectModel (DAO for projects table).
 * Strategy:
 *   - Simple queries: prototype-level-2 interception on pool.query
 *   - Transactional methods (create, update): prototype-level-2 interception
 *     on pool.connect, returning a fake client with query/release mocks.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── 1. Intercept pool.query AND pool.connect at prototype level 2 ─────────────
const poolModule = await import('../../../config/db')
const pool = poolModule.default ?? poolModule

let proto = pool
for (let i = 0; i < 2; i++) proto = Object.getPrototypeOf(proto)
proto.query   = vi.fn()
proto.connect = vi.fn()

// ─── 2. Import model AFTER intercepting ────────────────────────────────────────
const projectModule = await import('../../../models/projectModel')
const ProjectModel = projectModule.default ?? projectModule

// ─── 3. Fake transactional client factory ──────────────────────────────────────
const makeFakeClient = () => ({
  query:   vi.fn(),
  release: vi.fn()
})

// ─── 4. Reset mocks between tests ──────────────────────────────────────────────
beforeEach(() => {
  proto.query.mockReset()
  proto.connect.mockReset()
})

// ══════════════════════════════════════════════════════════════════════════════
// getAll
// ══════════════════════════════════════════════════════════════════════════════
describe('ProjectModel.getAll', () => {

  it('returns the array of project rows from the DB', async () => {
    const fakeRows = [
      { id: 2, title: 'Proyecto B', abstract: '...', year: 2024, category_id: 1, status: 'active', category_name: 'IA', authors: [] },
      { id: 1, title: 'Proyecto A', abstract: '...', year: 2023, category_id: 2, status: 'draft',  category_name: 'Redes', authors: [] }
    ]
    proto.query.mockResolvedValue({ rows: fakeRows })

    const result = await ProjectModel.getAll()

    expect(result).toEqual(fakeRows)
  })

  it('returns an empty array when there are no projects', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    expect(await ProjectModel.getAll()).toEqual([])
  })

  it('SQL joins categories, project_authors and users', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProjectModel.getAll()

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/LEFT JOIN categories/i)
    expect(sql).toMatch(/LEFT JOIN project_authors/i)
    expect(sql).toMatch(/LEFT JOIN users/i)
  })

  it('SQL uses COALESCE with json_agg to build the authors array', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProjectModel.getAll()

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/COALESCE/i)
    expect(sql).toMatch(/json_agg/i)
  })

  it('SQL includes GROUP BY and ORDER BY p.id DESC', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProjectModel.getAll()

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/GROUP BY/i)
    expect(sql).toMatch(/ORDER BY p\.id DESC/i)
  })

  it('SQL does not select image_data or pdf_data', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProjectModel.getAll()

    const sql = proto.query.mock.calls[0][0]
    expect(sql).not.toMatch(/image_data/i)
    expect(sql).not.toMatch(/pdf_data/i)
  })

  it('sends no query parameters (static query)', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProjectModel.getAll()

    expect(proto.query.mock.calls[0]).toHaveLength(1)
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('getAll failed'))

    await expect(ProjectModel.getAll()).rejects.toThrow('getAll failed')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// getById
// ══════════════════════════════════════════════════════════════════════════════
describe('ProjectModel.getById', () => {

  it('returns the project row when found', async () => {
    const fakeRow = { id: 1, title: 'P1', abstract: '...', year: 2023, category_id: 1, status: 'active', authors: [] }
    proto.query.mockResolvedValue({ rows: [fakeRow] })

    expect(await ProjectModel.getById(1)).toEqual(fakeRow)
  })

  it('returns null when the project id does not exist', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    expect(await ProjectModel.getById(999)).toBeNull()
  })

  it('SQL filters by p.id = $1 and groups by p.id', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProjectModel.getById(5)

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/WHERE p\.id\s*=\s*\$1/i)
    expect(sql).toMatch(/GROUP BY p\.id/i)
  })

  it('passes only the id as the query parameter', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProjectModel.getById(7)

    expect(proto.query.mock.calls[0][1]).toEqual([7])
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('getById failed'))

    await expect(ProjectModel.getById(1)).rejects.toThrow('getById failed')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// create (transaction)
// ══════════════════════════════════════════════════════════════════════════════
describe('ProjectModel.create', () => {

  const projectData = {
    title: 'Nuevo Proyecto', abstract: 'Resumen', year: 2024,
    category_id: 1, status: 'active',
    image_data: Buffer.from('img'), image_mimetype: 'image/png',
    pdf_data: Buffer.from('pdf'), pdf_mimetype: 'application/pdf'
  }

  it('returns the newly created project row', async () => {
    const fakeProject = { id: 10, title: 'Nuevo Proyecto', abstract: 'Resumen', year: 2024, category_id: 1, status: 'active' }
    const client = makeFakeClient()
    client.query
      .mockResolvedValueOnce({})                       // BEGIN
      .mockResolvedValueOnce({ rows: [fakeProject] })  // INSERT project
      .mockResolvedValueOnce({})                       // INSERT author
      .mockResolvedValueOnce({})                       // COMMIT
    proto.connect.mockResolvedValue(client)

    const result = await ProjectModel.create(projectData, [3])

    expect(result).toEqual(fakeProject)
  })

  it('executes BEGIN and COMMIT on success', async () => {
    const client = makeFakeClient()
    client.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [{ id: 1 }] })
      .mockResolvedValueOnce({})
    proto.connect.mockResolvedValue(client)

    await ProjectModel.create(projectData, [])

    const calls = client.query.mock.calls.map(c => c[0])
    expect(calls[0]).toMatch(/BEGIN/i)
    expect(calls[calls.length - 1]).toMatch(/COMMIT/i)
  })

  it('inserts one row in project_authors per authorId', async () => {
    const client = makeFakeClient()
    client.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [{ id: 5 }] })
      .mockResolvedValueOnce({})  // author 1
      .mockResolvedValueOnce({})  // author 2
      .mockResolvedValueOnce({})  // COMMIT
    proto.connect.mockResolvedValue(client)

    await ProjectModel.create(projectData, [1, 2])

    const authorInserts = client.query.mock.calls.filter(
      c => typeof c[0] === 'string' && c[0].includes('project_authors')
    )
    expect(authorInserts).toHaveLength(2)
  })

  it('skips author inserts when authorIds is empty', async () => {
    const client = makeFakeClient()
    client.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [{ id: 6 }] })
      .mockResolvedValueOnce({})
    proto.connect.mockResolvedValue(client)

    await ProjectModel.create(projectData, [])

    const authorInserts = client.query.mock.calls.filter(
      c => typeof c[0] === 'string' && c[0].includes('project_authors')
    )
    expect(authorInserts).toHaveLength(0)
  })

  it('passes all 9 values including binary buffers to INSERT', async () => {
    const client = makeFakeClient()
    client.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [{ id: 7 }] })
      .mockResolvedValueOnce({})
    proto.connect.mockResolvedValue(client)

    await ProjectModel.create(projectData, [])

    const insertCall = client.query.mock.calls[1] // second call = INSERT project
    expect(insertCall[1]).toEqual([
      projectData.title, projectData.abstract, projectData.year,
      projectData.category_id, projectData.status,
      projectData.image_data, projectData.image_mimetype,
      projectData.pdf_data, projectData.pdf_mimetype
    ])
  })

  it('calls ROLLBACK and re-throws when the INSERT fails', async () => {
    const client = makeFakeClient()
    client.query
      .mockResolvedValueOnce({})                          // BEGIN
      .mockRejectedValueOnce(new Error('Insert failed'))  // INSERT project
      .mockResolvedValueOnce({})                          // ROLLBACK
    proto.connect.mockResolvedValue(client)

    await expect(ProjectModel.create(projectData, [])).rejects.toThrow('Insert failed')

    const calls = client.query.mock.calls.map(c => c[0])
    expect(calls).toContain('ROLLBACK')
  })

  it('always calls client.release() — even on error', async () => {
    const client = makeFakeClient()
    client.query
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({})
    proto.connect.mockResolvedValue(client)

    await expect(ProjectModel.create(projectData, [])).rejects.toThrow()

    expect(client.release).toHaveBeenCalledTimes(1)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// update (transaction)
// ══════════════════════════════════════════════════════════════════════════════
describe('ProjectModel.update', () => {

  const projectData = {
    title: 'Actualizado', abstract: 'Nuevo resumen', year: 2025,
    category_id: 2, status: 'published',
    image_data: null, image_mimetype: null,
    pdf_data: null,   pdf_mimetype: null
  }

  it('returns the updated project row', async () => {
    const fakeProject = { id: 3, title: 'Actualizado', abstract: 'Nuevo resumen', year: 2025, category_id: 2, status: 'published' }
    const client = makeFakeClient()
    client.query
      .mockResolvedValueOnce({})                       // BEGIN
      .mockResolvedValueOnce({ rows: [fakeProject] })  // UPDATE
      .mockResolvedValueOnce({})                       // DELETE project_authors
      .mockResolvedValueOnce({})                       // INSERT author
      .mockResolvedValueOnce({})                       // COMMIT
    proto.connect.mockResolvedValue(client)

    const result = await ProjectModel.update(3, projectData, [5])

    expect(result).toEqual(fakeProject)
  })

  it('executes BEGIN and COMMIT on success', async () => {
    const client = makeFakeClient()
    client.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [{ id: 1 }] })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
    proto.connect.mockResolvedValue(client)

    await ProjectModel.update(1, projectData, [])

    const calls = client.query.mock.calls.map(c => c[0])
    expect(calls[0]).toMatch(/BEGIN/i)
    expect(calls[calls.length - 1]).toMatch(/COMMIT/i)
  })

  it('deletes existing project_authors before re-inserting', async () => {
    const client = makeFakeClient()
    client.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [{ id: 2 }] })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
    proto.connect.mockResolvedValue(client)

    await ProjectModel.update(2, projectData, [])

    const deleteCalls = client.query.mock.calls.filter(
      c => typeof c[0] === 'string' && /DELETE FROM project_authors/i.test(c[0])
    )
    expect(deleteCalls).toHaveLength(1)
    expect(deleteCalls[0][1]).toEqual([2])
  })

  it('SQL uses COALESCE for all four binary fields', async () => {
    const client = makeFakeClient()
    client.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [{ id: 1 }] })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
    proto.connect.mockResolvedValue(client)

    await ProjectModel.update(1, projectData, [])

    const sql = client.query.mock.calls[1][0]
    expect(sql).toMatch(/COALESCE\(\$6,\s*image_data\)/i)
    expect(sql).toMatch(/COALESCE\(\$7,\s*image_mimetype\)/i)
    expect(sql).toMatch(/COALESCE\(\$8,\s*pdf_data\)/i)
    expect(sql).toMatch(/COALESCE\(\$9,\s*pdf_mimetype\)/i)
  })

  it('passes values in correct order [...fields, id] with id at $10', async () => {
    const client = makeFakeClient()
    client.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [{ id: 4 }] })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
    proto.connect.mockResolvedValue(client)

    await ProjectModel.update(4, projectData, [])

    const values = client.query.mock.calls[1][1]
    expect(values).toEqual([
      projectData.title, projectData.abstract, projectData.year,
      projectData.category_id, projectData.status,
      projectData.image_data, projectData.image_mimetype,
      projectData.pdf_data, projectData.pdf_mimetype,
      4
    ])
  })

  it('calls ROLLBACK and re-throws when the UPDATE fails', async () => {
    const client = makeFakeClient()
    client.query
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error('Update failed'))
      .mockResolvedValueOnce({})
    proto.connect.mockResolvedValue(client)

    await expect(ProjectModel.update(1, projectData, [])).rejects.toThrow('Update failed')

    const calls = client.query.mock.calls.map(c => c[0])
    expect(calls).toContain('ROLLBACK')
  })

  it('always calls client.release() — even on error', async () => {
    const client = makeFakeClient()
    client.query
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({})
    proto.connect.mockResolvedValue(client)

    await expect(ProjectModel.update(1, projectData, [])).rejects.toThrow()

    expect(client.release).toHaveBeenCalledTimes(1)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// delete
// ══════════════════════════════════════════════════════════════════════════════
describe('ProjectModel.delete', () => {

  it('returns { id, title } of the deleted record when found', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 8, title: 'A eliminar' }] })

    expect(await ProjectModel.delete(8)).toEqual({ id: 8, title: 'A eliminar' })
  })

  it('returns null when the project id does not exist', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    expect(await ProjectModel.delete(999)).toBeNull()
  })

  it('SQL contains DELETE FROM projects WHERE id = $1 RETURNING id, title', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await ProjectModel.delete(1)

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/DELETE FROM projects/i)
    expect(sql).toMatch(/WHERE id\s*=\s*\$1/i)
    expect(sql).toMatch(/RETURNING id,\s*title/i)
  })

  it('passes only the id as the query parameter', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 3 }] })

    await ProjectModel.delete(3)

    expect(proto.query.mock.calls[0][1]).toEqual([3])
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('Delete failed'))

    await expect(ProjectModel.delete(1)).rejects.toThrow('Delete failed')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// getByAuthorId
// ══════════════════════════════════════════════════════════════════════════════
describe('ProjectModel.getByAuthorId', () => {

  it('returns the array of projects for a given author', async () => {
    const fakeRows = [{ id: 1, title: 'P1', year: 2024, category_name: 'IA', authors: [] }]
    proto.query.mockResolvedValue({ rows: fakeRows })

    expect(await ProjectModel.getByAuthorId(5)).toEqual(fakeRows)
  })

  it('returns an empty array when the author has no projects', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    expect(await ProjectModel.getByAuthorId(99)).toEqual([])
  })

  it('SQL filters by pa.user_id = $1', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProjectModel.getByAuthorId(3)

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/WHERE pa\.user_id\s*=\s*\$1/i)
  })

  it('SQL orders by year DESC and id DESC', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProjectModel.getByAuthorId(3)

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/ORDER BY p\.year DESC,\s*p\.id DESC/i)
  })

  it('passes only the userId as the query parameter', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProjectModel.getByAuthorId(7)

    expect(proto.query.mock.calls[0][1]).toEqual([7])
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('Author query failed'))

    await expect(ProjectModel.getByAuthorId(1)).rejects.toThrow('Author query failed')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// getImage
// ══════════════════════════════════════════════════════════════════════════════
describe('ProjectModel.getImage', () => {

  it('returns { image_data, image_mimetype } when the record exists', async () => {
    const fakeRow = { image_data: Buffer.from('img'), image_mimetype: 'image/png' }
    proto.query.mockResolvedValue({ rows: [fakeRow] })

    expect(await ProjectModel.getImage(1)).toEqual(fakeRow)
  })

  it('returns null when the project id does not exist', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    expect(await ProjectModel.getImage(999)).toBeNull()
  })

  it('SQL selects only image_data and image_mimetype WHERE id = $1', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProjectModel.getImage(1)

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/SELECT\s+image_data,\s*image_mimetype/i)
    expect(sql).toMatch(/FROM projects/i)
    expect(sql).toMatch(/WHERE id\s*=\s*\$1/i)
  })

  it('passes only the id as the query parameter', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProjectModel.getImage(6)

    expect(proto.query.mock.calls[0][1]).toEqual([6])
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('Image fetch failed'))

    await expect(ProjectModel.getImage(1)).rejects.toThrow('Image fetch failed')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// getPdf
// ══════════════════════════════════════════════════════════════════════════════
describe('ProjectModel.getPdf', () => {

  it('returns { pdf_data, pdf_mimetype } when the record exists', async () => {
    const fakeRow = { pdf_data: Buffer.from('pdf'), pdf_mimetype: 'application/pdf' }
    proto.query.mockResolvedValue({ rows: [fakeRow] })

    expect(await ProjectModel.getPdf(1)).toEqual(fakeRow)
  })

  it('returns null when the project id does not exist', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    expect(await ProjectModel.getPdf(999)).toBeNull()
  })

  it('SQL selects only pdf_data and pdf_mimetype WHERE id = $1', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProjectModel.getPdf(1)

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/SELECT\s+pdf_data,\s*pdf_mimetype/i)
    expect(sql).toMatch(/FROM projects/i)
    expect(sql).toMatch(/WHERE id\s*=\s*\$1/i)
  })

  it('passes only the id as the query parameter', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ProjectModel.getPdf(9)

    expect(proto.query.mock.calls[0][1]).toEqual([9])
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('PDF fetch failed'))

    await expect(ProjectModel.getPdf(1)).rejects.toThrow('PDF fetch failed')
  })
})