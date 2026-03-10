/**
 * @file Rutas de Noticias (newsRoutes).
 * @description
 * Define los endpoints de la API para la gestión de noticias.
 * Separa claramente el acceso público de lectura del acceso
 * privado (administrador) para la creación de contenido.
 */
const express = require('express');
const router = express.Router();

// Importación de Controladores y Middlewares
const { getNews, createNews } = require('../controllers/newsController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

/**
 * Endpoint público para obtener el listado de noticias.
 * Método: GET /api/news
 */
router.get('/', getNews);

/**
 * Endpoint privado para crear una nueva publicación/noticia.
 * Método: POST /api/news
 * Seguridad: Requiere autenticación (JWT) y rol de administrador.
 */
router.post('/', verifyToken, verifyAdmin, createNews);

module.exports = router;