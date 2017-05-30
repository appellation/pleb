FROM alpine:3.6

WORKDIR /usr/src/pleb
COPY package.json yarn.lock ./

RUN apk add --update \
    && apk add --no-cache ffmpeg opus cairo giflib nodejs-current nodejs-npm \
    && apk add --no-cache --virtual .build pixman-dev git curl libjpeg-turbo-dev cairo-dev giflib-dev g++ make python \
    && npm install \
    && apk del .build

COPY . .

CMD [ "node", "src/index.js" ]