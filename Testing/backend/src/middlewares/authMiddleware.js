/**
 * @file authMiddleware.js
 * @description
 * Authentication and Authorization middleware.
 * Intercepts HTTP requests to verify JWT token validity and
 * check user roles (e.g., admin permissions) before allowing
 * access to protected controllers.
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Fail Fast if the secret is missing at module load time
if (!JWT_SECRET) {
  console.error('[FATAL] JWT_SECRET is not defined in environment variables.');
  process.exit(1);
}

/**
 * Verifies if the request contains a valid JWT token in the headers.
 *
 * @param {object} req - Express HTTP request object.
 * @param {object} res - Express HTTP response object.
 * @param {function} next - Express callback to pass control to the next middleware.
 * @returns {object|void} Returns a 401 error if it fails, or calls next() if successful.
 */
const verifyToken = (req, res, next) => {
  // Retrieve the authorization header
  const authHeader = req.headers['authorization'];

  // Early return if no token is provided (401 Unauthorized)
  if (!authHeader) {
    return res.status(401).json({ message: 'Acceso denegado: No se proporcionó un token de autenticación.' });
  }

  try {
    // Clean the token by removing the "Bearer " prefix if it exists
    const cleanToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    // Decode and verify the token's cryptographic signature
    const decoded = jwt.verify(cleanToken, JWT_SECRET);
    
    // Inject user data into the request object for downstream controllers to use
    req.user = decoded;
    
    // Pass control to the next middleware or route handler
    next(); 
  } catch (error) {
    // Technical traces for debugging
    console.error('[ERROR] JWT Verification failed:', error);
    return res.status(401).json({ message: 'Acceso denegado: El token es inválido o ha expirado.' });
  }
};

/**
 * Verifies if the authenticated user has the administrator role.
 * WARNING: This middleware MUST always be executed after verifyToken.
 *
 * @param {object} req - Express HTTP request object (must contain injected req.user).
 * @param {object} res - Express HTTP response object.
 * @param {function} next - Express callback to proceed to the controller.
 * @returns {object|void} Returns a 403 error if not admin, or calls next() if authorized.
 */
const verifyAdmin = (req, res, next) => {
  // Verify that the user exists in the request and has the proper role
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    // Log the unauthorized access attempt for auditing purposes
    console.warn(`[WARN] Unauthorized access attempt to admin route by User ID: ${req.user ? req.user.id : 'Unknown'}`);
    
    // 403 Forbidden: Identity is known, but lacks sufficient permissions
    return res.status(403).json({ message: 'Acceso prohibido: Se requieren permisos de Administrador.' });
  }
};

module.exports = { verifyToken, verifyAdmin };