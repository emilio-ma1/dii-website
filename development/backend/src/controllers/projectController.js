/**
 * @file Controlador de proyectos (projectController).
 * @description
 * Gestiona la lógica de negocio para los proyectos. Conecta las rutas HTTP
 * con las consultas a la base de datos (Modelo) y maneja las transacciones.
 */
const pool = require('../config/db');
const ProjectModel = require('../models/projectModel');

/**
 * Obtiene el catálogo completo de proyectos públicos.
 *
 * @param {object} req - Objeto de petición HTTP.
 * @param {object} res - Objeto de respuesta HTTP.
 * @returns {object} Respuesta JSON con el listado de proyectos.
 */
const getAllProjects = async (req, res) => {
  try {
    const projectsList = await ProjectModel.getAll();
    return res.json(projectsList);
  } catch (error) {
    console.error('[ERROR] Failed to fetch projects in controller:', error);
    return res.status(500).json({ message: 'Error interno del servidor al obtener los proyectos.' });
  }
};

/**
 * Obtiene el detalle de un proyecto específico, incluyendo a sus autores (JOIN).
 *
 * @param {object} req - Objeto de petición HTTP (contiene el ID en los parámetros).
 * @param {object} res - Objeto de respuesta HTTP.
 * @returns {object} Respuesta JSON con el proyecto o un error 404/500.
 */
const getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const projectDetails = await ProjectModel.getByIdWithAuthors(id);
    
    // Retorno temprano si el ID no existe en la base de datos
    if (!projectDetails) {
      return res.status(404).json({ message: 'El proyecto solicitado no existe.' });
    }
    
    return res.json(projectDetails);
  } catch (error) {
    console.error(`[ERROR] Failed to fetch project details for ID ${id}:`, error);
    return res.status(500).json({ message: 'Error interno del servidor al obtener el proyecto.' });
  }
};

/**
 * Crea un nuevo proyecto y sus asociaciones mediante una transacción SQL.
 *
 * @param {object} req - Objeto de petición HTTP.
 * @param {object} res - Objeto de respuesta HTTP.
 * @returns {object} Respuesta JSON confirmando la creación.
 */
const createProject = async (req, res) => {
  const { 
    title, abstract, year, pdf_url: pdfUrl, 
    image_url: imageUrl, status, category_id: categoryId, 
    professor_ids: professorIds, alumni_ids: alumniIds 
  } = req.body;

  //validación inicial
  if (!title || !status || !categoryId) {
    return res.status(400).json({ message: 'El título, estado y la categoría son obligatorios.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN'); 

    const insertProjectQuery = `
      INSERT INTO projects (title, abstract, pdf_url, image_url, status, category_id, year) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;
    `;
    const queryResult = await client.query(insertProjectQuery, [title, abstract, pdfUrl, imageUrl, status, categoryId, year]);
    const newProjectId = queryResult.rows[0].id;
    
    if (Array.isArray(professorIds) && professorIds.length > 0) {
        for (const professorId of professorIds) {
            await client.query('INSERT INTO project_professors (project_id, professor_id) VALUES ($1, $2);', [newProjectId, professorId]);
        }
    }
    
    if (Array.isArray(alumniIds) && alumniIds.length > 0) {
        for (const alumniId of alumniIds) {
            await client.query('INSERT INTO project_alumni (project_id, user_id) VALUES ($1, $2);', [newProjectId, alumniId]);
        }
    }
    
    await client.query('COMMIT');
    return res.status(201).json({ message: 'Proyecto creado con éxito.', projectId: newProjectId });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[ERROR] Transaction failed while creating project:', error);
    return res.status(500).json({ message: 'Error interno al crear el proyecto.' });
  } finally {
    client.release();
  }
};

module.exports = { createProject, getAllProjects, getProjectById };