FROM node:23-alpine

WORKDIR /usr/src/app

COPY app/package*.json ./

RUN npm i && chown -R node:node /usr/src/app/node_modules

COPY app/* .

EXPOSE 3000

# CMD [ "tail", "-f", "/dev/null"]