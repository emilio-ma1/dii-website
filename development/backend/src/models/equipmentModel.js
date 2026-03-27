const pool = require("../config/db");

async function getAll() {
  const query = `
    SELECT id, name, description, image_url
    FROM equipment
    ORDER BY id ASC
  `;
  const { rows } = await pool.query(query);
  return rows;
}

async function getById(id) {
  const query = `
    SELECT id, name, description, image_url
    FROM equipment
    WHERE id = $1
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
}

async function create({ name, description, image_url }) {
  const query = `
    INSERT INTO equipment (name, description, image_url)
    VALUES ($1, $2, $3)
    RETURNING id, name, description, image_url
  `;
  const values = [name, description || "", image_url || ""];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function update(id, { name, description, image_url }) {
  const query = `
    UPDATE equipment
    SET name = $1,
    description = $2,
    image_url = $3
    WHERE id = $4
    RETURNING id, name, description, image_url
  `;
  const values = [name, description || "", image_url || "", id];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function remove(id) {
  const query = `
    DELETE FROM equipment
    WHERE id = $1
    RETURNING id
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};