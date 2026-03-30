/**
 * @file newsModel.test.js
 * @description Unit tests for NewsModel (DAO for news table).
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
const newsModule = await import('../../../models/newsModel')
const NewsModel = newsModule.default ?? newsModule

// ─── 3. Reset mock between tests ───────────────────────────────────────────────
beforeEach(() => {
  proto.query.mockReset()
})

// ══════════════════════════════════════════════════════════════════════════════
// getAll
// ══════════════════════════════════════════════════════════════════════════════
describe('NewsModel.getAll', () => {

  it('returns the array of news rows from the DB', async () => {
    const fakeRows = [
      { id: 2, title: 'Noticia B', slug: 'noticia-b', content: '...', is_active: true,  published_at: new Date(), created_by: 1 },
      { id: 1, title: 'Noticia A', slug: 'noticia-a', content: '...', is_active: false, published_at: new Date(), created_by: 1 }
    ]
    proto.query.mockResolvedValue({ rows: fakeRows })

    const result = await NewsModel.getAll()

    expect(result).toEqual(fakeRows)
  })

  it('returns an empty array when there are no records', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    const result = await NewsModel.getAll()

    expect(result).toEqual([])
  })

  it('selects text fields only — no image_data', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await NewsModel.getAll()

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/SELECT\s+id,\s*title,\s*slug,\s*content,\s*is_active,\s*published_at,\s*created_by/i)
    expect(sql).not.toMatch(/image_data/i)
  })

  it('orders results by published_at DESC', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await NewsModel.getAll()

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/ORDER BY published_at DESC/i)
  })

  it('sends no query parameters (static query)', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await NewsModel.getAll()

    expect(proto.query.mock.calls[0]).toHaveLength(1)
  })

  it('calls pool.query exactly once', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await NewsModel.getAll()

    expect(proto.query).toHaveBeenCalledTimes(1)
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('Connection lost'))

    await expect(NewsModel.getAll()).rejects.toThrow('Connection lost')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// create
// ══════════════════════════════════════════════════════════════════════════════
describe('NewsModel.create', () => {

  const fakeBuffer = Buffer.from('fake-image')

  it('returns the newly created news row (without binary fields)', async () => {
    const fakeRow = { id: 1, title: 'Nueva noticia', slug: 'nueva-noticia', content: 'Texto', is_active: true, published_at: new Date(), created_by: 5 }
    proto.query.mockResolvedValue({ rows: [fakeRow] })

    const result = await NewsModel.create('Nueva noticia', 'nueva-noticia', 'Texto', fakeBuffer, 'image/png', 5, true)

    expect(result).toEqual(fakeRow)
  })

  it('SQL contains INSERT INTO news and NOW() for published_at', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await NewsModel.create('T', 's', 'C', null, null, 1, true)

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/INSERT INTO news/i)
    expect(sql).toMatch(/NOW\(\)/i)
  })

  it('RETURNING excludes binary fields (id, title, slug, content, is_active, published_at, created_by)', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await NewsModel.create('T', 's', 'C', null, null, 1, true)

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/RETURNING id,\s*title,\s*slug,\s*content,\s*is_active,\s*published_at,\s*created_by/i)
    expect(sql).not.toMatch(/RETURNING.*image_data/i)
  })

  it('passes values in order [title, slug, content, imageData, imageMimetype, userId, isActive]', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await NewsModel.create('Título', 'titulo', 'Contenido', fakeBuffer, 'image/jpeg', 3, false)

    const values = proto.query.mock.calls[0][1]
    expect(values).toEqual(['Título', 'titulo', 'Contenido', fakeBuffer, 'image/jpeg', 3, false])
  })

  it('accepts null for imageData, imageMimetype and userId', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 2 }] })

    await NewsModel.create('T', 's', 'C', null, null, null, true)

    const values = proto.query.mock.calls[0][1]
    expect(values[3]).toBeNull() // imageData
    expect(values[4]).toBeNull() // imageMimetype
    expect(values[5]).toBeNull() // userId
  })

  it('calls pool.query exactly once', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await NewsModel.create('T', 's', 'C', null, null, 1, true)

    expect(proto.query).toHaveBeenCalledTimes(1)
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('Duplicate slug'))

    await expect(
      NewsModel.create('T', 'slug-duplicado', 'C', null, null, 1, true)
    ).rejects.toThrow('Duplicate slug')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// update
// ══════════════════════════════════════════════════════════════════════════════
describe('NewsModel.update', () => {

  const fakeBuffer = Buffer.from('updated-image')

  it('returns the updated news row when the record exists', async () => {
    const fakeRow = { id: 1, title: 'Actualizada', slug: 'actualizada', content: 'Nuevo contenido', is_active: true, published_at: new Date() }
    proto.query.mockResolvedValue({ rows: [fakeRow] })

    const result = await NewsModel.update(1, 'Actualizada', 'actualizada', 'Nuevo contenido', fakeBuffer, 'image/png', true)

    expect(result).toEqual(fakeRow)
  })

  it('returns null when the news id does not exist', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    const result = await NewsModel.update(999, 'X', 'x', 'X', null, null, true)

    expect(result).toBeNull()
  })

  it('SQL uses COALESCE for image_data and image_mimetype', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await NewsModel.update(1, 'T', 's', 'C', null, null, true)

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/COALESCE\(\$5,\s*image_data\)/i)
    expect(sql).toMatch(/COALESCE\(\$6,\s*image_mimetype\)/i)
  })

  it('SQL contains UPDATE news SET and WHERE id = $7', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await NewsModel.update(1, 'T', 's', 'C', null, null, true)

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/UPDATE news/i)
    expect(sql).toMatch(/WHERE id\s*=\s*\$7/i)
  })

  it('passes values in order [title, slug, content, isActive, imageData, imageMimetype, id]', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 2 }] })

    await NewsModel.update(2, 'Título', 'titulo', 'Contenido', fakeBuffer, 'image/png', false)

    const values = proto.query.mock.calls[0][1]
    expect(values).toEqual(['Título', 'titulo', 'Contenido', false, fakeBuffer, 'image/png', 2])
  })

  it('null imageData and imageMimetype are placed at positions $5 and $6', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 3 }] })

    await NewsModel.update(3, 'T', 's', 'C', null, null, true)

    const values = proto.query.mock.calls[0][1]
    expect(values[4]).toBeNull() // $5 → imageData
    expect(values[5]).toBeNull() // $6 → imageMimetype
  })

  it('calls pool.query exactly once', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await NewsModel.update(1, 'T', 's', 'C', null, null, true)

    expect(proto.query).toHaveBeenCalledTimes(1)
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('Slug conflict'))

    await expect(
      NewsModel.update(1, 'T', 'conflicto', 'C', null, null, true)
    ).rejects.toThrow('Slug conflict')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// delete
// ══════════════════════════════════════════════════════════════════════════════
describe('NewsModel.delete', () => {

  it('returns { id, title } of the deleted record when found', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 4, title: 'Noticia eliminada' }] })

    const result = await NewsModel.delete(4)

    expect(result).toEqual({ id: 4, title: 'Noticia eliminada' })
  })

  it('returns null when the news id does not exist', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    const result = await NewsModel.delete(999)

    expect(result).toBeNull()
  })

  it('SQL contains DELETE FROM news WHERE id = $1 RETURNING id, title', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await NewsModel.delete(1)

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/DELETE FROM news/i)
    expect(sql).toMatch(/WHERE id\s*=\s*\$1/i)
    expect(sql).toMatch(/RETURNING id,\s*title/i)
  })

  it('passes only the id as the query parameter', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 5 }] })

    await NewsModel.delete(5)

    expect(proto.query.mock.calls[0][1]).toEqual([5])
  })

  it('calls pool.query exactly once', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await NewsModel.delete(1)

    expect(proto.query).toHaveBeenCalledTimes(1)
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('Foreign key violation'))

    await expect(NewsModel.delete(1)).rejects.toThrow('Foreign key violation')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// getBySlug
// ══════════════════════════════════════════════════════════════════════════════
describe('NewsModel.getBySlug', () => {

  it('returns the news row when the slug exists', async () => {
    const fakeRow = { id: 1, title: 'Noticia', slug: 'noticia', content: '...', is_active: true, published_at: new Date(), created_by: 1 }
    proto.query.mockResolvedValue({ rows: [fakeRow] })

    const result = await NewsModel.getBySlug('noticia')

    expect(result).toEqual(fakeRow)
  })

  it('returns null when the slug does not exist', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    const result = await NewsModel.getBySlug('slug-inexistente')

    expect(result).toBeNull()
  })

  it('SQL queries by slug with WHERE slug = $1', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await NewsModel.getBySlug('mi-noticia')

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/WHERE slug\s*=\s*\$1/i)
    expect(sql).toMatch(/FROM news/i)
  })

  it('passes only the slug as the query parameter', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await NewsModel.getBySlug('test-slug')

    expect(proto.query.mock.calls[0][1]).toEqual(['test-slug'])
  })

  it('calls pool.query exactly once', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await NewsModel.getBySlug('any-slug')

    expect(proto.query).toHaveBeenCalledTimes(1)
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('Slug query failed'))

    await expect(NewsModel.getBySlug('bad-slug')).rejects.toThrow('Slug query failed')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// getImage
// ══════════════════════════════════════════════════════════════════════════════
describe('NewsModel.getImage', () => {

  it('returns { image_data, image_mimetype } when the record exists', async () => {
    const fakeRow = { image_data: Buffer.from('img'), image_mimetype: 'image/jpeg' }
    proto.query.mockResolvedValue({ rows: [fakeRow] })

    const result = await NewsModel.getImage(1)

    expect(result).toEqual(fakeRow)
  })

  it('returns null when the news id does not exist', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    const result = await NewsModel.getImage(999)

    expect(result).toBeNull()
  })

  it('SQL selects only image_data and image_mimetype WHERE id = $1', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await NewsModel.getImage(1)

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/SELECT\s+image_data,\s*image_mimetype/i)
    expect(sql).toMatch(/FROM news/i)
    expect(sql).toMatch(/WHERE id\s*=\s*\$1/i)
  })

  it('passes only the id as the query parameter', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await NewsModel.getImage(7)

    expect(proto.query.mock.calls[0][1]).toEqual([7])
  })

  it('calls pool.query exactly once', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await NewsModel.getImage(1)

    expect(proto.query).toHaveBeenCalledTimes(1)
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('Image not found'))

    await expect(NewsModel.getImage(1)).rejects.toThrow('Image not found')
  })
})