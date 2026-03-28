/**
 * @file userModel.js
 * @description
 * Data Access Object (DAO) for the 'users' entity.
 * * Responsibilities:
 * - Manages read and write database queries for user accounts.
 * - Dynamically joins extended profiles based on user roles.
 * - Safely handles binary image routing for the frontend tunnel.
 */
const pool = require('../config/db');

const UserModel = {
  /**
   * Retrieves all registered users in the system, explicitly excluding passwords.
   *
   * @returns {Promise<Array<object>>} An array of user profile objects.
   * @throws {Error} If a database query error occurs.
   */
  getAll: async () => {
    try {
      // Security: We never return the password_hash in a general query
      const query = 'SELECT id, full_name, email, role FROM users ORDER BY full_name ASC;';
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error('[ERROR] Failed to fetch all users from database:', error);
      throw error;
    }
  },

  /**
   * Retrieves a user by their email address. Includes the password hash for authentication.
   */
  getByEmail: async (email) => {
    try {
      const query = 'SELECT * FROM users WHERE email = $1;';
      const { rows } = await pool.query(query, [email]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`[ERROR] Failed to fetch user by email:`, error);
      throw error;
    }
  },

  /**
   * Retrieves a list of users filtered by a specific role.
   *
   * @param {string} roleName - The target role to filter by.
   * @returns {Promise<Array<object>>} An array of users matching the role.
   * @throws {Error} If a database query error occurs.
   */
  getByRole: async (roleName) => {
    try {
      const query = 'SELECT id, full_name, email FROM users WHERE role = $1 ORDER BY full_name ASC;';
      const { rows } = await pool.query(query, [roleName]);
      return rows;
    } catch (error) {
      console.error(`[ERROR] Failed to fetch users with role ${roleName}:`, error);
      throw error;
    }
  },

  /**
   * Deletes a user account from the system by their ID.
   *
   * @param {number|string} userId - The unique ID of the user to delete.
   * @returns {Promise<boolean>} True if successfully deleted, false if the user did not exist.
   * @throws {Error} If a database query error occurs.
   */
  deleteById: async (userId) => {
    try {
      const query = 'DELETE FROM users WHERE id = $1 RETURNING id;';
      const { rows } = await pool.query(query, [userId]);
      return rows.length > 0;
    } catch (error) {
      console.error(`[ERROR] Failed to delete user with ID ${userId}:`, error);
      throw error;
    }
  },
  
  /**
   * Updates a user's basic data by their ID.
   *
   * @param {number|string} userId - The ID of the user to edit.
   * @param {object} updateData - Data payload (full_name, email, role, passwordHash).
   * @returns {Promise<object|null>} The updated user object or null if not found.
   * @throws {Error} If a database query error occurs.
   */
  updateById: async (userId, updateData) => {
    const { full_name, email, role, passwordHash } = updateData;
    
    try {
      let query;
      let values;

      if (passwordHash) {
        query = `
          UPDATE users 
          SET full_name = $1, email = $2, role = $3, password_hash = $4 
          WHERE id = $5 
          RETURNING id, full_name, email, role;
        `;
        values = [full_name, email, role, passwordHash, userId];
      } else {
        query = `
          UPDATE users 
          SET full_name = $1, email = $2, role = $3 
          WHERE id = $4 
          RETURNING id, full_name, email, role;
        `;
        values = [full_name, email, role, userId];
      }

      const { rows } = await pool.query(query, values);
      return rows.length > 0 ? rows[0] : null; 
      
    } catch (error) {
      console.error(`[ERROR] Failed to update user with ID ${userId}:`, error);
      throw error;
    }
  },  

  /**
   * Updates a user's record and safely removes incompatible profiles if their role changes.
   */
  updateAccountAndCleanProfiles: async (id, fullName, email, role, passwordHash) => {
    const client = await pool.connect(); 

    try {
      await client.query('BEGIN');

      let updateQuery;
      let values;

      if (passwordHash) {
        updateQuery = `UPDATE users SET full_name = $1, email = $2, role = $3, password_hash = $4 WHERE id = $5 RETURNING id, full_name, email, role;`;
        values = [fullName, email, role, passwordHash, id];
      } else {
        updateQuery = `UPDATE users SET full_name = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, full_name, email, role;`;
        values = [fullName, email, role, id];
      }

      const result = await client.query(updateQuery, values);
      
      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return null; 
      }

      const updatedUser = result.rows[0];

      if (role === 'teacher') {
        await client.query('DELETE FROM alumni_profiles WHERE user_id = $1', [id]);
      } else if (role === 'alumni') {
        await client.query('DELETE FROM professors WHERE user_id = $1', [id]);
      } else if (role === 'admin') {
        await client.query('DELETE FROM alumni_profiles WHERE user_id = $1', [id]);
        await client.query('DELETE FROM professors WHERE user_id = $1', [id]);
      }

      await client.query('COMMIT');
      return updatedUser;

    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`[ERROR] Database transaction failed during user update for ID ${id}:`, error);
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Retrieves the unified profile of a user, merging basic auth data 
   * with extended profile data dynamically based on their role.
   * * WHY: Excludes image_data to prevent massive memory payloads.
   * * @param {number|string} userId - The unique user ID.
   * @returns {Promise<object|null>} The unified profile or null if not found.
   */
  getFullProfile: async (userId) => {
    try {
      const userQuery = 'SELECT id, full_name, email, role FROM users WHERE id = $1';
      const { rows: userRows } = await pool.query(userQuery, [userId]);

      if (userRows.length === 0) return null;

      const baseUser = userRows[0];
      let extendedProfile = {};

      if (baseUser.role === 'teacher') {
        const profQuery = 'SELECT degree, area FROM professors WHERE user_id = $1';
        const { rows: profRows } = await pool.query(profQuery, [userId]);
        if (profRows.length > 0) extendedProfile = profRows[0];
      } 
      else if (baseUser.role === 'alumni') {
        const alumniQuery = 'SELECT degree, specialty, is_profile_public FROM alumni_profiles WHERE user_id = $1';
        const { rows: alumniRows } = await pool.query(alumniQuery, [userId]);
        if (alumniRows.length > 0) extendedProfile = alumniRows[0];
      }

      return {
        ...baseUser,
        ...extendedProfile
      };

    } catch (error) {
      console.error(`[ERROR] Failed to fetch full profile for user ID ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Retrieves a basic list of valid authors (teachers and alumni).
   * * @returns {Promise<Array<object>>} List of eligible authors.
   */
  getAuthors: async () => {
    try {
      const query = "SELECT id, full_name, role FROM users WHERE role IN ('teacher', 'alumni') ORDER BY full_name ASC;";
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error("[ERROR] Failed to fetch authors list:", error);
      throw error;
    }
  },

  /**
   * Dynamically retrieves the binary image data for a user based on their role.
   * * WHY: Acts as a database router, querying the correct table (professors or alumni_profiles)
   * to serve the unified image endpoint.
   * * @param {number|string} userId - The unique user ID.
   * @returns {Promise<object|null>} Object with image_data and image_mimetype, or null.
   */
  getProfileImage: async (userId) => {
    try {
      const roleQuery = 'SELECT role FROM users WHERE id = $1;';
      const { rows: roleRows } = await pool.query(roleQuery, [userId]);

      if (roleRows.length === 0) return null;
      const role = roleRows[0].role;

      let imageQuery = '';
      if (role === 'teacher') {
        imageQuery = 'SELECT image_data, image_mimetype FROM professors WHERE user_id = $1;';
      } else if (role === 'alumni') {
        imageQuery = 'SELECT image_data, image_mimetype FROM alumni_profiles WHERE user_id = $1;';
      } else {
        return null; 
      }

      const { rows: imageRows } = await pool.query(imageQuery, [userId]);
      return imageRows.length > 0 ? imageRows[0] : null;

    } catch (error) {
      console.error(`[ERROR] Failed to fetch profile image for user ID ${userId}:`, error);
      throw error;
    }
  },
  setLoginCode: async (userId, code, expiresAt) => {
    try {
      const query = `UPDATE users SET login_code = $1, login_code_expires_at = $2 WHERE id = $3;`;
      await pool.query(query, [code, expiresAt, userId]);
      return true;
    } catch (error) {
      console.error(`[ERROR] Failed to set login code for user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene el código actual y su expiración para validarlo.
   */
  getLoginCode: async (userId) => {
    try {
      const query = `SELECT login_code, login_code_expires_at FROM users WHERE id = $1;`;
      const { rows } = await pool.query(query, [userId]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`[ERROR] Failed to get login code for user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Limpia el código de la base de datos una vez que se usó exitosamente.
   */
  clearLoginCode: async (userId) => {
    try {
      const query = `UPDATE users SET login_code = NULL, login_code_expires_at = NULL WHERE id = $1;`;
      await pool.query(query, [userId]);
      return true;
    } catch (error) {
      console.error(`[ERROR] Failed to clear login code for user ${userId}:`, error);
      throw error;
    }
  }
};

module.exports = UserModel;