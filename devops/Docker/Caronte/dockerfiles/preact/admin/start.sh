#!/bin/bash

set -e 

load_entrypoint_node(){
    if [ -f /root/admin/node/start.sh ]; then
        bash /root/admin/node/start.sh
    fi
}

dependencias(){
  echo "--- 1. Instalando dependencias ---"
  npm install
  
  echo "--- 2. Construyendo build para Nginx ---"
  npm run build
  
  echo "--- 3. Copiando archivos a Nginx ---"
  # Limpiamos destino
  rm -rf /var/www/html/*
  
  # Verificamos qué carpeta se creó (dist para Vite, build para CRA)
  if [ -d "dist" ]; then
      echo "Detectada carpeta 'dist'"
      cp -r dist/. /var/www/html/
  elif [ -d "build" ]; then
      echo "Detectada carpeta 'build'"
      cp -r build/. /var/www/html/
  else
      echo "PELIGRO: No se encontró carpeta 'dist' ni 'build'. Nginx servirá vacío."
  fi
  
  chown -R www-data:www-data /var/www/html
}

# --- NUEVA FUNCIÓN ---
configurar_nginx(){
    echo "--- Configurando Nginx para React ---"
    # Borramos la config por defecto para evitar conflictos
    rm -f /etc/nginx/sites-enabled/default
    
    # Creamos una configuración básica que apunte a /var/www/html
    # y maneje el enrutado de React (try_files)
    cat > /etc/nginx/conf.d/default.conf <<EOF
server {
    listen 80;
    server_name localhost;
    root /var/www/html;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
}

start_node_dev(){
    echo "--- 4. Iniciando Node (Background) ---"
    npm run dev &
}

nginxreload(){
    echo "--- 5. Iniciando Nginx ---"
    if nginx -t; then
       nginx -g 'daemon off;'
    else
        echo "ERROR: Configuración Nginx inválida"
        exit 1
    fi
}

main(){
    load_entrypoint_node
    dependencias
    configurar_nginx  # <--- Paso añadido
    start_node_dev
    nginxreload
}

main