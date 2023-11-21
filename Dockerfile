FROM node:18-alpine as base-node-modules

WORKDIR /usr/src/build

RUN apk update \
    && apk add openssl

ARG BUILD_ENV
COPY ./ ./
COPY ./${BUILD_ENV}.env ./.env

# Make build footprint version for easier debugging.
RUN rm ./version.txt
RUN openssl rand -hex 12 > version.txt

RUN apk --no-cache add git
RUN git submodule update --init --recursive

RUN npm install
RUN npm install -g http-server
RUN npm run build

EXPOSE 8080
CMD [ "http-server", "--port", "8080",  "dist" ]