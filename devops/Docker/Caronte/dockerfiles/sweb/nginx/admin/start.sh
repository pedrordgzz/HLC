#!/bin/bash
set -e

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
 load_entrypoint_base
 config_nginx
}

main