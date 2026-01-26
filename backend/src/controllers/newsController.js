const NewsModel = require('../models/newsModel');

const crearSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           //Reemplaza espacios por guiones
    .replace(/[^\w\-]+/g, '')       //Elimina caracteres especiales
    .replace(/\-\-+/g, '-');        //Reemplaza guiones dobles
};

const getNews = async (req, res) => {
  try {
    const news = await NewsModel.getAll();
    res.json(news); // Express maneja el status 200 por defecto
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las noticias' });
  }
};

const createNews = async (req, res) => {
  const { title, content, image_url } = req.body;

  const created_by = req.user ? req.user.id : null; // recuperamos el usuario autenticado desde el middleware
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Título y contenido son obligatorios' });
  }

  try {
    const slug = crearSlug(title) + '-' + Date.now();

    const newPost = await NewsModel.create(title, slug, content, image_url || null, created_by); 
    res.status(201).json({ message: 'Noticia creada exitosamente', news: newPost });
  } catch (error) {
    console.error('Error en createNews:', error.message);
    res.status(500).json({ error: 'Error al crear la noticia', details: error.message });
  }
};

module.exports = { getNews, createNews };