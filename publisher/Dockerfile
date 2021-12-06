FROM node:current-buster
WORKDIR /publisher
COPY package.json /publisher
RUN npm install
COPY . .
#CMD node server.js
CMD npm run prod
