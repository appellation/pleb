FROM node:8-alpine

WORKDIR /usr/src/bot
COPY package.json ./

RUN apk update && apk upgrade \
    && apk add --update tar \
    && apk add --no-cache curl \
  	&& apk add --no-cache --virtual .build-deps git build-base g++ \
  	&& apk add --no-cache --virtual .npm-deps pango pangomm-dev pangomm \
       cairo-dev libjpeg-turbo-dev pango opus ffmpeg pixman
RUN cd /usr/local/lib/node_modules \
    && mv npm /tmp \
    && curl -L registry.npmjs.com/npm/-/npm-5.4.1.tgz | tar -xz --xform="s:^package:npm:" \
    && cd /usr/src/bot
RUN npm i \
    && apk del .build-deps

COPY . .

CMD [ "node", "src/index.js" ]
