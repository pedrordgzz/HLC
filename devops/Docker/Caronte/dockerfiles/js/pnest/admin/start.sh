#!/bin/bash
set -e

APP_DIR="/root/admin/${PROYECTO}"

instalar_dependencias() {
    cd "$APP_DIR"
    if [ -f "package.json" ]; then
        echo ">>> Instalando dependencias..."
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
    instalar_dependencias
    iniciar_nest
}

main
