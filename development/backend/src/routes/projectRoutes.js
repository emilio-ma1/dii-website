/**
 * @file projectRoutes.js
 * @description 
 * Defines the HTTP routes for the research projects module.
 * Maps endpoints to their respective controller functions and applies authentication middleware.
 */
const express = require('express');
const router = express.Router();

const { 
  getAllProjects, 
  getProjectById,
  createProject, 
  updateProject, 
  deleteProject
} = require('../controllers/projectController');

const { verifyToken } = require('../middlewares/authMiddleware'); 

/**
 * @route GET /api/projects
 * @description Retrieves the list of all research projects including their authors.
 * @access Public
 */
router.get('/', getAllProjects);

/**
 * @route GET /api/projects/:id
 * @description Retrieves a specific research project by its ID, including detailed information and authors.
 * @access Public
 */
router.get('/:id', getProjectById);

/**
 * @route POST /api/projects
 * @description Creates a new research project and links the assigned authors.
 * @access Private (Requires authentication token)
 */
router.post('/', verifyToken, createProject);

/**
 * @route PUT /api/projects/:id
 * @description Updates an existing research project and refreshes its authors list.
 * @access Private (Requires authentication token)
 */
router.put('/:id', verifyToken, updateProject);

/**
 * @route DELETE /api/projects/:id
 * @description Deletes a research project from the system by its ID.
 * @access Private (Requires authentication token)
 */
router.delete('/:id', verifyToken, deleteProject);

module.exports = router;