#!/bin/bash

# set -e hace que el script muera si hay un error. 
# Lo mantenemos, pero hay que asegurarse de que los comandos no fallen tontamente.
set -e 

source /root/admin/base/usuarios/mainusers.sh
source /root/admin/base/ssh/main-ssh.sh
#source /root/admin/base/sudo/main-sudo.sh

main(){
    # CORRECCIÓN: Añadido -p para que no falle si el volumen ya creó la carpeta
    mkdir -p /root/logs/
    
    newUser
    reuser=$?

    if [ $reuser -eq 0 ]; then
     configurar-ssh
    fi

    if [ $reuser -eq 0 ]; then
      configurar-sudo
    fi
    
    # IMPORTANTE: Mantener el contenedor vivo
    # Como es una imagen base ubuntu (no un servicio como nginx en primer plano),
    # necesitas esto al final o el contenedor se apagará al terminar el script.
    tail -f /dev/null
}

main