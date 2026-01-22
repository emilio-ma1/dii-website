const express = require('express');
const router = express.Router();
const { getNews, createNews } = require('../controllers/newsController');

// Definir los endpoints
router.get('/', getNews);      // GET http://localhost:3000/api/news
router.post('/', createNews);  // POST http://localhost:3000/api/news

module.exports = router;