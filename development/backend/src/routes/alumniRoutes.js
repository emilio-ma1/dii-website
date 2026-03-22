/**
 * @file alumniRoutes.js
 * @description Defines HTTP routes for the alumni module.
 */
const express = require('express');
const router = express.Router();

const { 
  getAllAlumni, 
  upsertAlumni, 
  deleteAlumni 
} = require('../controllers/alumniController');

const { verifyToken } = require('../middlewares/authMiddleware'); 

router.get('/', getAllAlumni);
router.post('/', verifyToken, upsertAlumni); 
router.put('/:id', verifyToken, upsertAlumni);
router.delete('/:id', verifyToken, deleteAlumni);

module.exports = router;