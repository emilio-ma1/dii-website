/**
 * @file professorController.js
 * @description 
 * Thin controller for professor profiles management. 
 * Handles retrieving, creating/updating (upserting), and deleting teacher profiles.
 */
const ProfessorModel = require('../models/professorModel');
const AuditLogModel = require('../models/auditLogModel'); // Added Audit Trail

/**
 * Retrieves a list of all professor profiles.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<object>} JSON response with the professors list.
 */
const getProfessors = async (req, res) => {
  try {
    const list = await ProfessorModel.getAll();
    return res.status(200).json(list);
  } catch (error) {
    // Technical logs in English
    console.error('[ERROR] Failed to fetch professors:', error); 
    // User-facing messages in Spanish
    return res.status(500).json({ message: 'Error interno al obtener los perfiles de docentes.' });
  }
};

/**
 * Handles both the creation and update of professor profiles (UPSERT).
 *
 * @param {object} req - Express request object containing profile data.
 * @param {object} res - Express response object.
 * @returns {Promise<object>} JSON response with the saved profile data.
 */
const upsertProfessor = async (req, res) => {
  const { user_id, degree, area, image_url } = req.body;
  
  // Explicit input validation
  if (!user_id || !degree || !area) {
    return res.status(400).json({ message: 'El ID de usuario, grado y área son campos requeridos.' });
  }

  try {
    const profileData = { user_id, degree, area, image_url: image_url || null };
    const savedProfile = await ProfessorModel.upsert(profileData);

    // Inject Audit Log for traceability
    if (req.user && req.user.id) {
      await AuditLogModel.logAction(
        req.user.id,
        'UPSERT',
        'professors',
        savedProfile.user_id, // Primary key identifier
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
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<object>} JSON response confirming the deletion.
 */
const deleteProfessor = async (req, res) => {
  // The id in params corresponds to user_id to maintain consistency
  const { id } = req.params; 
  
  try {
    const deleted = await ProfessorModel.delete(id);
    
    if (!deleted) {
        return res.status(404).json({ message: 'Perfil de docente no encontrado.' });
    }

    // Inject Audit Log for traceability
    if (req.user && req.user.id) {
      await AuditLogModel.logAction(
        req.user.id,
        'DELETE',
        'professors',
        id,
        { deleted_at: new Date().toISOString() }
      );
    }

    return res.status(200).json({ message: 'Perfil de docente eliminado exitosamente.' });
  } catch (error) {
    console.error(`[ERROR] Failed to delete professor profile for user_id ${id}:`, error);
    return res.status(500).json({ message: 'Error interno al eliminar el perfil del docente.' });
  }
};

module.exports = { 
  getProfessors, 
  upsertProfessor, 
  deleteProfessor 
};