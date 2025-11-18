#!/bin/bash
set -e
configurar-sudo() {
   usermod -aG sudoers $USUARIO
}
