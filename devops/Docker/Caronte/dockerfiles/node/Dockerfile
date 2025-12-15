FROM peedroorgzz/ubbase:latest

ARG PROYECTO

USER root

RUN apt-get update && apt-get install -yq --no-install-recommends \
    nginx \
    nodejs \
    npm \
    build-essential \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && mkdir -p /var/log/nginx \
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

RUN mkdir -p /root/admin/sweb/nginx
COPY ./dockerfiles/sweb/nginx /root/admin/sweb/nginx

# --- CAMBIO AQUÍ: Usamos una carpeta fija 'app' ---
WORKDIR /root/admin/base/app
COPY ./proyectos/${PROYECTO}/ .
# --------------------------------------------------

RUN chmod +x /root/admin/sweb/nginx/admin/start.sh
WORKDIR /root/admin/sweb/nginx
EXPOSE 80

ENTRYPOINT ["./admin/start.sh"]