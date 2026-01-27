const pool = require('../config/db');

const NewsModel = {
  //Obtener todas las noticias publicadas
  getAll: async () => {
    const query = 'SELECT * FROM news ORDER BY published_at DESC';
    const { rows } = await pool.query(query);
    return rows;
  },

  //Crear una nueva noticia
  create: async (title, slug, content, image_url, userId) => {
    const query = `
      INSERT INTO news (title, slug, content, image_url, created_by, published_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *`;
    const values = [title, slug, content, image_url, userId];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
};

module.exports = NewsModel;