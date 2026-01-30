const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../middlewares/authMiddleware');

const login = async (req, res) => {
  const { email, password } = req.body;
 
  if(!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = result.rows[0];
console.log('1. Contraseña recibida del login:', password);
    console.log('2. Hash sacado de la BD:', user.password_hash);

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
        token,
        user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  }catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const register = async (req, res) => {
  const { full_name, email, password, role } = req.body;

  try {

    const userExist = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userExist.rows.length > 0) {
      return res.status(409).json({ error: "Este correo electrónico ya está registrado." });
    }

    const roleToSave = role || 'egresado';
    // Encriptar la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Insertar en base de datos
    const query = `
      INSERT INTO users (full_name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, email, role`;
      
    const result = await pool.query(query, [full_name, email, hash, roleToSave]);
    
    res.status(201).json({ 
        message: 'Usuario creado exitosamente', 
        user: result.rows[0] 
    });

  } catch (error) {
    console.error(error);
    if (error.code === '23505') { // Error de Postgres por violación de unicidad
        return res.status(400).json({ error: 'El email ya está registrado' });
    }
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};
module.exports = { login, register };