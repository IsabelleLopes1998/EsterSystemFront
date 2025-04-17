FROM registry.access.redhat.com/ubi8/nodejs-18 AS compile
ENV NPM_MIRROR http://nexus.ic.sefaz.ce.gov.br/repository/npm-group/
ARG ambiente
USER 0
WORKDIR /usr/src
COPY . /usr/src
RUN npm cache clean --force
RUN npm config set proxy http://172.30.192.65:9090/
RUN npm i --force && npm run ${BUILD_PARAM} 


FROM registry.access.redhat.com/ubi8/nginx-118:1-103
WORKDIR /usr/src
COPY . /usr/src
COPY --from=compile /usr/src/dist /opt/app-root/src/
COPY docker-entrypoint.sh /
COPY ./default.conf.template /etc/nginx/default.conf.template
USER root
ENV NGINX_VERSION=1.18
ENTRYPOINT ["sh", "/docker-entrypoint.sh"]
RUN chmod 777 /etc/nginx/default.conf.template
CMD nginx -g "daemon off;"
EXPOSE 8080

