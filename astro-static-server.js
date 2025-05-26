const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 3003;
const rootDir = path.join(__dirname, 'dist');

// Mapeo de tipos MIME
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'application/font-woff',
  '.woff2': 'application/font-woff2',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
  try {
    // Parsear la URL
    const parsedUrl = url.parse(req.url);
    let pathname = path.normalize(parsedUrl.pathname);
    
    console.log('Ruta solicitada:', pathname);
    
    // Manejar rutas sin extensión
    if (!path.extname(pathname)) {
      // Si es la raíz o una ruta de directorio
      if (pathname.endsWith('/')) {
        pathname = path.join(pathname, 'index.html');
      } else {
        // Si no tiene extensión, asumir que es una ruta de página
        pathname = path.join(pathname, 'index.html');
      }
    }
    
    // Obtener la extensión del archivo
    const ext = path.extname(pathname).toLowerCase();
    
    // Construir la ruta completa
    let filePath = path.join(rootDir, pathname);
    
    // Asegurarse de que la ruta esté dentro del directorio raíz por seguridad
    if (!filePath.startsWith(path.normalize(rootDir) + path.sep)) {
      console.log('Intento de acceso fuera del directorio raíz:', filePath);
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('Acceso denegado');
    }
    
    console.log(`Solicitando: ${filePath}`);
    
    // Verificar si el archivo existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // Si no existe, intentar con .html
        if (!ext) {
          filePath = path.join(rootDir, pathname + '.html');
          console.log(`Intentando con extensión: ${filePath}`);
          
          fs.access(filePath, fs.constants.F_OK, (err2) => {
            if (err2) {
              // Si aún no existe, servir index.html (SPA)
              serveIndexHtml(res);
            } else {
              serveFile(filePath, res);
            }
          });
        } else {
          // Si tiene extensión pero no existe, servir index.html (SPA)
          serveIndexHtml(res);
        }
      } else {
        // El archivo existe, servirlo
        serveFile(filePath, res);
      }
    });
    
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error interno del servidor');
  }
});

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      console.error(`Error al leer el archivo ${filePath}:`, error);
      res.writeHead(500);
      res.end('Error interno del servidor');
    } else {
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000'
      });
      res.end(content, 'utf-8');
    }
  });
}

function serveIndexHtml(req, res) {
  const indexPath = path.join(rootDir, 'index.html');
  console.log('Sirviendo SPA desde:', indexPath);
  
  fs.readFile(indexPath, (error, content) => {
    if (error) {
      console.error('Error al leer index.html:', error);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Página no encontrada');
    } else {
      res.writeHead(200, { 
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
      });
      res.end(content, 'utf-8');
    }
  });
}

// Iniciar el servidor
server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Servidor ejecutándose en http://localhost:${port}/`);
  console.log(`📁 Directorio raíz: ${rootDir}`);
  console.log('🛑 Presiona Ctrl+C para detener el servidor\n');
});

// Manejar cierre del proceso
process.on('SIGINT', () => {
  console.log('\nDeteniendo el servidor...');
  process.exit();
});
