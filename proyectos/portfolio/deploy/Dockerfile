#partimos de una imagen base de ubuntu donde instalaremos apache, lo configuraremos y lo arrancaremos
FROM ubuntu
RUN apt update && apt install -yq --no-install-recommends \ 
    apache2 \
    nano \
    curl \
    net-tools iputils-ping
#debemos consultar el docker hub (imagen) para ver variables de entorno
#directorios de trabajo etc etc
#directorio de trabajo dentro del contenedor
WORKDIR /var/www/html
# el directorio . es relativo al contexto del Docker Compose
COPY src .
EXPOSE 80
CMD apachectl -DFOREGROUND 

