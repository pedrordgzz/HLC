#!/bin/bash

set -e #Carga las variables de entorno, pasadas desde el docker-compose.
source /root/admin/base/usuarios/mainusers.sh

main(){
    touch /root/logs/informe.log
    newUser
    tail -f /dev/null #Encargada de dejar el contenedor vivo en background
}

main
