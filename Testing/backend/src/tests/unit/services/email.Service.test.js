/**
 * @file emailService.test.js
 * @description Unit tests for emailService (nodemailer wrapper).
 *
 * Mocking strategy:
 *  nodemailer.createTransport() is called at module load time, so by the time
 *  we import emailService the transporter object already exists.
 *  We cannot use vi.mock('nodemailer') in this stack (Node v25 + CJS + Vitest ESM).
 *
 *  Solution: import nodemailer first, intercept sendMail on the prototype of
 *  the object returned by createTransport, THEN import the service.
 *  Because both the test and the service share the same require() singleton,
 *  the prototype mock is visible to the already-created transporter instance.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── 1. Import nodemailer and create a transporter to locate its prototype ───
const nodemailer = (await import('nodemailer')).default ?? (await import('nodemailer'));

// createTransport returns a Mail instance — grab its prototype
const _sampleTransporter = nodemailer.createTransport({});
const transporterProto = Object.getPrototypeOf(_sampleTransporter);

// Mock sendMail on the prototype so ALL transporter instances see the mock,
// including the one created inside emailService.js at require() time.
transporterProto.sendMail = vi.fn();

// ─── 2. Import service AFTER prototype is patched ────────────────────────────
const serviceModule = await import('../../../services/emailService');
const { send2FACode, sendPasswordResetEmail } =
  serviceModule.default ?? serviceModule;

// ─── 3. Reset between tests ───────────────────────────────────────────────────
beforeEach(() => {
  transporterProto.sendMail.mockReset();
});

// =============================================================================
describe('emailService', () => {

  // ═══════════════════════════════════════════════════════════════════════════
  describe('send2FACode', () => {

    it('returns true when sendMail resolves successfully', async () => {
      transporterProto.sendMail.mockResolvedValue({ messageId: 'test-id-123' });

      const result = await send2FACode('user@example.com', '482910');

      expect(result).toBe(true);
    });

    it('calls sendMail exactly once', async () => {
      transporterProto.sendMail.mockResolvedValue({ messageId: 'x' });

      await send2FACode('user@example.com', '123456');

      expect(transporterProto.sendMail).toHaveBeenCalledOnce();
    });

    it('sends to the correct recipient email', async () => {
      transporterProto.sendMail.mockResolvedValue({ messageId: 'x' });

      await send2FACode('target@mail.com', '000000');

      const mailOptions = transporterProto.sendMail.mock.calls[0][0];
      expect(mailOptions.to).toBe('target@mail.com');
    });

    it('includes the verification code in the HTML body', async () => {
      transporterProto.sendMail.mockResolvedValue({ messageId: 'x' });

      await send2FACode('user@example.com', '857423');

      const mailOptions = transporterProto.sendMail.mock.calls[0][0];
      expect(mailOptions.html).toContain('857423');
    });

    it('sets the correct subject line', async () => {
      transporterProto.sendMail.mockResolvedValue({ messageId: 'x' });

      await send2FACode('user@example.com', '111111');

      const mailOptions = transporterProto.sendMail.mock.calls[0][0];
      expect(mailOptions.subject).toContain('2FA');
    });

    it('sets from address using SMTP_USER env variable', async () => {
      transporterProto.sendMail.mockResolvedValue({ messageId: 'x' });
      process.env.SMTP_USER = 'noreply@dii.cl';

      await send2FACode('user@example.com', '123456');

      const mailOptions = transporterProto.sendMail.mock.calls[0][0];
      expect(mailOptions.from).toContain('noreply@dii.cl');
    });

    it('throws a wrapped Error when sendMail rejects', async () => {
      transporterProto.sendMail.mockRejectedValue(new Error('SMTP timeout'));

      await expect(send2FACode('user@example.com', '123456'))
        .rejects.toThrow('No se pudo enviar el correo de verificación.');
    });

    it('thrown error is an instance of Error', async () => {
      transporterProto.sendMail.mockRejectedValue(new Error('connection refused'));

      await expect(send2FACode('u@u.com', '000000'))
        .rejects.toBeInstanceOf(Error);
    });

    it('wraps the error regardless of the original SMTP failure reason', async () => {
      transporterProto.sendMail.mockRejectedValue(new Error('auth failed'));

      // The thrown message is always the generic user-facing message
      await expect(send2FACode('u@u.com', '000000'))
        .rejects.toThrow('No se pudo enviar el correo de verificación.');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  describe('sendPasswordResetEmail', () => {

    it('returns true when sendMail resolves successfully', async () => {
      transporterProto.sendMail.mockResolvedValue({});

      const result = await sendPasswordResetEmail('user@example.com', 'tok_abc123');

      expect(result).toBe(true);
    });

    it('calls sendMail exactly once', async () => {
      transporterProto.sendMail.mockResolvedValue({});

      await sendPasswordResetEmail('user@example.com', 'tok_abc123');

      expect(transporterProto.sendMail).toHaveBeenCalledOnce();
    });

    it('sends to the correct recipient email', async () => {
      transporterProto.sendMail.mockResolvedValue({});

      await sendPasswordResetEmail('reset@mail.com', 'tok_xyz');

      const mailOptions = transporterProto.sendMail.mock.calls[0][0];
      expect(mailOptions.to).toBe('reset@mail.com');
    });

    it('includes the reset token in the HTML body link', async () => {
      transporterProto.sendMail.mockResolvedValue({});

      await sendPasswordResetEmail('user@example.com', 'unique-token-999');

      const mailOptions = transporterProto.sendMail.mock.calls[0][0];
      expect(mailOptions.html).toContain('unique-token-999');
    });

    it('constructs the reset link using FRONTEND_URL env variable', async () => {
      transporterProto.sendMail.mockResolvedValue({});
      process.env.FRONTEND_URL = 'https://dii.example.com';

      await sendPasswordResetEmail('user@example.com', 'tok123');

      const mailOptions = transporterProto.sendMail.mock.calls[0][0];
      expect(mailOptions.html).toContain('https://dii.example.com/reset-password/tok123');
    });

    it('sets the correct subject line', async () => {
      transporterProto.sendMail.mockResolvedValue({});

      await sendPasswordResetEmail('user@example.com', 'tok');

      const mailOptions = transporterProto.sendMail.mock.calls[0][0];
      expect(mailOptions.subject).toContain('Contraseña');
    });

    it('sets from address using SMTP_USER env variable', async () => {
      transporterProto.sendMail.mockResolvedValue({});
      process.env.SMTP_USER = 'noreply@dii.cl';

      await sendPasswordResetEmail('user@example.com', 'tok');

      const mailOptions = transporterProto.sendMail.mock.calls[0][0];
      expect(mailOptions.from).toContain('noreply@dii.cl');
    });

    it('throws a wrapped Error when sendMail rejects', async () => {
      transporterProto.sendMail.mockRejectedValue(new Error('network error'));

      await expect(sendPasswordResetEmail('user@example.com', 'tok'))
        .rejects.toThrow('Error al enviar el correo de recuperación.');
    });

    it('thrown error is an instance of Error', async () => {
      transporterProto.sendMail.mockRejectedValue(new Error('refused'));

      await expect(sendPasswordResetEmail('u@u.com', 'tok'))
        .rejects.toBeInstanceOf(Error);
    });

    it('wraps the error with a generic user-facing message', async () => {
      transporterProto.sendMail.mockRejectedValue(new Error('TLS error'));

      await expect(sendPasswordResetEmail('u@u.com', 'tok'))
        .rejects.toThrow('Error al enviar el correo de recuperación.');
    });
  });

});