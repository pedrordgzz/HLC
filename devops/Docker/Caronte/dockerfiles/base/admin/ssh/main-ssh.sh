#!/bin/bash

configurar-ssh() {
    sed -i 's/#Port 22/Port 45678/' /etc/ssh/sshd_config
    sed -i 's/#PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
    service ssh restart
}