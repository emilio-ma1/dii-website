const express = require('express');
const router = express.Router();
const { getNews, createNews } = require('../controllers/newsController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// GET /api/news -> Público
router.get('/', getNews);

// POST /api/news
// Privado es decir solo el admin puede crear noticias
router.post('/', verifyToken, verifyAdmin, createNews);

module.exports = router;