#!/bin/bash
set -e
auditoria(){
    echo "   INFORME DE CIBERSEGURIDAD AUTOMATIZADO" > "$REPORT_FILE" 
    echo "   Fecha: $(date)" >> "$REPORT_FILE"
    echo "[+] Iniciando Fase 1: Mapeo de Puertos (Nmap)..."

    echo -e "\n--- RESULTADOS NMAP (Localhost) ---" >> "$REPORT_FILE"
    nmap -Pn -sV http://194.163.138.9/ >> "$REPORT_FILE"
    
    echo "   AUDITORÍA FINALIZADA" >> "$REPORT_FILE"
    echo "[OK] Reporte generado en $REPORT_FILE"
}

load_entrypoint_base(){
    echo "[+] Iniciando servicios base..."
    bash /root/admin/base/start.sh
}

main(){
 auditoria
 load_entrypoint_base
}

main