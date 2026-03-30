// src/tests/components/app.test.js
import request from 'supertest'
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest'

process.env.FRONTEND_URL = 'http://localhost:5173'

const appModule = await import('../../app')
const app = appModule.default ?? appModule

// ─── Inyectar /__test_error__ ANTES del 404/500 handler ──────────────────────
// app.use() registra AL FINAL del stack — después del 404 ya registrado en app.js.
// Solución: mutar app._router.stack directamente después de forzar su init
// mediante app.handle() interno, que Express expone como lazyrouter.
// Como _router es lazy, lo forzamos llamando app.get() primero (eso sí inicializa
// _router), luego hacemos el splice.
app.get('/__test_error__', (req, res, next) => {
  next(new Error('forced error for test'))
})
// En este punto _router YA existe porque app.get() lo inicializa síncronamente.
// Movemos la layer recién agregada (última) a antes de los últimos 2 (404 + 500).
{
  const stack = app._router.stack
  const testLayer = stack.pop()
  stack.splice(stack.length - 2, 0, testLayer)
}

// =============================================================================
describe('app', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('GET /', () => {

    it('01 - Retorna 200 en el health check', async () => {
      const res = await request(app).get('/')
      expect(res.status).toBe(200)
    })

    it('02 - Retorna el mensaje de estado esperado', async () => {
      const res = await request(app).get('/')
      expect(res.body).toHaveProperty('message')
      expect(typeof res.body.message).toBe('string')
      expect(res.body.message.length).toBeGreaterThan(0)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('Route mounting', () => {

    it('03 - Monta /api/auth correctamente', async () => {
      // authRoutes solo tiene POST — GET devuelve 404 desde el router interno,
      // no porque el router no esté montado. Usamos POST /api/auth/login.
      const res = await request(app).post('/api/auth/login').send({})
      expect(res.status).not.toBe(404)
    })

    it('04 - Monta /api/news correctamente', async () => {
      const res = await request(app).get('/api/news')
      expect(res.status).not.toBe(404)
    })

    it('05 - Monta /api/projects correctamente', async () => {
      const res = await request(app).get('/api/projects')
      expect(res.status).not.toBe(404)
    })

    it('06 - Monta /api/users correctamente', async () => {
      const res = await request(app).get('/api/users')
      expect(res.status).not.toBe(404)
    })

    it('07 - Monta /api/categories correctamente', async () => {
      const res = await request(app).get('/api/categories')
      expect(res.status).not.toBe(404)
    })

    it('08 - Monta /api/professors correctamente', async () => {
      const res = await request(app).get('/api/professors')
      expect(res.status).not.toBe(404)
    })

    it('09 - Monta /api/alumni correctamente', async () => {
      const res = await request(app).get('/api/alumni')
      expect(res.status).not.toBe(404)
    })

    it('10 - Monta /api/audit-logs correctamente', async () => {
      const res = await request(app).get('/api/audit-logs')
      expect(res.status).not.toBe(404)
    })

    it('11 - Monta /api/equipment correctamente', async () => {
      const res = await request(app).get('/api/equipment')
      expect(res.status).not.toBe(404)
    })

    it('12 - Monta /api/contacts correctamente', async () => {
      const res = await request(app).get('/api/contacts')
      expect(res.status).not.toBe(404)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('Global middlewares', () => {

    it('13 - Aplica headers de Helmet', async () => {
      const res = await request(app).get('/')
      expect(res.headers['x-content-type-options']).toBe('nosniff')
    })

    it('14 - Aplica configuración CORS con credentials true', async () => {
      const res = await request(app)
        .get('/')
        .set('Origin', 'http://localhost:5173')
      expect(res.headers['access-control-allow-credentials']).toBe('true')
    })

    it('15 - Permite el origin configurado en FRONTEND_URL', async () => {
      const res = await request(app)
        .get('/')
        .set('Origin', 'http://localhost:5173')
      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173')
    })

    it('16 - Parsea JSON correctamente con express.json', async () => {
      const res = await request(app)
        .post('/api/nonexistent')
        .send({ key: 'value' })
        .set('Content-Type', 'application/json')
      expect(res.status).not.toBe(400)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  describe('Fallback handlers', () => {

    it('17 - Retorna 404 para una ruta inexistente', async () => {
      const res = await request(app).get('/api/ruta-que-no-existe')
      expect(res.status).toBe(404)
    })

    it('18 - Retorna el mensaje esperado en el 404 fallback', async () => {
      const res = await request(app).get('/api/ruta-que-no-existe')
      expect(res.body).toHaveProperty('message')
      expect(typeof res.body.message).toBe('string')
      expect(res.body.message.length).toBeGreaterThan(0)
    })

    it('19 - Retorna 500 cuando una ruta llama next(error)', async () => {
      const res = await request(app).get('/__test_error__')
      expect(res.status).toBe(500)
    })

    it('20 - Retorna el mensaje esperado en el error handler global', async () => {
      const res = await request(app).get('/__test_error__')
      expect(res.body).toHaveProperty('message')
      expect(typeof res.body.message).toBe('string')
      expect(res.body.message.length).toBeGreaterThan(0)
    })

    it('21 - Hace console.error en errores no controlados', async () => {
      await request(app).get('/__test_error__')
      expect(console.error).toHaveBeenCalled()
    })
  })
})