/**
 * @file equipmentModel.test.js
 * @description Unit tests for EquipmentModel (DAO for equipment table).
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
const equipmentModule = await import('../../../models/equipmentModel')
const EquipmentModel = equipmentModule.default ?? equipmentModule

// ─── 3. Reset mock between tests ───────────────────────────────────────────────
beforeEach(() => {
  proto.query.mockReset()
})

// ══════════════════════════════════════════════════════════════════════════════
// getAll
// ══════════════════════════════════════════════════════════════════════════════
describe('EquipmentModel.getAll', () => {

  it('returns the array of equipment rows from the DB', async () => {
    const fakeRows = [
      { id: 2, name: 'Microscopio', description: 'Óptico 40x' },
      { id: 1, name: 'Centrifuga',  description: 'RPM 5000'   }
    ]
    proto.query.mockResolvedValue({ rows: fakeRows })

    const result = await EquipmentModel.getAll()

    expect(result).toEqual(fakeRows)
  })

  it('returns an empty array when there are no records', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    const result = await EquipmentModel.getAll()

    expect(result).toEqual([])
  })

  it('selects only id, name and description — no image_data', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await EquipmentModel.getAll()

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/SELECT\s+id,\s*name,\s*description/i)
    expect(sql).not.toMatch(/image_data/i)
  })

  it('orders results by id DESC', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await EquipmentModel.getAll()

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/ORDER BY id DESC/i)
  })

  it('sends no query parameters (static query)', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await EquipmentModel.getAll()

    expect(proto.query.mock.calls[0]).toHaveLength(1)
  })

  it('calls pool.query exactly once', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await EquipmentModel.getAll()

    expect(proto.query).toHaveBeenCalledTimes(1)
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('Connection timeout'))

    await expect(EquipmentModel.getAll()).rejects.toThrow('Connection timeout')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// create
// ══════════════════════════════════════════════════════════════════════════════
describe('EquipmentModel.create', () => {

  const fakeBuffer = Buffer.from('fake-image-data')

  it('returns the newly created equipment row (without binary fields)', async () => {
    const fakeRow = { id: 1, name: 'Láser', description: 'UV 365nm' }
    proto.query.mockResolvedValue({ rows: [fakeRow] })

    const result = await EquipmentModel.create('Láser', 'UV 365nm', fakeBuffer, 'image/png')

    expect(result).toEqual(fakeRow)
  })

  it('SQL contains INSERT INTO equipment and RETURNING', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await EquipmentModel.create('Equipo A', null, null, null)

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/INSERT INTO equipment/i)
    expect(sql).toMatch(/RETURNING/i)
  })

  it('RETURNING excludes binary fields (only id, name, description)', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await EquipmentModel.create('Equipo B', 'Desc', fakeBuffer, 'image/jpeg')

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/RETURNING id,\s*name,\s*description/i)
    expect(sql).not.toMatch(/RETURNING.*image_data/i)
  })

  it('passes values in order [name, description, imageData, imageMimetype]', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await EquipmentModel.create('Equipo C', 'Desc C', fakeBuffer, 'image/png')

    const values = proto.query.mock.calls[0][1]
    expect(values).toEqual(['Equipo C', 'Desc C', fakeBuffer, 'image/png'])
  })

  it('accepts null for description, imageData and imageMimetype', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 2 }] })

    await EquipmentModel.create('Equipo D', null, null, null)

    const values = proto.query.mock.calls[0][1]
    expect(values).toEqual(['Equipo D', null, null, null])
  })

  it('calls pool.query exactly once', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await EquipmentModel.create('Equipo E', null, null, null)

    expect(proto.query).toHaveBeenCalledTimes(1)
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('Unique name constraint'))

    await expect(
      EquipmentModel.create('Duplicado', null, null, null)
    ).rejects.toThrow('Unique name constraint')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// update
// ══════════════════════════════════════════════════════════════════════════════
describe('EquipmentModel.update', () => {

  const fakeBuffer = Buffer.from('new-image')

  it('returns the updated equipment row when the record exists', async () => {
    const fakeRow = { id: 3, name: 'Espectrómetro', description: 'IR 400nm' }
    proto.query.mockResolvedValue({ rows: [fakeRow] })

    const result = await EquipmentModel.update(3, 'Espectrómetro', 'IR 400nm', fakeBuffer, 'image/png')

    expect(result).toEqual(fakeRow)
  })

  it('returns null when the equipment id does not exist', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    const result = await EquipmentModel.update(999, 'No Existe', null, null, null)

    expect(result).toBeNull()
  })

  it('SQL uses COALESCE for image_data and image_mimetype', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await EquipmentModel.update(1, 'Equipo', 'Desc', null, null)

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/COALESCE\(\$3,\s*image_data\)/i)
    expect(sql).toMatch(/COALESCE\(\$4,\s*image_mimetype\)/i)
  })

  it('SQL contains UPDATE equipment SET and WHERE id = $5', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await EquipmentModel.update(1, 'Equipo', 'Desc', null, null)

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/UPDATE equipment/i)
    expect(sql).toMatch(/WHERE id\s*=\s*\$5/i)
  })

  it('passes values in order [name, description, imageData, imageMimetype, id]', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 4 }] })

    await EquipmentModel.update(4, 'Equipo F', 'Desc F', fakeBuffer, 'image/jpeg')

    const values = proto.query.mock.calls[0][1]
    expect(values).toEqual(['Equipo F', 'Desc F', fakeBuffer, 'image/jpeg', 4])
  })

  it('accepts null for imageData and imageMimetype (COALESCE keeps existing)', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 5 }] })

    await EquipmentModel.update(5, 'Equipo G', 'Solo texto', null, null)

    const values = proto.query.mock.calls[0][1]
    expect(values[2]).toBeNull()
    expect(values[3]).toBeNull()
  })

  it('calls pool.query exactly once', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await EquipmentModel.update(1, 'X', null, null, null)

    expect(proto.query).toHaveBeenCalledTimes(1)
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('Deadlock on equipment'))

    await expect(
      EquipmentModel.update(1, 'X', null, null, null)
    ).rejects.toThrow('Deadlock on equipment')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// delete
// ══════════════════════════════════════════════════════════════════════════════
describe('EquipmentModel.delete', () => {

  it('returns { id, name } of the deleted record when found', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 6, name: 'Microscopio' }] })

    const result = await EquipmentModel.delete(6)

    expect(result).toEqual({ id: 6, name: 'Microscopio' })
  })

  it('returns null when the equipment id does not exist', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    const result = await EquipmentModel.delete(999)

    expect(result).toBeNull()
  })

  it('SQL contains DELETE FROM equipment WHERE id = $1 RETURNING id, name', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await EquipmentModel.delete(1)

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/DELETE FROM equipment/i)
    expect(sql).toMatch(/WHERE id\s*=\s*\$1/i)
    expect(sql).toMatch(/RETURNING id,\s*name/i)
  })

  it('passes only the id as the query parameter', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 7 }] })

    await EquipmentModel.delete(7)

    const values = proto.query.mock.calls[0][1]
    expect(values).toEqual([7])
  })

  it('calls pool.query exactly once', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await EquipmentModel.delete(1)

    expect(proto.query).toHaveBeenCalledTimes(1)
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('Foreign key violation'))

    await expect(EquipmentModel.delete(1)).rejects.toThrow('Foreign key violation')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// getImage
// ══════════════════════════════════════════════════════════════════════════════
describe('EquipmentModel.getImage', () => {

  it('returns { image_data, image_mimetype } when the record exists', async () => {
    const fakeRow = { image_data: Buffer.from('img'), image_mimetype: 'image/png' }
    proto.query.mockResolvedValue({ rows: [fakeRow] })

    const result = await EquipmentModel.getImage(1)

    expect(result).toEqual(fakeRow)
  })

  it('returns null when the equipment id does not exist', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    const result = await EquipmentModel.getImage(999)

    expect(result).toBeNull()
  })

  it('SQL selects only image_data and image_mimetype', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await EquipmentModel.getImage(1)

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/SELECT\s+image_data,\s*image_mimetype/i)
    expect(sql).toMatch(/FROM equipment/i)
    expect(sql).toMatch(/WHERE id\s*=\s*\$1/i)
  })

  it('passes only the id as the query parameter', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await EquipmentModel.getImage(5)

    const values = proto.query.mock.calls[0][1]
    expect(values).toEqual([5])
  })

  it('calls pool.query exactly once', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await EquipmentModel.getImage(1)

    expect(proto.query).toHaveBeenCalledTimes(1)
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('Image fetch failed'))

    await expect(EquipmentModel.getImage(1)).rejects.toThrow('Image fetch failed')
  })
})