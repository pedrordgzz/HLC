#!/bin/bash
set -e

auditoria(){
    # Esto significa: Usa $IP, pero si está vacía, usa 127.0.0.1
    local OBJETIVO="${IP:-127.0.0.1}"

    echo "   INFORME DE CIBERSEGURIDAD AUTOMATIZADO" > "$REPORT_FILE" 
    echo "   Fecha: $(date)" >> "$REPORT_FILE"
    echo "   Analizando IP: $OBJETIVO" >> "$REPORT_FILE"
    echo "[+] Iniciando Fase 1: Mapeo de Puertos (Nmap)..."

    # Espera para que arranquen los servicios
    sleep 10

    echo -e "\n--- RESULTADOS NMAP ---" >> "$REPORT_FILE"
    
    nmap -Pn -sV "$OBJETIVO" >> "$REPORT_FILE"
    
    echo "   AUDITORÍA FINALIZADA" >> "$REPORT_FILE"
    echo "[OK] Reporte generado en $REPORT_FILE"
}

load_entrypoint_base(){
    bash /root/admin/base/start.sh &
}

main(){
 load_entrypoint_base
 auditoria
}

main