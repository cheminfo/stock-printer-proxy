FROM node:14-alpine

WORKDIR /stock-printer-proxy-source

COPY . .
ENV NODE_ENV production
RUN npm ci


CMD ["node", "src/server.js", "--config=config.yml"]
