/**
 * @file newsRoutes.js
 * @description
 * Defines API endpoints for news and community engagement management.
 * Maps endpoints to their respective controller functions and applies security middlewares.
 */
const express = require('express');
const router = express.Router();

// Import controller functions
const { 
  getNews, 
  createNews, 
  updateNews, 
  deleteNews,
  getNewsBySlug
} = require('../controllers/newsController');

// Import security middlewares
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

/**
 * @route GET /api/news
 * @description Retrieves a list of all news and events.
 * @access Public
 */
router.get('/', getNews);

/**
 * @route GET /api/news/slug/:slug
 * @description Retrieves a specific news item by its unique URL-friendly slug.
 * @access Public
 */
router.get('/slug/:slug', getNewsBySlug);

/**
 * @route POST /api/news
 * @description Creates a new news item or event.
 * @access Private (Requires Admin privileges)
 */
router.post('/', verifyToken, verifyAdmin, createNews);

/**
 * @route PUT /api/news/:id
 * @description Updates an existing news item by its ID.
 * @access Private (Requires Admin privileges)
 */
router.put('/:id', verifyToken, verifyAdmin, updateNews);

/**
 * @route DELETE /api/news/:id
 * @description Deletes a news item from the database.
 * @access Private (Requires Admin privileges)
 */
router.delete('/:id', verifyToken, verifyAdmin, deleteNews);

module.exports = router;