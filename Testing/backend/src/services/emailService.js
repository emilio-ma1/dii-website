/**
 * @file emailService.js
 * @description
 * Handles outgoing email communications for the system.
 * * Responsibilities:
 * - Connects to the SMTP server using environment variables.
 * - Formats and sends 2FA verification codes.
 */
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true para puerto 465, false para otros puertos
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends a 6-digit 2FA verification code to the user's email.
 *
 * @param {string} toEmail - The recipient's email address.
 * @param {string} code - The 6-digit verification code.
 * @returns {Promise<boolean>} True if the email was sent successfully.
 * @throws {Error} If the email delivery fails.
 */
const send2FACode = async (toEmail, code) => {
  try {
    const mailOptions = {
      from: `"Departamento de Ingeniería Industrial" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Tu código de verificación de acceso (2FA)',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #722b4d; text-align: center;">Verificación de Acceso</h2>
          <p style="font-size: 16px; color: #333;">Hola,</p>
          <p style="font-size: 16px; color: #333;">Has intentado iniciar sesión en el sistema web del DII. Para continuar, por favor ingresa el siguiente código de verificación:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #722b4d; background-color: #f4f4f4; padding: 15px 25px; border-radius: 8px;">
              ${code}
            </span>
          </div>
          <p style="font-size: 14px; color: #666; text-align: center;">Este código expirará en 10 minutos.</p>
          <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">Si no solicitaste este código, por favor ignora este correo y cambia tu contraseña.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[INFO] 2FA Email sent successfully to ${toEmail}. Message ID: ${info.messageId}`);
    return true;

  } catch (error) {
    console.error(`[ERROR] Failed to send 2FA email to ${toEmail}:`, error);
    throw new Error('No se pudo enviar el correo de verificación.');
  }
};

module.exports = {
  send2FACode,
};