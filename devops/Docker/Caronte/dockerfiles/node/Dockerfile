# 1. Usamos tu imagen base que ya tiene Nginx configurado
FROM peedroorgzz/nginx

# 2. Recibimos el nombre del proyecto (pokeapi)
ARG PROYECTO

USER root

# 3. Instalamos SOLO Node.js y NPM (Nginx ya viene en la imagen base)
RUN apt-get update && apt-get install -yq --no-install-recommends \
    nodejs \
    npm \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 4. COPIA DEL CÓDIGO (Ruta Corregida)
#    Creamos el directorio de trabajo
WORKDIR /root/admin/base/app

#    IMPORTANTE: Añadimos '/pnode/' a la ruta de origen para coincidir con tu estructura real
#    Origen: contexto/proyectos/pnode/pokeapi -> Destino: /root/admin/base/app
COPY ./proyectos/pnode/${PROYECTO}/ .

# 5. Copiamos el script de arranque específico para Node/Pokeapi
#    Este script se encarga del 'npm install' y de iniciar nginx
#    Asegúrate de que este archivo existe en tu carpeta local: dockerfiles/node/admin/start.sh
COPY ./dockerfiles/node/admin/start.sh /root/admin/node/start.sh
RUN chmod +x /root/admin/node/start.sh

# 6. Permisos finales (por si Node necesita escribir en /var/www/html durante el build)
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# 7. Configuración de arranque
EXPOSE 80

# Usamos el script de Node como entrada, que instalará dependencias y levantará Nginx
ENTRYPOINT ["/root/admin/node/start.sh"]