/**
 * @file Modelo de Categorías (categoryModel).
 * @description
 * Gestiona las consultas a la base de datos para la entidad 'categories'.
 * Proporciona el listado de líneas de investigación para los proyectos.
 */
const pool = require('../config/db');

const CategoryModel = {
  /**
   * Obtiene todas las categorías activas ordenadas alfabéticamente.
   *
   * @returns {Promise<Array>} Un arreglo con las categorías disponibles.
   * @throws {Error} Si ocurre un error en la base de datos.
   */
  getAll: async () => {
    try {
      const query = 'SELECT id, name, description FROM categories ORDER BY name ASC;';
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error('[ERROR] Failed to fetch categories from database:', error);
      throw error;
    }
  }
};

module.exports = CategoryModel;