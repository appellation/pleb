FROM node:8-alpine

WORKDIR /usr/src/core
COPY package.json .

RUN npm i
EXPOSE 3000

CMD ["npm", "start"]
