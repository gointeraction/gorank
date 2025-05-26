const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3003;

const server = http.createServer((req, res) => {
  console.log(`Petición: ${req.method} ${req.url}`);
  
  // Eliminar parámetros de consulta y fragmentos
  let filePath = req.url.split('?')[0].split('#')[0];
  
  // Si es la raíz, servir index.html
  if (filePath === '/') {
    filePath = '/index.html';
  }
  
  // Construir la ruta completa
  const fullPath = path.join(__dirname, 'dist', filePath);
  
  // Determinar el tipo de contenido
  const extname = path.extname(fullPath).toLowerCase();
  let contentType = 'text/html';
  
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.gif':
      contentType = 'image/gif';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
    case '.ico':
      contentType = 'image/x-icon';
      break;
  }
  
  // Leer el archivo
  fs.readFile(fullPath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Archivo no encontrado, servir index.html para SPA
        fs.readFile(path.join(__dirname, 'dist', 'index.html'), (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end('Error al cargar index.html');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        });
      } else {
        // Error del servidor
        res.writeHead(500);
        res.end(`Error del servidor: ${error.code}`);
      }
    } else {
      // Archivo encontrado
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Servidor ejecutándose en http://localhost:${port}/`);
  console.log('📁 Sirviendo archivos desde:', path.join(__dirname, 'dist'));
  console.log('🛑 Presiona Ctrl+C para detener el servidor\n');
});

// Manejar cierre del proceso
process.on('SIGINT', () => {
  console.log('\nDeteniendo el servidor...');
  process.exit();
});
