/**
 * @file professorModel.js
 * @description DAO for the 'professors' entity. Handles joins with users and projects tables.
 */
const pool = require('../config/db');

const ProfessorModel = {
/**
   * Retrieves all professor profiles including their base user data and project portfolio.
   *
   * @returns {Promise<Array>} List of professor profiles.
   */
  getAll: async () => {
      try {
        const query = `
          SELECT 
              p.id, 
              p.user_id, 
              p.degree, 
              p.area, 
              p.image_url,
              u.full_name,
              u.email,
              -- Agrupamos los proyectos en un arreglo JSON
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', proj.id, 
                    'title', proj.title
                  )
                ) FILTER (WHERE proj.id IS NOT NULL), '[]'
              ) AS projects
          FROM professors p
          JOIN users u ON p.user_id = u.id
          -- El puente mágico: conectamos al usuario con sus autorías de proyectos
          LEFT JOIN project_authors pa ON u.id = pa.user_id
          LEFT JOIN projects proj ON pa.project_id = proj.id
          GROUP BY p.id, u.id
          ORDER BY u.full_name ASC;
        `;
        const { rows } = await pool.query(query);
        return rows;
      } catch (error) {
        console.error('[ERROR] Failed to fetch professors with projects:', error);
        throw error;
      }
  },
  create: async (userId, degree, area, imageUrl) => {
    try {
      const query = `
        INSERT INTO professors (user_id, degree, area, image_url)
        VALUES ($1, $2, $3, $4) RETURNING *;
      `;
      const { rows } = await pool.query(query, [userId, degree, area, imageUrl]);
      return rows[0];
    } catch (error) {
      console.error('[ERROR] Failed to create professor profile:', error);
      throw error;
    }
  },

  update: async (id, degree, area, imageUrl) => {
    try {
      const query = `
        UPDATE professors SET degree = $1, area = $2, image_url = $3 
        WHERE id = $4 RETURNING *;
      `;
      const { rows } = await pool.query(query, [degree, area, imageUrl, id]);
      return rows[0];
    } catch (error) {
      console.error(`[ERROR] Failed to update professor ID ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const query = 'DELETE FROM professors WHERE id = $1 RETURNING *;';
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      console.error(`[ERROR] Failed to delete professor ID ${id}:`, error);
      throw error;
    }
  }
};

module.exports = ProfessorModel;