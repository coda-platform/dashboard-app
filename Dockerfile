FROM node:18-alpine as base-node-modules

WORKDIR /usr/src/build

RUN apk update \
    && apk add openssl

COPY ./ ./

RUN apk --no-cache add git
RUN git submodule update --init --recursive

ARG CODA_DASHBOARD_API_URL=${CODA_DASHBOARD_API_URL}
ARG CODA_DASHBOARD_APP_AUTH_REALM=${CODA_DASHBOARD_APP_AUTH_REALM}
ARG CODA_DASHBOARD_APP_AUTH_CLIENT_ID=${CODA_DASHBOARD_APP_AUTH_CLIENT_ID}
ARG CODA_AUTH_SERVICE_URL=${CODA_AUTH_SERVICE_URL}

ENV CODA_DASHBOARD_API_URL=${CODA_DASHBOARD_API_URL}
ENV CODA_DASHBOARD_APP_AUTH_REALM=${CODA_DASHBOARD_APP_AUTH_REALM}
ENV CODA_DASHBOARD_APP_AUTH_CLIENT_ID=${CODA_DASHBOARD_APP_AUTH_CLIENT_ID}
ENV CODA_AUTH_SERVICE_URL=${CODA_AUTH_SERVICE_URL}

RUN touch .env
RUN echo "VITE_CODA_DASHBOARD_API_URL=${CODA_DASHBOARD_API_URL}\n" > .env
RUN echo "VITE_CODA_DASHBOARD_APP_AUTH_REALM=${CODA_DASHBOARD_APP_AUTH_REALM}\n" > .env
RUN echo "VITE_CODA_DASHBOARD_APP_AUTH_CLIENT_ID=${CODA_DASHBOARD_APP_AUTH_CLIENT_ID}\n" > .env
RUN echo "VITE_CODA_AUTH_SERVICE_URL=${CODA_AUTH_SERVICE_URL}" >> .env
RUN cat .env

RUN npm install
RUN npm run build

FROM node:18-alpine
RUN npm install -g http-server

RUN apk update \
    && apk add openssl

WORKDIR /usr/src/app
COPY --from=base-node-modules /usr/src/build ./

# Make build footprint version for easier debugging.
RUN rm ./version.txt
RUN openssl rand -hex 12 > version.txt

EXPOSE 8080
CMD [ "http-server", "--port", "8080",  "dist" ]