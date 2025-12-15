#!/bin/bash
set -e

# Función nueva para colocar los ficheros en su sitio
prepare_site_files(){
    echo "--> Preparando archivos del sitio web..."
    
    # 1. Rutas de origen (Docker standard) y destino (Ubuntu Nginx)
    SRC="/usr/share/nginx/html"
    DEST="/var/www/html"
    
    # 2. Si existe contenido en el origen (tu app compilada)
    if [ -d "$SRC" ] && [ "$(ls -A $SRC)" ]; then
        # Borramos el index.html 'Welcome to Nginx' que trae por defecto
        rm -rf $DEST/*
        
        # Copiamos tu web al destino correcto
        cp -r $SRC/. $DEST/
        
        # Ajustamos permisos para el usuario www-data (necesario en Nginx)
        chown -R www-data:www-data $DEST
        chmod -R 755 $DEST
        
        echo "--> Archivos movidos y permisos configurados."
    else
        echo "--> ALERTA: No se encontraron archivos en $SRC"
    fi
}

load_entrypoint_nginx(){
    # Mantenemos tu llamada original
    bash /root/admin/sweb/nginx/admin/start.sh
}

main(){
    # Primero preparamos los archivos
    prepare_site_files
    
    # Luego arrancamos Nginx
    load_entrypoint_nginx
}

main