/**
 * @file authRoutes.js
 * @description
 * Defines API endpoints for user authentication and registration.
 * Applies security middlewares to protect the creation of new accounts,
 * ensuring only authorized personnel can provision access.
 */
const express = require('express');
const router = express.Router();

// Controllers and Middlewares
const { login, register } = require('../controllers/authController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

/**
 * @route POST /api/auth/login
 * @description Public endpoint to authenticate a user and issue a JWT session token.
 * @access Public
 */
router.post('/login', login);

/**
 * @route POST /api/auth/register
 * @description Private endpoint to register a new user (admin, teacher, or alumni).
 * @access Private (Requires valid JWT and Admin privileges)
 */
// Strict security enforced for account creation
router.post('/register', verifyToken, verifyAdmin, register);

module.exports = router;