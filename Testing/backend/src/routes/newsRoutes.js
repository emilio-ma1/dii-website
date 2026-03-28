/**
 * @file newsRoutes.js
 * @description
 * Defines API endpoints for news and community engagement management.
 * Maps endpoints to their respective controller functions and applies security middlewares.
 */
const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }
});

// Import controller functions
const { 
  getNews, 
  createNews, 
  updateNews, 
  deleteNews,
  getNewsBySlug,
  getNewsImage
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
 * @route GET /api/news/:id/image
 * @description Serves the binary image file of a news post.
 * @access Public
 */
router.get('/:id/image', getNewsImage);

/**
 * @route POST /api/news
 * @description Creates a new news item with an optional image upload.
 * @access Private (Requires Admin privileges)
 */
router.post('/', verifyToken, verifyAdmin, upload.single('image'), createNews);

/**
 * @route PUT /api/news/:id
 * @description Updates an existing news item by its ID.
 * @access Private (Requires Admin privileges)
 */
router.put('/:id', verifyToken, verifyAdmin, upload.single('image'), updateNews);

/**
 * @route DELETE /api/news/:id
 * @description Deletes a news item from the database.
 * @access Private (Requires Admin privileges)
 */
router.delete('/:id', verifyToken, verifyAdmin, deleteNews);

module.exports = router;