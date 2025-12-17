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
iniciar_node(){
    cd "$APP_DIR"
    npx vite --host 0.0.0.0 --port 3000 &


}
iniciar_nginx(){
    nginx -g 'daemon off;'
}

main(){
    load_entrypoint_node      # 1. Copia los archivos
    construir_para_nginx # 2. Compila los archivos copiados
    iniciar_node
    iniciar_nginx        # 3. Sirve la web
}

main