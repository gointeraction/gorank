import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 3003;

const MIME_TYPES = {
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
  '.woff': 'application/font-woff',
  '.woff2': 'application/font-woff2',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg'
};

const server = http.createServer((req, res) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  
  // Manejar solicitud a la raíz
  let urlPath = req.url.split('?')[0]; // Eliminar query strings
  
  // Corregir rutas que empiezan con /gorank/
  if (urlPath.startsWith('/gorank/')) {
    urlPath = urlPath.replace('/gorank', '');
  }
  
  let filePath = urlPath === '/' 
    ? path.join(__dirname, 'dist', 'index.html')
    : path.join(__dirname, 'dist', urlPath);

  // Asegurarse de que la ruta esté dentro del directorio dist por seguridad
  const distPath = path.join(__dirname, 'dist');
  const resolvedPath = path.resolve(filePath);
  
  if (!resolvedPath.startsWith(distPath)) {
    res.writeHead(403);
    return res.end('Acceso no permitido');
  }

  // Determinar el tipo de contenido basado en la extensión del archivo
  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  // Si no hay extensión, asumir que es una ruta de la SPA
  if (!extname) {
    filePath = path.join(__dirname, 'dist', 'index.html');
  }

  console.log(`Intentando servir: ${filePath}`);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error(`Error al leer el archivo ${filePath}:`, err);
      
      if (err.code === 'ENOENT') {
        // Archivo no encontrado, servir index.html para SPA
        fs.readFile(path.join(__dirname, 'dist', 'index.html'), (err, content) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 No Encontrado', 'utf-8');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        });
      } else {
        // Error del servidor
        res.writeHead(500);
        res.end(`Error del servidor: ${err.code}`);
      }
    } else {
      // Archivo encontrado, servirlo con el tipo de contenido apropiado
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      res.end(content, 'utf-8');
    }
  });
});

// Manejar cierre del proceso
process.on('SIGINT', () => {
  console.log('\nDeteniendo el servidor...');
  process.exit();
});

// Iniciar el servidor
server.listen(port, '0.0.0.0', () => {
  console.log(`\n✅ Servidor ejecutándose en http://localhost:${port}/`);
  console.log('📁 Directorio raíz:', path.join(__dirname, 'dist'));
  console.log('🛑 Presiona Ctrl+C para detener el servidor\n');
});
