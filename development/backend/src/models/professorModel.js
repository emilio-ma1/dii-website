/**
 * @file professorModel.js
 * @description DAO for the 'professors' entity. Handles joins with users and projects tables.
 */
const pool = require('../config/db');

const ProfessorModel = {
  /**
   * Retrieves all users with the 'professor' role, including their base user data 
   * and project portfolio if they have a linked profile.
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
            p.image_url,
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
      throw error; // Propagamos el error para no silenciarlo (Swallowing exceptions prohibido)
    }
  },

  /**
   * Upserts (Inserts or Updates) a professor profile linked to a user account.
   *
   * @param {object} profileData The professor profile data.
   * @returns {Promise<object>} The newly created or updated profile.
   * @throws {Error} If the database query fails.
   */
  upsert: async (profileData) => {
    try {
      const query = `
        INSERT INTO professors (user_id, degree, area, image_url)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          degree = EXCLUDED.degree,
          area = EXCLUDED.area,
          image_url = EXCLUDED.image_url
        RETURNING *;
      `;
      const values = [
        profileData.user_id, 
        profileData.degree, 
        profileData.area, 
        profileData.image_url
      ];
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
   * @returns {Promise<object>} The deleted profile.
   * @throws {Error} If the database query fails.
   */
  delete: async (id) => {
    try {
      const query = 'DELETE FROM professors WHERE user_id = $1 RETURNING *;';
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      console.error(`[ERROR] Failed to delete professor for user_id ${id}:`, error);
      throw error;
    }
  }
};

module.exports = ProfessorModel;