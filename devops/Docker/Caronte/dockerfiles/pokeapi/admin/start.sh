#!/bin/bash
set -e
load_entrypoint_nginx(){
    bash /root/admin/sweb/nginx/admin/start.sh
}

react_admin(){
    npm i  
    npm run build
}

main(){
    load_entrypoint_nginx
    react_admin
}

main