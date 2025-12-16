#!/bin/bash
echo "   INFORME DE CIBERSEGURIDAD AUTOMATIZADO" >> $REPORT_FILE
echo "   Fecha: $(date)" >> $REPORT_FILE

echo "[+] Iniciando Fase 1: Mapeo de Puertos (Nmap)..."
echo -e "\n--- RESULTADOS NMAP ---" >> $REPORT_FILE
nmap -Pn -sV ubbase >> $REPORT_FILE
echo "   AUDITORÍA FINALIZADA" >> $REPORT_FILE

echo "[OK] Reporte generado en $REPORT_FILE"

tail -f /dev/null