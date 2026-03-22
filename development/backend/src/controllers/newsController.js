/**
 * @file newsController.js
 * @description
 * Handles the logic for retrieving, creating, updating, and deleting news/events.
 * Interacts with NewsModel for database transactions. Adheres to Thin Controller principles.
 */
const NewsModel = require('../models/newsModel');

/**
 * Generates a URL-friendly slug from a text string.
 *
 * @param {string} text The original text (usually the news title).
 * @returns {string} The formatted slug (lowercase, no spaces or special characters).
 */
const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

/**
 * Fetches all registered news and events from the system.
 *
 * @param {object} req Express HTTP request object.
 * @param {object} res Express HTTP response object.
 * @returns {Promise<object>} JSON response with the news list or an error message.
 * @throws {Error} Implicitly catches database errors and returns 500.
 */
const getNews = async (req, res) => {
  try {
    const newsList = await NewsModel.getAll();
    return res.json(newsList);
  } catch (error) {
    console.error('[ERROR] Failed to fetch news list from database:', error);
    return res.status(500).json({ message: 'Error interno del servidor al obtener las noticias.' });
  }
};

/**
 * Creates a new news post or event in the system.
 *
 * @param {object} req Express HTTP request object.
 * @param {object} res Express HTTP response object.
 * @returns {Promise<object>} JSON response with the created news or an error message.
 * @throws {Error} Implicitly catches database errors and returns 500.
 */
const createNews = async (req, res) => {
  const { title, content, image_url, is_active } = req.body;
  const authorId = req.user ? req.user.id : null; 

  if (!title || !content) {
    return res.status(400).json({ message: 'El título y el contenido son campos obligatorios.' });
  }

  try {
    const generatedSlug = `${createSlug(title)}-${Date.now()}`;
    const finalImageUrl = image_url || null;
    const isActive = is_active !== undefined ? is_active : true;

    const newPost = await NewsModel.create(
      title, 
      generatedSlug, 
      content, 
      finalImageUrl, 
      authorId,
      isActive
    ); 
    
    return res.status(201).json({ message: 'Noticia creada exitosamente.', news: newPost });
  } catch (error) {
    console.error('[ERROR] Failed to create news post:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor al crear la noticia.' });
  }
};

/**
 * Updates an existing news post or event.
 *
 * @param {object} req Express HTTP request object.
 * @param {object} res Express HTTP response object.
 * @returns {Promise<object>} JSON response with success message.
 * @throws {Error} Implicitly catches database errors and returns 500.
 */
const updateNews = async (req, res) => {
  const { id } = req.params;
  const { title, content, image_url, is_active } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'El título y el contenido son campos obligatorios.' });
  }

  try {
    // Si editan el título, regeneramos el slug
    const generatedSlug = `${createSlug(title)}-${Date.now()}`;
    
    const updatedPost = await NewsModel.update(
      id, title, generatedSlug, content, image_url || null, is_active
    );
    
    if (!updatedPost) {
       return res.status(404).json({ message: 'Noticia no encontrada.' });
    }
    
    return res.status(200).json({ message: 'Noticia actualizada exitosamente.', news: updatedPost });
  } catch (error) {
    console.error(`[ERROR] Failed to update news ID ${id}:`, error.message);
    return res.status(500).json({ message: 'Error interno del servidor al actualizar la noticia.' });
  }
};

/**
 * Deletes a news post or event.
 *
 * @param {object} req Express HTTP request object.
 * @param {object} res Express HTTP response object.
 * @returns {Promise<object>} JSON response confirming deletion.
 * @throws {Error} Implicitly catches database errors and returns 500.
 */
const deleteNews = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPost = await NewsModel.delete(id);
    if (!deletedPost) {
        return res.status(404).json({ message: 'Noticia no encontrada.' });
    }
    return res.status(200).json({ message: 'Noticia eliminada exitosamente.' });
  } catch (error) {
    console.error(`[ERROR] Failed to delete news ID ${id}:`, error.message);
    return res.status(500).json({ message: 'Error interno del servidor al eliminar la noticia.' });
  }
};

module.exports = { getNews, createNews, updateNews, deleteNews };