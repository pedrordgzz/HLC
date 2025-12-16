#!/bin/bash

set -e 

load_entrypoint_nginx(){
    bash /root/admin/node/start.sh
}

dependencias(){
  npm run build
  rm -rf /var/www/html/*
        if [ -d "dist" ]; then
            cp -r dist/. /var/www/html/
        elif [ -d "build" ]; then
             cp -r build/. /var/www/html/
        fi
chown -R www-data:www-data /var/www/html
}


nginxreload(){
    if nginx -t; then
       nginx -g 'daemon off;'
    else
        echo "ERROR: Configuración Nginx inválida" >> /root/logs/informe_pokeapi.log
        exit 1
    fi
}



main(){
    load_entrypoint_nginx
    dependencias
    nginxreload

}

main