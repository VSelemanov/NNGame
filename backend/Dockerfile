FROM node:8 AS build-env

ARG SSH_KEY

WORKDIR /usr/src/app
COPY package.json ./

RUN npm install --production

FROM gcr.io/distroless/nodejs
COPY --from=build-env /usr/src/app /app
WORKDIR /app
ADD ./dist ./dist
ENV NODE_PATH ./dist
CMD [ "./dist/src/index.js"]
