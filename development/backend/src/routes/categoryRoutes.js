/**
 * @file Rutas de Categorías (categoryRoutes).
 * @description
 * Define los endpoints de la API para consultar las categorías de los proyectos.
 */
const express = require('express');
const router = express.Router();

const { getAllCategories } = require('../controllers/categoryController');

/**
 * Endpoint público para listar las categorías disponibles.
 * Método: GET /
 */
router.get('/', getAllCategories);

module.exports = router;