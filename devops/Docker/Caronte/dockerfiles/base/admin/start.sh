#!/bin/bash

newUser(){
    useradd -rm -d /home/pedro -s /bin/bash pedro
    echo "pedro:1234" | chpasswd
    echo "Bienvenido Pedro ..." > /home/pedro/bienvenida.txt
}

main(){
    newUser
    tail -f /dev/null #Encargada de dejar el contenedor vivo en background
}

main
