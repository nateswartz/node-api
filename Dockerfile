FROM node

# Create app directory
WORKDIR /usr/src/app

RUN npm install

EXPOSE 3000

CMD [ "node", "server.js" ]
