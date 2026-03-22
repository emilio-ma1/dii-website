/**
 * @file professorController.js
 * @description Thin controller for professor profiles management.
 */
const ProfessorModel = require('../models/professorModel');

const getProfessors = async (req, res) => {
  try {
    const list = await ProfessorModel.getAll();
    return res.status(200).json(list);
  } catch (error) {
    // Registramos el error en inglés como dicta el estándar de QA
    console.error('[ERROR] Failed to fetch professors:', error); 
    return res.status(500).json({ message: 'Internal server error fetching professors.' });
  }
};

/**
 * Maneja tanto la creación como la actualización de perfiles (UPSERT).
 */
const upsertProfessor = async (req, res) => {
  const { user_id, degree, area, image_url } = req.body;
  
  // Validación explícita de entradas (OWASP Nivel 2)
  if (!user_id || !degree || !area) {
    return res.status(400).json({ message: 'User ID, degree, and area are required.' });
  }

  try {
    const profileData = { user_id, degree, area, image_url: image_url || null };
    const savedProfile = await ProfessorModel.upsert(profileData);
    return res.status(200).json(savedProfile);
  } catch (error) {
    console.error('[ERROR] Failed to upsert professor profile:', error);
    return res.status(500).json({ message: 'Internal server error saving profile.' });
  }
};

const deleteProfessor = async (req, res) => {
  // Ahora el id de los params corresponde al user_id para mantener consistencia
  const { id } = req.params; 
  try {
    const deleted = await ProfessorModel.delete(id);
    if (!deleted) {
        return res.status(404).json({ message: 'Profile not found.' });
    }
    return res.status(200).json({ message: 'Profile deleted successfully.' });
  } catch (error) {
    console.error(`[ERROR] Failed to delete professor profile for user_id ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error deleting profile.' });
  }
};

module.exports = { 
  getProfessors, 
  upsertProfessor, 
  deleteProfessor 
};