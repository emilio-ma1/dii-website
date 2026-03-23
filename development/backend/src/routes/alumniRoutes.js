/**
 * @file alumniRoutes.js
 * @description 
 * Defines HTTP routes for the alumni module.
 * Maps endpoints to their respective controller functions and applies security middlewares.
 */
const express = require('express');
const router = express.Router();

const { 
  getAllAlumni, 
  upsertAlumni, 
  deleteAlumni 
} = require('../controllers/alumniController');

// Imported verifyAdmin to prevent privilege escalation
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware'); 

/**
 * @route GET /api/alumni
 * @description Retrieves a list of all alumni profiles with their portfolios.
 * @access Public
 */
router.get('/', getAllAlumni);

/**
 * @route POST /api/alumni
 * @description Creates or updates an alumni profile (Upsert).
 * @access Private (Admin only)
 */
// Added verifyAdmin middleware
router.post('/', verifyToken, verifyAdmin, upsertAlumni); 

/**
 * @route PUT /api/alumni/:id
 * @description Updates an existing alumni profile (Upsert fallback).
 * @access Private (Admin only)
 */
// Added verifyAdmin middleware
router.put('/:id', verifyToken, verifyAdmin, upsertAlumni);

/**
 * @route DELETE /api/alumni/:id
 * @description Deletes an alumni profile by user ID.
 * @access Private (Admin only)
 */
// Added verifyAdmin middleware
router.delete('/:id', verifyToken, verifyAdmin, deleteAlumni);

module.exports = router;