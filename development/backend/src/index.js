const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const projectRoutes = require('./routes/proyectRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json()); // Entiende los JSON que llegan en el Body


// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/projects', projectRoutes);

app.get('/', (req, res) => {
  res.send('API del DII funcionando correctamente con Express');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});