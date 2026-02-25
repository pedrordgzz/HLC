FROM peedroorgzz/nginx

ARG PROYECTO
ENV PROYECTO=${PROYECTO}

USER root

# Instalamos Node.js 22
RUN apt-get update && \
    apt-get install -y curl ca-certificates gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Creamos la carpeta del proyecto y copiamos el código fuente
RUN mkdir -p /root/admin/${PROYECTO}/
COPY ./proyectos/${PROYECTO}/ /root/admin/${PROYECTO}/
WORKDIR /root/admin/${PROYECTO}

# Copiamos el start.sh fuera del proyecto
COPY ./dockerfiles/js/pnest/admin/start.sh /root/start.sh
RUN chmod +x /root/start.sh

EXPOSE 3000

ENTRYPOINT ["/root/start.sh"]
