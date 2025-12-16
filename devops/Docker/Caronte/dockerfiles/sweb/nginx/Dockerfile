FROM peedroorgzz/ciber:latest
USER root

# Instalación de paquetes
RUN apt update && apt install -yq --no-install-recommends \
    nginx

    RUN chown -R www-data /var/www/html
RUN chmod -R 755 /var/www/html

RUN mkdir -p /var/log/nginx

# Preparación de scripts de inicio
RUN mkdir -p /root/admin/sweb/nginx
COPY ./dockerfiles/sweb/nginx /root/admin/sweb/nginx
RUN chmod +x /root/admin/sweb/nginx/admin/start.sh

WORKDIR /root/admin/sweb/nginx
ENTRYPOINT ["./admin/start.sh"]