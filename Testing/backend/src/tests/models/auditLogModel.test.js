import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../config/db', () => ({
  query: vi.fn(),
}))

const pool = require('../../config/db')
const AuditLogModel = require('../../models/auditLogModel')

describe('auditLogModel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('logAction', () => {
    it('01 - Lanza error si falta userId')
    it('02 - Lanza error si falta action')
    it('03 - Lanza error si falta entityType')
    it('04 - Llama pool.query con INSERT INTO audit_logs')
    it('05 - Envía values en el orden correcto')
    it('06 - Usa entityId null por defecto')
    it('07 - Usa details null por defecto')
    it('08 - Retorna rows[0] cuando la inserción es exitosa')
    it('09 - Hace console.error y relanza error si la inserción falla')
  })

  describe('getRecentLogs', () => {
    it('10 - Usa limit 50 por defecto')
    it('11 - Llama pool.query con la consulta de logs recientes')
    it('12 - Retorna rows cuando la consulta es exitosa')
    it('13 - Retorna arreglo vacío si no hay logs')
    it('14 - Hace console.error y relanza error si la consulta falla')
  })
})