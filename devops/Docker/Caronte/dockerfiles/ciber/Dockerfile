FROM peedroorgzz/ubbase

# Intalo nmap
RUN apt-get update && \
    apt-get install -y nmap

# Directorio de trabajo
WORKDIR /app

# Copiamos el script
COPY ./dockerfiles/ciber/main/start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Volumen para reportes
VOLUME /output

CMD ["/app/start.sh"]