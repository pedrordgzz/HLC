#!/bin/bash
configurar-ssh() {
    sed -i 's/#Port 22/Port '$PORT_SSH'/' /etc/ssh/sshd_config
    sed -i 's/#PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
    mkdir /home/${USUARIO}/.ssh/authorized_keys
    service ssh restart
    #exec /usr/sbin/sshd -D &
}

#!/bin/bash
configurar-sudo() {
    if [ -f /etc/sudoers ]; then
        echo "$USUARIO ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
    fi
}
