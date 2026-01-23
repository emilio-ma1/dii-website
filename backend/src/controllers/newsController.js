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
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las noticias' });
  }
};

const createNews = async (req, res) => {
  const { title, content, created_by, image_url } = req.body;

  //Validación basica
  if (!title || !content || !created_by) {
    return res.status(400).json({ error: 'Título, contenido y autor son obligatorios'});
  }

  try {
    const slug = crearSlug(title) + '-' + Date.now();

    const newPost = await NewsModel.create(title, slug, content, image_url || null, created_by); 
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error en createNews:', error.message);
    res.status(500).json({ error: 'Error al crear la noticia', details: error.message });
  }
};

module.exports = { getNews, createNews };