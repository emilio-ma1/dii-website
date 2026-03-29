/**
 * @file newsController.js
 * @description
 * Handles the logic for retrieving, creating, updating, and deleting news/events.
 * * Responsibilities:
 * - Orchestrate news lifecycle and binary image processing via Multer.
 * - Generate URL-friendly slugs for public routing.
 * - Maintain an audit trail for all administrative actions.
 */
const NewsModel = require('../models/newsModel');
const AuditLogModel = require('../models/auditLogModel');

/**
 * Generates a URL-friendly slug from a text string.
 * * WHY: Uses regex to normalize strings, removing diacritics and special characters
 * to ensure URL compatibility across all browsers.
 *
 * @param {string} text The original text (usually the news title).
 * @returns {string} The formatted slug.
 */
const createSlug = (text) => {
  return text
    .toString()
    .normalize('NFD') // Separate characters from their accents
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

/**
 * Fetches all registered news and events from the system.
 *
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @returns {Promise<object>} JSON list of news.
 */
const getNews = async (req, res) => {
  try {
    const newsList = await NewsModel.getAll();
    return res.status(200).json(newsList);
  } catch (error) {
    console.error('[ERROR] Failed to fetch news list:', error);
    return res.status(500).json({ message: 'Error interno al obtener las noticias.' });
  }
};

/**
 * Creates a new news post or event with a binary image.
 *
 * @param {object} req Express request object (contains multer file).
 * @param {object} res Express response object.
 * @returns {Promise<object>} JSON confirming creation.
 */
const createNews = async (req, res) => {
  const { title, content, is_active } = req.body;
  const authorId = req.user ? req.user.id : null; 

  if (!title || !content) {
    return res.status(400).json({ message: 'El título y el contenido son obligatorios.' });
  }

  try {
    const generatedSlug = `${createSlug(title)}-${Date.now()}`;
    
    const isActive = is_active === 'false' || is_active === false ? false : true;

    const imageData = req.file ? req.file.buffer : null;
    const imageMimetype = req.file ? req.file.mimetype : null;

    const newPost = await NewsModel.create(
      title, 
      generatedSlug, 
      content, 
      imageData, 
      imageMimetype, 
      authorId,
      isActive
    ); 
    
    if (authorId) {
      await AuditLogModel.logAction(
        authorId, 'CREATE', 'news', newPost.id, { title: newPost.title }
      );
    }

    return res.status(201).json({ message: 'Noticia creada exitosamente.', news: newPost });
  } catch (error) {
    console.error('[ERROR] Failed to create news post:', error);
    return res.status(500).json({ message: 'Error interno al crear la noticia.' });
  }
};

/**
 * Updates an existing news post.
 */
const updateNews = async (req, res) => {
  const { id } = req.params;
  const { title, content, is_active, slug } = req.body;
  const adminId = req.user ? req.user.id : null;

  if (!title || !content) {
    return res.status(400).json({ message: 'El título y el contenido son obligatorios.' });
  }

  try {
    const finalSlug = slug ? slug : createSlug(title);
    const isActive = is_active === 'false' || is_active === false ? false : true;

    const imageData = req.file ? req.file.buffer : null;
    const imageMimetype = req.file ? req.file.mimetype : null;
    
    const updatedPost = await NewsModel.update(
      id, title, finalSlug, content, imageData, imageMimetype, isActive
    );
    
    if (!updatedPost) {
       return res.status(404).json({ message: 'Noticia no encontrada.' });
    }

    if (adminId) {
      await AuditLogModel.logAction(
        adminId, 'UPDATE', 'news', id, { title: updatedPost.title, status: updatedPost.is_active }
      );
    }
    
    return res.status(200).json({ message: 'Noticia actualizada exitosamente.', news: updatedPost });
  } catch (error) {
    console.error(`[ERROR] Failed to update news ID ${id}:`, error);
    return res.status(500).json({ message: 'Error interno al actualizar la noticia.' });
  }
};

/**
 * Deletes a news post or event.
 */
const deleteNews = async (req, res) => {
  const { id } = req.params;
  const adminId = req.user ? req.user.id : null;

  try {
    const deletedPost = await NewsModel.delete(id);
    if (!deletedPost) {
        return res.status(404).json({ message: 'Noticia no encontrada.' });
    }

    if (adminId) {
      await AuditLogModel.logAction(
        adminId, 'DELETE', 'news', id, { title: deletedPost.title }
      );
    }

    return res.status(200).json({ message: 'Noticia eliminada exitosamente.' });
  } catch (error) {
    console.error(`[ERROR] Failed to delete news ID ${id}:`, error);
    return res.status(500).json({ message: 'Error interno al eliminar la noticia.' });
  }
};

/**
 * Retrieves a specific news post by its slug.
 */
const getNewsBySlug = async (req, res) => {
  const { slug } = req.params;
  const userId = req.user ? req.user.id : null;

  try {
    const newsItem = await NewsModel.getBySlug(slug);
    
    if (!newsItem) {
      return res.status(404).json({ message: 'Noticia no encontrada.' });
    }

    if (userId) {
      await AuditLogModel.logAction(userId, 'READ', 'news', newsItem.id, { slug });
    }

    return res.status(200).json(newsItem);
  } catch (error) {
    console.error(`[ERROR] Failed to fetch news by slug ${slug}:`, error);
    return res.status(500).json({ message: 'Error interno al obtener la noticia.' });
  }
};

/**
 * Serves the binary image file.
 * * WHY: Dedicated endpoint to set correct MIME headers for browser rendering.
 */
const getNewsImage = async (req, res) => {
  const { id } = req.params;
  try {
    const newsItem = await NewsModel.getImage(id);
    
    if (!newsItem || !newsItem.image_data) {
      return res.status(404).json({ message: 'Imagen no encontrada.' });
    }

    res.set('Content-Type', newsItem.image_mimetype);
    res.set('Cross-Origin-Resource-Policy', 'cross-origin'); 
    
    return res.send(newsItem.image_data);
  } catch (error) {
    console.error(`[ERROR] Failed to serve image for news ID ${id}:`, error);
    return res.status(500).json({ message: 'Error interno al obtener la imagen.' });
  }
};

module.exports = { 
  getNews, createNews, updateNews, deleteNews, getNewsBySlug, getNewsImage 
};