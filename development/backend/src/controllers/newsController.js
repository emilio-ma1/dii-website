/**
 * @file newsController.js
 * @description
 * Handles the logic for retrieving, creating, updating, and deleting news/events.
 * Interacts with NewsModel for database transactions. Adheres to Thin Controller principles.
 */
const NewsModel = require('../models/newsModel');
const AuditLogModel = require('../models/auditLogModel');

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
 */
const getNews = async (req, res) => {
  try {
    const newsList = await NewsModel.getAll();
    return res.status(200).json(newsList);
  } catch (error) {
    console.error('[ERROR] Failed to fetch news list from database:', error);
    return res.status(500).json({ message: 'Error interno del servidor al obtener las noticias.' });
  }
};

/**
 * Creates a new news post or event with an optional binary image.
 */
const createNews = async (req, res) => {
  const { title, content, is_active } = req.body;
  const authorId = req.user ? req.user.id : null; 

  if (!title || !content) {
    return res.status(400).json({ message: 'El título y el contenido son campos obligatorios.' });
  }

  try {
    const generatedSlug = `${createSlug(title)}-${Date.now()}`;
    
    const isActive = is_active !== undefined ? (is_active === 'true' || is_active === true) : true;

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
    
    if (req.user && req.user.id) {
      await AuditLogModel.logAction(
        req.user.id, 'CREATE', 'news', newPost.id, { title: newPost.title }
      );
    }

    return res.status(201).json({ message: 'Noticia creada exitosamente.', news: newPost });
  } catch (error) {
    console.error('[ERROR] Failed to create news post:', error);
    return res.status(500).json({ message: 'Error interno del servidor al crear la noticia.' });
  }
};

/**
 * Updates an existing news post, retaining the old image if a new one isn't provided.
 */
const updateNews = async (req, res) => {
  const { id } = req.params;
  const { title, content, is_active, slug } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'El título y el contenido son campos obligatorios.' });
  }

  try {
    const finalSlug = slug ? slug : createSlug(title);
    
    const isActive = is_active !== undefined ? (is_active === 'true' || is_active === true) : true;

    const imageData = req.file ? req.file.buffer : null;
    const imageMimetype = req.file ? req.file.mimetype : null;
    
    const updatedPost = await NewsModel.update(
      id, title, finalSlug, content, imageData, imageMimetype, isActive
    );
    
    if (!updatedPost) {
       return res.status(404).json({ message: 'Noticia no encontrada.' });
    }

    if (req.user && req.user.id) {
      await AuditLogModel.logAction(
        req.user.id, 'UPDATE', 'news', id, { title: updatedPost.title, status: updatedPost.is_active }
      );
    }
    
    return res.status(200).json({ message: 'Noticia actualizada exitosamente.', news: updatedPost });
  } catch (error) {
    console.error(`[ERROR] Failed to update news ID ${id}:`, error);
    return res.status(500).json({ message: 'Error interno del servidor al actualizar la noticia.' });
  }
};

/**
 * Deletes a news post or event.
 */
const deleteNews = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPost = await NewsModel.delete(id);
    if (!deletedPost) {
        return res.status(404).json({ message: 'Noticia no encontrada.' });
    }

    if (req.user && req.user.id) {
      await AuditLogModel.logAction(
        req.user.id, 'DELETE', 'news', id, { title: deletedPost.title, deleted_at: new Date().toISOString() }
      );
    }

    return res.status(200).json({ message: 'Noticia eliminada exitosamente.' });
  } catch (error) {
    console.error(`[ERROR] Failed to delete news ID ${id}:`, error);
    return res.status(500).json({ message: 'Error interno del servidor al eliminar la noticia.' });
  }
};

/**
 * Retrieves a specific news post by its unique URL slug.
 */
const getNewsBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const newsItem = await NewsModel.getBySlug(slug);
    if (!newsItem) {
      return res.status(404).json({ message: 'Noticia no encontrada.' });
    }
    return res.status(200).json(newsItem);
  } catch (error) {
    console.error(`[ERROR] Failed to fetch news by slug ${slug}:`, error);
    return res.status(500).json({ message: 'Error interno al obtener la noticia.' });
  }
};

/**
 * Serves the binary image file for a specific news post.
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
    console.error(`[ERROR] Controller failed to serve image for news ID ${id}:`, error);
    return res.status(500).json({ message: 'Error interno al obtener la imagen.' });
  }
};

module.exports = { 
  getNews, createNews, updateNews, deleteNews, getNewsBySlug, getNewsImage 
};