import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';

export default defineConfig({
  // Configuración base para las rutas
  base: '/',
  // Configuración de resolución de módulos
  resolve: {
    alias: {
      // Mapeo de rutas absolutas
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Configuración del servidor de desarrollo
  server: {
    fs: {
      // Permite servir archivos desde el directorio raíz del proyecto
      strict: false,
    },
    // Configuración de HMR (Hot Module Replacement)
    hmr: {
      overlay: true,
    },
  },
  
  // Optimizaciones de dependencias
  optimizeDeps: {
    include: [
      '@astrojs/tailwind',
      'tailwindcss',
      'autoprefixer',
    ]
  },
  
  // Configuración de compilación
  build: {
    // Genera mapas de origen para depuración
    sourcemap: process.env.NODE_ENV !== 'production',
    // Configuración de minificación
    minify: process.env.NODE_ENV === 'production' ? 'esbuild' : false,
    // Configuración de chunking
    rollupOptions: {
      output: {
        manualChunks: {
          // Separa el código de las dependencias en chunks separados
          vendor: ['react', 'react-dom', 'astro'],
        },
      },
    },
  }
});
