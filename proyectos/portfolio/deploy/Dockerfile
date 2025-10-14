# Archivo donde especifique la instalación de librerias y configuraciones a la hora de crear mis contenedores personalizados
# 1-. partimos de una imagen de Docker con apache instaldo
#FROM ubuntu + instalacion personal de Apache
FROM httpd:2.4 
#debemos consultar el docker hub (imagen) para ver variables de entorno
#directorios de trabajo etc etc
#directorio de trabajo dentro del contenedor
WORKDIR /usr/local/apache2/htdocs
# el directorio . es relativo al contexto del Docker Compose
COPY ./src .
EXPOSE 80

