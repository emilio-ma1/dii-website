const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
//const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const projectRoutes = require('./routes/proyectRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite que React se comunique
app.use(express.json()); // Entiende los JSON que llegan en el Body

// Rutas
//app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/projects', projectRoutes);

// Ruta de prueba base
app.get('/', (req, res) => {
  res.send('API del DII funcionando correctamente con Express');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});