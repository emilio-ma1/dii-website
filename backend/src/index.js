const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar tus rutas de noticias
const newsRoutes = require('./routes/newsRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares (Configuraciones previas)
app.use(cors());
app.use(express.json());

app.use('/api/news', newsRoutes); 

app.get('/', (req, res) => {
  res.send('API del DII funcionando. Intenta ir a /api/news');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});