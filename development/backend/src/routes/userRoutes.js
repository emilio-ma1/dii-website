/**
 * @file userRoutes.js
 * @description
 * Defines API endpoints for internal user management.
 * Allows listing profiles, filtering by roles, updating data, and deleting accounts.
 * All routes are strictly protected for exclusive use by administrators.
 */
const express = require('express');
const router = express.Router();

// Import controllers and security middlewares
const { getAllUsers, getUsersByRole, deleteUser, updateUser } = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

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