/**
 * @file Rutas de Proyectos (projectRoutes).
 * @description
 * Define los endpoints de la API para la gestión de proyectos de investigación
 * y vinculación del departamento. Aplica middlewares de seguridad para
 * restringir la creación de contenido exclusivamente a usuarios autorizados.
 */
const express = require('express');
const router = express.Router();

// Importación de controladores y middlewares
const { createProject } = require('../controllers/projectController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

/**
 * Endpoint privado para crear un nuevo proyecto en el catálogo.
 * Método: POST /
 * Seguridad: Requiere un token JWT válido y rol de administrador.
 */
router.post('/', verifyToken, verifyAdmin, createProject);

module.exports = router;