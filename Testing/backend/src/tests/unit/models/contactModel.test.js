/**
 * @file contactModel.test.js
 * @description Unit tests for ContactModel (DAO for contacts table).
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
const contactModule = await import('../../../models/contactModel')
const ContactModel = contactModule.default ?? contactModule

// ─── 3. Reset mock between tests ───────────────────────────────────────────────
beforeEach(() => {
  proto.query.mockReset()
})

// ══════════════════════════════════════════════════════════════════════════════
// getAll
// ══════════════════════════════════════════════════════════════════════════════
describe('ContactModel.getAll', () => {

  it('returns the array of contact rows from the DB', async () => {
    const fakeRows = [
      { id: 1, initials: 'AB', full_name: 'Ana Bello',   role: 'Director' },
      { id: 2, initials: 'CD', full_name: 'Carlos Díaz', role: 'Secretario' }
    ]
    proto.query.mockResolvedValue({ rows: fakeRows })

    const result = await ContactModel.getAll()

    expect(result).toEqual(fakeRows)
  })

  it('returns an empty array when there are no contacts', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    const result = await ContactModel.getAll()

    expect(result).toEqual([])
  })

  it('selects only id, initials, full_name and role (no SELECT *)', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ContactModel.getAll()

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/SELECT\s+id,\s*initials,\s*full_name,\s*role/i)
    expect(sql).not.toMatch(/SELECT \*/i)
  })

  it('orders results by id ASC', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ContactModel.getAll()

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/ORDER BY id ASC/i)
  })

  it('sends no query parameters (static query)', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ContactModel.getAll()

    expect(proto.query.mock.calls[0]).toHaveLength(1)
  })

  it('calls pool.query exactly once', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    await ContactModel.getAll()

    expect(proto.query).toHaveBeenCalledTimes(1)
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('DB unavailable'))

    await expect(ContactModel.getAll()).rejects.toThrow('DB unavailable')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// create
// ══════════════════════════════════════════════════════════════════════════════
describe('ContactModel.create', () => {

  it('returns the newly created contact row', async () => {
    const fakeRow = { id: 3, initials: 'EF', full_name: 'Elena Fuentes', role: 'Coordinadora' }
    proto.query.mockResolvedValue({ rows: [fakeRow] })

    const result = await ContactModel.create('EF', 'Elena Fuentes', 'Coordinadora')

    expect(result).toEqual(fakeRow)
  })

  it('SQL contains INSERT INTO contacts and RETURNING', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await ContactModel.create('GH', 'Gabriel Herrera', 'Profesor')

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/INSERT INTO contacts/i)
    expect(sql).toMatch(/RETURNING/i)
  })

  it('passes values in order [initials, fullName, role]', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await ContactModel.create('IJ', 'Isabel Jara', 'Administrativo')

    const values = proto.query.mock.calls[0][1]
    expect(values).toEqual(['IJ', 'Isabel Jara', 'Administrativo'])
  })

  it('RETURNING includes id, initials, full_name and role', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await ContactModel.create('KL', 'Karen López', 'Jefa')

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/RETURNING id,\s*initials,\s*full_name,\s*role/i)
  })

  it('calls pool.query exactly once', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await ContactModel.create('MN', 'Mario Núñez', 'Técnico')

    expect(proto.query).toHaveBeenCalledTimes(1)
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('Unique constraint violated'))

    await expect(
      ContactModel.create('OP', 'Omar Pérez', 'Asistente')
    ).rejects.toThrow('Unique constraint violated')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// update
// ══════════════════════════════════════════════════════════════════════════════
describe('ContactModel.update', () => {

  it('returns the updated contact row when the record exists', async () => {
    const fakeRow = { id: 5, initials: 'QR', full_name: 'Quirino Rojas', role: 'Director' }
    proto.query.mockResolvedValue({ rows: [fakeRow] })

    const result = await ContactModel.update(5, 'QR', 'Quirino Rojas', 'Director')

    expect(result).toEqual(fakeRow)
  })

  it('returns null when the contact id does not exist', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    const result = await ContactModel.update(999, 'XX', 'No Existe', 'Ninguno')

    expect(result).toBeNull()
  })

  it('SQL contains UPDATE contacts SET and WHERE id', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await ContactModel.update(1, 'ST', 'Sandra Torres', 'Profesora')

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/UPDATE contacts/i)
    expect(sql).toMatch(/SET/i)
    expect(sql).toMatch(/WHERE id\s*=\s*\$4/i)
  })

  it('passes values in order [initials, fullName, role, id]', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 2 }] })

    await ContactModel.update(2, 'UV', 'Ulises Vera', 'Técnico')

    const values = proto.query.mock.calls[0][1]
    expect(values).toEqual(['UV', 'Ulises Vera', 'Técnico', 2])
  })

  it('calls pool.query exactly once', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await ContactModel.update(1, 'WX', 'Wendy Xara', 'Secretaria')

    expect(proto.query).toHaveBeenCalledTimes(1)
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('Deadlock detected'))

    await expect(
      ContactModel.update(1, 'YZ', 'Yolanda Zapata', 'Jefa')
    ).rejects.toThrow('Deadlock detected')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// delete
// ══════════════════════════════════════════════════════════════════════════════
describe('ContactModel.delete', () => {

  it('returns the deleted row { id } when the record exists', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 7 }] })

    const result = await ContactModel.delete(7)

    expect(result).toEqual({ id: 7 })
  })

  it('returns null when the contact id does not exist', async () => {
    proto.query.mockResolvedValue({ rows: [] })

    const result = await ContactModel.delete(999)

    expect(result).toBeNull()
  })

  it('SQL contains DELETE FROM contacts WHERE id = $1 RETURNING id', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await ContactModel.delete(1)

    const sql = proto.query.mock.calls[0][0]
    expect(sql).toMatch(/DELETE FROM contacts/i)
    expect(sql).toMatch(/WHERE id\s*=\s*\$1/i)
    expect(sql).toMatch(/RETURNING id/i)
  })

  it('passes only the id as the query parameter', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 4 }] })

    await ContactModel.delete(4)

    const values = proto.query.mock.calls[0][1]
    expect(values).toEqual([4])
  })

  it('calls pool.query exactly once', async () => {
    proto.query.mockResolvedValue({ rows: [{ id: 1 }] })

    await ContactModel.delete(1)

    expect(proto.query).toHaveBeenCalledTimes(1)
  })

  it('re-throws the original DB error on query failure', async () => {
    proto.query.mockRejectedValue(new Error('Foreign key constraint'))

    await expect(ContactModel.delete(1)).rejects.toThrow('Foreign key constraint')
  })
})