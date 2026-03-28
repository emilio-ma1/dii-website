/**
 * @file professorModel.js
 * @description 
 * Data Access Object (DAO) for the 'professors' entity. 
 * * Responsibilities:
 * - Handle joins with the users and projects tables to build complete portfolios.
 * - Manage binary image persistence using BYTEA columns.
 */
const pool = require('../config/db');

const ProfessorModel = {
  /**
   * Retrieves all users with the 'teacher' role and their project portfolio.
   * * WHY: Excludes the 'image_data' binary column to prevent memory overload
   * and optimize bandwidth during list rendering.
   *
   * @returns {Promise<Array<object>>} List of professor profiles and eligible users.
   * @throws {Error} If the database query fails.
   */
  getAll: async () => {
    try {
      const query = `
        SELECT 
            u.id AS id, 
            u.id AS user_id, 
            p.id AS profile_id,
            p.degree, 
            p.area, 
            u.full_name AS user_name, 
            u.email,
            COALESCE(
                json_agg(json_build_object('id', proj.id, 'title', proj.title)) 
                FILTER (WHERE proj.id IS NOT NULL), '[]'
            ) AS projects
        FROM users u
        LEFT JOIN professors p ON u.id = p.user_id
        LEFT JOIN project_authors pa ON u.id = pa.user_id 
        LEFT JOIN projects proj ON pa.project_id = proj.id
        WHERE u.role = 'teacher'
        GROUP BY u.id, p.id
        ORDER BY u.full_name ASC;
      `;
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error('[ERROR] Failed to fetch professors:', error);
      throw error; 
    }
  },

  /**
   * Upserts (Inserts or Updates) a professor profile linked to a user account.
   * * WHY: Uses COALESCE to ensure existing binary image data is preserved if 
   * the client only sends text updates.
   *
   * @param {object} payload The professor profile data including binary buffers.
   * @returns {Promise<object>} The newly created or updated profile record.
   * @throws {Error} If the database query fails.
   */
  upsert: async ({ user_id, degree, area, imageData, imageMimetype }) => {
    try {
      const query = `
        INSERT INTO professors (user_id, degree, area, image_data, image_mimetype)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          degree = EXCLUDED.degree,
          area = EXCLUDED.area,
          image_data = COALESCE(EXCLUDED.image_data, professors.image_data),
          image_mimetype = COALESCE(EXCLUDED.image_mimetype, professors.image_mimetype)
        RETURNING user_id, degree, area;
      `;
      const values = [user_id, degree, area, imageData, imageMimetype];
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('[ERROR] Failed to upsert professor profile:', error);
      throw error;
    }
  },

  /**
   * Deletes a professor profile based on the user_id.
   *
   * @param {number|string} id The user ID associated with the profile.
   * @returns {Promise<object|null>} The deleted profile record, or null if not found.
   * @throws {Error} If the database query fails.
   */
  delete: async (id) => {
    try {
      const query = 'DELETE FROM professors WHERE user_id = $1 RETURNING user_id;';
      const { rows } = await pool.query(query, [id]);
      
      return rows.length ? rows[0] : null; 
    } catch (error) {
      console.error(`[ERROR] Failed to delete professor for user_id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Retrieves exclusively the binary image data for a specific professor profile.
   *
   * @param {number|string} id The unique identifier of the user account.
   * @returns {Promise<object|null>} Object containing binary buffer and mimetype.
   * @throws {Error} If the database query fails.
   */
  getImage: async (id) => {
    try {
      const query = 'SELECT image_data, image_mimetype FROM professors WHERE user_id = $1;';
      const { rows } = await pool.query(query, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`[ERROR] Failed to fetch image for professor ID ${id}:`, error);
      throw error;
    }
  }
};

module.exports = ProfessorModel;