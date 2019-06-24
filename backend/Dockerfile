FROM node:8 AS build-env

ARG SSH_KEY

WORKDIR /usr/src/app
COPY package.json ./

RUN mkdir -p /root/.ssh/ && \
    echo "$SSH_KEY" > /root/.ssh/id_rsa && \
    chmod -R 600 /root/.ssh/ && \
    ssh-keyscan -p 2222 -t rsa glab.lad24.ru >> ~/.ssh/known_hosts


RUN npm install --production

FROM gcr.io/distroless/nodejs
COPY --from=build-env /usr/src/app /app
WORKDIR /app
ADD ./dist ./dist
ADD ./src/helper/CIMS/*.xlsx ./dist/modules/esb/app/src/helper/CIMS/
# ADD ./frontend/settings/build ./dist/modules/nomenclature/app/frontend/settings/build
ENV NODE_PATH ./dist
CMD [ "./dist/modules/esb/app/src/index.js"]
