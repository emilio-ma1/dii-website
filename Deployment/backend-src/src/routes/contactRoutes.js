/**
 * @file contactRoutes.js
 * @description 
 * Defines API endpoints for department contacts.
 * * Responsibilities:
 * - Map HTTP verbs and paths to controller functions.
 * - Apply security middlewares for protected routes.
 */
const express = require('express');
const router = express.Router();

const { 
  getContacts, 
  createContact, 
  updateContact, 
  deleteContact 
} = require('../controllers/contactController');

const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

/**
 * @route GET /api/contacts
 * @description Retrieves a list of all department contacts.
 * @access Public
 */
router.get('/', getContacts);

/**
 * @route POST /api/contacts
 * @description Creates a new contact record.
 * @access Private (Requires Admin privileges)
 */
router.post('/', verifyToken, verifyAdmin, createContact);

/**
 * @route PUT /api/contacts/:id
 * @description Updates an existing contact record.
 * @access Private (Requires Admin privileges)
 */
router.put('/:id', verifyToken, verifyAdmin, updateContact);

/**
 * @route DELETE /api/contacts/:id
 * @description Deletes a contact record by ID.
 * @access Private (Requires Admin privileges)
 */
router.delete('/:id', verifyToken, verifyAdmin, deleteContact);

module.exports = router;