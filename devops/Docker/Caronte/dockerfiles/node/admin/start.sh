#!/bin/bash
set -e

deploy_app(){
    cd /root/admin/base/app
    npm install
    npm run build
    
    rm -rf /var/www/html/*
    
    if [ -d "dist" ]; then
        cp -r dist/. /var/www/html/
    elif [ -d "build" ]; then
        cp -r build/. /var/www/html/
    fi
    
    chown -R www-data:www-data /var/www/html
}

load_entrypoint_nginx(){
    bash /root/admin/sweb/nginx/admin/start.sh
}

main(){
    deploy_app
    load_entrypoint_nginx
}

main