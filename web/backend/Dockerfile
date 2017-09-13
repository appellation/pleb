FROM alpine:edge

WORKDIR /usr/src/pleb/web/backend
COPY package.json ./

RUN apk add --update \
    && apk add --no-cache nodejs-current yarn curl \
    && yarn install

COPY . .

EXPOSE 8080:8080
ENV port 8080

CMD [ "node", "src/index.js" ]
