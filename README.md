# Go Rank First - Servicios de IA

## Descripción
Sitio web para servicios de Automatización con IA, Creación de Agentes y Capacitación en Inteligencia Artificial.

## 🚀 Despliegue en GitHub Pages

El sitio está configurado para desplegarse automáticamente en GitHub Pages cuando se hace push a la rama `main`.

### URL de Producción
https://gointeraction.github.io/gorank/

## 🛠 Tecnologías

- ⚡ [Astro](https://astro.build/) - Framework web todo en uno
- 🎨 [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- 📦 [TypeScript](https://www.typescriptlang.org/) - JavaScript tipado
- 🚀 [GitHub Actions](https://github.com/features/actions) - CI/CD

## 🚀 Instalación local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/gointeraction/gorank.git
   cd gorank
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```
   El sitio estará disponible en http://localhost:3000

4. Construir para producción:
   ```bash
   npm run build
   ```
   Los archivos estáticos se generarán en la carpeta `dist/`

## 🚀 Despliegue

### GitHub Pages
El despliegue es automático a través de GitHub Actions. Cada push a la rama `main` activa el flujo de trabajo que:

1. Construye la aplicación
2. Despliega los archivos estáticos en la rama `gh-pages`

### Configuración manual
Si necesitas desplegar manualmente:

```bash
npm run deploy:gh-pages
```

## 🏗 Estructura del proyecto

```
├── public/             # Archivos estáticos
├── src/
│   ├── components/    # Componentes de Astro
│   ├── layouts/        # Layouts de la aplicación
│   ├── pages/          # Rutas de la aplicación
│   └── styles/         # Estilos globales
├── .github/workflows/  # Flujos de trabajo de GitHub Actions
└── astro.config.mjs    # Configuración de Astro
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

Para más información, visita nuestra [página de contacto](https://gointeraction.github.io/gorank/contacto).
