#!/bin/bash
set -e

# 1. Función para preparar el entorno y dependencias
preparar_app(){
    # Moverse al directorio de la app
    if [ -d "$VOLUME_DIR" ] && [ "$(ls -A $VOLUME_DIR)" ]; then
        echo "--- Sincronizando código desde volumen: $VOLUME_DIR ---"
        cp -r $VOLUME_DIR/. $APP_DIR/
    fi

    cd "$APP_DIR" || exit 1

    if [ -f "package.json" ]; then
        echo "--- Instalando dependencias (npm install) ---"
        npm install
    else
        echo "ERROR: No se encontró package.json en $APP_DIR"
        exit 1
    fi
}

# 2. Función para generar los estáticos que servirá Nginx
construir_para_nginx(){
    echo "--- Construyendo versión de producción (npm run build) ---"
    npm run build

    echo "--- Copiando archivos compilados a Nginx (/var/www/html) ---"
    # Limpiamos la carpeta de Nginx
    rm -rf /var/www/html/*

    # Vite suele crear 'dist', CRA suele crear 'build'. Cubrimos ambos:
    if [ -d "dist" ]; then
        cp -r dist/. /var/www/html/
    elif [ -d "build" ]; then
        cp -r build/. /var/www/html/
    fi

    # Permisos para Nginx
    chown -R www-data:www-data /var/www/html
}

# 3. Función para lanzar Node en modo desarrollo (PUERTO 3000)
iniciar_node_dev(){
    echo "--- Iniciando Servidor Vite/Node (Puerto 3000) en SEGUNDO PLANO ---"
    # EL '&' ES LA CLAVE: Manda el proceso al fondo y permite continuar al script
    npx vite --host 0.0.0.0 --port 3000 &
}

# 4. Función para lanzar Nginx (PUERTO 80)
iniciar_nginx(){
    
    # Verificamos sintaxis
    nginx -t

    # Si tu imagen base tiene un script de inicio de nginx, úsalo, 
    # si no, lanzamos nginx directamente.
    # Usaré el comando directo para asegurar que no se cierra el contenedor:
    nginx -g 'daemon off;'
}

main(){
    preparar_app
    construir_para_nginx
    iniciar_node_dev
    iniciar_nginx
}

main