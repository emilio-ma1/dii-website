/**
 * @file Rutas de Autenticación (authRoutes).
 * @description
 * Define los endpoints de la API para el inicio de sesión y el registro de usuarios.
 * Aplica los middlewares de seguridad correspondientes para proteger el acceso
 * a la creación de nuevas cuentas.
 */
const express = require('express');
const router = express.Router();

// Controladores y Middlewares
const { login, register } = require('../controllers/authController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

/**
 * Endpoint público para iniciar sesión.
 * Método: POST /login
 */
router.post('/login', login);

/**
 * Endpoint privado para registrar un nuevo usuario (egresado o admin).
 * Método: POST /register
 * Seguridad: Requiere un token JWT válido y permisos de administrador.
 */
router.post('/register', verifyToken, verifyAdmin, register);

module.exports = router;