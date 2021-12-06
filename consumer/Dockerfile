FROM node:current-buster

WORKDIR /consumer
ADD package.json /consumer
RUN npm install
COPY . .
#CMD node server.js
CMD npm run prod
