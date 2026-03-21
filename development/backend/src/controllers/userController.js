/**
 * @file Controlador de Usuarios (userController).
 * @description
 * Gestiona la lógica de negocio para la administración de usuarios del sistema.
 * Conecta las rutas HTTP con las consultas a la base de datos (UserModel).
 */
const UserModel = require('../models/userModel');
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
/**
 * Obtiene la lista completa de usuarios registrados.
 *
 * @param {object} req - Objeto de petición HTTP.
 * @param {object} res - Objeto de respuesta HTTP.
 * @returns {object} Respuesta JSON con el listado de usuarios (Status 200) o un error 500.
 */
const getAllUsers = async (req, res) => {
  try {
    const usersList = await UserModel.getAll();
    return res.json(usersList);
  } catch (error) {
    // Trazas técnicas
    console.error('[ERROR] Failed to fetch users in controller:', error);
    return res.status(500).json({ message: 'Error interno del servidor al obtener la lista de usuarios.' });
  }
};

/**
 * Obtiene una lista de usuarios filtrada por su rol específico.
 *
 * @param {object} req - Objeto de petición HTTP (contiene el 'roleName' en req.params).
 * @param {object} res - Objeto de respuesta HTTP.
 * @returns {object} Respuesta JSON con los usuarios filtrados.
 */
const getUsersByRole = async (req, res) => {
  const { roleName } = req.params;

  // Retorno temprano: Validación del parámetro
  if (!roleName) {
    return res.status(400).json({ message: 'El parámetro de rol es obligatorio para filtrar.' });
  }

  try {
    const usersByRole = await UserModel.getByRole(roleName);
    return res.json(usersByRole);
  } catch (error) {
    console.error(`[ERROR] Failed to fetch users by role (${roleName}) in controller:`, error);
    return res.status(500).json({ message: 'Error interno del servidor al filtrar los usuarios.' });
  }
};

/**
 * Elimina un usuario del sistema por su ID.
 * Implementa una validación de seguridad para evitar que un admin se elimine a sí mismo.
 *
 * @param {object} req - Objeto de petición HTTP (contiene el 'id' a eliminar y datos de sesión en req.user).
 * @param {object} res - Objeto de respuesta HTTP.
 * @returns {object} Respuesta JSON confirmando la eliminación o un error 400/404/500.
 */
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    //Evitar el "suicidio" de cuenta del administrador activo
    if (req.user && req.user.id === parseInt(id, 10)) {
       return res.status(400).json({ message: 'Acción denegada: No puedes eliminar tu propia cuenta de administrador.' });
    }

    const isDeleted = await UserModel.deleteById(id);

    // Retorno temprano: Si el modelo devuelve falso, el usuario no existía
    if (!isDeleted) {
      return res.status(404).json({ message: 'El usuario solicitado no existe o ya fue eliminado.' });
    }

    return res.json({ message: 'Usuario eliminado exitosamente del sistema.' });
  } catch (error) {
    console.error(`[ERROR] Failed to delete user with ID ${id} in controller:`, error);
    return res.status(500).json({ message: 'Error interno del servidor al eliminar el usuario.' });
  }
};

/**
 * Actualiza un usuario del sistema por su ID.
 */
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { full_name, email, role, password } = req.body;
  const client = await pool.connect(); 

  try {
    await client.query('BEGIN');

    let passwordHash = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
    }
    let updateQuery;
    let values;
    if (passwordHash) {
      updateQuery = `UPDATE users SET full_name = $1, email = $2, role = $3, password_hash = $4 WHERE id = $5 RETURNING id, full_name, email, role;`;
      values = [full_name, email, role, passwordHash, id];
    } else {
      updateQuery = `UPDATE users SET full_name = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, full_name, email, role;`;
      values = [full_name, email, role, id];
    }

    const result = await client.query(updateQuery, values);
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    const updatedUser = result.rows[0];

    if (role === 'teacher') {
      await client.query('DELETE FROM alumni_profiles WHERE user_id = $1', [id]);
      await client.query(`
        INSERT INTO professors (user_id, full_name) VALUES ($1, $2) 
        ON CONFLICT (user_id) DO UPDATE SET full_name = EXCLUDED.full_name;
      `, [id, full_name]);
      
    } else if (role === 'alumni') {
      await client.query('DELETE FROM professors WHERE user_id = $1', [id]);
      await client.query(`
        INSERT INTO alumni_profiles (user_id) VALUES ($1) 
        ON CONFLICT (user_id) DO NOTHING;
      `, [id]);
      
    } else if (role === 'admin') {
      await client.query('DELETE FROM alumni_profiles WHERE user_id = $1', [id]);
      await client.query('DELETE FROM professors WHERE user_id = $1', [id]);
    }

    await client.query('COMMIT');
    return res.json({ message: 'Usuario actualizado y reasignado exitosamente.', user: updatedUser });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`[ERROR] Failed to update user with ID ${id}:`, error);
    return res.status(500).json({ message: 'Error al actualizar.' });
  } finally {
    client.release();
  }
};
  
module.exports = { getAllUsers, getUsersByRole, deleteUser, updateUser };