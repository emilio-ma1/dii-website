/**
 * @file authController.js
 * @description
 * Handles user authentication and registration logic.
 * * Responsibilities:
 * - Validates credentials and manages the 2-step email verification flow (2FA).
 * - Acts strictly as a Thin Controller, delegating DB operations to UserModel.
 * - Generates secure temporary and final JWT session tokens.
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const UserModel = require('../models/userModel');
const AuditLogModel = require('../models/auditLogModel'); 
const emailService = require('../services/emailService');
const pool = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_TEMP_SECRET = process.env.JWT_TEMP_SECRET;

const jwtSecret = process.env.JWT_SECRET

/**
 * Authenticates basic credentials and triggers the 2FA email.
 * * WHY: Separating the initial validation from the final token issuance 
 * ensures the system remains robust and async.
 *
 * @param {object} req - Express HTTP request.
 * @param {object} res - Express HTTP response.
 */
const login = async (req, res) => {
  const { email, password } = req.body;
 
  if (!email || !password) {
    return res.status(400).json({ message: 'El correo y la contraseña son requeridos para ingresar.' });
  }

  try {
    const user = await UserModel.getByEmail(email);
    
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas. Verifica tu correo y contraseña.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas. Verifica tu correo y contraseña.' });
    }

    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000); 

    await UserModel.setLoginCode(user.id, code, expiresAt);

    await emailService.send2FACode(user.email, code);

    const tempToken = jwt.sign(
      { id: user.id }, 
      JWT_TEMP_SECRET, 
      { expiresIn: process.env.JWT_TEMP_EXPIRES_IN || '10m' }
    );

    return res.status(206).json({ 
      requires2FA: true, 
      tempToken,
      message: 'Te hemos enviado un código de seguridad a tu correo.' 
    });

  } catch (error) {
    console.error('[ERROR] Authentication Phase 1 failed:', error);
    return res.status(500).json({ message: 'Error interno del servidor al procesar el inicio de sesión.' });
  }
};

/**
 *Verifies the 6-digit email code and issues the final access token.
 * * WHY: Validates the temporary token and ensures the code hasn't expired.
 */
const verify2FA = async (req, res) => {
  const { tempToken, code } = req.body;

  if (!tempToken || !code) {
      return res.status(400).json({ message: 'Faltan parámetros de verificación.' });
  }

  try {
    const decoded = jwt.verify(tempToken, JWT_TEMP_SECRET);
    const userId = decoded.id;

    const userCodeData = await UserModel.getLoginCode(userId);

    const now = new Date();
    if (!userCodeData || userCodeData.login_code !== code || now > new Date(userCodeData.login_code_expires_at)) {
      return res.status(401).json({ message: 'Código inválido o expirado.' }); // Semantic error
    }

    await UserModel.clearLoginCode(userId);

    const userFullData = await UserModel.getFullProfile(userId); 
    const finalToken = jwt.sign(
      { id: userFullData.id, email: userFullData.email, role: userFullData.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    await AuditLogModel.logAction(userId, 'LOGIN_2FA', 'users', userId, { ip: req.ip });

    return res.status(200).json({ 
      token: finalToken, 
      user: { id: userFullData.id, full_name: userFullData.full_name, role: userFullData.role } 
    });

  } catch (error) {
    console.error('[ERROR] Authentication Phase 2 (2FA) failed:', error);
    return res.status(401).json({ message: 'Sesión temporal inválida o expirada. Vuelve a iniciar sesión.' });
  }
};

/**
 * Registers a new user in the database with an encrypted password.
 *
 * @param {object} req - Express HTTP request object containing user data.
 * @param {object} res - Express HTTP response object.
 * @returns {Promise<object>} JSON response with created user data, or 400/409/500 error.
 */
const register = async (req, res) => {
  const { full_name, email, password, role } = req.body || {};

  // Input validation
  if (!full_name || !email || !password) {
    return res.status(400).json({ message: 'Nombre, correo y contraseña son obligatorios.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check for existing user
    const existingUser = await client.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: "Este correo ya está registrado." });
    }

    const assignedRole = role || 'teacher'; 
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert new user
    const insertUserQuery = `
      INSERT INTO users (full_name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, email, role;
    `;
    const userResult = await client.query(insertUserQuery, [full_name, email, passwordHash, assignedRole]);
    const newUser = userResult.rows[0];

    await client.query('COMMIT');

    // Inject Audit Log for traceability
    // If an admin created this user, log the admin's ID. If self-registered, log the new user's ID.
    const actorId = (req.user && req.user.id) ? req.user.id : newUser.id;
    await AuditLogModel.logAction(
      actorId,
      'CREATE',
      'users',
      newUser.id,
      { email: newUser.email, role: newUser.role }
    );

    return res.status(201).json({ message: 'Usuario y perfil creados exitosamente.', user: newUser });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[ERROR] Registration failed:', error);
    return res.status(500).json({ message: 'Error interno al registrar.' });
  } finally {
    client.release(); // Always release the database client
  }
};

module.exports = { login, register, verify2FA };