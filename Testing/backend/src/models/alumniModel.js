/**
 * @file alumniModel.js
 * @description
 * Data Access Object (DAO) for the 'alumni_profiles' entity.
 * Handles database operations and dynamic portfolio aggregation.
 */
const pool = require('../config/db');

const AlumniModel = {
  /**
   * Retrieves ALL users with the 'alumni' role, pulling their profile data 
   * (if it exists) and their dynamic project portfolio via LEFT JOINs.
   *
   * @returns {Promise<Array<object>>} List of all alumni with nested projects.
   */
  getAll: async () => {
    try {
      const query = `
        SELECT 
            u.id AS id, 
            u.id AS user_id, 
            ap.id AS profile_id, 
            ap.degree, 
            ap.specialty, 
            ap.image_url, 
            ap.video_url_embed,
            COALESCE(ap.is_profile_public, true) AS is_profile_public,
            u.full_name, 
            u.email,
            COALESCE(
              json_agg(
                json_build_object('id', proj.id, 'title', proj.title)
              ) FILTER (WHERE proj.id IS NOT NULL), '[]'
            ) AS projects
        FROM users u
        LEFT JOIN alumni_profiles ap ON u.id = ap.user_id
        LEFT JOIN project_authors pa ON u.id = pa.user_id
        LEFT JOIN projects proj ON pa.project_id = proj.id
        WHERE u.role = 'alumni'
        GROUP BY u.id, ap.id
        ORDER BY u.full_name ASC;
      `;
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error('[ERROR] Failed to fetch alumni:', error);
      throw error; // Models throw, Controllers catch
    }
  },

  /**
   * Upserts (Inserts or Updates) an alumni profile.
   * If the profile does not exist, it creates it. If it exists, it updates it.
   *
   * @param {object} profileData - The alumni profile data payload.
   * @returns {Promise<object>} The saved profile record.
   */
  upsert: async (profileData) => {
    try {
      const query = `
        INSERT INTO alumni_profiles 
        (user_id, degree, specialty, image_url, video_url_embed, is_profile_public)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          degree = EXCLUDED.degree,
          specialty = EXCLUDED.specialty,
          image_url = EXCLUDED.image_url,
          video_url_embed = EXCLUDED.video_url_embed,
          is_profile_public = EXCLUDED.is_profile_public
        RETURNING *;
      `;
      const values = [
        profileData.user_id,
        profileData.degree,
        profileData.specialty,
        profileData.image_url,
        profileData.video_url_embed,
        profileData.is_profile_public
      ];
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('[ERROR] Failed to upsert alumni profile:', error);
      throw error;
    }
  },

  /**
   * Deletes an alumni profile.
   * Note: This only deletes the extended profile data, NOT the base user account.
   *
   * @param {number|string} id - The user ID associated with the profile.
   * @returns {Promise<object|null>} The deleted profile record, or null if not found.
   */
  delete: async (id) => {
    try {
      const query = 'DELETE FROM alumni_profiles WHERE user_id = $1 RETURNING *;';
      const { rows } = await pool.query(query, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`[ERROR] Failed to delete alumni profile for user_id ${id}:`, error);
      throw error;
    }
  }
};

module.exports = AlumniModel;