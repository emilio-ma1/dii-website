/**
 * @file equipmentRoutes.js
 * @description
 * Defines API endpoints for laboratory and equipment management.
 */
const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 } 
});

// Controladores
const { 
  getEquipment, 
  createEquipment, 
  updateEquipment, 
  deleteEquipment,
  getEquipmentImage
} = require('../controllers/equipmentController');

// Middlewares de seguridad
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

/**
 * @route GET /api/equipment
 * @access Public
 */
router.get('/', getEquipment);

/**
 * @route GET /api/equipment/:id/image
 * @description Serves the binary image file.
 * @access Public
 */
router.get('/:id/image', getEquipmentImage);

/**
 * @route POST /api/equipment
 * @access Private (Requires Admin)
 */
router.post('/', verifyToken, verifyAdmin, upload.single('image'), createEquipment);

/**
 * @route PUT /api/equipment/:id
 * @access Private (Requires Admin)
 */
router.put('/:id', verifyToken, verifyAdmin, upload.single('image'), updateEquipment);

/**
 * @route DELETE /api/equipment/:id
 * @access Private (Requires Admin)
 */
router.delete('/:id', verifyToken, verifyAdmin, deleteEquipment);

module.exports = router;