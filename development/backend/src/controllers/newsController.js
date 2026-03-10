/**
 * @file Controlador de noticias (newsController).
 * @description
 * Maneja la lógica para obtener el listado de noticias y crear nuevas publicaciones.
 * Interactúa con NewsModel para las transacciones con la base de datos.
 */
const NewsModel = require('../models/newsModel');

/**
 * Genera un slug amigable para la URL a partir de una cadena de texto.
 *
 * @param {string} text - El texto original (generalmente el título de la noticia).
 * @returns {string} El slug formateado (en minúsculas, sin espacios ni caracteres especiales).
 */
const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Reemplaza espacios por guiones
    .replace(/[^\w\-]+/g, '')       // Elimina caracteres especiales
    .replace(/\-\-+/g, '-');        // Reemplaza guiones dobles por simples
};

/**
 * Obtiene todas las noticias/publicaciones registradas en el sistema.
 *
 * @param {object} req - Objeto de petición HTTP de Express.
 * @param {object} res - Objeto de respuesta HTTP de Express.
 * @returns {object} Respuesta JSON con la lista de noticias (Status 200) o un mensaje de error.
 * @throws {Error} Si ocurre un problema al consultar el modelo de base de datos.
 */
const getNews = async (req, res) => {
  try {
    const newsList = await NewsModel.getAll();
    return res.json(newsList);
  } catch (error) {
    // Trazas técnicas
    console.error('[ERROR] Failed to fetch news list from database:', error);
    return res.status(500).json({ message: 'Error interno del servidor al obtener las noticias.' });
  }
};

/**
 * Crea una nueva noticia en el sistema.
 *
 * @param {object} req - Objeto de petición HTTP, debe contener title, content y opcionalmente image_url.
 * @param {object} res - Objeto de respuesta HTTP de Express.
 * @returns {object} Respuesta JSON con la noticia recién creada o un mensaje de error.
 * @throws {Error} Si falla la inserción en la base de datos a través del modelo.
 */
const createNews = async (req, res) => {
  const { title, content, image_url } = req.body;

  // Recuperamos el ID del usuario autenticado (inyectado por el middleware de auth)
  const authorId = req.user ? req.user.id : null; 
  
  // Retorno temprano validación de entradas obligatorias
  if (!title || !content) {
    return res.status(400).json({ message: 'El título y el contenido son campos obligatorios.' });
  }

  try {
    // Generamos un slug único añadiendo un timestamp
    const generatedSlug = `${createSlug(title)}-${Date.now()}`;
    const finalImageUrl = image_url || null;

    const newPost = await NewsModel.create(
      title, 
      generatedSlug, 
      content, 
      finalImageUrl, 
      authorId
    ); 
    
    return res.status(201).json({ 
      message: 'Noticia creada exitosamente.', 
      news: newPost 
    });
  } catch (error) {
    // Trazas técnicas
    console.error('[ERROR] Failed to create news post:', error.message);
    
    // Devolvemos un error controlado al usuario sin exponer "error.message" técnico
    return res.status(500).json({ message: 'Error interno del servidor al crear la noticia.' });
  }
};

module.exports = { getNews, createNews };