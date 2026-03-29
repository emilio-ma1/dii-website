/**
 * @file professorRoutes.js
 * @description 
 * Defines API endpoints for professor profile management.
 * Maps endpoints to their respective controller functions and applies security middlewares.
 * Incorporates multer for handling multipart/form-data binary uploads safely.
 */
const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 } 
});

const { 
  getProfessors, 
  upsertProfessor, 
  deleteProfessor,
  getProfessorImage
} = require('../controllers/professorController');

const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

/**
 * @route GET /api/professors
 * @description Retrieves a list of all professor profiles with their portfolios.
 * @access Public
 */
router.get('/', getProfessors);

/**
 * @route GET /api/professors/:id/image
 * @description Serves the binary image file for a specific professor profile.
 * @access Public
 */
router.get('/:id/image', getProfessorImage);

/**
 * @route POST /api/professors
 * @description Creates or updates a professor profile (Upsert) with binary image support.
 * @access Private (Requires Admin privileges)
 */
router.post('/', verifyToken, verifyAdmin, upload.single('image'), upsertProfessor);

/**
 * @route PUT /api/professors/:id
 * @description Updates an existing professor profile (Upsert fallback) with binary image support.
 * @access Private (Requires Admin privileges)
 */
router.put('/:id', verifyToken, verifyAdmin, upload.single('image'), upsertProfessor);

/**
 * @route DELETE /api/professors/:id
 * @description Deletes a professor profile by its associated user ID.
 * @access Private (Requires Admin privileges)
 */
router.delete('/:id', verifyToken, verifyAdmin, deleteProfessor);

module.exports = router;