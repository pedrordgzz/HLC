#!/bin/bash
set -e

compile_and_deploy(){
    # Usamos la variable de entorno que definiste en el .env
    PROJECT_DIR="/root/admin/base/$PROYECTO"
    
    echo "--> Iniciando compilación de $PROYECTO en $PROJECT_DIR..."
    
    if [ -d "$PROJECT_DIR" ]; then
        cd "$PROJECT_DIR"
        
        # 1. Instalamos dependencias y compilamos
        echo "--> Instalando dependencias (npm install)..."
        npm install
        
        echo "--> Compilando proyecto (npm run build)..."
        npm run build
        
        # 2. Movemos el resultado (dist) a donde Nginx lo lee
        # Nota: Vite/React suelen crear la carpeta 'dist' o 'build'
        if [ -d "dist" ]; then
            echo "--> Desplegando a /var/www/html..."
            rm -rf /var/www/html/*
            cp -r dist/* /var/www/html/
        elif [ -d "build" ]; then
             # Por si tu proyecto crea carpeta 'build' en vez de 'dist'
            echo "--> Desplegando a /var/www/html..."
            rm -rf /var/www/html/*
            cp -r build/* /var/www/html/
        fi
        
        # 3. Permisos
        chown -R www-data:www-data /var/www/html
    else
        echo "--> ERROR: No encuentro el código en $PROJECT_DIR"
    fi
}

load_entrypoint_nginx(){
    # Arranca Nginx (daemon off)
    bash /root/admin/sweb/nginx/admin/start.sh
    service nginx start
}

main(){
    compile_and_deploy
    load_entrypoint_nginx
}

main