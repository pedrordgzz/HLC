FROM peedroorgzz/nginx

RUN apt install -yq --no-install-recommends \
    nodejs \
    npm

RUN mkdir -p /root/admin/node
RUN mkdir -p /root/admin/node/proyectos/${PROYECTO}
WORKDIR /root/admin/node
COPY ./proyectos/${PROYECTO}/ /root/admin/node/proyectos/${PROYECTO}

COPY ./dockerfiles/node/admin/start.sh .
RUN chmod +x /root/admin/node/start.sh

ENTRYPOINT [ "./start.sh" ]