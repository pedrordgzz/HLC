#!/bin/bash
set -e

# Definimos la ubicación por defecto si la variable no viene del env
REPORT_FILE=${REPORT_FILE:-/output/auditoria_completa.txt}

auditoria(){
    echo "   INFORME DE CIBERSEGURIDAD AUTOMATIZADO" > "$REPORT_FILE" # > Sobrescribe, >> Añade
    echo "   Fecha: $(date)" >> "$REPORT_FILE"
    echo "[+] Iniciando Fase 1: Mapeo de Puertos (Nmap)..."
    
    echo -e "\n--- RESULTADOS NMAP (Localhost) ---" >> "$REPORT_FILE"
    # Escaneamos localhost para ver qué puertos tiene abiertos este contenedor
    nmap -Pn -sV 127.0.0.1 >> "$REPORT_FILE"
    
    echo "   AUDITORÍA FINALIZADA" >> "$REPORT_FILE"
    echo "[OK] Reporte generado en $REPORT_FILE"
}

load_entrypoint_base(){
    echo "[+] Iniciando servicios base..."
    # Usamos exec para que el proceso base tome el PID 1 al final
    # O simplemente lo llamamos si sabemos que se queda en foreground.
    bash /root/admin/base/start.sh
}

main(){
 # 1. Ejecutamos la auditoría PRIMERO
 auditoria
 
 # 2. LUEGO cargamos el servicio base que dejará el contenedor corriendo
 load_entrypoint_base
}

main