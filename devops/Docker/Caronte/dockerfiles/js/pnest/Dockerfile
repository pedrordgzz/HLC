FROM peedroorgzz/nginx

ARG PROYECTO
ENV PROYECTO=${PROYECTO}

USER root

# Instalar Node.js 22 (pg no necesita compilación nativa, sin python/make/g++)
RUN apt-get update && \
    apt-get install -y curl ca-certificates gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Crear carpeta del proyecto y copiar código fuente
RUN mkdir -p /root/admin/${PROYECTO}/
COPY ./proyectos/${PROYECTO}/ /root/admin/${PROYECTO}/
WORKDIR /root/admin/${PROYECTO}

# Copiar el script de inicio
COPY ./dockerfiles/js/pnest/admin/start.sh /root/start.sh
RUN chmod +x /root/start.sh

EXPOSE 3001

ENTRYPOINT ["/root/start.sh"]
