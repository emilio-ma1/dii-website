/**
 * @file alumniRoutes.js
 * @description 
 * Defines HTTP routes for the alumni module.
 * * Responsibilities:
 * - Maps endpoints to their respective controller functions.
 * - Applies security middlewares (RBAC).
 * - Incorporates multer for handling multipart/form-data binary uploads safely.
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
  getAllAlumni, 
  upsertAlumni, 
  deleteAlumni,
  getAlumniImage
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
 * @route GET /api/alumni/:id/image
 * @description Serves the binary image file for a specific alumni profile.
 * @access Public
 */
router.get('/:id/image', getAlumniImage);

/**
 * @route POST /api/alumni
 * @description Creates or updates an alumni profile (Upsert) with binary image support.
 * @access Private (Admin only)
 */
router.post('/', verifyToken, verifyAdmin, upload.single('image'), upsertAlumni); 

/**
 * @route PUT /api/alumni/:id
 * @description Updates an existing alumni profile (Upsert fallback) with binary image support.
 * @access Private (Admin only)
 */
router.put('/:id', verifyToken, verifyAdmin, upload.single('image'), upsertAlumni);

/**
 * @route DELETE /api/alumni/:id
 * @description Deletes an alumni profile by user ID.
 * @access Private (Admin only)
 */
router.delete('/:id', verifyToken, verifyAdmin, deleteAlumni);

module.exports = router;