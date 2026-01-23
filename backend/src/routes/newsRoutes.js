const express = require('express');
const router = express.Router();
const { getNews, createNews } = require('../controllers/newsController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

//Definir los endpoints
router.get('/', getNews);      //GET http://localhost:3000/api/news
router.post('/', verifyToken, verifyAdmin, createNews);  //POST http://localhost:3000/api/news

module.exports = router;