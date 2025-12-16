FROM peedroorgzz/nginx

ARG PROYECTO

USER root

RUN apt-get update && apt-get install -yq --no-install-recommends \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -yq --no-install-recommends nodejs

WORKDIR /root/admin/base/app
COPY ./proyectos/${PROYECTO}/ .


COPY ./dockerfiles/node/admin/start.sh /root/admin/node/start.sh
RUN chmod +x /root/admin/node/start.sh

EXPOSE 3000

ENTRYPOINT ["/root/admin/node/start.sh"]