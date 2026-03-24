/**
 * @file alumniController.js
 * @description 
 * Handles HTTP requests for alumni (student) profiles. 
 * Acts as a Thin Controller delegating business logic to the Model.
 */
const AlumniModel = require('../models/alumniModel');
const AuditLogModel = require('../models/auditLogModel'); // Added Audit Trail

/**
 * Retrieves a list of all alumni profiles.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<object>} JSON response with the alumni list.
 */
const getAllAlumni = async (req, res) => {
  try {
    const alumniList = await AlumniModel.getAll();
    return res.status(200).json(alumniList);
  } catch (error) {
    console.error('[ERROR] Failed to fetch alumni:', error);
    return res.status(500).json({ message: 'Error interno al obtener los estudiantes.' });
  }
};

/**
 * Creates or updates an alumni profile (Upsert operation).
 *
 * @param {object} req - Express request object containing profile data in the body.
 * @param {object} res - Express response object.
 * @returns {Promise<object>} JSON response with the saved profile.
 */
const upsertAlumni = async (req, res) => {
  try {
    // Upsert automatically handles whether it's a new creation or an update
    const savedProfile = await AlumniModel.upsert(req.body);
    
    // Inject Audit Log for traceability
    if (req.user && req.user.id) {
      await AuditLogModel.logAction(
        req.user.id,
        'UPSERT', // Action performed
        'alumni_profiles', // Entity affected
        savedProfile.user_id, // ID of the affected profile
        { degree: savedProfile.degree, specialty: savedProfile.specialty }
      );
    }

    return res.status(200).json(savedProfile);
  } catch (error) {
    console.error('[ERROR] Failed to upsert alumni:', error);
    return res.status(500).json({ message: 'Error interno al guardar el perfil del estudiante.' });
  }
};

/**
 * Deletes an alumni profile by their user ID.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<object>} JSON response confirming deletion.
 */
const deleteAlumni = async (req, res) => {
  const { id } = req.params; // This ID corresponds to the user_id
  
  try {
    const deletedProfile = await AlumniModel.delete(id);
    
    if (!deletedProfile) {
      return res.status(404).json({ message: 'Perfil no encontrado.' });
    }

    // Inject Audit Log for traceability
    if (req.user && req.user.id) {
      await AuditLogModel.logAction(
        req.user.id,
        'DELETE',
        'alumni_profiles',
        id,
        { deleted_at: new Date().toISOString() }
      );
    }

    return res.status(200).json({ message: 'Perfil eliminado exitosamente.' });
  } catch (error) {
    console.error(`[ERROR] Failed to delete alumni user_id ${id}:`, error);
    return res.status(500).json({ message: 'Error interno al eliminar el perfil.' });
  }
};

module.exports = { 
  getAllAlumni, 
  upsertAlumni, 
  deleteAlumni 
};