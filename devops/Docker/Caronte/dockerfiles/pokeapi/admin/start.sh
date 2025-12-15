#!/bin/bash

set -e 

load_entrypoint_nginx(){
    bash /root/admin/nginx/admin/start.sh
}

workdir(){
    cd /root/admin/node/proyectos/pmegacrossover
}

dependencias(){
    npm install
    npm run build
    cp -r dist/* /var/www/html/
}


nginxreload(){
    nginx -t
    service nginx reload
}


main(){
    load_entrypoint_nginx
    workdir
    dependencias
    nginxreload
    tail -f /dev/null
}

main