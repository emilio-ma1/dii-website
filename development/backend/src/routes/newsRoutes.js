/**
 * @file newsRoutes.js
 * @description
 * Defines API endpoints for news and community engagement management.
 */
const express = require('express');
const router = express.Router();

// Importamos todas las funciones del controlador
const { 
  getNews, 
  createNews, 
  updateNews, 
  deleteNews,
  getNewsBySlug
} = require('../controllers/newsController');

// Importamos los middlewares de seguridad
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

/**
 * Public endpoint to fetch all news.
 * Method: GET /api/news
 */
router.get('/', getNews);

/**
 * Private endpoint to create a new news item.
 * Requires authentication and admin privileges.
 * Method: POST /api/news
 */
router.post('/', verifyToken, verifyAdmin, createNews);

/**
 * Private endpoint to update an existing news item.
 * Requires authentication and admin privileges.
 * Method: PUT /api/news/:id
 */
router.put('/:id', verifyToken, verifyAdmin, updateNews);

/**
 * Private endpoint to delete a news item.
 * Requires authentication and admin privileges.
 * Method: DELETE /api/news/:id
 */
router.delete('/:id', verifyToken, verifyAdmin, deleteNews);

router.get('/slug/:slug', getNewsBySlug);

module.exports = router;