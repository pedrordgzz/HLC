FROM peedroorgzz/nginx

ARG PROYECTO

USER root

RUN apt-get update && apt-get install -y nodejs npm

WORKDIR /root/admin/base/app
COPY ./proyectos/${PROYECTO}/ .


COPY ./dockerfiles/node/admin/start.sh /root/admin/node/start.sh
RUN chmod +x /root/admin/node/start.sh

EXPOSE 3000

ENTRYPOINT ["/root/admin/node/start.sh"]