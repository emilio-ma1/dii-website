const { Pool } = require('pg');
require('dotenv').config();

// Creamos la conexión usando las variables de tu archivo .env
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Mensaje de exito cuando se conecta
pool.on('connect', () => {
  console.log('Base de datos conectada exitosamente');
});

// Manejo de errores
pool.on('error', (err) => {
  console.error('Error inesperado en la base de datos', err);
  process.exit(-1);
});

module.exports = pool;