import { describe, it, expect } from 'vitest'
import request from 'supertest'

process.env.JWT_SECRET = 'test-secret'
process.env.FRONTEND_URL = 'http://frontend.test'

const app = require('../app')

describe('app', () => {
  describe('GET /', () => {
    it('01 - Retorna 200 con el mensaje base')
    it('02 - Responde en formato JSON')
    it('03 - Aplica CORS con el origin configurado')
  })

  describe('404 handler', () => {
    it('04 - Retorna 404 para endpoints inexistentes')
  })
})