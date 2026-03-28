/**
 * @file professorController.js
 * @description 
 * Thin controller for professor profiles management. 
 * * Responsibilities:
 * - Handle retrieving, upserting, and deleting teacher profiles.
 * - Intercept multipart FormData files via Multer for binary image storage.
 */
const ProfessorModel = require('../models/professorModel');
const AuditLogModel = require('../models/auditLogModel');

/**
 * Retrieves a list of all professor profiles.
 *
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @returns {Promise<object>} JSON response with the professors list.
 */
const getProfessors = async (req, res) => {
  try {
    const list = await ProfessorModel.getAll();
    return res.status(200).json(list);
  } catch (error) {
    console.error('[ERROR] Failed to fetch professors:', error); 
    return res.status(500).json({ message: 'Error interno al obtener los perfiles de docentes.' });
  }
};

/**
 * Handles both the creation and update of professor profiles (UPSERT) with file support.
 *
 * @param {object} req Express request object containing profile text data and binary file.
 * @param {object} res Express response object.
 * @returns {Promise<object>} JSON response with the saved profile status.
 */
const upsertProfessor = async (req, res) => {
  const { user_id, degree, area } = req.body;
  const adminId = req.user ? req.user.id : null;
  
  // Early return constraint [cite: 106]
  if (!user_id || !degree || !area) {
    return res.status(400).json({ message: 'El ID de usuario, grado y área son requeridos.' });
  }

  try {
    // Isolate binary buffer captured by multer middleware
    const imageData = req.file ? req.file.buffer : null;
    const imageMimetype = req.file ? req.file.mimetype : null;

    const savedProfile = await ProfessorModel.upsert({
      user_id, degree, area, imageData, imageMimetype
    });

    if (adminId) {
      await AuditLogModel.logAction(
        adminId, 'UPSERT', 'professors', savedProfile.user_id, 
        { degree: savedProfile.degree, area: savedProfile.area }
      );
    }

    return res.status(200).json(savedProfile);
  } catch (error) {
    console.error('[ERROR] Failed to upsert professor profile:', error);
    return res.status(500).json({ message: 'Error interno al guardar el perfil del docente.' });
  }
};

/**
 * Deletes a professor profile based on their user ID.
 *
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @returns {Promise<object>} JSON response confirming the deletion.
 */
const deleteProfessor = async (req, res) => {
  const { id } = req.params; 
  const adminId = req.user ? req.user.id : null;

  try {
    const deleted = await ProfessorModel.delete(id);
    
    if (!deleted) {
        return res.status(404).json({ message: 'Perfil de docente no encontrado.' });
    }

    if (adminId) {
      await AuditLogModel.logAction(
        adminId, 'DELETE', 'professors', id, { deleted_at: new Date().toISOString() }
      );
    }

    return res.status(200).json({ message: 'Perfil de docente eliminado exitosamente.' });
  } catch (error) {
    console.error(`[ERROR] Failed to delete professor profile for user_id ${id}:`, error);
    return res.status(500).json({ message: 'Error interno al eliminar el perfil.' });
  }
};

/**
 * Serves the binary image file for a specific professor.
 * * WHY: Dedicated endpoint to bypass CORS and properly set MIME headers 
 * for raw binary stream rendering in the browser.
 *
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @returns {Promise<Buffer|object>} Binary buffer or JSON error.
 */
const getProfessorImage = async (req, res) => {
  const { id } = req.params;
  try {
    const professor = await ProfessorModel.getImage(id);
    
    if (!professor || !professor.image_data) {
      return res.status(404).json({ message: 'Imagen no encontrada.' });
    }

    res.set('Content-Type', professor.image_mimetype);
    res.set('Cross-Origin-Resource-Policy', 'cross-origin'); 
    
    return res.send(professor.image_data);
  } catch (error) {
    console.error(`[ERROR] Controller failed to serve image for professor ID ${id}:`, error);
    return res.status(500).json({ message: 'Error interno al obtener la imagen.' });
  }
};

module.exports = { 
  getProfessors, 
  upsertProfessor, 
  deleteProfessor,
  getProfessorImage
};