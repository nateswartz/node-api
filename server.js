'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

const PersonModel = require('./api/schemas/PersonSchema');

const mongoDB = 'mongodb://mongo/natetest';

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
  writeTestData();
});

function writeTestData() {
    // Create an instance of model SomeModel
    const personInstance = new PersonModel({name: 'Darth', height: 32});

    // Save the new model instance, passing a callback
    personInstance.save(function(err) {
        if (err) return handleError(err);
        console.log('Saved!');
        PersonModel.find({'name': 'Leia'}, 'height', function(err, results) {
            if (err) return handleError(err);
            console.log('Got records: ');
            console.log(results);
            });
    });
};
