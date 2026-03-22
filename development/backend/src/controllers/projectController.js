/**
 * @file projectController.js
 * @description
 * Handles incoming HTTP requests for research projects.
 * Adheres strictly to the Thin Controller pattern by delegating DB logic to ProjectModel.
 */
const ProjectModel = require('../models/projectModel');

/**
 * Helper function to extract integer IDs from a mixed array of authors.
 * Handles JSON strings, objects, or raw numbers.
 * * @param {Array} authorsArray 
 * @returns {Array<number>}
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
 * Creates a new research project and links its authors.
 */
const createProject = async (req, res) => {
  const { authors, ...projectData } = req.body;

  const cleanAuthorIds = extractAuthorIds(authors);

  try {
    const newProject = await ProjectModel.create(projectData, cleanAuthorIds);
    return res.status(201).json(newProject);
  } catch (error) {
    console.error('[ERROR] Controller failed to create project:', error);
    return res.status(500).json({ message: 'Error interno al crear la investigación.' });
  }
};

/**
 * Updates an existing research project and refreshes its authors list.
 */
const updateProject = async (req, res) => {
  const { id } = req.params;
  const { authors, ...projectData } = req.body;

  const cleanAuthorIds = extractAuthorIds(authors);

  try {
    const updatedProject = await ProjectModel.update(id, projectData, cleanAuthorIds);
    return res.status(200).json(updatedProject);
  } catch (error) {
    console.error(`[ERROR] Controller failed to update project ID ${id}:`, error);
    return res.status(500).json({ message: 'Error interno al actualizar la investigación.' });
  }
};

/**
 * Deletes a research project from the system.
 */
const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProject = await ProjectModel.delete(id);

    if (!deletedProject) {
      return res.status(404).json({ message: 'La investigación solicitada no existe o ya fue eliminada.' });
    }

    return res.status(200).json({ message: 'Investigación eliminada exitosamente.' });
  } catch (error) {
    console.error(`[ERROR] Controller failed to delete project ID ${id}:`, error);
    return res.status(500).json({ message: 'Error interno al eliminar la investigación.' });
  }
};

module.exports = {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject
};