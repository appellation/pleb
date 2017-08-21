FROM alpine:3.6

WORKDIR /usr/src/web/frontend
COPY package.json ./

RUN apk add --update \
    && apk add --no-cache nodejs-current yarn curl \
    && yarn install

COPY . .
CMD ["yarn", "run", "start"]
