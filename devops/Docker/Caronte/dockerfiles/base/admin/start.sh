#!/bin/bash

set -e #Carga las variables de entorno, pasadas desde el docker-compose.

check-usuario(){
    if grep -q ${USUARIO} /etc/passwd; 
    then
        echo "El usuario ${USUARIO} ya existe." >> /root/logs/informe.log
        return 1
    else
         echo "El usuario ${USUARIO} no existe." >> /root/logs/informe.log
        return 0
    fi
}

newUser(){
    check-usuario
    if [ $? -eq 0 ]; 
        then
    useradd -rm -d /home/${USUARIO} -s /bin/bash ${USUARIO}
    echo "${USUARIO}:${PASSWORD}" | chpasswd
    echo "Bienvenido ${USUARIO} ..." > /home/${USUARIO}/bienvenida.txt
fi
}

main(){
    touch /root/logs/informe.log
    newUser
    tail -f /dev/null #Encargada de dejar el contenedor vivo en background
}

main
