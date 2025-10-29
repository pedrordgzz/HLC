FROM ubuntu
ARG USUARIO
RUN apt update && apt install -yq --no-install-recommends \ 
    nano \
    git curl \
    net-tools iputils-ping \
    sudo

RUN useradd -rm -d /home/${USUARIO} -s /bin/bash ${USUARIO}
RUN echo "${USUARIO}:1234" | chpasswd 
RUN echo "Bienvenido a la empresa, ${USUARIO}" > /home/${USUARIO}/hola.txt

