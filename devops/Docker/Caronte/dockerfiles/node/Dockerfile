FROM peedroorgzz/nginx:latest

# Recibe el argumento desde docker-compose
ARG PROYECTO

USER root

# CORRECCIÓN: Se eliminó la barra invertida '\' después de npm para cerrar el comando
RUN apt-get update && apt-get install -yq --no-install-recommends \
    nodejs \
    npm

# Copia de configuraciones de Nginx
RUN mkdir -p /root/admin/sweb/nginx
COPY ./dockerfiles/sweb/nginx /root/admin/sweb/nginx

# Copia del código fuente de la aplicación (pokeapi) al interior de la imagen
WORKDIR /root/admin/base/app
COPY ./proyectos/${PROYECTO}/ .

# Permisos de ejecución para el script de inicio
RUN chmod +x /root/admin/sweb/nginx/admin/start.sh

# Configuración final
WORKDIR /root/admin/sweb/nginx
EXPOSE 80

ENTRYPOINT ["./admin/start.sh"]