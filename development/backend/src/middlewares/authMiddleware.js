/**
 * @file Middleware de Autenticación y Autorización (authMiddleware).
 * @description
 * Intercepta las peticiones HTTP para verificar la validez de los tokens JWT
 * y comprobar los roles de usuario (ej. permisos de administrador) antes de
 * permitir el acceso a los controladores protegidos.
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Verifica si la petición contiene un token JWT válido en las cabeceras (headers).
 *
 * @param {object} req - Objeto de petición HTTP de Express.
 * @param {object} res - Objeto de respuesta HTTP de Express.
 * @param {function} next - Función callback para pasar el control al siguiente middleware.
 * @returns {object|void} Retorna un error 401 si falla, o llama a next() si es exitoso.
 */
const verifyToken = (req, res, next) => {
  // Obtenemos el header de autorización
  const authHeader = req.headers['authorization'];

  // Retorno temprano si no hay token, se deniega el acceso (401 Unauthorized)
  if (!authHeader) {
    return res.status(401).json({ message: 'Acceso denegado: No se proporcionó un token de autenticación.' });
  }

  try {
    // Limpiamos el token quitando el prefijo "Bearer " si existe
    const cleanToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    // Decodificamos y verificamos la firma del token
    const decoded = jwt.verify(cleanToken, JWT_SECRET);
    
    // Inyectamos los datos del usuario en la request para que los controladores los usen
    req.user = decoded;
    
    // Pasamos el control al siguiente middleware o ruta
    next(); 
  } catch (error) {
    // Trazas técnicas
    console.error('[ERROR] JWT Verification failed:', error.message);
    return res.status(401).json({ message: 'Acceso denegado: El token es inválido o ha expirado.' });
  }
};

/**
 * Verifica si el usuario autenticado tiene el rol de administrador.
 * ADVERTENCIA: Este middleware DEBE ejecutarse siempre después de verifyToken.
 *
 * @param {object} req - Objeto de petición HTTP (debe contener req.user inyectado).
 * @param {object} res - Objeto de respuesta HTTP.
 * @param {function} next - Función callback para continuar con el controlador.
 * @returns {object|void} Retorna un error 403 si no es admin, o llama a next() si lo es.
 */
const verifyAdmin = (req, res, next) => {
  // Verificamos que el usuario exista en la request y tenga el rol adecuado
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    // Logueamos el intento de acceso no autorizado
    console.warn(`[WARN] Unauthorized access attempt to admin route by User ID: ${req.user ? req.user.id : 'Unknown'}`);
    
    // 403 Forbidden: Sabes quién es pero no tiene permisos
    return res.status(403).json({ message: 'Acceso prohibido: Se requieren permisos de Administrador.' });
  }
};

module.exports = { verifyToken, verifyAdmin };