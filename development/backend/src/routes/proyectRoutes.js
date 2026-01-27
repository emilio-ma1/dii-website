const express = require('express');
const router = express.Router();
const { createProject } = require('../controllers/projectController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// Solo el admin puede crear proyectos
router.post('/', verifyToken, verifyAdmin, createProject);

module.exports = router;