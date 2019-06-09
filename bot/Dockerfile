FROM node:12-alpine

WORKDIR /usr/src/bot
COPY package.json package-lock.json ./

RUN apk update && apk upgrade \
    && apk add --no-cache --virtual .build-deps git build-base python g++ \
    && apk add --no-cache --virtual .npm-deps pango pangomm-dev pangomm \
       cairo-dev libjpeg-turbo-dev pango opus ffmpeg pixman
RUN npm i \
    && apk del .build-deps

COPY . .

CMD [ "node", "src/index.js" ]
