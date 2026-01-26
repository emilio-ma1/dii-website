const pool = require('../config/db');

const createProject = async (req, res) => {
  const { title, abstract, year, pdf_url, professor_ids, alumni_ids } = req.body;

  const client = await pool.connect();

  try {
    // INICIO DE LA TRANSACCION
    await client.query('BEGIN'); 

    const projectQueryText = 'INSERT INTO projects (title, abstract, pdf_url, year) VALUES ($1, $2, $3, $4) RETURNING id;';
    const projectValues = [title, abstract, pdf_url, year];
    
    const resultProject = await client.query(projectQueryText, projectValues);
    const newProjectId = resultProject.rows[0].id;
    
    if (professor_ids && professor_ids.length > 0) {
        for (const profId of professor_ids) {
            await client.query('INSERT INTO project_professors (project_id, professor_id) VALUES ($1, $2);', [newProjectId, profId]);
        }
    }
    
    if (alumni_ids && alumni_ids.length > 0) {
        for (const alumniId of alumni_ids) {
            await client.query('INSERT INTO project_alumni (project_id, users_id) VALUES ($1, $2);', [newProjectId, alumniId]);
        }
    }
    await client.query('COMMIT');

    res.status(201).json({ message: 'Proyecto creado con éxito', projectId: newProjectId });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creando proyecto:', error);
    res.status(500).json({ error: 'Error al crear el proyecto' });
  } finally {
    client.release();
  }
};

module.exports = { createProject };