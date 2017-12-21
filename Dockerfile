FROM node:latest

COPY . ./backend

WORKDIR /backend

RUN npm install

CMD node ./app.js
