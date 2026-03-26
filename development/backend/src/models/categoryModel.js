/**
 * @file categoryModel.js
 * @description
 * Data Access Object (DAO) for the 'categories' entity.
 * Manages database queries to retrieve research lines for projects.
 */
const pool = require('../config/db');

const CategoryModel = {
  /**
   * Retrieves all active categories ordered alphabetically by name.
   *
   * @returns {Promise<Array<object>>} An array containing the available categories.
   * @throws {Error} If a database error occurs during the query.
   */
  getAll: async () => {
    try {
      // Explicit column selection (avoiding SELECT *) and predictable ordering
      const query = 'SELECT id, name, description FROM categories ORDER BY name ASC;';
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error('[ERROR] Failed to fetch categories from database:', error);
      throw error; // Models throw errors, Controllers catch them
    }
  }
};

module.exports = CategoryModel;