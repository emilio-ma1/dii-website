/**
 * @file Rutas de Proyectos (projectRoutes).
 * @description
 * Define los endpoints de la API para la gestión de proyectos de investigación
 * y vinculación del departamento. Permite acceso público para lectura y 
 * restringe la creación exclusivamente a administradores.
 */
const express = require('express');
const router = express.Router();

// Importación de controladores y middlewares
const { createProject, getAllProjects, getProjectById } = require('../controllers/projectController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

/**
 * Endpoint público para obtener el listado general de proyectos.
 * Método: GET /api/projects
 */
router.get('/', getAllProjects);

/**
 * Endpoint público para obtener el detalle de un proyecto y sus autores.
 * Método: GET /api/projects/:id
 */
router.get('/:id', getProjectById);

/**
 * Endpoint privado para crear un nuevo proyecto en el catálogo.
 * Método: POST /api/projects
 * Seguridad: Requiere un token JWT válido y rol de administrador.
 */
router.post('/', verifyToken, verifyAdmin, createProject);

module.exports = router;