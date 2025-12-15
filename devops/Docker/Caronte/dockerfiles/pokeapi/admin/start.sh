#!/bin/bash
set -e
load_entrypoint_nginx(){
    bash /root/admin/sweb/nginx/admin/start.sh
}

main(){
    load_entrypoint_nginx

}

main