/**
 * @file Controlador de autenticación (authController).
 * @description
 * Maneja la lógica de inicio de sesión y registro de usuarios en el sistema.
 * Es responsable de validar credenciales, interactuar con la base de datos
 * y generar los tokens JWT para la sesión.
 */
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Autentica a un usuario validando sus credenciales y genera un token JWT.
 *
 * @param {object} req - Objeto de petición HTTP de Express (debe contener email y password).
 * @param {object} res - Objeto de respuesta HTTP de Express.
 * @returns {object} Respuesta JSON con el token y datos del usuario, o un error 400/401/500.
 */
const login = async (req, res) => {
  const { email, password } = req.body;
 
  // Retorno temprano: Validación de entrada
  if (!email || !password) {
    return res.status(400).json({ message: 'El correo y la contraseña son requeridos para ingresar.' });
  }

  try {
    const queryResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    // Retorno temprano: Usuario no encontrado
    if (queryResult.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas. Verifica tu correo y contraseña.' });
    }

    const user = queryResult.rows[0];

    // Validación criptográfica de la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas. Verifica tu correo y contraseña.' });
    }

    // Generación del token de sesión (Expira en 1 hora por seguridad)
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    // Trazas técnicas
    console.error('[ERROR] Authentication process failed:', error);
    return res.status(500).json({ message: 'Error interno del servidor al procesar el inicio de sesión.' });
  }
};

/**
 * Registra un nuevo usuario en la base de datos con contraseña encriptada.
 *
 * @param {object} req - Objeto de petición HTTP con los datos del usuario.
 * @param {object} res - Objeto de respuesta HTTP de Express.
 * @returns {object} Respuesta JSON con los datos del usuario creado, o un error 400/409/500.
 */
const register = async (req, res) => {
  const { full_name, email, password, role } = req.body;

  try {
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    // Retorno temprano prevención de duplicados
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Este correo electrónico ya se encuentra registrado." });
    }

    const assignedRole = role || 'egresado';
    
    // Encriptación de la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const insertQuery = `
      INSERT INTO users (full_name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, email, role;
    `;
      
    const queryResult = await pool.query(insertQuery, [full_name, email, passwordHash, assignedRole]);
    
    return res.status(201).json({ 
        message: 'Usuario creado exitosamente.', 
        user: queryResult.rows[0] 
    });

  } catch (error) {
    console.error('[ERROR] User registration failed:', error);
    
    // Manejo específico del código de error de Postgres (Violación de unicidad)
    if (error.code === '23505') { 
        return res.status(400).json({ message: 'El correo electrónico ingresado ya está registrado.' });
    }
    
    return res.status(500).json({ message: 'Error interno del servidor al registrar al usuario.' });
  }
};

module.exports = { login, register };