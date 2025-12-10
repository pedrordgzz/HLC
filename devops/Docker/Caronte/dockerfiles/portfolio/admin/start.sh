#!/bin/bash
load_entrypoint_nginx(){
    # Asumo que esto configura cosas, pero no arranca el servicio o se detiene
    bash /root/admin/sweb/nginx/admin/start.sh
}

iniciar_nginx(){
    service nginx restart
    nginx
}

main(){
    load_entrypoint_nginx
    iniciar_nginx
}

main