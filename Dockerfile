FROM node:16-alpine as builder

WORKDIR /build
COPY . .

RUN npm ci
RUN npm run build

FROM node:16-alpine

WORKDIR /stock-printer-proxy-source
COPY package.json package-lock.json ./
ENV NODE_ENV production
RUN npm ci
RUN mkdir lib
COPY --from=builder /build/lib ./lib


CMD ["node", "lib/server.js"]
