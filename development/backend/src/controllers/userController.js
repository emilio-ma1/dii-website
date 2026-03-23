/**
 * @file userController.js
 * @description
 * Handles business logic for system user administration.
 * Adheres to Thin Controller architecture by delegating DB operations to UserModel.
 */
const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const AuditLogModel = require('../models/auditLogModel'); // Added Audit Trail

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
    // Explicit 200 HTTP status
    return res.status(200).json(usersList);
  } catch (error) {
    console.error('[ERROR] Failed to fetch users in controller:', error);
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
  
module.exports = { getAllUsers, getUsersByRole, deleteUser, updateUser };