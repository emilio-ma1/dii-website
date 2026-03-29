/**
 * @file contactModel.js
 * @description 
 * Data Access Object (DAO) for the 'contacts' entity.
 * * Responsibilities:
 * - Execute CRUD operations for department contacts in the PostgreSQL database.
 * - Isolate database queries from the business logic.
 */
const pool = require('../config/db');

const ContactModel = {
  /**
   * Retrieves all contact records from the database.
   * * WHY: To populate the public directory dynamically on the frontend without
   * hardcoding values in the React components.
   *
   * @returns {Promise<Array<object>>} An array of contact objects.
   * @throws {Error} If the database query fails.
   */
  getAll: async () => {
    try {
      const query = 'SELECT id, initials, full_name, role FROM contacts ORDER BY id ASC;';
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error('[ERROR] Failed to fetch contacts from database:', error);
      throw error;
    }
  },

  /**
   * Inserts a new contact record into the database.
   *
   * @param {string} initials The initials of the contact (e.g., 'SS').
   * @param {string} fullName The full name of the contact.
   * @param {string} role The job title or role in the department.
   * @returns {Promise<object>} The newly created contact record.
   * @throws {Error} If the database insertion fails.
   */
  create: async (initials, fullName, role) => {
    try {
      const query = `
        INSERT INTO contacts (initials, full_name, role)
        VALUES ($1, $2, $3)
        RETURNING id, initials, full_name, role;
      `;
      const values = [initials, fullName, role];
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('[ERROR] Failed to insert contact into database:', error);
      throw error;
    }
  },

  /**
   * Updates an existing contact record.
   *
   * @param {number|string} id The unique identifier of the contact.
   * @param {string} initials The updated initials.
   * @param {string} fullName The updated full name.
   * @param {string} role The updated role.
   * @returns {Promise<object|null>} The updated record, or null if not found.
   * @throws {Error} If the database update fails.
   */
  update: async (id, initials, fullName, role) => {
    try {
      const query = `
        UPDATE contacts 
        SET initials = $1, full_name = $2, role = $3
        WHERE id = $4
        RETURNING id, initials, full_name, role;
      `;
      const values = [initials, fullName, role, id];
      const { rows } = await pool.query(query, values);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`[ERROR] Failed to update contact ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletes a contact record from the database.
   *
   * @param {number|string} id The unique identifier of the contact.
   * @returns {Promise<object|null>} The deleted record ID, or null if not found.
   * @throws {Error} If the database deletion fails.
   */
  delete: async (id) => {
    try {
      const query = 'DELETE FROM contacts WHERE id = $1 RETURNING id;';
      const { rows } = await pool.query(query, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`[ERROR] Failed to delete contact ID ${id}:`, error);
      throw error;
    }
  }
};

module.exports = ContactModel;