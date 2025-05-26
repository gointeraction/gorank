const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

const DIST_DIR = path.join(__dirname, 'dist');
const PAGES_DIR = path.join(__dirname, 'src', 'pages');

// Mapeo de rutas especiales (si es necesario)
const SPECIAL_ROUTES = {
  'index.html': 'index.astro',
  '404.html': '404.astro'
};

// Función para convertir HTML a Astro
function convertToAstro(htmlContent, filePath) {
  // Extraer el título de la página
  const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : path.basename(filePath, '.html');
  
  // Extraer el contenido dentro del body
  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : htmlContent;

  // Crear el contenido de Astro
  return `---
// src/pages/${filePath}
const { title } = Astro.props;
---

<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>${title}</title>
  </head>
  <body>
    ${bodyContent}
  </body>
</html>
`;
}

// Función principal
async function recoverPages() {
  try {
    // Crear directorio de páginas si no existe
    await mkdir(PAGES_DIR, { recursive: true });
    
    // Leer directorio dist
    const items = await readdir(DIST_DIR, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = path.join(DIST_DIR, item.name);
      const stats = await stat(itemPath);
      
      if (stats.isDirectory() && item.name !== '_astro' && item.name !== 'images' && item.name !== 'img') {
        // Procesar subdirectorios
        const subItems = await readdir(itemPath, { withFileTypes: true });
        
        for (const subItem of subItems) {
          if (subItem.isFile() && subItem.name.endsWith('.html')) {
            await processHtmlFile(path.join(item.name, subItem.name));
          }
        }
      } else if (item.isFile() && item.name.endsWith('.html')) {
        // Procesar archivos HTML en la raíz
        await processHtmlFile(item.name);
      }
    }
    
    console.log('¡Proceso de recuperación completado!');
    console.log('Las páginas se han guardado en:', PAGES_DIR);
    
  } catch (error) {
    console.error('Error al recuperar las páginas:', error);
  }
}

// Procesar archivo HTML
async function processHtmlFile(relativePath) {
  try {
    const sourcePath = path.join(DIST_DIR, relativePath);
    const targetPath = getTargetPath(relativePath);
    
    // Crear directorio de destino si no existe
    await mkdir(path.dirname(targetPath), { recursive: true });
    
    // Leer contenido HTML
    const htmlContent = await readFile(sourcePath, 'utf-8');
    
    // Convertir a Astro
    const astroContent = convertToAstro(htmlContent, relativePath);
    
    // Escribir archivo Astro
    await writeFile(targetPath, astroContent, 'utf-8');
    
    console.log(`✅ ${relativePath} -> ${path.relative(process.cwd(), targetPath)}`);
    
  } catch (error) {
    console.error(`❌ Error al procesar ${relativePath}:`, error.message);
  }
}

// Obtener ruta de destino para el archivo Astro
function getTargetPath(relativePath) {
  const dirname = path.dirname(relativePath);
  const basename = path.basename(relativePath);
  const astroBasename = SPECIAL_ROUTES[basename] || basename.replace(/\.html$', '.astro');
  
  return path.join(PAGES_DIR, dirname, astroBasename);
}

// Ejecutar la recuperación
recoverPages();
