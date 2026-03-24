/**
 * @file userModel.js
 * @description
 * Data Access Object (DAO) for the 'users' entity.
 * Manages read and write database queries for user accounts.
 * Does not handle authentication logic (that belongs to authController), only data access.
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
   * Retrieves a list of users filtered by a specific role.
   * Ideal for populating frontend dropdowns (e.g., listing only 'teacher' or 'alumni').
   *
   * @param {string} roleName - The target role to filter by ('admin', 'teacher', 'alumni').
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
      
      // Early return validating if the row actually existed and was deleted
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

      // If a new passwordHash is provided, update the password as well
      if (passwordHash) {
        query = `
          UPDATE users 
          SET full_name = $1, email = $2, role = $3, password_hash = $4 
          WHERE id = $5 
          RETURNING id, full_name, email, role;
        `;
        values = [full_name, email, role, passwordHash, userId];
      } else {
        // If no passwordHash is provided, leave the password intact
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
   * Does NOT automatically create public profiles.
   * Executes within a transaction to guarantee data integrity.
   *
   * @param {number|string} id - The user ID.
   * @param {string} fullName - The user's full name.
   * @param {string} email - The user's email address.
   * @param {string} role - The assigned role ('admin', 'teacher', 'alumni').
   * @param {string|null} passwordHash - The encrypted password, if provided.
   * @returns {Promise<object|null>} The updated user object or null if not found.
   * @throws {Error} If the database transaction fails.
   */
  updateAccountAndCleanProfiles: async (id, fullName, email, role, passwordHash) => {
    const client = await pool.connect(); 

    try {
      await client.query('BEGIN');

      let updateQuery;
      let values;

      // Update ONLY the 'users' table
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

      // Clean up legacy profiles based on the newly assigned role
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
  }
};

module.exports = UserModel;