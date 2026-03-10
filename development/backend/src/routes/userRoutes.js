/**
 * @file Rutas de Usuarios (userRoutes).
 * @description
 * Define los endpoints de la API para la gestión interna de usuarios.
 * Permite listar perfiles, filtrar por roles y eliminar cuentas.
 * Todas las rutas están estrictamente protegidas para uso exclusivo del administrador.
 */
const express = require('express');
const router = express.Router();

// Importación de controladores y middlewares de seguridad
const { getAllUsers, getUsersByRole, deleteUser } = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

/**
 * Endpoint privado para obtener la lista completa de usuarios.
 * Método: GET /api/users
 */
router.get('/', verifyToken, verifyAdmin, getAllUsers);

/**
 * Endpoint privado para obtener usuarios filtrados por su rol (ej. 'profesor').
 * Método: GET /api/users/role/:roleName
 */
router.get('/role/:roleName', verifyToken, verifyAdmin, getUsersByRole);

/**
 * Endpoint privado para eliminar un usuario del sistema.
 * Método: DELETE /api/users/:id
 */
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);

module.exports = router;