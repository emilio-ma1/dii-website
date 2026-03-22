/**
 * @file professorRoutes.js
 * @description API routes for professor profile management.
 */
const express = require('express');
const router = express.Router();
const { getProfessors, createProfessor, updateProfessor, deleteProfessor } = require('../controllers/professorController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

router.get('/', getProfessors);
router.post('/', verifyToken, verifyAdmin, createProfessor);
router.put('/:id', verifyToken, verifyAdmin, updateProfessor);
router.delete('/:id', verifyToken, verifyAdmin, deleteProfessor);

module.exports = router;