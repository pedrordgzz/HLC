FROM peedroorgzz/ubbase

# Intalo nmap
RUN apt-get update && \
    apt-get install -y nmap

# Directorio de trabajo
WORKDIR /root/admin/ciber/

# Copiamos el script
COPY ./dockerfiles/ciber/main/start.sh .
RUN chmod +x ./start.sh

# Volumen para reportes
VOLUME /output

CMD ["./start.sh"]