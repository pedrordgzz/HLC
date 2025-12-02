#!/bin/bash
config_nginx() {
    nginx &
}

load_entrypoint_base(){
    bash /root/admin/base/start.sh
}

main(){
 load_entrypoint_base
 config_nginx
}

main