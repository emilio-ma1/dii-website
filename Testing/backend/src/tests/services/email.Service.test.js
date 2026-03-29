// src/tests/services/emailService.test.js
import { describe, it, vi, beforeEach, afterEach } from 'vitest'

const { createTransportMock, sendMailMock } = vi.hoisted(() => ({
  createTransportMock: vi.fn(),
  sendMailMock: vi.fn(),
}))

vi.mock('nodemailer', () => ({
  createTransport: createTransportMock,
}))

describe('emailService', () => {
  let emailService

  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()

    process.env.SMTP_HOST = 'smtp.test.com'
    process.env.SMTP_PORT = '587'
    process.env.SMTP_USER = 'test@test.com'
    process.env.SMTP_PASS = 'secret123'

    createTransportMock.mockReturnValue({
      sendMail: sendMailMock,
    })

    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})

    emailService = require('../../services/emailService')
  })

  afterEach(() => {
    vi.restoreAllMocks()

    delete process.env.SMTP_HOST
    delete process.env.SMTP_PORT
    delete process.env.SMTP_USER
    delete process.env.SMTP_PASS
  })

  describe('transporter configuration', () => {
    it.todo('01 - Llama nodemailer.createTransport una vez al cargar el módulo')
    it.todo('02 - Configura host con process.env.SMTP_HOST')
    it.todo('03 - Configura port con process.env.SMTP_PORT')
    it.todo('04 - Configura secure en false')
    it.todo('05 - Configura auth.user con process.env.SMTP_USER')
    it.todo('06 - Configura auth.pass con process.env.SMTP_PASS')
  })

  describe('send2FACode', () => {
    it.todo('07 - Llama transporter.sendMail una vez')
    it.todo('08 - Envía mailOptions.from con el correo configurado en SMTP_USER')
    it.todo('09 - Envía mailOptions.to con toEmail')
    it.todo('10 - Envía el subject esperado')
    it.todo('11 - Incluye el código 2FA dentro del html')
    it.todo('12 - Incluye el texto de expiración en 10 minutos dentro del html')
    it.todo('13 - Retorna true cuando sendMail es exitoso')
    it.todo('14 - Hace console.log con el messageId cuando el envío es exitoso')
    it.todo('15 - Hace console.error cuando sendMail falla')
    it.todo('16 - Lanza Error con el mensaje "No se pudo enviar el correo de verificación." cuando sendMail falla')
  })
})