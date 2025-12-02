#!/bin/bash
config_nginx() {
    nginx &
}

load_entrypoint_base(){
    bash /root/admin/base/start.sh
}

main(){
 config_nginx
}

load_entrypoint_base
main