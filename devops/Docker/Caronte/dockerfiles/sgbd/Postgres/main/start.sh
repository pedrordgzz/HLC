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
# =============================================
load_entrypoint_ciber() {
    export REPORT_FILE="${REPORT_FILE:-/dev/null}"
    bash /root/admin/ciber/start.sh &
}

# =============================================
# Detectar PG_BIN y PGDATA en tiempo real
# =============================================
detect_pg_vars() {
    local PG_VER
    PG_VER=$(ls /usr/lib/postgresql/ | sort -V | tail -1)
    PG_BIN=/usr/lib/postgresql/${PG_VER}/bin
    PGDATA=/var/lib/postgresql/${PG_VER}/main
    log "PostgreSQL v${PG_VER} | BIN=$PG_BIN | DATA=$PGDATA"
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
# Configurar acceso
# Sobreescribimos pg_hba.conf directamente
# (más fiable que sed en Ubuntu 24.04)
# =============================================
configurar_acceso() {
    # Buscar el pg_hba.conf real (Ubuntu: /etc/postgresql/{ver}/main/)
    local HBA
    HBA=$(find /etc/postgresql -name "pg_hba.conf" 2>/dev/null | head -1)
    [ -z "$HBA" ] && HBA="$PGDATA/pg_hba.conf"

    log "Configurando $HBA ..."

    # Sobreescribir con config limpia: trust local + md5 remoto
    cat > "$HBA" << 'EOF'
# TYPE  DATABASE  USER  ADDRESS          METHOD
local   all       all                    trust
host    all       all   0.0.0.0/0        md5
host    all       all   ::1/128          md5
EOF

    # Crear pg_ident.conf vacío si no existe (evita el warning)
    local IDENT
    IDENT=$(find /etc/postgresql -name "pg_ident.conf" 2>/dev/null | head -1)
    [ -z "$IDENT" ] && touch "$PGDATA/pg_ident.conf"

    # Buscar el postgresql.conf real y configurar escucha/puerto
    local CONF
    CONF=$(find /etc/postgresql -name "postgresql.conf" 2>/dev/null | head -1)
    [ -z "$CONF" ] && CONF="$PGDATA/postgresql.conf"

    grep -q "^listen_addresses" "$CONF" \
        || echo "listen_addresses='*'" >> "$CONF"
    grep -q "^port" "$CONF" \
        || echo "port=$PG_PORT"         >> "$CONF"

    log "Acceso configurado. HBA: $HBA | CONF: $CONF"
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
    detect_pg_vars
    inicializar_cluster
    configurar_acceso
    crear_usuario_y_bd

    log "=== Arrancando PostgreSQL en primer plano... ==="
    exec su - postgres -c "$PG_BIN/postgres -D $PGDATA"
}

main