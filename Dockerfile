FROM node

# Create app directory
WORKDIR /usr/src/app

RUN npm install
RUN npm install nodemon -g

EXPOSE 3000

CMD [ "nodemon", "--verbose", "-L", "server.js" ]
