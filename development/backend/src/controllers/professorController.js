/**
 * @file professorController.js
 * @description Thin controller for professor profiles management.
 */
const ProfessorModel = require('../models/professorModel');

const getProfessors = async (req, res) => {
  try {
    const list = await ProfessorModel.getAll();
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error fetching professors.' });
  }
};

const createProfessor = async (req, res) => {
  const { user_id, degree, area, image_url } = req.body;
  if (!user_id || !degree || !area) {
    return res.status(400).json({ message: 'User ID, degree, and area are required.' });
  }
  try {
    const newProf = await ProfessorModel.create(user_id, degree, area, image_url || null);
    return res.status(201).json(newProf);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error creating profile.' });
  }
};

const updateProfessor = async (req, res) => {
  const { id } = req.params;
  const { degree, area, image_url } = req.body;
  try {
    const updated = await ProfessorModel.update(id, degree, area, image_url || null);
    if (!updated) return res.status(404).json({ message: 'Profile not found.' });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error updating profile.' });
  }
};

const deleteProfessor = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await ProfessorModel.delete(id);
    if (!deleted) return res.status(404).json({ message: 'Profile not found.' });
    return res.json({ message: 'Profile deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error deleting profile.' });
  }
};

module.exports = { getProfessors, createProfessor, updateProfessor, deleteProfessor };