#!/bin/bash
set -e

deploy_app(){
    if [ -d "$VOLUME_DIR" ] && [ "$(ls -A $VOLUME_DIR)" ]; then
        echo "Cargando código desde volumen: $VOLUME_DIR"
        # Hago uncp para actualizar archivos
        cp -r $VOLUME_DIR/. $APP_DIR/
    fi

    cd "$APP_DIR"

}

load_entrypoint_base(){
    bash /root/admin/sweb/nginx/admin/start.sh
}
main(){
     load_entrypoint_base
    deploy_app
}

main