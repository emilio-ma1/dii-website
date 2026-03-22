/**
 * @file alumniController.js
 * @description Handles HTTP requests for alumni (student) profiles. Acts as a Thin Controller.
 */
const AlumniModel = require('../models/alumniModel');

const getAllAlumni = async (req, res) => {
  try {
    const alumniList = await AlumniModel.getAll();
    return res.status(200).json(alumniList);
  } catch (error) {
    console.error('[ERROR] Failed to fetch alumni:', error);
    return res.status(500).json({ message: 'Error interno al obtener los estudiantes.' });
  }
};

const upsertAlumni = async (req, res) => {
  try {
    // Upsert maneja automáticamente si es una creación nueva o una actualización
    const savedProfile = await AlumniModel.upsert(req.body);
    return res.status(200).json(savedProfile);
  } catch (error) {
    console.error('[ERROR] Failed to upsert alumni:', error);
    return res.status(500).json({ message: 'Error interno al guardar el perfil del estudiante.' });
  }
};

const deleteAlumni = async (req, res) => {
  const { id } = req.params; // Este ID corresponde al user_id
  try {
    const deletedProfile = await AlumniModel.delete(id);
    if (!deletedProfile) {
      return res.status(404).json({ message: 'Perfil no encontrado.' });
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