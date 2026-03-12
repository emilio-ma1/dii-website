/**
 * @file Modelo de Proyectos (projectModel).
 * @description
 * Gestiona las consultas de lectura y manipulación de datos para la entidad 'projects'.
 * Sirve como capa de abstracción entre la base de datos PostgreSQL y los controladores.
 */
const pool = require('../config/db');

const ProjectModel = {
  /**
   * Obtiene todos los proyectos registrados con su categoría correspondiente.
   *
   * @returns {Promise<Array>} Un arreglo de objetos con los datos de los proyectos.
   * @throws {Error} Si ocurre un problema al ejecutar la consulta SQL.
   */
  getAll: async () => {
    try {
      //JOIN para traer el nombre de la categoría
      const query = `
        SELECT p.*, c.name AS category_name 
        FROM projects p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.year DESC, p.id DESC;
      `;
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error('[ERROR] Failed to fetch all projects from database:', error);
      throw error;
    }
  },

  /**
   * Obtiene un proyecto específico con todos sus autores anidados y su categoría.
   *
   * @param {number|string} projectId - El ID único del proyecto a buscar.
   * @returns {Promise<object|null>} El objeto del proyecto o null.
   * @throws {Error} Si ocurre un problema al ejecutar la consulta SQL.
   */
  getByIdWithAuthors: async (projectId) => {
    try {
      const query = `
        SELECT 
          p.*,
          c.name AS category_name,
          c.description AS category_description,
          COALESCE(
            json_agg(DISTINCT jsonb_build_object('id', u_prof.id, 'name', u_prof.full_name)) 
            FILTER (WHERE u_prof.id IS NOT NULL), '[]'
          ) AS professors,
          COALESCE(
            json_agg(DISTINCT jsonb_build_object('id', u_alumni.id, 'name', u_alumni.full_name)) 
            FILTER (WHERE u_alumni.id IS NOT NULL), '[]'
          ) AS alumni
        FROM projects p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN project_professors pp ON p.id = pp.project_id
        LEFT JOIN users u_prof ON pp.professor_id = u_prof.id
        LEFT JOIN project_alumni pa ON p.id = pa.project_id
        LEFT JOIN users u_alumni ON pa.user_id = u_alumni.id
        WHERE p.id = $1
        GROUP BY p.id, c.id;
      `;
      
      const { rows } = await pool.query(query, [projectId]);
      
      if (rows.length === 0) return null;
      return rows[0];
    } catch (error) {
      console.error(`[ERROR] Failed to fetch project details for ID ${projectId}:`, error);
      throw error;
    }
  }
};

module.exports = ProjectModel;