/**
 * @file Modelo de Usuarios (userModel).
 * @description
 * Gestiona las consultas de lectura y manipulación de datos para la entidad 'users'.
 * No maneja lógica de autenticación (eso pertenece a authController), solo accesos a datos.
 */
const pool = require('../config/db');

const UserModel = {
  /**
   * Obtiene todos los usuarios registrados en el sistema, excluyendo contraseñas.
   *
   * @returns {Promise<Array>} Un arreglo con los perfiles de los usuarios.
   * @throws {Error} Si ocurre un problema con la consulta SQL.
   */
  getAll: async () => {
    try {
      // Jamás devolvemos el password_hash en una consulta general por seguridad
      const query = 'SELECT id, full_name, email, role FROM users ORDER BY full_name ASC;';
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error('[ERROR] Failed to fetch all users from database:', error);
      throw error;
    }
  },

  /**
   * Obtiene una lista de usuarios filtrada por su rol específico.
   * Ideal para poblar selectores en el frontend (ej. listar solo 'profesor').
   *
   * @param {string} roleName - El nombre del rol a filtrar ('admin', 'profesor', 'egresado').
   * @returns {Promise<Array>} Un arreglo de usuarios que coinciden con el rol.
   * @throws {Error} Si ocurre un problema con la consulta SQL.
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
   * Elimina un usuario del sistema por su ID.
   *
   * @param {number|string} userId - El ID único del usuario a eliminar.
   * @returns {Promise<boolean>} Verdadero si se eliminó correctamente, falso si no existía.
   * @throws {Error} Si ocurre un problema con la consulta SQL.
   */
  deleteById: async (userId) => {
    try {
      const query = 'DELETE FROM users WHERE id = $1 RETURNING id;';
      const { rows } = await pool.query(query, [userId]);
      
      // Early return validando si la fila realmente existía y fue borrada
      return rows.length > 0;
    } catch (error) {
      console.error(`[ERROR] Failed to delete user with ID ${userId}:`, error);
      throw error;
    }
  }
};

module.exports = UserModel;