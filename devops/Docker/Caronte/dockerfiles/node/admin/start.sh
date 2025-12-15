#!/bin/bash
set -e

deploy_app(){
    # Define where the app runs
    APP_DIR="/root/admin/base/app"
    # Define where the volume is mounted (matches docker-compose)
    # We use the $PROYECTO variable from .env so it's dynamic
    SOURCE_DIR="/root/admin/node/proyectos/${PROYECTO}"

    mkdir -p "$APP_DIR"
    
    # --- FIX: Copy files from the volume to the app folder ---
    if [ -d "$SOURCE_DIR" ]; then
        echo "Copying files from $SOURCE_DIR to $APP_DIR..."
        cp -r "$SOURCE_DIR/." "$APP_DIR/"
    else
        echo "ERROR: Source code not found at $SOURCE_DIR"
        exit 1
    fi
    # ---------------------------------------------------------

    cd "$APP_DIR"
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