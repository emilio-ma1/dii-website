/**
 * @file Controlador de proyectos (projectController).
 * @description
 * Gestiona la creación de nuevos proyectos de investigación o vinculación,
 * manejando las transacciones necesarias para vincular profesores y egresados.
 */
const pool = require('../config/db');

/**
 * Crea un nuevo proyecto y sus asociaciones con autores (profesores y/o egresados).
 * Utiliza una transacción SQL para garantizar la integridad de los datos si falla un insert.
 *
 * @param {object} req - Objeto de petición HTTP, debe contener los datos del proyecto y arrays de IDs.
 * @param {object} res - Objeto de respuesta HTTP de Express.
 * @returns {object} Respuesta JSON confirmando la creación y el ID del proyecto, o un error 400/500.
 * @throws {Error} Si falla la transacción en la base de datos (se realiza un ROLLBACK).
 */
const createProject = async (req, res) => {
  const { 
    title, 
    abstract, 
    year, 
    pdf_url: pdfUrl, 
    image_url: imageUrl, 
    status, 
    category, 
    professor_ids: professorIds, 
    alumni_ids: alumniIds 
  } = req.body;

  // Retorno temprano validación de campos obligatorios antes de tocar la BD
  if (!title || !status || !category) {
    return res.status(400).json({ message: 'El título, el estado y la categoría son campos obligatorios.' });
  }

  const client = await pool.connect();

  try {
    // INICIO DE LA TRANSACCIÓN
    await client.query('BEGIN'); 

    const insertProjectQuery = `
      INSERT INTO projects (title, abstract, pdf_url, image_url, status, category, year) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING id;
    `;
    const projectValues = [title, abstract, pdfUrl, imageUrl, status, category, year];
    
    const queryResult = await client.query(insertProjectQuery, projectValues);
    const newProjectId = queryResult.rows[0].id;
    
    // Inserción de autores (Profesores) validando que sea un arreglo válido
    if (Array.isArray(professorIds) && professorIds.length > 0) {
        const insertProfessorQuery = 'INSERT INTO project_professors (project_id, professor_id) VALUES ($1, $2);';
        for (const professorId of professorIds) {
            await client.query(insertProfessorQuery, [newProjectId, professorId]);
        }
    }
    
    // Inserción de autores (Egresados) validando que sea un arreglo válido
    if (Array.isArray(alumniIds) && alumniIds.length > 0) {
        const insertAlumniQuery = 'INSERT INTO project_alumni (project_id, user_id) VALUES ($1, $2);';
        for (const alumniId of alumniIds) {
            await client.query(insertAlumniQuery, [newProjectId, alumniId]);
        }
    }
    
    // CONFIRMACIÓN DE LA TRANSACCIÓN
    await client.query('COMMIT');

    return res.status(201).json({ 
      message: 'Proyecto creado con éxito.', 
      projectId: newProjectId 
    });

  } catch (error) {
    // Cancelación de los cambios si alguna consulta falla
    await client.query('ROLLBACK');
    
    // Trazas técnicas
    console.error('[ERROR] Transaction failed while creating project:', error);
    
    // Mensaje genérico y seguro para el frontend
    return res.status(500).json({ message: 'Error interno del servidor al crear el proyecto.' });
  } finally {
    // Siempre liberar el cliente de vuelta al pool para evitar memory leaks
    client.release();
  }
};

module.exports = { createProject };