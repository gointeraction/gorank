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
  '.eot': 'application/vnd.ms-fontobject'
};

// Extensiones de archivos estáticos
const staticExtensions = Object.keys(mimeTypes);

const server = http.createServer((req, res) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  
  // Manejar solicitud a la raíz
  const urlPath = req.url.split('?')[0];
  let filePath;
  
  // Obtener extensión del archivo solicitado
  const ext = path.extname(urlPath).toLowerCase();
  
  // Si es un archivo estático, intentar servirlo
  if (staticExtensions.includes(ext)) {
    filePath = path.join(__dirname, 'dist', urlPath);
    
    // Si el archivo no existe, intentar rutas alternativas para imágenes
    if (!fs.existsSync(filePath) && (ext === '.png' || ext === '.svg') && urlPath.includes('/integrations/')) {
      const altPath = path.join(__dirname, 'dist', 'images', 'logos', 'tecnopublic.svg');
      if (fs.existsSync(altPath)) {
        filePath = altPath;
      }
    }
    
    // Si el archivo estático no existe, servir index.html
    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, 'dist', 'index.html');
    }
  } 
  // Para cualquier otra ruta, servir index.html (SPA)
  else {
    filePath = path.join(__dirname, 'dist', 'index.html');
  }

  console.log(`Intentando servir: ${filePath}`);
  
  // Si el archivo no existe, servir index.html para SPA
  if (!fs.existsSync(filePath)) {
    console.log('Archivo no encontrado, sirviendo index.html');
    filePath = path.join(__dirname, 'dist', 'index.html');
    
    // Verificar si el index.html existe
    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Error: No se encontró el archivo index.html');
    }
  }

  // Determinar el tipo de contenido basado en la extensión del archivo
  const extname = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  // Configurar cabeceras
  const headers = { 'Content-Type': contentType };
  
  // Agregar cabeceras de caché para archivos estáticos (1 año)
  if (extname && extname !== '.html') {
    headers['Cache-Control'] = 'public, max-age=31536000';
    headers['Expires'] = new Date(Date.now() + 31536000000).toUTCString();
  }
  
  // Leer y servir el archivo
  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error(`Error al leer el archivo: ${err}`);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('Error interno del servidor');
    }
    
    res.writeHead(200, headers);
    res.end(content, 'utf-8');
  });
});

// Iniciar el servidor
server.listen(port, () => {
  console.log(`✅ Servidor ejecutándose en http://localhost:${port}/`);
  console.log('📁 Directorio raíz:', path.join(__dirname, 'dist'));
  console.log('🛑 Presiona Ctrl+C para detener el servidor\n');
});

// Manejar cierre del proceso
process.on('SIGINT', () => {
  console.log('\nDeteniendo el servidor...');
  process.exit();
});
