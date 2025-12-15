FROM peedroorgzz/ubbase:latest

ARG PROYECTO

USER root
RUN apt update && apt install -yq --no-install-recommends \
    nginx \
    nodejs \
    npm \
    build-essential

# Configuración Nginx (Igual que tenías)
RUN chown -R www-data /var/www/html
RUN chmod -R 755 /var/www/html
RUN mkdir -p /var/log/nginx
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

# Copiamos scripts de admin
RUN mkdir -p /root/admin/sweb/nginx
COPY ./dockerfiles/sweb/nginx /root/admin/sweb/nginx

# --- NUEVO: Copiamos el código fuente de tu proyecto para compilarlo ---
WORKDIR /root/admin/base/${PROYECTO}
COPY ./proyectos/${PROYECTO}/ .
# ----------------------------------------------------------------------

RUN chmod +x /root/admin/sweb/nginx/admin/start.sh
WORKDIR /root/admin/sweb/nginx

ENTRYPOINT ["./admin/start.sh"]