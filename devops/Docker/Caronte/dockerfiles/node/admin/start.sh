#!/bin/bash
set -e

deploy_app(){
    # Defino un directorio donde se ejecutará la app
    APP_DIR="/root/admin/base/app"
    # Y el directorio dnde se montará el volumen (Desarrollo)
    VOLUME_DIR="/root/admin/node/proyectos/${PROYECTO}"


    if [ -d "$VOLUME_DIR" ] && [ "$(ls -A $VOLUME_DIR)" ]; then
        echo "Cargando código desde volumen: $VOLUME_DIR"
        # Hago uncp para actualizar archivos
        cp -r $VOLUME_DIR/. $APP_DIR/
    fi

    cd "$APP_DIR"
    if [ -f "package.json" ]; then
        npm install
        npm run build
        rm -rf /var/www/html/*
        if [ -d "dist" ]; then
            cp -r dist/. /var/www/html/
        elif [ -d "build" ]; then
             cp -r build/. /var/www/html/
        fi
        
        chown -R www-data:www-data /var/www/html
    else
        echo "ERROR: No se encontró package.json en $APP_DIR"
        exit 1
    fi
}

start_nginx(){
    nginx -g 'daemon off;'
}

main(){
    deploy_app
    start_nginx
}

main