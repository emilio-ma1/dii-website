// Función para esperar a que lleguen todos los datos y convertirlos a JSON
const getBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                // Si no mandan nada devolvemos objeto vacio
                const parsed = body ? JSON.parse(body) : {};
                resolve(parsed);
            } catch (error) {
                reject(error);
            }
        });
        
        req.on('error', (err) => {
            reject(err);
        });
    });
};

module.exports = getBody;