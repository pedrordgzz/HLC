#!/bin/bash

set -e #Carga las variables de entorno, pasadas desde el docker-compose.
source /root/admin/base/usuarios/mainusers.sh
source /root/admin/base/ssh/main-ssh.sh

main(){
    touch /root/logs/informe.log
    newUser
    if [ $? -eq 0 ]; then
     configurar-ssh
    fi
    configurar-ssh
    tail -f /dev/null #Encargada de dejar el contenedor vivo en background
}

main
