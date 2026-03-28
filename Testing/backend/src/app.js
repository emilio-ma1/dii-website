// src/app.js
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

// Import API routes
const authRoutes = require('./routes/authRoutes')
const newsRoutes = require('./routes/newsRoutes')
const projectRoutes = require('./routes/projectRoutes')
const userRoutes = require('./routes/userRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const professorRoutes = require('./routes/professorRoutes')
const alumniRoutes = require('./routes/alumniRoutes')
const auditLogRoutes = require('./routes/auditLogRoutes')
const equipmentRoutes = require('./routes/equipmentRoutes')
const contactRoutes = require('./routes/contactRoutes')

const app = express()

const CORS_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173'

// Global Middlewares
app.use(helmet())
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}))
app.use(express.json())

// Route Mounting
app.use('/api/auth', authRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/users', userRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/professors', professorRoutes)
app.use('/api/alumni', alumniRoutes)
app.use('/api/audit-logs', auditLogRoutes)
app.use('/api/equipment', equipmentRoutes)
app.use('/api/contacts', contactRoutes)

// Base health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API del DII funcionando correctamente con Express' })
})

// Unmatched Routes Handler (404 API Fallback)
app.use((req, res) => {
  res.status(404).json({ message: 'El endpoint solicitado no existe en esta API.' })
})

// Global Error Handling Middleware (500 Fallback)
app.use((err, req, res, next) => {
  console.error('[FATAL UNHANDLED ERROR]', err.stack)
  res.status(500).json({ message: 'Error interno del servidor. Por favor, contacte al soporte.' })
})

module.exports = app