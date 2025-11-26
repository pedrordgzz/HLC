#!/bin/bash

configurar-ssh() {
    sed -i "s/#Port 22/Port $PORT_SSH/" /etc/ssh/sshd_config
    sed -i 's/#PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config

    if [ ! -d "/home/$USUARIO/.ssh" ]; then
        mkdir -p "/home/$USUARIO/.ssh"
        if [ -f /root/admin/common/id_ed25519.pub ]; then
            cat /root/admin/common/id_ed25519.pub > "/home/$USUARIO/.ssh/authorized_keys"
        fi
        chmod 700 "/home/$USUARIO/.ssh"
        chmod 600 "/home/$USUARIO/.ssh/authorized_keys"
        chown -R "$USUARIO:$USUARIO" "/home/$USUARIO/.ssh"
    fi
    exec /usr/sbin/sshd  -D &
}

configurar-sudo() {
    if [ -f /etc/sudoers ]; then
        if ! grep -q "$USUARIO ALL=(ALL) NOPASSWD:ALL" /etc/sudoers; then
            echo "$USUARIO ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
        fi
    fi
}