#!/bin/bash

load_entrypoint_nginx(){
    # Asumo que esto configura cosas, pero no arranca el servicio o se detiene
    bash /root/admin/sweb/nginx/admin/start.sh
}

iniciar_nginx(){
    # CAMBIO IMPORTANTE: Usamos 'start' o 'restart', no 'reload'
    # Si nginx no está corriendo, reload falla y no hace nada.
    service nginx restart
}

main(){
    load_entrypoint_nginx
    
    # Aseguramos que Nginx arranque explícitamente
    iniciar_nginx
    
    # Mantenemos el contenedor vivo
    tail -f /dev/null
}

main