#!/bin/bash
set -e

config_nginx() {
    service nginx restart
    nginx
}

load_entrypoint_base(){
    bash /app/start.sh
}

main(){
 load_entrypoint_base
 config_nginx
}

main