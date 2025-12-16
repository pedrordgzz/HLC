FROM peedroorgzz/ciber:latest
USER root
RUN apt update && apt install -yq --no-install-recommends \
    nginx


RUN chown -R www-data /var/www/html
RUN chmod -R 755 /var/www/html

# instalo nginx/apache --> usuario www-data
# el propietario de /var/www/html debe de ser www-data
RUN mkdir -p /var/log/nginx
EXPOSE 80
# ... (en tu Dockerfile)
RUN mkdir -p /var/log/nginx
# Redirigir logs a la salida estándar
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log
# ...
RUN mkdir -p /root/admin/sweb/nginx
COPY ./dockerfiles/sweb/nginx /root/admin/sweb/nginx
RUN chmod +x /root/admin/sweb/nginx/admin/start.sh
WORKDIR /root/admin/sweb/nginx
ENTRYPOINT ["./admin/start.sh"]
