FROM peedroorgzz/nginx

# CORRECCIÓN 1: Se declara SIN los símbolos ${}
ARG PROYECTO

USER root

# A partir de aquí SÍ se usa ${} para llamar a la variable
WORKDIR /root/admin/base/${PROYECTO}

COPY ./proyectos/${PROYECTO}/src/ /usr/share/nginx/html

# CORRECCIÓN 2: Corregido el typo "PORYECTO" por "PROYECTO"
COPY ./proyectos/${PROYECTO}/src/ /var/www/html

COPY ./dockerfiles/${PROYECTO}/admin/start.sh /root/admin/base/portfolio/start.sh

# Aseguramos permisos (usamos la ruta fija de destino para evitar líos)
RUN chmod +x /root/admin/base/portfolio/start.sh

ENTRYPOINT [ "/root/admin/base/portfolio/start.sh" ]