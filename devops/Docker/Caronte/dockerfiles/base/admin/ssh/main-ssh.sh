#!/bin/bash

configurar-ssh() {
    sed -i 's/#Port 22/Port ${PORT-SSH}/' /etc/ssh/sshd_config
    sed -i 's/#PermitRootLogin.*/PermitRootLogin ${LOGIN}/' 
    service ssh restart
}