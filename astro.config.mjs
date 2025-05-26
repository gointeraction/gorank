import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  // Configuración del sitio para producción
  site: 'https://gointeraction.github.io/gorank',
  base: '/gorank/',
  // Configuración para el servidor de desarrollo
  server: {
    port: 3000,
    host: true,
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    },
    // Configuración para manejar rutas con/sin barra final
    trailingSlash: 'ignore',
    // Forzar el uso de URLs relativas
    hostname: 'localhost',
    // Configuración para desarrollo local
    open: '/',
    // Configuración para hot module replacement
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3000
    }
  },
  
  // Configuración de salida
  output: 'static',
  
  // Configuración del servidor
  server: {
    port: 3000,
    host: true,
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    },
    // Forzar el uso del puerto en las URLs generadas
    hostname: 'localhost:3000',
    // Configuración para manejar rutas con/sin barra final
    trailingSlash: 'ignore'
  },
  
  // Integraciones
  integrations: [
    tailwind({
      // Opciones de configuración de Tailwind
      config: {
        // Ruta al archivo de configuración de Tailwind
        path: './tailwind.config.mjs',
        // Aplicar estilos base de Tailwind
        applyBaseStyles: true
      }
    }),
    icon({
      include: {
        'ph': ['*']
      },
      svgProps: {
        'class': 'icon'
      }
    })
  ],
  
  // Configuración de compilación
  build: {
    // Generar sourcemaps en desarrollo
    sourcemap: process.env.NODE_ENV !== 'production',
  },
  
  // Configuración de Vite
  vite: {
    // Configuración de alias para rutas absolutas
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    // Optimización de dependencias
    optimizeDeps: {
      include: ['@astrojs/tailwind', 'astro-icon'],
      exclude: []
    }
  }
});
