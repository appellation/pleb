FROM ubuntu:16.04

RUN apt-get update \
&& apt-get install -y libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++ \
&& curl -sL https://deb.nodesource.com/setup_7.x | bash - \
&& apt-get install -y nodejs git
RUN apt-get install -y ffmpeg

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot
COPY . .

RUN npm install
CMD ["node", "src/index.js"]
