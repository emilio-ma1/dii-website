/**
 * @file userController.js
 * @description
 * Handles business logic for system user administration.
 * * Responsibilities:
 * - Acts strictly as a Thin Controller, delegating all database queries to UserModel.
 * - Integrates Audit Trails for security.
 * - Serves binary profile images routing to the appropriate role table.
 */
const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const AuditLogModel = require('../models/auditLogModel');

/**
 * Fetches the complete list of registered users.
 *
 * @param {object} req Express HTTP request object.
 * @param {object} res Express HTTP response object.
 * @returns {Promise<object>} JSON response with the user list.
 */
const getAllUsers = async (req, res) => {
  try {
    const usersList = await UserModel.getAll();
    return res.status(200).json(usersList);
  } catch (error) {
    console.error('[ERROR] Failed to fetch all users:', error);
    return res.status(500).json({ message: 'Error interno al obtener la lista de usuarios.' });
  }
};

/**
 * Fetches a list of users filtered by their specific role.
 *
 * @param {object} req Express HTTP request object.
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
    console.error(`[ERROR] Failed to fetch users by role (${roleName}):`, error);
    return res.status(500).json({ message: 'Error interno al filtrar los usuarios.' });
  }
};

/**
 * Deletes a user from the system by their ID.
 * Prevents an active admin from deleting their own account.
 *
 * @param {object} req Express HTTP request object.
 * @param {object} res Express HTTP response object.
 * @returns {Promise<object>} JSON response confirming deletion.
 */
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Security check: Prevent admin self-deletion
    if (req.user && req.user.id === parseInt(id, 10)) {
       return res.status(400).json({ message: 'Acción denegada: No puedes eliminar tu propia cuenta.' });
    }

    const isDeleted = await UserModel.deleteById(id);

    if (!isDeleted) {
      return res.status(404).json({ message: 'El usuario no existe o ya fue eliminado.' });
    }

    if (req.user && req.user.id) {
      await AuditLogModel.logAction(req.user.id, 'DELETE', 'users', id, { deleted_at: new Date().toISOString() });
    }

    return res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
  } catch (error) {
    console.error(`[ERROR] Failed to delete user ID ${id}:`, error);
    return res.status(500).json({ message: 'Error interno al eliminar el usuario.' });
  }
};

/**
 * Updates a user's basic information and reassigns roles.
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

    const updatedUser = await UserModel.updateAccountAndCleanProfiles(id, full_name, email, role, passwordHash);

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    if (req.user && req.user.id) {
      await AuditLogModel.logAction(req.user.id, 'UPDATE', 'users', id, { role_assigned: updatedUser.role });
    }

    return res.status(200).json({ message: 'Usuario actualizado exitosamente.', user: updatedUser });
  } catch (error) {
    console.error(`[ERROR] Failed to update user ID ${id}:`, error);
    return res.status(500).json({ message: 'Error al actualizar el usuario.' });
  }
};

/**
 * Retrieves the unified profile of the currently authenticated user.
 * * WHY: Delegated SQL JOIN logic to the Model.
 */
const getCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    
    const unifiedProfile = await UserModel.getFullProfile(userId);

    if (!unifiedProfile) {
      return res.status(404).json({ message: "Usuario no encontrado en el sistema." });
    }

    return res.status(200).json(unifiedProfile);
  } catch (error) {
    console.error("[ERROR] Failed to fetch current user profile:", error);
    return res.status(500).json({ message: "Error interno al obtener el perfil." });
  }
};

/**
 * Retrieves a basic list of valid authors for form population.
 */
const getAuthorsList = async (req, res) => {
  try {
    const authors = await UserModel.getAuthors();
    return res.status(200).json(authors);
  } catch (error) {
    console.error("[ERROR] Failed to fetch authors list:", error);
    return res.status(500).json({ message: "Error interno al cargar la lista de autores." });
  }
};

/**
 * Serves the binary image file for a user dynamically resolving their role.
 * * WHY: This acts as the universal tunnel for the Sidebar and top navigation bar.
 */
const getUserImage = async (req, res) => {
  const targetId = req.params.id === 'me' ? req.user.id : req.params.id;

  try {
    const imageData = await UserModel.getProfileImage(targetId);
    
    if (!imageData || !imageData.image_data) {
      return res.status(404).json({ message: 'Imagen no encontrada.' });
    }

    res.set('Content-Type', imageData.image_mimetype);
    res.set('Cross-Origin-Resource-Policy', 'cross-origin'); 
    
    return res.send(imageData.image_data);
  } catch (error) {
    console.error(`[ERROR] Failed to serve image for user ID ${targetId}:`, error);
    return res.status(500).json({ message: 'Error interno al obtener la imagen.' });
  }
};

module.exports = { 
  getAllUsers, 
  getUsersByRole, 
  deleteUser, 
  updateUser, 
  getCurrentUserProfile, 
  getAuthorsList,
  getUserImage
};