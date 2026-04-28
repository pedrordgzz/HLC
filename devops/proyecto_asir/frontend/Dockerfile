# --- Stage 1: Build con imagen Node personalizada ---
FROM peedroorgzz/nodejs AS builder
USER root
# Resetear ENTRYPOINT para que los comandos RUN funcionen sin interferencia
ENTRYPOINT []

WORKDIR /app

# Copiar package files e instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Variables de entorno para el build de Vite (se resuelven en compilación)
ARG VITE_AUTH_API_URL=/api/auth
ARG VITE_PRODUCTS_API_URL=/api/products
ENV VITE_AUTH_API_URL=${VITE_AUTH_API_URL}
ENV VITE_PRODUCTS_API_URL=${VITE_PRODUCTS_API_URL}

# Compilar el frontend
RUN npm run build

# --- Stage 2: Servir estáticos con imagen Nginx personalizada ---
FROM peedroorgzz/nginx
USER root
# Resetear ENTRYPOINT de la imagen base (su start.sh arranca SSH y hace tail -f)
ENTRYPOINT []

# Limpiar contenido por defecto de nginx
RUN rm -rf /var/www/html/*

# Copiar el build compilado
COPY --from=builder /app/dist /var/www/html/

# Limpiar cualquier configuración por defecto
RUN rm -f /etc/nginx/sites-enabled/default /etc/nginx/sites-available/default /etc/nginx/conf.d/default.conf

# Configuración de Nginx para SPA React
COPY nginx/default.conf /etc/nginx/conf.d/petstore.conf

# Permisos
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
