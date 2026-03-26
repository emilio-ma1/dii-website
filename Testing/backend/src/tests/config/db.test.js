import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockPoolInstance = {
  on: vi.fn(),
}

vi.mock('pg', () => ({
  Pool: vi.fn(() => mockPoolInstance),
}))

vi.mock('dotenv', () => ({
  config: vi.fn(),
}))

function loadDbModule() {
  vi.resetModules()
  return require('../../config/db')
}

describe('db config', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    process.env.DB_USER = 'postgres'
    process.env.DB_HOST = 'localhost'
    process.env.DB_NAME = 'dii_db'
    process.env.DB_PASSWORD = 'secret'
    process.env.DB_PORT = '5432'

    vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(process, 'exit').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Inicialización', () => {
    it('01 - Ejecuta dotenv.config al cargar el módulo')
    it('02 - Crea Pool con las variables de entorno')
    it('03 - Exporta la instancia del pool')
  })

  describe('Eventos del pool', () => {
    it('04 - Registra listener para connect')
    it('05 - Registra listener para error')
    it('06 - El listener connect hace console.info')
    it('07 - El listener error hace console.error')
    it('08 - El listener error llama process.exit(-1)')
  })

  describe('Consistencia', () => {
    it('09 - Registra exactamente dos listeners')
  })
})