#!/bin/bash

set -e #Carga las variables de entorno, pasadas desde el docker-compose.
source /root/admin/base/usuarios/mainusers.sh
source /root/admin/base/ssh/main-ssh.sh
#source /root/admin/base/sudo/main-sudo.sh

main(){
    touch /root/logs/informe.log
    newUser
    reuser=$?

    if [ $reuser -eq 0 ]; then
     configurar-ssh
    fi

    if [ $reuser -eq 0 ]; then
      configurar-sudo
    fi
    
}

main

