/**
 * @file Configuración de la conexión a la base de datos (PostgreSQL).
 * @description
 * Este módulo inicializa y exporta el pool de conexiones a la base de datos
 * utilizando las credenciales provistas mediante variables de entorno.
 * * Responsabilidades:
 * - Establecer la conexión con PostgreSQL.
 * - Manejar y registrar eventos de éxito y errores de conexión del pool.
 */
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Evento que se dispara al conectar exitosamente un nuevo cliente
pool.on('connect', () => {
  console.info('[INFO] Database connected successfully');
});

// Manejo de errores fatales e inesperados en el pool de conexiones
pool.on('error', (err) => {
  console.error('[ERROR] Unexpected database error on idle client:', err);
  process.exit(-1);
});

module.exports = pool;