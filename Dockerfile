FROM node:latest
RUN npm install pm2 -g
RUN npm install express --save