#!/bin/bash
set -e
configurar-sudo() {
    sed -i 's/%sudo\s\+ALL=(ALL:ALL)\s\+ALL/%sudo ${USUARIO}=(ALL:ALL) NOPASSWD:ALL/' /etc/sudoers
}
