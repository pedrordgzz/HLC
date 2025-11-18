#!/bin/bash
set -e
configurar-sudo() {
   usermod -g sudo $USUARIO
}
