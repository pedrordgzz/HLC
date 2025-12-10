#!/bin/bash
config_nginx() {
    nginx 
}

load_entrypoint_base(){
    bash /root/admin/base/start.sh
}

main(){
mkdir -p /root/logs/
 load_entrypoint_base
 config_nginx
tail -f /dev/null

}

main