/**
 * @file projectController.js
 * @description
 * Controller for managing project entities. Adheres to Thin Controller 
 * architecture, delegating complex DB transactions to isolated helper functions.
 */

const pool = require('../config/db');
const ProjectModel = require('../models/projectModel');

/**
 * Validates if the incoming project payload contains all mandatory fields.
 *
 * @param {object} payload The request body containing project data.
 * @returns {boolean} True if the payload is valid, false otherwise.
 */
const isValidProjectPayload = (payload) => {
  return Boolean(payload.title && payload.status && payload.category_id);
};

/**
 * Links a teacher to a project by resolving their user_id to professor_id.
 *
 * @param {object} client The active database transaction client.
 * @param {number} projectId The ID of the created project.
 * @param {number} userId The user_id of the teacher.
 * @returns {Promise<void>}
 * @throws {Error} If the database query fails.
 */
const linkTeacher = async (client, projectId, userId) => {
  const profResult = await client.query('SELECT id FROM professors WHERE user_id = $1', [userId]);
  
  if (profResult.rows.length === 0) return;

  const professorId = profResult.rows[0].id;
  await client.query(
    'INSERT INTO project_professors (project_id, professor_id) VALUES ($1, $2);',
    [projectId, professorId]
  );
};

/**
 * Iterates through authors and delegates linking based on their role.
 *
 * @param {object} client The active database transaction client.
 * @param {number} projectId The ID of the created project.
 * @param {Array<object>} authors List of authors to link.
 * @returns {Promise<void>}
 * @throws {Error} If the database insertion fails.
 */
const linkAuthorsToProject = async (client, projectId, authors) => {
  if (!Array.isArray(authors) || authors.length === 0) return;

  for (const author of authors) {
    if (author.role === 'teacher') {
      await linkTeacher(client, projectId, author.id);
    } else if (author.role === 'alumni') {
      await client.query(
        'INSERT INTO project_alumni (project_id, user_id) VALUES ($1, $2);',
        [projectId, author.id]
      );
    }
  }
};

/**
 * Executes the database transaction to create a project and its relations.
 *
 * @param {object} projectData The validated project data.
 * @returns {Promise<number>} The ID of the newly created project.
 * @throws {Error} If the transaction rolls back due to a database error.
 */
const executeProjectCreation = async (projectData) => {
  const { title, abstract, year, pdf_url, image_url, status, category_id, authors } = projectData;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    
    const insertQuery = `
      INSERT INTO projects (title, abstract, pdf_url, image_url, status, category_id, year) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;
    `;
    const result = await client.query(insertQuery, [
      title, abstract, pdf_url, image_url, status, category_id, year || null
    ]);
    const projectId = result.rows[0].id;

    await linkAuthorsToProject(client, projectId, authors);
    
    await client.query('COMMIT');
    return projectId;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Handles the HTTP POST request to create a new project.
 *
 * @param {object} req The HTTP request object.
 * @param {object} res The HTTP response object.
 * @returns {Promise<object>} JSON response containing the success message and projectId.
 * @throws {Error} If the underlying transaction fails (caught and mapped to 500).
 */
const createProject = async (req, res) => {
  if (!isValidProjectPayload(req.body)) {
    return res.status(400).json({ message: 'Missing mandatory fields: title, status, or category_id.' });
  }

  try {
    const newProjectId = await executeProjectCreation(req.body);
    return res.status(201).json({ message: 'Project created successfully.', projectId: newProjectId });
  } catch (error) {
    console.error('[ERROR] Transaction failed while creating project:', error);
    return res.status(500).json({ message: 'Internal server error while processing the request.' });
  }
};

/**
 * Fetches the complete catalog of public projects.
 *
 * @param {object} req The HTTP request object.
 * @param {object} res The HTTP response object.
 * @returns {Promise<object>} JSON response with the projects list.
 * @throws {Error} Implicitly catches DB errors and returns 500.
 */
const getAllProjects = async (req, res) => {
  try {
    const projectsList = await ProjectModel.getAll();
    return res.json(projectsList);
  } catch (error) {
    console.error('[ERROR] Failed to fetch projects in controller:', error);
    return res.status(500).json({ message: 'Internal server error while fetching projects.' });
  }
};

/**
 * Fetches the details of a specific project by its ID, including authors.
 *
 * @param {object} req The HTTP request object (contains the ID in params).
 * @param {object} res The HTTP response object.
 * @returns {Promise<object>} JSON response with project details or 404/500 errors.
 * @throws {Error} Implicitly catches DB errors and returns 500.
 */
const getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const projectDetails = await ProjectModel.getByIdWithAuthors(id);
    
    if (!projectDetails) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    
    return res.json(projectDetails);
  } catch (error) {
    console.error(`[ERROR] Failed to fetch project details for ID ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error while fetching the project.' });
  }
};

module.exports = { createProject, getAllProjects, getProjectById };