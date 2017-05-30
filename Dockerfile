FROM alpine:3.6

WORKDIR /usr/src/pleb
COPY package.json ./

RUN apk add --update \
    && apk add --no-cache ffmpeg opus cairo giflib nodejs-current \
    && apk add --nocache --virtual .build pixman-dev git curl libjpeg-turbo-dev cairo-dev giflib-dev g++ make python \
    && npm install \
    && apk del .build

COPY . .

CMD [ "node", "src/index.js" ]