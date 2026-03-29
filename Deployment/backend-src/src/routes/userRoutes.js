/**
 * @file userRoutes.js
 * @description
 * Defines API endpoints for system user management.
 * * Responsibilities:
 * - Maps endpoints to controllers for profile retrieval and admin tasks.
 * - Enforces security via authentication and RBAC middlewares.
 * - Opens the binary image tunnel for dynamic avatar rendering.
 */
const express = require('express');
const router = express.Router();

// Import controllers and security middlewares
const { 
  getAllUsers, 
  getUsersByRole, 
  deleteUser, 
  updateUser, 
  getCurrentUserProfile, 
  getAuthorsList,
  getUserImage
} = require('../controllers/userController');

const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

/**
 * @route GET /api/users/me
 * @description Retrieves the merged profile of the currently authenticated user.
 * @access Private (Requires ANY valid token)
 */
router.get('/me', verifyToken, getCurrentUserProfile);

/**
 * @route GET /api/users/me/image
 * @description Serves the binary avatar image for the currently authenticated user.
 * @access Private (Requires token to resolve 'me' to user ID)
 */
router.get('/me/image', verifyToken, getUserImage);

/**
 * @route GET /api/users/authors
 * @description Retrieves a basic list of users (teachers and alumni) eligible to be project authors.
 * @access Private (Requires ANY valid token)
 */
router.get('/authors', verifyToken, getAuthorsList);

/**
 * @route GET /api/users
 * @description Retrieves the complete list of registered users.
 * @access Private (Requires Admin privileges)
 */
router.get('/', verifyToken, verifyAdmin, getAllUsers);

/**
 * @route GET /api/users/role/:roleName
 * @description Retrieves a list of users filtered by their specific role (e.g., 'teacher').
 * @access Private (Requires Admin privileges)
 */
router.get('/role/:roleName', verifyToken, verifyAdmin, getUsersByRole);

/**
 * @route GET /api/users/:id/image
 * @description Serves the binary avatar image for a specific user.
 * @access Public (Allows frontend <img> tags to render directly)
 */
router.get('/:id/image', getUserImage);

/**
 * @route PUT /api/users/:id
 * @description Updates a user's basic information and/or role by their ID.
 * @access Private (Requires Admin privileges)
 */
router.put('/:id', verifyToken, verifyAdmin, updateUser);

/**
 * @route DELETE /api/users/:id
 * @description Deletes a user account from the system by their ID.
 * @access Private (Requires Admin privileges)
 */
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);

module.exports = router;