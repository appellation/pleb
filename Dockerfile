FROM alpine:3.6

WORKDIR /usr/src/pleb
COPY package.json yarn.lock ./

RUN apk add --update \
    && apk add --no-cache --virtual .deps nodejs-current yarn curl \
  	&& apk add --no-cache --virtual .build-deps git build-base g++ \
  	&& apk add --no-cache --virtual .npm-deps pango pangomm-dev pangomm \
         cairo-dev libjpeg-turbo-dev pango opus ffmpeg pixman

COPY . .

RUN yarn install \
    && apk del .build-deps

CMD [ "node", "src/index.js" ]
