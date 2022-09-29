FROM node:16-alpine3.13 as base-node-modules

WORKDIR /usr/src/build

RUN apk update \
    && apk add openssl

ARG BUILD_ENV=prod
ARG PERSONAL_ACCESS_TOKEN=${PERSONAL_ACCESS_TOKEN}

COPY ./ ./
COPY ./${BUILD_ENV}.env ./.env

RUN apk --no-cache add git
RUN git submodule update --init --recursive

RUN yarn cache clean
RUN yarn install
RUN rm -f .npmrc
RUN yarn build

FROM node:16-alpine3.13

RUN npm install -g http-server

RUN apk update \
    && apk add openssl

ARG BUILD_ENV=prod

WORKDIR /usr/src/app
COPY --from=base-node-modules /usr/src/build ./
COPY ./${BUILD_ENV}.env ./.env

# Make build footprint version for easier debugging.
RUN rm ./version.txt
RUN openssl rand -hex 12 > version.txt

EXPOSE 8080
CMD [ "http-server", "--port", "8080",  "dist" ]