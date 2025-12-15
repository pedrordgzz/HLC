# --- ETAPA 1: CONSTRUCCIÓN (Igual que antes) ---
FROM node:18-alpine AS builder
ARG PROYECTO
WORKDIR /app
COPY ./proyectos/${PROYECTO}/package*.json ./
RUN npm install
COPY ./proyectos/${PROYECTO}/ .
RUN npm run build

# --- ETAPA 2: SERVIDOR ---
FROM peedroorgzz/nginx

ARG PROYECTO
USER root

# 1. ELIMINAMOS la página de "Welcome to Nginx" por defecto
# Esto es crucial para asegurar que no quede basura
RUN rm -rf /usr/share/nginx/html/*
RUN rm -rf /var/www/html/*

# 2. Copiamos tu aplicación compilada
# Nota: Copiamos el contenido DE DENTRO de dist (/*) a la raíz de html
COPY --from=builder /app/dist/ /usr/share/nginx/html/
COPY --from=builder /app/dist/ /var/www/html/

# 3. Copiamos el script de inicio
COPY ./dockerfiles/${PROYECTO}/admin/start.sh /root/admin/base/start.sh
RUN chmod +x /root/admin/base/start.sh

ENTRYPOINT [ "/root/admin/base/start.sh" ]