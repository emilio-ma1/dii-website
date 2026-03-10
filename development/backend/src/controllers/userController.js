/**
 * @file Controlador de Usuarios (userController).
 * @description
 * Gestiona la lógica de negocio para la administración de usuarios del sistema.
 * Conecta las rutas HTTP con las consultas a la base de datos (UserModel).
 */
const UserModel = require('../models/userModel');

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

module.exports = { getAllUsers, getUsersByRole, deleteUser };