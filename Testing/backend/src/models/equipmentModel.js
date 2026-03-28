/**
 * @file equipmentModel.js
 * @description
 * Data Access Object (DAO) for the 'equipment' entity.
 * * Responsibilities:
 * - Execute CRUD operations for equipment records in the PostgreSQL database.
 * - Handle binary file storage (BYTEA) for equipment images efficiently.
 * * Out of Scope:
 * - Business logic or request validation.
 */
const pool = require('../config/db');

const EquipmentModel = {
  /**
   * Retrieves all equipment records from the database.
   * Excludes the 'image_data' binary column to prevent memory overload
   * when fetching large lists of equipment.
   *
   * @returns {Promise<Array<object>>} An array of equipment objects.
   * @throws {Error} If the database query fails.
   */
  getAll: async () => {
    try {
      const query = `
        SELECT id, name, description 
        FROM equipment 
        ORDER BY id DESC;
      `;
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error('[ERROR] Failed to fetch all equipment from database:', error);
      throw error;
    }
  },

  /**
   * Inserts a new equipment record into the database, including its binary image.
   *
   * @param {string} name The name of the equipment.
   * @param {string|null} description A brief description of the equipment.
   * @param {Buffer|null} imageData The binary buffer of the image.
   * @param {string|null} imageMimetype The MIME type of the image file.
   * @returns {Promise<object>} The newly created equipment record (excluding binary data).
   * @throws {Error} If the database insertion fails.
   */
  create: async (name, description, imageData, imageMimetype) => {
    try {
      const query = `
        INSERT INTO equipment (name, description, image_data, image_mimetype)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, description;
      `;
      const values = [name, description, imageData, imageMimetype];
      
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('[ERROR] Failed to insert equipment into database:', error);
      throw error;
    }
  },

  /**
   * Updates an existing equipment record in the database.
   * Uses the COALESCE function for image fields to ensure that existing binary
   * data is not overwritten with NULL if the user updates only text fields.
   *
   * @param {number|string} id The unique identifier of the equipment to update.
   * @param {string} name The updated name of the equipment.
   * @param {string|null} description The updated description.
   * @param {Buffer|null} imageData The new binary buffer of the image, or null to keep the existing one.
   * @param {string|null} imageMimetype The new MIME type, or null to keep the existing one.
   * @returns {Promise<object|null>} The updated equipment record, or null if not found.
   * @throws {Error} If the database update fails.
   */
  update: async (id, name, description, imageData, imageMimetype) => {
    try {
      const query = `
        UPDATE equipment 
        SET 
          name = $1, 
          description = $2, 
          image_data = COALESCE($3, image_data),
          image_mimetype = COALESCE($4, image_mimetype)
        WHERE id = $5
        RETURNING id, name, description;
      `;
      const values = [name, description, imageData, imageMimetype, id];
      const { rows } = await pool.query(query, values);
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`[ERROR] Failed to update equipment ID ${id} in database:`, error);
      throw error;
    }
  },

  /**
   * Deletes an equipment record from the database.
   *
   * @param {number|string} id The unique identifier of the equipment to delete.
   * @returns {Promise<object|null>} The deleted equipment record ID and name, or null if not found.
   * @throws {Error} If the database deletion fails.
   */
  delete: async (id) => {
    try {
      const query = 'DELETE FROM equipment WHERE id = $1 RETURNING id, name;';
      const { rows } = await pool.query(query, [id]);
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`[ERROR] Failed to delete equipment ID ${id} from database:`, error);
      throw error;
    }
  },

  /**
   * Retrieves exclusively the binary image data and its MIME type for a specific equipment.
   * This is separated from getAll to optimize bandwidth and memory usage
   * when rendering text-only views.
   *
   * @param {number|string} id The unique identifier of the equipment.
   * @returns {Promise<object|null>} An object containing image_data and image_mimetype, or null if not found.
   * @throws {Error} If the database query fails.
   */
  getImage: async (id) => {
    try {
      const query = 'SELECT image_data, image_mimetype FROM equipment WHERE id = $1;';
      const { rows } = await pool.query(query, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`[ERROR] Failed to fetch image for equipment ID ${id}:`, error);
      throw error;
    }
  }
};

module.exports = EquipmentModel;