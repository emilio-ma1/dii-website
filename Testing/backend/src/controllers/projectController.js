/**
 * @file projectController.js
 * @description
 * Handles incoming HTTP requests for research projects.
 * Enforces strict Data Isolation and Ownership Security for updates and deletions.
 */
const ProjectModel = require('../models/projectModel');
const AuditLogModel = require('../models/auditLogModel');

/**
 * Helper function to extract integer IDs from a mixed array of authors.
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
 * Retrieves research projects.
 * - Public Page: Returns all projects without exception.
 * - Admin Panel (?scope=admin): Isolates data. Admins see all, others see their own.
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

const createProject = async (req, res) => {
  const { authors, ...projectData } = req.body;

  if (!projectData.title || !projectData.category_id) {
    return res.status(400).json({ message: 'El título y la categoría son obligatorios.' });
  }

  const cleanAuthorIds = extractAuthorIds(authors);

  try {
    const newProject = await ProjectModel.create(projectData, cleanAuthorIds);

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
 * Updates an existing research project.
 * SECURITY: Enforces ownership. Only Admins or project Authors can edit.
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
    const updatedProject = await ProjectModel.update(id, projectData, cleanAuthorIds);

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
 * Deletes a research project.
 * SECURITY: Enforces ownership. Only Admins or project Authors can delete.
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