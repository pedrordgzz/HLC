preparar_codigo(){
    echo "--- Ejecutando script de preparación de Node (copia de archivos) ---"
    # Lo ejecutamos SIN '&' porque necesitamos que termine de copiar antes de compilar
    bash /root/admin/node/start.sh
}

construir_para_nginx(){
    cd "$APP_DIR" # Aseguramos estar en la carpeta correcta
    echo "--- Construyendo versión de producción (npm run build) ---"
    npm run build

    echo "--- Copiando a Nginx ---"
    rm -rf /var/www/html/*
    
    if [ -d "dist" ]; then
        cp -r dist/. /var/www/html/
    elif [ -d "build" ]; then
        cp -r build/. /var/www/html/
    fi
    
    chown -R www-data:www-data /var/www/html
}

iniciar_nginx(){
    echo "--- Iniciando Nginx ---"
    nginx -g 'daemon off;'
}

main(){
    preparar_codigo      # 1. Copia los archivos
    construir_para_nginx # 2. Compila los archivos copiados
    iniciar_nginx        # 3. Sirve la web
}

main