const pool = require('../config/db');

const NewsModel = {
  // Obtener todas las noticias publicadas
  getAll: async () => {
    const query = 'SELECT * FROM news ORDER BY published_at DESC';
    const { rows } = await pool.query(query);
    return rows;
  },

  // Crear una nueva noticia
  create: async (title, content) => {
    const query = `
      INSERT INTO news (title, content)
      VALUES ($1, $2)
      RETURNING *`;
    const values = [title, content];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
};

module.exports = NewsModel;