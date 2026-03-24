/**
 * @file userController.js
 * @description
 * Handles business logic for system user administration.
 * Integrates Audit Trails for security and handles profile retrieval.
 * NOTE: Some newer profile retrieval methods use direct DB queries (pool) 
 * which should eventually be refactored into the UserModel to strictly adhere 
 * to the Thin Controller architecture.
 */
const pool = require('../config/db');
const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const AuditLogModel = require('../models/auditLogModel'); // Audit Trail

/**
 * Fetches the complete list of registered users.
 *
 * @param {object} req Express HTTP request object.
 * @param {object} res Express HTTP response object.
 * @returns {Promise<object>} JSON response with the user list or an error message.
 */
const getAllUsers = async (req, res) => {
  try {
    const usersList = await UserModel.getAll();
    return res.status(200).json(usersList);
  } catch (error) {
    console.error('[ERROR] Failed to fetch all users in controller:', error);
    return res.status(500).json({ message: 'Error interno del servidor al obtener la lista de usuarios.' });
  }
};

/**
 * Fetches a list of users filtered by their specific role.
 *
 * @param {object} req Express HTTP request object (contains 'roleName' in params).
 * @param {object} res Express HTTP response object.
 * @returns {Promise<object>} JSON response with the filtered users.
 */
const getUsersByRole = async (req, res) => {
  const { roleName } = req.params;

  if (!roleName) {
    return res.status(400).json({ message: 'El parámetro de rol es obligatorio para filtrar.' });
  }

  try {
    const usersByRole = await UserModel.getByRole(roleName);
    return res.status(200).json(usersByRole);
  } catch (error) {
    console.error(`[ERROR] Failed to fetch users by role (${roleName}) in controller:`, error);
    return res.status(500).json({ message: 'Error interno del servidor al filtrar los usuarios.' });
  }
};

/**
 * Deletes a user from the system by their ID.
 * Prevents an active admin from deleting their own account.
 *
 * @param {object} req Express HTTP request object.
 * @param {object} res Express HTTP response object.
 * @returns {Promise<object>} JSON response confirming deletion or an error code.
 */
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Security check: Prevent admin self-deletion
    if (req.user && req.user.id === parseInt(id, 10)) {
       return res.status(400).json({ message: 'Acción denegada: No puedes eliminar tu propia cuenta de administrador.' });
    }

    const isDeleted = await UserModel.deleteById(id);

    if (!isDeleted) {
      return res.status(404).json({ message: 'El usuario solicitado no existe o ya fue eliminado.' });
    }

    // Inject Audit Log for traceability
    if (req.user && req.user.id) {
      await AuditLogModel.logAction(
        req.user.id,
        'DELETE',
        'users',
        id,
        { deleted_at: new Date().toISOString() }
      );
    }

    return res.status(200).json({ message: 'Usuario eliminado exitosamente del sistema.' });
  } catch (error) {
    console.error(`[ERROR] Failed to delete user with ID ${id} in controller:`, error);
    return res.status(500).json({ message: 'Error interno del servidor al eliminar el usuario.' });
  }
};

/**
 * Updates a user's basic information and reassigns roles.
 *
 * @param {object} req Express HTTP request object.
 * @param {object} res Express HTTP response object.
 * @returns {Promise<object>} JSON response with updated user data.
 */
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { full_name, email, role, password } = req.body;

  try {
    let passwordHash = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
    }

    // Delegate transaction to the model
    const updatedUser = await UserModel.updateAccountAndCleanProfiles(id, full_name, email, role, passwordHash);

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Inject Audit Log for traceability
    if (req.user && req.user.id) {
      await AuditLogModel.logAction(
        req.user.id,
        'UPDATE',
        'users',
        id,
        { role_assigned: updatedUser.role, email: updatedUser.email }
      );
    }

    return res.status(200).json({ message: 'Usuario actualizado exitosamente.', user: updatedUser });
  } catch (error) {
    console.error(`[ERROR] Failed to update user with ID ${id}:`, error);
    return res.status(500).json({ message: 'Error al actualizar el usuario.' });
  }
};

/**
 * Retrieves the unified profile of the currently authenticated user.
 * Merges basic auth data with extended profile data (professors or alumni_profiles) dynamically.
 *
 * @param {object} req Express HTTP request object.
 * @param {object} res Express HTTP response object.
 * @returns {Promise<object>} JSON response containing the unified user profile.
 */
const getCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; 

    const userQuery = 'SELECT id, full_name, email, role FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado en el sistema." });
    }

    const baseUser = userResult.rows[0];
    let extendedProfile = {};

    if (baseUser.role === 'teacher') {
      const profQuery = 'SELECT degree, area, image_url FROM professors WHERE user_id = $1';
      const profResult = await pool.query(profQuery, [userId]);
      if (profResult.rows.length > 0) {
        extendedProfile = profResult.rows[0];
      }
    } 
    else if (baseUser.role === 'alumni') {
      const alumniQuery = 'SELECT degree, specialty, image_url, is_profile_public FROM alumni_profiles WHERE user_id = $1';
      const alumniResult = await pool.query(alumniQuery, [userId]);
      if (alumniResult.rows.length > 0) {
        extendedProfile = alumniResult.rows[0];
      }
    }

    return res.status(200).json({
      id: baseUser.id,
      full_name: baseUser.full_name,
      email: baseUser.email,
      role: baseUser.role,
      ...extendedProfile
    });

  } catch (error) {
    console.error("[ERROR] Failed to fetch current user profile in controller:", error);
    return res.status(500).json({ message: "Error interno del servidor al obtener el perfil." });
  }
};

/**
 * Retrieves a basic list of valid authors (teachers and alumni) for form population.
 *
 * @param {object} req Express HTTP request object.
 * @param {object} res Express HTTP response object.
 * @returns {Promise<object>} JSON response with an array of eligible authors.
 */
const getAuthorsList = async (req, res) => {
  try {
    const query = "SELECT id, full_name, role FROM users WHERE role IN ('teacher', 'alumni')";
    const result = await pool.query(query);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("[ERROR] Failed to fetch authors list in controller:", error);
    return res.status(500).json({ message: "Error interno al cargar la lista de autores." });
  }
};

module.exports = { 
  getAllUsers, 
  getUsersByRole, 
  deleteUser, 
  updateUser, 
  getCurrentUserProfile, 
  getAuthorsList 
};