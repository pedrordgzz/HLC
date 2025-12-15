FROM peedroorgzz/nginx

ARG PROYECTO

USER root

# Instalamos Node.js y NPM
RUN apt-get update && apt-get install -yq --no-install-recommends \
    nodejs \
    npm \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Preparamos directorios
WORKDIR /root/admin/base/app

# CORRECCIÓN: Copiamos desde 'proyectos/pokeapi' (basado en Contexto Caronte)
COPY ./proyectos/${PROYECTO}/ .

# Copiamos el script de arranque
# Asegúrate de que este archivo existe en: dockerfiles/node/admin/start.sh
COPY ./dockerfiles/node/admin/start.sh /root/admin/node/start.sh
RUN chmod +x /root/admin/node/start.sh

# Permisos para Nginx
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

EXPOSE 80

ENTRYPOINT ["/root/admin/node/start.sh"]