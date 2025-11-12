#!/bin/bash
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

check-home(){
    if [ ! -d "/home/${USUARIO}" ]; 
    then
        echo "El directorio /home/${USUARIO} no existe." >> /root/logs/informe.log
        return 0 #true
    else
         echo "El directorio /home/${USUARIO} ya existe." >> /root/logs/informe.log
        return 1 #false
    fi
}

newUser(){
    check-usuario
    if [ $? -eq 0 ]; 
        then
            check-home
            if [ $? -eq 0 ];
                then
                    useradd -rm -d /home/${USUARIO} -s /bin/bash ${USUARIO}
                    echo "${USUARIO}:${PASSWORD}" | chpasswd
                    echo "Usuario ${USUARIO} creado" > /home/${USUARIO}/bienvenida.txt
                else   
                    echo "Usuario ${USUARIO} no creado, pero /home/${USUARIO} existente" > /home/${USUARIO}/bienvenida.txt         
            fi
        else
            echo "No se crea el usuario ${USUARIO} porque ya existe" >> /root/logs/informe.log
    fi
}