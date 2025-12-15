#!/bin/bash
set -e

setup_project(){
    echo "--> Configurando archivos del proyecto..."
    
    # 1. Definimos origen (donde copió el Dockerfile) y destino (donde lee Nginx)
    # Según tu primer mensaje, copiaste el 'dist' a /usr/share/nginx/html
    SRC_DIR="/usr/share/nginx/html"
    DEST_DIR="/var/www/html"

    # 2. Borramos la página por defecto "Welcome to Nginx" para evitar conflictos
    if [ -f "$DEST_DIR/index.html" ]; then
        echo "--> Eliminando index.html por defecto de Nginx..."
        rm -f "$DEST_DIR/index.html"
    fi

    # 3. Copiamos tus archivos al directorio final que usa Nginx
    # (Usamos cp -rT para copiar el CONTENIDO, no la carpeta entera)
    if [ -d "$SRC_DIR" ]; then
        echo "--> Moviendo web compilada a $DEST_DIR..."
        cp -r "$SRC_DIR/." "$DEST_DIR/"
    fi

    # 4. Ajustamos permisos para que Nginx pueda leerlos
    chown -R www-data:www-data "$DEST_DIR"
    chmod -R 755 "$DEST_DIR"
}

load_entrypoint_nginx(){
    # Llama al script de la imagen base que arranca Nginx
    # Esto debe ser lo ÚLTIMO porque ese script se queda ejecutando (daemon off)
    bash /root/admin/sweb/nginx/admin/start.sh
    service nginx reload
    service nginx start
}

main(){
    setup_project
    load_entrypoint_nginx
}

main