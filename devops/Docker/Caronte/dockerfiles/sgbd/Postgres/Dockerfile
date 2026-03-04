FROM peedroorgzz/ciber

USER root

# Instalar PostgreSQL
RUN apt-get update && \
    apt-get install -y postgresql postgresql-client && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Detectar la versión instalada y exportar PG_BIN/PGDATA al entorno
RUN PG_VER=$(ls /usr/lib/postgresql/) && \
    echo "export PG_BIN=/usr/lib/postgresql/${PG_VER}/bin" >> /etc/profile && \
    echo "export PGDATA=/var/lib/postgresql/${PG_VER}/main" >> /etc/profile

# Directorio de trabajo y script de inicio
WORKDIR /root/admin/postgres/
COPY ./dockerfiles/sgbd/Postgres/main/start.sh .
RUN chmod +x ./start.sh

# Puerto PostgreSQL
EXPOSE 5432

ENTRYPOINT ["/root/admin/postgres/start.sh"]
