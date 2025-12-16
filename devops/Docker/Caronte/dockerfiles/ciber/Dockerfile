FROM peedroorgzz/ubbase

# Intalo nmap
RUN apt-get update && \
    apt-get install -y nmap

# Directorio de trabajo
WORKDIR /app

# Copiamos el script
COPY ./dockerfiles/ciber/main/start.sh /root/admin/ciber/
RUN chmod +x /root/admin/ciber/

# Volumen para reportes
VOLUME /output

CMD ["/root/admin/ciber/start.sh"]