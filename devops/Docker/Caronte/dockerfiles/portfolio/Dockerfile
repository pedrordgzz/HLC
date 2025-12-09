FROM peedroorgzz/nginx

USER root

WORKDIR /root/admin/base/portfolio
COPY ./proyectos/portfolio/src/ /usr/share/nginx/html
COPY ./proyectos/portfolio/src/ /var/www/html
COPY ./dockerfiles/portfolio/admin/start.sh /root/admin/base/portfolio/start.sh
RUN chmod +x /root/admin/base/portfolio/start.sh

ENTRYPOINT [ "/root/admin/base/portfolio/start.sh" ]