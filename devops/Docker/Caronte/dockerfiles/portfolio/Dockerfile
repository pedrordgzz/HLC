FROM peedroorgzz/nginx

ARG ${PROYECTO}
USER root

WORKDIR /root/admin/base/$PROYECTO
COPY ./proyectos/$PROYECTO/src/ /usr/share/nginx/html
COPY ./proyectos/$PORYECTO/src/ /var/www/html
COPY ./dockerfiles/$PROYECTO/admin/start.sh /root/admin/base/portfolio/start.sh
RUN chmod +x /root/admin/base/$PROYECTO/start.sh

ENTRYPOINT [ "/root/admin/base/portfolio/start.sh" ]
