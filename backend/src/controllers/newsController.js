const NewsModel = require('../models/newsModel');

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
  const { title, content} = req.body;

  // Validación básica
  if (!title || !content) {
    return res.status(400).json({ error: 'Título y contenido son obligatorios' });
  }

  try {
    // Nota: author_id debería venir de la sesión del usuario, 
    // pero por ahora lo recibimos manual para probar.
    const newPost = await NewsModel.create(title, content); 
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la noticia' });
  }
};

module.exports = { getNews, createNews };