FROM peedroorgzz/nodejs

ARG PROYECTO

RUN mkdir -p /root/admin/pokeapi/
WORKDIR /root/admin/pokeapi
COPY ./dockerfiles/preact/admin/start.sh .
RUN chmod +x ./start.sh

EXPOSE 3000 

ENTRYPOINT ["bash /root/admin/pokeapi/start.sh"]
