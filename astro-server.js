import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 3003;

// Mapeo de extensiones a tipos MIME
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
  '.woff': 'application/font-woff',
  '.woff2': 'application/font-woff2',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.webp': 'image/webp'
};

// Extensiones de archivos estáticos
const staticExtensions = new Set(Object.keys(mimeTypes));

const server = http.createServer((req, res) => {
  try {
    // Manejar solicitud a la raíz
    const urlPath = req.url.split('?')[0].split('#')[0];
    let filePath = path.join(__dirname, 'dist', urlPath);
    const ext = path.extname(urlPath).toLowerCase();
    
    console.log(`Solicitud: ${req.method} ${urlPath}`);
    
    // Verificar si es un archivo estático
    const isStaticFile = staticExtensions.has(ext);
    
    if (isStaticFile) {
      // Si el archivo no existe, intentar rutas alternativas para imágenes
      if (!fs.existsSync(filePath) && (ext === '.png' || ext === '.svg' || ext === '.jpg' || ext === '.jpeg')) {
        const altPath = path.join(__dirname, 'dist', 'images', 'logos', 'tecnopublic.svg');
        if (fs.existsSync(altPath)) {
          filePath = altPath;
        }
      }
    } else {
      // Para rutas no estáticas, servir index.html (SPA)
      filePath = path.join(__dirname, 'dist', 'index.html');
    }

    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      // Si no existe, servir index.html (SPA)
      filePath = path.join(__dirname, 'dist', 'index.html');
      console.log(`Archivo no encontrado, sirviendo: ${filePath}`);
      
      if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('Página no encontrada');
      }
    }

    // Determinar el tipo de contenido
    const extname = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // Configurar cabeceras
    const headers = { 'Content-Type': contentType };
    
    // Agregar cabeceras de caché para archivos estáticos (1 año)
    if (isStaticFile) {
      headers['Cache-Control'] = 'public, max-age=31536000';
      headers['Expires'] = new Date(Date.now() + 31536000000).toUTCString();
    }
    
    // Leer y servir el archivo
    const fileStream = fs.createReadStream(filePath);
    
    fileStream.on('error', (error) => {
      console.error(`Error al leer el archivo: ${error}`);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error interno del servidor');
    });
    
    res.writeHead(200, headers);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error interno del servidor');
  }
});

// Iniciar el servidor
server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Servidor ejecutándose en http://localhost:${port}/`);
  console.log('📁 Directorio raíz:', path.join(__dirname, 'dist'));
  console.log('🛑 Presiona Ctrl+C para detener el servidor\n');
});

// Manejar cierre del proceso
process.on('SIGINT', () => {
  console.log('\nDeteniendo el servidor...');
  process.exit();
});
