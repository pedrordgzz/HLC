#!/bin/bash
set -e

deploy_app(){
    echo "--- Iniciando Despliegue ---"
    
    # Directorio donde se ejecutará la app
    APP_DIR="/root/admin/base/app"
    # Directorio donde está montado el volumen (coincide con docker-compose)
    VOLUME_DIR="/root/admin/node/proyectos/${PROYECTO}"

    # 1. Copiar archivos del volumen si existen (Desarrollo)
    if [ -d "$VOLUME_DIR" ] && [ "$(ls -A $VOLUME_DIR)" ]; then
        echo "Cargando código desde volumen: $VOLUME_DIR"
        # Usamos rsync o cp para actualizar archivos
        cp -r $VOLUME_DIR/. $APP_DIR/
    else
        echo "Usando código pre-copiado en la imagen..."
    fi

    cd "$APP_DIR"

    # 2. Instalar dependencias
    if [ -f "package.json" ]; then
        echo "Instalando dependencias npm..."
        npm install
        
        # 3. Construir la aplicación (Vite/React/Vue suele requerir build)
        echo "Construyendo aplicación..."
        npm run build
        
        # 4. Mover el build a donde Nginx lo sirve
        echo "Desplegando a Nginx (/var/www/html)..."
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
    echo "Iniciando Nginx..."
    nginx -g 'daemon off;'
}

main(){
    deploy_app
    start_nginx
}

main