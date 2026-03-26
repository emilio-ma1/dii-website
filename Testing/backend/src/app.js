// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const professorRoutes = require('./routes/professorRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');

const app = express();

const CORS_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(helmet());
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/professors', professorRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/audit-logs', auditLogRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API del DII funcionando correctamente con Express' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'El endpoint solicitado no existe en esta API.' });
});

app.use((err, req, res, next) => {
  console.error('[FATAL UNHANDLED ERROR]', err.stack);
  res.status(500).json({ message: 'Error interno del servidor. Por favor, contacte al soporte.' });
});

module.exports = app;