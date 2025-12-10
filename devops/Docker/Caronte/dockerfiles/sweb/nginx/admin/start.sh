#!/bin/bash
set -x  # <--- AÑADE ESTO AQUÍ

config_nginx() {
    # Validamos la configuración antes de arrancar para ver si hay errores de sintaxis
    nginx -t 
    # Arrancamos nginx
    nginx 
}

load_entrypoint_base(){
    bash /root/admin/base/start.sh
}

main(){
 mkdir -p /root/logs
 load_entrypoint_base
 config_nginx
 tail -f /dev/null
}

main