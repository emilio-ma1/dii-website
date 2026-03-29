/**
 * @file authRoutes.js
 * @description
 * Defines API endpoints for user authentication and registration.
 * Applies security middlewares to protect the creation of new accounts,
 * ensuring only authorized personnel can provision access.
 */
const express = require('express');
const router = express.Router();

const { login, register, verify2FA, forgotPassword, resetPassword } = require('../controllers/authController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

/**
 * @route POST /api/auth/login
 * @description Public endpoint to authenticate a user and issue a JWT session token.
 * @access Public
 */
router.post('/login', login);

/**
 * @route POST /api/auth/verify-2fa
 * @description Public endpoint to verify the 6-digit email code.
 * @access Public
 */
router.post('/verify-2fa', verify2FA);

/**
 * @route POST /api/auth/forgot-password
 * @description Public endpoint to request a password reset email.
 * @access Public
 */
router.post('/forgot-password', forgotPassword);

/**
 * @route POST /api/auth/reset-password/:token
 * @description Public endpoint to set a new password using a secure single-use token.
 * @access Public
 */
router.post('/reset-password/:token', resetPassword);

/**
 * @route POST /api/auth/register
 * @description Private endpoint to register a new user (admin, teacher, or alumni).
 * @access Private (Requires valid JWT and Admin privileges)
 */
// Strict security enforced for account creation
router.post('/register', verifyToken, verifyAdmin, register);

module.exports = router;