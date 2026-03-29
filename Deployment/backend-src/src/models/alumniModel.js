/**
 * @file alumniModel.js
 * @description
 * Data Access Object (DAO) for the 'alumni_profiles' entity.
 * * Responsibilities:
 * - Handle database operations and dynamic portfolio aggregation.
 * - Safely manage binary image data via BYTEA columns.
 */
const pool = require('../config/db');

const AlumniModel = {
  /**
   * Retrieves ALL users with the 'alumni' role, pulling their profile data 
   * (if it exists) and their dynamic project portfolio via LEFT JOINs.
   * * WHY: Excludes the 'image_data' binary column to prevent memory overload
   * and optimize bandwidth during list rendering.
   *
   * @returns {Promise<Array<object>>} List of all alumni with nested projects.
   * @throws {Error} If the database query fails.
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
      throw error; 
    }
  },

  /**
   * Upserts (Inserts or Updates) an alumni profile.
   * * WHY: Uses COALESCE to ensure existing binary image data is preserved if 
   * the client only sends text updates from the React form.
   *
   * @param {object} payload - The alumni profile data including binary buffers.
   * @returns {Promise<object>} The saved profile record.
   * @throws {Error} If the database query fails.
   */
  upsert: async ({ user_id, degree, specialty, video_url_embed, is_profile_public, imageData, imageMimetype }) => {
    try {
      const query = `
        INSERT INTO alumni_profiles 
        (user_id, degree, specialty, video_url_embed, is_profile_public, image_data, image_mimetype)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          degree = EXCLUDED.degree,
          specialty = EXCLUDED.specialty,
          video_url_embed = EXCLUDED.video_url_embed,
          is_profile_public = EXCLUDED.is_profile_public,
          image_data = COALESCE(EXCLUDED.image_data, alumni_profiles.image_data),
          image_mimetype = COALESCE(EXCLUDED.image_mimetype, alumni_profiles.image_mimetype)
        RETURNING user_id, degree, specialty;
      `;
      const values = [
        user_id, 
        degree, 
        specialty, 
        video_url_embed, 
        is_profile_public,
        imageData,
        imageMimetype
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
   * @throws {Error} If the database query fails.
   */
  delete: async (id) => {
    try {
      const query = 'DELETE FROM alumni_profiles WHERE user_id = $1 RETURNING user_id;';
      const { rows } = await pool.query(query, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`[ERROR] Failed to delete alumni profile for user_id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Retrieves exclusively the binary image data for a specific alumni profile.
   *
   * @param {number|string} id - The unique identifier of the user account.
   * @returns {Promise<object|null>} Object containing binary buffer and mimetype.
   * @throws {Error} If the database query fails.
   */
  getImage: async (id) => {
    try {
      const query = 'SELECT image_data, image_mimetype FROM alumni_profiles WHERE user_id = $1;';
      const { rows } = await pool.query(query, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`[ERROR] Failed to fetch image for alumni ID ${id}:`, error);
      throw error;
    }
  }
};

module.exports = AlumniModel;