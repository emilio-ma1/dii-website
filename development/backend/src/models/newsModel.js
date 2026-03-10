/**
 * @file Modelo de Noticias (newsModel).
 * @description
 * Gestiona las consultas y transacciones directas con la base de datos
 * para la entidad 'news'. Abstrae la capa de datos de los controladores.
 */
const pool = require('../config/db');

const NewsModel = {
  /**
   * Obtiene todas las noticias registradas ordenadas por fecha de publicación descendente.
   *
   * @returns {Promise<Array>} Un arreglo con los registros de las noticias.
   * @throws {Error} Si la consulta a la base de datos falla.
   */
  getAll: async () => {
    const query = 'SELECT * FROM news ORDER BY published_at DESC;';
    const { rows } = await pool.query(query);
    return rows;
  },

  /**
   * Inserta una nueva noticia en la base de datos.
   *
   * @param {string} title - Título de la noticia.
   * @param {string} slug - Identificador amigable para la URL.
   * @param {string} content - Contenido o cuerpo de la noticia.
   * @param {string|null} imageUrl - Ruta o URL de la imagen adjunta
   * @param {number|null} userId - ID del usuario administrador que crea la publicación.
   * @returns {Promise<object>} El objeto de la noticia recién insertada.
   * @throws {Error} Si la consulta de inserción falla.
   */
  create: async (title, slug, content, imageUrl, userId) => {
    const query = `
      INSERT INTO news (title, slug, content, image_url, created_by, published_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *;
    `;
    const values = [title, slug, content, imageUrl, userId];
    
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
};

module.exports = NewsModel;