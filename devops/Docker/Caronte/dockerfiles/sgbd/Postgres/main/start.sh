#!/bin/bash
set -e

# =============================================
# Log helper
# =============================================
log() {
    echo "[POSTGRES] $1" | tee -a "$LOG_FILE"
}

# =============================================
# Llama al entrypoint de ciber en segundo plano
# (usuarios, ssh, etc.)
# =============================================
load_entrypoint_ciber() {
    bash /root/admin/ciber/start.sh &
}

# =============================================
# Inicializar cluster si no existe
# =============================================
inicializar_cluster() {
    if [ ! -f "$PGDATA/PG_VERSION" ]; then
        log "Inicializando cluster PostgreSQL..."
        su - postgres -c "$PG_BIN/initdb -D $PGDATA"
        log "Cluster inicializado."
    else
        log "Cluster ya existente, omitiendo initdb."
    fi
}

# =============================================
# Configurar acceso remoto
# =============================================
configurar_acceso() {
    echo "host all all 0.0.0.0/0 md5"   >> "$PGDATA/pg_hba.conf"
    echo "listen_addresses='*'"           >> "$PGDATA/postgresql.conf"
    echo "port=$PG_PORT"                  >> "$PGDATA/postgresql.conf"
    log "Acceso remoto configurado (puerto $PG_PORT)."
}

# =============================================
# Crear usuario y base de datos
# =============================================
crear_usuario_y_bd() {
    log "Arrancando PostgreSQL temporalmente para configuración..."
    su - postgres -c "$PG_BIN/pg_ctl -D $PGDATA start -w -l /var/lib/postgresql/logfile"

    su - postgres -c "psql -c \"ALTER USER $PG_USER WITH PASSWORD '$PG_PASSWORD';\"" \
        || log "ADVERTENCIA: Falló alter user"
    log "Contraseña del usuario '$PG_USER' configurada."

    su - postgres -c "psql -tc \"SELECT 1 FROM pg_database WHERE datname='$PG_DATABASE'\"" \
        | grep -q 1 \
        || su - postgres -c "psql -c \"CREATE DATABASE $PG_DATABASE OWNER $PG_USER;\"" \
        || log "ADVERTENCIA: Falló crear BD"
    log "Base de datos '$PG_DATABASE' creada/verificada."

    su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE $PG_DATABASE TO $PG_USER;\"" \
        || log "ADVERTENCIA: Falló grant"
    log "Privilegios otorgados a '$PG_USER' sobre '$PG_DATABASE'."

    su - postgres -c "$PG_BIN/pg_ctl -D $PGDATA stop -w"
    log "Configuración completada."
}

# =============================================
# Main
# =============================================
main() {
    mkdir -p "$LOG_DIR"
    touch "$LOG_FILE"

    log "=== Iniciando PostgreSQL ==="
    log "Usuario: $PG_USER | BD: $PG_DATABASE | Puerto: $PG_PORT"

    load_entrypoint_ciber
    inicializar_cluster
    configurar_acceso
    crear_usuario_y_bd

    log "=== Arrancando PostgreSQL en primer plano... ==="
    exec su - postgres -c "$PG_BIN/postgres -D $PGDATA"
}

main