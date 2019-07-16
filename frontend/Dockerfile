FROM node:carbon
WORKDIR /app
COPY build ./build

RUN npm init -f
RUN npm i serve
CMD ["npx", "serve", "-s", "build"]
