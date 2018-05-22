'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const routes = require('./api/routes/Routes'); // importing route
routes(app); // register the route

app.listen(port, function() {
    console.log('API server started on: ' + port);
});


// Import the mongoose module
const mongoose = require('mongoose');

// Set up default mongoose connection
const mongoDB = 'mongodb://mongo/natetest';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// Define a schema
const Schema = mongoose.Schema;

const SomeModelSchema = new Schema({
    a_string: String,
    a_date: Date,
});

// Compile model from schema
const SomeModel = mongoose.model('SomeModel', SomeModelSchema );

// Create an instance of model SomeModel
const awesomeInstance = new SomeModel({ name: 'awesome' });

// Save the new model instance, passing a callback
awesomeInstance.save(function(err) {
  if (err) return handleError(err);
  console.log('Saved!');
  // saved!
});
