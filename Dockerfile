FROM node:latest
RUN npm install mongodb -g
RUN npm install express -g

COPY ./serv ./backend

CMD node ./backend/serv.js
