FROM node:latest
RUN npm install
CMD ["node", "src/shard.js"]
