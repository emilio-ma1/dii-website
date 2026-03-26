/**
 * @file authController.js
 * @description
 * Handles user authentication and registration logic.
 * Responsible for validating credentials, interacting with the database,
 * and generating JWT session tokens.
 */
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuditLogModel = require('../models/auditLogModel'); // Added Audit Trail

const JWT_SECRET = process.env.JWT_SECRET;

// Guard against missing JWT_SECRET at startup
if (!JWT_SECRET) {
  console.error('[FATAL] JWT_SECRET is not defined in environment variables.');
  process.exit(1); // Fails fast to prevent insecure token generation
}

/**
 * Authenticates a user by validating credentials and generates a JWT token.
 *
 * @param {object} req - Express HTTP request object (requires email and password).
 * @param {object} res - Express HTTP response object.
 * @returns {Promise<object>} JSON response with token and user data, or 400/401/500 error.
 */
const login = async (req, res) => {
  const { email, password } = req.body;
 
  // Early return: Input validation
  if (!email || !password) {
    return res.status(400).json({ message: 'El correo y la contraseña son requeridos para ingresar.' });
  }

  try {
    const queryResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    // Early return: User not found
    if (queryResult.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas. Verifica tu correo y contraseña.' });
    }

    const user = queryResult.rows[0];

    // Cryptographic password validation
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas. Verifica tu correo y contraseña.' });
    }

    // Session token generation (Expires in 1 hour for security)
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Explicit 200 HTTP status
    return res.status(200).json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    // Technical traces
    console.error('[ERROR] Authentication process failed:', error);
    return res.status(500).json({ message: 'Error interno del servidor al procesar el inicio de sesión.' });
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

module.exports = { login, register };