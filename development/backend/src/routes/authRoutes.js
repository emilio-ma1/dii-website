const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

router.post('/login', login);

// Ruta PRIVADA (Solo Admin puede crear otros usuarios)
router.post('/registro', verifyToken, verifyAdmin, register);

module.exports = router;