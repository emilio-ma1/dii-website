/**
 * @file Punto de entrada principal de la aplicación (index.js).
 * @description
 * Este módulo actúa como el orquestador principal para el inicio del backend.
 * * Responsabilidades:
 * - Inicializar la configuración global y variables de entorno.
 * - Registrar dependencias y middlewares de seguridad (Helmet, CORS).
 * - Montar las rutas principales de la API (Auth, News, Projects).
 * - Levantar el servidor HTTP en el puerto designado.
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Importar rutas de la API
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// URL del frontend obtenida desde variables de entorno
const CORS_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middlewares Globales
app.use(helmet()); // Seguridad de cabeceras HTTP
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json()); // Parseo de JSON en el Body de las peticiones

// Montaje de Rutas
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/projects', projectRoutes);

// Ruta base de comprobación (Health Check)
app.get('/', (req, res) => {
  res.send('API del DII funcionando correctamente con Express');
});

// Inicialización del servidor
app.listen(PORT, () => {
  // Log de inicio
  console.info(`[INFO] Server successfully running on port ${PORT}`);
  console.info(`[INFO] Accepting CORS requests from: ${CORS_ORIGIN}`);
});