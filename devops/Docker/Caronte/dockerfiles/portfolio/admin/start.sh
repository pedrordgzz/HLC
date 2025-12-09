#!/bin/bash

load_entrypoint_nginx(){
    bash /root/admin/sweb/nginx/admin/start.sh
}
reload_nginx(){
    service nginx reload
}
main(){

    load_entrypoint_nginx
    reload_nginx
    tail -f /dev/null
}

main