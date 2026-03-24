/**
 * @file categoryController.js
 * @description
 * Handles the business logic for project categories.
 * Acts as a Thin Controller, delegating data retrieval to the CategoryModel.
 */
const CategoryModel = require('../models/categoryModel');

/**
 * Retrieves the list of all categories to populate filters and forms.
 *
 * @param {object} req - Express HTTP request object.
 * @param {object} res - Express HTTP response object.
 * @returns {Promise<object>} JSON response with the category list (Status 200) or an error (Status 500).
 */
const getAllCategories = async (req, res) => {
  try {
    const categoriesList = await CategoryModel.getAll();
    
    // Explicit HTTP status code for successful retrieval
    return res.status(200).json(categoriesList);
  } catch (error) {
    console.error('[ERROR] Failed to fetch categories in controller:', error);
    return res.status(500).json({ message: 'Error interno al obtener las categorías.' });
  }
};

module.exports = { getAllCategories };