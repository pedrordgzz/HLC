#!/bin/bash

set -e 

load_entrypoint_node(){
    # Si la imagen base tiene su propio script de inicio, lo ejecutamos.
    # Si ese script se queda pillado, habría que ponerle un '&' al final, 
    # pero asumimos que es configuración.
    if [ -f /root/admin/node/start.sh ]; then
        bash /root/admin/node/start.sh
    fi
}

dependencias(){
  echo "--- 1. Instalando dependencias ---"
  npm install
  
  echo "--- 2. Construyendo build para Nginx ---"
  npm run build
  
  # Copiar los ficheros estáticos a la carpeta de Nginx
  rm -rf /var/www/html/*
  if [ -d "dist" ]; then
      cp -r dist/. /var/www/html/
  elif [ -d "build" ]; then
       cp -r build/. /var/www/html/
  fi
  chown -R www-data:www-data /var/www/html
}

start_node_dev(){
    echo "--- 3. Iniciando Node (npm run dev) en segundo plano ---"
    # IMPORTANTE: El símbolo '&' al final manda el proceso al fondo.
    # Esto permite que el script continúe y lance Nginx.
    npm run dev &
}

nginxreload(){
    echo "--- 4. Iniciando Nginx en primer plano ---"
    if nginx -t; then
       # Nginx se queda en 'daemon off' para mantener el contenedor vivo
       nginx -g 'daemon off;'
    else
        echo "ERROR: Configuración Nginx inválida" >> /root/logs/informe_pokeapi.log
        exit 1
    fi
}

main(){
    load_entrypoint_node
    dependencias
    start_node_dev  # <--- Aquí lanzamos Node
    nginxreload     # <--- Y aquí Nginx (que mantendrá vivo el contenedor)
}

main