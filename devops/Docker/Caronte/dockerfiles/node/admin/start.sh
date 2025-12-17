#!/bin/bash
set -e


deploy_app(){
    # Verificamos si hay algo que copiar en el volumen
    if [ -d "$VOLUME_DIR" ] && [ "$(ls -A $VOLUME_DIR)" ]; then
        echo "Código existente en el volumen: $VOLUME_DIR"
        mkdir -p "$APP_DIR"
        echo "Copiando archivos"
        cp -rf "$VOLUME_DIR/." "$APP_DIR/"
        echo "Copia finalizada."
    fi

    cd "$APP_DIR"
}

instalar_dependencias(){ 
    if [ -f "package.json" ]; then
        npm install
        echo "Instalación completada."
    else
        echo "No se encontró package.json. Saltando instalación."
    fi
}

main(){
    deploy_app
    instalar_dependencias
}

main