/**
 * @file Modelo de Proyectos (projectModel).
 * @description
 * Gestiona las consultas de lectura y manipulación de datos para la entidad 'projects'.
 * Sirve como capa de abstracción entre la base de datos PostgreSQL y los controladores.
 */
const pool = require('../config/db');

const ProjectModel = {
  /**
   * Obtiene todos los proyectos registrados con su categoría y el arreglo de autores.
   *
   * @returns {Promise<Array>} Un arreglo de objetos con los datos de los proyectos.
   * @throws {Error} Si ocurre un problema al ejecutar la consulta SQL.
   */
  getAll: async () => {
    try {
      const query = `
        SELECT 
            p.*, 
            c.name AS category_name,
            (
                SELECT COALESCE(json_agg(json_build_object('id', u.id, 'full_name', u.full_name, 'role', u.role)), '[]')
                FROM project_alumni pa
                JOIN users u ON pa.user_id = u.id
                WHERE pa.project_id = p.id
            ) ::jsonb ||
            (
                SELECT COALESCE(json_agg(json_build_object('id', u.id, 'full_name', pr.full_name, 'role', 'teacher')), '[]')
                FROM project_professors pp
                JOIN professors pr ON pp.professor_id = pr.id
                JOIN users u ON pr.user_id = u.id
                WHERE pp.project_id = p.id
            ) ::jsonb AS authors
        FROM projects p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.year DESC NULLS LAST, p.id DESC;
      `;
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error('[ERROR] Failed to fetch all projects from database:', error);
      throw error;
    }
  },

  /**
   * Obtiene un proyecto específico con todos sus autores y su categoría.
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
            (
                SELECT COALESCE(json_agg(json_build_object('id', u.id, 'full_name', u.full_name, 'role', u.role)), '[]')
                FROM project_alumni pa
                JOIN users u ON pa.user_id = u.id
                WHERE pa.project_id = p.id
            ) ::jsonb ||
            (
                SELECT COALESCE(json_agg(json_build_object('id', u.id, 'full_name', pr.full_name, 'role', 'teacher')), '[]')
                FROM project_professors pp
                JOIN professors pr ON pp.professor_id = pr.id
                JOIN users u ON pr.user_id = u.id
                WHERE pp.project_id = p.id
            ) ::jsonb AS authors
        FROM projects p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = $1;
      `;
      
      const { rows } = await pool.query(query, [projectId]);
      
      if (rows.length === 0) return null;
      return rows[0]; // Retornamos el objeto limpio
    } catch (error) {
      console.error(`[ERROR] Failed to fetch project details for ID ${projectId}:`, error);
      throw error;
    }
  }
};

module.exports = ProjectModel;