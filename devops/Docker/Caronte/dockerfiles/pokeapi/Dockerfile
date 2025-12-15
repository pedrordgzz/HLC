# --- ETAPA 1: CONSTRUCCIÓN (Compilar React) ---
# Usamos una imagen oficial de Node para compilar
FROM node:18-alpine AS builder

ARG PROYECTO

WORKDIR /app

# Copiamos los package.json primero (para aprovechar la caché de Docker)
# NOTA: Asegúrate de que package.json está en proyectos/${PROYECTO}/
COPY ./proyectos/${PROYECTO}/package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos TODO el código fuente (src, public, etc.)
COPY ./proyectos/${PROYECTO}/ .

# Compilamos (esto genera la carpeta /app/dist)
RUN npm run build


# --- ETAPA 2: SERVIDOR (Tu imagen base) ---
FROM peedroorgzz/nginx

ARG PROYECTO

USER root

# Copiamos los archivos YA COMPILADOS desde la Etapa 1 (builder)
# Nota: --from=builder nos permite coger ficheros de la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/dist /var/www/html

# Copiamos y preparamos el script de inicio
COPY ./dockerfiles/${PROYECTO}/admin/start.sh /root/admin/base/start.sh
RUN chmod +x /root/admin/base/start.sh

# Entrypoint fijo apuntando al script
ENTRYPOINT [ "/root/admin/base/start.sh" ]