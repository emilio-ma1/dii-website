const sendJSON = (res, statusCode, data) => {
    res.setHeader('Content-Type', 'application/json');
    // Headers para CORS (Para que React no falle)
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    res.writeHead(statusCode);
    res.end(JSON.stringify(data));
};

module.exports = sendJSON;