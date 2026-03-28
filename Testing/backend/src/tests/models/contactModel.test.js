// src/tests/models/contactModel.test.js
import { describe, it, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../config/db', () => ({
  query: vi.fn(),
}))

const pool = require('../../config/db')
const ContactModel = require('../../models/contactModel')

describe('contactModel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getAll', () => {
    it.todo('01 - Llama pool.query una vez')
    it.todo('02 - Ejecuta SELECT id, initials, full_name, role FROM contacts ORDER BY id ASC')
    it.todo('03 - Retorna rows cuando la consulta es exitosa')
    it.todo('04 - Retorna arreglo vacío si no hay contactos')
    it.todo('05 - Hace console.error y relanza error si la consulta falla')
  })

  describe('create', () => {
    it.todo('06 - Llama pool.query con INSERT INTO contacts')
    it.todo('07 - Envía values en el orden correcto')
    it.todo('08 - Retorna rows[0] cuando create es exitoso')
    it.todo('09 - Hace console.error y relanza error si create falla')
  })

  describe('update', () => {
    it.todo('10 - Llama pool.query con UPDATE contacts')
    it.todo('11 - Envía values en el orden correcto')
    it.todo('12 - Retorna rows[0] si el contacto existe')
    it.todo('13 - Retorna null si el contacto no existe')
    it.todo('14 - Hace console.error y relanza error si update falla')
  })

  describe('delete', () => {
    it.todo('15 - Llama pool.query con DELETE FROM contacts WHERE id = $1')
    it.todo('16 - Retorna rows[0] si elimina un contacto existente')
    it.todo('17 - Retorna null si el contacto no existe')
    it.todo('18 - Hace console.error y relanza error si delete falla')
  })
})