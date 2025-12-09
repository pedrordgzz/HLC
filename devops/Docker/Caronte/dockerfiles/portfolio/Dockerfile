FROM peedroorgzz/nginx

USER root

WORKDIR /root/admin/base/portfolio
COPY ./proyecto/miportfolio/src/ /usr/share/nginx/html
COPY ./proyecto/miportfolio/src/ /var/www/html
COPY ./dockerfiles/miportfolio/admin/start.sh /root/admin/base/portfolio/start.sh
RUN chmod +x /root/admin/base/portfolio/start.sh

ENTRYPOINT [ "/root/admin/base/portfolio/start.sh" ]