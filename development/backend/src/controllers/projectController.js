/**
 * @file projectController.js
 * @description
 * Handles incoming HTTP requests for research projects.
 * Enforces strict Data Isolation and Ownership Security for updates and deletions.
 */
const ProjectModel = require('../models/projectModel');
const AuditLogModel = require('../models/auditLogModel');

/**
 * Helper function to extract integer IDs from a mixed array or JSON string of authors.
 * * @param {Array|string} authorsInput - The authors data from the request body (array or JSON string).
 * @returns {Array<number>} An array of valid, clean author integer IDs.
 * @throws {Error} Safely catches parsing errors and logs a warning instead of halting.
 */
const extractAuthorIds = (authorsInput) => {
  if (!authorsInput) return [];
  
  let authorsArray = authorsInput;
  
  if (typeof authorsInput === 'string') {
    try {
      authorsArray = JSON.parse(authorsInput);
    } catch (error) {
      console.warn('[WARN] Failed to parse authors string from FormData:', error.message);
      return [];
    }
  }

  if (!Array.isArray(authorsArray)) return [];
  
  return authorsArray.map(author => {
    if (typeof author === 'string' && author.startsWith('{')) {
      try { 
        return JSON.parse(author).id; 
      } catch (e) { 
        console.warn('[WARN] Failed to parse individual author object:', e.message);
        return null; 
      }
    }
    if (typeof author === 'object' && author !== null) {
      return author.id;
    }
    return parseInt(author, 10);
  }).filter(id => id !== null && !isNaN(id));
};

/**
 * Retrieves research projects for the public website.
 * * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} JSON response containing the list of all projects.
 * @throws {Error} Catches internal database errors and returns a 500 status.
 */
const getAllProjects = async (req, res) => {
  try {
    const projectsList = await ProjectModel.getAll();
    return res.status(200).json(projectsList);
  } catch (error) {
    console.error('[ERROR] Controller failed to fetch public projects:', error);
    return res.status(500).json({ message: 'Error interno al obtener las investigaciones.' });
  }
};

/**
 * Retrieves a specific research project by its ID.
 * * @param {Object} req - The HTTP request object containing params.id.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} JSON response containing the project data.
 * @throws {Error} Catches internal database errors and returns a 500 status.
 */
const getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await ProjectModel.getById(id);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado.' });
    return res.status(200).json(project);
  } catch (error) {
    console.error(`[ERROR] Failed to fetch project ${id}:`, error);
    return res.status(500).json({ message: 'Error interno al obtener el proyecto.' });
  }
};

/**
 * Creates a new research project, handling multipart/form-data images.
 * * @param {Object} req - The HTTP request object containing body and file.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} JSON response confirming creation.
 * @throws {Error} Catches internal database errors and returns a 500 status.
 */
const createProject = async (req, res) => {
  const { authors, ...projectData } = req.body;

  if (!projectData.title || !projectData.category_id) {
    return res.status(400).json({ message: 'El título y la categoría son obligatorios.' });
  }

  const cleanAuthorIds = extractAuthorIds(authors);

  let imageData = null;
  let imageMimetype = null;
  if (req.file) {
    imageData = req.file.buffer;
    imageMimetype = req.file.mimetype;
  }

  const finalProjectData = {
    ...projectData,
    image_data: imageData,
    image_mimetype: imageMimetype
  };

  try {
    const newProject = await ProjectModel.create(finalProjectData, cleanAuthorIds);

    if (req.user && req.user.id) {
      await AuditLogModel.logAction(req.user.id, 'CREATE', 'projects', newProject.id, { title: newProject.title });
    }

    return res.status(201).json(newProject);
  } catch (error) {
    console.error('[ERROR] Controller failed to create project:', error);
    return res.status(500).json({ message: 'Error interno al crear la investigación.' });
  }
};

/**
 * Updates an existing research project. Enforces ownership rules.
 * * @param {Object} req - The HTTP request object containing params.id, body, and file.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} JSON response confirming update.
 * @throws {Error} Catches internal database errors and returns a 500 status.
 */
const updateProject = async (req, res) => {
  const { id } = req.params;
  const { authors, ...projectData } = req.body;

  if (!projectData.title) {
    return res.status(400).json({ message: 'El título de la investigación es obligatorio.' });
  }

  try {
    const existingProject = await ProjectModel.getById(id);
    if (!existingProject) return res.status(404).json({ message: 'La investigación solicitada no existe.' });

    const role = req.user ? req.user.role : 'guest';
    const userId = req.user ? req.user.id : null;

    if (role !== 'admin') {
      const currentAuthorIds = extractAuthorIds(existingProject.authors);
      if (!currentAuthorIds.includes(userId)) {
        return res.status(403).json({ message: 'Acceso denegado: Solo puedes editar las investigaciones donde participas.' });
      }
    }

    const cleanAuthorIds = extractAuthorIds(authors);

    let finalProjectData = { ...projectData };
    if (req.file) {
      finalProjectData.image_data = req.file.buffer;
      finalProjectData.image_mimetype = req.file.mimetype;
    }

    const updatedProject = await ProjectModel.update(id, finalProjectData, cleanAuthorIds);

    if (req.user && req.user.id) {
      await AuditLogModel.logAction(req.user.id, 'UPDATE', 'projects', id, { title: updatedProject.title });
    }

    return res.status(200).json(updatedProject);
  } catch (error) {
    console.error(`[ERROR] Controller failed to update project ID ${id}:`, error);
    return res.status(500).json({ message: 'Error interno al actualizar la investigación.' });
  }
};

/**
 * Deletes a research project. Enforces ownership rules.
 * * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} JSON response confirming deletion.
 * @throws {Error} Catches internal database errors and returns a 500 status.
 */
const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const existingProject = await ProjectModel.getById(id);
    if (!existingProject) return res.status(404).json({ message: 'La investigación solicitada no existe o ya fue eliminada.' });

    const role = req.user ? req.user.role : 'guest';
    const userId = req.user ? req.user.id : null;

    if (role !== 'admin') {
      const currentAuthorIds = extractAuthorIds(existingProject.authors);
      if (!currentAuthorIds.includes(userId)) {
        return res.status(403).json({ message: 'Acceso denegado: No tienes permiso para eliminar esta investigación.' });
      }
    }

    const deletedProject = await ProjectModel.delete(id);

    if (req.user && req.user.id) {
      await AuditLogModel.logAction(req.user.id, 'DELETE', 'projects', id, { title: deletedProject.title });
    }

    return res.status(200).json({ message: 'Investigación eliminada exitosamente.' });
  } catch (error) {
    console.error(`[ERROR] Controller failed to delete project ID ${id}:`, error);
    return res.status(500).json({ message: 'Error interno al eliminar la investigación.' });
  }
};

/**
 * Retrieves projects for the Admin panel with Data Isolation logic.
 * * @param {Object} req - The HTTP request object containing req.user.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} JSON array of filtered projects based on role.
 * @throws {Error} Catches internal database errors and returns a 500 status.
 */
const getPanelProjects = async (req, res) => {
  try {
    const { role, id } = req.user; 
    let projectsList;

    if (role === 'admin') {
      projectsList = await ProjectModel.getAll();
    } else {
      projectsList = await ProjectModel.getByAuthorId(id);
    }

    return res.status(200).json(projectsList);
  } catch (error) {
    console.error('[ERROR] Controller failed to fetch panel projects:', error);
    return res.status(500).json({ message: 'Error interno al cargar el panel.' });
  }
};

module.exports = { getAllProjects, getProjectById, createProject, updateProject, deleteProject, getPanelProjects };