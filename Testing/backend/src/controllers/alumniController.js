/**
 * @file alumniController.js
 * @description 
 * Handles HTTP requests for alumni (student) profiles. 
 * * Responsibilities:
 * - Acts as a Thin Controller delegating business logic to the Model.
 * - Intercepts multipart FormData files via Multer for binary image storage.
 * - Parses stringified FormData payloads back into proper data types.
 */
const AlumniModel = require('../models/alumniModel');
const AuditLogModel = require('../models/auditLogModel');

/**
 * Retrieves a list of all alumni profiles.
 *
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @returns {Promise<object>} JSON response with the alumni list.
 */
const getAllAlumni = async (req, res) => {
  try {
    const alumniList = await AlumniModel.getAll();
    return res.status(200).json(alumniList);
  } catch (error) {
    console.error('[ERROR] Failed to fetch alumni:', error);
    return res.status(500).json({ message: 'Error interno al obtener los egresados.' });
  }
};

/**
 * Creates or updates an alumni profile (Upsert operation) with binary image support.
 * * WHY: Extracts the binary buffer provided by Multer and sanitizes the boolean
 * fields that are converted to strings by the FormData transport protocol.
 *
 * @param {object} req Express request object containing profile data and file.
 * @param {object} res Express response object.
 * @returns {Promise<object>} JSON response with the saved profile.
 */
const upsertAlumni = async (req, res) => {
  const { user_id, degree, specialty, video_url_embed, is_profile_public } = req.body;
  const adminId = req.user ? req.user.id : null;

  // Early return validation
  if (!user_id || !degree) {
    return res.status(400).json({ message: 'El ID de usuario y el grado son obligatorios.' });
  }

  try {
    const isPublic = is_profile_public === 'false' || is_profile_public === false ? false : true;

    const imageData = req.file ? req.file.buffer : null;
    const imageMimetype = req.file ? req.file.mimetype : null;

    const savedProfile = await AlumniModel.upsert({
      user_id,
      degree,
      specialty,
      video_url_embed,
      is_profile_public: isPublic,
      imageData,
      imageMimetype
    });
    
    // Inject Audit Log for traceability
    if (adminId) {
      await AuditLogModel.logAction(
        adminId,
        'UPSERT', 
        'alumni_profiles', 
        savedProfile.user_id, 
        { degree: savedProfile.degree, specialty: savedProfile.specialty }
      );
    }

    return res.status(200).json(savedProfile);
  } catch (error) {
    console.error('[ERROR] Failed to upsert alumni:', error);
    return res.status(500).json({ message: 'Error interno al guardar el perfil del egresado.' });
  }
};

/**
 * Deletes an alumni profile by their user ID.
 *
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @returns {Promise<object>} JSON response confirming deletion.
 */
const deleteAlumni = async (req, res) => {
  const { id } = req.params; // This ID corresponds to the user_id
  const adminId = req.user ? req.user.id : null;

  try {
    const deletedProfile = await AlumniModel.delete(id);
    
    if (!deletedProfile) {
      return res.status(404).json({ message: 'Perfil de egresado no encontrado.' });
    }

    // Inject Audit Log for traceability
    if (adminId) {
      await AuditLogModel.logAction(
        adminId,
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

/**
 * Serves the binary image file for a specific alumni profile.
 * * WHY: Dedicated endpoint to bypass CORS and properly set MIME headers 
 * for raw binary stream rendering in the browser.
 *
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @returns {Promise<Buffer|object>} Binary buffer or JSON error.
 */
const getAlumniImage = async (req, res) => {
  const { id } = req.params;
  try {
    const alumni = await AlumniModel.getImage(id);
    
    if (!alumni || !alumni.image_data) {
      return res.status(404).json({ message: 'Imagen no encontrada.' });
    }

    res.set('Content-Type', alumni.image_mimetype);
    res.set('Cross-Origin-Resource-Policy', 'cross-origin'); 
    
    return res.send(alumni.image_data);
  } catch (error) {
    console.error(`[ERROR] Controller failed to serve image for alumni ID ${id}:`, error);
    return res.status(500).json({ message: 'Error interno al obtener la imagen.' });
  }
};

module.exports = { 
  getAllAlumni, 
  upsertAlumni, 
  deleteAlumni,
  getAlumniImage
};