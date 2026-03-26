// src/index.js
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173';

app.listen(PORT, '0.0.0.0', () => {
  console.info(`[INFO] Server successfully running on port ${PORT}`);
  console.info(`[INFO] Accepting CORS requests from: ${CORS_ORIGIN}`);
});