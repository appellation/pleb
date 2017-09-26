FROM node:8-alpine

WORKDIR /usr/src/bot
COPY package.json ./

RUN apk add --update \
    # && apk add --no-cache curl \
  	&& apk add --no-cache --virtual .build-deps git build-base g++ \
  	&& apk add --no-cache --virtual .npm-deps pango pangomm-dev pangomm \
       cairo-dev libjpeg-turbo-dev pango opus ffmpeg pixman \
    && npm install \
    && apk del .build-deps

COPY . .

CMD [ "node", "src/index.js" ]
