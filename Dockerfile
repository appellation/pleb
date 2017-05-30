FROM alpine:3.6

WORKDIR /usr/src/pleb
COPY package.json ./

RUN apk add --update \
    && apk add --no-cache ffmpeg opus pango pixman cairo giflib nodejs-current nodejs-npm \
    && apk add --no-cache --virtual .build pixman-dev git curl libjpeg-turbo-dev cairo-dev giflib-dev g++ make python autoconf \
    && npm install \
    && apk del .build

COPY . .

CMD [ "node", "src/index.js" ]