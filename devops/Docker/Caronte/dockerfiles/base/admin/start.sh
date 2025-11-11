#!/bin/bash

set -e #Carga las variables de entorno, pasadas desde el docker-compose.

newUser(){
    useradd -rm -d /home/${USUARIO} -s /bin/bash ${USUARIO}
    echo "${USUARIO}:${PASSWORD}" | chpasswd
    echo "Bienvenido ${USUARIO} ..." > /home/${USUARIO}/bienvenida.txt
}

main(){
    newUser
    tail -f /dev/null #Encargada de dejar el contenedor vivo en background
}

main
