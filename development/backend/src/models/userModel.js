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
  },
  
  /**
   * Actualiza los datos de un usuario por su ID.
   *
   * @param {number|string} userId - El ID del usuario a editar.
   * @param {object} updateData - Datos a actualizar (full_name, email, role, passwordHash).
   * @returns {Promise<object|null>} El usuario actualizado o null si no existe.
   * @throws {Error} Si ocurre un problema con la consulta SQL.
   */
  updateById: async (userId, updateData) => {
    const { full_name, email, role, passwordHash } = updateData;
    
    try {
      let query;
      let values;

      // Si viene un nuevo passwordHash, actualizamos la contraseña también
      if (passwordHash) {
        query = `
          UPDATE users 
          SET full_name = $1, email = $2, role = $3, password_hash = $4 
          WHERE id = $5 
          RETURNING id, full_name, email, role;
        `;
        values = [full_name, email, role, passwordHash, userId];
      } else {
        // Si no hay passwordHash, dejamos la contraseña intacta
        query = `
          UPDATE users 
          SET full_name = $1, email = $2, role = $3 
          WHERE id = $4 
          RETURNING id, full_name, email, role;
        `;
        values = [full_name, email, role, userId];
      }

      const { rows } = await pool.query(query, values);
      return rows.length > 0 ? rows[0] : null; // Retorna el usuario o null si no lo halló
      
    } catch (error) {
      console.error(`[ERROR] Failed to update user with ID ${userId}:`, error);
      throw error;
    }
  },  

  /**
     * Actualiza el registro de un usuario y elimina perfiles incompatibles si cambia su rol.
     * NO crea perfiles públicos automáticamente.
     *
     * @param {number|string} id - ID del usuario.
     * @param {string} fullName - Nombre completo del usuario.
     * @param {string} email - Correo del usuario.
     * @param {string} role - Rol asignado (admin, teacher, alumni).
     * @param {string|null} passwordHash - Contraseña encriptada, si se proporcionó.
     * @returns {Promise<object|null>} Objeto del usuario actualizado o null.
     * @throws {Error} Si falla la transacción en la base de datos.
     */
    updateAccountAndCleanProfiles: async (id, fullName, email, role, passwordHash) => {
      const client = await pool.connect(); 

      try {
        await client.query('BEGIN');

        let updateQuery;
        let values;

        //Actualizamos SOLO la tabla 'users'
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

        //Limpieza de perfiles antiguos
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