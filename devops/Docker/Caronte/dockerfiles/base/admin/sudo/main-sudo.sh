#!/bin/bash
set -e
configurar-sudo() {
   usermod -aG sudo $USUARIO
}
