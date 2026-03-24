/**
 * @file professorRoutes.js
 * @description 
 * Defines API endpoints for professor profile management.
 * Maps endpoints to their respective controller functions and applies security middlewares.
 */
const express = require('express');
const router = express.Router();

const { 
  getProfessors, 
  upsertProfessor, 
  deleteProfessor 
} = require('../controllers/professorController');

const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

/**
 * @route GET /api/professors
 * @description Retrieves a list of all professor profiles with their portfolios.
 * @access Public
 */
router.get('/', getProfessors);

/**
 * @route POST /api/professors
 * @description Creates or updates a professor profile (Upsert).
 * @access Private (Requires Admin privileges)
 */
router.post('/', verifyToken, verifyAdmin, upsertProfessor);

/**
 * @route PUT /api/professors/:id
 * @description Updates an existing professor profile (Upsert fallback).
 * @access Private (Requires Admin privileges)
 */
router.put('/:id', verifyToken, verifyAdmin, upsertProfessor);

/**
 * @route DELETE /api/professors/:id
 * @description Deletes a professor profile by its associated user ID.
 * @access Private (Requires Admin privileges)
 */
router.delete('/:id', verifyToken, verifyAdmin, deleteProfessor);

module.exports = router;