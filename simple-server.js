import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createReadStream } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 3003;

const server = http.createServer((req, res) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  
  // Manejar solicitud a la raíz
  const urlPath = req.url.split('?')[0];
  let filePath;
  
  // Lista de extensiones de archivo estático
  const staticExtensions = ['.js', '.css', '.json', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
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
  } 
  // Para cualquier otra ruta, servir index.html (SPA)
  else {
    filePath = path.join(__dirname, 'dist', 'index.html');
  }

  console.log(`Intentando servir: ${filePath}`);
  
  // Si el archivo no existe, servir index.html para SPA
  if (!fs.existsSync(filePath)) {
    if (!filePath.endsWith('index.html')) {
      console.log('Archivo no encontrado, sirviendo index.html');
      filePath = path.join(__dirname, 'dist', 'index.html');
    } else {
      // Si index.html no existe, devolver 404
      res.writeHead(404);
      return res.end('Página no encontrada');
    }
  }

  // Determinar el tipo de contenido basado en la extensión del archivo
  const extname = path.extname(filePath).toLowerCase();
  let contentType = 'text/html';
  
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
  
  contentType = mimeTypes[extname] || 'application/octet-stream';
  
  // Configurar cabeceras de caché para archivos estáticos
  const headers = { 'Content-Type': contentType };
  
  // Agregar cabeceras de caché para archivos estáticos (1 año)
  if (extname && extname !== '.html') {
    headers['Cache-Control'] = 'public, max-age=31536000';
    headers['Expires'] = new Date(Date.now() + 31536000000).toUTCString();
  }
  
  // Usar stream para archivos grandes
  const stream = createReadStream(filePath);
  
  stream.on('open', () => {
    res.writeHead(200, headers);
    stream.pipe(res);
  });
  
  stream.on('error', (err) => {
    console.error(`Error al leer el archivo: ${err}`);
    if (filePath.endsWith('index.html')) {
      res.writeHead(500);
      res.end('Error interno del servidor');
    } else {
      // Si hay un error con un archivo estático, intentar servir index.html
      const indexPath = path.join(__dirname, 'dist', 'index.html');
      if (fs.existsSync(indexPath)) {
        const indexStream = createReadStream(indexPath);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        indexStream.pipe(res);
      } else {
        res.writeHead(404);
        res.end('Página no encontrada');
      }
    }
  });
  
  return; // Salir temprano ya que manejamos la respuesta con streams
  
  // Código antiguo (no se ejecutará debido al return anterior)
  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error(`Error: ${err}`);
      if (err.code === 'ENOENT') {
        // Si es un archivo no encontrado, servir index.html para SPA
        const indexPath = path.join(__dirname, 'dist', 'index.html');
        if (fs.existsSync(indexPath)) {
          const indexContent = fs.readFileSync(indexPath);
          res.writeHead(200, { 'Content-Type': 'text/html' });
          return res.end(indexContent, 'utf-8');
        }
      }
      res.writeHead(500);
      return res.end(`Error del servidor: ${err.code}`);
    } else {
      // Determinar el tipo de contenido basado en la extensión del archivo
      const extname = path.extname(filePath);
      let contentType = 'text/html';
      
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
      
      contentType = mimeTypes[extname] || 'application/octet-stream';
      
      // Configurar cabeceras de caché para archivos estáticos
      const headers = { 'Content-Type': contentType };
      
      // Agregar cabeceras de caché para archivos estáticos (1 año)
      if (extname && extname !== '.html') {
        headers['Cache-Control'] = 'public, max-age=31536000';
        headers['Expires'] = new Date(Date.now() + 31536000000).toUTCString();
      }
      
      // Corregir error de sintaxis en la estructura if-else
      if (extname === '.svg') {
        headers['Content-Type'] = 'image/svg+xml';
      } else if (extname === '.png') {
        headers['Content-Type'] = 'image/png';
      } else if (extname === '.jpg' || extname === '.jpeg') {
        headers['Content-Type'] = 'image/jpeg';
      } else if (extname === '.ico') {
        headers['Content-Type'] = 'image/x-icon';
        } else if (extname === '.ico') {
          headers['Content-Type'] = 'image/x-icon';
        }
      }
      
      res.writeHead(200, headers);
      res.end(content, 'utf-8');
    }
  });


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
