'use strict';

const CollectionResponse = require('../models/CollectionResponse');
const helpers = require('../helpers/RequestHelpers.js');

exports.getAllStarships = async function(req, res) {
    const starships = await helpers.getCollection('https://swapi.co/api/starships/?page=1');
    if (starships.length != 0) {
        res.json(new CollectionResponse(starships));
    } else {
        res.status(404).send('Error');
    }
};

exports.getFilteredStarships = async function(req, res) {
    let starships = await helpers.getCollection('https://swapi.co/api/starships/?page=1');
    starships = helpers.filterCollection(starships, req.query);
    if (starships.length != 0) {
        res.json(new CollectionResponse(starships));
    } else {
        res.status(404).send('No starships found.');
    }
};