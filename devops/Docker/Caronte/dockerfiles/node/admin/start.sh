#!/bin/bash
set -e

deploy_app(){
    if [ -d "$VOLUME_DIR" ] && [ "$(ls -A $VOLUME_DIR)" ]; then
        echo "Cargando código desde volumen: $VOLUME_DIR"
        # Hago uncp para actualizar archivos
        cp -r $VOLUME_DIR/. $APP_DIR/
    fi

    cd "$APP_DIR"

    if [ -f "package.json" ]; then
        npm install      
        npm run dev --host 0.0.0.0 --port 3000 
    else
        echo "ERROR: No se encontró package.json en $APP_DIR"
        exit 1
    fi
}

main(){
    deploy_app
}

main