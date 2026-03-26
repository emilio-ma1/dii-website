/**
 * @file projectModel.js
 * @description
 * Data Access Object (DAO) for the 'projects' entity.
 * Handles database transactions for projects and their many-to-many relationship with authors.
 */
const pool = require('../config/db');

const ProjectModel = {
  /**
   * Retrieves all projects including their associated authors and category name.
   * Excludes heavy binary fields (image_data, pdf_data) to preserve memory.
   *
   * @returns {Promise<Array<object>>} An array of project objects.
   * @throws {Error} If the database query fails.
   */
  getAll: async () => {
    try {
      const query = `
        SELECT 
          p.id, p.title, p.abstract, p.year, p.category_id, p.status,
          c.name AS category_name,
          COALESCE(
            json_agg(
              json_build_object('id', u.id, 'name', u.full_name)
            ) FILTER (WHERE u.id IS NOT NULL), '[]'
          ) AS authors
        FROM projects p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN project_authors pa ON p.id = pa.project_id
        LEFT JOIN users u ON pa.user_id = u.id
        GROUP BY p.id, c.name
        ORDER BY p.id DESC;
      `;
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error('[ERROR] Failed to fetch all projects:', error);
      throw error;
    }
  },

  /**
   * Retrieves a specific project by its ID, including its associated authors.
   * Excludes heavy binary fields.
   *
   * @param {number|string} id - The unique identifier of the project.
   * @returns {Promise<object|null>} The project object, or null if not found.
   * @throws {Error} If the database query fails.
   */
  getById: async (id) => {
    try {
      const query = `
        SELECT 
            p.id, p.title, p.abstract, p.year, p.category_id, p.status,
            COALESCE(
              json_agg(
                json_build_object('id', u.id, 'name', u.full_name)
              ) FILTER (WHERE u.id IS NOT NULL), '[]'
            ) AS authors
        FROM projects p
        LEFT JOIN project_authors pa ON p.id = pa.project_id
        LEFT JOIN users u ON pa.user_id = u.id
        WHERE p.id = $1
        GROUP BY p.id;
      `;
      const { rows } = await pool.query(query, [id]);
      return rows.length ? rows[0] : null; 
    } catch (error) {
      console.error(`[ERROR] Failed to fetch project ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Creates a new project and links the assigned authors.
   * Now includes support for BYTEA binary files (images and PDFs).
   *
   * @param {object} projectData - The details of the project to insert.
   * @param {Array<number>} authorIds - An array of user IDs to link as authors.
   * @returns {Promise<object>} The newly created project record without binary data.
   * @throws {Error} If the database transaction fails.
   */
  create: async (projectData, authorIds) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insertamos los datos normales y los nuevos campos binarios (BYTEA)
      const projectQuery = `
        INSERT INTO projects (title, abstract, year, category_id, status, image_data, image_mimetype, pdf_data, pdf_mimetype)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, title, abstract, year, category_id, status; -- Retornamos info ligera
      `;
      const values = [
        projectData.title, projectData.abstract, projectData.year, 
        projectData.category_id, projectData.status, 
        projectData.image_data, projectData.image_mimetype, 
        projectData.pdf_data, projectData.pdf_mimetype
      ];
      
      const res = await client.query(projectQuery, values);
      const newProject = res.rows[0];

      if (authorIds && authorIds.length > 0) {
        for (const userId of authorIds) {
          await client.query(
            'INSERT INTO project_authors (project_id, user_id) VALUES ($1, $2)', 
            [newProject.id, userId]
          );
        }
      }

      await client.query('COMMIT');
      return newProject;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('[ERROR] Failed to create project with authors:', error);
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Updates an existing project and refreshes its associated authors.
   * Uses COALESCE to prevent overwriting existing files with null if not provided.
   *
   * @param {number|string} id - The unique identifier of the project.
   * @param {object} projectData - The updated project details.
   * @param {Array<number>} authorIds - An array of user IDs to link as authors.
   * @returns {Promise<object>} The updated project record from the database.
   * @throws {Error} If the database transaction fails.
   */
  update: async (id, projectData, authorIds) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const updateQuery = `
        UPDATE projects 
        SET 
          title = $1, abstract = $2, year = $3, category_id = $4, status = $5,
          image_data = COALESCE($6, image_data),
          image_mimetype = COALESCE($7, image_mimetype),
          pdf_data = COALESCE($8, pdf_data),
          pdf_mimetype = COALESCE($9, pdf_mimetype)
        WHERE id = $10 
        RETURNING id, title, abstract, year, category_id, status;
      `;
      const values = [
        projectData.title, projectData.abstract, projectData.year, 
        projectData.category_id, projectData.status, 
        projectData.image_data, projectData.image_mimetype, 
        projectData.pdf_data, projectData.pdf_mimetype, 
        id
      ];
      
      const res = await client.query(updateQuery, values);
      const updatedProject = res.rows[0];
      
      await client.query('DELETE FROM project_authors WHERE project_id = $1', [id]);

      if (authorIds && authorIds.length > 0) {
        for (const userId of authorIds) {
          await client.query(
            'INSERT INTO project_authors (project_id, user_id) VALUES ($1, $2)', 
            [id, userId]
          );
        }
      }

      await client.query('COMMIT');
      return updatedProject;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`[ERROR] Failed to update project ID ${id}:`, error);
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Deletes a project from the database.
   * Relies on the ON DELETE CASCADE constraint to clean up the project_authors table.
   *
   * @param {number|string} id - The unique identifier of the project to delete.
   * @returns {Promise<object|null>} The deleted project record, or null if not found.
   * @throws {Error} If the database deletion fails.
   */
  delete: async (id) => {
    try {
      const query = 'DELETE FROM projects WHERE id = $1 RETURNING id, title;';
      const { rows } = await pool.query(query, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`[ERROR] Failed to delete project ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Retrieves exclusively the projects where a specific user is an author.
   * Explicitly defines columns to avoid fetching heavy binary data (BYTEA).
   * * @param {number} userId - The ID of the authenticated user.
   * @returns {Promise<Array<object>>} An array of projects authored by the user.
   * @throws {Error} If the database query fails.
   */
  getByAuthorId: async (userId) => {
    try {
      const query = `
        SELECT 
          p.id, p.title, p.abstract, p.year, p.category_id, p.status, 
          c.name as category_name,
          COALESCE(
            json_agg(
              json_build_object('id', u.id, 'full_name', u.full_name, 'role', u.role)
            ) FILTER (WHERE u.id IS NOT NULL), '[]'
          ) as authors
        FROM projects p
        LEFT JOIN categories c ON p.category_id = c.id
        JOIN project_authors pa ON p.id = pa.project_id
        LEFT JOIN project_authors pa_all ON p.id = pa_all.project_id
        LEFT JOIN users u ON pa_all.user_id = u.id
        WHERE pa.user_id = $1
        GROUP BY p.id, c.name
        ORDER BY p.year DESC, p.id DESC;
      `;
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error(`[ERROR] Failed to fetch projects by author ID ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Retrieves the binary image data and mimetype for a specific project.
   *
   * @param {number|string} id - The project ID.
   * @returns {Promise<object|null>} Object containing image_data and image_mimetype.
   * @throws {Error} If the database query fails.
   */
  getImage: async (id) => {
    try {
      const query = 'SELECT image_data, image_mimetype FROM projects WHERE id = $1;';
      const { rows } = await pool.query(query, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`[ERROR] Failed to fetch image for project ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Retrieves the binary PDF data and mimetype for a specific project.
   *
   * @param {number|string} id - The project ID.
   * @returns {Promise<object|null>} Object containing pdf_data and pdf_mimetype.
   * @throws {Error} If the database query fails.
   */
  getPdf: async (id) => {
    try {
      const query = 'SELECT pdf_data, pdf_mimetype FROM projects WHERE id = $1;';
      const { rows } = await pool.query(query, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`[ERROR] Failed to fetch PDF for project ID ${id}:`, error);
      throw error;
    }
  }
};

module.exports = ProjectModel;