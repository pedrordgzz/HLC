FROM peedroorgzz/nodejs

ARG PROYECTO

# Creamos la carpeta del proyecto
RUN mkdir -p /root/admin/pokeapi/
WORKDIR /root/admin/pokeapi

# --- CAMBIO IMPORTANTE ---
# Copiamos el start.sh a /root/ (un nivel más arriba) 
# para que el volumen del código no lo oculte.
COPY ./dockerfiles/preact/admin/start.sh /root/start.sh
RUN chmod +x /root/start.sh

EXPOSE 3000 80

# Ejecutamos el script desde su ubicación segura
ENTRYPOINT ["/root/start.sh"]