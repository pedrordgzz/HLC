FROM peedroorgzz/nginx

ARG PROYECTO

USER root

# 1. Instalar utilidades básicas
RUN apt-get update && apt-get install -y curl ca-certificates gnupg

# 2. Descargar e instalar Node.js v22 (La versión que piden tus logs)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
RUN apt-get install -y nodejs
    
WORKDIR /root/admin/base/app
COPY ./proyectos/${PROYECTO}/ .


COPY ./dockerfiles/node/admin/start.sh /root/admin/node/start.sh
RUN chmod +x /root/admin/node/start.sh

EXPOSE 3000

ENTRYPOINT ["/root/admin/node/start.sh"]