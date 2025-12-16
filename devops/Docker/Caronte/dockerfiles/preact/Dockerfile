FROM peedroorgzz/nodjs

ARG PROYECTO

RUN mkdir -p /root/admin/pokeapi
WORKDIR /root/admin/pokeapi
COPY ./dockerfiles/pokeapi/admin/start.sh .
RUN chmod +x ./start.sh

EXPOSE 3000 

ENTRYPOINT ["./start.sh"]
