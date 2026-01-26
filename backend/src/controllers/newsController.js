const NewsModel = require('../models/newsModel');
const sendJSON = require('../utils/responseHelper');

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
    sendJSON(res, 200, news);
  } catch (error) {
    console.error(error);
    sendJSON(res, 500, { error: 'Error al obtener las noticias' });
  }
};

const createNews = async (req, res) => {
  const { title, content, created_by, image_url } = req.body;

  const authorId = created_by || 1; //Por defecto usuario 1 si no se manda
  //Validación basica
  if (!title || !content) {
    return sendJSON(res, 400, { error: 'Título y contenido son obligatorios' });
  }

  try {
    const slug = crearSlug(title) + '-' + Date.now();

    const newPost = await NewsModel.create(title, slug, content, image_url || null, authorId); 
    sendJSON(res, 201, { message: 'Noticia creada exitosamente', news: newPost });
  } catch (error) {
    console.error('Error en createNews:', error.message);
    sendJSON(res, 500, { error: 'Error al crear la noticia', details: error.message });
  }
};

module.exports = { getNews, createNews };