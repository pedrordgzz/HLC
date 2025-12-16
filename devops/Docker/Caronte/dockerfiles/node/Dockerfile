FROM peedroorgzz/nginx

ARG PROYECTO

USER root

# Combine updates, setup, and install in one RUN block to ensure freshness
RUN apt-get update && \
    apt-get install -y curl ca-certificates gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
    
WORKDIR /root/admin/base/app
COPY ./proyectos/${PROYECTO}/ .
COPY ./dockerfiles/node/admin/start.sh /root/admin/node/start.sh
RUN chmod +x /root/admin/node/start.sh

EXPOSE 3000

ENTRYPOINT ["/root/admin/node/start.sh"]