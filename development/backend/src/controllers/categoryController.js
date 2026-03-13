/**
 * @file Controlador de Categorías (categoryController).
 * @description
 * Gestiona la lógica de negocio para las categorías de los proyectos.
 */
const CategoryModel = require('../models/categoryModel');

/**
 * Retorna la lista de categorías para poblar filtros y formularios.
 *
 * @param {object} req - Objeto de petición HTTP.
 * @param {object} res - Objeto de respuesta HTTP.
 * @returns {object} Respuesta JSON con el listado (Status 200) o error (Status 500).
 */
const getAllCategories = async (req, res) => {
  try {
    const categoriesList = await CategoryModel.getAll();
    return res.json(categoriesList);
  } catch (error) {
    console.error('[ERROR] Failed to fetch categories in controller:', error);
    return res.status(500).json({ message: 'Error interno al obtener las categorías.' });
  }
};

module.exports = { getAllCategories };