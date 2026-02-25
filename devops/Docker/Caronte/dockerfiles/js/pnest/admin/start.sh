#!/bin/bash
set -e

VOLUME_DIR="/root/admin/${PROYECTO}"
APP_DIR="/root/admin/${PROYECTO}"

deploy_app() {
    # Si hay código en el volumen, lo copiamos al directorio de trabajo
    if [ -d "$VOLUME_DIR" ] && [ "$(ls -A $VOLUME_DIR)" ]; then
        echo ">>> Código encontrado en el volumen: $VOLUME_DIR"
        mkdir -p "$APP_DIR"
        echo ">>> Copiando archivos al directorio de trabajo..."
        rm -rf "$APP_DIR/node_modules"
        cp -rf "$VOLUME_DIR/." "$APP_DIR/"
        echo ">>> Copia finalizada."
    else
        echo ">>> No se encontró código en el volumen. Usando el existente."
    fi

    cd "$APP_DIR"
}

instalar_dependencias() {
    if [ -f "package.json" ]; then
        echo ">>> Instalando dependencias con npm install..."
        npm install
        chmod -R +x node_modules/.bin
        echo ">>> Instalación completada."
    else
        echo ">>> No se encontró package.json. Saltando instalación."
    fi
}

iniciar_nest() {
    cd "$APP_DIR"
    echo ">>> Arrancando NestJS en modo desarrollo..."
    npm run start:dev
}

main() {
    deploy_app
    instalar_dependencias
    iniciar_nest
}

main
