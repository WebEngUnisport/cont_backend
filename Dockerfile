FROM node:latest

COPY ./serv ./backend

WORKDIR /backend

RUN npm install

CMD node ./serv.js
