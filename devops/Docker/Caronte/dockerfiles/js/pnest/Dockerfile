FROM peedroorgzz/nginx

ARG PROYECTO

USER root

# Instalamos Node.js 22
RUN apt-get update && \
    apt-get install -y curl ca-certificates gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Creamos la carpeta del proyecto
RUN mkdir -p /root/admin/${PROYECTO}/
WORKDIR /root/admin/${PROYECTO}

# Copiamos el start.sh fuera del volumen para que no se sobreescriba
COPY ./dockerfiles/js/pnest/admin/start.sh /root/start.sh
RUN chmod +x /root/start.sh

EXPOSE 3000

ENTRYPOINT ["/root/start.sh"]
