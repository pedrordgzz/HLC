#!/bin/bash
set -e
load_entrypoint_node(){
    bash /root/admin/node/start.sh
}

construir_para_nginx(){
    cd "$APP_DIR"
    npm run build
    rm -rf /var/www/html/*
    
    if [ -d "dist" ]; then
        cp -r dist/. /var/www/html/
    elif [ -d "build" ]; then
        cp -r build/. /var/www/html/
    fi
    
    chown -R www-data:www-data /var/www/html
}

iniciar_nginx(){
    nginx -g 'daemon off;'
}

main(){
    load_entrypoint_node     
    construir_para_nginx 
    iniciar_nginx      
}
main