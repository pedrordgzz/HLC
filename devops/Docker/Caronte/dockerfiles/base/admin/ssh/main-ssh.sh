#!/bin/bash
configurar-ssh() {
    sed -i 's/#Port 22/Port '$PORT_SSH'/' /etc/ssh/sshd_config
    sed -i 's/#PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config

    if [ ! -d /home/$USUARIO/.ssh]
    then
    mkdir /home/$USUARIO/.ssh
    #cp /root/admin/common/* /home/$USUARIO/.ssh/
    cat /root/admin/common/id_ed25519.pub > /home/$USUARIO/.ssh/authorized_keys
    fi

    exec /usr/sbin/sshd -D 

}


configurar-sudo() {
    if [ -f /etc/sudoers ]; then
        echo "$USUARIO ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
    fi
}