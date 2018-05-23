'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

const mongoDB = 'mongodb://mongo/nodeapi';

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const routes = require('./api/routes/Routes'); // importing route
routes(app); // register the route

mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
// Get the default connection
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  app.listen(port, function() {
    console.log('API server started on: ' + port);
  });
});
