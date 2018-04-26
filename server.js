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
