/**
 * @file projectController.js
 * @description
 * Handles incoming HTTP requests for research projects.
 * Adheres strictly to the Thin Controller pattern by delegating DB logic to ProjectModel.
 */
const ProjectModel = require('../models/projectModel');
const AuditLogModel = require('../models/auditLogModel'); //Added Audit Trail

/**
 * Helper function to extract integer IDs from a mixed array of authors.
 * Handles JSON strings, objects, or raw numbers.
 * * @param {Array} authorsArray - Mixed array of author representations.
 * @returns {Array<number>} An array of clean integer IDs.
 */
const extractAuthorIds = (authorsArray) => {
  if (!authorsArray || !Array.isArray(authorsArray)) return [];
  
  return authorsArray.map(author => {
    if (typeof author === 'string' && author.startsWith('{')) {
      try { return JSON.parse(author).id; } catch (e) { return null; }
    }
    if (typeof author === 'object' && author !== null) {
      return author.id;
    }
    return parseInt(author, 10);
  }).filter(id => id !== null && !isNaN(id));
};

/**
 * Retrieves all research projects.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<object>} JSON response with the projects list.
 */
const getAllProjects = async (req, res) => {
  try {
    const projectsList = await ProjectModel.getAll();
    return res.status(200).json(projectsList);
  } catch (error) {
    console.error('[ERROR] Controller failed to fetch projects:', error);
    return res.status(500).json({ message: 'Error interno al obtener las investigaciones.' });
  }
};

/**
 * Retrieves a specific research project by its ID.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<object>} JSON response with the project details.
 */
const getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await ProjectModel.getById(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }
    
    return res.status(200).json(project);
  } catch (error) {
    console.error(`[ERROR] Failed to fetch project ${id}:`, error);
    return res.status(500).json({ message: 'Error interno al obtener el proyecto.' });
  }
};

/**
 * Creates a new research project and links its authors.
 *
 * @param {object} req - Express request object containing project data and authors.
 * @param {object} res - Express response object.
 * @returns {Promise<object>} JSON response with the newly created project.
 */
const createProject = async (req, res) => {
  const { authors, ...projectData } = req.body;

  // Defensive programming
  if (!projectData.title || !projectData.category_id) {
    return res.status(400).json({ message: 'El título y la categoría son obligatorios.' });
  }

  const cleanAuthorIds = extractAuthorIds(authors);

  try {
    const newProject = await ProjectModel.create(projectData, cleanAuthorIds);

    // Inject Audit Log for traceability
    if (req.user && req.user.id) {
      await AuditLogModel.logAction(
        req.user.id,
        'CREATE',
        'projects',
        newProject.id,
        { title: newProject.title, authors_count: cleanAuthorIds.length }
      );
    }

    return res.status(201).json(newProject);
  } catch (error) {
    console.error('[ERROR] Controller failed to create project:', error);
    return res.status(500).json({ message: 'Error interno al crear la investigación.' });
  }
};

/**
 * Updates an existing research project and refreshes its authors list.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<object>} JSON response with the updated project.
 */
const updateProject = async (req, res) => {
  const { id } = req.params;
  const { authors, ...projectData } = req.body;

  // Defensive programming
  if (!projectData.title) {
    return res.status(400).json({ message: 'El título de la investigación es obligatorio.' });
  }

  const cleanAuthorIds = extractAuthorIds(authors);

  try {
    const updatedProject = await ProjectModel.update(id, projectData, cleanAuthorIds);
    
    if (!updatedProject) {
      return res.status(404).json({ message: 'La investigación solicitada no existe.' });
    }

    // Inject Audit Log for traceability
    if (req.user && req.user.id) {
      await AuditLogModel.logAction(
        req.user.id,
        'UPDATE',
        'projects',
        id,
        { title: updatedProject.title, status: updatedProject.status }
      );
    }

    return res.status(200).json(updatedProject);
  } catch (error) {
    console.error(`[ERROR] Controller failed to update project ID ${id}:`, error);
    return res.status(500).json({ message: 'Error interno al actualizar la investigación.' });
  }
};

/**
 * Deletes a research project from the system.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<object>} JSON response confirming the deletion.
 */
const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProject = await ProjectModel.delete(id);

    if (!deletedProject) {
      return res.status(404).json({ message: 'La investigación solicitada no existe o ya fue eliminada.' });
    }

    // Inject Audit Log for traceability
    if (req.user && req.user.id) {
      await AuditLogModel.logAction(
        req.user.id,
        'DELETE',
        'projects',
        id,
        { 
          title: deletedProject.title, 
          deleted_at: new Date().toISOString() 
        }
      );
    }

    return res.status(200).json({ message: 'Investigación eliminada exitosamente.' });
  } catch (error) {
    console.error(`[ERROR] Controller failed to delete project ID ${id}:`, error);
    return res.status(500).json({ message: 'Error interno al eliminar la investigación.' });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};