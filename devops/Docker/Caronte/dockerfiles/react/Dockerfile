FROM peedroorgzz/nginx

ARG PROYECTO

USER root

WORKDIR /root/admin/base/${PROYECTO}
COPY ./proyectos/${PROYECTO}/dist/ /usr/share/nginx/html
COPY ./proyectos/${PROYECTO}/dist/ /var/www/html
COPY ./dockerfiles/${PROYECTO}/admin/start.sh /root/admin/base/${PROYECTO}/start.sh
RUN chmod +x /root/admin/base/${PROYECTO}/start.sh

ENTRYPOINT [ "/root/admin/base/pokeapi/start.sh" ]