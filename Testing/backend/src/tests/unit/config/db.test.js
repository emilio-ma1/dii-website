import { vi } from 'vitest'

// Silenciar dotenv real
vi.spyOn(console, 'info').mockImplementation(() => {})
vi.spyOn(console, 'error').mockImplementation(() => {})
vi.spyOn(process, 'exit').mockImplementation(() => undefined)

// Importar el pool real (no mockeado)
const poolModule = await import('../../../config/db')
const pool = poolModule.default ?? poolModule

describe('db config', () => {
  afterAll(() => {
    vi.restoreAllMocks()
  })

  describe('Inicialización', () => {
    it('01 - Ejecuta dotenv.config al cargar el módulo', () => {
      // dotenv cargó porque las variables de entorno están disponibles
      expect(process.env.DB_USER).toBeDefined()
    })

    it('02 - Crea Pool con las variables de entorno', () => {
      // El pool tiene las opciones del .env
      expect(pool.options.user).toBe(process.env.DB_USER)
      expect(pool.options.host).toBe(process.env.DB_HOST)
      expect(pool.options.database).toBe(process.env.DB_NAME)
      expect(pool.options.password).toBe(process.env.DB_PASSWORD)
      expect(pool.options.port).toBe(process.env.DB_PORT)
    })

    it('03 - Exporta la instancia del pool', () => {
      // Es una instancia válida de Pool con métodos esperados
      expect(typeof pool.query).toBe('function')
      expect(typeof pool.connect).toBe('function')
      expect(typeof pool.on).toBe('function')
    })
  })

  describe('Eventos del pool', () => {
    it('04 - Registra listener para connect', () => {
      const listeners = pool.listeners('connect')
      expect(listeners.length).toBeGreaterThan(0)
    })

    it('05 - Registra listener para error', () => {
      const listeners = pool.listeners('error')
      expect(listeners.length).toBeGreaterThan(0)
    })

    it('06 - El listener connect hace console.info', () => {
      vi.spyOn(console, 'info').mockImplementation(() => {})
      const connectListener = pool.listeners('connect')[0]
      connectListener()
      expect(console.info).toHaveBeenCalledWith('[INFO] Database connected successfully')
      vi.restoreAllMocks()
    })

    it('07 - El listener error hace console.error', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.spyOn(process, 'exit').mockImplementation(() => undefined)
      const errorListener = pool.listeners('error')[0]
      const fakeError = new Error('conexión perdida')
      errorListener(fakeError)
      expect(console.error).toHaveBeenCalledWith(
        '[ERROR] Unexpected database error on idle client:',
        fakeError
      )
      vi.restoreAllMocks()
    })

    it('08 - El listener error llama process.exit(-1)', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.spyOn(process, 'exit').mockImplementation(() => undefined)
      const errorListener = pool.listeners('error')[0]
      errorListener(new Error('fatal'))
      expect(process.exit).toHaveBeenCalledWith(-1)
      vi.restoreAllMocks()
    })
  })

  describe('Consistencia', () => {
    it('09 - Registra exactamente dos listeners', () => {
      const connectCount = pool.listeners('connect').length
      const errorCount = pool.listeners('error').length
      expect(connectCount + errorCount).toBe(2)
    })
  })
})