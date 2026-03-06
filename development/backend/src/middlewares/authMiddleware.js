const jwt = require('jsonwebtoken');

//Clave secreta para firmar tokens
const JWT_SECRET = process.env.JWT_SECRET;

//Verificar si el usuario tiene un Token valido

const verifyToken = (req, res, next) => {

  const token = req.headers['authorization']; //Esperamos el "Bearer <token>"

  if (!token) {
    return res.status(403).json({ error: 'Acceso denegado: No se proporciono token' });
  }

  try {
    //Quitamos la palabra "Bearer" si viene incluida
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
    
    //Decodificamos el token
    const decoded = jwt.verify(cleanToken, JWT_SECRET);
    
    //Guardamos los datos del usuario en la request para usarlos luego
    req.user = decoded;
    next(); //Pase adelante
  } catch (error) {
    return res.status(401).json({ error: 'Token invalido o expirado' });
  }
};

//Verificar si el usuario es Administrador
const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); //si es admin se le da acceso
  } else {
    res.status(403).json({ error: 'Acceso prohibido: Se requieren permisos de Administrador' });
  }
};

module.exports = { verifyToken, verifyAdmin, JWT_SECRET };