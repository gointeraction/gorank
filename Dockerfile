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
    && echo "America/Santiago" > /etc/timezone

# Configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Copiar archivos estáticos
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración de salud
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Exponer puerto
EXPOSE 3000

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
