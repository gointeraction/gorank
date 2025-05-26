# Etapa de construcción
FROM node:20-alpine as builder
WORKDIR /app

# Instalar dependencias de compilación
RUN apk add --no-cache python3 make g++

# Instalar dependencias
COPY package*.json ./
RUN npm ci --only=production

# Copiar archivos y construir
COPY . .
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Instalar dependencias necesarias
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/America/Santiago /etc/localtime \
    && echo "America/Santiago" > /etc/timezone \
    # Limpiar caché
    && rm -rf /var/cache/apk/* \
    # Crear directorio para logs
    && mkdir -p /var/log/nginx/ \
    && touch /var/log/nginx/access.log /var/log/nginx/error.log \
    # Asegurar permisos
    && chown -R nginx:nginx /var/log/nginx/ \
    && chown -R nginx:nginx /var/cache/nginx/ \
    && chown -R nginx:nginx /etc/nginx/conf.d/ \
    && touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/run/nginx.pid

# Configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Copiar archivos estáticos
COPY --from=builder /app/dist /usr/share/nginx/html

# Asegurar permisos de los archivos estáticos
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

# Configuración de salud
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3003/ || exit 1

# Exponer puerto
EXPOSE 3003

# Usar usuario no-root
USER nginx

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
