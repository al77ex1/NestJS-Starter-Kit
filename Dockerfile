FROM node:lts-alpine

RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

RUN mkdir -p /usr/src/nest && chown -R node:node /usr/src/nest

WORKDIR /usr/src/nest

COPY package.json yarn.lock ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 3000
