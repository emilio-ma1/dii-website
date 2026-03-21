/**
 * @file projectRoutes.js
 * @description
 * Define los endpoints de la API para la gestión de proyectos de investigación.
 */
const express = require('express');
const router = express.Router();

// Importamos el controlador
const { 
  createProject, 
  getAllProjects, 
  getProjectById 
} = require('../controllers/projectController');

// Importamos los middlewares de seguridad
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

/**
 * Endpoint público para obtener el catálogo de proyectos.
 * Método: GET /api/projects
 */
router.get('/', getAllProjects);

/**
 * Endpoint público para obtener el detalle de un proyecto específico.
 * Método: GET /api/projects/:id
 */
router.get('/:id', getProjectById);

/**
 * Endpoint privado para crear un nuevo proyecto.
 * Protegido por autenticación y autorización de administrador.
 * Método: POST /api/projects
 */
router.post('/', verifyToken, verifyAdmin, createProject);

module.exports = router;