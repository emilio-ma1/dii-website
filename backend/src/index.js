const http = require('http');
const getBody = require('./utils/bodyParser');
const sendJSON = require('./utils/responseHelper');
require('dotenv').config();
//Controladores
//const { login } = require('./controllers/authController');
const { getNews, createNews } = require('./controllers/newsController');

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
    // Manejo de CORS Preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.writeHead(204);
        res.end();
        return;
    }

    // Enrutamiento Manual
    const { url, method } = req;

    try {
        // Rutas del auth
        if (url === '/api/auth/login' && method === 'POST') {
            const body = await getBody(req);
            req.body = body; 
            await login(req, res);
        }
        
        // Rutas de Noticias
        else if (url === '/api/news' && method === 'GET') {
            await getNews(req, res);
        }
        
        else if (url === '/api/news' && method === 'POST') {
            const body = await getBody(req);
            req.body = body;
            await createNews(req, res);
        }

        // RUTA 404
        else {
            sendJSON(res, 404, { error: 'Ruta no encontrada' });
        }

    } catch (error) {
        console.error(error);
        sendJSON(res, 500, { error: 'Error interno del servidor' });
    }
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});